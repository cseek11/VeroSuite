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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandPalette = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
var useCommandPalette_1 = require("@/hooks/useCommandPalette");
var CommandPalette = function (_a) {
    var commands = _a.commands, onOpen = _a.onOpen, onClose = _a.onClose;
    var _b = (0, useCommandPalette_1.useCommandPalette)(__assign(__assign({ commands: commands }, (onOpen !== undefined && { onOpen: onOpen })), (onClose !== undefined && { onClose: onClose }))), isOpen = _b.isOpen, searchTerm = _b.searchTerm, setSearchTerm = _b.setSearchTerm, filteredCommands = _b.filteredCommands, selectedIndex = _b.selectedIndex, executeCommand = _b.executeCommand;
    if (!isOpen)
        return null;
    return ((0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { children: isOpen && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 bg-black bg-opacity-50 z-[9998]", onClick: function () { return executeCommand(); } }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, scale: 0.95, y: -20 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: -20 }, className: "fixed top-1/4 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-2xl bg-white rounded-lg shadow-2xl", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 p-4 border-b border-gray-200", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "w-5 h-5 text-gray-400" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, placeholder: "Type a command or search...", className: "flex-1 outline-none text-lg", autoFocus: true }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Command, { className: "w-3 h-3" }), (0, jsx_runtime_1.jsx)("span", { children: "K" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "max-h-96 overflow-y-auto", children: filteredCommands.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "p-8 text-center text-gray-500", children: "No commands found" })) : ((0, jsx_runtime_1.jsx)("div", { className: "py-2", children: filteredCommands.map(function (command, index) { return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return executeCommand(command); }, className: "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ".concat(index === selectedIndex ? 'bg-gray-50' : ''), children: [command.icon && ((0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: command.icon })), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-gray-900", children: command.label }), command.category && ((0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500", children: command.category }))] })] }, command.id)); }) })) })] })] })) }));
};
exports.CommandPalette = CommandPalette;
