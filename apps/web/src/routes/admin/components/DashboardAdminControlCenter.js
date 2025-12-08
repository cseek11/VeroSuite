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
exports.DashboardAdminControlCenter = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var enhanced_api_1 = require("@/lib/enhanced-api");
var WidgetBuilder_1 = require("./WidgetBuilder");
var DashboardAdminControlCenter = function () {
    var _a = (0, react_1.useState)('templates'), activeTab = _a[0], setActiveTab = _a[1];
    // const [, setTemplates] = useState<LayoutTemplate[]>([]); // Reserved for future template management
    var _b = (0, react_1.useState)([]), widgets = _b[0], setWidgets = _b[1];
    var _c = (0, react_1.useState)(false), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)(false), showWidgetBuilder = _d[0], setShowWidgetBuilder = _d[1];
    (0, react_1.useEffect)(function () {
        loadData();
    }, [activeTab]);
    var loadData = function () { return __awaiter(void 0, void 0, void 0, function () {
        var data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    if (!(activeTab === 'widgets')) return [3 /*break*/, 3];
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.getApprovedWidgets()];
                case 2:
                    data = _a.sent();
                    setWidgets(data || []);
                    _a.label = 3;
                case 3: return [3 /*break*/, 6];
                case 4:
                    error_1 = _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "p-6 bg-white rounded-lg shadow-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Dashboard Administration" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Manage layout templates, widgets, permissions, and audit logs" })] }), (0, jsx_runtime_1.jsx)("div", { className: "border-b border-gray-200 mb-6", children: (0, jsx_runtime_1.jsx)("nav", { className: "flex space-x-8", children: [
                        { id: 'templates', label: 'Layout Templates', icon: lucide_react_1.Layout },
                        { id: 'widgets', label: 'Widget Registry', icon: lucide_react_1.FileText },
                        { id: 'permissions', label: 'Permission Matrix', icon: lucide_react_1.Shield },
                        { id: 'audit', label: 'Audit Trail', icon: lucide_react_1.Eye }
                    ].map(function (_a) {
                        var id = _a.id, label = _a.label, Icon = _a.icon;
                        return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setActiveTab(id); }, className: "flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ".concat(activeTab === id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'), children: [(0, jsx_runtime_1.jsx)(Icon, { className: "w-4 h-4" }), label] }, id));
                    }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-6", children: [activeTab === 'templates' && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center mb-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold", children: "Layout Templates" }), (0, jsx_runtime_1.jsx)("button", { className: "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600", children: "Create Template" })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: (0, jsx_runtime_1.jsx)("div", { className: "p-4 border border-gray-200 rounded-lg", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "No templates yet" }) }) })] })), activeTab === 'widgets' && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center mb-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold", children: "Widget Registry" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setShowWidgetBuilder(true); }, className: "px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600", children: "Register Widget" })] }), showWidgetBuilder && ((0, jsx_runtime_1.jsx)("div", { className: "mb-6", children: (0, jsx_runtime_1.jsx)(WidgetBuilder_1.WidgetBuilder, { onClose: function () { return setShowWidgetBuilder(false); }, onSave: function () {
                                        setShowWidgetBuilder(false);
                                        loadData();
                                    } }) })), loading ? ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-8", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" }) })) : ((0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "min-w-full divide-y divide-gray-200", children: [(0, jsx_runtime_1.jsx)("thead", { className: "bg-gray-50", children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Widget ID" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Name" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Version" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Status" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Actions" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { className: "bg-white divide-y divide-gray-200", children: widgets.map(function (widget) { return ((0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900", children: widget.widget_id }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: widget.name }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: widget.version }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: (0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 text-xs rounded-full ".concat(widget.is_approved
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-yellow-100 text-yellow-800'), children: widget.is_approved ? 'Approved' : 'Pending' }) }), (0, jsx_runtime_1.jsxs)("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: [(0, jsx_runtime_1.jsx)("button", { className: "text-blue-600 hover:text-blue-900 mr-4", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Edit2, { className: "w-4 h-4 inline" }) }), (0, jsx_runtime_1.jsx)("button", { className: "text-red-600 hover:text-red-900", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "w-4 h-4 inline" }) })] })] }, widget.id)); }) })] }) }))] })), activeTab === 'permissions' && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold mb-4", children: "Permission Matrix" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Permission matrix UI would go here" })] })), activeTab === 'audit' && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold mb-4", children: "Audit Trail" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Audit log viewer would go here" })] }))] })] }));
};
exports.DashboardAdminControlCenter = DashboardAdminControlCenter;
