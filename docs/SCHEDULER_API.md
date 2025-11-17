# ScheduleCalendar API Documentation

**Last Updated:** 2025-01-27  
**Component:** `frontend/src/components/scheduling/ScheduleCalendar.tsx`

## Overview

`ScheduleCalendar` is the unified scheduler component used throughout VeroField. It provides a comprehensive calendar interface with drag-and-drop scheduling, conflict detection, recurring jobs, analytics, and more.

## Import

```typescript
import { ScheduleCalendar } from '@/components/scheduling/ScheduleCalendar';
```

## Props Interface

```typescript
interface ScheduleCalendarProps {
  // Core props
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
  onJobSelect?: (job: Job) => void;
  onJobEdit?: (job: Job) => void;
  onJobCreate?: () => void;
  
  // Filtering
  searchQuery?: string;
  filterStatus?: string;
  filterPriority?: string;
  filterTechnician?: string;
  
  // Enterprise features
  showAnalytics?: boolean;
  analyticsMode?: 'dashboard' | 'embedded';
  showMap?: boolean;
  mapMode?: 'overlay' | 'tab' | 'side';
  enableBulkSelection?: boolean;
  onBulkSelect?: (jobIds: string[]) => void;
  showTechnicianMetrics?: boolean;
}
```

## Props Reference

### Core Props

#### `selectedDate?: Date`
- **Default:** `new Date()`
- **Description:** Currently selected date in the calendar
- **Usage:** Controls which date/week/month is displayed

#### `onDateChange?: (date: Date) => void`
- **Description:** Callback when user changes the selected date
- **Usage:** Update parent component's date state

#### `onJobSelect?: (job: Job) => void`
- **Description:** Callback when a job is selected/clicked
- **Usage:** Open job details dialog or navigate to job page

#### `onJobEdit?: (job: Job) => void`
- **Description:** Callback when user wants to edit a job
- **Usage:** Open job edit dialog or navigate to edit page

#### `onJobCreate?: () => void`
- **Description:** Callback when user wants to create a new job
- **Usage:** Open job creation dialog

### Filtering Props

#### `searchQuery?: string`
- **Default:** `''`
- **Description:** Search query to filter jobs
- **Searches:** Customer name, service type, location address, job ID

#### `filterStatus?: string`
- **Default:** `'all'`
- **Description:** Filter jobs by status
- **Values:** `'all' | 'unassigned' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'`

#### `filterPriority?: string`
- **Default:** `'all'`
- **Description:** Filter jobs by priority
- **Values:** `'all' | 'low' | 'medium' | 'high' | 'urgent'`

#### `filterTechnician?: string`
- **Description:** Filter jobs by technician ID
- **Usage:** Show only jobs assigned to a specific technician

### Enterprise Features

#### `showAnalytics?: boolean`
- **Default:** `false`
- **Description:** Show scheduling analytics dashboard
- **Usage:** Display utilization metrics, on-time rates, etc.

#### `analyticsMode?: 'dashboard' | 'embedded'`
- **Default:** `'embedded'`
- **Description:** How to display analytics
- **Values:**
  - `'dashboard'`: Show as separate section above calendar
  - `'embedded'`: Show embedded within calendar view

#### `showMap?: boolean`
- **Default:** `false`
- **Description:** Show map integration
- **Usage:** Display map with job locations

#### `mapMode?: 'overlay' | 'tab' | 'side'`
- **Default:** `'overlay'`
- **Description:** How to display map
- **Values:**
  - `'overlay'`: Overlay on top of calendar
  - `'tab'`: Show in separate tab
  - `'side'`: Show side-by-side with calendar

#### `enableBulkSelection?: boolean`
- **Default:** `false`
- **Description:** Enable multi-select mode for bulk operations
- **Usage:** Allow selecting multiple jobs at once

#### `onBulkSelect?: (jobIds: string[]) => void`
- **Description:** Callback when bulk selection changes
- **Usage:** Handle bulk operations (assign, reschedule, etc.)

#### `showTechnicianMetrics?: boolean`
- **Default:** `false`
- **Description:** Show technician performance metrics
- **Usage:** Display utilization, completion rates, etc.

## View Modes

ScheduleCalendar supports multiple view modes:

- **Month:** Full month calendar view
- **Week:** Week view with time slots
- **Day:** Single day view with hourly time slots
- **List:** Table/list view of all jobs

Users can switch between views using the view buttons in the calendar header.

## Features

### Drag and Drop
- Drag jobs between time slots
- Drag jobs between dates
- Automatic conflict detection on drop
- Visual feedback during drag

