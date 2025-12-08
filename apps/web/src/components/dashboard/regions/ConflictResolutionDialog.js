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
exports.ConflictResolutionDialog = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
var ConflictResolutionDialog = function (_a) {
    var conflict = _a.conflict, onResolve = _a.onResolve, onCancel = _a.onCancel;
    var _b = (0, react_1.useState)(false), resolving = _b[0], setResolving = _b[1];
    var _c = (0, react_1.useState)(null), selectedResolution = _c[0], setSelectedResolution = _c[1];
    var handleResolve = function (resolution) { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setResolving(true);
                    setSelectedResolution(resolution);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, onResolve(resolution)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('Failed to resolve conflict:', error_1);
                    return [3 /*break*/, 5];
                case 4:
                    setResolving(false);
                    setSelectedResolution(null);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var getChangedFields = function (local, server, changes) {
        var fields = [];
        Object.keys(changes).forEach(function (key) {
            if (key in local || key in server) {
                fields.push(key);
            }
        });
        return fields;
    };
    var changedFields = getChangedFields(conflict.localVersion, conflict.serverVersion, conflict.localChanges);
    return ((0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm", onClick: onCancel, children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.95, opacity: 0 }, onClick: function (e) { return e.stopPropagation(); }, className: "bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-6 border-b bg-yellow-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "w-6 h-6 text-yellow-600" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-bold text-gray-900", children: "Conflict Detected" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 mt-1", children: "This region was modified by another user while you were editing it." })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "p-6 space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-semibold text-gray-700 mb-2", children: "Changed Fields:" }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2", children: changedFields.map(function (field) { return ((0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded", children: field.replace(/_/g, ' ') }, field)); }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "border rounded-lg p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-4 h-4 text-green-600" }), (0, jsx_runtime_1.jsx)("h4", { className: "font-semibold text-sm", children: "Your Changes" })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2 text-sm", children: Object.entries(conflict.localChanges).map(function (_a) {
                                                    var key = _a[0], value = _a[1];
                                                    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-gray-600", children: [key.replace(/_/g, ' '), ":"] }), ' ', (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: typeof value === 'object' ? JSON.stringify(value) : String(value) })] }, key));
                                                }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "border rounded-lg p-4 bg-gray-50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "w-4 h-4 text-gray-600" }), (0, jsx_runtime_1.jsx)("h4", { className: "font-semibold text-sm", children: "Server Version" })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2 text-sm", children: changedFields.map(function (key) {
                                                    var value = conflict.serverVersion[key];
                                                    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-gray-600", children: [key.replace(/_/g, ' '), ":"] }), ' ', (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: typeof value === 'object' ? JSON.stringify(value) : String(value) })] }, key));
                                                }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-semibold text-gray-700", children: "Choose Resolution:" }), (0, jsx_runtime_1.jsxs)("button", { onClick: function () { return handleResolve('local'); }, disabled: resolving, className: "w-full flex items-center gap-3 p-4 border-2 border-green-500 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-5 h-5 text-green-600" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 text-left", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-semibold", children: "Keep Your Changes" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600", children: "Overwrite server version with your local changes" })] }), selectedResolution === 'local' && resolving && ((0, jsx_runtime_1.jsx)("div", { className: "animate-spin", children: (0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "w-4 h-4" }) }))] }), (0, jsx_runtime_1.jsxs)("button", { onClick: function () { return handleResolve('server'); }, disabled: resolving, className: "w-full flex items-center gap-3 p-4 border-2 border-blue-500 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "w-5 h-5 text-blue-600" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 text-left", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-semibold", children: "Use Server Version" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600", children: "Discard your changes and use the server version" })] }), selectedResolution === 'server' && resolving && ((0, jsx_runtime_1.jsx)("div", { className: "animate-spin", children: (0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "w-4 h-4" }) }))] }), (0, jsx_runtime_1.jsxs)("button", { onClick: function () { return handleResolve('merge'); }, disabled: resolving, className: "w-full flex items-center gap-3 p-4 border-2 border-purple-500 rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Merge, { className: "w-5 h-5 text-purple-600" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 text-left", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-semibold", children: "Merge Changes" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600", children: "Combine your changes with the server version" })] }), selectedResolution === 'merge' && resolving && ((0, jsx_runtime_1.jsx)("div", { className: "animate-spin", children: (0, jsx_runtime_1.jsx)(lucide_react_1.RefreshCw, { className: "w-4 h-4" }) }))] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "p-6 border-t bg-gray-50 flex justify-end", children: (0, jsx_runtime_1.jsx)("button", { onClick: onCancel, disabled: resolving, className: "px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50", children: "Cancel" }) })] }) }) }));
};
exports.ConflictResolutionDialog = ConflictResolutionDialog;
