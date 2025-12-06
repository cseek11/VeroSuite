# Rego Policy Quality Audit Report
## Comparison Against `backend.rego` Quality Standards

**Date:** 2025-12-05  
**Auditor:** AI Code Review (Cursor)  
**Reference Standards:**
- `docs/reference/rego_opa_bible.md` (Rego/OPA best practices)
- `docs/reference/great_code.md` (Code quality principles)
- `services/opa/policies/backend.rego` (Gold standard implementation)

---

## Executive Summary

This audit compares all OPA policy files against the quality standards established in `backend.rego`. The audit identified **critical errors**, **logical issues**, and **style improvements** needed to bring all policies to the same quality level.

### Quality Metrics (Backend.rego as Baseline)

**✅ Backend.rego Quality Features:**
- ✅ Input schema validation (`input_valid` guard)
- ✅ DRY helper functions (`aggregate_violations`)
- ✅ No variable shadowing (uses `v` in comprehensions)
- ✅ Proper regex string escaping (double-quoted strings)
- ✅ Empty set literal (`{}` not `set()`)
- ✅ Set union logic (comprehension-based)
- ✅ Type guards (`is_string()`, `is_array()`)
- ✅ Comprehensive documentation (heuristic limitations noted)
- ✅ Consistent error message formatting
- ✅ Proper override mechanism

---

## Critical Errors (Breaks Execution)

### 1. `security.rego` - Undefined Function Calls

**Issue:** `security.rego` imports `data.compliance.shared` and calls `shared.has_override_marker()`, but `_shared.rego` exports the function as `has_override_marker(pr_body, rule)` without the `shared.` prefix.

**Error Count:** 10 undefined function errors

**Fix Required:**
```rego
# Current (WRONG):
import data.compliance.shared
not shared.has_override_marker(input.pr_body, "tenant-isolation")

# Option 1: Use fully qualified path (CORRECT):
import data.compliance.shared
not data.compliance.shared.has_override_marker(input.pr_body, "tenant-isolation")

# Option 2: Use import alias (CORRECT):
import data.compliance.shared as shared
not shared.has_override_marker(input.pr_body, "tenant-isolation")

# Option 3: Implement local function like backend.rego (RECOMMENDED for consistency):
# Remove import, add local function:
has_override(marker) if {
    some file in input.changed_files
    contains(file.content, marker)
}
has_override(marker) if {
    is_string(input.pr_body)
    contains(input.pr_body, marker)
}
```

**Note:** `backend.rego` implements its own `has_override()` function locally, which is the recommended pattern for consistency. The `_shared.rego` file exists but may not be imported correctly in all cases.

**Files Affected:**
- `services/opa/policies/security.rego` (lines 42, 58, 72, 85, 101, 114, 135, 152, 165, 179)

**Priority:** 🔴 **CRITICAL** - Policy will not compile

---

### 2. `data-integrity.rego` - Missing Import

**Issue:** `data-integrity.rego` calls `has_override_marker()` but doesn't import `_shared.rego`.

**Fix Required:**
```rego
# Add import at top of file
import data.compliance.shared
```

**OR** implement local `has_override_marker()` function (like `backend.rego` does).

**Files Affected:**
- `services/opa/policies/data-integrity.rego` (multiple lines)

**Priority:** 🔴 **CRITICAL** - Policy will not compile

---

## High Priority Issues (Test First)

### 3. Regex String Escaping

**Issue:** Several files may have unescaped regex patterns (need verification).

**Files to Check:**
- `data-integrity.rego` - Uses `regex.find_all_string_submatch_n()` with backtick patterns
- `quality.rego` - Uses regex patterns
- `security.rego` - Uses regex patterns
- `error-handling.rego` - Uses regex patterns
- `observability.rego` - Uses regex patterns
- `architecture.rego` - Uses regex patterns
- `frontend.rego` - Uses regex patterns
- `documentation.rego` - Uses regex patterns
- `operations.rego` - Uses regex patterns
- `tech-debt.rego` - Uses regex patterns
- `ux-consistency.rego` - Uses regex patterns

