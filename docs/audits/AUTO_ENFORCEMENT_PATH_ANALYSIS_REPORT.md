# VeroField Auto-Enforcement System: Path & Wiring Analysis Report

**Date:** 2025-12-05  
**Phase:** ANALYSIS BRAIN  
**Status:** Analysis Complete - Ready for Execution Brain

---

## Executive Summary

The auto-enforcement system is **broken** due to scripts being in the wrong location. The system expects scripts in `.cursor/scripts/` but they are located in `.cursor__archived_2025-04-12/scripts/` (archived). The enforcement Python package is in `.cursor__disabled/enforcement/` but scripts attempt to import it as `enforcement.*` without proper path configuration.

**Critical Issues:**
1. **Scripts in Wrong Location:** All scripts exist but are in `.cursor__archived_2025-04-12/scripts/` instead of `.cursor/scripts/`
   - ✅ `watch-files.py` - EXISTS in archive
   - ✅ `auto-enforcer.py` - EXISTS in archive  
   - ✅ `pre-flight-check.py` - EXISTS in archive
   - ✅ `test-enforcement.py` - EXISTS in archive
2. **Broken Imports:** Scripts import `enforcement.*` but the package is in `.cursor__disabled/enforcement/`
3. **VS Code Tasks Broken:** All tasks reference scripts that don't exist in the expected location
4. **Path References:** Watcher script references `.cursor/scripts/auto-enforcer.py` which doesn't exist yet

---

## 0. Script Discovery Summary

**✅ ALL SCRIPTS FOUND IN ARCHIVE**

All missing scripts have been located in `.cursor__archived_2025-04-12/scripts/`:

| Script | Archive Location | Status | Notes |
|--------|------------------|--------|-------|
| `watch-files.py` | `.cursor__archived_2025-04-12/scripts/watch-files.py` | ✅ **FOUND** | Full implementation with `watchdog`, `EnforcementHandler`, `RuleFileUpdateHandler` |
| `auto-enforcer.py` | `.cursor__archived_2025-04-12/scripts/auto-enforcer.py` | ✅ **FOUND** | Main enforcement engine (also exists in `.cursor__disabled/scripts/`) |
| `pre-flight-check.py` | `.cursor__archived_2025-04-12/scripts/pre-flight-check.py` | ✅ **FOUND** | Pre-flight validation script |
| `test-enforcement.py` | `.cursor__archived_2025-04-12/scripts/test-enforcement.py` | ✅ **FOUND** | Test suite for enforcement system |

**Additional Related Scripts Found:**
- `file_watcher.py` - Alternative watcher implementation (different from `watch-files.py`)
- `test-enforcement-integration.py` - Integration test suite
- `logger_util.py` - Logging utility (referenced by other scripts)

**Action Required:** Move all scripts from `.cursor__archived_2025-04-12/scripts/` to `.cursor/scripts/` and update import paths.

---

## 1. Auto-Enforcement Entry Point Inventory

### 1.1 VS Code Tasks (`.vscode/tasks.json`)

| Task Label | Command | Status | Issue |
|------------|---------|--------|------|
| Start Auto-Enforcement System | `python ${workspaceFolder}/.cursor/scripts/watch-files.py` | ❌ **BROKEN** | Script does not exist |
| Run Enforcement Check | `python ${workspaceFolder}/.cursor/scripts/auto-enforcer.py` | ❌ **BROKEN** | Script does not exist |
| Run Pre-Flight Check | `python ${workspaceFolder}/.cursor/scripts/pre-flight-check.py` | ❌ **BROKEN** | Script does not exist |
| Run Enforcement Test Suite | `python ${workspaceFolder}/.cursor/scripts/test-enforcement.py` | ❌ **BROKEN** | Script does not exist |
| Generate Manual Test Scenarios | `python ${workspaceFolder}/.cursor/scripts/test-enforcement.py --generate-manual` | ❌ **BROKEN** | Script does not exist |

**Invocation:** Auto-start on folder open (if `task.allowAutomaticTasks` enabled) or manual via Command Palette

**Key Imports Expected:**
- `watch-files.py` should use `watchdog` library
- `auto-enforcer.py` imports: `enforcement.config_paths`, `enforcement.core.*`, `enforcement.checks.*`, `enforcement.reporting.*`

---

### 1.2 GitHub Actions Workflows

