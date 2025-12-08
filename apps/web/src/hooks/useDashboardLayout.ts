import { useState, useEffect, useCallback, useRef } from 'react';
import { logger } from '@/utils/logger';
import { CARD_CONSTANTS } from '../routes/dashboard/utils/cardConstants';

export interface CardLayout {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  visible: boolean;
}

export interface DashboardLayout {
  cards: Record<string, CardLayout>;
  canvasHeight: number;
  theme: 'light' | 'dark';
  zoom?: number;
  pan?: { x: number; y: number };
  currentLayout?: 'grid' | 'dashboard' | 'sidebar' | 'custom';
}

interface UseDashboardLayoutReturn {
  layout: DashboardLayout;
  updateCardPosition: (cardId: string, x: number, y: number) => void;
  updateMultipleCardPositions: (updates: Array<{ cardId: string; x: number; y: number }>) => void;
  updateCardSize: (cardId: string, width: number, height: number) => void;
  addCard: (type: string, position?: { x: number; y: number }) => string;
  removeCard: (cardId: string) => void;
  resetLayout: () => void;
  autoArrangeCards: () => void;
  applyTemplate: (templateName: string) => void;
  saveLayout: () => void;
  loadLayout: () => void;
  loadLayoutFromData: (layoutData: DashboardLayout) => void;
  autoArrange: (mode: 'grid' | 'list' | 'compact') => void;
  setZoomAndPan: (zoom: number, pan: { x: number; y: number }) => void;
  getZoomAndPan: () => { zoom: number; pan: { x: number; y: number } };
  setCurrentLayout: (layout: 'grid' | 'dashboard' | 'sidebar' | 'custom') => void;
  // Undo/Redo functionality
  undo: () => boolean;
  redo: () => boolean;
  canUndo: boolean;
  canRedo: boolean;
  saveToHistory: () => void;
}

// Default card configurations optimized for productivity
const defaultCardSizes: Record<string, { width: number; height: number }> = {
  'dashboard-metrics': { width: 280, height: 180 },
  'smart-kpis': { width: 400, height: 280 },
  'smart-kpis-test': { width: 380, height: 260 },
  'smart-kpis-debug': { width: 360, height: 240 },
  'jobs-calendar': { width: 300, height: 220 },
  'recent-activity': { width: 260, height: 200 },
  'customer-search': { width: 260, height: 160 },
  'reports': { width: 280, height: 180 },
  'technician-dispatch': { width: 400, height: 500 },
  'invoices': { width: 400, height: 500 },
  'quick-actions': { width: 260, height: 160 },
  'kpi-builder': { width: 320, height: 240 },
  'predictive-analytics': { width: 300, height: 200 },
  'auto-layout': { width: 280, height: 180 },
  'routing': { width: 320, height: 240 },
  'team-overview': { width: 300, height: 200 },
  'financial-summary': { width: 280, height: 180 },
  'notifications': { width: 260, height: 160 },
  'kpi-display': { width: 320, height: 240 },
  'kpi-template': { width: 400, height: 300 },
  'customers-page': { width: 1200, height: 800 },
  'customers-page-minimized': { width: CARD_CONSTANTS.MINIMIZED.WIDTH, height: CARD_CONSTANTS.MINIMIZED.HEIGHT }
};

// Layout configuration optimized for FAB system integration
// Uses constants from CARD_CONSTANTS where applicable
const layoutConfig = {
  canvas: {
    minHeight: CARD_CONSTANTS.CANVAS.MIN_HEIGHT,
    padding: CARD_CONSTANTS.CANVAS.PADDING,
    autoExpandAmount: 150
  },
  cards: {
    minGap: CARD_CONSTANTS.DRAG.MIN_GAP,
    snapDistance: CARD_CONSTANTS.DRAG.SNAP_DISTANCE,
    headerOffset: 60, // Reduced for secondary nav bar
    sidebarOffset: 20, // Minimal since FAB system
    bottomOffset: CARD_CONSTANTS.CANVAS.BOTTOM_OFFSET // Space for FAB systems
  }
};