### Conflict Detection
- Real-time conflict checking
- Visual conflict indicators (red borders, badges)
- Conflict resolution dialog
- Prevents double-booking

### Recurring Jobs
- Create recurring job series
- Edit individual occurrences
- Edit entire series
- Manage recurring templates

### Analytics
- Utilization rates
- On-time completion rates
- Average job duration
- Technician performance metrics

### Bulk Operations
- Multi-select jobs
- Bulk assignment
- Bulk reschedule
- Bulk status updates

## Usage Examples

### Basic Calendar
```typescript
<ScheduleCalendar
  selectedDate={selectedDate}
  onDateChange={setSelectedDate}
/>
```

### Calendar with Filters
```typescript
<ScheduleCalendar
  selectedDate={selectedDate}
  onDateChange={setSelectedDate}
  searchQuery={searchQuery}
  filterStatus={filterStatus}
  filterPriority={filterPriority}
/>
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

### Technician-Filtered Calendar
```typescript
<ScheduleCalendar
  selectedDate={selectedDate}
  onDateChange={setSelectedDate}
  filterTechnician={technicianId}
  showTechnicianMetrics={true}
/>
```

## Data Types

### Job Interface
```typescript
interface Job {
  id: string;
  status: 'unassigned' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduled_date: string;
  scheduled_start_time?: string;
  scheduled_end_time?: string;
  technician_id?: string;
  is_recurring?: boolean;
  recurring_template_id?: string;
  customer: {
    id: string;
    name: string;
    phone?: string;
  };
  location: {
    id: string;
    name: string;
    address: string;
    coordinates: { lat: number; lng: number };
  };
  service: {
    type: string;
    description: string;
    estimated_duration: number;
    price?: number;
  };
}
```

### Technician Interface
```typescript
interface Technician {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_active: boolean;
}
```

### CalendarEvent Interface
```typescript
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  technicianId?: string;
  technicianName?: string;
  status: string;
  priority: string;
  customer: string;
  location: string;
  color: string;
  job: Job;
  hasConflict?: boolean;
  conflictType?: 'time_overlap' | 'technician_double_booking' | 'location_conflict';
  conflictSeverity?: 'low' | 'medium' | 'high' | 'critical';
  availabilityIssue?: string;
  isRecurring?: boolean;
}
```

## Shared Utilities

ScheduleCalendar exports shared utilities from `@/components/scheduling/utils`:

- `getDateRangeStart(date, view)` - Get start date for view range
- `getDateRangeEnd(date, view)` - Get end date for view range
- `getJobColor(status, priority, hasConflict)` - Get color for job display
- `getConflictBorderColor(severity)` - Get border color for conflicts
- `formatTime(timeString)` - Format time string
- `formatDate(date)` - Format date string
- `filterJobs(jobs, filters)` - Filter jobs by criteria
- `sortJobsByDateTime(jobs)` - Sort jobs by date/time
- `getTechnicianName(technician, technicians)` - Get technician display name
- `getTechnicianById(id, technicians)` - Find technician by ID

## Integration Points

### With JobsCalendarCard
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

### With Scheduler Route
```typescript
<ScheduleCalendar
  selectedDate={selectedDate}
  onDateChange={setSelectedDate}
  searchQuery={searchQuery}
  filterStatus={filterStatus}
  showAnalytics={true}
  analyticsMode="embedded"
/>
```

### With TechnicianScheduler
```typescript
<ScheduleCalendar
  selectedDate={selectedDate}
  filterStatus="unassigned"
  filterTechnician={selectedTechnician}
  showTechnicianMetrics={true}
  enableBulkSelection={true}
  onBulkSelect={handleBulkSelect}
/>
```

### With BulkScheduler
```typescript
<ScheduleCalendar
  selectedDate={selectedDate}
  searchQuery={searchTerm}
  filterStatus={filterStatus}
  enableBulkSelection={true}
  onBulkSelect={handleBulkSelect}
/>
```

## Performance Considerations

- Uses React Query for efficient data fetching
- Implements `keepPreviousData` to prevent flickering
- Memoized filtering and calculations
- Date range queries to minimize data fetching
- Virtualized rendering for large job lists (future enhancement)

## Accessibility

- Keyboard navigation support
- ARIA labels on interactive elements
- Screen reader friendly
- Focus management

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Related Documentation

- `SCHEDULER_FEATURE_COMPARISON.md` - Feature comparison with enterprise schedulers
- `SCHEDULER_MIGRATION_GUIDE.md` - Migration guide from deprecated components
- `MASTER_DEVELOPMENT_PLAN.md` - Overall development status

---

**Last Updated:** 2025-01-27





