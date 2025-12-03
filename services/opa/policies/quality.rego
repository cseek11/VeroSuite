# R10: Testing Coverage Policy
# Ensures all code changes have appropriate test coverage
# Tier: 2 (OVERRIDE REQUIRED)

package compliance.quality

import rego.v1

# Default decision
default allow := true

# Collect all violations (convert sets to arrays for concatenation)
violations := array.concat(
	array.concat(
		array.concat(
			[msg | some msg in missing_unit_tests_violations],
			[msg | some msg in missing_regression_tests_violations],
		),
		[msg | some msg in coverage_below_threshold_violations],
	),
	array.concat(
		[msg | some msg in tests_skipped_violations],
		[msg | some msg in coverage_delta_negative_violations],
	),
)

# Collect all warnings (convert set keys to array)
warnings := [msg | incomplete_test_coverage_warnings[msg]]

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
deny contains msg if {
	input_valid
	count(violations) > 0
	not has_override("@override:test-coverage")
	msg := sprintf("OVERRIDE REQUIRED [Quality/R10]: Found %d test coverage violation(s). Add @override:test-coverage with justification or fix violations. Violations: %s", [count(violations), concat("; ", violations)])
}

# Warning rule - flags incomplete test coverage (R10)
warn contains msg if {
	count(warnings) > 0
	warnings_str := concat("; ", warnings)
	msg := sprintf("WARNING [Quality/R10]: Found %d incomplete test coverage pattern(s). Consider improving: %s", [count(warnings), warnings_str])
}

# Collect all warnings from R16, R17, R18
warn contains msg if {
	some warning in additional_testing_warnings
	msg := warning
}

warn contains msg if {
	some warning in coverage_requirements_warnings
	msg := warning
}

warn contains msg if {
	some warning in performance_budgets_warnings
	msg := warning
}

# ============================================================================
# VIOLATION PATTERN 1: Missing Unit Tests for New Features
# ============================================================================

missing_unit_tests_violations contains msg if {
	input_valid
	some file in input.changed_files
	is_source_file(file.path)
	not is_test_file(file.path)
	file.status == "added" # New file

	# Check if corresponding test file exists
	not has_test_file(file.path, input.changed_files)

	msg := sprintf("File %s is a new source file without a corresponding test file. Add unit tests covering happy path, error paths, and edge cases.", [file.path])
}

missing_unit_tests_violations contains msg if {
	input_valid
	some file in input.changed_files
	is_source_file(file.path)
	not is_test_file(file.path)
	file.status == "modified"

	# Check if file has new functions/classes
	has_new_functions(file)

	# Check if test file was modified (should be if new functions added)
	test_file_path := get_test_file_path(file.path)
	not file_was_modified(test_file_path, input.changed_files)

	msg := sprintf("File %s has new functions/classes but test file was not updated. Add tests for new functionality.", [file.path])
}

# ============================================================================
# VIOLATION PATTERN 2: Missing Regression Tests for Bug Fixes
# ============================================================================

missing_regression_tests_violations contains msg if {
	input_valid
	# Check if PR is a bug fix
	is_bug_fix_pr(input.pr_title, input.pr_body)

	# Check if any test files were modified
	test_files := [f | some f in input.changed_files; is_test_file(f.path)]
	count(test_files) == 0

	msg := "Bug fix PR without test file modifications. Add regression test that reproduces the bug."
}

missing_regression_tests_violations contains msg if {
	input_valid
	# Check if PR is a bug fix
	is_bug_fix_pr(input.pr_title, input.pr_body)

	# Test files were modified, but no regression test pattern found
	test_files := [f | some f in input.changed_files; is_test_file(f.path)]
	count(test_files) > 0

	# Check for regression test indicators
	not has_regression_test_pattern(test_files)

	msg := "Bug fix PR with test modifications but no regression test found. Add test case with description referencing bug fix."
}

