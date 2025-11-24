# R16: Testing Requirements (Additional) — Draft Summary

**Date:** 2025-11-23  
**Rule:** R16 - Testing Requirements (Additional)  
**Tier:** 3 (WARNING-level enforcement)  
**Status:** DRAFT - Awaiting Review  
**Estimated Time:** 2-3 hours

---

## Overview

R16 ensures that code changes include **additional testing requirements** beyond basic unit/regression/integration/E2E tests covered by R10. These requirements are context-specific and depend on the type of change and domain.

**Key Focus Areas:**
- Error path testing (comprehensive error scenario coverage)
- State machine testing (legal/illegal transitions)
- Tenant isolation testing (data isolation verification)
- Behavior-diff testing (refactoring behavior preservation)
- Preventative testing (bug fix root cause prevention)
- Observability testing (structured logging, trace IDs)
- Security testing (authentication, payment, PII)
- Data migration testing (schema change integrity)
- Contract/API testing (microservice contract adherence)
- Performance testing (response time verification)
- Accessibility testing (WCAG AA compliance)
- Other context-specific tests

---

## Relationship to R10

**R10 Covers:**
- Unit tests (mandatory for new features)
- Regression tests (mandatory for bug fixes)
- Integration/E2E tests (recommended)
- Coverage thresholds (80%)
- Test execution and quality

**R16 Covers:**
- Additional context-specific tests (error paths, state machines, tenant isolation, observability, security, etc.)
- Conditional tests (performance, accessibility, property-based, etc.)
- Domain-specific tests (contract/API, data migration, compliance, etc.)

**Rationale:** R10 provides baseline test coverage. R16 ensures comprehensive testing based on change type and domain.

---

## Draft Structure

### Audit Checklist Categories (11 categories, 60+ items)

1. **Error Path Testing** (6 items: 5 MANDATORY, 1 RECOMMENDED)
   - All error scenarios, error categorization, user-friendly messages, error logging

2. **State Machine Testing** (6 items: 5 MANDATORY, 1 RECOMMENDED)
   - Legal/illegal transitions, audit logging, preconditions, side effects

3. **Tenant Isolation Testing** (6 items: 5 MANDATORY, 1 RECOMMENDED)
   - Cross-tenant access prevention, RLS enforcement, tenant context, JWT extraction

4. **Behavior-Diff Testing** (5 items: 4 MANDATORY, 1 RECOMMENDED)
   - Behavior preservation, test coverage, performance characteristics

5. **Preventative Testing** (5 items: 4 MANDATORY, 1 RECOMMENDED)
   - Root cause prevention, pattern detection, error pattern documentation

6. **Observability Testing** (6 items: 5 MANDATORY, 1 RECOMMENDED)
   - Structured logging, trace ID propagation, tenant ID, no console.log

7. **Security Testing** (6 items: 5 MANDATORY, 1 RECOMMENDED)
   - Authentication, authorization, input validation, tenant isolation, audit logging

8. **Data Migration Testing** (6 items: 5 MANDATORY, 1 RECOMMENDED)
   - Migration idempotency, data integrity, rollback capability, RLS maintenance

9. **Contract/API Testing** (5 items: all RECOMMENDED)
   - API contract adherence, breaking changes detection, backward compatibility

10. **Performance Testing** (6 items: all CONDITIONAL)
    - Response time thresholds, performance budgets, N+1 queries, indexes

11. **Accessibility Testing** (5 items: all CONDITIONAL)
    - WCAG AA compliance, ARIA labels, focus management, responsive design

12. **Other Context-Specific Tests** (5 items: all CONDITIONAL)
    - Property-based, snapshot/visual regression, chaos/resilience, concurrency, compliance

13. **Test Quality and Organization** (5 items: 4 MANDATORY, 1 RECOMMENDED)
    - Naming conventions, location conventions, organization, documentation

**Total:** 60+ checklist items (mix of MANDATORY, RECOMMENDED, CONDITIONAL)

---

## Key Decisions Required

### Q1: How should we detect which additional tests are needed?

**Option A:** Pattern matching (file paths, function names, keywords)
- **Pros:** Fast, reliable, simple
- **Cons:** May miss context, false positives/negatives

**Option B:** AST parsing (analyze code structure)
- **Pros:** Accurate, context-aware
- **Cons:** Complex, slower, requires language-specific parsers

**Option C:** Combination approach (pattern matching + AST parsing)
- **Pros:** Fast detection + accurate validation
- **Cons:** More complex implementation

**Recommendation:** Option C (Combination approach)
- Use pattern matching for initial detection (fast)
- Use AST parsing for validation (accurate)
- Example: Detect state machine by pattern (WorkOrderStatus enum) + AST (transition methods)

---

### Q2: How should we verify tests exist for each requirement?

**Option A:** File existence check (look for test files)
- **Pros:** Simple, fast
- **Cons:** Doesn't verify test content, may miss tests in different locations

**Option B:** Test pattern matching (search for test patterns)
- **Pros:** Verifies test content, more accurate
- **Cons:** May miss tests with different naming conventions

**Option C:** AST parsing of test files (analyze test structure)
- **Pros:** Most accurate, verifies test quality
- **Cons:** Complex, slower, requires language-specific parsers

