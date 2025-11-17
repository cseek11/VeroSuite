import React, { useMemo, useCallback, useState } from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import { DashboardRegion } from '@/routes/dashboard/types/region.types';
import { RegionContainer } from './RegionContainer';
import { motion } from 'framer-motion';
import 'react-grid-layout/css/styles.css';
import './region-grid.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface AdaptiveGridProps {
  regions: DashboardRegion[];
  onResize?: (id: string, rowSpan: number, colSpan: number) => void;
  onMove?: (id: string, row: number, col: number) => void;
  onToggleCollapse?: (id: string) => void;
  onToggleLock?: (id: string) => void;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<DashboardRegion>) => Promise<void>;
  layoutMode?: 'grid' | 'masonry';
  className?: string;
  isDraggable?: boolean;
  isResizable?: boolean;
}

/**
 * Adaptive grid component with flexible sizing and masonry layout option
 */
export const AdaptiveGrid: React.FC<AdaptiveGridProps> = ({
  regions,
  onResize,
  onMove,
  onToggleCollapse,
  onToggleLock,
  onDelete,
  onUpdate,
  layoutMode = 'grid',
  className = '',
  isDraggable = true,
  isResizable = true
}) => {
  const [snapGuides, setSnapGuides] = useState<{ x: number; y: number }[]>([]);
  const [dragPreview, setDragPreview] = useState<{ id: string; x: number; y: number; w: number; h: number } | null>(null);

  // Calculate snap guides from existing regions
  const calculateSnapGuides = useCallback((currentLayout: Layout[]) => {
    const guides: { x: number; y: number }[] = [];
    const xPositions = new Set<number>();
    const yPositions = new Set<number>();

    currentLayout.forEach(item => {
      xPositions.add(item.x);
      xPositions.add(item.x + item.w);
      yPositions.add(item.y);
      yPositions.add(item.y + item.h);
    });

    xPositions.forEach(x => {
      yPositions.forEach(y => {
        guides.push({ x, y });
      });
    });

    return guides;
  }, []);

  // Convert regions to React Grid Layout format
  const layouts = useMemo(() => {
    const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
    const colsMap = { lg: 12, md: 12, sm: 8, xs: 4, xxs: 2 };
    
    const layout: { [key: string]: Layout[] } = {};
    
    Object.keys(breakpoints).forEach((breakpoint) => {
      if (layoutMode === 'masonry') {
        // Masonry layout: pack regions efficiently
        layout[breakpoint] = packMasonryLayout(regions, colsMap[breakpoint as keyof typeof colsMap]);
      } else {
        // Standard grid layout
        layout[breakpoint] = regions.map((region) => ({
          i: region.id,
          x: region.grid_col,
          y: region.grid_row,
          w: region.col_span,
          h: region.row_span,
          minW: Math.ceil(region.min_width / 100) || 2,
          minH: Math.ceil(region.min_height / 100) || 2,
          maxW: undefined,
          maxH: undefined,
          static: region.is_locked || false,
          isDraggable: isDraggable && !region.is_locked,
          isResizable: isResizable && !region.is_locked
        }));
      }
    });
    
    return layout;
  }, [regions, layoutMode, isDraggable, isResizable]);

  // Pack regions in masonry layout
  const packMasonryLayout = (regions: DashboardRegion[], cols: number): Layout[] => {
    const layout: Layout[] = [];
    const heights: number[] = new Array(cols).fill(0);

    regions.forEach((region) => {
      // Find column with minimum height
      let minCol = 0;
      let minHeight = heights[0];
      
      for (let col = 1; col < cols; col++) {
        if (heights[col] < minHeight) {
          minHeight = heights[col];
          minCol = col;
        }
      }

      // Place region at minimum height column
      const x = minCol;
      const y = Math.floor(minHeight);
      const w = Math.min(region.col_span, cols - x);
      const h = region.row_span;

      layout.push({
        i: region.id,
        x,
        y,
        w,
        h,
        minW: Math.ceil(region.min_width / 100) || 2,
        minH: Math.ceil(region.min_height / 100) || 2,
        static: region.is_locked || false,
        isDraggable: isDraggable && !region.is_locked,
        isResizable: isResizable && !region.is_locked
      });

      // Update heights
      for (let col = x; col < x + w && col < cols; col++) {
        heights[col] = y + h;
      }
    });

    return layout;
  };

  // Handle layout change with snap guides
  const handleLayoutChange = useCallback((currentLayout: Layout[], allLayouts: { [key: string]: Layout[] }) => {
    const lgLayout = allLayouts.lg || currentLayout;
    
    // Calculate snap guides
    const guides = calculateSnapGuides(lgLayout);
    setSnapGuides(guides);
    
    lgLayout.forEach((item) => {
      const region = regions.find((r) => r.id === item.i);
      if (!region) return;

      // Check if position changed
      if (item.x !== region.grid_col || item.y !== region.grid_row) {
        onMove?.(item.i, item.y, item.x);
      }

      // Check if size changed
      if (item.w !== region.col_span || item.h !== region.row_span) {
        onResize?.(item.i, item.h, item.w);
      }
    });
  }, [regions, onMove, onResize, calculateSnapGuides]);

  // Handle drag start
  const handleDragStart = useCallback((layout: Layout[], oldItem: Layout, newItem: Layout, placeholder: Layout, e: MouseEvent, element: HTMLElement) => {
    setDragPreview({
      id: newItem.i,
      x: newItem.x,
      y: newItem.y,
      w: newItem.w,
      h: newItem.h
    });
  }, []);

  // Handle drag stop
  const handleDragStop = useCallback(() => {
    setDragPreview(null);
  }, []);

  // Responsive breakpoints
  const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
  const colsMap = { lg: 12, md: 12, sm: 8, xs: 4, xxs: 2 };

  return (
    <div className={`adaptive-grid ${className} relative`} role="grid" aria-label="Adaptive dashboard regions grid">
      {/* Snap guides overlay */}
      {snapGuides.length > 0 && (
        <div className="snap-guides-overlay absolute inset-0 pointer-events-none z-10">
          {snapGuides.map((guide, index) => (
            <motion.div
              key={index}
              className="snap-guide absolute w-px h-px bg-blue-400 opacity-30"
              style={{
                left: `${(guide.x / 12) * 100}%`,
                top: `${guide.y * 50}px`
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
            />
          ))}
        </div>
      )}

      {/* Drag preview overlay */}
      {dragPreview && (
        <motion.div
          className="drag-preview absolute border-2 border-blue-500 bg-blue-100/20 pointer-events-none z-20"
          style={{
            left: `${(dragPreview.x / 12) * 100}%`,
            top: `${dragPreview.y * 50}px`,
            width: `${(dragPreview.w / 12) * 100}%`,
            height: `${dragPreview.h * 50}px`
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
        />
      )}

      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={breakpoints}
        cols={colsMap}
        rowHeight={50}
        isDraggable={isDraggable}
        isResizable={isResizable}
        onLayoutChange={handleLayoutChange}
        onDragStart={handleDragStart}
        onDragStop={handleDragStop}
        margin={[16, 16]}
        containerPadding={[16, 16]}
        compactType="vertical"
        preventCollision={false}
        useCSSTransforms={true}
      >
        {regions.map((region) => (
          <div key={region.id} data-region-id={region.id}>
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
      </ResponsiveGridLayout>
    </div>
  );
};




