import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../common/services/supabase.service';

@Injectable()
export class CollaborationService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async updatePresence(regionId: string, userId: string, sessionId: string, isEditing: boolean, tenantId: string): Promise<void> {
    try {
      await this.supabaseService.getClient()
        .from('dashboard_region_presence')
        .upsert({
          region_id: regionId,
          user_id: userId,
          session_id: sessionId,
          is_editing: isEditing,
          last_seen: new Date().toISOString(),
          tenant_id: tenantId
        }, {
          onConflict: 'region_id,user_id,session_id'
        });
    } catch (error) {
      console.error('Failed to update presence:', error);
    }
  }

  async getPresence(regionId: string, tenantId: string): Promise<any[]> {
    try {
      // Clean up stale presence (older than 5 minutes)
      await this.cleanupStalePresence();

      const { data, error } = await this.supabaseService.getClient()
        .from('dashboard_region_presence')
        .select('*')
        .eq('region_id', regionId)
        .eq('tenant_id', tenantId)
        .gt('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString())
        .order('last_seen', { ascending: false });

      if (error) {
        throw new BadRequestException(`Failed to get presence: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      return [];
    }
  }

  async acquireLock(regionId: string, userId: string, tenantId: string, sessionId: string): Promise<{ success: boolean; lockedBy?: string }> {
    try {
      // Check if region is already locked by someone else
      const { data: existingLock } = await this.supabaseService.getClient()
        .from('dashboard_region_presence')
        .select('user_id, last_seen')
        .eq('region_id', regionId)
        .eq('tenant_id', tenantId)
        .eq('is_editing', true)
        .gt('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString())
        .neq('user_id', userId)
        .limit(1)
        .single();

      if (existingLock) {
        return { success: false, lockedBy: existingLock.user_id };
      }

      // Acquire lock
      await this.updatePresence(regionId, userId, sessionId, true, tenantId);

      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  async releaseLock(regionId: string, userId: string, sessionId: string, tenantId: string): Promise<void> {
    try {
      await this.updatePresence(regionId, userId, sessionId, false, tenantId);
    } catch (error) {
      console.error('Failed to release lock:', error);
    }
  }

  async detectConflicts(_layoutId: string, changes: any, tenantId: string): Promise<any[]> {
    try {
      const conflicts: any[] = [];

      // Check for concurrent edits on regions being modified
      if (changes.regions) {
        for (const regionChange of changes.regions) {
          const { data: presence } = await this.supabaseService.getClient()
            .from('dashboard_region_presence')
            .select('user_id, is_editing, last_seen')
            .eq('region_id', regionChange.id)
            .eq('tenant_id', tenantId)
            .eq('is_editing', true)
            .gt('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString());

          if (presence && presence.length > 0) {
            conflicts.push({
              region_id: regionChange.id,
              conflicting_users: presence.map((p: any) => p.user_id)
            });
          }
        }
      }

      return conflicts;
    } catch (error) {
      return [];
    }
  }

  private async cleanupStalePresence(): Promise<void> {
    try {
      await this.supabaseService.getClient()
        .from('dashboard_region_presence')
        .delete()
        .lt('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString());
    } catch (error) {
      // Don't throw - cleanup failures shouldn't break the main operation
      console.error('Failed to cleanup stale presence:', error);
    }
  }
}

