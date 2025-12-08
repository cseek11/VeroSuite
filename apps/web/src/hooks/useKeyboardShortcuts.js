"use strict";
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
exports.useKeyboardShortcuts = useKeyboardShortcuts;
var react_1 = require("react");
function useKeyboardShortcuts(_a) {
    var onAddCard = _a.onAddCard, onDuplicateCards = _a.onDuplicateCards, onDeleteCards = _a.onDeleteCards, onAutoArrange = _a.onAutoArrange, onResetCards = _a.onResetCards, onSelectAll = _a.onSelectAll, onDeselectAll = _a.onDeselectAll, onShowHelp = _a.onShowHelp, onUndo = _a.onUndo, onRedo = _a.onRedo, selectedCards = _a.selectedCards, allCardIds = _a.allCardIds;
    var handleKeyDown = (0, react_1.useCallback)(function (e) {
        // Don't trigger shortcuts when typing in input fields
        var target = e.target;
        var isInputField = target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.contentEditable === 'true';
        if (isInputField)
            return;
        // Escape key - deselect all
        if (e.key === 'Escape') {
            onDeselectAll();
            return;
        }
        // Help shortcut
        if (e.key === '?') {
            e.preventDefault();
            onShowHelp();
            return;
        }
        // Delete selected cards
        if (e.key === 'Delete' || e.key === 'Backspace') {
            if (selectedCards.size > 0) {
                e.preventDefault();
                onDeleteCards(Array.from(selectedCards));
            }
            return;
        }
        // Number keys for quick card creation (no modifiers)
        if (!e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
            switch (e.key) {
                // Quick card creation
                case '1':
                    e.preventDefault();
                    onAddCard('dashboard-metrics');
                    break;
                case '2':
                    e.preventDefault();
                    onAddCard('jobs-calendar');
                    break;
                case '3':
                    e.preventDefault();
                    onAddCard('recent-activity');
                    break;
                case '4':
                    e.preventDefault();
                    onAddCard('customer-search');
                    break;
                case '5':
                    e.preventDefault();
                    onAddCard('reports');
                    break;
                case '6':
                    e.preventDefault();
                    onAddCard('quick-actions');
                    break;
                case '7':
                    e.preventDefault();
                    onAddCard('routing');
                    break;
                case '8':
                    e.preventDefault();
                    onAddCard('team-overview');
                    break;
                case '9':
                    e.preventDefault();
                    onAddCard('financial-summary');
                    break;
                case '0':
                    e.preventDefault();
                    onAddCard('smart-kpis');
                    break;
            }
        }
        // Ctrl/Cmd shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                // Layout shortcuts
                case 'a':
                    e.preventDefault();
                    onSelectAll();
                    break;
                case 'd':
                    e.preventDefault();
                    if (selectedCards.size > 0) {
                        onDuplicateCards(Array.from(selectedCards));
                    }
                    else if (allCardIds) {
                        // If no cards selected, duplicate all cards
                        onDuplicateCards(allCardIds);
                    }
                    break;
                case 'g':
                    e.preventDefault();
                    onAutoArrange('grid');
                    break;
                case 'l':
                    e.preventDefault();
                    onAutoArrange('list');
                    break;
                case 'k':
                    e.preventDefault();
                    onAutoArrange('compact');
                    break;
                case 'r':
                    e.preventDefault();
                    if (selectedCards.size > 0) {
                        onResetCards(Array.from(selectedCards));
                    }
                    break;
                case 'z':
                    e.preventDefault();
                    if (e.shiftKey && onRedo) {
                        onRedo();
                    }
                    else if (onUndo) {
                        onUndo();
                    }
                    break;
                case 'y':
                    e.preventDefault();
                    if (onRedo) {
                        onRedo();
                    }
                    break;
            }
        }
    }, [
        onAddCard,
        onDuplicateCards,
        onDeleteCards,
        onAutoArrange,
        onResetCards,
        onSelectAll,
        onDeselectAll,
        onShowHelp,
        onUndo,
        onRedo,
        selectedCards,
        allCardIds
    ]);
    (0, react_1.useEffect)(function () {
        document.addEventListener('keydown', handleKeyDown);
        return function () { return document.removeEventListener('keydown', handleKeyDown); };
    }, [handleKeyDown]);
    // Return available shortcuts for help display
    var shortcuts = [
        // Quick Card Creation
        { key: 'Ctrl+1', description: 'Add Dashboard Metrics', action: 'Create metrics card', category: 'Card Creation' },
        { key: 'Ctrl+2', description: 'Add Jobs Calendar', action: 'Create calendar card', category: 'Card Creation' },
        { key: 'Ctrl+3', description: 'Add Recent Activity', action: 'Create activity card', category: 'Card Creation' },
        { key: 'Ctrl+4', description: 'Add Customer Search', action: 'Create search card', category: 'Card Creation' },
        { key: 'Ctrl+5', description: 'Add Reports', action: 'Create reports card', category: 'Card Creation' },
        { key: 'Ctrl+6', description: 'Add Quick Actions', action: 'Create actions card', category: 'Card Creation' },
        { key: 'Ctrl+7', description: 'Add Routing', action: 'Create routing card', category: 'Card Creation' },
        { key: 'Ctrl+8', description: 'Add Team Overview', action: 'Create team card', category: 'Card Creation' },
        { key: 'Ctrl+9', description: 'Add Financial Summary', action: 'Create financial card', category: 'Card Creation' },
        // Layout Management
        { key: 'Ctrl+A', description: 'Select All Cards', action: 'Select all cards', category: 'Selection' },
        { key: 'Ctrl+D', description: 'Duplicate Selected', action: 'Duplicate selected cards', category: 'Card Management' },
        { key: 'Ctrl+G', description: 'Auto-Arrange Grid', action: 'Arrange cards in grid', category: 'Layout' },
        { key: 'Ctrl+L', description: 'Auto-Arrange List', action: 'Arrange cards in list', category: 'Layout' },
        { key: 'Ctrl+K', description: 'Auto-Arrange Compact', action: 'Arrange cards compactly', category: 'Layout' },
        { key: 'Ctrl+R', description: 'Reset Card Size', action: 'Reset selected cards to default size', category: 'Card Management' },
        // General
        { key: 'Delete', description: 'Delete Selected', action: 'Remove selected cards', category: 'Card Management' },
        { key: 'Escape', description: 'Deselect All', action: 'Clear selection', category: 'Selection' },
        { key: '?', description: 'Show Help', action: 'Show keyboard shortcuts', category: 'Help' }
    ];
    var shortcutMap = shortcuts.reduce(function (acc, shortcut) {
        var existing = acc[shortcut.action];
        var keys = existing ? __spreadArray(__spreadArray([], existing.keys, true), [shortcut.key], false) : [shortcut.key];
        acc[shortcut.action] = { description: shortcut.description, keys: keys };
        return acc;
    }, {});
    return { shortcuts: shortcutMap };
}
