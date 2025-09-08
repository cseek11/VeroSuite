// ============================================================================
// ENHANCED ACTION HANDLER SERVICE
// ============================================================================
// Robust action execution with transactions, validation, and error recovery

import { secureApiClient } from './secure-api-client';
import type { EnhancedIntentResult } from './enhanced-intent-service';
import { queryClient } from './queryClient';

export interface EnhancedActionResult {
  success: boolean;
  message: string;
  data?: any;
  errors: string[];
  warnings: string[];
  rollbackData?: any;
  validationResults?: ValidationResults;
  suggestions?: string[];
  executionTime?: number;
  transactionId?: string;
}

export interface ValidationResults {
  [field: string]: {
    isValid: boolean;
    issues: string[];
    correctedValue?: string;
  };
}

export interface TransactionContext {
  id: string;
  operations: TransactionOperation[];
  rollbackData: any[];
  startTime: Date;
  status: 'pending' | 'committed' | 'rolled_back' | 'failed';
}

export interface TransactionOperation {
  type: 'create' | 'update' | 'delete';
  table: string;
  id?: string;
  data?: any;
  originalData?: any;
}

class EnhancedActionHandler {
  private activeTransactions = new Map<string, TransactionContext>();

  /**
   * Execute action with comprehensive error handling and validation
   */
  async executeAction(intentResult: EnhancedIntentResult): Promise<EnhancedActionResult> {
    const startTime = Date.now();
    const transactionId = crypto.randomUUID();
    
    console.log('🚀 Enhanced action execution started:', {
      intent: intentResult.intent,
      transactionId,
      entities: intentResult.entities
    });

    try {
      // 1. Pre-execution validation
      const preValidation = await this.preValidateAction(intentResult);
      if (!preValidation.isValid) {
        return {
          success: false,
          message: 'Validation failed',
          errors: preValidation.errors,
          warnings: [],
          suggestions: preValidation.suggestions,
          executionTime: Date.now() - startTime
        };
      }

      // 2. Create transaction context
      const transaction = this.createTransaction(transactionId);

      // 3. Execute action with transaction support
      const result = await this.executeWithTransaction(intentResult, transaction);

      // 4. Commit or rollback based on result
      if (result.success) {
        await this.commitTransaction(transaction);
        await this.invalidateRelevantCaches(intentResult.intent);
      } else {
        await this.rollbackTransaction(transaction);
      }

      result.executionTime = Date.now() - startTime;
      result.transactionId = transactionId;

      return result;

    } catch (error) {
      console.error('🔴 Enhanced action execution failed:', error);
      
      // Attempt rollback if transaction exists
      const transaction = this.activeTransactions.get(transactionId);
      if (transaction) {
        await this.rollbackTransaction(transaction);
      }

      return {
        success: false,
        message: 'Action execution failed',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        warnings: [],
        suggestions: ['Please try again or contact support'],
        executionTime: Date.now() - startTime,
        transactionId
      };
    } finally {
      this.activeTransactions.delete(transactionId);
    }
  }

  /**
   * Pre-validate action before execution
   */
  private async preValidateAction(intentResult: EnhancedIntentResult): Promise<{
    isValid: boolean;
    errors: string[];
    suggestions: string[];
  }> {
    const errors: string[] = [];
    const suggestions: string[] = [];

    // Check if we have validation errors from intent classification
    if (intentResult.validationErrors.length > 0) {
      errors.push(...intentResult.validationErrors);
    }

    // Intent-specific validation
    switch (intentResult.intent) {
      case 'updateCustomer':
        await this.validateUpdateCustomer(intentResult, errors, suggestions);
        break;
      case 'deleteCustomer':
        await this.validateDeleteCustomer(intentResult, errors, suggestions);
        break;
      case 'createCustomer':
        await this.validateCreateCustomer(intentResult, errors, suggestions);
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
      suggestions
    };
  }

