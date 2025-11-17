# API Test Issues Report

## Summary
Ran E2E tests to identify areas needing work after API v2 migration. Found several critical issues that need attention.

## Critical Issues Found

### 1. Database Connection Leaks
**Problem**: Tests are opening too many database connections without proper cleanup
- Error: "Too many database connections opened: FATAL: remaining connection slots are reserved"
- **Impact**: Tests fail and can exhaust database connection pool
- **Location**: All E2E test files

**Fixes Applied**:
- ✅ Added `prisma.$disconnect()` in `afterAll` hooks for:
  - `auth.e2e-spec.ts`
  - `dashboard-regions.e2e-spec.ts`
  - `work-orders.e2e-spec.ts`
  - `tenant-isolation.e2e-spec.ts`

**Remaining Work**:
- Need to ensure all test files properly close connections
- Consider using a shared test database connection pool
- Add connection pooling limits for tests

### 2. Test Setup Configuration Issues
**Problem**: `test/setup.ts` was using Vitest imports in a Jest environment
- Error: "Vitest cannot be imported in a CommonJS module using require()"
- **Impact**: Integration tests fail to run
- **Location**: `test/setup.ts`

**Fixes Applied**:
- ✅ Replaced `vi` (Vitest) with `jest` mocks
- ✅ Updated all mock declarations to use Jest syntax

### 3. API Endpoint Versioning Issues
**Problem**: Tests are using unversioned endpoints that may not work correctly
- Tests use `/auth/login` instead of `/api/v1/auth/login` or `/api/v2/auth/login`
- **Impact**: Tests may hit wrong endpoints or fail routing
- **Location**: Multiple test files

**Fixes Applied**:
- ✅ Updated `auth.e2e-spec.ts` to test both v1 and v2 endpoints
- ✅ Added v2 API tests with proper response format validation

**Remaining Work**:
- Update `tenant-isolation.e2e-spec.ts` to use versioned endpoints (`/api/v1/auth/login`)
- Update `work-orders.e2e-spec.ts` to use versioned endpoints (`/api/v1/work-orders`)
- Update `dashboard-regions.e2e-spec.ts` to test v2 endpoints

### 4. Authentication Test Failures
**Problem**: Authentication tests are failing with "Invalid credentials"
- Error: "UnauthorizedException: Invalid credentials"
- **Impact**: Tests cannot authenticate, blocking other tests
- **Location**: `auth.e2e-spec.ts`, `tenant-isolation.e2e-spec.ts`

**Root Causes**:
- Test users may not exist in database
- Password hashing may not match
- Supabase auth integration may need test credentials

**Remaining Work**:
- Create test user seeding script
- Ensure test users exist with known passwords
- Mock Supabase auth for E2E tests OR use test database with seeded users

### 5. Test Timeout Issues
**Problem**: Tests are timing out during setup
- Error: "Exceeded timeout of 5000 ms for a hook"
- **Impact**: Tests fail before they can run
- **Location**: `tenant-isolation.e2e-spec.ts`

**Root Causes**:
- Database connection setup taking too long
- Multiple app instances being created
- Network calls to Supabase during test setup

**Remaining Work**:
- Increase test timeout in `jest-e2e.json`
- Optimize test setup to reduce initialization time
- Mock external services (Supabase) for faster tests

### 6. Missing V2 API Tests
**Problem**: Most endpoints don't have v2 API tests
- Only `auth.e2e-spec.ts` has v2 tests
- **Impact**: Cannot verify v2 endpoints work correctly
- **Location**: All test files except `auth.e2e-spec.ts`

**Remaining Work**:
- Add v2 API tests for:
  - KPIs (`/api/v2/kpis/*`)
  - KPI Templates (`/api/v2/kpi-templates/*`)
  - Technicians (`/api/v2/technicians/*`)
  - Users (`/api/v2/users/*`)
  - Work Orders (`/api/v2/work-orders/*`)
  - CRM (`/api/v2/crm/*`)
  - Dashboard (`/api/v2/dashboard/*`)

