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
exports.default = WorkOrderForm;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_hook_form_1 = require("react-hook-form");
var zod_1 = require("@hookform/resolvers/zod");
var zod_2 = require("zod");
var work_orders_1 = require("@/types/work-orders");
var lucide_react_1 = require("lucide-react");
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var Card_1 = __importDefault(require("@/components/ui/Card"));
var CustomerSearchSelector_1 = __importDefault(require("@/components/ui/CustomerSearchSelector"));
var ErrorMessage_1 = require("@/components/ui/ErrorMessage");
var LoadingSpinner_1 = require("@/components/LoadingSpinner");
var logger_1 = require("@/utils/logger");
var enhanced_api_1 = require("@/lib/enhanced-api");
// Form validation schema
var workOrderSchema = zod_2.z.object({
    customer_id: zod_2.z.string().uuid('Please select a valid customer'),
    assigned_to: zod_2.z.string().uuid().optional().or(zod_2.z.literal('')),
    status: zod_2.z.nativeEnum(work_orders_1.WorkOrderStatus).optional(),
    priority: zod_2.z.nativeEnum(work_orders_1.WorkOrderPriority).optional(),
    scheduled_date: zod_2.z.string().optional(),
    description: zod_2.z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
    notes: zod_2.z.string().max(2000, 'Notes must be less than 2000 characters').optional(),
    service_type: zod_2.z.string().optional(),
    estimated_duration: zod_2.z.number().min(15, 'Duration must be at least 15 minutes').max(480, 'Duration cannot exceed 8 hours').optional(),
    service_price: zod_2.z.number().min(0, 'Price cannot be negative').optional().or(zod_2.z.literal('')),
});
function WorkOrderForm(_a) {
    var _this = this;
    var _b, _c, _d, _e;
    var initialData = _a.initialData, onSubmit = _a.onSubmit, onCancel = _a.onCancel, _f = _a.isLoading, isLoading = _f === void 0 ? false : _f, _g = _a.mode, mode = _g === void 0 ? 'create' : _g;
    var _h = (0, react_1.useState)([]), technicians = _h[0], setTechnicians = _h[1];
    var _j = (0, react_1.useState)(true), loadingTechnicians = _j[0], setLoadingTechnicians = _j[1];
    var _k = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(workOrderSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            customer_id: (initialData === null || initialData === void 0 ? void 0 : initialData.customer_id) || '',
            assigned_to: (initialData === null || initialData === void 0 ? void 0 : initialData.assigned_to) || '',
            status: (initialData === null || initialData === void 0 ? void 0 : initialData.status) || work_orders_1.WorkOrderStatus.PENDING,
            priority: (initialData === null || initialData === void 0 ? void 0 : initialData.priority) || work_orders_1.WorkOrderPriority.MEDIUM,
            scheduled_date: (initialData === null || initialData === void 0 ? void 0 : initialData.scheduled_date) || '',
            description: (initialData === null || initialData === void 0 ? void 0 : initialData.description) || '',
            notes: (initialData === null || initialData === void 0 ? void 0 : initialData.notes) || '',
            service_type: (initialData === null || initialData === void 0 ? void 0 : initialData.service_type) || '',
            estimated_duration: (initialData === null || initialData === void 0 ? void 0 : initialData.estimated_duration) || 60,
            service_price: (initialData === null || initialData === void 0 ? void 0 : initialData.service_price) || '',
        },
    }), control = _k.control, handleSubmit = _k.handleSubmit, _l = _k.formState, errors = _l.errors, isDirty = _l.isDirty, watch = _k.watch, setValue = _k.setValue, reset = _k.reset, trigger = _k.trigger;
    var selectedTechnicianId = watch('assigned_to');
    // Load technicians using enhancedApi
    (0, react_1.useEffect)(function () {
        var loadTechnicians = function () { return __awaiter(_this, void 0, void 0, function () {
            var techniciansData, transformedTechnicians, firstTechId, error_1, err;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, 3, 4]);
                        logger_1.logger.debug('Starting technician load', {}, 'WorkOrderForm');
                        setLoadingTechnicians(true);
                        return [4 /*yield*/, enhanced_api_1.enhancedApi.technicians.list()];
                    case 1:
                        techniciansData = _b.sent();
                        logger_1.logger.debug('Technician API response received', { techniciansCount: (techniciansData === null || techniciansData === void 0 ? void 0 : techniciansData.length) || 0 }, 'WorkOrderForm');
                        transformedTechnicians = (techniciansData === null || techniciansData === void 0 ? void 0 : techniciansData.map(function (tech) {
                            var _a, _b, _c, _d, _e, _f;
                            logger_1.logger.debug('Processing technician', { techId: tech.id || tech.user_id }, 'WorkOrderForm');
                            var id = tech.id || tech.user_id || '';
                            var email = tech.email || ((_a = tech.user) === null || _a === void 0 ? void 0 : _a.email) || '';
                            // Try multiple possible name keys
                            var firstName = tech.first_name || tech.firstName || ((_b = tech.user) === null || _b === void 0 ? void 0 : _b.first_name) || ((_c = tech.user) === null || _c === void 0 ? void 0 : _c.firstName) || '';
                            var lastName = tech.last_name || tech.lastName || ((_d = tech.user) === null || _d === void 0 ? void 0 : _d.last_name) || ((_e = tech.user) === null || _e === void 0 ? void 0 : _e.lastName) || '';
                            // Derive fallback name
                            var emailLocal = email && email.includes('@') ? email.split('@')[0] : '';
                            var idTail = id ? id.slice(0, 8) : 'tech';
                            var safeFirst = firstName || (emailLocal ? emailLocal : 'Technician');
                            var safeLast = lastName || (!firstName && id ? idTail : '');
                            return {
                                id: id,
                                first_name: safeFirst,
                                last_name: safeLast,
                                email: email || '',
                                phone: tech.phone || ((_f = tech.user) === null || _f === void 0 ? void 0 : _f.phone) || '',
                                skills: ['general'],
                                status: String(tech.status || '').toUpperCase() === 'ACTIVE' ? 'available' : 'off'
                            };
                        })) || [];
                        logger_1.logger.debug('Technicians transformed', { count: transformedTechnicians.length }, 'WorkOrderForm');
                        setTechnicians(transformedTechnicians);
                        // Auto-select if only one technician is available and none selected
                        if (transformedTechnicians.length === 1) {
                            firstTechId = (_a = transformedTechnicians[0]) === null || _a === void 0 ? void 0 : _a.id;
                            if (firstTechId) {
                                try {
                                    setValue('assigned_to', firstTechId);
                                }
                                catch (_c) { }
                            }
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        error_1 = _b.sent();
                        err = error_1;
                        logger_1.logger.error('Error loading technicians', {
                            error: error_1,
                            errorMessage: err === null || err === void 0 ? void 0 : err.message,
                            errorStatus: err === null || err === void 0 ? void 0 : err.status,
                            errorStack: err === null || err === void 0 ? void 0 : err.stack
                        }, 'WorkOrderForm');
                        setTechnicians([]);
                        return [3 /*break*/, 4];
                    case 3:
                        setLoadingTechnicians(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        loadTechnicians();
    }, [setValue]);
    // Find the selected technician object for display
    var selectedTechnician = (0, react_1.useMemo)(function () {
        return technicians.find(function (tech) { return tech.id === selectedTechnicianId; });
    }, [selectedTechnicianId, technicians]);
    // Handle form submission
    var handleFormSubmit = function (data) { return __awaiter(_this, void 0, void 0, function () {
        var submissionData, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.debug('Work order form submitted', { data: data }, 'WorkOrderForm');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    submissionData = __assign(__assign({}, data), { estimated_duration: data.estimated_duration !== undefined && data.estimated_duration !== null
                            ? Number(data.estimated_duration)
                            : undefined, service_price: data.service_price !== undefined && data.service_price !== null && data.service_price !== ''
                            ? Number(data.service_price)
                            : undefined });
                    return [4 /*yield*/, onSubmit(submissionData)];
                case 2:
                    _a.sent();
                    reset(submissionData); // Reset form with submitted data to mark as not dirty
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    logger_1.logger.error('Work order form submission failed', error_2, 'WorkOrderForm');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return ((0, jsx_runtime_1.jsx)("div", { className: "max-w-4xl mx-auto p-4 md:p-6", children: (0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-4 md:p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-gray-900", children: mode === 'create' ? 'Create Work Order' : 'Edit Work Order' }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", onClick: onCancel, className: "flex items-center gap-2 min-h-[44px]", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-4 w-4" }), "Cancel"] })] }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit(handleFormSubmit), className: "space-y-4 md:space-y-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "customer_id", control: control, render: function (_a) {
                                    var _b;
                                    var field = _a.field;
                                    return ((0, jsx_runtime_1.jsx)(CustomerSearchSelector_1.default, { value: field.value, onChange: function (customerId) {
                                            field.onChange(customerId);
                                        }, label: "Customer", required: true, showSelectedBox: true, apiSource: "direct", error: (_b = errors.customer_id) === null || _b === void 0 ? void 0 : _b.message, placeholder: "Search customers..." }));
                                } }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "service_type", className: "block text-sm font-medium text-gray-700", children: "Service Type" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "service_type", control: control, render: function (_a) {
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsxs)("select", __assign({}, field, { id: "service_type", className: "crm-input", children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "Select service type" }), (0, jsx_runtime_1.jsx)("option", { value: "General Pest Control", children: "General Pest Control" }), (0, jsx_runtime_1.jsx)("option", { value: "Termite Treatment", children: "Termite Treatment" }), (0, jsx_runtime_1.jsx)("option", { value: "Rodent Control", children: "Rodent Control" }), (0, jsx_runtime_1.jsx)("option", { value: "Bed Bug Treatment", children: "Bed Bug Treatment" }), (0, jsx_runtime_1.jsx)("option", { value: "Wildlife Removal", children: "Wildlife Removal" }), (0, jsx_runtime_1.jsx)("option", { value: "Inspection", children: "Inspection" }), (0, jsx_runtime_1.jsx)("option", { value: "Maintenance", children: "Maintenance" })] })));
                                            } })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "priority", className: "block text-sm font-medium text-gray-700", children: "Priority" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "priority", control: control, render: function (_a) {
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsxs)("select", __assign({}, field, { id: "priority", className: "crm-input", children: [(0, jsx_runtime_1.jsx)("option", { value: work_orders_1.WorkOrderPriority.LOW, children: "Low" }), (0, jsx_runtime_1.jsx)("option", { value: work_orders_1.WorkOrderPriority.MEDIUM, children: "Medium" }), (0, jsx_runtime_1.jsx)("option", { value: work_orders_1.WorkOrderPriority.HIGH, children: "High" }), (0, jsx_runtime_1.jsx)("option", { value: work_orders_1.WorkOrderPriority.URGENT, children: "Urgent" })] })));
                                            } })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("label", { htmlFor: "description", className: "block text-sm font-medium text-gray-700", children: ["Description ", (0, jsx_runtime_1.jsx)("span", { className: "text-red-500", children: "*" })] }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "description", control: control, render: function (_a) {
                                        var field = _a.field;
                                        return ((0, jsx_runtime_1.jsx)("textarea", __assign({}, field, { id: "description", rows: 4, className: "crm-textarea", placeholder: "Describe the work to be performed..." })));
                                    } }), errors.description && ((0, jsx_runtime_1.jsx)(ErrorMessage_1.ErrorMessage, { message: (_b = errors.description.message) !== null && _b !== void 0 ? _b : '', type: "error" }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "assigned_to", className: "block text-sm font-medium text-gray-700", children: "Assigned Technician" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "assigned_to", control: control, render: function (_a) {
                                        var field = _a.field;
                                        return ((0, jsx_runtime_1.jsxs)("select", __assign({}, field, { id: "assigned_to", className: "crm-input w-full", disabled: loadingTechnicians, children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: loadingTechnicians ? 'Loading technicians...' : 'Select technician' }), technicians.map(function (t) { return ((0, jsx_runtime_1.jsxs)("option", { value: t.id, children: [t.first_name, " ", t.last_name, " ", t.email ? "- ".concat(t.email) : ''] }, t.id)); })] })));
                                    } }), selectedTechnician && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-2 p-3 bg-green-50 border border-green-200 rounded-md", children: [(0, jsx_runtime_1.jsxs)("div", { className: "font-medium text-green-900", children: [selectedTechnician.first_name, " ", selectedTechnician.last_name] }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-green-700", children: selectedTechnician.email }), selectedTechnician.skills && ((0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-green-600", children: ["Skills: ", selectedTechnician.skills.join(', ')] }))] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "scheduled_date", className: "block text-sm font-medium text-gray-700", children: "Scheduled Date & Time" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "scheduled_date", control: control, render: function (_a) {
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, field, { id: "scheduled_date", type: "datetime-local", className: "w-full" })));
                                            } })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "estimated_duration", className: "block text-sm font-medium text-gray-700", children: "Estimated Duration (minutes)" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "estimated_duration", control: control, render: function (_a) {
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, field, { id: "estimated_duration", type: "number", min: "15", max: "480", step: "15", className: "w-full", value: field.value || '', onChange: function (e) {
                                                        var value = e.target.value;
                                                        if (value === '') {
                                                            field.onChange(undefined);
                                                        }
                                                        else {
                                                            var numValue = parseInt(value, 10);
                                                            field.onChange(isNaN(numValue) ? undefined : numValue);
                                                        }
                                                    }, onBlur: function () {
                                                        field.onBlur();
                                                        trigger('estimated_duration');
                                                    } })));
                                            } }), errors.estimated_duration && ((0, jsx_runtime_1.jsx)(ErrorMessage_1.ErrorMessage, { message: (_c = errors.estimated_duration.message) !== null && _c !== void 0 ? _c : '', type: "error" }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "service_price", className: "block text-sm font-medium text-gray-700", children: "Service Price" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "service_price", control: control, render: function (_a) {
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, field, { id: "service_price", type: "number", min: "0", step: "0.01", className: "pl-10", placeholder: "0.00", onChange: function (e) {
                                                        var value = e.target.value;
                                                        if (value === '') {
                                                            field.onChange('');
                                                        }
                                                        else {
                                                            var numValue = parseFloat(value);
                                                            field.onChange(isNaN(numValue) ? '' : numValue);
                                                        }
                                                    } })));
                                            } })] }), errors.service_price && ((0, jsx_runtime_1.jsx)(ErrorMessage_1.ErrorMessage, { message: (_d = errors.service_price.message) !== null && _d !== void 0 ? _d : '', type: "error" }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "notes", className: "block text-sm font-medium text-gray-700", children: "Additional Notes" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "notes", control: control, render: function (_a) {
                                        var field = _a.field;
                                        return ((0, jsx_runtime_1.jsx)("textarea", __assign({}, field, { id: "notes", rows: 3, className: "crm-textarea", placeholder: "Any additional information or special instructions..." })));
                                    } }), errors.notes && ((0, jsx_runtime_1.jsx)(ErrorMessage_1.ErrorMessage, { message: (_e = errors.notes.message) !== null && _e !== void 0 ? _e : '', type: "error" }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { type: "button", variant: "outline", onClick: onCancel, disabled: isLoading, className: "min-h-[44px] w-full sm:w-auto", children: "Cancel" }), (0, jsx_runtime_1.jsx)(Button_1.default, { type: "submit", variant: "primary", disabled: isLoading || !isDirty, className: "flex items-center justify-center gap-2 min-h-[44px] w-full sm:w-auto", children: isLoading ? ((0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { text: "Saving..." })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Save, { className: "h-4 w-4" }), mode === 'create' ? 'Create Work Order' : 'Update Work Order'] })) })] })] })] }) }));
}
