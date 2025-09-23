import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/auth';
import { enhancedApi } from '@/lib/enhanced-api';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useCardDragDrop } from '@/hooks/useCardDragDrop';
import { useCardResize } from '@/hooks/useCardResize';
import { useCardLocking } from '@/hooks/useCardLocking';
import { useCardGrouping } from '@/hooks/useCardGrouping';
import { useGroupDragDrop } from '@/hooks/useGroupDragDrop';
import { useZoomPan } from '@/hooks/useZoomPan';
import { useRealtimeCollaboration } from '@/hooks/useRealtimeCollaboration';
import { 
  Plus,
  Grid,
  List,
  Maximize2,
  Minimize2,
  RotateCcw,
  HelpCircle,
  X,
  Lock,
  Unlock,
  Undo,
  Redo,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize,
  Save,
} from 'lucide-react';

// Card type components
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import ResizeHandle from '@/components/dashboard/ResizeHandle';
import CardGroup from '@/components/dashboard/CardGroup';
import CollaborationIndicator from '@/components/dashboard/CollaborationIndicator';
import LayoutManager from '@/components/dashboard/LayoutManager';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { DashboardMetric } from '@/types';
import { AlertModal, ConfirmModal, PromptModal } from '@/components/ui/Modal';
import DrillDownModal from '@/components/dashboard/DrillDownModal';
import QuickActionsCard from '@/components/dashboard/QuickActionsCard';
import SmartKPITest from '@/components/dashboard/SmartKPITest';
import SmartKPIDebug from '@/components/dashboard/SmartKPIDebug';
import { useSmartKPIs } from '@/hooks/useSmartKPIs';
import { useUserKpis } from '@/hooks/useKpiTemplates';
import { VirtualCardContainer, VirtualCardPerformance } from '@/components/dashboard/VirtualCardContainer';
import { useVirtualScrolling } from '@/hooks/useVirtualScrolling';
import { WebSocketStatus } from '@/components/dashboard/WebSocketStatus';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { CardFocusManager } from '@/components/dashboard/CardFocusManager';
import { useBulkOperations } from '@/hooks/useBulkOperations';
import { BulkActionBar } from '@/components/dashboard/BulkActionBar';
import KPIBuilder from '@/components/kpi/KPIBuilder';
import KpiTemplateLibraryModal from '@/components/kpi/KpiTemplateLibraryModal';
import { transformTemplateToKpiData } from '@/utils/kpiTemplateUtils';
import {
  KpiBuilderCard,
  KpiTemplateCard,
  KpiDisplayCard,
  PredictiveAnalyticsCard,
  AutoLayoutCard
} from '@/components/cards';
import { MobileNavigation } from '@/components/dashboard/MobileNavigation';

interface VeroCardsV2Props {
  showHeader?: boolean;
}






