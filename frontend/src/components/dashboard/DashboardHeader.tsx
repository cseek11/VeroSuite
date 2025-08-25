import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bell, Menu, LogOut, Grid, Layout, Search, Filter, Plus, ChevronDown, Settings } from 'lucide-react';
import { User as UserType } from '@/types';
import {
  Button,
  Input,
  Dropdown,
  Avatar,
  Chip
} from '@/components/ui/EnhancedUI';

interface DashboardHeaderProps {
  user: UserType;
  sidebarOpen: boolean;
  sidebarCollapsed?: boolean;
  onSidebarToggle: () => void;
  onLogout: () => void;
  dashboardMode?: 'enhanced' | 'resizable';
  onDashboardModeToggle?: () => void;
  compactMode?: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  sidebarOpen,
  sidebarCollapsed = false,
  onSidebarToggle,
  onLogout,
  dashboardMode = 'enhanced',
  onDashboardModeToggle,
  compactMode = false,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [urgentNotifications] = useState(0);

  // Apply compact mode adjustments
  const headerHeight = compactMode ? 'h-12' : 'h-14';
  const textSize = compactMode ? 'text-xs' : 'text-sm';
  const buttonHeight = compactMode ? 'h-8' : 'h-9';
  const inputHeight = compactMode ? 'h-8' : 'h-9';
  const iconSize = compactMode ? 'h-4 w-4' : 'h-4 w-4';

  return (
    <header className="bg-[url('/branding/crm_BG_small.png')] bg-cover bg-center shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center ${headerHeight} gap-4`}>
          {/* Left side - Logo and Branding */}
          <div className="flex items-center">
            <button
              onClick={onSidebarToggle}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 lg:hidden"
            >
              <Settings className={iconSize} />
            </button>
            
            <img 
              src="/branding/vero_small.png" 
              alt="VeroPest Suite" 
              className={`h-8 w-auto transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-100' : 'opacity-0'}`} 
            />
          </div>

          {/* Center - Global Search */}
          <div className="flex-1 max-w-2xl mx-4 lg:mx-8 min-w-0">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${iconSize} text-gray-400`} />
              <Input
                type="text"
                placeholder="Search customers, jobs, invoices, technicians..."
                value={searchQuery}
                onChange={setSearchQuery}
                className={`pl-10 pr-16 w-full ${textSize} ${inputHeight}`}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <Filter className={`${iconSize} text-gray-400`} />
                <span className="text-xs text-gray-500 hidden sm:inline">⌘K</span>
              </div>
            </div>
          </div>

          {/* Right side - Notifications and Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
            {/* Dashboard Toggle */}
            <div className="hidden sm:flex items-center bg-gray-100 rounded-lg p-1 h-9">
              <button
                onClick={() => navigate('/dashboard')}
                className={`px-3 h-7 text-xs font-medium rounded-md transition-colors flex items-center ${
                  window.location.pathname === '/dashboard'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                VeroDash
              </button>
              <button
                onClick={() => navigate('/resizable-dashboard')}
                className={`px-3 h-7 text-xs font-medium rounded-md transition-colors flex items-center ${
                  window.location.pathname === '/resizable-dashboard'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                VeroCards
              </button>
            </div>

            {/* Quick Actions Dropdown */}
            <Dropdown
              trigger={
                <Button variant="outline" className={`flex items-center space-x-2 bg-white border-gray-300 hover:bg-gray-50 ${buttonHeight}`}>
                  <Plus className={iconSize} />
                  <span className="hidden sm:inline">Quick Actions</span>
                  <ChevronDown className={iconSize} />
                </Button>
              }
              items={[
                { label: 'Create Work Order', icon: Plus, onClick: () => navigate('/jobs/new') },
                { label: 'Schedule Job', icon: Layout, onClick: () => navigate('/jobs/new') },
                { label: 'Add Customer', icon: User, onClick: () => navigate('/customers/new') },
                { label: 'View Reports', icon: Grid, onClick: () => navigate('/reports') }
              ]}
            />

            {/* Notifications Center */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative w-9 ${buttonHeight} rounded-md text-gray-400 hover:text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 flex items-center justify-center`}
              >
                <Bell className={iconSize} />
                {urgentNotifications > 0 && (
                  <Chip 
                    variant="danger" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs"
                  >
                    {urgentNotifications}
                  </Chip>
                )}
              </button>
            </div>

            {/* User Menu */}
            <div className="relative">
              <Dropdown
                trigger={
                  <div className={`flex items-center space-x-3 cursor-pointer px-3 py-2 rounded-md bg-white border border-gray-200 hover:bg-gray-50 ${buttonHeight}`}>
                    <Avatar size="sm" fallback={`${user?.first_name?.charAt(0) || ''}${user?.last_name?.charAt(0) || ''}`} />
                    <div className="hidden md:block text-left">
                      <p className={`font-medium text-gray-900 ${textSize}`}>
                        {user?.first_name || 'User'} {user?.last_name || ''}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email || 'No email'}</p>
                    </div>
                    <ChevronDown className={`${iconSize} text-gray-400`} />
                  </div>
                }
                items={[
                  { label: 'Profile Settings', icon: Settings, onClick: () => navigate('/settings') },
                  { label: 'Logout', icon: LogOut, onClick: onLogout }
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
