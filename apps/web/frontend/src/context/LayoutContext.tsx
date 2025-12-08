import { createContext, useContext, useState, ReactNode } from 'react';

interface LayoutContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activityBarOpen: boolean;
  setActivityBarOpen: (open: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useLayout = () => {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error('useLayout must be used within a LayoutProvider');
  return ctx;
};

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activityBarOpen, setActivityBarOpen] = useState(false);

  return (
    <LayoutContext.Provider value={{ sidebarOpen, setSidebarOpen, activityBarOpen, setActivityBarOpen }}>
      {children}
    </LayoutContext.Provider>
  );
};
