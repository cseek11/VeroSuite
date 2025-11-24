# Task 5: R09 (Trace Propagation) — Draft Summary

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-11-23  
**Rule:** R09 - Trace Propagation  
**Priority:** HIGH (Tier 2 - OVERRIDE)

---

## What Was Generated

### 1. Step 5 Audit Checklist (32 items)
- **HTTP Header Propagation:** 4 checks
- **Service-to-Service Propagation:** 4 checks
- **Database Layer Propagation:** 4 checks
- **External Service Propagation:** 4 checks
- **Message Queue Propagation:** 4 checks
- **Frontend-Backend Propagation:** 4 checks
- **Trace Context Management:** 4 checks

### 2. OPA Policy Mapping
- **5 violation patterns + 1 warning:**
  1. Missing traceId in HTTP headers (outgoing calls)
  2. Missing traceId in service method calls
  3. Missing traceId in database query context
  4. Missing traceId in external API calls
  5. Missing traceId in message queue messages
  6. Warning: Trace propagation exists but may be incomplete
- **Enforcement level:** OVERRIDE (Tier 2 MAD)
- **Policy file:** `services/opa/policies/observability.rego` (R09 section)

### 3. Automated Check Script
- **Script:** `.cursor/scripts/check-trace-propagation.py`
- **Checks:**
  - Detects HTTP calls without traceId headers (pattern matching)
  - Verifies service calls include traceId parameter (AST parsing)
  - Verifies database queries include traceId context (pattern matching)
  - Verifies external API calls include traceId headers (pattern matching)
  - Verifies message queue messages include traceId (pattern matching)
  - Verifies trace context utilities are used (pattern matching)

### 4. Manual Verification Procedures
- **4-step procedure:**
  1. Review service boundaries
  2. Verify HTTP propagation
  3. Check database propagation
  4. Validate external calls
- **4 verification criteria**

### 5. OPA Policy Implementation
- **Full Rego code provided**
- **5 deny rules + 1 warn rule**
- **Pattern matching** (regex-based detection)

### 6. Test Cases
- **12 test cases specified:**
  1. Happy path (proper HTTP header propagation)
  2. Happy path (proper service-to-service propagation)
  3. Happy path (proper database propagation)
  4. Violation (missing traceId in HTTP headers)
  5. Violation (missing traceId in service calls)
  6. Violation (missing traceId in database queries)
  7. Violation (missing traceId in external API calls)
  8. Violation (missing traceId in message queues)
  9. Warning (trace propagation exists but incomplete)
  10. Override (with marker)
  11. Edge case (multiple service calls)
  12. Edge case (nested HTTP calls)

---

## Review Needed

### Question 1: HTTP Header Detection
**Context:** How should the script detect missing traceId in HTTP headers?

**Options:**
- A) Pattern matching (check fetch/axios calls for x-trace-id header)
- B) AST parsing (parse HTTP call AST, verify headers object includes traceId)
- C) Combination: Pattern matching + AST verification for accuracy
- D) Use existing utility (trace-propagation.util.ts)

**Recommendation:** Option C - Combination approach. Use pattern matching to quickly identify HTTP calls, then AST parsing to verify headers include traceId. Leverage existing utilities when available.

**Rationale:** HTTP header detection requires:
- Identifying HTTP calls (fetch, axios, etc.) - pattern matching is fast
- Verifying headers object includes traceId - AST parsing is accurate
- Handling different HTTP client libraries - pattern matching catches all
- Leveraging existing utilities - consistency with codebase

---

### Question 2: Service Call Detection
**Context:** How should the script detect missing traceId in service method calls?

**Options:**
- A) Pattern matching (check service.method() calls for traceId parameter)
- B) AST parsing (parse method calls, verify traceId parameter present)
- C) Heuristic check (verify service calls include traceId as first parameter)
- D) Not R09's responsibility (handled by code review)

**Recommendation:** Option B - AST parsing. Service method calls require accurate parameter verification. Pattern matching can identify calls, but AST parsing verifies traceId is actually passed.

**Rationale:** Service call detection is complex:
- Different service call patterns (this.service.method(), service.method(), etc.)
- TraceId may be first parameter, last parameter, or in options object
- Need to verify traceId is actually passed (not just method signature)
- AST parsing provides accurate verification

---

### Question 3: Database Propagation Detection
**Context:** How should the script verify traceId propagates to database layer?

