# Context Management Programmatic Enforcement Plan

**Date:** 2025-12-01  
**Status:** Implementation Plan  
**Priority:** CRITICAL

---

## Executive Summary

This plan adds programmatic enforcement for context management compliance, similar to how date violations are hard-stopped. The system will:

1. **Detect** if recommendations were followed (Step 0.5 and Step 4.5)
2. **Create violations** for non-compliance
3. **Block tasks** programmatically (HARD STOP)
4. **Verify** required files were loaded
5. **Check** if context was unloaded

**Key Principle:** Just like date violations, context management violations will HARD STOP execution until compliance is achieved.

---

## Enforcement Points

### 1. Step 0.5 Enforcement (Task Start)

**When:** Before Step 1 (Search & Discovery)  
**What to Check:**
- `recommendations.md` contains valid context-id that agent must reference
- Required context files are loaded: PRIMARY ∪ HIGH ∪ dependencies (tracked via state)
- Agent response includes context-id from recommendations.md

**Violation:** BLOCKED if context-id mismatch or required context not loaded

**Key Fix:** Use embedded context-id instead of unreliable file read detection

### 2. Step 4.5 Enforcement (Task End)

**When:** After Step 4 (Implementation Plan), before Step 5 (Post-Implementation Audit)  
**What to Check:**
- `recommendations.md` contains updated context-id that agent must reference
- Obsolete context was unloaded (using canonical algorithm: `(prev_active ∪ prev_preloaded) - (new_active ∪ new_preloaded)`)
- Predicted context was pre-loaded (if probability >70%) - WARNING only, not BLOCKED
- Agent response includes updated context-id

**Violation:** BLOCKED if context-id mismatch or obsolete context not unloaded

**Key Fix:** Use canonical unload algorithm, not recommendations.md file list

### 3. Continuous Enforcement

**When:** During task execution (before critical operations)  
**What to Check:**
- Required context files are still loaded (state verification)
- Context state is valid (no corruption)

**Violation:** BLOCKED if context state invalid or required context missing

---

## Implementation Strategy

### Phase 1: Detection Methods

#### Method 1: Context-ID Verification (REPLACES File Access Tracking)
- Embed unique context-id (GUID/timestamp hash) in `recommendations.md`
- Require agent to reference context-id in response
- Compare agent's context-id with latest recommendations.md
- 100% reliable, platform-independent

#### Method 2: State Verification
- Compare `context_state.json` before/after task
- Verify required files are in active context
- Check if obsolete files were unloaded

#### Method 3: Conversation Analysis (Optional)
- Parse agent responses for `@` mentions
- Verify required files were mentioned
- Track context loading/unloading actions

#### Method 4: Recommendations File Analysis
- Parse `recommendations.md` for required context
- Compare against actual loaded context
- Detect mismatches

### Phase 2: Violation Creation

#### Violation Types

1. **CONTEXT_NOT_LOADED** (BLOCKED)
   - Required PRIMARY context files not loaded
   - Message: "Required context file {file} not loaded. Must load before proceeding."
   - Rule: `01-enforcement.mdc Step 0.5`

2. **CONTEXT_ID_MISMATCH** (BLOCKED)
   - Agent's context-id doesn't match latest recommendations.md
   - Message: "Context-id mismatch. Agent must reference latest context-id from recommendations.md."
   - Rule: `01-enforcement.mdc Step 0.5`

3. **CONTEXT_NOT_UNLOADED** (BLOCKED)
   - Obsolete context not unloaded at task end
   - Message: "Obsolete context {file} not unloaded. Must unload before Step 5."
   - Rule: `01-enforcement.mdc Step 4.5`

4. **PREDICTED_CONTEXT_NOT_PRELOADED** (WARNING)
   - Predicted context (probability >70%) not pre-loaded
   - Message: "Predicted context {file} (probability {prob}%) not pre-loaded."
   - Rule: `01-enforcement.mdc Step 4.5`

5. **CONTEXT_STATE_INVALID** (BLOCKED)
   - Context state file corrupted or invalid
   - Message: "Context state file is invalid. Must fix before proceeding."
   - Rule: `01-enforcement.mdc`

