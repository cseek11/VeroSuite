# Enforcement Refactor Analysis Plan
## Two-Brain Model: Path Migration to .ai/* Structure

**Date:** 2025-12-05  
**Phase:** ANALYSIS BRAIN  
**Status:** ✅ COMPLETE

---

## Executive Summary

This analysis identifies all path references in the auto-enforcement system that need to be migrated from the current structure to the new `.ai/*` structure. The goal is to move heavy assets (rules, memory-bank, patterns, large reports) out of Cursor's hot context while keeping the auto-enforcer behaviorally equivalent.

---

## Current State Analysis

### Current Directory Structure

```
.cursor__disabled/
├── enforcement/
│   ├── rules/                    # 23 .mdc files (heavy)
│   │   ├── 00-master.mdc
│   │   ├── 01-enforcement.mdc
│   │   ├── ... (18 more rule files)
│   │   ├── context/              # Dynamic context rule files
│   │   └── python_bible.mdc      # Very large
│   ├── reporting/                # Report generators
│   ├── checks/                   # Compliance checkers
│   ├── checkers/                 # Modular checkers
│   ├── core/                     # Core utilities
│   ├── ENFORCER_REPORT.json      # Generated report
│   ├── AGENT_STATUS.md            # Generated status
│   ├── VIOLATIONS.md             # Generated violations log
│   ├── ENFORCEMENT_BLOCK.md      # Generated block message
│   └── internal/                 # Internal state files
│       └── context_recommendations.json
├── memory-bank/                  # 8 .md files (heavy)
│   ├── projectbrief.md
│   ├── productContext.md
│   ├── systemPatterns.md
│   ├── techContext.md
│   ├── activeContext.md
│   ├── progress.md
│   ├── summary.md                # Generated summary
│   └── README.md
├── patterns/                     # 4 .md files
│   ├── backend/
│   ├── infrastructure/
│   ├── patterns_index.md
│   └── README.md
└── context_manager/              # Predictive context system
    ├── recommendations.md        # Generated recommendations
    ├── context_state.json        # Generated state
    └── ... (many Python modules)
```

### Target Directory Structure

```
.ai/                              # NEW: Second-brain data home
├── rules/                        # Moved from enforcement/rules/
│   ├── 00-master.mdc
│   ├── ... (all 23 rule files)
│   └── context/                  # Dynamic context rules
├── memory_bank/                  # Moved from memory-bank/
│   ├── projectbrief.md
│   ├── ... (all 8 files)
│   └── summary.md
├── patterns/                     # Moved from patterns/
│   ├── backend/
│   ├── infrastructure/
│   └── patterns_index.md
├── logs/
│   └── enforcer/                 # Heavy reports
│       ├── ENFORCER_REPORT_FULL.json    # Full detailed report
│       ├── VIOLATIONS_FULL.md           # Complete violations log
│       ├── AGENT_STATUS_FULL.md         # Complete status report
│       └── ... (other heavy reports)
└── docs/
    ├── enforcement/              # Big enforcement documentation
    └── context_manager/           # Big context_manager documentation

.cursor/
├── enforcement/                  # Lightweight summaries only
│   ├── ENFORCER_REPORT.json      # Tiny JSON summary (stays)
│   ├── ENFORCER_STATUS.md        # Small human-readable summary (NEW)
│   └── ENFORCEMENT_BLOCK.md      # Block message (stays - small)
└── logs/
    ├── enforcer_observability_debug.log
    └── enforcer_tenant_isolation_debug.log
```

---

## Path Reference Inventory

### 1. Rule File Loading

**Location:** `.cursor__disabled/scripts/auto-enforcer.py`

**Line 262:**
```python
rules_dir = self.project_root / ".cursor" / "enforcement" / "rules"
```

**Location:** `.cursor__disabled/enforcement/checkers/checker_router.py`

**Line 26-35:**
```python
def __init__(self, project_root: Path, rules_dir: Path):
    self.project_root = project_root
    self.rules_dir = rules_dir
```

**Usage:** CheckerRouter loads rule files via `self.rules_dir.glob("*.mdc")` (line 57)

