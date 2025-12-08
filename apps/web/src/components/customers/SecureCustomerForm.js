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
exports.default = SecureCustomerForm;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_hook_form_1 = require("react-hook-form");
var zod_1 = require("@hookform/resolvers/zod");
var zod_2 = require("zod");
var lucide_react_1 = require("lucide-react");
var useSecureAccounts_1 = require("@/hooks/useSecureAccounts");
var logger_1 = require("@/utils/logger");
var Input_1 = __importDefault(require("@/components/ui/Input"));
var Textarea_1 = __importDefault(require("@/components/ui/Textarea"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Select_1 = __importDefault(require("@/components/ui/Select"));
// Zod validation schema
var secureCustomerFormSchema = zod_2.z.object({
    name: zod_2.z.string().min(1, 'Customer name is required'),
    account_type: zod_2.z.enum(['residential', 'commercial', 'industrial']),
    status: zod_2.z.enum(['active', 'inactive']),
    phone: zod_2.z.string().min(1, 'Phone number is required'),
    email: zod_2.z.string().email('Email is invalid').min(1, 'Email is required'),
    address: zod_2.z.string().optional(),
    city: zod_2.z.string().optional(),
    state: zod_2.z.string().optional(),
    zip_code: zod_2.z.string().optional(),
    notes: zod_2.z.string().optional(),
});
function SecureCustomerForm(_a) {
    var _this = this;
    var customer = _a.customer, onSave = _a.onSave, onCancel = _a.onCancel;
    var isEditMode = !!customer;
    // Use secure hooks instead of direct Supabase calls
    var createAccountMutation = (0, useSecureAccounts_1.useCreateAccount)();
    var updateAccountMutation = (0, useSecureAccounts_1.useUpdateAccount)();
    var _b = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(secureCustomerFormSchema),
        defaultValues: {
            name: (customer === null || customer === void 0 ? void 0 : customer.name) || '',
            account_type: (customer === null || customer === void 0 ? void 0 : customer.account_type) || 'residential',
            status: (customer === null || customer === void 0 ? void 0 : customer.status) || 'active',
            phone: (customer === null || customer === void 0 ? void 0 : customer.phone) || '',
            email: (customer === null || customer === void 0 ? void 0 : customer.email) || '',
            address: (customer === null || customer === void 0 ? void 0 : customer.address) || '',
            city: (customer === null || customer === void 0 ? void 0 : customer.city) || '',
            state: (customer === null || customer === void 0 ? void 0 : customer.state) || '',
            zip_code: (customer === null || customer === void 0 ? void 0 : customer.zip_code) || '',
            notes: (customer === null || customer === void 0 ? void 0 : customer.notes) || '',
        },
    }), control = _b.control, handleSubmit = _b.handleSubmit, errors = _b.formState.errors, reset = _b.reset;
    // Initialize form data when editing
    (0, react_1.useEffect)(function () {
        if (customer) {
            reset({
                name: customer.name || '',
                account_type: customer.account_type || 'residential',
                status: customer.status || 'active',
                phone: customer.phone || '',
                email: customer.email || '',
                address: customer.address || '',
                city: customer.city || '',
                state: customer.state || '',
                zip_code: customer.zip_code || '',
                notes: customer.notes || '',
            });
        }
    }, [customer, reset]);
    var onSubmit = function (data) { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    if (!(isEditMode && (customer === null || customer === void 0 ? void 0 : customer.id))) return [3 /*break*/, 2];
                    // Update existing customer using secure hook
                    return [4 /*yield*/, updateAccountMutation.mutateAsync({
                            id: customer.id,
                            data: data
                        })];
                case 1:
                    // Update existing customer using secure hook
                    _a.sent();
                    logger_1.logger.debug('Customer updated successfully', { customerId: customer.id }, 'SecureCustomerForm');
                    return [3 /*break*/, 4];
                case 2: 
                // Create new customer using secure hook
                return [4 /*yield*/, createAccountMutation.mutateAsync(data)];
                case 3:
                    // Create new customer using secure hook
                    _a.sent();
                    logger_1.logger.debug('Customer created successfully', {}, 'SecureCustomerForm');
                    _a.label = 4;
                case 4:
                    onSave();
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    logger_1.logger.error('Error saving customer', error_1, 'SecureCustomerForm');
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var isLoading = createAccountMutation.isPending || updateAccountMutation.isPending;
    return ((0, jsx_runtime_1.jsxs)(Card_1.default, { children: [(0, jsx_runtime_1.jsx)("div", { className: "px-6 py-4 border-b border-gray-200", children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "ghost", onClick: onCancel, className: "p-2", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { className: "h-5 w-5" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-xl font-semibold text-gray-900", children: isEditMode ? 'Edit Customer' : 'Add New Customer' }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: isEditMode ? 'Update customer information' : 'Create a new customer account' })] })] }) }) }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit(onSubmit), className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900", children: "Basic Information" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "name", control: control, render: function (_a) {
                                            var _b;
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, field, { label: "Customer Name *", placeholder: "Enter customer name", error: (_b = errors.name) === null || _b === void 0 ? void 0 : _b.message, disabled: isLoading })));
                                        } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "account_type", control: control, render: function (_a) {
                                            var _b;
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsx)(Select_1.default, { value: field.value, onChange: function (value) { return field.onChange(value); }, label: "Account Type", options: [
                                                    { value: 'residential', label: 'Residential' },
                                                    { value: 'commercial', label: 'Commercial' },
                                                    { value: 'industrial', label: 'Industrial' },
                                                ], error: (_b = errors.account_type) === null || _b === void 0 ? void 0 : _b.message }));
                                        } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "status", control: control, render: function (_a) {
                                            var _b;
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsx)(Select_1.default, { value: field.value, onChange: function (value) { return field.onChange(value); }, label: "Status", options: [
                                                    { value: 'active', label: 'Active' },
                                                    { value: 'inactive', label: 'Inactive' },
                                                ], error: (_b = errors.status) === null || _b === void 0 ? void 0 : _b.message }));
                                        } })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900", children: "Contact Information" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "phone", control: control, render: function (_a) {
                                            var _b;
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, field, { type: "tel", label: "Phone Number *", placeholder: "(555) 123-4567", error: (_b = errors.phone) === null || _b === void 0 ? void 0 : _b.message, disabled: isLoading })));
                                        } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "email", control: control, render: function (_a) {
                                            var _b;
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, field, { type: "email", label: "Email Address *", placeholder: "customer@example.com", error: (_b = errors.email) === null || _b === void 0 ? void 0 : _b.message, disabled: isLoading })));
                                        } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "address", control: control, render: function (_a) {
                                            var _b;
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, field, { label: "Street Address", placeholder: "123 Main Street", error: (_b = errors.address) === null || _b === void 0 ? void 0 : _b.message, disabled: isLoading })));
                                        } }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "city", control: control, render: function (_a) {
                                                    var _b;
                                                    var field = _a.field;
                                                    return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, field, { label: "City", placeholder: "City", error: (_b = errors.city) === null || _b === void 0 ? void 0 : _b.message, disabled: isLoading })));
                                                } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "state", control: control, render: function (_a) {
                                                    var _b;
                                                    var field = _a.field;
                                                    return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, field, { label: "State", placeholder: "State", error: (_b = errors.state) === null || _b === void 0 ? void 0 : _b.message, disabled: isLoading })));
                                                } })] }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "zip_code", control: control, render: function (_a) {
                                            var _b;
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, field, { label: "ZIP Code", placeholder: "12345", error: (_b = errors.zip_code) === null || _b === void 0 ? void 0 : _b.message, disabled: isLoading })));
                                        } })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-6", children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "notes", control: control, render: function (_a) {
                                var _b;
                                var field = _a.field;
                                return ((0, jsx_runtime_1.jsx)(Textarea_1.default, __assign({}, field, { label: "Notes", rows: 3, placeholder: "Additional notes about this customer...", error: (_b = errors.notes) === null || _b === void 0 ? void 0 : _b.message, disabled: isLoading })));
                            } }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { type: "button", variant: "outline", onClick: onCancel, disabled: isLoading, children: "Cancel" }), (0, jsx_runtime_1.jsx)(Button_1.default, { type: "submit", variant: "primary", loading: isLoading, icon: lucide_react_1.Check, disabled: isLoading, children: isEditMode ? 'Update Customer' : 'Create Customer' })] })] })] }));
}
