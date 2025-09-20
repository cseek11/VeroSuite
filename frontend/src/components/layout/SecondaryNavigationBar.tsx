import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home,
  Users,
  ClipboardList,
  Calendar,
  DollarSign,
  BarChart3,
  Settings,
  MessageCircle,
  FileText,
  CreditCard,
  UserPlus,
  Search,
  TrendingUp,
  MapPin,
  Plus,
  Clock,
  CheckSquare,
  AlertCircle,
  Star,
  UserCheck,
  Archive,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  Copy,
  Share2,
  Filter,
  RefreshCw,
  BookOpen,
  HelpCircle,
  ChevronDown,
  Grid,
  Layout,
  User,
  Mail
} from 'lucide-react';

interface DropdownItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path?: string;
  action?: () => void;
  badge?: string | number;
  color?: string;
  description?: string;
  divider?: boolean; // Add divider after this item
}

interface DropdownCategory {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  items: DropdownItem[];
}

interface SecondaryNavigationBarProps {
  className?: string;
}

export default function SecondaryNavigationBar({ className = '' }: SecondaryNavigationBarProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Comprehensive dropdown categories
  const dropdownCategories: DropdownCategory[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      color: 'hover:bg-purple-50 hover:text-purple-700',
      items: [
        { id: 'main-dashboard', label: 'Main Dashboard', icon: Home, path: '/dashboard', description: 'Overview and key metrics' },
        { id: 'vero-cards', label: 'VeroCards View', icon: Grid, path: '/resizable-dashboard', description: 'Customizable widget dashboard' },
        { divider: true, id: 'div1', label: '', icon: Home },
        { id: 'analytics-overview', label: 'Analytics Overview', icon: TrendingUp, path: '/charts', description: 'Business intelligence dashboard' },
        { id: 'performance-metrics', label: 'Performance Metrics', icon: BarChart3, path: '/reports/performance', description: 'KPI and performance tracking' }
      ]
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: Users,
      color: 'hover:bg-blue-50 hover:text-blue-700',
      items: [
        { id: 'all-customers', label: 'All Customers', icon: Users, path: '/customers', badge: '2.1k', description: 'Browse and manage customers' },
        { id: 'add-customer', label: 'Add New Customer', icon: UserPlus, path: '/customers/new', description: 'Create new customer record' },
        { id: 'search-customers', label: 'Search Customers', icon: Search, path: '/customers/search', description: 'Advanced customer search' },
        { divider: true, id: 'div2', label: '', icon: Users },
        { id: 'customer-analytics', label: 'Customer Analytics', icon: TrendingUp, path: '/customers/analytics', description: 'Customer insights and metrics' },
        { id: 'customer-map', label: 'Customer Map', icon: MapPin, path: '/customers/map', description: 'Geographic customer view' },
        { id: 'customer-segments', label: 'Customer Segments', icon: Filter, path: '/customers/segments', description: 'Customer categorization' },
        { divider: true, id: 'div3', label: '', icon: Users },
        { id: 'import-customers', label: 'Import Customers', icon: Upload, path: '/customers/import', description: 'Bulk customer import' },
        { id: 'export-customers', label: 'Export Customers', icon: Download, path: '/customers/export', description: 'Export customer data' }
      ]
    },
    {
      id: 'work-orders',
      label: 'Work Orders',
      icon: ClipboardList,
      color: 'hover:bg-green-50 hover:text-green-700',
      items: [
        { id: 'all-work-orders', label: 'All Work Orders', icon: ClipboardList, path: '/work-orders', badge: 12, description: 'Manage all work orders' },
        { id: 'create-work-order', label: 'Create Work Order', icon: Plus, path: '/work-orders/new', description: 'Create new work order' },
        { id: 'emergency-job', label: 'Emergency Job', icon: AlertCircle, path: '/work-orders/new?priority=emergency', color: 'text-red-600', description: 'Create urgent work order' },
        { divider: true, id: 'div4', label: '', icon: ClipboardList },
        { id: 'job-templates', label: 'Job Templates', icon: Star, path: '/work-orders/templates', description: 'Manage work order templates' },
        { id: 'recurring-jobs', label: 'Recurring Jobs', icon: RefreshCw, path: '/work-orders/recurring', description: 'Scheduled recurring services' },
        { id: 'job-history', label: 'Job History', icon: Archive, path: '/work-orders/history', description: 'Completed work orders' },
        { divider: true, id: 'div5', label: '', icon: ClipboardList },
        { id: 'agreements', label: 'Service Agreements', icon: FileText, path: '/agreements', badge: 5, description: 'Customer service contracts' },
        { id: 'create-agreement', label: 'Create Agreement', icon: Plus, path: '/agreements/create', description: 'New service agreement' }
      ]
    },
    {
      id: 'scheduling',
      label: 'Scheduling',
      icon: Calendar,
      color: 'hover:bg-purple-50 hover:text-purple-700',
      items: [
        { id: 'scheduler', label: 'Main Scheduler', icon: Calendar, path: '/scheduler', badge: 47, description: 'Schedule and dispatch jobs' },
        { id: 'todays-schedule', label: "Today's Schedule", icon: Clock, path: '/scheduler?view=today', description: 'View today\'s scheduled jobs' },
        { id: 'weekly-view', label: 'Weekly View', icon: Calendar, path: '/scheduler?view=week', description: 'Week overview' },
        { divider: true, id: 'div6', label: '', icon: Calendar },
        { id: 'route-optimization', label: 'Route Optimization', icon: MapPin, path: '/routing', description: 'Optimize technician routes' },
        { id: 'technician-availability', label: 'Technician Availability', icon: UserCheck, path: '/technicians?view=availability', description: 'Check team schedules' },
        { id: 'emergency-dispatch', label: 'Emergency Dispatch', icon: AlertCircle, path: '/scheduler?priority=emergency', color: 'text-red-600', description: 'Emergency job dispatch' },
        { divider: true, id: 'div7', label: '', icon: Calendar },
        { id: 'calendar-settings', label: 'Calendar Settings', icon: Settings, path: '/settings/calendar', description: 'Configure scheduling preferences' }
      ]
    },
    {
      id: 'team',
      label: 'Team',
      icon: UserCheck,
      color: 'hover:bg-indigo-50 hover:text-indigo-700',
      items: [
        { id: 'all-technicians', label: 'All Technicians', icon: Users, path: '/technicians', badge: 8, description: 'Manage technician team' },
        { id: 'add-technician', label: 'Add Technician', icon: UserPlus, path: '/technicians/new', description: 'Add new team member' },
        { id: 'technician-profiles', label: 'Technician Profiles', icon: User, path: '/technicians/profiles', description: 'View detailed profiles' },
        { divider: true, id: 'div8', label: '', icon: UserCheck },
        { id: 'availability-management', label: 'Availability Management', icon: Calendar, path: '/technicians/availability', description: 'Manage schedules and time off' },
        { id: 'performance-reports', label: 'Performance Reports', icon: TrendingUp, path: '/reports/technicians', description: 'Team performance metrics' },
        { id: 'training-records', label: 'Training & Certifications', icon: CheckSquare, path: '/technicians/training', description: 'Training and certification tracking' },
        { divider: true, id: 'div9', label: '', icon: UserCheck },
        { id: 'payroll-integration', label: 'Payroll Integration', icon: DollarSign, path: '/technicians/payroll', description: 'Time tracking and payroll' }
      ]
    },
    {
      id: 'financial',
      label: 'Financial',
      icon: DollarSign,
      color: 'hover:bg-emerald-50 hover:text-emerald-700',
      items: [
        { id: 'finance-overview', label: 'Finance Overview', icon: DollarSign, path: '/finance', badge: '$45k', description: 'Financial dashboard' },
        { id: 'billing-management', label: 'Billing Management', icon: CreditCard, path: '/billing', badge: 'NEW', description: 'Invoice and billing system' },
        { divider: true, id: 'div10', label: '', icon: DollarSign },
        { id: 'create-invoice', label: 'Create Invoice', icon: Plus, path: '/billing/invoices/new', description: 'Generate customer invoice' },
        { id: 'process-payment', label: 'Process Payment', icon: CreditCard, path: '/billing/payments/new', description: 'Process customer payment' },
        { id: 'payment-history', label: 'Payment History', icon: Archive, path: '/billing/payments', description: 'View payment records' },
        { divider: true, id: 'div11', label: '', icon: DollarSign },
        { id: 'financial-reports', label: 'Financial Reports', icon: BarChart3, path: '/reports/financial', description: 'Revenue and expense reports' },
        { id: 'tax-reports', label: 'Tax Reports', icon: FileText, path: '/reports/tax', description: 'Tax reporting and compliance' },
        { id: 'profit-analysis', label: 'Profit Analysis', icon: TrendingUp, path: '/reports/profit', description: 'Profitability analysis' }
      ]
    },
    {
      id: 'communications',
      label: 'Communications',
      icon: MessageCircle,
      color: 'hover:bg-blue-50 hover:text-blue-700',
      items: [
        { id: 'messages', label: 'Messages', icon: MessageCircle, path: '/communications', badge: 3, description: 'Customer communications' },
        { id: 'email-campaigns', label: 'Email Campaigns', icon: Mail, path: '/communications/email', description: 'Email marketing campaigns' },
        { id: 'sms-campaigns', label: 'SMS Campaigns', icon: MessageCircle, path: '/communications/sms', description: 'SMS marketing and alerts' },
        { divider: true, id: 'div12', label: '', icon: MessageCircle },
        { id: 'templates', label: 'Message Templates', icon: FileText, path: '/communications/templates', description: 'Communication templates' },
        { id: 'automation', label: 'Automation Rules', icon: Settings, path: '/communications/automation', description: 'Automated communication workflows' },
        { divider: true, id: 'div13', label: '', icon: MessageCircle },
        { id: 'communication-history', label: 'Communication History', icon: Archive, path: '/communications/history', description: 'Past communications log' }
      ]
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      color: 'hover:bg-orange-50 hover:text-orange-700',
      items: [
        { id: 'all-reports', label: 'All Reports', icon: BarChart3, path: '/reports', description: 'Report dashboard' },
        { id: 'business-analytics', label: 'Business Analytics', icon: TrendingUp, path: '/charts', description: 'Advanced analytics and charts' },
        { divider: true, id: 'div14', label: '', icon: BarChart3 },
        { id: 'financial-reports', label: 'Financial Reports', icon: DollarSign, path: '/reports/financial', description: 'Revenue and financial analysis' },
        { id: 'customer-reports', label: 'Customer Reports', icon: Users, path: '/reports/customers', description: 'Customer analytics and insights' },
        { id: 'technician-reports', label: 'Technician Reports', icon: UserCheck, path: '/reports/technicians', description: 'Team performance reports' },
        { id: 'service-reports', label: 'Service Reports', icon: ClipboardList, path: '/reports/services', description: 'Service delivery analytics' },
        { divider: true, id: 'div15', label: '', icon: BarChart3 },
        { id: 'custom-reports', label: 'Custom Reports', icon: Settings, path: '/reports/custom', description: 'Build custom reports' },
        { id: 'scheduled-reports', label: 'Scheduled Reports', icon: Clock, path: '/reports/scheduled', description: 'Automated report delivery' },
        { id: 'export-data', label: 'Export Data', icon: Download, path: '/reports/export', description: 'Data export tools' }
      ]
    },
    {
      id: 'tools',
      label: 'Tools',
      icon: Settings,
      color: 'hover:bg-gray-50 hover:text-gray-700',
      items: [
        { id: 'global-search', label: 'Global Search', icon: Search, path: '/global-search-demo', description: 'Search across all data' },
        { id: 'knowledge-base', label: 'Knowledge Base', icon: BookOpen, path: '/knowledge', description: 'Documentation and help' },
        { id: 'file-uploads', label: 'File Management', icon: Upload, path: '/uploads', description: 'File upload and management' },
        { divider: true, id: 'div16', label: '', icon: Settings },
        { id: 'system-settings', label: 'System Settings', icon: Settings, path: '/settings', description: 'Application configuration' },
        { id: 'user-management', label: 'User Management', icon: Users, path: '/settings/users', description: 'Manage user accounts' },
        { id: 'company-settings', label: 'Company Settings', icon: Settings, path: '/settings/company', description: 'Company profile and branding' },
        { divider: true, id: 'div17', label: '', icon: Settings },
        { id: 'help-support', label: 'Help & Support', icon: HelpCircle, path: '/help', description: 'Get help and support' },
        { id: 'keyboard-shortcuts', label: 'Keyboard Shortcuts', icon: Settings, action: () => console.log('Show shortcuts'), description: 'View available shortcuts' }
      ]
    }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle dropdown toggle
  const handleDropdownToggle = (categoryId: string) => {
    setActiveDropdown(activeDropdown === categoryId ? null : categoryId);
  };

  // Handle item click
  const handleItemClick = (item: DropdownItem) => {
    if (item.path) {
      navigate(item.path);
    } else if (item.action) {
      item.action();
    }
    setActiveDropdown(null); // Close dropdown after action
  };

  // Get current active category based on route
  const getActiveCategory = () => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/' || path === '/resizable-dashboard') return 'dashboard';
    if (path.startsWith('/customers')) return 'customers';
    if (path.startsWith('/work-orders') || path.startsWith('/agreements')) return 'work-orders';
    if (path.startsWith('/scheduler') || path.startsWith('/routing')) return 'scheduling';
    if (path.startsWith('/technicians')) return 'team';
    if (path.startsWith('/finance') || path.startsWith('/billing')) return 'financial';
    if (path.startsWith('/communications')) return 'communications';
    if (path.startsWith('/reports') || path.startsWith('/charts')) return 'reports';
    if (path.startsWith('/settings') || path.startsWith('/knowledge') || path.startsWith('/uploads')) return 'tools';
    return null;
  };

  const activeCategory = getActiveCategory();

  return (
    <div className={`bg-white border-b border-gray-200 shadow-sm ${className}`} ref={navRef}>
      <div className="flex items-center px-6 py-2 gap-1">
        {dropdownCategories.map((category, index) => {
          const CategoryIcon = category.icon;
          const isActive = activeCategory === category.id;
          const isDropdownOpen = activeDropdown === category.id;
          const isRightAligned = index >= dropdownCategories.length - 2; // Last 2 categories align right
          
          return (
            <div key={category.id} className="relative">
              {/* Category Button */}
              <button
                onClick={() => handleDropdownToggle(category.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                    : `text-gray-600 ${category.color}`
                  }
                  ${isDropdownOpen ? 'bg-gray-100 text-gray-800' : ''}
                `}
              >
                <CategoryIcon className="w-4 h-4" />
                <span>{category.label}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className={`absolute top-full mt-1 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-in slide-in-from-top duration-200 ${
                  isRightAligned ? 'right-0' : 'left-0'
                }`}>
                  {/* Category Header */}
                  <div className="px-4 py-2 border-b border-gray-100 mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 bg-gradient-to-r ${category.color.includes('purple') ? 'from-purple-500 to-purple-600' : 
                        category.color.includes('blue') ? 'from-blue-500 to-blue-600' :
                        category.color.includes('green') ? 'from-green-500 to-green-600' :
                        category.color.includes('indigo') ? 'from-indigo-500 to-indigo-600' :
                        category.color.includes('emerald') ? 'from-emerald-500 to-emerald-600' :
                        category.color.includes('orange') ? 'from-orange-500 to-orange-600' :
                        'from-gray-500 to-gray-600'
                      } text-white rounded-lg flex items-center justify-center`}>
                        <CategoryIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{category.label}</div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="max-h-96 overflow-y-auto">
                    {category.items.map((item) => {
                      if (item.divider) {
                        return <div key={item.id} className="h-px bg-gray-200 my-2 mx-4" />;
                      }

                      const ItemIcon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleItemClick(item)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left group"
                          title={item.description}
                        >
                          <div className="w-8 h-8 bg-gray-100 group-hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
                            <ItemIcon className={`w-4 h-4 ${item.color || 'text-gray-600'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-800 truncate">{item.label}</div>
                            {item.description && (
                              <div className="text-xs text-gray-500 truncate">{item.description}</div>
                            )}
                          </div>
                          {item.badge && (
                            <div className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                              {item.badge}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
