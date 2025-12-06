# R03: Architecture Boundaries — Step 5 Procedures (DRAFT)

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-12-04  
**Rule:** R03 - Architecture Boundaries  
**Priority:** CRITICAL (Tier 1 - BLOCK)

---

## R03: Architecture Boundaries — Step 5 Procedures

### Rule-Specific Audit Checklist

For code changes affecting **monorepo structure, service boundaries, or architectural components**:

#### Monorepo Structure Compliance
- [ ] **MANDATORY:** Verify files are in correct monorepo paths (`apps/`, `libs/`, `frontend/`, etc.)
- [ ] **MANDATORY:** Verify no files in deprecated paths (`backend/src/`, root-level `src/`)
- [ ] **MANDATORY:** Verify no new top-level directories created without approval
- [ ] **MANDATORY:** Verify shared code is in `libs/common/` (not duplicated across services)
- [ ] **RECOMMENDED:** Verify file naming follows conventions

#### Service Boundary Enforcement
- [ ] **MANDATORY:** Verify no cross-service relative imports (`../../other-service/`)
- [ ] **MANDATORY:** Verify services communicate via HTTP/events (not direct imports)
- [ ] **MANDATORY:** Verify backend doesn't import frontend code
- [ ] **MANDATORY:** Verify frontend doesn't import backend implementation types
- [ ] **RECOMMENDED:** Verify service contracts are documented

#### Architectural Scope Limits
- [ ] **MANDATORY:** Verify no new microservices created without human approval
- [ ] **MANDATORY:** Verify no new database/schema files outside `libs/common/prisma/`
- [ ] **MANDATORY:** Verify no new message bus introduced without approval
- [ ] **MANDATORY:** Verify no authentication architecture changes without approval
- [ ] **RECOMMENDED:** Verify architectural decisions are documented

---

### OPA Policy Mapping

**Policy File:** `services/opa/policies/architecture.rego`

**Violation Detection:**
- OPA checks for:
  - New directories in `apps/` (new microservices)
  - Files in deprecated paths (`backend/src/`, `backend/prisma/`)
  - Cross-service relative imports
  - New top-level directories
  - New schema files outside `libs/common/prisma/`
  - Frontend importing backend implementation
  - Backend importing frontend code
- Triggers on:
  - Changes creating new directories in `apps/`
  - Changes to any `.ts`, `.tsx`, `.js` files (import checks)
  - Changes to `package.json` (dependency checks)
  - Changes creating new top-level directories
- Enforcement level: **BLOCK** (Tier 1 MAD) - Requires human approval

**Common Violations:**

1. **Creating new microservice without approval**
   ```bash
   # ❌ VIOLATION
   mkdir apps/new-service
   
   # ✅ CORRECT
   # Request human approval first
   # Document in architecture/decisions.md
   # Then create with proper structure
   ```
   **Remediation:** Request explicit human approval, document architectural decision

2. **Cross-service relative import**
   ```typescript
   // ❌ VIOLATION (in apps/api/src/module.ts)
   import { CrmService } from '../../../crm-ai/src/crm.service';
   
   // ✅ CORRECT
   // Services communicate via HTTP/events
   const response = await this.httpService.post('http://crm-ai/api/analyze', data);
   ```
   **Remediation:** Use HTTP/events for cross-service communication

3. **File in deprecated path**
   ```bash
   # ❌ VIOLATION
   backend/src/users/users.service.ts
   
   # ✅ CORRECT
   apps/api/src/users/users.service.ts
   ```
   **Remediation:** Move file to correct monorepo path

4. **Frontend importing backend implementation**
   ```typescript
   // ❌ VIOLATION (in frontend/src/components/UserList.tsx)
   import { UserService } from '../../../apps/api/src/users/user.service';
   
   // ✅ CORRECT
   // Frontend uses API client with contract types
   import { User } from '@/types/user';
   const users = await apiClient.get<User[]>('/api/users');
   ```
   **Remediation:** Use API client with contract types, not backend implementation

