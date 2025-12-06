# Handoff Prompt for Next Agent — R20 Implementation

**Date:** 2025-12-05  
**From:** R19 Implementation Agent  
**To:** Next Agent (R20 Implementation)  
**Project:** VeroField Rules v2.1 Migration — Task 5: Step 5 Procedures  
**Status:** R19 ✅ COMPLETE, Ready for R20

---

## 🎯 YOUR MISSION

Implement **R20: [Next Rule]** following the established four-step workflow. This is a Tier 3 (WARNING-level) rule that [description].

---

## 📊 CURRENT PROJECT STATUS

### Overall Progress
- **Completed:** 19 rules (76%)
- **Remaining:** 6 rules (24%)
- **Tier 3 Progress:** 6/12 rules complete (50%)

### Completed Rules
- **Tier 1 (BLOCK):** R01, R02, R03 ✅✅✅
- **Tier 2 (OVERRIDE):** R04-R13 ✅✅✅✅✅✅✅✅✅✅
- **Tier 3 (WARNING):** R14, R15, R16, R17, R18, R19 ✅✅✅✅✅✅

### Just Completed (R19)
- **Rule:** R19 - Accessibility Requirements
- **Time:** 3.5 hours
- **Complexity:** MEDIUM
- **Key Pattern:** Hybrid testing (automated + manual), WCAG AA compliance, multi-factor prioritization, quick wins identification
- **Test Results:** ✅ 24/24 tests passing

---

## 🔧 ERROR LOGS & FIXES FROM R19 SESSION

### Test Execution Summary
**Initial Test Run:** 22/24 tests passing (2 failures)  
**Final Test Run:** ✅ 24/24 tests passing (all fixed)

### Error 1: Python-Style Conditional Syntax
**File:** `services/opa/policies/ux-consistency.rego`  
**Line:** 98  
**Error:**
```
rego_parse_error: unexpected if keyword: expected \n or ; or }
required_ratio := 3.0 if is_large_text else 4.5
```

**Root Cause:**  
Used Python-style conditional (`3.0 if is_large_text else 4.5`) which is not valid Rego syntax.

**Fix Applied:**
```rego
# Added helper function with multiple rule definitions
get_required_contrast_ratio(is_large_text) := 3.0 if {
    is_large_text
}

get_required_contrast_ratio(is_large_text) := 4.5 if {
    not is_large_text
}

# Updated usage
required_ratio := get_required_contrast_ratio(is_large_text)
```

**Lesson Learned:**  
Rego doesn't support ternary operators. Use helper functions with multiple rule definitions for conditional logic.

**Reference:**  
- Fixed in: `services/opa/policies/ux-consistency.rego` lines 46-52
- Test: `test_r19_w02_color_contrast_below_wcag_aa_normal_text` (now passing)

---

### Error 2: OR Operator Syntax
**File:** `services/opa/policies/ux-consistency.rego`  
**Line:** 189  
**Error:**
```
rego_parse_error: unexpected or token
is_critical_component(issue.component) || is_user_facing_component(issue.component)
```

**Root Cause:**  
Used `||` (OR operator) which is not valid Rego syntax. Rego doesn't support logical OR operators in expressions.

**Fix Applied:**
```rego
# Split into two separate rules instead of using ||
# R19-W08: High-priority accessibility issue identified (critical component)
accessibility_warnings[msg] if {
    some issue in input.accessibility_issues
    issue.priority == "high"
    is_critical_component(issue.component)
    # ... message
}

# R19-W08: High-priority accessibility issue identified (user-facing component)
accessibility_warnings[msg] if {
    some issue in input.accessibility_issues
    issue.priority == "high"
    not is_critical_component(issue.component)
    is_user_facing_component(issue.component)
    # ... message
}
```

**Lesson Learned:**  
Rego doesn't support `||` or `&&` operators. Split conditions into separate rules or use multiple rule definitions.

