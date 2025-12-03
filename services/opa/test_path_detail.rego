package test_path_detail

import rego.v1
import data.compliance.quality

test_security_path_match if {
    source_path := "apps/api/src/auth/auth.service.ts"
    test_file_path := "apps/api/src/auth/auth.service.spec.ts"
    
    test_paths := quality.get_test_file_paths(source_path)
    
    # Check if test_file_path is in test_paths
    test_file_path in test_paths
    
    # Also check the exact paths generated
    "apps/api/src/auth/auth.service.spec.ts" in test_paths
}

test_security_with_files if {
    mock_files := [
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
    
    # Check if has_security_tests finds the test file
    quality.has_security_tests("apps/api/src/auth/auth.service.ts", mock_files)
}

test_migration_path_match if {
    source_path := "libs/common/prisma/migrations/20251123_add_user_status.sql"
    test_file_path := "libs/common/prisma/migrations/20251123_add_user_status.test.sql"
    
    test_paths := quality.get_test_file_paths(source_path)
    
    # Check if test_file_path is in test_paths
    test_file_path in test_paths
}

test_migration_with_files if {
    mock_files := [
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
    
    # Check if has_data_migration_tests finds the test file
    quality.has_data_migration_tests("libs/common/prisma/migrations/20251123_add_user_status.sql", mock_files)
}
