# Auto-Enforcer Files Summary

**Date:** 2025-12-02  
**Purpose:** Document existing auto-enforcer files and scripts for prompt tailoring

---

## Overview

The VeroField auto-enforcer system consists of three main components:

1. **Main Enforcer Script** - `.cursor/scripts/auto-enforcer.py` (5,534 lines)
2. **Two-Brain Integration** - `.cursor/enforcement/two_brain_integration.py` (274 lines)
3. **Report Generator** - `.cursor/enforcement/report_generator.py` (263 lines)

---

## 1. Main Enforcer Script

### File Path
```
.cursor/scripts/auto-enforcer.py
```

### Key Features
- **Size:** 5,534 lines
- **Main Class:** `VeroFieldEnforcer`
- **Entry Point:** `main()` function
- **Command Line:** `python .cursor/scripts/auto-enforcer.py [--user-message "message"]`

### Key Methods

#### `run_all_checks(user_message: Optional[str] = None) -> bool`
- Main orchestration method
- Runs all compliance checks
- Generates status files
- Creates `ENFORCEMENT_BLOCK.md` (if violations exist)
- Generates `ENFORCER_REPORT.json` via `generate_two_brain_report()`

#### `generate_enforcement_block_message()`
- **Location:** Line ~3279
- Creates `.cursor/enforcement/ENFORCEMENT_BLOCK.md`
- Only creates file if BLOCKED violations exist
- Removes file if no violations
- Contains blocking message with violation details

#### `generate_two_brain_report()`
- **Location:** Line ~4937
- Generates `ENFORCER_REPORT.json` for Brain B (LLM)
- Uses `two_brain_integration.integrate_with_enforcer()`
- Adds context hints via `_add_context_hints_to_report()`
- Saves report to `.cursor/enforcement/ENFORCER_REPORT.json`

#### `_add_context_hints_to_report(report)`
- **Location:** Line ~4984
- Adds context bundle to report
- Uses `_compute_unified_context_bundle()` to generate hints

#### `_compute_unified_context_bundle() -> Dict[str, Any]`
- **Location:** Line ~5005
- Detects task type from violations
- Extracts context hints
- Finds relevant example files
- Identifies patterns to follow
- Returns: `{task_type, hints, relevant_files, patterns_to_follow}`

#### `_detect_task_type_unified() -> Optional[str]`
- **Location:** Line ~5195
- Analyzes violations to determine task type
- Returns: `"add_rls"`, `"fix_date"`, `"add_logging"`, `"add_error_handling"`, etc.

#### `_extract_context_hints(task_type: Optional[str]) -> List[str]`
- **Location:** Line ~5222
- Comprehensive hints library
- Maps task types to guidance hints
- Returns list of hints for LLM

#### `_get_relevant_example_files(task_type: Optional[str]) -> List[str]`
- **Location:** Line ~5302
- Searches codebase for example implementations
- Uses git grep to find pattern matches
- Returns up to 5 example file paths

#### `_get_patterns_to_follow(task_type: Optional[str]) -> List[str]`
- **Location:** Line ~5386
- Comprehensive patterns library
- Maps task types to pattern descriptions
- Returns list of patterns for LLM to follow

### Data Structures

#### `Violation` (dataclass)
```python
@dataclass(slots=True)
class Violation:
    severity: ViolationSeverity  # BLOCKED, WARNING, INFO
    rule_ref: str  # e.g., "02-core.mdc", "03-security.mdc#R02"
    message: str
    file_path: Optional[str] = None
    line_number: Optional[int] = None
    timestamp: str = None
    session_scope: str = "unknown"  # "current_session" or "historical"
    fix_hint: Optional[str] = None
```

#### `ViolationSeverity` (Enum)
```python
class ViolationSeverity(Enum):
    BLOCKED = "BLOCKED"  # Hard stop
    WARNING = "WARNING"   # Should fix
    INFO = "INFO"        # Informational
```

---

## 2. Two-Brain Integration Module

### File Path
```
.cursor/enforcement/two_brain_integration.py
```