#### `.github/workflows/verofield_auto_pr.yml`
- **Purpose:** Auto-PR scoring and enforcement
- **Scripts Called:**
  - `.github/scripts/extract_context.py` ✅ EXISTS
  - `.github/scripts/score_pr.py` ✅ EXISTS (references `.cursor/scripts/veroscore_v3/`)
  - `.github/scripts/enforce_decision.py` ✅ EXISTS (references `.cursor/scripts/logger_util`)
  - `.github/scripts/update_session.py` ✅ EXISTS
- **Status:** ⚠️ **PARTIALLY WORKING** - Scripts exist but may have broken dependencies

#### `.github/workflows/ci.yml`
- **Purpose:** Standard CI pipeline
- **Enforcement Integration:** None (frontend/backend tests only)
- **Status:** ✅ **WORKING** (no enforcement dependencies)

---

### 1.3 Manual Execution Entry Points

| Script | Expected Location | Actual Location | Status |
|--------|------------------|-----------------|--------|
| `auto-enforcer.py` | `.cursor/scripts/auto-enforcer.py` | `.cursor__archived_2025-04-12/scripts/auto-enforcer.py` | ✅ **FOUND IN ARCHIVE** |
| `watch-files.py` | `.cursor/scripts/watch-files.py` | `.cursor__archived_2025-04-12/scripts/watch-files.py` | ✅ **FOUND IN ARCHIVE** |
| `pre-flight-check.py` | `.cursor/scripts/pre-flight-check.py` | `.cursor__archived_2025-04-12/scripts/pre-flight-check.py` | ✅ **FOUND IN ARCHIVE** |
| `test-enforcement.py` | `.cursor/scripts/test-enforcement.py` | `.cursor__archived_2025-04-12/scripts/test-enforcement.py` | ✅ **FOUND IN ARCHIVE** |

**Invocation:** Manual via command line or VS Code tasks

---

### 1.4 Background Daemons / Watchers

| Component | Expected Location | Actual Location | Status |
|-----------|------------------|-----------------|--------|
| File Watcher | `.cursor/scripts/watch-files.py` | **DOES NOT EXIST** | ❌ **MISSING** |
| Auto-PR Session Manager | `.cursor/scripts/start_session_manager.py` | **UNKNOWN** | ❓ **UNVERIFIED** |

**How Started:**
- VS Code task: "Start Auto-Enforcement System" (broken)
- VS Code task: "Start Auto-PR Session Manager" (may work if script exists)

---

## 2. Watcher & Monitoring Inventory

### 2.1 File Watcher (`watch-files.py`)

**Expected Behavior (from documentation):**
- **Location:** `.cursor/scripts/watch-files.py`
- **Purpose:** Monitor filesystem changes and trigger auto-enforcer
- **Technology:** `watchdog` library (Python)
- **Watched Directories:** Watches project root (`.`) recursively - catches all changes
- **Debounce:** 2-second delay
- **Triggers:** `.cursor/scripts/auto-enforcer.py` via subprocess (line 92, 206)

**Actual Status:**
- ✅ **FILE EXISTS IN ARCHIVE:** `.cursor__archived_2025-04-12/scripts/watch-files.py`
- **Key Features Found:**
  - Uses `watchdog.Observer` and `FileSystemEventHandler`
  - `EnforcementHandler` class handles file changes
  - `RuleFileUpdateHandler` class handles rule file updates
  - Watches project root recursively (line 438-440)
  - Triggers: `self.project_root / ".cursor" / "scripts" / "auto-enforcer.py"` (line 92)
  - Filters: `.cursor/enforcement/`, binary files, build directories
- **Also Found:** `.cursor__archived_2025-04-12/scripts/file_watcher.py` (different implementation)

---

### 2.2 Related Monitoring Components

| Component | Location | Status | Notes |
|-----------|----------|--------|-------|
| `file_watcher.py` | `.cursor__archived_2025-04-12/scripts/file_watcher.py` | ⚠️ **ARCHIVED** | Different implementation, uses `EnforcerTrigger` class |
| `monitor_changes.py` | **DOES NOT EXIST** | ❌ **MISSING** | Referenced in some docs but not found |
| `pre-flight-check.py` | **DOES NOT EXIST** | ❌ **MISSING** | Referenced in tasks.json |