**Reference:**  
- Fixed in: `services/opa/policies/ux-consistency.rego` lines 183-204
- Tests: `test_r19_w08_high_priority_issue_critical_component`, `test_r19_w08_high_priority_issue_user_facing` (both passing)

---

### Error 3: Empty String Detection
**File:** `services/opa/policies/ux-consistency.rego`  
**Lines:** 164, 175  
**Failing Tests:**
- `test_r19_w06_exemption_missing_justification`
- `test_r19_w07_exemption_missing_remediation`

**Error:**
```
Fail not exemption.justification
Fail not exemption.remediation
```

**Root Cause:**  
The policy checked `not exemption.justification` which only detects missing fields, not empty strings (`""`). In Rego, an empty string is still truthy, so `not exemption.justification` fails when the field exists but is empty.

**Fix Applied:**
```rego
# R19-W06: Accessibility exemption missing justification
accessibility_warnings[msg] if {
    some exemption in input.accessibility_exemptions
    # Check if justification is missing
    not exemption.justification
    
    msg := sprintf(
        "WARNING [UX/R19]: Accessibility exemption for %s is missing justification. Add justification explaining why exemption is needed.",
        [exemption.component]
    )
}

accessibility_warnings[msg] if {
    some exemption in input.accessibility_exemptions
    # Check if justification is empty string
    exemption.justification == ""
    
    msg := sprintf(
        "WARNING [UX/R19]: Accessibility exemption for %s is missing justification. Add justification explaining why exemption is needed.",
        [exemption.component]
    )
}

# Similar fix for remediation (R19-W07)
```

**Lesson Learned:**  
In Rego, `not field` only checks if the field is missing/undefined. To detect empty strings, explicitly check `field == ""`. Always handle both cases: missing fields and empty strings.

**Reference:**  
- Fixed in: `services/opa/policies/ux-consistency.rego` lines 161-195
- Tests: `test_r19_w06_exemption_missing_justification`, `test_r19_w07_exemption_missing_remediation` (both now passing)

---

## 📋 COMMON REGO SYNTAX PATTERNS (Reference)

### Conditional Logic
```rego
# ❌ WRONG: Python-style ternary
value := a if condition else b

# ✅ CORRECT: Helper function with multiple rules
get_value(condition) := a if {
    condition
}

get_value(condition) := b if {
    not condition
}

value := get_value(condition)
```

### Logical OR
```rego
# ❌ WRONG: OR operator
condition1 || condition2

# ✅ CORRECT: Separate rules
rule[msg] if {
    condition1
    # ...
}

rule[msg] if {
    not condition1
    condition2
    # ...
}
```

### Empty String Detection
```rego
# ❌ WRONG: Only checks missing field
not field

# ✅ CORRECT: Check both missing and empty
rule[msg] if {
    not field
    # ...
}

rule[msg] if {
    field == ""
    # ...
}
```

---

## 🎯 NEXT TASK: R20 - [To Be Determined]

### Rule Details
- **Rule:** R20 - [Rule Name]
- **File:** `.cursor/rules/[rule-file].mdc`
- **Tier:** 3 (WARNING)
- **Estimated Complexity:** [To Be Determined]
- **Estimated Time:** [To Be Determined]
- **Priority:** [To Be Determined]

---

## 📋 MANDATORY WORKFLOW (Four Steps)

### Step 1: Generate Draft (0.5 hours)

**Create two documents:**

1. **Draft Rule File:** `.cursor/rules/[rule-file]-R20-DRAFT.md`
   - Step 5 audit procedures for R20
   - 6-8 audit categories (30-40 checklist items)
   - Mix of MANDATORY and RECOMMENDED requirements
   - 3-4 examples (correct patterns and violations)
   - Automated checks section
   - OPA policy approach

2. **Draft Summary:** `docs/compliance-reports/TASK5-R20-DRAFT-SUMMARY.md`
   - Overview of R20 requirements
   - Relationship to existing rules
   - 5 review questions with options and recommendations
   - Implementation approach
   - Estimated time and complexity

