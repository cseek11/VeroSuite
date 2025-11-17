Structural Improvements
1. Add a Quick Reference Card
Add a one-page cheat sheet at the beginning for experienced developers:
markdown## Quick Reference Card

**Add Region:** `const { addRegion } = useRegionLayout()`
**Update Region:** `updateRegion(id, { grid_row: 2 })`
**Delete Region:** `removeRegion(id)`
**Undo/Redo:** `Ctrl+Z / Ctrl+Shift+Z`
**Command Palette:** `Ctrl+K`

**Key Files:**
- Main: `RegionDashboard.tsx`
- Hook: `useRegionLayout.ts`
- Grid: `RegionGrid.tsx`
- API: `enhanced-api.ts`
2. Add Visual Diagrams
Include architecture diagrams for:

Component hierarchy (tree diagram)
Data flow (sequence diagram)
State management flow
WebSocket event flow

3. Expand Troubleshooting Section
Add a dedicated troubleshooting section:
markdown## Common Issues & Solutions

### Regions Not Saving
**Symptom:** Changes disappear on refresh
**Cause:** Auto-save disabled or debounce too long
**Solution:** Check `autoSave: true` in `useRegionLayout`

### Drag-and-Drop Not Working
**Symptom:** Can't move regions
**Cause:** Missing drag handle class
**Solution:** Ensure `.region-drag-handle` class exists

### WebSocket Connection Failing
**Symptom:** Collaboration features not working
**Cause:** Socket not connected
**Solution:** Check `useWebSocket()` connection status
Content Improvements
4. Add Migration Guide
Include a section for upgrading from older versions:
markdown## Migration Guide

### From v1.x to v2.x

**Breaking Changes:**
- `RegionType` enum now uses lowercase with hyphens
- `updateRegion` now requires Promise handling
- `config` structure changed to flat object

**Migration Steps:**
1. Update region type strings
2. Add async/await to update calls
3. Flatten nested config objects
5. Expand Testing Section
Add comprehensive testing examples:
markdown## Testing

### Unit Testing Hooks
```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useRegionLayout } from '@/hooks/useRegionLayout';

test('addRegion creates new region', async () => {
  const { result } = renderHook(() => useRegionLayout({ layoutId: '123' }));
  
  await act(async () => {
    await result.current.addRegion(RegionType.SCHEDULING);
  });
  
  expect(result.current.regions).toHaveLength(1);
});
```

### Integration Testing Components
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { RegionContainer } from '@/components/dashboard/regions/RegionContainer';

test('region can be deleted', async () => {
  const handleDelete = jest.fn();
  render();
  
  fireEvent.click(screen.getByLabelText('Delete region'));
  expect(handleDelete).toHaveBeenCalledWith(mockRegion.id);
});
```
6. Add Performance Metrics
Include performance benchmarks and optimization targets:
markdown## Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Initial Load | < 1s | Time to first region render |
| Region Add | < 200ms | Optimistic update + API call |
| Drag Performance | 60fps | Frame rate during drag |
| Memory Usage | < 50MB | Per 100 regions |
| Bundle Size | < 150KB | Gzipped dashboard code |

**Profiling:**
```typescript
// Add performance marks
performance.mark('region-render-start');
// ... render code
performance.mark('region-render-end');
performance.measure('region-render', 'region-render-start', 'region-render-end');
```
7. Expand Security Section
Add dedicated security best practices:
markdown## Security Best Practices

### XSS Prevention
- Never use `dangerouslySetInnerHTML` in region content
- Sanitize all user-provided HTML/CSS
- Use Content Security Policy headers

### Authorization Checks
```typescript
// Always check permissions before actions
const canEdit = await checkPermission(regionId, userId, 'edit');
if (!canEdit) {
  toast.error('You don\'t have permission to edit this region');
  return;
}
```

### Data Validation
```typescript
// Validate all inputs
const schema = z.object({
  region_type: z.nativeEnum(RegionType),
  grid_row: z.number().min(0).max(50),
  grid_col: z.number().min(0).max(12),
});

