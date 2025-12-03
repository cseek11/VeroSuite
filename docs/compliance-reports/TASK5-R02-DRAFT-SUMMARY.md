# Task 5: R02 (RLS Enforcement) — Draft Summary

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-11-23  
**Rule:** R02 - RLS Enforcement  
**Priority:** CRITICAL (Tier 1 - BLOCK)

---

## What Was Generated

### 1. Step 5 Audit Checklist (20 items)
- **RLS Policy Configuration:** 6 checks
- **Database Role Configuration:** 5 checks
- **Migration Files:** 5 checks
- **Application Code:** 4 checks

### 2. OPA Policy Mapping
- **4 violation patterns + 1 warning:**
  1. New table with tenant_id but no RLS policy
  2. Disabling RLS on existing table
  3. Using superuser role in application code
  4. SECURITY DEFINER function without tenant filter
  5. Warning: New model with tenant_id (check migration)
- **Enforcement level:** BLOCK (Tier 1 MAD)
- **Policy file:** `services/opa/policies/security.rego` (extend existing)

### 3. Automated Check Script
- **Script:** `.cursor/scripts/check-rls-enforcement.py`
- **Checks:**
  - Scans migration files for missing RLS policies
  - Detects `DISABLE ROW LEVEL SECURITY` statements
  - Finds superuser role usage
  - Identifies `SECURITY DEFINER` functions
  - Verifies `ENABLE ROW LEVEL SECURITY` statements

### 4. Manual Verification Procedures
- **4-step procedure:**
  1. Review RLS policy logic
  2. Test RLS enforcement
  3. Verify role permissions
  4. Test migration rollback
- **5 verification criteria**

### 5. OPA Policy Implementation
- **Full Rego code provided** (extends security.rego)
- **4 deny rules + 1 warn rule**
- **Performance optimized** (<200ms target for combined R01+R02)

### 6. Test Cases
- **8 test cases specified:**
  1. Happy path (with RLS policy)
  2. Violation (without RLS)
  3. Violation (disabling RLS)
  4. Violation (superuser role)
  5. Violation (SECURITY DEFINER)
  6. Warning (new model with tenant_id)
  7. Override (with marker)
  8. Edge case (table without tenant_id)

---

## Review Needed

### Question 1: Responsibility Overlap with R01
**Context:** Should R02 check for missing tenant_id columns, or is that R01's responsibility?

**Options:**
- A) R02 checks for tenant_id columns (overlap with R01)
- B) R01 handles tenant_id in application code, R02 assumes tenant_id exists
- C) Both check, but from different angles (R01=app code, R02=schema)

**Recommendation:** Option B - R01 ensures application code uses tenant_id correctly, R02 assumes tenant_id exists and focuses on RLS policy enforcement. This avoids duplication and keeps each rule focused.

**Rationale:** Clear separation - R01 = application-level isolation, R02 = database-level enforcement.

---

### Question 2: Automated Script Validation Depth
**Context:** Should the automated script validate RLS policy syntax, or just check for existence?

**Options:**
- A) Check existence only (simple, fast)
- B) Validate syntax (complex, slower, more thorough)
- C) Check existence + basic syntax validation (middle ground)

**Recommendation:** Option C - Check existence and validate basic syntax (e.g., policy uses `current_setting('app.tenant_id')`), but don't parse full SQL syntax.

**Rationale:** Catches most common errors without becoming a full SQL parser. Manual verification handles complex cases.

---

### Question 3: OPA Policy Validation Depth
**Context:** Should the OPA policy validate RLS policy syntax, or just check for existence?

**Options:**
- A) Check existence only
- B) Validate full syntax
- C) Check existence + validate key patterns (current_setting, tenant_id)

**Recommendation:** Option C - Check for existence and validate that policy includes `current_setting('app.tenant_id')` pattern.

**Rationale:** OPA can do simple pattern matching efficiently. Full syntax validation would be complex and slow.

---

### Question 4: Performance Testing in Manual Verification
**Context:** Should manual verification include performance testing of RLS policies?

**Options:**
- A) Yes, include performance testing (measure query time with/without RLS)
- B) No, performance testing is separate (R24: Performance Budgets)
- C) Include basic performance check (ensure no obvious slowdowns)

**Recommendation:** Option C - Include basic performance check in manual verification (query should complete in reasonable time), but detailed performance testing belongs in R24.

**Rationale:** Catch obvious performance issues early, but don't duplicate R24's comprehensive performance testing.

---

