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
exports.AdaptiveGrid = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_grid_layout_1 = require("react-grid-layout");
var RegionContainer_1 = require("./RegionContainer");
var framer_motion_1 = require("framer-motion");
require("react-grid-layout/css/styles.css");
require("./region-grid.css");
var ResponsiveGridLayout = (0, react_grid_layout_1.WidthProvider)(react_grid_layout_1.Responsive);
/**
 * Adaptive grid component with flexible sizing and masonry layout option
 */
var AdaptiveGrid = function (_a) {
    var regions = _a.regions, onResize = _a.onResize, onMove = _a.onMove, onToggleCollapse = _a.onToggleCollapse, onToggleLock = _a.onToggleLock, onDelete = _a.onDelete, onUpdate = _a.onUpdate, _b = _a.layoutMode, layoutMode = _b === void 0 ? 'grid' : _b, _c = _a.className, className = _c === void 0 ? '' : _c, _d = _a.isDraggable, isDraggable = _d === void 0 ? true : _d, _f = _a.isResizable, isResizable = _f === void 0 ? true : _f;
    var _g = (0, react_1.useState)([]), snapGuides = _g[0], setSnapGuides = _g[1];
    var _h = (0, react_1.useState)(null), dragPreview = _h[0], setDragPreview = _h[1];
    // Calculate snap guides from existing regions
    var calculateSnapGuides = (0, react_1.useCallback)(function (currentLayout) {
        var guides = [];
        var xPositions = new Set();
        var yPositions = new Set();
        currentLayout.forEach(function (item) {
            xPositions.add(item.x);
            xPositions.add(item.x + item.w);
            yPositions.add(item.y);
            yPositions.add(item.y + item.h);
        });
        xPositions.forEach(function (x) {
            yPositions.forEach(function (y) {
                guides.push({ x: x, y: y });
            });
        });
        return guides;
    }, []);
    // Convert regions to React Grid Layout format
    var layouts = (0, react_1.useMemo)(function () {
        var breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
        var colsMap = { lg: 12, md: 12, sm: 8, xs: 4, xxs: 2 };
        var layout = {};
        Object.keys(breakpoints).forEach(function (breakpoint) {
            if (layoutMode === 'masonry') {
                // Masonry layout: pack regions efficiently
                layout[breakpoint] = packMasonryLayout(regions, colsMap[breakpoint]);
            }
            else {
                // Standard grid layout
                layout[breakpoint] = regions.map(function (region) { return ({
                    i: region.id,
                    x: region.grid_col,
                    y: region.grid_row,
                    w: region.col_span,
                    h: region.row_span,
                    minW: Math.ceil(region.min_width / 100) || 2,
                    minH: Math.ceil(region.min_height / 100) || 2,
                    maxW: undefined,
                    maxH: undefined,
                    static: region.is_locked || false,
                    isDraggable: isDraggable && !region.is_locked,
                    isResizable: isResizable && !region.is_locked
                }); });
            }
        });
        return layout;
    }, [regions, layoutMode, isDraggable, isResizable]);
    // Pack regions in masonry layout
    var packMasonryLayout = function (regions, cols) {
        var layout = [];
        var heights = new Array(cols).fill(0);
        regions.forEach(function (region) {
            // Find column with minimum height
            var minCol = 0;
            var firstHeight = heights[0];
            if (firstHeight === undefined)
                return;
            var minHeight = firstHeight;
            for (var col = 1; col < cols; col++) {
                var colHeight = heights[col];
                if (colHeight !== undefined && colHeight < minHeight) {
                    minHeight = colHeight;
                    minCol = col;
                }
            }
            // Place region at minimum height column
            var x = minCol;
            var y = Math.floor(minHeight);
            var w = Math.min(region.col_span, cols - x);
            var h = region.row_span;
            layout.push({
                i: region.id,
                x: x,
                y: y,
                w: w,
                h: h,
                minW: Math.ceil(region.min_width / 100) || 2,
                minH: Math.ceil(region.min_height / 100) || 2,
                static: region.is_locked || false,
                isDraggable: isDraggable && !region.is_locked,
                isResizable: isResizable && !region.is_locked
            });
            // Update heights
            for (var col = x; col < x + w && col < cols; col++) {
                heights[col] = y + h;
            }
        });
        return layout;
    };
    // Handle layout change with snap guides
    var handleLayoutChange = (0, react_1.useCallback)(function (currentLayout, allLayouts) {
        var lgLayout = allLayouts.lg || currentLayout;
        // Calculate snap guides
        var guides = calculateSnapGuides(lgLayout);
        setSnapGuides(guides);
        lgLayout.forEach(function (item) {
            var region = regions.find(function (r) { return r.id === item.i; });
            if (!region)
                return;
            // Check if position changed
            if (item.x !== region.grid_col || item.y !== region.grid_row) {
                onMove === null || onMove === void 0 ? void 0 : onMove(item.i, item.y, item.x);
            }
            // Check if size changed
            if (item.w !== region.col_span || item.h !== region.row_span) {
                onResize === null || onResize === void 0 ? void 0 : onResize(item.i, item.h, item.w);
            }
        });
    }, [regions, onMove, onResize, calculateSnapGuides]);
    // Handle drag start
    var handleDragStart = (0, react_1.useCallback)(function (_layout, _oldItem, newItem, _placeholder, _e, _element) {
        setDragPreview({
            id: newItem.i,
            x: newItem.x,
            y: newItem.y,
            w: newItem.w,
            h: newItem.h
        });
    }, []);
    // Handle drag stop
    var handleDragStop = (0, react_1.useCallback)(function () {
        setDragPreview(null);
    }, []);
    // Responsive breakpoints
    var breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
    var colsMap = { lg: 12, md: 12, sm: 8, xs: 4, xxs: 2 };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "adaptive-grid ".concat(className, " relative"), role: "grid", "aria-label": "Adaptive dashboard regions grid", children: [snapGuides.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "snap-guides-overlay absolute inset-0 pointer-events-none z-10", children: snapGuides.map(function (guide, index) { return ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "snap-guide absolute w-px h-px bg-blue-400 opacity-30", style: {
                        left: "".concat((guide.x / 12) * 100, "%"),
                        top: "".concat(guide.y * 50, "px")
                    }, initial: { opacity: 0 }, animate: { opacity: 0.3 }, exit: { opacity: 0 } }, index)); }) })), dragPreview && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "drag-preview absolute border-2 border-blue-500 bg-blue-100/20 pointer-events-none z-20", style: {
                    left: "".concat((dragPreview.x / 12) * 100, "%"),
                    top: "".concat(dragPreview.y * 50, "px"),
                    width: "".concat((dragPreview.w / 12) * 100, "%"),
                    height: "".concat(dragPreview.h * 50, "px")
                }, initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 } })), (0, jsx_runtime_1.jsx)(ResponsiveGridLayout, { className: "layout", layouts: layouts, breakpoints: breakpoints, cols: colsMap, rowHeight: 50, isDraggable: isDraggable, isResizable: isResizable, onLayoutChange: handleLayoutChange, onDragStart: handleDragStart, onDragStop: handleDragStop, margin: [16, 16], containerPadding: [16, 16], compactType: "vertical", preventCollision: false, useCSSTransforms: true, children: regions.map(function (region) { return ((0, jsx_runtime_1.jsx)("div", { "data-region-id": region.id, children: (0, jsx_runtime_1.jsx)(RegionContainer_1.RegionContainer, __assign({ region: region }, (onResize ? { onResize: onResize } : {}), (onMove ? { onMove: onMove } : {}), (onToggleCollapse ? { onToggleCollapse: onToggleCollapse } : {}), (onToggleLock ? { onToggleLock: onToggleLock } : {}), (onDelete ? { onDelete: onDelete } : {}), (onUpdate ? { onUpdate: onUpdate } : {}))) }, region.id)); }) })] }));
};
exports.AdaptiveGrid = AdaptiveGrid;
