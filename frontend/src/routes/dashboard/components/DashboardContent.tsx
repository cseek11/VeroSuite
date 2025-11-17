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
import {
  DashboardState,
  ErrorHandling,
  VirtualScrolling,
  SmartKPIs,
  TemplateLoading,
  Layout,
  Collaborator,
  CardType,
  Group,
  Preset,
  KeyboardShortcuts,
  KpiData,
  DashboardCard,
} from '../types';
import { ReturnType } from '../hooks/useModalManagement';

export interface DashboardContentProps {
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
  smartKPIs: SmartKPIs;
  templateLoading: TemplateLoading;
  layout: Layout;
  canvasHeight: number;
  
  // Collaboration
  isCollabConnected: boolean;
  connectionStatus: string;
  collaborators: Collaborator[];
  onToggleConnection: () => void;
  
  // Actions
  autoArrange: (type: 'grid' | 'list' | 'compact') => void;
  applyTemplate: (template: string) => void;
  autoArrangeCards: () => void;
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
  handleResetAll: () => void;
  handleFullscreenToggle: () => void;
  handleMobileNavigate: (page: string) => void;
  handleMobileSearch: (query: string) => void;
  handleToggleMobileView: () => void;
  handleLoadPreset: (preset: Preset) => void;
  handleGroupDeleteConfirm: () => void;
  handlePanStart: (e: React.MouseEvent) => void;
  getTransformStyle: () => React.CSSProperties;
  
  // Groups
  groups: Record<string, Group>;
  selectedGroupId: string | null;
  setSelectedGroupId: (id: string | null) => void;
  updateGroup: (groupId: string, updates: Partial<Group>) => void;
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
  serverPersistence: {
    addCard: (type: string) => Promise<string>;
    currentLayoutId: string;
  };
  localAddCard: (type: string, position?: { x: number; y: number }) => string;
  
  // Shortcuts
  shortcuts: KeyboardShortcuts;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
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
  autoArrange,
  applyTemplate,
  autoArrangeCards,
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
      <DashboardFAB
        showCardSelector={dashboardState.showCardSelector}
        setShowCardSelector={dashboardState.setShowCardSelector}
        isCollabConnected={isCollabConnected}
        connectionStatus={connectionStatus}
        collaborators={collaborators}
        onToggleConnection={onToggleConnection}
        autoArrange={(type: string) => autoArrange(type as 'grid' | 'list' | 'compact')}
        applyTemplate={applyTemplate}
        autoArrangeCards={autoArrangeCards}
        undo={undo}
        redo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        searchTerm={dashboardState.searchTerm}
        setSearchTerm={dashboardState.setSearchTerm}
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
            avatar: user?.avatar_url
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
        <div className="absolute top-4 right-4 z-40">
          <button
            onClick={() => dashboardState.setShowKeyboardHelp(true)}
            className="p-2 rounded-lg shadow-md transition-all duration-200 hover:scale-105 bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            title="Keyboard Shortcuts (?)"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

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
        </div>

        {/* Error Display */}
        <ErrorDisplay
          errors={errorHandling.errors}
          onDismiss={errorHandling.clearError}
          onRetry={(errorId) => {
            errorHandling.retryOperation(errorId);
          }}
        />

        <KeyboardShortcutsModal
          showKeyboardHelp={dashboardState.showKeyboardHelp}
          setShowKeyboardHelp={dashboardState.setShowKeyboardHelp}
          shortcuts={shortcuts}
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
          currentLayout={layout}
          currentZoom={zoom}
          currentPan={pan}
          isOpen={dashboardState.showLayoutManager}
          onClose={() => dashboardState.setShowLayoutManager(false)}
          onLoadLayout={handleLoadPreset}
        />

        {/* Modals */}
        <AlertDialog
          open={modalManagement.alertModal.isOpen}
          onOpenChange={(open) => modalManagement.setAlertModal((prev) => ({ ...prev, isOpen: open }))}
          title={modalManagement.alertModal.title}
          message={modalManagement.alertModal.message}
          type={modalManagement.alertModal.type as 'info' | 'warning' | 'error' | 'success'}
        />
        
        <ConfirmDialog
          open={modalManagement.confirmModal.isOpen}
          onOpenChange={(open) => modalManagement.setConfirmModal((prev) => ({ ...prev, isOpen: open }))}
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
          onOpenChange={(open) => modalManagement.setPromptModal((prev) => ({ ...prev, isOpen: open }))}
          onConfirm={modalManagement.promptModal.onConfirm || ((_value: string) => {})}
          title={modalManagement.promptModal.title}
          message={modalManagement.promptModal.message}
          placeholder={modalManagement.promptModal.placeholder}
          defaultValue={modalManagement.promptModal.defaultValue}
        />

        <DrillDownModal
          isOpen={smartKPIs.isDrillDownOpen}
          onClose={() => smartKPIs.setIsDrillDownOpen(false)}
          kpi={smartKPIs.selectedKPI}
          data={smartKPIs.drillDownData}
        />

        <ConfirmDialog
          open={modalManagement.groupDeleteModal.isOpen}
          onOpenChange={(open) => modalManagement.setGroupDeleteModal((prev) => ({ ...prev, isOpen: open }))}
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
            await handleKpiBuilderUseTemplate(
              template,
              localAddCard,
              serverPersistence.currentLayoutId,
              setKpiData,
              dashboardState.setShowKPIBuilder
            );
          }}
          onSave={async (kpi) => {
            await handleKpiBuilderSave(
              kpi,
              serverPersistence.addCard,
              serverPersistence.currentLayoutId,
              setKpiData,
              dashboardState.setShowKPIBuilder
            );
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
          availableFields={availableKpiFields}
        />

        <KpiTemplateLibraryModal
          isOpen={dashboardState.showTemplateLibrary}
          onClose={() => dashboardState.setShowTemplateLibrary(false)}
          onUseTemplate={async (template) => {
            await handleTemplateLibraryUseTemplate(
              template,
              localAddCard,
              serverPersistence.currentLayoutId,
              setKpiData,
              dashboardState.setShowTemplateLibrary
            );
          }}
        />

        {/* Template Loading Indicator */}
        <TemplateLoadingIndicator
          isLoading={templateLoading.isLoading}
          error={templateLoading.error}
          templatesCount={templateLoading.templates.length}
          onRetry={templateLoading.retry}
          onDismiss={templateLoading.clearError}
          canRetry={templateLoading.canRetry}
          autoHideDelay={4000}
        />
      </div>
    </div>
  );
};

