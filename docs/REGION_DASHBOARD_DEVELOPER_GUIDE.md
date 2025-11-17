# Region Dashboard Developer Guide

## Table of Contents

### Part 1: Quick Start Implementation
- [Getting Started - Code Overview](#getting-started-code-overview)
- [Your First Dashboard - Component Structure](#your-first-dashboard-component-structure)
- [Essential Actions - Implementation Details](#essential-actions-implementation-details)

### Part 2: Core Features Implementation
- [Region Management - Components & Hooks](#region-management-components--hooks)
- [Region Customization - Settings System](#region-customization-settings-system)
- [Region Types - Type System](#region-types-type-system)

### Part 3: Advanced Features Implementation
- [Dashboard Controls - FAB & Zoom/Pan](#dashboard-controls-fab--zoompan)
- [Layered UI System - Components](#layered-ui-system-components)
- [Versioning System - Backend & Frontend](#versioning-system-backend--frontend)
- [Collaboration Features - Real-time System](#collaboration-features-real-time-system)
- [Sharing & Permissions - ACL System](#sharing--permissions-acl-system)

### Part 4: Productivity Features Implementation
- [Keyboard Shortcuts - Event Handling](#keyboard-shortcuts-event-handling)
- [Undo/Redo System - State Management](#undoredo-system-state-management)
- [Export/Import - Data Serialization](#exportimport-data-serialization)
- [Reset & Defaults - Role-Based System](#reset--defaults-role-based-system)

### Part 5: Mobile & Responsive Implementation
- [Mobile Layout - Responsive Components](#mobile-layout-responsive-components)
- [Touch Controls - Gesture Handling](#touch-controls-gesture-handling)

### Part 6: Architecture & Patterns
- [Component Architecture](#component-architecture)
- [State Management Patterns](#state-management-patterns)
- [API Integration](#api-integration)
- [Performance Optimizations](#performance-optimizations)
- [Error Handling](#error-handling)

### Part 7: Reference
- [File Structure](#file-structure)
- [Type Definitions](#type-definitions)
- [Hook Reference](#hook-reference)
- [Component Reference](#component-reference)

---

# Part 1: Quick Start Implementation

## Getting Started - Code Overview

### Entry Point

**File:** `frontend/src/routes/dashboard/RegionDashboard.tsx`

The main dashboard component that orchestrates all functionality:

```typescript
export const RegionDashboard: React.FC<RegionDashboardProps> = ({
  layoutId,
  userId
}) => {
  // Layout loading
  const [currentLayoutId, setCurrentLayoutId] = useState<string | null>(null);
  
  // Core hooks
  const { regions, addRegion, removeRegion, ... } = useRegionLayout({
    layoutId: currentLayoutId || '',
    autoSave: true,
    debounceMs: 500
  });
  
  // Additional hooks for versioning, zoom, etc.
  // ...
}
```

### Key Dependencies

**Hooks:**
- `useRegionLayout` - Core region management
- `useLayoutVersioning` - Version control
- `useZoomPan` - Canvas zoom/pan
- `useUndoRedo` - History management
- `useLayoutIntelligence` - Smart layout suggestions

**Components:**
- `RegionGrid` - Grid layout container
- `RegionContainer` - Individual region wrapper
- `DashboardFAB` - Settings panel
- `MinimizedRegionDock` - Collapsed regions dock

## Your First Dashboard - Component Structure

### Layout Loading

**Implementation:** `frontend/src/routes/dashboard/RegionDashboard.tsx` (lines 36-58)

```typescript
useEffect(() => {
  const loadDefaultLayout = async () => {
    try {
      setLoadingLayout(true);
      if (!layoutId || layoutId.trim() === '') {
        // Get or create default layout
        const layout = await enhancedApi.dashboardLayouts.getOrCreateDefault();
        if (layout?.id) {
          setCurrentLayoutId(layout.id);
        }
      } else {
        setCurrentLayoutId(layoutId);
      }
    } catch (error) {
      logger.error('Failed to load layout', { error, layoutId }, 'RegionDashboard');
    } finally {
      setLoadingLayout(false);
    }
  };
  loadDefaultLayout();
}, [layoutId]);
```

**API Endpoint:** `GET /api/dashboard/layouts/default` or `POST /api/dashboard/layouts/default`

**Backend Service:** `backend/src/dashboard/dashboard.service.ts`

### Region Grid Rendering

**File:** `frontend/src/components/dashboard/regions/RegionGrid.tsx`

Uses `react-grid-layout` for drag-and-drop functionality:

```typescript
<ResponsiveGridLayout
  className="layout"
  layouts={layouts}
  breakpoints={breakpoints}
  cols={colsMap}
  rowHeight={100}
  margin={[gap, gap]}
  onLayoutChange={handleLayoutChange}
  isDraggable={isDraggable}
  isResizable={isResizable}
  draggableHandle=".region-drag-handle"
  resizeHandles={['se', 'sw', 'ne', 'nw', 's', 'n', 'e', 'w']}
  preventCollision={true}
  swapOnDrag={true}
>
  {regions.map(region => (
    <div key={region.id}>
      <RegionContainer region={region} {...props} />
    </div>
  ))}
</ResponsiveGridLayout>
```

## Essential Actions - Implementation Details

### Adding Regions

**Hook:** `frontend/src/hooks/useRegionLayout.ts`

**Function:** `addRegion` (lines 120-138)

```typescript
const addRegion = useCallback(async (
  type: RegionType,
  position?: { row: number; col: number }
) => {
  // Optimistic update
  const newRegion: Partial<DashboardRegion> = {
    region_type: type,
    grid_row: position?.row ?? findNextPosition().row,
    grid_col: position?.col ?? findNextPosition().col,
    row_span: 4,
    col_span: 6,
    // ... defaults
  };
  
  setRegions(prev => [...prev, newRegion as DashboardRegion]);
  
  try {
    const created = await enhancedApi.dashboardLayouts.createRegion(
      layoutId,
      newRegion
    );
    // Update with server response
    setRegions(prev => prev.map(r => 
      r.id === newRegion.id ? created : r
    ));
  } catch (err) {
    // Rollback on error
    setRegions(prev => prev.filter(r => r.id !== newRegion.id));
    throw err;
  }
}, [layoutId, regions]);
```

**API Endpoint:** `POST /api/dashboard/layouts/:layoutId/regions`

**Backend:** `backend/src/dashboard/dashboard.service.ts` - `createRegion()`

### Moving Regions

**Implementation:** `frontend/src/components/dashboard/regions/RegionGrid.tsx`

**Handler:** `handleLayoutChange` (lines 79-95)

```typescript
const handleLayoutChange = useCallback((layout: Layout[]) => {
  layout.forEach(item => {
    const region = regions.find(r => r.id === item.i);
    if (region) {
      const newRow = item.y;
      const newCol = item.x;
      
      // Only update if position changed
      if (region.grid_row !== newRow || region.grid_col !== newCol) {
        onMove?.(region.id, newRow, newCol);
      }
    }
  });
}, [regions, onMove]);
```

**Hook Integration:** `useRegionLayout.updateRegionPosition` (lines 160-162)

```typescript
const updateRegionPosition = useCallback(async (
  id: string,
  row: number,
  col: number
) => {
  updateRegion(id, { grid_row: row, grid_col: col });
}, [updateRegion]);
```

**API Endpoint:** `PUT /api/dashboard/layouts/:layoutId/regions/:id`

### Resizing Regions

**Implementation:** Same `handleLayoutChange` handler detects size changes:

```typescript
const handleLayoutChange = useCallback((layout: Layout[]) => {
  layout.forEach(item => {
    const region = regions.find(r => r.id === item.i);
    if (region) {
      const newRowSpan = item.h;
      const newColSpan = item.w;
      
      if (region.row_span !== newRowSpan || region.col_span !== newColSpan) {
        onResize?.(region.id, newRowSpan, newColSpan);
      }
    }
  });
}, [regions, onResize]);
```

**Resize Handles Styling:** `frontend/src/components/dashboard/regions/region-grid.css`

- Corner handles: 16px × 16px purple circles
- Edge handles: Rectangular purple bars
- Hover effects: Opacity 0.8, scale 1.1

### Deleting Regions

**Hook:** `useRegionLayout.removeRegion` (lines 140-158)

```typescript
const removeRegion = useCallback(async (id: string) => {
  // Optimistic update
  const regionToRemove = regions.find(r => r.id === id);
  setRegions(prev => prev.filter(r => r.id !== id));
  
  try {
    await enhancedApi.dashboardLayouts.deleteRegion(layoutId, id);
  } catch (err) {
    // Rollback on error
    if (regionToRemove) {
      setRegions(prev => [...prev, regionToRemove]);
    }
    toast.error(`Failed to remove region: ${err.message}`);
    throw err;
  }
}, [layoutId, regions]);
```

**API Endpoint:** `DELETE /api/dashboard/layouts/:layoutId/regions/:id`

**Backend:** Soft delete (sets `deleted_at` timestamp)

---

# Part 2: Core Features Implementation

## Region Management - Components & Hooks

### RegionContainer Component

**File:** `frontend/src/components/dashboard/regions/RegionContainer.tsx`

**Key Features:**
- Wraps individual regions
- Handles drag handles, resize, context menu
- Manages collapse/lock/delete actions
- React.memo optimization with custom comparison

**Props Interface:**
```typescript
interface RegionContainerProps {
  region: DashboardRegion;
  children?: ReactNode;
  onResize?: (id: string, rowSpan: number, colSpan: number) => void;
  onMove?: (id: string, row: number, col: number) => void;
  onToggleCollapse?: (id: string) => void;
  onToggleLock?: (id: string) => void;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<DashboardRegion>) => Promise<void>;
  onAddRegion?: (type: string, position?: { row: number; col: number }) => Promise<void>;
}
```

**Performance Optimization:**
```typescript
export const RegionContainer = React.memo(({ ... }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison function
  // Returns true if props are equal (skip re-render)
  // Returns false if different (re-render)
});
```

### RegionGrid Component

**File:** `frontend/src/components/dashboard/regions/RegionGrid.tsx`

**Dependencies:**
- `react-grid-layout` - Grid layout engine
- `ResponsiveGridLayout` - Responsive grid container

**Key Configuration:**
```typescript
<ResponsiveGridLayout
  preventCollision={true}  // Prevents overlapping
  swapOnDrag={true}        // Swaps regions on drag
  compactType={null}       // No auto-compaction
  useCSSTransforms={true}  // Hardware acceleration
  allowOverlap={false}     // Strict no-overlap
/>
```

**Layout Conversion:**
```typescript
const layouts = useMemo(() => {
  return {
    lg: regions.map(region => ({
      i: region.id,
      x: region.grid_col,
      y: region.grid_row,
      w: region.col_span,
      h: region.row_span,
      minW: Math.ceil(region.min_width / 100),
      minH: Math.ceil(region.min_height / 100),
    }))
  };
}, [regions]);
```

### useRegionLayout Hook

**File:** `frontend/src/hooks/useRegionLayout.ts`

**Core Functionality:**
- Region state management
- Auto-save with debouncing
- Optimistic updates with rollback
- Error handling with toast notifications

**State Management:**
```typescript
const [regions, setRegions] = useState<DashboardRegion[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<Error | null>(null);
```

**Auto-Save Mechanism:**
```typescript
const pendingUpdatesRef = useRef<Map<string, Partial<DashboardRegion>>>(new Map());

const debouncedSave = useMemo(() => {
  return debounce(async () => {
    if (pendingUpdatesRef.current.size === 0) return;
    
    const updates = Array.from(pendingUpdatesRef.current.entries());
    await Promise.all(
      updates.map(([id, updates]) =>
        enhancedApi.dashboardLayouts.updateRegion(layoutId, id, updates)
      )
    );
    pendingUpdatesRef.current.clear();
  }, debounceMs);
}, [debounceMs, layoutId]);
```

**Update Helper:**
```typescript
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
```

## Region Customization - Settings System

### RegionSettingsDialog Component

**File:** `frontend/src/components/dashboard/regions/RegionSettingsDialog.tsx`

**State Management:**
```typescript
const [regionType, setRegionType] = useState<RegionType>(region.region_type);
const [backgroundColor, setBackgroundColor] = useState<string>(
  region.config?.backgroundColor || 'rgb(255, 255, 255)'
);
const [headerColor, setHeaderColor] = useState<string>(
  region.config?.headerColor || 'rgb(249, 250, 251)'
);
const [borderColor, setBorderColor] = useState<string>(
  region.config?.borderColor || 'rgb(229, 231, 235)'
);
const [title, setTitle] = useState<string>(
  region.config?.title || region.region_type.replace('-', ' ')
);
```

**Save Handler:**
```typescript
const handleSave = async () => {
  setLoading(true);
  try {
    await onSave({
      region_type: regionType,
      config: {
        ...region.config,
        backgroundColor,
        headerColor,
        borderColor,
        title
      }
    });
    onClose();
  } catch (error) {
    logger.error('Failed to save region settings', { error, regionId: region.id }, 'RegionSettingsDialog');
    toast.error(`Failed to save region settings: ${error.message}`);
  } finally {
    setLoading(false);
  }
};
```

**Input Validation:**
```typescript
<input
  type="text"
  value={title}
  onChange={(e) => {
    const value = e.target.value;
    if (value.length <= 100) {
      setTitle(value);
    }
  }}
  maxLength={100}
/>
{title.length > 80 && (
  <p className="text-xs text-gray-500 mt-0.5">
    {100 - title.length} characters remaining
  </p>
)}
```

## Region Types - Type System

### Type Definitions

**File:** `frontend/src/routes/dashboard/types/region.types.ts`

```typescript
export enum RegionType {
  SCHEDULING = 'scheduling',
  REPORTS = 'reports',
  CUSTOMER_SEARCH = 'customer-search',
  SETTINGS = 'settings',
  QUICK_ACTIONS = 'quick-actions',
  ANALYTICS = 'analytics',
  TEAM_OVERVIEW = 'team-overview',
  FINANCIAL_SUMMARY = 'financial-summary',
  CUSTOM = 'custom'
}

export interface DashboardRegion {
  id: string;
  layout_id: string;
  tenant_id: string;
  user_id: string;
  region_type: RegionType;
  grid_row: number;
  grid_col: number;
  row_span: number;
  col_span: number;
  min_width: number;
  min_height: number;
  is_collapsed: boolean;
  is_locked: boolean;
  is_hidden_mobile: boolean;
  config: Record<string, any>;
  widget_type?: string;
  widget_config: Record<string, any>;
  display_order: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}
```

---

# Part 3: Advanced Features Implementation

## Dashboard Controls - FAB & Zoom/Pan

### DashboardFAB Component

**File:** `frontend/src/routes/dashboard/components/DashboardFAB.tsx`

**Location:** Fixed position `top-4 left-4`

**State Management:**
```typescript
const [isOpen, setIsOpen] = useState(false);
const [showCardSelector, setShowCardSelector] = useState(false);
const settingsPanelRef = useRef<HTMLDivElement>(null);
const fileInputRef = useRef<HTMLInputElement>(null);
```

**Settings Panel:**
```typescript
{isOpen && (
  <div 
    className="fixed top-4 left-32 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-80 max-w-96"
    ref={settingsPanelRef}
  >
    {/* Add Region Button */}
    {/* Collaboration Status */}
    {/* Undo/Redo Controls */}
    {/* Export/Import Layout */}
    {/* Zoom Controls */}
    {/* Reset All */}
    {/* Fullscreen Toggle */}
  </div>
)}
```

### Zoom and Pan Implementation

**Hook:** `frontend/src/hooks/useZoomPan.ts`

**State:**
```typescript
const [zoom, setZoom] = useState(1);
const [pan, setPan] = useState({ x: 0, y: 0 });
const containerRef = useRef<HTMLDivElement>(null);
```

**Zoom Functions:**
```typescript
const zoomIn = useCallback(() => {
  setZoom(prev => Math.min(prev + 0.1, MAX_ZOOM));
}, []);

const zoomOut = useCallback(() => {
  setZoom(prev => Math.max(prev - 0.1, MIN_ZOOM));
}, []);

const resetView = useCallback(() => {
  setZoom(1);
  setPan({ x: 0, y: 0 });
}, []);
```

**Pan Handler:**
```typescript
const handlePanStart = useCallback((e: React.MouseEvent) => {
  if (e.target === containerRef.current) {
    const startX = e.clientX - pan.x;
    const startY = e.clientY - pan.y;
    
    const handleMouseMove = (e: MouseEvent) => {
      setPan({
        x: e.clientX - startX,
        y: e.clientY - startY
      });
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }
}, [pan]);
```

**Transform Style:**
```typescript
const getTransformStyle = useCallback(() => {
  return {
    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
    transformOrigin: 'top left'
  };
}, [zoom, pan]);
```

**Canvas Rendering Optimization:**
```typescript
<div 
  style={{
    imageRendering: 'crisp-edges' as const,
    WebkitImageRendering: 'crisp-edges' as const,
    willChange: 'transform',
    ...getTransformStyle()
  }}
>
```

## Layered UI System - Components

### Command Palette

**File:** `frontend/src/components/dashboard/layered-ui/CommandPalette.tsx`

**Hook:** `frontend/src/hooks/useCommandPalette.ts`

**Keyboard Shortcut:** `Ctrl+K` / `Cmd+K`

**Implementation:**
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    const cmdKey = isMac ? e.metaKey : e.ctrlKey;
    if (cmdKey && e.key === 'k') {
      e.preventDefault();
      setIsOpen(true);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };
  
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, []);
```

**Search & Filter:**
```typescript
const filteredCommands = useMemo(() => {
  if (!searchTerm) return commands;
  
  const term = searchTerm.toLowerCase();
  return commands.filter(cmd => 
    cmd.label.toLowerCase().includes(term) ||
    cmd.keywords?.some(kw => kw.toLowerCase().includes(term))
  );
}, [commands, searchTerm]);
```

### FloatingNavBar

**File:** `frontend/src/components/dashboard/layered-ui/FloatingNavBar.tsx`

**Location:** Fixed `top-4 right-4`

**Features:**
- Search bar for filtering regions
- Filter buttons (Active, Locked, etc.)
- Collapsible interface

**Search Implementation:**
```typescript
const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const term = e.target.value;
  setSearchTerm(term);
  onSearch?.(term);
};
```

**Filtered Regions:**
```typescript
const filteredRegions = useMemo(() => {
  return regions.filter(r => {
    // Filter out collapsed regions
    if (r.is_collapsed) return false;
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        r.region_type.toLowerCase().includes(term) ||
        (r.config?.title && r.config.title.toLowerCase().includes(term));
      if (!matchesSearch) return false;
    }
    
    // Apply active filters
    if (activeFilters.has('active') && r.is_locked) return false;
    if (activeFilters.has('locked') && !r.is_locked) return false;
    
    return true;
  });
}, [regions, searchTerm, activeFilters]);
```

### MinimizedRegionDock

**File:** `frontend/src/components/dashboard/regions/MinimizedRegionDock.tsx`

**Location:** Fixed `top-4 right-4`

**Implementation:**
```typescript
export const MinimizedRegionDock: React.FC<MinimizedRegionDockProps> = ({
  minimizedRegions,
  onRestore
}) => {
  if (minimizedRegions.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 p-2 bg-white/95 backdrop-blur-sm rounded-lg border border-gray-200 shadow-lg max-w-[calc(100vw-8rem)] overflow-x-auto">
      <AnimatePresence>
        {minimizedRegions.map((region) => (
          <motion.div
            key={region.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Region card with restore button */}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
```

**Restore Handler:**
```typescript
const handleRestoreRegion = async (id: string) => {
  const originalPos = minimizedRegions.get(id);
  if (originalPos) {
    await updateRegionPosition(id, originalPos.row, originalPos.col);
    setMinimizedRegions(prev => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
    await toggleCollapse(id);
  }
};
```

## Versioning System - Backend & Frontend

### Frontend Hook

**File:** `frontend/src/hooks/useLayoutVersioning.ts`

**State:**
```typescript
const [versions, setVersions] = useState<LayoutVersion[]>([]);
const [currentVersion, setCurrentVersion] = useState<LayoutVersion | null>(null);
const [loading, setLoading] = useState(true);
```

**Create Version:**
```typescript
const createVersion = useCallback(async (
  status: VersionStatus,
  notes?: string
) => {
  const version = await enhancedApi.dashboardLayouts.createVersion(
    layoutId,
    { status, notes }
  );
  setVersions(prev => [version, ...prev]);
  return version;
}, [layoutId]);
```

**Publish Version:**
```typescript
const publishVersion = useCallback(async (
  versionId: string,
  notes?: string
) => {
  const published = await enhancedApi.dashboardLayouts.publishVersion(
    layoutId,
    versionId,
    { notes }
  );
  setVersions(prev => prev.map(v => 
    v.id === versionId ? published : v
  ));
  setCurrentVersion(published);
  return published;
}, [layoutId]);
```

**Revert to Version:**
```typescript
const revertToVersion = useCallback(async (versionId: string) => {
  const reverted = await enhancedApi.dashboardLayouts.revertToVersion(
    layoutId,
    versionId
  );
  // Reload regions from reverted version
  await reloadRegions();
  return reverted;
}, [layoutId, reloadRegions]);
```

### Backend Service

**File:** `backend/src/dashboard/versioning.service.ts`

**Create Version:**
```typescript
async createVersion(
  layoutId: string,
  userId: string,
  data: CreateVersionDto
): Promise<LayoutVersion> {
  // Get current regions
  const regions = await this.dashboardService.getRegions(layoutId);
  
  // Create version record
  const version = await this.prisma.dashboard_layout_versions.create({
    data: {
      layout_id: layoutId,
      user_id: userId,
      status: data.status,
      notes: data.notes,
      regions_snapshot: regions as any, // JSONB
      version_number: await this.getNextVersionNumber(layoutId)
    }
  });
  
  return version;
}
```

**Publish Version:**
```typescript
async publishVersion(
  layoutId: string,
  versionId: string,
  userId: string,
  notes?: string
): Promise<LayoutVersion> {
  // Archive current published version
  await this.prisma.dashboard_layout_versions.updateMany({
    where: {
      layout_id: layoutId,
      status: 'published'
    },
    data: { status: 'archived' }
  });
  
  // Publish new version
  const version = await this.prisma.dashboard_layout_versions.update({
    where: { id: versionId },
    data: {
      status: 'published',
      published_at: new Date(),
      published_by: userId,
      publish_notes: notes
    }
  });
  
  // Apply regions from version
  await this.applyVersionRegions(layoutId, version);
  
  return version;
}
```

## Collaboration Features - Real-time System

### Presence Hook

**File:** `frontend/src/hooks/useRegionPresence.ts`

**WebSocket Integration:**
```typescript
const { socket, isConnected } = useWebSocket();

useEffect(() => {
  if (!socket || !isConnected) return;
  
  // Join region presence room
  socket.emit('join-region', { regionId, userId, sessionId });
  
  // Listen for presence updates
  socket.on('presence-update', (data) => {
    setPresence(data);
  });
  
  // Listen for lock events
  socket.on('lock-acquired', (data) => {
    if (data.userId !== userId) {
      setLockedBy(data.userId);
    }
  });
  
  socket.on('lock-released', () => {
    setLockedBy(null);
  });
  
  return () => {
    socket.emit('leave-region', { regionId });
    socket.off('presence-update');
    socket.off('lock-acquired');
    socket.off('lock-released');
  };
}, [socket, isConnected, regionId, userId]);
```

**Lock Management:**
```typescript
const acquireLock = useCallback(async () => {
  try {
    await enhancedApi.dashboardLayouts.acquireLock(regionId, userId);
    socket?.emit('lock-acquire', { regionId, userId });
    setLockedBy(userId);
    return true;
  } catch (error) {
    if (error.status === 409) {
      // Conflict - someone else has lock
      setLockedBy(error.lockedBy);
    }
    return false;
  }
}, [regionId, userId, socket]);

const releaseLock = useCallback(async () => {
  await enhancedApi.dashboardLayouts.releaseLock(regionId, userId);
  socket?.emit('lock-release', { regionId, userId });
  setLockedBy(null);
}, [regionId, userId, socket]);
```

### Backend Gateway

**File:** `backend/src/dashboard/dashboard-presence.gateway.ts`

**WebSocket Events:**
```typescript
@WebSocketGateway({ namespace: '/dashboard' })
export class DashboardPresenceGateway {
  @OnEvent('join-region')
  handleJoinRegion(client: Socket, data: { regionId: string, userId: string }) {
    client.join(`region:${data.regionId}`);
    this.server.to(`region:${data.regionId}`).emit('presence-update', {
      regionId: data.regionId,
      users: this.getActiveUsers(data.regionId)
    });
  }
  
  @OnEvent('lock-acquire')
  handleLockAcquire(client: Socket, data: { regionId: string, userId: string }) {
    this.server.to(`region:${data.regionId}`).emit('lock-acquired', {
      regionId: data.regionId,
      userId: data.userId
    });
  }
}
```

## Sharing & Permissions - ACL System

### Permissions Hook

**File:** `frontend/src/hooks/useRegionPermissions.ts`

**Get Permissions:**
```typescript
const getPermissions = useCallback(async (regionId: string) => {
  const acls = await enhancedApi.dashboardLayouts.getRegionACLs(regionId);
  return acls;
}, []);
```

**Share Region:**
```typescript
const shareRegion = useCallback(async (
  regionId: string,
  targetType: 'user' | 'role' | 'team',
  targetId: string,
  permissions: string[]
) => {
  await enhancedApi.dashboardLayouts.shareRegion(regionId, {
    target_type: targetType,
    target_id: targetId,
    permissions
  });
}, []);
```

### Backend ACL Service

**File:** `backend/src/dashboard/dashboard.service.ts`

**ACL Check:**
```typescript
async checkPermission(
  regionId: string,
  userId: string,
  permission: 'read' | 'edit' | 'share'
): Promise<boolean> {
  const region = await this.getRegion(regionId);
  
  // Owner always has all permissions
  if (region.user_id === userId) return true;
  
  // Check ACLs
  const acl = await this.prisma.dashboard_region_acls.findFirst({
    where: {
      region_id: regionId,
      OR: [
        { target_type: 'user', target_id: userId },
        { target_type: 'role', target_id: { in: userRoles } },
        { target_type: 'team', target_id: { in: userTeams } }
      ],
      permissions: { array_contains: [permission] }
    }
  });
  
  return !!acl;
}
```

---

# Part 4: Productivity Features Implementation

## Keyboard Shortcuts - Event Handling

### Keyboard Navigation Hook

**File:** `frontend/src/hooks/useKeyboardNavigation.ts`

**WASD Navigation:**
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Don't trigger when typing in input fields
    const target = e.target as HTMLElement;
    const isInputField = target.tagName === 'INPUT' || 
                        target.tagName === 'TEXTAREA';
    if (isInputField) return;
    
    // WASD navigation
    if (['w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
      e.preventDefault();
      const direction = {
        'w': 'up',
        's': 'down',
        'a': 'left',
        'd': 'right'
      }[e.key.toLowerCase()];
      
      navigateInDirection(direction);
    }
  };
  
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, []);
```

### Command Palette Integration

**File:** `frontend/src/routes/dashboard/RegionDashboard.tsx`

**Commands Definition:**
```typescript
const commands: Command[] = useMemo(() => [
  {
    id: 'add-region',
    label: 'Add Region',
    keywords: ['add', 'create', 'new', 'region'],
    action: () => setShowAddRegionDialog(true)
  },
  {
    id: 'export-layout',
    label: 'Export Layout',
    keywords: ['export', 'save', 'download'],
    action: handleExportLayout
  },
  // ... more commands
], []);
```

## Undo/Redo System - State Management

### Undo/Redo Hook

**File:** `frontend/src/hooks/useUndoRedo.ts`

**State:**
```typescript
const [history, setHistory] = useState<T[]>([]);
const [currentIndex, setCurrentIndex] = useState(-1);
```

**Save State:**
```typescript
const saveState = useCallback((state: T) => {
  setHistory(prev => {
    const newHistory = prev.slice(0, currentIndex + 1);
    newHistory.push(state);
    
    // Limit history size
    if (newHistory.length > maxHistorySize) {
      newHistory.shift();
    } else {
      setCurrentIndex(newHistory.length - 1);
    }
    
    return newHistory;
  });
}, [currentIndex, maxHistorySize]);
```

**Undo/Redo:**
```typescript
const undo = useCallback(() => {
  if (currentIndex > 0) {
    setCurrentIndex(prev => prev - 1);
    return history[currentIndex - 1];
  }
  return null;
}, [currentIndex, history]);

const redo = useCallback(() => {
  if (currentIndex < history.length - 1) {
    setCurrentIndex(prev => prev + 1);
    return history[currentIndex + 1];
  }
  return null;
}, [currentIndex, history]);
```

**Integration:**
```typescript
// In RegionDashboard.tsx
useEffect(() => {
  if (regions.length > 0) {
    saveState(regions);
  }
}, [regions, saveState]);
```

## Export/Import - Data Serialization

### Export Implementation

**File:** `frontend/src/routes/dashboard/RegionDashboard.tsx`

**Export Handler:**
```typescript
const handleExportLayout = () => {
  const layoutData = {
    layoutId: currentLayoutId,
    regions: regions.map(r => ({
      id: r.id,
      region_type: r.region_type,
      grid_row: r.grid_row,
      grid_col: r.grid_col,
      row_span: r.row_span,
      col_span: r.col_span,
      config: r.config,
      widget_type: r.widget_type,
      widget_config: r.widget_config
    })),
    exportedAt: new Date().toISOString(),
    version: '1.0'
  };
  
  const blob = new Blob([JSON.stringify(layoutData, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dashboard-layout-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
```

### Import Implementation

**Import Handler:**
```typescript
const handleImportLayout = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const layoutData = JSON.parse(e.target?.result as string);
      
      // Validate structure
      if (!layoutData.regions || !Array.isArray(layoutData.regions)) {
        throw new Error('Invalid layout file: Missing regions array');
      }
      
      // Import regions
      for (const regionData of layoutData.regions) {
        await addRegion(regionData.region_type, {
          row: regionData.grid_row,
          col: regionData.grid_col
        });
        // Update region with config
        // ...
      }
      
      toast.success('Layout imported successfully');
    } catch (error) {
      logger.error('Failed to import layout', { error }, 'RegionDashboard');
      toast.error('Failed to import layout. Please check the file format.');
    }
  };
  reader.readAsText(file);
};
```

## Reset & Defaults - Role-Based System

### Role Defaults

**File:** `frontend/src/routes/dashboard/utils/roleDefaults.ts`

**Default Layouts:**
```typescript
export const roleDefaults: RoleBasedDefaults = {
  technician: [
    {
      region_type: RegionType.SCHEDULING,
      grid_row: 0,
      grid_col: 0,
      row_span: 6,
      col_span: 8,
      // ... defaults
    },
    {
      region_type: RegionType.QUICK_ACTIONS,
      grid_row: 0,
      grid_col: 8,
      row_span: 3,
      col_span: 4,
      // ... defaults
    }
  ],
  manager: [
    // Manager-specific defaults
  ],
  admin: [
    // Admin-specific defaults
  ]
};
```

**Load Defaults:**
```typescript
const loadRoleDefaults = useCallback(async (role: 'technician' | 'manager' | 'admin') => {
  const defaults = roleDefaults[role];
  
  // Clear existing regions
  for (const region of regions) {
    await removeRegion(region.id);
  }
  
  // Add default regions
  for (const defaultRegion of defaults) {
    await addRegion(defaultRegion.region_type, {
      row: defaultRegion.grid_row,
      col: defaultRegion.grid_col
    });
  }
}, [regions, addRegion, removeRegion]);
```

---

# Part 5: Mobile & Responsive Implementation

## Mobile Layout - Responsive Components

### Mobile Detection Hook

**File:** `frontend/src/hooks/useMobileLayout.ts`

**Implementation:**
```typescript
export function useMobileLayout() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  
  useEffect(() => {
    const checkSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);
  
  return { isMobile, isTablet };
}
```

### Mobile Region Component

**File:** `frontend/src/components/dashboard/regions/MobileRegion.tsx`

**Vertical Stacking:**
```typescript
export const MobileRegion: React.FC<MobileRegionProps> = ({ region, ... }) => {
  if (region.is_hidden_mobile) return null;
  
  return (
    <div className="w-full mb-4">
      <RegionContainer region={region} {...props} />
    </div>
  );
};
```

**Grid Layout Breakpoints:**
```typescript
const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const colsMap = { 
  lg: 12,  // Desktop: 12 columns
  md: 10,  // Tablet: 10 columns
  sm: 6,   // Mobile: 6 columns
  xs: 4,   // Small mobile: 4 columns
  xxs: 2   // Tiny: 2 columns
};
```

## Touch Controls - Gesture Handling

### Touch Gestures Hook

**File:** `frontend/src/hooks/useTouchGestures.ts`

**Swipe Detection:**
```typescript
export function useTouchGestures() {
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  
  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 50) setSwipeDirection('right');
        if (deltaX < -50) setSwipeDirection('left');
      }
    };
    
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      setSwipeDirection(null);
    };
    
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  }, []);
  
  return { swipeDirection, handleTouchStart };
}
```

---

# Part 6: Architecture & Patterns

## Component Architecture

### Component Hierarchy

```
RegionDashboard (Main Container)
├── DashboardFAB (Settings Panel)
├── FloatingNavBar (Search & Filters)
├── MinimizedRegionDock (Collapsed Regions)
├── CommandPalette (Ctrl+K)
├── UtilityDock (Tools)
├── InspectorPanel (Properties)
└── RegionGrid (Grid Layout)
    └── RegionContainer (Individual Region)
        ├── RegionHeader (Controls)
        ├── RegionContent (Content Area)
        └── WidgetSandbox (Widget Isolation)
```

### Component Responsibilities

**RegionDashboard:**
- Orchestrates all hooks and components
- Manages global state (filters, search, etc.)
- Handles layout loading and initialization
- Coordinates between different systems

**RegionGrid:**
- Manages grid layout using react-grid-layout
- Handles drag-and-drop events
- Converts between region format and grid layout format
- Manages responsive breakpoints

**RegionContainer:**
- Wraps individual region
- Handles region-specific actions (collapse, lock, delete)
- Manages context menu and settings dialog
- Optimized with React.memo

## State Management Patterns

### Optimistic Updates

**Pattern:**
1. Update local state immediately
2. Queue API call
3. Rollback on error

**Example:**
```typescript
const removeRegion = useCallback(async (id: string) => {
  // 1. Optimistic update
  const regionToRemove = regions.find(r => r.id === id);
  setRegions(prev => prev.filter(r => r.id !== id));
  
  try {
    // 2. API call
    await enhancedApi.dashboardLayouts.deleteRegion(layoutId, id);
  } catch (err) {
    // 3. Rollback on error
    if (regionToRemove) {
      setRegions(prev => [...prev, regionToRemove]);
    }
    throw err;
  }
}, [layoutId, regions]);
```

### Debounced Auto-Save

**Pattern:**
- Collect updates in a Map
- Debounce API calls (500ms default)
- Batch multiple updates into single API call

**Example:**
```typescript
const pendingUpdatesRef = useRef<Map<string, Partial<DashboardRegion>>>(new Map());

const debouncedSave = useMemo(() => {
  return debounce(async () => {
    const updates = Array.from(pendingUpdatesRef.current.entries());
    await Promise.all(
      updates.map(([id, updates]) =>
        enhancedApi.dashboardLayouts.updateRegion(layoutId, id, updates)
      )
    );
    pendingUpdatesRef.current.clear();
  }, debounceMs);
}, [debounceMs, layoutId]);
```

## API Integration

### Enhanced API Client

**File:** `frontend/src/lib/enhanced-api.ts`

**Dashboard Layouts Methods:**
```typescript
export const enhancedApi = {
  dashboardLayouts: {
    getOrCreateDefault: () => api.get('/dashboard/layouts/default'),
    getRegions: (layoutId: string) => 
      api.get(`/dashboard/layouts/${layoutId}/regions`),
    createRegion: (layoutId: string, data: Partial<DashboardRegion>) =>
      api.post(`/dashboard/layouts/${layoutId}/regions`, data),
    updateRegion: (layoutId: string, regionId: string, updates: Partial<DashboardRegion>) =>
      api.put(`/dashboard/layouts/${layoutId}/regions/${regionId}`, updates),
    deleteRegion: (layoutId: string, regionId: string) =>
      api.delete(`/dashboard/layouts/${layoutId}/regions/${regionId}`),
    createVersion: (layoutId: string, data: CreateVersionDto) =>
      api.post(`/dashboard/layouts/${layoutId}/versions`, data),
    publishVersion: (layoutId: string, versionId: string, notes?: string) =>
      api.post(`/dashboard/layouts/${layoutId}/publish`, { versionId, notes }),
    revertToVersion: (layoutId: string, versionId: string) =>
      api.post(`/dashboard/layouts/${layoutId}/revert/${versionId}`),
    acquireLock: (regionId: string, userId: string) =>
      api.post(`/dashboard/regions/${regionId}/lock`, { action: 'acquire', userId }),
    releaseLock: (regionId: string, userId: string) =>
      api.post(`/dashboard/regions/${regionId}/lock`, { action: 'release', userId }),
    getRegionACLs: (regionId: string) =>
      api.get(`/dashboard/regions/${regionId}/acls`),
    shareRegion: (regionId: string, data: ShareRegionDto) =>
      api.post(`/dashboard/regions/${regionId}/share`, data)
  }
};
```

## Performance Optimizations

### React.memo Optimization

**RegionContainer:**
```typescript
export const RegionContainer = React.memo(({ ... }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison
  if (prevProps.region.id !== nextProps.region.id) return false;
  if (prevProps.region.grid_row !== nextProps.region.grid_row) return false;
  // ... more comparisons
  return true; // Props equal, skip re-render
});
```

### useMemo for Filtered Regions

```typescript
const filteredRegions = useMemo(() => {
  return regions.filter(r => {
    if (r.is_collapsed) return false;
    if (searchTerm && !matchesSearch(r)) return false;
    if (activeFilters.has('locked') && !r.is_locked) return false;
    return true;
  });
}, [regions, searchTerm, activeFilters]);
```

### Lazy Loading

**File:** `frontend/src/components/dashboard/regions/LazyRegion.tsx`

```typescript
export const LazyRegion: React.FC<LazyRegionProps> = ({ region, ... }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div ref={ref}>
      {isVisible ? (
        <RegionContainer region={region} {...props} />
      ) : (
        <RegionSkeleton />
      )}
    </div>
  );
};
```

## Error Handling

### Error Boundary

**File:** `frontend/src/components/ErrorBoundary.tsx`

**Usage:**
```typescript
<ErrorBoundary>
  <RegionGrid regions={filteredRegions} {...props} />
</ErrorBoundary>
```

### Error Logging

**Pattern:**
```typescript
try {
  await someOperation();
} catch (error) {
  logger.error('Operation failed', { 
    error, 
    context: 'ComponentName',
    additionalData: { ... }
  }, 'ComponentName');
  toast.error(`Operation failed: ${error.message}`);
}
```

### Toast Notifications

**File:** `frontend/src/utils/toast.tsx`

**Usage:**
```typescript
import { toast } from '@/utils/toast';

toast.success('Region created successfully');
toast.error('Failed to create region');
toast.info('Saving changes...');
toast.warning('Region is locked by another user');
```

---

# Part 7: Reference

## File Structure

### Frontend Structure

```
frontend/src/
├── routes/dashboard/
│   ├── RegionDashboard.tsx          # Main dashboard component
│   ├── types/
│   │   └── region.types.ts          # Type definitions
│   ├── components/
│   │   ├── DashboardFAB.tsx         # Settings panel
│   │   └── ...
│   └── utils/
│       └── roleDefaults.ts          # Role-based defaults
├── components/dashboard/
│   ├── regions/
│   │   ├── RegionContainer.tsx      # Region wrapper
│   │   ├── RegionGrid.tsx           # Grid layout
│   │   ├── RegionContent.tsx        # Content area
│   │   ├── RegionSettingsDialog.tsx # Settings dialog
│   │   ├── MinimizedRegionDock.tsx  # Collapsed dock
│   │   ├── region-grid.css          # Grid styles
│   │   └── ...
│   ├── widgets/
│   │   └── WidgetSandbox.tsx        # Widget isolation
│   └── layered-ui/
│       ├── CommandPalette.tsx       # Ctrl+K palette
│       ├── FloatingNavBar.tsx       # Search & filters
│       ├── UtilityDock.tsx          # Tools dock
│       └── InspectorPanel.tsx       # Properties panel
└── hooks/
    ├── useRegionLayout.ts           # Core layout hook
    ├── useLayoutVersioning.ts       # Version control
    ├── useRegionPresence.ts         # Collaboration
    ├── useRegionPermissions.ts      # ACL management
    ├── useZoomPan.ts                # Zoom/pan
    ├── useUndoRedo.ts               # History
    ├── useCommandPalette.ts         # Command system
    └── ...
```

### Backend Structure

```
backend/src/dashboard/
├── dashboard.service.ts              # Core region CRUD
├── versioning.service.ts             # Version management
├── collaboration.service.ts         # Presence & locks
├── widget-registry.service.ts       # Widget management
├── dashboard-presence.gateway.ts    # WebSocket gateway
├── dto/
│   └── dashboard-region.dto.ts      # DTOs
└── ...
```

## Type Definitions

### Core Types

**File:** `frontend/src/routes/dashboard/types/region.types.ts`

```typescript
export enum RegionType {
  SCHEDULING = 'scheduling',
  REPORTS = 'reports',
  CUSTOMER_SEARCH = 'customer-search',
  SETTINGS = 'settings',
  QUICK_ACTIONS = 'quick-actions',
  ANALYTICS = 'analytics',
  TEAM_OVERVIEW = 'team-overview',
  FINANCIAL_SUMMARY = 'financial-summary',
  CUSTOM = 'custom'
}

export interface DashboardRegion {
  id: string;
  layout_id: string;
  tenant_id: string;
  user_id: string;
  region_type: RegionType;
  grid_row: number;
  grid_col: number;
  row_span: number;
  col_span: number;
  min_width: number;
  min_height: number;
  is_collapsed: boolean;
  is_locked: boolean;
  is_hidden_mobile: boolean;
  config: Record<string, any>;
  widget_type?: string;
  widget_config: Record<string, any>;
  display_order: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}
```

## Hook Reference

### useRegionLayout

**File:** `frontend/src/hooks/useRegionLayout.ts`

**Returns:**
```typescript
{
  regions: DashboardRegion[];
  loading: boolean;
  error: Error | null;
  addRegion: (type: RegionType, position?: { row: number; col: number }) => Promise<void>;
  removeRegion: (id: string) => Promise<void>;
  updateRegionPosition: (id: string, row: number, col: number) => Promise<void>;
  updateRegionSize: (id: string, rowSpan: number, colSpan: number) => Promise<void>;
  toggleCollapse: (id: string) => Promise<void>;
  toggleLock: (id: string) => Promise<void>;
  loadRoleDefaults: (role: string) => Promise<void>;
  reload: () => Promise<void>;
}
```

### useLayoutVersioning

**File:** `frontend/src/hooks/useLayoutVersioning.ts`

**Returns:**
```typescript
{
  versions: LayoutVersion[];
  currentVersion: LayoutVersion | null;
  loading: boolean;
  createVersion: (status: VersionStatus, notes?: string) => Promise<LayoutVersion>;
  publishVersion: (versionId: string, notes?: string) => Promise<LayoutVersion>;
  revertToVersion: (versionId: string) => Promise<LayoutVersion>;
  loadVersions: () => Promise<void>;
}
```

### useZoomPan

**File:** `frontend/src/hooks/useZoomPan.ts`

**Returns:**
```typescript
{
  containerRef: RefObject<HTMLDivElement>;
  zoom: number;
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  handlePanStart: (e: React.MouseEvent) => void;
  getTransformStyle: () => CSSProperties;
  canZoomIn: boolean;
  canZoomOut: boolean;
  pan: { x: number; y: number };
  calculateCanvasSize: (bounds: CanvasBounds) => { width: number; height: number };
}
```

## Component Reference

### RegionContainer Props

```typescript
interface RegionContainerProps {
  region: DashboardRegion;
  children?: ReactNode;
  onResize?: (id: string, rowSpan: number, colSpan: number) => void;
  onMove?: (id: string, row: number, col: number) => void;
  onToggleCollapse?: (id: string) => void;
  onToggleLock?: (id: string) => void;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<DashboardRegion>) => Promise<void>;
  onAddRegion?: (type: string, position?: { row: number; col: number }) => Promise<void>;
  className?: string;
  style?: React.CSSProperties;
}
```

### RegionGrid Props

```typescript
interface RegionGridProps {
  regions: DashboardRegion[];
  rows: number;
  cols: number;
  gap: number;
  onResize?: (id: string, rowSpan: number, colSpan: number) => void;
  onMove?: (id: string, row: number, col: number) => void;
  onToggleCollapse?: (id: string) => void;
  onToggleLock?: (id: string) => void;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<DashboardRegion>) => Promise<void>;
  onAddRegion?: (type: string, position?: { row: number; col: number }) => Promise<void>;
  renderRegion?: (region: DashboardRegion) => ReactNode;
  className?: string;
}
```

---

## Best Practices for Developers

### 1. Always Use Hooks for State Management

Don't manage region state directly in components. Use `useRegionLayout` hook:

```typescript
// ✅ Good
const { regions, addRegion } = useRegionLayout({ layoutId });

// ❌ Bad
const [regions, setRegions] = useState([]);
```

### 2. Implement Optimistic Updates

Always update UI immediately, then sync with server:

```typescript
// ✅ Good
setRegions(prev => [...prev, newRegion]);
try {
  await api.createRegion(newRegion);
} catch (err) {
  setRegions(prev => prev.filter(r => r.id !== newRegion.id));
}
```

### 3. Use Error Boundaries

Wrap region rendering in error boundaries:

```typescript
<ErrorBoundary>
  <RegionGrid regions={regions} />
</ErrorBoundary>
```

### 4. Log Errors Properly

Use logger instead of console:

```typescript
// ✅ Good
logger.error('Failed to save', { error, regionId }, 'ComponentName');

// ❌ Bad
console.error('Failed to save', error);
```

### 5. Show User Feedback

Always show toast notifications for user actions:

```typescript
try {
  await addRegion(type);
  toast.success('Region added successfully');
} catch (error) {
  toast.error(`Failed to add region: ${error.message}`);
}
```

### 6. Optimize Re-renders

Use React.memo and useMemo appropriately:

```typescript
const filteredRegions = useMemo(() => {
  return regions.filter(/* ... */);
}, [regions, searchTerm]);

export const RegionContainer = React.memo(({ ... }) => {
  // ...
}, customComparison);
```

### 7. Handle Loading States

Always show loading indicators:

```typescript
if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
return <RegionGrid regions={regions} />;
```

---

## Related Documentation

- [User Guide](../user/DASHBOARD_REGIONS_GUIDE.md) - End-user documentation
- [Architecture Documentation](../DASHBOARD_REGIONS.md) - System architecture
- [Widget SDK](./WIDGET_SDK.md) - Creating custom widgets
- [Security Guide](../security/WIDGET_SECURITY.md) - Security best practices

---

**Last Updated:** 2024-01-15  
**Version:** 2.0  
**Author:** VeroField Development Team




