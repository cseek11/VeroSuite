import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateDashboardRegionDto, UpdateDashboardRegionDto } from '../dto/dashboard-region.dto';
import { SupabaseService } from '../../common/services/supabase.service';
import { validateGridBounds, regionsOverlap, VALIDATION_MESSAGES } from '../../../../../shared/validation/region-constants';

/**
 * Interface for region position data
 */
interface RegionPosition {
  id?: string;
  grid_row: number;
  grid_col: number;
  row_span: number;
  col_span: number;
}

/**
 * Service for validating region operations
 */
@Injectable()
export class RegionValidationService {
  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Validate region fits within grid bounds (uses shared validation)
   */
  validateGridBounds(region: { grid_col: number; col_span: number; grid_row: number; row_span: number }): void {
    const result = validateGridBounds(region);
    if (!result.valid && result.error) {
      throw new BadRequestException(result.error);
    }
  }

  /**
   * Validate region doesn't overlap with existing regions
   * Note: This could be optimized to use RegionRepository, but keeping direct query for now
   * to avoid circular dependency (validation service is used by repository operations)
   */
  async validateNoOverlap(
    layoutId: string,
    region: RegionPosition,
    excludeRegionId?: string,
    tenantId?: string
  ): Promise<void> {
    // Get all existing regions for this layout
    // CRITICAL: Filter by tenant_id explicitly, don't rely solely on RLS
    let query = this.supabaseService
      .getClient()
      .from('dashboard_regions')
      .select('id, grid_row, grid_col, row_span, col_span')
      .eq('layout_id', layoutId)
      .is('deleted_at', null);
    
    // Explicitly filter by tenant_id if provided (defense in depth)
    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }
    
    const { data: existingRegions, error } = await query;

    if (error) {
      throw new BadRequestException(`Failed to check for overlaps: ${error.message}`);
    }