### Key Features
- **Size:** 274 lines
- **Main Class:** `TwoBrainIntegration`
- **Purpose:** Converts enforcer violations to `ENFORCER_REPORT.json` format

### Key Methods

#### `generate_report_from_enforcer(enforcer_instance) -> EnforcerReport`
- **Location:** Line ~40
- Main conversion method
- Reads violations from enforcer
- Converts to `EnforcerReport` format
- Maps violation attributes to report format
- Generates next actions

#### `integrate_with_enforcer(enforcer_instance) -> EnforcerReport`
- **Location:** Line ~250
- Convenience function
- Creates `TwoBrainIntegration` instance
- Calls `generate_report_from_enforcer()`
- Returns `EnforcerReport` ready to save

### Helper Methods

- `_generate_violation_id(violation) -> str` - Generates unique violation ID
- `_map_severity(violation) -> str` - Maps enforcer severity to report severity
- `_get_file_path(violation) -> str` - Extracts file path
- `_get_rule_ref(violation) -> str` - Extracts rule reference
- `_get_description(violation) -> str` - Extracts description
- `_get_evidence(violation) -> List[str]` - Extracts evidence
- `_get_fix_hint(violation) -> str` - Extracts or generates fix hint
- `_generate_next_actions(report)` - Generates next actions for LLM

---

## 3. Report Generator Module

### File Path
```
.cursor/enforcement/report_generator.py
```

### Key Features
- **Size:** 263 lines
- **Main Class:** `EnforcerReport`
- **Data Classes:** `Violation`, `AutoFix`
- **Purpose:** Defines report structure and serialization

### Key Classes

#### `Violation` (dataclass)
```python
@dataclass
class Violation:
    id: str
    severity: str  # "BLOCKING" or "WARNING"
    file: str
    rule_ref: str
    description: str
    evidence: List[str] = None
    fix_hint: str = None
```

#### `AutoFix` (dataclass)
```python
@dataclass
class AutoFix:
    file: str
    applied: bool
    description: str
    before: str = None
    after: str = None
```

#### `EnforcerReport` (class)
- **Location:** Line ~67
- Main report container
- Methods:
  - `add_violation(violation: Violation)`
  - `add_auto_fix(auto_fix: AutoFix)`
  - `add_next_action(action: str)`
  - `set_context_bundle(task_type, hints, relevant_files, patterns_to_follow)`
  - `get_status() -> str` - Returns "BLOCKING", "WARNING", or "OK"
  - `get_summary() -> Dict[str, int]` - Returns violation counts
  - `to_dict() -> Dict[str, Any]` - Serializes to dictionary
  - `to_json() -> str` - Serializes to JSON string
  - `save(path: Path = None)` - Saves to `.cursor/enforcement/ENFORCER_REPORT.json`
  - `load(path: Path = None) -> Optional[EnforcerReport]` - Loads from file

### Report Structure

```json
{
  "status": "BLOCKING" | "WARNING" | "OK",
  "session_id": "uuid",
  "generated_at": "ISO timestamp",
  "summary": {
    "blocking_count": 0,
    "warning_count": 0,
    "auto_fixes_applied": 0
  },
  "violations": [
    {
      "id": "VF-RLS-001",
      "severity": "BLOCKING",
      "file": "apps/api/src/customers/customers.service.ts",
      "rule_ref": "03-security.mdc#R02",
      "description": "Multi-tenant query missing RLS guard",
      "evidence": ["Line 42: findMany without tenant_id filter"],
      "fix_hint": "Add where: { tenant_id: currentUser.tenant_id }"
    }
  ],
  "auto_fixes": [],
  "next_actions": [
    "Fix VF-RLS-001 (BLOCKING): Multi-tenant query missing RLS guard"
  ],
  "context_updates": {
    "load": [],
    "unload": []
  },
  "memory_bank_updates": {
    "files_to_update": [],
    "summary": null
  },
  "context_bundle": {
    "task_type": "add_rls",
    "hints": [
      "RLS pattern: Filter all queries by tenant_id",
      "Use TenantGuard decorator on controller methods"
    ],
    "relevant_files": [
      "apps/api/src/customers/customers.service.ts"
    ],
    "patterns_to_follow": [
      "Use TenantGuard decorator on controller methods",
      "Inject tenant_id from authenticated context (JWT)"
    ]
  }
}
```

