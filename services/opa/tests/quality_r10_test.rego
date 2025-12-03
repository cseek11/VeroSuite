package compliance.quality_test

import rego.v1
import data.compliance.quality

# ============================================================================
# R10: TESTING COVERAGE TESTS
# ============================================================================

# TEST 1: Happy Path - New Feature with Unit Tests
test_new_feature_with_tests_pass if {
    test_input := {
        "changed_files": [
            {
                "path": "apps/api/src/users/users.service.ts",
                "status": "added",
                "diff": "+ export class UsersService {\n+   async createUser(data: CreateUserDto) {\n+     return this.prisma.user.create({ data });\n+   }\n+ }"
            },
            {
                "path": "apps/api/src/users/users.service.spec.ts",
                "status": "added",
                "diff": "+ describe('UsersService', () => {\n+   it('should create user', () => {});\n+ });"
            }
        ],
        "pr_title": "feat: Add user creation",
        "pr_body": "Adds user creation functionality"
    }
    
    count(quality.missing_unit_tests_violations) == 0 with input as test_input
}

# TEST 2: Happy Path - Bug Fix with Regression Test
test_bug_fix_with_regression_test_pass if {
    test_input := {
        "changed_files": [
            {
                "path": "apps/api/src/users/users.service.ts",
                "status": "modified",
                "diff": "+ // Fix: Handle special characters in email\n+ const sanitizedEmail = email.trim().toLowerCase();"
            },
            {
                "path": "apps/api/src/users/users.service.spec.ts",
                "status": "modified",
                "diff": "+ it('should handle email with special characters (regression for #123)', () => {\n+   // Test reproduces bug scenario\n+ });"
            }
        ],
        "pr_title": "fix: Handle special characters in email",
        "pr_body": "Fixes #123"
    }
    
    count(quality.missing_regression_tests_violations) == 0 with input as test_input
}

# TEST 3: Happy Path - Coverage Meets Threshold
test_coverage_meets_threshold_pass if {
    test_input := {
        "changed_files": [
            {
                "path": "apps/api/src/users/users.service.ts",
                "status": "added"
            }
        ],
        "coverage_report": {
            "files": {
                "apps/api/src/users/users.service.ts": {
                    "coverage": {
                        "statements": {"pct": 85},
                        "branches": {"pct": 82},
                        "functions": {"pct": 88},
                        "lines": {"pct": 86}
                    }
                }
            }
        },
        "pr_title": "feat: Add user service",
        "pr_body": ""
    }
    
    count(quality.coverage_below_threshold_violations) == 0 with input as test_input
}

# TEST 4: Violation - Missing Unit Tests
test_missing_unit_tests_violation if {
    test_input := {
        "changed_files": [
            {
                "path": "apps/api/src/users/users.service.ts",
                "status": "added",
                "diff": "+ export class UsersService {\n+   async createUser(data: CreateUserDto) {\n+     return this.prisma.user.create({ data });\n+   }\n+ }"
            }
        ],
        "pr_title": "feat: Add user creation",
        "pr_body": ""
    }
    
    count(quality.missing_unit_tests_violations) > 0 with input as test_input
}

# TEST 5: Violation - Missing Regression Test
test_missing_regression_test_violation if {
    test_input := {
        "changed_files": [
            {
                "path": "apps/api/src/users/users.service.ts",
                "status": "modified",
                "diff": "+ // Fix: Handle special characters in email\n+ const sanitizedEmail = email.trim().toLowerCase();"
            }
        ],
        "pr_title": "fix: Handle special characters in email",
        "pr_body": "Fixes #123"
    }
    
    count(quality.missing_regression_tests_violations) > 0 with input as test_input
}