### Step 2: Present for Review

**Present both documents to the user:**
- Draft rule file
- Draft summary
- 5 review questions with recommended options

**Wait for user approval before proceeding to Step 3.**

### Step 3: Implement After Approval (2.5-3 hours)

**After user approves, implement:**

1. **OPA Policy** (`services/opa/policies/[policy-file].rego`)
   - Add 8-12 R20 warnings
   - Follow Rego syntax patterns (see "Common Rego Syntax Patterns" above)

2. **Automated Script** (`.cursor/scripts/check-[feature].py`)
   - Feature detection and validation
   - Exemption management (if applicable)
   - Enhanced reporting (if applicable)

3. **Test Suite** (`services/opa/tests/[test-file]_r20_test.rego`)
   - 12-15 comprehensive test cases
   - All R20 warnings tested
   - Edge cases covered (including empty strings, missing fields)

4. **Rule File Update** (`.cursor/rules/[rule-file].mdc`)
   - Add R20 audit procedures section
   - Include examples and automated checks

### Step 4: Update Handoff (0.5 hours)

**Create completion documentation:**

1. **Implementation Complete:** `docs/compliance-reports/TASK5-R20-IMPLEMENTATION-COMPLETE.md`
2. **Completion Summary:** `docs/compliance-reports/R20-COMPLETION-SUMMARY.md`
3. **Handoff Document:** `docs/compliance-reports/HANDOFF-TO-NEXT-AGENT-R21.md`
4. **Update Main Handoff:** `docs/compliance-reports/AGENT-HANDOFF-PROMPT.md`

---

## 🧪 TESTING CHECKLIST

### Before Running Tests
- [ ] Verify OPA policy syntax (no Python-style conditionals)
- [ ] Verify no `||` or `&&` operators (use separate rules instead)
- [ ] Verify empty string detection (check both `not field` and `field == ""`)
- [ ] Verify all helper functions use proper Rego syntax

### Running Tests
```bash
# Windows (use project OPA binary)
cd services/opa
.\bin\opa.exe test tests/[test-file]_r20_test.rego policies/[policy-file].rego -v

# Linux/Mac (use project OPA binary)
cd services/opa
./bin/opa test tests/[test-file]_r20_test.rego policies/[policy-file].rego -v

# Alternative: If OPA is in PATH
cd services/opa
opa test tests/[test-file]_r20_test.rego policies/[policy-file].rego -v
```

**Important:** OPA is installed at `services/opa/bin/opa.exe` (Windows) or `services/opa/bin/opa` (Linux/Mac). Always use the project binary (`.\bin\opa.exe` or `./bin/opa`) rather than relying on system PATH or temporary locations.

### Expected Results
- ✅ All tests passing (24/24 or similar)
- ✅ No syntax errors
- ✅ No type errors
- ✅ All warnings properly detected

### Common Test Failures to Watch For
1. **Syntax Errors:** Python-style conditionals, OR operators
2. **Type Errors:** Undefined functions, wrong argument types
3. **Logic Errors:** Empty strings not detected, missing field checks
4. **Import Errors:** Missing package imports, wrong package names

---

## 📁 FILE LOCATIONS (Reference)

### OPA Policies
- **File:** `services/opa/policies/[policy-file].rego`
- **Pattern:** Create new file or extend existing
- **Reference:** See `ux-consistency.rego` (R19) for recent pattern

### Automated Scripts
- **File:** `.cursor/scripts/check-[feature].py`
- **Pattern:** Similar to `check-accessibility.py` (R19)
- **Commands:** --all, --generate-report, etc.

### Test Suites
- **File:** `services/opa/tests/[test-file]_r20_test.rego`
- **Pattern:** Similar to `ux_r19_test.rego` (24 test cases)
- **Coverage:** All R20 warnings + edge cases (including empty strings)

