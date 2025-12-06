# Dashboard API v2 Migration Guide

**Last Updated:** 2025-12-05  
**Status:** API v2 Available, v1 Deprecated (Sunset: 2026-11-14)

---

## Overview

Dashboard API v2 introduces improved endpoints with better error handling, optimistic locking support, batch operations, and consistent response formats. API v1 is deprecated and will be sunset on **January 16, 2026**.

---

## Key Changes in v2

### 1. **Consistent Response Format**

All v2 endpoints return responses in a standardized format:

```json
{
  "data": { /* response data */ },
  "meta": {
    "version": "2.0",
    "timestamp": "2025-12-05T12:00:00.000Z",
    "count": 10  // when applicable
  }
}
```

**v1 Response:**
```json
{ /* direct data */ }
```

**v2 Response:**
```json
{
  "data": { /* data */ },
  "meta": { "version": "2.0", "timestamp": "..." }
}
```

### 2. **Optimistic Locking Required**

In v2, the `version` field is **required** for all region update operations to prevent conflicts.

**v1 (version optional):**
```json
PUT /api/v1/dashboard/layouts/:layoutId/regions/:id
{
  "grid_row": 2,
  "grid_col": 3
}
```

**v2 (version required):**
```json
PUT /api/v2/dashboard/layouts/:layoutId/regions/:id
{
  "grid_row": 2,
  "grid_col": 3,
  "version": 5  // REQUIRED
}
```

### 3. **Structured Error Responses**

v2 provides structured error responses with error codes:

**v1 Error:**
```json
{
  "statusCode": 400,
  "message": "Validation failed"
}
```

**v2 Error:**
```json
{
  "code": "VERSION_REQUIRED",
  "message": "Version field is required for optimistic locking in API v2",
  "timestamp": "2025-01-16T12:00:00.000Z"
}
```

### 4. **Batch Operations (v2 only)**

v2 introduces batch operations for efficient bulk updates:

```json
POST /api/v2/dashboard/layouts/:layoutId/regions/batch
{
  "create": [
    { "region_type": "scheduling", "grid_row": 0, "grid_col": 0 }
  ],
  "update": [
    { "id": "region-123", "data": { "grid_row": 1, "version": 3 } }
  ],
  "delete": ["region-456"]
}
```

### 5. **Deprecation Headers**

v1 endpoints include deprecation headers:
- `Deprecation: true`
- `Sunset: <date>` (when v1 will be removed)
- `Link: </api/v2/...>; rel="successor-version"`

---

## Endpoint Mapping

| v1 Endpoint | v2 Endpoint | Changes |
|------------|------------|---------|
| `GET /api/v1/dashboard/layouts/default` | `GET /api/v2/dashboard/layouts/default` | Response format |
| `POST /api/v1/dashboard/layouts` | `POST /api/v2/dashboard/layouts` | Response format |
| `GET /api/v1/dashboard/layouts/:id` | `GET /api/v2/dashboard/layouts/:id` | Response format |
| `PUT /api/v1/dashboard/layouts/:id` | `PUT /api/v2/dashboard/layouts/:id` | Response format |
| `DELETE /api/v1/dashboard/layouts/:id` | `DELETE /api/v2/dashboard/layouts/:id` | Response format |
| `POST /api/v1/dashboard/layouts/:layoutId/regions` | `POST /api/v2/dashboard/layouts/:layoutId/regions` | Response format |
| `GET /api/v1/dashboard/layouts/:layoutId/regions` | `GET /api/v2/dashboard/layouts/:layoutId/regions` | Response format + count |
| `PUT /api/v1/dashboard/layouts/:layoutId/regions/:id` | `PUT /api/v2/dashboard/layouts/:layoutId/regions/:id` | **Version required** |
| `DELETE /api/v1/dashboard/layouts/:layoutId/regions/:id` | `DELETE /api/v2/dashboard/layouts/:layoutId/regions/:id` | Response format |
| `POST /api/v1/dashboard/layouts/:layoutId/regions/reorder` | `POST /api/v2/dashboard/layouts/:layoutId/regions/reorder` | Response format |
| N/A | `POST /api/v2/dashboard/layouts/:layoutId/regions/batch` | **New in v2** |

---

## Migration Steps

### Step 1: Update Base URL

Change your API base URL from:
```
/api/v1/dashboard
```

