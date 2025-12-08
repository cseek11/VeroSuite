"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UserManagement;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var UserList_1 = __importDefault(require("@/components/users/UserList"));
var UserDetail_1 = __importDefault(require("@/components/users/UserDetail"));
var UserManagementForm_1 = require("@/components/UserManagementForm");
var UserImportExport_1 = __importDefault(require("@/components/users/UserImportExport"));
var UserAnalytics_1 = __importDefault(require("@/components/users/UserAnalytics"));
var PermissionsAudit_1 = __importDefault(require("@/components/users/PermissionsAudit"));
var CustomRoleEditor_1 = __importDefault(require("@/components/users/CustomRoleEditor"));
var lucide_react_1 = require("lucide-react");
function UserManagement() {
    var _a = (0, react_1.useState)('list'), viewMode = _a[0], setViewMode = _a[1];
    var _b = (0, react_1.useState)(null), selectedUser = _b[0], setSelectedUser = _b[1];
    var _c = (0, react_1.useState)('users'), selectedTab = _c[0], setSelectedTab = _c[1];
    var handleViewUser = function (user) {
        setSelectedUser(user);
        setViewMode('detail');
    };
    var handleEditUser = function (user) {
        setSelectedUser(user);
        setViewMode('edit');
    };
    var handleCreateUser = function () {
        setSelectedUser(null);
        setViewMode('create');
    };
    var handleBackToList = function () {
        setViewMode('list');
        setSelectedUser(null);
    };
    var handleSaveUser = function () {
        setViewMode('list');
        setSelectedUser(null);
    };
    var renderContent = function () {
        // If we're in a user-specific view (detail, create, edit), show that
        if (viewMode === 'detail' && selectedUser) {
            return ((0, jsx_runtime_1.jsx)(UserDetail_1.default, { userId: selectedUser.id, onBack: handleBackToList, onEdit: handleEditUser }));
        }
        if (viewMode === 'create') {
            return ((0, jsx_runtime_1.jsx)(UserManagementForm_1.UserManagementForm, { onSave: handleSaveUser, onCancel: handleBackToList }));
        }
        if (viewMode === 'edit' && selectedUser) {
            return ((0, jsx_runtime_1.jsx)(UserManagementForm_1.UserManagementForm, { user: selectedUser, onSave: handleSaveUser, onCancel: handleBackToList }));
        }
        // Otherwise show tabbed interface
        return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-white shadow-sm border border-gray-200 rounded-lg", children: (0, jsx_runtime_1.jsx)("div", { className: "border-b border-gray-200", children: (0, jsx_runtime_1.jsxs)("nav", { className: "flex -mb-px", "aria-label": "Tabs", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: function () {
                                        setSelectedTab('users');
                                        setViewMode('list');
                                    }, className: "".concat(selectedTab === 'users'
                                        ? 'border-purple-500 text-purple-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', " whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center space-x-2"), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { children: "Users" })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setSelectedTab('analytics'); }, className: "".concat(selectedTab === 'analytics'
                                        ? 'border-purple-500 text-purple-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', " whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center space-x-2"), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { children: "Analytics" })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setSelectedTab('import-export'); }, className: "".concat(selectedTab === 'import-export'
                                        ? 'border-purple-500 text-purple-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', " whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center space-x-2"), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Upload, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { children: "Import/Export" })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setSelectedTab('permissions'); }, className: "".concat(selectedTab === 'permissions'
                                        ? 'border-purple-500 text-purple-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', " whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center space-x-2"), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { children: "Permissions Audit" })] }), (0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setSelectedTab('roles'); }, className: "".concat(selectedTab === 'roles'
                                        ? 'border-purple-500 text-purple-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', " whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center space-x-2"), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Key, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { children: "Roles" })] })] }) }) }), (0, jsx_runtime_1.jsxs)("div", { children: [selectedTab === 'users' && ((0, jsx_runtime_1.jsx)(UserList_1.default, { onViewUser: handleViewUser, onEditUser: handleEditUser, onCreateUser: handleCreateUser })), selectedTab === 'analytics' && (0, jsx_runtime_1.jsx)(UserAnalytics_1.default, {}), selectedTab === 'import-export' && (0, jsx_runtime_1.jsx)(UserImportExport_1.default, {}), selectedTab === 'permissions' && (0, jsx_runtime_1.jsx)(PermissionsAudit_1.default, {}), selectedTab === 'roles' && (0, jsx_runtime_1.jsx)(CustomRoleEditor_1.default, {})] })] }));
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gray-50 py-8", children: (0, jsx_runtime_1.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: renderContent() }) }));
}
