import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Users, 
  Settings, 
  FileText, 
  MapPin, 
  Upload,
  Menu,
  X
} from 'lucide-react';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
}

interface SoftSidebarProps {
  brandName?: string;
  brandLogo?: string;
  items?: SidebarItem[];
  className?: string;
  onClose?: () => void;
}

const defaultItems: SidebarItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: Home },
  { name: 'Jobs', path: '/jobs', icon: Calendar },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Routing', path: '/routing', icon: MapPin },
  { name: 'Uploads', path: '/uploads', icon: Upload },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const SoftSidebar: React.FC<SoftSidebarProps> = ({
  brandName = 'VeroSuite',
  brandLogo,
  items = defaultItems,
  className = '',
  onClose
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
    onClose?.();
  };

  const badgeColorClasses = {
    primary: 'bg-gradient-to-tl from-blue-500 to-violet-500',
    secondary: 'bg-gradient-to-tl from-slate-600 to-slate-400',
    info: 'bg-gradient-to-tl from-blue-500 to-cyan-400',
    success: 'bg-gradient-to-tl from-emerald-500 to-teal-400',
    warning: 'bg-gradient-to-tl from-orange-500 to-yellow-500',
    error: 'bg-gradient-to-tl from-red-500 to-pink-500',
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="xl:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-soft-xl"
      >
        <Menu className="w-6 h-6 text-slate-700" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="xl:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`max-w-62.5 ease-nav-brand z-990 fixed inset-y-0 my-4 ml-4 block w-full -translate-x-full flex-wrap items-center justify-between overflow-y-auto rounded-2xl border-0 bg-white p-0 antialiased shadow-none transition-transform duration-200 xl:left-0 xl:translate-x-0 xl:bg-transparent ${isOpen ? 'translate-x-0' : ''} ${className}`}>
        {/* Brand */}
        <div className="h-19.5">
          <button
            onClick={closeSidebar}
            className="absolute top-0 right-0 p-4 opacity-50 cursor-pointer text-slate-400 xl:hidden"
          >
            <X className="w-5 h-5" />
          </button>
          <Link 
            to="/dashboard" 
            className="block px-8 py-6 m-0 text-sm whitespace-nowrap text-slate-700"
            onClick={closeSidebar}
          >
            {brandLogo ? (
              <img 
                src={brandLogo} 
                className="inline h-full max-w-full transition-all duration-200 ease-nav-brand max-h-8" 
                alt="logo" 
              />
            ) : (
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tl from-blue-500 to-violet-500 text-white font-bold text-lg">
                V
              </div>
            )}
            <span className="ml-1 font-semibold transition-all duration-200 ease-nav-brand">
              {brandName}
            </span>
          </Link>
        </div>

        {/* Divider */}
        <hr className="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent" />

        {/* Navigation */}
        <div className="items-center block w-auto max-h-screen overflow-auto h-sidenav grow basis-full">
          <ul className="flex flex-col pl-0 mb-0">
            {items.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={index} className="mt-0.5 w-full">
                  <Link
                    to={item.path}
                    onClick={closeSidebar}
                    className={`py-2.7 text-sm ease-nav-brand my-0 mx-4 flex items-center whitespace-nowrap px-4 transition-colors ${
                      isActive 
                        ? 'shadow-soft-xl rounded-lg bg-white font-semibold text-slate-700' 
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    <div className={`shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center stroke-0 text-center xl:p-2.5 ${
                      isActive ? 'bg-gradient-to-tl from-purple-700 to-pink-500' : ''
                    }`}>
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-700'}`} />
                    </div>
                    <span className="ml-1 duration-300 opacity-100 pointer-events-none ease-soft">
                      {item.name}
                    </span>
                    {item.badge && (
                      <span className={`ml-auto px-2 py-1 text-xs font-bold leading-none rounded-full text-white ${badgeColorClasses[item.badgeColor || 'primary']}`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default SoftSidebar;