---

## 3. Path & Import Mismatch Report

### 3.1 Critical Path Issues

#### AUTO-RUN-01: Watcher Script in Archive
- **File(s) Involved:** `.vscode/tasks.json` (line 29), all documentation
- **Incorrect Path:** `.cursor/scripts/watch-files.py` (referenced in tasks)
- **Actual Location:** `.cursor__archived_2025-04-12/scripts/watch-files.py`
- **Expected:** Script should be moved from archive to `.cursor/scripts/watch-files.py`
- **Impact:** Auto-enforcement cannot start automatically
- **Root Cause:** Script was archived but not restored to active location

---

#### AUTO-RUN-02: Auto-Enforcer Script in Archive
- **File(s) Involved:** `.vscode/tasks.json` (line 49), `.cursor__archived_2025-04-12/scripts/auto-enforcer.py`, `.cursor__disabled/scripts/auto-enforcer.py`
- **Incorrect Path:** `.cursor/scripts/auto-enforcer.py` (referenced in tasks and watcher)
- **Actual Locations:** 
  - `.cursor__archived_2025-04-12/scripts/auto-enforcer.py` (archived version)
  - `.cursor__disabled/scripts/auto-enforcer.py` (disabled version)
- **Expected:** Script should be moved from archive to `.cursor/scripts/auto-enforcer.py`
- **Impact:** Manual enforcement check task fails, watcher cannot trigger enforcer
- **Root Cause:** Script is in archived location, not in active `.cursor/scripts/` directory

---

#### WATCHER-PATH-01: Watcher References Wrong Memory Bank Path
- **File(s) Involved:** Documentation (`when-enforcer-runs.md`, `AUTO_ENFORCER_EXECUTION_FLOW.md`)
- **Incorrect Path:** `.cursor/memory-bank/` (documented as watched directory)
- **Expected:** `.ai/memory_bank/` (per new layout)
- **Impact:** Watcher would watch wrong directory if it existed
- **Root Cause:** Documentation not updated after refactor

---

#### WATCHER-PATH-02: Watcher References Wrong Rules Path
- **File(s) Involved:** Documentation (`when-enforcer-runs.md`, `AUTO_ENFORCER_EXECUTION_FLOW.md`)
- **Incorrect Path:** `.cursor/rules/` (documented as watched directory)
- **Expected:** `.ai/rules/` (per new layout)
- **Impact:** Watcher would watch wrong directory if it existed
- **Root Cause:** Documentation not updated after refactor

---

#### IMPORT-PATH-01: Auto-Enforcer Cannot Import Enforcement Package
- **File(s) Involved:** `.cursor__disabled/scripts/auto-enforcer.py` (lines 36-73)
- **Incorrect Import:** `from enforcement.config_paths import ...`
- **Problem:** Script adds `.cursor` to `sys.path` (line 34) but enforcement package is in `.cursor__disabled/enforcement/`
- **Expected:** Either:
  1. Move enforcement package to `.cursor/enforcement/` OR
  2. Add `.cursor__disabled` to `sys.path` OR
  3. Move enforcement package to root-level `enforcement/` directory
- **Impact:** Script cannot run - ImportError on `enforcement.*` modules
- **Root Cause:** Enforcement package location doesn't match import expectations

---

#### IMPORT-PATH-02: Config Paths Module Location Mismatch
- **File(s) Involved:** `.cursor__disabled/enforcement/config_paths.py`
- **Location:** `.cursor__disabled/enforcement/config_paths.py`
- **Problem:** Scripts import `enforcement.config_paths` but package is in `.cursor__disabled/`
- **Expected:** Enforcement package should be importable as `enforcement.*`
- **Impact:** All scripts that import enforcement modules will fail
- **Root Cause:** Package structure doesn't match import paths

---

#### IMPORT-PATH-03: GitHub Scripts Reference Missing Scripts Directory
- **File(s) Involved:** `.github/scripts/enforce_decision.py` (line 17), `.github/scripts/score_pr.py` (line 31)
- **Incorrect Path:** `.cursor/scripts/` (referenced in path calculations)
- **Problem:** Scripts try to add `.cursor/scripts/` to `sys.path` but directory is empty
- **Expected:** Either scripts exist in `.cursor/scripts/` OR path references updated
- **Impact:** GitHub Actions may fail if scripts try to import from `.cursor/scripts/`
- **Root Cause:** Scripts directory is empty

