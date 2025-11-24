# R02: RLS Enforcement — Step 5 Procedures (DRAFT)

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-11-23  
**Rule:** R02 - RLS Enforcement  
**Priority:** CRITICAL (Tier 1 - BLOCK)

---

## R02: RLS Enforcement — Step 5 Procedures

### Rule-Specific Audit Checklist

For code changes affecting **database schema, migrations, or database configuration**:

#### RLS Policy Configuration
- [ ] **MANDATORY:** Verify RLS policies exist for all tenant-scoped tables
- [ ] **MANDATORY:** Verify `ENABLE ROW LEVEL SECURITY` is set on tenant-scoped tables
- [ ] **MANDATORY:** Verify RLS policies use `app.tenant_id` context variable
- [ ] **MANDATORY:** Verify RLS policies block cross-tenant access
- [ ] **MANDATORY:** Verify no `FORCE ROW LEVEL SECURITY` bypasses for application role
- [ ] **RECOMMENDED:** Verify RLS policies have corresponding tests

#### Database Role Configuration
- [ ] **MANDATORY:** Verify application uses non-superuser role (`verofield_app`)
- [ ] **MANDATORY:** Verify superuser role never used in application code
- [ ] **MANDATORY:** Verify role has appropriate permissions (SELECT, INSERT, UPDATE, DELETE)
- [ ] **MANDATORY:** Verify role cannot disable RLS policies
- [ ] **RECOMMENDED:** Verify role permissions follow principle of least privilege

#### Migration Files
- [ ] **MANDATORY:** Verify new tenant-scoped tables include RLS policies
- [ ] **MANDATORY:** Verify migrations don't disable existing RLS policies
- [ ] **MANDATORY:** Verify migrations include `tenant_id` column for tenant-scoped tables
- [ ] **MANDATORY:** Verify foreign keys maintain tenant isolation
- [ ] **RECOMMENDED:** Verify migration rollback preserves RLS policies

#### Application Code
- [ ] **MANDATORY:** Verify no code attempts to disable RLS (`ALTER TABLE ... DISABLE ROW LEVEL SECURITY`)
- [ ] **MANDATORY:** Verify no code uses `SECURITY DEFINER` functions to bypass RLS
- [ ] **MANDATORY:** Verify `withTenant()` wrapper sets `app.tenant_id` correctly
- [ ] **MANDATORY:** Verify no raw SQL bypasses RLS context
- [ ] **RECOMMENDED:** Verify connection pool uses correct role

---

### OPA Policy Mapping

**Policy File:** `services/opa/policies/security.rego` (R02 section)

**Violation Detection:**
- OPA checks for:
  - Migration files without RLS policies for tenant-scoped tables
  - Code attempting to disable RLS policies
  - Use of superuser role in application code
  - Missing `ENABLE ROW LEVEL SECURITY` statements
  - `SECURITY DEFINER` functions that bypass RLS
- Triggers on:
  - Changes to `*.sql` migration files
  - Changes to `schema.prisma` (new tenant-scoped models)
  - Changes to `database.service.ts` (role configuration)
  - Changes to connection pool configuration
- Enforcement level: **BLOCK** (Tier 1 MAD)

**Common Violations:**

1. **Missing RLS policy on new table**
   ```sql
   -- ❌ VIOLATION
   CREATE TABLE "customers" (
       "id" UUID PRIMARY KEY,
       "tenant_id" UUID NOT NULL,
       "name" VARCHAR(255)
   );
   
   -- ✅ CORRECT
   CREATE TABLE "customers" (
       "id" UUID PRIMARY KEY,
       "tenant_id" UUID NOT NULL,
       "name" VARCHAR(255)
   );
   
   ALTER TABLE "customers" ENABLE ROW LEVEL SECURITY;
   
   CREATE POLICY "tenant_isolation_policy" ON "customers"
       USING (tenant_id::text = current_setting('app.tenant_id', true));
   ```
   **Remediation:** Add RLS policy for all tenant-scoped tables

2. **Disabling RLS in migration**
   ```sql
   -- ❌ VIOLATION
   ALTER TABLE "users" DISABLE ROW LEVEL SECURITY;
   
   -- ✅ CORRECT
   -- Never disable RLS on tenant-scoped tables
   -- If needed, use override with justification
   ```
   **Remediation:** Remove RLS disable statement, use override if absolutely necessary

