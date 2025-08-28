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

// Navigation items mapping for visual connection
const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { id: 'crm', label: 'CRM', path: '/customers' },
  { id: 'scheduling', label: 'Scheduling', path: '/scheduler' },
  { id: 'communications', label: 'Communications', path: '/communications' },
  { id: 'finance', label: 'Finance', path: '/finance' },
  { id: 'reports', label: 'Reports', path: '/reports' },
  { id: 'knowledge', label: 'Knowledge', path: '/knowledge' },
  { id: 'settings', label: 'Settings', path: '/settings' },
];

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

  // Get current active tab for visual connection
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/') return 'dashboard';
    if (path === '/customers') return 'crm';
    if (path === '/scheduler') return 'scheduling';
    if (path === '/communications') return 'communications';
    if (path === '/finance') return 'finance';
    if (path === '/reports') return 'reports';
    if (path === '/knowledge') return 'knowledge';
    if (path === '/settings') return 'settings';
    return 'dashboard';
  };

  const activeTab = getActiveTab();
  
  // Standardized positioning - matches V4Sidebar exactly
  const getConnectionPosition = () => {
    const itemHeight = 44; // Standard height: py-2 (8px) + content (~28px) + space-y-1 (4px) + padding (4px)
    const itemSpacing = 4; // space-y-1
    const topPadding = 12; // nav padding
    const logoHeight = 80; // Logo section height (p-5 = 20px * 2 + content ~40px)
    const sidebarTopPadding = 16; // Additional top padding for the sidebar
    
    const itemIndex = {
      'dashboard': 0,
      'crm': 1,
      'scheduling': 2,
      'communications': 3,
      'finance': 4,
      'reports': 5,
      'knowledge': 6,
      'settings': 7
    };
    
    const index = itemIndex[activeTab] || 0;
    return sidebarTopPadding + logoHeight + topPadding + (index * (itemHeight + itemSpacing)) + (itemHeight / 2);
  };

  // Close mobile menu and activity panel when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    
    // Close activity panel on certain pages (like dashboard tabs behavior)
    const pagesToCloseActivityPanel = ['/settings', '/knowledge', '/finance', '/communications'];
    if (pagesToCloseActivityPanel.includes(location.pathname)) {
      setActivityPanelCollapsed(true);
    }
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
        <div className="flex-1 flex min-w-0 overflow-hidden relative flex-shrink">
          {/* Main Content */}
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden flex-shrink min-w-0">
            <section className="flex-1 p-4 pl-4 main-content-area overflow-hidden">
              <div className="relative bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 h-full overflow-hidden">
                {/* Visual connection to active tab */}
                <div 
                  className="absolute -left-6 w-8 h-12 bg-green-500 rounded-l-full transition-all duration-300 ease-out z-10 shadow-lg"
                  style={{
                    top: `${getConnectionPosition()}px`,
                    transform: 'translateY(-242%)'
                  }}
                />
                
                {/* Content with embedded scrollbar */}
                <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <div className="p-6">
                    {children}
                  </div>
                </div>
              </div>
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
