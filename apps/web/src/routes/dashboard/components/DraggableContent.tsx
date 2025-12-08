/**
 * DraggableContent Component
 * 
 * Wraps content to make it draggable for card-to-card interactions.
 * This component handles the drag start and creates the drag payload.
 */

import React, { useCallback } from 'react';
import { DragPayload, DataType } from '../types/cardInteractions.types';
import { useCardDataDragDrop } from '../hooks/useCardDataDragDrop';
import { useAuthStore } from '@/stores/auth';
import { logger } from '@/utils/logger';

type DraggableData = { id?: string; _id?: string; name?: string; title?: string } & Record<string, any>;

interface DraggableContentProps {
  cardId: string;
  dataType: DataType;
  data: DraggableData;
  selectedItems?: Array<DraggableData>; // For multi-select
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onDragStart?: (payload: DragPayload) => void;
  getDragPreview?: (data: DraggableData, selectedItems?: Array<DraggableData>) => {
    title: string;
    icon?: string;
    color?: string;
    count?: number;
  };
}

export const DraggableContent: React.FC<DraggableContentProps> = ({
  cardId,
  dataType,
  data,
  selectedItems,
  children,
  className = '',
  disabled = false,
  onDragStart,
  getDragPreview
}) => {
  const { user } = useAuthStore();
  const { handleContentDragStart } = useCardDataDragDrop({
    ...(onDragStart && { onDragStart })
  });

  const handleDragStart = useCallback((e: React.DragEvent) => {
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // CRITICAL: DO NOT call preventDefault() or stopPropagation() here!
    // This would cancel the drag operation and prevent dragover/drop events from firing.
    // The drag must be allowed to proceed naturally for HTML5 drag-and-drop to work.

    // Store initial mouse position for preview positioning
    const startX = e.clientX || 0;
    const startY = e.clientY || 0;

    if (process.env.NODE_ENV === 'development') {
      logger.debug('Drag started', { 
        cardId, 
        dataType, 
        dataName: data.name || data.title || data.id,
        mouseX: startX,
        mouseY: startY,
        hasDataTransfer: !!e.dataTransfer,
        dataTransferTypes: e.dataTransfer ? Array.from(e.dataTransfer.types) : []
      }, 'DraggableContent');
    }

    // Create drag payload
    const dragPreview = getDragPreview
      ? getDragPreview(data, selectedItems)
      : {
          title: data.name || data.title || data.id || 'Item',
          icon: getIconForDataType(dataType),
          color: getColorForDataType(dataType),
          ...(selectedItems && selectedItems.length > 0 && { count: selectedItems.length })
        };

    const payload: DragPayload = {
      sourceCardId: cardId,
      sourceCardType: cardId,
      sourceDataType: dataType,
      data: {
        id: data.id || data._id || String(data),
        type: dataType,
        entity: data,
        ...(selectedItems && selectedItems.length > 0 && {
          metadata: { selectedItems }
        })
      },
      dragPreview,
      timestamp: Date.now(),
      userId: user?.id || 'anonymous'
    };

    if (process.env.NODE_ENV === 'development') {
      logger.debug('Drag payload created', {
        sourceCardId: payload.sourceCardId,
        dataType: payload.sourceDataType,
        customerName: payload.dragPreview?.title,
        customerId: payload.data.id
      }, 'DraggableContent');
    }

    // Set drag data for HTML5 drag-and-drop BEFORE calling handleContentDragStart
    // This ensures the browser has the data available
    // CRITICAL: dataTransfer must be set up correctly or the drag operation may fail
    if (e.dataTransfer) {
      try {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('application/json', JSON.stringify(payload));
        e.dataTransfer.setData('text/plain', dragPreview.title || payload.data.id);
        // Also set a custom type for easier identification
        e.dataTransfer.setData('text/x-verofield-drag', JSON.stringify({
          cardId,
          dataType,
          dataId: payload.data.id
        }));
        
        if (process.env.NODE_ENV === 'development') {
          logger.debug('DataTransfer configured', {
            effectAllowed: e.dataTransfer.effectAllowed,
            types: Array.from(e.dataTransfer.types),
            hasJson: !!e.dataTransfer.getData('application/json'),
            hasText: !!e.dataTransfer.getData('text/plain'),
            hasCustom: !!e.dataTransfer.getData('text/x-verofield-drag')
          }, 'DraggableContent');
        }
      } catch (error: unknown) {
        logger.error('Error setting dataTransfer', error, 'DraggableContent');
        // Don't prevent drag - continue without data (fallback)
      }
    } else {
      logger.error('No dataTransfer available in dragstart', {}, 'DraggableContent');
      // This is a critical error - drag may not work properly
    }
    
    // Create a custom drag image for better visual feedback
    // This is the native browser drag image that follows the cursor
    // CRITICAL: The drag image must be visible and in the DOM when setDragImage is called
    const dragImage = document.createElement('div');
    dragImage.style.cssText = `
      position: fixed;
      top: 0px;
      left: 0px;
      padding: 10px 16px;
      background: white;
      border: 2px solid ${dragPreview.color || '#6366f1'};
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.25);
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
      display: flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
      z-index: 999999;
      pointer-events: none;
      visibility: visible;
      opacity: 1;
      margin: 0;
    `;
    if (dragPreview.icon) {
      dragImage.innerHTML = `<span style="font-size: 16px;">${dragPreview.icon}</span> <span>${dragPreview.title}</span>`;
    } else {
      dragImage.textContent = dragPreview.title;
    }
    
    // Append to body FIRST - element must be in DOM for measurement
    document.body.appendChild(dragImage);
    
    // Force a reflow to ensure the element is measured and rendered
    void dragImage.offsetWidth;
    void dragImage.offsetHeight;
    
    // Get dimensions while element is visible
    const offsetX = dragImage.offsetWidth / 2;
    const offsetY = dragImage.offsetHeight / 2;
    
    // Set the drag image BEFORE moving it off-screen
    // Some browsers require the element to be visible when setDragImage is called
    try {
      e.dataTransfer.setDragImage(dragImage, offsetX, offsetY);
    } catch (error: unknown) {
      logger.warn('Failed to set drag image', { error }, 'DraggableContent');
      // Continue without custom drag image - browser will use default
    }
    
    // Move off-screen after setting (but keep in DOM - browser needs it during drag)
    dragImage.style.top = '-10000px';
    dragImage.style.left = '-10000px';
    
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Drag image set', {
        width: dragImage.offsetWidth,
        height: dragImage.offsetHeight,
        offsetX,
        offsetY,
        title: dragPreview.title,
        inDOM: document.body.contains(dragImage)
      }, 'DraggableContent');
    }
    
    // Clean up the drag image after drag ends (not immediately!)
    // The browser needs it during the entire drag operation
    const cleanupDragImage = () => {
      if (dragImage.parentNode) {
        dragImage.remove();
      }
    };
    
    // Clean up on drag end
    e.currentTarget.addEventListener('dragend', cleanupDragImage, { once: true });
    
    if (process.env.NODE_ENV === 'development') {
      logger.debug('DataTransfer set', {
        json: e.dataTransfer.getData('application/json') ? '✅' : '❌',
        text: e.dataTransfer.getData('text/plain'),
        custom: e.dataTransfer.getData('text/x-verofield-drag') ? '✅' : '❌'
      }, 'DraggableContent');
    }

    // Pass the drag event with mouse position
    handleContentDragStart(cardId, payload, e);
  }, [cardId, dataType, data, selectedItems, disabled, getDragPreview, user, handleContentDragStart]);

  // Handle drag end to ensure cleanup
  const handleDragEnd = useCallback((e: React.DragEvent) => {
    if (process.env.NODE_ENV === 'development') {
      logger.debug('DraggableContent dragend event', {
        cardId,
        dataType,
        dropEffect: e.dataTransfer?.dropEffect,
        effectAllowed: e.dataTransfer?.effectAllowed,
        defaultPrevented: e.defaultPrevented
      }, 'DraggableContent');
    }
    // Don't prevent default - let the global handler manage it
    // The hook will handle cleanup
    // But ensure the event can propagate
    e.stopPropagation(); // Stop React event propagation, but let native event continue
  }, [cardId, dataType]);

  return (
    <div
      draggable={!disabled}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={(e) => {
        // Prevent card selection when clicking on draggable content
        e.stopPropagation();
      }}
      className={`draggable-content ${disabled ? 'draggable-content-disabled' : 'draggable-content-enabled'} ${className}`}
      data-draggable-type={dataType}
      data-draggable-id={data.id || data._id}
      style={{
        cursor: disabled ? 'default' : 'grab',
        userSelect: 'none',
        position: 'relative',
        zIndex: 10
      }}
    >
      {children}
    </div>
  );
};

/**
 * Helper function to get icon for data type
 */
function getIconForDataType(dataType: DataType): string {
  const iconMap: Record<DataType, string> = {
    customer: '👤',
    job: '📦',
    technician: '👷',
    workorder: '📋',
    invoice: '💰',
    report: '📊',
    filter: '🔍',
    route: '🗺️',
    appointment: '📅',
    note: '📝',
    tag: '🏷️',
    custom: '📌'
  };
  return iconMap[dataType] || '📌';
}

/**
 * Helper function to get color for data type
 */
function getColorForDataType(dataType: DataType): string {
  const colorMap: Record<DataType, string> = {
    customer: '#3b82f6', // blue
    job: '#8b5cf6', // purple
    technician: '#10b981', // green
    workorder: '#f59e0b', // amber
    invoice: '#ef4444', // red
    report: '#6366f1', // indigo
    filter: '#6b7280', // gray
    route: '#14b8a6', // teal
    appointment: '#ec4899', // pink
    note: '#84cc16', // lime
    tag: '#f97316', // orange
    custom: '#64748b' // slate
  };
  return colorMap[dataType] || '#64748b';
}

