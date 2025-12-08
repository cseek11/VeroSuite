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
exports.ShareRegionDialog = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var useRegionPermissions_1 = require("@/hooks/useRegionPermissions");
var ShareRegionDialog = function (_a) {
    var regionId = _a.regionId, userId = _a.userId, isOpen = _a.isOpen, onClose = _a.onClose;
    var _b = (0, useRegionPermissions_1.useRegionPermissions)({ regionId: regionId, userId: userId }), canShare = _b.canShare, setACL = _b.setACL;
    var _c = (0, react_1.useState)('user'), principalType = _c[0], setPrincipalType = _c[1];
    var _d = (0, react_1.useState)(''), principalId = _d[0], setPrincipalId = _d[1];
    var _e = (0, react_1.useState)({
        read: true,
        edit: false,
        share: false
    }), permissions = _e[0], setPermissions = _e[1];
    var _f = (0, react_1.useState)(false), loading = _f[0], setLoading = _f[1];
    var _g = (0, react_1.useState)(null), error = _g[0], setError = _g[1];
    var handleShare = function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!principalId) {
                        setError('Please enter a principal ID');
                        return [2 /*return*/];
                    }
                    if (!canShare) {
                        setError('You do not have permission to share this region');
                        return [2 /*return*/];
                    }
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, setACL(principalType, principalId, permissions)];
                case 2:
                    _a.sent();
                    onClose();
                    setPrincipalId('');
                    setPermissions({ read: true, edit: false, share: false });
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    setError(err_1 instanceof Error ? err_1.message : 'Failed to share region');
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    if (!isOpen)
        return null;
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-lg shadow-xl max-w-md w-full mx-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold mb-4", children: "Share Region" }), !canShare && ((0, jsx_runtime_1.jsx)("div", { className: "mb-4 p-3 bg-red-50 border border-red-200 rounded", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-800", children: "You do not have permission to share this region." }) })), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Share With" }), (0, jsx_runtime_1.jsxs)("select", { value: principalType, onChange: function (e) { return setPrincipalType(e.target.value); }, className: "w-full px-3 py-2 border border-gray-300 rounded-md", disabled: !canShare, children: [(0, jsx_runtime_1.jsx)("option", { value: "user", children: "User" }), (0, jsx_runtime_1.jsx)("option", { value: "role", children: "Role" }), (0, jsx_runtime_1.jsx)("option", { value: "team", children: "Team" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [principalType === 'user' ? 'User' : principalType === 'role' ? 'Role' : 'Team', " ID"] }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: principalId, onChange: function (e) { return setPrincipalId(e.target.value); }, placeholder: "Enter ".concat(principalType, " ID"), className: "w-full px-3 py-2 border border-gray-300 rounded-md", disabled: !canShare })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Permissions" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("label", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: permissions.read, onChange: function (e) { return setPermissions(__assign(__assign({}, permissions), { read: e.target.checked })); }, className: "mr-2", disabled: !canShare }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm", children: "Read - Can view the region" })] }), (0, jsx_runtime_1.jsxs)("label", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: permissions.edit, onChange: function (e) { return setPermissions(__assign(__assign({}, permissions), { edit: e.target.checked })); }, className: "mr-2", disabled: !canShare }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm", children: "Edit - Can modify the region" })] }), (0, jsx_runtime_1.jsxs)("label", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: permissions.share, onChange: function (e) { return setPermissions(__assign(__assign({}, permissions), { share: e.target.checked })); }, className: "mr-2", disabled: !canShare }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm", children: "Share - Can share with others" })] })] })] }), error && ((0, jsx_runtime_1.jsx)("div", { className: "p-3 bg-red-50 border border-red-200 rounded", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-800", children: error }) })), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end gap-3 pt-4", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200", disabled: loading, children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleShare, disabled: loading || !canShare || !principalId, className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed", children: loading ? 'Sharing...' : 'Share' })] })] })] }) }) }));
};
exports.ShareRegionDialog = ShareRegionDialog;
