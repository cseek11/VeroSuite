import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { DashboardRegion, RegionType } from '@/routes/dashboard/types/region.types';
import { enhancedApi } from '@/lib/enhanced-api';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';
import { detectOverlap } from '@/lib/validation/region.schemas';
import { 
  createRegionWithOffline, 
  updateRegionWithOffline, 
  deleteRegionWithOffline,
  reorderRegionsWithOffline 
} from '@/services/offline-api-wrapper';

/**
 * Extended region interface with version for optimistic locking
 */
export interface VersionedRegion extends DashboardRegion {
  version?: number;
  optimistic?: boolean;
  pendingUpdate?: Partial<DashboardRegion>;
}

/**
 * Conflict resolution data
 */
export interface ConflictData {
  regionId: string;
  localVersion: DashboardRegion;
  serverVersion: DashboardRegion;
  localChanges: Partial<DashboardRegion>;
}

/**
 * Update queue entry for request coalescing
 */
interface QueuedUpdate {
  regionId: string;
  updates: Partial<DashboardRegion>;
  timestamp: number;
  retryCount: number;
}

/**
 * Region store state interface
 */
interface LayoutHistory {
  snapshots: VersionedRegion[][];
  currentIndex: number;
  maxSize: number;
}

interface RegionStoreState {
  // State
  regions: Map<string, VersionedRegion>;
  layouts: Map<string, { regions: string[]; loading: boolean }>;
  loading: Set<string>;
  errors: Map<string, Error>;
  conflicts: Map<string, ConflictData>;
  
  // Update queue for coalescing
  updateQueue: Map<string, QueuedUpdate[]>;
  flushTimer: NodeJS.Timeout | null;
  
  // Undo/Redo history per layout
  history: Map<string, LayoutHistory>;
  
  // Actions
  loadRegions: (layoutId: string) => Promise<void>;
  addRegion: (layoutId: string, type: RegionType, position?: { row: number; col: number }) => Promise<VersionedRegion>;
  updateRegion: (layoutId: string, regionId: string, updates: Partial<DashboardRegion>, optimistic?: boolean) => Promise<VersionedRegion>;
  removeRegion: (layoutId: string, regionId: string) => Promise<void>;
  reorderRegions: (layoutId: string, regionIds: string[]) => Promise<void>;
  
  // Conflict resolution
  resolveConflict: (regionId: string, resolution: 'local' | 'server' | 'merge') => Promise<void>;
  clearConflict: (regionId: string) => void;
  
  // Queue management
  flushUpdates: (layoutId: string) => Promise<void>;
  clearQueue: (layoutId: string) => void;
  
  // Undo/Redo
  undoLayout: (layoutId: string) => Promise<boolean>;
  redoLayout: (layoutId: string) => Promise<boolean>;
  canUndo: (layoutId: string) => boolean;
  canRedo: (layoutId: string) => boolean;
  saveLayoutSnapshot: (layoutId: string) => void;
  
  // Selectors
  getRegionsByLayout: (layoutId: string) => VersionedRegion[];
  getRegion: (regionId: string) => VersionedRegion | undefined;
  hasConflicts: () => boolean;
}

/**
 * Request coalescing queue manager
 */
class UpdateQueueManager {
  private queue: Map<string, QueuedUpdate[]> = new Map();
  private flushTimers: Map<string, NodeJS.Timeout> = new Map();
  private readonly FLUSH_DELAY = 500; // ms
  private readonly MAX_QUEUE_SIZE = 10;
  private readonly MAX_RETRIES = 3;

  enqueue(
    layoutId: string,
    regionId: string,
    updates: Partial<DashboardRegion>,
    onFlush: (regionId: string, merged: Partial<DashboardRegion>) => Promise<void>
  ) {
    const key = `${layoutId}:${regionId}`;
    
    if (!this.queue.has(key)) {
      this.queue.set(key, []);
    }
    
    const queue = this.queue.get(key)!;
    queue.push({
      regionId,
      updates,
      timestamp: Date.now(),
      retryCount: 0
    });
    
    // Flush immediately if queue is full
    if (queue.length >= this.MAX_QUEUE_SIZE) {
      this.flush(layoutId, regionId, onFlush);
    } else {
      // Schedule flush
      this.scheduleFlush(layoutId, regionId, onFlush);
    }
  }
  
