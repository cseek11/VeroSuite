# R04: Layer Synchronization — Step 5 Procedures (DRAFT)

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-11-23  
**Rule:** R04 - Layer Synchronization  
**Priority:** HIGH (Tier 2 - OVERRIDE)

---

## R04: Layer Synchronization — Step 5 Procedures

### Rule-Specific Audit Checklist

For code changes affecting **database schema, DTOs, frontend types, or event contracts**:

#### Schema Change Synchronization
- [ ] **MANDATORY:** Verify Prisma migration file exists for schema changes
- [ ] **MANDATORY:** Verify DTOs match schema changes (field names, types, optionality)
- [ ] **MANDATORY:** Verify frontend types match DTOs (field names, types, optionality)
- [ ] **MANDATORY:** Verify validators updated (class-validator in DTOs, Zod in frontend)
- [ ] **MANDATORY:** Verify tests updated to reflect schema changes
- [ ] **MANDATORY:** Verify event contracts updated (if entity produces/consumes events)
- [ ] **MANDATORY:** Verify state machine docs updated (if stateful entity)

#### DTO Change Synchronization
- [ ] **MANDATORY:** Verify frontend types match DTO changes
- [ ] **MANDATORY:** Verify validators updated (both backend and frontend)
- [ ] **MANDATORY:** Verify tests updated
- [ ] **MANDATORY:** Verify API documentation updated (OpenAPI/Swagger)
- [ ] **MANDATORY:** Verify event contracts updated (if applicable)

#### Frontend Type Change Synchronization
- [ ] **MANDATORY:** Verify frontend types match backend DTOs
- [ ] **MANDATORY:** Verify no breaking changes without backend updates
- [ ] **MANDATORY:** Verify Zod schemas match frontend types

#### Contract Consistency
- [ ] **MANDATORY:** Verify field names match across all layers
- [ ] **MANDATORY:** Verify field types match across all layers
- [ ] **MANDATORY:** Verify optionality matches across all layers
- [ ] **MANDATORY:** Verify enum values match across all layers
- [ ] **RECOMMENDED:** Verify validation rules match (backend vs. frontend)

---

### OPA Policy Mapping

**Policy File:** `services/opa/policies/data-integrity.rego`

**Violation Detection:**
- OPA checks for:
  - Schema changes (`schema.prisma`) without migration files
  - Schema changes without corresponding DTO updates
  - DTO changes without corresponding frontend type updates
  - Frontend type changes that don't match DTOs
  - Missing validators after schema/DTO changes
  - Enum mismatches between schema, DTOs, and frontend types
- Triggers on:
  - Changes to `schema.prisma`
  - Changes to `**/*.dto.ts` files
  - Changes to `frontend/src/types/**/*.ts` files
  - Changes to migration files
- Enforcement level: **OVERRIDE** (Tier 2 MAD) - Requires justification

**Common Violations:**

1. **Schema change without migration**
   ```prisma
   // ❌ VIOLATION: Schema changed but no migration file
   // libs/common/prisma/schema.prisma
   model User {
     id String @id @default(uuid())
     email String @unique
     first_name String // NEW FIELD
   }
   // Missing: libs/common/prisma/migrations/YYYYMMDDHHMMSS_add_first_name/migration.sql
   
   // ✅ CORRECT: Schema change with migration
   // 1. Update schema.prisma
   // 2. Run: npx prisma migrate dev --name add_first_name
   // 3. Migration file created automatically
   ```
   **Remediation:** Create Prisma migration: `npx prisma migrate dev --name <description>`

2. **Schema change without DTO update**
   ```prisma
   // ❌ VIOLATION: Schema has new field but DTO doesn't
   // schema.prisma
   model User {
     first_name String // NEW FIELD
   }
   
   // apps/api/src/user/dto/user.dto.ts
   export class UserDto {
     id: string;
     email: string;
     // Missing: first_name
   }
   ```
   **Remediation:** Update DTO to match schema: `first_name!: string;`

3. **DTO change without frontend type update**
   ```typescript
   // ❌ VIOLATION: DTO has new field but frontend type doesn't
   // apps/api/src/user/dto/user.dto.ts
   export class UserDto {
     first_name: string; // NEW FIELD
   }
   
   // frontend/src/types/user.ts
   export interface User {
     id: string;
     email: string;
     // Missing: first_name
   }
   ```
   **Remediation:** Update frontend type to match DTO: `first_name: string;`

