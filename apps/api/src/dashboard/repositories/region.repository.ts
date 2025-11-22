import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../common/services/supabase.service';
import { CreateDashboardRegionDto, UpdateDashboardRegionDto, DashboardRegionResponseDto } from '../dto/dashboard-region.dto';

/**
 * Repository for region database operations
 * Abstracts Supabase queries and provides a clean interface for region CRUD
 */
@Injectable()
export class RegionRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Find a region by ID with tenant isolation
   */
  async findById(regionId: string, tenantId: string): Promise<DashboardRegionResponseDto | null> {
    const { data, error } = await this.supabaseService.getClient()
      .from('dashboard_regions')
      .select('*')
      .eq('id', regionId)
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to find region: ${error.message}`);
    }

    return data as DashboardRegionResponseDto;
  }

  /**
   * Find all regions for a layout with tenant isolation
   */
  async findByLayoutId(layoutId: string, tenantId: string): Promise<DashboardRegionResponseDto[]> {
    const { data, error } = await this.supabaseService.getClient()
      .from('dashboard_regions')
      .select('*')
      .eq('layout_id', layoutId)
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .order('display_order', { ascending: true })
      .order('grid_row', { ascending: true })
      .order('grid_col', { ascending: true });

    if (error) {
      throw new Error(`Failed to find regions: ${error.message}`);
    }

    return (data || []) as DashboardRegionResponseDto[];
  }

  /**
   * Find regions that overlap with a given position
   */
  async findOverlappingRegions(
    layoutId: string,
    tenantId: string,
    gridRow: number,
    gridCol: number,
    rowSpan: number,
    colSpan: number,
    excludeRegionId?: string
  ): Promise<DashboardRegionResponseDto[]> {
    // Query all regions for the layout
    const { data, error } = await this.supabaseService.getClient()
      .from('dashboard_regions')
      .select('*')
      .eq('layout_id', layoutId)
      .eq('tenant_id', tenantId)
      .is('deleted_at', null);

    if (error) {
      throw new Error(`Failed to find overlapping regions: ${error.message}`);
    }

    // Filter for overlaps in memory (PostgreSQL doesn't have native rectangle overlap operators)
    const regions = (data || []) as DashboardRegionResponseDto[];
    const overlapping: DashboardRegionResponseDto[] = [];

    const newRight = gridCol + colSpan;
    const newBottom = gridRow + rowSpan;

    for (const region of regions) {
      if (excludeRegionId && region.id === excludeRegionId) {
        continue;
      }

      const existingRight = region.grid_col + region.col_span;
      const existingBottom = region.grid_row + region.row_span;

      // Check if rectangles overlap
      if (
        gridCol < existingRight &&
        newRight > region.grid_col &&
        gridRow < existingBottom &&
        newBottom > region.grid_row
      ) {
        overlapping.push(region);
      }
    }

    return overlapping;
  }

  /**
   * Create a new region
   */
  async create(
    createDto: CreateDashboardRegionDto,
    tenantId: string,
    userId: string
  ): Promise<DashboardRegionResponseDto> {
    const { data, error } = await this.supabaseService.getClient()
      .from('dashboard_regions')
      .insert({
        tenant_id: tenantId,
        user_id: userId,
        ...createDto,
        grid_row: createDto.grid_row ?? 0,
        grid_col: createDto.grid_col ?? 0,
        row_span: createDto.row_span ?? 1,
        col_span: createDto.col_span ?? 1,
        min_width: createDto.min_width ?? 200,
        min_height: createDto.min_height ?? 150,
        is_collapsed: createDto.is_collapsed ?? false,
        is_locked: createDto.is_locked ?? false,
        is_hidden_mobile: createDto.is_hidden_mobile ?? false,
        display_order: createDto.display_order ?? 0,
        config: createDto.config ?? {},
        widget_config: createDto.widget_config ?? {},
        version: 1 // Initialize version for optimistic locking
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create region: ${error.message}`);
    }

    return data as DashboardRegionResponseDto;
  }

  /**
   * Update a region with optimistic locking
   */
  async update(
    regionId: string,
    updateDto: UpdateDashboardRegionDto,
    tenantId: string,
    expectedVersion?: number
  ): Promise<DashboardRegionResponseDto> {
    // Build update query
    let query = this.supabaseService.getClient()
      .from('dashboard_regions')
      .update({
        ...updateDto,
        updated_at: new Date().toISOString(),
        version: expectedVersion !== undefined ? expectedVersion + 1 : undefined
      })
      .eq('id', regionId)
      .eq('tenant_id', tenantId)
      .is('deleted_at', null);

    // Add version check for optimistic locking
    if (expectedVersion !== undefined) {
      query = query.eq('version', expectedVersion);
    }

    const { data, error } = await query.select().single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows updated - could be version mismatch or not found
        throw new Error('Region not found or version mismatch');
      }
      throw new Error(`Failed to update region: ${error.message}`);
    }

    if (!data) {
      throw new Error('Region not found or version mismatch');
    }

    return data as DashboardRegionResponseDto;
  }

  /**
   * Delete a region (soft delete)
   */
  async delete(regionId: string, tenantId: string): Promise<void> {
    const { error } = await this.supabaseService.getClient()
      .from('dashboard_regions')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', regionId)
      .eq('tenant_id', tenantId)
      .is('deleted_at', null);

    if (error) {
      throw new Error(`Failed to delete region: ${error.message}`);
    }
  }

  /**
   * Update display order for multiple regions
   */
  async updateDisplayOrder(
    layoutId: string,
    regionIds: string[],
    tenantId: string
  ): Promise<void> {
    // Use a transaction-like approach with multiple updates
    const updates = regionIds.map((regionId, index) => ({
      id: regionId,
      display_order: index
    }));

    // Update each region's display order
    for (const update of updates) {
      const { error } = await this.supabaseService.getClient()
        .from('dashboard_regions')
        .update({ display_order: update.display_order })
        .eq('id', update.id)
        .eq('layout_id', layoutId)
        .eq('tenant_id', tenantId)
        .is('deleted_at', null);

      if (error) {
        throw new Error(`Failed to update display order: ${error.message}`);
      }
    }
  }

  /**
   * Get region count for a layout
   */
  async countByLayoutId(layoutId: string, tenantId: string): Promise<number> {
    const { count, error } = await this.supabaseService.getClient()
      .from('dashboard_regions')
      .select('*', { count: 'exact', head: true })
      .eq('layout_id', layoutId)
      .eq('tenant_id', tenantId)
      .is('deleted_at', null);

    if (error) {
      throw new Error(`Failed to count regions: ${error.message}`);
    }

    return count || 0;
  }

  /**
   * Check if a region exists
   */
  async exists(regionId: string, tenantId: string): Promise<boolean> {
    const region = await this.findById(regionId, tenantId);
    return region !== null;
  }
}



