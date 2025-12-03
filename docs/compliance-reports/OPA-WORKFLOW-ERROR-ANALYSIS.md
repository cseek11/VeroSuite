# OPA Compliance Check Workflow - Error Analysis

**Date:** 2025-11-24  
**File:** `.github/workflows/opa_compliance_check.yml`  
**Status:** ⚠️ **3 CRITICAL ISSUES FOUND**

---

## Executive Summary

After reviewing the workflow file against the Rego Language Reference Guide and jq best practices, **3 critical issues** were identified that could cause workflow failures or security vulnerabilities:

1. **JSON Injection Vulnerability** (Line 303) - CRITICAL
2. **Unescaped File Paths in JSON** (Line 62) - HIGH
3. **Potential Invalid JSON for PR Number** (Line 298) - MEDIUM

---

## Issue 1: JSON Injection Vulnerability (CRITICAL) ⚠️

**Location:** Line 303  
**Severity:** CRITICAL  
**Pattern:** `JSON_INJECTION_VULNERABILITY`

### Problem

```yaml
# Line 293-304
jq -r '[.. | .deny? | select(. != null)] | flatten | .[]' opa-results.json | while read -r violation; do
  curl -X POST "$API_URL/compliance/checks" \
    -H "Authorization: Bearer $API_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"pr_number\": $PR_NUMBER,
      \"commit_sha\": \"$COMMIT_SHA\",
      \"rule_id\": \"R01\",
      \"status\": \"VIOLATION\",
      \"severity\": \"BLOCK\",
      \"violation_message\": \"$violation\"  # ❌ VULNERABILITY
    }"
done
```

