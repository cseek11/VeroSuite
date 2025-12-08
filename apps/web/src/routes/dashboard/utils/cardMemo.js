"use strict";
/**
 * Memoization utilities for card rendering optimization
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultCardComparison = exports.memoizeCard = void 0;
var react_1 = __importDefault(require("react"));
/**
 * Memoized card component wrapper
 * Prevents re-renders when card props haven't changed
 */
var memoizeCard = function (Component, areEqual) {
    return react_1.default.memo(Component, areEqual);
};
exports.memoizeCard = memoizeCard;
/**
 * Default card comparison function
 * Only re-renders if position, size, or selection state changes
 */
var defaultCardComparison = function (prevCard, nextCard, prevSelected, nextSelected, prevDragging, nextDragging) {
    return (prevCard.x === nextCard.x &&
        prevCard.y === nextCard.y &&
        prevCard.width === nextCard.width &&
        prevCard.height === nextCard.height &&
        prevCard.id === nextCard.id &&
        prevSelected === nextSelected &&
        prevDragging === nextDragging);
};
exports.defaultCardComparison = defaultCardComparison;
