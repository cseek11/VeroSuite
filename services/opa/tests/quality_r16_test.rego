package compliance.quality_test

import data.compliance.quality
import rego.v1

# ============================================================================
# R16: Additional Testing Requirements Tests
# ============================================================================

# Test 1: Happy path - error path tests exist
test_error_path_tests_exist if {
	mock_input := {"changed_files": [
		{
			"path": "apps/api/src/users/users.service.ts",
			"status": "added",
			"content": "async function createUser() { ... }",
		},
		{
			"path": "apps/api/src/users/users.service.spec.ts",
			"content": "it('should throw BadRequestException on invalid email', ...)",
		},
	]}

	result := quality.warn with input as mock_input
	count([msg | msg := result[_]; contains(msg, "R16"); contains(msg, "error path")]) == 0
}

# Test 2: Warning - missing error path tests
test_missing_error_path_tests if {
	mock_input := {"changed_files": [{
		"path": "apps/api/src/users/users.service.ts",
		"status": "added",
		"content": "async function createUser() { ... }",
	}]}

	result := quality.warn with input as mock_input
	count([msg | msg := result[_]; contains(msg, "R16"); contains(msg, "error path")]) >= 1
}

# Test 3: Happy path - state machine tests exist
test_state_machine_tests_exist if {
	mock_input := {"changed_files": [
		{
			"path": "apps/api/src/work-orders/work-orders.service.ts",
			"status": "modified",
			"content": "enum WorkOrderStatus { DRAFT, SCHEDULED } async function transitionStatus() { ... }",
		},
		{
			"path": "apps/api/src/work-orders/work-orders.service.spec.ts",
			"content": "it('should allow legal transition from DRAFT to SCHEDULED', ...)",
		},
	]}

	result := quality.warn with input as mock_input
	count([msg | msg := result[_]; contains(msg, "R16"); contains(msg, "state machine")]) == 0
}

# Test 4: Warning - missing state machine tests
test_missing_state_machine_tests if {
	mock_input := {"changed_files": [{
		"path": "apps/api/src/work-orders/work-orders.service.ts",
		"status": "modified",
		"content": "enum WorkOrderStatus { DRAFT, SCHEDULED } async function transitionStatus() { ... }",
	}]}

	result := quality.warn with input as mock_input
	count([msg | msg := result[_]; contains(msg, "R16"); contains(msg, "state machine")]) >= 1
}

# Test 5: Happy path - tenant isolation tests exist
test_tenant_isolation_tests_exist if {
	mock_input := {"changed_files": [
		{
			"path": "apps/api/src/customers/customers.service.ts",
			"status": "modified",
			"content": "async function getCustomer() { prisma.customer.findUnique({ where: { tenant_id } }) }",
		},
		{
			"path": "apps/api/src/customers/customers.service.spec.ts",
			"content": "it('should prevent cross-tenant access', ...)",
		},
	]}

	result := quality.warn with input as mock_input
	count([msg | msg := result[_]; contains(msg, "R16"); contains(msg, "tenant isolation")]) == 0
}

# Test 6: Warning - missing tenant isolation tests
test_missing_tenant_isolation_tests if {
	mock_input := {"changed_files": [{
		"path": "apps/api/src/customers/customers.service.ts",
		"status": "modified",
		"content": "async function getCustomer() { prisma.customer.findUnique({ where: { tenant_id } }) }",
	}]}

	result := quality.warn with input as mock_input
	count([msg | msg := result[_]; contains(msg, "R16"); contains(msg, "tenant isolation")]) >= 1
}

# Test 7: Happy path - observability tests exist
test_observability_tests_exist if {
	mock_input := {"changed_files": [
		{
			"path": "apps/api/src/users/users.service.ts",
			"status": "added",
			"content": "async function createUser() { logger.info('Creating user', { traceId }) }",
		},
		{
			"path": "apps/api/src/users/users.service.spec.ts",
			"content": "it('should log with structured format and traceId', ...)",
		},
	]}

	result := quality.warn with input as mock_input
	count([msg | msg := result[_]; contains(msg, "R16"); contains(msg, "observability")]) == 0
}

