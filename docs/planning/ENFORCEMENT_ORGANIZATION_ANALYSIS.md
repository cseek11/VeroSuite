# VeroField Enforcement Rules vs Filesystem Organization - Analysis Report

**Date:** 2025-12-05  
**Role:** ANALYSIS BRAIN  
**Status:** Analysis Complete - Ready for Implementation

---

## Executive Summary

### Where Enforcement Aligns with Structure ✅

1. **Deprecated Path Detection:** `ArchitectureDriftDetector` in `detection_functions.py` correctly identifies files in deprecated `backend/` paths and suggests migration to `apps/api/` or `libs/common/prisma/`.

2. **Import Path Validation:** The detector checks import statements for deprecated paths (`backend/`, `@verosuite/`) and cross-service imports.

3. **File Placement Checks:** Basic file placement validation exists for deprecated backend paths (`backend/src/`, `backend/prisma/`).

4. **Security File Tracking:** `auto-enforcer.py` maintains a list of security-sensitive files in canonical locations (`libs/common/prisma/schema.prisma`, `apps/api/src/**/*auth*.ts`).

### Where Enforcement is Out of Date ❌

1. **No Root Directory Enforcement:** The system does not prevent agents from creating new root-level directories or placing prohibited files (`.md`, `.sql`, images) in root.

2. **No Documentation Organization Enforcement:** While `docs/file-organization.md` exists with comprehensive rules, the auto-enforcer does not validate that:
   - All `.md` files (except `README.md`) are in `docs/` subdirectories
   - Documentation follows the documented structure
   - Reports/audits go to `docs/audits/` or `docs/compliance-reports/`

3. **No App/Service Structure Enforcement:** No validation that:
   - New apps follow `apps/[name]/src/` structure
   - Services follow `services/[name]/` structure
   - Shared code is in `libs/` or `shared/`

4. **No Legacy Directory Protection:** The `enforcement/` directory (legacy) is not explicitly marked as read-only or deprecated.

5. **No File Type Placement Rules:** No enforcement that:
   - SQL scripts belong in `supabase/migrations/` or `scripts/`
   - Images belong in `branding/assets/` or `docs/assets/`
   - Test outputs are gitignored or in `coverage/`

### Top 5 Organizational Risks Not Currently Caught 🚨

1. **New Root-Level Directories:** Agents can create arbitrary directories at root (e.g., `new-feature/`, `temp/`, `reports/`) without being blocked.

2. **Documentation Scatter:** Agents can create `.md` files anywhere (root, `apps/api/src/`, etc.) instead of `docs/` subdirectories.

3. **Wrong App Structure:** New features can be added to wrong locations (e.g., `apps/api/src/` when they should be in `libs/common/` or vice versa).

4. **Legacy Directory Usage:** Agents can still write to `enforcement/` (legacy) instead of `.cursor/enforcement/`.

5. **Service/OPA Policy Misplacement:** OPA policies could be created outside `services/opa/policies/`, deployment configs outside `deploy/`, monitoring configs outside `monitoring/`.

---

## Current Rules & Coverage Map

