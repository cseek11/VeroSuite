import React, { useState, useRef, useEffect } from 'react';
import SettingsPage from '../routes/Settings';
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
        {/* Sidebar styled for Soft UI but branded */}
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
              {/* ...existing jobs tab content... */}
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
            ...event, 
            start: info.event.startStr, 
            end: info.event.endStr 
          } 
        : event
    ));
  };

  const handleJobDateSelect = (selectInfo) => {
    const title = window.prompt('Please enter a name for your job');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      const newEvent = {
        id: Date.now().toString(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
        color: '#3b82f6',
        extendedProps: {
          technician: 'Unassigned',
          status: 'scheduled'
        }
      };
      
      setJobsEvents([...jobsEvents, newEvent]);
    }
  };

  const handleJobEventClick = (clickInfo) => {
    if (window.confirm(`Are you sure you want to delete the job '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
      setJobsEvents(jobsEvents.filter(event => event.id !== clickInfo.event.id));
    }
  };

  // Resize handlers
  const handleResizeStart = (e) => {
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleResizeMove = (e) => {
    if (!isResizing) return;
    
    const container = e.currentTarget.closest('.flex');
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const newWidth = e.clientX - containerRect.left;
    
    // Constrain width between 350px and 800px
    const constrainedWidth = Math.max(350, Math.min(800, newWidth));
    setCalendarWidth(constrainedWidth);
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  // Add global mouse event listeners for resizing
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

  // Add custom calendar styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* FullCalendar Base Styles - Essential for rendering */
      .fc {
        font-family: 'Inter', sans-serif;
        background: white;
        border-radius: 0.5rem;
        overflow: hidden;
        display: block !important;
        width: 100% !important;
        height: 100% !important;
      }
      
      .fc-view-harness {
        height: 100% !important;
        min-height: 400px !important;
      }
      
      .fc-scroller {
        overflow: auto !important;
      }
      
      .fc-scroller-liquid {
        height: 100% !important;
      }
      
      .fc-daygrid-body {
        width: 100% !important;
        min-height: 400px !important;
      }
      
      .fc-daygrid-day-frame {
        min-height: 100px !important;
      }
      
      .fc-toolbar {
        background: white;
        border-bottom: 1px solid #e5e7eb;
        padding: 1rem;
        border-radius: 0.75rem 0.75rem 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      
      .fc-toolbar-title {
        font-weight: 600;
        color: #374151;
        font-size: 1.25rem;
      }
      
      .fc-button {
        background: #f3f4f6 !important;
        border: 1px solid #d1d5db !important;
        color: #374151 !important;
        font-weight: 500 !important;
        border-radius: 0.5rem !important;
        padding: 0.5rem 1rem !important;
        transition: all 0.2s !important;
        cursor: pointer !important;
        font-size: 0.875rem !important;
      }
      
      .fc-button:hover {
        background: #e5e7eb !important;
        border-color: #9ca3af !important;
      }
      
      .fc-button-active {
        background: #8b5cf6 !important;
        border-color: #8b5cf6 !important;
        color: white !important;
      }
      
      .fc-daygrid-day {
        border: 1px solid #f3f4f6 !important;
        min-height: 100px !important;
      }
      
      .fc-daygrid-day:hover {
        background: #f9fafb !important;
      }
      
      .fc-day-today {
        background: #fef3c7 !important;
      }
      
      .fc-event {
        border-radius: 0.375rem !important;
        border: none !important;
        font-weight: 500 !important;
        font-size: 0.875rem !important;
        padding: 0.25rem 0.5rem !important;
        margin: 0.125rem !important;
        cursor: pointer !important;
      }
      
      .fc-event:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }
      
      .fc-timegrid-slot {
        border: 1px solid #f3f4f6 !important;
      }
      
      .fc-col-header-cell {
        background: #f9fafb !important;
        border: 1px solid #e5e7eb !important;
        font-weight: 600 !important;
        color: #374151 !important;
        padding: 0.5rem !important;
      }
      
      .fc-daygrid-day-number {
        color: #374151 !important;
        font-weight: 500 !important;
        padding: 0.5rem !important;
      }
      
      .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
        background: #fbbf24 !important;
        color: white !important;
        border-radius: 50% !important;
        width: 2rem !important;
        height: 2rem !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      
      .fc-list-event {
        border-radius: 0.375rem !important;
        margin: 0.25rem 0 !important;
        padding: 0.5rem !important;
      }
      
      .fc-list-event:hover {
        background: #f3f4f6 !important;
      }
      
      .fc-list-event-dot {
        border-radius: 50% !important;
      }
      
      .fc-timegrid-now-indicator-line {
        border-color: #ef4444 !important;
        border-width: 2px !important;
      }
      
      .fc-timegrid-now-indicator-arrow {
        border-color: #ef4444 !important;
        border-width: 5px !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const [customization, setCustomization] = useState({
    primaryColor: '#cb0c9f',
    secondaryColor: '#8392ab',
    accentColor: '#17c1e8',
    successColor: '#82d616',
    warningColor: '#fb6340',
    dangerColor: '#ea0606',
    brandName: 'VeroSuite Dashboard',
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

  // Sample data
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

  // Initialize Three.js scene
  useEffect(() => {
    if (threeRef.current && activeTab === 'three-demo') {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, threeRef.current.clientWidth / threeRef.current.clientHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer();
      
      renderer.setSize(threeRef.current.clientWidth, threeRef.current.clientHeight);
      threeRef.current.appendChild(renderer.domElement);

      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: customization.primaryColor });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      camera.position.z = 5;

      const animate = function () {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
      };

      animate();

      return () => {
        if (threeRef.current) {
          threeRef.current.removeChild(renderer.domElement);
        }
      };
    }
  }, [activeTab, customization.primaryColor]);

  // Utility function for dynamic styles
  const getCustomStyles = () => ({
    '--primary-color': customization.primaryColor,
    '--secondary-color': customization.secondaryColor,
    '--accent-color': customization.accentColor,
    '--success-color': customization.successColor,
    '--warning-color': customization.warningColor,
    '--danger-color': customization.dangerColor,
    '--font-family': customization.fontFamily,
    '--shadow-intensity': customization.shadowIntensity === 'low' ? '0 1px 3px rgba(0,0,0,0.12)' : 
                           customization.shadowIntensity === 'high' ? '0 10px 25px rgba(0,0,0,0.15)' : '0 4px 6px rgba(0,0,0,0.1)',
    '--border-radius': customization.borderRadius === 'small' ? '6px' : customization.borderRadius === 'large' ? '16px' : '12px'
  });

  // UI Components
  const Alert = ({ type = 'info', title, children, onClose, className = '' }) => {
    const icons = { info: Info, success: Check, warning: AlertTriangle, danger: XCircle };
    const colors = {
      info: 'bg-blue-50 text-blue-800 border-blue-200',
      success: 'bg-green-50 text-green-800 border-green-200',
      warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      danger: 'bg-red-50 text-red-800 border-red-200'
    };
    const Icon = icons[type];
    
    return (
      <div className={`p-4 rounded-xl border ${colors[type]} ${className}`} style={getCustomStyles()}>
        <div className="flex items-start">
          <Icon className="w-5 h-5 mr-3 mt-0.5" />
          <div className="flex-1">
            {title && <h4 className="font-semibold mb-1">{title}</h4>}
            <div>{children}</div>
          </div>
          {onClose && (
            <button onClick={onClose} className="ml-3">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  };

  const Avatar = ({ src, alt, size = 'md', fallback, className = '' }) => {
    const sizes = { sm: 'w-8 h-8 text-sm', md: 'w-10 h-10 text-base', lg: 'w-12 h-12 text-lg', xl: 'w-16 h-16 text-xl' };
    return (
      <div className={`${sizes[size]} rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white font-medium ${className}`} style={getCustomStyles()}>
        {src ? (
          <img src={src} alt={alt} className="w-full h-full rounded-full object-cover" />
        ) : (
          fallback || alt?.charAt(0)?.toUpperCase() || 'U'
        )}
      </div>
    );
  };

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

  const Dropdown = ({ trigger, items, className = '' }) => {
    const [open, setOpen] = useState(false);
    return (
      <div className={`relative ${className}`}>
        <div onClick={() => setOpen(!open)}>{trigger}</div>
        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick?.();
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const IconButton = ({ icon: Icon, onClick, variant = 'default', size = 'md', className = '' }) => {
    const variants = {
      default: 'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
      primary: 'text-purple-600 hover:text-purple-700 hover:bg-purple-50',
      danger: 'text-red-600 hover:text-red-700 hover:bg-red-50'
    };
    const sizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-12 h-12' };
    
    return (
      <button
        className={`inline-flex items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${variants[variant]} ${sizes[size]} ${className}`}
        onClick={onClick}
      >
        <Icon className="w-5 h-5" />
      </button>
    );
  };

  const Input = ({ label, value, onChange, placeholder, type = 'text', icon: Icon, error, className = '' }) => (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent ${Icon ? 'pl-10' : ''} ${error ? 'border-red-500' : ''}`}
          style={getCustomStyles()}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );

  const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    if (!isOpen) return null;
    
    const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`bg-white rounded-xl shadow-xl ${sizes[size]} w-full mx-4 max-h-[90vh] overflow-y-auto`}>
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    );
  };

  const Progress = ({ value, max = 100, size = 'md', variant = 'default', className = '' }) => {
    const percentage = (value / max) * 100;
    const variants = {
      default: 'bg-purple-600',
      success: 'bg-green-600',
      warning: 'bg-yellow-600',
      danger: 'bg-red-600'
    };
    const sizes = { sm: 'h-1', md: 'h-2', lg: 'h-3' };
    
    return (
      <div className={`w-full bg-gray-200 rounded-full ${sizes[size]} ${className}`}>
        <div
          className={`${variants[variant]} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%`, height: '100%' }}
        />
      </div>
    );
  };

  const Table = ({ data, columns, actions = [], searchable = false, sortable = false }) => {
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortDir, setSortDir] = useState('asc');

    let filteredData = data;
    if (search && searchable) {
      filteredData = data.filter(row => 
        columns.some(col => String(row[col.key]).toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (sortField && sortable) {
      filteredData.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        if (sortDir === 'asc') {
          return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        } else {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
      });
    }

    return (
      <Card title="Data Table" actions={[
        <Button key="filter" size="sm" icon={Filter}>Filter</Button>,
        <Button key="export" size="sm" variant="outline" icon={Download}>Export</Button>
      ]}>
        {searchable && (
          <div className="mb-4">
            <Input
              icon={Search}
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th 
                    key={column.key} 
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${sortable ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                    onClick={() => {
                      if (sortable) {
                        if (sortField === column.key) {
                          setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortField(column.key);
                          setSortDir('asc');
                        }
                      }
                    }}
                  >
                    <div className="flex items-center">
                      {column.title}
                      {sortable && sortField === column.key && (
                        sortDir === 'asc' ? <TrendingUp className="w-3 h-3 ml-1" /> : <TrendingDown className="w-3 h-3 ml-1" />
                      )}
                    </div>
                  </th>
                ))}
                {actions.length > 0 && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row[column.key]}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {actions.map((action, actionIndex) => (
                          <IconButton
                            key={actionIndex}
                            icon={action.icon}
                            onClick={() => action.onClick(row)}
                            variant={action.variant || 'default'}
                          />
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    );
  };

  const Tabs = ({ tabs, active, onTabChange, variant = 'default' }) => (
    <div className={`${variant === 'pills' ? '' : 'border-b border-gray-200'}`}>
      <nav className={`${variant === 'pills' ? 'flex space-x-2' : '-mb-px flex space-x-8'}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`${variant === 'pills' 
              ? `px-4 py-2 rounded-xl font-medium text-sm transition-colors ${
                  active === tab.id ? 'bg-purple-500 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`
              : `py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  active === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`
            }`}
          >
            {tab.icon && <tab.icon className="w-4 h-4 mr-2 inline" />}
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );

  const Textarea = ({ label, value, onChange, placeholder, rows = 4, error, className = '' }) => (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${error ? 'border-red-500' : ''}`}
        style={getCustomStyles()}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );

  const Tooltip = ({ content, children, position = 'top' }) => {
    const [visible, setVisible] = useState(false);
    const positions = {
      top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
      bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
      right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
    };

    return (
      <div 
        className="relative inline-block"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
        {visible && (
          <div className={`absolute ${positions[position]} z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg whitespace-nowrap`}>
            {content}
          </div>
        )}
      </div>
    );
  };

  const Typography = ({ variant = 'body1', children, className = '' }) => {
    const variants = {
      h1: 'text-4xl font-bold',
      h2: 'text-3xl font-bold',
      h3: 'text-2xl font-bold',
      h4: 'text-xl font-bold',
      h5: 'text-lg font-bold',
      h6: 'text-base font-bold',
      body1: 'text-base',
      body2: 'text-sm',
      caption: 'text-xs text-gray-500'
    };
    const Component = variant.startsWith('h') ? variant : 'p';
    return React.createElement(Component, { className: `${variants[variant]} ${className}` }, children);
  };

  // Advanced Components
  const Navbar = ({ title = "Dashboard" }) => (
    <nav className="bg-white shadow-lg border-b border-gray-100" style={getCustomStyles()}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-3 ml-4">
              <img 
                src="/branding/veropest_logo.png" 
                alt="VeroPest Logo" 
                className="w-6 h-6"
              />
              <Typography variant="h5">{title}</Typography>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <IconButton icon={Search} />
            <IconButton icon={Bell} />
            <Dropdown
              trigger={
                <div className="flex items-center space-x-2 cursor-pointer">
                  <Avatar 
                    src={user?.avatar} 
                    alt={user?.name || 'Account'} 
                    fallback={user?.name?.charAt(0) || 'A'} 
                  />
                  <span className="text-sm font-medium text-gray-700">{user?.name || 'Account'}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              }
              items={[
                { label: 'Profile', icon: User, onClick: () => setActiveTab('profile') },
                { label: 'Settings', icon: Settings, onClick: () => setActiveTab('settings') },
                { label: 'Logout', icon: LogOut, onClick: handleLogout }
              ]}
            />
          </div>
        </div>
      </div>
    </nav>
  );

  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:inset-0`}>
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <img 
            src="/branding/veropest_logo.png" 
            alt="VeroPest Logo" 
            className="w-8 h-8"
          />
          <Typography variant="h6">VeroPest Suite</Typography>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="md:hidden">
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Home },
            { id: 'jobs', label: 'Jobs', icon: Briefcase },
            { id: 'customers', label: 'Customers', icon: Users },
            { id: 'calendar', label: 'Calendar', icon: Calendar },
            { id: 'leads', label: 'Leads', icon: User },
            { id: 'inbox', label: 'Inbox', icon: Mail },
            { id: 'payments', label: 'Payments', icon: CreditCard },
            { id: 'reports', label: 'Reports', icon: BarChart3 },
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );

  // Main Dashboard Content
  const DashboardContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{countUpValue}</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Sales Overview">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Line type="monotone" dataKey="sales" stroke="#cb0c9f" strokeWidth={2} />
              <Line type="monotone" dataKey="revenue" stroke="#17c1e8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Revenue by Month">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Bar dataKey="revenue" fill="#cb0c9f" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Recent Activity">
        <div className="space-y-4">
          {[
            { user: 'John Doe', action: 'placed an order', time: '2 minutes ago', avatar: '' },
            { user: 'Jane Smith', action: 'updated profile', time: '5 minutes ago', avatar: '' },
            { user: 'Bob Johnson', action: 'completed payment', time: '10 minutes ago', avatar: '' },
            { user: 'Alice Brown', action: 'left a review', time: '15 minutes ago', avatar: '' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Avatar src={activity.avatar} alt={activity.user} size="sm" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                <p className="text-sm text-gray-500">{activity.action}</p>
              </div>
              <span className="text-xs text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50" style={getCustomStyles()}>
      <Navbar title="VeroPest Suite" />
      
      <div className="flex">
        <Sidebar />
        
        <div className="flex-1 md:ml-64">
          <div className="p-6">
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
                    className="flex-shrink-0 relative bg-white border border-gray-200 rounded-lg"
                    style={{ width: `${calendarWidth}px` }}
                  >
                    <Card title="Jobs Calendar" className="h-full">
                      <div className="h-full p-4" style={{ minHeight: '600px', backgroundColor: '#f9fafb' }}>
                        <FullCalendar
                          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                          headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek,listMonth'
                          }}
                          initialView="dayGridMonth"
                          editable={true}
                          selectable={true}
                          selectMirror={true}
                          dayMaxEvents={true}
                          weekends={true}
                          events={jobsEvents}
                          select={handleJobDateSelect}
                          eventClick={handleJobEventClick}
                          eventDrop={handleJobEventDrop}
                          eventResize={handleJobEventResize}
                          height="auto"
                          aspectRatio={1.35}
                          eventTextColor="#ffffff"
                          eventDisplay="block"
                          eventTimeFormat={{
                            hour: 'numeric',
                            minute: '2-digit',
                            meridiem: 'short'
                          }}
                          slotMinTime="06:00:00"
                          slotMaxTime="20:00:00"
                          slotDuration="00:30:00"
                          slotLabelInterval="01:00:00"
                          businessHours={{
                            daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
                            startTime: '08:00',
                            endTime: '18:00',
                          }}
                          nowIndicator={true}
                          scrollTime="08:00:00"
                          eventConstraint="businessHours"
                          eventOverlap={false}
                          eventDidMount={(info) => {
                            // Add custom styling based on status
                            const status = info.event.extendedProps.status;
                            if (status === 'urgent') {
                              info.el.style.border = '2px solid #dc2626';
                              info.el.style.fontWeight = 'bold';
                            } else if (status === 'completed') {
                              info.el.style.opacity = '0.7';
                            }
                          }}
                        />
                      </div>
                    </Card>
                  </div>

                  {/* Resize Handle */}
                  <div 
                    className="w-1 bg-gray-200 hover:bg-purple-400 cursor-col-resize transition-colors relative group"
                    onMouseDown={handleResizeStart}
                  >
                    <div className="absolute inset-y-0 -left-1 -right-1 bg-transparent" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-purple-400 rounded opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Right Panel - Job Details & Actions */}
                  <div className="w-64 flex-shrink-0">
                    <div className="space-y-4">
                      {/* Quick Stats */}
                      <Card title="Quick Stats">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">Total Jobs</span>
                            <Badge variant="primary" size="sm">{jobsEvents.length}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">Scheduled</span>
                            <Badge variant="default" size="sm">{jobsEvents.filter(e => e.extendedProps.status === 'scheduled').length}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">In Progress</span>
                            <Badge variant="warning" size="sm">{jobsEvents.filter(e => e.extendedProps.status === 'in-progress').length}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">Completed</span>
                            <Badge variant="success" size="sm">{jobsEvents.filter(e => e.extendedProps.status === 'completed').length}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">Urgent</span>
                            <Badge variant="danger" size="sm">{jobsEvents.filter(e => e.extendedProps.status === 'urgent').length}</Badge>
                          </div>
                        </div>
                      </Card>

                      {/* Recent Jobs */}
                      <Card title="Recent Jobs">
                        <div className="space-y-2">
                          {jobsEvents.slice(0, 4).map((job) => (
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
                                  {job.extendedProps.technician}
                                </p>
                              </div>
                              <Badge 
                                variant={
                                  job.extendedProps.status === 'completed' ? 'success' :
                                  job.extendedProps.status === 'urgent' ? 'danger' :
                                  job.extendedProps.status === 'in-progress' ? 'warning' : 'default'
                                }
                                size="sm"
                              >
                                {job.extendedProps.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </Card>

                      {/* Quick Actions */}
                      <Card title="Quick Actions">
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
                        </div>
                      </Card>
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
            {activeTab === 'payments' && (
              <Card title="Payments">
                <p>Payments content goes here...</p>
              </Card>
            )}
            {activeTab === 'calendar' && (
              <Card title="Calendar">
                <p>Calendar content goes here...</p>
              </Card>
            )}
            {activeTab === 'leads' && (
              <Card title="Leads">
                <p>Leads content goes here...</p>
              </Card>
            )}
            {activeTab === 'inbox' && (
              <Card title="Inbox">
                <p>Inbox content goes here...</p>
              </Card>
            )}
            {activeTab === 'reports' && (
              <Card title="Reports">
                <p>Reports content goes here...</p>
              </Card>
            )}
            {activeTab === 'profile' && (
              <Card title="Profile">
                <p>Profile content goes here...</p>
              </Card>
            )}
            {activeTab === 'settings' && (
              <SettingsPage />
            )}
          </div>
        </div>
      </div>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Branding logo overlay (optional, top left) */}
      <img
        src="/branding/veropest_logo.png"
        alt="VeroPest Logo"
        style={{
          position: 'fixed',
          top: 24,
          left: 24,
          width: 64,
          height: 64,
          zIndex: 100,
          opacity: 0.9,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default Dashboard;
