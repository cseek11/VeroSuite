# Context Usage & Token Statistics Audit Requirement

**Date:** 2025-12-02  
**Status:** Implemented  
**Rule:** Step 5.5 - Post-Implementation Audit

---

## Overview

A new mandatory section has been added to the Step 5 (Post-Implementation Audit) that requires reporting context usage and token statistics for every task completion.

---

## What Was Added

### 1. Step 5.5: Context Usage & Token Statistics (MANDATORY)

**Location:** `.cursor/rules/01-enforcement.mdc` (Step 5.5)

**Requirements:**
- **MUST** read `.cursor/context_manager/dashboard.md` for current context metrics
- **MUST** read `.cursor/context_manager/recommendations.md` for context plan
- **MUST** report active context files loaded during this task
- **MUST** report pre-loaded context files (if any)
- **MUST** report context files unloaded during this task
- **MUST** calculate and report token usage statistics
- **MUST** estimate and report token savings (if predictive context system is active)
- **MUST** verify context management compliance (Step 0.5 and Step 4.5)

### 2. Helper Method: `get_context_metrics_for_audit()`

**Location:** `.cursor/scripts/auto-enforcer.py`

**Purpose:**
- Retrieves context usage metrics from recommendations.md
- Calculates token statistics using TokenEstimator
- Checks compliance status from dashboard.md
- Returns structured data for Step 5 audit

**Usage:**
```python
enforcer = VeroFieldEnforcer()
metrics = enforcer.get_context_metrics_for_audit()

# Returns:
# {
#   'context_usage': {
#     'active_files': [...],
#     'preloaded_files': [...],
#     'unloaded_files': [...],
#     'active_count': N,
#     'preloaded_count': N,
#     'unloaded_count': N
#   },
#   'token_statistics': {
#     'active_tokens': N,
#     'preloaded_tokens': N,
#     'total_tokens': N,
#     'savings_tokens': N,
#     'savings_percentage': N.N,
#     'static_baseline': N
#   },
#   'compliance': {
#     'step_0_5_completed': bool,
#     'step_4_5_completed': bool,
#     'recommendations_followed': bool
#   },
#   'available': bool
# }
```

---

## Required Output Format

### Context Usage Summary

```
### Context Usage Summary

**Active Context Files (Loaded):**
- @file1.md (PRIMARY)
- @file2.md (PRIMARY)
- Total: [N] files

**Pre-loaded Context Files:**
- @next-file1.md (87% confidence)
- @next-file2.md (75% confidence)
- Total: [N] files

**Context Unloaded:**
- @old-file1.md (no longer needed)
- Total: [N] files

**Context Efficiency:**
- Active context files: [N]
- Pre-loaded context files: [N]
- Context files unloaded: [N]
```

### Token Statistics

```
### Token Statistics

**Token Usage:**
- Active context tokens: [N] tokens ([N] files)
- Pre-loaded context tokens: [N] tokens ([N] files, 30% cost)
- Total tokens used: [N] tokens

**Token Savings (Predictive vs Static):**
- Static approach (baseline): [N] tokens
- Predictive approach (actual): [N] tokens
- Tokens saved: [N] tokens
- Savings percentage: [N]%

**Efficiency Metrics:**
- Average tokens per file (static): [N] tokens/file
- Average tokens per file (predictive): [N] tokens/file
- Context swap overhead: [N]% (if applicable)
```

### Context Management Compliance

```
### Context Management Compliance

**Step 0.5 (Context Loading):**
- [ ] Completed: [Yes/No]
- [ ] Primary context loaded: [List files]
- [ ] Evidence: [Show verification output]

**Step 4.5 (Context Management):**
- [ ] Completed: [Yes/No]
- [ ] Obsolete context unloaded: [List files]
- [ ] Predicted context pre-loaded: [List files]
- [ ] Evidence: [Show verification output]

**Compliance Status:**
- Context loading: [COMPLIANT / NON-COMPLIANT]
- Context management: [COMPLIANT / NON-COMPLIANT]
- Recommendations followed: [YES / NO]
```

---

## Enforcement

