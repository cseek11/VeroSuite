import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Users, 
  BarChart3, 
  Settings, 
  Upload, 
  Navigation,
  X,
  RotateCcw,
  Plus,
  Search,
  Download,
  Zap,
  Layers,
  BarChart
} from 'lucide-react';

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onResetLayout?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onAddCustomCard?: () => void;
  onToggleAnalytics?: () => void;
  onToggleGrouping?: () => void;
  onOpenAI?: () => void;
  onExport?: () => void;
  onSearch?: () => void;
  analyticsMode?: boolean;
  groupingEnabled?: boolean;
  compactMode?: boolean;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
  { id: 'jobs', label: 'Jobs', icon: Calendar, path: '/jobs' },
  { id: 'customers', label: 'Customers', icon: Users, path: '/customers' },
  { id: 'routing', label: 'Routing', icon: Navigation, path: '/routing' },
  { id: 'reports', label: 'Reports', icon: BarChart3, path: '/reports' },
  { id: 'uploads', label: 'Uploads', icon: Upload, path: '/uploads' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isOpen,
  onClose,
  onResetLayout,
  isCollapsed = false,
  onToggleCollapse,
  onAddCustomCard,
  compactMode = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine active tab based on current location
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/') return 'dashboard';
    if (path === '/jobs') return 'jobs';
    if (path === '/customers') return 'customers';
    if (path === '/routing') return 'routing';
    if (path === '/reports') return 'reports';
    if (path === '/uploads') return 'uploads';
    if (path === '/settings') return 'settings';
    return 'dashboard';
  };
  
  const activeTab = getActiveTab();
  
  const handleNavigation = (path: string) => {
    navigate(path);
    onClose(); // Close mobile sidebar after navigation
  };

  // Apply compact mode adjustments
  const sidebarWidth = compactMode ? (isCollapsed ? 'w-14' : 'w-56') : (isCollapsed ? 'w-16' : 'w-64');
  const headerHeight = compactMode ? 'h-14' : 'h-16';
  const textSize = compactMode ? 'text-xs' : 'text-sm';
  const iconSize = compactMode ? 'h-4 w-4' : 'h-5 w-5';
  const padding = compactMode ? (isCollapsed ? 'px-1' : 'px-2') : (isCollapsed ? 'px-1' : 'px-2');
  
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        absolute top-0 left-0 z-50 bg-white shadow-lg transform transition-all duration-300 ease-in-out lg:fixed lg:translate-x-0 h-screen
        ${sidebarWidth}
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col">
          <div className={`bg-[url('/branding/crm_BG_small.png')] w-full bg-cover bg-center flex items-center justify-between ${headerHeight} px-6 border-b border-gray-200 ${isCollapsed ? 'px-2' : 'px-6'}`}>
            {!isCollapsed && <img src="/branding/vero_small.png" alt="VeroPest Solution" className="h-8 w-auto" />}
            <div className="flex items-center space-x-2">
              {onToggleCollapse && (
                <button
                  onClick={onToggleCollapse}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                  title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                  data-sidebar-toggle
                >
                  <Navigation className={iconSize} />
                </button>
              )}
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

        <nav className={`mt-6 ${padding}`}>
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    group flex items-center py-1.5 font-medium rounded-md w-full transition-colors
                    ${isCollapsed ? 'justify-center px-1' : padding}
                    ${textSize}
                    ${isActive 
                      ? 'bg-purple-100 text-purple-700 border-r-2 border-purple-500' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon 
                    className={`
                      flex-shrink-0
                      ${isCollapsed ? iconSize : `mr-3 ${iconSize}`}
                      ${isActive ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500'}
                    `} 
                  />
                  {!isCollapsed && item.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Dashboard Controls (only show on dashboard tab) */}
        {activeTab === 'dashboard' && (onAddCustomCard || onResetLayout) && (
          <div className="mt-6 px-1">
            <div className="border-t border-gray-200 pt-4">
              {!isCollapsed && (
                <h3 className={`font-medium text-gray-500 uppercase tracking-wider mb-3 ${compactMode ? 'text-xs' : 'text-xs'}`}>
                  Dashboard Controls
                </h3>
              )}
              <div className="space-y-1">
                {onAddCustomCard && (
                  <button
                    onClick={onAddCustomCard}
                    className={`
                      flex items-center py-1.5 font-medium text-green-600 hover:bg-green-50 hover:text-green-700 rounded-md w-full transition-colors
                      ${isCollapsed ? 'justify-center px-1' : padding}
                      ${textSize}
                    `}
                    title={isCollapsed ? 'Add Custom Card' : undefined}
                  >
                    <Plus className={`
                      flex-shrink-0
                      ${isCollapsed ? iconSize : `mr-3 ${iconSize}`}
                      text-green-500
                    `} />
                    {!isCollapsed && 'Add Custom Card'}
                  </button>
                )}
                {onResetLayout && (
                  <button
                    onClick={onResetLayout}
                    className={`
                      flex items-center py-1.5 font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md w-full transition-colors
                      ${isCollapsed ? 'justify-center px-1' : padding}
                      ${textSize}
                    `}
                    title={isCollapsed ? 'Reset Layout' : undefined}
                  >
                    <RotateCcw className={`
                      flex-shrink-0
                      ${isCollapsed ? iconSize : `mr-3 ${iconSize}`}
                      text-gray-400
                    `} />
                    {!isCollapsed && 'Reset Layout'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
          </div>
        </div>
    </>
  );
};

export default DashboardSidebar;