# ============================================================================
# VIOLATION PATTERN 3: Coverage Below 80% Threshold
# ============================================================================

coverage_below_threshold_violations contains msg if {
	input_valid
	some file in input.coverage_report.files
	is_new_or_modified_file(file.path, input.changed_files)

	# Check statements coverage
	file.coverage.statements.pct < 80

	msg := sprintf("File %s has statements coverage %d%% (< 80%%). Add tests to improve coverage.", [file.path, file.coverage.statements.pct])
}

coverage_below_threshold_violations contains msg if {
	input_valid
	some file in input.coverage_report.files
	is_new_or_modified_file(file.path, input.changed_files)

	# Check branches coverage
	file.coverage.branches.pct < 80

	msg := sprintf("File %s has branches coverage %d%% (< 80%%). Add tests for conditional branches.", [file.path, file.coverage.branches.pct])
}

coverage_below_threshold_violations contains msg if {
	input_valid
	some file in input.coverage_report.files
	is_new_or_modified_file(file.path, input.changed_files)

	# Check functions coverage
	file.coverage.functions.pct < 80

	msg := sprintf("File %s has functions coverage %d%% (< 80%%). Add tests for uncovered functions.", [file.path, file.coverage.functions.pct])
}

coverage_below_threshold_violations contains msg if {
	input_valid
	some file in input.coverage_report.files
	is_new_or_modified_file(file.path, input.changed_files)

	# Check lines coverage
	file.coverage.lines.pct < 80

	msg := sprintf("File %s has lines coverage %d%% (< 80%%). Add tests to cover more code lines.", [file.path, file.coverage.lines.pct])
}

# ============================================================================
# VIOLATION PATTERN 4: Tests Skipped Without Documentation
# ============================================================================

tests_skipped_violations contains msg if {
	input_valid
	some file in input.changed_files
	is_test_file(file.path)
	lines := split(file.diff, "\n")
	some line in lines
	startswith(line, "+")

	# Pattern: describe.skip or it.skip without documentation
	regex.match(`(describe|it|test)\.skip\s*\(`, line)
	not has_skip_documentation(line)

	msg := sprintf("File %s has skipped test without documentation. Add comment explaining why test is skipped and when it will be re-enabled.", [file.path])
}

has_skip_documentation(line) if {
	# Check if line has comment explaining skip
	regex.match(`//.*skip.*because`, line)
}

has_skip_documentation(line) if {
	regex.match(`//.*TODO.*enable`, line)
}

# ============================================================================
# VIOLATION PATTERN 5: Coverage Delta Negative
# ============================================================================

coverage_delta_negative_violations contains msg if {
	some file in input.coverage_delta.files
	is_source_file(file.path)

	# Check if coverage decreased significantly (>5%)
	file.delta.statements < -5

	decrease_abs := file.delta.statements * -1
	msg := sprintf("File %s has statements coverage decrease of %d%%. New changes reduced test coverage.", [file.path, decrease_abs])
}

coverage_delta_negative_violations contains msg if {
	some file in input.coverage_delta.files
	is_source_file(file.path)

	# Check if coverage decreased significantly (>5%)
	file.delta.branches < -5

	decrease_abs := file.delta.branches * -1
	msg := sprintf("File %s has branches coverage decrease of %d%%. New changes reduced test coverage.", [file.path, decrease_abs])
}

# ============================================================================
# WARNING PATTERN 1: Incomplete Test Coverage
# ============================================================================

incomplete_test_coverage_warnings contains msg if {
	some file in input.coverage_report.files
	is_new_or_modified_file(file.path, input.changed_files)

	# Coverage is between 70-80% (not quite at threshold)
	file.coverage.statements.pct >= 70
	file.coverage.statements.pct < 80

	msg := sprintf("File %s has statements coverage %d%% (70-80%%). Consider adding a few more tests to reach 80%% threshold.", [file.path, file.coverage.statements.pct])
}

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

