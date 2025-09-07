import { Controller, Get, Post, Put, Body, Param, Query, Req } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { Request } from 'express';

@Controller('accounts')
export class BasicAccountsController {
  private supabase;

  constructor() {
    // Use new Supabase API key system - secret key bypasses RLS
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || '';
    
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
      
      // Verify the token and extract tenant ID
      const { data: { user }, error: authError } = await this.supabase.auth.getUser(token);
      if (authError || !user) {
        console.error('Authentication error:', authError);
        return { error: 'Invalid or expired token' };
      }

      // Extract tenant ID from user metadata
      const tenantId = user.user_metadata?.tenant_id;
      if (!tenantId) {
        console.error('No tenant ID found in user metadata');
        return { error: 'No tenant ID found for user' };
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
}
