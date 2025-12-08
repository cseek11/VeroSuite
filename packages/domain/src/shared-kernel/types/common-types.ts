/**
 * Common types for the domain layer
 * These are strongly-typed IDs to prevent mixing different ID types
 */

/**
 * Tenant ID type - represents a unique tenant in multi-tenant system
 */
export type TenantId = string & { readonly __brand: 'TenantId' };

/**
 * Create a TenantId from a string
 */
export function createTenantId(id: string): TenantId {
  if (!id || id.trim().length === 0) {
    throw new Error('Tenant ID cannot be empty');
  }
  return id.trim() as TenantId;
}

/**
 * User ID type - represents a unique user
 */
export type UserId = string & { readonly __brand: 'UserId' };

/**
 * Create a UserId from a string
 */
export function createUserId(id: string): UserId {
  if (!id || id.trim().length === 0) {
    throw new Error('User ID cannot be empty');
  }
  return id.trim() as UserId;
}

/**
 * Customer ID type - represents a unique customer
 */
export type CustomerId = string & { readonly __brand: 'CustomerId' };

/**
 * Create a CustomerId from a string
 */
export function createCustomerId(id: string): CustomerId {
  if (!id || id.trim().length === 0) {
    throw new Error('Customer ID cannot be empty');
  }
  return id.trim() as CustomerId;
}

/**
 * WorkOrder ID type - represents a unique work order
 */
export type WorkOrderId = string & { readonly __brand: 'WorkOrderId' };

/**
 * Create a WorkOrderId from a string
 */
export function createWorkOrderId(id: string): WorkOrderId {
  if (!id || id.trim().length === 0) {
    throw new Error('Work Order ID cannot be empty');
  }
  return id.trim() as WorkOrderId;
}

/**
 * Invoice ID type - represents a unique invoice
 */
export type InvoiceId = string & { readonly __brand: 'InvoiceId' };

/**
 * Create an InvoiceId from a string
 */
export function createInvoiceId(id: string): InvoiceId {
  if (!id || id.trim().length === 0) {
    throw new Error('Invoice ID cannot be empty');
  }
  return id.trim() as InvoiceId;
}

/**
 * Job ID type - represents a unique job
 */
export type JobId = string & { readonly __brand: 'JobId' };

/**
 * Create a JobId from a string
 */
export function createJobId(id: string): JobId {
  if (!id || id.trim().length === 0) {
    throw new Error('Job ID cannot be empty');
  }
  return id.trim() as JobId;
}
