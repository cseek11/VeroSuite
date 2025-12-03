# R08: Structured Logging Policy
# R09: Trace Propagation Policy
# Ensures all logs are structured with required fields including traceId
# Ensures traceId propagates across all service boundaries
# Tier: 2 (OVERRIDE REQUIRED)

package compliance.observability

import rego.v1

# Input validation guard
input_valid if {
	is_array(input.changed_files)
}

# Default decision
default allow := true

# Collect all violations (R08 + R09) - convert sets to arrays for concatenation
violations := array.concat(
	array.concat(
		array.concat(
			array.concat(
				[msg | console_log_violations[msg]],
				[msg | unstructured_logging_violations[msg]],
			),
			array.concat(
				[msg | missing_required_fields_violations[msg]],
				[msg | missing_trace_id_violations[msg]],
			),
		),
		[msg | missing_context_operation_violations[msg]],
	),
	array.concat(
		array.concat(
			array.concat(
				[msg | missing_http_trace_violations[msg]],
				[msg | missing_service_trace_violations[msg]],
			),
			[msg | missing_db_trace_violations[msg]],
		),
		array.concat(
			[msg | missing_external_trace_violations[msg]],
			[msg | missing_mq_trace_violations[msg]],
		),
	),
)

# Collect all warnings (R08 + R09)
# Collect all warnings (convert sets to arrays)
warnings := array.concat(
	[msg | incomplete_logging_warnings[msg]],
	[msg | incomplete_trace_propagation_warnings[msg]],
)

# Override mechanism
has_override(marker) if {
	is_string(input.pr_body)
	contains(input.pr_body, marker)
}

# Main deny rule - blocks if violations exist and no override
deny[msg] if {
	input_valid
	count(violations) > 0
	not has_override("@override:structured-logging")
	msg := sprintf("OVERRIDE REQUIRED [Observability/R08]: Found %d structured logging violation(s). Add @override:structured-logging with justification or fix violations. Violations: %s", [count(violations), concat("; ", violations)])
}

# Warning rule - flags incomplete logging
warn[msg] if {
	count(warnings) > 0
	msg := sprintf("WARNING [Observability/R08]: Found %d incomplete logging pattern(s). Consider improving: %s", [count(warnings), concat("; ", warnings)])
}

# ============================================================================
# VIOLATION PATTERN 1: Console.log in Production Code
# ============================================================================

console_log_violations[msg] if {
	input_valid
	some file in input.changed_files
	is_production_code_file(file.path)
	not is_test_file(file.path)
	not is_script_file(file.path)
	lines := split(file.diff, "\n")
	some line in lines
	startswith(line, "+")

	# Pattern: console.log/error/warn/info/debug
	regex.match(`console\.(log|error|warn|info|debug)\s*\(`, line)

	msg := sprintf("File %s uses console.log/error in production code. Use structured logger (StructuredLoggerService or Logger) with required fields: message, context, operation, traceId.", [file.path])
}

# ============================================================================
# VIOLATION PATTERN 2: Unstructured Free-Text Logging
# ============================================================================

unstructured_logging_violations[msg] if {
	input_valid
	some file in input.changed_files
	is_code_file(file.path)
	lines := split(file.diff, "\n")
	some line in lines
	startswith(line, "+")

	# Pattern: Logger call with only message (no context, operation)
	# This is a simplified check - full implementation would use AST
	regex.match(`logger\.(log|error|warn|info|debug)\s*\(\s*['"][^'"]+['"]\s*\)`, line)

	msg := sprintf("File %s has unstructured logging (message only). Include required fields: context, operation, traceId. Use: logger.log(message, context, requestId, operation, additionalData).", [file.path])
}

# ============================================================================
# VIOLATION PATTERN 3: Missing Required Fields
# ============================================================================

missing_required_fields_violations[msg] if {
	input_valid
	some file in input.changed_files
	is_code_file(file.path)
	lines := split(file.diff, "\n")
	some line in lines
	startswith(line, "+")

	# Pattern: Logger call with fewer than 4 parameters (message, context, requestId, operation)
	# StructuredLoggerService signature: logger.log(message, context, requestId, operation, additionalData?)
	has_logger_call(line)
	not has_minimum_parameters(line)

	msg := sprintf("File %s has logger call with missing required fields. Ensure: message, context, requestId (for traceId), operation are provided.", [file.path])
}

has_logger_call(line) if {
	regex.match(`(this\.)?logger\.(log|error|warn|info|debug)\s*\(`, line)
}

has_minimum_parameters(line) if {
	# Check for at least 4 parameters (simplified - full implementation would count commas)
	# Pattern: logger.log(param1, param2, param3, param4, ...)
	regex.match(`logger\.\w+\([^,]+,[^,]+,[^,]+,[^,]+`, line)
}

# ============================================================================
# VIOLATION PATTERN 4: Missing TraceId
# ============================================================================

