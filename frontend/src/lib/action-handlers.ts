// ============================================================================
// ACTION HANDLERS
// ============================================================================
// Execute actions based on classified intents from natural language queries

import { enhancedApi } from './enhanced-api';
import { searchAnalyticsService } from './search-analytics-service';
import type { 
  SearchIntent, 
  ExtractedEntities, 
  IntentResult 
} from './intent-classification-service';
import type { Account } from '@/types';

export interface ActionResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  actionType: SearchIntent;
  entities: ExtractedEntities;
  requiresConfirmation?: boolean;
  confirmationData?: any;
}

export interface ActionHandler {
  canHandle: (intent: SearchIntent, entities: ExtractedEntities) => boolean;
  execute: (entities: ExtractedEntities) => Promise<ActionResult>;
  getConfirmationData: (entities: ExtractedEntities) => any;
  validate: (entities: ExtractedEntities) => { isValid: boolean; errors: string[] };
}

// ============================================================================
// ACTION HANDLER IMPLEMENTATIONS
// ============================================================================

export class CreateCustomerHandler implements ActionHandler {
  canHandle(intent: SearchIntent, entities: ExtractedEntities): boolean {
    return intent === 'createCustomer' && !!entities.customerName;
  }

  async execute(entities: ExtractedEntities): Promise<ActionResult> {
    try {
      console.log('🔄 Creating customer with entities:', entities);
      
      // Start analytics tracking
      const actionId = searchAnalyticsService.createQueryId();
      searchAnalyticsService.startSearchTracking(actionId);
      
      // Validate required fields
      const validation = this.validate(entities);
      if (!validation.isValid) {
        return {
          success: false,
          message: 'Validation failed',
          error: validation.errors.join(', '),
          actionType: 'createCustomer',
          entities
        };
      }

      // Create customer data object
      const customerData = {
        name: entities.customerName!,
        address: entities.address || '',
        phone: entities.phone || '',
        email: entities.email || '',
        account_type: 'residential' as const,
        status: 'active' as const,
        notes: entities.notes || ''
      };

      // TODO: Implement actual customer creation API call
      // For now, simulate the creation
      console.log('📝 Would create customer:', customerData);
      
      // Complete analytics tracking
      searchAnalyticsService.completeSearchTracking(actionId, {
        results_count: 1,
        execution_time_ms: 150,
        search_successful: true
      });

      return {
        success: true,
        message: `Customer "${entities.customerName}" created successfully`,
        data: customerData,
        actionType: 'createCustomer',
        entities
      };

    } catch (error) {
      console.error('❌ Error creating customer:', error);
      
      // Log error to analytics
      searchAnalyticsService.logSearchError('createCustomer', error as Error);
      
      return {
        success: false,
        message: 'Failed to create customer',
        error: error instanceof Error ? error.message : 'Unknown error',
        actionType: 'createCustomer',
        entities
      };
    }
  }

  getConfirmationData(entities: ExtractedEntities): any {
    return {
      action: 'Create Customer Account',
      customerName: entities.customerName,
      address: entities.address,
      phone: entities.phone,
      email: entities.email,
      notes: entities.notes,
      summary: `Create new customer account for ${entities.customerName}${entities.address ? ` at ${entities.address}` : ''}`
    };
  }

  validate(entities: ExtractedEntities): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!entities.customerName) {
      errors.push('Customer name is required');
    }
    
    if (entities.customerName && entities.customerName.length < 2) {
      errors.push('Customer name must be at least 2 characters');
    }
    
    if (entities.email && !this.isValidEmail(entities.email)) {
      errors.push('Invalid email format');
    }
    
    if (entities.phone && !this.isValidPhone(entities.phone)) {
      errors.push('Invalid phone format');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\d\-\+\(\)\s]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }
}

export class ScheduleAppointmentHandler implements ActionHandler {
  canHandle(intent: SearchIntent, entities: ExtractedEntities): boolean {
    return intent === 'scheduleAppointment' && !!entities.customerName;
  }