---

#### TASK-PATH-01: VS Code Tasks Reference Non-Existent Scripts
- **File(s) Involved:** `.vscode/tasks.json` (lines 29, 49, 55, 61, 68)
- **Incorrect Paths:**
  - `.cursor/scripts/watch-files.py` (line 29)
  - `.cursor/scripts/auto-enforcer.py` (line 49)
  - `.cursor/scripts/pre-flight-check.py` (line 55)
  - `.cursor/scripts/test-enforcement.py` (lines 61, 68)
- **Expected:** Scripts should exist OR tasks should reference correct locations
- **Impact:** All VS Code tasks fail
- **Root Cause:** Scripts were never created or were moved/deleted

---

## 4. Target Wiring Specification

### 4.1 Correct File Structure

Based on the current `.ai` + `.cursor` architecture:

```
VeroField/
├── .ai/                          # Heavy enforcement data (canonical)
│   ├── rules/                    # Rule .mdc files (READ FROM HERE)
│   ├── memory_bank/              # Memory bank files (READ FROM HERE)
│   ├── patterns/                 # Pattern definitions (READ FROM HERE)
│   └── logs/
│       └── enforcer/             # Full/heavy reports (WRITE TO HERE)
│
├── .cursor/                      # Light integration layer
│   ├── enforcement/              # Lightweight summaries (WRITE TO HERE)
│   │   ├── ENFORCER_REPORT.json  # Summary report
│   │   ├── ENFORCER_STATUS.md    # Status summary
│   │   ├── ENFORCEMENT_BLOCK.md  # Blocking message (if violations)
│   │   └── session.json           # Session state
│   ├── rules/                    # LLM interface rules (for Cursor IDE)
│   └── scripts/                  # Active enforcement scripts (SHOULD BE HERE)
│       ├── auto-enforcer.py      # Main enforcement engine
│       ├── watch-files.py        # File watcher (watchdog-based)
│       ├── pre-flight-check.py   # Pre-flight validation
│       └── test-enforcement.py   # Test suite
│
└── enforcement/                  # Python package (SHOULD BE AT ROOT)
    ├── __init__.py
    ├── config_paths.py            # Centralized path helpers
    ├── core/                      # Core enforcement modules
    │   ├── violations.py
    │   ├── session_state.py
    │   ├── scope_evaluator.py
    │   ├── git_utils.py
    │   └── file_scanner.py
    ├── checks/                    # Checker modules
    │   ├── date_checker.py
    │   ├── security_checker.py
    │   ├── memory_bank_checker.py
    │   └── ...
    └── reporting/                 # Reporting modules
        ├── block_generator.py
        ├── status_generator.py
        ├── two_brain_reporter.py
        └── ...
```

---

### 4.2 Correct Auto-Enforcer Entry Point

**Location:** `.cursor/scripts/auto-enforcer.py`

**Imports:**
```python
# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

# Import enforcement package (from root-level enforcement/)
from enforcement.config_paths import (
    get_rules_root,
    get_memory_bank_root,
    get_cursor_enforcer_root,
)
from enforcement.core.violations import ...
from enforcement.checks.date_checker import ...
# etc.
```

**Path Usage:**
- **Rules:** `get_rules_root(project_root)` → `.ai/rules/`
- **Memory Bank:** `get_memory_bank_root(project_root)` → `.ai/memory_bank/`
- **Reports (full):** `get_enforcer_log_root(project_root)` → `.ai/logs/enforcer/`
- **Reports (summary):** `get_cursor_enforcer_root(project_root)` → `.cursor/enforcement/`

---

### 4.3 Correct File Watcher Entry Point

**Location:** `.cursor/scripts/watch-files.py`

**Technology:** `watchdog` library

**Watched Directories:**
- `apps/`
- `libs/`
- `frontend/`
- `VeroFieldMobile/`
- `.ai/memory_bank/` (NOT `.cursor/memory-bank/`)
- `.ai/rules/` (NOT `.cursor/rules/`)

**Trigger Behavior:**
1. Monitor directories using `watchdog.Observer` and `FileSystemEventHandler`
2. Debounce changes (2-second delay)
3. Trigger: `subprocess.run(["python", ".cursor/scripts/auto-enforcer.py"])`