**Issues:**
1. **Unescaped violation message**: If `$violation` contains quotes (`"`), backslashes (`\`), or newlines, it will break the JSON
2. **JSON injection risk**: Malicious violation messages could inject JSON code
3. **Command injection risk**: If violation contains shell metacharacters, could execute commands

**Example Attack:**
```json
// If violation message is:
"HARD STOP [Security]: Missing tenant_id\"}, {\"pr_number\": 999, \"status\": \"PASS\""

// Results in invalid/malicious JSON:
{
  "pr_number": 123,
  "violation_message": "HARD STOP [Security]: Missing tenant_id"}, {"pr_number": 999, "status": "PASS"
}
```

### Solution

**Use jq to properly construct JSON:**

```yaml
# Parse OPA results and send to API
jq -r '[.. | .deny? | select(. != null)] | flatten | .[]' opa-results.json | while read -r violation; do
  # Use jq to properly escape and construct JSON
  JSON_PAYLOAD=$(jq -n \
    --arg pr_number "$PR_NUMBER" \
    --arg commit_sha "$COMMIT_SHA" \
    --arg violation_msg "$violation" \
    '{
      pr_number: ($pr_number | tonumber),
      commit_sha: $commit_sha,
      rule_id: "R01",
      status: "VIOLATION",
      severity: "BLOCK",
      violation_message: $violation_msg
    }')
  
  curl -X POST "$API_URL/compliance/checks" \
    -H "Authorization: Bearer $API_TOKEN" \
    -H "Content-Type: application/json" \
    -d "$JSON_PAYLOAD" || echo "Failed to send violation: $violation"
done
```

**Why This Works:**
- `jq` properly escapes all special characters
- Prevents JSON injection attacks
- Handles newlines, quotes, backslashes correctly
- Type-safe (converts PR number to number)

---

## Issue 2: Unescaped File Paths in JSON (HIGH) ⚠️

**Location:** Line 62  
**Severity:** HIGH  
**Pattern:** `UNESCAPED_JSON_STRING`

### Problem

```yaml
# Line 60-67
cat >> changed_files.json <<EOF
{
  "path": "$file",  # ❌ Unescaped file path
  "diff": "$diff",  # ✅ Already escaped (line 56)
  "additions": ${additions:-0},
  "deletions": ${deletions:-0}
}
EOF
```

**Issues:**
1. **File paths not escaped**: If file path contains quotes, backslashes, or special characters, JSON will be invalid
2. **Path injection**: Malicious file names could break JSON structure
3. **Inconsistency**: Diff is escaped (line 56) but path is not

**Example Failure:**
```bash
# If file path is: apps/api/src/users/"admin".ts
# Results in invalid JSON:
{
  "path": "apps/api/src/users/"admin".ts",  # ❌ Invalid JSON
  "diff": "..."
}
```

### Solution

**Escape file paths properly:**

```yaml
# Get diff for this file
diff=$(git diff $BASE_SHA $HEAD_SHA -- "$file" | sed 's/"/\\"/g' | awk '{printf "%s\\n", $0}')
# Escape file path for JSON
escaped_path=$(printf '%s' "$file" | jq -Rs .)
additions=$(git diff --numstat $BASE_SHA $HEAD_SHA -- "$file" | awk '{print $1}')
deletions=$(git diff --numstat $BASE_SHA $HEAD_SHA -- "$file" | awk '{print $2}')

cat >> changed_files.json <<EOF
{
  "path": $escaped_path,
  "diff": "$diff",
  "additions": ${additions:-0},
  "deletions": ${deletions:-0}
}
EOF
```

**Alternative (Better): Use jq to build entire JSON:**

```yaml
# Build JSON array of changed files with diffs using jq
jq -n --argjson files "$(
  while IFS= read -r file; do
    if [ -f "$file" ]; then
      diff=$(git diff $BASE_SHA $HEAD_SHA -- "$file" | jq -Rs .)
      additions=$(git diff --numstat $BASE_SHA $HEAD_SHA -- "$file" | awk '{print $1}')
      deletions=$(git diff --numstat $BASE_SHA $HEAD_SHA -- "$file" | awk '{print $2}')
      jq -n \
        --arg path "$file" \
        --argjson diff "$diff" \
        --argjson additions "${additions:-0}" \
        --argjson deletions "${deletions:-0}" \
        '{path: $path, diff: $diff, additions: $additions, deletions: $deletions}'
    fi
  done < changed_files.txt | jq -s .
)" '{changed_files: $files}' > changed_files.json
```

**Why This Works:**
- `jq -Rs .` properly escapes all special characters in strings
- Prevents JSON injection from file paths
- Consistent escaping for all string values
- More robust than manual sed/awk escaping

---

## Issue 3: Potential Invalid JSON for PR Number (MEDIUM) ⚠️

**Location:** Line 298  
**Severity:** MEDIUM  
**Pattern:** `POTENTIAL_INVALID_JSON`

### Problem

```yaml
# Line 280, 298
PR_NUMBER="${{ github.event.pull_request.number || github.event.number }}"
...
-d "{
  \"pr_number\": $PR_NUMBER,  # ❌ Could be empty or "null" string
  ...
}"
```

**Issues:**
1. **Empty PR_NUMBER**: If expression evaluates to empty string, JSON becomes `"pr_number": ,` (invalid)
2. **String "null"**: If PR_NUMBER is the string "null", JSON becomes `"pr_number": null,` (valid but wrong type)
3. **Check exists but may not catch all cases**: Line 283 checks for empty/null, but edge cases may slip through

**Example Failure:**
```bash
# If PR_NUMBER is empty (shouldn't happen due to check, but edge case)
PR_NUMBER=""
# Results in invalid JSON:
{
  "pr_number": ,  # ❌ Invalid JSON
  ...
}
```

### Solution

**Use jq to ensure proper JSON construction (already recommended in Issue 1):**

The fix for Issue 1 (using jq to construct JSON) also fixes this issue because:
- `jq` ensures PR_NUMBER is always a valid number or null
- Type conversion (`tonumber`) handles edge cases
- No manual string interpolation in JSON

**Additional Safety Check:**

```yaml
# Extract PR number and commit SHA
PR_NUMBER="${{ github.event.pull_request.number || github.event.number }}"
COMMIT_SHA="${{ github.event.pull_request.head.sha || github.sha }}"

# Validate PR_NUMBER is a valid number
if [ -z "$PR_NUMBER" ] || [ "$PR_NUMBER" == "null" ] || ! [[ "$PR_NUMBER" =~ ^[0-9]+$ ]]; then
  echo "⚠️ Invalid PR number: '$PR_NUMBER' - skipping API integration"
  exit 0
fi
```

---

## Additional Observations

### OPA Command Usage ✅

**Line 102-107:** The OPA eval command is correct:
```bash
opa eval \
  --data services/opa/policies/ \
  --data services/opa/data/ \
  --input opa-input.json \
  --format pretty \
  'data.compliance' > opa-results.json
