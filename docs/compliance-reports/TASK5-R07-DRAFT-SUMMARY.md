# Task 5: R07 (Error Handling) — Draft Summary

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-11-23  
**Rule:** R07 - Error Handling  
**Priority:** HIGH (Tier 2 - OVERRIDE)

---

## What Was Generated

### 1. Step 5 Audit Checklist (22 items)
- **Silent Failure Detection:** 4 checks
- **Error Handling Coverage:** 5 checks
- **Error Logging:** 4 checks
- **Error Categorization:** 3 checks
- **User-Facing Messages:** 4 checks
- **Error Propagation:** 3 checks
- **Error Handling Tests:** 3 checks

### 2. OPA Policy Mapping
- **5 violation patterns + 1 warning:**
  1. Empty catch blocks detected
  2. Swallowed promises detected
  3. Missing awaits detected
  4. Console.log/error instead of structured logging
  5. Unlogged errors (errors thrown without logging)
  6. Warning: Error handling exists but may be incomplete
- **Enforcement level:** OVERRIDE (Tier 2 MAD)
- **Policy file:** `services/opa/policies/error-handling.rego` (NEW)

### 3. Automated Check Script
- **Script:** `.cursor/scripts/check-error-handling.py`
- **Checks:**
  - Detects empty catch blocks (pattern matching)
  - Detects swallowed promises (`.catch(() => {})`)
  - Detects missing awaits (heuristic check)
  - Detects console.log/error (pattern matching)
  - Verifies error logging with structured logger
  - Verifies error categorization (validation, business rule, system)
  - Verifies user-facing messages are safe

### 4. Manual Verification Procedures
- **4-step procedure:**
  1. Review error-prone operations
  2. Verify error handling
  3. Check error logging
  4. Validate error messages
- **4 verification criteria**

### 5. OPA Policy Implementation
- **Full Rego code provided**
- **5 deny rules + 1 warn rule**
- **Pattern matching** (regex-based detection)

### 6. Test Cases
- **12 test cases specified:**
  1. Happy path (proper error handling with logging)
  2. Happy path (error categorization correct)
  3. Happy path (user-friendly error messages)
  4. Violation (empty catch block)
  5. Violation (swallowed promise)
  6. Violation (missing await)
  7. Violation (console.log instead of structured logging)
  8. Violation (unlogged error)
  9. Warning (error handling exists but incomplete)
  10. Override (with marker)
  11. Edge case (multiple error-prone operations)
  12. Edge case (nested try/catch)

---

## Review Needed

### Question 1: Empty Catch Block Detection
**Context:** How should the script detect empty catch blocks?

**Options:**
- A) Pattern matching (regex: `catch\s*\([^)]*\)\s*\{[^}]*\}` - check if body is empty/whitespace only)
- B) AST parsing (parse TypeScript, find catch blocks, verify body has statements)
- C) Combination: Pattern matching + AST verification for accuracy
- D) Use existing utility (`apps/api/src/common/utils/error-pattern-detector.util.ts`)

**Recommendation:** Option D - Use existing utility. The codebase already has `error-pattern-detector.util.ts` with `detectEmptyCatchBlocks()` function. Reuse this utility in the Python script or call it from TypeScript. This ensures consistency and leverages existing, tested code.

**Rationale:** Don't reinvent the wheel. The existing utility already handles:
- Empty catch blocks
- Catch blocks with only comments
- Proper line number detection
- Actionable suggestions

Script can call this utility or replicate its logic in Python.

---

### Question 2: Missing Await Detection
**Context:** How should the script detect missing awaits?

**Options:**
- A) Pattern matching (heuristic: async function + promise-returning call without await)
- B) AST parsing (parse TypeScript, find async functions, verify all promises are awaited)
- C) TypeScript compiler (use tsc to detect unhandled promise rejections)
- D) Combination: Pattern matching for common cases, AST for accuracy

**Recommendation:** Option D - Combination approach. Use pattern matching for common promise-returning functions (fetch, axios, prisma, etc.) as a fast check, then AST parsing for accuracy. This balances performance with correctness.

**Rationale:** Missing await detection is complex:
- Need to identify promise-returning functions
- Need to verify they're in async context
- Need to verify they're not intentionally fire-and-forget
- AST parsing is accurate but slower
- Pattern matching is fast but can have false positives

Combination gives best of both worlds.

---

### Question 3: Error Logging Verification
**Context:** Should R07 verify error logging exists, or is that R08 (Structured Logging)?

**Options:**
- A) Yes, R07 should verify error logging exists (error handling requirement)
- B) No, error logging is R08's responsibility (logging concern)
- C) Yes, but only verify logging exists (not format) - R08 verifies format
- D) Check in R07, but defer to R08 for full logging requirements

