import React, { useCallback, useMemo, useEffect, useRef } from 'react';
import { availableKpiFields } from './utils/constants';
import { createRenderVirtualCard } from './utils/renderHelpers';
import { normalizeKpiForDisplay } from './utils/cardHelpers';
import { AUTO_CREATE_FROM_USER_KPIS } from './utils/constants';

export const useVeroCardsRender = (props: any) => {
  const {
    layout,
    dashboardState,
    modalManagement,
    serverPersistence,
    kpiData,
    setKpiData,
    processedKpisRef,
    userKpis,
    userKpisStatus,
    isUserKpisLoading,
    isUserKpisError,
    cardTypes
  } = props;

  // Track current kpiData in a ref to avoid dependency issues
  const kpiDataRef = useRef(kpiData);
  const hasProcessedUserKpisRef = useRef(false);
  const lastUserKpisLengthRef = useRef<number>(0);
  const layoutCardsRef = useRef(layout.cards);
  const lastKpiDisplayCardCountRef = useRef<number>(0);
  const hasClearedEmptyKpisRef = useRef(false);

  // Keep refs in sync with state
  useEffect(() => {
    kpiDataRef.current = kpiData;
  }, [kpiData]);

  // Track layout.cards changes by counting KPI display cards (more stable than object reference)
  useEffect(() => {
    layoutCardsRef.current = layout.cards;
    const kpiDisplayCardCount = Object.values(layout.cards).filter((c: any) => c.type === 'kpi-display').length;
    lastKpiDisplayCardCountRef.current = kpiDisplayCardCount;
  }, [layout.cards]);

  // Rehydrate KPI data only if server failed to load
  useEffect(() => {
    if (serverPersistence.serverLoadSucceeded) return;
    try {
      const raw = localStorage.getItem('vero_kpi_data_v1');
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
    } catch (_e) { /* noop */ }
  }, [serverPersistence.serverLoadSucceeded, setKpiData]);

  // Load user KPIs into kpiData state when they become available
  useEffect(() => {
    if (isUserKpisLoading || isUserKpisError) {
      return;
    }
    
    // Reset processing flag if userKpis array length changed (new KPIs added/removed)
    const currentUserKpisLength = userKpis?.length || 0;
    if (currentUserKpisLength !== lastUserKpisLengthRef.current) {
      hasProcessedUserKpisRef.current = false;
      lastUserKpisLengthRef.current = currentUserKpisLength;
    }
    
    // Use ref to access layout.cards to avoid dependency on object reference
    const currentCards = layoutCardsRef.current;
    const existingKpiDisplayCards = Object.values(currentCards).filter((c: any) => c.type === 'kpi-display');
    const currentKpiDisplayCardCount = existingKpiDisplayCards.length;
    
    // Reset processing flag if KPI display card count changed
    if (currentKpiDisplayCardCount !== lastKpiDisplayCardCountRef.current) {
      hasProcessedUserKpisRef.current = false;
      lastKpiDisplayCardCountRef.current = currentKpiDisplayCardCount;
    }
    
    if (userKpis && userKpis.length > 0) {
      const hasExistingKpiData = Object.keys(kpiDataRef.current).length > 0;

      // If we've already processed these KPIs and data exists, don't process again
      if (hasProcessedUserKpisRef.current && hasExistingKpiData) {
        return;
      }

      if (existingKpiDisplayCards.length > 0 && !hasExistingKpiData) {
        const sortedCards = [...existingKpiDisplayCards].sort((a: any, b: any) => a.id.localeCompare(b.id));
        const mapped: Record<string, any> = {};
        sortedCards.forEach((card: any, index: number) => {
          const kpi = userKpis[index % userKpis.length];
          const display = normalizeKpiForDisplay(kpi);
          mapped[card.id] = display;
          if (display.id) {
            processedKpisRef.current.add(display.id);
          }
        });

        hasProcessedUserKpisRef.current = true;
        setKpiData(mapped);
        return;
      }

      if (existingKpiDisplayCards.length > 0 || hasExistingKpiData) {
        hasProcessedUserKpisRef.current = true;
        return;
      }
      
      const unprocessedKpis = userKpis.filter((kpi: any) => !processedKpisRef.current.has(kpi.id));
      
      if (unprocessedKpis.length === 0) {
        hasProcessedUserKpisRef.current = true;
        return;
      }
      if (!AUTO_CREATE_FROM_USER_KPIS) {
        hasProcessedUserKpisRef.current = true;
        return;
      }
      
      // Process unprocessed KPIs asynchronously
      (async () => {
        for (const kpi of unprocessedKpis) {
          const cardId = await serverPersistence.addCard('kpi-display', { x: 0, y: 0 });
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
          setKpiData((prev: any) => ({ ...prev, [cardId]: kpiDisplayData }));
          processedKpisRef.current.add(kpi.id);
        }
        hasProcessedUserKpisRef.current = true;
      })();
    } else if (userKpisStatus === 'success' && Array.isArray(userKpis) && userKpis.length === 0) {
      // Only clear once to prevent infinite loops
      if (!hasClearedEmptyKpisRef.current) {
        hasClearedEmptyKpisRef.current = true;
        setKpiData({});
        processedKpisRef.current.clear();
        hasProcessedUserKpisRef.current = false;
        lastUserKpisLengthRef.current = 0;
        lastKpiDisplayCardCountRef.current = 0;
      }
    } else {
      // Reset the cleared flag when userKpis has items again
      if (userKpis && userKpis.length > 0) {
        hasClearedEmptyKpisRef.current = false;
      }
    }
  }, [userKpis, userKpisStatus, isUserKpisLoading, isUserKpisError, serverPersistence.addCard, setKpiData]);

  // Event handlers
  const handleCardClick = useCallback((cardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (props.isDragging) return;

    // Clear search when a card is selected
    if (dashboardState.searchTerm.trim()) {
      dashboardState.setSearchTerm('');
    }

    if (e.ctrlKey || e.metaKey) {
      dashboardState.setSelectedCards((prev: Set<string>) => {
        const newSet = new Set(prev);
        if (newSet.has(cardId)) {
          newSet.delete(cardId);
        } else {
          newSet.add(cardId);
        }
        return newSet;
      });
    } else {
      dashboardState.setSelectedCards(new Set([cardId]));
    }
  }, [props.isDragging, dashboardState]);

  const handleResetAll = useCallback(() => {
    modalManagement.setConfirmModal({
      isOpen: true,
      title: 'Reset Dashboard',
      message: 'Reset dashboard and remove all groups? This cannot be undone.',
      type: 'danger',
      onConfirm: () => {
        props.clearAllGroups();
        props.resetLayout();
        setKpiData({});
        processedKpisRef.current.clear();
        try { localStorage.removeItem('vero_kpi_data_v1'); } catch {}
      }
    });
  }, [props.clearAllGroups, props.resetLayout]);

  const handleGroupDeleteRequest = useCallback((groupId: string) => {
    const group = props.groups[groupId];
    if (group) {
      modalManagement.setGroupDeleteModal({
        isOpen: true,
        groupId,
        groupName: group.name
      });
    }
  }, [props.groups]);

  const handleGroupDeleteConfirm = useCallback(() => {
    props.deleteGroup(modalManagement.groupDeleteModal.groupId);
    modalManagement.setGroupDeleteModal({
      isOpen: false,
      groupId: '',
      groupName: ''
    });
  }, [modalManagement.groupDeleteModal.groupId, props.deleteGroup]);

  const handleFullscreenToggle = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        dashboardState.setIsMobileFullscreen(true);
      }).catch(() => {});
    } else {
      document.exitFullscreen().then(() => {
        dashboardState.setIsMobileFullscreen(false);
      }).catch(() => {});
    }
  }, []);

  const handleMobileNavigate = useCallback((_page: string) => {
    // Handle navigation logic here
  }, []);

  const handleMobileSearch = useCallback((query: string) => {
    dashboardState.setSearchTerm(query);
  }, []);

  const handleToggleMobileView = useCallback((_view: 'grid' | 'list') => {
    // Handle view mode toggle logic here
  }, []);

  const handleLoadPreset = useCallback((presetLayout: any) => {
    const newLayout = {
      cards: presetLayout.cards || {},
      canvasHeight: presetLayout.canvasHeight || 600,
      theme: presetLayout.theme || 'light',
      zoom: presetLayout.zoom,
      pan: presetLayout.pan
    };
    
    props.loadLayoutFromData(newLayout);
    
    if (presetLayout.zoom !== undefined || presetLayout.pan !== undefined) {
      props.setZoom(presetLayout.zoom || 1);
      if (presetLayout.pan) {
        props.setPan(presetLayout.pan);
      }
    }
  }, [props.loadLayoutFromData, props.setZoom, props.setPan]);

  // Memoized filtered cards - now only for highlighting, not hiding
  const filteredCards = useMemo(() => {
    if (!dashboardState.searchTerm.trim()) {
      return [];
    }
    
    const term = dashboardState.searchTerm.toLowerCase();
    return Object.values(layout.cards).filter((card: any) => {
      // Search in card type name
      const cardType = cardTypes.find((t: any) => t.id === card.type);
      const cardName = cardType?.name || '';
      
      // Search in KPI data for kpi-display cards
      const cardKpiData = kpiData[card.id];
      const kpiName = cardKpiData?.name || '';
      const kpiDescription = cardKpiData?.description || '';
      const kpiCategory = cardKpiData?.category || '';
      
      // Search in all relevant fields
      return cardName.toLowerCase().includes(term) || 
             card.type.toLowerCase().includes(term) ||
             card.id.toLowerCase().includes(term) ||
             kpiName.toLowerCase().includes(term) ||
             kpiDescription.toLowerCase().includes(term) ||
             kpiCategory.toLowerCase().includes(term);
    });
  }, [layout.cards, dashboardState.searchTerm, cardTypes, kpiData]);

  // Auto-scroll to first matching card when search results change
  useEffect(() => {
    if (dashboardState.searchTerm.trim() && filteredCards.length > 0) {
      const firstCard = filteredCards[0] as any;
      if (firstCard) {
        // Small delay to ensure DOM has been updated with search highlighting
        const timeoutId = setTimeout(() => {
          // Find the card element in the DOM
          const cardElement = document.querySelector(`[data-card-id="${firstCard.id}"]`) as HTMLElement;
          if (cardElement) {
            // Scroll the card into view with smooth behavior
            cardElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'center'
            });
          }
        }, 100); // Small delay to ensure DOM updates

        return () => clearTimeout(timeoutId);
      }
    }
    return undefined;
  }, [filteredCards, dashboardState.searchTerm]);

  const renderVirtualCard = useMemo(() => 
    createRenderVirtualCard(
      dashboardState.selectedCards,
      props.isDraggingMultiple,
      props.draggedCardId,
      props.isCardLocked,
      props.getCardGroup,
      dashboardState.searchTerm,
      filteredCards,
      props.handleDragStart,
      handleCardClick,
      props.toggleCardLock,
      serverPersistence.removeCard,
      cardTypes,
      kpiData,
      dashboardState.setShowTemplateLibrary,
      props.resizingCardId,
      props.handleResizeStart,
      props.keyboardNavigation
    ), [
      dashboardState.selectedCards,
      props.isDraggingMultiple,
      props.draggedCardId,
      props.isCardLocked,
      props.getCardGroup,
      dashboardState.searchTerm,
      filteredCards,
      props.handleDragStart,
      handleCardClick,
      props.toggleCardLock,
      serverPersistence.removeCard,
      cardTypes,
      kpiData,
      dashboardState.setShowTemplateLibrary,
      props.resizingCardId,
      props.handleResizeStart,
      props.keyboardNavigation
    ]
  );

  return {
    handleCardClick,
    handleResetAll,
    handleGroupDeleteRequest,
    handleGroupDeleteConfirm,
    handleFullscreenToggle,
    handleMobileNavigate,
    handleMobileSearch,
    handleToggleMobileView,
    handleLoadPreset,
    filteredCards,
    renderVirtualCard,
    availableKpiFields
  };
};
