import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
import { useTodayJobs } from '@/hooks/useJobs';
import { LoadingSpinner, PageLoader } from '@/components/LoadingSpinner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import JobsCalendar from '@/components/JobsCalendar';
import TodaysOperations from '@/components/dashboard/TodaysOperations';
import CustomerExperiencePanel from '@/components/dashboard/CustomerExperiencePanel';
import TechnicianDispatchPanel from '@/components/dashboard/TechnicianDispatchPanel';
import FinancialSnapshot from '@/components/dashboard/FinancialSnapshot';
import InventoryCompliancePanel from '@/components/dashboard/InventoryCompliancePanel';
import { DashboardMetric, Job } from '@/types';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Alert,
  Avatar,
  Button,
  IconButton,
  Card,
  Checkbox,
  Chip,
  Collapse,
  Dropdown,
  Input,
  Modal,
  ProgressBar,
  Tabs,
  Textarea,
  Tooltip,
  Typography,
  Navbar
} from '@/components/ui/EnhancedUI';
import { 
  Users, 
  TrendingUp, 
  ShoppingCart, 
  Eye, 
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Upload,
  Download,
  Check,
  Info,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Star,
  Play,
  Pause,
  SkipForward,
  Volume2,
  Camera,
  Image,
  FileText,
  Zap,
  Layers,
  Grid,
  List,
  MoreVertical,
  RefreshCw,
  Save,
  Copy,
  Share2,
  Maximize2,
  Moon,
  Sun,
  Palette,
  Type,
  Layout,
  Sliders as SlidersIcon,
  Home,
  CreditCard,
  MessageCircle,
  Globe,
  Mail,
  Phone,
  Heart,
  Package,
  Search,
  Bell,
  ChevronDown,
  Filter,
  MapPin
} from 'lucide-react';

// Empty mock data - will be populated from API
const mockJobs: Job[] = [];

// Empty sample data - will be populated from API
const salesData = [];
const kanbanData = { todo: [], inProgress: [], done: [] };
const calendarEvents = [];
const photos = [];
const wizardSteps = [];
const choiceOptions = [];

