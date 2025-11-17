import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity,
  Bell,
  Mail,
  MessageCircle,
  Phone,
  User,
  FileText,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Filter,
  Archive,
  Settings,
  RefreshCw
} from 'lucide-react';
import { logger } from '@/utils/logger';

interface ActivityAction {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  action?: () => void;
  badge?: string | number;
  color?: string;
  description?: string;
}

interface ActivityCategory {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  actions: ActivityAction[];
}

interface ExpandableActivityFABSystemProps {
  className?: string;
}

export default function ExpandableActivityFABSystem({ className = '' }: ExpandableActivityFABSystemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const fabRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Activity Categories with VeroField-specific features
  const activityCategories: ActivityCategory[] = [
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      color: 'bg-red-500 hover:bg-red-600',
      actions: [
        { 
          id: 'view-all-notifications', 
          label: 'View All Notifications', 
          icon: Bell, 
          badge: 12,
          description: 'See all recent notifications',
          action: () => logger.debug('View all notifications', {}, 'ExpandableActivityFABSystem')
        },
        { 
          id: 'emergency-alerts', 
          label: 'Emergency Alerts', 
          icon: AlertCircle, 
          badge: 2,
          color: 'text-red-600',
          description: 'Urgent system alerts',
          action: () => logger.debug('Emergency alerts', {}, 'ExpandableActivityFABSystem')
        },
        { 
          id: 'job-updates', 
          label: 'Job Updates', 
          icon: CheckCircle, 
          badge: 8,
          description: 'Work order status changes',
          action: () => logger.debug('Job updates', {}, 'ExpandableActivityFABSystem')
        },
        { 
          id: 'system-notifications', 
          label: 'System Notifications', 
          icon: Settings,
          badge: 2,
          description: 'System and app updates',
          action: () => logger.debug('System notifications', {}, 'ExpandableActivityFABSystem')
        }
      ]
    },
    {
      id: 'communications',
      label: 'Communications',
      icon: MessageCircle,
      color: 'bg-blue-500 hover:bg-blue-600',
      actions: [
        { 
          id: 'recent-messages', 
          label: 'Recent Messages', 
          icon: MessageCircle, 
          badge: 5,
          description: 'Latest chat messages',
          action: () => navigate('/communications')
        },
        { 
          id: 'missed-calls', 
          label: 'Missed Calls', 
          icon: Phone, 
          badge: 3,
          color: 'text-orange-600',
          description: 'Unanswered phone calls',
          action: () => logger.debug('Missed calls', {}, 'ExpandableActivityFABSystem')
        },
        { 
          id: 'new-emails', 
          label: 'New Emails', 
          icon: Mail, 
          badge: 7,
          description: 'Unread email messages',
          action: () => logger.debug('New emails', {}, 'ExpandableActivityFABSystem')
        },
        { 
          id: 'customer-inquiries', 
          label: 'Customer Inquiries', 
          icon: User,
          badge: 4,
          description: 'Customer support requests',
          action: () => logger.debug('Customer inquiries', {}, 'ExpandableActivityFABSystem')
        }
      ]
    },
    {
      id: 'activity-feed',
      label: 'Activity Feed',
      icon: TrendingUp,
      color: 'bg-green-500 hover:bg-green-600',
      actions: [
        { 
          id: 'recent-activity', 
          label: 'Recent Activity', 
          icon: Clock,
          description: 'Latest system activity',
          action: () => logger.debug('Recent activity', {}, 'ExpandableActivityFABSystem')
        },
        { 
          id: 'user-actions', 
          label: 'User Actions', 
          icon: User,
          description: 'Team member activities',
          action: () => logger.debug('User actions', {}, 'ExpandableActivityFABSystem')
        },
        { 
          id: 'system-events', 
          label: 'System Events', 
          icon: Settings,
          description: 'Automated system events',
          action: () => logger.debug('System events', {}, 'ExpandableActivityFABSystem')
        },
        { 
          id: 'data-changes', 
          label: 'Data Changes', 
          icon: FileText,
          description: 'Record modifications',
          action: () => logger.debug('Data changes', {}, 'ExpandableActivityFABSystem')
        }
      ]
    },
    {
      id: 'quick-tools',
      label: 'Quick Tools',
      icon: Settings,
      color: 'bg-purple-500 hover:bg-purple-600',
      actions: [
        { 
          id: 'mark-all-read', 
          label: 'Mark All Read', 
          icon: CheckCircle,
          description: 'Clear all notifications',
          action: () => logger.debug('Mark all read', {}, 'ExpandableActivityFABSystem')
        },
        { 
          id: 'filter-activity', 
          label: 'Filter Activity', 
          icon: Filter,
          description: 'Filter activity feed',
          action: () => logger.debug('Filter activity', {}, 'ExpandableActivityFABSystem')
        },
        { 
          id: 'archive-old', 
          label: 'Archive Old Items', 
          icon: Archive,
          description: 'Archive old notifications',
          action: () => logger.debug('Archive old', {}, 'ExpandableActivityFABSystem')
        },
        { 
          id: 'refresh-feed', 
          label: 'Refresh Feed', 
          icon: RefreshCw,
          description: 'Refresh activity feed',
          action: () => logger.debug('Refresh feed', {}, 'ExpandableActivityFABSystem')
        },
        { 
          id: 'activity-settings', 
          label: 'Activity Settings', 
          icon: Settings,
          description: 'Configure notifications',
          action: () => navigate('/settings/notifications')
        }
      ]
    }
  ];

  // Close FAB system when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fabRef.current && !fabRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        setExpandedCategory(null);
      }
    };

    // Only add listener when expanded to avoid unnecessary event handling
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isExpanded]);


  // Handle action execution
  const handleAction = (action: ActivityAction) => {
    if (action.action) {
      action.action();
    }
    
    // Close FAB system after action
    setIsExpanded(false);
    setExpandedCategory(null);
  };

  // Handle category click
  const handleCategoryClick = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
    }
  };

  return (
    <>
      {/* Custom Animations */}
      <style>{`
        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      
      <div className={`fixed bottom-6 right-6 z-50 ${className}`} ref={fabRef}>

        {/* Fixed Action Panel Area - Always in same location (right side) */}
        {isExpanded && expandedCategory && (
          <div className="fixed bottom-6 right-24 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 animate-in slide-in-from-right duration-200">
            {(() => {
              const selectedCategory = activityCategories.find(cat => cat.id === expandedCategory);
              if (!selectedCategory) return null;
              
              const CategoryIcon = selectedCategory.icon;
              return (
                <>
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
                    <div className={`w-8 h-8 ${selectedCategory.color} text-white rounded-full flex items-center justify-center`}>
                      <CategoryIcon className="w-4 h-4" />
                    </div>
                    <div className="font-semibold text-gray-800">{selectedCategory.label}</div>
                  </div>
                  
                  <div className="space-y-1 max-h-80 overflow-y-auto">
                    {selectedCategory.actions.map((action) => {
                      const ActionIcon = action.icon;
                      return (
                        <button
                          key={action.id}
                          onClick={() => handleAction(action)}
                          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left group"
                          title={action.description}
                        >
                          <div className="w-8 h-8 bg-gray-100 group-hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
                            <ActionIcon className={`w-4 h-4 ${action.color || 'text-gray-600'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-800 truncate">{action.label}</div>
                            {action.description && (
                              <div className="text-xs text-gray-500 truncate">{action.description}</div>
                            )}
                          </div>
                          {action.badge && (
                            <div className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                              {action.badge}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              );
            })()}
          </div>
        )}

        <div className="flex flex-col-reverse items-end gap-2">
          {/* Main Activity FAB Button */}
          <div className="relative group">
            <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsExpanded(!isExpanded);
              if (isExpanded) {
                setExpandedCategory(null);
              }
            }}
              className={`
                w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 relative z-10 cursor-pointer active:scale-95
                ${isExpanded 
                  ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
                }
              `}
              title={isExpanded ? 'Close Activity Panel' : 'Open Activity Panel'}
            >
              <Activity className={`w-8 h-8 transition-transform duration-300 ${isExpanded ? 'rotate-45' : ''}`} />
            </button>

            {/* Pulse animation on hover only when collapsed */}
            {!isExpanded && (
              <div className="absolute inset-0 rounded-full bg-orange-500 opacity-0 group-hover:opacity-20 group-hover:animate-ping transition-opacity"></div>
            )}

          </div>

          {/* Category Selection Buttons - Vertical Stack */}
          {isExpanded && (
            <div className="flex flex-col-reverse gap-2">
              {activityCategories.map((category, index) => {
                const CategoryIcon = category.icon;
                const isCategoryExpanded = expandedCategory === category.id;
                
                return (
                  <div 
                    key={category.id}
                    className="relative flex items-center gap-3 group"
                    style={{ 
                      animation: `slideInFromBottom 300ms ease-out forwards`,
                      animationDelay: `${index * 50}ms`,
                      opacity: 0,
                      transform: 'translateY(20px)'
                    }}
                  >
                    {/* Category Label - Only show on hover for inactive categories */}
                    {!isCategoryExpanded && (
                      <div className="absolute right-full mr-2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        {category.label}
                      </div>
                    )}

                    {/* Category FAB */}
                    <button 
                      onClick={() => handleCategoryClick(category.id)}
                      className={`
                        ${isCategoryExpanded ? 'w-12 h-12' : 'w-8 h-8'} ${category.color} text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110
                        ${isCategoryExpanded ? 'ring-4 ring-white ring-opacity-50' : 'opacity-60 hover:opacity-100'}
                      `}
                      title={`${category.label} Actions`}
                    >
                      <CategoryIcon className={`${isCategoryExpanded ? 'w-6 h-6' : 'w-4 h-4'}`} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
