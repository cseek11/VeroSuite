import React from 'react';
import { enhancedApi } from '@/lib/enhanced-api';
import { transformTemplateToKpiData } from '@/utils/kpiTemplateUtils';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { KpiDisplayCard } from '@/components/cards';
import { Lock, Unlock, X } from 'lucide-react';
import ResizeHandle from '@/components/dashboard/ResizeHandle';
import { CardFocusManager } from '@/components/dashboard/CardFocusManager';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import QuickActionsCard from '@/components/dashboard/QuickActionsCard';
import SmartKPITest from '@/components/dashboard/SmartKPITest';
import SmartKPIDebug from '@/components/dashboard/SmartKPIDebug';
import {
  KpiBuilderCard,
  KpiTemplateCard,
  PredictiveAnalyticsCard,
  AutoLayoutCard
} from '@/components/cards';
import { DashboardMetric, CardType } from '../types';

// Constants
export const KPI_DATA_STORAGE_KEY = 'vero_kpi_data_v1';
export const AUTO_CREATE_FROM_USER_KPIS = false;

export const mockMetrics: DashboardMetric[] = [
  {
    title: 'Total Customers',
    value: '2,143',
    icon: 'Users' as any,
    color: '#3B82F6',
    change: 12,
    changeType: 'increase'
  },
  {
    title: 'Active Jobs',
    value: '47',
    icon: 'Calendar' as any,
    color: '#10B981',
    change: 8,
    changeType: 'increase'
  },
  {
    title: 'Revenue',
    value: '$45,230',
    icon: 'TrendingUp' as any,
    color: '#8B5CF6',
    change: 15,
    changeType: 'increase'
  },
  {
    title: 'Technicians',
    value: '12',
    icon: 'Users' as any,
    color: '#F59E0B',
    change: 2,
    changeType: 'increase'
  }
];

export const defaultCardSizes: Record<string, { width: number; height: number }> = {
  'jobs-calendar': { width: 300, height: 220 },
  'recent-activity': { width: 260, height: 200 },
  'customer-search': { width: 260, height: 160 },
  'reports': { width: 280, height: 180 },
  'quick-actions': { width: 260, height: 160 },
  'kpi-builder': { width: 320, height: 240 },
  'predictive-analytics': { width: 300, height: 200 },
  'auto-layout': { width: 280, height: 180 },
  'routing': { width: 320, height: 240 },
  'team-overview': { width: 300, height: 200 },
  'financial-summary': { width: 280, height: 180 },
  'dashboard-metrics': { width: 280, height: 180 },
  'smart-kpis': { width: 280, height: 180 },
  'smart-kpis-test': { width: 280, height: 180 },
  'smart-kpis-debug': { width: 280, height: 180 },
  'kpi-display': { width: 300, height: 200 },
  'kpi-template': { width: 280, height: 180 }
};

export const availableKpiFields = [
  { id: 'jobs_completed', name: 'Jobs Completed', type: 'number' as const, table: 'jobs', column: 'status', aggregation: 'count' },
  { id: 'revenue_total', name: 'Total Revenue', type: 'number' as const, table: 'invoices', column: 'amount', aggregation: 'sum' },
  { id: 'customer_count', name: 'Customer Count', type: 'number' as const, table: 'customers', column: 'id', aggregation: 'count' },
  { id: 'avg_rating', name: 'Average Rating', type: 'number' as const, table: 'reviews', column: 'rating', aggregation: 'avg' },
  { id: 'completion_rate', name: 'Completion Rate', type: 'number' as const, table: 'jobs', column: 'status', aggregation: 'count' }
];

// Helper functions
export const getDefaultCardSize = (type: string) => {
  return defaultCardSizes[type] || { width: 280, height: 180 };
};

