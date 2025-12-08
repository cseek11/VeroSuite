import { useState, useCallback, useMemo } from 'react';
import { logger } from '@/utils/logger';

export interface DrillDownLevel {
  id: string;
  name: string;
  data: any[];
  filters: Record<string, any>;
  parentId?: string;
  breadcrumb: string[];
}

export interface DrillDownFilter {
  id: string;
  field: string;
  label: string;
  type: 'date' | 'select' | 'range' | 'text';
  options?: string[];
  value?: any;
}

export interface DrillDownState {
  levels: DrillDownLevel[];
  currentLevel: number;
  filters: DrillDownFilter[];
  searchTerm: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  viewMode: 'table' | 'chart' | 'cards';
}

interface UseDrillDownProps {
  initialData?: any[];
  onDataChange?: (data: any[]) => void;
  onLevelChange?: (level: DrillDownLevel) => void;
  maxLevels?: number;
}

export function useDrillDown({
  initialData = [],
  onLevelChange,
  maxLevels = 5
}: UseDrillDownProps) {
  const [state, setState] = useState<DrillDownState>({
    levels: initialData.length > 0 ? [{
      id: 'root',
      name: 'Root Level',
      data: initialData,
      filters: {},
      breadcrumb: ['Root']
    }] : [],
    currentLevel: 0,
    filters: [],
    searchTerm: '',
    sortBy: '',
    sortOrder: 'asc',
    viewMode: 'table'
  });

  // Navigate to a specific level
  const navigateToLevel = useCallback((levelIndex: number) => {
    if (levelIndex >= 0 && levelIndex < state.levels.length) {
      setState(prev => ({
        ...prev,
        currentLevel: levelIndex
      }));
      
      const level = state.levels[levelIndex];
      if (level && onLevelChange) {
        onLevelChange(level);
      }
    }
  }, [state.levels, onLevelChange]);

  // Add a new drill-down level
  const addLevel = useCallback((levelData: Omit<DrillDownLevel, 'id' | 'breadcrumb'>) => {
    if (state.levels.length >= maxLevels) {
      logger.warn('Maximum drill-down levels reached', { maxLevels }, 'useDrillDown');
      return;
    }

    const newLevel: DrillDownLevel = {
      ...levelData,
      id: `level-${Date.now()}`,
      breadcrumb: [
        ...state.levels[state.currentLevel]?.breadcrumb || [],
        levelData.name
      ]
    };

    setState(prev => ({
      ...prev,
      levels: [...prev.levels.slice(0, prev.currentLevel + 1), newLevel],
      currentLevel: prev.currentLevel + 1
    }));

    onLevelChange?.(newLevel);
  }, [state.levels, state.currentLevel, maxLevels, onLevelChange]);

  // Go back to previous level
  const goBack = useCallback(() => {
    if (state.currentLevel > 0) {
      navigateToLevel(state.currentLevel - 1);
    }
  }, [state.currentLevel, navigateToLevel]);

  // Go to root level
  const goToRoot = useCallback(() => {
    navigateToLevel(0);
  }, [navigateToLevel]);

  // Update filters
  const updateFilter = useCallback((filterId: string, value: any) => {
    setState(prev => ({
      ...prev,
      filters: prev.filters.map(filter =>
        filter.id === filterId ? { ...filter, value } : filter
      )
    }));
  }, []);

  // Add filter
  const addFilter = useCallback((filter: DrillDownFilter) => {
    setState(prev => ({
      ...prev,
      filters: [...prev.filters, filter]
    }));
  }, []);

  // Remove filter
  const removeFilter = useCallback((filterId: string) => {
    setState(prev => ({
      ...prev,
      filters: prev.filters.filter(filter => filter.id !== filterId)
    }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      filters: prev.filters.map(filter => ({ ...filter, value: undefined }))
    }));
  }, []);

  // Update search term
  const setSearchTerm = useCallback((searchTerm: string) => {
    setState(prev => ({ ...prev, searchTerm }));
  }, []);

  // Update sorting
  const setSorting = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
    setState(prev => ({ ...prev, sortBy, sortOrder }));
  }, []);

  // Update view mode
  const setViewMode = useCallback((viewMode: 'table' | 'chart' | 'cards') => {
    setState(prev => ({ ...prev, viewMode }));
  }, []);

  // Get filtered and sorted data for current level
  const currentData = useMemo(() => {
    const level = state.levels[state.currentLevel];
    if (!level) return [];

    let filteredData = [...level.data];

    // Apply search filter
    if (state.searchTerm) {
      const searchLower = state.searchTerm.toLowerCase();
      filteredData = filteredData.filter(item => {
        return Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply custom filters
    state.filters.forEach(filter => {
      if (filter.value !== undefined && filter.value !== null && filter.value !== '') {
        filteredData = filteredData.filter(item => {
          const itemValue = item[filter.field];
          
          switch (filter.type) {
            case 'date':
              if (filter.value.start && filter.value.end) {
                const itemDate = new Date(itemValue);
                return itemDate >= new Date(filter.value.start) && 
                       itemDate <= new Date(filter.value.end);
              }
              return true;
              
            case 'select':
              return itemValue === filter.value;
              
            case 'range':
              return itemValue >= filter.value.min && itemValue <= filter.value.max;
              
            case 'text':
              return String(itemValue).toLowerCase().includes(
                String(filter.value).toLowerCase()
              );
              
            default:
              return true;
          }
        });
      }
    });

    // Apply sorting
    if (state.sortBy) {
      filteredData.sort((a, b) => {
        const aValue = a[state.sortBy];
        const bValue = b[state.sortBy];
        
        if (aValue < bValue) return state.sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return state.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filteredData;
  }, [state.levels, state.currentLevel, state.searchTerm, state.filters, state.sortBy, state.sortOrder]);

  // Get current level info
  const currentLevel = state.levels[state.currentLevel];

  // Get breadcrumb path
  const breadcrumb = currentLevel?.breadcrumb || [];

  // Check if can go back
  const canGoBack = state.currentLevel > 0;

  // Check if can add level
  const canAddLevel = state.levels.length < maxLevels;

  // Get level statistics
  const levelStats = useMemo(() => {
    const level = state.levels[state.currentLevel];
    if (!level) return null;

    const total = level.data.length;
    const filtered = currentData.length;
    const filteredOut = total - filtered;

    return {
      total,
      filtered,
      filteredOut,
      filterCount: state.filters.filter(f => f.value !== undefined).length,
      hasSearch: !!state.searchTerm
    };
  }, [state.levels, state.currentLevel, currentData, state.filters, state.searchTerm]);

  return {
    // State
    state,
    currentLevel,
    currentData,
    breadcrumb,
    levelStats,
    
    // Navigation
    navigateToLevel,
    addLevel,
    goBack,
    goToRoot,
    canGoBack,
    canAddLevel,
    
    // Filters
    updateFilter,
    addFilter,
    removeFilter,
    clearFilters,
    
    // Search and sort
    setSearchTerm,
    setSorting,
    setViewMode,
    
    // Utilities
    reset: () => setState({
      levels: initialData.length > 0 ? [{
        id: 'root',
        name: 'Root Level',
        data: initialData,
        filters: {},
        breadcrumb: ['Root']
      }] : [],
      currentLevel: 0,
      filters: [],
      searchTerm: '',
      sortBy: '',
      sortOrder: 'asc',
      viewMode: 'table'
    })
  };
}
