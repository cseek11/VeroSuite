import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type DensityMode = 'compact' | 'standard' | 'comfortable';

interface DensityModeContextType {
  densityMode: DensityMode;
  setDensityMode: (mode: DensityMode) => void;
}

const DensityModeContext = createContext<DensityModeContextType | undefined>(undefined);

const STORAGE_KEY = 'verofield-density-mode';
const DEFAULT_DENSITY: DensityMode = 'standard';

export const useDensityMode = () => {
  const ctx = useContext(DensityModeContext);
  if (!ctx) throw new Error('useDensityMode must be used within a DensityModeProvider');
  return ctx;
};

export const DensityModeProvider = ({ children }: { children: ReactNode }) => {
  const [densityMode, setDensityModeState] = useState<DensityMode>(() => {
    // Load from localStorage on initialization
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && ['compact', 'standard', 'comfortable'].includes(stored)) {
        return stored as DensityMode;
      }
    }
    return DEFAULT_DENSITY;
  });

  // Update document root attribute and localStorage when density changes
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-density', densityMode);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, densityMode);
    }
  }, [densityMode]);

  // Initialize on mount
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-density', densityMode);
  }, []);

  const setDensityMode = (mode: DensityMode) => {
    setDensityModeState(mode);
  };

  return (
    <DensityModeContext.Provider value={{ densityMode, setDensityMode }}>
      {children}
    </DensityModeContext.Provider>
  );
};





