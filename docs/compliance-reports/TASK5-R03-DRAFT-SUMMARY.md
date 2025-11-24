# Task 5: R03 (Architecture Boundaries) — Draft Summary

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-11-23  
**Rule:** R03 - Architecture Boundaries  
**Priority:** CRITICAL (Tier 1 - BLOCK)

---

## What Was Generated

### 1. Step 5 Audit Checklist (14 items)
- **Monorepo Structure Compliance:** 5 checks
- **Service Boundary Enforcement:** 5 checks
- **Architectural Scope Limits:** 4 checks

### 2. OPA Policy Mapping
- **7 violation patterns + 1 warning:**
  1. New directory in `apps/` (new microservice without approval)
  2. Files in deprecated paths (`backend/src/`)
  3. Cross-service relative imports
  4. New top-level directories
  5. New schema files outside `libs/common/prisma/`
  6. Frontend importing backend implementation
  7. Backend importing frontend code
  8. Warning: Utility files in service directories (should be shared)
- **Enforcement level:** BLOCK (Tier 1 MAD)
- **Policy file:** `services/opa/policies/architecture.rego` (NEW)

### 3. Automated Check Script
- **Script:** `.cursor/scripts/check-architecture-boundaries.py`
- **Checks:**
  - Scans for files in deprecated paths
  - Detects cross-service relative imports
  - Finds new directories in `apps/`
  - Identifies new top-level directories
  - Detects backend/frontend import violations
  - Finds potential code duplication

### 4. Manual Verification Procedures
- **4-step procedure:**
  1. Review monorepo structure
  2. Verify service boundaries
  3. Validate shared code
  4. Review architectural decisions
- **5 verification criteria**

### 5. OPA Policy Implementation
- **Full Rego code provided**
- **7 deny rules + 1 warn rule**
- **Performance optimized** (<200ms target)

### 6. Test Cases
- **11 test cases specified:**
  1. Happy path (correct path)
  2. Violation (new microservice)
  3. Violation (deprecated path)
  4. Violation (cross-service import)
  5. Violation (new top-level directory)
  6. Violation (new schema file)
  7. Violation (frontend importing backend)
  8. Violation (backend importing frontend)
  9. Warning (utility in service)
  10. Override (with marker)
  11. Edge case (shared code)

---

## Review Needed

### Question 1: Architectural Pattern Enforcement
**Context:** Should R03 also check for architectural patterns (e.g., layered architecture, clean architecture)?

**Options:**
- A) Yes, enforce specific architectural patterns
- B) No, focus on monorepo structure and service boundaries only
- C) Provide warnings for pattern violations, not hard stops

**Recommendation:** Option B - Focus on monorepo structure and service boundaries. Architectural patterns are important but subjective and should be enforced through code review and documentation, not automated blocking.

**Rationale:** R03 should enforce structural boundaries (what goes where, how services communicate). Architectural patterns (how code is organized within a service) are better handled through code review, linting, and team conventions.

---

### Question 2: Code Duplication Detection
**Context:** Should the automated script detect code duplication across services?

**Options:**
- A) Yes, detect exact duplicates
- B) Yes, detect similar code (fuzzy matching)
- C) No, just warn about utils in service directories
- D) Provide basic detection, detailed analysis in separate tool

**Recommendation:** Option C - Warn about utils in service directories. Full duplication detection is complex and better handled by dedicated tools (e.g., jscpd, SonarQube).

**Rationale:** Simple heuristic (utils in service directories) catches most cases. Full duplication detection would make the script slow and complex. Dedicated tools do this better.

---

### Question 3: Dependency Graph Analysis
**Context:** Should manual verification include dependency graph analysis?

**Options:**
- A) Yes, include full dependency graph analysis
- B) Yes, include basic dependency checks
- C) No, dependency analysis is separate concern
- D) Provide guidance, but don't require it

**Recommendation:** Option D - Provide guidance in manual verification, but don't require it. Dependency graph analysis is valuable but time-consuming and better suited for periodic architectural reviews.

**Rationale:** Manual verification should be practical and quick. Dependency graph analysis is important but should be done periodically (quarterly) or when major changes occur, not for every PR.

---

### Question 4: Circular Dependency Detection
**Context:** Should OPA policy check for circular dependencies between services?

**Options:**
- A) Yes, detect circular dependencies
- B) No, too complex for OPA
- C) Detect obvious cases (A imports B, B imports A)
- D) Leave to build tools and manual review

**Recommendation:** Option D - Leave to build tools and manual review. Circular dependency detection requires analyzing the entire dependency graph, which is beyond OPA's scope and would be slow.

**Rationale:** Build tools (webpack, TypeScript compiler) already detect circular dependencies. OPA should focus on structural violations (cross-service imports), not dependency graph analysis.

---

## Estimated Implementation Time