4. **Enum mismatch between layers**
   ```typescript
   // ❌ VIOLATION: Enum values don't match
   // schema.prisma
   enum Status { PENDING, IN_PROGRESS, COMPLETED }
   
   // apps/api/src/work-orders/dto/work-order.dto.ts
   enum WorkOrderStatus { PENDING, IN_PROGRESS, COMPLETED, CANCELED } // Extra value
   
   // frontend/src/types/work-orders.ts
   enum WorkOrderStatus { PENDING, COMPLETED } // Missing values
   ```
   **Remediation:** Ensure enum values match across all layers

5. **Missing validators after schema change**
   ```typescript
   // ❌ VIOLATION: Schema has validation but DTO doesn't
   // schema.prisma
   model User {
     email String @unique @db.VarChar(255)
   }
   
   // apps/api/src/user/dto/create-user.dto.ts
   export class CreateUserDto {
     email: string; // Missing @IsEmail(), @MaxLength(255)
   }
   ```
   **Remediation:** Add validators: `@IsEmail() @MaxLength(255) email!: string;`

**[REVIEW NEEDED: Should R04 also check for contract documentation (docs/contracts/) updates?]**

---

### Automated Checks

**Script:** `.cursor/scripts/check-layer-sync.py`

**What it checks:**
- Detects schema changes without migration files
- Compares schema fields with DTO fields (name, type, optionality)
- Compares DTO fields with frontend type fields
- Detects enum mismatches between layers
- Identifies missing validators after schema/DTO changes
- Checks for contract documentation updates

**Usage:**
```bash
# Check specific entity synchronization
python .cursor/scripts/check-layer-sync.py --entity User

# Check all changed files in PR
git diff --name-only main | grep -E "(schema.prisma|\.dto\.ts|types/)" | xargs python .cursor/scripts/check-layer-sync.py

# Check entire codebase
python .cursor/scripts/check-layer-sync.py --all
```

**Output:**
```
Checking: User entity synchronization

✅ Schema → DTO: PASS
✅ DTO → Frontend Types: PASS
✅ Validators: PASS
⚠️  Contract Docs: Missing docs/contracts/user.md

Checking: WorkOrder entity synchronization

❌ Schema → DTO: FAIL
   → Schema has 'priority' field but DTO is missing it
   → File: apps/api/src/work-orders/dto/work-order.dto.ts

❌ DTO → Frontend Types: FAIL
   → DTO has 'priority' field but frontend type is missing it
   → File: frontend/src/types/work-orders.ts

⚠️  Enum Mismatch: FAIL
   → Schema: [PENDING, IN_PROGRESS, COMPLETED]
   → DTO: [PENDING, IN_PROGRESS, COMPLETED, CANCELED]
   → Frontend: [PENDING, COMPLETED]
```

**[REVIEW NEEDED: Should the script also validate Zod schemas match frontend types?]**

---

### Manual Verification

**When:** For schema changes, major DTO changes, or when automated checks fail

**Procedure:**
1. **Review Schema Changes**
   - Verify migration file exists and is correct
   - Check migration rollback works
   - Confirm schema changes are intentional

2. **Verify Layer Synchronization**
   - Compare schema fields with DTO fields (name, type, optionality)
   - Compare DTO fields with frontend type fields
   - Check enum values match across all layers
   - Verify validators match schema constraints

3. **Check Contract Documentation**
   - Verify `docs/contracts/` updated (if applicable)
   - Verify `docs/state-machines/` updated (if stateful entity)
   - Verify API documentation updated (OpenAPI/Swagger)

4. **Test Integration**
   - Run integration tests to verify layers work together
   - Test API endpoints with updated DTOs
   - Test frontend forms with updated types
   - Verify no runtime errors from type mismatches

**Verification Criteria:**
- [ ] All layers synchronized (schema ↔ DTO ↔ frontend types)
- [ ] Validators match schema constraints
- [ ] Enums match across all layers
- [ ] Tests updated and passing
- [ ] Contract documentation updated
- [ ] No breaking changes without proper migration

