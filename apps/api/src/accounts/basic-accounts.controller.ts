import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { Request } from 'express';

@Controller('accounts')
export class BasicAccountsController {
  private supabase;

  constructor(private readonly configService: ConfigService) {
    // Use new Supabase API key system - secret key bypasses RLS
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL') || '';
    const supabaseSecretKey = this.configService.get<string>('SUPABASE_SECRET_KEY') || '';
    
    this.supabase = createClient(supabaseUrl, supabaseSecretKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      db: {
        schema: 'public'
      }
    });
  }

  @Get()
  async getAccounts(@Req() req: Request) {
    try {
      // Extract JWT token from Authorization header for tenant validation
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { error: 'No valid authorization token provided' };
      }

      const token = authHeader.substring(7);
      
      // For development, extract tenant ID from token payload without verification
      let tenantId: string;
      try {
        // Decode JWT payload without verification for development
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3 || !tokenParts[1]) {
          throw new Error('Invalid JWT token format');
        }
        const payload = JSON.parse(atob(tokenParts[1]));
        tenantId = payload.tenant_id;
        
        if (!tenantId) {
          console.error('No tenant ID found in token payload');
          return { error: 'No tenant ID found in token' };
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        return { error: 'Invalid token format' };
      }

      console.log('Fetching accounts for tenant:', tenantId);

      // Test: Try to access a simple table first to see if service role works
      const { error: testError } = await this.supabase
        .from('accounts')
        .select('count')
        .limit(1);

      if (testError) {
        console.error('Service role test failed:', testError);
        return { error: `Service role access failed: ${testError.message}` };
      }

      console.log('Service role test passed, fetching accounts...');

      // Use service role to fetch accounts with tenant filtering
      // Note: Service role should bypass RLS policies
      const { data, error } = await this.supabase
        .from('accounts')
        .select('*')
        .eq('tenant_id', tenantId)
        .limit(100);

      if (error) {
        console.error('Error fetching accounts:', error);
        return { error: error.message };
      }

      return data || [];
    } catch (error) {
      console.error('Exception in getAccounts:', error);
      return { error: 'Internal server error' };
    }
  }

  @Get('search')
  async searchAccounts(@Query('q') searchTerm: string) {
    try {
      const { data, error } = await this.supabase
        .from('accounts')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .limit(50);

      if (error) {
        console.error('Error searching accounts:', error);
        return { error: error.message };
      }

      return data;
    } catch (error) {
      console.error('Exception in searchAccounts:', error);
      return { error: 'Internal server error' };
    }
  }

  @Post()
  async createAccount(@Body() accountData: any) {
    try {
      // Add tenant_id if not present
      const dataWithTenant = {
        ...accountData,
        tenant_id: accountData.tenant_id || '7193113e-ece2-4f7b-ae8c-176df4367e28'
      };
      
      const { data, error } = await this.supabase
        .from('accounts')
        .insert(dataWithTenant)
        .select()
        .single();

      if (error) {
        console.error('Error creating account:', error);
        return { error: error.message };
      }

      return data;
    } catch (error) {
      console.error('Exception in createAccount:', error);
      return { error: 'Internal server error' };
    }
  }

  @Put(':id')
  async updateAccount(@Param('id') accountId: string, @Body() updates: any) {
    try {
      const { data, error } = await this.supabase
        .from('accounts')
        .update(updates)
        .eq('id', accountId)
        .select()
        .single();

      if (error) {
        console.error('Error updating account:', error);
        return { error: error.message };
      }

      return data;
    } catch (error) {
      console.error('Exception in updateAccount:', error);
      return { error: 'Internal server error' };
    }
  }

  @Delete(':id')
  async deleteAccount(@Param('id') accountId: string, @Req() req: Request) {
    try {
      // Extract JWT token from Authorization header for tenant validation
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { error: 'No valid authorization token provided' };
      }

      const token = authHeader.substring(7);
      
      // For development, extract tenant ID from token payload without verification
      let tenantId: string;
      try {
        // Decode JWT payload without verification for development
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3 || !tokenParts[1]) {
          throw new Error('Invalid JWT token format');
        }
        const payload = JSON.parse(atob(tokenParts[1]));
        tenantId = payload.tenant_id;
        
        if (!tenantId) {
          console.error('No tenant ID found in token payload');
          return { error: 'No tenant ID found in token' };
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        return { error: 'Invalid token format' };
      }

      console.log('Deleting account:', accountId, 'for tenant:', tenantId);

      // First, verify the account belongs to the tenant
      const { data: existingAccount, error: fetchError } = await this.supabase
        .from('accounts')
        .select('id, name, tenant_id')
        .eq('id', accountId)
        .eq('tenant_id', tenantId)
        .single();

      if (fetchError || !existingAccount) {
        console.error('Account not found or access denied:', fetchError);
        return { error: 'Account not found or access denied' };
      }

      // Delete the account
      const { error } = await this.supabase
        .from('accounts')
        .delete()
        .eq('id', accountId)
        .eq('tenant_id', tenantId);

      if (error) {
        console.error('Error deleting account:', error);
        return { error: error.message };
      }

      console.log('Account deleted successfully:', existingAccount.name);
      return { 
        success: true, 
        message: `Account "${existingAccount.name}" deleted successfully`,
        deletedAccount: existingAccount
      };
    } catch (error) {
      console.error('Exception in deleteAccount:', error);
      return { error: 'Internal server error' };
    }
  }
}