    // Check for overlaps using shared validation function
    for (const existing of existingRegions || []) {
      if (excludeRegionId && existing.id === excludeRegionId) {
        continue;
      }

      if (regionsOverlap(region, existing as RegionPosition)) {
        throw new BadRequestException(
          VALIDATION_MESSAGES.REGION_OVERLAPS(existing.grid_row, existing.grid_col)
        );
      }
    }
  }

  /**
   * Validate region create request
   */
  async validateCreate(
    layoutId: string,
    dto: CreateDashboardRegionDto,
    tenantId?: string
  ): Promise<void> {
    // Validate grid bounds
    this.validateGridBounds({
      grid_row: dto.grid_row ?? 0,
      grid_col: dto.grid_col ?? 0,
      row_span: dto.row_span ?? 1,
      col_span: dto.col_span ?? 1
    });

    // Validate no overlap
    await this.validateNoOverlap(
      layoutId,
      {
        grid_row: dto.grid_row ?? 0,
        grid_col: dto.grid_col ?? 0,
        row_span: dto.row_span ?? 1,
        col_span: dto.col_span ?? 1
      },
      undefined,
      tenantId
    );

    // Validate minimum size constraints
    // Note: min_width and min_height are constraints for the region's minimum size,
    // not validations against the grid. They can be larger than the initial grid size
    // since regions can be resized and the grid is responsive.
    // We only validate that they're within reasonable bounds (handled by DTO validation).
    
    // Optional: Warn if min_width is significantly larger than initial grid size
    // This is informational only, not a blocking validation
    if (dto.min_width && dto.col_span && process.env.NODE_ENV === 'development') {
      const approximateWidth = dto.col_span * 100; // Approximate: 100px per column
      if (dto.min_width > approximateWidth * 2) {
        console.warn(
          `Region min_width (${dto.min_width}px) is significantly larger than initial grid width (${approximateWidth}px)`
        );
      }
    }

    // Validate config for XSS
    if (dto.config) {
      this.validateConfigForXSS(dto.config);
    }

    // Validate widget config for XSS
    if (dto.widget_config) {
      this.validateConfigForXSS(dto.widget_config);
    }
  }

  /**
   * Validate region update request
   */
  async validateUpdate(
    layoutId: string,
    regionId: string,
    dto: UpdateDashboardRegionDto,
    tenantId?: string
  ): Promise<void> {
    // Get current region to merge with updates
    // CRITICAL: Filter by tenant_id explicitly, don't rely solely on RLS
    let query = this.supabaseService
      .getClient()
      .from('dashboard_regions')
      .select('grid_row, grid_col, row_span, col_span')
      .eq('id', regionId)
      .eq('layout_id', layoutId)
      .is('deleted_at', null);
    
    // Explicitly filter by tenant_id if provided (defense in depth)
    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }
    
    const { data: currentRegion, error } = await query.single();

    if (error || !currentRegion) {
      throw new BadRequestException(`Region ${regionId} not found`);
    }

    // Merge current values with updates
    const updatedRegion = {
      grid_row: dto.grid_row ?? currentRegion.grid_row,
      grid_col: dto.grid_col ?? currentRegion.grid_col,
      row_span: dto.row_span ?? currentRegion.row_span,
      col_span: dto.col_span ?? currentRegion.col_span
    };

    // Validate grid bounds if position/size changed
    if (dto.grid_row !== undefined || dto.grid_col !== undefined || 
        dto.row_span !== undefined || dto.col_span !== undefined) {
      this.validateGridBounds(updatedRegion);

      // Validate no overlap (excluding current region)
      await this.validateNoOverlap(
        layoutId,
        updatedRegion,
        regionId,
        tenantId
      );
    }

    // Validate minimum size constraints if size changed
    if (dto.min_width !== undefined && updatedRegion.col_span) {
      const maxWidth = updatedRegion.col_span * 100;
      if (dto.min_width > maxWidth) {
        throw new BadRequestException(
          `Minimum width (${dto.min_width}px) exceeds region width (${maxWidth}px)`
        );
      }
    }

    if (dto.min_height !== undefined && updatedRegion.row_span) {
      const maxHeight = updatedRegion.row_span * 100;
      if (dto.min_height > maxHeight) {
        throw new BadRequestException(
          `Minimum height (${dto.min_height}px) exceeds region height (${maxHeight}px)`
        );
      }
    }

    // Validate config for XSS if config changed
    if (dto.config) {
      this.validateConfigForXSS(dto.config);
    }

    // Validate widget config for XSS if widget config changed
    if (dto.widget_config) {
      this.validateConfigForXSS(dto.widget_config);
    }
  }

  /**
   * Validate config object for XSS vulnerabilities
   */
  private validateConfigForXSS(config: any): void {
    const configStr = JSON.stringify(config);
    
    // Check for script tags
    if (/<script/i.test(configStr)) {
      throw new BadRequestException('Config contains potentially dangerous content: script tags detected');
    }

    // Check for javascript: protocol
    if (/javascript:/i.test(configStr)) {
      throw new BadRequestException('Config contains potentially dangerous content: javascript: protocol detected');
    }

    // Check for event handlers
    if (/on\w+\s*=/i.test(configStr)) {
      throw new BadRequestException('Config contains potentially dangerous content: event handlers detected');
    }

    // Check for eval
    if (/eval\(/i.test(configStr)) {
      throw new BadRequestException('Config contains potentially dangerous content: eval() detected');
    }
  }

  /**
   * Validate version for optimistic locking
   */
  async validateVersion(
    regionId: string,
    providedVersion: number | undefined,
    _tenantId?: string
  ): Promise<number> {
    if (providedVersion === undefined) {
      // No version provided, get current version
      const { data: region, error } = await this.supabaseService
        .getClient()
        .from('dashboard_regions')
        .select('version')
        .eq('id', regionId)
        .single();

      if (error || !region) {
        throw new BadRequestException(`Region ${regionId} not found`);
      }

      return (region as any).version || 1;
    }

    // Version provided, validate it matches current version
    const { data: region, error } = await this.supabaseService
      .getClient()
      .from('dashboard_regions')
      .select('version')
      .eq('id', regionId)
      .single();

    if (error || !region) {
      throw new BadRequestException(`Region ${regionId} not found`);
    }

    const currentVersion = (region as any).version || 1;

    if (providedVersion !== currentVersion) {
      throw new BadRequestException(
        `Version conflict: provided version ${providedVersion} does not match current version ${currentVersion}`
      );
    }

    return currentVersion;
  }
}