### Hard Stop Conditions

**If context management system is available but metrics are not reported:**
- Audit is considered **INCOMPLETE**
- Task completion is **BLOCKED** until metrics are reported

### Verification Requirements

**Agent MUST show evidence of:**
- Reading dashboard.md and recommendations.md
- Calculating token metrics
- Verifying context management steps were completed

---

## Integration with Existing System

### Step 5 Audit Flow

1. **5.1:** Memory Bank Updates
2. **5.2:** Files Modified
3. **5.3:** Code Compliance Checks
4. **5.4:** Bug Logging
5. **5.5:** Context Usage & Token Statistics ⭐ **NEW**
6. **5.6:** Outstanding Items
7. **5.7:** Compliance Status (includes context management status)

### Dependencies

**Requires:**
- Context management system initialized (`PREDICTIVE_CONTEXT_AVAILABLE = True`)
- Recommendations file generated (`.cursor/context_manager/recommendations.md`)
- Dashboard file generated (`.cursor/context_manager/dashboard.md`)
- Token estimator available (`TokenEstimator` class)

**If context management system is not available:**
- Section 5.5 should still be included in audit
- Report: "Context management system not available"
- Token statistics: "N/A - System not available"

---

## Example Usage in Step 5 Audit

```markdown
## 5.5: Context Usage & Token Statistics (MANDATORY)

### Context Usage Summary

**Active Context Files (Loaded):**
- @python_bible.mdc (PRIMARY)
- @03-security.mdc (PRIMARY)
- @01-enforcement.mdc (PRIMARY)
- Total: 3 files

**Pre-loaded Context Files:**
- @test_auth.service.spec.ts (87% confidence)
- Total: 1 files

**Context Unloaded:**
- @old-docs.md (no longer needed)
- Total: 1 files

**Context Efficiency:**
- Active context files: 3
- Pre-loaded context files: 1
- Context files unloaded: 1

### Token Statistics

**Token Usage:**
- Active context tokens: 15,234 tokens (3 files)
- Pre-loaded context tokens: 1,234 tokens (1 files, 30% cost)
- Total tokens used: 16,468 tokens

**Token Savings (Predictive vs Static):**
- Static approach (baseline): 25,000 tokens
- Predictive approach (actual): 16,468 tokens
- Tokens saved: 8,532 tokens
- Savings percentage: 34.13%

**Efficiency Metrics:**
- Average tokens per file (static): 6,250 tokens/file
- Average tokens per file (predictive): 4,117 tokens/file
- Context swap overhead: <5% (negligible)

### Context Management Compliance

**Step 0.5 (Context Loading):**
- [x] Completed: Yes
- [x] Primary context loaded: @python_bible.mdc, @03-security.mdc, @01-enforcement.mdc
- [x] Evidence: Step 0.5 verification output shown above

**Step 4.5 (Context Management):**
- [x] Completed: Yes
- [x] Obsolete context unloaded: @old-docs.md
- [x] Predicted context pre-loaded: @test_auth.service.spec.ts (87% confidence)
- [x] Evidence: Step 4.5 verification output shown above

**Compliance Status:**
- Context loading: COMPLIANT
- Context management: COMPLIANT
- Recommendations followed: YES
```

---

## Benefits

1. **Visibility:** Track context usage and token efficiency for every task
2. **Optimization:** Identify opportunities to reduce token usage
3. **Compliance:** Ensure context management steps are followed
4. **Metrics:** Measure effectiveness of predictive context system
5. **Accountability:** Report token savings and efficiency gains

---

## Maintenance

**When to Update:**
- If context management system changes
- If token estimation algorithm changes
- If compliance requirements change

**Related Files:**
- `.cursor/rules/01-enforcement.mdc` (Step 5.5)
- `.cursor/scripts/auto-enforcer.py` (`get_context_metrics_for_audit()`)
- `.cursor/context_manager/token_estimator.py` (Token calculation)
- `.cursor/context_manager/dashboard.md` (Metrics source)

---

**Document Created:** 2025-12-02  
**Status:** Active  
**Enforcement:** Mandatory (Step 5.5)






