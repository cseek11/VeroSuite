# Task 5: R15 (TODO/FIXME Handling) — Draft Summary

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-11-23  
**Rule:** R15 - TODO/FIXME Handling  
**Priority:** MEDIUM (Tier 3 - WARNING)

---

## What Was Generated

### 1. Step 5 Audit Checklist (25 items)
- **TODO/FIXME Detection:** 5 checks
- **Meaningful vs Trivial Distinction:** 5 checks
- **Meaningful TODO Logging:** 5 checks
- **Trivial TODO Resolution:** 5 checks
- **TODO Resolution Verification:** 5 checks
- **Comment Context Analysis:** 4 checks
- **Cross-Referencing:** 4 checks

### 2. OPA Policy Mapping
- **Warning patterns:**
  1. TODO/FIXME left after completing work
  2. Meaningful TODO not logged in tech-debt.md
  3. Resolved TODO not removed from code
  4. Tech-debt.md not updated when TODO resolved
  5. Orphaned TODO (no corresponding debt entry)
  6. Trivial TODO logged as debt (should complete in PR)
- **Enforcement level:** WARNING (Tier 3 MAD) - Logged but doesn't block
- **Policy file:** `services/opa/policies/tech-debt.rego` (R15 section) - Extend R14

### 3. Automated Check Script
- **Script:** `.cursor/scripts/check-todo-fixme.py`
- **Checks:**
  - Detects TODO/FIXME comments (pattern matching, AST parsing)
  - Analyzes comment context (code vs documentation)
  - Distinguishes meaningful vs trivial TODOs (heuristic analysis)
  - Verifies meaningful TODOs are logged in tech-debt.md (cross-referencing)
  - Verifies resolved TODOs are removed (diff analysis)
  - Verifies tech-debt.md updated when TODO resolved (markdown parsing)
  - Detects orphaned TODOs (cross-reference validation)

### 4. Manual Verification Procedures
- **5-step procedure:**
  1. Review TODO/FIXME Comments - Identify all TODO/FIXME comments in changed code
  2. Distinguish Meaningful vs Trivial - Apply criteria (requires >2 hours OR creates risk)
  3. Verify Meaningful TODOs Logged - Check that meaningful TODOs are logged in `docs/tech-debt.md`
  4. Verify Trivial TODOs Resolved - Check that trivial TODOs are completed in same PR
  5. Verify Resolved TODOs Removed - Check that resolved TODOs are removed from code
- **5 verification criteria**

### 5. OPA Policy Implementation
- **Full Rego code provided**
- **6 warn rules** (no deny rules for Tier 3)
- **Pattern matching** (AST parsing, comment analysis, cross-referencing)

### 6. Test Cases
- **12 test cases specified:**
  1. Happy path (TODO resolved and removed)
  2. Happy path (meaningful TODO logged as debt)
  3. Happy path (trivial TODO completed in PR)
  4. Warning (TODO left after completing work)
  5. Warning (meaningful TODO not logged)
  6. Warning (resolved TODO not removed)
  7. Warning (tech-debt.md not updated)
  8. Warning (orphaned TODO)
  9. Edge case (TODO for current PR work - should NOT warn if completed)
  10. Edge case (ideas for future features - should NOT log as debt)
  11. Edge case (TODO in comment vs code)
  12. Edge case (FIXME vs TODO distinction)

---

## Review Needed

### Question 1: TODO/FIXME Detection
**Context:** How should the script detect TODO/FIXME comments?

**Options:**
- A) Pattern matching (detect TODO/FIXME patterns: `// TODO:`, `/* TODO:`, `# TODO:`)
- B) AST parsing (analyze comment nodes, detect TODO/FIXME)
- C) Combination: Pattern matching + AST parsing for accuracy
- D) Heuristic check (verify comment structure, context)

**Recommendation:** Option C - Combination approach. Use pattern matching to detect TODO/FIXME patterns. Use AST parsing to analyze comment context (code vs documentation). This provides comprehensive coverage.

