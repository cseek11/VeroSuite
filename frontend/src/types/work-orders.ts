export enum WorkOrderStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export enum WorkOrderPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface WorkOrder {
  id: string;
  work_order_number?: string;
  tenant_id: string;
  customer_id: string;
  location_id?: string;
  service_type?: string;
  assigned_to?: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  scheduled_date?: string;
  completion_date?: string;
  description: string;
  notes?: string;
  estimated_duration?: number;
  service_price?: number;
  recurrence_rule?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  
  // Related data
  account?: {
    id: string;
    name: string;
    account_type: string;
    phone?: string;
    email?: string;
  };
  assignedTechnician?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
  jobs?: Array<{
    id: string;
    status: string;
    scheduled_date: string;
    scheduled_start_time?: string;
    scheduled_end_time?: string;
  }>;
}

export interface CreateWorkOrderRequest {
  work_order_number?: string;
  customer_id: string;
  assigned_to?: string;
  status?: WorkOrderStatus;
  priority?: WorkOrderPriority;
  scheduled_date?: string;
  description: string;
  notes?: string;
  service_type?: string;
  recurrence_rule?: string;
  estimated_duration?: number;
  service_price?: number;
}

export interface UpdateWorkOrderRequest {
  customer_id?: string;
  assigned_to?: string;
  status?: WorkOrderStatus;
  priority?: WorkOrderPriority;
  scheduled_date?: string;
  completion_date?: string;
  description?: string;
  notes?: string;
  service_type?: string;
  recurrence_rule?: string;
  estimated_duration?: number;
  service_price?: number;
}

export interface WorkOrderFilters {
  status?: WorkOrderStatus;
  priority?: WorkOrderPriority;
  assigned_to?: string;
  customer_id?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}

export interface WorkOrderListResponse {
  data: WorkOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface WorkOrderStatusChange {
  workOrderId: string;
  newStatus: WorkOrderStatus;
  notes?: string;
}

export interface WorkOrderAssignment {
  workOrderId: string;
  technicianId: string;
  scheduledDate?: string;
  notes?: string;
}

// Status display helpers
export const getStatusColor = (status: WorkOrderStatus): string => {
  switch (status) {
    case WorkOrderStatus.PENDING:
      return 'yellow';
    case WorkOrderStatus.IN_PROGRESS:
      return 'blue';
    case WorkOrderStatus.COMPLETED:
      return 'green';
    case WorkOrderStatus.CANCELED:
      return 'red';
    default:
      return 'gray';
  }
};

export const getStatusLabel = (status: WorkOrderStatus): string => {
  switch (status) {
    case WorkOrderStatus.PENDING:
      return 'Pending';
    case WorkOrderStatus.IN_PROGRESS:
      return 'In Progress';
    case WorkOrderStatus.COMPLETED:
      return 'Completed';
    case WorkOrderStatus.CANCELED:
      return 'Canceled';
    default:
      return 'Unknown';
  }
};

export const getPriorityColor = (priority: WorkOrderPriority): string => {
  switch (priority) {
    case WorkOrderPriority.LOW:
      return 'green';
    case WorkOrderPriority.MEDIUM:
      return 'yellow';
    case WorkOrderPriority.HIGH:
      return 'orange';
    case WorkOrderPriority.URGENT:
      return 'red';
    default:
      return 'gray';
  }
};

export const getPriorityLabel = (priority: WorkOrderPriority): string => {
  switch (priority) {
    case WorkOrderPriority.LOW:
      return 'Low';
    case WorkOrderPriority.MEDIUM:
      return 'Medium';
    case WorkOrderPriority.HIGH:
      return 'High';
    case WorkOrderPriority.URGENT:
      return 'Urgent';
    default:
      return 'Unknown';
  }
};

// Status workflow helpers
export const getNextStatuses = (currentStatus: WorkOrderStatus): WorkOrderStatus[] => {
  switch (currentStatus) {
    case WorkOrderStatus.PENDING:
      return [WorkOrderStatus.IN_PROGRESS, WorkOrderStatus.CANCELED];
    case WorkOrderStatus.IN_PROGRESS:
      return [WorkOrderStatus.COMPLETED, WorkOrderStatus.CANCELED];
    case WorkOrderStatus.COMPLETED:
      return []; // No transitions from completed
    case WorkOrderStatus.CANCELED:
      return [WorkOrderStatus.PENDING]; // Can reactivate canceled orders
    default:
      return [];
  }
};

export const canChangeStatus = (from: WorkOrderStatus, to: WorkOrderStatus): boolean => {
  return getNextStatuses(from).includes(to);
};

