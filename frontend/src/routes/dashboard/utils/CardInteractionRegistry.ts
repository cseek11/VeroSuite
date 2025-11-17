/**
 * Card Interaction Registry
 * 
 * Centralized registry for managing card interactions, drop zones, and drag configurations.
 * This enables cards to discover what interactions are available and what data they can accept.
 */

import {
  CardConfig,
  DropZoneConfig,
  DragConfig,
  InteractionConfig,
  DataType,
  DragPayload,
  RegistryState
} from '../types/cardInteractions.types';
import { logger } from '@/utils/logger';

interface DragState {
  isDragging: boolean;
  payload: DragPayload | null;
  dropTarget: string | null;
  dropZoneHighlight: string | null;
  availableActions: DropZoneConfig[];
}

export class CardInteractionRegistry {
  private cards: Map<string, CardConfig> = new Map();
  private interactions: Map<string, InteractionConfig> = new Map();
  private enabled: boolean = true;
  private dragState: DragState = {
    isDragging: false,
    payload: null,
    dropTarget: null,
    dropZoneHighlight: null,
    availableActions: []
  };
  private dragStateListeners: Set<(state: DragState) => void> = new Set();

  /**
   * Register a card configuration
   */
  registerCard(config: CardConfig): void {
    if (!config.id || !config.type) {
      throw new Error('Card config must have id and type');
    }
    
    this.cards.set(config.id, config);
  }

  /**
   * Register an interaction between cards
   */
  registerInteraction(config: InteractionConfig): void {
    if (!config.id) {
      throw new Error('Interaction config must have id');
    }
    
    this.interactions.set(config.id, config);
  }

  /**
   * Get card configuration
   */
  getCardConfig(cardId: string): CardConfig | undefined {
    return this.cards.get(cardId);
  }

  /**
   * Get all drop zones for a card
   */
  getDropZonesForCard(cardId: string): DropZoneConfig[] {
    const config = this.cards.get(cardId);
    return config?.dropZones || [];
  }

  /**
   * Get drag configuration for a card
   */
  getDragConfigForCard(cardId: string): DragConfig | undefined {
    const config = this.cards.get(cardId);
    return config?.canDrag ? config.dragConfig : undefined;
  }

  /**
   * Find all cards that accept a specific data type
   */
  findCardsThatAccept(dataType: DataType): string[] {
    const acceptingCards: string[] = [];
    
    this.cards.forEach((config, cardId) => {
      const accepts = config.dropZones?.some(zone =>
        zone.accepts.dataTypes.includes(dataType)
      );
      if (accepts) {
        acceptingCards.push(cardId);
      }
    });
    
    return acceptingCards;
  }

  /**
   * Check if a card can accept a specific payload
   */
  canCardAccept(cardId: string, payload: DragPayload): boolean {
    const dropZones = this.getDropZonesForCard(cardId);
    
    return dropZones.some(zone => {
      // Check data type
      if (!zone.accepts.dataTypes.includes(payload.sourceDataType)) {
        return false;
      }
      
      // Check max items
      if (zone.accepts.maxItems !== undefined) {
        const itemCount = payload.data.metadata?.selectedItems?.length || 1;
        if (itemCount > zone.accepts.maxItems) {
          return false;
        }
      }
      
      // Check required fields
      if (zone.accepts.requiredFields) {
        const hasAllFields = zone.accepts.requiredFields.every(field =>
          payload.data.entity?.[field] !== undefined
        );
        if (!hasAllFields) {
          return false;
        }
      }
      
      // Custom validator
      if (zone.accepts.customValidator) {
        if (!zone.accepts.customValidator(payload)) {
          return false;
        }
      }
      
      // Run zone validator if present
      if (zone.validator) {
        const result = zone.validator(payload);
        if (!result.valid) {
          return false;
        }
      }
      
      return true;
    });
  }

  /**
   * Get available actions for a payload on a target card
   */
  getAvailableActions(cardId: string, payload: DragPayload): InteractionConfig[] {
    const dropZones = this.getDropZonesForCard(cardId);
    const availableActions: InteractionConfig[] = [];
    
    dropZones.forEach(zone => {
      if (this.canCardAccept(cardId, payload)) {
        Object.entries(zone.actions).forEach(([actionId, actionConfig]) => {
          // Check if action is disabled
          if (actionConfig.disabled) {
            return;
          }
          
          availableActions.push({
            id: `${cardId}-${actionId}`,
            sourceCardType: payload.sourceCardType,
            targetCardType: zone.cardType,
            sourceDataType: payload.sourceDataType,
            actionId,
            handler: actionConfig.handler,
            metadata: {
              ...actionConfig,
              dropZoneId: zone.cardId
            }
          });
        });
      }
    });
    
    return availableActions;
  }

  /**
   * Get all registered cards
   */
  getAllCards(): CardConfig[] {
    return Array.from(this.cards.values());
  }

  /**
   * Get all registered interactions
   */
  getAllInteractions(): InteractionConfig[] {
    return Array.from(this.interactions.values());
  }

  /**
   * Unregister a card
   */
  unregisterCard(cardId: string): void {
    this.cards.delete(cardId);
  }

  /**
   * Unregister an interaction
   */
  unregisterInteraction(interactionId: string): void {
    this.interactions.delete(interactionId);
  }

  /**
   * Clear all registrations
   */
  clear(): void {
    this.cards.clear();
    this.interactions.clear();
  }

  /**
   * Enable/disable the registry
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Check if registry is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Get registry state (for debugging/monitoring)
   */
  getState(): RegistryState {
    return {
      cards: Array.from(this.cards.values()),
      interactions: Array.from(this.interactions.values()),
      enabled: this.enabled
    };
  }

  /**
   * Drag state management - shared across all components
   */
  setDragState(state: Partial<DragState>): void {
    const oldState = { ...this.dragState };
    this.dragState = { ...this.dragState, ...state };
    
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Registry setDragState', {
        oldState: { isDragging: oldState.isDragging, hasPayload: !!oldState.payload },
        newState: { isDragging: this.dragState.isDragging, hasPayload: !!this.dragState.payload },
        listenerCount: this.dragStateListeners.size,
        payloadType: this.dragState.payload?.sourceDataType
      }, 'CardInteractionRegistry');
    }
    
    // Notify all listeners
    this.dragStateListeners.forEach(listener => {
      try {
        listener(this.dragState);
      } catch (error: unknown) {
        logger.error('Error in drag state listener', error, 'CardInteractionRegistry');
      }
    });
    
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Registry notified all listeners', {}, 'CardInteractionRegistry');
    }
  }

  getDragState(): DragState {
    return { ...this.dragState };
  }

  subscribeToDragState(listener: (state: DragState) => void): () => void {
    this.dragStateListeners.add(listener);
    // Immediately call with current state
    listener(this.dragState);
    // Return unsubscribe function
    return () => {
      this.dragStateListeners.delete(listener);
    };
  }
}

// Singleton instance
let registryInstance: CardInteractionRegistry | null = null;

/**
 * Get the global card interaction registry instance
 */
export function getCardInteractionRegistry(): CardInteractionRegistry {
  if (!registryInstance) {
    registryInstance = new CardInteractionRegistry();
  }
  return registryInstance;
}

/**
 * Reset the registry (useful for testing)
 */
export function resetCardInteractionRegistry(): void {
  registryInstance = null;
}



