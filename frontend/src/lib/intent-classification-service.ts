// ============================================================================
// INTENT CLASSIFICATION SERVICE
// ============================================================================
// Natural language intent detection and entity extraction for Global Smart Search
// 
// This service classifies user input into actionable intents and extracts entities
// for the pest control CRM domain

import { logger } from '@/utils/logger';

// ============================================================================
// TYPES
// ============================================================================

export interface IntentResult {
  intent: IntentType;
  confidence: number; // 0.0 to 1.0
  entities: ExtractedEntities;
  originalQuery: string;
  processedQuery: string;
  actionData?: ActionData;
}

export type IntentType = 
  // Existing commands
  | 'search'           // Find customers, jobs, invoices
  | 'createCustomer'   // Create new customer account
  | 'deleteCustomer'   // Delete customer account
  | 'confirmDeleteCustomer' // Confirm deletion of customer account
  | 'scheduleAppointment' // Schedule service appointment
  | 'updateAppointment'   // Reschedule or modify appointment
  | 'cancelAppointment'   // Cancel appointment
  | 'addNote'          // Add note to customer
  | 'markInvoicePaid'  // Mark invoice as paid
  | 'assignTechnician' // Assign technician to job
  | 'sendReminder'     // Send reminder to customer
  | 'createServicePlan' // Create recurring service plan
  | 'showReports'      // Show reports or analytics
  | 'help'             // Show help or examples
  
  // Phase 1: High Priority Commands
  | 'updateCustomer'   // Update customer information
  | 'viewCustomerDetails' // View customer details
  | 'customerHistory'  // View customer service history
  | 'startJob'         // Start a job
  | 'completeJob'      // Complete a job
  | 'pauseJob'         // Pause a job
  | 'resumeJob'        // Resume a job
  | 'jobStatus'        // Check job status
  | 'createInvoice'    // Create new invoice
  | 'recordPayment'    // Record payment received
  | 'sendInvoice'      // Send invoice to customer
  | 'paymentHistory'   // View payment history
  | 'outstandingInvoices' // Show outstanding invoices
  | 'advancedSearch'   // Complex search queries
  
  // Phase 2: Medium Priority Commands
  | 'technicianSchedule' // View technician schedule
  | 'technicianAvailability' // Check technician availability
  | 'technicianPerformance' // View technician performance
  | 'technicianLocation' // Get technician location
  | 'equipmentAvailability' // Check equipment availability
  | 'assignEquipment'  // Assign equipment to job
  | 'equipmentMaintenance' // Check equipment maintenance
  | 'inventoryLevels'  // Check inventory levels
  | 'sendAppointmentReminder' // Send appointment reminder
  | 'emailConfirmation' // Send email confirmation
  | 'textMessage'      // Send text message
  | 'callCustomer'     // Call customer
  | 'communicationHistory' // View communication history
  | 'sendFollowUpSurvey' // Send follow-up survey
  | 'notifyManager'    // Notify manager
  | 'alertTechnician'  // Alert technician
  | 'escalateIssue'    // Escalate issue
  | 'revenueReport'    // Show revenue report
  | 'customerSatisfaction' // Customer satisfaction report
  | 'serviceCompletionRates' // Service completion rates
  | 'customerRetention' // Customer retention report
  | 'dailySchedule'    // Daily schedule report
  | 'weeklySummary'    // Weekly service summary
  | 'monthlyGrowth'    // Monthly customer growth
  | 'addServiceNotes'  // Add service notes
  | 'uploadPhotos'     // Upload job photos
  | 'addChemicalUsed'  // Add chemical used
  | 'serviceDocumentation' // Service documentation
  
  // Phase 3: Lower Priority Commands
  | 'addTechnician'    // Add new technician
  | 'updateTechnician' // Update technician profile
  | 'deactivateUser'   // Deactivate user account
  | 'resetPassword'    // Reset user password
  | 'userPermissions'  // Manage user permissions
  | 'auditLog'         // View audit log
  | 'backupData'       // Backup customer data
  | 'exportData'       // Export data to CSV
  | 'importData'       // Import data from file
  | 'systemHealth'     // System health check
  | 'updateServiceAreas' // Update service areas
  | 'configureNotifications' // Configure notifications
  | 'trendAnalysis'    // Trend analysis
  | 'performanceComparison' // Performance comparison
  | 'seasonalPatterns' // Seasonal service patterns
  | 'customerPreferences' // Manage customer preferences
  | 'addCustomerTag'   // Add customer tag
  | 'removeCustomerTag' // Remove customer tag
  | 'setCustomerPriority' // Set customer priority
  | 'markCustomerInactive' // Mark customer inactive
  | 'activateCustomer' // Activate customer
  | 'equipmentUsage'   // Equipment usage report
  | 'profitMarginAnalysis' // Profit margin analysis
  | 'quarterlyReview'  // Quarterly performance review
  | 'yearEndReport';   // Year-end business report

export interface ExtractedEntities {
  // Basic customer information
  customerName?: string;
  customerId?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  
  // Service and job information
  pestType?: string;
  serviceType?: string;
  jobId?: string;
  jobStatus?: string;
  date?: string;
  time?: string;
  technician?: string;
  technicianId?: string;
  
  // Financial information
  invoiceId?: string;
  amount?: string;
  paymentMethod?: string;
  paymentDate?: string;
  
  // Priority and status
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: string;
  notes?: string;
  location?: string;
  
  // Equipment and inventory
  equipmentType?: string;
  equipmentId?: string;
  chemicalName?: string;
  chemicalAmount?: string;
  
  // Communication
  messageType?: string;
  messageContent?: string;
  communicationMethod?: string;
  
