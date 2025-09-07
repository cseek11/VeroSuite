import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class UserService {
  private supabase;

  constructor() {
    // Initialize Supabase client for auth operations
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SECRET_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing required environment variables: SUPABASE_URL and SUPABASE_SECRET_KEY');
    }
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async findByEmail(email: string) {
    try {
      // Get user from Supabase auth
      const { data: { users }, error } = await this.supabase.auth.admin.listUsers();
      
      if (error) {
        console.error('Error fetching users:', error);
        return null;
      }

      // Find user by email
      const user = users.find(u => u.email === email);
      
      if (!user) {
        return null;
      }

      // Return user in the format expected by the auth service
      return {
        id: user.id,
        email: user.email,
        password_hash: '', // Password validation is handled by Supabase auth
        first_name: user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.last_name || '',
        tenant_id: user.user_metadata?.tenant_id,
        roles: user.user_metadata?.roles || ['user'],
        created_at: user.created_at,
        updated_at: user.updated_at
      };
    } catch (error) {
      console.error('Error in findByEmail:', error);
      return null;
    }
  }
}
