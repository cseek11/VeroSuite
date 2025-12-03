# Task 5: R11 (Backend Patterns) — Draft Summary

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-11-23  
**Rule:** R11 - Backend Patterns  
**Priority:** HIGH (Tier 2 - OVERRIDE)

---

## What Was Generated

### 1. Step 5 Audit Checklist (42 items)
- **Controller Patterns:** 9 checks
- **Service Patterns:** 8 checks
- **DTO Patterns:** 9 checks
- **Prisma Patterns:** 9 checks
- **Testing Patterns:** 9 checks
- **Module Structure:** 5 checks

### 2. OPA Policy Mapping
- **5 violation patterns + 1 warning:**
  1. Business logic in controllers (should be in services)
  2. Missing DTOs or validation for endpoints
  3. Tenant-scoped queries without tenant filters or RLS
  4. Multi-step operations without transactions
  5. DTOs with `any` types or missing validation
  6. Warning: Patterns exist but may be incomplete
- **Enforcement level:** OVERRIDE (Tier 2 MAD)
- **Policy file:** `services/opa/policies/backend.rego` (R11 section)

### 3. Automated Check Script
- **Script:** `.cursor/scripts/check-backend-patterns.py`
- **Checks:**
  - Detects business logic in controllers (AST parsing)
  - Verifies DTOs exist and validate inputs (file analysis, AST parsing)
  - Verifies tenant isolation in Prisma queries (pattern matching)
  - Verifies transactions for multi-step operations (AST parsing)
  - Verifies DTOs have no `any` types (AST parsing)
  - Verifies controllers are thin (delegate to services)
  - Verifies services contain business logic
  - Verifies proper NestJS patterns (decorators, structure)

### 4. Manual Verification Procedures
- **4-step procedure:**
  1. Review Controller Structure - Verify controller is thin and delegates to service
  2. Review Service Structure - Verify service contains business logic and uses Prisma correctly
  3. Review DTO Structure - Verify DTOs exist, validate inputs, and have no `any` types
  4. Review Prisma Usage - Verify tenant isolation, transactions, and proper query patterns
- **4 verification criteria**

### 5. OPA Policy Implementation
- **Full Rego code provided**
- **5 deny rules + 1 warn rule**
- **Pattern matching** (AST parsing, file analysis)

### 6. Test Cases
- **12 test cases specified:**
  1. Happy path (thin controller, proper service, DTOs)
  2. Happy path (proper Prisma usage with tenant isolation)
  3. Happy path (multi-step operation with transaction)
  4. Violation (business logic in controller)
  5. Violation (missing DTOs)
  6. Violation (tenant-scoped query without tenant filter)
  7. Violation (multi-step operation without transaction)
  8. Violation (DTO with `any` type)
  9. Warning (patterns exist but incomplete)
  10. Override (with marker)
  11. Edge case (complex service with multiple dependencies)
  12. Edge case (nested DTOs with validation)

---

## Review Needed

### Question 1: Business Logic Detection in Controllers
**Context:** How should the script detect business logic in controllers?

**Options:**
- A) AST parsing (analyze controller methods, detect Prisma calls, complex logic)
- B) Pattern matching (detect common business logic patterns: validation, database queries, calculations)
- C) Combination: AST parsing + pattern matching for accuracy
- D) Heuristic check (verify controller methods only call service methods)

**Recommendation:** Option C - Combination approach. Use AST parsing to detect Prisma calls, database queries, and complex logic in controllers. Use pattern matching to detect common business logic patterns (validation, calculations, state transitions). This provides comprehensive coverage.

**Rationale:** Business logic detection requires:
- Detecting Prisma/database calls in controllers (AST parsing)
- Detecting complex logic (conditionals, loops, calculations) in controllers (AST parsing)
- Detecting common business logic patterns (validation, state transitions) (pattern matching)
- Verifying controllers only delegate to services (AST parsing)

---

### Question 2: DTO Validation Detection
**Context:** How should the script detect missing DTOs or validation?

**Options:**
- A) File pattern matching (check for `dto/*.ts` files)
- B) AST parsing (analyze controller methods, detect DTO usage, validation decorators)
- C) Combination: File pattern + AST analysis for accuracy
- D) Git diff analysis (detect new endpoints, check for corresponding DTOs)

**Recommendation:** Option C - Combination approach. Check for `dto/*.ts` files (file pattern), analyze controller methods for DTO usage (AST parsing), verify DTOs have validation decorators (AST parsing). This ensures comprehensive coverage.

**Rationale:** DTO validation detection requires:
- Verifying DTO files exist (file pattern matching)
- Verifying controllers use DTOs (AST parsing)
- Verifying DTOs have validation decorators (AST parsing)
- Verifying DTOs have no `any` types (AST parsing)

---

### Question 3: Transaction Detection
**Context:** How should the script detect multi-step operations without transactions?

**Options:**
- A) AST parsing (detect multiple Prisma calls in same method)
- B) Pattern matching (detect common multi-step patterns: create + update, delete + create)
- C) Combination: AST parsing + pattern matching for accuracy
- D) Heuristic check (verify methods with multiple Prisma calls use transactions)

**Recommendation:** Option C - Combination approach. Use AST parsing to detect multiple Prisma calls in the same method. Use pattern matching to detect common multi-step patterns (create + update, delete + create). Verify transactions wrap multi-step operations.

