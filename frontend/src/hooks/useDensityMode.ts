import { useState, useCallback, useEffect } from 'react';
import { useUserPreferences } from '@/stores/userPreferences';
import type { DensityMode } from '@/stores/userPreferences';

// Simple media query hook
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

export const useDensityMode = () => {
  const { preferences, setDensityMode } = useUserPreferences();
  const [localDensityMode, setLocalDensityMode] = useState<DensityMode>(preferences.densityMode);
  
  // Mobile detection
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px) and (min-width: 769px)');
  
  // Auto-adjust density mode based on screen size
  useEffect(() => {
    if (isMobile && localDensityMode === 'dense') {
      // Force standard mode on mobile for better usability
      setLocalDensityMode('standard');
      setDensityMode('standard');
    }
  }, [isMobile, localDensityMode, setDensityMode]);
  
  // Sync with user preferences
  useEffect(() => {
    setLocalDensityMode(preferences.densityMode);
  }, [preferences.densityMode]);
  
  const toggleDensity = useCallback(() => {
    const newMode: DensityMode = localDensityMode === 'dense' ? 'standard' : 'dense';
    
    // Don't allow dense mode on mobile
    if (isMobile && newMode === 'dense') {
      return;
    }
    
    setLocalDensityMode(newMode);
    setDensityMode(newMode);
  }, [localDensityMode, isMobile, setDensityMode]);
  
  const setDensity = useCallback((mode: DensityMode) => {
    // Don't allow dense mode on mobile
    if (isMobile && mode === 'dense') {
      return;
    }
    
    setLocalDensityMode(mode);
    setDensityMode(mode);
  }, [isMobile, setDensityMode]);
  
  // Effective density mode (considering mobile constraints)
  const effectiveMode: DensityMode = isMobile && localDensityMode === 'dense' 
    ? 'standard' 
    : localDensityMode;
  
  return {
    densityMode: effectiveMode,
    toggleDensity,
    setDensity,
    isMobile,
    isTablet,
    canUseDense: !isMobile,
    isForcedStandard: isMobile && localDensityMode === 'dense',
  };
};








