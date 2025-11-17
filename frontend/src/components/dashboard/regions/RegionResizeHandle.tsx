import React, { useRef, useEffect, useState } from 'react';

interface RegionResizeHandleProps {
  onResize: (deltaX: number, deltaY: number) => void;
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
  position: 'se' | 'sw' | 'ne' | 'nw' | 'e' | 'w' | 'n' | 's';
  disabled?: boolean;
}

export const RegionResizeHandle: React.FC<RegionResizeHandleProps> = ({
  onResize,
  onResizeStart,
  onResizeEnd,
  position,
  disabled = false
}) => {
  const handleRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!startPosRef.current) return;

      const deltaX = e.clientX - startPosRef.current.x;
      const deltaY = e.clientY - startPosRef.current.y;
      onResize(deltaX, deltaY);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      startPosRef.current = null;
      onResizeEnd?.();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, onResize, onResizeEnd]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    startPosRef.current = { x: e.clientX, y: e.clientY };
    onResizeStart?.();
  };

  const getCursor = () => {
    switch (position) {
      case 'se': return 'se-resize';
      case 'sw': return 'sw-resize';
      case 'ne': return 'ne-resize';
      case 'nw': return 'nw-resize';
      case 'e': return 'e-resize';
      case 'w': return 'w-resize';
      case 'n': return 'n-resize';
      case 's': return 's-resize';
      default: return 'default';
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'se': return 'bottom-0 right-0';
      case 'sw': return 'bottom-0 left-0';
      case 'ne': return 'top-0 right-0';
      case 'nw': return 'top-0 left-0';
      case 'e': return 'top-1/2 right-0 -translate-y-1/2';
      case 'w': return 'top-1/2 left-0 -translate-y-1/2';
      case 'n': return 'top-0 left-1/2 -translate-x-1/2';
      case 's': return 'bottom-0 left-1/2 -translate-x-1/2';
      default: return '';
    }
  };

  return (
    <div
      ref={handleRef}
      className={`absolute ${getPositionClasses()} w-4 h-4 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onMouseDown={handleMouseDown}
      style={{ 
        cursor: getCursor(),
        zIndex: 100,
        pointerEvents: disabled ? 'none' : 'auto',
        touchAction: 'none'
      }}
      role="button"
      aria-label={`Resize handle ${position}`}
      tabIndex={disabled ? -1 : 0}
    />
  );
};


