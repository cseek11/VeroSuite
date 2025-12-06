# R22 Review Questions — Detailed Reasoning

**Date:** 2025-12-05  
**Rule:** R22 - Refactor Integrity  
**Purpose:** Provide detailed reasoning for each review question to guide decision-making

---

## Q1: How should we detect refactoring operations?

### Context

R22 needs to identify when a PR contains refactoring operations (code restructuring that maintains behavior) versus new features or bug fixes. This is critical because refactoring has different requirements (behavior-diffing tests, regression tests, risk surface documentation) than other types of changes.

### Option A: PR Description Keywords Only

**Approach:** Detect keywords like "refactor", "restructure", "extract", "rename", "move", "reorganize" in PR title/description.

**Pros:**
- ✅ **Simple and fast:** Pattern matching is straightforward, no AST parsing required
- ✅ **Low complexity:** Easy to implement, minimal dependencies
- ✅ **Explicit intent:** Developers explicitly state refactoring intent
- ✅ **Low false positives:** Keywords are specific to refactoring operations

**Cons:**
- ❌ **May miss refactoring:** Developers may not use keywords, especially for small refactors
- ❌ **False negatives:** Refactoring PRs without keywords won't be detected
- ❌ **Keyword variations:** Different teams may use different terminology
- ❌ **No validation:** Can't verify if PR actually contains refactoring

**Example:**
```markdown
# PR Title: "Refactor WorkOrderService to extract validation logic"
# ✅ Detected: Contains "refactor" keyword

# PR Title: "Extract validation logic from WorkOrderService"
# ✅ Detected: Contains "extract" keyword

# PR Title: "Improve WorkOrderService code organization"
# ❌ Not detected: No explicit refactoring keyword
```

**Use Case:** Best for teams with strict PR title conventions and explicit refactoring documentation.

---

### Option B: Diff Analysis

**Approach:** Analyze code diffs to detect structural changes (function extraction, class reorganization, file moves) without functional changes.

**Pros:**
- ✅ **Comprehensive:** Catches refactoring even without keywords
- ✅ **Accurate:** Verifies actual code changes, not just PR description
- ✅ **No false negatives:** Detects refactoring regardless of PR description
- ✅ **Validates intent:** Confirms PR actually contains refactoring

**Cons:**
- ❌ **Complex:** Requires AST parsing, diff analysis, structural comparison
- ❌ **Slower:** AST parsing and comparison takes more time
- ❌ **False positives:** May detect structural changes that are actually new features
- ❌ **Requires tooling:** Needs AST parsing libraries (TypeScript, Python AST)

**Example:**
```typescript
// BEFORE: Single function
async createWorkOrder(data: CreateWorkOrderDto) {
  // validation logic
  // creation logic
  // return result
}

// AFTER: Extracted validation
async validateWorkOrderData(data: CreateWorkOrderDto) { ... }
async createWorkOrder(data: CreateWorkOrderDto) {
  await this.validateWorkOrderData(data);
  // creation logic
  // return result
}

// ✅ Detected: Function extraction (refactoring pattern)
```

**Use Case:** Best for teams with automated tooling and need comprehensive refactoring detection.

---

### Option C: Pattern Matching + Diff Analysis (Hybrid)

**Approach:** Use keyword matching for fast detection, then validate with diff analysis.

**Pros:**
- ✅ **Fast initial detection:** Keywords catch obvious refactoring PRs quickly
- ✅ **Comprehensive validation:** Diff analysis confirms refactoring and catches missed cases
- ✅ **Balanced:** Good performance with comprehensive coverage
- ✅ **Flexible:** Can adjust sensitivity (keyword-only mode vs. full analysis)

**Cons:**
- ❌ **More complex:** Requires both pattern matching and AST parsing
- ❌ **Slower than Option A:** Diff analysis adds overhead
- ❌ **Requires tooling:** Needs AST parsing libraries

**Example:**
```python
def detect_refactoring(pr_title, pr_body, changed_files):
    # Fast check: Keywords
    if has_refactoring_keywords(pr_title, pr_body):
        return True  # Fast path
    
    # Validation: Diff analysis
    for file in changed_files:
        if is_refactoring_pattern(file.diff):
            return True  # Confirmed refactoring
    
    return False  # Not a refactoring PR
```

