import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth';

interface SoftNavbarProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  showUserMenu?: boolean;
  showThemeToggle?: boolean;
  className?: string;
  onSearch?: (query: string) => void;
  onThemeToggle?: () => void;
}

const SoftNavbar: React.FC<SoftNavbarProps> = ({
  title,
  subtitle,
  showSearch = true,
  showNotifications = true,
  showUserMenu = true,
  showThemeToggle = true,
  className = '',
  onSearch,
  onThemeToggle
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { user, clear } = useAuthStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const handleLogout = () => {
    clear();
    setIsUserMenuOpen(false);
  };

  const notifications = [
    { id: 1, title: 'New job assigned', message: 'You have been assigned a new job', time: '2 min ago', unread: true },
    { id: 2, title: 'Customer update', message: 'Customer information has been updated', time: '1 hour ago', unread: true },
    { id: 3, title: 'System maintenance', message: 'Scheduled maintenance completed', time: '3 hours ago', unread: false },
  ];

  return (
    <nav className={`relative z-40 flex h-20 items-center justify-between rounded-xl bg-white bg-clip-border p-4 shadow-lg ${className}`}>
      {/* Left side - Title and Breadcrumb */}
      <div className="flex items-center">
        {title && (
          <div>
            <h6 className="text-sm font-bold text-slate-700">{title}</h6>
            {subtitle && (
              <p className="text-xs text-slate-500">{subtitle}</p>
            )}
          </div>
        )}
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        {showSearch && (
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 text-sm bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
          </form>
        )}

        {/* Theme Toggle */}
        {showThemeToggle && (
          <button
            onClick={onThemeToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Sun className="w-5 h-5 text-slate-700" />
          </button>
        )}

        {/* Notifications */}
        {showNotifications && (
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-5 h-5 text-slate-700" />
              {notifications.filter(n => n.unread).length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-slate-700">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        notification.unread ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-slate-700">{notification.title}</p>
                          <p className="text-xs text-slate-500 mt-1">{notification.message}</p>
                          <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-200">
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* User Menu */}
        {showUserMenu && user && (
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tl from-blue-500 to-violet-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-slate-700">{user.email}</p>
                <p className="text-xs text-slate-500">User</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-700" />
            </button>

            {/* User Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="py-1">
                  <button className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-gray-100">
                    <User className="w-4 h-4 mr-3" />
                    Profile
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-gray-100">
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Backdrop for dropdowns */}
      {(isUserMenuOpen || isNotificationsOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsUserMenuOpen(false);
            setIsNotificationsOpen(false);
          }}
        />
      )}
    </nav>
  );
};

export default SoftNavbar;
