/**
 * PWA Utilities
 * Handles service worker registration, offline detection, and install prompts
 */

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

/**
 * Register service worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service workers are not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/'
    });

    console.log('Service Worker registered:', registration);

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available
            console.log('New service worker available');
            // You can show a notification to the user here
          }
        });
      }
    });

    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Check if app is installed
 */
export function isInstalled(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
}

/**
 * Check if app is online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Listen for online/offline events
 */
export function onOnlineStatusChange(callback: (online: boolean) => void): () => void {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

/**
 * Show install prompt
 */
export async function showInstallPrompt(): Promise<boolean> {
  if (!deferredPrompt) {
    return false;
  }

  try {
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    return outcome === 'accepted';
  } catch (error) {
    console.error('Error showing install prompt:', error);
    return false;
  }
}

/**
 * Check if install prompt is available
 */
export function canInstall(): boolean {
  return deferredPrompt !== null;
}

/**
 * Initialize PWA features
 */
export function initPWA(): void {
  // Register service worker
  if (typeof window !== 'undefined') {
    registerServiceWorker();

    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
      console.log('Install prompt available');
      
      // Dispatch custom event for UI to show install button
      window.dispatchEvent(new CustomEvent('pwa-installable'));
    });

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      console.log('PWA installed');
      deferredPrompt = null;
      window.dispatchEvent(new CustomEvent('pwa-installed'));
    });
  }
}

/**
 * Get cache size (approximate)
 */
export async function getCacheSize(): Promise<number> {
  if (!('caches' in window)) {
    return 0;
  }

  try {
    const cacheNames = await caches.keys();
    let totalSize = 0;

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      
      for (const request of keys) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
    }

    return totalSize;
  } catch (error) {
    console.error('Error calculating cache size:', error);
    return 0;
  }
}

/**
 * Clear all caches
 */
export async function clearCache(): Promise<void> {
  if (!('caches' in window)) {
    return;
  }

  try {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    console.log('Cache cleared');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}


