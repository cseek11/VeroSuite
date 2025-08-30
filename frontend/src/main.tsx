import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './routes/App';
import { queryClient } from './lib/queryClient';
import { config } from './lib/config';
import { ErrorBoundary } from './components/ErrorBoundary';
import KeyboardNavigationProvider from './components/KeyboardNavigationProvider';
import { LayoutProvider } from './context/LayoutContext';
import { initSentry, SentryErrorBoundary } from './lib/sentry';
import './index.css';
import './custom-calendar.css';

// Initialize Sentry for error tracking
initSentry();

// Error boundary for initialization errors
function ErrorFallback({ error }: { error: Error }) {
  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ maxWidth: '500px' }}>
        <h1 style={{ color: '#dc3545', marginBottom: '20px' }}>Configuration Error</h1>
        <p style={{ marginBottom: '15px', color: '#6c757d' }}>
          The application failed to initialize due to a configuration issue.
        </p>
        <div style={{ 
          backgroundColor: '#fff', 
          padding: '15px', 
          borderRadius: '5px', 
          border: '1px solid #dee2e6',
          textAlign: 'left',
          fontSize: '14px'
        }}>
          <strong>Error:</strong> {error.message}
        </div>
        <p style={{ marginTop: '15px', fontSize: '14px', color: '#6c757d' }}>
          Please check your environment variables and try refreshing the page.
        </p>
      </div>
    </div>
  );
}

try {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <SentryErrorBoundary fallback={<ErrorFallback error={new Error('Application Error')} />}>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <KeyboardNavigationProvider>
                <LayoutProvider>
                  <App />
                </LayoutProvider>
              </KeyboardNavigationProvider>
            </BrowserRouter>
            {config.features.enableDebugMode && <ReactQueryDevtools initialIsOpen={false} />}
          </QueryClientProvider>
        </ErrorBoundary>
      </SentryErrorBoundary>
    </React.StrictMode>
  );
} catch (error) {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <ErrorFallback error={error as Error} />
  );
}