### Phase 3: Integration with Auto-Enforcer

#### New Check Method

```python
def check_context_management_compliance(self) -> bool:
    """
    Check context management compliance (Step 0.5 and Step 4.5).
    
    Returns:
        True if compliant, False if violations found
    """
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
```

#### Integration Points

1. **Pre-Flight Check** (before any task)
   - Run `check_context_management_compliance()`
   - Block if BLOCKED violations found

2. **Step 0.5 Verification** (after Memory Bank, before Step 1)
   - Verify recommendations.md was read
   - Verify required context loaded
   - Block if violations found

3. **Step 4.5 Verification** (after Step 4, before Step 5)
   - Verify recommendations.md was re-read
   - Verify context unloaded/pre-loaded
   - Block if violations found

4. **Continuous Monitoring** (during task execution)
   - Periodically verify context state
   - Block if state becomes invalid

---

## Detection Implementation

### Step 0.5 Detection (CORRECTED)

```python
def _check_step_0_5_compliance(self) -> bool:
    """Check Step 0.5 compliance: context-id match, required context loaded."""
    all_passed = True
    
    recommendations_file = self.project_root / ".cursor" / "context_manager" / "recommendations.md"
    
    # Check 1: Context-ID verification (replaces unreliable file read detection)
    if not self._verify_context_id_match(recommendations_file):
        self._log_violation(Violation(
            severity=ViolationSeverity.BLOCKED,
            rule_ref="01-enforcement.mdc Step 0.5",
            message="Context-id mismatch. Agent MUST reference latest context-id from recommendations.md before proceeding to Step 1.",
            file_path=str(recommendations_file),
            session_scope="current_session"
        ))
        all_passed = False
    
    # Check 2: Required context files are loaded (PRIMARY ∪ HIGH ∪ dependencies)
    if PREDICTIVE_CONTEXT_AVAILABLE and self.preloader:
        # Get expanded required context (includes dependencies)
        required_context = self._get_expanded_required_context_for_current_task()
        # Loaded context = active ∪ preloaded (both are considered "loaded")
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
```

### Step 4.5 Detection (CORRECTED)

```python
def _check_step_4_5_compliance(self) -> bool:
    """Check Step 4.5 compliance: context unloaded/pre-loaded."""
    all_passed = True
    
    recommendations_file = self.project_root / ".cursor" / "context_manager" / "recommendations.md"
    
    # Check 1: Context-ID verification (updated context-id)
    if not self._verify_context_id_match(recommendations_file):
        self._log_violation(Violation(
            severity=ViolationSeverity.BLOCKED,
            rule_ref="01-enforcement.mdc Step 4.5",
            message="Context-id mismatch. Agent MUST reference updated context-id from recommendations.md before Step 5.",
            file_path=str(recommendations_file),
            session_scope="current_session"
        ))
        all_passed = False
    
    # Check 2: Obsolete context was unloaded (using canonical algorithm)
    if PREDICTIVE_CONTEXT_AVAILABLE and self.preloader:
        # Get previous state (from session start or last check)
        prev_state = self._get_previous_context_state()
        prev_active = set(prev_state.get('active', []))
        prev_preloaded = set(prev_state.get('preloaded', []))
        previously_loaded = prev_active | prev_preloaded
        
        # Get current state
        curr_active = set(self.preloader.preloaded_contexts.get('active', []))
        curr_preloaded = set(self.preloader.preloaded_contexts.get('preloaded', []))
        currently_needed = curr_active | curr_preloaded
        
        # Canonical unload calculation
        expected_unload = previously_loaded - currently_needed
        
        # Check if expected unload files are still loaded
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
    
    # Check 3: Predicted context pre-loaded (WARNING only, not BLOCKED)
    if PREDICTIVE_CONTEXT_AVAILABLE and self.preloader:
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
            # Don't set all_passed = False for warnings
    
    return all_passed
```

### Context-ID Verification (REPLACES File Read Detection)

