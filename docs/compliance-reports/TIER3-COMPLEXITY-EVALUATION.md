# Tier 3 Rules Complexity Evaluation

**Date:** 2025-12-05  
**Purpose:** Evaluate complexity of all Tier 3 rules (R14-R25) to prioritize implementation  
**Total Rules:** 12  
**Enforcement Level:** WARNING (doesn't block PRs)

---

## Complexity Factors

### Assessment Criteria

1. **Checklist Items:** Number of mandatory/recommended checks (20-30 for Tier 3)
2. **Detection Logic:** Complexity of automated detection (pattern matching, AST parsing, heuristics)
3. **OPA Policy Complexity:** Number of warning patterns, helper functions needed
4. **Script Complexity:** Lines of code, external dependencies, analysis depth
5. **Test Suite Size:** Number of test cases (10-15 for Tier 3)
6. **Integration Complexity:** Dependencies on other rules, existing infrastructure
7. **Domain Knowledge:** Specialized knowledge required (WCAG, performance metrics, etc.)

### Complexity Levels

- **LOW:** Simple pattern matching, basic validation, minimal domain knowledge
- **MEDIUM:** Moderate pattern matching + AST parsing, some domain knowledge
- **MEDIUM-HIGH:** Complex detection logic, specialized domain knowledge, multiple validators
- **HIGH:** Very complex detection, deep domain expertise, multiple integrations

---

## Rule-by-Rule Complexity Analysis

### R14: Tech Debt Logging ⚠️ **MEDIUM**

**Rule File:** `12-tech-debt.mdc`  
**OPA Policy:** `tech-debt.rego` (create if needed)  
**Script:** `check-tech-debt.py`

#### Complexity Breakdown

- **Checklist Items:** 28 (within Tier 3 range)
- **Detection Logic:** MEDIUM
  - Pattern matching: Workarounds, deferred fixes, deprecated patterns
  - Markdown parsing: Validate `docs/tech-debt.md` entry format
  - Date validation: Verify current system date usage
  - Template validation: Compare against template structure
- **OPA Policy:** MEDIUM (8 warning patterns)
- **Script Complexity:** MEDIUM (pattern matching + markdown parsing + date validation)
- **Test Suite:** 12 test cases
- **Integration:** Low (integrates with R02 date handling)
- **Domain Knowledge:** Low (general tech debt concepts)

#### Estimated Time: **2.5 hours**

**Rationale:**
- Moderate complexity due to markdown parsing and template validation
- Date validation integration adds some complexity
- Pattern matching for debt detection is straightforward
- **Status:** ✅ Draft already created

---

### R15: TODO/FIXME Handling ⚠️ **MEDIUM**

**Rule File:** `12-tech-debt.mdc`  
**OPA Policy:** `tech-debt.rego` (extend R14)  
**Script:** `check-todo-fixme.py`

#### Complexity Breakdown

- **Checklist Items:** 25 (within Tier 3 range)
- **Detection Logic:** MEDIUM
  - Pattern matching: Detect TODO/FIXME comments
  - AST parsing: Analyze comment context (code vs documentation)
  - Heuristic check: Distinguish meaningful TODOs from trivial ones
  - Cross-reference: Verify TODOs are logged in `docs/tech-debt.md` or resolved
- **OPA Policy:** MEDIUM (6 warning patterns)
- **Script Complexity:** MEDIUM (pattern matching + AST parsing + heuristic analysis)
- **Test Suite:** 12 test cases
- **Integration:** Medium (integrates with R14 tech debt logging)
- **Domain Knowledge:** Low (general TODO/FIXME patterns)

#### Estimated Time: **2.5 hours**

**Rationale:**
- Similar complexity to R14 (can reuse patterns)
- Heuristic analysis for meaningful vs trivial TODOs adds complexity
- Cross-referencing with tech-debt.md requires markdown parsing
- **Status:** ⏳ Not started

---

### R16: Testing Requirements (Additional) ⚠️ **MEDIUM**

**Rule File:** `10-quality.mdc`  
**OPA Policy:** `quality.rego` (extend R10)  
**Script:** `check-testing-requirements.py` (extend existing)

#### Complexity Breakdown

- **Checklist Items:** 22 (within Tier 3 range)
- **Detection Logic:** MEDIUM
  - Pattern matching: Detect test file existence (`.spec.ts`, `.test.ts`)
  - AST parsing: Analyze test structure (describe, it, expect)
  - Coverage analysis: Verify test coverage thresholds (80%)
  - Test execution: Verify tests run and pass (CI integration)
- **OPA Policy:** MEDIUM (5 warning patterns)
- **Script Complexity:** MEDIUM (pattern matching + AST parsing + coverage analysis)
- **Test Suite:** 10 test cases
- **Integration:** Medium (extends R10, integrates with CI/CD)
- **Domain Knowledge:** Medium (testing frameworks, coverage tools)

#### Estimated Time: **2 hours**

**Rationale:**
- Extends existing R10 (can reuse patterns)
- Coverage analysis requires integration with coverage tools
- Test execution verification requires CI/CD integration
- **Status:** ⏳ Not started

---

### R17: Coverage Requirements ⚠️ **MEDIUM**

**Rule File:** `10-quality.mdc`  
**OPA Policy:** `quality.rego` (extend R10/R16)  
**Script:** `check-coverage-requirements.py`

#### Complexity Breakdown

- **Checklist Items:** 20 (within Tier 3 range)
- **Detection Logic:** MEDIUM
  - Coverage parsing: Parse coverage reports (JSON, LCOV, HTML)
  - Threshold validation: Verify coverage ≥ 80% (statements, branches, functions, lines)
  - Delta calculation: Calculate coverage delta for new code
  - Trend analysis: Track coverage trends over time
- **OPA Policy:** MEDIUM (4 warning patterns)
- **Script Complexity:** MEDIUM (coverage parsing + threshold validation + delta calculation)
- **Test Suite:** 10 test cases
- **Integration:** Medium (extends R10/R16, integrates with coverage tools)
- **Domain Knowledge:** Medium (coverage tools, metrics)

#### Estimated Time: **2 hours**

**Rationale:**
- Coverage parsing requires handling multiple formats
- Delta calculation requires diff analysis
- Threshold validation is straightforward
- **Status:** ⏳ Not started

---

### R18: Performance Budgets ⚠️ **MEDIUM-HIGH**

**Rule File:** `10-quality.mdc`  
**OPA Policy:** `quality.rego` (extend R10)  
**Script:** `check-performance-budgets.py`

#### Complexity Breakdown

- **Checklist Items:** 24 (within Tier 3 range)
- **Detection Logic:** MEDIUM-HIGH
  - Performance metrics: Parse performance reports (Lighthouse, Web Vitals, API latency)
  - Budget validation: Verify metrics within budgets (FCP < 1.5s, LCP < 2s, API < 200ms)
  - N+1 detection: Detect N+1 query patterns (AST parsing)
  - Redundant call detection: Detect redundant API calls (AST parsing)
- **OPA Policy:** MEDIUM-HIGH (6 warning patterns)
- **Script Complexity:** MEDIUM-HIGH (performance parsing + budget validation + N+1 detection)
- **Test Suite:** 12 test cases
- **Integration:** Medium (integrates with performance monitoring tools)
- **Domain Knowledge:** MEDIUM-HIGH (performance metrics, optimization patterns)

#### Estimated Time: **3 hours**

**Rationale:**
- Performance metrics parsing requires handling multiple formats
- N+1 detection requires complex AST analysis
- Budget validation requires understanding performance budgets
- **Status:** ⏳ Not started

---

### R19: Accessibility Requirements ⚠️ **MEDIUM-HIGH**

**Rule File:** `13-ux-consistency.mdc`  
**OPA Policy:** `ux.rego` (create if needed)  
**Script:** `check-accessibility.py`

#### Complexity Breakdown

- **Checklist Items:** 26 (within Tier 3 range)
- **Detection Logic:** MEDIUM-HIGH
  - WCAG validation: Verify WCAG 2.1 AA compliance (aria-*, role, keyboard navigation)
  - AST parsing: Analyze React/HTML structure for accessibility attributes
  - Contrast validation: Verify color contrast ratios (requires color parsing)
  - Keyboard navigation: Verify keyboard navigation patterns (complex analysis)
- **OPA Policy:** MEDIUM-HIGH (7 warning patterns)
- **Script Complexity:** MEDIUM-HIGH (WCAG validation + AST parsing + contrast validation)
- **Test Suite:** 12 test cases
- **Integration:** Low (standalone accessibility checks)
- **Domain Knowledge:** MEDIUM-HIGH (WCAG 2.1, accessibility patterns)

#### Estimated Time: **3 hours**

**Rationale:**
- WCAG validation requires specialized knowledge
- Contrast validation requires color parsing and calculation
- Keyboard navigation analysis is complex
- **Status:** ⏳ Not started

---

### R20: UX Consistency ⚠️ **MEDIUM**

**Rule File:** `13-ux-consistency.mdc`  
**OPA Policy:** `ux.rego` (extend R19)  
**Script:** `check-ux-consistency.py`

#### Complexity Breakdown

- **Checklist Items:** 22 (within Tier 3 range)
- **Detection Logic:** MEDIUM
  - Pattern matching: Detect spacing patterns (`p-6`, `space-y-*`)
  - AST parsing: Analyze typography patterns (`text-xl`, `text-base`)
  - Design system validation: Verify design system component usage
  - Consistency checks: Compare against existing screens/components
- **OPA Policy:** MEDIUM (5 warning patterns)
- **Script Complexity:** MEDIUM (pattern matching + AST parsing + design system validation)
- **Test Suite:** 10 test cases
- **Integration:** Medium (integrates with design system catalog)
- **Domain Knowledge:** Medium (design systems, Tailwind CSS patterns)

#### Estimated Time: **2.5 hours**

**Rationale:**
- Design system validation requires catalog parsing
- Consistency checks require comparison logic
- Pattern matching is straightforward
- **Status:** ⏳ Not started

---

### R21: File Organization ⚠️ **LOW-MEDIUM**

**Rule File:** `04-architecture.mdc`  
**OPA Policy:** `architecture.rego` (extend R03)  
**Script:** `check-file-organization.py`

#### Complexity Breakdown

- **Checklist Items:** 18 (within Tier 3 range)
- **Detection Logic:** LOW-MEDIUM
  - Path validation: Verify file paths match monorepo structure
  - Pattern matching: Detect deprecated paths (`backend/src/` → `apps/api/src/`)
  - Directory structure: Verify directory organization (components, hooks, types)
  - Naming conventions: Verify file naming conventions
- **OPA Policy:** LOW-MEDIUM (4 warning patterns)
- **Script Complexity:** LOW-MEDIUM (path validation + pattern matching)
- **Test Suite:** 10 test cases
- **Integration:** Low (extends R03, simple path validation)
- **Domain Knowledge:** Low (monorepo structure, naming conventions)

#### Estimated Time: **1.5 hours**

**Rationale:**
- Simple path validation
- Pattern matching for deprecated paths
- Minimal domain knowledge required
- **Status:** ⏳ Not started

---

### R22: Refactor Integrity ⚠️ **MEDIUM**

**Rule File:** `04-architecture.mdc`  
**OPA Policy:** `architecture.rego` (extend R03/R21)  
**Script:** `check-refactor-integrity.py`

#### Complexity Breakdown

- **Checklist Items:** 20 (within Tier 3 range)
- **Detection Logic:** MEDIUM
  - AST parsing: Analyze refactored code structure
  - Diff analysis: Compare before/after refactoring
  - Safety checks: Verify refactoring maintains functionality (test coverage, behavior)
  - Breaking change detection: Detect breaking changes in refactoring
- **OPA Policy:** MEDIUM (5 warning patterns)
- **Script Complexity:** MEDIUM (AST parsing + diff analysis + safety checks)
- **Test Suite:** 10 test cases
- **Integration:** Medium (integrates with testing, coverage)
- **Domain Knowledge:** Medium (refactoring patterns, safety checks)

#### Estimated Time: **2.5 hours**

**Rationale:**
- Diff analysis requires complex comparison logic
- Safety checks require test coverage analysis
- Breaking change detection requires contract analysis
- **Status:** ⏳ Not started

---

### R23: Tooling Compliance ⚠️ **LOW-MEDIUM**

**Rule File:** `11-operations.mdc`  
**OPA Policy:** `operations.rego` (create if needed)  
**Script:** `check-tooling-compliance.py`

#### Complexity Breakdown

- **Checklist Items:** 16 (within Tier 3 range)
- **Detection Logic:** LOW-MEDIUM
  - Lint validation: Verify ESLint/TSLint compliance
  - Format validation: Verify Prettier/formatting compliance
  - TypeScript validation: Verify TypeScript strict mode compliance
  - Config validation: Verify tooling configuration files exist
- **OPA Policy:** LOW-MEDIUM (4 warning patterns)
- **Script Complexity:** LOW-MEDIUM (lint/format validation + config validation)
- **Test Suite:** 8 test cases
- **Integration:** Low (integrates with existing lint/format tools)
- **Domain Knowledge:** Low (linting, formatting tools)

#### Estimated Time: **1.5 hours**

**Rationale:**
- Simple validation of existing tool outputs
- Config validation is straightforward
- Minimal domain knowledge required
- **Status:** ⏳ Not started

---

### R24: Cross-Platform Compatibility ⚠️ **MEDIUM-HIGH**

**Rule File:** `09-frontend.mdc`  
**OPA Policy:** `frontend.rego` (create if needed)  
**Script:** `check-cross-platform.py`

#### Complexity Breakdown

- **Checklist Items:** 24 (within Tier 3 range)
- **Detection Logic:** MEDIUM-HIGH
  - Platform detection: Detect platform-specific code (web vs mobile)
  - API validation: Verify platform-abstracted APIs (localStorage vs AsyncStorage)
  - Path validation: Verify cross-platform path handling (path separators, case sensitivity)
  - Date/time validation: Verify timezone/locale handling
  - Network validation: Verify connectivity checks, offline handling
- **OPA Policy:** MEDIUM-HIGH (6 warning patterns)
- **Script Complexity:** MEDIUM-HIGH (platform detection + API validation + path validation)
- **Test Suite:** 12 test cases
- **Integration:** Medium (integrates with React Native, web platforms)
- **Domain Knowledge:** MEDIUM-HIGH (React Native, cross-platform patterns)

#### Estimated Time: **3 hours**

**Rationale:**
- Platform detection requires understanding React Native vs web
- API validation requires knowledge of platform-specific APIs
- Path validation requires understanding OS differences
- **Status:** ⏳ Not started

---

### R25: Workflow Trigger Configuration ⚠️ **LOW-MEDIUM**

**Rule File:** `11-operations.mdc`  
**OPA Policy:** `operations.rego` (extend R23)  
**Script:** `check-workflow-triggers.py`

#### Complexity Breakdown

- **Checklist Items:** 18 (within Tier 3 range)
- **Detection Logic:** LOW-MEDIUM
  - YAML parsing: Parse GitHub Actions workflow files
  - Trigger validation: Verify `on:` section exists and is correct
  - Workflow name validation: Verify `workflow_run` triggers match workflow names
  - Artifact validation: Verify artifact names are consistent
- **OPA Policy:** LOW-MEDIUM (4 warning patterns)
- **Script Complexity:** LOW-MEDIUM (YAML parsing + trigger validation)
- **Test Suite:** 10 test cases
- **Integration:** Low (integrates with GitHub Actions)
- **Domain Knowledge:** Low (GitHub Actions, YAML)

#### Estimated Time: **1.5 hours**

**Rationale:**
- YAML parsing is straightforward
- Trigger validation is simple pattern matching
- Minimal domain knowledge required
- **Status:** ⏳ Not started

---

## Quick Reference Table

| Rule | Name | Complexity | Est. Time | Dependencies | Status |
|------|------|------------|-----------|--------------|--------|
| R14 | Tech Debt Logging | MEDIUM | 2.5h | R02 (dates) | ✅ Draft |
| R15 | TODO/FIXME Handling | MEDIUM | 2.5h | R14 | ⏳ Pending |
| R16 | Testing Requirements | MEDIUM | 2h | R10 | ⏳ Pending |
| R17 | Coverage Requirements | MEDIUM | 2h | R16 | ⏳ Pending |
| R18 | Performance Budgets | MEDIUM-HIGH | 3h | None | ⏳ Pending |
| R19 | Accessibility Requirements | MEDIUM-HIGH | 3h | None | ⏳ Pending |
| R20 | UX Consistency | MEDIUM | 2.5h | R19 | ⏳ Pending |
| R21 | File Organization | LOW-MEDIUM | 1.5h | R03 | ⏳ Pending |
| R22 | Refactor Integrity | MEDIUM | 2.5h | R21 | ⏳ Pending |
| R23 | Tooling Compliance | LOW-MEDIUM | 1.5h | None | ⏳ Pending |
| R24 | Cross-Platform Compatibility | MEDIUM-HIGH | 3h | None | ⏳ Pending |
| R25 | Workflow Trigger Configuration | LOW-MEDIUM | 1.5h | R23 | ⏳ Pending |

**Total:** 12 rules, **29.5 hours** estimated

---

## Summary by Complexity Level

### LOW-MEDIUM Complexity (4 rules) - **6 hours total**
- R21: File Organization (1.5h)
- R23: Tooling Compliance (1.5h)
- R25: Workflow Trigger Configuration (1.5h)
- R14: Tech Debt Logging (2.5h) ✅ Draft created
- **Subtotal:** 7 hours (includes R14)

### MEDIUM Complexity (5 rules) - **12 hours total**
- R15: TODO/FIXME Handling (2.5h)
- R16: Testing Requirements (2h)
- R17: Coverage Requirements (2h)
- R20: UX Consistency (2.5h)
- R22: Refactor Integrity (2.5h)
- **Subtotal:** 12 hours

### MEDIUM-HIGH Complexity (3 rules) - **9 hours total**
- R18: Performance Budgets (3h)
- R19: Accessibility Requirements (3h)
- R24: Cross-Platform Compatibility (3h)
- **Subtotal:** 9 hours

**Total Estimated Time:** **29.5 hours** (~1 hour per rule average, but varies by complexity)

---

## Recommended Implementation Order

### Phase 1: Low-Medium Complexity (Quick Wins) - **7 hours**
1. **R14: Tech Debt Logging** (2.5h) - ✅ Draft already created, ready for review
2. **R21: File Organization** (1.5h) - Simple path validation
3. **R23: Tooling Compliance** (1.5h) - Simple lint/format validation
4. **R25: Workflow Trigger Configuration** (1.5h) - Simple YAML validation

**Rationale:** Quick wins build momentum, establish patterns, low risk. R14 draft already created.

### Phase 2: Medium Complexity (Core Rules) - **11.5 hours**
5. **R15: TODO/FIXME Handling** (2.5h) - Similar to R14
6. **R16: Testing Requirements** (2h) - Extends R10
7. **R17: Coverage Requirements** (2h) - Extends R16
8. **R20: UX Consistency** (2.5h) - Design system validation
9. **R22: Refactor Integrity** (2.5h) - Safety checks

**Rationale:** Core quality rules, moderate complexity, good value

### Phase 3: Medium-High Complexity (Specialized Rules) - **9 hours**
10. **R18: Performance Budgets** (3h) - Performance metrics
11. **R19: Accessibility Requirements** (3h) - WCAG compliance
12. **R24: Cross-Platform Compatibility** (3h) - React Native/web

**Rationale:** Specialized rules requiring domain expertise, higher complexity

---

## Risk Assessment

### Low Risk (LOW-MEDIUM complexity)
- R21, R23, R25: Simple validation, minimal dependencies
- **Mitigation:** Follow established patterns from Tier 1/Tier 2

### Medium Risk (MEDIUM complexity)
- R14-R17, R20, R22: Moderate complexity, some dependencies
- **Mitigation:** Reuse patterns from similar rules, incremental implementation

### Higher Risk (MEDIUM-HIGH complexity)
- R18, R19, R24: Complex detection, specialized knowledge
- **Mitigation:** Research domain knowledge, consult experts, prototype first

---

## Dependencies & Integration Points

### Rules with Dependencies
- **R15** depends on **R14** (tech debt logging)
- **R16** extends **R10** (testing coverage)
- **R17** extends **R16** (coverage requirements)
- **R20** extends **R19** (UX consistency)
- **R21** extends **R03** (architecture boundaries)
- **R22** extends **R21** (file organization)
- **R25** extends **R23** (tooling compliance)

### Integration Points
- **CI/CD:** R16, R17, R25 (test execution, coverage, workflows)
- **Design System:** R20 (UX consistency)
- **Performance Tools:** R18 (performance budgets)
- **Accessibility Tools:** R19 (WCAG compliance)
- **Cross-Platform:** R24 (React Native/web)

---

## Recommendations

### 1. Start with Low-Medium Complexity
- Build momentum with quick wins
- Establish patterns for Tier 3
- Validate approach before tackling complex rules

### 2. Batch Similar Rules
- R14 + R15 (tech debt): Similar patterns, can reuse code
- R16 + R17 (testing/coverage): Extends same rule, can combine
- R21 + R22 (architecture): Related, can share infrastructure

### 3. Research Before Implementation
- R18 (Performance): Research performance metrics formats
- R19 (Accessibility): Research WCAG validation tools
- R24 (Cross-Platform): Research React Native patterns

### 4. Incremental Approach
- Start with simple detection (pattern matching)
- Add complexity incrementally (AST parsing, heuristics)
- Test thoroughly before moving to next rule

---

## Next Steps

1. **Review this evaluation** - Confirm complexity assessments
2. **Prioritize rules** - Adjust order based on business needs
3. **Start with R14** - Draft already created, ready for review
4. **Implement Phase 1** - Complete low-medium complexity rules first
5. **Iterate and learn** - Use learnings to improve subsequent rules

---

**Last Updated:** 2025-12-05  
**Status:** Ready for Review  
**Next Action:** Review and approve complexity evaluation, then proceed with R14 implementation

