// ============================================================================
// VeroField Mobile App - TypeScript Types
// ============================================================================

// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'technician' | 'dispatcher' | 'admin';
  tenant_id: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refresh_token?: string;
}

// Job and Work Order Types
export interface Job {
  id: string;
  status: JobStatus;
  priority: JobPriority;
  scheduled_date: string;
  time_window: {
    start: string;
    end: string;
  };
  customer: {
    id: string;
    name: string;
    type: string;
  };
  location: {
    id: string;
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  service: {
    type: string;
    description: string;
    estimated_duration: number;
    price: number;
    special_instructions?: string;
  };
  technician_id: string;
  actual_times: {
    started_at: string | null;
    completed_at: string | null;
  };
  completion_data: {
    notes: string | null;
    signature: string | null;
    photos: Photo[];
    chemicals_used: ChemicalLog[];
  };
}

export type JobStatus = 
  | 'unassigned' 
  | 'scheduled' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled';

export type JobPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Photo {
  id: string;
  job_id: string;
  type: 'before' | 'after' | 'service' | 'damage';
  url: string;
  uploaded_at: string;
  file_size: number;
}

export interface ChemicalLog {
  id: string;
  job_id: string;
  chemical_name: string;
  amount_used: number;
  unit: string;
  applied_at: string;
  notes?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

// Navigation Types
export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  JobDetails: { jobId: string };
  PhotoCapture: { jobId: string; photoType: string };
  SignatureCapture: { jobId: string; signatureType: 'customer' | 'technician' };
  Profile: undefined;
  Settings: undefined;
};

export type MainTabParamList = {
  Jobs: undefined;
  Profile: undefined;
  Settings: undefined;
};

// Offline Storage Types
export interface OfflineJob {
  job: Job;
  status: 'pending' | 'syncing' | 'synced' | 'error';
  last_modified: string;
  sync_attempts: number;
}

export interface OfflineData {
  jobs: OfflineJob[];
  photos: Photo[];
  signatures: string[];
  last_sync: string;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Configuration Types
export interface AppConfig {
  api_base_url: string;
  upload_base_url: string;
  enable_offline_mode: boolean;
  max_photo_size: number;
  sync_interval: number;
}

// Component Props Types
export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
}

export interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  error?: string;
}

export interface CardProps {
  children: React.ReactNode;
  style?: any;
  onPress?: () => void;
}
