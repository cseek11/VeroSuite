/**
 * DropZone Component
 * 
 * Wraps a card to make it accept drops from other cards.
 * Handles drop detection, visual feedback, and action execution.
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { DropZoneConfig, DragPayload, ActionResult } from '../types/cardInteractions.types';
import { useCardDataDragDrop } from '../hooks/useCardDataDragDrop';
import { getCardInteractionRegistry } from '../utils/CardInteractionRegistry';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import { logger } from '@/utils/logger';

interface DropZoneProps {
  cardId: string;
  dropZoneConfig: DropZoneConfig;
  children: React.ReactNode;
  className?: string;
  onDrop?: (payload: DragPayload, result: ActionResult) => void;
  showActionMenu?: boolean; // Show menu if multiple actions available
}

export const DropZone: React.FC<DropZoneProps> = ({
  cardId,
  dropZoneConfig,
  children,
  className = '',
  onDrop,
  showActionMenu = true
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    payload: DragPayload;
    actionId: string;
    action: DropZoneConfig['actions'][string];
  } | null>(null);
  const [showActionMenuModal, setShowActionMenuModal] = useState(false);
  const [actionMenuPayload, setActionMenuPayload] = useState<DragPayload | null>(null);

  const {
    isDragging,
    draggingPayload,
    dropZoneHighlight,
    handleContentDrop,
    canCardAccept
  } = useCardDataDragDrop({
    onActionExecuted: (_actionId, result) => {
      if (pendingAction && onDrop) {
        onDrop(pendingAction.payload, result);
      }
      setPendingAction(null);
      setShowConfirmModal(false);
    }
  });

  // Use ref to access the DOM element
  const dropZoneRef = React.useRef<HTMLDivElement>(null);
  
  // Register this drop zone with the registry
  useEffect(() => {
    const registry = getCardInteractionRegistry();
    
    // Get or create card config
    let cardConfig = registry.getCardConfig(cardId);
    if (!cardConfig) {
      cardConfig = {
        id: cardId,
        type: dropZoneConfig.cardType || cardId,
        dropZones: []
      };
      registry.registerCard(cardConfig);
    }
    
    // Add this drop zone to the card's drop zones if not already present
    const existingZone = cardConfig.dropZones?.find(zone => zone.cardId === cardId);
    if (!existingZone) {
      if (!cardConfig.dropZones) {
        cardConfig.dropZones = [];
      }
      cardConfig.dropZones.push(dropZoneConfig);
      registry.registerCard(cardConfig);
      logger.debug('Registered drop zone', { cardId, dataTypes: dropZoneConfig.accepts.dataTypes });
    }

    return () => {
      // Cleanup: remove drop zone on unmount
      const currentConfig = registry.getCardConfig(cardId);
      if (currentConfig?.dropZones) {
        currentConfig.dropZones = currentConfig.dropZones.filter(
          zone => zone.cardId !== cardId || zone !== dropZoneConfig
        );
        if (currentConfig.dropZones.length === 0) {
          // Remove card if no drop zones left
          registry.unregisterCard?.(cardId);
        } else {
          registry.registerCard(currentConfig);
        }
      }
    };
  }, [cardId, dropZoneConfig]);

  // Check if this drop zone is highlighted
  const isHighlighted = dropZoneHighlight === cardId && isDragging && draggingPayload;

  // Check if current drag can be accepted
  const canAccept = isDragging && draggingPayload && canCardAccept(cardId, draggingPayload);

  /**
   * Handle drag over (React synthetic event)
   */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    // CRITICAL: Always prevent default FIRST to allow drop
    e.preventDefault();
    // Don't stop propagation - let it bubble if needed, but we handle it here
    
    if (process.env.NODE_ENV === 'development') {
      logger.debug('DropZone dragover event received', {
        cardId,
        target: e.target,
        currentTarget: e.currentTarget,
        targetTag: (e.target as HTMLElement)?.tagName,
        targetClass: (e.target as HTMLElement)?.className,
        isDragging,
        hasPayload: !!draggingPayload,
        payloadType: draggingPayload?.sourceDataType
      }, 'DropZone');
    }
    
    // Always check canAccept fresh on each event
    const freshCanAccept = isDragging && draggingPayload && canCardAccept(cardId, draggingPayload);
    
    if (process.env.NODE_ENV === 'development') {
      logger.debug('DropZone canAccept check', {
        cardId,
        isDragging,
        hasPayload: !!draggingPayload,
        payloadType: draggingPayload?.sourceDataType,
        freshCanAccept
      }, 'DropZone');
    }
    
    if (!freshCanAccept) {
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'none';
      }
      if (process.env.NODE_ENV === 'development') {
        logger.debug('DropZone rejecting drag - cannot accept', {}, 'DropZone');
      }
      return;
    }

    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
    setIsDragOver(true);
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Drop zone active', { 
        cardId, 
        dataType: draggingPayload?.sourceDataType,
        isDragging,
        hasPayload: !!draggingPayload,
        canAccept: freshCanAccept
      }, 'DropZone');
    }
  }, [cardId, isDragging, draggingPayload, canCardAccept]);
  
  /**
   * Handle drag over (native event - fallback)
   * Use refs to avoid re-creating the handler when state changes
   */
  const isDraggingRef = useRef(isDragging);
  const draggingPayloadRef = useRef(draggingPayload);
  
  useEffect(() => {
    isDraggingRef.current = isDragging;
    draggingPayloadRef.current = draggingPayload;
  }, [isDragging, draggingPayload]);
  
  const handleNativeDragOver = useCallback((e: DragEvent) => {
    // Only handle if React event didn't fire (fallback)
    if (process.env.NODE_ENV === 'development') {
      logger.debug('DropZone NATIVE dragover event', {
        cardId,
        target: e.target,
        isDragging: isDraggingRef.current,
        hasPayload: !!draggingPayloadRef.current
      }, 'DropZone');
    }
    
    // CRITICAL: Always prevent default to allow drop
    e.preventDefault();
    e.stopPropagation(); // Stop propagation so React handler doesn't also fire
    
    // Always check canAccept fresh on each event
    const freshCanAccept = isDraggingRef.current && draggingPayloadRef.current && canCardAccept(cardId, draggingPayloadRef.current);
    
    if (!freshCanAccept) {
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'none';
      }
      return;
    }

    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
    setIsDragOver(true);
  }, [cardId, canCardAccept]);
  
  // Add native event listeners as fallback (in case React events don't fire)
  useEffect(() => {
    const element = dropZoneRef.current;
    if (!element) {
      logger.warn('DropZone element not found', { cardId }, 'DropZone');
      return;
    }
    
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Adding native drag listeners to DropZone', { 
        cardId,
        element: element.tagName,
        inDOM: document.body.contains(element),
        hasListeners: element.ondragover !== null
      }, 'DropZone');
    }
    
    // Add native dragover listener with capture phase to catch events early
    const nativeDragOverHandler = (e: DragEvent) => {
      if (process.env.NODE_ENV === 'development') {
        logger.debug('DropZone NATIVE dragover event', {
          cardId,
          target: e.target,
          currentTarget: e.currentTarget,
          phase: 'capture'
        }, 'DropZone');
      }
      handleNativeDragOver(e);
    };
    
    // Add native drop listener as fallback (in case React event doesn't fire)
    // This ensures the drop is allowed even if React's event system has issues
    const nativeDropHandler = (e: DragEvent) => {
      if (process.env.NODE_ENV === 'development') {
        logger.debug('DropZone NATIVE drop event (capture phase)', {
          cardId,
          target: e.target,
          currentTarget: e.currentTarget,
          isDragging: isDraggingRef.current,
          hasPayload: !!draggingPayloadRef.current,
          defaultPrevented: e.defaultPrevented
        }, 'DropZone');
      }
      
      // Always prevent default to allow drop (if not already prevented)
      // This ensures the drop is allowed even if React hasn't handled it yet
      // React's handler will process the actual drop logic
      if (!e.defaultPrevented && isDraggingRef.current && draggingPayloadRef.current) {
        const freshCanAccept = canCardAccept(cardId, draggingPayloadRef.current);
        if (freshCanAccept) {
          if (process.env.NODE_ENV === 'development') {
            logger.debug('Native drop handler - preventing default to allow drop', {}, 'DropZone');
          }
          e.preventDefault();
          // DO NOT stop propagation - let React handle the processing
        }
      }
    };
    
    element.addEventListener('dragover', nativeDragOverHandler, true); // Use capture phase
    element.addEventListener('drop', nativeDropHandler, true); // Use capture phase as fallback
    
    return () => {
      element.removeEventListener('dragover', nativeDragOverHandler, true);
      element.removeEventListener('drop', nativeDropHandler, true);
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Removed native drag listeners from DropZone', { cardId }, 'DropZone');
      }
    };
  }, [cardId, handleNativeDragOver, canCardAccept]);

  /**
   * Handle drag leave
   */
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // Only set drag over to false if we're leaving the drop zone
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
      setIsDragOver(false);
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Left drop zone', { cardId }, 'DropZone');
      }
    }
  }, [cardId]);

  /**
   * Handle drop
   */
  const handleDrop = useCallback(async (e: React.DragEvent) => {
    // CRITICAL: Prevent default FIRST to allow drop
    e.preventDefault();
    e.stopPropagation();
    
    if (process.env.NODE_ENV === 'development') {
      logger.debug('DropZone drop event', {
        cardId,
        canAccept,
        hasPayload: !!draggingPayload,
        isDragging,
        dataTransferTypes: Array.from(e.dataTransfer.types),
        target: e.target,
        currentTarget: e.currentTarget,
        defaultPrevented: e.defaultPrevented
      }, 'DropZone');
    }

    if (!canAccept || !draggingPayload) {
      if (process.env.NODE_ENV === 'development') {
        logger.debug('DropZone drop rejected', { 
          canAccept, 
          hasPayload: !!draggingPayload,
          isDragging,
          payloadType: draggingPayload?.sourceDataType
        }, 'DropZone');
      }
      return;
    }

    setIsDragOver(false);

    // Get payload from data transfer or use current dragging payload
    let payload: DragPayload;
    try {
      const data = e.dataTransfer.getData('application/json');
      if (process.env.NODE_ENV === 'development') {
        logger.debug('DataTransfer data', {
          hasJson: !!data,
          jsonLength: data?.length,
          textPlain: e.dataTransfer.getData('text/plain')
        }, 'DropZone');
      }
      payload = data ? JSON.parse(data) : draggingPayload;
    } catch (error: unknown) {
      logger.error('Failed to parse payload', error, 'DropZone');
      payload = draggingPayload;
    }

    if (process.env.NODE_ENV === 'development') {
      logger.debug('Final payload', {
        sourceCardId: payload.sourceCardId,
        dataType: payload.sourceDataType,
        customerName: payload.dragPreview?.title || payload.data.entity?.name,
        customerId: payload.data.id
      }, 'DropZone');
    }

    // Get available actions
    const availableActions = Object.entries(dropZoneConfig.actions);

    if (availableActions.length === 0) {
      logger.warn('No actions available for drop zone', { cardId });
      return;
    }

    if (availableActions.length === 1) {
      // Single action - check if confirmation needed
      const firstAction = availableActions[0];
      if (!firstAction) return;
      const [actionId, action] = firstAction;
      
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Executing single action', { actionId, actionLabel: action.label }, 'DropZone');
      }
      
      if (action.requiresConfirmation) {
        setPendingAction({ payload, actionId, action });
        setShowConfirmModal(true);
      } else {
        // Execute directly
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Calling handleContentDrop', { cardId, actionId, payloadType: payload.sourceDataType }, 'DropZone');
        }
        const result = await handleContentDrop(cardId, payload, actionId);
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Drop result', { result }, 'DropZone');
        }
        if (result && onDrop) {
          onDrop(payload, result);
        }
      }
    } else if (showActionMenu) {
      // Multiple actions - show menu
      setActionMenuPayload(payload);
      setShowActionMenuModal(true);
    } else {
      // Multiple actions but menu disabled - execute first
      const firstAction = availableActions[0];
      if (!firstAction) return;
      const [actionId, action] = firstAction;
      if (action.requiresConfirmation) {
        setPendingAction({ payload, actionId, action });
        setShowConfirmModal(true);
      } else {
        const result = await handleContentDrop(cardId, payload, actionId);
        if (result && onDrop) {
          onDrop(payload, result);
        }
      }
    }
  }, [canAccept, draggingPayload, dropZoneConfig, cardId, handleContentDrop, onDrop, showActionMenu]);

  /**
   * Execute action after confirmation
   */
  const executePendingAction = useCallback(async () => {
    if (!pendingAction) return;

    const result = await handleContentDrop(
      cardId,
      pendingAction.payload,
      pendingAction.actionId
    );

    if (result && onDrop) {
      onDrop(pendingAction.payload, result);
    }

    setPendingAction(null);
    setShowConfirmModal(false);
  }, [pendingAction, cardId, handleContentDrop, onDrop]);

  /**
   * Execute action from menu
   */
  const executeActionFromMenu = useCallback(async (actionId: string) => {
    if (!actionMenuPayload) return;

    const action = dropZoneConfig.actions[actionId];
    if (!action) return;

    setShowActionMenuModal(false);

    if (action.requiresConfirmation) {
      setPendingAction({ payload: actionMenuPayload, actionId, action });
      setShowConfirmModal(true);
    } else {
      const result = await handleContentDrop(cardId, actionMenuPayload, actionId);
      if (result && onDrop) {
        onDrop(actionMenuPayload, result);
      }
    }

    setActionMenuPayload(null);
  }, [actionMenuPayload, dropZoneConfig, cardId, handleContentDrop, onDrop]);

  // Update drag over state based on highlight
  useEffect(() => {
    if (isHighlighted && !isDragOver) {
      setIsDragOver(true);
      return undefined;
    } else if (!isHighlighted && isDragOver) {
      // Small delay to prevent flickering
      const timer = setTimeout(() => setIsDragOver(false), 100);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isHighlighted, isDragOver]);

  const dropZoneStyle = dropZoneConfig.dropZoneStyle || {};
  const highlightColor = dropZoneStyle.highlightColor || '#6366f1';
  const borderStyle = dropZoneStyle.borderStyle || 'dashed';
  const borderWidth = dropZoneStyle.borderWidth || 2;

  if (process.env.NODE_ENV === 'development') {
    logger.debug('DropZone render', {
      cardId,
      isDragging,
      hasPayload: !!draggingPayload,
      canAccept: isDragging && draggingPayload && canCardAccept(cardId, draggingPayload)
    }, 'DropZone');
  }

  return (
    <>
      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`drop-zone ${isDragOver && canAccept ? 'drop-zone-active' : ''} ${className}`}
        data-card-id={cardId}
        data-accepts={dropZoneConfig.accepts.dataTypes.join(',')}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: '200px',
          transition: 'all 0.2s ease',
          // Ensure this element can receive drag events
          pointerEvents: 'auto',
          zIndex: 1, // Ensure it's above other elements
          ...(isDragOver && canAccept ? {
            border: `${borderWidth}px ${borderStyle} ${highlightColor}`,
            backgroundColor: dropZoneStyle.backgroundColor || 'rgba(99, 102, 241, 0.05)',
            borderRadius: '8px'
          } : {})
        }}
      >
        {children}
        
        {/* Drop overlay */}
        {isDragOver && canAccept && (
          <div
            className="drop-zone-overlay"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              zIndex: 10
            }}
          >
            <div
              style={{
                padding: '12px 24px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                fontSize: '14px',
                fontWeight: 500,
                color: '#1f2937'
              }}
            >
              Drop here to {Object.values(dropZoneConfig.actions)[0]?.label || 'perform action'}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmModal && pendingAction && (
        <ConfirmationDialog
          isOpen={showConfirmModal}
          onClose={() => {
            setShowConfirmModal(false);
            setPendingAction(null);
          }}
          onConfirm={executePendingAction}
          title="Confirm Action"
          message={pendingAction.action.confirmationMessage || `Are you sure you want to ${pendingAction.action.label.toLowerCase()}?`}
          type={pendingAction.action.requiresConfirmation ? 'warning' : 'info'}
        />
      )}

      {/* Action Menu Modal */}
      {showActionMenuModal && actionMenuPayload && (
        <ActionMenuModal
          isOpen={showActionMenuModal}
          onClose={() => {
            setShowActionMenuModal(false);
            setActionMenuPayload(null);
          }}
          actions={dropZoneConfig.actions}
          onSelectAction={executeActionFromMenu}
          payload={actionMenuPayload}
        />
      )}
    </>
  );
};

/**
 * Action Menu Modal Component
 */
interface ActionMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  actions: DropZoneConfig['actions'];
  onSelectAction: (actionId: string) => void;
  payload: DragPayload;
}

const ActionMenuModal: React.FC<ActionMenuModalProps> = ({
  isOpen,
  onClose,
  actions,
  onSelectAction,
  payload
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Action</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600 mb-4">
          What would you like to do with this {payload.sourceDataType}?
        </p>
        <div className="flex flex-col gap-2">
          {Object.entries(actions).map(([actionId, action]) => (
            <button
              key={actionId}
              onClick={() => onSelectAction(actionId)}
              disabled={action.disabled}
              className={`w-full px-4 py-3 text-left border rounded-lg transition-colors ${
                action.disabled
                  ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-indigo-500'
              }`}
            >
              <div className="flex items-center gap-2">
                {action.icon && <span>{action.icon}</span>}
                <span className="font-medium">{action.label}</span>
              </div>
              {action.description && (
                <div className="text-xs text-gray-500 mt-1">
                  {action.description}
                </div>
              )}
            </button>
          ))}
        </div>
        <DialogFooter>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