**Recommendation:** Option C (AST parsing of test files)
- Parse test files to verify test structure
- Check for test names matching requirements (e.g., "error path", "state machine", "tenant isolation")
- Verify test assertions match requirements

---

### Q3: How should we handle conditional tests (CONDITIONAL vs MANDATORY)?

**Option A:** Always warn for missing conditional tests
- **Pros:** Ensures comprehensive testing
- **Cons:** May be too strict, many false positives

**Option B:** Only warn when context matches (e.g., UI component → accessibility tests)
- **Pros:** Context-aware, fewer false positives
- **Cons:** Requires context detection logic

**Option C:** Warn for missing conditional tests only when explicitly applicable
- **Pros:** Balanced approach, context-aware
- **Cons:** Requires clear criteria for "explicitly applicable"

**Recommendation:** Option B (Context-aware warnings)
- Detect context (file paths, function names, keywords)
- Only warn for conditional tests when context matches
- Example: Only warn for accessibility tests if file is in `frontend/src/components/`

---

### Q4: How should we categorize tests (error path, state machine, tenant isolation, etc.)?

**Option A:** File-based categorization (separate test files for each category)
- **Pros:** Clear organization, easy to find
- **Cons:** May create many test files, harder to maintain

**Option B:** Describe block-based categorization (nested describe blocks)
- **Pros:** Organized within single file, easier to maintain
- **Cons:** May create large test files

**Option C:** Hybrid approach (file-based for major categories, describe blocks for subcategories)
- **Pros:** Balanced organization, maintainable
- **Cons:** Requires clear guidelines

**Recommendation:** Option C (Hybrid approach)
- Major categories: Separate test files (e.g., `users.service.security.spec.ts`, `users.service.observability.spec.ts`)
- Subcategories: Nested describe blocks (e.g., `describe('Security', () => { describe('Authentication', ...) })`)
- Guidelines: Document in rule file

---

### Q5: How should we validate test quality (structure, organization, documentation)?

**Option A:** Basic validation (test exists, follows naming conventions)
- **Pros:** Simple, fast
- **Cons:** Doesn't verify test quality

**Option B:** Comprehensive validation (test structure, assertions, documentation)
- **Pros:** Ensures high-quality tests
- **Cons:** Complex, may be too strict

**Option C:** Balanced validation (test exists + basic structure + documentation)
- **Pros:** Ensures quality without being too strict
- **Cons:** Requires clear quality criteria

**Recommendation:** Option C (Balanced validation)
- Verify test exists and follows naming conventions
- Verify test has assertions (not just empty test)
- Verify test is documented (test purpose, when to run)
- Don't enforce specific assertion patterns (too strict)

---

## Implementation Approach

### Detection Strategy
1. **Pattern Matching:** Detect test requirements based on file paths, function names, keywords
2. **AST Parsing:** Validate test structure and content
3. **Context Analysis:** Determine which conditional tests are applicable

### Validation Strategy
1. **File Detection:** Find test files for changed code
2. **Test Parsing:** Parse test files to verify test structure
3. **Requirement Matching:** Match tests to requirements (error path, state machine, etc.)
4. **Quality Validation:** Verify test quality (structure, organization, documentation)

### Enforcement Strategy
1. **WARNING-level:** Log violations but don't block PRs
2. **Context-aware:** Only warn for applicable requirements
3. **Clear messages:** Provide specific guidance on what tests are missing

---

## Examples Provided

### ✅ Correct Patterns
- Error path tests with comprehensive error scenario coverage
- State machine tests with legal/illegal transition coverage
- Tenant isolation tests with cross-tenant access prevention
- Observability tests with structured logging and trace ID propagation
- Security tests with authentication, authorization, and input validation

### ❌ Violation Patterns
- Missing error path tests for new features
- Missing state machine tests for stateful components
- Missing tenant isolation tests for multi-tenant features
- Missing observability tests for new features
- Missing security tests for sensitive operations

---

## Review Questions

1. **Q1: Detection Strategy** - Do you agree with Option C (Combination approach: pattern matching + AST parsing)?
2. **Q2: Test Verification** - Do you agree with Option C (AST parsing of test files)?
3. **Q3: Conditional Tests** - Do you agree with Option B (Context-aware warnings)?
4. **Q4: Test Categorization** - Do you agree with Option C (Hybrid approach: file-based + describe blocks)?
5. **Q5: Test Quality Validation** - Do you agree with Option C (Balanced validation)?

---

## Estimated Time

**Implementation:** 2-3 hours
- OPA policy: 0.5 hours (6-8 warnings)
- Automated script: 1-1.5 hours (detection + validation)
- Test suite: 0.5 hours (8-10 test cases)
- Rule file update: 0.5 hours (add audit procedures)
- Documentation: 0.5 hours (completion report)

**Complexity:** LOW-MEDIUM
- Similar to R15 (TODO/FIXME handling)
- Context detection adds complexity
- AST parsing adds complexity

---

## Next Steps

1. **Review Draft:** Read `.cursor/rules/10-quality-R16-DRAFT.md`
2. **Answer Questions:** Provide feedback on 5 review questions
3. **Approve or Request Changes:** Approve draft or request modifications
4. **Implementation:** AI will implement after approval

---

**Status:** AWAITING YOUR REVIEW  
**Prepared By:** AI Assistant  
**Draft Location:** `.cursor/rules/10-quality-R16-DRAFT.md`



