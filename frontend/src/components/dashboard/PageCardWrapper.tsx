import React, { useState, useRef, useEffect } from 'react';
import { X, Maximize2, Minimize2, RotateCcw } from 'lucide-react';
import Card from '@/components/ui/Card';

interface PageCardWrapperProps {
  pageId: string;
  title: string;
  icon?: React.ComponentType<any> | undefined;
  children: React.ReactNode;
  onClose: () => void;
  onResize?: (size: { width: number; height: number }) => void;
  initialSize?: { width: number; height: number };
  className?: string;
}

export default function PageCardWrapper({
  pageId,
  title,
  icon: Icon,
  children,
  onClose,
  onResize,
  initialSize = { width: 800, height: 600 },
  className = '',
  ...rest
}: PageCardWrapperProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [size, setSize] = useState(initialSize);
  const cardRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);

  // Handle resize functionality
  const handleResize = (newSize: { width: number; height: number }) => {
    setSize(newSize);
    onResize?.(newSize);
  };

  // Handle maximize/restore
  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  // Handle reset size
  const resetSize = () => {
    handleResize(initialSize);
  };

  // Mouse event handlers for resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const newWidth = Math.max(400, e.clientX - rect.left);
      const newHeight = Math.max(300, e.clientY - rect.top);

      handleResize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const cardStyle = {
    width: isMaximized ? '100vw' : `${size.width}px`,
    height: isMaximized ? '100vh' : `${size.height}px`,
    minWidth: '400px',
    minHeight: '300px',
    maxWidth: isMaximized ? '100vw' : '90vw',
    maxHeight: isMaximized ? '100vh' : '90vh',
  };

  return (
    <div
      ref={cardRef}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${className}`}
      style={{ display: 'flex' }}
    >
      <Card
        className="bg-white shadow-2xl border-0 overflow-hidden flex flex-col"
        style={cardStyle}
        {...rest}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            {Icon && <Icon className="w-5 h-5 text-purple-600" />}
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Reset Size Button */}
            <button
              onClick={resetSize}
              className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
              title="Reset Size"
            >
              <RotateCcw className="w-4 h-4 text-gray-600" />
            </button>
            
            {/* Maximize/Restore Button */}
            <button
              onClick={toggleMaximize}
              className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
              title={isMaximized ? 'Restore' : 'Maximize'}
            >
              {isMaximized ? (
                <Minimize2 className="w-4 h-4 text-gray-600" />
              ) : (
                <Maximize2 className="w-4 h-4 text-gray-600" />
              )}
            </button>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-red-100 transition-colors"
              title="Close"
            >
              <X className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto">
            {children}
          </div>
        </div>

        {/* Resize Handle */}
        {!isMaximized && (
          <div
            ref={resizeHandleRef}
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-gray-300 hover:bg-gray-400 transition-colors"
            onMouseDown={(e) => {
              e.preventDefault();
              setIsResizing(true);
            }}
            style={{
              clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)',
            }}
          />
        )}
      </Card>
    </div>
  );
}
