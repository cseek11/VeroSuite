import React, { useEffect, useRef, useState, useCallback } from 'react';
import { WidgetSandboxProps, WidgetMessage } from '@/routes/dashboard/types/widget.types';
import { logger } from '@/utils/logger';

export const WidgetSandbox: React.FC<WidgetSandboxProps> = ({
  widgetId,
  manifest,
  config,
  onError,
  onReady,
  onMessage
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const messageQueueRef = useRef<WidgetMessage[]>([]);

  // Strict CSP for iframe - Note: CSP should be enforced via meta tag in widget HTML or server headers
  // This is a reference CSP that widgets should implement
  // Using nonce for script and style to avoid 'unsafe-inline'
  // Reference CSP (documentation only, not used in code):
  // const csp = [
  //   "default-src 'self'",
  //   `script-src 'self' 'nonce-${nonce}'`, // Use nonce instead of 'unsafe-inline'
  //   `style-src 'self' 'nonce-${nonce}'`, // Use nonce instead of 'unsafe-inline'
  //   "img-src 'self' data: https:",
  //   "font-src 'self' data:",
  //   "connect-src 'self'",
  //   "frame-ancestors 'none'",
  //   "base-uri 'self'",
  //   "form-action 'none'",
  //   "object-src 'none'",
  //   "media-src 'self'",
  //   "worker-src 'none'"
  // ].join('; ');

  // Handle messages from widget
  const handleMessage = useCallback((event: MessageEvent) => {
    // Verify origin matches widget entry point
    try {
      const widgetOrigin = new URL(manifest.entry_point).origin;
      if (event.origin !== widgetOrigin && event.origin !== window.location.origin) {
        logger.warn('WidgetSandbox: Message from unauthorized origin', {
          origin: event.origin,
          widgetId
        });
        return;
      }
    } catch (e) {
      logger.warn('WidgetSandbox: Invalid widget entry point', {
        entryPoint: manifest.entry_point,
        widgetId
      });
      return;
    }

    const message = event.data as WidgetMessage;
    
    if (message.widgetId !== widgetId) {
      return;
    }

    switch (message.type) {
      case 'ready':
        setIsLoading(false);
        onReady?.();
        // Send queued messages
        messageQueueRef.current.forEach(msg => {
          iframeRef.current?.contentWindow?.postMessage(msg, '*');
        });
        messageQueueRef.current = [];
        break;
      
      case 'error':
        const error = new Error(message.payload?.message || 'Widget error');
        setError(error);
        onError?.(error);
        break;
      
      default:
        onMessage?.(message);
        break;
    }
  }, [widgetId, manifest.entry_point, onError, onReady, onMessage]);

  // Send message to widget
  const sendMessage = useCallback((message: WidgetMessage) => {
    if (!iframeRef.current?.contentWindow) {
      messageQueueRef.current.push(message);
      return;
    }

    try {
      const widgetOrigin = new URL(manifest.entry_point).origin;
      iframeRef.current.contentWindow.postMessage(message, widgetOrigin);
    } catch (e) {
      console.error('WidgetSandbox: Failed to send message', e);
    }
  }, [manifest.entry_point]);

  // Initialize widget
  useEffect(() => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    
    // Set up message listener
    window.addEventListener('message', handleMessage);

    // Load widget
    try {
      iframe.src = manifest.entry_point;
    } catch (e) {
      const error = new Error(`Failed to load widget: ${e instanceof Error ? e.message : 'Unknown error'}`);
      setError(error);
      onError?.(error);
      setIsLoading(false);
    }

    return () => {
      window.removeEventListener('message', handleMessage);
      // Send destroy message
      sendMessage({ type: 'destroy', widgetId });
    };
  }, [manifest.entry_point, widgetId, handleMessage, sendMessage, onError]);

  // Send config updates
  useEffect(() => {
    if (!isLoading && iframeRef.current?.contentWindow) {
      sendMessage({
        type: 'update',
        widgetId,
        payload: { config }
      });
    }
  }, [config, isLoading, widgetId, sendMessage]);

  // Send init message when widget is ready
  useEffect(() => {
    if (!isLoading && iframeRef.current?.contentWindow) {
      sendMessage({
        type: 'init',
        widgetId,
        payload: { config, manifest }
      });
    }
  }, [isLoading, widgetId, config, manifest, sendMessage]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <p className="text-red-800 font-semibold">Widget Error</p>
        <p className="text-red-600 text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading widget...</p>
          </div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        className="w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin allow-forms"
        style={{ display: isLoading ? 'none' : 'block' }}
        title={`Widget: ${manifest.name}`}
        // Note: CSP is set via meta tag in widget HTML or via server headers
      />
    </div>
  );
};


