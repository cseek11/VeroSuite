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
exports.default = ServiceTypeManagement;
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
function ServiceTypeManagement() {
    var _this = this;
    var queryClient = (0, react_query_1.useQueryClient)();
    var _a = (0, react_1.useState)(false), isAddingService = _a[0], setIsAddingService = _a[1];
    var _b = (0, react_1.useState)(false), isAddingCategory = _b[0], setIsAddingCategory = _b[1];
    var _c = (0, react_1.useState)(null), editingService = _c[0], setEditingService = _c[1];
    var _d = (0, react_1.useState)(null), editingCategory = _d[0], setEditingCategory = _d[1];
    // Fetch service types
    var _e = (0, react_query_1.useQuery)({
        queryKey: ['service-types'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase_client_1.supabase
                            .from('service_types')
                            .select("\n          *,\n          service_categories (\n            category_name,\n            category_code\n          )\n        ")
                            .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28')
                            .order('service_name')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        }); },
    }), serviceTypes = _e.data, loadingTypes = _e.isLoading;
    // Fetch service categories
    var _f = (0, react_query_1.useQuery)({
        queryKey: ['service-categories'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase_client_1.supabase
                            .from('service_categories')
                            .select('*')
                            .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28')
                            .order('category_name')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        }); },
    }), serviceCategories = _f.data, loadingCategories = _f.isLoading;
    // Create service type mutation
    var createServiceTypeMutation = (0, react_query_1.useMutation)({
        mutationFn: function (serviceType) { return __awaiter(_this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase_client_1.supabase
                            .from('service_types')
                            .insert(__assign(__assign({}, serviceType), { tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28' }))
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
            queryClient.invalidateQueries({ queryKey: ['service-types'] });
            setIsAddingService(false);
        },
    });
    // Update service type mutation
    var updateServiceTypeMutation = (0, react_query_1.useMutation)({
        mutationFn: function (serviceType) { return __awaiter(_this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase_client_1.supabase
                            .from('service_types')
                            .update(serviceType)
                            .eq('id', serviceType.id)
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
            queryClient.invalidateQueries({ queryKey: ['service-types'] });
            setEditingService(null);
        },
    });
    // Delete service type mutation
    var deleteServiceTypeMutation = (0, react_query_1.useMutation)({
        mutationFn: function (id) { return __awaiter(_this, void 0, void 0, function () {
            var error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, supabase_client_1.supabase
                            .from('service_types')
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
            queryClient.invalidateQueries({ queryKey: ['service-types'] });
        },
    });
    // Create category mutation
    var createCategoryMutation = (0, react_query_1.useMutation)({
        mutationFn: function (category) { return __awaiter(_this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase_client_1.supabase
                            .from('service_categories')
                            .insert(__assign(__assign({}, category), { tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28' }))
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
            queryClient.invalidateQueries({ queryKey: ['service-categories'] });
            setIsAddingCategory(false);
        },
    });
    // Update category mutation
    var updateCategoryMutation = (0, react_query_1.useMutation)({
        mutationFn: function (category) { return __awaiter(_this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase_client_1.supabase
                            .from('service_categories')
                            .update(category)
                            .eq('id', category.id)
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
            queryClient.invalidateQueries({ queryKey: ['service-categories'] });
            setEditingCategory(null);
        },
    });
    if (loadingTypes || loadingCategories) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-64", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-white shadow-sm border border-slate-200 rounded-lg", children: (0, jsx_runtime_1.jsx)("div", { className: "px-6 py-4 border-b border-slate-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-gray-900", children: "Service Type Management" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Manage service types, categories, and pricing for different customer segments" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-3", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setIsAddingCategory(true); }, className: "inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "h-4 w-4 mr-2" }), "Add Category"] }), (0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setIsAddingService(true); }, className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4 mr-2" }), "Add Service Type"] })] })] }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white shadow-sm border border-slate-200 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "px-6 py-4 border-b border-slate-200", children: (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900", children: "Service Categories" }) }), (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "min-w-full divide-y divide-gray-200", children: [(0, jsx_runtime_1.jsx)("thead", { className: "bg-gray-50", children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Category Name" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Code" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Description" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Status" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { className: "bg-white divide-y divide-gray-200", children: serviceCategories === null || serviceCategories === void 0 ? void 0 : serviceCategories.map(function (category) { return ((0, jsx_runtime_1.jsxs)("tr", { className: "hover:bg-gray-50", children: [(0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900", children: category.category_name }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: category.category_code }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 text-sm text-gray-500", children: category.description }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: (0, jsx_runtime_1.jsx)("span", { className: "inline-flex px-2 py-1 text-xs font-semibold rounded-full ".concat(category.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'), children: category.is_active ? 'Active' : 'Inactive' }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setEditingCategory(category); }, className: "text-purple-600 hover:text-purple-900 mr-3", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Pencil, { className: "h-4 w-4" }) }) })] }, category.id)); }) })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white shadow-sm border border-slate-200 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "px-6 py-4 border-b border-slate-200", children: (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900", children: "Service Types" }) }), (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "min-w-full divide-y divide-gray-200", children: [(0, jsx_runtime_1.jsx)("thead", { className: "bg-gray-50", children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Service Name" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Category" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Base Price" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Duration" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Status" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { className: "bg-white divide-y divide-gray-200", children: serviceTypes === null || serviceTypes === void 0 ? void 0 : serviceTypes.map(function (serviceType) {
                                        var _a, _b;
                                        return ((0, jsx_runtime_1.jsxs)("tr", { className: "hover:bg-gray-50", children: [(0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-gray-900", children: serviceType.service_name }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500", children: serviceType.service_code })] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: ((_a = serviceType.service_categories) === null || _a === void 0 ? void 0 : _a.category_name) || 'N/A' }), (0, jsx_runtime_1.jsxs)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: ["$", ((_b = serviceType.base_price) === null || _b === void 0 ? void 0 : _b.toFixed(2)) || '0.00'] }), (0, jsx_runtime_1.jsxs)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: [serviceType.estimated_duration, " min"] }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: (0, jsx_runtime_1.jsx)("span", { className: "inline-flex px-2 py-1 text-xs font-semibold rounded-full ".concat(serviceType.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'), children: serviceType.is_active ? 'Active' : 'Inactive' }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-end space-x-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return setEditingService(serviceType); }, className: "text-purple-600 hover:text-purple-900", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Pencil, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return deleteServiceTypeMutation.mutate(serviceType.id); }, className: "text-red-600 hover:text-red-900", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "h-4 w-4" }) })] }) })] }, serviceType.id));
                                    }) })] }) })] }), (isAddingService || editingService) && ((0, jsx_runtime_1.jsx)(ServiceTypeForm, { serviceType: editingService, categories: serviceCategories || [], onSubmit: function (data) {
                    if (editingService) {
                        updateServiceTypeMutation.mutate(__assign(__assign({}, data), { id: editingService.id }));
                    }
                    else {
                        createServiceTypeMutation.mutate(data);
                    }
                }, onCancel: function () {
                    setIsAddingService(false);
                    setEditingService(null);
                } })), (isAddingCategory || editingCategory) && ((0, jsx_runtime_1.jsx)(CategoryForm, { category: editingCategory, onSubmit: function (data) {
                    if (editingCategory) {
                        updateCategoryMutation.mutate(__assign(__assign({}, data), { id: editingCategory.id }));
                    }
                    else {
                        createCategoryMutation.mutate(data);
                    }
                }, onCancel: function () {
                    setIsAddingCategory(false);
                    setEditingCategory(null);
                } }))] }));
}
// Service Type Form Schema
var serviceTypeSchema = zod_2.z.object({
    service_name: zod_2.z.string().min(1, 'Service name is required'),
    service_code: zod_2.z.string().min(1, 'Service code is required'),
    description: zod_2.z.string().optional(),
    category_id: zod_2.z.string().min(1, 'Category is required'),
    base_price: zod_2.z.number().min(0, 'Base price must be 0 or greater'),
    estimated_duration: zod_2.z.number().min(1, 'Duration must be at least 1 minute'),
    is_active: zod_2.z.boolean().default(true),
    required_equipment: zod_2.z.record(zod_2.z.unknown()).nullable().optional(),
    safety_requirements: zod_2.z.record(zod_2.z.unknown()).nullable().optional(),
    compliance_requirements: zod_2.z.record(zod_2.z.unknown()).nullable().optional(),
});
function ServiceTypeForm(_a) {
    var _b;
    var serviceType = _a.serviceType, categories = _a.categories, onSubmit = _a.onSubmit, onCancel = _a.onCancel;
    var _c = (0, react_1.useState)(true), isOpen = _c[0], setIsOpen = _c[1];
    var _d = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(serviceTypeSchema),
        defaultValues: {
            service_name: (serviceType === null || serviceType === void 0 ? void 0 : serviceType.service_name) || '',
            service_code: (serviceType === null || serviceType === void 0 ? void 0 : serviceType.service_code) || '',
            description: (serviceType === null || serviceType === void 0 ? void 0 : serviceType.description) || '',
            category_id: (serviceType === null || serviceType === void 0 ? void 0 : serviceType.category_id) || '',
            base_price: (serviceType === null || serviceType === void 0 ? void 0 : serviceType.base_price) || 0,
            estimated_duration: (serviceType === null || serviceType === void 0 ? void 0 : serviceType.estimated_duration) || 60,
            is_active: (_b = serviceType === null || serviceType === void 0 ? void 0 : serviceType.is_active) !== null && _b !== void 0 ? _b : true,
            required_equipment: (serviceType === null || serviceType === void 0 ? void 0 : serviceType.required_equipment) || null,
            safety_requirements: (serviceType === null || serviceType === void 0 ? void 0 : serviceType.safety_requirements) || null,
            compliance_requirements: (serviceType === null || serviceType === void 0 ? void 0 : serviceType.compliance_requirements) || null,
        },
    }), control = _d.control, handleSubmit = _d.handleSubmit, errors = _d.formState.errors, reset = _d.reset;
    var handleFormSubmit = function (data) {
        onSubmit(data);
        setIsOpen(false);
    };
    var handleCancel = function () {
        setIsOpen(false);
        reset();
        onCancel();
    };
    return ((0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: isOpen, onOpenChange: setIsOpen, children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogContent, { className: "max-w-2xl", children: [(0, jsx_runtime_1.jsx)(Dialog_1.DialogHeader, { children: (0, jsx_runtime_1.jsx)(Dialog_1.DialogTitle, { children: serviceType ? 'Edit Service Type' : 'Add New Service Type' }) }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit(handleFormSubmit), className: "space-y-4", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "service_name", control: control, render: function (_a) {
                                var _b;
                                var field = _a.field;
                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Service Name *", value: field.value, onChange: function (e) { return field.onChange(e.target.value); } }, (((_b = errors.service_name) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.service_name.message } : {}))));
                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "service_code", control: control, render: function (_a) {
                                var _b;
                                var field = _a.field;
                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Service Code *", value: field.value, onChange: function (e) { return field.onChange(e.target.value); } }, (((_b = errors.service_code) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.service_code.message } : {}))));
                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "category_id", control: control, render: function (_a) {
                                var _b;
                                var field = _a.field;
                                return ((0, jsx_runtime_1.jsx)(Select_1.default, __assign({ label: "Category *", value: field.value, onChange: function (value) { return field.onChange(value); }, options: __spreadArray([
                                        { value: '', label: 'Select Category' }
                                    ], categories.map(function (category) { return ({
                                        value: category.id,
                                        label: category.category_name,
                                    }); }), true) }, (((_b = errors.category_id) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.category_id.message } : {}))));
                            } }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "base_price", control: control, render: function (_a) {
                                        var _b;
                                        var field = _a.field;
                                        return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Base Price ($) *", type: "number", step: "0.01", min: "0", value: field.value.toString(), onChange: function (e) { return field.onChange(parseFloat(e.target.value) || 0); } }, (((_b = errors.base_price) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.base_price.message } : {}))));
                                    } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "estimated_duration", control: control, render: function (_a) {
                                        var _b;
                                        var field = _a.field;
                                        return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Duration (min) *", type: "number", min: "1", value: field.value.toString(), onChange: function (e) { return field.onChange(parseInt(e.target.value) || 60); } }, (((_b = errors.estimated_duration) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.estimated_duration.message } : {}))));
                                    } })] }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "description", control: control, render: function (_a) {
                                var _b;
                                var field = _a.field;
                                return ((0, jsx_runtime_1.jsx)(Textarea_1.default, __assign({ label: "Description", value: field.value || '', onChange: function (e) { return field.onChange(e.target.value); }, rows: 3 }, (((_b = errors.description) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.description.message } : {}))));
                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "is_active", control: control, render: function (_a) {
                                var field = _a.field;
                                return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(Checkbox_1.default, { checked: field.value, onChange: function (checked) { return field.onChange(checked); } }), (0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium text-slate-700", children: "Active" })] }));
                            } }), (0, jsx_runtime_1.jsxs)(Dialog_1.DialogFooter, { children: [(0, jsx_runtime_1.jsx)(Button_1.default, { type: "button", variant: "outline", onClick: handleCancel, children: "Cancel" }), (0, jsx_runtime_1.jsx)(Button_1.default, { type: "submit", variant: "primary", children: serviceType ? 'Update' : 'Create' })] })] })] }) }));
}
// Category Form Schema
var categorySchema = zod_2.z.object({
    category_name: zod_2.z.string().min(1, 'Category name is required'),
    category_code: zod_2.z.string().min(1, 'Category code is required'),
    description: zod_2.z.string().optional(),
    is_active: zod_2.z.boolean().default(true),
});
function CategoryForm(_a) {
    var _b;
    var category = _a.category, onSubmit = _a.onSubmit, onCancel = _a.onCancel;
    var _c = (0, react_1.useState)(true), isOpen = _c[0], setIsOpen = _c[1];
    var _d = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(categorySchema),
        defaultValues: {
            category_name: (category === null || category === void 0 ? void 0 : category.category_name) || '',
            category_code: (category === null || category === void 0 ? void 0 : category.category_code) || '',
            description: (category === null || category === void 0 ? void 0 : category.description) || '',
            is_active: (_b = category === null || category === void 0 ? void 0 : category.is_active) !== null && _b !== void 0 ? _b : true,
        },
    }), control = _d.control, handleSubmit = _d.handleSubmit, errors = _d.formState.errors, reset = _d.reset;
    var handleFormSubmit = function (data) {
        onSubmit(__assign(__assign({}, data), { tenant_id: (category === null || category === void 0 ? void 0 : category.tenant_id) || '7193113e-ece2-4f7b-ae8c-176df4367e28' }));
        setIsOpen(false);
    };
    var handleCancel = function () {
        setIsOpen(false);
        reset();
        onCancel();
    };
    return ((0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: isOpen, onOpenChange: setIsOpen, children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogContent, { className: "max-w-md", children: [(0, jsx_runtime_1.jsx)(Dialog_1.DialogHeader, { children: (0, jsx_runtime_1.jsx)(Dialog_1.DialogTitle, { children: category ? 'Edit Category' : 'Add New Category' }) }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit(handleFormSubmit), className: "space-y-4", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "category_name", control: control, render: function (_a) {
                                var _b;
                                var field = _a.field;
                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Category Name *", value: field.value, onChange: function (e) { return field.onChange(e.target.value); } }, (((_b = errors.category_name) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.category_name.message } : {}))));
                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "category_code", control: control, render: function (_a) {
                                var _b;
                                var field = _a.field;
                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Category Code *", value: field.value, onChange: function (e) { return field.onChange(e.target.value); } }, (((_b = errors.category_code) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.category_code.message } : {}))));
                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "description", control: control, render: function (_a) {
                                var _b;
                                var field = _a.field;
                                return ((0, jsx_runtime_1.jsx)(Textarea_1.default, __assign({ label: "Description", value: field.value || '', onChange: function (e) { return field.onChange(e.target.value); }, rows: 3 }, (((_b = errors.description) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.description.message } : {}))));
                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "is_active", control: control, render: function (_a) {
                                var field = _a.field;
                                return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(Checkbox_1.default, { checked: field.value, onChange: function (checked) { return field.onChange(checked); } }), (0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium text-slate-700", children: "Active" })] }));
                            } }), (0, jsx_runtime_1.jsxs)(Dialog_1.DialogFooter, { children: [(0, jsx_runtime_1.jsx)(Button_1.default, { type: "button", variant: "outline", onClick: handleCancel, children: "Cancel" }), (0, jsx_runtime_1.jsx)(Button_1.default, { type: "submit", variant: "primary", children: category ? 'Update' : 'Create' })] })] })] }) }));
}