5. **Duplicated code instead of shared library**
   ```typescript
   // ❌ VIOLATION
   // apps/api/src/utils/validation.ts
   // apps/crm-ai/src/utils/validation.ts (duplicate)
   
   // ✅ CORRECT
   // libs/common/src/utils/validation.ts (shared)
   import { validate } from '@verofield/common/utils';
   ```
   **Remediation:** Move shared code to `libs/common/`

**[REVIEW NEEDED: Should R03 also check for architectural patterns (e.g., layered architecture, clean architecture)?]**

---

### Automated Checks

**Script:** `.cursor/scripts/check-architecture-boundaries.py`

**What it checks:**
- Scans for files in deprecated paths
- Detects cross-service relative imports
- Finds new directories in `apps/` (potential new services)
- Identifies new top-level directories
- Detects backend/frontend import violations
- Finds duplicated code that should be in `libs/common/`

**Usage:**
```bash
# Check single file
python .cursor/scripts/check-architecture-boundaries.py apps/api/src/module.ts

# Check entire service
python .cursor/scripts/check-architecture-boundaries.py apps/api/

# Check all changed files in PR
git diff --name-only main | xargs python .cursor/scripts/check-architecture-boundaries.py
```

**Output:**
```
Checking: apps/api/src/users/users.service.ts
✅ PASS: File in correct monorepo path
✅ PASS: No cross-service imports

Checking: backend/src/legacy.ts
❌ VIOLATION [File-level]: File in deprecated path 'backend/src/'
   → Move to: apps/api/src/legacy.ts

Checking: apps/api/src/crm/crm.service.ts
❌ VIOLATION [Line 5]: Cross-service relative import
   → import { CrmService } from '../../../crm-ai/src/crm.service';
   → Use HTTP/events for cross-service communication
```

**[REVIEW NEEDED: Should the script also detect code duplication across services?]**

---

### Manual Verification

**When:** For architectural changes, new services, or major refactoring

**Procedure:**
1. **Review Monorepo Structure**
   - Verify all files are in correct paths
   - Check for deprecated path usage
   - Confirm no unauthorized top-level directories

2. **Verify Service Boundaries**
   - Trace import paths across services
   - Confirm services communicate via HTTP/events
   - Check for direct service-to-service imports

3. **Validate Shared Code**
   - Identify code used by multiple services
   - Verify shared code is in `libs/common/`
   - Check for code duplication

4. **Review Architectural Decisions**
   - Check `docs/architecture/` for decision records
   - Verify new services have architectural justification
   - Confirm changes align with overall architecture

**Verification Criteria:**
- [ ] All files in correct monorepo paths
- [ ] No cross-service relative imports
- [ ] Services communicate via HTTP/events
- [ ] Shared code in `libs/common/`
- [ ] Architectural changes documented

**[REVIEW NEEDED: Should manual verification include dependency graph analysis?]**

---

### Integration with Existing Step 5

**Add to `.cursor/rules/01-enforcement.mdc` Step 5:**

```markdown
### Step 5: Post-Implementation Audit (MANDATORY) ⭐ **CRITICAL**

...existing checks...

- [ ] **MUST** verify architecture boundaries (if structural changes)
  - Run: `python .cursor/scripts/check-architecture-boundaries.py [file_or_directory]`
  - Verify: Files in correct monorepo paths
  - Verify: No cross-service relative imports
  - Verify: Shared code in libs/common/
```

---

### OPA Policy Implementation

**File:** `services/opa/policies/architecture.rego`

**Policy Logic:**

