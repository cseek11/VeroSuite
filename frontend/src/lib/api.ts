import { createClient } from '@supabase/supabase-js';
import { useAuthStore } from '@/stores/auth';
import { config } from './config';

// Create Supabase client using validated configuration
export const supabase = createClient(config.supabase.url, config.supabase.anonKey);

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
    let query = supabase
      .from('jobs')
      .select('*')
      .eq('date', new Date().toISOString().split('T')[0]);
    
    if (technician_id) {
      query = query.eq('technician_id', technician_id);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
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
    let query = supabase.from('accounts').select('*');
    
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
  
  createAccount: async (payload: any) => {
    const { data, error } = await supabase
      .from('accounts')
      .insert(payload)
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
