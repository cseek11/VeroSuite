# VeroField Filesystem Organization Analysis
## ANALYSIS BRAIN Output - Filesystem Layout & Organization Plan

**Date:** 2025-12-05  
**Role:** ANALYSIS BRAIN (No file modifications)  
**Purpose:** Design canonical directory model and migration plan for EXECUTION BRAIN

---

## 1. CANONICAL TOP-LEVEL DIRECTORY MAP

| Directory | Role/Purpose | Type | Status |
|-----------|--------------|------|--------|
| `.ai/` | **AI/LLM Data Home** - Rules, memory bank, patterns, logs | Active Source | ✅ Canonical |
| `.cursor/` | **Cursor IDE Integration** - Light summaries, interface rules only | Active Source | ✅ Canonical |
| `.cursor__archived_*/` | **Archived Cursor Configs** - Historical record, read-only | Archive | 🔒 Read-Only |
| `.cursor__disabled/` | **Disabled Cursor Config** - Historical record, read-only | Archive | 🔒 Read-Only |
| `.git/` | Git repository metadata | System | ✅ Keep |
| `.github/` | GitHub Actions workflows and scripts | Active Source | ✅ Canonical |
| `.husky/` | Git hooks | Active Source | ✅ Canonical |
| `.vscode/` | VS Code configuration | Active Source | ✅ Canonical |
| `apps/` | **Monorepo Applications** - Backend API | Active Source | ✅ Canonical |
| `frontend/` | **Frontend Application** - React/Vite app | Active Source | ✅ Canonical |
| `VeroSuiteMobile/` | **Mobile Application** - React Native app | Active Source | ✅ Canonical |
| `verofield-website/` | **Marketing Website** - Static site | Active Source | ✅ Canonical |
| `libs/` | **Shared Libraries** - Monorepo workspace | Active Source | ✅ Canonical |
| `shared/` | **Shared Code** - Cross-app utilities | Active Source | ✅ Canonical |
| `docs/` | **Human Documentation** - All project docs (200+ .md) | Active Source | ✅ Canonical |
| `knowledge/` | **Compiled Knowledge** - Bibles for consumption | Generated | ✅ Canonical |
| `services/` | **Service Configurations** - OPA policies, etc. | Active Source | ✅ Canonical |
| `scripts/` | **Root-Level Scripts** - Utility scripts | Active Source | ✅ Canonical |
| `tools/` | **Development Tools** - Bible pipeline, diagnostics | Active Source | ✅ Canonical |
| `tests/` | **Root-Level Tests** - Cross-app tests | Active Source | ✅ Canonical |
| `branding/` | **Branding Assets** - Images, videos, logos | Active Source | ✅ Canonical |
| `deploy/` | **Deployment Configs** - Docker, K8s, infra | Active Source | ✅ Canonical |
| `monitoring/` | **Monitoring Configs** - Prometheus, alerts | Active Source | ✅ Canonical |
| `supabase/` | **Supabase Functions** - Edge functions | Active Source | ✅ Canonical |
| `coverage/` | **Test Coverage** - Generated reports (currently empty) | Generated | ⚠️ Needs Review |
| `Test_Results/` | **Test Results** - Generated output (currently empty) | Generated | ⚠️ Needs Review |
| `node_modules/` | Node.js dependencies | Generated | ✅ Gitignored |

### Allowed Root Directories Summary

**✅ ACTIVE SOURCES (Code, Config, Docs):**
- `.ai/`, `.cursor/`, `.github/`, `.husky/`, `.vscode/`
- `apps/`, `frontend/`, `VeroSuiteMobile/`, `verofield-website/`
- `libs/`, `shared/`, `docs/`, `services/`, `scripts/`, `tools/`, `tests/`
- `branding/`, `deploy/`, `monitoring/`, `supabase/`

**✅ GENERATED/COMPILED:**
- `knowledge/` (compiled bibles)
- `coverage/`, `Test_Results/` (test outputs - should be in `.build/` or gitignored)

**🔒 ARCHIVES (Read-Only):**
- `.cursor__archived_*/`, `.cursor__disabled/`