**Recommendation:** Option C - R07 verifies error logging exists, R08 verifies structured logging format. R07 ensures errors are logged (not silent), R08 ensures logs are structured (format, traceId, etc.).

**Rationale:** Clear separation of concerns:
- **R07 (Error Handling):** Ensures errors are logged (not silent)
- **R08 (Structured Logging):** Ensures logs are structured (format, traceId, context)

R07 checks: "Is there a logger.error() call?"
R08 checks: "Does logger.error() include traceId, context, structured format?"

---

### Question 4: Error Categorization Detection
**Context:** How should the script verify error categorization?

**Options:**
- A) Pattern matching (check for BadRequestException, UnprocessableEntityException, InternalServerErrorException)
- B) AST parsing (parse error handling logic, verify error types map to HTTP status codes)
- C) Heuristic check (verify error handling includes if/else for different error types)
- D) Not R07's responsibility (handled by tests or manual review)

**Recommendation:** Option A - Pattern matching for common error types. R07 should verify error categorization exists (not perfect categorization). Perfect categorization requires domain knowledge and is better handled by tests.

**Rationale:** Error categorization is important but complex:
- Different projects use different error types
- Categorization logic can be complex (nested if/else, switch statements)
- Perfect verification requires domain knowledge

R07 should verify:
- Errors are categorized (not all 500s)
- Common error types are used (BadRequestException, etc.)
- Error handling includes categorization logic

Perfect categorization verification belongs in tests.

---

### Question 5: User-Facing Message Safety
**Context:** How should the script verify user-facing messages are safe?

