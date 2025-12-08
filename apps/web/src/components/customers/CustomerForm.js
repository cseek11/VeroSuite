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
exports.default = CustomerForm;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_hook_form_1 = require("react-hook-form");
var zod_1 = require("@hookform/resolvers/zod");
var zod_2 = require("zod");
var react_query_1 = require("@tanstack/react-query");
var supabase_client_1 = require("@/lib/supabase-client");
var secure_api_client_1 = require("@/lib/secure-api-client");
var lucide_react_1 = require("lucide-react");
var logger_1 = require("@/utils/logger");
var Input_1 = __importDefault(require("@/components/ui/Input"));
var Textarea_1 = __importDefault(require("@/components/ui/Textarea"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Select_1 = __importDefault(require("@/components/ui/Select"));
var Checkbox_1 = __importDefault(require("@/components/ui/Checkbox"));
// Zod validation schema
var customerFormSchema = zod_2.z.object({
    name: zod_2.z.string().min(1, 'Name is required'),
    account_type: zod_2.z.enum(['residential', 'commercial', 'industrial']),
    status: zod_2.z.enum(['active', 'inactive']),
    phone: zod_2.z.string().min(1, 'Phone is required'),
    email: zod_2.z.string().email('Invalid email format').min(1, 'Email is required'),
    address: zod_2.z.string().min(1, 'Address is required'),
    city: zod_2.z.string().min(1, 'City is required'),
    state: zod_2.z.string().min(1, 'State is required'),
    zip_code: zod_2.z.string().min(1, 'ZIP code is required'),
    billing_address: zod_2.z.object({
        address_line1: zod_2.z.string().optional(),
        city: zod_2.z.string().optional(),
        state: zod_2.z.string().optional(),
        zip_code: zod_2.z.string().optional(),
    }).optional(),
    payment_method: zod_2.z.enum(['credit_card', 'bank_transfer', 'invoice', 'cash']),
    billing_cycle: zod_2.z.enum(['monthly', 'quarterly', 'annually']),
    property_type: zod_2.z.string().optional(),
    property_size: zod_2.z.string().optional(),
    access_instructions: zod_2.z.string().optional(),
    emergency_contact: zod_2.z.string().optional(),
    preferred_contact_method: zod_2.z.enum(['phone', 'email', 'text']),
    ar_balance: zod_2.z.number().min(0).default(0),
    business_name: zod_2.z.string().optional(),
    business_type: zod_2.z.string().optional(),
    segment_id: zod_2.z.string().optional(),
    access_codes: zod_2.z.string().optional(),
    special_instructions: zod_2.z.string().optional(),
    preferred_language: zod_2.z.string().optional(),
    timezone: zod_2.z.string().optional(),
    contract_start_date: zod_2.z.string().optional(),
    contract_type: zod_2.z.enum(['monthly', 'quarterly', 'annually']).optional(),
    contract_value: zod_2.z.number().min(0).default(0),
    auto_renew: zod_2.z.boolean().default(true),
    account_status: zod_2.z.enum(['active', 'inactive', 'suspended']).optional(),
    payment_status: zod_2.z.enum(['current', 'past_due', 'overdue']).optional(),
    service_status: zod_2.z.enum(['active', 'inactive', 'suspended']).optional(),
});
function CustomerForm(_a) {
    var _this = this;
    var customer = _a.customer, onSave = _a.onSave, onCancel = _a.onCancel;
    var queryClient = (0, react_query_1.useQueryClient)();
    var _b = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(customerFormSchema),
        defaultValues: {
            name: '',
            account_type: 'residential',
            status: 'active',
            phone: '',
            email: '',
            address: '',
            city: '',
            state: '',
            zip_code: '',
            billing_address: {
                address_line1: '',
                city: '',
                state: '',
                zip_code: '',
            },
            payment_method: 'credit_card',
            billing_cycle: 'monthly',
            property_type: '',
            property_size: '',
            access_instructions: '',
            emergency_contact: '',
            preferred_contact_method: 'phone',
            ar_balance: 0,
            business_name: '',
            business_type: '',
            segment_id: '',
            access_codes: '',
            special_instructions: '',
            preferred_language: 'English',
            timezone: 'America/Chicago',
            contract_start_date: '',
            contract_type: 'monthly',
            contract_value: 0,
            auto_renew: true,
            account_status: 'active',
            payment_status: 'current',
            service_status: 'active',
        },
    }), control = _b.control, handleSubmit = _b.handleSubmit, _c = _b.formState, errors = _c.errors, isSubmitting = _c.isSubmitting, reset = _b.reset, _watch = _b.watch;
    // Fetch segments for dropdown
    var segments = (0, react_query_1.useQuery)({
        queryKey: ['customer-segments'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase_client_1.supabase
                            .from('customer_segments')
                            .select('*')
                            .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28')];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        }); },
    }).data;
    // Test database connection
    var testAccounts = (0, react_query_1.useQuery)({
        queryKey: ['test-accounts'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase_client_1.supabase
                            .from('accounts')
                            .select('count')
                            .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28')
                            .limit(1)];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            logger_1.logger.error('Test query error', error, 'CustomerForm');
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, data];
                }
            });
        }); },
    }).data;
    // Test tenant existence
    var testTenant = (0, react_query_1.useQuery)({
        queryKey: ['test-tenant'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, supabase_client_1.supabase
                            .from('tenants')
                            .select('id, name')
                            .eq('id', '7193113e-ece2-4f7b-ae8c-176df4367e28')
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            logger_1.logger.error('Tenant query error', error, 'CustomerForm');
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, data];
                }
            });
        }); },
    }).data;
    // Test basic Supabase connection
    var testConnection = (0, react_query_1.useQuery)({
        queryKey: ['test-connection'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, data, error, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, supabase_client_1.supabase.auth.getUser()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            logger_1.logger.error('Auth test error', error, 'CustomerForm');
                            return [2 /*return*/, { success: false, error: error.message }];
                        }
                        return [2 /*return*/, { success: true, user: data.user }];
                    case 2:
                        err_1 = _b.sent();
                        logger_1.logger.error('Connection test error', err_1, 'CustomerForm');
                        return [2 /*return*/, { success: false, error: 'Connection failed' }];
                    case 3: return [2 /*return*/];
                }
            });
        }); },
    }).data;
    // Initialize form data when editing
    (0, react_1.useEffect)(function () {
        var _a, _b;
        if (customer) {
            var profile = (_a = customer.customer_profiles) === null || _a === void 0 ? void 0 : _a[0];
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
                billing_address: customer.billing_address || {
                    address_line1: customer.address || '',
                    city: customer.city || '',
                    state: customer.state || '',
                    zip_code: customer.zip_code || '',
                },
                payment_method: customer.payment_method || 'credit_card',
                billing_cycle: customer.billing_cycle || 'monthly',
                property_type: customer.property_type || '',
                property_size: customer.property_size || '',
                access_instructions: customer.access_instructions || '',
                emergency_contact: customer.emergency_contact || '',
                preferred_contact_method: customer.preferred_contact_method || 'phone',
                ar_balance: customer.ar_balance || 0,
                business_name: (profile === null || profile === void 0 ? void 0 : profile.business_name) || '',
                business_type: (profile === null || profile === void 0 ? void 0 : profile.business_type) || '',
                segment_id: (profile === null || profile === void 0 ? void 0 : profile.segment_id) || '',
                access_codes: (profile === null || profile === void 0 ? void 0 : profile.access_codes) || '',
                special_instructions: (profile === null || profile === void 0 ? void 0 : profile.special_instructions) || '',
                preferred_language: (profile === null || profile === void 0 ? void 0 : profile.preferred_language) || 'English',
                timezone: (profile === null || profile === void 0 ? void 0 : profile.timezone) || 'America/Chicago',
                contract_start_date: (profile === null || profile === void 0 ? void 0 : profile.contract_start_date) ? new Date(profile.contract_start_date).toISOString().split('T')[0] : '',
                contract_type: (profile === null || profile === void 0 ? void 0 : profile.contract_type) || 'monthly',
                contract_value: (profile === null || profile === void 0 ? void 0 : profile.contract_value) || 0,
                auto_renew: (_b = profile === null || profile === void 0 ? void 0 : profile.auto_renew) !== null && _b !== void 0 ? _b : true,
                account_status: (profile === null || profile === void 0 ? void 0 : profile.account_status) || 'active',
                payment_status: (profile === null || profile === void 0 ? void 0 : profile.payment_status) || 'current',
                service_status: (profile === null || profile === void 0 ? void 0 : profile.service_status) || 'active',
            });
        }
    }, [customer, reset]);
    // Create/Update customer mutation
    var createCustomerMutation = (0, react_query_1.useMutation)({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            var accountData, account, profileError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        accountData = {
                            name: data.name,
                            account_type: data.account_type || 'commercial',
                            status: data.status || 'active',
                            phone: data.phone || null,
                            email: data.email || null,
                            address: data.address || null,
                            city: data.city || null,
                            state: data.state || null,
                            zip_code: data.zip_code || null,
                            billing_address: data.billing_address || null,
                            payment_method: data.payment_method || null,
                            billing_cycle: data.billing_cycle || null,
                            property_type: data.property_type || null,
                            property_size: data.property_size || null,
                            access_instructions: data.access_instructions || null,
                            emergency_contact: data.emergency_contact || null,
                            preferred_contact_method: data.preferred_contact_method || null,
                            ar_balance: data.ar_balance || 0,
                        };
                        logger_1.logger.debug('Creating account via backend API', { accountData: accountData }, 'CustomerForm');
                        return [4 /*yield*/, secure_api_client_1.secureApiClient.accounts.create(accountData)];
                    case 1:
                        account = _a.sent();
                        logger_1.logger.debug('Account created successfully', { accountId: account.id }, 'CustomerForm');
                        if (!data.segment_id) return [3 /*break*/, 3];
                        return [4 /*yield*/, supabase_client_1.supabase
                                .from('customer_profiles')
                                .insert({
                                tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28',
                                account_id: account.id,
                                segment_id: data.segment_id,
                                business_name: data.business_name,
                                business_type: data.business_type,
                                property_type: data.property_type,
                                property_size: data.property_size,
                                access_codes: data.access_codes,
                                special_instructions: data.special_instructions,
                                preferred_language: data.preferred_language,
                                timezone: data.timezone,
                                contract_start_date: data.contract_start_date,
                                contract_type: data.contract_type,
                                contract_value: data.contract_value,
                                auto_renew: data.auto_renew,
                                account_status: data.account_status,
                                payment_status: data.payment_status,
                                service_status: data.service_status,
                            })];
                    case 2:
                        profileError = (_a.sent()).error;
                        if (profileError)
                            throw profileError;
                        _a.label = 3;
                    case 3: return [2 /*return*/, account];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            onSave();
        },
    });
    var updateCustomerMutation = (0, react_query_1.useMutation)({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            var accountError, profile, profileError, profileError;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!customer)
                            throw new Error('No customer to update');
                        return [4 /*yield*/, supabase_client_1.supabase
                                .from('accounts')
                                .update({
                                name: data.name,
                                account_type: data.account_type,
                                status: data.status,
                                phone: data.phone,
                                email: data.email,
                                address: data.address,
                                city: data.city,
                                state: data.state,
                                zip_code: data.zip_code,
                                billing_address: data.billing_address,
                                payment_method: data.payment_method,
                                billing_cycle: data.billing_cycle,
                                property_type: data.property_type,
                                property_size: data.property_size,
                                access_instructions: data.access_instructions,
                                emergency_contact: data.emergency_contact,
                                preferred_contact_method: data.preferred_contact_method,
                                ar_balance: data.ar_balance,
                            })
                                .eq('id', customer.id)];
                    case 1:
                        accountError = (_b.sent()).error;
                        if (accountError)
                            throw accountError;
                        profile = (_a = customer.customer_profiles) === null || _a === void 0 ? void 0 : _a[0];
                        if (!profile) return [3 /*break*/, 3];
                        return [4 /*yield*/, supabase_client_1.supabase
                                .from('customer_profiles')
                                .update({
                                segment_id: data.segment_id,
                                business_name: data.business_name,
                                business_type: data.business_type,
                                property_type: data.property_type,
                                property_size: data.property_size,
                                access_codes: data.access_codes,
                                special_instructions: data.special_instructions,
                                preferred_language: data.preferred_language,
                                timezone: data.timezone,
                                contract_start_date: data.contract_start_date,
                                contract_type: data.contract_type,
                                contract_value: data.contract_value,
                                auto_renew: data.auto_renew,
                                account_status: data.account_status,
                                payment_status: data.payment_status,
                                service_status: data.service_status,
                            })
                                .eq('id', profile.id)];
                    case 2:
                        profileError = (_b.sent()).error;
                        if (profileError)
                            throw profileError;
                        return [3 /*break*/, 5];
                    case 3:
                        if (!data.segment_id) return [3 /*break*/, 5];
                        return [4 /*yield*/, supabase_client_1.supabase
                                .from('customer_profiles')
                                .insert({
                                tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28',
                                account_id: customer.id,
                                segment_id: data.segment_id,
                                business_name: data.business_name,
                                business_type: data.business_type,
                                property_type: data.property_type,
                                property_size: data.property_size,
                                access_codes: data.access_codes,
                                special_instructions: data.special_instructions,
                                preferred_language: data.preferred_language,
                                timezone: data.timezone,
                                contract_start_date: data.contract_start_date,
                                contract_type: data.contract_type,
                                contract_value: data.contract_value,
                                auto_renew: data.auto_renew,
                                account_status: data.account_status,
                                payment_status: data.payment_status,
                                service_status: data.service_status,
                            })];
                    case 4:
                        profileError = (_b.sent()).error;
                        if (profileError)
                            throw profileError;
                        _b.label = 5;
                    case 5: return [2 /*return*/, customer];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            queryClient.invalidateQueries({ queryKey: ['customer', customer === null || customer === void 0 ? void 0 : customer.id] });
            onSave();
        },
    });
    var onSubmit = function (data) { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    if (!customer) return [3 /*break*/, 2];
                    return [4 /*yield*/, updateCustomerMutation.mutateAsync(data)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, createCustomerMutation.mutateAsync(data)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    logger_1.logger.error('Error saving customer', error_1, 'CustomerForm');
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var isEditMode = !!customer;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-4xl mx-auto", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { className: "mb-6", children: (0, jsx_runtime_1.jsx)("div", { className: "px-6 py-4 border-b border-gray-200", children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "ghost", onClick: onCancel, className: "p-2", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { className: "h-5 w-5" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-gray-900", children: isEditMode ? 'Edit Customer' : 'Add New Customer' }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: isEditMode ? 'Update customer information' : 'Create a new customer account' })] })] }) }) }) }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)(Card_1.default, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "px-6 py-4 border-b border-gray-200", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900", children: "Basic Information" }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-2 text-xs text-gray-500", children: [(0, jsx_runtime_1.jsxs)("div", { children: ["Test Tenant: ", testTenant ? "".concat(testTenant.name, " (").concat(testTenant.id, ")") : 'Not found'] }), (0, jsx_runtime_1.jsxs)("div", { children: ["Test Accounts: ", testAccounts ? 'Query successful' : 'Query failed'] }), (0, jsx_runtime_1.jsxs)("div", { children: ["Connection: ", (testConnection === null || testConnection === void 0 ? void 0 : testConnection.success) ? 'Connected' : (testConnection === null || testConnection === void 0 ? void 0 : testConnection.error) || 'Testing...'] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "px-6 py-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "name", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, field, { label: "Name *", error: (_b = errors.name) === null || _b === void 0 ? void 0 : _b.message })));
                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "account_type", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Select_1.default, { value: field.value, onChange: function (value) { return field.onChange(value); }, label: "Account Type *", options: [
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
                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "segment_id", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Select_1.default, { value: field.value || '', onChange: function (value) { return field.onChange(value); }, label: "Segment", placeholder: "Select a segment", options: __spreadArray([
                                                        { value: '', label: 'Select a segment' }
                                                    ], ((segments === null || segments === void 0 ? void 0 : segments.map(function (segment) { return ({
                                                        value: segment.id,
                                                        label: segment.segment_name,
                                                    }); })) || []), true), error: (_b = errors.segment_id) === null || _b === void 0 ? void 0 : _b.message }));
                                            } })] }) })] }), (0, jsx_runtime_1.jsxs)(Card_1.default, { children: [(0, jsx_runtime_1.jsx)("div", { className: "px-6 py-4 border-b border-gray-200", children: (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900", children: "Contact Information" }) }), (0, jsx_runtime_1.jsx)("div", { className: "px-6 py-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "email", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, field, { type: "email", label: "Email *", error: (_b = errors.email) === null || _b === void 0 ? void 0 : _b.message })));
                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "phone", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, field, { type: "tel", label: "Phone *", error: (_b = errors.phone) === null || _b === void 0 ? void 0 : _b.message })));
                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "preferred_contact_method", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Select_1.default, { value: field.value, onChange: function (value) { return field.onChange(value); }, label: "Preferred Contact Method", options: [
                                                        { value: 'phone', label: 'Phone' },
                                                        { value: 'email', label: 'Email' },
                                                        { value: 'text', label: 'Text' },
                                                    ], error: (_b = errors.preferred_contact_method) === null || _b === void 0 ? void 0 : _b.message }));
                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "emergency_contact", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, field, { label: "Emergency Contact", error: (_b = errors.emergency_contact) === null || _b === void 0 ? void 0 : _b.message })));
                                            } })] }) })] }), (0, jsx_runtime_1.jsxs)(Card_1.default, { children: [(0, jsx_runtime_1.jsx)("div", { className: "px-6 py-4 border-b border-gray-200", children: (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900", children: "Address Information" }) }), (0, jsx_runtime_1.jsx)("div", { className: "px-6 py-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "md:col-span-2", children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "address", control: control, render: function (_a) {
                                                    var _b;
                                                    var field = _a.field;
                                                    return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, field, { label: "Address *", error: (_b = errors.address) === null || _b === void 0 ? void 0 : _b.message })));
                                                } }) }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "city", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, field, { label: "City *", error: (_b = errors.city) === null || _b === void 0 ? void 0 : _b.message })));
                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "state", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, field, { label: "State *", error: (_b = errors.state) === null || _b === void 0 ? void 0 : _b.message })));
                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "zip_code", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, field, { label: "ZIP Code *", error: (_b = errors.zip_code) === null || _b === void 0 ? void 0 : _b.message })));
                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "property_type", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, field, { label: "Property Type", error: (_b = errors.property_type) === null || _b === void 0 ? void 0 : _b.message })));
                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "property_size", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, field, { label: "Property Size", error: (_b = errors.property_size) === null || _b === void 0 ? void 0 : _b.message })));
                                            } }), (0, jsx_runtime_1.jsx)("div", { className: "md:col-span-2", children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "access_instructions", control: control, render: function (_a) {
                                                    var _b;
                                                    var field = _a.field;
                                                    return ((0, jsx_runtime_1.jsx)(Textarea_1.default, __assign({}, field, { label: "Access Instructions", rows: 3, error: (_b = errors.access_instructions) === null || _b === void 0 ? void 0 : _b.message })));
                                                } }) })] }) })] }), (0, jsx_runtime_1.jsxs)(Card_1.default, { children: [(0, jsx_runtime_1.jsx)("div", { className: "px-6 py-4 border-b border-gray-200", children: (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900", children: "Business & Contract Information" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "px-6 py-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "business_name", control: control, render: function (_a) {
                                                    var _b;
                                                    var field = _a.field;
                                                    return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, field, { label: "Business Name", error: (_b = errors.business_name) === null || _b === void 0 ? void 0 : _b.message })));
                                                } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "business_type", control: control, render: function (_a) {
                                                    var _b;
                                                    var field = _a.field;
                                                    return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, field, { label: "Business Type", error: (_b = errors.business_type) === null || _b === void 0 ? void 0 : _b.message })));
                                                } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "contract_type", control: control, render: function (_a) {
                                                    var _b;
                                                    var field = _a.field;
                                                    return ((0, jsx_runtime_1.jsx)(Select_1.default, { value: field.value || '', onChange: function (value) { return field.onChange(value); }, label: "Contract Type", options: [
                                                            { value: 'monthly', label: 'Monthly' },
                                                            { value: 'quarterly', label: 'Quarterly' },
                                                            { value: 'annually', label: 'Annually' },
                                                        ], error: (_b = errors.contract_type) === null || _b === void 0 ? void 0 : _b.message }));
                                                } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "contract_value", control: control, render: function (_a) {
                                                    var _b, _c;
                                                    var field = _a.field;
                                                    return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, field, { type: "number", step: "0.01", label: "Contract Value ($)", value: ((_b = field.value) === null || _b === void 0 ? void 0 : _b.toString()) || '', onChange: function (e) { return field.onChange(parseFloat(e.target.value) || 0); }, error: (_c = errors.contract_value) === null || _c === void 0 ? void 0 : _c.message })));
                                                } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "contract_start_date", control: control, render: function (_a) {
                                                    var _b;
                                                    var field = _a.field;
                                                    return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, field, { type: "date", label: "Contract Start Date", error: (_b = errors.contract_start_date) === null || _b === void 0 ? void 0 : _b.message })));
                                                } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "payment_method", control: control, render: function (_a) {
                                                    var _b;
                                                    var field = _a.field;
                                                    return ((0, jsx_runtime_1.jsx)(Select_1.default, { value: field.value, onChange: function (value) { return field.onChange(value); }, label: "Payment Method", options: [
                                                            { value: 'credit_card', label: 'Credit Card' },
                                                            { value: 'bank_transfer', label: 'Bank Transfer' },
                                                            { value: 'invoice', label: 'Invoice' },
                                                            { value: 'cash', label: 'Cash' },
                                                        ], error: (_b = errors.payment_method) === null || _b === void 0 ? void 0 : _b.message }));
                                                } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "billing_cycle", control: control, render: function (_a) {
                                                    var _b;
                                                    var field = _a.field;
                                                    return ((0, jsx_runtime_1.jsx)(Select_1.default, { value: field.value, onChange: function (value) { return field.onChange(value); }, label: "Billing Cycle", options: [
                                                            { value: 'monthly', label: 'Monthly' },
                                                            { value: 'quarterly', label: 'Quarterly' },
                                                            { value: 'annually', label: 'Annually' },
                                                        ], error: (_b = errors.billing_cycle) === null || _b === void 0 ? void 0 : _b.message }));
                                                } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "ar_balance", control: control, render: function (_a) {
                                                    var _b, _c;
                                                    var field = _a.field;
                                                    return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({}, field, { type: "number", step: "0.01", label: "AR Balance ($)", value: ((_b = field.value) === null || _b === void 0 ? void 0 : _b.toString()) || '', onChange: function (e) { return field.onChange(parseFloat(e.target.value) || 0); }, error: (_c = errors.ar_balance) === null || _c === void 0 ? void 0 : _c.message })));
                                                } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "auto_renew", control: control, render: function (_a) {
                                                    var _b, _c;
                                                    var field = _a.field;
                                                    return ((0, jsx_runtime_1.jsx)(Checkbox_1.default, __assign({ checked: (_b = field.value) !== null && _b !== void 0 ? _b : false, onChange: field.onChange, label: "Auto Renew" }, (((_c = errors.auto_renew) === null || _c === void 0 ? void 0 : _c.message) !== undefined ? { error: errors.auto_renew.message } : {}))));
                                                } })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-4", children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "special_instructions", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Textarea_1.default, __assign({}, field, { label: "Special Instructions", rows: 3, error: (_b = errors.special_instructions) === null || _b === void 0 ? void 0 : _b.message })));
                                            } }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-end space-x-3", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { type: "button", variant: "outline", onClick: onCancel, children: "Cancel" }), (0, jsx_runtime_1.jsx)(Button_1.default, { type: "submit", variant: "primary", loading: isSubmitting, icon: lucide_react_1.Check, children: isSubmitting ? 'Saving...' : (isEditMode ? 'Update Customer' : 'Create Customer') })] })] })] }));
}
