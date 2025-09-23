import { useState, useCallback, useEffect } from 'react';
import { useUserPreferences } from '@/stores/userPreferences';
import type { DensityMode } from '@/stores/userPreferences';

// Simple media query hook
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

export const useDensityMode = () => {
  const { preferences, setDensityMode } = useUserPreferences();
  
  // Mobile detection
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px) and (min-width: 769px)');
  
  // Auto-adjust density mode based on screen size
  useEffect(() => {
    if (isMobile && preferences.densityMode === 'dense') {
      // Force standard mode on mobile for better usability
      setDensityMode('standard');
    }
  }, [isMobile, preferences.densityMode, setDensityMode]);
  
  const toggleDensity = useCallback(() => {
    const newMode: DensityMode = preferences.densityMode === 'dense' ? 'standard' : 'dense';
    
    // Don't allow dense mode on mobile
    if (isMobile && newMode === 'dense') {
      return;
    }
    
    setDensityMode(newMode);
  }, [preferences.densityMode, isMobile, setDensityMode]);
  
  const setDensity = useCallback((mode: DensityMode) => {
    // Don't allow dense mode on mobile
    if (isMobile && mode === 'dense') {
      return;
    }
    
    setDensityMode(mode);
  }, [isMobile, setDensityMode]);
  
  // Effective density mode (considering mobile constraints)
  const effectiveMode: DensityMode = isMobile && preferences.densityMode === 'dense' 
    ? 'standard' 
    : preferences.densityMode;
  
  return {
    densityMode: effectiveMode,
    toggleDensity,
    setDensity,
    isMobile,
    isTablet,
    canUseDense: !isMobile,
    isForcedStandard: isMobile && preferences.densityMode === 'dense',
  };
};