**Rationale:** TODO/FIXME detection requires:
- Detecting TODO/FIXME patterns (pattern matching: `// TODO:`, `/* TODO:`, `# TODO:`)
- Analyzing comment context (AST parsing: code vs documentation)
- Recording location (file path, line number)
- Analyzing comment content (heuristic analysis)

---

### Question 2: Meaningful vs Trivial Distinction
**Context:** How should the script distinguish between meaningful TODOs (log as debt) and trivial TODOs (complete in PR)?

**Options:**
- A) Pattern matching (detect keywords: workaround, deferred, temporary)
- B) Heuristic check (estimate effort, check for risk indicators)
- C) Combination: Pattern matching + heuristic check
- D) Configuration-based (use criteria from configuration)

**Recommendation:** Option C - Combination approach. Use pattern matching to detect meaningful keywords (workaround, deferred, temporary). Use heuristic check to estimate effort (>2 hours) and check for risk indicators. This ensures accurate distinction.

**Rationale:** Meaningful vs trivial distinction requires:
- Detecting meaningful keywords (pattern matching: workaround, deferred, temporary)
- Estimating effort required (heuristic check: >2 hours)
- Checking for risk indicators (heuristic check: creates risk if forgotten)
- Excluding trivial TODOs (current PR work, ideas for future, minor cleanup)

---

### Question 3: Resolution Verification
**Context:** How should the script verify TODOs are resolved and removed?

**Options:**
- A) Pattern matching (detect TODO removal in diff)
- B) Diff analysis (compare before/after, detect TODO removal)
- C) Combination: Pattern matching + diff analysis
- D) Heuristic check (verify TODO content is addressed in code)

**Recommendation:** Option C - Combination approach. Use diff analysis to detect TODO removal. Use pattern matching to verify TODO content is addressed in code. This ensures accurate resolution verification.

**Rationale:** Resolution verification requires:
- Detecting TODO removal (diff analysis: compare before/after)
- Verifying TODO content is addressed (pattern matching: check if TODO task is implemented)
- Verifying tech-debt.md updated (markdown parsing: check status changed to "Resolved")
- Handling edge cases (partial resolution, multiple TODOs)

---

### Question 4: Cross-Referencing
**Context:** How should the script verify meaningful TODOs are cross-referenced with tech-debt.md?

**Options:**
- A) Pattern matching (detect tech-debt.md references in TODO comments)
- B) Markdown parsing (parse tech-debt.md, verify TODO location mentioned)
- C) Combination: Pattern matching + markdown parsing
- D) Heuristic check (verify TODO and debt entry match)

**Recommendation:** Option C - Combination approach. Use pattern matching to detect tech-debt.md references in TODO comments. Use markdown parsing to verify TODO location is mentioned in tech-debt.md. This ensures accurate cross-referencing.

**Rationale:** Cross-referencing requires:
- Detecting tech-debt.md references (pattern matching: `docs/tech-debt.md#DEBT-001`)
- Verifying debt entry exists (markdown parsing: check tech-debt.md for entry)
- Verifying TODO location mentioned (markdown parsing: check Location field)
- Handling edge cases (orphaned TODOs, missing references)

---

### Question 5: Comment Context Analysis
**Context:** How should the script analyze comment context (code vs documentation)?

**Options:**
- A) Pattern matching (detect comment location: code vs documentation)
- B) AST parsing (analyze comment node context: function, class, module)
- C) Combination: Pattern matching + AST parsing
- D) Heuristic check (verify comment is in code vs markdown/docs)

**Recommendation:** Option C - Combination approach. Use AST parsing to analyze comment node context (function, class, module). Use pattern matching to detect comment location (code vs documentation). This ensures accurate context analysis.

**Rationale:** Comment context analysis requires:
- Analyzing comment node context (AST parsing: function, class, module level)
- Detecting comment location (pattern matching: code vs documentation)
- Prioritizing code TODOs (affect functionality)
- Handling documentation TODOs appropriately (update docs or log as debt)