To:
```
/api/v2/dashboard
```

### Step 2: Update Response Parsing

**Before (v1):**
```javascript
const response = await fetch('/api/v1/dashboard/layouts/default');
const layout = await response.json();
```

**After (v2):**
```javascript
const response = await fetch('/api/v2/dashboard/layouts/default');
const result = await response.json();
const layout = result.data; // Extract data from wrapper
```

### Step 3: Add Version to Update Requests

**Before (v1):**
```javascript
await fetch(`/api/v1/dashboard/layouts/${layoutId}/regions/${regionId}`, {
  method: 'PUT',
  body: JSON.stringify({ grid_row: 2, grid_col: 3 })
});
```

**After (v2):**
```javascript
// First, get current version
const region = await getRegion(regionId);

// Then update with version
await fetch(`/api/v2/dashboard/layouts/${layoutId}/regions/${regionId}`, {
  method: 'PUT',
  body: JSON.stringify({ 
    grid_row: 2, 
    grid_col: 3,
    version: region.version // REQUIRED
  })
});
```

### Step 4: Update Error Handling

**Before (v1):**
```javascript
try {
  await updateRegion(data);
} catch (error) {
  console.error(error.message);
}
```

**After (v2):**
```javascript
try {
  await updateRegion(data);
} catch (error) {
  const errorData = await error.response.json();
  if (errorData.code === 'VERSION_CONFLICT') {
    // Handle version conflict
    await refreshAndRetry();
  } else if (errorData.code === 'VERSION_REQUIRED') {
    // Handle missing version
    await fetchVersionAndRetry();
  }
  console.error(errorData.code, errorData.message);
}
```

### Step 5: Use Batch Operations (Optional)

For bulk operations, use the new batch endpoint:

```javascript
await fetch(`/api/v2/dashboard/layouts/${layoutId}/regions/batch`, {
  method: 'POST',
  body: JSON.stringify({
    create: newRegions,
    update: updates.map(u => ({ id: u.id, data: u })),
    delete: regionIdsToDelete
  })
});
```

---

## Feature Flag

API v2 is controlled by the `DASHBOARD_API_V2` feature flag. To enable:

**Backend:**
```bash
FEATURE_DASHBOARD_API_V2=true
```

**Frontend:**
```bash
VITE_DASHBOARD_API_V2=true
```

---

## Timeline

- **2025-12-05**: API v2 released, v1 deprecated
- **2026-05-14**: v1 deprecation warning increased (6 months remaining)
- **2026-11-14**: v1 sunset (removed from codebase)

---

## Backward Compatibility

- v1 endpoints remain functional until sunset date
- v1 and v2 can coexist during migration period
- No breaking changes to v1 during migration period

---

## Support

For migration assistance:
- Review this guide
- Check API documentation at `/api/docs`
- Contact development team

---

## Example: Complete Migration

```javascript
// Before (v1)
class DashboardClient {
  async getLayout(id) {
    const response = await fetch(`/api/v1/dashboard/layouts/${id}`);
    return await response.json();
  }

  async updateRegion(layoutId, regionId, updates) {
    const response = await fetch(
      `/api/v1/dashboard/layouts/${layoutId}/regions/${regionId}`,
      { method: 'PUT', body: JSON.stringify(updates) }
    );
    return await response.json();
  }
}

// After (v2)
class DashboardClient {
  async getLayout(id) {
    const response = await fetch(`/api/v2/dashboard/layouts/${id}`);
    const result = await response.json();
    return result.data;
  }

  async updateRegion(layoutId, regionId, updates) {
    // Ensure version is included
    if (!updates.version) {
      const current = await this.getRegion(layoutId, regionId);
      updates.version = current.version;
    }

    const response = await fetch(
      `/api/v2/dashboard/layouts/${layoutId}/regions/${regionId}`,
      { method: 'PUT', body: JSON.stringify(updates) }
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`${error.code}: ${error.message}`);
    }

    const result = await response.json();
    return result.data;
  }

  async getRegion(layoutId, regionId) {
    const regions = await this.getLayoutRegions(layoutId);
    return regions.find(r => r.id === regionId);
  }

  async getLayoutRegions(layoutId) {
    const response = await fetch(
      `/api/v2/dashboard/layouts/${layoutId}/regions`
    );
    const result = await response.json();
    return result.data;
  }
}
```

---

**End of Migration Guide**


