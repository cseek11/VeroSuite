import { logger } from '@/utils/logger';

interface Config {
  supabase: {
    url: string;
    publishableKey: string;
  };
  app: {
    name: string;
    version: string;
    environment: 'development' | 'production' | 'test';
  };
  features: {
    enableAnalytics: boolean;
    enableDebugMode: boolean;
    enableFuzzy: boolean;
    enableSuggestions: boolean;
  };
  monitoring: {
    sentry: {
      dsn: string;
      tracesSampleRate: number;
    };
  };
}

function validateConfig(): Config {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      'Missing required environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY'
    );
  }

  // Validate URL format
  try {
    new URL(supabaseUrl);
  } catch (_error) {
    throw new Error('Invalid Supabase URL format');
  }

  return {
    supabase: {
      url: supabaseUrl,
      publishableKey: supabasePublishableKey,
    },
    app: {
      name: 'VeroPest Suite',
      version: '1.0.0',
      environment: (import.meta.env.MODE as Config['app']['environment']) || 'development',
    },
    features: {
      enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
      enableDebugMode: import.meta.env.DEV,
      enableFuzzy: import.meta.env.VITE_ENABLE_FUZZY === 'true',
      enableSuggestions: import.meta.env.VITE_ENABLE_SUGGESTIONS === 'true',
    },
    monitoring: {
      sentry: {
        dsn: import.meta.env.VITE_SENTRY_DSN || '',
        tracesSampleRate: parseFloat(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || '0.1'),
      },
    },
  };
}

export const config = validateConfig();

// Expose config in development for easy debugging in the browser console
// Access via: window.appConfig.features
if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as unknown as { appConfig?: Config }).appConfig = config;
  // One-time log to confirm flags at startup
  if (process.env.NODE_ENV === 'development') {
    logger.debug('App feature flags', { features: config.features }, 'config');
  }
}
