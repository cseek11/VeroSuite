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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UserList;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var user_api_1 = require("@/lib/user-api");
var lucide_react_1 = require("lucide-react");
var logger_1 = require("@/utils/logger");
function UserList(_a) {
    var _this = this;
    var onViewUser = _a.onViewUser, onEditUser = _a.onEditUser, onCreateUser = _a.onCreateUser;
    var _b = (0, react_1.useState)(''), searchTerm = _b[0], setSearchTerm = _b[1];
    var _c = (0, react_1.useState)('all'), selectedRole = _c[0], setSelectedRole = _c[1];
    var _d = (0, react_1.useState)('all'), selectedStatus = _d[0], setSelectedStatus = _d[1];
    var _e = (0, react_1.useState)(1), currentPage = _e[0], setCurrentPage = _e[1];
    var _f = (0, react_1.useState)('first_name'), sortBy = _f[0], setSortBy = _f[1];
    var _g = (0, react_1.useState)('asc'), sortOrder = _g[0], setSortOrder = _g[1];
    var itemsPerPage = 20;
    // Fetch users from backend API
    var _h = (0, react_query_1.useQuery)({
        queryKey: ['users'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var response, normalizedUsers, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, user_api_1.userApi.getUsers()];
                    case 1:
                        response = _a.sent();
                        normalizedUsers = ((response === null || response === void 0 ? void 0 : response.users) || []).map(function (user) {
                            var _a, _b, _c, _d, _e;
                            return (__assign(__assign({}, user), { roles: Array.isArray(user.roles) ? user.roles : [], status: (_a = user.status) !== null && _a !== void 0 ? _a : 'inactive', tenant_id: (_b = user.tenant_id) !== null && _b !== void 0 ? _b : '', password_hash: (_c = user.password_hash) !== null && _c !== void 0 ? _c : '', created_at: (_d = user.created_at) !== null && _d !== void 0 ? _d : new Date().toISOString(), updated_at: (_e = user.updated_at) !== null && _e !== void 0 ? _e : new Date().toISOString() }));
                        });
                        return [2 /*return*/, { users: normalizedUsers }];
                    case 2:
                        error_1 = _a.sent();
                        logger_1.logger.error('Error fetching users', error_1, 'UserList');
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        }); },
    }), usersResponse = _h.data, isLoading = _h.isLoading, error = _h.error, _refetch = _h.refetch;
    var allUsers = (usersResponse === null || usersResponse === void 0 ? void 0 : usersResponse.users) || [];
    // Apply client-side filtering and sorting
    var users = (0, react_1.useMemo)(function () {
        var filteredUsers = __spreadArray([], allUsers, true);
        // Apply search filter
        if (searchTerm) {
            var searchLower_1 = searchTerm.toLowerCase();
            filteredUsers = filteredUsers.filter(function (user) {
                var _a, _b, _c;
                return "".concat(user.first_name, " ").concat(user.last_name).toLowerCase().includes(searchLower_1) ||
                    ((_a = user.email) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchLower_1)) ||
                    ((_b = user.phone) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(searchLower_1)) ||
                    ((_c = user.employee_id) === null || _c === void 0 ? void 0 : _c.toLowerCase().includes(searchLower_1));
            });
        }
        // Apply role filter
        if (selectedRole !== 'all') {
            filteredUsers = filteredUsers.filter(function (user) { var _a; return (_a = user.roles) === null || _a === void 0 ? void 0 : _a.includes(selectedRole); });
        }
        // Apply status filter
        if (selectedStatus !== 'all') {
            filteredUsers = filteredUsers.filter(function (user) {
                return user.status === selectedStatus;
            });
        }
        // Apply sorting
        filteredUsers.sort(function (a, b) {
            var aValue = '';
            var bValue = '';
            if (sortBy === 'name') {
                aValue = "".concat(a.first_name, " ").concat(a.last_name);
                bValue = "".concat(b.first_name, " ").concat(b.last_name);
            }
            else {
                aValue = a[sortBy] || '';
                bValue = b[sortBy] || '';
            }
            if (sortOrder === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            }
            else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });
        // Apply pagination
        var from = (currentPage - 1) * itemsPerPage;
        var to = from + itemsPerPage;
        return filteredUsers.slice(from, to);
    }, [allUsers, searchTerm, selectedRole, selectedStatus, sortBy, sortOrder, currentPage, itemsPerPage]);
    var totalCount = (0, react_1.useMemo)(function () {
        var filteredUsers = __spreadArray([], allUsers, true);
        if (searchTerm) {
            var searchLower_2 = searchTerm.toLowerCase();
            filteredUsers = filteredUsers.filter(function (user) {
                var _a, _b, _c;
                return "".concat(user.first_name, " ").concat(user.last_name).toLowerCase().includes(searchLower_2) ||
                    ((_a = user.email) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchLower_2)) ||
                    ((_b = user.phone) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(searchLower_2)) ||
                    ((_c = user.employee_id) === null || _c === void 0 ? void 0 : _c.toLowerCase().includes(searchLower_2));
            });
        }
        if (selectedRole !== 'all') {
            filteredUsers = filteredUsers.filter(function (user) { var _a; return (_a = user.roles) === null || _a === void 0 ? void 0 : _a.includes(selectedRole); });
        }
        if (selectedStatus !== 'all') {
            filteredUsers = filteredUsers.filter(function (user) {
                return user.status === selectedStatus;
            });
        }
        return filteredUsers.length;
    }, [allUsers, searchTerm, selectedRole, selectedStatus]);
    var totalPages = Math.ceil(totalCount / itemsPerPage);
    var handleSort = function (column) {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        }
        else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };
    var getRoleColor = function (role) {
        var colors = {
            'admin': 'bg-purple-100 text-purple-800',
            'dispatcher': 'bg-blue-100 text-blue-800',
            'technician': 'bg-green-100 text-green-800',
            'owner': 'bg-yellow-100 text-yellow-800',
        };
        return colors[role] || 'bg-gray-100 text-gray-800';
    };
    var getStatusColor = function (status) {
        return status === 'active'
            ? 'bg-green-100 text-green-800'
            : status === 'inactive'
                ? 'bg-gray-100 text-gray-800'
                : 'bg-red-100 text-red-800';
    };
    // Get unique roles from all users
    var availableRoles = (0, react_1.useMemo)(function () {
        var roles = new Set();
        allUsers.forEach(function (user) {
            var _a;
            (_a = user.roles) === null || _a === void 0 ? void 0 : _a.forEach(function (role) { return roles.add(role); });
        });
        return Array.from(roles).sort();
    }, [allUsers]);
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-64", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" }) }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 border border-red-200 rounded-md p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-red-800", children: ["Error loading users: ", error instanceof Error ? error.message : 'Unknown error'] }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200", children: [(0, jsx_runtime_1.jsx)("div", { className: "px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-gray-900", children: "Users" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600", children: [totalCount, " total users"] })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: onCreateUser, className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4 mr-2" }), "Add User"] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "px-6 py-4 border-b border-gray-200 bg-gray-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search users by name, email, phone, or employee ID...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, className: "block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-sm" })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "sm:w-48", children: (0, jsx_runtime_1.jsxs)("select", { value: selectedRole, onChange: function (e) { return setSelectedRole(e.target.value); }, className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-sm", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "All Roles" }), availableRoles.map(function (role) { return ((0, jsx_runtime_1.jsx)("option", { value: role, children: role.charAt(0).toUpperCase() + role.slice(1) }, role)); })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "sm:w-48", children: (0, jsx_runtime_1.jsxs)("select", { value: selectedStatus, onChange: function (e) { return setSelectedStatus(e.target.value); }, className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-sm", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "All Status" }), (0, jsx_runtime_1.jsx)("option", { value: "active", children: "Active" }), (0, jsx_runtime_1.jsx)("option", { value: "inactive", children: "Inactive" }), (0, jsx_runtime_1.jsx)("option", { value: "suspended", children: "Suspended" })] }) })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "min-w-full divide-y divide-gray-200", children: [(0, jsx_runtime_1.jsx)("thead", { className: "bg-gray-50", children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { onClick: function () { return handleSort('name'); }, className: "px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: ["Name", sortBy === 'name' && ((0, jsx_runtime_1.jsx)("span", { className: "ml-1", children: sortOrder === 'asc' ? '↑' : '↓' }))] }) }), (0, jsx_runtime_1.jsx)("th", { className: "px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Email" }), (0, jsx_runtime_1.jsx)("th", { className: "px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Phone" }), (0, jsx_runtime_1.jsx)("th", { onClick: function () { return handleSort('roles'); }, className: "px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: ["Role", sortBy === 'roles' && ((0, jsx_runtime_1.jsx)("span", { className: "ml-1", children: sortOrder === 'asc' ? '↑' : '↓' }))] }) }), (0, jsx_runtime_1.jsx)("th", { className: "px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Employee ID" }), (0, jsx_runtime_1.jsx)("th", { onClick: function () { return handleSort('status'); }, className: "px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: ["Status", sortBy === 'status' && ((0, jsx_runtime_1.jsx)("span", { className: "ml-1", children: sortOrder === 'asc' ? '↑' : '↓' }))] }) }), (0, jsx_runtime_1.jsx)("th", { className: "px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { className: "bg-white divide-y divide-gray-200", children: users.length === 0 ? ((0, jsx_runtime_1.jsx)("tr", { children: (0, jsx_runtime_1.jsx)("td", { colSpan: 7, className: "px-3 py-8 text-center text-sm text-gray-500", children: "No users found" }) })) : (users.map(function (user) {
                                var _a, _b, _c;
                                return ((0, jsx_runtime_1.jsxs)("tr", { className: "hover:bg-gray-50", children: [(0, jsx_runtime_1.jsx)("td", { className: "px-3 py-2 whitespace-nowrap", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-4 w-4 text-purple-600" }) }), (0, jsx_runtime_1.jsx)("div", { className: "ml-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-sm font-medium text-gray-900", children: [user.first_name, " ", user.last_name] }) })] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-3 py-2 whitespace-nowrap", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-sm text-gray-900", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "h-3 w-3 mr-1 text-gray-400" }), user.email] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-3 py-2 whitespace-nowrap", children: user.phone ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-sm text-gray-900", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "h-3 w-3 mr-1 text-gray-400" }), user.phone] })) : ((0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-400", children: "\u2014" })) }), (0, jsx_runtime_1.jsx)("td", { className: "px-3 py-2 whitespace-nowrap", children: (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-1", children: (_a = user.roles) === null || _a === void 0 ? void 0 : _a.map(function (role) { return ((0, jsx_runtime_1.jsx)("span", { className: "inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ".concat(getRoleColor(role)), children: role }, role)); }) }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-3 py-2 whitespace-nowrap text-sm text-gray-500", children: user.employee_id || '—' }), (0, jsx_runtime_1.jsx)("td", { className: "px-3 py-2 whitespace-nowrap", children: (0, jsx_runtime_1.jsx)("span", { className: "inline-flex px-2 py-1 text-xs font-semibold rounded-full ".concat(getStatusColor((_b = user.status) !== null && _b !== void 0 ? _b : '')), children: (_c = user.status) !== null && _c !== void 0 ? _c : '—' }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-3 py-2 whitespace-nowrap text-right text-sm font-medium", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-end space-x-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return onViewUser(user); }, className: "text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50", title: "View User", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return onEditUser(user); }, className: "text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50", title: "Edit User", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Pencil, { className: "h-4 w-4" }) })] }) })] }, user.id));
                            })) })] }) }), totalPages > 1 && ((0, jsx_runtime_1.jsx)("div", { className: "px-6 py-4 border-t border-gray-200 bg-gray-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-700", children: ["Showing ", ((currentPage - 1) * itemsPerPage) + 1, " to ", Math.min(currentPage * itemsPerPage, totalCount), " of ", totalCount, " results"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return setCurrentPage(currentPage - 1); }, disabled: currentPage === 1, className: "px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed", children: "Previous" }), Array.from({ length: totalPages }, function (_, i) { return i + 1; }).map(function (page) { return ((0, jsx_runtime_1.jsx)("button", { onClick: function () { return setCurrentPage(page); }, className: "px-3 py-2 text-sm font-medium rounded-md ".concat(currentPage === page
                                        ? 'text-white bg-purple-600 border border-purple-600'
                                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'), children: page }, page)); }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setCurrentPage(currentPage + 1); }, disabled: currentPage === totalPages, className: "px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed", children: "Next" })] })] }) }))] }));
}
