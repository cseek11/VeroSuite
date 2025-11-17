// ============================================================================
// API UTILITIES - Resilient API calls with retry logic
// ============================================================================

import { logger } from '@/utils/logger';

interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  backoffMultiplier?: number;
  retryCondition?: (error: any) => boolean;
}

const defaultRetryOptions: Required<RetryOptions> = {
  maxRetries: 3,
  retryDelay: 1000,
  backoffMultiplier: 2,
  retryCondition: (error) => {
    // Retry on network errors, 5xx server errors, or connection refused
    return (
      error.name === 'TypeError' || // Network error
      error.message?.includes('fetch') ||
      error.message?.includes('ECONNREFUSED') ||
      (error.status >= 500 && error.status < 600)
    );
  }
};

export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retryOptions: RetryOptions = {}
): Promise<Response> {
  const config = { ...defaultRetryOptions, ...retryOptions };
  let lastError: any;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      if (process.env.NODE_ENV === 'development') {
        logger.debug('API call attempt', { attempt: attempt + 1, maxRetries: config.maxRetries + 1, url }, 'api-utils');
      }
      
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      // Check if response is ok
      if (!response.ok) {
        // Try to extract error message from response body
        let errorMessage = response.statusText;
        let errorDetails: any = null;
        
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.clone().json();
            // NestJS ValidationPipe format: { statusCode: 400, message: 'Validation failed', errors: [...] }
            if (errorData.errors && Array.isArray(errorData.errors)) {
              errorDetails = errorData.errors;
              errorMessage = errorData.message || errorData.error || errorMessage;
            } else {
              errorMessage = errorData.message || errorData.error || errorMessage;
              errorDetails = errorData.details || null;
            }
          } else {
            const text = await response.clone().text();
            if (text) {
              errorMessage = text;
            }
          }
        } catch {
          // If parsing fails, use status text
        }
        
        const error = new Error(`HTTP ${response.status}: ${errorMessage}`);
        (error as any).status = response.status;
        (error as any).response = response;
        (error as any).details = errorDetails;
        throw error;
      }

      if (process.env.NODE_ENV === 'development') {
        logger.debug('API call successful', { url }, 'api-utils');
      }
      return response;
    } catch (error: unknown) {
      lastError = error;
      logger.warn('API call failed', { attempt: attempt + 1, error }, 'api-utils');

      // Don't retry on the last attempt
      if (attempt === config.maxRetries) {
        break;
      }

      // Check if we should retry this error
      // Don't retry 400 (Bad Request) errors - these are validation errors that won't succeed on retry
      const errorStatus = (error as any)?.status || (error as any)?.response?.status;
      if (errorStatus === 400) {
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Not retrying 400 validation error', { error }, 'api-utils');
        }
        break;
      }
      
      // Handle 429 (Rate Limit) errors with proper retry delay
      if (errorStatus === 429) {
        const retryAfter = (error as any)?.retryAfter || 
                          (error as any)?.response?.headers?.get('Retry-After') || 
                          60;
        const retrySeconds = parseInt(retryAfter.toString(), 10);
        
        if (process.env.NODE_ENV === 'development') {
          logger.debug(`Rate limit hit, waiting ${retrySeconds} seconds before retry`, { error }, 'api-utils');
        }
        
        // Wait for the specified retry-after period
        await new Promise(resolve => setTimeout(resolve, retrySeconds * 1000));
        continue; // Retry after waiting
      }
      
      if (!config.retryCondition(error as any)) {
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Not retrying due to error type', { error }, 'api-utils');
        }
        break;
      }

      // Calculate delay with exponential backoff
      const delay = config.retryDelay * Math.pow(config.backoffMultiplier, attempt);
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Retrying', { delay }, 'api-utils');
      }
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // If we get here, all retries failed
  logger.error('All retry attempts failed', { url, error: lastError }, 'api-utils');
  throw lastError;
}

export async function apiCall<T>(
  url: string,
  options: RequestInit = {},
  retryOptions: RetryOptions = {}
): Promise<T> {
  const response = await fetchWithRetry(url, options, retryOptions);
  
  try {
    const data = await response.json();
    return data;
  } catch (error: unknown) {
    logger.error('Failed to parse JSON response', { url, error }, 'api-utils');
    throw new Error(`Invalid JSON response from ${url}`);
  }
}

// Enhanced API call with better error handling
export async function enhancedApiCall<T>(
  url: string,
  options: RequestInit = {},
  retryOptions: RetryOptions = {}
): Promise<T> {
  try {
    return await apiCall<T>(url, options, retryOptions);
  } catch (error: unknown) {
    logger.error('Enhanced API call failed', { url, error }, 'api-utils');
    
    // Provide more specific error messages
    if (error.message?.includes('fetch')) {
      throw new Error('Network connection failed. Please check your internet connection and try again.');
    } else if (error.message?.includes('ECONNREFUSED')) {
      throw new Error('Backend server is not running. Please start the backend server.');
    } else if (error.status === 401) {
      throw new Error('Authentication failed. Please log in again.');
    } else if (error.status === 403) {
      throw new Error('Access denied. You do not have permission to perform this action.');
    } else if (error.status === 404) {
      // 404 could mean the route doesn't exist OR the user isn't authenticated
      // Check if this might be an auth issue
      const errorMessage = error.message || '';
      if (errorMessage.includes('Cannot') || errorMessage.includes('GET') || errorMessage.includes('PUT')) {
        throw new Error('Endpoint not found. This may indicate an authentication issue. Please try logging in again.');
      } else {
        throw new Error('Resource not found. The requested data may have been deleted.');
      }
    } else if (error.status === 429) {
      // Rate limit error - extract retry information
      const retryAfter = error.response?.headers?.get('Retry-After') || 
                        (error as any).retryAfter || 
                        '60';
      const category = error.response?.headers?.get('X-RateLimit-Category') || 'operations';
      const limit = error.response?.headers?.get('X-RateLimit-Limit') || 'unknown';
      const resetTime = error.response?.headers?.get('X-RateLimit-Reset');
      
      const retrySeconds = parseInt(retryAfter, 10);
      const retryMinutes = Math.ceil(retrySeconds / 60);
      
      const errorMessage = `Rate limit exceeded for ${category} operations (limit: ${limit}/min). Please wait ${retryMinutes} minute${retryMinutes > 1 ? 's' : ''} before trying again.`;
      
      const rateLimitError = new Error(errorMessage);
      (rateLimitError as any).status = 429;
      (rateLimitError as any).retryAfter = retrySeconds;
      (rateLimitError as any).category = category;
      (rateLimitError as any).resetTime = resetTime;
      (rateLimitError as any).isRateLimit = true;
      
      throw rateLimitError;
    } else if (error.status >= 500) {
      throw new Error('Server error. Please try again later or contact support.');
    } else {
      throw error;
    }
  }
}

