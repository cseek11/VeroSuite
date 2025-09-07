import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  Search, 
  Bell, 
  HelpCircle, 
  ChevronDown, 
  Bug,
  Rocket,
  User,
  LogOut,
  Settings,
  Layout,
  Grid,
  Plus,
  Users,
  X,
  Command
} from 'lucide-react';

interface V4TopBarProps {
  onMobileMenuToggle: () => void;
  onLogout: () => void;
  user: any;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
  activityPanelCollapsed?: boolean;
  onActivityPanelToggle?: () => void;
}

export default function V4TopBar({ 
  onMobileMenuToggle, 
  onLogout, 
  user, 
  sidebarCollapsed, 
  onSidebarToggle, 
  activityPanelCollapsed, 
  onActivityPanelToggle 
}: V4TopBarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showQuickActionsMenu, setShowQuickActionsMenu] = useState(false);
  const [currentTime] = useState(() => {
    const now = new Date();
    return {
      current: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      end: '6:00 PM'
    };
  });

  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're on a dashboard route
  const isOnDashboard = location.pathname === '/dashboard';
  const isOnResizableDashboard = location.pathname === '/resizable-dashboard';

  // Keyboard shortcuts data
  const keyboardShortcuts = [
    { key: '⌘ + K', description: 'Quick Search', action: 'Open global search' },
    { key: '⌘ + N', description: 'New Job', action: 'Create new work order' },
    { key: '⌘ + C', description: 'New Customer', action: 'Add new customer' },
    { key: '⌘ + D', description: 'Dashboard', action: 'Go to dashboard' },
    { key: '⌘ + J', description: 'Jobs', action: 'View all jobs' },
    { key: '⌘ + S', description: 'Settings', action: 'Open settings' },
    { key: '⌘ + /', description: 'Shortcuts', action: 'Show this help' },
    { key: '⌘ + 1', description: 'VeroDash', action: 'Switch to VeroDash' },
    { key: '⌘ + 2', description: 'VeroCards', action: 'Switch to VeroCards' },
    { key: '⌘ + B', description: 'Toggle Sidebar', action: 'Collapse/expand sidebar' },
    { key: '⌘ + A', description: 'Toggle Activity Panel', action: 'Show/hide activity panel' },
    { key: 'Esc', description: 'Close Modal', action: 'Close any open modal' },
  ];

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger when typing in input fields
      const target = event.target as HTMLElement;
      const isInputField = target.tagName === 'INPUT' || 
                          target.tagName === 'TEXTAREA' || 
                          target.contentEditable === 'true' ||
                          target.closest('[contenteditable="true"]') ||
                          target.closest('input') ||
                          target.closest('textarea') ||
                          target.closest('[data-search-input]') ||
                          target.hasAttribute('data-search-input');
      
      // Debug logging for V4TopBar
      console.log('🔝 V4TopBar keyDown:', {
        key: event.key,
        target: target.tagName,
        isInputField,
        hasDataSearchInput: target.hasAttribute('data-search-input'),
        id: target.id
      });
      
      if (isInputField) {
        console.log('🚫 V4TopBar BLOCKED for input field');
        return; // Don't trigger shortcuts when typing in input fields
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdKey = isMac ? event.metaKey : event.ctrlKey;

      if (cmdKey) {
        switch (event.key.toLowerCase()) {
          case 'k':
            event.preventDefault();
            // Focus search input
            const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
            if (searchInput) {
              searchInput.focus();
            }
            break;
          case 'n':
            event.preventDefault();
            navigate('/jobs/new');
            break;
          case 'c':
            event.preventDefault();
            navigate('/customers/new');
            break;
          case 'd':
            event.preventDefault();
            navigate('/dashboard');
            break;
          case 'j':
            event.preventDefault();
            navigate('/jobs');
            break;
          case 's':
            event.preventDefault();
            navigate('/settings');
            break;
          case '/':
            event.preventDefault();
            setShowKeyboardShortcuts(true);
            break;
          case '1':
            event.preventDefault();
            navigate('/dashboard');
            break;
          case '2':
            event.preventDefault();
            navigate('/resizable-dashboard');
            break;
          case 'b':
            event.preventDefault();
            if (onSidebarToggle) {
              onSidebarToggle();
            }
            break;
          case 'a':
            event.preventDefault();
            if (onActivityPanelToggle) {
              onActivityPanelToggle();
            }
            break;
        }
      } else if (event.key === 'Escape') {
        setShowKeyboardShortcuts(false);
        setShowUserMenu(false);
        setShowQuickActionsMenu(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate, onSidebarToggle, onActivityPanelToggle]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.quick-actions-dropdown')) {
        setShowQuickActionsMenu(false);
      }
      if (!target.closest('.user-menu-dropdown')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

     return (
       <>
         <header className="bg-gradient-to-r from-gray-800 via-gray-700 to-purple-600 text-white shadow-lg z-30">
           <div className={`px-3 py-3 flex items-center gap-6 transition-all duration-300 ${
             sidebarCollapsed ? 'justify-center' : 'justify-start'
           }`}>
        {/* Hamburger Menu */}
        <button 
          className="md:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
          onClick={onMobileMenuToggle}
        >
          <Menu className="w-4 h-4" />
        </button>
        
                 {/* Logo - Animated to slide left and disappear */}
         <div className={`flex items-center transition-all duration-300 ease-in-out ${
           sidebarCollapsed ? 'w-auto translate-x-0 opacity-100' : 'w-0 -translate-x-full opacity-0 overflow-hidden'
         }`}>
           <div className="flex items-center justify-center">
             <img 
               src="/branding/vero_small.png" 
               alt="VeroPest" 
               className="w-auto h-auto drop-shadow-lg"
             />
           </div>
         </div>
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input 
            id="topbar-search"
            name="topbar-search"
            className="w-full pl-8 pr-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
            placeholder="Search..." 
          />
        </div>
        
        {/* Time & Status - Compact */}
        <div className="flex items-center gap-2 text-xs flex-shrink-0">
          <div className="text-center">
            <div className="font-semibold">{currentTime.current}</div>
            <div className="opacity-80">End: {currentTime.end}</div>
          </div>
        </div>
        
                 {/* User Profile - Compact */}
         <div className="flex items-center gap-2 flex-shrink-0">
           <div className="text-center hidden sm:block">
             <div className="font-semibold text-sm">{user?.name || 'Kevin Davis'}</div>
             <div className="text-xs opacity-80">{user?.role || 'Admin'}</div>
           </div>
           <div className="relative user-menu-dropdown">
            <button 
              className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <ChevronDown className="w-3 h-3" />
            </button>
            
                         {/* User Dropdown Menu */}
             {showUserMenu && (
               <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                 <div className="px-4 py-2 border-b border-gray-100">
                   <div className="font-semibold text-gray-800">{user?.name || 'Kevin Davis'}</div>
                   <div className="text-sm text-gray-500 truncate">{user?.email || 'kevin@veropest.com'}</div>
                 </div>
                <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button 
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                  onClick={onLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Quick Actions - Compact */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Dashboard Toggle - Always Visible */}
          <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-0.5 h-6">
            <button
              onClick={() => navigate('/dashboard')}
              className={`px-1 h-4 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
                isOnDashboard
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <Layout className="w-2 h-2" />
              <span className="hidden sm:inline text-xs">VeroDash</span>
            </button>
            <button
              onClick={() => navigate('/resizable-dashboard')}
              className={`px-1 h-4 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
                isOnResizableDashboard
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <Grid className="w-2 h-2" />
              <span className="hidden sm:inline text-xs">VeroCards</span>
            </button>
          </div>

          {/* Quick Actions - Icons Only */}
          <div className="relative quick-actions-dropdown">
            <button 
              onClick={() => setShowQuickActionsMenu(!showQuickActionsMenu)}
              className="bg-white/20 hover:bg-white/30 p-1.5 rounded text-xs font-semibold transition-colors flex items-center justify-center"
              title="Quick Actions"
            >
              <Plus className="w-3 h-3" />
            </button>
            
            {/* Quick Actions Dropdown */}
            {showQuickActionsMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button
                  onClick={() => {
                    navigate('/jobs/new');
                    setShowQuickActionsMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Job
                </button>
                <button
                  onClick={() => {
                    navigate('/work-orders');
                    setShowQuickActionsMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Work Order
                </button>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => navigate('/customers/new')}
            className="bg-white/20 hover:bg-white/30 p-1.5 rounded text-xs font-semibold transition-colors flex items-center justify-center"
            title="Add Customer"
          >
            <Users className="w-3 h-3" />
          </button>

          <button 
            onClick={() => setShowKeyboardShortcuts(true)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title="Keyboard Shortcuts (⌘ + /)"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          
          {/* Activity Panel Toggle */}
          <button 
            onClick={onActivityPanelToggle}
            className={`p-1.5 rounded-lg transition-colors ${
              activityPanelCollapsed 
                ? 'hover:bg-white/10' 
                : 'bg-white/20 hover:bg-white/30'
            }`}
            title="Toggle Activity Panel (⌘ + A)"
          >
            <Bell className="w-4 h-4" />
          </button>
          
          <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
              59
            </span>
          </button>
        </div>
      </div>
    </header>

    {/* Keyboard Shortcuts Modal */}
    {showKeyboardShortcuts && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Command className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Keyboard Shortcuts</h2>
                <p className="text-sm text-gray-500">Quick access to common actions</p>
              </div>
            </div>
            <button
              onClick={() => setShowKeyboardShortcuts(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {keyboardShortcuts.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{shortcut.description}</div>
                    <div className="text-sm text-gray-500">{shortcut.action}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    {shortcut.key.split(' + ').map((key, keyIndex) => (
                      <React.Fragment key={keyIndex}>
                        {keyIndex > 0 && <span className="text-gray-400">+</span>}
                        <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded shadow-sm">
                          {key}
                        </kbd>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">
              <p className="mb-2"><strong>Tip:</strong> Press <kbd className="px-1 py-0.5 text-xs bg-white border border-gray-300 rounded">Esc</kbd> to close this modal.</p>
              <p>Keyboard shortcuts work when you're not typing in input fields.</p>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
  );
}