```

**Verification:**
- ✅ Correct query format: `'data.compliance'`
- ✅ Correct data loading: `--data` flags
- ✅ Correct input: `--input opa-input.json`
- ✅ Format specified: `--format pretty`

**Note:** According to Rego guide, OPA queries should reference the package path. The query `'data.compliance'` assumes all policies export to `data.compliance` namespace, which is correct for the current policy structure.

### jq Usage Patterns ✅

**Most jq commands are correct:**
- ✅ Line 84-86: Proper use of `--arg` and `--argjson` (after fix)
- ✅ Line 116-118: Correct use of jq filters
- ✅ Line 125-127: Correct use of `-r` flag for raw output

---

## Recommended Fixes

### Priority 1: Fix JSON Injection (CRITICAL)

Replace lines 293-305 with:

```yaml
# Parse OPA results and send to API
jq -r '[.. | .deny? | select(. != null)] | flatten | .[]' opa-results.json | while read -r violation; do
  # Use jq to properly construct and escape JSON
  JSON_PAYLOAD=$(jq -n \
    --argjson pr_number "$PR_NUMBER" \
    --arg commit_sha "$COMMIT_SHA" \
    --arg violation_msg "$violation" \
    '{
      pr_number: $pr_number,
      commit_sha: $commit_sha,
      rule_id: "R01",
      status: "VIOLATION",
      severity: "BLOCK",
      violation_message: $violation_msg
    }')
  
  curl -X POST "$API_URL/compliance/checks" \
    -H "Authorization: Bearer $API_TOKEN" \
    -H "Content-Type: application/json" \
    -d "$JSON_PAYLOAD" || echo "Failed to send violation: $violation"
done
```

**Note:** Use `--argjson pr_number "$PR_NUMBER"` if PR_NUMBER is guaranteed to be a number, or use `--arg` and convert with `tonumber` if it might be a string.

### Priority 2: Fix File Path Escaping (HIGH)

Replace lines 55-67 with:

```yaml
# Get diff for this file (already escaped)
diff=$(git diff $BASE_SHA $HEAD_SHA -- "$file" | sed 's/"/\\"/g' | awk '{printf "%s\\n", $0}')
# Escape file path for JSON
escaped_path=$(printf '%s' "$file" | jq -Rs .)
additions=$(git diff --numstat $BASE_SHA $HEAD_SHA -- "$file" | awk '{print $1}')
deletions=$(git diff --numstat $BASE_SHA $HEAD_SHA -- "$file" | awk '{print $2}')

cat >> changed_files.json <<EOF
{
  "path": $escaped_path,
  "diff": "$diff",
  "additions": ${additions:-0},
  "deletions": ${deletions:-0}
}
EOF
```

### Priority 3: Add PR Number Validation (MEDIUM)

Add after line 281:

```yaml
# Validate PR_NUMBER is a valid number
if [ -z "$PR_NUMBER" ] || [ "$PR_NUMBER" == "null" ] || ! [[ "$PR_NUMBER" =~ ^[0-9]+$ ]]; then
  echo "⚠️ Invalid PR number: '$PR_NUMBER' - skipping API integration"
  exit 0
fi
```

---

## Testing Recommendations

### Test Case 1: JSON Injection
```bash
# Create test violation with quotes
violation='HARD STOP [Security]: Missing tenant_id"}, {"pr_number": 999'

# Should properly escape and create valid JSON
```

### Test Case 2: Special Characters in File Paths
```bash
# Create test file with quotes in path
file='apps/api/src/users/"admin".ts'

# Should properly escape path in JSON
```

### Test Case 3: Edge Cases for PR Number
```bash
# Test with empty, null, and invalid values
PR_NUMBER=""
PR_NUMBER="null"
PR_NUMBER="abc"

# Should all be caught by validation
```

---

## Summary

**Issues Found:** 3
- **CRITICAL:** 1 (JSON injection vulnerability)
- **HIGH:** 1 (Unescaped file paths)
- **MEDIUM:** 1 (Potential invalid JSON)

**OPA Command:** ✅ Correct (no issues)

**jq Usage:** ⚠️ Mostly correct, but needs fixes for JSON construction

**Recommendation:** Apply all three fixes before deploying to production.

---

**Last Updated:** 2025-11-24  
**Status:** ⚠️ **FIXES REQUIRED**



