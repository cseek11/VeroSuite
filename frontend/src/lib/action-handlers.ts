// ============================================================================
// ACTION HANDLERS SERVICE
// ============================================================================
// Executes actions based on classified intents for Global Smart Search
// 
// This service handles the execution of natural language commands like
// creating customers, scheduling appointments, adding notes, etc.

import { secureApiClient } from './secure-api-client';
import type { IntentResult } from './intent-classification-service';
import { invalidateQueries, queryClient } from './queryClient';

// ============================================================================
// TYPES
// ============================================================================

export interface ActionResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  navigation?: {
    type: string;
    path: string;
    message: string;
  };
  requiresConfirmation?: boolean;
  confirmationData?: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
    action?: string;
    data?: any;
  };
}

export interface ActionData {
  customerData?: any;
  appointmentData?: any;
  noteData?: any;
  invoiceData?: {
    customerName?: string;
    amount?: number;
    dueDate?: string;
    description?: string;
    invoiceId?: string;
  };
  customerId?: string;
  customerName?: string;
  action?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ConfirmationData {
  action: string;
  description: string;
  data: any;
  risks?: string[];
  benefits?: string[];
}

// ============================================================================
// ACTION HANDLERS SERVICE
// ============================================================================

class ActionExecutorService {

  /**
   * Validate an action before execution
   */
  validateAction(intentResult: IntentResult): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    switch (intentResult.intent) {
      case 'createCustomer':
        if (!intentResult.entities.customerName) {
          errors.push('Customer name is required');
        }
        if (!intentResult.entities.address && !intentResult.entities.phone && !intentResult.entities.email) {
          warnings.push('At least one contact method (address, phone, or email) is recommended');
        }
        break;

      case 'scheduleAppointment':
        if (!intentResult.entities.customerName && !intentResult.entities.customerId) {
          errors.push('Customer name or ID is required');
        }
        if (!intentResult.entities.serviceType && !intentResult.entities.pestType) {
          errors.push('Service type or pest type is required');
        }
        if (!intentResult.entities.date) {
          warnings.push('No date specified, will default to tomorrow');
        }
        break;

      case 'updateAppointment':
        if (!intentResult.entities.customerName && !intentResult.entities.customerId) {
          errors.push('Customer name or ID is required');
        }
        if (!intentResult.entities.date && !intentResult.entities.time && !intentResult.entities.technician) {
          errors.push('At least one update (date, time, or technician) is required');
        }
        break;

      case 'cancelAppointment':
        if (!intentResult.entities.customerName && !intentResult.entities.customerId) {
          errors.push('Customer name or ID is required');
        }
        break;

      case 'addNote':
        if (!intentResult.entities.customerName && !intentResult.entities.customerId) {
          errors.push('Customer name or ID is required');
        }
        if (!intentResult.entities.notes && !intentResult.actionData?.noteData?.note) {
          errors.push('Note content is required');
        }
        break;

      case 'markInvoicePaid':
        if (!intentResult.entities.invoiceId) {
          errors.push('Invoice ID is required');
        }
        break;

      case 'assignTechnician':
        if (!intentResult.entities.technician) {
          errors.push('Technician name is required');
        }
        if (!intentResult.entities.customerName && !intentResult.entities.customerId) {
          errors.push('Customer name or ID is required');
        }
        break;

      case 'sendReminder':
        if (!intentResult.entities.customerName && !intentResult.entities.customerId) {
          errors.push('Customer name or ID is required');
        }
        break;

      case 'createServicePlan':
        if (!intentResult.entities.customerName && !intentResult.entities.customerId) {
          errors.push('Customer name or ID is required');
        }
        if (!intentResult.entities.address) {
          warnings.push('Service address is recommended for service plans');
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings
    };
  }

  /**
   * Get confirmation data for an action
   */
  getConfirmationData(intentResult: IntentResult): ConfirmationData {
    switch (intentResult.intent) {
      case 'createCustomer':
        return {
          action: 'Create Customer',
          description: `Create a new customer account for ${intentResult.entities.customerName}`,
          data: intentResult.actionData?.customerData,
          benefits: ['New customer added to system', 'Ready for service scheduling'],
          risks: ['Duplicate customer if already exists']
        };

      case 'scheduleAppointment':
        return {
          action: 'Schedule Appointment',
          description: `Schedule ${intentResult.entities.serviceType || intentResult.entities.pestType} appointment for ${intentResult.entities.customerName}`,
          data: intentResult.actionData?.appointmentData,
          benefits: ['Customer service scheduled', 'Technician assignment ready'],
          risks: ['May conflict with existing appointments', 'Customer may not be available']
        };

      case 'updateAppointment':
        return {
          action: 'Update Appointment',
          description: `Update appointment for ${intentResult.entities.customerName}`,
          data: intentResult.actionData?.appointmentData,
          benefits: ['Appointment updated', 'Customer notified'],
          risks: ['May affect technician schedule', 'Customer may need to be notified']
        };

      case 'cancelAppointment':
        return {
          action: 'Cancel Appointment',
          description: `Cancel appointment for ${intentResult.entities.customerName}`,
          data: { customerName: intentResult.entities.customerName },
          benefits: ['Appointment cancelled', 'Technician freed up'],
          risks: ['Customer may need rescheduling', 'Revenue impact']
        };

      case 'addNote':
        return {
          action: 'Add Note',
          description: `Add note for ${intentResult.entities.customerName}`,
          data: intentResult.actionData?.noteData,
          benefits: ['Customer information updated', 'Better service context'],
          risks: ['Note may be sensitive information']
        };

      case 'markInvoicePaid':
        return {
          action: 'Mark Invoice Paid',
          description: `Mark invoice ${intentResult.entities.invoiceId} as paid`,
          data: intentResult.actionData?.invoiceData,
          benefits: ['Payment recorded', 'Customer account updated'],
          risks: ['Financial record change', 'May affect accounting']
        };

      case 'assignTechnician':
        return {
          action: 'Assign Technician',
          description: `Assign ${intentResult.entities.technician} to ${intentResult.entities.customerName}`,
          data: {
            technician: intentResult.entities.technician,
            customerName: intentResult.entities.customerName
          },
          benefits: ['Technician assigned', 'Job ready for execution'],
          risks: ['May affect technician schedule', 'Technician may not be available']
        };

      case 'sendReminder':
        return {
          action: 'Send Reminder',
          description: `Send reminder to ${intentResult.entities.customerName}`,
          data: { customerName: intentResult.entities.customerName },
          benefits: ['Customer notified', 'Reduced no-shows'],
          risks: ['May be seen as spam', 'Customer contact preferences']
        };

      case 'createServicePlan':
      return {
          action: 'Create Service Plan',
          description: `Create recurring service plan for ${intentResult.entities.customerName}`,
          data: intentResult.actionData?.appointmentData,
          benefits: ['Recurring revenue', 'Customer retention', 'Automated scheduling'],
          risks: ['Long-term commitment', 'Customer may cancel']
        };

      default:
        return {
          action: 'Unknown Action',
          description: 'Action not recognized',
          data: {},
          risks: ['Unknown action type']
        };
    }
  }