# TEST 6: Violation - Coverage Below Threshold
test_coverage_below_threshold_violation if {
    test_input := {
        "changed_files": [
            {
                "path": "apps/api/src/users/users.service.ts",
                "status": "added"
            }
        ],
        "coverage_report": {
            "files": {
                "apps/api/src/users/users.service.ts": {
                    "coverage": {
                        "statements": {"pct": 60},
                        "branches": {"pct": 55},
                        "functions": {"pct": 70},
                        "lines": {"pct": 65}
                    }
                }
            }
        },
        "pr_title": "feat: Add user service",
        "pr_body": ""
    }
    
    count(quality.coverage_below_threshold_violations) > 0 with input as test_input
}

# TEST 7: Violation - Tests Skipped Without Documentation
test_tests_skipped_violation if {
    test_input := {
        "changed_files": [
            {
                "path": "apps/api/src/users/users.service.spec.ts",
                "status": "modified",
                "diff": "+ describe.skip('UserService', () => {\n+   it('should create user', () => {});\n+ });"
            }
        ],
        "pr_title": "test: Skip failing test",
        "pr_body": ""
    }
    
    count(quality.tests_skipped_violations) > 0 with input as test_input
}

# TEST 8: Violation - Coverage Delta Negative
test_coverage_delta_negative_violation if {
    test_input := {
        "changed_files": [
            {
                "path": "apps/api/src/users/users.service.ts",
                "status": "modified"
            }
        ],
        "coverage_delta": {
            "files": {
                "apps/api/src/users/users.service.ts": {
                    "delta": {
                        "statements": -10,
                        "branches": -8,
                        "functions": -6,
                        "lines": -9
                    }
                }
            }
        },
        "pr_title": "refactor: Update user service",
        "pr_body": ""
    }
    
    count(quality.coverage_delta_negative_violations) > 0 with input as test_input
}

# TEST 9: Warning - Incomplete Test Coverage
test_incomplete_coverage_warning if {
    test_input := {
        "changed_files": [
            {
                "path": "apps/api/src/users/users.service.ts",
                "status": "added"
            }
        ],
        "coverage_report": {
            "files": {
                "apps/api/src/users/users.service.ts": {
                    "coverage": {
                        "statements": {"pct": 75},
                        "branches": {"pct": 72},
                        "functions": {"pct": 78},
                        "lines": {"pct": 76}
                    }
                }
            }
        },
        "pr_title": "feat: Add user service",
        "pr_body": ""
    }
    
    count(quality.incomplete_test_coverage_warnings) > 0 with input as test_input
}

# TEST 10: Override - With Marker
test_override_with_marker if {
    test_input := {
        "changed_files": [
            {
                "path": "apps/api/src/users/users.service.ts",
                "status": "added"
            }
        ],
        "pr_title": "feat: Add user service",
        "pr_body": "@override:test-coverage\nReason: Tests will be added in follow-up PR #124"
    }
    
    # Should not deny when override present
    count(quality.deny) == 0 with input as test_input
}

# TEST 11: Edge Case - Modified File with New Functions
test_modified_file_new_functions if {
    test_input := {
        "changed_files": [
            {
                "path": "apps/api/src/users/users.service.ts",
                "status": "modified",
                "diff": "+ async deleteUser(id: string) {\n+   return this.prisma.user.delete({ where: { id } });\n+ }"
            }
        ],
        "pr_title": "feat: Add user deletion",
        "pr_body": ""
    }
    
    # Should flag missing test file update
    count(quality.missing_unit_tests_violations) > 0 with input as test_input
}

# TEST 12: Edge Case - Test File in __tests__ Directory
test_test_file_in_tests_directory if {
    test_input := {
        "changed_files": [
            {
                "path": "apps/api/src/users/users.service.ts",
                "status": "added"
            },
            {
                "path": "apps/api/src/users/__tests__/users.service.test.ts",
                "status": "added"
            }
        ],
        "pr_title": "feat: Add user service",
        "pr_body": ""
    }
    
    # Should pass - test file exists in __tests__ directory
    count(quality.missing_unit_tests_violations) == 0 with input as test_input
}