| Directory / Concept | Relevant Rule File(s) | What is Enforced | What is Missing |
|---------------------|----------------------|------------------|-----------------|
| **Root Organization** | None (docs/file-organization.md exists but not enforced) | ❌ Nothing | ✅ Root directory allowlist<br>✅ Prohibited file types in root<br>✅ New directory creation blocking |
| **Apps (apps/, frontend/, VeroSuiteMobile/)** | `detection_functions.py` (ArchitectureDriftDetector) | ✅ Deprecated `backend/` path detection<br>✅ Import path validation | ❌ App structure validation<br>❌ Feature module structure<br>❌ Test structure mirroring |
| **Shared (libs/, shared/)** | `detection_functions.py` (ArchitectureDriftDetector) | ✅ Deprecated schema location | ❌ Shared code placement rules<br>❌ Library structure validation |
| **Docs (docs/)** | `docs/file-organization.md` (documentation only) | ❌ Nothing enforced | ✅ All `.md` files in `docs/`<br>✅ Documentation subdirectory structure<br>✅ Report/audit placement |
| **Knowledge (knowledge/)** | None | ❌ Nothing | ✅ Compiled bibles location<br>✅ Source vs compiled separation |
| **Services (services/opa/)** | None | ❌ Nothing | ✅ OPA policies in `services/opa/policies/`<br>✅ Service-specific structure |
| **Monitoring (monitoring/)** | None | ❌ Nothing | ✅ Prometheus configs in `monitoring/prometheus/`<br>✅ Alert definitions placement |
| **Deploy (deploy/)** | None | ❌ Nothing | ✅ Deployment configs in `deploy/`<br>✅ Environment-specific organization |
| **Scripts (scripts/, .cursor/scripts/)** | None | ❌ Nothing | ✅ Script organization by purpose<br>✅ Cursor scripts in `.cursor/scripts/` |
| **Legacy (enforcement/)** | None | ❌ Nothing | ✅ Read-only enforcement<br>✅ Migration warnings |

---

## Gap Analysis (Organization Enforcement)

### Root Organization

**What Should Be Enforced:**
- Only allowed files in root: `README.md`, `package.json`, `package-lock.json`, `.gitignore`, `.gitattributes`, config files
- No new root-level directories without explicit approval
- No `.md`, `.sql`, `.txt`, images, or documentation files in root

**What Is Currently Enforced:**
- Nothing

**Concrete Examples That Would Slip Through:**
- Agent creates `PROJECT_STATUS.md` in root → **NOT BLOCKED**
- Agent creates `new-feature/` directory at root → **NOT BLOCKED**
- Agent creates `reports/audit-2025.md` in root → **NOT BLOCKED**
- Agent creates `migration.sql` in root → **NOT BLOCKED**

### Apps & Feature Structure

**What Should Be Enforced:**
- `apps/api/src/` follows feature-based structure (accounts/, billing/, etc.)
- Each feature module contains: `*.controller.ts`, `*.service.ts`, `*.module.ts`, `dto/`
- Tests mirror `src/` structure under `test/`
- Frontend components in `frontend/src/components/`, hooks in `frontend/src/hooks/`, pages in `frontend/src/pages/`
- React Native code in `VeroSuiteMobile/src/`, platform code in `android/` and `ios/`

**What Is Currently Enforced:**
- Deprecated `backend/` path detection (migration to `apps/api/`)
- Import path validation for deprecated paths

**Concrete Examples That Would Slip Through:**
- Agent creates `apps/api/src/utils/feature.ts` when it should be `apps/api/src/feature/feature.service.ts` → **NOT BLOCKED**
- Agent creates `frontend/src/components/UserProfile.tsx` in wrong location → **NOT BLOCKED** (no structure validation)
- Agent creates tests in `apps/api/src/test/` instead of `apps/api/test/` → **NOT BLOCKED**

### Docs & Knowledge Separation

**What Should Be Enforced:**
- All `.md` files (except `README.md`) must be in `docs/` subdirectories
- Source bibles in `docs/bibles/`, compiled bibles in `knowledge/bibles/`
- Reports in `docs/audits/` or `docs/compliance-reports/`
- Architecture docs in `docs/architecture/`
- Guides in `docs/guides/`

**What Is Currently Enforced:**
- Nothing (rules exist in `docs/file-organization.md` but not enforced)

**Concrete Examples That Would Slip Through:**
- Agent creates `apps/api/src/API_DOCS.md` → **NOT BLOCKED**
- Agent creates `ARCHITECTURE.md` in root → **NOT BLOCKED**
- Agent creates `docs/bibles/typescript.md` (source) and `knowledge/bibles/typescript/compiled/` (compiled) → **NOT VALIDATED**

### Services, Monitoring, Deploy, Scripts

