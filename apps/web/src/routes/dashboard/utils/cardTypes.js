"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCardTypes = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
// Card types configuration
// Last Updated: 2025-12-05
var logger_1 = require("@/utils/logger");
var DashboardMetrics_1 = __importDefault(require("@/components/dashboard/DashboardMetrics"));
var QuickActionsCard_1 = __importDefault(require("@/components/dashboard/QuickActionsCard"));
var SmartKPITest_1 = __importDefault(require("@/components/dashboard/SmartKPITest"));
var SmartKPIDebug_1 = __importDefault(require("@/components/dashboard/SmartKPIDebug"));
var JobsCalendarCard_1 = __importDefault(require("@/components/dashboard/JobsCalendarCard"));
var cards_1 = require("@/components/cards");
var CustomersPageCard_1 = __importDefault(require("@/components/dashboard/CustomersPageCard"));
var CustomerSearchCard_1 = __importDefault(require("@/components/dashboard/CustomerSearchCard"));
var ReportCard_1 = __importDefault(require("@/components/dashboard/ReportCard"));
var TechnicianDispatchCard_1 = __importDefault(require("@/components/dashboard/TechnicianDispatchCard"));
var InvoiceCard_1 = __importDefault(require("@/components/dashboard/InvoiceCard"));
var AvailabilityManagerCard_1 = __importDefault(require("@/components/dashboard/AvailabilityManagerCard"));
var constants_1 = require("./constants");
var getCardTypes = function (onOpenKPIBuilder) {
    var cardTypes = [
        {
            id: 'dashboard-metrics',
            name: 'Dashboard Metrics',
            component: function () { return (0, jsx_runtime_1.jsx)(DashboardMetrics_1.default, { metrics: constants_1.mockMetrics }); }
        },
        {
            id: 'smart-kpis',
            name: 'Smart KPIs',
            component: function () { return (0, jsx_runtime_1.jsx)(DashboardMetrics_1.default, { metrics: constants_1.mockMetrics, enableSmartKPIs: true }); }
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
        { id: 'jobs-calendar', name: 'Jobs Calendar', component: function () { return (0, jsx_runtime_1.jsx)(JobsCalendarCard_1.default, {}); } },
        { id: 'recent-activity', name: 'Recent Activity', component: function () { return (0, jsx_runtime_1.jsx)("div", { className: "p-4 text-gray-600", children: "Recent Activity - Coming Soon" }); } },
        { id: 'customer-search', name: 'Customer Search', component: function (_a) {
                var cardId = _a.cardId;
                return cardId ? (0, jsx_runtime_1.jsx)(CustomerSearchCard_1.default, { cardId: cardId }) : (0, jsx_runtime_1.jsx)(CustomerSearchCard_1.default, {});
            } },
        { id: 'reports', name: 'Reports', component: function (_a) {
                var cardId = _a.cardId;
                return cardId ? (0, jsx_runtime_1.jsx)(ReportCard_1.default, { cardId: cardId }) : (0, jsx_runtime_1.jsx)(ReportCard_1.default, {});
            } },
        {
            id: 'technician-dispatch',
            name: 'Technician Dispatch',
            component: function (_a) {
                var cardId = _a.cardId;
                if (cardId) {
                    return (0, jsx_runtime_1.jsx)(TechnicianDispatchCard_1.default, { cardId: cardId });
                }
                return (0, jsx_runtime_1.jsx)(TechnicianDispatchCard_1.default, {});
            }
        },
        {
            id: 'invoices',
            name: 'Invoices',
            component: function (_a) {
                var cardId = _a.cardId;
                if (cardId) {
                    return (0, jsx_runtime_1.jsx)(InvoiceCard_1.default, { cardId: cardId });
                }
                return (0, jsx_runtime_1.jsx)(InvoiceCard_1.default, {});
            }
        },
        {
            id: 'availability-manager',
            name: 'Availability Manager',
            component: function (_a) {
                var cardId = _a.cardId;
                if (cardId) {
                    return (0, jsx_runtime_1.jsx)(AvailabilityManagerCard_1.default, { cardId: cardId });
                }
                return (0, jsx_runtime_1.jsx)(AvailabilityManagerCard_1.default, {});
            }
        },
        { id: 'quick-actions', name: 'Quick Actions', component: function () { return (0, jsx_runtime_1.jsx)(QuickActionsCard_1.default, {}); } },
        { id: 'kpi-builder', name: 'KPI Builder', component: function () { return (0, jsx_runtime_1.jsx)(cards_1.KpiBuilderCard, { onOpenBuilder: onOpenKPIBuilder }); } },
        { id: 'predictive-analytics', name: 'Predictive Analytics', component: function () { return (0, jsx_runtime_1.jsx)(cards_1.PredictiveAnalyticsCard, {}); } },
        { id: 'auto-layout', name: 'Auto-Layout', component: function () { return (0, jsx_runtime_1.jsx)(cards_1.AutoLayoutCard, {}); } },
        { id: 'routing', name: 'Routing', component: function () { return (0, jsx_runtime_1.jsx)("div", { className: "p-4 text-gray-600", children: "Routing - Coming Soon" }); } },
        { id: 'team-overview', name: 'Team Overview', component: function () { return (0, jsx_runtime_1.jsx)("div", { className: "p-4 text-gray-600", children: "Team Overview - Coming Soon" }); } },
        { id: 'financial-summary', name: 'Financial Summary', component: function () { return (0, jsx_runtime_1.jsx)("div", { className: "p-4 text-gray-600", children: "Financial Summary - Coming Soon" }); } },
        { id: 'kpi-display', name: 'KPI Display', component: 'kpi-display' }, // Special marker for KPI display cards
        { id: 'kpi-template', name: 'KPI Template', component: function (_a) {
                var cardId = _a.cardId, onOpenTemplateLibrary = _a.onOpenTemplateLibrary;
                return (0, jsx_runtime_1.jsx)(cards_1.KpiTemplateCard, { cardId: cardId, onOpenTemplateLibrary: onOpenTemplateLibrary });
            } },
        { id: 'customers-page', name: 'Customers', component: function (_a) {
                var cardId = _a.cardId;
                return cardId ? (0, jsx_runtime_1.jsx)(CustomersPageCard_1.default, { cardId: cardId }) : (0, jsx_runtime_1.jsx)(CustomersPageCard_1.default, {});
            } }
    ];
    // Debug: Log available card types
    if (process.env.NODE_ENV === 'development') {
        logger_1.logger.debug('Available card types', { cardTypes: cardTypes.map(function (c) { return ({ id: c.id, name: c.name }); }) }, 'cardTypes');
    }
    return cardTypes;
};
exports.getCardTypes = getCardTypes;
