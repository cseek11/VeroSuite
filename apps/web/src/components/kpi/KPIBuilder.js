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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importStar(require("react"));
var lucide_react_1 = require("lucide-react");
var useKPIBuilder_1 = require("@/hooks/useKPIBuilder");
var useKpiTemplates_1 = require("@/hooks/useKpiTemplates");
var KpiTemplateLibrary_1 = __importDefault(require("./KpiTemplateLibrary"));
var utils_1 = require("@/lib/utils");
var logger_1 = require("@/utils/logger");
var KPIBuilder = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    var isOpen = _a.isOpen, onClose = _a.onClose, onSave = _a.onSave, onTest = _a.onTest, onUseTemplate = _a.onUseTemplate, _r = _a.availableFields, availableFields = _r === void 0 ? [] : _r, initialKPI = _a.initialKPI, _s = _a.isEditingTemplate, isEditingTemplate = _s === void 0 ? false : _s, onSaveTemplate = _a.onSaveTemplate;
    var _t = (0, react_1.useState)('basic'), activeTab = _t[0], setActiveTab = _t[1];
    var _u = (0, react_1.useState)(false), isTesting = _u[0], setIsTesting = _u[1];
    var _v = (0, react_1.useState)(null), testResult = _v[0], setTestResult = _v[1];
    var _w = (0, react_1.useState)(''), templateSearchTerm = _w[0], setTemplateSearchTerm = _w[1];
    // Fetch templates from database
    var _x = (0, useKpiTemplates_1.useKpiTemplates)(), templates = _x.data, templatesLoading = _x.isLoading;
    // Template creation hook
    var createTemplateMutation = (0, useKpiTemplates_1.useCreateKpiTemplate)();
    // Filter templates based on search term
    var filteredTemplates = react_1.default.useMemo(function () {
        if (!templates || !Array.isArray(templates))
            return [];
        if (!templateSearchTerm.trim())
            return templates;
        return templates.filter(function (template) {
            var _a;
            return template.name.toLowerCase().includes(templateSearchTerm.toLowerCase()) ||
                ((_a = template.description) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(templateSearchTerm.toLowerCase())) ||
                template.category.toLowerCase().includes(templateSearchTerm.toLowerCase());
        });
    }, [templates, templateSearchTerm]);
    // Separate system and user templates
    var systemTemplates = filteredTemplates.filter(function (template) { return template.category !== 'user'; });
    var userTemplates = filteredTemplates.filter(function (template) { return template.category === 'user'; });
    var kpiBuilder = (0, useKPIBuilder_1.useKPIBuilder)({
        availableFields: availableFields,
        onSave: onSave || (function () { }),
        onTest: function (kpi) { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setIsTesting(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 3, 4]);
                        return [4 /*yield*/, (onTest === null || onTest === void 0 ? void 0 : onTest(kpi))];
                    case 2:
                        result = _a.sent();
                        setTestResult(result);
                        return [2 /*return*/, result];
                    case 3:
                        setIsTesting(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); }
    });
    // Load initial KPI if provided
    react_1.default.useEffect(function () {
        if (initialKPI && isOpen) {
            kpiBuilder.loadTemplate(initialKPI);
        }
    }, [initialKPI, isOpen]);
    var chartTypes = [
        { id: 'number', name: 'Number', icon: lucide_react_1.Hash, description: 'Simple numeric display' },
        { id: 'gauge', name: 'Gauge', icon: lucide_react_1.Gauge, description: 'Circular gauge with thresholds' },
        { id: 'line', name: 'Line Chart', icon: lucide_react_1.TrendingUp, description: 'Trend over time' },
        { id: 'bar', name: 'Bar Chart', icon: lucide_react_1.BarChart3, description: 'Category comparison' },
        { id: 'pie', name: 'Pie Chart', icon: lucide_react_1.PieChart, description: 'Proportion breakdown' }
    ];
    var categories = [
        { id: 'financial', name: 'Financial', color: 'text-green-600 bg-green-100' },
        { id: 'operational', name: 'Operational', color: 'text-blue-600 bg-blue-100' },
        { id: 'customer', name: 'Customer', color: 'text-purple-600 bg-purple-100' },
        { id: 'compliance', name: 'Compliance', color: 'text-orange-600 bg-orange-100' }
    ];
    var handleSave = function () { return __awaiter(void 0, void 0, void 0, function () {
        var templateData, savedTemplate, error_1;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (!kpiBuilder.isKPIValid)
                        return [2 /*return*/];
                    if (!(isEditingTemplate && onSaveTemplate)) return [3 /*break*/, 5];
                    templateData = {
                        name: kpiBuilder.currentKPI.name,
                        description: kpiBuilder.currentKPI.description || '',
                        category: kpiBuilder.currentKPI.category || 'operational',
                        template_type: 'user',
                        formula_expression: ((_a = kpiBuilder.currentKPI.formula) === null || _a === void 0 ? void 0 : _a.expression) || '',
                        formula_fields: ((_b = kpiBuilder.currentKPI.formula) === null || _b === void 0 ? void 0 : _b.fields.map(function (fieldId) {
                            var field = availableFields.find(function (f) { return f.id === fieldId; });
                            return {
                                field_name: (field === null || field === void 0 ? void 0 : field.name) || fieldId,
                                field_type: (field === null || field === void 0 ? void 0 : field.type) || 'number',
                                table_name: (field === null || field === void 0 ? void 0 : field.table) || '',
                                column_name: (field === null || field === void 0 ? void 0 : field.column) || fieldId,
                                display_name: (field === null || field === void 0 ? void 0 : field.name) || fieldId,
                                description: "".concat((field === null || field === void 0 ? void 0 : field.name) || fieldId, " field from ").concat((field === null || field === void 0 ? void 0 : field.table) || 'unknown', " table")
                            };
                        })) || [],
                        threshold_config: kpiBuilder.currentKPI.threshold || {
                            green: 80,
                            yellow: 60,
                            red: 40,
                            unit: '%'
                        },
                        chart_config: {
                            type: ((_c = kpiBuilder.currentKPI.chart) === null || _c === void 0 ? void 0 : _c.type) || 'number',
                            colorScheme: ((_d = kpiBuilder.currentKPI.chart) === null || _d === void 0 ? void 0 : _d.colorScheme) || ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444']
                        },
                        data_source_config: {
                            table: ((_e = kpiBuilder.currentKPI.dataSource) === null || _e === void 0 ? void 0 : _e.table) || '',
                            timeRange: 'created_at',
                            isRealTime: kpiBuilder.currentKPI.isRealTime || false,
                            refreshInterval: kpiBuilder.currentKPI.refreshInterval
                        },
                        is_public: false,
                        is_featured: false,
                        status: 'published'
                    };
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, createTemplateMutation.mutateAsync(templateData)];
                case 2:
                    savedTemplate = _f.sent();
                    logger_1.logger.debug('Saved template', { templateId: savedTemplate === null || savedTemplate === void 0 ? void 0 : savedTemplate.id }, 'KPIBuilder');
                    onSaveTemplate === null || onSaveTemplate === void 0 ? void 0 : onSaveTemplate(savedTemplate);
                    onClose();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _f.sent();
                    logger_1.logger.error('Failed to save template', error_1, 'KPIBuilder');
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 6];
                case 5:
                    // Save as regular KPI
                    kpiBuilder.saveKPI();
                    onClose();
                    _f.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleTest = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, kpiBuilder.testKPI()];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    logger_1.logger.error('KPI test failed', error_2, 'KPIBuilder');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var getFieldDisplayName = function (field) {
        return "".concat(field.table, ".").concat(field.column).concat(field.aggregation ? " (".concat(field.aggregation, ")") : '');
    };
    if (!isOpen)
        return null;
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[85vh] overflow-hidden flex flex-col min-h-[500px]", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-4 border-b border-gray-200", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-gray-900", children: "Custom KPI Builder" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "Create and configure custom KPIs" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600 transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-6 h-6" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex border-b border-gray-200", children: [
                        { id: 'basic', name: 'Basic Info', icon: null },
                        { id: 'formula', name: 'Formula', icon: null },
                        { id: 'threshold', name: 'Thresholds', icon: null },
                        { id: 'chart', name: 'Visualization', icon: null },
                        { id: 'preview', name: 'Preview', icon: lucide_react_1.Eye },
                        { id: 'templates', name: 'Templates', icon: lucide_react_1.Star },
                        { id: 'help', name: 'Help & Tutorial', icon: lucide_react_1.Info }
                    ].map(function (tab) { return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setActiveTab(tab.id); }, className: (0, utils_1.cn)("flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors", activeTab === tab.id
                            ? "border-purple-500 text-purple-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"), children: [tab.icon && (0, jsx_runtime_1.jsx)(tab.icon, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { children: tab.name })] }, tab.id)); }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-1 min-h-0 overflow-hidden", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1 p-4 overflow-y-auto", children: [activeTab === 'templates' && ((0, jsx_runtime_1.jsx)(KpiTemplateLibrary_1.default, { onTemplateSelect: function (template) {
                                        var _a, _b, _c, _d, _e, _f, _g;
                                        // Load template data into the KPI builder with template ID tracking
                                        kpiBuilder.loadTemplate({
                                            name: template.name,
                                            description: template.description || '',
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
                                                timeRange: { field: 'created_at', start: new Date(), end: new Date() }
                                            }
                                        }, template.id); // Pass template ID for tracking
                                        // Switch to basic tab to show the loaded data
                                        setActiveTab('basic');
                                    }, onUseTemplate: function (template) {
                                        var _a, _b, _c, _d, _e, _f, _g;
                                        // Use template to create a template card instead of loading into builder
                                        if (onUseTemplate) {
                                            onUseTemplate(template);
                                            onClose();
                                        }
                                        else {
                                            // Fallback to loading into builder if no callback provided
                                            kpiBuilder.updateKPI({
                                                name: template.name,
                                                description: template.description || '',
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
                                                    timeRange: { field: 'created_at', start: new Date(), end: new Date() }
                                                }
                                            });
                                            // Switch to basic tab to show the loaded data
                                            setActiveTab('basic');
                                        }
                                    }, showCreateButton: false, className: "w-full" })), activeTab === 'basic' && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "KPI Name *" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: kpiBuilder.currentKPI.name || '', onChange: function (e) { return kpiBuilder.updateKPI({ name: e.target.value }); }, placeholder: "Enter KPI name...", className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Description" }), (0, jsx_runtime_1.jsx)("textarea", { value: kpiBuilder.currentKPI.description || '', onChange: function (e) { return kpiBuilder.updateKPI({ description: e.target.value }); }, placeholder: "Describe what this KPI measures...", rows: 3, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Category *" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 gap-3", children: categories.map(function (category) { return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return kpiBuilder.updateKPI({ category: category.id }); }, className: (0, utils_1.cn)("p-3 rounded-lg border-2 transition-colors", kpiBuilder.currentKPI.category === category.id
                                                            ? "border-purple-500 bg-purple-50"
                                                            : "border-gray-200 hover:border-gray-300"), children: [(0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)("inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-2", category.color), children: category.name }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600", children: [category.name, " metrics and indicators"] })] }, category.id)); }) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Data Source *" }), (0, jsx_runtime_1.jsxs)("select", { value: ((_b = kpiBuilder.currentKPI.dataSource) === null || _b === void 0 ? void 0 : _b.table) || '', onChange: function (e) { return kpiBuilder.updateKPI({
                                                        dataSource: __assign(__assign({}, kpiBuilder.currentKPI.dataSource), { table: e.target.value })
                                                    }); }, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "Select data source..." }), kpiBuilder.dataSources.map(function (source) { return ((0, jsx_runtime_1.jsxs)("option", { value: source.id, children: [source.name, " - ", source.description] }, source.id)); })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center space-x-4", children: (0, jsx_runtime_1.jsxs)("label", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: kpiBuilder.currentKPI.isRealTime || false, onChange: function (e) { return kpiBuilder.updateKPI({ isRealTime: e.target.checked }); }, className: "mr-2" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-700", children: "Real-time updates" })] }) })] })), activeTab === 'formula' && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Formula Expression *" }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-4 p-4 bg-gray-50 rounded-lg border", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-gray-700 mb-3", children: "Quick Operations" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return kpiBuilder.addToFormula('SUM('); }, className: "px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors", children: "SUM()" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return kpiBuilder.addToFormula('COUNT('); }, className: "px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors", children: "COUNT()" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return kpiBuilder.addToFormula('AVG('); }, className: "px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors", children: "AVG()" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return kpiBuilder.addToFormula('MAX('); }, className: "px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors", children: "MAX()" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return kpiBuilder.addToFormula('MIN('); }, className: "px-3 py-2 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors", children: "MIN()" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return kpiBuilder.addToFormula(' + '); }, className: "px-3 py-2 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors", children: "+" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return kpiBuilder.addToFormula(' - '); }, className: "px-3 py-2 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors", children: "-" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return kpiBuilder.addToFormula(' * '); }, className: "px-3 py-2 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors", children: "\u00D7" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return kpiBuilder.addToFormula(' / '); }, className: "px-3 py-2 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors", children: "\u00F7" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return kpiBuilder.addToFormula(' * 100'); }, className: "px-3 py-2 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors", children: "\u00D7 100" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return kpiBuilder.addToFormula('( )'); }, className: "px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors", children: "( )" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("textarea", { value: ((_c = kpiBuilder.currentKPI.formula) === null || _c === void 0 ? void 0 : _c.expression) || '', onChange: function (e) { return kpiBuilder.updateFormula({ expression: e.target.value }); }, onDrop: function (e) {
                                                                e.preventDefault();
                                                                var fieldId = e.dataTransfer.getData('fieldId');
                                                                if (fieldId) {
                                                                    kpiBuilder.insertFieldReference(fieldId);
                                                                    kpiBuilder.addFieldToFormula(fieldId);
                                                                }
                                                            }, onDragOver: function (e) { return e.preventDefault(); }, onDragEnter: function (e) {
                                                                e.preventDefault();
                                                                e.currentTarget.classList.add('border-purple-400', 'bg-purple-50');
                                                            }, onDragLeave: function (e) {
                                                                e.preventDefault();
                                                                e.currentTarget.classList.remove('border-purple-400', 'bg-purple-50');
                                                            }, placeholder: "Enter formula (e.g., SUM(revenue_total) / COUNT(customers) * 100)", rows: 4, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono transition-colors" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute top-2 right-2 text-xs text-gray-400", children: "Drag fields here or use buttons above" })] }), ((_d = kpiBuilder.currentKPI.formula) === null || _d === void 0 ? void 0 : _d.validation) && ((0, jsx_runtime_1.jsx)("div", { className: "mt-2", children: kpiBuilder.currentKPI.formula.validation.isValid ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-green-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-4 h-4 mr-1" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm", children: "Formula is valid" })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-1", children: kpiBuilder.currentKPI.formula.validation.errors.map(function (error, index) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-red-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-4 h-4 mr-1" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm", children: error })] }, index)); }) })) }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Formula Preview" }), (0, jsx_runtime_1.jsx)("div", { className: "p-3 bg-gray-50 rounded-md font-mono text-sm", children: kpiBuilder.getFormulaPreview() || 'No formula defined' })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Selected Fields" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(_e = kpiBuilder.currentKPI.formula) === null || _e === void 0 ? void 0 : _e.fields.map(function (fieldId) {
                                                            var field = availableFields.find(function (f) { return f.id === fieldId; });
                                                            if (!field)
                                                                return null;
                                                            return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-2 bg-purple-50 rounded-md", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: field.name }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-500 ml-2", children: getFieldDisplayName(field) })] }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return kpiBuilder.removeFieldFromFormula(fieldId); }, className: "text-red-600 hover:text-red-800", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "w-4 h-4" }) })] }, fieldId));
                                                        }), (!((_f = kpiBuilder.currentKPI.formula) === null || _f === void 0 ? void 0 : _f.fields) || kpiBuilder.currentKPI.formula.fields.length === 0) && ((0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 text-sm", children: "No fields selected" }))] })] })] })), activeTab === 'threshold' && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Unit" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: ((_g = kpiBuilder.currentKPI.threshold) === null || _g === void 0 ? void 0 : _g.unit) || '', onChange: function (e) { return kpiBuilder.updateKPI({
                                                        threshold: __assign(__assign({}, kpiBuilder.currentKPI.threshold), { unit: e.target.value })
                                                    }); }, placeholder: "e.g., %, $, count, hours", className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-3 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2", children: "Good" }), "Threshold"] }), (0, jsx_runtime_1.jsx)("input", { type: "number", value: ((_h = kpiBuilder.currentKPI.threshold) === null || _h === void 0 ? void 0 : _h.green) || 0, onChange: function (e) { return kpiBuilder.updateKPI({
                                                                threshold: __assign(__assign({}, kpiBuilder.currentKPI.threshold), { green: Number(e.target.value) })
                                                            }); }, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mr-2", children: "Warning" }), "Threshold"] }), (0, jsx_runtime_1.jsx)("input", { type: "number", value: ((_j = kpiBuilder.currentKPI.threshold) === null || _j === void 0 ? void 0 : _j.yellow) || 0, onChange: function (e) { return kpiBuilder.updateKPI({
                                                                threshold: __assign(__assign({}, kpiBuilder.currentKPI.threshold), { yellow: Number(e.target.value) })
                                                            }); }, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2", children: "Critical" }), "Threshold"] }), (0, jsx_runtime_1.jsx)("input", { type: "number", value: ((_k = kpiBuilder.currentKPI.threshold) === null || _k === void 0 ? void 0 : _k.red) || 0, onChange: function (e) { return kpiBuilder.updateKPI({
                                                                threshold: __assign(__assign({}, kpiBuilder.currentKPI.threshold), { red: Number(e.target.value) })
                                                            }); }, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-blue-50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-blue-900 mb-2", children: "Threshold Guidelines" }), (0, jsx_runtime_1.jsxs)("ul", { className: "text-sm text-blue-700 space-y-1", children: [(0, jsx_runtime_1.jsx)("li", { children: "\u2022 Good: Values above this threshold indicate positive performance" }), (0, jsx_runtime_1.jsx)("li", { children: "\u2022 Warning: Values between warning and critical need attention" }), (0, jsx_runtime_1.jsx)("li", { children: "\u2022 Critical: Values below this threshold require immediate action" })] })] })] })), activeTab === 'chart' && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Chart Type" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 gap-3", children: chartTypes.map(function (chartType) {
                                                        var _a;
                                                        return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return kpiBuilder.updateKPI({
                                                                chart: __assign(__assign({}, kpiBuilder.currentKPI.chart), { type: chartType.id })
                                                            }); }, className: (0, utils_1.cn)("p-4 rounded-lg border-2 transition-colors text-left", ((_a = kpiBuilder.currentKPI.chart) === null || _a === void 0 ? void 0 : _a.type) === chartType.id
                                                                ? "border-purple-500 bg-purple-50"
                                                                : "border-gray-200 hover:border-gray-300"), children: [(0, jsx_runtime_1.jsx)(chartType.icon, { className: "w-6 h-6 mb-2 text-gray-600" }), (0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: chartType.name }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500", children: chartType.description })] }, chartType.id));
                                                    }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center space-x-4", children: (0, jsx_runtime_1.jsxs)("label", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: ((_l = kpiBuilder.currentKPI.chart) === null || _l === void 0 ? void 0 : _l.showTrend) || false, onChange: function (e) { return kpiBuilder.updateKPI({
                                                            chart: __assign(__assign({}, kpiBuilder.currentKPI.chart), { showTrend: e.target.checked })
                                                        }); }, className: "mr-2" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-700", children: "Show trend indicator" })] }) })] })), activeTab === 'preview' && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-900 mb-4", children: "KPI Configuration" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3 text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Name:" }), " ", kpiBuilder.currentKPI.name || 'Unnamed KPI'] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Category:" }), " ", kpiBuilder.currentKPI.category] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Data Source:" }), " ", (_m = kpiBuilder.currentKPI.dataSource) === null || _m === void 0 ? void 0 : _m.table] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Chart Type:" }), " ", (_o = kpiBuilder.currentKPI.chart) === null || _o === void 0 ? void 0 : _o.type] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Real-time:" }), " ", kpiBuilder.currentKPI.isRealTime ? 'Yes' : 'No'] })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-900 mb-4", children: "Formula" }), (0, jsx_runtime_1.jsx)("div", { className: "p-3 bg-gray-50 rounded-md font-mono text-sm", children: kpiBuilder.getFormulaPreview() || 'No formula defined' })] })] }), testResult && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-900 mb-4", children: "Test Results" }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-green-50 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-green-800 mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-5 h-5 mr-2" }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "Test Successful" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-green-700", children: [(0, jsx_runtime_1.jsxs)("div", { children: ["Result: ", testResult.value] }), (0, jsx_runtime_1.jsxs)("div", { children: ["Status: ", testResult.status] })] })] })] }))] })), activeTab === 'help' && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-6", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "text-lg font-semibold text-blue-900 mb-4 flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Info, { className: "w-5 h-5 mr-2" }), "KPI Builder Tutorial & Help Center"] }), (0, jsx_runtime_1.jsx)("p", { className: "text-blue-800 mb-4", children: "Welcome to the Custom KPI Builder! This comprehensive guide will walk you through creating powerful, data-driven KPIs for your dashboard." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-green-50 border border-green-200 rounded-lg p-6", children: [(0, jsx_runtime_1.jsxs)("h4", { className: "font-semibold text-green-900 mb-3 flex items-center", children: [(0, jsx_runtime_1.jsx)("span", { className: "bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2", children: "1" }), "Quick Start Guide"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3 text-sm text-green-800", children: [(0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Step 1:" }), " Fill in Basic Info (KPI name, description, category)"] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Step 2:" }), " Create your formula using available fields"] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Step 3:" }), " Set performance thresholds (good/warning/critical)"] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Step 4:" }), " Choose visualization type"] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Step 5:" }), " Test and save your KPI"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "border border-gray-200 rounded-lg p-6", children: [(0, jsx_runtime_1.jsxs)("h4", { className: "font-semibold text-gray-900 mb-3 flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Hash, { className: "w-5 h-5 mr-2 text-purple-600" }), "Basic Info Tab"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4 text-sm text-gray-700", children: [(0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "KPI Name:" }), " Choose a clear, descriptive name (e.g., \"Monthly Revenue Growth\")"] }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Description:" }), " Explain what this KPI measures and why it's important"] }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Category:" }), " Organize your KPIs into logical groups:"] }), (0, jsx_runtime_1.jsxs)("ul", { className: "list-disc list-inside ml-4 mt-2 space-y-1", children: [(0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-green-600 font-medium", children: "Financial:" }), " Revenue, costs, profit margins"] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-blue-600 font-medium", children: "Operational:" }), " Job completion rates, efficiency metrics"] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-purple-600 font-medium", children: "Customer:" }), " Satisfaction, retention, acquisition"] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("span", { className: "text-orange-600 font-medium", children: "Compliance:" }), " Safety records, regulatory metrics"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Data Source:" }), " Select which database table contains your data"] }), (0, jsx_runtime_1.jsxs)("ul", { className: "list-disc list-inside ml-4 mt-2 space-y-1", children: [(0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Jobs:" }), " Service completion data"] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Invoices:" }), " Financial transaction data"] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Customers:" }), " Client information"] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Reviews:" }), " Customer feedback data"] })] })] }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Real-time Updates:" }), " Enable for KPIs that need live data (revenue, active jobs)"] }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "border border-gray-200 rounded-lg p-6", children: [(0, jsx_runtime_1.jsxs)("h4", { className: "font-semibold text-gray-900 mb-3 flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "w-5 h-5 mr-2 text-purple-600" }), "Formula Tab - Building Your KPI Logic"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4 text-sm text-gray-700", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-yellow-50 border border-yellow-200 rounded p-4", children: (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "\uD83D\uDCA1 Pro Tip:" }), " Drag fields from the sidebar or click them to add to your formula"] }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Formula Expression:" }), " Write mathematical expressions using available fields"] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-100 p-3 rounded mt-2 font-mono text-xs", children: [(0, jsx_runtime_1.jsx)("p", { children: "Examples:" }), (0, jsx_runtime_1.jsxs)("p", { children: ["\u2022 ", (0, jsx_runtime_1.jsx)("span", { className: "text-blue-600", children: "SUM(revenue_total)" }), " - Total revenue"] }), (0, jsx_runtime_1.jsxs)("p", { children: ["\u2022 ", (0, jsx_runtime_1.jsx)("span", { className: "text-blue-600", children: "COUNT(jobs_completed) / COUNT(jobs_total) * 100" }), " - Completion percentage"] }), (0, jsx_runtime_1.jsxs)("p", { children: ["\u2022 ", (0, jsx_runtime_1.jsx)("span", { className: "text-blue-600", children: "AVG(avg_rating)" }), " - Average customer rating"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { children: (0, jsx_runtime_1.jsx)("strong", { children: "Supported Operations:" }) }), (0, jsx_runtime_1.jsxs)("ul", { className: "list-disc list-inside ml-4 mt-2 space-y-1", children: [(0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "SUM():" }), " Add up all values"] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "COUNT():" }), " Count number of records"] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "AVG():" }), " Calculate average"] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "MIN() / MAX():" }), " Find minimum/maximum values"] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "+ - * /:" }), " Basic arithmetic operations"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { children: (0, jsx_runtime_1.jsx)("strong", { children: "Field Types:" }) }), (0, jsx_runtime_1.jsxs)("ul", { className: "list-disc list-inside ml-4 mt-2 space-y-1", children: [(0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Number:" }), " Numeric data for calculations"] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Count:" }), " Number of records (jobs, customers)"] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Sum:" }), " Total amounts (revenue, costs)"] }), (0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Average:" }), " Mean values (ratings, scores)"] })] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "border border-gray-200 rounded-lg p-6", children: [(0, jsx_runtime_1.jsxs)("h4", { className: "font-semibold text-gray-900 mb-3 flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Gauge, { className: "w-5 h-5 mr-2 text-purple-600" }), "Thresholds Tab - Setting Performance Levels"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4 text-sm text-gray-700", children: [(0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Why Set Thresholds?" }), " Thresholds help you quickly identify when performance is good, needs attention, or requires immediate action."] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-green-50 border border-green-200 rounded p-4", children: [(0, jsx_runtime_1.jsx)("h5", { className: "font-medium text-green-800 mb-2", children: "\u2705 Good Threshold" }), (0, jsx_runtime_1.jsx)("p", { className: "text-green-700 text-xs", children: "Values above this indicate excellent performance" }), (0, jsx_runtime_1.jsx)("p", { className: "text-green-600 font-mono text-xs mt-1", children: "Example: > 90%" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-yellow-50 border border-yellow-200 rounded p-4", children: [(0, jsx_runtime_1.jsx)("h5", { className: "font-medium text-yellow-800 mb-2", children: "\u26A0\uFE0F Warning Threshold" }), (0, jsx_runtime_1.jsx)("p", { className: "text-yellow-700 text-xs", children: "Values between good and critical need attention" }), (0, jsx_runtime_1.jsx)("p", { className: "text-yellow-600 font-mono text-xs mt-1", children: "Example: 70-90%" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-red-50 border border-red-200 rounded p-4", children: [(0, jsx_runtime_1.jsx)("h5", { className: "font-medium text-red-800 mb-2", children: "\uD83D\uDEA8 Critical Threshold" }), (0, jsx_runtime_1.jsx)("p", { className: "text-red-700 text-xs", children: "Values below this require immediate action" }), (0, jsx_runtime_1.jsx)("p", { className: "text-red-600 font-mono text-xs mt-1", children: "Example: < 70%" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { children: (0, jsx_runtime_1.jsx)("strong", { children: "Threshold Examples:" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-100 p-3 rounded mt-2 font-mono text-xs", children: [(0, jsx_runtime_1.jsx)("p", { children: (0, jsx_runtime_1.jsx)("strong", { children: "Revenue Growth:" }) }), (0, jsx_runtime_1.jsx)("p", { children: "Good: > 15% | Warning: 5-15% | Critical: < 5%" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2", children: (0, jsx_runtime_1.jsx)("strong", { children: "Job Completion Rate:" }) }), (0, jsx_runtime_1.jsx)("p", { children: "Good: > 95% | Warning: 85-95% | Critical: < 85%" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2", children: (0, jsx_runtime_1.jsx)("strong", { children: "Customer Satisfaction:" }) }), (0, jsx_runtime_1.jsx)("p", { children: "Good: > 4.5 | Warning: 3.5-4.5 | Critical: < 3.5" })] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "border border-gray-200 rounded-lg p-6", children: [(0, jsx_runtime_1.jsxs)("h4", { className: "font-semibold text-gray-900 mb-3 flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "w-5 h-5 mr-2 text-purple-600" }), "Visualization Tab - Choosing the Right Chart"] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4 text-sm text-gray-700", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "border border-gray-200 rounded p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Hash, { className: "w-4 h-4 mr-2 text-gray-600" }), (0, jsx_runtime_1.jsx)("h5", { className: "font-medium", children: "Number Display" })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-600", children: "Best for: Single values, totals, percentages" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 mt-1", children: "Examples: Total Revenue, Count of Jobs" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "border border-gray-200 rounded p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Gauge, { className: "w-4 h-4 mr-2 text-gray-600" }), (0, jsx_runtime_1.jsx)("h5", { className: "font-medium", children: "Gauge" })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-600", children: "Best for: Performance against targets" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 mt-1", children: "Examples: Completion Rate, Efficiency Score" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "border border-gray-200 rounded p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "w-4 h-4 mr-2 text-gray-600" }), (0, jsx_runtime_1.jsx)("h5", { className: "font-medium", children: "Line Chart" })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-600", children: "Best for: Trends over time" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 mt-1", children: "Examples: Revenue Growth, Customer Count" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "border border-gray-200 rounded p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "w-4 h-4 mr-2 text-gray-600" }), (0, jsx_runtime_1.jsx)("h5", { className: "font-medium", children: "Bar Chart" })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-600", children: "Best for: Comparing categories" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 mt-1", children: "Examples: Revenue by Service Type" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "border border-gray-200 rounded p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.PieChart, { className: "w-4 h-4 mr-2 text-gray-600" }), (0, jsx_runtime_1.jsx)("h5", { className: "font-medium", children: "Pie Chart" })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-600", children: "Best for: Showing proportions" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 mt-1", children: "Examples: Market Share, Service Distribution" })] })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "border border-gray-200 rounded-lg p-6", children: [(0, jsx_runtime_1.jsxs)("h4", { className: "font-semibold text-gray-900 mb-3 flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Play, { className: "w-5 h-5 mr-2 text-purple-600" }), "Testing & Best Practices"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4 text-sm text-gray-700", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-blue-50 border border-blue-200 rounded p-4", children: [(0, jsx_runtime_1.jsx)("h5", { className: "font-medium text-blue-900 mb-2", children: "\uD83E\uDDEA Always Test Your KPI" }), (0, jsx_runtime_1.jsx)("p", { className: "text-blue-800", children: "Use the \"Test KPI\" button to verify your formula works correctly before saving. Check that the result makes sense for your business." })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { children: (0, jsx_runtime_1.jsx)("strong", { children: "Best Practices:" }) }), (0, jsx_runtime_1.jsxs)("ul", { className: "list-disc list-inside ml-4 mt-2 space-y-1", children: [(0, jsx_runtime_1.jsx)("li", { children: "Start simple - build basic KPIs before complex ones" }), (0, jsx_runtime_1.jsx)("li", { children: "Use clear, descriptive names that anyone can understand" }), (0, jsx_runtime_1.jsx)("li", { children: "Set realistic thresholds based on historical data" }), (0, jsx_runtime_1.jsx)("li", { children: "Group related KPIs in the same category" }), (0, jsx_runtime_1.jsx)("li", { children: "Test formulas with sample data to ensure accuracy" }), (0, jsx_runtime_1.jsx)("li", { children: "Enable real-time updates only when necessary (performance impact)" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { children: (0, jsx_runtime_1.jsx)("strong", { children: "Common Formula Patterns:" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-100 p-3 rounded mt-2 font-mono text-xs", children: [(0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Growth Rate:" }), " (current - previous) / previous * 100"] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Completion Rate:" }), " completed_jobs / total_jobs * 100"] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Average Score:" }), " AVG(customer_rating)"] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Revenue per Customer:" }), " SUM(revenue) / COUNT(customers)"] })] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "border border-red-200 rounded-lg p-6 bg-red-50", children: [(0, jsx_runtime_1.jsxs)("h4", { className: "font-semibold text-red-900 mb-3 flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-5 h-5 mr-2" }), "Troubleshooting"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3 text-sm text-red-800", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { children: (0, jsx_runtime_1.jsx)("strong", { children: "Formula not working?" }) }), (0, jsx_runtime_1.jsxs)("ul", { className: "list-disc list-inside ml-4 mt-1 space-y-1", children: [(0, jsx_runtime_1.jsx)("li", { children: "Check that all field names are spelled correctly" }), (0, jsx_runtime_1.jsx)("li", { children: "Ensure you're using supported functions (SUM, COUNT, AVG)" }), (0, jsx_runtime_1.jsx)("li", { children: "Verify your data source has the fields you're referencing" }), (0, jsx_runtime_1.jsx)("li", { children: "Use the Test button to see specific error messages" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { children: (0, jsx_runtime_1.jsx)("strong", { children: "KPI showing unexpected values?" }) }), (0, jsx_runtime_1.jsxs)("ul", { className: "list-disc list-inside ml-4 mt-1 space-y-1", children: [(0, jsx_runtime_1.jsx)("li", { children: "Check if your thresholds are set correctly" }), (0, jsx_runtime_1.jsx)("li", { children: "Verify the data source contains the expected data" }), (0, jsx_runtime_1.jsx)("li", { children: "Test with a simple formula first, then add complexity" })] })] })] })] })] }))] }), activeTab !== 'templates' && ((0, jsx_runtime_1.jsx)("div", { className: "w-80 border-l border-gray-200 p-4 overflow-y-auto flex-shrink-0", children: activeTab === 'help' ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-medium text-gray-900 mb-4", children: "Quick Reference" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4 text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-blue-50 border border-blue-200 rounded p-3", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-blue-900 mb-2", children: "\uD83D\uDCA1 Quick Tips" }), (0, jsx_runtime_1.jsxs)("ul", { className: "space-y-1 text-blue-800", children: [(0, jsx_runtime_1.jsx)("li", { children: "\u2022 Start with simple formulas" }), (0, jsx_runtime_1.jsx)("li", { children: "\u2022 Test before saving" }), (0, jsx_runtime_1.jsx)("li", { children: "\u2022 Use descriptive names" }), (0, jsx_runtime_1.jsx)("li", { children: "\u2022 Set realistic thresholds" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-green-50 border border-green-200 rounded p-3", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-green-900 mb-2", children: "\uD83C\uDFAF Common KPIs" }), (0, jsx_runtime_1.jsxs)("ul", { className: "space-y-1 text-green-800", children: [(0, jsx_runtime_1.jsx)("li", { children: "\u2022 Revenue Growth" }), (0, jsx_runtime_1.jsx)("li", { children: "\u2022 Job Completion Rate" }), (0, jsx_runtime_1.jsx)("li", { children: "\u2022 Customer Satisfaction" }), (0, jsx_runtime_1.jsx)("li", { children: "\u2022 Response Time" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-purple-50 border border-purple-200 rounded p-3", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-purple-900 mb-2", children: "\uD83D\uDD27 Formula Help" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-purple-800 font-mono text-xs", children: [(0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "SUM(field)" }), " - Add values"] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "COUNT(field)" }), " - Count records"] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "AVG(field)" }), " - Average value"] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "+ - * /" }), " - Math operations"] })] })] })] })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-medium text-gray-900 mb-4", children: "Available Templates" }), (0, jsx_runtime_1.jsx)("div", { className: "mb-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search templates...", value: templateSearchTerm, onChange: function (e) { return setTemplateSearchTerm(e.target.value); }, className: "w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [templatesLoading ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-4 text-gray-500 text-sm", children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin w-6 h-6 mx-auto mb-2 border-2 border-purple-500 border-t-transparent rounded-full" }), (0, jsx_runtime_1.jsx)("p", { children: "Loading templates..." })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [userTemplates.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-gray-700 mb-2", children: "Your Templates" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: userTemplates.map(function (template) {
                                                                    var _a;
                                                                    return ((0, jsx_runtime_1.jsxs)("div", { draggable: true, onDragStart: function (e) {
                                                                            e.dataTransfer.setData('templateId', template.id);
                                                                            e.dataTransfer.setData('templateType', 'user');
                                                                            e.currentTarget.classList.add('opacity-50', 'scale-95');
                                                                        }, onDragEnd: function (e) {
                                                                            e.currentTarget.classList.remove('opacity-50', 'scale-95');
                                                                        }, onClick: function () {
                                                                            var _a, _b, _c, _d, _e, _f, _g;
                                                                            kpiBuilder.updateKPI({
                                                                                name: template.name,
                                                                                description: template.description || '',
                                                                                category: template.category === 'user' ? 'operational' : template.category,
                                                                                formula: {
                                                                                    id: "formula-".concat(Date.now()),
                                                                                    name: "".concat(template.name, " Formula"),
                                                                                    expression: template.formula_expression || '',
                                                                                    fields: ((_a = template.formula_fields) === null || _a === void 0 ? void 0 : _a.map(function (field) { return field.id; })) || [],
                                                                                    validation: { isValid: true, errors: [] }
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
                                                                                    timeRange: { field: 'created_at', start: new Date(), end: new Date() }
                                                                                }
                                                                            });
                                                                        }, className: "flex items-center p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all duration-200", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.GripVertical, { className: "w-4 h-4 text-gray-400 mr-3" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-sm", children: template.name }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500", children: template.description }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-1 mt-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800", children: "Custom" }), (0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800", children: ((_a = template.chart_config) === null || _a === void 0 ? void 0 : _a.type) || 'number' })] })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-4 h-4 text-purple-600" })] }, template.id));
                                                                }) })] })), systemTemplates.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-4", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-gray-700 mb-2", children: "System Templates" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: systemTemplates.map(function (template) {
                                                                    var _a;
                                                                    return ((0, jsx_runtime_1.jsxs)("div", { draggable: true, onDragStart: function (e) {
                                                                            e.dataTransfer.setData('templateId', template.id);
                                                                            e.dataTransfer.setData('templateType', 'system');
                                                                            e.currentTarget.classList.add('opacity-50', 'scale-95');
                                                                        }, onDragEnd: function (e) {
                                                                            e.currentTarget.classList.remove('opacity-50', 'scale-95');
                                                                        }, onClick: function () {
                                                                            var _a, _b, _c, _d, _e, _f, _g;
                                                                            kpiBuilder.updateKPI({
                                                                                name: template.name,
                                                                                description: template.description || '',
                                                                                category: template.category === 'user' ? 'operational' : template.category,
                                                                                formula: {
                                                                                    id: "formula-".concat(Date.now()),
                                                                                    name: "".concat(template.name, " Formula"),
                                                                                    expression: template.formula_expression || '',
                                                                                    fields: ((_a = template.formula_fields) === null || _a === void 0 ? void 0 : _a.map(function (field) { return field.id; })) || [],
                                                                                    validation: { isValid: true, errors: [] }
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
                                                                                    timeRange: { field: 'created_at', start: new Date(), end: new Date() }
                                                                                }
                                                                            });
                                                                        }, className: "flex items-center p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all duration-200", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.GripVertical, { className: "w-4 h-4 text-gray-400 mr-3" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-sm", children: template.name }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500", children: template.description }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-1 mt-1", children: [(0, jsx_runtime_1.jsx)("span", { className: (0, utils_1.cn)("inline-flex items-center px-2 py-1 rounded-full text-xs font-medium", template.category === 'financial' ? 'bg-green-100 text-green-800' :
                                                                                                    template.category === 'operational' ? 'bg-blue-100 text-blue-800' :
                                                                                                        template.category === 'customer' ? 'bg-purple-100 text-purple-800' :
                                                                                                            template.category === 'compliance' ? 'bg-orange-100 text-orange-800' :
                                                                                                                'bg-gray-100 text-gray-800'), children: template.category }), (0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800", children: ((_a = template.chart_config) === null || _a === void 0 ? void 0 : _a.type) || 'number' })] })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-4 h-4 text-purple-600" })] }, template.id));
                                                                }) })] })), filteredTemplates.length === 0 && !templatesLoading && ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-4 text-gray-500 text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "w-6 h-6 mx-auto mb-2 text-gray-400" }), (0, jsx_runtime_1.jsx)("p", { children: templateSearchTerm ? 'No templates found' : 'No templates available' }), templateSearchTerm && ((0, jsx_runtime_1.jsx)("button", { onClick: function () { return setTemplateSearchTerm(''); }, className: "text-purple-600 hover:text-purple-800 text-xs mt-1", children: "Clear search" }))] }))] })), (0, jsx_runtime_1.jsxs)("div", { className: "mb-4", style: { display: 'none' }, children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-gray-700 mb-2", children: "System Templates" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { draggable: true, onDragStart: function (e) {
                                                                    e.dataTransfer.setData('templateId', 'revenue-growth');
                                                                    e.dataTransfer.setData('templateType', 'system');
                                                                    e.currentTarget.classList.add('opacity-50', 'scale-95');
                                                                }, onDragEnd: function (e) {
                                                                    e.currentTarget.classList.remove('opacity-50', 'scale-95');
                                                                }, onClick: function () {
                                                                    // Load revenue growth template
                                                                    kpiBuilder.updateKPI({
                                                                        name: 'Revenue Growth',
                                                                        description: 'Monthly revenue growth percentage',
                                                                        category: 'financial',
                                                                        formula: {
                                                                            id: "formula-".concat(Date.now()),
                                                                            name: 'Revenue Growth Formula',
                                                                            expression: 'SUM(revenue_current) / SUM(revenue_previous) * 100',
                                                                            fields: [],
                                                                            validation: { isValid: true, errors: [] }
                                                                        },
                                                                        threshold: { green: 15, yellow: 5, red: 0, unit: '%' },
                                                                        chart: { type: 'line', colorScheme: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'] },
                                                                        dataSource: { table: 'revenue', timeRange: { field: 'created_at', start: new Date(), end: new Date() } }
                                                                    });
                                                                }, className: "flex items-center p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all duration-200", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.GripVertical, { className: "w-4 h-4 text-gray-400 mr-3" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-sm", children: "Revenue Growth" }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500", children: "Monthly revenue growth percentage" })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-4 h-4 text-purple-600" })] }), (0, jsx_runtime_1.jsxs)("div", { draggable: true, onDragStart: function (e) {
                                                                    e.dataTransfer.setData('templateId', 'customer-satisfaction');
                                                                    e.dataTransfer.setData('templateType', 'system');
                                                                    e.currentTarget.classList.add('opacity-50', 'scale-95');
                                                                }, onDragEnd: function (e) {
                                                                    e.currentTarget.classList.remove('opacity-50', 'scale-95');
                                                                }, onClick: function () {
                                                                    // Load customer satisfaction template
                                                                    kpiBuilder.updateKPI({
                                                                        name: 'Customer Satisfaction',
                                                                        description: 'Average customer rating',
                                                                        category: 'customer',
                                                                        formula: {
                                                                            id: "formula-".concat(Date.now()),
                                                                            name: 'Customer Satisfaction Formula',
                                                                            expression: 'AVG(customer_rating)',
                                                                            fields: [],
                                                                            validation: { isValid: true, errors: [] }
                                                                        },
                                                                        threshold: { green: 4.5, yellow: 3.5, red: 3.0, unit: 'stars' },
                                                                        chart: { type: 'gauge', colorScheme: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'] },
                                                                        dataSource: { table: 'reviews', timeRange: { field: 'created_at', start: new Date(), end: new Date() } }
                                                                    });
                                                                }, className: "flex items-center p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all duration-200", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.GripVertical, { className: "w-4 h-4 text-gray-400 mr-3" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-sm", children: "Customer Satisfaction" }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500", children: "Average customer rating" })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-4 h-4 text-purple-600" })] }), (0, jsx_runtime_1.jsxs)("div", { draggable: true, onDragStart: function (e) {
                                                                    e.dataTransfer.setData('templateId', 'job-completion');
                                                                    e.dataTransfer.setData('templateType', 'system');
                                                                    e.currentTarget.classList.add('opacity-50', 'scale-95');
                                                                }, onDragEnd: function (e) {
                                                                    e.currentTarget.classList.remove('opacity-50', 'scale-95');
                                                                }, onClick: function () {
                                                                    // Load job completion template
                                                                    kpiBuilder.updateKPI({
                                                                        name: 'Job Completion Rate',
                                                                        description: 'Percentage of completed jobs',
                                                                        category: 'operational',
                                                                        formula: {
                                                                            id: "formula-".concat(Date.now()),
                                                                            name: 'Job Completion Formula',
                                                                            expression: 'COUNT(completed_jobs) / COUNT(total_jobs) * 100',
                                                                            fields: [],
                                                                            validation: { isValid: true, errors: [] }
                                                                        },
                                                                        threshold: { green: 95, yellow: 85, red: 75, unit: '%' },
                                                                        chart: { type: 'number', colorScheme: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'] },
                                                                        dataSource: { table: 'jobs', timeRange: { field: 'created_at', start: new Date(), end: new Date() } }
                                                                    });
                                                                }, className: "flex items-center p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all duration-200", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.GripVertical, { className: "w-4 h-4 text-gray-400 mr-3" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-sm", children: "Job Completion Rate" }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500", children: "Percentage of completed jobs" })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-4 h-4 text-purple-600" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-gray-700 mb-2", children: "Your Templates" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center py-4 text-gray-500 text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-6 h-6 mx-auto mb-2 text-gray-400" }), (0, jsx_runtime_1.jsx)("p", { children: "No custom templates yet" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs", children: "Create templates from your KPIs" })] }) })] })] })] })) }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: kpiBuilder.resetBuilder, className: "flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RotateCcw, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { children: "Reset" })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: handleTest, disabled: !((_p = kpiBuilder.currentKPI.formula) === null || _p === void 0 ? void 0 : _p.expression) || isTesting, className: (0, utils_1.cn)("flex items-center space-x-2 px-4 py-2 rounded-md transition-colors", ((_q = kpiBuilder.currentKPI.formula) === null || _q === void 0 ? void 0 : _q.expression) && !isTesting
                                        ? "text-blue-600 hover:bg-blue-100"
                                        : "text-gray-400 cursor-not-allowed"), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Play, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { children: isTesting ? 'Testing...' : 'Test KPI' })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors", children: "Cancel" }), (0, jsx_runtime_1.jsxs)("button", { onClick: handleSave, disabled: !kpiBuilder.isKPIValid || createTemplateMutation.isPending, className: (0, utils_1.cn)("flex items-center space-x-2 px-4 py-2 rounded-md transition-colors", kpiBuilder.isKPIValid && !createTemplateMutation.isPending
                                        ? "bg-purple-600 text-white hover:bg-purple-700"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Save, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { children: createTemplateMutation.isPending
                                                ? "Saving..."
                                                : isEditingTemplate
                                                    ? "Save Template"
                                                    : "Save KPI" })] })] })] })] }) }));
};
exports.default = KPIBuilder;
