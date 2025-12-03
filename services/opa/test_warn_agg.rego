package test_warn_aggregation

import rego.v1
import data.compliance.quality

test_security_warn_aggregation if {
    mock_input := {
        "changed_files": [
            {
                "path": "apps/api/src/auth/auth.service.ts",
                "status": "modified",
                "content": "async function login() { ... }",
            },
            {
                "path": "apps/api/src/auth/auth.service.spec.ts",
                "content": "it('should test authentication', ...); it('should verify authorization', ...); it('should validate input validation', ...); it('should test security', ...)",
            },
        ]
    }
    
    # Check additional_testing_warnings directly
    additional_warnings := quality.additional_testing_warnings with input as mock_input
    count([msg | msg := additional_warnings[_]; contains(msg, "R16"); contains(msg, "security")]) == 0
    
    # Check quality.warn (aggregated)
    all_warnings := quality.warn with input as mock_input
    count([msg | msg := all_warnings[_]; contains(msg, "R16"); contains(msg, "security")]) == 0
}

test_migration_warn_aggregation if {
    mock_input := {
        "changed_files": [
            {
                "path": "libs/common/prisma/migrations/20251123_add_user_status.sql",
                "status": "added",
                "content": "ALTER TABLE users ADD COLUMN status VARCHAR(50);",
            },
            {
                "path": "libs/common/prisma/migrations/20251123_add_user_status.test.sql",
                "content": "-- Test migration idempotency, data integrity, and rollback capability",
            },
        ]
    }
    
    # Check additional_testing_warnings directly
    additional_warnings := quality.additional_testing_warnings with input as mock_input
    count([msg | msg := additional_warnings[_]; contains(msg, "R16"); contains(msg, "migration")]) == 0
    
    # Check quality.warn (aggregated)
    all_warnings := quality.warn with input as mock_input
    count([msg | msg := all_warnings[_]; contains(msg, "R16"); contains(msg, "migration")]) == 0
}