is_source_file(path) if {
	endswith(path, ".ts")
	not endswith(path, ".spec.ts")
	not endswith(path, ".test.ts")
	not endswith(path, ".d.ts")
}

is_source_file(path) if {
	endswith(path, ".tsx")
	not endswith(path, ".spec.tsx")
	not endswith(path, ".test.tsx")
}

is_test_file(path) if {
	endswith(path, ".spec.ts")
}

is_test_file(path) if {
	endswith(path, ".test.ts")
}

is_test_file(path) if {
	endswith(path, ".spec.tsx")
}

is_test_file(path) if {
	endswith(path, ".test.tsx")
}

is_test_file(path) if {
	contains(path, "/__tests__/")
}

is_test_file(path) if {
	contains(path, "/test/")
}

is_test_file(path) if {
	endswith(path, ".test.sql")
}

has_test_file(source_path, files) if {
	test_path := get_test_file_path(source_path)
	some file in files
	file.path == test_path
}

# Get all possible test file paths for TypeScript/JavaScript files
get_test_file_paths(source_path) := paths if {
	endswith(source_path, ".ts")
	dir := dirname(source_path)
	basename := base(source_path)
	
	# Pattern 1: Adjacent .spec.ts file
	spec_path := replace(source_path, ".ts", ".spec.ts")
	
	# Pattern 2: __tests__ directory with .test.ts
	test_basename := replace(basename, ".ts", ".test.ts")
	tests_dir_path := concat("/", [dir, "__tests__", test_basename])
	
	# Pattern 3: Adjacent .test.ts file
	test_path := replace(source_path, ".ts", ".test.ts")
	
	paths := {spec_path, tests_dir_path, test_path}
}

# Get all possible test file paths for SQL migration files
get_test_file_paths(source_path) := paths if {
	endswith(source_path, ".sql")
	
	# Pattern 1: Adjacent .test.sql file
	test_path := replace(source_path, ".sql", ".test.sql")
	
	# Pattern 2: Migration rollback file
	rollback_path := replace(source_path, ".sql", ".rollback.sql")
	
	paths := {test_path, rollback_path}
}

# Get all possible test file paths for TSX files
get_test_file_paths(source_path) := paths if {
	endswith(source_path, ".tsx")
	dir := dirname(source_path)
	basename := base(source_path)
	
	# Pattern 1: Adjacent .spec.tsx file
	spec_path := replace(source_path, ".tsx", ".spec.tsx")
	
	# Pattern 2: Adjacent .test.tsx file
	test_path := replace(source_path, ".tsx", ".test.tsx")
	
	# Pattern 3: __tests__ directory
	test_basename := replace(basename, ".tsx", ".test.tsx")
	tests_dir_path := concat("/", [dir, "__tests__", test_basename])
	
	paths := {spec_path, test_path, tests_dir_path}
}

# Helper to get primary test path (for backward compatibility)
get_test_file_path(source_path) := test_path if {
	# Default to .spec.ts pattern
	test_path := replace(source_path, ".ts", ".spec.ts")
}

has_new_functions(file) if {
	lines := split(file.diff, "\n")
	some line in lines
	startswith(line, "+")
	regex.match(`(function|class|async|const.*=.*\(|export.*function)`, line)
}

file_was_modified(path, files) if {
	some file in files
	file.path == path
}

is_bug_fix_pr(title, _) if {
	regex.match(`(fix(es)?|bug|hotfix|regression|patch)[:\s]`, title)
}

is_bug_fix_pr(_, body) if {
	regex.match(`(fixes|closes|resolves)\s+#\d+`, body)
}

has_regression_test_pattern(test_files) if {
	some file in test_files
	lines := split(file.diff, "\n")
	some line in lines
	startswith(line, "+")
	regex.match(`(regression|bug\s*fix|issue\s*#\d+|reproduces.*bug|fixes\s*#\d+)`, line)
}

is_new_or_modified_file(path, files) if {
	some file in files
	file.path == path
	file.status == "added"
}

