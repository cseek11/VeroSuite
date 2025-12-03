package final_diagnostic

import rego.v1
import data.compliance.quality

test_security_exact_evaluation if {
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
    
    # Simulate the exact policy logic
    source_file := mock_input.changed_files[0]
    
    # Check needs_security_tests
    needs_security := quality.needs_security_tests(source_file) with input as mock_input
    
    # Check has_security_tests
    has_security := quality.has_security_tests(source_file.path, mock_input.changed_files) with input as mock_input
    
    # If has_security is true, then not has_security is false, so the warning should NOT be generated
    needs_security
    has_security
    
    # Check if warning would be generated
    # Warning is generated if: needs_security AND not has_security
    # So if has_security is true, warning should NOT be generated
    # This means: not (needs_security and not has_security)
    # Which simplifies to: not needs_security or has_security
    # Since we already have needs_security and has_security, this should be true
    true
}

test_migration_exact_evaluation if {
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
    
    # Simulate the exact policy logic
    source_file := mock_input.changed_files[0]
    
    # Check needs_data_migration_tests
    needs_migration := quality.needs_data_migration_tests(source_file) with input as mock_input
    
    # Check has_data_migration_tests
    has_migration := quality.has_data_migration_tests(source_file.path, mock_input.changed_files) with input as mock_input
    
    # If has_migration is true, then not has_migration is false, so the warning should NOT be generated
    needs_migration
    has_migration
    
    # Check if warning would be generated
    # Warning is generated if: needs_migration AND not has_migration
    # So if has_migration is true, warning should NOT be generated
    # This means: not (needs_migration and not has_migration)
    # Which simplifies to: not needs_migration or has_migration
    # Since we already have needs_migration and has_migration, this should be true
    true
}
