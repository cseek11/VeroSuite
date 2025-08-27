import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
import V4Sidebar from './V4Sidebar';
import V4TopBar from './V4TopBar';
import V4ActivityPanel from './V4ActivityPanel';
import { 
  Bell, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  User,
  Settings,
  HelpCircle
} from 'lucide-react';

interface V4LayoutProps {
  children: React.ReactNode;
}

export default function V4Layout({ children }: V4LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [activityPanelCollapsed, setActivityPanelCollapsed] = useState(true);
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
      {/* Bitrix24-Style Sidebar */}
      <V4Sidebar 
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Bitrix24-Style Top Bar */}
        <V4TopBar 
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          onLogout={handleLogout}
          user={user}
          sidebarCollapsed={sidebarCollapsed}
          onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          activityPanelCollapsed={activityPanelCollapsed}
          onActivityPanelToggle={() => setActivityPanelCollapsed(!activityPanelCollapsed)}
        />

                 {/* Main Workspace */}
        <div className="flex-1 flex min-w-0 overflow-hidden">
          {/* Main Content */}
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden max-w-full">
            <section className="flex-1 p-4 pl-4 main-content-area overflow-y-auto v4-scrollbar max-w-full">
              {children}
            </section>
          </main>

          {/* Right Activity Panel */}
          <V4ActivityPanel 
            collapsed={activityPanelCollapsed}
            onToggle={() => setActivityPanelCollapsed(!activityPanelCollapsed)}
            sidebarCollapsed={sidebarCollapsed}
          />
        </div>
      </div>
    </div>
  );
}
