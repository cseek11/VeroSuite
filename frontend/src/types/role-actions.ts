// Role-Based Quick Actions Types
export interface Permission {
  resource: string;
  action: string;
  conditions?: Record<string, any>;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
  context: 'global' | 'card-specific';
}

export interface RoleAction {
  id: string;
  label: string;
  icon: string;
  endpoint: string;
  permissions: string[];
  context: 'card' | 'global';
  category: 'dispatch' | 'technician' | 'owner' | 'admin';
  requiresSelection?: boolean;
  confirmMessage?: string;
  successMessage?: string;
}

export interface CardContext {
  selectedItems: any[];
  activeFilters: Record<string, any>;
  userRole: string;
  permissions: string[];
  cardId?: string;
}

export interface ActionExecutionResult {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

export interface QuickActionConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  roles: string[];
  permissions: string[];
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  requiresSelection: boolean;
  confirmMessage?: string;
  successMessage?: string;
  enabled: boolean;
  tenantId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Predefined roles for pest control business
export const PREDEFINED_ROLES: Role[] = [
  {
    id: 'dispatcher',
    name: 'Dispatcher',
    permissions: [
      { resource: 'jobs', action: 'assign' },
      { resource: 'jobs', action: 'update' },
      { resource: 'technicians', action: 'view' },
      { resource: 'technicians', action: 'message' },
      { resource: 'customers', action: 'view' },
      { resource: 'customers', action: 'contact' }
    ],
    context: 'global'
  },
  {
    id: 'technician',
    name: 'Technician',
    permissions: [
      { resource: 'jobs', action: 'view' },
      { resource: 'jobs', action: 'update' },
      { resource: 'jobs', action: 'complete' },
      { resource: 'inventory', action: 'view' },
      { resource: 'inventory', action: 'request' },
      { resource: 'customers', action: 'view' }
    ],
    context: 'card-specific'
  },
  {
    id: 'owner',
    name: 'Owner',
    permissions: [
      { resource: 'reports', action: 'generate' },
      { resource: 'invoices', action: 'approve' },
      { resource: 'invoices', action: 'view' },
      { resource: 'financial', action: 'view' },
      { resource: 'users', action: 'manage' },
      { resource: 'settings', action: 'update' }
    ],
    context: 'global'
  },
  {
    id: 'admin',
    name: 'Admin',
    permissions: [
      { resource: '*', action: '*' }
    ],
    context: 'global'
  }
];

// Predefined quick actions for different roles
export const PREDEFINED_ACTIONS: RoleAction[] = [
  // Dispatcher Actions
  {
    id: 'assign-job',
    label: 'Assign Job',
    icon: 'UserCheck',
    endpoint: '/api/jobs/assign',
    permissions: ['jobs:assign'],
    context: 'card',
    category: 'dispatch',
    requiresSelection: true,
    confirmMessage: 'Assign selected job to technician?',
    successMessage: 'Job assigned successfully'
  },
  {
    id: 'send-message',
    label: 'Send Message',
    icon: 'MessageSquare',
    endpoint: '/api/technicians/message',
    permissions: ['technicians:message'],
    context: 'card',
    category: 'dispatch',
    requiresSelection: true,
    confirmMessage: 'Send message to selected technician?',
    successMessage: 'Message sent successfully'
  },
  {
    id: 'reschedule-job',
    label: 'Reschedule Job',
    icon: 'Calendar',
    endpoint: '/api/jobs/reschedule',
    permissions: ['jobs:update'],
    context: 'card',
    category: 'dispatch',
    requiresSelection: true,
    confirmMessage: 'Reschedule selected job?',
    successMessage: 'Job rescheduled successfully'
  },

  // Technician Actions
  {
    id: 'mark-complete',
    label: 'Mark Complete',
    icon: 'CheckCircle',
    endpoint: '/api/jobs/complete',
    permissions: ['jobs:complete'],
    context: 'card',
    category: 'technician',
    requiresSelection: true,
    confirmMessage: 'Mark selected job as complete?',
    successMessage: 'Job marked as complete'
  },
  {
    id: 'request-supplies',
    label: 'Request Supplies',
    icon: 'Package',
    endpoint: '/api/inventory/request',
    permissions: ['inventory:request'],
    context: 'global',
    category: 'technician',
    requiresSelection: false,
    successMessage: 'Supply request submitted'
  },
  {
    id: 'update-location',
    label: 'Update Location',
    icon: 'MapPin',
    endpoint: '/api/technicians/location',
    permissions: ['technicians:update'],
    context: 'global',
    category: 'technician',
    requiresSelection: false,
    successMessage: 'Location updated'
  },

  // Owner Actions
  {
    id: 'generate-report',
    label: 'Generate Report',
    icon: 'FileText',
    endpoint: '/api/reports/generate',
    permissions: ['reports:generate'],
    context: 'global',
    category: 'owner',
    requiresSelection: false,
    successMessage: 'Report generated successfully'
  },
  {
    id: 'approve-invoice',
    label: 'Approve Invoice',
    icon: 'CheckSquare',
    endpoint: '/api/invoices/approve',
    permissions: ['invoices:approve'],
    context: 'card',
    category: 'owner',
    requiresSelection: true,
    confirmMessage: 'Approve selected invoice?',
    successMessage: 'Invoice approved'
  },
  {
    id: 'view-financials',
    label: 'View Financials',
    icon: 'DollarSign',
    endpoint: '/api/financial/summary',
    permissions: ['financial:view'],
    context: 'global',
    category: 'owner',
    requiresSelection: false
  }
];
