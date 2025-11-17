# Undo/Redo Implementation Guide

**Status:** Backend Complete, Frontend Integration Pending  
**Priority:** P1 - Critical for Production  
**Date:** 2025-11-14

## Overview

Implemented event-sourced undo/redo functionality for dashboard regions that persists changes to the backend and syncs across all connected users.

## ✅ Completed (Backend)

### 1. API Endpoints (dashboard-v2.controller.ts)

Three new endpoints added:

- **POST** `/api/v2/dashboard/layouts/:layoutId/undo` - Undo last change
- **POST** `/api/v2/dashboard/layouts/:layoutId/redo` - Redo last undone change
- **GET** `/api/v2/dashboard/layouts/:layoutId/history` - Get undo/redo status

### 2. Service Methods (dashboard.service.ts)

**`undoLayout(layoutId, user)`**
- Fetches event history for layout
- Finds last undoable mutation event (create/update/delete/move/resize)
- Creates snapshot of current state before undo
- Reverses the operation:
  - Create → Delete
  - Delete → Restore from payload
  - Update/Move/Resize → Restore previous state
- Invalidates cache
- Returns updated regions list

**`redoLayout(layoutId, user)`**
- Finds last undo snapshot
- Retrieves original event that was undone
- Reapplies the original operation
- Invalidates cache
- Returns updated regions list

**`getLayoutHistory(layoutId, user)`**
- Returns `canUndo`, `canRedo` flags
- Returns recent event descriptions

### 3. Event Store Integration

- Uses existing `EventStoreService.getEventsForEntity()` to fetch history
- Creates `VERSION_CREATED` events with `action: 'undo_snapshot'` for tracking
- Stores full region state in event payload for restoration

### 4. Key Features

✅ **Persistent** - Undos/redos are stored in database, survive page refresh  
✅ **Multi-user sync** - Changes broadcast via cache invalidation (WebSocket recommended)  
✅ **Event-sourced** - Uses existing event store for audit trail  
✅ **Tenant-isolated** - All operations respect tenant boundaries  
✅ **Type-safe** - Properly handles all region mutation event types

## ⏳ Pending (Frontend Integration)

### Required Changes

**File:** `frontend/src/stores/regionStore.ts`

Current implementation (lines 906-970):
- `undoLayout()` only manipulates local state
- `redoLayout()` only manipulates local state  
- No API calls to backend

**Update Required:**

```typescript
undoLayout: async (layoutId: string) => {
  try {
    // Call backend API instead of just local state manipulation
    const response = await enhancedApi.dashboardLayouts.undoLayout(layoutId);
    
    if (!response || !response.data) {
      return false;
    }
    
    const { regions, undoneEventType } = response.data;
    
    // Update local state with server response
    set((state) => {
      const newRegions = new Map(state.regions);
      const newLayouts = new Map(state.layouts);
      
      const layout = newLayouts.get(layoutId);
      if (!layout) return state;
      
      // Clear existing regions for this layout
      layout.regions.forEach(regionId => {
        newRegions.delete(regionId);
      });
      
      // Add regions from server response
      regions.forEach(region => {
        newRegions.set(region.id, region);
      });
      
      newLayouts.set(layoutId, {
        ...layout,
        regions: regions.map(r => r.id)
      });
      
      return {
        ...state,
        regions: newRegions,
        layouts: newLayouts
      };
    });
    
    logger.info('Layout undone (server-synced)', { layoutId, undoneEventType }, 'regionStore');
    return true;
  } catch (error) {
    logger.error('Failed to undo layout', { error, layoutId }, 'regionStore');
    return false;
  }
},

redoLayout: async (layoutId: string) => {
  try {
    // Call backend API
    const response = await enhancedApi.dashboardLayouts.redoLayout(layoutId);
    
    if (!response || !response.data) {
      return false;
    }
    
    const { regions, redoneEventType } = response.data;
    
    // Update local state with server response (same as undo)
    set((state) => {
      // ... same logic as undo ...
    });
    
    logger.info('Layout redone (server-synced)', { layoutId, redoneEventType }, 'regionStore');
    return true;
  } catch (error) {
    logger.error('Failed to redo layout', { error, layoutId }, 'regionStore');
    return false;
  }
}
```

### API Client Updates

**File:** `frontend/src/lib/enhanced-api.ts`

Add methods to `dashboardLayouts` object:

```typescript
dashboardLayouts: {
  // ... existing methods ...
  
  undoLayout: async (layoutId: string) => {
    const response = await fetch(`/api/v2/dashboard/layouts/${layoutId}/undo`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Undo failed: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  redoLayout: async (layoutId: string) => {
    const response = await fetch(`/api/v2/dashboard/layouts/${layoutId}/redo`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Redo failed: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  getLayoutHistory: async (layoutId: string) => {
    const response = await fetch(`/api/v2/dashboard/layouts/${layoutId}/history`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return response.json();
  }
}
```

