import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../common/services/supabase.service';

@Injectable()
export class SSRService {
  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Generate HTML skeleton for dashboard regions
   * This can be used for server-side rendering to improve TTFP
   */
  async generateRegionSkeleton(layoutId: string, tenantId: string): Promise<string> {
    try {
      // Get regions for the layout
      const { data: regions } = await this.supabaseService.getClient()
        .from('dashboard_regions')
        .select('id, region_type, grid_row, grid_col, row_span, col_span, is_collapsed')
        .eq('layout_id', layoutId)
        .eq('tenant_id', tenantId)
        .is('deleted_at', null)
        .order('display_order', { ascending: true });

      if (!regions || regions.length === 0) {
        return this.generateEmptySkeleton();
      }

      // Calculate grid dimensions
      const maxRow = Math.max(...regions.map((r: any) => r.grid_row + r.row_span), 0);
      const maxCol = Math.max(...regions.map((r: any) => r.grid_col + r.col_span), 0);

      // Generate skeleton HTML
      const skeletonHTML = `
        <div class="region-grid" style="display: grid; grid-template-rows: repeat(${maxRow}, 1fr); grid-template-columns: repeat(${maxCol}, 1fr); gap: 16px;">
          ${regions.map((region: any) => `
            <div 
              class="region-skeleton" 
              style="grid-row: ${region.grid_row + 1} / ${region.grid_row + 1 + region.row_span}; grid-column: ${region.grid_col + 1} / ${region.grid_col + 1 + region.col_span};"
            >
              <div class="skeleton-header" style="height: 40px; background: #f3f4f6; border-radius: 4px 4px 0 0;"></div>
              <div class="skeleton-content" style="height: 200px; background: #f9fafb; border-radius: 0 0 4px 4px; padding: 16px;">
                <div style="height: 16px; background: #e5e7eb; border-radius: 4px; width: 60%; margin-bottom: 8px;"></div>
                <div style="height: 16px; background: #e5e7eb; border-radius: 4px; width: 80%;"></div>
              </div>
            </div>
          `).join('')}
        </div>
      `;

      return skeletonHTML;
    } catch (error) {
      console.error('Failed to generate region skeleton:', error);
      return this.generateEmptySkeleton();
    }
  }

  private generateEmptySkeleton(): string {
    return `
      <div class="region-grid-empty" style="display: flex; align-items: center; justify-content: center; min-height: 400px; background: #f9fafb; border-radius: 8px;">
        <div style="text-align: center; color: #6b7280;">
          <p>No regions configured</p>
        </div>
      </div>
    `;
  }

  /**
   * Get cached region metadata for edge caching
   */
  async getCachedRegionMetadata(layoutId: string, tenantId: string): Promise<any> {
    try {
      const { data: regions } = await this.supabaseService.getClient()
        .from('dashboard_regions')
        .select('id, region_type, widget_type, grid_row, grid_col, row_span, col_span')
        .eq('layout_id', layoutId)
        .eq('tenant_id', tenantId)
        .is('deleted_at', null)
        .order('display_order', { ascending: true });

      return {
        layoutId,
        regionCount: regions?.length || 0,
        regions: regions?.map((r: any) => ({
          id: r.id,
          type: r.region_type,
          widget: r.widget_type,
          position: { row: r.grid_row, col: r.grid_col },
          size: { rows: r.row_span, cols: r.col_span }
        })) || []
      };
    } catch (error) {
      console.error('Failed to get cached region metadata:', error);
      return null;
    }
  }
}