**Use Case:** Best for most teams - balances speed and accuracy.

---

### Recommendation: **Option C (Hybrid)**

**Reasoning:**
1. **Performance:** Keyword matching provides fast path for obvious refactoring PRs (80% of cases)
2. **Coverage:** Diff analysis catches refactoring PRs without keywords (20% of cases)
3. **Accuracy:** Diff analysis validates refactoring intent, reducing false positives
4. **Flexibility:** Can adjust sensitivity based on team needs
5. **Industry standard:** Most refactoring detection tools use hybrid approach

**Implementation Strategy:**
- **Phase 1:** Start with keyword matching (fast, simple)
- **Phase 2:** Add diff analysis for validation (comprehensive)
- **Phase 3:** Tune sensitivity based on false positive/negative rates

---

## Q2: How should we verify behavior-diffing tests exist?

### Context

R22 requires behavior-diffing tests that document current behavior before refactoring and verify behavior unchanged after refactoring. We need to verify these tests exist and actually test behavior (not just structure).

### Option A: File Name Pattern Matching

**Approach:** Check for test files matching refactored code (e.g., `work-orders.service.ts` → `work-orders.service.spec.ts`).

**Pros:**
- ✅ **Simple:** Pattern matching is straightforward
- ✅ **Fast:** No file content parsing required
- ✅ **Reliable:** Test file naming conventions are consistent
- ✅ **Low complexity:** Easy to implement

**Cons:**
- ❌ **Doesn't verify quality:** Can't verify tests actually test behavior
- ❌ **May miss tests:** Tests with different naming won't be detected
- ❌ **False positives:** Test files may exist but not test behavior
- ❌ **No validation:** Can't verify test coverage or quality

**Example:**
```typescript
// Refactored file: apps/api/src/work-orders/work-orders.service.ts
// ✅ Detected: apps/api/src/work-orders/work-orders.service.spec.ts exists

// ❌ Not detected: apps/api/src/work-orders/__tests__/work-orders.test.ts
// ❌ Not detected: apps/api/src/work-orders/work-orders.behavior.spec.ts
```

**Use Case:** Best for teams with strict test file naming conventions.

---

### Option B: AST Parsing

**Approach:** Parse test file AST to verify behavior tests exist (check for behavior test patterns, assertions, coverage).

**Pros:**
- ✅ **Verifies quality:** Checks that tests actually test behavior
- ✅ **Comprehensive:** Detects behavior tests regardless of file naming
- ✅ **Validates coverage:** Can verify behavior coverage (happy paths, errors, edge cases)
- ✅ **Accurate:** Confirms tests are behavior-diffing tests, not just unit tests

**Cons:**
- ❌ **Complex:** Requires AST parsing, test pattern recognition
- ❌ **Slower:** AST parsing takes more time than pattern matching
- ❌ **Requires tooling:** Needs AST parsing libraries
- ❌ **False positives:** May misidentify test types

**Example:**
```typescript
// Test file content analysis
describe('WorkOrderService - Current Behavior', () => {
  it('should create work order with customer', async () => {
    // ✅ Detected: Behavior test (describes behavior, not structure)
    expect(result.customer_id).toBe('customer-123');
    expect(result.status).toBe('PENDING');
  });
});

// vs.

describe('WorkOrderService', () => {
  it('should call validateWorkOrderData', () => {
    // ❌ Not detected: Structure test (tests implementation, not behavior)
    expect(service.validateWorkOrderData).toHaveBeenCalled();
  });
});
```

**Use Case:** Best for teams with automated tooling and need quality verification.

---

### Option C: File Name Pattern + Test Content Analysis (Hybrid)

**Approach:** Use file name pattern for fast detection, then analyze test content to verify behavior coverage.

**Pros:**
- ✅ **Fast initial detection:** File name pattern catches test files quickly
- ✅ **Quality verification:** Test content analysis verifies behavior coverage
- ✅ **Comprehensive:** Catches tests with different naming via content analysis
- ✅ **Balanced:** Good performance with quality verification

**Cons:**
- ❌ **More complex:** Requires both pattern matching and AST parsing
- ❌ **Slower than Option A:** Content analysis adds overhead
- ❌ **Requires tooling:** Needs AST parsing libraries

