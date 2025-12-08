"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardSelector = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var lucide_react_1 = require("lucide-react");
var CardSelector = function (_a) {
    var showCardSelector = _a.showCardSelector, setShowCardSelector = _a.setShowCardSelector, cardTypes = _a.cardTypes, handleAddCard = _a.handleAddCard;
    if (!showCardSelector)
        return null;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-25 z-50", onClick: function () { return setShowCardSelector(false); } }), (0, jsx_runtime_1.jsx)("div", { className: "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 max-w-[90vw] max-h-[90vh] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-y-auto", children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-gray-800", children: "Add Card to Dashboard" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setShowCardSelector(false); }, className: "p-1 hover:bg-gray-100 rounded transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4 text-gray-500" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto", children: cardTypes.map(function (cardType) { return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () {
                                    handleAddCard(cardType.id);
                                    setShowCardSelector(false);
                                }, className: "p-4 text-left bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-lg transition-all duration-200 hover:shadow-md", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-gray-800 text-sm mb-1", children: cardType.name }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500", children: "Click to add to dashboard" })] }, cardType.id)); }) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-4 pt-4 border-t border-gray-100", children: (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 text-center", children: "\u2328\uFE0F Use 1-9 keys for quick card creation" }) })] }) })] }));
};
exports.CardSelector = CardSelector;
