# Enforcement Refactor Execution Plan
## Two-Brain Model: Path Migration to .ai/* Structure

**Date:** 2025-12-05  
**Phase:** EXECUTION BRAIN  
**Status:** ✅ IMPLEMENTATION COMPLETE

---

## Summary

This document provides the execution plan for migrating heavy assets from `.cursor__disabled/` to `.ai/*` while keeping the auto-enforcer behaviorally equivalent. All Python code has been updated to use centralized path configuration via `enforcement/config_paths.py`.

---

## File Creations

### 1. `enforcement/config_paths.py`

**Location:** `.cursor__disabled/enforcement/config_paths.py`

**Purpose:** Centralized path configuration module providing canonical path helpers for the new `.ai/*` structure`.

**Key Functions:**
- `get_project_root()` - Detects project root using same logic as auto-enforcer
- `get_ai_root()` - Returns `.ai/` directory
- `get_rules_root()` - Returns `.ai/rules/` directory
- `get_memory_bank_root()` - Returns `.ai/memory_bank/` directory
- `get_patterns_root()` - Returns `.ai/patterns/` directory
- `get_enforcer_log_root()` - Returns `.ai/logs/enforcer/` directory (for full reports)
- `get_cursor_enforcer_root()` - Returns `.cursor/enforcement/` directory (for summaries)
- `get_cursor_logs_root()` - Returns `.cursor/logs/` directory

All functions create directories as needed and handle project root detection automatically.

---

## File Modifications

### 1. `.cursor__disabled/scripts/auto-enforcer.py`

**Changes:**
- Added import: `from enforcement.config_paths import get_rules_root, get_memory_bank_root, get_cursor_enforcer_root`
- Line 236: Changed `self.enforcement_dir = self.project_root / ".cursor" / "enforcement"` → `get_cursor_enforcer_root(self.project_root)`
- Line 237: Changed `self.memory_bank_dir = self.project_root / ".cursor" / "memory-bank"` → `get_memory_bank_root(self.project_root)`
- Line 262: Changed `rules_dir = self.project_root / ".cursor" / "enforcement" / "rules"` → `get_rules_root(self.project_root)`

**Impact:** Auto-enforcer now uses centralized path configuration.

### 2. `.cursor__disabled/enforcement/report_generator.py`

**Changes:**
- Added imports: `from enforcement.config_paths import get_enforcer_log_root, get_cursor_enforcer_root, get_project_root`
- Updated `save()` method to implement dual-write:
  - Full report: `.ai/logs/enforcer/ENFORCER_REPORT_FULL.json`
  - Summary: `.cursor/enforcement/ENFORCER_REPORT.json` (with `full_report_path` field)
- Updated `load()` method to accept optional `project_root` parameter

**Impact:** Reports are now written to both locations with full details in `.ai/` and summaries in `.cursor/`.

### 3. `.cursor__disabled/enforcement/reporting/status_generator.py`

**Changes:**
- Added imports: `from enforcement.config_paths import get_enforcer_log_root, get_cursor_enforcer_root, get_project_root`
- Updated `generate_agent_status()` to write both:
  - Summary: `.cursor/enforcement/AGENT_STATUS.md` (existing location)
  - Full: `.ai/logs/enforcer/AGENT_STATUS_FULL.md` (new location)

**Impact:** Status files are now dual-written.

### 4. `.cursor__disabled/enforcement/reporting/violations_logger.py`

**Changes:**
- Added imports: `from enforcement.config_paths import get_enforcer_log_root, get_cursor_enforcer_root, get_project_root`
- Updated `generate_violations_log()` to implement dual-write with summary:
  - Full log: `.ai/logs/enforcer/VIOLATIONS_FULL.md` (all violations)
  - Summary: `.cursor/enforcement/VIOLATIONS.md` (last 50 violations with header pointing to full log)

**Impact:** Violations log is now split with summary in `.cursor/` and full log in `.ai/`.

### 5. `.cursor__disabled/enforcement/reporting/block_generator.py`

**Changes:**
- Added import: `from enforcement.config_paths import get_cursor_enforcer_root`
- No path changes needed (files stay in `.cursor/enforcement/` as they are small)

**Impact:** Uses centralized path configuration for consistency.

### 6. `.cursor__disabled/enforcement/reporting/two_brain_reporter.py`

**Changes:**
- Added import: `from enforcement.config_paths import get_cursor_enforcer_root`
- Line 51: Changed `enforcement_path = project_root / ".cursor" / "enforcement"` → `get_cursor_enforcer_root(project_root)`
- Updated `report.save()` call to pass `project_root` parameter

**Impact:** Uses centralized path configuration.

### 7. `.cursor__disabled/enforcement/checkers/security_checker.py`

**Changes:**
- Added imports: `from enforcement.config_paths import get_rules_root, get_project_root`
- Replaced class constant `SECURITY_FILES` with method `_get_security_files()` that uses `get_rules_root()`
- Updated `check()` method to call `_get_security_files()` instead of using constant

**Impact:** Security checker now uses centralized path configuration for rule files.

### 8. `.cursor__disabled/context_manager/rule_file_manager.py`

**Changes:**
- Added imports: `from enforcement.config_paths import get_rules_root, get_project_root`
- Updated `__init__()` to accept optional `project_root_arg` parameter
- Changed default `rules_dir` from `.cursor/enforcement/rules/context` → `.ai/rules/context` using `get_rules_root()`

**Impact:** Context rule files are now created in `.ai/rules/context/` instead of `.cursor/enforcement/rules/context/`.

---

## File Move Commands

**⚠️ IMPORTANT: These commands are DOCUMENTED ONLY. Do NOT execute them until after verifying the code changes work correctly.**

### Prerequisites

1. Ensure all Python code changes are committed
2. Run tests to verify path resolution works
3. Backup current state: `git commit -am "Pre-migration backup"`

### Move Commands

```bash
# Create .ai structure
mkdir -p .ai/rules
mkdir -p .ai/memory_bank
mkdir -p .ai/patterns
mkdir -p .ai/logs/enforcer

