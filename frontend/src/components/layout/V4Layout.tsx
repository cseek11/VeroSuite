import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
import V4TopBar from './V4TopBar';
import SecondaryNavigationBar from './SecondaryNavigationBar';
import ExpandableFABSystem from './ExpandableFABSystem';
import ExpandableActivityFABSystem from './ExpandableActivityFABSystem';
import { PageCardProvider } from '@/contexts/PageCardContext';
import { usePageCards } from '@/routes/dashboard/hooks/usePageCards';
import PageCardWrapper from '@/components/dashboard/PageCardWrapper';
import GlobalSearch from '@/components/common/GlobalSearch';

interface V4LayoutProps {
  children: React.ReactNode;
}

interface V4LayoutContentProps extends V4LayoutProps {
  pageCards?: any[];
  updatePageCard?: (id: string, updates: any) => void;
  closePageCard?: (id: string) => void;
}

// Wrapper component that provides page card context (for non-dashboard routes)
function V4LayoutWithPageCards({ children }: V4LayoutProps) {
  const { pageCards, openPageCard, closePageCard, updatePageCard } = usePageCards();
  
  return (
    <PageCardProvider value={{ openPageCard, closePageCard, updatePageCard, isPageCardOpen: () => false }}>
      <V4LayoutContent pageCards={pageCards} updatePageCard={updatePageCard} closePageCard={closePageCard}>{children}</V4LayoutContent>
    </PageCardProvider>
  );
}

function V4LayoutContent({ children, pageCards = [], updatePageCard, closePageCard }: V4LayoutContentProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { user, clear } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();


  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    clear();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-90/70 backdrop-blur-sm backdrop-brightness-90">
      {/* Phase 2: Production FAB Systems */}
      <ExpandableFABSystem />
      <ExpandableActivityFABSystem />

      {/* Main Content Area - Full width since sidebars are fixed */}
      <div className="flex-1 flex flex-col">
        {/* Bitrix24-Style Top Bar */}
        <V4TopBar 
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          onLogout={handleLogout}
          user={user}
        />

        {/* Secondary Navigation Bar */}
        <SecondaryNavigationBar />

                 {/* Main Workspace */}
        <div className="flex-1 flex min-w-0 overflow-hidden relative">
          {/* Main Content */}
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <section className="flex-1 main-content-area overflow-hidden">
              <div className="relative bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200/50 h-full overflow-hidden">
                {/* Content with embedded scrollbar */}
                <div className="h-full overflow-y-auto
                  [&::-webkit-scrollbar]:w-2
                  [&::-webkit-scrollbar-track]:bg-gray-50
                  [&::-webkit-scrollbar-thumb]:bg-purple-300
                  hover:[&::-webkit-scrollbar-thumb]:bg-purple-400
                  dark:[&::-webkit-scrollbar-track]:bg-gray-50
                  dark:[&::-webkit-scrollbar-thumb]:bg-purple-300
                  dark:hover:[&::-webkit-scrollbar-thumb]:bg-purple-400">
                  <div className="p-6">
                    {children}
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Page Cards Overlay */}
      {pageCards.map((pageCard) => {
        const PageComponent = pageCard.component;
        return (
          <PageCardWrapper
            key={pageCard.id}
            pageId={pageCard.id}
            title={pageCard.title}
            {...(pageCard.icon && { icon: pageCard.icon })}
            onClose={() => closePageCard?.(pageCard.id)}
            onResize={(size) => updatePageCard?.(pageCard.id, { size })}
            initialSize={pageCard.size}
          >
            <PageComponent {...pageCard.props} />
          </PageCardWrapper>
        );
      })}

      {/* Global Search */}
      <GlobalSearch />
    </div>
  );
}

export default V4LayoutWithPageCards;