| Task | Estimated Time |
|------|----------------|
| OPA Policy Implementation | 30 minutes |
| Automated Script Implementation | 45 minutes |
| Test Cases Implementation | 30 minutes |
| Documentation Updates | 15 minutes |
| **Total** | **2 hours** |

**Note:** Consistent with R01 and R02 implementation times.

---

## Files to Create/Modify

### To Create
1. `services/opa/policies/architecture.rego` — OPA policy (NEW)
2. `services/opa/tests/architecture_r03_test.rego` — Test cases
3. `.cursor/scripts/check-architecture-boundaries.py` — Automated check script
4. `docs/architecture/monorepo-structure.md` — Monorepo structure guide (NEW)
5. `docs/architecture/service-communication.md` — Service communication patterns (NEW)

### To Modify
1. `.cursor/rules/04-architecture.mdc` — Add Step 5 section for R03
2. `.cursor/rules/01-enforcement.mdc` — Update Step 5 to reference R03 checks
3. `docs/developer/VeroField_Rules_2.1.md` — Add R03 Step 5 procedures
4. `docs/testing/architecture-testing-guide.md` — Add architecture test procedures

---

## Key Characteristics of R03

### Scope
- **Monorepo structure:** Correct file paths, no deprecated paths
- **Service boundaries:** No cross-service imports, HTTP/events communication
- **Architectural limits:** No new services/schemas without approval

### Completes Tier 1 Foundation
- **R01:** Application-level tenant isolation ✅
- **R02:** Database-level RLS enforcement ✅
- **R03:** Architectural boundaries and service isolation ⏸️

**Together:** Complete critical foundation (security + architecture)

### Different from R01/R02
- **R01/R02:** Security-focused (tenant isolation, RLS)
- **R03:** Structure-focused (monorepo, service boundaries)
- **All Tier 1:** BLOCK level - require human approval or fix

---

## Verification Checklist

Before moving to Tier 2, verify:

- [ ] Step 5 audit checklist is comprehensive
- [ ] OPA policy patterns are correct
- [ ] Automated script specification is clear
- [ ] Manual procedures are actionable
- [ ] Test cases cover all scenarios
- [ ] Review questions are answered
- [ ] Implementation time is reasonable
- [ ] Complements R01/R02 (different domain)

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
8. **Complete Tier 1** ✅

### Option B: Request Changes
1. Provide feedback on draft
2. Request specific changes
3. AI revises draft
4. Re-review
5. Approve or iterate

### Option C: Defer R03
1. Move to Tier 2 rules (R04-R13)
2. Return to R03 later
3. Different approach

---

## Recommendation

**Proceed with Option A** - R03 completes the Tier 1 (BLOCK) foundation. After R03:
- **All critical rules complete** (security + architecture)
- **Strong foundation** for Tier 2/3 rules
- **Clear milestone** (end of Tier 1)

**Answers to Review Questions:**
- Q1: Option B (Focus on structure, not patterns)
- Q2: Option C (Warn about utils, not full duplication detection)
- Q3: Option D (Provide guidance, don't require)
- Q4: Option D (Leave to build tools)

**Rationale:** Keep R03 focused on structural boundaries. Architectural patterns, duplication detection, and dependency analysis are important but belong in separate tools/processes.

---

## Draft Location

**Full Draft:** `.cursor/rules/04-architecture-R03-DRAFT.md`

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

## Progress Update (After R03)

### Task 5 Status

| Rule | Status | Time | Notes |
|------|--------|------|-------|
| R01: Tenant Isolation | ✅ COMPLETE | 2.25h | Application-level security |
| R02: RLS Enforcement | ✅ COMPLETE | 2.25h | Database-level security |
| **R03: Architecture Boundaries** | ⏸️ DRAFT | 2h | Awaiting review |
| **Tier 1 Complete** | ⏸️ PENDING | 6.5h | After R03 |
| R04-R13 (Tier 2) | ⏸️ PENDING | 12.5h | After Tier 1 |
| R14-R25 (Tier 3) | ⏸️ PENDING | 15h | After Tier 2 |

**Progress:** 2/25 rules complete, 1/25 in review (12%)  
**Time Spent:** 4.5 hours  
**Time Estimated (if R03 approved):** 6.5 hours  
**Remaining:** 23 rules, ~25 hours

**Tier 1 Progress:** 2/3 complete (67%), 1/3 in review

---

## Tier 1 Completion Benefits

After R03 is complete:
- ✅ **Security foundation:** Tenant isolation + RLS enforcement
- ✅ **Architecture foundation:** Monorepo structure + service boundaries
- ✅ **Critical rules complete:** All BLOCK-level rules done
- ✅ **Clear milestone:** Ready for Tier 2 (OVERRIDE rules)
- ✅ **Consistent pattern:** 3 rules, ~6.5 hours, strong quality

This provides a natural stopping point and clear progress marker.



