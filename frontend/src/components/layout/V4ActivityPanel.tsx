import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight,
  Bell,
  Mail,
  User,
  MessageCircle,
  Phone,
  FileText
} from 'lucide-react';

interface V4ActivityPanelProps {
  collapsed: boolean;
  onToggle: () => void;
  sidebarCollapsed?: boolean; // Add this prop
}

const activityItems = [
  {
    id: 1,
    type: 'notification',
    icon: Bell,
    title: 'New notification',
    time: '2 minutes ago',
    color: 'bg-red-100 text-red-600'
  },
  {
    id: 2,
    type: 'email',
    icon: Mail,
    title: 'New email',
    time: '5 minutes ago',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: 3,
    type: 'user',
    icon: User,
    title: 'User activity',
    time: '10 minutes ago',
    color: 'bg-green-100 text-green-600'
  },
  {
    id: 4,
    type: 'crm',
    icon: FileText,
    title: 'CRM update',
    time: '15 minutes ago',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    id: 5,
    type: 'chat',
    icon: MessageCircle,
    title: 'New chat message',
    time: '20 minutes ago',
    color: 'bg-yellow-100 text-yellow-600'
  },
  {
    id: 6,
    type: 'phone',
    icon: Phone,
    title: 'Missed call',
    time: '1 hour ago',
    color: 'bg-indigo-100 text-indigo-600'
  }
];

export default function V4ActivityPanel({ collapsed, onToggle, sidebarCollapsed = true }: V4ActivityPanelProps) {
  // Adjust width based on sidebar state
  const getPanelWidth = () => {
    if (collapsed) return 'w-16';
    // If sidebar is open, make activity panel narrower
    if (!sidebarCollapsed) return 'w-56'; // Reduced from w-72
    return 'w-72'; // Full width when sidebar is closed
  };

  return (
    <aside className={`
      bg-gradient-to-b from-white/80 via-white/80 to-purple-400/20 border-l border-gray-200 shadow-2xl transition-all duration-300 ease-in-out flex-shrink-0 flex flex-col relative
      ${getPanelWidth()}
    `}>
      {/* Activity Panel Toggle Button */}
      <button 
        className="absolute -left-3 top-6 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors z-20"
        onClick={onToggle}
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>
      
      {/* Activity Panel Header */}
      <div className="p-3 border-b border-gray-200 flex-shrink-0">
        {!collapsed && (
          <h3 className="font-semibold text-gray-800 transition-opacity duration-200 text-sm">
            Vero Feed
          </h3>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <Bell className="w-4 h-4 text-gray-600" />
          </div>
        )}
      </div>
      
      {/* Activity Panel Content */}
      <div className="flex-1 overflow-y-auto p-3 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
        <div className="space-y-2">
          {activityItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <div 
                key={item.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                {!collapsed && (
                  <div className="flex-1 min-w-0 transition-opacity duration-200">
                    <div className="text-sm font-medium text-gray-800 truncate">{item.title}</div>
                    <div className="text-xs text-gray-500">{item.time}</div>
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Working Status - After last activity item */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            {!collapsed && (
              <div className="flex items-center justify-center gap-2">
                <div className="text-xs text-gray-600">Status:</div>
                <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                  WORKING
                </div>
              </div>
            )}
            {collapsed && (
              <div className="flex justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
