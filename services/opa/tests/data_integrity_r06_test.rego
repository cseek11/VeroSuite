package compliance.data_integrity_test

import rego.v1
import data.compliance.data_integrity

# Test data for R06: Breaking Change Documentation

# =============================================================================
# TEST 1: Happy Path - Breaking change with complete documentation
# =============================================================================

test_r06_happy_path_complete_documentation if {
    test_input := {
        "pr_title": "[BREAKING] Remove legacy authentication endpoints (v2.0.0)",
        "changed_files": [
            {
                "path": "apps/api/src/auth/auth.controller.ts",
                "diff": "-@Get('/api/v1/auth/login')\n-export function login() { ... }",
                "status": "modified"
            },
            {
                "path": "docs/migrations/2025-11-23-auth-v2-migration.md",
                "diff": "+# Migration Guide: Authentication v2.0",
                "status": "added"
            },
            {
                "path": "package.json",
                "diff": "-  \"version\": \"1.5.3\"\n+  \"version\": \"2.0.0\"",
                "status": "modified"
            },
            {
                "path": "CHANGELOG.md",
                "diff": "+## [2.0.0] - 2025-11-23\n+### Breaking Changes\n+- Removed legacy auth endpoints",
                "status": "modified"
            }
        ],
        "pr_body": "Remove legacy authentication endpoints. See migration guide for details."
    }
    
    # Should have no violations
    count(data.compliance.data_integrity.deny) == 0 with input as test_input
}

# =============================================================================
# TEST 2: Happy Path - API breaking change with docs update
# =============================================================================

test_r06_happy_path_api_with_docs if {
    test_input := {
        "pr_title": "[BREAKING] Change error response format",
        "changed_files": [
            {
                "path": "apps/api/src/common/filters/http-exception.filter.ts",
                "diff": "-export interface ErrorResponse { message: string }\n+export interface ErrorResponse { code: string; message: string }",
                "status": "modified"
            },
            {
                "path": "docs/migrations/2025-11-23-error-format-migration.md",
                "diff": "+# Migration Guide",
                "status": "added"
            },
            {
                "path": "package.json",
                "diff": "-  \"version\": \"1.5.3\"\n+  \"version\": \"2.0.0\"",
                "status": "modified"
            },
            {
                "path": "CHANGELOG.md",
                "diff": "+### Breaking Changes",
                "status": "modified"
            },
            {
                "path": "docs/api/openapi.yaml",
                "diff": "+  ErrorResponse:\n+    code: string",
                "status": "modified"
            }
        ],
        "pr_body": "Change error response format"
    }
    
    # Should have no violations (API docs updated)
    count(data.compliance.data_integrity.deny) == 0 with input as test_input
}

# =============================================================================
# TEST 3: Happy Path - Database breaking change with migration guide
# =============================================================================

test_r06_happy_path_database_breaking if {
    test_input := {
        "pr_title": "[BREAKING] Remove legacy_token column from users table",
        "changed_files": [
            {
                "path": "libs/common/prisma/migrations/20251123120000_remove_legacy_token/migration.sql",
                "diff": "+ALTER TABLE users DROP COLUMN legacy_token;",
                "status": "added"
            },
            {
                "path": "docs/migrations/2025-11-23-remove-legacy-token-migration.md",
                "diff": "+# Migration Guide",
                "status": "added"
            },
            {
                "path": "package.json",
                "diff": "-  \"version\": \"1.5.3\"\n+  \"version\": \"2.0.0\"",
                "status": "modified"
            },
            {
                "path": "CHANGELOG.md",
                "diff": "+### Breaking Changes",
                "status": "modified"
            }
        ],
        "pr_body": "Remove legacy_token column"
    }
    
    # Should have no violations
    count(data.compliance.data_integrity.deny) == 0 with input as test_input
}

# =============================================================================
# TEST 4: Violation - Breaking change without [BREAKING] tag
# =============================================================================

test_r06_violation_missing_breaking_tag if {
    test_input := {
        "pr_title": "Remove legacy authentication endpoints",
        "changed_files": [
            {
                "path": "apps/api/src/auth/auth.controller.ts",
                "diff": "-@Get('/api/v1/auth/login')\n-export function login() { ... }",
                "status": "modified"
            }
        ],
        "pr_body": "Cleanup authentication code"
    }
    
    violations := data.compliance.data_integrity.deny with input as test_input
    count(violations) > 0
    
    # Should contain message about missing [BREAKING] tag
    some msg in violations
    contains(msg, "Breaking change detected")
    contains(msg, "[BREAKING] tag")
}

# =============================================================================
# TEST 5: Violation - [BREAKING] tag without migration guide
# =============================================================================

test_r06_violation_missing_migration_guide if {
    test_input := {
        "pr_title": "[BREAKING] Remove legacy authentication endpoints",
        "changed_files": [
            {
                "path": "apps/api/src/auth/auth.controller.ts",
                "diff": "-@Get('/api/v1/auth/login')",
                "status": "modified"
            }
        ],
        "pr_body": "Remove legacy auth"
    }
    
    violations := data.compliance.data_integrity.deny with input as test_input
    count(violations) > 0
    
    # Should contain message about missing migration guide
    some msg in violations
    contains(msg, "migration guide")
}

