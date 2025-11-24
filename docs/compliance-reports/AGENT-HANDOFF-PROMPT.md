# Agent Handoff Prompt — Tier 3 Implementation

**Date:** 2025-11-23  
**From:** AI Agent (R13 Completion)  
**To:** Next AI Agent (Tier 3 Implementation)  
**Project:** VeroField Rules v2.1 Migration — Task 5: Step 5 Procedures

**⚠️ CRITICAL NOTE (2025-11-23):** Rule numbering in actual implementation differs from original plan document. **The rule files (`.cursor/rules/*.mdc`) are the authoritative source of truth** for rule numbers and definitions. Always verify rule numbers against `docs/compliance-reports/rule-compliance-matrix.md` and actual rule files, not the original plan document.

---

## 🎉 CONTEXT: MAJOR MILESTONE ACHIEVED

**Tier 2 is COMPLETE!** All high-priority rules (Tier 1 + Tier 2 = 13 rules) have been successfully implemented with comprehensive enforcement.

**Your Task:** Implement Tier 3 rules (R14-R25) - 12 WARNING-level rules that are lower priority but still valuable.

---

## YOUR MISSION

Continue the VeroField Rules v2.1 migration project by implementing **Tier 3 rules (R14-R25)**. These are WARNING-level rules that provide guidance but don't block PRs.

