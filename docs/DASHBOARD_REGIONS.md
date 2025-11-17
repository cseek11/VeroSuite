# Dashboard Regions Architecture

## Overview

The Enterprise Region-Based Dashboard System replaces the free-floating card system with a structured, grid-based region architecture. This system provides enterprise-grade features including multi-user collaboration, versioning, fine-grained permissions, widget sandboxing, and comprehensive security.

## Architecture

### Core Concepts

**Regions**: Fixed-size containers in a grid layout that hold widgets. Regions can be resized, reordered, collapsed, and locked.

**Widgets**: Sandboxed components that render within regions. Widgets are isolated via iframe with strict CSP policies.

**Layouts**: Collections of regions organized in a grid. Layouts support versioning with draft/preview/published states.

**ACLs**: Fine-grained permissions (read/edit/share) per region, allowing sharing with users, roles, or teams.

### Database Schema

#### Core Tables

- `dashboard_regions` - Region definitions with grid positioning
- `dashboard_layout_versions` - Version history with diff tracking
- `dashboard_region_acls` - Access control lists
- `dashboard_widget_registry` - Approved widget manifests
- `dashboard_region_presence` - Real-time collaboration state
- `dashboard_layout_audit` - Audit trail for all changes
- `dashboard_migration_logs` - Card-to-region migration tracking

All tables include `tenant_id` for multi-tenant isolation with RLS policies.

### Backend Services

#### DashboardService
- Region CRUD operations
- Role-based default layouts
- Permission checking
- ACL management

#### VersioningService
- Create versions (draft/preview/published)
- Publish versions
- Revert to previous versions
- Calculate diffs between versions

#### CollaborationService
- Presence tracking
- Soft locking mechanism
- Conflict detection
- Stale presence cleanup

#### WidgetRegistryService
- Widget manifest validation
- Widget signing
- Approval workflow
- Config validation

### Frontend Components

#### Core Components
- `RegionContainer` - Main region wrapper
- `RegionGrid` - Grid layout system
- `RegionHeader` - Header with controls
- `RegionContent` - Content area
- `LazyRegion` - Lazy-loaded region
- `MobileRegion` - Mobile-optimized region

#### Widget System
- `WidgetSandbox` - iframe isolation with CSP

#### UI Components
- `VersionHistory` - Version list and navigation
- `PublishDialog` - Publish workflow
- `VersionDiffView` - Diff visualization
- `PresenceIndicator` - Collaboration indicators
- `ConflictAlert` - Conflict resolution UI
- `LockIndicator` - Lock status
- `RegionACLControls` - Permission management
- `ShareRegionDialog` - Sharing interface
- `CardToRegionMigration` - Migration wizard

### Hooks

- `useRegionLayout` - Main layout management
- `useLayoutVersioning` - Version control
- `useRegionPresence` - Collaboration
- `useRegionPermissions` - ACL management
- `useDashboardTelemetry` - Performance tracking
- `useMobileLayout` - Responsive detection

## Security

### Widget Sandboxing
- All widgets render in iframe with strict CSP
- postMessage API for parent-child communication
- Origin validation for messages
- Widget manifest validation and signing

### Data Validation
- Server-side JSONB schema validation
- XSS prevention via sanitization
- CSP header injection
- Widget config validation

### Permissions
- Fine-grained ACLs per region
- Tenant isolation via RLS
- User/role/team-based sharing
- Audit trail for all changes

## Performance

### Optimizations
- Lazy loading with Intersection Observer
- Web Workers for heavy computations
- Debounced server persistence
- Frame budget monitoring
- Server-side rendering for skeletons

### Metrics
- First meaningful paint tracking
- Region load times
- Widget initialization times
- Interaction latencies

## Migration

### Card-to-Region Conversion
- Automatic grouping by card type
- Preserves user customizations
- Editable preview before migration
- Rollback capability
- Migration logging

## Collaboration

### Features
- Real-time presence indicators
- Soft locking (5-minute timeout)
- Conflict detection
- Optimistic UI updates
- Last-write-wins strategy

## Versioning

### Workflow
1. **Draft** - Work in progress
2. **Preview** - Test before publishing
3. **Published** - Live version for all users

### Features
- Full version history
- Diff visualization
- One-click revert
- Version notes
- Automatic snapshots

## API Endpoints

### Regions
- `POST /api/dashboard/layouts/:layoutId/regions` - Create region
- `GET /api/dashboard/layouts/:layoutId/regions` - List regions
- `PUT /api/dashboard/layouts/:layoutId/regions/:id` - Update region
- `DELETE /api/dashboard/layouts/:layoutId/regions/:id` - Delete region
- `POST /api/dashboard/layouts/:layoutId/regions/reorder` - Reorder regions

### Versioning
- `GET /api/dashboard/layouts/:layoutId/versions` - List versions
- `POST /api/dashboard/layouts/:layoutId/versions` - Create version
- `POST /api/dashboard/layouts/:layoutId/publish` - Publish version
- `POST /api/dashboard/layouts/:layoutId/revert/:versionId` - Revert to version

### Collaboration
- `GET /api/dashboard/regions/:id/presence` - Get presence
- `POST /api/dashboard/regions/:id/lock` - Acquire/release lock

### Permissions
- `GET /api/dashboard/regions/:id/acl` - Get ACLs
- `PUT /api/dashboard/regions/:id/acl` - Set ACL

### Widgets
- `POST /api/dashboard/widgets/register` - Register widget
- `GET /api/dashboard/widgets/approved` - Get approved widgets

## Usage Examples

### Creating a Region
```typescript
const { addRegion } = useRegionLayout({ layoutId, autoSave: true });
await addRegion(RegionType.SCHEDULING, { row: 0, col: 0 });
```

### Versioning
```typescript
const { createVersion, publishVersion } = useLayoutVersioning({ layoutId });
const version = await createVersion(VersionStatus.DRAFT, 'Initial draft');
await publishVersion(version.id, 'Ready for production');
```

### Collaboration
```typescript
const { acquireLock, releaseLock } = useRegionPresence({
  regionId,
  userId,
  sessionId
});
const locked = await acquireLock();
// ... edit region ...
await releaseLock();
```

## Best Practices

1. **Always create versions before major changes**
2. **Use lazy loading for regions below the fold**
3. **Validate widget configs server-side**
4. **Monitor performance metrics**
5. **Use ACLs to restrict sensitive regions**
6. **Test migrations in preview mode first**

## Related Documentation

- [User Guide](user/DASHBOARD_REGIONS_GUIDE.md)
- [Widget SDK](developer/WIDGET_SDK.md)
- [Security Guide](security/WIDGET_SECURITY.md)