**Other Rule Path References:**
- `.cursor__disabled/enforcement/checkers/security_checker.py` line 40: `".cursor/enforcement/rules/03-security.mdc"`
- `.cursor__disabled/enforcement/tests/test_security_checker.py` line 31: `project_root / '.cursor' / 'enforcement' / 'rules' / '03-security.mdc'`
- `.cursor__disabled/scripts/check-backend-patterns.py` line 147: `project_root / '.cursor' / 'enforcement' / 'rules'`
- Multiple test files reference rule paths

### 2. Memory Bank Loading

**Location:** `.cursor__disabled/scripts/auto-enforcer.py`

**Line 237:**
```python
self.memory_bank_dir = self.project_root / ".cursor" / "memory-bank"
```

**Line 212-219:**
```python
MEMORY_BANK_FILES = [
    "projectbrief.md",
    "productContext.md",
    "systemPatterns.md",
    "techContext.md",
    "activeContext.md",
    "progress.md"
]
```

**Usage:** MemoryBankChecker loads files from `self.memory_bank_dir`

**Other Memory Bank References:**
- `.cursor__disabled/enforcement/checks/memory_bank_checker.py` - loads from memory_bank_dir
- `.cursorrules` line 22: `@.cursor/memory-bank/summary.md` (LLM interface rule)

### 3. Patterns Loading

**Current State:** Patterns directory exists but no explicit loading code found in enforcement system. May be referenced in context_manager or rule files.

**Location:** `.cursor__disabled/patterns/` - 4 files exist

**Note:** Need to verify if patterns are loaded by:
- Context manager modules
- Rule files (via @ mentions)
- Checker modules

### 4. Report Writing

**Location:** `.cursor__disabled/enforcement/report_generator.py`

**Line 191:**
```python
path = Path(".cursor/enforcement/ENFORCER_REPORT.json")
```

**Location:** `.cursor__disabled/enforcement/reporting/status_generator.py`

**Line 51:**
```python
status_file = enforcement_dir / "AGENT_STATUS.md"
```

**Line 272:**
```python
fixes_file = enforcement_dir / "AUTO_FIXES.md"
```

**Location:** `.cursor__disabled/enforcement/reporting/violations_logger.py`

**Line 48:**
```python
violations_file = enforcement_dir / "VIOLATIONS.md"
```

**Location:** `.cursor__disabled/enforcement/reporting/block_generator.py`

**Line 48:**
```python
reminders_file = enforcement_dir / "AGENT_REMINDERS.md"
```

**Line 95:**
```python
block_file = enforcement_dir / "ENFORCEMENT_BLOCK.md"
```

**Location:** `.cursor__disabled/enforcement/reporting/two_brain_reporter.py`

**Line 51:**
```python
enforcement_path = project_root / ".cursor" / "enforcement"
```

**Line 59:**
```python
report.save()  # Uses default path from report_generator.py
```

### 5. Context Manager Paths

**Location:** `.cursor__disabled/context_manager/rule_file_manager.py`

**Line 60:**
```python
self.rules_dir = self.project_root / ".cursor" / "enforcement" / "rules" / "context"
```

**Other Context Manager References:**
- `.cursor__disabled/context_manager/context_loader.py` line 45: `.cursor/context_manager/context_profiles.yaml`
- `.cursor__disabled/context_manager/preloader.py` line 44: `.cursor/context_manager/context_state.json`
- `.cursor__disabled/context_manager/session_sequence_tracker.py` line 58: `.cursor/context_manager/session_sequence.json`
- Multiple files reference `.cursor/context_manager/recommendations.md`

### 6. Enforcement Directory Initialization

**Location:** `.cursor__disabled/scripts/auto-enforcer.py`

**Line 236:**
```python
self.enforcement_dir = self.project_root / ".cursor" / "enforcement"
```

**Line 246:**
```python
self.enforcement_dir.mkdir(parents=True, exist_ok=True)
```

**Usage:** All report generators receive `enforcement_dir` as parameter and write files there.

---

## Migration Plan

### Phase 1: Create Config Module

**File to Create:** `enforcement/config_paths.py`

**Purpose:** Centralize all path definitions in a single module.

