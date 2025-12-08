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
exports.useLayoutIntelligence = useLayoutIntelligence;
var react_1 = require("react");
var region_types_1 = require("@/routes/dashboard/types/region.types");
function useLayoutIntelligence(_a) {
    var regions = _a.regions, _b = _a.userRole, userRole = _b === void 0 ? 'user' : _b, _c = _a.currentTime, currentTime = _c === void 0 ? new Date() : _c, workloadMetrics = _a.workloadMetrics;
    var _d = (0, react_1.useState)('custom'), mode = _d[0], setMode = _d[1];
    // Auto-layout: Context-aware arrangement
    var optimizeLayout = (0, react_1.useCallback)(function () {
        if (mode !== 'auto')
            return regions;
        var optimized = __spreadArray([], regions, true);
        var hour = currentTime.getHours();
        var isPeakHours = hour >= 8 && hour <= 18;
        var hasHighWorkload = ((workloadMetrics === null || workloadMetrics === void 0 ? void 0 : workloadMetrics.activeJobs) || 0) > 10;
        // Reorder regions based on context
        optimized.sort(function (a, b) {
            // Priority 1: Dispatch/Schedule regions during peak hours
            if (isPeakHours) {
                if (a.region_type === region_types_1.RegionType.SCHEDULING)
                    return -1;
                if (b.region_type === region_types_1.RegionType.SCHEDULING)
                    return 1;
            }
            // Priority 2: Reports/analytics during low workload
            if (!hasHighWorkload) {
                if (a.region_type === region_types_1.RegionType.REPORTS || a.region_type === region_types_1.RegionType.ANALYTICS)
                    return -1;
                if (b.region_type === region_types_1.RegionType.REPORTS || b.region_type === region_types_1.RegionType.ANALYTICS)
                    return 1;
            }
            // Priority 3: Role-based ordering
            if (userRole === 'technician') {
                if (a.region_type === region_types_1.RegionType.SCHEDULING)
                    return -1;
                if (b.region_type === region_types_1.RegionType.SCHEDULING)
                    return 1;
            }
            if (userRole === 'manager' || userRole === 'admin') {
                if (a.region_type === region_types_1.RegionType.REPORTS || a.region_type === region_types_1.RegionType.ANALYTICS)
                    return -1;
                if (b.region_type === region_types_1.RegionType.REPORTS || b.region_type === region_types_1.RegionType.ANALYTICS)
                    return 1;
            }
            return 0;
        });
        // Reposition regions in grid
        var currentRow = 0;
        var currentCol = 0;
        var maxCols = 4;
        return optimized.map(function (region) {
            var newRegion = __assign({}, region);
            // Calculate grid position
            newRegion.grid_row = currentRow;
            newRegion.grid_col = currentCol;
            // Adjust size based on importance
            if (isPeakHours && region.region_type === region_types_1.RegionType.SCHEDULING) {
                newRegion.col_span = Math.min(3, maxCols - currentCol);
                newRegion.row_span = 2;
            }
            else {
                newRegion.col_span = Math.min(2, maxCols - currentCol);
                newRegion.row_span = 1;
            }
            // Move to next position
            currentCol += newRegion.col_span;
            if (currentCol >= maxCols) {
                currentCol = 0;
                currentRow += newRegion.row_span;
            }
            return newRegion;
        });
    }, [mode, regions, currentTime, workloadMetrics, userRole]);
    // Get contextual behavior for a region
    var getContextualBehavior = (0, react_1.useCallback)(function (regionId) {
        var region = regions.find(function (r) { return r.id === regionId; });
        if (!region) {
            return { shouldExpand: false, priority: 0, visibility: 'visible' };
        }
        var hour = currentTime.getHours();
        var isPeakHours = hour >= 8 && hour <= 18;
        var hasHighWorkload = ((workloadMetrics === null || workloadMetrics === void 0 ? void 0 : workloadMetrics.activeJobs) || 0) > 10;
        var shouldExpand = false;
        var priority = 0;
        var visibility = 'visible';
        // Context-aware behavior
        if (region.region_type === region_types_1.RegionType.SCHEDULING) {
            shouldExpand = isPeakHours || hasHighWorkload;
            priority = isPeakHours ? 10 : 5;
        }
        if (region.region_type === region_types_1.RegionType.REPORTS || region.region_type === region_types_1.RegionType.ANALYTICS) {
            shouldExpand = !hasHighWorkload;
            priority = hasHighWorkload ? 2 : 7;
            visibility = hasHighWorkload ? 'collapsed' : 'visible';
        }
        // Role-based visibility
        if (userRole === 'technician') {
            if (region.region_type === region_types_1.RegionType.SETTINGS) {
                visibility = 'hidden';
            }
        }
        return { shouldExpand: shouldExpand, priority: priority, visibility: visibility };
    }, [regions, currentTime, workloadMetrics, userRole]);
    var suggestedLayout = (0, react_1.useMemo)(function () {
        if (mode === 'auto') {
            return optimizeLayout();
        }
        return regions;
    }, [mode, regions, optimizeLayout]);
    return {
        mode: mode,
        setMode: setMode,
        suggestedLayout: suggestedLayout,
        optimizeLayout: optimizeLayout,
        getContextualBehavior: getContextualBehavior
    };
}
