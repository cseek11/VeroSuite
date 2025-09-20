import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
import V4TopBar from './V4TopBar';
import SecondaryNavigationBar from './SecondaryNavigationBar';
import ExpandableFABSystem from './ExpandableFABSystem';
import ExpandableActivityFABSystem from './ExpandableActivityFABSystem';

interface V4LayoutProps {
  children: React.ReactNode;
}

export default function V4Layout({ children }: V4LayoutProps) {
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

    </div>
  );
}
