/**
 * VeroField Mobile App
 * Technician Mobile Application for Pest Control Operations
 *
 * @format
 */

import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import offlineService from './src/services/offlineService';
import notificationService from './src/services/notificationService';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  useEffect(() => {
    // Initialize services when app starts
    const initializeServices = async () => {
      try {
        await Promise.all([
          offlineService.initialize(),
          notificationService.initialize(),
        ]);
        console.log('All services initialized successfully');
      } catch (error) {
        console.error('Error initializing services:', error);
      }
    };

    initializeServices();

    // Cleanup on app unmount
    return () => {
      offlineService.stopSyncTimer();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#FFFFFF"
        />
        <AppNavigator />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export default App;
