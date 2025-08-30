import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronDown, Bell, Search, Menu, X, Home, BarChart3, Users, ShoppingCart, 
  CreditCard, Settings, User, TrendingUp, TrendingDown, Eye, Heart, MessageCircle,
  Calendar, Globe, Mail, Phone, Plus, Edit, Trash2, Filter, Upload, Download,
  Check, AlertTriangle, Info, XCircle, ChevronRight, ChevronLeft, Star,
  Play, Pause, SkipForward, Volume2, Camera, Image, FileText, Zap,
  Layers, Grid, List, MoreVertical, RefreshCw, Save, Copy, Share2, Maximize2,
  Moon, Sun, Palette, Type, Layout, Sliders as SlidersIcon, LogOut
} from 'lucide-react';

// Types for enhanced UI components
interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'danger' | 'error';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  className?: string;
}

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost' | 'default';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: (event?: any) => void;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface IconButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode[];
  glass?: boolean;
}

interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  className?: string;
}

interface ChipProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline';
  color?: string;
  size?: string;
  onRemove?: () => void;
  className?: string;
}

interface CollapseProps {
  title: string;
  children: React.ReactNode;
  open: boolean;
  onToggle: () => void;
}

interface DropdownItem {
  label?: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  divider?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  className?: string;
}

interface InputProps {
  label?: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ComponentType<{ className?: string }>;
  error?: string;
  className?: string;
  disabled?: boolean;
  multiline?: boolean;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'green' | 'blue' | 'yellow' | 'amber' | 'red';
  showLabel?: boolean;
  className?: string;
}

interface TabsProps {
  tabs?: Array<{
    id: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
  active?: string;
  onTabChange?: (id: string) => void;
  variant?: 'default' | 'pills';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

interface TextareaProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  error?: string;
  className?: string;
}

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption';
  children: React.ReactNode;
  className?: string;
}

interface NavbarProps {
  title?: string;
  user?: {
    name: string;
    avatar?: string;
  };
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
  onLogout?: () => void;
}

// Enhanced UI Components
export const Alert: React.FC<AlertProps> = ({ type = 'info', title, children, onClose, className = '' }) => {
  const icons = { info: Info, success: Check, warning: AlertTriangle, danger: XCircle, error: XCircle };
  const colors = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    danger: 'bg-red-50 text-red-800 border-red-200',
    error: 'bg-red-50 text-red-800 border-red-200'
  };
  const Icon = icons[type];
  
  return (
    <div className={`p-4 rounded-xl border ${colors[type]} ${className}`}>
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

export const AlertDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`text-sm text-gray-600 ${className}`}>
      {children}
    </div>
  );
};

