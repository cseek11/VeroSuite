# Task 5: R05 (State Machine Enforcement) — Draft Summary

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-11-23  
**Rule:** R05 - State Machine Enforcement  
**Priority:** HIGH (Tier 2 - OVERRIDE)

---

## What Was Generated

### 1. Step 5 Audit Checklist (20 items)
- **State Machine Documentation:** 6 checks
- **State Transition Validation:** 5 checks
- **Illegal Transition Prevention:** 4 checks
- **Audit Logging:** 4 checks
- **Code-Documentation Synchronization:** 4 checks

### 2. OPA Policy Mapping
- **5 violation patterns + 1 warning:**
  1. Stateful entity without state machine documentation
  2. State transition without validation function
  3. Illegal transition not rejected (code allows undocumented transition)
  4. State transition without audit log
  5. Code-documentation mismatch (states/transitions don't match)
  6. Warning: State machine documentation exists but code doesn't enforce transitions
- **Enforcement level:** OVERRIDE (Tier 2 MAD)
- **Policy file:** `services/opa/policies/data-integrity.rego` (R05 section)

### 3. Automated Check Script
- **Script:** `.cursor/scripts/check-state-machines.py`
- **Checks:**
  - Detects stateful entities (enum Status fields, status/state fields)
  - Verifies state machine documentation exists (`docs/state-machines/[entity]-state-machine.md`)
  - Parses documentation to extract states and transitions
  - Checks for transition validation functions in service layer
  - Verifies illegal transitions are rejected (pattern matching)
  - Checks for audit log calls on transitions
  - Compares code implementation with documentation (states match, transitions match)

### 4. Manual Verification Procedures
- **4-step procedure:**
  1. Review state machine documentation
  2. Verify transition validation
  3. Check audit logging
  4. Validate code-documentation sync
- **4 verification criteria**

### 5. OPA Policy Implementation
- **Full Rego code provided**
- **5 deny rules + 1 warn rule**
- **Heuristic-based detection** (pattern matching, file existence checks)

### 6. Test Cases
- **12 test cases specified:**
  1. Happy path (stateful entity with complete documentation and validation)
  2. Happy path (legal transition with validation and audit log)
  3. Happy path (illegal transition rejected with error)
  4. Violation (stateful entity without documentation)
  5. Violation (transition without validation function)
  6. Violation (illegal transition not rejected)
  7. Violation (transition without audit log)
  8. Violation (code-documentation mismatch - states don't match)
  9. Violation (code-documentation mismatch - transitions don't match)
  10. Warning (documentation exists but code doesn't enforce)
  11. Override (with marker)
  12. Edge case (multiple stateful entities)

---

## Review Needed

### Question 1: Stateful Entity Detection
**Context:** How should the automated script detect stateful entities?

**Options:**
- A) Check for enum Status fields in schema (e.g., `enum WorkOrderStatus`)
- B) Check for status/state fields in schema (e.g., `status String`)
- C) Check for both enum and string status fields
- D) Check documentation directory (`docs/state-machines/`) and verify entities exist in schema

**Recommendation:** Option C - Check for both enum Status fields and status/state string fields. Enums are explicit state machines, but string fields can also represent states (if documented). Also check documentation directory to find entities that should be stateful.

**Rationale:** Some entities use enum Status (explicit), others use string status fields (flexible). Both should be detected. Documentation directory is authoritative source for which entities are stateful.

---

### Question 2: Transition Validation Detection
**Context:** How should the script detect transition validation in code?

**Options:**
- A) Pattern matching (search for `isValidTransition`, `canTransition`, `validateTransition`)
- B) AST parsing (parse TypeScript, find transition validation functions)
- C) Check for transition guard classes (e.g., `WorkOrderStateTransitionGuard`)
- D) Combination: Pattern matching + AST parsing for accuracy

**Recommendation:** Option D - Combination approach. Use pattern matching for speed (check for common function names), then AST parsing for accuracy (verify function actually validates transitions). This balances performance with correctness.

**Rationale:** Pattern matching is fast but can have false positives. AST parsing is accurate but slower. Combination gives best of both worlds: fast initial check, accurate verification.

---

### Question 3: Illegal Transition Detection
**Context:** How should the script detect unguarded illegal transitions?

