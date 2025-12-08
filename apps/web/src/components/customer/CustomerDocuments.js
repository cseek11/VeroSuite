"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var ui_1 = require("@/components/ui");
var CustomerDocuments = function (_a) {
    var _customerId = _a.customerId;
    var _b = (0, react_1.useState)('documents'), activeTab = _b[0], setActiveTab = _b[1];
    var documents = [
        {
            id: 1,
            name: 'Service Agreement - 2024',
            type: 'pdf',
            size: '2.4 MB',
            date: '2024-01-02',
            category: 'Contracts',
            description: 'Annual pest control service agreement'
        },
        {
            id: 2,
            name: 'Inspection Report - Dec 2023',
            type: 'pdf',
            size: '1.8 MB',
            date: '2023-12-15',
            category: 'Reports',
            description: 'Quarterly pest inspection report'
        },
        {
            id: 3,
            name: 'Property Photos - Before Treatment',
            type: 'image',
            size: '4.2 MB',
            date: '2023-12-10',
            category: 'Photos',
            description: 'Before and after treatment photos'
        },
        {
            id: 4,
            name: 'Payment Receipt - Dec 2023',
            type: 'pdf',
            size: '0.8 MB',
            date: '2023-12-28',
            category: 'Financial',
            description: 'Payment confirmation for December services'
        }
    ];
    var getFileIcon = function (type) {
        switch (type) {
            case 'pdf':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-4 h-4" });
            case 'image':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Image, { className: "w-4 h-4" });
            case 'doc':
            case 'docx':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-4 h-4" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.File, { className: "w-4 h-4" });
        }
    };
    var getFileColor = function (type) {
        switch (type) {
            case 'pdf':
                return 'bg-red-500';
            case 'image':
                return 'bg-green-500';
            case 'doc':
            case 'docx':
                return 'bg-blue-500';
            default:
                return 'bg-gray-500';
        }
    };
    var getCategoryColor = function (category) {
        switch (category) {
            case 'Contracts':
                return 'bg-purple-100 text-purple-800';
            case 'Reports':
                return 'bg-blue-100 text-blue-800';
            case 'Photos':
                return 'bg-green-100 text-green-800';
            case 'Financial':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Typography, { variant: "h3", className: "text-lg font-semibold text-gray-900", children: "Documents & Media" }), (0, jsx_runtime_1.jsxs)(ui_1.Button, { size: "sm", className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Upload, { className: "w-4 h-4" }), "Upload Files"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-1 bg-gray-100 rounded-lg p-1", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setActiveTab('documents'); }, className: "flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ".concat(activeTab === 'documents'
                            ? 'bg-white text-purple-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'), children: ["Documents (", documents.length, ")"] }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setActiveTab('upload'); }, className: "flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ".concat(activeTab === 'upload'
                            ? 'bg-white text-purple-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'), children: "Upload" })] }), activeTab === 'documents' && ((0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: documents.map(function (doc) { return ((0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-lg p-4 border border-gray-200/50", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 ".concat(getFileColor(doc.type), " rounded-lg flex items-center justify-center"), children: getFileIcon(doc.type) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-2", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-900", children: doc.name }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: doc.description })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-right", children: (0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 text-xs rounded-full ".concat(getCategoryColor(doc.category)), children: doc.category }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 text-sm text-gray-500 mb-3", children: [(0, jsx_runtime_1.jsx)("span", { children: doc.size }), (0, jsx_runtime_1.jsx)("span", { children: new Date(doc.date).toLocaleDateString() })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsxs)(ui_1.Button, { variant: "outline", size: "sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "w-4 h-4 mr-2" }), "View"] }), (0, jsx_runtime_1.jsxs)(ui_1.Button, { variant: "outline", size: "sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "w-4 h-4 mr-2" }), "Download"] }), (0, jsx_runtime_1.jsxs)(ui_1.Button, { variant: "outline", size: "sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FolderOpen, { className: "w-4 h-4 mr-2" }), "Open"] }), (0, jsx_runtime_1.jsxs)(ui_1.Button, { variant: "outline", size: "sm", className: "text-red-600 hover:text-red-700 hover:bg-red-50", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "w-4 h-4 mr-2" }), "Delete"] })] })] })] }) }, doc.id)); }) })), activeTab === 'upload' && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-lg p-6 border border-gray-200/50", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Upload, { className: "w-8 h-8 text-white" }) }), (0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-900 mb-2", children: "Upload Files" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 mb-4", children: "Drag and drop files here, or click to browse" }), (0, jsx_runtime_1.jsxs)(ui_1.Button, { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Upload, { className: "w-4 h-4" }), "Choose Files"] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg p-4 border border-gray-200/50", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-900 mb-3", children: "File Categories" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-2", children: [(0, jsx_runtime_1.jsxs)(ui_1.Button, { variant: "outline", size: "sm", className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-4 h-4" }), "Contracts"] }), (0, jsx_runtime_1.jsxs)(ui_1.Button, { variant: "outline", size: "sm", className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-4 h-4" }), "Reports"] }), (0, jsx_runtime_1.jsxs)(ui_1.Button, { variant: "outline", size: "sm", className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Image, { className: "w-4 h-4" }), "Photos"] }), (0, jsx_runtime_1.jsxs)(ui_1.Button, { variant: "outline", size: "sm", className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-4 h-4" }), "Financial"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg p-4 border border-gray-200/50", children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium text-gray-900 mb-3", children: "Recent Uploads" }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600 text-center py-4", children: "No recent uploads" })] })] }))] }));
};
exports.default = CustomerDocuments;
