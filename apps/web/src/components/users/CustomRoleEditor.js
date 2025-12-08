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
exports.default = CustomRoleEditor;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var role_actions_1 = require("@/types/role-actions");
var RESOURCES = [
    'jobs', 'work_orders', 'customers', 'technicians', 'invoices',
    'reports', 'settings', 'users', 'inventory', 'financial',
];
var ACTIONS = [
    'view', 'create', 'update', 'delete', 'assign', 'approve',
    'export', 'import', 'manage',
];
function CustomRoleEditor(_a) {
    var onSave = _a.onSave, onDelete = _a.onDelete;
    var _b = (0, react_1.useState)(role_actions_1.PREDEFINED_ROLES), roles = _b[0], setRoles = _b[1];
    var _c = (0, react_1.useState)(null), editingRole = _c[0], setEditingRole = _c[1];
    var _d = (0, react_1.useState)({
        id: '',
        name: '',
        permissions: [],
        context: 'global',
    }), newRole = _d[0], setNewRole = _d[1];
    var handleCreateRole = function () {
        if (!newRole.name || !newRole.id) {
            alert('Please provide both ID and name for the role');
            return;
        }
        if (roles.find(function (r) { return r.id === newRole.id; })) {
            alert('A role with this ID already exists');
            return;
        }
        var role = {
            id: newRole.id,
            name: newRole.name,
            permissions: newRole.permissions || [],
            context: newRole.context || 'global',
        };
        setRoles(__spreadArray(__spreadArray([], roles, true), [role], false));
        onSave === null || onSave === void 0 ? void 0 : onSave(role);
        setNewRole({ id: '', name: '', permissions: [], context: 'global' });
    };
    var handleTogglePermission = function (resource, action, role) {
        var updatedPermissions = __spreadArray([], role.permissions, true);
        var existingIndex = updatedPermissions.findIndex(function (p) { return p.resource === resource && p.action === action; });
        if (existingIndex >= 0) {
            updatedPermissions.splice(existingIndex, 1);
        }
        else {
            updatedPermissions.push({ resource: resource, action: action });
        }
        var updatedRole = __assign(__assign({}, role), { permissions: updatedPermissions });
        setRoles(roles.map(function (r) { return r.id === role.id ? updatedRole : r; }));
        setEditingRole(updatedRole);
    };
    var handleDeleteRole = function (roleId) {
        if (role_actions_1.PREDEFINED_ROLES.find(function (r) { return r.id === roleId; })) {
            alert('Cannot delete predefined roles');
            return;
        }
        if (confirm('Are you sure you want to delete this role?')) {
            setRoles(roles.filter(function (r) { return r.id !== roleId; }));
            onDelete === null || onDelete === void 0 ? void 0 : onDelete(roleId);
        }
    };
    var hasPermission = function (role, resource, action) {
        return role.permissions.some(function (p) { return (p.resource === '*' || p.resource === resource) &&
            (p.action === '*' || p.action === action); });
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900", children: "Role Management" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500 mt-1", children: "Create and manage custom roles with granular permissions" })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white shadow-sm border border-gray-200 rounded-lg p-6", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-gray-900 mb-4", children: "Create New Role" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Role ID ", (0, jsx_runtime_1.jsx)("span", { className: "text-red-500", children: "*" })] }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: newRole.id, onChange: function (e) { return setNewRole(__assign(__assign({}, newRole), { id: e.target.value.toLowerCase().replace(/\s+/g, '-') })); }, placeholder: "e.g., custom-manager", className: "block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Role Name ", (0, jsx_runtime_1.jsx)("span", { className: "text-red-500", children: "*" })] }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: newRole.name, onChange: function (e) { return setNewRole(__assign(__assign({}, newRole), { name: e.target.value })); }, placeholder: "e.g., Custom Manager", className: "block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-end", children: (0, jsx_runtime_1.jsxs)("button", { onClick: handleCreateRole, className: "w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4 mr-2" }), "Create Role"] }) })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: roles.map(function (role) { return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white shadow-sm border border-gray-200 rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "px-6 py-4 border-b border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-gray-900", children: role.name }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-500 mt-1", children: ["ID: ", role.id, " \u2022 Context: ", role.context] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return setEditingRole((editingRole === null || editingRole === void 0 ? void 0 : editingRole.id) === role.id ? null : role); }, className: "p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md", title: "Edit Permissions", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Edit2, { className: "h-4 w-4" }) }), !role_actions_1.PREDEFINED_ROLES.find(function (r) { return r.id === role.id; }) && ((0, jsx_runtime_1.jsx)("button", { onClick: function () { return handleDeleteRole(role.id); }, className: "p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md", title: "Delete Role", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "h-4 w-4" }) }))] })] }) }), (editingRole === null || editingRole === void 0 ? void 0 : editingRole.id) === role.id && ((0, jsx_runtime_1.jsxs)("div", { className: "px-6 py-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "min-w-full text-sm", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { className: "text-left py-2 px-2 font-medium text-gray-700", children: "Resource" }), ACTIONS.map(function (action) { return ((0, jsx_runtime_1.jsx)("th", { className: "text-center py-2 px-2 font-medium text-gray-700 capitalize", children: action }, action)); })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: RESOURCES.map(function (resource) { return ((0, jsx_runtime_1.jsxs)("tr", { className: "border-t border-gray-200", children: [(0, jsx_runtime_1.jsx)("td", { className: "py-2 px-2 font-medium text-gray-900 capitalize", children: resource.replace('_', ' ') }), ACTIONS.map(function (action) {
                                                            var hasPerm = hasPermission(role, resource, action);
                                                            return ((0, jsx_runtime_1.jsx)("td", { className: "py-2 px-2 text-center", children: (0, jsx_runtime_1.jsx)("button", { onClick: function () { return handleTogglePermission(resource, action, role); }, className: "w-6 h-6 rounded border-2 flex items-center justify-center ".concat(hasPerm
                                                                        ? 'bg-green-100 border-green-500 text-green-700'
                                                                        : 'bg-gray-100 border-gray-300 text-gray-400 hover:border-gray-400'), children: hasPerm && (0, jsx_runtime_1.jsx)("span", { className: "text-xs", children: "\u2713" }) }) }, action));
                                                        })] }, resource)); }) })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-4 flex justify-end", children: (0, jsx_runtime_1.jsxs)("button", { onClick: function () {
                                            onSave === null || onSave === void 0 ? void 0 : onSave(role);
                                            setEditingRole(null);
                                        }, className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Save, { className: "h-4 w-4 mr-2" }), "Save Changes"] }) })] })), (editingRole === null || editingRole === void 0 ? void 0 : editingRole.id) !== role.id && ((0, jsx_runtime_1.jsx)("div", { className: "px-6 py-4", children: (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2", children: role.permissions.length === 0 ? ((0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-500", children: "No permissions assigned" })) : (role.permissions.map(function (perm, index) { return ((0, jsx_runtime_1.jsxs)("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800", children: [perm.resource === '*' ? '*' : perm.resource, ":", perm.action === '*' ? '*' : perm.action] }, index)); })) }) }))] }, role.id)); }) })] }));
}
