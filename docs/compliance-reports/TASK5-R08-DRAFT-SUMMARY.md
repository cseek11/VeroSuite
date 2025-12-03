# Task 5: R08 (Structured Logging) — Draft Summary

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-11-23  
**Rule:** R08 - Structured Logging  
**Priority:** HIGH (Tier 2 - OVERRIDE)

---

## What Was Generated

### 1. Step 5 Audit Checklist (28 items)
- **Structured Logging Format:** 3 checks
- **Required Fields Verification:** 7 checks
- **Optional Fields Verification:** 5 checks
- **Console.log Detection:** 5 checks
- **Logger Utility Usage:** 3 checks
- **Trace ID Propagation:** 5 checks
- **Logging Coverage:** 3 checks

### 2. OPA Policy Mapping
- **5 violation patterns + 1 warning:**
  1. Console.log/error/warn/info/debug in production code
  2. Unstructured free-text logging (not JSON-like)
  3. Missing required fields (level, message, timestamp, traceId, context, operation, severity)
  4. Missing traceId in logs
  5. Missing context or operation fields
  6. Warning: Logging exists but may be incomplete
- **Enforcement level:** OVERRIDE (Tier 2 MAD)
- **Policy file:** `services/opa/policies/observability.rego` (R08 section)

### 3. Automated Check Script
- **Script:** `.cursor/scripts/check-structured-logging.py`
- **Checks:**
  - Detects console.log/error/warn/info/debug (pattern matching)
  - Verifies structured logger usage (StructuredLoggerService, Logger)
  - Verifies required fields (level, message, timestamp, traceId, context, operation, severity)
  - Verifies optional fields (tenantId, userId, errorCode, rootCause)
  - Verifies traceId propagation
  - Verifies logging coverage

### 4. Manual Verification Procedures
- **4-step procedure:**
  1. Review logging calls
  2. Verify structured format
  3. Check trace ID
  4. Validate logger usage
- **4 verification criteria**

### 5. OPA Policy Implementation
- **Full Rego code provided**
- **5 deny rules + 1 warn rule**
- **Pattern matching** (regex-based detection)

### 6. Test Cases
- **12 test cases specified:**
  1. Happy path (proper structured logging with all required fields)
  2. Happy path (traceId propagation)
  3. Happy path (optional fields included)
  4. Violation (console.log instead of structured logger)
  5. Violation (unstructured free-text logging)
  6. Violation (missing required fields)
  7. Violation (missing traceId)
  8. Violation (missing context or operation)
  9. Warning (logging exists but incomplete)
  10. Override (with marker)
  11. Edge case (multiple logging calls)
  12. Edge case (nested service calls with traceId)

---

## Review Needed

### Question 1: Required Fields Detection
**Context:** How should the script verify required fields are present?

**Options:**
- A) Pattern matching (check logger call signature for required parameters)
- B) AST parsing (parse logger calls, verify parameters match required fields)
- C) Type checking (verify logger method signature matches required fields)
- D) Combination: Pattern matching + AST verification for accuracy

**Recommendation:** Option D - Combination approach. Use pattern matching to quickly identify logger calls, then AST parsing to verify parameters match required fields. This balances performance with accuracy.

**Rationale:** Required fields verification requires:
- Identifying logger calls (pattern matching is fast)
- Verifying parameters match required fields (AST parsing is accurate)
- Handling different logger signatures (StructuredLoggerService vs Logger)
- Handling optional parameters (some fields may be in additionalData)

Combination gives best of both worlds.

---

### Question 2: Trace ID Propagation Detection
**Context:** How should the script verify traceId propagates correctly?

**Options:**
- A) Pattern matching (check for traceId parameter in logger calls and service calls)
- B) AST parsing (trace data flow from request → logger → downstream services)
- C) Heuristic check (verify traceId appears in logger calls and service method signatures)
- D) Not R08's responsibility (handled by R09 - Trace Propagation)

**Recommendation:** Option C - Heuristic check. R08 should verify traceId is present in logs, R09 should verify traceId propagates across service boundaries. Clear separation of concerns.

**Rationale:** Trace ID propagation has two aspects:
- **R08 (Structured Logging):** Ensures traceId is present in logs
- **R09 (Trace Propagation):** Ensures traceId propagates across service boundaries

R08 should check:
- traceId is passed to logger calls
- traceId is included in log entries
- traceId is available from request context

R09 should check:
- traceId propagates to downstream services
- traceId propagates to external calls
- traceId propagates to database queries

---

### Question 3: Console.log Detection Scope
**Context:** Should R08 flag ALL console.log calls, or only in production code?

