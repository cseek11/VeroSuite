# Step 5 Procedures for 03-security.mdc

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-11-23  
**Rules Covered:** R01 (Tenant Isolation), R02 (RLS Enforcement), R12 (Security Event Logging), R13 (Input Validation)

---

## R01: Tenant Isolation — Step 5 Procedures

### Rule-Specific Audit Checklist

For code changes affecting **database queries, API endpoints, or authentication**:

#### Database Operations
- [ ] **MANDATORY:** Verify all database queries include `tenant_id` filter or use `withTenant()` wrapper
- [ ] **MANDATORY:** Verify no raw SQL queries bypass tenant isolation
- [ ] **MANDATORY:** Verify Prisma queries use tenant-scoped context
- [ ] **MANDATORY:** Verify no `$queryRawUnsafe` without tenant validation
- [ ] **MANDATORY:** Verify no cross-tenant data access in query logic
- [ ] **RECOMMENDED:** Verify query performance with tenant filter (no full table scans)

#### API Endpoints
- [ ] **MANDATORY:** Verify `tenant_id` extracted from JWT (never from request body/params)
- [ ] **MANDATORY:** Verify tenant context set before database operations
- [ ] **MANDATORY:** Verify tenant validation middleware applied to protected routes
- [ ] **MANDATORY:** Verify no tenant_id exposed in error messages
- [ ] **MANDATORY:** Verify no endpoints allow cross-tenant access
- [ ] **RECOMMENDED:** Verify audit logging includes tenant_id for security events

#### Authentication
- [ ] **MANDATORY:** Verify JWT payload includes `tenant_id`
- [ ] **MANDATORY:** Verify JWT validation checks `tenant_id` presence
- [ ] **MANDATORY:** Verify user context includes validated `tenant_id`
- [ ] **MANDATORY:** Verify no client-provided `tenant_id` trusted without validation
- [ ] **RECOMMENDED:** Verify JWT secret is environment-specific (not shared across envs)

---

### OPA Policy Mapping

**Policy File:** `services/opa/policies/security.rego`

**Violation Detection:**
- OPA checks for:
  - Database queries without `tenant_id` filter
  - Raw SQL queries (`$queryRawUnsafe`, `$executeRawUnsafe`) without tenant validation
  - API endpoints accepting `tenant_id` from request body/params
  - Missing `withTenant()` wrapper for database operations
  - Cross-tenant data access patterns
- Triggers on:
  - Changes to `*.service.ts` files with database operations
  - Changes to `*.controller.ts` files with API endpoints
  - Changes to authentication/authorization files
  - Changes to middleware files
- Enforcement level: **BLOCK** (Tier 1 MAD)

**Common Violations:**

1. **Missing tenant filter in Prisma query**
   ```typescript
   // ❌ VIOLATION
   const users = await this.prisma.user.findMany();
   
   // ✅ CORRECT
   const users = await this.prisma.user.findMany({
     where: { tenant_id: tenantId }
   });
   ```
   **Remediation:** Add `tenant_id` filter to all queries

2. **Using raw SQL without tenant context**
   ```typescript
   // ❌ VIOLATION
   const result = await this.prisma.$queryRawUnsafe('SELECT * FROM users');
   
   // ✅ CORRECT
   const result = await this.db.withTenant(tenantId, async () => {
     return await this.prisma.$queryRawUnsafe('SELECT * FROM users');
   });
   ```
   **Remediation:** Wrap raw queries in `withTenant()` or use Prisma queries

3. **Trusting client-provided tenant_id**
   ```typescript
   // ❌ VIOLATION
   @Post()
   async create(@Body() dto: CreateDto, @Body('tenant_id') tenantId: string) {
     // Using tenant_id from request body
   }
   
   // ✅ CORRECT
   @Post()
   @UseGuards(JwtAuthGuard)
   async create(@Body() dto: CreateDto, @Request() req) {
     const tenantId = req.user.tenantId; // From validated JWT
   }
   ```
   **Remediation:** Extract `tenant_id` from validated JWT, never from request

4. **Missing tenant validation in service**
   ```typescript
   // ❌ VIOLATION
   async findById(id: string) {
     return this.prisma.user.findUnique({ where: { id } });
   }
   
   // ✅ CORRECT
   async findById(id: string, tenantId: string) {
     return this.prisma.user.findUnique({
       where: { id, tenant_id: tenantId }
     });
   }
   ```
   **Remediation:** Add `tenantId` parameter and filter

---

### Automated Checks

**Script:** `.cursor/scripts/check-tenant-isolation.py`

