import React, { useEffect, useRef, memo } from 'react';
import { cn } from '@/lib/utils';

interface CardFocusManagerProps {
  cardId: string;
  isFocused: boolean;
  isSelected: boolean;
  navigationMode: 'select' | 'move' | 'resize';
  isNavigating: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onFocus?: (e?: React.FocusEvent) => void;
  onBlur?: (e?: React.FocusEvent) => void;
}

const CardFocusManagerComponent: React.FC<CardFocusManagerProps> = ({
  cardId,
  isFocused,
  isSelected,
  navigationMode,
  isNavigating,
  children,
  className,
  style,
  onFocus,
  onBlur
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Update focus styles based on state
  useEffect(() => {
    const cardElement = cardRef.current;
    if (!cardElement) return;

    // Update tabindex for keyboard navigation
    if (isFocused) {
      cardElement.setAttribute('tabindex', '0');
    } else {
      cardElement.removeAttribute('tabindex');
    }

    // Update ARIA attributes for accessibility
    cardElement.setAttribute('aria-selected', isSelected.toString());
    cardElement.setAttribute('aria-focus', isFocused.toString());
    
    // Add role for screen readers
    if (!cardElement.getAttribute('role')) {
      cardElement.setAttribute('role', 'button');
    }
  }, [isFocused, isSelected]);

  // Handle focus events
  const handleFocus = (e: React.FocusEvent) => {
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent) => {
    onBlur?.(e);
  };

  // Handle keyboard events for the card
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent default behavior for navigation keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter', ' '].includes(e.key)) {
      e.preventDefault();
    }
  };

  // Get focus ring styles based on navigation mode
  const getFocusStyles = () => {
    const baseStyles = 'outline-none transition-all duration-200';
    
    if (isNavigating && isFocused) {
      switch (navigationMode) {
        case 'move':
          return `${baseStyles} ring-2 ring-blue-500 ring-offset-2 ring-offset-white shadow-lg shadow-blue-500/20`;
        case 'resize':
          return `${baseStyles} ring-2 ring-green-500 ring-offset-2 ring-offset-white shadow-lg shadow-green-500/20`;
        case 'select':
        default:
          return `${baseStyles} ring-2 ring-purple-500 ring-offset-2 ring-offset-white shadow-lg shadow-purple-500/20`;
      }
    }
    
    if (isSelected) {
      return `${baseStyles} ring-2 ring-purple-500 ring-offset-1 ring-offset-white`;
    }
    
    return baseStyles;
  };

  return (
    <div
      ref={cardRef}
      data-card-id={cardId}
      className={cn(
        getFocusStyles(),
        className
      )}
      style={style}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      aria-label={`Card ${cardId}`}
    >
      {children}
      
      {/* Navigation mode indicator */}
      {isNavigating && isFocused && (
        <div className="absolute -top-8 left-0 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none z-50">
          {navigationMode === 'move' && '🔄 Move Mode'}
          {navigationMode === 'resize' && '📏 Resize Mode'}
          {navigationMode === 'select' && '👆 Select Mode'}
        </div>
      )}
      
      {/* Focus indicator for screen readers */}
      {isFocused && (
        <div 
          className="sr-only"
          aria-live="polite"
        >
          {isSelected ? 'Selected' : 'Not selected'} card focused
        </div>
      )}
    </div>
  );
};

// Memoized CardFocusManager to prevent unnecessary re-renders
export const CardFocusManager = memo(CardFocusManagerComponent, (prevProps, nextProps) => {
  // Only re-render if these props change
  return (
    prevProps.cardId === nextProps.cardId &&
    prevProps.isFocused === nextProps.isFocused &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.navigationMode === nextProps.navigationMode &&
    prevProps.isNavigating === nextProps.isNavigating &&
    prevProps.className === nextProps.className &&
    // Deep compare style object
    JSON.stringify(prevProps.style) === JSON.stringify(nextProps.style)
  );
});

CardFocusManager.displayName = 'CardFocusManager';

// Keyboard navigation instructions component
export const KeyboardNavigationInstructions: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Keyboard Navigation</h3>
      <div className="space-y-2 text-xs text-gray-600">
        <div className="flex justify-between">
          <span>Navigate between cards:</span>
          <span className="font-mono bg-gray-100 px-2 py-1 rounded">Arrow Keys</span>
        </div>
        <div className="flex justify-between">
          <span>Select multiple cards:</span>
          <span className="font-mono bg-gray-100 px-2 py-1 rounded">Shift + Arrow Keys</span>
        </div>
        <div className="flex justify-between">
          <span>Move selected card:</span>
          <span className="font-mono bg-gray-100 px-2 py-1 rounded">Ctrl + Arrow Keys</span>
        </div>
        <div className="flex justify-between">
          <span>Resize selected card:</span>
          <span className="font-mono bg-gray-100 px-2 py-1 rounded">Alt + Arrow Keys</span>
        </div>
        <div className="flex justify-between">
          <span>Activate card:</span>
          <span className="font-mono bg-gray-100 px-2 py-1 rounded">Space / Enter</span>
        </div>
        <div className="flex justify-between">
          <span>Tab navigation:</span>
          <span className="font-mono bg-gray-100 px-2 py-1 rounded">Tab / Shift+Tab</span>
        </div>
        <div className="flex justify-between">
          <span>First/Last card:</span>
          <span className="font-mono bg-gray-100 px-2 py-1 rounded">Home / End</span>
        </div>
        <div className="flex justify-between">
          <span>Deselect all:</span>
          <span className="font-mono bg-gray-100 px-2 py-1 rounded">Escape</span>
        </div>
      </div>
    </div>
  );
};
