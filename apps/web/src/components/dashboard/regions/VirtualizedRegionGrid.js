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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirtualizedRegionGrid = void 0;
exports.useLazyRegionLoading = useLazyRegionLoading;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importStar(require("react"));
var ReactWindow = __importStar(require("react-window"));
var Grid = ReactWindow.FixedSizeGrid;
var RegionContainer_1 = require("./RegionContainer");
var useIntersectionObserver_1 = require("@/hooks/useIntersectionObserver");
/**
 * Virtualized grid for rendering large numbers of regions efficiently
 * Uses react-window to only render visible regions
 */
var VirtualizedRegionGrid = function (_a) {
    var regions = _a.regions, cols = _a.cols, rowHeight = _a.rowHeight, onResize = _a.onResize, onMove = _a.onMove, onToggleCollapse = _a.onToggleCollapse, onToggleLock = _a.onToggleLock, onDelete = _a.onDelete, onUpdate = _a.onUpdate, _b = _a.className, className = _b === void 0 ? '' : _b;
    var containerRef = (0, react_1.useRef)(null);
    var _c = react_1.default.useState({ width: 0, height: 0 }), containerSize = _c[0], setContainerSize = _c[1];
    // Calculate grid dimensions
    var maxRow = (0, react_1.useMemo)(function () {
        return Math.max.apply(Math, __spreadArray(__spreadArray([], regions.map(function (r) { return r.grid_row + r.row_span - 1; }), false), [0], false));
    }, [regions]);
    var rows = maxRow + 1;
    var gridWidth = containerSize.width || 1200;
    // Create a map of regions by position for quick lookup
    var regionMap = (0, react_1.useMemo)(function () {
        var map = new Map();
        regions.forEach(function (region) {
            var key = "".concat(region.grid_row, ",").concat(region.grid_col);
            map.set(key, region);
        });
        return map;
    }, [regions]);
    // Update container size on mount and resize
    (0, react_1.useEffect)(function () {
        var updateSize = function () {
            if (containerRef.current) {
                setContainerSize({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            }
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        return function () { return window.removeEventListener('resize', updateSize); };
    }, []);
    // Cell renderer for virtualized grid
    var Cell = (0, react_1.useCallback)(function (_a) {
        var columnIndex = _a.columnIndex, rowIndex = _a.rowIndex, style = _a.style;
        var key = "".concat(rowIndex, ",").concat(columnIndex);
        var region = regionMap.get(key);
        if (!region) {
            return (0, jsx_runtime_1.jsx)("div", { style: style });
        }
        // Check if this is the top-left cell of the region
        var isRegionStart = region.grid_row === rowIndex && region.grid_col === columnIndex;
        if (!isRegionStart) {
            return (0, jsx_runtime_1.jsx)("div", { style: style });
        }
        // Calculate cell span
        var cellWidth = gridWidth / cols;
        var cellHeight = rowHeight;
        var regionStyle = __assign(__assign({}, style), { width: cellWidth * region.col_span, height: cellHeight * region.row_span, position: 'absolute' });
        return ((0, jsx_runtime_1.jsx)("div", { style: regionStyle, children: (0, jsx_runtime_1.jsx)(RegionContainer_1.RegionContainer, __assign({ region: region }, (onResize ? { onResize: onResize } : {}), (onMove ? { onMove: onMove } : {}), (onToggleCollapse ? { onToggleCollapse: onToggleCollapse } : {}), (onToggleLock ? { onToggleLock: onToggleLock } : {}), (onDelete ? { onDelete: onDelete } : {}), (onUpdate ? { onUpdate: onUpdate } : {}))) }));
    }, [regionMap, cols, rowHeight, gridWidth, onResize, onMove, onToggleCollapse, onToggleLock, onDelete, onUpdate]);
    if (regions.length === 0) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-full ".concat(className), children: (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500", children: "No regions to display" }) }));
    }
    return ((0, jsx_runtime_1.jsx)("div", { ref: containerRef, className: "w-full h-full ".concat(className), children: (0, jsx_runtime_1.jsx)(Grid, { columnCount: cols, columnWidth: gridWidth / cols, height: containerSize.height || 600, rowCount: rows, rowHeight: rowHeight, width: gridWidth, overscanRowCount: 2, overscanColumnCount: 1, children: Cell }) }));
};
exports.VirtualizedRegionGrid = VirtualizedRegionGrid;
/**
 * Hook for lazy loading regions based on visibility
 */
function useLazyRegionLoading(regions, containerRef) {
    var _a = react_1.default.useState(new Set()), visibleRegions = _a[0], setVisibleRegions = _a[1];
    var observer = (0, useIntersectionObserver_1.useIntersectionObserver)(containerRef, {
        threshold: 0.1,
        rootMargin: '100px'
    });
    (0, react_1.useEffect)(function () {
        if (!observer || !containerRef.current)
            return;
        var regionElements = containerRef.current.querySelectorAll('[data-region-id]');
        var visible = new Set();
        regionElements.forEach(function (el) {
            var regionId = el.getAttribute('data-region-id');
            if (regionId && observer.isIntersecting(el)) {
                visible.add(regionId);
            }
        });
        setVisibleRegions(visible);
    }, [observer, regions, containerRef]);
    return visibleRegions;
}
