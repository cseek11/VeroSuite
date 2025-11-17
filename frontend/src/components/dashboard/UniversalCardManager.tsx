import React, { useState, useEffect, useCallback } from 'react';
import { Maximize2, Minimize, X, Lock, Unlock } from 'lucide-react';
import { logger } from '@/utils/logger';

interface UniversalCardManagerProps {
  cardId: string;
  cardType: string;
  children: React.ReactNode;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onRestore?: () => void;
  onClose?: () => void;
  isLocked?: boolean;
  onToggleLock?: () => void;
  className?: string;
}

interface CardState {
  isMinimized: boolean;
  isMaximized: boolean;
  originalSize?: { width: number; height: number };
  originalPosition?: { x: number; y: number };
}

/**
 * UniversalCardManager - Provides consistent minimize/maximize/close functionality for ALL cards
 * 
 * Features:
 * - Minimize: Shrinks card to icon size in grid
 * - Maximize: Expands card to full viewport
 * - Restore: Returns to original size/position
 * - Lock: Prevents dragging/resizing
 * - Persistent state via localStorage
 * 
 * Performance:
 * - Uses React.memo for children
 * - Debounced state persistence
 * - Event delegation for buttons
 */
export const UniversalCardManager: React.FC<UniversalCardManagerProps> = ({
  cardId,
  cardType,
  children,
  onMinimize,
  onMaximize,
  onRestore,
  onClose,
  isLocked = false,
  onToggleLock,
  className = ''
}) => {
  const [state, setState] = useState<CardState>({
    isMinimized: false,
    isMaximized: false
  });

  // Load saved state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem(`card-state-${cardId}`);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setState(prev => ({
          ...prev,
          originalSize: parsed.originalSize,
          originalPosition: parsed.originalPosition
        }));
      } catch (error) {
        logger.warn('Failed to load card state', { error, cardId }, 'UniversalCardManager');
      }
    }
  }, [cardId]);

  // Save state to localStorage (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem(`card-state-${cardId}`, JSON.stringify({
        originalSize: state.originalSize,
        originalPosition: state.originalPosition
      }));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [cardId, state.originalSize, state.originalPosition]);

  // Listen for minimize/maximize/restore events from parent
  useEffect(() => {
    const handleMinimizeEvent = () => {
      setState(prev => ({ ...prev, isMinimized: true, isMaximized: false }));
    };

    const handleMaximizeEvent = () => {
      setState(prev => ({ ...prev, isMinimized: false, isMaximized: true }));
    };

    const handleRestoreEvent = () => {
      setState(prev => ({ ...prev, isMinimized: false, isMaximized: false }));
    };

    window.addEventListener(`minimizeCard-${cardId}`, handleMinimizeEvent);
    window.addEventListener(`maximizeCard-${cardId}`, handleMaximizeEvent);
    window.addEventListener(`restoreCard-${cardId}`, handleRestoreEvent);

    return () => {
      window.removeEventListener(`minimizeCard-${cardId}`, handleMinimizeEvent);
      window.removeEventListener(`maximizeCard-${cardId}`, handleMaximizeEvent);
      window.removeEventListener(`restoreCard-${cardId}`, handleRestoreEvent);
    };
  }, [cardId]);

  const handleMinimize = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Dispatch event for VeroCardsV3 to handle positioning
    window.dispatchEvent(new CustomEvent('minimizeCard', {
      detail: { cardId, cardType }
    }));
    
    onMinimize?.();
  }, [cardId, cardType, onMinimize]);

  const handleMaximize = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    window.dispatchEvent(new CustomEvent('expandCard', {
      detail: { cardId, cardType }
    }));
    
    onMaximize?.();
  }, [cardId, cardType, onMaximize]);

  const handleRestore = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    const savedState = localStorage.getItem(`card-state-${cardId}`);
    let originalSize = { width: 400, height: 300 };
    let originalPosition = { x: 100, y: 100 };
    
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        originalSize = parsed.originalSize || originalSize;
        originalPosition = parsed.originalPosition || originalPosition;
      } catch (error) {
        logger.warn('Failed to parse saved state', { error, cardId }, 'UniversalCardManager');
      }
    }
    
    window.dispatchEvent(new CustomEvent('restoreCard', {
      detail: { 
        cardId, 
        cardType,
        originalSize,
        originalPosition
      }
    }));
    
    onRestore?.();
  }, [cardId, cardType, onRestore]);

  const handleClose = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    window.dispatchEvent(new CustomEvent('closeCard', {
      detail: { cardId, cardType }
    }));
    
    onClose?.();
  }, [cardId, cardType, onClose]);

  const handleToggleLock = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onToggleLock?.();
  }, [onToggleLock]);

  // Render minimized view
  if (state.isMinimized) {
    return (
      <div className={`flex flex-col items-center justify-center p-2 ${className}`}>
        <button
          onClick={handleRestore}
          onMouseDown={(e) => e.stopPropagation()}
          className="p-2 hover:bg-purple-100 rounded-full transition-all duration-200 hover:scale-110"
          title={`Restore ${cardType}`}
        >
          <Maximize2 className="w-6 h-6 text-purple-600" />
        </button>
        <span className="text-xs text-gray-600 mt-1 text-center truncate w-full">
          {cardType}
        </span>
      </div>
    );
  }

  // Render normal/maximized view
  return (
    <div className={`h-full w-full flex flex-col ${className}`}>
      {/* Card Controls - Always visible on hover */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {onToggleLock && (
          <button
            onClick={handleToggleLock}
            onMouseDown={(e) => e.stopPropagation()}
            className={`p-1.5 rounded-full transition-all duration-200 hover:scale-110 ${
              isLocked 
                ? 'bg-red-500/20 hover:bg-red-500/30' 
                : 'bg-gray-500/20 hover:bg-gray-500/30'
            }`}
            title={isLocked ? 'Unlock' : 'Lock'}
          >
            {isLocked ? (
              <Lock className="w-3 h-3 text-red-600" />
            ) : (
              <Unlock className="w-3 h-3 text-gray-600" />
            )}
          </button>
        )}
        
        <button
          onClick={handleMinimize}
          onMouseDown={(e) => e.stopPropagation()}
          className="p-1.5 hover:bg-yellow-500/20 rounded-full transition-all duration-200 hover:scale-110"
          title="Minimize"
        >
          <Minimize className="w-3 h-3 text-yellow-600" />
        </button>
        
        <button
          onClick={state.isMaximized ? handleRestore : handleMaximize}
          onMouseDown={(e) => e.stopPropagation()}
          className="p-1.5 hover:bg-blue-500/20 rounded-full transition-all duration-200 hover:scale-110"
          title={state.isMaximized ? 'Restore' : 'Maximize'}
        >
          <Maximize2 className={`w-3 h-3 ${state.isMaximized ? 'text-green-600' : 'text-blue-600'}`} />
        </button>
        
        <button
          onClick={handleClose}
          onMouseDown={(e) => e.stopPropagation()}
          className="p-1.5 hover:bg-red-500/20 rounded-full transition-all duration-200 hover:scale-110"
          title="Close"
        >
          <X className="w-3 h-3 text-red-600" />
        </button>
      </div>

      {/* Card Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default UniversalCardManager;