const validated = schema.parse(regionData);
```
8. Add Code Organization Guidelines
markdown## Code Organization Guidelines

### File Naming Conventions
- Components: PascalCase (e.g., `RegionContainer.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useRegionLayout.ts`)
- Utils: camelCase (e.g., `roleDefaults.ts`)
- Types: PascalCase with `.types.ts` suffix

### Import Order
```typescript
// 1. External dependencies
import React, { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

// 2. Internal modules (absolute imports)
import { enhancedApi } from '@/lib/enhanced-api';
import { useRegionLayout } from '@/hooks/useRegionLayout';

// 3. Relative imports
import { RegionContainer } from './RegionContainer';

// 4. Types
import type { DashboardRegion } from '@/routes/dashboard/types/region.types';

// 5. Styles
import './region-grid.css';
```

### Component Structure Template
```typescript
// 1. Imports
// 2. Type definitions
// 3. Constants
// 4. Main component
// 5. Sub-components (if any)
// 6. Helper functions
// 7. Exports
```
9. Add Examples Section
markdown## Complete Examples

### Example 1: Creating a Custom Dashboard View
```typescript
import React, { useEffect } from 'react';
import { RegionDashboard } from '@/routes/dashboard/RegionDashboard';
import { useRegionLayout } from '@/hooks/useRegionLayout';
import { RegionType } from '@/routes/dashboard/types/region.types';

export const TechnicianDashboard: React.FC = () => {
  const { addRegion, regions } = useRegionLayout({ 
    layoutId: 'technician-default',
    autoSave: true 
  });

  useEffect(() => {
    if (regions.length === 0) {
      // Set up initial layout
      addRegion(RegionType.SCHEDULING, { row: 0, col: 0 });
      addRegion(RegionType.QUICK_ACTIONS, { row: 0, col: 8 });
    }
  }, []);

  return ;
};
```

### Example 2: Custom Region with Widget
```typescript
import React from 'react';
import { RegionContainer } from '@/components/dashboard/regions/RegionContainer';
import { WidgetSandbox } from '@/components/dashboard/widgets/WidgetSandbox';

export const CustomAnalyticsRegion: React.FC = ({ 
  region 
}) => {
  return (
    
      <WidgetSandbox
        widgetType="custom-analytics"
        config={{
          dataSource: 'api/analytics/daily',
          refreshInterval: 60000,
          chartType: 'line'
        }}
      />
    
  );
};
```

### Example 3: Implementing Real-time Collaboration
```typescript
import { useRegionPresence } from '@/hooks/useRegionPresence';

export const CollaborativeRegion: React.FC = ({ region }) => {
  const { 
    activeUsers, 
    lockedBy, 
    acquireLock, 
    releaseLock 
  } = useRegionPresence(region.id);

  const handleEdit = async () => {
    const lockAcquired = await acquireLock();
    if (!lockAcquired) {
      toast.warning(`Region is locked by ${lockedBy}`);
      return;
    }
    
    // Perform edit
    // ...
    
    await releaseLock();
  };

  return (
    
      {activeUsers.length > 0 && (
        
          {activeUsers.map(user => (
            
          ))}
        
      )}
      Edit
    
  );
};
```
10. Add Deployment Section
markdown## Deployment

### Environment Variables
```bash
# Frontend
VITE_API_URL=https://api.example.com
VITE_WS_URL=wss://api.example.com
VITE_ENABLE_ANALYTICS=true

# Backend
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
```

### Build Process
```bash
# Frontend build
cd frontend
npm run build

# Backend build
cd backend
npm run build

# Run migrations
npm run migrate:deploy
```

### Performance Checklist
- [ ] Enable gzip compression
- [ ] Configure CDN for static assets
- [ ] Set up Redis for caching
- [ ] Enable WebSocket sticky sessions
- [ ] Configure rate limiting
- [ ] Set up monitoring (Sentry, DataDog)
11. Add Accessibility Section
markdown## Accessibility (a11y)

### Keyboard Navigation
- **Tab**: Navigate between regions
- **Enter**: Activate selected region
- **Escape**: Close dialogs/menus
- **Arrow Keys**: Navigate within region content

### Screen Reader Support
```typescript

  
    {`${region.region_type} region. ${region.is_locked ? 'Locked' : 'Unlocked'}.`}
  

```

### Color Contrast
- Ensure all text meets WCAG AA standards (4.5:1 ratio)
- Provide high-contrast mode option
- Don't rely solely on color to convey information
12. Add Versioning & Changelog
markdown## Version History

### v2.0.0 (2024-01-15)
**Breaking Changes:**
- Renamed `RegionType` enum values to kebab-case
- Changed `updateRegion` to async function

**New Features:**
- Added real-time collaboration
- Implemented version control
- Added mobile responsive layout

**Bug Fixes:**
- Fixed drag-and-drop collision detection
- Resolved memory leak in WebSocket connections

### v1.5.0 (2023-12-01)
- Added undo/redo functionality
- Implemented export/import
These improvements would make the guide more practical, comprehensive, and easier to navigate for developers at all levels. The additions focus on real-world usage, common pitfalls, and production readiness.RetryCPlease review and provide suggestions for improvement for the region dashboard system based on this developer guide. Looking to push this region dashboard to an enterprise level. Be critical and provide insights.TthinkingRequest{}ResponseTool 'antml:thinking' not found.I'll provide a comprehensive, critical review of the Region Dashboard system from an enterprise perspective. Let me break this down into key areas:
🚨 Critical Issues (Must Fix for Enterprise)
1. State Management Architecture is Fragile
Problem: The current approach mixes local state, optimistic updates, and debounced saves in a way that will cause data inconsistencies at scale.
typescript// Current (PROBLEMATIC):
const updateRegion = useCallback((id: string, updates: Partial<DashboardRegion>) => {
  // Optimistic update
  setRegions(prev => prev.map(r => 
    r.id === id ? { ...r, ...updates } : r
  ));
  
  // Queue for debounced save
  if (autoSave) {
    pendingUpdatesRef.current.set(id, {
      ...pendingUpdatesRef.current.get(id),
      ...updates
    });
    debouncedSave();
  }
}, [autoSave, debouncedSave]);
Issues:

No conflict resolution strategy for concurrent edits
Rollback on error is naive (doesn't handle partial failures)
No transaction guarantees
Lost updates problem when multiple users edit simultaneously

Enterprise Solution:
typescript// Implement Operational Transformation (OT) or CRDT
interface RegionUpdate {
  id: string;
  version: number;  // Optimistic locking
  timestamp: number;
  userId: string;
  changes: Partial<DashboardRegion>;
}

const updateRegion = useCallback(async (id: string, updates: Partial<DashboardRegion>) => {
  const region = regions.find(r => r.id === id);
  if (!region) throw new Error('Region not found');
  
  try {
    // Send version number for optimistic locking
    const result = await enhancedApi.dashboardLayouts.updateRegion(
      layoutId, 
      id, 
      {
        ...updates,
        version: region.version  // Backend validates version
      }
    );
    
    setRegions(prev => prev.map(r => 
      r.id === id ? result : r  // Use server version as source of truth
    ));
    
    return result;
  } catch (err) {
    if (err.code === 'CONFLICT') {
      // Handle conflict - fetch latest, show merge UI
      const latest = await enhancedApi.dashboardLayouts.getRegion(layoutId, id);
      showConflictResolutionDialog(region, latest, updates);
    }
    throw err;
  }
}, [layoutId, regions]);
2. No Data Layer Abstraction
Problem: Direct API calls scattered throughout hooks creates tight coupling and makes testing/mocking difficult.
Enterprise Solution: Implement Repository Pattern + Redux/Zustand for centralized state:
typescript// store/regionStore.ts
interface RegionStore {
  regions: Map<string, DashboardRegion>;
  layouts: Map<string, DashboardLayout>;
  loading: Set<string>;
  errors: Map<string, Error>;
  
  // Actions
  fetchLayout: (layoutId: string) => Promise<void>;
  updateRegion: (id: string, updates: Partial<DashboardRegion>) => Promise<void>;
  syncWithServer: () => Promise<void>;
  
  // Selectors
  getRegionsByLayout: (layoutId: string) => DashboardRegion[];
  getFilteredRegions: (filter: RegionFilter) => DashboardRegion[];
}

// Use Zustand with immer for immutability
const useRegionStore = create<RegionStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        regions: new Map(),
        // ... implementation
      })),
      { name: 'region-storage' }
    )
  )
);
3. Performance Issues at Scale
Problem: No virtualization, entire grid re-renders on any change, memory leaks with WebSocket subscriptions.
Critical Issues:

100+ regions will cause severe performance degradation
react-grid-layout re-renders entire grid on every drag event
No lazy loading or windowing
Debounced saves can queue up infinitely

Enterprise Solution:
typescript// 1. Implement Virtual Grid with react-window
import { VariableSizeGrid } from 'react-window';

const VirtualizedRegionGrid: React.FC = ({ regions }) => {
  const gridRef = useRef<VariableSizeGrid>(null);
  
  // Only render visible regions
  const Cell = ({ columnIndex, rowIndex, style }) => {
    const region = getRegionAt(rowIndex, columnIndex);
    if (!region) return null;
    
    return (
      <div style={style}>
        <RegionContainer region={region} />
      </div>
    );
  };
  
  return (
    <VariableSizeGrid
      ref={gridRef}
      columnCount={12}
      rowCount={Math.max(...regions.map(r => r.grid_row + r.row_span))}
      columnWidth={(index) => 100}
      rowHeight={(index) => 100}
      height={window.innerHeight}
      width={window.innerWidth}
    >
      {Cell}
    </VariableSizeGrid>
  );
};

// 2. Implement region-level subscriptions (not layout-level)
const useRegionSubscription = (regionId: string) => {
  useEffect(() => {
    const subscription = regionStream.subscribe(regionId, (update) => {
      updateRegionStore(regionId, update);
    });
    
    return () => subscription.unsubscribe();
  }, [regionId]);
};

// 3. Implement proper request coalescing
class RegionUpdateQueue {
  private queue: Map<string, QueuedUpdate[]> = new Map();
  private flushTimer: NodeJS.Timeout | null = null;
  
  enqueue(regionId: string, update: Partial<DashboardRegion>) {
    if (!this.queue.has(regionId)) {
      this.queue.set(regionId, []);
    }
    this.queue.get(regionId)!.push({ update, timestamp: Date.now() });
    
    // Flush after 500ms or when queue reaches 10 updates
    if (this.queue.get(regionId)!.length >= 10) {
      this.flush(regionId);
    } else {
      this.scheduleFlush(regionId);
    }
  }
  
  private async flush(regionId: string) {
    const updates = this.queue.get(regionId) || [];
    if (updates.length === 0) return;
    
    // Merge all updates
    const merged = updates.reduce((acc, { update }) => ({ ...acc, ...update }), {});
    
    try {
      await api.updateRegion(regionId, merged);
      this.queue.delete(regionId);
    } catch (err) {
      // Implement exponential backoff retry
      this.retryWithBackoff(regionId, merged);
    }
  }
}
4. Security Vulnerabilities
Critical Issues:
typescript// VULNERABILITY 1: XSS through config
const RegionHeader = ({ region }) => {
  return (
    // ❌ User-controlled HTML injection
    <div dangerouslySetInnerHTML={{ __html: region.config.title }} />
  );
};

// VULNERABILITY 2: No input validation
const addRegion = async (type, position) => {
  // ❌ No validation - can send invalid data to backend
  await api.createRegion(layoutId, { region_type: type, ...position });
};

// VULNERABILITY 3: Client-side permission checks only
const handleDelete = () => {
  // ❌ No server-side verification
  if (region.user_id === currentUserId) {
    removeRegion(region.id);
  }
};
Enterprise Solution:
typescript// 1. Implement DOMPurify for all user content
import DOMPurify from 'dompurify';

const RegionHeader = ({ region }) => {
  const sanitizedTitle = useMemo(
    () => DOMPurify.sanitize(region.config.title, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong'],
      ALLOWED_ATTR: []
    }),
    [region.config.title]
  );
  
  return <div dangerouslySetInnerHTML={{ __html: sanitizedTitle }} />;
};

// 2. Implement Zod schemas for runtime validation
import { z } from 'zod';

const RegionSchema = z.object({
  region_type: z.nativeEnum(RegionType),
  grid_row: z.number().int().min(0).max(100),
  grid_col: z.number().int().min(0).max(12),
  row_span: z.number().int().min(1).max(20),
  col_span: z.number().int().min(1).max(12),
  config: z.record(z.unknown()).refine(
    (config) => {
      // Validate config doesn't contain scripts
      const str = JSON.stringify(config);
      return !/<script/i.test(str) && !/javascript:/i.test(str);
    },
    { message: 'Config contains potentially dangerous content' }
  )
});

const addRegion = async (type: RegionType, position?: { row: number; col: number }) => {
  const validated = RegionSchema.parse({
    region_type: type,
    grid_row: position?.row ?? 0,
    grid_col: position?.col ?? 0,
    row_span: 4,
    col_span: 6,
    config: {}
  });
  
  await api.createRegion(layoutId, validated);
};

// 3. Implement proper RBAC with backend verification
const handleDelete = async (regionId: string) => {
  try {
    // Backend verifies permissions
    await api.deleteRegion(layoutId, regionId);
    // Only update UI after server confirms
    setRegions(prev => prev.filter(r => r.id !== regionId));
  } catch (err) {
    if (err.status === 403) {
      toast.error('You do not have permission to delete this region');
    }
  }
};
5. Inadequate Error Handling & Recovery
Problem: Error handling is primitive - just toast notifications and console logs.
Enterprise Solution:
typescript// Implement comprehensive error boundary with recovery
class RegionErrorBoundary extends React.Component<Props, State> {
  state = { 
    hasError: false, 
    error: null,
    errorInfo: null,
    errorCount: 0,
    lastErrorTime: null
  };
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const now = Date.now();
    const timeSinceLastError = now - (this.state.lastErrorTime || 0);
    
    // Detect error loops (3+ errors within 5 seconds)
    if (timeSinceLastError < 5000 && this.state.errorCount >= 2) {
      // Force reload to prevent infinite error loop
      logger.critical('Error loop detected, forcing reload', {
        error,
        errorInfo,
        regionId: this.props.regionId
      });
      window.location.reload();
      return;
    }
    
    // Log to error tracking service
    logger.error('Region render error', {
      error,
      errorInfo,
      regionId: this.props.regionId,
      userId: this.props.userId,
      componentStack: errorInfo.componentStack
    });
    
    // Send to analytics
    analytics.track('region_error', {
      regionId: this.props.regionId,
      errorType: error.name,
      errorMessage: error.message
    });
    
    this.setState({
      errorCount: this.state.errorCount + 1,
      lastErrorTime: now,
      errorInfo
    });
  }
  
  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorCount: 0 
    });
    
    // Attempt to reload region data
    this.props.onReload?.();
  };
  
  render() {
    if (this.state.hasError) {
      return (
        <RegionErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
          onRemove={() => this.props.onRemoveRegion(this.props.regionId)}
        />
      );
    }
    
    return this.props.children;
  }
}

// Implement retry logic for API calls
class ApiClient {
  async request<T>(
    endpoint: string, 
    options: RequestInit,
    retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
      try {
        const response = await fetch(endpoint, options);
        
        if (!response.ok) {
          const error = await this.handleErrorResponse(response);
          
          // Don't retry client errors (4xx)
          if (response.status >= 400 && response.status < 500) {
            throw error;
          }
          
          lastError = error;
          continue;
        }
        
        return await response.json();
      } catch (err) {
        lastError = err;
        
        // Don't retry on network errors without backoff
        if (attempt < retryConfig.maxRetries) {
          await this.delay(retryConfig.backoffMs * Math.pow(2, attempt));
        }
      }
    }
    
    throw new ApiError('Max retries exceeded', { cause: lastError });
  }
}
🎯 Architecture Improvements
6. Missing Event Sourcing/Audit Trail
Current Problem: No audit trail for compliance, no way to replay actions, no accountability.
Enterprise Solution:
typescript// Implement event sourcing pattern
interface DashboardEvent {
  id: string;
  eventType: 'REGION_CREATED' | 'REGION_UPDATED' | 'REGION_DELETED' | 'REGION_MOVED';
  aggregateId: string;  // layoutId
  aggregateVersion: number;
  payload: unknown;
  metadata: {
    userId: string;
    timestamp: Date;
    ipAddress: string;
    userAgent: string;
    sessionId: string;
  };
}

// Backend event store
class DashboardEventStore {
  async appendEvent(event: DashboardEvent): Promise<void> {
    // Store in append-only event log
    await this.db.events.create({ data: event });
    
    // Update read model (current state)
    await this.projectionHandler.project(event);
    
    // Publish to event bus for real-time updates
    await this.eventBus.publish(event);
  }
  
  async getEventStream(layoutId: string, fromVersion?: number): Promise<DashboardEvent[]> {
    return this.db.events.findMany({
      where: {
        aggregateId: layoutId,
        aggregateVersion: { gte: fromVersion || 0 }
      },
      orderBy: { aggregateVersion: 'asc' }
    });
  }
  
  async replayEvents(layoutId: string): Promise<DashboardLayout> {
    const events = await this.getEventStream(layoutId);
    return events.reduce(
      (state, event) => this.applyEvent(state, event),
      this.getInitialState()
    );
  }
}

// Frontend integration
const useDashboardEvents = (layoutId: string) => {
  const [events, setEvents] = useState<DashboardEvent[]>([]);
  
  useEffect(() => {
    // Subscribe to event stream
    const stream = eventBus.subscribe(`layout:${layoutId}`, (event) => {
      setEvents(prev => [...prev, event]);
      
      // Apply event to local state
      applyEventToStore(event);
    });
    
    return () => stream.unsubscribe();
  }, [layoutId]);
  
  return { events };
};
7. No Multi-Tenancy Isolation
Problem: Tenant isolation is handled at application layer only - massive security risk.
Enterprise Solution:
typescript// Implement Row-Level Security (RLS) in database
// PostgreSQL example:
CREATE POLICY tenant_isolation_policy ON dashboard_regions
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

CREATE POLICY user_region_policy ON dashboard_regions
  USING (
    tenant_id = current_setting('app.current_tenant_id')::uuid
    AND (
      user_id = current_setting('app.current_user_id')::uuid
      OR EXISTS (
        SELECT 1 FROM dashboard_region_acls
        WHERE region_id = dashboard_regions.id
        AND has_permission(current_setting('app.current_user_id')::uuid, 'read')
      )
    )
  );

// Backend middleware
class TenantContextMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.user.tenantId;
    const userId = req.user.userId;
    
    // Set session variables for RLS
    await this.db.$executeRaw`
      SET LOCAL app.current_tenant_id = ${tenantId};
      SET LOCAL app.current_user_id = ${userId};
    `;
    
    next();
  }
}

// Add tenant validation to all queries
const getRegions = async (layoutId: string, tenantId: string) => {
  // Queries automatically filtered by RLS
  return await prisma.dashboard_regions.findMany({
    where: { 
      layout_id: layoutId,
      // tenantId not needed - enforced by RLS
      deleted_at: null 
    }
  });
};
8. No Caching Strategy
Problem: Every page load fetches all data, no cache invalidation strategy.
Enterprise Solution:
typescript// Multi-layer caching strategy
class RegionCache {
  private l1Cache: Map<string, CacheEntry>;  // In-memory
  private l2Cache: Redis;  // Redis
  private l3Cache: Database;  // PostgreSQL
  
  async get(key: string): Promise<DashboardRegion | null> {
    // L1: Check memory cache
    const l1Hit = this.l1Cache.get(key);
    if (l1Hit && !this.isExpired(l1Hit)) {
      metrics.increment('cache.l1.hit');
      return l1Hit.value;
    }
    
    // L2: Check Redis
    const l2Hit = await this.l2Cache.get(key);
    if (l2Hit) {
      metrics.increment('cache.l2.hit');
      this.l1Cache.set(key, { value: l2Hit, expiresAt: Date.now() + 60000 });
      return l2Hit;
    }
    
    // L3: Check database
    const l3Hit = await this.l3Cache.findUnique({ where: { id: key } });
    if (l3Hit) {
      metrics.increment('cache.l3.hit');
      await this.l2Cache.setex(key, 300, JSON.stringify(l3Hit));
      this.l1Cache.set(key, { value: l3Hit, expiresAt: Date.now() + 60000 });
      return l3Hit;
    }
    
    metrics.increment('cache.miss');
    return null;
  }
  
  async invalidate(pattern: string) {
    // Invalidate all layers
    const keys = Array.from(this.l1Cache.keys()).filter(k => k.includes(pattern));
    keys.forEach(k => this.l1Cache.delete(k));
    await this.l2Cache.del(await this.l2Cache.keys(pattern));
    
    // Publish invalidation event to other instances
    await this.pubsub.publish('cache:invalidate', { pattern });
  }
}

// Implement Cache-Control headers
app.get('/api/dashboard/layouts/:id', (req, res) => {
  res.set({
    'Cache-Control': 'private, max-age=300, stale-while-revalidate=60',
    'ETag': generateETag(layout),
    'Last-Modified': layout.updated_at.toUTCString()
  });
  
  if (req.headers['if-none-match'] === etag) {
    return res.status(304).end();
  }
  
  res.json(layout);
});
9. Inadequate Observability
Problem: Basic logging only, no metrics, traces, or real-time monitoring.
Enterprise Solution:
typescript// Implement OpenTelemetry
import { trace, metrics } from '@opentelemetry/api';

class RegionObservability {
  private tracer = trace.getTracer('dashboard-regions');
  private meter = metrics.getMeter('dashboard-regions');
  
  // Metrics
  private regionLoadDuration = this.meter.createHistogram('region.load.duration');
  private regionUpdateCounter = this.meter.createCounter('region.update.count');
  private activeRegionsGauge = this.meter.createUpDownCounter('regions.active.count');
  
  async loadRegion(regionId: string) {
    const span = this.tracer.startSpan('loadRegion', {
      attributes: {
        'region.id': regionId,
        'user.id': getCurrentUserId(),
        'tenant.id': getCurrentTenantId()
      }
    });
    
    const startTime = Date.now();
    
    try {
      const region = await api.getRegion(regionId);
      
      span.setStatus({ code: SpanStatusCode.OK });
      this.regionLoadDuration.record(Date.now() - startTime, {
        'region.type': region.region_type
      });
      
      return region;
    } catch (err) {
      span.setStatus({ 
        code: SpanStatusCode.ERROR,
        message: err.message 
      });
      span.recordException(err);
      throw err;
    } finally {
      span.end();
    }
  }
  
  trackRegionUpdate(regionId: string, updateType: string) {
    this.regionUpdateCounter.add(1, {
      'region.id': regionId,
      'update.type': updateType
    });
  }
}

// Implement real-time dashboard metrics
class DashboardMetrics {
  private metrics = {
    totalRegions: 0,
    activeUsers: new Set<string>(),
    apiLatency: [] as number[],
    errorRate: 0,
    wsConnections: 0
  };
  
  updateMetrics() {
    // Send to monitoring service (DataDog, New Relic, etc.)
    metricsClient.gauge('dashboard.regions.total', this.metrics.totalRegions);
    metricsClient.gauge('dashboard.users.active', this.metrics.activeUsers.size);
    metricsClient.gauge('dashboard.api.p95_latency', percentile(this.metrics.apiLatency, 95));
    metricsClient.gauge('dashboard.error_rate', this.metrics.errorRate);
  }
}
10. No Feature Flags / Gradual Rollout
Problem: Can't toggle features on/off, no A/B testing, risky deployments.
Enterprise Solution:
typescript// Implement feature flag system
import { useFeatureFlag } from '@/lib/feature-flags';

const RegionDashboard = () => {
  const isCollaborationEnabled = useFeatureFlag('dashboard-collaboration', {
    defaultValue: false,
    variants: {
      control: false,
      treatment: true
    }
  });
  
  const isVirtualizationEnabled = useFeatureFlag('dashboard-virtualization', {
    defaultValue: false,
    rollout: {
      percentage: 25,  // 25% of users
      userGroups: ['beta-testers', 'internal']
    }
  });
  
  return (
    <>
      {isVirtualizationEnabled ? (
        <VirtualizedRegionGrid regions={regions} />
      ) : (
        <RegionGrid regions={regions} />
      )}
      
      {isCollaborationEnabled && (
        <CollaborationPanel />
      )}
    </>
  );
};

// Backend feature flag evaluation
class FeatureFlagService {
  async evaluateFlag(
    flagKey: string,
    context: EvaluationContext
  ): Promise<boolean> {
    const flag = await this.getFlag(flagKey);
    
    if (!flag.enabled) return false;
    
    // Percentage-based rollout
    if (flag.rollout?.percentage) {
      const hash = this.hashUser(context.userId);
      if (hash % 100 < flag.rollout.percentage) {
        return true;
      }
    }
    
    // User group targeting
    if (flag.rollout?.userGroups) {
      const userGroups = await this.getUserGroups(context.userId);
      if (flag.rollout.userGroups.some(g => userGroups.includes(g))) {
        return true;
      }
    }
    
    // Tenant targeting
    if (flag.rollout?.tenants?.includes(context.tenantId)) {
      return true;
    }
    
    return false;
  }
}
📊 Scalability Issues
11. Database Query Optimization
Problem: N+1 queries, missing indexes, inefficient queries.
Enterprise Solution:
typescript// Add proper indexes
CREATE INDEX idx_regions_layout_deleted ON dashboard_regions(layout_id, deleted_at) 
  WHERE deleted_at IS NULL;
CREATE INDEX idx_regions_user_type ON dashboard_regions(user_id, region_type);
CREATE INDEX idx_regions_spatial ON dashboard_regions(grid_row, grid_col, row_span, col_span);
CREATE INDEX idx_acls_target ON dashboard_region_acls(target_type, target_id);

// Use query builder with proper joins
const getLayoutWithRegions = async (layoutId: string) => {
  return await prisma.dashboard_layouts.findUnique({
    where: { id: layoutId },
    include: {
      regions: {
        where: { deleted_at: null },
        include: {
          acls: {
            where: {
              OR: [
                { target_type: 'user', target_id: userId },
                { target_type: 'role', target_id: { in: userRoles } }
              ]
            }
          },
          locks: {
            where: {
              released_at: null,
              expires_at: { gt: new Date() }
            }
          }
        }
      }
    }
  });
};

// Implement query result caching with Prisma
const prismaClient = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
}).$extends({
  query: {
    $allOperations: async ({ operation, model, args, query }) => {
      const cacheKey = `${model}:${operation}:${JSON.stringify(args)}`;
      
      const cached = await redis.get(cacheKey);
      if (cached) return JSON.parse(cached);
      
      const result = await query(args);
      await redis.setex(cacheKey, 300, JSON.stringify(result));
      
      return result;
    }
  }
});
12. WebSocket Scalability
Problem: Single WebSocket server won't scale horizontally, no pub/sub for multi-instance deployments.
Enterprise Solution:
typescript// Implement Redis Pub/Sub for WebSocket scaling
class ScalableWebSocketGateway {
  private redis: Redis;
  private subscriber: Redis;
  
  async onModuleInit() {
    this.subscriber.subscribe('dashboard-events');
    this.subscriber.on('message', (channel, message) => {
      const event = JSON.parse(message);
      this.broadcastToRoom(event.room, event.data);
    });
  }
  
  @SubscribeMessage('region-update')
  async handleRegionUpdate(client: Socket, data: RegionUpdateEvent) {
    // Publish to Redis so all instances receive it
    await this.redis.publish('dashboard-events', JSON.stringify({
      room: `layout:${data.layoutId}`,
      data: {
        type: 'region-update',
        regionId: data.regionId,
        updates: data.updates,
        userId: client.data.userId
      }
    }));
  }
  
  private broadcastToRoom(room: string, data: any) {
    // Only broadcast to clients connected to this instance
    this.server.to(room).emit('region-updated', data);
  }
}

// Implement connection pooling and backpressure
class WebSocketConnectionManager {
  private connections: Map<string, Socket> = new Map();
  private readonly MAX_CONNECTIONS_PER_LAYOUT = 100;
  
  async addConnection(layoutId: string, socket: Socket): Promise<boolean> {
    const currentConnections = this.getLayoutConnections(layoutId);
    
    if (currentConnections.length >= this.MAX_CONNECTIONS_PER_LAYOUT) {
      socket.emit('error', {
        code: 'MAX_CONNECTIONS_EXCEEDED',
        message: 'Too many users viewing this layout'
      });
      return false;
    }
    
    this.connections.set(socket.id, socket);
    
    // Implement heartbeat
    const heartbeat = setInterval(() => {
      if (socket.connected) {
        socket.emit('ping');
      } else {
        this.removeConnection(socket.id);
        clearInterval(heartbeat);
      }
    }, 30000);
    
    return true;
  }
}
13. No Rate Limiting
Problem: API can be abused, no protection against DoS attacks.
Enterprise Solution:
typescript// Implement sliding window rate limiter
import { RateLimiterRedis } from 'rate-limiter-flexible';

class ApiRateLimiter {
  private limiters: Map<string, RateLimiterRedis>;
  
  constructor() {
    this.limiters = new Map([
      ['api', new RateLimiterRedis({
        storeClient: redisClient,
        keyPrefix: 'rl:api',
        points: 100,  // Number of requests
        duration: 60,  // Per 60 seconds
        blockDuration: 60  // Block for 60 seconds if exceeded
      })],
      ['websocket', new RateLimiterRedis({
        storeClient: redisClient,
        keyPrefix: 'rl:ws',
        points: 50,
        duration: 60
      })],
      ['expensive', new RateLimiterRedis({
        storeClient: redisClient,
        keyPrefix: 'rl:expensive',
        points: 10,  // Stricter limit for expensive operations
        duration: 60
      })]
    ]);
  }
  
  async checkLimit(
    type: 'api' | 'websocket' | 'expensive',
    identifier: string
  ): Promise<void> {
    const limiter = this.limiters.get(type);
    
    try {
      const result = await limiter.consume(identifier);
      
      // Add rate limit headers
      return {
        'X-RateLimit-Limit': limiter.points,
        'X-RateLimit-Remaining': result.remainingPoints,
        'X-RRetryCContinuetypescript        'X-RateLimit-Reset': new Date(Date.now() + result.msBeforeNext).toISOString()
      };
    } catch (rateLimitError) {
      if (rateLimitError instanceof Error) {
        throw new TooManyRequestsException({
          message: 'Rate limit exceeded',
          retryAfter: Math.ceil(rateLimitError.msBeforeNext / 1000),
          limit: limiter.points
        });
      }
      throw rateLimitError;
    }
  }
}

// Implement tiered rate limiting based on user roles
class TieredRateLimiter {
  private limits = {
    free: { api: 100, websocket: 50, expensive: 5 },
    pro: { api: 500, websocket: 200, expensive: 50 },
    enterprise: { api: 5000, websocket: 1000, expensive: 500 }
  };
  
  async checkLimit(userId: string, endpoint: string): Promise<void> {
    const userTier = await this.getUserTier(userId);
    const limits = this.limits[userTier];
    
    // Different limits per endpoint category
    const category = this.categorizeEndpoint(endpoint);
    const limiter = new RateLimiterRedis({
      points: limits[category],
      duration: 60,
      keyPrefix: `rl:${userTier}:${category}`
    });
    
    await limiter.consume(`${userId}:${endpoint}`);
  }
}

// Add request cost calculation for complex operations
class RequestCostCalculator {
  calculateCost(operation: string, payload: any): number {
    switch (operation) {
      case 'create_region':
        return 1;
      case 'update_region':
        return 1;
      case 'bulk_update':
        return payload.regions.length * 2;
      case 'export_layout':
        return 10;
      case 'import_layout':
        return payload.regions.length * 5;
      case 'revert_version':
        return 20; // Expensive operation
      default:
        return 1;
    }
  }
  
  async consumePoints(userId: string, cost: number): Promise<void> {
    const limiter = new RateLimiterRedis({
      points: 1000, // Daily point budget
      duration: 86400,
      keyPrefix: 'rl:cost'
    });
    
    await limiter.consume(userId, cost);
  }
}
14. Missing Data Validation Layer
Problem: Validation scattered across components, inconsistent, easily bypassed.
Enterprise Solution:
typescript// Centralized validation schemas
import { z } from 'zod';

// Domain-specific validation rules
const ValidationRules = {
  gridRow: z.number().int().min(0).max(100),
  gridCol: z.number().int().min(0).max(12),
  rowSpan: z.number().int().min(1).max(20),
  colSpan: z.number().int().min(1).max(12),
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Title contains invalid characters'),
  color: z.string()
    .regex(/^(#[0-9A-Fa-f]{6}|rgb\(\d{1,3},\s?\d{1,3},\s?\d{1,3}\))$/, 'Invalid color format')
};

// Composite schemas
const RegionCreateSchema = z.object({
  region_type: z.nativeEnum(RegionType),
  grid_row: ValidationRules.gridRow,
  grid_col: ValidationRules.gridCol,
  row_span: ValidationRules.rowSpan,
  col_span: ValidationRules.colSpan,
  config: z.object({
    title: ValidationRules.title.optional(),
    backgroundColor: ValidationRules.color.optional(),
    headerColor: ValidationRules.color.optional(),
    borderColor: ValidationRules.color.optional()
  }).optional()
}).refine(
  (data) => {
    // Business logic validation: region must fit within grid
    return data.grid_col + data.col_span <= 12;
  },
  { message: 'Region extends beyond grid bounds' }
).refine(
  (data) => {
    // Prevent overlapping regions (checked against existing regions)
    return !hasOverlap(data);
  },
  { message: 'Region overlaps with existing region' }
);

const RegionUpdateSchema = RegionCreateSchema.partial().refine(
  (data) => {
    // At least one field must be updated
    return Object.keys(data).length > 0;
  },
  { message: 'No fields to update' }
);

// Backend validation middleware
class ValidationMiddleware {
  validate(schema: z.ZodSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const validated = await schema.parseAsync(req.body);
        req.body = validated; // Replace with validated data
        next();
      } catch (err) {
        if (err instanceof z.ZodError) {
          return res.status(400).json({
            error: 'Validation failed',
            details: err.errors.map(e => ({
              field: e.path.join('.'),
              message: e.message,
              code: e.code
            }))
          });
        }
        next(err);
      }
    };
  }
}

// Use in routes
router.post(
  '/regions',
  ValidationMiddleware.validate(RegionCreateSchema),
  RegionController.create
);

// Frontend form validation with same schemas
const RegionForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(RegionCreateSchema)
  });
  
  const onSubmit = async (data: z.infer<typeof RegionCreateSchema>) => {
    // Data is guaranteed to be valid
    await createRegion(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('config.title')} />
      {errors.config?.title && (
        <span className="error">{errors.config.title.message}</span>
      )}
    </form>
  );
};
🔒 Security Enhancements
15. Implement Content Security Policy
Problem: No CSP headers, vulnerable to XSS and injection attacks.
Enterprise Solution:
typescript// Strict CSP configuration
const cspConfig = {
  defaultSrc: ["'self'"],
  scriptSrc: [
    "'self'",
    "'unsafe-inline'", // Remove in production, use nonces
    'https://cdnjs.cloudflare.com'
  ],
  styleSrc: [
    "'self'",
    "'unsafe-inline'", // Use nonces for inline styles
    'https://fonts.googleapis.com'
  ],
  imgSrc: ["'self'", 'data:', 'https:'],
  fontSrc: ["'self'", 'https://fonts.gstatic.com'],
  connectSrc: [
    "'self'",
    process.env.API_URL,
    process.env.WS_URL
  ],
  frameSrc: ["'none'"], // Prevent clickjacking
  objectSrc: ["'none'"],
  upgradeInsecureRequests: [],
  blockAllMixedContent: []
};

// Apply CSP with nonces for dynamic scripts
app.use((req, res, next) => {
  const nonce = crypto.randomBytes(16).toString('base64');
  res.locals.nonce = nonce;
  
  const cspHeader = Object.entries(cspConfig)
    .map(([key, values]) => {
      const directive = key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
      if (key === 'scriptSrc') {
        values.push(`'nonce-${nonce}'`);
      }
      return `${directive} ${values.join(' ')}`;
    })
    .join('; ');
  
  res.setHeader('Content-Security-Policy', cspHeader);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  next();
});

// Use nonces in React
const App: React.FC = () => {
  const nonce = useNonce(); // From server-side context
  
  return (
    <Helmet>
      <script nonce={nonce}>
        {`window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}`}
      </script>
    </Helmet>
  );
};
16. Implement API Authentication & Authorization
Problem: JWT-only auth is insufficient, no API key management, no OAuth2.
Enterprise Solution:
typescript// Multi-method authentication
class AuthenticationService {
  async authenticate(req: Request): Promise<AuthContext> {
    // Method 1: JWT Bearer token
    const bearerToken = this.extractBearerToken(req);
    if (bearerToken) {
      return await this.validateJWT(bearerToken);
    }
    
    // Method 2: API Key (for service-to-service)
    const apiKey = req.headers['x-api-key'];
    if (apiKey) {
      return await this.validateApiKey(apiKey as string);
    }
    
    // Method 3: OAuth2 token
    const oauthToken = this.extractOAuthToken(req);
    if (oauthToken) {
      return await this.validateOAuth(oauthToken);
    }
    
    // Method 4: Session cookie (for web app)
    const sessionId = req.cookies['session_id'];
    if (sessionId) {
      return await this.validateSession(sessionId);
    }
    
    throw new UnauthorizedException('No valid authentication method found');
  }
  
  private async validateApiKey(apiKey: string): Promise<AuthContext> {
    // Hash the API key for lookup
    const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');
    
    const key = await this.db.apiKeys.findUnique({
      where: { key_hash: hashedKey },
      include: { user: true, permissions: true }
    });
    
    if (!key || key.expires_at < new Date() || !key.is_active) {
      throw new UnauthorizedException('Invalid or expired API key');
    }
    
    // Update last used timestamp
    await this.db.apiKeys.update({
      where: { id: key.id },
      data: { last_used_at: new Date() }
    });
    
    return {
      userId: key.user_id,
      tenantId: key.tenant_id,
      permissions: key.permissions,
      authMethod: 'api_key'
    };
  }
}

// Implement permission-based authorization
class AuthorizationService {
  private permissionCache: LRUCache<string, Set<string>>;
  
  async authorize(
    userId: string,
    resource: string,
    action: string
  ): Promise<boolean> {
    const cacheKey = `${userId}:${resource}:${action}`;
    
    // Check cache first
    const cached = this.permissionCache.get(cacheKey);
    if (cached !== undefined) {
      return cached.has(action);
    }
    
    // Check direct permissions
    const directPerms = await this.getUserPermissions(userId);
    if (this.hasPermission(directPerms, resource, action)) {
      this.permissionCache.set(cacheKey, new Set([action]));
      return true;
    }
    
    // Check role-based permissions
    const roles = await this.getUserRoles(userId);
    for (const role of roles) {
      const rolePerms = await this.getRolePermissions(role);
      if (this.hasPermission(rolePerms, resource, action)) {
        this.permissionCache.set(cacheKey, new Set([action]));
        return true;
      }
    }
    
    // Check team-based permissions
    const teams = await this.getUserTeams(userId);
    for (const team of teams) {
      const teamPerms = await this.getTeamPermissions(team);
      if (this.hasPermission(teamPerms, resource, action)) {
        this.permissionCache.set(cacheKey, new Set([action]));
        return true;
      }
    }
    
    return false;
  }
  
  private hasPermission(
    permissions: Permission[],
    resource: string,
    action: string
  ): boolean {
    return permissions.some(p => 
      (p.resource === resource || p.resource === '*') &&
      (p.actions.includes(action) || p.actions.includes('*'))
    );
  }
}

// Authorization decorator for controllers
function RequirePermission(resource: string, action: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      const req = args[0] as Request;
      const authContext = req.user as AuthContext;
      
      const authorized = await authService.authorize(
        authContext.userId,
        resource,
        action
      );
      
      if (!authorized) {
        throw new ForbiddenException(
          `User does not have permission to ${action} ${resource}`
        );
      }
      
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

// Usage in controller
class RegionController {
  @RequirePermission('dashboard_region', 'create')
  async createRegion(req: Request, res: Response) {
    // User is guaranteed to have permission
    const region = await this.regionService.create(req.body);
    res.json(region);
  }
  
  @RequirePermission('dashboard_region', 'delete')
  async deleteRegion(req: Request, res: Response) {
    await this.regionService.delete(req.params.id);
    res.status(204).end();
  }
}
17. Implement Encryption at Rest
Problem: Sensitive data stored in plaintext, no field-level encryption.
Enterprise Solution:
typescript// Implement transparent field-level encryption
class EncryptionService {
  private algorithm = 'aes-256-gcm';
  private keyRing: Map<string, Buffer> = new Map();
  
  constructor() {
    // Load encryption keys from secure key management system (AWS KMS, Vault, etc.)
    this.loadKeys();
  }
  
  encrypt(plaintext: string, keyId: string = 'default'): EncryptedField {
    const key = this.keyRing.get(keyId);
    if (!key) throw new Error(`Key not found: ${keyId}`);
    
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, key, iv);
    
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      ciphertext: encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      keyId,
      algorithm: this.algorithm
    };
  }
  
  decrypt(encrypted: EncryptedField): string {
    const key = this.keyRing.get(encrypted.keyId);
    if (!key) throw new Error(`Key not found: ${encrypted.keyId}`);
    
    const decipher = crypto.createDecipheriv(
      encrypted.algorithm,
      key,
      Buffer.from(encrypted.iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(encrypted.authTag, 'hex'));
    
    let decrypted = decipher.update(encrypted.ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
  
  async rotateKeys(): Promise<void> {
    // Re-encrypt all data with new key
    const newKeyId = await this.generateNewKey();
    
    // Batch re-encryption
    const batchSize = 1000;
    let offset = 0;
    
    while (true) {
      const records = await this.db.dashboard_regions.findMany({
        take: batchSize,
        skip: offset,
        where: {
          config: { path: ['encrypted'], not: Prisma.DbNull }
        }
      });
      
      if (records.length === 0) break;
      
      await Promise.all(records.map(async record => {
        const decrypted = this.decrypt(record.config.encrypted);
        const reencrypted = this.encrypt(decrypted, newKeyId);
        
        await this.db.dashboard_regions.update({
          where: { id: record.id },
          data: {
            config: {
              ...record.config,
              encrypted: reencrypted
            }
          }
        });
      }));
      
      offset += batchSize;
    }
  }
}

// Prisma middleware for automatic encryption/decryption
prisma.$use(async (params, next) => {
  const sensitiveFields = ['config.apiKey', 'config.secretToken'];
  
  // Encrypt on create/update
  if (params.action === 'create' || params.action === 'update') {
    for (const field of sensitiveFields) {
      const value = _.get(params.args.data, field);
      if (value) {
        const encrypted = encryptionService.encrypt(value);
        _.set(params.args.data, field, encrypted);
      }
    }
  }
  
  const result = await next(params);
  
  // Decrypt on read
  if (params.action === 'findUnique' || params.action === 'findMany') {
    const decrypt = (obj: any) => {
      for (const field of sensitiveFields) {
        const value = _.get(obj, field);
        if (value && value.ciphertext) {
          const decrypted = encryptionService.decrypt(value);
          _.set(obj, field, decrypted);
        }
      }
    };
    
    if (Array.isArray(result)) {
      result.forEach(decrypt);
    } else if (result) {
      decrypt(result);
    }
  }
  
  return result;
});
📈 Monitoring & Reliability
18. Implement Comprehensive Health Checks
Problem: No health checks, can't determine system status, no graceful degradation.
Enterprise Solution:
typescript// Multi-level health check system
class HealthCheckService {
  private checks: HealthCheck[] = [
    new DatabaseHealthCheck(),
    new RedisHealthCheck(),
    new WebSocketHealthCheck(),
    new ExternalApiHealthCheck(),
    new DiskSpaceHealthCheck(),
    new MemoryHealthCheck()
  ];
  
  async getStatus(): Promise<HealthStatus> {
    const results = await Promise.allSettled(
      this.checks.map(check => check.execute())
    );
    
    const status: HealthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: {},
      metrics: await this.getMetrics()
    };
    
    results.forEach((result, index) => {
      const check = this.checks[index];
      
      if (result.status === 'fulfilled') {
        status.checks[check.name] = {
          status: result.value.healthy ? 'up' : 'down',
          responseTime: result.value.responseTime,
          message: result.value.message
        };
        
        if (!result.value.healthy) {
          status.status = check.critical ? 'unhealthy' : 'degraded';
        }
      } else {
        status.checks[check.name] = {
          status: 'down',
          error: result.reason.message
        };
        status.status = check.critical ? 'unhealthy' : 'degraded';
      }
    });
    
    return status;
  }
  
  private async getMetrics(): Promise<Metrics> {
    return {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      activeConnections: await this.getActiveConnections(),
      requestRate: await this.getRequestRate(),
      errorRate: await this.getErrorRate()
    };
  }
}

class DatabaseHealthCheck implements HealthCheck {
  name = 'database';
  critical = true;
  
  async execute(): Promise<HealthCheckResult> {
    const start = Date.now();
    
    try {
      await prisma.$queryRaw`SELECT 1`;
      
      // Check connection pool
      const poolStatus = await prisma.$queryRaw`
        SELECT count(*) as active_connections
        FROM pg_stat_activity
        WHERE datname = current_database()
      `;
      
      return {
        healthy: true,
        responseTime: Date.now() - start,
        message: `${poolStatus[0].active_connections} active connections`
      };
    } catch (err) {
      return {
        healthy: false,
        responseTime: Date.now() - start,
        message: err.message
      };
    }
  }
}

// Expose health endpoints
app.get('/health', async (req, res) => {
  const status = await healthCheckService.getStatus();
  const httpStatus = status.status === 'healthy' ? 200 : 
                     status.status === 'degraded' ? 200 : 503;
  
  res.status(httpStatus).json(status);
});

app.get('/health/live', async (req, res) => {
  // Kubernetes liveness probe - just check if process is alive
  res.status(200).json({ status: 'alive' });
});

app.get('/health/ready', async (req, res) => {
  // Kubernetes readiness probe - check if ready to serve traffic
  const dbHealthy = await healthCheckService.checkDatabase();
  const redisHealthy = await healthCheckService.checkRedis();
  
  if (dbHealthy && redisHealthy) {
    res.status(200).json({ status: 'ready' });
  } else {
    res.status(503).json({ status: 'not_ready' });
  }
});
19. Implement Circuit Breaker Pattern
Problem: Cascading failures, no protection against failing dependencies.
Enterprise Solution:
typescript// Circuit breaker for external dependencies
class CircuitBreaker {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime: number | null = null;
  private nextAttemptTime: number | null = null;
  
  constructor(
    private name: string,
    private options: CircuitBreakerOptions = {
      failureThreshold: 5,
      successThreshold: 2,
      timeout: 3000,
      resetTimeout: 60000
    }
  ) {}
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttemptTime!) {
        throw new CircuitBreakerOpenError(
          `Circuit breaker ${this.name} is OPEN`
        );
      }
      
      // Try to close circuit
      this.state = 'HALF_OPEN';
    }
    
    try {
      const result = await Promise.race([
        fn(),
        this.timeout()
      ]);
      
      this.onSuccess();
      return result as T;
    } catch (err) {
      this.onFailure();
      throw err;
    }
  }
  
  private onSuccess() {
    this.failureCount = 0;
    
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      
      if (this.successCount >= this.options.successThreshold) {
        this.state = 'CLOSED';
        this.successCount = 0;
        logger.info(`Circuit breaker ${this.name} closed`);
      }
    }
  }
  
  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.options.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttemptTime = Date.now() + this.options.resetTimeout;
      
      logger.error(`Circuit breaker ${this.name} opened`, {
        failureCount: this.failureCount,
        resetIn: this.options.resetTimeout
      });
      
      // Alert ops team
      alertService.notify({
        level: 'critical',
        message: `Circuit breaker ${this.name} opened`,
        service: 'dashboard-api'
      });
    }
  }
  
  private timeout(): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new TimeoutError(`Operation timed out after ${this.options.timeout}ms`));
      }, this.options.timeout);
    });
  }
  
  getStatus() {
    return {
      name: this.name,
      state: this.state,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime,
      nextAttemptTime: this.nextAttemptTime
    };
  }
}

// Use circuit breakers for all external calls
class RegionService {
  private dbCircuitBreaker = new CircuitBreaker('database');
  private redisCircuitBreaker = new CircuitBreaker('redis');
  private widgetApiCircuitBreaker = new CircuitBreaker('widget-api');
  
  async getRegions(layoutId: string): Promise<DashboardRegion[]> {
    // Try cache first (with circuit breaker)
    try {
      const cached = await this.redisCircuitBreaker.execute(() =>
        redis.get(`regions:${layoutId}`)
      );
      
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (err) {
      logger.warn('Redis circuit breaker open, falling back to database');
    }
    
    // Fallback to database
    const regions = await this.dbCircuitBreaker.execute(() =>
      prisma.dashboard_regions.findMany({
        where: { layout_id: layoutId, deleted_at: null }
      })
    );
    
    // Try to cache (best effort)
    try {
      await this.redisCircuitBreaker.execute(() =>
        redis.setex(`regions:${layoutId}`, 300, JSON.stringify(regions))
      );
    } catch (err) {
      // Ignore cache failures
    }
    
    return regions;
  }
}
20. Implement Proper Logging Strategy
Problem: Inconsistent logging, no structured logs, difficult to debug production issues.
Enterprise Solution:
typescript// Structured logging with Winston
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'dashboard-api',
    environment: process.env.NODE_ENV,
    version: process.env.APP_VERSION
  },
  transports: [
    // Console for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    
    // File for all logs
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 10485760, // 10MB
      maxFiles: 5
    }),
    
    // Separate file for errors
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 10485760,
      maxFiles: 5
    })
  ]
});

// Add external logging service in production
if (process.env.NODE_ENV === 'production') {
  logger.add(new DatadogTransport({
    apiKey: process.env.DATADOG_API_KEY,
    service: 'dashboard-api'
  }));
}

// Context-aware logging
class LoggerContext {
  constructor(
    private baseLogger: winston.Logger,
    private context: Record<string, any>
  ) {}
  
  private log(level: string, message: string, meta?: Record<string, any>) {
    this.baseLogger.log(level, message, {
      ...this.context,
      ...meta,
      timestamp: new Date().toISOString()
    });
  }
  
  info(message: string, meta?: Record<string, any>) {
    this.log('info', message, meta);
  }
  
  error(message: string, error: Error, meta?: Record<string, any>) {
    this.log('error', message, {
      ...meta,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    });
  }
  
  warn(message: string, meta?: Record<string, any}) {
    this.log('warn', message, meta);
  }
  
  debug(message: string, meta?: Record<string, any>) {
    this.log('debug', message, meta);
  }
}

// Request-scoped logger
app.use((req, res, next) => {
  const requestId = req.headers['x-request-id'] || uuid();
  const requestLogger = new LoggerContext(logger, {
    requestId,
    userId: req.user?.userId,
    tenantId: req.user?.tenantId,
    method: req.method,
    path: req.path,
    ip: req.ip
  });
  
  req.logger = requestLogger;
  
  // Log request
  requestLogger.info('Incoming request', {
    headers: req.headers,
    query: req.query
  });
  
  // Log response
  const start = Date.now();
  res.on('finish', () => {
    requestLogger.info('Request completed', {
      statusCode: res.statusCode,
      duration: Date.now() - start
    });
  });
  
  next();
});

// Usage in services
class RegionService {
  async createRegion(
    layoutId: string,
    data: CreateRegionDto,
    logger: LoggerContext
  ): Promise<DashboardRegion> {
    logger.info('Creating region', { layoutId, regionType: data.region_type });
    
    try {
      const region = await prisma.dashboard_regions.create({ data });
      
      logger.info('Region created successfully', {
        regionId: region.id,
        layoutId
      });
      
      return region;
    } catch (err) {
      logger.error('Failed to create regionRetryCContinuetypescript      logger.error('Failed to create region', err, {
        layoutId,
        regionType: data.region_type,
        errorCode: err.code
      });
      
      throw err;
    }
  }
}

// Log sampling for high-volume operations
class SampledLogger {
  private sampleRate: number;
  private counter = 0;
  
  constructor(private logger: winston.Logger, sampleRate: number = 0.1) {
    this.sampleRate = Math.max(0, Math.min(1, sampleRate));
  }
  
  sample(level: string, message: string, meta?: Record<string, any>) {
    this.counter++;
    
    // Always log errors and warnings
    if (level === 'error' || level === 'warn') {
      this.logger.log(level, message, meta);
      return;
    }
    
    // Sample other logs
    if (Math.random() < this.sampleRate) {
      this.logger.log(level, message, {
        ...meta,
        sampled: true,
        sampleRate: this.sampleRate
      });
    }
  }
}

// Performance logging with trace IDs
class PerformanceLogger {
  private traces: Map<string, TraceContext> = new Map();
  
  startTrace(traceId: string, operation: string): void {
    this.traces.set(traceId, {
      operation,
      startTime: Date.now(),
      spans: []
    });
  }
  
  addSpan(traceId: string, spanName: string, duration: number, metadata?: any): void {
    const trace = this.traces.get(traceId);
    if (trace) {
      trace.spans.push({
        name: spanName,
        duration,
        metadata,
        timestamp: Date.now()
      });
    }
  }
  
  endTrace(traceId: string): void {
    const trace = this.traces.get(traceId);
    if (!trace) return;
    
    const totalDuration = Date.now() - trace.startTime;
    
    logger.info('Performance trace', {
      traceId,
      operation: trace.operation,
      totalDuration,
      spans: trace.spans,
      slowQuery: totalDuration > 1000
    });
    
    // Send to APM
    if (totalDuration > 1000) {
      apmService.recordSlowOperation({
        traceId,
        operation: trace.operation,
        duration: totalDuration,
        spans: trace.spans
      });
    }
    
    this.traces.delete(traceId);
  }
}
🔄 Data Consistency & Transactions
21. Implement Distributed Transactions
Problem: No transaction management for multi-step operations, can lead to data inconsistencies.
Enterprise Solution:
typescript// Saga pattern for distributed transactions
interface SagaStep {
  execute: () => Promise<any>;
  compensate: () => Promise<void>;
  description: string;
}

class SagaOrchestrator {
  private executedSteps: Array<{ step: SagaStep; result: any }> = [];
  
  async execute(steps: SagaStep[]): Promise<any> {
    try {
      for (const step of steps) {
        logger.info(`Executing saga step: ${step.description}`);
        const result = await step.execute();
        this.executedSteps.push({ step, result });
      }
      
      return this.executedSteps[this.executedSteps.length - 1].result;
    } catch (err) {
      logger.error('Saga failed, executing compensations', err);
      await this.compensate();
      throw err;
    }
  }
  
  private async compensate(): Promise<void> {
    // Execute compensations in reverse order
    const toCompensate = [...this.executedSteps].reverse();
    
    for (const { step, result } of toCompensate) {
      try {
        logger.info(`Compensating: ${step.description}`);
        await step.compensate();
      } catch (err) {
        logger.error(`Compensation failed for: ${step.description}`, err);
        // Continue with other compensations even if one fails
      }
    }
  }
}

// Example: Import layout saga
class ImportLayoutSaga {
  async execute(layoutData: ImportedLayout, userId: string): Promise<DashboardLayout> {
    const saga = new SagaOrchestrator();
    
    return await saga.execute([
      // Step 1: Create layout
      {
        description: 'Create layout',
        execute: async () => {
          const layout = await prisma.dashboard_layouts.create({
            data: {
              name: layoutData.name,
              user_id: userId,
              tenant_id: layoutData.tenantId
            }
          });
          return layout;
        },
        compensate: async () => {
          const layout = this.getStepResult(0);
          await prisma.dashboard_layouts.delete({
            where: { id: layout.id }
          });
        }
      },
      
      // Step 2: Create regions
      {
        description: 'Create regions',
        execute: async () => {
          const layout = this.getStepResult(0);
          const regions = await Promise.all(
            layoutData.regions.map(r =>
              prisma.dashboard_regions.create({
                data: {
                  ...r,
                  layout_id: layout.id,
                  user_id: userId
                }
              })
            )
          );
          return regions;
        },
        compensate: async () => {
          const regions = this.getStepResult(1);
          await prisma.dashboard_regions.deleteMany({
            where: {
              id: { in: regions.map(r => r.id) }
            }
          });
        }
      },
      
      // Step 3: Create ACLs
      {
        description: 'Create ACLs',
        execute: async () => {
          const regions = this.getStepResult(1);
          const acls = await Promise.all(
            regions.flatMap(region =>
              layoutData.sharedWith?.map(share =>
                prisma.dashboard_region_acls.create({
                  data: {
                    region_id: region.id,
                    target_type: share.type,
                    target_id: share.id,
                    permissions: share.permissions
                  }
                })
              ) || []
            )
          );
          return acls;
        },
        compensate: async () => {
          const regions = this.getStepResult(1);
          await prisma.dashboard_region_acls.deleteMany({
            where: {
              region_id: { in: regions.map(r => r.id) }
            }
          });
        }
      },
      
      // Step 4: Invalidate cache
      {
        description: 'Invalidate cache',
        execute: async () => {
          const layout = this.getStepResult(0);
          await cacheService.invalidate(`layout:${layout.id}`);
          return true;
        },
        compensate: async () => {
          // No compensation needed for cache invalidation
        }
      }
    ]);
  }
}

// Database-level transactions for atomic operations
class RegionTransactionService {
  async moveRegionAtomic(
    regionId: string,
    newRow: number,
    newCol: number
  ): Promise<DashboardRegion> {
    return await prisma.$transaction(async (tx) => {
      // 1. Lock the region
      const region = await tx.dashboard_regions.findUnique({
        where: { id: regionId },
        // Lock for update
        ...{ lock: 'UPDATE' }
      });
      
      if (!region) {
        throw new Error('Region not found');
      }
      
      // 2. Check for overlaps with new position
      const overlapping = await tx.dashboard_regions.findFirst({
        where: {
          layout_id: region.layout_id,
          deleted_at: null,
          id: { not: regionId },
          // Check spatial overlap
          grid_row: { lt: newRow + region.row_span },
          grid_col: { lt: newCol + region.col_span },
          AND: [
            { grid_row: { plus: { row_span: {} } }, gte: newRow },
            { grid_col: { plus: { col_span: {} } }, gte: newCol }
          ]
        }
      });
      
      if (overlapping) {
        throw new Error('Position overlaps with existing region');
      }
      
      // 3. Update region position
      const updated = await tx.dashboard_regions.update({
        where: { id: regionId },
        data: {
          grid_row: newRow,
          grid_col: newCol,
          version: { increment: 1 }
        }
      });
      
      // 4. Create audit log
      await tx.dashboard_audit_logs.create({
        data: {
          entity_type: 'dashboard_region',
          entity_id: regionId,
          action: 'update',
          changes: {
            grid_row: { from: region.grid_row, to: newRow },
            grid_col: { from: region.grid_col, to: newCol }
          },
          user_id: getCurrentUserId()
        }
      });
      
      return updated;
    }, {
      isolationLevel: 'Serializable', // Highest isolation level
      timeout: 5000, // 5 second timeout
      maxWait: 2000 // Max wait for lock
    });
  }
}

// Idempotency keys for API operations
class IdempotencyService {
  async processRequest<T>(
    idempotencyKey: string,
    operation: () => Promise<T>
  ): Promise<T> {
    // Check if we've already processed this request
    const cached = await redis.get(`idempotency:${idempotencyKey}`);
    if (cached) {
      logger.info('Returning cached result for idempotent request', {
        idempotencyKey
      });
      return JSON.parse(cached);
    }
    
    // Execute operation
    const result = await operation();
    
    // Cache result for 24 hours
    await redis.setex(
      `idempotency:${idempotencyKey}`,
      86400,
      JSON.stringify(result)
    );
    
    return result;
  }
}

// Use in controller
class RegionController {
  async createRegion(req: Request, res: Response) {
    const idempotencyKey = req.headers['idempotency-key'] as string;
    
    if (!idempotencyKey) {
      return res.status(400).json({
        error: 'Idempotency-Key header is required'
      });
    }
    
    const region = await idempotencyService.processRequest(
      idempotencyKey,
      () => regionService.create(req.body)
    );
    
    res.status(201).json(region);
  }
}
🎨 Frontend Architecture Improvements
22. Implement Micro-Frontend Architecture
Problem: Monolithic frontend, difficult to scale teams, deploy independently.
Enterprise Solution:
typescript// Module Federation configuration (Webpack 5)
// webpack.config.js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'dashboard',
      filename: 'remoteEntry.js',
      exposes: {
        './RegionDashboard': './src/routes/dashboard/RegionDashboard',
        './RegionGrid': './src/components/dashboard/regions/RegionGrid',
        './useRegionLayout': './src/hooks/useRegionLayout'
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
        '@tanstack/react-query': { singleton: true }
      }
    })
  ]
};

// Widget micro-frontend loader
class WidgetLoader {
  private cache: Map<string, any> = new Map();
  
  async loadWidget(widgetUrl: string): Promise<React.ComponentType> {
    if (this.cache.has(widgetUrl)) {
      return this.cache.get(widgetUrl);
    }
    
    try {
      // Dynamically import remote module
      const container = await import(/* webpackIgnore: true */ widgetUrl);
      
      // Initialize the container
      await container.init(__webpack_share_scopes__.default);
      
      // Get the widget component
      const factory = await container.get('./Widget');
      const Widget = factory();
      
      this.cache.set(widgetUrl, Widget);
      return Widget;
    } catch (err) {
      logger.error('Failed to load widget', err, { widgetUrl });
      
      // Return fallback component
      return () => (
        <div className="error-widget">
          Failed to load widget. <button onClick={() => this.retry(widgetUrl)}>Retry</button>
        </div>
      );
    }
  }
  
  preload(widgetUrls: string[]): void {
    // Preload widgets in background
    widgetUrls.forEach(url => {
      this.loadWidget(url).catch(err => {
        logger.warn('Failed to preload widget', { url, error: err.message });
      });
    });
  }
}

// Lazy load regions with suspense
const LazyRegion = React.lazy(() => import('./RegionContainer'));

const RegionWithSuspense: React.FC<RegionProps> = (props) => {
  return (
    <ErrorBoundary fallback={<RegionErrorFallback />}>
      <Suspense fallback={<RegionSkeleton />}>
        <LazyRegion {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};
23. Implement Progressive Web App (PWA)
Problem: No offline support, can't install as app, poor mobile experience.
Enterprise Solution:
typescript// Service Worker for offline support
// sw.js
const CACHE_NAME = 'dashboard-v1';
const RUNTIME_CACHE = 'dashboard-runtime';

const PRECACHE_URLS = [
  '/',
  '/dashboard',
  '/static/css/main.css',
  '/static/js/main.js',
  '/manifest.json'
];

// Install event - precache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first, falling back to cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // API requests - network first with cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache successful responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Network failed, try cache
          return caches.match(request).then((cached) => {
            if (cached) {
              return cached;
            }
            // Return offline page
            return caches.match('/offline.html');
          });
        })
    );
    return;
  }
  
  // Static assets - cache first
  event.respondWith(
    caches.match(request).then((cached) => {
      return cached || fetch(request);
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-regions') {
    event.waitUntil(syncPendingChanges());
  }
});

async function syncPendingChanges() {
  const db = await openDB('dashboard-offline', 1);
  const pending = await db.getAll('pending-changes');
  
  for (const change of pending) {
    try {
      await fetch('/api/dashboard/regions', {
        method: change.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(change.data)
      });
      
      // Remove from pending queue
      await db.delete('pending-changes', change.id);
    } catch (err) {
      // Will retry on next sync
      console.error('Failed to sync change', err);
    }
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    data: {
      url: data.url
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});

// Manifest.json
{
  "name": "Dashboard Regions",
  "short_name": "Dashboard",
  "description": "Enterprise Dashboard Management",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#6366f1",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "shortcuts": [
    {
      "name": "Add Region",
      "short_name": "Add",
      "description": "Add a new region to dashboard",
      "url": "/dashboard?action=add",
      "icons": [{ "src": "/add-icon.png", "sizes": "96x96" }]
    }
  ]
}

// Offline support in React
const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Trigger sync
      if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.sync.register('sync-regions');
        });
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const queueChange = async (change: PendingChange) => {
    const db = await openDB('dashboard-offline', 1);
    await db.add('pending-changes', {
      ...change,
      id: Date.now(),
      timestamp: new Date().toISOString()
    });
    
    setPendingChanges((prev) => [...prev, change]);
  };
  
  return { isOnline, pendingChanges, queueChange };
};
24. Implement Advanced State Management
Problem: useState/useContext doesn't scale, prop drilling, performance issues.
Enterprise Solution:
typescript// Zustand store with middleware
import create from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface DashboardStore {
  // State
  layouts: Map<string, DashboardLayout>;
  regions: Map<string, DashboardRegion>;
  selectedRegionId: string | null;
  filters: RegionFilters;
  loading: Set<string>;
  errors: Map<string, Error>;
  
  // Actions
  setLayout: (layoutId: string, layout: DashboardLayout) => void;
  setRegion: (regionId: string, region: DashboardRegion) => void;
  updateRegion: (regionId: string, updates: Partial<DashboardRegion>) => void;
  removeRegion: (regionId: string) => void;
  selectRegion: (regionId: string | null) => void;
  setFilters: (filters: Partial<RegionFilters>) => void;
  setLoading: (key: string, loading: boolean) => void;
  setError: (key: string, error: Error | null) => void;
  
  // Selectors
  getRegionsByLayout: (layoutId: string) => DashboardRegion[];
  getFilteredRegions: (layoutId: string) => DashboardRegion[];
  getRegion: (regionId: string) => DashboardRegion | undefined;
}

export const useDashboardStore = create<DashboardStore>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          // Initial state
          layouts: new Map(),
          regions: new Map(),
          selectedRegionId: null,
          filters: {},
          loading: new Set(),
          errors: new Map(),
          
          // Actions
          setLayout: (layoutId, layout) =>
            set((state) => {
              state.layouts.set(layoutId, layout);
            }),
          
          setRegion: (regionId, region) =>
            set((state) => {
              state.regions.set(regionId, region);
            }),
          
          updateRegion: (regionId, updates) =>
            set((state) => {
              const region = state.regions.get(regionId);
              if (region) {
                state.regions.set(regionId, { ...region, ...updates });
              }
            }),
          
          removeRegion: (regionId) =>
            set((state) => {
              state.regions.delete(regionId);
              if (state.selectedRegionId === regionId) {
                state.selectedRegionId = null;
              }
            }),
          
          selectRegion: (regionId) =>
            set((state) => {
              state.selectedRegionId = regionId;
            }),
          
          setFilters: (filters) =>
            set((state) => {
              state.filters = { ...state.filters, ...filters };
            }),
          
          setLoading: (key, loading) =>
            set((state) => {
              if (loading) {
                state.loading.add(key);
              } else {
                state.loading.delete(key);
              }
            }),
          
          setError: (key, error) =>
            set((state) => {
              if (error) {
                state.errors.set(key, error);
              } else {
                state.errors.delete(key);
              }
            }),
          
          // Selectors
          getRegionsByLayout: (layoutId) => {
            const regions = Array.from(get().regions.values());
            return regions.filter((r) => r.layout_id === layoutId);
          },
          
          getFilteredRegions: (layoutId) => {
            const regions = get().getRegionsByLayout(layoutId);
            const filters = get().filters;
            
            return regions.filter((region) => {
              if (filters.type && region.region_type !== filters.type) {
                return false;
              }
              if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const titleMatch = region.config?.title?.toLowerCase().includes(searchLower);
                const typeMatch = region.region_type.toLowerCase().includes(searchLower);
                if (!titleMatch && !typeMatch) return false;
              }
              if (filters.locked !== undefined && region.is_locked !== filters.locked) {
                return false;
              }
              return true;
            });
          },
          
          getRegion: (regionId) => {
            return get().regions.get(regionId);
          }
        }))
      ),
      {
        name: 'dashboard-storage',
        partialize: (state) => ({
          // Only persist certain fields
          filters: state.filters,
          selectedRegionId: state.selectedRegionId
        })
      }
    ),
    { name: 'Dashboard Store' }
  )
);

// Selector hooks for performance
export const useSelectedRegion = () =>
  useDashboardStore(
    useCallback((state) => {
      const id = state.selectedRegionId;
      return id ? state.getRegion(id) : null;
    }, [])
  );

export const useRegionsByLayout = (layoutId: string) =>
  useDashboardStore(
    useCallback(
      (state) => state.getFilteredRegions(layoutId),
      [layoutId]
    )
  );

// Subscribe to specific state changes
useDashboardStore.subscribe(
  (state) => state.regions,
  (regions) => {
    // React to region changes
    console.log('Regions updated:', regions.size);
  },
  { equalityFn: shallow }
);
📦 Deployment & Infrastructure
25. Implement Blue-Green Deployment
Problem: Risky deployments, downtime during updates, difficult rollbacks.
Enterprise Solution:
yaml# Kubernetes deployment configuration
apiVersion: apps/v1
kind: Deployment
metadata:
  name: dashboard-api-blue
  labels:
    app: dashboard-api
    version: blue
    environment: production
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: dashboard-api
      version: blue
  template:
    metadata:
      labels:
        app: dashboard-api
        version: blue
    spec:
      containers:
      - name: dashboard-api
        image: dashboard-api:v1.2.3
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-credentials
              key: url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: redis-credentials
              key: url
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health/live
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        volumeMounts:
        - name: config
          mountPath: /app/config
          readOnly: true
      volumes:
      - name: config
        configMap:
          name: dashboard-config

---
apiVersion: v1
kind: Service
metadata:
  name: dashboard-api
spec:
  selector:
    app: dashboard-api
    version: blue  # Switch to 'green' for blue-green deployment
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: ClusterIP

---
# HorizontalPodAutoscaler for automatic scaling
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: dashboard-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: dashboard-api-blue
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
      - type: Percent
        value: 100
        periodSeconds: 15
      - type: Pods
        value: 4
        periodSeconds: 15
      selectPolicy: Max
typescript// Deployment automation script
class DeploymentOrchestrator {
  async deployBlueGreen(newVersion: string): Promise<void> {
    const currentColor = await this.getCurrentColor();
    const newColor = currentColor === 'blue' ? 'green' : 'blue';
    
    logger.info(`Starting blue-green deployment`, {
      currentColor,
      newColor,
      version: newVersion
    });
    
    try {
      // 1. Deploy new version to inactive environment
      await this.deployToEnvironment(newColor, newVersion);
      
      // 2. Wait for new pods to be ready
      await this.waitForHealthy(newColor);
      
      // 3. Run smoke tests
      const smokeTestsPassed = await this.runSmokeTests(newColor);
      if (!smokeTestsPassed) {
        throw new Error('Smoke tests failed');
      }
      
      // 4. Gradually shift traffic (canary)
      await this.canaryDeployment(currentColor, newColor, [10, 25, 50, 75, 100]);
      
      // 5. Monitor for errors
      const errorRate = await this.monitorErrorRate(newColor, 300); // 5 minutes
      if (errorRate > 0.01) { // 1% error threshold
        throw new Error(`Error rate too high: ${errorRate}`);
      }
      
      // 6. Switch service to new environment
      await this.switchService(newColor);
      
      // 7. Keep old environment running for quick rollback
      logger.info(`Deployment successful. Old environment (${currentColor}) kept running for 1 hour`);
      
      setTimeout(async () => {
        await this.scaleDown(currentColor);
        logger.info(`Scaled down old environment: ${currentColor}`);
      }, 3600000); // 1 hour
      
    } catch (err) {
      logger.error('Deployment failed, rolling back', err);
      await this.rollback(currentColor);
      throw err;
    }
  }
  
  private async canaryDeployment(
    oldColor: string,
    newColor: string,
    stages: number[]
  ): Promise<void> {
    for (const percentage of stages) {
      logger.info(`Shifting ${percentage}% traffic to ${newColor}`);
      
      awaitRetryCContinuetypescript      await this.updateTrafficSplit(oldColor, newColor, percentage);
      
      // Wait and monitor
      await this.sleep(60000); // 1 minute per stage
      
      const metrics = await this.getMetrics(newColor);
      if (metrics.errorRate > 0.01 || metrics.p95Latency > 2000) {
        throw new Error(`Canary stage ${percentage}% failed metrics check`);
      }
    }
  }
  
  private async updateTrafficSplit(
    oldColor: string,
    newColor: string,
    newPercentage: number
  ): Promise<void> {
    const oldPercentage = 100 - newPercentage;
    
    await k8s.networking.v1.Ingress.patch({
      metadata: { name: 'dashboard-api-ingress' },
      spec: {
        rules: [{
          http: {
            paths: [{
              path: '/',
              pathType: 'Prefix',
              backend: {
                service: {
                  name: 'dashboard-api',
                  port: { number: 80 }
                }
              }
            }]
          }
        }],
        annotations: {
          'nginx.ingress.kubernetes.io/canary': 'true',
          'nginx.ingress.kubernetes.io/canary-weight': newPercentage.toString()
        }
      }
    });
  }
  
  private async rollback(safeColor: string): Promise<void> {
    logger.info(`Rolling back to ${safeColor}`);
    
    // Immediately switch all traffic back
    await this.switchService(safeColor);
    
    // Alert team
    await alertService.notify({
      level: 'critical',
      title: 'Deployment Rollback',
      message: `Deployment failed, rolled back to ${safeColor}`,
      service: 'dashboard-api'
    });
  }
}
26. Implement Comprehensive Monitoring Dashboard
Enterprise Solution:
typescript// Monitoring metrics collection
import { register, Counter, Histogram, Gauge } from 'prom-client';

class MetricsCollector {
  // Request metrics
  private httpRequestDuration = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 5, 10]
  });
  
  private httpRequestTotal = new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code']
  });
  
  // Business metrics
  private regionsTotal = new Gauge({
    name: 'dashboard_regions_total',
    help: 'Total number of active regions',
    labelNames: ['tenant_id', 'region_type']
  });
  
  private regionOperations = new Counter({
    name: 'dashboard_region_operations_total',
    help: 'Total number of region operations',
    labelNames: ['operation', 'status']
  });
  
  private activeUsers = new Gauge({
    name: 'dashboard_active_users',
    help: 'Number of currently active users',
    labelNames: ['tenant_id']
  });
  
  private websocketConnections = new Gauge({
    name: 'dashboard_websocket_connections',
    help: 'Number of active WebSocket connections'
  });
  
  // Database metrics
  private dbQueryDuration = new Histogram({
    name: 'db_query_duration_seconds',
    help: 'Duration of database queries',
    labelNames: ['operation', 'table'],
    buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1]
  });
  
  private dbPoolSize = new Gauge({
    name: 'db_pool_connections',
    help: 'Number of database pool connections',
    labelNames: ['state'] // 'active', 'idle', 'waiting'
  });
  
  // Cache metrics
  private cacheHits = new Counter({
    name: 'cache_hits_total',
    help: 'Total number of cache hits',
    labelNames: ['cache_name']
  });
  
  private cacheMisses = new Counter({
    name: 'cache_misses_total',
    help: 'Total number of cache misses',
    labelNames: ['cache_name']
  });
  
  // Error metrics
  private errorRate = new Counter({
    name: 'errors_total',
    help: 'Total number of errors',
    labelNames: ['type', 'severity']
  });
  
  // Record HTTP request
  recordHttpRequest(method: string, route: string, statusCode: number, duration: number) {
    this.httpRequestDuration.labels(method, route, statusCode.toString()).observe(duration);
    this.httpRequestTotal.labels(method, route, statusCode.toString()).inc();
  }
  
  // Record business metric
  recordRegionOperation(operation: string, status: 'success' | 'failure') {
    this.regionOperations.labels(operation, status).inc();
  }
  
  // Update gauges periodically
  async updateMetrics() {
    // Update region counts
    const regionCounts = await this.getRegionCounts();
    regionCounts.forEach(({ tenantId, regionType, count }) => {
      this.regionsTotal.labels(tenantId, regionType).set(count);
    });
    
    // Update active users
    const activeCounts = await this.getActiveUserCounts();
    activeCounts.forEach(({ tenantId, count }) => {
      this.activeUsers.labels(tenantId).set(count);
    });
    
    // Update DB pool stats
    const poolStats = await prisma.$queryRaw`
      SELECT state, count(*) as count
      FROM pg_stat_activity
      WHERE datname = current_database()
      GROUP BY state
    `;
    poolStats.forEach(({ state, count }) => {
      this.dbPoolSize.labels(state).set(count);
    });
  }
  
  // Expose metrics endpoint
  getMetrics() {
    return register.metrics();
  }
}

// Metrics middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    metricsCollector.recordHttpRequest(
      req.method,
      req.route?.path || req.path,
      res.statusCode,
      duration
    );
  });
  
  next();
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await metricsCollector.getMetrics());
});

// Grafana dashboard configuration (JSON)
const dashboardConfig = {
  "dashboard": {
    "title": "Dashboard Regions - Overview",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [{
          "expr": "rate(http_requests_total[5m])",
          "legendFormat": "{{method}} {{route}}"
        }],
        "type": "graph"
      },
      {
        "title": "Response Time (p95)",
        "targets": [{
          "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
          "legendFormat": "{{route}}"
        }],
        "type": "graph"
      },
      {
        "title": "Error Rate",
        "targets": [{
          "expr": "rate(errors_total[5m])",
          "legendFormat": "{{type}}"
        }],
        "type": "graph",
        "alert": {
          "conditions": [{
            "evaluator": { "type": "gt", "params": [0.01] },
            "operator": { "type": "and" },
            "query": { "params": ["A", "5m", "now"] },
            "reducer": { "type": "avg" }
          }],
          "executionErrorState": "alerting",
          "frequency": "60s",
          "handler": 1,
          "name": "High Error Rate",
          "noDataState": "no_data",
          "notifications": [{ "uid": "slack-notifications" }]
        }
      },
      {
        "title": "Active Regions by Type",
        "targets": [{
          "expr": "dashboard_regions_total",
          "legendFormat": "{{region_type}}"
        }],
        "type": "piechart"
      },
      {
        "title": "Database Query Performance",
        "targets": [{
          "expr": "histogram_quantile(0.95, rate(db_query_duration_seconds_bucket[5m]))",
          "legendFormat": "{{operation}} - {{table}}"
        }],
        "type": "graph"
      },
      {
        "title": "Cache Hit Rate",
        "targets": [{
          "expr": "rate(cache_hits_total[5m]) / (rate(cache_hits_total[5m]) + rate(cache_misses_total[5m]))",
          "legendFormat": "{{cache_name}}"
        }],
        "type": "gauge"
      },
      {
        "title": "Active WebSocket Connections",
        "targets": [{
          "expr": "dashboard_websocket_connections"
        }],
        "type": "stat"
      },
      {
        "title": "Active Users",
        "targets": [{
          "expr": "dashboard_active_users",
          "legendFormat": "{{tenant_id}}"
        }],
        "type": "graph"
      }
    ]
  }
};
🧪 Testing Strategy
27. Comprehensive Testing Suite
Problem: Inadequate testing, no integration tests, manual QA bottleneck.
Enterprise Solution:
typescript// Unit Tests
describe('useRegionLayout', () => {
  it('should add region optimistically', async () => {
    const { result, waitForNextUpdate } = renderHook(() => 
      useRegionLayout({ layoutId: 'test-layout' })
    );
    
    await waitForNextUpdate();
    
    const initialCount = result.current.regions.length;
    
    act(() => {
      result.current.addRegion(RegionType.SCHEDULING, { row: 0, col: 0 });
    });
    
    // Should immediately update
    expect(result.current.regions.length).toBe(initialCount + 1);
    
    await waitForNextUpdate();
    
    // Should persist after API call
    expect(result.current.regions.length).toBe(initialCount + 1);
  });
  
  it('should rollback on API failure', async () => {
    const mockError = new Error('API Error');
    jest.spyOn(enhancedApi.dashboardLayouts, 'createRegion')
      .mockRejectedValueOnce(mockError);
    
    const { result, waitForNextUpdate } = renderHook(() => 
      useRegionLayout({ layoutId: 'test-layout' })
    );
    
    await waitForNextUpdate();
    
    const initialCount = result.current.regions.length;
    
    await act(async () => {
      try {
        await result.current.addRegion(RegionType.SCHEDULING);
      } catch (err) {
        // Expected to throw
      }
    });
    
    // Should rollback
    expect(result.current.regions.length).toBe(initialCount);
  });
});

// Integration Tests
describe('Region CRUD Integration', () => {
  let testDb: PrismaClient;
  let testServer: Express;
  
  beforeAll(async () => {
    testDb = new PrismaClient({ datasources: { db: { url: TEST_DATABASE_URL } } });
    await testDb.$connect();
    
    testServer = createTestServer();
  });
  
  afterAll(async () => {
    await testDb.$disconnect();
  });
  
  beforeEach(async () => {
    await testDb.dashboard_regions.deleteMany({});
    await testDb.dashboard_layouts.deleteMany({});
  });
  
  it('should create, update, and delete region', async () => {
    // Create layout
    const layout = await testDb.dashboard_layouts.create({
      data: {
        name: 'Test Layout',
        user_id: 'test-user',
        tenant_id: 'test-tenant'
      }
    });
    
    // Create region
    const createResponse = await request(testServer)
      .post(`/api/dashboard/layouts/${layout.id}/regions`)
      .send({
        region_type: 'scheduling',
        grid_row: 0,
        grid_col: 0,
        row_span: 4,
        col_span: 6
      })
      .expect(201);
    
    const regionId = createResponse.body.id;
    
    // Update region
    await request(testServer)
      .put(`/api/dashboard/layouts/${layout.id}/regions/${regionId}`)
      .send({
        grid_row: 2,
        grid_col: 3
      })
      .expect(200);
    
    // Verify update
    const updatedRegion = await testDb.dashboard_regions.findUnique({
      where: { id: regionId }
    });
    expect(updatedRegion?.grid_row).toBe(2);
    expect(updatedRegion?.grid_col).toBe(3);
    
    // Delete region
    await request(testServer)
      .delete(`/api/dashboard/layouts/${layout.id}/regions/${regionId}`)
      .expect(204);
    
    // Verify soft delete
    const deletedRegion = await testDb.dashboard_regions.findUnique({
      where: { id: regionId }
    });
    expect(deletedRegion?.deleted_at).not.toBeNull();
  });
  
  it('should prevent overlapping regions', async () => {
    const layout = await testDb.dashboard_layouts.create({
      data: {
        name: 'Test Layout',
        user_id: 'test-user',
        tenant_id: 'test-tenant'
      }
    });
    
    // Create first region
    await testDb.dashboard_regions.create({
      data: {
        layout_id: layout.id,
        user_id: 'test-user',
        tenant_id: 'test-tenant',
        region_type: 'scheduling',
        grid_row: 0,
        grid_col: 0,
        row_span: 4,
        col_span: 6
      }
    });
    
    // Try to create overlapping region
    await request(testServer)
      .post(`/api/dashboard/layouts/${layout.id}/regions`)
      .send({
        region_type: 'reports',
        grid_row: 2,
        grid_col: 3,
        row_span: 4,
        col_span: 6
      })
      .expect(409); // Conflict
  });
});

// E2E Tests with Playwright
describe('Dashboard E2E', () => {
  let browser: Browser;
  let page: Page;
  
  beforeAll(async () => {
    browser = await chromium.launch();
  });
  
  afterAll(async () => {
    await browser.close();
  });
  
  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:3000/dashboard');
  });
  
  afterEach(async () => {
    await page.close();
  });
  
  it('should add region via UI', async () => {
    // Open settings panel
    await page.click('[data-testid="dashboard-fab"]');
    
    // Click add region
    await page.click('[data-testid="add-region-button"]');
    
    // Select region type
    await page.click('[data-testid="region-type-scheduling"]');
    
    // Wait for region to appear
    await page.waitForSelector('[data-testid="region-scheduling"]');
    
    // Verify region exists
    const regions = await page.$$('[data-testid^="region-"]');
    expect(regions.length).toBeGreaterThan(0);
  });
  
  it('should drag and drop region', async () => {
    // Create a region first
    await addRegionViaUI(page, 'scheduling');
    
    const region = await page.$('[data-testid="region-scheduling"]');
    const regionBox = await region!.boundingBox();
    
    // Drag region
    await page.mouse.move(regionBox!.x + 10, regionBox!.y + 10);
    await page.mouse.down();
    await page.mouse.move(regionBox!.x + 200, regionBox!.y + 200);
    await page.mouse.up();
    
    // Wait for position update
    await page.waitForTimeout(1000);
    
    // Verify new position
    const newBox = await region!.boundingBox();
    expect(newBox!.x).toBeGreaterThan(regionBox!.x);
  });
  
  it('should handle concurrent edits gracefully', async () => {
    // Open dashboard in two tabs
    const page2 = await browser.newPage();
    await page2.goto('http://localhost:3000/dashboard');
    
    // Add region in first tab
    await addRegionViaUI(page, 'scheduling');
    
    // Wait for sync
    await page2.waitForSelector('[data-testid="region-scheduling"]');
    
    // Both tabs should show the region
    expect(await page.$('[data-testid="region-scheduling"]')).toBeTruthy();
    expect(await page2.$('[data-testid="region-scheduling"]')).toBeTruthy();
    
    await page2.close();
  });
});

// Load Tests with Artillery
// artillery.yml
module.exports = {
  config: {
    target: 'http://localhost:3000',
    phases: [
      { duration: 60, arrivalRate: 10, name: 'Warm up' },
      { duration: 120, arrivalRate: 50, name: 'Ramp up' },
      { duration: 300, arrivalRate: 100, name: 'Sustained load' },
      { duration: 60, arrivalRate: 200, name: 'Spike' }
    ],
    plugins: {
      metrics: {
        statsd: {
          host: 'localhost',
          port: 8125,
          prefix: 'artillery'
        }
      }
    }
  },
  scenarios: [
    {
      name: 'Dashboard Usage',
      flow: [
        { get: { url: '/api/dashboard/layouts/default' } },
        { think: 2 },
        { 
          post: { 
            url: '/api/dashboard/layouts/{{ layoutId }}/regions',
            json: {
              region_type: 'scheduling',
              grid_row: 0,
              grid_col: 0,
              row_span: 4,
              col_span: 6
            }
          }
        },
        { think: 5 },
        {
          put: {
            url: '/api/dashboard/layouts/{{ layoutId }}/regions/{{ regionId }}',
            json: {
              grid_row: 2,
              grid_col: 3
            }
          }
        },
        { think: 10 },
        { get: { url: '/api/dashboard/layouts/{{ layoutId }}/regions' } }
      ]
    }
  ]
};

// Performance regression tests
describe('Performance Benchmarks', () => {
  it('should render 100 regions in under 1 second', async () => {
    const regions = Array.from({ length: 100 }, (_, i) => ({
      id: `region-${i}`,
      region_type: 'scheduling',
      grid_row: Math.floor(i / 12),
      grid_col: i % 12,
      row_span: 2,
      col_span: 2
    }));
    
    const start = performance.now();
    
    render(<RegionGrid regions={regions} />);
    
    const end = performance.now();
    const duration = end - start;
    
    expect(duration).toBeLessThan(1000);
  });
  
  it('should handle 1000 region updates efficiently', async () => {
    const store = useDashboardStore.getState();
    
    const start = performance.now();
    
    for (let i = 0; i < 1000; i++) {
      store.updateRegion(`region-${i % 100}`, { grid_row: Math.random() * 10 });
    }
    
    const end = performance.now();
    const duration = end - start;
    
    expect(duration).toBeLessThan(100); // Should be very fast with immer
  });
});
📋 Final Critical Recommendations
Summary of Must-Fix Issues (Priority Order)

State Management - Replace current approach with proper state management solution (Zustand/Redux) with conflict resolution
Security - Implement comprehensive input validation, XSS protection, and proper authentication/authorization
Performance - Add virtualization for grid, implement proper caching, add request coalescing
Error Handling - Comprehensive error boundaries, circuit breakers, retry logic
Monitoring - Full observability stack with metrics, traces, and structured logging
Testing - Comprehensive test suite (unit, integration, E2E, load tests)
Data Consistency - Implement event sourcing or proper transaction management
Scalability - Add Redis pub/sub for WebSockets, implement rate limiting, optimize database queries

Architecture Decision Records (ADRs) Needed
Create ADRs for:

State management approach
Caching strategy
Authentication/authorization system
WebSocket scaling approach
Deployment strategy
Monitoring and alerting
Error handling and recovery
Multi-tenancy implementation

Documentation Gaps
Add:

API documentation (OpenAPI/Swagger)
System architecture diagrams
Runbooks for common incidents
Disaster recovery procedures
SLA/SLO definitions
Capacity planning guidelines

This region dashboard has a solid foundation but needs significant work to be enterprise-ready. The current implementation would struggle under production load, has security vulnerabilities, and lacks the robustness expected in enterprise software. Focus on the priority issues above first.RetryCWhat about the UI region dashboard design, functionality etc.🎨 Critical UI/UX Review: Region Dashboard
Let me provide a comprehensive critical analysis of the UI/UX design, functionality, and user experience aspects.
🚨 Critical UI/UX Issues
1. Grid System is Fundamentally Flawed for Enterprise Use
Current Problem:
typescript// Fixed 12-column grid with 100px rows
const colsMap = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };
const rowHeight = 100;
Why This Fails:

Rigid Grid: 12 columns forces awkward layouts for certain use cases
Fixed Row Height: 100px is arbitrary - some content needs 50px, others need 500px
Poor Responsive Behavior: Dropping to 2 columns on mobile makes everything unusable
No Adaptive Layouts: Grid doesn't adapt to content - you're forcing content to fit the grid

Enterprise Solution:
typescript// Implement flexible grid with adaptive sizing
interface GridConfig {
  mode: 'fixed' | 'adaptive' | 'freeform';
  minCellWidth: number;
  minCellHeight: number;
  maxColumns: number;
  gutterSize: number;
  adaptiveBreakpoints: {
    [breakpoint: string]: {
      columns: number;
      cellHeight: number;
    };
  };
}

const AdaptiveGrid: React.FC<AdaptiveGridProps> = ({ regions, config }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gridLayout, setGridLayout] = useState<CalculatedLayout>();
  
  // Calculate optimal grid based on content and container size
  const calculateAdaptiveGrid = useCallback(() => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.offsetWidth;
    const optimalColumns = Math.floor(containerWidth / config.minCellWidth);
    
    // Analyze region content to determine optimal heights
    const layoutMap = regions.map(region => {
      const contentHeight = estimateContentHeight(region);
      const requiredCells = Math.ceil(contentHeight / config.minCellHeight);
      
      return {
        ...region,
        calculatedHeight: requiredCells * config.minCellHeight,
        calculatedWidth: region.col_span * (containerWidth / optimalColumns)
      };
    });
    
    setGridLayout(layoutMap);
  }, [regions, config]);
  
  // Implement masonry layout for better space utilization
  const useMasonryLayout = config.mode === 'adaptive';
  
  return useMasonryLayout ? (
    <MasonryGrid regions={regions} config={config} />
  ) : (
    <TraditionalGrid regions={regions} config={config} />
  );
};

// Masonry layout for better visual flow
const MasonryGrid: React.FC = ({ regions }) => {
  return (
    <Masonry
      breakpointCols={{
        default: 4,
        1920: 4,
        1440: 3,
        1024: 2,
        768: 1
      }}
      className="masonry-grid"
      columnClassName="masonry-grid-column"
    >
      {regions.map(region => (
        <RegionCard key={region.id} region={region} />
      ))}
    </Masonry>
  );
};
2. Visual Hierarchy is Non-Existent
Current Problem:

All regions look identical
No visual indication of importance/priority
No content preview in collapsed state
Grid looks like a spreadsheet, not a dashboard

Enterprise Solution:
typescript// Implement visual hierarchy system
interface RegionVisualConfig {
  priority: 'critical' | 'high' | 'normal' | 'low';
  style: 'card' | 'panel' | 'widget' | 'hero';
  elevation: 0 | 1 | 2 | 3; // Shadow depth
  accent: string; // Color for visual distinction
  showPreview: boolean;
}

const RegionCard: React.FC<{ region: DashboardRegion }> = ({ region }) => {
  const visualConfig = region.config.visual || getDefaultVisual(region);
  
  return (
    <motion.div
      className={cn(
        'region-card',
        `priority-${visualConfig.priority}`,
        `style-${visualConfig.style}`,
        `elevation-${visualConfig.elevation}`
      )}
      style={{
        '--accent-color': visualConfig.accent,
        '--card-scale': visualConfig.priority === 'critical' ? 1.02 : 1,
      }}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
    >
      {/* Visual indicator for priority */}
      {visualConfig.priority === 'critical' && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />
      )}
      
      {/* Region content */}
      <RegionHeader region={region} />
      
      {/* Content preview when collapsed */}
      {region.is_collapsed && visualConfig.showPreview && (
        <RegionPreview region={region} />
      )}
      
      {!region.is_collapsed && (
        <RegionContent region={region} />
      )}
    </motion.div>
  );
};

// Different visual styles for different use cases
const styles = {
  card: {
    padding: '1.5rem',
    borderRadius: '0.75rem',
    background: 'white',
    border: '1px solid #e5e7eb'
  },
  panel: {
    padding: '1rem',
    borderRadius: '0.5rem',
    background: '#f9fafb',
    border: 'none'
  },
  widget: {
    padding: '1rem',
    borderRadius: '1rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none'
  },
  hero: {
    padding: '2rem',
    borderRadius: '1rem',
    background: 'white',
    border: '2px solid #6366f1',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  }
};
3. Drag-and-Drop UX is Confusing and Error-Prone
Current Problems:

No visual feedback during drag
No snap guides or alignment helpers
No preview of where region will land
Can't tell if drop position is valid
Drag handle is too small
No undo for accidental moves

Enterprise Solution:
typescript// Enhanced drag-and-drop with visual feedback
const EnhancedDragRegion: React.FC = ({ region }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPreview, setDragPreview] = useState<Position | null>(null);
  const [isValidPosition, setIsValidPosition] = useState(true);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px threshold to prevent accidental drags
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
    
    // Show ghost region at current position
    setDragPreview({
      x: region.grid_col,
      y: region.grid_row
    });
    
    // Dim other regions
    document.querySelectorAll('.region-card').forEach(el => {
      if (el.id !== `region-${region.id}`) {
        el.classList.add('dimmed');
      }
    });
    
    // Show grid overlay with snap guides
    showGridOverlay();
  };
  
  const handleDragMove = (event: DragMoveEvent) => {
    const newPosition = calculateGridPosition(event.delta);
    
    // Check if position is valid (no overlaps)
    const isValid = !checkOverlap(newPosition, region, otherRegions);
    setIsValidPosition(isValid);
    
    // Update preview position
    setDragPreview(newPosition);
    
    // Show snap guides when near grid lines
    updateSnapGuides(newPosition);
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    setDragPreview(null);
    hideGridOverlay();
    
    document.querySelectorAll('.region-card').forEach(el => {
      el.classList.remove('dimmed');
    });
    
    if (isValidPosition && dragPreview) {
      // Save new position
      updateRegionPosition(region.id, dragPreview.x, dragPreview.y);
      
      // Track in undo stack
      undoStack.push({
        action: 'move',
        regionId: region.id,
        from: { x: region.grid_col, y: region.grid_row },
        to: dragPreview
      });
    } else {
      // Animate back to original position
      animateRevert(region);
      toast.warning('Cannot place region here - overlaps with existing region');
    }
  };
  
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      <div className="relative">
        {/* Actual region */}
        <SortableContext items={[region.id]}>
          <div
            className={cn(
              'region-card transition-all duration-200',
              isDragging && 'opacity-50 scale-105',
              !isValidPosition && isDragging && 'border-red-500 border-2'
            )}
          >
            {/* Large drag handle - entire header is draggable */}
            <div className="region-header cursor-move bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-t-lg">
              <div className="flex items-center gap-2">
                <GripVertical className="w-5 h-5 text-gray-400" />
                <span className="font-medium">{region.config.title}</span>
              </div>
            </div>
            
            <RegionContent region={region} />
          </div>
        </SortableContext>
        
        {/* Drag preview ghost */}
        {isDragging && dragPreview && (
          <DragOverlay>
            <div
              className={cn(
                'region-ghost border-2 border-dashed',
                isValidPosition ? 'border-green-500 bg-green-50/50' : 'border-red-500 bg-red-50/50'
              )}
              style={{
                width: region.col_span * 100,
                height: region.row_span * 100,
                transform: `translate(${dragPreview.x}px, ${dragPreview.y}px)`
              }}
            >
              <div className="flex items-center justify-center h-full">
                {isValidPosition ? (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-500" />
                )}
              </div>
            </div>
          </DragOverlay>
        )}
      </div>
    </DndContext>
  );
};

// Grid overlay showing snap guides
const GridOverlay: React.FC<{ visible: boolean }> = ({ visible }) => {
  if (!visible) return null;
  
  return (
    <div className="absolute inset-0 pointer-events-none z-40">
      {/* Vertical grid lines */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={`v-${i}`}
          className="absolute top-0 bottom-0 border-l border-dashed border-blue-300/50"
          style={{ left: `${(i / 12) * 100}%` }}
        />
      ))}
      
      {/* Horizontal grid lines */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={`h-${i}`}
          className="absolute left-0 right-0 border-t border-dashed border-blue-300/50"
          style={{ top: `${i * 100}px` }}
        />
      ))}
    </div>
  );
};

// Snap guides that appear when dragging near edges
const SnapGuide: React.FC<{ position: 'top' | 'left' | 'right' | 'bottom' }> = ({ position }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={cn(
        'absolute bg-blue-500 snap-guide',
        position === 'top' && 'left-0 right-0 h-0.5 -top-2',
        position === 'bottom' && 'left-0 right-0 h-0.5 -bottom-2',
        position === 'left' && 'top-0 bottom-0 w-0.5 -left-2',
        position === 'right' && 'top-0 bottom-0 w-0.5 -right-2'
      )}
    />
  );
};
4. Mobile Experience is Completely Broken
Current Problems:

Grid layout doesn't work on mobile
Touch gestures are unreliable
No mobile-optimized controls
Regions too small to interact with
No swipe navigation

Enterprise Solution:
typescript// Mobile-first responsive dashboard
const MobileDashboard: React.FC = ({ regions }) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('cards');
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => nextTab(),
    onSwipedRight: () => previousTab(),
    trackMouse: false
  });
  
  return (
    <div className="mobile-dashboard" {...swipeHandlers}>
      {/* Sticky header with tabs */}
      <div className="sticky top-0 z-50 bg-white border-b">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">Dashboard</h1>
          
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'cards' ? 'list' : 'cards')}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              {viewMode === 'cards' ? <List size={20} /> : <Grid size={20} />}
            </button>
            
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <Plus size={20} />
            </button>
          </div>
        </div>
        
        {/* Horizontal scrolling tabs */}
        <div className="flex overflow-x-auto no-scrollbar px-4 pb-2 gap-2">
          {['all', 'scheduling', 'analytics', 'reports'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2 rounded-full whitespace-nowrap transition-colors',
                activeTab === tab
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              )}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Region content */}
      <div className="p-4">
        {viewMode === 'cards' ? (
          <MobileCardView regions={filteredRegions} />
        ) : (
          <MobileListView regions={filteredRegions} />
        )}
      </div>
      
      {/* Bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 safe-area-bottom">
        <div className="flex justify-around">
          <button className="flex flex-col items-center gap-1">
            <Home size={24} />
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <Search size={24} />
            <span className="text-xs">Search</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <Settings size={24} />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Mobile card view with pull-to-refresh
const MobileCardView: React.FC = ({ regions }) => {
  const [refreshing, setRefreshing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const handlePullToRefresh = async () => {
    setRefreshing(true);
    await reloadRegions();
    setRefreshing(false);
  };
  
  return (
    <PullToRefresh onRefresh={handlePullToRefresh}>
      <div className="space-y-4" ref={scrollRef}>
        {regions.map(region => (
          <MobileRegionCard
            key={region.id}
            region={region}
          />
        ))}
      </div>
    </PullToRefresh>
  );
};

// Mobile-optimized region card
const MobileRegionCard: React.FC = ({ region }) => {
  const [expanded, setExpanded] = useState(false);
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setExpanded(true),
    onSwipedRight: () => setExpanded(false),
  });
  
  return (
    <motion.div
      layout
      className="bg-white rounded-xl shadow-sm border"
      {...swipeHandlers}
    >
      {/* Tap to expand/collapse */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-12 h-12 rounded-lg flex items-center justify-center',
              getRegionColorClass(region.region_type)
            )}>
              {getRegionIcon(region.region_type)}
            </div>
            
            <div>
              <h3 className="font-semibold text-lg">
                {region.config.title}
              </h3>
              <p className="text-sm text-gray-500">
                {region.region_type}
              </p>
            </div>
          </div>
          
          <ChevronDown
            className={cn(
              'transition-transform',
              expanded && 'rotate-180'
            )}
          />
        </div>
      </button>
      
      {/* Expandable content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t"
          >
            <div className="p-4">
              <RegionContent region={region} />
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-2 p-4 border-t">
              <button className="flex-1 py-2 bg-blue-500 text-white rounded-lg">
                Edit
              </button>
              <button className="p-2 border rounded-lg">
                <MoreVertical size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Touch-optimized controls
const TouchControls: React.FC = () => {
  return (
    <div className="fixed bottom-20 right-4 flex flex-col gap-2">
      {/* FAB with expanded menu */}
      <FloatingActionButton
        icon={<Plus />}
        actions={[
          { icon: <Calendar />, label: 'Add Scheduling', onClick: () => {} },
          { icon: <BarChart />, label: 'Add Analytics', onClick: () => {} },
          { icon: <FileText />, label: 'Add Reports', onClick: () => {} },
        ]}
      />
    </div>
  );
};

// Floating Action Button for mobile
const FloatingActionButton: React.FC<FABProps> = ({ icon, actions }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="relative">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 flex flex-col gap-2"
          >
            {actions.map((action, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => {
                  action.onClick();
                  setExpanded(false);
                }}
                className="flex items-center gap-2 bg-white rounded-full shadow-lg px-4 py-3 min-w-max"
              >
                {action.icon}
                <span className="text-sm font-medium">{action.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setExpanded(!expanded)}
        className={cn(
          'w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors',
          expanded ? 'bg-red-500' : 'bg-blue-500',
          'text-white'
        )}
      >
        <motion.div
          animate={{ rotate: expanded ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>
      </motion.button>
    </div>
  );
};
5. No Empty States or Onboarding
Current Problems:

Blank dashboard for new users is confusing
No guidance on how to add regions
No templates or quick start options
No contextual help

Enterprise Solution:
typescript// Comprehensive onboarding system
const DashboardOnboarding: React.FC = () => {
  const [step, setStep] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const { regions } = useRegionLayout();
  
  // Show onboarding for new users
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('dashboard_onboarding_complete');
    if (!hasSeenOnboarding && regions.length === 0) {
      setShowOnboarding(true);
    }
  }, []);
  
  const onboardingSteps = [
    {
      title: 'Welcome to Your Dashboard',
      description: 'Let\'s create your personalized workspace',
      illustration: <WelcomeIllustration />,
      action: 'Get Started'
    },
    {
      title: 'Choose Your Role',
      description: 'We\'ll set up a dashboard optimized for your workflow',
      content: <RoleSelector />,
      action: 'Continue'
    },
    {
      title: 'Add Your First Region',
      description: 'Regions are customizable widgets you can arrange',
      content: <RegionTypeSelector />,
      action: 'Add Region'
    },
    {
      title: 'Customize Your Layout',
      description: 'Drag, resize, and arrange regions to fit your needs',
      content: <LayoutDemo />,
      action: 'Finish'
    }
  ];
  
  const handleComplete = () => {
    localStorage.setItem('dashboard_onboarding_complete', 'true');
    setShowOnboarding(false);
  };
  
  if (!showOnboarding) return null;
  
  return (
    <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
      <DialogContent className="max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6"
          >
            {/* Progress indicator */}
            <div className="flex gap-2 mb-8">
              {onboardingSteps.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-2 flex-1 rounded-full transition-colors',
                    i <= step ? 'bg-blue-500' : 'bg-gray-200'
                  )}
                />
              ))}
            </div>
            
            {/* Step content */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                {onboardingSteps[step].title}
              </h2>
              <p className="text-gray-600 text-lg">
                {onboardingSteps[step].description}
              </p>
            </div>
            
            <div className="mb-8">
              {onboardingSteps[step].illustration}
              {onboardingSteps[step].content}
            </div>
            
            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                className="px-4 py-2 text-gray-600 disabled:opacity-50"
              >
                Back
              </button>
              
              <button
                onClick={() => {
                  if (step === onboardingSteps.length - 1) {
                    handleComplete();
                  } else {
                    setStep(step + 1);
                  }
                }}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {onboardingSteps[step].action}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

// Empty state with quick actions
const EmptyDashboard: React.FC = () => {
  const { addRegion } = useRegionLayout();
  
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="text-center max-w-2xl p-8">
        {/* Illustration */}
        <div className="mb-8">
          <EmptyStateIllustration />
        </div>
        
        <h2 className="text-3xl font-bold mb-4">
          Your Dashboard is Empty
        </h2>
        <p className="text-gray-600 mb-8 text-lg">
          Get started by adding regions to create your personalized workspace
        </p>
        
        {/* Quick start options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <QuickStartCard
            icon={<Briefcase className="w-8 h-8" />}
            title="Use Template"
            description="Start with a pre-built layout"
            onClick={() => showTemplateSelector()}
          />
          
          <QuickStartCard
            icon={<Plus className="w-8 h-8" />}
            title="Add Region"
            description="Build from scratch"
            onClick={() => showRegionSelector()}
          />
          
          <QuickStartCard
            icon={<Upload className="w-8 h-8" />}
            title="Import Layout"
            description="Upload existing configuration"
            onClick={() => showImportDialog()}
          />
        </div>
        
        {/* Popular regions */}
        <div className="text-left">
          <h3 className="font-semibold mb-4">Popular Regions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {popularRegions.map(region => (
              <button
                key={region.type}
                onClick={() => addRegion(region.type)}
                className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                {region.icon}
                <span className="text-sm font-medium">{region.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Template selector
const TemplateSelector: React.FC = () => {
  const templates = [
    {
      id: 'technician',
      name: 'Field Technician',
      description: 'Optimized for daily scheduling and customer management',
      preview: <TechnicianPreview />,
      regions: [...technicianRegions]
    },
    {
      id: 'manager',
      name: 'Operations Manager',
      description: 'Overview of team performance and analytics',
      preview: <ManagerPreview />,
      regions: [...managerRegions]
    },
    {
      id: 'executive',
      name: 'Executive',
      description: 'High-level metrics and financial summaries',
      preview: <ExecutivePreview />,
      regions: [...executiveRegions]
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {templates.map(template => (
        <motion.div
          key={template.id}
          whileHover={{ scale: 1.02 }}
          className="border rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => applyTemplate(template)}
        >
          <div className="aspect-video bg-gray-100 p-4">
            {template.preview}
          </div>
          
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">{template.name}RetryCContinuetypescript            <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{template.description}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {template.regions.length} regions
              </span>
              <button className="text-sm text-blue-500 font-medium">
                Use Template →
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Contextual help system
const ContextualHelp: React.FC = () => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const { regions } = useRegionLayout();
  
  // Show hints based on user actions
  const hints = useMemo(() => {
    const tips = [];
    
    if (regions.length === 0) {
      tips.push({
        id: 'add-first-region',
        message: 'Click the + button to add your first region',
        position: 'fab',
        priority: 'high'
      });
    }
    
    if (regions.length === 1) {
      tips.push({
        id: 'drag-region',
        message: 'Drag regions by their header to rearrange',
        position: 'region-header',
        priority: 'medium'
      });
    }
    
    if (regions.some(r => !r.is_collapsed)) {
      tips.push({
        id: 'resize-region',
        message: 'Drag the corners to resize regions',
        position: 'region-corner',
        priority: 'low'
      });
    }
    
    return tips;
  }, [regions]);
  
  return (
    <AnimatePresence>
      {hints.map((hint, index) => (
        <HelpTooltip
          key={hint.id}
          hint={hint}
          delay={index * 2000}
          onDismiss={() => dismissHint(hint.id)}
        />
      ))}
    </AnimatePresence>
  );
};

const HelpTooltip: React.FC<{ hint: Hint; delay: number }> = ({ hint, delay }) => {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  if (!show) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="fixed z-50"
      style={getTooltipPosition(hint.position)}
    >
      <div className="bg-blue-500 text-white rounded-lg shadow-xl p-4 max-w-xs">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm">{hint.message}</p>
          </div>
          <button
            onClick={() => setShow(false)}
            className="text-white/80 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="absolute -bottom-2 left-6 w-4 h-4 bg-blue-500 transform rotate-45" />
    </motion.div>
  );
};
6. Search and Filter UI is Inadequate
Current Problems:

Basic text search only
No advanced filters
No saved searches
No search suggestions
Results not highlighted

Enterprise Solution:
typescript// Advanced search and filter system
const AdvancedSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [searchMode, setSearchMode] = useState<'simple' | 'advanced'>('simple');
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  
  // Fuzzy search with suggestions
  const searchResults = useMemo(() => {
    const fuse = new Fuse(regions, {
      keys: ['config.title', 'region_type', 'config.description'],
      threshold: 0.3,
      includeScore: true,
      includeMatches: true
    });
    
    return searchQuery ? fuse.search(searchQuery) : [];
  }, [searchQuery, regions]);
  
  // Auto-suggest while typing
  const suggestions = useMemo(() => {
    if (searchQuery.length < 2) return [];
    
    return [
      ...getRecentSearches(),
      ...getPopularSearches(),
      ...getRelatedSearches(searchQuery)
    ].slice(0, 5);
  }, [searchQuery]);
  
  return (
    <div className="relative">
      {/* Search input */}
      <div className="relative">
        <input
          ref={searchRef}
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          placeholder="Search regions, widgets, or content..."
          className="w-full pl-10 pr-24 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        
        {/* Search mode toggle */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
          <button
            onClick={() => setSearchMode(searchMode === 'simple' ? 'advanced' : 'simple')}
            className="text-xs text-blue-500 font-medium"
          >
            {searchMode === 'simple' ? 'Advanced' : 'Simple'}
          </button>
          
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      {/* Advanced filters */}
      <AnimatePresence>
        {searchMode === 'advanced' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 border rounded-lg bg-gray-50"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Region type filter */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Region Type
                </label>
                <MultiSelect
                  options={Object.values(RegionType).map(type => ({
                    value: type,
                    label: formatRegionType(type)
                  }))}
                  value={filters.types || []}
                  onChange={(types) => setFilters({ ...filters, types })}
                />
              </div>
              
              {/* Status filter */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Status
                </label>
                <Select
                  options={[
                    { value: 'all', label: 'All' },
                    { value: 'active', label: 'Active' },
                    { value: 'collapsed', label: 'Collapsed' },
                    { value: 'locked', label: 'Locked' }
                  ]}
                  value={filters.status || 'all'}
                  onChange={(status) => setFilters({ ...filters, status })}
                />
              </div>
              
              {/* Date range filter */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Created Date
                </label>
                <DateRangePicker
                  value={filters.dateRange}
                  onChange={(dateRange) => setFilters({ ...filters, dateRange })}
                />
              </div>
              
              {/* Size filter */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Size
                </label>
                <RangeSlider
                  min={1}
                  max={12}
                  value={filters.sizeRange || [1, 12]}
                  onChange={(sizeRange) => setFilters({ ...filters, sizeRange })}
                  label={(value) => `${value} columns`}
                />
              </div>
              
              {/* Custom fields */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tags
                </label>
                <TagInput
                  value={filters.tags || []}
                  onChange={(tags) => setFilters({ ...filters, tags })}
                  suggestions={getAvailableTags()}
                />
              </div>
              
              {/* Actions */}
              <div className="flex items-end gap-2">
                <button
                  onClick={() => saveCurrentSearch()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Save Search
                </button>
                <button
                  onClick={() => setFilters({})}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Clear
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Search results dropdown */}
      <AnimatePresence>
        {showResults && (searchQuery || suggestions.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 left-0 right-0 bg-white border rounded-lg shadow-xl max-h-96 overflow-y-auto z-50"
          >
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-2 border-b">
                <div className="text-xs font-medium text-gray-500 px-3 py-2">
                  Suggestions
                </div>
                {suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSearchQuery(suggestion.query);
                      if (suggestion.filters) {
                        setFilters(suggestion.filters);
                      }
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded flex items-center gap-2"
                  >
                    <History className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{suggestion.query}</span>
                  </button>
                ))}
              </div>
            )}
            
            {/* Search results */}
            {searchResults.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 px-3 py-2">
                  Results ({searchResults.length})
                </div>
                {searchResults.map((result) => (
                  <SearchResultItem
                    key={result.item.id}
                    result={result}
                    searchQuery={searchQuery}
                    onClick={() => {
                      focusRegion(result.item.id);
                      setShowResults(false);
                    }}
                  />
                ))}
              </div>
            )}
            
            {/* No results */}
            {searchQuery && searchResults.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <SearchX className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No results found for "{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-sm text-blue-500"
                >
                  Clear search
                </button>
              </div>
            )}
            
            {/* Saved searches */}
            {savedSearches.length > 0 && (
              <div className="p-2 border-t">
                <div className="text-xs font-medium text-gray-500 px-3 py-2">
                  Saved Searches
                </div>
                {savedSearches.map((saved) => (
                  <div
                    key={saved.id}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded"
                  >
                    <button
                      onClick={() => applySavedSearch(saved)}
                      className="flex-1 text-left text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Bookmark className="w-4 h-4 text-blue-500" />
                        <span>{saved.name}</span>
                      </div>
                    </button>
                    <button
                      onClick={() => deleteSavedSearch(saved.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Search result item with highlighting
const SearchResultItem: React.FC<{ result: FuseResult; searchQuery: string }> = ({ 
  result, 
  searchQuery 
}) => {
  const highlightMatches = (text: string, matches?: readonly FuseResultMatch[]) => {
    if (!matches || matches.length === 0) return text;
    
    const parts: { text: string; highlight: boolean }[] = [];
    let lastIndex = 0;
    
    matches[0].indices.forEach(([start, end]) => {
      if (start > lastIndex) {
        parts.push({ text: text.slice(lastIndex, start), highlight: false });
      }
      parts.push({ text: text.slice(start, end + 1), highlight: true });
      lastIndex = end + 1;
    });
    
    if (lastIndex < text.length) {
      parts.push({ text: text.slice(lastIndex), highlight: false });
    }
    
    return (
      <>
        {parts.map((part, i) => (
          part.highlight ? (
            <mark key={i} className="bg-yellow-200 font-semibold">
              {part.text}
            </mark>
          ) : (
            <span key={i}>{part.text}</span>
          )
        ))}
      </>
    );
  };
  
  return (
    <div className="px-3 py-2 hover:bg-gray-50 rounded cursor-pointer">
      <div className="flex items-start gap-3">
        <div className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
          getRegionColorClass(result.item.region_type)
        )}>
          {getRegionIcon(result.item.region_type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium">
            {highlightMatches(
              result.item.config.title || result.item.region_type,
              result.matches
            )}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {result.item.config.description || formatRegionType(result.item.region_type)}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-400">
              {result.item.col_span}x{result.item.row_span}
            </span>
            {result.item.is_locked && (
              <Lock className="w-3 h-3 text-gray-400" />
            )}
          </div>
        </div>
        
        {/* Score indicator */}
        <div className="text-xs text-gray-400">
          {Math.round((1 - (result.score || 0)) * 100)}%
        </div>
      </div>
    </div>
  );
};
7. Region Settings Dialog is Cluttered and Confusing
Current Problems:

Too many options on one screen
No categorization
Color pickers are basic
No preview of changes
Save/Cancel actions unclear

Enterprise Solution:
typescript// Redesigned settings with tabs and live preview
const RegionSettingsDialog: React.FC<{ region: DashboardRegion }> = ({ region, onClose }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'behavior' | 'advanced'>('general');
  const [settings, setSettings] = useState<RegionSettings>(region);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Live preview
  const previewRegion = useMemo(() => ({
    ...region,
    ...settings
  }), [region, settings]);
  
  const tabs = [
    { id: 'general', label: 'General', icon: <Settings /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette /> },
    { id: 'behavior', label: 'Behavior', icon: <Zap /> },
    { id: 'advanced', label: 'Advanced', icon: <Code /> }
  ];
  
  const handleSave = async () => {
    setSaving(true);
    try {
      await updateRegion(region.id, settings);
      toast.success('Settings saved successfully');
      onClose();
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <div className="flex h-full">
          {/* Settings panel */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Region Settings</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {region.config.title || formatRegionType(region.region_type)}
                  </p>
                </div>
                
                {hasChanges && (
                  <div className="flex items-center gap-2 text-sm text-orange-500">
                    <AlertCircle className="w-4 h-4" />
                    <span>Unsaved changes</span>
                  </div>
                )}
              </div>
              
              {/* Tabs */}
              <div className="flex gap-1 mt-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                      activeTab === tab.id
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-gray-100'
                    )}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'general' && (
                    <GeneralSettings
                      settings={settings}
                      onChange={(updates) => {
                        setSettings({ ...settings, ...updates });
                        setHasChanges(true);
                      }}
                    />
                  )}
                  
                  {activeTab === 'appearance' && (
                    <AppearanceSettings
                      settings={settings}
                      onChange={(updates) => {
                        setSettings({ ...settings, ...updates });
                        setHasChanges(true);
                      }}
                    />
                  )}
                  
                  {activeTab === 'behavior' && (
                    <BehaviorSettings
                      settings={settings}
                      onChange={(updates) => {
                        setSettings({ ...settings, ...updates });
                        setHasChanges(true);
                      }}
                    />
                  )}
                  
                  {activeTab === 'advanced' && (
                    <AdvancedSettings
                      settings={settings}
                      onChange={(updates) => {
                        setSettings({ ...settings, ...updates });
                        setHasChanges(true);
                      }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t bg-gray-50 flex items-center justify-between">
              <button
                onClick={() => setSettings(region)}
                disabled={!hasChanges}
                className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
              >
                Reset to defaults
              </button>
              
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!hasChanges || saving}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </div>
          </div>
          
          {/* Live preview panel */}
          <div className="w-96 border-l bg-gray-50 p-6">
            <div className="sticky top-6">
              <div className="text-sm font-medium mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Live Preview
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-4 transform scale-75 origin-top">
                <RegionContainer
                  region={previewRegion}
                  isPreview={true}
                />
              </div>
              
              {/* Quick stats */}
              <div className="mt-4 p-4 bg-white rounded-lg border">
                <div className="text-xs font-medium text-gray-500 mb-3">
                  Region Info
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size</span>
                    <span className="font-medium">
                      {settings.col_span}x{settings.row_span}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type</span>
                    <span className="font-medium">
                      {formatRegionType(settings.region_type)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className={cn(
                      'font-medium',
                      settings.is_locked ? 'text-red-500' : 'text-green-500'
                    )}>
                      {settings.is_locked ? 'Locked' : 'Unlocked'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Appearance settings with advanced color picker
const AppearanceSettings: React.FC = ({ settings, onChange }) => {
  const [colorPickerOpen, setColorPickerOpen] = useState<string | null>(null);
  
  const colorPresets = [
    { name: 'Default', colors: { bg: '#ffffff', header: '#f9fafb', border: '#e5e7eb' } },
    { name: 'Blue', colors: { bg: '#eff6ff', header: '#dbeafe', border: '#93c5fd' } },
    { name: 'Green', colors: { bg: '#f0fdf4', header: '#dcfce7', border: '#86efac' } },
    { name: 'Purple', colors: { bg: '#faf5ff', header: '#f3e8ff', border: '#c084fc' } },
    { name: 'Dark', colors: { bg: '#1f2937', header: '#111827', border: '#374151' } },
  ];
  
  return (
    <div className="space-y-6">
      {/* Color presets */}
      <div>
        <label className="block text-sm font-medium mb-3">
          Color Presets
        </label>
        <div className="grid grid-cols-5 gap-3">
          {colorPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => onChange({
                config: {
                  ...settings.config,
                  backgroundColor: preset.colors.bg,
                  headerColor: preset.colors.header,
                  borderColor: preset.colors.border
                }
              })}
              className="flex flex-col items-center gap-2 p-3 border rounded-lg hover:border-blue-500 transition-colors"
            >
              <div className="flex gap-1">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: preset.colors.bg }}
                />
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: preset.colors.header }}
                />
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: preset.colors.border }}
                />
              </div>
              <span className="text-xs">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Custom colors */}
      <div className="grid grid-cols-3 gap-4">
        <ColorPickerField
          label="Background"
          value={settings.config.backgroundColor}
          onChange={(color) => onChange({
            config: { ...settings.config, backgroundColor: color }
          })}
        />
        
        <ColorPickerField
          label="Header"
          value={settings.config.headerColor}
          onChange={(color) => onChange({
            config: { ...settings.config, headerColor: color }
          })}
        />
        
        <ColorPickerField
          label="Border"
          value={settings.config.borderColor}
          onChange={(color) => onChange({
            config: { ...settings.config, borderColor: color }
          })}
        />
      </div>
      
      {/* Typography */}
      <div>
        <label className="block text-sm font-medium mb-3">
          Typography
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-2">
              Font Family
            </label>
            <Select
              value={settings.config.fontFamily || 'Inter'}
              onChange={(fontFamily) => onChange({
                config: { ...settings.config, fontFamily }
              })}
              options={[
                { value: 'Inter', label: 'Inter' },
                { value: 'Roboto', label: 'Roboto' },
                { value: 'Open Sans', label: 'Open Sans' },
                { value: 'Lato', label: 'Lato' },
                { value: 'Montserrat', label: 'Montserrat' }
              ]}
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-600 mb-2">
              Font Size
            </label>
            <Select
              value={settings.config.fontSize || 'medium'}
              onChange={(fontSize) => onChange({
                config: { ...settings.config, fontSize }
              })}
              options={[
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Large' }
              ]}
            />
          </div>
        </div>
      </div>
      
      {/* Spacing */}
      <div>
        <label className="block text-sm font-medium mb-3">
          Spacing & Layout
        </label>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-600">
                Padding
              </label>
              <span className="text-xs font-medium">
                {settings.config.padding || 16}px
              </span>
            </div>
            <Slider
              value={settings.config.padding || 16}
              onChange={(padding) => onChange({
                config: { ...settings.config, padding }
              })}
              min={0}
              max={48}
              step={4}
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-600">
                Border Radius
              </label>
              <span className="text-xs font-medium">
                {settings.config.borderRadius || 8}px
              </span>
            </div>
            <Slider
              value={settings.config.borderRadius || 8}
              onChange={(borderRadius) => onChange({
                config: { ...settings.config, borderRadius }
              })}
              min={0}
              max={24}
              step={2}
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs textRetryCContinuetypescript              <label className="text-xs text-gray-600">
                Shadow Depth
              </label>
              <span className="text-xs font-medium">
                {settings.config.shadowDepth || 1}
              </span>
            </div>
            <Slider
              value={settings.config.shadowDepth || 1}
              onChange={(shadowDepth) => onChange({
                config: { ...settings.config, shadowDepth }
              })}
              min={0}
              max={5}
              step={1}
            />
          </div>
        </div>
      </div>
      
      {/* Animation preferences */}
      <div>
        <label className="block text-sm font-medium mb-3">
          Animations
        </label>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.config.enableAnimations ?? true}
              onChange={(e) => onChange({
                config: { ...settings.config, enableAnimations: e.target.checked }
              })}
              className="w-4 h-4 text-blue-500 rounded"
            />
            <div>
              <div className="text-sm font-medium">Enable animations</div>
              <div className="text-xs text-gray-500">
                Smooth transitions and motion effects
              </div>
            </div>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.config.enableHoverEffects ?? true}
              onChange={(e) => onChange({
                config: { ...settings.config, enableHoverEffects: e.target.checked }
              })}
              className="w-4 h-4 text-blue-500 rounded"
            />
            <div>
              <div className="text-sm font-medium">Hover effects</div>
              <div className="text-xs text-gray-500">
                Visual feedback on mouse hover
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

// Advanced color picker component
const ColorPickerField: React.FC<{
  label: string;
  value: string;
  onChange: (color: string) => void;
}> = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [colorMode, setColorMode] = useState<'solid' | 'gradient'>('solid');
  
  return (
    <div>
      <label className="block text-xs text-gray-600 mb-2">{label}</label>
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            className="w-full h-10 rounded-lg border-2 flex items-center gap-2 px-3 hover:border-blue-500 transition-colors"
            style={{ borderColor: value }}
          >
            <div
              className="w-6 h-6 rounded border"
              style={{ background: value }}
            />
            <span className="text-sm font-mono">{value}</span>
          </button>
        </PopoverTrigger>
        
        <PopoverContent className="w-80 p-4">
          {/* Color mode toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setColorMode('solid')}
              className={cn(
                'flex-1 py-2 px-3 rounded text-sm font-medium transition-colors',
                colorMode === 'solid'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              )}
            >
              Solid
            </button>
            <button
              onClick={() => setColorMode('gradient')}
              className={cn(
                'flex-1 py-2 px-3 rounded text-sm font-medium transition-colors',
                colorMode === 'gradient'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              )}
            >
              Gradient
            </button>
          </div>
          
          {colorMode === 'solid' ? (
            <>
              {/* Chrome picker */}
              <ChromePicker
                color={value}
                onChange={(color) => onChange(color.hex)}
                disableAlpha={false}
              />
              
              {/* Recent colors */}
              <div className="mt-4">
                <div className="text-xs font-medium mb-2">Recent Colors</div>
                <div className="flex gap-2">
                  {getRecentColors().map((color, i) => (
                    <button
                      key={i}
                      onClick={() => onChange(color)}
                      className="w-8 h-8 rounded border hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <GradientPicker
              value={value}
              onChange={onChange}
            />
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};
8. No Visual Feedback for User Actions
Current Problems:

Actions happen silently
No loading states
No success/error animations
Users unsure if action completed

Enterprise Solution:
typescript// Comprehensive feedback system
const FeedbackSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingActions, setLoadingActions] = useState<Map<string, LoadingState>>(new Map());
  
  return (
    <>
      {/* Toast notifications */}
      <AnimatePresence>
        {notifications.map((notification) => (
          <Toast key={notification.id} notification={notification} />
        ))}
      </AnimatePresence>
      
      {/* Loading overlays */}
      <AnimatePresence>
        {Array.from(loadingActions.entries()).map(([id, state]) => (
          <LoadingOverlay key={id} state={state} />
        ))}
      </AnimatePresence>
      
      {/* Success animations */}
      <SuccessAnimation />
    </>
  );
};

// Enhanced toast notifications
const Toast: React.FC<{ notification: Notification }> = ({ notification }) => {
  const [progress, setProgress] = useState(100);
  
  useEffect(() => {
    const duration = notification.duration || 5000;
    const interval = 50;
    const decrement = (interval / duration) * 100;
    
    const timer = setInterval(() => {
      setProgress((prev) => Math.max(0, prev - decrement));
    }, interval);
    
    return () => clearInterval(timer);
  }, [notification.duration]);
  
  const icons = {
    success: <CheckCircle2 className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  };
  
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-orange-500',
    info: 'bg-blue-500'
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      className="fixed top-4 right-4 z-50 w-96"
    >
      <div className="bg-white rounded-lg shadow-2xl border overflow-hidden">
        {/* Progress bar */}
        <motion.div
          className={cn('h-1', colors[notification.type])}
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.05, ease: 'linear' }}
        />
        
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className={cn('text-white rounded-full p-2', colors[notification.type])}>
              {icons[notification.type]}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm mb-1">
                {notification.title}
              </h4>
              {notification.message && (
                <p className="text-sm text-gray-600">
                  {notification.message}
                </p>
              )}
              
              {/* Action buttons */}
              {notification.actions && (
                <div className="flex gap-2 mt-3">
                  {notification.actions.map((action, i) => (
                    <button
                      key={i}
                      onClick={action.onClick}
                      className="text-xs font-medium text-blue-500 hover:text-blue-600"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={() => dismissNotification(notification.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Loading overlay with skeleton
const LoadingOverlay: React.FC<{ state: LoadingState }> = ({ state }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
        <div className="flex flex-col items-center gap-4">
          {/* Animated loader */}
          <div className="relative">
            <motion.div
              className="w-16 h-16 border-4 border-blue-200 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-0 w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
          </div>
          
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-2">
              {state.title}
            </h3>
            <p className="text-sm text-gray-600">
              {state.message}
            </p>
          </div>
          
          {/* Progress bar */}
          {state.progress !== undefined && (
            <div className="w-full">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{Math.round(state.progress)}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${state.progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}
          
          {/* Substeps */}
          {state.steps && (
            <div className="w-full space-y-2">
              {state.steps.map((step, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex items-center gap-2 text-sm',
                    step.status === 'completed' && 'text-green-600',
                    step.status === 'active' && 'text-blue-600',
                    step.status === 'pending' && 'text-gray-400'
                  )}
                >
                  {step.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                  {step.status === 'active' && <Loader2 className="w-4 h-4 animate-spin" />}
                  {step.status === 'pending' && <Circle className="w-4 h-4" />}
                  <span>{step.label}</span>
                </div>
              ))}
            </div>
          )}
          
          {state.cancelable && (
            <button
              onClick={state.onCancel}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Success animation (confetti effect)
const SuccessAnimation: React.FC = () => {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    const handler = () => setShow(true);
    eventBus.on('success-animation', handler);
    return () => eventBus.off('success-animation', handler);
  }, []);
  
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [show]);
  
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={200}
        gravity={0.3}
      />
      
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
        exit={{ scale: 0, opacity: 0 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="bg-white rounded-full p-8 shadow-2xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <CheckCircle2 className="w-24 h-24 text-green-500" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

// Micro-interactions for buttons
const InteractiveButton: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary',
  ...props 
}) => {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { x, y, id: Date.now() };
    setRipples([...ripples, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
    
    // Haptic feedback on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    
    onClick?.(e);
  };
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={cn(
        'relative overflow-hidden',
        'px-4 py-2 rounded-lg font-medium',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        variant === 'primary' && 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500',
        variant === 'secondary' && 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
        variant === 'danger' && 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500'
      )}
      {...props}
    >
      {children}
      
      {/* Ripple effect */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute bg-white rounded-full"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 20,
            height: 20,
            marginLeft: -10,
            marginTop: -10,
          }}
        />
      ))}
    </motion.button>
  );
};
9. Keyboard Navigation is Broken
Current Problems:

Tab order is illogical
No keyboard shortcuts visible
Can't navigate between regions
No focus indicators
Accessibility issues

Enterprise Solution:
typescript// Comprehensive keyboard navigation system
const KeyboardNavigationProvider: React.FC = ({ children }) => {
  const [focusedRegionId, setFocusedRegionId] = useState<string | null>(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [shortcutsVisible, setShortcutsVisible] = useState(false);
  
  // Keyboard shortcuts registry
  const shortcuts = useMemo(() => ({
    // Global shortcuts
    'ctrl+k': { action: () => setCommandPaletteOpen(true), description: 'Open command palette' },
    '?': { action: () => setShortcutsVisible(true), description: 'Show keyboard shortcuts' },
    'ctrl+z': { action: () => undo(), description: 'Undo last action' },
    'ctrl+shift+z': { action: () => redo(), description: 'Redo action' },
    'ctrl+s': { action: () => saveLayout(), description: 'Save layout' },
    
    // Navigation shortcuts
    'tab': { action: () => focusNextRegion(), description: 'Focus next region' },
    'shift+tab': { action: () => focusPreviousRegion(), description: 'Focus previous region' },
    'arrowup': { action: () => focusRegionAbove(), description: 'Focus region above' },
    'arrowdown': { action: () => focusRegionBelow(), description: 'Focus region below' },
    'arrowleft': { action: () => focusRegionLeft(), description: 'Focus region to left' },
    'arrowright': { action: () => focusRegionRight(), description: 'Focus region to right' },
    
    // Region shortcuts (when region focused)
    'enter': { action: () => expandFocusedRegion(), description: 'Expand/collapse region' },
    'delete': { action: () => deleteFocusedRegion(), description: 'Delete focused region' },
    'e': { action: () => editFocusedRegion(), description: 'Edit focused region' },
    'l': { action: () => toggleLockFocusedRegion(), description: 'Lock/unlock focused region' },
    'm': { action: () => toggleMinimizeFocusedRegion(), description: 'Minimize/restore region' },
    
    // Quick actions
    'ctrl+a': { action: () => selectAllRegions(), description: 'Select all regions' },
    'ctrl+d': { action: () => duplicateFocusedRegion(), description: 'Duplicate region' },
    'escape': { action: () => clearSelection(), description: 'Clear selection' },
  }), []);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when typing in inputs
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }
      
      // Build key combination string
      const keys = [];
      if (e.ctrlKey || e.metaKey) keys.push('ctrl');
      if (e.shiftKey) keys.push('shift');
      if (e.altKey) keys.push('alt');
      keys.push(e.key.toLowerCase());
      
      const combo = keys.join('+');
      const shortcut = shortcuts[combo];
      
      if (shortcut) {
        e.preventDefault();
        shortcut.action();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
  
  return (
    <KeyboardNavigationContext.Provider value={{ 
      focusedRegionId, 
      setFocusedRegionId,
      shortcuts 
    }}>
      {children}
      
      {/* Keyboard shortcuts help */}
      <ShortcutsDialog
        open={shortcutsVisible}
        onClose={() => setShortcutsVisible(false)}
        shortcuts={shortcuts}
      />
    </KeyboardNavigationContext.Provider>
  );
};

// Keyboard shortcuts dialog
const ShortcutsDialog: React.FC = ({ open, onClose, shortcuts }) => {
  const categories = useMemo(() => {
    const grouped: Record<string, typeof shortcuts> = {
      'Global': {},
      'Navigation': {},
      'Region Actions': {},
      'Quick Actions': {}
    };
    
    Object.entries(shortcuts).forEach(([key, shortcut]) => {
      if (key.includes('ctrl+k') || key === '?' || key.includes('ctrl+z')) {
        grouped['Global'][key] = shortcut;
      } else if (key.includes('arrow') || key === 'tab') {
        grouped['Navigation'][key] = shortcut;
      } else if (['enter', 'delete', 'e', 'l', 'm'].includes(key)) {
        grouped['Region Actions'][key] = shortcut;
      } else {
        grouped['Quick Actions'][key] = shortcut;
      }
    });
    
    return grouped;
  }, [shortcuts]);
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Keyboard className="w-6 h-6" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Speed up your workflow with these keyboard shortcuts
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          {Object.entries(categories).map(([category, shortcuts]) => (
            <div key={category}>
              <h3 className="font-semibold text-lg mb-3">{category}</h3>
              <div className="space-y-2">
                {Object.entries(shortcuts).map(([key, shortcut]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between py-2 px-3 rounded hover:bg-gray-50"
                  >
                    <span className="text-sm text-gray-700">
                      {shortcut.description}
                    </span>
                    <KeyboardShortcut keys={key.split('+')} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Tip:</strong> Press <kbd className="px-2 py-1 bg-white rounded border">?</kbd> 
            anytime to see this dialog
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Keyboard shortcut display component
const KeyboardShortcut: React.FC<{ keys: string[] }> = ({ keys }) => {
  const formatKey = (key: string) => {
    const keyMap: Record<string, string> = {
      'ctrl': '⌘',
      'shift': '⇧',
      'alt': '⌥',
      'enter': '↵',
      'delete': '⌫',
      'arrowup': '↑',
      'arrowdown': '↓',
      'arrowleft': '←',
      'arrowright': '→',
      'tab': '⇥',
      'escape': 'Esc'
    };
    
    return keyMap[key.toLowerCase()] || key.toUpperCase();
  };
  
  return (
    <div className="flex items-center gap-1">
      {keys.map((key, i) => (
        <React.Fragment key={i}>
          <kbd className="px-2 py-1 text-xs font-semibold bg-white border border-gray-300 rounded shadow-sm">
            {formatKey(key)}
          </kbd>
          {i < keys.length - 1 && (
            <span className="text-gray-400">+</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// Focusable region with keyboard navigation
const FocusableRegion: React.FC<{ region: DashboardRegion }> = ({ region }) => {
  const { focusedRegionId, setFocusedRegionId } = useKeyboardNavigation();
  const ref = useRef<HTMLDivElement>(null);
  const isFocused = focusedRegionId === region.id;
  
  useEffect(() => {
    if (isFocused && ref.current) {
      ref.current.focus();
      
      // Scroll into view if needed
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [isFocused]);
  
  return (
    <div
      ref={ref}
      tabIndex={0}
      role="article"
      aria-label={`Region: ${region.config.title || region.region_type}`}
      onFocus={() => setFocusedRegionId(region.id)}
      onBlur={() => setFocusedRegionId(null)}
      className={cn(
        'region-container transition-all duration-200',
        isFocused && 'ring-2 ring-blue-500 ring-offset-2 shadow-lg scale-[1.02]'
      )}
    >
      <RegionContent region={region} />
      
      {/* Focus indicator */}
      {isFocused && (
        <div className="absolute -top-8 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-t">
          Focused (press ? for shortcuts)
        </div>
      )}
    </div>
  );
};