3. **Using superuser role in application**
   ```typescript
   // ❌ VIOLATION
   const connectionString = `postgresql://postgres:password@localhost/verofield`;
   
   // ✅ CORRECT
   const connectionString = `postgresql://verofield_app:password@localhost/verofield`;
   ```
   **Remediation:** Use non-superuser application role

4. **SECURITY DEFINER function bypassing RLS**
   ```sql
   -- ❌ VIOLATION
   CREATE OR REPLACE FUNCTION get_all_users()
   RETURNS SETOF users
   SECURITY DEFINER  -- Bypasses RLS
   AS $$
       SELECT * FROM users;
   $$ LANGUAGE sql;
   
   -- ✅ CORRECT
   CREATE OR REPLACE FUNCTION get_tenant_users()
   RETURNS SETOF users
   SECURITY INVOKER  -- Respects RLS
   AS $$
       SELECT * FROM users 
       WHERE tenant_id::text = current_setting('app.tenant_id', true);
   $$ LANGUAGE sql;
   ```
   **Remediation:** Use `SECURITY INVOKER` or add tenant filter in function

**[REVIEW NEEDED: Should R02 also check for missing tenant_id columns, or is that covered by R01?]**

---

### Automated Checks

**Script:** `.cursor/scripts/check-rls-enforcement.py`

**What it checks:**
- Scans migration files for new tables without RLS policies
- Detects `DISABLE ROW LEVEL SECURITY` statements
- Finds superuser role usage in connection strings
- Identifies `SECURITY DEFINER` functions
- Verifies `ENABLE ROW LEVEL SECURITY` statements exist

**Usage:**
```bash
# Check single migration file
python .cursor/scripts/check-rls-enforcement.py libs/common/prisma/migrations/*/migration.sql

# Check all migrations
python .cursor/scripts/check-rls-enforcement.py libs/common/prisma/migrations/

# Check schema changes
python .cursor/scripts/check-rls-enforcement.py libs/common/prisma/schema.prisma
```

**Output:**
```
Checking: libs/common/prisma/migrations/add_customers_table/migration.sql
❌ VIOLATION [Line 12]: New table 'customers' without RLS policy
   → Add: ALTER TABLE "customers" ENABLE ROW LEVEL SECURITY;
   → Add: CREATE POLICY "tenant_isolation_policy" ON "customers" USING (...)
⚠️  WARNING [Line 45]: Table 'customers' has tenant_id but no RLS policy
   → This table will not enforce tenant isolation at database level
```

**[REVIEW NEEDED: Should the script also validate RLS policy syntax, or just check for existence?]**

---

### Manual Verification

**When:** For all database schema changes, migrations, or RLS policy modifications

**Procedure:**
1. **Review RLS Policy Logic**
   - Verify policy uses `current_setting('app.tenant_id', true)`
   - Check policy logic matches application requirements
   - Ensure no policy bypasses tenant isolation

2. **Test RLS Enforcement**
   - Connect to database with application role
   - Set `app.tenant_id` to Tenant A
   - Attempt to query Tenant B data
   - Verify query returns empty (not error)

3. **Verify Role Permissions**
   - Check application role cannot disable RLS
   - Verify role has only necessary permissions
   - Confirm no superuser privileges

4. **Test Migration Rollback**
   - Run migration down (if applicable)
   - Verify RLS policies remain intact
   - Confirm no data exposed during rollback

**Verification Criteria:**
- [ ] RLS policies exist for all tenant-scoped tables
- [ ] RLS policies correctly filter by tenant_id
- [ ] Application role cannot bypass RLS
- [ ] Cross-tenant queries return empty results
- [ ] Migration rollback preserves RLS

**[REVIEW NEEDED: Should manual verification include performance testing of RLS policies?]**

---

### Integration with Existing Step 5

**Add to `.cursor/rules/01-enforcement.mdc` Step 5:**

```markdown
### Step 5: Post-Implementation Audit (MANDATORY) ⭐ **CRITICAL**

...existing checks...

- [ ] **MUST** verify RLS enforcement (if database schema changes)
  - Run: `python .cursor/scripts/check-rls-enforcement.py [migration_file]`
  - Verify: All tenant-scoped tables have RLS policies
  - Verify: No RLS disable statements
  - Verify: Application role is non-superuser
```

---

### OPA Policy Implementation

**File:** `services/opa/policies/security.rego` (extend existing)

**Policy Logic:**

```rego
# =============================================================================
# R02: RLS ENFORCEMENT (TIER 1 - BLOCK)
# =============================================================================

# Deny: New table with tenant_id but no RLS policy
deny contains msg if {
    some file in input.changed_files
    endswith(file.path, ".sql")
    contains(file.diff, "CREATE TABLE")
    contains(file.diff, "tenant_id")
    not contains(file.diff, "ENABLE ROW LEVEL SECURITY")
    not has_override_marker(input.pr_body, "rls-enforcement")
    
    # Extract table name for better error message
    table_match := regex.find_n(`CREATE TABLE "?(\w+)"?`, file.diff, 1)
    table_name := table_match[0][1] if count(table_match) > 0
    
    msg := sprintf(
        "HARD STOP [Security/R02]: New table '%s' with tenant_id column missing RLS policy in %s. Add: ALTER TABLE \"%s\" ENABLE ROW LEVEL SECURITY; and CREATE POLICY for tenant isolation.",
        [table_name, file.path, table_name]
    )
}

# Deny: Disabling RLS on existing table
deny contains msg if {
    some file in input.changed_files
    endswith(file.path, ".sql")
    regex.match(`ALTER TABLE.*DISABLE ROW LEVEL SECURITY`, file.diff)
    not has_override_marker(input.pr_body, "rls-enforcement")
    
    msg := sprintf(
        "HARD STOP [Security/R02]: Attempting to disable RLS in %s. This breaks tenant isolation. Remove DISABLE ROW LEVEL SECURITY statement.",
        [file.path]
    )
}

# Deny: Using superuser role in application code
deny contains msg if {
    some file in input.changed_files
    regex.match(`\.ts$|\.js$|\.env`, file.path)
    regex.match(`postgresql://postgres[@:]|DATABASE_URL.*postgres[@:]`, file.diff)
    not has_override_marker(input.pr_body, "rls-enforcement")
    
    msg := sprintf(
        "HARD STOP [Security/R02]: Using superuser role 'postgres' in %s. Application must use non-superuser role (e.g., 'verofield_app') to enforce RLS policies.",
        [file.path]
    )
}

# Deny: SECURITY DEFINER function without tenant filter
deny contains msg if {
    some file in input.changed_files
    endswith(file.path, ".sql")
    contains(file.diff, "SECURITY DEFINER")
    not contains(file.diff, "current_setting('app.tenant_id'")
    not has_override_marker(input.pr_body, "rls-enforcement")
    
    msg := sprintf(
        "HARD STOP [Security/R02]: SECURITY DEFINER function in %s may bypass RLS. Use SECURITY INVOKER or add explicit tenant_id filter in function.",
        [file.path]
    )
}

# Warning: Table with tenant_id but no RLS (might be intentional)
warn contains msg if {
    some file in input.changed_files
    endswith(file.path, "schema.prisma")
    contains(file.diff, "tenant_id")
    contains(file.diff, "model ")
    
    # Check if corresponding migration has RLS
    # This is a simplified check - full implementation would cross-reference migrations
    
    msg := sprintf(
        "WARNING [Security/R02]: New model with tenant_id in %s. Ensure corresponding migration includes RLS policy.",
        [file.path]
    )
}
```

**[REVIEW NEEDED: Should the OPA policy also validate RLS policy syntax, or just check for existence?]**

---

### Test Cases

**File:** `services/opa/tests/security_r02_test.rego`

**Test Coverage:**

1. **Happy Path:** Migration with RLS policy → No violation
2. **Violation:** New table without RLS → Deny
3. **Violation:** Disabling RLS → Deny
4. **Violation:** Superuser role in code → Deny
5. **Violation:** SECURITY DEFINER without filter → Deny
6. **Warning:** New model with tenant_id → Warn
7. **Override:** Violation with @override marker → Allow
8. **Edge Case:** Table without tenant_id → Pass (not tenant-scoped)

**Example Test:**

```rego
package compliance.security_r02_test

import data.compliance.security
import future.keywords.if

# Test: Migration with RLS policy passes
test_migration_with_rls_passes if {
    input := {
        "changed_files": [{
            "path": "libs/common/prisma/migrations/add_customers/migration.sql",
            "diff": `
                CREATE TABLE "customers" (
                    "id" UUID PRIMARY KEY,
                    "tenant_id" UUID NOT NULL,
                    "name" VARCHAR(255)
                );
                
                ALTER TABLE "customers" ENABLE ROW LEVEL SECURITY;
                
                CREATE POLICY "tenant_isolation_policy" ON "customers"
                    USING (tenant_id::text = current_setting('app.tenant_id', true));
            `
        }],
        "pr_body": "Add customers table with RLS"
    }
    count(security.deny) == 0
}

# Test: New table without RLS fails
test_new_table_without_rls_fails if {
    input := {
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
    count(security.deny) > 0
    some msg in security.deny
    contains(msg, "R02")
    contains(msg, "RLS policy")
}

# Test: Disabling RLS fails
test_disable_rls_fails if {
    input := {
        "changed_files": [{
            "path": "libs/common/prisma/migrations/modify_users/migration.sql",
            "diff": "ALTER TABLE \"users\" DISABLE ROW LEVEL SECURITY;"
        }],
        "pr_body": "Modify users table"
    }
    count(security.deny) > 0
    some msg in security.deny
    contains(msg, "R02")
    contains(msg, "disable RLS")
}

# Test: Superuser role in code fails
test_superuser_role_fails if {
    input := {
        "changed_files": [{
            "path": "apps/api/src/config/database.config.ts",
            "diff": "const url = 'postgresql://postgres:password@localhost/verofield';"
        }],
        "pr_body": "Update database config"
    }
    count(security.deny) > 0
    some msg in security.deny
    contains(msg, "R02")
    contains(msg, "superuser role")
}
```

---

### Performance Budget

**Target:** <200ms per policy evaluation

**Optimization:**
- Check file extension first (early exit)
- Use simple string matching before regex
- Cache regex compilation
- Limit diff scanning to relevant sections

**Measurement:**
```bash
# Run OPA benchmark
services/opa/bin/opa test --bench services/opa/policies/security.rego

# Expected: <200ms per evaluation (combined R01 + R02)
```

---

### Documentation Updates

**Files to Update:**
1. `docs/developer/VeroField_Rules_2.1.md` — Add R02 Step 5 procedures
2. `docs/architecture/database-security.md` — Document RLS policy requirements
3. `docs/database/rls-policy-guide.md` — Create RLS policy implementation guide
4. `docs/testing/security-testing-guide.md` — Add RLS testing procedures

---

## Summary for R02

**Deliverables:**
- ✅ Step 5 audit checklist (20 items)
- ✅ OPA policy mapping (4 violation patterns + 1 warning)
- ✅ Automated check script specification
- ✅ Manual verification procedures (4-step process)
- ✅ OPA policy implementation (Rego code)
- ✅ Test cases (8 tests)
- ⏸️ Script implementation (pending approval)

**Review Needed:**
1. Should R02 check for missing tenant_id columns, or is that R01's responsibility?
2. Should the automated script validate RLS policy syntax, or just check for existence?
3. Should OPA policy validate RLS policy syntax, or just check for existence?
4. Should manual verification include performance testing of RLS policies?

**Estimated Implementation Time:**
- OPA policy: 30 minutes
- Automated script: 45 minutes
- Test cases: 30 minutes
- Documentation: 15 minutes
- **Total:** 2 hours

**Next Steps:**
1. Review this draft
2. Answer review questions
3. Approve or request changes
4. Implement OPA policy (extend existing security.rego)
5. Implement automated script
6. Add test cases
7. Update documentation
8. Move to R03 (Architecture Boundaries)

---

**Status:** AWAITING HUMAN REVIEW  
**Prepared By:** AI Assistant  
**Date:** 2025-11-23



