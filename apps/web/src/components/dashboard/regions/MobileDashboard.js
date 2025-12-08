"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileDashboard = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var RegionContainer_1 = require("./RegionContainer");
/**
 * Mobile-optimized dashboard with swipe gestures and touch controls
 */
var MobileDashboard = function (_a) {
    var regions = _a.regions, onResize = _a.onResize, onMove = _a.onMove, onToggleCollapse = _a.onToggleCollapse, onToggleLock = _a.onToggleLock, onDelete = _a.onDelete, onUpdate = _a.onUpdate, onAddRegion = _a.onAddRegion, _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = (0, react_1.useState)(0), currentIndex = _c[0], setCurrentIndex = _c[1];
    var _d = (0, react_1.useState)(false), isMenuOpen = _d[0], setIsMenuOpen = _d[1];
    var _e = (0, react_1.useState)(false), isRefreshing = _e[0], setIsRefreshing = _e[1];
    var _f = (0, react_1.useState)(0), pullDistance = _f[0], setPullDistance = _f[1];
    var containerRef = (0, react_1.useRef)(null);
    var startYRef = (0, react_1.useRef)(null);
    var swipeStartRef = (0, react_1.useRef)(null);
    var swipeThreshold = 50;
    // Filter visible regions (not collapsed, not hidden on mobile)
    var visibleRegions = regions.filter(function (r) { return !r.is_collapsed && !r.is_hidden_mobile; });
    // Swipe handlers using native touch events
    var handleSwipeStart = (0, react_1.useCallback)(function (e) {
        var touch = e.touches[0];
        if (touch) {
            swipeStartRef.current = {
                x: touch.clientX,
                y: touch.clientY
            };
        }
    }, []);
    var handleSwipeMove = (0, react_1.useCallback)(function (e) {
        if (!swipeStartRef.current)
            return;
        var touch = e.touches[0];
        if (!touch)
            return;
        var currentX = touch.clientX;
        var currentY = touch.clientY;
        var deltaX = currentX - swipeStartRef.current.x;
        var deltaY = currentY - swipeStartRef.current.y;
        // Only handle horizontal swipes if horizontal movement is greater than vertical
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
            e.preventDefault(); // Prevent scrolling during horizontal swipe
        }
    }, []);
    var handleSwipeEnd = (0, react_1.useCallback)(function (e) {
        if (!swipeStartRef.current)
            return;
        var touch = e.changedTouches[0];
        if (!touch)
            return;
        var endX = touch.clientX;
        var endY = touch.clientY;
        var deltaX = endX - swipeStartRef.current.x;
        var deltaY = endY - swipeStartRef.current.y;
        // Check if it's a horizontal swipe
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold) {
            if (deltaX > 0 && currentIndex > 0) {
                // Swipe right - go to previous
                setCurrentIndex(function (prev) { return prev - 1; });
            }
            else if (deltaX < 0 && currentIndex < visibleRegions.length - 1) {
                // Swipe left - go to next
                setCurrentIndex(function (prev) { return prev + 1; });
            }
        }
        swipeStartRef.current = null;
    }, [currentIndex, visibleRegions.length]);
    // Pull to refresh
    var handleTouchStart = (0, react_1.useCallback)(function (e) {
        var _a;
        if (((_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.scrollTop) === 0) {
            var touch = e.touches[0];
            if (touch) {
                startYRef.current = touch.clientY;
            }
        }
    }, []);
    var handleTouchMove = (0, react_1.useCallback)(function (e) {
        var _a;
        if (startYRef.current !== null && ((_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.scrollTop) === 0) {
            var touch = e.touches[0];
            if (!touch)
                return;
            var currentY = touch.clientY;
            var distance = currentY - startYRef.current;
            if (distance > 0) {
                setPullDistance(Math.min(distance, 100));
            }
        }
    }, []);
    var handleTouchEnd = (0, react_1.useCallback)(function () {
        if (pullDistance > 50) {
            setIsRefreshing(true);
            // Trigger refresh
            setTimeout(function () {
                setIsRefreshing(false);
                setPullDistance(0);
            }, 1000);
        }
        else {
            setPullDistance(0);
        }
        startYRef.current = null;
    }, [pullDistance]);
    // Navigation
    var goToNext = (0, react_1.useCallback)(function () {
        if (currentIndex < visibleRegions.length - 1) {
            setCurrentIndex(function (prev) { return prev + 1; });
        }
    }, [currentIndex, visibleRegions.length]);
    var goToPrevious = (0, react_1.useCallback)(function () {
        if (currentIndex > 0) {
            setCurrentIndex(function (prev) { return prev - 1; });
        }
    }, [currentIndex]);
    var goToIndex = (0, react_1.useCallback)(function (index) {
        if (index >= 0 && index < visibleRegions.length) {
            setCurrentIndex(index);
        }
    }, [visibleRegions.length]);
    // Keyboard navigation
    (0, react_1.useEffect)(function () {
        var handleKeyDown = function (e) {
            if (e.key === 'ArrowLeft') {
                goToPrevious();
            }
            else if (e.key === 'ArrowRight') {
                goToNext();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return function () { return window.removeEventListener('keydown', handleKeyDown); };
    }, [goToNext, goToPrevious]);
    if (visibleRegions.length === 0) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "mobile-dashboard empty ".concat(className, " flex flex-col items-center justify-center h-screen p-4"), children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 mb-4", children: "No regions to display" }), onAddRegion && ((0, jsx_runtime_1.jsx)("button", { onClick: function () { return onAddRegion('custom'); }, className: "px-4 py-2 bg-blue-500 text-white rounded-lg", children: "Add Region" }))] }) }));
    }
    var currentRegion = visibleRegions[currentIndex];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "mobile-dashboard ".concat(className, " h-screen w-full overflow-hidden bg-gray-50"), onTouchStart: function (e) {
            handleTouchStart(e);
            handleSwipeStart(e);
        }, onTouchMove: function (e) {
            handleTouchMove(e);
            handleSwipeMove(e);
        }, onTouchEnd: function (e) {
            handleTouchEnd();
            handleSwipeEnd(e);
        }, children: [(0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { children: pullDistance > 0 && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute top-0 left-0 right-0 flex items-center justify-center bg-blue-500 text-white py-2 z-50", style: { height: "".concat(Math.min(pullDistance, 100), "px") }, initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: isRefreshing ? ((0, jsx_runtime_1.jsx)("span", { children: "Refreshing..." })) : ((0, jsx_runtime_1.jsx)("span", { children: "Pull to refresh" })) })) }), (0, jsx_runtime_1.jsxs)("div", { className: "mobile-header bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return setIsMenuOpen(true); }, className: "p-2 -ml-2", "aria-label": "Menu", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Menu, { className: "w-6 h-6 text-gray-700" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 text-center", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold text-gray-900", children: currentRegion ? currentRegion.region_type.replace(/-/g, ' ') : 'No region' }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500", children: visibleRegions.length > 0 ? "".concat(currentIndex + 1, " of ").concat(visibleRegions.length) : '0 of 0' })] }), onAddRegion && ((0, jsx_runtime_1.jsx)("button", { onClick: function () { return onAddRegion('custom'); }, className: "p-2 -mr-2", "aria-label": "Add region", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-6 h-6 text-blue-500" }) }))] }), (0, jsx_runtime_1.jsx)("div", { ref: containerRef, className: "mobile-regions-container flex-1 overflow-hidden relative", children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "flex h-full", animate: {
                        x: "-".concat(currentIndex * 100, "%")
                    }, transition: {
                        type: 'spring',
                        stiffness: 300,
                        damping: 30
                    }, children: visibleRegions.map(function (region, _index) { return ((0, jsx_runtime_1.jsx)("div", { className: "mobile-region-slide flex-shrink-0 w-full h-full overflow-y-auto", style: { scrollBehavior: 'smooth' }, children: (0, jsx_runtime_1.jsx)(RegionContainer_1.RegionContainer, __assign({ region: region }, (onResize ? { onResize: onResize } : {}), (onMove ? { onMove: onMove } : {}), (onToggleCollapse ? { onToggleCollapse: onToggleCollapse } : {}), (onToggleLock ? { onToggleLock: onToggleLock } : {}), (onDelete ? { onDelete: onDelete } : {}), (onUpdate ? { onUpdate: onUpdate } : {}))) }, region.id)); }) }) }), visibleRegions.length > 1 && ((0, jsx_runtime_1.jsx)("div", { className: "mobile-nav-dots flex items-center justify-center gap-2 py-4 bg-white border-t border-gray-200", children: visibleRegions.map(function (_, index) { return ((0, jsx_runtime_1.jsx)("button", { onClick: function () { return goToIndex(index); }, className: "w-2 h-2 rounded-full transition-all ".concat(index === currentIndex
                        ? 'bg-blue-500 w-6'
                        : 'bg-gray-300'), "aria-label": "Go to region ".concat(index + 1) }, index)); }) })), visibleRegions.length > 1 && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [currentIndex > 0 && ((0, jsx_runtime_1.jsx)("button", { onClick: goToPrevious, className: "mobile-nav-button left fixed left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg border border-gray-200 z-40", "aria-label": "Previous region", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronLeft, { className: "w-6 h-6 text-gray-700" }) })), currentIndex < visibleRegions.length - 1 && ((0, jsx_runtime_1.jsx)("button", { onClick: goToNext, className: "mobile-nav-button right fixed right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg border border-gray-200 z-40", "aria-label": "Next region", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { className: "w-6 h-6 text-gray-700" }) }))] })), (0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { children: isMenuOpen && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "fixed inset-0 bg-black/50 z-50", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: function () { return setIsMenuOpen(false); } }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { className: "fixed left-0 top-0 bottom-0 w-80 bg-white shadow-xl z-50 overflow-y-auto", initial: { x: '-100%' }, animate: { x: 0 }, exit: { x: '-100%' }, transition: { type: 'spring', damping: 25, stiffness: 200 }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 border-b border-gray-200 flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold", children: "Regions" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setIsMenuOpen(false); }, className: "p-2 -mr-2", "aria-label": "Close menu", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-5 h-5" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "p-4 space-y-2", children: visibleRegions.map(function (region, index) {
                                        var _a;
                                        return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () {
                                                goToIndex(index);
                                                setIsMenuOpen(false);
                                            }, className: "w-full text-left p-3 rounded-lg transition-colors ".concat(index === currentIndex
                                                ? 'bg-blue-50 border-2 border-blue-500'
                                                : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'), children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-gray-900", children: region.region_type.replace(/-/g, ' ') }), ((_a = region.config) === null || _a === void 0 ? void 0 : _a.title) && ((0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500 mt-1", children: region.config.title }))] }, region.id));
                                    }) })] })] })) })] }));
};
exports.MobileDashboard = MobileDashboard;