**What Should Be Enforced:**
- OPA policies only in `services/opa/policies/`
- Deployment configs in `deploy/` (organized by environment)
- Monitoring configs in `monitoring/prometheus/` and `monitoring/alertmanager/`
- Automation scripts in `scripts/` or `.cursor/scripts/` (not scattered)

**What Is Currently Enforced:**
- Nothing

**Concrete Examples That Would Slip Through:**
- Agent creates `apps/api/src/policies/auth.rego` → **NOT BLOCKED** (should be `services/opa/policies/`)
- Agent creates `deploy-config.yml` in root → **NOT BLOCKED**
- Agent creates `monitoring.yml` in root → **NOT BLOCKED**
- Agent creates `scripts/deploy.sh` in wrong location → **NOT BLOCKED**

### Legacy & Archives

**What Should Be Enforced:**
- `enforcement/` directory is read-only (legacy, migrated to `.cursor/enforcement/`)
- No new files created in `enforcement/`
- Warnings if agent proposes modifying files in `enforcement/`

**What Is Currently Enforced:**
- Nothing

**Concrete Examples That Would Slip Through:**
- Agent creates `enforcement/new-rule.mdc` → **NOT BLOCKED** (should warn/block)
- Agent modifies `enforcement/old-file.md` → **NOT BLOCKED** (should warn)

---

## Rule Change Plan

### Decision: Update Existing Rules + Create New Rule

**Strategy:**
1. **Update** `ArchitectureDriftDetector` in `detection_functions.py` to expand file placement checks
2. **Create** new `FilesystemOrganizationDetector` in `detection_functions.py` for comprehensive organization enforcement
3. **Create** new rule file `.cursor/rules/11-filesystem-organization.mdc` (or integrate into existing architecture rule)

### Proposed Changes

#### Change 1: Expand ArchitectureDriftDetector

**File:** `.cursor/scripts/veroscore_v3/detection_functions.py`

**Scope:** 
- Root directory violations
- Legacy directory usage
- App/service structure validation

**Enforcement Level:** 
- **BLOCK** for root directory violations (new dirs, prohibited files)
- **BLOCK** for legacy directory writes
- **WARNING** for app structure deviations

**Example Violations It Should Catch:**
- `PROJECT_STATUS.md` created in root → **BLOCK**
- `new-feature/` directory created at root → **BLOCK**
- File created in `enforcement/` → **BLOCK**
- `apps/api/src/utils/feature.ts` when feature module structure expected → **WARNING**

**Example Allowed Operations:**
- `README.md` in root → **ALLOWED**
- `package.json` in root → **ALLOWED**
- New feature module in `apps/api/src/feature/` → **ALLOWED**
- Documentation in `docs/guides/` → **ALLOWED**

#### Change 2: Create FilesystemOrganizationDetector

**File:** `.cursor/scripts/veroscore_v3/detection_functions.py` (new class)

**Scope:**
- Documentation file placement (`.md` files)
- File type organization (SQL, images, configs)
- Service-specific structure (OPA, monitoring, deploy)
- Knowledge base structure

**Enforcement Level:**
- **BLOCK** for documentation files outside `docs/`
- **WARNING** for file type misplacement (SQL, images)
- **WARNING** for service config misplacement

**Example Violations It Should Catch:**
- `apps/api/src/API_DOCS.md` → **BLOCK** (should be in `docs/`)
- `migration.sql` in root → **WARNING** (should be in `supabase/migrations/`)
- `logo.png` in root → **WARNING** (should be in `branding/assets/`)
- OPA policy in `apps/api/src/policies/` → **WARNING** (should be in `services/opa/policies/`)

**Example Allowed Operations:**
- `README.md` in root → **ALLOWED**
- `README.md` in subdirectories → **ALLOWED**
- Documentation in `docs/guides/` → **ALLOWED**
- SQL migration in `supabase/migrations/` → **ALLOWED**