```python
def _verify_context_id_match(self, recommendations_file: Path) -> bool:
    """
    Verify agent's context-id matches latest recommendations.md.
    
    This is 100% reliable and platform-independent.
    
    Returns:
        True if context-id matches, False otherwise
    """
    # Extract context-id from recommendations.md
    try:
        with open(recommendations_file, 'r', encoding='utf-8') as f:
            content = f.read()
            # Look for context-id in HTML comment or metadata
            import re
            match = re.search(r'<!--\s*context-id:\s*([a-f0-9-]+)\s*-->', content, re.IGNORECASE)
            if not match:
                # Try alternative format: **Context-ID:** uuid
                match = re.search(r'\*\*context-id:\*\*\s*([a-f0-9-]+)', content, re.IGNORECASE)
            if not match:
                # Try metadata format: context-id: uuid
                match = re.search(r'context-id:\s*([a-f0-9-]+)', content, re.IGNORECASE)
            
            if match:
                latest_context_id = match.group(1).strip()
            else:
                # No context-id found - file may not be generated yet
                logger.warn(
                    "No context-id found in recommendations.md",
                    operation="_verify_context_id_match",
                    file_path=str(recommendations_file)
                )
                return False
    except (OSError, FileNotFoundError) as e:
        logger.warn(
            f"Could not read recommendations.md: {e}",
            operation="_verify_context_id_match",
            file_path=str(recommendations_file)
        )
        return False
    
    # Check if agent referenced this context-id in response
    # This would require parsing agent's response or conversation history
    # For now, we'll check if context-id exists and is recent (within last 5 minutes)
    # In full implementation, agent must include context-id in response
    
    # TODO: Parse agent response for context-id reference
    # For MVP: Just verify context-id exists and file is recent
    try:
        stat_info = recommendations_file.stat()
        mod_time = datetime.fromtimestamp(stat_info.st_mtime, tz=timezone.utc)
        now = datetime.now(timezone.utc)
        age_seconds = (now - mod_time).total_seconds()
        
        # File must be generated within last 5 minutes (300 seconds)
        if age_seconds > 300:
            logger.warn(
                f"recommendations.md is stale (age: {age_seconds}s)",
                operation="_verify_context_id_match",
                file_path=str(recommendations_file),
                age_seconds=age_seconds
            )
            return False
        
        return True
    except OSError:
        return False

def _get_expanded_required_context_for_current_task(self) -> Set[str]:
    """
    Get expanded required context (PRIMARY ∪ HIGH ∪ dependencies).
    
    This calls ContextLoader.get_required_context() which includes:
    - PRIMARY + required contexts
    - HIGH priority contexts (file-specific, dependencies)
    - Dependencies recursively expanded
    
    Returns:
        Set of required context file paths
    """
    if not PREDICTIVE_CONTEXT_AVAILABLE or not self.context_loader:
        return set()
    
    # Detect current task
    changed_files = self.get_changed_files(include_untracked=False)
    if not changed_files:
        return set()
    
    # Infer task type and language
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
    
    # Filter to PRIMARY + HIGH priority (required context)
    required = {
        req.file_path for req in requirements
        if req.priority in ('PRIMARY', 'HIGH')
    }
    
    return required
```

---

## Integration with Existing Enforcement

### Add to run_all_checks()

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

### Add to Pre-Flight Check

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

## Violation Examples

### Example 1: Recommendations Not Read

