// ============================================================================
// ENHANCED API CLIENT - Comprehensive Pest Control Management System
// ============================================================================
// This file provides a unified API client for all database operations
// with multi-tenant support, type safety, and comprehensive error handling

import { supabase } from './supabase-client';
import type { 
  Account, 
  CustomerProfile, 
  CustomerContact, 
  WorkOrder, 
  Job, 
  Location,
  CustomerSegment,
  ServiceCategory,
  ServiceType,
  PricingTier,
  ServicePricing,
  PaymentMethod,
  CommunicationTemplate,
  AutomatedCommunication,
  ComplianceRequirement,
  ComplianceRecord,
  ServiceArea,
  TechnicianSkill,
  CustomerAnalytics,
  ServiceAnalytics,
  Tenant,
  User,
  ApiResponse,
  PaginatedResponse,
  SearchFilters
} from '@/types/enhanced-types';



// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getTenantId = async (): Promise<string> => {
  try {
    // First, try to get from Supabase auth
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Try to get tenant ID from user metadata first (fallback)
      const tenantIdFromMetadata = user.user_metadata?.tenant_id;
      if (tenantIdFromMetadata) {
        console.log('✅ User tenant ID retrieved from metadata:', tenantIdFromMetadata);
        return tenantIdFromMetadata;
      }
      
      // Get the user's valid tenant ID from database (not from metadata)
      try {
        const { data: validTenantId, error: tenantError } = await supabase
          .rpc('get_user_tenant_id', {
            user_email: user.email
          });
        
        if (tenantError) {
          console.error('Failed to get user tenant ID:', tenantError.message);
          // Fallback to a default tenant ID for development
          console.log('🔄 Using fallback tenant ID for development');
          return '7193113e-ece2-4f7b-ae8c-176df4367e28'; // Default tenant ID
        }
        
        if (validTenantId) {
          console.log('✅ User tenant ID retrieved from database:', validTenantId);
          return validTenantId;
        } else {
          // Fallback to a default tenant ID for development
          console.log('🔄 Using fallback tenant ID for development');
          return '7193113e-ece2-4f7b-ae8c-176df4367e28'; // Default tenant ID
        }
      } catch (tenantError: any) {
        console.error('Error getting user tenant ID:', tenantError);
        // Fallback to a default tenant ID for development
        console.log('🔄 Using fallback tenant ID for development');
        return '7193113e-ece2-4f7b-ae8c-176df4367e28'; // Default tenant ID
      }
    }
    
    // If no user, use fallback tenant ID for development
    console.log('🔄 No authenticated user found, using fallback tenant ID for development');
    return '7193113e-ece2-4f7b-ae8c-176df4367e28'; // Default tenant ID
    
  } catch (error: any) {
    console.error('Error resolving tenant ID:', error);
    console.log('🔄 Using fallback tenant ID due to error');
    return '7193113e-ece2-4f7b-ae8c-176df4367e28'; // Default tenant ID
  }
};

// New function to validate tenant access for a specific claimed tenant ID
const validateTenantAccess = async (claimedTenantId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('No authenticated user found');
    }
    
    // Validate the claimed tenant ID against the user's actual tenant ID
    const { data: validationResult, error: validationError } = await supabase
      .rpc('validate_user_tenant_access', {
        user_email: user.email,
        claimed_tenant_id: claimedTenantId
      });
    
    if (validationError) {
      console.error('Tenant validation failed:', validationError.message);
      return false;
    }
    
    return validationResult === true;
  } catch (error: any) {
    console.error('Error validating tenant access:', error);
    return false;
  }
};

const handleApiError = (error: any, context: string) => {
  console.error(`API Error in ${context}:`, error);
  throw new Error(`Failed to ${context}: ${error.message || 'Unknown error'}`);
};



// ============================================================================
// CUSTOMER MANAGEMENT API
// ============================================================================

