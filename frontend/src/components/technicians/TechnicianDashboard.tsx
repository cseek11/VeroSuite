import React, { useState, useMemo } from 'react';
import { useTechnicians, useTechnicianDashboardStats, useTechnicianPerformanceMetrics, useTechnicianAvailabilityData } from '@/hooks/useTechnicians';
import { useJobs } from '@/hooks/useJobs';
import { TechnicianProfile, TechnicianStatus } from '@/types/technician';
import { Job, JobStatus } from '@/types/jobs';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Activity,
  MapPin,
  Award,
  Star,
  Filter,
  Search,
  Calendar,
  BarChart3,
  PieChart,
  Target
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface TechnicianDashboardProps {
  selectedTechnician?: TechnicianProfile;
  onTechnicianSelect?: (technician: TechnicianProfile) => void;
  timeRange?: 'today' | 'week' | 'month' | 'quarter';
}

interface TechnicianMetrics {
  technician: TechnicianProfile;
  totalJobs: number;
  completedJobs: number;
  pendingJobs: number;
  canceledJobs: number;
  completionRate: number;
  averageJobTime: number;
  totalHours: number;
  utilizationRate: number;
  customerRating: number;
  onTimeRate: number;
  skills: string[];
  certifications: string[];
  performance: 'excellent' | 'good' | 'average' | 'needs_improvement';
}

interface DashboardStats {
  totalTechnicians: number;
  activeTechnicians: number;
  totalJobs: number;
  completedJobs: number;
  averageCompletionRate: number;
  averageUtilization: number;
  topPerformers: TechnicianMetrics[];
  recentActivity: ActivityItem[];
}

interface ActivityItem {
  id: string;
  type: 'job_completed' | 'job_assigned' | 'status_change' | 'rating_received';
  technician: TechnicianProfile;
  description: string;
  timestamp: string;
  metadata?: any;
}

