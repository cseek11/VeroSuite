import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus,
  Users,
  ClipboardList,
  Calendar,
  DollarSign,
  UserCheck,
  Zap,
  Home,
  Search,
  UserPlus,
  TrendingUp,
  MapPin,
  FileText,
  CreditCard,
  Bell,
  Settings,
  HelpCircle,
  Clock,
  CheckSquare,
  AlertCircle,
  Star,
  BarChart3,
  Eye,
  Phone,
  Mail
} from 'lucide-react';

interface FABAction {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path?: string;
  action?: () => void;
  badge?: string | number;
  color?: string;
  description?: string;
}

interface FABCategory {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  actions: FABAction[];
}

interface ExpandableFABSystemProps {
  className?: string;
}

export default function ExpandableFABSystem({ className = '' }: ExpandableFABSystemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const fabRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();


  // FAB Categories with VeroSuite-specific actions
  const fabCategories: FABCategory[] = [
    {
      id: 'customers',
      label: 'Customer Operations',
      icon: Users,
      color: 'bg-blue-500 hover:bg-blue-600',
      actions: [
        { 
          id: 'view-customers', 
          label: 'View All Customers', 
          icon: Users, 
          path: '/customers', 
          badge: '2.1k',
          description: 'Browse and manage all customers'
        },
        { 
          id: 'add-customer', 
          label: 'Add New Customer', 
          icon: UserPlus, 
          path: '/customers/new',
          description: 'Create a new customer record'
        },
        { 
          id: 'search-customers', 
          label: 'Search Customers', 
          icon: Search,
          action: () => {
            // Focus global search or open customer search modal
            const searchInput = document.querySelector('.global-search-input') as HTMLInputElement;
            if (searchInput) {
              searchInput.focus();
              searchInput.value = 'customer:';
            }
          },
          description: 'Quick customer search'
        },
        { 
          id: 'customer-analytics', 
          label: 'Customer Analytics', 
          icon: TrendingUp,
          path: '/customers/analytics',
          description: 'View customer insights and metrics'
        },
        { 
          id: 'customer-map', 
          label: 'Customer Map', 
          icon: MapPin,
          path: '/customers/map',
          description: 'Geographic view of customers'
        }
      ]
    },
    {
      id: 'work-management',
      label: 'Work Management',
      icon: ClipboardList,
      color: 'bg-green-500 hover:bg-green-600',
      actions: [
        { 
          id: 'create-work-order', 
          label: 'Create Work Order', 
          icon: Plus, 
          path: '/work-orders/new',
          description: 'Create a new work order'
        },
        { 
          id: 'view-work-orders', 
          label: 'View All Work Orders', 
          icon: ClipboardList, 
          path: '/work-orders', 
          badge: 12,
          description: 'Manage all work orders'
        },
        { 
          id: 'emergency-job', 
          label: 'Emergency Job', 
          icon: AlertCircle, 
          path: '/work-orders/new?priority=emergency',
          color: 'text-red-600',
          description: 'Create urgent work order'
        },
        { 
          id: 'create-agreement', 
          label: 'Create Agreement', 
          icon: FileText, 
          path: '/agreements/create',
          description: 'Create service agreement'
        },
        { 
          id: 'job-templates', 
          label: 'Job Templates', 
          icon: Star,
          path: '/work-orders/templates',
          description: 'Manage work order templates'
        }
      ]
    },
    {
      id: 'scheduling',
      label: 'Scheduling & Dispatch',
      icon: Calendar,
      color: 'bg-purple-500 hover:bg-purple-600',
      actions: [
        { 
          id: 'todays-schedule', 
          label: "Today's Schedule", 
          icon: Clock, 
          path: '/scheduler?view=today',
          badge: 47,
          description: 'View today\'s scheduled jobs'
        },
        { 
          id: 'schedule-job', 
          label: 'Schedule Job', 
          icon: Calendar, 
          path: '/scheduler',
          description: 'Schedule a new job'
        },
        { 
          id: 'route-optimization', 
          label: 'Route Optimization', 
          icon: MapPin,
          path: '/routing',
          description: 'Optimize technician routes'
        },
        { 
          id: 'technician-availability', 
          label: 'Technician Availability', 
          icon: UserCheck,
          path: '/technicians?view=availability',
          description: 'Check technician schedules'
        },
        { 
          id: 'emergency-dispatch', 
          label: 'Emergency Dispatch', 
          icon: AlertCircle,
          path: '/scheduler?priority=emergency',
          color: 'text-red-600',
          description: 'Emergency job dispatch'
        }
      ]
    },
    {
      id: 'financial',
      label: 'Financial',
      icon: DollarSign,
      color: 'bg-emerald-500 hover:bg-emerald-600',
      actions: [
        { 
          id: 'create-invoice', 
          label: 'Create Invoice', 
          icon: FileText,
          path: '/billing/invoices/new',
          description: 'Generate customer invoice'
        },
        { 
          id: 'process-payment', 
          label: 'Process Payment', 
          icon: CreditCard,
          path: '/billing/payments/new',
          description: 'Process customer payment'
        },
        { 
          id: 'financial-reports', 
          label: 'Financial Reports', 
          icon: BarChart3,
          path: '/reports/financial',
          description: 'View financial analytics'
        },
        { 
          id: 'billing-overview', 
          label: 'Billing Overview', 
          icon: DollarSign, 
          path: '/billing', 
          badge: '$45k',
          description: 'Billing dashboard'
        },
        { 
          id: 'payment-history', 
          label: 'Payment History', 
          icon: Clock,
          path: '/billing/payments',
          description: 'View payment records'
        }
      ]
    },
    {
      id: 'team-management',
      label: 'Team Management',
      icon: UserCheck,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      actions: [
        { 
          id: 'view-technicians', 
          label: 'View Technicians', 
          icon: Users, 
          path: '/technicians', 
          badge: 8,
          description: 'Manage technician team'
        },
        { 
          id: 'add-technician', 
          label: 'Add Technician', 
          icon: UserPlus, 
          path: '/technicians/new',
          description: 'Add new team member'
        },
        { 
          id: 'manage-availability', 
          label: 'Manage Availability', 
          icon: Calendar,
          path: '/technicians/availability',
          description: 'Set technician schedules'
        },
        { 
          id: 'performance-reports', 
          label: 'Performance Reports', 
          icon: TrendingUp,
          path: '/reports/technicians',
          description: 'Technician performance metrics'
        },
        { 
          id: 'training-records', 
          label: 'Training Records', 
          icon: CheckSquare,
          path: '/technicians/training',
          description: 'Manage training and certifications'
        }
      ]
    },
    {
      id: 'quick-actions',
      label: 'Quick Actions',
      icon: Zap,
      color: 'bg-orange-500 hover:bg-orange-600',
      actions: [
        { 
          id: 'global-search', 
          label: 'Global Search', 
          icon: Search,
          action: () => {
            const searchInput = document.querySelector('.global-search-input') as HTMLInputElement;
            if (searchInput) {
              searchInput.focus();
            }
          },
          description: 'Search across all data'
        },
        { 
          id: 'notifications', 
          label: 'Notifications', 
          icon: Bell, 
          badge: 3,
          action: () => {
            // Open notifications panel
            console.log('Opening notifications');
          },
          description: 'View recent notifications'
        },
        { 
          id: 'recent-items', 
          label: 'Recent Items', 
          icon: Clock,
          action: () => {
            // Show recent items modal
            console.log('Showing recent items');
          },
          description: 'Recently viewed items'
        },
        { 
          id: 'settings', 
          label: 'Settings', 
          icon: Settings, 
          path: '/settings',
          description: 'Application settings'
        },
        { 
          id: 'help-support', 
          label: 'Help & Support', 
          icon: HelpCircle,
          path: '/knowledge',
          description: 'Get help and documentation'
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
  const handleAction = (action: FABAction) => {
    if (action.path) {
      navigate(action.path);
    } else if (action.action) {
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
      
      <div className={`fixed bottom-6 left-6 z-50 ${className}`} ref={fabRef}>

        {/* Fixed Action Panel Area - Always in same location */}
        {isExpanded && expandedCategory && (
          <div className="fixed bottom-6 left-24 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 animate-in slide-in-from-left duration-200">
            {(() => {
              const selectedCategory = fabCategories.find(cat => cat.id === expandedCategory);
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
                            <div className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
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

        <div className="flex flex-col-reverse items-start gap-2">
          {/* Main FAB Button */}
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
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
                }
              `}
              title={isExpanded ? 'Close Actions' : 'Open Quick Actions'}
            >
              <Plus className={`w-8 h-8 transition-transform duration-300 ${isExpanded ? 'rotate-45' : ''}`} />
            </button>

            {/* Pulse animation on hover only when collapsed */}
            {!isExpanded && (
              <div className="absolute inset-0 rounded-full bg-purple-500 opacity-0 group-hover:opacity-20 group-hover:animate-ping transition-opacity"></div>
            )}
          </div>

          {/* Dashboard Quick Access Button */}
          {isExpanded && (
            <div className="flex items-center gap-3 mb-2">
              <button 
                onClick={() => {
                  navigate('/dashboard');
                  setIsExpanded(false);
                  setExpandedCategory(null);
                }}
                className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ring-2 ring-purple-200"
                title="Go to Dashboard"
              >
                <Home className="w-6 h-6" />
              </button>
              <div className="bg-gradient-to-r from-purple-100 to-purple-200 px-3 py-2 rounded-lg text-sm font-semibold text-purple-800 whitespace-nowrap">
                Dashboard
              </div>
            </div>
          )}

          {/* Category Selection Buttons - Vertical Stack */}
          {isExpanded && (
            <div className="flex flex-col-reverse gap-2">
              {fabCategories.map((category, index) => {
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

                    {/* Category Label - Only show on hover for inactive categories */}
                    {!isCategoryExpanded && (
                      <div className="absolute left-full ml-2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        {category.label}
                      </div>
                    )}
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
