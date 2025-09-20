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
  SearchFilters,
  Invoice,
  Payment,
  CreateInvoiceDto,
  UpdateInvoiceDto,
  CreatePaymentDto,
  CreatePaymentMethodDto,
  BillingAnalytics,
  RevenueAnalytics
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
      // Only include columns that exist in Supabase 'accounts' schema
      const allowedAccountColumns = [
        'name', 'email', 'phone', 'address', 'city', 'state', 'zip_code',
        'country', 'status', 'account_type', 'notes', 'ar_balance',
        'company_name', 'contact_person'
      ] as const;
      const filteredAccountUpdates: Record<string, any> = {};
      Object.entries(updates || {}).forEach(([key, value]) => {
        if ((allowedAccountColumns as readonly string[]).includes(key)) {
          filteredAccountUpdates[key] = value;
        }
      });
      // Always touch updated_at when updating accounts
      filteredAccountUpdates.updated_at = new Date().toISOString();

      const { data: accountData, error: accountError } = await supabase
        .from('accounts')
        .update(filteredAccountUpdates)
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
      const allowedCustomerColumns = [
        'first_name', 'last_name', 'email', 'phone', 'address', 'city', 'state',
        'zip_code', 'country', 'status', 'account_type', 'notes'
      ] as const;
      const filteredCustomerUpdates: Record<string, any> = {};
      Object.entries(updates || {}).forEach(([key, value]) => {
        if ((allowedCustomerColumns as readonly string[]).includes(key)) {
          filteredCustomerUpdates[key] = value;
        }
      });

      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .update({
          ...filteredCustomerUpdates,
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

  // Dashboard Customer Experience APIs
  getExperienceMetrics: async (): Promise<any> => {
    try {
      const tenantId = await getTenantId();
      
      // Get customer metrics from database
      const { data: customers, error: customersError } = await supabase
        .from('accounts')
        .select('id, status, created_at')
        .eq('tenant_id', tenantId);

      if (customersError) throw customersError;

      // Get satisfaction scores from feedback/surveys (placeholder for now)
      const totalCustomers = customers?.length || 0;
      const activeCustomers = customers?.filter(c => c.status === 'active').length || 0;
      
      // Calculate retention rate (active customers / total customers)
      const retentionRate = totalCustomers > 0 ? (activeCustomers / totalCustomers) * 100 : 0;

      // TODO: Replace with actual data when feedback/survey tables are implemented
      return {
        totalCustomers,
        satisfactionScore: 4.5, // Placeholder - should come from actual feedback data
        responseTime: '2.3 hours', // Placeholder - should come from support tickets
        retentionRate: retentionRate.toFixed(1),
        complaints: 0, // Placeholder - should come from actual complaint data
        testimonials: 0 // Placeholder - should come from actual testimonial data
      };
    } catch (error) {
      handleApiError(error, 'fetch customer experience metrics');
      return {
        totalCustomers: 0,
        satisfactionScore: 0,
        responseTime: '0 hours',
        retentionRate: 0,
        complaints: 0,
        testimonials: 0
      };
    }
  },

  getRecentFeedback: async (): Promise<any[]> => {
    try {
      const tenantId = await getTenantId();
      
      // TODO: Replace with actual feedback table when implemented
      // For now, return empty array until feedback system is built
      return [];
      
      // Future implementation would look like:
      // const { data, error } = await supabase
      //   .from('customer_feedback')
      //   .select('*')
      //   .eq('tenant_id', tenantId)
      //   .order('created_at', { ascending: false })
      //   .limit(10);
      //
      // if (error) throw error;
      // return data || [];
    } catch (error) {
      handleApiError(error, 'fetch recent customer feedback');
      return [];
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

  getByCustomerId: async (customerId: string): Promise<WorkOrder[]> => {
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
        .eq('tenant_id', tenantId)
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as any) || [];
    } catch (error) {
      handleApiError(error, 'fetch work orders by customer');
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

  getByCustomerId: async (customerId: string): Promise<Job[]> => {
    try {
      const tenantId = await getTenantId();
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          accounts (name, email, phone),
          work_orders (*),
          technicians (first_name, last_name, email)
        `)
        .eq('tenant_id', tenantId)
        .eq('account_id', customerId)
        .order('scheduled_date', { ascending: false });

      if (error) throw error;
      return (data as any) || [];
    } catch (error) {
      handleApiError(error, 'fetch jobs by customer');
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
    // Use backend API instead of Supabase
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }
    
    const data = await response.json();
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
    // Use backend API instead of Supabase
    const authData = localStorage.getItem('verosuite_auth');
    if (!authData) {
      throw new Error('No authentication token found');
    }
    
    let token;
    try {
      const parsed = JSON.parse(authData);
      token = parsed.token || parsed;
    } catch {
      token = authData;
    }
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch('http://localhost:3001/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get current user');
    }
    
    const data = await response.json();
    return data.user;
  },

  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  }
};

// ============================================================================
// COMPANY SETTINGS API
// ============================================================================

export const company = {
  // Get company settings
  getSettings: async () => {
    try {
      const authData = localStorage.getItem('verosuite_auth');
      if (!authData) throw new Error('User not authenticated');

      let token;
      try {
        const parsed = JSON.parse(authData);
        token = parsed.token || parsed;
      } catch {
        token = authData;
      }

      if (!token) throw new Error('No access token found');

      const response = await fetch(`http://localhost:3001/api/v1/company/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch company settings: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch company settings:', error);
      throw error;
    }
  },

  // Upload company logo with type
  uploadLogo: async (file: File, logoType: 'header' | 'invoice' = 'header') => {
    try {
      const authData = localStorage.getItem('verosuite_auth');
      if (!authData) throw new Error('User not authenticated');

      let token;
      try {
        const parsed = JSON.parse(authData);
        token = parsed.token || parsed;
      } catch {
        token = authData;
      }

      if (!token) throw new Error('No access token found');

      console.log(`📸 Uploading ${logoType} logo file:`, file.name, file.size, 'bytes');
      console.log('🔑 Using auth token for logo:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');

      const formData = new FormData();
      formData.append('logo', file);
      formData.append('logoType', logoType);

      const response = await fetch(`http://localhost:3001/api/v1/company/logo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Logo upload failed:', response.status, response.statusText);
        console.error('❌ Error details:', errorText);
        throw new Error(`Failed to upload logo: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to upload logo:', error);
      throw error;
    }
  },

  // Delete company logo
  deleteLogo: async (logoType: 'header' | 'invoice') => {
    try {
      const authData = localStorage.getItem('verosuite_auth');
      if (!authData) throw new Error('User not authenticated');

      let token;
      try {
        const parsed = JSON.parse(authData);
        token = parsed.token || parsed;
      } catch {
        token = authData;
      }

      if (!token) throw new Error('No access token found');

      console.log(`🗑️ Deleting ${logoType} logo`);
      console.log(`🌐 Making DELETE request to: http://localhost:3001/api/v1/company/logo/${logoType}`);
      console.log(`🔑 Using token: ${token ? token.substring(0, 20) + '...' : 'NO TOKEN'}`);

      const response = await fetch(`http://localhost:3001/api/v1/company/logo/${logoType}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(`📡 Delete response status: ${response.status}`);
      console.log(`📡 Delete response headers:`, response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Logo deletion failed:', response.status, response.statusText);
        console.error('❌ Error details:', errorText);
        throw new Error(`Failed to delete logo: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(`✅ Delete response data:`, result);
      return result;
    } catch (error) {
      console.error('Failed to delete logo:', error);
      throw error;
    }
  },

  // Update company settings
  updateSettings: async (settings: any) => {
    try {
      const authData = localStorage.getItem('verosuite_auth');
      if (!authData) throw new Error('User not authenticated');

      let token;
      try {
        const parsed = JSON.parse(authData);
        token = parsed.token || parsed;
      } catch {
        token = authData;
      }

      if (!token) throw new Error('No access token found');

      console.log('🔍 Sending company settings data:', settings);
      console.log('🔑 Using auth token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');

      const response = await fetch(`http://localhost:3001/api/v1/company/settings`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Server response:', response.status, response.statusText);
        console.error('❌ Error details:', errorText);
        throw new Error(`Failed to update company settings: ${response.statusText} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to update company settings:', error);
      throw error;
    }
  },
};

// BILLING API
// ============================================================================

export const billing = {
  // Invoice Management
  getInvoices: async (accountId?: string, status?: string): Promise<Invoice[]> => {
    try {
      const authData = localStorage.getItem('verosuite_auth');
      if (!authData) throw new Error('User not authenticated');

      let token;
      try {
        const parsed = JSON.parse(authData);
        token = parsed.token || parsed;
      } catch {
        token = authData;
      }

      if (!token) throw new Error('No access token found');

      const params = new URLSearchParams();
      if (accountId) params.append('accountId', accountId);
      if (status) params.append('status', status);

      const response = await fetch(`http://localhost:3001/api/v1/billing/invoices?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch invoices: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, 'fetch invoices');
      return [];
    }
  },

  getInvoiceById: async (id: string): Promise<Invoice | null> => {
    try {
      const authData = localStorage.getItem('verosuite_auth');
      if (!authData) throw new Error('User not authenticated');

      let token;
      try {
        const parsed = JSON.parse(authData);
        token = parsed.token || parsed;
      } catch {
        token = authData;
      }

      if (!token) throw new Error('No access token found');

      const response = await fetch(`http://localhost:3001/api/v1/billing/invoices/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Failed to fetch invoice: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, 'fetch invoice');
      return null;
    }
  },

  createInvoice: async (invoiceData: CreateInvoiceDto): Promise<Invoice> => {
    try {
      const authData = localStorage.getItem('verosuite_auth');
      if (!authData) throw new Error('User not authenticated');

      let token;
      try {
        const parsed = JSON.parse(authData);
        token = parsed.token || parsed;
      } catch {
        token = authData;
      }

      if (!token) throw new Error('No access token found');

      const response = await fetch('http://localhost:3001/api/v1/billing/invoices', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔥 Backend error response:', errorText);
        try {
          const errorData = JSON.parse(errorText);
          console.error('🔥 Parsed error data:', errorData);
          throw new Error(`Failed to create invoice: ${errorData.message || response.statusText}`);
        } catch {
          throw new Error(`Failed to create invoice: ${response.statusText} - ${errorText}`);
        }
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, 'create invoice');
      throw error;
    }
  },

  updateInvoice: async (id: string, updates: UpdateInvoiceDto): Promise<Invoice> => {
    try {
      const authData = localStorage.getItem('verosuite_auth');
      if (!authData) throw new Error('User not authenticated');

      let token;
      try {
        const parsed = JSON.parse(authData);
        token = parsed.token || parsed;
      } catch {
        token = authData;
      }

      if (!token) throw new Error('No access token found');

      const response = await fetch(`http://localhost:3001/api/v1/billing/invoices/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Failed to update invoice: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, 'update invoice');
      throw error;
    }
  },

  deleteInvoice: async (id: string): Promise<void> => {
    try {
      const authData = localStorage.getItem('verosuite_auth');
      if (!authData) throw new Error('User not authenticated');

      let token;
      try {
        const parsed = JSON.parse(authData);
        token = parsed.token || parsed;
      } catch {
        token = authData;
      }

      if (!token) throw new Error('No access token found');

      const response = await fetch(`http://localhost:3001/api/v1/billing/invoices/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete invoice: ${response.statusText}`);
      }
    } catch (error) {
      handleApiError(error, 'delete invoice');
      throw error;
    }
  },

  // Payment Management
  getPayments: async (invoiceId?: string): Promise<Payment[]> => {
    try {
      const authData = localStorage.getItem('verosuite_auth');
      if (!authData) throw new Error('User not authenticated');

      let token;
      try {
        const parsed = JSON.parse(authData);
        token = parsed.token || parsed;
      } catch {
        token = authData;
      }

      if (!token) throw new Error('No access token found');

      const params = new URLSearchParams();
      if (invoiceId) params.append('invoiceId', invoiceId);

      const response = await fetch(`http://localhost:3001/api/v1/billing/payments?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch payments: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, 'fetch payments');
      return [];
    }
  },

  processPayment: async (invoiceId: string, paymentData: CreatePaymentDto): Promise<Payment> => {
    try {
      const authData = localStorage.getItem('verosuite_auth');
      if (!authData) throw new Error('User not authenticated');

      let token;
      try {
        const parsed = JSON.parse(authData);
        token = parsed.token || parsed;
      } catch {
        token = authData;
      }

      if (!token) throw new Error('No access token found');

      const response = await fetch(`http://localhost:3001/api/v1/billing/invoices/${invoiceId}/pay`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error(`Failed to process payment: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, 'process payment');
      throw error;
    }
  },

  // Payment Method Management
  getPaymentMethods: async (accountId?: string): Promise<PaymentMethod[]> => {
    try {
      const authData = localStorage.getItem('verosuite_auth');
      if (!authData) throw new Error('User not authenticated');

      let token;
      try {
        const parsed = JSON.parse(authData);
        token = parsed.token || parsed;
      } catch {
        token = authData;
      }

      if (!token) throw new Error('No access token found');

      const params = new URLSearchParams();
      if (accountId) params.append('accountId', accountId);

      const response = await fetch(`http://localhost:3001/api/v1/billing/payment-methods?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch payment methods: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, 'fetch payment methods');
      return [];
    }
  },

  createPaymentMethod: async (paymentMethodData: CreatePaymentMethodDto): Promise<PaymentMethod> => {
    try {
      const authData = localStorage.getItem('verosuite_auth');
      if (!authData) throw new Error('User not authenticated');

      let token;
      try {
        const parsed = JSON.parse(authData);
        token = parsed.token || parsed;
      } catch {
        token = authData;
      }

      if (!token) throw new Error('No access token found');

      const response = await fetch('http://localhost:3001/api/v1/billing/payment-methods', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentMethodData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create payment method: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, 'create payment method');
      throw error;
    }
  },

  deletePaymentMethod: async (id: string): Promise<void> => {
    try {
      const authData = localStorage.getItem('verosuite_auth');
      if (!authData) throw new Error('User not authenticated');

      let token;
      try {
        const parsed = JSON.parse(authData);
        token = parsed.token || parsed;
      } catch {
        token = authData;
      }

      if (!token) throw new Error('No access token found');

      const response = await fetch(`http://localhost:3001/api/v1/billing/payment-methods/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete payment method: ${response.statusText}`);
      }
    } catch (error) {
      handleApiError(error, 'delete payment method');
      throw error;
    }
  },

  // Billing Analytics
  getBillingAnalytics: async (): Promise<BillingAnalytics> => {
    try {
      const authData = localStorage.getItem('verosuite_auth');
      if (!authData) throw new Error('User not authenticated');

      let token;
      try {
        const parsed = JSON.parse(authData);
        token = parsed.token || parsed;
      } catch {
        token = authData;
      }

      if (!token) throw new Error('No access token found');

      const response = await fetch('http://localhost:3001/api/v1/billing/analytics/overview', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch billing analytics: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, 'fetch billing analytics');
      return {
        totalRevenue: 0,
        outstandingAmount: 0,
        paidAmount: 0,
        totalInvoices: 0,
        overdueInvoices: 0,
        averagePaymentTime: 0,
      };
    }
  },

  getRevenueAnalytics: async (startDate?: string, endDate?: string): Promise<RevenueAnalytics> => {
    try {
      const authData = localStorage.getItem('verosuite_auth');
      if (!authData) throw new Error('User not authenticated');

      let token;
      try {
        const parsed = JSON.parse(authData);
        token = parsed.token || parsed;
      } catch {
        token = authData;
      }

      if (!token) throw new Error('No access token found');

      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`http://localhost:3001/api/v1/billing/analytics/revenue?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch revenue analytics: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, 'fetch revenue analytics');
      return {
        monthlyRevenue: [],
        totalRevenue: 0,
        growthRate: 0,
      };
    }
  },

  // Stripe Payment Integration
  createStripePaymentIntent: async (invoiceId: string): Promise<any> => {
    try {
      const authData = localStorage.getItem('verosuite_auth');
      if (!authData) throw new Error('User not authenticated');

      let token;
      try {
        const parsed = JSON.parse(authData);
        token = parsed.token || parsed;
      } catch {
        token = authData;
      }

      if (!token) throw new Error('No access token found');

      const response = await fetch(`http://localhost:3001/api/v1/billing/invoices/${invoiceId}/stripe-payment-intent`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to create payment intent: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, 'create Stripe payment intent');
      throw error;
    }
  },

  getStripePaymentStatus: async (paymentIntentId: string): Promise<any> => {
    try {
      const authData = localStorage.getItem('verosuite_auth');
      if (!authData) throw new Error('User not authenticated');

      let token;
      try {
        const parsed = JSON.parse(authData);
        token = parsed.token || parsed;
      } catch {
        token = authData;
      }

      if (!token) throw new Error('No access token found');

      const response = await fetch(`http://localhost:3001/api/v1/billing/stripe/payment-status/${paymentIntentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get payment status: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, 'get Stripe payment status');
      throw error;
    }
  }
};

// ============================================================================
// INVENTORY API (Dashboard Components)
// ============================================================================

export const inventory = {
  getComplianceData: async (): Promise<any> => {
    try {
      // TODO: Replace with actual inventory data when inventory system is implemented
      return {
        totalItems: 0,
        lowStock: 0,
        outOfStock: 0,
        expiringSoon: 0,
        complianceRate: 0,
        safetyScore: 0
      };
    } catch (error) {
      handleApiError(error, 'fetch inventory compliance data');
      return {
        totalItems: 0,
        lowStock: 0,
        outOfStock: 0,
        expiringSoon: 0,
        complianceRate: 0,
        safetyScore: 0
      };
    }
  },

  getCategories: async (): Promise<any[]> => {
    try {
      // TODO: Replace with actual inventory categories when implemented
      return [];
    } catch (error) {
      handleApiError(error, 'fetch inventory categories');
      return [];
    }
  },

  getComplianceAlerts: async (): Promise<any[]> => {
    try {
      // TODO: Replace with actual compliance alerts when implemented
      return [];
    } catch (error) {
      handleApiError(error, 'fetch compliance alerts');
      return [];
    }
  },

  getRecentInspections: async (): Promise<any[]> => {
    try {
      // TODO: Replace with actual inspection data when implemented
      return [];
    } catch (error) {
      handleApiError(error, 'fetch recent inspections');
      return [];
    }
  }
};

// ============================================================================
// FINANCIAL API (Dashboard Components)
// ============================================================================

export const financial = {
  getSnapshot: async (): Promise<any> => {
    try {
      // TODO: Replace with actual financial data when implemented
      return {
        currentMonth: {
          revenue: 0,
          expenses: 0,
          profit: 0,
          jobsCompleted: 0,
          averageJobValue: 0,
          outstandingInvoices: 0
        },
        previousMonth: {
          revenue: 0,
          expenses: 0,
          profit: 0
        },
        yearly: {
          revenue: 0,
          expenses: 0,
          profit: 0
        }
      };
    } catch (error) {
      handleApiError(error, 'fetch financial snapshot');
      return {
        currentMonth: {
          revenue: 0,
          expenses: 0,
          profit: 0,
          jobsCompleted: 0,
          averageJobValue: 0,
          outstandingInvoices: 0
        },
        previousMonth: {
          revenue: 0,
          expenses: 0,
          profit: 0
        },
        yearly: {
          revenue: 0,
          expenses: 0,
          profit: 0
        }
      };
    }
  },

  getRevenueBreakdown: async (): Promise<any[]> => {
    try {
      // TODO: Replace with actual revenue breakdown when implemented
      return [];
    } catch (error) {
      handleApiError(error, 'fetch revenue breakdown');
      return [];
    }
  },

  getRecentTransactions: async (): Promise<any[]> => {
    try {
      // TODO: Replace with actual transaction data when implemented
      return [];
    } catch (error) {
      handleApiError(error, 'fetch recent transactions');
      return [];
    }
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
  billing,
  inventory,
  financial,
  company,
  auth: authApi
};

export default enhancedApi;
