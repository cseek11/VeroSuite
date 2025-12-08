// Scheduling Components Export
export { ScheduleCalendar } from './ScheduleCalendar';
export { TimeSlotManager } from './TimeSlotManager';
export { TechnicianScheduler } from './TechnicianScheduler';
export { ConflictDetector } from './ConflictDetector';
export { ResourceTimeline } from './ResourceTimeline';
export { default as BulkScheduler } from './BulkScheduler';
export { default as AvailabilityManager } from './AvailabilityManager';
export { default as SchedulingAnalytics } from './SchedulingAnalytics';
export { default as SchedulingReports } from './SchedulingReports';
export { default as OptimizationSuggestions } from './OptimizationSuggestions';

// Types
export type { Job, JobWithRelations, Technician, CalendarEvent } from './ScheduleCalendar';

// Utilities
export {
  getDateRangeStart,
  getDateRangeEnd,
  getJobColor,
  getConflictBorderColor,
  formatTime,
  formatDate,
  timeRangesOverlap,
  calculateDurationMinutes,
  parseTimeString,
  filterJobs,
  sortJobsByDateTime,
  getTechnicianName,
  getTechnicianById
} from './utils';