**❌ PROHIBITED NEW ROOT DIRECTORIES:**
- No new top-level directories without explicit approval
- No temporary directories (use `.build/` or gitignored locations)
- No duplicate documentation roots (use `docs/` only)

---

## 2. AREA SPECIFICATIONS

### 2.1 `.ai/` - AI/LLM Data Home

**Purpose:** Canonical "second brain" data home for all AI agent artifacts, rules, memory, patterns, and logs.

**Structure:**
```
.ai/
├── rules/              # Rule definitions (.mdc files) - SOURCE OF TRUTH
├── memory_bank/        # Memory bank files (.md) - SOURCE OF TRUTH
├── patterns/           # Pattern definitions (.md) - SOURCE OF TRUTH
└── logs/               # AI agent logs and reports
    └── enforcer/       # Auto-enforcer full reports (.md, .json)
```

**Allowed File Types:**
- `.mdc` - Rule definitions (Markdown Cursor format)
- `.md` - Memory bank, patterns, logs, reports
- `.json` - Structured data (enforcer reports, session data)
- `.txt` - Plain text logs (if needed)

**Forbidden File Types:**
- ❌ Source code (`.ts`, `.tsx`, `.js`, `.py`, etc.) - belongs in `apps/`, `frontend/`, `scripts/`
- ❌ Configuration files (`.json` configs) - belongs in app roots or `.vscode/`, `.github/`
- ❌ Test files - belongs in `tests/` or app-specific test directories
- ❌ Documentation for humans - belongs in `docs/`

**Where AI Agents Should Save:**

| Artifact Type | Location | Example |
|--------------|----------|---------|
| **Heavy Reports** (>5KB, detailed analysis) | `.ai/logs/enforcer/` | `AUTO_ENFORCER_PERFORMANCE_INVESTIGATION.md` |
| **Short Summaries** (<5KB, status updates) | `.cursor/enforcement/` | `ENFORCER_STATUS.md` |
| **Memory Bank Data** | `.ai/memory_bank/` | `activeContext.md`, `progress.md` |
| **Rules & Patterns** | `.ai/rules/`, `.ai/patterns/` | `00-master.mdc`, `config-service-async-module-registration.md` |
| **Session Data** | `.cursor/enforcement/session.json` | Current session state |
| **Full Violation Logs** | `.ai/logs/enforcer/VIOLATIONS_FULL.md` | Complete violation history |
| **Summary Violations** | `.cursor/enforcement/VIOLATIONS.md` | Current session violations |

**Current Issues:**
- ✅ Structure is correct
- ⚠️ Some enforcement summaries in `.cursor/enforcement/` should reference full reports in `.ai/logs/enforcer/`

---

### 2.2 `.cursor/` - Cursor IDE Integration

**Purpose:** Light-weight IDE integration files - summaries, status, interface rules only. NOT a data store.

**Structure:**
```
.cursor/
├── enforcement/       # Light summaries and status (IDE display)
│   ├── ENFORCER_STATUS.md          # Current status summary
│   ├── VIOLATIONS.md                # Current violations summary
│   ├── AGENT_STATUS.md              # Agent status summary
│   ├── ENFORCEMENT_BLOCK.md        # Block status (if active)
│   └── session.json                 # Current session state
└── rules/              # LLM interface rules (referenced by .cursorrules)
    ├── 00-llm-interface.mdc
    ├── 01-llm-security-lite.mdc
    └── 02-llm-fix-mode.mdc
```

**Allowed File Types:**
- `.md` - Light summaries (<5KB), status files
- `.json` - Session state, lightweight reports
- `.mdc` - Interface rules (referenced by `.cursorrules`)

**Forbidden File Types:**
- ❌ Heavy reports (>5KB) - belongs in `.ai/logs/enforcer/`
- ❌ Rule definitions (full rules) - belongs in `.ai/rules/`
- ❌ Memory bank data - belongs in `.ai/memory_bank/`
- ❌ Pattern definitions - belongs in `.ai/patterns/`

**Where AI Agents Should Save:**

