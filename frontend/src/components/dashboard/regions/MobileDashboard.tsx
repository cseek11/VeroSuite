import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Menu, X } from 'lucide-react';
import { DashboardRegion } from '@/routes/dashboard/types/region.types';
import { RegionContainer } from './RegionContainer';
interface MobileDashboardProps {
  regions: DashboardRegion[];
  onResize?: (id: string, rowSpan: number, colSpan: number) => void;
  onMove?: (id: string, row: number, col: number) => void;
  onToggleCollapse?: (id: string) => void;
  onToggleLock?: (id: string) => void;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<DashboardRegion>) => Promise<void>;
  onAddRegion?: (type: string) => Promise<void>;
  className?: string;
}

/**
 * Mobile-optimized dashboard with swipe gestures and touch controls
 */
export const MobileDashboard: React.FC<MobileDashboardProps> = ({
  regions,
  onResize,
  onMove,
  onToggleCollapse,
  onToggleLock,
  onDelete,
  onUpdate,
  onAddRegion,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number | null>(null);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const swipeThreshold = 50;

  // Filter visible regions (not collapsed, not hidden on mobile)
  const visibleRegions = regions.filter(r => !r.is_collapsed && !r.is_hidden_mobile);

  // Swipe handlers using native touch events
  const handleSwipeStart = useCallback((e: React.TouchEvent) => {
    swipeStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  }, []);

  const handleSwipeMove = useCallback((e: React.TouchEvent) => {
    if (!swipeStartRef.current) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - swipeStartRef.current.x;
    const deltaY = currentY - swipeStartRef.current.y;

    // Only handle horizontal swipes if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      e.preventDefault(); // Prevent scrolling during horizontal swipe
    }
  }, []);

  const handleSwipeEnd = useCallback((e: React.TouchEvent) => {
    if (!swipeStartRef.current) return;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = endX - swipeStartRef.current.x;
    const deltaY = endY - swipeStartRef.current.y;

    // Check if it's a horizontal swipe
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold) {
      if (deltaX > 0 && currentIndex > 0) {
        // Swipe right - go to previous
        setCurrentIndex(prev => prev - 1);
      } else if (deltaX < 0 && currentIndex < visibleRegions.length - 1) {
        // Swipe left - go to next
        setCurrentIndex(prev => prev + 1);
      }
    }

    swipeStartRef.current = null;
  }, [currentIndex, visibleRegions.length]);

  // Pull to refresh
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      startYRef.current = e.touches[0].clientY;
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (startYRef.current !== null && containerRef.current?.scrollTop === 0) {
      const currentY = e.touches[0].clientY;
      const distance = currentY - startYRef.current;
      
      if (distance > 0) {
        setPullDistance(Math.min(distance, 100));
      }
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (pullDistance > 50) {
      setIsRefreshing(true);
      // Trigger refresh
      setTimeout(() => {
        setIsRefreshing(false);
        setPullDistance(0);
      }, 1000);
    } else {
      setPullDistance(0);
    }
    startYRef.current = null;
  }, [pullDistance]);

  // Navigation
  const goToNext = useCallback(() => {
    if (currentIndex < visibleRegions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, visibleRegions.length]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const goToIndex = useCallback((index: number) => {
    if (index >= 0 && index < visibleRegions.length) {
      setCurrentIndex(index);
    }
  }, [visibleRegions.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious]);

  if (visibleRegions.length === 0) {
    return (
      <div className={`mobile-dashboard empty ${className} flex flex-col items-center justify-center h-screen p-4`}>
        <div className="text-center">
          <p className="text-gray-500 mb-4">No regions to display</p>
          {onAddRegion && (
            <button
              onClick={() => onAddRegion('custom')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Add Region
            </button>
          )}
        </div>
      </div>
    );
  }

  const currentRegion = visibleRegions[currentIndex];

  return (
    <div
      className={`mobile-dashboard ${className} h-screen w-full overflow-hidden bg-gray-50`}
      onTouchStart={(e) => {
        handleTouchStart(e);
        handleSwipeStart(e);
      }}
      onTouchMove={(e) => {
        handleTouchMove(e);
        handleSwipeMove(e);
      }}
      onTouchEnd={(e) => {
        handleTouchEnd();
        handleSwipeEnd(e);
      }}
    >
      {/* Pull to refresh indicator */}
      <AnimatePresence>
        {pullDistance > 0 && (
          <motion.div
            className="absolute top-0 left-0 right-0 flex items-center justify-center bg-blue-500 text-white py-2 z-50"
            style={{ height: `${Math.min(pullDistance, 100)}px` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {isRefreshing ? (
              <span>Refreshing...</span>
            ) : (
              <span>Pull to refresh</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mobile-header bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="p-2 -ml-2"
          aria-label="Menu"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        <div className="flex-1 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            {currentRegion.region_type.replace(/-/g, ' ')}
          </h2>
          <p className="text-xs text-gray-500">
            {currentIndex + 1} of {visibleRegions.length}
          </p>
        </div>

        {onAddRegion && (
          <button
            onClick={() => onAddRegion('custom')}
            className="p-2 -mr-2"
            aria-label="Add region"
          >
            <Plus className="w-6 h-6 text-blue-500" />
          </button>
        )}
      </div>

      {/* Region carousel */}
      <div
        ref={containerRef}
        className="mobile-regions-container flex-1 overflow-hidden relative"
      >
        <motion.div
          className="flex h-full"
          animate={{
            x: `-${currentIndex * 100}%`
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30
          }}
        >
          {visibleRegions.map((region, index) => (
            <div
              key={region.id}
              className="mobile-region-slide flex-shrink-0 w-full h-full overflow-y-auto"
              style={{ scrollBehavior: 'smooth' }}
            >
              <RegionContainer
                region={region}
                onResize={onResize}
                onMove={onMove}
                onToggleCollapse={onToggleCollapse}
                onToggleLock={onToggleLock}
                onDelete={onDelete}
                onUpdate={onUpdate}
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation dots */}
      {visibleRegions.length > 1 && (
        <div className="mobile-nav-dots flex items-center justify-center gap-2 py-4 bg-white border-t border-gray-200">
          {visibleRegions.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-blue-500 w-6'
                  : 'bg-gray-300'
              }`}
              aria-label={`Go to region ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Navigation buttons */}
      {visibleRegions.length > 1 && (
        <>
          {currentIndex > 0 && (
            <button
              onClick={goToPrevious}
              className="mobile-nav-button left fixed left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg border border-gray-200 z-40"
              aria-label="Previous region"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
          )}

          {currentIndex < visibleRegions.length - 1 && (
            <button
              onClick={goToNext}
              className="mobile-nav-button right fixed right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg border border-gray-200 z-40"
              aria-label="Next region"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          )}
        </>
      )}

      {/* Menu drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-xl z-50 overflow-y-auto"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Regions</h3>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 -mr-2"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 space-y-2">
                {visibleRegions.map((region, index) => (
                  <button
                    key={region.id}
                    onClick={() => {
                      goToIndex(index);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      index === currentIndex
                        ? 'bg-blue-50 border-2 border-blue-500'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="font-medium text-gray-900">
                      {region.region_type.replace(/-/g, ' ')}
                    </div>
                    {region.config?.title && (
                      <div className="text-sm text-gray-500 mt-1">
                        {region.config.title}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

