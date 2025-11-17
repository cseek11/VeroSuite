# API Version Testing Guide

## Overview

This guide explains how to test both v1 and v2 API endpoints to ensure correct version routing and prevent version-related bugs.

## Version Strategy

### V1 Endpoints (Legacy/Deprecated)
- **Status**: Deprecated but still functional
- **Response Format**: Direct response (no wrapping)
- **Use Case**: Legacy features, backward compatibility
- **Examples**: `/api/v1/accounts`, `/api/v1/auth/login`

### V2 Endpoints (Preferred)
- **Status**: Active, preferred for new features
- **Response Format**: Wrapped response with `data` and `meta`
- **Use Case**: New features, enhanced functionality
- **Examples**: `/api/v2/crm/accounts`, `/api/v2/auth/login`, `/api/v2/kpi-templates`

## Test Coverage

### 1. Version-Aware URL Tests

**File**: `frontend/src/lib/__tests__/api-version-routing.test.ts`

**Purpose**: Test version detection and routing logic

**Key Tests**:
- ✅ Identify v1 vs v2 endpoints
- ✅ Reject unversioned endpoints
- ✅ Ensure version consistency within features
- ✅ Handle version migration scenarios

### 2. V2 Endpoints Integration Tests

**File**: `frontend/test/integration/v2-endpoints.test.ts`

**Purpose**: Test v2-specific endpoints

**Key Tests**:
- ✅ KPI templates v2 endpoints
- ✅ Technicians v2 endpoints
- ✅ Dashboard v2 endpoints (undo/redo/history)
- ✅ Version-specific features

### 3. Backend Route Version Validation

**File**: `backend/test/route-version-validation.e2e-spec.ts`

**Purpose**: Validate backend accepts/rejects correct versions

**Key Tests**:
- ✅ V1 endpoints work correctly
- ✅ V2 endpoints work correctly
- ✅ Version mismatches return 404
- ✅ Dual version endpoints (auth) work in both
- ✅ V2-only features reject v1 calls

## Test Patterns

### Pattern 1: Version Detection
```typescript
it('should identify v2 endpoints', () => {
  const endpoint = '/api/v2/kpi-templates';
  expect(endpoint).toMatch(/\/api\/v2\//);
  expect(endpoint).not.toMatch(/\/api\/v1\//);
});
```

### Pattern 2: Version-Specific Routing
```typescript
it('should route to correct version based on feature', () => {
  // Accounts controller is v1
  expect('/api/v1/accounts').toMatch(/\/api\/v1\/accounts$/);
  
  // CRM v2 controller
  expect('/api/v2/crm/accounts').toMatch(/\/api\/v2\/crm\/accounts$/);
});
```

### Pattern 3: Version Consistency
```typescript
it('should ensure all endpoints in feature use same version', () => {
  const endpoints = [
    '/api/v2/kpi-templates',
    '/api/v2/kpi-templates/favorites',
    '/api/v2/kpi-templates/popular',
  ];
  
  endpoints.forEach(endpoint => {
    expect(endpoint).toMatch(/\/api\/v2\/kpi-templates/);
  });
});
```

### Pattern 4: Backend Validation
```typescript
it('should accept v2 endpoint', async () => {
  await request(app.getHttpServer())
    .get('/api/v2/crm/accounts')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);
});

it('should reject v1 for v2-only feature', async () => {
  await request(app.getHttpServer())
    .post('/api/v1/dashboard/layouts/id/undo')
    .set('Authorization', `Bearer ${token}`)
    .expect(404);
});
```

## Version Mapping

### Endpoints Available in Both Versions
- **Auth**: `/api/v1/auth/login` and `/api/v2/auth/login`
  - V1: Direct response
  - V2: Wrapped response with metadata

### V1-Only Endpoints
- `/api/v1/accounts` - Direct accounts controller
- `/api/v1/routing/routes` - Routing features

### V2-Only Endpoints
- `/api/v2/crm/accounts` - CRM v2 controller
- `/api/v2/kpi-templates/*` - KPI templates (all endpoints)
- `/api/v2/dashboard/layouts/undo` - Undo functionality
- `/api/v2/dashboard/layouts/redo` - Redo functionality
- `/api/v2/dashboard/layouts/history` - History tracking
- `/api/v2/technicians` - Technicians v2

## Common Bugs Prevented

### Bug 1: Wrong Version for Feature
**Example**: Calling `/api/v1/dashboard/layouts/undo` (undo only exists in v2)
**Test**: `route-version-validation.e2e-spec.ts` - "should reject v2-only features when called with v1"

### Bug 2: Version Mismatch
**Example**: Frontend calls `/api/v1/crm/accounts` but backend only has v2
**Test**: `route-version-validation.e2e-spec.ts` - "should reject /api/v1/crm/accounts"

### Bug 3: Missing Version
**Example**: Calling `/api/kpi-templates` without version
**Test**: `api-version-routing.test.ts` - "should reject endpoints without version"

### Bug 4: Mixed Versions
**Example**: `/api/v1/v2/endpoint` or `/api/v2/v1/endpoint`
**Test**: `route-version-validation.e2e-spec.ts` - "should reject mixed versions"

## Running Tests

```bash
# Frontend version routing tests
cd frontend
npm test -- src/lib/__tests__/api-version-routing.test.ts

# V2 endpoints integration tests
npm test -- test/integration/v2-endpoints.test.ts

# Backend version validation
cd backend
npm run test:e2e -- route-version-validation.e2e-spec.ts
```

## Best Practices

1. **Always specify version** - Never call unversioned endpoints
2. **Use v2 for new features** - Prefer v2 endpoints for new development
3. **Check controller version** - Verify which version a controller uses
4. **Test both versions** - If endpoint exists in both, test both
5. **Version consistency** - Keep all endpoints in a feature on same version

## Migration Guide

When migrating from v1 to v2:
1. Update frontend to call v2 endpoint
2. Update tests to expect v2 response format
3. Test that v1 still works (backward compatibility)
4. Eventually deprecate v1 endpoint

## Response Format Differences

### V1 Response
```json
{
  "access_token": "token",
  "user": { ... }
}
```

### V2 Response
```json
{
  "data": {
    "access_token": "token",
    "user": { ... }
  },
  "meta": {
    "version": "2.0",
    "timestamp": "..."
  }
}
```

## Summary

These tests ensure:
- ✅ Correct version is used for each endpoint
- ✅ V2-only features reject v1 calls
- ✅ Version consistency within features
- ✅ No version mixing or missing versions
- ✅ Both versions work when available