  // Reporting and analytics
  reportType?: string;
  timePeriod?: string;
  metric?: string;
  comparisonType?: string;
  
  // User management
  username?: string;
  userId?: string;
  role?: string;
  permission?: string;
  
  // System operations
  operationType?: string;
  fileType?: string;
  backupType?: string;
  
  // Customer preferences and tags
  tag?: string;
  preference?: string;
  setting?: string;
  
  // Advanced search
  searchCriteria?: string;
  filterType?: string;
  sortOrder?: string;
}

export interface ActionData {
  customerData?: {
    name: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phone?: string;
    email?: string;
    notes?: string;
  };
  appointmentData?: {
    customerId?: string;
    customerName?: string;
    serviceType: string;
    date: string;
    time?: string;
    technician?: string;
    notes?: string;
  };
  noteData?: {
    customerId?: string;
    customerName?: string;
    note: string;
    priority?: string;
  };
  invoiceData?: {
    invoiceId: string;
    status: 'paid' | 'unpaid';
  };
}

// ============================================================================
// INTENT CLASSIFICATION SERVICE
// ============================================================================

class IntentClassificationService {
  
  // Intent patterns with regex and keywords
  private readonly intentPatterns: Partial<Record<IntentType, {
    patterns: RegExp[];
    keywords: string[];
    examples: string[];
    confidence: number;
  }>> = {
    search: {
      patterns: [
        /find\s+(.+)/i,
        /lookup\s+(.+)/i,
        /search\s+for\s+(.+)/i,
        /show\s+(.+)/i,
        /list\s+(.+)/i,
        /get\s+(.+)/i,
        /who\s+is\s+(.+)/i,
        /where\s+is\s+(.+)/i
      ],
      keywords: ['find', 'lookup', 'search', 'show', 'list', 'get', 'who', 'where'],
      examples: [
        'Find John Smith',
        'Lookup customer at 123 Maple Ave',
        'Show all termite jobs in August',
        'Search for customers with bed bugs'
      ],
      confidence: 0.8
    },

    createCustomer: {
      patterns: [
        /create\s+(?:a\s+)?(?:new\s+)?(?:customer\s+)?account\s+for\s+(.+)/i,
        /add\s+(?:a\s+)?(?:new\s+)?customer\s+(.+)/i,
        /new\s+customer\s+(.+)/i,
        /register\s+(?:a\s+)?(?:new\s+)?customer\s+(.+)/i,
        /create\s+(?:a\s+)?(?:new\s+)?account\s+(.+)/i
      ],
      keywords: ['create', 'add', 'new', 'register', 'account', 'customer'],
      examples: [
        'Create a new account for John Doe at 123 Maple Ave',
        'Add new customer Lisa Nguyen',
        'Register customer Emily White with phone 555-1234'
      ],
      confidence: 0.9
    },

    deleteCustomer: {
      patterns: [
        /delete\s+(?:the\s+)?(?:customer\s+)?account\s+(?:for\s+)?(.+)/i,
        /remove\s+(?:the\s+)?(?:customer\s+)?account\s+(?:for\s+)?(.+)/i,
        /delete\s+(?:customer\s+)?(.+)/i,
        /remove\s+(?:customer\s+)?(.+)/i,
        /cancel\s+(?:the\s+)?(?:customer\s+)?account\s+(?:for\s+)?(.+)/i,
        /close\s+(?:the\s+)?(?:customer\s+)?account\s+(?:for\s+)?(.+)/i
      ],
      keywords: ['delete', 'remove', 'cancel', 'close', 'account', 'customer'],
      examples: [
        'Delete the customer account for John Doe',
        'Remove customer Lisa Nguyen',
        'Cancel account for Emily White',
        'Close customer account for Mike Johnson'
      ],
      confidence: 0.9
    },

    scheduleAppointment: {
      patterns: [
        /schedule\s+(.+?)\s+(?:for|at)\s+(.+)/i,
        /book\s+(.+?)\s+(?:for|at)\s+(.+)/i,
        /appointment\s+(?:for|at)\s+(.+)/i,
        /schedule\s+(.+)/i,
        /book\s+(.+)/i,
        /set\s+up\s+(.+)/i
      ],
      keywords: ['schedule', 'book', 'appointment', 'set up', 'arrange'],
      examples: [
        'Schedule bed bug treatment for Lisa Nguyen at 7pm tomorrow',
        'Book roach treatment for John Smith',
        'Schedule appointment for Emily White next Friday'
      ],
      confidence: 0.85
    },

    updateAppointment: {
      patterns: [
        /reschedule\s+(.+)/i,
        /change\s+(?:appointment|schedule)\s+(.+)/i,
        /move\s+(?:appointment|schedule)\s+(.+)/i,
        /update\s+(?:appointment|schedule)\s+(.+)/i,
        /modify\s+(?:appointment|schedule)\s+(.+)/i
      ],
      keywords: ['reschedule', 'change', 'move', 'update', 'modify'],
      examples: [
        'Reschedule today\'s appointment for Jake to Friday at 10am',
        'Change appointment for Mike to next week',
        'Move Lisa\'s appointment to tomorrow'
      ],
      confidence: 0.9
    },

    cancelAppointment: {
      patterns: [
        /cancel\s+(?:appointment|schedule|job)\s+(.+)/i,
        /cancel\s+(.+)/i,
        /remove\s+(?:appointment|schedule)\s+(.+)/i,
        /delete\s+(?:appointment|schedule)\s+(.+)/i
      ],
      keywords: ['cancel', 'remove', 'delete'],
      examples: [
        'Cancel Mike\'s job scheduled for Wednesday',
        'Cancel appointment for John Smith',
        'Remove today\'s appointment for Lisa'
      ],
      confidence: 0.9
    },

    addNote: {
      patterns: [
        /add\s+note\s*:?\s*(.+)/i,
        /note\s*:?\s*(.+)/i,
        /comment\s*:?\s*(.+)/i,
        /remark\s*:?\s*(.+)/i,
        /add\s+comment\s*:?\s*(.+)/i
      ],
      keywords: ['note', 'comment', 'remark', 'add note'],
      examples: [
        'Add note: Customer has pets, use only organic products',
        'Note: Customer prefers morning appointments',
        'Comment: Customer has allergies to certain chemicals'
      ],
      confidence: 0.8
    },

    markInvoicePaid: {
      patterns: [
        /mark\s+invoice\s+(\w+)\s+as\s+paid/i,
        /invoice\s+(\w+)\s+paid/i,
        /payment\s+received\s+for\s+invoice\s+(\w+)/i,
        /paid\s+invoice\s+(\w+)/i
      ],
      keywords: ['mark', 'invoice', 'paid', 'payment'],
      examples: [
        'Mark invoice 10023 as paid',
        'Invoice 10023 paid',
        'Payment received for invoice 10023'
      ],
      confidence: 0.9
    },

    assignTechnician: {
      patterns: [
        /assign\s+technician\s+(\w+)\s+to\s+(.+)/i,
        /assign\s+(\w+)\s+to\s+(.+)/i,
        /give\s+(.+)\s+to\s+technician\s+(\w+)/i,
        /technician\s+(\w+)\s+for\s+(.+)/i
      ],
      keywords: ['assign', 'technician', 'give', 'to'],
      examples: [
        'Assign technician Alex to appointment #2093',
        'Assign Alex to John Smith\'s job',
        'Give bed bug treatment to technician Sam'
      ],
      confidence: 0.85
    },

    sendReminder: {
      patterns: [
        /send\s+reminder\s+to\s+(.+)/i,
        /remind\s+(.+)/i,
        /reminder\s+for\s+(.+)/i,
        /notify\s+(.+)/i
      ],
      keywords: ['send', 'reminder', 'remind', 'notify'],
      examples: [
        'Send reminder to Emily White',
        'Remind John Smith about his appointment',
        'Send reminder to Lisa Nguyen'
      ],
      confidence: 0.8
    },

    createServicePlan: {
      patterns: [
        /create\s+(?:quarterly|monthly|weekly|recurring)\s+service\s+plan\s+(.+)/i,
        /set\s+up\s+(?:quarterly|monthly|weekly|recurring)\s+service\s+(.+)/i,
        /(?:quarterly|monthly|weekly|recurring)\s+service\s+(.+)/i
      ],
      keywords: ['create', 'set up', 'quarterly', 'monthly', 'weekly', 'recurring', 'service plan'],
      examples: [
        'Create quarterly service plan for Sam at 456 Oak St starting next Monday',
        'Set up monthly service for John Smith',
        'Quarterly service plan for Emily White'
      ],
      confidence: 0.85
    },

    showReports: {
      patterns: [
        /show\s+(?:reports|analytics|stats|statistics)/i,
        /generate\s+(?:report|analytics)/i,
        /view\s+(?:reports|analytics|stats)/i,
        /display\s+(?:reports|analytics)/i
      ],
      keywords: ['show', 'generate', 'view', 'display', 'reports', 'analytics', 'stats'],
      examples: [
        'Show reports',
        'Generate analytics',
        'View statistics',
        'Display performance metrics'
      ],
      confidence: 0.8
    },

    help: {
      patterns: [
        /help/i,
        /what\s+can\s+i\s+do/i,
        /how\s+do\s+i/i,
        /examples/i,
        /commands/i
      ],
      keywords: ['help', 'what', 'how', 'examples', 'commands'],
      examples: [
        'Help',
        'What can I do?',
        'How do I create a customer?',
        'Show me examples'
      ],
      confidence: 0.9
    },

    // Phase 1: High Priority Commands
    updateCustomer: {
      patterns: [
        /update\s+customer\s+(.+)/i,
        /edit\s+customer\s+(.+)/i,
        /modify\s+customer\s+(.+)/i,
        /change\s+customer\s+(.+)/i,
        /update\s+(.+?)\s+(?:phone|email|address|name)\s+to\s+(.+)/i,
        /edit\s+(.+?)\s+(?:phone|email|address|name)\s+to\s+(.+)/i,
        /modify\s+(.+?)\s+(?:phone|email|address|name)\s+to\s+(.+)/i,
        /change\s+(.+?)\s+(?:phone|email|address|name)\s+to\s+(.+)/i,
        /set\s+(.+?)\s+(?:phone|email|address|name)\s+to\s+(.+)/i,
        /(.+?)\s+(?:phone|email|address|name)\s+(?:is|to|should be|will be)\s+(.+)/i,
        /(.+?)\s+(?:has|gets|now has)\s+(?:phone|email|address|name)\s+(.+)/i
      ],
      keywords: ['update', 'edit', 'modify', 'change', 'set', 'customer', 'phone', 'email', 'address', 'name', 'to', 'is', 'has'],
      examples: [
        'Update customer John Smith phone to 555-1234',
        'Edit customer Lisa Nguyen email to lisa@email.com',
        'Modify customer Mike Johnson address to 123 New St',
        'Change customer Emily White name to Emily Brown',
        'Set John Smith phone to (555) 123-4567',
        'John Smith phone is 555-1234',
        'Lisa Nguyen email should be lisa@company.com'
      ],
      confidence: 0.9
    },

    viewCustomerDetails: {
      patterns: [
        /view\s+customer\s+(.+)/i,
        /show\s+customer\s+(.+)/i,
        /display\s+customer\s+(.+)/i,
        /customer\s+details\s+(.+)/i,
        /profile\s+(.+)/i
      ],
      keywords: ['view', 'show', 'display', 'customer', 'details', 'profile'],
      examples: [
        'View customer John Smith',
        'Show customer Lisa Nguyen details',
        'Display customer Mike Johnson profile'
      ],
      confidence: 0.9
    },

    customerHistory: {
      patterns: [
        /customer\s+history\s+(.+)/i,
        /service\s+history\s+(.+)/i,
        /history\s+(.+)/i,
        /past\s+services\s+(.+)/i,
        /work\s+history\s+(.+)/i
      ],
      keywords: ['customer', 'history', 'service', 'past', 'work'],
      examples: [
        'Customer history John Smith',
        'Service history Lisa Nguyen',
        'Past services Mike Johnson'
      ],
      confidence: 0.9
    },

    startJob: {
      patterns: [
        /start\s+job\s+(.+)/i,
        /begin\s+job\s+(.+)/i,
        /start\s+work\s+(.+)/i,
        /begin\s+work\s+(.+)/i
      ],
      keywords: ['start', 'begin', 'job', 'work'],
      examples: [
        'Start job for John Smith',
        'Begin work for Lisa Nguyen',
        'Start job Mike Johnson'
      ],
      confidence: 0.9
    },

    completeJob: {
      patterns: [
        /complete\s+job\s+(.+)/i,
        /finish\s+job\s+(.+)/i,
        /done\s+job\s+(.+)/i,
        /complete\s+work\s+(.+)/i,
        /finish\s+work\s+(.+)/i
      ],
      keywords: ['complete', 'finish', 'done', 'job', 'work'],
      examples: [
        'Complete job for John Smith',
        'Finish work for Lisa Nguyen',
        'Done job Mike Johnson'
      ],
      confidence: 0.9
    },

    pauseJob: {
      patterns: [
        /pause\s+job\s+(.+)/i,
        /stop\s+job\s+(.+)/i,
        /hold\s+job\s+(.+)/i,
        /pause\s+work\s+(.+)/i
      ],
      keywords: ['pause', 'stop', 'hold', 'job', 'work'],
      examples: [
        'Pause job for John Smith',
        'Stop work for Lisa Nguyen',
        'Hold job Mike Johnson'
      ],
      confidence: 0.9
    },

    resumeJob: {
      patterns: [
        /resume\s+job\s+(.+)/i,
        /continue\s+job\s+(.+)/i,
        /restart\s+job\s+(.+)/i,
        /resume\s+work\s+(.+)/i
      ],
      keywords: ['resume', 'continue', 'restart', 'job', 'work'],
      examples: [
        'Resume job for John Smith',
        'Continue work for Lisa Nguyen',
        'Restart job Mike Johnson'
      ],
      confidence: 0.9
    },

    jobStatus: {
      patterns: [
        /job\s+status\s+(.+)/i,
        /status\s+(.+)/i,
        /check\s+job\s+(.+)/i,
        /job\s+progress\s+(.+)/i
      ],
      keywords: ['job', 'status', 'check', 'progress'],
      examples: [
        'Job status John Smith',
        'Status Lisa Nguyen',
        'Check job Mike Johnson'
      ],
      confidence: 0.9
    },

    createInvoice: {
      patterns: [
        /create\s+invoice\s+(.+)/i,
        /generate\s+invoice\s+(.+)/i,
        /new\s+invoice\s+(.+)/i,
        /bill\s+(.+)/i
      ],
      keywords: ['create', 'generate', 'new', 'invoice', 'bill'],
      examples: [
        'Create invoice for John Smith $150',
        'Generate invoice Lisa Nguyen $200',
        'Bill Mike Johnson $100'
      ],
      confidence: 0.9
    },

    recordPayment: {
      patterns: [
        /record\s+payment\s+(.+)/i,
        /payment\s+received\s+(.+)/i,
        /received\s+payment\s+(.+)/i,
        /log\s+payment\s+(.+)/i
      ],
      keywords: ['record', 'payment', 'received', 'log'],
      examples: [
        'Record payment $150 from John Smith',
        'Payment received $200 from Lisa Nguyen',
        'Received payment $100 from Mike Johnson'
      ],
      confidence: 0.9
    },

    sendInvoice: {
      patterns: [
        /send\s+invoice\s+(.+)/i,
        /email\s+invoice\s+(.+)/i,
        /mail\s+invoice\s+(.+)/i,
        /deliver\s+invoice\s+(.+)/i
      ],
      keywords: ['send', 'email', 'mail', 'deliver', 'invoice'],
      examples: [
        'Send invoice to John Smith',
        'Email invoice Lisa Nguyen',
        'Mail invoice Mike Johnson'
      ],
      confidence: 0.9
    },

    paymentHistory: {
      patterns: [
        /payment\s+history\s+(.+)/i,
        /payments\s+(.+)/i,
        /payment\s+record\s+(.+)/i,
        /billing\s+history\s+(.+)/i
      ],
      keywords: ['payment', 'history', 'payments', 'record', 'billing'],
      examples: [
        'Payment history John Smith',
        'Payments Lisa Nguyen',
        'Billing history Mike Johnson'
      ],
      confidence: 0.9
    },

    outstandingInvoices: {
      patterns: [
        /outstanding\s+invoices/i,
        /unpaid\s+invoices/i,
        /pending\s+invoices/i,
        /overdue\s+invoices/i,
        /show\s+outstanding/i
      ],
      keywords: ['outstanding', 'unpaid', 'pending', 'overdue', 'invoices'],
      examples: [
        'Outstanding invoices',
        'Unpaid invoices',
        'Show outstanding',
        'Pending invoices'
      ],
      confidence: 0.9
    },

    advancedSearch: {
      patterns: [
        /search\s+(.+)/i,
        /find\s+(.+)/i,
        /lookup\s+(.+)/i,
        /query\s+(.+)/i
      ],
      keywords: ['search', 'find', 'lookup', 'query'],
      examples: [
        'Search customers with bed bugs',
        'Find all termite jobs',
        'Lookup invoices from last month'
      ],
      confidence: 0.8
    }
  };