is_new_or_modified_file(path, files) if {
	some file in files
	file.path == path
	file.status == "modified"
}

# Removed: Use built-in startswith() instead per Rego/OPA Bible 6.7

dirname(path) := dir if {
	parts := split(path, "/")
	count(parts) > 1
	dir_parts := array.slice(parts, 0, count(parts) - 1)
	dir := concat("/", dir_parts)
}

base(path) := basename if {
	parts := split(path, "/")
	basename := parts[count(parts) - 1]
}

# ============================================================================
# R16: Testing Requirements (Additional)
# WARNING-level enforcement (Tier 3 MAD)
# Ensures additional context-specific tests exist
# ============================================================================

# Helper: Check if file needs error path tests
needs_error_path_tests(file) if {
	is_source_file(file.path)
	not is_test_file(file.path)
	file.status == "added"
}

needs_error_path_tests(file) if {
	is_source_file(file.path)
	not is_test_file(file.path)
	file.status == "modified"
	has_new_functions(file)
}

# Helper: Check if file needs state machine tests
needs_state_machine_tests(file) if {
	contains(file.content, "Status")
	regex.match(`enum.*Status.*\{`, file.content)
	regex.match(`transition`, file.content)
}

# Helper: Check if file needs tenant isolation tests
needs_tenant_isolation_tests(file) if {
	contains(file.content, "tenant_id")
	regex.match(`prisma\.\w+\.find`, file.content)
}

needs_tenant_isolation_tests(file) if {
	contains(file.content, "tenantId")
	regex.match(`withTenant`, file.content)
}

# Helper: Check if file needs observability tests
needs_observability_tests(file) if {
	is_source_file(file.path)
	not is_test_file(file.path)
	file.status == "added"
}

needs_observability_tests(file) if {
	is_source_file(file.path)
	not is_test_file(file.path)
	file.status == "modified"
	has_new_functions(file)
}

# Helper: Check if file needs security tests
needs_security_tests(file) if {
	is_source_file(file.path)
	not is_test_file(file.path)
	contains(file.path, "auth")
}

needs_security_tests(file) if {
	is_source_file(file.path)
	not is_test_file(file.path)
	contains(file.path, "payment")
}

needs_security_tests(file) if {
	is_source_file(file.path)
	not is_test_file(file.path)
	regex.match(`login|authenticate|authorize`, file.content)
}

# Helper: Check if file needs data migration tests
needs_data_migration_tests(file) if {
	not is_test_file(file.path)
	contains(file.path, "migration")
	endswith(file.path, ".sql")
}

needs_data_migration_tests(file) if {
	not is_test_file(file.path)
	contains(file.path, "prisma/migrations")
}

# Helper: Check if file needs performance tests
needs_performance_tests(file) if {
	contains(file.path, "api")
	regex.match(`async.*get|async.*post|async.*put`, file.content)
}

# Helper: Check if file needs accessibility tests
needs_accessibility_tests(file) if {
	contains(file.path, "frontend/src/components")
	endswith(file.path, ".tsx")
}

needs_accessibility_tests(file) if {
	endswith(file.path, ".jsx")
	contains(file.path, "components")
}

# R16-W01: Missing error path tests
additional_testing_warnings contains msg if {
	input_valid
	some file in input.changed_files
	needs_error_path_tests(file)

	not has_error_path_tests(file.path, input.changed_files)

	msg := sprintf(
		"WARNING [Quality/R16]: File %s needs error path tests. Add tests covering validation errors (400), business rule errors (422), and system errors (500).",
		[file.path],
	)
}

# R16-W02: Missing state machine tests
additional_testing_warnings contains msg if {
	input_valid
	some file in input.changed_files
	needs_state_machine_tests(file)

	not has_state_machine_tests(file.path, input.changed_files)

	msg := sprintf(
		"WARNING [Quality/R16]: File %s appears to implement a state machine but lacks state machine tests. Add tests for legal transitions, illegal transitions, and audit logging.",
		[file.path],
	)
}

