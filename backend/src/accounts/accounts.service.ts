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
      return await client.from('accounts');
    });
  }

  /**
   * Get a specific account by ID for a tenant
   */
  async getAccountById(tenantId: string, accountId: string) {
    return this.executeSecureQuery(tenantId, async (client) => {
      return await client.from('accounts').eq('id', accountId).single();
    });
  }

  /**
   * Create a new account for a tenant
   */
  async createAccount(tenantId: string, accountData: any) {
    // Remove any existing tenant_id from data to prevent override
    const { tenant_id, ...cleanData } = accountData;
    
    return this.executeSecureQuery(tenantId, async (client) => {
      return await client.insert('accounts', cleanData);
    });
  }

  /**
   * Update an account for a tenant
   */
  async updateAccount(tenantId: string, accountId: string, updates: any) {
    // Remove any existing tenant_id from updates to prevent override
    const { tenant_id, id, ...cleanUpdates } = updates;
    
    return this.executeSecureQuery(tenantId, async (client) => {
      return await client
        .update('accounts', cleanUpdates)
        .eq('id', accountId);
    });
  }

  /**
   * Delete an account for a tenant
   */
  async deleteAccount(tenantId: string, accountId: string) {
    return this.executeSecureQuery(tenantId, async (client) => {
      return await client
        .delete('accounts')
        .eq('id', accountId);
    });
  }

  /**
   * Search accounts for a tenant
   */
  async searchAccounts(tenantId: string, searchTerm: string) {
    return this.executeSecureQuery(tenantId, async (client) => {
      return await client
        .from('accounts')
        .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
    });
  }
}


