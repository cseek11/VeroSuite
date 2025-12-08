// ============================================================================
// ROBUST API CLIENT
// ============================================================================
// Enhanced API client with retry logic, validation, and error recovery

import { supabase } from '@/lib/supabase-client';
import { authService } from '@/lib/auth-service';
import { logger } from '@/utils/logger';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
  retries: number;
  duration: number;
  cached?: boolean;
  warnings?: string[];
}

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
  retryCondition?: (error: any) => boolean;
}

export interface CacheConfig {
  enabled: boolean;
  ttl: number; // Time to live in milliseconds
  maxSize: number;
}

class RobustApiClient {
  private baseUrl: string;
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  private defaultRetryConfig: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffFactor: 2,
    retryCondition: (error) => {
      // Retry on network errors and 5xx status codes
      return !error.status || error.status >= 500 || error.name === 'NetworkError';
    }
  };

  private defaultCacheConfig: CacheConfig = {
    enabled: true,
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 100
  };

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
    
    // Clean cache periodically
    setInterval(() => this.cleanCache(), 60000); // Every minute
  }

  /**
   * Get authentication headers with retry on auth failure
   */
  private async getAuthHeaders(retryCount = 0): Promise<Record<string, string>> {
    try {
      if (authService.isAuthenticated()) {
        return await authService.getAuthHeaders();
      }
    } catch (error: unknown) {
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Backend auth failed, attempting token exchange', { error }, 'robust-api-client');
      }
    }

    // Fallback: Exchange Supabase token
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('No valid session found. Please login first.');
    }

    try {
      const backendAuth = await authService.exchangeSupabaseToken(session.access_token);
      return {
        'Authorization': `Bearer ${backendAuth.token}`,
        'Content-Type': 'application/json',
      };
    } catch (error) {
      if (retryCount < 2) {
        // Retry token exchange once
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.getAuthHeaders(retryCount + 1);
      }
      
      logger.error('Token exchange failed after retries', { error }, 'robust-api-client');
      throw new Error('Failed to authenticate with backend. Please login again.');
    }
  }

  /**
   * Execute API request with retry logic and validation
   */
  private async executeWithRetry<T>(
    requestFn: () => Promise<Response>,
    config: Partial<RetryConfig> = {}
  ): Promise<ApiResponse<T>> {
    const retryConfig = { ...this.defaultRetryConfig, ...config };
    const startTime = Date.now();
    let lastError: any;

    for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
      try {
        if (process.env.NODE_ENV === 'development') {
          logger.debug('API request attempt', { attempt: attempt + 1, maxRetries: retryConfig.maxRetries + 1 }, 'robust-api-client');
        }
        
        const response = await requestFn();
        const duration = Date.now() - startTime;
        
        // Handle response
        if (response.ok) {
          const data = await response.json();
          
          return {
            data,
            success: true,
            retries: attempt,
            duration,
            warnings: this.validateResponseData(data)
          };
        } else {
          // Handle HTTP errors
          const errorText = await response.text();
          const error = new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
          (error as any).status = response.status;
          
          // Check if we should retry
          if (attempt < retryConfig.maxRetries && retryConfig.retryCondition!(error)) {
            const delay = Math.min(
              retryConfig.baseDelay * Math.pow(retryConfig.backoffFactor, attempt),
              retryConfig.maxDelay
            );
            
            if (process.env.NODE_ENV === 'development') {
              logger.debug('Retrying after delay', { delay, error: error.message }, 'robust-api-client');
            }
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          
          lastError = error;
          break;
        }
      } catch (error: unknown) {
        lastError = error;
        
        // Check if we should retry
        if (attempt < retryConfig.maxRetries && retryConfig.retryCondition!(error as any)) {
          const delay = Math.min(
            retryConfig.baseDelay * Math.pow(retryConfig.backoffFactor, attempt),
            retryConfig.maxDelay
          );
          
          if (process.env.NODE_ENV === 'development') {
            logger.debug('Retrying after delay', { delay, error: (error as Error).message }, 'robust-api-client');
          }
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        break;
      }
    }

    // All retries failed
    const duration = Date.now() - startTime;
    return {
      success: false,
      error: lastError instanceof Error ? lastError.message : 'Unknown error',
      retries: retryConfig.maxRetries,
      duration
    };
  }

  /**
   * Validate response data structure
   */
  private validateResponseData(data: any): string[] {
    const warnings: string[] = [];
    
    if (data === null) {
      warnings.push('Response data is null');
    } else if (Array.isArray(data) && data.length === 0) {
      warnings.push('Response data is an empty array');
    } else if (typeof data === 'object' && Object.keys(data).length === 0) {
      warnings.push('Response data is an empty object');
    }
    
    return warnings;
  }

  /**
   * Get from cache or make request
   */
  private async getFromCacheOrRequest<T>(
    cacheKey: string,
    requestFn: () => Promise<ApiResponse<T>>,
    cacheConfig: Partial<CacheConfig> = {}
  ): Promise<ApiResponse<T>> {
    const config = { ...this.defaultCacheConfig, ...cacheConfig };
    
    if (config.enabled) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < cached.ttl) {
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Cache hit', { cacheKey }, 'robust-api-client');
        }
        return {
          data: cached.data,
          success: true,
          retries: 0,
          duration: 0,
          cached: true
        };
      }
    }
    
    let response: ApiResponse<T>;
    try {
      response = await requestFn();
    } catch (error: unknown) {
      logger.error('Request failed before retry handling', { error, cacheKey }, 'robust-api-client');
      return {
        success: false,
        retries: 0,
        duration: 0,
        error: error instanceof Error ? error.message : String(error),
      };
    }
    
    // Cache successful responses
    if (response.success && config.enabled && response.data) {
      this.setCache(cacheKey, response.data, config.ttl);
    }
    
    return response;
  }

  /**
   * Set cache with size limit
   */
  private setCache(key: string, data: any, ttl: number): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.defaultCacheConfig.maxSize) {
      const oldest = this.cache.keys().next();
      if (!oldest.done) {
        this.cache.delete(oldest.value);
      }
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  /**
   * Clean expired cache entries
   */
  private cleanCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Robust GET request
   */
  async get<T>(endpoint: string, config?: {
    retry?: Partial<RetryConfig>;
    cache?: Partial<CacheConfig>;
  }): Promise<ApiResponse<T>> {
    const cacheKey = `GET:${endpoint}`;
    
    return this.getFromCacheOrRequest(
      cacheKey,
      async () => {
        return this.executeWithRetry<T>(async () => {
          const headers = await this.getAuthHeaders();
          return fetch(`${this.baseUrl}${endpoint}`, {
            method: 'GET',
            headers,
          });
        }, config?.retry);
      },
      config?.cache
    );
  }

  /**
   * Robust POST request
   */
  async post<T>(endpoint: string, data: any, config?: {
    retry?: Partial<RetryConfig>;
  }): Promise<ApiResponse<T>> {
    if (process.env.NODE_ENV === 'development') {
      logger.debug('RobustApiClient.post', { endpoint, data }, 'robust-api-client');
    }
    
    return this.executeWithRetry<T>(async () => {
      const headers = await this.getAuthHeaders();
      return fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
    }, config?.retry);
  }

  /**
   * Robust PUT request with response validation
   */
  async put<T>(endpoint: string, data: any, config?: {
    retry?: Partial<RetryConfig>;
  }): Promise<ApiResponse<T>> {
    if (process.env.NODE_ENV === 'development') {
      logger.debug('RobustApiClient.put', { endpoint, data }, 'robust-api-client');
    }
    
    // Clear relevant cache entries
    this.invalidateCache(endpoint);
    
    const result = await this.executeWithRetry<T>(async () => {
      const headers = await this.getAuthHeaders();
      return fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });
    }, config?.retry);
    
    // Validate update result
    if (result.success && result.data) {
      const validation = this.validateUpdateResult(data, result.data);
      if (validation.warnings.length > 0) {
        result.warnings = [...(result.warnings || []), ...validation.warnings];
      }
    }
    
    return result;
  }

  /**
   * Validate update operation result
   */
  private validateUpdateResult(sentData: any, returnedData: any): { warnings: string[] } {
    const warnings: string[] = [];
    
    // Check if returned data contains the updates we sent
    for (const [key, value] of Object.entries(sentData)) {
      if (returnedData[key] === undefined) {
        warnings.push(`Field '${key}' not returned in response`);
      } else if (returnedData[key] !== value) {
        warnings.push(`Field '${key}' value mismatch: sent '${value}', received '${returnedData[key]}'`);
      }
    }
    
    return { warnings };
  }

  /**
   * Robust DELETE request
   */
  async delete<T>(endpoint: string, config?: {
    retry?: Partial<RetryConfig>;
  }): Promise<ApiResponse<T>> {
    // Clear relevant cache entries
    this.invalidateCache(endpoint);
    
    return this.executeWithRetry<T>(async () => {
      const headers = await this.getAuthHeaders();
      return fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers,
      });
    }, config?.retry);
  }

  /**
   * Invalidate cache entries matching pattern
   */
  private invalidateCache(endpoint: string): void {
    const pattern = endpoint.split('/')[1]; // Extract resource type
    if (!pattern) return;
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * High-level methods with built-in error handling
   */
  async getAllAccounts(): Promise<any[]> {
    const response = await this.get<any[]>('/accounts');
    if (!response.success) {
      logger.error('Failed to get accounts', { error: response.error }, 'robust-api-client');
      return [];
    }
    return response.data || [];
  }

  async updateAccount(id: string, data: any): Promise<any> {
    const response = await this.put<any>(`/accounts/${id}`, data);
    if (!response.success) {
      throw new Error(`Failed to update account: ${response.error}`);
    }
    return response.data;
  }

  async createAccount(data: any): Promise<any> {
    const response = await this.post<any>('/accounts', data);
    if (!response.success) {
      throw new Error(`Failed to create account: ${response.error}`);
    }
    return response.data;
  }

  async deleteAccount(id: string): Promise<void> {
    const response = await this.delete<void>(`/accounts/${id}`);
    if (!response.success) {
      throw new Error(`Failed to delete account: ${response.error}`);
    }
  }

  /**
   * Health check for API connectivity
   */
  async healthCheck(): Promise<{ healthy: boolean; latency: number }> {
    try {
      const startTime = Date.now();
      const response = await this.get('/health', {
        retry: { maxRetries: 1 },
        cache: { enabled: false }
      });
      const latency = Date.now() - startTime;
      
      return {
        healthy: response.success,
        latency
      };
    } catch (error) {
      return {
        healthy: false,
        latency: -1
      };
    }
  }
}

export const robustApiClient = new RobustApiClient();

