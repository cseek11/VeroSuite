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
exports.UserManagementForm = UserManagementForm;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_hook_form_1 = require("react-hook-form");
var zod_1 = require("@hookform/resolvers/zod");
var zod_2 = require("zod");
var react_query_1 = require("@tanstack/react-query");
var user_api_1 = require("@/lib/user-api");
var role_actions_1 = require("@/types/role-actions");
var auth_1 = require("@/stores/auth");
var Input_1 = __importDefault(require("@/components/ui/Input"));
var Select_1 = __importDefault(require("@/components/ui/Select"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var lucide_react_1 = require("lucide-react");
var logger_1 = require("@/utils/logger");
// Expanded form schema with all employee fields
var userFormSchema = zod_2.z.object({
    email: zod_2.z.string().email('Invalid email address').min(1, 'Email is required'),
    first_name: zod_2.z.string().min(1, 'First name is required'),
    last_name: zod_2.z.string().min(1, 'Last name is required'),
    phone: zod_2.z.string().optional(),
    employee_id: zod_2.z.string().optional(),
    hire_date: zod_2.z.string().optional(),
    position: zod_2.z.string().optional(),
    department: zod_2.z.string().optional(),
    employment_type: zod_2.z.enum(['full_time', 'part_time', 'contractor', 'temporary']).optional(),
    roles: zod_2.z.array(zod_2.z.string()).min(1, 'At least one role is required'),
    custom_permissions: zod_2.z.array(zod_2.z.string()).optional(),
    status: zod_2.z.enum(['active', 'inactive', 'suspended']).default('active'),
    emergency_contact_name: zod_2.z.string().optional(),
    emergency_contact_phone: zod_2.z.string().optional(),
    emergency_contact_relationship: zod_2.z.string().optional(),
    address_line1: zod_2.z.string().optional(),
    address_line2: zod_2.z.string().optional(),
    city: zod_2.z.string().optional(),
    state: zod_2.z.string().optional().refine(function (val) { return !val || val.length === 2; }, 'State must be 2 characters'),
    postal_code: zod_2.z.string().optional(),
    country: zod_2.z.string().optional(),
    date_of_birth: zod_2.z.string().optional(),
    social_security_number: zod_2.z.string().optional().refine(function (val) { return !val || /^\d{3}-\d{2}-\d{4}$/.test(val); }, 'SSN must be in format XXX-XX-XXXX'),
    driver_license_number: zod_2.z.string().optional(),
    driver_license_state: zod_2.z.string().optional().refine(function (val) { return !val || val.length === 2; }, 'State must be 2 characters'),
    driver_license_expiry: zod_2.z.string().optional(),
    qualifications: zod_2.z.array(zod_2.z.string()).optional(),
    technician_number: zod_2.z.string().optional(),
    pesticide_license_number: zod_2.z.string().optional(),
    license_expiration_date: zod_2.z.string().optional(),
});
// Resources and actions for permission matrix
var RESOURCES = ['jobs', 'work_orders', 'customers', 'technicians', 'invoices', 'reports', 'settings', 'users', 'inventory', 'financial'];
var ACTIONS = ['view', 'create', 'update', 'delete', 'assign', 'approve', 'export', 'import', 'manage'];
function UserManagementForm(_a) {
    var _this = this;
    var user = _a.user, onSave = _a.onSave, onCancel = _a.onCancel;
    var _b = (0, react_1.useState)(null), status = _b[0], setStatus = _b[1];
    var _c = (0, react_1.useState)(new Set(['basic'])), expandedSections = _c[0], setExpandedSections = _c[1];
    var _d = (0, react_1.useState)(''), newQualification = _d[0], setNewQualification = _d[1];
    var _e = (0, react_1.useState)(new Set()), customPermissions = _e[0], setCustomPermissions = _e[1];
    var queryClient = (0, react_query_1.useQueryClient)();
    var isEditMode = !!user;
    var _f = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(userFormSchema),
        defaultValues: {
            email: (user === null || user === void 0 ? void 0 : user.email) || '',
            first_name: (user === null || user === void 0 ? void 0 : user.first_name) || '',
            last_name: (user === null || user === void 0 ? void 0 : user.last_name) || '',
            phone: (user === null || user === void 0 ? void 0 : user.phone) || '',
            employee_id: (user === null || user === void 0 ? void 0 : user.employee_id) || '',
            hire_date: (user === null || user === void 0 ? void 0 : user.hire_date) ? user.hire_date.split('T')[0] : '',
            position: (user === null || user === void 0 ? void 0 : user.position) || '',
            department: (user === null || user === void 0 ? void 0 : user.department) || '',
            employment_type: (user === null || user === void 0 ? void 0 : user.employment_type) || 'full_time',
            roles: (user === null || user === void 0 ? void 0 : user.roles) || ['technician'],
            custom_permissions: (user === null || user === void 0 ? void 0 : user.custom_permissions) || [],
            status: (user === null || user === void 0 ? void 0 : user.status) || 'active',
            emergency_contact_name: (user === null || user === void 0 ? void 0 : user.emergency_contact_name) || '',
            emergency_contact_phone: (user === null || user === void 0 ? void 0 : user.emergency_contact_phone) || '',
            emergency_contact_relationship: (user === null || user === void 0 ? void 0 : user.emergency_contact_relationship) || '',
            address_line1: (user === null || user === void 0 ? void 0 : user.address_line1) || '',
            address_line2: (user === null || user === void 0 ? void 0 : user.address_line2) || '',
            city: (user === null || user === void 0 ? void 0 : user.city) || '',
            state: (user === null || user === void 0 ? void 0 : user.state) || '',
            postal_code: (user === null || user === void 0 ? void 0 : user.postal_code) || '',
            country: (user === null || user === void 0 ? void 0 : user.country) || 'US',
            date_of_birth: (user === null || user === void 0 ? void 0 : user.date_of_birth) ? user.date_of_birth.split('T')[0] : '',
            social_security_number: '', // Never pre-fill SSN for security
            driver_license_number: '', // Never pre-fill for security
            driver_license_state: (user === null || user === void 0 ? void 0 : user.driver_license_state) || '',
            driver_license_expiry: (user === null || user === void 0 ? void 0 : user.driver_license_expiry) ? user.driver_license_expiry.split('T')[0] : '',
            qualifications: (user === null || user === void 0 ? void 0 : user.qualifications) || [],
            technician_number: (user === null || user === void 0 ? void 0 : user.technician_number) || '',
            pesticide_license_number: (user === null || user === void 0 ? void 0 : user.pesticide_license_number) || '',
            license_expiration_date: (user === null || user === void 0 ? void 0 : user.license_expiration_date) ? user.license_expiration_date.split('T')[0] : '',
        },
    }), control = _f.control, handleSubmit = _f.handleSubmit, errors = _f.formState.errors, reset = _f.reset, watch = _f.watch, setValue = _f.setValue;
    // Initialize custom permissions from user
    (0, react_1.useEffect)(function () {
        if (user === null || user === void 0 ? void 0 : user.custom_permissions) {
            setCustomPermissions(new Set(user.custom_permissions));
        }
    }, [user]);
    // Update form when user prop changes
    (0, react_1.useEffect)(function () {
        if (user) {
            reset({
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                phone: user.phone || '',
                employee_id: user.employee_id || '',
                hire_date: user.hire_date ? user.hire_date.split('T')[0] : '',
                position: user.position || '',
                department: user.department || '',
                employment_type: user.employment_type || 'full_time',
                roles: user.roles || ['technician'],
                custom_permissions: user.custom_permissions || [],
                status: user.status || 'active',
                emergency_contact_name: user.emergency_contact_name || '',
                emergency_contact_phone: user.emergency_contact_phone || '',
                emergency_contact_relationship: user.emergency_contact_relationship || '',
                address_line1: user.address_line1 || '',
                address_line2: user.address_line2 || '',
                city: user.city || '',
                state: user.state || '',
                postal_code: user.postal_code || '',
                country: user.country || 'US',
                date_of_birth: user.date_of_birth ? user.date_of_birth.split('T')[0] : '',
                social_security_number: '',
                driver_license_number: '',
                driver_license_state: user.driver_license_state || '',
                driver_license_expiry: user.driver_license_expiry ? user.driver_license_expiry.split('T')[0] : '',
                qualifications: user.qualifications || [],
                technician_number: user.technician_number || '',
                pesticide_license_number: user.pesticide_license_number || '',
                license_expiration_date: user.license_expiration_date ? user.license_expiration_date.split('T')[0] : '',
            });
        }
    }, [user, reset]);
    var selectedRoles = watch('roles') || [];
    var qualifications = watch('qualifications') || [];
    // Get permissions from selected roles
    var getRolePermissions = function () {
        var permissions = new Set();
        selectedRoles.forEach(function (roleId) {
            var role = role_actions_1.PREDEFINED_ROLES.find(function (r) { return r.id === roleId; });
            if (role) {
                role.permissions.forEach(function (perm) {
                    if (perm.resource === '*' && perm.action === '*') {
                        // Admin has all permissions
                        RESOURCES.forEach(function (resource) {
                            ACTIONS.forEach(function (action) {
                                permissions.add("".concat(resource, ":").concat(action));
                            });
                        });
                    }
                    else {
                        permissions.add("".concat(perm.resource, ":").concat(perm.action));
                    }
                });
            }
        });
        return permissions;
    };
    var rolePermissions = getRolePermissions();
    var allPermissions = new Set(__spreadArray(__spreadArray([], rolePermissions, true), customPermissions, true));
    var toggleSection = function (section) {
        setExpandedSections(function (prev) {
            var next = new Set(prev);
            if (next.has(section)) {
                next.delete(section);
            }
            else {
                next.add(section);
            }
            return next;
        });
    };
    var addQualification = function () {
        if (newQualification.trim()) {
            var current = qualifications || [];
            setValue('qualifications', __spreadArray(__spreadArray([], current, true), [newQualification.trim()], false));
            setNewQualification('');
        }
    };
    var removeQualification = function (qual) {
        var current = qualifications || [];
        setValue('qualifications', current.filter(function (q) { return q !== qual; }));
    };
    var togglePermission = function (resource, action) {
        var perm = "".concat(resource, ":").concat(action);
        var next = new Set(customPermissions);
        if (next.has(perm)) {
            next.delete(perm);
        }
        else {
            next.add(perm);
        }
        setCustomPermissions(next);
        setValue('custom_permissions', Array.from(next));
    };
    var hasPermission = function (resource, action) {
        var perm = "".concat(resource, ":").concat(action);
        return allPermissions.has(perm);
    };
    var isRolePermission = function (resource, action) {
        var perm = "".concat(resource, ":").concat(action);
        return rolePermissions.has(perm);
    };
    var createUserMutation = (0, react_query_1.useMutation)({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_api_1.userApi.createUser(data)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setStatus({ type: 'success', message: 'User created successfully!' });
            setTimeout(function () {
                onSave();
            }, 1000);
        },
        onError: function (error) {
            logger_1.logger.error('Error creating user', error, 'UserManagementForm');
            setStatus({
                type: 'error',
                message: error.message || 'Failed to create user'
            });
        },
    });
    var updateUserMutation = (0, react_query_1.useMutation)({
        mutationFn: function (data) { return __awaiter(_this, void 0, void 0, function () {
            var updateData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(user === null || user === void 0 ? void 0 : user.id))
                            throw new Error('User ID is required');
                        updateData = __assign({}, data);
                        delete updateData.email;
                        // Convert empty strings to undefined for optional fields
                        Object.keys(updateData).forEach(function (key) {
                            if (updateData[key] === '' || updateData[key] === null) {
                                updateData[key] = undefined;
                            }
                        });
                        return [4 /*yield*/, user_api_1.userApi.updateUser(user.id, updateData)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        onSuccess: function () { return __awaiter(_this, void 0, void 0, function () {
            var currentUser, refreshedUser, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        queryClient.invalidateQueries({ queryKey: ['users'] });
                        queryClient.invalidateQueries({ queryKey: ['user', user === null || user === void 0 ? void 0 : user.id] });
                        currentUser = auth_1.useAuthStore.getState().user;
                        if (!(currentUser && user && currentUser.id === user.id)) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, auth_1.useAuthStore.getState().refreshUser()];
                    case 2:
                        _b.sent();
                        refreshedUser = auth_1.useAuthStore.getState().user;
                        logger_1.logger.debug('Refreshed current user data and token after update', {
                            userId: user === null || user === void 0 ? void 0 : user.id,
                            roles: refreshedUser === null || refreshedUser === void 0 ? void 0 : refreshedUser.roles,
                            permissionsCount: ((_a = refreshedUser === null || refreshedUser === void 0 ? void 0 : refreshedUser.permissions) === null || _a === void 0 ? void 0 : _a.length) || 0,
                            permissions: refreshedUser === null || refreshedUser === void 0 ? void 0 : refreshedUser.permissions
                        }, 'UserManagementForm');
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        logger_1.logger.error('Error refreshing user after update', error_1, 'UserManagementForm');
                        return [3 /*break*/, 4];
                    case 4:
                        setStatus({ type: 'success', message: 'User updated successfully!' });
                        setTimeout(function () {
                            onSave();
                        }, 1000);
                        return [2 /*return*/];
                }
            });
        }); },
        onError: function (error) {
            logger_1.logger.error('Error updating user', error, 'UserManagementForm');
            setStatus({
                type: 'error',
                message: error.message || 'Failed to update user'
            });
        },
    });
    var handleFormSubmit = function (data) { return __awaiter(_this, void 0, void 0, function () {
        var _error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setStatus(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    if (!isEditMode) return [3 /*break*/, 3];
                    return [4 /*yield*/, updateUserMutation.mutateAsync(data)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, createUserMutation.mutateAsync(data)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    _error_1 = _a.sent();
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var SectionHeader = function (_a) {
        var id = _a.id, title = _a.title, Icon = _a.icon;
        return ((0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: function () { return toggleSection(id); }, className: "w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)(Icon, { className: "h-5 w-5 text-gray-600" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900", children: title })] }), expandedSections.has(id) ? ((0, jsx_runtime_1.jsx)(lucide_react_1.ChevronUp, { className: "h-5 w-5 text-gray-500" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.ChevronDown, { className: "h-5 w-5 text-gray-500" }))] }));
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "max-w-5xl mx-auto", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white shadow-sm border border-gray-200 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "px-6 py-4 border-b border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onCancel, className: "p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { className: "h-5 w-5" }) }), (0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-gray-900", children: isEditMode ? 'Edit User' : 'Create New User' })] }) }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit(handleFormSubmit), className: "px-6 py-6 space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(SectionHeader, { id: "basic", title: "Basic Information", icon: lucide_react_1.User }), expandedSections.has('basic') && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-4 grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "first_name", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "First Name *", value: field.value, onChange: function (e) { return field.onChange(e.target.value); }, placeholder: "John", required: true }, (((_b = errors.first_name) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.first_name.message } : {}))));
                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "last_name", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Last Name *", value: field.value, onChange: function (e) { return field.onChange(e.target.value); }, placeholder: "Doe", required: true }, (((_b = errors.last_name) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.last_name.message } : {}))));
                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "email", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Email *", type: "email", value: field.value, onChange: function (e) { return field.onChange(e.target.value); }, placeholder: "user@example.com", required: true, disabled: isEditMode }, (((_b = errors.email) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.email.message } : {}))));
                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "phone", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Phone", type: "tel", value: field.value, onChange: function (e) { return field.onChange(e.target.value); }, placeholder: "(555) 123-4567" }, (((_b = errors.phone) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.phone.message } : {}))));
                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "employee_id", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Employee ID", value: field.value, onChange: function (e) { return field.onChange(e.target.value); }, placeholder: "EMP001" }, (((_b = errors.employee_id) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.employee_id.message } : {}))));
                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "hire_date", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Hire Date", type: "date", value: field.value, onChange: function (e) { return field.onChange(e.target.value); } }, (((_b = errors.hire_date) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.hire_date.message } : {}))));
                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "position", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Position", value: field.value, onChange: function (e) { return field.onChange(e.target.value); }, placeholder: "Senior Technician" }, (((_b = errors.position) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.position.message } : {}))));
                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "department", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Department", value: field.value, onChange: function (e) { return field.onChange(e.target.value); }, placeholder: "Field Operations" }, (((_b = errors.department) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.department.message } : {}))));
                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "employment_type", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Employment Type" }), (0, jsx_runtime_1.jsx)(Select_1.default, __assign({ value: field.value || 'full_time', onChange: function (value) { return field.onChange(value); }, options: [
                                                                { value: 'full_time', label: 'Full Time' },
                                                                { value: 'part_time', label: 'Part Time' },
                                                                { value: 'contractor', label: 'Contractor' },
                                                                { value: 'temporary', label: 'Temporary' },
                                                            ] }, (((_b = errors.employment_type) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.employment_type.message } : {})))] }));
                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "status", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Status" }), (0, jsx_runtime_1.jsx)(Select_1.default, __assign({ value: field.value, onChange: function (value) { return field.onChange(value); }, options: [
                                                                { value: 'active', label: 'Active' },
                                                                { value: 'inactive', label: 'Inactive' },
                                                                { value: 'suspended', label: 'Suspended' },
                                                            ] }, (((_b = errors.status) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.status.message } : {})))] }));
                                            } })] }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(SectionHeader, { id: "emergency", title: "Emergency Contact", icon: lucide_react_1.Phone }), expandedSections.has('emergency') && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-4 grid grid-cols-1 md:grid-cols-3 gap-4", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "emergency_contact_name", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Contact Name", value: field.value, onChange: function (e) { return field.onChange(e.target.value); }, placeholder: "Jane Doe" }, (((_b = errors.emergency_contact_name) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.emergency_contact_name.message } : {}))));
                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "emergency_contact_phone", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Contact Phone", type: "tel", value: field.value, onChange: function (e) { return field.onChange(e.target.value); }, placeholder: "(555) 123-4567" }, (((_b = errors.emergency_contact_phone) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.emergency_contact_phone.message } : {}))));
                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "emergency_contact_relationship", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Relationship", value: field.value, onChange: function (e) { return field.onChange(e.target.value); }, placeholder: "Spouse, Parent, etc." }, (((_b = errors.emergency_contact_relationship) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.emergency_contact_relationship.message } : {}))));
                                            } })] }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(SectionHeader, { id: "address", title: "Address Information", icon: lucide_react_1.MapPin }), expandedSections.has('address') && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-4 grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "address_line1", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Address Line 1", value: field.value, onChange: function (e) { return field.onChange(e.target.value); }, placeholder: "123 Main St", className: "md:col-span-2" }, (((_b = errors.address_line1) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.address_line1.message } : {}))));
                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "address_line2", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Address Line 2", value: field.value, onChange: function (e) { return field.onChange(e.target.value); }, placeholder: "Apt 4B", className: "md:col-span-2" }, (((_b = errors.address_line2) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.address_line2.message } : {}))));
                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "city", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "City", value: field.value, onChange: function (e) { return field.onChange(e.target.value); }, placeholder: "Pittsburgh" }, (((_b = errors.city) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.city.message } : {}))));
                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "state", control: control, render: function (_a) {
                                                var _b, _c;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "State", value: (_b = field.value) === null || _b === void 0 ? void 0 : _b.toUpperCase(), onChange: function (e) { return field.onChange(e.target.value.toUpperCase().slice(0, 2)); }, placeholder: "PA", maxLength: 2 }, (((_c = errors.state) === null || _c === void 0 ? void 0 : _c.message) ? { error: errors.state.message } : {}))));
                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "postal_code", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Postal Code", value: field.value, onChange: function (e) { return field.onChange(e.target.value); }, placeholder: "15213" }, (((_b = errors.postal_code) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.postal_code.message } : {}))));
                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "country", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Country", value: field.value, onChange: function (e) { return field.onChange(e.target.value); }, placeholder: "US" }, (((_b = errors.country) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.country.message } : {}))));
                                            } })] }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(SectionHeader, { id: "personal", title: "Personal Information", icon: lucide_react_1.Calendar }), expandedSections.has('personal') && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-4 grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "date_of_birth", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Date of Birth", type: "date", value: field.value, onChange: function (e) { return field.onChange(e.target.value); } }, (((_b = errors.date_of_birth) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.date_of_birth.message } : {}))));
                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "social_security_number", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Social Security Number", type: "text", value: field.value, onChange: function (e) {
                                                        var value = e.target.value.replace(/\D/g, '');
                                                        var formatted = value;
                                                        if (value.length > 3)
                                                            formatted = value.slice(0, 3) + '-' + value.slice(3);
                                                        if (value.length > 5)
                                                            formatted = formatted.slice(0, 6) + '-' + value.slice(5, 9);
                                                        field.onChange(formatted);
                                                    }, placeholder: "XXX-XX-XXXX", maxLength: 11 }, (((_b = errors.social_security_number) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.social_security_number.message } : {}))));
                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "driver_license_number", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Driver License Number", type: "text", value: field.value, onChange: function (e) { return field.onChange(e.target.value); }, placeholder: "D1234567" }, (((_b = errors.driver_license_number) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.driver_license_number.message } : {}))));
                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "driver_license_state", control: control, render: function (_a) {
                                                var _b, _c;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Driver License State", value: (_b = field.value) === null || _b === void 0 ? void 0 : _b.toUpperCase(), onChange: function (e) { return field.onChange(e.target.value.toUpperCase().slice(0, 2)); }, placeholder: "PA", maxLength: 2 }, (((_c = errors.driver_license_state) === null || _c === void 0 ? void 0 : _c.message) ? { error: errors.driver_license_state.message } : {}))));
                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "driver_license_expiry", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Driver License Expiry", type: "date", value: field.value, onChange: function (e) { return field.onChange(e.target.value); } }, (((_b = errors.driver_license_expiry) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.driver_license_expiry.message } : {}))));
                                            } })] }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(SectionHeader, { id: "qualifications", title: "Qualifications & Certifications", icon: lucide_react_1.Key }), expandedSections.has('qualifications') && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-4 space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)(Input_1.default, { type: "text", value: newQualification, onChange: function (e) { return setNewQualification(e.target.value); }, onKeyPress: function (e) {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            addQualification();
                                                        }
                                                    }, placeholder: "Enter qualification or certification", className: "flex-1" }), (0, jsx_runtime_1.jsx)(Button_1.default, { type: "button", variant: "secondary", onClick: addQualification, disabled: !newQualification.trim(), children: "Add" })] }), qualifications.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2", children: qualifications.map(function (qual) { return ((0, jsx_runtime_1.jsxs)("span", { className: "inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm", children: [qual, (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: function () { return removeQualification(qual); }, className: "text-purple-600 hover:text-purple-800", "aria-label": "Remove ".concat(qual), children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-4 w-4" }) })] }, qual)); }) })), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "technician_number", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Technician Number", value: field.value, onChange: function (e) { return field.onChange(e.target.value); }, placeholder: "TECH001" }, (((_b = errors.technician_number) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.technician_number.message } : {}))));
                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "pesticide_license_number", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "Pesticide License Number", value: field.value, onChange: function (e) { return field.onChange(e.target.value); }, placeholder: "LIC123456" }, (((_b = errors.pesticide_license_number) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.pesticide_license_number.message } : {}))));
                                            } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "license_expiration_date", control: control, render: function (_a) {
                                                var _b;
                                                var field = _a.field;
                                                return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ label: "License Expiration Date", type: "date", value: field.value, onChange: function (e) { return field.onChange(e.target.value); } }, (((_b = errors.license_expiration_date) === null || _b === void 0 ? void 0 : _b.message) ? { error: errors.license_expiration_date.message } : {}))));
                                            } })] }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(SectionHeader, { id: "roles", title: "Roles & Permissions", icon: lucide_react_1.Shield }), expandedSections.has('roles') && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-4 space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-sm font-medium text-gray-700 mb-3", children: ["Roles ", (0, jsx_runtime_1.jsx)("span", { className: "text-red-500", children: "*" })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: role_actions_1.PREDEFINED_ROLES.map(function (role) { return ((0, jsx_runtime_1.jsxs)("label", { className: "flex items-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: selectedRoles.includes(role.id), onChange: function (e) {
                                                                    var current = selectedRoles || [];
                                                                    if (e.target.checked) {
                                                                        setValue('roles', __spreadArray(__spreadArray([], current, true), [role.id], false));
                                                                    }
                                                                    else {
                                                                        setValue('roles', current.filter(function (r) { return r !== role.id; }));
                                                                    }
                                                                }, className: "rounded border-gray-300 text-purple-600 focus:ring-purple-500" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-700", children: role.name })] }, role.id)); }) }), errors.roles && ((0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-sm text-red-600", children: errors.roles.message }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-sm font-medium text-gray-700 mb-3", children: ["Custom Permissions", (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-500 ml-2", children: "(Grayed out permissions are inherited from roles)" })] }), (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto border border-gray-200 rounded-lg", children: (0, jsx_runtime_1.jsxs)("table", { className: "min-w-full text-sm", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { className: "bg-gray-50", children: [(0, jsx_runtime_1.jsx)("th", { className: "text-left py-2 px-3 font-medium text-gray-700 sticky left-0 bg-gray-50 z-10", children: "Resource" }), ACTIONS.map(function (action) { return ((0, jsx_runtime_1.jsx)("th", { className: "text-center py-2 px-2 font-medium text-gray-700 capitalize", children: action }, action)); })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: RESOURCES.map(function (resource) { return ((0, jsx_runtime_1.jsxs)("tr", { className: "border-t border-gray-200", children: [(0, jsx_runtime_1.jsx)("td", { className: "py-2 px-3 font-medium text-gray-900 capitalize sticky left-0 bg-white z-10", children: resource.replace('_', ' ') }), ACTIONS.map(function (action) {
                                                                            var hasPerm = hasPermission(resource, action);
                                                                            var isRolePerm = isRolePermission(resource, action);
                                                                            return ((0, jsx_runtime_1.jsx)("td", { className: "py-2 px-2 text-center", children: (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: function () { return togglePermission(resource, action); }, disabled: isRolePerm, className: "w-6 h-6 rounded border-2 flex items-center justify-center ".concat(hasPerm
                                                                                        ? isRolePerm
                                                                                            ? 'bg-gray-200 border-gray-400 text-gray-600 cursor-not-allowed'
                                                                                            : 'bg-green-100 border-green-500 text-green-700 hover:bg-green-200'
                                                                                        : 'bg-gray-100 border-gray-300 text-gray-400 hover:border-gray-400'), title: isRolePerm ? 'Inherited from role' : hasPerm ? 'Custom permission' : 'No permission', children: hasPerm && (0, jsx_runtime_1.jsx)("span", { className: "text-xs", children: "\u2713" }) }) }, action));
                                                                        })] }, resource)); }) })] }) })] })] }))] }), status && ((0, jsx_runtime_1.jsx)("div", { className: "p-3 rounded-lg text-sm ".concat(status.type === 'success'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-red-50 text-red-800 border border-red-200'), children: status.message })), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end space-x-3 pt-4 border-t border-gray-200", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { type: "button", variant: "secondary", onClick: onCancel, disabled: createUserMutation.isPending || updateUserMutation.isPending, children: "Cancel" }), (0, jsx_runtime_1.jsx)(Button_1.default, { type: "submit", variant: "primary", disabled: createUserMutation.isPending || updateUserMutation.isPending, loading: createUserMutation.isPending || updateUserMutation.isPending, children: isEditMode
                                        ? (updateUserMutation.isPending ? 'Updating...' : 'Update User')
                                        : (createUserMutation.isPending ? 'Creating...' : 'Create User') })] })] })] }) }));
}