missing_trace_id_violations[msg] if {
	input_valid
	some file in input.changed_files
	is_code_file(file.path)
	lines := split(file.diff, "\n")
	some line in lines
	startswith(line, "+")

	# Pattern: Logger call without requestId or traceId parameter
	has_logger_call(line)
	not has_trace_id_source(line)

	msg := sprintf("File %s has logger call without traceId source. Include requestId parameter or use this.requestContext.getTraceId().", [file.path])
}

has_trace_id_source(line) if {
	regex.match(`requestId`, line)
}

has_trace_id_source(line) if {
	regex.match(`traceId`, line)
}

has_trace_id_source(line) if {
	regex.match(`this\.requestContext\.getTraceId\(\)`, line)
}

# ============================================================================
# VIOLATION PATTERN 5: Missing Context or Operation
# ============================================================================

missing_context_operation_violations[msg] if {
	input_valid
	some file in input.changed_files
	is_code_file(file.path)
	lines := split(file.diff, "\n")
	some line in lines
	startswith(line, "+")

	# Pattern: Logger call with undefined/null context or operation
	has_logger_call(line)
	has_undefined_context_or_operation(line)

	msg := sprintf("File %s has logger call with undefined/null context or operation. Provide explicit context (service name) and operation (function name).", [file.path])
}

has_undefined_context_or_operation(line) if {
	regex.match(`logger\.\w+\([^,]+,\s*(undefined|null)`, line)
}

# ============================================================================
# WARNING PATTERN 1: Incomplete Logging
# ============================================================================

incomplete_logging_warnings[msg] if {
	input_valid
	some file in input.changed_files
	is_code_file(file.path)
	lines := split(file.diff, "\n")
	some line in lines
	startswith(line, "+")

	# Pattern: Logger call exists but may be missing optional fields
	has_logger_call(line)
	is_error_log(line)
	not has_error_code_or_root_cause(line)

	msg := sprintf("File %s has error log without errorCode or rootCause. Consider including for better error classification and debugging.", [file.path])
}

is_error_log(line) if {
	regex.match(`logger\.error\s*\(`, line)
}

has_error_code_or_root_cause(line) if {
	regex.match(`errorCode`, line)
}

has_error_code_or_root_cause(line) if {
	regex.match(`rootCause`, line)
}

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

is_code_file(path) if {
	endswith(path, ".ts")
}

is_code_file(path) if {
	endswith(path, ".tsx")
}

is_code_file(path) if {
	endswith(path, ".js")
}

is_code_file(path) if {
	endswith(path, ".jsx")
}

is_production_code_file(path) if {
	is_code_file(path)
	not is_test_file(path)
	not is_script_file(path)
}

is_test_file(path) if {
	contains(path, ".spec.")
}

is_test_file(path) if {
	contains(path, ".test.")
}

is_test_file(path) if {
	contains(path, "/test/")
}

is_test_file(path) if {
	contains(path, "/e2e/")
}

is_script_file(path) if {
	contains(path, "/scripts/")
}

is_script_file(path) if {
	contains(path, "/tools/")
}

is_script_file(path) if {
	endswith(path, "/cli.ts")
}

is_script_file(path) if {
	endswith(path, "/seed.ts")
}

# Removed: Use built-in startswith() instead per Rego/OPA Bible 6.7

# ============================================================================
# R09: TRACE PROPAGATION POLICY
# ============================================================================

# ============================================================================
# VIOLATION PATTERN 1: Missing TraceId in HTTP Headers (Outgoing Calls)
# ============================================================================

missing_http_trace_violations[msg] if {
	input_valid
	some file in input.changed_files
	is_code_file(file.path)
	lines := split(file.diff, "\n")
	some line in lines
	startswith(line, "+")

	# Pattern: HTTP call without traceId in headers
	has_http_call(line)
	not has_trace_headers(line)
	not uses_trace_utility(line)

	msg := sprintf("File %s has HTTP call without traceId in headers. Add x-trace-id, x-span-id, x-request-id headers or use addTraceContextToHeaders() utility.", [file.path])
}

has_http_call(line) if {
	regex.match(`fetch\s*\(`, line)
}

has_http_call(line) if {
	regex.match(`axios\.(get|post|put|delete|patch)\s*\(`, line)
}

has_http_call(line) if {
	regex.match(`this\.httpService\.(get|post|put|delete|patch)\s*\(`, line)
}

has_http_call(line) if {
	regex.match(`http\.(get|post|put|delete|patch)\s*\(`, line)
}

has_trace_headers(line) if {
	regex.match(`['"]x-trace-id['"]`, line)
}

has_trace_headers(line) if {
	regex.match(`['"]x-span-id['"]`, line)
}

has_trace_headers(line) if {
	regex.match(`['"]x-request-id['"]`, line)
}

uses_trace_utility(line) if {
	regex.match(`addTraceContextToHeaders`, line)
}

uses_trace_utility(line) if {
	regex.match(`addTraceHeaders`, line)
}

# ============================================================================
# VIOLATION PATTERN 2: Missing TraceId in Service Method Calls
# ============================================================================