#### Change 3: Create Filesystem Organization Rule

**File:** `.cursor/rules/11-filesystem-organization.mdc` (new file)

**Scope:**
- Root directory rules
- Directory structure rules
- File type placement rules
- Legacy directory rules

**Enforcement Level:**
- **BLOCK** for critical violations (root dirs, legacy writes)
- **WARNING** for organizational issues (file type placement)

**Integration:**
- Referenced by `auto-enforcer.py` for rule-based checks
- Used by `FilesystemOrganizationDetector` for pattern matching

---

## Enforcement Script Change Plan

### Script 1: `auto-enforcer.py`

**Current State:**
- Checks security files in canonical locations
- Uses `ArchitectureDriftDetector` for deprecated paths
- No organization-specific checks

**Required Changes:**
1. **Add FilesystemOrganizationDetector to detection pipeline:**
   - Import `FilesystemOrganizationDetector` from `detection_functions.py`
   - Add to `MasterDetector.detectors` list
   - Ensure it runs on all file changes

2. **Add root directory scanning:**
   - Scan root directory for prohibited files/directories
   - Check against allowlist (README.md, package.json, etc.)
   - Flag new root-level directories

3. **Add legacy directory protection:**
   - Check if file changes target `enforcement/` directory
   - Block or warn on writes to legacy directory

**New Responsibility Boundaries:**
- `auto-enforcer.py` orchestrates all detectors (including new organization detector)
- Organization checks run as part of standard violation detection
- Results integrated into `ENFORCER_REPORT.json`

### Script 2: `detection_functions.py`

**Current State:**
- `ArchitectureDriftDetector` checks deprecated paths
- `_check_file_placement()` only checks deprecated backend paths

**Required Changes:**
1. **Expand `ArchitectureDriftDetector._check_file_placement()`:**
   - Add root directory checks
   - Add legacy directory checks
   - Add app structure validation

2. **Create `FilesystemOrganizationDetector` class:**
   - Documentation file placement validation
   - File type organization checks
   - Service-specific structure validation

**New Modules:**
- `FilesystemOrganizationDetector` class (new)
- Helper functions for:
  - Root directory allowlist validation
  - Documentation path validation
  - File type categorization
  - Service structure validation

### Script 3: `watch-files.py`

**Current State:**
- Watches directories for changes
- Triggers enforcement on file modifications
- Ignores certain paths (`.cursor/enforcement`, `node_modules`, etc.)

**Required Changes:**
1. **Add organization-specific file watching:**
   - Watch root directory for new files/directories
   - Watch `docs/` for organization compliance
   - Watch legacy `enforcement/` for write attempts

2. **Update ignore patterns:**
   - Ensure legacy `enforcement/` is watched (not ignored)
   - Ensure root directory is watched

**New Responsibility Boundaries:**
- `watch-files.py` detects file changes
- Organization violations detected by `FilesystemOrganizationDetector` (called by `auto-enforcer.py`)

### Script 4: `pre-flight-check.py`

**Current State:**
- Validates Memory Bank files
- Validates rule files
- No organization checks

**Required Changes:**
1. **Add organization pre-flight checks:**
   - Verify no prohibited files in root
   - Verify legacy `enforcement/` is not being written to
   - Verify documentation structure is intact

**New Responsibility Boundaries:**
- `pre-flight-check.py` validates organization state before enforcement runs
- Does not fix violations, only reports them

### Script 5: `test-enforcement.py`

**Current State:**
- Tests enforcement scenarios
- No organization-specific tests

**Required Changes:**
1. **Add organization test scenarios:**
   - Test root directory violation detection
   - Test documentation placement validation
   - Test legacy directory protection
   - Test file type organization

**New Test Cases:**
- Root directory violation scenarios
- Documentation misplacement scenarios
- Legacy directory write scenarios
- File type organization scenarios

---

## Growth & Future-Proofing

### Organization Invariants