### Rule Files
- **File:** `.cursor/rules/[rule-file].mdc`
- **Pattern:** Add R20 section after existing content
- **Reference:** See `13-ux-consistency.mdc` R19 section for structure

### Documentation
- **Location:** `docs/compliance-reports/`
- **Files:** TASK5-R20-*, R20-*, HANDOFF-TO-NEXT-AGENT-R21.md

---

## 🔍 KEY PATTERNS (From R19)

### Hybrid Testing Approach
```python
# Automated testing (axe-core, Lighthouse)
automated_results = run_automated_tests(component)

# Manual testing tiers
tier1_tests = ["keyboard_navigation", "quick_screen_reader"]
tier2_tests = ["full_keyboard", "screen_reader_deep_dive"]
tier3_tests = ["multi_screen_reader", "assistive_technology"]
```

### Multi-Factor Prioritization
```python
priority_score = (
    severity_score * 0.4 +      # WCAG severity (40%)
    criticality_score * 0.3 +    # Component criticality (30%)
    impact_score * 0.3           # User impact (30%)
)

roi_score = priority_score / effort_hours
```

### Enhanced Reporting
```python
# Compliance score (0-100)
compliance_score = (
    (passed_checks / total_checks) * 0.6 +  # Check pass rate (60%)
    (1 - exemption_rate) * 0.2 +            # Exemption rate (20%)
    (1 - critical_issue_rate) * 0.2         # Critical issue rate (20%)
)
```

---

## ✅ SUCCESS CRITERIA

### Must Have
1. ✅ OPA policy with 8-12 R20 warnings (proper Rego syntax)
2. ✅ Automated script created (600+ lines)
3. ✅ Test suite created (12-15 test cases, all passing)
4. ✅ Rule file updated with R20 audit procedures
5. ✅ Documentation complete (implementation, summary, handoff)
6. ✅ All tests pass (no syntax/type errors)
7. ✅ Complexity matches estimate
8. ✅ Time within estimate

### Quality Checks
- **OPA Tests:** All R20 tests pass (watch for common syntax errors)
- **Script Validation:** No errors, warnings displayed correctly
- **Documentation:** Complete and accurate
- **Code Quality:** Follows established patterns
- **Error Handling:** Empty strings and missing fields properly detected

---

## 📚 REFERENCE DOCUMENTS

### Completed Rules (Use as Examples)
- **R19:** `docs/compliance-reports/TASK5-R19-IMPLEMENTATION-COMPLETE.md`
- **R18:** `docs/compliance-reports/TASK5-R18-IMPLEMENTATION-COMPLETE.md`
- **R17:** `docs/compliance-reports/TASK5-R17-IMPLEMENTATION-COMPLETE.md`

### Error Patterns (Avoid These)
- **R19 Error Logs:** See "ERROR LOGS & FIXES FROM R19 SESSION" section above
- **Common Rego Syntax:** See "COMMON REGO SYNTAX PATTERNS" section above

### Main Handoff
- **File:** `docs/compliance-reports/AGENT-HANDOFF-PROMPT.md`
- **Contains:** Full workflow, patterns, file locations, examples

---

## 🎓 LESSONS LEARNED (From R19)

### What Worked Well
1. **Hybrid Testing:** Automated + manual testing ensures both technical compliance and user experience
2. **Structured Exemptions:** Easy to review, validate, and track
3. **Multi-Factor Prioritization:** Realistic and actionable
4. **Quick Wins Identification:** High ROI issues help teams focus effort
5. **Compliance Score:** Simple metric (0-100) for overall health

### Common Pitfalls to Avoid
1. **Python-Style Conditionals:** Use helper functions with multiple rules instead
2. **OR Operators:** Split into separate rules instead of using `||`
3. **Empty String Detection:** Always check both `not field` and `field == ""`
4. **Syntax Errors:** Test early and often to catch syntax issues quickly