**Example:**
```python
def verify_behavior_tests(refactored_file, test_files):
    # Fast check: File name pattern
    matching_tests = find_matching_test_files(refactored_file, test_files)
    
    if not matching_tests:
        # Fallback: Content analysis
        matching_tests = find_behavior_tests_by_content(refactored_file, test_files)
    
    # Quality check: Verify behavior coverage
    for test_file in matching_tests:
        if has_behavior_coverage(test_file):
            return True  # Behavior tests exist and cover behavior
    
    return False  # No behavior tests found
```

**Use Case:** Best for most teams - balances speed and quality verification.

---

### Recommendation: **Option C (Hybrid)**

**Reasoning:**
1. **Performance:** File name pattern provides fast path for standard test files (90% of cases)
2. **Quality:** Content analysis verifies tests actually test behavior, not just structure
3. **Coverage:** Content analysis catches tests with different naming (10% of cases)
4. **Accuracy:** Verifies behavior coverage (happy paths, errors, edge cases, side effects)
5. **Industry standard:** Most test verification tools use hybrid approach

**Implementation Strategy:**
- **Phase 1:** Start with file name pattern matching (fast, simple)
- **Phase 2:** Add content analysis for quality verification (comprehensive)
- **Phase 3:** Tune behavior test detection patterns based on team conventions

---

## Q3: How should we detect breaking changes in refactors?

### Context

R22 requires that refactors maintain behavior and don't introduce breaking changes (unless explicitly documented). We need to detect breaking changes in API contracts, error messages, function signatures, and return types.

### Option A: API Contract Comparison

**Approach:** Compare function signatures, return types, parameter types before/after refactoring.

**Pros:**
- ✅ **Catches obvious breaking changes:** Function signature changes are clear breaking changes
- ✅ **Fast:** Simple type comparison, no behavior analysis
- ✅ **Reliable:** Type changes are definitive breaking changes
- ✅ **Low complexity:** Easy to implement with TypeScript AST

**Cons:**
- ❌ **May miss subtle breaking changes:** Behavior changes without type changes
- ❌ **Doesn't check error messages:** Error message changes are breaking changes
- ❌ **Doesn't check behavior:** Behavior changes without type changes
- ❌ **False negatives:** May miss breaking changes in error handling

**Example:**
```typescript
// BEFORE
async createWorkOrder(data: CreateWorkOrderDto): Promise<WorkOrder> {
  // ...
}

// AFTER: Breaking change (return type changed)
async createWorkOrder(data: CreateWorkOrderDto): Promise<WorkOrderResponse> {
  // ...
}
// ✅ Detected: Return type changed (breaking change)

// AFTER: Subtle breaking change (error message changed)
async createWorkOrder(data: CreateWorkOrderDto): Promise<WorkOrder> {
  if (!data.customer_id) {
    throw new Error('Customer ID is required');  // Changed from 'Customer not found'
  }
}
// ❌ Not detected: Error message changed (breaking change, but type unchanged)
```

**Use Case:** Best for teams focusing on API contract stability.

---

### Option B: Diff Analysis

**Approach:** Analyze code diffs to detect all breaking changes (API contracts, error messages, behavior).

**Pros:**
- ✅ **Comprehensive:** Catches all breaking changes (API, errors, behavior)
- ✅ **Accurate:** Verifies actual code changes, not just types
- ✅ **No false negatives:** Detects breaking changes regardless of type changes
- ✅ **Validates behavior:** Can verify behavior unchanged

**Cons:**
- ❌ **Complex:** Requires AST parsing, diff analysis, behavior comparison
- ❌ **Slower:** Diff analysis takes more time
- ❌ **False positives:** May detect non-breaking changes as breaking
- ❌ **Requires tooling:** Needs AST parsing and diff libraries

**Example:**
```typescript
// BEFORE
async createWorkOrder(data: CreateWorkOrderDto) {
  if (!data.customer_id) {
    throw new Error('Customer not found');
  }
  // ...
}

// AFTER: Error message changed
async createWorkOrder(data: CreateWorkOrderDto) {
  if (!data.customer_id) {
    throw new Error('Customer ID is required');  // ✅ Detected: Error message changed
  }
  // ...
}
```