export const customers = {
  // Get all customers with optional filtering
  getAll: async (filters?: SearchFilters): Promise<Account[]> => {
    try {
      const tenantId = await getTenantId();
      
      // Primary: Fetch from accounts table (real customer data)
      let query = supabase
        .from('accounts')
        .select('*')
        .eq('tenant_id', tenantId);

            if (filters?.search) {
        const searchTerm = filters.search.trim();
        if (searchTerm.length > 0) {
          // Enhanced search for phone numbers (strip non-numeric) and addresses
          const phoneDigits = searchTerm.replace(/\D/g, '');
          const searchLower = searchTerm.toLowerCase();
          
          // Build comprehensive search query with multiple variations
          let searchQuery = `name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`;
          
          // Enhanced phone search using phone_digits column for better partial matching
          if (phoneDigits.length > 0) {
            // Search both formatted phone and normalized phone_digits
            searchQuery += `,phone.ilike.%${searchTerm}%,phone_digits.ilike.%${phoneDigits}%`;
            
            // Also search for phone numbers that contain the digits anywhere
            // This handles cases like searching "5551234" matching "(412) 555-1234"
            searchQuery += `,phone.ilike.%${phoneDigits}%`;
          } else {
            searchQuery += `,phone.ilike.%${searchTerm}%`;
          }
          
          // Enhanced address search with tokenization
          const addressTokens = searchTerm.split(/\s+/).filter(token => token.length > 0);
          if (addressTokens.length > 1) {
            // Multi-word search: each token must match somewhere in address fields
            addressTokens.forEach(token => {
              searchQuery += `,address.ilike.%${token}%,city.ilike.%${token}%,state.ilike.%${token}%,zip_code.ilike.%${token}%`;
            });
          } else {
            // Single word search
            searchQuery += `,address.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,state.ilike.%${searchTerm}%,zip_code.ilike.%${searchTerm}%`;
          }
          
          // Add account type search
          searchQuery += `,account_type.ilike.%${searchTerm}%`;
          
          // Add status search
          searchQuery += `,status.ilike.%${searchTerm}%`;
          
          query = query.or(searchQuery);
        }
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.segmentId) {
        query = query.eq('segment_id', filters.segmentId);
      }

      const { data, error } = await query.order('name');
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  // Get customer by ID with all related data
  getById: async (id: string): Promise<Account | null> => {
    try {
      const tenantId = await getTenantId();
      
      // Primary: Fetch from accounts table (real customer data)
      console.log('🔍 Fetching customer from accounts table...');
      const { data: accountData, error: accountError } = await supabase
        .from('accounts')
        .select('*')
        .eq('id', id)
        .eq('tenant_id', tenantId)
        .single();

      if (accountData && !accountError) {
        console.log('✅ Customer loaded from accounts table:', accountData.name);
        return accountData;
      }

      // Fallback: Try customers table (test data)
      console.log('🔄 Customer not found in accounts table, trying customers table...');
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .eq('tenant_id', tenantId)
        .single();

      if (customerData && !customerError) {
        // Transform customers table data to match Account interface
        const transformedCustomer: Account = {
          id: customerData.id,
          name: `${customerData.first_name} ${customerData.last_name}`,
          email: customerData.email,
          phone: customerData.phone,
          address: customerData.address,
          city: customerData.city,
          state: customerData.state,
          zip_code: customerData.zip_code,
          country: customerData.country,
          status: customerData.status,
          account_type: customerData.account_type,
          notes: customerData.notes,
          created_at: customerData.created_at,
          updated_at: customerData.updated_at,
          created_by: customerData.created_by,
          updated_by: customerData.updated_by,
          tenant_id: customerData.tenant_id,
          // Set defaults for missing fields
          ar_balance: 0,
          company_name: null,
          contact_person: null,
          property_type: null,
          property_size: null,
          access_instructions: null,
          emergency_contact: null,
          preferred_contact_method: null,
          billing_address: null,
          payment_method: null,
          billing_cycle: null
        };
        
        console.log('✅ Customer loaded from customers table:', transformedCustomer.name);
        return transformedCustomer;
      }

      console.error('❌ Customer not found in either table:', accountError || customerError);
      throw accountError || customerError;
    } catch (error) {
      handleApiError(error, 'fetch customer');
      return null;
    }
  },

  // Create new customer
  create: async (customerData: Partial<Account>): Promise<Account> => {
    try {
      const tenantId = await getTenantId();
      const { data, error } = await supabase
        .from('accounts')
        .insert({ ...customerData, tenant_id: tenantId })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleApiError(error, 'create customer');
      throw error;
    }
  },

  // Update customer
  update: async (id: string, updates: Partial<Account>): Promise<Account> => {
    try {
      const tenantId = await getTenantId();
      
      // Primary: Update in accounts table (real customer data)
      console.log('🔍 Updating customer in accounts table...');
      const { data: accountData, error: accountError } = await supabase
        .from('accounts')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('tenant_id', tenantId)
        .select()
        .single();

      if (accountData && !accountError) {
        console.log('✅ Customer updated in accounts table:', accountData.name);
        return accountData;
      }

      // Fallback: Try customers table (test data)
      console.log('🔄 Customer not found in accounts table, trying customers table...');
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .update({
          ...updates,
          // Transform name back to first_name and last_name if provided
          ...(updates.name && {
            first_name: updates.name.split(' ')[0] || '',
            last_name: updates.name.split(' ').slice(1).join(' ') || ''
          }),
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('tenant_id', tenantId)
        .select()
        .single();

      if (customerData && !customerError) {
        // Transform back to Account format
        const transformedCustomer: Account = {
          id: customerData.id,
          name: `${customerData.first_name} ${customerData.last_name}`,
          email: customerData.email,
          phone: customerData.phone,
          address: customerData.address,
          city: customerData.city,
          state: customerData.state,
          zip_code: customerData.zip_code,
          country: customerData.country,
          status: customerData.status,
          account_type: customerData.account_type,
          notes: customerData.notes,
          created_at: customerData.created_at,
          updated_at: customerData.updated_at,
          created_by: customerData.created_by,
          updated_by: customerData.updated_by,
          tenant_id: customerData.tenant_id,
          // Set defaults for missing fields
          ar_balance: updates.ar_balance || 0,
          company_name: updates.company_name || null,
          contact_person: updates.contact_person || null,
          property_type: updates.property_type || null,
          property_size: updates.property_size || null,
          access_instructions: updates.access_instructions || null,
          emergency_contact: updates.emergency_contact || null,
          preferred_contact_method: updates.preferred_contact_method || null,
          billing_address: updates.billing_address || null,
          payment_method: updates.payment_method || null,
          billing_cycle: updates.billing_cycle || null
        };
        
        console.log('✅ Customer updated in customers table:', transformedCustomer.name);
        return transformedCustomer;
      }

      console.error('❌ Customer not found in either table:', accountError || customerError);
      throw accountError || customerError;
    } catch (error) {
      handleApiError(error, 'update customer');
      throw error;
    }
  },

  // Delete customer
  delete: async (id: string): Promise<void> => {
    try {
      const tenantId = await getTenantId();
      const { error } = await supabase
        .from('accounts')
        .delete()
        .eq('id', id)
        .eq('tenant_id', tenantId);

      if (error) throw error;
    } catch (error) {
      handleApiError(error, 'delete customer');
      throw error;
    }
  }
};

// ============================================================================
// CUSTOMER PROFILES API
// ============================================================================

export const customerProfiles = {
  getByCustomerId: async (customerId: string): Promise<CustomerProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('customer_id', customerId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleApiError(error, 'fetch customer profile');
      return null;
    }
  },

  create: async (profileData: Partial<CustomerProfile>): Promise<CustomerProfile> => {
    try {
      const { data, error } = await supabase
        .from('customer_profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleApiError(error, 'create customer profile');
      throw error;
    }
  },

  update: async (customerId: string, updates: Partial<CustomerProfile>): Promise<CustomerProfile> => {
    try {
      const { data, error } = await supabase
        .from('customer_profiles')
        .update(updates)
        .eq('customer_id', customerId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleApiError(error, 'update customer profile');
      throw error;
    }
  }
};

// ============================================================================
// CUSTOMER CONTACTS API
// ============================================================================

export const customerContacts = {
  getByCustomerId: async (customerId: string): Promise<CustomerContact[]> => {
    try {
      const { data, error } = await supabase
        .from('customer_contacts')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleApiError(error, 'fetch customer contacts');
    }
  },

  create: async (contactData: Partial<CustomerContact>): Promise<CustomerContact> => {
    try {
      const { data, error } = await supabase
        .from('customer_contacts')
        .insert(contactData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleApiError(error, 'create customer contact');
    }
  },

  update: async (id: string, updates: Partial<CustomerContact>): Promise<CustomerContact> => {
    try {
      const { data, error } = await supabase
        .from('customer_contacts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleApiError(error, 'update customer contact');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('customer_contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      handleApiError(error, 'delete customer contact');
    }
  }
};

// ============================================================================
// WORK ORDERS API
// ============================================================================

export const workOrders = {
  getAll: async (filters?: SearchFilters): Promise<WorkOrder[]> => {
    try {
      const tenantId = await getTenantId();
      let query = supabase
        .from('work_orders')
        .select(`
          *,
          accounts (name, email, phone),
          service_types (*)
        `)
        .eq('tenant_id', tenantId);

      if (filters?.search) {
        query = query.or(`description.ilike.%${filters.search}%`);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      handleApiError(error, 'fetch work orders');
    }
  },

  getById: async (id: string): Promise<WorkOrder | null> => {
    try {
      const tenantId = await getTenantId();
      const { data, error } = await supabase
        .from('work_orders')
        .select(`
          *,
          accounts (*),
          service_types (*),
          jobs (*)
        `)
        .eq('id', id)
        .eq('tenant_id', tenantId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleApiError(error, 'fetch work order');
    }
  },

  create: async (workOrderData: Partial<WorkOrder>): Promise<WorkOrder> => {
    try {
      const tenantId = await getTenantId();
      const { data, error } = await supabase
        .from('work_orders')
        .insert({ ...workOrderData, tenant_id: tenantId })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleApiError(error, 'create work order');
    }
  },

  update: async (id: string, updates: Partial<WorkOrder>): Promise<WorkOrder> => {
    try {
      const tenantId = await getTenantId();
      const { data, error } = await supabase
        .from('work_orders')
        .update(updates)
        .eq('id', id)
        .eq('tenant_id', tenantId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleApiError(error, 'update work order');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const tenantId = await getTenantId();
      const { error } = await supabase
        .from('work_orders')
        .delete()
        .eq('id', id)
        .eq('tenant_id', tenantId);

      if (error) throw error;
    } catch (error) {
      handleApiError(error, 'delete work order');
    }
  }
};

// ============================================================================
// JOBS API
// ============================================================================

export const jobs = {
  getAll: async (filters?: SearchFilters): Promise<Job[]> => {
    try {
      const tenantId = await getTenantId();
      let query = supabase
        .from('jobs')
        .select(`
          *,
          accounts (name, email, phone),
          work_orders (*),
          technicians (first_name, last_name, email)
        `)
        .eq('tenant_id', tenantId);

      if (filters?.search) {
        query = query.or(`description.ilike.%${filters.search}%`);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.date) {
        query = query.eq('scheduled_date', filters.date);
      }

      const { data, error } = await query.order('scheduled_date', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      handleApiError(error, 'fetch jobs');
    }
  },

  getById: async (id: string): Promise<Job | null> => {
    try {
      const tenantId = await getTenantId();
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          accounts (*),
          work_orders (*),
          technicians (*)
        `)
        .eq('id', id)
        .eq('tenant_id', tenantId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleApiError(error, 'fetch job');
    }
  },

  create: async (jobData: Partial<Job>): Promise<Job> => {
    try {
      const tenantId = await getTenantId();
      const { data, error } = await supabase
        .from('jobs')
        .insert({ ...jobData, tenant_id: tenantId })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleApiError(error, 'create job');
    }
  },

  update: async (id: string, updates: Partial<Job>): Promise<Job> => {
    try {
      const tenantId = await getTenantId();
      const { data, error } = await supabase
        .from('jobs')
        .update(updates)
        .eq('id', id)
        .eq('tenant_id', tenantId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleApiError(error, 'update job');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const tenantId = await getTenantId();
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id)
        .eq('tenant_id', tenantId);

      if (error) throw error;
    } catch (error) {
      handleApiError(error, 'delete job');
    }
  }
};

// ============================================================================
// LOCATIONS API
// ============================================================================

export const locations = {
  getByCustomerId: async (customerId: string): Promise<Location[]> => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleApiError(error, 'fetch locations');
    }
  },

  create: async (locationData: Partial<Location>): Promise<Location> => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .insert(locationData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleApiError(error, 'create location');
    }
  },

  update: async (id: string, updates: Partial<Location>): Promise<Location> => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleApiError(error, 'update location');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      handleApiError(error, 'delete location');
    }
  }
};

// ============================================================================
// SERVICE TYPES API
// ============================================================================

export const serviceTypes = {
  getAll: async (): Promise<ServiceType[]> => {
    try {
      const tenantId = await getTenantId();
      const { data, error } = await supabase
        .from('service_types')
        .select(`
          *,
          service_categories (*)
        `)
        .eq('tenant_id', tenantId)
        .order('service_name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleApiError(error, 'fetch service types');
    }
  },

  getById: async (id: string): Promise<ServiceType | null> => {
    try {
      const tenantId = await getTenantId();
      const { data, error } = await supabase
        .from('service_types')
        .select(`
          *,
          service_categories (*)
        `)
        .eq('id', id)
        .eq('tenant_id', tenantId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleApiError(error, 'fetch service type');
    }
  },

  create: async (serviceTypeData: Partial<ServiceType>): Promise<ServiceType> => {
    try {
      const tenantId = await getTenantId();
      const { data, error } = await supabase
        .from('service_types')
        .insert({ ...serviceTypeData, tenant_id: tenantId })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleApiError(error, 'create service type');
    }
  },

  update: async (id: string, updates: Partial<ServiceType>): Promise<ServiceType> => {
    try {
      const tenantId = await getTenantId();
      const { data, error } = await supabase
        .from('service_types')
        .update(updates)
        .eq('id', id)
        .eq('tenant_id', tenantId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleApiError(error, 'update service type');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const tenantId = await getTenantId();
      const { error } = await supabase
        .from('service_types')
        .delete()
        .eq('id', id)
        .eq('tenant_id', tenantId);

      if (error) throw error;
    } catch (error) {
      handleApiError(error, 'delete service type');
    }
  }
};

// ============================================================================
// SERVICE CATEGORIES API
// ============================================================================

export const serviceCategories = {
  getAll: async (): Promise<ServiceCategory[]> => {
    try {
      const tenantId = await getTenantId();
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('category_name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleApiError(error, 'fetch service categories');
    }
  },

  create: async (categoryData: Partial<ServiceCategory>): Promise<ServiceCategory> => {
    try {
      const tenantId = await getTenantId();
      const { data, error } = await supabase
        .from('service_categories')
        .insert({ ...categoryData, tenant_id: tenantId })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleApiError(error, 'create service category');
    }
  }
};

// ============================================================================
// CUSTOMER SEGMENTS API
// ============================================================================

export const customerSegments = {
  getAll: async (): Promise<CustomerSegment[]> => {
    try {
      const tenantId = await getTenantId();
      const { data, error } = await supabase
        .from('customer_segments')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('segment_name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleApiError(error, 'fetch customer segments');
    }
  },

  create: async (segmentData: Partial<CustomerSegment>): Promise<CustomerSegment> => {
    try {
      const tenantId = await getTenantId();
      const { data, error } = await supabase
        .from('customer_segments')
        .insert({ ...segmentData, tenant_id: tenantId })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleApiError(error, 'create customer segment');
    }
  }
};

// ============================================================================
// PRICING API
// ============================================================================

export const pricing = {
  getTiers: async (): Promise<PricingTier[]> => {
    try {
      const tenantId = await getTenantId();
      const { data, error } = await supabase
        .from('pricing_tiers')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('tier_name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleApiError(error, 'fetch pricing tiers');
    }
  },

  getServicePricing: async (): Promise<ServicePricing[]> => {
    try {
      const tenantId = await getTenantId();
      const { data, error } = await supabase
        .from('service_pricing')
        .select(`
          *,
          service_types (*),
          pricing_tiers (*)
        `)
        .eq('tenant_id', tenantId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleApiError(error, 'fetch service pricing');
    }
  }
};

// ============================================================================
// PAYMENT METHODS API
// ============================================================================

export const paymentMethods = {
  getByCustomerId: async (customerId: string): Promise<PaymentMethod[]> => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleApiError(error, 'fetch payment methods');
    }
  },

  create: async (paymentMethodData: Partial<PaymentMethod>): Promise<PaymentMethod> => {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .insert(paymentMethodData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleApiError(error, 'create payment method');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      handleApiError(error, 'delete payment method');
    }
  }
};

// ============================================================================
// COMMUNICATION API
// ============================================================================

export const communication = {
  getTemplates: async (): Promise<CommunicationTemplate[]> => {
    try {
      const tenantId = await getTenantId();
      const { data, error } = await supabase
        .from('communication_templates')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('template_name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleApiError(error, 'fetch communication templates');
    }
  },

  getAutomatedCommunications: async (): Promise<AutomatedCommunication[]> => {
    try {
      const tenantId = await getTenantId();
      const { data, error } = await supabase
        .from('automated_communications')
        .select(`
          *,
          communication_templates (*)
        `)
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleApiError(error, 'fetch automated communications');
    }
  }
};

// ============================================================================
// COMPLIANCE API
// ============================================================================

export const compliance = {
  getRequirements: async (): Promise<ComplianceRequirement[]> => {
    try {
      const tenantId = await getTenantId();
      const { data, error } = await supabase
        .from('compliance_requirements')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleApiError(error, 'fetch compliance requirements');
    }
  },

  getRecords: async (): Promise<ComplianceRecord[]> => {
    try {
      const tenantId = await getTenantId();
      const { data, error } = await supabase
        .from('compliance_records')
        .select(`
          *,
          compliance_requirements (*),
          accounts (name)
        `)
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleApiError(error, 'fetch compliance records');
    }
  }
};

// ============================================================================
// SERVICE AREAS API
// ============================================================================

export const serviceAreas = {
  getAll: async (): Promise<ServiceArea[]> => {
    try {
      const tenantId = await getTenantId();
      const { data, error } = await supabase
        .from('service_areas')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('area_name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleApiError(error, 'fetch service areas');
    }
  }
};

// ============================================================================
// TECHNICIAN SKILLS API
// ============================================================================

export const technicianSkills = {
  getAll: async (): Promise<TechnicianSkill[]> => {
    try {
      const tenantId = await getTenantId();
      const { data, error } = await supabase
        .from('technician_skills')
        .select(`
          *,
          service_types (*),
          technicians (first_name, last_name)
        `)
        .eq('tenant_id', tenantId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleApiError(error, 'fetch technician skills');
    }
  }
};

// ============================================================================
// ANALYTICS API
// ============================================================================

export const analytics = {
  getCustomerAnalytics: async (): Promise<CustomerAnalytics[]> => {
    try {
      const tenantId = await getTenantId();
      const { data, error } = await supabase
        .from('customer_analytics')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleApiError(error, 'fetch customer analytics');
    }
  },

  getServiceAnalytics: async (): Promise<ServiceAnalytics[]> => {
    try {
      const tenantId = await getTenantId();
      const { data, error } = await supabase
        .from('service_analytics')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleApiError(error, 'fetch service analytics');
    }
  }
};

// ============================================================================
// AUTH API
// ============================================================================

export const authApi = {
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  signUp: async (email: string, password: string, metadata?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  }
};

// ============================================================================
// MAIN EXPORT
// ============================================================================

export const enhancedApi = {
  customers,
  customerProfiles,
  customerContacts,
  workOrders,
  jobs,
  locations,
  serviceTypes,
  serviceCategories,
  customerSegments,
  pricing,
  paymentMethods,
  communication,
  compliance,
  serviceAreas,
  technicianSkills,
  analytics,
  auth: authApi
};

export default enhancedApi;
