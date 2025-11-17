import React, { useState, useCallback, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Home, 
  BarChart3, 
  Users, 
  Calendar, 
  Settings, 
  Search,
  Bell,
  User,
  LogOut,
  Grid,
  List,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useDensityMode } from '@/hooks/useDensityMode';

interface MobileNavigationProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
  onSearch?: (query: string) => void;
  onToggleDensity?: () => void;
  onToggleView?: (view: 'grid' | 'list') => void;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
  notifications?: number;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onLogout?: () => void;
  className?: string;
}

export function MobileNavigation({
  currentPage = 'dashboard',
  onNavigate,
  onSearch,
  onToggleDensity,
  onToggleView,
  onToggleFullscreen,
  isFullscreen = false,
  notifications = 0,
  user,
  onLogout,
  className = ''
}: MobileNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('main');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { densityMode, isMobile, isTablet } = useDensityMode();

  // Navigation items
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
    { id: 'customers', label: 'Customers', icon: Users, badge: null },
    { id: 'schedule', label: 'Schedule', icon: Calendar, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null }
  ];

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [currentPage]);

  // Handle navigation
  const handleNavigate = useCallback((page: string) => {
    setActiveTab('main');
    if (onNavigate) onNavigate(page);
    setIsMenuOpen(false);
  }, [onNavigate]);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (onSearch) onSearch(query);
  }, [onSearch]);

  // Handle search submit
  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
    setIsSearchOpen(false);
  }, [searchQuery, handleSearch]);

  // Handle density toggle
  const handleToggleDensity = useCallback(() => {
    if (onToggleDensity) onToggleDensity();
  }, [onToggleDensity]);

  // Handle view toggle
  const handleToggleView = useCallback(() => {
    const newView = viewMode === 'grid' ? 'list' : 'grid';
    setViewMode(newView);
    if (onToggleView) onToggleView(newView);
  }, [viewMode, onToggleView]);

  // Handle fullscreen toggle
  const handleToggleFullscreen = useCallback(() => {
    if (onToggleFullscreen) onToggleFullscreen();
  }, [onToggleFullscreen]);

  // Handle logout
  const handleLogout = useCallback(() => {
    if (onLogout) onLogout();
    setIsMenuOpen(false);
  }, [onLogout]);

  // Get current navigation item
  const currentItem = navigationItems.find(item => item.id === currentPage);

  return (
    <div className={`mobile-navigation ${className}`}>
      {/* Top Navigation Bar */}
      <div className="mobile-nav-bar">
        <div className="flex items-center justify-between h-14 px-4 bg-white border-b border-gray-200">
          {/* Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Current Page Title */}
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {currentItem?.label || 'Dashboard'}
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
              aria-label="Search"
            >
              <Search className="w-6 h-6" />
            </button>

            {/* Notifications */}
            <button
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
              aria-label="Notifications"
            >
              <Bell className="w-6 h-6" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications > 99 ? '99+' : notifications}
                </span>
              )}
            </button>

            {/* User Menu */}
            <button
              onClick={() => setActiveTab('profile')}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
              aria-label="User menu"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
            <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  autoFocus
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Side Menu */}
      {isMenuOpen && (
        <div className="mobile-side-menu">
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
              className="flex-1 bg-black/50"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Panel */}
            <div className="w-80 bg-white shadow-xl flex flex-col">
              {/* Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('main')}
                  className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                    activeTab === 'main'
                      ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Main
                </button>
                <button
                  onClick={() => setActiveTab('tools')}
                  className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                    activeTab === 'tools'
                      ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Tools
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                    activeTab === 'profile'
                      ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Profile
                </button>
              </div>

              {/* Menu Content */}
              <div className="flex-1 overflow-y-auto">
                {activeTab === 'main' && (
                  <div className="p-4 space-y-2">
                    {navigationItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleNavigate(item.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                          currentPage === item.id
                            ? 'bg-purple-100 text-purple-700'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {activeTab === 'tools' && (
                  <div className="p-4 space-y-4">
                    {/* View Controls */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-900">View Controls</h3>
                      <div className="space-y-2">
                        <button
                          onClick={handleToggleView}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            {viewMode === 'grid' ? <Grid className="w-4 h-4" /> : <List className="w-4 h-4" />}
                            <span className="text-sm">View Mode</span>
                          </div>
                          <span className="text-sm text-gray-500 capitalize">{viewMode}</span>
                        </button>

                        <button
                          onClick={handleToggleDensity}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <Grid className="w-4 h-4" />
                            <span className="text-sm">Density</span>
                          </div>
                          <span className="text-sm text-gray-500 capitalize">{densityMode}</span>
                        </button>

                        <button
                          onClick={handleToggleFullscreen}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                            <span className="text-sm">Fullscreen</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {isFullscreen ? 'Exit' : 'Enter'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'profile' && (
                  <div className="p-4 space-y-4">
                    {/* User Info */}
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-12 h-12 rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email || 'user@example.com'}
                        </p>
                      </div>
                    </div>

                    {/* Profile Actions */}
                    <div className="space-y-2">
                      <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700">
                        <User className="w-4 h-4" />
                        <span className="text-sm">Edit Profile</span>
                      </button>

                      <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700">
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Preferences</span>
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation (for mobile) */}
      {isMobile && (
        <div className="mobile-bottom-nav">
          <div className="flex items-center justify-around h-16 bg-white border-t border-gray-200">
            {navigationItems.slice(0, 5).map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors touch-manipulation ${
                  currentPage === item.id
                    ? 'text-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        .mobile-navigation {
          position: relative;
          z-index: 40;
        }

        .mobile-nav-bar {
          position: sticky;
          top: 0;
          z-index: 50;
          background: white;
        }

        .mobile-side-menu {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 50;
        }

        .mobile-bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 50;
          background: white;
        }

        /* Touch optimizations */
        .touch-manipulation {
          touch-action: manipulation;
        }

        /* Tablet adjustments */
        @media (min-width: 768px) {
          .mobile-bottom-nav {
            display: none;
          }
        }

        /* Desktop adjustments */
        @media (min-width: 1024px) {
          .mobile-navigation {
            display: none;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .mobile-nav-bar {
            border-bottom-width: 2px;
          }
          
          .mobile-bottom-nav {
            border-top-width: 2px;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          * {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
