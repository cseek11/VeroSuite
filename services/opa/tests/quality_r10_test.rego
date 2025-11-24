package verofield.quality_test

import future.keywords.if
import data.verofield.quality

# ============================================================================
# R10: TESTING COVERAGE TESTS
# ============================================================================

# TEST 1: Happy Path - New Feature with Unit Tests
test_new_feature_with_tests_pass if {
    input := {
        "files": [
            {
                "path": "apps/api/src/users/users.service.ts",
                "status": "added",
                "diff_lines": [
                    "+ export class UsersService {",
                    "+   async createUser(data: CreateUserDto) {",
                    "+     return this.prisma.user.create({ data });",
                    "+   }",
                    "+ }"
                ]
            },
            {
                "path": "apps/api/src/users/users.service.spec.ts",
                "status": "added",
                "diff_lines": [
                    "+ describe('UsersService', () => {",
                    "+   it('should create user', () => {});",
                    "+ });"
                ]
            }
        ],
        "pr_title": "feat: Add user creation",
        "pr_body": "Adds user creation functionality",
        "pr_body_lines": []
    }
    
    count(quality.missing_unit_tests_violations) == 0
}

# TEST 2: Happy Path - Bug Fix with Regression Test
test_bug_fix_with_regression_test_pass if {
    input := {
        "files": [
            {
                "path": "apps/api/src/users/users.service.ts",
                "status": "modified",
                "diff_lines": [
                    "+ // Fix: Handle special characters in email",
                    "+ const sanitizedEmail = email.trim().toLowerCase();"
                ]
            },
            {
                "path": "apps/api/src/users/users.service.spec.ts",
                "status": "modified",
                "diff_lines": [
                    "+ it('should handle email with special characters (regression for #123)', () => {",
                    "+   // Test reproduces bug scenario",
                    "+ });"
                ]
            }
        ],
        "pr_title": "fix: Handle special characters in email",
        "pr_body": "Fixes #123",
        "pr_body_lines": ["Fixes #123"]
    }
    
    count(quality.missing_regression_tests_violations) == 0
}

# TEST 3: Happy Path - Coverage Meets Threshold
test_coverage_meets_threshold_pass if {
    input := {
        "files": [
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
        "pr_body": "",
        "pr_body_lines": []
    }
    
    count(quality.coverage_below_threshold_violations) == 0
}

# TEST 4: Violation - Missing Unit Tests
test_missing_unit_tests_violation if {
    input := {
        "files": [
            {
                "path": "apps/api/src/users/users.service.ts",
                "status": "added",
                "diff_lines": [
                    "+ export class UsersService {",
                    "+   async createUser(data: CreateUserDto) {",
                    "+     return this.prisma.user.create({ data });",
                    "+   }",
                    "+ }"
                ]
            }
        ],
        "pr_title": "feat: Add user creation",
        "pr_body": "",
        "pr_body_lines": []
    }
    
    count(quality.missing_unit_tests_violations) > 0
}

# TEST 5: Violation - Missing Regression Test
test_missing_regression_test_violation if {
    input := {
        "files": [
            {
                "path": "apps/api/src/users/users.service.ts",
                "status": "modified",
                "diff_lines": [
                    "+ // Fix: Handle special characters in email",
                    "+ const sanitizedEmail = email.trim().toLowerCase();"
                ]
            }
        ],
        "pr_title": "fix: Handle special characters in email",
        "pr_body": "Fixes #123",
        "pr_body_lines": ["Fixes #123"]
    }
    
    count(quality.missing_regression_tests_violations) > 0
}

# TEST 6: Violation - Coverage Below Threshold
test_coverage_below_threshold_violation if {
    input := {
        "files": [
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
        "pr_body": "",
        "pr_body_lines": []
    }
    
    count(quality.coverage_below_threshold_violations) > 0
}

# TEST 7: Violation - Tests Skipped Without Documentation
test_tests_skipped_violation if {
    input := {
        "files": [
            {
                "path": "apps/api/src/users/users.service.spec.ts",
                "status": "modified",
                "diff_lines": [
                    "+ describe.skip('UserService', () => {",
                    "+   it('should create user', () => {});",
                    "+ });"
                ]
            }
        ],
        "pr_title": "test: Skip failing test",
        "pr_body": "",
        "pr_body_lines": []
    }
    
    count(quality.tests_skipped_violations) > 0
}

# TEST 8: Violation - Coverage Delta Negative
test_coverage_delta_negative_violation if {
    input := {
        "files": [
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
        "pr_body": "",
        "pr_body_lines": []
    }
    
    count(quality.coverage_delta_negative_violations) > 0
}

# TEST 9: Warning - Incomplete Test Coverage
test_incomplete_coverage_warning if {
    input := {
        "files": [
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
        "pr_body": "",
        "pr_body_lines": []
    }
    
    count(quality.incomplete_test_coverage_warnings) > 0
}

# TEST 10: Override - With Marker
test_override_with_marker if {
    input := {
        "files": [
            {
                "path": "apps/api/src/users/users.service.ts",
                "status": "added"
            }
        ],
        "pr_title": "feat: Add user service",
        "pr_body": "",
        "pr_body_lines": [
            "@override:test-coverage",
            "Reason: Tests will be added in follow-up PR #124"
        ]
    }
    
    # Should not deny when override present
    count(quality.deny) == 0
}

# TEST 11: Edge Case - Modified File with New Functions
test_modified_file_new_functions if {
    input := {
        "files": [
            {
                "path": "apps/api/src/users/users.service.ts",
                "status": "modified",
                "diff_lines": [
                    "+ async deleteUser(id: string) {",
                    "+   return this.prisma.user.delete({ where: { id } });",
                    "+ }"
                ]
            }
        ],
        "pr_title": "feat: Add user deletion",
        "pr_body": "",
        "pr_body_lines": []
    }
    
    # Should flag missing test file update
    count(quality.missing_unit_tests_violations) > 0
}

# TEST 12: Edge Case - Test File in __tests__ Directory
test_test_file_in_tests_directory if {
    input := {
        "files": [
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
        "pr_body": "",
        "pr_body_lines": []
    }
    
    # Should pass - test file exists in __tests__ directory
    count(quality.missing_unit_tests_violations) == 0
}