**What it checks:**
- Scans `*.service.ts` files for Prisma queries without `tenant_id` filter
- Detects raw SQL queries (`$queryRawUnsafe`, `$executeRawUnsafe`) without `withTenant()` wrapper
- Finds API endpoints accepting `tenant_id` from request body/params
- Identifies missing `@UseGuards(JwtAuthGuard)` on protected endpoints
- Detects `tenant_id` in error messages or logs

**Usage:**
```bash
# Check single file
python .cursor/scripts/check-tenant-isolation.py apps/api/src/users/users.service.ts

# Check entire directory
python .cursor/scripts/check-tenant-isolation.py apps/api/src/

# Check all changed files in PR
git diff --name-only main | grep '\.ts$' | xargs python .cursor/scripts/check-tenant-isolation.py
```

**Output:**
```
Checking: apps/api/src/users/users.service.ts
❌ VIOLATION [Line 45]: Prisma query without tenant_id filter
   → findMany() call missing where: { tenant_id: ... }
❌ VIOLATION [Line 78]: Raw SQL without withTenant() wrapper
   → $queryRawUnsafe detected without tenant context
✅ PASS [Line 102]: Correct tenant isolation pattern
```

**[REVIEW NEEDED: Should this script also check for RLS policy configuration in schema.prisma?]**

---

### Manual Verification

**When:** For complex queries, multi-table joins, or custom authentication logic

**Procedure:**
1. **Review Query Logic**
   - Trace data flow from API endpoint to database
   - Verify tenant_id propagates through all layers
   - Check for any query paths that bypass tenant filter

2. **Test Cross-Tenant Access**
   - Create test data for multiple tenants
   - Attempt to access Tenant A data with Tenant B credentials
   - Verify 403 Forbidden or empty result (not 404)

3. **Review Error Handling**
   - Verify error messages don't expose tenant_id
   - Check logs for tenant_id leakage
   - Ensure stack traces don't reveal tenant structure

4. **Validate JWT Payload**
   - Inspect JWT token structure
   - Verify tenant_id is in payload
   - Confirm tenant_id matches user's actual tenant

**Verification Criteria:**
- [ ] No cross-tenant data access possible
- [ ] All queries include tenant_id filter
- [ ] JWT validation enforces tenant_id presence
- [ ] Error messages don't leak tenant information
- [ ] Audit logs include tenant_id for security events

**[REVIEW NEEDED: Should we add a checklist for reviewing RLS policies in Supabase/PostgreSQL?]**

---

### Integration with Existing Step 5

**Add to `.cursor/rules/01-enforcement.mdc` Step 5:**

```markdown
### Step 5: Post-Implementation Audit (MANDATORY) ⭐ **CRITICAL**

...existing checks...

- [ ] **MUST** verify tenant isolation (if database queries)
  - Run: `python .cursor/scripts/check-tenant-isolation.py [file]`
  - Verify: All queries include tenant_id filter or use withTenant()
  - Verify: No client-provided tenant_id trusted
  - Verify: JWT validation includes tenant_id check
```

---

### OPA Policy Implementation

**File:** `services/opa/policies/security.rego`

**Policy Logic:**