```rego
package compliance.architecture

import future.keywords.contains
import future.keywords.if

# Policy metadata
metadata := {
    "name": "Architecture Boundaries & Monorepo Structure",
    "domain": "architecture",
    "tier": "1",  # BLOCK
    "version": "1.0.0",
    "created": "2025-12-04",
    "description": "Enforces monorepo structure and service boundaries"
}

# =============================================================================
# R03: ARCHITECTURE BOUNDARIES (TIER 1 - BLOCK)
# =============================================================================

# Deny: New directory in apps/ (new microservice)
deny contains msg if {
    some file in input.changed_files
    regex.match(`^apps/[^/]+/$`, file.path)
    not has_override_marker(input.pr_body, "architecture-boundaries")
    
    # Extract service name
    service_matches := regex.find_all_string_submatch_n(`^apps/([^/]+)/`, file.path, -1)
    service_name := service_matches[0][1] if count(service_matches) > 0
    
    msg := sprintf(
        "HARD STOP [Architecture/R03]: Creating new microservice '%s' in %s requires explicit human approval. Add @override:architecture-boundaries with architectural justification and approval.",
        [service_name, file.path]
    )
}

# Deny: Files in deprecated backend/ path
deny contains msg if {
    some file in input.changed_files
    startswith(file.path, "backend/")
    not has_override_marker(input.pr_body, "architecture-boundaries")
    
    # Suggest correct path
    correct_path := replace(file.path, "backend/", "apps/api/")
    
    msg := sprintf(
        "HARD STOP [Architecture/R03]: File in deprecated path '%s'. Move to correct monorepo path: '%s'",
        [file.path, correct_path]
    )
}

# Deny: Cross-service relative import
deny contains msg if {
    some file in input.changed_files
    endswith(file.path, ".ts")
    regex.match(`import.*from\s+['"]\.\./\.\./\.\./[^'"]+/src/`, file.diff)
    not has_override_marker(input.pr_body, "architecture-boundaries")
    
    msg := sprintf(
        "HARD STOP [Architecture/R03]: Cross-service relative import detected in %s. Services must communicate via HTTP/events, not direct imports. Use API clients or event bus.",
        [file.path]
    )
}

# Deny: New top-level directory
deny contains msg if {
    some file in input.changed_files
    regex.match(`^[^/]+/$`, file.path)
    not startswith(file.path, "apps/")
    not startswith(file.path, "libs/")
    not startswith(file.path, "frontend/")
    not startswith(file.path, "VeroFieldMobile/")
    not startswith(file.path, "docs/")
    not startswith(file.path, "services/")
    not startswith(file.path, ".cursor/")
    not startswith(file.path, ".github/")
    not has_override_marker(input.pr_body, "architecture-boundaries")
    
    msg := sprintf(
        "HARD STOP [Architecture/R03]: Creating new top-level directory '%s' requires explicit human approval. Document architectural justification.",
        [file.path]
    )
}

# Deny: New schema file outside libs/common/prisma
deny contains msg if {
    some file in input.changed_files
    endswith(file.path, "schema.prisma")
    not contains(file.path, "libs/common/prisma/")
    not has_override_marker(input.pr_body, "architecture-boundaries")
    
    msg := sprintf(
        "HARD STOP [Architecture/R03]: New schema file '%s' outside libs/common/prisma/. VeroField uses single schema source of truth at libs/common/prisma/schema.prisma",
        [file.path]
    )
}

# Deny: Frontend importing backend implementation
deny contains msg if {
    some file in input.changed_files
    startswith(file.path, "frontend/")
    regex.match(`import.*from\s+['"].*apps/(api|crm-ai|ai-soc)/.*\.service`, file.diff)
    not has_override_marker(input.pr_body, "architecture-boundaries")
    
    msg := sprintf(
        "HARD STOP [Architecture/R03]: Frontend importing backend service implementation in %s. Frontend must use API client with contract types, not backend implementation.",
        [file.path]
    )
}

# Deny: Backend importing frontend code
deny contains msg if {
    some file in input.changed_files
    startswith(file.path, "apps/")
    regex.match(`import.*from\s+['"].*frontend/`, file.diff)
    not has_override_marker(input.pr_body, "architecture-boundaries")
    
    msg := sprintf(
        "HARD STOP [Architecture/R03]: Backend importing frontend code in %s. Backend must not depend on frontend. Extract shared types to libs/common/.",
        [file.path]
    )
}

# Warning: Potential code duplication
warn contains msg if {
    some file in input.changed_files
    contains(file.path, "/utils/")
    contains(file.path, "apps/")
    
    msg := sprintf(
        "WARNING [Architecture/R03]: Utility file in service directory '%s'. Consider if this should be shared code in libs/common/src/utils/",
        [file.path]
    )
}

