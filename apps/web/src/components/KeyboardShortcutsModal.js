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
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importStar(require("react"));
var lucide_react_1 = require("lucide-react");
var logger_1 = require("@/utils/logger");
var KeyboardShortcutsModal = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose;
    var _b = (0, react_1.useState)(''), searchTerm = _b[0], setSearchTerm = _b[1];
    // Define all available shortcuts - using unique, non-conflicting keys
    var allShortcuts = [
        // Navigation shortcuts (using WASD for movement)
        { key: 'W', description: 'Navigate to card above', category: 'Navigation' },
        { key: 'S', description: 'Navigate to card below', category: 'Navigation' },
        { key: 'A', description: 'Navigate to card on left', category: 'Navigation' },
        { key: 'D', description: 'Navigate to card on right', category: 'Navigation' },
        { key: 'Tab', description: 'Navigate to next card', category: 'Navigation' },
        { key: 'Shift+Tab', description: 'Navigate to previous card', category: 'Navigation' },
        { key: 'Home', description: 'Navigate to first card', category: 'Navigation' },
        { key: 'End', description: 'Navigate to last card', category: 'Navigation' },
        { key: 'Space', description: 'Activate/select card', category: 'Navigation' },
        { key: 'Enter', description: 'Activate/select card', category: 'Navigation' },
        { key: 'Escape', description: 'Deselect all cards', category: 'Navigation' },
        // Multi-selection shortcuts
        { key: 'Shift+W', description: 'Add card above to selection', category: 'Selection' },
        { key: 'Shift+S', description: 'Add card below to selection', category: 'Selection' },
        { key: 'Shift+A', description: 'Add card on left to selection', category: 'Selection' },
        { key: 'Shift+D', description: 'Add card on right to selection', category: 'Selection' },
        { key: 'Ctrl+Shift+E', description: 'Select all cards', category: 'Selection' },
        // Card manipulation shortcuts (using Ctrl+WASD for moving, Alt+WASD for resizing)
        { key: 'Ctrl+Shift+W', description: 'Move selected card up', category: 'Manipulation' },
        { key: 'Ctrl+Shift+S', description: 'Move selected card down', category: 'Manipulation' },
        { key: 'Ctrl+Shift+A', description: 'Move selected card left', category: 'Manipulation' },
        { key: 'Ctrl+Shift+D', description: 'Move selected card right', category: 'Manipulation' },
        { key: 'Alt+W', description: 'Resize selected card taller', category: 'Manipulation' },
        { key: 'Alt+S', description: 'Resize selected card shorter', category: 'Manipulation' },
        { key: 'Alt+A', description: 'Resize selected card narrower', category: 'Manipulation' },
        { key: 'Alt+D', description: 'Resize selected card wider', category: 'Manipulation' },
        // Card creation shortcuts (using number keys 1-9)
        { key: '1', description: 'Add Dashboard Metrics card', category: 'Creation' },
        { key: '2', description: 'Add Jobs Calendar card', category: 'Creation' },
        { key: '3', description: 'Add Recent Activity card', category: 'Creation' },
        { key: '4', description: 'Add Customer Search card', category: 'Creation' },
        { key: '5', description: 'Add Reports card', category: 'Creation' },
        { key: '6', description: 'Add Quick Actions card', category: 'Creation' },
        { key: '7', description: 'Add Routing card', category: 'Creation' },
        { key: '8', description: 'Add Team Overview card', category: 'Creation' },
        { key: '9', description: 'Add Financial Summary card', category: 'Creation' },
        { key: '0', description: 'Add Smart KPI card', category: 'Creation' },
        // General shortcuts (using unique combinations)
        { key: 'Delete', description: 'Delete selected cards', category: 'General' },
        { key: 'Backspace', description: 'Delete selected cards', category: 'General' },
        { key: 'Ctrl+Shift+C', description: 'Duplicate selected cards', category: 'General' },
        { key: 'Ctrl+Shift+G', description: 'Auto-arrange cards in grid', category: 'General' },
        { key: 'Ctrl+Shift+L', description: 'Auto-arrange cards in list', category: 'General' },
        { key: 'Ctrl+Shift+K', description: 'Auto-arrange cards compactly', category: 'General' },
        { key: 'Ctrl+Shift+R', description: 'Reset selected cards to default size', category: 'General' },
        { key: 'Ctrl+Z', description: 'Undo last action', category: 'General' },
        { key: 'Ctrl+Y', description: 'Redo last action', category: 'General' },
        { key: '?', description: 'Show this help modal', category: 'General' },
        // Additional useful shortcuts
        { key: 'Ctrl+Shift+Q', description: 'Toggle card locking', category: 'General' },
        { key: 'Ctrl+Shift+T', description: 'Save current layout', category: 'General' },
        { key: 'Ctrl+Shift+O', description: 'Load saved layout', category: 'General' },
        { key: 'Ctrl+Shift+F', description: 'Focus search/filter', category: 'General' },
        { key: 'Ctrl+Shift+H', description: 'Toggle help overlay', category: 'General' }
    ];
    // Close modal on Escape key
    (0, react_1.useEffect)(function () {
        var handleEscape = function (e) {
            // Don't trigger when typing in input fields (except in the modal's own search)
            var target = e.target;
            var isInputField = target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.contentEditable === 'true' ||
                target.closest('[contenteditable="true"]') ||
                target.closest('input') ||
                target.closest('textarea') ||
                target.closest('[data-search-input]') ||
                target.hasAttribute('data-search-input');
            // Allow Escape in the modal's search input to close the modal
            var isModalSearch = target.closest('[data-modal-search]');
            if (isInputField && !isModalSearch) {
                return; // Don't trigger shortcuts when typing in input fields outside the modal
            }
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return function () { return document.removeEventListener('keydown', handleEscape); };
        }
        return undefined;
    }, [isOpen, onClose]);
    // Prevent body scroll when modal is open
    (0, react_1.useEffect)(function () {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = 'unset';
        }
        return function () {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);
    // Group shortcuts by category
    var shortcutGroups = [
        {
            title: 'Navigation',
            shortcuts: allShortcuts
                .filter(function (s) { return s.category === 'Navigation'; })
                .map(function (s) { return ({
                key: s.key,
                description: s.description
            }); })
        },
        {
            title: 'Selection',
            shortcuts: allShortcuts
                .filter(function (s) { return s.category === 'Selection'; })
                .map(function (s) { return ({
                key: s.key,
                description: s.description
            }); })
        },
        {
            title: 'Manipulation',
            shortcuts: allShortcuts
                .filter(function (s) { return s.category === 'Manipulation'; })
                .map(function (s) { return ({
                key: s.key,
                description: s.description
            }); })
        },
        {
            title: 'Card Creation',
            shortcuts: allShortcuts
                .filter(function (s) { return s.category === 'Creation'; })
                .map(function (s) { return ({
                key: s.key,
                description: s.description
            }); })
        },
        {
            title: 'General',
            shortcuts: allShortcuts
                .filter(function (s) { return s.category === 'General'; })
                .map(function (s) { return ({
                key: s.key,
                description: s.description
            }); })
        }
    ];
    // Filter shortcuts based on search term
    var filteredGroups = shortcutGroups.map(function (group) { return (__assign(__assign({}, group), { shortcuts: group.shortcuts.filter(function (shortcut) {
            return shortcut.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                shortcut.key.toLowerCase().includes(searchTerm.toLowerCase());
        }) })); }).filter(function (group) { return group.shortcuts.length > 0; });
    // Debug logging
    react_1.default.useEffect(function () {
        if (isOpen) {
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('KeyboardShortcutsModal opened', {
                    totalShortcuts: allShortcuts.length,
                    groupsCount: shortcutGroups.length,
                    filteredGroupsCount: filteredGroups.length
                }, 'KeyboardShortcutsModal');
            }
        }
    }, [isOpen, allShortcuts.length, shortcutGroups.length, filteredGroups.length]);
    var formatKey = function (shortcutKey) {
        // Handle compound keys like "Ctrl+A", "Shift+Tab", etc.
        var parts = shortcutKey.split('+').map(function (part) { return part.trim(); });
        var formattedParts = parts.map(function (part) {
            // Format modifier keys
            if (part === 'Ctrl')
                return 'Ctrl';
            if (part === 'Shift')
                return 'Shift';
            if (part === 'Alt')
                return 'Alt';
            if (part === 'Meta')
                return '⌘';
            // Format special keys
            if (part === ' ')
                return 'Space';
            if (part === 'Escape')
                return 'Esc';
            if (part === 'ArrowUp')
                return '↑';
            if (part === 'ArrowDown')
                return '↓';
            if (part === 'ArrowLeft')
                return '←';
            if (part === 'ArrowRight')
                return '→';
            if (part === 'Backspace')
                return 'Backspace';
            if (part === 'Delete')
                return 'Delete';
            if (part === 'Enter')
                return 'Enter';
            if (part === 'Tab')
                return 'Tab';
            if (part === 'Home')
                return 'Home';
            if (part === 'End')
                return 'End';
            // Format function keys
            if (part.startsWith('F') && /^F\d+$/.test(part)) {
                return part; // Keep F1, F2, etc. as is
            }
            // Format single letters (WASD, etc.)
            if (part.length === 1 && /[A-Z]/.test(part)) {
                return part;
            }
            return part;
        });
        return formattedParts.join(' + ');
    };
    if (!isOpen)
        return null;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "fixed inset-0 z-50 overflow-y-auto", children: [(0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 transition-opacity", onClick: onClose }), (0, jsx_runtime_1.jsx)("div", { className: "flex min-h-full items-center justify-center p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-6 border-b border-gray-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Keyboard, { className: "h-6 w-6 text-purple-600" }), (0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-gray-900", children: "Keyboard Shortcuts" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors", "aria-label": "Close keyboard shortcuts", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-5 w-5" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "p-6 border-b border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), (0, jsx_runtime_1.jsx)("input", { id: "shortcuts-search", name: "shortcuts-search", type: "text", placeholder: "Search shortcuts...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, "data-modal-search": "true", className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent", autoFocus: true })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "overflow-y-auto max-h-[60vh] p-6", children: filteredGroups.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "mx-auto h-12 w-12 text-gray-400" }), (0, jsx_runtime_1.jsx)("h3", { className: "mt-2 text-sm font-medium text-gray-900", children: "No shortcuts found" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-sm text-gray-500", children: "Try adjusting your search terms." })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-8", children: filteredGroups.map(function (group) { return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: group.title }), (0, jsx_runtime_1.jsx)("div", { className: "grid gap-3", children: group.shortcuts.map(function (shortcut, index) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-700", children: shortcut.description }), (0, jsx_runtime_1.jsx)("kbd", { className: "px-2 py-1 text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded shadow-sm", children: formatKey(shortcut.key) })] }, "".concat(shortcut.key, "-").concat(index))); }) })] }, group.title)); }) })) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-500", children: ["Press ", (0, jsx_runtime_1.jsx)("kbd", { className: "px-1 py-0.5 text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded", children: "Esc" }), " to close"] }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors", children: "Close" })] })] }) })] }));
};
exports.default = KeyboardShortcutsModal;
