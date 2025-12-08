"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuccessMessage = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var lucide_react_1 = require("lucide-react");
var SuccessMessage = function (_a) {
    var show = _a.show, _b = _a.message, message = _b === void 0 ? 'Settings saved successfully!' : _b, _c = _a.className, className = _c === void 0 ? '' : _c;
    if (!show)
        return null;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-300 transform translate-x-0 opacity-100 ".concat(className), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-5 h-5" }), (0, jsx_runtime_1.jsx)("span", { children: message })] }));
};
exports.SuccessMessage = SuccessMessage;
