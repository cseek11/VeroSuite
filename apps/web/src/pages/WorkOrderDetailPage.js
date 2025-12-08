"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = WorkOrderDetailPage;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var WorkOrderDetail_1 = __importDefault(require("@/components/work-orders/WorkOrderDetail"));
var logger_1 = require("@/utils/logger");
function WorkOrderDetailPage() {
    var id = (0, react_router_dom_1.useParams)().id;
    var navigate = (0, react_router_dom_1.useNavigate)();
    if (!id) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4", children: "Work Order Not Found" }), (0, jsx_runtime_1.jsx)("p", { className: "text-slate-600 mb-4", children: "The work order ID is missing or invalid." }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return navigate('/work-orders'); }, className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-sm", children: "Back to Work Orders" })] }) }) }));
    }
    var handleEdit = function (_workOrder) {
        if (id) {
            navigate("/work-orders/".concat(id, "/edit"));
        }
    };
    var handleDelete = function (_workOrder) {
        // Navigate back to work orders list after deletion
        navigate('/work-orders');
    };
    var handleStatusChange = function (workOrder, newStatus) {
        // Status change is handled by the component, just log for now
        logger_1.logger.debug('Work order status changed', { workOrderId: workOrder.id, newStatus: newStatus }, 'WorkOrderDetailPage');
    };
    var handleClose = function () {
        navigate('/work-orders');
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-5 h-5 text-white" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent", children: "Work Order Details" }), (0, jsx_runtime_1.jsx)("p", { className: "text-slate-600 text-sm mt-1", children: "View and manage work order information" })] })] }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(WorkOrderDetail_1.default, { workOrderId: id, onEdit: handleEdit, onDelete: handleDelete, onStatusChange: handleStatusChange, onClose: handleClose }) })] }));
}