**Options:**
- A) Flag all console.log calls (strict enforcement)
- B) Flag only console.log in production code (allow in test/dev files)
- C) Flag console.log except in test files and scripts
- D) Warning only (don't fail, but suggest structured logging)

**Recommendation:** Option C - Flag console.log except in test files and scripts. Production code should use structured logging, but test files and scripts may use console.log for debugging.

**Rationale:** Console.log detection should be context-aware:
- **Production code:** Must use structured logging (flag as violation)
- **Test files:** May use console.log for debugging (allow)
- **Scripts:** May use console.log for output (allow)
- **Development-only code:** May use console.log temporarily (warning)

This provides practical enforcement without being overly strict.

---

### Question 4: Structured Format Verification
**Context:** How should the script verify logs are structured (JSON-like)?

**Options:**
- A) Pattern matching (check logger call uses structured logger, not free-text)
- B) AST parsing (verify logger call parameters match structured format)
- C) Runtime verification (check log output is JSON)
- D) Not R08's responsibility (handled by logger implementation)

**Recommendation:** Option A - Pattern matching. R08 should verify structured logger is used (not console.log or free-text logging). The logger implementation ensures JSON format.

**Rationale:** Structured format verification has two levels:
- **R08 (Structured Logging):** Ensures structured logger is used (not console.log)
- **Logger Implementation:** Ensures logs are JSON format (handled by StructuredLoggerService)

R08 should check:
- Structured logger is used (StructuredLoggerService, Logger)
- Required fields are provided (message, context, operation, etc.)
- Logger call matches required signature

Logger implementation ensures:
- Logs are JSON format
- Timestamp is ISO 8601
- Fields are properly structured

---

### Question 5: Optional Fields Verification
**Context:** Should R08 verify optional fields (tenantId, userId, errorCode, rootCause)?

**Options:**
- A) Yes, verify all optional fields are included when applicable
- B) No, optional fields are optional (only verify required fields)
- C) Warning only (suggest including optional fields when applicable)
- D) Verify only errorCode/rootCause for error logs (not tenantId/userId)

**Recommendation:** Option C - Warning only. Optional fields should be suggested when applicable, but not required. This provides guidance without being overly strict.

**Rationale:** Optional fields are context-dependent:
- **tenantId:** Required for multi-tenant operations (but not all operations are tenant-scoped)
- **userId:** Required for user-scoped operations (but not all operations are user-scoped)
- **errorCode/rootCause:** Required for error logs (but not all logs are errors)

