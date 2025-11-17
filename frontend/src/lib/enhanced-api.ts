// ============================================================================
// ENHANCED API CLIENT - Comprehensive Pest Control Management System
// ============================================================================
// This file provides a unified API client for all database operations
// with multi-tenant support, type safety, and comprehensive error handling

import { supabase } from './supabase-client';
import { enhancedApiCall } from './api-utils';
import { logger } from '@/utils/logger';
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
  SearchFilters,
  Invoice,
  Payment,
  CreateInvoiceDto,
  UpdateInvoiceDto,
  CreatePaymentDto,
  CreatePaymentMethodDto,
  BillingAnalytics,
  RevenueAnalytics,
  ARSummary
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
        logger.debug('User tenant ID retrieved from metadata', { tenantId: tenantIdFromMetadata }, 'enhanced-api');
        return tenantIdFromMetadata;
      }
      
      // For development, use a default tenant ID since RPC function doesn't exist
      logger.debug('No authenticated user found, using fallback tenant ID for development', {}, 'enhanced-api');
      return '7193113e-ece2-4f7b-ae8c-176df4367e28'; // Default tenant ID
    }
    
    // If no user, use fallback tenant ID for development
    logger.debug('No authenticated user found, using fallback tenant ID for development', {}, 'enhanced-api');
    return '7193113e-ece2-4f7b-ae8c-176df4367e28'; // Default tenant ID
    
  } catch (error: unknown) {
    logger.error('Error resolving tenant ID', error, 'enhanced-api');
    logger.debug('Using fallback tenant ID due to error', {}, 'enhanced-api');
    return '7193113e-ece2-4f7b-ae8c-176df4367e28'; // Default tenant ID
  }
};

const getUserId = async (): Promise<string> => {
  try {
    // First, try to get from Supabase auth
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      logger.debug('User ID retrieved from auth', { userId: user.id }, 'enhanced-api');
      return user.id;
    }
    
    // Fallback: try to get from localStorage
    const authData = localStorage.getItem('verofield_auth');
    if (authData) {
      const parsed = JSON.parse(authData);
      if (parsed.user?.id) {
        logger.debug('User ID retrieved from localStorage', { userId: parsed.user.id }, 'enhanced-api');
        return parsed.user.id;
      }
    }
    
    throw new Error('No authenticated user found');
  } catch (error: unknown) {
    logger.error('Error getting user ID', error, 'enhanced-api');
    logger.debug('Using fallback user ID due to error', {}, 'enhanced-api');
    return '85b4bc59-650a-4fdf-beac-1dd2ba3066f4'; // Default user ID for development
  }
};

const getAuthToken = async (): Promise<string> => {
  try {
    // First, try to get backend token from localStorage (preferred for backend API)
    const authData = localStorage.getItem('verofield_auth');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        if (parsed.token) {
          if (process.env.NODE_ENV === 'development') {
            logger.debug('Auth token retrieved from localStorage (backend token)', {}, 'enhanced-api');
          }
          return parsed.token;
        }
      } catch (parseError) {
        // If parsing fails, try as direct token string
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Auth data is not JSON, trying as direct token', {}, 'enhanced-api');
        }
      }
    }
    
    // Fallback: try to get from Supabase auth (for Supabase-based auth)
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Auth token retrieved from Supabase session', {}, 'enhanced-api');
        }
        return session.access_token;
      }
    } catch (supabaseError) {
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Supabase session check failed', { error: supabaseError }, 'enhanced-api');
      }
    }
    
    // Additional fallback: try direct jwt key
    const jwtToken = localStorage.getItem('jwt');
    if (jwtToken) {
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Auth token retrieved from jwt key', {}, 'enhanced-api');
      }
      return jwtToken;
    }
    
    // If no token found, throw a more specific error
    const error = new Error('No authentication token found. Please log in again.');
    (error as any).isAuthError = true;
    throw error;
  } catch (error: unknown) {
    if ((error as any)?.isAuthError) {
      logger.warn('No auth token available - user may not be logged in', {}, 'enhanced-api');
      throw error;
    }
    logger.error('Error getting auth token', error, 'enhanced-api');
    throw new Error('Authentication required. Please log in again.');
  }
};

// New function to validate tenant access for a specific claimed tenant ID
const _validateTenantAccess = async (claimedTenantId: string): Promise<boolean> => {
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
      logger.error('Tenant validation failed', new Error(validationError.message), 'enhanced-api');
      return false;
    }
    
    return validationResult === true;
  } catch (error: unknown) {
    logger.error('Error validating tenant access', error, 'enhanced-api');
    return false;
  }
};