// Mock data for dashboard metrics
const mockMetrics: DashboardMetric[] = [
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

// Function to get card types with access to component state
const getCardTypes = (onOpenKPIBuilder: () => void) => [
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
  { id: 'kpi-display', name: 'KPI Display', component: 'kpi-display' }, // Special marker for KPI display cards
  { id: 'kpi-template', name: 'KPI Template', component: ({ cardId, onOpenTemplateLibrary }: { cardId?: string; onOpenTemplateLibrary: () => void }) => <KpiTemplateCard cardId={cardId as string | undefined} onOpenTemplateLibrary={onOpenTemplateLibrary} /> }
];

export default function VeroCardsV2({}: VeroCardsV2Props) {
  const { user } = useAuthStore();
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [showCardSelector, setShowCardSelector] = useState(false);
  const [showLayoutManager, setShowLayoutManager] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; title: string; message: string; type: 'info' | 'warning' | 'error' | 'success' }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: () => void; type: 'warning' | 'danger' | 'info' }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'warning'
  });
  const [promptModal, setPromptModal] = useState<{ isOpen: boolean; title: string; message: string; onConfirm: (value: string) => void; placeholder: string; defaultValue: string }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    placeholder: '',
    defaultValue: ''
  });

  const [groupDeleteModal, setGroupDeleteModal] = useState<{
    isOpen: boolean;
    groupId: string;
    groupName: string;
  }>({
    isOpen: false,
    groupId: '',
    groupName: ''
  });

  // Smart KPIs integration
  const smartKPIs = useSmartKPIs();

  // KPI Templates and User KPIs integration
  const {
    data: userKpis = [],
    isLoading: isUserKpisLoading,
    isError: isUserKpisError,
    status: userKpisStatus
  } = useUserKpis();

  // Test KPI templates loading
  useEffect(() => {
    const testKpiTemplates = async () => {
      try {
        console.log('🧪 Testing KPI templates API...');
        const templates = await enhancedApi.kpiTemplates.list();
        console.log('✅ KPI templates loaded:', templates?.length || 0);
      } catch (error) {
        console.error('❌ KPI templates failed:', error);
      }
    };
    testKpiTemplates();
  }, []);
  
  // Debug userKpis data structure
  console.log('🔍 VeroCardsV2 - userKpis data:', userKpis);
  console.log('🔍 VeroCardsV2 - userKpis type:', typeof userKpis);
  console.log('🔍 VeroCardsV2 - userKpis isArray:', Array.isArray(userKpis));
  console.log('🔍 VeroCardsV2 - userKpis length:', userKpis?.length);


  // Virtual scrolling state
  const [useVirtualScrollingEnabled, setUseVirtualScrollingEnabled] = useState(false);
  const [virtualScrollingThreshold, setVirtualScrollingThreshold] = useState(100);

  // Mobile optimization state
  const [isMobileFullscreen, setIsMobileFullscreen] = useState(false);
  const [showMobileNavigation, setShowMobileNavigation] = useState(false);
  const [showKPIBuilder, setShowKPIBuilder] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [kpiData, setKpiData] = useState<Record<string, any>>({});
  const KPI_DATA_STORAGE_KEY = 'vero_kpi_data_v1';
  const AUTO_CREATE_FROM_USER_KPIS = false;
  
  // Track which KPIs have been processed to prevent duplicates
  const processedKpisRef = useRef<Set<string>>(new Set());
  
  // Server-side persistence state
  const [currentLayoutId, setCurrentLayoutId] = useState<string | null>(null);
  const [isLoadingLayout, setIsLoadingLayout] = useState(true);
  const [serverLoadSucceeded, setServerLoadSucceeded] = useState(false);
  
  // Debug kpiData state
  console.log('🔍 VeroCardsV2 - current kpiData:', kpiData);
  console.log('🔍 VeroCardsV2 - kpiData keys:', Object.keys(kpiData));
  console.log('🔍 VeroCardsV2 - userKpis status:', { userKpis, userKpisStatus, isUserKpisLoading, isUserKpisError });


  // Persist KPI data changes
  useEffect(() => {
    try {
      localStorage.setItem(KPI_DATA_STORAGE_KEY, JSON.stringify(kpiData));
    } catch (e) {
      console.error('❌ Failed to save KPI data to localStorage', e);
    }
  }, [kpiData]);
  
  // Get card types - no longer dependent on kpiData to prevent unnecessary re-renders
  const cardTypes = useMemo(() => getCardTypes(() => setShowKPIBuilder(true)), []);
  
  
  // Show mobile navigation only on mobile devices
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth <= 768;
      setShowMobileNavigation(isMobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsMobileFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Custom hooks for clean separation of concerns
  const {
    layout,
    updateCardPosition: localUpdateCardPosition,
    updateMultipleCardPositions: localUpdateMultipleCardPositions,
    updateCardSize: localUpdateCardSize,
    addCard: localAddCard,
    removeCard: localRemoveCard,
    resetLayout,
    autoArrange,
    autoArrangeCards,
    applyTemplate,
    loadLayoutFromData,
    undo,
    redo,
    canUndo,
    canRedo,
    saveToHistory
  } = useDashboardLayout();

  // Server-persisted wrapper functions
  const updateCardPosition = useCallback(async (cardId: string, x: number, y: number) => {
    localUpdateCardPosition(cardId, x, y);
    
    if (currentLayoutId) {
      try {
        const card = layout.cards[cardId];
        if (card) {
          const kd = kpiData[cardId] || {};
          const linkage: any = {};
          if (kd.user_kpi_id) linkage.user_kpi_id = kd.user_kpi_id;
          if (kd.template_id) linkage.template_id = kd.template_id;
          await enhancedApi.dashboardLayouts.upsertCard(currentLayoutId, {
            card_uid: cardId,
            type: card.type,
            x: card.x,
            y: card.y,
            width: card.width,
            height: card.height,
            ...linkage
          });
        }
      } catch (error) {
        console.error('❌ Failed to update card position on server:', error);
        // Continue with local operation even if server fails
      }
    }
  }, [localUpdateCardPosition, currentLayoutId, layout.cards, kpiData]);

  const updateCardSize = useCallback(async (cardId: string, width: number, height: number) => {
    localUpdateCardSize(cardId, width, height);
    
    if (currentLayoutId) {
      try {
        const card = layout.cards[cardId];
        if (card) {
          const kd = kpiData[cardId] || {};
          const linkage: any = {};
          if (kd.user_kpi_id) linkage.user_kpi_id = kd.user_kpi_id;
          if (kd.template_id) linkage.template_id = kd.template_id;
          await enhancedApi.dashboardLayouts.upsertCard(currentLayoutId, {
            card_uid: cardId,
            type: card.type,
            x: card.x,
            y: card.y,
            width: card.width,
            height: card.height,
            ...linkage
          });
        }
      } catch (error) {
        console.error('❌ Failed to update card size on server:', error);
      }
    }
  }, [localUpdateCardSize, currentLayoutId, layout.cards, kpiData]);

  const addCard = useCallback(async (type: string, position?: { x: number; y: number }) => {
    const cardId = localAddCard(type, position);

    if (currentLayoutId) {
      try {
        // Avoid relying on immediate state; use provided position and default size
        const pos = position || { x: 0, y: 0 };
        const defaultSize = getDefaultCardSize(type);
        const kd = kpiData[cardId] || {};
        const linkage: any = {};
        if (kd.user_kpi_id) linkage.user_kpi_id = kd.user_kpi_id;
        if (kd.template_id) linkage.template_id = kd.template_id;
        await enhancedApi.dashboardLayouts.upsertCard(currentLayoutId, {
          card_uid: cardId,
          type,
          x: pos.x,
          y: pos.y,
          width: defaultSize.width,
          height: defaultSize.height,
          ...linkage
        });
        console.log('✅ Card saved to server:', cardId);
      } catch (error) {
        console.error('❌ Failed to save card to server:', error);
      }
    }

    return cardId;
  }, [localAddCard, currentLayoutId, kpiData]);

  const removeCard = useCallback(async (cardId: string) => {
    // Remove from local layout immediately
    localRemoveCard(cardId);
    // Remove any KPI data for this card locally
    setKpiData(prev => {
      if (!prev[cardId]) return prev;
      const next = { ...prev } as Record<string, any>;
      delete next[cardId];
      return next;
    });
    try { localStorage.setItem(KPI_DATA_STORAGE_KEY, JSON.stringify(kpiData)); } catch {}

    if (currentLayoutId) {
      try {
        // Find the server card ID by card_uid
        const cards = await enhancedApi.dashboardLayouts.listCards(currentLayoutId);
        const serverCard = cards.find((c: any) => c.card_uid === cardId);
        if (serverCard) {
          await enhancedApi.dashboardLayouts.deleteCard(serverCard.id);
          console.log('✅ Card deleted from server:', cardId);
        }
      } catch (error) {
        console.error('❌ Failed to delete card from server:', error);
      }
    }
  }, [localRemoveCard, currentLayoutId, KPI_DATA_STORAGE_KEY, kpiData]);

  const updateMultipleCardPositions = useCallback(async (updates: Array<{ cardId: string; x: number; y: number }>) => {
    localUpdateMultipleCardPositions(updates);
    
    if (currentLayoutId) {
      try {
        // Update each card on server
        for (const update of updates) {
          const card = layout.cards[update.cardId];
          if (card) {
            const kd = kpiData[update.cardId] || {};
            const linkage: any = {};
            if (kd.user_kpi_id) linkage.user_kpi_id = kd.user_kpi_id;
            if (kd.template_id) linkage.template_id = kd.template_id;
            await enhancedApi.dashboardLayouts.upsertCard(currentLayoutId, {
              card_uid: update.cardId,
              type: card.type,
              x: card.x,
              y: card.y,
              width: card.width,
              height: card.height,
              ...linkage
            });
          }
        }
      } catch (error) {
        console.error('❌ Failed to update multiple card positions on server:', error);
      }
    }
  }, [localUpdateMultipleCardPositions, currentLayoutId, layout.cards, kpiData]);

  // Load server-side layout and cards on mount
  useEffect(() => {
    const loadServerLayout = async () => {
      try {
        setIsLoadingLayout(true);
        console.log('🔄 Loading server-side layout...');
        
        // Get or create default layout
        const layout = await enhancedApi.dashboardLayouts.getOrCreateDefault();
        if (!layout) {
          console.error('❌ Failed to get or create default layout');
          // Don't return early, continue with localStorage fallback
          setIsLoadingLayout(false);
          return;
        }
        
        setCurrentLayoutId(layout.id);
        console.log('✅ Loaded layout:', layout.id);
        
        // Load cards for this layout
        const cards = await enhancedApi.dashboardLayouts.listCards(layout.id);
        console.log('📋 Loaded cards:', cards.length);

        // Reconstruct layout.cards from server data
        const serverCards: Record<string, any> = {};
        const serverKpiData: Record<string, any> = {};

        // Build serverCards and collect KPI cards/template/userKPI IDs first
        const kpiCards: any[] = [];
        const templateIds: Set<string> = new Set();
        const userKpiIds: Set<string> = new Set();
        cards.forEach((card: any) => {
          serverCards[card.card_uid] = {
            id: card.card_uid,
            type: card.type,
            x: card.x,
            y: card.y,
            width: card.width,
            height: card.height
          };
          if (card.type === 'kpi-display' && (card.user_kpi_id || card.template_id)) {
            kpiCards.push(card);
            if (card.template_id) templateIds.add(card.template_id);
            if (card.user_kpi_id) userKpiIds.add(card.user_kpi_id);
          }
        });

        // If there are template-linked KPI cards, fetch templates once and map by id
        let templateMap: Record<string, any> = {};
        if (templateIds.size > 0) {
          try {
            const templates: any[] = await enhancedApi.kpiTemplates.list();
            templateMap = Object.fromEntries(
              (templates || [])
                .filter((t: any) => templateIds.has(t.id))
                .map((t: any) => [t.id, t])
            );
          } catch (e) {
            console.warn('⚠️ Failed to fetch templates for hydration, proceeding with defaults', e);
          }
        }

        // If there are user KPI-linked cards, fetch user KPIs once and map by id
        let userKpiMap: Record<string, any> = {};
        if (userKpiIds.size > 0) {
          try {
            const userKpisList: any[] = await enhancedApi.userKpis.list();
            userKpiMap = Object.fromEntries(
              (userKpisList || [])
                .filter((u: any) => userKpiIds.has(u.id))
                .map((u: any) => [u.id, u])
            );
          } catch (e) {
            console.warn('⚠️ Failed to fetch user KPIs for hydration, proceeding with defaults', e);
          }
        }

        // Build KPI display data using, in order: userKPI/template info, then card config, then safe defaults
        kpiCards.forEach((card: any) => {
          console.log('🔍 TICKET-5: Hydrating KPI card:', card.card_uid, {
            template_id: card.template_id,
            user_kpi_id: card.user_kpi_id,
            config: card.config
          });

          const cfg = (card.config || {}) as any;
          const tpl = card.template_id ? templateMap[card.template_id] : undefined;
          const userKpi = card.user_kpi_id ? userKpiMap[card.user_kpi_id] : undefined;
          
          console.log('🔍 TICKET-5: Data sources:', {
            template: tpl ? { id: tpl.id, name: tpl.name } : null,
            userKpi: userKpi ? { id: userKpi.id, name: userKpi.name } : null,
            config: cfg
          });

          const threshold = (cfg.threshold)
            || (userKpi?.threshold_config)
            || (tpl?.threshold_config)
            || { green: 80, yellow: 60, unit: '%' };
          const chart = (cfg.chart)
            || (userKpi?.chart_config)
            || (tpl?.chart_config)
            || { type: 'line' };
          const name = cfg.name || userKpi?.name || tpl?.name || 'KPI Display';
          const description = cfg.description || userKpi?.description || tpl?.description || '';

          const kpiData = {
            id: card.user_kpi_id || card.template_id,
            template_id: card.template_id,
            user_kpi_id: card.user_kpi_id,
            name,
            description,
            enabled: true,
            realTime: false,
            threshold,
            chart,
            config: cfg
          };

          console.log('🔍 TICKET-5: Final KPI data for', card.card_uid, ':', kpiData);
          serverKpiData[card.card_uid] = kpiData;
        });
        
        // Update layout with server cards
        if (Object.keys(serverCards).length > 0) {
          loadLayoutFromData({
            cards: serverCards,
            canvasHeight: 600,
            theme: 'light'
          });
        }
        
        // Update KPI data
        if (Object.keys(serverKpiData).length > 0) {
          setKpiData(serverKpiData);
        }

        // Mark server load success so we don't rehydrate from localStorage
        setServerLoadSucceeded(true);
        
        // If no server cards, ensure layout is empty to avoid local resurrection
        if (Object.keys(serverCards).length === 0) {
          loadLayoutFromData({ cards: {}, canvasHeight: 600, theme: 'light' });
        }
        
      } catch (error) {
        console.error('❌ Failed to load server layout:', error);
        // Fallback to localStorage
        try {
          const raw = localStorage.getItem(KPI_DATA_STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') {
              setKpiData(parsed);
              Object.values(parsed).forEach((entry: any) => {
                if (entry && entry.id) {
                  processedKpisRef.current.add(entry.id);
                }
              });
            }
          }
        } catch (e) {
          console.error('❌ Failed to load KPI data from localStorage', e);
        }
      } finally {
        setIsLoadingLayout(false);
      }
    };
    
    loadServerLayout();
  }, [loadLayoutFromData]);

  // Rehydrate KPI data only if server failed to load
  useEffect(() => {
    if (serverLoadSucceeded) return;
    try {
      const raw = localStorage.getItem(KPI_DATA_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          setKpiData(parsed);
          Object.values(parsed).forEach((entry: any) => {
            if (entry && entry.id) {
              processedKpisRef.current.add(entry.id);
            }
          });
        }
      }
    } catch (e) {
      console.error('❌ Failed to load KPI data from localStorage', e);
    }
  }, [serverLoadSucceeded]);

  // Load user KPIs into kpiData state when they become available
  useEffect(() => {
    console.log('🔄 useEffect triggered - userKpis:', userKpis?.length, 'status:', userKpisStatus, 'loading:', isUserKpisLoading, 'error:', isUserKpisError, 'processed KPIs:', Array.from(processedKpisRef.current));

    // Avoid running while loading or if there was an error (keep existing kpiData/stale cache)
    if (isUserKpisLoading || isUserKpisError) {
      return;
    }
    
    if (userKpis && userKpis.length > 0) {
      // Prevent auto-creating duplicates if KPI cards/data already exist
      const existingKpiDisplayCards = Object.values(layout.cards).filter((c: any) => c.type === 'kpi-display');
      const hasExistingKpiData = Object.keys(kpiData).length > 0;

      // Fallback: If KPI cards exist but kpiData is empty (e.g., first run after adding persistence),
      // map available user KPIs to existing cards deterministically and persist
      if (existingKpiDisplayCards.length > 0 && !hasExistingKpiData) {
        console.log('🧩 Mapping user KPIs to existing KPI display cards (fallback)');

        const normalizeKpiForDisplay = (kpi: any) => ({
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

        const sortedCards = [...existingKpiDisplayCards].sort((a, b) => a.id.localeCompare(b.id));
        const mapped: Record<string, any> = {};
        sortedCards.forEach((card: any, index: number) => {
          const kpi = userKpis[index % userKpis.length];
          const display = normalizeKpiForDisplay(kpi);
          mapped[card.id] = display;
          if (display.id) {
            processedKpisRef.current.add(display.id);
          }
        });

        setKpiData(mapped);
        return; // Done via fallback mapping
      }

      if (existingKpiDisplayCards.length > 0 || hasExistingKpiData) {
        console.log('✅ KPI display cards or data already exist, skipping auto-creation');
        return;
      }
      // Find KPIs that haven't been processed yet
      const unprocessedKpis = userKpis.filter((kpi: any) => !processedKpisRef.current.has(kpi.id));
      
      if (unprocessedKpis.length === 0) {
        console.log('✅ All user KPIs already processed, skipping creation');
        return;
      }
      if (!AUTO_CREATE_FROM_USER_KPIS) {
        console.log('⏭️ Auto-create of KPI cards is disabled; skipping.');
        return;
      }
      
      console.log('🔄 Creating KPI cards and data for new KPIs:', unprocessedKpis.map((k: any) => k.name));
      
      (async () => {
        for (const kpi of unprocessedKpis) {
        console.log('🆔 Creating KPI display card for user KPI:', kpi.name);
          const cardId = await addCard('kpi-display', { x: 0, y: 0 });
        const kpiDisplayData = {
          id: kpi.id,
          name: kpi.name,
          description: kpi.description || 'User-defined KPI',
          category: kpi.category || 'operational',
          formula_expression: kpi.formula_expression,
          formula_fields: kpi.formula_fields || [],
          threshold_config: kpi.threshold_config || {},
          chart_config: kpi.chart_config || { type: 'number' },
          data_source_config: kpi.data_source_config || {},
          tags: kpi.tags || [],
          is_active: kpi.is_active,
          created_at: kpi.created_at,
          template_id: kpi.template_id,
          user_id: kpi.user_id,
          tenant_id: kpi.tenant_id,
          enabled: kpi.is_active !== false,
          realTime: false,
            threshold: kpi.threshold_config || { green: 80, yellow: 60, unit: '%' },
          chart: kpi.chart_config || { type: 'line' }
        };
          setKpiData(prev => ({ ...prev, [cardId]: kpiDisplayData }));
        processedKpisRef.current.add(kpi.id);
        console.log('✅ Stored KPI data for card:', cardId, kpiDisplayData);
        }
      })();
    } else if (userKpisStatus === 'success' && Array.isArray(userKpis) && userKpis.length === 0) {
      // Clear KPI data and reset processed KPIs only on definitive success with empty list
      console.log('🔄 No user KPIs found (success), clearing KPI data and resetting processed KPIs');
      setKpiData({});
      processedKpisRef.current.clear();
    }
  }, [userKpis, userKpisStatus, isUserKpisLoading, isUserKpisError, addCard, layout.cards, kpiData]);

  // Initialize virtual scrolling after layout is available
  const virtualScrolling = useVirtualScrolling({
    itemHeight: 200, // Average card height
    containerHeight: Math.max(600, layout.canvasHeight),
    overscan: 5,
    threshold: virtualScrollingThreshold
  });

  // Initialize keyboard navigation
  const keyboardNavigation = useKeyboardNavigation({
    cards: layout.cards,
    selectedCards,
    onSelectCard: (cardId, addToSelection) => {
      if (addToSelection) {
        setSelectedCards(prev => new Set([...prev, cardId]));
      } else {
        setSelectedCards(new Set([cardId]));
      }
    },
    onDeselectAll: () => setSelectedCards(new Set()),
    onFocusCard: (cardId) => {
      // Scroll card into view if needed
      const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
      if (cardElement) {
        cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    },
    onActivateCard: (cardId) => {
      // Toggle selection or open card details
      setSelectedCards(prev => {
        const newSelection = new Set(prev);
        if (newSelection.has(cardId)) {
          newSelection.delete(cardId);
        } else {
          newSelection.add(cardId);
        }
        return newSelection;
      });
    },
    onMoveCard: (cardId, deltaX, deltaY) => {
      // Move card using existing drag system
      const card = layout.cards[cardId];
      if (card) {
        updateCardPosition(cardId, Math.max(0, card.x + deltaX), Math.max(0, card.y + deltaY));
      }
    },
    onResizeCard: (cardId, deltaWidth, deltaHeight) => {
      // Resize card using existing resize system
      const card = layout.cards[cardId];
      if (card) {
        updateCardSize(cardId, Math.max(100, card.width + deltaWidth), Math.max(100, card.height + deltaHeight));
      }
    },
    gridSize: 20,
    enableScreenReader: true
  });

  // Initialize bulk operations
  const bulkOperations = useBulkOperations({
    cards: layout.cards,
    selectedCards,
    onDeleteCards: (cardIds) => {
      cardIds.forEach(cardId => removeCard(cardId));
    },
    onGroupCards: (cardIds, groupName) => {
      // Use the actual grouping function from the hook
      createGroup(groupName || `Group ${Date.now()}`, cardIds, layout.cards);
    },
    onUngroupCards: (cardIds) => {
      // Find groups that contain these cards and ungroup them
      cardIds.forEach(cardId => {
        const group = getCardGroup(cardId);
        if (group) {
          ungroupCards(group.id);
        }
      });
    },
    onMoveCards: (cardIds, deltaX, deltaY) => {
      cardIds.forEach(cardId => {
        const card = layout.cards[cardId];
        if (card) {
          updateCardPosition(cardId, Math.max(0, card.x + deltaX), Math.max(0, card.y + deltaY));
        }
      });
    },
    onResizeCards: (cardIds, deltaWidth, deltaHeight) => {
      cardIds.forEach(cardId => {
        const card = layout.cards[cardId];
        if (card) {
          updateCardSize(cardId, Math.max(100, card.width + deltaWidth), Math.max(100, card.height + deltaHeight));
        }
      });
    },
    onLockCards: (cardIds) => {
      cardIds.forEach(cardId => lockCards([cardId]));
    },
    onUnlockCards: (cardIds) => {
      cardIds.forEach(cardId => unlockCards([cardId]));
    },
    onDuplicateCards: (cardIds) => {
      // Duplicate cards using existing system
      cardIds.forEach(cardId => {
        const card = layout.cards[cardId];
        if (card) {
          const newCardId = addCard(card.type, { x: card.x + 20, y: card.y + 20 });
          // Copy card properties
          console.log(`Duplicated card ${cardId} to ${newCardId}`);
        }
      });
    },
    onUpdateCardPosition: updateCardPosition,
    onUpdateCardSize: updateCardSize
  });

  const { toggleCardLock, lockCards, unlockCards, isCardLocked } = useCardLocking();
  
  const {
    containerRef,
    zoom,
    zoomIn,
    zoomOut,
    setZoom,
    setPan,
    resetView,
    handlePanStart,
    getTransformStyle,
    canZoomIn,
    canZoomOut,
    pan
  } = useZoomPan();
  
  const {
    groups, 
    selectedGroupId, 
    setSelectedGroupId,
    createGroup,
    updateGroup, 
    deleteGroup,
    getCardGroup,
    ungroupCards,
    clearAllGroups,
    updateGroupBounds
  } = useCardGrouping((cardIds: string[]) => {
    // Delete all cards in the group
    cardIds.forEach(cardId => removeCard(cardId));
  });

  const {
    handleGroupDragStart
  } = useGroupDragDrop({
    groups,
    onUpdateGroup: updateGroup,
    onUpdateMultipleCardPositions: updateMultipleCardPositions,
    cards: layout.cards,
    zoom,
    canvasHeight: layout.canvasHeight,
    getCardGroup
  });

  const {
    isConnected: isCollabConnected,
    connectionStatus,
    collaborators,
    connect: connectCollab,
    disconnect: disconnectCollab
  } = useRealtimeCollaboration('dashboard-main', user);

  const { handleDragStart, isDragging, draggedCardId, isDraggingMultiple } = useCardDragDrop({
    onUpdatePosition: updateCardPosition,
    onUpdateMultiplePositions: updateMultipleCardPositions,
    cards: layout.cards,
    selectedCards,
    isCardLocked,
    getCardGroup,
    onDragEnd: saveToHistory,
    zoom,
    canvasHeight: layout.canvasHeight
  });

  // Helper function to get card type
  const getCardType = useCallback((cardId: string): string => {
    return layout.cards[cardId]?.type || 'unknown';
  }, [layout.cards]);


  const { handleResizeStart, resizingCardId } = useCardResize({
    onUpdateSize: updateCardSize,
    cards: layout.cards,
    onResizeEnd: saveToHistory,
    getCardGroup,
    updateGroupBounds,
    getCardType
  });

  // Keyboard shortcuts handlers
  const handleAddCard = useCallback((type: string) => {
    addCard(type).then(cardId => {
    setSelectedCards(new Set([cardId]));
    });
  }, [addCard]);

  const handleDuplicateCards = useCallback((cardIds: string[]) => {
    cardIds.forEach(cardId => {
      const originalCard = layout.cards[cardId];
      if (originalCard) {
        addCard(originalCard.type, { 
          x: originalCard.x + 20, 
          y: originalCard.y + 20 
        });
      }
    });
  }, [layout.cards, addCard]);

  const handleDeleteCards = useCallback((cardIds: string[]) => {
    cardIds.forEach(removeCard);
    setSelectedCards(new Set());
  }, [removeCard]);

  const handleResetCards = useCallback((cardIds: string[]) => {
    cardIds.forEach(cardId => {
      const card = layout.cards[cardId];
      if (card) {
        // Reset to default size based on type
        const defaultSize = getDefaultCardSize(card.type);
        updateCardSize(cardId, defaultSize.width, defaultSize.height);
      }
    });
  }, [layout.cards, updateCardSize]);

  const handleSelectAll = useCallback(() => {
    setSelectedCards(new Set(Object.keys(layout.cards)));
  }, [layout.cards]);

  const handleDeselectAll = useCallback(() => {
    setSelectedCards(new Set());
  }, []);

  // Handle load preset - completely replace layout
  const handleLoadPreset = useCallback((presetLayout: any) => {
    // Completely replace the current layout with the saved layout
    // This ensures we get exactly what was saved, no merging with defaults
    const newLayout = {
      cards: presetLayout.cards || {},
      canvasHeight: presetLayout.canvasHeight || 600,
      theme: presetLayout.theme || 'light',
      zoom: presetLayout.zoom,
      pan: presetLayout.pan
    };
    
    // Use the layout hook's loadLayoutFromData to replace everything
    loadLayoutFromData(newLayout);
    
    // Restore zoom and pan if they exist in the saved layout
    if (presetLayout.zoom !== undefined || presetLayout.pan !== undefined) {
      setZoom(presetLayout.zoom || 1);
      if (presetLayout.pan) {
        setPan(presetLayout.pan);
      }
    }
  }, [loadLayoutFromData, setZoom, setPan]);


  // Memoized filtered cards to prevent unnecessary recalculations
  const filteredCards = useMemo(() => {
    if (!searchTerm.trim()) {
      return Object.values(layout.cards);
    }
    
    const term = searchTerm.toLowerCase();
    return Object.values(layout.cards).filter(card => {
      const cardType = cardTypes.find(t => t.id === card.type);
      const cardName = cardType?.name || '';
      return cardName.toLowerCase().includes(term) || 
             card.type.toLowerCase().includes(term) ||
             card.id.toLowerCase().includes(term);
    });
  }, [layout.cards, searchTerm]);

  // Initialize keyboard shortcuts
  const { shortcuts } = useKeyboardShortcuts({
    onAddCard: handleAddCard,
    onDuplicateCards: handleDuplicateCards,
    onDeleteCards: handleDeleteCards,
    onAutoArrange: autoArrange,
    onResetCards: handleResetCards,
    onSelectAll: handleSelectAll,
    onDeselectAll: handleDeselectAll,
    onShowHelp: () => setShowKeyboardHelp(true),
    onUndo: undo,
    onRedo: redo,
    selectedCards
  });

  // Handle card selection
  const handleCardClick = useCallback((cardId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent canvas deselect
    
    if (isDragging) return;

    if (e.ctrlKey || e.metaKey) {
      // Multi-select
      setSelectedCards(prev => {
        const newSet = new Set(prev);
        if (newSet.has(cardId)) {
          newSet.delete(cardId);
        } else {
          newSet.add(cardId);
        }
        return newSet;
      });
    } else {
      // Single select
      setSelectedCards(new Set([cardId]));
    }
  }, [isDragging]);

  // Old lock/unlock functions removed - now handled by BulkActionBar

  // Old group creation function removed - now handled by BulkActionBar

  // Enhanced reset that also clears groups
  const handleResetAll = useCallback(() => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset Dashboard',
      message: 'Reset dashboard and remove all groups? This cannot be undone.',
      type: 'danger',
      onConfirm: () => {
        // Clear all groups
        clearAllGroups();
        // Reset layout
        resetLayout();
        // Clear KPI data and reset processed KPIs
        setKpiData({});
        processedKpisRef.current.clear();
        try { localStorage.removeItem(KPI_DATA_STORAGE_KEY); } catch {}
        console.log('🔄 Dashboard reset - cleared all cards, groups, and KPI data');
      }
    });
  }, [clearAllGroups, resetLayout]);

  // Handle group delete request
  const handleGroupDeleteRequest = useCallback((groupId: string) => {
    const group = groups[groupId];
    if (group) {
      setGroupDeleteModal({
        isOpen: true,
        groupId,
        groupName: group.name
      });
    }
  }, [groups]);

  // Handle group delete confirmation
  const handleGroupDeleteConfirm = useCallback(() => {
    deleteGroup(groupDeleteModal.groupId);
    setGroupDeleteModal({
      isOpen: false,
      groupId: '',
      groupName: ''
    });
  }, [groupDeleteModal.groupId, deleteGroup]);

  // Mobile optimization handlers

  const handleMobileFullscreen = useCallback(() => {
    setIsMobileFullscreen(!isMobileFullscreen);
  }, [isMobileFullscreen]);

  // Desktop fullscreen handler
  const handleFullscreenToggle = useCallback(() => {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      document.documentElement.requestFullscreen().then(() => {
        setIsMobileFullscreen(true);
      }).catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      // Exit fullscreen
      document.exitFullscreen().then(() => {
        setIsMobileFullscreen(false);
      }).catch(err => {
        console.error('Error attempting to exit fullscreen:', err);
      });
    }
  }, []);

  const handleMobileNavigate = useCallback((page: string) => {
    console.log('Navigate to:', page);
    // Handle navigation logic here
  }, []);

  const handleMobileSearch = useCallback((query: string) => {
    setSearchTerm(query);
  }, []);

  const handleToggleMobileView = useCallback((view: 'grid' | 'list') => {
    console.log('Toggle view mode:', view);
    // Handle view mode toggle logic here
  }, []);

  // Get default card size
  const getDefaultCardSize = (type: string) => {
    const defaults: Record<string, { width: number; height: number }> = {
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
      'financial-summary': { width: 280, height: 180 }
    };
    return defaults[type] || { width: 280, height: 180 };
  };

  // Render card component
  const renderCard = (card: any) => {
    const cardType = cardTypes.find(type => type.id === card.type);
    const CardComponent = cardType?.component || (() => <div>Unknown Card Type</div>);
    
    console.log('🎨 Rendering card:', { 
      cardId: card.id, 
      cardType: card.type, 
      cardTypeFound: !!cardType,
      cardTypeName: cardType?.name,
      kpiDataAvailable: card.type === 'kpi-display' ? !!kpiData[card.id] : 'N/A'
    });
    
    // Handle special kpi-display case
    if (card.type === 'kpi-display') {
      console.log('📊 Rendering KPI display card with ID:', card.id, 'KPI data:', kpiData[card.id]);
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
      return (CardComponent as any)({ cardId: card.id, onOpenTemplateLibrary: () => setShowTemplateLibrary(true) });
    }
    
    return (CardComponent as any)();
  };

  // Simplified render function for better functionality and performance balance
  const renderVirtualCard = useCallback((card: any, _index: number) => (
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
          ? 'border-red-400 bg-red-50/30 cursor-not-allowed'
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
      onFocus={() => keyboardNavigation.navigateToCard(card.id)}
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
        {/* Card Header - Expands from 0 height like the expandable card */}
        <div
          className="bg-purple-600 text-white text-center font-semibold transition-all duration-300 ease-out overflow-hidden cursor-move rounded-t-xl group-hover:!h-12 group-hover:!opacity-100"
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
                  toggleCardLock(card.id);
                }}
                className={`p-1.5 rounded-full transition-all duration-200 hover:scale-110 ${
                  isCardLocked(card.id) 
                    ? 'hover:bg-red-500/20 text-red-200 hover:text-red-100' 
                    : 'hover:bg-purple-500/20 text-purple-200 hover:text-purple-100'
                }`}
                title={isCardLocked(card.id) ? 'Unlock card' : 'Lock card'}
              >
                {isCardLocked(card.id) ? (
                  <Unlock className="w-3 h-3" />
                ) : (
                  <Lock className="w-3 h-3" />
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeCard(card.id);
                }}
                className="p-1.5 hover:bg-red-500/20 rounded-full transition-all duration-200 hover:scale-110"
                title="Delete card"
              >
                <X className="w-4 h-4 text-red-200 hover:text-red-100" />
              </button>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-3 h-full overflow-visible">
          {renderCard(card)}
        </div>

        {/* Resize Handles */}
        {(selectedCards.has(card.id) || resizingCardId === card.id) && !isCardLocked(card.id) && (
          <>
            {/* Corner handles */}
            <ResizeHandle position="nw" onResizeStart={(handle, e) => handleResizeStart(card.id, handle, e)} />
            <ResizeHandle position="ne" onResizeStart={(handle, e) => handleResizeStart(card.id, handle, e)} />
            <ResizeHandle position="sw" onResizeStart={(handle, e) => handleResizeStart(card.id, handle, e)} />
            <ResizeHandle position="se" onResizeStart={(handle, e) => handleResizeStart(card.id, handle, e)} />
            
            {/* Edge handles */}
            <ResizeHandle position="n" onResizeStart={(handle, e) => handleResizeStart(card.id, handle, e)} />
            <ResizeHandle position="s" onResizeStart={(handle, e) => handleResizeStart(card.id, handle, e)} />
            <ResizeHandle position="e" onResizeStart={(handle, e) => handleResizeStart(card.id, handle, e)} />
            <ResizeHandle position="w" onResizeStart={(handle, e) => handleResizeStart(card.id, handle, e)} />
          </>
        )}
      </div>
    </CardFocusManager>
  ), [
    selectedCards, 
    isDraggingMultiple, 
    draggedCardId, 
    isCardLocked, 
    getCardGroup, 
    searchTerm, 
    filteredCards, 
    handleDragStart, 
    handleCardClick, 
    toggleCardLock, 
    removeCard, 
    renderCard, 
    resizingCardId, 
    handleResizeStart,
    keyboardNavigation
  ]);

  if (!user) {
    return <LoadingSpinner />;
  }

  if (isLoadingLayout) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <div className="mt-4 text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Mobile Navigation */}
      {showMobileNavigation && (
        <MobileNavigation
          currentPage="dashboard"
          onNavigate={handleMobileNavigate}
          onSearch={handleMobileSearch}
          onToggleFullscreen={handleMobileFullscreen}
          isFullscreen={isMobileFullscreen}
          onToggleView={handleToggleMobileView}
          user={{
            name: user?.name || 'User',
            email: user?.email || 'user@example.com',
            avatar: user?.avatar_url
          }}
          onLogout={() => {
            // Handle logout
          }}
        />
      )}

      {/* Dashboard Container */}
      <div className="dashboard-content">
          {/* Keyboard Shortcuts Help Button - Top Right */}
          <div className="absolute top-4 right-4 z-40">
            <button
              onClick={() => setShowKeyboardHelp(true)}
              className="p-2 rounded-lg shadow-md transition-all duration-200 hover:scale-105 bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              title="Keyboard Shortcuts (?)"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>

          <div className="max-w-full mx-auto px-2 pt-4">
        {/* Dashboard Controls */}
        <div className="mb-4">
          {/* Old floating panel removed - using new BulkActionBar instead */}

          {/* Main Action Buttons - Centered */}
          <div className="flex items-center justify-center space-x-2">
            {/* Add Card Button */}
            <button
              onClick={() => setShowCardSelector(!showCardSelector)}
              className="flex items-center gap-2 px-3 py-1.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Card
            </button>

            {/* Collaboration Indicator - Right next to Add Card */}
            <CollaborationIndicator
              isConnected={isCollabConnected}
              connectionStatus={connectionStatus}
              collaborators={collaborators}
              onToggleConnection={() => isCollabConnected ? disconnectCollab() : connectCollab()}
            />

            {/* Auto-arrange buttons */}
            <div className="flex items-center bg-white/60 rounded-lg border border-gray-200">
              <button
                onClick={() => autoArrange('grid')}
                className="p-1.5 hover:bg-gray-100 rounded-l-lg transition-colors"
                title="Auto-arrange Grid (Ctrl+G)"
              >
                <Grid className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => autoArrange('list')}
                className="p-1.5 hover:bg-gray-100 transition-colors"
                title="Auto-arrange List (Ctrl+L)"
              >
                <List className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => autoArrange('compact')}
                className="p-1.5 hover:bg-gray-100 rounded-r-lg transition-colors"
                title="Auto-arrange Compact (Ctrl+K)"
              >
                <Maximize2 className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Reset Layout */}
            {/* Template Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => applyTemplate('dashboard')}
                className="px-2 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100 transition-colors text-xs"
                title="Dashboard Layout"
              >
                Dashboard
              </button>
              <button
                onClick={() => applyTemplate('grid')}
                className="px-2 py-1 bg-green-50 text-green-600 border border-green-200 rounded hover:bg-green-100 transition-colors text-xs"
                title="Grid Layout"
              >
                Grid
              </button>
              <button
                onClick={() => applyTemplate('sidebar')}
                className="px-2 py-1 bg-purple-50 text-purple-600 border border-purple-200 rounded hover:bg-purple-100 transition-colors text-xs"
                title="Sidebar Layout"
              >
                Sidebar
              </button>
            </div>

            <button
              onClick={autoArrangeCards}
              className="p-1.5 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
              title="Auto Arrange"
            >
              <Grid className="w-4 h-4 text-green-600" />
            </button>

            {/* Undo/Redo buttons */}
            <div className="flex items-center bg-white/60 rounded-lg border border-gray-200">
              <button
                onClick={undo}
                disabled={!canUndo}
                className={`p-1.5 rounded-l-lg transition-colors ${
                  canUndo 
                    ? 'hover:bg-gray-100 text-gray-700' 
                    : 'text-gray-300 cursor-not-allowed'
                }`}
                title="Undo (Ctrl+Z)"
              >
                <Undo className="w-4 h-4" />
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                className={`p-1.5 rounded-r-lg transition-colors ${
                  canRedo 
                    ? 'hover:bg-gray-100 text-gray-700' 
                    : 'text-gray-300 cursor-not-allowed'
                }`}
                title="Redo (Ctrl+Y)"
              >
                <Redo className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <Search className="h-3 w-3 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search cards..."
                className="pl-7 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white/60 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all w-32"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-2 flex items-center"
                >
                  <X className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* Layout Manager */}
              <button
              onClick={() => setShowLayoutManager(true)}
              className="p-1.5 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
              title="Layout Manager - Save, Load & Manage Layouts"
            >
              <Save className="w-4 h-4 text-purple-600" />
              </button>


            {/* Zoom Controls */}
            <div className="flex items-center bg-white/60 rounded-lg border border-gray-200">
              <button
                onClick={zoomOut}
                disabled={!canZoomOut}
                className={`p-1.5 rounded-l-lg transition-colors ${
                  canZoomOut 
                    ? 'hover:bg-gray-100 text-gray-700' 
                    : 'text-gray-300 cursor-not-allowed'
                }`}
                title="Zoom Out (Ctrl + -)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <div className="px-2 py-1.5 text-xs font-medium text-gray-600 border-x border-gray-200">
                {Math.round(zoom * 100)}%
              </div>
              <button
                onClick={zoomIn}
                disabled={!canZoomIn}
                className={`p-1.5 transition-colors ${
                  canZoomIn 
                    ? 'hover:bg-gray-100 text-gray-700' 
                    : 'text-gray-300 cursor-not-allowed'
                }`}
                title="Zoom In (Ctrl + +)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={resetView}
                className="p-1.5 rounded-r-lg hover:bg-gray-100 transition-colors"
                title="Reset View (Ctrl + 0)"
              >
                <Maximize className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            {/* Virtual Scrolling Controls */}
            <div className="flex items-center bg-white/60 rounded-lg border border-gray-200">
              <button
                onClick={() => setUseVirtualScrollingEnabled(!useVirtualScrollingEnabled)}
                className={`p-1.5 rounded-l-lg transition-colors ${
                  useVirtualScrollingEnabled 
                    ? 'bg-purple-100 text-purple-600' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
                title={`Virtual Scrolling ${useVirtualScrollingEnabled ? 'ON' : 'OFF'} (${Object.keys(layout.cards).length} cards)`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <span className="px-2 py-1 text-xs font-medium text-gray-700 min-w-[2rem] text-center">
                {virtualScrolling.isVirtualScrolling ? 'VS' : 'N'}
              </span>
              <button
                onClick={() => setVirtualScrollingThreshold(Math.max(50, virtualScrollingThreshold - 25))}
                className="p-1.5 hover:bg-gray-100 transition-colors"
                title="Decrease Threshold"
              >
                -
              </button>
              <span className="px-1 py-1 text-xs font-medium text-gray-700 min-w-[1.5rem] text-center">
                {virtualScrollingThreshold}
              </span>
              <button
                onClick={() => setVirtualScrollingThreshold(Math.min(500, virtualScrollingThreshold + 25))}
                className="p-1.5 hover:bg-gray-100 rounded-r-lg transition-colors"
                title="Increase Threshold"
              >
                +
              </button>
            </div>

            <button
              onClick={handleResetAll}
              className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors"
              title="Reset Layout & Clear Groups"
            >
              <RotateCcw className="w-4 h-4 text-red-600" />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={handleFullscreenToggle}
              className="p-1.5 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
              title={isMobileFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isMobileFullscreen ? (
                <Minimize2 className="w-4 h-4 text-green-600" />
              ) : (
                <Maximize2 className="w-4 h-4 text-green-600" />
              )}
            </button>
          </div>
        </div>


        {/* Dashboard Canvas */}
        <div 
          ref={containerRef}
          className="dashboard-canvas relative bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg border-2 border-dashed border-slate-200 min-h-[600px] overflow-hidden cursor-grab"
          style={{ height: `${Math.max(600, layout.canvasHeight)}px` }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleDeselectAll();
            }
          }}
          onMouseDown={handlePanStart}
        >
          {/* Zoom/Pan Container */}
          <div style={getTransformStyle()}>
          {/* Groups */}
          {Object.values(groups).map((group) => (
            <CardGroup
              key={group.id}
              group={group}
              onUpdateGroup={updateGroup}
              onDeleteGroup={deleteGroup}
              onUngroupCards={ungroupCards}
              isSelected={selectedGroupId === group.id}
              onClick={() => setSelectedGroupId(selectedGroupId === group.id ? null : group.id)}
              onGroupDragStart={handleGroupDragStart}
              onRequestDelete={handleGroupDeleteRequest}
            />
          ))}

          {/* Cards - Virtual Scrolling Implementation */}
          {virtualScrolling.isVirtualScrolling ? (
            <VirtualCardContainer
              cards={filteredCards}
              cardWidth={300}
              cardHeight={200}
              containerWidth={1200}
              containerHeight={layout.canvasHeight}
              renderCard={renderVirtualCard}
              onScroll={(_scrollTop) => {
                // Handle scroll events if needed
              }}
              overscan={5}
              threshold={virtualScrollingThreshold}
            />
          ) : (
            // Fallback to normal rendering for small card sets
            filteredCards.map((card: any) => renderVirtualCard(card, 0))
          )}
          </div>

          {/* Empty State */}
          {Object.keys(layout.cards).length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-400 text-lg font-medium mb-2">
                  Your Customizable Dashboard
                </div>
                <div className="text-gray-500 text-sm mb-4">
                  Add cards to create your personalized workspace
                </div>
                <button
                  onClick={() => setShowCardSelector(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Card
                </button>
              </div>
            </div>
          )}
        </div>

          {/* Status Bar */}
          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <div>
                {searchTerm ? (
                  `${filteredCards.length} of ${Object.keys(layout.cards).length} cards shown • Search: "${searchTerm}"`
                ) : (
                  `${Object.keys(layout.cards).length} cards • Ctrl+click for multi-select • Press ? for keyboard shortcuts`
                )}
                {virtualScrolling.isVirtualScrolling && (
                  <span className="ml-2 text-purple-600 font-medium">
                    • Virtual Scrolling ON (threshold: {virtualScrollingThreshold})
                  </span>
                )}
              </div>
              
              {/* Layout Indicator */}
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Layout:</span>
                <div className="flex gap-1">
                  {['grid', 'dashboard', 'sidebar'].map((layoutType) => (
                    <button
                      key={layoutType}
                      onClick={() => applyTemplate(layoutType)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        layout.currentLayout === layoutType
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {layoutType.charAt(0).toUpperCase() + layoutType.slice(1)}
                    </button>
                  ))}
                  {layout.currentLayout === 'custom' && (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-orange-500 text-white">
                      Custom
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <WebSocketStatus showStats={true} />
              <VirtualCardPerformance
                cardCount={Object.keys(layout.cards).length}
                isVirtualScrolling={virtualScrolling.isVirtualScrolling}
              />
              {selectedCards.size > 0 && `${selectedCards.size} selected • ${isDraggingMultiple ? 'Dragging multiple cards' : 'Delete to remove'}`}
            </div>
          </div>
      </div>


      {/* Keyboard Shortcuts Modal */}
      {showKeyboardHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Keyboard Shortcuts</h2>
              <button
                onClick={() => setShowKeyboardHelp(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Shortcuts Content */}
            <div className="p-6">
              {['Card Creation', 'Layout', 'Card Management', 'Selection', 'Help'].map(category => (
                <div key={category} className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">{category}</h3>
                  <div className="space-y-2">
                    {shortcuts
                      .filter(shortcut => shortcut.category === category)
                      .map((shortcut, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{shortcut.description}</div>
                            <div className="text-xs text-gray-500">{shortcut.action}</div>
                          </div>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded shadow-sm">
                            {shortcut.key}
                          </kbd>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      </div>

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedCards.size}
        isVisible={selectedCards.size > 0}
        onBulkDelete={() => bulkOperations.bulkDelete()}
        onBulkLock={() => bulkOperations.bulkLock()}
        onBulkUnlock={() => bulkOperations.bulkUnlock()}
        onBulkDuplicate={() => bulkOperations.bulkDuplicate()}
        onBulkGroup={(groupName) => bulkOperations.bulkGroup(undefined, groupName)}
        onBulkUngroup={() => bulkOperations.bulkUngroup()}
        onBulkMove={(deltaX, deltaY) => bulkOperations.bulkMove(deltaX, deltaY)}
        onBulkResize={(deltaWidth, deltaHeight) => bulkOperations.bulkResize(deltaWidth, deltaHeight)}
        onClearSelection={() => setSelectedCards(new Set())}
      />

      {/* Floating Card Selector Dialog */}
      {showCardSelector && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-25 z-50"
            onClick={() => setShowCardSelector(false)}
          />
          
          {/* Floating Dialog */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 max-w-[90vw] max-h-[90vh] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Add Card to Dashboard</h3>
                <button
                  onClick={() => setShowCardSelector(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
                {cardTypes.map((cardType) => (
                  <button
                    key={cardType.id}
                    onClick={() => {
                      handleAddCard(cardType.id);
                      setShowCardSelector(false);
                    }}
                    className="p-4 text-left bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-lg transition-all duration-200 hover:shadow-md"
                  >
                    <div className="font-medium text-gray-800 text-sm mb-1">{cardType.name}</div>
                    <div className="text-xs text-gray-500">Click to add to dashboard</div>
                  </button>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center">
                  💡 Use 1-9 keys for quick card creation
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Layout Manager Modal */}
      <LayoutManager
        currentLayout={layout}
        currentZoom={zoom}
        currentPan={pan}
        isOpen={showLayoutManager}
        onClose={() => setShowLayoutManager(false)}
        onLoadLayout={handleLoadPreset}
      />

      {/* Custom Modals */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal(prev => ({ ...prev, isOpen: false }))}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />
      
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onConfirm={() => {
          confirmModal.onConfirm();
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
      />

      <PromptModal
        isOpen={promptModal.isOpen}
        onConfirm={promptModal.onConfirm}
        onCancel={() => setPromptModal(prev => ({ ...prev, isOpen: false }))}
        title={promptModal.title}
        message={promptModal.message}
        placeholder={promptModal.placeholder}
        defaultValue={promptModal.defaultValue}
      />

      {/* Smart KPIs Drill-Down Modal */}
      <DrillDownModal
        isOpen={smartKPIs.isDrillDownOpen}
        onClose={() => smartKPIs.setIsDrillDownOpen(false)}
        kpi={smartKPIs.selectedKPI}
        data={smartKPIs.drillDownData}
      />

      {/* Group Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={groupDeleteModal.isOpen}
        onConfirm={handleGroupDeleteConfirm}
        onCancel={() => setGroupDeleteModal(prev => ({ ...prev, isOpen: false }))}
        title="Delete Group"
        message={`Delete group "${groupDeleteModal.groupName}" and all cards inside?`}
        type="danger"
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* KPI Builder Modal - Rendered outside cards for full screen access */}
        <KPIBuilder
          isOpen={showKPIBuilder}
          onClose={() => setShowKPIBuilder(false)}
          isEditingTemplate={false}
          onSaveTemplate={async (template) => {
            console.log('✅ Template saved successfully:', template);
            // Template is automatically saved to database via the mutation
            // You can add additional logic here if needed (e.g., refresh template list)
          }}
          onUseTemplate={async (template) => {
            console.log('🔍 TICKET-4: KPI Builder onUseTemplate - Starting comprehensive logging');
            console.log('📋 Template details:', {
              id: template.id,
              name: template.name,
              type: template.type,
              source: (template as any).source,
              template_type: (template as any).template_type,
              user_id: (template as any).user_id,
              is_active: (template as any).is_active
            });

            // TICKET-5: Atomic Operations for KPI Builder
            console.log('🔍 TICKET-5: Starting atomic KPI Builder operation');
            
            try {
              // Step 1: Add card to layout first to get the cardId
              const cardId = localAddCard('kpi-display', { x: 0, y: 0 });
              console.log('🔍 TICKET-5: KPI Builder generated card ID:', cardId);
              
              // Step 2: Transform template data with the actual cardId
              const kpiData = transformTemplateToKpiData(template, cardId);
              
              // Step 3: Prepare server payload (KPI Builder always uses template_id)
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
                template_id: (template as any).id,
                config: cfg
              };

              console.log('🔍 TICKET-5: KPI Builder atomic operation prepared:', {
                cardId,
                serverPayload
              });

              // Step 4: Execute server operation with retry logic
              if (currentLayoutId) {
                let retryCount = 0;
                const maxRetries = 3;
                let lastError: any = null;

                while (retryCount < maxRetries) {
                  try {
                    await enhancedApi.dashboardLayouts.upsertCard(currentLayoutId, serverPayload);
                    console.log('✅ TICKET-5: KPI Builder server operation successful (attempt', retryCount + 1, ')');
                    break;
                  } catch (err) {
                    lastError = err;
                    retryCount++;
                    console.warn(`⚠️ TICKET-5: KPI Builder server retry ${retryCount}/${maxRetries} failed:`, err);
                    
                    if (retryCount < maxRetries) {
                      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
                    }
                  }
                }

                if (retryCount >= maxRetries) {
                  throw new Error(`KPI Builder server operation failed after ${maxRetries} attempts: ${lastError?.message}`);
                }

                // Step 5: Store KPI data after successful server operation
                console.log('🔍 TICKET-5: Storing KPI Builder KPI data after successful server operation');
                setKpiData(prev => {
                  const newKpiData = {
                    ...prev,
                    [cardId]: kpiData
                  };
                  console.log('🔍 TICKET-5: KPI Builder updated KPI data with card ID:', cardId, 'KPI data:', newKpiData);
                  return newKpiData;
                });

                console.log('✅ TICKET-5: KPI Builder atomic operation completed successfully');
              } else {
                throw new Error('No currentLayoutId available for KPI Builder atomic operation');
              }

              // Step 6: Close the modal only after successful atomic operation
              console.log('📋 TICKET-5: Created KPI Builder card atomically, closing modal');
              setShowKPIBuilder(false);

            } catch (error) {
              console.error('❌ TICKET-5: KPI Builder atomic operation failed:', error);
              // Don't update any local state if server operation failed
              throw error;
            }
          }}
          onSave={async (kpi) => {
          try {
            console.log('🎯 Starting KPI save process...', kpi);
            console.log('🔍 KPI templateId:', kpi.templateId);
            console.log('🔍 KPI formula:', kpi.formula);
            console.log('🔍 KPI formula fields:', kpi.formula?.fields);
            
            // Use template ID if available, otherwise null for custom KPIs
            const trackingId = kpi.templateId || null;
            console.log('🆔 Using template ID:', trackingId);
            
            // Transform KPI builder data to backend API format (matching CreateKPIDto)
            const userKpiData = {
              name: kpi.name,
              description: kpi.description,
              category: kpi.category || 'operational', // Use the category from the KPI builder
              threshold: kpi.threshold || {
                green: 80,
                yellow: 60,
                red: 40,
                unit: '%'
              },
              enabled: true,
              realTime: kpi.isRealTime || false,
              tags: [],
              templateId: trackingId, // Use template ID or generate random tracking ID
              formulaExpression: kpi.formula?.expression || 'SUM(value)', // Include formula expression
              formulaFields: (kpi.formula?.fields || []).filter(field => field && typeof field === 'string') // Filter out null/undefined fields
            };

            console.log('📊 User KPI data to save:', userKpiData);

            // Save to database using userKpis API
            const savedKpi = await enhancedApi.userKpis.create(userKpiData);
            console.log('✅ Saved KPI to database:', savedKpi);

            // Add new card to dashboard using the layout system
            console.log('🎨 Creating new card...');
            const newCardId = await addCard('kpi-display', { x: 0, y: 0 });
            console.log('🆔 New card ID:', newCardId);

            // Store KPI data for this card with proper structure for KpiDisplayCard
            setKpiData(prev => {
              const transformedKpiData = {
                id: savedKpi.id,
                name: savedKpi.name,
                description: savedKpi.description || 'User-defined KPI',
                category: savedKpi.category || 'operational',
                formula_expression: savedKpi.formula_expression,
                formula_fields: savedKpi.formula_fields || [],
                threshold_config: savedKpi.threshold_config || {},
                chart_config: savedKpi.chart_config || { type: 'number' },
                data_source_config: savedKpi.data_source_config || {},
                tags: savedKpi.tags || [],
                is_active: savedKpi.is_active,
                created_at: savedKpi.created_at,
                template_id: savedKpi.template_id,
                user_id: savedKpi.user_id,
                tenant_id: savedKpi.tenant_id,
                // Add display-specific properties that KpiDisplayCard expects
                enabled: savedKpi.is_active !== false,
                realTime: savedKpi.realTime || false,
                threshold: savedKpi.threshold_config || {
                  green: 80,
                  yellow: 60,
                  unit: '%'
                },
                chart: savedKpi.chart_config || { type: 'line' }
              };
              
              const newKpiData = {
                ...prev,
                [newCardId]: transformedKpiData
              };
              console.log('💾 Updated KPI data state:', newKpiData);
              return newKpiData;
            });

            // Update server card with KPI linkage
            if (currentLayoutId) {
              try {
                await enhancedApi.dashboardLayouts.upsertCard(currentLayoutId, {
                  card_uid: newCardId,
                  type: 'kpi-display',
                  x: 0,
                  y: 0,
                  width: 300,
                  height: 200,
                  user_kpi_id: savedKpi.id,
                  config: {}
                });
                console.log('✅ KPI card linked on server:', newCardId);
              } catch (error) {
                console.error('❌ Failed to link KPI card on server:', error);
              }
            }

            console.log('🎉 Successfully created KPI card:', newCardId);

            // Debug: Check current layout
            console.log('🔍 Current layout cards:', Object.keys(layout.cards));
            console.log('🔍 Current KPI data:', kpiData);
            console.log('🔍 Layout object:', layout);
            console.log('🔍 Card types available:', cardTypes.map(ct => ct.id));

            // Close builder
            setShowKPIBuilder(false);
          } catch (error) {
            console.error('❌ Failed to save KPI:', error);
            // You could add a toast notification here
          }
        }}
        onTest={async (_kpi) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                value: Math.floor(Math.random() * 100),
                status: 'success',
                timestamp: new Date().toISOString()
              });
            }, 1000);
          });
        }}
        availableFields={[
          { id: 'jobs_completed', name: 'Jobs Completed', type: 'number', table: 'jobs', column: 'status', aggregation: 'count' },
          { id: 'revenue_total', name: 'Total Revenue', type: 'number', table: 'invoices', column: 'amount', aggregation: 'sum' },
          { id: 'customer_count', name: 'Customer Count', type: 'number', table: 'customers', column: 'id', aggregation: 'count' },
          { id: 'avg_rating', name: 'Average Rating', type: 'number', table: 'reviews', column: 'rating', aggregation: 'avg' },
          { id: 'completion_rate', name: 'Completion Rate', type: 'number', table: 'jobs', column: 'status', aggregation: 'count' }
        ]}
      />

      {/* Template Library Modal */}
      <KpiTemplateLibraryModal
        isOpen={showTemplateLibrary}
        onClose={() => setShowTemplateLibrary(false)}
        onUseTemplate={async (template) => {
          console.log('🔍 TICKET-4: Template Library onUseTemplate - Starting comprehensive logging');
          console.log('📋 Template details:', {
            id: template.id,
            name: template.name,
            type: template.type,
            source: (template as any).source,
            template_type: (template as any).template_type,
            user_id: (template as any).user_id,
            is_active: (template as any).is_active
          });

          // TICKET-5: Atomic Operations - Make card creation and linkage atomic
          console.log('🔍 TICKET-5: Starting atomic card creation and linkage');
          
          try {
            // Step 1: Add card to layout first to get the cardId
            const cardId = localAddCard('kpi-display', { x: 0, y: 0 });
            console.log('🔍 TICKET-5: Generated card ID:', cardId);
            
            // Step 2: Transform template data with the actual cardId
            const kpiData = transformTemplateToKpiData(template, cardId);
            
            // Step 3: Determine linkage
            const t: any = template as any;
            const isUserTemplate = (
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
            const linkage = isUserTemplate
              ? { user_kpi_id: (template as any).id }
              : { template_id: (template as any).id };

            // Step 4: Validate linkage
            if (!linkage.user_kpi_id && !linkage.template_id) {
              throw new Error('No valid linkage found for template');
            }

            // Step 5: Prepare server payload
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

            console.log('🔍 TICKET-5: Atomic operation prepared:', {
              cardId,
              linkage,
              serverPayload
            });

            // Step 6: Execute server operation with retry logic
            if (currentLayoutId) {
              let retryCount = 0;
              const maxRetries = 3;
              let lastError: any = null;

              while (retryCount < maxRetries) {
                try {
                  await enhancedApi.dashboardLayouts.upsertCard(currentLayoutId, serverPayload);
                  console.log('✅ TICKET-5: Server operation successful (attempt', retryCount + 1, ')');
                  break;
                } catch (err) {
                  lastError = err;
                  retryCount++;
                  console.warn(`⚠️ TICKET-5: Server retry ${retryCount}/${maxRetries} failed:`, err);
                  
                  if (retryCount < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
                  }
                }
              }

              if (retryCount >= maxRetries) {
                throw new Error(`Server operation failed after ${maxRetries} attempts: ${lastError?.message}`);
              }

              // Step 7: Store KPI data after successful server operation
              console.log('🔍 TICKET-5: Storing KPI data after successful server operation');
              setKpiData(prev => {
                const newKpiData = {
                  ...prev,
                  [cardId]: kpiData
                };
                console.log('🔍 TICKET-5: Updated KPI data with card ID:', cardId, 'KPI data:', newKpiData);
                return newKpiData;
              });

            console.log('✅ TICKET-5: Atomic operation completed successfully');
          } else {
            throw new Error('No currentLayoutId available for atomic operation');
          }

          // Step 8: Close the modal only after successful atomic operation
          console.log('📋 TICKET-5: Created KPI display card atomically, closing modal');
          setShowTemplateLibrary(false);

        } catch (error) {
          console.error('❌ TICKET-5: Atomic operation failed:', error);
          // Don't update any local state if server operation failed
          throw error;
        }
        }}
      />

    </div>
  );
}