| Artifact Type | Location | Rationale |
|--------------|----------|-----------|
| **Status Summaries** | `.cursor/enforcement/*.md` | Quick IDE visibility |
| **Session State** | `.cursor/enforcement/session.json` | Current session context |
| **Interface Rules** | `.cursor/rules/*.mdc` | Referenced by `.cursorrules` |
| **Enforcement Block** | `.cursor/enforcement/ENFORCEMENT_BLOCK.md` | Active block status |

**Current Issues:**
- ⚠️ Some files in `.cursor/enforcement/` may be too large (should reference full reports in `.ai/logs/enforcer/`)
- ✅ Structure is mostly correct

---

### 2.3 `docs/` - Human Documentation

**Purpose:** All human-readable documentation for developers, users, and stakeholders.

**Structure:**
```
docs/
├── reference/          # Essential reference docs
├── guides/             # How-to guides
├── architecture/      # System design docs
├── planning/           # Development plans
├── audits/             # Audit reports (historical)
├── bibles/             # Bible SOURCE files (before compilation)
│   ├── typescript/     # TypeScript Bible source (.mdc, .md)
│   ├── python/         # Python Bible source
│   └── rego/           # Rego/OPA Bible source
└── [200+ .md files]    # Comprehensive documentation
```

**Allowed File Types:**
- `.md` - All documentation
- `.mdc` - Bible source files (before compilation to `knowledge/`)
- `.yaml`, `.yml` - Documentation configs (if needed)

**Forbidden File Types:**
- ❌ Compiled bibles - belongs in `knowledge/bibles/`
- ❌ AI agent logs - belongs in `.ai/logs/`
- ❌ Source code - belongs in app directories
- ❌ Test files - belongs in test directories

**Where AI Agents Should Save:**

| Artifact Type | Location | Example |
|--------------|----------|---------|
| **Human Documentation** | `docs/` (appropriate subdir) | `docs/guides/getting-started/README.md` |
| **Architecture Docs** | `docs/architecture/` | `docs/architecture/system-overview.md` |
| **Audit Reports** | `docs/audits/` | `docs/audits/COMPLIANCE_AUDIT_REPORT.md` |
| **Bible Sources** | `docs/bibles/{language}/` | `docs/bibles/typescript/typescript_bible_unified.mdc` |

**Current Issues:**
- ✅ Structure is good
- ⚠️ Some root-level `.md` files should be moved to `docs/audits/` or `docs/planning/`

---

### 2.4 `knowledge/` - Compiled Knowledge

**Purpose:** Compiled, consumption-ready knowledge artifacts (bibles, reference materials).

**Structure:**
```
knowledge/
└── bibles/             # Compiled bibles (for consumption)
    ├── python/
    │   ├── compiled/   # SSM format
    │   └── cursor/     # Cursor format
    ├── rego/
    │   ├── compiled/
    │   └── cursor/
    └── typescript/
        └── cursor/
```

**Allowed File Types:**
- `.md`, `.mdc` - Compiled bible files
- `.ssm.md` - SSM format bibles

**Forbidden File Types:**
- ❌ Source bibles - belongs in `docs/bibles/`
- ❌ Build scripts - belongs in `tools/`
- ❌ Test files - belongs in test directories

**Where AI Agents Should Save:**
- ❌ **AI agents should NOT write to `knowledge/`** - this is generated by build pipeline
- ✅ Build pipeline (`tools/bible_*.py`) generates these files

**Current Issues:**
- ✅ Structure is correct
- ✅ Separation from `docs/bibles/` (source) is correct

---

### 2.5 `apps/api/` - Backend API

**Purpose:** NestJS backend API application.

**Allowed File Types:**
- `.ts` - TypeScript source code
- `.js` - Compiled JavaScript (in `dist/`)
- `.spec.ts`, `.e2e-spec.ts` - Test files
- `.json` - Configuration files
- `.md` - API-specific documentation (in `docs/` subdir)
- `.sql` - Migration scripts (in Prisma migrations)

**Forbidden File Types:**
- ❌ Root-level audit reports - belongs in `docs/audits/` or `.ai/logs/`
- ❌ AI agent logs - belongs in `.ai/logs/`
- ❌ General documentation - belongs in `docs/`

**Where AI Agents Should Save:**
- ✅ Source code changes - in `src/`
- ✅ Test files - in `test/`
- ✅ API documentation - in `apps/api/docs/`