  /**
   * Validate customer update operation
   */
  private async validateUpdateCustomer(
    intentResult: EnhancedIntentResult,
    errors: string[],
    suggestions: string[]
  ): Promise<void> {
    const { entities } = intentResult;

    // Check if customer name is provided
    if (!entities.customerName) {
      errors.push('Customer name is required for updates');
      suggestions.push('Please specify which customer to update');
      return;
    }

    // Check if customer exists
    try {
      const customer = await this.findCustomerSafely(entities.customerName);
      if (!customer) {
        errors.push(`Customer "${entities.customerName}" not found`);
        suggestions.push('Please check the customer name spelling');
        return;
      }

      // Validate update fields
      if (entities.phone && entities.validation.phone && !entities.validation.phone.isValid) {
        errors.push(...entities.validation.phone.issues);
        suggestions.push(...entities.validation.phone.suggestions);
      }

      if (entities.email && entities.validation.email && !entities.validation.email.isValid) {
        errors.push(...entities.validation.email.issues);
        suggestions.push(...entities.validation.email.suggestions);
      }

    } catch (error) {
      errors.push('Failed to verify customer exists');
      suggestions.push('Please try again or check your connection');
    }
  }

  /**
   * Safely find customer with error handling
   */
  private async findCustomerSafely(customerName: string): Promise<any | null> {
    try {
      const customers = await secureApiClient.getAllAccounts();
      
      if (!customers || customers.length === 0) {
        return null;
      }

      // Try exact match first
      const exactMatch = customers.find((c: any) => 
        c.name.toLowerCase() === customerName.toLowerCase()
      );
      if (exactMatch) return exactMatch;

      // Try partial match
      const partialMatch = customers.find((c: any) => 
        c.name.toLowerCase().includes(customerName.toLowerCase()) ||
        customerName.toLowerCase().includes(c.name.toLowerCase())
      );
      
      return partialMatch || null;

    } catch (error) {
      console.error('🔴 Error finding customer:', error);
      throw new Error('Failed to search for customer');
    }
  }

  /**
   * Execute action with transaction support
   */
  private async executeWithTransaction(
    intentResult: EnhancedIntentResult,
    transaction: TransactionContext
  ): Promise<EnhancedActionResult> {
    
    switch (intentResult.intent) {
      case 'updateCustomer':
        return await this.executeUpdateCustomer(intentResult, transaction);
      case 'deleteCustomer':
        return await this.executeDeleteCustomer(intentResult, transaction);
      case 'createCustomer':
        return await this.executeCreateCustomer(intentResult, transaction);
      default:
        throw new Error(`Unsupported intent: ${intentResult.intent}`);
    }
  }

  /**
   * Execute customer update with transaction support
   */
  private async executeUpdateCustomer(
    intentResult: EnhancedIntentResult,
    transaction: TransactionContext
  ): Promise<EnhancedActionResult> {
    const { entities } = intentResult;
    
    try {
      // Find customer
      const customer = await this.findCustomerSafely(entities.customerName!);
      if (!customer) {
        return {
          success: false,
          message: `Customer "${entities.customerName}" not found`,
          errors: ['Customer not found'],
          warnings: [],
          suggestions: ['Please check the customer name spelling']
        };
      }

      // Store original data for rollback
      const originalData = { ...customer };
      
      // Prepare update data
      const updateData: any = {};
      if (entities.phone) updateData.phone = entities.phone;
      if (entities.email) updateData.email = entities.email;
      if (entities.address) updateData.address = entities.address;
      if (entities.city) updateData.city = entities.city;
      if (entities.state) updateData.state = entities.state;
      if (entities.zipCode) updateData.zipCode = entities.zipCode;

      // Add to transaction
      this.addTransactionOperation(transaction, {
        type: 'update',
        table: 'accounts',
        id: customer.id,
        data: updateData,
        originalData
      });

      // Execute update
      console.log('🔧 Executing customer update:', { 
        customerId: customer.id, 
        updateData 
      });

      const result = await secureApiClient.updateAccount(customer.id, updateData);
      
      console.log('🔧 Update result:', result);

      // Validate result
      if (!result || typeof result !== 'object') {
        throw new Error('Invalid response from update operation');
      }

      return {
        success: true,
        message: `Customer "${entities.customerName}" updated successfully`,
        data: result,
        errors: [],
        warnings: [],
        suggestions: []
      };

    } catch (error) {
      console.error('🔴 Customer update failed:', error);
      
      return {
        success: false,
        message: 'Failed to update customer',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        warnings: [],
        suggestions: ['Please try again or contact support']
      };
    }
  }