# R16-W03: Missing tenant isolation tests
additional_testing_warnings contains msg if {
	input_valid
	some file in input.changed_files
	needs_tenant_isolation_tests(file)

	not has_tenant_isolation_tests(file.path, input.changed_files)

	msg := sprintf(
		"WARNING [Quality/R16]: File %s has multi-tenant queries but lacks tenant isolation tests. Add tests verifying cross-tenant access prevention and RLS enforcement.",
		[file.path],
	)
}

# R16-W04: Missing observability tests
additional_testing_warnings contains msg if {
	input_valid
	some file in input.changed_files
	needs_observability_tests(file)

	not has_observability_tests(file.path, input.changed_files)

	msg := sprintf(
		"WARNING [Quality/R16]: File %s needs observability tests. Add tests verifying structured logging (level, message, timestamp, traceId, context) and trace ID propagation.",
		[file.path],
	)
}

# R16-W05: Missing security tests
additional_testing_warnings contains msg if {
	input_valid
	some file in input.changed_files
	needs_security_tests(file)

	not has_security_tests(file.path, input.changed_files)

	msg := sprintf(
		"WARNING [Quality/R16]: File %s handles sensitive operations but lacks security tests. Add tests for authentication, authorization, input validation, and audit logging.",
		[file.path],
	)
}

# R16-W06: Missing data migration tests
additional_testing_warnings contains msg if {
	input_valid
	some file in input.changed_files
	needs_data_migration_tests(file)

	not has_data_migration_tests(file.path, input.changed_files)

	msg := sprintf(
		"WARNING [Quality/R16]: File %s is a database migration but lacks migration tests. Add tests verifying idempotency, data integrity, and rollback capability.",
		[file.path],
	)
}

# R16-W07: Missing performance tests (conditional)
additional_testing_warnings contains msg if {
	input_valid
	some file in input.changed_files
	needs_performance_tests(file)
	contains(file.content, "// @performance-critical")

	not has_performance_tests(file.path, input.changed_files)

	msg := sprintf(
		"WARNING [Quality/R16]: File %s is marked as performance-critical but lacks performance tests. Add tests verifying response time thresholds and performance budgets.",
		[file.path],
	)
}

# R16-W08: Missing accessibility tests (conditional)
additional_testing_warnings contains msg if {
	input_valid
	some file in input.changed_files
	needs_accessibility_tests(file)

	not has_accessibility_tests(file.path, input.changed_files)

	msg := sprintf(
		"WARNING [Quality/R16]: File %s is a UI component but lacks accessibility tests. Add tests verifying WCAG AA compliance (keyboard navigation, screen readers, color contrast).",
		[file.path],
	)
}

# Helper: Check if any test file has error path tests
has_error_path_tests(source_path, files) if {
	test_paths := get_test_file_paths(source_path)
	some test_path in test_paths
	some file in files
	file.path == test_path
	regex.match(`throw.*Exception|expect.*toThrow|should.*error`, file.content)
}

# Helper: Check if any test file has state machine tests
has_state_machine_tests(source_path, files) if {
	test_paths := get_test_file_paths(source_path)
	some test_path in test_paths
	some file in files
	file.path == test_path
	regex.match(`transition.*status|legal.*transition|illegal.*transition`, file.content)
}

# Helper: Check if any test file has tenant isolation tests
has_tenant_isolation_tests(source_path, files) if {
	test_paths := get_test_file_paths(source_path)
	some test_path in test_paths
	some file in files
	file.path == test_path
	regex.match(`tenant.*isolation|cross.*tenant|RLS.*policy`, file.content)
}

# Helper: Check if any test file has observability tests
has_observability_tests(source_path, files) if {
	test_paths := get_test_file_paths(source_path)
	some test_path in test_paths
	some file in files
	file.path == test_path
	regex.match(`structured.*log|traceId|trace.*propagation`, file.content)
}

