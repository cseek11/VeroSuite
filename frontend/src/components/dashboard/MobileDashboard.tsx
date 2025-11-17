import React, { useState, useCallback, useMemo } from 'react';
import { 
  Grid, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Settings,
  Smartphone,
  Tablet,
  Monitor,
  Eye,
  EyeOff
} from 'lucide-react';
import { useTouchGestures } from '@/hooks/useTouchGestures';
import { useDensityMode } from '@/hooks/useDensityMode';
import { logger } from '@/utils/logger';

interface MobileDashboardProps {
  children: React.ReactNode;
  onZoom?: (scale: number) => void;
  onPan?: (deltaX: number, deltaY: number) => void;
  onReset?: () => void;
  zoom?: number;
  pan?: { x: number; y: number };
  className?: string;
}

export function MobileDashboard({
  children,
  onZoom,
  onPan,
  onReset,
  zoom = 1,
  pan = { x: 0, y: 0 },
  className = ''
}: MobileDashboardProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMobileControls, setShowMobileControls] = useState(false);
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [showGrid, setShowGrid] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  
  const { densityMode, toggleDensity, isMobile, isTablet } = useDensityMode();

  // Touch gesture handling
  const handlePan = useCallback((deltaX: number, deltaY: number, velocity: { x: number; y: number }) => {
    if (onPan) {
      onPan(deltaX, deltaY);
    }
    setIsPanning(true);
  }, [onPan]);

  const handlePinch = useCallback((scale: number, center: { x: number; y: number }) => {
    if (onZoom) {
      const newZoom = Math.max(0.5, Math.min(3, zoom * scale));
      onZoom(newZoom);
    }
  }, [onZoom, zoom]);

  const handleTap = useCallback((point: { x: number; y: number }) => {
    // Handle tap actions
    logger.debug('Tap gesture detected', { point }, 'MobileDashboard');
  }, []);

  const handleDoubleTap = useCallback((point: { x: number; y: number }) => {
    // Double tap to reset zoom
    if (onZoom && onPan && onReset) {
      onZoom(1);
      onPan(0, 0);
      onReset();
    }
  }, [onZoom, onPan, onReset]);

  const handleSwipe = useCallback((direction: 'up' | 'down' | 'left' | 'right', velocity: { x: number; y: number }) => {
    // Handle swipe gestures for navigation
    logger.debug('Swipe gesture detected', { direction, velocity }, 'MobileDashboard');
  }, []);

  const { gestureState, handleTouchStart, handleTouchMove, handleTouchEnd, handleTouchCancel } = useTouchGestures({
    onPan: handlePan,
    onPinch: handlePinch,
    onTap: handleTap,
    onDoubleTap: handleDoubleTap,
    onSwipe: handleSwipe,
    enablePinch: true,
    enablePan: true,
    enableTap: true,
    enableSwipe: true
  });

  // Device mode detection and styling
  const deviceStyles = useMemo(() => {
    switch (deviceMode) {
      case 'mobile':
        return {
          maxWidth: '375px',
          margin: '0 auto',
          transform: 'scale(0.8)',
          transformOrigin: 'top center'
        };
      case 'tablet':
        return {
          maxWidth: '768px',
          margin: '0 auto',
          transform: 'scale(0.9)',
          transformOrigin: 'top center'
        };
      default:
        return {
          maxWidth: '100%',
          margin: '0',
          transform: 'scale(1)',
          transformOrigin: 'top center'
        };
    }
  }, [deviceMode]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const toggleDeviceMode = useCallback(() => {
    setDeviceMode(prev => {
      switch (prev) {
        case 'desktop': return 'tablet';
        case 'tablet': return 'mobile';
        default: return 'desktop';
      }
    });
  }, []);

  return (
    <div className={`mobile-dashboard ${className}`}>
      {/* Mobile Controls Overlay */}
      {showMobileControls && (
        <div className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2 space-y-2">
          {/* Device Mode Toggle */}
          <button
            onClick={toggleDeviceMode}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            title={`Switch to ${deviceMode === 'desktop' ? 'tablet' : deviceMode === 'tablet' ? 'mobile' : 'desktop'} view`}
          >
            {deviceMode === 'mobile' && <Smartphone className="w-4 h-4" />}
            {deviceMode === 'tablet' && <Tablet className="w-4 h-4" />}
            {deviceMode === 'desktop' && <Monitor className="w-4 h-4" />}
          </button>

          {/* Density Toggle */}
          <button
            onClick={toggleDensity}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            title={`Switch to ${densityMode === 'dense' ? 'standard' : 'dense'} density`}
          >
            <Grid className="w-4 h-4" />
          </button>

          {/* Grid Toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            title="Toggle grid overlay"
          >
            {showGrid ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Reset View */}
          <button
            onClick={onReset}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            title="Reset view"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Settings */}
          <button
            onClick={() => setShowMobileControls(!showMobileControls)}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            title="Toggle mobile controls"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Mobile Controls Toggle */}
      <button
        onClick={() => setShowMobileControls(!showMobileControls)}
        className="fixed top-4 right-4 z-40 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
        title="Mobile controls"
      >
        <Smartphone className="w-5 h-5" />
      </button>

      {/* Dashboard Container */}
      <div
        className={`dashboard-container relative overflow-hidden ${
          isPanning ? 'cursor-grabbing' : 'cursor-grab'
        } ${densityMode === 'dense' ? 'dense-mode' : 'standard-mode'}`}
        style={deviceStyles}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        onMouseDown={(e) => {
          // Handle mouse events for desktop
          if (!isMobile) {
            handleTouchStart(e as any);
          }
        }}
        onMouseMove={(e) => {
          if (!isMobile && gestureState.isGesturing) {
            handleTouchMove(e as any);
          }
        }}
        onMouseUp={(e) => {
          if (!isMobile) {
            handleTouchEnd(e as any);
          }
        }}
      >
        {/* Grid Overlay */}
        {showGrid && (
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
        )}

        {/* Content with Transform */}
        <div
          className="dashboard-content"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isPanning ? 'none' : 'transform 0.2s ease-out'
          }}
        >
          {children}
        </div>

        {/* Gesture Indicators */}
        {gestureState.isGesturing && (
          <div className="fixed top-20 left-4 z-30 bg-black/80 text-white px-3 py-2 rounded-lg text-sm">
            <div>Gesture: {gestureState.gestureType}</div>
            {gestureState.gestureType === 'pinch' && (
              <div>Scale: {gestureState.scale.toFixed(2)}</div>
            )}
            {gestureState.gestureType === 'pan' && (
              <div>
                Delta: {gestureState.deltaX.toFixed(0)}, {gestureState.deltaY.toFixed(0)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile-specific styles */}
      <style>{`
        .mobile-dashboard {
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          position: relative;
        }

        .dashboard-container {
          height: 100%;
          width: 100%;
          touch-action: none;
          user-select: none;
        }

        .dashboard-content {
          height: 100%;
          width: 100%;
          will-change: transform;
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .mobile-dashboard {
            padding: 0;
          }
          
          .dashboard-container {
            padding: 8px;
          }
        }

        /* Touch feedback */
        .dashboard-container:active {
          cursor: grabbing;
        }

        /* Density mode styles */
        .dense-mode .dashboard-content {
          transform: scale(0.9);
        }

        .standard-mode .dashboard-content {
          transform: scale(1);
        }

        /* Device mode specific styles */
        @media (max-width: 375px) {
          .mobile-dashboard {
            font-size: 14px;
          }
        }

        @media (min-width: 376px) and (max-width: 768px) {
          .mobile-dashboard {
            font-size: 16px;
          }
        }

        /* High DPI displays */
        @media (-webkit-min-device-pixel-ratio: 2) {
          .dashboard-content {
            image-rendering: -webkit-optimize-contrast;
          }
        }
      `}</style>
    </div>
  );
}