#### Invariant 1: Root Directory Control
**Rule:** "No new top-level directories without an explicit rule + allowlist entry."

**Enforcement:**
- **Rule:** `.cursor/rules/11-filesystem-organization.mdc` (root directory section)
- **Script:** `FilesystemOrganizationDetector` in `detection_functions.py`
- **Level:** **BLOCK**

**When Adding:**
- New app → Must be in `apps/` (not root)
- New service → Must be in `services/` (not root)
- New shared library → Must be in `libs/` (not root)
- New documentation area → Must be in `docs/` (not root)

**Process:**
1. If new root directory needed, update `.cursor/rules/11-filesystem-organization.mdc` allowlist
2. Update `FilesystemOrganizationDetector.ROOT_ALLOWED_DIRECTORIES`
3. Re-run enforcer to verify

#### Invariant 2: Documentation Location
**Rule:** "All human documentation must live under `docs/` or `apps/*/docs/`."

**Enforcement:**
- **Rule:** `.cursor/rules/11-filesystem-organization.mdc` (documentation section)
- **Script:** `FilesystemOrganizationDetector` in `detection_functions.py`
- **Level:** **BLOCK** for `.md` files outside `docs/` (except `README.md`)

**When Adding:**
- New documentation topic → Create subdirectory in `docs/` (e.g., `docs/new-topic/`)
- App-specific docs → Create `apps/[app]/docs/` subdirectory
- Reports/audits → Use `docs/audits/` or `docs/compliance-reports/`

**Process:**
1. Determine documentation category (guide, reference, architecture, etc.)
2. Place in appropriate `docs/` subdirectory
3. Enforcer validates placement

#### Invariant 3: Legacy Directory Protection
**Rule:** "Legacy/archived directories are read-only and never receive new files."

**Enforcement:**
- **Rule:** `.cursor/rules/11-filesystem-organization.mdc` (legacy section)
- **Script:** `FilesystemOrganizationDetector` in `detection_functions.py`
- **Level:** **BLOCK** for writes to legacy directories

**Legacy Directories:**
- `enforcement/` → Migrated to `.cursor/enforcement/`
- `docs/archive/` → Read-only historical docs
- Any directory marked as legacy in rule file

**Process:**
1. If directory is legacy, add to `FilesystemOrganizationDetector.LEGACY_DIRECTORIES`
2. Enforcer blocks writes to legacy directories
3. Agent must use canonical location (e.g., `.cursor/enforcement/` instead of `enforcement/`)

#### Invariant 4: App Structure Consistency
**Rule:** "All apps follow consistent structure: `apps/[name]/src/` for source, `apps/[name]/test/` for tests."

**Enforcement:**
- **Rule:** `.cursor/rules/11-filesystem-organization.mdc` (app structure section)
- **Script:** `ArchitectureDriftDetector` (expanded) in `detection_functions.py`
- **Level:** **WARNING** for structure deviations

**When Adding:**
- New app → Create `apps/[name]/` with `src/` and `test/` subdirectories
- New feature → Create feature module in `apps/[name]/src/[feature]/`
- Tests → Mirror `src/` structure in `test/`

**Process:**
1. Follow app structure template from `PROJECT_STRUCTURE_REPORT.md`
2. Enforcer warns if structure deviates
3. Agent corrects structure based on warnings

#### Invariant 5: Service Structure Consistency
**Rule:** "Services follow `services/[name]/` structure with service-specific subdirectories."

**Enforcement:**
- **Rule:** `.cursor/rules/11-filesystem-organization.mdc` (service structure section)
- **Script:** `FilesystemOrganizationDetector` in `detection_functions.py`
- **Level:** **WARNING** for service config misplacement

**When Adding:**
- New service → Create `services/[name]/` directory
- OPA policies → Must be in `services/opa/policies/`
- Service configs → Must be in `services/[name]/` or appropriate service directory

