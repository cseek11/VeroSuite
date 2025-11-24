# Task 5: R01 (Tenant Isolation) — Draft Summary

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-11-23  
**Rule:** R01 - Tenant Isolation  
**Priority:** CRITICAL (Tier 1 - BLOCK)

---

## What Was Generated

### 1. Step 5 Audit Checklist (18 items)
- **Database Operations:** 6 checks
- **API Endpoints:** 6 checks
- **Authentication:** 5 checks
- **Integration:** 1 check

### 2. OPA Policy Mapping
- **4 violation patterns identified:**
  1. Prisma query without tenant_id filter
  2. Raw SQL without withTenant() wrapper
  3. API endpoint accepting tenant_id from request
  4. Missing JwtAuthGuard on protected endpoint
- **Enforcement level:** BLOCK (Tier 1 MAD)
- **Policy file:** `services/opa/policies/security.rego`

### 3. Automated Check Script
- **Script:** `.cursor/scripts/check-tenant-isolation.py`
- **Checks:**
  - Scans for Prisma queries without tenant_id
  - Detects raw SQL without withTenant()
  - Finds tenant_id in request body/params
  - Identifies missing auth guards
  - Detects tenant_id in error messages

### 4. Manual Verification Procedures
- **4-step procedure:**
  1. Review query logic
  2. Test cross-tenant access
  3. Review error handling
  4. Validate JWT payload
- **5 verification criteria**

### 5. OPA Policy Implementation
- **Full Rego code provided**
- **4 deny rules**
- **1 helper function**
- **Performance optimized** (<200ms target)

### 6. Test Cases
- **7 test cases specified:**
  1. Happy path (with tenant_id)
  2. Violation (without tenant_id)
  3. Violation (raw SQL)
  4. Violation (tenant_id in body)
  5. Violation (missing auth guard)
  6. Override (with marker)
  7. Public endpoint (allowed)

---

## Review Needed

### Question 1: RLS Policy Configuration
**Context:** Should the automated script also check for RLS policy configuration in `schema.prisma`?

**Options:**
- A) Yes, include RLS checks in R01 script
- B) No, RLS is covered by R02 (separate script)
- C) Include basic RLS check, detailed check in R02

**Recommendation:** Option B - Keep R01 focused on application-level tenant isolation, R02 handles database-level RLS.

---

### Question 2: OPA Policy Scope
**Context:** Should the OPA policy for R01 also check RLS configuration, or is that R02's responsibility?

**Options:**
- A) R01 checks application code only
- B) R01 checks both application code and RLS config
- C) R01 checks application code, R02 validates RLS alignment

**Recommendation:** Option C - R01 ensures application code enforces tenant isolation, R02 validates RLS policies align with application requirements.

---

### Question 3: Manual Verification Checklist
**Context:** Should manual verification include a checklist for reviewing RLS policies in Supabase/PostgreSQL?

**Options:**
- A) Yes, add RLS review to R01 manual procedures
- B) No, RLS review is part of R02
- C) Add basic RLS check, detailed review in R02

**Recommendation:** Option B - Keep R01 manual procedures focused on application-level verification, R02 handles database-level RLS review.

---

## Estimated Implementation Time

| Task | Estimated Time |
|------|----------------|
| OPA Policy Implementation | 30 minutes |
| Automated Script Implementation | 45 minutes |
| Test Cases Implementation | 30 minutes |
| Documentation Updates | 15 minutes |
| **Total** | **2 hours** |

**Note:** This is within the 1.25 hour average per rule (R01 is more complex due to being first).

---

## Files to Create/Modify

### To Create
1. `services/opa/policies/security.rego` — OPA policy (or extend existing)
2. `.cursor/scripts/check-tenant-isolation.py` — Automated check script
3. `services/opa/tests/security_r01_test.rego` — Test cases

### To Modify
1. `.cursor/rules/03-security.mdc` — Add Step 5 section for R01
2. `.cursor/rules/01-enforcement.mdc` — Update Step 5 to reference R01 checks
3. `docs/developer/VeroField_Rules_2.1.md` — Add R01 Step 5 procedures
4. `docs/architecture/tenant-isolation.md` — Reference Step 5 checks
5. `docs/testing/security-testing-guide.md` — Add test procedures

---

## Verification Checklist

Before moving to R02, verify:

- [ ] Step 5 audit checklist is comprehensive
- [ ] OPA policy patterns are correct
- [ ] Automated script specification is clear
- [ ] Manual procedures are actionable
- [ ] Test cases cover all scenarios
- [ ] Review questions are answered
- [ ] Implementation time is reasonable

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
8. Verify all checks pass
9. Move to R02

### Option B: Request Changes
1. Provide feedback on draft
2. Request specific changes
3. AI revises draft
4. Re-review
5. Approve or iterate

### Option C: Defer R01
1. Move to simpler rule (R14-R25)
2. Build momentum with easier rules
3. Return to R01 with more context

---

## Recommendation

**Proceed with Option A** - R01 is well-defined, has clear patterns in the codebase, and is critical for security. Implementing R01 first sets a strong foundation for other security rules (R02, R12, R13).

**Answers to Review Questions:**
- Q1: Option B (RLS in R02)
- Q2: Option C (R01 app code, R02 RLS alignment)
- Q3: Option B (RLS review in R02)

**Rationale:** Keeps R01 focused on application-level tenant isolation, makes R02 (RLS Enforcement) responsible for database-level policies. This separation of concerns makes each rule clearer and easier to verify.

---

## Draft Location

**Full Draft:** `.cursor/rules/03-security-STEP5-DRAFT.md`

**Review Instructions:**
1. Read the full draft
2. Answer the 3 review questions
3. Approve or request changes
4. AI will implement approved procedures

---

**Status:** AWAITING YOUR REVIEW  
**Prepared By:** AI Assistant  
**Date:** 2025-11-23  
**Estimated Review Time:** 15-20 minutes