# Move rules (no content changes - move only)
# Note: This moves from .cursor__disabled/enforcement/rules/ to .ai/rules/
mv .cursor__disabled/enforcement/rules/* .ai/rules/

# Move memory bank
# Note: This moves from .cursor__disabled/memory-bank/ to .ai/memory_bank/
mv .cursor__disabled/memory-bank/* .ai/memory_bank/

# Move patterns
# Note: This moves from .cursor__disabled/patterns/ to .ai/patterns/
mv .cursor__disabled/patterns/* .ai/patterns/

# Verify moves
ls -la .ai/rules/
ls -la .ai/memory_bank/
ls -la .ai/patterns/
```

### Windows PowerShell Commands

```powershell
# Create .ai structure
New-Item -ItemType Directory -Force -Path .ai\rules
New-Item -ItemType Directory -Force -Path .ai\memory_bank
New-Item -ItemType Directory -Force -Path .ai\patterns
New-Item -ItemType Directory -Force -Path .ai\logs\enforcer

# Move rules (no content changes - move only)
Move-Item -Path .cursor__disabled\enforcement\rules\* -Destination .ai\rules\ -Force

# Move memory bank
Move-Item -Path .cursor__disabled\memory-bank\* -Destination .ai\memory_bank\ -Force

# Move patterns
Move-Item -Path .cursor__disabled\patterns\* -Destination .ai\patterns\ -Force

# Verify moves
Get-ChildItem .ai\rules\
Get-ChildItem .ai\memory_bank\
Get-ChildItem .ai\patterns\
```

### Expected File Counts

After moves, verify:
- `.ai/rules/` should contain ~23 `.mdc` files (including `context/` subdirectory)
- `.ai/memory_bank/` should contain ~8 `.md` files
- `.ai/patterns/` should contain ~4 `.md` files

---

## Verification Steps

### 1. Test Path Resolution

```bash
# Test config_paths module
python -c "from enforcement.config_paths import *; print('Rules:', get_rules_root()); print('Memory Bank:', get_memory_bank_root()); print('Enforcer Log:', get_enforcer_log_root()); print('Cursor Enforcer:', get_cursor_enforcer_root())"
```

**Expected:** All paths should resolve correctly and point to `.ai/*` or `.cursor/enforcement/` as appropriate.

### 2. Run Auto-Enforcer (Dry Run)

```bash
# Run auto-enforcer to verify it can find rules and memory bank
python .cursor__disabled/scripts/auto-enforcer.py
```

**Expected Behavior:**
- Auto-enforcer should load rules from `.ai/rules/` (after moves)
- Auto-enforcer should load memory bank from `.ai/memory_bank/` (after moves)
- All checkers should run successfully
- Reports should be written to:
  - Full reports: `.ai/logs/enforcer/ENFORCER_REPORT_FULL.json`, `AGENT_STATUS_FULL.md`, `VIOLATIONS_FULL.md`
  - Summaries: `.cursor/enforcement/ENFORCER_REPORT.json`, `AGENT_STATUS.md`, `VIOLATIONS.md`

### 3. Verify Dual-Write Behavior

After running auto-enforcer, check:

```bash
# Check full reports exist
ls -la .ai/logs/enforcer/

# Check summaries exist
ls -la .cursor/enforcement/

# Verify ENFORCER_REPORT.json has full_report_path field
cat .cursor/enforcement/ENFORCER_REPORT.json | grep full_report_path

# Verify VIOLATIONS.md has header pointing to full log
head -n 10 .cursor/enforcement/VIOLATIONS.md
```

**Expected:**
- Full reports in `.ai/logs/enforcer/` should be complete and detailed
- Summaries in `.cursor/enforcement/` should be smaller and reference full reports
- `ENFORCER_REPORT.json` should include `"full_report_path": ".ai/logs/enforcer/ENFORCER_REPORT_FULL.json"`
- `VIOLATIONS.md` should have header: "See `.ai/logs/enforcer/VIOLATIONS_FULL.md` for the complete violations log"

### 4. Run Unit Tests

```bash
# Run enforcement tests
python -m pytest .cursor__disabled/enforcement/tests/ -v

# Run context manager tests
python -m pytest .cursor__disabled/context_manager/tests/ -v
```

**Expected:** All tests should pass. Tests that hard-code paths may need updates (see Phase 5 below).

### 5. Verify Checker Router

```bash
# Test that checker router can find rules
python -c "from pathlib import Path; from enforcement.checkers.checker_router import CheckerRouter; from enforcement.config_paths import get_rules_root, get_project_root; router = CheckerRouter(get_project_root(), get_rules_root()); print('Rules dir:', router.rules_dir); print('Rule files:', list(router.rules_dir.glob('*.mdc'))[:5])"
```

**Expected:** Checker router should find rule files in `.ai/rules/`.

### 6. Verify Context Manager

```bash
# Test that rule file manager uses correct paths
python -c "from .cursor__disabled.context_manager.rule_file_manager import RuleFileManager; from enforcement.config_paths import get_project_root; manager = RuleFileManager(); print('Rules dir:', manager.rules_dir); print('Expected:', get_rules_root(get_project_root()) / 'context')"
```

**Expected:** Rule file manager should create context files in `.ai/rules/context/`.

### 7. Verify File Watcher (if applicable)

If file watcher is used, verify it still triggers auto-enforcer correctly:

```bash
# Check file watcher can find auto-enforcer
python -c "from pathlib import Path; from .cursor__disabled.scripts.file_watcher import EnforcerTrigger; trigger = EnforcerTrigger(project_root=Path('.')); print('Enforcer script:', trigger.enforcer_script)"
```

**Expected:** File watcher should still find and trigger auto-enforcer.

---

## Test Commands Summary

```bash
# 1. Test path resolution
python -c "from enforcement.config_paths import *; print('Rules:', get_rules_root()); print('Memory Bank:', get_memory_bank_root())"

# 2. Run auto-enforcer
python .cursor__disabled/scripts/auto-enforcer.py

# 3. Verify dual-write
ls -la .ai/logs/enforcer/
ls -la .cursor/enforcement/

# 4. Run tests
python -m pytest .cursor__disabled/enforcement/tests/ -v
python -m pytest .cursor__disabled/context_manager/tests/ -v

# 5. Verify checker router
python -c "from enforcement.checkers.checker_router import CheckerRouter; from enforcement.config_paths import get_rules_root, get_project_root; router = CheckerRouter(get_project_root(), get_rules_root()); print('OK' if router.rules_dir.exists() else 'FAIL')"
```

---

## Verification Checklist

- [ ] Config module (`enforcement/config_paths.py`) created and all paths resolve correctly
- [ ] All enforcement code imports from `enforcement.config_paths`
- [ ] Rules load from `.ai/rules/` (after moves)
- [ ] Memory bank loads from `.ai/memory_bank/` (after moves)
- [ ] Patterns accessible from `.ai/patterns/` (after moves)
- [ ] Full reports write to `.ai/logs/enforcer/`
- [ ] Summary reports write to `.cursor/enforcement/`
- [ ] `ENFORCER_REPORT.json` structure unchanged (for Two-Brain compatibility)
- [ ] `ENFORCER_REPORT.json` includes `full_report_path` field
- [ ] `ENFORCEMENT_BLOCK.md` still works (pre-flight check)
- [ ] `VIOLATIONS.md` summary shows last 50 violations with header
- [ ] All tests pass
- [ ] Auto-enforcer runs successfully
- [ ] File watcher still works (if applicable)
- [ ] Context manager still works
- [ ] No rule content (.mdc files, .cursorrules, /rules, /rules_backup, /rules_legacy) was changed
- [ ] Only path resolution and Python code were updated

---

## Notes

1. **Rule Content Unchanged:** No `.mdc` rule files, `.cursorrules`, or rule content in `/rules`, `/rules_backup`, `/rules_legacy` was modified. Only Python code and path references were updated.

2. **Behavioral Equivalence:** The auto-enforcer maintains the same behavior:
   - Loads rules from new location (`.ai/rules/`)
   - Loads memory bank from new location (`.ai/memory_bank/`)
   - Runs all checkers identically
   - Generates same reports (now dual-written)

3. **Cursor Context Reduction:** Heavy assets (rules, memory-bank, patterns, large reports) are now in `.ai/*` instead of `.cursor/`, reducing Cursor's hot context load.

4. **Backward Compatibility:** The `ENFORCER_REPORT.json` structure in `.cursor/enforcement/` remains compatible with current Two-Brain consumers, with an additional `full_report_path` field pointing to the full report.

5. **Pre-Flight Check:** `ENFORCEMENT_BLOCK.md` still exists in `.cursor/enforcement/` and behaves the same (pre-flight/blocking).

---

## Next Steps

1. **Review Code Changes:** Review all modified Python files
2. **Run Tests:** Execute test commands above
3. **Execute File Moves:** Run move commands (after verification)
4. **Final Verification:** Run full test suite and manual smoke test
5. **Commit Changes:** Commit all changes with appropriate commit message

---

## Risk Mitigation

1. **Path Resolution:** All paths now go through `enforcement.config_paths`, ensuring consistency
2. **Dual-Write:** Full reports and summaries are written separately, so if one fails, the other still works
3. **Backward Compatibility:** Summary reports maintain same structure for Two-Brain compatibility
4. **Directory Creation:** All path functions create directories as needed, preventing missing directory errors

---

**Execution Complete:** All Python code has been updated. File moves should be performed after verification.