  async execute(entities: ExtractedEntities): Promise<ActionResult> {
    try {
      console.log('🔄 Scheduling appointment with entities:', entities);
      
      // Start analytics tracking
      const actionId = searchAnalyticsService.createQueryId();
      searchAnalyticsService.startSearchTracking(actionId);
      
      // Validate required fields
      const validation = this.validate(entities);
      if (!validation.isValid) {
        return {
          success: false,
          message: 'Validation failed',
          error: validation.errors.join(', '),
          actionType: 'scheduleAppointment',
          entities
        };
      }

      // Create appointment data object
      const appointmentData = {
        customerName: entities.customerName!,
        serviceType: entities.pestType || 'General Pest Control',
        serviceDate: entities.serviceDate || 'tomorrow',
        serviceTime: entities.serviceTime || '9:00 AM',
        address: entities.address || '',
        urgency: entities.urgency || 'medium'
      };

      // TODO: Implement actual appointment scheduling API call
      // For now, simulate the scheduling
      console.log('📅 Would schedule appointment:', appointmentData);
      
      // Complete analytics tracking
      searchAnalyticsService.completeSearchTracking(actionId, {
        results_count: 1,
        execution_time_ms: 200,
        search_successful: true
      });

      return {
        success: true,
        message: `Appointment scheduled for ${entities.customerName}`,
        data: appointmentData,
        actionType: 'scheduleAppointment',
        entities
      };

    } catch (error) {
      console.error('❌ Error scheduling appointment:', error);
      
      // Log error to analytics
      searchAnalyticsService.logSearchError('scheduleAppointment', error as Error);
      
      return {
        success: false,
        message: 'Failed to schedule appointment',
        error: error instanceof Error ? error.message : 'Unknown error',
        actionType: 'scheduleAppointment',
        entities
      };
    }
  }

  getConfirmationData(entities: ExtractedEntities): any {
    return {
      action: 'Schedule Appointment',
      customerName: entities.customerName,
      serviceType: entities.pestType || 'General Pest Control',
      serviceDate: entities.serviceDate || 'tomorrow',
      serviceTime: entities.serviceTime || '9:00 AM',
      address: entities.address,
      urgency: entities.urgency || 'medium',
      summary: `Schedule ${entities.pestType || 'pest control'} service for ${entities.customerName} on ${entities.serviceDate || 'tomorrow'} at ${entities.serviceTime || '9:00 AM'}`
    };
  }

