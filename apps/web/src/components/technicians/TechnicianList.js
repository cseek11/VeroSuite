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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var useTechnicians_1 = require("../../hooks/useTechnicians");
var technician_1 = require("../../types/technician");
var Button_1 = __importDefault(require("../ui/Button"));
var Card_1 = __importDefault(require("../ui/Card"));
var Input_1 = __importDefault(require("../ui/Input"));
var logger_1 = require("@/utils/logger");
var toast_1 = require("@/utils/toast");
var TechnicianList = function () {
    var _a;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var initialFilters = {
        search: '',
        department: '',
        position: '',
        page: 1,
        limit: 20,
    };
    var _b = (0, react_1.useState)(initialFilters), filters = _b[0], setFilters = _b[1];
    var _c = (0, useTechnicians_1.useTechnicians)(__assign(__assign({}, filters), (filters.status ? { status: filters.status } : {}))), data = _c.data, isLoading = _c.isLoading, error = _c.error, refetch = _c.refetch;
    var deleteTechnicianMutation = (0, useTechnicians_1.useDeleteTechnician)();
    var handleSearch = function (e) {
        e.preventDefault();
        setFilters(function (prev) { return (__assign(__assign({}, prev), { page: 1 })); });
        refetch();
    };
    var handleFilterChange = function (key, value) {
        setFilters(function (prev) {
            var _a;
            if (key === 'status') {
                var next = __assign(__assign({}, prev), { page: 1 });
                if (value) {
                    return __assign(__assign({}, next), { status: value });
                }
                var status_1 = next.status, rest = __rest(next, ["status"]);
                return rest;
            }
            if (key === 'employment_type') {
                var next = __assign(__assign({}, prev), { page: 1 });
                if (value) {
                    return __assign(__assign({}, next), { employment_type: value });
                }
                var employment_type = next.employment_type, rest = __rest(next, ["employment_type"]);
                return rest;
            }
            return __assign(__assign({}, prev), (_a = {}, _a[key] = value, _a.page = 1, _a));
        });
    };
    var handleDelete = function (id, name) { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!window.confirm("Are you sure you want to delete ".concat(name, "?"))) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, deleteTechnicianMutation.mutateAsync(id)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    logger_1.logger.error('Failed to delete technician', error_1, 'TechnicianList');
                    toast_1.toast.error('Failed to delete technician. Please try again.');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var getStatusBadge = function (status) {
        var _a;
        var statusColors = (_a = {},
            _a[technician_1.TechnicianStatus.ACTIVE] = 'bg-green-100 text-green-800',
            _a[technician_1.TechnicianStatus.INACTIVE] = 'bg-gray-100 text-gray-800',
            _a[technician_1.TechnicianStatus.TERMINATED] = 'bg-red-100 text-red-800',
            _a[technician_1.TechnicianStatus.ON_LEAVE] = 'bg-yellow-100 text-yellow-800',
            _a);
        return ((0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 rounded-full text-xs font-medium ".concat(statusColors[status]), children: status.replace('_', ' ').toUpperCase() }));
    };
    var getEmploymentTypeBadge = function (type) {
        var _a;
        var typeColors = (_a = {},
            _a[technician_1.EmploymentType.FULL_TIME] = 'bg-blue-100 text-blue-800',
            _a[technician_1.EmploymentType.PART_TIME] = 'bg-purple-100 text-purple-800',
            _a[technician_1.EmploymentType.CONTRACTOR] = 'bg-orange-100 text-orange-800',
            _a[technician_1.EmploymentType.TEMPORARY] = 'bg-pink-100 text-pink-800',
            _a);
        return ((0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 rounded-full text-xs font-medium ".concat(typeColors[type]), children: type.replace('_', ' ').toUpperCase() }));
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-64", children: (0, jsx_runtime_1.jsx)("div", { className: "text-lg", children: "Loading technicians..." }) }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-red-600 mb-4", children: "Error loading technicians" }), (0, jsx_runtime_1.jsx)(Button_1.default, { onClick: function () { return refetch(); }, variant: "outline", children: "Try Again" })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-gray-900", children: "Technicians" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Manage your technician team" })] }), (0, jsx_runtime_1.jsx)(Button_1.default, { onClick: function () { return navigate('/technicians/new'); }, variant: "primary", children: "Add Technician" })] }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSearch, className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4", children: [(0, jsx_runtime_1.jsx)(Input_1.default, { type: "text", placeholder: "Search technicians...", value: filters.search, onChange: function (e) { return handleFilterChange('search', e.target.value); }, className: "crm-input" }), (0, jsx_runtime_1.jsxs)("select", { value: filters.status, onChange: function (e) { return handleFilterChange('status', e.target.value); }, className: "crm-input", children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "All Statuses" }), (0, jsx_runtime_1.jsx)("option", { value: technician_1.TechnicianStatus.ACTIVE, children: "Active" }), (0, jsx_runtime_1.jsx)("option", { value: technician_1.TechnicianStatus.INACTIVE, children: "Inactive" }), (0, jsx_runtime_1.jsx)("option", { value: technician_1.TechnicianStatus.TERMINATED, children: "Terminated" }), (0, jsx_runtime_1.jsx)("option", { value: technician_1.TechnicianStatus.ON_LEAVE, children: "On Leave" })] }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "text", placeholder: "Department", value: filters.department, onChange: function (e) { return handleFilterChange('department', e.target.value); }, className: "crm-input" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "text", placeholder: "Position", value: filters.position, onChange: function (e) { return handleFilterChange('position', e.target.value); }, className: "crm-input" }), (0, jsx_runtime_1.jsxs)("select", { value: filters.employment_type, onChange: function (e) { return handleFilterChange('employment_type', e.target.value); }, className: "crm-input", children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "All Types" }), (0, jsx_runtime_1.jsx)("option", { value: technician_1.EmploymentType.FULL_TIME, children: "Full Time" }), (0, jsx_runtime_1.jsx)("option", { value: technician_1.EmploymentType.PART_TIME, children: "Part Time" }), (0, jsx_runtime_1.jsx)("option", { value: technician_1.EmploymentType.CONTRACTOR, children: "Contractor" }), (0, jsx_runtime_1.jsx)("option", { value: technician_1.EmploymentType.TEMPORARY, children: "Temporary" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { type: "submit", variant: "primary", children: "Search" }), (0, jsx_runtime_1.jsx)(Button_1.default, { type: "button", variant: "outline", onClick: function () { return setFilters(initialFilters); }, children: "Clear" })] })] }) }), (0, jsx_runtime_1.jsxs)(Card_1.default, { children: [!(data === null || data === void 0 ? void 0 : data.technicians) || data.technicians.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-500 mb-4", children: "No technicians found" }), (0, jsx_runtime_1.jsx)(Button_1.default, { onClick: function () { return navigate('/technicians/new'); }, variant: "primary", children: "Add First Technician" })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "min-w-full divide-y divide-gray-200", children: [(0, jsx_runtime_1.jsx)("thead", { className: "bg-gray-50", children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Technician" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Employee ID" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Position" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Department" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Status" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Type" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { className: "bg-white divide-y divide-gray-200", children: ((data === null || data === void 0 ? void 0 : data.technicians) || []).map(function (technician) {
                                        var _a, _b, _c, _d, _e, _f, _g;
                                        return ((0, jsx_runtime_1.jsxs)("tr", { className: "hover:bg-gray-50", children: [(0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0 h-10 w-10", children: (0, jsx_runtime_1.jsx)("div", { className: "h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)("span", { className: "text-sm font-medium text-purple-600", children: [(_b = (_a = technician.user) === null || _a === void 0 ? void 0 : _a.first_name) === null || _b === void 0 ? void 0 : _b[0], (_d = (_c = technician.user) === null || _c === void 0 ? void 0 : _c.last_name) === null || _d === void 0 ? void 0 : _d[0]] }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "ml-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-sm font-medium text-gray-900", children: [(_e = technician.user) === null || _e === void 0 ? void 0 : _e.first_name, " ", (_f = technician.user) === null || _f === void 0 ? void 0 : _f.last_name] }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500", children: (_g = technician.user) === null || _g === void 0 ? void 0 : _g.email })] })] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: technician.employee_id || '-' }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: technician.position || '-' }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: technician.department || '-' }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: getStatusBadge(technician.status) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: getEmploymentTypeBadge(technician.employment_type) }), (0, jsx_runtime_1.jsxs)("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { onClick: function () { return navigate("/technicians/".concat(technician.id)); }, variant: "outline", size: "sm", children: "View" }), (0, jsx_runtime_1.jsx)(Button_1.default, { onClick: function () { return navigate("/technicians/".concat(technician.id, "/edit")); }, variant: "outline", size: "sm", children: "Edit" }), (0, jsx_runtime_1.jsx)(Button_1.default, { onClick: function () { var _a, _b; return handleDelete(technician.id, "".concat((_a = technician.user) === null || _a === void 0 ? void 0 : _a.first_name, " ").concat((_b = technician.user) === null || _b === void 0 ? void 0 : _b.last_name)); }, variant: "danger", size: "sm", children: "Delete" })] })] }, technician.id));
                                    }) })] }) })), data && data.total_pages > 1 && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between px-6 py-3 border-t border-gray-200", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-700", children: filters.page && filters.limit ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["Showing ", ((filters.page - 1) * filters.limit) + 1, " to ", Math.min(filters.page * filters.limit, data.total), " of ", data.total, " results"] })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: "Showing results" })) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { onClick: function () { return setFilters(function (prev) { var _a; return (__assign(__assign({}, prev), { page: ((_a = prev.page) !== null && _a !== void 0 ? _a : 2) - 1 })); }); }, disabled: filters.page === 1 || !filters.page, variant: "outline", size: "sm", children: "Previous" }), (0, jsx_runtime_1.jsx)(Button_1.default, { onClick: function () { return setFilters(function (prev) { var _a; return (__assign(__assign({}, prev), { page: ((_a = prev.page) !== null && _a !== void 0 ? _a : 0) + 1 })); }); }, disabled: ((_a = filters.page) !== null && _a !== void 0 ? _a : 0) >= data.total_pages, variant: "outline", size: "sm", children: "Next" })] })] }))] })] }));
};
exports.default = TechnicianList;
