"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CustomersPageCard;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var CustomersPageWrapper_1 = __importDefault(require("@/components/dashboard/CustomersPageWrapper"));
var PageCardManager_1 = __importDefault(require("@/components/dashboard/PageCardManager"));
var LoadingSpinner_1 = require("@/components/LoadingSpinner");
function CustomersPageCard(_a) {
    var onClose = _a.onClose, _b = _a.className, className = _b === void 0 ? '' : _b, cardId = _a.cardId;
    return ((0, jsx_runtime_1.jsx)(PageCardManager_1.default, __assign({ cardId: cardId || '', cardType: "customers-page" }, (onClose ? { onClose: onClose } : {}), (className ? { className: className } : {}), { children: (0, jsx_runtime_1.jsx)("div", { className: "h-full w-full flex flex-col", children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, {}), children: (0, jsx_runtime_1.jsx)(CustomersPageWrapper_1.default, {}) }) }) })));
}
