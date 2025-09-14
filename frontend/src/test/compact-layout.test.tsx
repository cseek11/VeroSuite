import { render, screen, fireEvent, waitFor } from '../test/setup/test-utils';
import { describe, it, expect, vi } from 'vitest';
import CustomersPage from '../components/CustomersPage';

// Mock the API and other dependencies
vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({
    data: [
      {
        id: '1',
        name: 'Test Customer 1',
        email: 'test1@example.com',
        phone: '555-1234',
        city: 'Pittsburgh',
        state: 'PA',
        account_type: 'commercial',
        ar_balance: 0
      },
      {
        id: '2',
        name: 'Test Customer 2',
        email: 'test2@example.com',
        phone: '555-5678',
        city: 'Monroeville',
        state: 'PA',
        account_type: 'residential',
        ar_balance: 150.50
      }
    ],
    isLoading: false,
    error: null,
    refetch: vi.fn()
  }),
  useMutation: () => ({
    mutate: vi.fn(),
    isPending: false
  }),
  useQueryClient: () => ({
    invalidateQueries: vi.fn()
  })
}));

vi.mock('@/lib/api', () => ({
  crmApi: {
    accounts: vi.fn(),
    updateAccount: vi.fn()
  }
}));

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    user: { id: '1', first_name: 'Test', last_name: 'User', email: 'test@example.com' },
    clear: vi.fn()
  })
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/customers' })
}));

// Mock Leaflet
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="map">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: { children: React.ReactNode }) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }: { children: React.ReactNode }) => <div data-testid="popup">{children}</div>
}));

describe('CustomersPage Compact Layout', () => {
  it('should render in standard layout by default', () => {
    render(<CustomersPage />);
    
    // Should show standard layout initially
    expect(screen.getByText('Compact View')).toBeInTheDocument();
    expect(screen.queryByText('Standard View')).not.toBeInTheDocument();
  });

  it('should toggle to compact layout when button is clicked', async () => {
    render(<CustomersPage />);
    
    // Click the compact view button
    const toggleButton = screen.getByText('Compact View');
    fireEvent.click(toggleButton);
    
    // Wait for the layout to change
    await waitFor(() => {
      expect(screen.getByText('Standard View')).toBeInTheDocument();
    });
    
    // Should now show standard view button (meaning we're in compact mode)
    expect(screen.queryByText('Compact View')).not.toBeInTheDocument();
  });

  it('should display customer cards in both layouts', async () => {
    render(<CustomersPage />);
    
    // Should show customer names in standard layout
    expect(screen.getByText('Test Customer 1')).toBeInTheDocument();
    expect(screen.getByText('Test Customer 2')).toBeInTheDocument();
    
    // Switch to compact layout
    const toggleButton = screen.getByText('Compact View');
    fireEvent.click(toggleButton);
    
    // Wait for the layout to change
    await waitFor(() => {
      expect(screen.getByText('Standard View')).toBeInTheDocument();
    });
    
    // Should still show customer names in compact layout
    expect(screen.getByText('Test Customer 1')).toBeInTheDocument();
    expect(screen.getByText('Test Customer 2')).toBeInTheDocument();
  });

  it('should maintain all customer information in compact layout', async () => {
    render(<CustomersPage />);
    
    // Switch to compact layout
    const toggleButton = screen.getByText('Compact View');
    fireEvent.click(toggleButton);
    
    // Wait for the layout to change
    await waitFor(() => {
      expect(screen.getByText('Standard View')).toBeInTheDocument();
    });
    
    // Should show all customer details
    expect(screen.getByText('test1@example.com')).toBeInTheDocument();
    expect(screen.getByText('test2@example.com')).toBeInTheDocument();
    expect(screen.getByText('555-1234')).toBeInTheDocument();
    expect(screen.getByText('555-5678')).toBeInTheDocument();
    expect(screen.getByText('Pittsburgh, PA')).toBeInTheDocument();
    expect(screen.getByText('Monroeville, PA')).toBeInTheDocument();
  });

  it('should show action buttons in both layouts', async () => {
    render(<CustomersPage />);
    
    // Should show action buttons in standard layout
    expect(screen.getAllByText('View History')).toHaveLength(2);
    expect(screen.getAllByText('Edit')).toHaveLength(2);
    
    // Switch to compact layout
    const toggleButton = screen.getByText('Compact View');
    fireEvent.click(toggleButton);
    
    // Wait for the layout to change
    await waitFor(() => {
      expect(screen.getByText('Standard View')).toBeInTheDocument();
    });
    
    // Should still show action buttons in compact layout
    expect(screen.getAllByText('History')).toHaveLength(2);
    expect(screen.getAllByText('Edit')).toHaveLength(2);
  });

  it('should maintain search functionality in both layouts', async () => {
    render(<CustomersPage />);
    
    const searchInput = screen.getByPlaceholderText('Search customers...');
    expect(searchInput).toBeInTheDocument();
    
    // Switch to compact layout
    const toggleButton = screen.getByText('Compact View');
    fireEvent.click(toggleButton);
    
    // Wait for the layout to change
    await waitFor(() => {
      expect(screen.getByText('Standard View')).toBeInTheDocument();
    });
    
    // Search input should still be present
    expect(screen.getByPlaceholderText('Search customers...')).toBeInTheDocument();
  });
});
