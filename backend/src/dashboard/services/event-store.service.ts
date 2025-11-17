import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../common/services/supabase.service';
import { ConfigService } from '@nestjs/config';

export enum EventType {
  REGION_CREATED = 'region_created',
  REGION_UPDATED = 'region_updated',
  REGION_DELETED = 'region_deleted',
  REGION_MOVED = 'region_moved',
  REGION_RESIZED = 'region_resized',
  REGION_LOCKED = 'region_locked',
  REGION_UNLOCKED = 'region_unlocked',
  REGION_COLLAPSED = 'region_collapsed',
  REGION_EXPANDED = 'region_expanded',
  LAYOUT_CREATED = 'layout_created',
  LAYOUT_UPDATED = 'layout_updated',
  LAYOUT_DELETED = 'layout_deleted',
  VERSION_CREATED = 'version_created',
  VERSION_PUBLISHED = 'version_published',
  VERSION_REVERTED = 'version_reverted',
  ACL_CREATED = 'acl_created',
  ACL_UPDATED = 'acl_updated',
  ACL_DELETED = 'acl_deleted',
  TEMPLATE_CREATED = 'template_created',
  TEMPLATE_UPDATED = 'template_updated',
  TEMPLATE_DELETED = 'template_deleted',
  SAGA_COMPLETED = 'saga_completed',
  SAGA_ROLLED_BACK = 'saga_rolled_back',
}

export interface EventMetadata {
  userAgent?: string;
  ipAddress?: string;
  sessionId?: string;
  correlationId?: string;
  [key: string]: any;
}

export interface DashboardEvent {
  id?: string;
  event_type: EventType;
  entity_type: 'region' | 'layout' | 'version' | 'acl' | 'template' | 'saga';
  entity_id: string;
  tenant_id: string;
  user_id: string;
  payload: Record<string, any>;
  metadata?: EventMetadata;
  timestamp?: Date;
  version?: number;
}

/**
 * Event store service for audit trail and compliance
 */