### WebSocket Integration (Recommended)

Add WebSocket listeners to broadcast undo/redo events to other users:

**File:** `backend/src/dashboard/dashboard.service.ts`

After successful undo/redo, emit WebSocket event:

```typescript
// In undoLayout() after cache invalidation
await this.websocketGateway.broadcastToLayout(layoutId, {
  type: 'LAYOUT_UNDONE',
  layoutId,
  regions: finalRegions,
  userId: user.userId
});
```

**File:** `frontend/src/stores/regionStore.ts`

Add WebSocket listener:

```typescript
useEffect(() => {
  socket.on('LAYOUT_UNDONE', (data) => {
    if (data.userId !== currentUserId) {
      // Another user undid changes - refresh local state
      refreshLayout(data.layoutId);
    }
  });
  
  socket.on('LAYOUT_REDONE', (data) => {
    if (data.userId !== currentUserId) {
      // Another user redid changes - refresh local state
      refreshLayout(data.layoutId);
    }
  });
}, []);
```

## Testing Plan

### Unit Tests (Already Exist - Update Needed)

```bash
npm test -- --testPathPattern="dashboard.service.spec"
```

Add tests for:
- `undoLayout()` - verify region deletion, restoration, update reversal
- `redoLayout()` - verify operation reapplication
- `getLayoutHistory()` - verify canUndo/canRedo flags

### Integration Tests

```typescript
describe('Undo/Redo Integration', () => {
  it('should undo region creation', async () => {
    const region = await service.createRegion(createDto, user);
    const result = await service.undoLayout(layoutId, user);
    
    expect(result.undoneEventType).toBe('region_created');
    expect(result.regions).not.toContain(region);
  });
  
  it('should redo undone region creation', async () => {
    const region = await service.createRegion(createDto, user);
    await service.undoLayout(layoutId, user);
    const result = await service.redoLayout(layoutId, user);
    
    expect(result.regions.length).toBe(1);
    expect(result.regions[0].region_type).toBe(region.region_type);
  });
  
  it('should restore previous state on undo update', async () => {
    const region = await service.createRegion(createDto, user);
    const updated = await service.updateRegion(region.id, { grid_row: 5 }, user);
    const result = await service.undoLayout(layoutId, user);
    
    expect(result.regions[0].grid_row).toBe(0); // Original position
  });
});
```

### E2E Tests

```typescript
describe('Multi-user Undo/Redo', () => {
  it('should sync undo to other users', async () => {
    // User A creates region
    // User B sees region appear
    // User A undoes
    // User B sees region disappear
  });
});
```

## Deployment Notes

### Required Events in Payload

For undo/redo to work, ALL region mutation operations must store `previousState` in event payload:

```typescript
// In createRegion, updateRegion, deleteRegion methods
await this.eventStore.appendEvent({
  event_type: EventType.REGION_UPDATED,
  entity_type: 'region',
  entity_id: regionId,
  tenant_id: user.tenantId,
  user_id: user.userId,
  payload: {
    previousState: existingRegion, // ← CRITICAL
    newState: updatedRegion,
    changes: diff(existingRegion, updatedRegion)
  }
});
```

### Database Requirements

Ensure `dashboard_events` table has sufficient storage:
- Typical event size: 2-5 KB
- Expected events per month per tenant: ~10,000
- Storage per tenant per month: ~50 MB
- **Recommend:** Archive events older than 90 days

### Performance Considerations

- Event queries fetch last 50 events (can be tuned)
- Consider caching undo/redo availability flags
- WebSocket events should be throttled (max 1/second per layout)

## Migration from Old Implementation

1. **Keep local history for offline fallback:**
   - If API call fails, fall back to local undo/redo
   - Display warning: "Offline mode - changes not synced"

2. **Migrate existing local history:**
   - On next successful save, push local history snapshots to backend as VERSION_CREATED events

## Success Criteria

- [ ] Backend endpoints deployed and tested
- [ ] Frontend calls backend instead of local-only
- [ ] Page refresh preserves undo/redo state
- [ ] Multiple users see each other's undo/redo actions
- [ ] Unit tests passing (3+ new tests)
- [ ] Integration tests passing (3+ new tests)
- [ ] E2E test for multi-user undo passing

## Estimated Time to Complete Frontend

- API client updates: 30 minutes
- Store refactoring: 2 hours
- WebSocket integration: 1 hour
- Testing: 1 hour
- **Total: 4-5 hours**

## References

- Event Store Service: `backend/src/dashboard/services/event-store.service.ts`
- Dashboard Service: `backend/src/dashboard/dashboard.service.ts`  
- Region Store: `frontend/src/stores/regionStore.ts`
- API Controller: `backend/src/dashboard/dashboard-v2.controller.ts`