missing_service_trace_violations[msg] if {
	input_valid
	some file in input.changed_files
	is_code_file(file.path)
	lines := split(file.diff, "\n")
	some line in lines
	startswith(line, "+")

	# Pattern: Service call without traceId parameter
	has_service_call(line)
	not has_trace_parameter(line)
	not uses_trace_context_service(line)

	msg := sprintf("File %s has service call without traceId parameter. Pass traceId as parameter or use RequestContextService.", [file.path])
}

has_service_call(line) if {
	regex.match(`(this\.)?[a-z]+Service\.[a-z]+\s*\(`, line)
}

has_service_call(line) if {
	regex.match(`await\s+[a-z]+Service\.[a-z]+\s*\(`, line)
}

has_trace_parameter(line) if {
	regex.match(`traceId`, line)
}

has_trace_parameter(line) if {
	regex.match(`requestId`, line)
}

has_trace_parameter(line) if {
	regex.match(`traceContext`, line)
}

uses_trace_context_service(line) if {
	regex.match(`this\.requestContext\.get(TraceId|TraceContext)\(\)`, line)
}

# ============================================================================
# VIOLATION PATTERN 3: Missing TraceId in Database Query Context
# ============================================================================

missing_db_trace_violations[msg] if {
	input_valid
	some file in input.changed_files
	is_code_file(file.path)
	lines := split(file.diff, "\n")
	some line in lines
	startswith(line, "+")

	# Pattern: Database query without traceId in context
	has_db_query(line)
	not has_trace_context_wrapper(line)
	not has_trace_in_db_context(line)

	msg := sprintf("File %s has database query without traceId in context. Use withTraceContext() wrapper or set app.trace_id in query context.", [file.path])
}

has_db_query(line) if {
	regex.match(`prisma\.[a-z]+\.(findMany|findUnique|create|update|delete)`, line)
}

has_db_query(line) if {
	regex.match(`\$executeRaw`, line)
}

has_db_query(line) if {
	regex.match(`\$queryRaw`, line)
}

has_trace_context_wrapper(line) if {
	regex.match(`withTraceContext\s*\(`, line)
}

has_trace_context_wrapper(line) if {
	regex.match(`withContext\s*\(`, line)
}

has_trace_in_db_context(line) if {
	regex.match(`app\.trace_id`, line)
}

has_trace_in_db_context(line) if {
	regex.match(`SET LOCAL app\.trace_id`, line)
}

# ============================================================================
# VIOLATION PATTERN 4: Missing TraceId in External API Calls
# ============================================================================

missing_external_trace_violations[msg] if {
	input_valid
	some file in input.changed_files
	is_code_file(file.path)
	lines := split(file.diff, "\n")
	some line in lines
	startswith(line, "+")

	# Pattern: External API call without traceId in headers
	has_external_api_call(line)
	not has_trace_headers(line)
	not uses_trace_utility(line)

	msg := sprintf("File %s has external API call without traceId in headers. Add x-trace-id header or use addTraceContextToHeaders() utility.", [file.path])
}

has_external_api_call(line) if {
	# External API calls typically have full URLs (https://)
	has_http_call(line)
	regex.match(`https?://`, line)
}

# ============================================================================
# VIOLATION PATTERN 5: Missing TraceId in Message Queue Messages
# ============================================================================

missing_mq_trace_violations[msg] if {
	input_valid
	some file in input.changed_files
	is_code_file(file.path)
	lines := split(file.diff, "\n")
	some line in lines
	startswith(line, "+")

	# Pattern: Message queue publish without traceId in headers/metadata
	has_mq_publish(line)
	not has_trace_in_mq_headers(line)

	msg := sprintf("File %s has message queue publish without traceId in headers/metadata. Include traceId in message headers or metadata.", [file.path])
}

has_mq_publish(line) if {
	regex.match(`channel\.publish\s*\(`, line)
}

has_mq_publish(line) if {
	regex.match(`producer\.send\s*\(`, line)
}

has_mq_publish(line) if {
	regex.match(`messageQueue\.publish\s*\(`, line)
}

has_trace_in_mq_headers(line) if {
	regex.match(`headers:\s*\{[^}]*trace`, line)
}

has_trace_in_mq_headers(line) if {
	regex.match(`metadata:\s*\{[^}]*trace`, line)
}

# ============================================================================
# WARNING PATTERN 1: Incomplete Trace Propagation
# ============================================================================

incomplete_trace_propagation_warnings[msg] if {
	input_valid
	some file in input.changed_files
	is_code_file(file.path)
	lines := split(file.diff, "\n")
	some line in lines
	startswith(line, "+")

	# Pattern: Trace propagation exists but may be incomplete
	has_http_call(line)
	has_trace_headers(line)
	not has_all_trace_headers(line)

	msg := sprintf("File %s has HTTP call with partial trace headers. Consider including all trace headers: x-trace-id, x-span-id, x-request-id.", [file.path])
}

has_all_trace_headers(line) if {
	regex.match(`x-trace-id`, line)
	regex.match(`x-span-id`, line)
	regex.match(`x-request-id`, line)
}
