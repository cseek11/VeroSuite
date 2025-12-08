import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Undo, Redo, ZoomIn, ZoomOut, MoreVertical, Download, Upload, RotateCcw } from 'lucide-react';
import { useRegionLayout } from '@/hooks/useRegionLayout';
import { useLayoutVersioning } from '@/hooks/useLayoutVersioning';
import { useZoomPan } from '@/hooks/useZoomPan';
import { useRegionStore } from '@/stores/regionStore';
import { useLayoutIntelligence } from '@/hooks/useLayoutIntelligence';
import { RegionGrid } from '@/components/dashboard/regions/RegionGrid';
import { VirtualizedRegionGrid } from '@/components/dashboard/regions/VirtualizedRegionGrid';
import { MinimizedRegionDock } from '@/components/dashboard/regions/MinimizedRegionDock';
import { MobileDashboard } from '@/components/dashboard/regions/MobileDashboard';
import { FloatingNavBar } from '@/components/dashboard/layered-ui/FloatingNavBar';
import { UtilityDock } from '@/components/dashboard/layered-ui/UtilityDock';
import { CommandPalette } from '@/components/dashboard/layered-ui/CommandPalette';
import { InspectorPanel } from '@/components/dashboard/layered-ui/InspectorPanel';
import { Command } from '@/hooks/useCommandPalette';
import { DashboardRegion, RegionType } from '@/routes/dashboard/types/region.types';
import { enhancedApi } from '@/lib/enhanced-api';
import { logger } from '@/utils/logger';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { toast } from '@/utils/toast';
import { ConflictResolutionDialog } from '@/components/dashboard/regions/ConflictResolutionDialog';
import { useFeatureFlag } from '@/lib/featureFlags';
import { DashboardOnboarding } from '@/components/dashboard/onboarding/DashboardOnboarding';
import { EmptyDashboard } from '@/components/dashboard/EmptyDashboard';
import { OfflineIndicator } from '@/components/dashboard/OfflineIndicator';
import { TemplateManager } from '@/components/dashboard/templates/TemplateManager';

interface RegionDashboardProps {
  layoutId: string;
  userId: string;
}

