package test_migration_file

import rego.v1
import data.compliance.quality

test_migration_test_file_detection if {
    test_file_path := "libs/common/prisma/migrations/20251123_add_user_status.test.sql"
    
    # Check if this is recognized as a test file
    is_test := quality.is_test_file(test_file_path)
    
    # Should NOT be recognized as a test file (is_test_file only checks for .spec.ts, .test.ts, etc., not .test.sql)
    not is_test
}

test_migration_needs_tests_with_test_file if {
    mock_file := {
        "path": "libs/common/prisma/migrations/20251123_add_user_status.test.sql",
        "status": "added",
        "content": "-- Test migration idempotency, data integrity, and rollback capability",
    }
    
    # Check if needs_data_migration_tests returns true for the test file
    needs_tests := quality.needs_data_migration_tests(mock_file)
    
    # Should be false (test files don't need migration tests)
    not needs_tests
}