**Options:**
- A) Parse documentation to get illegal transitions, then check code doesn't allow them
- B) Parse code to find all transitions, compare with documentation legal transitions
- C) Check for explicit rejection of illegal transitions in tests
- D) Combination: Parse both, compare, verify tests exist

**Recommendation:** Option D - Combination approach. Parse documentation to get illegal transitions, parse code to find transition logic, compare to ensure illegal transitions are rejected. Also verify tests exist for illegal transitions.

**Rationale:** Need to verify both that code rejects illegal transitions AND that tests cover them. This is complex but necessary for correctness.

---

### Question 4: Audit Logging Detection
**Context:** Should R05 check for audit logs, or is that R12 (Security Event Logging)?

**Options:**
- A) Yes, R05 should check for audit logs on state transitions (state-specific requirement)
- B) No, audit logging is R12's responsibility (security/logging concern)
- C) Yes, but only warn (not fail) - R12 enforces, R05 recommends
- D) Check in R05, but defer to R12 for full audit logging requirements

**Recommendation:** Option A - R05 should check for audit logs on state transitions. State transitions are a specific domain concern (data integrity), and audit logs are required for state machine compliance. R12 covers general security event logging, but R05 ensures state transitions are audited.

**Rationale:** State transitions are critical business events that must be audited. R05 ensures state machine compliance includes audit logging. R12 covers broader security event logging (auth, PII access, etc.).

---

### Question 5: Code-Documentation Synchronization
**Context:** How strict should code-documentation synchronization be?

**Options:**
- A) Strict: Code must exactly match documentation (states, transitions, side effects)
- B) Flexible: Code can have additional states/transitions not in docs (as long as documented ones are correct)
- C) Warning only: Warn on mismatches, don't fail
- D) Strict for states, flexible for transitions (states must match, transitions can evolve)

**Recommendation:** Option A - Strict synchronization. Code must exactly match documentation. If code has additional states/transitions, documentation must be updated. This ensures documentation is always accurate and up-to-date.

**Rationale:** Documentation is source of truth for state machines. If code diverges from documentation, documentation becomes useless. Strict synchronization ensures accuracy.

---

## Estimated Implementation Time

| Task | Estimated Time |
|------|----------------|
| OPA Policy Implementation | 40 minutes |
| Automated Script Implementation | 90 minutes |
| Test Cases Implementation | 30 minutes |
| Documentation Updates | 20 minutes |
| **Total** | **3 hours** |

**Note:** Script is more complex than R04 because it needs to:
- Detect stateful entities (multiple methods)
- Parse state machine documentation (markdown parsing)
- Parse TypeScript code (AST parsing for transition validation)
- Compare code with documentation (state matching, transition matching)
- Detect audit log calls (pattern matching)

---

## Files to Create/Modify

### To Create
1. `services/opa/policies/data-integrity.rego` — Update with R05 section (already exists, add R05)
2. `services/opa/tests/data_integrity_r05_test.rego` — Test cases
3. `.cursor/scripts/check-state-machines.py` — Automated check script
4. `docs/testing/state-machine-testing-guide.md` — State machine testing guide (NEW)

### To Modify
1. `.cursor/rules/05-data.mdc` — Add Step 5 section for R05
2. `services/opa/policies/data-integrity.rego` — Add R05 violation patterns (already has placeholder)

---

## Key Characteristics of R05

### Scope
- **State machine documentation:** Must exist for stateful entities
- **Transition validation:** Must enforce legal transitions in code
- **Illegal transition prevention:** Must reject illegal transitions
- **Audit logging:** Must emit audit logs on transitions
- **Code-documentation sync:** Code must match documentation

### Tier 2 (OVERRIDE) vs Tier 1 (BLOCK)
- **Tier 1 (R01-R03):** BLOCK - Cannot proceed without fix
- **Tier 2 (R05):** OVERRIDE - Can proceed with justification
- **Rationale:** State machine issues can be fixed in follow-up PRs, but should be flagged

### Different from R04
- **R04:** Layer synchronization (schema ↔ DTO ↔ frontend)
- **R05:** State machine enforcement (documentation ↔ code ↔ validation)
- **Complexity:** Higher (requires parsing documentation, AST parsing, comparison logic)

