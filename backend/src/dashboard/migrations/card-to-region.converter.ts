import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../common/services/supabase.service';
import { DashboardCardResponseDto } from '../dto';
import { CreateDashboardRegionDto, RegionType } from '../dto/dashboard-region.dto';

export interface MigrationResult {
  success: boolean;
  regionsCreated: number;
  cardsMapped: number;
  errors: string[];
  mapping: Array<{
    cardId: string;
    cardType: string;
    regionId?: string;
    regionType: RegionType;
    error?: string;
  }>;
}

@Injectable()
export class CardToRegionConverter {
  constructor(private readonly supabaseService: SupabaseService) {}

  async convertCardsToRegions(layoutId: string, userId: string, tenantId: string): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: false,
      regionsCreated: 0,
      cardsMapped: 0,
      errors: [],
      mapping: []
    };

    try {
      // Get all cards for the layout
      const { data: cards, error: cardsError } = await this.supabaseService.getClient()
        .from('dashboard_cards')
        .select('*')
        .eq('layout_id', layoutId)
        .eq('tenant_id', tenantId)
        .eq('user_id', userId)
        .is('deleted_at', null);

      if (cardsError) {
        result.errors.push(`Failed to load cards: ${cardsError.message}`);
        return result;
      }

      if (!cards || cards.length === 0) {
        result.success = true;
        return result;
      }

      // Group cards by type/function
      const cardGroups = this.groupCardsByType(cards as DashboardCardResponseDto[]);

      // Convert each group to a region
      let gridRow = 0;
      let gridCol = 0;
      const maxCols = 2;

      for (const [regionType, groupCards] of Object.entries(cardGroups)) {
        try {
          const regionDto: CreateDashboardRegionDto = {
            layout_id: layoutId,
            region_type: this.mapCardTypeToRegionType(regionType),
            grid_row: gridRow,
            grid_col: gridCol,
            row_span: 1,
            col_span: 1,
            min_width: 300,
            min_height: 200,
            display_order: result.regionsCreated,
            config: {
              migrated_cards: groupCards.map(c => c.id),
              card_count: groupCards.length
            },
            widget_config: this.extractWidgetConfig(groupCards)
          };

          // Create region
          const { data: region, error: regionError } = await this.supabaseService.getClient()
            .from('dashboard_regions')
            .insert({
              ...regionDto,
              tenant_id: tenantId,
              user_id: userId
            })
            .select()
            .single();

          if (regionError) {
            result.errors.push(`Failed to create region for ${regionType}: ${regionError.message}`);
            const firstCard = groupCards[0];
            if (firstCard) {
              result.mapping.push({
                cardId: firstCard.id,
                cardType: regionType,
                regionType: regionDto.region_type,
                error: regionError.message
              });
            }
            continue;
          }

          result.regionsCreated++;
          result.cardsMapped += groupCards.length;

          // Map cards to region
          for (const card of groupCards) {
            result.mapping.push({
              cardId: card.id,
              cardType: card.type,
              regionId: region.id,
              regionType: regionDto.region_type
            });
          }

          // Update grid position
          gridCol++;
          if (gridCol >= maxCols) {
            gridCol = 0;
            gridRow++;
          }
        } catch (error) {
          result.errors.push(`Error processing group ${regionType}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      result.success = result.errors.length === 0;
    } catch (error) {
      result.errors.push(`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }

  private groupCardsByType(cards: DashboardCardResponseDto[]): Record<string, DashboardCardResponseDto[]> {
    const groups: Record<string, DashboardCardResponseDto[]> = {};

    for (const card of cards) {
      const groupKey = this.getCardGroupKey(card.type);
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(card);
    }

    return groups;
  }

  private getCardGroupKey(cardType: string): string {
    // Map card types to logical groups
    const typeMap: Record<string, string> = {
      'jobs-calendar': 'scheduling',
      'scheduling': 'scheduling',
      'customer-search': 'customer-search',
      'customers-page': 'customer-search',
      'reports': 'reports',
      'technician-dispatch': 'scheduling',
      'team-overview': 'team-overview',
      'analytics': 'analytics',
      'financial-summary': 'financial',
      'settings': 'settings',
      'quick-actions': 'quick-actions'
    };

    return typeMap[cardType] || 'custom';
  }

  private mapCardTypeToRegionType(cardType: string): RegionType {
    const mapping: Record<string, RegionType> = {
      'scheduling': RegionType.SCHEDULING,
      'customer-search': RegionType.CUSTOMER_SEARCH,
      'reports': RegionType.REPORTS,
      'team-overview': RegionType.TEAM_OVERVIEW,
      'analytics': RegionType.ANALYTICS,
      'financial': RegionType.FINANCIAL_SUMMARY,
      'settings': RegionType.SETTINGS,
      'quick-actions': RegionType.QUICK_ACTIONS
    };

    return mapping[cardType] || RegionType.CUSTOM;
  }

  private extractWidgetConfig(cards: DashboardCardResponseDto[]): any {
    // Extract common configuration from cards
    if (cards.length === 0) return {};

    // Use the first card's config as a template
    const firstCard = cards[0];
    if (!firstCard) return {};

    return {
      widget_type: firstCard.type,
      card_configs: cards.map(c => ({
        id: c.id,
        type: c.type,
        config: c.config
      }))
    };
  }
}

