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
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var react_hook_form_1 = require("react-hook-form");
var zod_1 = require("@hookform/resolvers/zod");
var zod_2 = require("zod");
var useTechnicians_1 = require("../../hooks/useTechnicians");
var technician_1 = require("../../types/technician");
var user_api_1 = require("../../lib/user-api");
var Button_1 = __importDefault(require("../ui/Button"));
var Card_1 = __importDefault(require("../ui/Card"));
var Input_1 = __importDefault(require("../ui/Input"));
var Select_1 = __importDefault(require("../ui/Select"));
var CreateUserModal_1 = __importDefault(require("./CreateUserModal"));
var logger_1 = require("@/utils/logger");
var toast_1 = require("@/utils/toast");
// Form validation schema
var technicianFormSchema = zod_2.z.object({
    user_id: zod_2.z.string().uuid('User is required').optional(),
    employee_id: zod_2.z.string().min(1, 'Employee ID is required'),
    hire_date: zod_2.z.string().min(1, 'Hire date is required'),
    position: zod_2.z.string().min(1, 'Position is required'),
    department: zod_2.z.string().min(1, 'Department is required'),
    employment_type: zod_2.z.nativeEnum(technician_1.EmploymentType, { required_error: 'Employment type is required' }),
    status: zod_2.z.nativeEnum(technician_1.TechnicianStatus, { required_error: 'Status is required' }),
    emergency_contact_name: zod_2.z.string().min(1, 'Emergency contact name is required'),
    emergency_contact_phone: zod_2.z.string().min(1, 'Emergency contact phone is required'),
    emergency_contact_relationship: zod_2.z.string().min(1, 'Emergency contact relationship is required'),
    address_line1: zod_2.z.string().min(1, 'Address line 1 is required'),
    address_line2: zod_2.z.string().optional(),
    city: zod_2.z.string().min(1, 'City is required'),
    state: zod_2.z.string().min(1, 'State is required').length(2, 'State must be 2 characters'),
    postal_code: zod_2.z.string().min(1, 'Postal code is required'),
    country: zod_2.z.string().min(1, 'Country is required'),
    date_of_birth: zod_2.z.string().min(1, 'Date of birth is required'),
    social_security_number: zod_2.z.string().regex(/^\d{3}-\d{2}-\d{4}$/, 'SSN must be in format XXX-XX-XXXX'),
    driver_license_number: zod_2.z.string().optional(),
    driver_license_state: zod_2.z.string().optional(),
    driver_license_expiry: zod_2.z.string().optional(),
    qualifications: zod_2.z.array(zod_2.z.string()).optional(),
});
var TechnicianForm = function (_a) {
    var technicianId = _a.technicianId, _b = _a.isEdit, isEdit = _b === void 0 ? false : _b;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _c = (0, react_1.useState)([]), users = _c[0], setUsers = _c[1];
    var _d = (0, react_1.useState)(false), loadingUsers = _d[0], setLoadingUsers = _d[1];
    var _e = (0, react_1.useState)(false), showCreateUserModal = _e[0], setShowCreateUserModal = _e[1];
    var _f = (0, react_1.useState)([]), qualifications = _f[0], setQualifications = _f[1];
    var _g = (0, react_1.useState)(''), newQualification = _g[0], setNewQualification = _g[1];
    var _h = (0, useTechnicians_1.useTechnician)(technicianId || ''), technician = _h.data, loadingTechnician = _h.isLoading;
    var createMutation = (0, useTechnicians_1.useCreateTechnician)();
    var updateMutation = (0, useTechnicians_1.useUpdateTechnician)();
    var _j = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(technicianFormSchema),
        defaultValues: {
            employee_id: '',
            hire_date: '',
            position: '',
            department: '',
            employment_type: technician_1.EmploymentType.FULL_TIME,
            status: technician_1.TechnicianStatus.ACTIVE,
            emergency_contact_name: '',
            emergency_contact_phone: '',
            emergency_contact_relationship: '',
            address_line1: '',
            address_line2: '',
            city: '',
            state: '',
            postal_code: '',
            country: 'US',
            date_of_birth: '',
            social_security_number: '',
            driver_license_number: '',
            driver_license_state: '',
            driver_license_expiry: '',
            qualifications: [],
        },
    }), control = _j.control, handleSubmit = _j.handleSubmit, errors = _j.formState.errors, setValue = _j.setValue, watch = _j.watch;
    // Load users for the dropdown
    (0, react_1.useEffect)(function () {
        var loadUsers = function () { return __awaiter(void 0, void 0, void 0, function () {
            var data, usersList, syncResult, syncError_1, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        setLoadingUsers(true);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 9, 10, 11]);
                        return [4 /*yield*/, user_api_1.userApi.getUsers()];
                    case 2:
                        data = _b.sent();
                        usersList = data.users || [];
                        if (!(usersList.length === 0)) return [3 /*break*/, 7];
                        logger_1.logger.debug('No users found, attempting to sync from authentication system', {}, 'TechnicianForm');
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, user_api_1.userApi.syncUsers()];
                    case 4:
                        syncResult = _b.sent();
                        logger_1.logger.debug('User sync completed', { usersCount: ((_a = syncResult.users) === null || _a === void 0 ? void 0 : _a.length) || 0 }, 'TechnicianForm');
                        setUsers(syncResult.users || []);
                        return [3 /*break*/, 6];
                    case 5:
                        syncError_1 = _b.sent();
                        logger_1.logger.error('Error syncing users', syncError_1, 'TechnicianForm');
                        setUsers(usersList);
                        return [3 /*break*/, 6];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        setUsers(usersList);
                        _b.label = 8;
                    case 8: return [3 /*break*/, 11];
                    case 9:
                        error_1 = _b.sent();
                        logger_1.logger.error('Error loading users', error_1, 'TechnicianForm');
                        return [3 /*break*/, 11];
                    case 10:
                        setLoadingUsers(false);
                        return [7 /*endfinally*/];
                    case 11: return [2 /*return*/];
                }
            });
        }); };
        if (!isEdit) {
            loadUsers();
        }
    }, [isEdit]);
    // Populate form when editing
    (0, react_1.useEffect)(function () {
        var _a, _b, _c, _d;
        if (isEdit && technician) {
            setValue('employee_id', technician.employee_id || '');
            setValue('hire_date', (_b = (_a = technician.hire_date) === null || _a === void 0 ? void 0 : _a.split('T')[0]) !== null && _b !== void 0 ? _b : '');
            setValue('position', technician.position || '');
            setValue('department', technician.department || '');
            setValue('employment_type', technician.employment_type);
            setValue('status', technician.status);
            setValue('emergency_contact_name', technician.emergency_contact_name || '');
            setValue('emergency_contact_phone', technician.emergency_contact_phone || '');
            setValue('emergency_contact_relationship', technician.emergency_contact_relationship || '');
            setValue('address_line1', technician.address_line1 || '');
            setValue('address_line2', technician.address_line2 || '');
            setValue('city', technician.city || '');
            setValue('state', technician.state || '');
            setValue('postal_code', technician.postal_code || '');
            setValue('country', technician.country);
            setValue('date_of_birth', (_d = (_c = technician.date_of_birth) === null || _c === void 0 ? void 0 : _c.split('T')[0]) !== null && _d !== void 0 ? _d : '');
            setValue('social_security_number', technician.social_security_number || '');
            setValue('driver_license_number', technician.driver_license_number || '');
            setValue('driver_license_state', technician.driver_license_state || '');
            setValue('driver_license_expiry', technician.driver_license_expiry ? technician.driver_license_expiry.split('T')[0] : '');
        }
    }, [isEdit, technician, setValue]);
    var onSubmit = function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    if (!(isEdit && technicianId)) return [3 /*break*/, 2];
                    return [4 /*yield*/, updateMutation.mutateAsync({ id: technicianId, data: data })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, createMutation.mutateAsync(data)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    navigate('/technicians');
                    return [3 /*break*/, 6];
                case 5:
                    error_2 = _a.sent();
                    logger_1.logger.error('Failed to save technician', error_2, 'TechnicianForm');
                    toast_1.toast.error('Failed to save technician. Please try again.');
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleUserCreated = function (newUser) {
        setUsers(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newUser], false); });
        setValue('user_id', newUser.id);
        // Auto-populate employee_id if user has one
        if (newUser.employee_id) {
            setValue('employee_id', newUser.employee_id);
        }
        setShowCreateUserModal(false);
    };
    // Auto-populate employee_id when user is selected
    (0, react_1.useEffect)(function () {
        var subscription = watch(function (value, _a) {
            var name = _a.name;
            if (name === 'user_id' && value.user_id && !isEdit) {
                var selectedUser = users.find(function (u) { return u.id === value.user_id; });
                if (selectedUser === null || selectedUser === void 0 ? void 0 : selectedUser.employee_id) {
                    setValue('employee_id', selectedUser.employee_id);
                }
                else if (selectedUser && !selectedUser.employee_id) {
                    // User doesn't have employee_id, try to generate one
                    // This is optional - user can still manually enter one
                    user_api_1.userApi.getNextEmployeeId('technician').then(function (employeeId) {
                        setValue('employee_id', employeeId);
                    }).catch(function (error) {
                        logger_1.logger.error('Failed to generate employee ID', error, 'TechnicianForm');
                        // Continue without auto-populating - user can enter manually
                    });
                }
            }
        });
        return function () { return subscription.unsubscribe(); };
    }, [watch, setValue, users, isEdit]);
    // SSN formatting handler
    var formatSSN = function (value) {
        // Remove all non-digits
        var digits = value.replace(/\D/g, '');
        // Limit to 9 digits
        var limited = digits.slice(0, 9);
        // Format as XXX-XX-XXXX
        if (limited.length <= 3)
            return limited;
        if (limited.length <= 5)
            return "".concat(limited.slice(0, 3), "-").concat(limited.slice(3));
        return "".concat(limited.slice(0, 3), "-").concat(limited.slice(3, 5), "-").concat(limited.slice(5));
    };
    var handleSSNChange = function (value, onChange) {
        var formatted = formatSSN(value);
        onChange(formatted);
    };
    // Qualifications handlers
    var addQualification = function () {
        if (newQualification.trim() && !qualifications.includes(newQualification.trim())) {
            var updated = __spreadArray(__spreadArray([], qualifications, true), [newQualification.trim()], false);
            setQualifications(updated);
            setValue('qualifications', updated);
            setNewQualification('');
        }
    };
    var removeQualification = function (qual) {
        var updated = qualifications.filter(function (q) { return q !== qual; });
        setQualifications(updated);
        setValue('qualifications', updated);
    };
    var handleQualificationKeyPress = function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addQualification();
        }
    };
    if (loadingTechnician) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-64", children: (0, jsx_runtime_1.jsx)("div", { className: "text-lg", children: "Loading technician..." }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-4xl mx-auto space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-gray-900", children: isEdit ? 'Edit Technician' : 'Add New Technician' }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: isEdit ? 'Update technician information' : 'Create a new technician profile' })] }), (0, jsx_runtime_1.jsx)(Button_1.default, { onClick: function () { return navigate('/technicians'); }, variant: "outline", children: "Back to List" })] }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)(Card_1.default, { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold mb-4", children: "Basic Information" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [!isEdit && ((0, jsx_runtime_1.jsxs)("div", { className: "md:col-span-2", children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: ["User ", (0, jsx_runtime_1.jsx)("span", { className: "text-red-500", children: "*" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "user_id", control: control, rules: { required: 'User is required' }, render: function (_a) {
                                                            var _b;
                                                            var field = _a.field;
                                                            return ((0, jsx_runtime_1.jsx)(Select_1.default, { value: field.value || '', onChange: field.onChange, disabled: loadingUsers, placeholder: "Select a user...", options: users.map(function (user) { return ({
                                                                    value: user.id,
                                                                    label: "".concat(user.first_name, " ").concat(user.last_name, " (").concat(user.email, ")"),
                                                                }); }), className: "flex-1", error: (_b = errors.user_id) === null || _b === void 0 ? void 0 : _b.message }));
                                                        } }), (0, jsx_runtime_1.jsx)(Button_1.default, { type: "button", variant: "secondary", onClick: function () { return setShowCreateUserModal(true); }, className: "px-4 py-2 whitespace-nowrap flex-shrink-0", children: "+ New User" })] }), errors.user_id && ((0, jsx_runtime_1.jsx)("p", { className: "text-red-500 text-sm mt-1", children: errors.user_id.message }))] })), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "employee_id", control: control, render: function (_a) {
                                            var _b;
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ type: "text" }, field, { label: "Employee ID *", placeholder: "Enter employee ID", error: (_b = errors.employee_id) === null || _b === void 0 ? void 0 : _b.message })));
                                        } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "hire_date", control: control, render: function (_a) {
                                            var _b;
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ type: "date" }, field, { label: "Hire Date *", error: (_b = errors.hire_date) === null || _b === void 0 ? void 0 : _b.message })));
                                        } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "position", control: control, render: function (_a) {
                                            var _b;
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ type: "text" }, field, { label: "Position *", placeholder: "Enter position", error: (_b = errors.position) === null || _b === void 0 ? void 0 : _b.message })));
                                        } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "department", control: control, render: function (_a) {
                                            var _b;
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ type: "text" }, field, { label: "Department *", placeholder: "Enter department", error: (_b = errors.department) === null || _b === void 0 ? void 0 : _b.message })));
                                        } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "employment_type", control: control, render: function (_a) {
                                            var _b;
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsx)(Select_1.default, { value: field.value || technician_1.EmploymentType.FULL_TIME, onChange: field.onChange, label: "Employment Type *", options: [
                                                    { value: technician_1.EmploymentType.FULL_TIME, label: 'Full Time' },
                                                    { value: technician_1.EmploymentType.PART_TIME, label: 'Part Time' },
                                                    { value: technician_1.EmploymentType.CONTRACTOR, label: 'Contractor' },
                                                    { value: technician_1.EmploymentType.TEMPORARY, label: 'Temporary' },
                                                ], error: (_b = errors.employment_type) === null || _b === void 0 ? void 0 : _b.message }));
                                        } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "status", control: control, render: function (_a) {
                                            var _b;
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsx)(Select_1.default, { value: field.value || technician_1.TechnicianStatus.ACTIVE, onChange: field.onChange, label: "Status *", options: [
                                                    { value: technician_1.TechnicianStatus.ACTIVE, label: 'Active' },
                                                    { value: technician_1.TechnicianStatus.INACTIVE, label: 'Inactive' },
                                                    { value: technician_1.TechnicianStatus.TERMINATED, label: 'Terminated' },
                                                    { value: technician_1.TechnicianStatus.ON_LEAVE, label: 'On Leave' },
                                                ], error: (_b = errors.status) === null || _b === void 0 ? void 0 : _b.message }));
                                        } })] })] }), (0, jsx_runtime_1.jsxs)(Card_1.default, { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold mb-4", children: "Emergency Contact" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "emergency_contact_name", control: control, render: function (_a) {
                                            var _b;
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ type: "text" }, field, { label: "Contact Name *", placeholder: "Enter contact name", error: (_b = errors.emergency_contact_name) === null || _b === void 0 ? void 0 : _b.message })));
                                        } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "emergency_contact_phone", control: control, render: function (_a) {
                                            var _b;
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ type: "tel" }, field, { label: "Contact Phone *", placeholder: "Enter phone number", error: (_b = errors.emergency_contact_phone) === null || _b === void 0 ? void 0 : _b.message })));
                                        } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "emergency_contact_relationship", control: control, render: function (_a) {
                                            var _b;
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ type: "text" }, field, { label: "Relationship *", placeholder: "e.g., Spouse, Parent", error: (_b = errors.emergency_contact_relationship) === null || _b === void 0 ? void 0 : _b.message })));
                                        } })] })] }), (0, jsx_runtime_1.jsxs)(Card_1.default, { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold mb-4", children: "Address Information" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "address_line1", control: control, render: function (_a) {
                                            var _b;
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ type: "text" }, field, { label: "Address Line 1 *", placeholder: "Enter address", error: (_b = errors.address_line1) === null || _b === void 0 ? void 0 : _b.message, className: "md:col-span-2" })));
                                        } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "address_line2", control: control, render: function (_a) {
                                            var _b;
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ type: "text" }, field, { label: "Address Line 2", placeholder: "Enter apartment, suite, etc.", error: (_b = errors.address_line2) === null || _b === void 0 ? void 0 : _b.message, className: "md:col-span-2" })));
                                        } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "city", control: control, render: function (_a) {
                                            var _b;
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ type: "text" }, field, { label: "City *", placeholder: "Enter city", error: (_b = errors.city) === null || _b === void 0 ? void 0 : _b.message })));
                                        } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "state", control: control, render: function (_a) {
                                            var _b;
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ type: "text" }, field, { label: "State *", placeholder: "Enter state (e.g., PA)", maxLength: 2, error: (_b = errors.state) === null || _b === void 0 ? void 0 : _b.message })));
                                        } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "postal_code", control: control, render: function (_a) {
                                            var _b;
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ type: "text" }, field, { label: "Postal Code *", placeholder: "Enter postal code", error: (_b = errors.postal_code) === null || _b === void 0 ? void 0 : _b.message })));
                                        } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "country", control: control, render: function (_a) {
                                            var _b;
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ type: "text" }, field, { label: "Country *", placeholder: "Enter country", error: (_b = errors.country) === null || _b === void 0 ? void 0 : _b.message })));
                                        } })] })] }), (0, jsx_runtime_1.jsxs)(Card_1.default, { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold mb-4", children: "Personal Information" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "date_of_birth", control: control, render: function (_a) {
                                            var _b;
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ type: "date" }, field, { label: "Date of Birth *", error: (_b = errors.date_of_birth) === null || _b === void 0 ? void 0 : _b.message })));
                                        } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "social_security_number", control: control, render: function (_a) {
                                            var _b;
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ type: "text" }, field, { value: field.value || '', onChange: function (e) { return handleSSNChange(e.target.value, field.onChange); }, label: "Social Security Number *", placeholder: "XXX-XX-XXXX", maxLength: 11, error: (_b = errors.social_security_number) === null || _b === void 0 ? void 0 : _b.message })));
                                        } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "driver_license_number", control: control, render: function (_a) {
                                            var _b;
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ type: "text" }, field, { label: "Driver License Number", placeholder: "Enter license number", error: (_b = errors.driver_license_number) === null || _b === void 0 ? void 0 : _b.message })));
                                        } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "driver_license_state", control: control, render: function (_a) {
                                            var _b;
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ type: "text" }, field, { label: "Driver License State", placeholder: "Enter state", error: (_b = errors.driver_license_state) === null || _b === void 0 ? void 0 : _b.message })));
                                        } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "driver_license_expiry", control: control, render: function (_a) {
                                            var _b;
                                            var field = _a.field;
                                            return ((0, jsx_runtime_1.jsx)(Input_1.default, __assign({ type: "date" }, field, { label: "Driver License Expiry", error: (_b = errors.driver_license_expiry) === null || _b === void 0 ? void 0 : _b.message })));
                                        } })] })] }), (0, jsx_runtime_1.jsxs)(Card_1.default, { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold mb-4", children: "Qualifications & Certifications" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)(Input_1.default, { type: "text", value: newQualification, onChange: function (e) { return setNewQualification(e.target.value); }, onKeyPress: handleQualificationKeyPress, placeholder: "Enter qualification or certification", className: "flex-1" }), (0, jsx_runtime_1.jsx)(Button_1.default, { type: "button", variant: "secondary", onClick: addQualification, disabled: !newQualification.trim(), children: "Add" })] }), qualifications.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2", children: qualifications.map(function (qual) { return ((0, jsx_runtime_1.jsxs)("span", { className: "inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm", children: [qual, (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: function () { return removeQualification(qual); }, className: "text-purple-600 hover:text-purple-800", "aria-label": "Remove ".concat(qual), children: "\u00D7" })] }, qual)); }) })), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "Add qualifications, certifications, or specializations that can be used for filtering technicians." })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end space-x-4", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { type: "button", onClick: function () { return navigate('/technicians'); }, variant: "outline", children: "Cancel" }), (0, jsx_runtime_1.jsx)(Button_1.default, { type: "submit", variant: "primary", disabled: createMutation.isPending || updateMutation.isPending, children: createMutation.isPending || updateMutation.isPending
                                    ? 'Saving...'
                                    : isEdit
                                        ? 'Update Technician'
                                        : 'Create Technician' })] })] }), (0, jsx_runtime_1.jsx)(CreateUserModal_1.default, { isOpen: showCreateUserModal, onClose: function () { return setShowCreateUserModal(false); }, onUserCreated: handleUserCreated })] }));
};
exports.default = TechnicianForm;
