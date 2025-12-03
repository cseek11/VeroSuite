# jq --argjson Error Fix: Exit Code 5

**Date:** 2025-11-25  
**Error:** `jq: parse error: Invalid numeric literal at line 12, column 17`  
**Exit Code:** 5  
**Status:** ✅ **FIX IDENTIFIED**

---

## Error Details

**Command:**
```bash
jq --arg title "$PR_TITLE" \
   --arg body "$PR_BODY" \
   --argjson number "$PR_NUMBER" \
   --arg author "$AUTHOR" \
   '. + {
     "pr_title": $title,
     "pr_body": $body,
     "pr_number": $number,
     "author": $author
   }' changed_files.json > opa-input.json
```

**Error Message:**
```
jq: parse error: Invalid numeric literal at line 12, column 17
Error: Process completed with exit code 5.
```

**Variables:**
```bash
PR_NUMBER="375"
```

---

## Root Cause

**Pattern:** `JQ_ARGJSON_INVALID_JSON`

The issue is that `--argjson` expects **valid JSON**, but `$PR_NUMBER` is a **shell string** (with quotes). When jq tries to parse `"375"` as JSON, it fails because:

1. `PR_NUMBER="375"` creates a shell string variable
2. `--argjson number "$PR_NUMBER"` passes the string `"375"` to jq
3. jq tries to parse `"375"` as JSON, but it's already a string literal
4. jq expects either:
   - A raw number: `375` (no quotes)
   - Or valid JSON: `"375"` (with quotes, but then it's a JSON string, not a number)

**The Problem:**
- `--argjson` expects the value to be **parsed as JSON**
- If you pass `"375"` (with quotes), jq tries to parse it and gets confused
- If you pass `375` (without quotes), jq parses it as a JSON number ✅

---

## Solution

### Option 1: Remove Quotes from Variable (Recommended)

**Before:**
```bash
PR_NUMBER="375"  # String with quotes
jq --argjson number "$PR_NUMBER" ...
```

**After:**
```bash
PR_NUMBER=375  # Number without quotes
jq --argjson number "$PR_NUMBER" ...
```

**Why This Works:**
- `PR_NUMBER=375` (no quotes) is a shell variable containing the number `375`
- When passed to `--argjson`, jq parses it as a JSON number ✅

---

### Option 2: Use --arg Instead (Alternative)

**Before:**
```bash
PR_NUMBER="375"
jq --argjson number "$PR_NUMBER" ...
```

**After:**
```bash
PR_NUMBER="375"
jq --arg number "$PR_NUMBER" ...
# Then in jq expression, use: "pr_number": ($number | tonumber)
```

**Why This Works:**
- `--arg` treats the value as a string (no JSON parsing)
- Then convert to number in jq expression using `tonumber`

---

### Option 3: Use GitHub Actions Expression with Single Quotes (Best for Workflows)

**In Workflow:**
```yaml
- name: Build OPA Input
  run: |
    jq --arg title "$PR_TITLE" \
       --arg body "$PR_BODY" \
       --argjson number '${{ github.event.pull_request.number || 0 }}' \
       --arg author "$AUTHOR" \
       '. + {
         "pr_title": $title,
         "pr_body": $body,
         "pr_number": $number,
         "author": $author
       }' changed_files.json > opa-input.json
```

**Why This Works:**
- **Single quotes** around the expression prevent shell interpolation
- GitHub Actions substitutes the value directly as a JSON number
- The `|| 0` provides a fallback if the value is null/undefined
- No intermediate variable needed - passes JSON literal directly

---

## Recommended Fix for Workflow

**File:** `.github/workflows/opa_compliance_check.yml`

**Change:**
```yaml
# Before (WRONG):
- name: Set PR variables
  run: |
    PR_NUMBER="${{ github.event.pull_request.number || 0 }}"
    # ... other variables

- name: Build OPA Input
  run: |
    jq --argjson number "$PR_NUMBER" ...

# After (CORRECT):
- name: Build OPA Input
  run: |
    jq --arg title "$PR_TITLE" \
       --arg body "$PR_BODY" \
       --argjson number '${{ github.event.pull_request.number || 0 }}' \
       --arg author "$AUTHOR" \
       '. + {
         "pr_title": $title,
         "pr_body": $body,
         "pr_number": $number,
         "author": $author
       }' changed_files.json > opa-input.json
```

**Key Points:**
- ✅ **Single quotes** around the GitHub expression: `'${{ ... }}'`
- ✅ Prevents shell interpolation while allowing GitHub Actions substitution
- ✅ No intermediate variable needed - passes JSON literal directly
- ✅ `|| 0` provides fallback if value is null/undefined
- ✅ Works correctly even if expression evaluates to unexpected values

**Why Single Quotes:**
- Single quotes prevent the shell from interpreting the expression
- GitHub Actions still substitutes the value correctly
- The value is passed directly as a JSON number to jq
- Avoids edge cases where shell might misinterpret the value

---

## Verification

**Test the fix:**
```bash
# Test with number (no quotes)
PR_NUMBER=375
jq --argjson number "$PR_NUMBER" -n '{pr_number: $number}'
# Output: {"pr_number":375} ✅

# Test with string (quotes) - FAILS
PR_NUMBER="375"
jq --argjson number "$PR_NUMBER" -n '{pr_number: $number}'
# Error: parse error ❌
```

---

## Error Pattern

**Pattern:** `JQ_ARGJSON_INVALID_JSON`

**Root Cause:**
- `--argjson` expects valid JSON input
- Shell string variables with quotes are not valid JSON when passed directly
- Need to pass raw values (numbers without quotes) or use `--arg` for strings

**Prevention:**
- Use `--argjson` only for JSON values (numbers, booleans, null, JSON objects/arrays)
- Use `--arg` for strings
- In GitHub Actions, use expressions with **single quotes**: `'${{ ... }}'` to prevent shell interpolation
- Single quotes allow GitHub Actions substitution while preventing shell interpretation
- Always provide fallback values: `${{ value || 0 }}` for numbers

---

## Related Issues

- Similar issue can occur with boolean values: `PR_MERGED="true"` should be `PR_MERGED=true`
- Similar issue with null: `PR_NUMBER="null"` should be handled differently

---

**Last Updated:** 2025-11-25  
**Status:** ✅ **FIX IDENTIFIED**

