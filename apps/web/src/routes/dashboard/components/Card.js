"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Memoized Card component for performance optimization
 * Prevents unnecessary re-renders when card props haven't changed
 */
var react_1 = __importDefault(require("react"));
exports.Card = react_1.default.memo(function (_a) {
    var card = _a.card, _isSelected = _a.isSelected, _isDragging = _a.isDragging, _isLocked = _a.isLocked, children = _a.children, className = _a.className, style = _a.style, onClick = _a.onClick, onFocus = _a.onFocus;
    return ((0, jsx_runtime_1.jsx)("div", { className: className, style: style, onClick: onClick, onFocus: onFocus, "data-card-id": card.id, children: children }));
}, function (prevProps, nextProps) {
    // Custom comparison function for React.memo
    // Only re-render if these specific props change
    return (prevProps.card.x === nextProps.card.x &&
        prevProps.card.y === nextProps.card.y &&
        prevProps.card.width === nextProps.card.width &&
        prevProps.card.height === nextProps.card.height &&
        prevProps.card.type === nextProps.card.type &&
        prevProps.isSelected === nextProps.isSelected &&
        prevProps.isDragging === nextProps.isDragging &&
        prevProps.isLocked === nextProps.isLocked);
});
exports.Card.displayName = 'Card';
