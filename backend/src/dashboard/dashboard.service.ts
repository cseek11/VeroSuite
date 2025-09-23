import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../common/services/supabase.service';
import { CreateDashboardLayoutDto, UpdateDashboardLayoutDto, DashboardLayoutResponseDto, CreateDashboardCardDto, UpdateDashboardCardDto, DashboardCardResponseDto } from './dto';

@Injectable()
export class DashboardService {
  constructor(private readonly supabaseService: SupabaseService) {}

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
}
