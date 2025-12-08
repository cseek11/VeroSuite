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
exports.default = ServiceTemplates;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var react_hook_form_1 = require("react-hook-form");
var zod_1 = require("@hookform/resolvers/zod");
var zod_2 = require("zod");
var supabase_client_1 = require("@/lib/supabase-client");
var lucide_react_1 = require("lucide-react");
var Input_1 = __importDefault(require("@/components/ui/Input"));
var Textarea_1 = __importDefault(require("@/components/ui/Textarea"));
var Select_1 = __importDefault(require("@/components/ui/Select"));
var Checkbox_1 = __importDefault(require("@/components/ui/Checkbox"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Dialog_1 = require("@/components/ui/Dialog");
function ServiceTemplates() {
    var _this = this;
    var queryClient = (0, react_query_1.useQueryClient)();
    var _a = (0, react_1.useState)(false), isAddingTemplate = _a[0], setIsAddingTemplate = _a[1];
    var _b = (0, react_1.useState)(null), editingTemplate = _b[0], setEditingTemplate = _b[1];
    var _c = (0, react_1.useState)(null), selectedTemplate = _c[0], setSelectedTemplate = _c[1];
    // Fetch service templates
    var _d = (0, react_query_1.useQuery)({
        queryKey: ['service-templates'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase_client_1.supabase
                            .from('service_templates')
                            .select("\n          *,\n          customer_segments (\n            segment_name,\n            segment_code,\n            pricing_tier\n          )\n        ")
                            .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28')
                            .order('template_name')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        }); },
    }), serviceTemplates = _d.data, loadingTemplates = _d.isLoading;
    // Fetch customer segments
    var _e = (0, react_query_1.useQuery)({
        queryKey: ['customer-segments'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase_client_1.supabase
                            .from('customer_segments')
                            .select('*')
                            .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28')
                            .eq('is_active', true)
                            .order('segment_name')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        }); },
    }), customerSegments = _e.data, loadingSegments = _e.isLoading;
    // Fetch service types
    var _f = (0, react_query_1.useQuery)({
        queryKey: ['service-types'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase_client_1.supabase
                            .from('service_types')
                            .select('*')
                            .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28')
                            .eq('is_active', true)
                            .order('type_name')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        }); },
    }), serviceTypes = _f.data, loadingServiceTypes = _f.isLoading;
    // Create template mutation
    var createTemplateMutation = (0, react_query_1.useMutation)({
        mutationFn: function (template) { return __awaiter(_this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase_client_1.supabase
                            .from('service_templates')
                            .insert(__assign(__assign({}, template), { tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28' }))
                            .select()
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['service-templates'] });
            setIsAddingTemplate(false);
        },
    });
    // Update template mutation
    var updateTemplateMutation = (0, react_query_1.useMutation)({
        mutationFn: function (template) { return __awaiter(_this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase_client_1.supabase
                            .from('service_templates')
                            .update(template)
                            .eq('id', template.id)
                            .select()
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['service-templates'] });
            setEditingTemplate(null);
        },
    });
    // Delete template mutation
    var deleteTemplateMutation = (0, react_query_1.useMutation)({
        mutationFn: function (id) { return __awaiter(_this, void 0, void 0, function () {
            var error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, supabase_client_1.supabase
                            .from('service_templates')
                            .delete()
                            .eq('id', id)];
                    case 1:
                        error = (_a.sent()).error;
                        if (error)
                            throw error;
                        return [2 /*return*/];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['service-templates'] });
            setSelectedTemplate(null);
        },
    });
    // Duplicate template mutation
    var duplicateTemplateMutation = (0, react_query_1.useMutation)({
        mutationFn: function (template) { return __awaiter(_this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase_client_1.supabase
                            .from('service_templates')
                            .insert(__assign(__assign({}, template), { id: undefined, template_name: "".concat(template.template_name, " (Copy)"), template_code: "".concat(template.template_code, "_COPY"), tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28' }))
                            .select()
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['service-templates'] });
        },
    });
    if (loadingTemplates || loadingSegments || loadingServiceTypes) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-64", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" }) }));
    }
    var getSegmentColor = function (pricingTier) {
        var colors = {
            'basic': 'bg-blue-100 text-blue-800',
            'standard': 'bg-green-100 text-green-800',
            'premium': 'bg-purple-100 text-purple-800',
            'enterprise': 'bg-indigo-100 text-indigo-800',
        };
        return colors[pricingTier.toLowerCase()] || 'bg-slate-100 text-slate-800';
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-white shadow-sm border border-slate-200 rounded-lg", children: (0, jsx_runtime_1.jsx)("div", { className: "px-6 py-4 border-b border-slate-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-slate-900", children: "Service Templates" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-600", children: "Create and manage service templates by customer segment for consistent service delivery" })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setIsAddingTemplate(true); }, className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4 mr-2" }), "Add Template"] })] }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: serviceTemplates === null || serviceTemplates === void 0 ? void 0 : serviceTemplates.map(function (template) {
                    var _a, _b, _c;
                    return ((0, jsx_runtime_1.jsx)("div", { className: "bg-white shadow-sm border border-slate-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer", onClick: function () { return setSelectedTemplate(template); }, children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-slate-900 mb-1", children: template.template_name }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-500 mb-2", children: template.template_code }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2 mb-3", children: [(0, jsx_runtime_1.jsx)("span", { className: "inline-flex px-2 py-1 text-xs font-semibold rounded-full ".concat(getSegmentColor(((_a = template.customer_segments) === null || _a === void 0 ? void 0 : _a.pricing_tier) || 'basic')), children: ((_b = template.customer_segments) === null || _b === void 0 ? void 0 : _b.segment_name) || 'N/A' }), (0, jsx_runtime_1.jsx)("span", { className: "inline-flex px-2 py-1 text-xs font-semibold rounded-full ".concat(template.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'), children: template.is_active ? 'Active' : 'Inactive' })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function (e) {
                                                        e.stopPropagation();
                                                        duplicateTemplateMutation.mutate(template);
                                                    }, className: "text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50", title: "Duplicate Template", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Copy, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function (e) {
                                                        e.stopPropagation();
                                                        setEditingTemplate(template);
                                                    }, className: "text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50", title: "Edit Template", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Pencil, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function (e) {
                                                        e.stopPropagation();
                                                        deleteTemplateMutation.mutate(template.id);
                                                    }, className: "text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50", title: "Delete Template", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "h-4 w-4" }) })] })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-600 mb-4", children: template.description || 'No description provided' }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-slate-500", children: "Services:" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-slate-900 font-medium", children: [((_c = template.service_sequence) === null || _c === void 0 ? void 0 : _c.length) || 0, " services"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-slate-500", children: "Duration:" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-slate-900 font-medium", children: [template.estimated_total_duration || 0, " min"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-slate-500", children: "Price Multiplier:" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-slate-900 font-medium", children: [template.base_price_multiplier || 1.0, "x"] })] })] })] }) }, template.id));
                }) }), (isAddingTemplate || editingTemplate) && ((0, jsx_runtime_1.jsx)(TemplateForm, { template: editingTemplate, segments: customerSegments || [], serviceTypes: serviceTypes || [], onSubmit: function (data) {
                    if (editingTemplate) {
                        updateTemplateMutation.mutate(__assign(__assign({}, data), { id: editingTemplate.id }));
                    }
                    else {
                        createTemplateMutation.mutate(data);
                    }
                }, onCancel: function () {
                    setIsAddingTemplate(false);
                    setEditingTemplate(null);
                } })), selectedTemplate && ((0, jsx_runtime_1.jsx)(TemplateDetail, { template: selectedTemplate, serviceTypes: serviceTypes || [], onClose: function () { return setSelectedTemplate(null); }, onEdit: function () {
                    setEditingTemplate(selectedTemplate);
                    setSelectedTemplate(null);
                } }))] }));
}
// Template Form Schema
var templateSchema = zod_2.z.object({
    template_name: zod_2.z.string().min(1, 'Template name is required'),
    template_code: zod_2.z.string().min(1, 'Template code is required'),
    segment_id: zod_2.z.string().min(1, 'Customer segment is required'),
    description: zod_2.z.string().optional(),
    is_active: zod_2.z.boolean().default(true),
    base_price_multiplier: zod_2.z.number().min(0.1, 'Price multiplier must be at least 0.1'),
    service_sequence: zod_2.z.array(zod_2.z.string()).default([]),
    estimated_total_duration: zod_2.z.number().min(0).default(0),
    required_equipment: zod_2.z.array(zod_2.z.string()).default([]),
    safety_requirements: zod_2.z.array(zod_2.z.string()).default([]),
    compliance_notes: zod_2.z.string().optional(),
});
function TemplateForm(_a) {
    var _b;
    var template = _a.template, segments = _a.segments, serviceTypes = _a.serviceTypes, onSubmit = _a.onSubmit, onCancel = _a.onCancel;
    var _c = (0, react_1.useState)(true), isOpen = _c[0], setIsOpen = _c[1];
    var _d = (0, react_1.useState)(''), selectedServiceToAdd = _d[0], setSelectedServiceToAdd = _d[1];
    var _e = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(templateSchema),
        defaultValues: {
            template_name: (template === null || template === void 0 ? void 0 : template.template_name) || '',
            template_code: (template === null || template === void 0 ? void 0 : template.template_code) || '',
            segment_id: (template === null || template === void 0 ? void 0 : template.segment_id) || '',
            description: (template === null || template === void 0 ? void 0 : template.description) || '',
            is_active: (_b = template === null || template === void 0 ? void 0 : template.is_active) !== null && _b !== void 0 ? _b : true,
            base_price_multiplier: (template === null || template === void 0 ? void 0 : template.base_price_multiplier) || 1.0,
            service_sequence: (template === null || template === void 0 ? void 0 : template.service_sequence) || [],
            estimated_total_duration: (template === null || template === void 0 ? void 0 : template.estimated_total_duration) || 0,
            required_equipment: (template === null || template === void 0 ? void 0 : template.required_equipment) || [],
            safety_requirements: (template === null || template === void 0 ? void 0 : template.safety_requirements) || [],
            compliance_notes: (template === null || template === void 0 ? void 0 : template.compliance_notes) || '',
        },
    }), control = _e.control, handleSubmit = _e.handleSubmit, errors = _e.formState.errors, watch = _e.watch, setValue = _e.setValue, reset = _e.reset;
    var serviceSequence = watch('service_sequence');
    var handleFormSubmit = function (data) {
        onSubmit(data);
        setIsOpen(false);
    };
    var handleCancel = function () {
        setIsOpen(false);
        reset();
        onCancel();
    };
    var addServiceToSequence = function (serviceId) {
        if (serviceId && !serviceSequence.includes(serviceId)) {
            var newSequence = __spreadArray(__spreadArray([], serviceSequence, true), [serviceId], false);
            setValue('service_sequence', newSequence);
            setSelectedServiceToAdd('');
            // Calculate total duration
            var service = serviceTypes.find(function (s) { return s.id === serviceId; });
            if (service) {
                var currentDuration = watch('estimated_total_duration');
                setValue('estimated_total_duration', currentDuration + service.estimated_duration);
            }
        }
    };
    var removeServiceFromSequence = function (serviceId) {
        var service = serviceTypes.find(function (s) { return s.id === serviceId; });
        if (service) {
            var currentDuration = watch('estimated_total_duration');
            setValue('estimated_total_duration', Math.max(0, currentDuration - service.estimated_duration));
        }
        setValue('service_sequence', serviceSequence.filter(function (id) { return id !== serviceId; }));
    };
    var moveServiceInSequence = function (fromIndex, toIndex) {
        var newSequence = __spreadArray([], serviceSequence, true);
        var removed = newSequence.splice(fromIndex, 1)[0];
        if (removed) {
            newSequence.splice(toIndex, 0, removed);
            setValue('service_sequence', newSequence);
        }
    };
    return ((0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: isOpen, onOpenChange: function (open) { return setIsOpen(open); }, children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogContent, { className: "max-w-4xl max-h-[90vh] overflow-y-auto", children: [(0, jsx_runtime_1.jsx)(Dialog_1.DialogHeader, { children: (0, jsx_runtime_1.jsx)(Dialog_1.DialogTitle, { children: template ? 'Edit Service Template' : 'Create New Service Template' }) }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit(handleFormSubmit), className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "template_name", control: control, render: function (_a) {
                                        var _b;
                                        var field = _a.field;
                                        return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Template Name *", value: field.value, onChange: function (e) { return field.onChange(e.target.value); } }, (((_b = errors.template_name) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.template_name.message } : {}))));
                                    } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "template_code", control: control, render: function (_a) {
                                        var _b;
                                        var field = _a.field;
                                        return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Template Code *", value: field.value, onChange: function (e) { return field.onChange(e.target.value); } }, (((_b = errors.template_code) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.template_code.message } : {}))));
                                    } })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "segment_id", control: control, render: function (_a) {
                                        var _b;
                                        var field = _a.field;
                                        return ((0, jsx_runtime_1.jsx)(Select_1.default, __assign({ label: "Customer Segment *", value: field.value, onChange: function (value) { return field.onChange(value); }, options: __spreadArray([
                                                { value: '', label: 'Select Segment' }
                                            ], segments.map(function (segment) { return ({
                                                value: segment.id,
                                                label: "".concat(segment.segment_name, " (").concat(segment.pricing_tier, ")"),
                                            }); }), true) }, (((_b = errors.segment_id) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.segment_id.message } : {}))));
                                    } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "base_price_multiplier", control: control, render: function (_a) {
                                        var _b;
                                        var field = _a.field;
                                        return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Price Multiplier *", type: "number", step: "0.1", min: "0.1", value: field.value.toString(), onChange: function (e) { return field.onChange(parseFloat(e.target.value) || 1.0); } }, (((_b = errors.base_price_multiplier) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.base_price_multiplier.message } : {}))));
                                    } })] }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "description", control: control, render: function (_a) {
                                var _b;
                                var field = _a.field;
                                return ((0, jsx_runtime_1.jsx)(Textarea_1.default, __assign({ label: "Description", value: field.value || '', onChange: function (e) { return field.onChange(e.target.value); }, rows: 3 }, (((_b = errors.description) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.description.message } : {}))));
                            } }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Service Sequence" }), (0, jsx_runtime_1.jsxs)("div", { className: "border border-slate-300 rounded-md p-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-4", children: (0, jsx_runtime_1.jsx)(Select_1.default, { label: "Add Service", value: selectedServiceToAdd, onChange: function (value) {
                                                    setSelectedServiceToAdd(value);
                                                    if (value) {
                                                        addServiceToSequence(value);
                                                    }
                                                }, options: __spreadArray([
                                                    { value: '', label: 'Select a service to add' }
                                                ], serviceTypes
                                                    .filter(function (service) { return !serviceSequence.includes(service.id); })
                                                    .map(function (service) { return ({
                                                    value: service.id,
                                                    label: "".concat(service.type_name, " ($").concat(service.base_price, ")"),
                                                }); }), true) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [serviceSequence.map(function (serviceId, index) {
                                                    var service = serviceTypes.find(function (s) { return s.id === serviceId; });
                                                    return service ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 bg-slate-50 rounded-md", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-sm font-medium text-slate-500", children: ["#", index + 1] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-slate-900", children: service.type_name }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-slate-500", children: ["$", service.base_price, " \u2022 ", service.estimated_duration, " min"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [index > 0 && ((0, jsx_runtime_1.jsx)(Button_1.default, { type: "button", variant: "ghost", size: "sm", onClick: function () { return moveServiceInSequence(index, index - 1); }, className: "p-1", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowUp, { className: "h-4 w-4" }) })), index < serviceSequence.length - 1 && ((0, jsx_runtime_1.jsx)(Button_1.default, { type: "button", variant: "ghost", size: "sm", onClick: function () { return moveServiceInSequence(index, index + 1); }, className: "p-1", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowDown, { className: "h-4 w-4" }) })), (0, jsx_runtime_1.jsx)(Button_1.default, { type: "button", variant: "ghost", size: "sm", onClick: function () { return removeServiceFromSequence(serviceId); }, className: "p-1 text-red-600 hover:text-red-900", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-4 w-4" }) })] })] }, serviceId)) : null;
                                                }), serviceSequence.length === 0 && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-500 text-center py-4", children: "No services added yet" }))] })] })] }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "is_active", control: control, render: function (_a) {
                                var field = _a.field;
                                return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(Checkbox_1.default, { checked: field.value, onChange: function (checked) { return field.onChange(checked); } }), (0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium text-slate-700", children: "Active Template" })] }));
                            } }), (0, jsx_runtime_1.jsxs)(Dialog_1.DialogFooter, { children: [(0, jsx_runtime_1.jsx)(Button_1.default, { type: "button", variant: "outline", onClick: handleCancel, children: "Cancel" }), (0, jsx_runtime_1.jsx)(Button_1.default, { type: "submit", variant: "primary", children: template ? 'Update Template' : 'Create Template' })] })] })] }) }));
}
function TemplateDetail(_a) {
    var template = _a.template, serviceTypes = _a.serviceTypes, onClose = _a.onClose, onEdit = _a.onEdit;
    var segment = template.customer_segments;
    var services = template.service_sequence.map(function (serviceId) {
        return serviceTypes.find(function (s) { return s.id === serviceId; });
    }).filter(Boolean);
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-slate-600 bg-opacity-50 overflow-y-auto h-full w-full z-50", children: (0, jsx_runtime_1.jsx)("div", { className: "relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white", children: (0, jsx_runtime_1.jsxs)("div", { className: "mt-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-slate-900", children: "Template Details" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-3", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: onEdit, className: "inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Pencil, { className: "h-4 w-4 mr-2" }), "Edit"] }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50", children: "Close" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-md font-medium text-gray-900 mb-4", children: "Template Information" }), (0, jsx_runtime_1.jsxs)("dl", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("dt", { className: "text-sm font-medium text-gray-500", children: "Template Name" }), (0, jsx_runtime_1.jsx)("dd", { className: "mt-1 text-sm text-gray-900", children: template.template_name })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("dt", { className: "text-sm font-medium text-gray-500", children: "Template Code" }), (0, jsx_runtime_1.jsx)("dd", { className: "mt-1 text-sm text-gray-900", children: template.template_code })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("dt", { className: "text-sm font-medium text-gray-500", children: "Customer Segment" }), (0, jsx_runtime_1.jsxs)("dd", { className: "mt-1 text-sm text-gray-900", children: [segment === null || segment === void 0 ? void 0 : segment.segment_name, " (", segment === null || segment === void 0 ? void 0 : segment.pricing_tier, ")"] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("dt", { className: "text-sm font-medium text-gray-500", children: "Price Multiplier" }), (0, jsx_runtime_1.jsxs)("dd", { className: "mt-1 text-sm text-gray-900", children: [template.base_price_multiplier, "x"] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("dt", { className: "text-sm font-medium text-gray-500", children: "Status" }), (0, jsx_runtime_1.jsx)("dd", { className: "mt-1", children: (0, jsx_runtime_1.jsx)("span", { className: "inline-flex px-2 py-1 text-xs font-semibold rounded-full ".concat(template.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'), children: template.is_active ? 'Active' : 'Inactive' }) })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-md font-medium text-gray-900 mb-4", children: "Service Sequence" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: services.map(function (service, index) { return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-md", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-sm font-medium text-gray-500", children: ["#", index + 1] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-gray-900", children: service === null || service === void 0 ? void 0 : service.type_name }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-500", children: ["$", service === null || service === void 0 ? void 0 : service.base_price, " \u2022 ", service === null || service === void 0 ? void 0 : service.estimated_duration, " min"] })] })] }) }, service === null || service === void 0 ? void 0 : service.id)); }) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-4 p-3 bg-blue-50 rounded-md", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-blue-800", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Total Duration:" }), " ", template.estimated_total_duration || 0, " minutes", (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("strong", { children: "Services:" }), " ", services.length, " services"] }) })] })] }), template.description && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-6", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-md font-medium text-gray-900 mb-2", children: "Description" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: template.description })] }))] }) }) }));
}
