# E2E Test Results Summary - VeroField Backend

## Test Execution Summary
- **Test Suites**: 2 failed, 2 passed, 4 total
- **Tests**: 30 failed, 12 passed, 42 total
- **Time**: 33.809s

## Passing Test Suites ✅
1. **auth.e2e-spec.ts** - All authentication tests passing
2. **tenant-isolation.e2e-spec.ts** - All tenant isolation tests passing

## Failing Test Suites ❌

### 1. dashboard-regions.e2e-spec.ts (15 failures)
**Root Cause**: Unique constraint violation when creating test layouts
- **Error**: `Unique constraint failed on the fields: (tenant_id, user_id, name)`
- **Location**: `test/dashboard-regions.e2e-spec.ts:476` in `createTestLayout()` helper function
- **Issue**: The helper function creates layouts with a fixed name "Test Layout", causing conflicts when multiple tests run
- **Affected Tests**: All tests that call `createTestLayout()` fail because the layout already exists

**Fix Needed**:
- Make layout names unique per test (use UUID or timestamp)
- Or check if layout exists before creating, or delete existing layout first
- Consider using `findFirst` with `create` pattern or upsert

### 2. work-orders.e2e-spec.ts (15 failures)

#### Issue A: Work Order Not Found (404 errors)
- **Tests Affected**:
  - `should get work order by ID` - Expected 200, got 404
  - `should update work order` - Expected 200, got 400 (likely 404 first)
  - `should delete work order` - Expected 200, got 404
- **Root Cause**: Work orders created in one test are not accessible in subsequent tests
- **Location**: Tests assume `workOrderId` from `beforeEach` persists, but work orders may be cleaned up or not properly created

#### Issue B: Invalid UUID Validation (400 errors)
- **Tests Affected**:
  - `should return 404 for non-existent work order` - Expected 404, got 400
  - `should fail to update non-existent work order` - Expected 404, got 400
  - `should return 404 for non-existent customer` - Expected 404, got 400
  - `should return 404 for non-existent technician` - Expected 404, got 400
  - `should return 404 for non-existent work order` (DELETE) - Expected 404, got 400
- **Root Cause**: Using string "non-existent-id" instead of valid UUID format. NestJS `ParseUUIDPipe` validates UUID format before checking existence, returning 400 for invalid format instead of 404 for not found.
- **Fix**: Use valid UUID format like `'00000000-0000-0000-0000-000000000000'` for non-existent entity tests

#### Issue C: Empty Results
- **Tests Affected**:
  - `should list work orders with filters` - Expected array length > 0, got 0
  - `should list work orders with pagination` - Expected total > 0, got 0
  - `should get work orders by customer` - Expected array length > 0, got 0
- **Root Cause**: Work orders created in `beforeEach` are not persisting or are being cleaned up before these tests run
- **Fix**: Ensure work orders are created and persist across tests, or create them in each test that needs them

#### Issue D: V2 API Response Format
- **Tests Affected**:
  - `should return work orders in V2 format` - `expect(Array.isArray(data)).toBe(true)` failed (data is not an array)
  - `should create work order with V2 format` - Expected status 200, got 201
- **Root Cause**: 
  - V2 list endpoint may return object instead of array, or data structure is different
  - V2 create endpoint returns 201 (Created) not 200 (OK), which is correct but test expects 200
- **Fix**: 
  - Check actual response structure from V2 list endpoint
  - Update `expectV2Response` call to expect 201 for create operations

## Files That Need Updates

### 1. `backend/test/dashboard-regions.e2e-spec.ts`
- **Line 476**: `createTestLayout()` function needs unique layout names
- **Fix**: Add UUID or timestamp to layout name, or use upsert pattern

### 2. `backend/test/work-orders.e2e-spec.ts`
- **Multiple locations**: Replace `'non-existent-id'` with valid UUID format
- **Line 145, 200, 275**: Ensure work orders persist between tests
- **Line 172, 184, 240**: Create work orders before testing list/filter operations
- **Line 369**: Fix V2 list response structure validation
- **Line 402**: Change expected status from 200 to 201 for create operation

### 3. `backend/test/utils/validate-v2.ts` (if needed)
- May need to handle different response structures for different endpoints

## Recent Fixes Applied (Before This Run)

1. ✅ Fixed work order scheduled dates (changed from past dates to future dates)
2. ✅ Added `layout_id` to all dashboard region creation DTOs
3. ✅ Fixed Supabase client mock to support method chaining
4. ✅ Updated V2 API response validation for work orders

## Next Steps

1. **Priority 1**: Fix dashboard regions layout creation uniqueness issue
2. **Priority 2**: Fix work orders test data persistence and cleanup
3. **Priority 3**: Replace invalid UUID strings with valid UUID format
4. **Priority 4**: Fix V2 API response format expectations

## Test Environment
- Database: PostgreSQL via Supabase (hosted)
- Test Database: `verofield_ci` (from DATABASE_URL in test/.env.test)
- Prisma: Using singleton client pattern
- Supabase: Mocked for auth, but real client used for dashboard operations (needs better mocking)

## Key Files Reference
- Test setup: `backend/test/setup.ts`
- Global setup: `backend/test/global-setup.ts`
- Global teardown: `backend/test/global-teardown.ts`
- Test utilities: `backend/test/utils/*.ts`
- Jest config: `backend/test/jest-e2e.json`

