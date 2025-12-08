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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = WorkOrdersPage;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var WorkOrdersList_1 = __importDefault(require("@/components/work-orders/WorkOrdersList"));
var useWorkOrders_1 = require("@/hooks/useWorkOrders");
var logger_1 = require("@/utils/logger");
var Dialog_1 = require("@/components/ui/Dialog");
var Button_1 = __importDefault(require("@/components/ui/Button"));
var lucide_react_1 = require("lucide-react");
function WorkOrdersPage() {
    var _this = this;
    var _a;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _b = (0, react_1.useState)(false), showDeleteDialog = _b[0], setShowDeleteDialog = _b[1];
    var _c = (0, react_1.useState)(null), workOrderToDelete = _c[0], setWorkOrderToDelete = _c[1];
    var deleteWorkOrderMutation = (0, useWorkOrders_1.useDeleteWorkOrder)();
    var handleCreateWorkOrder = function () {
        navigate('/work-orders/new');
    };
    var handleViewWorkOrder = function (workOrder) {
        navigate("/work-orders/".concat(workOrder.id));
    };
    var handleEditWorkOrder = function (workOrder) {
        navigate("/work-orders/".concat(workOrder.id, "/edit"));
    };
    var handleDeleteWorkOrder = function (workOrder) {
        setWorkOrderToDelete(workOrder);
        setShowDeleteDialog(true);
    };
    var confirmDeleteWorkOrder = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!workOrderToDelete)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, deleteWorkOrderMutation.mutateAsync(workOrderToDelete.id)];
                case 2:
                    _a.sent();
                    setShowDeleteDialog(false);
                    setWorkOrderToDelete(null);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    logger_1.logger.error('Failed to delete work order', error_1, 'WorkOrdersPage');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)(WorkOrdersList_1.default, { onCreateWorkOrder: handleCreateWorkOrder, onViewWorkOrder: handleViewWorkOrder, onEditWorkOrder: handleEditWorkOrder, onDeleteWorkOrder: handleDeleteWorkOrder }), (0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: showDeleteDialog, onOpenChange: setShowDeleteDialog, children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogContent, { children: [(0, jsx_runtime_1.jsxs)(Dialog_1.DialogHeader, { children: [(0, jsx_runtime_1.jsxs)(Dialog_1.DialogTitle, { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-5 w-5 text-red-500" }), "Delete Work Order"] }), (0, jsx_runtime_1.jsxs)(Dialog_1.DialogDescription, { children: ["Are you sure you want to delete this work order? This action cannot be undone.", workOrderToDelete && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-2 p-3 bg-gray-50 rounded-md", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: workOrderToDelete.description }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-600", children: ["Customer: ", ((_a = workOrderToDelete.account) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown'] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-600", children: ["Status: ", workOrderToDelete.status] })] }))] })] }), (0, jsx_runtime_1.jsxs)(Dialog_1.DialogFooter, { children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: function () { return setShowDeleteDialog(false); }, disabled: deleteWorkOrderMutation.isPending, children: "Cancel" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "danger", onClick: confirmDeleteWorkOrder, disabled: deleteWorkOrderMutation.isPending, children: deleteWorkOrderMutation.isPending ? 'Deleting...' : 'Delete' })] })] }) })] }));
}
