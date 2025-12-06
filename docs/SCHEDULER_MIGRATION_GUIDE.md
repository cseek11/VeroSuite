# Scheduler Migration Guide

**Last Updated:** 2025-12-05  
**Status:** Active Migration

## Overview

This guide helps developers migrate from deprecated scheduler components to the unified `ScheduleCalendar` component.

## Deprecated Components

### JobScheduler
- **Location:** `frontend/src/components/scheduler/JobScheduler.tsx`
- **Status:** Deprecated
- **Replacement:** `ScheduleCalendar` from `@/components/scheduling/ScheduleCalendar`

## Migration Steps

### 1. Update Imports

**Before:**
```typescript
import JobScheduler from '@/components/scheduler/JobScheduler';
```

**After:**
```typescript
import { ScheduleCalendar } from '@/components/scheduling/ScheduleCalendar';
```

### 2. Component Replacement

**Before:**
```typescript
<JobScheduler
  onJobSelect={handleJobSelect}
  onJobEdit={handleJobEdit}
  onJobCreate={handleJobCreate}
/>
```

**After:**
```typescript
<ScheduleCalendar
  selectedDate={selectedDate}
  onDateChange={setSelectedDate}
  onJobSelect={handleJobSelect}
  onJobEdit={handleJobEdit}
  onJobCreate={handleJobCreate}
  searchQuery={searchQuery}
  filterStatus={filterStatus}
  filterPriority={filterPriority}
/>
```

### 3. Feature Mapping

| JobScheduler Feature | ScheduleCalendar Equivalent |
|---------------------|---------------------------|
| `onJobSelect` | `onJobSelect` (same) |
| `onJobEdit` | `onJobEdit` (same) |
| `onJobCreate` | `onJobCreate` (same) |
| Month/Week/Day views | `currentView` prop (month/week/day/list) |
| List view | Built-in list view mode |
| Search | `searchQuery` prop |
| Filters | `filterStatus`, `filterPriority`, `filterTechnician` props |

### 4. New Features Available

ScheduleCalendar provides additional features not available in JobScheduler:

- **Analytics Dashboard:** `showAnalytics={true}`, `analyticsMode="embedded" | "dashboard"`
- **Bulk Selection:** `enableBulkSelection={true}`, `onBulkSelect={handleBulkSelect}`
- **Map Integration:** `showMap={true}`, `mapMode="overlay" | "tab" | "side"`
- **Technician Metrics:** `showTechnicianMetrics={true}`
- **Conflict Detection:** Built-in conflict detection and resolution
- **Recurring Jobs:** Full recurring job series management

## Examples

### Basic Calendar
```typescript
import { ScheduleCalendar } from '@/components/scheduling/ScheduleCalendar';

function MyComponent() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  return (
    <ScheduleCalendar
      selectedDate={selectedDate}
      onDateChange={setSelectedDate}
    />
  );
}
```

### Calendar with Analytics
```typescript
<ScheduleCalendar
  selectedDate={selectedDate}
  onDateChange={setSelectedDate}
  showAnalytics={true}
  analyticsMode="embedded"
/>
```

### Calendar with Bulk Selection
```typescript
const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);

<ScheduleCalendar
  selectedDate={selectedDate}
  onDateChange={setSelectedDate}
  enableBulkSelection={true}
  onBulkSelect={setSelectedJobIds}
/>
```

### Calendar Filtered by Technician
```typescript
<ScheduleCalendar
  selectedDate={selectedDate}
  onDateChange={setSelectedDate}
  filterTechnician={technicianId}
  showTechnicianMetrics={true}
/>
```

## Breaking Changes

1. **Props Structure:** ScheduleCalendar uses a different prop structure. Review the props interface before migration.
2. **View Modes:** List view is now part of ScheduleCalendar instead of a separate component.
3. **Styling:** ScheduleCalendar uses consistent styling. Custom styles may need adjustment.

## Support

For questions or issues during migration, refer to:
- `frontend/src/components/scheduling/ScheduleCalendar.tsx` - Component source
- `frontend/src/components/scheduling/index.ts` - Exported types and utilities
- `docs/guides/development/SCHEDULER_FEATURE_COMPARISON.md` - Feature comparison

---

**Last Updated:** 2025-12-05





