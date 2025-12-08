"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CreateAgreementPage;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_router_dom_1 = require("react-router-dom");
var AgreementForm_1 = require("@/components/agreements/AgreementForm");
var lucide_react_1 = require("lucide-react");
var Button_1 = __importDefault(require("@/components/ui/Button"));
function CreateAgreementPage() {
    var navigate = (0, react_router_dom_1.useNavigate)();
    var handleSuccess = function () {
        // Navigate back to agreements list
        navigate('/agreements');
    };
    var handleCancel = function () {
        navigate('/agreements');
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", size: "sm", onClick: function () { return navigate('/agreements'); }, className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { className: "h-4 w-4" }), "Back to Agreements"] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-gray-900", children: "Create Agreement" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Create a new service agreement for a customer" })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200", children: (0, jsx_runtime_1.jsx)(AgreementForm_1.AgreementForm, { onSuccess: handleSuccess, onCancel: handleCancel }) })] }));
}
