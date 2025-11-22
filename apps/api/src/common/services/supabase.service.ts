import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL || '';
    // Use the new Supabase secret key (server-side only)
    const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || '';
    
    if (!supabaseUrl || !supabaseSecretKey) {
      throw new Error('Missing required environment variables: SUPABASE_URL and SUPABASE_SECRET_KEY');
    }
    
    console.log('SupabaseService - Initializing with URL:', supabaseUrl);
    console.log('SupabaseService - Using secret key type:', supabaseSecretKey.startsWith('sb_secret_') ? 'New Secret Key' : 'Legacy Key');
    
    this.supabase = createClient(supabaseUrl, supabaseSecretKey);
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }
}