export function useDashboardLayout(): UseDashboardLayoutReturn {
  const [layout, setLayout] = useState<DashboardLayout>(() => {
    // Load saved layout or create default
    const saved = localStorage.getItem('verocards-v2-layout');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (_error) {
        logger.warn('Failed to load saved layout, using default', undefined, 'DashboardLayout');
      }
    }
    
    // Default layout - empty canvas with grid layout
    return {
      cards: {},
      canvasHeight: CARD_CONSTANTS.CANVAS.MIN_HEIGHT,
      theme: 'light',
      currentLayout: 'grid'
    };
  });

  // Save layout to localStorage
  const saveLayout = useCallback(() => {
    localStorage.setItem('verocards-v2-layout', JSON.stringify(layout));
  }, [layout]);

  // Undo/Redo system - simple implementation for DashboardLayout
  const [history, setHistory] = useState<DashboardLayout[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const maxHistorySize = CARD_CONSTANTS.UNDO_REDO?.MAX_HISTORY_SIZE || 50;

  // Simplified version using refs to avoid closure issues
  const historyRef = useRef<DashboardLayout[]>([]);
  const historyIndexRef = useRef(-1);
  
  const pushLayoutToHistoryRef = useCallback((layoutState: DashboardLayout) => {
    const clonedState = JSON.parse(JSON.stringify(layoutState));
    const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    newHistory.push(clonedState);
    if (newHistory.length > maxHistorySize) {
      newHistory.shift();
    }
    historyIndexRef.current = newHistory.length - 1;
    historyRef.current = newHistory;
    setHistory(newHistory);
    setHistoryIndex(historyIndexRef.current);
  }, [maxHistorySize]);

  // Use the ref-based version
  const pushLayoutToHistoryFinal = pushLayoutToHistoryRef;

  const undoLayout = useCallback((): DashboardLayout | null => {
    if (historyIndexRef.current <= 0) return null;
    historyIndexRef.current = historyIndexRef.current - 1;
    const result = historyRef.current[historyIndexRef.current] || null;
    setHistoryIndex(historyIndexRef.current);
    return result;
  }, []);

  const redoLayout = useCallback((): DashboardLayout | null => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return null;
    historyIndexRef.current = historyIndexRef.current + 1;
    const result = historyRef.current[historyIndexRef.current] || null;
    setHistoryIndex(historyIndexRef.current);
    return result;
  }, []);

  // Sync refs with state
  useEffect(() => {
    historyRef.current = history;
    historyIndexRef.current = historyIndex;
  }, [history, historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Undo operation
  const handleUndo = useCallback(() => {
    const previousLayout = undoLayout();
    if (previousLayout) {
      setLayout(previousLayout);
      return true;
    }
    return false;
  }, [undoLayout]);

  // Redo operation
  const handleRedo = useCallback(() => {
    const nextLayout = redoLayout();
    if (nextLayout) {
      setLayout(nextLayout);
      return true;
    }
    return false;
  }, [redoLayout]);

  // Auto-save on layout changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveLayout();
    }, 3000); // Debounced save to localStorage (not Redis)

    return () => clearTimeout(timeoutId);
  }, [layout, saveLayout]);

  // Update card position (without auto-history for drag operations)
  const updateCardPosition = useCallback((cardId: string, x: number, y: number) => {
    setLayout(prev => {
      const card = prev.cards[cardId];
      if (!card) return prev;

      const updatedCards = {
        ...prev.cards,
        [cardId]: {
          ...card,
          x: Math.max(layoutConfig.cards.minGap / 2, x), // Allow cards near edges
          y: Math.max(layoutConfig.cards.minGap / 2, y)  // Allow cards near edges
        }
      };

      // Calculate if canvas needs to expand
      const maxBottom = Math.max(
        ...Object.values(updatedCards).map(card => card.y + card.height)
      );
      const newCanvasHeight = Math.max(
        prev.canvasHeight,
        maxBottom + layoutConfig.cards.bottomOffset + layoutConfig.canvas.autoExpandAmount
      );

      return {
        ...prev,
        cards: updatedCards,
        canvasHeight: newCanvasHeight,
        currentLayout: 'custom' // Mark as custom when user moves cards
      };
    });
  }, []);

  // Save layout state to history (for meaningful actions)
  const saveToHistory = useCallback(() => {
    pushLayoutToHistoryFinal(layout);
  }, [layout, pushLayoutToHistoryFinal]);

  // Update multiple card positions (for multi-drag)
  const updateMultipleCardPositions = useCallback((updates: Array<{ cardId: string; x: number; y: number }>) => {
    setLayout(prev => {
      const updatedCards = { ...prev.cards };

      updates.forEach(({ cardId, x, y }) => {
        const card = updatedCards[cardId];
        if (card) {
          updatedCards[cardId] = {
            ...card,
            x: Math.max(layoutConfig.cards.minGap / 2, x), // Allow cards near edges
            y: Math.max(layoutConfig.cards.minGap / 2, y)  // Allow cards near edges
          };
        }
      });

      // Calculate if canvas needs to expand
      const maxBottom = Math.max(
        ...Object.values(updatedCards).map(card => card.y + card.height)
      );
      const newCanvasHeight = Math.max(
        prev.canvasHeight,
        maxBottom + layoutConfig.cards.bottomOffset + layoutConfig.canvas.autoExpandAmount
      );

      return {
        ...prev,
        cards: updatedCards,
        canvasHeight: newCanvasHeight
      };
    });
  }, []);

  // Update card size
  const updateCardSize = useCallback((cardId: string, width: number, height: number) => {
    setLayout(prev => {
      const card = prev.cards[cardId];
      if (!card) return prev;

      // Allow minimized size (200x140 or smaller) but enforce minimums for normal cards
      const isMinimizedSize = width <= 200 && height <= 140;
      const finalWidth = isMinimizedSize ? width : Math.max(200, width);
      const finalHeight = isMinimizedSize ? height : Math.max(120, height);

      return {
        ...prev,
        cards: {
          ...prev.cards,
          [cardId]: {
            ...card,
            width: finalWidth,
            height: finalHeight
          }
        }
      };
    });
  }, []);

  // Add new card
  const addCard = useCallback((type: string, position?: { x: number; y: number }) => {
    const cardId = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const defaultSize = defaultCardSizes[type] || { width: 280, height: 180 }; // Fallback size if not found
    
    setLayout(prev => {
      // Smart positioning - find empty space using current state
      const defaultPosition = position || findEmptySpace(prev.cards, defaultSize);
      
      return {
        ...prev,
        cards: {
          ...prev.cards,
          [cardId]: {
            id: cardId,
            x: defaultPosition.x,
            y: defaultPosition.y,
            width: defaultSize.width,
            height: defaultSize.height,
            type,
            visible: true
          }
        }
      };
    });

    // Save to history after adding card
    setTimeout(() => saveToHistory(), 100);

    return cardId;
  }, [saveToHistory]);

  // Remove card
  const removeCard = useCallback((cardId: string) => {
    setLayout(prev => {
      const newCards = { ...prev.cards };
      delete newCards[cardId];
      return {
        ...prev,
        cards: newCards
      };
    });

    // Save to history after removing card
    setTimeout(() => saveToHistory(), 100);
  }, [saveToHistory]);

  // Reset to default layout (empty canvas)
  const resetLayout = useCallback(() => {
    const resetLayout = {
      cards: {},
      canvasHeight: 600,
      theme: 'light' as const,
      zoom: 1,
      pan: { x: 0, y: 0 },
      currentLayout: 'custom' as const
    };
    
    setLayout(resetLayout);
    
    // Save the reset layout to localStorage
    try {
      localStorage.setItem('verocards-v2-layout', JSON.stringify(resetLayout));
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Layout reset and saved to localStorage', {}, 'useDashboardLayout');
      }
    } catch (error: unknown) {
      logger.error('Failed to save reset layout', error, 'useDashboardLayout');
    }
  }, []);

  // Auto-arrange cards
  const autoArrange = useCallback((mode: 'grid' | 'list' | 'compact') => {
    const cards = Object.values(layout.cards);
    const newCards: Record<string, CardLayout> = {};

    switch (mode) {
      case 'grid':
        // Arrange in grid pattern
        cards.forEach((card, index) => {
          const col = index % 4;
          const row = Math.floor(index / 4);
          newCards[card.id] = {
            ...card,
            x: layoutConfig.cards.sidebarOffset + (col * 300),
            y: layoutConfig.cards.headerOffset + (row * 240)
          };
        });
        break;
        
      case 'list':
        // Arrange in vertical list
        cards.forEach((card, index) => {
          newCards[card.id] = {
            ...card,
            x: layoutConfig.cards.sidebarOffset,
            y: layoutConfig.cards.headerOffset + (index * 200)
          };
        });
        break;
        
      case 'compact':
        // Arrange compactly to fit more cards
        cards.forEach((card, index) => {
          const col = index % 5;
          const row = Math.floor(index / 5);
          newCards[card.id] = {
            ...card,
            x: layoutConfig.cards.sidebarOffset + (col * 260),
            y: layoutConfig.cards.headerOffset + (row * 180),
            width: Math.min(card.width, 250),
            height: Math.min(card.height, 160)
          };
        });
        break;
    }

    setLayout(prev => ({
      ...prev,
      cards: newCards
    }));
  }, [layout.cards]);

  // Load layout from localStorage
  const loadLayout = useCallback(() => {
    const saved = localStorage.getItem('verocards-v2-layout');
    if (saved) {
      try {
        setLayout(JSON.parse(saved));
      } catch (error: unknown) {
        logger.warn('Failed to load layout', { error }, 'useDashboardLayout');
      }
    }
  }, []);

  // Load layout from provided data (for saved layouts)
  const loadLayoutFromData = useCallback((layoutData: DashboardLayout) => {
    setLayout(layoutData);
  }, []);

  // Set zoom and pan data in layout
  const setZoomAndPan = useCallback((zoom: number, pan: { x: number; y: number }) => {
    setLayout(prev => ({
      ...prev,
      zoom,
      pan
    }));
  }, []);

  // Get zoom and pan data from layout
  const getZoomAndPan = useCallback(() => {
    return {
      zoom: layout.zoom || 1,
      pan: layout.pan || { x: 0, y: 0 }
    };
  }, [layout.zoom, layout.pan]);

  // Apply template layout
  const applyTemplate = useCallback((templateName: string) => {
    const cardIds = Object.keys(layout.cards);
    if (cardIds.length === 0) return;

    const updatedCards = { ...layout.cards };
    const layoutType = templateName as 'grid' | 'dashboard' | 'sidebar';

    switch (templateName) {
      case 'dashboard':
        // Main metrics at top, supporting cards below
        cardIds.forEach((cardId, index) => {
          const card = updatedCards[cardId];
          if (!card) return;

          if (index === 0) {
            // Main dashboard metrics - large, centered
            updatedCards[cardId] = {
              ...card,
              x: 40, // Fixed position instead of sidebarOffset
              y: 40, // Fixed position instead of headerOffset
              width: 320,
              height: 200
            };
          } else {
            // Supporting cards in a row below
            const col = (index - 1) % 3;
            updatedCards[cardId] = {
              ...card,
              x: 40 + col * 280, // Fixed position instead of sidebarOffset
              y: 260,            // Fixed position instead of headerOffset + 240
              width: 260,
              height: 160
            };
          }
        });
        break;

      case 'sidebar':
        // Vertical stack on the left
        cardIds.forEach((cardId, index) => {
          const card = updatedCards[cardId];
          if (!card) return;

          updatedCards[cardId] = {
            ...card,
            x: 40, // Fixed position instead of sidebarOffset
            y: 40 + index * 200, // Fixed position instead of headerOffset
            width: 280,
            height: 180
          };
        });
        break;

      case 'grid':
        // Even grid layout
        const cols = 3;
        cardIds.forEach((cardId, index) => {
          const col = index % cols;
          const row = Math.floor(index / cols);
          const card = updatedCards[cardId];
          if (!card) return;
          
          updatedCards[cardId] = {
            ...card,
            x: 40 + col * 300, // Fixed position instead of sidebarOffset
            y: 40 + row * 200,  // Fixed position instead of headerOffset
            width: 280,
            height: 180
          };
        });
        break;
    }

    // Update canvas height
    const maxBottom = Math.max(
      ...Object.values(updatedCards).map(card => card.y + card.height)
    );
    const newCanvasHeight = Math.max(
      600,
      maxBottom + layoutConfig.cards.bottomOffset + layoutConfig.canvas.autoExpandAmount
    );

    setLayout(prev => ({ 
      ...prev, 
      cards: updatedCards,
      canvasHeight: newCanvasHeight,
      currentLayout: layoutType
    }));

    // Save to history after template application (meaningful action)
    setTimeout(() => saveToHistory(), 100);
  }, [layout.cards, saveToHistory]);

  // Auto-arrange cards using the last used layout
  const autoArrangeCards = useCallback(() => {
    const lastLayout = layout.currentLayout || 'grid';
    applyTemplate(lastLayout);
  }, [layout.currentLayout, applyTemplate]);

  // Set current layout
  const setCurrentLayout = useCallback((layoutType: 'grid' | 'dashboard' | 'sidebar' | 'custom') => {
    setLayout(prev => ({
      ...prev,
      currentLayout: layoutType
    }));
  }, []);

  return {
    layout,
    updateCardPosition,
    updateMultipleCardPositions,
    updateCardSize,
    addCard,
    removeCard,
    resetLayout,
    autoArrangeCards,
    applyTemplate,
    saveLayout,
    loadLayout,
    loadLayoutFromData,
    autoArrange,
    setZoomAndPan,
    getZoomAndPan,
    setCurrentLayout,
    // Undo/Redo functionality
    undo: handleUndo,
    redo: handleRedo,
    canUndo,
    canRedo,
    saveToHistory
  };
}