---

## Verification Checklist

Before moving to R06, verify:

- [ ] Step 5 audit checklist is comprehensive (20 items)
- [ ] OPA policy patterns are correct (5 patterns + 1 warning)
- [ ] Automated script specification is clear
- [ ] Manual procedures are actionable (4-step process)
- [ ] Test cases cover all scenarios (12 tests)
- [ ] Review questions are answered
- [ ] Implementation time is reasonable (3 hours)
- [ ] Complements R04 (different domain, same file)

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
8. **Move to R06 (Breaking Change Documentation)**

### Option B: Request Changes
1. Provide feedback on draft
2. Request specific changes
3. AI revises draft
4. Re-review
5. Approve or iterate

### Option C: Batch Review
1. Generate drafts for R06 (related rule in same file)
2. Review R05 and R06 together
3. Implement as batch
4. More efficient for related rules

---

## Recommendation

**Proceed with Option A** - R05 is critical for state machine integrity. After R05:
- **State machine documentation enforced** (must exist for stateful entities)
- **Transition validation enforced** (legal transitions only)
- **Illegal transitions prevented** (explicit rejection)
- **Audit logging enforced** (all transitions logged)
- **Code-documentation sync verified** (code matches docs)

**Answers to Review Questions:**
- Q1: Option C (Check both enum and string status fields + documentation directory)
- Q2: Option D (Pattern matching + AST parsing combination)
- Q3: Option D (Parse both, compare, verify tests)
- Q4: Option A (R05 checks audit logs on state transitions)
- Q5: Option A (Strict synchronization - code must match docs)

**Rationale:** State machines are critical for business logic correctness. Strict enforcement ensures documentation is accurate and code is correct. Combination detection methods balance performance with accuracy.

---

## Draft Location

**Full Draft:** `.cursor/rules/05-data-R05-DRAFT.md`

**Review Instructions:**
1. Read the full draft
2. Answer the 5 review questions
3. Approve or request changes
4. AI will implement approved procedures

---

## Stateful Entities in Codebase

Based on schema analysis, these entities likely need state machine documentation:

- **WorkOrder** - Has status field (enum or string)
- **Invoice** - Has `InvoiceStatus` enum
- **Payment** - Has status field
- **ServiceAgreement** - Has `ServiceAgreementStatus` enum
- **User** - Has status field (active/suspended/deleted)
- **Job** - May have status field

**Note:** Script will detect these automatically, but manual verification may be needed for edge cases.

---

**Status:** AWAITING YOUR REVIEW  
**Prepared By:** AI Assistant  
**Date:** 2025-11-23  
**Estimated Review Time:** 20-25 minutes

---

## Progress Update (After R05 Draft)

### Task 5 Status

| Rule | Status | Time | Notes |
|------|--------|------|-------|
| ✅ R01: Tenant Isolation | COMPLETE | 2.25h | Tier 1 |
| ✅ R02: RLS Enforcement | COMPLETE | 2.25h | Tier 1 |
| ✅ R03: Architecture Boundaries | COMPLETE | 2.08h | Tier 1 |
| ✅ R04: Layer Synchronization | COMPLETE | 2.58h | Tier 2 |
| ⏸️ R05: State Machine Enforcement | DRAFT | 3h | Tier 2 |
| ⏸️ R06-R13 (Tier 2) | PENDING | 7h | Remaining Tier 2 |
| ⏸️ R14-R25 (Tier 3) | PENDING | 15h | Tier 3 |

**Progress:** 4/25 rules complete (16%), 1/25 in review (4%)  
**Time Spent:** 9.16 hours  
**Time Estimated (if R05 approved):** 12.16 hours  
**Remaining:** 20 rules, ~19.34 hours

**Tier 1:** 100% complete ✅  
**Tier 2:** 10% complete (1/10), 1/10 in review (10%)

---

## Tier 2 Characteristics

**Tier 2 Rules (OVERRIDE):**
- Important but not blocking
- Can proceed with justification
- Flagged for review
- Fixable in follow-up PRs

**R05 Focus:**
- State machine integrity
- Transition validation
- Illegal transition prevention
- Audit logging
- Code-documentation synchronization

This provides strong foundation for state machine compliance.





