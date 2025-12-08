"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDashboardState = void 0;
var react_1 = require("react");
var useDashboardState = function () {
    var _a = (0, react_1.useState)(new Set()), selectedCards = _a[0], setSelectedCards = _a[1];
    var _b = (0, react_1.useState)(new Set()), dragModeCards = _b[0], setDragModeCards = _b[1];
    var _c = (0, react_1.useState)(false), showKeyboardHelp = _c[0], setShowKeyboardHelp = _c[1];
    var _d = (0, react_1.useState)(false), showCardSelector = _d[0], setShowCardSelector = _d[1];
    var _e = (0, react_1.useState)(false), showLayoutManager = _e[0], setShowLayoutManager = _e[1];
    var _f = (0, react_1.useState)(''), searchTerm = _f[0], setSearchTerm = _f[1];
    var _g = (0, react_1.useState)(false), useVirtualScrollingEnabled = _g[0], setUseVirtualScrollingEnabled = _g[1];
    var _h = (0, react_1.useState)(100), virtualScrollingThreshold = _h[0], setVirtualScrollingThreshold = _h[1];
    var _j = (0, react_1.useState)(false), isMobileFullscreen = _j[0], setIsMobileFullscreen = _j[1];
    var _k = (0, react_1.useState)(false), showMobileNavigation = _k[0], setShowMobileNavigation = _k[1];
    var _l = (0, react_1.useState)(false), showKPIBuilder = _l[0], setShowKPIBuilder = _l[1];
    var _m = (0, react_1.useState)(false), showTemplateLibrary = _m[0], setShowTemplateLibrary = _m[1];
    // Show mobile navigation only on mobile devices
    (0, react_1.useEffect)(function () {
        var checkMobile = function () {
            var isMobile = window.innerWidth <= 768;
            setShowMobileNavigation(isMobile);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return function () { return window.removeEventListener('resize', checkMobile); };
    }, []);
    // Listen for fullscreen changes
    (0, react_1.useEffect)(function () {
        var handleFullscreenChange = function () {
            setIsMobileFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return function () { return document.removeEventListener('fullscreenchange', handleFullscreenChange); };
    }, []);
    var handleDeselectAll = (0, react_1.useCallback)(function () {
        setSelectedCards(new Set());
    }, []);
    var handleSelectAll = (0, react_1.useCallback)(function (cardIds) {
        setSelectedCards(new Set(cardIds));
    }, []);
    var toggleDragMode = (0, react_1.useCallback)(function (cardId) {
        setDragModeCards(function (prev) {
            var next = new Set(prev);
            if (next.has(cardId)) {
                next.delete(cardId);
            }
            else {
                next.add(cardId);
            }
            return next;
        });
    }, []);
    var setDragMode = (0, react_1.useCallback)(function (cardId, enabled) {
        setDragModeCards(function (prev) {
            var next = new Set(prev);
            if (enabled) {
                next.add(cardId);
            }
            else {
                next.delete(cardId);
            }
            return next;
        });
    }, []);
    return {
        selectedCards: selectedCards,
        setSelectedCards: setSelectedCards,
        dragModeCards: dragModeCards,
        toggleDragMode: toggleDragMode,
        setDragMode: setDragMode,
        showKeyboardHelp: showKeyboardHelp,
        setShowKeyboardHelp: setShowKeyboardHelp,
        showCardSelector: showCardSelector,
        setShowCardSelector: setShowCardSelector,
        showLayoutManager: showLayoutManager,
        setShowLayoutManager: setShowLayoutManager,
        searchTerm: searchTerm,
        setSearchTerm: setSearchTerm,
        useVirtualScrollingEnabled: useVirtualScrollingEnabled,
        setUseVirtualScrollingEnabled: setUseVirtualScrollingEnabled,
        virtualScrollingThreshold: virtualScrollingThreshold,
        setVirtualScrollingThreshold: setVirtualScrollingThreshold,
        isMobileFullscreen: isMobileFullscreen,
        setIsMobileFullscreen: setIsMobileFullscreen,
        showMobileNavigation: showMobileNavigation,
        setShowMobileNavigation: setShowMobileNavigation,
        showKPIBuilder: showKPIBuilder,
        setShowKPIBuilder: setShowKPIBuilder,
        showTemplateLibrary: showTemplateLibrary,
        setShowTemplateLibrary: setShowTemplateLibrary,
        handleDeselectAll: handleDeselectAll,
        handleSelectAll: handleSelectAll
    };
};
exports.useDashboardState = useDashboardState;
