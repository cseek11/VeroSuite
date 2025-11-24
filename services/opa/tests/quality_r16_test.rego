package verofield.quality

import future.keywords.if

# Test 1: Happy path - error path tests exist
test_error_path_tests_exist if {
    mock_input := {
        "files": [
            {
                "path": "apps/api/src/users/users.service.ts",
                "status": "added",
                "content": "async function createUser() { ... }"
            },
            {
                "path": "apps/api/src/users/users.service.spec.ts",
                "content": "it('should throw BadRequestException on invalid email', ...)"
            }
        ]
    }
    
    count(additional_testing_warnings) == 0 with input as mock_input
}

# Test 2: Warning - missing error path tests
test_missing_error_path_tests if {
    mock_input := {
        "files": [
            {
                "path": "apps/api/src/users/users.service.ts",
                "status": "added",
                "content": "async function createUser() { ... }"
            }
        ]
    }
    
    count(additional_testing_warnings) >= 1 with input as mock_input
    warning := [msg | msg := additional_testing_warnings[_]][0]
    contains(warning, "error path tests")
}

# Test 3: Happy path - state machine tests exist
test_state_machine_tests_exist if {
    mock_input := {
        "files": [
            {
                "path": "apps/api/src/work-orders/work-orders.service.ts",
                "status": "modified",
                "content": "enum WorkOrderStatus { DRAFT, SCHEDULED } async function transitionStatus() { ... }"
            },
            {
                "path": "apps/api/src/work-orders/work-orders.service.spec.ts",
                "content": "it('should allow legal transition from DRAFT to SCHEDULED', ...)"
            }
        ]
    }
    
    count(additional_testing_warnings) == 0 with input as mock_input
}

# Test 4: Warning - missing state machine tests
test_missing_state_machine_tests if {
    mock_input := {
        "files": [
            {
                "path": "apps/api/src/work-orders/work-orders.service.ts",
                "status": "modified",
                "content": "enum WorkOrderStatus { DRAFT, SCHEDULED } async function transitionStatus() { ... }"
            }
        ]
    }
    
    count(additional_testing_warnings) >= 1 with input as mock_input
    warning := [msg | msg := additional_testing_warnings[_]; contains(msg, "state machine")][0]
    contains(warning, "state machine tests")
}

# Test 5: Happy path - tenant isolation tests exist
test_tenant_isolation_tests_exist if {
    mock_input := {
        "files": [
            {
                "path": "apps/api/src/customers/customers.service.ts",
                "status": "modified",
                "content": "async function getCustomer() { prisma.customer.findUnique({ where: { tenant_id } }) }"
            },
            {
                "path": "apps/api/src/customers/customers.service.spec.ts",
                "content": "it('should prevent cross-tenant access', ...)"
            }
        ]
    }
    
    count(additional_testing_warnings) == 0 with input as mock_input
}

# Test 6: Warning - missing tenant isolation tests
test_missing_tenant_isolation_tests if {
    mock_input := {
        "files": [
            {
                "path": "apps/api/src/customers/customers.service.ts",
                "status": "modified",
                "content": "async function getCustomer() { prisma.customer.findUnique({ where: { tenant_id } }) }"
            }
        ]
    }
    
    count(additional_testing_warnings) >= 1 with input as mock_input
    warning := [msg | msg := additional_testing_warnings[_]; contains(msg, "tenant isolation")][0]
    contains(warning, "tenant isolation tests")
}

# Test 7: Happy path - observability tests exist
test_observability_tests_exist if {
    mock_input := {
        "files": [
            {
                "path": "apps/api/src/users/users.service.ts",
                "status": "added",
                "content": "async function createUser() { logger.info('Creating user', { traceId }) }"
            },
            {
                "path": "apps/api/src/users/users.service.spec.ts",
                "content": "it('should log with structured format and traceId', ...)"
            }
        ]
    }
    
    count(additional_testing_warnings) == 0 with input as mock_input
}

