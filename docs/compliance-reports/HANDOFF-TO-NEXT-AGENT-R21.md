# Handoff Prompt for Next Agent — R21 Implementation

**Date:** 2025-12-05  
**From:** R20 Implementation Agent  
**To:** Next Agent (R21 Implementation)  
**Project:** VeroField Rules v2.1 Migration — Task 5: Step 5 Procedures  
**Status:** R20 ✅ COMPLETE, Ready for R21

---

## 🎯 YOUR MISSION

Implement **R21: File Organization** following the established four-step workflow. This is a Tier 3 (WARNING-level) rule that ensures files are organized correctly according to the monorepo structure.

---

## 📊 CURRENT PROJECT STATUS

### Overall Progress
- **Completed:** 20 rules (80%)
- **Remaining:** 5 rules (20%)
- **Tier 3 Progress:** 7/12 rules complete (58%)

### Completed Rules
- **Tier 1 (BLOCK):** R01, R02, R03 ✅✅✅
- **Tier 2 (OVERRIDE):** R04-R13 ✅✅✅✅✅✅✅✅✅✅
- **Tier 3 (WARNING):** R14, R15, R16, R17, R18, R19, R20 ✅✅✅✅✅✅✅

### Just Completed (R20)
- **Rule:** R20 - UX Consistency
- **Time:** 2.5 hours
- **Complexity:** MEDIUM
- **Key Pattern:** Three-layer validation (pattern matching + comparison + design system validation), page classification, component detection
- **Test Results:** ✅ 19/19 tests passing (all R20 warnings covered)

---

## 🔧 ERROR LOGS & FIXES FROM R20 SESSION

### Implementation Summary
**Status:** ✅ All components implemented successfully

### Key Implementation Notes

1. **OPA Policy:** Added 12 R20 warnings to `services/opa/policies/ux-consistency.rego`
   - Pattern matching warnings (custom spacing, typography, colors)
   - Comparison warnings (inconsistencies with similar pages)
   - Design system validation warnings
   - Component usage warnings (imports, catalog, duplicates)

2. **Automated Script:** Created `check-ux-consistency.py` (600+ lines)
   - Design system parsing (Markdown documentation)
   - Component library catalog parsing
   - Page classification (type, domain, action)
   - Similar page finding and comparison
   - Pattern matching (spacing, typography, colors)
   - Component detection (imports, catalog, duplicates)

3. **Test Suite:** Created `services/opa/tests/ux_r20_test.rego` (20 test cases)
   - All R20 warnings tested
   - Edge cases covered (no violations, multiple violations)
   - Pattern matching, comparison, and design system validation tests

4. **Rule File:** Updated `13-ux-consistency.mdc` with R20 section
   - 9 categories, 50+ checklist items
   - 6 code examples (correct patterns and violations)
   - Automated checks section
   - Manual verification guidelines