**Current Issues:**
- ✅ Structure is correct

---

### 2.6 `frontend/` - Frontend Application

**Purpose:** React/Vite frontend application.

**Allowed File Types:**
- `.tsx`, `.ts` - TypeScript/React source
- `.css` - Stylesheets
- `.js` - JavaScript utilities
- `.json` - Configuration
- `.html` - HTML templates
- `.md` - Frontend-specific docs (in `docs/` subdir)

**Forbidden File Types:**
- ❌ Root-level reports - belongs in `docs/` or `.ai/logs/`
- ❌ AI agent logs - belongs in `.ai/logs/`

**Where AI Agents Should Save:**
- ✅ Source code - in `src/`
- ✅ Tests - in `test/` or `src/__tests__/`
- ✅ Frontend docs - in `frontend/docs/`

**Current Issues:**
- ✅ Structure is correct

---

### 2.7 `libs/common/` - Shared Library

**Purpose:** Shared TypeScript library and Prisma schema.

**Allowed File Types:**
- `.ts` - TypeScript source
- `.prisma` - Prisma schema
- `.sql` - Migration SQL
- `.md` - Library documentation

**Forbidden File Types:**
- ❌ App-specific code - belongs in `apps/` or `frontend/`
- ❌ Test files for apps - belongs in app test directories

**Current Issues:**
- ✅ Structure is correct

---

### 2.8 `services/opa/` - OPA Policies

**Purpose:** Open Policy Agent policies and tests.

**Allowed File Types:**
- `.rego` - OPA policy files
- `.json` - Test input/output
- `.md` - OPA documentation
- `.exe` - OPA binary (platform-specific)

**Forbidden File Types:**
- ❌ General documentation - belongs in `docs/`
- ❌ Source code - belongs in app directories

**Current Issues:**
- ✅ Structure is correct

---

### 2.9 `scripts/` - Root-Level Scripts

**Purpose:** Utility scripts for build, deployment, migration, etc.

**Allowed File Types:**
- `.ps1` - PowerShell scripts
- `.ts`, `.js` - TypeScript/JavaScript scripts
- `.py` - Python scripts
- `.sh` - Shell scripts
- `.sql` - SQL scripts

**Forbidden File Types:**
- ❌ Source code - belongs in app directories
- ❌ Test files - belongs in test directories
- ❌ Documentation - belongs in `docs/`

**Current Issues:**
- ✅ Structure is correct

---

### 2.10 `tools/` - Development Tools

**Purpose:** Development tools, bible pipeline, diagnostics.

**Allowed File Types:**
- `.py` - Python tools
- `.md` - Tool documentation
- `Makefile.*` - Build makefiles

**Forbidden File Types:**
- ❌ Compiled bibles - belongs in `knowledge/`
- ❌ Source bibles - belongs in `docs/bibles/`

**Current Issues:**
- ✅ Structure is correct

---

### 2.11 `tests/` - Root-Level Tests

**Purpose:** Cross-application tests, integration tests.

**Allowed File Types:**
- `.ts`, `.js` - Test files
- `.py` - Python tests
- `.md` - Test documentation

**Forbidden File Types:**
- ❌ App-specific tests - belongs in app test directories

**Current Issues:**
- ✅ Structure is correct

---

### 2.12 `branding/` - Branding Assets

**Purpose:** Images, videos, logos, screenshots.

**Allowed File Types:**
- `.png`, `.jpg`, `.jpeg`, `.webp` - Images
- `.svg` - Vector graphics
- `.gif` - Animated images
- `.mp4`, `.mov` - Videos

**Forbidden File Types:**
- ❌ Source code
- ❌ Documentation (except asset catalogs)

**Current Issues:**
- ✅ Structure is correct

---

### 2.13 `deploy/` - Deployment Configs

**Purpose:** Docker, Kubernetes, infrastructure configurations.

**Allowed File Types:**
- `.yml`, `.yaml` - Kubernetes, Docker Compose
- `.json` - Deployment configs (if needed)
- `.md` - Deployment documentation

**Current Issues:**
- ✅ Structure is correct

---

### 2.14 `monitoring/` - Monitoring Configs

