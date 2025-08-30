// Customer and related type definitions for strict TypeScript

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  account_type: 'commercial' | 'residential';
  ar_balance: number;
  // Additional optional fields for API responses
  address_line1?: string;
  postal_code?: string;
  tenant_id?: string;
  created_at?: string;
  updated_at?: string;
  locations?: Location[];
  agreements?: Agreement[];
  overdue_days?: number;
}

export interface Location {
  id: string;
  name: string;
  address_line1: string;
  city: string;
  state: string;
  postal_code: string;
  account_id: string;
  tenant_id: string;
  created_at: string;
  updated_at: string;
}

export interface Agreement {
  id: string;
  agreement_type: string;
  status: 'active' | 'pending' | 'expired' | 'cancelled';
  start_date: string;
  end_date?: string;
  monthly_amount?: number;
  annual_amount?: number;
  auto_renewal: boolean;
  account_id: string;
  tenant_id: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceHistory {
  id: string;
  date: string;
  service: string;
  technician: string;
  status: 'completed' | 'scheduled' | 'cancelled' | 'in_progress';
  notes: string;
}

export interface CustomerListViewProps {
  customers: Customer[];
  onViewHistory: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onViewDetails: (customer: Customer) => void;
  onSelectionChange: (selectedCustomers: Set<string>) => void;
}

export interface SearchFilters {
  searchTerm: string;
  filterType: 'all' | 'commercial' | 'residential';
}