export const getCardTypes = (onOpenKPIBuilder: () => void): CardType[] => [
  { 
    id: 'dashboard-metrics', 
    name: 'Dashboard Metrics', 
    component: () => <DashboardMetrics metrics={mockMetrics} />
  },
  { 
    id: 'smart-kpis', 
    name: 'Smart KPIs', 
    component: () => <DashboardMetrics metrics={mockMetrics} enableSmartKPIs={true} />
  },
  { 
    id: 'smart-kpis-test', 
    name: 'Smart KPIs Test', 
    component: () => <SmartKPITest />
  },
  { 
    id: 'smart-kpis-debug', 
    name: 'Smart KPIs Debug', 
    component: () => <SmartKPIDebug />
  },
  { id: 'jobs-calendar', name: 'Jobs Calendar', component: () => <div className="p-4 text-gray-600">Jobs Calendar - Coming Soon</div> },
  { id: 'recent-activity', name: 'Recent Activity', component: () => <div className="p-4 text-gray-600">Recent Activity - Coming Soon</div> },
  { id: 'customer-search', name: 'Customer Search', component: () => <div className="p-4 text-gray-600">Customer Search - Coming Soon</div> },
  { id: 'reports', name: 'Reports', component: () => <div className="p-4 text-gray-600">Reports - Coming Soon</div> },
  { id: 'quick-actions', name: 'Quick Actions', component: () => <QuickActionsCard /> },
  { id: 'kpi-builder', name: 'KPI Builder', component: () => <KpiBuilderCard onOpenBuilder={onOpenKPIBuilder} /> },
  { id: 'predictive-analytics', name: 'Predictive Analytics', component: () => <PredictiveAnalyticsCard /> },
  { id: 'auto-layout', name: 'Auto-Layout', component: () => <AutoLayoutCard /> },
  { id: 'routing', name: 'Routing', component: () => <div className="p-4 text-gray-600">Routing - Coming Soon</div> },
  { id: 'team-overview', name: 'Team Overview', component: () => <div className="p-4 text-gray-600">Team Overview - Coming Soon</div> },
  { id: 'financial-summary', name: 'Financial Summary', component: () => <div className="p-4 text-gray-600">Financial Summary - Coming Soon</div> },
  {
    id: 'kpi-display',
    name: 'KPI Display',
    component: ({ cardId }: { cardId?: string }) => (
      <KpiDisplayCard cardId={cardId ?? 'kpi-display'} kpiData={{}} />
    )
  },
  { id: 'kpi-template', name: 'KPI Template', component: ({ cardId, onOpenTemplateLibrary }: { cardId?: string; onOpenTemplateLibrary: () => void }) => <KpiTemplateCard cardId={cardId as string | undefined} onOpenTemplateLibrary={onOpenTemplateLibrary} /> }
];

export const normalizeKpiForDisplay = (kpi: any) => ({
  id: kpi.id,
  name: kpi.name,
  description: kpi.description || 'User-defined KPI',
  category: kpi.category || 'operational',
  formula_expression: kpi.formula_expression || kpi.formulaExpression,
  formula_fields: kpi.formula_fields || kpi.formulaFields || [],
  threshold_config: kpi.threshold_config || kpi.threshold || {},
  chart_config: kpi.chart_config || kpi.chart || { type: 'number' },
  data_source_config: kpi.data_source_config || {},
  tags: kpi.tags || [],
  is_active: kpi.is_active !== false && (kpi.enabled !== false),
  created_at: kpi.created_at,
  template_id: kpi.template_id || kpi.templateId,
  user_id: kpi.user_id,
  tenant_id: kpi.tenant_id,
  enabled: kpi.is_active !== false && (kpi.enabled !== false),
  realTime: kpi.realTime || false,
  threshold: (kpi.threshold_config || kpi.threshold) || {
    green: 80,
    yellow: 60,
    unit: '%'
  },
  chart: kpi.chart_config || kpi.chart || { type: 'line' }
});

export const isUserTemplate = (template: any): boolean => {
  const t = template;
  return (
    t?.template_type === 'user' ||
    t?.source === 'user' ||
    t?.source === 'user_kpis' ||
    !!t?.user_id ||
    typeof t?.is_active !== 'undefined' ||
    t?.created_by_user === true ||
    t?.is_custom === true ||
    t?.category === 'custom' ||
    t?.category === 'user_created' ||
    (t?.formula && typeof t.formula === 'object' && t.formula.user_defined) ||
    (t?.threshold && typeof t.threshold === 'object' && t.threshold.user_customized) ||
    t?.metadata?.user_created ||
    t?.tags?.includes('user-created') ||
    t?.tags?.includes('custom')
  );
};

// Render helpers
export const renderCardComponent = (
  card: any,
  cardTypes: any[],
  kpiData: Record<string, any>,
  setShowTemplateLibrary: (show: boolean) => void
) => {
  const cardType = cardTypes.find(type => type.id === card.type);
  const CardComponent = cardType?.component || (() => <div>Unknown Card Type</div>);
  
  if (card.type === 'kpi-display') {
    if (!kpiData[card.id]) {
      return (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <LoadingSpinner />
        </div>
      );
    }
    return <KpiDisplayCard cardId={card.id} kpiData={kpiData} />;
  }
  
  if (card.type === 'kpi-template' && typeof CardComponent === 'function') {
    return (CardComponent as any)({ 
      cardId: card.id, 
      onOpenTemplateLibrary: () => setShowTemplateLibrary(true) 
    });
  }
  
  return (CardComponent as any)();
};

