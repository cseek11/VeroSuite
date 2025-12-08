"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Switch = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var utils_1 = require("@/lib/utils");
var Switch = function (_a) {
    var id = _a.id, _b = _a.checked, checked = _b === void 0 ? false : _b, onCheckedChange = _a.onCheckedChange, _c = _a.disabled, disabled = _c === void 0 ? false : _c, className = _a.className;
    return ((0, jsx_runtime_1.jsx)("button", { type: "button", role: "switch", "aria-checked": checked, disabled: disabled, onClick: function () { return onCheckedChange === null || onCheckedChange === void 0 ? void 0 : onCheckedChange(!checked); }, className: (0, utils_1.cn)('relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', checked ? 'bg-purple-600' : 'bg-gray-200', className), id: id, children: (0, jsx_runtime_1.jsx)("span", { className: (0, utils_1.cn)('pointer-events-none block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition-transform', checked ? 'translate-x-6' : 'translate-x-1') }) }));
};
exports.Switch = Switch;
exports.default = exports.Switch;
