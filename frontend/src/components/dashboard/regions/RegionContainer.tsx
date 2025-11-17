import React, { ReactNode, useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, ChevronDown, ChevronUp, Lock, Unlock, GripVertical, MoreVertical, Copy, Trash2 } from 'lucide-react';
import { DashboardRegion } from '@/routes/dashboard/types/region.types';
import { RegionContent } from './RegionContent';
import { RegionSettingsDialog } from './RegionSettingsDialog';
import { RegionErrorBoundary } from './RegionErrorBoundary';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';

interface RegionContainerProps {
  region: DashboardRegion;
  children?: ReactNode;
  onResize?: (id: string, rowSpan: number, colSpan: number) => void;
  onMove?: (id: string, row: number, col: number) => void;
  onToggleCollapse?: (id: string) => void;
  onToggleLock?: (id: string) => void;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<DashboardRegion>) => Promise<void>;
  onAddRegion?: (type: string, position?: { row: number; col: number }) => Promise<void>;
  className?: string;
  style?: React.CSSProperties;
}

export const RegionContainer: React.FC<RegionContainerProps> = React.memo(({
  region,
  children,
  onResize,
  onMove,
  onToggleCollapse,
  onToggleLock,
  onDelete,
  onUpdate,
  onAddRegion,
  className = '',
  style = {}
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [positionValidity, setPositionValidity] = useState<boolean | null>(null);
  const resizeStartRef = useRef<{ rowSpan: number; colSpan: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleResizeStart = useCallback(() => {
    setIsResizing(true);
    resizeStartRef.current = { rowSpan: region.row_span, colSpan: region.col_span };
  }, [region.row_span, region.col_span]);

  const handleResize = useCallback((deltaX: number, deltaY: number) => {
    if (!resizeStartRef.current || !onResize) return;

    // Calculate new size based on delta (approximate: 100px per grid unit)
    const gridUnitSize = 100;
    const newColSpan = Math.max(1, Math.round((resizeStartRef.current.colSpan * gridUnitSize + deltaX) / gridUnitSize));
    const newRowSpan = Math.max(1, Math.round((resizeStartRef.current.rowSpan * gridUnitSize + deltaY) / gridUnitSize));

    onResize(region.id, newRowSpan, newColSpan);
  }, [region.id, onResize]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    resizeStartRef.current = null;
  }, []);

  // Context menu handler
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  }, []);

  // Close context menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowContextMenu(false);
      }
    };

    if (showContextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showContextMenu]);

  // Handle duplicate region
  const handleDuplicate = useCallback(async () => {
    if (onAddRegion) {
      setIsDuplicating(true);
      try {
        // Create a duplicate with offset position
        await onAddRegion(region.region_type, {
          row: region.grid_row + 1,
          col: region.grid_col + 1
        });
        toast.success('Region duplicated successfully');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to duplicate region';
        logger.error('Failed to duplicate region', { error, regionId: region.id }, 'RegionContainer');
        toast.error(`Failed to duplicate region: ${errorMessage}`);
      } finally {
        setIsDuplicating(false);
        setShowContextMenu(false);
      }
    } else {
      setShowContextMenu(false);
    }
  }, [region, onAddRegion]);

  // Grid style - Note: React Grid Layout handles positioning, but we keep this for fallback
  const gridStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    minWidth: `${region.min_width}px`,
    minHeight: `${region.min_height}px`,
    ...(region.config?.backgroundColor && { backgroundColor: region.config.backgroundColor }),
    ...(region.config?.borderColor && { borderColor: region.config.borderColor }),
    ...style
  };

  // Workspace-style design: no shadows, no rounded corners, subtle borders
  const baseClasses = `
    region-container 
    relative 
    bg-[var(--color-surface)] 
    border 
    border-[var(--color-border)]
    transition-all 
    duration-200 
    group 
    overflow-hidden
    ${region.is_collapsed ? 'collapsed' : ''} 
    ${region.is_locked ? 'locked border-red-400 bg-red-50/30' : 'hover:border-slate-300'} 
    ${isResizing ? 'resizing border-blue-400' : ''}
  `.trim().replace(/\s+/g, ' ');

  return (
    <>
      <motion.div
        ref={containerRef}
        className={`${baseClasses} ${className}`}
        style={gridStyle}
        role="region"
        aria-label={`Region: ${region.region_type}`}
        aria-expanded={!region.is_collapsed}
        tabIndex={0}
        onContextMenu={handleContextMenu}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        whileHover={{ borderColor: 'var(--color-border)' }}
        layout
      >
        {/* Drag Handle - Only visible on hover */}
        {!region.is_locked && (
          <div className="region-drag-handle absolute top-2 left-2 z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-grab active:cursor-grabbing">
            <div className="flex items-center gap-1 bg-[var(--color-surface)]/95 backdrop-blur-md px-1.5 py-1 border border-[var(--color-border)] rounded">
              <GripVertical className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        )}

        {/* Floating Action Toolbar - Appears on hover (workspace-style) */}
        <div className="absolute top-2 right-2 z-50 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
          <div className="flex items-center gap-1.5 bg-[var(--color-surface)]/95 backdrop-blur-md px-1.5 py-1 border border-[var(--color-border)]">
            {onUpdate && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowSettings(true);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  tabIndex={-1}
                  className="w-7 h-7 flex items-center justify-center bg-purple-500 hover:bg-purple-600 text-white rounded-md transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1 shadow-sm"
                  title="Settings"
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-4 bg-gray-300" />
              </>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onToggleCollapse?.(region.id);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              tabIndex={-1}
              className="w-7 h-7 flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 shadow-sm"
              title={region.is_collapsed ? 'Expand' : 'Collapse'}
            >
              {region.is_collapsed ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5" />
              )}
            </button>
            <div className="w-px h-4 bg-gray-300" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onToggleLock?.(region.id);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              tabIndex={-1}
              className={`w-7 h-7 flex items-center justify-center rounded-md transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1 shadow-sm ${
                region.is_locked 
                  ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-400' 
                  : 'bg-purple-500 hover:bg-purple-600 text-white focus:ring-purple-400'
              }`}
              title={region.is_locked ? 'Unlock' : 'Lock'}
            >
              {region.is_locked ? (
                <Unlock className="w-3.5 h-3.5" />
              ) : (
                <Lock className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                e.preventDefault();
                handleContextMenu(e);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              tabIndex={-1}
              className="w-7 h-7 flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 shadow-sm"
              title="More options"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Context Menu - Rendered via Portal to appear above all regions */}
        {typeof document !== 'undefined' && createPortal(
          <AnimatePresence>
            {showContextMenu && (
              <>
                {/* Backdrop to close menu on outside click */}
                <motion.div
                  className="fixed inset-0 z-[9998]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowContextMenu(false)}
                />
                {/* Context Menu */}
                <motion.div
                  className="fixed z-[9999] bg-white border border-[var(--color-border)] shadow-lg rounded-md py-1 min-w-[160px]"
                  style={{
                    left: contextMenuPosition.x,
                    top: contextMenuPosition.y,
                  }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSettings(true);
                      setShowContextMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicate();
                    }}
                    disabled={isDuplicating}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Copy className="w-4 h-4" />
                    {isDuplicating ? 'Duplicating...' : 'Duplicate'}
                  </button>
                  <div className="border-t border-gray-200 my-1" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(region.id);
                      setShowContextMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}

        {/* Region Content - No header, just content like cards */}
        {region.is_collapsed ? (
          <div className="flex items-center justify-center p-4 min-h-[60px] text-gray-500 text-sm">
            <span className="capitalize">{region.config?.title || region.region_type.replace('-', ' ')}</span>
            <span className="mx-2">•</span>
            <span>Collapsed</span>
          </div>
        ) : (
          <RegionErrorBoundary
            regionId={region.id}
            onRecover={() => {
              // Reload region on recovery
              logger.info('Region recovered from error', { regionId: region.id }, 'RegionContainer');
            }}
          >
            <RegionContent region={region}>
              {children}
            </RegionContent>
          </RegionErrorBoundary>
        )}
        
        {/* Resize is handled by React Grid Layout - no custom handles needed */}
      </motion.div>
      {/* Settings Dialog - Rendered via Portal to appear outside region boundary */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {showSettings && onUpdate && (
            <RegionSettingsDialog
              region={region}
              isOpen={showSettings}
              onClose={() => setShowSettings(false)}
              onSave={(updates) => onUpdate(region.id, updates)}
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for React.memo
  // Returns true if props are equal (skip re-render), false if different (re-render)
  if (prevProps.region.id !== nextProps.region.id) return false;
  if (prevProps.region.grid_row !== nextProps.region.grid_row) return false;
  if (prevProps.region.grid_col !== nextProps.region.grid_col) return false;
  if (prevProps.region.row_span !== nextProps.region.row_span) return false;
  if (prevProps.region.col_span !== nextProps.region.col_span) return false;
  if (prevProps.region.is_collapsed !== nextProps.region.is_collapsed) return false;
  if (prevProps.region.is_locked !== nextProps.region.is_locked) return false;
  if (prevProps.className !== nextProps.className) return false;
  
  // Deep compare config object (but skip children comparison to prevent unnecessary re-renders)
  const prevConfig = prevProps.region.config || {};
  const nextConfig = nextProps.region.config || {};
  if (JSON.stringify(prevConfig) !== JSON.stringify(nextConfig)) return false;
  
  // Only compare children reference, not content (prevents flashing)
  // Children will re-render when their own props change
  
  return true; // Props are equal, skip re-render
});