---

## Key Decisions Made

### 1. WARNING-Level Enforcement
- **Decision:** Use WARNING enforcement (doesn't block PRs)
- **Rationale:** TODO/FIXME handling is important but not critical. Warnings provide guidance without blocking development.

### 2. Meaningful vs Trivial Focus
- **Decision:** Focus on meaningful TODOs (requires >2 hours OR creates risk)
- **Rationale:** Not all TODOs are debt. Only meaningful TODOs should be logged to avoid noise.

### 3. Resolution Verification
- **Decision:** Verify TODOs are removed when resolved
- **Rationale:** Resolved TODOs should be removed to keep code clean and avoid confusion.

### 4. Cross-Referencing Integration
- **Decision:** Integrate with R14 (Tech Debt Logging) for consistent logging
- **Rationale:** Meaningful TODOs should follow R14 debt logging requirements.

### 5. Comment Context Analysis
- **Decision:** Distinguish code TODOs from documentation TODOs
- **Rationale:** Code TODOs affect functionality and should be prioritized.

---

## Implementation Plan

### Phase 1: OPA Policy (Estimated: 0.5 hours)
1. Extend `services/opa/policies/tech-debt.rego` with R15 section
2. Implement 6 warning patterns
3. Test with sample violations

### Phase 2: Automated Script (Estimated: 1 hour)
1. Create `.cursor/scripts/check-todo-fixme.py`
2. Implement pattern matching for TODO/FIXME detection
3. Implement AST parsing for comment context analysis
4. Implement heuristic analysis for meaningful vs trivial distinction
5. Implement cross-referencing with tech-debt.md
6. Test with sample files

### Phase 3: Test Suite (Estimated: 0.5 hours)
1. Create `services/opa/tests/tech_debt_r15_test.rego`
2. Implement 12 test cases
3. Test warning patterns

### Phase 4: Rule File Update (Estimated: 0.25 hours)
1. Update `.cursor/rules/12-tech-debt.mdc` with R15 section
2. Add audit checklist
3. Add automated checks section
4. Add manual verification procedures

### Phase 5: Documentation (Estimated: 0.25 hours)
1. Create completion document
2. Update handoff document
3. Create testing guide (if needed)

**Total Estimated Time:** 2.5 hours

---

## Next Steps

1. **Review this draft** - Answer questions, provide feedback
2. **Approve or request changes** - Based on review
3. **Implement approved draft** - Create OPA policy, script, tests
4. **Update rule file** - Add R15 section to `.cursor/rules/12-tech-debt.mdc`
5. **Create completion document** - Document implementation

---

## Questions for Human Reviewer

1. **TODO/FIXME Detection:** Do you agree with Option C (pattern matching + AST parsing) for detecting TODO/FIXME comments?

2. **Meaningful vs Trivial Distinction:** Do you agree with Option C (pattern matching + heuristic check) for distinguishing between meaningful and trivial TODOs?

3. **Resolution Verification:** Do you agree with Option C (pattern matching + diff analysis) for verifying TODOs are resolved and removed?

4. **Cross-Referencing:** Do you agree with Option C (pattern matching + markdown parsing) for verifying meaningful TODOs are cross-referenced with tech-debt.md?

5. **Comment Context Analysis:** Do you agree with Option C (pattern matching + AST parsing) for analyzing comment context (code vs documentation)?

6. **Coverage:** Are there any additional TODO/FIXME patterns that should be detected?

7. **Edge Cases:** Are there any edge cases or special scenarios that should be handled?

8. **WARNING-Level Enforcement:** Do you agree with WARNING-level enforcement (doesn't block PRs) for TODO/FIXME handling?

---

**Last Updated:** 2025-11-23  
**Next Review:** After human feedback  
**Estimated Implementation Time:** 2.5 hours





