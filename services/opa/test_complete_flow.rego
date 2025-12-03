package test_complete_flow

import rego.v1
import data.compliance.quality

test_security_complete_flow if {
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
    
    # Check each condition step by step
    input_valid := quality.input_valid with input as mock_input
    needs_security := quality.needs_security_tests(mock_input.changed_files[0]) with input as mock_input
    has_security := quality.has_security_tests("apps/api/src/auth/auth.service.ts", mock_input.changed_files) with input as mock_input
    
    # If has_security is true, then not has_security should be false, so no warning
    input_valid
    needs_security
    has_security  # This should be true, preventing the warning
}

test_migration_complete_flow if {
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
    
    # Check each condition step by step
    input_valid := quality.input_valid with input as mock_input
    needs_migration := quality.needs_data_migration_tests(mock_input.changed_files[0]) with input as mock_input
    has_migration := quality.has_data_migration_tests("libs/common/prisma/migrations/20251123_add_user_status.sql", mock_input.changed_files) with input as mock_input
    
    # If has_migration is true, then not has_migration should be false, so no warning
    input_valid
    needs_migration
    has_migration  # This should be true, preventing the warning
}
