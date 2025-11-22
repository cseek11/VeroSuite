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
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  tenantId?: string;
  userRole?: string;
}

interface KPIDataUpdate {
  tenantId: string;
  kpiId?: string;
  data: any;
  timestamp: string;
}

interface KPIThresholdAlert {
  tenantId: string;
  kpiId: string;
  metric: string;
  value: number;
  threshold: number;
  status: 'warning' | 'critical';
  timestamp: string;
}

@NestWebSocketGateway({
  cors: {
    origin: (process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173']),
    credentials: true,
  },
  namespace: '/kpi-updates',
})
export class WebSocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(WebSocketGateway.name);
  private readonly connectedClients = new Map<string, AuthenticatedSocket>();
  private readonly tenantRooms = new Map<string, Set<string>>();
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor(private readonly jwtService: JwtService) {}

  afterInit(_server: Server) {
    this.logger.log('WebSocket Gateway initialized');
    
    // Set up heartbeat for connection health
    this.heartbeatInterval = setInterval(() => {
      if (this.server) {
        this.server.emit('heartbeat', { timestamp: new Date().toISOString() });
      }
    }, 30000); // 30 seconds
  }

  // Clean up resources when the gateway is destroyed
  onModuleDestroy() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  async handleConnection(client: AuthenticatedSocket) {
    try {
      this.logger.log(`Client attempting to connect: ${client.id}`);

      // Authenticate client using JWT token
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace('Bearer ', '');
      
      if (!token) {
        this.logger.warn(`Client ${client.id} disconnected: No authentication token`);
        client.disconnect();
        return;
      }

      // Verify JWT token
      const payload = this.jwtService.verify(token);
      client.userId = payload.sub;
      client.tenantId = payload.tenant_id;
      client.userRole = payload.roles?.[0];

      if (!client.userId || !client.tenantId) {
        this.logger.warn(`Client ${client.id} disconnected: Invalid token payload`);
        client.disconnect();
        return;
      }

      // Join tenant-specific room
      const tenantRoom = `tenant:${client.tenantId}`;
      await client.join(tenantRoom);

      // Track connected client
      this.connectedClients.set(client.id, client);
      
      // Track tenant room membership
      if (!this.tenantRooms.has(tenantRoom)) {
        this.tenantRooms.set(tenantRoom, new Set());
      }
      this.tenantRooms.get(tenantRoom)!.add(client.id);

      this.logger.log(`Client ${client.id} connected for tenant ${client.tenantId} (user: ${client.userId})`);
      
      // Send connection confirmation
      client.emit('connected', {
        clientId: client.id,
        userId: client.userId,
        tenantId: client.tenantId,
        timestamp: new Date().toISOString(),
      });

      // Send current connection stats
      client.emit('connection-stats', {
        totalClients: this.connectedClients.size,
        tenantClients: this.tenantRooms.get(tenantRoom)?.size || 0,
      });

    } catch (error) {
      this.logger.error(`Authentication failed for client ${client.id}:`, error instanceof Error ? error.message : 'Unknown error');
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Client ${client.id} disconnected`);

    // Remove from tenant room tracking
    if (client.tenantId) {
      const tenantRoom = `tenant:${client.tenantId}`;
      const roomClients = this.tenantRooms.get(tenantRoom);
      if (roomClients) {
        roomClients.delete(client.id);
        if (roomClients.size === 0) {
          this.tenantRooms.delete(tenantRoom);
        }
      }
    }

    // Remove from connected clients
    this.connectedClients.delete(client.id);

    // Broadcast updated connection stats
    this.broadcastConnectionStats();
  }

  // Subscribe to KPI updates
  @SubscribeMessage('subscribe-kpi')
  async handleSubscribeKPI(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { kpiId?: string; metrics?: string[] }
  ) {
    if (!client.tenantId) {
      client.emit('error', { message: 'Not authenticated' });
      return;
    }

    const subscriptionKey = data.kpiId ? `kpi:${data.kpiId}` : 'all-kpis';
    const roomName = `tenant:${client.tenantId}:${subscriptionKey}`;
    
    await client.join(roomName);
    
    this.logger.log(`Client ${client.id} subscribed to ${subscriptionKey} for tenant ${client.tenantId}`);
    
    client.emit('subscribed', {
      subscription: subscriptionKey,
      room: roomName,
      timestamp: new Date().toISOString(),
    });
  }

  // Unsubscribe from KPI updates
  @SubscribeMessage('unsubscribe-kpi')
  async handleUnsubscribeKPI(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { kpiId?: string }
  ) {
    if (!client.tenantId) {
      client.emit('error', { message: 'Not authenticated' });
      return;
    }

    const subscriptionKey = data.kpiId ? `kpi:${data.kpiId}` : 'all-kpis';
    const roomName = `tenant:${client.tenantId}:${subscriptionKey}`;
    
    await client.leave(roomName);
    
    this.logger.log(`Client ${client.id} unsubscribed from ${subscriptionKey} for tenant ${client.tenantId}`);
    
    client.emit('unsubscribed', {
      subscription: subscriptionKey,
      timestamp: new Date().toISOString(),
    });
  }

  // Handle client ping for connection health
  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: AuthenticatedSocket) {
    client.emit('pong', { timestamp: new Date().toISOString() });
  }

  // Broadcast KPI data update to tenant
  async broadcastKPIUpdate(tenantId: string, update: KPIDataUpdate) {
    const roomName = `tenant:${tenantId}:all-kpis`;
    this.server.to(roomName).emit('kpi-update', update);
    
    // Also broadcast to specific KPI room if applicable
    if (update.kpiId) {
      const specificRoom = `tenant:${tenantId}:kpi:${update.kpiId}`;
      this.server.to(specificRoom).emit('kpi-update', update);
    }

    this.logger.debug(`Broadcasted KPI update to tenant ${tenantId}`, { kpiId: update.kpiId });
  }

  // Broadcast KPI threshold alert
  async broadcastKPIAlert(tenantId: string, alert: KPIThresholdAlert) {
    const roomName = `tenant:${tenantId}:all-kpis`;
    this.server.to(roomName).emit('kpi-alert', alert);
    
    // Also broadcast to specific KPI room
    const specificRoom = `tenant:${tenantId}:kpi:${alert.kpiId}`;
    this.server.to(specificRoom).emit('kpi-alert', alert);

    this.logger.log(`Broadcasted KPI alert for tenant ${tenantId}`, { 
      kpiId: alert.kpiId, 
      metric: alert.metric, 
      status: alert.status 
    });
  }

  // Broadcast connection stats to all clients
  private broadcastConnectionStats() {
    const stats = {
      totalClients: this.connectedClients.size,
      tenantStats: Array.from(this.tenantRooms.entries()).map(([tenant, clients]) => ({
        tenant: tenant.replace('tenant:', ''),
        clientCount: clients.size,
      })),
      timestamp: new Date().toISOString(),
    };

    this.server.emit('connection-stats', stats);
  }

  // Get connection statistics
  getConnectionStats() {
    return {
      totalClients: this.connectedClients.size,
      tenantRooms: this.tenantRooms.size,
      connectedTenants: Array.from(this.tenantRooms.keys()).map(room => 
        room.replace('tenant:', '')
      ),
      clientDetails: Array.from(this.connectedClients.entries()).map(([clientId, client]) => ({
        clientId,
        userId: client.userId,
        tenantId: client.tenantId,
        userRole: client.userRole,
        connectedAt: client.handshake.time,
      })),
    };
  }

  // Broadcast to specific tenant
  async broadcastToTenant(tenantId: string, event: string, data: any) {
    const roomName = `tenant:${tenantId}`;
    this.server.to(roomName).emit(event, data);
    this.logger.debug(`Broadcasted ${event} to tenant ${tenantId}`);
  }

  // Broadcast to specific user
  async broadcastToUser(userId: string, event: string, data: any) {
    const userSocket = Array.from(this.connectedClients.values())
      .find(client => client.userId === userId);
    
    if (userSocket) {
      userSocket.emit(event, data);
      this.logger.debug(`Broadcasted ${event} to user ${userId}`);
    }
  }

}