const handleApiError = (error: unknown, context: string) => {
  let errorMessage = 'Unknown error';
  let errorDetails: any = null;

  if (error && typeof error === 'object') {
    if ('response' in error) {
      const response = (error as any).response;
      errorMessage = response.statusText || `HTTP ${response.status}`;
      // Try to extract error details if available
      if (response._bodyInit) {
        try {
          const errorBody = JSON.parse(response._bodyInit);
          errorDetails = errorBody;
          if (errorBody.message) {
            if (Array.isArray(errorBody.message)) {
              errorMessage = errorBody.message.join(', ');
            } else {
              errorMessage = errorBody.message;
            }
          } else if (errorBody.error) {
            errorMessage = errorBody.error;
          }
        } catch {
          // If parsing fails, use status text
        }
      }
    } else if ('message' in error) {
      errorMessage = (error as any).message;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
    // Check if error has validation details from api-utils
    if ((error as any).details) {
      if (Array.isArray((error as any).details)) {
        errorDetails = (error as any).details;
        errorMessage = `${errorMessage}\n${errorDetails.join('\n')}`;
      } else if (typeof (error as any).details === 'object' && (error as any).details.errors) {
        // NestJS ValidationPipe format nested in details
        errorDetails = (error as any).details.errors;
        errorMessage = (error as any).details.message || errorMessage;
      }
    }
    // Check if error has response data attached
    if ((error as any).response?.data) {
      const responseData = (error as any).response.data;
      if (responseData.errors && Array.isArray(responseData.errors)) {
        errorDetails = responseData.errors;
        errorMessage = responseData.message || errorMessage;
      } else if (responseData.message) {
        errorMessage = Array.isArray(responseData.message) 
          ? responseData.message.join(', ')
          : responseData.message;
      }
    }
  }

  // Combine message and details for full error message
  let fullMessage = errorMessage;
  if (errorDetails && Array.isArray(errorDetails) && errorDetails.length > 0) {
    fullMessage = `${errorMessage}\n\nValidation errors:\n${errorDetails.map((e, i) => `  ${i + 1}. ${e}`).join('\n')}`;
  }

  logger.error(`API Error in ${context}`, { 
    error, 
    details: errorDetails, 
    message: errorMessage,
    fullMessage,
    responseData: error?.response?.data 
  }, 'enhanced-api');
  
  // Create error with validation details if available
  const finalError = new Error(`Failed to ${context}: ${fullMessage}`);
  if (errorDetails) {
    (finalError as any).validationErrors = errorDetails;
  }
  throw finalError;
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
          const _searchLower = searchTerm.toLowerCase();
          
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
    } catch (error: unknown) {
      logger.error('Error fetching customers', error, 'enhanced-api');
      throw error;
    }
  },

  // Get customer by ID with all related data
  getById: async (id: string): Promise<Account | null> => {
    try {
      const tenantId = await getTenantId();
      
      // Primary: Fetch from accounts table (real customer data)
      logger.debug('Fetching customer from accounts table', { customerId: id }, 'enhanced-api');
      const { data: accountData, error: accountError } = await supabase
        .from('accounts')
        .select('*')
        .eq('id', id)
        .eq('tenant_id', tenantId)
        .single();

      if (accountData && !accountError) {
        logger.debug('Customer loaded from accounts table', { customerName: accountData.name }, 'enhanced-api');
        return accountData;
      }

      // Fallback: Try customers table (test data)
      logger.debug('Customer not found in accounts table, trying customers table', { customerId: id }, 'enhanced-api');
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
        
        logger.debug('Customer loaded from customers table', { customerName: transformedCustomer.name }, 'enhanced-api');
        return transformedCustomer;
      }

      logger.error('Customer not found in either table', accountError || customerError, 'enhanced-api');
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
      logger.debug('Updating customer in accounts table', { customerId: id }, 'enhanced-api');
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
        logger.debug('Customer updated in accounts table', { customerName: accountData.name }, 'enhanced-api');
        return accountData;
      }

      // Fallback: Try customers table (test data)
      logger.debug('Customer not found in accounts table, trying customers table', { customerId: id }, 'enhanced-api');
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
        
        logger.debug('Customer updated in customers table', { customerName: transformedCustomer.name }, 'enhanced-api');
        return transformedCustomer;
      }

      logger.error('Customer not found in either table', accountError || customerError, 'enhanced-api');
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

  getByDateRange: async (startDate: string, endDate: string): Promise<Job[]> => {
    try {
      const tenantId = await getTenantId();
      logger.debug('Jobs API Debug', { tenantId, startDate, endDate }, 'enhanced-api');
      
      // First, try a simple query to check if jobs table exists
      const { data: testData, error: testError } = await supabase
        .from('jobs')
        .select('id')
        .limit(1);

      if (testError) {
        logger.error('Jobs table test failed', testError, 'enhanced-api');
        // If jobs table doesn't exist, return empty array instead of throwing error
        if (testError.code === 'PGRST116' || testError.message?.includes('relation "jobs" does not exist')) {
          logger.warn('Jobs table does not exist, returning empty array', {}, 'enhanced-api');
          return [];
        }
        throw testError;
      }

      logger.debug('Jobs table exists, proceeding with full query', {}, 'enhanced-api');
      
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          accounts (name, email, phone),
          work_orders (*),
          technicians (first_name, last_name, email)
        `)
        .eq('tenant_id', tenantId)
        .gte('scheduled_date', startDate)
        .lte('scheduled_date', endDate)
        .order('scheduled_date', { ascending: true });

      logger.debug('Supabase Query Result', { hasData: !!data, hasError: !!error, dataCount: data?.length || 0 }, 'enhanced-api');
      
      if (error) {
        logger.error('Supabase Error Details', error, 'enhanced-api');
        throw error;
      }

      logger.debug('Jobs fetched successfully', { jobCount: data?.length || 0 }, 'enhanced-api');
      return data || [];
    } catch (error) {
      logger.error('Jobs API Error Details', error, 'enhanced-api');
      // Instead of throwing error, return empty array to prevent UI crashes
      logger.warn('Returning empty array due to error', {}, 'enhanced-api');
      return [];
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
  },

  /**
   * Check for scheduling conflicts before assigning a job
   * @param technicianId - Technician ID to check
   * @param scheduledDate - Date of the job (ISO string)
   * @param startTime - Start time (HH:mm format)
   * @param endTime - End time (HH:mm format)
   * @param excludeJobIds - Job IDs to exclude from conflict check (for rescheduling)
   * @returns Conflict detection result
   */
  checkConflicts: async (
    technicianId: string,
    scheduledDate: string,
    startTime: string,
    endTime: string,
    excludeJobIds?: string[]
  ): Promise<{
    has_conflicts: boolean;
    conflicts: Array<{
      type: 'time_overlap' | 'technician_double_booking' | 'location_conflict';
      severity: 'low' | 'medium' | 'high' | 'critical';
      description: string;
      conflicting_job_ids: string[];
      conflicting_jobs: Array<{
        id: string;
        scheduled_date: string;
        scheduled_start_time: string;
        scheduled_end_time: string;
        customer_name?: string;
        location_address?: string;
      }>;
    }>;
    can_proceed: boolean;
  }> => {
    try {
      const token = await getAuthToken();
      return await enhancedApiCall<{
        has_conflicts: boolean;
        conflicts: Array<{
          type: 'time_overlap' | 'technician_double_booking' | 'location_conflict';
          severity: 'low' | 'medium' | 'high' | 'critical';
          description: string;
          conflicting_job_ids: string[];
          conflicting_jobs: Array<{
            id: string;
            scheduled_date: string;
            scheduled_start_time: string;
            scheduled_end_time: string;
            customer_name?: string;
            location_address?: string;
          }>;
        }>;
        can_proceed: boolean;
      }>('/api/v1/jobs/check-conflicts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          technician_id: technicianId,
          scheduled_date: scheduledDate,
          scheduled_start_time: startTime,
          scheduled_end_time: endTime,
          exclude_job_ids: excludeJobIds || [],
        }),
      });
    } catch (error) {
      handleApiError(error, 'check job conflicts');
      throw error;
    }
  },

  // Recurring jobs
  recurring: {
    /**
     * Create a recurring job template
     */
    createTemplate: async (templateData: CreateRecurringJobTemplateDto): Promise<RecurringJobTemplate> => {
      try {
        const token = await getAuthToken();
        return await enhancedApiCall<RecurringJobTemplate>('/api/v1/jobs/recurring', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(templateData),
        });
      } catch (error) {
        handleApiError(error, 'create recurring job template');
        throw error;
      }
    },

    /**
     * Get all recurring job templates
     */
    list: async (activeOnly: boolean = false): Promise<RecurringJobTemplate[]> => {
      try {
        const token = await getAuthToken();
        const url = `/api/v1/jobs/recurring${activeOnly ? '?active_only=true' : ''}`;
        const data = await enhancedApiCall<RecurringJobTemplate[]>(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        return data || [];
      } catch (error) {
        handleApiError(error, 'list recurring job templates');
        return [];
      }
    },

    /**
     * Get a specific recurring job template
     */
    get: async (templateId: string): Promise<RecurringJobTemplate> => {
      try {
        const token = await getAuthToken();
        return await enhancedApiCall<RecurringJobTemplate>(`/api/v1/jobs/recurring/${templateId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        handleApiError(error, 'get recurring job template');
        throw error;
      }
    },

    /**
     * Update a recurring job template
     */
    update: async (templateId: string, updates: UpdateRecurringJobTemplateDto): Promise<RecurringJobTemplate> => {
      try {
        const token = await getAuthToken();
        return await enhancedApiCall<RecurringJobTemplate>(`/api/v1/jobs/recurring/${templateId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        });
      } catch (error) {
        handleApiError(error, 'update recurring job template');
        throw error;
      }
    },

    /**
     * Delete a recurring job template
     */
    delete: async (templateId: string, deleteAllJobs: boolean = false): Promise<void> => {
      try {
        const token = await getAuthToken();
        const url = `/api/v1/jobs/recurring/${templateId}${deleteAllJobs ? '?delete_all_jobs=true' : ''}`;
        await enhancedApiCall<void>(url, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        handleApiError(error, 'delete recurring job template');
        throw error;
      }
    },

    /**
     * Generate jobs from a recurring template
     */
    generate: async (
      templateId: string,
      generateUntil: string
    ): Promise<{ generated: number; skipped: number }> => {
      try {
        const token = await getAuthToken();
        return await enhancedApiCall<{ generated: number; skipped: number }>(
          `/api/v1/jobs/recurring/${templateId}/generate`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              generate_until: generateUntil,
              skip_existing: true,
            }),
          }
        );
      } catch (error) {
        handleApiError(error, 'generate recurring jobs');
        throw error;
      }
    },

    /**
     * Skip a single occurrence of a recurring job
     */
    skipOccurrence: async (jobId: string): Promise<void> => {
      try {
        const token = await getAuthToken();
        await enhancedApiCall<void>(`/api/v1/jobs/${jobId}/skip-recurrence`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        handleApiError(error, 'skip recurring job occurrence');
        throw error;
      }
    },
  },
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
    const response = await fetch('http://localhost:3001/api/v1/auth/login', {
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

  signUp: async (email: string, password: string, metadata?: Record<string, unknown>) => {
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
    const authData = localStorage.getItem('verofield_auth');
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
    
    const response = await fetch('http://localhost:3001/api/v1/auth/me', {
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
      const authData = localStorage.getItem('verofield_auth');
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
    } catch (error: unknown) {
      logger.error('Failed to fetch company settings', error, 'enhanced-api');
      throw error;
    }
  },

  // Upload company logo with type
  uploadLogo: async (file: File, logoType: 'header' | 'invoice' = 'header') => {
    try {
      const authData = localStorage.getItem('verofield_auth');
      if (!authData) throw new Error('User not authenticated');

      let token;
      try {
        const parsed = JSON.parse(authData);
        token = parsed.token || parsed;
      } catch {
        token = authData;
      }

      if (!token) throw new Error('No access token found');

      logger.debug(`Uploading ${logoType} logo file`, { fileName: file.name, fileSize: file.size }, 'enhanced-api');

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
        logger.error('Logo upload failed', new Error(`${response.status} ${response.statusText}: ${errorText}`), 'enhanced-api');
        throw new Error(`Failed to upload logo: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: unknown) {
      logger.error('Failed to upload logo', error, 'enhanced-api');
      throw error;
    }
  },

  // Delete company logo
  deleteLogo: async (logoType: 'header' | 'invoice') => {
    try {
      const authData = localStorage.getItem('verofield_auth');
      if (!authData) throw new Error('User not authenticated');

      let token;
      try {
        const parsed = JSON.parse(authData);
        token = parsed.token || parsed;
      } catch {
        token = authData;
      }

      if (!token) throw new Error('No access token found');

      logger.debug(`Deleting ${logoType} logo`, {}, 'enhanced-api');

      const response = await fetch(`http://localhost:3001/api/v1/company/logo/${logoType}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('Logo deletion failed', new Error(`${response.status} ${response.statusText}: ${errorText}`), 'enhanced-api');
        throw new Error(`Failed to delete logo: ${response.statusText}`);
      }

      const result = await response.json();
      logger.debug('Delete response received', { success: !!result }, 'enhanced-api');
      return result;
    } catch (error: unknown) {
      logger.error('Failed to delete logo', error, 'enhanced-api');
      throw error;
    }
  },

  // Update company settings
  updateSettings: async (settings: Record<string, unknown>): Promise<void> => {
    try {
      const authData = localStorage.getItem('verofield_auth');
      if (!authData) throw new Error('User not authenticated');

      let token;
      try {
        const parsed = JSON.parse(authData);
        token = parsed.token || parsed;
      } catch {
        token = authData;
      }

      if (!token) throw new Error('No access token found');

      logger.debug('Sending company settings data', { hasSettings: !!settings }, 'enhanced-api');

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
        logger.error('Server response error', new Error(`${response.status} ${response.statusText}: ${errorText}`), 'enhanced-api');
        throw new Error(`Failed to update company settings: ${response.statusText} - ${errorText}`);
      }

      return await response.json();
    } catch (error: unknown) {
      logger.error('Failed to update company settings', error, 'enhanced-api');
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
      const authData = localStorage.getItem('verofield_auth');
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
      const authData = localStorage.getItem('verofield_auth');
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
      const authData = localStorage.getItem('verofield_auth');
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
        logger.error('Backend error response', new Error(errorText), 'enhanced-api');
        try {
          const errorData = JSON.parse(errorText);
          logger.error('Parsed error data', errorData, 'enhanced-api');
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
      const authData = localStorage.getItem('verofield_auth');
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
      const authData = localStorage.getItem('verofield_auth');
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
      const authData = localStorage.getItem('verofield_auth');
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
      const authData = localStorage.getItem('verofield_auth');
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
      const authData = localStorage.getItem('verofield_auth');
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
      const authData = localStorage.getItem('verofield_auth');
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
      const authData = localStorage.getItem('verofield_auth');
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
      const authData = localStorage.getItem('verofield_auth');
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
      const authData = localStorage.getItem('verofield_auth');
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
      const authData = localStorage.getItem('verofield_auth');
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
      const authData = localStorage.getItem('verofield_auth');
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
  },

  // AR Management
  getARSummary: async (): Promise<ARSummary> => {
    try {
      const authData = localStorage.getItem('verofield_auth');
      if (!authData) throw new Error('User not authenticated');

      let token;
      try {
        const parsed = JSON.parse(authData);
        token = parsed.token || parsed;
      } catch {
        token = authData;
      }

      if (!token) throw new Error('No access token found');

      const response = await fetch(`http://localhost:3001/api/v1/billing/ar-summary`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get AR summary: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, 'get AR summary');
      throw error;
    }
  },

  retryFailedPayment: async (invoiceId: string): Promise<any> => {
    try {
      const authData = localStorage.getItem('verofield_auth');
      if (!authData) throw new Error('User not authenticated');

      let token;
      try {
        const parsed = JSON.parse(authData);
        token = parsed.token || parsed;
      } catch {
        token = authData;
      }

      if (!token) throw new Error('No access token found');

      const response = await fetch(`http://localhost:3001/api/v1/billing/invoices/${invoiceId}/retry-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to retry payment: ${errorText || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, 'retry failed payment');
      throw error;
    }
  },

  getPaymentAnalytics: async (startDate?: string, endDate?: string): Promise<any> => {
    try {
      const authData = localStorage.getItem('verofield_auth');
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

      const url = `http://localhost:3001/api/v1/billing/analytics/payments${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get payment analytics: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, 'get payment analytics');
      throw error;
    }
  },

  createRecurringPayment: async (invoiceId: string, data: any): Promise<any> => {
    try {
      const authData = localStorage.getItem('verofield_auth');
      if (!authData) throw new Error('User not authenticated');

      let token;
      try {
        const parsed = JSON.parse(authData);
        token = parsed.token || parsed;
      } catch {
        token = authData;
      }

      if (!token) throw new Error('No access token found');

      const response = await fetch(`http://localhost:3001/api/v1/billing/invoices/${invoiceId}/recurring-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create recurring payment: ${errorText || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, 'create recurring payment');
      throw error;
    }
  },

  getRecurringPayment: async (subscriptionId: string): Promise<any> => {
    try {
      const authData = localStorage.getItem('verofield_auth');
      if (!authData) throw new Error('User not authenticated');

      let token;
      try {
        const parsed = JSON.parse(authData);
        token = parsed.token || parsed;
      } catch {
        token = authData;
      }

      if (!token) throw new Error('No access token found');

      const response = await fetch(`http://localhost:3001/api/v1/billing/recurring-payments/${subscriptionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get recurring payment: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, 'get recurring payment');
      throw error;
    }
  },

  cancelRecurringPayment: async (subscriptionId: string, immediately: boolean = false): Promise<any> => {
    try {
      const authData = localStorage.getItem('verofield_auth');
      if (!authData) throw new Error('User not authenticated');

      let token;
      try {
        const parsed = JSON.parse(authData);
        token = parsed.token || parsed;
      } catch {
        token = authData;
      }

      if (!token) throw new Error('No access token found');

      const response = await fetch(`http://localhost:3001/api/v1/billing/recurring-payments/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ immediately }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to cancel recurring payment: ${errorText || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, 'cancel recurring payment');
      throw error;
    }
  },

  getPaymentRetryHistory: async (invoiceId: string): Promise<any> => {
    try {
      const authData = localStorage.getItem('verofield_auth');
      if (!authData) throw new Error('User not authenticated');

      let token;
      try {
        const parsed = JSON.parse(authData);
        token = parsed.token || parsed;
      } catch {
        token = authData;
      }

      if (!token) throw new Error('No access token found');

      const response = await fetch(`http://localhost:3001/api/v1/billing/invoices/${invoiceId}/payment-retry-history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get payment retry history: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, 'get payment retry history');
      throw error;
    }
  },

  getOverdueInvoices: async (): Promise<any> => {
    try {
      const authData = localStorage.getItem('verofield_auth');
      if (!authData) throw new Error('User not authenticated');

      let token;
      try {
        const parsed = JSON.parse(authData);
        token = parsed.token || parsed;
      } catch {
        token = authData;
      }

      if (!token) throw new Error('No access token found');

      const response = await fetch(`http://localhost:3001/api/v1/billing/overdue-invoices`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get overdue invoices: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, 'get overdue invoices');
      throw error;
    }
  },

  getPaymentTracking: async (startDate?: string, endDate?: string): Promise<any> => {
    try {
      const authData = localStorage.getItem('verofield_auth');
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

      const response = await fetch(`http://localhost:3001/api/v1/billing/payment-tracking?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get payment tracking: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, 'get payment tracking');
      throw error;
    }
  },

  sendInvoiceReminder: async (invoiceIds: string[], message?: string): Promise<any> => {
    try {
      const authData = localStorage.getItem('verofield_auth');
      if (!authData) throw new Error('User not authenticated');

      let token;
      try {
        const parsed = JSON.parse(authData);
        token = parsed.token || parsed;
      } catch {
        token = authData;
      }

      if (!token) throw new Error('No access token found');

      const payload: any = {};
      if (invoiceIds.length === 1) {
        payload.invoice_id = invoiceIds[0];
      } else {
        payload.invoice_ids = invoiceIds;
      }
      if (message) {
        payload.message = message;
      }

      const response = await fetch('http://localhost:3001/api/v1/billing/invoices/send-reminder', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send reminder: ${errorText || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      handleApiError(error, 'send invoice reminder');
      throw error;
    }
  }
};

// ============================================================================
// INVENTORY API (Dashboard Components)
// ============================================================================

import type { 
  InventoryComplianceData, 
  InventoryCategory, 
  ComplianceAlert, 
  Inspection 
} from '@/types/inventory';
import type { 
  KpiTemplate, 
  CreateKpiTemplateDto, 
  UpdateKpiTemplateDto,
  UserKpi,
  KpiTemplateFilters,
  UseKpiTemplateDto
} from '@/types/kpi-templates';
import type {
  RecurringJobTemplate,
  CreateRecurringJobTemplateDto,
  UpdateRecurringJobTemplateDto
} from '@/types/recurring-jobs';
import type { DashboardCard } from '@/routes/dashboard/types/dashboard.types';

export const inventory = {
  getComplianceData: async (): Promise<InventoryComplianceData> => {
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

  getCategories: async (): Promise<InventoryCategory[]> => {
    try {
      // TODO: Replace with actual inventory categories when implemented
      return [];
    } catch (error) {
      handleApiError(error, 'fetch inventory categories');
      return [];
    }
  },

  getComplianceAlerts: async (): Promise<ComplianceAlert[]> => {
    try {
      // TODO: Replace with actual compliance alerts when implemented
      return [];
    } catch (error) {
      handleApiError(error, 'fetch compliance alerts');
      return [];
    }
  },

  getRecentInspections: async (): Promise<Inspection[]> => {
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
  },

};

// ============================================================================
// KPI TEMPLATES API
// ============================================================================

export const kpiTemplates = {
    // Get all KPI templates with filtering
    list: async (filters: KpiTemplateFilters = {}): Promise<KpiTemplate[]> => {
      try {
        const token = await getAuthToken();
        
        // Filter out undefined values from query parameters
        const cleanFilters = Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null && value !== '')
        );
        
        const response = await enhancedApiCall<{ data: any; meta: any }>(`http://localhost:3001/api/v2/kpi-templates?${new URLSearchParams(cleanFilters)}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        // Handle v2 response format: { data, meta }
        const data = response?.data || response;
          if (process.env.NODE_ENV === 'development') {
            logger.debug('API Response (kpiTemplates.list)', {
              hasData: !!data,
              hasTemplates: !!data.templates,
              dataType: typeof data,
              dataIsArray: Array.isArray(data)
            }, 'enhanced-api');
          }
          
          // Backend returns { templates: [...], pagination: {...} }
          const result = data.templates || data || [];
          if (process.env.NODE_ENV === 'development') {
            logger.debug('Returning KPI templates', {
              resultType: typeof result,
              resultIsArray: Array.isArray(result),
              resultCount: Array.isArray(result) ? result.length : 0
            }, 'enhanced-api');
          }
          return result;
      } catch (error) {
        handleApiError(error, 'fetch KPI templates');
        return [];
      }
    },

    // Get a specific KPI template
    get: async (id: string): Promise<KpiTemplate | null> => {
      try {
        const token = await getAuthToken();
        const response = await fetch(`http://localhost:3001/api/v2/kpi-templates/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        // Handle v2 response format: { data, meta }
        return result?.data || result;
      } catch (error) {
        handleApiError(error, 'fetch KPI template');
        return null;
      }
    },

    // Create a new KPI template
    create: async (templateData: CreateKpiTemplateDto): Promise<KpiTemplate> => {
      try {
        const { data, error } = await supabase
          .from('kpi_templates')
          .insert({
            ...templateData,
            tenant_id: await getTenantId(),
            created_by: await getUserId(),
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        handleApiError(error, 'create KPI template');
        throw error;
      }
    },

    // Update an existing KPI template
    update: async (id: string, updates: UpdateKpiTemplateDto): Promise<KpiTemplate> => {
      try {
        const { data, error } = await supabase
          .from('kpi_templates')
          .update(updates)
          .eq('id', id)
          .eq('tenant_id', await getTenantId())
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        handleApiError(error, 'update KPI template');
        throw error;
      }
    },

    // Delete a KPI template
    delete: async (id: string): Promise<void> => {
      try {
        const { error } = await supabase
          .from('kpi_templates')
          .delete()
          .eq('id', id)
          .eq('tenant_id', await getTenantId());

        if (error) throw error;
      } catch (error) {
        handleApiError(error, 'delete KPI template');
        throw error;
      }
    },

    // Use a template to create a user KPI
    useTemplate: async (templateId: string, userKpiData: UseKpiTemplateDto): Promise<UserKpi> => {
      try {
        const token = await getAuthToken();
        const response = await fetch(`http://localhost:3001/api/v2/kpi-templates/use`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            template_id: templateId,
            ...userKpiData
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        // Handle v2 response format: { data, meta }
        return result?.data || result;
      } catch (error) {
        handleApiError(error, 'use KPI template');
        throw error;
      }
    },

    // Track template usage
    trackUsage: async (templateId: string, action: string): Promise<any> => {
      try {
        const token = await getAuthToken();
        const response = await fetch(`http://localhost:3001/api/v2/kpi-templates/track-usage`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            template_id: templateId,
            action: action
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        // Handle v2 response format: { data, meta }
        return result?.data || result;
      } catch (error) {
        handleApiError(error, 'track template usage');
        throw error;
      }
    },

    // Get user's favorited templates
    getFavorites: async (): Promise<any[]> => {
      try {
        const token = await getAuthToken();
        const response = await fetch(`http://localhost:3001/api/v2/kpi-templates/favorites`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          // Log the actual error for debugging
          const errorText = await response.text();
          logger.error('Favorites API error', new Error(`${response.status} ${response.statusText}: ${errorText}`), 'enhanced-api');
          
          // If it's a 400 error, the table might not exist or there's a schema issue
          if (response.status === 400) {
            logger.warn('Favorites API returned 400 - this might be a database schema issue', {}, 'enhanced-api');
          }
          
          // Gracefully degrade to empty list so UI still works
          return [];
        }

        const result = await response.json();
        // Handle v2 response format: { data, meta }
        const data = result?.data || result;
        return Array.isArray(data) ? data : [];
      } catch (error: unknown) {
        logger.error('Favorites API network error', error, 'enhanced-api');
        handleApiError(error, 'get favorited templates');
        return [];
      }
    },

    // Check if template is favorited
    getFavoriteStatus: async (templateId: string): Promise<{ isFavorited: boolean }> => {
      try {
        const token = await getAuthToken();
        const response = await fetch(`http://localhost:3001/api/v2/kpi-templates/${templateId}/favorite-status`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        // Handle v2 response format: { data, meta }
        const data = result?.data || result;
        return data?.isFavorited !== undefined ? data : { isFavorited: data?.isFavorited || false };
      } catch (error) {
        handleApiError(error, 'get template favorite status');
        return { isFavorited: false };
      }
    },

    // Get popular templates
    getPopular: async (limit: number = 10): Promise<any[]> => {
      try {
        const token = await getAuthToken();
        const response = await fetch(`http://localhost:3001/api/v2/kpi-templates/popular?limit=${limit}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        // Handle v2 response format: { data, meta }
        const data = result?.data || result;
        return Array.isArray(data) ? data : [];
      } catch (error) {
        handleApiError(error, 'fetch popular KPI templates');
        return [];
      }
    },

    // Get featured templates
    getFeatured: async (): Promise<any[]> => {
      try {
        const token = await getAuthToken();
        const response = await fetch(`http://localhost:3001/api/v2/kpi-templates?is_featured=true`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        // Handle v2 response format: { data, meta }
        const data = result?.data || result;
        if (process.env.NODE_ENV === 'development') {
          logger.debug('API Response (kpiTemplates.list)', {
            hasData: !!data,
            hasTemplates: !!data.templates,
            dataType: typeof data,
            dataIsArray: Array.isArray(data)
          }, 'enhanced-api');
        }
        
        // Backend returns { templates: [...], pagination: {...} }
        const templates = data.templates || data || [];
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Returning KPI templates', {
            resultType: typeof templates,
            resultIsArray: Array.isArray(templates),
            resultCount: Array.isArray(templates) ? templates.length : 0
          }, 'enhanced-api');
        }
        return templates;
      } catch (error) {
        handleApiError(error, 'fetch featured KPI templates');
        return [];
      }
    }
  }

// ============================================================================
// USER KPIS API
// ============================================================================

export const userKpis = {
    // Get user's KPIs
    list: async (): Promise<any[]> => {
      try {
        const token = await getAuthToken();
        const response = await enhancedApiCall<{ data: any[]; meta: any }>(`http://localhost:3001/api/v2/kpis/user`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        // Handle v2 response format: { data, meta }
        const data = response?.data || response;
        return Array.isArray(data) ? data : [];
      } catch (error) {
        handleApiError(error, 'fetch user KPIs');
        return [];
      }
    },

    // Get a specific user KPI
    get: async (id: string): Promise<any | null> => {
      try {
        const { data, error } = await supabase
          .from('user_kpis')
          .select(`
            *,
            template:kpi_templates(*)
          `)
          .eq('id', id)
          .eq('tenant_id', await getTenantId())
          .eq('user_id', await getUserId())
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        handleApiError(error, 'fetch user KPI');
        return null;
      }
    },

    // Create a new user KPI
    create: async (kpiData: Record<string, unknown>): Promise<Record<string, unknown>> => {
      try {
        logger.debug('Enhanced API - Creating user KPI', { hasKpiData: !!kpiData }, 'enhanced-api');
        
        const authToken = await getAuthToken();
        
        const response = await fetch(`http://localhost:3001/api/kpis`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify(kpiData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          logger.error('Backend error response', errorData, 'enhanced-api');
          throw new Error((errorData as { message?: string }).message || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        logger.debug('Successfully created KPI', { hasResult: !!result }, 'enhanced-api');
        return result;
      } catch (error: unknown) {
        logger.error('Enhanced API error', error, 'enhanced-api');
        handleApiError(error, 'create user KPI');
        throw error;
      }
    },

    // Update a user KPI
    update: async (id: string, updates: Partial<UserKpi>): Promise<UserKpi> => {
      try {
        const { data, error } = await supabase
          .from('user_kpis')
          .update(updates)
          .eq('id', id)
          .eq('tenant_id', await getTenantId())
          .eq('user_id', await getUserId())
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        handleApiError(error, 'update user KPI');
        throw error;
      }
    },

    // Delete a user KPI
    delete: async (id: string): Promise<void> => {
      try {
        const { error } = await supabase
          .from('user_kpis')
          .delete()
          .eq('id', id)
          .eq('tenant_id', await getTenantId())
          .eq('user_id', await getUserId());

        if (error) throw error;
      } catch (error) {
        handleApiError(error, 'delete user KPI');
        throw error;
      }
  }
}

// ============================================================================
// TECHNICIANS API
// ============================================================================

const technicians = {
  // Get all technicians
  list: async (): Promise<any[]> => {
    try {
      const token = await getAuthToken();
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
      const url = `${baseUrl}/v2/technicians`;
      
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Fetching technicians', { url, baseUrl }, 'enhanced-api');
      }
      
      const response = await enhancedApiCall<{ data: any; meta: any }>(url, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Technicians API response', { response, responseType: typeof response, isArray: Array.isArray(response) }, 'enhanced-api');
      }
      
      // Handle paginated response - extract data array if present
      // Backend controller wraps TechnicianListResponseDto in { data: result, meta: {...} }
      // TechnicianListResponseDto has structure: { data: [...], pagination: {...}, success: true, ... }
      // So final response is: { data: { data: [...], pagination: {...}, ... }, meta: {...} }
      
      // Check if response.data.data exists (double-nested structure from controller wrapping DTO)
      if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Extracted technicians from response.data.data (controller-wrapped DTO)', { count: response.data.data.length }, 'enhanced-api');
        }
        return response.data.data;
      }
      // Check if response.data.technicians exists (alternative nested structure)
      else if (response && response.data && response.data.technicians && Array.isArray(response.data.technicians)) {
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Extracted technicians from response.data.technicians', { count: response.data.technicians.length }, 'enhanced-api');
        }
        return response.data.technicians;
      }
      // Check if response.data is a direct array
      else if (response && response.data && Array.isArray(response.data)) {
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Extracted technicians from response.data (direct array)', { count: response.data.length }, 'enhanced-api');
        }
        return response.data;
      }
      // Check if response is a direct array
      else if (Array.isArray(response)) {
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Response is direct array', { count: response.length }, 'enhanced-api');
        }
        return response;
      }
      // Check if response.technicians exists (alternative format)
      else if (response && response.technicians && Array.isArray(response.technicians)) {
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Extracted technicians from response.technicians', { count: response.technicians.length }, 'enhanced-api');
        }
        return response.technicians;
      }
      
      if (process.env.NODE_ENV === 'development') {
        logger.warn('Unexpected response format for technicians', { response }, 'enhanced-api');
      }
      return [];
    } catch (error) {
      logger.error('Error fetching technicians', { error, message: error?.message, status: error?.status }, 'enhanced-api');
      handleApiError(error, 'list technicians');
      return [];
    }
  },

  // Get technician availability
  getAvailability: async (technicianId: string, startDate?: string, endDate?: string): Promise<any> => {
    try {
      const token = await getAuthToken();
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
      let url = `${baseUrl}/v2/technicians/${technicianId}/availability`;
      if (startDate && endDate) {
        url += `?start_date=${startDate}&end_date=${endDate}`;
      }
      const response = await enhancedApiCall<{ data: any; meta: any }>(url, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      // Handle v2 response format
      const data = response?.data || response;
      return data;
    } catch (error) {
      handleApiError(error, 'get technician availability');
      throw error;
    }
  },

  // Set availability pattern
  setAvailability: async (
    technicianId: string,
    dayOfWeek: number,
    startTime: string,
    endTime: string,
    isActive: boolean = true
  ): Promise<any> => {
    try {
      const token = await getAuthToken();
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
      const url = `${baseUrl}/v2/technicians/${technicianId}/availability`;
      const response = await enhancedApiCall<{ data: any; meta: any }>(url, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          day_of_week: dayOfWeek,
          start_time: startTime,
          end_time: endTime,
          is_active: isActive
        })
      });
      // Handle v2 response format
      return response?.data || response;
    } catch (error) {
      handleApiError(error, 'set technician availability');
      throw error;
    }
  },

  // Get available technicians for a time slot
  getAvailable: async (date: string, startTime: string, endTime: string): Promise<any[]> => {
    try {
      const token = await getAuthToken();
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
      const url = `${baseUrl}/v2/technicians/available?date=${date}&start_time=${startTime}&end_time=${endTime}`;
      const response = await enhancedApiCall<{ data: any[]; meta: any }>(url,
        {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        }
      );
      // Handle v2 response format
      const data = response?.data || response;
      return data || [];
    } catch (error) {
      handleApiError(error, 'get available technicians');
      return [];
    }
  }
};

// ============================================================================
// ROUTING API
// ============================================================================

const routing = {
  // Get routes for a specific date or all routes
  getRoutes: async (date?: string): Promise<any[]> => {
    try {
      const token = await getAuthToken();
      const url = date 
        ? `http://localhost:3001/api/v1/routing/routes?date=${date}`
        : 'http://localhost:3001/api/v1/routing/routes';
      
      const data = await enhancedApiCall<any[]>(url, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      return data || [];
    } catch (error) {
      handleApiError(error, 'get routes');
      return [];
    }
  },

  // Optimize route for a specific technician
  optimizeRoute: async (technicianId: string, date: string): Promise<any> => {
    try {
      const token = await getAuthToken();
      const data = await enhancedApiCall<any>(`http://localhost:3001/api/v1/routing/optimize/${technicianId}?date=${date}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      return data;
    } catch (error) {
      handleApiError(error, 'optimize route');
      throw error;
    }
  },

  // Get route metrics for a date range
  getMetrics: async (startDate: string, endDate: string): Promise<any> => {
    try {
      const token = await getAuthToken();
      const data = await enhancedApiCall<any>(`http://localhost:3001/api/v1/routing/metrics?start_date=${startDate}&end_date=${endDate}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      return data;
    } catch (error) {
      handleApiError(error, 'get route metrics');
      throw error;
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
  technicians,
  analytics,
  billing,
  inventory,
  financial,
  company,
  kpiTemplates,
  userKpis,
  routing,
  auth: authApi,
  // Dashboard layouts/cards persistence (server-side)
  dashboardLayouts: {
    getOrCreateDefault: async (): Promise<{ id: string } | null> => {
      try {
        const token = await getAuthToken();
        const data = await enhancedApiCall<{ id: string }>(`http://localhost:3001/api/v1/dashboard/layouts/default`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        return data;
      } catch (error) {
        handleApiError(error, 'load default dashboard layout');
        return null;
      }
    },
    listCards: async (layoutId: string): Promise<DashboardCard[]> => {
      try {
        const token = await getAuthToken();
        const data = await enhancedApiCall<DashboardCard[]>(`http://localhost:3001/api/v1/dashboard/layouts/${layoutId}/cards`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        return data || [];
      } catch (error) {
        handleApiError(error, 'list dashboard cards');
        return [];
      }
    },
    // Region methods
    listRegions: async (layoutId: string): Promise<any[]> => {
      try {
        const token = await getAuthToken();
        const data = await enhancedApiCall<any[]>(`http://localhost:3001/api/v1/dashboard/layouts/${layoutId}/regions`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        return data || [];
      } catch (error) {
        handleApiError(error, 'list dashboard regions');
        return [];
      }
    },
    createRegion: async (layoutId: string, regionData: any): Promise<any> => {
      try {
        const token = await getAuthToken();
        // Ensure numbers are numbers, not strings, and clamp to valid ranges
        const sanitizedData = {
          ...regionData,
          grid_row: Math.max(0, typeof regionData.grid_row === 'string' ? parseInt(regionData.grid_row, 10) : (regionData.grid_row ?? 0)),
          grid_col: Math.max(0, Math.min(11, typeof regionData.grid_col === 'string' ? parseInt(regionData.grid_col, 10) : (regionData.grid_col ?? 0))), // Max 11 (0-indexed)
          row_span: Math.max(1, Math.min(20, typeof regionData.row_span === 'string' ? parseInt(regionData.row_span, 10) : (regionData.row_span ?? 1))),
          col_span: Math.max(1, Math.min(12, typeof regionData.col_span === 'string' ? parseInt(regionData.col_span, 10) : (regionData.col_span ?? 1))),
          min_width: typeof regionData.min_width === 'string' ? parseInt(regionData.min_width, 10) : (regionData.min_width ?? 200),
          min_height: typeof regionData.min_height === 'string' ? parseInt(regionData.min_height, 10) : (regionData.min_height ?? 150),
          display_order: typeof regionData.display_order === 'string' ? parseInt(regionData.display_order, 10) : (regionData.display_order ?? 0),
        };
        
        // Ensure col + span doesn't exceed 12
        if (sanitizedData.grid_col + sanitizedData.col_span > 12) {
          sanitizedData.col_span = 12 - sanitizedData.grid_col;
        }
        
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Creating region', { layoutId, sanitizedData }, 'enhanced-api');
        }
        
        const data = await enhancedApiCall<any>(`http://localhost:3001/api/v1/dashboard/layouts/${layoutId}/regions`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(sanitizedData)
        });
        return data;
      } catch (error) {
        handleApiError(error, 'create dashboard region');
        throw error;
      }
    },
    updateRegion: async (layoutId: string, regionId: string, updates: any): Promise<any> => {
      try {
        const token = await getAuthToken();
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Updating region', { layoutId, regionId, updates }, 'enhanced-api');
        }
        const data = await enhancedApiCall<any>(`http://localhost:3001/api/v1/dashboard/layouts/${layoutId}/regions/${regionId}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
        return data;
      } catch (error) {
        handleApiError(error, 'update dashboard region');
        throw error;
      }
    },
    deleteRegion: async (layoutId: string, regionId: string): Promise<{ success: boolean }> => {
      try {
        const token = await getAuthToken();
        const data = await enhancedApiCall<{ success: boolean }>(`http://localhost:3001/api/v1/dashboard/layouts/${layoutId}/regions/${regionId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        return data;
      } catch (error) {
        handleApiError(error, 'delete dashboard region');
        throw error;
      }
    },
    reorderRegions: async (layoutId: string, regionIds: string[]): Promise<{ success: boolean }> => {
      try {
        const token = await getAuthToken();
        const data = await enhancedApiCall<{ success: boolean }>(`http://localhost:3001/api/v1/dashboard/layouts/${layoutId}/regions/reorder`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ region_ids: regionIds })
        });
        return data;
      } catch (error) {
        handleApiError(error, 'reorder dashboard regions');
        throw error;
      }
    },
    getRoleDefaults: async (role: string): Promise<any[]> => {
      try {
        const token = await getAuthToken();
        const data = await enhancedApiCall<any[]>(`http://localhost:3001/api/v1/dashboard/regions/defaults/${role}`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        return data || [];
      } catch (error) {
        handleApiError(error, 'get role defaults');
        return [];
      }
    },
    // Versioning methods
    getVersions: async (layoutId: string): Promise<any[]> => {
      try {
        const token = await getAuthToken();
        const data = await enhancedApiCall<any[]>(`http://localhost:3001/api/v1/dashboard/layouts/${layoutId}/versions`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        return data || [];
      } catch (error) {
        handleApiError(error, 'get layout versions');
        return [];
      }
    },
    createVersion: async (layoutId: string, status: string, notes?: string): Promise<any> => {
      try {
        const token = await getAuthToken();
        const data = await enhancedApiCall<any>(`http://localhost:3001/api/v1/dashboard/layouts/${layoutId}/versions`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ status, notes })
        });
        return data;
      } catch (error) {
        handleApiError(error, 'create layout version');
        throw error;
      }
    },
    publishVersion: async (layoutId: string, versionId: string, notes?: string): Promise<any> => {
      try {
        const token = await getAuthToken();
        const data = await enhancedApiCall<any>(`http://localhost:3001/api/v1/dashboard/layouts/${layoutId}/publish`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ version_id: versionId, notes })
        });
        return data;
      } catch (error) {
        handleApiError(error, 'publish layout version');
        throw error;
      }
    },
    revertToVersion: async (layoutId: string, versionId: string): Promise<{ success: boolean }> => {
      try {
        const token = await getAuthToken();
        const data = await enhancedApiCall<{ success: boolean }>(`http://localhost:3001/api/v1/dashboard/layouts/${layoutId}/revert/${versionId}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        return data;
      } catch (error) {
        handleApiError(error, 'revert to version');
        throw error;
      }
    },
    // Undo/Redo methods
    undoLayout: async (layoutId: string): Promise<{ regions: any[], version: number }> => {
      try {
        const token = await getAuthToken();
        const data = await enhancedApiCall<{ regions: any[], version: number }>(`http://localhost:3001/api/v2/dashboard/layouts/${layoutId}/undo`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        return data;
      } catch (error) {
        handleApiError(error, 'undo layout');
        throw error;
      }
    },
    redoLayout: async (layoutId: string): Promise<{ regions: any[], version: number }> => {
      try {
        const token = await getAuthToken();
        const data = await enhancedApiCall<{ regions: any[], version: number }>(`http://localhost:3001/api/v2/dashboard/layouts/${layoutId}/redo`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        return data;
      } catch (error) {
        handleApiError(error, 'redo layout');
        throw error;
      }
    },
    getLayoutHistory: async (layoutId: string, limit: number = 50): Promise<{ canUndo: boolean, canRedo: boolean, recentEvents: any[] }> => {
      try {
        const token = await getAuthToken();
        const data = await enhancedApiCall<{ canUndo: boolean, canRedo: boolean, recentEvents: any[] }>(`http://localhost:3001/api/v2/dashboard/layouts/${layoutId}/history?limit=${limit}`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        return data;
      } catch (error) {
        handleApiError(error, 'get layout history');
        return { canUndo: false, canRedo: false, recentEvents: [] };
      }
    },
    // Widget registry methods
    getApprovedWidgets: async (): Promise<any[]> => {
      try {
        const token = await getAuthToken();
        const data = await enhancedApiCall<any[]>(`http://localhost:3001/api/v1/dashboard/widgets/approved`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        return data || [];
      } catch (error) {
        handleApiError(error, 'get approved widgets');
        return [];
      }
    },
    registerWidget: async (widgetData: any): Promise<any> => {
      try {
        const token = await getAuthToken();
        const data = await enhancedApiCall<any>(`http://localhost:3001/api/v1/dashboard/widgets/register`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(widgetData)
        });
        return data;
      } catch (error) {
        handleApiError(error, 'register widget');
        throw error;
      }
    },
    // Presence methods
    getPresence: async (regionId: string): Promise<any[]> => {
      try {
        const token = await getAuthToken();
        const data = await enhancedApiCall<any[]>(`http://localhost:3001/api/dashboard/regions/${regionId}/presence`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        return data || [];
      } catch (error) {
        handleApiError(error, 'get region presence');
        return [];
      }
    },
    updatePresence: async (regionId: string, userId: string, sessionId: string, isEditing: boolean): Promise<void> => {
      try {
        const token = await getAuthToken();
        await enhancedApiCall(`http://localhost:3001/api/dashboard/regions/${regionId}/presence`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, sessionId, isEditing })
        });
      } catch (error) {
        handleApiError(error, 'update region presence');
      }
    },
    // Template methods
    templates: {
      list: async (): Promise<any[]> => {
        try {
          const token = await getAuthToken();
          const response = await enhancedApiCall<{ data: any[] }>(`http://localhost:3001/api/v2/dashboard/templates`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
          });
          return response?.data || [];
        } catch (error) {
          handleApiError(error, 'list templates');
          return [];
        }
      },
      get: async (id: string): Promise<any> => {
        try {
          const token = await getAuthToken();
          const response = await enhancedApiCall<{ data: any }>(`http://localhost:3001/api/v2/dashboard/templates/${id}`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
          });
          return response?.data;
        } catch (error) {
          handleApiError(error, 'get template');
          throw error;
        }
      },
      create: async (template: { name: string; description?: string; thumbnail?: string; is_public?: boolean; regions: any[] }): Promise<any> => {
        try {
          const token = await getAuthToken();
          const response = await enhancedApiCall<{ data: any }>(`http://localhost:3001/api/v2/dashboard/templates`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(template)
          });
          return response?.data;
        } catch (error) {
          handleApiError(error, 'create template');
          throw error;
        }
      },
      update: async (id: string, template: { name?: string; description?: string; thumbnail?: string; is_public?: boolean; regions?: any[] }): Promise<any> => {
        try {
          const token = await getAuthToken();
          const response = await enhancedApiCall<{ data: any }>(`http://localhost:3001/api/v2/dashboard/templates/${id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(template)
          });
          return response?.data;
        } catch (error) {
          handleApiError(error, 'update template');
          throw error;
        }
      },
      delete: async (id: string): Promise<void> => {
        try {
          const token = await getAuthToken();
          await enhancedApiCall(`http://localhost:3001/api/v2/dashboard/templates/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
          });
        } catch (error) {
          handleApiError(error, 'delete template');
          throw error;
        }
      }
    },
    acquireLock: async (regionId: string): Promise<{ success: boolean; lockedBy?: string }> => {
      try {
        const token = await getAuthToken();
        const data = await enhancedApiCall<{ success: boolean; lockedBy?: string }>(`http://localhost:3001/api/dashboard/regions/${regionId}/lock`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'acquire' })
        });
        return data || { success: false };
      } catch (error) {
        handleApiError(error, 'acquire region lock');
        return { success: false };
      }
    },
    releaseLock: async (regionId: string): Promise<void> => {
      try {
        const token = await getAuthToken();
        await enhancedApiCall(`http://localhost:3001/api/dashboard/regions/${regionId}/lock`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'release' })
        });
      } catch (error) {
        handleApiError(error, 'release region lock');
      }
    },
    // Migration method
    migrateCardsToRegions: async (layoutId: string): Promise<any> => {
      try {
        const token = await getAuthToken();
        const data = await enhancedApiCall<any>(`http://localhost:3001/api/dashboard/migrate/cards-to-regions`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ layoutId })
        });
        return data;
      } catch (error) {
        handleApiError(error, 'migrate cards to regions');
        throw error;
      }
    },
    upsertCard: async (layoutId: string, card: Partial<DashboardCard>): Promise<DashboardCard> => {
      try {
        const token = await getAuthToken();
        const body = { layout_id: layoutId, ...card };
        const data = await enhancedApiCall<DashboardCard>(`http://localhost:3001/api/dashboard/cards`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        return data;
      } catch (error) {
        handleApiError(error, 'upsert dashboard card');
        throw error;
      }
    },
    deleteCard: async (cardId: string): Promise<void> => {
      try {
        const token = await getAuthToken();
        await enhancedApiCall<void>(`http://localhost:3001/api/dashboard/cards/${cardId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
      } catch (error) {
        handleApiError(error, 'delete dashboard card');
        throw error;
      }
    }
  }
};

export default enhancedApi;