**Purpose:** Prometheus, Alertmanager configurations.

**Allowed File Types:**
- `.yml`, `.yaml` - Monitoring configs
- `.md` - Monitoring documentation

**Current Issues:**
- ✅ Structure is correct

---

### 2.15 `coverage/` and `Test_Results/` - Generated Outputs

**Purpose:** Test coverage reports and test results (currently empty).

**Current Issues:**
- ⚠️ These should be in `.build/` or gitignored
- ⚠️ Currently empty but taking up root space
- ✅ Already in `.gitignore` (good)

**Recommendation:**
- Move to `.build/coverage/` and `.build/test-results/` OR
- Keep gitignored at root (acceptable if empty)

---

## 3. PROBLEM & RISK LIST

### LAYOUT-RISK-01: Root Directory Pollution
**Severity:** HIGH  
**Issue:** 81 `.md` files in root directory  
**Impact:** 
- Clutters root, makes navigation difficult
- Violates file organization rules
- Risk of Cursor OOM if more files added
- Hard to find relevant documentation

**Files Affected:**
- `ENFORCEMENT_REFACTOR_EXECUTION_PLAN.md`
- `ENFORCEMENT_REFACTOR_ANALYSIS_PLAN.md`
- `AUTO_ENFORCER_*.md` (multiple files)
- `CONTEXT_*.md` (multiple files)
- `TWO_BRAIN_*.md` (multiple files)
- `PYTHON_BIBLE_*.md` (multiple files)
- And ~60+ more audit/report files

**Target Location:** 
- Audit reports → `docs/audits/`
- Execution plans → `docs/planning/`
- Analysis reports → `docs/audits/` or `.ai/logs/enforcer/` (if AI-generated)

---

### LAYOUT-RISK-02: Overlap Between `.ai/` and `.cursor/`
**Severity:** MEDIUM  
**Issue:** Unclear boundary between `.ai/logs/enforcer/` and `.cursor/enforcement/`  
**Impact:**
- Confusion about where to save reports
- Potential duplication
- Inconsistent file placement

**Current State:**
- `.cursor/enforcement/` has: `ENFORCER_REPORT.json`, `VIOLATIONS.md`, `AGENT_STATUS.md`
- `.ai/logs/enforcer/` has: `AGENT_STATUS_FULL.md`, `ENFORCER_REPORT_FULL.json`, `VIOLATIONS_FULL.md`

**Target Model:**
- `.ai/logs/enforcer/` = Full, detailed reports (>5KB)
- `.cursor/enforcement/` = Light summaries (<5KB) that reference full reports

---

### LAYOUT-RISK-03: Bible Source vs Compiled Confusion
**Severity:** LOW  
**Issue:** Bibles exist in both `docs/bibles/` (source) and `knowledge/bibles/` (compiled)  
**Impact:**
- Potential confusion about which is source of truth
- Risk of editing compiled files instead of sources

**Current State:**
- ✅ Separation is actually correct
- ⚠️ Need clear documentation that `docs/bibles/` is source, `knowledge/bibles/` is generated

**Target Model:**
- `docs/bibles/` = Source (editable)
- `knowledge/bibles/` = Compiled (generated by `tools/bible_*.py`)

---

### LAYOUT-RISK-04: Empty Generated Directories at Root
**Severity:** LOW  
**Issue:** `coverage/` and `Test_Results/` are empty but present at root  
**Impact:**
- Clutters root directory
- Confusion about purpose

**Target Model:**
- Move to `.build/coverage/` and `.build/test-results/` OR
- Keep gitignored (acceptable if always empty)

---

### LAYOUT-RISK-05: Root-Level Text Files
**Severity:** LOW  
**Issue:** 6 `.txt` files in root (logs, outputs)  
**Impact:**
- Should be in `.build/` or gitignored
- Clutters root

**Target Location:**
- Move to `.build/logs/` or gitignore

---

### LAYOUT-RISK-06: Documentation in Multiple Locations
**Severity:** MEDIUM  
**Issue:** Documentation exists in:
- Root (81 `.md` files) ❌
- `docs/` (200+ `.md` files) ✅
- `apps/api/docs/` (5 `.md` files) ✅
- `frontend/docs/` (2 `.md` files) ✅

