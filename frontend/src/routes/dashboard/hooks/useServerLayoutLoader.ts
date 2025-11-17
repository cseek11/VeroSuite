/**
 * useServerLayoutLoader Hook
 * 
 * Handles loading the server layout on component mount.
 * Extracted from VeroCardsV3.tsx to improve maintainability and reduce file size.
 */

import { useEffect, useRef } from 'react';
import { enhancedApi } from '@/lib/enhanced-api';
import { KPI_DATA_STORAGE_KEY } from '../utils/constants';

interface UseServerLayoutLoaderProps {
  serverPersistence: {
    setIsLoadingLayout: (loading: boolean) => void;
    setCurrentLayoutId: (id: string) => void;
    setServerLoadSucceeded: (succeeded: boolean) => void;
  };
  loadServerLayoutData: (
    layoutId: string,
    loadLayoutFromData: (data: any) => void,
    setCurrentLayoutId: (id: string) => void,
    setServerLoadSucceeded: (succeeded: boolean) => void
  ) => Promise<void>;
  loadLayoutFromData: (data: any) => void;
  setKpiData: (data: any) => void;
  processedKpisRef: React.MutableRefObject<Set<string>>;
}

export function useServerLayoutLoader({
  serverPersistence,
  loadServerLayoutData,
  loadLayoutFromData,
  setKpiData,
  processedKpisRef
}: UseServerLayoutLoaderProps) {
  // Use a ref to track if we've already loaded to prevent infinite loops
  const hasLoadedRef = useRef(false);
  
  useEffect(() => {
    // Only load once on mount
    if (hasLoadedRef.current) return;
    
    const loadServerLayout = async () => {
      hasLoadedRef.current = true;
      
      try {
        serverPersistence.setIsLoadingLayout(true);
        const layout = await enhancedApi.dashboardLayouts.getOrCreateDefault();
        if (!layout) {
          serverPersistence.setIsLoadingLayout(false);
          return;
        }
        
        await loadServerLayoutData(
          layout.id,
          loadLayoutFromData,
          serverPersistence.setCurrentLayoutId,
          serverPersistence.setServerLoadSucceeded
        );
      } catch (error) {
        // Fallback to localStorage
        try {
          const raw = localStorage.getItem(KPI_DATA_STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') {
              setKpiData(parsed);
              Object.values(parsed).forEach((entry: any) => {
                if (entry && entry.id) {
                  processedKpisRef.current.add(entry.id);
                }
              });
            }
          }
        } catch (e) {
          // Ignore localStorage errors
        }
      } finally {
        serverPersistence.setIsLoadingLayout(false);
      }
    };
    
    loadServerLayout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount
}

