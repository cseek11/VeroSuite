import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { Request } from 'express';

@Controller('accounts')
export class BasicAccountsController {
  private supabase;
  private readonly logger = new Logger(BasicAccountsController.name);

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
    const traceId = randomUUID();
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
          this.logger.error('No tenant ID found in token payload', {
            operation: 'getAccounts',
            traceId,
            errorCode: 'MISSING_TENANT_ID',
          });
          return { error: 'No tenant ID found in token' };
        }
      } catch (error) {
        this.logger.error('Error decoding token', {
          operation: 'getAccounts',
          traceId,
          error: error instanceof Error ? error.message : 'Unknown error',
          errorCode: 'TOKEN_DECODE_ERROR',
        });
        return { error: 'Invalid token format' };
      }

      this.logger.debug('Fetching accounts for tenant', {
        operation: 'getAccounts',
        traceId,
        tenantId,
      });

      // Test: Try to access a simple table first to see if service role works
      const { error: testError } = await this.supabase
        .from('accounts')
        .select('count')
        .limit(1);

      if (testError) {
        this.logger.error('Service role test failed', {
          operation: 'getAccounts',
          traceId,
          tenantId,
          error: testError.message,
          errorCode: 'SERVICE_ROLE_TEST_FAILED',
        });
        return { error: `Service role access failed: ${testError.message}` };
      }

      this.logger.debug('Service role test passed, fetching accounts', {
        operation: 'getAccounts',
        traceId,
        tenantId,
      });

      // Use service role to fetch accounts with tenant filtering
      // Note: Service role should bypass RLS policies
      const { data, error } = await this.supabase
        .from('accounts')
        .select('*')
        .eq('tenant_id', tenantId)
        .limit(100);

      if (error) {
        this.logger.error('Error fetching accounts', {
          operation: 'getAccounts',
          traceId,
          tenantId,
          error: error.message,
          errorCode: 'FETCH_ACCOUNTS_ERROR',
        });
        return { error: error.message };
      }

      return data || [];
    } catch (error) {
      this.logger.error('Exception in getAccounts', {
        operation: 'getAccounts',
        traceId,
        error: error instanceof Error ? error.message : 'Unknown error',
        errorCode: 'GET_ACCOUNTS_EXCEPTION',
        rootCause: error instanceof Error ? error.stack : undefined,
      });
      return { error: 'Internal server error' };
    }
  }

  @Get('search')
  async searchAccounts(@Query('q') searchTerm: string) {
    const traceId = randomUUID();
    try {
      const { data, error } = await this.supabase
        .from('accounts')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .limit(50);

      if (error) {
        this.logger.error('Error searching accounts', {
          operation: 'searchAccounts',
          traceId,
          searchTerm,
          error: error.message,
          errorCode: 'SEARCH_ACCOUNTS_ERROR',
        });
        return { error: error.message };
      }

      return data;
    } catch (error) {
      this.logger.error('Exception in searchAccounts', {
        operation: 'searchAccounts',
        traceId,
        searchTerm,
        error: error instanceof Error ? error.message : 'Unknown error',
        errorCode: 'SEARCH_ACCOUNTS_EXCEPTION',
        rootCause: error instanceof Error ? error.stack : undefined,
      });
      return { error: 'Internal server error' };
    }
  }

  @Post()
  async createAccount(@Body() accountData: any) {
    const traceId = randomUUID();
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
        this.logger.error('Error creating account', {
          operation: 'createAccount',
          traceId,
          tenantId: accountData.tenant_id,
          error: error.message,
          errorCode: 'CREATE_ACCOUNT_ERROR',
        });
        return { error: error.message };
      }

      return data;
    } catch (error) {
      this.logger.error('Exception in createAccount', {
        operation: 'createAccount',
        traceId,
        error: error instanceof Error ? error.message : 'Unknown error',
        errorCode: 'CREATE_ACCOUNT_EXCEPTION',
        rootCause: error instanceof Error ? error.stack : undefined,
      });
      return { error: 'Internal server error' };
    }
  }

  @Put(':id')
  async updateAccount(@Param('id') accountId: string, @Body() updates: any) {
    const traceId = randomUUID();
    try {
      const { data, error } = await this.supabase
        .from('accounts')
        .update(updates)
        .eq('id', accountId)
        .select()
        .single();

      if (error) {
        this.logger.error('Error updating account', {
          operation: 'updateAccount',
          traceId,
          accountId,
          error: error.message,
          errorCode: 'UPDATE_ACCOUNT_ERROR',
        });
        return { error: error.message };
      }

      return data;
    } catch (error) {
      this.logger.error('Exception in updateAccount', {
        operation: 'updateAccount',
        traceId,
        accountId,
        error: error instanceof Error ? error.message : 'Unknown error',
        errorCode: 'UPDATE_ACCOUNT_EXCEPTION',
        rootCause: error instanceof Error ? error.stack : undefined,
      });
      return { error: 'Internal server error' };
    }
  }

  @Delete(':id')
  async deleteAccount(@Param('id') accountId: string, @Req() req: Request) {
    const traceId = randomUUID();
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
          this.logger.error('No tenant ID found in token payload', {
            operation: 'deleteAccount',
            traceId,
            accountId,
            errorCode: 'MISSING_TENANT_ID',
          });
          return { error: 'No tenant ID found in token' };
        }
      } catch (error) {
        this.logger.error('Error decoding token', {
          operation: 'deleteAccount',
          traceId,
          accountId,
          error: error instanceof Error ? error.message : 'Unknown error',
          errorCode: 'TOKEN_DECODE_ERROR',
        });
        return { error: 'Invalid token format' };
      }

      this.logger.debug('Deleting account', {
        operation: 'deleteAccount',
        traceId,
        accountId,
        tenantId,
      });

      // First, verify the account belongs to the tenant
      const { data: existingAccount, error: fetchError } = await this.supabase
        .from('accounts')
        .select('id, name, tenant_id')
        .eq('id', accountId)
        .eq('tenant_id', tenantId)
        .single();

      if (fetchError || !existingAccount) {
        this.logger.error('Account not found or access denied', {
          operation: 'deleteAccount',
          traceId,
          accountId,
          tenantId,
          error: fetchError?.message,
          errorCode: 'ACCOUNT_NOT_FOUND_OR_DENIED',
        });
        return { error: 'Account not found or access denied' };
      }

      // Delete the account
      const { error } = await this.supabase
        .from('accounts')
        .delete()
        .eq('id', accountId)
        .eq('tenant_id', tenantId);

      if (error) {
        this.logger.error('Error deleting account', {
          operation: 'deleteAccount',
          traceId,
          accountId,
          tenantId,
          error: error.message,
          errorCode: 'DELETE_ACCOUNT_ERROR',
        });
        return { error: error.message };
      }

      this.logger.log('Account deleted successfully', {
        operation: 'deleteAccount',
        traceId,
        accountId,
        tenantId,
        accountName: existingAccount.name,
      });
      return { 
        success: true, 
        message: `Account "${existingAccount.name}" deleted successfully`,
        deletedAccount: existingAccount
      };
    } catch (error) {
      this.logger.error('Exception in deleteAccount', {
        operation: 'deleteAccount',
        traceId,
        accountId,
        error: error instanceof Error ? error.message : 'Unknown error',
        errorCode: 'DELETE_ACCOUNT_EXCEPTION',
        rootCause: error instanceof Error ? error.stack : undefined,
      });
      return { error: 'Internal server error' };
    }
  }
}