# Helper: Check for override marker
has_override_marker(pr_body, rule) if {
    contains(pr_body, "@override:")
    contains(pr_body, rule)
}
```

**[REVIEW NEEDED: Should the OPA policy also check for circular dependencies between services?]**

---

### Test Cases

**File:** `services/opa/tests/architecture_r03_test.rego`

**Test Coverage:**

1. **Happy Path:** File in correct path → No violation
2. **Violation:** New microservice without approval → Deny
3. **Violation:** File in deprecated path → Deny
4. **Violation:** Cross-service import → Deny
5. **Violation:** New top-level directory → Deny
6. **Violation:** New schema file → Deny
7. **Violation:** Frontend importing backend → Deny
8. **Violation:** Backend importing frontend → Deny
9. **Warning:** Utility in service directory → Warn
10. **Override:** Violation with @override marker → Allow
11. **Edge Case:** Shared code in libs/common → Pass

**Example Test:**

```rego
package compliance.architecture_r03_test

import data.compliance.architecture
import future.keywords.if

# Test: File in correct path passes
test_correct_path_passes if {
    input := {
        "changed_files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff": "export class UsersService {}"
        }],
        "pr_body": "Add users service"
    }
    count(architecture.deny) == 0
}

# Test: New microservice without approval fails
test_new_microservice_fails if {
    input := {
        "changed_files": [{
            "path": "apps/new-service/src/main.ts",
            "diff": "console.log('new service');"
        }],
        "pr_body": "Add new service"
    }
    count(architecture.deny) > 0
    some msg in architecture.deny
    contains(msg, "R03")
    contains(msg, "microservice")
}

# Test: File in deprecated path fails
test_deprecated_path_fails if {
    input := {
        "changed_files": [{
            "path": "backend/src/users/users.service.ts",
            "diff": "export class UsersService {}"
        }],
        "pr_body": "Add users service"
    }
    count(architecture.deny) > 0
    some msg in architecture.deny
    contains(msg, "R03")
    contains(msg, "deprecated path")
}

# Test: Cross-service import fails
test_cross_service_import_fails if {
    input := {
        "changed_files": [{
            "path": "apps/api/src/crm/crm.controller.ts",
            "diff": "import { CrmService } from '../../../crm-ai/src/crm.service';"
        }],
        "pr_body": "Add CRM controller"
    }
    count(architecture.deny) > 0
    some msg in architecture.deny
    contains(msg, "R03")
    contains(msg, "Cross-service")
}
```

---

### Performance Budget

**Target:** <200ms per policy evaluation

**Optimization:**
- Check file path patterns first (early exit)
- Use simple string matching before regex
- Cache regex compilation
- Limit diff scanning to import statements

**Measurement:**
```bash
# Run OPA benchmark
services/opa/bin/opa test --bench services/opa/policies/architecture.rego

# Expected: <200ms per evaluation
```

---

### Documentation Updates

**Files to Update:**
1. `docs/developer/VeroField_Rules_2.1.md` — Add R03 Step 5 procedures
2. `docs/architecture/monorepo-structure.md` — Document structure and boundaries
3. `docs/architecture/service-communication.md` — Document inter-service communication patterns
4. `docs/testing/architecture-testing-guide.md` — Add architecture testing procedures

---

## Summary for R03

**Deliverables:**
- ✅ Step 5 audit checklist (14 items)
- ✅ OPA policy mapping (7 violation patterns + 1 warning)
- ✅ Automated check script specification
- ✅ Manual verification procedures (4-step process)
- ✅ OPA policy implementation (Rego code)
- ✅ Test cases (11 tests)
- ⏸️ Script implementation (pending approval)

**Review Needed:**
1. Should R03 check for architectural patterns (layered, clean architecture)?
2. Should the script detect code duplication across services?
3. Should manual verification include dependency graph analysis?
4. Should OPA policy check for circular dependencies between services?

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
4. Implement OPA policy
5. Implement automated script
6. Add test cases
7. Update documentation
8. **Complete Tier 1 (R01, R02, R03)** ✅

---

**Status:** AWAITING HUMAN REVIEW  
**Prepared By:** AI Assistant  
**Date:** 2025-12-04





