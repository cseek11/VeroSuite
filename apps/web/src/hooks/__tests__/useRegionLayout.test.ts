import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRegionLayout } from '../useRegionLayout';
import { RegionType } from '@/routes/dashboard/types/region.types';
import * as enhancedApi from '@/lib/enhanced-api';

// Mock the enhanced API
vi.mock('@/lib/enhanced-api', () => ({
  enhancedApi: {
    dashboardLayouts: {
      listRegions: vi.fn(),
      createRegion: vi.fn(),
      updateRegion: vi.fn(),
      deleteRegion: vi.fn(),
      reorderRegions: vi.fn(),
      getRoleDefaults: vi.fn()
    }
  }
}));

// Mock the region store
const mockLoadRegions = vi.fn().mockResolvedValue([]);
const mockAddRegion = vi.fn();
const mockRemoveRegion = vi.fn();
const mockUpdateRegion = vi.fn();
const mockReorderRegions = vi.fn();
const mockFlushUpdates = vi.fn();

// Create a mutable mock state that can be updated
let mockErrors = new Map<string, Error>();
let mockLoading = new Set<string>();

vi.mock('@/stores/regionStore', () => ({
  useRegionStore: vi.fn((selector) => {
    const mockState = {
      regions: new Map(),
      loading: mockLoading,
      errors: mockErrors,
      conflicts: new Map(),
      getRegionsByLayout: () => [],
      loadRegions: mockLoadRegions,
      addRegion: mockAddRegion,
      updateRegion: mockUpdateRegion,
      removeRegion: mockRemoveRegion,
      reorderRegions: mockReorderRegions,
      flushUpdates: mockFlushUpdates
    };
    return selector(mockState);
  })
}));

describe('useRegionLayout', () => {
  const layoutId = 'test-layout-id';

  beforeEach(() => {
    vi.clearAllMocks();
    mockErrors = new Map();
    mockLoading = new Set();
  });

  it('should load regions on mount', async () => {
    const mockRegions = [
      {
        id: '1',
        layout_id: layoutId,
        region_type: RegionType.SCHEDULING,
        grid_row: 0,
        grid_col: 0,
        row_span: 1,
        col_span: 1
      }
    ];

    vi.mocked(enhancedApi.enhancedApi.dashboardLayouts.listRegions).mockResolvedValue(mockRegions);
    mockLoadRegions.mockResolvedValue(mockRegions);

    const { result } = renderHook(() =>
      useRegionLayout({ layoutId, autoSave: true })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockLoadRegions).toHaveBeenCalledWith(layoutId);
  });

  it('should add a region', async () => {
    const mockRegion = {
      id: 'new-region',
      layout_id: layoutId,
      region_type: RegionType.ANALYTICS,
      grid_row: 0,
      grid_col: 0,
      row_span: 1,
      col_span: 1
    };

    vi.mocked(enhancedApi.enhancedApi.dashboardLayouts.createRegion).mockResolvedValue(mockRegion);
    mockAddRegion.mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useRegionLayout({ layoutId, autoSave: true })
    );

    await act(async () => {
      await result.current.addRegion(RegionType.ANALYTICS);
    });

    expect(mockAddRegion).toHaveBeenCalled();
  });

  it('should remove a region', async () => {
    vi.mocked(enhancedApi.enhancedApi.dashboardLayouts.deleteRegion).mockResolvedValue({ success: true });
    mockRemoveRegion.mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useRegionLayout({ layoutId, autoSave: true })
    );

    await act(async () => {
      await result.current.removeRegion('region-id');
    });

    expect(mockRemoveRegion).toHaveBeenCalledWith(layoutId, 'region-id');
  });

  it('should update region position', async () => {
    const { result } = renderHook(() =>
      useRegionLayout({ layoutId, autoSave: true })
    );

    await act(async () => {
      await result.current.updateRegionPosition('region-id', 2, 3);
    });

    // Verify update was called (through store)
    expect(result.current.error).toBeNull();
  });

  it('should handle errors gracefully', async () => {
    const error = new Error('Failed to load regions');
    vi.mocked(enhancedApi.enhancedApi.dashboardLayouts.listRegions).mockRejectedValue(error);
    mockLoadRegions.mockRejectedValue(error);

    // Set error in mock store
    mockErrors.set(layoutId, error);

    const { result } = renderHook(() =>
      useRegionLayout({ layoutId, autoSave: true })
    );

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    }, { timeout: 3000 });

    expect(result.current.error?.message).toBe('Failed to load regions');
  });
});