**Structure:**
```python
from pathlib import Path
from typing import Optional

def get_project_root() -> Path:
    """Get project root directory."""
    # Implementation to detect project root
    pass

def get_ai_root(project_root: Optional[Path] = None) -> Path:
    """Get .ai root directory."""
    if project_root is None:
        project_root = get_project_root()
    return project_root / ".ai"

def get_rules_root(project_root: Optional[Path] = None) -> Path:
    """Get rules directory (.ai/rules)."""
    return get_ai_root(project_root) / "rules"

def get_memory_bank_root(project_root: Optional[Path] = None) -> Path:
    """Get memory bank directory (.ai/memory_bank)."""
    return get_ai_root(project_root) / "memory_bank"

def get_patterns_root(project_root: Optional[Path] = None) -> Path:
    """Get patterns directory (.ai/patterns)."""
    return get_ai_root(project_root) / "patterns"

def get_enforcer_log_root(project_root: Optional[Path] = None) -> Path:
    """Get enforcer log directory (.ai/logs/enforcer)."""
    return get_ai_root(project_root) / "logs" / "enforcer"

def get_cursor_enforcer_root(project_root: Optional[Path] = None) -> Path:
    """Get cursor enforcement directory (.cursor/enforcement)."""
    if project_root is None:
        project_root = get_project_root()
    return project_root / ".cursor" / "enforcement"

def get_cursor_logs_root(project_root: Optional[Path] = None) -> Path:
    """Get cursor logs directory (.cursor/logs)."""
    if project_root is None:
        project_root = get_project_root()
    return project_root / ".cursor" / "logs"
```

### Phase 2: Update All Consumers

#### 2.1 Update auto-enforcer.py

**Changes:**
- Line 236: Change `self.enforcement_dir` to use `get_cursor_enforcer_root()`
- Line 237: Change `self.memory_bank_dir` to use `get_memory_bank_root()`
- Line 262: Change `rules_dir` to use `get_rules_root()`
- Import: Add `from enforcement.config_paths import ...`

#### 2.2 Update Report Generators

**Files to Update:**
1. `enforcement/report_generator.py`
   - Line 191: Change default path to use `get_cursor_enforcer_root() / "ENFORCER_REPORT.json"`
   - Add logic to write full report to `get_enforcer_log_root() / "ENFORCER_REPORT_FULL.json"`

2. `enforcement/reporting/status_generator.py`
   - Line 51: Keep `AGENT_STATUS.md` in `enforcement_dir` (cursor)
   - Add method to write full status to `get_enforcer_log_root() / "AGENT_STATUS_FULL.md"`

3. `enforcement/reporting/violations_logger.py`
   - Line 48: Keep `VIOLATIONS.md` in `enforcement_dir` (cursor) - but make it a summary
   - Add method to write full log to `get_enforcer_log_root() / "VIOLATIONS_FULL.md"`

4. `enforcement/reporting/block_generator.py`
   - Keep `ENFORCEMENT_BLOCK.md` and `AGENT_REMINDERS.md` in `enforcement_dir` (cursor) - these are small

5. `enforcement/reporting/two_brain_reporter.py`
   - Line 51: Update to use `get_cursor_enforcer_root()`

#### 2.3 Update Checker Modules

**Files to Update:**
1. `enforcement/checkers/checker_router.py`
   - Line 26: Accept `rules_dir` parameter (already does)
   - Update caller in `auto-enforcer.py` to pass `get_rules_root()`

2. `enforcement/checkers/security_checker.py`
   - Line 40: Update hardcoded path to use `get_rules_root() / "03-security.mdc"`

3. `enforcement/checks/memory_bank_checker.py`
   - Update to use `get_memory_bank_root()` instead of `self.memory_bank_dir`

#### 2.4 Update Context Manager

**Files to Update:**
1. `context_manager/rule_file_manager.py`
   - Line 60: Change to `get_rules_root() / "context"`

2. `context_manager/context_loader.py`
   - Update context_profiles.yaml path (keep in `.cursor/context_manager/` - this is small)

3. `context_manager/preloader.py`
   - Update context_state.json path (keep in `.cursor/context_manager/` - this is small)

4. `context_manager/session_sequence_tracker.py`
   - Update session_sequence.json path (keep in `.cursor/context_manager/` - this is small)

