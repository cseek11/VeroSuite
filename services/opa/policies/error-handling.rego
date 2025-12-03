# R07: Error Handling Policy
# Ensures no silent failures, proper error handling, and safe error messages
# Tier: 2 (OVERRIDE REQUIRED)

package compliance.error_handling

import rego.v1

# Default decision
default allow := true

# Collect all violations (convert sets to arrays for concatenation)
violations := array.concat(
	array.concat(
		array.concat(
			[msg | empty_catch_violations[msg]],
			[msg | swallowed_promise_violations[msg]],
		),
		array.concat(
			[msg | missing_await_violations[msg]],
			[msg | console_log_violations[msg]],
		),
	),
	[msg | unlogged_error_violations[msg]],
)

# Collect all warnings (convert set to array)
warnings := [msg | incomplete_error_handling_warnings[msg]]

# Input validation guard
input_valid if {
	is_array(input.changed_files)
}

# Override mechanism
has_override(marker) if {
	is_string(input.pr_body)
	contains(input.pr_body, marker)
}

# Main deny rule - blocks if violations exist and no override
deny[msg] if {
	input_valid
	count(violations) > 0
	not has_override("@override:error-handling")
	msg := sprintf("OVERRIDE REQUIRED [Error/R07]: Found %d error handling violation(s). Add @override:error-handling with justification or fix violations. Violations: %s", [count(violations), concat("; ", violations)])
}

# Warning rule - flags incomplete error handling
warn[msg] if {
	count(warnings) > 0
	msg := sprintf("WARNING [Error/R07]: Found %d incomplete error handling pattern(s). Consider improving: %s", [count(warnings), concat("; ", warnings)])
}

# ============================================================================
# VIOLATION PATTERN 1: Empty Catch Blocks
# ============================================================================

empty_catch_violations[msg] if {
	input_valid
	some file in input.changed_files
	is_code_file(file.path)
	lines := split(file.diff, "\n")
	some line in lines
	startswith(line, "+")

	# Pattern: catch (error) { } or catch { }
	regex.match(`catch\s*\([^)]*\)\s*\{\s*\}`, line)

	msg := sprintf("File %s has empty catch block. Add error logging: 'logger.error(...)' with context, operation, errorCode, rootCause, traceId.", [file.path])
}

empty_catch_violations[msg] if {
	input_valid
	some file in input.changed_files
	is_code_file(file.path)
	lines := split(file.diff, "\n")
	some line in lines
	startswith(line, "+")

	# Pattern: catch block with only comments
	regex.match(`catch\s*\([^)]*\)\s*\{\s*//.*\}`, line)

	msg := sprintf("File %s has catch block with only comments (silent failure). Add error logging and handling.", [file.path])
}

# ============================================================================
# VIOLATION PATTERN 2: Swallowed Promises
# ============================================================================

swallowed_promise_violations[msg] if {
	input_valid
	some file in input.changed_files
	is_code_file(file.path)
	lines := split(file.diff, "\n")
	some line in lines
	startswith(line, "+")

	# Pattern: .catch(() => {}) or .catch(() => { /* empty */ })
	regex.match(`\.catch\s*\(\s*\(\)\s*=>\s*\{\s*\}\s*\)`, line)

	msg := sprintf("File %s has swallowed promise (.catch(() => {})). Add error logging in catch handler.", [file.path])
}

swallowed_promise_violations[msg] if {
	input_valid
	some file in input.changed_files
	is_code_file(file.path)
	lines := split(file.diff, "\n")
	some line in lines
	startswith(line, "+")

	# Pattern: .catch(() => { /* comment only */ })
	regex.match(`\.catch\s*\(\s*\(\)\s*=>\s*\{\s*/\*.*\*/\s*\}\s*\)`, line)

	msg := sprintf("File %s has swallowed promise with only comments. Add error logging.", [file.path])
}

# ============================================================================
# VIOLATION PATTERN 3: Missing Awaits (Heuristic)
# ============================================================================

