package diagnostic

import rego.v1
import data.compliance.quality

# Test 1: Path Generation
test_path_generation_security if {
	source_path := "apps/api/src/auth/auth.service.ts"
	test_paths := quality.get_test_file_paths(source_path)
	
	# Check if expected path is in the set
	"apps/api/src/auth/auth.service.spec.ts" in test_paths
}

test_path_generation_migration if {
	source_path := "libs/common/prisma/migrations/20251123_add_user_status.sql"
	test_paths := quality.get_test_file_paths(source_path)
	
	# Check if expected path is in the set
	"libs/common/prisma/migrations/20251123_add_user_status.test.sql" in test_paths
}

# Test 2: Regex Matching
test_regex_security if {
	content := "it('should test authentication', ...); it('should verify authorization', ...); it('should validate input validation', ...); it('should test security', ...)"
	
	# Test each pattern individually
	regex.match("authentication", content)
	regex.match("authorization", content)
	regex.match("input.*validation", content)
	regex.match("security", content)
	
	# Test combined pattern
	regex.match("authentication|authorization|input.*validation|security", content)
}

test_regex_migration if {
	content := "-- Test migration idempotency, data integrity, and rollback capability"
	
	# Test each pattern individually
	regex.match("migration.*idempotency", content)
	regex.match("data.*integrity", content)
	regex.match("rollback", content)
	
	# Test combined pattern
	regex.match("migration.*idempotency|data.*integrity|rollback", content)
}

# Test 3: Full has_security_tests check
test_has_security_tests_full if {
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
	
	# Check if has_security_tests returns true
	quality.has_security_tests("apps/api/src/auth/auth.service.ts", mock_input.changed_files)
}

# Test 4: Full has_data_migration_tests check
test_has_data_migration_tests_full if {
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
	
	# Check if has_data_migration_tests returns true
	quality.has_data_migration_tests("libs/common/prisma/migrations/20251123_add_user_status.sql", mock_input.changed_files)
}

# Test 5: Check if status field is needed
test_security_with_status if {
	mock_input := {
		"changed_files": [
			{
				"path": "apps/api/src/auth/auth.service.ts",
				"status": "modified",
				"content": "async function login() { ... }",
			},
			{
				"path": "apps/api/src/auth/auth.service.spec.ts",
				"status": "added",  # Add status field
				"content": "it('should test authentication', ...); it('should verify authorization', ...); it('should validate input validation', ...); it('should test security', ...)",
			},
		]
	}
	
	quality.has_security_tests("apps/api/src/auth/auth.service.ts", mock_input.changed_files)
}

test_migration_with_status if {
	mock_input := {
		"changed_files": [
			{
				"path": "libs/common/prisma/migrations/20251123_add_user_status.sql",
				"status": "added",
				"content": "ALTER TABLE users ADD COLUMN status VARCHAR(50);",
			},
			{
				"path": "libs/common/prisma/migrations/20251123_add_user_status.test.sql",
				"status": "added",  # Add status field
				"content": "-- Test migration idempotency, data integrity, and rollback capability",
			},
		]
	}
	
	quality.has_data_migration_tests("libs/common/prisma/migrations/20251123_add_user_status.sql", mock_input.changed_files)
}


