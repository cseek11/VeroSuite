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
exports.default = CreateWorkOrderPage;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_router_dom_1 = require("react-router-dom");
var useWorkOrders_1 = require("@/hooks/useWorkOrders");
var WorkOrderForm_1 = __importDefault(require("@/components/work-orders/WorkOrderForm"));
var logger_1 = require("@/utils/logger");
var lucide_react_1 = require("lucide-react");
function CreateWorkOrderPage() {
    var _this = this;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var createWorkOrderMutation = (0, useWorkOrders_1.useCreateWorkOrder)();
    var handleSubmit = function (data) { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, createWorkOrderMutation.mutateAsync(data)];
                case 1:
                    _a.sent();
                    // Navigate back to work orders list
                    navigate('/work-orders');
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    logger_1.logger.error('Failed to create work order', error_1, 'CreateWorkOrderPage');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleCancel = function () {
        navigate('/work-orders');
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4", children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between mb-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: function () { return navigate('/work-orders'); }, className: "px-3 py-1.5 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white hover:shadow-lg transition-all duration-200 font-medium text-sm flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { className: "h-4 w-4" }), "Back"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-5 h-5 text-white" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent", children: "Create Work Order" }), (0, jsx_runtime_1.jsx)("p", { className: "text-slate-600 text-sm mt-1", children: "Create a new work order for a customer" })] })] })] }) }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(WorkOrderForm_1.default, { onSubmit: handleSubmit, onCancel: handleCancel, isLoading: createWorkOrderMutation.isPending, mode: "create" }) })] }));
}
