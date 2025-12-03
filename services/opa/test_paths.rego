package test_paths

import rego.v1

test_security_paths if {
    source_path := "apps/api/src/auth/auth.service.ts"
    # Simulate get_test_file_paths logic
    spec_path := replace(source_path, ".ts", ".spec.ts")
    test_path := replace(source_path, ".ts", ".test.ts")
    
    spec_path == "apps/api/src/auth/auth.service.spec.ts"
    test_path == "apps/api/src/auth/auth.service.test.ts"
}

test_migration_paths if {
    source_path := "libs/common/prisma/migrations/20251123_add_user_status.sql"
    test_path := replace(source_path, ".sql", ".test.sql")
    rollback_path := replace(source_path, ".sql", ".rollback.sql")
    
    test_path == "libs/common/prisma/migrations/20251123_add_user_status.test.sql"
    rollback_path == "libs/common/prisma/migrations/20251123_add_user_status.rollback.sql"
}
