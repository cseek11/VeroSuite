"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRenderVirtualCard = exports.renderCardComponent = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importDefault(require("react"));
var LoadingSpinner_1 = require("@/components/LoadingSpinner");
var cards_1 = require("@/components/cards");
var CardContainer_1 = require("../components/CardContainer");
var logger_1 = require("@/utils/logger");
var renderCardComponent = function (card, cardTypes, kpiData, setShowTemplateLibrary) {
    try {
        // Debug logging for new card types
        if (card.type === 'technician-dispatch' || card.type === 'invoices') {
            var foundCardType = cardTypes.find(function (t) { return t.id === card.type; });
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('Rendering card', {
                    type: card.type,
                    cardId: card.id,
                    availableTypes: cardTypes.map(function (t) { return t.id; }),
                    hasCardType: !!foundCardType,
                    hasComponent: !!(foundCardType === null || foundCardType === void 0 ? void 0 : foundCardType.component),
                    componentType: typeof (foundCardType === null || foundCardType === void 0 ? void 0 : foundCardType.component),
                    cardTypeObject: foundCardType
                }, 'renderHelpers');
            }
        }
        var cardType = cardTypes.find(function (type) { return type.id === card.type; });
        if (!cardType) {
            logger_1.logger.warn('Card type not found', {
                cardType: card.type,
                availableTypes: cardTypes.map(function (t) { return t.id; }),
                cardId: card.id
            }, 'renderHelpers');
            return (0, jsx_runtime_1.jsxs)("div", { className: "p-4 text-red-600", children: ["Card type \"", card.type, "\" not found"] });
        }
        var CardComponent = cardType.component;
        if (!CardComponent) {
            logger_1.logger.warn('Card component not found for type', {
                cardType: card.type,
                cardTypeObject: cardType,
                cardId: card.id
            }, 'renderHelpers');
            return (0, jsx_runtime_1.jsxs)("div", { className: "p-4 text-red-600", children: ["Component not found for \"", card.type, "\""] });
        }
        // Handle special kpi-display case
        if (card.type === 'kpi-display') {
            if (!kpiData[card.id]) {
                return ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full flex items-center justify-center text-gray-400", children: (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, {}) }));
            }
            return (0, jsx_runtime_1.jsx)(cards_1.KpiDisplayCard, { cardId: card.id, kpiData: kpiData });
        }
        if (card.type === 'kpi-template' && typeof CardComponent === 'function') {
            return react_1.default.createElement(CardComponent, {
                cardId: card.id,
                onOpenTemplateLibrary: function () { return setShowTemplateLibrary(true); }
            });
        }
        // Pass cardId to all components that accept it
        if (typeof CardComponent === 'function') {
            try {
                var renderedComponent = react_1.default.createElement(CardComponent, { cardId: card.id });
                // Debug logging for new card types
                if (card.type === 'technician-dispatch' || card.type === 'invoices') {
                    if (process.env.NODE_ENV === 'development') {
                        var componentName = react_1.default.isValidElement(renderedComponent) && renderedComponent.type
                            ? (typeof renderedComponent.type === 'function' ? renderedComponent.type.name : String(renderedComponent.type))
                            : 'unknown';
                        logger_1.logger.debug('Component rendered successfully', {
                            type: card.type,
                            cardId: card.id,
                            componentType: typeof renderedComponent,
                            componentName: componentName,
                            isReactElement: react_1.default.isValidElement(renderedComponent)
                        }, 'renderHelpers');
                    }
                }
                return renderedComponent;
            }
            catch (error) {
                logger_1.logger.error('Error rendering card component', { cardType: card.type, error: error }, 'renderHelpers');
                return ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 text-red-600", children: [(0, jsx_runtime_1.jsxs)("p", { className: "font-semibold", children: ["Error rendering card: ", card.type] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm mt-1", children: error instanceof Error ? error.message : 'Unknown error' })] }));
            }
        }
        return react_1.default.createElement(CardComponent);
    }
    catch (error) {
        logger_1.logger.error('Error in renderCardComponent', { error: error, cardType: card.type, cardId: card.id }, 'renderHelpers');
        return ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 text-red-600 border border-red-300 rounded", children: [(0, jsx_runtime_1.jsx)("p", { className: "font-semibold", children: "Failed to render card" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm mt-1", children: ["Type: ", card.type] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs mt-1 text-gray-500", children: error instanceof Error ? error.message : 'Unknown error' })] }));
    }
};
exports.renderCardComponent = renderCardComponent;
var createRenderVirtualCard = function (selectedCards, isDraggingMultiple, draggedCardId, isCardLocked, getCardGroup, searchTerm, filteredCards, handleDragStart, handleCardClick, toggleCardLock, removeCard, cardTypes, kpiData, setShowTemplateLibrary, resizingCardId, handleResizeStart, keyboardNavigation) {
    return function (card, _index) {
        var cardGroup = getCardGroup(card.id);
        var isInFilteredResults = filteredCards.some(function (c) { return c.id === card.id; });
        // Handle minimize/expand/restore events
        var handleMinimize = function (cardId, cardType) {
            window.dispatchEvent(new CustomEvent('minimizeCard', {
                detail: { cardId: cardId, cardType: cardType, minimize: true }
            }));
        };
        var handleExpand = function (cardId, cardType) {
            window.dispatchEvent(new CustomEvent('expandCard', {
                detail: { cardId: cardId, cardType: cardType, expand: true }
            }));
        };
        var handleRestore = function (cardId, cardType, originalSize, originalPosition) {
            window.dispatchEvent(new CustomEvent('restoreCard', {
                detail: {
                    cardId: cardId,
                    cardType: cardType,
                    restore: true,
                    originalSize: originalSize,
                    originalPosition: originalPosition
                }
            }));
        };
        var navigationMode = ['resize', 'select', 'move'].includes(keyboardNavigation.navigationMode)
            ? keyboardNavigation.navigationMode
            : 'select';
        return ((0, jsx_runtime_1.jsx)(CardContainer_1.CardContainer, { card: card, isSelected: selectedCards.has(card.id), isDragging: draggedCardId === card.id, isDraggingMultiple: isDraggingMultiple && selectedCards.has(card.id), isLocked: isCardLocked(card.id), isResizing: resizingCardId === card.id, isFocused: keyboardNavigation.focusedCardId === card.id, isNavigating: keyboardNavigation.isNavigating, navigationMode: navigationMode, searchTerm: searchTerm, isInFilteredResults: isInFilteredResults, cardGroup: cardGroup, cardTypes: cardTypes, kpiData: kpiData, onDragStart: handleDragStart, onClick: handleCardClick, onFocus: function (cardId) { return keyboardNavigation.navigateToCard(cardId); }, onToggleLock: toggleCardLock, onRemove: removeCard, onResizeStart: handleResizeStart, onMinimize: handleMinimize, onExpand: handleExpand, onRestore: handleRestore, setShowTemplateLibrary: setShowTemplateLibrary }, card.id));
    };
};
exports.createRenderVirtualCard = createRenderVirtualCard;