**Fix Pattern (from backend.rego):**
```rego
# ❌ WRONG (if using backticks):
regex.match(`if\s*\([^)]*\)\s*\{[^}]*if\s*\(`, content)

# ✅ CORRECT (double-quoted with escaping):
regex.match("if\\s*\\([^)]*\\)\\s*\\{[^}]*if\\s*\\(", content)
```

**Priority:** 🟠 **HIGH** - May cause runtime errors

---

### 4. Input Schema Validation

**Issue:** Most files don't have `input_valid` guard before accessing `input.changed_files`.

**Files Missing Input Guard:**
- `_shared.rego` - Has `has_changed_files` but not used consistently
- `data-integrity.rego` - No input guard
- `quality.rego` - No input guard
- `security.rego` - Uses `shared.has_changed_files` but inconsistently
- `error-handling.rego` - No input guard
- `observability.rego` - No input guard
- `architecture.rego` - No input guard
- `frontend.rego` - No input guard
- `documentation.rego` - No input guard
- `infrastructure.rego` - No input guard
- `operations.rego` - No input guard
- `tech-debt.rego` - No input guard
- `ux-consistency.rego` - No input guard

**Fix Pattern (from backend.rego):**
```rego
# Add at top of file (after imports):
input_valid if {
    is_array(input.changed_files)
}

# Then use in all deny/warn rules:
deny[msg] if {
    input_valid  # ← Add this
    some file in input.changed_files
    # ... rest of logic
}
```

**Priority:** 🟠 **HIGH** - Prevents runtime errors on malformed input

---

## Medium Priority Issues (Documentation)

### 5. Missing Documentation for Heuristic Limitations

**Issue:** Several files use file-level heuristics but don't document limitations.

**Files Needing Documentation:**
- `data-integrity.rego` - Layer sync checks are file-level heuristics
- `security.rego` - Tenant isolation checks are file-level heuristics
- `quality.rego` - Test detection is heuristic-based
- `error-handling.rego` - Error detection is heuristic-based
- `observability.rego` - Logging detection is heuristic-based
- `architecture.rego` - Import detection is heuristic-based
- `frontend.rego` - Platform detection is heuristic-based

**Fix Pattern (from backend.rego):**
```rego
# Add comment before heuristic functions:
# NOTE: File-level heuristic limitation
# This check scans the entire file for tenant_id or withTenant. If ANY occurrence
# exists anywhere in the file, the check passes. This can produce false negatives
# where a file has tenant_id in one query but not in another.
# For accurate detection, an AST-based implementation is recommended that checks
# tenant_id presence within the same query context as the Prisma call.
find_prisma_query_without_tenant(content) := query if {
    # ... implementation
}
```

**Priority:** 🟡 **MEDIUM** - Improves maintainability and sets expectations

---

### 6. Missing DRY Helper Functions

**Issue:** Many files repeat the same violation aggregation pattern.

**Files with Repeated Patterns:**
- `quality.rego` - Uses nested `array.concat()` for violations
- `error-handling.rego` - Uses nested `array.concat()` for violations
- `observability.rego` - Uses nested `array.concat()` for violations

**Fix Pattern (from backend.rego):**
```rego
# Add helper function:
aggregate_violations(rule_set) := text if {
    arr := [v | rule_set[v]]
    text := concat("\n", arr)
}

# Then use in deny rules:
deny[msg] if {
    input_valid
    count(violations) > 0
    not has_override("@override:rule-name")
    
    violations_text := aggregate_violations(violations)
    msg := sprintf("OVERRIDE REQUIRED [Domain/Rule]: Violations:\n%s", [violations_text])
}
```

**Priority:** 🟡 **MEDIUM** - Reduces code duplication, improves maintainability

---

## Low Priority Issues (Refactoring)

### 7. Variable Shadowing

**Issue:** Some files use `msg` in both rule head and comprehensions.

**Files to Check:**
- `quality.rego` - Uses `msg` in comprehensions
- `error-handling.rego` - Uses `msg` in comprehensions
- `observability.rego` - Uses `msg` in comprehensions

**Fix Pattern (from backend.rego):**
```rego
# ❌ WRONG (variable shadowing):
deny[msg] if {
    violations_array := [msg | some_rule[msg]]  # msg shadows outer msg
    msg := sprintf("...", [violations_array])
}

# ✅ CORRECT (use different variable):
deny[msg] if {
    violations_array := [v | some_rule[v]]  # v doesn't shadow
    msg := sprintf("...", [violations_array])
}
```

**Priority:** 🟢 **LOW** - Code clarity improvement

---

### 8. Inconsistent Override Mechanism

**Issue:** Different files implement override checks differently.

**Current Patterns:**
- `backend.rego` - Has local `has_override(marker)` function
- `security.rego` - Tries to use `shared.has_override_marker()`
- `data-integrity.rego` - Has local `has_override_marker(pr_body, rule)` function
- `quality.rego` - Has local `has_override(marker)` function
- `error-handling.rego` - Has local `has_override(marker)` function
- `observability.rego` - Has local `has_override(marker)` function

**Recommendation:**
- Standardize on `_shared.rego` helper OR
- Each file implements its own (like `backend.rego`)

**Priority:** 🟢 **LOW** - Consistency improvement

---

### 9. Missing Type Guards

**Issue:** Some files access `input.pr_body` without checking if it's a string.

**Files to Check:**
- `data-integrity.rego` - Accesses `input.pr_body` directly
- `quality.rego` - Checks `input.pr_body != null` but not `is_string()`
- `error-handling.rego` - Checks `input.pr_body != null` but not `is_string()`
- `observability.rego` - Checks `input.pr_body != null` but not `is_string()`

**Fix Pattern (from backend.rego):**
```rego
# ❌ WRONG (may error if pr_body is not a string):
has_override(marker) if {
    contains(input.pr_body, marker)
}

# ✅ CORRECT (type guard):
has_override(marker) if {
    is_string(input.pr_body)
    contains(input.pr_body, marker)
}
```

**Priority:** 🟢 **LOW** - Defensive programming

---

## File-by-File Summary

### ✅ `backend.rego` (Gold Standard)
- ✅ Input schema validation
- ✅ DRY helper functions
- ✅ No variable shadowing
- ✅ Proper regex escaping
- ✅ Empty set literal (`{}`)
- ✅ Set union logic
- ✅ Type guards
- ✅ Comprehensive documentation
- ✅ Consistent error messages

**Status:** ✅ **COMPLIANT** - Reference implementation

---

### 🔴 `security.rego` (Critical Errors)

**Critical Issues:**
1. **10 undefined function errors** - `shared.has_override_marker()` doesn't exist
2. Missing input guard (`input_valid`)
3. Regex patterns need verification (may have unescaped patterns)

**Fixes Needed:**
1. Fix `has_override_marker()` calls (use local function or fix import)
2. Add `input_valid` guard
3. Verify regex string escaping
4. Add type guards for `input.pr_body`

**Priority:** 🔴 **CRITICAL** - Won't compile

---

### 🔴 `data-integrity.rego` (Critical Errors)

**Critical Issues:**
1. Missing import for `has_override_marker()` (calls function but doesn't import)
2. Missing input guard (`input_valid`)
3. Regex patterns use `regex.find_all_string_submatch_n()` - verify escaping

**Fixes Needed:**
1. Add import `import data.compliance.shared` OR implement local function
2. Add `input_valid` guard
3. Verify regex string escaping
4. Add type guards for `input.pr_body`
5. Add documentation for heuristic limitations

**Priority:** 🔴 **CRITICAL** - Won't compile

---

### 🟠 `quality.rego` (High Priority)

**Issues:**
1. Missing input guard (`input_valid`)
2. Nested `array.concat()` pattern (should use DRY helper)
3. Variable shadowing potential (uses `msg` in comprehensions)
4. Type guard for `input.pr_body` (checks `!= null` but not `is_string()`)
5. Regex patterns need verification

**Fixes Needed:**
1. Add `input_valid` guard
2. Add `aggregate_violations()` helper function
3. Fix variable shadowing (use `v` instead of `msg` in comprehensions)
4. Add `is_string()` check for `input.pr_body`
5. Verify regex string escaping

**Priority:** 🟠 **HIGH** - Runtime safety

---

### 🟠 `error-handling.rego` (High Priority)

**Issues:**
1. Missing input guard (`input_valid`)
2. Nested `array.concat()` pattern (should use DRY helper)
3. Variable shadowing potential
4. Type guard for `input.pr_body`
5. Regex patterns need verification

**Fixes Needed:**
1. Add `input_valid` guard
2. Add `aggregate_violations()` helper function
3. Fix variable shadowing
4. Add `is_string()` check for `input.pr_body`
5. Verify regex string escaping

**Priority:** 🟠 **HIGH** - Runtime safety

---

### 🟠 `observability.rego` (High Priority)

**Issues:**
1. Missing input guard (`input_valid`)
2. Nested `array.concat()` pattern (should use DRY helper)
3. Variable shadowing potential
4. Type guard for `input.pr_body`
5. Regex patterns need verification

**Fixes Needed:**
1. Add `input_valid` guard
2. Add `aggregate_violations()` helper function
3. Fix variable shadowing
4. Add `is_string()` check for `input.pr_body`
5. Verify regex string escaping

**Priority:** 🟠 **HIGH** - Runtime safety

---

### 🟡 `architecture.rego` (Medium Priority)

**Issues:**
1. Missing input guard (`input_valid`)
2. Regex patterns need verification
3. Missing documentation for heuristic limitations

**Fixes Needed:**
1. Add `input_valid` guard
2. Verify regex string escaping
3. Add documentation for import detection heuristics

**Priority:** 🟡 **MEDIUM** - Documentation and safety

---

### 🟡 `frontend.rego` (Medium Priority)

**Issues:**
1. Missing input guard (`input_valid`)
2. Regex patterns need verification
3. Missing documentation for heuristic limitations

**Fixes Needed:**
1. Add `input_valid` guard
2. Verify regex string escaping
3. Add documentation for platform detection heuristics

**Priority:** 🟡 **MEDIUM** - Documentation and safety

---

### 🟡 `documentation.rego` (Medium Priority)

**Issues:**
1. Missing input guard (`input_valid`)
2. Regex patterns need verification

**Fixes Needed:**
1. Add `input_valid` guard
2. Verify regex string escaping

**Priority:** 🟡 **MEDIUM** - Safety

---

### 🟡 `infrastructure.rego` (Medium Priority)

**Issues:**
1. Missing input guard (`input_valid`)
2. Regex patterns need verification
3. Uses `override contains msg` instead of `deny contains msg` (inconsistent with other files)

**Fixes Needed:**
1. Add `input_valid` guard
2. Verify regex string escaping
3. Consider standardizing on `deny` instead of `override` (or document why different)

**Priority:** 🟡 **MEDIUM** - Safety and consistency

---

### 🟡 `operations.rego` (Medium Priority)

**Issues:**
1. Missing input guard (`input_valid`)
2. Regex patterns need verification

**Fixes Needed:**
1. Add `input_valid` guard
2. Verify regex string escaping

**Priority:** 🟡 **MEDIUM** - Safety

---

### 🟡 `tech-debt.rego` (Medium Priority)

**Issues:**
1. Missing input guard (`input_valid`)
2. Regex patterns need verification
3. Missing package declaration comment (has package but no header comment)

**Fixes Needed:**
1. Add `input_valid` guard
2. Verify regex string escaping
3. Add file header comment (like other policy files)

**Priority:** 🟡 **MEDIUM** - Safety and consistency

---

### 🟡 `ux-consistency.rego` (Medium Priority)

**Issues:**
1. Missing input guard (`input_valid`)
2. Regex patterns need verification
3. Uses array comprehensions for warnings (could use DRY helper)

**Fixes Needed:**
1. Add `input_valid` guard
2. Verify regex string escaping
3. Consider DRY helper for warning aggregation

**Priority:** 🟡 **MEDIUM** - Safety and consistency

---

### 🟢 `_shared.rego` (Low Priority)

**Issues:**
1. Function `has_override_marker()` exists but may not be imported correctly
2. Deprecated `starts_with()` helper (documented as deprecated, good)

**Fixes Needed:**
1. Verify import path works correctly (or document usage pattern)
2. Consider removing deprecated helper after migration complete

**Priority:** 🟢 **LOW** - Documentation

---

### 🟢 `_template.rego` (Low Priority)

**Issues:**
1. Template file - not for production use
2. Uses `override contains msg` instead of `deny contains msg` (inconsistent)

**Fixes Needed:**
1. Update template to match `backend.rego` patterns
2. Standardize on `deny` instead of `override` (or document both)

**Priority:** 🟢 **LOW** - Template consistency

---

## Recommended Fix Order

### Phase 1: Critical Fixes (Must Fix First)
1. ✅ Fix `security.rego` - Undefined function errors (10 errors)
2. ✅ Fix `data-integrity.rego` - Missing import/function

### Phase 2: High Priority (Test First)
3. ✅ Add `input_valid` guards to all files
4. ✅ Verify regex string escaping in all files
5. ✅ Add type guards for `input.pr_body`

### Phase 3: Medium Priority (Documentation)
6. ✅ Add heuristic limitation documentation
7. ✅ Add DRY helper functions where applicable

### Phase 4: Low Priority (Refactoring)
8. ✅ Fix variable shadowing
9. ✅ Standardize override mechanism
10. ✅ Add file header comments where missing

---

## Testing Checklist

After applying fixes, verify:

- [ ] All files compile with `opa check`
- [ ] All files pass `opa test` (if tests exist)
- [ ] Input validation works (test with missing `changed_files`)
- [ ] Override mechanism works (test with `@override:` markers)
- [ ] Regex patterns match correctly (test with sample inputs)
- [ ] Type guards prevent errors (test with non-string `pr_body`)
- [ ] No variable shadowing warnings (check with `opa check --strict`)

---

## Summary Statistics

| Category | Count | Priority |
|----------|-------|----------|
| Critical Errors (won't compile) | 2 files | 🔴 |
| High Priority Issues | 3 files | 🟠 |
| Medium Priority Issues | 7 files | 🟡 |
| Low Priority Issues | 3 files | 🟢 |
| **Total Files Needing Fixes** | **15 files** | |

**Files Already Compliant:**
- ✅ `backend.rego` (reference implementation)

---

## Next Steps

1. **Immediate:** Fix critical errors in `security.rego` and `data-integrity.rego`
2. **Short-term:** Add input guards and type guards to all files
3. **Medium-term:** Add documentation and DRY helpers
4. **Long-term:** Standardize patterns across all files

---

**Last Updated:** 2025-12-05  
**Auditor:** AI Code Review (Cursor)  
**Reference:** `services/opa/policies/backend.rego` (Gold Standard)

