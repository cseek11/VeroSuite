# Pattern Comparison: Policy vs Test Inputs

## Summary

**Status:** 14/16 tests passing ✅  
**Failing Tests:** `test_security_tests_exist`, `test_data_migration_tests_exist`

---

## Test 9: Security Tests (`test_security_tests_exist`)

### Policy Flow

1. **`needs_security_tests(file)`** checks:
   - ✅ `file.path` contains "auth" → `apps/api/src/auth/auth.service.ts` ✓
   - OR `file.path` contains "payment"
   - OR `file.content` matches `login|authenticate|authorize`

2. **`has_security_tests(source_path, files)`** checks:
   - Generates test paths from `apps/api/src/auth/auth.service.ts`:
     - Pattern 1: `apps/api/src/auth/auth.service.spec.ts` ✓ (test provides this)
     - Pattern 2: `/apps/api/src/auth/__tests__/auth.service.test.ts`
     - Pattern 3: `apps/api/src/auth/auth.service.test.ts`
   - Checks if any file in `input.changed_files` matches one of these paths
   - Checks if that file's content matches: `authentication|authorization|input.*validation|security`

### Test Input

```rego
{
  "path": "apps/api/src/auth/auth.service.spec.ts",
  "content": "it('should test authentication', ...); it('should verify authorization', ...); it('should validate input validation', ...); it('should test security', ...)"
}
```

### Regex Pattern Analysis

Pattern: `` `authentication|authorization|input.*validation|security` ``

| Pattern | Test Content | Match? |
|---------|--------------|--------|
| `authentication` | "it('should test **authentication**', ...)" | ✅ YES |
| `authorization` | "it('should verify **authorization**', ...)" | ✅ YES |
| `input.*validation` | "it('should validate **input validation**', ...)" | ✅ YES (space matches `.*`) |
| `security` | "it('should test **security**', ...)" | ✅ YES |

**Expected:** Should match ✅

**Issue:** The test expects `count(...) == 0` (no warnings), but the policy might still be generating warnings. This could mean:
- The test file path doesn't match (unlikely, as path generation works)
- The regex doesn't match (unlikely, as all patterns should match)
- The test file needs a `status` field (policy doesn't check for it)
- There's another condition preventing `has_security_tests` from being true

---

## Test 11: Data Migration Tests (`test_data_migration_tests_exist`)

### Policy Flow

1. **`needs_data_migration_tests(file)`** checks:
   - ✅ `file.path` contains "migration" AND ends with ".sql" → `libs/common/prisma/migrations/20251123_add_user_status.sql` ✓
   - OR `file.path` contains "prisma/migrations" ✓

2. **`has_data_migration_tests(source_path, files)`** checks:
   - Generates test paths from `libs/common/prisma/migrations/20251123_add_user_status.sql`:
     - Pattern 1: `libs/common/prisma/migrations/20251123_add_user_status.test.sql` ✓ (test provides this)
     - Pattern 2: `libs/common/prisma/migrations/20251123_add_user_status.rollback.sql`
   - Checks if any file in `input.changed_files` matches one of these paths
   - Checks if that file's content matches: `migration.*idempotency|data.*integrity|rollback`

### Test Input

```rego
{
  "path": "libs/common/prisma/migrations/20251123_add_user_status.test.sql",
  "content": "-- Test migration idempotency, data integrity, and rollback capability"
}
```

### Regex Pattern Analysis

Pattern: `` `migration.*idempotency|data.*integrity|rollback` ``

| Pattern | Test Content | Match? |
|---------|--------------|--------|
| `migration.*idempotency` | "-- Test **migration idempotency**, ..." | ✅ YES (space matches `.*`) |
| `data.*integrity` | "... **data integrity**, ..." | ✅ YES (space matches `.*`) |
| `rollback` | "... and **rollback** capability" | ✅ YES |

**Expected:** Should match ✅

**Issue:** Same as security tests - the test expects no warnings but policy might still generate them.

---

## Potential Root Causes

1. **Path Matching Issue:** The `get_test_file_paths()` function might not be finding the test file correctly
2. **Regex Matching Issue:** The regex patterns might not be matching as expected
3. **Missing Condition:** There might be another condition in the policy that's preventing the match
4. **Test File Status:** The test file might need a `status` field (though policy doesn't explicitly check for it)

---

## Next Steps

1. Add debug traces to see what paths are being generated
2. Verify the regex patterns match the test content
3. Check if there are any other conditions preventing the match
4. Consider adding `status` field to test files if needed