**Process:**
1. Determine service type (OPA, monitoring, etc.)
2. Place in appropriate `services/[name]/` directory
3. Enforcer validates placement

---

## Risks & Open Questions

### Ambiguities

1. **App vs Library Boundary:**
   - **Question:** When should code go in `apps/[name]/` vs `libs/[name]/`?
   - **Current State:** No enforcement, relies on developer judgment
   - **Risk:** Inconsistent placement
   - **Recommendation:** Add rule: "Apps are runnable applications, libs are shared code. If it's shared across apps, it's a lib."

2. **Documentation in App Directories:**
   - **Question:** Should `apps/api/docs/` be allowed, or must all docs be in root `docs/`?
   - **Current State:** `PROJECT_STRUCTURE_REPORT.md` shows `apps/api/docs/` exists
   - **Risk:** Inconsistent documentation location
   - **Recommendation:** Allow app-specific docs in `apps/[name]/docs/` but enforce structure

3. **Legacy Directory Migration:**
   - **Question:** Should `enforcement/` be completely removed or kept as read-only archive?
   - **Current State:** `enforcement/` exists, `.cursor/enforcement/` is active
   - **Risk:** Agents may still write to legacy directory
   - **Recommendation:** Mark as read-only, block writes, plan migration/removal

### Potential Conflicts

1. **Strict Organization vs Developer Ergonomics:**
   - **Conflict:** Strict rules may slow down development
   - **Mitigation:** Use **WARNING** for non-critical violations, **BLOCK** only for critical issues (root dirs, legacy writes)

2. **Rule File Location:**
   - **Conflict:** Should organization rules be in `.cursor/rules/` or `docs/`?
   - **Current State:** `docs/file-organization.md` exists but not enforced
   - **Recommendation:** Create `.cursor/rules/11-filesystem-organization.mdc` for enforcement, keep `docs/file-organization.md` as reference

3. **Test File Organization:**
   - **Conflict:** Some tests are co-located (`__tests__/`), others are in `test/` directories
   - **Current State:** Mixed approach
   - **Recommendation:** Allow both but enforce consistency within each app (either all co-located or all in `test/`)

---

## Rule Changes To Implement (Summary)

1. **Update `ArchitectureDriftDetector._check_file_placement()`:**
   - Add root directory violation checks
   - Add legacy directory write checks
   - Add app structure validation (WARNING level)

2. **Create `FilesystemOrganizationDetector` class:**
   - Documentation file placement validation (BLOCK level)
   - File type organization checks (WARNING level)
   - Service-specific structure validation (WARNING level)

3. **Create `.cursor/rules/11-filesystem-organization.mdc`:**
   - Root directory rules
   - Directory structure rules
   - File type placement rules
   - Legacy directory rules

4. **Update `auto-enforcer.py`:**
   - Add `FilesystemOrganizationDetector` to detection pipeline
   - Add root directory scanning
   - Add legacy directory protection

5. **Update `watch-files.py`:**
   - Watch root directory for organization violations
   - Watch legacy `enforcement/` for write attempts

6. **Update `pre-flight-check.py`:**
   - Add organization pre-flight checks

7. **Update `test-enforcement.py`:**
   - Add organization test scenarios

---

## Implementation Priority

### Phase 1: Critical Blocking Rules (High Priority)
1. Root directory enforcement (BLOCK)
2. Legacy directory protection (BLOCK)
3. Documentation placement (BLOCK for `.md` files outside `docs/`)

### Phase 2: Organizational Warnings (Medium Priority)
1. File type organization (WARNING)
2. Service structure validation (WARNING)
3. App structure validation (WARNING)

### Phase 3: Testing & Refinement (Lower Priority)
1. Add test scenarios
2. Refine detection patterns based on real usage
3. Optimize performance

---

**End of Analysis Report**

**Next Steps:**
1. Review this analysis with stakeholders
2. Approve rule change plan
3. Hand off to EXECUTION BRAIN for implementation