export default function TechnicianDashboard({
  selectedTechnician,
  onTechnicianSelect,
  timeRange = 'week'
}: TechnicianDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<TechnicianStatus | ''>('');
  const [sortBy, setSortBy] = useState<'performance' | 'utilization' | 'completion' | 'name'>('performance');
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'performance'>('overview');

  const { data: techniciansData, isLoading: techniciansLoading } = useTechnicians({
    status: filterStatus || undefined,
    limit: 50
  });

  const { data: jobsData, isLoading: jobsLoading } = useJobs({
    start_date: getDateRange(timeRange).start,
    end_date: getDateRange(timeRange).end
  });

  const { data: calculatedDashboardStats, isLoading: statsLoading } = useTechnicianDashboardStats();
  const { data: performanceMetrics, isLoading: performanceLoading } = useTechnicianPerformanceMetrics();
  const { data: availabilityData, isLoading: availabilityLoading } = useTechnicianAvailabilityData();

  const technicians = techniciansData?.technicians || [];
  const jobs = jobsData?.data || [];

  // Get date range based on time range
  function getDateRange(range: string) {
    const now = new Date();
    const start = new Date();
    
    switch (range) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        break;
      case 'week':
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        start.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(now.getMonth() - 3);
        break;
    }
    
    return {
      start: start.toISOString(),
      end: now.toISOString()
    };
  }

  // Calculate technician metrics
  const calculateTechnicianMetrics = (technician: TechnicianProfile): TechnicianMetrics => {
    const technicianJobs = jobs.filter(job => job.technician_id === technician.id);
    
    const totalJobs = technicianJobs.length;
    const completedJobs = technicianJobs.filter(job => job.status === JobStatus.COMPLETED).length;
    const pendingJobs = technicianJobs.filter(job => job.status === JobStatus.SCHEDULED).length;
    const canceledJobs = technicianJobs.filter(job => job.status === JobStatus.CANCELED).length;
    
    const completionRate = totalJobs > 0 ? (completedJobs / totalJobs) * 100 : 0;
    const averageJobTime = 2.5; // Mock data - would calculate from actual job times
    const totalHours = completedJobs * averageJobTime;
    const utilizationRate = Math.min(100, (totalHours / (7 * 8)) * 100); // 7 days * 8 hours
    const customerRating = 4.2 + Math.random() * 0.8; // Mock rating
    const onTimeRate = 85 + Math.random() * 15; // Mock on-time rate
    
    const skills = ['General Pest Control', 'Termite Treatment', 'Rodent Control', 'Bed Bug Treatment'];
    const certifications = ['Pesticide License', 'Safety Certification', 'CPR Certified'];
    
    let performance: TechnicianMetrics['performance'] = 'average';
    if (completionRate >= 90 && customerRating >= 4.5) {
      performance = 'excellent';
    } else if (completionRate >= 80 && customerRating >= 4.0) {
      performance = 'good';
    } else if (completionRate < 70 || customerRating < 3.5) {
      performance = 'needs_improvement';
    }
    
    return {
      technician,
      totalJobs,
      completedJobs,
      pendingJobs,
      canceledJobs,
      completionRate,
      averageJobTime,
      totalHours,
      utilizationRate,
      customerRating,
      onTimeRate,
      skills,
      certifications,
      performance
    };
  };

  // Calculate dashboard stats using API data
  const calculatedDashboardStats = useMemo((): DashboardStats => {
    const totalTechnicians = calculatedDashboardStats?.totalTechnicians || technicians.length;
    const activeTechnicians = calculatedDashboardStats?.activeTechnicians || technicians.filter(t => t.status === TechnicianStatus.ACTIVE).length;
    const totalJobs = jobs.length;
    const completedJobs = jobs.filter(job => job.status === JobStatus.COMPLETED).length;
    
    const technicianMetrics = technicians.map(calculateTechnicianMetrics);
    const averageCompletionRate = performanceMetrics?.averageCompletionRate || 
      (technicianMetrics.reduce((sum, m) => sum + m.completionRate, 0) / technicianMetrics.length || 0);
    const averageUtilization = performanceMetrics?.averageUtilization || 
      (technicianMetrics.reduce((sum, m) => sum + m.utilizationRate, 0) / technicianMetrics.length || 0);
    
    const topPerformers = performanceMetrics?.metrics?.slice(0, 5).map((metric: any) => ({
      technician: technicians.find(t => t.id === metric.technicianId) || technicians[0],
      totalJobs: metric.jobsCompleted,
      completedJobs: metric.jobsCompleted,
      pendingJobs: 0,
      canceledJobs: 0,
      completionRate: metric.completionRate,
      averageJobTime: 2.5,
      totalHours: metric.jobsCompleted * 2.5,
      utilizationRate: metric.utilizationRate,
      customerRating: parseFloat(metric.customerRating),
      onTimeRate: metric.onTimeRate,
      skills: ['General Pest Control'],
      certifications: ['Pesticide License'],
      performance: metric.completionRate >= 90 ? 'excellent' : metric.completionRate >= 80 ? 'good' : 'average'
    })) || technicianMetrics
      .sort((a, b) => b.completionRate - a.completionRate)
      .slice(0, 5);
    
    const recentActivity: ActivityItem[] = [
      {
        id: '1',
        type: 'job_completed',
        technician: technicians[0],
        description: 'Completed termite inspection at 123 Main St',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: '2',
        type: 'job_assigned',
        technician: technicians[1],
        description: 'Assigned to rodent control job at 456 Oak Ave',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        id: '3',
        type: 'rating_received',
        technician: technicians[2],
        description: 'Received 5-star rating from customer',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      }
    ];
    
    return {
      totalTechnicians,
      activeTechnicians,
      totalJobs,
      completedJobs,
      averageCompletionRate,
      averageUtilization,
      topPerformers,
      recentActivity
    };
  }, [technicians, jobs, calculatedDashboardStats, performanceMetrics]);

  // Filter and sort technicians
  const filteredTechnicians = useMemo(() => {
    let filtered = technicians;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(tech =>
        tech.user?.first_name?.toLowerCase().includes(searchLower) ||
        tech.user?.last_name?.toLowerCase().includes(searchLower) ||
        tech.user?.email?.toLowerCase().includes(searchLower) ||
        tech.position?.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (filterStatus) {
      filtered = filtered.filter(tech => tech.status === filterStatus);
    }

    // Sort technicians
    filtered.sort((a, b) => {
      const metricsA = calculateTechnicianMetrics(a);
      const metricsB = calculateTechnicianMetrics(b);
      
      switch (sortBy) {
        case 'performance':
          return metricsB.completionRate - metricsA.completionRate;
        case 'utilization':
          return metricsB.utilizationRate - metricsA.utilizationRate;
        case 'completion':
          return metricsB.completedJobs - metricsA.completedJobs;
        case 'name':
          return `${a.user?.first_name} ${a.user?.last_name}`.localeCompare(
            `${b.user?.first_name} ${b.user?.last_name}`
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [technicians, searchTerm, filterStatus, sortBy]);

  // Get performance color
  const getPerformanceColor = (performance: TechnicianMetrics['performance']) => {
    switch (performance) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'average': return 'text-yellow-600 bg-yellow-50';
      case 'needs_improvement': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Get performance icon
  const getPerformanceIcon = (performance: TechnicianMetrics['performance']) => {
    switch (performance) {
      case 'excellent': return <Star className="h-4 w-4" />;
      case 'good': return <CheckCircle className="h-4 w-4" />;
      case 'average': return <AlertCircle className="h-4 w-4" />;
      case 'needs_improvement': return <XCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  if (techniciansLoading || jobsLoading || statsLoading || performanceLoading || availabilityLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Technician Dashboard</h2>
          <p className="text-gray-600">Monitor technician performance and workload</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => {/* Handle time range change */}}
            className="crm-input"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Technicians</p>
              <p className="text-2xl font-semibold text-gray-900">{calculatedDashboardStats.totalTechnicians}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Technicians</p>
              <p className="text-2xl font-semibold text-gray-900">{calculatedDashboardStats.activeTechnicians}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {calculatedDashboardStats.averageCompletionRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Utilization</p>
              <p className="text-2xl font-semibold text-gray-900">
                {calculatedDashboardStats.averageUtilization.toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search technicians..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as TechnicianStatus | '')}
              className="crm-input"
            >
              <option value="">All Statuses</option>
              <option value={TechnicianStatus.ACTIVE}>Active</option>
              <option value={TechnicianStatus.INACTIVE}>Inactive</option>
              <option value={TechnicianStatus.ON_LEAVE}>On Leave</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="crm-input"
            >
              <option value="performance">Performance</option>
              <option value="utilization">Utilization</option>
              <option value="completion">Jobs Completed</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Top Performers */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
        <div className="space-y-4">
          {calculatedDashboardStats.topPerformers.map((metrics, index) => (
            <div key={metrics.technician.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold">
                  {index + 1}
                </div>
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-purple-600">
                    {metrics.technician.user?.first_name?.[0]}{metrics.technician.user?.last_name?.[0]}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {metrics.technician.user?.first_name} {metrics.technician.user?.last_name}
                  </h4>
                  <p className="text-sm text-gray-600">{metrics.technician.position}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600">Completion Rate</div>
                  <div className="font-semibold text-green-600">{metrics.completionRate.toFixed(1)}%</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Jobs Completed</div>
                  <div className="font-semibold text-gray-900">{metrics.completedJobs}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Rating</div>
                  <div className="font-semibold text-yellow-600">{metrics.customerRating.toFixed(1)}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getPerformanceColor(metrics.performance)}`}>
                  {getPerformanceIcon(metrics.performance)}
                  {metrics.performance.replace('_', ' ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Technicians Performance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTechnicians.map((technician) => {
          const metrics = calculateTechnicianMetrics(technician);
          
          return (
            <Card key={technician.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-lg font-medium text-purple-600">
                      {technician.user?.first_name?.[0]}{technician.user?.last_name?.[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {technician.user?.first_name} {technician.user?.last_name}
                    </h3>
                    <p className="text-sm text-gray-600">{technician.position}</p>
                  </div>
                </div>
                
                <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getPerformanceColor(metrics.performance)}`}>
                  {getPerformanceIcon(metrics.performance)}
                  {metrics.performance.replace('_', ' ')}
                </div>
              </div>

              {/* Metrics */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <span className="font-semibold text-green-600">{metrics.completionRate.toFixed(1)}%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Jobs Completed</span>
                  <span className="font-semibold text-gray-900">{metrics.completedJobs}/{metrics.totalJobs}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Utilization</span>
                  <span className="font-semibold text-blue-600">{metrics.utilizationRate.toFixed(1)}%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Customer Rating</span>
                  <span className="font-semibold text-yellow-600">{metrics.customerRating.toFixed(1)}</span>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {metrics.skills.slice(0, 2).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {metrics.skills.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{metrics.skills.length - 2}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <Button
                onClick={() => onTechnicianSelect?.(technician)}
                variant="outline"
                className="w-full"
              >
                View Details
              </Button>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {calculatedDashboardStats.recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-xs font-medium text-purple-600">
                  {activity.technician.user?.first_name?.[0]}{activity.technician.user?.last_name?.[0]}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.description}</p>
                <p className="text-xs text-gray-500">
                  {activity.technician.user?.first_name} {activity.technician.user?.last_name} • 
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