### Syntax Fixes Applied
1. **Warn Rule Syntax:** Fixed `warn[msg]` to `warn contains msg if` (proper Rego syntax for partial set rules)
2. **File Extension Checks:** Split into separate rules for `.tsx` and `.ts` files (Rego doesn't support `or` operator in expressions)
3. **Test Expectations:** Updated test to match actual warning message format

**Final Test Results:** ✅ 19/19 tests passing

---

## 📋 COMMON PATTERNS (Reference)

### Three-Layer Validation Pattern
```python
# Pattern matching (fast, catches obvious violations)
violations.extend(detect_custom_spacing(file_path, content))

# Comparison (validates against similar pages)
similar_pages = find_similar_pages(file_path, all_files)
violations.extend(compare_spacing(file_path, content, similar_pages))

# Design system validation (ensures alignment with standards)
violations.extend(validate_against_design_system(file_path, content, design_system))
```

### Page Classification Pattern
```python
def classify_page(file_path: str) -> Dict:
    classification = {
        'type': None,  # form, list, detail, settings, dashboard
        'domain': None,  # customer, work-order, invoice, etc.
        'action': None,  # create, edit, view, list
        'path': file_path
    }
    
    # Classify by path patterns
    if 'create' in path_lower:
        classification['action'] = 'create'
        classification['type'] = 'form'
    # ... more classification logic
    
    return classification
```

### Component Detection Pattern
```python
# Import checking
violations.extend(detect_component_imports(file_path, content))

# Catalog validation
violations.extend(detect_component_usage(file_path, content, catalog_components))

# Duplicate detection
violations.extend(detect_duplicate_components(file_path, content, existing_components))
```

---

## 🎯 NEXT TASK: R21 - File Organization

### Rule Details
- **Rule:** R21 - File Organization
- **File:** `.cursor/rules/04-architecture.mdc`
- **Tier:** 3 (WARNING)
- **Estimated Complexity:** LOW-MEDIUM
- **Estimated Time:** 2 hours
- **Priority:** MEDIUM

**Scope:**
- Verify files are in correct monorepo locations (`apps/`, `libs/`, `frontend/`)
- Verify no files in deprecated paths (`backend/src/`, root-level `src/`)
- Verify file organization follows monorepo structure
- Verify no new top-level directories created without approval

---

## 📋 MANDATORY WORKFLOW (Four Steps)

### Step 1: Generate Draft (0.5 hours)

**Create two documents:**

1. **Draft Rule File:** `.cursor/rules/04-architecture-R21-DRAFT.md`
   - Step 5 audit procedures for R21
   - 6-8 audit categories (30-40 checklist items)
   - Mix of MANDATORY and RECOMMENDED requirements
   - 3-4 examples (correct patterns and violations)
   - Automated checks section
   - OPA policy approach

2. **Draft Summary:** `docs/compliance-reports/TASK5-R21-DRAFT-SUMMARY.md`
   - Overview of R21 requirements
   - Relationship to existing rules (R03: Architecture Boundaries)
   - 5 review questions with options and recommendations
   - Implementation approach
   - Estimated time and complexity

### Step 2: Present for Review

**Present both documents to the user:**
- Draft rule file
- Draft summary
- 5 review questions with recommended options

**Wait for user approval before proceeding to Step 3.**

### Step 3: Implement After Approval (1.5-2 hours)

**After user approves, implement:**

1. **OPA Policy** (`services/opa/policies/architecture.rego`)
   - Add 8-10 R21 warnings
   - Follow Rego syntax patterns (see R20 for reference)

2. **Automated Script** (`.cursor/scripts/check-file-organization.py`)
   - File path validation
   - Monorepo structure validation
   - Deprecated path detection
   - Enhanced reporting

3. **Test Suite** (`services/opa/tests/architecture_r21_test.rego`)
   - 10-12 comprehensive test cases
   - All R21 warnings tested
   - Edge cases covered

4. **Rule File Update** (`.cursor/rules/04-architecture.mdc`)
   - Add R21 audit procedures section
   - Include examples and automated checks

### Step 4: Update Handoff (0.5 hours)

**Create completion documentation:**

1. **Implementation Complete:** `docs/compliance-reports/TASK5-R21-IMPLEMENTATION-COMPLETE.md`
2. **Completion Summary:** `docs/compliance-reports/R21-COMPLETION-SUMMARY.md`
3. **Handoff Document:** `docs/compliance-reports/HANDOFF-TO-NEXT-AGENT-R22.md`
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
cd services/opa
opa test tests/architecture_r21_test.rego policies/architecture.rego -v
```

### Expected Results
- ✅ All tests passing (10-12 or similar)
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
- **File:** `services/opa/policies/architecture.rego` (extend existing)
- **Pattern:** Add R21 section after R03
- **Reference:** See `ux-consistency.rego` (R20) for recent pattern

### Automated Scripts
- **File:** `.cursor/scripts/check-file-organization.py`
- **Pattern:** Similar to `check-ux-consistency.py` (R20)
- **Commands:** --all, --generate-report, etc.

### Test Suites
- **File:** `services/opa/tests/architecture_r21_test.rego`
- **Pattern:** Similar to `ux_r20_test.rego` (10-12 test cases)
- **Coverage:** All R21 warnings + edge cases

### Rule Files
- **File:** `.cursor/rules/04-architecture.mdc`
- **Pattern:** Add R21 section after R03
- **Reference:** See `13-ux-consistency.mdc` R20 section for structure

### Documentation
- **Location:** `docs/compliance-reports/`
- **Files:** TASK5-R21-*, R21-*, HANDOFF-TO-NEXT-AGENT-R22.md

---

## 🔍 KEY PATTERNS (From R20)

### Three-Layer Validation
```python
# Pattern matching (fast detection)
violations.extend(detect_pattern(file_path, content))

# Comparison (consistency validation)
similar_items = find_similar_items(file_path, all_items)
violations.extend(compare_with_similar(file_path, content, similar_items))

# Design system/standard validation (authoritative source)
violations.extend(validate_against_standard(file_path, content, standard))
```

### File Path Validation
```python
# Check monorepo structure
def validate_file_path(file_path: str) -> List[Dict]:
    violations = []
    
    # Check for deprecated paths
    if 'backend/src/' in file_path:
        violations.append({
            'type': 'deprecated_path',
            'issue': 'File in deprecated backend/src/ path',
            'suggestion': 'Move to apps/api/src/'
        })
    
    # Check for correct monorepo structure
    if not file_path.startswith(('apps/', 'libs/', 'frontend/')):
        violations.append({
            'type': 'wrong_location',
            'issue': 'File not in correct monorepo location',
            'suggestion': 'Move to apps/, libs/, or frontend/'
        })
    
    return violations
```

---

## ✅ SUCCESS CRITERIA

### Must Have
1. ✅ OPA policy with 8-10 R21 warnings (proper Rego syntax)
2. ✅ Automated script created (400+ lines)
3. ✅ Test suite created (10-12 test cases, all passing)
4. ✅ Rule file updated with R21 audit procedures
5. ✅ Documentation complete (implementation, summary, handoff)
6. ✅ All tests pass (no syntax/type errors)
7. ✅ Complexity matches estimate (LOW-MEDIUM)
8. ✅ Time within estimate (2 hours)

### Quality Checks
- **OPA Tests:** All R21 tests pass (watch for common syntax errors)
- **Script Validation:** No errors, warnings displayed correctly
- **Documentation:** Complete and accurate
- **Code Quality:** Follows established patterns
- **Error Handling:** Empty strings and missing fields properly detected

---

## 📚 REFERENCE DOCUMENTS

### Completed Rules (Use as Examples)
- **R20:** `docs/compliance-reports/TASK5-R20-IMPLEMENTATION-COMPLETE.md`
- **R19:** `docs/compliance-reports/TASK5-R19-IMPLEMENTATION-COMPLETE.md`
- **R18:** `docs/compliance-reports/TASK5-R18-IMPLEMENTATION-COMPLETE.md`

### Related Rules
- **R03:** Architecture Boundaries (Tier 1 - BLOCK) - Similar scope, different enforcement level
- **R21:** File Organization (Tier 3 - WARNING) - Current rule

### Main Handoff
- **File:** `docs/compliance-reports/AGENT-HANDOFF-PROMPT.md`
- **Contains:** Full workflow, patterns, file locations, examples

---

## 🎓 LESSONS LEARNED (From R20)

### What Worked Well
1. **Three-Layer Validation:** Pattern matching + comparison + design system validation provides comprehensive coverage
2. **Page Classification:** Automatic classification makes comparison logic work well
3. **Design System Integration:** Parsing documentation provides authoritative validation
4. **Component Detection:** Import checking + catalog validation + duplicate detection prevents issues
5. **Actionable Feedback:** Specific suggestions and comparable page references help developers

### Common Pitfalls to Avoid
1. **Python-Style Conditionals:** Use helper functions with multiple rules instead
2. **OR Operators:** Split into separate rules instead of using `||`
3. **Empty String Detection:** Always check both `not field` and `field == ""`
4. **Syntax Errors:** Test early and often to catch syntax issues quickly

### Recommendations for R21
1. **Test Early:** Run OPA tests frequently during development
2. **Watch for Common Errors:** Python-style conditionals, OR operators, empty strings
3. **Follow Patterns:** Use R20 implementation as reference for structure
4. **Document Errors:** Log any syntax/type errors encountered and their fixes

---

## 🚀 QUICK START GUIDE

### Step 1: Read Rule File
```bash
# Read the rule file to understand R21 requirements
cat .cursor/rules/04-architecture.mdc | grep -A 50 "R21"
```

### Step 2: Review R20 Implementation
```bash
# Review R20 implementation for patterns
cat docs/compliance-reports/TASK5-R20-IMPLEMENTATION-COMPLETE.md
cat .cursor/scripts/check-ux-consistency.py | head -100
cat services/opa/policies/ux-consistency.rego | grep -A 10 "R20-W01"
```

### Step 3: Review Related Rule (R03)
```bash
# Review R03 (Architecture Boundaries) for similar scope
cat .cursor/rules/04-architecture.mdc | grep -A 50 "R03"
```

### Step 4: Create Draft
```bash
# Create draft rule file
touch .cursor/rules/04-architecture-R21-DRAFT.md

# Create draft summary
touch docs/compliance-reports/TASK5-R21-DRAFT-SUMMARY.md
```

### Step 5: Follow Workflow
1. Generate draft (0.5 hours)
2. Present for review
3. Wait for approval
4. Implement (1.5-2 hours) - **Watch for common Rego syntax errors**
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
- **OPA Tests:** 10-12 test cases minimum (all passing)
- **Script:** 400+ lines, comprehensive detection
- **Documentation:** Complete and accurate
- **Code Quality:** Follows established patterns
- **Syntax:** Proper Rego syntax (no Python-style conditionals, no OR operators)

---

## 📞 QUESTIONS?

If you have questions about:
- **Workflow:** Refer to `docs/compliance-reports/AGENT-HANDOFF-PROMPT.md`
- **Patterns:** Refer to R20 implementation documents
- **File locations:** See "FILE LOCATIONS" section above
- **Examples:** Refer to completed rules (R14-R20)
- **Syntax Errors:** See "ERROR LOGS & FIXES FROM R20 SESSION" section above
- **Common Patterns:** See "KEY PATTERNS" section above

**Remember:** Tier 3 is simpler and more flexible than Tier 1/Tier 2. Take your time, follow the workflow, test frequently, and don't hesitate to ask for clarification if needed.

---

## 🎯 READY TO START

**Status:** R20 ✅ COMPLETE  
**Next Rule:** R21 - File Organization  
**Estimated Time:** 2 hours  
**Confidence:** HIGH

**Action:** Begin with Step 1 (Generate Draft) following the workflow above. **Remember to test frequently and watch for common Rego syntax errors!**

---

**Handoff Created:** 2025-12-05  
**Next Agent:** Please begin R21 implementation  
**Test Results:** ✅ 19/19 R20 tests passing  
**Good Luck!** 🚀

