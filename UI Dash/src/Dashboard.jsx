import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronDown, Bell, Search, Menu, X, Home, BarChart3, Users, ShoppingCart, 
  CreditCard, Settings, User, TrendingUp, TrendingDown, Eye, Heart, MessageCircle,
  Calendar, Globe, Mail, Phone, Plus, Edit, Trash2, Filter, Upload, Download,
  Check, AlertTriangle, Info, XCircle, ChevronRight, ChevronLeft, Star,
  Play, Pause, SkipForward, Volume2, Camera, Image, FileText, Zap,
  Layers, Grid, List, MoreVertical, RefreshCw, Save, Copy, Share2, Maximize2,
  Moon, Sun, Palette, Type, Layout, Sliders as SlidersIcon
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import * as THREE from 'three';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [modalOpen, setModalOpen] = useState(false);
  const [alertVisible, setAlertVisible] = useState(true);
  const [tooltipVisible, setTooltipVisible] = useState({});
  const [tabsActive, setTabsActive] = useState('tab1');
  const [sliderValue, setSliderValue] = useState(50);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [countUpValue, setCountUpValue] = useState(0);
  const [progressValue, setProgressValue] = useState(75);
  const [wizardStep, setWizardStep] = useState(0);
  const [richText, setRichText] = useState('');
  const [selectedChoice, setSelectedChoice] = useState('');
  const [photoSwipeOpen, setPhotoSwipeOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const threeRef = useRef();

  const [customization, setCustomization] = useState({
    primaryColor: '#cb0c9f',
    secondaryColor: '#8392ab',
    accentColor: '#17c1e8',
    successColor: '#82d616',
    warningColor: '#fb6340',
    dangerColor: '#ea0606',
    brandName: 'SoftUI Dashboard Pro',
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
          <span>{fallback || alt?.charAt(0) || 'U'}</span>
        )}
      </div>
    );
  };

  const Button = ({ children, variant = 'primary', size = 'md', disabled = false, onClick, className = '', icon: Icon }) => {
    const variants = {
      primary: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600',
      secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
      success: 'bg-green-500 text-white hover:bg-green-600',
      danger: 'bg-red-500 text-white hover:bg-red-600',
      outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
    };
    const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-base', lg: 'px-6 py-3 text-lg' };

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        style={getCustomStyles()}
      >
        {Icon && <Icon className="w-4 h-4 mr-2" />}
        {children}
      </button>
    );
  };

  const IconButton = ({ icon: Icon, onClick, variant = 'default', size = 'md', className = '' }) => {
    const variants = {
      default: 'text-gray-600 hover:text-gray-800 hover:bg-gray-100',
      primary: 'text-purple-600 hover:text-purple-800 hover:bg-purple-100',
      danger: 'text-red-600 hover:text-red-800 hover:bg-red-100'
    };
    const sizes = { sm: 'p-1', md: 'p-2', lg: 'p-3' };

    return (
      <button onClick={onClick} className={`rounded-lg transition-colors ${variants[variant]} ${sizes[size]} ${className}`}>
        <Icon className="w-5 h-5" />
      </button>
    );
  };

  const Card = ({ title, children, className = '', actions, glass = false }) => (
    <div className={`${glass ? 'bg-white bg-opacity-20 backdrop-blur-lg' : 'bg-white'} rounded-2xl shadow-lg border border-gray-100 ${className}`} style={getCustomStyles()}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          {actions && <div className="flex space-x-2">{actions}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );

  const Checkbox = ({ checked, onChange, label, className = '' }) => (
    <label className={`flex items-center cursor-pointer ${className}`}>
      <div className="relative">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
          checked ? 'bg-purple-500 border-purple-500' : 'border-gray-300 hover:border-purple-400'
        }`} style={getCustomStyles()}>
          {checked && <Check className="w-3 h-3 text-white" />}
        </div>
      </div>
      {label && <span className="ml-3 text-gray-700">{label}</span>}
    </label>
  );

  const Chip = ({ children, variant = 'default', onRemove, className = '' }) => {
    const variants = {
      default: 'bg-gray-100 text-gray-700',
      primary: 'bg-purple-100 text-purple-700',
      success: 'bg-green-100 text-green-700',
      warning: 'bg-yellow-100 text-yellow-700',
      danger: 'bg-red-100 text-red-700'
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variants[variant]} ${className}`} style={getCustomStyles()}>
        {children}
        {onRemove && (
          <button onClick={onRemove} className="ml-2 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5">
            <X className="w-3 h-3" />
          </button>
        )}
      </span>
    );
  };

  const Collapse = ({ title, children, open, onToggle }) => (
    <div className="border border-gray-200 rounded-xl overflow-hidden" style={getCustomStyles()}>
      <button onClick={onToggle} className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 flex items-center justify-between">
        <span className="font-medium">{title}</span>
        <ChevronRight className={`w-4 h-4 transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>
      {open && <div className="p-4 border-t border-gray-200">{children}</div>}
    </div>
  );

  const Dropdown = ({ trigger, children, open, onToggle, className = '' }) => (
    <div className={`relative ${className}`}>
      <div onClick={onToggle}>{trigger}</div>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 min-w-48" style={getCustomStyles()}>
          {children}
        </div>
      )}
    </div>
  );

  const Input = ({ label, type = 'text', value, onChange, placeholder, error, className = '', icon: Icon }) => (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />}
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

  const Modal = ({ open, onClose, title, children, size = 'md' }) => {
    const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

    if (!open) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={onClose} />
          <div className={`inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ${sizes[size]} sm:w-full`} style={getCustomStyles()}>
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-4">{children}</div>
          </div>
        </div>
      </div>
    );
  };

  const Progress = ({ value, max = 100, color = 'purple', size = 'md', showLabel = true, animated = false }) => {
    const sizes = { sm: 'h-2', md: 'h-3', lg: 'h-4' };
    const colors = { purple: 'bg-purple-500', blue: 'bg-blue-500', green: 'bg-green-500', red: 'bg-red-500' };

    return (
      <div>
        {showLabel && (
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">{value}%</span>
          </div>
        )}
        <div className={`w-full bg-gray-200 rounded-full ${sizes[size]}`} style={getCustomStyles()}>
          <div
            className={`${colors[color]} ${sizes[size]} rounded-full transition-all duration-300 ${animated ? 'animate-pulse' : ''}`}
            style={{ width: `${(value / max) * 100}%` }}
          />
        </div>
      </div>
    );
  };

  const Switch = ({ checked, onChange, label, size = 'md' }) => {
    const sizes = { sm: 'w-8 h-4', md: 'w-11 h-6', lg: 'w-14 h-7' };
    const thumbSizes = { sm: 'h-3 w-3', md: 'h-4 w-4', lg: 'h-5 w-5' };

    return (
      <label className="flex items-center cursor-pointer">
        <div className="relative">
          <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
          <div className={`${sizes[size]} flex items-center rounded-full p-1 transition-colors ${
            checked ? 'bg-purple-600' : 'bg-gray-200'
          }`} style={getCustomStyles()}>
            <div className={`${thumbSizes[size]} bg-white rounded-full shadow-md transform transition-transform ${
              checked ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </div>
        </div>
        {label && <span className="ml-3 text-gray-700">{label}</span>}
      </label>
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
  const Navbar = ({ title = "Dashboard", user = { name: "John Doe", avatar: "" } }) => (
    <nav className="bg-white shadow-lg border-b border-gray-100" style={getCustomStyles()}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
              <Menu className="w-6 h-6" />
            </button>
            <Typography variant="h5" className="ml-4">{title}</Typography>
          </div>
          <div className="flex items-center space-x-4">
            <IconButton icon={Search} />
            <IconButton icon={Bell} />
            <Dropdown
              trigger={


// ===========================
// APPEND-ONLY: Plugins & Demos
// (See assistant's long code above)
// ===========================
