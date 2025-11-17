import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Mock fetch
global.fetch = vi.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

// Mock environment variables
vi.mock('../lib/config', () => ({
  config: {
    supabaseUrl: 'https://test.supabase.co',
    supabaseAnonKey: 'test-anon-key',
    environment: 'test',
  },
}));

// Mock enhancedApi
vi.mock('../lib/enhanced-api', async () => {
  const actual = await vi.importActual('../lib/enhanced-api');
  return {
    ...actual,
    enhancedApi: {
      technicians: {
        list: vi.fn().mockResolvedValue({ technicians: [], total: 0, page: 1, limit: 10, total_pages: 0 }),
      },
      accounts: {
        search: vi.fn().mockResolvedValue([]),
        getAll: vi.fn().mockResolvedValue([]),
      },
      workOrders: {
        list: vi.fn().mockResolvedValue({ data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } }),
      },
    },
  };
});

// Mock secureApiClient
vi.mock('../lib/secure-api-client', async () => {
  const actual = await vi.importActual('../lib/secure-api-client');
  return {
    ...actual,
    secureApiClient: {
      getAllAccounts: vi.fn().mockResolvedValue([]),
      getAccount: vi.fn().mockResolvedValue(null),
      searchAccounts: vi.fn().mockResolvedValue([]),
    },
  };
});

// Mock React Router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    BrowserRouter: actual.BrowserRouter,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/', search: '', hash: '', state: null }),
    useParams: () => ({}),
  };
});

// Mock lucide-react icons
vi.mock('lucide-react', async () => {
  const actual = await vi.importActual('lucide-react');
  const React = await import('react');
  
  // Create mock icon component factory
  const createMockIcon = (testId: string, className?: string) => {
    return React.forwardRef((props: any, ref: any) => {
      return React.createElement('svg', {
        'data-testid': testId,
        className: className,
        ref,
        ...props
      });
    });
  };
  
  return {
    ...actual,
    Users: createMockIcon('users-icon'),
    Mail: createMockIcon('mail-icon'),
    AlertTriangle: createMockIcon('alert-triangle-icon'),
    Loader2: createMockIcon('loader2-icon', 'animate-spin'),
    RefreshCw: createMockIcon('refresh-cw-icon'),
    Search: createMockIcon('search-icon'),
    X: createMockIcon('x-icon'),
    Home: createMockIcon('home-icon'),
    ArrowLeftIcon: createMockIcon('arrow-left-icon'),
    CheckIcon: createMockIcon('check-icon'),
    XMarkIcon: createMockIcon('x-mark-icon'),
    Tag: createMockIcon('tag-icon'),
    TagIcon: createMockIcon('tag-icon'),
    Pencil: createMockIcon('pencil-icon'),
    Phone: createMockIcon('phone-icon'),
    MapPin: createMockIcon('map-pin-icon'),
    Calendar: createMockIcon('calendar-icon'),
    Save: createMockIcon('save-icon'),
    User: createMockIcon('user-icon'),
    Clock: createMockIcon('clock-icon'),
    DollarSign: createMockIcon('dollar-sign-icon'),
    FileText: createMockIcon('file-text-icon'),
    Edit: createMockIcon('edit-icon'),
    Trash2: createMockIcon('trash2-icon'),
    Printer: createMockIcon('printer-icon'),
    CheckCircle: createMockIcon('check-circle-icon'),
    AlertCircle: createMockIcon('alert-circle-icon'),
    XCircle: createMockIcon('x-circle-icon'),
    Play: createMockIcon('play-icon'),
    History: createMockIcon('history-icon'),
    Building: createMockIcon('building-icon'),
    Briefcase: createMockIcon('briefcase-icon'),
    Plus: createMockIcon('plus-icon'),
    RotateCcw: createMockIcon('rotate-ccw-icon'),
    Eye: createMockIcon('eye-icon'),
  };
});