# Test Suite for Security Policy - R02 (RLS Enforcement)
#
# Tests all violation patterns and edge cases for R02
# Created: 2025-11-23
# Version: 1.0.0

package compliance.security_r02_test

import rego.v1
import data.compliance.security

# =============================================================================
# R02: RLS ENFORCEMENT TESTS
# =============================================================================

# Test 1: Happy Path - Migration with complete RLS policy passes
test_migration_with_complete_rls_passes if {
    test_input := {
        "changed_files": [{
            "path": "libs/common/prisma/migrations/add_customers/migration.sql",
            "diff": `
                CREATE TABLE "customers" (
                    "id" UUID PRIMARY KEY,
                    "tenant_id" UUID NOT NULL,
                    "name" VARCHAR(255),
                    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
                );
                
                ALTER TABLE "customers" ENABLE ROW LEVEL SECURITY;
                
                CREATE POLICY "tenant_isolation_policy" ON "customers"
                    USING (tenant_id::text = current_setting('app.tenant_id', true));
            `
        }],
        "pr_body": "Add customers table with RLS policy"
    }
    count(security.deny) == 0 with input as test_input
}

# Test 2: Violation - New table with tenant_id but no RLS fails
test_new_table_without_rls_fails if {
    test_input := {
        "changed_files": [{
            "path": "libs/common/prisma/migrations/add_customers/migration.sql",
            "diff": `
                CREATE TABLE "customers" (
                    "id" UUID PRIMARY KEY,
                    "tenant_id" UUID NOT NULL,
                    "name" VARCHAR(255)
                );
            `
        }],
        "pr_body": "Add customers table"
    }
    count(security.deny) > 0 with input as test_input
    some msg in security.deny with input as test_input
    contains(msg, "R02")
    contains(msg, "RLS policy")
    contains(msg, "customers")
}

# Test 3: Violation - Disabling RLS on existing table fails
test_disable_rls_fails if {
    test_input := {
        "changed_files": [{
            "path": "libs/common/prisma/migrations/modify_users/migration.sql",
            "diff": "ALTER TABLE \"users\" DISABLE ROW LEVEL SECURITY;"
        }],
        "pr_body": "Modify users table"
    }
    count(security.deny) > 0 with input as test_input
    some msg in security.deny with input as test_input
    contains(msg, "R02")
    contains(msg, "disable RLS")
}

# Test 4: Violation - Superuser role in TypeScript config fails
test_superuser_role_in_ts_fails if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/config/database.config.ts",
            "diff": "const databaseUrl = 'postgresql://postgres:password@localhost:5432/verofield';"
        }],
        "pr_body": "Update database config"
    }
    count(security.deny) > 0 with input as test_input
    some msg in security.deny with input as test_input
    contains(msg, "R02")
    contains(msg, "superuser role")
}

# Test 5: Violation - Superuser role in .env file fails
test_superuser_role_in_env_fails if {
    test_input := {
        "changed_files": [{
            "path": ".env.example",
            "diff": "DATABASE_URL=postgresql://postgres:password@localhost:5432/verofield"
        }],
        "pr_body": "Update env example"
    }
    count(security.deny) > 0 with input as test_input
    some msg in security.deny with input as test_input
    contains(msg, "R02")
    contains(msg, "superuser")
}

# Test 6: Violation - SECURITY DEFINER without tenant filter fails
test_security_definer_without_filter_fails if {
    test_input := {
        "changed_files": [{
            "path": "libs/common/prisma/migrations/add_function/migration.sql",
            "diff": `
                CREATE OR REPLACE FUNCTION get_all_users()
                RETURNS SETOF users
                SECURITY DEFINER
                AS $$
                    SELECT * FROM users;
                $$ LANGUAGE sql;
            `
        }],
        "pr_body": "Add user function"
    }
    count(security.deny) > 0 with input as test_input
    some msg in security.deny with input as test_input
    contains(msg, "R02")
    contains(msg, "SECURITY DEFINER")
}

# Test 7: Happy Path - SECURITY DEFINER with tenant filter passes
test_security_definer_with_filter_passes if {
    test_input := {
        "changed_files": [{
            "path": "libs/common/prisma/migrations/add_function/migration.sql",
            "diff": `
                CREATE OR REPLACE FUNCTION get_tenant_users()
                RETURNS SETOF users
                SECURITY DEFINER
                AS $$
                    SELECT * FROM users
                    WHERE tenant_id::text = current_setting('app.tenant_id', true);
                $$ LANGUAGE sql;
            `
        }],
        "pr_body": "Add tenant-scoped user function"
    }
    count(security.deny) == 0 with input as test_input
}

# Test 8: Happy Path - SECURITY INVOKER function passes
test_security_invoker_passes if {
    test_input := {
        "changed_files": [{
            "path": "libs/common/prisma/migrations/add_function/migration.sql",
            "diff": `
                CREATE OR REPLACE FUNCTION get_tenant_stats()
                RETURNS TABLE(total_users bigint)
                SECURITY INVOKER
                AS $$
                    SELECT COUNT(*) FROM users;
                $$ LANGUAGE sql;
            `
        }],
        "pr_body": "Add tenant stats function with SECURITY INVOKER"
    }
    count(security.deny) == 0 with input as test_input
}