#### 2.5 Update Test Files

**Files to Update:**
- All test files that hardcode rule paths
- Update to use `get_rules_root()` from config_paths

### Phase 3: File Migration

#### 3.1 Move Rules

**Source:** `.cursor__disabled/enforcement/rules/*`  
**Target:** `.ai/rules/*`

**Files to Move:**
- All 23 .mdc files
- `context/` subdirectory

#### 3.2 Move Memory Bank

**Source:** `.cursor__disabled/memory-bank/*`  
**Target:** `.ai/memory_bank/*`

**Files to Move:**
- All 8 .md files

#### 3.3 Move Patterns

**Source:** `.cursor__disabled/patterns/*`  
**Target:** `.ai/patterns/*`

**Files to Move:**
- All 4 files/directories

#### 3.4 Create Log Directories

**Create:**
- `.ai/logs/enforcer/` (for heavy reports)

### Phase 4: Update Report Writing Logic

#### 4.1 Dual-Write Strategy

**For Heavy Reports:**
- Write full report to `.ai/logs/enforcer/`
- Write tiny summary to `.cursor/enforcement/`

**Implementation:**
1. `ENFORCER_REPORT.json`:
   - Full: `.ai/logs/enforcer/ENFORCER_REPORT_FULL.json`
   - Summary: `.cursor/enforcement/ENFORCER_REPORT.json` (current location, keep structure)

2. `VIOLATIONS.md`:
   - Full: `.ai/logs/enforcer/VIOLATIONS_FULL.md`
   - Summary: `.cursor/enforcement/VIOLATIONS.md` (truncate to last 50 violations)

3. `AGENT_STATUS.md`:
   - Full: `.ai/logs/enforcer/AGENT_STATUS_FULL.md`
   - Summary: `.cursor/enforcement/AGENT_STATUS.md` (current location, keep structure)

**For Small Reports:**
- Keep in `.cursor/enforcement/`:
  - `ENFORCEMENT_BLOCK.md` (small, blocking message)
  - `AGENT_REMINDERS.md` (small, reminders)
  - `AUTO_FIXES.md` (small, fix log)

#### 4.2 Summary Generation Logic

