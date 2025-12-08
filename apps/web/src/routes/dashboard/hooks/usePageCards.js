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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePageCards = void 0;
var react_1 = require("react");
var usePageCards = function () {
    var _a = (0, react_1.useState)([]), pageCards = _a[0], setPageCards = _a[1];
    var openPageCard = (0, react_1.useCallback)(function (card) {
        var id = "".concat(card.title.toLowerCase().replace(/\s+/g, '-'), "-").concat(Date.now());
        var newCard = __assign(__assign({}, card), { id: id, size: card.size || { width: 800, height: 600 }, position: card.position || { x: 0, y: 0 }, isMaximized: false });
        setPageCards(function (prev) {
            // Remove existing card with same title to prevent duplicates
            var filtered = prev.filter(function (c) { return c.title !== card.title; });
            return __spreadArray(__spreadArray([], filtered, true), [newCard], false);
        });
        return id;
    }, []);
    var closePageCard = (0, react_1.useCallback)(function (id) {
        setPageCards(function (prev) { return prev.filter(function (card) { return card.id !== id; }); });
    }, []);
    var updatePageCard = (0, react_1.useCallback)(function (id, updates) {
        setPageCards(function (prev) {
            return prev.map(function (card) {
                return card.id === id ? __assign(__assign({}, card), updates) : card;
            });
        });
    }, []);
    var isPageCardOpen = (0, react_1.useCallback)(function (pageId) {
        return pageCards.some(function (card) { return card.title.toLowerCase().replace(/\s+/g, '-') === pageId; });
    }, [pageCards]);
    var getPageCard = (0, react_1.useCallback)(function (id) {
        return pageCards.find(function (card) { return card.id === id; });
    }, [pageCards]);
    return {
        pageCards: pageCards,
        openPageCard: openPageCard,
        closePageCard: closePageCard,
        updatePageCard: updatePageCard,
        isPageCardOpen: isPageCardOpen,
        getPageCard: getPageCard,
    };
};
exports.usePageCards = usePageCards;