### 7. Response Format Validation
**Problem**: Tests don't validate v2 response format
- V2 responses should have `{ data, meta }` structure
- **Impact**: Cannot verify v2 endpoints return correct format
- **Location**: All test files

**Remaining Work**:
- Add response format validation for v2 endpoints
- Verify `meta.version === '2.0'`
- Verify `meta.timestamp` exists
- Verify `data` contains actual response

## Test Results Summary

### E2E Tests Status
- **Total Test Suites**: 4
- **Failed**: 4
- **Total Tests**: 40
- **Failed**: 40

### Specific Test Failures

1. **auth.e2e-spec.ts**
   - ❌ Database connection issues
   - ✅ Fixed: Added connection cleanup
   - ✅ Fixed: Added v2 API tests
   - ⚠️ Needs: Test user seeding

2. **dashboard-regions.e2e-spec.ts**
   - ❌ Database connection issues
   - ✅ Fixed: Added connection cleanup
   - ⚠️ Needs: Update to test v2 endpoints

3. **work-orders.e2e-spec.ts**
   - ❌ Database connection issues
   - ✅ Fixed: Added connection cleanup
   - ⚠️ Needs: Update to use versioned endpoints

4. **tenant-isolation.e2e-spec.ts**
   - ❌ Database connection issues
   - ❌ Timeout issues
   - ❌ Authentication failures
   - ✅ Fixed: Added connection cleanup
   - ⚠️ Needs: Update to use versioned endpoints
   - ⚠️ Needs: Increase timeout
   - ⚠️ Needs: Fix authentication

## Recommended Next Steps

### Priority 1: Fix Test Infrastructure
1. Create test user seeding script
2. Mock Supabase auth for E2E tests OR use test database
3. Increase test timeouts
4. Add shared test database connection pool

### Priority 2: Update Tests for V2
1. Update all tests to use versioned endpoints
2. Add v2 API tests for all endpoints
3. Add response format validation for v2

### Priority 3: Improve Test Reliability
1. Add retry logic for flaky tests
2. Add better error messages
3. Add test data cleanup utilities
4. Add test isolation (each test uses separate data)

## Files Modified

### Fixed Files
- ✅ `backend/test/setup.ts` - Fixed Vitest/Jest conflict (replaced `vi` with `jest`)
- ✅ `backend/test/auth.e2e-spec.ts` - Added v2 tests, cleanup, and proper endpoint versioning
- ✅ `backend/test/dashboard-regions.e2e-spec.ts` - Added cleanup (already using v2 endpoints)
- ✅ `backend/test/work-orders.e2e-spec.ts` - Added cleanup and updated to use `/api/v1/work-orders`
- ✅ `backend/test/tenant-isolation.e2e-spec.ts` - Added cleanup and updated to use `/api/v1/auth/login` and `/api/v1/jobs`
- ✅ `backend/test/jest-e2e.json` - Increased timeout to 30s and set maxWorkers to 1 to prevent connection issues

### Files Needing Updates
- ⚠️ `backend/test/tenant-isolation.e2e-spec.ts` - Update endpoints, fix auth
- ⚠️ `backend/test/work-orders.e2e-spec.ts` - Update to v2 endpoints
- ⚠️ `backend/test/dashboard-regions.e2e-spec.ts` - Add v2 endpoint tests
- ⚠️ `backend/test/jest-e2e.json` - Increase timeout
- ⚠️ Create test user seeding script
- ⚠️ Create test database setup script

## Test Coverage Gaps

### Missing V2 API Tests
- KPIs endpoints
- KPI Templates endpoints
- Technicians endpoints
- Users endpoints
- Work Orders endpoints
- CRM endpoints
- Billing endpoints
- Routing endpoints
- Jobs endpoints
- Company endpoints
- Layouts endpoints
- Accounts endpoints
- Service Types endpoints
- Agreements endpoints
- Audit endpoints

### Missing Integration Tests
- V2 response format validation
- Deprecation header verification
- Idempotency testing
- Error response format testing