---

## 4. ENFORCEMENT_BLOCK.md Generation

### File Path
```
.cursor/enforcement/ENFORCEMENT_BLOCK.md
```

### Creation Logic
- **Created when:** BLOCKED violations exist
- **Removed when:** No BLOCKED violations
- **Method:** `generate_enforcement_block_message()` in `auto-enforcer.py` (line ~3279)

### File Structure
```markdown
# 🚨 ENFORCEMENT BLOCK - DO NOT PROCEED 🚨

**Status:** 🔴 BLOCKED

## ⚠️ CRITICAL: YOU MUST STOP IMMEDIATELY

**The enforcement system has detected violations that BLOCK task execution.**

**YOU MUST:**
1. **STOP all current work immediately**
2. **Read this entire message**
3. **Fix violations before proceeding**
4. **DO NOT continue with any task until violations are resolved**

## Blocking Violations Summary

- **Total Blocked Violations:** N
  - 🔧 **Current Session (Auto-Fixable):** M
  - 📋 **Historical (Require Human Input):** K

## 🔧 Current Session Violations (Auto-Fixable)
[Violation details...]

## 📋 Historical Violations (Require Human Input)
[Violation details...]

## Next Steps
[Instructions...]
```

---

## 5. ENFORCER_REPORT.json Generation

### File Path
```
.cursor/enforcement/ENFORCER_REPORT.json
```

### Generation Flow

1. **Enforcer runs checks** → `run_all_checks()`
2. **Violations collected** → Stored in `self.violations`
3. **Report generation** → `generate_two_brain_report()` called
4. **Integration** → `two_brain_integration.integrate_with_enforcer()` converts violations
5. **Context hints** → `_add_context_hints_to_report()` adds context bundle
6. **Save** → `report.save()` writes to file

### Key Integration Points

- **Line 3711-3722** in `auto-enforcer.py`: Calls `generate_two_brain_report()`
- **Line 4937-4982** in `auto-enforcer.py`: `generate_two_brain_report()` method
- **Line 4950** in `auto-enforcer.py`: Imports `integrate_with_enforcer` from `two_brain_integration`
- **Line 4953** in `auto-enforcer.py`: Calls `integrate_with_enforcer(self)`
- **Line 4956** in `auto-enforcer.py`: Adds context hints
- **Line 4959** in `auto-enforcer.py`: Saves report

---

## 6. Context Bundle Generation

### Task Type Detection
- **Method:** `_detect_task_type_unified()` (line ~5195)
- **Input:** Violations from enforcer
- **Output:** Task type string (e.g., `"add_rls"`, `"fix_date"`, `"add_logging"`)

### Context Hints Library
- **Method:** `_extract_context_hints()` (line ~5222)
- **Hints Map:** Comprehensive library of hints by task type
- **Examples:**
  - `"add_rls"`: RLS patterns, TenantGuard usage, tenant_id filtering
  - `"add_logging"`: Structured logging patterns, event names
  - `"fix_date"`: System date injection, date abstraction
  - `"add_error_handling"`: Error handling patterns, logging

### Relevant Files Discovery
- **Method:** `_get_relevant_example_files()` (line ~5302)
- **Method:** Uses `git grep` to find example implementations
- **Returns:** Up to 5 example file paths

### Patterns Library
- **Method:** `_get_patterns_to_follow()` (line ~5386)
- **Patterns Map:** Comprehensive library of patterns by task type
- **Returns:** List of pattern descriptions for LLM to follow

---

## 7. Usage Examples

### Running the Enforcer

```bash
# Basic run
python .cursor/scripts/auto-enforcer.py

# With user message (for task detection)
python .cursor/scripts/auto-enforcer.py --user-message "Add RLS to customers service"
```

### Reading the Report

