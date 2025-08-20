import React from 'react';
import { useTodayJobs } from '@/hooks/useJobs';
import { 
  SoftCard, 
  SoftButton, 
  SoftSidebar, 
  SoftNavbar,
  ProgressBar,
  Alert,
  Chart
} from '@/components/ui';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { data: jobs, isLoading: jobsLoading, error: jobsError } = useTodayJobs();

  // Mock data for demo
  const mockJobs = [
    { id: 1, title: 'Pest Control - Downtown Office', status: 'in-progress', progress: 65, technician: 'John Smith', location: '123 Main St', time: '2:30 PM' },
    { id: 2, title: 'Termite Inspection - Residential', status: 'scheduled', progress: 0, technician: 'Sarah Johnson', location: '456 Oak Ave', time: '4:00 PM' },
    { id: 3, title: 'Rodent Control - Warehouse', status: 'completed', progress: 100, technician: 'Mike Wilson', location: '789 Industrial Blvd', time: '1:15 PM' },
  ];

  const displayJobs = jobsError ? mockJobs : jobs || mockJobs;

  const metrics = [
    {
      title: 'Total Jobs',
      value: '24',
      change: 12,
      changeType: 'increase' as const,
      icon: Calendar,
      color: '#3b82f6'
    },
    {
      title: 'Active Technicians',
      value: '8',
      change: 5,
      changeType: 'increase' as const,
      icon: Users,
      color: '#10b981'
    },
    {
      title: 'Completed Today',
      value: '16',
      change: 8,
      changeType: 'increase' as const,
      icon: CheckCircle,
      color: '#8b5cf6'
    },
    {
      title: 'Pending Jobs',
      value: '3',
      change: 2,
      changeType: 'decrease' as const,
      icon: Clock,
      color: '#f59e0b'
    }
  ];

  const chartData = [
    { name: 'Mon', value: 4 },
    { name: 'Tue', value: 6 },
    { name: 'Wed', value: 8 },
    { name: 'Thu', value: 5 },
    { name: 'Fri', value: 7 },
    { name: 'Sat', value: 3 },
    { name: 'Sun', value: 2 }
  ];

  const recentActivity = [
    { id: 1, action: 'Job completed', description: 'Pest control service at Downtown Office', time: '2 min ago', type: 'success' },
    { id: 2, action: 'New job assigned', description: 'Termite inspection at Oak Street', time: '15 min ago', type: 'info' },
    { id: 3, action: 'Technician arrived', description: 'Mike Wilson arrived at Industrial Blvd', time: '1 hour ago', type: 'info' },
    { id: 4, action: 'Customer feedback', description: '5-star rating received', time: '2 hours ago', type: 'success' },
  ];

  return (
    <div className="relative h-full max-h-screen transition-all duration-200 xl:ml-68 rounded-xl">
      <div className="relative flex h-full max-h-screen overflow-hidden">
        {/* Sidebar */}
        <SoftSidebar />

        {/* Main Content */}
        <div className="relative h-full w-full overflow-y-auto bg-gray-50">
          {/* Navbar */}
          <SoftNavbar 
            title="Dashboard"
            subtitle="Welcome back! Here's what's happening today."
          />

          {/* Content */}
          <div className="p-6">
            {/* Demo Mode Alert */}
            {jobsError && (
              <Alert 
                type="warning" 
                title="Demo Mode"
                className="mb-6"
              >
                You're viewing demo data. Connect your backend to see real data.
              </Alert>
            )}

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {metrics.map((metric, index) => (
                <SoftCard key={index} size="sm">
                  <div className="flex items-center">
                    <div
                      className="p-3 rounded-full bg-opacity-20"
                      style={{ backgroundColor: metric.color }}
                    >
                      {(() => {
                        const IconComponent = metric.icon;
                        return <IconComponent className="w-6 h-6" />;
                      })()}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                      {metric.change !== undefined && (
                        <div className="flex items-center mt-1">
                          {metric.changeType === 'increase' ? (
                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                          ) : (
                            <TrendingUp className="w-4 h-4 text-red-500 mr-1 transform rotate-180" />
                          )}
                          <span
                            className={`text-sm font-medium ${
                              metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {metric.change > 0 ? '+' : ''}{metric.change}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </SoftCard>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Jobs Calendar */}
              <div className="lg:col-span-2">
                <SoftCard 
                  title="Today's Jobs"
                  subtitle="Real-time job tracking and management"
                  headerActions={[
                    <SoftButton key="add" size="sm" icon={Plus}>
                      Add Job
                    </SoftButton>
                  ]}
                >
                  <div className="space-y-4">
                    {displayJobs.map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tl from-blue-500 to-violet-500 flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-900">{job.title}</h4>
                            <div className="flex items-center space-x-4 mt-1">
                              <div className="flex items-center text-xs text-gray-500">
                                <Users className="w-3 h-3 mr-1" />
                                {job.technician}
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <MapPin className="w-3 h-3 mr-1" />
                                {job.location}
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock className="w-3 h-3 mr-1" />
                                {job.time}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-24">
                            <ProgressBar 
                              value={job.progress} 
                              size="sm" 
                              showLabel={false}
                              color={job.status === 'completed' ? 'green' : job.status === 'in-progress' ? 'blue' : 'yellow'}
                            />
                          </div>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            job.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : job.status === 'in-progress' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {job.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </SoftCard>
              </div>

              {/* Sidebar Content */}
              <div className="space-y-6">
                {/* Weekly Overview Chart */}
                <SoftCard title="Weekly Overview" subtitle="Jobs completed this week">
                  <Chart 
                    data={chartData} 
                    type="bar" 
                    height={200}
                    color="#3b82f6"
                  />
                </SoftCard>

                {/* Recent Activity */}
                <SoftCard title="Recent Activity" subtitle="Latest updates and events">
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </SoftCard>

                {/* Quick Actions */}
                <SoftCard title="Quick Actions" subtitle="Common tasks and shortcuts">
                  <div className="space-y-3">
                    <SoftButton variant="primary" size="sm" fullWidth icon={Plus}>
                      Create New Job
                    </SoftButton>
                    <SoftButton variant="info" size="sm" fullWidth icon={Users}>
                      Assign Technician
                    </SoftButton>
                    <SoftButton variant="success" size="sm" fullWidth icon={MapPin}>
                      View Routes
                    </SoftButton>
                    <SoftButton variant="secondary" size="sm" fullWidth icon={Calendar}>
                      Schedule Jobs
                    </SoftButton>
                  </div>
                </SoftCard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
