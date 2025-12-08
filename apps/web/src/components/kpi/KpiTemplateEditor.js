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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = KpiTemplateEditor;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_hook_form_1 = require("react-hook-form");
var zod_1 = require("@hookform/resolvers/zod");
var zod_2 = require("zod");
var useKpiTemplates_1 = require("@/hooks/useKpiTemplates");
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var Textarea_1 = __importDefault(require("@/components/ui/Textarea"));
var Select_1 = __importDefault(require("@/components/ui/Select"));
var Checkbox_1 = __importDefault(require("@/components/ui/Checkbox"));
var Card_1 = __importDefault(require("@/components/ui/Card"));
var ui_1 = require("@/components/ui");
var Dialog_1 = require("@/components/ui/Dialog");
var lucide_react_1 = require("lucide-react");
var logger_1 = require("@/utils/logger");
var toast_1 = require("@/utils/toast");
// KPI Template Form Schema
var kpiTemplateFieldSchema = zod_2.z.object({
    field_name: zod_2.z.string().min(1, 'Field name is required'),
    field_type: zod_2.z.enum(['number', 'text', 'date', 'boolean']),
    table_name: zod_2.z.string().min(1, 'Table name is required'),
    column_name: zod_2.z.string().min(1, 'Column name is required'),
    aggregation_type: zod_2.z.enum(['sum', 'count', 'avg', 'min', 'max']).optional(),
    display_name: zod_2.z.string().optional(),
    description: zod_2.z.string().optional(),
    is_required: zod_2.z.boolean().optional(),
    sort_order: zod_2.z.number().optional(),
});
var kpiTemplateSchema = zod_2.z.object({
    name: zod_2.z.string().min(1, 'Template name is required'),
    description: zod_2.z.string().optional(),
    category: zod_2.z.enum(['financial', 'operational', 'customer', 'compliance', 'user']).default('financial'),
    template_type: zod_2.z.enum(['system', 'user', 'shared']).default('user'),
    formula_expression: zod_2.z.string().min(1, 'Formula expression is required'),
    formula_fields: zod_2.z.array(kpiTemplateFieldSchema).default([]),
    threshold_config: zod_2.z.object({
        green: zod_2.z.number().min(0),
        yellow: zod_2.z.number().min(0),
        red: zod_2.z.number().min(0),
        unit: zod_2.z.string().optional(),
    }).default({
        green: 80,
        yellow: 60,
        red: 40,
        unit: '%'
    }),
    chart_config: zod_2.z.object({
        type: zod_2.z.string().default('gauge'),
        colorScheme: zod_2.z.array(zod_2.z.string()).default(['#ef4444', '#f59e0b', '#10b981']),
    }).default({
        type: 'gauge',
        colorScheme: ['#ef4444', '#f59e0b', '#10b981']
    }),
    data_source_config: zod_2.z.object({
        table: zod_2.z.string().default(''),
        timeRange: zod_2.z.string().default('monthly'),
    }).default({
        table: '',
        timeRange: 'monthly'
    }),
    tags: zod_2.z.array(zod_2.z.string()).default([]),
    is_public: zod_2.z.boolean().default(false),
    is_featured: zod_2.z.boolean().default(false),
    status: zod_2.z.enum(['draft', 'published', 'archived']).default('draft'),
});
function KpiTemplateEditor(_a) {
    var _this = this;
    var _b, _c, _d;
    var templateId = _a.templateId, isOpen = _a.isOpen, onClose = _a.onClose, onSave = _a.onSave;
    var _e = (0, react_1.useState)('basic'), activeTab = _e[0], setActiveTab = _e[1];
    var _f = (0, react_1.useState)(false), isSubmitting = _f[0], setIsSubmitting = _f[1];
    var _g = (0, react_1.useState)(''), newTag = _g[0], setNewTag = _g[1];
    var _h = (0, react_1.useState)({
        field_name: '',
        field_type: 'number',
        table_name: '',
        column_name: '',
        aggregation_type: 'count',
        display_name: '',
        description: '',
        is_required: false,
        sort_order: 0
    }), newField = _h[0], setNewField = _h[1];
    // API hooks
    var _j = (0, useKpiTemplates_1.useKpiTemplate)(templateId || ''), existingTemplate = _j.data, _isLoading = _j.isLoading;
    var createMutation = (0, useKpiTemplates_1.useCreateKpiTemplate)();
    var updateMutation = (0, useKpiTemplates_1.useUpdateKpiTemplate)();
    // Form setup
    var _k = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(kpiTemplateSchema),
        defaultValues: {
            name: '',
            description: '',
            category: 'financial',
            template_type: 'user',
            formula_expression: '',
            formula_fields: [],
            threshold_config: {
                green: 80,
                yellow: 60,
                red: 40,
                unit: '%'
            },
            chart_config: {
                type: 'gauge',
                colorScheme: ['#ef4444', '#f59e0b', '#10b981']
            },
            data_source_config: {
                table: '',
                timeRange: 'monthly'
            },
            tags: [],
            is_public: false,
            is_featured: false,
            status: 'draft'
        },
    }), control = _k.control, handleSubmit = _k.handleSubmit, errors = _k.formState.errors, watch = _k.watch, setValue = _k.setValue, reset = _k.reset;
    var formData = watch();
    // Load existing template data
    (0, react_1.useEffect)(function () {
        if (existingTemplate) {
            reset({
                name: existingTemplate.name,
                description: existingTemplate.description || '',
                category: existingTemplate.category,
                template_type: existingTemplate.template_type,
                formula_expression: existingTemplate.formula_expression,
                formula_fields: existingTemplate.formula_fields || [],
                threshold_config: existingTemplate.threshold_config,
                chart_config: existingTemplate.chart_config,
                data_source_config: existingTemplate.data_source_config,
                tags: existingTemplate.tags || [],
                is_public: existingTemplate.is_public,
                is_featured: existingTemplate.is_featured,
                status: existingTemplate.status
            });
        }
    }, [existingTemplate, reset]);
    var categories = [
        { id: 'financial', name: 'Financial', icon: lucide_react_1.DollarSign, color: 'bg-green-100 text-green-800' },
        { id: 'operational', name: 'Operational', icon: lucide_react_1.Settings, color: 'bg-blue-100 text-blue-800' },
        { id: 'customer', name: 'Customer', icon: lucide_react_1.Users, color: 'bg-purple-100 text-purple-800' },
        { id: 'compliance', name: 'Compliance', icon: lucide_react_1.Shield, color: 'bg-orange-100 text-orange-800' },
        { id: 'user', name: 'User Defined', icon: lucide_react_1.BarChart3, color: 'bg-gray-100 text-gray-800' }
    ];
    var chartTypes = [
        { id: 'gauge', name: 'Gauge', icon: lucide_react_1.Gauge, description: 'Circular progress indicator' },
        { id: 'line', name: 'Line Chart', icon: lucide_react_1.TrendingUp, description: 'Trend over time' },
        { id: 'bar', name: 'Bar Chart', icon: lucide_react_1.BarChart3, description: 'Comparative values' },
        { id: 'pie', name: 'Pie Chart', icon: lucide_react_1.PieChart, description: 'Proportional breakdown' }
    ];
    var aggregationTypes = ['count', 'sum', 'avg', 'min', 'max'];
    var fieldTypes = ['number', 'text', 'date', 'boolean'];
    var onSubmit = function (data) { return __awaiter(_this, void 0, void 0, function () {
        var result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsSubmitting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    result = void 0;
                    if (!templateId) return [3 /*break*/, 3];
                    return [4 /*yield*/, updateMutation.mutateAsync({
                            id: templateId,
                            data: data
                        })];
                case 2:
                    result = _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, createMutation.mutateAsync(data)];
                case 4:
                    result = _a.sent();
                    _a.label = 5;
                case 5:
                    onSave === null || onSave === void 0 ? void 0 : onSave(result);
                    onClose();
                    return [3 /*break*/, 8];
                case 6:
                    error_1 = _a.sent();
                    logger_1.logger.error('Failed to save template', error_1, 'KpiTemplateEditor');
                    toast_1.toast.error('Failed to save template. Please try again.');
                    return [3 /*break*/, 8];
                case 7:
                    setIsSubmitting(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var addTag = function () {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setValue('tags', __spreadArray(__spreadArray([], formData.tags, true), [newTag.trim()], false));
            setNewTag('');
        }
    };
    var removeTag = function (tagToRemove) {
        setValue('tags', formData.tags.filter(function (tag) { return tag !== tagToRemove; }));
    };
    var addField = function () {
        if (newField.field_name && newField.table_name && newField.column_name) {
            setValue('formula_fields', __spreadArray(__spreadArray([], formData.formula_fields, true), [__assign(__assign({}, newField), { sort_order: formData.formula_fields.length })], false));
            setNewField({
                field_name: '',
                field_type: 'number',
                table_name: '',
                column_name: '',
                aggregation_type: 'count',
                display_name: '',
                description: '',
                is_required: false,
                sort_order: 0
            });
        }
    };
    var removeField = function (index) {
        setValue('formula_fields', formData.formula_fields.filter(function (_, i) { return i !== index; }));
    };
    if (!isOpen)
        return null;
    return ((0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: isOpen, onOpenChange: function (open) { return !open && onClose(); }, children: (0, jsx_runtime_1.jsx)(Dialog_1.DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg shadow-xl w-full max-h-[90vh] overflow-hidden flex flex-col", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-6 border-b border-gray-200", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-gray-900", children: templateId ? 'Edit KPI Template' : 'Create KPI Template' }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: templateId ? 'Modify template settings and configuration' : 'Create a new KPI template for reuse' })] }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600 transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-6 h-6" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex border-b border-gray-200", children: [
                            { id: 'basic', name: 'Basic Info', icon: lucide_react_1.Eye },
                            { id: 'formula', name: 'Formula', icon: lucide_react_1.Code },
                            { id: 'fields', name: 'Fields', icon: lucide_react_1.GripVertical },
                            { id: 'threshold', name: 'Thresholds', icon: lucide_react_1.Gauge },
                            { id: 'chart', name: 'Chart', icon: lucide_react_1.Palette },
                            { id: 'preview', name: 'Preview', icon: lucide_react_1.BarChart3 }
                        ].map(function (tab) { return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setActiveTab(tab.id); }, className: "flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ".concat(activeTab === tab.id
                                ? "border-purple-500 text-purple-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"), children: [(0, jsx_runtime_1.jsx)(tab.icon, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { children: tab.name })] }, tab.id)); }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 p-6 overflow-y-auto", children: [activeTab === 'basic' && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "name", control: control, render: function (_a) {
                                            var _b;
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Template Name *", value: field.value, onChange: function (e) { return field.onChange(e.target.value); }, placeholder: "Enter template name..." }, (((_b = errors.name) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.name.message } : {}))));
                                        } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "description", control: control, render: function (_a) {
                                            var _b;
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsx)(Textarea_1.default, __assign({ label: "Description", value: field.value || '', onChange: function (e) { return field.onChange(e.target.value); }, placeholder: "Describe what this template measures...", rows: 3 }, (((_b = errors.description) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.description.message } : {}))));
                                        } }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-3", children: "Category *" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 gap-3", children: categories.map(function (category) {
                                                    var Icon = category.icon;
                                                    return ((0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: function () { return setValue('category', category.id); }, className: "p-3 rounded-lg border-2 transition-colors ".concat(formData.category === category.id
                                                            ? "border-purple-500 bg-purple-50"
                                                            : "border-gray-200 hover:border-gray-300"), children: [(0, jsx_runtime_1.jsxs)("div", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-2 ".concat(category.color), children: [(0, jsx_runtime_1.jsx)(Icon, { className: "h-3 w-3 mr-1" }), category.name] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600", children: [category.name, " metrics and indicators"] })] }, category.id));
                                                }) })] }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "template_type", control: control, render: function (_a) {
                                            var _b;
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsx)(Select_1.default, __assign({ label: "Template Type", value: field.value, onChange: function (value) { return field.onChange(value); }, options: [
                                                    { value: 'user', label: 'User Template' },
                                                    { value: 'shared', label: 'Shared Template' },
                                                    { value: 'system', label: 'System Template' },
                                                ] }, (((_b = errors.template_type) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.template_type.message } : {}))));
                                        } }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Tags" }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2 mb-2", children: formData.tags.map(function (tag) { return ((0, jsx_runtime_1.jsxs)(ui_1.Badge, { className: "bg-purple-100 text-purple-800", children: [tag, (0, jsx_runtime_1.jsx)("button", { onClick: function () { return removeTag(tag); }, className: "ml-1 text-purple-600 hover:text-purple-800", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-3 w-3" }) })] }, tag)); }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)(Input_1.default, { value: newTag, onChange: function (e) { return setNewTag(e.target.value); }, placeholder: "Add a tag...", onKeyPress: function (e) { return e.key === 'Enter' && addTag(); } }), (0, jsx_runtime_1.jsx)(Button_1.default, { onClick: addTag, size: "sm", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4" }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-4", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "is_public", control: control, render: function (_a) {
                                                    var field = _a.field;
                                                    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(Checkbox_1.default, { checked: field.value, onChange: function (checked) { return field.onChange(checked); } }), (0, jsx_runtime_1.jsx)("label", { className: "text-sm text-gray-700", children: "Make this template public" })] }));
                                                } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "is_featured", control: control, render: function (_a) {
                                                    var field = _a.field;
                                                    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(Checkbox_1.default, { checked: field.value, onChange: function (checked) { return field.onChange(checked); } }), (0, jsx_runtime_1.jsx)("label", { className: "text-sm text-gray-700", children: "Feature this template" })] }));
                                                } })] })] })), activeTab === 'formula' && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "formula_expression", control: control, render: function (_a) {
                                            var _b;
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(Textarea_1.default, __assign({ label: "Formula Expression *", value: field.value, onChange: function (e) { return field.onChange(e.target.value); }, placeholder: "Enter the formula expression (e.g., COUNT(jobs), AVG(revenue), etc.)", rows: 4, className: "font-mono" }, (((_b = errors.formula_expression) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.formula_expression.message } : {}))), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-500 mt-1", children: ["Use field names from the Fields tab in your formula (e.g., ", "{field_name}", ")"] })] }));
                                        } }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Data Source Configuration" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "data_source_config.table", control: control, render: function (_a) {
                                                            var field = _a.field;
                                                            return ((0, jsx_runtime_1.jsx)(Input_1.default, { label: "Primary Table", value: field.value, onChange: function (e) {
                                                                    setValue('data_source_config', __assign(__assign({}, formData.data_source_config), { table: e.target.value }));
                                                                }, placeholder: "e.g., jobs, invoices" }));
                                                        } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "data_source_config.timeRange", control: control, render: function (_a) {
                                                            var field = _a.field;
                                                            return ((0, jsx_runtime_1.jsx)(Select_1.default, { label: "Time Range", value: field.value, onChange: function (value) {
                                                                    setValue('data_source_config', __assign(__assign({}, formData.data_source_config), { timeRange: value }));
                                                                }, options: [
                                                                    { value: 'daily', label: 'Daily' },
                                                                    { value: 'weekly', label: 'Weekly' },
                                                                    { value: 'monthly', label: 'Monthly' },
                                                                    { value: 'quarterly', label: 'Quarterly' },
                                                                    { value: 'annually', label: 'Annually' },
                                                                ] }));
                                                        } })] })] })] })), activeTab === 'fields' && ((0, jsx_runtime_1.jsx)("div", { className: "space-y-6", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "Formula Fields" }), (0, jsx_runtime_1.jsxs)(Card_1.default, { title: "Add New Field", className: "mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)(Input_1.default, { placeholder: "Field Name", value: newField.field_name, onChange: function (e) { return setNewField(function (prev) { return (__assign(__assign({}, prev), { field_name: e.target.value })); }); } }), (0, jsx_runtime_1.jsx)(Input_1.default, { placeholder: "Display Name", value: newField.display_name, onChange: function (e) { return setNewField(function (prev) { return (__assign(__assign({}, prev), { display_name: e.target.value })); }); } }), (0, jsx_runtime_1.jsx)(Input_1.default, { placeholder: "Table Name", value: newField.table_name, onChange: function (e) { return setNewField(function (prev) { return (__assign(__assign({}, prev), { table_name: e.target.value })); }); } }), (0, jsx_runtime_1.jsx)(Input_1.default, { placeholder: "Column Name", value: newField.column_name, onChange: function (e) { return setNewField(function (prev) { return (__assign(__assign({}, prev), { column_name: e.target.value })); }); } }), (0, jsx_runtime_1.jsx)(Select_1.default, { label: "Field Type", value: newField.field_type || 'number', onChange: function (value) { return setNewField(function (prev) { return (__assign(__assign({}, prev), { field_type: value })); }); }, options: fieldTypes.map(function (type) { return ({ value: type, label: type }); }) }), (0, jsx_runtime_1.jsx)(Select_1.default, { label: "Aggregation Type", value: newField.aggregation_type || '', onChange: function (value) {
                                                                return setNewField(function (prev) {
                                                                    var next = __assign({}, prev);
                                                                    if (value) {
                                                                        next.aggregation_type = value;
                                                                    }
                                                                    else {
                                                                        delete next.aggregation_type;
                                                                    }
                                                                    return next;
                                                                });
                                                            }, options: __spreadArray([
                                                                { value: '', label: 'No aggregation' }
                                                            ], aggregationTypes.map(function (type) { return ({ value: type, label: type }); }), true) })] }), (0, jsx_runtime_1.jsxs)(Button_1.default, { onClick: addField, className: "mt-4", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4 mr-2" }), "Add Field"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: formData.formula_fields.map(function (field, index) { return ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Badge, { children: field.field_name }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "outline", children: field.field_type }), field.aggregation_type && ((0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "secondary", children: field.aggregation_type }))] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600", children: [field.table_name, ".", field.column_name] }), field.description && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500 mt-1", children: field.description }))] }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: function () { return removeField(index); }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "h-4 w-4" }) })] }) }, index)); }) })] }) })), activeTab === 'threshold' && ((0, jsx_runtime_1.jsx)("div", { className: "space-y-6", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "Threshold Configuration" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Green Threshold (Good)" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "number", value: formData.threshold_config.green, onChange: function (e) {
                                                                return setValue('threshold_config', __assign(__assign({}, formData.threshold_config), { green: Number(e.target.value) }));
                                                            } })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Yellow Threshold (Warning)" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "number", value: formData.threshold_config.yellow, onChange: function (e) {
                                                                return setValue('threshold_config', __assign(__assign({}, formData.threshold_config), { yellow: Number(e.target.value) }));
                                                            } })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Red Threshold (Critical)" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "number", value: formData.threshold_config.red, onChange: function (e) {
                                                                return setValue('threshold_config', __assign(__assign({}, formData.threshold_config), { red: Number(e.target.value) }));
                                                            } })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Unit" }), (0, jsx_runtime_1.jsx)(Input_1.default, { value: formData.threshold_config.unit || '', onChange: function (e) {
                                                                return setValue('threshold_config', __assign(__assign({}, formData.threshold_config), { unit: e.target.value }));
                                                            }, placeholder: "e.g., %, $, count" })] })] })] }) })), activeTab === 'chart' && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "Chart Configuration" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 gap-4 mb-6", children: chartTypes.map(function (chart) {
                                                    var Icon = chart.icon;
                                                    return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () {
                                                            return setValue('chart_config', __assign(__assign({}, formData.chart_config), { type: chart.id }));
                                                        }, className: "p-4 rounded-lg border-2 transition-colors ".concat(formData.chart_config.type === chart.id
                                                            ? "border-purple-500 bg-purple-50"
                                                            : "border-gray-200 hover:border-gray-300"), children: [(0, jsx_runtime_1.jsx)(Icon, { className: "h-6 w-6 mx-auto mb-2 text-gray-600" }), (0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-900", children: chart.name }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: chart.description })] }, chart.id));
                                                }) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Color Scheme" }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-2", children: formData.chart_config.colorScheme.map(function (color, index) { return ((0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 rounded border border-gray-300", style: { backgroundColor: color } }, index)); }) })] })] })), activeTab === 'preview' && ((0, jsx_runtime_1.jsx)("div", { className: "space-y-6", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "Template Preview" }), (0, jsx_runtime_1.jsxs)(Card_1.default, { title: formData.name || 'Untitled Template', children: [(0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 mb-4", children: formData.description || 'No description provided' }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap gap-2 mb-4", children: [(0, jsx_runtime_1.jsx)(ui_1.Badge, { className: "".concat((_b = categories.find(function (c) { return c.id === formData.category; })) === null || _b === void 0 ? void 0 : _b.color), children: (_c = categories.find(function (c) { return c.id === formData.category; })) === null || _c === void 0 ? void 0 : _c.name }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { className: "bg-blue-100 text-blue-800", children: formData.template_type }), formData.tags.map(function (tag) { return ((0, jsx_runtime_1.jsx)(ui_1.Badge, { className: "bg-gray-100 text-gray-600", children: tag }, tag)); })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-900", children: "Formula:" }), (0, jsx_runtime_1.jsx)("code", { className: "block bg-gray-100 p-2 rounded text-sm font-mono", children: formData.formula_expression || 'No formula defined' })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-900", children: "Thresholds:" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-4 text-sm", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-green-600", children: ["Green: ", formData.threshold_config.green, formData.threshold_config.unit] }), (0, jsx_runtime_1.jsxs)("span", { className: "text-yellow-600", children: ["Yellow: ", formData.threshold_config.yellow, formData.threshold_config.unit] }), (0, jsx_runtime_1.jsxs)("span", { className: "text-red-600", children: ["Red: ", formData.threshold_config.red, formData.threshold_config.unit] })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-900", children: "Chart Type:" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: (_d = chartTypes.find(function (c) { return c.id === formData.chart_config.type; })) === null || _d === void 0 ? void 0 : _d.name })] })] })] })] }) }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-6 border-t border-gray-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm text-gray-500", children: [(0, jsx_runtime_1.jsx)("span", { children: "Status:" }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { className: "bg-gray-100 text-gray-800", children: formData.status })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: onClose, children: "Cancel" }), (0, jsx_runtime_1.jsxs)(Button_1.default, { onClick: handleSubmit(onSubmit), disabled: isSubmitting || !formData.name || !formData.formula_expression, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Save, { className: "h-4 w-4 mr-2" }), isSubmitting ? 'Saving...' : templateId ? 'Update Template' : 'Create Template'] })] })] })] }) }) }));
}