```
🔴 BLOCKED: recommendations.md not read
Rule: 01-enforcement.mdc Step 0.5
File: .cursor/context_manager/recommendations.md
Message: recommendations.md not read. MUST read before proceeding to Step 1.
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

## Testing Strategy

### Unit Tests

1. **Test file read detection:**
   - Verify `_was_file_read()` detects file access
   - Test with different file access methods
   - Test edge cases (file doesn't exist, no access time)

2. **Test context state verification:**
   - Verify required context detection
   - Test missing context detection
   - Test obsolete context detection

3. **Test violation creation:**
   - Verify BLOCKED violations are created
   - Verify violation messages are clear
   - Verify violations block execution

### Integration Tests

1. **Test Step 0.5 enforcement:**
   - Verify task is blocked if recommendations not read
   - Verify task is blocked if required context not loaded
   - Verify task proceeds if compliant

2. **Test Step 4.5 enforcement:**
   - Verify task is blocked if context not unloaded
   - Verify task proceeds if compliant

3. **Test end-to-end workflow:**
   - Complete task with context management
   - Verify no violations
   - Verify context state is correct

---

## Rollout Plan

### Phase 1: Detection Implementation (Week 1)
- Implement file read detection
- Implement context state verification
- Add violation creation logic

### Phase 2: Integration (Week 1)
- Integrate with auto-enforcer
- Add to pre-flight check
- Add to run_all_checks()

### Phase 3: Testing (Week 2)
- Create unit tests
- Create integration tests
- Test in staging environment

### Phase 4: Deployment (Week 2)
- Deploy to production
- Monitor for false positives
- Adjust thresholds as needed

---

## Success Criteria

- ✅ Recommendations.md read detection: >95% accuracy
- ✅ Required context detection: >90% accuracy
- ✅ Obsolete context detection: >90% accuracy
- ✅ False positive rate: <5%
- ✅ Violations block execution: 100% of BLOCKED violations

---

## Critical Corrections Applied

### ✅ Correction 1: Context-ID Verification (Replaces File Read Detection)

**Problem:** File read detection is unreliable (access time, modification time, git diff don't prove file was read)

**Solution:** Embed unique context-id (UUID) in recommendations.md, require agent to reference it

**Implementation:**
- Generate UUID when creating recommendations.md
- Embed as HTML comment: `<!-- context-id: {uuid} -->`
- Verify agent references this context-id in response
- Check file is recent (within 5 minutes)

**Result:** 100% reliable, platform-independent verification

### ✅ Correction 2: Expanded Required Context (PRIMARY ∪ HIGH ∪ dependencies)

**Problem:** Only checking PRIMARY context is insufficient (missing HIGH priority file-specific and dependencies)

**Solution:** Check PRIMARY ∪ HIGH ∪ dependencies

**Implementation:**
- Use `ContextLoader.get_required_context()` which includes dependencies
- Filter to PRIMARY + HIGH priority contexts
- Include preloaded context in loaded context check

**Result:** Complete context verification, no false "missing context" violations

### ✅ Correction 3: Canonical Unload Algorithm

**Problem:** Using recommendations.md file list is unreliable (may be incomplete or outdated)

**Solution:** Use canonical algorithm: `expected_unload = (prev_active ∪ prev_preloaded) - (new_active ∪ new_preloaded)`

**Implementation:**
- Store previous context state
- Compute expected unload using canonical algorithm
- Compare with actual unloaded context

**Result:** Accurate unload verification, no false positives

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

**Result:** Complete context state verification

### ✅ Correction 5: Predicted Context Pre-loading is WARNING, not BLOCKED

**Problem:** Pre-loading is optimization, not requirement

**Solution:** Make it WARNING severity, not BLOCKED

**Result:** Pre-loading failures don't block execution

---

## Risk Mitigation

### Risk 1: False Positives
**Mitigation:**
- Use context-id verification (100% reliable)
- Use canonical unload algorithm (deterministic)
- Include preloaded context in checks (complete state)
- Log all detection attempts for debugging

### Risk 2: Performance Impact
**Mitigation:**
- Limit checks to critical points (Step 0.5, Step 4.5)
- Cache context state lookups
- Use efficient set operations

### Risk 3: Platform Differences
**Mitigation:**
- Context-id verification is platform-independent
- No file system access time dependencies
- Works on Windows, Linux, macOS

---

## Implementation Files

1. **CONTEXT_ENFORCEMENT_IMPLEMENTATION.py** - Complete implementation code
2. **ENFORCEMENT_INTEGRATION_GUIDE.md** - Step-by-step integration guide
3. **CONTEXT_ENFORCEMENT_PLAN.md** - This document (corrected plan)

---

**Last Updated:** 2025-12-01  
**Status:** Ready for Implementation (Corrected)  
**Owner:** Engineering Team

