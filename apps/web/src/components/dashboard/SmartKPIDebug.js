"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var Card_1 = __importDefault(require("@/components/ui/Card"));
// Mock data directly in component for testing
var mockKPIData = [
    {
        id: 'jobs-completed',
        metric: 'Jobs Completed Today',
        value: 45,
        threshold: { green: 40, yellow: 30, red: 20 },
        trend: 'up',
        trendValue: 12,
        lastUpdated: new Date().toISOString(),
        category: 'operational',
        realTime: true,
        drillDown: {
            endpoint: '/api/jobs/completed',
            filters: { date: 'today', status: 'completed' },
            title: 'Completed Jobs Details',
            description: 'View detailed breakdown of completed jobs'
        }
    },
    {
        id: 'revenue',
        metric: 'Daily Revenue',
        value: 12500,
        threshold: { green: 10000, yellow: 7500, red: 5000, unit: 'USD' },
        trend: 'up',
        trendValue: 8,
        lastUpdated: new Date().toISOString(),
        category: 'financial',
        realTime: true,
        drillDown: {
            endpoint: '/api/financial/revenue',
            filters: { period: 'daily' },
            title: 'Revenue Breakdown',
            description: 'Detailed revenue analysis by service type'
        }
    }
];
var SmartKPIDebug = function () {
    return ((0, jsx_runtime_1.jsx)(Card_1.default, { title: "Smart KPI Debug", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-green-100 border border-green-300 rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-green-800 mb-2", children: "\u2705 Smart KPI Debug Component" }), (0, jsx_runtime_1.jsx)("p", { className: "text-green-700", children: "This component is rendering correctly!" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-green-700", children: ["Mock data count: ", mockKPIData.length] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold mb-2", children: "Mock KPI Data:" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: mockKPIData.map(function (kpi, index) { return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-50 p-3 rounded border", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: kpi.metric }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-600", children: ["Value: ", kpi.value] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-600", children: ["Category: ", kpi.category] })] }, index)); }) })] })] }) }));
};
exports.default = SmartKPIDebug;