**Use Case:** Best for teams with automated tooling and need comprehensive breaking change detection.

---

### Option C: API Contract + Error Message Comparison (Hybrid)

**Approach:** Compare API contracts for fast detection, then check error messages for validation.

**Pros:**
- ✅ **Fast initial detection:** API contract comparison catches obvious breaking changes
- ✅ **Comprehensive validation:** Error message comparison catches subtle breaking changes
- ✅ **Balanced:** Good performance with comprehensive coverage
- ✅ **Flexible:** Can adjust sensitivity (API-only mode vs. full analysis)

**Cons:**
- ❌ **More complex:** Requires both contract and message comparison
- ❌ **Slower than Option A:** Error message comparison adds overhead
- ❌ **May miss behavior changes:** Doesn't check behavior changes without type/error changes

**Example:**
```python
def detect_breaking_changes(before_code, after_code):
    # Fast check: API contract
    if api_contract_changed(before_code, after_code):
        return True  # Breaking change detected
    
    # Validation: Error messages
    if error_messages_changed(before_code, after_code):
        return True  # Breaking change detected
    
    return False  # No breaking changes
```

**Use Case:** Best for most teams - balances speed and accuracy.

---

### Recommendation: **Option C (Hybrid)**

**Reasoning:**
1. **Performance:** API contract comparison provides fast path for obvious breaking changes (80% of cases)
2. **Coverage:** Error message comparison catches subtle breaking changes (20% of cases)
3. **Accuracy:** Catches both API and error message breaking changes
4. **Flexibility:** Can adjust sensitivity based on team needs
5. **Industry standard:** Most breaking change detection tools use hybrid approach

**Implementation Strategy:**
- **Phase 1:** Start with API contract comparison (fast, simple)
- **Phase 2:** Add error message comparison for validation (comprehensive)
- **Phase 3:** Consider behavior analysis for edge cases (if needed)

---

## Q4: How should we verify risk surface documentation?

### Context

R22 requires risk surface documentation that lists files affected, dependencies, breaking changes, migration steps, and rollback plan. We need to verify this documentation exists and is complete.

### Option A: PR Description Keyword Matching

**Approach:** Check PR description for keywords like "risk surface", "files affected", "dependencies", "breaking changes".

**Pros:**
- ✅ **Simple:** Pattern matching is straightforward
- ✅ **Fast:** No content parsing required
- ✅ **Reliable:** Keywords are specific to risk surface documentation
- ✅ **Low complexity:** Easy to implement

**Cons:**
- ❌ **Doesn't verify completeness:** Can't verify all required sections present
- ❌ **May miss documentation:** Documentation in other locations won't be detected
- ❌ **False positives:** Keywords may exist but documentation incomplete
- ❌ **No validation:** Can't verify documentation quality

**Example:**
```markdown
# PR Description
⚠️ REFACTOR RISK SURFACE

Files Affected:
- apps/api/src/work-orders/work-orders.service.ts

# ✅ Detected: Contains "risk surface" and "files affected" keywords
# ❌ Not verified: Dependencies, breaking changes, migration, rollback plan missing
```

**Use Case:** Best for teams with strict PR description templates.

---

### Option B: Structured Documentation Parsing

**Approach:** Parse risk surface documentation format to verify all required sections present.

**Pros:**
- ✅ **Verifies completeness:** Checks for all required sections (files, dependencies, breaking changes, migration, rollback)
- ✅ **Accurate:** Confirms documentation is complete, not just present
- ✅ **Validates format:** Ensures documentation follows standard format
- ✅ **No false positives:** Only passes if all sections present

**Cons:**
- ❌ **Complex:** Requires structured format parsing
- ❌ **Strict:** May be too strict for teams with flexible documentation
- ❌ **Requires format:** Teams must follow specific documentation format
- ❌ **Slower:** Parsing takes more time than keyword matching

**Example:**
```markdown
# Required format:
⚠️ REFACTOR RISK SURFACE

Files Affected:
- file1.ts
- file2.ts

Dependencies:
- dependency1
- dependency2

Breaking Changes:
- None

Migration Required:
- No migration needed

Rollback Plan:
- Revert commit if tests fail

# ✅ Verified: All required sections present
# ❌ Fails: Missing "Dependencies" section
```

