---
description: "Comprehensive pre-implementation enforcement prompt ensuring all rules are followed, error patterns are checked, and test retries are limited"
alwaysApply: true
---

# PRE-IMPLEMENTATION ENFORCEMENT PROMPT

## ⚠️ CRITICAL: MANDATORY PRE-FLIGHT CHECKLIST

**BEFORE writing ANY code or tests, you MUST complete this comprehensive checklist. This prompt supersedes all other instructions until completion.**

---

## PHASE 1: PRE-IMPLEMENTATION RULE COMPLIANCE (MANDATORY)

### Step 1: Complete 5-Step Enforcement Pipeline

You MUST execute the complete 5-step pipeline from `.cursor/rules/01-enforcement.mdc`:

#### ✅ Step 1: Search & Discovery
- [ ] **MUST** search for existing components: `codebase_search("How does [feature] work?")`
- [ ] **MUST** check component library: `read_file("docs/reference/COMPONENT_LIBRARY_CATALOG.md")`
- [ ] **MUST** find 2-3 similar implementations using `grep` and `codebase_search`
- [ ] **MUST** verify file location using `list_dir` and `glob_file_search`
- [ ] **MUST** read relevant documentation files
- [ ] **MUST** search `docs/error-patterns.md` for similar past issues ⭐ **CRITICAL**
- [ ] **MUST** search `docs/engineering-decisions.md` for relevant decisions
- [ ] **MUST** identify all error-prone operations
- [ ] **MUST** check for old naming (VeroSuite, @verosuite/*) in affected files

**STOP if you haven't completed all searches above.**

#### ✅ Step 2: Pattern Analysis
- [ ] **MUST** identify the pattern to follow from similar implementations
- [ ] **MUST** verify correct file path (check `.cursor/rules/04-architecture.mdc`)
- [ ] **MUST** check for known error patterns from `docs/error-patterns.md`
- [ ] **MUST** verify error handling patterns match existing codebase

**STOP if pattern is unclear - ask for clarification.**

#### ✅ Step 3: Rule Compliance Check
- [ ] **MUST** verify tenant isolation if touching database
- [ ] **MUST** check if using correct file paths
- [ ] **MUST** use current system date (check device date) - NEVER hardcode dates
- [ ] **MUST** verify structured logging requirements met
- [ ] **MUST** verify trace ID propagation present
- [ ] **MUST** verify error handling blocks present for all error-prone operations
- [ ] **MUST** verify no architecture changes without permission
- [ ] **MUST** verify no old naming introduced

**STOP if any rule violation detected.**

#### ✅ Step 4: Implementation Plan
- [ ] **MUST** create todo list for complex features (>3 steps)
- [ ] **MUST** explain what you found in searches
- [ ] **MUST** describe the pattern you'll follow
- [ ] **MUST** list files you'll create/modify

**STOP if plan is not clear.**

---

## PHASE 2: ERROR PATTERN REVIEW BEFORE TESTING (MANDATORY)

### ⚠️ CRITICAL: Error Pattern Check Before Test Creation

**BEFORE writing ANY test, you MUST:**

1. **Read `docs/error-patterns.md` completely:**
   ```bash
   read_file("docs/error-patterns.md")
   ```

2. **Search for relevant error patterns:**
   - Search for patterns related to your feature area
   - Search for patterns related to similar functionality
   - Search for patterns related to error-prone operations you identified

3. **Document applicable patterns:**
   - List all error patterns that apply to your implementation
   - Note prevention strategies from each pattern
   - Plan how to avoid these patterns in your code

4. **Verify test coverage for error patterns:**
   - Ensure tests cover scenarios that triggered past errors
   - Ensure tests verify prevention strategies are working
   - Ensure tests cover edge cases documented in error patterns

**Example Error Pattern Check:**
```
Error Patterns Applicable to This Feature:
- TYPESCRIPT_ANY_TYPES: Ensure all types are properly defined, no `any` types
- TENANT_ISOLATION_VIOLATIONS: Verify all queries include tenantId filter
- SILENT_FAILURES: Ensure all error paths are logged and handled
- [Add other applicable patterns]

Prevention Strategies:
- Use proper TypeScript types (no `any`)
- Always include tenantId in database queries
- Log all errors with structured logging
- [Add other prevention strategies]
```

**STOP if you haven't reviewed error patterns - this is MANDATORY.**

---

## PHASE 3: TEST ERROR RETRY LIMITS (MANDATORY)

### ⚠️ CRITICAL: Test Fix Retry Limits

**When fixing test errors, you MUST follow these strict limits:**

#### Retry Limit Rules:
1. **Maximum 3 attempts** to fix test errors
2. **After 3 failed attempts**, you MUST:
   - Stop attempting fixes
   - Document the issue clearly
   - Request human intervention
   - Provide detailed error analysis

#### Retry Attempt Tracking:
- **Attempt 1:** Initial test failure → Fix and retry
- **Attempt 2:** If still failing → Analyze root cause, fix, retry
- **Attempt 3:** If still failing → Deep analysis, fix, final retry
- **After Attempt 3:** STOP and escalate

#### Required Documentation for Each Attempt:
```
Attempt 1:
- Error: [describe error]
- Fix Applied: [describe fix]
- Result: [pass/fail]

Attempt 2:
- Error: [describe error]
- Root Cause Analysis: [detailed analysis]
- Fix Applied: [describe fix]
- Result: [pass/fail]

Attempt 3:
- Error: [describe error]
- Root Cause Analysis: [detailed analysis]
- Fix Applied: [describe fix]
- Result: [pass/fail]

After 3 Attempts:
- Summary: [comprehensive summary]
- Blockers: [list blockers]
- Recommendation: [request human intervention]
```

#### What Constitutes an "Attempt":
- Running tests after making code changes = 1 attempt
- Multiple test runs with same code = still 1 attempt
- Each distinct fix + test run = new attempt

#### Exceptions (Do NOT Count as Attempts):
- Linter/formatting errors (fix immediately, no limit)
- TypeScript compilation errors (fix immediately, no limit)
- Missing import errors (fix immediately, no limit)

**STOP after 3 failed attempts - do not continue fixing.**

---

## PHASE 4: IMPLEMENTATION EXECUTION

### After Completing Phases 1-3:

1. **Implement the feature** following the plan from Phase 1
2. **Write tests** incorporating error pattern prevention strategies
3. **Run tests** and fix errors (respecting 3-attempt limit)
4. **Complete Step 5: Post-Implementation Audit** from `.cursor/rules/01-enforcement.mdc`

---

## PHASE 5: POST-IMPLEMENTATION VERIFICATION

### Step 5: Post-Implementation Audit (MANDATORY)

- [ ] **MUST** audit ALL files touched for code compliance
- [ ] **MUST** verify file paths are correct (monorepo structure)
- [ ] **MUST** verify imports use correct paths (`@verofield/common/*`)
- [ ] **MUST** verify no old naming remains
- [ ] **MUST** verify tenant isolation (if database queries)
- [ ] **MUST** verify date compliance (current system date, not hardcoded)
- [ ] **MUST** verify following established patterns
- [ ] **MUST** verify all error paths have tests
- [ ] **MUST** verify logging meets structured logging policy
- [ ] **MUST** verify no silent failures remain
- [ ] **MUST** verify tests pass (regression + preventative)
- [ ] **MUST** verify bug logged in `.cursor/BUG_LOG.md` (if bug was fixed)
- [ ] **MUST** verify error pattern documented in `docs/error-patterns.md` (if bug was fixed)
- [ ] **MUST** verify anti-pattern logged in `.cursor/anti_patterns.md` (if REWARD_SCORE ≤ 0)

**STOP if any compliance violation found - fix before proceeding.**

---

## HARD STOPS - DO NOT PROCEED IF:

1. ❌ **5-step pipeline not completed** → Complete all steps first
2. ❌ **Error patterns not reviewed** → Review `docs/error-patterns.md` first
3. ❌ **Test retry limit exceeded** → Stop after 3 attempts, escalate
4. ❌ **Rule violations detected** → Fix violations before proceeding
5. ❌ **Security violations** → Fix immediately (tenant isolation, RLS, etc.)
6. ❌ **File path violations** → Use correct monorepo structure
7. ❌ **Date violations** → Use current system date, never hardcode

---

## OUTPUT FORMAT

After completing all phases, provide:

1. **Implementation Summary:**
   - Files created/modified
   - Patterns followed
   - Error patterns reviewed and prevented

2. **Test Summary:**
   - Tests created
   - Error patterns covered
   - Test results (pass/fail with attempt count)

3. **Compliance Verification:**
   - All rules followed
   - All error patterns reviewed
   - Retry limits respected

4. **DRAFT Reward Score** (if no CI score available):
   ```
   REWARD_SCORE: X/10 (source: DRAFT)
   Breakdown:
   - [component]
   ```

---

## QUICK REFERENCE CHECKLIST

**Before Implementation:**
- [ ] 5-step pipeline completed
- [ ] Error patterns reviewed (`docs/error-patterns.md`)
- [ ] Rule compliance verified
- [ ] Implementation plan created

**During Implementation:**
- [ ] Follow established patterns
- [ ] Apply error pattern prevention strategies
- [ ] Respect test retry limits (max 3 attempts)

**After Implementation:**
- [ ] Post-implementation audit completed
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Compliance verified

---

**Last Updated:** 2025-11-23  
**Status:** Active Enforcement  
**Priority:** CRITICAL - Must be followed for every implementation

