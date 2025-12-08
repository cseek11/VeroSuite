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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
exports.AgreementForm = AgreementForm;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var react_hook_form_1 = require("react-hook-form");
var zod_1 = require("@hookform/resolvers/zod");
var zod_2 = require("zod");
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var Textarea_1 = __importDefault(require("@/components/ui/Textarea"));
var Select_1 = __importDefault(require("@/components/ui/Select"));
var supabase_client_1 = require("@/lib/supabase-client");
var agreements_api_1 = require("@/lib/agreements-api");
var CustomerSearchSelector_1 = __importDefault(require("@/components/ui/CustomerSearchSelector"));
var agreementSchema = zod_2.z.object({
    account_id: zod_2.z.string().min(1, 'Customer is required'),
    service_type_id: zod_2.z.string().min(1, 'Service type is required'),
    agreement_number: zod_2.z.string().optional(),
    title: zod_2.z.string().min(1, 'Agreement title is required'),
    description: zod_2.z.string().optional(),
    start_date: zod_2.z.string().min(1, 'Start date is required'),
    end_date: zod_2.z.string().optional(),
    status: zod_2.z.enum(['active', 'inactive', 'expired', 'cancelled']).default('active'),
    terms: zod_2.z.string().optional(),
    pricing: zod_2.z.number().min(0).optional(),
    billing_frequency: zod_2.z.enum(['monthly', 'quarterly', 'annually', 'one_time']).default('monthly'),
});
function AgreementForm(_a) {
    var _this = this;
    var _b, _c, _d;
    var agreement = _a.agreement, onSuccess = _a.onSuccess, onCancel = _a.onCancel;
    var _e = (0, react_1.useState)(false), isSubmitting = _e[0], setIsSubmitting = _e[1];
    var queryClient = (0, react_query_1.useQueryClient)();
    var _f = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(agreementSchema),
        defaultValues: {
            status: 'active',
            billing_frequency: 'monthly',
        },
    }), control = _f.control, handleSubmit = _f.handleSubmit, errors = _f.formState.errors, setValue = _f.setValue, watch = _f.watch, reset = _f.reset;
    var _g = (0, react_query_1.useQuery)({
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
                            .order('service_name')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            throw error;
                        }
                        return [2 /*return*/, data];
                }
            });
        }); },
    }), serviceTypes = _g.data, serviceTypesLoading = _g.isLoading, serviceTypesError = _g.error;
    // Initialize form with existing agreement data
    (0, react_1.useEffect)(function () {
        if (!agreement || !agreement.start_date)
            return;
        var startDateStr = String(agreement.start_date);
        var startDateFormatted = startDateStr.includes('T') ? startDateStr.split('T')[0] : startDateStr;
        var resetData = {
            account_id: agreement.account_id || '',
            service_type_id: agreement.service_type_id || '',
            title: agreement.title || '',
            start_date: startDateFormatted, // Convert to YYYY-MM-DD format
            status: agreement.status || 'active',
            billing_frequency: agreement.billing_frequency || 'monthly',
            // Optional fields - use empty strings for form compatibility
            agreement_number: agreement.agreement_number || '',
            description: agreement.description || '',
            end_date: agreement.end_date ? String(agreement.end_date).split('T')[0] : '',
            terms: agreement.terms || '',
            pricing: agreement.pricing || 0,
        };
        reset(resetData);
    }, [agreement, reset]);
    var createMutation = (0, react_query_1.useMutation)({
        mutationFn: function (data) {
            // Clean data: remove empty strings and convert to proper types for API
            var cleanData = {
                account_id: data.account_id,
                service_type_id: data.service_type_id,
                title: data.title,
                start_date: data.start_date,
                status: data.status,
                billing_frequency: data.billing_frequency,
            };
            // Only include optional fields if they have values
            if (data.agreement_number)
                cleanData.agreement_number = data.agreement_number;
            if (data.description)
                cleanData.description = data.description;
            if (data.end_date)
                cleanData.end_date = data.end_date;
            if (data.terms)
                cleanData.terms = data.terms;
            if (data.pricing && data.pricing > 0)
                cleanData.pricing = data.pricing;
            // Remove agreement_number for new agreements (will be auto-generated)
            var agreement_number = cleanData.agreement_number, createData = __rest(cleanData, ["agreement_number"]);
            return agreements_api_1.agreementsApi.createAgreement(createData);
        },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['agreements'] });
            onSuccess();
        },
        onError: function () {
            // Error is displayed in the form
        },
    });
    var updateMutation = (0, react_query_1.useMutation)({
        mutationFn: function (data) {
            // Clean data: remove empty strings and convert to proper types for API
            var cleanData = {
                account_id: data.account_id,
                service_type_id: data.service_type_id,
                title: data.title,
                start_date: data.start_date,
                status: data.status,
                billing_frequency: data.billing_frequency,
            };
            // Only include optional fields if they have values
            if (data.agreement_number)
                cleanData.agreement_number = data.agreement_number;
            if (data.description)
                cleanData.description = data.description;
            if (data.end_date)
                cleanData.end_date = data.end_date;
            if (data.terms)
                cleanData.terms = data.terms;
            if (data.pricing && data.pricing > 0)
                cleanData.pricing = data.pricing;
            return agreements_api_1.agreementsApi.updateAgreement(agreement.id, cleanData);
        },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['agreements'] });
            onSuccess();
        },
        onError: function () {
            // Error is displayed in the form
        },
    });
    var onSubmit = function (data) { return __awaiter(_this, void 0, void 0, function () {
        var _error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsSubmitting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    if (!agreement) return [3 /*break*/, 3];
                    return [4 /*yield*/, updateMutation.mutateAsync(data)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, createMutation.mutateAsync(data)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    _error_1 = _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    setIsSubmitting(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "pt-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center mb-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-slate-900", children: agreement ? 'Edit Agreement' : 'Create New Agreement' }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: onCancel, className: "text-slate-400 hover:text-slate-600 transition-colors", children: (0, jsx_runtime_1.jsx)("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "account_id", control: control, render: function (_a) {
                            var _b;
                            var field = _a.field;
                            return ((0, jsx_runtime_1.jsx)(CustomerSearchSelector_1.default, { value: field.value, onChange: function (customerId) { return field.onChange(customerId); }, label: "Customer", required: true, showSelectedBox: true, apiSource: "secure", error: (_b = errors.account_id) === null || _b === void 0 ? void 0 : _b.message, placeholder: "Search customers by name, email, phone, or address..." }));
                        } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "service_type_id", control: control, render: function (_a) {
                            var _b, _c;
                            var field = _a.field;
                            return ((0, jsx_runtime_1.jsx)(Select_1.default, __assign({ label: "Service Type *", value: field.value || '', onChange: function (value) {
                                    field.onChange(value);
                                    setValue('service_type_id', value);
                                } }, (((_b = errors.service_type_id) === null || _b === void 0 ? void 0 : _b.message) || serviceTypesError ? { error: ((_c = errors.service_type_id) === null || _c === void 0 ? void 0 : _c.message) || 'Failed to load service types' } : {}), { disabled: serviceTypesLoading, options: __spreadArray([
                                    { value: '', label: serviceTypesLoading ? 'Loading service types...' : 'Select a service type' }
                                ], ((serviceTypes === null || serviceTypes === void 0 ? void 0 : serviceTypes.map(function (serviceType) { return ({
                                    value: serviceType.id,
                                    label: serviceType.service_name
                                }); })) || []), true) })));
                        } }), serviceTypesError && ((0, jsx_runtime_1.jsx)("p", { className: "text-red-500 text-sm mt-1", children: "Error loading service types. Please refresh the page." })), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Agreement Number", value: watch('agreement_number') || '', onChange: function (e) { return setValue('agreement_number', e.target.value); }, placeholder: "Auto-generated (e.g., AG-2025-0001)", disabled: true, className: "bg-slate-50", helperText: "Agreement number will be automatically generated when saved" }, (((_b = errors.agreement_number) === null || _b === void 0 ? void 0 : _b.message) && { error: errors.agreement_number.message }))) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "title", control: control, render: function (_a) {
                                        var _b;
                                        var field = _a.field;
                                        return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Agreement Title *", value: field.value || '', onChange: function (e) {
                                                field.onChange(e.target.value);
                                                setValue('title', e.target.value);
                                            }, placeholder: "e.g., Monthly Pest Control Service" }, (((_b = errors.title) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.title.message } : {}))));
                                    } }) })] }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "description", control: control, render: function (_a) {
                            var _b;
                            var field = _a.field;
                            return ((0, jsx_runtime_1.jsx)(Textarea_1.default, __assign({ label: "Description", value: field.value || '', onChange: function (e) {
                                    field.onChange(e.target.value);
                                    setValue('description', e.target.value);
                                }, placeholder: "Enter agreement description...", rows: 3 }, (((_b = errors.description) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.description.message } : {}))));
                        } }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "start_date", control: control, render: function (_a) {
                                    var _b;
                                    var field = _a.field;
                                    return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Start Date *", type: "date", value: field.value || '', onChange: function (e) {
                                            field.onChange(e.target.value);
                                            setValue('start_date', e.target.value);
                                        } }, (((_b = errors.start_date) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.start_date.message } : {}))));
                                } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "end_date", control: control, render: function (_a) {
                                    var _b;
                                    var field = _a.field;
                                    return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "End Date", type: "date", value: field.value || '', onChange: function (e) {
                                            field.onChange(e.target.value);
                                            setValue('end_date', e.target.value);
                                        } }, (((_b = errors.end_date) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.end_date.message } : {}))));
                                } })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "status", control: control, render: function (_a) {
                                    var _b;
                                    var field = _a.field;
                                    return ((0, jsx_runtime_1.jsx)(Select_1.default, __assign({ label: "Status", value: field.value || 'active', onChange: function (value) {
                                            field.onChange(value);
                                            setValue('status', value);
                                        } }, (((_b = errors.status) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.status.message } : {}), { options: [
                                            { value: 'active', label: 'Active' },
                                            { value: 'inactive', label: 'Inactive' },
                                            { value: 'expired', label: 'Expired' },
                                            { value: 'cancelled', label: 'Cancelled' }
                                        ] })));
                                } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "billing_frequency", control: control, render: function (_a) {
                                    var _b;
                                    var field = _a.field;
                                    return ((0, jsx_runtime_1.jsx)(Select_1.default, __assign({ label: "Billing Frequency", value: field.value || 'monthly', onChange: function (value) {
                                            field.onChange(value);
                                            setValue('billing_frequency', value);
                                        } }, (((_b = errors.billing_frequency) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.billing_frequency.message } : {}), { options: [
                                            { value: 'monthly', label: 'Monthly' },
                                            { value: 'quarterly', label: 'Quarterly' },
                                            { value: 'annually', label: 'Annually' },
                                            { value: 'one_time', label: 'One Time' }
                                        ] })));
                                } })] }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "pricing", control: control, render: function (_a) {
                            var _b, _c;
                            var field = _a.field;
                            return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Pricing ($)", type: "number", step: "0.01", min: "0", value: ((_b = field.value) === null || _b === void 0 ? void 0 : _b.toString()) || '', onChange: function (e) {
                                    var value = parseFloat(e.target.value) || 0;
                                    field.onChange(value);
                                    setValue('pricing', value);
                                }, placeholder: "0.00" }, (((_c = errors.pricing) === null || _c === void 0 ? void 0 : _c.message) ? { error: errors.pricing.message } : {}))));
                        } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "terms", control: control, render: function (_a) {
                            var _b;
                            var field = _a.field;
                            return ((0, jsx_runtime_1.jsx)(Textarea_1.default, __assign({ label: "Terms and Conditions", value: field.value || '', onChange: function (e) {
                                    field.onChange(e.target.value);
                                    setValue('terms', e.target.value);
                                }, placeholder: "Enter terms and conditions...", rows: 4 }, (((_b = errors.terms) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.terms.message } : {}))));
                        } }), (createMutation.error || updateMutation.error) && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-red-800 mb-1", children: "Error" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-700", children: ((_c = createMutation.error) === null || _c === void 0 ? void 0 : _c.message) || ((_d = updateMutation.error) === null || _d === void 0 ? void 0 : _d.message) })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3 justify-end pt-4 border-t border-slate-200", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { type: "button", variant: "outline", onClick: onCancel, disabled: isSubmitting, children: "Cancel" }), (0, jsx_runtime_1.jsx)(Button_1.default, { type: "submit", variant: "primary", disabled: isSubmitting, children: isSubmitting ? 'Saving...' : agreement ? 'Update Agreement' : 'Create Agreement' })] })] })] }));
}
