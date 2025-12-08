"use strict";
/**
 * Utility functions for transforming KPI template data
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformTemplateToKpiData = void 0;
/**
 * Transforms a KPI template into KPI display data format
 */
var transformTemplateToKpiData = function (template, cardId) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return {
        id: cardId,
        name: template.name,
        description: template.description,
        category: template.category === 'user' ? 'operational' : template.category,
        formula: {
            id: "formula-".concat(Date.now()),
            name: "".concat(template.name, " Formula"),
            expression: template.formula_expression || '',
            fields: ((_a = template.formula_fields) === null || _a === void 0 ? void 0 : _a.map(function (field) { return field.id; })) || [],
            validation: {
                isValid: true,
                errors: []
            }
        },
        threshold: {
            green: ((_b = template.threshold_config) === null || _b === void 0 ? void 0 : _b.green) || 80,
            yellow: ((_c = template.threshold_config) === null || _c === void 0 ? void 0 : _c.yellow) || 60,
            red: ((_d = template.threshold_config) === null || _d === void 0 ? void 0 : _d.red) || 40,
            unit: ((_e = template.threshold_config) === null || _e === void 0 ? void 0 : _e.unit) || '%'
        },
        chart: {
            type: ((_f = template.chart_config) === null || _f === void 0 ? void 0 : _f.type) || 'number',
            colorScheme: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444']
        },
        dataSource: {
            table: ((_g = template.data_source_config) === null || _g === void 0 ? void 0 : _g.table) || '',
            timeRange: {
                field: 'created_at',
                start: new Date(),
                end: new Date()
            }
        },
        enabled: true, // Templates are always enabled/active
        realTime: ((_h = template.data_source_config) === null || _h === void 0 ? void 0 : _h.isRealTime) || false // Only live view if real-time is enabled
    };
};
exports.transformTemplateToKpiData = transformTemplateToKpiData;
