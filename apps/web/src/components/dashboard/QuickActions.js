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
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var useRoleBasedActions_1 = require("@/hooks/useRoleBasedActions");
var DialogModals_1 = require("@/components/ui/DialogModals");
var QuickActions = function (_a) {
    var context = _a.context, _b = _a.compact, compact = _b === void 0 ? false : _b, _c = _a.showLabels, showLabels = _c === void 0 ? true : _c, _d = _a.className, className = _d === void 0 ? '' : _d;
    var _e = (0, react_1.useState)(null), pendingAction = _e[0], setPendingAction = _e[1];
    var _f = (0, react_1.useState)(false), showConfirmModal = _f[0], setShowConfirmModal = _f[1];
    var _g = (0, react_1.useState)(false), showAlertModal = _g[0], setShowAlertModal = _g[1];
    var _h = (0, react_1.useState)(''), alertMessage = _h[0], setAlertMessage = _h[1];
    var _j = (0, useRoleBasedActions_1.useRoleBasedActions)(context), availableActions = _j.availableActions, actionsByCategory = _j.actionsByCategory, isExecuting = _j.isExecuting, lastResult = _j.lastResult, executeAction = _j.executeAction, _executeActionWithConfirmation = _j.executeActionWithConfirmation;
    // Icon mapping for actions
    var iconMap = {
        'UserCheck': lucide_react_1.UserCheck,
        'MessageSquare': lucide_react_1.MessageSquare,
        'Calendar': lucide_react_1.Calendar,
        'CheckCircle': lucide_react_1.CheckCircle,
        'Package': lucide_react_1.Package,
        'MapPin': lucide_react_1.MapPin,
        'FileText': lucide_react_1.FileText,
        'CheckSquare': lucide_react_1.CheckSquare,
        'DollarSign': lucide_react_1.DollarSign,
        'MoreHorizontal': lucide_react_1.MoreHorizontal
    };
    var handleActionClick = function (action) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!action.confirmMessage) return [3 /*break*/, 1];
                    setPendingAction(action);
                    setShowConfirmModal(true);
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, executeActionDirectly(action)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var executeActionDirectly = function (action) { return __awaiter(void 0, void 0, void 0, function () {
        var result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, executeAction(action)];
                case 1:
                    result = _a.sent();
                    if (result.success) {
                        setAlertMessage(result.message || 'Action completed successfully');
                        setShowAlertModal(true);
                    }
                    else {
                        setAlertMessage(result.error || 'Action failed');
                        setShowAlertModal(true);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    setAlertMessage('An unexpected error occurred');
                    setShowAlertModal(true);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleConfirm = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!pendingAction) return [3 /*break*/, 2];
                    return [4 /*yield*/, executeActionDirectly(pendingAction)];
                case 1:
                    _a.sent();
                    setPendingAction(null);
                    setShowConfirmModal(false);
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    var handleCancel = function () {
        setPendingAction(null);
        setShowConfirmModal(false);
    };
    // Render action button
    var renderActionButton = function (action) {
        var IconComponent = iconMap[action.icon] || lucide_react_1.MoreHorizontal;
        var isDisabled = isExecuting;
        if (compact) {
            return ((0, jsx_runtime_1.jsx)("button", { onClick: function () { return handleActionClick(action); }, disabled: isDisabled, className: "\n            p-2 rounded-lg transition-all duration-200 \n            ".concat(isDisabled
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-100 text-purple-600 hover:bg-purple-200 hover:scale-105', "\n          "), title: action.label, children: isDisabled ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-4 h-4 animate-spin" })) : ((0, jsx_runtime_1.jsx)(IconComponent, { className: "w-4 h-4" })) }, action.id));
        }
        return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return handleActionClick(action); }, disabled: isDisabled, className: "\n          flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200\n          ".concat(isDisabled
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-purple-100 text-purple-600 hover:bg-purple-200 hover:scale-105', "\n        "), children: [isDisabled ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-4 h-4 animate-spin" })) : ((0, jsx_runtime_1.jsx)(IconComponent, { className: "w-4 h-4" })), showLabels && (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: action.label })] }, action.id));
    };
    // Render category section
    var renderCategory = function (category, actions) {
        if (actions.length === 0)
            return null;
        var categoryLabels = {
            'dispatch': 'Dispatch Actions',
            'technician': 'Technician Actions',
            'owner': 'Owner Actions',
            'admin': 'Admin Actions'
        };
        return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [!compact && ((0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-semibold text-gray-700 uppercase tracking-wide", children: categoryLabels[category] || category })), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2 ".concat(compact ? 'justify-center' : ''), children: actions.map(renderActionButton) })] }, category));
    };
    // If no actions available
    if (availableActions.length === 0) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-4 ".concat(className), children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "No quick actions available for your role" }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4 ".concat(className), children: [Object.entries(actionsByCategory).map(function (_a) {
                var category = _a[0], actions = _a[1];
                return renderCategory(category, actions);
            }), (0, jsx_runtime_1.jsx)(DialogModals_1.ConfirmDialog, { open: showConfirmModal, onOpenChange: function (open) {
                    if (!open) {
                        handleCancel();
                    }
                }, onConfirm: handleConfirm, title: "Confirm Action", message: (pendingAction === null || pendingAction === void 0 ? void 0 : pendingAction.confirmMessage) || 'Are you sure?', type: "warning" }), (0, jsx_runtime_1.jsx)(DialogModals_1.AlertDialog, { open: showAlertModal, onOpenChange: function (open) { return setShowAlertModal(open); }, title: (lastResult === null || lastResult === void 0 ? void 0 : lastResult.success) ? "Success" : "Error", message: alertMessage, type: (lastResult === null || lastResult === void 0 ? void 0 : lastResult.success) ? "success" : "error" }), lastResult && !showAlertModal && ((0, jsx_runtime_1.jsx)("div", { className: "\n          p-3 rounded-lg text-sm\n          ".concat(lastResult.success
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-100 text-red-800 border border-red-200', "\n        "), children: lastResult.message || lastResult.error }))] }));
};
exports.default = QuickActions;
