import React from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { KpiDisplayCard } from '@/components/cards';
import { CardContainer } from '../components/CardContainer';
import { logger } from '@/utils/logger';
import { DashboardCard, CardType, KpiData } from '../types';

export const renderCardComponent = (
  card: DashboardCard,
  cardTypes: CardType[],
  kpiData: Record<string, KpiData>,
  setShowTemplateLibrary: (show: boolean) => void
) => {
  try {
    // Debug logging for new card types
    if (card.type === 'technician-dispatch' || card.type === 'invoices') {
      const foundCardType = cardTypes.find(t => t.id === card.type);
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Rendering card', {
          type: card.type,
          cardId: card.id,
          availableTypes: cardTypes.map(t => t.id),
          hasCardType: !!foundCardType,
          hasComponent: !!foundCardType?.component,
          componentType: typeof foundCardType?.component,
          cardTypeObject: foundCardType
        }, 'renderHelpers');
      }
    }
    
    const cardType = cardTypes.find(type => type.id === card.type);
    
    if (!cardType) {
      logger.warn('Card type not found', {
        cardType: card.type,
        availableTypes: cardTypes.map(t => t.id),
        cardId: card.id
      }, 'renderHelpers');
      return <div className="p-4 text-red-600">Card type "{card.type}" not found</div>;
    }
    
    const CardComponent = cardType.component;
    
    if (!CardComponent) {
      logger.warn('Card component not found for type', {
        cardType: card.type,
        cardTypeObject: cardType,
        cardId: card.id
      }, 'renderHelpers');
      return <div className="p-4 text-red-600">Component not found for "{card.type}"</div>;
    }
    
    // Handle special kpi-display case
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
      return React.createElement(CardComponent as React.ComponentType<{ cardId: string; onOpenTemplateLibrary: () => void }>, { 
        cardId: card.id, 
        onOpenTemplateLibrary: () => setShowTemplateLibrary(true) 
      });
    }
    
    // Pass cardId to all components that accept it
    if (typeof CardComponent === 'function') {
      try {
        const renderedComponent = React.createElement(CardComponent as React.ComponentType<{ cardId: string }>, { cardId: card.id });
        
        // Debug logging for new card types
        if (card.type === 'technician-dispatch' || card.type === 'invoices') {
          if (process.env.NODE_ENV === 'development') {
            const componentName = React.isValidElement(renderedComponent) && renderedComponent.type 
              ? (typeof renderedComponent.type === 'function' ? renderedComponent.type.name : String(renderedComponent.type))
              : 'unknown';
            logger.debug('Component rendered successfully', {
              type: card.type,
              cardId: card.id,
              componentType: typeof renderedComponent,
              componentName,
              isReactElement: React.isValidElement(renderedComponent)
            }, 'renderHelpers');
          }
        }
        
        return renderedComponent;
      } catch (error: unknown) {
        logger.error('Error rendering card component', { cardType: card.type, error }, 'renderHelpers');
        return (
          <div className="p-4 text-red-600">
            <p className="font-semibold">Error rendering card: {card.type}</p>
            <p className="text-sm mt-1">{error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>
        );
      }
    }
    
    return React.createElement(CardComponent as React.ComponentType);
  } catch (error: unknown) {
    logger.error('Error in renderCardComponent', { error, cardType: card.type, cardId: card.id }, 'renderHelpers');
    return (
      <div className="p-4 text-red-600 border border-red-300 rounded">
        <p className="font-semibold">Failed to render card</p>
        <p className="text-sm mt-1">Type: {card.type}</p>
        <p className="text-xs mt-1 text-gray-500">{error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }
};

export const createRenderVirtualCard = (
  selectedCards: Set<string>,
  isDraggingMultiple: boolean,
  draggedCardId: string | null,
  isCardLocked: (cardId: string) => boolean,
  getCardGroup: (cardId: string) => { id: string; name: string; cards: DashboardCard[] } | null,
  searchTerm: string,
  filteredCards: DashboardCard[],
  handleDragStart: (cardId: string, e: React.MouseEvent) => void,
  handleCardClick: (cardId: string, e: React.MouseEvent) => void,
  toggleCardLock: (cardId: string) => void,
  removeCard: (cardId: string) => void,
  cardTypes: CardType[],
  kpiData: Record<string, KpiData>,
  setShowTemplateLibrary: (show: boolean) => void,
  resizingCardId: string | null,
  handleResizeStart: (cardId: string, handle: string, e: React.MouseEvent) => void,
  keyboardNavigation: { focusedCardId: string | null; isNavigating: boolean; navigationMode: 'arrow' | 'tab'; navigateToCard: (cardId: string) => void }
) => {
  return (card: DashboardCard, _index: number) => {
    const cardGroup = getCardGroup(card.id);
    const isInFilteredResults = filteredCards.some(c => c.id === card.id);
    
    // Handle minimize/expand/restore events
    const handleMinimize = (cardId: string, cardType: string) => {
      window.dispatchEvent(new CustomEvent('minimizeCard', {
        detail: { cardId, cardType, minimize: true }
      }));
    };
    
    const handleExpand = (cardId: string, cardType: string) => {
      window.dispatchEvent(new CustomEvent('expandCard', {
        detail: { cardId, cardType, expand: true }
      }));
    };
    
    const handleRestore = (cardId: string, cardType: string, originalSize: { width: number; height: number }, originalPosition: { x: number; y: number }) => {
      window.dispatchEvent(new CustomEvent('restoreCard', {
        detail: { 
          cardId,
          cardType,
          restore: true,
          originalSize,
          originalPosition
        }
      }));
    };
    
    const navigationMode: 'resize' | 'select' | 'move' = (
      ['resize', 'select', 'move'] as const
    ).includes(keyboardNavigation.navigationMode as any)
      ? (keyboardNavigation.navigationMode as 'resize' | 'select' | 'move')
      : 'select';

    return (
      <CardContainer
        key={card.id}
        card={card}
        isSelected={selectedCards.has(card.id)}
        isDragging={draggedCardId === card.id}
        isDraggingMultiple={isDraggingMultiple && selectedCards.has(card.id)}
        isLocked={isCardLocked(card.id)}
        isResizing={resizingCardId === card.id}
        isFocused={keyboardNavigation.focusedCardId === card.id}
        isNavigating={keyboardNavigation.isNavigating}
        navigationMode={navigationMode}
        searchTerm={searchTerm}
        isInFilteredResults={isInFilteredResults}
        cardGroup={cardGroup}
        cardTypes={cardTypes}
        kpiData={kpiData}
        onDragStart={handleDragStart}
        onClick={handleCardClick}
        onFocus={(cardId) => keyboardNavigation.navigateToCard(cardId)}
        onToggleLock={toggleCardLock}
        onRemove={removeCard}
        onResizeStart={handleResizeStart}
        onMinimize={handleMinimize}
        onExpand={handleExpand}
        onRestore={handleRestore}
        setShowTemplateLibrary={setShowTemplateLibrary}
      />
    );
  };
};