# Helper: Check if any test file has security tests
has_security_tests(source_path, files) if {
	test_paths := get_test_file_paths(source_path)
	some test_path in test_paths
	some file in files
	file.path == test_path
	regex.match(`authentication|authorization|input.*validation|security`, file.content)
}

# Helper: Check if any test file has data migration tests
has_data_migration_tests(source_path, files) if {
	test_paths := get_test_file_paths(source_path)
	some test_path in test_paths
	some file in files
	file.path == test_path
	regex.match(`migration.*idempotency|data.*integrity|rollback`, file.content)
}

# Helper: Check if any test file has performance tests
has_performance_tests(source_path, files) if {
	test_paths := get_test_file_paths(source_path)
	some test_path in test_paths
	some file in files
	file.path == test_path
	regex.match(`performance|response.*time|latency|p95|p99`, file.content)
}

# Helper: Check if any test file has accessibility tests
has_accessibility_tests(source_path, files) if {
	test_paths := get_test_file_paths(source_path)
	some test_path in test_paths
	some file in files
	file.path == test_path
	regex.match(`accessibility|WCAG|keyboard.*navigation|screen.*reader|aria`, file.content)
}

# ============================================================================
# R17: Coverage Requirements
# WARNING-level enforcement (Tier 3 MAD)
# Ensures coverage trends, exemptions, and gaps are managed
# ============================================================================

# Helper: Check if coverage has degraded
coverage_degraded(_, baseline_coverage, current_coverage) if {
	degradation := baseline_coverage - current_coverage
	degradation > 5 # Alert if degradation > 5%
}

# Helper: Check if exemption has expired
exemption_expired(exemption) if {
	expiration_date := time.parse_rfc3339_ns(exemption.expiration)
	current_date := time.now_ns()
	expiration_date < current_date
}

# Helper: Check if file has coverage exemption
has_coverage_exemption(file_path, exemptions) if {
	some exemption in exemptions
	exemption.file == file_path
}

# R17-W01: Coverage degradation detected
coverage_requirements_warnings contains msg if {
	some file in input.changed_files
	is_source_file(file.path)

	# Check if coverage degraded from baseline
	baseline := input.coverage_baseline[file.path]
	current := input.coverage_current[file.path]

	baseline
	current
	coverage_degraded(file.path, baseline, current)

	msg := sprintf(
		"WARNING [Quality/R17]: Coverage degraded for %s. Baseline: %d%%, Current: %d%% (-%d%%). Coverage should not decrease.",
		[file.path, baseline, current, baseline - current],
	)
}

# R17-W02: Coverage exemption expired
coverage_requirements_warnings contains msg if {
	some exemption in input.coverage_exemptions
	exemption_expired(exemption)

	msg := sprintf(
		"WARNING [Quality/R17]: Coverage exemption expired for %s. Expiration: %s. Update exemption or improve coverage.",
		[exemption.file, exemption.expiration],
	)
}

# R17-W03: Coverage exemption missing justification
coverage_requirements_warnings contains msg if {
	some exemption in input.coverage_exemptions
	not exemption.justification

	msg := sprintf(
		"WARNING [Quality/R17]: Coverage exemption for %s is missing justification. Add justification explaining why exemption is needed.",
		[exemption.file],
	)
}

# R17-W04: Coverage exemption missing remediation plan
coverage_requirements_warnings contains msg if {
	some exemption in input.coverage_exemptions
	not exemption.remediation

	msg := sprintf(
		"WARNING [Quality/R17]: Coverage exemption for %s is missing remediation plan. Add plan explaining how to improve coverage.",
		[exemption.file],
	)
}

