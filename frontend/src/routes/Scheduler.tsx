import React, { useState, useEffect, Suspense } from 'react';
import { 
  Card, 
  Typography, 
  Button, 
  Input, 
  Dropdown
} from '@/components/ui/EnhancedUI';
import Select from '@/components/ui/Select';
import { Badge } from '@/components/ui/CRMComponents';
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
    <div className="space-y-3">
      {/* Header */}
      <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h1" className="text-2xl font-bold text-gray-900 mb-1">
              Scheduling Dashboard
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Manage jobs, technicians, and optimize routes for maximum efficiency
            </Typography>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Route className="h-4 w-4" />
              Optimize Routes
            </Button>
            <Button variant="primary" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Job
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="body2" className="text-blue-600 mb-1">Total Jobs</Typography>
              <Typography variant="h3" className="text-blue-900">{filteredJobs.length}</Typography>
              <div className="flex items-center gap-1 mt-1">
                <Calendar className="h-3 w-3 text-blue-600" />
                <span className="text-xs text-blue-600">Scheduled today</span>
              </div>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="body2" className="text-green-600 mb-1">Active Technicians</Typography>
              <Typography variant="h3" className="text-green-900">{mockTechnicians.length - 1}</Typography>
              <div className="flex items-center gap-1 mt-1">
                <Users className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">Available</span>
              </div>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="body2" className="text-purple-600 mb-1">Completed</Typography>
              <Typography variant="h3" className="text-purple-900">
                {filteredJobs.filter(job => job.status === 'completed').length}
              </Typography>
              <div className="flex items-center gap-1 mt-1">
                <CheckCircle className="h-3 w-3 text-purple-600" />
                <span className="text-xs text-purple-600">Today's jobs</span>
              </div>
            </div>
            <CheckCircle className="h-8 w-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="body2" className="text-orange-600 mb-1">Overdue</Typography>
              <Typography variant="h3" className="text-orange-900">
                {filteredJobs.filter(job => job.status === 'overdue').length}
              </Typography>
              <div className="flex items-center gap-1 mt-1">
                <AlertTriangle className="h-3 w-3 text-orange-600" />
                <span className="text-xs text-orange-600">Requires attention</span>
              </div>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search jobs, customers, or technicians..."
              value={searchQuery}
              onChange={(value) => setSearchQuery(value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="min-w-[150px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid transparent',
              backgroundClip: 'padding-box',
              position: 'relative',
              borderRadius: '0.5rem',
              color: 'rgb(30, 41, 59)',
              backdropFilter: 'blur(4px)',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              appearance: 'none',
              boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0 overflow-hidden">
        <div className="flex space-x-4 overflow-x-auto border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 py-1 px-1 border-b-2 font-medium text-xs whitespace-nowrap transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
        <div className="space-y-3">
          {activeTab === 'overview' && (
            <>
              {/* Map and Calendar Section */}
              <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <Typography variant="h3" className="text-gray-900">
                    Live Operations Map
                  </Typography>
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
                        center={mapCenter} 
                        zoom={windowWidth < 768 ? 10 : windowWidth < 1024 ? 11 : 12}
                        className="h-full w-full"
                        style={{ height: '100%', minHeight: '600px' }}
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
              <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <Typography variant="h3" className="text-gray-900">
                    Today's Schedule ({filteredJobs.length} jobs)
                  </Typography>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Job
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Route className="h-4 w-4" />
                      Optimize Route
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredJobs.map((job) => (
                    <div key={job.id} className="p-4 hover:shadow-lg transition-shadow border border-gray-200 rounded-lg bg-white">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-gray-600" />
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(job.status)}`}>
                            {job.status}
                          </span>
                          {job.overdue && (
                            <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                              {job.overdueDays} days overdue
                            </span>
                          )}
                        </div>
                        <Dropdown
                          trigger={
                            <Button variant="outline" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          }
                          items={[
                            { label: 'View Details', onClick: () => {} },
                            { label: 'Edit', onClick: () => {} },
                            { label: 'Reassign', onClick: () => {} },
                            { label: 'Delete', onClick: () => {} }
                          ]}
                        />
                      </div>
                      <div className="mb-3">
                        <Typography variant="h6" className="text-gray-900 mb-1">
                          {job.customer}
                        </Typography>
                        <Typography variant="body2" className="text-gray-600 mb-1">
                          {job.service}
                        </Typography>
                        <Typography variant="body2" className="text-gray-600 mb-2">
                          {job.time} • {job.technician || 'Unassigned'}
                        </Typography>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(job.status)}
                          <span className="text-xs text-gray-500">
                            {job.agreements.join(', ')}
                          </span>
                        </div>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'technicians' && (
            <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockTechnicians.filter(tech => tech.id !== 'unassigned').map((technician) => (
                  <div key={technician.id} className="p-4 hover:shadow-lg transition-shadow border border-gray-200 rounded-lg bg-white">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-gray-600" />
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          Available
                        </span>
                      </div>
                      <Dropdown
                        trigger={
                          <Button variant="outline" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        }
                        items={[
                          { label: 'View Schedule', onClick: () => {} },
                          { label: 'Edit', onClick: () => {} },
                          { label: 'Assign Jobs', onClick: () => {} }
                        ]}
                      />
                    </div>
                    <div className="mb-3">
                      <Typography variant="h6" className="text-gray-900 mb-1">
                        {technician.name}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600 mb-2">
                        {filteredJobs.filter(job => job.technician === technician.name).length} jobs today
                      </Typography>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: technician.color }}
                        ></div>
                        <span className="text-xs text-gray-500">
                          Active
                        </span>
                      </div>
                      <Button variant="outline" size="sm">
                        Schedule
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'routes' && (
            <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="text-center py-12">
                <Route className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <Typography variant="h6" className="text-gray-900 mb-2">
                  Route Optimization
                </Typography>
                <Typography variant="body2" className="text-gray-600 mb-4">
                  Optimize technician routes for maximum efficiency
                </Typography>
                <Button variant="primary" onClick={handleOptimizeRoute}>
                  Optimize Routes
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <Typography variant="h6" className="text-gray-900 mb-2">
                  Scheduling Reports
                </Typography>
                <Typography variant="body2" className="text-gray-600 mb-4">
                  Generate reports on scheduling efficiency and technician performance
                </Typography>
                <Button variant="primary">
                  Generate Report
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchedulerPage;