```python
from pathlib import Path
from enforcement.report_generator import EnforcerReport

# Load report
report = EnforcerReport.load()

# Check status
status = report.get_status()  # "BLOCKING", "WARNING", or "OK"

# Get violations
blocking = [v for v in report.violations if v.severity == "BLOCKING"]

# Get context bundle
task_type = report.context_bundle["task_type"]
hints = report.context_bundle["hints"]
relevant_files = report.context_bundle["relevant_files"]
patterns = report.context_bundle["patterns_to_follow"]
```

### Integration Example

```python
from enforcement.two_brain_integration import integrate_with_enforcer
from enforcement.report_generator import EnforcerReport

# Assuming you have an enforcer instance
enforcer = VeroFieldEnforcer()
enforcer.run_all_checks()

# Generate report
report = integrate_with_enforcer(enforcer)

# Save report
report.save()
```

---

## 8. File Locations Summary

| File | Path | Size | Purpose |
|------|------|------|---------|
| Main Enforcer | `.cursor/scripts/auto-enforcer.py` | 5,534 lines | Main enforcement engine |
| Two-Brain Integration | `.cursor/enforcement/two_brain_integration.py` | 274 lines | Converts violations to report format |
| Report Generator | `.cursor/enforcement/report_generator.py` | 263 lines | Defines report structure |
| ENFORCER_REPORT.json | `.cursor/enforcement/ENFORCER_REPORT.json` | Variable | Generated report for LLM |
| ENFORCEMENT_BLOCK.md | `.cursor/enforcement/ENFORCEMENT_BLOCK.md` | Variable | Blocking message (if violations) |

---

## 9. Key Integration Points

### Enforcer → Report Flow

```
VeroFieldEnforcer.run_all_checks()
  ↓
generate_two_brain_report()
  ↓
integrate_with_enforcer(self)
  ↓
TwoBrainIntegration.generate_report_from_enforcer()
  ↓
EnforcerReport (with violations)
  ↓
_add_context_hints_to_report(report)
  ↓
_compute_unified_context_bundle()
  ↓
report.set_context_bundle(...)
  ↓
report.save()
  ↓
ENFORCER_REPORT.json
```

### Block File Generation Flow

```
VeroFieldEnforcer.run_all_checks()
  ↓
[Violations detected]
  ↓
generate_enforcement_block_message()
  ↓
[If BLOCKED violations exist]
  ↓
ENFORCEMENT_BLOCK.md created
  ↓
[If no BLOCKED violations]
  ↓
ENFORCEMENT_BLOCK.md removed (if exists)
```

---

## 10. Sample Code Snippets

### Generating a Report Manually

```python
from pathlib import Path
import sys

# Add paths
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / ".cursor"))

from scripts.auto_enforcer import VeroFieldEnforcer
from enforcement.two_brain_integration import integrate_with_enforcer

# Create enforcer
enforcer = VeroFieldEnforcer()

# Run checks
enforcer.run_all_checks(user_message="Add RLS to customers service")

# Generate report
report = integrate_with_enforcer(enforcer)

# Add context hints (if not already added)
enforcer._add_context_hints_to_report(report)

# Save
report.save()

print(f"Status: {report.get_status()}")
print(f"Violations: {len(report.violations)}")
print(f"Task Type: {report.context_bundle['task_type']}")
```

### Reading Context Bundle

```python
from enforcement.report_generator import EnforcerReport

report = EnforcerReport.load()

if report:
    bundle = report.context_bundle
    print(f"Task Type: {bundle['task_type']}")
    print(f"Hints: {bundle['hints']}")
    print(f"Relevant Files: {bundle['relevant_files']}")
    print(f"Patterns: {bundle['patterns_to_follow']}")
```

---

## 11. Next Steps for Prompt Tailoring

With this information, you can now tailor prompts with:

1. **Exact file paths** for all three key files
2. **Sample contents** from each file (key methods, data structures)
3. **Integration flow** showing how files connect
4. **Context bundle structure** showing what hints are available
5. **Report structure** showing JSON format

This should enable precise prompt engineering for the auto-enforcer system.

---

**End of Summary**



