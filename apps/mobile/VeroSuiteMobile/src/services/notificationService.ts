// ============================================================================
// VeroField Mobile App - Push Notification Service
// ============================================================================

import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';
import { STORAGE_KEYS, API_CONFIG } from '../constants';
import { AppError } from '../types';
import authService from './authService';

export interface NotificationData {
  id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  timestamp: string;
}

class NotificationService {
  private isInitialized: boolean = false;

  /**
   * Initialize push notification service
   */
  async initialize(): Promise<void> {
    try {
      // Request permission
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.log('Push notification permission denied');
        return;
      }

      // Get FCM token
      const token = await messaging().getToken();
      console.log('FCM Token:', token);

      // Store token for backend registration
      await this.registerTokenWithBackend(token);

      // Set up message handlers
      this.setupMessageHandlers();

      this.isInitialized = true;
      console.log('Notification service initialized');
    } catch (error) {
      console.error('Error initializing notifications:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Register FCM token with backend
   */
  private async registerTokenWithBackend(token: string): Promise<void> {
    try {
      const headers = await authService.getAuthHeaders();
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/notifications/register`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          fcm_token: token,
          platform: Platform.OS,
          app_version: '1.0.0',
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to register FCM token: ${response.statusText}`);
      }

      console.log('FCM token registered with backend');
    } catch (error) {
      console.error('Error registering FCM token:', error);
      // Don't throw - notifications can work without backend registration
    }
  }

  /**
   * Set up message handlers
   */
  private setupMessageHandlers(): void {
    // Handle background messages
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Background message received:', remoteMessage);
      await this.handleBackgroundMessage(remoteMessage);
    });

    // Handle foreground messages
    messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground message received:', remoteMessage);
      await this.handleForegroundMessage(remoteMessage);
    });

    // Handle notification opened (app launched from notification)
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('Notification opened app:', remoteMessage);
      this.handleNotificationOpened(remoteMessage);
    });

    // Handle initial notification (app launched from notification when closed)
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log('App launched from notification:', remoteMessage);
          this.handleNotificationOpened(remoteMessage);
        }
      });
  }

  /**
   * Handle foreground messages
   */
  private async handleForegroundMessage(remoteMessage: FirebaseMessagingTypes.RemoteMessage): Promise<void> {
    const { notification, data } = remoteMessage;

    if (notification) {
      // Show alert for foreground notifications
      Alert.alert(
        notification.title || 'VeroField',
        notification.body || 'New notification',
        [
          { text: 'Dismiss', style: 'cancel' },
          {
            text: 'View',
            onPress: () => this.handleNotificationOpened(remoteMessage),
          },
        ]
      );
    }

    // Store notification for history
    await this.storeNotification({
      id: remoteMessage.messageId || Date.now().toString(),
      title: notification?.title || 'VeroField',
      body: notification?.body || '',
      data: data || {},
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Handle background messages
   */
  private async handleBackgroundMessage(remoteMessage: FirebaseMessagingTypes.RemoteMessage): Promise<void> {
    console.log('Processing background message:', remoteMessage);

    // Store notification for when app is opened
    await this.storeNotification({
      id: remoteMessage.messageId || Date.now().toString(),
      title: remoteMessage.notification?.title || 'VeroField',
      body: remoteMessage.notification?.body || '',
      data: remoteMessage.data || {},
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Handle notification opened
   */
  private handleNotificationOpened(remoteMessage: FirebaseMessagingTypes.RemoteMessage): void {
    const { data } = remoteMessage;

    if (data) {
      // Handle different notification types
      switch (data.type) {
        case 'job_assigned':
          // Navigate to jobs screen
          console.log('Navigate to jobs for assigned job:', data.jobId);
          break;
        case 'job_updated':
          // Navigate to specific job
          console.log('Navigate to job details:', data.jobId);
          break;
        case 'message':
          // Navigate to messages
          console.log('Navigate to messages');
          break;
        default:
          console.log('Unknown notification type:', data.type);
      }
    }
  }

  /**
   * Store notification in local storage
   */
  private async storeNotification(notification: NotificationData): Promise<void> {
    try {
      const stored = await this.getStoredNotifications();
      stored.unshift(notification);

      // Keep only last 50 notifications
      const trimmed = stored.slice(0, 50);

      await AsyncStorage.setItem(
        STORAGE_KEYS.NOTIFICATIONS,
        JSON.stringify(trimmed)
      );
    } catch (error) {
      console.error('Error storing notification:', error);
    }
  }

  /**
   * Get stored notifications
   */
  async getStoredNotifications(): Promise<NotificationData[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting stored notifications:', error);
      return [];
    }
  }

  /**
   * Clear all notifications
   */
  async clearNotifications(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  }

  /**
   * Send local notification (for testing)
   */
  async sendLocalNotification(title: string, body: string, data?: Record<string, any>): Promise<void> {
    try {
      // This would typically use a local notification library
      // For now, we'll just show an alert
      Alert.alert(title, body);

      // Store for history
      await this.storeNotification({
        id: Date.now().toString(),
        title,
        body,
        data: data || {},
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error sending local notification:', error);
    }
  }

  /**
   * Subscribe to topic
   */
  async subscribeToTopic(topic: string): Promise<void> {
    try {
      await messaging().subscribeToTopic(topic);
      console.log(`Subscribed to topic: ${topic}`);
    } catch (error) {
      console.error(`Error subscribing to topic ${topic}:`, error);
    }
  }

  /**
   * Unsubscribe from topic
   */
  async unsubscribeFromTopic(topic: string): Promise<void> {
    try {
      await messaging().unsubscribeFromTopic(topic);
      console.log(`Unsubscribed from topic: ${topic}`);
    } catch (error) {
      console.error(`Error unsubscribing from topic ${topic}:`, error);
    }
  }

  /**
   * Get notification permission status
   */
  async getPermissionStatus(): Promise<string> {
    try {
      const authStatus = await messaging().hasPermission();
      
      switch (authStatus) {
        case messaging.AuthorizationStatus.AUTHORIZED:
          return 'authorized';
        case messaging.AuthorizationStatus.DENIED:
          return 'denied';
        case messaging.AuthorizationStatus.NOT_DETERMINED:
          return 'not_determined';
        case messaging.AuthorizationStatus.PROVISIONAL:
          return 'provisional';
        default:
          return 'unknown';
      }
    } catch (error) {
      console.error('Error getting permission status:', error);
      return 'error';
    }
  }

  /**
   * Handle notification service errors
   */
  private handleError(error: any): AppError {
    if (error instanceof Error) {
      return {
        code: 'NOTIFICATION_ERROR',
        message: error.message,
        details: error,
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected notification error occurred',
      details: error,
    };
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
export default notificationService;
