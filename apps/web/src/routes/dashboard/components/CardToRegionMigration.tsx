import React, { useState, useEffect } from 'react';
import { enhancedApi } from '@/lib/enhanced-api';
import { DashboardCard } from '@/routes/dashboard/types/dashboard.types';
import { RegionType } from '@/routes/dashboard/types/region.types';

interface CardToRegionMigrationProps {
  layoutId: string;
  onComplete?: () => void;
  onCancel?: () => void;
}

interface MigrationPreview {
  cards: DashboardCard[];
  proposedRegions: Array<{
    regionType: RegionType;
    cardIds: string[];
    gridRow: number;
    gridCol: number;
  }>;
}

export const CardToRegionMigration: React.FC<CardToRegionMigrationProps> = ({
  layoutId,
  onComplete,
  onCancel
}) => {
  const [step, setStep] = useState<'preview' | 'migrating' | 'complete' | 'error'>('preview');
  const [cards, setCards] = useState<DashboardCard[]>([]);
  const [proposedRegions, setProposedRegions] = useState<MigrationPreview['proposedRegions']>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [migrationResult, setMigrationResult] = useState<any>(null);

  useEffect(() => {
    loadPreview();
  }, [layoutId]);

  const loadPreview = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load existing cards
      const existingCards = await enhancedApi.dashboardLayouts.listCards(layoutId);
      setCards(existingCards);

      // Generate proposed region mapping
      const regions = generateProposedRegions(existingCards);
      setProposedRegions(regions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load preview');
    } finally {
      setLoading(false);
    }
  };

  const generateProposedRegions = (cards: DashboardCard[]): MigrationPreview['proposedRegions'] => {
    // Group cards by type
    const cardGroups: Record<string, string[]> = {};
    
    cards.forEach(card => {
      const groupKey = mapCardTypeToRegionType(card.type);
      if (!cardGroups[groupKey]) {
        cardGroups[groupKey] = [];
      }
      cardGroups[groupKey].push(card.id);
    });

    // Convert to regions
    const regions: MigrationPreview['proposedRegions'] = [];
    let row = 0;
    let col = 0;
    const maxCols = 2;

    Object.entries(cardGroups).forEach(([regionType, cardIds]) => {
      regions.push({
        regionType: regionType as RegionType,
        cardIds,
        gridRow: row,
        gridCol: col
      });

      col++;
      if (col >= maxCols) {
        col = 0;
        row++;
      }
    });

    return regions;
  };

  const mapCardTypeToRegionType = (cardType: string): RegionType => {
    const mapping: Record<string, RegionType> = {
      'jobs-calendar': RegionType.SCHEDULING,
      'scheduling': RegionType.SCHEDULING,
      'customer-search': RegionType.CUSTOMER_SEARCH,
      'customers-page': RegionType.CUSTOMER_SEARCH,
      'reports': RegionType.REPORTS,
      'technician-dispatch': RegionType.SCHEDULING,
      'team-overview': RegionType.TEAM_OVERVIEW,
      'analytics': RegionType.ANALYTICS,
      'financial-summary': RegionType.FINANCIAL_SUMMARY,
      'settings': RegionType.SETTINGS,
      'quick-actions': RegionType.QUICK_ACTIONS
    };

    return mapping[cardType] || RegionType.CUSTOM;
  };

  const handleMigrate = async () => {
    try {
      setStep('migrating');
      setError(null);

      const result = await enhancedApi.dashboardLayouts.migrateCardsToRegions(layoutId);
      setMigrationResult(result);
      setStep('complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Migration failed');
      setStep('error');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'migrating') {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Migrating cards to regions...</p>
        <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="p-6">
        <div className="bg-green-50 border border-green-200 rounded p-4 mb-4">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Migration Complete!</h3>
          <p className="text-sm text-green-700">
            Successfully migrated {migrationResult?.regionsCreated || 0} regions from {cards.length} cards.
          </p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onComplete}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Migration Failed</h3>
          <p className="text-sm text-red-700">{error}</p>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => setStep('preview')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-to-region-migration p-6">
      <h2 className="text-2xl font-bold mb-4">Migrate Cards to Regions</h2>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          This will convert your existing dashboard cards into a region-based layout. 
          Review the proposed mapping below before proceeding.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Current Cards ({cards.length})</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {cards.map(card => (
              <div key={card.id} className="p-3 bg-gray-50 border border-gray-200 rounded">
                <p className="text-sm font-medium">{card.type}</p>
                <p className="text-xs text-gray-500">ID: {card.id.slice(0, 8)}...</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Proposed Regions ({proposedRegions.length})</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {proposedRegions.map((region, index) => (
              <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm font-medium capitalize">
                  {region.regionType.replace('-', ' ')}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {region.cardIds.length} {region.cardIds.length === 1 ? 'card' : 'cards'} • 
                  Position: ({region.gridRow}, {region.gridCol})
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={handleMigrate}
          disabled={cards.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Migration
        </button>
      </div>
    </div>
  );
};





