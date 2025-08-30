import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, GripVertical } from 'lucide-react';

interface ReusablePopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  size?: { width: number; height: number };
  showTabs?: boolean;
  tabs?: Array<{ id: string; label: string; icon: React.ComponentType<{ className?: string }> }>;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

const ReusablePopup: React.FC<ReusablePopupProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  children,
  size = { width: 720, height: 480 },
  showTabs = false,
  tabs = [],
  activeTab,
  onTabChange
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [currentSize, setCurrentSize] = useState(size);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  const popupRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target !== headerRef.current && !headerRef.current?.contains(e.target as Node)) {
      return;
    }
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      setPosition({
        x: newX,
        y: newY
      });
    }
    
    if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      const newWidth = Math.max(400, Math.min(1200, resizeStart.width + deltaX));
      const newHeight = Math.max(400, Math.min(800, resizeStart.height + deltaY));
      
      setCurrentSize({ width: newWidth, height: newHeight });
    }
  };

  // Handle mouse up
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: currentSize.width,
      height: currentSize.height
    });
  };

  // Add/remove event listeners
  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragOffset, resizeStart, currentSize.width, currentSize.height]);

  // Reset position when popup opens
  useEffect(() => {
    if (isOpen) {
      setPosition({ x: 0, y: 0 });
      setCurrentSize(size);
    }
  }, [isOpen, size]);

  if (!isOpen) return null;

  const popupContent = (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 z-[9999]"
      onClick={onClose}
    >
      {/* Draggable and Resizable Popup Container */}
      <div 
        ref={popupRef}
        className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
        style={{
          width: currentSize.width,
          height: currentSize.height,
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: isDragging ? 'grabbing' : 'default'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Draggable Header */}
        <div 
          ref={headerRef}
          className="flex items-center justify-between p-2 bg-gray-50 border-b border-gray-200 cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <GripVertical className="w-3 h-3 text-gray-400 flex-shrink-0" />
            {Icon && (
              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded flex items-center justify-center shadow-sm flex-shrink-0">
                <Icon className="w-3 h-3 text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              {title && (
                <h2 className="text-sm font-semibold text-gray-900 truncate">{title}</h2>
              )}
              {subtitle && (
                <p className="text-xs text-gray-600 truncate">{subtitle}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white/20 rounded transition-all duration-200 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
                 {/* Tab Navigation (if enabled) */}
         {showTabs && tabs.length > 0 && (
           <div className="px-4 py-2 bg-white border-b border-gray-200">
             <div className={`grid w-full h-10 bg-gray-100 border border-gray-200 rounded-lg p-1 ${
               tabs.length <= 8 ? 'grid-cols-8' : 'grid-cols-9'
             }`}>
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange?.(tab.id)}
                    className={`flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                      isActive 
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <TabIcon className="w-3 h-3" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto overflow-x-hidden
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-gray-50
            [&::-webkit-scrollbar-thumb]:bg-purple-300
            hover:[&::-webkit-scrollbar-thumb]:bg-purple-400
            dark:[&::-webkit-scrollbar-track]:bg-gray-50
            dark:[&::-webkit-scrollbar-thumb]:bg-purple-300
            dark:hover:[&::-webkit-scrollbar-thumb]:bg-purple-400">
            <div className="p-4">
              {children}
            </div>
          </div>
        </div>

        {/* Resize Handle */}
        <div 
          className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize flex items-center justify-center"
          onMouseDown={handleResizeStart}
        >
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-b-[8px] border-b-gray-400"></div>
        </div>
      </div>
    </div>
  );

  // Render to document body using portal
  return createPortal(popupContent, document.body);
};

export default ReusablePopup;
