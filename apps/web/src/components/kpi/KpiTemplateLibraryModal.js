"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var lucide_react_1 = require("lucide-react");
var KpiTemplateLibrary_1 = __importDefault(require("./KpiTemplateLibrary"));
var KpiTemplateLibraryModal = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, onUseTemplate = _a.onUseTemplate;
    if (!isOpen)
        return null;
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[85vh] overflow-hidden flex flex-col min-h-[500px]", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-4 border-b border-gray-200", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-gray-900", children: "KPI Template Library" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "Browse and use pre-built KPI templates" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600 transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-6 h-6" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 p-4 overflow-y-auto", children: (0, jsx_runtime_1.jsx)(KpiTemplateLibrary_1.default, { onUseTemplate: onUseTemplate, showCreateButton: false, className: "w-full" }) })] }) }));
};
exports.default = KpiTemplateLibraryModal;