export const RegionDashboard: React.FC<RegionDashboardProps> = ({
  layoutId,
  userId: _userId
}) => {
  const [currentLayoutId, setCurrentLayoutId] = useState<string | null>(null);
  const [loadingLayout, setLoadingLayout] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Load default layout on mount
  useEffect(() => {
    const loadDefaultLayout = async () => {
      try {
        setLoadingLayout(true);
        if (!layoutId || layoutId.trim() === '') {
          const layout = await enhancedApi.dashboardLayouts.getOrCreateDefault();
          if (layout?.id) {
            setCurrentLayoutId(layout.id);
          } else {
            throw new Error('Failed to get or create default layout');
          }
        } else {
          setCurrentLayoutId(layoutId);
        }
      } catch (error) {
        logger.error('Failed to load layout', { error, layoutId }, 'RegionDashboard');
      } finally {
        setLoadingLayout(false);
      }
    };

    loadDefaultLayout();
  }, [layoutId]);

  const {
    regions,
    loading: regionsLoading,
    error: regionsError,
    addRegion,
    removeRegion,
    updateRegionPosition,
    updateRegionSize,
    toggleCollapse,
    toggleLock,
    loadRoleDefaults,
    updateRegion: updateRegionInStore
  } = useRegionLayout({
    layoutId: currentLayoutId || '',
    autoSave: true,
    debounceMs: 500
  });

  const {
    versions: _versions,
    loading: _versionsLoading,
    currentVersion: _currentVersion,
    createVersion: _createVersion,
    publishVersion: _publishVersion,
    revertToVersion: _revertToVersion,
    loadVersions: _loadVersions
  } = useLayoutVersioning({
    layoutId: currentLayoutId || ''
  });

  const [showAddRegionDialog, setShowAddRegionDialog] = useState(false);
  const [minimizedRegions, _setMinimizedRegions] = useState<Map<string, { row: number; col: number }>>(new Map());
  const [utilityDockVisible, _setUtilityDockVisible] = useState(true);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [inspectorContent, setInspectorContent] = useState<React.ReactNode>(null);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [advancedFilters, setAdvancedFilters] = useState<{
    types: RegionType[];
    status: 'all' | 'active' | 'locked' | 'collapsed';
    dateRange: 'all' | 'today' | 'week' | 'month';
  }>({
    types: [],
    status: 'all',
    dateRange: 'all'
  });
  
  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [showTemplateManager, setShowTemplateManager] = useState(false);
  
  // Check if user has completed onboarding
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('dashboard_onboarding_complete');
    const hasRegions = regions.length > 0;
    
    // Show onboarding if not completed and no regions
    if (!hasCompletedOnboarding && !hasRegions && !loadingLayout && !regionsLoading) {
      setShowOnboarding(true);
    }
    
    // Show empty state if no regions but onboarding completed
    if (hasCompletedOnboarding && !hasRegions && !loadingLayout && !regionsLoading) {
      setShowEmptyState(true);
    } else {
      setShowEmptyState(false);
    }
  }, [regions.length, loadingLayout, regionsLoading]);
  
  // Mobile detection and feature flag
  const [isMobile, setIsMobile] = useState(false);
  const mobileBetaEnabled = useFeatureFlag('DASHBOARD_MOBILE_BETA') as boolean;
  
  // Virtualization feature flag and threshold
  const virtualizationEnabled = useFeatureFlag('DASHBOARD_VIRTUALIZATION') as boolean;
  const VIRTUALIZATION_THRESHOLD = 50; // Use virtualization when > 50 regions
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Conflict resolution
  const conflicts = useRegionStore((state) => Array.from(state.conflicts.values()));
  const resolveConflict = useRegionStore((state) => state.resolveConflict);
  const clearConflict = useRegionStore((state) => state.clearConflict);
  
  // Undo/Redo from store
  const saveLayoutSnapshot = useRegionStore((state) => state.saveLayoutSnapshot);
  const undoLayout = useRegionStore((state) => state.undoLayout);
  const redoLayout = useRegionStore((state) => state.redoLayout);
  const canUndoStore = useRegionStore((state) => state.canUndo);
  const canRedoStore = useRegionStore((state) => state.canRedo);
  
  const [searchTerm, setSearchTerm] = useState('');

  // Zoom and pan functionality
  const { containerRef, zoom, zoomIn, zoomOut, resetView, handlePanStart, getTransformStyle, calculateCanvasSize } = useZoomPan();
  
  // Track scroll state from the scroll container
  useEffect(() => {
    const el = containerRef.current as HTMLDivElement | null;
    if (!el) return;
    const onScroll = () => setIsScrolled((el.scrollTop || 0) > 100);
    onScroll();
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, [containerRef]);
  
  // Calculate canvas bounds from regions
  const canvasBounds = useMemo(() => {
    if (regions.length === 0) {
      return { width: 0, height: 0, minX: 0, minY: 0, maxX: 0, maxY: 0 };
    }
    
    const rowHeight = 100;
    const colWidth = 100; // Approximate based on rowHeight
    const gap = 16;
    
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    regions.forEach(region => {
      const x = region.grid_col * (colWidth + gap);
      const y = region.grid_row * (rowHeight + gap);
      const width = region.col_span * (colWidth + gap) - gap;
      const height = region.row_span * (rowHeight + gap) - gap;
      
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + width);
      maxY = Math.max(maxY, y + height);
    });
    
    return {
      width: maxX - minX,
      height: maxY - minY,
      minX: minX === Infinity ? 0 : minX,
      minY: minY === Infinity ? 0 : minY,
      maxX: maxX === -Infinity ? 0 : maxX,
      maxY: maxY === -Infinity ? 0 : maxY
    };
  }, [regions]);
  
  // Calculate dynamic canvas size
  const canvasSize = useMemo(() => {
    return calculateCanvasSize(canvasBounds);
  }, [canvasBounds, calculateCanvasSize]);

  // Memoize filtered regions for performance
  const filteredRegions = useMemo(() => {
    return regions.filter(r => {
      // Apply advanced status filter
      if (advancedFilters.status !== 'all') {
        if (advancedFilters.status === 'active' && r.is_locked) return false;
        if (advancedFilters.status === 'locked' && !r.is_locked) return false;
        if (advancedFilters.status === 'collapsed' && !r.is_collapsed) return false;
      }
      
      // Filter out collapsed regions (unless specifically filtering for them)
      if (r.is_collapsed && advancedFilters.status !== 'collapsed') return false;
      
      // Apply region type filter
      if (advancedFilters.types.length > 0 && !advancedFilters.types.includes(r.region_type)) {
        return false;
      }
      
      // Apply date range filter
      if (advancedFilters.dateRange !== 'all') {
        const now = new Date();
        const regionDate = new Date(r.updated_at || r.created_at);
        const diffMs = now.getTime() - regionDate.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        
        if (advancedFilters.dateRange === 'today' && diffDays >= 1) return false;
        if (advancedFilters.dateRange === 'week' && diffDays >= 7) return false;
        if (advancedFilters.dateRange === 'month' && diffDays >= 30) return false;
      }
      
      // Apply search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesSearch = 
          r.region_type.toLowerCase().includes(term) ||
          (r.config?.title && r.config.title.toLowerCase().includes(term)) ||
          (r.config?.description && r.config.description.toLowerCase().includes(term));
        if (!matchesSearch) return false;
      }
      
      // Apply legacy active filters (for backward compatibility)
      if (activeFilters.has('active') && r.is_locked) return false;
      if (activeFilters.has('locked') && !r.is_locked) return false;
      
      return true;
    });
  }, [regions, searchTerm, activeFilters, advancedFilters]);

  const shouldUseVirtualization = virtualizationEnabled && filteredRegions.length > VIRTUALIZATION_THRESHOLD;

  // Undo/Redo functionality
  // Use store's undo/redo methods (already defined above)

  // Layout Intelligence
  const { mode: _mode, setMode: _setMode, suggestedLayout: _suggestedLayout, optimizeLayout: _optimizeLayout, getContextualBehavior: _getContextualBehavior } = useLayoutIntelligence({
    regions,
    userRole: 'user', // TODO: Get from auth store
    currentTime: new Date(),
    workloadMetrics: {
      activeJobs: 0, // TODO: Get from API
      pendingTasks: 0,
      peakHours: new Date().getHours() >= 8 && new Date().getHours() <= 18
    }
  });

  // Save state to history when regions change (debounced)
  useEffect(() => {
    if (!(regions.length > 0 && currentLayoutId)) {
      return;
    }
    const timer = setTimeout(() => {
      saveLayoutSnapshot(currentLayoutId);
    }, 500); // Debounce snapshot saving
    return () => clearTimeout(timer);
  }, [regions, currentLayoutId, saveLayoutSnapshot]);

  // Handle undo/redo using store methods
  const handleUndo = async () => {
    if (!currentLayoutId) return;
    try {
      const success = await undoLayout(currentLayoutId);
      if (success) {
        toast.success('Undone');
      } else {
        toast.info('Nothing to undo');
      }
    } catch (error) {
      logger.error('Failed to undo', { error }, 'RegionDashboard');
      toast.error('Failed to undo');
    }
  };

  const handleRedo = async () => {
    if (!currentLayoutId) return;
    try {
      const success = await redoLayout(currentLayoutId);
      if (success) {
        toast.success('Redone');
      } else {
        toast.info('Nothing to redo');
      }
    } catch (error) {
      logger.error('Failed to redo', { error }, 'RegionDashboard');
      toast.error('Failed to redo');
    }
  };

  const handleResetAll = async () => {
    if (window.confirm('Are you sure you want to reset all regions? This cannot be undone.')) {
      try {
        // Reset zoom and pan
        resetView();
        // Clear all current regions first
        const currentRegions = [...regions];
        for (const region of currentRegions) {
          await removeRegion(region.id);
        }
        // Wait a bit for deletions to complete
        await new Promise(resolve => setTimeout(resolve, 500));
        // Reset to default layout
        await loadRoleDefaults('default');
        toast.success('Dashboard reset successfully');
      } catch (error) {
        logger.error('Failed to reset all', { error }, 'RegionDashboard');
        toast.error('Failed to reset dashboard');
      }
    }
  };

  const handleAddRegion = async (type?: RegionType | string, position?: { row: number; col: number }) => {
    try {
      if (!currentLayoutId || currentLayoutId.trim() === '') {
        toast.error('Cannot add region: Layout is not loaded yet. Please wait...');
        logger.error('Cannot add region: currentLayoutId is missing', { currentLayoutId }, 'RegionDashboard');
        return;
      }
      
      if (type) {
        // Preserve scroll position of the scroll container
        const scrollTop = (containerRef.current as HTMLDivElement | null)?.scrollTop || 0;
        await addRegion(type as RegionType, position);
        setShowAddRegionDialog(false);
        toast.success('Region added successfully');
        // Restore scroll after render
        requestAnimationFrame(() => {
          if (containerRef.current) {
            (containerRef.current as HTMLDivElement).scrollTop = scrollTop;
          }
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add region';
      logger.error('Failed to add region', { error, type, position, currentLayoutId }, 'RegionDashboard');
      
      // Extract validation errors if available
      let fullMessage = errorMessage;
      if ((error as any)?.validationErrors && Array.isArray((error as any).validationErrors)) {
        fullMessage = `${errorMessage}\n\n${(error as any).validationErrors.map((e: string, i: number) => `  ${i + 1}. ${e}`).join('\n')}`;
      }
      
      toast.error(`Failed to add region: ${fullMessage}`, 8000);
    }
  };

  const handleUpdateRegion = async (id: string, updates: Partial<DashboardRegion>) => {
    try {
      // Use store's updateRegion method (handles optimistic updates, queuing, and conflict resolution)
      await updateRegionInStore(id, updates);
      // No need to reload - store handles optimistic updates and syncs automatically
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update region';
      logger.error('Failed to update region', { error, regionId: id, updates }, 'RegionDashboard');
      toast.error(`Failed to update region: ${errorMessage}`);
      throw error;
    }
  };

  const handleRemoveRegion = async (id: string) => {
    try {
      await removeRegion(id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove region';
      logger.error('Failed to remove region', { error, regionId: id }, 'RegionDashboard');
      toast.error(`Failed to remove region: ${errorMessage}`);
    }
  };

  // Export layout
  const handleExportLayout = () => {
    const layoutData = {
      layoutId: currentLayoutId,
      regions,
      version: '1.0',
      exportedAt: new Date().toISOString(),
      metadata: {
        regionCount: regions.length,
        regionTypes: [...new Set(regions.map(r => r.region_type))]
      }
    };
    const blob = new Blob([JSON.stringify(layoutData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-layout-${currentLayoutId}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Load template
  const handleLoadTemplate = async (template: { regions: DashboardRegion[] }) => {
    try {
      if (!currentLayoutId) {
        toast.error('No layout available');
        return;
      }

      // Clear existing regions
      for (const region of regions) {
        await removeRegion(region.id);
      }

      // Add template regions
      for (const regionData of template.regions) {
        await addRegion(regionData.region_type as RegionType, {
          row: regionData.grid_row,
          col: regionData.grid_col
        });
      }

      toast.success('Template loaded successfully');
    } catch (error) {
      logger.error('Failed to load template', { error }, 'RegionDashboard');
      toast.error('Failed to load template');
    }
  };

  // Import layout
  const handleImportLayout = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const layoutData = JSON.parse(e.target?.result as string);
        
        if (layoutData.regions && Array.isArray(layoutData.regions)) {
          // Validate imported regions
          const validRegions = layoutData.regions.filter((r: any) => 
            r.id && r.region_type && typeof r.grid_row === 'number' && typeof r.grid_col === 'number'
          );

          if (validRegions.length > 0) {
            // Clear existing regions and import new ones
            for (const region of regions) {
              try {
                await removeRegion(region.id);
              } catch (error) {
                logger.error('Failed to remove region during import', { error, regionId: region.id }, 'RegionDashboard');
              }
            }
            
            // Add imported regions
            for (const regionData of validRegions) {
              try {
                await addRegion(regionData.region_type as RegionType, {
                  row: regionData.grid_row,
                  col: regionData.grid_col
                });
              } catch (error) {
                logger.error('Failed to add imported region', { error, regionData }, 'RegionDashboard');
              }
            }
          } else {
            alert('Invalid layout file: No valid regions found');
          }
        } else {
          alert('Invalid layout file: Missing regions array');
        }
      } catch (error) {
        logger.error('Failed to import layout', { error }, 'RegionDashboard');
        toast.error('Failed to import layout. Please check the file format.');
        alert('Failed to import layout: Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  const handleToggleCollapse = async (id: string) => {
    try {
      const region = regions.find(r => r.id === id);
      if (!region) return;

      if (region.is_collapsed) {
        // Restore from minimized state
        const originalPos = minimizedRegions.get(id);
        if (originalPos) {
          // First restore position, then toggle collapse state
              try {
                await updateRegionPosition(id, originalPos.row, originalPos.col);
                await toggleCollapse(id);
              } catch (error) {
                logger.error('Failed to restore collapsed region', { error, regionId: id }, 'RegionDashboard');
                toast.error('Failed to restore region position');
              }
          _setMinimizedRegions(prev => {
            const next = new Map(prev);
            next.delete(id);
            return next;
          });
        } else {
          // Just toggle if no stored position
              try {
                await toggleCollapse(id);
              } catch (error) {
                logger.error('Failed to toggle collapse (restore path)', { error, regionId: id }, 'RegionDashboard');
              }
        }
      } else {
        // Minimize: store original position first, then toggle
        _setMinimizedRegions(prev => {
          const next = new Map(prev);
          next.set(id, { row: region.grid_row, col: region.grid_col });
          return next;
        });
        // Toggle collapse state first, then move off-screen
            try {
              await toggleCollapse(id);
              // Do not move region out of valid bounds; keep original position to respect server validation
              await updateRegionPosition(id, region.grid_row, region.grid_col);
            } catch (error) {
              logger.error('Failed to minimize region', { error, regionId: id }, 'RegionDashboard');
              toast.error('Failed to minimize region');
            }
      }
    } catch (error) {
      logger.error('Failed to toggle collapse', { error, regionId: id }, 'RegionDashboard');
    }
  };

  const handleRestoreRegion = async (id: string) => {
    const originalPos = minimizedRegions.get(id);
    if (!originalPos) return;
    try {
      await updateRegionPosition(id, originalPos.row, originalPos.col);
      _setMinimizedRegions(prev => {
        const next = new Map(prev);
        next.delete(id);
        return next;
      });
      await toggleCollapse(id);
    } catch (error) {
      logger.error('Failed to restore region', { error, regionId: id }, 'RegionDashboard');
      toast.error('Failed to restore region');
    }
  };

  const handleToggleLock = async (id: string) => {
    try {
      await toggleLock(id);
    } catch (error) {
      logger.error('Failed to toggle lock', { error, regionId: id }, 'RegionDashboard');
      toast.error('Failed to toggle region lock');
    }
  };

  const renderRegionContent = (region: DashboardRegion) => {
    if (region.widget_type && region.widget_config) {
      // Render widget in sandbox
      // In a real implementation, we'd load the widget manifest
      return (
        <div className="p-4">
          <p className="text-sm text-gray-600">Widget: {region.widget_type}</p>
          <p className="text-xs text-gray-400 mt-1">Widget rendering would go here</p>
        </div>
      );
    }

    // Render default content based on region type
    switch (region.region_type) {
      case RegionType.SCHEDULING:
        return <div className="p-4">Scheduling Widget</div>;
      case RegionType.REPORTS:
        return <div className="p-4">Reports Widget</div>;
      case RegionType.CUSTOMER_SEARCH:
        return <div className="p-4">Customer Search Widget</div>;
      case RegionType.SETTINGS:
        return <div className="p-4">Settings Widget</div>;
      case RegionType.QUICK_ACTIONS:
        return <div className="p-4">Quick Actions Widget</div>;
      case RegionType.ANALYTICS:
        return <div className="p-4">Analytics Widget</div>;
      default:
        return <div className="p-4 text-gray-500">No content configured</div>;
    }
  };

  if (loadingLayout || regionsLoading || !currentLayoutId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (regionsError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <p className="text-red-800 font-semibold">Error Loading Dashboard</p>
        <p className="text-red-600 text-sm mt-1">{regionsError.message}</p>
      </div>
    );
  }

  // Command palette commands
  const commands: Command[] = [
    {
      id: 'add-region',
      label: 'Add Region',
      category: 'Regions',
      action: () => setShowAddRegionDialog(true),
      keywords: ['add', 'new', 'create', 'region']
    },
    {
      id: 'open-inspector',
      label: 'Open Inspector',
      category: 'View',
      action: () => setInspectorOpen(true),
      keywords: ['inspector', 'details', 'panel']
    },
    {
      id: 'reset-layout',
      label: 'Reset Layout',
      category: 'Layout',
      action: () => handleResetAll(),
      keywords: ['reset', 'clear', 'default']
    },
    {
      id: 'templates',
      label: 'Manage Templates',
      category: 'Layout',
      action: () => setShowTemplateManager(true),
      keywords: ['template', 'save', 'load', 'preset']
    }
  ];

  // Mobile Dashboard (if feature flag enabled and on mobile device)
  if (isMobile && mobileBetaEnabled && currentLayoutId) {
    return (
      <ErrorBoundary>
        <MobileDashboard
          regions={regions}
          onResize={async (id, rowSpan, colSpan) => {
            try {
              const region = regions.find(r => r.id === id);
              if (region) {
                await updateRegionSize(id, rowSpan, colSpan);
              }
            } catch (error) {
              logger.error('Mobile: failed to resize region', { error, id, rowSpan, colSpan }, 'RegionDashboard');
            }
          }}
          onMove={async (id, row, col) => {
            try {
              const region = regions.find(r => r.id === id);
              if (region) {
                await updateRegionPosition(id, row, col);
              }
            } catch (error) {
              logger.error('Mobile: failed to move region', { error, id, row, col }, 'RegionDashboard');
            }
          }}
          onToggleCollapse={async (id) => {
            try {
              await toggleCollapse(id);
            } catch (error) {
              logger.error('Mobile: failed to toggle collapse', { error, id }, 'RegionDashboard');
            }
          }}
          onToggleLock={async (id) => {
            try {
              await toggleLock(id);
            } catch (error) {
              logger.error('Mobile: failed to toggle lock', { error, id }, 'RegionDashboard');
            }
          }}
          onDelete={async (id) => {
            try {
              await removeRegion(id);
            } catch (error) {
              logger.error('Mobile: failed to delete region', { error, id }, 'RegionDashboard');
            }
          }}
          onUpdate={async (id, updates) => {
            try {
              if (currentLayoutId) {
                await updateRegionInStore(id, updates);
              }
            } catch (error) {
              logger.error('Mobile: failed to update region', { error, id, updates }, 'RegionDashboard');
            }
          }}
          onAddRegion={async (type) => {
            try {
              if (currentLayoutId) {
                await addRegion(type as RegionType);
              }
            } catch (error) {
              logger.error('Mobile: failed to add region', { error, type }, 'RegionDashboard');
            }
          }}
        />
      </ErrorBoundary>
    );
  }

  return (
    <div className="region-dashboard w-full h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative flex flex-col overflow-hidden">
      {/* Command Palette */}
      <CommandPalette commands={commands} />

      {/* Sticky Dashboard Header with Settings */}
      <header
        className={`dashboard-header transition-all ${isScrolled ? 'floating-header shadow-lg' : ''}`}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(255,255,255,0.7)',
          backdropFilter: 'saturate(1.2) blur(6px)',
          WebkitBackdropFilter: 'saturate(1.2) blur(6px)',
          borderBottom: '1px solid rgba(229,231,235,0.6)'
        }}
      >
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={zoomOut}
                className="w-9 h-9 flex items-center justify-center border rounded-md hover:bg-gray-50"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-sm px-2 py-1 min-w-[3rem] text-center">{Math.round(zoom * 100)}%</span>
              <button
                onClick={zoomIn}
                className="w-9 h-9 flex items-center justify-center border rounded-md hover:bg-gray-50"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Undo/Redo */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleUndo}
                disabled={!currentLayoutId ? true : !canUndoStore(currentLayoutId)}
                className="w-9 h-9 flex items-center justify-center border rounded-md hover:bg-gray-50 disabled:opacity-50"
                title="Undo (Ctrl+Z)"
              >
                <Undo className="w-4 h-4" />
              </button>
              <button
                onClick={handleRedo}
                disabled={!currentLayoutId ? true : !canRedoStore(currentLayoutId)}
                className="w-9 h-9 flex items-center justify-center border rounded-md hover:bg-gray-50 disabled:opacity-50"
                title="Redo (Ctrl+Shift+Z)"
              >
                <Redo className="w-4 h-4" />
              </button>
            </div>
            {/* Add Region */}
            <button
              onClick={() => setShowAddRegionDialog(true)}
              className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Region
            </button>
            {/* More Options */}
            <div className="relative">
              <details className="relative">
                <summary className="list-none w-9 h-9 flex items-center justify-center border rounded-md hover:bg-gray-50 cursor-pointer">
                  <MoreVertical className="w-4 h-4" />
                </summary>
                <div className="absolute right-0 mt-2 bg-white border rounded-md shadow-lg min-w-[180px] z-50">
                  <button
                    onClick={handleExportLayout}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export Layout
                  </button>
                  <label className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Import Layout
                    <input
                      type="file"
                      accept="application/json"
                      onChange={handleImportLayout}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={handleResetAll}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset Layout
                  </button>
                </div>
              </details>
            </div>
          </div>
        </div>
        {/* Filters/Search: always visible to avoid disappearing on state changes */}
        <div className="border-t px-4 py-2">
          <FloatingNavBar
            key="stable-navbar"
            title="Filters & Context"
            offsetTop={72}
            filters={[
              {
                id: 'active',
                label: 'Active Regions',
                active: activeFilters.has('active'),
                onClick: () => {
                  setActiveFilters(prev => {
                    const next = new Set(prev);
                    if (next.has('active')) {
                      next.delete('active');
                    } else {
                      next.add('active');
                    }
                    return next;
                  });
                }
              },
              {
                id: 'recent',
                label: 'Recent Activity',
                active: activeFilters.has('recent'),
                onClick: () => {
                  setActiveFilters(prev => {
                    const next = new Set(prev);
                    if (next.has('recent')) {
                      next.delete('recent');
                    } else {
                      next.add('recent');
                    }
                    return next;
                  });
                }
              },
              {
                id: 'locked',
                label: 'Locked Regions',
                active: activeFilters.has('locked'),
                onClick: () => {
                  setActiveFilters(prev => {
                    const next = new Set(prev);
                    if (next.has('locked')) {
                      next.delete('locked');
                    } else {
                      next.add('locked');
                    }
                    return next;
                  });
                }
              }
            ]}
            onSearch={(term) => {
              setSearchTerm(term);
            }}
            onAdvancedFiltersChange={(filters) => {
              setAdvancedFilters(filters);
            }}
          />
        </div>
      </header>

      {/* Utility Dock */}
      <UtilityDock isVisible={utilityDockVisible} />

      {/* Inspector Panel */}
      <InspectorPanel
        isOpen={inspectorOpen}
        onClose={() => {
          setInspectorOpen(false);
          setInspectorContent(null);
        }}
        title="Inspector"
        position="right"
      >
        {inspectorContent || (
          <div className="text-sm text-gray-500">
            <p>Select a region or item to view details</p>
          </div>
        )}
      </InspectorPanel>
      

      {/* Region Type Selector - Custom implementation for regions */}
      {showAddRegionDialog && (
        <div className="fixed top-4 left-32 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-56">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-gray-700">Add Region</span>
          </div>
          <div className="space-y-1">
            {Object.values(RegionType).map(type => (
              <button
                key={type}
                onClick={() => handleAddRegion(type)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-lg capitalize transition-colors"
              >
                {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Onboarding */}
      {showOnboarding && (
        <DashboardOnboarding
          onComplete={() => {
            localStorage.setItem('dashboard_onboarding_complete', 'true');
            setShowOnboarding(false);
            toast.success('Welcome to your dashboard!');
          }}
          onSkip={() => {
            localStorage.setItem('dashboard_onboarding_complete', 'true');
            setShowOnboarding(false);
          }}
          onSelectTemplate={async (_templateId) => {
            localStorage.setItem('dashboard_onboarding_complete', 'true');
            setShowOnboarding(false);
            setShowTemplateManager(true);
          }}
        />
      )}

      {/* Empty State */}
      {showEmptyState && !showOnboarding && (
        <EmptyDashboard
          onAddRegion={async (type) => {
            if (currentLayoutId) {
              try {
                await addRegion(type);
                setShowEmptyState(false);
              } catch (error) {
                logger.error('Failed to add region from empty state', { error, type }, 'RegionDashboard');
                toast.error('Failed to add region');
              }
            }
          }}
          onSelectTemplate={async (_templateId) => {
            setShowTemplateManager(true);
          }}
          onStartOnboarding={() => {
            localStorage.removeItem('dashboard_onboarding_complete');
            setShowOnboarding(true);
            setShowEmptyState(false);
          }}
        />
      )}

      {/* Dashboard Content */}
      {!showEmptyState && !showOnboarding && (
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto p-4 min-h-0
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-purple-50
          [&::-webkit-scrollbar-thumb]:bg-purple-300
          hover:[&::-webkit-scrollbar-thumb]:bg-purple-400"
        style={{
          position: 'relative'
        }}
        onMouseDown={handlePanStart}
      >
        {regions.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-200px)] bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <p className="text-gray-600 text-lg mb-4">No regions configured</p>
          <button
            onClick={() => {
              setShowAddRegionDialog(true);
            }}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Your First Region
          </button>
        </div>
      ) : (
        <div 
          style={{
            width: `${Math.max(canvasSize.width, 1200)}px`,
            height: `${Math.max(canvasSize.height, 800)}px`,
            minWidth: '100%',
            minHeight: '100%',
            position: 'relative',
            imageRendering: 'crisp-edges' as const,
            willChange: 'transform',
            ...getTransformStyle()
          }}
          className="overflow-visible"
        >
          <ErrorBoundary>
            {shouldUseVirtualization ? (
              <VirtualizedRegionGrid
                regions={filteredRegions}
                cols={12}
                rowHeight={100}
                onResize={updateRegionSize}
                onMove={updateRegionPosition}
                onToggleCollapse={handleToggleCollapse}
                onToggleLock={handleToggleLock}
                onDelete={handleRemoveRegion}
                onUpdate={handleUpdateRegion}
              />
            ) : (
              <RegionGrid
                regions={filteredRegions}
                rows={Math.ceil(canvasSize.height / 100) || 12}
                cols={12}
                gap={16}
                onResize={updateRegionSize}
                onMove={updateRegionPosition}
                onToggleCollapse={handleToggleCollapse}
                onToggleLock={handleToggleLock}
                onDelete={handleRemoveRegion}
                onUpdate={handleUpdateRegion}
                onAddRegion={handleAddRegion}
                renderRegion={renderRegionContent}
                isDraggable
                isResizable
              />
            )}
          </ErrorBoundary>
        </div>
        )}
      </div>
      )}

      {/* Minimized Region Dock */}
      <MinimizedRegionDock
        minimizedRegions={regions
          .filter(r => r.is_collapsed && minimizedRegions.has(r.id))
          .map(r => ({
            ...r,
            originalPosition: minimizedRegions.get(r.id) || { row: r.grid_row, col: r.grid_col }
          }))}
        onRestore={handleRestoreRegion}
      />

      {/* Template Manager */}
      <TemplateManager
        isOpen={showTemplateManager}
        onClose={() => setShowTemplateManager(false)}
        currentRegions={regions}
        onLoadTemplate={handleLoadTemplate}
      />

      {/* Conflict Resolution Dialogs */}
      {conflicts.map((conflict) => (
        <ConflictResolutionDialog
          key={conflict.regionId}
          conflict={conflict}
          onResolve={async (resolution) => {
            try {
              await resolveConflict(conflict.regionId, resolution);
              toast.success('Conflict resolved successfully');
            } catch (error) {
              toast.error('Failed to resolve conflict');
              logger.error('Failed to resolve conflict', { error, conflict }, 'RegionDashboard');
            }
          }}
          onCancel={() => clearConflict(conflict.regionId)}
        />
      ))}

      {/* Offline Indicator */}
      <OfflineIndicator />
    </div>
  );
};

export default RegionDashboard;