  validate(entities: ExtractedEntities): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!entities.customerName) {
      errors.push('Customer name is required');
    }
    
    if (!entities.serviceDate && !entities.serviceTime) {
      errors.push('Service date or time is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export class UpdateAppointmentHandler implements ActionHandler {
  canHandle(intent: SearchIntent, entities: ExtractedEntities): boolean {
    return intent === 'updateAppointment' && !!entities.customerName;
  }

  async execute(entities: ExtractedEntities): Promise<ActionResult> {
    try {
      console.log('🔄 Updating appointment with entities:', entities);
      
      // Start analytics tracking
      const actionId = searchAnalyticsService.createQueryId();
      searchAnalyticsService.startSearchTracking(actionId);
      
      // Validate required fields
      const validation = this.validate(entities);
      if (!validation.isValid) {
        return {
          success: false,
          message: 'Validation failed',
          error: validation.errors.join(', '),
          actionType: 'updateAppointment',
          entities
        };
      }

      // Create update data object
      const updateData = {
        customerName: entities.customerName!,
        newDate: entities.serviceDate || 'tomorrow',
        newTime: entities.serviceTime || '9:00 AM',
        appointmentId: entities.appointmentId || ''
      };

      // TODO: Implement actual appointment update API call
      // For now, simulate the update
      console.log('🔄 Would update appointment:', updateData);
      
      // Complete analytics tracking
      searchAnalyticsService.completeSearchTracking(actionId, {
        results_count: 1,
        execution_time_ms: 180,
        search_successful: true
      });

      return {
        success: true,
        message: `Appointment updated for ${entities.customerName}`,
        data: updateData,
        actionType: 'updateAppointment',
        entities
      };

    } catch (error) {
      console.error('❌ Error updating appointment:', error);
      
      // Log error to analytics
      searchAnalyticsService.logSearchError('updateAppointment', error as Error);
      
      return {
        success: false,
        message: 'Failed to update appointment',
        error: error instanceof Error ? error.message : 'Unknown error',
        actionType: 'updateAppointment',
        entities
      };
    }
  }

  getConfirmationData(entities: ExtractedEntities): any {
    return {
      action: 'Update Appointment',
      customerName: entities.customerName,
      newDate: entities.serviceDate || 'tomorrow',
      newTime: entities.serviceTime || '9:00 AM',
      appointmentId: entities.appointmentId,
      summary: `Reschedule appointment for ${entities.customerName} to ${entities.serviceDate || 'tomorrow'} at ${entities.serviceTime || '9:00 AM'}`
    };
  }

  validate(entities: ExtractedEntities): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!entities.customerName) {
      errors.push('Customer name is required');
    }
    
    if (!entities.serviceDate && !entities.serviceTime) {
      errors.push('New date or time is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export class AddNoteHandler implements ActionHandler {
  canHandle(intent: SearchIntent, entities: ExtractedEntities): boolean {
    return intent === 'addNote' && !!entities.notes && !!entities.customerName;
  }

  async execute(entities: ExtractedEntities): Promise<ActionResult> {
    try {
      console.log('🔄 Adding note with entities:', entities);
      
      // Start analytics tracking
      const actionId = searchAnalyticsService.createQueryId();
      searchAnalyticsService.startSearchTracking(actionId);
      
      // Validate required fields
      const validation = this.validate(entities);
      if (!validation.isValid) {
        return {
          success: false,
          message: 'Validation failed',
          error: validation.errors.join(', '),
          actionType: 'addNote',
          entities
        };
      }

      // Create note data object
      const noteData = {
        customerName: entities.customerName!,
        noteContent: entities.notes!,
        timestamp: new Date().toISOString()
      };

      // TODO: Implement actual note addition API call
      // For now, simulate the note addition
      console.log('📝 Would add note:', noteData);
      
      // Complete analytics tracking
      searchAnalyticsService.completeSearchTracking(actionId, {
        results_count: 1,
        execution_time_ms: 120,
        search_successful: true
      });

      return {
        success: true,
        message: `Note added for ${entities.customerName}`,
        data: noteData,
        actionType: 'addNote',
        entities
      };

    } catch (error) {
      console.error('❌ Error adding note:', error);
      
      // Log error to analytics
      searchAnalyticsService.logSearchError('addNote', error as Error);
      
      return {
        success: false,
        message: 'Failed to add note',
        error: error instanceof Error ? error.message : 'Unknown error',
        actionType: 'addNote',
        entities
      };
    }
  }

  getConfirmationData(entities: ExtractedEntities): any {
    return {
      action: 'Add Customer Note',
      customerName: entities.customerName,
      noteContent: entities.notes,
      summary: `Add note for ${entities.customerName}: "${entities.notes}"`
    };
  }

  validate(entities: ExtractedEntities): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!entities.customerName) {
      errors.push('Customer name is required');
    }
    
    if (!entities.notes) {
      errors.push('Note content is required');
    }
    
    if (entities.notes && entities.notes.length < 3) {
      errors.push('Note must be at least 3 characters');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// ============================================================================
// ACTION EXECUTOR SERVICE
// ============================================================================

export class ActionExecutorService {
  private handlers: ActionHandler[] = [];

  constructor() {
    this.registerHandlers();
  }

  /**
   * Register all available action handlers
   */
  private registerHandlers(): void {
    this.handlers.push(
      new CreateCustomerHandler(),
      new ScheduleAppointmentHandler(),
      new UpdateAppointmentHandler(),
      new AddNoteHandler()
      // TODO: Add more handlers as they're implemented
    );
  }

  /**
   * Execute an action based on the classified intent
   */
  async executeAction(intentResult: IntentResult): Promise<ActionResult> {
    console.log('🚀 Executing action for intent:', intentResult.intent);
    
    // Find the appropriate handler
    const handler = this.handlers.find(h => h.canHandle(intentResult.intent, intentResult.entities));
    
    if (!handler) {
      return {
        success: false,
        message: `No handler available for intent: ${intentResult.intent}`,
        actionType: intentResult.intent,
        entities: intentResult.entities
      };
    }

    // Validate the entities
    const validation = handler.validate(intentResult.entities);
    if (!validation.isValid) {
      return {
        success: false,
        message: 'Validation failed',
        error: validation.errors.join(', '),
        actionType: intentResult.intent,
        entities: intentResult.entities
      };
    }

    // Execute the action
    try {
      const result = await handler.execute(intentResult.entities);
      
      // Add confirmation data if needed
      if (result.success && intentResult.confidence < 0.8) {
        result.requiresConfirmation = true;
        result.confirmationData = handler.getConfirmationData(intentResult.entities);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Error executing action:', error);
      
      return {
        success: false,
        message: 'Action execution failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        actionType: intentResult.intent,
        entities: intentResult.entities
      };
    }
  }

  /**
   * Get confirmation data for an action without executing it
   */
  getConfirmationData(intentResult: IntentResult): any {
    const handler = this.handlers.find(h => h.canHandle(intentResult.intent, intentResult.entities));
    
    if (!handler) {
      return null;
    }

    return handler.getConfirmationData(intentResult.entities);
  }

  /**
   * Validate entities for an action without executing it
   */
  validateAction(intentResult: IntentResult): { isValid: boolean; errors: string[] } {
    const handler = this.handlers.find(h => h.canHandle(intentResult.intent, intentResult.entities));
    
    if (!handler) {
      return { isValid: false, errors: [`No handler available for intent: ${intentResult.intent}`] };
    }

    return handler.validate(intentResult.entities);
  }

  /**
   * Get all supported action types
   */
  getSupportedActions(): SearchIntent[] {
    return this.handlers.map(h => {
      // Extract the intent type from the handler class name
      const className = h.constructor.name;
      if (className.includes('CreateCustomer')) return 'createCustomer';
      if (className.includes('ScheduleAppointment')) return 'scheduleAppointment';
      if (className.includes('UpdateAppointment')) return 'updateAppointment';
      if (className.includes('AddNote')) return 'addNote';
      return 'search';
    });
  }
}

// Export singleton instance
export const actionExecutorService = new ActionExecutorService();
