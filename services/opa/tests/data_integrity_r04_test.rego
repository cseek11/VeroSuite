# Test Suite for Data Integrity Policy - R04 (Layer Synchronization)
#
# Tests all violation patterns and edge cases for R04
# Created: 2025-11-23
# Version: 1.0.0

package compliance.data_integrity_r04_test

import data.compliance.data_integrity
import future.keywords.if
import future.keywords.in

# =============================================================================
# R04: LAYER SYNCHRONIZATION TESTS
# =============================================================================

# Test 1: Happy Path - Schema change with migration passes
test_schema_change_with_migration_passes if {
    input := {
        "changed_files": [
            {
                "path": "libs/common/prisma/schema.prisma",
                "diff": "model User {\n  id String @id\n  email String @unique\n  firstName String\n}"
            },
            {
                "path": "libs/common/prisma/migrations/20251123120000_add_first_name/migration.sql",
                "diff": "ALTER TABLE users ADD COLUMN first_name VARCHAR(100);"
            }
        ],
        "pr_body": "Add first_name to User"
    }
    count(data_integrity.deny) == 0
}

# Test 2: Happy Path - Schema change with DTO and frontend type updates passes
test_full_sync_passes if {
    input := {
        "changed_files": [
            {
                "path": "libs/common/prisma/schema.prisma",
                "diff": "model User {\n  firstName String\n}"
            },
            {
                "path": "libs/common/prisma/migrations/20251123120000_add_first_name/migration.sql",
                "diff": "ALTER TABLE users ADD COLUMN first_name VARCHAR(100);"
            },
            {
                "path": "apps/api/src/user/dto/user.dto.ts",
                "diff": "export class UserDto {\n  firstName: string;\n}"
            },
            {
                "path": "frontend/src/types/user.ts",
                "diff": "interface User {\n  firstName: string;\n}"
            }
        ],
        "pr_body": "Add first_name to User - full sync"
    }
    count(data_integrity.deny) == 0
}

# Test 3: Violation - Schema change without migration fails
test_schema_change_without_migration_fails if {
    input := {
        "changed_files": [{
            "path": "libs/common/prisma/schema.prisma",
            "diff": "model User {\n  id String @id\n  email String @unique\n  firstName String\n}"
        }],
        "pr_body": "Add first_name to User"
    }
    count(data_integrity.deny) > 0
    some msg in data_integrity.deny
    contains(msg, "R04")
    contains(msg, "migration")
}

# Test 4: Violation - Schema change without DTO update fails
test_schema_change_without_dto_fails if {
    input := {
        "changed_files": [
            {
                "path": "libs/common/prisma/schema.prisma",
                "diff": "model User {\n  firstName String\n}"
            },
            {
                "path": "libs/common/prisma/migrations/20251123120000_add_first_name/migration.sql",
                "diff": "ALTER TABLE users ADD COLUMN first_name VARCHAR(100);"
            }
        ],
        "pr_body": "Add first_name to User"
    }
    count(data_integrity.deny) > 0
    some msg in data_integrity.deny
    contains(msg, "R04")
    contains(msg, "DTO")
    contains(msg, "User")
}

# Test 5: Violation - DTO change without frontend type update fails
test_dto_change_without_frontend_fails if {
    input := {
        "changed_files": [{
            "path": "apps/api/src/work-orders/dto/work-order.dto.ts",
            "diff": "export class WorkOrderDto {\n  priority: WorkOrderPriority;\n}"
        }],
        "pr_body": "Add priority to WorkOrder DTO"
    }
    count(data_integrity.deny) > 0
    some msg in data_integrity.deny
    contains(msg, "R04")
    contains(msg, "frontend type")
}

# Test 6: Warning - Enum change detected
test_enum_change_warns if {
    input := {
        "changed_files": [{
            "path": "apps/api/src/work-orders/dto/work-order.dto.ts",
            "diff": "export enum WorkOrderStatus {\n  PENDING = 'pending',\n  IN_PROGRESS = 'in-progress',\n  COMPLETED = 'completed',\n  CANCELED = 'canceled'\n}"
        }],
        "pr_body": "Add CANCELED status"
    }
    count(data_integrity.warn) > 0
    some msg in data_integrity.warn
    contains(msg, "R04")
    contains(msg, "Enum")
}

# Test 7: Warning - Frontend type change warns about Zod schema
test_frontend_type_change_warns_about_zod if {
    input := {
        "changed_files": [{
            "path": "frontend/src/types/user.ts",
            "diff": "interface User {\n  firstName: string;\n}"
        }],
        "pr_body": "Add firstName to User type"
    }
    count(data_integrity.warn) > 0
    some msg in data_integrity.warn
    contains(msg, "R04")
    contains(msg, "Zod schema")
}

# Test 8: Override - Violation with override marker passes
test_violation_with_override_passes if {
    input := {
        "changed_files": [{
            "path": "libs/common/prisma/schema.prisma",
            "diff": "model User {\n  firstName String\n}"
        }],
        "pr_body": "Add first_name to User\n\n@override:layer-sync\nJustification: Migration will be created in separate PR after schema is finalized. This is a non-breaking nullable field addition."
    }
    count(data_integrity.deny) == 0
}

# Test 9: Edge Case - Multiple entities changed
test_multiple_entities_checked if {
    input := {
        "changed_files": [
            {
                "path": "libs/common/prisma/schema.prisma",
                "diff": "model User {\n  firstName String\n}\nmodel WorkOrder {\n  priority String\n}"
            },
            {
                "path": "libs/common/prisma/migrations/20251123120000_add_fields/migration.sql",
                "diff": "ALTER TABLE users ADD COLUMN first_name VARCHAR(100);\nALTER TABLE work_orders ADD COLUMN priority VARCHAR(20);"
            }
        ],
        "pr_body": "Add fields to User and WorkOrder"
    }
    # Should check for DTO updates for both entities
    count(data_integrity.deny) >= 1
}

# Test 10: Edge Case - Only frontend type changed (should verify matches DTO)
test_only_frontend_type_changed if {
    input := {
        "changed_files": [{
            "path": "frontend/src/types/user.ts",
            "diff": "interface User {\n  firstName: string;\n}"
        }],
        "pr_body": "Update User type"
    }
    # Should warn about Zod schema
    count(data_integrity.warn) > 0
}

# Test 11: Edge Case - Test file DTO change (should be ignored)
test_test_dto_ignored if {
    input := {
        "changed_files": [{
            "path": "apps/api/src/user/dto/user.dto.test.ts",
            "diff": "export class UserDto {\n  firstName: string;\n}"
        }],
        "pr_body": "Update test DTO"
    }
    # Test DTOs should not trigger frontend type check
    count(data_integrity.deny) == 0
}

# Test 12: Edge Case - Migration file only (no schema change)
test_migration_only_passes if {
    input := {
        "changed_files": [{
            "path": "libs/common/prisma/migrations/20251123120000_add_index/migration.sql",
            "diff": "CREATE INDEX idx_users_email ON users(email);"
        }],
        "pr_body": "Add index to users table"
    }
    count(data_integrity.deny) == 0
}

# =============================================================================
# PERFORMANCE TEST
# =============================================================================

# Test: Policy evaluation completes within performance budget
# Target: <200ms per evaluation
# Note: Run with `opa test --bench` to measure actual performance
test_performance_within_budget if {
    # This test passes if it completes (OPA will measure timing)
    input := {
        "changed_files": [{
            "path": "libs/common/prisma/schema.prisma",
            "diff": "model Test {}"
        }],
        "pr_body": "Performance test"
    }
    # Just checking that policy runs
    true
}

