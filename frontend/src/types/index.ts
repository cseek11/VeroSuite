// User Types
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  roles: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

// Auth Types
export interface AuthState {
  token: string | null;
  tenantId: string | null;
  user: User | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  tenantId: string;
}

// Job Types
export interface Job {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  color?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'urgent';
  technician?: string;
  location?: string;
  description?: string;
}

export interface JobEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  color: string;
  extendedProps: {
    technician: string;
    status: string;
    location?: string;
    description?: string;
  };
}

// Account Types
export interface Account {
  id: string;
  name: string;
  account_type: string;
  status: string;
  phone?: string;
  email?: string;
  billing_address?: any;
  ar_balance: number;
  created_at: string;
  updated_at: string;
}

// Location Types
export interface Location {
  id: string;
  name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'date' | 'time';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    custom?: (value: any) => string | undefined;
  };
}

// UI Component Types
export interface ButtonProps {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ComponentType<any>;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export interface CardProps {
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode[];
  className?: string;
}

// Navigation Types
export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path?: string;
  children?: NavigationItem[];
}

// Dashboard Types
export interface DashboardMetric {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon: React.ComponentType<any>;
  color: string;
}

export interface ChartData {
  name: string;
  [key: string]: string | number;
}
