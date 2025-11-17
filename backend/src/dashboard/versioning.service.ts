import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../common/services/supabase.service';
import { LayoutVersionResponseDto, LayoutVersionStatus } from './dto/dashboard-region.dto';

@Injectable()
export class VersioningService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createVersion(layoutId: string, user: any, status: LayoutVersionStatus = LayoutVersionStatus.DRAFT, notes?: string): Promise<LayoutVersionResponseDto> {
    try {
      // Get current layout and regions
      const { data: layout } = await this.supabaseService.getClient()
        .from('dashboard_layouts')
        .select('*')
        .eq('id', layoutId)
        .eq('tenant_id', user.tenantId)
        .eq('user_id', user.userId)
        .is('deleted_at', null)
        .single();

      if (!layout) {
        throw new NotFoundException('Layout not found');
      }

      // Get current regions
      const { data: regions } = await this.supabaseService.getClient()
        .from('dashboard_regions')
        .select('*')
        .eq('layout_id', layoutId)
        .eq('tenant_id', user.tenantId)
        .eq('user_id', user.userId)
        .is('deleted_at', null);

      // Get next version number
      const { data: lastVersion } = await this.supabaseService.getClient()
        .from('dashboard_layout_versions')
        .select('version_number')
        .eq('layout_id', layoutId)
        .order('version_number', { ascending: false })
        .limit(1)
        .single();

      const versionNumber = lastVersion ? lastVersion.version_number + 1 : 1;

      // Get previous version for diff
      const previousVersion = lastVersion ? await this.getVersionByNumber(layoutId, lastVersion.version_number, user) : null;
      const diff = previousVersion ? this.calculateDiff(previousVersion.payload, { layout, regions }) : null;

      // Create version
      const { data, error } = await this.supabaseService.getClient()
        .from('dashboard_layout_versions')
        .insert({
          layout_id: layoutId,
          version_number: versionNumber,
          status,
          created_by: user.userId,
          tenant_id: user.tenantId,
          payload: { layout, regions },
          diff,
          notes
        })
        .select()
        .single();

      if (error) {
        throw new BadRequestException(`Failed to create version: ${error.message}`);
      }

      return data as LayoutVersionResponseDto;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to create version: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getVersions(layoutId: string, user: any): Promise<LayoutVersionResponseDto[]> {
    try {
      // Verify user has access to layout
      const { data: layout } = await this.supabaseService.getClient()
        .from('dashboard_layouts')
        .select('id')
        .eq('id', layoutId)
        .eq('tenant_id', user.tenantId)
        .eq('user_id', user.userId)
        .is('deleted_at', null)
        .single();

      if (!layout) {
        throw new NotFoundException('Layout not found');
      }

      const { data, error } = await this.supabaseService.getClient()
        .from('dashboard_layout_versions')
        .select('*')
        .eq('layout_id', layoutId)
        .eq('tenant_id', user.tenantId)
        .order('version_number', { ascending: false });

      if (error) {
        throw new BadRequestException(`Failed to retrieve versions: ${error.message}`);
      }

      return data as LayoutVersionResponseDto[];
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to get versions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getVersion(id: string, user: any): Promise<LayoutVersionResponseDto> {
    try {
      const { data, error } = await this.supabaseService.getClient()
        .from('dashboard_layout_versions')
        .select('*')
        .eq('id', id)
        .eq('tenant_id', user.tenantId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundException('Version not found');
        }
        throw new BadRequestException(`Failed to retrieve version: ${error.message}`);
      }

      return data as LayoutVersionResponseDto;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to get version: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getVersionByNumber(layoutId: string, versionNumber: number, user: any): Promise<LayoutVersionResponseDto | null> {
    try {
      const { data, error } = await this.supabaseService.getClient()
        .from('dashboard_layout_versions')
        .select('*')
        .eq('layout_id', layoutId)
        .eq('version_number', versionNumber)
        .eq('tenant_id', user.tenantId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw new BadRequestException(`Failed to retrieve version: ${error.message}`);
      }

      return data as LayoutVersionResponseDto;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      return null;
    }
  }

  async publishVersion(layoutId: string, versionId: string, user: any, notes?: string): Promise<LayoutVersionResponseDto> {
    try {
      const version = await this.getVersion(versionId, user);

      if (version.layout_id !== layoutId) {
        throw new BadRequestException('Version does not belong to this layout');
      }

      // Mark all other published versions as draft
      await this.supabaseService.getClient()
        .from('dashboard_layout_versions')
        .update({ status: LayoutVersionStatus.DRAFT })
        .eq('layout_id', layoutId)
        .eq('status', LayoutVersionStatus.PUBLISHED)
        .eq('tenant_id', user.tenantId);

      // Mark this version as published
      const { data, error } = await this.supabaseService.getClient()
        .from('dashboard_layout_versions')
        .update({
          status: LayoutVersionStatus.PUBLISHED,
          notes: notes || version.notes
        })
        .eq('id', versionId)
        .eq('tenant_id', user.tenantId)
        .select()
        .single();

      if (error) {
        throw new BadRequestException(`Failed to publish version: ${error.message}`);
      }

      // Restore layout and regions from version payload
      await this.restoreFromVersion(layoutId, version.payload, user);

      return data as LayoutVersionResponseDto;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to publish version: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async revertToVersion(layoutId: string, versionId: string, user: any): Promise<{ success: boolean }> {
    try {
      const version = await this.getVersion(versionId, user);

      if (version.layout_id !== layoutId) {
        throw new BadRequestException('Version does not belong to this layout');
      }

      // Restore layout and regions from version payload
      await this.restoreFromVersion(layoutId, version.payload, user);

      // Create a new version from the reverted state
      await this.createVersion(layoutId, user, LayoutVersionStatus.DRAFT, `Reverted to version ${version.version_number}`);

      return { success: true };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to revert to version: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getVersionDiff(versionId1: string, versionId2: string, user: any): Promise<any> {
    try {
      const version1 = await this.getVersion(versionId1, user);
      const version2 = await this.getVersion(versionId2, user);

      return this.calculateDiff(version1.payload, version2.payload);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to get version diff: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async restoreFromVersion(layoutId: string, payload: any, user: any): Promise<void> {
    try {
      // Soft delete all existing regions
      await this.supabaseService.getClient()
        .from('dashboard_regions')
        .update({ deleted_at: new Date().toISOString() })
        .eq('layout_id', layoutId)
        .eq('tenant_id', user.tenantId)
        .eq('user_id', user.userId)
        .is('deleted_at', null);

      // Restore regions from payload
      if (payload.regions && Array.isArray(payload.regions)) {
        const regionsToInsert = payload.regions.map((region: any) => ({
          ...region,
          layout_id: layoutId,
          tenant_id: user.tenantId,
          user_id: user.userId,
          deleted_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));

        await this.supabaseService.getClient()
          .from('dashboard_regions')
          .upsert(regionsToInsert, { onConflict: 'id' });
      }
    } catch (error) {
      throw new BadRequestException(`Failed to restore from version: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private calculateDiff(payload1: any, payload2: any): any {
    // Simple diff calculation - in production, use a proper diff library
    const diff: any = {
      added: [],
      removed: [],
      modified: []
    };

    const regions1 = payload1.regions || [];
    const regions2 = payload2.regions || [];

    const regionMap1 = new Map(regions1.map((r: any) => [r.id, r]));
    const regionMap2 = new Map(regions2.map((r: any) => [r.id, r]));

    // Find added regions
    for (const [id, region] of regionMap2) {
      if (!regionMap1.has(id)) {
        diff.added.push(region);
      }
    }

    // Find removed regions
    for (const [id, region] of regionMap1) {
      if (!regionMap2.has(id)) {
        diff.removed.push(region);
      }
    }

    // Find modified regions
    for (const [id, region1] of regionMap1) {
      const region2 = regionMap2.get(id);
      if (region2 && JSON.stringify(region1) !== JSON.stringify(region2)) {
        diff.modified.push({
          id,
          old: region1,
          new: region2
        });
      }
    }

    return diff;
  }
}

