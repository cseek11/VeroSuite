import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
import { useTodayJobs } from '@/hooks/useJobs';
import { LoadingSpinner, PageLoader } from '@/components/LoadingSpinner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';

import TodaysOperations from '@/components/dashboard/TodaysOperations';
import CustomerExperiencePanel from '@/components/dashboard/CustomerExperiencePanel';
import TechnicianDispatchPanel from '@/components/dashboard/TechnicianDispatchPanel';
import FinancialSnapshot from '@/components/dashboard/FinancialSnapshot';
import InventoryCompliancePanel from '@/components/dashboard/InventoryCompliancePanel';
import { DashboardMetric, Job } from '@/types';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { exportCsv, downloadIcs } from '@/utils/export';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Chip,
  Collapse,
  Dropdown,
  Input,
  Modal,
  ProgressBar,
  Tabs,
  Typography
} from '@/components/ui/EnhancedUI';
import { 
  Users, 
  TrendingUp, 
  Calendar,
  BarChart3,
  Settings,
  Plus,
  RefreshCw,
  Download,
  Home,
  MapPin,
  Search,
  Filter,
  Bell,
  ChevronDown
} from 'lucide-react';

// Empty mock data - will be populated from API
const mockJobs: Job[] = [];

// Empty sample data - will be populated from API
const salesData = [];
const calendarEvents = [];