**Use Case:** Best for teams with standardized documentation formats.

---

### Option C: Keyword Matching + Completeness Check (Hybrid)

**Approach:** Use keyword matching for fast detection, then verify required sections present.

**Pros:**
- ✅ **Fast initial detection:** Keyword matching catches documentation quickly
- ✅ **Completeness verification:** Checks for all required sections
- ✅ **Flexible:** Can adjust required sections based on team needs
- ✅ **Balanced:** Good performance with completeness verification

**Cons:**
- ❌ **More complex:** Requires both keyword matching and completeness check
- ❌ **Slower than Option A:** Completeness check adds overhead
- ❌ **May be too strict:** Some teams may have flexible documentation

**Example:**
```python
def verify_risk_surface_documentation(pr_description):
    # Fast check: Keywords
    if not has_risk_surface_keywords(pr_description):
        return False  # No risk surface documentation
    
    # Validation: Completeness
    required_sections = [
        'files affected',
        'dependencies',
        'breaking changes',
        'migration',
        'rollback plan'
    ]
    
    for section in required_sections:
        if not has_section(pr_description, section):
            return False  # Incomplete documentation
    
    return True  # Complete risk surface documentation
```

**Use Case:** Best for most teams - balances speed and completeness verification.

---

### Recommendation: **Option C (Hybrid)**

**Reasoning:**
1. **Performance:** Keyword matching provides fast path for obvious documentation (90% of cases)
2. **Completeness:** Completeness check verifies all required sections present
3. **Flexibility:** Can adjust required sections based on team needs
4. **Accuracy:** Catches both missing documentation and incomplete documentation
5. **Industry standard:** Most documentation verification tools use hybrid approach

**Implementation Strategy:**
- **Phase 1:** Start with keyword matching (fast, simple)
- **Phase 2:** Add completeness check for validation (comprehensive)
- **Phase 3:** Tune required sections based on team feedback

---

## Q5: How should we verify refactor stability?

### Context

R22 requires that code is stable before refactoring (all tests passing, no active bugs, not in active development, dependencies stable). We need to verify these stability criteria.

### Option A: Test Status Check Only

**Approach:** Check if tests are passing for code being refactored.

**Pros:**
- ✅ **Simple:** Test status check is straightforward
- ✅ **Fast:** Quick API call to CI/CD system
- ✅ **Reliable:** Test failures are clear stability issues
- ✅ **Low complexity:** Easy to implement

**Cons:**
- ❌ **Incomplete:** Doesn't check other stability criteria (bugs, active development, dependencies)
- ❌ **False negatives:** Code may have passing tests but other stability issues
- ❌ **May miss issues:** Active bugs or concurrent development not detected

**Example:**
```typescript
// Code being refactored: work-orders.service.ts
// ✅ Tests passing: All tests pass
// ❌ Not checked: Known bug in work-orders.service.ts (Issue #123)
// ❌ Not checked: Active PR modifying work-orders.service.ts
// ❌ Not checked: Unstable dependency (library v1.0.0-beta)
```

**Use Case:** Best for teams with minimal stability requirements.

---

### Option B: Comprehensive Stability Check

**Approach:** Check all stability criteria (tests, bugs, active development, dependencies).

**Pros:**
- ✅ **Comprehensive:** Verifies all stability criteria
- ✅ **Accurate:** Catches all stability issues, not just test failures
- ✅ **No false negatives:** Detects all stability problems
- ✅ **Validates safety:** Ensures refactoring is safe

**Cons:**
- ❌ **Complex:** Requires multiple checks (tests, bugs, PRs, dependencies)
- ❌ **Slower:** Multiple API calls and checks take more time
- ❌ **Requires integrations:** Needs access to issue tracker, PR system, dependency registry
- ❌ **May be too strict:** Some teams may have different stability criteria

**Example:**
```python
def verify_refactor_stability(file_path):
    # Check 1: Tests passing
    if not tests_passing(file_path):
        return False  # Tests failing
    
    # Check 2: No known bugs
    if has_known_bugs(file_path):
        return False  # Known bugs exist
    
    # Check 3: Not in active development
    if has_active_prs(file_path):
        return False  # Active PRs modifying file
    
    # Check 4: Dependencies stable
    if has_unstable_dependencies(file_path):
        return False  # Unstable dependencies
    
    return True  # Code is stable
```

