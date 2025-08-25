import { createClient } from '@supabase/supabase-js';
import { useAuthStore } from '@/stores/auth';
import { config } from './config';

// Create Supabase client using validated configuration
export const supabase = createClient(config.supabase.url, config.supabase.anonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Auth functions using Supabase Auth
export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  
  return {
    access_token: data.session?.access_token,
    user: data.user,
  };
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

// Jobs API using Supabase client
export const jobsApi = {
  today: async (technician_id?: string) => {
    // Get current user to extract tenant context
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error('Auth error:', authError);
      throw authError;
    }
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Extract tenant_id from user metadata or try to get it from the users table
    let tenantId = user.user_metadata?.tenant_id;
    
    if (!tenantId) {
      // Try to get tenant_id from the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('tenant_id')
        .eq('id', user.id)
        .single();
      
      if (userError) {
        console.error('Error fetching user tenant:', userError);
        // For now, use a fallback - you'll need to set up proper tenant management
  tenantId = '582db3a5-40bf-4bf4-8257-bee1ef3c3f0d';
      } else {
        tenantId = userData.tenant_id;
      }
    }
    
    console.log('Querying jobs for tenant:', tenantId);
    
    const today = new Date().toISOString().split('T')[0];
    let query = supabase
      .from('jobs')
      .select(`
        *,
        work_orders (
          service_type,
          description,
          service_price
        ),
        accounts (
          name,
          account_type
        ),
        locations (
          name,
          address_line1,
          city,
          state
        )
      `)
      .eq('tenant_id', tenantId)
      .eq('scheduled_date', today);
    
    if (technician_id) {
      query = query.eq('technician_id', technician_id);
    }
    
    const { data, error } = await query;
    if (error) {
      console.error('Supabase query error:', error);
      console.error('Query details:', { tenantId, today, technician_id });
      
      // If tenant filtering fails, try without tenant filter for debugging
      if (error.message?.includes('tenant_id') || error.code === 'PGRST116') {
        console.log('Trying query without tenant filter for debugging...');
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('jobs')
          .select('*')
          .eq('scheduled_date', today)
          .limit(5);
        
        if (fallbackError) {
          console.error('Fallback query also failed:', fallbackError);
          throw error; // Throw original error
        } else {
          console.log('Fallback query succeeded:', fallbackData);
          return fallbackData?.map(job => ({
            id: job.id,
            title: 'Test Job',
            start: job.scheduled_date,
            end: job.scheduled_date,
            status: job.status,
            technician: job.technician_id,
            location: 'Test Location',
            description: 'Test job for debugging',
            color: '#6b7280'
          })) || [];
        }
      }
      
      throw error;
    }
    
    console.log('Jobs query result:', data);
    
    // Transform data to match expected format
    return data?.map(job => ({
      id: job.id,
      title: job.work_orders?.service_type || 'Unknown Service',
      start: job.scheduled_date,
      end: job.scheduled_date, // You might want to calculate this based on estimated_duration
      status: job.status,
      technician: job.technician_id,
      location: job.locations?.address_line1 || 'Unknown Location',
      description: job.work_orders?.description || '',
      color: job.status === 'completed' ? '#10b981' : 
             job.status === 'in-progress' ? '#3b82f6' : 
             job.status === 'scheduled' ? '#f59e0b' : '#6b7280'
    })) || [];
  },
  
  get: async (id: string) => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },
  
  create: async (payload: any) => {
    const { data, error } = await supabase
      .from('jobs')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  
  assign: async (payload: any) => {
    const { data, error } = await supabase
      .from('jobs')
      .update({ technician_id: payload.technician_id })
      .eq('id', payload.job_id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  
  start: async (id: string, gps: { lat: number; lng: number }) => {
    const { data, error } = await supabase
      .from('jobs')
      .update({ 
        status: 'in_progress',
        gps_location: gps,
        started_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  
  complete: async (id: string, payload: any) => {
    const { data, error } = await supabase
      .from('jobs')
      .update({ 
        ...payload,
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// CRM API using Supabase client
export const crmApi = {
  accounts: async (search?: string) => {
    // Get current user to extract tenant context
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error('Auth error:', authError);
      throw authError;
    }
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Extract tenant_id from user metadata or try to get it from the users table
    let tenantId = user.user_metadata?.tenant_id;
    
    if (!tenantId) {
      // Try to get tenant_id from the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('tenant_id')
        .eq('id', user.id)
        .single();
      
      if (userError) {
        console.error('Error fetching user tenant:', userError);
        // For now, use a fallback - you'll need to set up proper tenant management
        tenantId = '582db3a5-40bf-4bf4-8257-bee1ef3c3f0d';
      } else {
        tenantId = userData.tenant_id;
      }
    }
    
    console.log('Querying accounts for tenant:', tenantId);
    
    // Query accounts for the specific tenant
    let query = supabase
      .from('accounts')
      .select('*')
      .eq('tenant_id', tenantId);
    
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
  
  createAccount: async (payload: any) => {
    // Get current user to extract tenant context
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error('Auth error:', authError);
      throw authError;
    }
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Extract tenant_id from user metadata or try to get it from the users table
    let tenantId = user.user_metadata?.tenant_id;
    
    if (!tenantId) {
      // Try to get tenant_id from the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('tenant_id')
        .eq('id', user.id)
        .single();
      
      if (userError) {
        console.error('Error fetching user tenant:', userError);
        // For now, use a fallback - you'll need to set up proper tenant management
        tenantId = '582db3a5-40bf-4bf4-8257-bee1ef3c3f0d';
      } else {
        tenantId = userData.tenant_id;
      }
    }
    
    const { data, error } = await supabase
      .from('accounts')
      .insert({ ...payload, tenant_id: tenantId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  updateAccount: async (id: string, payload: any) => {
    const { data, error } = await supabase
      .from('accounts')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  
  accountLocations: async (accountId: string) => {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('account_id', accountId);
    if (error) throw error;
    return data;
  },
  
  createLocation: async (payload: any) => {
    const { data, error } = await supabase
      .from('locations')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Get overdue accounts
  getOverdueAccounts: async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    let tenantId = user.user_metadata?.tenant_id;
    if (!tenantId) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('tenant_id')
        .eq('id', user.id)
        .single();
      
      if (userError) {
        tenantId = '582db3a5-40bf-4bf4-8257-bee1ef3c3f0d';
      } else {
        tenantId = userData.tenant_id;
      }
    }

    // Get accounts with overdue payments
    const { data, error } = await supabase
      .from('accounts')
      .select(`
        *,
        agreements!inner(agreement_type, status),
        payments!inner(overdue_days, status)
      `)
      .eq('tenant_id', tenantId)
      .gt('payments.overdue_days', 30)
      .eq('payments.status', 'overdue')
      .order('payments.overdue_days', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get account with agreement summary
  getAccountWithAgreements: async (accountId: string) => {
    const { data, error } = await supabase
      .rpc('get_account_agreement_summary', { account_uuid: accountId });
    
    if (error) throw error;
    return data;
  },

  // Create agreement
  createAgreement: async (agreementData: {
    account_id: string;
    agreement_type: string;
    start_date: string;
    end_date?: string;
    monthly_amount?: number;
    annual_amount?: number;
    auto_renewal?: boolean;
  }) => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    let tenantId = user.user_metadata?.tenant_id;
    if (!tenantId) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('tenant_id')
        .eq('id', user.id)
        .single();
      
      if (userError) {
        tenantId = '582db3a5-40bf-4bf4-8257-bee1ef3c3f0d';
      } else {
        tenantId = userData.tenant_id;
      }
    }

    const { data, error } = await supabase
      .from('agreements')
      .insert({ ...agreementData, tenant_id: tenantId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create payment
  createPayment: async (paymentData: {
    account_id: string;
    agreement_id?: string;
    amount: number;
    due_date: string;
    payment_method?: string;
    notes?: string;
  }) => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    let tenantId = user.user_metadata?.tenant_id;
    if (!tenantId) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('tenant_id')
        .eq('id', user.id)
        .single();
      
      if (userError) {
        tenantId = '582db3a5-40bf-4bf4-8257-bee1ef3c3f0d';
      } else {
        tenantId = userData.tenant_id;
      }
    }

    const { data, error } = await supabase
      .from('payments')
      .insert({ ...paymentData, tenant_id: tenantId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },



  // Update account agreements
  updateAccountAgreements: async (accountId: string, agreements: string[], overdueDays: number) => {
    const { data, error } = await supabase
      .from('accounts')
      .update({ 
        agreements, 
        overdue_days: overdueDays,
        agreement_status: agreements.length > 0 ? 'active' : 'pending'
      })
      .eq('id', accountId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get agreement data for an account (mock data based on account ID)
  getAccountAgreements: (accountId: string) => {
    // Create deterministic agreement data based on account ID
    const hash = accountId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const agreementTypes = [
      'annual_pest_control',
      'monthly_pest_control', 
      'annual_termite_renewal',
      'termite_bait_stations',
      'rat_monitoring'
    ];
    
    // Use hash to determine agreements
    const agreements: string[] = [];
    if (hash % 3 === 0) agreements.push(agreementTypes[0]);
    if (hash % 4 === 0) agreements.push(agreementTypes[1]);
    if (hash % 5 === 0) agreements.push(agreementTypes[2]);
    if (hash % 6 === 0) agreements.push(agreementTypes[3]);
    if (hash % 7 === 0) agreements.push(agreementTypes[4]);
    
    // Ensure at least some accounts have agreements
    if (agreements.length === 0 && hash % 2 === 0) {
      agreements.push(agreementTypes[0]);
    }
    
    return agreements;
  },

  // Get overdue status for an account (mock data based on account ID)
  getAccountOverdueDays: (accountId: string) => {
    // Create deterministic overdue data based on account ID
    const hash = accountId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    // Use hash to determine overdue status
    if (hash % 3 === 0) return 45;  // 45 days overdue
    if (hash % 4 === 0) return 75;  // 75 days overdue
    if (hash % 5 === 0) return 120; // 120 days overdue
    if (hash % 7 === 0) return 25;  // 25 days past due (not overdue)
    
    return 0; // Not overdue
  },
};

// File upload using Supabase Storage
export async function presignUpload(filename: string, content_type: string) {
  const { data, error } = await supabase.storage
    .from('uploads')
    .createSignedUploadUrl(filename);
  
  if (error) throw error;
  
  return {
    uploadUrl: data.signedUrl,
    method: 'PUT',
    headers: { 'Content-Type': content_type },
    fileUrl: `${config.supabase.url}/storage/v1/object/public/uploads/${filename}`,
  };
}

// Routing API - placeholder for now
export const routingApi = {
  optimize: async (date: string) => {
    // This would need to be implemented with Supabase Edge Functions
    // For now, returning a placeholder
    console.log('Routing optimization requested for:', date);
    return { message: 'Routing optimization would be implemented with Supabase Edge Functions' };
  },
};

export default supabase;
