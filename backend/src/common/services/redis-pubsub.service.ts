import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Redis Pub/Sub service for horizontal WebSocket scaling
 */
@Injectable()
export class RedisPubSubService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisPubSubService.name);
  private publisher: any = null;
  private subscriber: any = null;
  private messageHandlers = new Map<string, Set<(channel: string, message: string) => void>>();
  private isConnected = false;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    await this.initialize();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async initialize() {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    if (!redisUrl) {
      this.logger.warn('REDIS_URL not configured, Redis Pub/Sub disabled');
      return;
    }

    try {
      const Redis = require('ioredis');
      
      // Create publisher client
      this.publisher = new Redis(redisUrl, {
        retryStrategy: (times: number) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: 3
      });

      // Create subscriber client (separate connection for pub/sub)
      this.subscriber = new Redis(redisUrl, {
        retryStrategy: (times: number) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: 3
      });

      this.publisher.on('error', (err: Error) => {
        this.logger.error('Redis publisher error', err);
        this.isConnected = false;
      });

      this.subscriber.on('error', (err: Error) => {
        this.logger.error('Redis subscriber error', err);
        this.isConnected = false;
      });

      this.publisher.on('connect', () => {
        this.logger.log('Redis publisher connected');
        this.isConnected = true;
      });

      this.subscriber.on('connect', () => {
        this.logger.log('Redis subscriber connected');
      });

      // Handle incoming messages
      this.subscriber.on('message', (channel: string, message: string) => {
        this.handleMessage(channel, message);
      });

      this.isConnected = true;
    } catch (error) {
      this.logger.error('Failed to initialize Redis Pub/Sub', error);
      this.isConnected = false;
    }
  }

  /**
   * Publish message to channel
   */
  async publish(channel: string, message: any): Promise<void> {
    if (!this.isConnected || !this.publisher) {
      this.logger.warn('Redis not connected, message not published', { channel });
      return;
    }

    try {
      const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
      await this.publisher.publish(channel, messageStr);
    } catch (error) {
      this.logger.error(`Failed to publish to channel ${channel}`, error);
      throw error;
    }
  }

  /**
   * Subscribe to channel
   */
  async subscribe(channel: string, handler: (channel: string, message: string) => void): Promise<void> {
    if (!this.isConnected || !this.subscriber) {
      this.logger.warn('Redis not connected, subscription not created', { channel });
      return;
    }

    try {
      // Add handler to map
      if (!this.messageHandlers.has(channel)) {
        this.messageHandlers.set(channel, new Set());
        await this.subscriber.subscribe(channel);
      }
      this.messageHandlers.get(channel)!.add(handler);
    } catch (error) {
      this.logger.error(`Failed to subscribe to channel ${channel}`, error);
      throw error;
    }
  }

  /**
   * Unsubscribe from channel
   */
  async unsubscribe(channel: string, handler?: (channel: string, message: string) => void): Promise<void> {
    if (!this.isConnected || !this.subscriber) {
      return;
    }

    try {
      const handlers = this.messageHandlers.get(channel);
      if (handlers) {
        if (handler) {
          handlers.delete(handler);
        } else {
          handlers.clear();
        }

        // If no handlers left, unsubscribe from channel
        if (handlers.size === 0) {
          await this.subscriber.unsubscribe(channel);
          this.messageHandlers.delete(channel);
        }
      }
    } catch (error) {
      this.logger.error(`Failed to unsubscribe from channel ${channel}`, error);
      throw error;
    }
  }

  /**
   * Handle incoming message from Redis
   */
  private handleMessage(channel: string, message: string) {
    const handlers = this.messageHandlers.get(channel);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(channel, message);
        } catch (error) {
          this.logger.error(`Error in message handler for channel ${channel}`, error);
        }
      });
    }
  }

  /**
   * Disconnect from Redis
   */
  private async disconnect() {
    if (this.publisher) {
      await this.publisher.quit();
      this.publisher = null;
    }

    if (this.subscriber) {
      await this.subscriber.quit();
      this.subscriber = null;
    }

    this.messageHandlers.clear();
    this.isConnected = false;
  }

  /**
   * Check if Redis is connected
   */
  isReady(): boolean {
    return this.isConnected;
  }
}




