import React, { useState, useEffect, Suspense } from 'react';
import SchedulerPro from '../components/scheduler/SchedulerPro';
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
  AlertTriangle,
  TrendingUp,
  Settings
} from 'lucide-react';

// Mock data for scheduling with proper structure
const mockJobs = [
  {
    id: 1,
    customer: "Johnson Family Residence",
    service: "General Pest Control",
    time: "9:00 AM",
    technician: "Ashley Davis",
    status: "scheduled",
    agreements: ["general", "mosquito"],
    overdue: false,
    location: [40.44, -79.99]
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
    overdueDays: 2,
    location: [40.45, -79.98]
  },
  {
    id: 3,
    customer: "Maria Lopez",
    service: "Rodent Control",
    time: "8:00 AM",
    technician: "Sarah Wilson",
    status: "completed",
    agreements: ["rodent"],
    overdue: false,
    location: [40.46, -79.97]
  },
  {
    id: 4,
    customer: "Downtown Office Complex",
    service: "Commercial Pest Control",
    time: "2:00 PM",
    technician: "John Smith",
    status: "scheduled",
    agreements: ["commercial"],
    overdue: false,
    location: [40.47, -79.96]
  }
];

const mockTechnicians = [
  { id: "unassigned", name: "Unassigned", color: "#9CA3AF" },
  { id: "ashleydavis", name: "Ashley Davis", color: "#60A5FA" },
  { id: "johnsmith", name: "John Smith", color: "#34D399" },
  { id: "sarahwilson", name: "Sarah Wilson", color: "#F59E0B" },
];

const SchedulerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [calendarView, setCalendarView] = useState('week');
  const [mapInteracting, setMapInteracting] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Calendar },
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
    console.log('Add new job');
  };

  const handleOptimizeRoute = () => {
    console.log('Optimize route');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'scheduled': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'completed': return '#22c55e';
      case 'scheduled': return '#3b82f6';
      case 'overdue': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Filter jobs based on search query - FIXED to search by names
  const filteredJobs = mockJobs.filter(job => {
    const searchLower = searchQuery.toLowerCase();
    return (
      job.customer.toLowerCase().includes(searchLower) ||
      (job.technician && job.technician.toLowerCase().includes(searchLower)) ||
      job.service.toLowerCase().includes(searchLower)
    );
  });

  // Convert jobs to calendar events with proper dates
  const calendarEvents = filteredJobs.map(job => {
    // Parse time string like "9:00 AM" or "2:00 PM"
    const timeStr = job.time;
    let hour = 9; // default
    let minute = 0;
    
    if (timeStr.includes(':')) {
      const [timePart, ampm] = timeStr.split(' ');
      const [hours, minutes] = timePart.split(':');
      hour = parseInt(hours);
      minute = parseInt(minutes);
      
      // Convert to 24-hour format
      if (ampm === 'PM' && hour !== 12) {
        hour += 12;
      } else if (ampm === 'AM' && hour === 12) {
        hour = 0;
      }
    }
    
    const startDate = new Date(selectedDate);
    startDate.setHours(hour, minute, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 2); // 2 hour duration

    // Create technician ID for calendar
    let technicianId = 'unassigned';
    if (job.technician) {
      technicianId = job.technician.toLowerCase().replace(/\s+/g, '');
    }

    return {
      id: job.id.toString(),
      title: job.customer,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      resourceId: technicianId,
      color: getMarkerColor(job.status),
      status: job.status,
      service: job.service,
      location: job.location
    };
  });

  // Get technician resource mapping - FIXED to match calendar events
  const technicianResources = mockTechnicians.map(tech => ({
    id: tech.id,
    name: tech.name,
    color: tech.color
  }));

  // Calculate map center based on job locations
  const mapCenter = filteredJobs.length > 0 
    ? [
        filteredJobs.reduce((sum, job) => sum + job.location[0], 0) / filteredJobs.length,
        filteredJobs.reduce((sum, job) => sum + job.location[1], 0) / filteredJobs.length
      ]
    : [40.44, -79.99]; // Default to Pittsburgh

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
              Scheduling Dashboard
            </h1>
            <p className="text-slate-600 text-sm">
              Manage jobs, technicians, and optimize routes for maximum efficiency
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium text-sm">
              <Route className="h-3 w-3" />
              Optimize Routes
            </button>
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium text-sm">
              <Plus className="h-3 w-3" />
              New Job
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-xl p-3 text-white relative overflow-hidden">
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

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-xl p-3 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="text-xl font-bold mb-1">{mockTechnicians.length - 1}</div>
            <div className="text-emerald-100 font-medium text-xs">Active Technicians</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl shadow-xl p-3 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
            <div className="text-xl font-bold mb-1">
              {filteredJobs.filter(job => job.status === 'completed').length}
            </div>
            <div className="text-violet-100 font-medium text-xs">Completed</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-xl p-3 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
            <div className="text-xl font-bold mb-1">
              {filteredJobs.filter(job => job.status === 'overdue').length}
            </div>
            <div className="text-amber-100 font-medium text-xs">Overdue</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search jobs, customers, or technicians..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-1.5 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-slate-200 rounded-lg px-2 py-1.5 min-w-[120px] bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
          <button className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium text-sm">
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
              <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <div className="p-1 bg-indigo-100 rounded-md">
                      <MapPin className="h-4 w-4 text-indigo-600" />
                    </div>
                    Live Operations Map
                  </h2>
                  <div className="flex gap-2">
                    <button 
                      className="px-2 py-1.5 text-xs bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1"
                      onClick={handleAddJob}
                    >
                      <Plus className="w-3 h-3" />
                      Add Job
                    </button>
                    <button 
                      className="px-2 py-1.5 text-xs bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors flex items-center gap-1"
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
                        {filteredJobs.map((job) => (
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
                            positions={filteredJobs.map(job => job.location)}
                            color="blue"
                            weight={3}
                            opacity={0.7}
                          />
                        )}
                      </MapContainer>
                    </Suspense>
                  </div>

                  {/* Calendar Overlay - Now properly synced with job data */}
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
                        resources={technicianResources}
                        dataAdapter={{
                          source: calendarEvents
                        }}
                        hideToolbar={true}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Today's Schedule - Now shows filtered jobs */}
              <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <div className="p-1 bg-emerald-100 rounded-md">
                      <Calendar className="h-4 w-4 text-emerald-600" />
                    </div>
                    Today's Schedule ({filteredJobs.length} jobs)
                  </h2>
                  <div className="flex gap-2">
                    <button className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-2 py-1.5 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium text-xs">
                      <Plus className="h-3 w-3" />
                      Add Job
                    </button>
                    <button className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-2 py-1.5 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium text-xs">
                      <Route className="h-3 w-3" />
                      Optimize Route
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredJobs.map((job) => (
                    <div key={job.id} className="p-3 hover:shadow-lg transition-shadow border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-600" />
                          <span className={`px-1.5 py-0.5 text-xs rounded-full ${getStatusColor(job.status)}`}>
                            {job.status}
                          </span>
                          {job.overdue && (
                            <span className="px-1.5 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
                              {job.overdueDays} days overdue
                            </span>
                          )}
                        </div>
                        <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                          <MoreVertical className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="mb-2">
                        <h3 className="text-sm font-semibold text-slate-900 mb-1">
                          {job.customer}
                        </h3>
                        <p className="text-xs text-slate-600 mb-1">
                          {job.service}
                        </p>
                        <p className="text-xs text-slate-600 mb-2">
                          {job.time} • {job.technician || 'Unassigned'}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(job.status)}
                          <span className="text-xs text-slate-500">
                            {job.agreements.join(', ')}
                          </span>
                        </div>
                        <button className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-2 py-1 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 text-xs">
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'technicians' && (
            <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
              <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <div className="p-1 bg-emerald-100 rounded-md">
                  <Users className="h-4 w-4 text-emerald-600" />
                </div>
                Technicians
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {mockTechnicians.filter(tech => tech.id !== 'unassigned').map((technician) => (
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
                        {filteredJobs.filter(job => job.technician === technician.name).length} jobs today
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
                      <button className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-2 py-1 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 text-xs">
                        Schedule
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'routes' && (
            <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
              <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
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
                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-sm" onClick={handleOptimizeRoute}>
                  Optimize Routes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
              <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
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
                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-sm">
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
