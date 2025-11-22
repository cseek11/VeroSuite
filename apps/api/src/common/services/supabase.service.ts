import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  private readonly logger = new Logger(SupabaseService.name);

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL') || '';
    // Use the new Supabase secret key (server-side only)
    const supabaseSecretKey = this.configService.get<string>('SUPABASE_SECRET_KEY') || '';
    
    if (!supabaseUrl || !supabaseSecretKey) {
      throw new Error('Missing required environment variables: SUPABASE_URL and SUPABASE_SECRET_KEY');
    }
    
    this.logger.log('Initializing Supabase client', {
      operation: 'supabase-init',
      url: supabaseUrl,
      keyType: supabaseSecretKey.startsWith('sb_secret_') ? 'New Secret Key' : 'Legacy Key',
    });
    
    this.supabase = createClient(supabaseUrl, supabaseSecretKey);
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }
}