# Test 8: Warning - missing observability tests
test_missing_observability_tests if {
	mock_input := {"changed_files": [{
		"path": "apps/api/src/users/users.service.ts",
		"status": "added",
		"content": "async function createUser() { ... }",
	}]}

	result := quality.warn with input as mock_input
	count([msg | msg := result[_]; contains(msg, "R16"); contains(msg, "observability")]) >= 1
}

# Test 9: Happy path - security tests exist
test_security_tests_exist if {
	mock_input := {"changed_files": [
		{
			"path": "apps/api/src/auth/auth.service.ts",
			"status": "modified",
			"content": "async function login() { ... }",
		},
		{
			"path": "apps/api/src/auth/auth.service.spec.ts",
			"content": "it('should test authentication', ...); it('should verify authorization', ...); it('should validate input validation', ...); it('should test security', ...)",
		},
	]}

	result := quality.warn with input as mock_input
	count([msg | msg := result[_]; contains(msg, "R16"); contains(msg, "security")]) == 0
}

# Test 10: Warning - missing security tests
test_missing_security_tests if {
	mock_input := {"changed_files": [{
		"path": "apps/api/src/auth/auth.service.ts",
		"status": "modified",
		"content": "async function login() { ... }",
	}]}

	result := quality.warn with input as mock_input
	count([msg | msg := result[_]; contains(msg, "R16"); contains(msg, "security")]) >= 1
}

# Test 11: Happy path - data migration tests exist
test_data_migration_tests_exist if {
	mock_input := {"changed_files": [
		{
			"path": "libs/common/prisma/migrations/20251123_add_user_status.sql",
			"status": "added",
			"content": "ALTER TABLE users ADD COLUMN status VARCHAR(50);",
		},
		{
			"path": "libs/common/prisma/migrations/20251123_add_user_status.test.sql",
			"content": "-- Test migration idempotency, data integrity, and rollback capability",
		},
	]}

	result := quality.warn with input as mock_input
	count([msg | msg := result[_]; contains(msg, "R16"); contains(msg, "migration")]) == 0
}

# Test 12: Warning - missing data migration tests
test_missing_data_migration_tests if {
	mock_input := {"changed_files": [{
		"path": "libs/common/prisma/migrations/20251123_add_user_status.sql",
		"status": "added",
		"content": "ALTER TABLE users ADD COLUMN status VARCHAR(50);",
	}]}

	result := quality.warn with input as mock_input
	count([msg | msg := result[_]; contains(msg, "R16"); contains(msg, "migration")]) >= 1
}

# Test 13: Conditional - performance tests (only when marked)
test_performance_tests_conditional if {
	mock_input := {"changed_files": [{
		"path": "apps/api/src/users/users.service.ts",
		"status": "modified",
		"content": "// @performance-critical\nasync function getUsers() { ... }",
	}]}

	result := quality.warn with input as mock_input
	count([msg | msg := result[_]; contains(msg, "R16"); contains(msg, "performance")]) >= 1
}

# Test 14: Conditional - accessibility tests (only for UI components)
test_accessibility_tests_conditional if {
	mock_input := {"changed_files": [{
		"path": "frontend/src/components/Button.tsx",
		"status": "added",
		"content": "export const Button = () => { ... }",
	}]}

	result := quality.warn with input as mock_input
	count([msg | msg := result[_]; contains(msg, "R16"); contains(msg, "accessibility")]) >= 1
}

# Test 15: No warnings for backend code without UI
test_no_accessibility_warnings_for_backend if {
	mock_input := {"changed_files": [{
		"path": "apps/api/src/users/users.service.ts",
		"status": "added",
		"content": "async function createUser() { ... }",
	}]}

	# Should not warn about accessibility tests for backend code
	result := quality.warn with input as mock_input
	count([msg | msg := result[_]; contains(msg, "R16"); contains(msg, "accessibility")]) == 0
}