export const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'md', fallback, className = '' }) => {
  const sizes = { sm: 'w-8 h-8 text-sm', md: 'w-10 h-10 text-base', lg: 'w-12 h-12 text-lg', xl: 'w-16 h-16 text-xl' };
  return (
    <div className={`${sizes[size]} rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white font-medium ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full rounded-full object-cover" />
      ) : (
        <span>{fallback || alt?.charAt(0) || 'U'}</span>
      )}
    </div>
  );
};

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', disabled = false, onClick, className = '', icon: Icon }) => {
  const variants = {
    primary: 'crm-btn-primary',
    secondary: 'crm-btn-secondary',
    success: 'crm-btn-success',
    danger: 'crm-btn-danger',
    outline: 'crm-btn-outline',
    ghost: 'crm-btn-ghost',
    default: 'crm-btn-default'
  };
  const sizes = { 
    sm: 'crm-btn-sm', 
    md: 'crm-btn-md', 
    lg: 'crm-btn-lg' 
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`crm-btn ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
};

export const IconButton: React.FC<IconButtonProps> = ({ icon: Icon, onClick, variant = 'default', size = 'md', className = '' }) => {
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

export const Card: React.FC<CardProps> = ({ title, children, className = '', actions, glass = false }) => (
  <div className={`crm-card ${glass ? 'bg-white bg-opacity-20 backdrop-blur-lg' : ''} ${className}`}>
    {title && (
      <div className="crm-card-header flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
    )}
    <div className="crm-card-body">{children}</div>
  </div>
);

export const Checkbox: React.FC<CheckboxProps> = ({ checked, defaultChecked, onChange, label, className = '' }) => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked || checked || false);
  
  const handleChange = (newChecked: boolean) => {
    setInternalChecked(newChecked);
    onChange?.(newChecked);
  };

  const isChecked = checked !== undefined ? checked : internalChecked;

  return (
  <label className={`flex items-center cursor-pointer ${className}`}>
    <div className="relative">
      <input 
        type="checkbox" 
          checked={isChecked} 
          onChange={(e) => handleChange(e.target.checked)} 
          className="absolute opacity-0 w-4 h-4 cursor-pointer" 
        />
        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
          isChecked ? 'bg-purple-500 border-purple-500' : 'border-gray-200 hover:border-purple-400 bg-white'
        }`}>
          {isChecked && <Check className="w-2.5 h-2.5 text-white" />}
        </div>
      </div>
      {label && <span className="ml-2 text-sm text-gray-700">{label}</span>}
  </label>
);
};

export const Chip: React.FC<ChipProps> = ({ children, variant = 'default', color, size, onRemove, className = '' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-purple-100 text-purple-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    outline: 'bg-transparent border border-gray-300 text-gray-700'
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizeClasses} ${className}`} style={color ? { backgroundColor: color, color: 'white' } : undefined}>
      {children}
      {onRemove && (
        <button onClick={onRemove} className="ml-2 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5">
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

export const Collapse: React.FC<CollapseProps> = ({ title, children, open, onToggle }) => (
  <div className="border border-gray-200 rounded-xl overflow-hidden">
    <button onClick={onToggle} className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 flex items-center justify-between">
      <span className="font-medium">{title}</span>
      <ChevronRight className={`w-4 h-4 transition-transform ${open ? 'rotate-90' : ''}`} />
    </button>
    {open && (
      <div className="px-4 py-3 bg-white">
        {children}
      </div>
    )}
  </div>
);

export const Dropdown: React.FC<DropdownProps> = ({ trigger, items, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
          {items.map((item, index) => (
            <div key={index}>
              {item.divider ? (
                <div className="border-t border-gray-200 my-1" />
              ) : (
                <button
                  onClick={() => {
                    item.onClick?.();
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  {item.icon && <item.icon className="w-4 h-4 mr-3" />}
                  {item.label}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const Input: React.FC<InputProps> = ({ label, value, onChange, placeholder, type = 'text', icon: Icon, error, className = '', disabled, multiline }) => {
  if (multiline) {
    return (
      <div className={`crm-field ${className}`}>
        {label && <label className="crm-label">{label}</label>}
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled || false}
          className={`crm-textarea ${error ? 'crm-input-error' : ''}`}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            color: 'rgb(30, 41, 59)',
            backdropFilter: 'blur(4px)'
          }}
        />
        {error && <p className="crm-error">{error}</p>}
      </div>
    );
  }

  return (
    <div className={`crm-field ${className}`}>
      {label && <label className="crm-label">{label}</label>}
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-4 w-4 text-gray-500" />
        </div>
      )}
              <input
        type={type}
        value={value}
          onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
          disabled={disabled || false}
          className={`crm-input ${Icon ? 'pl-10' : ''} ${error ? 'crm-input-error' : ''}`}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            color: 'rgb(30, 41, 59)',
            backdropFilter: 'blur(4px)'
          }}
        />
      </div>
      {error && <p className="crm-error">{error}</p>}
  </div>
);
};

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-2xl shadow-xl ${sizes[size]} w-full mx-4 ${className}`}>
        {title && (
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max = 100, size = 'md', color = 'primary', showLabel = false, className = '' }) => {
  const sizes = { sm: 'h-1', md: 'h-2', lg: 'h-3' };
  const colors = {
    primary: 'bg-purple-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500'
  };
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${sizes[size]}`}>
        <div 
          className={`${colors[color]} rounded-full transition-all duration-300 ${sizes[size]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export const Tabs: React.FC<TabsProps> = ({ tabs, active, onTabChange, variant = 'default', size = 'md', children, value, onValueChange, className = '' }) => {
  const currentValue = value || active;
  const handleChange = onValueChange || onTabChange;

  const sizeClasses = {
    sm: {
      container: 'space-x-4',
      button: 'py-1 px-1 text-xs',
      icon: 'w-3 h-3 mr-1'
    },
    md: {
      container: 'space-x-8',
      button: 'py-2 px-1 text-sm',
      icon: 'w-4 h-4 mr-2'
    },
    lg: {
      container: 'space-x-10',
      button: 'py-3 px-2 text-base',
      icon: 'w-5 h-5 mr-3'
    }
  };

  const currentSize = sizeClasses[size];

  if (children) {
    return (
      <div className={`${variant === 'pills' ? '' : 'border-b border-gray-200'} ${className}`}>
        {children}
      </div>
    );
  }

  if (!tabs || !handleChange) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`${variant === 'pills' ? '' : 'border-b border-gray-200'} ${className}`}>
      <nav className={variant === 'pills' ? `flex ${currentSize.container}` : `-mb-px flex ${currentSize.container}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
            onClick={() => handleChange(tab.id)}
          className={`${variant === 'pills' 
              ? `px-3 ${currentSize.button} rounded-xl font-medium transition-colors ${
                  currentValue === tab.id ? 'bg-purple-500 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`
              : `${currentSize.button} border-b-2 font-medium transition-colors ${
                  currentValue === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`
          }`}
        >
            {tab.icon && <tab.icon className={`${currentSize.icon} inline`} />}
          {tab.label}
        </button>
      ))}
    </nav>
  </div>
);
};

export const Textarea: React.FC<TextareaProps> = ({ label, value, onChange, placeholder, rows = 4, error, className = '' }) => (
  <div className={`crm-field ${className}`}>
    {label && <label className="crm-label">{label}</label>}
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`crm-textarea ${error ? 'crm-input-error' : ''}`}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        color: 'rgb(30, 41, 59)',
        backdropFilter: 'blur(4px)'
      }}
      onFocus={(e) => {
        e.target.style.boxShadow = '0 0 0 2px rgba(34, 197, 94, 0.3)';
        e.target.style.borderColor = 'rgba(34, 197, 94, 0.5)';
      }}
      onBlur={(e) => {
        e.target.style.boxShadow = 'none';
        e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      }}
    />
    {error && <p className="crm-error">{error}</p>}
  </div>
);

export const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top' }) => {
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

export const Typography: React.FC<TypographyProps> = ({ variant = 'body1', children, className = '' }) => {
  const variants = {
    h1: 'text-2xl font-bold text-gray-900 mb-4',
    h2: 'text-xl font-semibold text-gray-900 mb-3',
    h3: 'text-lg font-semibold text-gray-900 mb-2',
    h4: 'text-base font-medium text-gray-900 mb-2',
    h5: 'text-sm font-medium text-gray-900 mb-1',
    h6: 'text-xs font-medium text-gray-900 mb-1',
    body1: 'text-sm text-gray-700 leading-relaxed',
    body2: 'text-xs text-gray-600 leading-tight',
    caption: 'text-xs text-gray-500'
  };
  const Component = variant.startsWith('h') ? variant : 'p';
  return React.createElement(Component, { className: `${variants[variant]} ${className}` }, children);
};

export const Navbar: React.FC<NavbarProps> = ({ title = "Dashboard", user = { name: "John Doe", avatar: "" }, sidebarCollapsed = false, onSidebarToggle, onLogout }) => {
  const navigate = useNavigate();
  
  return (
    <nav className="bg-[url('/branding/crm_BG_small.png')] bg-cover bg-center shadow-sm border-b border-gray-200 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Left side - Logo and Branding */}
        <div className="flex items-center">
            <button
              onClick={onSidebarToggle}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 lg:hidden"
            >
              <Settings className="h-6 w-6" />
            </button>
            
            <img 
              src="/branding/vero_small.png" 
              alt="VeroPest Suite" 
              className={`h-8 w-auto transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-100' : 'opacity-0'}`} 
            />
          </div>
          {/* Center - Global Search */}
          <div className="flex-1 max-w-2xl mx-4 lg:mx-8 min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers, jobs, invoices, technicians..."
                className="pl-10 pr-16 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <Filter className="h-4 w-4 text-gray-400" />
                <span className="text-xs text-gray-500 hidden sm:inline">⌘K</span>
              </div>
            </div>
          </div>

          {/* Right side - Notifications and Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
            {/* Dashboard Toggle */}
            <div className="hidden sm:flex items-center bg-gray-100 rounded-lg p-1 h-9">
              <button
                onClick={() => navigate('/dashboard')}
                className={`px-3 h-7 text-xs font-medium rounded-md transition-colors flex items-center ${
                  window.location.pathname === '/dashboard'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                VeroDash
              </button>
              <button
                onClick={() => navigate('/resizable-dashboard')}
                className={`px-3 h-7 text-xs font-medium rounded-md transition-colors flex items-center ${
                  window.location.pathname === '/resizable-dashboard'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                VeroCards
              </button>
            </div>

            {/* Quick Actions Dropdown */}
            <Dropdown
              trigger={
                <Button variant="outline" className="flex items-center space-x-2 bg-white border-gray-300 hover:bg-gray-50 h-9">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Quick Actions</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              }
              items={[
                { label: 'Create Work Order', icon: Plus, onClick: () => navigate('/jobs/new') },
                { label: 'Schedule Job', icon: Calendar, onClick: () => navigate('/jobs/new') },
                { label: 'Add Customer', icon: User, onClick: () => navigate('/customers/new') },
                { label: 'View Reports', icon: BarChart3, onClick: () => navigate('/reports') }
              ]}
            />

            {/* Notifications Center */}
            <div className="relative">
              <button className="relative w-9 h-9 rounded-md text-gray-400 hover:text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 flex items-center justify-center">
                <Bell className="h-6 w-6" />
          </button>
        </div>

            {/* User Menu */}
            <div className="relative">
          <Dropdown
                trigger={
                  <div className="flex items-center space-x-3 cursor-pointer px-3 py-2 rounded-md bg-white border border-gray-200 hover:bg-gray-50 h-9">
                    <Avatar size="sm" fallback={user.name?.charAt(0) || 'U'} />
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {user.name || 'User'}
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                }
            items={[
                  { label: 'Profile Settings', icon: Settings, onClick: () => navigate('/settings') },
              { label: 'Logout', icon: LogOut, onClick: onLogout }
            ]}
          />
            </div>
        </div>
      </div>
    </div>
  </nav>
);
};
