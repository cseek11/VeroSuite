import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../common/services/supabase.service';

@Injectable()
export abstract class TenantAwareService {
  constructor(protected readonly supabaseService: SupabaseService) {}

  /**
   * Get Supabase client with tenant context for secure queries
   */
  protected getSupabaseWithTenant(tenantId: string) {
    const supabase = this.supabaseService.getClient();
    
    return {
      // Secure SELECT with tenant filtering
      from: (table: string) => {
        return supabase
          .from(table)
          .select()
          .eq('tenant_id', tenantId);
      },
      
      // Secure INSERT with automatic tenant_id
      insert: (table: string, data: any) => {
        return supabase
          .from(table)
          .insert({ ...data, tenant_id: tenantId });
      },
      
      // Secure UPDATE with tenant filtering
      update: (table: string, data: any) => {
        return supabase
          .from(table)
          .update(data)
          .eq('tenant_id', tenantId);
      },
      
      // Secure DELETE with tenant filtering
      delete: (table: string) => {
        return supabase
          .from(table)
          .delete()
          .eq('tenant_id', tenantId);
      },

      // Raw Supabase client for complex queries (use carefully)
      raw: () => supabase
    };
  }

  /**
   * Execute a secure query with automatic tenant filtering
   */
  protected async executeSecureQuery<T>(
    tenantId: string,
    queryBuilder: (client: any) => Promise<{ data: T; error: any }>
  ): Promise<T> {
    const client = this.getSupabaseWithTenant(tenantId);
    const { data, error } = await queryBuilder(client);
    
    if (error) {
      throw new Error(`Database query failed: ${error.message}`);
    }
    
    return data;
  }
}


