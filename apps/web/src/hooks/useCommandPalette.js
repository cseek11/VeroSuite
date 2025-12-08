"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCommandPalette = useCommandPalette;
var react_1 = require("react");
function useCommandPalette(_a) {
    var commands = _a.commands, onOpen = _a.onOpen, onClose = _a.onClose;
    var _b = (0, react_1.useState)(false), isOpen = _b[0], setIsOpen = _b[1];
    var _c = (0, react_1.useState)(''), searchTerm = _c[0], setSearchTerm = _c[1];
    var _d = (0, react_1.useState)(0), selectedIndex = _d[0], setSelectedIndex = _d[1];
    // Filter commands based on search term
    var filteredCommands = commands.filter(function (cmd) {
        var _a, _b;
        if (!searchTerm)
            return true;
        var term = searchTerm.toLowerCase();
        return (cmd.label.toLowerCase().includes(term) ||
            ((_a = cmd.keywords) === null || _a === void 0 ? void 0 : _a.some(function (k) { return k.toLowerCase().includes(term); })) ||
            ((_b = cmd.category) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(term)));
    });
    // Open command palette
    var open = (0, react_1.useCallback)(function () {
        setIsOpen(true);
        setSearchTerm('');
        setSelectedIndex(0);
        onOpen === null || onOpen === void 0 ? void 0 : onOpen();
    }, [onOpen]);
    // Close command palette
    var close = (0, react_1.useCallback)(function () {
        setIsOpen(false);
        setSearchTerm('');
        setSelectedIndex(0);
        onClose === null || onClose === void 0 ? void 0 : onClose();
    }, [onClose]);
    // Execute selected command
    var executeCommand = (0, react_1.useCallback)(function (command) {
        var cmd = command || filteredCommands[selectedIndex];
        if (cmd) {
            cmd.action();
            close();
        }
    }, [filteredCommands, selectedIndex, close]);
    // Keyboard shortcuts
    (0, react_1.useEffect)(function () {
        var handleKeyDown = function (e) {
            // Open with Cmd/Ctrl + K
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                if (isOpen) {
                    close();
                }
                else {
                    open();
                }
                return;
            }
            if (!isOpen)
                return;
            // Close with Escape
            if (e.key === 'Escape') {
                close();
                return;
            }
            // Navigate with arrow keys
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(function (prev) { return Math.min(prev + 1, filteredCommands.length - 1); });
                return;
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(function (prev) { return Math.max(prev - 1, 0); });
                return;
            }
            // Execute with Enter
            if (e.key === 'Enter') {
                e.preventDefault();
                executeCommand();
                return;
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return function () { return document.removeEventListener('keydown', handleKeyDown); };
    }, [isOpen, filteredCommands, selectedIndex, open, close, executeCommand]);
    return {
        isOpen: isOpen,
        searchTerm: searchTerm,
        setSearchTerm: setSearchTerm,
        filteredCommands: filteredCommands,
        selectedIndex: selectedIndex,
        setSelectedIndex: setSelectedIndex,
        open: open,
        close: close,
        executeCommand: executeCommand
    };
}
