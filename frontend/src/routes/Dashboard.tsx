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
  Users, 
  TrendingUp, 
  ShoppingCart, 
  Eye, 
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  AlertTriangle
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

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, clear: clearAuth } = useAuthStore();
  const { data: jobs, isLoading: jobsLoading, error: jobsError } = useTodayJobs();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Use mock data if API fails, otherwise use real data
  const displayJobs = jobsError ? mockJobs : (jobs || []);
  const isUsingMockData = !!jobsError;

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

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
        {/* Header */}
        <DashboardHeader 
          user={user}
          sidebarOpen={sidebarOpen}
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
              {/* Welcome Section */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user.first_name}!
                </h1>
                <p className="text-gray-600 mt-2">
                  Here's what's happening with your pest control operations today.
                </p>
                {isUsingMockData && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                      <p className="text-sm text-yellow-800">
                        Using demo data. Configure your Supabase connection to see real data.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Metrics Cards */}
              <div className="mb-8">
                <DashboardMetrics metrics={metrics} />
              </div>

              {/* Main Dashboard Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Jobs Calendar */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Today's Jobs
                    </h2>
                    <button
                      onClick={() => navigate('/jobs')}
                      className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                    >
                      View All
                    </button>
                  </div>
                  
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
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Recent Activity
                  </h2>
                  
                  <div className="space-y-4">
                    {displayJobs.slice(0, 5).map((job: Job) => (
                      <div key={job.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-purple-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {job.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {job.technician} • {job.status}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            job.status === 'completed' ? 'bg-green-100 text-green-800' :
                            job.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            job.status === 'scheduled' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {job.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    {displayJobs.length === 0 && (
                      <div className="text-center py-8">
                        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs today</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          All caught up! No jobs scheduled for today.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Quick Actions
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() => navigate('/jobs/new')}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Calendar className="w-6 h-6 text-purple-600 mr-3" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Create Job</p>
                      <p className="text-sm text-gray-500">Schedule new service</p>
                    </div>
                  </button>

                  <button
                    onClick={() => navigate('/customers/new')}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Users className="w-6 h-6 text-blue-600 mr-3" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Add Customer</p>
                      <p className="text-sm text-gray-500">New customer account</p>
                    </div>
                  </button>

                  <button
                    onClick={() => navigate('/reports')}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <BarChart3 className="w-6 h-6 text-green-600 mr-3" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">View Reports</p>
                      <p className="text-sm text-gray-500">Analytics & insights</p>
                    </div>
                  </button>

                  <button
                    onClick={() => navigate('/settings')}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-6 h-6 text-gray-600 mr-3" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Settings</p>
                      <p className="text-sm text-gray-500">Configure system</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;