# Test 8: Warning - missing observability tests
test_missing_observability_tests if {
    mock_input := {
        "files": [
            {
                "path": "apps/api/src/users/users.service.ts",
                "status": "added",
                "content": "async function createUser() { ... }"
            }
        ]
    }
    
    count(additional_testing_warnings) >= 1 with input as mock_input
    warning := [msg | msg := additional_testing_warnings[_]; contains(msg, "observability")][0]
    contains(warning, "observability tests")
}

# Test 9: Happy path - security tests exist
test_security_tests_exist if {
    mock_input := {
        "files": [
            {
                "path": "apps/api/src/auth/auth.service.ts",
                "status": "modified",
                "content": "async function login() { ... }"
            },
            {
                "path": "apps/api/src/auth/auth.service.spec.ts",
                "content": "it('should validate JWT token signature', ...)"
            }
        ]
    }
    
    count(additional_testing_warnings) == 0 with input as mock_input
}

# Test 10: Warning - missing security tests
test_missing_security_tests if {
    mock_input := {
        "files": [
            {
                "path": "apps/api/src/auth/auth.service.ts",
                "status": "modified",
                "content": "async function login() { ... }"
            }
        ]
    }
    
    count(additional_testing_warnings) >= 1 with input as mock_input
    warning := [msg | msg := additional_testing_warnings[_]; contains(msg, "security")][0]
    contains(warning, "security tests")
}

# Test 11: Happy path - data migration tests exist
test_data_migration_tests_exist if {
    mock_input := {
        "files": [
            {
                "path": "libs/common/prisma/migrations/20251123_add_user_status.sql",
                "status": "added",
                "content": "ALTER TABLE users ADD COLUMN status VARCHAR(50);"
            },
            {
                "path": "libs/common/prisma/migrations/20251123_add_user_status.test.sql",
                "content": "-- Test migration idempotency"
            }
        ]
    }
    
    count(additional_testing_warnings) == 0 with input as mock_input
}

# Test 12: Warning - missing data migration tests
test_missing_data_migration_tests if {
    mock_input := {
        "files": [
            {
                "path": "libs/common/prisma/migrations/20251123_add_user_status.sql",
                "status": "added",
                "content": "ALTER TABLE users ADD COLUMN status VARCHAR(50);"
            }
        ]
    }
    
    count(additional_testing_warnings) >= 1 with input as mock_input
    warning := [msg | msg := additional_testing_warnings[_]; contains(msg, "migration")][0]
    contains(warning, "migration tests")
}

# Test 13: Conditional - performance tests (only when marked)
test_performance_tests_conditional if {
    mock_input := {
        "files": [
            {
                "path": "apps/api/src/users/users.service.ts",
                "status": "modified",
                "content": "// @performance-critical\nasync function getUsers() { ... }"
            }
        ]
    }
    
    count(additional_testing_warnings) >= 1 with input as mock_input
    warning := [msg | msg := additional_testing_warnings[_]; contains(msg, "performance")][0]
    contains(warning, "performance tests")
}

# Test 14: Conditional - accessibility tests (only for UI components)
test_accessibility_tests_conditional if {
    mock_input := {
        "files": [
            {
                "path": "frontend/src/components/Button.tsx",
                "status": "added",
                "content": "export const Button = () => { ... }"
            }
        ]
    }
    
    count(additional_testing_warnings) >= 1 with input as mock_input
    warning := [msg | msg := additional_testing_warnings[_]; contains(msg, "accessibility")][0]
    contains(warning, "accessibility tests")
}

# Test 15: No warnings for backend code without UI
test_no_accessibility_warnings_for_backend if {
    mock_input := {
        "files": [
            {
                "path": "apps/api/src/users/users.service.ts",
                "status": "added",
                "content": "async function createUser() { ... }"
            }
        ]
    }
    
    # Should not warn about accessibility tests for backend code
    warnings := [msg | msg := additional_testing_warnings[_]; contains(msg, "accessibility")]
    count(warnings) == 0 with input as mock_input
}



