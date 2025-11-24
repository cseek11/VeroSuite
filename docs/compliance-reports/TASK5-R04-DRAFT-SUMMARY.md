# Task 5: R04 (Layer Synchronization) — Draft Summary

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-11-23  
**Rule:** R04 - Layer Synchronization  
**Priority:** HIGH (Tier 2 - OVERRIDE)

---

## What Was Generated

### 1. Step 5 Audit Checklist (20 items)
- **Schema Change Synchronization:** 7 checks
- **DTO Change Synchronization:** 5 checks
- **Frontend Type Change Synchronization:** 3 checks
- **Contract Consistency:** 5 checks

### 2. OPA Policy Mapping
- **4 violation patterns + 1 warning:**
  1. Schema change without migration file
  2. Schema change without DTO update
  3. DTO change without frontend type update
  4. Enum mismatch between layers (warning)
- **Enforcement level:** OVERRIDE (Tier 2 MAD)
- **Policy file:** `services/opa/policies/data-integrity.rego` (NEW)

### 3. Automated Check Script
- **Script:** `.cursor/scripts/check-layer-sync.py`
- **Checks:**
  - Detects schema changes without migration files
  - Compares schema fields with DTO fields
  - Compares DTO fields with frontend type fields
  - Detects enum mismatches
  - Identifies missing validators
  - Checks contract documentation updates

### 4. Manual Verification Procedures
- **4-step procedure:**
  1. Review schema changes
  2. Verify layer synchronization
  3. Check contract documentation
  4. Test integration
- **6 verification criteria**

### 5. OPA Policy Implementation
- **Full Rego code provided**
- **3 deny rules + 1 warn rule**
- **Heuristic-based detection** (pattern matching)

### 6. Test Cases
- **10 test cases specified:**
  1. Happy path (schema with migration)
  2. Happy path (schema with DTO update)
  3. Happy path (DTO with frontend type update)
  4. Violation (schema without migration)
  5. Violation (schema without DTO)
  6. Violation (DTO without frontend type)
  7. Warning (enum change)
  8. Override (with marker)
  9. Edge case (multiple entities)
  10. Edge case (only frontend type changed)

---

## Review Needed

### Question 1: Contract Documentation Checks
**Context:** Should R04 also check for contract documentation (docs/contracts/) updates?

**Options:**
- A) Yes, require contract docs for all schema/DTO changes
- B) Yes, but only for entities that produce/consume events
- C) No, contract docs are separate concern (documentation rule)
- D) Warning only, not a hard requirement

**Recommendation:** Option B - Require contract docs for entities that produce/consume events. For simple CRUD entities without events, contract docs are optional but recommended.

**Rationale:** Contract documentation is critical for event-driven architecture (events, Kafka, etc.) but less critical for simple CRUD operations. Making it mandatory for all changes would be too strict and create noise.

---

### Question 2: Zod Schema Validation
**Context:** Should the automated script validate Zod schemas match frontend types?

**Options:**
- A) Yes, validate Zod schemas match frontend types
- B) Yes, but only warn (not fail)
- C) No, Zod schemas are implementation detail
- D) Check in separate script/tool

**Recommendation:** Option B - Warn if Zod schemas don't match frontend types, but don't fail the check. Zod schemas are important for runtime validation but are implementation details that can be fixed separately.

**Rationale:** Frontend types are the contract. Zod schemas enforce that contract at runtime. If types are correct, Zod schemas should match, but they can be updated separately without breaking the contract.

---

### Question 3: API Call Testing
**Context:** Should manual verification include testing actual API calls to verify synchronization?

**Options:**
- A) Yes, require API call testing
- B) Yes, but only for major changes
- C) No, integration tests cover this
- D) Optional, recommended for complex changes

**Recommendation:** Option D - Optional, recommended for complex changes. Integration tests should cover API call testing, but manual verification can include a quick smoke test for complex synchronization changes.

**Rationale:** Manual verification should be practical and quick. Full API call testing belongs in integration tests. However, a quick smoke test (e.g., "does the API return the new field?") can catch synchronization issues early.

---

### Question 4: Validator Updates in OPA
**Context:** Should OPA policy check for validator updates after schema changes?

**Options:**
- A) Yes, require validators to match schema constraints
- B) Yes, but only warn (not fail)
- C) No, validators are implementation detail
- D) Check in automated script, not OPA

**Recommendation:** Option D - Check in automated script, not OPA. OPA should focus on structural violations (missing migrations, missing DTOs). Validator checks require deeper analysis (comparing constraints) that's better suited for the Python script.

**Rationale:** OPA is fast but limited in analysis depth. Validator checks require comparing schema constraints (e.g., `@db.VarChar(255)`) with validator decorators (e.g., `@MaxLength(255)`), which is better done in Python with AST parsing.

---

## Estimated Implementation Time

| Task | Estimated Time |
|------|----------------|
| OPA Policy Implementation | 30 minutes |
| Automated Script Implementation | 60 minutes |
| Test Cases Implementation | 30 minutes |
| Documentation Updates | 20 minutes |
| **Total** | **2.5 hours** |

