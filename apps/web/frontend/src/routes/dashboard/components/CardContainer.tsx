/**
 * CardContainer Component
 * 
 * Encapsulates individual card rendering with controls, resize handles, and event handlers.
 * Extracted from VeroCardsV3.tsx to improve maintainability and reduce file size.
 * 
 * Target: <300 lines
 */

import React from 'react';
import { Lock, Unlock, X, Minus, Maximize2, GripVertical, Columns } from 'lucide-react';
import { CardFocusManager } from '@/components/dashboard/CardFocusManager';
import ResizeHandle from '@/components/dashboard/ResizeHandle';
import { renderCardComponent } from '../utils/renderHelpers';

export interface CardContainerProps {
  card: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    type: string;
  };
  isSelected: boolean;
  isDragging: boolean;
  isDraggingMultiple: boolean;
  isLocked: boolean;
  isResizing: boolean;
  isFocused: boolean;
  isNavigating: boolean;
  navigationMode: 'resize' | 'select' | 'move';
  searchTerm: string;
  isInFilteredResults: boolean;
  cardGroup: any;
  cardTypes: any[];
  kpiData: Record<string, any>;
  onDragStart: (cardId: string, e: React.MouseEvent) => void;
  onClick: (cardId: string, e: React.MouseEvent) => void;
  onFocus: (cardId: string) => void;
  onToggleLock: (cardId: string) => void;
  onRemove: (cardId: string) => void;
  onResizeStart: (cardId: string, handle: string, e: React.MouseEvent) => void;
  onMinimize: (cardId: string, cardType: string) => void;
  onExpand: (cardId: string, cardType: string) => void;
  onRestore: (cardId: string, cardType: string, originalSize: { width: number; height: number }, originalPosition: { x: number; y: number }) => void;
  setShowTemplateLibrary: (show: boolean) => void;
}

