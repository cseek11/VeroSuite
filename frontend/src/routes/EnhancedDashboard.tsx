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
import { DashboardMetric, Job } from '@/types';
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
  Filter,
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
  Heart
} from 'lucide-react';

// Mock data for development
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Pest Control - Downtown Office',
    start: new Date().toISOString(),
    end: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    status: 'scheduled',
    technician: 'John Smith',
    location: '123 Main St, Downtown',
    description: 'Regular pest control service'
  },
  {
    id: '2',
    title: 'Termite Inspection - Warehouse',
    start: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    end: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    status: 'in-progress',
    technician: 'Sarah Johnson',
    location: '456 Industrial Blvd',
    description: 'Annual termite inspection'
  },
  {
    id: '3',
    title: 'Rodent Control - Restaurant',
    start: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    end: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    status: 'scheduled',
    technician: 'Mike Wilson',
    location: '789 Food Court',
    description: 'Emergency rodent control service'
  }
];

// Sample data for charts and advanced features
const salesData = [
  { name: 'Jan', sales: 4000, revenue: 2400, users: 240 },
  { name: 'Feb', sales: 3000, revenue: 1398, users: 139 },
  { name: 'Mar', sales: 2000, revenue: 9800, users: 980 },
  { name: 'Apr', sales: 2780, revenue: 3908, users: 390 },
  { name: 'May', sales: 1890, revenue: 4800, users: 480 },
  { name: 'Jun', sales: 2390, revenue: 3800, users: 380 },
];

const kanbanData = {
  todo: [
    { id: 1, title: 'Design new landing page', priority: 'high', assignee: 'John Doe' },
    { id: 2, title: 'Update user documentation', priority: 'medium', assignee: 'Jane Smith' }
  ],
  inProgress: [
    { id: 3, title: 'Implement authentication', priority: 'high', assignee: 'Bob Johnson' }
  ],
  done: [
    { id: 4, title: 'Setup CI/CD pipeline', priority: 'low', assignee: 'Alice Brown' }
  ]
};

const calendarEvents = [
  { date: '2024-08-20', title: 'Team Meeting', type: 'meeting' },
  { date: '2024-08-22', title: 'Product Launch', type: 'event' },
  { date: '2024-08-25', title: 'Client Review', type: 'review' }
];

const photos = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800'
];

const wizardSteps = [
  { title: 'Personal Info', description: 'Enter your basic information' },
  { title: 'Preferences', description: 'Set your preferences' },
  { title: 'Review', description: 'Review and confirm' }
];

const choiceOptions = [
  { value: 'option1', label: 'First Option' },
  { value: 'option2', label: 'Second Option' },
  { value: 'option3', label: 'Third Option' }
];

const EnhancedDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, clear: clearAuth } = useAuthStore();
  const { data: jobs, isLoading: jobsLoading, error: jobsError } = useTodayJobs();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [modalOpen, setModalOpen] = useState(false);
  const [alertVisible, setAlertVisible] = useState(true);
  const [tooltipVisible, setTooltipVisible] = useState({});
  const [tabsActive, setTabsActive] = useState('tab1');
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

  // Mock metrics data - in real app, this would come from API
  const metrics: DashboardMetric[] = [
    {
      title: 'Total Jobs',
      value: displayJobs.length,
      change: 12,
      changeType: 'increase',
      icon: Calendar,
      color: '#3b82f6'
    },
    {
      title: 'Active Technicians',
      value: 8,
      change: 5,
      changeType: 'increase',
      icon: Users,
      color: '#10b981'
    },
    {
      title: 'Revenue',
      value: '$45,231',
      change: 20.1,
      changeType: 'increase',
      icon: TrendingUp,
      color: '#f59e0b'
    },
    {
      title: 'Customer Satisfaction',
      value: '98%',
      change: 2.1,
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

  if (!user) {
    return <PageLoader text="Loading dashboard..." />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Enhanced Header */}
        <Navbar 
          title="VeroPest Suite Dashboard"
          user={{ name: user.first_name, avatar: user.avatar }}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          onLogout={handleLogout}
        />

        <div className="flex">
          {/* Sidebar */}
          <DashboardSidebar
            isOpen={sidebarOpen}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onClose={() => setSidebarOpen(false)}
          />

          {/* Main Content */}
          <div className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {/* Welcome Section with Enhanced UI */}
              <div className="mb-8">
                <Typography variant="h1" className="text-gray-900">
                  Welcome back, {user.first_name}!
                </Typography>
                <Typography variant="body1" className="text-gray-600 mt-2">
                  Here's what's happening with your pest control operations today.
                </Typography>
                
                {/* Enhanced Alert */}
                {isUsingMockData && (
                  <Alert 
                    type="warning" 
                    title="Demo Mode"
                    onClose={() => setAlertVisible(false)}
                    className="mt-4"
                  >
                    Using demo data. Configure your Supabase connection to see real data.
                  </Alert>
                )}

                {/* Customization Alert */}
                {alertVisible && (
                  <Alert 
                    type="info" 
                    title="New Features Available"
                    onClose={() => setAlertVisible(false)}
                    className="mt-4"
                  >
                    Check out the new enhanced UI components and interactive features!
                  </Alert>
                )}
              </div>

              {/* Metrics Cards */}
              <div className="mb-8">
                <DashboardMetrics metrics={metrics} />
              </div>

              {/* Enhanced Dashboard Content with Tabs */}
              <Card title="Dashboard Overview" actions={[
                <Button key="refresh" size="sm" icon={RefreshCw}>Refresh</Button>,
                <Button key="export" size="sm" variant="outline" icon={Download}>Export</Button>
              ]}>
                <Tabs
                  tabs={[
                    { id: 'overview', label: 'Overview', icon: Home },
                    { id: 'jobs', label: 'Jobs', icon: Calendar },
                    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                    { id: 'customization', label: 'Customization', icon: Palette }
                  ]}
                  active={tabsActive}
                  onTabChange={setTabsActive}
                />

                <div className="mt-6">
                  {tabsActive === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Jobs Calendar */}
                      <Card title="Today's Jobs" actions={[
                        <Button key="view-all" size="sm" variant="outline" onClick={() => navigate('/jobs')}>
                          View All
                        </Button>
                      ]}>
                        <Suspense fallback={<LoadingSpinner text="Loading calendar..." />}>
                          {jobsLoading ? (
                            <LoadingSpinner text="Loading jobs..." />
                          ) : (
                            <JobsCalendar 
                              events={displayJobs}
                              height="400px"
                              view="timeGridDay"
                            />
                          )}
                        </Suspense>
                      </Card>

                      {/* Recent Activity with Enhanced UI */}
                      <Card title="Recent Activity">
                        <div className="space-y-4">
                          {displayJobs.slice(0, 5).map((job: Job) => (
                            <div key={job.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <Avatar size="sm" fallback={job.technician?.charAt(0) || 'T'} />
                              <div className="flex-1 min-w-0">
                                <Typography variant="body2" className="font-medium text-gray-900 truncate">
                                  {job.title}
                                </Typography>
                                <Typography variant="caption" className="text-gray-500">
                                  {job.technician} • {job.status}
                                </Typography>
                              </div>
                              <Chip 
                                variant={
                                  job.status === 'completed' ? 'success' :
                                  job.status === 'in-progress' ? 'primary' :
                                  job.status === 'scheduled' ? 'default' : 'warning'
                                }
                              >
                                {job.status}
                              </Chip>
                            </div>
                          ))}
                          
                          {displayJobs.length === 0 && (
                            <div className="text-center py-8">
                              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                              <Typography variant="h6" className="mt-2 text-gray-900">No jobs today</Typography>
                              <Typography variant="body2" className="text-gray-500">
                                All caught up! No jobs scheduled for today.
                              </Typography>
                            </div>
                          )}
                        </div>
                      </Card>
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
              <Card title="Quick Actions" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Tooltip content="Create a new job">
                    <Button
                      onClick={() => navigate('/jobs/new')}
                      variant="primary"
                      icon={Calendar}
                      className="w-full"
                    >
                      Create Job
                    </Button>
                  </Tooltip>

                  <Tooltip content="Add a new customer">
                    <Button
                      onClick={() => navigate('/customers/new')}
                      variant="secondary"
                      icon={Users}
                      className="w-full"
                    >
                      Add Customer
                    </Button>
                  </Tooltip>

                  <Tooltip content="View analytics and reports">
                    <Button
                      onClick={() => navigate('/reports')}
                      variant="success"
                      icon={BarChart3}
                      className="w-full"
                    >
                      View Reports
                    </Button>
                  </Tooltip>

                  <Tooltip content="Configure system settings">
                    <Button
                      onClick={() => navigate('/settings')}
                      variant="outline"
                      icon={Settings}
                      className="w-full"
                    >
                      Settings
                    </Button>
                  </Tooltip>
                </div>
              </Card>
            </div>
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