```rego
package compliance.security

import future.keywords.contains
import future.keywords.if

# Policy metadata
metadata := {
    "name": "Tenant Isolation & Security",
    "domain": "security",
    "tier": "1",  # BLOCK
    "version": "1.0.0",
    "created": "2025-11-23",
    "description": "Enforces tenant isolation, RLS, input validation, and security event logging"
}

# =============================================================================
# R01: TENANT ISOLATION (TIER 1 - BLOCK)
# =============================================================================

# Deny: Prisma query without tenant_id filter
deny contains msg if {
    some file in input.changed_files
    endswith(file.path, ".service.ts")
    contains(file.diff, "findMany(")
    not contains(file.diff, "tenant_id")
    not contains(file.diff, "withTenant(")
    not has_override_marker(input.pr_body, "tenant-isolation")
    
    msg := sprintf(
        "HARD STOP [Security/R01]: Prisma query without tenant_id filter in %s. All queries must include tenant_id filter or use withTenant() wrapper.",
        [file.path]
    )
}

# Deny: Raw SQL without withTenant() wrapper
deny contains msg if {
    some file in input.changed_files
    endswith(file.path, ".service.ts")
    regex.match(`\$queryRawUnsafe|\$executeRawUnsafe`, file.diff)
    not contains(file.diff, "withTenant(")
    not has_override_marker(input.pr_body, "tenant-isolation")
    
    msg := sprintf(
        "HARD STOP [Security/R01]: Raw SQL query without withTenant() wrapper in %s. Wrap all raw queries in withTenant() to enforce tenant isolation.",
        [file.path]
    )
}

# Deny: API endpoint accepting tenant_id from request body
deny contains msg if {
    some file in input.changed_files
    endswith(file.path, ".controller.ts")
    regex.match(`@Body\(['"]tenant_id['"]|@Query\(['"]tenant_id['"]`, file.diff)
    not has_override_marker(input.pr_body, "tenant-isolation")
    
    msg := sprintf(
        "HARD STOP [Security/R01]: API endpoint accepting tenant_id from request in %s. Extract tenant_id from validated JWT, never from request body/params.",
        [file.path]
    )
}

# Deny: Missing JwtAuthGuard on protected endpoint
deny contains msg if {
    some file in input.changed_files
    endswith(file.path, ".controller.ts")
    contains(file.diff, "@Post(")
    not contains(file.diff, "@UseGuards(JwtAuthGuard)")
    not contains(file.diff, "@Public()")  # Allow public endpoints
    not has_override_marker(input.pr_body, "tenant-isolation")
    
    msg := sprintf(
        "HARD STOP [Security/R01]: Protected endpoint without @UseGuards(JwtAuthGuard) in %s. Add authentication guard or mark as @Public().",
        [file.path]
    )
}

# Helper: Check for override marker
has_override_marker(pr_body, rule) if {
    contains(pr_body, "@override:")
    contains(pr_body, rule)
}
```

**[REVIEW NEEDED: Should the OPA policy also check for RLS policy configuration? Or is that covered by R02?]**

---

### Test Cases

**File:** `services/opa/tests/security_r01_test.rego`

**Test Coverage:**

1. **Happy Path:** Query with tenant_id filter → No violation
2. **Violation:** Query without tenant_id → Deny
3. **Violation:** Raw SQL without withTenant() → Deny
4. **Violation:** API endpoint with tenant_id in body → Deny
5. **Violation:** Protected endpoint without auth guard → Deny
6. **Override:** Violation with @override marker → Allow
7. **Public Endpoint:** @Public() endpoint without auth → Allow

**Example Test:**

```rego
package compliance.security_test

import data.compliance.security
import future.keywords.if

# Test: Query with tenant_id filter passes
test_query_with_tenant_id_passes if {
    input := {
        "changed_files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff": "findMany({ where: { tenant_id: tenantId } })"
        }],
        "pr_body": "Fix: Add user query"
    }
    count(security.deny) == 0
}

# Test: Query without tenant_id fails
test_query_without_tenant_id_fails if {
    input := {
        "changed_files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff": "findMany({ where: { id: userId } })"
        }],
        "pr_body": "Fix: Add user query"
    }
    count(security.deny) > 0
}

# Test: Raw SQL without withTenant fails
test_raw_sql_without_wrapper_fails if {
    input := {
        "changed_files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff": "$queryRawUnsafe('SELECT * FROM users')"
        }],
        "pr_body": "Fix: Add raw query"
    }
    count(security.deny) > 0
}
```

---

### Performance Budget

**Target:** <200ms per policy evaluation

**Optimization:**
- Use early exit conditions (check file extension first)
- Cache regex compilation
- Limit diff scanning to relevant patterns
- Use indexed string matching where possible

**Measurement:**
```bash
# Run OPA benchmark
services/opa/bin/opa test --bench services/opa/policies/security.rego

# Expected: <200ms per evaluation
```

---

### Documentation Updates

**Files to Update:**
1. `docs/developer/VeroField_Rules_2.1.md` — Add R01 Step 5 procedures
2. `docs/architecture/tenant-isolation.md` — Reference Step 5 checks
3. `docs/testing/security-testing-guide.md` — Add tenant isolation test procedures

---

## Summary for R01

**Deliverables:**
- ✅ Step 5 audit checklist (18 items)
- ✅ OPA policy mapping (4 violation patterns)
- ✅ Automated check script specification
- ✅ Manual verification procedures
- ✅ OPA policy implementation (Rego code)
- ✅ Test cases (7 tests)
- ⏸️ Script implementation (pending approval)

**Review Needed:**
1. Should automated script check RLS policy configuration?
2. Should OPA policy check RLS configuration or is that R02?
3. Should manual verification include RLS policy review checklist?

**Estimated Implementation Time:**
- OPA policy: 30 minutes
- Automated script: 45 minutes
- Test cases: 30 minutes
- Documentation: 15 minutes
- **Total:** 2 hours

**Next Steps:**
1. Review this draft
2. Approve or request changes
3. Implement OPA policy
4. Implement automated script
5. Add test cases
6. Update documentation
7. Move to R02 (RLS Enforcement)

---

**Status:** AWAITING HUMAN REVIEW  
**Prepared By:** AI Assistant  
**Date:** 2025-11-23





