import React, { useState, useRef, useEffect } from 'react';
import SettingsPage from '../routes/Settings';
// SchedulerPro import
import SchedulerPro from '../components/scheduler/SchedulerPro';
import { 
  ChevronDown, Bell, Search, Menu, X, Home, BarChart3, Users, ShoppingCart, 
  CreditCard, Settings, User, TrendingUp, TrendingDown, Eye, Heart, MessageCircle,
  Calendar, Globe, Mail, Phone, Plus, Edit, Trash2, Filter, Upload, Download,
  Check, AlertTriangle, Info, XCircle, ChevronRight, ChevronLeft, Star,
  Play, Pause, SkipForward, Volume2, Camera, Image, FileText, Zap,
  Layers, Grid, List, MoreVertical, RefreshCw, Save, Copy, Share2, Maximize2,
  Moon, Sun, Palette, Type, Layout, Sliders as SlidersIcon, LogOut, Briefcase
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [calendarWidth, setCalendarWidth] = useState(600);
  const [isResizing, setIsResizing] = useState(false);
  const [isResizingCard, setIsResizingCard] = useState(null);
  const [cardHeights, setCardHeights] = useState({
    quickStats: 200,
    recentJobs: 300,
    quickActions: 180
  });
  const [jobsEvents, setJobsEvents] = useState([]);

  const getCustomStyles = () => ({
    '--soft-xl': '0 20px 27px 0 rgba(0, 0, 0, 0.05)',
    '--soft-2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  });

  // Calendar resize handlers
  const handleResizeStart = (e) => {
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleResizeMove = (e) => {
    if (!isResizing) return;
    
    const flexContainer = document.querySelector('.flex.gap-4.h-\\[calc\\(100vh-180px\\)\\]');
    if (!flexContainer) return;
    
    const containerRect = flexContainer.getBoundingClientRect();
    const newWidth = e.clientX - containerRect.left;
    
    const constrainedWidth = Math.max(400, Math.min(1000, newWidth));
    setCalendarWidth(constrainedWidth);
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  // Card resize handlers
  const handleCardResizeStart = (cardId, e) => {
    console.log('Card resize start:', cardId);
    setIsResizingCard(cardId);
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  };

  const handleCardResizeMove = (e) => {
    if (!isResizingCard) return;
    
    const cardElement = document.querySelector(`[data-card="${isResizingCard}"]`);
    if (!cardElement) return;
    
    const cardRect = cardElement.getBoundingClientRect();
    const newHeight = e.clientY - cardRect.top;
    
    const constrainedHeight = Math.max(120, Math.min(500, newHeight));
    
    console.log('Card resize move:', isResizingCard, 'new height:', constrainedHeight);
    
    setCardHeights(prev => ({
      ...prev,
      [isResizingCard]: constrainedHeight
    }));
  };

  const handleCardResizeEnd = () => {
    setIsResizingCard(null);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  // Add global mouse event listeners for calendar resizing
  useEffect(() => {
    if (isResizing) {
      const handleMouseMove = (e) => handleResizeMove(e);
      const handleMouseUp = () => handleResizeEnd();
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing]);

  // Add global mouse event listeners for card resizing
  useEffect(() => {
    if (isResizingCard) {
      const handleMouseMove = (e) => handleCardResizeMove(e);
      const handleMouseUp = () => handleCardResizeEnd();
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizingCard]);

  // UI Components
  const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
    const variants = {
      default: 'bg-gray-100 text-gray-800',
      primary: 'bg-purple-100 text-purple-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      danger: 'bg-red-100 text-red-800'
    };
    const sizes = { sm: 'px-2 py-1 text-xs', md: 'px-3 py-1 text-sm', lg: 'px-4 py-2 text-base' };
    return (
      <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
        {children}
      </span>
    );
  };

  const Button = ({ children, variant = 'default', size = 'md', icon: Icon, disabled = false, onClick, className = '', ...props }) => {
    const variants = {
      default: 'bg-gray-900 text-white hover:bg-gray-800',
      primary: 'bg-purple-600 text-white hover:bg-purple-700',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
      outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
      ghost: 'text-gray-700 hover:bg-gray-100'
    };
    const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-base', lg: 'px-6 py-3 text-lg' };
    
    return (
      <button
        className={`inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled}
        onClick={onClick}
        style={getCustomStyles()}
        {...props}
      >
        {Icon && <Icon className="w-4 h-4 mr-2" />}
        {children}
      </button>
    );
  };

  const Card = ({ title, children, actions = [], className = '' }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`} style={getCustomStyles()}>
      {(title || actions.length > 0) && (
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {actions.length > 0 && (
            <div className="flex space-x-2">
              {actions}
            </div>
          )}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );

  const ResizableCard = ({ title, children, cardId, actions = [], className = '' }) => {
    console.log('Rendering ResizableCard:', cardId, 'height:', cardHeights[cardId]);
    
    const handleMouseDown = (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Mouse down on resize handle for card:', cardId);
      handleCardResizeStart(cardId, e);
    };

    return (
      <div 
        data-card={cardId}
        className={`bg-white rounded-xl shadow-sm border border-gray-200 relative group ${className}`} 
        style={{ 
          ...getCustomStyles(), 
          height: `${cardHeights[cardId]}px`,
          overflow: 'hidden'
        }}
      >
        {/* Debug info */}
        <div className="absolute top-1 right-1 text-xs text-gray-400 bg-gray-100 px-1 rounded z-10">
          {cardHeights[cardId]}px
        </div>
        <div className="absolute top-1 left-1 text-xs text-red-600 bg-red-100 px-2 py-1 rounded z-10 font-bold border border-red-300">
          RESIZABLE
        </div>
        {(title || actions.length > 0) && (
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-2">
              {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Resizable</span>
            </div>
            {actions.length > 0 && (
              <div className="flex space-x-2">
                {actions}
              </div>
            )}
          </div>
        )}
        <div className="p-6 overflow-y-auto" style={{ height: 'calc(100% - 73px)' }}>
          {children}
        </div>
        
        {/* Resize Handle */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-12 bg-yellow-300 hover:bg-yellow-400 cursor-row-resize transition-colors border-t-4 border-yellow-500 group-hover:border-yellow-600 z-50"
          onMouseDown={handleMouseDown}
          onMouseEnter={() => console.log('Mouse enter resize handle for card:', cardId)}
          onClick={() => console.log('Click on resize handle for card:', cardId)}
          title="Drag to resize"
        >
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-3 bg-yellow-600 group-hover:bg-yellow-700 rounded-full transition-colors" />
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-3">
            <div className="w-4 h-4 bg-yellow-600 group-hover:bg-yellow-700 rounded-full transition-colors" />
            <div className="w-4 h-4 bg-yellow-600 group-hover:bg-yellow-700 rounded-full transition-colors" />
            <div className="w-4 h-4 bg-yellow-600 group-hover:bg-yellow-700 rounded-full transition-colors" />
          </div>
          <div className="absolute top-2 left-2 text-sm text-yellow-800 font-bold bg-yellow-100 px-2 py-1 rounded border border-yellow-600">DRAG TO RESIZE</div>
        </div>
      </div>
    );
  };

  // Main Dashboard Content
  const DashboardContent = () => (
    <div className="space-y-6">
      <div className="grid">
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$24,780</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Orders</p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <Eye className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Views</p>
              <p className="text-2xl font-bold text-gray-900">45,678</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen w-full bg-gray-50"
      style={{
        ...getCustomStyles(),
        background: `url('/branding/crm_bg.png') center center / cover no-repeat fixed`,
        position: 'relative',
      }}
    >
      {/* VeroSuite Branding Header */}
      <header className="flex items-center px-8 py-6 bg-white bg-opacity-80 shadow-soft-xl rounded-b-2xl relative z-20">
        <img
          src="/branding/veropest_logo.png"
          alt="VeroPest Logo"
          className="w-12 h-12 mr-4 rounded-xl shadow-soft-2xl"
          style={{ opacity: 0.95 }}
        />
        <h1 className="text-2xl font-bold text-purple-700 tracking-tight">VeroSuite Dashboard</h1>
        <div className="ml-auto flex items-center gap-4">
          <button className="bg-purple-100 text-purple-700 px-4 py-2 rounded-xl font-semibold shadow-soft-xl hover:bg-purple-200 transition">Logout</button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="max-w-62.5 h-sidenav bg-white shadow-soft-2xl rounded-2xl m-4 p-4 flex flex-col gap-6 z-990">
          <nav className="flex flex-col gap-2">
            <button className={`flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-colors ${activeTab==='dashboard'?'bg-purple-500 text-white':'text-gray-700 hover:bg-purple-100'}`} onClick={()=>setActiveTab('dashboard')}><Home className="w-5 h-5"/>Dashboard</button>
            <button className={`flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-colors ${activeTab==='jobs'?'bg-purple-500 text-white':'text-gray-700 hover:bg-purple-100'}`} onClick={()=>setActiveTab('jobs')}><Calendar className="w-5 h-5"/>Jobs</button>
            <button className={`flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-colors ${activeTab==='customers'?'bg-purple-500 text-white':'text-gray-700 hover:bg-purple-100'}`} onClick={()=>setActiveTab('customers')}><Users className="w-5 h-5"/>Customers</button>
            <button className={`flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-colors ${activeTab==='reports'?'bg-purple-500 text-white':'text-gray-700 hover:bg-purple-100'}`} onClick={()=>setActiveTab('reports')}><BarChart3 className="w-5 h-5"/>Reports</button>
            <button className={`flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-colors ${activeTab==='settings'?'bg-purple-500 text-white':'text-gray-700 hover:bg-purple-100'}`} onClick={()=>setActiveTab('settings')}><Settings className="w-5 h-5"/>Settings</button>
          </nav>
        </aside>

        <main className="flex-1 md:ml-64 p-8">
          {/* Main dashboard content area */}
          {activeTab === 'dashboard' && <DashboardContent />}
          {activeTab === 'jobs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900">Jobs Management</h1>
                <Button icon={Plus} onClick={() => setActiveTab('jobs')}>
                  Add New Job
                </Button>
              </div>
              
              <div className="flex gap-4 h-[calc(100vh-180px)]">
                {/* Resizable Calendar Panel */}
                <div 
                  className="flex-shrink-0 relative bg-white border border-gray-200 rounded-lg shadow-sm h-full overflow-hidden"
                  style={{ width: `${calendarWidth}px` }}
                >
                  <SchedulerPro
                    initialView="month"
                    resources={[
                      { id: "unassigned", name: "Unassigned", color: "#9CA3AF" },
                      { id: "ashley", name: "Ashley", color: "#60A5FA" },
                      { id: "john", name: "John", color: "#34D399" },
                      { id: "sarah", name: "Sarah", color: "#F59E0B" },
                    ]}
                    dataAdapter={{
                      source: jobsEvents.map(event => ({
                        id: event.id,
                        title: event.title,
                        start: event.start,
                        end: event.end,
                        resourceId: event.extendedProps?.technician || 'unassigned',
                        color: event.color,
                        status: event.extendedProps?.status
                      }))
                    }}
                  />
                </div>

                {/* Resize Handle */}
                <div 
                  className="w-2 bg-gray-200 hover:bg-blue-400 cursor-col-resize transition-all duration-200 relative group flex items-center justify-center"
                  onMouseDown={handleResizeStart}
                  title="Drag to resize calendar"
                >
                  <div className="absolute inset-y-0 -left-2 -right-2 bg-transparent" />
                  <div className="w-1 h-12 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="flex flex-col space-y-0.5">
                      <div className="w-0.5 h-1 bg-gray-400 group-hover:bg-white transition-colors duration-200" />
                      <div className="w-0.5 h-1 bg-gray-400 group-hover:bg-white transition-colors duration-200" />
                      <div className="w-0.5 h-1 bg-gray-400 group-hover:bg-white transition-colors duration-200" />
                    </div>
                  </div>
                </div>

                {/* Right Panel - Job Details & Actions */}
                <div className="w-64 flex-shrink-0">
                  <div className="flex flex-col gap-4 h-full">
                    {/* Quick Stats */}
                    <ResizableCard title="Quick Stats" cardId="quickStats">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Total Jobs</span>
                          <Badge variant="primary" size="sm">{jobsEvents.length}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Scheduled</span>
                          <Badge variant="default" size="sm">{jobsEvents.filter(e => e.extendedProps?.status === 'scheduled').length}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">In Progress</span>
                          <Badge variant="warning" size="sm">{jobsEvents.filter(e => e.extendedProps?.status === 'in-progress').length}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Completed</span>
                          <Badge variant="success" size="sm">{jobsEvents.filter(e => e.extendedProps?.status === 'completed').length}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Urgent</span>
                          <Badge variant="danger" size="sm">{jobsEvents.filter(e => e.extendedProps?.status === 'urgent').length}</Badge>
                        </div>
                      </div>
                    </ResizableCard>

                    {/* Recent Jobs */}
                    <ResizableCard title="Recent Jobs" cardId="recentJobs">
                      <div className="space-y-2">
                        {jobsEvents.slice(0, 6).map((job) => (
                          <div key={job.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                            <div 
                              className="w-2 h-2 rounded-full" 
                              style={{ backgroundColor: job.color }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-900 truncate">
                                {job.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {job.extendedProps?.technician}
                              </p>
                            </div>
                            <Badge 
                              variant={
                                job.extendedProps?.status === 'completed' ? 'success' :
                                job.extendedProps?.status === 'urgent' ? 'danger' :
                                job.extendedProps?.status === 'in-progress' ? 'warning' : 'default'
                              }
                              size="sm"
                            >
                              {job.extendedProps?.status || 'scheduled'}
                            </Badge>
                          </div>
                        ))}
                        {jobsEvents.length === 0 && (
                          <div className="text-center py-4">
                            <p className="text-xs text-gray-500">No jobs available</p>
                          </div>
                        )}
                      </div>
                    </ResizableCard>

                    {/* Quick Actions */}
                    <ResizableCard title="Quick Actions" cardId="quickActions">
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start text-xs"
                          icon={Plus}
                        >
                          Create New Job
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start text-xs"
                          icon={Filter}
                        >
                          Filter Jobs
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start text-xs"
                          icon={Download}
                        >
                          Export Schedule
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start text-xs"
                          icon={Save}
                        >
                          Save Layout
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start text-xs"
                          onClick={() => {
                            setCardHeights(prev => ({
                              ...prev,
                              quickStats: 300,
                              recentJobs: 400,
                              quickActions: 250
                            }));
                          }}
                        >
                          Reset Heights
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start text-xs"
                          onClick={() => {
                            console.log('Current card heights:', cardHeights);
                            console.log('isResizingCard:', isResizingCard);
                            alert(`Card Heights: ${JSON.stringify(cardHeights, null, 2)}`);
                          }}
                        >
                          Debug Heights
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start text-xs"
                          onClick={() => {
                            setCardHeights(prev => ({
                              ...prev,
                              quickStats: Math.random() * 200 + 150,
                              recentJobs: Math.random() * 200 + 200,
                              quickActions: Math.random() * 100 + 150
                            }));
                          }}
                        >
                          Random Heights
                        </Button>
                      </div>
                    </ResizableCard>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'customers' && (
            <Card title="Customers">
              <p>Customers content goes here...</p>
            </Card>
          )}
          {activeTab === 'reports' && (
            <Card title="Reports">
              <p>Reports content goes here...</p>
            </Card>
          )}
          {activeTab === 'settings' && (
            <SettingsPage />
          )}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
