"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spinner = Spinner;
var jsx_runtime_1 = require("react/jsx-runtime");
function Spinner() {
    return ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full flex items-center justify-center p-8", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin h-8 w-8 rounded-full border-2 border-gray-300 border-t-gray-600" }) }));
}