**Options:**
- A) Pattern matching (check for SET LOCAL app.trace_id or Prisma context)
- B) AST parsing (parse database queries, verify traceId in context)
- C) Heuristic check (verify database operations use trace context wrapper)
- D) Not R09's responsibility (handled by R02 - RLS Enforcement)

**Recommendation:** Option C - Heuristic check. Verify database operations use trace context wrapper (withTenant, withTrace, etc.). R02 handles RLS, R09 handles trace propagation.

**Rationale:** Database propagation has two aspects:
- **R02 (RLS Enforcement):** Ensures tenant isolation (app.tenant_id)
- **R09 (Trace Propagation):** Ensures trace context (app.trace_id)

R09 should verify:
- Database operations use trace context wrapper
- TraceId is set in database context
- Prisma queries include traceId in context

---

### Question 4: External API Detection
**Context:** How should the script detect external API calls missing traceId?

**Options:**
- A) Pattern matching (check fetch/axios calls to external domains)
- B) AST parsing (parse HTTP calls, verify external domain + traceId header)
- C) Heuristic check (verify external API calls use trace propagation utilities)
- D) Not R09's responsibility (external APIs may not support trace headers)

**Recommendation:** Option C - Heuristic check. Verify external API calls use trace propagation utilities (addTraceContextToHeaders). Some external APIs may not support trace headers, but we should still attempt propagation.

**Rationale:** External API detection requires:
- Identifying external API calls (different domains, not internal services)
- Verifying trace propagation utilities are used
- Handling APIs that don't support trace headers (warnings, not errors)
- Providing guidance for trace propagation

---

### Question 5: Message Queue Detection
**Context:** How should the script verify traceId propagates to message queues?

**Options:**
- A) Pattern matching (check message queue publish calls for traceId in headers)
- B) AST parsing (parse message queue calls, verify traceId in message headers)
- C) Heuristic check (verify message queue utilities include traceId)
- D) Not R09's responsibility (message queues handled separately)

**Recommendation:** Option B - AST parsing. Message queue messages have structured headers. AST parsing can verify traceId is included in message headers accurately.

**Rationale:** Message queue detection requires:
- Identifying message queue publish calls (RabbitMQ, Kafka, etc.)
- Verifying traceId in message headers (structured format)
- Handling different message queue libraries
- AST parsing provides accurate header verification

---

## Estimated Implementation Time

| Task | Estimated Time |
|------|----------------|
| OPA Policy Implementation | 40 minutes |
| Automated Script Implementation | 70 minutes |
| Test Cases Implementation | 35 minutes |
| Documentation Updates | 15 minutes |
| **Total** | **2.5 hours** |

**Note:** Script requires AST parsing for accurate detection, increasing complexity. Leverage existing trace propagation utilities for consistency.

---

## Files to Create/Modify

### To Create
1. `services/opa/policies/observability.rego` — OPA policy (R09 section) (UPDATE)
2. `services/opa/tests/observability_r09_test.rego` — Test cases
3. `.cursor/scripts/check-trace-propagation.py` — Automated check script
4. `docs/testing/trace-propagation-testing-guide.md` — Trace propagation testing guide (NEW)

### To Modify
1. `.cursor/rules/07-observability.mdc` — Add Step 5 section for R09
2. `apps/api/src/common/utils/trace-propagation.util.ts` — May need updates (if script uses it)
3. `frontend/src/lib/trace-propagation.ts` — May need updates (if script uses it)

---

## Key Characteristics of R09

### Scope
- **HTTP header propagation:** traceId in x-trace-id, x-span-id, x-request-id headers
- **Service-to-service propagation:** traceId passed to downstream services
- **Database propagation:** traceId in database query context
- **External API propagation:** traceId in external API call headers
- **Message queue propagation:** traceId in message headers
- **Frontend-backend propagation:** traceId across API boundaries

### Tier 2 (OVERRIDE) vs Tier 1 (BLOCK)
- **Tier 1 (R01-R03):** BLOCK - Cannot proceed without fix
- **Tier 2 (R09):** OVERRIDE - Can proceed with justification
- **Rationale:** Trace propagation issues can be fixed incrementally, but should be flagged

### Completes Observability Trilogy
- **R07 (Error Handling):** Ensures errors are logged ✅
- **R08 (Structured Logging):** Ensures logs are structured ✅
- **R09 (Trace Propagation):** Ensures traces propagate (THIS RULE)
- **Together:** Comprehensive observability coverage