# R17-W05: Coverage below target without exemption
coverage_requirements_warnings contains msg if {
	some file in input.changed_files
	is_source_file(file.path)

	# Check if coverage below target
	current := input.coverage_current[file.path]
	target := input.coverage_targets[file.path]

	current
	target
	current < target

	# Check if no exemption exists
	not has_coverage_exemption(file.path, input.coverage_exemptions)

	msg := sprintf(
		"WARNING [Quality/R17]: Coverage below target for %s. Current: %d%%, Target: %d%%. Add exemption or improve coverage.",
		[file.path, current, target],
	)
}

# R17-W06: Coverage gap identified (critical code)
coverage_requirements_warnings contains msg if {
	some gap in input.coverage_gaps
	gap.priority == "high"
	gap.code_type == "critical"

	msg := sprintf(
		"WARNING [Quality/R17]: High-priority coverage gap in critical code: %s. Current: %d%%, Target: %d%%. Estimated effort: %s.",
		[gap.file, gap.coverage, gap.target, gap.estimated_effort],
	)
}

# R17-W07: Coverage trend not tracked
coverage_requirements_warnings contains msg if {
	some file in input.changed_files
	is_source_file(file.path)
	file.status == "modified"

	# Check if trend data missing
	not input.coverage_history[file.path]

	msg := sprintf(
		"WARNING [Quality/R17]: Coverage trend not tracked for %s. Add coverage history to .coverage/history.json.",
		[file.path],
	)
}

# R17-W08: Coverage report not generated
coverage_requirements_warnings contains msg if {
	# Check if enhanced coverage report exists
	not input.coverage_report_generated

	msg := "WARNING [Quality/R17]: Enhanced coverage report not generated. Run: python .cursor/scripts/check-coverage-requirements.py --generate-report"
}

# ============================================================================
# R18: Performance Budgets
# WARNING-level enforcement (Tier 3 MAD)
# Ensures API and frontend performance budgets are maintained
# ============================================================================

# Helper: Check if performance has degraded from baseline
performance_degraded(_, baseline_p50, current_p50) if {
	degradation_percent := ((current_p50 - baseline_p50) / baseline_p50) * 100
	degradation_percent > 10 # Alert if degradation > 10%
}

# Helper: Check if exemption has expired
performance_exemption_expired(exemption) if {
	expiration_date := time.parse_rfc3339_ns(exemption.expiration)
	current_date := time.now_ns()
	expiration_date < current_date
}

# Helper: Check if endpoint has performance exemption
has_performance_exemption(endpoint, exemptions) if {
	some exemption in exemptions
	exemption.endpoint == endpoint
}

# Helper: Check if endpoint exceeds budget
exceeds_budget(endpoint_metrics, budget) if {
	endpoint_metrics.p50 > budget
}

# R18-W01: API performance regression detected
performance_budgets_warnings contains msg if {
	some endpoint in input.api_endpoints

	# Check if performance degraded from baseline
	baseline := input.performance_baseline[endpoint.path]
	current := input.performance_current[endpoint.path]

	baseline
	current
	performance_degraded(endpoint.path, baseline.p50, current.p50)

	degradation_percent := ((current.p50 - baseline.p50) / baseline.p50) * 100

	msg := sprintf(
		"WARNING [Quality/R18]: Performance regression for %s. Baseline: %dms, Current: %dms (+%.1f%%). Performance should not degrade > 10%%.",
		[endpoint.path, baseline.p50, current.p50, degradation_percent],
	)
}

# R18-W02: API endpoint exceeds budget without exemption
performance_budgets_warnings contains msg if {
	some endpoint in input.api_endpoints

	# Check if endpoint exceeds budget
	current := input.performance_current[endpoint.path]
	budget := input.performance_budgets.api[endpoint.type]

	current
	budget
	exceeds_budget(current, budget)

	# Check if no exemption exists
	not has_performance_exemption(endpoint.path, input.performance_exemptions)

	violation_percent := ((current.p50 - budget) / budget) * 100

	msg := sprintf(
		"WARNING [Quality/R18]: API endpoint %s exceeds budget. Current: %dms, Budget: %dms (+%.1f%%). Add exemption or optimize performance.",
		[endpoint.path, current.p50, budget, violation_percent],
	)
}

