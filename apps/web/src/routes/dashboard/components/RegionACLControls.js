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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionACLControls = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var useRegionPermissions_1 = require("@/hooks/useRegionPermissions");
var RegionACLControls = function (_a) {
    var regionId = _a.regionId, userId = _a.userId;
    var _b = (0, useRegionPermissions_1.useRegionPermissions)({ regionId: regionId, userId: userId }), acls = _b.acls, loading = _b.loading, canShare = _b.canShare, setACL = _b.setACL, removeACL = _b.removeACL;
    var _c = (0, react_1.useState)(false), showAddForm = _c[0], setShowAddForm = _c[1];
    var _d = (0, react_1.useState)('user'), principalType = _d[0], setPrincipalType = _d[1];
    var _e = (0, react_1.useState)(''), principalId = _e[0], setPrincipalId = _e[1];
    var _f = (0, react_1.useState)({
        read: true,
        edit: false,
        share: false
    }), permissions = _f[0], setPermissions = _f[1];
    var handleAddACL = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!principalId)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, setACL(principalType, principalId, permissions)];
                case 2:
                    _a.sent();
                    setShowAddForm(false);
                    setPrincipalId('');
                    setPermissions({ read: true, edit: false, share: false });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Failed to add ACL:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleRemoveACL = function (aclId) { return __awaiter(void 0, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!window.confirm('Are you sure you want to remove this permission?')) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, removeACL(aclId)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('Failed to remove ACL:', error_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    if (loading) {
        return (0, jsx_runtime_1.jsx)("div", { className: "p-4", children: "Loading permissions..." });
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "region-acl-controls p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold", children: "Region Permissions" }), canShare && ((0, jsx_runtime_1.jsx)("button", { onClick: function () { return setShowAddForm(!showAddForm); }, className: "px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700", children: "Add Permission" }))] }), showAddForm && canShare && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-4 p-4 bg-gray-50 border border-gray-200 rounded", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-semibold mb-3", children: "Add New Permission" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Principal Type" }), (0, jsx_runtime_1.jsxs)("select", { value: principalType, onChange: function (e) { return setPrincipalType(e.target.value); }, className: "w-full px-3 py-2 border border-gray-300 rounded-md", children: [(0, jsx_runtime_1.jsx)("option", { value: "user", children: "User" }), (0, jsx_runtime_1.jsx)("option", { value: "role", children: "Role" }), (0, jsx_runtime_1.jsx)("option", { value: "team", children: "Team" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Principal ID" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: principalId, onChange: function (e) { return setPrincipalId(e.target.value); }, placeholder: "Enter user/role/team ID", className: "w-full px-3 py-2 border border-gray-300 rounded-md" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Permissions" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("label", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: permissions.read, onChange: function (e) { return setPermissions(__assign(__assign({}, permissions), { read: e.target.checked })); }, className: "mr-2" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm", children: "Read" })] }), (0, jsx_runtime_1.jsxs)("label", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: permissions.edit, onChange: function (e) { return setPermissions(__assign(__assign({}, permissions), { edit: e.target.checked })); }, className: "mr-2" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm", children: "Edit" })] }), (0, jsx_runtime_1.jsxs)("label", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: permissions.share, onChange: function (e) { return setPermissions(__assign(__assign({}, permissions), { share: e.target.checked })); }, className: "mr-2" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm", children: "Share" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: handleAddACL, className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700", children: "Add" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () {
                                            setShowAddForm(false);
                                            setPrincipalId('');
                                        }, className: "px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300", children: "Cancel" })] })] })] })), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: acls.length === 0 ? ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "No additional permissions set" })) : (acls.map(function (acl) { return ((0, jsx_runtime_1.jsxs)("div", { className: "p-3 border border-gray-200 rounded flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-sm font-medium", children: [acl.principal_type, ": ", acl.principal_id.slice(0, 8), "..."] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3 mt-1 text-xs text-gray-600", children: [(0, jsx_runtime_1.jsxs)("span", { className: acl.permission_set.read ? 'text-green-600' : 'text-gray-400', children: ["Read ", acl.permission_set.read ? '✓' : '✗'] }), (0, jsx_runtime_1.jsxs)("span", { className: acl.permission_set.edit ? 'text-green-600' : 'text-gray-400', children: ["Edit ", acl.permission_set.edit ? '✓' : '✗'] }), (0, jsx_runtime_1.jsxs)("span", { className: acl.permission_set.share ? 'text-green-600' : 'text-gray-400', children: ["Share ", acl.permission_set.share ? '✓' : '✗'] })] })] }), canShare && ((0, jsx_runtime_1.jsx)("button", { onClick: function () { return handleRemoveACL(acl.id); }, className: "px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded", children: "Remove" }))] }, acl.id)); })) })] }));
};
exports.RegionACLControls = RegionACLControls;