### Relationship to R08
- **R08 (Structured Logging):** Ensures traceId is present in logs
- **R09 (Trace Propagation):** Ensures traceId propagates across boundaries
- **Clear separation:** Presence (R08) vs Propagation (R09)

---

## Verification Checklist

Before moving to R10, verify:

- [ ] Step 5 audit checklist is comprehensive (32 items)
- [ ] OPA policy patterns are correct (5 patterns + 1 warning)
- [ ] Automated script specification is clear
- [ ] Manual procedures are actionable (4-step process)
- [ ] Test cases cover all scenarios (12 tests)
- [ ] Review questions are answered
- [ ] Implementation time is reasonable (2.5 hours)
- [ ] Leverages existing trace propagation utilities

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
8. **Move to R10 (Testing Coverage)**

### Option B: Request Changes
1. Provide feedback on draft
2. Request specific changes
3. AI revises draft
4. Re-review
5. Approve or iterate

---

## Recommendation

**Proceed with Option A** - R09 completes the observability trilogy. After R09:
- **HTTP header propagation enforced** (traceId in x-trace-id headers)
- **Service-to-service propagation enforced** (traceId passed to downstream services)
- **Database propagation enforced** (traceId in query context)
- **External API propagation enforced** (traceId in external call headers)
- **Message queue propagation enforced** (traceId in message headers)
- **Frontend-backend propagation enforced** (traceId across API boundaries)

**Answers to Review Questions:**
- Q1: Option C (Pattern matching + AST verification combination)
- Q2: Option B (AST parsing for accurate parameter verification)
- Q3: Option C (Heuristic check - verify trace context wrapper usage)
- Q4: Option C (Heuristic check - verify trace propagation utilities)
- Q5: Option B (AST parsing for accurate header verification)

**Rationale:** R09 focuses on trace propagation across boundaries (not just presence). AST parsing provides accuracy for complex patterns. Leverage existing utilities for consistency.

---

## Draft Location

**Full Draft:** `.cursor/rules/07-observability-R09-DRAFT.md`

**Review Instructions:**
1. Read the full draft
2. Answer the 5 review questions
3. Approve or request changes
4. AI will implement approved procedures

---

## Trace Propagation Requirements

Based on existing documentation, trace propagation requires:

### HTTP Headers
- `x-trace-id` - Distributed trace identifier
- `x-span-id` - Span identifier within trace
- `x-request-id` - Request identifier

### Propagation Points
- Service-to-service calls
- HTTP client calls (fetch, axios)
- Database queries (Prisma, raw SQL)
- External API calls
- Message queues (RabbitMQ, Kafka)
- Frontend-backend API calls

### Utilities
- **Backend:** `trace-propagation.util.ts` (`apps/api/src/common/utils/trace-propagation.util.ts`)
- **Frontend:** `trace-propagation.ts` (`frontend/src/lib/trace-propagation.ts`)

---

**Status:** AWAITING YOUR REVIEW  
**Prepared By:** AI Assistant  
**Date:** 2025-11-23  
**Estimated Review Time:** 15-20 minutes

---

## Progress Update (After R09 Draft)

### Task 5 Status

| Rule | Status | Time | Notes |
|------|--------|------|-------|
| ✅ R01-R03 | COMPLETE | 6.58h | Tier 1 (100%) |
| ✅ R04-R08 | COMPLETE | 12.66h | Tier 2 (50%) |
| ⏸️ R09: Trace Propagation | DRAFT | 2.5h | Tier 2 |
| ⏸️ R10-R13 (Tier 2) | PENDING | ~10h | Remaining Tier 2 |
| ⏸️ R14-R25 (Tier 3) | PENDING | ~12h | Tier 3 |

**Progress:** 8/25 rules complete (32%), 1/25 in review (4%)  
**Time Spent:** 19.24 hours  
**Time Estimated (if R09 approved):** 21.74 hours  
**Remaining:** 16 rules, ~9.76 hours

**Tier 1:** 100% complete ✅  
**Tier 2:** 50% complete (5/10), 10% in review (1/10)

---

## Observability Trilogy (2/3 Complete)

**R07 (Error Handling):** Ensures errors are logged ✅  
**R08 (Structured Logging):** Ensures logs are structured ✅  
**R09 (Trace Propagation):** Ensures traces propagate (DRAFT)

Together they provide comprehensive observability:
- Errors are logged (R07)
- Logs are structured (R08)
- Traces propagate (R09)

**After R09:** Complete observability coverage! 🎉



