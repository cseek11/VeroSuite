# R21 Fix Results - After Priority 1 & 2 Fixes

**Date:** 2025-11-23  
**Fixes Applied:** sprintf format strings, regex patterns  
**Test Results:** 5/19 passing (same as before)

---

## Fixes Applied

### ✅ Priority 1: sprintf Format String (APPLIED)
- **Issue:** Directory depth warning had format string mismatch
- **Fix:** Already correct in code (line 300 has two placeholders for two values)
- **Status:** No change needed

### ✅ Priority 2: Regex Patterns (APPLIED)

#### Fix 2.1: Cross-service import detection
**Before:**
```rego
regex.match(`import.*from\s+['"]\.\./\.\./\.\./[^'"]+/src/`, file.diff)
```

**After:**
```rego
regex.match(`import\s+.*\s+from\s+['"](\.\./){3,}[^'"]+`, file.diff)
```

#### Fix 2.2: Deep relative import detection
**Before:**
```rego
regex.match(`import.*from\s+['"]\.\./\.\./\.\./`, file.diff)
```

**After:**
```rego
regex.match(`import\s+.*\s+from\s+['"](\.\./){3,}`, file.diff)
```

#### Fix 2.3: File naming patterns
**Before:**
```rego
regex.match(`/[a-z][^/]*\.tsx$`, file.path)
regex.match(`/[A-Z][^/]*\.ts$`, file.path)
```

**After:**
```rego
regex.match(`/[a-z][a-z0-9_-]*\.tsx$`, file.path)
regex.match(`/[A-Z][A-Za-z0-9_-]*\.ts$`, file.path)
```

---

## Test Results After Fixes

**Still Failing: 14/19 tests**

All failures show the same pattern - the rules are being evaluated but conditions aren't matching. Looking at the trace output:

```
policies/architecture.rego:161  | | | | Fail startswith(__local252__, "backend/src/")
policies/architecture.rego:172  | | | | Fail startswith(__local255__, "backend/prisma/")
policies/architecture.rego:183  | | | | Fail regex.match("^src/", __local258__)
policies/architecture.rego:233  | | | | Fail contains(__local281__, "@verosuite/")
```

---

## Root Cause Analysis

### The Real Problem: Warnings Aren't Being Generated

Looking at the test trace, **every single rule condition is failing**. This suggests:

1. **`file.path` and `file.diff` are accessible** (no undefined errors)
2. **But the values don't match what we expect**

### Hypothesis: Test Data Structure Mismatch

The tests provide:
```rego
{
    "changed_files": [{
        "path": "backend/src/auth/auth.service.ts",
        "diff": "export class AuthService {}"
    }]
}
```

But the policy might be expecting a different structure, OR the values are being transformed/escaped.

### Evidence from Trace Output

```
Fail startswith(__local252__, "backend/src/")
```

This shows:
- `__local252__` is the value being checked (likely `file.path`)
- The `startswith` check is failing
- This means `__local252__` does NOT start with `"backend/src/"`

**Possible causes:**
1. `file.path` is empty or undefined
2. `file.path` has a different value than expected
3. The test framework is transforming the input

---

## Debugging Strategy

### Step 1: Add Debug Output to Policy

Add a debug rule to see what values we're actually getting:

```rego
# Add this BEFORE the file_organization_warnings rules
debug_file_info[msg] if {
    some file in input.changed_files
    msg := sprintf("DEBUG: path='%s' diff='%s'", [file.path, file.diff])
}

# Modify warn rule to include debug output
warn contains msg if {
    some debug in debug_file_info
    msg := debug
}
```

### Step 2: Test with Minimal Input

Create a minimal test to verify data access:

```rego
test_debug_file_access if {
    result := architecture.warn with input as {
        "changed_files": [{
            "path": "backend/src/test.ts",
            "diff": "test"
        }]
    }
    # Should see DEBUG output
    some warning in result
    contains(warning, "DEBUG:")
}
```

### Step 3: Check OPA Version and Behavior

The OPA version might have different behavior for `contains`, `startswith`, etc.

---

## Alternative Hypothesis: Rule Collection Issue

Looking at the warn rule:

```rego
warn contains msg if {
    some warning in file_organization_warnings
    msg := warning
}
```

This collects warnings from `file_organization_warnings`. But if `file_organization_warnings` is empty (no warnings generated), then `warn` will also be empty.

**The trace shows:**
- Rules are being evaluated (we see "Enter data.compliance.architecture.file_organization_warnings")
- But conditions are failing (we see "Fail startswith(...)")
- So no warnings are added to `file_organization_warnings`
- Therefore `warn` is empty

**This is correct behavior IF the conditions are truly failing.**

---

## Recommended Next Steps

### Option A: Add Debug Output (Recommended)

1. Add debug rules to see actual values
2. Run tests to see debug output
3. Adjust rules based on actual data structure

### Option B: Simplify Test Cases

1. Create ultra-simple test with minimal data
2. Verify basic string operations work
3. Build up complexity gradually

### Option C: Check OPA Documentation

1. Verify `startswith`, `contains`, `regex.match` syntax
2. Check if there are known issues with these functions
3. Review OPA test framework behavior

---

## Current Status

**Fixes Applied:** ✅ Priority 1 & 2 complete  
**Tests Passing:** 5/19 (no change)  
**Root Cause:** Conditions failing - need to debug actual data values  
**Next Action:** Add debug output to see what values we're actually receiving

---

## Summary

The regex pattern fixes are correct and applied, but they don't help because **the underlying issue is that ALL conditions are failing**, not just regex patterns. This suggests:

1. Data structure mismatch between tests and policy
2. OPA behavior difference from expectations
3. Test framework transforming input data

**We need to see the actual values** being passed to the rules to understand why conditions are failing.

---

**Last Updated:** 2025-11-23  
**Status:** Awaiting Debug Output