### Recommendations for R20
1. **Test Early:** Run OPA tests frequently during development
2. **Watch for Common Errors:** Python-style conditionals, OR operators, empty strings
3. **Follow Patterns:** Use R19 implementation as reference for structure
4. **Document Errors:** Log any syntax/type errors encountered and their fixes

---

## 🚀 QUICK START GUIDE

### Step 1: Read Rule File
```bash
# Read the rule file to understand R20 requirements
cat .cursor/rules/[rule-file].mdc | grep -A 50 "R20"
```

### Step 2: Review R19 Implementation
```bash
# Review R19 implementation for patterns
cat docs/compliance-reports/TASK5-R19-IMPLEMENTATION-COMPLETE.md
cat .cursor/scripts/check-accessibility.py | head -100
cat services/opa/policies/ux-consistency.rego | grep -A 10 "R19-W01"

# Verify OPA is accessible
cd services/opa
.\bin\opa.exe version  # Windows
# OR
./bin/opa version      # Linux/Mac
```

### Step 3: Review Error Logs
```bash
# Review error logs from R19 session
cat docs/compliance-reports/HANDOFF-TO-NEXT-AGENT-R20.md | grep -A 20 "ERROR LOGS"
```

### Step 4: Create Draft
```bash
# Create draft rule file
touch .cursor/rules/[rule-file]-R20-DRAFT.md

# Create draft summary
touch docs/compliance-reports/TASK5-R20-DRAFT-SUMMARY.md
```

### Step 5: Follow Workflow
1. Generate draft (0.5 hours)
2. Present for review
3. Wait for approval
4. Implement (2.5-3 hours) - **Watch for common Rego syntax errors**
5. Run tests frequently - **Fix syntax errors early**
6. Update handoff (0.5 hours)

---

## ⚠️ IMPORTANT REMINDERS

### Tier 3 Characteristics
- **Enforcement:** WARNING (logged but doesn't block PRs)
- **Priority:** MEDIUM to LOW
- **Complexity:** Lower than Tier 1/Tier 2
- **Pace:** More relaxed (can take breaks)

### Workflow Requirements
- **MANDATORY:** Follow four-step workflow
- **MANDATORY:** Wait for user approval before implementing
- **MANDATORY:** Update handoff document after completion
- **MANDATORY:** Create all required documentation
- **MANDATORY:** Run tests frequently to catch syntax errors early

### Quality Standards
- **OPA Tests:** 12-15 test cases minimum (all passing)
- **Script:** 600+ lines, comprehensive detection
- **Documentation:** Complete and accurate
- **Code Quality:** Follows established patterns
- **Syntax:** Proper Rego syntax (no Python-style conditionals, no OR operators)

---

## 📞 QUESTIONS?

If you have questions about:
- **Workflow:** Refer to `docs/compliance-reports/AGENT-HANDOFF-PROMPT.md`
- **Patterns:** Refer to R19 implementation documents
- **File locations:** See "FILE LOCATIONS" section above
- **Examples:** Refer to completed rules (R14-R19)
- **Syntax Errors:** See "ERROR LOGS & FIXES FROM R19 SESSION" section above
- **Common Patterns:** See "COMMON REGO SYNTAX PATTERNS" section above

**Remember:** Tier 3 is simpler and more flexible than Tier 1/Tier 2. Take your time, follow the workflow, test frequently, and don't hesitate to ask for clarification if needed.

---

## 🎯 READY TO START

**Status:** R19 ✅ COMPLETE  
**Next Rule:** R20 - [To Be Determined]  
**Estimated Time:** [To Be Determined]  
**Confidence:** HIGH

**Action:** Begin with Step 1 (Generate Draft) following the workflow above. **Remember to test frequently and watch for common Rego syntax errors!**

---

**Handoff Created:** 2025-12-05  
**Next Agent:** Please begin R20 implementation  
**Test Results:** ✅ 24/24 R19 tests passing  
**Good Luck!** 🚀