**Use Case:** Best for teams with strict stability requirements and automated tooling.

---

### Option C: Test Status + Bug Check (Hybrid)

**Approach:** Check test status and known bugs, skip active development and dependency checks.

**Pros:**
- ✅ **Balanced:** Checks most important stability criteria
- ✅ **Faster than Option B:** Fewer checks than comprehensive approach
- ✅ **Catches major issues:** Test failures and known bugs are critical
- ✅ **Reasonable complexity:** Not too simple, not too complex

**Cons:**
- ❌ **May miss issues:** Active development or dependency issues not detected
- ❌ **Incomplete:** Doesn't check all stability criteria
- ❌ **False negatives:** May miss stability issues in active development or dependencies

**Example:**
```python
def verify_refactor_stability(file_path):
    # Check 1: Tests passing
    if not tests_passing(file_path):
        return False  # Tests failing
    
    # Check 2: No known bugs
    if has_known_bugs(file_path):
        return False  # Known bugs exist
    
    # ✅ Not checked: Active development (may be acceptable)
    # ✅ Not checked: Dependencies (may be acceptable)
    
    return True  # Code is stable (based on tests and bugs)
```

**Use Case:** Best for teams with moderate stability requirements.

---

### Recommendation: **Option B (Comprehensive)**

**Reasoning:**
1. **Safety:** Refactoring unstable code is risky - comprehensive checks ensure safety
2. **Critical criteria:** All stability criteria (tests, bugs, active development, dependencies) are important
3. **Prevents issues:** Catches stability problems before they cause refactoring failures
4. **Industry standard:** Most refactoring tools check all stability criteria
5. **Worth the complexity:** Safety is worth the additional complexity

**Implementation Strategy:**
- **Phase 1:** Start with test status check (fast, simple)
- **Phase 2:** Add bug check (important for safety)
- **Phase 3:** Add active development check (prevents conflicts)
- **Phase 4:** Add dependency check (ensures stability)

**Note:** Can make some checks optional (e.g., dependency check) based on team needs, but tests and bugs should always be checked.

---

## Summary of Recommendations

| Question | Recommended Option | Reasoning |
|----------|-------------------|-----------|
| Q1: Refactoring Detection | **Option C (Hybrid)** | Balances speed (keywords) with accuracy (diff analysis) |
| Q2: Behavior Test Verification | **Option C (Hybrid)** | Balances speed (file names) with quality (content analysis) |
| Q3: Breaking Change Detection | **Option C (Hybrid)** | Balances speed (API contract) with coverage (error messages) |
| Q4: Risk Surface Documentation | **Option C (Hybrid)** | Balances speed (keywords) with completeness (section check) |
| Q5: Refactor Stability | **Option B (Comprehensive)** | Safety is worth the complexity - all criteria are important |

---

## Implementation Priority

### Phase 1 (MVP - 1 hour)
1. Keyword-based refactoring detection (Q1)
2. File name pattern for behavior tests (Q2)
3. API contract comparison for breaking changes (Q3)
4. Keyword matching for risk surface (Q4)
5. Test status check for stability (Q5)

### Phase 2 (Core Features - 1 hour)
6. Diff analysis for refactoring validation (Q1)
7. Test content analysis for behavior verification (Q2)
8. Error message comparison for breaking changes (Q3)
9. Completeness check for risk surface (Q4)
10. Bug check for stability (Q5)

### Phase 3 (Polish - 0.5 hours)
11. Active development check for stability (Q5)
12. Dependency check for stability (Q5)
13. Tuning and optimization

---

## Key Insights

1. **Hybrid Approach:** Most questions benefit from hybrid approach (fast detection + comprehensive validation)
2. **Safety First:** Q5 (stability) should be comprehensive - safety is worth the complexity
3. **Progressive Enhancement:** Start with simple checks, add validation layers incrementally
4. **Team Flexibility:** Allow teams to adjust sensitivity and required sections
5. **Industry Standards:** Follow established patterns from refactoring tools and best practices

---

**Last Updated:** 2025-12-05  
**Status:** Ready for Review





