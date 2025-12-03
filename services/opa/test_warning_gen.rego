package test_warnings

import rego.v1
import data.compliance.quality

test_security_warning_generation if {
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
    
    # Check if additional_testing_warnings generates any warnings
    warnings := quality.additional_testing_warnings with input as mock_input
    count([msg | msg := warnings[_]; contains(msg, "security")]) == 0
}

test_migration_warning_generation if {
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
    
    # Check if additional_testing_warnings generates any warnings
    warnings := quality.additional_testing_warnings with input as mock_input
    count([msg | msg := warnings[_]; contains(msg, "migration")]) == 0
}