**Impact:**
- Hard to find documentation
- Inconsistent organization

**Target Model:**
- Root: Only `README.md` ✅
- `docs/` = Main documentation hub ✅
- App-specific docs in `apps/*/docs/` = OK ✅

---

### LAYOUT-RISK-07: Archive Directories Not Clearly Marked
**Severity:** LOW  
**Issue:** `.cursor__archived_*` and `.cursor__disabled` are archives but not explicitly documented as read-only  
**Impact:**
- Risk of accidentally using archived configs
- Confusion about which rules are active

**Target Model:**
- Add `README.md` in each archive explaining it's read-only
- Document in main `README.md` that these are archives

---

## 4. TARGET LAYOUT SUMMARY

### High-Level Organization Principles

1. **`.ai/` = AI Data Home**
   - All AI agent artifacts, rules, memory, patterns, logs
   - Heavy reports in `.ai/logs/enforcer/`
   - Source of truth for rules and memory bank

2. **`.cursor/` = IDE Integration Only**
   - Light summaries (<5KB) for IDE display
   - Interface rules referenced by `.cursorrules`
   - Session state

3. **`docs/` = Human Documentation**
   - All human-readable documentation
   - Bible sources (before compilation)
   - Audit reports, planning docs, guides

4. **`knowledge/` = Compiled Knowledge**
   - Generated bibles (from `docs/bibles/`)
   - Consumption-ready artifacts
   - Build pipeline output

5. **Root Directory = Minimal**
   - Only essential config files
   - `README.md` only
   - No reports, audits, or documentation

6. **Generated Outputs = `.build/` or Gitignored**
   - Test coverage, test results
   - Build artifacts
   - Temporary files

### New Directory Structure (if needed)

**Optional:** Create `.build/` for generated outputs:
```
.build/
├── coverage/          # Test coverage reports
├── test-results/      # Test result outputs
└── logs/              # Build logs, temporary outputs
```

**Rationale:**
- Keeps root clean
- Clear separation of generated vs source
- Can be gitignored entirely

---

## 5. EXECUTION PLAN FOR EXECUTION BRAIN

### Phase 1: Root Directory Cleanup (HIGH PRIORITY)

#### Step 1.1: Categorize Root-Level `.md` Files

**Action:** Scan all 81 root-level `.md` files and categorize:

1. **Audit Reports** → `docs/audits/`
   - Pattern: `*_AUDIT_*.md`, `*_REPORT.md`, `*_ANALYSIS.md`
   - Examples: `AUTO_ENFORCER_VERIFICATION_REPORT.md`, `TWO_BRAIN_AUDIT_REPORT.md`

2. **Execution/Implementation Plans** → `docs/planning/`
   - Pattern: `*_EXECUTION_PLAN.md`, `*_IMPLEMENTATION_*.md`, `*_PLAN.md`
   - Examples: `ENFORCEMENT_REFACTOR_EXECUTION_PLAN.md`

3. **Analysis Documents** → `docs/audits/` or `.ai/logs/enforcer/`
   - Pattern: `*_ANALYSIS.md`, `*_INVESTIGATION.md`
   - If AI-generated: `.ai/logs/enforcer/`
   - If human-written: `docs/audits/`

4. **Status/Progress Reports** → `.ai/logs/enforcer/` (if AI-generated) or `docs/audits/`
   - Pattern: `*_STATUS.md`, `*_PROGRESS.md`, `*_SUMMARY.md`

5. **Protocol/Guide Documents** → `docs/reference/` or `docs/guides/`
   - Pattern: `*_PROTOCOL.md`, `*_GUIDE.md`

**DO NOT MOVE:**
- `README.md` (must stay in root)
- `VEROFIELD_DIRECTORY_TREE.md` (can stay or move to `docs/reference/`)

#### Step 1.2: Move Root-Level Text Files

**Action:** Move `.txt` files to `.build/logs/` or gitignore them

**Files:**
- `error.txt`
- `output.txt`
- `start_session_output.txt`
- `enforcement_output.txt`
- Any other `.txt` files

**Target:** `.build/logs/` (create if needed) OR add to `.gitignore` if temporary