**Options:**
- A) Pattern matching (check for stack traces, internal IDs, secrets in error messages)
- B) Heuristic check (verify error messages don't contain common leak patterns)
- C) Not R07's responsibility (handled by security review or tests)
- D) Warning only (flag potential leaks, don't fail)

**Recommendation:** Option B - Heuristic check with warnings. R07 should check for common leak patterns (stack traces, internal IDs, file paths) but flag as warnings, not errors. Perfect verification requires security review.

**Rationale:** User-facing message safety is important but:
- Perfect detection requires understanding context
- Some patterns are false positives (e.g., "User ID: 123" in user-facing message is OK)
- Security review is better for comprehensive verification

R07 should:
- Check for obvious leaks (stack traces, file paths, secrets)
- Flag as warnings (not errors)
- Provide suggestions for safe messages

---

## Estimated Implementation Time

| Task | Estimated Time |
|------|----------------|
| OPA Policy Implementation | 35 minutes |
| Automated Script Implementation | 60 minutes |
| Test Cases Implementation | 30 minutes |
| Documentation Updates | 15 minutes |
| **Total** | **2.5 hours** |

**Note:** Script can leverage existing `error-pattern-detector.util.ts` utility, reducing complexity. Focus on:
- Pattern matching for common violations
- Integration with existing utility
- Error logging verification
- Error categorization checks

---

## Files to Create/Modify

### To Create
1. `services/opa/policies/error-handling.rego` — OPA policy (NEW)
2. `services/opa/tests/error_handling_r07_test.rego` — Test cases
3. `.cursor/scripts/check-error-handling.py` — Automated check script
4. `docs/testing/error-handling-testing-guide.md` — Error handling testing guide (NEW)

### To Modify
1. `.cursor/rules/06-error-resilience.mdc` — Add Step 5 section for R07
2. `apps/api/src/common/utils/error-pattern-detector.util.ts` — May need updates (if script uses it)

---

## Key Characteristics of R07

### Scope
- **Silent failure elimination:** No empty catch blocks, swallowed promises, missing awaits
- **Error handling coverage:** All error-prone operations have error handling
- **Error logging:** All errors logged with structured logging
- **Error categorization:** Errors categorized (validation, business rule, system)
- **User-facing messages:** Safe, helpful error messages

### Tier 2 (OVERRIDE) vs Tier 1 (BLOCK)
- **Tier 1 (R01-R03):** BLOCK - Cannot proceed without fix
- **Tier 2 (R07):** OVERRIDE - Can proceed with justification
- **Rationale:** Error handling issues can be fixed incrementally, but should be flagged

### Different from R04-R06
- **R04-R06:** Data integrity rules (synchronization, state machines, breaking changes)
- **R07:** Error resilience rule (error handling, silent failures)
- **Complexity:** Medium (pattern matching, existing utility available)

---

## Verification Checklist

Before moving to R08, verify:

- [ ] Step 5 audit checklist is comprehensive (22 items)
- [ ] OPA policy patterns are correct (5 patterns + 1 warning)
- [ ] Automated script specification is clear
- [ ] Manual procedures are actionable (4-step process)
- [ ] Test cases cover all scenarios (12 tests)
- [ ] Review questions are answered
- [ ] Implementation time is reasonable (2.5 hours)
- [ ] Leverages existing utility (error-pattern-detector.util.ts)

---

## Next Steps

### Option A: Approve and Implement
1. Review draft procedures
2. Answer review questions
3. Approve for implementation
4. Implement OPA policy
5. Implement automated script
6. Add test cases
7. Update documentation
8. **Move to R08 (Structured Logging)**

### Option B: Request Changes
1. Provide feedback on draft
2. Request specific changes
3. AI revises draft
4. Re-review
5. Approve or iterate

### Option C: Batch Review
1. Generate drafts for R08-R09 (related rules)
2. Review R07-R09 together
3. Implement as batch
4. More efficient for related rules

---

## Recommendation

**Proceed with Option A** - R07 is critical for error resilience. After R07:
- **Silent failures eliminated** (empty catch blocks, swallowed promises detected)
- **Error handling enforced** (all error-prone operations have error handling)
- **Error logging verified** (errors logged with structured logging)
- **Error categorization verified** (errors categorized correctly)
- **User-facing messages verified** (safe, helpful messages)

**Answers to Review Questions:**
- Q1: Option D (Use existing utility - error-pattern-detector.util.ts)
- Q2: Option D (Pattern matching + AST parsing combination)
- Q3: Option C (R07 verifies logging exists, R08 verifies format)
- Q4: Option A (Pattern matching for common error types)
- Q5: Option B (Heuristic check with warnings)

**Rationale:** R07 focuses on error handling (not silent failures), R08 focuses on logging format. Clear separation of concerns. Leverage existing utility for consistency.

---

## Draft Location

**Full Draft:** `.cursor/rules/06-error-resilience-R07-DRAFT.md`

**Review Instructions:**
1. Read the full draft
2. Answer the 5 review questions
3. Approve or request changes
4. AI will implement approved procedures

---

## Error-Prone Operations

Based on existing documentation, error-prone operations include:

### External I/O Operations
- API calls (HTTP requests)
- Database queries
- File system operations
- Network requests

### Async/Await Operations
- Promise chains
- Async function calls
- Event handlers
- Callbacks

### User Input Handling
- Form submissions
- URL parameters
- Request bodies
- Query strings

### Data Parsing and Transformations
- JSON parsing
- Date parsing
- Type conversions
- Schema validation

### Cross-Service Interactions
- Microservice calls
- Message queue operations
- Service discovery
- Load balancing

### Authentication/Authorization Flows
- Token validation
- Permission checks
- Session management
- Role verification

### Caching Layers
- Cache reads/writes
- Cache invalidation
- Cache failures

### Event Emitters & Message Queues
- Event publishing
- Message consumption
- Queue operations

### Concurrency-Sensitive Code
- Race conditions
- Lock acquisition
- Transaction handling
- Parallel operations

---

**Status:** AWAITING YOUR REVIEW  
**Prepared By:** AI Assistant  
**Date:** 2025-11-23  
**Estimated Review Time:** 15-20 minutes

---

## Progress Update (After R07 Draft)

### Task 5 Status

| Rule | Status | Time | Notes |
|------|--------|------|-------|
| ✅ R01: Tenant Isolation | COMPLETE | 2.25h | Tier 1 |
| ✅ R02: RLS Enforcement | COMPLETE | 2.25h | Tier 1 |
| ✅ R03: Architecture Boundaries | COMPLETE | 2.08h | Tier 1 |
| ✅ R04: Layer Synchronization | COMPLETE | 2.58h | Tier 2 |
| ✅ R05: State Machine Enforcement | COMPLETE | 3.08h | Tier 2 |
| ✅ R06: Breaking Change Documentation | COMPLETE | 2h | Tier 2 |
| ⏸️ R07: Error Handling | DRAFT | 2.5h | Tier 2 |
| ⏸️ R08-R13 (Tier 2) | PENDING | 2.5h | Remaining Tier 2 |
| ⏸️ R14-R25 (Tier 3) | PENDING | 15h | Tier 3 |

**Progress:** 6/25 rules complete (24%), 1/25 in review (4%)  
**Time Spent:** 14.24 hours  
**Time Estimated (if R07 approved):** 16.74 hours  
**Remaining:** 18 rules, ~14.76 hours

**Tier 1:** 100% complete ✅  
**Tier 2:** 30% complete (3/10), 10% in review (1/10)

---

## Tier 2 Characteristics

**Tier 2 Rules (OVERRIDE):**
- Important but not blocking
- Can proceed with justification
- Flagged for review
- Fixable in follow-up PRs

**R07 Focus:**
- Silent failure elimination
- Error handling coverage
- Error logging verification
- Error categorization
- User-facing message safety

This provides strong foundation for error resilience.