  // Entity extraction patterns
  private readonly entityPatterns = {
    customerName: [
      /(?:for|to|with)\s+([a-z]+\s+[a-z]+)/,
      /([a-z]+\s+[a-z]+)(?:\s+at|\s+with|\s+for)/,
      /customer\s+([a-z]+\s+[a-z]+)/,
      /(?:add\s+new\s+customer|create\s+new\s+customer|new\s+customer)\s+([a-z]+\s+[a-z]+)/
    ],
    address: [
      // Comma-separated format: "134 Thompson Ave, Donora, PA, 15033"
      /(\d+\s+[A-Za-z\s]+(?:st|ave|rd|blvd|dr|ln|way|pl|street|avenue|road|boulevard|drive|lane|place|court|circle|terrace|trail|parkway|highway|apt|apartment|unit|suite|#))\s*,/i,
      // Traditional formats
      /at\s+(\d+\s+[A-Za-z\s]+(?:st|ave|rd|blvd|dr|ln|way|pl|street|avenue|road|boulevard|drive|lane|place))/i,
      /(\d+\s+[A-Za-z\s]+(?:st|ave|rd|blvd|dr|ln|way|pl|street|avenue|road|boulevard|drive|lane|place))/i,
      /address\s+(\d+\s+[A-Za-z\s]+)/i,
      /at\s+(\d+\s+[A-Za-z\s]+)/i,
      /(\d+\s+[A-Za-z\s]+(?:st|ave|rd|blvd|dr|ln|way|pl|street|avenue|road|boulevard|drive|lane|place|court|circle|terrace|trail|parkway|highway))/i,
      /(\d+\s+[A-Za-z\s]+(?:st|ave|rd|blvd|dr|ln|way|pl|street|avenue|road|boulevard|drive|lane|place|court|circle|terrace|trail|parkway|highway|apt|apartment|unit|suite|#))/i
    ],
    city: [
      // Comma-separated format: "134 Thompson Ave, Donora, PA, 15033"
      /(?:at\s+)?\d+\s+[A-Za-z\s]+(?:st|ave|rd|blvd|dr|ln|way|pl|street|avenue|road|boulevard|drive|lane|place|court|circle|terrace|trail|parkway|highway|apt|apartment|unit|suite|#)\s*,\s*([A-Za-z\s]+?)\s*,/i,
      // Traditional formats
      /in\s+([A-Za-z\s]+?)(?:\s+[A-Z]{2}|\s+\d{5}|\s+phone|\s+email|\s*$)/i,
      /city\s+([A-Za-z\s]+?)(?:\s+[A-Z]{2}|\s+\d{5}|\s+phone|\s+email|\s*$)/i,
      /(?:at\s+\d+\s+[A-Za-z\s]+(?:st|ave|rd|blvd|dr|ln|way|pl|street|avenue|road|boulevard|drive|lane|place|court|circle|terrace|trail|parkway|highway|apt|apartment|unit|suite|#)\s+in\s+)([A-Za-z\s]+?)(?:\s+[A-Z]{2}|\s+\d{5}|\s+phone|\s+email|\s*$)/i,
      /(?:address\s+\d+\s+[A-Za-z\s]+\s+in\s+)([A-Za-z\s]+?)(?:\s+[A-Z]{2}|\s+\d{5}|\s+phone|\s+email|\s*$)/i
    ],
    state: [
      // Comma-separated format: "134 Thompson Ave, Donora, PA, 15033"
      /(?:at\s+)?\d+\s+[A-Za-z\s]+(?:st|ave|rd|blvd|dr|ln|way|pl|street|avenue|road|boulevard|drive|lane|place|court|circle|terrace|trail|parkway|highway|apt|apartment|unit|suite|#)\s*,\s*[A-Za-z\s]+\s*,\s*([A-Z]{2})\s*,/i,
      // Traditional formats
      /([A-Z]{2})(?:\s+\d{5}|\s*$)/i,
      /state\s+([A-Z]{2})/i
    ],
    zipCode: [
      // Comma-separated format: "134 Thompson Ave, Donora, PA, 15033"
      /(?:at\s+)?\d+\s+[A-Za-z\s]+(?:st|ave|rd|blvd|dr|ln|way|pl|street|avenue|road|boulevard|drive|lane|place|court|circle|terrace|trail|parkway|highway|apt|apartment|unit|suite|#)\s*,\s*[A-Za-z\s]+\s*,\s*[A-Z]{2}\s*,\s*(\d{5}(?:-\d{4})?)/i,
      // Traditional formats
      /(\d{5}(?:-\d{4})?)/i,
      /zip\s+(\d{5}(?:-\d{4})?)/i,
      /postal\s+code\s+(\d{5}(?:-\d{4})?)/i
    ],
    phone: [
      /(?:phone|call|contact)\s+(\d{3}[-.]?\d{3}[-.]?\d{4})/,
      /(?:phone|call|contact)\s+(\(\d{3}\)\s?\d{3}[-.]?\d{4})/,
      /(?:phone|call|contact)\s+(\d{3}\s\d{3}\s\d{4})/,
      /(\d{3}[-.]?\d{3}[-.]?\d{4})/,
      /(\(\d{3}\)\s?\d{3}[-.]?\d{4})/,
      /(\d{3}\s\d{3}\s\d{4})/,
      /(\d{10})/,
      /(\d{3}\s?\d{3}\s?\d{4})/
    ],
    email: [
      /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/
    ],
    pestType: [
      /(?:roaches?|cockroaches?|bed\s+bugs?|termites?|ants?|rodents?|mice|rats?|spiders?|wasps?|bees?)/i
    ],
    serviceType: [
      /(?:treatment|inspection|spray|bait|trap|extermination|removal|control)/i
    ],
    date: [
      /(?:tomorrow|today|yesterday|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i,
      /(\d{1,2}\/\d{1,2}\/\d{2,4})/,
      /(\d{4}-\d{2}-\d{2})/
    ],
    time: [
      /(\d{1,2}:\d{2}\s*(?:am|pm)?)/i,
      /(\d{1,2}\s*(?:am|pm))/i
    ],
    technician: [
      /(?:technician|tech)\s+([A-Z][a-z]+)/,
      /([A-Z][a-z]+)(?:\s+for|\s+to)/
    ],
    invoiceId: [
      /(?:invoice|inv)\s*#?(\w+)/,
      /#(\w+)/
    ],
    amount: [
      /\$(\d+(?:\.\d{2})?)/,
      /(\d+(?:\.\d{2})?)\s*dollars?/
    ],
    priority: [
      /(?:urgent|high|medium|low)\s+priority/i,
      /priority\s+(urgent|high|medium|low)/i
    ]
  };

  /**
   * Classify user input into an intent with confidence score
   */
  classifyIntent(query: string): IntentResult {
    const normalizedQuery = this.normalizeQuery(query);
    let bestMatch: { intent: IntentType; confidence: number; match: string } | null = null;

    // Test against all intent patterns
    for (const [intent, config] of Object.entries(this.intentPatterns)) {
      const intentType = intent as IntentType;
      
      // Check patterns
      for (const pattern of config.patterns) {
        const match = normalizedQuery.match(pattern);
        if (match) {
          const confidence = config.confidence * this.calculatePatternConfidence(match, normalizedQuery);
          if (!bestMatch || confidence > bestMatch.confidence) {
            bestMatch = {
              intent: intentType,
              confidence,
              match: match[0]
            };
          }
        }
      }

      // Check keywords
      const keywordMatches = config.keywords.filter(keyword => 
        normalizedQuery.includes(keyword.toLowerCase())
      );
      if (keywordMatches.length > 0) {
        const confidence = config.confidence * 0.7 * (keywordMatches.length / config.keywords.length);
        if (!bestMatch || confidence > bestMatch.confidence) {
          bestMatch = {
            intent: intentType,
            confidence,
            match: keywordMatches[0] || ''
          };
        }
      }
    }
    
    // Default to search if no clear intent found
    if (!bestMatch || bestMatch.confidence < 0.3) {
      bestMatch = {
        intent: 'search' as IntentType,
        confidence: 0.5,
        match: query
      };
    }

    // Extract entities
    const entities = this.extractEntities(normalizedQuery);
    
    // Generate action data if applicable
    const actionData = this.generateActionData(bestMatch.intent, entities, normalizedQuery);

    const result: IntentResult = {
        intent: bestMatch.intent as IntentType,
      confidence: bestMatch.confidence,
      entities,
      originalQuery: query,
      processedQuery: normalizedQuery,
      actionData: actionData || {}
    };

    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Intent Classification Result', {
        query: query,
        normalizedQuery: normalizedQuery,
        intent: result.intent,
        confidence: result.confidence,
        entities: result.entities,
        actionData: result.actionData
      });
    }

    return result;
  }

  /**
   * Format text with proper capitalization
   */
  private formatText(text: string): string {
    if (!text) return text;
    
    // Handle special cases
    const specialWords = ['and', 'or', 'the', 'of', 'in', 'at', 'to', 'for', 'with', 'by'];
    
    return text
      .toLowerCase()
      .split(' ')
      .map((word, index) => {
        // Always capitalize first word
        if (index === 0) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }
        // Capitalize special words only if they're not the first word
        if (specialWords.includes(word)) {
          return word;
        }
        // Capitalize all other words
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  }

  /**
   * Extract entities from the query
   */
  private extractEntities(query: string): ExtractedEntities {
    const entities: ExtractedEntities = {};
    
    // Extract customer name
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Extracting entities from query', { query }, 'intent-classification');
      logger.debug('Starting entity extraction', {}, 'intent-classification');
    }
    
    // First try to extract customer name from update patterns
    const updatePatterns = [
      /update\s+customer\s+([^,]+?)(?:\s+(?:phone|email|address|name)|$)/i,
      /edit\s+customer\s+([^,]+?)(?:\s+(?:phone|email|address|name)|$)/i,
      /modify\s+customer\s+([^,]+?)(?:\s+(?:phone|email|address|name)|$)/i,
      /change\s+customer\s+([^,]+?)(?:\s+(?:phone|email|address|name)|$)/i,
      /set\s+([^,]+?)\s+(?:phone|email|address|name)/i,
      /([^,]+?)\s+(?:phone|email|address|name)\s+(?:is|to|should be|will be)/i,
      /([^,]+?)\s+(?:has|gets|now has)\s+(?:phone|email|address|name)/i
    ];
    
    for (const pattern of updatePatterns) {
      const match = query.match(pattern);
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Testing update pattern', { pattern: pattern.toString(), match }, 'intent-classification');
      }
      if (match && match[1]) {
        entities.customerName = this.formatText(match[1].trim());
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Found customer name from update pattern', { original: match[1], formatted: entities.customerName }, 'intent-classification');
        }
        break;
      }
    }
    
    // If no customer name found from update patterns, try regular patterns
    if (!entities.customerName) {
      for (const pattern of this.entityPatterns.customerName) {
        const match = query.match(pattern);
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Testing regular pattern', { pattern: pattern.toString(), match }, 'intent-classification');
        }
        if (match && match[1]) {
          entities.customerName = this.formatText(match[1]);
          if (process.env.NODE_ENV === 'development') {
            logger.debug('Found customer name', { original: match[1], formatted: entities.customerName }, 'intent-classification');
          }
          break;
        }
      }
    }

    // Try to parse space-separated address format first: "134 Thompson Ave Donora PA 15033"
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Testing space-separated address pattern', {}, 'intent-classification');
    }
    const spaceAddressMatch = query.match(/(\d+\s+[a-z\s]+(?:st|ave|rd|blvd|dr|ln|way|pl|street|avenue|road|boulevard|drive|lane|place|court|circle|terrace|trail|parkway|highway|apt|apartment|unit|suite|#))\s+([a-z]+)\s+([a-z]{2})\s+(\d{5}(?:-\d{4})?)/i);
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Space address match result', { match: spaceAddressMatch }, 'intent-classification');
    }
    
    if (spaceAddressMatch && spaceAddressMatch[1] && spaceAddressMatch[2] && spaceAddressMatch[3] && spaceAddressMatch[4]) {
      entities.address = this.formatText(spaceAddressMatch[1].trim());
      entities.city = this.formatText(spaceAddressMatch[2].trim());
      entities.state = spaceAddressMatch[3].trim().toUpperCase();
      entities.zipCode = spaceAddressMatch[4].trim();
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Found space-separated address', {
          address: entities.address,
          city: entities.city,
          state: entities.state,
          zipCode: entities.zipCode
        }, 'intent-classification');
      }
    } else {
      // Fall back to individual pattern matching
      // Extract address
      for (const pattern of this.entityPatterns.address) {
        const match = query.match(pattern);
        if (match && match[1]) {
          entities.address = this.formatText(match[1]);
          if (process.env.NODE_ENV === 'development') {
            logger.debug('Found address', { original: match[1], formatted: entities.address }, 'intent-classification');
          }
          break;
        }
      }

      // Extract city
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Testing city patterns on query', { query }, 'intent-classification');
      }
      for (const pattern of this.entityPatterns.city) {
        const match = query.match(pattern);
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Testing city pattern', { pattern: pattern.toString(), match }, 'intent-classification');
        }
        if (match && match[1]) {
          entities.city = this.formatText(match[1].trim());
          if (process.env.NODE_ENV === 'development') {
            logger.debug('Found city', { original: match[1], formatted: entities.city }, 'intent-classification');
          }
          break;
        }
      }

      // Extract state (only if not in a phone/email context)
      if (!query.includes('phone') && !query.includes('email')) {
        for (const pattern of this.entityPatterns.state) {
          const match = query.match(pattern);
          if (match && match[1]) {
            entities.state = match[1].trim().toUpperCase();
            if (process.env.NODE_ENV === 'development') {
              logger.debug('Found state', { state: match[1] }, 'intent-classification');
            }
            break;
          }
        }
      }

      // Extract zip code (only if not in a phone/email context)
      if (!query.includes('phone') && !query.includes('email')) {
        for (const pattern of this.entityPatterns.zipCode) {
          const match = query.match(pattern);
          if (match && match[1]) {
            entities.zipCode = match[1].trim();
            if (process.env.NODE_ENV === 'development') {
              logger.debug('Found zip code', { zipCode: match[1] }, 'intent-classification');
            }
            break;
          }
        }
      }
    }

    // Extract phone
    for (const pattern of this.entityPatterns.phone) {
      const match = query.match(pattern);
      if (match && match[1]) {
        entities.phone = match[1];
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Found phone', { phone: match[1] }, 'intent-classification');
        }
        break;
      }
    }

