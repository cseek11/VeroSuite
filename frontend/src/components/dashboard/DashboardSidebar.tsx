import React from 'react';
import { 
  Home, 
  Calendar, 
  Users, 
  BarChart3, 
  Settings, 
  Upload, 
  Navigation,
  X
} from 'lucide-react';

interface DashboardSidebarProps {
  isOpen: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onClose: () => void;
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
  activeTab,
  onTabChange,
  onClose,
}) => {
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
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full transition-colors
                    ${isActive 
                      ? 'bg-purple-100 text-purple-700 border-r-2 border-purple-500' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon 
                    className={`
                      mr-3 h-5 w-5 flex-shrink-0
                      ${isActive ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500'}
                    `} 
                  />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            VeroPest Suite v1.0.0
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardSidebar;