// Helper function to find empty space for new cards in grid pattern next to last card
function findEmptySpace(existingCards: Record<string, CardLayout>, cardSize: { width: number; height: number }, canvasWidth: number = 1200): { x: number; y: number } {
  const cards = Object.values(existingCards);
  const margin = 20;
  const maxX = canvasWidth - cardSize.width - margin - 100; // Extra margin for FAB systems
  
  // If no existing cards, start at the top-left
  if (cards.length === 0) {
    return { x: margin, y: margin };
  }
  
  // Calculate grid dimensions
  const colWidth = cardSize.width + margin;
  const rowHeight = cardSize.height + margin;
  const maxCols = Math.floor(maxX / colWidth);
  
  // Sort cards by position to find the last card in grid order
  const sortedCards = cards.sort((a, b) => {
    const aRow = Math.floor(a.y / rowHeight);
    const bRow = Math.floor(b.y / rowHeight);
    if (aRow !== bRow) return aRow - bRow;
    return Math.floor(a.x / colWidth) - Math.floor(b.x / colWidth);
  });
  
  // Find the last card's grid position
  const lastCard = sortedCards[sortedCards.length - 1];
  if (!lastCard) {
    return { x: margin, y: margin };
  }
  const lastRow = Math.floor(lastCard.y / rowHeight);
  const lastCol = Math.floor(lastCard.x / colWidth);
  
  // Try to place next to the last card
  let nextCol = lastCol + 1;
  let nextRow = lastRow;
  
  // If we've reached the end of the row, move to next row
  if (nextCol >= maxCols) {
    nextCol = 0;
    nextRow = lastRow + 1;
  }
  
  const x = margin + (nextCol * colWidth);
  const y = margin + (nextRow * rowHeight);
  
  // Check if this position is within bounds and doesn't overlap
  if (x + cardSize.width <= maxX) {
    const overlaps = cards.some(card => 
      x < card.x + card.width + layoutConfig.cards.minGap &&
      x + cardSize.width + layoutConfig.cards.minGap > card.x &&
      y < card.y + card.height + layoutConfig.cards.minGap &&
      y + cardSize.height + layoutConfig.cards.minGap > card.y
    );
    
    if (!overlaps) {
      return { x, y };
    }
  }
  
  // If the calculated position doesn't work, try the next available grid position
  for (let row = nextRow; row < nextRow + 5; row++) {
    for (let col = 0; col < maxCols; col++) {
      const gridX = margin + (col * colWidth);
      const gridY = margin + (row * rowHeight);
      
      if (gridX + cardSize.width > maxX) continue;
      
      const overlaps = cards.some(card => 
        gridX < card.x + card.width + layoutConfig.cards.minGap &&
        gridX + cardSize.width + layoutConfig.cards.minGap > card.x &&
        gridY < card.y + card.height + layoutConfig.cards.minGap &&
        gridY + cardSize.height + layoutConfig.cards.minGap > card.y
      );
      
      if (!overlaps) {
        return { x: gridX, y: gridY };
      }
    }
  }
  
  // Fallback to safe position within bounds
  const fallbackX = Math.min(margin, maxX);
  const fallbackY = margin;
  return { x: fallbackX, y: fallbackY };
}
