/**
 * Customer → Scheduler Interaction
 * 
 * First card interaction implementation: Drag customer to scheduler card
 * to create an appointment.
 * 
 * This demonstrates the pattern for implementing card interactions.
 */

import { CardConfig, DragPayload, ActionResult } from '../types/cardInteractions.types';
import { getCardInteractionRegistry } from '../utils/CardInteractionRegistry';
import { logger } from '@/utils/logger';

/**
 * Create appointment from customer drag
 */
async function createAppointmentFromCustomer(payload: DragPayload): Promise<ActionResult> {
  try {
    const customer = payload.data.entity;
    
    logger.debug('Creating appointment from customer drag', {
      customerId: customer.id,
      customerName: customer.name
    });

    // TODO: Replace with actual API call
    // For now, this is a placeholder that shows the pattern
    const appointmentData = {
      customerId: customer.id,
      customerName: customer.name,
      customer: customer,
      // Default to today, user will select time
      date: new Date().toISOString().split('T')[0]
    };

    // In a real implementation, this would:
    // 1. Open appointment creation modal with customer pre-filled
    // 2. User selects date/time
    // 3. Create appointment via API
    // 4. Return success result

    // For now, we'll dispatch a custom event that the scheduler card can listen to
    const event = new CustomEvent('card-interaction:create-appointment', {
      detail: {
        customer: customer,
        appointmentData: appointmentData
      }
    });
    window.dispatchEvent(event);

    return {
      success: true,
      message: `Opening appointment creation for ${customer.name}`,
      data: appointmentData
    };
  } catch (error) {
    logger.error('Error creating appointment from customer', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create appointment'
    };
  }
}

/**
 * Register Customer Search Card configuration
 */
export function registerCustomerSearchCard(): void {
  const registry = getCardInteractionRegistry();

  const config: CardConfig = {
    id: 'customer-search',
    type: 'customer-search',
    canDrag: true,
    dragConfig: {
      dataType: 'customer',
      supportsMultiSelect: false,
      getDragPayload: (customer) => ({
        sourceCardId: 'customer-search',
        sourceCardType: 'customer-search',
        sourceDataType: 'customer',
        data: {
          id: customer.id,
          type: 'customer',
          entity: customer
        },
        dragPreview: {
          title: customer.name || 'Customer',
          icon: '👤',
          color: '#3b82f6'
        },
        timestamp: Date.now(),
        userId: 'current-user' // Will be replaced with actual user ID
      }),
      getDragPreview: (customer) => ({
        title: customer.name || 'Customer',
        icon: '👤',
        color: '#3b82f6'
      })
    }
  };

  registry.registerCard(config);
  logger.debug('Registered Customer Search Card for interactions');
}

/**
 * Register Scheduler Card configuration
 */
export function registerSchedulerCard(): void {
  const registry = getCardInteractionRegistry();

  const config: CardConfig = {
    id: 'scheduler',
    type: 'scheduler',
    dropZones: [
      {
        cardId: 'scheduler',
        cardType: 'scheduler',
        accepts: {
          dataTypes: ['customer', 'job', 'workorder']
        },
        actions: {
          'create-appointment': {
            id: 'create-appointment',
            label: 'Create Appointment',
            icon: '📅',
            description: 'Schedule a new appointment for this customer',
            handler: createAppointmentFromCustomer,
            requiresConfirmation: false
          },
          'reschedule': {
            id: 'reschedule',
            label: 'Reschedule Existing',
            icon: '🔄',
            description: 'Reschedule an existing appointment',
            handler: async (_payload: DragPayload) => {
              // TODO: Implement reschedule logic
              return {
                success: false,
                error: 'Reschedule not yet implemented'
              };
            },
            requiresConfirmation: true,
            confirmationMessage: 'Are you sure you want to reschedule this appointment?'
          }
        },
        dropZoneStyle: {
          highlightColor: '#6366f1',
          borderStyle: 'dashed',
          backgroundColor: 'rgba(99, 102, 241, 0.05)'
        }
      }
    ]
  };

  registry.registerCard(config);
  logger.debug('Registered Scheduler Card for interactions');
}

/**
 * Initialize all customer-to-scheduler interactions
 */
export function initializeCustomerToSchedulerInteraction(): void {
  registerCustomerSearchCard();
  registerSchedulerCard();
  
  logger.info('Customer → Scheduler interaction initialized');
}








