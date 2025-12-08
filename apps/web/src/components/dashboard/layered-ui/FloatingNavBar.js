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
exports.FloatingNavBar = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
var region_types_1 = require("@/routes/dashboard/types/region.types");
var FloatingNavBar = function (_a) {
    var _b = _a.filters, filters = _b === void 0 ? [] : _b, onSearch = _a.onSearch, onAdvancedFiltersChange = _a.onAdvancedFiltersChange, _c = _a.title, title = _c === void 0 ? 'Filters & Context' : _c, _d = _a.searchPlaceholder, searchPlaceholder = _d === void 0 ? 'Search regions...' : _d, _e = _a.inline, inline = _e === void 0 ? false : _e, _f = _a.offsetTop, offsetTop = _f === void 0 ? 16 : _f;
    var _g = (0, react_1.useState)(false), isOpen = _g[0], setIsOpen = _g[1];
    var _h = (0, react_1.useState)(''), searchTerm = _h[0], setSearchTerm = _h[1];
    var _j = (0, react_1.useState)(false), showAdvanced = _j[0], setShowAdvanced = _j[1];
    var _k = (0, react_1.useState)({
        types: [],
        status: 'all',
        dateRange: 'all'
    }), advancedFilters = _k[0], setAdvancedFilters = _k[1];
    var handleSearchChange = function (e) {
        var term = e.target.value;
        setSearchTerm(term);
        onSearch === null || onSearch === void 0 ? void 0 : onSearch(term);
    };
    var handleAdvancedFilterChange = function (updates) {
        var newFilters = __assign(__assign({}, advancedFilters), updates);
        setAdvancedFilters(newFilters);
        onAdvancedFiltersChange === null || onAdvancedFiltersChange === void 0 ? void 0 : onAdvancedFiltersChange(newFilters);
    };
    var handleTypeToggle = function (type) {
        var currentTypes = advancedFilters.types;
        var newTypes = currentTypes.includes(type)
            ? currentTypes.filter(function (t) { return t !== type; })
            : __spreadArray(__spreadArray([], currentTypes, true), [type], false);
        handleAdvancedFilterChange({ types: newTypes });
    };
    var activeFiltersCount = filters.filter(function (f) { return f.active; }).length +
        (advancedFilters.types.length > 0 ? 1 : 0) +
        (advancedFilters.status !== 'all' ? 1 : 0) +
        (advancedFilters.dateRange !== 'all' ? 1 : 0);
    var clearAllFilters = function () {
        setSearchTerm('');
        onSearch === null || onSearch === void 0 ? void 0 : onSearch('');
        setAdvancedFilters({ types: [], status: 'all', dateRange: 'all' });
        onAdvancedFiltersChange === null || onAdvancedFiltersChange === void 0 ? void 0 : onAdvancedFiltersChange({ types: [], status: 'all', dateRange: 'all' });
    };
    var hasActiveFilters = activeFiltersCount > 0 || searchTerm.length > 0;
    return ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, __assign({ initial: { y: inline ? 0 : -100 }, animate: { y: 0 }, className: inline ? 'w-full' : 'fixed right-4 z-40' }, (!inline && offsetTop !== undefined ? { style: { top: offsetTop } } : {}), { children: (0, jsx_runtime_1.jsxs)("div", { className: inline
                ? 'bg-white/80 backdrop-blur rounded-md border border-gray-200 overflow-hidden w-full'
                : 'bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden min-w-[320px] max-w-[400px]', children: [(0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setIsOpen(!isOpen); }, className: "flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors w-full", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { className: "w-4 h-4 text-gray-600" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium text-gray-700", children: title }), activeFiltersCount > 0 && ((0, jsx_runtime_1.jsx)("span", { className: "px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full", children: activeFiltersCount })), (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronDown, { className: "w-4 h-4 text-gray-400 ml-auto transition-transform ".concat(isOpen ? 'rotate-180' : '') })] }), (0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { children: isOpen && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: 0.2 }, className: "overflow-hidden", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-4 space-y-4 border-t border-gray-200 ".concat(inline ? 'max-h-72' : 'max-h-[70vh]', " overflow-y-auto"), children: [onSearch && ((0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: searchTerm, onChange: handleSearchChange, placeholder: searchPlaceholder, className: "w-full pl-8 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent", autoFocus: isOpen }), searchTerm && ((0, jsx_runtime_1.jsx)("button", { onClick: function () {
                                                setSearchTerm('');
                                                onSearch('');
                                            }, className: "absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors", "aria-label": "Clear search", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4" }) }))] })), filters.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-xs font-medium text-gray-700 mb-2", children: "Quick Filters" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-1", children: filters.map(function (filter) { return ((0, jsx_runtime_1.jsx)("button", { onClick: filter.onClick, className: "w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ".concat(filter.active
                                                    ? 'bg-purple-100 text-purple-700 font-medium'
                                                    : 'hover:bg-gray-100 text-gray-700'), children: filter.label }, filter.id)); }) })] })), (0, jsx_runtime_1.jsxs)("div", { className: "border-t border-gray-200 pt-4", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setShowAdvanced(!showAdvanced); }, className: "flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.SlidersHorizontal, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { children: "Advanced Filters" })] }), showAdvanced ? ((0, jsx_runtime_1.jsx)(lucide_react_1.ChevronUp, { className: "w-4 h-4" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.ChevronDown, { className: "w-4 h-4" }))] }), (0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { children: showAdvanced && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: 0.2 }, className: "overflow-hidden", children: (0, jsx_runtime_1.jsxs)("div", { className: "mt-4 space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-2", children: "Region Type" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 gap-2", children: Object.values(region_types_1.RegionType).map(function (type) {
                                                                        var isSelected = advancedFilters.types.includes(type);
                                                                        return ((0, jsx_runtime_1.jsx)("button", { onClick: function () { return handleTypeToggle(type); }, className: "px-3 py-1.5 text-xs rounded-md border transition-colors ".concat(isSelected
                                                                                ? 'bg-purple-100 border-purple-300 text-purple-700 font-medium'
                                                                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'), children: type.replace('-', ' ').replace(/\b\w/g, function (l) { return l.toUpperCase(); }) }, type));
                                                                    }) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-xs font-medium text-gray-700 mb-2", children: "Status" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 gap-2", children: ['all', 'active', 'locked', 'collapsed'].map(function (status) { return ((0, jsx_runtime_1.jsx)("button", { onClick: function () { return handleAdvancedFilterChange({ status: status }); }, className: "px-3 py-1.5 text-xs rounded-md border transition-colors ".concat(advancedFilters.status === status
                                                                            ? 'bg-purple-100 border-purple-300 text-purple-700 font-medium'
                                                                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'), children: status.charAt(0).toUpperCase() + status.slice(1) }, status)); }) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-xs font-medium text-gray-700 mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-3 h-3 inline mr-1" }), "Date Range"] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 gap-2", children: ['all', 'today', 'week', 'month'].map(function (range) { return ((0, jsx_runtime_1.jsx)("button", { onClick: function () { return handleAdvancedFilterChange({ dateRange: range }); }, className: "px-3 py-1.5 text-xs rounded-md border transition-colors ".concat(advancedFilters.dateRange === range
                                                                            ? 'bg-purple-100 border-purple-300 text-purple-700 font-medium'
                                                                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'), children: range.charAt(0).toUpperCase() + range.slice(1) }, range)); }) })] })] }) })) })] }), hasActiveFilters && ((0, jsx_runtime_1.jsx)("div", { className: "pt-2 border-t border-gray-200", children: (0, jsx_runtime_1.jsxs)("button", { onClick: clearAllFilters, className: "w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4" }), "Clear All Filters"] }) }))] }) })) })] }) })));
};
exports.FloatingNavBar = FloatingNavBar;
