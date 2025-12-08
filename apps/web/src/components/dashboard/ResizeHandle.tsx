import React from 'react';
import { logger } from '@/utils/logger';

interface ResizeHandleProps {
  position: 'se' | 'sw' | 'ne' | 'nw' | 'e' | 'w' | 's' | 'n';
  onResizeStart: (handle: string, e: React.MouseEvent) => void;
}

const ResizeHandle: React.FC<ResizeHandleProps> = ({ position, onResizeStart }) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'se': return 'bottom-0 right-0 cursor-se-resize';
      case 'sw': return 'bottom-0 left-0 cursor-sw-resize';
      case 'ne': return 'top-0 right-0 cursor-ne-resize';
      case 'nw': return 'top-0 left-0 cursor-nw-resize';
      case 'e': return 'top-1/2 right-0 -translate-y-1/2 cursor-e-resize';
      case 'w': return 'top-1/2 left-0 -translate-y-1/2 cursor-w-resize';
      case 's': return 'bottom-0 left-1/2 -translate-x-1/2 cursor-s-resize';
      case 'n': return 'top-0 left-1/2 -translate-x-1/2 cursor-n-resize';
      default: return '';
    }
  };

  const isCorner = ['se', 'sw', 'ne', 'nw'].includes(position);
  const isEdge = ['e', 'w', 's', 'n'].includes(position);

  return (
    <div
      className={`absolute ${getPositionClasses()} ${
        isCorner 
          ? 'w-4 h-4 bg-purple-500 rounded-full opacity-80 hover:opacity-100 transition-opacity duration-100 hover:scale-110' 
          : isEdge
          ? 'bg-purple-500 opacity-80 hover:opacity-100 transition-opacity duration-100 hover:scale-110 ' +
            (position === 'e' || position === 'w' ? 'w-2 h-6' : 'w-6 h-2')
          : ''
      } hover:bg-purple-600 shadow-lg cursor-pointer pointer-events-auto`}
      style={{ zIndex: 1000 }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        logger.debug('Resize handle clicked', { position }, 'ResizeHandle');
        onResizeStart(position, e);
      }}
      title={`Resize ${position.toUpperCase()}`}
    />
  );
};

export default ResizeHandle;