**[REVIEW NEEDED: Should manual verification include testing actual API calls to verify synchronization?]**

---

### Integration with Existing Step 5

**Add to `.cursor/rules/01-enforcement.mdc` Step 5:**

```markdown
### Step 5: Post-Implementation Audit (MANDATORY) ⭐ **CRITICAL**

...existing checks...

- [ ] **MUST** verify layer synchronization (if schema/DTO/type changes)
  - Run: `python .cursor/scripts/check-layer-sync.py --entity <EntityName>`
  - Verify: Schema ↔ DTO ↔ Frontend types synchronized
  - Verify: Validators match schema constraints
  - Verify: Enums match across all layers
  - Verify: Contract documentation updated
```

---

### OPA Policy Implementation

**File:** `services/opa/policies/data-integrity.rego`

**Policy Logic:**

```rego
package compliance.data_integrity

import future.keywords.contains
import future.keywords.if

# Policy metadata
metadata := {
    "name": "Data Integrity & Layer Synchronization",
    "domain": "data",
    "tier": "2",  # OVERRIDE
    "version": "1.0.0",
    "created": "2025-11-23",
    "description": "Enforces layer synchronization (schema ↔ DTO ↔ frontend types)"
}

# =============================================================================
# R04: LAYER SYNCHRONIZATION (TIER 2 - OVERRIDE)
# =============================================================================

# Deny: Schema change without migration file
deny contains msg if {
    some file in input.changed_files
    file.path == "libs/common/prisma/schema.prisma"
    # Check if schema changed (has model/field changes)
    contains(file.diff, "model ") or contains(file.diff, "@")
    
    # Check if migration file exists
    no_migration := true
    some migration_file in input.changed_files
    startswith(migration_file.path, "libs/common/prisma/migrations/")
    no_migration := false
    
    no_migration == true
    not has_override_marker(input.pr_body, "layer-sync")
    
    msg := sprintf(
        "OVERRIDE REQUIRED [Data/R04]: Schema change in %s requires Prisma migration file. Run 'npx prisma migrate dev --name <description>' to create migration. Add @override:layer-sync with justification if intentional.",
        [file.path]
    )
}

# Deny: Schema change without DTO update (heuristic check)
deny contains msg if {
    some file in input.changed_files
    file.path == "libs/common/prisma/schema.prisma"
    # Extract model name from diff
    model_matches := regex.find_all_string_submatch_n(`model\s+([A-Z][a-zA-Z]+)`, file.diff, -1)
    count(model_matches) > 0
    model_name := model_matches[0][1]
    
    # Check if corresponding DTO file exists and was updated
    dto_updated := false
    some dto_file in input.changed_files
    regex.match(sprintf(".*/%s.*\\.dto\\.ts$", [lower(model_name)]), dto_file.path)
    dto_updated := true
    
    dto_updated == false
    not has_override_marker(input.pr_body, "layer-sync")
    
    msg := sprintf(
        "OVERRIDE REQUIRED [Data/R04]: Schema change for model '%s' requires corresponding DTO update. Update DTOs in apps/*/src/**/dto/ to match schema changes. Add @override:layer-sync with justification if intentional.",
        [model_name]
    )
}

# Deny: DTO change without frontend type update (heuristic check)
deny contains msg if {
    some file in input.changed_files
    regex.match(".*\\.dto\\.ts$", file.path)
    # Extract entity name from DTO file path
    entity_matches := regex.find_all_string_submatch_n(".*/([a-z-]+)\\.dto\\.ts$", file.path, -1)
    count(entity_matches) > 0
    entity_name := entity_matches[0][1]
    
    # Check if corresponding frontend type file exists and was updated
    frontend_type_updated := false
    some type_file in input.changed_files
    regex.match(sprintf("frontend/src/types/.*%s.*\\.ts$", [entity_name]), type_file.path)
    frontend_type_updated := true
    
    frontend_type_updated == false
    not has_override_marker(input.pr_body, "layer-sync")
    
    msg := sprintf(
        "OVERRIDE REQUIRED [Data/R04]: DTO change in %s requires corresponding frontend type update. Update types in frontend/src/types/ to match DTO changes. Add @override:layer-sync with justification if intentional.",
        [file.path]
    )
}

# Warning: Enum mismatch detection (requires full file comparison, heuristic)
warn contains msg if {
    some file in input.changed_files
    regex.match(".*enum.*", file.diff)
    
    msg := sprintf(
        "WARNING [Data/R04]: Enum change detected in %s. Verify enum values match across schema, DTOs, and frontend types. Use check-layer-sync.py to verify synchronization.",
        [file.path]
    )
}

# Helper: Check for override marker
has_override_marker(pr_body, rule) if {
    contains(pr_body, "@override:")
    contains(pr_body, rule)
}
```

