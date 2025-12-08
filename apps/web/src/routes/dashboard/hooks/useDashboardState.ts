import { useState, useEffect, useCallback } from 'react';

export const useDashboardState = () => {
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [dragModeCards, setDragModeCards] = useState<Set<string>>(new Set());
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [showCardSelector, setShowCardSelector] = useState(false);
  const [showLayoutManager, setShowLayoutManager] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [useVirtualScrollingEnabled, setUseVirtualScrollingEnabled] = useState(false);
  const [virtualScrollingThreshold, setVirtualScrollingThreshold] = useState(100);
  const [isMobileFullscreen, setIsMobileFullscreen] = useState(false);
  const [showMobileNavigation, setShowMobileNavigation] = useState(false);
  const [showKPIBuilder, setShowKPIBuilder] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);

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

  const handleDeselectAll = useCallback(() => {
    setSelectedCards(new Set());
  }, []);

  const handleSelectAll = useCallback((cardIds: string[]) => {
    setSelectedCards(new Set(cardIds));
  }, []);

  const toggleDragMode = useCallback((cardId: string) => {
    setDragModeCards(prev => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      return next;
    });
  }, []);

  const setDragMode = useCallback((cardId: string, enabled: boolean) => {
    setDragModeCards(prev => {
      const next = new Set(prev);
      if (enabled) {
        next.add(cardId);
      } else {
        next.delete(cardId);
      }
      return next;
    });
  }, []);

  return {
    selectedCards,
    setSelectedCards,
    dragModeCards,
    toggleDragMode,
    setDragMode,
    showKeyboardHelp,
    setShowKeyboardHelp,
    showCardSelector,
    setShowCardSelector,
    showLayoutManager,
    setShowLayoutManager,
    searchTerm,
    setSearchTerm,
    useVirtualScrollingEnabled,
    setUseVirtualScrollingEnabled,
    virtualScrollingThreshold,
    setVirtualScrollingThreshold,
    isMobileFullscreen,
    setIsMobileFullscreen,
    showMobileNavigation,
    setShowMobileNavigation,
    showKPIBuilder,
    setShowKPIBuilder,
    showTemplateLibrary,
    setShowTemplateLibrary,
    handleDeselectAll,
    handleSelectAll
  };
};




