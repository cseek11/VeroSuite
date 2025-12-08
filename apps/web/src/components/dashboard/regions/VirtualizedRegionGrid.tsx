import React, { useMemo, useCallback, useRef, useEffect } from 'react';
import type { CellComponentProps } from 'react-window';
import * as ReactWindow from 'react-window';
const Grid = (ReactWindow as any).FixedSizeGrid;
import { DashboardRegion } from '@/routes/dashboard/types/region.types';
import { RegionContainer } from './RegionContainer';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface VirtualizedRegionGridProps {
  regions: DashboardRegion[];
  cols: number;
  rowHeight: number;
  onResize?: (id: string, rowSpan: number, colSpan: number) => void;
  onMove?: (id: string, row: number, col: number) => void;
  onToggleCollapse?: (id: string) => void;
  onToggleLock?: (id: string) => void;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<DashboardRegion>) => Promise<void>;
  className?: string;
}

/**
 * Virtualized grid for rendering large numbers of regions efficiently
 * Uses react-window to only render visible regions
 */
export const VirtualizedRegionGrid: React.FC<VirtualizedRegionGridProps> = ({
  regions,
  cols,
  rowHeight,
  onResize,
  onMove,
  onToggleCollapse,
  onToggleLock,
  onDelete,
  onUpdate,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = React.useState({ width: 0, height: 0 });

  // Calculate grid dimensions
  const maxRow = useMemo(() => {
    return Math.max(...regions.map(r => r.grid_row + r.row_span - 1), 0);
  }, [regions]);

  const rows = maxRow + 1;
  const gridWidth = containerSize.width || 1200;

  // Create a map of regions by position for quick lookup
  const regionMap = useMemo(() => {
    const map = new Map<string, DashboardRegion>();
    regions.forEach(region => {
      const key = `${region.grid_row},${region.grid_col}`;
      map.set(key, region);
    });
    return map;
  }, [regions]);

  // Update container size on mount and resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Cell renderer for virtualized grid
  const Cell = useCallback(({ columnIndex, rowIndex, style }: CellComponentProps) => {
    const key = `${rowIndex},${columnIndex}`;
    const region = regionMap.get(key);

    if (!region) {
      return <div style={style} />;
    }

    // Check if this is the top-left cell of the region
    const isRegionStart = region.grid_row === rowIndex && region.grid_col === columnIndex;

    if (!isRegionStart) {
      return <div style={style} />;
    }

    // Calculate cell span
    const cellWidth = gridWidth / cols;
    const cellHeight = rowHeight;

    const regionStyle: React.CSSProperties = {
      ...style,
      width: cellWidth * region.col_span,
      height: cellHeight * region.row_span,
      position: 'absolute'
    };

    return (
      <div style={regionStyle}>
        <RegionContainer
          region={region}
          {...(onResize ? { onResize } : {})}
          {...(onMove ? { onMove } : {})}
          {...(onToggleCollapse ? { onToggleCollapse } : {})}
          {...(onToggleLock ? { onToggleLock } : {})}
          {...(onDelete ? { onDelete } : {})}
          {...(onUpdate ? { onUpdate } : {})}
        />
      </div>
    );
  }, [regionMap, cols, rowHeight, gridWidth, onResize, onMove, onToggleCollapse, onToggleLock, onDelete, onUpdate]);

  if (regions.length === 0) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <p className="text-gray-500">No regions to display</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`w-full h-full ${className}`}>
      <Grid
        columnCount={cols}
        columnWidth={gridWidth / cols}
        height={containerSize.height || 600}
        rowCount={rows}
        rowHeight={rowHeight}
        width={gridWidth}
        overscanRowCount={2}
        overscanColumnCount={1}
      >
        {Cell}
      </Grid>
    </div>
  );
};

/**
 * Hook for lazy loading regions based on visibility
 */
export function useLazyRegionLoading(
  regions: DashboardRegion[],
  containerRef: React.RefObject<HTMLElement>
) {
  const [visibleRegions, setVisibleRegions] = React.useState<Set<string>>(new Set());

  const observer = useIntersectionObserver(
    containerRef,
    {
      threshold: 0.1,
      rootMargin: '100px'
    }
  );

  useEffect(() => {
    if (!observer || !containerRef.current) return;

    const regionElements = containerRef.current.querySelectorAll('[data-region-id]');
    const visible = new Set<string>();

    regionElements.forEach(el => {
      const regionId = el.getAttribute('data-region-id');
      if (regionId && observer.isIntersecting(el as Element)) {
        visible.add(regionId);
      }
    });

    setVisibleRegions(visible);
  }, [observer, regions, containerRef]);

  return visibleRegions;
}



