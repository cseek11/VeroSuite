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
  MessageCircle,
  DollarSign,
  BookOpen,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { BugIcon } from '../icons/BugIcon';

interface V4SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard', badge: null },
  { id: 'crm', label: 'CRM', icon: Users, path: '/customers', badge: '2.1k' },
  { id: 'scheduling', label: 'Scheduling', icon: Calendar, path: '/jobs', badge: '47' },
  { id: 'communications', label: 'Communications', icon: MessageCircle, path: '/communications', badge: '3' },
  { id: 'finance', label: 'Finance', icon: DollarSign, path: '/finance', badge: '$45k' },
  { id: 'reports', label: 'Reports', icon: BarChart3, path: '/reports', badge: null },
  { id: 'knowledge', label: 'Knowledge', icon: BookOpen, path: '/knowledge', badge: null },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings', badge: null },
];

export default function V4Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: V4SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/') return 'dashboard';
    if (path === '/customers') return 'crm';
    if (path === '/jobs') return 'scheduling';
    if (path === '/communications') return 'communications';
    if (path === '/finance') return 'finance';
    if (path === '/reports') return 'reports';
    if (path === '/knowledge') return 'knowledge';
    if (path === '/settings') return 'settings';
    return 'dashboard';
  };
  
  const activeTab = getActiveTab();
  
  const handleNavigation = (path: string) => {
    navigate(path);
    onMobileClose();
  };

  // Calculate the exact position for the sliding indicator
  const getIndicatorPosition = () => {
    const itemHeight = 44; // Standard height: py-2 (8px) + content (~28px) + space-y-1 (4px) + padding (4px)
    const itemSpacing = 4; // space-y-1
    const topPadding = 12; // nav padding
    const activeIndex = navigationItems.findIndex(item => item.id === activeTab);
    return topPadding + (activeIndex * (itemHeight + itemSpacing));
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onMobileClose}
        />
      )}

             {/* Sidebar */}
               <aside className={`
                  relative z-50 h-screen bg-gradient-to-b from-gray-900/90 to-gray-800/90 backdrop-blur-xl shadow-3xl transition-all duration-300 ease-in-out flex-shrink-0
         ${collapsed ? 'w-16' : 'w-56'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
        {/* Toggle Button */}
        <button 
          className="absolute -right-3 top-6 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors z-10"
          onClick={onToggle}
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>
        
                 {/* Logo */}
                   <div className="p-5 flex items-center justify-center border-b border-gray-600">
                                     <div className="w-10 h-10 flex items-center justify-center border border-purple-500 rounded-lg bg-gray-800">
              <BugIcon size={36} />
            </div>
                         {!collapsed && (
               <div className="ml-3 flex items-center transition-opacity duration-200">
                 <svg viewBox="0 0 150 30" className="h-8 w-auto">
                   <text x="0" y="22" fontSize="20" fontWeight="700" fill="#a855f7">Vero</text>
                   <text x="45" y="22" fontSize="20" fontWeight="700" fill="#22c55e">Suite</text>
                 </svg>
               </div>
             )}
          </div>
        
                 {/* Navigation Icons */}
         <nav className="p-3 overflow-y-auto grow">
                       <div className="space-y-1">
             
             {navigationItems.map((item) => {
               const Icon = item.icon;
               const isActive = activeTab === item.id;
               
               return (
                 <div key={item.id} className="relative">
                   <button
                                           className={`
                        w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-all duration-200 relative h-11
                       ${isActive 
                         ? 'bg-green-500/20 text-green-400 border-l-4 border-green-500' 
                         : 'text-gray-400 hover:bg-white/10 hover:text-white'
                       }
                     `}
                     onClick={() => handleNavigation(item.path)}
                     title={collapsed ? item.label : undefined}
                   >
                                           <div className="w-8 h-8 flex items-center justify-center rounded-lg">
                        <Icon className="w-4 h-4" />
                      </div>
                     {!collapsed && (
                       <span className="text-sm font-medium transition-opacity duration-200">
                         {item.label}
                       </span>
                     )}
                   </button>
                   {item.badge && (
                     <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-semibold">
                       {item.badge}
                     </span>
                   )}
                 </div>
               );
             })}
           </div>
         </nav>
        
        {/* User Profile */}
        <div className="p-3 border-t border-gray-600">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center text-sm font-semibold cursor-pointer">
                KD
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
            </div>
            {!collapsed && (
              <div className="text-white text-sm font-medium transition-opacity duration-200">
                Kevin Davis
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
