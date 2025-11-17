import { useEffect, useCallback, useMemo } from 'react';
import { DashboardRegion, RegionType } from '@/routes/dashboard/types/region.types';
import { useRegionStore, VersionedRegion } from '@/stores/regionStore';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';

interface UseRegionLayoutOptions {
  layoutId: string;
  autoSave?: boolean;
  debounceMs?: number;
}

interface UseRegionLayoutReturn {
  regions: DashboardRegion[];
  loading: boolean;
  error: Error | null;
  addRegion: (type: RegionType, position?: { row: number; col: number }) => Promise<void>;
  removeRegion: (id: string) => Promise<void>;
  updateRegionPosition: (id: string, row: number, col: number) => Promise<void>;
  updateRegionSize: (id: string, rowSpan: number, colSpan: number) => Promise<void>;
  reorderRegions: (regionIds: string[]) => Promise<void>;
  toggleCollapse: (id: string) => Promise<void>;
  toggleLock: (id: string) => Promise<void>;
  loadRoleDefaults: (role: string) => Promise<void>;
  updateRegion: (id: string, updates: Partial<DashboardRegion>) => Promise<void>;
  save: () => Promise<void>;
  reload: () => Promise<void>;
}

/**
 * Hook that wraps the Zustand region store for backward compatibility
 * Provides the same interface as the old useState-based implementation
 */