**Rationale:** Transaction detection requires:
- Detecting multiple Prisma calls in same method (AST parsing)
- Detecting common multi-step patterns (pattern matching)
- Verifying transactions wrap multi-step operations (AST parsing)
- Handling edge cases (nested transactions, conditional operations)

---

### Question 4: Tenant Isolation Detection
**Context:** How should the script detect tenant-scoped queries without tenant filters?

**Options:**
- A) Pattern matching (detect Prisma queries, check for tenant_id in where clause)
- B) AST parsing (analyze Prisma queries, detect tenant_id usage)
- C) Combination: Pattern matching + AST parsing for accuracy
- D) Heuristic check (verify tenant-scoped tables include tenant_id filter)

**Recommendation:** Option C - Combination approach. Use pattern matching to detect Prisma queries on tenant-scoped tables. Use AST parsing to verify tenant_id is included in where clauses or RLS context is set. This ensures comprehensive coverage.

**Rationale:** Tenant isolation detection requires:
- Detecting Prisma queries on tenant-scoped tables (pattern matching)
- Verifying tenant_id in where clauses (AST parsing)
- Verifying RLS context is set (pattern matching)
- Handling edge cases (nested queries, transactions)

---

### Question 5: Service Business Logic Detection
**Context:** How should the script verify services contain business logic?

**Options:**
- A) AST parsing (analyze service methods, detect validation, calculations, state transitions)
- B) Pattern matching (detect common business logic patterns)
- C) Combination: AST parsing + pattern matching for accuracy
- D) Heuristic check (verify service methods are not just pass-through)

**Recommendation:** Option C - Combination approach. Use AST parsing to detect validation, calculations, and state transitions in service methods. Use pattern matching to detect common business logic patterns. Verify services are not just pass-through wrappers.

**Rationale:** Service business logic detection requires:
- Detecting validation logic in services (AST parsing)
- Detecting calculations and transformations (AST parsing)
- Detecting state transitions (pattern matching)
- Verifying services are not pass-through wrappers (AST parsing)

---

## Key Decisions Made

### 1. Comprehensive Coverage
- **Decision:** Cover all aspects of backend patterns (controllers, services, DTOs, Prisma, testing, modules)
- **Rationale:** Backend patterns are interconnected; comprehensive coverage ensures consistency

### 2. AST Parsing + Pattern Matching
- **Decision:** Use combination of AST parsing and pattern matching for detection
- **Rationale:** Provides accurate detection while handling edge cases

### 3. Tenant Isolation Integration
- **Decision:** Integrate with R01 (Tenant Isolation) and R02 (RLS Enforcement)
- **Rationale:** Backend patterns must enforce tenant isolation; integration ensures consistency

### 4. Transaction Detection
- **Decision:** Detect multi-step operations and verify transactions
- **Rationale:** Data integrity requires transactions for multi-step operations

### 5. DTO Validation
- **Decision:** Verify DTOs exist, validate inputs, and have no `any` types
- **Rationale:** Type safety and validation are critical for backend security

---

## Implementation Plan

### Phase 1: OPA Policy (Estimated: 1 hour)
1. Create `services/opa/policies/backend.rego` with R11 section
2. Implement 5 violation patterns + 1 warning pattern
3. Add override mechanism
4. Test with sample violations

### Phase 2: Automated Script (Estimated: 3 hours)
1. Create `.cursor/scripts/check-backend-patterns.py`
2. Implement AST parsing for controllers, services, DTOs
3. Implement pattern matching for Prisma queries, transactions
4. Add tenant isolation detection
5. Add DTO validation detection
6. Test with sample files

### Phase 3: Test Suite (Estimated: 1 hour)
1. Create `services/opa/tests/backend_r11_test.rego`
2. Implement 12 test cases
3. Test violation patterns
4. Test override mechanism

### Phase 4: Rule File Update (Estimated: 0.5 hours)
1. Update `.cursor/rules/08-backend.mdc` with Step 5 section
2. Add audit checklist
3. Add automated checks section
4. Add manual verification procedures

### Phase 5: Documentation (Estimated: 0.5 hours)
1. Create completion document
2. Update handoff document
3. Create testing guide (if needed)

**Total Estimated Time:** 6 hours

---

## Next Steps

1. **Review this draft** - Answer questions, provide feedback
2. **Approve or request changes** - Based on review
3. **Implement approved draft** - Create OPA policy, script, tests
4. **Update rule file** - Add Step 5 section to `.cursor/rules/08-backend.mdc`
5. **Create completion document** - Document implementation

---

## Questions for Human Reviewer

1. **Business Logic Detection:** Do you agree with Option C (AST parsing + pattern matching) for detecting business logic in controllers?

2. **DTO Validation Detection:** Do you agree with Option C (file pattern + AST analysis) for detecting missing DTOs or validation?

3. **Transaction Detection:** Do you agree with Option C (AST parsing + pattern matching) for detecting multi-step operations without transactions?

4. **Tenant Isolation Detection:** Do you agree with Option C (pattern matching + AST parsing) for detecting tenant-scoped queries without tenant filters?

5. **Service Business Logic Detection:** Do you agree with Option C (AST parsing + pattern matching) for verifying services contain business logic?

6. **Coverage:** Are there any additional backend patterns that should be covered?

7. **Edge Cases:** Are there any edge cases or special scenarios that should be handled?

---

**Last Updated:** 2025-11-23  
**Next Review:** After human feedback  
**Estimated Implementation Time:** 6 hours