**[REVIEW NEEDED: Should OPA policy also check for validator updates after schema changes?]**

---

### Test Cases

**File:** `services/opa/tests/data_integrity_r04_test.rego`

**Test Coverage:**

1. **Happy Path:** Schema change with migration → Pass
2. **Happy Path:** Schema change with DTO update → Pass
3. **Happy Path:** DTO change with frontend type update → Pass
4. **Violation:** Schema change without migration → Deny
5. **Violation:** Schema change without DTO update → Deny
6. **Violation:** DTO change without frontend type update → Deny
7. **Warning:** Enum change detected → Warn
8. **Override:** Violation with @override marker → Allow
9. **Edge Case:** Multiple entities changed → Check all
10. **Edge Case:** Only frontend type changed → Verify matches DTO

**Example Test:**

```rego
package compliance.data_integrity_r04_test

import data.compliance.data_integrity
import future.keywords.if

# Test: Schema change without migration fails
test_schema_change_without_migration_fails if {
    input := {
        "changed_files": [{
            "path": "libs/common/prisma/schema.prisma",
            "diff": "model User {\n  id String @id\n  email String @unique\n  first_name String\n}"
        }],
        "pr_body": "Add first_name to User"
    }
    count(data_integrity.deny) > 0
    some msg in data_integrity.deny
    contains(msg, "R04")
    contains(msg, "migration")
}

# Test: Schema change with migration passes
test_schema_change_with_migration_passes if {
    input := {
        "changed_files": [
            {
                "path": "libs/common/prisma/schema.prisma",
                "diff": "model User {\n  first_name String\n}"
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
```

---

### Performance Budget

**Target:** <200ms per policy evaluation

**Optimization:**
- Check file paths first (early exit)
- Use simple string matching before regex
- Cache regex compilation
- Limit diff scanning to key patterns

**Measurement:**
```bash
# Run OPA benchmark
services/opa/bin/opa test --bench services/opa/policies/data-integrity.rego

# Expected: <200ms per evaluation
```

---

### Documentation Updates

**Files to Update:**
1. `docs/developer/VeroField_Rules_2.1.md` — Add R04 Step 5 procedures
2. `docs/layer-sync.md` — Update with R04 procedures
3. `docs/contracts.md` — Add R04 synchronization requirements
4. `docs/testing/layer-sync-testing-guide.md` — Add layer sync testing procedures (NEW)

---

## Summary for R04

**Deliverables:**
- ✅ Step 5 audit checklist (20 items)
- ✅ OPA policy mapping (4 violation patterns + 1 warning)
- ✅ Automated check script specification
- ✅ Manual verification procedures (4-step process)
- ✅ OPA policy implementation (Rego code)
- ✅ Test cases (10 tests)
- ⏸️ Script implementation (pending approval)

**Review Needed:**
1. Should R04 check for contract documentation (docs/contracts/) updates?
2. Should the script validate Zod schemas match frontend types?
3. Should manual verification include testing actual API calls?
4. Should OPA policy check for validator updates after schema changes?

**Estimated Implementation Time:**
- OPA policy: 30 minutes
- Automated script: 60 minutes (more complex than R01-R03)
- Test cases: 30 minutes
- Documentation: 20 minutes
- **Total:** 2.5 hours

**Next Steps:**
1. Review this draft
2. Answer review questions
3. Approve or request changes
4. Implement OPA policy
5. Implement automated script
6. Add test cases
7. Update documentation
8. **Move to R05 (State Machine Enforcement)** or continue Tier 2

---

**Status:** AWAITING HUMAN REVIEW  
**Prepared By:** AI Assistant  
**Date:** 2025-11-23