**ENFORCER_REPORT.json Summary:**
- Keep current structure (it's already small)
- Add reference to full report: `"full_report_path": ".ai/logs/enforcer/ENFORCER_REPORT_FULL.json"`

**VIOLATIONS.md Summary:**
- Show last 50 violations only
- Add header: `"See .ai/logs/enforcer/VIOLATIONS_FULL.md for complete log"`

**AGENT_STATUS.md Summary:**
- Keep current structure (it's already reasonably sized)
- Add reference to full report if needed

### Phase 5: Update LLM Interface Rules

**File to Update:** `.cursorrules`

**Line 22:**
```markdown
@.cursor/memory-bank/summary.md
```

**Change to:**
```markdown
@.ai/memory_bank/summary.md
```

**Note:** This is the only rule file that references memory-bank. Other rules reference enforcement/rules which will be moved to .ai/rules, but those are enforcer-only (not loaded by LLM).

---

## Files to Create

1. `enforcement/config_paths.py` - Centralized path configuration
2. `.ai/rules/` - Directory (created during migration)
3. `.ai/memory_bank/` - Directory (created during migration)
4. `.ai/patterns/` - Directory (created during migration)
5. `.ai/logs/enforcer/` - Directory (created during migration)

## Files to Edit

### Core Enforcement
1. `scripts/auto-enforcer.py` - Update path references
2. `enforcement/report_generator.py` - Update save paths, add dual-write
3. `enforcement/reporting/status_generator.py` - Add full report writing
4. `enforcement/reporting/violations_logger.py` - Add summary generation
5. `enforcement/reporting/two_brain_reporter.py` - Update paths

### Checkers
6. `enforcement/checkers/checker_router.py` - Update rule loading
7. `enforcement/checkers/security_checker.py` - Update rule path
8. `enforcement/checks/memory_bank_checker.py` - Update memory bank path

### Context Manager
9. `context_manager/rule_file_manager.py` - Update rules_dir path
10. `context_manager/context_loader.py` - Verify paths (may not need changes)
11. `context_manager/preloader.py` - Verify paths (may not need changes)
12. `context_manager/session_sequence_tracker.py` - Verify paths (may not need changes)

### LLM Interface
13. `.cursorrules` - Update memory-bank path reference

### Tests
14. All test files that reference rule paths (grep found multiple)

## Moves to Perform

1. Move `.cursor__disabled/enforcement/rules/*` → `.ai/rules/*`
2. Move `.cursor__disabled/memory-bank/*` → `.ai/memory_bank/*`
3. Move `.cursor__disabled/patterns/*` → `.ai/patterns/*`

**Note:** The enforcement code itself should remain in `.cursor/enforcement/` (or be moved from `.cursor__disabled/enforcement/` to `.cursor/enforcement/` if that's the target). Only the heavy assets move to `.ai/*`.

## Tests to Run

### Unit Tests
1. `enforcement/tests/test_*` - All enforcement tests
2. `context_manager/tests/test_*` - All context manager tests

### Integration Tests
3. Run `scripts/auto-enforcer.py` manually to verify:
   - Rules load from `.ai/rules/`
   - Memory bank loads from `.ai/memory_bank/`
   - Reports write to correct locations
   - Summaries are generated correctly

### Smoke Tests
4. `scripts/file_watcher.py` - Verify file watching still works
5. Verify auto-enforcer runs automatically (if daemon exists)

## Verification Checklist

- [ ] Config module created and all paths resolve correctly
- [ ] All enforcement code imports from `enforcement.config_paths`
- [ ] Rules load from `.ai/rules/`
- [ ] Memory bank loads from `.ai/memory_bank/`
- [ ] Patterns accessible from `.ai/patterns/` (if used)
- [ ] Full reports write to `.ai/logs/enforcer/`
- [ ] Summary reports write to `.cursor/enforcement/`
- [ ] `ENFORCER_REPORT.json` structure unchanged (for Two-Brain compatibility)
- [ ] `ENFORCEMENT_BLOCK.md` still works (pre-flight check)
- [ ] All tests pass
- [ ] Auto-enforcer runs successfully
- [ ] File watcher still works
- [ ] Context manager still works
- [ ] LLM can still load `@.ai/memory_bank/summary.md`

---

## Risk Assessment

### High Risk Areas

1. **Two-Brain Integration Compatibility**
   - `ENFORCER_REPORT.json` structure must remain unchanged
   - Path changes must not break report loading

2. **Pre-Flight Check**
   - `ENFORCEMENT_BLOCK.md` path must remain accessible to LLM
   - Block file detection must still work

3. **Rule Loading**
   - CheckerRouter must find rules in new location
   - All checkers must load rules correctly

### Medium Risk Areas

1. **Memory Bank Loading**
   - MemoryBankChecker must find files in new location
   - LLM interface rule must reference correct path

2. **Report Generation**
   - Dual-write logic must not break existing functionality
   - Summary generation must be reliable

### Low Risk Areas

1. **Patterns Migration**
   - Patterns may not be actively loaded by enforcement
   - Migration is straightforward file move

---

## Next Steps

1. **EXECUTION BRAIN** should:
   - Create `enforcement/config_paths.py`
   - Update all files listed in "Files to Edit"
   - Perform file moves
   - Run tests
   - Verify auto-enforcer still works

2. **Verification**:
   - Run full test suite
   - Manual smoke test of auto-enforcer
   - Verify Cursor workspace loads without OOM

---

## Notes

- The enforcement code itself (Python modules) should remain in `.cursor/enforcement/` or be moved there from `.cursor__disabled/enforcement/`. Only heavy assets (rules, memory-bank, patterns, large reports) move to `.ai/*`.

- The `.cursor/enforcement/` directory should contain only:
  - Small summary files (ENFORCER_REPORT.json, ENFORCER_STATUS.md)
  - Blocking messages (ENFORCEMENT_BLOCK.md)
  - Python enforcement code (if moved from .cursor__disabled)

- Heavy reports go to `.ai/logs/enforcer/` to keep `.cursor/enforcement/` lightweight.

- All path references must go through `enforcement.config_paths` to ensure consistency and easy future changes.



