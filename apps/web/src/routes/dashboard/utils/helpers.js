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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleTemplateLibraryUseTemplate = exports.handleKpiBuilderUseTemplate = exports.createRenderVirtualCard = exports.renderCardComponent = exports.isUserTemplate = exports.normalizeKpiForDisplay = exports.getCardTypes = exports.getDefaultCardSize = exports.availableKpiFields = exports.defaultCardSizes = exports.mockMetrics = exports.AUTO_CREATE_FROM_USER_KPIS = exports.KPI_DATA_STORAGE_KEY = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var enhanced_api_1 = require("@/lib/enhanced-api");
var kpiTemplateUtils_1 = require("@/utils/kpiTemplateUtils");
var LoadingSpinner_1 = require("@/components/LoadingSpinner");
var cards_1 = require("@/components/cards");
var lucide_react_1 = require("lucide-react");
var ResizeHandle_1 = __importDefault(require("@/components/dashboard/ResizeHandle"));
var CardFocusManager_1 = require("@/components/dashboard/CardFocusManager");
var DashboardMetrics_1 = __importDefault(require("@/components/dashboard/DashboardMetrics"));
var QuickActionsCard_1 = __importDefault(require("@/components/dashboard/QuickActionsCard"));
var SmartKPITest_1 = __importDefault(require("@/components/dashboard/SmartKPITest"));
var SmartKPIDebug_1 = __importDefault(require("@/components/dashboard/SmartKPIDebug"));
var cards_2 = require("@/components/cards");
// Constants
exports.KPI_DATA_STORAGE_KEY = 'vero_kpi_data_v1';
exports.AUTO_CREATE_FROM_USER_KPIS = false;
exports.mockMetrics = [
    {
        title: 'Total Customers',
        value: '2,143',
        icon: 'Users',
        color: '#3B82F6',
        change: 12,
        changeType: 'increase'
    },
    {
        title: 'Active Jobs',
        value: '47',
        icon: 'Calendar',
        color: '#10B981',
        change: 8,
        changeType: 'increase'
    },
    {
        title: 'Revenue',
        value: '$45,230',
        icon: 'TrendingUp',
        color: '#8B5CF6',
        change: 15,
        changeType: 'increase'
    },
    {
        title: 'Technicians',
        value: '12',
        icon: 'Users',
        color: '#F59E0B',
        change: 2,
        changeType: 'increase'
    }
];
exports.defaultCardSizes = {
    'jobs-calendar': { width: 300, height: 220 },
    'recent-activity': { width: 260, height: 200 },
    'customer-search': { width: 260, height: 160 },
    'reports': { width: 280, height: 180 },
    'quick-actions': { width: 260, height: 160 },
    'kpi-builder': { width: 320, height: 240 },
    'predictive-analytics': { width: 300, height: 200 },
    'auto-layout': { width: 280, height: 180 },
    'routing': { width: 320, height: 240 },
    'team-overview': { width: 300, height: 200 },
    'financial-summary': { width: 280, height: 180 },
    'dashboard-metrics': { width: 280, height: 180 },
    'smart-kpis': { width: 280, height: 180 },
    'smart-kpis-test': { width: 280, height: 180 },
    'smart-kpis-debug': { width: 280, height: 180 },
    'kpi-display': { width: 300, height: 200 },
    'kpi-template': { width: 280, height: 180 }
};
exports.availableKpiFields = [
    { id: 'jobs_completed', name: 'Jobs Completed', type: 'number', table: 'jobs', column: 'status', aggregation: 'count' },
    { id: 'revenue_total', name: 'Total Revenue', type: 'number', table: 'invoices', column: 'amount', aggregation: 'sum' },
    { id: 'customer_count', name: 'Customer Count', type: 'number', table: 'customers', column: 'id', aggregation: 'count' },
    { id: 'avg_rating', name: 'Average Rating', type: 'number', table: 'reviews', column: 'rating', aggregation: 'avg' },
    { id: 'completion_rate', name: 'Completion Rate', type: 'number', table: 'jobs', column: 'status', aggregation: 'count' }
];
// Helper functions
var getDefaultCardSize = function (type) {
    return exports.defaultCardSizes[type] || { width: 280, height: 180 };
};
exports.getDefaultCardSize = getDefaultCardSize;
var getCardTypes = function (onOpenKPIBuilder) { return [
    {
        id: 'dashboard-metrics',
        name: 'Dashboard Metrics',
        component: function () { return (0, jsx_runtime_1.jsx)(DashboardMetrics_1.default, { metrics: exports.mockMetrics }); }
    },
    {
        id: 'smart-kpis',
        name: 'Smart KPIs',
        component: function () { return (0, jsx_runtime_1.jsx)(DashboardMetrics_1.default, { metrics: exports.mockMetrics, enableSmartKPIs: true }); }
    },
    {
        id: 'smart-kpis-test',
        name: 'Smart KPIs Test',
        component: function () { return (0, jsx_runtime_1.jsx)(SmartKPITest_1.default, {}); }
    },
    {
        id: 'smart-kpis-debug',
        name: 'Smart KPIs Debug',
        component: function () { return (0, jsx_runtime_1.jsx)(SmartKPIDebug_1.default, {}); }
    },
    { id: 'jobs-calendar', name: 'Jobs Calendar', component: function () { return (0, jsx_runtime_1.jsx)("div", { className: "p-4 text-gray-600", children: "Jobs Calendar - Coming Soon" }); } },
    { id: 'recent-activity', name: 'Recent Activity', component: function () { return (0, jsx_runtime_1.jsx)("div", { className: "p-4 text-gray-600", children: "Recent Activity - Coming Soon" }); } },
    { id: 'customer-search', name: 'Customer Search', component: function () { return (0, jsx_runtime_1.jsx)("div", { className: "p-4 text-gray-600", children: "Customer Search - Coming Soon" }); } },
    { id: 'reports', name: 'Reports', component: function () { return (0, jsx_runtime_1.jsx)("div", { className: "p-4 text-gray-600", children: "Reports - Coming Soon" }); } },
    { id: 'quick-actions', name: 'Quick Actions', component: function () { return (0, jsx_runtime_1.jsx)(QuickActionsCard_1.default, {}); } },
    { id: 'kpi-builder', name: 'KPI Builder', component: function () { return (0, jsx_runtime_1.jsx)(cards_2.KpiBuilderCard, { onOpenBuilder: onOpenKPIBuilder }); } },
    { id: 'predictive-analytics', name: 'Predictive Analytics', component: function () { return (0, jsx_runtime_1.jsx)(cards_2.PredictiveAnalyticsCard, {}); } },
    { id: 'auto-layout', name: 'Auto-Layout', component: function () { return (0, jsx_runtime_1.jsx)(cards_2.AutoLayoutCard, {}); } },
    { id: 'routing', name: 'Routing', component: function () { return (0, jsx_runtime_1.jsx)("div", { className: "p-4 text-gray-600", children: "Routing - Coming Soon" }); } },
    { id: 'team-overview', name: 'Team Overview', component: function () { return (0, jsx_runtime_1.jsx)("div", { className: "p-4 text-gray-600", children: "Team Overview - Coming Soon" }); } },
    { id: 'financial-summary', name: 'Financial Summary', component: function () { return (0, jsx_runtime_1.jsx)("div", { className: "p-4 text-gray-600", children: "Financial Summary - Coming Soon" }); } },
    {
        id: 'kpi-display',
        name: 'KPI Display',
        component: function (_a) {
            var cardId = _a.cardId;
            return ((0, jsx_runtime_1.jsx)(cards_1.KpiDisplayCard, { cardId: cardId !== null && cardId !== void 0 ? cardId : 'kpi-display', kpiData: {} }));
        }
    },
    { id: 'kpi-template', name: 'KPI Template', component: function (_a) {
            var cardId = _a.cardId, onOpenTemplateLibrary = _a.onOpenTemplateLibrary;
            return (0, jsx_runtime_1.jsx)(cards_2.KpiTemplateCard, { cardId: cardId, onOpenTemplateLibrary: onOpenTemplateLibrary });
        } }
]; };
exports.getCardTypes = getCardTypes;
var normalizeKpiForDisplay = function (kpi) { return ({
    id: kpi.id,
    name: kpi.name,
    description: kpi.description || 'User-defined KPI',
    category: kpi.category || 'operational',
    formula_expression: kpi.formula_expression || kpi.formulaExpression,
    formula_fields: kpi.formula_fields || kpi.formulaFields || [],
    threshold_config: kpi.threshold_config || kpi.threshold || {},
    chart_config: kpi.chart_config || kpi.chart || { type: 'number' },
    data_source_config: kpi.data_source_config || {},
    tags: kpi.tags || [],
    is_active: kpi.is_active !== false && (kpi.enabled !== false),
    created_at: kpi.created_at,
    template_id: kpi.template_id || kpi.templateId,
    user_id: kpi.user_id,
    tenant_id: kpi.tenant_id,
    enabled: kpi.is_active !== false && (kpi.enabled !== false),
    realTime: kpi.realTime || false,
    threshold: (kpi.threshold_config || kpi.threshold) || {
        green: 80,
        yellow: 60,
        unit: '%'
    },
    chart: kpi.chart_config || kpi.chart || { type: 'line' }
}); };
exports.normalizeKpiForDisplay = normalizeKpiForDisplay;
var isUserTemplate = function (template) {
    var _a, _b, _c;
    var t = template;
    return ((t === null || t === void 0 ? void 0 : t.template_type) === 'user' ||
        (t === null || t === void 0 ? void 0 : t.source) === 'user' ||
        (t === null || t === void 0 ? void 0 : t.source) === 'user_kpis' ||
        !!(t === null || t === void 0 ? void 0 : t.user_id) ||
        typeof (t === null || t === void 0 ? void 0 : t.is_active) !== 'undefined' ||
        (t === null || t === void 0 ? void 0 : t.created_by_user) === true ||
        (t === null || t === void 0 ? void 0 : t.is_custom) === true ||
        (t === null || t === void 0 ? void 0 : t.category) === 'custom' ||
        (t === null || t === void 0 ? void 0 : t.category) === 'user_created' ||
        ((t === null || t === void 0 ? void 0 : t.formula) && typeof t.formula === 'object' && t.formula.user_defined) ||
        ((t === null || t === void 0 ? void 0 : t.threshold) && typeof t.threshold === 'object' && t.threshold.user_customized) ||
        ((_a = t === null || t === void 0 ? void 0 : t.metadata) === null || _a === void 0 ? void 0 : _a.user_created) ||
        ((_b = t === null || t === void 0 ? void 0 : t.tags) === null || _b === void 0 ? void 0 : _b.includes('user-created')) ||
        ((_c = t === null || t === void 0 ? void 0 : t.tags) === null || _c === void 0 ? void 0 : _c.includes('custom')));
};
exports.isUserTemplate = isUserTemplate;
// Render helpers
var renderCardComponent = function (card, cardTypes, kpiData, setShowTemplateLibrary) {
    var cardType = cardTypes.find(function (type) { return type.id === card.type; });
    var CardComponent = (cardType === null || cardType === void 0 ? void 0 : cardType.component) || (function () { return (0, jsx_runtime_1.jsx)("div", { children: "Unknown Card Type" }); });
    if (card.type === 'kpi-display') {
        if (!kpiData[card.id]) {
            return ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full flex items-center justify-center text-gray-400", children: (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, {}) }));
        }
        return (0, jsx_runtime_1.jsx)(cards_1.KpiDisplayCard, { cardId: card.id, kpiData: kpiData });
    }
    if (card.type === 'kpi-template' && typeof CardComponent === 'function') {
        return CardComponent({
            cardId: card.id,
            onOpenTemplateLibrary: function () { return setShowTemplateLibrary(true); }
        });
    }
    return CardComponent();
};
exports.renderCardComponent = renderCardComponent;
var createRenderVirtualCard = function (selectedCards, isDraggingMultiple, draggedCardId, isCardLocked, getCardGroup, searchTerm, filteredCards, handleDragStart, handleCardClick, toggleCardLock, removeCard, cardTypes, kpiData, setShowTemplateLibrary, resizingCardId, handleResizeStart, keyboardNavigation) {
    return function (card, _index) {
        var _a, _b, _c;
        return ((0, jsx_runtime_1.jsx)(CardFocusManager_1.CardFocusManager, { cardId: card.id, isFocused: keyboardNavigation.focusedCardId === card.id, isSelected: selectedCards.has(card.id), navigationMode: keyboardNavigation.navigationMode, isNavigating: keyboardNavigation.isNavigating, className: "absolute bg-white rounded-lg shadow-lg border transition-all duration-200 group overflow-visible ".concat(selectedCards.has(card.id)
                ? "".concat(isDraggingMultiple && selectedCards.has(card.id) ? 'opacity-80 scale-95' : '')
                : 'hover:shadow-xl border-gray-200 hover:border-purple-200', " ").concat(draggedCardId === card.id ? 'z-50 rotate-1 scale-105 shadow-2xl' : 'z-10', " ").concat(isCardLocked(card.id) || ((_a = getCardGroup(card.id)) === null || _a === void 0 ? void 0 : _a.locked)
                ? 'border-red-400 bg-red-50/30 cursor-default'
                : card.type === 'customers-page' || card.id.includes('-page')
                    ? 'border-blue-400 bg-blue-50/30 cursor-default'
                    : 'cursor-move', " ").concat(searchTerm && filteredCards.find(function (c) { return c.id === card.id; }) ? 'ring-2 ring-yellow-400 bg-yellow-50/30' : ''), style: {
                left: card.x,
                top: card.y,
                width: card.width,
                height: card.height
            }, onFocus: function (e) {
                if (!e || !e.target)
                    return;
                // Only navigate if the focus didn't come from a button click
                if (e.target === e.currentTarget || !e.target.closest('button')) {
                    keyboardNavigation.navigateToCard(card.id);
                }
            }, children: (0, jsx_runtime_1.jsxs)("div", { onMouseDown: function (e) {
                    var cardGroup = getCardGroup(card.id);
                    if (!isCardLocked(card.id) && (!cardGroup || !(cardGroup === null || cardGroup === void 0 ? void 0 : cardGroup.locked))) {
                        handleDragStart(card.id, e);
                    }
                }, onClick: function (e) { return handleCardClick(card.id, e); }, children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-purple-600 text-white text-center font-semibold transition-all duration-300 ease-out overflow-hidden rounded-t-xl group-hover:!h-12 group-hover:!opacity-100 ".concat(card.type === 'customers-page' || card.id.includes('-page') ? 'cursor-default' : 'cursor-move'), style: {
                            height: selectedCards.has(card.id) ? '48px' : '0px',
                            opacity: selectedCards.has(card.id) ? 1 : 0,
                        }, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between px-4 py-3 h-full", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-bold text-white text-sm", children: card.type === 'kpi-display' && ((_b = kpiData[card.id]) === null || _b === void 0 ? void 0 : _b.name)
                                        ? kpiData[card.id].name
                                        : ((_c = cardTypes.find(function (t) { return t.id === card.type; })) === null || _c === void 0 ? void 0 : _c.name) || 'Unknown Card' }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function (e) {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                toggleCardLock(card.id);
                                            }, onMouseDown: function (e) { return e.stopPropagation(); }, tabIndex: -1, className: "p-1.5 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-opacity-50 ".concat(isCardLocked(card.id)
                                                ? 'hover:bg-red-500/20 text-red-200 hover:text-red-100 focus:ring-red-400'
                                                : 'hover:bg-purple-500/20 text-purple-200 hover:text-purple-100 focus:ring-purple-400'), title: isCardLocked(card.id) ? 'Unlock card' : 'Lock card', children: isCardLocked(card.id) ? (0, jsx_runtime_1.jsx)(lucide_react_1.Unlock, { className: "w-3 h-3" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { className: "w-3 h-3" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function (e) {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                removeCard(card.id);
                                            }, onMouseDown: function (e) { return e.stopPropagation(); }, tabIndex: -1, className: "p-1.5 hover:bg-red-500/20 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50", title: "Delete card", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4 text-red-200 hover:text-red-100" }) })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "p-3 h-full overflow-visible", children: (0, exports.renderCardComponent)(card, cardTypes, kpiData, setShowTemplateLibrary) }), (selectedCards.has(card.id) || resizingCardId === card.id) && !isCardLocked(card.id) && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(ResizeHandle_1.default, { position: "nw", onResizeStart: function (handle, e) { return handleResizeStart(card.id, handle, e); } }), (0, jsx_runtime_1.jsx)(ResizeHandle_1.default, { position: "ne", onResizeStart: function (handle, e) { return handleResizeStart(card.id, handle, e); } }), (0, jsx_runtime_1.jsx)(ResizeHandle_1.default, { position: "sw", onResizeStart: function (handle, e) { return handleResizeStart(card.id, handle, e); } }), (0, jsx_runtime_1.jsx)(ResizeHandle_1.default, { position: "se", onResizeStart: function (handle, e) { return handleResizeStart(card.id, handle, e); } }), (0, jsx_runtime_1.jsx)(ResizeHandle_1.default, { position: "n", onResizeStart: function (handle, e) { return handleResizeStart(card.id, handle, e); } }), (0, jsx_runtime_1.jsx)(ResizeHandle_1.default, { position: "s", onResizeStart: function (handle, e) { return handleResizeStart(card.id, handle, e); } }), (0, jsx_runtime_1.jsx)(ResizeHandle_1.default, { position: "e", onResizeStart: function (handle, e) { return handleResizeStart(card.id, handle, e); } }), (0, jsx_runtime_1.jsx)(ResizeHandle_1.default, { position: "w", onResizeStart: function (handle, e) { return handleResizeStart(card.id, handle, e); } })] }))] }) }, card.id));
    };
};
exports.createRenderVirtualCard = createRenderVirtualCard;
// KPI Handlers
var handleKpiBuilderUseTemplate = function (template, localAddCard, currentLayoutId, setKpiData, setShowKPIBuilder) { return __awaiter(void 0, void 0, void 0, function () {
    var cardId_1, kpiData_1, cfg, serverPayload, retryCount_1, maxRetries, lastError, err_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 11, , 12]);
                cardId_1 = localAddCard('kpi-display', { x: 0, y: 0 });
                kpiData_1 = (0, kpiTemplateUtils_1.transformTemplateToKpiData)(template, cardId_1);
                cfg = {
                    name: kpiData_1.name,
                    description: kpiData_1.description,
                    threshold: kpiData_1.threshold || { green: 80, yellow: 60, unit: '%' },
                    chart: kpiData_1.chart || { type: 'line' }
                };
                serverPayload = {
                    card_uid: cardId_1,
                    type: 'kpi-display',
                    x: 0,
                    y: 0,
                    width: 300,
                    height: 200,
                    template_id: template.id,
                    config: cfg
                };
                if (!currentLayoutId) return [3 /*break*/, 9];
                retryCount_1 = 0;
                maxRetries = 3;
                lastError = null;
                _a.label = 1;
            case 1:
                if (!(retryCount_1 < maxRetries)) return [3 /*break*/, 8];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 7]);
                return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.upsertCard(currentLayoutId, serverPayload)];
            case 3:
                _a.sent();
                return [3 /*break*/, 8];
            case 4:
                err_1 = _a.sent();
                lastError = err_1;
                retryCount_1++;
                if (!(retryCount_1 < maxRetries)) return [3 /*break*/, 6];
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, Math.pow(2, retryCount_1) * 1000); })];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: return [3 /*break*/, 7];
            case 7: return [3 /*break*/, 1];
            case 8:
                if (retryCount_1 >= maxRetries) {
                    throw new Error("KPI Builder server operation failed after ".concat(maxRetries, " attempts: ").concat(lastError === null || lastError === void 0 ? void 0 : lastError.message));
                }
                setKpiData(function (prev) {
                    var _a;
                    return (__assign(__assign({}, prev), (_a = {}, _a[cardId_1] = kpiData_1, _a)));
                });
                return [3 /*break*/, 10];
            case 9: throw new Error('No currentLayoutId available for KPI Builder atomic operation');
            case 10:
                setShowKPIBuilder(false);
                return [3 /*break*/, 12];
            case 11:
                error_1 = _a.sent();
                throw error_1;
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.handleKpiBuilderUseTemplate = handleKpiBuilderUseTemplate;
var handleTemplateLibraryUseTemplate = function (template, localAddCard, currentLayoutId, setKpiData, setShowTemplateLibrary) { return __awaiter(void 0, void 0, void 0, function () {
    var cardId_2, kpiData_2, linkage, cfg, serverPayload, retryCount_2, maxRetries, lastError, err_2, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 11, , 12]);
                cardId_2 = localAddCard('kpi-display', { x: 0, y: 0 });
                kpiData_2 = (0, kpiTemplateUtils_1.transformTemplateToKpiData)(template, cardId_2);
                linkage = (0, exports.isUserTemplate)(template)
                    ? { user_kpi_id: template.id }
                    : { template_id: template.id };
                if (!linkage.user_kpi_id && !linkage.template_id) {
                    throw new Error('No valid linkage found for template');
                }
                cfg = {
                    name: kpiData_2.name,
                    description: kpiData_2.description,
                    threshold: kpiData_2.threshold || { green: 80, yellow: 60, unit: '%' },
                    chart: kpiData_2.chart || { type: 'line' }
                };
                serverPayload = __assign(__assign({ card_uid: cardId_2, type: 'kpi-display', x: 0, y: 0, width: 300, height: 200 }, linkage), { config: cfg });
                if (!currentLayoutId) return [3 /*break*/, 9];
                retryCount_2 = 0;
                maxRetries = 3;
                lastError = null;
                _a.label = 1;
            case 1:
                if (!(retryCount_2 < maxRetries)) return [3 /*break*/, 8];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 7]);
                return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.upsertCard(currentLayoutId, serverPayload)];
            case 3:
                _a.sent();
                return [3 /*break*/, 8];
            case 4:
                err_2 = _a.sent();
                lastError = err_2;
                retryCount_2++;
                if (!(retryCount_2 < maxRetries)) return [3 /*break*/, 6];
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, Math.pow(2, retryCount_2) * 1000); })];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: return [3 /*break*/, 7];
            case 7: return [3 /*break*/, 1];
            case 8:
                if (retryCount_2 >= maxRetries) {
                    throw new Error("Server operation failed after ".concat(maxRetries, " attempts: ").concat(lastError === null || lastError === void 0 ? void 0 : lastError.message));
                }
                setKpiData(function (prev) {
                    var _a;
                    return (__assign(__assign({}, prev), (_a = {}, _a[cardId_2] = kpiData_2, _a)));
                });
                return [3 /*break*/, 10];
            case 9: throw new Error('No currentLayoutId available for atomic operation');
            case 10:
                setShowTemplateLibrary(false);
                return [3 /*break*/, 12];
            case 11:
                error_2 = _a.sent();
                throw error_2;
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.handleTemplateLibraryUseTemplate = handleTemplateLibraryUseTemplate;
