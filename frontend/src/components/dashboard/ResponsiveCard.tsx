import React, { useState, useCallback, useMemo } from 'react';
import { 
  GripVertical, 
  MoreHorizontal, 
  Minimize2, 
  Maximize2,
  RotateCcw,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react';
import { useDensityMode } from '@/hooks/useDensityMode';

interface ResponsiveCardProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  isLocked?: boolean;
  isSelected?: boolean;
  isResizable?: boolean;
  isDraggable?: boolean;
  minWidth?: number;
  minHeight?: number;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  onDragStart?: (e: React.MouseEvent) => void;
  onResize?: (width: number, height: number) => void;
  onSelect?: (id: string) => void;
  onLock?: (id: string) => void;
  onMinimize?: (id: string) => void;
  onMaximize?: (id: string) => void;
  onReset?: (id: string) => void;
  onMenuClick?: (id: string) => void;
  responsiveMode?: 'auto' | 'mobile' | 'tablet' | 'desktop';
  cardType?: 'metric' | 'chart' | 'table' | 'form' | 'custom';
}

export function ResponsiveCard({
  id,
  title,
  children,
  className = '',
  style = {},
  isLocked = false,
  isSelected = false,
  isResizable = true,
  isDraggable = true,
  minWidth = 200,
  minHeight = 150,
  width = 300,
  height = 200,
  x = 0,
  y = 0,
  onDragStart,
  onResize,
  onSelect,
  onLock,
  onMinimize,
  onMaximize,
  onReset,
  onMenuClick,
  responsiveMode = 'auto',
  cardType = 'custom'
}: ResponsiveCardProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [devicePreview, setDevicePreview] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  const { densityMode, isMobile, isTablet } = useDensityMode();

  // Responsive sizing based on screen size and density
  const responsiveDimensions = useMemo(() => {
    let baseWidth = width;
    let baseHeight = height;

    // Adjust for density mode
    if (densityMode === 'dense') {
      baseWidth *= 0.9;
      baseHeight *= 0.9;
    }

    // Adjust for screen size
    if (isMobile) {
      baseWidth = Math.min(baseWidth, 320);
      baseHeight = Math.min(baseHeight, 240);
    } else if (isTablet) {
      baseWidth = Math.min(baseWidth, 400);
      baseHeight = Math.min(baseHeight, 300);
    }

    // Adjust for card type
    switch (cardType) {
      case 'metric':
        baseHeight = Math.min(baseHeight, 120);
        break;
      case 'chart':
        baseHeight = Math.max(baseHeight, 200);
        break;
      case 'table':
        baseHeight = Math.max(baseHeight, 250);
        break;
      case 'form':
        baseHeight = Math.max(baseHeight, 300);
        break;
    }

    return {
      width: Math.max(minWidth, baseWidth),
      height: Math.max(minHeight, baseHeight)
    };
  }, [width, height, minWidth, minHeight, densityMode, isMobile, isTablet, cardType]);

  // Responsive header height
  const headerHeight = useMemo(() => {
    if (isMobile) return 32;
    if (isTablet) return 40;
    return densityMode === 'dense' ? 36 : 44;
  }, [isMobile, isTablet, densityMode]);

  // Responsive padding
  const cardPadding = useMemo(() => {
    if (isMobile) return '8px';
    if (isTablet) return '12px';
    return densityMode === 'dense' ? '10px' : '16px';
  }, [isMobile, isTablet, densityMode]);

  // Responsive font sizes
  const fontSizes = useMemo(() => {
    if (isMobile) return {
      title: '14px',
      content: '12px',
      button: '12px'
    };
    if (isTablet) return {
      title: '16px',
      content: '14px',
      button: '14px'
    };
    return {
      title: densityMode === 'dense' ? '14px' : '16px',
      content: densityMode === 'dense' ? '12px' : '14px',
      button: densityMode === 'dense' ? '12px' : '14px'
    };
  }, [isMobile, isTablet, densityMode]);

  const handleMinimize = useCallback(() => {
    setIsMinimized(!isMinimized);
    if (onMinimize) onMinimize(id);
  }, [isMinimized, id, onMinimize]);

  const handleMaximize = useCallback(() => {
    setIsMaximized(!isMaximized);
    if (onMaximize) onMaximize(id);
  }, [isMaximized, id, onMaximize]);

  const handleReset = useCallback(() => {
    setIsMinimized(false);
    setIsMaximized(false);
    if (onReset) onReset(id);
  }, [id, onReset]);

  const handleLock = useCallback(() => {
    if (onLock) onLock(id);
  }, [id, onLock]);

  const handleMenuClick = useCallback(() => {
    if (onMenuClick) onMenuClick(id);
  }, [id, onMenuClick]);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) onSelect(id);
  }, [id, onSelect]);

  const toggleDevicePreview = useCallback(() => {
    setDevicePreview(prev => {
      switch (prev) {
        case 'desktop': return 'tablet';
        case 'tablet': return 'mobile';
        default: return 'desktop';
      }
    });
  }, []);

  return (
    <div
      className={`responsive-card ${className} ${
        isSelected ? 'selected' : ''
      } ${isLocked ? 'locked' : ''} ${isMinimized ? 'minimized' : ''} ${
        isMaximized ? 'maximized' : ''
      } ${densityMode} ${isMobile ? 'mobile' : ''} ${isTablet ? 'tablet' : ''}`}
      style={{
        ...style,
        width: isMaximized ? '100vw' : responsiveDimensions.width,
        height: isMinimized ? headerHeight : (isMaximized ? '100vh' : responsiveDimensions.height),
        minWidth: minWidth,
        minHeight: minHeight,
        left: isMaximized ? 0 : x,
        top: isMaximized ? 0 : y,
        fontSize: fontSizes.content,
        zIndex: isMaximized ? 1000 : isSelected ? 10 : 1
      }}
      data-card-id={id}
      onClick={handleCardClick}
    >
      {/* Card Header */}
      <div
        className="card-header"
        style={{
          height: headerHeight,
          fontSize: fontSizes.title,
          padding: `0 ${cardPadding}`,
          cursor: isDraggable ? 'grab' : 'default'
        }}
        onMouseDown={isDraggable ? onDragStart : undefined}
      >
        <div className="flex items-center justify-between h-full">
          {/* Drag Handle */}
          {isDraggable && (
            <div className="flex items-center space-x-1 text-gray-400">
              <GripVertical className="w-3 h-3" />
              <span className="font-medium truncate" title={title}>
                {title}
              </span>
            </div>
          )}

          {/* Title (when not draggable) */}
          {!isDraggable && (
            <span className="font-medium truncate" title={title}>
              {title}
            </span>
          )}

          {/* Device Preview Toggle */}
          <button
            onClick={toggleDevicePreview}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title={`Preview: ${devicePreview}`}
            style={{ fontSize: fontSizes.button }}
          >
            {devicePreview === 'mobile' && <Smartphone className="w-3 h-3" />}
            {devicePreview === 'tablet' && <Tablet className="w-3 h-3" />}
            {devicePreview === 'desktop' && <Monitor className="w-3 h-3" />}
          </button>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1">
            {/* Lock/Unlock */}
            <button
              onClick={handleLock}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title={isLocked ? 'Unlock card' : 'Lock card'}
              style={{ fontSize: fontSizes.button }}
            >
              {isLocked ? (
                <div className="w-3 h-3 bg-red-500 rounded-sm" />
              ) : (
                <div className="w-3 h-3 border border-gray-300 rounded-sm" />
              )}
            </button>

            {/* Minimize/Maximize */}
            <button
              onClick={handleMinimize}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title={isMinimized ? 'Restore card' : 'Minimize card'}
              style={{ fontSize: fontSizes.button }}
            >
              <Minimize2 className="w-3 h-3" />
            </button>

            <button
              onClick={handleMaximize}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title={isMaximized ? 'Restore card' : 'Maximize card'}
              style={{ fontSize: fontSizes.button }}
            >
              <Maximize2 className="w-3 h-3" />
            </button>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Reset card"
              style={{ fontSize: fontSizes.button }}
            >
              <RotateCcw className="w-3 h-3" />
            </button>

            {/* More Menu */}
            <button
              onClick={handleMenuClick}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="More options"
              style={{ fontSize: fontSizes.button }}
            >
              <MoreHorizontal className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Card Content */}
      {!isMinimized && (
        <div
          className="card-content"
          style={{
            height: `calc(100% - ${headerHeight}px)`,
            padding: cardPadding,
            fontSize: fontSizes.content,
            overflow: isMaximized ? 'visible' : 'auto'
          }}
        >
          {/* Device Preview Overlay */}
          {devicePreview !== 'desktop' && (
            <div 
              className="absolute inset-0 pointer-events-none border-2 border-dashed border-blue-400 bg-blue-50/20 z-10"
              style={{
                borderRadius: devicePreview === 'mobile' ? '20px' : '12px',
                margin: devicePreview === 'mobile' ? '8px' : '4px'
              }}
            >
              <div className="absolute top-2 left-2 text-xs text-blue-600 font-medium">
                {devicePreview === 'mobile' ? 'Mobile View' : 'Tablet View'}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="relative z-0">
            {children}
          </div>
        </div>
      )}

      {/* Responsive Styles */}
      <style>{`
        .responsive-card {
          position: absolute;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
          overflow: hidden;
        }

        .responsive-card:hover {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .responsive-card.selected {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
        }

        .responsive-card.locked {
          border-color: #ef4444;
          background: #fef2f2;
        }

        .responsive-card.minimized {
          min-height: ${headerHeight}px;
        }

        .responsive-card.maximized {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 0;
          z-index: 1000;
        }

        .card-header {
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          user-select: none;
        }

        .card-header:active {
          cursor: grabbing;
        }

        .card-content {
          background: white;
          overflow: auto;
        }

        /* Mobile optimizations */
        .responsive-card.mobile {
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .responsive-card.mobile .card-header {
          padding: 0 12px;
        }

        .responsive-card.mobile .card-content {
          padding: 12px;
        }

        /* Tablet optimizations */
        .responsive-card.tablet {
          border-radius: 10px;
        }

        /* Density mode styles */
        .responsive-card.dense .card-header {
          background: #f3f4f6;
        }

        .responsive-card.dense .card-content {
          padding: 8px;
        }

        /* Touch optimizations */
        @media (hover: none) and (pointer: coarse) {
          .responsive-card .card-header button {
            min-width: 44px;
            min-height: 44px;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .responsive-card {
            border-width: 2px;
          }
          
          .responsive-card.selected {
            border-width: 3px;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .responsive-card {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