@Injectable()
export class EventStoreService {
  private readonly logger = new Logger(EventStoreService.name);
  private readonly enableEventSourcing: boolean;

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly configService: ConfigService
  ) {
    this.enableEventSourcing = this.configService.get<string>('ENABLE_EVENT_SOURCING', 'true') === 'true';
  }

  /**
   * Append event to event store
   */
  async appendEvent(event: DashboardEvent): Promise<void> {
    if (!this.enableEventSourcing) {
      return;
    }

    try {
      const { error } = await this.supabaseService.getClient()
        .from('dashboard_events')
        .insert({
          event_type: event.event_type,
          entity_type: event.entity_type,
          entity_id: event.entity_id,
          tenant_id: event.tenant_id,
          user_id: event.user_id,
          payload: event.payload,
          metadata: event.metadata || {},
          timestamp: event.timestamp || new Date().toISOString(),
          version: event.version || 1
        });

      if (error) {
        this.logger.error('Failed to append event to store', error);
        throw error;
      }

      this.logger.debug(`Event appended: ${event.event_type} for ${event.entity_type}:${event.entity_id}`);
    } catch (error) {
      this.logger.error('Error appending event', error);
      // Don't throw - event sourcing should not break main flow
    }
  }

  /**
   * Get events for an entity
   */
  async getEntityEvents(
    entityType: string,
    entityId: string,
    tenantId: string,
    limit: number = 100
  ): Promise<DashboardEvent[]> {
    try {
      const { data, error } = await this.supabaseService.getClient()
        .from('dashboard_events')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .eq('tenant_id', tenantId)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        this.logger.error('Failed to get entity events', error);
        throw error;
      }

      return (data || []).map(this.mapToEvent);
    } catch (error) {
      this.logger.error('Error getting entity events', error);
      return [];
    }
  }

  /**
   * Get events for a user
   */
  async getUserEvents(
    userId: string,
    tenantId: string,
    startDate?: Date,
    endDate?: Date,
    limit: number = 1000
  ): Promise<DashboardEvent[]> {
    try {
      let query = this.supabaseService.getClient()
        .from('dashboard_events')
        .select('*')
        .eq('user_id', userId)
        .eq('tenant_id', tenantId)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (startDate) {
        query = query.gte('timestamp', startDate.toISOString());
      }

      if (endDate) {
        query = query.lte('timestamp', endDate.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        this.logger.error('Failed to get user events', error);
        throw error;
      }

      return (data || []).map(this.mapToEvent);
    } catch (error) {
      this.logger.error('Error getting user events', error);
      return [];
    }
  }

  /**
   * Get events for a tenant (for compliance/audit)
   */
  async getTenantEvents(
    tenantId: string,
    startDate?: Date,
    endDate?: Date,
    eventTypes?: EventType[],
    limit: number = 10000
  ): Promise<DashboardEvent[]> {
    try {
      let query = this.supabaseService.getClient()
        .from('dashboard_events')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (startDate) {
        query = query.gte('timestamp', startDate.toISOString());
      }

      if (endDate) {
        query = query.lte('timestamp', endDate.toISOString());
      }

      if (eventTypes && eventTypes.length > 0) {
        query = query.in('event_type', eventTypes);
      }

      const { data, error } = await query;

      if (error) {
        this.logger.error('Failed to get tenant events', error);
        throw error;
      }

      return (data || []).map(this.mapToEvent);
    } catch (error) {
      this.logger.error('Error getting tenant events', error);
      return [];
    }
  }

  /**
   * Replay events to rebuild entity state
   */
  async replayEvents(
    entityType: string,
    entityId: string,
    tenantId: string,
    upToVersion?: number
  ): Promise<DashboardEvent[]> {
    try {
      let query = this.supabaseService.getClient()
        .from('dashboard_events')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .eq('tenant_id', tenantId)
        .order('timestamp', { ascending: true });

      if (upToVersion) {
        query = query.lte('version', upToVersion);
      }

      const { data, error } = await query;

      if (error) {
        this.logger.error('Failed to replay events', error);
        throw error;
      }

      return (data || []).map(this.mapToEvent);
    } catch (error) {
      this.logger.error('Error replaying events', error);
      return [];
    }
  }

  /**
   * Create audit report
   */
  async createAuditReport(
    tenantId: string,
    startDate: Date,
    endDate: Date,
    userId?: string
  ): Promise<{
    summary: {
      totalEvents: number;
      eventsByType: Record<string, number>;
      eventsByUser: Record<string, number>;
    };
    events: DashboardEvent[];
  }> {
    const events = await this.getTenantEvents(tenantId, startDate, endDate);

    const filteredEvents = userId
      ? events.filter(e => e.user_id === userId)
      : events;

    const eventsByType: Record<string, number> = {};
    const eventsByUser: Record<string, number> = {};

    filteredEvents.forEach(event => {
      eventsByType[event.event_type] = (eventsByType[event.event_type] || 0) + 1;
      eventsByUser[event.user_id] = (eventsByUser[event.user_id] || 0) + 1;
    });

    return {
      summary: {
        totalEvents: filteredEvents.length,
        eventsByType,
        eventsByUser
      },
      events: filteredEvents
    };
  }

  /**
   * Map database row to event
   */
  private mapToEvent(row: any): DashboardEvent {
    return {
      id: row.id,
      event_type: row.event_type as EventType,
      entity_type: row.entity_type as 'region' | 'layout' | 'version' | 'acl',
      entity_id: row.entity_id,
      tenant_id: row.tenant_id,
      user_id: row.user_id,
      payload: row.payload || {},
      metadata: row.metadata || {},
      timestamp: row.timestamp ? new Date(row.timestamp) : new Date(),
      version: row.version || 1
    };
  }
}