**How Started:**
- VS Code task: "Start Auto-Enforcement System" (auto-start on folder open)
- Manual: `python .cursor/scripts/watch-files.py`

---

### 4.4 Correct Enforcement Package Location

**Location:** `enforcement/` (at project root)

**Structure:**
- Must be importable as `enforcement.*` (requires `__init__.py`)
- Contains: `config_paths.py`, `core/`, `checks/`, `reporting/`
- Should be moved from `.cursor__disabled/enforcement/` to root-level `enforcement/`

**Why Root Level:**
- Scripts in `.cursor/scripts/` can import via `sys.path.insert(0, project_root)`
- GitHub Actions scripts can import via same mechanism
- Matches standard Python package structure

---

### 4.5 Correct CI Integration

**GitHub Actions Scripts:**
- `.github/scripts/score_pr.py` - Should reference `.cursor/scripts/veroscore_v3/` (if it exists)
- `.github/scripts/enforce_decision.py` - Should reference `.cursor/scripts/logger_util` (if it exists)
- All scripts should add project root to `sys.path` before importing

**Workflow Behavior:**
- Workflows call `.github/scripts/*.py` scripts
- Those scripts may import from `.cursor/scripts/` or `enforcement/`
- Paths should be resolved relative to project root

---

## 5. Execution Plan for the Execution Brain

### Phase 1: Restore Missing Scripts (CRITICAL)

#### Step 1.1: Restore Auto-Enforcer Script
- **Action:** Copy `.cursor__archived_2025-04-12/scripts/auto-enforcer.py` → `.cursor/scripts/auto-enforcer.py`
- **Update:** Fix import paths in script (remove `.cursor` from `sys.path`, ensure `enforcement/` package is importable)
- **Note:** Compare with `.cursor__disabled/scripts/auto-enforcer.py` to ensure latest version
- **Test:** `python .cursor/scripts/auto-enforcer.py --help` (should run without ImportError)

#### Step 1.2: Restore File Watcher Script
- **Action:** Copy `.cursor__archived_2025-04-12/scripts/watch-files.py` → `.cursor/scripts/watch-files.py`
- **Update:** Verify watcher references correct paths:
  - Line 92: `self.enforcer_script = self.project_root / ".cursor" / "scripts" / "auto-enforcer.py"` (should work after Step 1.1)
  - Watches project root (`.`) recursively - no path updates needed
- **Test:** `python .cursor/scripts/watch-files.py` (should start watching)

#### Step 1.3: Restore Pre-Flight Check Script
- **Action:** Copy `.cursor__archived_2025-04-12/scripts/pre-flight-check.py` → `.cursor/scripts/pre-flight-check.py`
- **Update:** Verify it references correct memory bank path (should use `enforcement.config_paths.get_memory_bank_root()`)
- **Test:** `python .cursor/scripts/pre-flight-check.py` (should run)

#### Step 1.4: Restore Test Script
- **Action:** Copy `.cursor__archived_2025-04-12/scripts/test-enforcement.py` → `.cursor/scripts/test-enforcement.py`
- **Test:** `python .cursor/scripts/test-enforcement.py --help` (should run)

---

### Phase 2: Fix Enforcement Package Location (CRITICAL)

#### Step 2.1: Move Enforcement Package to Root
- **Action:** Move `.cursor__disabled/enforcement/` → `enforcement/` (at project root)
- **Ensure:** `enforcement/__init__.py` exists
- **Test:** `python -c "from enforcement.config_paths import get_rules_root; print(get_rules_root())"` (should work)

#### Step 2.2: Update Auto-Enforcer Imports
- **File:** `.cursor/scripts/auto-enforcer.py`
- **Action:** 
  - Remove: `sys.path.insert(0, str(project_root / ".cursor"))` (line 34)
  - Keep: `sys.path.insert(0, str(project_root))` (line 32) - this allows `enforcement.*` imports
- **Test:** `python .cursor/scripts/auto-enforcer.py --help` (should import successfully)

#### Step 2.3: Verify Config Paths Module
- **File:** `enforcement/config_paths.py`
- **Action:** Verify all path functions return correct `.ai/*` and `.cursor/*` paths
- **Test:** Run path validation commands from `ENFORCEMENT_REFACTOR_EXECUTION_PLAN.md`

---

