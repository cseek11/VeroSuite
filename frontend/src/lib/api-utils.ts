// ============================================================================
// API UTILITIES - Resilient API calls with retry logic
// ============================================================================

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
      console.log(`🔄 API call attempt ${attempt + 1}/${config.maxRetries + 1}: ${url}`);
      
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      // Check if response is ok
      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        (error as any).status = response.status;
        (error as any).response = response;
        throw error;
      }

      console.log(`✅ API call successful: ${url}`);
      return response;
    } catch (error) {
      lastError = error;
      console.warn(`❌ API call failed (attempt ${attempt + 1}):`, error);

      // Don't retry on the last attempt
      if (attempt === config.maxRetries) {
        break;
      }

      // Check if we should retry this error
      if (!config.retryCondition(error)) {
        console.log(`🚫 Not retrying due to error type:`, error);
        break;
      }

      // Calculate delay with exponential backoff
      const delay = config.retryDelay * Math.pow(config.backoffMultiplier, attempt);
      console.log(`⏳ Retrying in ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // If we get here, all retries failed
  console.error(`💥 All retry attempts failed for ${url}:`, lastError);
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
  } catch (error) {
    console.error(`❌ Failed to parse JSON response from ${url}:`, error);
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
  } catch (error) {
    console.error(`💥 Enhanced API call failed for ${url}:`, error);
    
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
      throw new Error('Resource not found. The requested data may have been deleted.');
    } else if (error.status >= 500) {
      throw new Error('Server error. Please try again later or contact support.');
    } else {
      throw error;
    }
  }
}