missing_await_violations[msg] if {
	input_valid
	some file in input.changed_files
	is_code_file(file.path)
	is_async_context(file)
	lines := split(file.diff, "\n")
	some line in lines
	startswith(line, "+")

	# Pattern: Promise-returning functions without await
	# Check for common promise-returning patterns
	has_promise_call(line)
	not has_await(line)
	not is_intentional_fire_and_forget(line)

	msg := sprintf("File %s has potential missing await. Verify promise is awaited or intentionally fire-and-forget.", [file.path])
}

has_promise_call(line) if {
	regex.match(`prisma\.\w+\.`, line)
}

has_promise_call(line) if {
	regex.match(`fetch\s*\(`, line)
}

has_promise_call(line) if {
	regex.match(`axios\.(get|post|put|delete|patch)\s*\(`, line)
}

has_promise_call(line) if {
	regex.match(`\w+Service\.\w+\(`, line)
}

has_await(line) if {
	regex.match(`await\s+`, line)
}

is_intentional_fire_and_forget(line) if {
	regex.match(`void\s+`, line)
}

is_intentional_fire_and_forget(line) if {
	regex.match(`@fire-and-forget`, line)
}

is_async_context(file) if {
	lines := split(file.diff, "\n")
	some line in lines
	regex.match(`async\s+(function|\(|=>)`, line)
}

# ============================================================================
# VIOLATION PATTERN 4: Console.log Instead of Structured Logging
# ============================================================================

console_log_violations[msg] if {
	input_valid
	some file in input.changed_files
	is_code_file(file.path)
	lines := split(file.diff, "\n")
	some line in lines
	startswith(line, "+")

	# Pattern: console.log/error/warn in catch blocks
	regex.match(`console\.(log|error|warn|info|debug)\s*\(`, line)

	# Check if in catch block context (heuristic: within 5 lines of catch)
	is_in_catch_context(file, line)

	msg := sprintf("File %s uses console.log/error instead of structured logging. Use logger.error() with context, operation, errorCode, rootCause, traceId.", [file.path])
}

is_in_catch_context(file, _) if {
	lines := split(file.diff, "\n")
	some line in lines
	regex.match(`catch\s*\(`, line)
	# Simplified: If file has catch blocks, flag console.log
	# Full implementation would track line numbers
}

# ============================================================================
# VIOLATION PATTERN 5: Unlogged Errors
# ============================================================================

unlogged_error_violations[msg] if {
	input_valid
	some file in input.changed_files
	is_code_file(file.path)
	lines := split(file.diff, "\n")
	some line in lines
	startswith(line, "+")

	# Pattern: throw new Error without prior logging
	regex.match(`throw\s+new\s+\w*Error`, line)
	not has_logging_before_throw(file, line)

	msg := sprintf("File %s throws error without logging. Add logger.error() before throw with context, operation, errorCode, rootCause, traceId.", [file.path])
}

has_logging_before_throw(file, _) if {
	lines := split(file.diff, "\n")
	some line in lines
	regex.match(`logger\.(error|warn)\s*\(`, line)
	# Simplified: If file has logger calls, assume logging exists
	# Full implementation would verify logging is before throw
}

# ============================================================================
# WARNING PATTERN 1: Incomplete Error Handling
# ============================================================================

incomplete_error_handling_warnings[msg] if {
	input_valid
	some file in input.changed_files
	is_code_file(file.path)
	lines := split(file.diff, "\n")
	some line in lines
	startswith(line, "+")

	# Pattern: Catch block with logging but no categorization
	regex.match(`catch\s*\([^)]*\)\s*\{`, line)
	has_logging_in_catch(file)
	not has_error_categorization(file)

	msg := sprintf("File %s has error handling but no categorization. Consider categorizing errors (ValidationError → 400, BusinessRuleError → 422, SystemError → 500).", [file.path])
}

has_logging_in_catch(file) if {
	lines := split(file.diff, "\n")
	some line in lines
	regex.match(`logger\.(error|warn)\s*\(`, line)
}

has_error_categorization(file) if {
	lines := split(file.diff, "\n")
	some line in lines
	regex.match(`instanceof\s+\w+Error`, line)
}

has_error_categorization(file) if {
	lines := split(file.diff, "\n")
	some line in lines
	regex.match(`(BadRequestException|UnprocessableEntityException|InternalServerErrorException)`, line)
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

# Removed: Use built-in startswith() instead per Rego/OPA Bible 6.7