**Note:** Script is more complex than R01-R03 because it needs to:
- Parse Prisma schema
- Parse TypeScript DTOs
- Parse TypeScript frontend types
- Compare field names, types, optionality
- Detect enum mismatches

---

## Files to Create/Modify

### To Create
1. `services/opa/policies/data-integrity.rego` — OPA policy (NEW, includes R04-R06)
2. `services/opa/tests/data_integrity_r04_test.rego` — Test cases
3. `.cursor/scripts/check-layer-sync.py` — Automated check script
4. `docs/testing/layer-sync-testing-guide.md` — Layer sync testing guide (NEW)

### To Modify
1. `.cursor/rules/05-data.mdc` — Add Step 5 section for R04
2. `.cursor/rules/01-enforcement.mdc` — Update Step 5 to reference R04 checks
3. `docs/developer/VeroField_Rules_2.1.md` — Add R04 Step 5 procedures
4. `docs/layer-sync.md` — Update with R04 procedures
5. `docs/contracts.md` — Add R04 synchronization requirements

---

## Key Characteristics of R04

### Scope
- **Layer synchronization:** Schema ↔ DTO ↔ Frontend types
- **Contract consistency:** Field names, types, optionality, enums
- **Migration enforcement:** Schema changes require migrations

### Tier 2 (OVERRIDE) vs Tier 1 (BLOCK)
- **Tier 1 (R01-R03):** BLOCK - Cannot proceed without fix
- **Tier 2 (R04):** OVERRIDE - Can proceed with justification
- **Rationale:** Layer sync issues can be fixed in follow-up PRs, but should be flagged

### Different from R01-R03
- **R01-R03:** Structural rules (security, architecture)
- **R04:** Data integrity rule (synchronization)
- **Complexity:** Higher (requires parsing multiple file types)

---

## Verification Checklist

Before moving to R05, verify:

- [ ] Step 5 audit checklist is comprehensive (20 items)
- [ ] OPA policy patterns are correct (4 patterns + 1 warning)
- [ ] Automated script specification is clear
- [ ] Manual procedures are actionable (4-step process)
- [ ] Test cases cover all scenarios (10 tests)
- [ ] Review questions are answered
- [ ] Implementation time is reasonable (2.5 hours)
- [ ] Complements R01-R03 (different domain)

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
8. **Move to R05 (State Machine Enforcement)**

### Option B: Request Changes
1. Provide feedback on draft
2. Request specific changes
3. AI revises draft
4. Re-review
5. Approve or iterate

### Option C: Batch Review
1. Generate drafts for R05, R06 (related rules)
2. Review all together
3. Implement as batch
4. More efficient for related rules

---

## Recommendation

**Proceed with Option A** - R04 is foundational for data integrity. After R04:
- **Layer synchronization enforced** (schema ↔ DTO ↔ frontend)
- **Contract consistency verified** (field names, types, enums)
- **Migration enforcement** (schema changes require migrations)

**Answers to Review Questions:**
- Q1: Option B (Contract docs for event entities)
- Q2: Option B (Warn on Zod mismatches, don't fail)
- Q3: Option D (Optional API call testing)
- Q4: Option D (Check validators in script, not OPA)

**Rationale:** Keep R04 focused on structural synchronization. Validator checks and Zod schemas are important but implementation details that can be checked separately.

---

## Draft Location

**Full Draft:** `.cursor/rules/05-data-R04-DRAFT.md`

**Review Instructions:**
1. Read the full draft
2. Answer the 4 review questions
3. Approve or request changes
4. AI will implement approved procedures

---

**Status:** AWAITING YOUR REVIEW  
**Prepared By:** AI Assistant  
**Date:** 2025-11-23  
**Estimated Review Time:** 15-20 minutes

---

## Progress Update (After R04)

### Task 5 Status

| Rule | Status | Time | Notes |
|------|--------|------|-------|
| ✅ R01: Tenant Isolation | COMPLETE | 2.25h | Tier 1 |
| ✅ R02: RLS Enforcement | COMPLETE | 2.25h | Tier 1 |
| ✅ R03: Architecture Boundaries | COMPLETE | 2.08h | Tier 1 |
| ⏸️ R04: Layer Synchronization | DRAFT | 2.5h | Tier 2 |
| ⏸️ R05-R13 (Tier 2) | PENDING | 10h | Remaining Tier 2 |
| ⏸️ R14-R25 (Tier 3) | PENDING | 15h | Tier 3 |

**Progress:** 3/25 rules complete (12%), 1/25 in review (4%)  
**Time Spent:** 6.58 hours  
**Time Estimated (if R04 approved):** 9.08 hours  
**Remaining:** 21 rules, ~22.42 hours

**Tier 1:** 100% complete ✅  
**Tier 2:** 0% complete, 1/10 in review (10%)

---

## Tier 2 Characteristics

**Tier 2 Rules (OVERRIDE):**
- Important but not blocking
- Can proceed with justification
- Flagged for review
- Fixable in follow-up PRs

**R04 Focus:**
- Data integrity
- Contract consistency
- Layer synchronization
- Foundation for R05-R06

This provides a strong foundation for remaining Tier 2 rules (R05-R13).