#### Step 1.3: Handle Empty Generated Directories

**Action:** Decide on `coverage/` and `Test_Results/`

**Options:**
1. **Create `.build/` structure:**
   - Move `coverage/` → `.build/coverage/`
   - Move `Test_Results/` → `.build/test-results/`
   - Add `.build/` to `.gitignore`

2. **Keep gitignored at root:**
   - Ensure both are in `.gitignore` ✅ (already done)
   - Add `README.md` in each explaining they're generated

**Recommendation:** Option 1 (create `.build/` structure)

---

### Phase 2: Clarify `.ai/` vs `.cursor/` Boundaries

#### Step 2.1: Audit `.cursor/enforcement/` Files

**Action:** Review all files in `.cursor/enforcement/`:

1. **Files >5KB** → Move full version to `.ai/logs/enforcer/`, keep summary in `.cursor/enforcement/`
2. **Files <5KB** → Keep in `.cursor/enforcement/` if they're summaries

**Files to Review:**
- `ENFORCER_REPORT.json` - Check size, if large, move full to `.ai/logs/enforcer/`
- `VIOLATIONS.md` - Should be summary, full in `.ai/logs/enforcer/VIOLATIONS_FULL.md`
- `AGENT_STATUS.md` - Should be summary
- `ACTIVE_CONTEXT_DUMP.md` - Check size

#### Step 2.2: Ensure Dual-Write Pattern

**Action:** Verify that auto-enforcer writes:
- Full reports → `.ai/logs/enforcer/`
- Summaries → `.cursor/enforcement/`

**If not implemented:** Update auto-enforcer to use dual-write pattern

---

### Phase 3: Documentation Organization

#### Step 3.1: Organize `docs/` Subdirectories

**Action:** Ensure proper subdirectories exist:

```
docs/
├── audits/              # Audit reports (from root)
├── planning/            # Execution plans (from root)
├── reference/           # Reference docs
├── guides/              # How-to guides
├── architecture/        # Architecture docs
└── bibles/              # Bible sources (already exists)
```

**Create missing subdirectories if needed**

#### Step 3.2: Move Root Documentation

**Action:** Execute moves from Phase 1.1 categorization

**Safety Checks:**
- Verify no broken links after moves
- Update any references in code/docs
- Check `.cursorrules` and `.ai/rules/` for hardcoded paths

---

### Phase 4: Archive Directory Documentation

#### Step 4.1: Mark Archives as Read-Only

**Action:** Add `README.md` to archive directories:

1. `.cursor__archived_2025-04-12/README.md`
   ```
   # Archived Cursor Configuration
   
   **Status:** READ-ONLY ARCHIVE
   **Date:** 2025-12-05
   **Purpose:** Historical record of Cursor configuration
   
   ⚠️ DO NOT MODIFY - This is an archive
   ```

2. `.cursor__disabled/README.md`
   ```
   # Disabled Cursor Configuration
   
   **Status:** READ-ONLY ARCHIVE
   **Purpose:** Disabled Cursor rules (migrated to .ai/)
   
   ⚠️ DO NOT MODIFY - This is an archive
   ```

#### Step 4.2: Document Archives in Main README

**Action:** Add section to root `README.md`:
```markdown
## Archive Directories

The following directories are read-only archives:
- `.cursor__archived_*/` - Historical Cursor configurations
- `.cursor__disabled/` - Disabled Cursor rules (migrated to `.ai/`)
```

---

### Phase 5: Create `.build/` Structure (Optional but Recommended)

#### Step 5.1: Create `.build/` Directory

**Action:** Create `.build/` structure:

```
.build/
├── coverage/           # Test coverage reports
├── test-results/       # Test result outputs
└── logs/               # Build logs, temporary outputs
```

#### Step 5.2: Update `.gitignore`

**Action:** Add to `.gitignore`:
```
# Build outputs
.build/
```

#### Step 5.3: Move Generated Outputs

**Action:** Move:
- `coverage/` → `.build/coverage/` (if not empty)
- `Test_Results/` → `.build/test-results/` (if not empty)
- Root `.txt` files → `.build/logs/`

---

