/**
 * DashboardContent Component
 * 
 * Encapsulates the main dashboard UI rendering including FAB, canvas, modals, and all UI elements.
 * Extracted from VeroCardsV3.tsx to improve maintainability and reduce file size.
 * 
 * Target: <300 lines
 */

import React, { RefObject } from 'react';
import { HelpCircle } from 'lucide-react';
import {
  DashboardCanvas,
  StatusBar,
  CardSelector,
  KeyboardShortcutsModal,
  DashboardFAB,
  ErrorDisplay
} from './index';
import LayoutManager from '@/components/dashboard/LayoutManager';
import { AlertDialog, ConfirmDialog, PromptDialog } from '@/components/ui/DialogModals';
import DrillDownModal from '@/components/dashboard/DrillDownModal';
import { MobileNavigation } from '@/components/dashboard/MobileNavigation';
import KPIBuilder from '@/components/kpi/KPIBuilder';
import KpiTemplateLibraryModal from '@/components/kpi/KpiTemplateLibraryModal';
import { TemplateLoadingIndicator } from './TemplateLoadingIndicator';
import { handleKpiBuilderUseTemplate, handleTemplateLibraryUseTemplate, handleKpiBuilderSave } from '../utils/kpiHandlers';
import { logger } from '@/utils/logger';
import {
  DashboardState,
  ErrorHandling,
  VirtualScrolling,
  TemplateLoading,
  Layout,
  Collaborator,
  CardType,
  Preset,
  KpiData,
  DashboardCard,
} from '../types';
import type { CardLayout } from '@/hooks/useDashboardLayout';
import { useModalManagement } from '../hooks/useModalManagement';
import type { CardGroup } from '@/hooks/useCardGrouping';
import type { useServerPersistence } from '../hooks/useServerPersistence';
import type { useSmartKPIs } from '@/hooks/useSmartKPIs';
import type { KeyboardShortcutsMap } from '@/hooks/useKeyboardShortcuts';

type ServerPersistence = ReturnType<typeof useServerPersistence>;
type SmartKPIsResult = ReturnType<typeof useSmartKPIs>;

export interface DashboardContentProps {
  // Layout toggles
  showHeader?: boolean;
  // User
  user: {
    name?: string;
    email?: string;
    avatar_url?: string;
  };
  
  // Refs
  scrollableContainerRef: RefObject<HTMLDivElement>;
  containerRef: RefObject<HTMLDivElement>;
  
  // State
  dashboardState: DashboardState;
  modalManagement: ReturnType<typeof useModalManagement>;
  errorHandling: ErrorHandling;
  syncStatus: {
    status: 'idle' | 'syncing' | 'synced' | 'error' | 'offline';
    lastSynced: Date | null;
    errorMessage: string | null;
  };
  smartKPIs: SmartKPIsResult;
  templateLoading: TemplateLoading;
  layout: Layout;
  canvasHeight: number;
  
  // Collaboration
  isCollabConnected: boolean;
  connectionStatus: string;
  collaborators: Collaborator[];
  onToggleConnection: () => void;
  
