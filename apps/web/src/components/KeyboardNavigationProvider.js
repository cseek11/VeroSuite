"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importStar(require("react"));
var KeyboardShortcutsModal_1 = __importDefault(require("./KeyboardShortcutsModal"));
var logger_1 = require("@/utils/logger");
var KeyboardNavigationProvider = function (_a) {
    var children = _a.children, _b = _a.enabled, enabled = _b === void 0 ? true : _b;
    var _c = (0, react_1.useState)(false), shortcutsModalOpen = _c[0], setShortcutsModalOpen = _c[1];
    var _d = (0, react_1.useState)(null), lastShortcut = _d[0], setLastShortcut = _d[1];
    // Helper function for shortcut handling (currently unused, kept for potential future use)
    var _handleShortcut = (0, react_1.useCallback)(function (shortcut) {
        setLastShortcut(shortcut);
        // Clear the shortcut after 2 seconds
        setTimeout(function () { return setLastShortcut(null); }, 2000);
    }, []);
    void _handleShortcut; // Suppress unused warning
    // Note: This provider is for global keyboard shortcuts, not card navigation
    // Card navigation is handled directly in VeroCardsV3 component
    var handleGlobalShortcuts = (0, react_1.useCallback)(function (e) {
        if (!enabled)
            return;
        // Handle global shortcuts here
        if (e.key === '?' && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
            e.preventDefault();
            setShortcutsModalOpen(true);
        }
    }, [enabled]);
    // Global keyboard shortcuts
    react_1.default.useEffect(function () {
        if (!enabled) {
            return;
        }
        var handleKeyDown = function (e) {
            // Don't trigger when typing in input fields
            var target = e.target;
            var isInputField = target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.contentEditable === 'true' ||
                target.closest('[contenteditable="true"]') ||
                target.closest('input') ||
                target.closest('textarea') ||
                target.closest('[data-search-input]') ||
                target.hasAttribute('data-search-input');
            if (isInputField) {
                return; // Don't trigger shortcuts when typing in input fields
            }
            handleGlobalShortcuts(e);
        };
        logger_1.logger.debug('Global shortcuts enabled', {}, 'KeyboardNavigationProvider');
        document.addEventListener('keydown', handleKeyDown);
        return function () { return document.removeEventListener('keydown', handleKeyDown); };
    }, [enabled, handleGlobalShortcuts]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [children, (0, jsx_runtime_1.jsx)(KeyboardShortcutsModal_1.default, { isOpen: shortcutsModalOpen, onClose: function () { return setShortcutsModalOpen(false); } }), lastShortcut && ((0, jsx_runtime_1.jsx)("div", { className: "fixed bottom-4 right-4 z-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: "\u2713" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm", children: lastShortcut })] }) }))] }));
};
exports.default = KeyboardNavigationProvider;
