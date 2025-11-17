/**
 * Shared utilities for scheduling components
 * Last Updated: 2025-01-27
 */


/**
 * Get date range start based on view type
 */
export function getDateRangeStart(date: Date, view: 'month' | 'week' | 'day' | 'list'): Date {
  const d = new Date(date);
  switch (view) {
    case 'month':
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
      return d;
    case 'week':
      const day = d.getDay();
      d.setDate(d.getDate() - day);
      d.setHours(0, 0, 0, 0);
      return d;
    case 'day':
      d.setHours(0, 0, 0, 0);
      return d;
    case 'list':
      // For list view, show a wider range (30 days back)
      d.setDate(d.getDate() - 30);
      d.setHours(0, 0, 0, 0);
      return d;
    default:
      return d;
  }
}

/**
 * Get date range end based on view type
 */
export function getDateRangeEnd(date: Date, view: 'month' | 'week' | 'day' | 'list'): Date {
  const d = new Date(date);
  switch (view) {
    case 'month':
      d.setMonth(d.getMonth() + 1);
      d.setDate(0);
      d.setHours(23, 59, 59, 999);
      return d;
    case 'week':
      d.setDate(d.getDate() - d.getDay() + 6);
      d.setHours(23, 59, 59, 999);
      return d;
    case 'day':
      d.setHours(23, 59, 59, 999);
      return d;
    case 'list':
      // For list view, show a wider range (30 days forward)
      d.setDate(d.getDate() + 30);
      d.setHours(23, 59, 59, 999);
      return d;
    default:
      return d;
  }
}

/**
 * Get job color based on status, priority, and conflicts
 */
export function getJobColor(
  status: string,
  priority: string,
  hasConflict?: boolean
): string {
  // Override with conflict color if conflict exists
  if (hasConflict) return '#ef4444'; // Red for conflicts

  if (status === 'completed') return '#22c55e';
  if (status === 'cancelled') return '#ef4444';
  if (status === 'in_progress') return '#3b82f6';

  switch (priority) {
    case 'urgent':
      return '#dc2626';
    case 'high':
      return '#ea580c';
    case 'medium':
      return '#d97706';
    case 'low':
      return '#65a30d';
    default:
      return '#6b7280';
  }
}

/**
 * Get conflict border color class based on severity
 */
export function getConflictBorderColor(severity?: string): string {
  switch (severity) {
    case 'critical':
      return 'border-red-500 border-2';
    case 'high':
      return 'border-orange-500 border-2';
    case 'medium':
      return 'border-yellow-500 border-2';
    case 'low':
      return 'border-blue-500 border';
    default:
      return '';
  }
}

/**
 * Format time string for display
 */
export function formatTime(timeString?: string): string {
  if (!timeString) return '00:00';
  // Handle both HH:MM:SS and HH:MM formats
  const parts = timeString.split(':');
  return `${parts[0]}:${parts[1] || '00'}`;
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Check if two time ranges overlap
 */
export function timeRangesOverlap(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): boolean {
  return start1 < end2 && start2 < end1;
}

/**
 * Calculate duration in minutes between two dates
 */
export function calculateDurationMinutes(start: Date, end: Date): number {
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
}

/**
 * Parse time string to Date object
 */
export function parseTimeString(date: Date, timeString: string): Date {
  const [hours, minutes] = timeString.split(':').map(Number);
  const result = new Date(date);
  result.setHours(hours || 0, minutes || 0, 0, 0);
  return result;
}

/**
 * Filter jobs by multiple criteria
 */
export function filterJobs(
  jobs: any[],
  filters: {
    searchQuery?: string;
    filterStatus?: string;
    filterPriority?: string;
    filterTechnician?: string;
  }
): any[] {
  const {
    searchQuery = '',
    filterStatus = 'all',
    filterPriority = 'all',
    filterTechnician
  } = filters;

  return jobs.filter((job: any) => {
    // Handle different data structures
    const customerName = job.customer?.name || job.account?.name || job.account_name || '';
    const serviceType = job.service?.type || job.service_type || job.service_name || '';
    const locationAddress = job.location?.address || job.location_address || job.address || '';
    const jobStatus = job.status || '';
    const jobPriority = job.priority || '';
    const jobTechnicianId = job.technician_id || '';

    // Search matching
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === '' ||
      customerName.toLowerCase().includes(searchLower) ||
      serviceType.toLowerCase().includes(searchLower) ||
      locationAddress.toLowerCase().includes(searchLower) ||
      job.id?.toLowerCase().includes(searchLower);

    // Status matching
    const matchesStatus = filterStatus === 'all' || jobStatus === filterStatus;

    // Priority matching
    const matchesPriority = filterPriority === 'all' || jobPriority === filterPriority;

    // Technician matching
    const matchesTechnician = !filterTechnician || jobTechnicianId === filterTechnician;

    return matchesSearch && matchesStatus && matchesPriority && matchesTechnician;
  });
}

/**
 * Sort jobs by scheduled date and time
 */
export function sortJobsByDateTime(jobs: any[]): any[] {
  return [...jobs].sort((a: any, b: any) => {
    const dateA = new Date(`${a.scheduled_date}T${a.scheduled_start_time || '00:00:00'}`);
    const dateB = new Date(`${b.scheduled_date}T${b.scheduled_start_time || '00:00:00'}`);
    return dateA.getTime() - dateB.getTime();
  });
}

/**
 * Get technician name from technician object or ID
 */
export function getTechnicianName(
  technician: any,
  technicians: any[]
): string {
  if (technician) {
    return `${technician.first_name || ''} ${technician.last_name || ''}`.trim() ||
           technician.email ||
           'Unknown';
  }
  return 'Unassigned';
}

/**
 * Get technician by ID from technicians array
 */
export function getTechnicianById(
  technicianId: string | undefined,
  technicians: any[]
): any | undefined {
  if (!technicianId) return undefined;
  return technicians.find((t: any) => (t.id || t.user_id) === technicianId);
}





