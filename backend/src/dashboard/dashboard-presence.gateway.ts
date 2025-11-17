import {
  WebSocketGateway as NestWebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Logger, OnModuleInit, OnModuleDestroy, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { CollaborationService } from './collaboration.service';
import { RedisPubSubService } from '../common/services/redis-pubsub.service';
import { DashboardMetricsService } from './services/dashboard-metrics.service';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  tenantId?: string;
  sessionId?: string;
}

interface PresenceUpdate {
  regionId: string;
  isEditing: boolean;
}

@NestWebSocketGateway({
  cors: {
    origin: (process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173']),
    credentials: true,
  },
  namespace: '/dashboard-presence',
})
export class DashboardPresenceGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, OnModuleInit, OnModuleDestroy {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(DashboardPresenceGateway.name);
  private readonly connectedClients = new Map<string, AuthenticatedSocket>();
  private readonly regionRooms = new Map<string, Set<string>>(); // regionId -> Set of client IDs
  private readonly instanceId = `instance-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Phase 4: Connection limits and message batching
  private readonly connectionsPerTenant = new Map<string, number>(); // tenantId -> connection count
  private readonly messageBatches = new Map<string, { messages: any[]; timer: NodeJS.Timeout }>(); // clientId -> batch
  
  // Phase 4: Configuration
  private readonly maxConnectionsPerTenant: number;
  private readonly batchIntervalMs: number;
  private readonly maxBatchSize: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly collaborationService: CollaborationService,
    private readonly redisPubSub: RedisPubSubService,
    private readonly configService: ConfigService,
    @Optional() private readonly metricsService?: DashboardMetricsService
  ) {
    // Phase 4: Load configuration
    this.maxConnectionsPerTenant = this.configService.get<number>('WEBSOCKET_MAX_CONNECTIONS_PER_TENANT', 100);
    this.batchIntervalMs = this.configService.get<number>('WEBSOCKET_BATCH_INTERVAL_MS', 100);
    this.maxBatchSize = this.configService.get<number>('WEBSOCKET_MAX_BATCH_SIZE', 10);
  }

  async onModuleInit() {
    // Subscribe to Redis channels for cross-instance communication
    if (this.redisPubSub.isReady()) {
      await this.redisPubSub.subscribe('dashboard-presence', (channel, message) => {
        this.handleRedisMessage(channel, message);
      });
      this.logger.log(`WebSocket gateway ${this.instanceId} subscribed to Redis pub/sub`);
    }
  }

  async onModuleDestroy() {
    if (this.redisPubSub.isReady()) {
      await this.redisPubSub.unsubscribe('dashboard-presence');
    }
  }

  afterInit(_server: Server) {
    this.logger.log(`Dashboard Presence WebSocket Gateway initialized (${this.instanceId})`);
  }

  /**
   * Handle messages from Redis (from other instances)
   */
  private handleRedisMessage(_channel: string, message: string) {
    try {
      const data = JSON.parse(message);
      
      // Ignore messages from this instance
      if (data.instanceId === this.instanceId) {
        return;
      }

      // Broadcast to local clients
      switch (data.type) {
        case 'presence-updated':
          this.server.to(`region:${data.regionId}`).emit('presence-updated', data.payload);
          break;
        case 'presence-joined':
          this.server.to(`region:${data.regionId}`).emit('presence-joined', data.payload);
          break;
        case 'presence-left':
          this.server.to(`region:${data.regionId}`).emit('presence-left', data.payload);
          break;
        case 'lock-acquired':
          this.server.to(`region:${data.regionId}`).emit('lock-acquired', data.payload);
          break;
        case 'lock-released':
          this.server.to(`region:${data.regionId}`).emit('lock-released', data.payload);
          break;
      }
    } catch (error) {
      this.logger.error('Failed to handle Redis message', error);
    }
  }

  /**
   * Publish message to Redis for other instances
   */
  private async publishToRedis(type: string, regionId: string, payload: any) {
    if (this.redisPubSub.isReady()) {
      await this.redisPubSub.publish('dashboard-presence', {
        type,
        regionId,
        payload,
        instanceId: this.instanceId,
        timestamp: new Date().toISOString()
      });
    }
  }

  async handleConnection(client: AuthenticatedSocket) {
    try {
      this.logger.debug(`Client attempting to connect: ${client.id}`);

      // Authenticate client using JWT token
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace('Bearer ', '');
      
      if (!token) {
        this.logger.warn(`Client ${client.id} disconnected: No authentication token`);
        client.disconnect();
        return;
      }

      // Verify JWT token
      const payload = this.jwtService.verify(token);
      client.userId = payload.sub || payload.userId;
      client.tenantId = payload.tenant_id;
      client.sessionId = client.id; // Use socket ID as session ID

      if (!client.userId || !client.tenantId) {
        this.logger.warn(`Client ${client.id} disconnected: Invalid token payload`);
        client.disconnect();
        return;
      }

      // Phase 4: Check connection limits
      const tenantConnections = this.connectionsPerTenant.get(client.tenantId) || 0;
      if (tenantConnections >= this.maxConnectionsPerTenant) {
        this.logger.warn(`Connection limit reached for tenant ${client.tenantId} (${tenantConnections}/${this.maxConnectionsPerTenant})`);
        client.emit('error', { 
          code: 'CONNECTION_LIMIT_EXCEEDED',
          message: 'Maximum connections per tenant reached' 
        });
        client.disconnect();
        return;
      }

      // Join tenant-specific room
      const tenantRoom = `tenant:${client.tenantId}`;
      await client.join(tenantRoom);

      // Track connected client
      this.connectedClients.set(client.id, client);
      
      // Phase 4: Update connection counts
      this.connectionsPerTenant.set(client.tenantId, tenantConnections + 1);
      
      // Phase 4: Record metrics
      if (this.metricsService) {
        this.metricsService.recordWebSocketConnection('connect');
      }

      this.logger.log(`Client ${client.id} connected for tenant ${client.tenantId} (user: ${client.userId}) [${tenantConnections + 1}/${this.maxConnectionsPerTenant}]`);
      
      // Send connection confirmation
      client.emit('connected', {
        clientId: client.id,
        userId: client.userId,
        tenantId: client.tenantId,
        sessionId: client.sessionId,
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      this.logger.error(`Authentication failed for client ${client.id}:`, error instanceof Error ? error.message : 'Unknown error');
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Client ${client.id} disconnected`);

    // Phase 4: Clean up message batches
    const batch = this.messageBatches.get(client.id);
    if (batch) {
      clearTimeout(batch.timer);
      this.messageBatches.delete(client.id);
    }

    // Remove from all region rooms
    for (const [regionId, clients] of this.regionRooms.entries()) {
      if (clients.has(client.id)) {
        clients.delete(client.id);
        if (clients.size === 0) {
          this.regionRooms.delete(regionId);
        } else {
          // Notify other clients in the region that this user left
          this.server.to(`region:${regionId}`).emit('presence-left', {
            userId: client.userId,
            sessionId: client.sessionId,
            regionId,
            timestamp: new Date().toISOString(),
          });
        }
      }
    }

    // Phase 4: Update connection counts
    if (client.tenantId) {
      const tenantConnections = this.connectionsPerTenant.get(client.tenantId) || 0;
      if (tenantConnections > 0) {
        this.connectionsPerTenant.set(client.tenantId, tenantConnections - 1);
      }
    }

    // Remove from connected clients
    this.connectedClients.delete(client.id);
    
    // Phase 4: Record metrics
    if (this.metricsService) {
      this.metricsService.recordWebSocketConnection('disconnect');
    }

    // Release any locks held by this client
    if (client.userId && client.tenantId) {
      // Clean up presence records for this session
      // This is handled by the collaboration service's stale cleanup
    }
  }

  @SubscribeMessage('join-region')
  async handleJoinRegion(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { regionId: string }
  ) {
    try {
      if (!client.userId || !client.tenantId || !data.regionId) {
        client.emit('error', { message: 'Missing required fields' });
        return;
      }

      const { regionId } = data;
      const regionRoom = `region:${regionId}`;

      // Join region-specific room
      await client.join(regionRoom);

      // Track region room membership
      if (!this.regionRooms.has(regionId)) {
        this.regionRooms.set(regionId, new Set());
      }
      this.regionRooms.get(regionId)!.add(client.id);

      // Update presence in database
      await this.collaborationService.updatePresence(
        regionId,
        client.userId,
        client.sessionId || client.id,
        false, // Not editing initially
        client.tenantId
      );

      // Get current presence for this region
      const presence = await this.collaborationService.getPresence(regionId, client.tenantId);

      // Notify client of current presence
      client.emit('presence-updated', {
        regionId,
        presence,
        timestamp: new Date().toISOString(),
      });

      // Notify other clients in the region (local)
      client.to(regionRoom).emit('presence-joined', {
        userId: client.userId,
        sessionId: client.sessionId,
        regionId,
        timestamp: new Date().toISOString(),
      });

      // Publish to Redis for other instances
      await this.publishToRedis('presence-joined', regionId, {
        userId: client.userId,
        sessionId: client.sessionId,
        regionId,
        timestamp: new Date().toISOString(),
      });

      this.logger.debug(`Client ${client.id} joined region ${regionId}`);
    } catch (error) {
      this.logger.error(`Failed to join region:`, error);
      client.emit('error', { message: 'Failed to join region' });
    }
  }

  @SubscribeMessage('leave-region')
  async handleLeaveRegion(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { regionId: string }
  ) {
    try {
      if (!data.regionId) {
        return;
      }

      const { regionId } = data;
      const regionRoom = `region:${regionId}`;

      // Leave region room
      await client.leave(regionRoom);

      // Remove from tracking
      const clients = this.regionRooms.get(regionId);
      if (clients) {
        clients.delete(client.id);
        if (clients.size === 0) {
          this.regionRooms.delete(regionId);
        }
      }

      // Release lock if editing
      if (client.userId && client.tenantId) {
        await this.collaborationService.releaseLock(
          regionId,
          client.userId,
          client.sessionId || client.id,
          client.tenantId
        );
      }

      // Notify other clients
      client.to(regionRoom).emit('presence-left', {
        userId: client.userId,
        sessionId: client.sessionId,
        regionId,
        timestamp: new Date().toISOString(),
      });

      this.logger.debug(`Client ${client.id} left region ${regionId}`);
    } catch (error) {
      this.logger.error(`Failed to leave region:`, error);
    }
  }

  /**
   * Phase 4: Batch and send messages to reduce network overhead
   * TODO: Implement when batch messaging is needed
   */
  // @ts-ignore - Unused method, placeholder for future batch messaging feature
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _batchMessage(clientId: string, message: { type: string; data: any }, targetRoom: string) {
    let batch = this.messageBatches.get(clientId);
    
    if (!batch) {
      batch = {
        messages: [],
        timer: setTimeout(() => {
          this.flushBatch(clientId, targetRoom);
        }, this.batchIntervalMs)
      };
      this.messageBatches.set(clientId, batch);
    }
    
    batch.messages.push(message);
    
    // Flush if batch is full
    if (batch.messages.length >= this.maxBatchSize) {
      clearTimeout(batch.timer);
      this.flushBatch(clientId, targetRoom);
    }
  }

  /**
   * Phase 4: Flush batched messages
   */
  private flushBatch(clientId: string, targetRoom: string) {
    const batch = this.messageBatches.get(clientId);
    if (!batch || batch.messages.length === 0) {
      return;
    }
    
    // Send batched messages
    this.server.to(targetRoom).emit('presence-batch', {
      messages: batch.messages,
      timestamp: new Date().toISOString()
    });
    
    // Clean up
    clearTimeout(batch.timer);
    this.messageBatches.delete(clientId);
  }

  @SubscribeMessage('update-presence')
  async handleUpdatePresence(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: PresenceUpdate
  ) {
    try {
      if (!client.userId || !client.tenantId || !data.regionId) {
        return;
      }

      const { regionId, isEditing } = data;

      // Update presence in database
      await this.collaborationService.updatePresence(
        regionId,
        client.userId,
        client.sessionId || client.id,
        isEditing,
        client.tenantId
      );

      // Get updated presence
      const presence = await this.collaborationService.getPresence(regionId, client.tenantId);

      // Broadcast to all clients in the region (local)
      this.server.to(`region:${regionId}`).emit('presence-updated', {
        regionId,
        presence,
        timestamp: new Date().toISOString(),
      });

      // Publish to Redis for other instances
      await this.publishToRedis('presence-updated', regionId, {
        regionId,
        presence,
        timestamp: new Date().toISOString(),
      });

      this.logger.debug(`Presence updated for region ${regionId} by user ${client.userId}`);
    } catch (error) {
      this.logger.error(`Failed to update presence:`, error);
      client.emit('error', { message: 'Failed to update presence' });
    }
  }

  @SubscribeMessage('acquire-lock')
  async handleAcquireLock(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { regionId: string }
  ) {
    try {
      if (!client.userId || !client.tenantId || !data.regionId) {
        client.emit('lock-result', { success: false, message: 'Missing required fields' });
        return;
      }

      const { regionId } = data;

      // Attempt to acquire lock
      const result = await this.collaborationService.acquireLock(
        regionId,
        client.userId,
        client.tenantId,
        client.sessionId || client.id
      );

      if (result.success) {
        // Update presence to editing
        await this.collaborationService.updatePresence(
          regionId,
          client.userId,
          client.sessionId || client.id,
          true,
          client.tenantId
        );

        // Get updated presence
        const presence = await this.collaborationService.getPresence(regionId, client.tenantId);

        // Broadcast lock acquisition (local)
        this.server.to(`region:${regionId}`).emit('lock-acquired', {
          regionId,
          userId: client.userId,
          sessionId: client.sessionId,
          presence,
          timestamp: new Date().toISOString(),
        });

        // Publish to Redis for other instances
        await this.publishToRedis('lock-acquired', regionId, {
          regionId,
          userId: client.userId,
          sessionId: client.sessionId,
          presence,
          timestamp: new Date().toISOString(),
        });
      }

      client.emit('lock-result', result);
    } catch (error) {
      this.logger.error(`Failed to acquire lock:`, error);
      client.emit('lock-result', { success: false, message: 'Failed to acquire lock' });
    }
  }

  @SubscribeMessage('release-lock')
  async handleReleaseLock(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { regionId: string }
  ) {
    try {
      if (!client.userId || !client.tenantId || !data.regionId) {
        return;
      }

      const { regionId } = data;

      // Release lock
      await this.collaborationService.releaseLock(
        regionId,
        client.userId,
        client.sessionId || client.id,
        client.tenantId
      );

      // Update presence to not editing
      await this.collaborationService.updatePresence(
        regionId,
        client.userId,
        client.sessionId || client.id,
        false,
        client.tenantId
      );

      // Get updated presence
      const presence = await this.collaborationService.getPresence(regionId, client.tenantId);

      // Broadcast lock release (local)
      this.server.to(`region:${regionId}`).emit('lock-released', {
        regionId,
        userId: client.userId,
        sessionId: client.sessionId,
        presence,
        timestamp: new Date().toISOString(),
      });

      // Publish to Redis for other instances
      await this.publishToRedis('lock-released', regionId, {
        regionId,
        userId: client.userId,
        sessionId: client.sessionId,
        presence,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.logger.error(`Failed to release lock:`, error);
    }
  }
}