    // Extract email
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Testing email patterns on query', { query }, 'intent-classification');
    }
    for (const pattern of this.entityPatterns.email) {
      const match = query.match(pattern);
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Testing email pattern', { pattern: pattern.toString(), match }, 'intent-classification');
      }
      if (match && match[1]) {
        entities.email = match[1];
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Found email', { email: match[1] }, 'intent-classification');
        }
        break;
      }
    }

    // Extract pest type
    for (const pattern of this.entityPatterns.pestType) {
      const match = query.match(pattern);
      if (match && match[1]) {
        entities.pestType = match[1].toLowerCase();
        break;
      }
    }

    // Extract service type
    for (const pattern of this.entityPatterns.serviceType) {
      const match = query.match(pattern);
      if (match && match[1]) {
        entities.serviceType = match[1].toLowerCase();
        break;
      }
    }

    // Extract date
    for (const pattern of this.entityPatterns.date) {
      const match = query.match(pattern);
      if (match && match[1]) {
        entities.date = match[1];
        break;
      }
    }

    // Extract time
    for (const pattern of this.entityPatterns.time) {
      const match = query.match(pattern);
      if (match && match[1]) {
        entities.time = match[1];
        break;
      }
    }

    // Extract technician
    for (const pattern of this.entityPatterns.technician) {
      const match = query.match(pattern);
      if (match && match[1]) {
        entities.technician = match[1];
        break;
      }
    }

    // Extract invoice ID
    for (const pattern of this.entityPatterns.invoiceId) {
      const match = query.match(pattern);
      if (match && match[1]) {
        entities.invoiceId = match[1];
        break;
      }
    }

    // Extract amount
    for (const pattern of this.entityPatterns.amount) {
      const match = query.match(pattern);
      if (match && match[1]) {
        entities.amount = match[1];
        break;
      }
    }

    // Extract priority
    for (const pattern of this.entityPatterns.priority) {
      const match = query.match(pattern);
      if (match && match[1]) {
        entities.priority = match[1].toLowerCase() as any;
        break;
      }
    }

    if (process.env.NODE_ENV === 'development') {
      logger.debug('Final extracted entities', { entities }, 'intent-classification');
      logger.debug('Final city value', { city: entities.city }, 'intent-classification');
    }
    return entities;
  }

  /**
   * Generate action data based on intent and entities
   */
  private generateActionData(intent: IntentType, entities: ExtractedEntities, query: string): ActionData | undefined {
    switch (intent) {
      case 'createCustomer':
        return {
          customerData: {
            name: entities.customerName || '',
            ...(entities.address && { address: entities.address }),
            ...(entities.city && { city: entities.city }),
            ...(entities.state && { state: entities.state }),
            ...(entities.zipCode && { zipCode: entities.zipCode }),
            ...(entities.phone && { phone: entities.phone }),
            ...(entities.email && { email: entities.email }),
            ...(entities.notes && { notes: entities.notes })
          }
        };

      case 'updateCustomer':
        return {
          customerData: {
            name: entities.customerName || '',
            ...(entities.phone && { phone: entities.phone }),
            ...(entities.email && { email: entities.email }),
            ...(entities.address && { address: entities.address }),
            ...(entities.city && { city: entities.city }),
            ...(entities.state && { state: entities.state }),
            ...(entities.zipCode && { zipCode: entities.zipCode }),
            ...(entities.notes && { notes: entities.notes })
          }
        };

      case 'scheduleAppointment':
        return {
          appointmentData: {
            ...(entities.customerName && { customerName: entities.customerName }),
            serviceType: entities.serviceType || entities.pestType || 'general treatment',
            date: entities.date || 'tomorrow',
            ...(entities.time && { time: entities.time }),
            ...(entities.technician && { technician: entities.technician }),
            ...(entities.notes && { notes: entities.notes })
          }
        };

      case 'updateAppointment':
        return {
          appointmentData: {
            ...(entities.customerName && { customerName: entities.customerName }),
            serviceType: entities.serviceType || entities.pestType || 'general treatment',
            date: entities.date || 'tomorrow',
            ...(entities.time && { time: entities.time }),
            ...(entities.technician && { technician: entities.technician }),
            ...(entities.notes && { notes: entities.notes })
          }
        };

      case 'addNote':
        return {
          noteData: {
            ...(entities.customerName && { customerName: entities.customerName }),
            note: entities.notes || query,
            ...(entities.priority && { priority: entities.priority })
          }
        };

      case 'markInvoicePaid':
        return {
          invoiceData: {
            invoiceId: entities.invoiceId || '',
            status: 'paid'
          }
        };

      default:
        return undefined;
    }
  }

  /**
   * Normalize query for better matching
   */
  private normalizeQuery(query: string): string {
    return query
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s@.-]/g, '');
  }

  /**
   * Calculate confidence based on pattern match quality
   */
  private calculatePatternConfidence(match: RegExpMatchArray, query: string): number {
    const matchLength = match[0].length;
    const queryLength = query.length;
    return Math.min(1.0, matchLength / queryLength + 0.3);
  }

  /**
   * Get all supported intents
   */
  getSupportedIntents(): IntentType[] {
    return Object.keys(this.intentPatterns) as IntentType[];
  }

  /**
   * Get examples for all intents
   */
  getIntentExamples(): Record<IntentType, string[]> {
    const examples: Record<IntentType, string[]> = {} as any;
    
    for (const [intent, config] of Object.entries(this.intentPatterns)) {
      examples[intent as IntentType] = config.examples;
    }
    
    return examples;
  }

  /**
   * Get examples for a specific intent
   */
  getIntentExamplesFor(intent: IntentType): string[] {
    return this.intentPatterns[intent]?.examples || [];
  }

  /**
   * Validate if an intent result is actionable
   */
  validateIntentResult(result: IntentResult): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    switch (result.intent) {
      case 'createCustomer':
        if (!result.entities.customerName) {
          errors.push('Customer name is required');
        }
        break;

      case 'scheduleAppointment':
        if (!result.entities.customerName && !result.entities.customerId) {
          errors.push('Customer name or ID is required');
        }
        if (!result.entities.serviceType && !result.entities.pestType) {
          errors.push('Service type or pest type is required');
        }
        break;

      case 'updateAppointment':
        if (!result.entities.customerName && !result.entities.customerId) {
          errors.push('Customer name or ID is required');
        }
        break;

      case 'addNote':
        if (!result.entities.customerName && !result.entities.customerId) {
          errors.push('Customer name or ID is required');
        }
        if (!result.entities.notes && !result.actionData?.noteData?.note) {
          errors.push('Note content is required');
        }
        break;

      case 'markInvoicePaid':
        if (!result.entities.invoiceId) {
          errors.push('Invoice ID is required');
        }
        break;

      case 'assignTechnician':
        if (!result.entities.technician) {
          errors.push('Technician name is required');
        }
        if (!result.entities.customerName && !result.entities.customerId) {
          errors.push('Customer name or ID is required');
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const intentClassificationService = new IntentClassificationService();

// Export types (already exported above)