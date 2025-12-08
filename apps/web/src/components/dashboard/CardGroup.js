"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var CardGroup = function (_a) {
    var group = _a.group, onUpdateGroup = _a.onUpdateGroup, onDeleteGroup = _a.onDeleteGroup, onUngroupCards = _a.onUngroupCards, isSelected = _a.isSelected, onClick = _a.onClick, onGroupDragStart = _a.onGroupDragStart, onRequestDelete = _a.onRequestDelete;
    var _b = (0, react_1.useState)(false), isEditing = _b[0], setIsEditing = _b[1];
    var _c = (0, react_1.useState)(group.name), editName = _c[0], setEditName = _c[1];
    var handleSaveName = function (_event) {
        if (editName.trim() && editName !== group.name) {
            onUpdateGroup(group.id, { name: editName.trim() });
        }
        setIsEditing(false);
    };
    var handleKeyDown = function (e) {
        if (e.key === 'Enter') {
            handleSaveName(undefined);
        }
        else if (e.key === 'Escape') {
            setEditName(group.name);
            setIsEditing(false);
        }
    };
    var getBorderColor = function () {
        var colorMap = {
            purple: 'border-purple-300',
            blue: 'border-blue-300',
            green: 'border-green-300',
            red: 'border-red-300',
            yellow: 'border-yellow-300',
            pink: 'border-pink-300',
            indigo: 'border-indigo-300',
            orange: 'border-orange-300'
        };
        return colorMap[group.color] || 'border-gray-300';
    };
    var getBackgroundColor = function () {
        var colorMap = {
            purple: 'bg-purple-50/30',
            blue: 'bg-blue-50/30',
            green: 'bg-green-50/30',
            red: 'bg-red-50/30',
            yellow: 'bg-yellow-50/30',
            pink: 'bg-pink-50/30',
            indigo: 'bg-indigo-50/30',
            orange: 'bg-orange-50/30'
        };
        return colorMap[group.color] || 'bg-gray-50/30';
    };
    var getTextColor = function () {
        var colorMap = {
            purple: 'text-purple-700',
            blue: 'text-blue-700',
            green: 'text-green-700',
            red: 'text-red-700',
            yellow: 'text-yellow-700',
            pink: 'text-pink-700',
            indigo: 'text-indigo-700',
            orange: 'text-orange-700'
        };
        return colorMap[group.color] || 'text-gray-700';
    };
    if (!group.visible)
        return null;
    return ((0, jsx_runtime_1.jsxs)("div", { "data-group-id": group.id, className: "absolute border-2 border-dashed rounded-lg transition-all duration-200 ".concat(getBorderColor(), " ").concat(getBackgroundColor(), " ").concat(isSelected ? 'ring-2 ring-offset-2 ring-gray-400' : '', " ").concat(group.locked ? 'opacity-60 cursor-default' : 'hover:border-solid cursor-move'), style: {
            left: group.x,
            top: group.y,
            width: group.width,
            height: group.height,
            zIndex: 1 // Behind cards but above canvas
        }, onClick: onClick, onMouseDown: function (e) {
            if (onGroupDragStart && !group.locked) {
                onGroupDragStart(group.id, e);
            }
        }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "absolute -top-6 left-2 flex items-center gap-2 px-2 py-1 bg-white rounded-md shadow-sm border ".concat(getBorderColor()), children: [isEditing ? ((0, jsx_runtime_1.jsx)("input", { type: "text", value: editName, onChange: function (e) { return setEditName(e.target.value); }, onBlur: handleSaveName, onKeyDown: handleKeyDown, className: "text-xs font-medium ".concat(getTextColor(), " bg-transparent border-none outline-none w-20"), autoFocus: true })) : ((0, jsx_runtime_1.jsx)("span", { className: "text-xs font-medium ".concat(getTextColor(), " cursor-pointer"), onClick: function (e) {
                            e.stopPropagation();
                            setIsEditing(true);
                        }, children: group.name })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function (e) {
                                    e.stopPropagation();
                                    onUpdateGroup(group.id, { locked: !group.locked });
                                }, className: "p-0.5 hover:bg-gray-100 rounded transition-colors", title: group.locked ? 'Unlock group' : 'Lock group', children: group.locked ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Unlock, { className: "w-3 h-3 text-red-500" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { className: "w-3 h-3 text-gray-500" })) }), (0, jsx_runtime_1.jsx)("button", { onClick: function (e) {
                                    e.stopPropagation();
                                    onUngroupCards(group.id);
                                }, className: "p-0.5 hover:bg-yellow-100 rounded transition-colors", title: "Ungroup cards (keep cards, remove group)", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Ungroup, { className: "w-3 h-3 text-yellow-600" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function (e) {
                                    e.stopPropagation();
                                    if (onRequestDelete) {
                                        onRequestDelete(group.id);
                                    }
                                    else {
                                        onDeleteGroup(group.id);
                                    }
                                }, className: "p-0.5 hover:bg-red-100 rounded transition-colors", title: "Delete group and all cards inside", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "w-3 h-3 text-red-500" }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "absolute bottom-2 right-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded", children: [group.cardIds.size, " card", group.cardIds.size !== 1 ? 's' : ''] })] }));
};
exports.default = CardGroup;