**Key Difference:** Tier 3 rules are simpler than Tier 1/Tier 2:
- **Enforcement:** WARNING (logged but doesn't block)
- **Priority:** MEDIUM to LOW
- **Complexity:** Lower (simpler policies, fewer tests)
- **Pace:** More relaxed (can take breaks between rules)

---

## CURRENT STATE

### ✅ Completed (Tier 1 + Tier 2 + R14-R17)

**17 rules complete (68% of project):**
- **Tier 1 (BLOCK):** R01, R02, R03 ✅✅✅
- **Tier 2 (OVERRIDE):** R04, R05, R06, R07, R08, R09, R10, R11, R12, R13 ✅✅✅✅✅✅✅✅✅✅
- **Tier 3 (WARNING):** R14, R15, R16, R17 ✅✅✅✅

**All artifacts created:**
- OPA policies (BLOCK, OVERRIDE, and WARNING enforcement)
- Automated scripts (comprehensive detection)
- Test suites (254+ test cases total)
- Rule file sections (642+ checklist items total)
- Documentation (implementation reports, handoffs, summaries)

### ⏳ Remaining (Tier 3)

**3 rules remaining (12% of project):**
- R23: Naming Conventions ⏳ **NEXT**
- R24: Cross-Platform Compatibility
- R25: CI/CD Workflow Triggers

**⚠️ NOTE:** The original plan document listed different rule numbers for Tier 3 rules. The actual implementation uses the rule numbers above (as defined in `.cursor/rules/*.mdc` files). Always verify against `docs/compliance-reports/rule-compliance-matrix.md`.

**Estimated Time:** ~18.5 hours remaining (~2.5 hours per rule)

---

## ESTABLISHED WORKFLOW (MANDATORY)

### Step 1: Generate Draft (0.5 hours)

**Create draft Step 5 procedures:**

1. **Read the rule file** (e.g., `.cursor/rules/12-tech-debt.mdc` for R14-R15)
   - Understand the rule requirements
   - Identify what needs to be enforced

2. **Create draft document:** `.cursor/rules/[domain]-R##-DRAFT.md`
   - Include Step 5 audit procedures
   - Add checklist (20-30 items for Tier 3)
   - Add examples (correct patterns and violations)
   - Document automated checks and OPA policy approach

3. **Create summary document:** `docs/compliance-reports/TASK5-R##-DRAFT-SUMMARY.md`
   - Summarize the draft
   - List 2-3 review questions
   - Highlight key decisions
   - Include estimated time

**Example draft structure:**
```markdown
## Step 5: Post-Implementation Audit for [Rule Name]

### R##: [Rule Name] — Audit Procedures

**For code changes affecting [scope]:**

#### [Category 1]

- [ ] **MANDATORY:** [Requirement 1]
- [ ] **MANDATORY:** [Requirement 2]
- [ ] **RECOMMENDED:** [Requirement 3]

#### Automated Checks

```bash
# Run checker
python .cursor/scripts/check-[rule].py --file <file_path>
```

#### OPA Policy

- **Policy:** `services/opa/policies/[domain].rego` (R## section)
- **Enforcement:** WARNING (Tier 3 MAD)
- **Tests:** `services/opa/tests/[domain]_r##_test.rego`

#### Examples

**Example Correct Pattern (✅):**
[Code example]

**Example Violation (❌):**
[Code example]
```

### Step 2: Present for Review (0.25 hours)

**Present draft to human:**

1. **Show both documents:**
   - Draft rule file (`.cursor/rules/[domain]-R##-DRAFT.md`)
   - Draft summary (`docs/compliance-reports/TASK5-R##-DRAFT-SUMMARY.md`)

2. **Wait for human approval:**
   - Human will review and provide feedback
   - Human will answer review questions
   - Human will approve or request changes

3. **DO NOT proceed to implementation until human approves**

### Step 3: Implement After Approval (0.25 hours)

**After human approval, implement:**

1. **Create OPA policy** (WARNING level):
   - File: `services/opa/policies/[domain].rego` (add R## section)
   - Use WARNING pattern (not BLOCK/OVERRIDE)
   - No override mechanism needed (warnings don't block)

2. **Create automated script:**
   - File: `.cursor/scripts/check-[rule].py`
   - Simpler than Tier 1/Tier 2 scripts
   - Focus on detection, not enforcement

3. **Create test suite:**
   - File: `services/opa/tests/[domain]_r##_test.rego`
   - 10-15 test cases (fewer than Tier 1/Tier 2)
   - Test warnings, not blocks

4. **Update rule file:**
   - File: `.cursor/rules/[domain].mdc` (add R## section)
   - Copy content from draft (after human approval)
   - Remove draft markers

5. **Create completion documentation:**
   - File: `docs/compliance-reports/TASK5-R##-IMPLEMENTATION-COMPLETE.md`
   - File: `docs/compliance-reports/HANDOFF-TO-NEXT-AGENT-R##.md`
   - File: `docs/compliance-reports/R##-COMPLETION-SUMMARY.md`

### Step 4: Update Handoff Document

**Update handoff document:**
- Mark rule as complete
- Update overall progress
- Set next rule details

---

## TIER 3 SPECIFIC PATTERNS

### OPA Policy Pattern (WARNING Level)

**WARNING Pattern (no override needed):**
```rego
# R##-W01: Warning case
warn contains msg if {
    some file in input.changed_files
    # Detection logic
    
    msg := sprintf(
        "WARNING [Domain/R##]: Description. Suggestion.",
        [file.path]
    )
}
```

**Note:** No `has_override_marker` check needed for WARNING rules (they don't block).

### Automated Script Pattern (Simpler)

**Script Structure:**
```python
#!/usr/bin/env python3
"""
R##: Rule Name Checker

Usage:
    python check-[rule].py --file <file_path>
    python check-[rule].py --all
"""

import argparse
import os
import re
from typing import List, Dict

class RuleChecker:
    def check_file(self, file_path: str) -> List[Dict]:
        """Check a single file for violations"""
        violations = []
        # Simpler detection logic
        return violations
    
    def format_output(self, violations: List[Dict]) -> str:
        """Format violations for output"""
        # Simpler output format
        pass

def main():
    parser = argparse.ArgumentParser(description='R## Checker')
    parser.add_argument('--file', help='Check a single file')
    parser.add_argument('--all', action='store_true', help='Check all files')
    
    args = parser.parse_args()
    checker = RuleChecker()
    
    # Run checks and output results
    # ...

if __name__ == '__main__':
    main()
```

### Test Suite Pattern (Fewer Tests)

**Test Structure:**
```rego
package compliance.domain

import data.compliance.domain.warn

# Test 1: Warning case
test_warning_case {
    mock_input := {
        "changed_files": [
            {
                "path": "path/to/file.ts",
                "diff": "code with issue"
            }
        ]
    }
    
    count(warn) == 1 with input as mock_input
    
    warning := [msg | msg := warn[_]][0]
    contains(warning, "expected text")
}

# Test 2: No warning case
test_no_warning_case {
    mock_input := {
        "changed_files": [
            {
                "path": "path/to/file.ts",
                "diff": "correct code"
            }
        ]
    }
    
    count(warn) == 0 with input as mock_input
}
```

---

## FILE LOCATIONS & STRUCTURE

### Rule Files
- **Official Rules:** `.cursor/rules/*.mdc` (update these)
- **Draft Rules:** `.cursor/rules/*-R##-DRAFT.md` (temporary, delete after implementation)

**Rule File Mapping:**
- R14-R15: `12-tech-debt.mdc`
- R16-R18: `10-quality.mdc`
- R19-R20: `13-ux-consistency.mdc`
- R21-R22: `04-architecture.mdc`
- R23: `02-core.mdc`
- R24: `09-frontend.mdc`
- R25: `11-operations.mdc`

**⚠️ IMPORTANT:** Always verify rule numbers against `docs/compliance-reports/rule-compliance-matrix.md` - this is the authoritative source. Rule numbering may differ from the original plan document.

### OPA Policies
**Policy File Mapping:**
- R14-R15: `services/opa/policies/tech-debt.rego` (create if needed)
- R16-R18: `services/opa/policies/quality.rego` (extend existing)
- R19-R20: `services/opa/policies/ux.rego` (create if needed)
- R21-R22: `services/opa/policies/architecture.rego` (extend existing)
- R23, R25: `services/opa/policies/operations.rego` (create if needed)
- R24: `services/opa/policies/frontend.rego` (create if needed)

### Automated Scripts
**Script Naming:**
- R14: `check-tech-debt.py`
- R15: `check-todo-fixme.py`
- R16: `check-testing-requirements.py` (extend existing)
- R17: `check-coverage-requirements.py`
- R18: `check-performance-budgets.py`
- R19: `check-accessibility.py`
- R20: `check-ux-consistency.py`
- R21: `check-file-organization.py`
- R22: `check-refactor-integrity.py`
- R23: `check-tooling-compliance.py`
- R24: `check-cross-platform.py`
- R25: `check-workflow-triggers.py`

### Test Suites
**Test File Naming:**
- R14: `services/opa/tests/tech_debt_r14_test.rego`
- R15: `services/opa/tests/tech_debt_r15_test.rego`
- R16: `services/opa/tests/quality_r16_test.rego`
- R17: `services/opa/tests/quality_r17_test.rego`
- R18: `services/opa/tests/quality_r18_test.rego`
- R19: `services/opa/tests/ux_r19_test.rego`
- R20: `services/opa/tests/ux_r20_test.rego`
- R21: `services/opa/tests/architecture_r21_test.rego`
- R22: `services/opa/tests/architecture_r22_test.rego`
- R23: `services/opa/tests/operations_r23_test.rego`
- R24: `services/opa/tests/frontend_r24_test.rego`
- R25: `services/opa/tests/operations_r25_test.rego`

### Documentation
**Documentation Files:**
- Draft Summary: `docs/compliance-reports/TASK5-R##-DRAFT-SUMMARY.md`
- Implementation Complete: `docs/compliance-reports/TASK5-R##-IMPLEMENTATION-COMPLETE.md`
- Handoff: `docs/compliance-reports/HANDOFF-TO-NEXT-AGENT-R##.md`
- Completion Summary: `docs/compliance-reports/R##-COMPLETION-SUMMARY.md`

---

## RECOMMENDED ORDER

### High Value (Implement First)
1. **R14: Tech Debt Logging** (visibility into technical debt)
2. **R15: TODO/FIXME Handling** (code cleanliness)
3. **R21: File Organization** (monorepo compliance)
4. **R23: Tooling Compliance** (code quality)

### Medium Value (Implement Second)
5. **R16: Testing Requirements** (test coverage)
6. **R17: Coverage Requirements** (test thresholds)
7. **R20: UX Consistency** (design system)
8. **R24: Cross-Platform Compatibility** (web + mobile)

### Lower Value (Implement Last)
9. **R18: Performance Budgets** (optimization)
10. **R19: Accessibility Requirements** (WCAG)
11. **R22: Refactor Integrity** (safety checks)
12. **R25: Workflow Trigger Configuration** (CI/CD)

---

## KEY DIFFERENCES: TIER 3 vs TIER 1/TIER 2

### Simpler Enforcement
- **Tier 1/Tier 2:** BLOCK/OVERRIDE (hard enforcement)
- **Tier 3:** WARNING (soft guidance)

### Simpler Policies
- **Tier 1/Tier 2:** Complex violation detection, override mechanisms
- **Tier 3:** Simple warning detection, no override needed

### Simpler Scripts
- **Tier 1/Tier 2:** Comprehensive detection, multiple analyzers
- **Tier 3:** Basic detection, simpler logic

### Fewer Tests
- **Tier 1/Tier 2:** 15-20 test cases per rule
- **Tier 3:** 10-15 test cases per rule

### Shorter Checklists
- **Tier 1/Tier 2:** 40-50 checklist items per rule
- **Tier 3:** 20-30 checklist items per rule

### Less Documentation
- **Tier 1/Tier 2:** Detailed implementation reports
- **Tier 3:** Concise implementation reports

---

## EXAMPLE: R14 IMPLEMENTATION

### Step 1: Generate Draft

**Read rule file:** `.cursor/rules/12-tech-debt.mdc`
- Understand R14 requirements
- Identify what needs to be enforced

**Create draft:** `.cursor/rules/12-tech-debt-R14-DRAFT.md`
- Step 5 audit procedures
- Checklist (20-30 items)
- Examples (correct and violations)
- Automated checks and OPA policy

**Create summary:** `docs/compliance-reports/TASK5-R14-DRAFT-SUMMARY.md`
- Summarize draft
- List review questions
- Highlight key decisions

### Step 2: Present for Review

**Show both documents to human:**
- Draft rule file
- Draft summary

**Wait for approval** (DO NOT proceed until approved)

### Step 3: Implement After Approval

**Create OPA policy:**
- File: `services/opa/policies/tech-debt.rego` (create if needed)
- Add R14 section with WARNING patterns

**Create automated script:**
- File: `.cursor/scripts/check-tech-debt.py`
- Detect missing tech debt logging

**Create test suite:**
- File: `services/opa/tests/tech_debt_r14_test.rego`
- 10-15 test cases

**Update rule file:**
- File: `.cursor/rules/12-tech-debt.mdc`
- Add R14 section (copy from approved draft)

**Create documentation:**
- `docs/compliance-reports/TASK5-R14-IMPLEMENTATION-COMPLETE.md`
- `docs/compliance-reports/HANDOFF-TO-NEXT-AGENT-R14.md`
- `docs/compliance-reports/R14-COMPLETION-SUMMARY.md`

### Step 4: Update Handoff

**Update handoff document:**
- Mark R14 as complete
- Update progress (14/25 rules)
- Set R15 as next rule

---

## SUCCESS CRITERIA

### For Each Rule
- [ ] Draft created and presented for review
- [ ] Human approval received
- [ ] OPA policy created (WARNING level)
- [ ] Automated script created
- [ ] Test suite created (10-15 tests)
- [ ] Rule file updated
- [ ] Documentation created
- [ ] Handoff document updated
- [ ] No linting errors

### For Tier 3 Completion
- [ ] All 12 Tier 3 rules complete
- [ ] All artifacts follow established patterns
- [ ] Documentation is complete
- [ ] Overall project: 25/25 rules complete (100%)

---

## IMPORTANT REMINDERS

### Human-in-the-Loop is MANDATORY
- **DO NOT skip the review step**
- **DO NOT implement without human approval**
- **DO NOT proceed if human requests changes**

### Follow Established Patterns
- Use existing Tier 1/Tier 2 rules as reference
- Follow file naming conventions
- Follow code structure patterns
- Follow documentation templates

### Quality Standards
- No linting errors
- Comprehensive test coverage (10-15 tests)
- Clear examples (correct and violations)
- Complete documentation

### Pace
- **Tier 3 is lower priority** - you can take breaks
- **More flexible** - can implement incrementally
- **Less pressure** - warnings don't block PRs
- **Estimated time:** ~1 hour per rule

---

## REFERENCE DOCUMENTS

### Completed Rules (Use as Reference)
- **R01:** `docs/compliance-reports/TASK5-R01-IMPLEMENTATION-COMPLETE.md`
- **R12:** `docs/compliance-reports/TASK5-R12-IMPLEMENTATION-COMPLETE.md`
- **R13:** `docs/compliance-reports/TASK5-R13-IMPLEMENTATION-COMPLETE.md`

### Handoff Documents
- **R13 Handoff:** `docs/compliance-reports/HANDOFF-TO-NEXT-AGENT-R13.md`
- **This Document:** `docs/compliance-reports/AGENT-HANDOFF-PROMPT.md`

### Rule Files
- **Security:** `.cursor/rules/03-security.mdc` (R01, R02, R12, R13)
- **Tech Debt:** `.cursor/rules/12-tech-debt.mdc` (R14, R15)
- **Quality:** `.cursor/rules/10-quality.mdc` (R10, R16, R17, R18)
- **UX:** `.cursor/rules/13-ux-consistency.mdc` (R19, R20)
- **Architecture:** `.cursor/rules/04-architecture.mdc` (R03, R21, R22)
- **Operations:** `.cursor/rules/11-operations.mdc` (R23, R25)
- **Frontend:** `.cursor/rules/09-frontend.mdc` (R24)

---

## YOUR FIRST TASK

**Start with R18: Performance Budgets**

1. Read `.cursor/rules/10-quality.mdc` to understand R18 requirements
2. Create draft: `.cursor/rules/10-quality-R18-DRAFT.md`
3. Create summary: `docs/compliance-reports/TASK5-R18-DRAFT-SUMMARY.md`
4. Present both documents to human for review
5. Wait for approval before implementing

**Note:** R14, R15, R16, and R17 are complete and can be used as references. R17's approach (git-based storage, baseline comparison, exemptions) is particularly relevant for R18.

**Good luck!** 🚀

---

## QUESTIONS?

If you have questions about:
- **Workflow:** Refer to established workflow above
- **Patterns:** Refer to Tier 1/Tier 2 completed rules
- **File locations:** Refer to file structure section
- **Examples:** Refer to reference documents

**Remember:** Tier 3 is simpler and more flexible than Tier 1/Tier 2. Take your time, follow the workflow, and don't hesitate to ask for clarification if needed.

---

**Handoff Created:** 2025-11-23  
**Last Updated:** 2025-11-23 (R22 complete)  
**Next Agent:** Tier 3 Implementation  
**Status:** Ready to start (R23: Naming Conventions)  
**Progress:** 22/25 rules complete (88%)

**⚠️ SOURCE OF TRUTH:** Rule numbers come from `.cursor/rules/*.mdc` files and `docs/compliance-reports/rule-compliance-matrix.md`, not the original plan document.

**🎉 Great progress! 88% complete. Almost there! 🚀**