  // Actions
  applyTemplate: (template: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  zoom: number;
  pan: { x: number; y: number };
  zoomIn: () => void;
  zoomOut: () => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
  resetView: () => void;
  autoArrange: (mode: 'grid' | 'list' | 'compact') => void;
  autoArrangeCards: () => void;
  handleResetAll: () => void;
  handleFullscreenToggle: () => void;
  handleMobileNavigate: (page: string) => void;
  handleMobileSearch: (query: string) => void;
  handleToggleMobileView: (view?: 'grid' | 'list') => void;
  handleLoadPreset: (preset: Preset) => void;
  handleGroupDeleteConfirm: () => void;
  handlePanStart: (e: React.MouseEvent) => void;
  getTransformStyle: () => React.CSSProperties;
  
  // Groups
  groups: Record<string, CardGroup>;
  selectedGroupId: string | null;
  setSelectedGroupId: (id: string | null) => void;
  updateGroup: (groupId: string, updates: Partial<CardGroup>) => void;
  deleteGroup: (groupId: string) => void;
  ungroupCards: (groupId: string) => void;
  handleGroupDragStart: (groupId: string, e: React.MouseEvent) => void;
  handleGroupDeleteRequest: (groupId: string) => void;
  
  // Virtual scrolling
  virtualScrolling: VirtualScrolling;
  renderVirtualCard: (card: DashboardCard, index: number) => React.ReactNode;
  filteredCards: DashboardCard[];
  
  // Card types and data
  cardTypes: CardType[];
  kpiData: Record<string, KpiData>;
  setKpiData: (data: Record<string, KpiData>) => void;
  availableKpiFields: Array<{ id: string; name: string; type: string }>;
  
  // Server persistence
  serverPersistence: ServerPersistence;
  localAddCard: (type: string, position?: { x: number; y: number }) => string;
  
  // Shortcuts
  shortcuts: KeyboardShortcutsMap;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  showHeader = true,
  user,
  scrollableContainerRef,
  containerRef,
  dashboardState,
  modalManagement,
  errorHandling,
  syncStatus,
  smartKPIs,
  templateLoading,
  layout,
  canvasHeight,
  isCollabConnected,
  connectionStatus,
  collaborators,
  onToggleConnection,
  applyTemplate,
  undo,
  redo,
  canUndo,
  canRedo,
  zoom,
  pan,
  zoomIn,
  zoomOut,
  canZoomIn,
  canZoomOut,
  resetView,
  handleResetAll,
  handleFullscreenToggle,
  handleMobileNavigate,
  handleMobileSearch,
  handleToggleMobileView,
  handleLoadPreset,
  handleGroupDeleteConfirm,
  handlePanStart,
  getTransformStyle,
  groups,
  selectedGroupId,
  setSelectedGroupId,
  updateGroup,
  deleteGroup,
  ungroupCards,
  handleGroupDragStart,
  handleGroupDeleteRequest,
  virtualScrolling,
  renderVirtualCard,
  filteredCards,
  cardTypes,
  kpiData: _kpiData,
  setKpiData,
  availableKpiFields,
  serverPersistence,
  localAddCard,
  shortcuts
}) => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative flex flex-col">
      {/* Dashboard FAB - Always visible at top left */}
      {showHeader && (
        <DashboardFAB
          showCardSelector={dashboardState.showCardSelector}
          setShowCardSelector={dashboardState.setShowCardSelector}
          isCollabConnected={isCollabConnected}
          connectionStatus={connectionStatus}
          collaborators={collaborators.map(c => ({
            id: c.id,
            name: c.name,
            ...(c.avatar_url ? { avatar: c.avatar_url } : {})
          }))}
          onToggleConnection={onToggleConnection}
          undo={undo}
          redo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          setShowLayoutManager={dashboardState.setShowLayoutManager}
          zoom={zoom}
          zoomIn={zoomIn}
          zoomOut={zoomOut}
          canZoomIn={canZoomIn}
          canZoomOut={canZoomOut}
          resetView={resetView}
          cardsCount={Object.keys(layout.cards).length}
          handleResetAll={handleResetAll}
          handleFullscreenToggle={handleFullscreenToggle}
          isMobileFullscreen={dashboardState.isMobileFullscreen}
        />
      )}

      {/* Mobile Navigation */}
      {dashboardState.showMobileNavigation && (
        <MobileNavigation
          currentPage="dashboard"
          onNavigate={handleMobileNavigate}
          onSearch={handleMobileSearch}
          onToggleFullscreen={handleFullscreenToggle}
          isFullscreen={dashboardState.isMobileFullscreen}
          onToggleView={handleToggleMobileView}
          user={{
            name: user?.name || 'User',
            email: user?.email || 'user@example.com',
            ...(user?.avatar_url ? { avatar: user.avatar_url } : {})
          }}
          onLogout={() => {}}
        />
      )}

      {/* Dashboard Content */}
      <div 
        ref={scrollableContainerRef} 
        className="dashboard-content dashboard-scroll flex-1 overflow-hidden"
        style={{ minHeight: `${Math.max(600, canvasHeight)}px` }}
      >
        {/* Keyboard Shortcuts Help Button - Top Right */}
        {showHeader && (
          <div className="absolute top-4 right-4 z-40">
            <button
              onClick={() => dashboardState.setShowKeyboardHelp(true)}
              className="p-2 rounded-lg shadow-md transition-all duration-200 hover:scale-105 bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              title="Keyboard Shortcuts (?)"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="max-w-full mx-auto">
          <DashboardCanvas
            containerRef={containerRef}
            canvasHeight={canvasHeight}
            handleDeselectAll={dashboardState.handleDeselectAll}
            handlePanStart={handlePanStart}
            getTransformStyle={getTransformStyle}
            groups={groups}
            updateGroup={updateGroup}
            deleteGroup={deleteGroup}
            ungroupCards={ungroupCards}
            selectedGroupId={selectedGroupId}
            setSelectedGroupId={setSelectedGroupId}
            handleGroupDragStart={handleGroupDragStart}
            handleGroupDeleteRequest={handleGroupDeleteRequest}
            isVirtualScrolling={virtualScrolling.isVirtualScrolling}
            filteredCards={Object.values(layout.cards)}
            renderVirtualCard={renderVirtualCard}
            virtualScrollingThreshold={dashboardState.virtualScrollingThreshold}
            cardsLength={Object.keys(layout.cards).length}
            setShowCardSelector={dashboardState.setShowCardSelector}
          />

          {showHeader && (
            <StatusBar
              searchTerm={dashboardState.searchTerm}
              filteredCardsLength={filteredCards.length}
              totalCardsLength={Object.keys(layout.cards).length}
              isVirtualScrolling={virtualScrolling.isVirtualScrolling}
              virtualScrollingThreshold={dashboardState.virtualScrollingThreshold}
              currentLayout={layout.currentLayout || 'custom'}
              applyTemplate={applyTemplate}
              syncStatus={syncStatus.status}
              lastSynced={syncStatus.lastSynced}
              syncErrorMessage={syncStatus.errorMessage}
            />
          )}
        </div>

        {/* Error Display */}
        <ErrorDisplay
          errors={errorHandling.errors.map(err => ({
            id: err.id,
            message: err.message,
            operation: 'unknown',
            timestamp: err.timestamp,
            retryable: err.retryable || false,
            retryCount: 0
          }))}
          onDismiss={errorHandling.clearError}
          onRetry={(errorId) => {
            errorHandling.retryOperation(errorId);
          }}
        />

        <KeyboardShortcutsModal
          showKeyboardHelp={dashboardState.showKeyboardHelp}
          setShowKeyboardHelp={dashboardState.setShowKeyboardHelp}
          shortcuts={Object.entries(shortcuts).flatMap(([key, value]) => 
            value.keys.map(k => ({
              key: k,
              description: value.description,
              action: key,
              category: 'general'
            }))
          )}
        />

        <CardSelector
          showCardSelector={dashboardState.showCardSelector}
          setShowCardSelector={dashboardState.setShowCardSelector}
          cardTypes={cardTypes}
          handleAddCard={(type: string) => {
            serverPersistence.addCard(type).then((cardId: string) => {
              dashboardState.setSelectedCards(new Set([cardId]));
            });
          }}
        />

        <LayoutManager
          currentLayout={{
            cards: Object.fromEntries(
              Object.entries(layout.cards).map(([id, card]) => [
                id,
                {
                  id: card.id,
                  x: card.x,
                  y: card.y,
                  width: card.width,
                  height: card.height,
                  type: card.type,
                  visible: true
                }
              ])
            ) as Record<string, CardLayout>,
            canvasHeight,
            theme: 'light' as const,
            ...(layout.currentLayout ? { currentLayout: layout.currentLayout as 'grid' | 'dashboard' | 'sidebar' | 'custom' } : { currentLayout: 'custom' as const })
          }}
          currentZoom={zoom}
          currentPan={pan}
          isOpen={dashboardState.showLayoutManager}
          onClose={() => dashboardState.setShowLayoutManager(false)}
          onLoadLayout={(dashboardLayout) => {
            const layoutType = dashboardLayout.currentLayout || 'custom';
            handleLoadPreset({
              id: layoutType,
              name: layoutType === 'custom' ? 'Custom' : layoutType.charAt(0).toUpperCase() + layoutType.slice(1),
              layout: {
                cards: dashboardLayout.cards,
                currentLayout: layoutType as 'grid' | 'dashboard' | 'sidebar' | 'custom'
              }
            });
          }}
        />

        {/* Modals */}
        <AlertDialog
          open={modalManagement.alertModal.isOpen}
          onOpenChange={(open) => modalManagement.setAlertModal((prev: typeof modalManagement.alertModal) => ({ ...prev, isOpen: open }))}
          title={modalManagement.alertModal.title}
          message={modalManagement.alertModal.message}
          type={modalManagement.alertModal.type as 'info' | 'warning' | 'error' | 'success'}
        />
        
        <ConfirmDialog
          open={modalManagement.confirmModal.isOpen}
          onOpenChange={(open) => modalManagement.setConfirmModal((prev: typeof modalManagement.confirmModal) => ({ ...prev, isOpen: open }))}
          onConfirm={() => {
            if (modalManagement.confirmModal.onConfirm) {
              modalManagement.confirmModal.onConfirm();
            }
            modalManagement.setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          }}
          title={modalManagement.confirmModal.title}
          message={modalManagement.confirmModal.message}
          type={modalManagement.confirmModal.type as 'warning' | 'danger' | 'info'}
        />

        <PromptDialog
          open={modalManagement.promptModal.isOpen}
          onOpenChange={(open) => modalManagement.setPromptModal((prev: typeof modalManagement.promptModal) => ({ ...prev, isOpen: open }))}
          onConfirm={modalManagement.promptModal.onConfirm || ((_value: string) => {})}
          title={modalManagement.promptModal.title}
          message={modalManagement.promptModal.message}
          placeholder={modalManagement.promptModal.placeholder}
          defaultValue={modalManagement.promptModal.defaultValue}
        />

        <DrillDownModal
          isOpen={smartKPIs.isDrillDownOpen}
          onClose={() => smartKPIs.setIsDrillDownOpen(false)}
          kpi={smartKPIs.selectedKPI ? {
            id: smartKPIs.selectedKPI.id,
            metric: smartKPIs.selectedKPI.metric,
            value: 0,
            threshold: {
              green: smartKPIs.selectedKPI.threshold.green,
              yellow: smartKPIs.selectedKPI.threshold.yellow,
              red: smartKPIs.selectedKPI.threshold.yellow * 1.5,
              unit: smartKPIs.selectedKPI.threshold.unit ?? ''
            },
            trend: 'stable' as const,
            lastUpdated: new Date().toISOString(),
            category: (smartKPIs.selectedKPI.category as 'financial' | 'operational' | 'customer' | 'compliance') || 'operational',
            realTime: smartKPIs.selectedKPI.realTime ?? false
          } : null}
          data={smartKPIs.drillDownData || {}}
        />

        <ConfirmDialog
          open={modalManagement.groupDeleteModal.isOpen}
          onOpenChange={(open) => modalManagement.setGroupDeleteModal((prev: typeof modalManagement.groupDeleteModal) => ({ ...prev, isOpen: open }))}
          onConfirm={handleGroupDeleteConfirm}
          title="Delete Group"
          message={`Delete group "${modalManagement.groupDeleteModal.groupName}" and all cards inside?`}
          type="danger"
          confirmText="Delete"
          cancelText="Cancel"
        />

        <KPIBuilder
          isOpen={dashboardState.showKPIBuilder}
          onClose={() => dashboardState.setShowKPIBuilder(false)}
          isEditingTemplate={false}
          onSaveTemplate={async (_template) => {}}
          onUseTemplate={async (template) => {
            try {
              await handleKpiBuilderUseTemplate(
                template,
                localAddCard,
                serverPersistence.currentLayoutId,
                (data: Record<string, any>) => setKpiData(data as Record<string, KpiData>),
                dashboardState.setShowKPIBuilder
              );
            } catch (error) {
              logger.error('Failed to use KPI builder template', error as Error, 'DashboardContent');
            }
          }}
          onSave={async (kpi) => {
            try {
              await handleKpiBuilderSave(
                kpi,
                serverPersistence.addCard,
                serverPersistence.currentLayoutId,
                (data: Record<string, any>) => setKpiData(data as Record<string, KpiData>),
                dashboardState.setShowKPIBuilder
              );
            } catch (error) {
              logger.error('Failed to save KPI', error as Error, 'DashboardContent');
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
          availableFields={availableKpiFields.map(field => ({
            id: field.id,
            name: field.name,
            type: field.type as 'number' | 'text' | 'date' | 'boolean',
            table: '',
            column: ''
          }))}
        />

        <KpiTemplateLibraryModal
          isOpen={(dashboardState as any).showTemplateLibrary || false}
          onClose={() => {
            if ((dashboardState as any).setShowTemplateLibrary) {
              (dashboardState as any).setShowTemplateLibrary(false);
            }
          }}
          onUseTemplate={async (template) => {
            try {
              await handleTemplateLibraryUseTemplate(
                template,
                localAddCard,
                serverPersistence.currentLayoutId,
                (data: Record<string, any>) => setKpiData(data as Record<string, KpiData>),
                (dashboardState as any).setShowTemplateLibrary || (() => {})
              );
            } catch (error) {
              logger.error('Failed to use KPI template library item', error as Error, 'DashboardContent');
            }
          }}
        />

        {/* Template Loading Indicator */}
        <TemplateLoadingIndicator
          isLoading={templateLoading.isLoading}
          error={(templateLoading as any).error || null}
          templatesCount={(templateLoading as any).templates?.length || 0}
          onRetry={(templateLoading as any).retry || (() => {})}
          onDismiss={(templateLoading as any).clearError || (() => {})}
          canRetry={(templateLoading as any).canRetry || false}
          autoHideDelay={4000}
        />
      </div>
    </div>
  );
};

