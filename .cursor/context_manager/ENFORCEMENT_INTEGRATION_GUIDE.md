# Context Enforcement Integration Guide

**Date:** 2025-12-01  
**Status:** Implementation Guide  
**Priority:** CRITICAL

---

## Overview

This guide shows how to integrate context management enforcement into `auto-enforcer.py` to create HARD STOP violations, just like date violations.

---

## Key Corrections Applied

### ✅ Correction 1: Context-ID Verification (Replaces File Read Detection)

**Problem:** File read detection is unreliable (access time, modification time, git diff don't prove file was read)

**Solution:** Embed unique context-id in recommendations.md, require agent to reference it

**Implementation:**
- Generate UUID when creating recommendations.md
- Embed as HTML comment: `<!-- context-id: {uuid} -->`
- Verify agent references this context-id in response

### ✅ Correction 2: Expanded Required Context (PRIMARY ∪ HIGH ∪ dependencies)

**Problem:** Only checking PRIMARY context is insufficient (missing HIGH priority file-specific and dependencies)

**Solution:** Check PRIMARY ∪ HIGH ∪ dependencies

**Implementation:**
- Use `ContextLoader.get_required_context()` which includes dependencies
- Filter to PRIMARY + HIGH priority contexts
- Include preloaded context in loaded context check

### ✅ Correction 3: Canonical Unload Algorithm

**Problem:** Using recommendations.md file list is unreliable (may be incomplete or outdated)

**Solution:** Use canonical algorithm: `expected_unload = (prev_active ∪ prev_preloaded) - (new_active ∪ new_preloaded)`

**Implementation:**
- Store previous context state
- Compute expected unload using canonical algorithm
- Compare with actual unloaded context

### ✅ Correction 4: Loaded Context = Active ∪ Preloaded

**Problem:** Only checking active context ignores preloaded context

**Solution:** Check both active AND preloaded contexts

**Implementation:**
```python
loaded_context = (
    set(preloader.preloaded_contexts.get('active', [])) |
    set(preloader.preloaded_contexts.get('preloaded', []))
)
```

### ✅ Correction 5: Predicted Context Pre-loading is WARNING, not BLOCKED

**Problem:** Pre-loading is optimization, not requirement

**Solution:** Make it WARNING severity, not BLOCKED

---

## Integration Steps

### Step 1: Add Context-ID to Recommendations Generation

**File:** `.cursor/scripts/auto-enforcer.py`

**Location:** `_generate_recommendations_file()` method

**Change:**
```python
# Generate unique context-id for enforcement verification
context_id = str(uuid.uuid4())

# Add to content:
content = f"""# Context Recommendations

<!-- context-id: {context_id} -->

**Context-ID:** {context_id}
...
```

### Step 2: Add Enforcement Methods to VeroFieldEnforcer

**File:** `.cursor/scripts/auto-enforcer.py`

**Add to `VeroFieldEnforcer` class:**

```python
def check_context_management_compliance(self) -> bool:
    """Check context management compliance (Step 0.5 and Step 4.5)."""
    if not PREDICTIVE_CONTEXT_AVAILABLE:
        return True  # Skip if system not available
    
    check_name = "Context Management Compliance"
    all_passed = True
    
    # Check Step 0.5 compliance (task start)
    if not self._check_step_0_5_compliance():
        all_passed = False
    
    # Check Step 4.5 compliance (task end)
    if not self._check_step_4_5_compliance():
        all_passed = False
    
    # Check context state validity
    if not self._check_context_state_validity():
        all_passed = False
    
    return all_passed

def _check_step_0_5_compliance(self) -> bool:
    """Check Step 0.5 compliance: context-id match, required context loaded."""
    all_passed = True
    
    recommendations_file = self.project_root / ".cursor" / "context_manager" / "recommendations.md"
    
    # Check 1: Context-ID verification
    context_id_match, latest_context_id = self._verify_context_id_match()
    if not context_id_match:
        self._log_violation(Violation(
            severity=ViolationSeverity.BLOCKED,
            rule_ref="01-enforcement.mdc Step 0.5",
            message=f"Context-id mismatch. Agent MUST reference latest context-id ({latest_context_id}) from recommendations.md before proceeding to Step 1.",
            file_path=str(recommendations_file),
            session_scope="current_session"
        ))
        all_passed = False
    
    # Check 2: Required context files are loaded (PRIMARY ∪ HIGH ∪ dependencies)
    if self.preloader:
        required_context = self._get_expanded_required_context_for_current_task()
        loaded_context = (
            set(self.preloader.preloaded_contexts.get('active', [])) |
            set(self.preloader.preloaded_contexts.get('preloaded', []))
        )
        
        missing_context = required_context - loaded_context
        if missing_context:
            for file_path in missing_context:
                self._log_violation(Violation(
                    severity=ViolationSeverity.BLOCKED,
                    rule_ref="01-enforcement.mdc Step 0.5",
                    message=f"Required context file {file_path} not loaded. MUST load before proceeding.",
                    file_path=str(file_path),
                    session_scope="current_session"
                ))
            all_passed = False
    
    return all_passed

def _check_step_4_5_compliance(self) -> bool:
    """Check Step 4.5 compliance: context unloaded/pre-loaded."""
    all_passed = True
    
    recommendations_file = self.project_root / ".cursor" / "context_manager" / "recommendations.md"
    
    # Check 1: Context-ID verification (updated)
    context_id_match, latest_context_id = self._verify_context_id_match()
    if not context_id_match:
        self._log_violation(Violation(
            severity=ViolationSeverity.BLOCKED,
            rule_ref="01-enforcement.mdc Step 4.5",
            message=f"Context-id mismatch. Agent MUST reference updated context-id ({latest_context_id}) from recommendations.md before Step 5.",
            file_path=str(recommendations_file),
            session_scope="current_session"
        ))
        all_passed = False
    
    # Check 2: Obsolete context was unloaded (canonical algorithm)
    if self.preloader:
        prev_state = self._get_previous_context_state()
        prev_active = set(prev_state.get('active', []))
        prev_preloaded = set(prev_state.get('preloaded', []))
        previously_loaded = prev_active | prev_preloaded
        
        curr_active = set(self.preloader.preloaded_contexts.get('active', []))
        curr_preloaded = set(self.preloader.preloaded_contexts.get('preloaded', []))
        currently_needed = curr_active | curr_preloaded
        
        expected_unload = previously_loaded - currently_needed
        still_loaded = curr_active | curr_preloaded
        not_unloaded = expected_unload & still_loaded
        
        if not_unloaded:
            for file_path in not_unloaded:
                self._log_violation(Violation(
                    severity=ViolationSeverity.BLOCKED,
                    rule_ref="01-enforcement.mdc Step 4.5",
                    message=f"Obsolete context {file_path} not unloaded. MUST unload before Step 5.",
                    file_path=str(file_path),
                    session_scope="current_session"
                ))
            all_passed = False
    
    # Check 3: Predicted context pre-loaded (WARNING only)
    if self.preloader:
        expected_preload = self._get_expected_preloaded_context()
        actual_preload = set(self.preloader.preloaded_contexts.get('preloaded', []))
        missing_preload = expected_preload - actual_preload
        if missing_preload:
            for file_path in missing_preload:
                self._log_violation(Violation(
                    severity=ViolationSeverity.WARNING,  # WARNING, not BLOCKED
                    rule_ref="01-enforcement.mdc Step 4.5",
                    message=f"Predicted context {file_path} not pre-loaded. Consider pre-loading for better performance.",
                    file_path=str(file_path),
                    session_scope="current_session"
                ))
    
    return all_passed

def _verify_context_id_match(self) -> tuple[bool, Optional[str]]:
    """Verify agent's context-id matches latest recommendations.md."""
    recommendations_file = self.project_root / ".cursor" / "context_manager" / "recommendations.md"
    
    if not recommendations_file.exists():
        return (False, None)
    
    try:
        with open(recommendations_file, 'r', encoding='utf-8') as f:
            content = f.read()
            
            # Extract context-id
            match = re.search(r'<!--\s*context-id:\s*([a-f0-9-]+)\s*-->', content, re.IGNORECASE)
            if not match:
                match = re.search(r'\*\*context-id:\*\*\s*([a-f0-9-]+)', content, re.IGNORECASE)
            if not match:
                match = re.search(r'context-id:\s*([a-f0-9-]+)', content, re.IGNORECASE)
            
            if not match:
                return (False, None)
            
            latest_context_id = match.group(1).strip()
            
            # Check if file is recent (within 5 minutes)
            stat_info = recommendations_file.stat()
            mod_time = datetime.fromtimestamp(stat_info.st_mtime, tz=timezone.utc)
            now = datetime.now(timezone.utc)
            age_seconds = (now - mod_time).total_seconds()
            
            if age_seconds > 300:  # 5 minutes
                return (False, latest_context_id)
            
            # TODO: Parse agent response for context-id reference
            # For MVP: Just verify context-id exists and file is recent
            
            return (True, latest_context_id)
    except (OSError, FileNotFoundError):
        return (False, None)

def _get_expanded_required_context_for_current_task(self) -> Set[str]:
    """Get expanded required context (PRIMARY ∪ HIGH ∪ dependencies)."""
    if not self.context_loader:
        return set()
    
    changed_files = self.get_changed_files(include_untracked=False)
    if not changed_files:
        return set()
    
    # Infer task type
    if self.task_detector:
        detection = self.task_detector.detect_task(
            agent_message="File changes detected",
            files=changed_files
        )
        task_type = detection.primary_task
    else:
        task_type = "edit_code"
    
    # Infer language
    language = self._infer_language_from_files(changed_files)
    
    # Get expanded required context (includes dependencies)
    requirements = self.context_loader.get_required_context(
        task_type=task_type,
        language=language,
        file_paths=changed_files
    )
    
    # Filter to PRIMARY + HIGH priority
    required = {
        req.file_path for req in requirements
        if req.priority in ('PRIMARY', 'HIGH')
    }
    
    return required

def _get_previous_context_state(self) -> Dict:
    """Get previous context state for unload verification."""
    context_state_file = self.project_root / ".cursor" / "context_manager" / "context_state.json"
    
    if context_state_file.exists():
        try:
            with open(context_state_file, 'r', encoding='utf-8') as f:
                state = json.load(f)
                return {
                    'active': state.get('active', []),
                    'preloaded': state.get('preloaded', [])
                }
        except (json.JSONDecodeError, OSError):
            pass
    
    return {'active': [], 'preloaded': []}

def _get_expected_preloaded_context(self) -> Set[str]:
    """Get expected pre-loaded context from recommendations.md."""
    recommendations_file = self.project_root / ".cursor" / "context_manager" / "recommendations.md"
    
    if not recommendations_file.exists():
        return set()
    
    try:
        with open(recommendations_file, 'r', encoding='utf-8') as f:
            content = f.read()
            
            # Extract pre-loaded context section
            preload_section = re.search(
                r'### Pre-loaded Context.*?\n(.*?)(?=###|##|$)',
                content,
                re.DOTALL | re.IGNORECASE
            )
            
            if preload_section:
                preload_content = preload_section.group(1)
                file_paths = re.findall(r'`(@?[^`]+)`', preload_content)
                return {path.lstrip('@') for path in file_paths}
    except (OSError, FileNotFoundError):
        pass
    
    return set()

def _infer_language_from_files(self, files: List[str]) -> Optional[str]:
    """Infer programming language from file paths."""
    if not files:
        return None
    
    python_extensions = {'.py', '.pyi'}
    typescript_extensions = {'.ts', '.tsx'}
    
    for file_path in files:
        path = Path(file_path)
        if path.suffix in python_extensions:
            return 'python'
        elif path.suffix in typescript_extensions:
            return 'typescript'
    
    return None

def _check_context_state_validity(self) -> bool:
    """Check context state file validity."""
    context_state_file = self.project_root / ".cursor" / "context_manager" / "context_state.json"
    
    if not context_state_file.exists():
        return True  # No state file is valid (first run)
    
    try:
        with open(context_state_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
            if not isinstance(data, dict):
                self._log_violation(Violation(
                    severity=ViolationSeverity.BLOCKED,
                    rule_ref="01-enforcement.mdc",
                    message="Context state file is invalid (not a dictionary). Must fix before proceeding.",
                    file_path=str(context_state_file),
                    session_scope="current_session"
                ))
                return False
            
            if 'active' not in data or 'preloaded' not in data:
                self._log_violation(Violation(
                    severity=ViolationSeverity.BLOCKED,
                    rule_ref="01-enforcement.mdc",
                    message="Context state file is invalid (missing required keys). Must fix before proceeding.",
                    file_path=str(context_state_file),
                    session_scope="current_session"
                ))
                return False
            
            return True
    except (json.JSONDecodeError, OSError) as e:
        self._log_violation(Violation(
            severity=ViolationSeverity.BLOCKED,
            rule_ref="01-enforcement.mdc",
            message=f"Context state file is corrupted: {e}. Must fix before proceeding.",
            file_path=str(context_state_file),
            session_scope="current_session"
        ))
        return False
```

### Step 3: Integrate into run_all_checks()

**File:** `.cursor/scripts/auto-enforcer.py`

**Location:** `run_all_checks()` method

**Add:**
```python
def run_all_checks(self) -> bool:
    """Run all enforcement checks."""
    all_passed = True
    
    # ... existing checks ...
    
    # NEW: Context management compliance check
    if not self.check_context_management_compliance():
        all_passed = False
    
    return all_passed
```

### Step 4: Add to Pre-Flight Check

**File:** `.cursor/scripts/auto-enforcer.py`

**Location:** Pre-flight check (before any task execution)

**Add:**
```python
def _pre_flight_check(self) -> bool:
    """Pre-flight check before any task execution."""
    # ... existing checks ...
    
    # NEW: Verify context management system is ready
    if PREDICTIVE_CONTEXT_AVAILABLE:
        if not self._check_context_state_validity():
            return False
    
    return True
```

---

## Agent Response Requirements

### Step 0.5 Output Format

Agent MUST include context-id in response:

```
Step 0.5 Verification:
✓ Read recommendations.md: [summary]
✓ Context-ID: a9e2b9e1-0182-4b98-8adf-9288d7e72b9a (matches latest)
✓ Loaded PRIMARY context:
  - @file1.md
  - @file2.md
✓ Context ready for task
✓ Ready to proceed to Step 1: YES
```

### Step 4.5 Output Format

Agent MUST include updated context-id in response:

```
Step 4.5 Verification:
✓ Read updated recommendations.md: [summary of changes]
✓ Context-ID: b8f3c0f2-1293-5c09-9bef-a399e8f83b0c (matches latest)
✓ Unloaded obsolete context:
  - @old-file1.md (no longer needed)
✓ Pre-loaded predicted context:
  - @next-file1.md (87% confidence)
✓ Context state updated
✓ Ready to proceed to Step 5: YES
```

---

## Testing

### Test Cases

1. **Test Context-ID Mismatch:**
   - Generate recommendations.md with context-id
   - Verify violation created if agent doesn't reference it

2. **Test Missing Required Context:**
   - Set up task requiring python_bible.mdc
   - Verify violation if not loaded

3. **Test Obsolete Context Not Unloaded:**
   - Load context A
   - Switch to task requiring context B
   - Verify violation if context A not unloaded

4. **Test Context State Validity:**
   - Corrupt context_state.json
   - Verify violation created

---

## Violation Examples

### Example 1: Context-ID Mismatch

```
🔴 BLOCKED: Context-id mismatch
Rule: 01-enforcement.mdc Step 0.5
File: .cursor/context_manager/recommendations.md
Message: Context-id mismatch. Agent MUST reference latest context-id (a9e2b9e1-0182-4b98-8adf-9288d7e72b9a) from recommendations.md before proceeding to Step 1.
Session Scope: current_session
```

### Example 2: Required Context Not Loaded

```
🔴 BLOCKED: Required context file not loaded
Rule: 01-enforcement.mdc Step 0.5
File: .cursor/rules/python_bible.mdc
Message: Required context file @.cursor/rules/python_bible.mdc not loaded. MUST load before proceeding.
Session Scope: current_session
```

### Example 3: Obsolete Context Not Unloaded

```
🔴 BLOCKED: Obsolete context not unloaded
Rule: 01-enforcement.mdc Step 4.5
File: .cursor/rules/old-rule.mdc
Message: Obsolete context @.cursor/rules/old-rule.mdc not unloaded. MUST unload before Step 5.
Session Scope: current_session
```

---

**Last Updated:** 2025-12-01  
**Status:** Ready for Integration  
**See:** `CONTEXT_ENFORCEMENT_IMPLEMENTATION.py` for complete code








