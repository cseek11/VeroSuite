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
exports.RegionGrid = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_grid_layout_1 = require("react-grid-layout");
var RegionContainer_1 = require("./RegionContainer");
var regionStore_1 = require("@/stores/regionStore");
var toast_1 = require("@/utils/toast");
var region_constants_1 = require("../../../../../shared/validation/region-constants");
require("react-grid-layout/css/styles.css");
require("./region-grid.css");
var ResponsiveGridLayout = (0, react_grid_layout_1.WidthProvider)(react_grid_layout_1.Responsive);
var RegionGrid = function (_a) {
    var regions = _a.regions, _b = _a.rows, rows = _b === void 0 ? 12 : _b, _c = _a.cols, cols = _c === void 0 ? 12 : _c, _d = _a.gap, gap = _d === void 0 ? 16 : _d, onResize = _a.onResize, onMove = _a.onMove, onToggleCollapse = _a.onToggleCollapse, onToggleLock = _a.onToggleLock, onDelete = _a.onDelete, onUpdate = _a.onUpdate, onAddRegion = _a.onAddRegion, renderRegion = _a.renderRegion, _f = _a.className, className = _f === void 0 ? '' : _f, _g = _a.isDraggable, isDraggable = _g === void 0 ? true : _g, _h = _a.isResizable, isResizable = _h === void 0 ? true : _h;
    // Convert regions to React Grid Layout format
    var layouts = (0, react_1.useMemo)(function () {
        var breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
        var layout = {};
        Object.keys(breakpoints).forEach(function (breakpoint) {
            layout[breakpoint] = regions.map(function (region) {
                // Calculate minW and minH in grid units (assuming ~100px per unit)
                // Ensure minW doesn't exceed the item's width
                var minW = Math.min(Math.ceil(region.min_width / 100) || 1, region.col_span || 1);
                var minH = Math.min(Math.ceil(region.min_height / 100) || 1, region.row_span || 1);
                // Calculate max width based on remaining columns
                var maxW = cols - region.grid_col;
                return {
                    i: region.id,
                    x: region.grid_col,
                    y: region.grid_row,
                    w: region.col_span,
                    h: region.row_span,
                    minW: Math.max(1, minW), // At least 1 grid unit
                    minH: Math.max(1, minH), // At least 1 grid unit
                    maxW: Math.max(1, maxW), // Can't exceed grid bounds
                    maxH: undefined, // No max height constraint
                    static: region.is_locked || false,
                    isDraggable: isDraggable && !region.is_locked,
                    isResizable: isResizable && !region.is_locked
                };
            });
        });
        return layout;
    }, [regions, rows, cols, isDraggable, isResizable]);
    // Handle drag stop - validate before committing
    var handleDragStop = (0, react_1.useCallback)(function (_layout, _oldItem, newItem, _placeholder, _e, _element) {
        var _a;
        var region = regions.find(function (r) { return r.id === newItem.i; });
        if (!region)
            return;
        // Validate and clamp grid bounds using shared validation
        var boundsCheck = (0, region_constants_1.validateGridBounds)({
            grid_col: newItem.x,
            col_span: newItem.w,
            grid_row: newItem.y,
            row_span: newItem.h
        });
        if (!boundsCheck.valid) {
            toast_1.toast.error("Cannot move region: ".concat(boundsCheck.error), 5000);
            // Force revert by not calling onMove
            return;
        }
        var validX = Math.max(0, Math.min(newItem.x, cols - 1));
        var validW = Math.max(1, Math.min(newItem.w, cols - validX));
        var validY = Math.max(0, newItem.y);
        var validH = Math.max(1, newItem.h);
        // Get latest regions from store for accurate overlap detection
        var storeState = regionStore_1.useRegionStore.getState();
        var layoutId = region.layout_id || ((_a = regions[0]) === null || _a === void 0 ? void 0 : _a.layout_id) || '';
        var latestRegions = storeState.getRegionsByLayout(layoutId).map(function (r) { return ({
            id: r.id,
            grid_row: r.grid_row,
            grid_col: r.grid_col,
            row_span: r.row_span,
            col_span: r.col_span
        }); });
        // Check for overlaps with latest data using shared overlap detection
        var wouldOverlap = latestRegions.some(function (existing) {
            if (existing.id === newItem.i)
                return false;
            return (0, region_constants_1.regionsOverlap)({
                grid_row: validY,
                grid_col: validX,
                row_span: validH,
                col_span: validW
            }, existing);
        });
        if (wouldOverlap) {
            var overlappingRegion = latestRegions.find(function (existing) {
                return existing.id !== newItem.i &&
                    (0, region_constants_1.regionsOverlap)({ grid_row: validY, grid_col: validX, row_span: validH, col_span: validW }, existing);
            });
            var position = overlappingRegion
                ? " at position (".concat(overlappingRegion.grid_row, ", ").concat(overlappingRegion.grid_col, ")")
                : '';
            toast_1.toast.error("Cannot move region: overlaps with another region".concat(position), 5000);
            // Force revert by not calling onMove
            return;
        }
        // Only send update if position changed
        var positionChanged = validX !== region.grid_col || validY !== region.grid_row;
        if (positionChanged) {
            onMove === null || onMove === void 0 ? void 0 : onMove(newItem.i, validY, validX);
        }
    }, [regions, cols, onMove]);
    // Handle resize stop - validate before committing
    var handleResizeStop = (0, react_1.useCallback)(function (_layout, _oldItem, newItem, _placeholder, _e, _element) {
        var _a;
        var region = regions.find(function (r) { return r.id === newItem.i; });
        if (!region)
            return;
        // Validate and clamp grid bounds using shared validation
        var boundsCheck = (0, region_constants_1.validateGridBounds)({
            grid_col: newItem.x,
            col_span: newItem.w,
            grid_row: newItem.y,
            row_span: newItem.h
        });
        if (!boundsCheck.valid) {
            toast_1.toast.error("Cannot resize region: ".concat(boundsCheck.error), 5000);
            // Force revert by not calling onResize
            return;
        }
        var validX = Math.max(0, Math.min(newItem.x, cols - 1));
        var validW = Math.max(1, Math.min(newItem.w, cols - validX));
        var validY = Math.max(0, newItem.y);
        var validH = Math.max(1, newItem.h);
        // Get latest regions from store for accurate overlap detection
        var storeState = regionStore_1.useRegionStore.getState();
        var layoutId = region.layout_id || ((_a = regions[0]) === null || _a === void 0 ? void 0 : _a.layout_id) || '';
        var latestRegions = storeState.getRegionsByLayout(layoutId).map(function (r) { return ({
            id: r.id,
            grid_row: r.grid_row,
            grid_col: r.grid_col,
            row_span: r.row_span,
            col_span: r.col_span
        }); });
        // Check for overlaps with latest data using shared overlap detection
        var wouldOverlap = latestRegions.some(function (existing) {
            if (existing.id === newItem.i)
                return false;
            return (0, region_constants_1.regionsOverlap)({
                grid_row: validY,
                grid_col: validX,
                row_span: validH,
                col_span: validW
            }, existing);
        });
        if (wouldOverlap) {
            var overlappingRegion = latestRegions.find(function (existing) {
                return existing.id !== newItem.i &&
                    (0, region_constants_1.regionsOverlap)({ grid_row: validY, grid_col: validX, row_span: validH, col_span: validW }, existing);
            });
            var position = overlappingRegion
                ? " at position (".concat(overlappingRegion.grid_row, ", ").concat(overlappingRegion.grid_col, ")")
                : '';
            toast_1.toast.error("Cannot resize region: overlaps with another region".concat(position), 5000);
            // Force revert by not calling onResize
            return;
        }
        // Only send update if size changed
        var sizeChanged = validW !== region.col_span || validH !== region.row_span;
        if (sizeChanged) {
            onResize === null || onResize === void 0 ? void 0 : onResize(newItem.i, validH, validW);
        }
    }, [regions, cols, onResize]);
    // Handle layout change (for other updates, not drag/resize)
    var handleLayoutChange = (0, react_1.useCallback)(function (_currentLayout, _allLayouts) {
        // This is called for all layout changes, but we handle drag/resize in onDragStop/onResizeStop
        // This can be used for other layout updates if needed
    }, []);
    // Responsive breakpoints and column counts
    var breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
    var colsMap = { lg: cols, md: cols, sm: cols, xs: cols, xxs: cols };
    return ((0, jsx_runtime_1.jsx)("div", { className: "region-grid ".concat(className, " w-full h-full"), role: "grid", "aria-label": "Dashboard regions grid", children: (0, jsx_runtime_1.jsx)(ResponsiveGridLayout, { className: "layout", layouts: layouts, breakpoints: breakpoints, cols: colsMap, rowHeight: 100, margin: [gap, gap], containerPadding: [0, 0], onLayoutChange: handleLayoutChange, onDragStop: handleDragStop, onResizeStop: handleResizeStop, isDraggable: isDraggable, isResizable: isResizable, draggableHandle: ".region-drag-handle", resizeHandles: ['se', 'sw', 'ne', 'nw', 's', 'n', 'e', 'w'], compactType: null, preventCollision: true, useCSSTransforms: true, allowOverlap: false, isBounded: true, style: { height: '100%' }, children: regions.map(function (region) { return ((0, jsx_runtime_1.jsx)("div", { className: "region-grid-item", children: (0, jsx_runtime_1.jsx)(RegionContainer_1.RegionContainer, __assign({ region: region }, (onResize ? { onResize: onResize } : {}), (onMove ? { onMove: onMove } : {}), (onToggleCollapse ? { onToggleCollapse: onToggleCollapse } : {}), (onToggleLock ? { onToggleLock: onToggleLock } : {}), (onDelete ? { onDelete: onDelete } : {}), (onUpdate ? { onUpdate: onUpdate } : {}), (onAddRegion ? { onAddRegion: onAddRegion } : {}), { children: renderRegion ? renderRegion(region) : null })) }, region.id)); }) }) }));
};
exports.RegionGrid = RegionGrid;