// Responsive Dashboard Card Component
const DashboardCard: React.FC<{
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}> = ({ title, children, actions, className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-md p-4 sm:p-6 flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{title}</h2>
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
};

const EnhancedDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, clear: clearAuth } = useAuthStore();
  const { data: jobs, isLoading: jobsLoading, error: jobsError } = useTodayJobs();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Collapsible sidebar state with localStorage persistence
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem('dashboard-sidebar-collapsed');
      return saved ? JSON.parse(saved) : false; // Default to false (expanded)
    } catch (error) {
      return false; // Default to expanded
    }
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [alertVisible, setAlertVisible] = useState(true);
  const [tooltipVisible, setTooltipVisible] = useState({});
  const [tabsActive, setTabsActive] = useState('crm-operations');
  const [sliderValue, setSliderValue] = useState(50);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [countUpValue, setCountUpValue] = useState(0);
  const [progressValue, setProgressValue] = useState(75);
  const [wizardStep, setWizardStep] = useState(0);
  const [richText, setRichText] = useState('');
  const [selectedChoice, setSelectedChoice] = useState('');
  const [photoSwipeOpen, setPhotoSwipeOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [urgentNotifications, setUrgentNotifications] = useState(3); // Mock data
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [customization, setCustomization] = useState({
    primaryColor: '#cb0c9f',
    secondaryColor: '#8392ab',
    accentColor: '#17c1e8',
    successColor: '#82d616',
    warningColor: '#fb6340',
    dangerColor: '#ea0606',
    brandName: 'VeroPest Suite',
    logo: '🚀',
    shadowIntensity: 'medium',
    borderRadius: 'large',
    fontFamily: 'Inter',
    fontSize: 'medium',
    darkMode: false,
    sidebarWidth: 'normal',
    headerHeight: 'normal',
    backgroundPattern: 'none',
    glassEffect: false
  });

  // Use mock data if API fails, otherwise use real data
  const displayJobs = jobsError ? mockJobs : (jobs || []);
  const isUsingMockData = !!jobsError;

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // CountUp Animation
  useEffect(() => {
    let start = 0;
    const target = 1247;
    const duration = 2000;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      setCountUpValue(Math.floor(start));
    }, 16);

    return () => clearInterval(timer);
  }, []);

  // Metrics data - will be populated from API
  const metrics: DashboardMetric[] = [
    {
      title: 'Total Jobs',
      value: displayJobs.length,
      change: 0,
      changeType: 'increase',
      icon: Calendar,
      color: '#3b82f6'
    },
    {
      title: 'Active Technicians',
      value: 0,
      change: 0,
      changeType: 'increase',
      icon: Users,
      color: '#10b981'
    },
    {
      title: 'Revenue',
      value: '$0',
      change: 0,
      changeType: 'increase',
      icon: TrendingUp,
      color: '#f59e0b'
    },
    {
      title: 'Customer Satisfaction',
      value: '0%',
      change: 0,
      changeType: 'increase',
      icon: Eye,
      color: '#8b5cf6'
    }
  ];

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'jobs') {
      navigate('/jobs');
    } else if (tab === 'customers') {
      navigate('/customers');
    } else if (tab === 'settings') {
      navigate('/settings');
    }
  };

  // Save sidebar state to localStorage
  const saveSidebarState = (collapsed: boolean) => {
    try {
      localStorage.setItem('dashboard-sidebar-collapsed', JSON.stringify(collapsed));
    } catch (error) {
      console.error('Error saving sidebar state:', error);
    }
  };

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    const newCollapsed = !sidebarCollapsed;
    setSidebarCollapsed(newCollapsed);
    saveSidebarState(newCollapsed);
  };

  if (!user) {
    return <PageLoader text="Loading dashboard..." />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Enhanced Header with CRM Features */}
        <header className="bg-[url('/branding/crm_BG_small.png')] bg-cover bg-center shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 gap-4">
              {/* Left side - Logo and Branding */}
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 lg:hidden"
                >
                  <Settings className="h-6 w-6" />
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
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search customers, jobs, invoices, technicians..."
                    value={searchQuery}
                    onChange={setSearchQuery}
                    className="pl-10 pr-16 py-2 w-full border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                    <Filter className="h-4 w-4 text-gray-400" />
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
                    <Button variant="outline" className="flex items-center space-x-2 bg-white border-gray-300 hover:bg-gray-50 h-9">
                      <Plus className="h-4 w-4" />
                      <span className="hidden sm:inline">Quick Actions</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  }
                  items={[
                    { label: 'Create Work Order', icon: Plus, onClick: () => navigate('/jobs/new') },
                    { label: 'Schedule Job', icon: Calendar, onClick: () => navigate('/jobs/new') },
                    { label: 'Add Customer', icon: Users, onClick: () => navigate('/customers/new') },
                    { label: 'View Reports', icon: BarChart3, onClick: () => navigate('/reports') }
                  ]}
                />

                {/* Notifications Center */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative w-9 h-9 rounded-md text-gray-400 hover:text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 flex items-center justify-center"
                  >
                    <Bell className="h-6 w-6" />
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
                      <div className="flex items-center space-x-3 cursor-pointer px-3 py-2 rounded-md bg-white border border-gray-200 hover:bg-gray-50 h-9">
                        <Avatar size="sm" fallback={`${user?.first_name?.charAt(0) || ''}${user?.last_name?.charAt(0) || ''}`} />
                        <div className="hidden md:block text-left">
                          <p className="text-sm font-medium text-gray-900">
                            {user?.first_name || 'User'} {user?.last_name || ''}
                          </p>
                          <p className="text-xs text-gray-500">{user?.email || 'No email'}</p>
                        </div>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                    }
                    items={[
                      { label: 'Profile Settings', icon: Settings, onClick: () => navigate('/settings') },
                      { label: 'Logout', icon: LogOut, onClick: handleLogout }
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <DashboardSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={toggleSidebar}
          />

          {/* Main Content */}
          <div 
            className={`flex-1 p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 pb-20 lg:pb-6 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}
          >
            <div className="max-w-7xl mx-auto">
              {/* Enhanced Alert */}
              {isUsingMockData && (
                <Alert 
                  type="warning" 
                  title="Demo Mode"
                  onClose={() => setAlertVisible(false)}
                  className="mt-1 sm:mt-2 md:mt-3 lg:mt-4 mb-4 sm:mb-6 md:mb-7 lg:mb-8"
                >
                  Using demo data. Configure your Supabase connection to see real data.
                </Alert>
              )}

              {/* Enhanced Dashboard Content with Tabs */}
              <Card title="Dashboard Overview" actions={[
                <Button key="refresh" size="sm" icon={RefreshCw}>Refresh</Button>,
                <Button key="export" size="sm" variant="outline" icon={Download}>Export</Button>
              ]}>
                <Tabs
                  tabs={[
                    { id: 'overview', label: 'Overview', icon: Home },
                    { id: 'crm-operations', label: 'Today\'s Operations', icon: Calendar },
                    { id: 'crm-customers', label: 'Customer Experience', icon: Users },
                    { id: 'crm-technicians', label: 'Technician & Dispatch', icon: Users },
                    { id: 'crm-financial', label: 'Financial', icon: TrendingUp },
                    { id: 'crm-inventory', label: 'Inventory & Compliance', icon: Package },
                    { id: 'jobs', label: 'Jobs', icon: Calendar },
                    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                    { id: 'customization', label: 'Customization', icon: Palette }
                  ]}
                  active={tabsActive}
                  onTabChange={setTabsActive}
                />

                <div className="mt-6">
                  {tabsActive === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                      {/* Jobs Calendar */}
                      <DashboardCard 
                        title="Today's Jobs" 
                        actions={[
                          <Button key="view-all" size="sm" variant="outline" onClick={() => navigate('/jobs')}>
                            View All
                          </Button>
                        ]}
                        className="md:col-span-2 lg:col-span-1"
                      >
                        <Suspense fallback={<LoadingSpinner text="Loading calendar..." />}>
                          {jobsLoading ? (
                            <LoadingSpinner text="Loading jobs..." />
                          ) : (
                            <JobsCalendar 
                              events={displayJobs.map(job => ({
                                id: job.id,
                                title: job.title,
                                start: job.start,
                                end: job.end,
                                color: job.color || '#3b82f6',
                                extendedProps: {
                                  technician: job.technician || '',
                                  status: job.status
                                }
                              }))}
                              height="300px"
                              view="timeGridDay"
                            />
                          )}
                        </Suspense>
                      </DashboardCard>

                      {/* Routing Map */}
                      <DashboardCard 
                        title="Today's Routes" 
                        actions={[
                          <Button key="view-routes" size="sm" variant="outline" onClick={() => navigate('/routing')}>
                            View All Routes
                          </Button>
                        ]}
                        className="md:col-span-2 lg:col-span-1"
                      >
                        <div className="h-[280px] sm:h-[320px] md:h-[350px] lg:h-[380px] xl:h-[400px] w-full">
                          <MapContainer 
                            center={[40.44, -79.99]} 
                            zoom={windowWidth < 768 ? 10 : windowWidth < 1024 ? 11 : 12}
                            className="h-full w-full"
                            style={{ minHeight: '280px' }}
                          >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            
                            {/* Job Locations */}
                            {displayJobs.map((job: Job) => (
                              <Marker 
                                key={job.id} 
                                position={[
                                  40.44 + (Math.random() - 0.5) * 0.1, 
                                  -79.99 + (Math.random() - 0.5) * 0.1
                                ]}
                              >
                                <Popup>
                                  <div className="p-2">
                                    <Typography variant="body2" className="font-medium text-sm">
                                      {job.title}
                                    </Typography>
                                    <Typography variant="caption" className="text-gray-500 text-xs">
                                      {job.technician} • {job.status}
                                    </Typography>
                                  </div>
                                </Popup>
                              </Marker>
                            ))}
                            
                            {/* Sample Route Lines */}
                            {displayJobs.length > 1 && (
                              <Polyline
                                positions={[
                                  [40.44, -79.99],
                                  [40.45, -79.98],
                                  [40.46, -79.97],
                                  [40.47, -79.96]
                                ]}
                                color="blue"
                                weight={3}
                                opacity={0.7}
                              />
                            )}
                          </MapContainer>
                        </div>
                        
                        {displayJobs.length === 0 && (
                          <div className="text-center py-6 sm:py-8">
                            <MapPin className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                            <Typography variant="h6" className="mt-2 text-gray-900 text-sm sm:text-base">No routes today</Typography>
                            <Typography variant="body2" className="text-gray-500 text-xs sm:text-sm">
                              No jobs scheduled for today.
                            </Typography>
                          </div>
                        )}
                      </DashboardCard>
                    </div>
                  )}

                  {tabsActive === 'crm-operations' && (
                    <div className="space-y-6">
                      <TodaysOperations jobs={displayJobs} isLoading={jobsLoading} />
                    </div>
                  )}

                  {tabsActive === 'crm-customers' && (
                    <div className="space-y-6">
                      <CustomerExperiencePanel />
                    </div>
                  )}

                  {tabsActive === 'crm-technicians' && (
                    <div className="space-y-6">
                      <TechnicianDispatchPanel />
                    </div>
                  )}

                  {tabsActive === 'crm-financial' && (
                    <div className="space-y-6">
                      <FinancialSnapshot />
                    </div>
                  )}

                  {tabsActive === 'crm-inventory' && (
                    <div className="space-y-6">
                      <InventoryCompliancePanel />
                    </div>
                  )}

                  {tabsActive === 'jobs' && (
                    <div className="space-y-6">
                      {/* Job Progress */}
                      <Card title="Job Progress">
                        <div className="space-y-4">
                          {displayJobs.map((job: Job) => (
                            <div key={job.id} className="flex items-center space-x-4">
                              <div className="flex-1">
                                <Typography variant="body2" className="font-medium">{job.title}</Typography>
                                <Typography variant="caption" className="text-gray-500">{job.technician}</Typography>
                              </div>
                              <div className="w-32">
                                <ProgressBar 
                                  value={
                                    job.status === 'completed' ? 100 :
                                    job.status === 'in-progress' ? 65 :
                                    job.status === 'scheduled' ? 0 : 0
                                  }
                                  color={
                                    job.status === 'completed' ? 'success' :
                                    job.status === 'in-progress' ? 'primary' :
                                    'warning'
                                  }
                                  showLabel
                                />
                              </div>
                              <Chip variant="default">{job.status}</Chip>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>
                  )}

                  {tabsActive === 'analytics' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Sales Data Card */}
                      <Card title="Revenue Analytics">
                        <div className="space-y-4">
                          {salesData.slice(-3).map((item, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <Typography variant="body2">{item.name}</Typography>
                              <Typography variant="body2" className="font-medium">
                                ${item.revenue.toLocaleString()}
                              </Typography>
                            </div>
                          ))}
                        </div>
                      </Card>

                      {/* CountUp Animation */}
                      <Card title="Live Statistics">
                        <div className="text-center">
                          <Typography variant="h2" className="text-purple-600">
                            {countUpValue.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" className="text-gray-500">
                            Total Operations
                          </Typography>
                        </div>
                      </Card>
                    </div>
                  )}

                  {tabsActive === 'customization' && (
                    <div className="space-y-6">
                      {/* Customization Options */}
                      <Card title="Theme Customization">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Typography variant="body2" className="font-medium mb-2">Primary Color</Typography>
                            <Input
                              value={customization.primaryColor}
                              onChange={(value) => setCustomization(prev => ({ ...prev, primaryColor: value }))}
                              placeholder="#cb0c9f"
                            />
                          </div>
                          <div>
                            <Typography variant="body2" className="font-medium mb-2">Brand Name</Typography>
                            <Input
                              value={customization.brandName}
                              onChange={(value) => setCustomization(prev => ({ ...prev, brandName: value }))}
                              placeholder="VeroPest Suite"
                            />
                          </div>
                        </div>
                      </Card>

                      {/* Interactive Components Demo */}
                      <Card title="Interactive Components">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4">
                            <Checkbox 
                              checked={customization.darkMode}
                              onChange={(checked) => setCustomization(prev => ({ ...prev, darkMode: checked }))}
                              label="Dark Mode"
                            />
                            <Checkbox 
                              checked={customization.glassEffect}
                              onChange={(checked) => setCustomization(prev => ({ ...prev, glassEffect: checked }))}
                              label="Glass Effect"
                            />
                          </div>
                          
                          <div>
                            <Typography variant="body2" className="font-medium mb-2">Progress</Typography>
                                                         <ProgressBar 
                               value={progressValue}
                               showLabel
                             />
                          </div>

                          <Collapse 
                            title="Advanced Settings"
                            open={collapseOpen}
                            onToggle={() => setCollapseOpen(!collapseOpen)}
                          >
                            <div className="space-y-4">
                              <Typography variant="body2">
                                Additional customization options will appear here.
                              </Typography>
                            </div>
                          </Collapse>
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              </Card>

              {/* Quick Actions with Enhanced UI */}
              <DashboardCard title="Quick Actions" className="mt-4 sm:mt-6 md:mt-8">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                  <Tooltip content="Create a new job">
                    <Button
                      onClick={() => navigate('/jobs/new')}
                      variant="primary"
                      icon={Calendar}
                      className="w-full h-11 sm:h-12"
                    >
                      Create Job
                    </Button>
                  </Tooltip>

                  <Tooltip content="Add a new customer">
                    <Button
                      onClick={() => navigate('/customers/new')}
                      variant="secondary"
                      icon={Users}
                      className="w-full h-11 sm:h-12"
                    >
                      Add Customer
                    </Button>
                  </Tooltip>

                  <Tooltip content="View analytics and reports">
                    <Button
                      onClick={() => navigate('/reports')}
                      variant="success"
                      icon={BarChart3}
                      className="w-full h-11 sm:h-12"
                    >
                      View Reports
                    </Button>
                  </Tooltip>

                  <Tooltip content="Configure system settings">
                    <Button
                      onClick={() => navigate('/settings')}
                      variant="outline"
                      icon={Settings}
                      className="w-full h-11 sm:h-12"
                    >
                      Settings
                    </Button>
                  </Tooltip>
                </div>
              </DashboardCard>

              {/* Metrics Cards - Moved to bottom */}
              <div className="mt-4 sm:mt-6 md:mt-7 lg:mt-8">
                <DashboardMetrics metrics={metrics} />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sticky Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 lg:hidden z-50">
          <div className="flex justify-around items-center p-3">
            <button 
              onClick={() => navigate('/jobs')}
              className="flex flex-col items-center space-y-1 p-3 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] justify-center"
            >
              <Calendar className="h-5 w-5 text-blue-600" />
              <span className="text-xs font-medium text-gray-700">Jobs</span>
            </button>
            <button 
              onClick={() => navigate('/routing')}
              className="flex flex-col items-center space-y-1 p-3 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] justify-center"
            >
              <MapPin className="h-5 w-5 text-green-600" />
              <span className="text-xs font-medium text-gray-700">Map</span>
            </button>
            <button 
              onClick={() => navigate('/customers')}
              className="flex flex-col items-center space-y-1 p-3 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] justify-center"
            >
              <Users className="h-5 w-5 text-purple-600" />
              <span className="text-xs font-medium text-gray-700">Customers</span>
            </button>
            <button 
              onClick={() => navigate('/reports')}
              className="flex flex-col items-center space-y-1 p-3 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] justify-center"
            >
              <BarChart3 className="h-5 w-5 text-orange-600" />
              <span className="text-xs font-medium text-gray-700">Reports</span>
            </button>
          </div>
        </div>

        {/* Enhanced Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Enhanced Features"
          size="lg"
        >
          <div className="space-y-6">
            <Typography variant="h4">Welcome to Enhanced Dashboard!</Typography>
            <Typography variant="body1">
              This enhanced dashboard includes advanced UI components, interactive features, and improved user experience.
            </Typography>
            
            <div className="grid grid-cols-2 gap-4">
              <Button variant="primary" onClick={() => setModalOpen(false)}>
                Get Started
              </Button>
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Learn More
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </ErrorBoundary>
  );
};

export default EnhancedDashboard;
