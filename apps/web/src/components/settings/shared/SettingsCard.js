"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsCard = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var SettingsCard = function (_a) {
    var title = _a.title, description = _a.description, Icon = _a.icon, children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 ".concat(className), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-3", children: [Icon && ((0, jsx_runtime_1.jsx)("div", { className: "p-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg", children: (0, jsx_runtime_1.jsx)(Icon, { className: "w-4 h-4 text-white" }) })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-bold text-slate-800", children: title }), description && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-600", children: description }))] })] }), children] }));
};
exports.SettingsCard = SettingsCard;
