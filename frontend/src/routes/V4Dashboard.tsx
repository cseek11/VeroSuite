import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
// import V4Layout from '@/components/layout/V4Layout';
import MigrationStatus from '@/components/MigrationStatus';
import { 
  DollarSign, 
  CheckCircle, 
  Clock, 
  Star, 
  Plus, 
  Route, 
  Phone, 
  Mail, 
  MessageCircle,
  Shield,
  Bug,
  Home,
  Mouse,
  AlertTriangle,
  Check,
  TrendingUp,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import SchedulerPro from '@/components/scheduler/SchedulerPro';

// Mock data - will be replaced with real API calls
const mockKPIs = [
  {
    id: 'revenue',
    label: "Today's Revenue",
    value: "$18,240",
    change: "+12.5%",
    changeType: 'positive',
    icon: DollarSign,
    iconColor: 'text-purple-500'
  },
  {
    id: 'jobs',
    label: "Jobs Completed",
    value: "47/52",
    change: "90.4% completion rate",
    changeType: 'positive',
    icon: CheckCircle,
    iconColor: 'text-green-500'
  },
  {
    id: 'ar',
    label: "AR Aging",
    value: "$12,670",
    change: "+8.3% overdue",
    changeType: 'negative',
    icon: Clock,
    iconColor: 'text-orange-500'
  },
  {
    id: 'satisfaction',
    label: "Customer Satisfaction",
    value: "4.8/5.0",
    change: "+0.2 this month",
    changeType: 'positive',
    icon: Star,
    iconColor: 'text-yellow-500'
  }
];

const mockJobs = [
  {
    id: 1,
    customer: "Johnson Family Residence",
    service: "General Pest Control",
    time: "9:00 AM",
    technician: "A. Davis",
    status: "scheduled",
    agreements: ["general", "mosquito"],
    overdue: false
  },
  {
    id: 2,
    customer: "Acme Corporation",
    service: "Termite Inspection",
    time: "10:30 AM",
    technician: null,
    status: "overdue",
    agreements: ["termite"],
    overdue: true,
    overdueDays: 2
  },
  {
    id: 3,
    customer: "Maria Lopez",
    service: "Rodent Control",
    time: "8:00 AM",
    technician: "B. Patel",
    status: "completed",
    agreements: ["rodent"],
    overdue: false
  }
];

const mockActivityFeed = [
  {
    id: 1,
    type: 'payment',
    message: 'Payment received from Johnson Family',
    amount: '$156.00',
    time: '2 minutes ago',
    color: 'bg-green-500'
  },
  {
    id: 2,
    type: 'job',
    message: 'New job scheduled for Acme Corp',
    detail: 'Termite inspection',
    time: '5 minutes ago',
    color: 'bg-blue-500'
  },
  {
    id: 3,
    type: 'complaint',
    message: 'Customer complaint logged',
    detail: 'Maria Lopez',
    time: '15 minutes ago',
    color: 'bg-orange-500'
  },
  {
    id: 4,
    type: 'route',
    message: 'Route optimized for today',
    detail: 'Saved 23 minutes',
    time: '1 hour ago',
    color: 'bg-purple-500'
  }
];

const agreementIcons = {
  general: { icon: Shield, color: 'bg-green-500' },
  mosquito: { icon: Bug, color: 'bg-purple-500' },
  termite: { icon: Home, color: 'bg-red-500' },
  rodent: { icon: Mouse, color: 'bg-orange-500' }
};

export default function V4Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  // Map and Calendar state
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [calendarView, setCalendarView] = useState('week');
  const [mapInteracting, setMapInteracting] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleAddJob = () => {
    navigate('/jobs/new');
  };

  const handleOptimizeRoute = () => {
    navigate('/routing');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-green-500';
      case 'overdue': return 'border-red-500';
      case 'scheduled': return 'border-blue-500';
      default: return 'border-gray-300';
    }
  };

  const getStatusBadge = (status: string, technician: string | null) => {
    if (status === 'overdue') {
      return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Unassigned</span>;
    }
    if (status === 'completed') {
      return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">{technician}</span>;
    }
    return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">{technician}</span>;
  };

       return (
      <div className="space-y-3">
        {/* Migration Status - Only show in development */}
        {/* {import.meta.env.DEV && <MigrationStatus showDetails={true} />} */}
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600">Overview of your pest control operations</p>
          </div>
          <div className="flex gap-3">
            <button 
              className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center gap-2"
              onClick={handleAddJob}
            >
              <Plus className="w-4 h-4" />
              ADD
            </button>
            <button className="bg-white text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors border">
              VERO PEST 2.1k
            </button>
          </div>
        </div>

                 {/* KPIs Grid */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {mockKPIs.map((kpi) => {
            const Icon = kpi.icon;
            return (
                             <div key={kpi.id} className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-2 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-500">{kpi.label}</div>
                  <Icon className={`w-5 h-5 ${kpi.iconColor}`} />
                </div>
                                 <div className="text-xl font-bold text-gray-800">{kpi.value}</div>
                <div className={`text-xs mt-1 flex items-center gap-1 ${
                  kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className="w-3 h-3" />
                  {kpi.change}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dashboard Overview Section */}
        <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Dashboard Overview</h3>
            <p className="text-sm text-gray-600">Key metrics and performance indicators</p>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Overview Cards */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Total Jobs</p>
                    <p className="text-2xl font-bold text-blue-900">{mockJobs.length}</p>
                    <p className="text-xs text-blue-600">This week</p>
                  </div>
                  <div className="p-2 bg-blue-200 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-blue-700" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Completed</p>
                    <p className="text-2xl font-bold text-green-900">
                      {mockJobs.filter(job => job.status === 'completed').length}
                    </p>
                    <p className="text-xs text-green-600">Today</p>
                  </div>
                  <div className="p-2 bg-green-200 rounded-lg">
                    <Check className="w-6 h-6 text-green-700" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-700">In Progress</p>
                    <p className="text-2xl font-bold text-orange-900">
                      {mockJobs.filter(job => job.status === 'scheduled').length}
                    </p>
                    <p className="text-xs text-orange-600">Active</p>
                  </div>
                  <div className="p-2 bg-orange-200 rounded-lg">
                    <Clock className="w-6 h-6 text-orange-700" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-700">Overdue</p>
                    <p className="text-2xl font-bold text-red-900">
                      {mockJobs.filter(job => job.overdue).length}
                    </p>
                    <p className="text-xs text-red-600">Requires attention</p>
                  </div>
                  <div className="p-2 bg-red-200 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-700" />
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Performance Summary</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Completion Rate</span>
                    <span className="text-sm font-medium text-green-600">94.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Average Response Time</span>
                    <span className="text-sm font-medium text-blue-600">2.3 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Customer Satisfaction</span>
                    <span className="text-sm font-medium text-purple-600">4.8/5.0</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    className="p-2 bg-purple-100 text-purple-700 rounded text-sm font-medium hover:bg-purple-200 transition-colors flex items-center gap-1"
                    onClick={handleAddJob}
                  >
                    <Plus className="w-3 h-3" />
                    Add Job
                  </button>
                  <button 
                    className="p-2 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200 transition-colors flex items-center gap-1"
                    onClick={handleOptimizeRoute}
                  >
                    <Route className="w-3 h-3" />
                    Optimize
                  </button>
                  <button 
                    className="p-2 bg-green-100 text-green-700 rounded text-sm font-medium hover:bg-green-200 transition-colors flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    Call Center
                  </button>
                  <button 
                    className="p-2 bg-orange-100 text-orange-700 rounded text-sm font-medium hover:bg-orange-200 transition-colors flex items-center gap-1"
                  >
                    <Mail className="w-3 h-3" />
                    Messages
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map and Calendar Overview */}
        <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Operations Overview</h3>
                <p className="text-sm text-gray-600">Map view with calendar overlay</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="bg-purple-500 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-purple-600 transition-colors flex items-center gap-1"
                >
                  <MapPin className="w-4 h-4" />
                  {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="relative" style={{ height: '600px' }}>
            {/* Map Background */}
            <div className="absolute inset-0 z-0">
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
                  <div className="text-center">
                    <MapPin className="mx-auto h-12 w-12 mb-4" />
                    <p className="text-lg font-medium">Loading Map...</p>
                    <p className="text-sm">Pittsburgh, PA</p>
                  </div>
                </div>
              }>
                <MapContainer 
                  center={[40.44, -79.99]} 
                  zoom={windowWidth < 768 ? 10 : windowWidth < 1024 ? 11 : 12}
                  className="h-full w-full"
                  style={{ height: '100%', minHeight: '600px' }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  
                  {/* Job Locations */}
                  {mockJobs.map((job) => (
                    <Marker 
                      key={job.id} 
                      position={[
                        40.44 + (Math.random() - 0.5) * 0.1, 
                        -79.99 + (Math.random() - 0.5) * 0.1
                      ]}
                    >
                      <Popup>
                        <div className="p-2">
                          <div className="font-medium text-sm">
                            {job.customer}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {job.technician || 'Unassigned'} • {job.status}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                  
                  {/* Sample Route Lines */}
                  {mockJobs.length > 1 && (
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
              </Suspense>
            </div>

            {/* Calendar Overlay */}
            <div 
              className={`absolute z-10 bg-white/30 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 ${mapInteracting ? 'opacity-0' : 'opacity-100'}`}
              style={{ 
                top: '20px',
                left: '20px',
                width: '400px', 
                height: '500px',
                minWidth: '400px',
                minHeight: '500px',
                maxWidth: '600px',
                maxHeight: '700px'
              }}
            >
              <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50/30">
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => setCalendarView('day')}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors flex-shrink-0 w-auto min-w-0 ${
                      calendarView === 'day' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Day
                  </button>
                  <button 
                    onClick={() => setCalendarView('week')}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors flex-shrink-0 w-auto min-w-0 ${
                      calendarView === 'week' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Week
                  </button>
                  <button 
                    onClick={() => setCalendarView('month')}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors flex-shrink-0 w-auto min-w-0 ${
                      calendarView === 'month' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Month
                  </button>
                  <button 
                    onClick={() => setCalendarView('timeline')}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors flex-shrink-0 w-auto min-w-0 ${
                      calendarView === 'timeline' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Timeline
                  </button>
                </div>
                <div className="flex space-x-1">
                  <button 
                    className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => setMapInteracting(!mapInteracting)}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="h-full">
                <SchedulerPro
                  initialView={calendarView}
                  resources={[
                    { id: "unassigned", name: "Unassigned", color: "#9CA3AF" },
                    { id: "ashley", name: "Ashley", color: "#60A5FA" },
                    { id: "john", name: "John", color: "#34D399" },
                    { id: "sarah", name: "Sarah", color: "#F59E0B" },
                  ]}
                  dataAdapter={{
                    source: mockJobs.map(job => ({
                      id: job.id.toString(),
                      title: job.customer,
                      start: new Date().toISOString(),
                      end: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
                      resourceId: job.technician || 'unassigned',
                      color: job.status === 'completed' ? '#22c55e' :
                             job.status === 'overdue' ? '#ef4444' :
                             '#3b82f6',
                      status: job.status,
                      service: job.service
                    }))
                  }}
                  hideToolbar={true}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Today's Schedule */}
                                <div className="lg:col-span-2 bg-white/90 rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200">
             <div className="p-2 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Today's Schedule</h3>
                <div className="flex gap-2">
                  <button 
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center gap-1"
                    onClick={handleAddJob}
                  >
                    <Plus className="w-3 h-3" />
                    Add Job
                  </button>
                  <button 
                    className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors flex items-center gap-1"
                    onClick={handleOptimizeRoute}
                  >
                    <Route className="w-3 h-3" />
                    Optimize Route
                  </button>
                </div>
              </div>
                         </div>
                           <div className="p-2">
                <div 
                  className="space-y-1 max-h-64"
                  style={{
                    marginRight: '15px',
                    scrollbarGutter: 'stable',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    scrollbarWidth: 'thin',
                    msOverflowStyle: 'none'
                  }}
                >
                  {mockJobs.map((job) => (
                                     <div 
                     key={job.id}
                     className={`bg-white rounded-lg border border-gray-200 p-1 hover:shadow-md transition-all cursor-pointer ${
                       getStatusColor(job.status)
                     } border-l-4`}
                   >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          {job.agreements.map((agreement) => {
                            const { icon: Icon, color } = agreementIcons[agreement as keyof typeof agreementIcons];
                            return (
                              <span key={agreement} className={`w-3.5 h-3.5 rounded-full ${color} flex items-center justify-center`}>
                                <Icon className="w-2 h-2 text-white" />
                              </span>
                            );
                          })}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{job.customer}</div>
                          <div className="text-sm text-gray-600">{job.service} • {job.time}</div>
                          {job.overdue && (
                            <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Overdue by {job.overdueDays} days
                            </div>
                          )}
                          {job.status === 'completed' && (
                            <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              Completed
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(job.status, job.technician)}
                        <div className="flex gap-1">
                          <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                            <Phone className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                            <Mail className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-purple-600 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                                         <div className="mt-1 pt-1 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          Activities
                          {job.status === 'overdue' && (
                            <span className="bg-red-100 text-red-700 px-1 rounded ml-1">1</span>
                          )}
                          {job.status === 'completed' && (
                            <span className="bg-green-100 text-green-700 px-1 rounded ml-1">2</span>
                          )}
                        </div>
                        <button className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1">
                          <Plus className="w-3 h-3" />
                          Schedule
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
                     {/* Activity Feed */}
                     <div className="bg-white/50 rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200">
            <div className="p-2 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Activity Feed</h3>
            </div>
                                      <div className="p-2">
               <div 
                 className="space-y-1 max-h-64"
                 style={{
                   marginRight: '15px',
                   scrollbarGutter: 'stable',
                   overflowY: 'auto',
                   overflowX: 'hidden',
                   scrollbarWidth: 'thin',
                   msOverflowStyle: 'none'
                 }}
               >
                 {mockActivityFeed.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${activity.color}`}></div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-800">{activity.message}</div>
                      <div className="text-xs text-gray-500">
                        {activity.amount && `${activity.amount} • `}
                        {activity.detail && `${activity.detail} • `}
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