  private scheduleFlush(
    layoutId: string,
    regionId: string,
    onFlush: (regionId: string, merged: Partial<DashboardRegion>) => Promise<void>
  ) {
    const key = `${layoutId}:${regionId}`;
    
    // Clear existing timer
    const existing = this.flushTimers.get(key);
    if (existing) {
      clearTimeout(existing);
    }
    
    // Schedule new flush
    const timer = setTimeout(() => {
      this.flush(layoutId, regionId, onFlush);
    }, this.FLUSH_DELAY);
    
    this.flushTimers.set(key, timer);
  }
  
  private async flush(
    layoutId: string,
    regionId: string,
    onFlush: (regionId: string, merged: Partial<DashboardRegion>) => Promise<void>
  ) {
    const key = `${layoutId}:${regionId}`;
    const queue = this.queue.get(key);
    
    if (!queue || queue.length === 0) return;
    
    // Clear timer
    const timer = this.flushTimers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.flushTimers.delete(key);
    }
    
    // Merge all updates
    const merged = queue.reduce((acc, entry) => {
      return { ...acc, ...entry.updates };
    }, {} as Partial<DashboardRegion>);
    
    try {
      await onFlush(regionId, merged);
      this.queue.delete(key);
    } catch (error) {
      // Don't retry 400 (Bad Request) errors - these are validation errors
      // Check multiple ways the status might be encoded
      const errorStatus = (error as any)?.status || 
                         (error as any)?.response?.status ||
                         (error instanceof Error && error.message.includes('HTTP 400') ? 400 : undefined);
      
      if (errorStatus === 400) {
        logger.error('Validation error - not retrying', { error, layoutId, regionId, errorStatus }, 'regionStore');
        
        // Show error to user
        let errorMessage = error instanceof Error ? error.message : 'Validation failed';
        // Extract the actual error message if it's in "HTTP 400: message" format
        if (errorMessage.startsWith('HTTP 400:')) {
          errorMessage = errorMessage.replace('HTTP 400:', '').trim();
        }
        if ((error as any)?.validationErrors && Array.isArray((error as any).validationErrors)) {
          const validationErrors = (error as any).validationErrors;
          errorMessage = `Validation failed:\n${validationErrors.map((e: string, i: number) => `  ${i + 1}. ${e}`).join('\n')}`;
        }
        toast.error(errorMessage, 8000);
        
        this.queue.delete(key);
        throw error;
      }
      
      // Retry logic with exponential backoff for other errors
      const firstEntry = queue[0];
      if (firstEntry.retryCount < this.MAX_RETRIES) {
        firstEntry.retryCount++;
        const backoffDelay = Math.pow(2, firstEntry.retryCount) * 1000;
        
        setTimeout(() => {
          this.flush(layoutId, regionId, onFlush);
        }, backoffDelay);
      } else {
        // Max retries exceeded, clear queue
        logger.error('Update queue max retries exceeded', { error, layoutId, regionId }, 'regionStore');
        
        // Show error to user
        let errorMessage = error instanceof Error ? error.message : 'Failed to update region after multiple attempts';
        if ((error as any)?.validationErrors && Array.isArray((error as any).validationErrors)) {
          const validationErrors = (error as any).validationErrors;
          errorMessage = `Validation failed:\n${validationErrors.map((e: string, i: number) => `  ${i + 1}. ${e}`).join('\n')}`;
        }
        toast.error(errorMessage, 10000); // Show for 10 seconds for critical errors
        
        this.queue.delete(key);
        throw error;
      }
    }
  }
  
  clear(layoutId: string, regionId: string) {
    const key = `${layoutId}:${regionId}`;
    const timer = this.flushTimers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.flushTimers.delete(key);
    }
    this.queue.delete(key);
  }
}