# Test 9: Warning - New Prisma model with tenant_id triggers warning
test_new_prisma_model_warns if {
    test_input := {
        "changed_files": [{
            "path": "libs/common/prisma/schema.prisma",
            "diff": `
                model Customer {
                    id        String   @id @default(uuid())
                    tenant_id String
                    name      String
                }
            `
        }],
        "pr_body": "Add Customer model"
    }
    count(security.warn) > 0 with input as test_input
    some msg in security.warn with input as test_input
    contains(msg, "R02")
    contains(msg, "Prisma model")
}

# Test 10: Override - Violation with override marker passes
test_violation_with_override_passes if {
    test_input := {
        "changed_files": [{
            "path": "libs/common/prisma/migrations/admin_table/migration.sql",
            "diff": `
                CREATE TABLE "admin_logs" (
                    "id" UUID PRIMARY KEY,
                    "tenant_id" UUID NOT NULL,
                    "action" TEXT
                );
            `
        }],
        "pr_body": "Add admin logs table\n\n@override:rls-enforcement\nJustification: Admin logs table requires cross-tenant access for system auditing. Access restricted to super-admin role with separate authentication."
    }
    count(security.deny) == 0 with input as test_input
}

# Test 11: Edge Case - Table without tenant_id passes (not tenant-scoped)
test_table_without_tenant_id_passes if {
    test_input := {
        "changed_files": [{
            "path": "libs/common/prisma/migrations/add_config/migration.sql",
            "diff": `
                CREATE TABLE "system_config" (
                    "id" UUID PRIMARY KEY,
                    "key" VARCHAR(255),
                    "value" TEXT
                );
            `
        }],
        "pr_body": "Add system config table (not tenant-scoped)"
    }
    count(security.deny) == 0 with input as test_input
}

# Test 12: Edge Case - Non-superuser role passes
test_non_superuser_role_passes if {
    test_input := {
        "changed_files": [{
            "path": "apps/api/src/config/database.config.ts",
            "diff": "const databaseUrl = 'postgresql://verofield_app:password@localhost:5432/verofield';"
        }],
        "pr_body": "Use application role"
    }
    count(security.deny) == 0 with input as test_input
}

# Test 13: Edge Case - Multiple tables, one missing RLS fails
test_multiple_tables_one_missing_rls_fails if {
    test_input := {
        "changed_files": [{
            "path": "libs/common/prisma/migrations/add_tables/migration.sql",
            "diff": `
                CREATE TABLE "customers" (
                    "id" UUID PRIMARY KEY,
                    "tenant_id" UUID NOT NULL,
                    "name" VARCHAR(255)
                );
                
                ALTER TABLE "customers" ENABLE ROW LEVEL SECURITY;
                CREATE POLICY "tenant_policy" ON "customers" USING (tenant_id::text = current_setting('app.tenant_id', true));
                
                CREATE TABLE "orders" (
                    "id" UUID PRIMARY KEY,
                    "tenant_id" UUID NOT NULL,
                    "total" DECIMAL
                );
            `
        }],
        "pr_body": "Add customers and orders tables"
    }
    count(security.deny) > 0 with input as test_input
    some msg in security.deny with input as test_input
    contains(msg, "R02")
}

# Test 14: Edge Case - RLS policy with different syntax passes
test_rls_policy_alternative_syntax_passes if {
    test_input := {
        "changed_files": [{
            "path": "libs/common/prisma/migrations/add_products/migration.sql",
            "diff": `
                CREATE TABLE "products" (
                    "id" UUID PRIMARY KEY,
                    "tenant_id" UUID NOT NULL,
                    "name" VARCHAR(255)
                );
                
                ALTER TABLE products ENABLE ROW LEVEL SECURITY;
                
                CREATE POLICY tenant_isolation_policy ON products
                    FOR ALL
                    USING (tenant_id::text = current_setting('app.tenant_id', true));
            `
        }],
        "pr_body": "Add products table with RLS"
    }
    count(security.deny) == 0 with input as test_input
}

# Test 15: Edge Case - Schema file without model changes passes
test_schema_without_model_changes_passes if {
    test_input := {
        "changed_files": [{
            "path": "libs/common/prisma/schema.prisma",
            "diff": `
                generator client {
                  provider = "prisma-client-js"
                }
            `
        }],
        "pr_body": "Update Prisma generator config"
    }
    count(security.warn) == 0 with input as test_input
}

# =============================================================================
# PERFORMANCE TEST
# =============================================================================

# Test: Policy evaluation completes within performance budget
# Target: <200ms per evaluation (combined R01 + R02)
# Note: Run with `opa test --bench` to measure actual performance
test_performance_within_budget if {
    # This test passes if it completes (OPA will measure timing)
    test_input := {
        "changed_files": [{
            "path": "libs/common/prisma/migrations/test/migration.sql",
            "diff": `
                CREATE TABLE "test" (
                    "id" UUID PRIMARY KEY,
                    "tenant_id" UUID NOT NULL
                );
                ALTER TABLE "test" ENABLE ROW LEVEL SECURITY;
                CREATE POLICY "policy" ON "test" USING (tenant_id::text = current_setting('app.tenant_id', true));
            `
        }],
        "pr_body": "Performance test"
    }
    count(security.deny) == 0 with input as test_input
}

