// Customer and related type definitions for strict TypeScript

export interface CustomerSegment {
  id: string;
  tenant_id: string;
  segment_name: string;
  segment_code: string;
  description: string;
  default_service_types: string[];
  pricing_tier: 'basic' | 'standard' | 'premium' | 'enterprise';
  compliance_requirements: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CustomerProfile {
  id: string;
  tenant_id: string;
  account_id: string;
  segment_id: string;
  business_name: string;
  business_type: string;
  property_type: string;
  property_size: string;
  access_codes: string;
  special_instructions: string;
  preferred_language: string;
  timezone: string;
  contract_start_date: string;
  contract_type: 'monthly' | 'quarterly' | 'annually';
  contract_value: number;
  auto_renew: boolean;
  account_status: 'active' | 'inactive' | 'suspended';
  payment_status: 'current' | 'past_due' | 'overdue';
  service_status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
  customer_segments?: CustomerSegment;
}

export interface CustomerContact {
  id: string;
  tenant_id: string;
  account_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  contact_type: string;
  is_primary: boolean;
  created_at: string;
}

export interface Customer {
  id: string;
  tenant_id: string;
  name: string;
  account_type: 'residential' | 'commercial' | 'industrial';
  status: 'active' | 'inactive';
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  billing_address: {
    address_line1: string;
    city: string;
    state: string;
    zip_code: string;
  };
  payment_method: 'credit_card' | 'bank_transfer' | 'invoice' | 'cash';
  billing_cycle: 'monthly' | 'quarterly' | 'annually';
  property_type: string;
  property_size: string;
  access_instructions: string;
  emergency_contact: string;
  preferred_contact_method: 'phone' | 'email' | 'text';
  ar_balance: number;
  created_at: string;
  updated_at: string;
  notes?: string;
  customer_profiles?: CustomerProfile[];
  customer_contacts?: CustomerContact[];
}

export interface ServiceArea {
  id: string;
  tenant_id: string;
  area_name: string;
  area_code: string;
  description: string;
  coverage_radius_miles: number;
  is_active: boolean;
  created_at: string;
}

export interface CustomerFilters {
  searchTerm: string;
  selectedSegment: string;
  selectedType: string;
  selectedArea: string;
  status: string;
}

export interface CustomerSort {
  field: string;
  direction: 'asc' | 'desc';
}

export interface CustomerPagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}
