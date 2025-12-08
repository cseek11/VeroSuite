"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirtualCardPerformance = exports.VirtualCardLoading = exports.VirtualCardContainer = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var useVirtualScrolling_1 = require("@/hooks/useVirtualScrolling");
var VirtualCardContainer = function (_a) {
    var cards = _a.cards, cardWidth = _a.cardWidth, cardHeight = _a.cardHeight, containerWidth = _a.containerWidth, containerHeight = _a.containerHeight, renderCard = _a.renderCard, _b = _a.overscan, overscan = _b === void 0 ? 5 : _b, _c = _a.threshold, threshold = _c === void 0 ? 100 : _c;
    // Virtual scrolling hook
    var virtualScrolling = (0, useVirtualScrolling_1.useVirtualScrolling)({
        itemHeight: cardHeight + 20, // Add gap between cards
        containerHeight: containerHeight,
        overscan: overscan,
        threshold: threshold
    });
    // Enable virtual scrolling when card count exceeds threshold
    (0, react_1.useEffect)(function () {
        virtualScrolling.enableVirtualScrolling(cards.length);
    }, [cards.length, virtualScrolling]);
    // Update container height when it changes
    (0, react_1.useEffect)(function () {
        virtualScrolling.updateContainerHeight(containerHeight);
    }, [containerHeight, virtualScrolling]);
    // If virtual scrolling is not needed, render cards normally
    if (!virtualScrolling.isVirtualScrolling) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "virtual-card-container", style: {
                width: containerWidth,
                height: containerHeight,
                overflow: 'auto'
            }, children: (0, jsx_runtime_1.jsx)("div", { className: "card-grid", style: { display: 'flex', flexWrap: 'wrap', gap: '20px' }, children: cards.map(function (card, index) { return ((0, jsx_runtime_1.jsx)("div", { style: { width: cardWidth, height: cardHeight }, children: renderCard(card, index) }, card.id)); }) }) }));
    }
    // TODO: Re-enable Grid when react-window is installed
    // For now, fallback to normal rendering
    return ((0, jsx_runtime_1.jsx)("div", { className: "virtual-card-container", style: {
            width: containerWidth,
            height: containerHeight,
            overflow: 'auto'
        }, children: (0, jsx_runtime_1.jsx)("div", { className: "card-grid", style: { display: 'flex', flexWrap: 'wrap', gap: '20px' }, children: cards.map(function (card, index) { return ((0, jsx_runtime_1.jsx)("div", { style: { width: cardWidth, height: cardHeight }, children: renderCard(card, index) }, card.id)); }) }) }));
};
exports.VirtualCardContainer = VirtualCardContainer;
// Loading component for virtual scrolling
var VirtualCardLoading = function (_a) {
    var _b = _a.message, message = _b === void 0 ? "Loading cards..." : _b;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center h-32 text-gray-500", children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mr-3" }), message] }));
};
exports.VirtualCardLoading = VirtualCardLoading;
// Performance monitoring component
var VirtualCardPerformance = function (_a) {
    var cardCount = _a.cardCount, isVirtualScrolling = _a.isVirtualScrolling, renderTime = _a.renderTime;
    var performanceInfo = (0, react_1.useMemo)(function () {
        var _a;
        return ({
            memoryUsage: Math.round(((_a = performance.memory) === null || _a === void 0 ? void 0 : _a.usedJSHeapSize) / 1024 / 1024) || 0,
            renderTime: renderTime || 0
        });
    }, [renderTime]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-500 bg-gray-100 p-2 rounded", children: [(0, jsx_runtime_1.jsxs)("div", { children: ["Cards: ", cardCount, " | Virtual: ", isVirtualScrolling ? 'ON' : 'OFF'] }), (0, jsx_runtime_1.jsxs)("div", { children: ["Memory: ", performanceInfo.memoryUsage, "MB | Render: ", performanceInfo.renderTime, "ms"] })] }));
};
exports.VirtualCardPerformance = VirtualCardPerformance;
