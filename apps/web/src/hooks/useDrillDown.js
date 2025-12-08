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
exports.useDrillDown = useDrillDown;
var react_1 = require("react");
var logger_1 = require("@/utils/logger");
function useDrillDown(_a) {
    var _b = _a.initialData, initialData = _b === void 0 ? [] : _b, onLevelChange = _a.onLevelChange, _c = _a.maxLevels, maxLevels = _c === void 0 ? 5 : _c;
    var _d = (0, react_1.useState)({
        levels: initialData.length > 0 ? [{
                id: 'root',
                name: 'Root Level',
                data: initialData,
                filters: {},
                breadcrumb: ['Root']
            }] : [],
        currentLevel: 0,
        filters: [],
        searchTerm: '',
        sortBy: '',
        sortOrder: 'asc',
        viewMode: 'table'
    }), state = _d[0], setState = _d[1];
    // Navigate to a specific level
    var navigateToLevel = (0, react_1.useCallback)(function (levelIndex) {
        if (levelIndex >= 0 && levelIndex < state.levels.length) {
            setState(function (prev) { return (__assign(__assign({}, prev), { currentLevel: levelIndex })); });
            var level = state.levels[levelIndex];
            if (level && onLevelChange) {
                onLevelChange(level);
            }
        }
    }, [state.levels, onLevelChange]);
    // Add a new drill-down level
    var addLevel = (0, react_1.useCallback)(function (levelData) {
        var _a;
        if (state.levels.length >= maxLevels) {
            logger_1.logger.warn('Maximum drill-down levels reached', { maxLevels: maxLevels }, 'useDrillDown');
            return;
        }
        var newLevel = __assign(__assign({}, levelData), { id: "level-".concat(Date.now()), breadcrumb: __spreadArray(__spreadArray([], ((_a = state.levels[state.currentLevel]) === null || _a === void 0 ? void 0 : _a.breadcrumb) || [], true), [
                levelData.name
            ], false) });
        setState(function (prev) { return (__assign(__assign({}, prev), { levels: __spreadArray(__spreadArray([], prev.levels.slice(0, prev.currentLevel + 1), true), [newLevel], false), currentLevel: prev.currentLevel + 1 })); });
        onLevelChange === null || onLevelChange === void 0 ? void 0 : onLevelChange(newLevel);
    }, [state.levels, state.currentLevel, maxLevels, onLevelChange]);
    // Go back to previous level
    var goBack = (0, react_1.useCallback)(function () {
        if (state.currentLevel > 0) {
            navigateToLevel(state.currentLevel - 1);
        }
    }, [state.currentLevel, navigateToLevel]);
    // Go to root level
    var goToRoot = (0, react_1.useCallback)(function () {
        navigateToLevel(0);
    }, [navigateToLevel]);
    // Update filters
    var updateFilter = (0, react_1.useCallback)(function (filterId, value) {
        setState(function (prev) { return (__assign(__assign({}, prev), { filters: prev.filters.map(function (filter) {
                return filter.id === filterId ? __assign(__assign({}, filter), { value: value }) : filter;
            }) })); });
    }, []);
    // Add filter
    var addFilter = (0, react_1.useCallback)(function (filter) {
        setState(function (prev) { return (__assign(__assign({}, prev), { filters: __spreadArray(__spreadArray([], prev.filters, true), [filter], false) })); });
    }, []);
    // Remove filter
    var removeFilter = (0, react_1.useCallback)(function (filterId) {
        setState(function (prev) { return (__assign(__assign({}, prev), { filters: prev.filters.filter(function (filter) { return filter.id !== filterId; }) })); });
    }, []);
    // Clear all filters
    var clearFilters = (0, react_1.useCallback)(function () {
        setState(function (prev) { return (__assign(__assign({}, prev), { filters: prev.filters.map(function (filter) { return (__assign(__assign({}, filter), { value: undefined })); }) })); });
    }, []);
    // Update search term
    var setSearchTerm = (0, react_1.useCallback)(function (searchTerm) {
        setState(function (prev) { return (__assign(__assign({}, prev), { searchTerm: searchTerm })); });
    }, []);
    // Update sorting
    var setSorting = (0, react_1.useCallback)(function (sortBy, sortOrder) {
        setState(function (prev) { return (__assign(__assign({}, prev), { sortBy: sortBy, sortOrder: sortOrder })); });
    }, []);
    // Update view mode
    var setViewMode = (0, react_1.useCallback)(function (viewMode) {
        setState(function (prev) { return (__assign(__assign({}, prev), { viewMode: viewMode })); });
    }, []);
    // Get filtered and sorted data for current level
    var currentData = (0, react_1.useMemo)(function () {
        var level = state.levels[state.currentLevel];
        if (!level)
            return [];
        var filteredData = __spreadArray([], level.data, true);
        // Apply search filter
        if (state.searchTerm) {
            var searchLower_1 = state.searchTerm.toLowerCase();
            filteredData = filteredData.filter(function (item) {
                return Object.values(item).some(function (value) {
                    return String(value).toLowerCase().includes(searchLower_1);
                });
            });
        }
        // Apply custom filters
        state.filters.forEach(function (filter) {
            if (filter.value !== undefined && filter.value !== null && filter.value !== '') {
                filteredData = filteredData.filter(function (item) {
                    var itemValue = item[filter.field];
                    switch (filter.type) {
                        case 'date':
                            if (filter.value.start && filter.value.end) {
                                var itemDate = new Date(itemValue);
                                return itemDate >= new Date(filter.value.start) &&
                                    itemDate <= new Date(filter.value.end);
                            }
                            return true;
                        case 'select':
                            return itemValue === filter.value;
                        case 'range':
                            return itemValue >= filter.value.min && itemValue <= filter.value.max;
                        case 'text':
                            return String(itemValue).toLowerCase().includes(String(filter.value).toLowerCase());
                        default:
                            return true;
                    }
                });
            }
        });
        // Apply sorting
        if (state.sortBy) {
            filteredData.sort(function (a, b) {
                var aValue = a[state.sortBy];
                var bValue = b[state.sortBy];
                if (aValue < bValue)
                    return state.sortOrder === 'asc' ? -1 : 1;
                if (aValue > bValue)
                    return state.sortOrder === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return filteredData;
    }, [state.levels, state.currentLevel, state.searchTerm, state.filters, state.sortBy, state.sortOrder]);
    // Get current level info
    var currentLevel = state.levels[state.currentLevel];
    // Get breadcrumb path
    var breadcrumb = (currentLevel === null || currentLevel === void 0 ? void 0 : currentLevel.breadcrumb) || [];
    // Check if can go back
    var canGoBack = state.currentLevel > 0;
    // Check if can add level
    var canAddLevel = state.levels.length < maxLevels;
    // Get level statistics
    var levelStats = (0, react_1.useMemo)(function () {
        var level = state.levels[state.currentLevel];
        if (!level)
            return null;
        var total = level.data.length;
        var filtered = currentData.length;
        var filteredOut = total - filtered;
        return {
            total: total,
            filtered: filtered,
            filteredOut: filteredOut,
            filterCount: state.filters.filter(function (f) { return f.value !== undefined; }).length,
            hasSearch: !!state.searchTerm
        };
    }, [state.levels, state.currentLevel, currentData, state.filters, state.searchTerm]);
    return {
        // State
        state: state,
        currentLevel: currentLevel,
        currentData: currentData,
        breadcrumb: breadcrumb,
        levelStats: levelStats,
        // Navigation
        navigateToLevel: navigateToLevel,
        addLevel: addLevel,
        goBack: goBack,
        goToRoot: goToRoot,
        canGoBack: canGoBack,
        canAddLevel: canAddLevel,
        // Filters
        updateFilter: updateFilter,
        addFilter: addFilter,
        removeFilter: removeFilter,
        clearFilters: clearFilters,
        // Search and sort
        setSearchTerm: setSearchTerm,
        setSorting: setSorting,
        setViewMode: setViewMode,
        // Utilities
        reset: function () { return setState({
            levels: initialData.length > 0 ? [{
                    id: 'root',
                    name: 'Root Level',
                    data: initialData,
                    filters: {},
                    breadcrumb: ['Root']
                }] : [],
            currentLevel: 0,
            filters: [],
            searchTerm: '',
            sortBy: '',
            sortOrder: 'asc',
            viewMode: 'table'
        }); }
    };
}
