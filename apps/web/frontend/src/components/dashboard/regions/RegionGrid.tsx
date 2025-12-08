import React, { ReactNode, useMemo, useCallback } from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import { DashboardRegion } from '@/routes/dashboard/types/region.types';
import { RegionContainer } from './RegionContainer';
import { useRegionStore } from '@/stores/regionStore';
import { toast } from '@/utils/toast';
import { validateGridBounds, regionsOverlap } from '../../../../../shared/validation/region-constants';
import 'react-grid-layout/css/styles.css';
import './region-grid.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface RegionGridProps {
  regions: DashboardRegion[];
  rows?: number;
  cols?: number;
  gap?: number;
  onResize?: (id: string, rowSpan: number, colSpan: number) => void;
  onMove?: (id: string, row: number, col: number) => void;
  onToggleCollapse?: (id: string) => void;
  onToggleLock?: (id: string) => void;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<DashboardRegion>) => Promise<void>;
  onAddRegion?: (type: string, position?: { row: number; col: number }) => Promise<void>;
  renderRegion?: (region: DashboardRegion) => ReactNode;
  className?: string;
  isDraggable?: boolean;
  isResizable?: boolean;
}

export const RegionGrid: React.FC<RegionGridProps> = ({
  regions,
  rows = 12,
  cols = 12,
  gap = 16,
  onResize,
  onMove,
  onToggleCollapse,
  onToggleLock,
  onDelete,
  onUpdate,
  onAddRegion,
  renderRegion,
  className = '',
  isDraggable = true,
  isResizable = true
}) => {
  // Convert regions to React Grid Layout format
  const layouts = useMemo(() => {
    const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
    
    const layout: { [key: string]: Layout[] } = {};
    
    Object.keys(breakpoints).forEach((breakpoint) => {
      layout[breakpoint] = regions.map((region) => {
        // Calculate minW and minH in grid units (assuming ~100px per unit)
        // Ensure minW doesn't exceed the item's width
        const minW = Math.min(
          Math.ceil(region.min_width / 100) || 1,
          region.col_span || 1
        );
        const minH = Math.min(
          Math.ceil(region.min_height / 100) || 1,
          region.row_span || 1
        );
        
        // Calculate max width based on remaining columns
        const maxW = cols - region.grid_col;
        
        return {
          i: region.id,
          x: region.grid_col,
          y: region.grid_row,
          w: region.col_span,
          h: region.row_span,
          minW: Math.max(1, minW), // At least 1 grid unit
          minH: Math.max(1, minH), // At least 1 grid unit
          maxW: Math.max(1, maxW), // Can't exceed grid bounds
          maxH: undefined, // No max height constraint
          static: region.is_locked || false,
          isDraggable: isDraggable && !region.is_locked,
          isResizable: isResizable && !region.is_locked
        };
      });
    });
    
    return layout;
  }, [regions, rows, cols, isDraggable, isResizable]);

  // Handle drag stop - validate before committing
  const handleDragStop = useCallback((_layout: Layout[], _oldItem: Layout, newItem: Layout, _placeholder: Layout, _e: MouseEvent, _element: HTMLElement) => {
    const region = regions.find((r) => r.id === newItem.i);
    if (!region) return;

    // Validate and clamp grid bounds using shared validation
    const boundsCheck = validateGridBounds({
      grid_col: newItem.x,
      col_span: newItem.w,
      grid_row: newItem.y,
      row_span: newItem.h
    });

    if (!boundsCheck.valid) {
      toast.error(`Cannot move region: ${boundsCheck.error}`, 5000);
      // Force revert by not calling onMove
      return;
    }

    const validX = Math.max(0, Math.min(newItem.x, cols - 1));
    const validW = Math.max(1, Math.min(newItem.w, cols - validX));
    const validY = Math.max(0, newItem.y);
    const validH = Math.max(1, newItem.h);

    // Get latest regions from store for accurate overlap detection
    const storeState = useRegionStore.getState();
    const layoutId = region.layout_id || regions[0]?.layout_id || '';
    const latestRegions = storeState.getRegionsByLayout(layoutId).map(r => ({
      id: r.id,
      grid_row: r.grid_row,
      grid_col: r.grid_col,
      row_span: r.row_span,
      col_span: r.col_span
    }));

    // Check for overlaps with latest data using shared overlap detection
    const wouldOverlap = latestRegions.some(existing => {
      if (existing.id === newItem.i) return false;
      return regionsOverlap(
        {
          grid_row: validY,
          grid_col: validX,
          row_span: validH,
          col_span: validW
        },
        existing
      );
    });

    if (wouldOverlap) {
      const overlappingRegion = latestRegions.find(existing => 
        existing.id !== newItem.i && 
        regionsOverlap(
          { grid_row: validY, grid_col: validX, row_span: validH, col_span: validW },
          existing
        )
      );
      const position = overlappingRegion 
        ? ` at position (${overlappingRegion.grid_row}, ${overlappingRegion.grid_col})`
        : '';
      toast.error(`Cannot move region: overlaps with another region${position}`, 5000);
      // Force revert by not calling onMove
      return;
    }

    // Only send update if position changed
    const positionChanged = validX !== region.grid_col || validY !== region.grid_row;
    if (positionChanged) {
      onMove?.(newItem.i, validY, validX);
    }
  }, [regions, cols, onMove]);

  // Handle resize stop - validate before committing
  const handleResizeStop = useCallback((_layout: Layout[], _oldItem: Layout, newItem: Layout, _placeholder: Layout, _e: MouseEvent, _element: HTMLElement) => {
    const region = regions.find((r) => r.id === newItem.i);
    if (!region) return;

    // Validate and clamp grid bounds using shared validation
    const boundsCheck = validateGridBounds({
      grid_col: newItem.x,
      col_span: newItem.w,
      grid_row: newItem.y,
      row_span: newItem.h
    });

    if (!boundsCheck.valid) {
      toast.error(`Cannot resize region: ${boundsCheck.error}`, 5000);
      // Force revert by not calling onResize
      return;
    }

    const validX = Math.max(0, Math.min(newItem.x, cols - 1));
    const validW = Math.max(1, Math.min(newItem.w, cols - validX));
    const validY = Math.max(0, newItem.y);
    const validH = Math.max(1, newItem.h);

    // Get latest regions from store for accurate overlap detection
    const storeState = useRegionStore.getState();
    const layoutId = region.layout_id || regions[0]?.layout_id || '';
    const latestRegions = storeState.getRegionsByLayout(layoutId).map(r => ({
      id: r.id,
      grid_row: r.grid_row,
      grid_col: r.grid_col,
      row_span: r.row_span,
      col_span: r.col_span
    }));

    // Check for overlaps with latest data using shared overlap detection
    const wouldOverlap = latestRegions.some(existing => {
      if (existing.id === newItem.i) return false;
      return regionsOverlap(
        {
          grid_row: validY,
          grid_col: validX,
          row_span: validH,
          col_span: validW
        },
        existing
      );
    });

    if (wouldOverlap) {
      const overlappingRegion = latestRegions.find(existing => 
        existing.id !== newItem.i && 
        regionsOverlap(
          { grid_row: validY, grid_col: validX, row_span: validH, col_span: validW },
          existing
        )
      );
      const position = overlappingRegion 
        ? ` at position (${overlappingRegion.grid_row}, ${overlappingRegion.grid_col})`
        : '';
      toast.error(`Cannot resize region: overlaps with another region${position}`, 5000);
      // Force revert by not calling onResize
      return;
    }

    // Only send update if size changed
    const sizeChanged = validW !== region.col_span || validH !== region.row_span;
    if (sizeChanged) {
      onResize?.(newItem.i, validH, validW);
    }
  }, [regions, cols, onResize]);

  // Handle layout change (for other updates, not drag/resize)
  const handleLayoutChange = useCallback((_currentLayout: Layout[], _allLayouts: { [key: string]: Layout[] }) => {
    // This is called for all layout changes, but we handle drag/resize in onDragStop/onResizeStop
    // This can be used for other layout updates if needed
  }, []);

  // Responsive breakpoints and column counts
  const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
  const colsMap = { lg: cols, md: cols, sm: cols, xs: cols, xxs: cols };

  return (
    <div className={`region-grid ${className} w-full h-full`} role="grid" aria-label="Dashboard regions grid">
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={breakpoints}
        cols={colsMap}
        rowHeight={100}
        margin={[gap, gap]}
        containerPadding={[0, 0]}
        onLayoutChange={handleLayoutChange}
        onDragStop={handleDragStop}
        onResizeStop={handleResizeStop}
        isDraggable={isDraggable}
        isResizable={isResizable}
        draggableHandle=".region-drag-handle"
        resizeHandles={['se', 'sw', 'ne', 'nw', 's', 'n', 'e', 'w']}
        compactType={null}
        preventCollision={true}
        useCSSTransforms={true}
        allowOverlap={false}
        isBounded={true}
        style={{ height: '100%' }}
      >
        {regions.map((region) => (
          <div key={region.id} className="region-grid-item">
            <RegionContainer
              region={region}
              {...(onResize ? { onResize } : {})}
              {...(onMove ? { onMove } : {})}
              {...(onToggleCollapse ? { onToggleCollapse } : {})}
              {...(onToggleLock ? { onToggleLock } : {})}
              {...(onDelete ? { onDelete } : {})}
              {...(onUpdate ? { onUpdate } : {})}
              {...(onAddRegion ? { onAddRegion } : {})}
            >
              {renderRegion ? renderRegion(region) : null}
            </RegionContainer>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