export function useRegionLayout({ layoutId, autoSave = true, debounceMs: _debounceMs = 500 }: UseRegionLayoutOptions): UseRegionLayoutReturn {
  // Get store state and actions
  const regions = useRegionStore((state) => state.getRegionsByLayout(layoutId));
  const loading = useRegionStore((state) => state.loading.has(layoutId));
  const error = useRegionStore((state) => state.errors.get(layoutId) || null);
  const loadRegions = useRegionStore((state) => state.loadRegions);
  const addRegionStore = useRegionStore((state) => state.addRegion);
  const updateRegionStore = useRegionStore((state) => state.updateRegion);
  const removeRegionStore = useRegionStore((state) => state.removeRegion);
  const reorderRegionsStore = useRegionStore((state) => state.reorderRegions);
  const flushUpdates = useRegionStore((state) => state.flushUpdates);

  // Load regions on mount and when layoutId changes
  useEffect(() => {
    if (layoutId) {
      loadRegions(layoutId).catch((err) => {
        logger.error('Failed to load regions', { error: err, layoutId }, 'useRegionLayout');
      });
    }
  }, [layoutId, loadRegions]);

  // Convert VersionedRegion[] to DashboardRegion[] for backward compatibility
  const dashboardRegions: DashboardRegion[] = useMemo(() => {
    return regions.map((r: VersionedRegion) => {
      const { version, optimistic, pendingUpdate, ...region } = r;
      return region as DashboardRegion;
    });
  }, [regions]);

  // Add region
  const addRegion = useCallback(async (type: RegionType, position?: { row: number; col: number }) => {
    try {
      await addRegionStore(layoutId, type, position);
    } catch (err) {
      logger.error('Failed to add region', { error: err, layoutId, type }, 'useRegionLayout');
      throw err;
    }
  }, [layoutId, addRegionStore]);

  // Remove region
  const removeRegion = useCallback(async (id: string) => {
    try {
      await removeRegionStore(layoutId, id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove region';
      logger.error('Failed to remove region', { error: err, layoutId, regionId: id }, 'useRegionLayout');
      toast.error(`Failed to remove region: ${errorMessage}`);
      throw err;
    }
  }, [layoutId, removeRegionStore]);

  // Update region position
  const updateRegionPosition = useCallback(async (id: string, row: number, col: number) => {
    try {
      // Clamp and validate bounds before sending to store/API
      const current = regions.find((r: VersionedRegion) => r.id === id) as VersionedRegion | undefined;
      const clampedRow = Math.max(0, row);
      let clampedCol = Math.max(0, Math.min(col, 11));
      if (current?.col_span) {
        // Ensure col + span <= 12
        clampedCol = Math.min(clampedCol, 12 - current.col_span);
        clampedCol = Math.max(0, clampedCol);
      }
      await updateRegionStore(layoutId, id, { grid_row: clampedRow, grid_col: clampedCol }, autoSave);
    } catch (err) {
      logger.error('Failed to update region position', { error: err, layoutId, regionId: id }, 'useRegionLayout');
      throw err;
    }
  }, [layoutId, updateRegionStore, autoSave]);

  // Update region size
  const updateRegionSize = useCallback(async (id: string, rowSpan: number, colSpan: number) => {
    try {
      // Clamp and validate bounds before sending to store/API
      const current = regions.find((r: VersionedRegion) => r.id === id) as VersionedRegion | undefined;
      const clampedRowSpan = Math.max(1, Math.min(rowSpan, 20));
      let clampedColSpan = Math.max(1, Math.min(colSpan, 12));
      if (current?.grid_col !== undefined) {
        // Ensure col + span <= 12
        clampedColSpan = Math.min(clampedColSpan, 12 - current.grid_col);
        clampedColSpan = Math.max(1, clampedColSpan);
      }
      await updateRegionStore(layoutId, id, { row_span: clampedRowSpan, col_span: clampedColSpan }, autoSave);
    } catch (err) {
      logger.error('Failed to update region size', { error: err, layoutId, regionId: id }, 'useRegionLayout');
      throw err;
    }
  }, [layoutId, updateRegionStore, autoSave, regions]);

  // Reorder regions
  const reorderRegions = useCallback(async (regionIds: string[]) => {
    try {
      await reorderRegionsStore(layoutId, regionIds);
    } catch (err) {
      logger.error('Failed to reorder regions', { error: err, layoutId }, 'useRegionLayout');
      throw err;
    }
  }, [layoutId, reorderRegionsStore]);

  // Toggle collapse
  const toggleCollapse = useCallback(async (id: string) => {
    const region = regions.find((r: VersionedRegion) => r.id === id);
    if (region) {
      try {
        // Save immediately for collapse (no debounce)
        await updateRegionStore(layoutId, id, { is_collapsed: !region.is_collapsed }, false);
      } catch (err) {
        logger.error('Failed to toggle collapse', { error: err, regionId: id, layoutId }, 'useRegionLayout');
        throw err;
      }
    }
  }, [layoutId, regions, updateRegionStore]);

  // Toggle lock
  const toggleLock = useCallback(async (id: string) => {
    const region = regions.find((r: VersionedRegion) => r.id === id);
    if (region) {
      try {
        await updateRegionStore(layoutId, id, { is_locked: !region.is_locked }, autoSave);
      } catch (err) {
        logger.error('Failed to toggle lock', { error: err, regionId: id, layoutId }, 'useRegionLayout');
        throw err;
      }
    }
  }, [layoutId, regions, updateRegionStore, autoSave]);

  // Update region (generic update method)
  const updateRegion = useCallback(async (id: string, updates: Partial<DashboardRegion>) => {
    try {
      await updateRegionStore(layoutId, id, updates, autoSave);
    } catch (err) {
      logger.error('Failed to update region', { error: err, layoutId, regionId: id, updates }, 'useRegionLayout');
      throw err;
    }
  }, [layoutId, updateRegionStore, autoSave]);

  // Load role defaults
  const loadRoleDefaults = useCallback(async (role: string) => {
    try {
      const { enhancedApi } = await import('@/lib/enhanced-api');
      const defaults = await enhancedApi.dashboardLayouts.getRoleDefaults(role);
      
      // Apply defaults to current layout
      for (const defaultRegion of defaults) {
        await addRegionStore(layoutId, defaultRegion.region_type as RegionType, {
          row: defaultRegion.grid_row,
          col: defaultRegion.grid_col
        });
      }
    } catch (err) {
      logger.error('Failed to load role defaults', { error: err, layoutId, role }, 'useRegionLayout');
      throw err;
    }
  }, [layoutId, addRegionStore]);

  // Save (flush pending updates)
  const save = useCallback(async () => {
    try {
      await flushUpdates(layoutId);
    } catch (err) {
      logger.error('Failed to save', { error: err, layoutId }, 'useRegionLayout');
      throw err;
    }
  }, [layoutId, flushUpdates]);

  // Reload regions
  const reload = useCallback(async () => {
    try {
      await loadRegions(layoutId);
    } catch (err) {
      logger.error('Failed to reload regions', { error: err, layoutId }, 'useRegionLayout');
      throw err;
    }
  }, [layoutId, loadRegions]);

  return {
    regions: dashboardRegions,
    loading,
    error,
    addRegion,
    removeRegion,
    updateRegionPosition,
    updateRegionSize,
    reorderRegions,
    toggleCollapse,
    toggleLock,
    loadRoleDefaults,
    updateRegion,
    save,
    reload
  };
}