  /**
   * Execute an action based on intent result
   */
  async executeAction(intentResult: IntentResult): Promise<ActionResult> {
    try {
      console.log('🚀 Executing action:', intentResult.intent, intentResult.entities);

      switch (intentResult.intent) {
        case 'createCustomer':
          return await this.createCustomer(intentResult);

        case 'deleteCustomer':
          return await this.deleteCustomer(intentResult);

        case 'confirmDeleteCustomer':
          return await this.confirmDeleteCustomer(intentResult);

        case 'scheduleAppointment':
          return await this.scheduleAppointment(intentResult);

        case 'updateAppointment':
          return await this.updateAppointment(intentResult);

        case 'cancelAppointment':
          return await this.cancelAppointment(intentResult);

        case 'addNote':
          return await this.addNote(intentResult);

        case 'markInvoicePaid':
          return await this.markInvoicePaid(intentResult);

        case 'assignTechnician':
          return await this.assignTechnician(intentResult);

        case 'sendReminder':
          return await this.sendReminder(intentResult);

        case 'createServicePlan':
          return await this.createServicePlan(intentResult);

        case 'help':
          return await this.showHelp(intentResult);

        // Phase 1: High Priority Commands
        case 'updateCustomer':
          return await this.updateCustomer(intentResult);

        case 'viewCustomerDetails':
          return await this.viewCustomerDetails(intentResult);

        case 'customerHistory':
          return await this.customerHistory(intentResult);

        case 'startJob':
          return await this.startJob(intentResult);

        case 'completeJob':
          return await this.completeJob(intentResult);

        case 'pauseJob':
          return await this.pauseJob(intentResult);

        case 'resumeJob':
          return await this.resumeJob(intentResult);

        case 'jobStatus':
          return await this.jobStatus(intentResult);

        case 'createInvoice':
          return await this.createInvoice(intentResult);

        case 'recordPayment':
          return await this.recordPayment(intentResult);

        case 'sendInvoice':
          return await this.sendInvoice(intentResult);

        case 'paymentHistory':
          return await this.paymentHistory(intentResult);

        case 'outstandingInvoices':
          return await this.outstandingInvoices(intentResult);

        case 'advancedSearch':
          return await this.advancedSearch(intentResult);

        case 'showReports':
          return await this.showReports(intentResult);

        // Phase 2: Medium Priority Commands
        case 'technicianSchedule':
          return await this.technicianSchedule(intentResult);

        case 'technicianAvailability':
          return await this.technicianAvailability(intentResult);

        case 'technicianPerformance':
          return await this.technicianPerformance(intentResult);

        case 'technicianLocation':
          return await this.technicianLocation(intentResult);

        case 'equipmentAvailability':
          return await this.equipmentAvailability(intentResult);

        case 'assignEquipment':
          return await this.assignEquipment(intentResult);

        case 'equipmentMaintenance':
          return await this.equipmentMaintenance(intentResult);

        case 'inventoryLevels':
          return await this.inventoryLevels(intentResult);

        case 'sendAppointmentReminder':
          return await this.sendAppointmentReminder(intentResult);

        case 'emailConfirmation':
          return await this.emailConfirmation(intentResult);

        case 'textMessage':
          return await this.textMessage(intentResult);

        case 'callCustomer':
          return await this.callCustomer(intentResult);

        case 'communicationHistory':
          return await this.communicationHistory(intentResult);

        case 'sendFollowUpSurvey':
          return await this.sendFollowUpSurvey(intentResult);

        case 'notifyManager':
          return await this.notifyManager(intentResult);

        case 'alertTechnician':
          return await this.alertTechnician(intentResult);

        case 'escalateIssue':
          return await this.escalateIssue(intentResult);

        case 'revenueReport':
          return await this.revenueReport(intentResult);

        case 'customerSatisfaction':
          return await this.customerSatisfaction(intentResult);

        case 'serviceCompletionRates':
          return await this.serviceCompletionRates(intentResult);

        case 'customerRetention':
          return await this.customerRetention(intentResult);

        case 'dailySchedule':
          return await this.dailySchedule(intentResult);

        case 'weeklySummary':
          return await this.weeklySummary(intentResult);

        case 'monthlyGrowth':
          return await this.monthlyGrowth(intentResult);

        case 'addServiceNotes':
          return await this.addServiceNotes(intentResult);

        case 'uploadPhotos':
          return await this.uploadPhotos(intentResult);

        case 'addChemicalUsed':
          return await this.addChemicalUsed(intentResult);

        case 'serviceDocumentation':
          return await this.serviceDocumentation(intentResult);

        // Phase 3: Lower Priority Commands
        case 'addTechnician':
          return await this.addTechnician(intentResult);

        case 'updateTechnician':
          return await this.updateTechnician(intentResult);

        case 'deactivateUser':
          return await this.deactivateUser(intentResult);

        case 'resetPassword':
          return await this.resetPassword(intentResult);

        case 'userPermissions':
          return await this.userPermissions(intentResult);

        case 'auditLog':
          return await this.auditLog(intentResult);

        case 'backupData':
          return await this.backupData(intentResult);

        case 'exportData':
          return await this.exportData(intentResult);

        case 'importData':
          return await this.importData(intentResult);

        case 'systemHealth':
          return await this.systemHealth(intentResult);

        case 'updateServiceAreas':
          return await this.updateServiceAreas(intentResult);

        case 'configureNotifications':
          return await this.configureNotifications(intentResult);

        case 'trendAnalysis':
          return await this.trendAnalysis(intentResult);

        case 'performanceComparison':
          return await this.performanceComparison(intentResult);

        case 'seasonalPatterns':
          return await this.seasonalPatterns(intentResult);

        case 'customerPreferences':
          return await this.customerPreferences(intentResult);

        default:
          return {
            success: false,
            message: 'Action not implemented',
            error: `Action type "${intentResult.intent}" is not supported`
          };
      }
    } catch (error) {
      console.error('❌ Action execution failed:', error);
      return {
        success: false,
        message: 'Action execution failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // ============================================================================
  // INDIVIDUAL ACTION IMPLEMENTATIONS
  // ============================================================================

  private async createCustomer(intentResult: IntentResult): Promise<ActionResult> {
    try {
      console.log('🔍 createCustomer - intentResult:', intentResult);
      console.log('🔍 createCustomer - actionData:', intentResult.actionData);
      
      const customerData = intentResult.actionData?.customerData;
      console.log('🔍 createCustomer - customerData:', customerData);
      
      if (!customerData) {
        throw new Error('Customer data not found');
      }

      const requestData = {
        name: customerData.name,
        address: customerData.address,
        city: customerData.city,
        state: customerData.state,
        zip_code: customerData.zipCode,
        phone: customerData.phone,
        email: customerData.email,
        notes: customerData.notes,
        account_type: 'residential'
      };
      
      console.log('🔍 createCustomer - API request data:', requestData);

      // Create customer via backend API
      const result = await secureApiClient.post('/accounts', requestData);
      
      console.log('🔍 createCustomer - API response:', result);

      // Invalidate customer-related queries to refresh the UI
      await Promise.all([
        invalidateQueries.accounts(),
        queryClient.invalidateQueries({ queryKey: ['secure-customers'] }),
        queryClient.invalidateQueries({ queryKey: ['customers'] }),
        queryClient.invalidateQueries({ queryKey: ['enhanced-account-details'] }),
        queryClient.invalidateQueries({ queryKey: ['customers-count'] }),
        queryClient.invalidateQueries({ queryKey: ['customers-for-scheduling'] }),
        queryClient.invalidateQueries({ queryKey: ['customers-for-filter'] }),
        queryClient.invalidateQueries({ queryKey: ['customer-search'] })
      ]);
      console.log('🔄 All customer-related caches invalidated after creation');

      // Check if the response contains a materialized view permission error
      // This is a non-critical error that occurs after successful customer creation
      if (result && typeof result === 'object' && 'error' in result && 
          typeof (result as any).error === 'string' && 
          (result as any).error.includes('permission denied for materialized view')) {
        console.warn('⚠️ Materialized view permission error (non-critical):', (result as any).error);
        return {
          success: true,
          message: `Customer "${customerData.name}" created successfully`,
          data: { id: 'created', name: customerData.name }, // Return basic success data
          navigation: {
            type: 'navigate',
            path: `/customers/created`,
            message: `Navigating to ${customerData.name}'s customer page...`
          }
        };
      }

      return {
        success: true,
        message: `Customer "${customerData.name}" created successfully`,
        data: result,
        navigation: {
          type: 'navigate',
          path: `/customers/${(result as any).id || 'created'}`,
          message: `Navigating to ${customerData.name}'s customer page...`
        }
      };
    } catch (error) {
      console.error('❌ createCustomer - Error:', error);
      return {
        success: false,
        message: 'Failed to create customer',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async deleteCustomer(intentResult: IntentResult): Promise<ActionResult> {
    try {
      console.log('🔍 deleteCustomer - intentResult:', intentResult);
      
      const customerName = intentResult.entities.customerName;
      console.log('🔍 deleteCustomer - customerName:', customerName);
      
      if (!customerName) {
        throw new Error('Customer name not found');
      }

      // Find the best matching customer using fuzzy search
      const bestMatch = await this.findBestCustomerMatch(customerName);
      if (!bestMatch) {
        throw new Error(`No customer found matching "${customerName}". Please check the spelling and try again.`);
      }

      console.log('🔍 deleteCustomer - found best match:', bestMatch);

      // Return confirmation request with the actual customer name found
      return {
        success: false, // Not successful yet, requires confirmation
        message: `Delete customer "${bestMatch.name}"?`,
        requiresConfirmation: true,
        confirmationData: {
          title: 'Delete Customer',
          message: `Are you sure you want to delete "${bestMatch.name}"? This action cannot be undone.`,
          confirmText: 'Delete Customer',
          cancelText: 'Cancel',
          type: 'danger'
        },
        data: { 
          customerId: bestMatch.id, 
          customerName: bestMatch.name,
          action: 'deleteCustomer'
        }
      };
    } catch (error) {
      console.error('❌ deleteCustomer - Error:', error);
    return {
        success: false,
        message: 'Failed to delete customer',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async confirmDeleteCustomer(intentResult: IntentResult): Promise<ActionResult> {
    try {
      console.log('🔍 confirmDeleteCustomer - intentResult:', intentResult);
      
      const { customerId, customerName } = intentResult.actionData || intentResult as any;
      
      if (!customerId || !customerName) {
        throw new Error('Customer ID or name not found in confirmation data');
      }

      console.log('🔍 confirmDeleteCustomer - deleting customer:', customerId, customerName);

      // Delete customer via backend API
      const result = await secureApiClient.deleteAccount(customerId);
      
      console.log('🔍 confirmDeleteCustomer - API response:', result);

      // Invalidate customer-related queries to refresh the UI
      await Promise.all([
        invalidateQueries.accounts(),
        queryClient.invalidateQueries({ queryKey: ['secure-customers'] }),
        queryClient.invalidateQueries({ queryKey: ['customers'] }),
        queryClient.invalidateQueries({ queryKey: ['enhanced-account-details'] }),
        queryClient.invalidateQueries({ queryKey: ['customers-count'] }),
        queryClient.invalidateQueries({ queryKey: ['customers-for-scheduling'] }),
        queryClient.invalidateQueries({ queryKey: ['customers-for-filter'] }),
        queryClient.invalidateQueries({ queryKey: ['customer-search'] })
      ]);
      console.log('🔄 All customer-related caches invalidated after deletion');

      return {
        success: true,
        message: `Customer "${customerName}" has been deleted successfully`,
        data: { id: customerId, name: customerName },
        navigation: {
          type: 'navigate',
          path: '/customers',
          message: 'Redirecting to customer search page...'
        }
      };
    } catch (error) {
      console.error('❌ confirmDeleteCustomer - Error:', error);
      return {
        success: false,
        message: 'Failed to delete customer',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async scheduleAppointment(intentResult: IntentResult): Promise<ActionResult> {
    try {
      const appointmentData = intentResult.actionData?.appointmentData;
      if (!appointmentData) {
        throw new Error('Appointment data not found');
      }

      // First, find the customer
      const customer = await this.findCustomer(appointmentData.customerName || '');
      if (!customer) {
        throw new Error(`Customer "${appointmentData.customerName}" not found`);
      }

      // Create appointment/job
      const result = await secureApiClient.post('/jobs', {
        customer_id: customer.id,
        service_type: appointmentData.serviceType,
        scheduled_date: this.parseDate(appointmentData.date || 'tomorrow'),
        scheduled_time: appointmentData.time,
        technician: appointmentData.technician,
        notes: appointmentData.notes,
        status: 'scheduled'
      });

      return {
        success: true,
        message: `Appointment scheduled for ${appointmentData.customerName}`,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to schedule appointment',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async updateAppointment(intentResult: IntentResult): Promise<ActionResult> {
    try {
      const appointmentData = intentResult.actionData?.appointmentData;
      if (!appointmentData) {
        throw new Error('Appointment data not found');
      }

      // Find the customer and their appointments
      const customer = await this.findCustomer(appointmentData.customerName || '');
      if (!customer) {
        throw new Error(`Customer "${appointmentData.customerName}" not found`);
      }

      // Find the appointment to update (simplified - would need more logic in real implementation)
      const appointments = await secureApiClient.get(`/jobs?customer_id=${customer.id}`) as any[];
      if (!appointments || appointments.length === 0) {
        throw new Error(`No appointments found for ${appointmentData.customerName}`);
      }

      const appointment = appointments[0]; // Get first appointment
      
      // Update the appointment
      const updateData: any = {};
      if (appointmentData.date) updateData.scheduled_date = this.parseDate(appointmentData.date);
      if (appointmentData.time) updateData.scheduled_time = appointmentData.time;
      if (appointmentData.technician) updateData.technician = appointmentData.technician;
      if (appointmentData.notes) updateData.notes = appointmentData.notes;

      const result = await secureApiClient.put(`/jobs/${appointment.id}`, updateData);

      return {
        success: true,
        message: `Appointment updated for ${appointmentData.customerName}`,
        data: result
      };
    } catch (error) {
    return {
        success: false,
        message: 'Failed to update appointment',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async cancelAppointment(intentResult: IntentResult): Promise<ActionResult> {
    try {
      const customerName = intentResult.entities.customerName;
      if (!customerName) {
        throw new Error('Customer name is required');
      }

      // Find the customer and their appointments
      const customer = await this.findCustomer(customerName);
      if (!customer) {
        throw new Error(`Customer "${customerName}" not found`);
      }

      const appointments = await secureApiClient.get(`/jobs?customer_id=${customer.id}`) as any[];
      if (!appointments || appointments.length === 0) {
        throw new Error(`No appointments found for ${customerName}`);
      }

      const appointment = appointments[0]; // Get first appointment
      
      // Cancel the appointment
      const result = await secureApiClient.put(`/jobs/${appointment.id}`, {
        status: 'cancelled'
      });

      return {
        success: true,
        message: `Appointment cancelled for ${customerName}`,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to cancel appointment',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async addNote(intentResult: IntentResult): Promise<ActionResult> {
    try {
      const noteData = intentResult.actionData?.noteData;
      if (!noteData) {
        throw new Error('Note data not found');
      }

      const customerName = noteData.customerName;
      if (!customerName) {
        throw new Error('Customer name is required');
      }

      // Find the customer
      const customer = await this.findCustomer(customerName);
      if (!customer) {
        throw new Error(`Customer "${customerName}" not found`);
      }

      // Add note to customer
      const result = await secureApiClient.post('/customer-notes', {
        customer_id: customer.id,
        note: noteData.note,
        priority: noteData.priority || 'medium',
        created_by: 'system'
      });

      return {
        success: true,
        message: `Note added for ${customerName}`,
        data: result
      };
    } catch (error) {
    return {
        success: false,
        message: 'Failed to add note',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async markInvoicePaid(intentResult: IntentResult): Promise<ActionResult> {
    try {
      const invoiceId = intentResult.entities.invoiceId;
      if (!invoiceId) {
        throw new Error('Invoice ID is required');
      }

      // Update invoice status
      const result = await secureApiClient.put(`/invoices/${invoiceId}`, {
        status: 'paid',
        paid_date: new Date().toISOString()
      });

      return {
        success: true,
        message: `Invoice ${invoiceId} marked as paid`,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to mark invoice as paid',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async assignTechnician(intentResult: IntentResult): Promise<ActionResult> {
    try {
      const technician = intentResult.entities.technician;
      const customerName = intentResult.entities.customerName;
      
      if (!technician) {
        throw new Error('Technician name is required');
      }
      if (!customerName) {
        throw new Error('Customer name is required');
      }

      // Find the customer and their appointments
      const customer = await this.findCustomer(customerName);
      if (!customer) {
        throw new Error(`Customer "${customerName}" not found`);
      }

      const appointments = await secureApiClient.get(`/jobs?customer_id=${customer.id}`) as any[];
      if (!appointments || appointments.length === 0) {
        throw new Error(`No appointments found for ${customerName}`);
      }

      const appointment = appointments[0]; // Get first appointment
      
      // Assign technician
      const result = await secureApiClient.put(`/jobs/${appointment.id}`, {
        technician: technician
      });
    
    return {
        success: true,
        message: `Technician ${technician} assigned to ${customerName}`,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to assign technician',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async sendReminder(intentResult: IntentResult): Promise<ActionResult> {
    try {
      const customerName = intentResult.entities.customerName;
      if (!customerName) {
        throw new Error('Customer name is required');
      }

      // Find the customer
      const customer = await this.findCustomer(customerName);
      if (!customer) {
        throw new Error(`Customer "${customerName}" not found`);
      }

      // Send reminder (simplified - would integrate with email/SMS service)
      const result = await secureApiClient.post('/reminders', {
        customer_id: customer.id,
        type: 'appointment_reminder',
        message: 'Reminder: You have an upcoming appointment',
        sent_at: new Date().toISOString()
      });

      return {
        success: true,
        message: `Reminder sent to ${customerName}`,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send reminder',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async createServicePlan(intentResult: IntentResult): Promise<ActionResult> {
    try {
      const appointmentData = intentResult.actionData?.appointmentData;
      if (!appointmentData) {
        throw new Error('Service plan data not found');
      }

      const customerName = appointmentData.customerName;
      if (!customerName) {
        throw new Error('Customer name is required');
      }

      // Find the customer
      const customer = await this.findCustomer(customerName);
      if (!customer) {
        throw new Error(`Customer "${customerName}" not found`);
      }

      // Create service plan
      const result = await secureApiClient.post('/service-plans', {
        customer_id: customer.id,
        service_type: appointmentData.serviceType || 'general treatment',
        frequency: 'quarterly',
        start_date: this.parseDate(appointmentData.date || 'next monday'),
        address: intentResult.entities.address,
        notes: appointmentData.notes
      });

      return {
        success: true,
        message: `Service plan created for ${customerName}`,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create service plan',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async showHelp(_intentResult: IntentResult): Promise<ActionResult> {
    try {
      // Trigger the help modal to open
      const helpEvent = new CustomEvent('showCommandHelp');
      window.dispatchEvent(helpEvent);

      return {
        success: true,
        message: 'Opening command help...',
        data: { action: 'showHelp' }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to show help',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async createInvoice(intentResult: IntentResult): Promise<ActionResult> {
    try {
      const invoiceData = intentResult.actionData?.invoiceData;
      if (!invoiceData) {
        throw new Error('Invoice data not found');
      }

      const customerName = intentResult.entities.customerName || (invoiceData as any).customerName;
      if (!customerName) {
        throw new Error('Customer name is required');
      }

      // Find the customer
      const customer = await this.findCustomer(customerName);
      if (!customer) {
        throw new Error(`Customer "${customerName}" not found`);
      }

      // Check prerequisites for invoice creation
      const prerequisites = await this.checkInvoicePrerequisites(customer.id);
      
      if (!prerequisites.canCreateInvoice) {
        return {
          success: false,
          message: 'Cannot create invoice - missing prerequisites',
          error: prerequisites.missingItems.join(', '),
          confirmationData: {
            title: 'Missing Prerequisites',
            message: `To create an invoice for ${customerName}, you need to complete the following first:\n\n${prerequisites.missingItems.map(item => `• ${item}`).join('\n')}\n\nWould you like me to help you create these missing items?`,
            confirmText: 'Create Missing Items',
            cancelText: 'Cancel',
            type: 'warning',
            action: 'createMissingPrerequisites',
            data: { customerId: customer.id, missingItems: prerequisites.missingItems }
          }
        };
      }

      // Generate invoice number
      const invoiceNumber = await this.generateInvoiceNumber();

      // Create invoice with proper workflow
      const result = await secureApiClient.post('/invoices', {
        invoice_number: invoiceNumber,
        account_id: customer.id,
        service_agreement_id: prerequisites.serviceAgreementId,
        work_order_id: prerequisites.workOrderId,
        job_id: prerequisites.jobId,
        issue_date: new Date().toISOString().split('T')[0],
        due_date: (invoiceData as any).dueDate || this.parseDate('30 days from now'),
        subtotal: (invoiceData as any).amount || 0,
        tax_amount: 0, // Calculate based on location
        total_amount: (invoiceData as any).amount || 0,
        balance_due: (invoiceData as any).amount || 0,
        payment_terms: 30,
        notes: (invoiceData as any).description || 'Service invoice',
        items: [{
          description: (invoiceData as any).description || 'Service provided',
          quantity: 1,
          unit_price: (invoiceData as any).amount || 0,
          total_price: (invoiceData as any).amount || 0,
          service_type_id: prerequisites.serviceTypeId
        }]
      });

      return {
        success: true,
        message: `Invoice ${invoiceNumber} created for ${customerName} - Amount: $${(invoiceData as any).amount || 0}`,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create invoice',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async checkInvoicePrerequisites(customerId: string): Promise<{
    canCreateInvoice: boolean;
    missingItems: string[];
    serviceAgreementId?: string;
    workOrderId?: string;
    jobId?: string;
    serviceTypeId?: string;
  }> {
    try {
      const missingItems: string[] = [];
      let serviceAgreementId: string | undefined;
      let workOrderId: string | undefined;
      let jobId: string | undefined;
      let serviceTypeId: string | undefined;

      // Check for active service agreements
      const serviceAgreements = await secureApiClient.get(`/service-agreements?customer_id=${customerId}&status=active`);
      const serviceAgreementsData = (serviceAgreements as any).data || [];
      if (!serviceAgreementsData || serviceAgreementsData.length === 0) {
        missingItems.push('Active Service Agreement (Contract)');
      } else {
        serviceAgreementId = serviceAgreementsData[0].id;
        serviceTypeId = serviceAgreementsData[0].service_type_id;
      }

      // Check for work orders from the service agreement
      if (serviceAgreementId) {
        const workOrders = await secureApiClient.get(`/work-orders?service_agreement_id=${serviceAgreementId}&status=completed`);
        const workOrdersData = (workOrders as any).data || [];
        if (!workOrdersData || workOrdersData.length === 0) {
          missingItems.push('Completed Work Order (Instructions for Technician)');
        } else {
          workOrderId = workOrdersData[0].id;
        }
      } else {
        missingItems.push('Completed Work Order (requires Service Agreement first)');
      }

      // Check for completed jobs from the work order
      if (workOrderId) {
        const jobs = await secureApiClient.get(`/jobs?work_order_id=${workOrderId}&status=completed`);
        const jobsData = (jobs as any).data || [];
        if (!jobsData || jobsData.length === 0) {
          missingItems.push('Completed Job (Work performed by Technician)');
        } else {
          jobId = jobsData[0].id;
        }
      } else {
        missingItems.push('Completed Job (requires Work Order first)');
      }

      // Check for service types and pricing
      const serviceTypes = await secureApiClient.get('/service-types');
      const serviceTypesData = (serviceTypes as any).data || [];
      if (!serviceTypesData || serviceTypesData.length === 0) {
        missingItems.push('Service Types and Pricing Configuration');
      }

      // Check for payment methods
      const paymentMethods = await secureApiClient.get(`/payment-methods?customer_id=${customerId}`);
      const paymentMethodsData = (paymentMethods as any).data || [];
      if (!paymentMethodsData || paymentMethodsData.length === 0) {
        missingItems.push('Customer Payment Method on File');
      }

      return {
        canCreateInvoice: missingItems.length === 0,
        missingItems,
        ...(serviceAgreementId && { serviceAgreementId }),
        ...(workOrderId && { workOrderId }),
        ...(jobId && { jobId }),
        ...(serviceTypeId && { serviceTypeId })
      };
    } catch (error) {
      console.error('Error checking invoice prerequisites:', error);
      return {
        canCreateInvoice: false,
        missingItems: ['Unable to verify prerequisites - system error']
      };
    }
  }

  private async generateInvoiceNumber(): Promise<string> {
    try {
      // Get the current year and month
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      
      // Get the next invoice number for this month
      const response = await secureApiClient.get(`/invoices/next-number?year=${year}&month=${month}`);
      return (response as any).data.invoice_number;
    } catch (error) {
      // Fallback to timestamp-based number
      const timestamp = Date.now().toString().slice(-6);
      return `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${timestamp}`;
    }
  }

  // ============================================================================
  // PHASE 1: HIGH PRIORITY COMMAND IMPLEMENTATIONS
  // ============================================================================

  private async updateCustomer(intentResult: IntentResult): Promise<ActionResult> {
    try {
      const customerName = intentResult.entities.customerName;
      if (!customerName) {
        throw new Error('Customer name is required');
      }

      const customer = await this.findCustomer(customerName);
      if (!customer) {
        throw new Error(`Customer "${customerName}" not found`);
      }

      const updateData = intentResult.actionData?.customerData || {};
      console.log('🔧 Updating customer:', customer.name, 'with data:', updateData);
      
      // Filter out empty/undefined values and handle field mapping
      const filteredUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== undefined && value !== null && value !== '')
      );
      
      // Ensure we're using the correct field names for the database
      console.log('🔧 Filtered update data:', filteredUpdateData);
      
      const result = await secureApiClient.put(`/accounts/${customer.id}`, filteredUpdateData);
      console.log('🔧 Update result:', result);
      
      // Let's also check what the customer data looks like after the update
      console.log('🔧 Customer data after update:', customer);

      // Dispatch custom event to invalidate React Query cache
      window.dispatchEvent(new CustomEvent('customerUpdated', { 
        detail: { customerId: customer.id, updates: filteredUpdateData } 
      }));

      return {
        success: true,
        message: `Customer "${customerName}" updated successfully`,
        data: result
      };
    } catch (error) {
      console.error('🔧 Update error:', error);
      return {
        success: false,
        message: 'Failed to update customer',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async viewCustomerDetails(intentResult: IntentResult): Promise<ActionResult> {
    try {
      const customerName = intentResult.entities.customerName;
      if (!customerName) {
        throw new Error('Customer name is required');
      }

      const customer = await this.findCustomer(customerName);
      if (!customer) {
        throw new Error(`Customer "${customerName}" not found`);
      }

      return {
        success: true,
        message: `Showing details for ${customerName}`,
        navigation: {
          type: 'navigate',
          path: `/customers/${customer.id}`,
          message: `Navigating to ${customerName}'s profile`
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to view customer details',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async customerHistory(intentResult: IntentResult): Promise<ActionResult> {
    try {
      const customerName = intentResult.entities.customerName;
      if (!customerName) {
        throw new Error('Customer name is required');
      }

      const customer = await this.findCustomer(customerName);
      if (!customer) {
        throw new Error(`Customer "${customerName}" not found`);
      }

      const history = await secureApiClient.get(`/accounts/${customer.id}/service-history`);
      
      return {
        success: true,
        message: `Service history for ${customerName}`,
        data: (history as any).data
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get customer history',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async startJob(intentResult: IntentResult): Promise<ActionResult> {
    try {
      const customerName = intentResult.entities.customerName;
      if (!customerName) {
        throw new Error('Customer name is required');
      }

      const customer = await this.findCustomer(customerName);
      if (!customer) {
        throw new Error(`Customer "${customerName}" not found`);
      }

      const result = await secureApiClient.post(`/jobs/start`, {
        customer_id: customer.id,
        start_time: new Date().toISOString()
      });

      return {
        success: true,
        message: `Job started for ${customerName}`,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to start job',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async completeJob(intentResult: IntentResult): Promise<ActionResult> {
    try {
      const customerName = intentResult.entities.customerName;
      if (!customerName) {
        throw new Error('Customer name is required');
      }

      const customer = await this.findCustomer(customerName);
      if (!customer) {
        throw new Error(`Customer "${customerName}" not found`);
      }

      const notes = intentResult.entities.notes || 'Job completed';
      const result = await secureApiClient.post(`/jobs/complete`, {
        customer_id: customer.id,
        completion_notes: notes,
        end_time: new Date().toISOString()
      });

      return {
        success: true,
        message: `Job completed for ${customerName}`,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to complete job',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async pauseJob(intentResult: IntentResult): Promise<ActionResult> {
    try {
      const customerName = intentResult.entities.customerName;
      if (!customerName) {
        throw new Error('Customer name is required');
      }

      const customer = await this.findCustomer(customerName);
      if (!customer) {
        throw new Error(`Customer "${customerName}" not found`);
      }

      const result = await secureApiClient.post(`/jobs/pause`, {
        customer_id: customer.id
      });

      return {
        success: true,
        message: `Job paused for ${customerName}`,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to pause job',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async resumeJob(intentResult: IntentResult): Promise<ActionResult> {
    try {
      const customerName = intentResult.entities.customerName;
      if (!customerName) {
        throw new Error('Customer name is required');
      }

      const customer = await this.findCustomer(customerName);
      if (!customer) {
        throw new Error(`Customer "${customerName}" not found`);
      }

      const result = await secureApiClient.post(`/jobs/resume`, {
        customer_id: customer.id
      });

      return {
        success: true,
        message: `Job resumed for ${customerName}`,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to resume job',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async jobStatus(intentResult: IntentResult): Promise<ActionResult> {
    try {
      const customerName = intentResult.entities.customerName;
      if (!customerName) {
        throw new Error('Customer name is required');
      }

      const customer = await this.findCustomer(customerName);
      if (!customer) {
        throw new Error(`Customer "${customerName}" not found`);
      }

      const status = await secureApiClient.get(`/jobs/status?customer_id=${customer.id}`);
      
      return {
        success: true,
        message: `Job status for ${customerName}`,
        data: (status as any).data
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get job status',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async recordPayment(intentResult: IntentResult): Promise<ActionResult> {
    try {
      const customerName = intentResult.entities.customerName;
      const amount = intentResult.entities.amount;
      
      if (!customerName) {
        throw new Error('Customer name is required');
      }
      if (!amount) {
        throw new Error('Payment amount is required');
      }

      const customer = await this.findCustomer(customerName);
      if (!customer) {
        throw new Error(`Customer "${customerName}" not found`);
      }

      const result = await secureApiClient.post('/payments', {
        customer_id: customer.id,
        amount: amount,
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'cash'
      });

      return {
        success: true,
        message: `Payment of $${amount} recorded for ${customerName}`,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to record payment',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async sendInvoice(intentResult: IntentResult): Promise<ActionResult> {
    try {
      const customerName = intentResult.entities.customerName;
      if (!customerName) {
        throw new Error('Customer name is required');
      }

      const customer = await this.findCustomer(customerName);
      if (!customer) {
        throw new Error(`Customer "${customerName}" not found`);
      }

      const result = await secureApiClient.post(`/invoices/send`, {
        customer_id: customer.id
      });

      return {
        success: true,
        message: `Invoice sent to ${customerName}`,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send invoice',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async paymentHistory(intentResult: IntentResult): Promise<ActionResult> {
    try {
      const customerName = intentResult.entities.customerName;
      if (!customerName) {
        throw new Error('Customer name is required');
      }

      const customer = await this.findCustomer(customerName);
      if (!customer) {
        throw new Error(`Customer "${customerName}" not found`);
      }

      const history = await secureApiClient.get(`/payments?customer_id=${customer.id}`);
      
      return {
        success: true,
        message: `Payment history for ${customerName}`,
        data: (history as any).data
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get payment history',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async outstandingInvoices(_intentResult: IntentResult): Promise<ActionResult> {
    try {
      const invoices = await secureApiClient.get('/invoices?status=outstanding');
      
      return {
        success: true,
        message: 'Outstanding invoices retrieved',
        data: (invoices as any).data
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get outstanding invoices',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async advancedSearch(intentResult: IntentResult): Promise<ActionResult> {
    try {
      const query = intentResult.originalQuery;
      const results = await secureApiClient.post('/search/advanced', {
        query: query,
        filters: intentResult.entities
      });
      
      return {
        success: true,
        message: `Advanced search results for "${query}"`,
        data: (results as any).data
      };
    } catch (error) {
      return {
        success: false,
        message: 'Advanced search failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async showReports(_intentResult: IntentResult): Promise<ActionResult> {
    try {
      return {
        success: true,
        message: 'Opening reports dashboard',
        navigation: {
          type: 'navigate',
          path: '/reports',
          message: 'Navigating to reports page'
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to show reports',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // ============================================================================
  // PHASE 2 & 3: STUB IMPLEMENTATIONS
  // ============================================================================
  // These are placeholder implementations that return "not implemented" messages
  // They can be fully implemented as needed

  private async technicianSchedule(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Technician schedule feature not yet implemented' };
  }

  private async technicianAvailability(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Technician availability feature not yet implemented' };
  }

  private async technicianPerformance(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Technician performance feature not yet implemented' };
  }

  private async technicianLocation(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Technician location feature not yet implemented' };
  }

  private async equipmentAvailability(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Equipment availability feature not yet implemented' };
  }

  private async assignEquipment(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Assign equipment feature not yet implemented' };
  }

  private async equipmentMaintenance(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Equipment maintenance feature not yet implemented' };
  }

  private async inventoryLevels(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Inventory levels feature not yet implemented' };
  }

  private async sendAppointmentReminder(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Send appointment reminder feature not yet implemented' };
  }

  private async emailConfirmation(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Email confirmation feature not yet implemented' };
  }

  private async textMessage(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Text message feature not yet implemented' };
  }

  private async callCustomer(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Call customer feature not yet implemented' };
  }

  private async communicationHistory(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Communication history feature not yet implemented' };
  }

  private async sendFollowUpSurvey(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Send follow-up survey feature not yet implemented' };
  }

  private async notifyManager(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Notify manager feature not yet implemented' };
  }

  private async alertTechnician(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Alert technician feature not yet implemented' };
  }

  private async escalateIssue(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Escalate issue feature not yet implemented' };
  }

  private async revenueReport(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Revenue report feature not yet implemented' };
  }

  private async customerSatisfaction(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Customer satisfaction feature not yet implemented' };
  }

  private async serviceCompletionRates(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Service completion rates feature not yet implemented' };
  }

  private async customerRetention(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Customer retention feature not yet implemented' };
  }

  private async dailySchedule(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Daily schedule feature not yet implemented' };
  }

  private async weeklySummary(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Weekly summary feature not yet implemented' };
  }

  private async monthlyGrowth(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Monthly growth feature not yet implemented' };
  }

  private async addServiceNotes(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Add service notes feature not yet implemented' };
  }

  private async uploadPhotos(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Upload photos feature not yet implemented' };
  }

  private async addChemicalUsed(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Add chemical used feature not yet implemented' };
  }

  private async serviceDocumentation(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Service documentation feature not yet implemented' };
  }

  private async addTechnician(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Add technician feature not yet implemented' };
  }

  private async updateTechnician(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Update technician feature not yet implemented' };
  }

  private async deactivateUser(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Deactivate user feature not yet implemented' };
  }

  private async resetPassword(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Reset password feature not yet implemented' };
  }

  private async userPermissions(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'User permissions feature not yet implemented' };
  }

  private async auditLog(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Audit log feature not yet implemented' };
  }

  private async backupData(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Backup data feature not yet implemented' };
  }

  private async exportData(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Export data feature not yet implemented' };
  }

  private async importData(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Import data feature not yet implemented' };
  }

  private async systemHealth(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'System health feature not yet implemented' };
  }

  private async updateServiceAreas(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Update service areas feature not yet implemented' };
  }

  private async configureNotifications(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Configure notifications feature not yet implemented' };
  }

  private async trendAnalysis(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Trend analysis feature not yet implemented' };
  }

  private async performanceComparison(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Performance comparison feature not yet implemented' };
  }

  private async seasonalPatterns(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Seasonal patterns feature not yet implemented' };
  }

  private async customerPreferences(_intentResult: IntentResult): Promise<ActionResult> {
    return { success: false, message: 'Customer preferences feature not yet implemented' };
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private async findCustomer(customerName: string, requireExactMatch: boolean = false): Promise<any> {
    try {
      // Get all customers and search locally
      const customers = await secureApiClient.getAllAccounts();
      
      if (customers && customers.length > 0) {
        // Find exact match first
        const exactMatch = customers.find((c: any) => 
          c.name.toLowerCase() === customerName.toLowerCase()
        );
        if (exactMatch) return exactMatch;
        
        // If exact match required (for delete operations), don't do partial matching
        if (requireExactMatch) {
          return null;
        }
        
        // Find partial match (only for non-delete operations)
        const partialMatch = customers.find((c: any) => 
          c.name.toLowerCase().includes(customerName.toLowerCase())
        );
        if (partialMatch) return partialMatch;
        
        // Return null if no match found
        return null;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to find customer:', error);
      return null;
    }
  }

  private async findBestCustomerMatch(searchName: string): Promise<any> {
    try {
      // Get all customers and search locally
      const customers = await secureApiClient.getAllAccounts();
      
      if (!customers || customers.length === 0) {
        return null;
      }

      const searchLower = searchName.toLowerCase().trim();
      
      // Scoring system for fuzzy matching
      const scoredMatches = customers.map((customer: any) => {
        const customerName = customer.name.toLowerCase().trim();
        let score = 0;
        
        // Exact match gets highest score
        if (customerName === searchLower) {
          score = 100;
        }
        // Starts with search term gets high score
        else if (customerName.startsWith(searchLower)) {
          score = 80;
        }
        // Contains search term gets medium score
        else if (customerName.includes(searchLower)) {
          score = 60;
        }
        // Word boundary matches get medium-high score
        else if (new RegExp(`\\b${searchLower}`, 'i').test(customerName)) {
          score = 70;
        }
        // Levenshtein distance for fuzzy matching
        else {
          const distance = this.levenshteinDistance(searchLower, customerName);
          const maxLength = Math.max(searchLower.length, customerName.length);
          score = Math.max(0, 50 - (distance / maxLength) * 50);
        }
        
        return { customer, score };
      });

      // Sort by score (highest first) and return the best match
      scoredMatches.sort((a, b) => b.score - a.score);
      
      // Only return matches with a score above 30 (reasonable threshold)
      const bestMatch = scoredMatches[0];
      if (bestMatch && bestMatch.score >= 30) {
        console.log(`🔍 Best match for "${searchName}": "${bestMatch.customer.name}" (score: ${bestMatch.score})`);
        return bestMatch.customer;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to find best customer match:', error);
      return null;
    }
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];
    
    // Initialize matrix
    for (let j = 0; j <= str2.length; j++) {
      matrix[j] = [];
      for (let i = 0; i <= str1.length; i++) {
        if (j === 0) {
          matrix[j]![i] = i;
        } else if (i === 0) {
          matrix[j]![i] = j;
        } else {
          matrix[j]![i] = 0;
        }
      }
    }
    
    // Fill the matrix
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        const deletion = (matrix[j]?.[i - 1] ?? 0) + 1;
        const insertion = (matrix[j - 1]?.[i] ?? 0) + 1;
        const substitution = (matrix[j - 1]?.[i - 1] ?? 0) + indicator;
        matrix[j]![i] = Math.min(deletion, insertion, substitution);
      }
    }
    
    return matrix[str2.length]?.[str1.length] ?? 0;
  }

  private parseDate(dateString: string): string {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (dateString.toLowerCase()) {
      case 'today':
        return today.toISOString().split('T')[0] || '';
      case 'tomorrow':
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0] || '';
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split('T')[0] || '';
      default:
        // Try to parse as date
        const parsed = new Date(dateString);
        if (!isNaN(parsed.getTime())) {
          return parsed.toISOString().split('T')[0] || '';
        }
        // Default to tomorrow
        const defaultDate = new Date(today);
        defaultDate.setDate(defaultDate.getDate() + 1);
        return defaultDate.toISOString().split('T')[0] || '';
    }
  }
}

// Export singleton instance
export const actionExecutorService = new ActionExecutorService();

// Types are already exported above