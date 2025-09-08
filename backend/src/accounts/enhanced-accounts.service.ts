import { Injectable, Logger } from '@nestjs/common';
import { TenantAwareService } from '../services/tenant-aware.service';
import { SupabaseService } from '../common/services/supabase.service';

export interface ServiceResponse<T> {
  data?: T;
  error?: string | undefined;
  success: boolean;
  metadata?: {
    operation: string;
    timestamp: Date;
    affectedRows?: number;
    validationWarnings?: string[];
  };
}

export interface UpdateAccountData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  [key: string]: any;
}

@Injectable()
export class EnhancedAccountsService extends TenantAwareService {
  private readonly logger = new Logger(EnhancedAccountsService.name);

  constructor(supabaseService: SupabaseService) {
    super(supabaseService);
  }

  /**
   * Get all accounts for a tenant with enhanced error handling
   */
  async getAccountsForTenant(tenantId: string): Promise<ServiceResponse<any[]>> {
    this.logger.log(`Getting accounts for tenant: ${tenantId}`);
    
    try {
      const result = await this.executeSecureQuery(tenantId, async (client) => {
        const { data, error } = await client
          .from('accounts')
          .select('*')
          .order('name', { ascending: true });
        
        if (error) {
          this.logger.error(`Database error getting accounts: ${error.message}`, error);
          return { data: null, error: error.message };
        }
        
        return { data, error: null };
      });

      if (result.error) {
        return {
          success: false,
          error: result.error,
          metadata: {
            operation: 'getAccountsForTenant',
            timestamp: new Date()
          }
        };
      }

      return {
        success: true,
        data: result.data || [],
        metadata: {
          operation: 'getAccountsForTenant',
          timestamp: new Date(),
          affectedRows: result.data?.length || 0
        }
      };

    } catch (error) {
      this.logger.error(`Failed to get accounts for tenant ${tenantId}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          operation: 'getAccountsForTenant',
          timestamp: new Date()
        }
      };
    }
  }

  /**
   * Get account by ID with validation
   */
  async getAccountById(tenantId: string, accountId: string): Promise<ServiceResponse<any>> {
    this.logger.log(`Getting account ${accountId} for tenant: ${tenantId}`);
    
    // Validate inputs
    const validation = this.validateAccountId(accountId);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error || 'Validation failed',
        metadata: {
          operation: 'getAccountById',
          timestamp: new Date(),
          validationWarnings: validation.warnings
        }
      };
    }

    try {
      const result = await this.executeSecureQuery(tenantId, async (client) => {
        const { data, error } = await client
          .from('accounts')
          .select('*')
          .eq('id', accountId)
          .single();
        
        if (error) {
          this.logger.error(`Database error getting account ${accountId}: ${error.message}`, error);
          return { data: null, error: error.message };
        }
        
        return { data, error: null };
      });

      if (result.error) {
        return {
          success: false,
          error: result.error,
          metadata: {
            operation: 'getAccountById',
            timestamp: new Date()
          }
        };
      }

      return {
        success: true,
        data: result.data,
        metadata: {
          operation: 'getAccountById',
          timestamp: new Date()
        }
      };

    } catch (error) {
      this.logger.error(`Failed to get account ${accountId} for tenant ${tenantId}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          operation: 'getAccountById',
          timestamp: new Date()
        }
      };
    }
  }

  /**
   * Update account with comprehensive validation and atomic operation
   */
  async updateAccount(
    tenantId: string, 
    accountId: string, 
    updates: UpdateAccountData
  ): Promise<ServiceResponse<any>> {
    this.logger.log(`Updating account ${accountId} for tenant: ${tenantId}`, { updates });
    
    try {
      // 1. Validate inputs
      const validation = this.validateUpdateData(updates);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error || 'Validation failed',
          metadata: {
            operation: 'updateAccount',
            timestamp: new Date(),
            validationWarnings: validation.warnings
          }
        };
      }

      // 2. Check if account exists first
      const existingAccount = await this.getAccountById(tenantId, accountId);
      if (!existingAccount.success || !existingAccount.data) {
        return {
          success: false,
          error: `Account ${accountId} not found`,
          metadata: {
            operation: 'updateAccount',
            timestamp: new Date()
          }
        };
      }

      // 3. Prepare clean update data
      const cleanUpdates = this.sanitizeUpdateData(updates);
      cleanUpdates.updated_at = new Date().toISOString();

      this.logger.log(`Executing update with clean data:`, cleanUpdates);

      // 4. Execute atomic update
      const result = await this.executeSecureQuery(tenantId, async (client) => {
        const { data, error } = await client
          .from('accounts')
          .update(cleanUpdates)
          .eq('id', accountId)
          .eq('tenant_id', tenantId)
          .select('*')
          .single();
        
        if (error) {
          this.logger.error(`Database error updating account ${accountId}: ${error.message}`, error);
          return { data: null, error: error.message };
        }
        
        this.logger.log(`Account ${accountId} updated successfully:`, data);
        return { data, error: null };
      });

      if (result.error) {
        return {
          success: false,
          error: result.error,
          metadata: {
            operation: 'updateAccount',
            timestamp: new Date()
          }
        };
      }

      // 5. Validate update was successful
      const updateValidation = this.validateUpdateResult(cleanUpdates, result.data);
      
      return {
        success: true,
        data: result.data,
        metadata: {
          operation: 'updateAccount',
          timestamp: new Date(),
          affectedRows: 1,
          validationWarnings: updateValidation.warnings
        }
      };

    } catch (error) {
      this.logger.error(`Failed to update account ${accountId} for tenant ${tenantId}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          operation: 'updateAccount',
          timestamp: new Date()
        }
      };
    }
  }

  /**
   * Validate account ID format
   */
  private validateAccountId(accountId: string): { isValid: boolean; error?: string; warnings: string[] } {
    const warnings: string[] = [];
    
    if (!accountId) {
      return { isValid: false, error: 'Account ID is required', warnings };
    }
    
    if (typeof accountId !== 'string') {
      return { isValid: false, error: 'Account ID must be a string', warnings };
    }
    
    // Basic UUID format check
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(accountId)) {
      return { isValid: false, error: 'Account ID must be a valid UUID', warnings };
    }
    
    return { isValid: true, warnings };
  }

  /**
   * Validate update data
   */
  private validateUpdateData(updates: UpdateAccountData): { 
    isValid: boolean; 
    error?: string; 
    warnings: string[] 
  } {
    const warnings: string[] = [];
    
    if (!updates || typeof updates !== 'object') {
      return { isValid: false, error: 'Update data must be an object', warnings };
    }
    
    if (Object.keys(updates).length === 0) {
      return { isValid: false, error: 'At least one field must be updated', warnings };
    }
    
    // Validate email format if provided
    if (updates.email && !this.isValidEmail(updates.email)) {
      return { isValid: false, error: 'Invalid email format', warnings };
    }
    
    // Validate phone format if provided
    if (updates.phone && !this.isValidPhone(updates.phone)) {
      warnings.push('Phone number format may not be standard');
    }
    
    // Validate state format if provided
    if (updates.state && updates.state.length !== 2) {
      warnings.push('State should be a 2-letter abbreviation');
    }
    
    return { isValid: true, warnings };
  }

  /**
   * Sanitize update data by removing invalid fields
   */
  private sanitizeUpdateData(updates: UpdateAccountData): any {
    const allowed = ['name', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    const sanitized: any = {};
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowed.includes(key) && value !== undefined && value !== null && value !== '') {
        sanitized[key] = typeof value === 'string' ? value.trim() : value;
      }
    }
    
    return sanitized;
  }

  /**
   * Validate that update was successful
   */
  private validateUpdateResult(sentData: any, returnedData: any): { warnings: string[] } {
    const warnings: string[] = [];
    
    for (const [key, value] of Object.entries(sentData)) {
      if (key === 'updated_at') continue; // Skip timestamp field
      
      if (returnedData[key] === undefined) {
        warnings.push(`Field '${key}' not returned in response`);
      } else if (returnedData[key] !== value) {
        warnings.push(`Field '${key}' value mismatch: sent '${value}', received '${returnedData[key]}'`);
      }
    }
    
    return { warnings };
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone format (lenient)
   */
  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[\d\s\(\)\-\.]{10,}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Create account with validation
   */
  async createAccount(tenantId: string, accountData: any): Promise<ServiceResponse<any>> {
    this.logger.log(`Creating account for tenant: ${tenantId}`, { accountData });
    
    try {
      // Validate required fields
      if (!accountData.name) {
        return {
          success: false,
          error: 'Account name is required',
          metadata: {
            operation: 'createAccount',
            timestamp: new Date()
          }
        };
      }

      // Remove tenant_id from data to prevent override
      const { tenant_id, ...cleanData } = accountData;
      cleanData.created_at = new Date().toISOString();
      cleanData.updated_at = cleanData.created_at;

      const result = await this.executeSecureQuery(tenantId, async (client) => {
        const { data, error } = await client
          .from('accounts')
          .insert([cleanData])
          .select('*')
          .single();
        
        if (error) {
          this.logger.error(`Database error creating account: ${error.message}`, error);
          return { data: null, error: error.message };
        }
        
        return { data, error: null };
      });

      if (result.error) {
        return {
          success: false,
          error: result.error,
          metadata: {
            operation: 'createAccount',
            timestamp: new Date()
          }
        };
      }

      return {
        success: true,
        data: result.data,
        metadata: {
          operation: 'createAccount',
          timestamp: new Date(),
          affectedRows: 1
        }
      };

    } catch (error) {
      this.logger.error(`Failed to create account for tenant ${tenantId}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          operation: 'createAccount',
          timestamp: new Date()
        }
      };
    }
  }

  /**
   * Delete account with safety checks
   */
  async deleteAccount(tenantId: string, accountId: string): Promise<ServiceResponse<void>> {
    this.logger.log(`Deleting account ${accountId} for tenant: ${tenantId}`);
    
    try {
      // Check if account exists first
      const existingAccount = await this.getAccountById(tenantId, accountId);
      if (!existingAccount.success || !existingAccount.data) {
        return {
          success: false,
          error: `Account ${accountId} not found`,
          metadata: {
            operation: 'deleteAccount',
            timestamp: new Date()
          }
        };
      }

      const result = await this.executeSecureQuery(tenantId, async (client) => {
        const { data, error } = await client
          .from('accounts')
          .delete()
          .eq('id', accountId)
          .eq('tenant_id', tenantId)
          .select('*');
        
        if (error) {
          this.logger.error(`Database error deleting account ${accountId}: ${error.message}`, error);
          return { data: null, error: error.message };
        }
        
        return { data, error: null };
      });

      if (result.error) {
        return {
          success: false,
          error: result.error,
          metadata: {
            operation: 'deleteAccount',
            timestamp: new Date()
          }
        };
      }

      return {
        success: true,
        metadata: {
          operation: 'deleteAccount',
          timestamp: new Date(),
          affectedRows: 1
        }
      };

    } catch (error) {
      this.logger.error(`Failed to delete account ${accountId} for tenant ${tenantId}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          operation: 'deleteAccount',
          timestamp: new Date()
        }
      };
    }
  }
}