### Phase 6: Verification & Documentation

#### Step 6.1: Create File Organization Documentation

**Action:** Create `docs/reference/FILE_ORGANIZATION.md` (or update existing):

- Document canonical directory model
- Explain `.ai/` vs `.cursor/` boundaries
- Document where AI agents should save different artifact types
- Include migration history

#### Step 6.2: Update `.cursorrules` References

**Action:** Verify `.cursorrules` references correct paths:
- `.cursor/rules/` for interface rules ✅
- `.ai/rules/` for full rules ✅
- `.ai/memory_bank/` for memory ✅

#### Step 6.3: Run Validation

**Action:** Create validation script or checklist:
- Verify no `.md` files in root (except `README.md`)
- Verify `.ai/` structure is correct
- Verify `.cursor/` only has light summaries
- Verify `docs/` organization is correct

---

## 6. WHAT MUST NOT BE CHANGED

### ❌ DO NOT MODIFY:

1. **Application Code Structure**
   - `apps/api/src/` - Keep as-is
   - `frontend/src/` - Keep as-is
   - `VeroSuiteMobile/src/` - Keep as-is
   - `libs/common/src/` - Keep as-is

2. **Test Directories**
   - `apps/api/test/` - Keep as-is
   - `frontend/test/` - Keep as-is
   - `tests/` - Keep structure, only organize if needed

3. **Build Outputs**
   - `apps/api/dist/` - Generated, keep as-is
   - `frontend/dist/` - Generated, keep as-is
   - `VeroSuiteMobile/android/app/build/` - Generated, keep as-is

4. **Configuration Files**
   - `package.json` files - Keep as-is
   - `tsconfig.json` files - Keep as-is
   - `.github/workflows/` - Keep as-is
   - `.vscode/` - Keep as-is

5. **Archive Directories**
   - `.cursor__archived_*/` - READ-ONLY, do not modify
   - `.cursor__disabled/` - READ-ONLY, do not modify

6. **Rule Content**
   - `.ai/rules/*.mdc` - Do not modify rule logic/content
   - Only move files, do not edit content

7. **Database Migrations**
   - `libs/common/prisma/migrations/` - Keep as-is
   - Do not reorganize migration files

8. **Branding Assets**
   - `branding/` - Keep structure as-is

---

## 7. MIGRATION SAFETY CHECKLIST

Before executing migration:

- [ ] Backup repository (create branch: `backup/pre-migration`)
- [ ] Verify `.gitignore` is up to date
- [ ] Document all file moves in a migration log
- [ ] Test that builds still work after moves
- [ ] Verify no hardcoded paths in code reference moved files
- [ ] Update any documentation that references moved files
- [ ] Verify `.cursorrules` still works after moves
- [ ] Test that auto-enforcer can still find rules and memory bank
- [ ] Verify IDE integrations still work

---

## 8. SUMMARY

### Key Principles

1. **`.ai/` = AI Data Home** - All AI artifacts, rules, memory, patterns, heavy logs
2. **`.cursor/` = IDE Integration** - Light summaries only, interface rules
3. **`docs/` = Human Documentation** - All human-readable docs, bible sources
4. **`knowledge/` = Compiled Knowledge** - Generated bibles, consumption-ready
5. **Root = Minimal** - Only essential configs, `README.md` only
6. **Generated = `.build/` or Gitignored** - Test outputs, coverage, logs

### Priority Actions

1. **HIGH:** Move 81 root-level `.md` files to appropriate `docs/` subdirectories
2. **HIGH:** Clarify `.ai/` vs `.cursor/` boundaries (dual-write pattern)
3. **MEDIUM:** Create `.build/` structure for generated outputs
4. **MEDIUM:** Document archive directories as read-only
5. **LOW:** Organize root-level `.txt` files

### Expected Outcome

- Clean root directory (only configs + `README.md`)
- Clear separation of concerns (`.ai/` vs `.cursor/` vs `docs/`)
- Reduced risk of Cursor OOM
- Easier navigation and file discovery
- Consistent file organization across project

---

**END OF ANALYSIS BRAIN OUTPUT**

*This document is ready for EXECUTION BRAIN to implement. No file modifications have been made in this phase.*


