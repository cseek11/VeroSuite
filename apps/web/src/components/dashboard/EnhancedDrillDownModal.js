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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var useDrillDown_1 = require("@/hooks/useDrillDown");
var exportUtils_1 = require("@/utils/exportUtils");
var utils_1 = require("@/lib/utils");
var logger_1 = require("@/utils/logger");
var EnhancedDrillDownModal = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, kpi = _a.kpi, data = _a.data, onDataRequest = _a.onDataRequest;
    var _b = (0, react_1.useState)(false), showFilters = _b[0], setShowFilters = _b[1];
    var _c = (0, react_1.useState)(false), showExportMenu = _c[0], setShowExportMenu = _c[1];
    var _d = (0, react_1.useState)(false), isLoading = _d[0], setIsLoading = _d[1];
    var _e = (0, react_1.useState)(0), _refreshKey = _e[0], setRefreshKey = _e[1];
    var drillDown = (0, useDrillDown_1.useDrillDown)({
        initialData: data,
        onDataChange: function (newData) {
            logger_1.logger.debug('Drill-down data changed', { recordsCount: newData.length }, 'EnhancedDrillDownModal');
        },
        onLevelChange: function (level) {
            logger_1.logger.debug('Drill-down level changed', { levelName: level.name }, 'EnhancedDrillDownModal');
        }
    });
    // Available filters for the current KPI
    var availableFilters = (0, react_1.useMemo)(function () {
        if (!kpi || !data.length)
            return [];
        var sampleRecord = data[0];
        var filters = [];
        // Add filters based on data structure
        Object.keys(sampleRecord).forEach(function (key) {
            var value = sampleRecord[key];
            if (value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)))) {
                filters.push({
                    id: "filter-".concat(key),
                    field: key,
                    label: key.replace(/_/g, ' ').replace(/\b\w/g, function (l) { return l.toUpperCase(); }),
                    type: 'date'
                });
            }
            else if (typeof value === 'number') {
                filters.push({
                    id: "filter-".concat(key),
                    field: key,
                    label: key.replace(/_/g, ' ').replace(/\b\w/g, function (l) { return l.toUpperCase(); }),
                    type: 'range'
                });
            }
            else if (typeof value === 'string' && value.length < 50) {
                // Get unique values for select filter
                var uniqueValues = __spreadArray([], new Set(data.map(function (item) { return item[key]; })), true).slice(0, 20);
                filters.push(__assign({ id: "filter-".concat(key), field: key, label: key.replace(/_/g, ' ').replace(/\b\w/g, function (l) { return l.toUpperCase(); }), type: uniqueValues.length <= 10 ? 'select' : 'text' }, (uniqueValues.length <= 10 ? { options: uniqueValues } : {})));
            }
        });
        return filters;
    }, [kpi, data]);
    var getCategoryIcon = function (category) {
        switch (category) {
            case 'financial':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "w-5 h-5 text-green-600" });
            case 'operational':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "w-5 h-5 text-blue-600" });
            case 'customer':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "w-5 h-5 text-purple-600" });
            case 'compliance':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-5 h-5 text-orange-600" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "w-5 h-5 text-gray-600" });
        }
    };
    var formatValue = function (value, unit) {
        if (unit === 'USD') {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(value);
        }
        if (unit === 'stars') {
            return "".concat(value.toFixed(1), " \u2B50");
        }
        if (unit === '%') {
            return "".concat(value.toFixed(1), "%");
        }
        return value.toLocaleString();
    };
    var handleDrillDown = function (row, field) { return __awaiter(void 0, void 0, void 0, function () {
        var newData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!onDataRequest)
                        return [2 /*return*/];
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, onDataRequest(field, { parentId: row.id || row[field] })];
                case 2:
                    newData = _a.sent();
                    drillDown.addLevel({
                        name: "".concat(field, ": ").concat(row[field]),
                        data: newData,
                        filters: {}
                    });
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    logger_1.logger.error('Failed to load drill-down data', error_1, 'EnhancedDrillDownModal');
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleExport = function (format) {
        var _a, _b, _c;
        if (!kpi || !drillDown.currentData.length)
            return;
        var exportData = {
            title: "".concat(kpi.metric, " - ").concat(((_a = drillDown.currentLevel) === null || _a === void 0 ? void 0 : _a.name) || 'Root'),
            level: drillDown.currentLevel,
            data: drillDown.currentData,
            filters: drillDown.state.filters.reduce(function (acc, filter) {
                if (filter.value !== undefined) {
                    acc[filter.label] = filter.value;
                }
                return acc;
            }, {}),
            metadata: {
                exportedAt: new Date().toISOString(),
                exportedBy: 'User', // You might want to get this from auth context
                totalRecords: ((_b = drillDown.currentLevel) === null || _b === void 0 ? void 0 : _b.data.length) || 0,
                filteredRecords: drillDown.currentData.length
            }
        };
        var options = {
            format: format,
            includeFilters: true,
            includeMetadata: true,
            filename: "".concat(kpi.metric, "_").concat(((_c = drillDown.currentLevel) === null || _c === void 0 ? void 0 : _c.name) || 'Root', "_").concat(new Date().toISOString().split('T')[0])
        };
        try {
            switch (format) {
                case 'csv':
                    (0, exportUtils_1.exportToCSV)(exportData, options);
                    break;
                case 'excel':
                    (0, exportUtils_1.exportToExcel)(exportData, options);
                    break;
                case 'pdf':
                    (0, exportUtils_1.exportToPDF)(exportData, options);
                    break;
            }
        }
        catch (error) {
            logger_1.logger.error('Export failed', error, 'EnhancedDrillDownModal');
        }
    };
    var handleRefresh = function () {
        setRefreshKey(function (prev) { return prev + 1; });
        // You might want to reload the current level data here
    };
    if (!isOpen || !kpi)
        return null;
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg shadow-xl max-w-7xl w-full mx-4 max-h-[95vh] overflow-hidden", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-6 border-b border-gray-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [getCategoryIcon(kpi.category), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-gray-900", children: kpi.metric }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: drillDown.breadcrumb.join(' › ') })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: handleRefresh, className: "p-2 text-gray-400 hover:text-gray-600 transition-colors", title: "Refresh data", children: (0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: (0, utils_1.cn)("w-5 h-5", isLoading && "animate-spin") }) }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600 transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-6 h-6" }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: drillDown.goBack, disabled: !drillDown.canGoBack, className: (0, utils_1.cn)("flex items-center space-x-1 px-3 py-1 rounded-md transition-colors", drillDown.canGoBack
                                        ? "text-gray-600 hover:bg-gray-200"
                                        : "text-gray-400 cursor-not-allowed"), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { children: "Back" })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: drillDown.goToRoot, className: "flex items-center space-x-1 px-3 py-1 text-gray-600 hover:bg-gray-200 rounded-md transition-colors", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Home, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { children: "Root" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search...", value: drillDown.state.searchTerm, onChange: function (e) { return drillDown.setSearchTerm(e.target.value); }, className: "pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 w-64" })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setShowFilters(!showFilters); }, className: (0, utils_1.cn)("flex items-center space-x-1 px-3 py-2 rounded-md transition-colors", showFilters
                                        ? "bg-purple-100 text-purple-700"
                                        : "text-gray-600 hover:bg-gray-200"), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { children: "Filters" }), drillDown.levelStats && drillDown.levelStats.filterCount > 0 && ((0, jsx_runtime_1.jsx)("span", { className: "bg-purple-600 text-white text-xs rounded-full px-2 py-0.5", children: drillDown.levelStats.filterCount }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center border border-gray-300 rounded-md", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return drillDown.setViewMode('table'); }, className: (0, utils_1.cn)("p-2 transition-colors", drillDown.state.viewMode === 'table'
                                                ? "bg-purple-100 text-purple-700"
                                                : "text-gray-600 hover:bg-gray-100"), title: "Table View", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Table, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return drillDown.setViewMode('chart'); }, className: (0, utils_1.cn)("p-2 transition-colors border-l border-gray-300", drillDown.state.viewMode === 'chart'
                                                ? "bg-purple-100 text-purple-700"
                                                : "text-gray-600 hover:bg-gray-100"), title: "Chart View", children: (0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return drillDown.setViewMode('cards'); }, className: (0, utils_1.cn)("p-2 transition-colors border-l border-gray-300 rounded-r-md", drillDown.state.viewMode === 'cards'
                                                ? "bg-purple-100 text-purple-700"
                                                : "text-gray-600 hover:bg-gray-100"), title: "Cards View", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Grid3X3, { className: "w-4 h-4" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setShowExportMenu(!showExportMenu); }, className: "flex items-center space-x-1 px-3 py-2 text-gray-600 hover:bg-gray-200 rounded-md transition-colors", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { children: "Export" }), (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronDown, { className: "w-4 h-4" })] }), showExportMenu && ((0, jsx_runtime_1.jsxs)("div", { className: "absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () {
                                                        handleExport('csv');
                                                        setShowExportMenu(false);
                                                    }, className: "w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors", children: "Export as CSV" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () {
                                                        handleExport('excel');
                                                        setShowExportMenu(false);
                                                    }, className: "w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors", children: "Export as Excel" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () {
                                                        handleExport('pdf');
                                                        setShowExportMenu(false);
                                                    }, className: "w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors rounded-b-md", children: "Export as PDF" })] }))] })] })] }), showFilters && ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-gray-50 border-b border-gray-200", children: [(0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: availableFilters.map(function (filter) {
                                var _a, _b, _c, _d, _e;
                                return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700", children: filter.label }), filter.type === 'select' && ((0, jsx_runtime_1.jsxs)("select", { value: filter.value || '', onChange: function (e) { return drillDown.updateFilter(filter.id, e.target.value || undefined); }, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "All" }), (_a = filter.options) === null || _a === void 0 ? void 0 : _a.map(function (option) { return ((0, jsx_runtime_1.jsx)("option", { value: option, children: option }, option)); })] })), filter.type === 'text' && ((0, jsx_runtime_1.jsx)("input", { type: "text", value: filter.value || '', onChange: function (e) { return drillDown.updateFilter(filter.id, e.target.value || undefined); }, placeholder: "Filter by ".concat(filter.label.toLowerCase(), "..."), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" })), filter.type === 'date' && ((0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "date", value: ((_b = filter.value) === null || _b === void 0 ? void 0 : _b.start) || '', onChange: function (e) { return drillDown.updateFilter(filter.id, __assign(__assign({}, filter.value), { start: e.target.value })); }, className: "flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" }), (0, jsx_runtime_1.jsx)("input", { type: "date", value: ((_c = filter.value) === null || _c === void 0 ? void 0 : _c.end) || '', onChange: function (e) { return drillDown.updateFilter(filter.id, __assign(__assign({}, filter.value), { end: e.target.value })); }, className: "flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" })] })), filter.type === 'range' && ((0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "number", placeholder: "Min", value: ((_d = filter.value) === null || _d === void 0 ? void 0 : _d.min) || '', onChange: function (e) { return drillDown.updateFilter(filter.id, __assign(__assign({}, filter.value), { min: e.target.value ? Number(e.target.value) : undefined })); }, className: "flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" }), (0, jsx_runtime_1.jsx)("input", { type: "number", placeholder: "Max", value: ((_e = filter.value) === null || _e === void 0 ? void 0 : _e.max) || '', onChange: function (e) { return drillDown.updateFilter(filter.id, __assign(__assign({}, filter.value), { max: e.target.value ? Number(e.target.value) : undefined })); }, className: "flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" })] }))] }, filter.id));
                            }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex justify-end mt-4", children: (0, jsx_runtime_1.jsx)("button", { onClick: drillDown.clearFilters, className: "px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors", children: "Clear All Filters" }) })] })), (0, jsx_runtime_1.jsxs)("div", { className: "p-6 overflow-y-auto max-h-[calc(95vh-300px)]", children: [drillDown.levelStats && ((0, jsx_runtime_1.jsx)("div", { className: "mb-6 p-4 bg-blue-50 rounded-lg", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium text-blue-700", children: "Total Records" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-blue-900", children: drillDown.levelStats.total })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium text-blue-700", children: "Filtered Records" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-blue-900", children: drillDown.levelStats.filtered })] }), drillDown.levelStats.filterCount > 0 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium text-blue-700", children: "Active Filters" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-blue-900", children: drillDown.levelStats.filterCount })] }))] }), drillDown.levelStats.filteredOut > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-blue-600", children: [drillDown.levelStats.filteredOut, " records filtered out"] }))] }) })), drillDown.currentData.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-12", children: (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500", children: "No data available" }) })) : ((0, jsx_runtime_1.jsxs)("div", { children: [drillDown.state.viewMode === 'table' && ((0, jsx_runtime_1.jsx)("div", { className: "bg-white border border-gray-200 rounded-lg overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "min-w-full divide-y divide-gray-200", children: [(0, jsx_runtime_1.jsx)("thead", { className: "bg-gray-50", children: (0, jsx_runtime_1.jsxs)("tr", { children: [Object.keys(drillDown.currentData[0] || {}).map(function (header) { return ((0, jsx_runtime_1.jsxs)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100", onClick: function () {
                                                                    var newOrder = drillDown.state.sortBy === header && drillDown.state.sortOrder === 'asc' ? 'desc' : 'asc';
                                                                    drillDown.setSorting(header, newOrder);
                                                                }, children: [header.replace(/_/g, ' ').replace(/\b\w/g, function (l) { return l.toUpperCase(); }), drillDown.state.sortBy === header && ((0, jsx_runtime_1.jsx)("span", { className: "ml-1", children: drillDown.state.sortOrder === 'asc' ? '↑' : '↓' }))] }, header)); }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { className: "bg-white divide-y divide-gray-200", children: drillDown.currentData.map(function (row, index) { return ((0, jsx_runtime_1.jsxs)("tr", { className: "hover:bg-gray-50", children: [Object.entries(row).map(function (_a) {
                                                                var key = _a[0], value = _a[1];
                                                                return ((0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: typeof value === 'number' && key.toLowerCase().includes('amount') ?
                                                                        formatValue(value, 'USD') :
                                                                        String(value || '') }, key));
                                                            }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: (0, jsx_runtime_1.jsx)("button", { onClick: function () { return handleDrillDown(row, 'customer'); }, className: "text-purple-600 hover:text-purple-900 transition-colors", children: "Drill Down" }) })] }, index)); }) })] }) }) })), drillDown.state.viewMode === 'chart' && ((0, jsx_runtime_1.jsx)("div", { className: "bg-white border border-gray-200 rounded-lg p-6", children: (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 text-center", children: "Chart view not yet implemented" }) })), drillDown.state.viewMode === 'cards' && ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: drillDown.currentData.map(function (row, index) { return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow", children: [Object.entries(row).slice(0, 4).map(function (_a) {
                                                var key = _a[0], value = _a[1];
                                                return ((0, jsx_runtime_1.jsxs)("div", { className: "mb-2", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-sm font-medium text-gray-600", children: [key.replace(/_/g, ' ').replace(/\b\w/g, function (l) { return l.toUpperCase(); }), ":"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-900", children: typeof value === 'number' && key.toLowerCase().includes('amount') ?
                                                                formatValue(value, 'USD') :
                                                                String(value || '') })] }, key));
                                            }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return handleDrillDown(row, 'customer'); }, className: "mt-3 text-purple-600 hover:text-purple-900 text-sm transition-colors", children: "Drill Down \u2192" })] }, index)); }) }))] }))] })] }) }));
};
exports.default = EnhancedDrillDownModal;