export const createRenderVirtualCard = (
  selectedCards: Set<string>,
  isDraggingMultiple: boolean,
  draggedCardId: string | null,
  isCardLocked: (cardId: string) => boolean,
  getCardGroup: (cardId: string) => any,
  searchTerm: string,
  filteredCards: any[],
  handleDragStart: (cardId: string, e: React.MouseEvent) => void,
  handleCardClick: (cardId: string, e: React.MouseEvent) => void,
  toggleCardLock: (cardId: string) => void,
  removeCard: (cardId: string) => void,
  cardTypes: any[],
  kpiData: Record<string, any>,
  setShowTemplateLibrary: (show: boolean) => void,
  resizingCardId: string | null,
  handleResizeStart: (cardId: string, handle: string, e: React.MouseEvent) => void,
  keyboardNavigation: any
) => {
  return (card: any, _index: number) => (
    <CardFocusManager
      key={card.id}
      cardId={card.id}
      isFocused={keyboardNavigation.focusedCardId === card.id}
      isSelected={selectedCards.has(card.id)}
      navigationMode={keyboardNavigation.navigationMode}
      isNavigating={keyboardNavigation.isNavigating}
      className={`absolute bg-white rounded-lg shadow-lg border transition-all duration-200 group overflow-visible ${
        selectedCards.has(card.id)
          ? `${isDraggingMultiple && selectedCards.has(card.id) ? 'opacity-80 scale-95' : ''}`
          : 'hover:shadow-xl border-gray-200 hover:border-purple-200'
      } ${draggedCardId === card.id ? 'z-50 rotate-1 scale-105 shadow-2xl' : 'z-10'} ${
        isCardLocked(card.id) || (getCardGroup(card.id)?.locked)
          ? 'border-red-400 bg-red-50/30 cursor-default'
          : card.type === 'customers-page' || card.id.includes('-page')
            ? 'border-blue-400 bg-blue-50/30 cursor-default'
            : 'cursor-move'
      } ${
        searchTerm && filteredCards.find(c => c.id === card.id) ? 'ring-2 ring-yellow-400 bg-yellow-50/30' : ''
      }`}
      style={{
        left: card.x,
        top: card.y,
        width: card.width,
        height: card.height
      }}
      onFocus={(e) => {
        if (!e || !e.target) return;
        // Only navigate if the focus didn't come from a button click
        if (e.target === e.currentTarget || !e.target.closest('button')) {
          keyboardNavigation.navigateToCard(card.id);
        }
      }}
    >
      <div
        onMouseDown={(e) => {
          const cardGroup = getCardGroup(card.id);
          if (!isCardLocked(card.id) && (!cardGroup || !cardGroup?.locked)) {
            handleDragStart(card.id, e);
          }
        }}
        onClick={(e) => handleCardClick(card.id, e)}
      >
        <div
          className={`bg-purple-600 text-white text-center font-semibold transition-all duration-300 ease-out overflow-hidden rounded-t-xl group-hover:!h-12 group-hover:!opacity-100 ${
            card.type === 'customers-page' || card.id.includes('-page') ? 'cursor-default' : 'cursor-move'
          }`}
          style={{
            height: selectedCards.has(card.id) ? '48px' : '0px',
            opacity: selectedCards.has(card.id) ? 1 : 0,
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 h-full">
            <h3 className="font-bold text-white text-sm">
              {card.type === 'kpi-display' && kpiData[card.id]?.name 
                ? kpiData[card.id].name 
                : cardTypes.find(t => t.id === card.type)?.name || 'Unknown Card'}
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  toggleCardLock(card.id);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                tabIndex={-1}
                className={`p-1.5 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                  isCardLocked(card.id) 
                    ? 'hover:bg-red-500/20 text-red-200 hover:text-red-100 focus:ring-red-400' 
                    : 'hover:bg-purple-500/20 text-purple-200 hover:text-purple-100 focus:ring-purple-400'
                }`}
                title={isCardLocked(card.id) ? 'Unlock card' : 'Lock card'}
              >
                {isCardLocked(card.id) ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  removeCard(card.id);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                tabIndex={-1}
                className="p-1.5 hover:bg-red-500/20 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
                title="Delete card"
              >
                <X className="w-4 h-4 text-red-200 hover:text-red-100" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-3 h-full overflow-visible">
          {renderCardComponent(card, cardTypes, kpiData, setShowTemplateLibrary)}
        </div>

        {(selectedCards.has(card.id) || resizingCardId === card.id) && !isCardLocked(card.id) && (
          <>
            <ResizeHandle position="nw" onResizeStart={(handle, e) => handleResizeStart(card.id, handle, e)} />
            <ResizeHandle position="ne" onResizeStart={(handle, e) => handleResizeStart(card.id, handle, e)} />
            <ResizeHandle position="sw" onResizeStart={(handle, e) => handleResizeStart(card.id, handle, e)} />
            <ResizeHandle position="se" onResizeStart={(handle, e) => handleResizeStart(card.id, handle, e)} />
            <ResizeHandle position="n" onResizeStart={(handle, e) => handleResizeStart(card.id, handle, e)} />
            <ResizeHandle position="s" onResizeStart={(handle, e) => handleResizeStart(card.id, handle, e)} />
            <ResizeHandle position="e" onResizeStart={(handle, e) => handleResizeStart(card.id, handle, e)} />
            <ResizeHandle position="w" onResizeStart={(handle, e) => handleResizeStart(card.id, handle, e)} />
          </>
        )}
      </div>
    </CardFocusManager>
  );
};

// KPI Handlers
export const handleKpiBuilderUseTemplate = async (
  template: any,
  localAddCard: (type: string, position?: { x: number; y: number }) => string,
  currentLayoutId: string | null,
  setKpiData: React.Dispatch<React.SetStateAction<Record<string, any>>>,
  setShowKPIBuilder: (show: boolean) => void
) => {
  try {
    const cardId = localAddCard('kpi-display', { x: 0, y: 0 });
    const kpiData = transformTemplateToKpiData(template, cardId);
    
    const cfg = {
      name: kpiData.name,
      description: kpiData.description,
      threshold: kpiData.threshold || { green: 80, yellow: 60, unit: '%' },
      chart: kpiData.chart || { type: 'line' }
    };

    const serverPayload = {
      card_uid: cardId,
      type: 'kpi-display',
      x: 0,
      y: 0,
      width: 300,
      height: 200,
      template_id: template.id,
      config: cfg
    };

    if (currentLayoutId) {
      let retryCount = 0;
      const maxRetries = 3;
      let lastError: any = null;

      while (retryCount < maxRetries) {
        try {
          await enhancedApi.dashboardLayouts.upsertCard(currentLayoutId, serverPayload);
          break;
        } catch (err) {
          lastError = err;
          retryCount++;
          
          if (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
          }
        }
      }

      if (retryCount >= maxRetries) {
        throw new Error(`KPI Builder server operation failed after ${maxRetries} attempts: ${lastError?.message}`);
      }

      setKpiData(prev => ({
        ...prev,
        [cardId]: kpiData
      }));

    } else {
      throw new Error('No currentLayoutId available for KPI Builder atomic operation');
    }

    setShowKPIBuilder(false);

  } catch (error) {
    throw error;
  }
};

export const handleTemplateLibraryUseTemplate = async (
  template: any,
  localAddCard: (type: string, position?: { x: number; y: number }) => string,
  currentLayoutId: string | null,
  setKpiData: React.Dispatch<React.SetStateAction<Record<string, any>>>,
  setShowTemplateLibrary: (show: boolean) => void
) => {
  try {
    const cardId = localAddCard('kpi-display', { x: 0, y: 0 });
    const kpiData = transformTemplateToKpiData(template, cardId);
    
    const linkage = isUserTemplate(template)
      ? { user_kpi_id: template.id }
      : { template_id: template.id };

    if (!linkage.user_kpi_id && !linkage.template_id) {
      throw new Error('No valid linkage found for template');
    }

    const cfg = {
      name: kpiData.name,
      description: kpiData.description,
      threshold: kpiData.threshold || { green: 80, yellow: 60, unit: '%' },
      chart: kpiData.chart || { type: 'line' }
    };

    const serverPayload = {
      card_uid: cardId,
      type: 'kpi-display',
      x: 0,
      y: 0,
      width: 300,
      height: 200,
      ...linkage,
      config: cfg
    };

    if (currentLayoutId) {
      let retryCount = 0;
      const maxRetries = 3;
      let lastError: any = null;

      while (retryCount < maxRetries) {
        try {
          await enhancedApi.dashboardLayouts.upsertCard(currentLayoutId, serverPayload);
          break;
        } catch (err) {
          lastError = err;
          retryCount++;
          
          if (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
          }
        }
      }

      if (retryCount >= maxRetries) {
        throw new Error(`Server operation failed after ${maxRetries} attempts: ${lastError?.message}`);
      }

      setKpiData(prev => ({
        ...prev,
        [cardId]: kpiData
      }));

    } else {
      throw new Error('No currentLayoutId available for atomic operation');
    }

    setShowTemplateLibrary(false);

  } catch (error) {
    throw error;
  }
};
