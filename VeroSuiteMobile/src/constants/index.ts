// ============================================================================
// VeroField Mobile App - Constants
// ============================================================================

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://10.0.2.2:3001/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@VeroField:auth_token',
  USER_DATA: '@VeroField:user_data',
  OFFLINE_DATA: '@VeroField:offline_data',
  PENDING_UPLOADS: '@VeroField:pending_uploads',
  NOTIFICATIONS: '@VeroField:notifications',
  APP_SETTINGS: '@VeroField:app_settings',
};

// Job Status Colors
export const JOB_STATUS_COLORS = {
  unassigned: '#6B7280', // Gray
  scheduled: '#3B82F6',  // Blue
  in_progress: '#F59E0B', // Amber
  completed: '#10B981',  // Green
  cancelled: '#EF4444',  // Red
};

// Job Priority Colors
export const JOB_PRIORITY_COLORS = {
  low: '#10B981',    // Green
  medium: '#F59E0B', // Amber
  high: '#EF4444',   // Red
  urgent: '#DC2626', // Dark Red
};

// Photo Types
export const PHOTO_TYPES = [
  { key: 'before', label: 'Before', icon: '📷' },
  { key: 'after', label: 'After', icon: '📸' },
  { key: 'service', label: 'Service', icon: '🔧' },
  { key: 'damage', label: 'Damage', icon: '⚠️' },
] as const;

// App Configuration
export const APP_CONFIG = {
  MAX_PHOTO_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_PHOTOS_PER_JOB: 20,
  SYNC_INTERVAL: 30000, // 30 seconds
  OFFLINE_RETRY_DELAY: 5000, // 5 seconds
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
  AUTH_ERROR: 'Authentication failed. Please login again.',
  UPLOAD_ERROR: 'Failed to upload file. Please try again.',
  SYNC_ERROR: 'Failed to sync data. Please check your connection.',
  GENERIC_ERROR: 'An unexpected error occurred. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  JOB_STARTED: 'Job started successfully!',
  JOB_COMPLETED: 'Job completed successfully!',
  PHOTO_UPLOADED: 'Photo uploaded successfully!',
  DATA_SYNCED: 'Data synced successfully!',
};

// Screen Names
export const SCREEN_NAMES = {
  LOGIN: 'Login' as const,
  MAIN: 'Main' as const,
  JOBS: 'Jobs' as const,
  JOB_DETAILS: 'JobDetails' as const,
  PHOTO_CAPTURE: 'PhotoCapture' as const,
  SIGNATURE_CAPTURE: 'SignatureCapture' as const,
  PROFILE: 'Profile' as const,
  SETTINGS: 'Settings' as const,
};

// Tab Names
export const TAB_NAMES = {
  JOBS: 'Jobs' as const,
  PROFILE: 'Profile' as const,
  SETTINGS: 'Settings' as const,
};

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/,
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  TIME: 'HH:mm',
  DATETIME: 'MMM DD, YYYY HH:mm',
  API: 'YYYY-MM-DD',
};

// File Types
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

// App Version
export const APP_VERSION = '1.0.0';

// Build Configuration
export const BUILD_CONFIG = {
  IS_DEVELOPMENT: __DEV__,
  ENABLE_LOGGING: __DEV__,
  ENABLE_CRASH_REPORTING: !__DEV__,
};
