"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserTemplate = exports.normalizeKpiForDisplay = exports.getDefaultCardSize = void 0;
var constants_1 = require("./constants");
var getDefaultCardSize = function (type) {
    return constants_1.defaultCardSizes[type] || { width: 280, height: 180 };
};
exports.getDefaultCardSize = getDefaultCardSize;
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
