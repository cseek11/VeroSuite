"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DensityModeSelector = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var DensityModeContext_1 = require("@/context/DensityModeContext");
var lucide_react_1 = require("lucide-react");
var densityOptions = [
    {
        value: 'compact',
        label: 'Compact',
        description: 'Maximum density, ideal for data-heavy views',
        icon: lucide_react_1.Minimize2
    },
    {
        value: 'standard',
        label: 'Standard',
        description: 'Balanced comfort and productivity',
        icon: lucide_react_1.LayoutGrid
    },
    {
        value: 'comfortable',
        label: 'Comfortable',
        description: 'More breathing room for analysis',
        icon: lucide_react_1.Maximize2
    }
];
var DensityModeSelector = function () {
    var _a = (0, DensityModeContext_1.useDensityMode)(), densityMode = _a.densityMode, setDensityMode = _a.setDensityMode;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-600", children: "Choose your preferred display density. This affects spacing, font sizes, and row heights throughout the application." }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: densityOptions.map(function (option) {
                    var Icon = option.icon;
                    var isSelected = densityMode === option.value;
                    return ((0, jsx_runtime_1.jsxs)("label", { className: "flex items-start p-3 bg-white rounded-md border-2 cursor-pointer transition-all ".concat(isSelected
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'), children: [(0, jsx_runtime_1.jsx)("input", { type: "radio", name: "densityMode", value: option.value, checked: isSelected, onChange: function (e) { return setDensityMode(e.target.value); }, className: "sr-only" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-3 w-full", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-1.5 rounded-md ".concat(isSelected ? 'bg-indigo-100' : 'bg-slate-100'), children: (0, jsx_runtime_1.jsx)(Icon, { className: "w-4 h-4 ".concat(isSelected ? 'text-indigo-600' : 'text-slate-600') }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium mb-1 ".concat(isSelected ? 'text-indigo-900' : 'text-slate-900'), children: option.label }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs ".concat(isSelected ? 'text-indigo-700' : 'text-slate-600'), children: option.description })] }), isSelected && ((0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0", children: (0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-indigo-500 rounded-full" }) }))] })] }, option.value));
                }) })] }));
};
exports.DensityModeSelector = DensityModeSelector;