const queueManager = new UpdateQueueManager();

/**
 * Region store with optimistic locking and conflict resolution
 */
export const useRegionStore = create<RegionStoreState>()(
  devtools(
    persist(
      subscribeWithSelector(
        ((set, get) => ({
          // Initial state
          regions: new Map(),
          layouts: new Map(),
          loading: new Set(),
          errors: new Map(),
          conflicts: new Map(),
          updateQueue: new Map(),
          flushTimer: null,
          history: new Map(),
          
          // Load regions for a layout
          loadRegions: async (layoutId: string) => {
            set((state) => {
              const newLoading = new Set(state.loading);
              newLoading.add(layoutId);
              const newLayouts = new Map(state.layouts);
              if (!newLayouts.has(layoutId)) {
                newLayouts.set(layoutId, { regions: [], loading: true });
              }
              return { ...state, loading: newLoading, layouts: newLayouts };
            });
            
            try {
              const data = await enhancedApi.dashboardLayouts.listRegions(layoutId);
              const regions = (data as DashboardRegion[]).map(r => ({
                ...r,
                version: (r as any).version || 1,
                optimistic: false
              } as VersionedRegion));
              
              set((state) => {
                const newRegions = new Map(state.regions);
                regions.forEach(region => {
                  newRegions.set(region.id, region);
                });
                
                const newLayouts = new Map(state.layouts);
                const layout = newLayouts.get(layoutId);
                if (layout) {
                  newLayouts.set(layoutId, {
                    ...layout,
                    regions: regions.map(r => r.id),
                    loading: false
                  });
                }
                
                const newLoading = new Set(state.loading);
                newLoading.delete(layoutId);
                const newErrors = new Map(state.errors);
                newErrors.delete(layoutId);
                
                return {
                  ...state,
                  regions: newRegions,
                  layouts: newLayouts,
                  loading: newLoading,
                  errors: newErrors
                };
              });
              
              // Save initial snapshot after loading regions
              // This allows users to undo back to the loaded state
              get().saveLayoutSnapshot(layoutId);
            } catch (error) {
              const err = error instanceof Error ? error : new Error('Failed to load regions');
              set((state) => {
                const newLoading = new Set(state.loading);
                newLoading.delete(layoutId);
                const newErrors = new Map(state.errors);
                newErrors.set(layoutId, err);
                return { ...state, loading: newLoading, errors: newErrors };
              });
              throw err;
            }
          },
          
          // Add a new region
          addRegion: async (layoutId: string, type: RegionType, position?: { row: number; col: number }) => {
            if (!layoutId || layoutId.trim() === '') {
              const error = new Error('Layout ID is required to add a region');
              logger.error('Cannot add region: layoutId is missing', { layoutId, type }, 'regionStore');
              throw error;
            }
            
            const state = get();
            const existingRegions = state.getRegionsByLayout(layoutId);
            
            // Calculate position
            let gridRow = position?.row ?? 0;
            let gridCol = position?.col ?? 0;
            
            // Map existing regions for overlap checking
            const existingRegionsForCheck = existingRegions.map(r => ({
              id: r.id,
              grid_row: r.grid_row,
              grid_col: r.grid_col,
              row_span: r.row_span,
              col_span: r.col_span
            }));
            
            // Helper function to check if a position is valid
            const isValidPosition = (row: number, col: number, rowSpan: number = 1, colSpan: number = 1): boolean => {
              // Check bounds
              if (col < 0 || col >= 12 || col + colSpan > 12) return false;
              if (row < 0) return false;
              
              // Check overlap
              return !detectOverlap(
                { grid_row: row, grid_col: col, row_span: rowSpan, col_span: colSpan },
                existingRegionsForCheck,
                undefined
              );
            };
            
            if (!position) {
              // Find first available position that doesn't overlap with existing regions
              let found = false;
              
              for (let row = 0; row < 20 && !found; row++) {
                for (let col = 0; col < 12 && !found; col++) {
                  if (isValidPosition(row, col)) {
                    gridRow = row;
                    gridCol = col;
                    found = true;
                  }
                }
              }
              
              if (!found) {
                // No valid position found - throw error instead of falling back
                const error = new Error('No space left for a new region in this layout. Please remove some regions or resize existing ones.');
                logger.error('Cannot add region: no valid position found', { existingRegionsCount: existingRegions.length, maxRow: 20 }, 'regionStore');
                throw error;
              }
            } else {
              // Validate provided position
              if (!isValidPosition(gridRow, gridCol)) {
                // Find alternative position near the requested one
                let found = false;
                for (let offset = 1; offset <= 5 && !found; offset++) {
                  // Try positions around the requested one
                  const positions = [
                    [gridRow, gridCol + offset],
                    [gridRow, gridCol - offset],
                    [gridRow + offset, gridCol],
                    [gridRow - offset, gridCol]
                  ];
                  
                  for (const [r, c] of positions) {
                    if (isValidPosition(r, c)) {
                      gridRow = r;
                      gridCol = c;
                      found = true;
                      logger.warn('Requested position overlaps, using alternative', { requested: position, actual: { row: gridRow, col: gridCol } }, 'regionStore');
                      break;
                    }
                  }
                }
                
                if (!found) {
                  // Last resort: find any valid position
                  for (let row = 0; row < 20 && !found; row++) {
                    for (let col = 0; col < 12 && !found; col++) {
                      if (isValidPosition(row, col)) {
                        gridRow = row;
                        gridCol = col;
                        found = true;
                      }
                    }
                  }
                }
              }
            }
            
            // Ensure position is within bounds (final safety check)
            gridRow = Math.max(0, gridRow);
            gridCol = Math.max(0, Math.min(gridCol, 11)); // Max column is 11 (0-indexed)
            
            // Final validation before creating
            if (!isValidPosition(gridRow, gridCol)) {
              const error = new Error(`Cannot create region: position (${gridRow}, ${gridCol}) overlaps with existing regions`);
              logger.error('Invalid position for new region', { gridRow, gridCol, existingRegionsCount: existingRegions.length }, 'regionStore');
              throw error;
            }
            
            const newRegion: Partial<DashboardRegion> = {
              region_type: type,
              grid_row: gridRow,
              grid_col: gridCol,
              row_span: 1,
              col_span: 1,
              min_width: 200,
              min_height: 150,
              is_collapsed: false,
              is_locked: false,
              is_hidden_mobile: false,
              config: {},
              widget_config: {},
              display_order: existingRegions.length
            };
            
            try {
              const created = await createRegionWithOffline(layoutId, newRegion);
              const versionedRegion: VersionedRegion = {
                ...(created as DashboardRegion),
                version: (created as any).version || 1,
                optimistic: false
              };
              
              set((state) => {
                const newRegions = new Map(state.regions);
                newRegions.set(versionedRegion.id, versionedRegion);
                
                const newLayouts = new Map(state.layouts);
                const layout = newLayouts.get(layoutId);
                if (layout) {
                  newLayouts.set(layoutId, {
                    ...layout,
                    regions: [...layout.regions, versionedRegion.id]
                  });
                }
                
                return { ...state, regions: newRegions, layouts: newLayouts };
              });
              
              // Save snapshot after successful add
              get().saveLayoutSnapshot(layoutId);
              
              return versionedRegion;
            } catch (error) {
              const err = error instanceof Error ? error : new Error('Failed to add region');
              logger.error('Failed to add region', { error, layoutId, type, newRegion }, 'regionStore');
              
              // Extract validation errors if available
              if ((error as any)?.validationErrors) {
                logger.error('Validation errors', { validationErrors: (error as any).validationErrors }, 'regionStore');
              }
              
              throw err;
            }
          },
          
          // Update region with optimistic locking
          updateRegion: async (
            layoutId: string,
            regionId: string,
            updates: Partial<DashboardRegion>,
            optimistic: boolean = true
          ) => {
            const state = get();
            const region = state.regions.get(regionId);
            
            if (!region) {
              throw new Error(`Region ${regionId} not found`);
            }
            
            // Optimistic update
            if (optimistic) {
              set((state) => {
                const current = state.regions.get(regionId);
                if (current) {
                  const newRegions = new Map(state.regions);
                  newRegions.set(regionId, {
                    ...current,
                    ...updates,
                    optimistic: true,
                    pendingUpdate: { ...current.pendingUpdate, ...updates }
                  });
                  return { ...state, regions: newRegions };
                }
                return state;
              });
              
              // Queue for coalescing
              queueManager.enqueue(layoutId, regionId, updates, async (id, merged) => {
                const currentState = get();
                const currentRegion = currentState.regions.get(id);
                
                if (!currentRegion) return;
                
                try {
                  // Sanitize and normalize config if present
                  const sanitizedUpdates = { ...merged };
                  if (sanitizedUpdates.config) {
                    const { sanitizeRegionConfig } = await import('@/lib/sanitization');
                    sanitizedUpdates.config = sanitizeRegionConfig(sanitizedUpdates.config);
                  }
                  
                  // Send with version for optimistic locking
                  const result = await updateRegionWithOffline(
                    layoutId,
                    id,
                    {
                      ...sanitizedUpdates,
                      version: currentRegion.version
                    }
                  );
                  
                  const updated: VersionedRegion = {
                    ...(result as DashboardRegion),
                    version: (result as any).version || (currentRegion.version || 1) + 1,
                    optimistic: false,
                    pendingUpdate: undefined
                  };
                  
                  set((state) => {
                    const newRegions = new Map(state.regions);
                    newRegions.set(id, updated);
                    return { ...state, regions: newRegions };
                  });
                  
                  // Save snapshot after successful update
                  get().saveLayoutSnapshot(layoutId);
                  
                  return updated;
                } catch (error: any) {
                  // Handle conflict
                  if (error?.status === 409 || error?.code === 'CONFLICT') {
                    // Fetch latest version
                    const latest = await enhancedApi.dashboardLayouts.listRegions(layoutId);
                    const serverRegion = (latest as DashboardRegion[]).find(r => r.id === id);
                    
                    if (serverRegion) {
                      set((state) => {
                        const local = state.regions.get(id);
                        if (local) {
                          const newConflicts = new Map(state.conflicts);
                          newConflicts.set(id, {
                            regionId: id,
                            localVersion: local,
                            serverVersion: serverRegion as DashboardRegion,
                            localChanges: merged
                          });
                          return { ...state, conflicts: newConflicts };
                        }
                        return state;
                      });
                    }
                  } else {
                    // Rollback optimistic update
                    // Show user-friendly error message
                    let errorMessage = error instanceof Error ? error.message : 'Failed to update region';
                    if ((error as any)?.validationErrors && Array.isArray((error as any).validationErrors)) {
                      const validationErrors = (error as any).validationErrors;
                      errorMessage = `Validation failed:\n${validationErrors.map((e: string, i: number) => `  ${i + 1}. ${e}`).join('\n')}`;
                    }
                    toast.error(errorMessage, 8000); // Show for 8 seconds for validation errors
                    
                    set((state) => {
                      const current = state.regions.get(id);
                      if (current) {
                        const newRegions = new Map(state.regions);
                        newRegions.set(id, {
                          ...current,
                          ...region, // Revert to original
                          optimistic: false,
                          pendingUpdate: undefined
                        });
                        return { ...state, regions: newRegions };
                      }
                      return state;
                    });
                  }
                  throw error;
                }
              });
              
              // Return optimistic version
              return get().regions.get(regionId)!;
            } else {
              // Direct update without optimistic locking
              try {
                const result = await enhancedApi.dashboardLayouts.updateRegion(
                  layoutId,
                  regionId,
                  {
                    ...updates,
                    version: region.version
                  }
                );
                
                const updated: VersionedRegion = {
                  ...(result as DashboardRegion),
                  version: (result as any).version || (region.version || 1) + 1,
                  optimistic: false
                };
                
                set((state) => {
                  const newRegions = new Map(state.regions);
                  newRegions.set(regionId, updated);
                  return { ...state, regions: newRegions };
                });
                
                return updated;
              } catch (error: any) {
                if (error?.status === 409 || error?.code === 'CONFLICT') {
                  const latest = await enhancedApi.dashboardLayouts.listRegions(layoutId);
                  const serverRegion = (latest as DashboardRegion[]).find(r => r.id === regionId);
                  
                  if (serverRegion) {
                    set((state) => {
                      const local = state.regions.get(regionId);
                      if (local) {
                        const newConflicts = new Map(state.conflicts);
                        newConflicts.set(regionId, {
                          regionId,
                          localVersion: local,
                          serverVersion: serverRegion as DashboardRegion,
                          localChanges: updates
                        });
                        return { ...state, conflicts: newConflicts };
                      }
                      return state;
                    });
                  }
                }
                throw error;
              }
            }
          },
          
          // Remove region
          removeRegion: async (layoutId: string, regionId: string) => {
            const state = get();
            const regionToRemove = state.regions.get(regionId);
            
            if (!regionToRemove) {
              throw new Error(`Region ${regionId} not found`);
            }
            
            // Optimistic removal
            set((state) => {
              const newRegions = new Map(state.regions);
              newRegions.delete(regionId);
              
              const newLayouts = new Map(state.layouts);
              const layout = newLayouts.get(layoutId);
              if (layout) {
                newLayouts.set(layoutId, {
                  ...layout,
                  regions: layout.regions.filter(id => id !== regionId)
                });
              }
              
              return { ...state, regions: newRegions, layouts: newLayouts };
            });
            
            // Clear any pending updates
            queueManager.clear(layoutId, regionId);
            
            try {
              await deleteRegionWithOffline(layoutId, regionId);
              
              // Save snapshot after successful remove
              get().saveLayoutSnapshot(layoutId);
            } catch (error) {
              // Rollback on error
              set((state) => {
                const newRegions = new Map(state.regions);
                newRegions.set(regionId, regionToRemove);
                
                const newLayouts = new Map(state.layouts);
                const layout = newLayouts.get(layoutId);
                if (layout) {
                  newLayouts.set(layoutId, {
                    ...layout,
                    regions: [...layout.regions, regionId]
                  });
                }
                
                return { ...state, regions: newRegions, layouts: newLayouts };
              });
              
              const err = error instanceof Error ? error : new Error('Failed to remove region');
              logger.error('Failed to remove region', { error, layoutId, regionId }, 'regionStore');
              toast.error(`Failed to remove region: ${err.message}`);
              throw err;
            }
          },
          
          // Reorder regions
          reorderRegions: async (layoutId: string, regionIds: string[]) => {
            try {
              await reorderRegionsWithOffline(layoutId, regionIds);
              
              set((state) => {
                const newLayouts = new Map(state.layouts);
                const layout = newLayouts.get(layoutId);
                if (layout) {
                  newLayouts.set(layoutId, {
                    ...layout,
                    regions: regionIds
                  });
                }
                return { ...state, layouts: newLayouts };
              });
            } catch (error) {
              const err = error instanceof Error ? error : new Error('Failed to reorder regions');
              logger.error('Failed to reorder regions', { error, layoutId }, 'regionStore');
              throw err;
            }
          },
          
          // Conflict resolution
          resolveConflict: async (regionId: string, resolution: 'local' | 'server' | 'merge') => {
            const state = get();
            const conflict = state.conflicts.get(regionId);
            
            if (!conflict) {
              return;
            }
            
            const layoutId = conflict.localVersion.layout_id;
            let resolved: VersionedRegion;
            
            switch (resolution) {
              case 'local':
                // Apply local changes to server version
                resolved = {
                  ...conflict.serverVersion,
                  ...conflict.localChanges,
                  version: (conflict.serverVersion as any).version || 1,
                  optimistic: false
                };
                break;
              case 'server':
                // Use server version
                resolved = {
                  ...conflict.serverVersion,
                  version: (conflict.serverVersion as any).version || 1,
                  optimistic: false
                };
                break;
              case 'merge':
                // Merge both versions (prefer server for conflicts)
                resolved = {
                  ...conflict.serverVersion,
                  ...conflict.localChanges,
                  version: (conflict.serverVersion as any).version || 1,
                  optimistic: false
                };
                break;
            }
            
            try {
              const result = await enhancedApi.dashboardLayouts.updateRegion(
                layoutId,
                regionId,
                {
                  ...resolved,
                  version: resolved.version
                }
              );
              
              const updated: VersionedRegion = {
                ...(result as DashboardRegion),
                version: (result as any).version || (resolved.version || 1) + 1,
                optimistic: false
              };
              
              set((state) => {
                const newRegions = new Map(state.regions);
                newRegions.set(regionId, updated);
                const newConflicts = new Map(state.conflicts);
                newConflicts.delete(regionId);
                return { ...state, regions: newRegions, conflicts: newConflicts };
              });
            } catch (error) {
              logger.error('Failed to resolve conflict', { error, regionId, resolution }, 'regionStore');
              throw error;
            }
          },
          
          clearConflict: (regionId: string) => {
            set((state) => {
              const newConflicts = new Map(state.conflicts);
              newConflicts.delete(regionId);
              return { ...state, conflicts: newConflicts };
            });
          },
          
          // Flush updates
          flushUpdates: async (layoutId: string) => {
            // This is handled by the queue manager
            // But we can force flush all pending updates for a layout
            const state = get();
            const layout = state.layouts.get(layoutId);
            
            if (layout) {
              for (const regionId of layout.regions) {
                const region = state.regions.get(regionId);
                if (region?.optimistic && region.pendingUpdate) {
                  await get().updateRegion(layoutId, regionId, region.pendingUpdate, false);
                }
              }
            }
          },
          
          clearQueue: (layoutId: string) => {
            const state = get();
            const layout = state.layouts.get(layoutId);
            
            if (layout) {
              for (const regionId of layout.regions) {
                queueManager.clear(layoutId, regionId);
              }
            }
          },
          
          // Undo/Redo
          saveLayoutSnapshot: (layoutId: string) => {
            const state = get();
            const regions = state.getRegionsByLayout(layoutId);
            
            // Create deep copy of regions for snapshot
            const snapshot = regions.map(region => ({
              ...region,
              // Remove optimistic flags and pending updates from snapshot
              optimistic: false,
              pendingUpdate: undefined
            }));
            
            set((state) => {
              const history = state.history.get(layoutId) || {
                snapshots: [],
                currentIndex: -1,
                maxSize: 50
              };
              
              // Remove any snapshots after current index (if user undid and made new changes)
              const newSnapshots = history.snapshots.slice(0, history.currentIndex + 1);
              
              // Add new snapshot
              newSnapshots.push(snapshot);
              
              // Limit history size
              if (newSnapshots.length > history.maxSize) {
                newSnapshots.shift();
              }
              
              const newHistory = new Map(state.history);
              newHistory.set(layoutId, {
                snapshots: newSnapshots,
                currentIndex: newSnapshots.length - 1,
                maxSize: history.maxSize
              });
              
              return { ...state, history: newHistory };
            });
          },
          
          undoLayout: async (layoutId: string) => {
            try {
              // Call backend API to undo layout
              const result = await enhancedApi.dashboardLayouts.undoLayout(layoutId);
              
              // Update local state with server response
              set((state) => {
                const newRegions = new Map(state.regions);
                const newLayouts = new Map(state.layouts);
                
                // Get current layout
                const layout = newLayouts.get(layoutId);
                if (!layout) {
                  logger.warn('Layout not found in state', { layoutId }, 'regionStore');
                  return state;
                }
                
                // Remove all current regions for this layout
                layout.regions.forEach(regionId => {
                  newRegions.delete(regionId);
                });
                
                // Add regions from server response
                result.regions.forEach((region: any) => {
                  newRegions.set(region.id, region);
                });
                
                // Update layout with new region IDs
                newLayouts.set(layoutId, {
                  ...layout,
                  regions: result.regions.map((r: any) => r.id)
                });
                
                return {
                  ...state,
                  regions: newRegions,
                  layouts: newLayouts,
                  layoutVersions: new Map(state.layoutVersions).set(layoutId, result.version)
                };
              });
              
              logger.info('Layout undone successfully', { layoutId, version: result.version }, 'regionStore');
              toast.success('Changes undone');
              return true;
            } catch (error) {
              logger.error('Failed to undo layout', { error, layoutId }, 'regionStore');
              toast.error('Failed to undo changes');
              return false;
            }
          },
          
          redoLayout: async (layoutId: string) => {
            try {
              // Call backend API to redo layout
              const result = await enhancedApi.dashboardLayouts.redoLayout(layoutId);
              
              // Update local state with server response
              set((state) => {
                const newRegions = new Map(state.regions);
                const newLayouts = new Map(state.layouts);
                
                // Get current layout
                const layout = newLayouts.get(layoutId);
                if (!layout) {
                  logger.warn('Layout not found in state', { layoutId }, 'regionStore');
                  return state;
                }
                
                // Remove all current regions for this layout
                layout.regions.forEach(regionId => {
                  newRegions.delete(regionId);
                });
                
                // Add regions from server response
                result.regions.forEach((region: any) => {
                  newRegions.set(region.id, region);
                });
                
                // Update layout with new region IDs
                newLayouts.set(layoutId, {
                  ...layout,
                  regions: result.regions.map((r: any) => r.id)
                });
                
                return {
                  ...state,
                  regions: newRegions,
                  layouts: newLayouts,
                  layoutVersions: new Map(state.layoutVersions).set(layoutId, result.version)
                };
              });
              
              logger.info('Layout redone successfully', { layoutId, version: result.version }, 'regionStore');
              toast.success('Changes redone');
              return true;
            } catch (error) {
              logger.error('Failed to redo layout', { error, layoutId }, 'regionStore');
              toast.error('Failed to redo changes');
              return false;
            }
          },
          
          canUndo: (layoutId: string) => {
            const state = get();
            const history = state.history.get(layoutId);
            
            if (!history) {
              return false;
            }
            
            return history.currentIndex > 0;
          },
          
          canRedo: (layoutId: string) => {
            const state = get();
            const history = state.history.get(layoutId);
            
            if (!history) {
              return false;
            }
            
            return history.currentIndex < history.snapshots.length - 1;
          },
          
          // Selectors
          getRegionsByLayout: (layoutId: string) => {
            const state = get();
            const layout = state.layouts.get(layoutId);
            if (!layout) return [];
            
            return layout.regions
              .map(id => state.regions.get(id))
              .filter((r): r is VersionedRegion => r !== undefined);
          },
          
          getRegion: (regionId: string) => {
            return get().regions.get(regionId);
          },
          
          hasConflicts: () => {
            return get().conflicts.size > 0;
          }
        })) as any
      ),
      {
        name: 'region-storage',
        partialize: (_state) => ({
          // Only persist certain fields, not the full state
          // Regions are loaded fresh on mount
        })
      }
    ),
    { name: 'Region Store' }
  )
);

