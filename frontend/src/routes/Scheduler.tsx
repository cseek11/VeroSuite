

import React, { useState, useEffect, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Calendar,
  Clock,
  Users,
  Plus,
  Route,
  MapPin,
  ChevronDown,
  Search,
  Filter,
  MoreVertical,
  FileText,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

// Real data will be fetched from API
import { enhancedApi } from '@/lib/enhanced-api';
import { logger } from '@/utils/logger';
import { ScheduleCalendar } from '@/components/scheduling/ScheduleCalendar';
import { ResourceTimeline } from '@/components/scheduling/ResourceTimeline';

const SchedulerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [_calendarView, _setCalendarView] = useState('week');
  const [mapInteracting, setMapInteracting] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch jobs and technicians from API
  const { data: jobs = [] } = useQuery({
    queryKey: ['scheduler-jobs', selectedDate],
    queryFn: () => {
      const dateStr = selectedDate.toISOString().split('T')[0];
      return enhancedApi.jobs.list({ scheduled_date: dateStr });
    },
  });

  const { data: technicians = [] } = useQuery({
    queryKey: ['scheduler-technicians'],
    queryFn: () => enhancedApi.users.list({ roles: ['technician'], status: 'active' }),
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Calendar },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'technicians', label: 'Technicians', icon: Users },
    { id: 'routes', label: 'Routes', icon: Route },
    { id: 'reports', label: 'Reports', icon: FileText }
  ];

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAddJob = () => {
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Add new job', {}, 'Scheduler');
    }
  };

  const handleOptimizeRoute = () => {
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Optimize route', {}, 'Scheduler');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const _getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'scheduled': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const _getMarkerColor = (status: string) => {
    switch (status) {
      case 'completed': return '#22c55e';
      case 'scheduled': return '#3b82f6';
      case 'overdue': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Filter jobs based on search query - FIXED to search by names
  const filteredJobs = jobs.filter((job: any) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      job.customer?.toLowerCase().includes(searchLower) ||
      (job.technician && job.technician.toLowerCase().includes(searchLower)) ||
      job.service?.toLowerCase().includes(searchLower)
    );
  });

  // Note: calendarEvents and technicianResources are computed by ScheduleCalendar internally
  // These were previously computed here but are now unused as ScheduleCalendar handles its own data

  // Calculate map center based on job locations
  const mapCenter = filteredJobs.length > 0 
    ? [
        filteredJobs.reduce((sum: number, job: any) => sum + (job.location?.[0] || 0), 0) / filteredJobs.length,
        filteredJobs.reduce((sum: number, job: any) => sum + (job.location?.[1] || 0), 0) / filteredJobs.length
      ]
    : [40.44, -79.99]; // Default to Pittsburgh

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl rounded-md shadow-sm border border-white/20 p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
              Scheduling Dashboard
            </h1>
            <p className="text-slate-600 text-sm">
              Manage jobs, technicians, and optimize routes for maximum efficiency
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-1.5 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 flex items-center gap-2 font-medium text-sm h-8">
              <Route className="h-3 w-3" />
              Optimize Routes
            </button>
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-md hover:from-indigo-700 hover:to-purple-700 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 font-medium text-sm h-8">
              <Plus className="h-3 w-3" />
              New Job
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-md shadow-sm p-3 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
            <div className="text-xl font-bold mb-1">{filteredJobs.length}</div>
            <div className="text-blue-100 font-medium text-xs">Total Jobs</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-md shadow-sm p-3 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="text-xl font-bold mb-1">{technicians.length - 1}</div>
            <div className="text-emerald-100 font-medium text-xs">Active Technicians</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-md shadow-sm p-3 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
            <div className="text-xl font-bold mb-1">
              {filteredJobs.filter((job: any) => job.status === 'completed').length}
            </div>
            <div className="text-violet-100 font-medium text-xs">Completed</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-md shadow-sm p-3 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
            <div className="text-xl font-bold mb-1">
              {filteredJobs.filter((job: any) => job.status === 'overdue').length}
            </div>
            <div className="text-amber-100 font-medium text-xs">Overdue</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/80 backdrop-blur-xl rounded-md shadow-sm border border-white/20 p-3 mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search jobs, customers, or technicians..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-1.5 border border-slate-200 rounded-md bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm h-8"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-slate-200 rounded-md px-2 py-1.5 min-w-[120px] bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm h-8"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
          <button className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-1.5 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 flex items-center gap-2 font-medium text-sm h-8">
            <Filter className="h-3 w-3" />
            Filters
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0 overflow-hidden mb-4">
        <div className="flex space-x-4 overflow-x-auto border-b border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 py-1 px-1 border-b-2 font-medium text-xs whitespace-nowrap transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className="h-3 w-3" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="space-y-4">
          {activeTab === 'overview' && (
            <>
              {/* Map and Calendar Section */}
              <div className="bg-white/80 backdrop-blur-xl rounded-md shadow-sm border border-white/20 p-3">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                    <div className="p-1 bg-indigo-100 rounded-md">
                      <MapPin className="h-4 w-4 text-indigo-600" />
                    </div>
                    Live Operations Map
                  </h2>
                  <div className="flex gap-2">
                    <button 
                      className="px-2 py-1.5 text-xs bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors flex items-center gap-1 h-8"
                      onClick={handleAddJob}
                    >
                      <Plus className="w-3 h-3" />
                      Add Job
                    </button>
                    <button 
                      className="px-2 py-1.5 text-xs bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors flex items-center gap-1 h-8"
                      onClick={handleOptimizeRoute}
                    >
                      <Route className="w-3 h-3" />
                      Optimize Route
                    </button>
                  </div>
                </div>
                
                <div className="relative" style={{ height: '500px' }}>
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
                        center={mapCenter} 
                        zoom={windowWidth < 768 ? 10 : windowWidth < 1024 ? 11 : 12}
                        className="h-full w-full rounded-lg"
                        style={{ height: '100%', minHeight: '500px' }}
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        
                        {/* Job Locations - Now properly synced with filtered jobs */}
                        {filteredJobs.map((job: any) => (
                          <Marker 
                            key={job.id} 
                            position={job.location}
                          >
                            <Popup>
                              <div className="p-2">
                                <div className="font-medium text-sm">
                                  {job.customer}
                                </div>
                                <div className="text-gray-500 text-xs">
                                  {job.service}
                                </div>
                                <div className="text-gray-500 text-xs">
                                  {job.technician || 'Unassigned'} • {job.status}
                                </div>
                                <div className="text-gray-500 text-xs">
                                  {job.time}
                                </div>
                                <div className="mt-2">
                                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(job.status)}`}>
                                    {job.status}
                                  </span>
                                </div>
                              </div>
                            </Popup>
                          </Marker>
                        ))}
                        
                        {/* Route Lines - Connect jobs in sequence */}
                        {filteredJobs.length > 1 && (
                          <Polyline
                            positions={filteredJobs.map((job: any) => job.location || [0, 0])}
                            color="blue"
                            weight={3}
                            opacity={0.7}
                          />
                        )}
                      </MapContainer>
                    </Suspense>
                  </div>

                  {/* Calendar Overlay - Using ScheduleCalendar */}
                  <div 
                    className={`absolute z-10 bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 ${mapInteracting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    style={{ 
                      top: '20px',
                      left: '20px',
                      width: '400px', 
                      height: '500px',
                      minWidth: '350px',
                      minHeight: '400px',
                      maxWidth: '450px',
                      maxHeight: '550px'
                    }}
                  >
                    <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-gray-50">
                      <span className="text-sm font-medium text-gray-700">Schedule Calendar</span>
                      <button 
                        className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                        onClick={() => setMapInteracting(!mapInteracting)}
                        title="Hide calendar"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="h-[calc(100%-45px)] overflow-auto">
                      <ScheduleCalendar
                        selectedDate={selectedDate}
                        onDateChange={setSelectedDate}
                        searchQuery={searchQuery}
                        filterStatus={filterStatus}
                        filterPriority="all"
                        showAnalytics={false}
                        showMap={false}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule Calendar - Full Calendar View */}
              <div className="bg-white/80 backdrop-blur-xl rounded-md shadow-sm border border-white/20 p-3">
                <ScheduleCalendar
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  searchQuery={searchQuery}
                  filterStatus={filterStatus}
                  filterPriority="all"
                  showAnalytics={true}
                  analyticsMode="embedded"
                  showMap={false}
                />
              </div>
            </>
          )}

          {activeTab === 'timeline' && (
            <div className="bg-white/80 backdrop-blur-xl rounded-md shadow-sm border border-white/20 p-3">
              <ResourceTimeline
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                onJobSelect={(job) => {
                  logger.debug('Job selected from timeline', { jobId: job.id }, 'Scheduler');
                }}
                onJobUpdate={(jobId, updates) => {
                  logger.debug('Job updated from timeline', { jobId, updates }, 'Scheduler');
                }}
              />
            </div>
          )}

          {activeTab === 'technicians' && (
            <div className="bg-white/80 backdrop-blur-xl rounded-md shadow-sm border border-white/20 p-3">
              <h2 className="text-base font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <div className="p-1 bg-emerald-100 rounded-md">
                  <Users className="h-4 w-4 text-emerald-600" />
                </div>
                Technicians Schedule
              </h2>
              <div className="mb-4">
                <ScheduleCalendar
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  searchQuery={searchQuery}
                  filterStatus={filterStatus}
                  filterPriority="all"
                  showAnalytics={false}
                  showMap={false}
                  showTechnicianMetrics={true}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {technicians.filter((tech: any) => tech.id !== 'unassigned').map((technician: any) => (
                  <div key={technician.id} className="p-3 hover:shadow-lg transition-shadow border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-slate-600" />
                        <span className="px-1.5 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-800">
                          Available
                        </span>
                      </div>
                      <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                        <MoreVertical className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="mb-2">
                      <h3 className="text-sm font-semibold text-slate-900 mb-1">
                        {technician.name}
                      </h3>
                      <p className="text-xs text-slate-600 mb-2">
                        {filteredJobs.filter((job: any) => job.technician === technician.name).length} jobs today
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: technician.color }}
                        ></div>
                        <span className="text-xs text-slate-500">
                          Active
                        </span>
                      </div>
                      <button className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-2 py-1 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 text-xs h-8">
                        Schedule
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'routes' && (
            <div className="bg-white/80 backdrop-blur-xl rounded-md shadow-sm border border-white/20 p-3">
              <h2 className="text-base font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <div className="p-1 bg-indigo-100 rounded-md">
                  <Route className="h-4 w-4 text-indigo-600" />
                </div>
                Route Optimization
              </h2>
              <div className="text-center py-8">
                <Route className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-slate-900 mb-2">
                  Route Optimization
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Optimize technician routes for maximum efficiency
                </p>
                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-md hover:from-indigo-700 hover:to-purple-700 shadow-sm hover:shadow-md transition-all duration-200 font-medium text-sm h-8" onClick={handleOptimizeRoute}>
                  Optimize Routes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="bg-white/80 backdrop-blur-xl rounded-md shadow-sm border border-white/20 p-3">
              <h2 className="text-base font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <div className="p-1 bg-violet-100 rounded-md">
                  <FileText className="h-4 w-4 text-violet-600" />
                </div>
                Scheduling Reports
              </h2>
              <div className="text-center py-8">
                <FileText className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-slate-900 mb-2">
                  Scheduling Reports
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Generate reports on scheduling efficiency and technician performance
                </p>
                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-md hover:from-indigo-700 hover:to-purple-700 shadow-sm hover:shadow-md transition-all duration-200 font-medium text-sm h-8">
                  Generate Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchedulerPage;
