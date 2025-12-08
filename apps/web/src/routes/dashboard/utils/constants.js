"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.availableKpiFields = exports.defaultCardSizes = exports.mockMetrics = exports.AUTO_CREATE_FROM_USER_KPIS = exports.KPI_DATA_STORAGE_KEY = exports.CARD_CONSTANTS = void 0;
// Re-export card constants for convenience
var cardConstants_1 = require("./cardConstants");
Object.defineProperty(exports, "CARD_CONSTANTS", { enumerable: true, get: function () { return cardConstants_1.CARD_CONSTANTS; } });
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
    'technician-dispatch': { width: 400, height: 500 },
    'invoices': { width: 400, height: 500 },
    'availability-manager': { width: 400, height: 600 },
    'quick-actions': { width: 260, height: 160 },
    'kpi-builder': { width: 320, height: 240 },
    'predictive-analytics': { width: 300, height: 200 },
    'auto-layout': { width: 280, height: 180 },
    'routing': { width: 320, height: 240 },
    'team-overview': { width: 300, height: 200 },
    'financial-summary': { width: 280, height: 180 }
};
exports.availableKpiFields = [
    { id: 'jobs_completed', name: 'Jobs Completed', type: 'number', table: 'jobs', column: 'status', aggregation: 'count' },
    { id: 'revenue_total', name: 'Total Revenue', type: 'number', table: 'invoices', column: 'amount', aggregation: 'sum' },
    { id: 'customer_count', name: 'Customer Count', type: 'number', table: 'customers', column: 'id', aggregation: 'count' },
    { id: 'avg_rating', name: 'Average Rating', type: 'number', table: 'reviews', column: 'rating', aggregation: 'avg' },
    { id: 'completion_rate', name: 'Completion Rate', type: 'number', table: 'jobs', column: 'status', aggregation: 'count' }
];