### Phase 3: Update VS Code Tasks (HIGH PRIORITY)

#### Step 3.1: Verify Task Paths
- **File:** `.vscode/tasks.json`
- **Action:** Verify all script paths point to `.cursor/scripts/*.py`
- **Status:** Paths are already correct IF scripts exist (no changes needed if Phase 1 complete)

#### Step 3.2: Test Tasks
- **Action:** Test each task manually:
  - "Start Auto-Enforcement System" → Should start watcher
  - "Run Enforcement Check" → Should run auto-enforcer
  - Other tasks → Should work if scripts exist

---

### Phase 4: Update Documentation (MEDIUM PRIORITY)

#### Step 4.1: Fix Watched Directory References
- **Files:** `when-enforcer-runs.md`, `AUTO_ENFORCER_EXECUTION_FLOW.md`, `HYBRID_CONTEXT_SYSTEM_INTEGRATION.md`
- **Action:** Update all references:
  - `.cursor/memory-bank/` → `.ai/memory_bank/`
  - `.cursor/rules/` → `.ai/rules/`
- **Test:** Search for old paths and verify updates

---

### Phase 5: Verify GitHub Actions Integration (MEDIUM PRIORITY)

#### Step 5.1: Check GitHub Script Dependencies
- **Files:** `.github/scripts/enforce_decision.py`, `.github/scripts/score_pr.py`
- **Action:** Verify they can find required modules (may need path fixes)
- **Test:** Run scripts in CI-like environment

#### Step 5.2: Test Workflow
- **Action:** Trigger `.github/workflows/verofield_auto_pr.yml` (if possible) or review for path issues

---

### Phase 6: Validation & Testing (REQUIRED)

#### Step 6.1: Test Auto-Enforcer Standalone
```bash
python .cursor/scripts/auto-enforcer.py --help
python .cursor/scripts/auto-enforcer.py
```
**Expected:** Runs without ImportError, generates reports in `.cursor/enforcement/`

#### Step 6.2: Test File Watcher
```bash
python .cursor/scripts/watch-files.py
# In another terminal, touch a file in apps/
```
**Expected:** Watcher detects change, triggers auto-enforcer after 2 seconds

#### Step 6.3: Test VS Code Task
- **Action:** Run "Start Auto-Enforcement System" task
- **Expected:** Watcher starts, shows "Watching directory: ..." messages

#### Step 6.4: Test Path Configuration
```python
python -c "from enforcement.config_paths import *; print('Rules:', get_rules_root()); print('Memory Bank:', get_memory_bank_root()); print('Enforcer Log:', get_enforcer_log_root()); print('Cursor Enforcer:', get_cursor_enforcer_root())"
```
**Expected:** All paths point to correct `.ai/*` and `.cursor/*` locations

---

## 6. Summary of Issues

### Critical (Blocks Auto-Enforcement)
1. ⚠️ **`watch-files.py` in archive** - Needs to be moved to `.cursor/scripts/`
2. ⚠️ **`auto-enforcer.py` in archive** - Needs to be moved to `.cursor/scripts/`
3. ❌ **Enforcement package in wrong location** - Imports fail
4. ❌ **VS Code tasks reference scripts in wrong location** - All tasks fail

### High Priority (Breaks Manual Execution)
5. ⚠️ **`pre-flight-check.py` in archive** - Needs to be moved to `.cursor/scripts/`
6. ⚠️ **`test-enforcement.py` in archive** - Needs to be moved to `.cursor/scripts/`
7. ⚠️ **Import paths broken** - Scripts cannot import enforcement modules

### Medium Priority (Documentation/CI)
8. ⚠️ **Documentation references wrong paths** - Confusing but not blocking
9. ⚠️ **GitHub Actions may have path issues** - Needs verification

---

## 7. Recommended Fix Order

1. **Phase 2** (Fix Enforcement Package) - Must be done first so imports work
2. **Phase 1** (Restore Scripts) - Enables auto-enforcement
3. **Phase 3** (Verify Tasks) - Ensures VS Code integration works
4. **Phase 4** (Update Docs) - Prevents confusion
5. **Phase 5** (Verify CI) - Ensures GitHub Actions work
6. **Phase 6** (Test Everything) - Validates complete system

---

## End of Analysis Report

**Next Step:** Execution Brain should implement fixes in the order specified above.

