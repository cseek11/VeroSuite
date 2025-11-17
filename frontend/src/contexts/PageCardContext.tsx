import React, { createContext, useContext, ReactNode } from 'react';
import { PageCard } from '@/routes/dashboard/hooks/usePageCards';

interface PageCardContextType {
  openPageCard: (card: Omit<PageCard, 'id'>) => string;
  closePageCard: (id: string) => void;
  updatePageCard: (id: string, updates: Partial<PageCard>) => void;
  isPageCardOpen: (pageId: string) => boolean;
}

const PageCardContext = createContext<PageCardContextType | undefined>(undefined);

interface PageCardProviderProps {
  children: ReactNode;
  value: PageCardContextType;
}

export const PageCardProvider: React.FC<PageCardProviderProps> = ({ children, value }) => {
  return (
    <PageCardContext.Provider value={value}>
      {children}
    </PageCardContext.Provider>
  );
};

export const usePageCardContext = (): PageCardContextType => {
  const context = useContext(PageCardContext);
  if (!context) {
    throw new Error('usePageCardContext must be used within a PageCardProvider');
  }
  return context;
};











