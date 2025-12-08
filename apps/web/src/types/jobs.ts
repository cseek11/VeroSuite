export interface Job {
  id: string;
  work_order_id: string;
  technician_id?: string | undefined;
  scheduled_date: string;
  scheduled_start_time: string;
  scheduled_end_time: string;
  actual_start_time?: string | undefined;
  actual_end_time?: string | undefined;
  status: JobStatus;
  notes?: string | undefined;
  created_at: string;
  updated_at: string;
  
  // Related data
  work_order?: {
    id: string;
    description: string;
    priority: string;
    status: string;
    account?: {
      id: string;
      name: string;
      account_type: string;
      phone?: string | undefined;
      email?: string | undefined;
    };
  } | undefined;
  technician?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string | undefined;
  } | undefined;
}

export enum JobStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export interface CreateJobRequest {
  work_order_id: string;
  account_id: string;
  location_id: string;
  technician_id?: string | undefined;
  scheduled_date: string;
  scheduled_start_time?: string | undefined;
  scheduled_end_time?: string | undefined;
  priority?: 'low' | 'medium' | 'high' | 'urgent' | undefined;
  status?: JobStatus | undefined;
  notes?: string | undefined;
}

export interface UpdateJobRequest {
  technician_id?: string | undefined;
  scheduled_date?: string | undefined;
  scheduled_start_time?: string | undefined;
  scheduled_end_time?: string | undefined;
  actual_start_time?: string | undefined;
  actual_end_time?: string | undefined;
  status?: JobStatus | undefined;
  notes?: string | undefined;
}

export interface JobFilters {
  technician_id?: string | undefined;
  status?: JobStatus | undefined;
  start_date?: string | undefined;
  end_date?: string | undefined;
  page?: number | undefined;
  limit?: number | undefined;
}

export interface JobListResponse {
  data: Job[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Job status display helpers
export const getJobStatusColor = (status: JobStatus): string => {
  switch (status) {
    case JobStatus.SCHEDULED:
      return 'blue';
    case JobStatus.IN_PROGRESS:
      return 'yellow';
    case JobStatus.COMPLETED:
      return 'green';
    case JobStatus.CANCELED:
      return 'red';
    default:
      return 'gray';
  }
};

export const getJobStatusLabel = (status: JobStatus): string => {
  switch (status) {
    case JobStatus.SCHEDULED:
      return 'Scheduled';
    case JobStatus.IN_PROGRESS:
      return 'In Progress';
    case JobStatus.COMPLETED:
      return 'Completed';
    case JobStatus.CANCELED:
      return 'Canceled';
    default:
      return 'Unknown';
  }
};

// Job status workflow helpers
export const getNextJobStatuses = (currentStatus: JobStatus): JobStatus[] => {
  switch (currentStatus) {
    case JobStatus.SCHEDULED:
      return [JobStatus.IN_PROGRESS, JobStatus.CANCELED];
    case JobStatus.IN_PROGRESS:
      return [JobStatus.COMPLETED, JobStatus.CANCELED];
    case JobStatus.COMPLETED:
      return []; // No transitions from completed
    case JobStatus.CANCELED:
      return [JobStatus.SCHEDULED]; // Can reschedule canceled jobs
    default:
      return [];
  }
};

export const canChangeJobStatus = (from: JobStatus, to: JobStatus): boolean => {
  return getNextJobStatuses(from).includes(to);
};






