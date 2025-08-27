import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CustomerListView from '../components/CustomerListView';

// Mock the EnhancedUI components
vi.mock('@/components/ui/EnhancedUI', () => ({
  Typography: ({ children, variant, className }: any) => (
    <div className={`typography ${variant} ${className}`}>{children}</div>
  ),
  Button: ({ children, onClick, variant, size, className }: any) => (
    <button onClick={onClick} className={`button ${variant} ${size} ${className}`}>
      {children}
    </button>
  ),
  Card: ({ children, className }: any) => (
    <div className={`card ${className}`}>{children}</div>
  ),
  Input: ({ placeholder, value, onChange, icon, className }: any) => (
    <input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`input ${className}`}
    />
  ),
  Chip: ({ children, variant, className }: any) => (
    <span className={`chip ${variant} ${className}`}>{children}</span>
  ),
  Checkbox: ({ checked, onChange, className }: any) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className={`checkbox ${className}`}
    />
  )
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Search: () => <div data-testid="search-icon">Search</div>,
  Filter: () => <div data-testid="filter-icon">Filter</div>,
  Eye: () => <div data-testid="eye-icon">Eye</div>,
  Edit: () => <div data-testid="edit-icon">Edit</div>,
  Phone: () => <div data-testid="phone-icon">Phone</div>,
  DollarSign: () => <div data-testid="dollar-icon">Dollar</div>,
  Mail: () => <div data-testid="mail-icon">Mail</div>,
  MapPin: () => <div data-testid="mappin-icon">MapPin</div>,
  Building: () => <div data-testid="building-icon">Building</div>,
  FileText: () => <div data-testid="filetext-icon">FileText</div>,
  Calendar: () => <div data-testid="calendar-icon">Calendar</div>,
  MessageSquare: () => <div data-testid="messagesquare-icon">MessageSquare</div>,
  FolderOpen: () => <div data-testid="folderopen-icon">FolderOpen</div>,
  Users: () => <div data-testid="users-icon">Users</div>,
  RefreshCw: () => <div data-testid="refreshcw-icon">RefreshCw</div>,
  ChevronDown: () => <div data-testid="chevrondown-icon">ChevronDown</div>,
  ChevronUp: () => <div data-testid="chevronup-icon">ChevronUp</div>
}));

const mockCustomers = [
  {
    id: '1',
    name: 'Test Customer 1',
    email: 'test1@example.com',
    phone: '555-1234',
    city: 'Pittsburgh',
    state: 'PA',
    account_type: 'commercial' as const,
    ar_balance: 0
  },
  {
    id: '2',
    name: 'Test Customer 2',
    email: 'test2@example.com',
    phone: '555-5678',
    city: 'Monroeville',
    state: 'PA',
    account_type: 'residential' as const,
    ar_balance: 150.50
  }
];

const mockProps = {
  customers: mockCustomers,
  onViewHistory: vi.fn(),
  onEdit: vi.fn(),
  onViewDetails: vi.fn()
};

describe('CustomerListView', () => {
  it('should render the customer list table', () => {
    render(<CustomerListView {...mockProps} />);
    
    // Should show customer names in the table
    expect(screen.getByText('Test Customer 1')).toBeInTheDocument();
    expect(screen.getByText('Test Customer 2')).toBeInTheDocument();
    
    // Should show table headers
    expect(screen.getByText('Customer')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('AR Balance')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('should show search and filter controls', () => {
    render(<CustomerListView {...mockProps} />);
    
    // Should show search input
    expect(screen.getByPlaceholderText('Search customers...')).toBeInTheDocument();
    
    // Should show filter dropdown
    expect(screen.getByDisplayValue('All Types')).toBeInTheDocument();
    
    // Should show clear button
    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  it('should allow selecting customers', () => {
    render(<CustomerListView {...mockProps} />);
    
    // Get checkboxes
    const checkboxes = screen.getAllByRole('checkbox');
    
    // Select first customer
    fireEvent.click(checkboxes[1]); // First customer checkbox (index 0 is select all)
    
    // Should show tabbed navigation
    expect(screen.getByText('1 Customer Selected')).toBeInTheDocument();
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Jobs/Service History')).toBeInTheDocument();
    expect(screen.getByText('Billing/AR')).toBeInTheDocument();
    expect(screen.getByText('Notes/Communications')).toBeInTheDocument();
    expect(screen.getByText('Documents')).toBeInTheDocument();
  });

  it('should show tab content when customers are selected', async () => {
    render(<CustomerListView {...mockProps} />);
    
    // Select a customer
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);
    
    // Wait for tab content to appear
    await waitFor(() => {
      expect(screen.getByText('Selected Customers Overview')).toBeInTheDocument();
    });
    
    // Should show overview statistics
    expect(screen.getByText('Total Customers')).toBeInTheDocument();
    expect(screen.getByText('Commercial')).toBeInTheDocument();
    expect(screen.getByText('Residential')).toBeInTheDocument();
  });

  it('should allow expanding customer rows', () => {
    render(<CustomerListView {...mockProps} />);
    
    // Get expand buttons (chevron icons)
    const expandButtons = screen.getAllByTestId('chevrondown-icon');
    
    // Click first expand button
    fireEvent.click(expandButtons[0]);
    
    // Should show expanded content
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(screen.getByText('Notes')).toBeInTheDocument();
  });

  it('should call onViewHistory when history button is clicked', () => {
    render(<CustomerListView {...mockProps} />);
    
    // Get history buttons
    const historyButtons = screen.getAllByText('History');
    
    // Click first history button
    fireEvent.click(historyButtons[0]);
    
    // Should call the callback
    expect(mockProps.onViewHistory).toHaveBeenCalledWith(mockCustomers[0]);
  });

  it('should call onEdit when edit button is clicked', () => {
    render(<CustomerListView {...mockProps} />);
    
    // Get edit buttons
    const editButtons = screen.getAllByText('Edit');
    
    // Click first edit button
    fireEvent.click(editButtons[0]);
    
    // Should call the callback
    expect(mockProps.onEdit).toHaveBeenCalledWith(mockCustomers[0]);
  });

  it('should call onViewDetails when customer name is clicked', () => {
    render(<CustomerListView {...mockProps} />);
    
    // Click first customer name
    fireEvent.click(screen.getByText('Test Customer 1'));
    
    // Should call the callback
    expect(mockProps.onViewDetails).toHaveBeenCalledWith(mockCustomers[0]);
  });

  it('should filter customers by search term', () => {
    render(<CustomerListView {...mockProps} />);
    
    // Type in search box
    const searchInput = screen.getByPlaceholderText('Search customers...');
    fireEvent.change(searchInput, { target: { value: 'Test Customer 1' } });
    
    // Should only show the matching customer
    expect(screen.getByText('Test Customer 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Customer 2')).not.toBeInTheDocument();
  });

  it('should clear selection when clear selection button is clicked', async () => {
    render(<CustomerListView {...mockProps} />);
    
    // Select a customer
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);
    
    // Should show tabbed navigation
    expect(screen.getByText('1 Customer Selected')).toBeInTheDocument();
    
    // Click clear selection
    fireEvent.click(screen.getByText('Clear Selection'));
    
    // Should hide tabbed navigation
    await waitFor(() => {
      expect(screen.queryByText('1 Customer Selected')).not.toBeInTheDocument();
    });
  });
});



