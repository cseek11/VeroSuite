"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PermissionsAudit;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var lucide_react_1 = require("lucide-react");
var user_api_1 = require("@/lib/user-api");
var role_actions_1 = require("@/types/role-actions");
function PermissionsAudit(_a) {
    var _this = this;
    var userId = _a.userId;
    var _b = (0, react_1.useState)(''), searchTerm = _b[0], setSearchTerm = _b[1];
    var _c = (0, react_1.useState)('all'), selectedResource = _c[0], setSelectedResource = _c[1];
    var _d = (0, react_1.useState)('all'), selectedAction = _d[0], setSelectedAction = _d[1];
    var _e = (0, react_query_1.useQuery)({
        queryKey: ['users'],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_api_1.userApi.getUsers()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
    }), usersResponse = _e.data, isLoading = _e.isLoading, error = _e.error;
    var users = (usersResponse === null || usersResponse === void 0 ? void 0 : usersResponse.users) || [];
    // Build permissions map
    var userPermissions = users.map(function (user) {
        var _a;
        var permissions = [];
        (_a = user.roles) === null || _a === void 0 ? void 0 : _a.forEach(function (roleId) {
            var role = role_actions_1.PREDEFINED_ROLES.find(function (r) { return r.id === roleId; });
            if (role) {
                role.permissions.forEach(function (perm) {
                    if (perm.resource === '*' && perm.action === '*') {
                        // Admin has all permissions
                        permissions.push({ resource: '*', action: '*' });
                    }
                    else if (!permissions.find(function (p) { return p.resource === perm.resource && p.action === perm.action; })) {
                        permissions.push({ resource: perm.resource, action: perm.action });
                    }
                });
            }
        });
        return {
            userId: user.id,
            userName: "".concat(user.first_name, " ").concat(user.last_name),
            email: user.email,
            roles: user.roles || [],
            permissions: permissions,
        };
    });
    // Get unique resources and actions
    var allResources = new Set();
    var allActions = new Set();
    userPermissions.forEach(function (up) {
        up.permissions.forEach(function (p) {
            if (p.resource !== '*')
                allResources.add(p.resource);
            if (p.action !== '*')
                allActions.add(p.action);
        });
    });
    // Filter users
    var filteredUsers = userPermissions.filter(function (up) {
        if (userId && up.userId !== userId)
            return false;
        if (searchTerm) {
            var searchLower = searchTerm.toLowerCase();
            if (!up.userName.toLowerCase().includes(searchLower) &&
                !up.email.toLowerCase().includes(searchLower)) {
                return false;
            }
        }
        if (selectedResource !== 'all') {
            var hasResource = up.permissions.some(function (p) {
                return p.resource === '*' || p.resource === selectedResource;
            });
            if (!hasResource)
                return false;
        }
        if (selectedAction !== 'all') {
            var hasAction = up.permissions.some(function (p) {
                return p.action === '*' || p.action === selectedAction;
            });
            if (!hasAction)
                return false;
        }
        return true;
    });
    var hasPermission = function (userPerms, resource, action) {
        return userPerms.permissions.some(function (p) {
            return (p.resource === '*' || p.resource === resource) &&
                (p.action === '*' || p.action === action);
        });
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-32", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" }) }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 border border-red-200 rounded-md p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-red-800 text-sm", children: ["Error loading permissions: ", error instanceof Error ? error.message : 'Unknown error'] }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900", children: "Permissions Audit" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500 mt-1", children: "Review who has access to what resources and actions" })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white shadow-sm border border-gray-200 rounded-lg p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Search" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, placeholder: "Search by name or email...", className: "block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Resource" }), (0, jsx_runtime_1.jsxs)("select", { value: selectedResource, onChange: function (e) { return setSelectedResource(e.target.value); }, className: "block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "All Resources" }), Array.from(allResources).sort().map(function (resource) { return ((0, jsx_runtime_1.jsx)("option", { value: resource, children: resource }, resource)); })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Action" }), (0, jsx_runtime_1.jsxs)("select", { value: selectedAction, onChange: function (e) { return setSelectedAction(e.target.value); }, className: "block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "All Actions" }), Array.from(allActions).sort().map(function (action) { return ((0, jsx_runtime_1.jsx)("option", { value: action, children: action }, action)); })] })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden", children: [(0, jsx_runtime_1.jsx)("div", { className: "px-6 py-4 border-b border-gray-200", children: (0, jsx_runtime_1.jsxs)("h4", { className: "text-sm font-medium text-gray-900", children: ["Access Matrix (", filteredUsers.length, " users)"] }) }), (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "min-w-full divide-y divide-gray-200", children: [(0, jsx_runtime_1.jsx)("thead", { className: "bg-gray-50", children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10", children: "User" }), (0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Roles" }), Array.from(allResources).sort().map(function (resource) { return ((0, jsx_runtime_1.jsx)("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: resource }, resource)); })] }) }), (0, jsx_runtime_1.jsx)("tbody", { className: "bg-white divide-y divide-gray-200", children: filteredUsers.map(function (userPerm) { return ((0, jsx_runtime_1.jsxs)("tr", { className: "hover:bg-gray-50", children: [(0, jsx_runtime_1.jsx)("td", { className: "px-4 py-3 whitespace-nowrap sticky left-0 bg-white z-10", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-gray-900", children: userPerm.userName }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500", children: userPerm.email })] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-4 py-3 whitespace-nowrap", children: (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-1", children: userPerm.roles.map(function (role) { return ((0, jsx_runtime_1.jsx)("span", { className: "inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-800", children: role }, role)); }) }) }), Array.from(allResources).sort().map(function (resource) {
                                                var canView = hasPermission(userPerm, resource, 'view');
                                                var canEdit = hasPermission(userPerm, resource, 'update') || hasPermission(userPerm, resource, 'edit');
                                                var canDelete = hasPermission(userPerm, resource, 'delete');
                                                var hasAll = hasPermission(userPerm, '*', '*');
                                                return ((0, jsx_runtime_1.jsx)("td", { className: "px-4 py-3 whitespace-nowrap", children: hasAll ? ((0, jsx_runtime_1.jsx)("span", { className: "text-xs text-green-600 font-medium", children: "All" })) : ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [canView && (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-blue-500" }), canEdit && (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-yellow-500" }), canDelete && (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-red-500" }), !canView && !canEdit && !canDelete && ((0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-4 w-4 text-gray-300" }))] })) }, resource));
                                            })] }, userPerm.userId)); }) })] }) })] }), filteredUsers.length === 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8 text-gray-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-12 w-12 mx-auto mb-4 text-gray-400" }), (0, jsx_runtime_1.jsx)("p", { children: "No users match the current filters" })] }))] }));
}