## Estimated Implementation Time

| Task | Estimated Time |
|------|----------------|
| OPA Policy Implementation | 30 minutes |
| Automated Script Implementation | 45 minutes |
| Test Cases Implementation | 30 minutes |
| Documentation Updates | 15 minutes |
| **Total** | **2 hours** |

**Note:** Consistent with R01 implementation time.

---

## Files to Create/Modify

### To Create
1. `.cursor/scripts/check-rls-enforcement.py` — Automated check script
2. `services/opa/tests/security_r02_test.rego` — Test cases
3. `docs/database/rls-policy-guide.md` — RLS implementation guide (NEW)

### To Modify
1. `services/opa/policies/security.rego` — Add R02 section (extend existing)
2. `.cursor/rules/03-security.mdc` — Add Step 5 section for R02
3. `.cursor/rules/01-enforcement.mdc` — Update Step 5 to reference R02 checks
4. `docs/developer/VeroField_Rules_2.1.md` — Add R02 Step 5 procedures
5. `docs/architecture/database-security.md` — Document RLS requirements
6. `docs/testing/security-testing-guide.md` — Add RLS test procedures

---

## Key Differences from R01

### Scope
- **R01:** Application-level tenant isolation (queries, API endpoints, JWT)
- **R02:** Database-level enforcement (RLS policies, roles, migrations)

### Files Checked
- **R01:** `.service.ts`, `.controller.ts`, authentication files
- **R02:** `.sql` migrations, `schema.prisma`, database config

### Violations
- **R01:** Missing tenant_id filters, raw SQL without wrapper, client-provided tenant_id
- **R02:** Missing RLS policies, disabled RLS, superuser role usage

### Complementary Nature
- R01 ensures application code enforces tenant isolation
- R02 ensures database enforces tenant isolation even if application code fails
- Together they provide defense-in-depth

---

## Verification Checklist

Before moving to R03, verify:

- [ ] Step 5 audit checklist is comprehensive
- [ ] OPA policy patterns are correct
- [ ] Automated script specification is clear
- [ ] Manual procedures are actionable
- [ ] Test cases cover all scenarios
- [ ] Review questions are answered
- [ ] Implementation time is reasonable
- [ ] No overlap with R01 (clear separation)

---

## Next Steps

### Option A: Approve and Implement
1. Review draft procedures
2. Answer review questions
3. Approve for implementation
4. Extend OPA policy (add R02 to security.rego)
5. Implement automated script
6. Add test cases
7. Update documentation
8. Verify all checks pass
9. Move to R03

### Option B: Request Changes
1. Provide feedback on draft
2. Request specific changes
3. AI revises draft
4. Re-review
5. Approve or iterate

### Option C: Defer R02
1. Move to R03 (Architecture Boundaries)
2. Different domain, fresh perspective
3. Return to R02 later

---

## Recommendation

**Proceed with Option A** - R02 complements R01 perfectly, shares the same file (`03-security.mdc` and `security.rego`), and completes the database security foundation. The separation of concerns is clear:
- **R01:** Application enforces tenant isolation
- **R02:** Database enforces tenant isolation

**Answers to Review Questions:**
- Q1: Option B (R01 handles tenant_id, R02 assumes it exists)
- Q2: Option C (Check existence + basic syntax validation)
- Q3: Option C (Check existence + validate key patterns)
- Q4: Option C (Basic performance check, detailed testing in R24)

**Rationale:** Keeps R02 focused on RLS enforcement without duplicating R01. Basic validation catches most errors, manual verification handles edge cases.

---

## Draft Location

**Full Draft:** `.cursor/rules/03-security-R02-DRAFT.md`

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

## Progress Update

### Task 5 Status (After R02)

| Rule | Status | Time | Notes |
|------|--------|------|-------|
| R01: Tenant Isolation | ✅ COMPLETE | 2.25h | Implemented |
| **R02: RLS Enforcement** | ⏸️ DRAFT | 2h | Awaiting review |
| R03: Architecture Boundaries | ⏸️ PENDING | 1.25h | Next |
| R04-R13 (Tier 2) | ⏸️ PENDING | 12.5h | After Tier 1 |
| R14-R25 (Tier 3) | ⏸️ PENDING | 15h | After Tier 2 |

**Progress:** 1/25 rules complete, 1/25 in review (8%)  
**Time Spent:** 2.25 hours  
**Time Estimated (if R02 approved):** 4.25 hours  
**Remaining:** 23 rules, ~27.25 hours