  /**
   * Create transaction context
   */
  private createTransaction(id: string): TransactionContext {
    const transaction: TransactionContext = {
      id,
      operations: [],
      rollbackData: [],
      startTime: new Date(),
      status: 'pending'
    };
    
    this.activeTransactions.set(id, transaction);
    return transaction;
  }

  /**
   * Add operation to transaction
   */
  private addTransactionOperation(
    transaction: TransactionContext,
    operation: TransactionOperation
  ): void {
    transaction.operations.push(operation);
    if (operation.originalData) {
      transaction.rollbackData.push(operation.originalData);
    }
  }

  /**
   * Commit transaction
   */
  private async commitTransaction(transaction: TransactionContext): Promise<void> {
    try {
      transaction.status = 'committed';
      console.log('✅ Transaction committed:', transaction.id);
    } catch (error) {
      console.error('🔴 Transaction commit failed:', error);
      transaction.status = 'failed';
      throw error;
    }
  }

  /**
   * Rollback transaction
   */
  private async rollbackTransaction(transaction: TransactionContext): Promise<void> {
    try {
      console.log('🔄 Rolling back transaction:', transaction.id);
      
      // Reverse operations in reverse order
      for (let i = transaction.operations.length - 1; i >= 0; i--) {
        const operation = transaction.operations[i];
        await this.rollbackOperation(operation);
      }
      
      transaction.status = 'rolled_back';
      console.log('✅ Transaction rolled back:', transaction.id);
      
    } catch (error) {
      console.error('🔴 Transaction rollback failed:', error);
      transaction.status = 'failed';
    }
  }

  /**
   * Rollback individual operation
   */
  private async rollbackOperation(operation: TransactionOperation): Promise<void> {
    try {
      switch (operation.type) {
        case 'update':
          if (operation.id && operation.originalData) {
            await secureApiClient.updateAccount(operation.id, operation.originalData);
          }
          break;
        case 'create':
          if (operation.id) {
            await secureApiClient.deleteAccount(operation.id);
          }
          break;
        case 'delete':
          if (operation.originalData) {
            await secureApiClient.createAccount(operation.originalData);
          }
          break;
      }
    } catch (error) {
      console.error('🔴 Failed to rollback operation:', error);
    }
  }

  /**
   * Invalidate relevant caches after successful operation
   */
  private async invalidateRelevantCaches(intent: string): Promise<void> {
    try {
      switch (intent) {
        case 'updateCustomer':
        case 'createCustomer':
        case 'deleteCustomer':
          await queryClient.invalidateQueries({ queryKey: ['accounts'] });
          await queryClient.invalidateQueries({ queryKey: ['customers'] });
          break;
      }
    } catch (error) {
      console.error('🔴 Cache invalidation failed:', error);
    }
  }

  // Placeholder methods for other operations
  private async validateDeleteCustomer(intentResult: EnhancedIntentResult, errors: string[], suggestions: string[]): Promise<void> {
    // Implement delete validation
  }

  private async validateCreateCustomer(intentResult: EnhancedIntentResult, errors: string[], suggestions: string[]): Promise<void> {
    // Implement create validation
  }

  private async executeDeleteCustomer(intentResult: EnhancedIntentResult, transaction: TransactionContext): Promise<EnhancedActionResult> {
    // Implement delete operation
    throw new Error('Delete customer not implemented');
  }

  private async executeCreateCustomer(intentResult: EnhancedIntentResult, transaction: TransactionContext): Promise<EnhancedActionResult> {
    // Implement create operation
    throw new Error('Create customer not implemented');
  }
}

export { EnhancedActionHandler };