// Responsive Dashboard Card Component
const DashboardCard: React.FC<{
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}> = ({ title, children, actions, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col min-h-0 ${className}`}>
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <h2 className="text-base font-semibold text-gray-900 truncate">{title}</h2>
        {actions && <div className="flex items-center space-x-2 flex-shrink-0 w-auto">{actions}</div>}
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
    </div>
  );
};

const EnhancedDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, clear: clearAuth } = useAuthStore();
  const { data: jobs, isLoading: jobsLoading, error: jobsError } = useTodayJobs();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [modalOpen, setModalOpen] = useState(false);
  const [alertVisible, setAlertVisible] = useState(true);
  const [tabsActive, setTabsActive] = useState('overview');
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [countUpValue, setCountUpValue] = useState(0);
  const [progressValue, setProgressValue] = useState(75);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [urgentNotifications, setUrgentNotifications] = useState(3); // Mock data
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [calendarView, setCalendarView] = useState('week');
  const [calendarSize, setCalendarSize] = useState({ width: 320, height: 384 }); // 320px width, 384px height (96 * 4)
  const defaultCalendarSize = { width: 320, height: 384 }; // Default size that cannot be reduced below
  const [mapInteracting, setMapInteracting] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

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
    darkMode: false,
    glassEffect: false
  });

  // Check if using mock data
  const isUsingMockData = !jobs || jobs.length === 0;

  // Display jobs or mock data
  const displayJobs = jobs && jobs.length > 0 ? jobs : mockJobs;

  // Mock metrics data
  const metrics: DashboardMetric[] = [
    {
      title: 'Today\'s Jobs',
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
      icon: TrendingUp,
      color: '#8b5cf6'
    }
  ];

  // CountUp Animation
  useEffect(() => {
    const timer = setInterval(() => {
      setCountUpValue(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Map interaction handler
  useEffect(() => {
    let interactionTimeout: NodeJS.Timeout;

    const handleMapInteractionStart = () => {
      setMapInteracting(true);
      // Clear any existing timeout
      if (interactionTimeout) {
        clearTimeout(interactionTimeout);
      }
    };

    const handleMapInteractionEnd = () => {
      // Set a timeout to show calendar again after interaction stops
      interactionTimeout = setTimeout(() => {
        setMapInteracting(false);
      }, 500); // Wait 500ms after interaction ends
    };

    // Listen for map container interactions
    const mapContainer = document.querySelector('.leaflet-container');
    if (mapContainer) {
      mapContainer.addEventListener('mousedown', handleMapInteractionStart);
      mapContainer.addEventListener('mouseup', handleMapInteractionEnd);
      mapContainer.addEventListener('touchstart', handleMapInteractionStart);
      mapContainer.addEventListener('touchend', handleMapInteractionEnd);
      
      return () => {
        mapContainer.removeEventListener('mousedown', handleMapInteractionStart);
        mapContainer.removeEventListener('mouseup', handleMapInteractionEnd);
        mapContainer.removeEventListener('touchstart', handleMapInteractionStart);
        mapContainer.removeEventListener('touchend', handleMapInteractionEnd);
        if (interactionTimeout) {
          clearTimeout(interactionTimeout);
        }
      };
    }
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  if (!user) {
    return <PageLoader />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-4 w-full max-w-full">
          {/* Enhanced Dashboard Content with Tabs */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <Card className="flex-1 flex flex-col min-h-0 p-4 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <Typography variant="h1" className="text-gray-900 font-semibold text-lg">
                  Vero Overview
                </Typography>
                <div className="flex items-center gap-2 flex-shrink-0 w-auto">
                  <Button size="sm" variant="outline" icon={RefreshCw} className="px-2 py-1 text-xs flex-shrink-0 w-auto min-w-0">
                    Refresh
                  </Button>
                  <Button size="sm" variant="outline" icon={Download} className="px-2 py-1 text-xs flex-shrink-0 w-auto min-w-0">
                    Export
                  </Button>
                </div>
              </div>
              
              <div className="flex-shrink-0 overflow-hidden">
                <Tabs
                  size="sm"
                  tabs={[
                    { id: 'overview', label: 'Overview', icon: Home },
                    { id: 'crm-operations', label: 'Today\'s Operations', icon: Calendar },
                    { id: 'crm-customers', label: 'Customer Experience', icon: Users },
                    { id: 'crm-technicians', label: 'Technician & Dispatch', icon: Users },
                    { id: 'crm-financial', label: 'Financial', icon: TrendingUp },
                    { id: 'crm-inventory', label: 'Inventory & Compliance', icon: TrendingUp },
                    { id: 'jobs', label: 'Jobs', icon: Calendar },
                    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                    { id: 'customization', label: 'Customization', icon: Settings }
                  ]}
                  active={tabsActive}
                  onTabChange={setTabsActive}
                />
              </div>

              <div className="flex-1 flex flex-col min-h-0 mt-4 overflow-hidden">
                
                {tabsActive === 'overview' && (
                  <>
                    {/* Full Screen Overlay */}
                    {isFullScreen && (
                      <div 
                        className="fixed inset-0 z-[9999] bg-white"
                        style={{ 
                          height: '100vh',
                          width: '100vw',
                          top: '0',
                          left: '0'
                        }}
                      >
                        {/* Full Screen Map Background */}
                        <div 
                          className="absolute inset-0 z-0" 
                          style={{ 
                            height: '100vh',
                            width: '100vw'
                          }}
                        >
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
                              style={{ 
                                height: '100vh', 
                                width: '100vw'
                              }}
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
                          </Suspense>
                        </div>

                        {/* Full Screen Calendar Overlay */}
                        <div 
                          className={`absolute z-10 bg-white/30 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 ${mapInteracting ? 'opacity-0' : 'opacity-100'}`}
                          style={{ 
                            top: '20px',
                            left: '120px',
                            width: '400px', 
                            height: '500px',
                            minWidth: '400px',
                            minHeight: '500px',
                            maxWidth: '600px',
                            maxHeight: '700px'
                          }}
                        >
                          <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-gray-50/30">
                            <div className="flex items-center space-x-1">
                              <button 
                                onClick={() => setCalendarView('day')}
                                className={`px-2 py-1 rounded text-xs font-medium transition-colors flex-shrink-0 w-auto min-w-0 ${
                                  calendarView === 'day' 
                                    ? 'bg-purple-600 text-white' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                Day
                              </button>
                              <button 
                                onClick={() => setCalendarView('week')}
                                className={`px-2 py-1 rounded text-xs font-medium transition-colors flex-shrink-0 w-auto min-w-0 ${
                                  calendarView === 'week' 
                                    ? 'bg-purple-600 text-white' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                Week
                              </button>
                              <button 
                                onClick={() => setCalendarView('month')}
                                className={`px-2 py-1 rounded text-xs font-medium transition-colors flex-shrink-0 w-auto min-w-0 ${
                                  calendarView === 'month' 
                                    ? 'bg-purple-600 text-white' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                Month
                              </button>
                              <button 
                                onClick={() => setCalendarView('timeline')}
                                className={`px-2 py-1 rounded text-xs font-medium transition-colors flex-shrink-0 w-auto min-w-0 ${
                                  calendarView === 'timeline' 
                                    ? 'bg-purple-600 text-white' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                Timeline
                              </button>
                            </div>
                            <div className="flex space-x-1">
                              <button 
                                onClick={() => { exportCsv(displayJobs); }} 
                                className="px-2 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 transition-colors flex-shrink-0 w-auto min-w-0"
                              >
                                CSV
                              </button>
                              <button 
                                onClick={() => { downloadIcs(displayJobs); }} 
                                className="px-2 py-1 bg-purple-600 text-white rounded text-xs font-medium hover:bg-purple-700 transition-colors flex-shrink-0 w-auto min-w-0"
                              >
                                ICS
                              </button>
                            </div>
                          </div>
                          
                          <div className="h-full overflow-y-auto v4-scrollbar">
                            <Suspense fallback={
                              <div className="p-4 text-center">
                                <LoadingSpinner text="Loading calendar..." />
                              </div>
                            }>
                              {jobsLoading ? (
                                <div className="p-4 text-center">
                                  <LoadingSpinner text="Loading jobs..." />
                                </div>
                              ) : (
                                <div className="p-2">
                                  <div className="p-4 bg-gray-100 rounded-lg">
                                    <p className="text-gray-600">Calendar component removed - using SchedulerPro instead</p>
                                  </div>
                                </div>
                              )}
                            </Suspense>
                          </div>
                        </div>

                        {/* Full Screen Exit Button */}
                        <button
                          onClick={() => setIsFullScreen(false)}
                          className="absolute top-4 right-4 z-[10000] bg-white/80 hover:bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-gray-200 transition-all duration-200 hover:scale-105"
                          title="Exit Full Screen"
                        >
                          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}

                    {/* Normal View */}
                    {!isFullScreen && (
                      <div className="relative flex-1 min-h-0 overflow-hidden" style={{ height: '600px', minHeight: '600px' }}>
                        {/* Full Screen Button */}
                        <button
                          onClick={() => setIsFullScreen(true)}
                          className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-gray-200 transition-all duration-200 hover:scale-105"
                          title="Enter Full Screen"
                        >
                          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                        </button>

                        {/* Actual Map Background */}
                        <div 
                          className="absolute inset-0 z-0" 
                          style={{ height: '100%' }}
                        >
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
                          </Suspense>
                        </div>

                        {/* Calendar Overlay */}
                        <div 
                          className={`absolute z-10 bg-white/30 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 ${mapInteracting ? 'opacity-0' : 'opacity-100'}`}
                          style={{ 
                            top: '16px',
                            left: '80px',
                            width: `${calendarSize.width}px`, 
                            height: `${calendarSize.height}px`,
                            minWidth: `${defaultCalendarSize.width}px`,
                            minHeight: `${defaultCalendarSize.height}px`,
                            maxWidth: '600px',
                            maxHeight: '600px'
                          }}
                        >
                          <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-gray-50/30">
                            <div className="flex items-center space-x-1">
                              <button 
                                onClick={() => setCalendarView('day')}
                                className={`px-2 py-1 rounded text-xs font-medium transition-colors flex-shrink-0 w-auto min-w-0 ${
                                  calendarView === 'day' 
                                    ? 'bg-purple-600 text-white' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                Day
                              </button>
                              <button 
                                onClick={() => setCalendarView('week')}
                                className={`px-2 py-1 rounded text-xs font-medium transition-colors flex-shrink-0 w-auto min-w-0 ${
                                  calendarView === 'week' 
                                    ? 'bg-purple-600 text-white' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                Week
                              </button>
                              <button 
                                onClick={() => setCalendarView('month')}
                                className={`px-2 py-1 rounded text-xs font-medium transition-colors flex-shrink-0 w-auto min-w-0 ${
                                  calendarView === 'month' 
                                    ? 'bg-purple-600 text-white' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                Month
                              </button>
                              <button 
                                onClick={() => setCalendarView('timeline')}
                                className={`px-2 py-1 rounded text-xs font-medium transition-colors flex-shrink-0 w-auto min-w-0 ${
                                  calendarView === 'timeline' 
                                    ? 'bg-purple-600 text-white' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                Timeline
                              </button>
                            </div>
                            <div className="flex space-x-1">
                              <button 
                                onClick={() => { exportCsv(displayJobs); }} 
                                className="px-2 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 transition-colors flex-shrink-0 w-auto min-w-0"
                              >
                                CSV
                              </button>
                              <button 
                                onClick={() => { downloadIcs(displayJobs); }} 
                                className="px-2 py-1 bg-purple-600 text-white rounded text-xs font-medium hover:bg-purple-700 transition-colors flex-shrink-0 w-auto min-w-0"
                              >
                                ICS
                              </button>
                            </div>
                          </div>
                          
                          <div className="h-full overflow-y-auto v4-scrollbar">
                            <Suspense fallback={
                              <div className="p-4 text-center">
                                <LoadingSpinner text="Loading calendar..." />
                              </div>
                            }>
                              {jobsLoading ? (
                                <div className="p-4 text-center">
                                  <LoadingSpinner text="Loading jobs..." />
                                </div>
                              ) : (
                                <div className="p-2">
                                  <div className="p-4 bg-gray-100 rounded-lg">
                                    <p className="text-gray-600">Calendar component removed - using SchedulerPro instead</p>
                                  </div>
                                </div>
                              )}
                            </Suspense>
                          </div>
                          
                          {/* Resize Handle */}
                          <div 
                            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-70 hover:opacity-100 transition-opacity"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              const startX = e.clientX;
                              const startY = e.clientY;
                              const startWidth = calendarSize.width;
                              const startHeight = calendarSize.height;
                              
                              const handleMouseMove = (moveEvent: MouseEvent) => {
                                const deltaX = moveEvent.clientX - startX;
                                const deltaY = moveEvent.clientY - startY;
                                
                                const newWidth = Math.max(defaultCalendarSize.width, Math.min(600, startWidth + deltaX));
                                const newHeight = Math.max(defaultCalendarSize.height, Math.min(600, startHeight + deltaY));
                                
                                setCalendarSize({ width: newWidth, height: newHeight });
                              };
                              
                              const handleMouseUp = () => {
                                document.removeEventListener('mousemove', handleMouseMove);
                                document.removeEventListener('mouseup', handleMouseUp);
                              };
                              
                              document.addEventListener('mousemove', handleMouseMove);
                              document.addEventListener('mouseup', handleMouseUp);
                            }}
                          >
                            <div className="w-full h-full flex items-end justify-end">
                              <div className="w-3 h-3 border-r-2 border-b-2 border-purple-500 rounded-br bg-purple-100"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {tabsActive === 'crm-operations' && (
                  <div className="flex-1 min-h-0 overflow-hidden">
                    <TodaysOperations jobs={displayJobs} isLoading={jobsLoading} />
                  </div>
                )}

                {tabsActive === 'crm-customers' && (
                  <div className="flex-1 min-h-0 overflow-hidden">
                    <CustomerExperiencePanel />
                  </div>
                )}

                {tabsActive === 'crm-technicians' && (
                  <div className="flex-1 min-h-0 overflow-hidden">
                    <TechnicianDispatchPanel />
                  </div>
                )}

                {tabsActive === 'crm-financial' && (
                  <div className="flex-1 min-h-0 overflow-hidden">
                    <FinancialSnapshot />
                  </div>
                )}

                {tabsActive === 'crm-inventory' && (
                  <div className="flex-1 min-h-0 overflow-hidden">
                    <InventoryCompliancePanel />
                  </div>
                )}

                {tabsActive === 'jobs' && (
                  <div className="flex-1 min-h-0 overflow-hidden">
                    {/* Job Progress */}
                    <Card title="Job Progress" className="h-full overflow-hidden">
                      <div className="space-y-3 overflow-y-auto">
                        {displayJobs.map((job: Job) => (
                          <div key={job.id} className="flex items-center space-x-3">
                            <div className="flex-1 min-w-0">
                              <Typography variant="body2" className="font-medium truncate">{job.title}</Typography>
                              <Typography variant="caption" className="text-gray-500 truncate">{job.technician}</Typography>
                            </div>
                            <div className="w-24 flex-shrink-0">
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
                            <Chip variant="default" className="flex-shrink-0">{job.status}</Chip>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                )}

                {tabsActive === 'analytics' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0 overflow-hidden">
                    {/* Sales Data Card */}
                    <Card title="Revenue Analytics" className="flex-1 overflow-hidden">
                      <div className="space-y-3 overflow-y-auto">
                        {salesData.slice(-3).map((item, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <Typography variant="body2" className="truncate">{item.name}</Typography>
                            <Typography variant="body2" className="font-medium flex-shrink-0">
                              ${item.revenue.toLocaleString()}
                            </Typography>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* CountUp Animation */}
                    <Card title="Live Statistics" className="flex-1 overflow-hidden">
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
                  <div className="space-y-4 flex-1 min-h-0 overflow-y-auto">
                    {/* Customization Options */}
                    <Card title="Theme Customization" className="overflow-hidden">
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
                    <Card title="Interactive Components" className="overflow-hidden">
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
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default EnhancedDashboard;
