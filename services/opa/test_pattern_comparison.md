# Pattern Comparison: Policy Expectations vs Test Inputs

## Test 9: Security Tests (`test_security_tests_exist`)

### Policy Requirements

**Step 1: `needs_security_tests(file)` must be true**
- Checks if `file.path` contains "auth" ✓ (test provides: `apps/api/src/auth/auth.service.ts`)
- OR checks if `file.path` contains "payment"
- OR checks if `file.content` matches `login|authenticate|authorize`

**Step 2: `has_security_tests(source_path, files)` must be true**
- Generates test paths from source: `apps/api/src/auth/auth.service.ts`
  - Pattern 1: `apps/api/src/auth/auth.service.spec.ts` ✓ (test provides this)
  - Pattern 2: `/apps/api/src/auth/__tests__/auth.service.test.ts`
  - Pattern 3: `apps/api/src/auth/auth.service.test.ts`
- Checks if any file in `input.changed_files` matches one of these paths ✓
- Checks if that file's content matches regex: `authentication|authorization|input.*validation|security`

### Test Input

```rego
{
  "path": "apps/api/src/auth/auth.service.spec.ts",
  "content": "it('should test authentication', ...); it('should verify authorization', ...); it('should validate input validation', ...); it('should test security', ...)"
}
```

### Regex Pattern Analysis

Pattern: `authentication|authorization|input.*validation|security`

- `authentication` → matches "authentication" in content ✓
- `authorization` → matches "authorization" in content ✓
- `input.*validation` → requires "input" followed by any chars, then "validation"
  - Test has: "input validation" (space between)
  - Should match: `input.*validation` where `.*` matches the space ✓
- `security` → matches "security" in content ✓

**Expected Result:** Should match ✓

---

## Test 11: Data Migration Tests (`test_data_migration_tests_exist`)

### Policy Requirements

**Step 1: `needs_data_migration_tests(file)` must be true**
- Checks if `file.path` contains "migration" AND ends with ".sql" ✓
  - Test provides: `libs/common/prisma/migrations/20251123_add_user_status.sql` ✓
- OR checks if `file.path` contains "prisma/migrations" ✓

**Step 2: `has_data_migration_tests(source_path, files)` must be true**
- Generates test paths from source: `libs/common/prisma/migrations/20251123_add_user_status.sql`
  - Pattern 1: `libs/common/prisma/migrations/20251123_add_user_status.test.sql` ✓ (test provides this)
  - Pattern 2: `libs/common/prisma/migrations/20251123_add_user_status.rollback.sql`
- Checks if any file in `input.changed_files` matches one of these paths ✓
- Checks if that file's content matches regex: `migration.*idempotency|data.*integrity|rollback`

### Test Input

```rego
{
  "path": "libs/common/prisma/migrations/20251123_add_user_status.test.sql",
  "content": "-- Test migration idempotency, data integrity, and rollback capability"
}
```

### Regex Pattern Analysis

Pattern: `migration.*idempotency|data.*integrity|rollback`

- `migration.*idempotency` → requires "migration" followed by any chars, then "idempotency"
  - Test has: "migration idempotency" (space between)
  - Should match: `migration.*idempotency` where `.*` matches the space ✓
- `data.*integrity` → requires "data" followed by any chars, then "integrity"
  - Test has: "data integrity" (space between)
  - Should match: `data.*integrity` where `.*` matches the space ✓
- `rollback` → matches "rollback" in content ✓

**Expected Result:** Should match ✓

---

## Potential Issues

1. **Path Matching:** The `get_test_file_paths()` function uses `dirname()` and `base()` which may handle Windows paths differently
2. **Regex Escaping:** The backticks in the regex patterns might need different escaping
3. **Case Sensitivity:** Rego regex is case-sensitive by default
4. **File Status:** Test files might need a `status` field (though policy doesn't check for it)


