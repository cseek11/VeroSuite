/**
 * useCardDataDragDrop Hook
 * 
 * Extends the existing card drag-and-drop system to support data transfer
 * between cards (not just card position movement).
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { DragPayload, DropZoneConfig, ActionResult } from '../types/cardInteractions.types';
import { getCardInteractionRegistry } from '../utils/CardInteractionRegistry';
import { logger } from '@/utils/logger';

interface UseCardDataDragDropProps {
  enabled?: boolean;
  onDragStart?: (payload: DragPayload) => void;
  onDragEnd?: (payload: DragPayload, result?: ActionResult) => void;
  onActionExecuted?: (actionId: string, result: ActionResult) => void;
}

interface DragState {
  isDragging: boolean;
  payload: DragPayload | null;
  dropTarget: string | null;
  dropZoneHighlight: string | null;
  availableActions: DropZoneConfig[];
}

export function useCardDataDragDrop(props: UseCardDataDragDropProps = {}) {
  const { enabled = true, onDragStart, onDragEnd, onActionExecuted } = props;
  
  const registry = getCardInteractionRegistry();
  const dragPreviewRef = useRef<HTMLDivElement | null>(null);
  const isCreatingPreviewRef = useRef<boolean>(false);
  
  // Subscribe to shared drag state from registry
  const [dragState, setDragState] = useState<DragState>(() => registry.getDragState());
  
  // Create dragStateRef early so it can be used in callbacks
  // Use refs to avoid stale closures in event listeners
  const dragStateRef = useRef(dragState);
  useEffect(() => {
    dragStateRef.current = dragState;
  }, [dragState]);
  
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      logger.debug('useCardDataDragDrop subscribing to drag state', {}, 'useCardDataDragDrop');
    }
    const unsubscribe = registry.subscribeToDragState((state) => {
      if (process.env.NODE_ENV === 'development') {
        logger.debug('useCardDataDragDrop received state update', {
          isDragging: state.isDragging,
          hasPayload: !!state.payload,
          payloadType: state.payload?.sourceDataType
        }, 'useCardDataDragDrop');
      }
      setDragState(state);
    });
    return () => {
      if (process.env.NODE_ENV === 'development') {
        logger.debug('useCardDataDragDrop unsubscribing from drag state', {}, 'useCardDataDragDrop');
      }
      unsubscribe();
    };
  }, [registry]);

  /**
   * Cleanup drag preview - enhanced to handle all scenarios
   * Defined early so it can be used in other functions
   */
  const cleanupDragPreview = useCallback(() => {
    // Don't cleanup if we're currently creating a preview
    if (isCreatingPreviewRef.current) {
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Cleanup skipped - preview is being created', {}, 'useCardDataDragDrop');
      }
      return;
    }
    
    // Store current ref to avoid removing it if it's being created
    const currentRef = dragPreviewRef.current;
    
    // Remove our custom preview
    if (currentRef) {
      try {
        // Disconnect mutation observer if it exists
        if ((currentRef as any)._mutationObserver) {
          (currentRef as any)._mutationObserver.disconnect();
          delete (currentRef as any)._mutationObserver;
        }
        
        // Only remove if it's actually in the DOM
        if (document.body.contains(currentRef)) {
          currentRef.remove();
        }
      } catch (_e) {
        // Element might already be removed
      }
      dragPreviewRef.current = null;
    }
    
    // Also remove any orphaned previews (safety net)
    // But only if they're not the current ref (which we just cleared)
    const orphanedPreviews = document.querySelectorAll('[data-drag-preview="true"]');
    orphanedPreviews.forEach(preview => {
      // Only remove if it's not the current ref
      if (preview !== currentRef && preview !== dragPreviewRef.current) {
        try {
          preview.remove();
        } catch (_e) {
          // Ignore errors
        }
      }
    });
  }, []);

  /**
   * Create visual drag preview
   */
  const createDragPreview = useCallback((payload: DragPayload, initialX?: number, initialY?: number) => {
    if (!payload.dragPreview) return;

    // Set flag to prevent cleanup during creation
    isCreatingPreviewRef.current = true;

    // Cleanup any existing preview first (but don't remove the one we're about to create)
    // Only remove if it's not the current one
    if (dragPreviewRef.current && dragPreviewRef.current.parentNode) {
      try {
        dragPreviewRef.current.remove();
      } catch (_e) {
        // Element might already be removed
      }
      dragPreviewRef.current = null;
    }
    
    // Remove orphaned previews, but be careful not to remove the one we're creating
    const orphanedPreviews = document.querySelectorAll('[data-drag-preview="true"]');
    orphanedPreviews.forEach(preview => {
      // Only remove if it's not the current ref (which we just cleared)
      if (preview !== dragPreviewRef.current) {
        try {
          preview.remove();
        } catch (_e) {
          // Ignore errors
        }
      }
    });

    const preview = document.createElement('div');
    preview.className = 'card-drag-preview';
    preview.setAttribute('data-drag-preview', 'true');
    preview.id = `drag-preview-${Date.now()}`;
    
    // Use provided initial position or fallback to center
    const startX = initialX ?? window.innerWidth / 2;
    const startY = initialY ?? window.innerHeight / 2;
    
    // IMPORTANT: Append to DOM FIRST, then set styles
    // Some browsers require the element to be in the DOM for setProperty to work
    try {
      document.body.appendChild(preview);
      
      // Verify it's actually in the DOM immediately
      if (!document.body.contains(preview)) {
        logger.error('Failed to append preview to DOM', {}, 'useCardDataDragDrop');
        isCreatingPreviewRef.current = false;
        return;
      }
      
      // Double-check after a microtask
      Promise.resolve().then(() => {
        if (!document.body.contains(preview) && preview === dragPreviewRef.current) {
          logger.warn('Preview removed from DOM after append, re-adding', {}, 'useCardDataDragDrop');
          try {
            document.body.appendChild(preview);
          } catch (e: unknown) {
            logger.error('Failed to re-append preview', e, 'useCardDataDragDrop');
          }
        }
      });
    } catch (error: unknown) {
      logger.error('Error appending preview to DOM', error, 'useCardDataDragDrop');
      isCreatingPreviewRef.current = false;
      return;
    }
    
    // Now set all styles - element must be in DOM for setProperty to work properly
    preview.style.setProperty('position', 'fixed', 'important');
    preview.style.setProperty('top', `${startY}px`, 'important');
    preview.style.setProperty('left', `${startX}px`, 'important');
    preview.style.setProperty('padding', '10px 16px', 'important');
    preview.style.setProperty('background', 'white', 'important');
    preview.style.setProperty('border', `2px solid ${payload.dragPreview.color || '#6366f1'}`, 'important');
    preview.style.setProperty('border-radius', '8px', 'important');
    preview.style.setProperty('box-shadow', '0 8px 24px rgba(0,0,0,0.25)', 'important');
    preview.style.setProperty('z-index', '999999', 'important');
    preview.style.setProperty('pointer-events', 'none', 'important');
    preview.style.setProperty('font-size', '14px', 'important');
    preview.style.setProperty('font-weight', '600', 'important');
    preview.style.setProperty('color', '#1f2937', 'important');
    preview.style.setProperty('display', 'flex', 'important');
    preview.style.setProperty('align-items', 'center', 'important');
    preview.style.setProperty('gap', '8px', 'important');
    preview.style.setProperty('opacity', '1', 'important');
    preview.style.setProperty('transform', 'translate(-50%, -50%)', 'important');
    preview.style.setProperty('white-space', 'nowrap', 'important');
    preview.style.setProperty('min-width', '120px', 'important');
    preview.style.setProperty('visibility', 'visible', 'important');
    preview.style.setProperty('margin', '0', 'important');

    if (payload.dragPreview.icon) {
      const icon = document.createElement('span');
      icon.textContent = payload.dragPreview.icon;
      icon.style.fontSize = '16px';
      preview.appendChild(icon);
    }

    const text = document.createElement('span');
    text.textContent = payload.dragPreview.count 
      ? `${payload.dragPreview.count} ${payload.dragPreview.title}`
      : payload.dragPreview.title;
    preview.appendChild(text);

    // Element is already in DOM (appended above), now set the ref
    dragPreviewRef.current = preview;
    
    // Set up a MutationObserver to detect if the element is removed (for debugging only)
    // Don't try to re-add - just log what's happening
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.removedNodes.forEach((node) => {
          if (node === preview) {
            logger.warn('Preview element removed from DOM', {
              mutationType: mutation.type,
              target: mutation.target,
              attributeName: mutation.attributeName
            }, 'useCardDataDragDrop');
            // Don't try to re-add - browser may have removed it for a reason
          }
        });
      });
    });
    
    // Observe the body for removals
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Clean up observer when preview is removed (in cleanup function)
    // Store observer on the preview element for cleanup
    (preview as any)._mutationObserver = observer;
    
    // Force a reflow to ensure styles are applied and element is measured
    void preview.offsetWidth;
    void preview.offsetHeight;
    
    // Verify it's in the DOM
    if (!document.body.contains(preview)) {
      logger.error('Preview not in DOM after append', {}, 'useCardDataDragDrop');
      observer.disconnect();
      isCreatingPreviewRef.current = false;
      return;
    }
    
    // Simple verification - no loops!
    
    // Use single requestAnimationFrame to verify element is rendered
    // Don't fight the browser - if it removes it, that's okay
    requestAnimationFrame(() => {
      // Clear the creation flag - preview setup is complete
      isCreatingPreviewRef.current = false;
      
      // Verify element is still in DOM and is still our ref
      if (!document.body.contains(preview)) {
        logger.warn('Preview not in DOM after setup - may have been removed by browser', {
          previewId: preview.id,
          refId: dragPreviewRef.current?.id,
          isCurrentRef: preview === dragPreviewRef.current
        }, 'useCardDataDragDrop');
        // Don't try to re-add - browser may have removed it for a reason
        return;
      }
      
      if (preview !== dragPreviewRef.current) {
        logger.warn('Preview ref mismatch', {
          previewId: preview.id,
          refId: dragPreviewRef.current?.id
        }, 'useCardDataDragDrop');
        return;
      }
      
      const computed = window.getComputedStyle(preview);
      const rect = preview.getBoundingClientRect();
      const isInViewport = rect.x >= 0 && rect.y >= 0 && 
                          rect.x + rect.width <= window.innerWidth && 
                          rect.y + rect.height <= window.innerHeight;
      
      if (process.env.NODE_ENV === 'development' && payload.dragPreview) {
        logger.debug('Drag preview created', { 
          title: payload.dragPreview.title,
          inDOM: document.body.contains(preview),
          zIndex: computed.zIndex,
          display: computed.display,
          visibility: computed.visibility,
          opacity: computed.opacity,
          position: computed.position,
          left: preview.style.left,
          top: preview.style.top,
          computedLeft: computed.left,
          computedTop: computed.top,
          rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
          startX,
          startY,
          isVisible: rect.width > 0 && rect.height > 0,
          isInViewport,
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight,
          parentElement: preview.parentElement?.tagName,
          parentOverflow: preview.parentElement ? window.getComputedStyle(preview.parentElement).overflow : 'N/A'
        }, 'useCardDataDragDrop');
      }
      
      // If not visible, try to fix it
      if (!isInViewport || rect.width === 0 || rect.height === 0) {
        logger.warn('Preview not visible, attempting to fix', {}, 'useCardDataDragDrop');
        preview.style.setProperty('left', `${startX}px`, 'important');
        preview.style.setProperty('top', `${startY}px`, 'important');
        preview.style.setProperty('display', 'flex', 'important');
        preview.style.setProperty('opacity', '1', 'important');
        preview.style.setProperty('visibility', 'visible', 'important');
        preview.style.setProperty('z-index', '999999', 'important');
        
        // Force another reflow after fix
        void preview.offsetWidth;
      }
    });

    // Update preview position on mouse move
    // This is the primary visual feedback since native drag image may not work
    const updatePreview = (e: MouseEvent | DragEvent) => {
      if (preview && preview.parentNode) {
        const evt = e as MouseEvent;
        const clientX = evt.clientX;
        const clientY = evt.clientY;
        
        // Update position using setProperty for consistency and !important
        preview.style.setProperty('left', `${clientX}px`, 'important');
        preview.style.setProperty('top', `${clientY}px`, 'important');
        preview.style.setProperty('display', 'flex', 'important');
        preview.style.setProperty('opacity', '1', 'important');
        preview.style.setProperty('visibility', 'visible', 'important');
        preview.style.setProperty('z-index', '999999', 'important');
        
        // Force a repaint to ensure the browser renders the update
        void preview.offsetWidth;
      }
    };

    // Cleanup preview listeners (but NOT drag state)
    const cleanupPreviewListeners = (e?: Event) => {
      if (process.env.NODE_ENV === 'development') {
        logger.debug('cleanupPreviewListeners called', {
          eventType: e?.type,
          isDragEnd: e?.type === 'dragend',
          dropEffect: (e as DragEvent)?.dataTransfer?.dropEffect
        }, 'useCardDataDragDrop');
      }
      document.removeEventListener('mousemove', updatePreview);
      document.removeEventListener('dragover', updatePreview);
      // Only clean up the preview visual element, NOT the drag state
      cleanupDragPreview();
      // NOTE: Drag state is managed separately by handleContentDragEnd
      // which is called from the global dragend handler
    };

    // Start listening for mouse/drag events immediately
    document.addEventListener('mousemove', updatePreview);
    document.addEventListener('dragover', updatePreview);
    
    // DON'T listen to mouseup - it fires too early during drag
    // Only listen to dragend, which fires when drag actually ends
    document.addEventListener('dragend', cleanupPreviewListeners, { once: true });
    
    // Cleanup on escape key
    const cleanupOnEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cleanupDragPreview();
        document.removeEventListener('keydown', cleanupOnEscape);
      }
    };
    document.addEventListener('keydown', cleanupOnEscape);
    
    // Cleanup on window blur (user switches tabs/windows)
    const cleanupOnBlur = () => {
      cleanupDragPreview();
      window.removeEventListener('blur', cleanupOnBlur);
    };
    window.addEventListener('blur', cleanupOnBlur, { once: true });
  }, [cleanupDragPreview]);

  /**
   * Start dragging data from a card
   */
  const handleContentDragStart = useCallback((_cardId: string, payload: DragPayload, e: React.MouseEvent | React.DragEvent) => {
    if (!enabled || !registry.isEnabled()) {
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Drag disabled or registry not enabled', { enabled, registryEnabled: registry.isEnabled() }, 'useCardDataDragDrop');
      }
      // If disabled, prevent the drag
      if ('preventDefault' in e) {
        e.preventDefault();
      }
      return;
    }

    // CRITICAL: DO NOT call preventDefault() or stopPropagation() here!
    // This would cancel the drag operation and prevent dragover events from firing.
    // The drag must be allowed to proceed naturally for HTML5 drag-and-drop to work.

    // Get initial mouse position for preview
    const startX = 'clientX' in e ? e.clientX : window.innerWidth / 2;
    const startY = 'clientY' in e ? e.clientY : window.innerHeight / 2;

    // Set drag data for HTML5 drag-and-drop
    // Note: dataTransfer should already be set by DraggableContent, but we ensure it here too
    if ('dataTransfer' in e && e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      // Only set if not already set (DraggableContent should have set it)
      if (!e.dataTransfer.getData('application/json')) {
        e.dataTransfer.setData('application/json', JSON.stringify(payload));
        e.dataTransfer.setData('text/plain', payload.dragPreview?.title || payload.data.id);
      }
    }

    if (process.env.NODE_ENV === 'development') {
      logger.debug('Setting drag state', {
        sourceCardId: payload.sourceCardId,
        dataType: payload.sourceDataType,
        hasPreview: !!payload.dragPreview,
        mouseX: startX,
        mouseY: startY
      }, 'useCardDataDragDrop');
    }

    // Update shared state in registry
    registry.setDragState({
      isDragging: true,
      payload,
      dropTarget: null,
      dropZoneHighlight: null,
      availableActions: []
    });

    // Create drag preview with initial mouse position
    createDragPreview(payload, startX, startY);

    // Callback
    onDragStart?.(payload);

    logger.debug('Card data drag started', {
      sourceCardId: payload.sourceCardId,
      dataType: payload.sourceDataType,
      dataId: payload.data.id
    });
  }, [enabled, registry, onDragStart, createDragPreview]);

  /**
   * Handle drag move - detect drop zones
   */
  const handleContentDragMove = useCallback((e: MouseEvent | DragEvent) => {
    const currentState = dragStateRef.current;
    if (!currentState.isDragging || !currentState.payload) {
      return;
    }

    const evt = e as MouseEvent;
    const clientX = evt.clientX;
    const clientY = evt.clientY;

    // Find card element under cursor
    const elementUnderCursor = document.elementFromPoint(clientX, clientY);
    const cardElement = elementUnderCursor?.closest('[data-card-id]');
    
    if (cardElement) {
      const targetCardId = cardElement.getAttribute('data-card-id');
      if (targetCardId && targetCardId !== currentState.payload.sourceCardId) {
        // Check if this card can accept the payload
        const canAccept = registry.canCardAccept(targetCardId, currentState.payload);
        
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Checking drop zone', {
            targetCardId,
            canAccept,
            sourceCardId: currentState.payload.sourceCardId,
            dataType: currentState.payload.sourceDataType
          }, 'useCardDataDragDrop');
        }
        
        if (canAccept) {
          const dropZones = registry.getDropZonesForCard(targetCardId);
          // keep availableActions for future use; currently we highlight by targetCardId
          
          registry.setDragState({
            dropTarget: targetCardId,
            dropZoneHighlight: targetCardId,
            availableActions: dropZones
          });
          if (process.env.NODE_ENV === 'development') {
            logger.debug('Drop zone highlighted', { targetCardId }, 'useCardDataDragDrop');
          }
        } else {
          registry.setDragState({
            dropTarget: null,
            dropZoneHighlight: null,
            availableActions: []
          });
        }
      }
    } else {
      registry.setDragState({
        dropTarget: null,
        dropZoneHighlight: null,
        availableActions: []
      });
    }
  }, [registry]);

  /**
   * Handle drop - execute action
   */
  const handleContentDrop = useCallback(async (
    targetCardId: string,
    payload: DragPayload,
    actionId?: string
  ): Promise<ActionResult | null> => {
    if (!enabled || !registry.isEnabled()) {
      return null;
    }

    // Validate drop
    if (!registry.canCardAccept(targetCardId, payload)) {
      logger.warn('Drop rejected - card cannot accept payload', {
        targetCardId,
        dataType: payload.sourceDataType
      });
      return {
        success: false,
        error: 'This card cannot accept this type of data'
      };
    }

    const dropZones = registry.getDropZonesForCard(targetCardId);
    const availableActions = registry.getAvailableActions(targetCardId, payload);

    // Determine which action to execute
    let actionToExecute: DropZoneConfig['actions'][string] | undefined;

    if (actionId) {
      // Specific action requested
      for (const zone of dropZones) {
        if (zone.actions[actionId]) {
          actionToExecute = zone.actions[actionId];
          break;
        }
      }
    } else if (availableActions.length === 1) {
      // Single action - execute directly
      const action = availableActions[0];
      if (!action) {
        return {
          success: false,
          error: 'No action available for this drop'
        };
      }
      for (const zone of dropZones) {
        if (zone.actions[action.actionId]) {
          actionToExecute = zone.actions[action.actionId];
          break;
        }
      }
    } else if (availableActions.length > 1) {
      // Multiple actions - return them for user selection
      // This will be handled by the UI component
      return {
        success: false,
        error: 'Multiple actions available - user must select',
        data: { availableActions }
      };
    }

    if (!actionToExecute) {
      return {
        success: false,
        error: 'No action available for this drop'
      };
    }

    // Check if confirmation required
    if (actionToExecute.requiresConfirmation) {
      // This will be handled by the UI component
      return {
        success: false,
        error: 'Confirmation required',
        data: {
          action: actionToExecute,
          requiresConfirmation: true,
          confirmationMessage: actionToExecute.confirmationMessage
        }
      };
    }

    // Execute action
    try {
      logger.debug('Executing card interaction action', {
        targetCardId,
        actionId: actionToExecute.id || 'unknown',
        dataType: payload.sourceDataType
      });

      const result = await actionToExecute.handler(payload);

      // Callback
      onActionExecuted?.(actionToExecute.id || 'unknown', result);

      // Reset drag state
      registry.setDragState({
        isDragging: false,
        payload: null,
        dropTarget: null,
        dropZoneHighlight: null,
        availableActions: []
      });

      // Cleanup drag preview
      cleanupDragPreview();

      // Callback
      onDragEnd?.(payload, result);

      return result;
    } catch (error) {
      logger.error('Error executing card interaction action', error);
      
      const errorResult: ActionResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      // Reset drag state
      registry.setDragState({
        isDragging: false,
        payload: null,
        dropTarget: null,
        dropZoneHighlight: null,
        availableActions: []
      });

      cleanupDragPreview();
      onDragEnd?.(payload, errorResult);

      return errorResult;
    }
  }, [enabled, onDragEnd, onActionExecuted, cleanupDragPreview]);

  /**
   * Handle drag end (cancel)
   */
  const handleContentDragEnd = useCallback(() => {
    const currentState = dragStateRef.current;
    if (process.env.NODE_ENV === 'development') {
      logger.debug('handleContentDragEnd called', {
        isDragging: currentState.isDragging,
        hasPayload: !!currentState.payload,
        stackTrace: new Error().stack
      }, 'useCardDataDragDrop');
    }
    
    if (currentState.isDragging) {
      cleanupDragPreview();
      
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Resetting drag state in handleContentDragEnd', {}, 'useCardDataDragDrop');
      }
      registry.setDragState({
        isDragging: false,
        payload: null,
        dropTarget: null,
        dropZoneHighlight: null,
        availableActions: []
      });

      onDragEnd?.(currentState.payload!, undefined);
    }
  }, [registry, onDragEnd, cleanupDragPreview]);

  // Track if cleanup is already scheduled to prevent multiple calls
  const cleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Store callbacks in refs to prevent effect from re-running
  const handleContentDragMoveRef = useRef(handleContentDragMove);
  const handleContentDropRef = useRef(handleContentDrop);
  const handleContentDragEndRef = useRef(handleContentDragEnd);
  const cleanupDragPreviewRef = useRef(cleanupDragPreview);
  
  useEffect(() => {
    handleContentDragMoveRef.current = handleContentDragMove;
    handleContentDropRef.current = handleContentDrop;
    handleContentDragEndRef.current = handleContentDragEnd;
    cleanupDragPreviewRef.current = cleanupDragPreview;
  }, [handleContentDragMove, handleContentDrop, handleContentDragEnd, cleanupDragPreview]);

  // Global event listeners for HTML5 drag-and-drop
  useEffect(() => {
    if (!enabled) {
      if (process.env.NODE_ENV === 'development') {
        logger.debug('useCardDataDragDrop disabled, not attaching listeners', {}, 'useCardDataDragDrop');
      }
      return;
    }

    if (process.env.NODE_ENV === 'development') {
      logger.debug('Attaching global drag-and-drop listeners', {}, 'useCardDataDragDrop');
    }

    // TEST: Add raw native listeners to window to see if events are firing at all
    const testNativeDragOver = (e: DragEvent) => {
      if (process.env.NODE_ENV === 'development') {
        logger.debug('TEST NATIVE dragover on window', {
          type: e.type,
          timestamp: Date.now(),
          target: (e.target as HTMLElement)?.tagName,
          hasDataTransfer: !!e.dataTransfer,
          dataTransferTypes: Array.from(e.dataTransfer?.types || [])
        }, 'useCardDataDragDrop');
      }
    };
    const testNativeDragStart = (e: DragEvent) => {
      if (process.env.NODE_ENV === 'development') {
        logger.debug('TEST NATIVE dragstart on window', {
          type: e.type,
          timestamp: Date.now(),
          target: (e.target as HTMLElement)?.tagName,
          hasDataTransfer: !!e.dataTransfer,
          dataTransferTypes: Array.from(e.dataTransfer?.types || [])
        }, 'useCardDataDragDrop');
      }
    };
    const testNativeDragEnd = (e: DragEvent) => {
      if (process.env.NODE_ENV === 'development') {
        logger.debug('TEST NATIVE dragend on window', {
          type: e.type,
          timestamp: Date.now(),
          target: (e.target as HTMLElement)?.tagName,
          dropEffect: e.dataTransfer?.dropEffect
        }, 'useCardDataDragDrop');
      }
    };
    window.addEventListener('dragover', testNativeDragOver, true);
    window.addEventListener('dragover', testNativeDragOver, false);
    window.addEventListener('dragstart', testNativeDragStart, true);
    window.addEventListener('dragstart', testNativeDragStart, false);
    window.addEventListener('dragend', testNativeDragEnd, true);
    window.addEventListener('dragend', testNativeDragEnd, false);

    const handleDragOver = (e: DragEvent) => {
      // CRITICAL: ALWAYS prevent default FIRST to allow drop - this is critical for drop events to fire
      // Must be called even if we're not tracking a drag, to allow any drag operations
      e.preventDefault();
      
      // CRITICAL: Log FIRST to see if events are even reaching us
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Global dragover EVENT RECEIVED', {
          timestamp: Date.now(),
          type: e.type,
          target: (e.target as HTMLElement)?.tagName,
          currentTarget: (e.currentTarget as HTMLElement)?.tagName,
          dataTransferTypes: Array.from(e.dataTransfer?.types || []),
          dataTransferEffectAllowed: e.dataTransfer?.effectAllowed,
          dataTransferDropEffect: e.dataTransfer?.dropEffect,
          hasDataTransfer: !!e.dataTransfer
        }, 'useCardDataDragDrop');
      }
      
      // Check drag state from both ref and registry (fallback)
      const currentState = dragStateRef.current;
      const registryState = registry.getDragState();
      const isDragging = currentState.isDragging || registryState.isDragging;
      const payload = currentState.payload || registryState.payload;
      
      const target = e.target as HTMLElement;
      const isDropZone = target?.closest('.drop-zone') || target?.closest('[data-card-id]');
      
      // Log ALL dragover events to debug
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Global dragover details', {
          isDragging,
          hasPayload: !!payload,
          payloadType: payload?.sourceDataType,
          target: target?.tagName,
          targetClass: target?.className,
          isDropZone: !!isDropZone,
          dropZoneCardId: isDropZone?.getAttribute('data-card-id'),
          clientX: e.clientX,
          clientY: e.clientY,
          dataTransferTypes: Array.from(e.dataTransfer?.types || []),
          refState: { isDragging: currentState.isDragging, hasPayload: !!currentState.payload },
          registryState: { isDragging: registryState.isDragging, hasPayload: !!registryState.payload }
        }, 'useCardDataDragDrop');
      }
      
      // Set drop effect based on whether we have a valid drag
      if (e.dataTransfer) {
        if (isDragging && payload) {
          e.dataTransfer.dropEffect = 'move';
        } else {
          // Still allow drop even if we're not tracking it (might be external drag)
          e.dataTransfer.dropEffect = 'move';
        }
      }
      
      if (isDragging && payload) {
        // DON'T call stopPropagation() - let React and native events fire on DropZone
        // Update drag preview position
        if (dragPreviewRef.current) {
          dragPreviewRef.current.style.left = `${e.clientX}px`;
          dragPreviewRef.current.style.top = `${e.clientY}px`;
        }
        handleContentDragMoveRef.current(e);
      }
    };

    const handleDrop = (e: DragEvent) => {
      const currentState = dragStateRef.current;
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Global drop event', {
          isDragging: currentState.isDragging,
          hasPayload: !!currentState.payload,
          target: (e.target as HTMLElement)?.tagName,
          targetClass: (e.target as HTMLElement)?.className,
          dropEffect: e.dataTransfer?.dropEffect,
          types: Array.from(e.dataTransfer?.types || [])
        }, 'useCardDataDragDrop');
      }
      
      if (currentState.isDragging && currentState.payload) {
        const target = e.target as HTMLElement;
        const dropZone = target.closest('[data-card-id]');
        const dropZoneElement = target.closest('.drop-zone');
        
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Global drop - checking drop zone', {
            hasDropZoneElement: !!dropZoneElement,
            hasCardId: !!dropZone,
            cardId: dropZone?.getAttribute('data-card-id'),
            sourceCardId: currentState.payload.sourceCardId
          }, 'useCardDataDragDrop');
        }
        
        // If there's a React DropZone element, let React handle it
        // CRITICAL: Only prevent default to allow drop, but DON'T stop propagation
        // This allows React's synthetic event system to receive and handle the event
        if (dropZoneElement) {
          if (process.env.NODE_ENV === 'development') {
            logger.debug('Drop on React DropZone - allowing React to handle, preventing default only', {}, 'useCardDataDragDrop');
          }
          // Prevent default to allow drop, but let event bubble to React
          e.preventDefault();
          // DO NOT stop propagation - React needs the event to bubble to handle it
          return;
        }
        
        // No React drop zone found - handle it globally
        e.preventDefault();
        e.stopPropagation();
        
        const targetCardId = dropZone?.getAttribute('data-card-id');
        if (targetCardId && targetCardId !== currentState.payload.sourceCardId) {
          if (process.env.NODE_ENV === 'development') {
            logger.debug('Global handler processing drop on card', { targetCardId }, 'useCardDataDragDrop');
          }
          handleContentDropRef.current(targetCardId, currentState.payload);
        } else {
          if (process.env.NODE_ENV === 'development') {
            logger.debug('Dropped outside valid drop zone - cleaning up', {}, 'useCardDataDragDrop');
          }
          // Dropped outside a valid drop zone - cleanup
          handleContentDragEndRef.current();
        }
      } else {
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Global drop - no active drag, ignoring', {}, 'useCardDataDragDrop');
        }
      }
    };

    // Handle drag end (when user releases mouse or cancels drag)
    const handleDragEnd = (e: DragEvent) => {
      const currentState = dragStateRef.current;
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Global dragend event', {
          isDragging: currentState.isDragging,
          hasPayload: !!currentState.payload,
          dropEffect: e.dataTransfer?.dropEffect,
          relatedTarget: e.relatedTarget,
          dataTransferTypes: Array.from(e.dataTransfer?.types || [])
        }, 'useCardDataDragDrop');
      }
      
      // Cancel any pending cleanup timeout
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
        cleanupTimeoutRef.current = null;
      }
      
      // ALWAYS cleanup the preview on dragend
      cleanupDragPreviewRef.current();
      
      // Check if drop was successful
      if (currentState.isDragging) {
        const dropEffect = e.dataTransfer?.dropEffect;
        
        if (dropEffect === 'move') {
          if (process.env.NODE_ENV === 'development') {
            logger.debug('Drag completed successfully - drop was handled', {}, 'useCardDataDragDrop');
          }
          // Drop was successful - state will be reset by handleDrop
          // But if handleDrop didn't fire, reset here as fallback
          setTimeout(() => {
            const stillDragging = dragStateRef.current.isDragging;
            if (stillDragging) {
              logger.warn('Drop was successful but state not reset - cleaning up', {}, 'useCardDataDragDrop');
              handleContentDragEndRef.current();
            }
          }, 100);
        } else if (dropEffect === 'none') {
          if (process.env.NODE_ENV === 'development') {
            logger.debug('Drag cancelled - resetting state', {}, 'useCardDataDragDrop');
          }
          handleContentDragEndRef.current();
        } else {
          if (process.env.NODE_ENV === 'development') {
            logger.debug('Drag end - unknown dropEffect, resetting state', { dropEffect }, 'useCardDataDragDrop');
          }
          handleContentDragEndRef.current();
        }
      }
    };

    // Handle drag leave (when dragged outside window)
    const handleDragLeave = (e: DragEvent) => {
      const currentState = dragStateRef.current;
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Global dragleave event', {
          isDragging: currentState.isDragging,
          relatedTarget: e.relatedTarget,
          target: e.target
        }, 'useCardDataDragDrop');
      }
      // Only cleanup if leaving the window (not just moving between elements)
      if (currentState.isDragging && (!e.relatedTarget || e.relatedTarget === null)) {
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Leaving window - cleaning up', {}, 'useCardDataDragDrop');
        }
        cleanupDragPreviewRef.current();
        handleContentDragEndRef.current();
      }
    };

    // Handle escape key to cancel drag
    const handleEscape = (e: KeyboardEvent) => {
      const currentState = dragStateRef.current;
      if (currentState.isDragging && e.key === 'Escape') {
        cleanupDragPreviewRef.current();
        handleContentDragEndRef.current();
      }
    };
    
    // Handle mouse up anywhere (safety net)
    // NOTE: This is a fallback in case dragend doesn't fire
    // We use a timeout to give dragend a chance to fire first
    const handleMouseUp = () => {
      const currentState = dragStateRef.current;
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Global mouseup event (safety net)', {
          isDragging: currentState.isDragging,
          hasPayload: !!currentState.payload
        }, 'useCardDataDragDrop');
      }
      
      // If dragging, wait a bit for dragend to fire, then cleanup if it didn't
      if (currentState.isDragging && !cleanupTimeoutRef.current) {
        logger.warn('mouseup fired during drag - waiting for dragend', {}, 'useCardDataDragDrop');
        cleanupTimeoutRef.current = setTimeout(() => {
          const stillDragging = dragStateRef.current.isDragging;
          if (stillDragging) {
            logger.warn('dragend never fired - cleaning up via mouseup fallback', {}, 'useCardDataDragDrop');
            cleanupDragPreviewRef.current();
            handleContentDragEndRef.current();
          }
          cleanupTimeoutRef.current = null;
        }, 200); // Give dragend 200ms to fire
      }
    };

    if (process.env.NODE_ENV === 'development') {
      logger.debug('Adding event listeners to document', {}, 'useCardDataDragDrop');
    }
    
    // Add listeners with capture phase to catch events early
    document.addEventListener('dragover', handleDragOver, true); // CAPTURE PHASE
    document.addEventListener('drop', handleDrop, true); // CAPTURE PHASE
    document.addEventListener('dragend', handleDragEnd, true); // CAPTURE PHASE
    document.addEventListener('dragleave', handleDragLeave, true); // CAPTURE PHASE
    
    // Also add in bubble phase as backup
    document.addEventListener('dragover', handleDragOver, false);
    document.addEventListener('drop', handleDrop, false);
    document.addEventListener('dragend', handleDragEnd, false);
    document.addEventListener('dragleave', handleDragLeave, false);
    
    document.addEventListener('keydown', handleEscape, false);
    document.addEventListener('mouseup', handleMouseUp, false);
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Event listeners attached (both capture and bubble phases)', {}, 'useCardDataDragDrop');
    }

    return () => {
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Removing global drag-and-drop listeners', {}, 'useCardDataDragDrop');
      }
      // Remove test native listeners
      window.removeEventListener('dragover', testNativeDragOver, true);
      window.removeEventListener('dragover', testNativeDragOver, false);
      window.removeEventListener('dragstart', testNativeDragStart, true);
      window.removeEventListener('dragstart', testNativeDragStart, false);
      window.removeEventListener('dragend', testNativeDragEnd, true);
      window.removeEventListener('dragend', testNativeDragEnd, false);
      // Remove capture phase listeners
      document.removeEventListener('dragover', handleDragOver, true);
      document.removeEventListener('drop', handleDrop, true);
      document.removeEventListener('dragend', handleDragEnd, true);
      document.removeEventListener('dragleave', handleDragLeave, true);
      // Remove bubble phase listeners
      document.removeEventListener('dragover', handleDragOver, false);
      document.removeEventListener('drop', handleDrop, false);
      document.removeEventListener('dragend', handleDragEnd, false);
      document.removeEventListener('dragleave', handleDragLeave, false);
      document.removeEventListener('keydown', handleEscape, false);
      document.removeEventListener('mouseup', handleMouseUp, false);
      
      // Cleanup on unmount
      cleanupDragPreviewRef.current();
    };
  }, [enabled]); // Only depend on enabled - callbacks are in refs

  return {
    // State
    isDragging: dragState.isDragging,
    draggingPayload: dragState.payload,
    dropTarget: dragState.dropTarget,
    dropZoneHighlight: dragState.dropZoneHighlight,
    availableActions: dragState.availableActions,
    
    // Actions
    handleContentDragStart,
    handleContentDragMove,
    handleContentDrop,
    handleContentDragEnd,
    
    // Utilities
    canCardAccept: (cardId: string, payload: DragPayload) => 
      registry.canCardAccept(cardId, payload),
    getAvailableActions: (cardId: string, payload: DragPayload) =>
      registry.getAvailableActions(cardId, payload)
  };
}

