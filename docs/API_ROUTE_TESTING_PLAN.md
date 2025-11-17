# API Route Testing Plan

## Overview

This document outlines a comprehensive testing strategy to catch URL/route mismatches between frontend and backend, similar to the `/api/v1/v1/auth/login` and `/api/accounts` bugs.

## Problem Statement

**Common Issues:**
1. **Missing Version Prefix**: Frontend calls `/api/accounts` but backend expects `/api/v1/accounts`
2. **Duplicate Version**: Frontend calls `/api/v1/v1/auth/login` instead of `/api/v1/auth/login`
3. **Version Mismatch**: Frontend calls `/api/v1/endpoint` but backend expects `/api/v2/endpoint`
4. **Path Mismatch**: Frontend calls `/api/accounts` but backend route is `/api/crm/accounts`

## Test Strategy

### 1. Frontend API Client URL Tests (Unit Tests)

**Purpose**: Verify each API client constructs URLs correctly

**Pattern**: Similar to `auth-service.test.ts`

**Files to Test:**
- `secure-api-client.ts` - Main secure API client
- `accounts-api.ts` - Accounts-specific API
- `work-orders-api.ts` - Work orders API
- `technician-api.ts` - Technicians API
- `enhanced-api.ts` - Enhanced API with multiple endpoints

**Test Cases:**
- ✅ URL includes correct version prefix (`/v1/` or `/v2/`)
- ✅ No duplicate version segments (`/v1/v1/`)
- ✅ Base URL construction is correct
- ✅ Endpoint paths match expected patterns
- ✅ Query parameters are appended correctly
- ✅ **Version-specific routing** - Correct version for each endpoint
- ✅ **V2 endpoint support** - Tests work for both v1 and v2

### 2. Backend Route Registry Tests (Integration Tests)

**Purpose**: Extract all backend routes and verify they're accessible

**Approach**: 
- Scan all controllers for `@Controller` decorators
- Extract route paths and versions
- Verify routes are registered correctly
- Test that routes respond (not 404)

**Test Cases:**
- ✅ All controllers have version specified
- ✅ Routes are accessible at expected paths
- ✅ Routes reject incorrect versions
- ✅ Routes reject missing versions

### 3. Frontend/Backend Compatibility Tests (Integration Tests)

**Purpose**: Verify frontend API calls match backend routes

**Approach**:
- Extract all frontend API endpoint calls
- Extract all backend route definitions
- Match them up and verify compatibility
- Generate a compatibility matrix

**Test Cases:**
- ✅ Frontend endpoint exists in backend
- ✅ Version numbers match
- ✅ Path segments match
- ✅ HTTP methods match

### 4. Backend E2E Route Validation Tests

**Purpose**: Verify backend correctly rejects malformed URLs

**Pattern**: Similar to `auth.e2e-spec.ts` route validation tests

**Test Cases:**
- ✅ Reject `/api/endpoint` (missing version)
- ✅ Reject `/api/v1/v1/endpoint` (duplicate version)
- ✅ Reject `/api/v1/v2/endpoint` (version mismatch)
- ✅ Accept `/api/v1/endpoint` (correct)

### 5. Route Discovery Utility

**Purpose**: Automatically discover all routes for testing

**Implementation**:
- Parse TypeScript files for `@Controller` decorators
- Extract route paths and versions
- Generate route registry
- Use registry for compatibility testing

## Test Files Structure

```
frontend/
  src/lib/__tests__/
    auth-service.test.ts ✅ (already exists)
    secure-api-client-urls.test.ts (NEW)
    accounts-api-urls.test.ts (NEW)
    work-orders-api-urls.test.ts (NEW)
    technician-api-urls.test.ts (NEW)
  
  test/integration/
    auth-service-urls.test.ts ✅ (already exists)
    api-route-compatibility.test.ts (NEW)
    frontend-backend-routes.test.ts (NEW)

backend/
  test/
    route-registry.test.ts (NEW)
    accounts-routes.e2e-spec.ts (NEW)
    route-validation.e2e-spec.ts (NEW)
  
  scripts/
    extract-routes.ts (NEW) - Utility to extract all routes
```

## Test Coverage Goals

### Phase 1: Critical API Clients (Priority 1)
- ✅ `auth-service.ts` - DONE
- ⏳ `secure-api-client.ts` - Accounts, Work Orders, Technicians
- ⏳ `accounts-api.ts` - Direct accounts API

### Phase 2: Additional API Clients (Priority 2)
- ⏳ `work-orders-api.ts`
- ⏳ `technician-api.ts`
- ⏳ `enhanced-api.ts` (sample endpoints)

### Phase 3: Backend Route Validation (Priority 1)
- ⏳ Route registry extraction
- ⏳ E2E route validation tests
- ⏳ Compatibility matrix generation

### Phase 4: Comprehensive Coverage (Priority 3)
- ⏳ All remaining API clients
- ⏳ Automated route discovery
- ⏳ CI/CD integration

## Similar Test Patterns

### Pattern 1: URL Construction Tests (from auth-service.test.ts)
```typescript
it('should construct URL correctly', async () => {
  const url = await getConstructedUrl();
  expect(url).toBe('http://localhost:3001/api/v1/endpoint');
  expect(url).not.toContain('/v1/v1');
});
```

### Pattern 2: Route Pattern Matching (from auth-service-urls.test.ts)
```typescript
it('should match expected URL patterns', async () => {
  const pattern = /^https?:\/\/.+\/api\/v1\/endpoint$/;
  expect(url).toMatch(pattern);
});
```

### Pattern 3: Backend Route Validation (from auth.e2e-spec.ts)
```typescript
it('should reject malformed URLs', async () => {
  await request(app.getHttpServer())
    .get('/api/endpoint')  // Missing version
    .expect(404);
});
```

## Implementation Priority

1. **Immediate** (Fix current bug):
   - `secure-api-client-urls.test.ts` - Test accounts endpoints
   - `accounts-routes.e2e-spec.ts` - Backend route validation

2. **Short-term** (Prevent similar bugs):
   - `accounts-api-urls.test.ts`
   - `route-validation.e2e-spec.ts` - Generic route validation

3. **Long-term** (Comprehensive coverage):
   - Route registry utility
   - Compatibility matrix tests
   - All remaining API clients

## Benefits

1. **Catches URL bugs early** - Before they reach production
2. **Prevents regressions** - When routes change
3. **Documents expected routes** - Tests serve as documentation
4. **Enables refactoring** - Safe to change routes with test coverage
5. **CI/CD integration** - Automated route validation in pipeline

## Success Criteria

- ✅ All critical API clients have URL tests
- ✅ Backend routes are validated via E2E tests
- ✅ Frontend/backend route compatibility is verified
- ✅ No route mismatches in production
- ✅ Tests run in CI/CD pipeline

