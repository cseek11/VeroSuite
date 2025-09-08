import { Injectable } from '@nestjs/common';
import { TenantAwareService } from '../services/tenant-aware.service';
import { SupabaseService } from '../common/services/supabase.service';

@Injectable()
export class AccountsService extends TenantAwareService {
  constructor(supabaseService: SupabaseService) {
    super(supabaseService);
  }

  /**
   * Get all accounts for a specific tenant
   */
  async getAccountsForTenant(tenantId: string) {
    return this.executeSecureQuery(tenantId, async (client) => {
      const { data, error } = await client.from('accounts').select();
      return { data, error };
    });
  }

  /**
   * Get a specific account by ID for a tenant
   */
  async getAccountById(tenantId: string, accountId: string) {
    return this.executeSecureQuery(tenantId, async (client) => {
      const { data, error } = await client.from('accounts').eq('id', accountId).single();
      return { data, error };
    });
  }

  /**
   * Create a new account for a tenant
   */
  async createAccount(tenantId: string, accountData: any) {
    // Remove any existing tenant_id from data to prevent override
    const { tenant_id, ...cleanData } = accountData;
    
    return this.executeSecureQuery(tenantId, async (client) => {
      const { data, error } = await client.insert('accounts', cleanData);
      return { data, error };
    });
  }

  /**
   * Update an account for a tenant
   */
  async updateAccount(tenantId: string, accountId: string, updates: any) {
    console.log('🔧 Backend updateAccount called with:', { tenantId, accountId, updates });
    
    // Normalize alternate field names and remove disallowed fields
    const normalized: any = {
      ...updates,
    };
    // Map common alternates → canonical columns
    if (normalized.phone_number && !normalized.phone) {
      normalized.phone = normalized.phone_number;
    }
    if (normalized.zipCode && !normalized.zip_code) {
      normalized.zip_code = normalized.zipCode;
    }

    // Remove any existing tenant_id or id from updates to prevent override
    const { tenant_id, id, phone_number, zipCode, ...cleanUpdates } = normalized;
    console.log('🔧 Clean updates:', cleanUpdates);
    
    // Validate that we have updates to make
    if (!cleanUpdates || Object.keys(cleanUpdates).length === 0) {
      throw new Error('No valid updates provided');
    }
    
    return this.executeSecureQuery(tenantId, async (client) => {
      console.log('🔧 Executing update query...');
      
      // First, let's check if the account exists and get its current data
      console.log('🔧 Looking for account with ID:', accountId, 'and tenant_id:', tenantId);
      const { data: existingAccount, error: existingError } = await client
        .from('accounts')
        .select('*')
        .eq('id', accountId)
        .eq('tenant_id', tenantId)
        .single();
      console.log('🔧 Existing account data:', existingAccount);
      console.log('🔧 Existing account error:', existingError);
      
      if (existingError) {
        throw new Error(`Account not found: ${existingError.message}`);
      }
      
      // Add updated_at timestamp
      const updatesWithTimestamp: any = {
        ...cleanUpdates,
        updated_at: new Date().toISOString()
      };
      // If phone is present, also maintain phone_digits for normalized searches
      if (typeof cleanUpdates.phone === 'string') {
        const onlyDigits = cleanUpdates.phone.replace(/\D+/g, '');
        updatesWithTimestamp.phone_digits = onlyDigits || null;
      }
      
      console.log('🔧 Final updates with timestamp:', updatesWithTimestamp);
      
      let { data, error } = await client
        .update('accounts', updatesWithTimestamp)
        .eq('id', accountId)
        .select('id,name,email,phone,address,city,state,zip_code,updated_at')
        .single();
      
      console.log('🔧 Update result data:', data);
      console.log('🔧 Update result error:', error);
      
      if (error) {
        console.error('🔧 Update operation failed:', error);
        return { data: null, error };
      }

      // Always re-fetch to return the latest persisted row (avoids any projection/returning anomalies)
      const { data: refetched, error: refetchError } = await client
        .from('accounts')
        .select('*')
        .eq('id', accountId)
        .single();
      if (!refetchError && refetched) {
        console.log('🔧 Refetched updated account row:', refetched);
        data = refetched as any;
      }
      
      return { data, error: null };
    });
  }

  /**
   * Delete an account for a tenant
   */
  async deleteAccount(tenantId: string, accountId: string) {
    return this.executeSecureQuery(tenantId, async (client) => {
      console.log('🔧 Deleting account:', { tenantId, accountId });
      const { data, error } = await client
        .delete('accounts')
        .eq('id', accountId)
        .select('*');
      console.log('🔧 Delete result:', { data, error });
      return { data, error };
    });
  }

  /**
   * Search accounts for a tenant
   */
  async searchAccounts(tenantId: string, searchTerm: string) {
    return this.executeSecureQuery(tenantId, async (client) => {
      const { data, error } = await client
        .from('accounts')
        .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      return { data, error };
    });
  }
}