# R18-W03: Frontend page exceeds budget without exemption
performance_budgets_warnings contains msg if {
	some page in input.frontend_pages

	# Check FCP budget
	current_fcp := input.performance_current[page.path].fcp
	budget_fcp := input.performance_budgets.frontend.fcp

	current_fcp
	budget_fcp
	current_fcp > budget_fcp

	# Check if no exemption exists
	not has_performance_exemption(page.path, input.performance_exemptions)

	msg := sprintf(
		"WARNING [Quality/R18]: Frontend page %s exceeds FCP budget. Current: %.2fs, Budget: %.2fs. Add exemption or optimize performance.",
		[page.path, current_fcp, budget_fcp],
	)
}

# R18-W04: Performance exemption expired
performance_budgets_warnings contains msg if {
	some exemption in input.performance_exemptions
	performance_exemption_expired(exemption)

	msg := sprintf(
		"WARNING [Quality/R18]: Performance exemption expired for %s. Expiration: %s. Update exemption or optimize performance.",
		[exemption.endpoint, exemption.expiration],
	)
}

# R18-W05: Performance exemption missing justification
performance_budgets_warnings contains msg if {
	some exemption in input.performance_exemptions
	not exemption.justification

	msg := sprintf(
		"WARNING [Quality/R18]: Performance exemption for %s is missing justification. Add justification explaining why exemption is needed.",
		[exemption.endpoint],
	)
}

# R18-W06: Performance exemption missing remediation plan
performance_budgets_warnings contains msg if {
	some exemption in input.performance_exemptions
	not exemption.remediation

	msg := sprintf(
		"WARNING [Quality/R18]: Performance exemption for %s is missing remediation plan. Add plan explaining how to optimize performance.",
		[exemption.endpoint],
	)
}

# R18-W07: High-priority performance issue identified
performance_budgets_warnings contains msg if {
	some issue in input.performance_issues
	issue.priority == "high"

	msg := sprintf(
		"WARNING [Quality/R18]: High-priority performance issue: %s. Current: %dms, Budget: %dms. Criticality: %s, Impact: %s. Estimated effort: %s.",
		[issue.endpoint, issue.current, issue.budget, issue.criticality, issue.impact, issue.effort],
	)
}

# R18-W08: Performance trend not tracked
performance_budgets_warnings contains msg if {
	some endpoint in input.api_endpoints
	endpoint.status == "modified"

	# Check if trend data missing
	not input.performance_history[endpoint.path]

	msg := sprintf(
		"WARNING [Quality/R18]: Performance trend not tracked for %s. Add performance history to .performance/history.json.",
		[endpoint.path],
	)
}

# R18-W09: Performance report not generated
performance_budgets_warnings contains msg if {
	# Check if enhanced performance report exists
	not input.performance_report_generated

	msg := "WARNING [Quality/R18]: Enhanced performance report not generated. Run: python .cursor/scripts/check-performance-budgets.py --generate-report"
}

# R18-W10: Critical endpoint performance degradation
performance_budgets_warnings contains msg if {
	some endpoint in input.api_endpoints
	endpoint.criticality == "critical"

	# Check if performance degraded significantly (> 20%)
	baseline := input.performance_baseline[endpoint.path]
	current := input.performance_current[endpoint.path]

	baseline
	current

	degradation_percent := ((current.p50 - baseline.p50) / baseline.p50) * 100
	degradation_percent > 20 # Alert if critical endpoint degrades > 20%

	msg := sprintf(
		"WARNING [Quality/R18]: CRITICAL endpoint %s performance degraded significantly. Baseline: %dms, Current: %dms (+%.1f%%). Immediate attention required.",
		[endpoint.path, baseline.p50, current.p50, degradation_percent],
	)
}
