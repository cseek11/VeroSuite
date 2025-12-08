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
exports.WidgetBuilder = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var enhanced_api_1 = require("@/lib/enhanced-api");
var WidgetBuilder = function (_a) {
    var onClose = _a.onClose, onSave = _a.onSave;
    var _b = (0, react_1.useState)(''), widgetName = _b[0], setWidgetName = _b[1];
    var _c = (0, react_1.useState)(''), widgetId = _c[0], setWidgetId = _c[1];
    var _d = (0, react_1.useState)('1.0.0'), widgetVersion = _d[0], setWidgetVersion = _d[1];
    var _e = (0, react_1.useState)(''), widgetCode = _e[0], setWidgetCode = _e[1];
    var _f = (0, react_1.useState)(false), isPublic = _f[0], setIsPublic = _f[1];
    var _g = (0, react_1.useState)(false), previewMode = _g[0], setPreviewMode = _g[1];
    var handleSave = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    // Validate widget
                    if (!widgetName || !widgetId || !widgetCode) {
                        alert('Please fill in all required fields');
                        return [2 /*return*/];
                    }
                    // Register widget
                    return [4 /*yield*/, enhanced_api_1.enhancedApi.dashboardLayouts.registerWidget({
                            widget_id: widgetId,
                            name: widgetName,
                            version: widgetVersion,
                            code: widgetCode,
                            is_public: isPublic
                        })];
                case 1:
                    // Register widget
                    _a.sent();
                    alert('Widget registered successfully! It will be reviewed by an administrator.');
                    onSave === null || onSave === void 0 ? void 0 : onSave();
                    onClose === null || onClose === void 0 ? void 0 : onClose();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Failed to register widget:', error_1);
                    alert('Failed to register widget. Please try again.');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "p-6 bg-white rounded-lg shadow-sm max-w-4xl mx-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-gray-900", children: "Widget Builder" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setPreviewMode(!previewMode); }, className: "px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "w-4 h-4" }), previewMode ? 'Edit' : 'Preview'] }), onClose && ((0, jsx_runtime_1.jsxs)("button", { onClick: onClose, className: "px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4" }), "Close"] }))] })] }), !previewMode ? ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Widget Name *" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: widgetName, onChange: function (e) { return setWidgetName(e.target.value); }, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500", placeholder: "My Custom Widget" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Widget ID *" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: widgetId, onChange: function (e) { return setWidgetId(e.target.value); }, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500", placeholder: "my-custom-widget" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Version *" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: widgetVersion, onChange: function (e) { return setWidgetVersion(e.target.value); }, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500", placeholder: "1.0.0" })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-end", children: (0, jsx_runtime_1.jsxs)("label", { className: "flex items-center gap-2 cursor-pointer", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: isPublic, onChange: function (e) { return setIsPublic(e.target.checked); }, className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-700", children: "Make widget public" })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Widget Code (React Component) *" }), (0, jsx_runtime_1.jsx)("textarea", { value: widgetCode, onChange: function (e) { return setWidgetCode(e.target.value); }, className: "w-full h-96 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono text-sm", placeholder: "export default function MyWidget(props) {\n  return (\n    <div>Hello World</div>\n  );\n}" })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex justify-end gap-2", children: (0, jsx_runtime_1.jsxs)("button", { onClick: handleSave, className: "px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Save, { className: "w-4 h-4" }), "Register Widget"] }) })] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "border border-gray-200 rounded-md p-4 bg-gray-50", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold mb-4", children: "Preview" }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-md p-4 min-h-[200px]", children: widgetCode ? ((0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600", children: "Preview would render the widget code here. In production, this would use a sandboxed iframe." })) : ((0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-400", children: "Enter widget code to see preview" })) })] }))] }));
};
exports.WidgetBuilder = WidgetBuilder;