export const CardContainer: React.FC<CardContainerProps> = React.memo(({
  card,
  isSelected,
  isDragging,
  isDraggingMultiple,
  isLocked,
  isResizing,
  isFocused,
  isNavigating,
  navigationMode,
  searchTerm,
  isInFilteredResults,
  cardGroup,
  cardTypes,
  kpiData,
  onDragStart,
  onClick,
  onFocus,
  onToggleLock,
  onRemove,
  onResizeStart,
  onMinimize,
  onExpand,
  onRestore,
  setShowTemplateLibrary,
}) => {
  const isMinimized = card.width <= 200 && card.height <= 140;
  const isGroupLocked = cardGroup?.locked || false;

  // Determine card styling based on state
  const getCardClassName = () => {
    const baseClasses = 'absolute bg-white rounded-lg shadow-lg border transition-all duration-200 group overflow-hidden';
    
    const selectionClasses = isSelected
      ? isDraggingMultiple ? 'opacity-80 scale-95' : ''
      : 'hover:shadow-xl border-gray-200 hover:border-purple-200';
    
    const dragClasses = isDragging ? 'z-50 rotate-1 scale-105 shadow-2xl' : 'z-10';
    
    const lockClasses = isLocked || isGroupLocked
      ? 'border-red-400 bg-red-50/30 cursor-default'
      : card.type === 'customers-page' || card.id.includes('-page')
        ? 'border-blue-400 bg-blue-50/30 cursor-default'
        : 'cursor-default';
    
    const searchClasses = searchTerm && isInFilteredResults
      ? 'ring-2 ring-yellow-400 bg-yellow-50/30 animate-pulse'
      : '';
    
    return `${baseClasses} ${selectionClasses} ${dragClasses} ${lockClasses} ${searchClasses}`;
  };

  const handleFocus = (e?: React.FocusEvent) => {
    // Only navigate if the focus didn't come from a button click
    if (e && e.target && (e.target === e.currentTarget || !e.target.closest('button'))) {
      onFocus(card.id);
    }
  };

  const handleRestoreClick = () => {
    // Get original size/position from localStorage
    const savedState = localStorage.getItem(`card-state-${card.id}`);
    let originalSize = { width: 400, height: 300 };
    let originalPosition = { x: 100, y: 100 };
    
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        originalSize = parsed.originalSize || originalSize;
        originalPosition = parsed.originalPosition || originalPosition;
      } catch (error) {
        // Failed to parse saved state - use defaults
        // Error is non-critical, just use default card state
      }
    }
    
    onRestore(card.id, card.type, originalSize, originalPosition);
  };

  return (
    <CardFocusManager
      key={card.id}
      cardId={card.id}
      isFocused={isFocused}
      isSelected={isSelected}
      navigationMode={navigationMode}
      isNavigating={isNavigating}
      data-card-id={card.id}
      className={getCardClassName()}
      style={{
        left: card.x,
        top: card.y,
        width: card.width,
        height: card.height
      }}
      onFocus={handleFocus}
    >
      <div 
        onClick={(e) => {
          // Don't trigger card selection if clicking on draggable content
          const target = e.target as HTMLElement;
          if (!target.closest('.draggable-content')) {
            onClick(card.id, e);
          }
        }}
      >
        {/* Floating Action Toolbar - Appears on hover */}
        <div className="absolute top-2 right-2 z-50 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
          <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md rounded-lg px-1.5 py-1 shadow-xl border border-gray-200/50">
            {/* Drag Handle */}
            {!isLocked && !isGroupLocked && (
              <>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!isLocked && !isGroupLocked) {
                      onDragStart(card.id, e);
                    }
                  }}
                  tabIndex={-1}
                  className="w-7 h-7 flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 shadow-sm cursor-grab active:cursor-grabbing"
                  title="Drag to move card"
                >
                  <GripVertical className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-4 bg-gray-300" />
              </>
            )}
            
            {/* Minimize/Maximize/Restore Controls */}
            {isMinimized ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleRestoreClick();
                }}
                onMouseDown={(e) => e.stopPropagation()}
                tabIndex={-1}
                className="w-7 h-7 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-md transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1 shadow-sm"
                title="Restore"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onMinimize(card.id, card.type);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  tabIndex={-1}
                  className="w-7 h-7 flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 shadow-sm"
                  title="Minimize"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onExpand(card.id, card.type);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  tabIndex={-1}
                  className="w-7 h-7 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 shadow-sm"
                  title="Expand"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    window.dispatchEvent(new CustomEvent('halfScreenCard', {
                      detail: { cardId: card.id, cardType: card.type }
                    }));
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  tabIndex={-1}
                  className="w-7 h-7 flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white rounded-md transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 shadow-sm"
                  title="Half-screen (side-by-side)"
                >
                  <Columns className="w-3.5 h-3.5" />
                </button>
              </>
            )}
            
            <div className="w-px h-4 bg-gray-300" />
            
            {/* Lock/Unlock Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onToggleLock(card.id);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              tabIndex={-1}
              className={`w-7 h-7 flex items-center justify-center rounded-md transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1 shadow-sm ${
                isLocked 
                  ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-400' 
                  : 'bg-purple-500 hover:bg-purple-600 text-white focus:ring-purple-400'
              }`}
              title={isLocked ? 'Unlock card' : 'Lock card'}
            >
              {isLocked ? (
                <Unlock className="w-3.5 h-3.5" />
              ) : (
                <Lock className="w-3.5 h-3.5" />
              )}
            </button>
            
            <div className="w-px h-4 bg-gray-300" />
            
            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onRemove(card.id);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              tabIndex={-1}
              className="w-7 h-7 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-md transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 shadow-sm"
              title="Delete card"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card Content - Don't interfere with drag events from child elements */}
        <div 
          className="p-3 h-full overflow-hidden"
        >
          {renderCardComponent(card, cardTypes, kpiData, setShowTemplateLibrary)}
        </div>

        {/* Resize Handles - Higher z-index to ensure they're clickable */}
        {(isSelected || isResizing) && !isLocked && (
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 100 }}>
            {/* Corner handles */}
            <ResizeHandle position="nw" onResizeStart={(handle, e) => onResizeStart(card.id, handle, e)} />
            <ResizeHandle position="ne" onResizeStart={(handle, e) => onResizeStart(card.id, handle, e)} />
            <ResizeHandle position="sw" onResizeStart={(handle, e) => onResizeStart(card.id, handle, e)} />
            <ResizeHandle position="se" onResizeStart={(handle, e) => onResizeStart(card.id, handle, e)} />
            
            {/* Edge handles */}
            <ResizeHandle position="n" onResizeStart={(handle, e) => onResizeStart(card.id, handle, e)} />
            <ResizeHandle position="s" onResizeStart={(handle, e) => onResizeStart(card.id, handle, e)} />
            <ResizeHandle position="e" onResizeStart={(handle, e) => onResizeStart(card.id, handle, e)} />
            <ResizeHandle position="w" onResizeStart={(handle, e) => onResizeStart(card.id, handle, e)} />
          </div>
        )}
      </div>
    </CardFocusManager>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for React.memo
  // Returns true if props are equal (skip re-render), false if different (re-render)
  
  // Always re-render if card ID changes (new card added)
  if (prevProps.card.id !== nextProps.card.id) {
    return false; // Re-render
  }
  
  // Check if card type component availability changed
  const prevCardType = prevProps.cardTypes.find((t: any) => t.id === prevProps.card.type);
  const nextCardType = nextProps.cardTypes.find((t: any) => t.id === nextProps.card.type);
  
  // If component wasn't available before but is now, re-render
  if (!prevCardType?.component && nextCardType?.component) {
    return false; // Re-render - component is now available
  }
  
  // Standard prop comparison
  const propsEqual = (
    prevProps.card.x === nextProps.card.x &&
    prevProps.card.y === nextProps.card.y &&
    prevProps.card.width === nextProps.card.width &&
    prevProps.card.height === nextProps.card.height &&
    prevProps.card.type === nextProps.card.type &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isDragging === nextProps.isDragging &&
    prevProps.isLocked === nextProps.isLocked &&
    prevProps.isResizing === nextProps.isResizing &&
    prevProps.isFocused === nextProps.isFocused &&
    prevProps.isInFilteredResults === nextProps.isInFilteredResults &&
    prevProps.cardTypes === nextProps.cardTypes &&
    prevProps.kpiData === nextProps.kpiData
  );
  
  return propsEqual; // true = skip re-render, false = re-render
});

CardContainer.displayName = 'CardContainer';

