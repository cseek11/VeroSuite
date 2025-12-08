/**
 * Memoized Card component for performance optimization
 * Prevents unnecessary re-renders when card props haven't changed
 */

import React from 'react';

interface CardProps {
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
  isLocked: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
  onFocus?: (e: React.FocusEvent) => void;
}

export const Card = React.memo<CardProps>(({ 
  card,
  isSelected: _isSelected,
  isDragging: _isDragging,
  isLocked: _isLocked,
  children,
  className,
  style,
  onClick,
  onFocus,
}) => {
  return (
    <div
      className={className}
      style={style}
      onClick={onClick}
      onFocus={onFocus}
      data-card-id={card.id}
    >
      {children}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo
  // Only re-render if these specific props change
  return (
    prevProps.card.x === nextProps.card.x &&
    prevProps.card.y === nextProps.card.y &&
    prevProps.card.width === nextProps.card.width &&
    prevProps.card.height === nextProps.card.height &&
    prevProps.card.type === nextProps.card.type &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isDragging === nextProps.isDragging &&
    prevProps.isLocked === nextProps.isLocked
  );
});

Card.displayName = 'Card';







