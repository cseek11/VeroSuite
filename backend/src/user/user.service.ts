import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { DatabaseService } from '../common/services/database.service';

@Injectable()
export class UserService {
  private supabase;

  constructor(private db: DatabaseService) {
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

  async getUsers(tenantId: string) {
    try {
      const users = await this.db.user.findMany({
        where: {
          tenant_id: tenantId,
          status: 'active',
        },
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
          phone: true,
          technician_number: true,
          pesticide_license_number: true,
          license_expiration_date: true,
        },
        orderBy: {
          first_name: 'asc',
        },
      });

      return {
        users: users.map(user => ({
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          technician_number: user.technician_number,
          pesticide_license_number: user.pesticide_license_number,
          license_expiration_date: user.license_expiration_date,
        })),
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async createUser(tenantId: string, createUserDto: any) {
    try {
      const { email, first_name, last_name, phone, password } = createUserDto;

      // Check if user already exists in local database
      const existingUser = await this.db.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create user in Supabase Auth first
      const { data: authUser, error: authError } = await this.supabase.auth.admin.createUser({
        email,
        password: password || this.generateTempPassword(),
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          first_name,
          last_name,
          tenant_id: tenantId,
          roles: ['technician'],
        },
      });

      if (authError) {
        console.error('Error creating user in Supabase Auth:', authError);
        throw new Error(`Failed to create user in authentication system: ${authError.message}`);
      }

      // Create user in local database with the Supabase Auth user ID
      const user = await this.db.user.create({
        data: {
          id: authUser.user.id, // Use Supabase Auth user ID
          tenant_id: tenantId,
          email,
          first_name,
          last_name,
          phone: phone || null,
          password_hash: '', // Password is managed by Supabase Auth
          roles: ['technician'],
          status: 'active',
        },
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
          phone: true,
          technician_number: true,
          pesticide_license_number: true,
          license_expiration_date: true,
        },
      });

      return {
        user,
        message: 'User created successfully in both authentication system and database',
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  private generateTempPassword(): string {
    // Generate a secure temporary password
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  async syncAuthUsersToDatabase(tenantId: string) {
    try {
      // Get all users from Supabase Auth
      const { data: { users }, error } = await this.supabase.auth.admin.listUsers();
      
      if (error) {
        console.error('Error fetching users from Supabase Auth:', error);
        throw error;
      }

      const syncedUsers = [];

      for (const authUser of users) {
        // Check if user metadata contains tenant_id and it matches
        const userTenantId = authUser.user_metadata?.tenant_id;
        if (userTenantId !== tenantId) {
          continue; // Skip users from other tenants
        }

        // Check if user already exists in local database
        const existingUser = await this.db.user.findUnique({
          where: { id: authUser.id },
        });

        if (!existingUser) {
          // Create user in local database
          const newUser = await this.db.user.create({
            data: {
              id: authUser.id,
              tenant_id: tenantId,
              email: authUser.email || '',
              first_name: authUser.user_metadata?.first_name || '',
              last_name: authUser.user_metadata?.last_name || '',
              phone: authUser.user_metadata?.phone || null,
              password_hash: '', // Password is managed by Supabase Auth
              roles: authUser.user_metadata?.roles || ['user'],
              status: 'active',
            },
            select: {
              id: true,
              email: true,
              first_name: true,
              last_name: true,
              phone: true,
              technician_number: true,
              pesticide_license_number: true,
              license_expiration_date: true,
            },
          });
          syncedUsers.push(newUser);
        }
      }

      return {
        synced: syncedUsers.length,
        users: syncedUsers,
        message: `Synced ${syncedUsers.length} users from authentication system`,
      };
    } catch (error) {
      console.error('Error syncing auth users to database:', error);
      throw error;
    }
  }
}
