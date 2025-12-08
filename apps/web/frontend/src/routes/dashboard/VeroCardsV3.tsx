import { useCallback, useMemo, useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/stores/auth';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { useCardDragDrop } from '@/hooks/useCardDragDrop';
import { useCardResize } from '@/hooks/useCardResize';
import { useCardLocking } from '@/hooks/useCardLocking';
import { useCardGrouping } from '@/hooks/useCardGrouping';
import { useGroupDragDrop } from '@/hooks/useGroupDragDrop';
import { useZoomPan } from '@/hooks/useZoomPan';
import { useRealtimeCollaboration } from '@/hooks/useRealtimeCollaboration';
import { useSmartKPIs } from '@/hooks/useSmartKPIs';
import { useUserKpis } from '@/hooks/useKpiTemplates';
import { useVirtualScrolling } from '@/hooks/useVirtualScrolling';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';

// Local components and hooks
import {
  DashboardContent
} from './components';
import {
  useDashboardState,
  useModalManagement,
  useServerPersistence,
  useKpiManagement,
  useCardEventHandlers,
  useServerLayoutLoader,
  useDashboardKeyboardShortcuts,
  useTemplateLoading
} from './hooks';
import { useCanvasHeight } from './hooks/useCanvasHeight';
import { useAutoScroll } from './hooks/useAutoScroll';
import { useCardFocusScroll } from './hooks/useCardFocusScroll';

// Utilities and constants
import { getCardTypes } from './utils/cardTypes';
import { KPI_DATA_STORAGE_KEY } from './utils/constants';
import { useGridManager } from './hooks/useGridManager';
import { useErrorHandling } from './hooks/useErrorHandling';
import { useSyncStatus } from './hooks/useSyncStatus';
import { useCardInitialization } from './hooks/useCardInitialization';
import { useVeroCardsRender } from './VeroCardsV3Render';
import { TemplateErrorBoundary } from './components/TemplateErrorBoundary';
import { LoadingSpinner } from '@/components/LoadingSpinner';

type VeroCardsV3Props = {
  showHeader?: boolean;
};

export default function VeroCardsV3({ showHeader = true }: VeroCardsV3Props) {
  const { user } = useAuthStore();
  
  // Early returns must come before any other hooks
  if (!user) {
    return <LoadingSpinner />;
  }
  
  // Grid management and error handling
  const gridManager = useGridManager();
  const errorHandling = useErrorHandling();
  const syncStatus = useSyncStatus();
  
  // Custom hooks
  const dashboardState = useDashboardState();
  const modalManagement = useModalManagement();
  const { kpiData, setKpiData, processedKpisRef, loadServerLayoutData } = useKpiManagement();

  // Template loading and diagnostics
  const templateLoading = useTemplateLoading();
  
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

  const serverPersistence = useServerPersistence(
    localUpdateCardPosition,
    localUpdateCardSize,
    localAddCard,
    localRemoveCard,
    localUpdateMultipleCardPositions,
    loadLayoutFromData,
    layout,
    kpiData,
    setKpiData,
    KPI_DATA_STORAGE_KEY
  );

  // Other hooks
  const smartKPIs = useSmartKPIs();
  const { data: userKpis = [], isLoading: isUserKpisLoading, isError: isUserKpisError, status: userKpisStatus } = useUserKpis();
  
  const cardTypes = useMemo(() => getCardTypes(() => dashboardState.setShowKPIBuilder(true)), []);
  
  const virtualScrolling = useVirtualScrolling({
    itemHeight: 200,
    containerHeight: Math.max(600, layout.canvasHeight),
    overscan: 5,
    threshold: dashboardState.virtualScrollingThreshold
  });

  const keyboardNavigation = useKeyboardNavigation({
    cards: layout.cards,
    selectedCards: dashboardState.selectedCards,
    onSelectCard: (cardId, addToSelection) => {
      if (addToSelection) {
        dashboardState.setSelectedCards(prev => new Set([...prev, cardId]));
      } else {
        dashboardState.setSelectedCards(new Set([cardId]));
      }
    },
    onDeselectAll: dashboardState.handleDeselectAll,
    onFocusCard: () => {
      // Don't auto-scroll when focusing cards to prevent unwanted movement
      // The card focus scroll hook will handle scrolling when needed
    },
    onActivateCard: (cardId) => {
      dashboardState.setSelectedCards(prev => {
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
      const card = layout.cards[cardId];
      if (card) {
        serverPersistence.updateCardPosition(cardId, Math.max(0, card.x + deltaX), Math.max(0, card.y + deltaY));
      }
    },
    onResizeCard: (cardId, deltaWidth, deltaHeight) => {
      const card = layout.cards[cardId];
      if (card) {
        const newWidth = Math.max(100, Math.min(1600, card.width + deltaWidth));
        const newHeight = Math.max(100, Math.min(1000, card.height + deltaHeight));
        serverPersistence.updateCardSize(cardId, newWidth, newHeight);
      }
    },
    gridSize: 20,
    enableScreenReader: true
  });


  const { toggleCardLock, isCardLocked } = useCardLocking();
  const { containerRef, zoom, zoomIn, zoomOut, setZoom, setPan, resetView, handlePanStart, getTransformStyle, canZoomIn, canZoomOut, pan } = useZoomPan();
  
  // Handle custom events for card operations (extracted to hook)
  useCardEventHandlers({
    serverPersistence,
    localUpdateCardSize,
    localUpdateCardPosition,
    localRemoveCard,
    layout,
    gridManager,
    errorHandling,
    syncStatus,
    toggleCardLock,
    containerRef
  });
  
  // Separate ref for the scrollable container (dashboard-content)
  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  
  // Track dragging state for canvas height updates (initialized before useCardDragDrop)
  const [isDraggingForCanvas, setIsDraggingForCanvas] = useState(false);
  
  // Canvas height management (skip updates during drag to prevent bouncing)
  const { canvasHeight, updateCanvasHeight, scrollToCard } = useCanvasHeight({
    cards: layout.cards,
    minHeight: 600,
    padding: 20,
    autoExpandThreshold: 30,
    containerRef,
    enableAutoScroll: true,
    isDragging: isDraggingForCanvas
  });

  // Auto-scroll during drag operations with boundary detection
  // Use the canvas container directly for more efficient scrolling
  const { handleAutoScroll, stopAutoScroll } = useAutoScroll({
    containerRef: scrollableContainerRef, // Use scrollable container for proper auto-scroll
    scrollToCard,
    enableAutoScroll: true,
    scrollSpeed: 20, // Increased speed for more responsive scrolling
    boundaryZone: 100 // Increased boundary zone for earlier detection and smoother experience
  });

  // Auto-scroll to selected cards (independent of resizing)
  useCardFocusScroll({
    selectedCards: dashboardState.selectedCards,
    containerRef: scrollableContainerRef,
    enableAutoScroll: true,
    scrollDelay: 200
  });
  
  const { groups, selectedGroupId, setSelectedGroupId, updateGroup, deleteGroup, getCardGroup, ungroupCards, clearAllGroups, updateGroupBounds } = useCardGrouping((cardIds: string[]) => {
    cardIds.forEach(cardId => serverPersistence.removeCard(cardId));
  });
  const { handleGroupDragStart } = useGroupDragDrop({
    groups,
    onUpdateGroup: updateGroup,
    onUpdateMultipleCardPositions: serverPersistence.updateMultipleCardPositions,
    cards: layout.cards,
    zoom,
    canvasHeight: layout.canvasHeight,
    getCardGroup
  });
  const { isConnected: isCollabConnected, connectionStatus, collaborators, connect: connectCollab, disconnect: disconnectCollab } = useRealtimeCollaboration('dashboard-main', user);
  const { handleDragStart, isDragging, draggedCardId, isDraggingMultiple } = useCardDragDrop({
    onUpdatePosition: serverPersistence.updateCardPosition,
    onUpdateMultiplePositions: serverPersistence.updateMultipleCardPositions,
    cards: layout.cards,
    selectedCards: dashboardState.selectedCards,
    isCardLocked,
    getCardGroup,
    onDragEnd: () => {
      saveToHistory();
      // Disable drag mode for all cards after drag ends
      // Get all cards that were in drag mode or were being dragged
      const cardsToDisable = new Set([
        ...Array.from(dashboardState.dragModeCards),
        ...Array.from(dashboardState.selectedCards)
      ]);
      cardsToDisable.forEach(cardId => {
        dashboardState.setDragMode(cardId, false);
      });
    },
    zoom,
    canvasHeight: layout.canvasHeight,
    onAutoScroll: handleAutoScroll,
    onStopAutoScroll: stopAutoScroll
  });
  
  // Update canvas dragging state when drag state changes
  useEffect(() => {
    setIsDraggingForCanvas(isDragging || isDraggingMultiple);
    // When drag ends, update canvas height immediately
    if (!isDragging && !isDraggingMultiple) {
      updateCanvasHeight();
    }
  }, [isDragging, isDraggingMultiple, updateCanvasHeight]);
  
  const { handleResizeStart, resizingCardId } = useCardResize({
    onUpdateSize: serverPersistence.updateCardSize,
    cards: layout.cards,
    onResizeEnd: saveToHistory,
    getCardGroup,
    updateGroupBounds,
    getCardType: useCallback((cardId: string): string => layout.cards[cardId]?.type || 'unknown', [layout.cards]),
    onUpdatePosition: serverPersistence.updateCardPosition
  });

  // Initialize keyboard shortcuts (extracted to hook)
  const { shortcuts } = useDashboardKeyboardShortcuts({
    serverPersistence,
    dashboardState,
    layout,
    autoArrange,
    undo,
    redo
  });

  // Load server layout on mount (extracted to hook)
  useServerLayoutLoader({
    serverPersistence,
    loadServerLayoutData,
    loadLayoutFromData,
    setKpiData,
    processedKpisRef
  });

  // Initialize card positions using dedicated hook
  useCardInitialization({
    isLoadingLayout: serverPersistence.isLoadingLayout,
    cards: layout.cards,
    localUpdateCardSize,
    localUpdateCardPosition,
    serverUpdateCardSize: serverPersistence.updateCardSize,
    serverUpdateCardPosition: serverPersistence.updateCardPosition,
  });

  // Update canvas height when cards change
  useEffect(() => {
    updateCanvasHeight();
  }, [layout.cards, updateCanvasHeight]);

  // Render logic and event handlers
  const renderProps = {
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
    localAddCard,
    cardTypes,
    isDragging,
    isDraggingMultiple,
    draggedCardId,
    isCardLocked,
    getCardGroup,
    handleDragStart,
    toggleCardLock,
    resizingCardId,
    handleResizeStart,
    keyboardNavigation,
    clearAllGroups,
    resetLayout,
    groups,
    deleteGroup,
    loadLayoutFromData,
    setZoom,
    setPan
  };

  const {
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
  } = useVeroCardsRender(renderProps);

  if (serverPersistence.isLoadingLayout) {
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
    <TemplateErrorBoundary>
      <DashboardContent
        showHeader={showHeader}
        user={user}
        scrollableContainerRef={scrollableContainerRef}
        containerRef={containerRef}
        dashboardState={dashboardState}
        modalManagement={modalManagement}
        errorHandling={errorHandling}
        syncStatus={syncStatus}
        smartKPIs={smartKPIs}
        templateLoading={templateLoading}
        layout={layout}
        canvasHeight={canvasHeight}
        isCollabConnected={isCollabConnected}
        connectionStatus={connectionStatus}
        collaborators={Object.values(collaborators)}
        onToggleConnection={() => isCollabConnected ? disconnectCollab() : connectCollab()}
        autoArrange={autoArrange}
        applyTemplate={applyTemplate}
        autoArrangeCards={autoArrangeCards}
        undo={undo}
        redo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        zoom={zoom}
        pan={pan}
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        canZoomIn={canZoomIn}
        canZoomOut={canZoomOut}
        resetView={resetView}
        handleResetAll={handleResetAll}
        handleFullscreenToggle={handleFullscreenToggle}
        handleMobileNavigate={handleMobileNavigate}
        handleMobileSearch={handleMobileSearch}
        handleToggleMobileView={handleToggleMobileView}
        handleLoadPreset={handleLoadPreset}
        handleGroupDeleteConfirm={handleGroupDeleteConfirm}
        handlePanStart={handlePanStart}
        getTransformStyle={getTransformStyle}
        groups={groups}
        selectedGroupId={selectedGroupId}
        setSelectedGroupId={setSelectedGroupId}
        updateGroup={updateGroup}
        deleteGroup={deleteGroup}
        ungroupCards={ungroupCards}
        handleGroupDragStart={handleGroupDragStart}
        handleGroupDeleteRequest={handleGroupDeleteRequest}
        virtualScrolling={virtualScrolling}
        renderVirtualCard={renderVirtualCard}
        filteredCards={filteredCards}
        cardTypes={cardTypes}
        kpiData={kpiData}
        setKpiData={setKpiData}
        availableKpiFields={availableKpiFields}
        serverPersistence={serverPersistence}
        localAddCard={localAddCard}
        shortcuts={shortcuts}
      />
    </TemplateErrorBoundary>
  );
}