R08 should:
- Verify required fields are present (always)
- Warn when optional fields are missing but applicable (guidance)
- Not fail for missing optional fields (they're optional)

---

## Estimated Implementation Time

| Task | Estimated Time |
|------|----------------|
| OPA Policy Implementation | 35 minutes |
| Automated Script Implementation | 60 minutes |
| Test Cases Implementation | 30 minutes |
| Documentation Updates | 15 minutes |
| **Total** | **2.5 hours** |

**Note:** Script can leverage existing logger implementations (`StructuredLoggerService`, `Logger`), reducing complexity. Focus on:
- Pattern matching for console.log detection
- AST parsing for required fields verification
- Heuristic check for traceId presence
- Warning for optional fields

---

## Files to Create/Modify

### To Create
1. `services/opa/policies/observability.rego` — OPA policy (R08 section) (NEW or UPDATE)
2. `services/opa/tests/observability_r08_test.rego` — Test cases
3. `.cursor/scripts/check-structured-logging.py` — Automated check script
4. `docs/testing/structured-logging-testing-guide.md` — Structured logging testing guide (NEW)

### To Modify
1. `.cursor/rules/07-observability.mdc` — Add Step 5 section for R08
2. `apps/api/src/common/services/logger.service.ts` — May need updates (if script uses it)
3. `frontend/src/lib/logger.ts` — May need updates (if script uses it)

---

## Key Characteristics of R08

### Scope
- **Structured logging format:** JSON-like format with required fields
- **Required fields:** level, message, timestamp, traceId, context, operation, severity
- **Optional fields:** tenantId, userId, errorCode, rootCause, additionalData
- **Console.log elimination:** No console.log in production code
- **Trace ID presence:** traceId must be present in logs

### Tier 2 (OVERRIDE) vs Tier 1 (BLOCK)
- **Tier 1 (R01-R03):** BLOCK - Cannot proceed without fix
- **Tier 2 (R08):** OVERRIDE - Can proceed with justification
- **Rationale:** Logging format issues can be fixed incrementally, but should be flagged

### Different from R07
- **R07 (Error Handling):** Ensures errors are logged (not silent)
- **R08 (Structured Logging):** Ensures logs are structured (format, traceId, context)
- **Complementary:** R07 verifies logging exists, R08 verifies logging format

### Relationship to R09
- **R08 (Structured Logging):** Ensures traceId is present in logs
- **R09 (Trace Propagation):** Ensures traceId propagates across service boundaries
- **Complementary:** R08 verifies traceId presence, R09 verifies traceId propagation

---

## Verification Checklist

Before moving to R09, verify:

- [ ] Step 5 audit checklist is comprehensive (28 items)
- [ ] OPA policy patterns are correct (5 patterns + 1 warning)
- [ ] Automated script specification is clear
- [ ] Manual procedures are actionable (4-step process)
- [ ] Test cases cover all scenarios (12 tests)
- [ ] Review questions are answered
- [ ] Implementation time is reasonable (2.5 hours)
- [ ] Leverages existing logger implementations

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
8. **Move to R09 (Trace Propagation)**

### Option B: Request Changes
1. Provide feedback on draft
2. Request specific changes
3. AI revises draft
4. Re-review
5. Approve or iterate

### Option C: Batch Review
1. Generate drafts for R09-R10 (related rules)
2. Review R08-R10 together
3. Implement as batch
4. More efficient for related rules

---

## Recommendation

**Proceed with Option A** - R08 is critical for observability. After R08:
- **Structured logging enforced** (JSON-like format with required fields)
- **Console.log eliminated** (production code uses structured logger)
- **Trace ID presence verified** (traceId included in logs)
- **Required fields verified** (level, message, timestamp, traceId, context, operation, severity)
- **Optional fields suggested** (tenantId, userId, errorCode, rootCause when applicable)

**Answers to Review Questions:**
- Q1: Option D (Pattern matching + AST parsing combination)
- Q2: Option C (Heuristic check - R08 verifies presence, R09 verifies propagation)
- Q3: Option C (Flag console.log except in test files and scripts)
- Q4: Option A (Pattern matching - verify structured logger is used)
- Q5: Option C (Warning only - suggest optional fields when applicable)

**Rationale:** R08 focuses on structured logging format (not trace propagation). Clear separation from R09. Leverage existing logger implementations for consistency.

---

## Draft Location

**Full Draft:** `.cursor/rules/07-observability-R08-DRAFT.md`

**Review Instructions:**
1. Read the full draft
2. Answer the 5 review questions
3. Approve or request changes
4. AI will implement approved procedures

---

## Structured Logging Requirements

Based on existing documentation, structured logging requires:

### Required Fields
- `level` - Log level (log, error, warn, debug, verbose)
- `message` - Human-readable log message
- `timestamp` - ISO 8601 timestamp (automatically added)
- `traceId` - Distributed trace identifier
- `context` - Context identifier (service, module, component name)
- `operation` - Operation name (function, endpoint, action)
- `severity` - Log level (info, warn, error, debug, verbose)

### Optional Fields
- `tenantId` - Tenant identifier (when applicable)
- `userId` - User identifier (when applicable)
- `errorCode` - Error classification code (for error logs)
- `rootCause` - Root cause description (for error logs)
- `additionalData` - Additional structured data (extra context)

### Logger Implementations
- **Backend:** `StructuredLoggerService` (`apps/api/src/common/services/logger.service.ts`)
- **Frontend:** `Logger` (`frontend/src/lib/logger.ts`)

---

**Status:** AWAITING YOUR REVIEW  
**Prepared By:** AI Assistant  
**Date:** 2025-11-23  
**Estimated Review Time:** 15-20 minutes

---

## Progress Update (After R08 Draft)

### Task 5 Status

| Rule | Status | Time | Notes |
|------|--------|------|-------|
| ✅ R01: Tenant Isolation | COMPLETE | 2.25h | Tier 1 |
| ✅ R02: RLS Enforcement | COMPLETE | 2.25h | Tier 1 |
| ✅ R03: Architecture Boundaries | COMPLETE | 2.08h | Tier 1 |
| ✅ R04: Layer Synchronization | COMPLETE | 2.58h | Tier 2 |
| ✅ R05: State Machine Enforcement | COMPLETE | 3.08h | Tier 2 |
| ✅ R06: Breaking Change Documentation | COMPLETE | 2h | Tier 2 |
| ✅ R07: Error Handling | COMPLETE | 2.5h | Tier 2 |
| ⏸️ R08: Structured Logging | DRAFT | 2.5h | Tier 2 |
| ⏸️ R09-R13 (Tier 2) | PENDING | ~12.5h | Remaining Tier 2 |
| ⏸️ R14-R25 (Tier 3) | PENDING | ~12h | Tier 3 |

**Progress:** 7/25 rules complete (28%), 1/25 in review (4%)  
**Time Spent:** 16.74 hours  
**Time Estimated (if R08 approved):** 19.24 hours  
**Remaining:** 17 rules, ~12.26 hours

**Tier 1:** 100% complete ✅  
**Tier 2:** 40% complete (4/10), 10% in review (1/10)

---

## Tier 2 Characteristics

**Tier 2 Rules (OVERRIDE):**
- Important but not blocking
- Can proceed with justification
- Flagged for review
- Fixable in follow-up PRs

**R08 Focus:**
- Structured logging format enforcement
- Console.log elimination
- Trace ID presence verification
- Required fields verification
- Optional fields guidance

This provides strong foundation for observability.





