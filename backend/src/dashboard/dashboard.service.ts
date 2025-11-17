import { Injectable, NotFoundException, BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { SupabaseService } from '../common/services/supabase.service';
import { CacheService } from '../common/services/cache.service';
import { CreateDashboardLayoutDto, UpdateDashboardLayoutDto, DashboardLayoutResponseDto, CreateDashboardCardDto, UpdateDashboardCardDto, DashboardCardResponseDto } from './dto';
import { CreateDashboardRegionDto, UpdateDashboardRegionDto, DashboardRegionResponseDto, ReorderRegionsDto, RegionType } from './dto/dashboard-region.dto';
import { CreateDashboardTemplateDto, UpdateDashboardTemplateDto, DashboardTemplateResponseDto } from './dto/dashboard-template.dto';
import { RegionValidationService } from './services/region-validation.service';
import { EventStoreService, EventType } from './services/event-store.service';
import { DashboardMetricsService } from './services/dashboard-metrics.service';
import { RegionRepository } from './repositories/region.repository';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly regionValidationService: RegionValidationService,
    private readonly cacheService: CacheService,
    private readonly eventStore: EventStoreService,
    private readonly metricsService: DashboardMetricsService,
    private readonly regionRepository: RegionRepository
  ) {}

  // Layout methods
  async getOrCreateDefaultLayout(user: any): Promise<DashboardLayoutResponseDto> {
    try {
      // Try to get existing default layout
      const { data: existingLayout, error: fetchError } = await this.supabaseService.getClient()
        .from('dashboard_layouts')
        .select('*')
        .eq('tenant_id', user.tenantId)
        .eq('user_id', user.userId)
        .eq('is_default', true)
        .is('deleted_at', null)
        .single();

      if (existingLayout && !fetchError) {
        return existingLayout as DashboardLayoutResponseDto;
      }

      // Create default layout if none exists
      const { data: newLayout, error: createError } = await this.supabaseService.getClient()
        .from('dashboard_layouts')
        .insert({
          tenant_id: user.tenantId,
          user_id: user.userId,
          name: 'Default',
          is_default: true
        })
        .select()
        .single();

      if (createError) {
        throw new BadRequestException(`Failed to create default layout: ${createError.message}`);
      }

      return newLayout as DashboardLayoutResponseDto;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to get or create default layout: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createLayout(createLayoutDto: CreateDashboardLayoutDto, user: any): Promise<DashboardLayoutResponseDto> {
    try {
      const { data, error } = await this.supabaseService.getClient()
        .from('dashboard_layouts')
        .insert({
          tenant_id: user.tenantId,
          user_id: user.userId,
          ...createLayoutDto
        })
        .select()
        .single();

      if (error) {
        throw new BadRequestException(`Failed to create layout: ${error.message}`);
      }

      return data as DashboardLayoutResponseDto;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to create layout: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getLayout(id: string, user: any): Promise<DashboardLayoutResponseDto> {
    try {
      const { data, error } = await this.supabaseService.getClient()
        .from('dashboard_layouts')
        .select('*')
        .eq('id', id)
        .eq('tenant_id', user.tenantId)
        .eq('user_id', user.userId)
        .is('deleted_at', null)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundException('Layout not found');
        }
        throw new BadRequestException(`Failed to retrieve layout: ${error.message}`);
      }

      return data as DashboardLayoutResponseDto;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to get layout: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateLayout(id: string, updateLayoutDto: UpdateDashboardLayoutDto, user: any): Promise<DashboardLayoutResponseDto> {
    try {
      const { data, error } = await this.supabaseService.getClient()
        .from('dashboard_layouts')
        .update({
          ...updateLayoutDto,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('tenant_id', user.tenantId)
        .eq('user_id', user.userId)
        .select()
        .single();

      if (error) {
        throw new BadRequestException(`Failed to update layout: ${error.message}`);
      }

      return data as DashboardLayoutResponseDto;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update layout: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteLayout(id: string, user: any): Promise<{ success: boolean }> {
    try {
      const { error } = await this.supabaseService.getClient()
        .from('dashboard_layouts')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .eq('tenant_id', user.tenantId)
        .eq('user_id', user.userId);

      if (error) {
        throw new BadRequestException(`Failed to delete layout: ${error.message}`);
      }

      return { success: true };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to delete layout: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Card methods
  async getLayoutCards(layoutId: string, user: any): Promise<DashboardCardResponseDto[]> {
    try {
      // First verify user has access to the layout
      await this.getLayout(layoutId, user);

      const { data, error } = await this.supabaseService.getClient()
        .from('dashboard_cards')
        .select('*')
        .eq('layout_id', layoutId)
        .eq('tenant_id', user.tenantId)
        .eq('user_id', user.userId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true });

      if (error) {
        throw new BadRequestException(`Failed to retrieve cards: ${error.message}`);
      }

      return data as DashboardCardResponseDto[];
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to get layout cards: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async upsertCard(cardData: CreateDashboardCardDto, user: any): Promise<DashboardCardResponseDto> {
    try {
      // Verify user has access to the layout
      await this.getLayout(cardData.layout_id, user);

      // Try to find existing card by layout_id and card_uid
      const { data: existingCard } = await this.supabaseService.getClient()
        .from('dashboard_cards')
        .select('*')
        .eq('layout_id', cardData.layout_id)
        .eq('card_uid', cardData.card_uid)
        .eq('tenant_id', user.tenantId)
        .eq('user_id', user.userId)
        .is('deleted_at', null)
        .single();

      if (existingCard) {
        // Update existing card
        const { data, error } = await this.supabaseService.getClient()
          .from('dashboard_cards')
          .update({
            ...cardData,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingCard.id)
          .eq('tenant_id', user.tenantId)
          .eq('user_id', user.userId)
          .select()
          .single();

        if (error) {
          throw new BadRequestException(`Failed to update card: ${error.message}`);
        }

        return data as DashboardCardResponseDto;
      } else {
        // Create new card
        const { data, error } = await this.supabaseService.getClient()
          .from('dashboard_cards')
          .insert({
            tenant_id: user.tenantId,
            user_id: user.userId,
            ...cardData
          })
          .select()
          .single();

        if (error) {
          throw new BadRequestException(`Failed to create card: ${error.message}`);
        }

        return data as DashboardCardResponseDto;
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to upsert card: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateCard(id: string, updateCardDto: UpdateDashboardCardDto, user: any): Promise<DashboardCardResponseDto> {
    try {
      const { data, error } = await this.supabaseService.getClient()
        .from('dashboard_cards')
        .update({
          ...updateCardDto,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('tenant_id', user.tenantId)
        .eq('user_id', user.userId)
        .select()
        .single();

      if (error) {
        throw new BadRequestException(`Failed to update card: ${error.message}`);
      }

      return data as DashboardCardResponseDto;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update card: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteCard(id: string, user: any): Promise<{ success: boolean }> {
    try {
      const { error } = await this.supabaseService.getClient()
        .from('dashboard_cards')
        .delete()
        .eq('id', id)
        .eq('tenant_id', user.tenantId)
        .eq('user_id', user.userId);

      if (error) {
        throw new BadRequestException(`Failed to delete card: ${error.message}`);
      }

      return { success: true };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to delete card: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Region methods
  async createRegion(createRegionDto: CreateDashboardRegionDto, user: any): Promise<DashboardRegionResponseDto> {
    const startTime = Date.now();
    try {
      if (!createRegionDto.layout_id) {
        throw new BadRequestException('Layout ID is required');
      }
      
      // Verify user has access to the layout
      await this.getLayout(createRegionDto.layout_id, user);

      // Validate region creation
      await this.regionValidationService.validateCreate(
        createRegionDto.layout_id,
        createRegionDto,
        user.tenantId
      );

      // Use repository to create region
      const data = await this.regionRepository.create(
        createRegionDto,
        user.tenantId,
        user.userId
      );

      // Invalidate cache
      await this.cacheService.invalidateLayout(createRegionDto.layout_id);
      await this.cacheService.invalidateRegion(data.id);

      // Record metrics
      const duration = Date.now() - startTime;
      this.metricsService.recordRegionOperation('create', duration, 'success', createRegionDto.region_type);

      // Log audit event
      await this.logAuditEvent(createRegionDto.layout_id, user, 'region_created', {
        region_id: data.id,
        region_type: createRegionDto.region_type
      });

      // Append to event store
      await this.eventStore.appendEvent({
        event_type: EventType.REGION_CREATED,
        entity_type: 'region',
        entity_id: data.id,
        tenant_id: user.tenantId,
        user_id: user.userId,
        payload: {
          layout_id: createRegionDto.layout_id,
          region_type: createRegionDto.region_type,
          grid_row: createRegionDto.grid_row ?? 0,
          grid_col: createRegionDto.grid_col ?? 0,
          row_span: createRegionDto.row_span ?? 1,
          col_span: createRegionDto.col_span ?? 1
        },
        metadata: {
          sessionId: (user as any).sessionId,
          ipAddress: (user as any).ipAddress
        }
      });

      return data as DashboardRegionResponseDto;
    } catch (error) {
      // Record error metrics
      const duration = Date.now() - startTime;
      const errorType = error instanceof BadRequestException ? 'validation' : 
                       error instanceof ConflictException ? 'conflict' : 'unknown';
      this.metricsService.recordRegionOperation('create', duration, 'failure', createRegionDto.region_type);
      this.metricsService.recordError(errorType, 'createRegion', error instanceof BadRequestException ? 400 : 500);
      
      if (error instanceof BadRequestException || error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException(`Failed to create region: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateRegion(id: string, updateRegionDto: UpdateDashboardRegionDto, user: any): Promise<DashboardRegionResponseDto> {
    const startTime = Date.now();
    let existingRegion: DashboardRegionResponseDto | null = null;
    try {
      // Get existing region to verify access
      existingRegion = await this.getRegion(id, user);

      // Validate version for optimistic locking
      const providedVersion = (updateRegionDto as any).version;
      if (providedVersion === undefined) {
        throw new BadRequestException('Version is required for optimistic locking');
      }

      // Get current version from existing region
      const currentVersion = existingRegion.version || 1;
      if (providedVersion !== currentVersion) {
        throw new ConflictException(
          `Version mismatch: expected ${currentVersion}, got ${providedVersion}. Please refresh and try again.`
        );
      }

      // Validate region update
      await this.regionValidationService.validateUpdate(
        existingRegion.layout_id,
        id,
        updateRegionDto,
        user.tenantId
      );

      // Remove version from update DTO (it's handled separately)
      const { version, ...updateData } = updateRegionDto as any;

      // Use repository to update with optimistic locking
      let updated: DashboardRegionResponseDto;
      try {
        updated = await this.regionRepository.update(
          id,
          updateData,
          user.tenantId,
          providedVersion
        );
      } catch (error: any) {
        // Check if it's a version conflict
        if (error.message?.includes('version mismatch') || error.message?.includes('not found')) {
          throw new ConflictException(
            `Version conflict: region was modified by another user. Please refresh and try again.`
          );
        }
        throw error;
      }

      // Record metrics
      const duration = Date.now() - startTime;
      this.metricsService.recordRegionOperation('update', duration, 'success', existingRegion.region_type);

      // Invalidate cache
      await this.cacheService.invalidateLayout(existingRegion.layout_id);
      await this.cacheService.invalidateRegion(id);

      // Log audit event
      await this.logAuditEvent(existingRegion.layout_id, user, 'region_updated', {
        region_id: id,
        changes: updateRegionDto,
        version: updated.version
      });

      // Append to event store
      const eventPayload: any = {
        event_type: EventType.REGION_UPDATED,
        entity_type: 'region' as const,
        entity_id: id,
        tenant_id: user.tenantId,
        user_id: user.userId,
        payload: {
          layout_id: existingRegion.layout_id,
          changes: updateRegionDto,
          previous_version: currentVersion,
          new_version: updated.version ?? currentVersion + 1
        },
        metadata: {
          sessionId: (user as any).sessionId,
          ipAddress: (user as any).ipAddress
        }
      };
      
      // Only include version if it exists
      if (updated.version !== undefined) {
        eventPayload.version = updated.version;
      }
      
      await this.eventStore.appendEvent(eventPayload);

      return updated;
    } catch (error) {
      // Record error metrics
      if (error instanceof ConflictException) {
        const duration = Date.now() - startTime;
        this.metricsService.recordRegionOperation('update', duration, 'failure', existingRegion?.region_type);
        this.metricsService.recordConflict(id, 'server'); // Server version won
      } else if (error instanceof BadRequestException) {
        const duration = Date.now() - startTime;
        this.metricsService.recordRegionOperation('update', duration, 'failure', existingRegion?.region_type);
        this.metricsService.recordError('validation', 'updateRegion', 400);
      }
      
      if (error instanceof BadRequestException || error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException(`Failed to update region: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteRegion(id: string, user: any): Promise<{ success: boolean }> {
    const startTime = Date.now();
    try {
      const existingRegion = await this.getRegion(id, user);

      // Use repository to delete
      await this.regionRepository.delete(id, user.tenantId);

      // Record metrics
      const duration = Date.now() - startTime;
      this.metricsService.recordRegionOperation('delete', duration, 'success', existingRegion.region_type);

      // Invalidate cache
      await this.cacheService.invalidateLayout(existingRegion.layout_id);
      await this.cacheService.invalidateRegion(id);

      // Log audit event
      await this.logAuditEvent(existingRegion.layout_id, user, 'region_deleted', {
        region_id: id
      });

      // Append to event store
      await this.eventStore.appendEvent({
        event_type: EventType.REGION_DELETED,
        entity_type: 'region',
        entity_id: id,
        tenant_id: user.tenantId,
        user_id: user.userId,
        payload: {
          layout_id: existingRegion.layout_id,
          region_type: existingRegion.region_type
        },
        metadata: {
          sessionId: (user as any).sessionId,
          ipAddress: (user as any).ipAddress
        }
      });

      return { success: true };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to delete region: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getRegion(id: string, user: any): Promise<DashboardRegionResponseDto> {
    try {
      // Use repository to find region
      const region = await this.regionRepository.findById(id, user.tenantId);
      
      if (!region) {
        throw new NotFoundException('Region not found');
      }

      // Additional check: verify user_id matches (if needed for stricter access control)
      // Note: This is optional - RLS should handle tenant isolation
      // Uncomment if you need user-level access control:
      // if (region.user_id !== user.userId) {
      //   throw new NotFoundException('Region not found');
      // }

      return region;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to get region: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getLayoutRegions(layoutId: string, user: any): Promise<DashboardRegionResponseDto[]> {
    try {
      // Verify user has access to the layout
      await this.getLayout(layoutId, user);

      // Phase 4: Use stale-while-revalidate for better performance
      const cacheKey = `regions:layout:${layoutId}:tenant:${user.tenantId}`;
      
      return await this.cacheService.getOrSetStaleWhileRevalidate(
        cacheKey,
        async () => {
          // Use repository to fetch regions
          return await this.regionRepository.findByLayoutId(layoutId, user.tenantId);
        },
        300, // 5 minute TTL
        240  // 4 minute stale threshold (80% of TTL)
      );
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to get layout regions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async reorderRegions(layoutId: string, reorderDto: ReorderRegionsDto, user: any): Promise<{ success: boolean }> {
    try {
      // Verify user has access to the layout
      await this.getLayout(layoutId, user);

      // Use repository to update display order
      await this.regionRepository.updateDisplayOrder(layoutId, reorderDto.region_ids, user.tenantId);

      // Invalidate cache
      await this.cacheService.invalidateLayout(layoutId);

      // Log audit event
      await this.logAuditEvent(layoutId, user, 'regions_reordered', {
        region_ids: reorderDto.region_ids
      });

      // Append to event store
      await this.eventStore.appendEvent({
        event_type: EventType.REGION_UPDATED, // Using REGION_UPDATED for reorder
        entity_type: 'region',
        entity_id: layoutId, // Using layout ID as entity
        tenant_id: user.tenantId,
        user_id: user.userId,
        payload: {
          layout_id: layoutId,
          action: 'reorder',
          region_ids: reorderDto.region_ids
        },
        metadata: {
          sessionId: (user as any).sessionId,
          ipAddress: (user as any).ipAddress
        }
      });

      return { success: true };
    } catch (error) {
      throw new BadRequestException(`Failed to reorder regions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getRoleBasedDefaults(role: string): Promise<DashboardRegionResponseDto[]> {
    // Default region layouts based on role
    const defaults: Record<string, Partial<CreateDashboardRegionDto>[]> = {
      technician: [
        { region_type: RegionType.SCHEDULING, grid_row: 0, grid_col: 0, row_span: 2, col_span: 1 },
        { region_type: RegionType.CUSTOMER_SEARCH, grid_row: 0, grid_col: 1, row_span: 1, col_span: 1 },
        { region_type: RegionType.QUICK_ACTIONS, grid_row: 1, grid_col: 1, row_span: 1, col_span: 1 },
        { region_type: RegionType.REPORTS, grid_row: 2, grid_col: 0, row_span: 1, col_span: 2 }
      ],
      manager: [
        { region_type: RegionType.REPORTS, grid_row: 0, grid_col: 0, row_span: 1, col_span: 1 },
        { region_type: RegionType.TEAM_OVERVIEW, grid_row: 0, grid_col: 1, row_span: 1, col_span: 1 },
        { region_type: RegionType.SCHEDULING, grid_row: 1, grid_col: 0, row_span: 1, col_span: 1 },
        { region_type: RegionType.ANALYTICS, grid_row: 1, grid_col: 1, row_span: 1, col_span: 1 }
      ],
      admin: [
        { region_type: RegionType.SETTINGS, grid_row: 0, grid_col: 0, row_span: 1, col_span: 1 },
        { region_type: RegionType.REPORTS, grid_row: 0, grid_col: 1, row_span: 1, col_span: 1 },
        { region_type: RegionType.ANALYTICS, grid_row: 1, grid_col: 0, row_span: 1, col_span: 2 }
      ]
    };

    const defaultRegions = defaults[role]?.map((defaultRegion, index) => {
      const region: Partial<DashboardRegionResponseDto> = {
        id: `default-${index}`,
        layout_id: '',
        tenant_id: '',
        user_id: '',
        region_type: defaultRegion.region_type!,
        grid_row: defaultRegion.grid_row ?? 0,
        grid_col: defaultRegion.grid_col ?? 0,
        row_span: defaultRegion.row_span ?? 1,
        col_span: defaultRegion.col_span ?? 1,
        min_width: 200,
        min_height: 150,
        is_collapsed: false,
        is_locked: false,
        is_hidden_mobile: false,
        config: {},
        widget_config: {},
        display_order: index,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      // widget_type is optional, so we omit it
      return region as DashboardRegionResponseDto;
    }) ?? [];
    
    return defaultRegions;
  }

  async checkRegionPermissions(regionId: string, user: any, permission: 'read' | 'edit' | 'share'): Promise<boolean> {
    try {
      const region = await this.getRegion(regionId, user);
      
      // Owner has all permissions
      if (region.user_id === user.userId) {
        return true;
      }

      // Check ACLs
      const { data: acls } = await this.supabaseService.getClient()
        .from('dashboard_region_acls')
        .select('permission_set')
        .eq('region_id', regionId)
        .eq('tenant_id', user.tenantId)
        .or(`principal_type.eq.user,principal_id.eq.${user.userId},principal_type.eq.role,principal_id.in.(${user.roles?.join(',') || ''})`)
        .single();

      if (acls) {
        return acls.permission_set?.[permission] === true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  async setRegionACL(regionId: string, aclDto: any, user: any): Promise<any> {
    try {
      // Verify user owns the region or has share permission
      const canShare = await this.checkRegionPermissions(regionId, user, 'share');
      if (!canShare) {
        throw new BadRequestException('You do not have permission to share this region');
      }

      const { data, error } = await this.supabaseService.getClient()
        .from('dashboard_region_acls')
        .upsert({
          region_id: regionId,
          tenant_id: user.tenantId,
          ...aclDto
        }, {
          onConflict: 'region_id,principal_type,principal_id'
        })
        .select()
        .single();

      if (error) {
        throw new BadRequestException(`Failed to set region ACL: ${error.message}`);
      }

      return data;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to set region ACL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async logAuditEvent(layoutId: string, user: any, action: string, changes?: any, metadata?: any): Promise<void> {
    try {
      await this.supabaseService.getClient()
        .from('dashboard_layout_audit')
        .insert({
          layout_id: layoutId,
          user_id: user.userId,
          tenant_id: user.tenantId,
          action,
          changes,
          metadata
        });
    } catch (error) {
      // Don't throw - audit logging failures shouldn't break the main operation
      console.error('Failed to log audit event:', error);
    }
  }

  // Template methods
  async createTemplate(user: any, dto: CreateDashboardTemplateDto): Promise<DashboardTemplateResponseDto> {
    try {
      const { data, error } = await this.supabaseService.getClient()
        .from('dashboard_templates')
        .insert({
          name: dto.name,
          description: dto.description,
          thumbnail: dto.thumbnail,
          tenant_id: user.tenantId,
          user_id: user.userId,
          is_public: dto.is_public || false,
          is_system: false,
          regions: dto.regions || []
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create template: ${error.message}`);
      }

      await this.eventStore.appendEvent({
        event_type: EventType.TEMPLATE_CREATED,
        entity_type: 'template',
        entity_id: data.id,
        tenant_id: user.tenantId,
        user_id: user.userId,
        payload: {
          name: dto.name,
          description: dto.description,
          is_public: dto.is_public ?? false
        },
        metadata: { name: dto.name }
      });

      return data as DashboardTemplateResponseDto;
    } catch (error) {
      this.metricsService.recordError('create_template', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  async getTemplates(user: any, includePublic: boolean = true): Promise<DashboardTemplateResponseDto[]> {
    try {
      let query = this.supabaseService.getClient()
        .from('dashboard_templates')
        .select('*')
        .eq('tenant_id', user.tenantId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (includePublic) {
        query = query.or(`user_id.eq.${user.userId},is_public.eq.true`);
      } else {
        query = query.eq('user_id', user.userId);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to get templates: ${error.message}`);
      }

      return (data || []) as DashboardTemplateResponseDto[];
    } catch (error) {
      this.metricsService.recordError('get_templates', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  async getTemplate(user: any, templateId: string): Promise<DashboardTemplateResponseDto> {
    try {
      const { data, error } = await this.supabaseService.getClient()
        .from('dashboard_templates')
        .select('*')
        .eq('id', templateId)
        .eq('tenant_id', user.tenantId)
        .is('deleted_at', null)
        .or(`user_id.eq.${user.userId},is_public.eq.true`)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundException('Template not found');
        }
        throw new Error(`Failed to get template: ${error.message}`);
      }

      return data as DashboardTemplateResponseDto;
    } catch (error) {
      this.metricsService.recordError('get_template', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  async updateTemplate(user: any, templateId: string, dto: UpdateDashboardTemplateDto): Promise<DashboardTemplateResponseDto> {
    try {
      // Verify ownership
      const existing = await this.getTemplate(user, templateId);
      if (existing.user_id !== user.userId) {
        throw new BadRequestException('Cannot update template owned by another user');
      }

      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      if (dto.name !== undefined) updateData.name = dto.name;
      if (dto.description !== undefined) updateData.description = dto.description;
      if (dto.thumbnail !== undefined) updateData.thumbnail = dto.thumbnail;
      if (dto.is_public !== undefined) updateData.is_public = dto.is_public;
      if (dto.regions !== undefined) updateData.regions = dto.regions;

      const { data, error } = await this.supabaseService.getClient()
        .from('dashboard_templates')
        .update(updateData)
        .eq('id', templateId)
        .eq('user_id', user.userId)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update template: ${error.message}`);
      }

      await this.eventStore.appendEvent({
        event_type: EventType.TEMPLATE_UPDATED,
        entity_type: 'template',
        entity_id: templateId,
        tenant_id: user.tenantId,
        user_id: user.userId,
        payload: {
          name: dto.name,
          description: dto.description,
          is_public: dto.is_public,
          thumbnail: dto.thumbnail
        },
        metadata: { name: dto.name ?? existing.name }
      });

      return data as DashboardTemplateResponseDto;
    } catch (error) {
      this.metricsService.recordError('update_template', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  async deleteTemplate(user: any, templateId: string): Promise<void> {
    try {
      // Verify ownership
      const existing = await this.getTemplate(user, templateId);
      if (existing.user_id !== user.userId) {
        throw new BadRequestException('Cannot delete template owned by another user');
      }

      const { error } = await this.supabaseService.getClient()
        .from('dashboard_templates')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', templateId)
        .eq('user_id', user.userId);

      if (error) {
        throw new Error(`Failed to delete template: ${error.message}`);
      }

      await this.eventStore.appendEvent({
        event_type: EventType.TEMPLATE_DELETED,
        entity_type: 'template',
        entity_id: templateId,
        tenant_id: user.tenantId,
        user_id: user.userId,
        payload: {
          name: existing.name
        }
      });
    } catch (error) {
      this.metricsService.recordError('delete_template', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  /**
   * Undo last change to layout regions
   * Restores regions to previous state using event history
   */
  async undoLayout(layoutId: string, user: any): Promise<{ regions: DashboardRegionResponseDto[], undoneEventType: string }> {
    try {
      this.logger.log(`Undoing layout ${layoutId} for user ${user.userId}`);
      
      // Get recent events for this layout to find undo point
      const events = await this.eventStore.getEntityEvents('layout', layoutId, user.tenantId, 50);
      
      if (!events || events.length === 0) {
        throw new NotFoundException('No undo history available for this layout');
      }

      // Find the last mutation event that can be undone
      const lastMutationEvent = events.reverse().find(e => 
        [EventType.REGION_CREATED, EventType.REGION_UPDATED, EventType.REGION_DELETED, 
         EventType.REGION_MOVED, EventType.REGION_RESIZED].includes(e.event_type as EventType)
      );

      if (!lastMutationEvent) {
        throw new NotFoundException('No undoable events found');
      }

      // Get current regions
      const currentRegions = await this.regionRepository.findByLayoutId(layoutId, user.tenantId);
      
      // Create snapshot of current state before undo
      await this.eventStore.appendEvent({
        event_type: EventType.VERSION_CREATED,
        entity_type: 'layout',
        entity_id: layoutId,
        tenant_id: user.tenantId,
        user_id: user.userId,
        payload: {
          action: 'undo_snapshot',
          regions: currentRegions,
          undoneEventId: lastMutationEvent.id,
          undoneEventType: lastMutationEvent.event_type
        },
        metadata: {
          correlationId: `undo-${layoutId}-${Date.now()}`
        }
      });

      // Reverse the last operation based on event type
      let restoredRegions: any[] = [];
      
      switch (lastMutationEvent.event_type) {
        case EventType.REGION_CREATED:
          // Undo create = delete the region
          const createdRegionId = lastMutationEvent.entity_id;
          await this.regionRepository.delete(createdRegionId, user.tenantId);
          this.logger.log(`Undid region creation: ${createdRegionId}`);
          break;
          
        case EventType.REGION_DELETED:
          // Undo delete = restore from payload
          const deletedRegionData = lastMutationEvent.payload.previousState;
          if (deletedRegionData) {
            const restored = await this.regionRepository.create(deletedRegionData, user.tenantId, user.userId);
            restoredRegions.push(restored);
            this.logger.log(`Undid region deletion: ${restored.id}`);
          }
          break;
          
        case EventType.REGION_UPDATED:
        case EventType.REGION_MOVED:
        case EventType.REGION_RESIZED:
          // Undo update = restore previous state from payload
          const updatedRegionId = lastMutationEvent.entity_id;
          const previousState = lastMutationEvent.payload.previousState;
          if (previousState) {
            const restored = await this.regionRepository.update(updatedRegionId, previousState, user.tenantId);
            restoredRegions.push(restored);
            this.logger.log(`Undid region update: ${updatedRegionId}`);
          }
          break;
      }

      // Get final state
      const finalRegions = await this.regionRepository.findByLayoutId(layoutId, user.tenantId);
      
      // Invalidate cache
      await this.cacheService.invalidateLayout(layoutId);

      this.logger.log(`Undo completed for layout ${layoutId}`);
      
      return {
        regions: finalRegions as DashboardRegionResponseDto[],
        undoneEventType: lastMutationEvent.event_type
      };
    } catch (error) {
      this.logger.error(`Failed to undo layout ${layoutId}:`, error);
      this.metricsService.recordError('undo_layout', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  /**
   * Redo last undone change to layout regions
   * Reapplies the last undone operation
   */
  async redoLayout(layoutId: string, user: any): Promise<{ regions: DashboardRegionResponseDto[], redoneEventType: string }> {
    try {
      this.logger.log(`Redoing layout ${layoutId} for user ${user.userId}`);
      
      // Get recent events to find undo snapshot
      const events = await this.eventStore.getEntityEvents('layout', layoutId, user.tenantId, 50);
      
      if (!events || events.length === 0) {
        throw new NotFoundException('No redo history available');
      }

      // Find the last undo snapshot
      const lastUndoSnapshot = events.reverse().find(e => 
        e.event_type === EventType.VERSION_CREATED && 
        e.payload.action === 'undo_snapshot'
      );

      if (!lastUndoSnapshot) {
        throw new NotFoundException('No redo operation available');
      }

      // Get the undone event info
      const undoneEventId = lastUndoSnapshot.payload.undoneEventId;
      const undoneEventType = lastUndoSnapshot.payload.undoneEventType;
      
      // Find the original event that was undone
      const originalEvent = events.find(e => e.id === undoneEventId);
      
      if (!originalEvent) {
        throw new NotFoundException('Original event not found for redo');
      }

      // Reapply the original operation by restoring from the undo snapshot
      let restoredRegions: any[] = [];
      const snapshotRegions = lastUndoSnapshot.payload.regions || [];
      
      switch (originalEvent.event_type) {
        case EventType.REGION_CREATED:
          // Redo create = restore the region that was deleted during undo
          // Find the region in the snapshot that was created
          const regionToRestore = snapshotRegions.find((r: any) => r.id === originalEvent.entity_id);
          if (regionToRestore) {
            const recreated = await this.regionRepository.create(regionToRestore as CreateDashboardRegionDto, user.tenantId, user.userId);
            restoredRegions.push(recreated);
            this.logger.log(`Redid region creation: ${recreated.id}`);
          }
          break;
          
        case EventType.REGION_DELETED:
          // Redo delete = delete again
          await this.regionRepository.delete(originalEvent.entity_id, user.tenantId);
          this.logger.log(`Redid region deletion: ${originalEvent.entity_id}`);
          break;
          
        case EventType.REGION_UPDATED:
        case EventType.REGION_MOVED:
        case EventType.REGION_RESIZED:
          // Redo update = restore the region state from the snapshot
          const regionInSnapshot = snapshotRegions.find((r: any) => r.id === originalEvent.entity_id);
          if (regionInSnapshot) {
            const updated = await this.regionRepository.update(originalEvent.entity_id, regionInSnapshot, user.tenantId);
            restoredRegions.push(updated);
            this.logger.log(`Redid region update: ${originalEvent.entity_id}`);
          }
          break;
      }

      // Get final state
      const finalRegions = await this.regionRepository.findByLayoutId(layoutId, user.tenantId);
      
      // Invalidate cache
      await this.cacheService.invalidateLayout(layoutId);

      this.logger.log(`Redo completed for layout ${layoutId}`);
      
      return {
        regions: finalRegions as DashboardRegionResponseDto[],
        redoneEventType: undoneEventType
      };
    } catch (error) {
      this.logger.error(`Failed to redo layout ${layoutId}:`, error);
      this.metricsService.recordError('redo_layout', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  /**
   * Get undo/redo history for a layout
   */
  async getLayoutHistory(layoutId: string, user: any): Promise<{
    canUndo: boolean;
    canRedo: boolean;
    recentEvents: Array<{ type: string; timestamp: Date; description: string }>;
  }> {
    try {
      const events = await this.eventStore.getEntityEvents('layout', layoutId, user.tenantId, 20);
      
      const hasUndoableEvents = events.some(e => 
        [EventType.REGION_CREATED, EventType.REGION_UPDATED, EventType.REGION_DELETED, 
         EventType.REGION_MOVED, EventType.REGION_RESIZED].includes(e.event_type as EventType)
      );

      const hasRedoableEvents = events.some(e => 
        e.event_type === EventType.VERSION_CREATED && e.payload.action === 'undo_snapshot'
      );

      const recentEvents = events.slice(0, 10).map(e => ({
        type: e.event_type,
        timestamp: e.timestamp || new Date(),
        description: this.formatEventDescription(e)
      }));

      return {
        canUndo: hasUndoableEvents,
        canRedo: hasRedoableEvents,
        recentEvents
      };
    } catch (error) {
      this.logger.error(`Failed to get layout history ${layoutId}:`, error);
      throw error;
    }
  }

  private formatEventDescription(event: any): string {
    const eventTypeMap: Record<string, string> = {
      [EventType.REGION_CREATED]: 'Created region',
      [EventType.REGION_UPDATED]: 'Updated region',
      [EventType.REGION_DELETED]: 'Deleted region',
      [EventType.REGION_MOVED]: 'Moved region',
      [EventType.REGION_RESIZED]: 'Resized region',
      [EventType.VERSION_CREATED]: 'Created version snapshot',
    };
    
    return eventTypeMap[event.event_type] || event.event_type;
  }
}
