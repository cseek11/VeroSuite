interface Config {
  supabase: {
    url: string;
    anonKey: string;
  };
  app: {
    name: string;
    version: string;
    environment: 'development' | 'production' | 'test';
  };
  features: {
    enableAnalytics: boolean;
    enableDebugMode: boolean;
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
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing required environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
    );
  }

  // Validate URL format
  try {
    new URL(supabaseUrl);
  } catch (error) {
    throw new Error('Invalid Supabase URL format');
  }

  return {
    supabase: {
      url: supabaseUrl,
      anonKey: supabaseAnonKey,
    },
    app: {
      name: 'VeroPest Suite',
      version: '1.0.0',
      environment: (import.meta.env.MODE as Config['app']['environment']) || 'development',
    },
    features: {
      enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
      enableDebugMode: import.meta.env.DEV,
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
