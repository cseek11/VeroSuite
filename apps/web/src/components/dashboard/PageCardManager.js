"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PageCardManager;
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Simplified PageCardManager - Just a wrapper for page content
 * All minimize/maximize/restore logic handled by global VeroCardsV3 system
 * This ensures consistent behavior across ALL card types
 */
function PageCardManager(_a) {
    var cardId = _a.cardId, cardType = _a.cardType, children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b, rest = __rest(_a, ["cardId", "cardType", "children", "className"]);
    var _onClose = rest.onClose;
    // Just render the content - no special minimize logic
    // The global system (VeroCardsV3 + renderHelpers) handles everything
    return ((0, jsx_runtime_1.jsx)("div", { className: "h-full w-full flex flex-col ".concat(className), children: children }));
}
