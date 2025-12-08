import React, { useState, useRef } from 'react';
import {
  Settings,
  X,
  Plus,
  Maximize2,
  Minimize2,
  RotateCcw,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Save,
  Upload,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useClickAway } from '@/hooks/useClickAway';

interface DashboardFABProps {
  showCardSelector: boolean;
  setShowCardSelector: (show: boolean) => void;
  isCollabConnected: boolean;
  connectionStatus: string;
  collaborators: Array<{ id: string; name: string; avatar?: string }>;
  onToggleConnection: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  setShowLayoutManager: (show: boolean) => void;
  zoom: number;
  zoomIn: () => void;
  zoomOut: () => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
  resetView: () => void;
  cardsCount: number;
  handleResetAll: () => void;
  handleFullscreenToggle: () => void;
  isMobileFullscreen: boolean;
  onExportLayout?: () => void;
  onImportLayout?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DashboardFAB: React.FC<DashboardFABProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const fabRef = useRef<HTMLDivElement>(null);
  const settingsPanelRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    showCardSelector,
    setShowCardSelector,
    isCollabConnected,
    connectionStatus: _connectionStatus,
    collaborators: _collaborators,
    onToggleConnection,
    undo,
    redo,
    canUndo,
    canRedo,
    setShowLayoutManager: _setShowLayoutManager,
    zoom,
    zoomIn,
    zoomOut,
    canZoomIn,
    canZoomOut,
    resetView,
    cardsCount: _cardsCount,
    handleResetAll,
    handleFullscreenToggle,
    isMobileFullscreen,
    onExportLayout,
    onImportLayout
  } = props;

  const toggleFAB = () => {
    setIsOpen(!isOpen);
  };

  // Click away handlers
  useClickAway(fabRef, () => setIsOpen(false), [settingsPanelRef]);

  return (
    <>
      {/* FAB Button */}
      <div className="fixed top-4 left-4 z-50" ref={fabRef}>
        <button
          onClick={toggleFAB}
          className="w-12 h-12 bg-purple-500 hover:bg-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
          title="Dashboard Settings"
        >
          <Settings className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>


      {/* Settings Panel */}
      {isOpen && (
        <div className="fixed top-4 left-32 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-80 max-w-96" ref={settingsPanelRef}>
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Dashboard Settings</span>
            <button
              onClick={() => setIsOpen(false)}
              className="ml-auto text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Add Region Button */}
            <button
              onClick={() => setShowCardSelector(!showCardSelector)}
              className="w-full flex items-center gap-2 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Region
            </button>

            {/* Collaboration Status */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                {isCollabConnected ? (
                  <Wifi className="w-4 h-4 text-green-500" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-500" />
                )}
                <span className="text-xs text-gray-600">
                  {isCollabConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <button
                onClick={onToggleConnection}
                className="ml-auto text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
              >
                {isCollabConnected ? 'Disconnect' : 'Connect'}
              </button>
            </div>

            {/* Undo/Redo */}
            <div className="flex gap-2">
              <button
                onClick={undo}
                disabled={!canUndo}
                className="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <Undo className="w-4 h-4" />
                Undo
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                className="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <Redo className="w-4 h-4" />
                Redo
              </button>
            </div>

            {/* Export/Import Layout */}
            {onExportLayout && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600">Layout</label>
                <div className="flex gap-2">
                  <button
                    onClick={onExportLayout}
                    className="flex-1 flex items-center gap-1 px-2 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100 transition-colors text-xs"
                  >
                    <Save className="w-3 h-3" />
                    Export
                  </button>
                  <label className="flex-1 flex items-center gap-1 px-2 py-1.5 bg-green-50 text-green-600 border border-green-200 rounded hover:bg-green-100 transition-colors text-xs cursor-pointer">
                    <Upload className="w-3 h-3" />
                    Import
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={onImportLayout}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Zoom Controls */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600">Zoom: {Math.round(zoom * 100)}%</label>
              <div className="flex gap-1">
                <button
                  onClick={zoomOut}
                  disabled={!canZoomOut}
                  className="flex-1 flex items-center gap-1 px-2 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                >
                  <ZoomOut className="w-3 h-3" />
                  Zoom Out
                </button>
                <button
                  onClick={resetView}
                  className="flex-1 flex items-center gap-1 px-2 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-xs"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
                <button
                  onClick={zoomIn}
                  disabled={!canZoomIn}
                  className="flex-1 flex items-center gap-1 px-2 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                >
                  <ZoomIn className="w-3 h-3" />
                  Zoom In
                </button>
              </div>
            </div>


            {/* Reset All */}
            <button
              onClick={handleResetAll}
              className="w-full flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Reset All
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={handleFullscreenToggle}
              className="w-full flex items-center gap-2 px-3 py-2 bg-green-50 text-green-600 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-sm"
            >
              {isMobileFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
              {isMobileFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            </button>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
