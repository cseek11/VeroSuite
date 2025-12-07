import { useState, useCallback, useMemo } from 'react';
import { DashboardRegion } from '@/routes/dashboard/types/region.types';

export type LayoutMode = 'auto' | 'custom' | 'system';

interface LayoutIntelligenceOptions {
  regions: DashboardRegion[];
  userRole?: string;
  currentTime?: Date;
  workloadMetrics?: {
    activeJobs: number;
    pendingTasks: number;
    peakHours: boolean;
  };
}

interface LayoutIntelligenceReturn {
  mode: LayoutMode;
  setMode: (mode: LayoutMode) => void;
  suggestedLayout: DashboardRegion[];
  optimizeLayout: () => DashboardRegion[];
  getContextualBehavior: (regionId: string) => {
    shouldExpand: boolean;
    priority: number;
    visibility: 'visible' | 'hidden' | 'collapsed';
  };
}

export function useLayoutIntelligence({
  regions,
  userRole = 'user',
  currentTime = new Date(),
  workloadMetrics
}: LayoutIntelligenceOptions): LayoutIntelligenceReturn {
  const [mode, setMode] = useState<LayoutMode>('custom');

  // Auto-layout: Context-aware arrangement
  const optimizeLayout = useCallback((): DashboardRegion[] => {
    if (mode !== 'auto') return regions;

    const optimized = [...regions];
    const hour = currentTime.getHours();
    const isPeakHours = hour >= 8 && hour <= 18;
    const hasHighWorkload = (workloadMetrics?.activeJobs || 0) > 10;

    // Reorder regions based on context
    optimized.sort((a, b) => {
      // Priority 1: Dispatch/Schedule regions during peak hours
      if (isPeakHours) {
        if (a.region_type === 'dispatch' || a.region_type === 'schedule') return -1;
        if (b.region_type === 'dispatch' || b.region_type === 'schedule') return 1;
      }

      // Priority 2: Reports/analytics during low workload
      if (!hasHighWorkload) {
        if (a.region_type === 'reports' || a.region_type === 'analytics') return -1;
        if (b.region_type === 'reports' || b.region_type === 'analytics') return 1;
      }

      // Priority 3: Role-based ordering
      if (userRole === 'technician') {
        if (a.region_type === 'schedule' || a.region_type === 'jobs') return -1;
        if (b.region_type === 'schedule' || b.region_type === 'jobs') return 1;
      }

      if (userRole === 'manager' || userRole === 'admin') {
        if (a.region_type === 'reports' || a.region_type === 'analytics') return -1;
        if (b.region_type === 'reports' || b.region_type === 'analytics') return 1;
      }

      return 0;
    });

    // Reposition regions in grid
    let currentRow = 0;
    let currentCol = 0;
    const maxCols = 4;

    return optimized.map((region) => {
      const newRegion = { ...region };
      
      // Calculate grid position
      newRegion.grid_row = currentRow;
      newRegion.grid_col = currentCol;

      // Adjust size based on importance
      if (isPeakHours && (region.region_type === 'dispatch' || region.region_type === 'schedule')) {
        newRegion.col_span = Math.min(3, maxCols - currentCol);
        newRegion.row_span = 2;
      } else {
        newRegion.col_span = Math.min(2, maxCols - currentCol);
        newRegion.row_span = 1;
      }

      // Move to next position
      currentCol += newRegion.col_span;
      if (currentCol >= maxCols) {
        currentCol = 0;
        currentRow += newRegion.row_span;
      }

      return newRegion;
    });
  }, [mode, regions, currentTime, workloadMetrics, userRole]);

  // Get contextual behavior for a region
  const getContextualBehavior = useCallback((regionId: string) => {
    const region = regions.find(r => r.id === regionId);
    if (!region) {
      return { shouldExpand: false, priority: 0, visibility: 'visible' as const };
    }

    const hour = currentTime.getHours();
    const isPeakHours = hour >= 8 && hour <= 18;
    const hasHighWorkload = (workloadMetrics?.activeJobs || 0) > 10;

    let shouldExpand = false;
    let priority = 0;
    let visibility: 'visible' | 'hidden' | 'collapsed' = 'visible';

    // Context-aware behavior
    if (region.region_type === 'dispatch' || region.region_type === 'schedule') {
      shouldExpand = isPeakHours || hasHighWorkload;
      priority = isPeakHours ? 10 : 5;
    }

    if (region.region_type === 'reports' || region.region_type === 'analytics') {
      shouldExpand = !hasHighWorkload;
      priority = hasHighWorkload ? 2 : 7;
      visibility = hasHighWorkload ? 'collapsed' : 'visible';
    }

    // Role-based visibility
    if (userRole === 'technician') {
      if (region.region_type === 'admin' || region.region_type === 'settings') {
        visibility = 'hidden';
      }
    }

    return { shouldExpand, priority, visibility };
  }, [regions, currentTime, workloadMetrics, userRole]);

  const suggestedLayout = useMemo(() => {
    if (mode === 'auto') {
      return optimizeLayout();
    }
    return regions;
  }, [mode, regions, optimizeLayout]);

  return {
    mode,
    setMode,
    suggestedLayout,
    optimizeLayout,
    getContextualBehavior
  };
}