# =============================================================================
# TEST 6: Violation - [BREAKING] tag without version bump
# =============================================================================

test_r06_violation_missing_version_bump if {
    test_input := {
        "pr_title": "[BREAKING] Remove legacy authentication endpoints",
        "changed_files": [
            {
                "path": "apps/api/src/auth/auth.controller.ts",
                "diff": "-@Get('/api/v1/auth/login')",
                "status": "modified"
            },
            {
                "path": "docs/migrations/2025-11-23-auth-v2-migration.md",
                "diff": "+# Migration Guide",
                "status": "added"
            }
        ],
        "pr_body": "Remove legacy auth"
    }
    
    violations := data.compliance.data_integrity.deny with input as test_input
    count(violations) > 0
    
    # Should contain message about missing version bump
    some msg in violations
    contains(msg, "version bump")
}

# =============================================================================
# TEST 7: Violation - [BREAKING] tag without CHANGELOG update
# =============================================================================

test_r06_violation_missing_changelog if {
    test_input := {
        "pr_title": "[BREAKING] Remove legacy authentication endpoints",
        "changed_files": [
            {
                "path": "apps/api/src/auth/auth.controller.ts",
                "diff": "-@Get('/api/v1/auth/login')",
                "status": "modified"
            },
            {
                "path": "docs/migrations/2025-11-23-auth-v2-migration.md",
                "diff": "+# Migration Guide",
                "status": "added"
            },
            {
                "path": "package.json",
                "diff": "-  \"version\": \"1.5.3\"\n+  \"version\": \"2.0.0\"",
                "status": "modified"
            }
        ],
        "pr_body": "Remove legacy auth"
    }
    
    violations := data.compliance.data_integrity.deny with input as test_input
    count(violations) > 0
    
    # Should contain message about missing CHANGELOG
    some msg in violations
    contains(msg, "CHANGELOG")
}

# =============================================================================
# TEST 8: Warning - API breaking change without docs update
# =============================================================================

test_r06_warning_api_without_docs if {
    test_input := {
        "pr_title": "[BREAKING] Change API response format",
        "changed_files": [
            {
                "path": "apps/api/src/users/users.controller.ts",
                "diff": "-export interface UserResponse { email: string }\n+export interface UserResponse { emailAddress: string }",
                "status": "modified"
            },
            {
                "path": "docs/migrations/2025-11-23-api-response-migration.md",
                "diff": "+# Migration Guide",
                "status": "added"
            },
            {
                "path": "package.json",
                "diff": "-  \"version\": \"1.5.3\"\n+  \"version\": \"2.0.0\"",
                "status": "modified"
            },
            {
                "path": "CHANGELOG.md",
                "diff": "+### Breaking Changes",
                "status": "modified"
            }
        ],
        "pr_body": "Change API response format"
    }
    
    warnings := data.compliance.data_integrity.warn with input as test_input
    count(warnings) > 0
    
    # Should warn about missing API docs
    some msg in warnings
    contains(msg, "API")
    contains(msg, "documentation")
}

# =============================================================================
# TEST 9: Override - With @override:breaking-change marker
# =============================================================================

test_r06_override_with_marker if {
    test_input := {
        "pr_title": "Remove legacy authentication endpoints",
        "changed_files": [
            {
                "path": "apps/api/src/auth/auth.controller.ts",
                "diff": "-@Get('/api/v1/auth/login')",
                "status": "modified"
            }
        ],
        "pr_body": "@override:breaking-change\nReason: This is internal refactoring, not a breaking change for consumers. Endpoints are already deprecated and unused."
    }
    
    # Should have no violations (override marker present)
    count(data.compliance.data_integrity.deny) == 0 with input as test_input
}

# =============================================================================
# TEST 10: Edge Case - Multiple breaking changes
# =============================================================================

test_r06_edge_case_multiple_breaking_changes if {
    test_input := {
        "pr_title": "[BREAKING] Major API refactor",
        "changed_files": [
            {
                "path": "apps/api/src/auth/auth.controller.ts",
                "diff": "-@Get('/api/v1/auth/login')",
                "status": "modified"
            },
            {
                "path": "apps/api/src/users/users.controller.ts",
                "diff": "-@Get('/api/v1/users/:id')",
                "status": "modified"
            },
            {
                "path": "libs/common/prisma/migrations/20251123120000_remove_columns/migration.sql",
                "diff": "+ALTER TABLE users DROP COLUMN legacy_field;",
                "status": "added"
            },
            {
                "path": "docs/migrations/2025-11-23-major-refactor-migration.md",
                "diff": "+# Migration Guide",
                "status": "added"
            },
            {
                "path": "package.json",
                "diff": "-  \"version\": \"1.5.3\"\n+  \"version\": \"2.0.0\"",
                "status": "modified"
            },
            {
                "path": "CHANGELOG.md",
                "diff": "+### Breaking Changes",
                "status": "modified"
            }
        ],
        "pr_body": "Major API refactor with multiple breaking changes"
    }
    
    # Should have no violations (all requirements met)
    count(data.compliance.data_integrity.deny) == 0 with input as test_input
}

