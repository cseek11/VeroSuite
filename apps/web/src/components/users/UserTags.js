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
exports.default = UserTags;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
function UserTags(_a) {
    var _b = _a.tags, tags = _b === void 0 ? [] : _b, onTagsChange = _a.onTagsChange, _c = _a.editable, editable = _c === void 0 ? false : _c, _d = _a.suggestedTags, suggestedTags = _d === void 0 ? [] : _d;
    var _e = (0, react_1.useState)(''), newTag = _e[0], setNewTag = _e[1];
    var _f = (0, react_1.useState)(false), showSuggestions = _f[0], setShowSuggestions = _f[1];
    var handleAddTag = function () {
        var trimmedTag = newTag.trim();
        if (trimmedTag && !tags.includes(trimmedTag) && onTagsChange) {
            onTagsChange(__spreadArray(__spreadArray([], tags, true), [trimmedTag], false));
            setNewTag('');
            setShowSuggestions(false);
        }
    };
    var handleRemoveTag = function (tagToRemove) {
        if (onTagsChange) {
            onTagsChange(tags.filter(function (tag) { return tag !== tagToRemove; }));
        }
    };
    var handleSuggestionClick = function (suggestion) {
        if (!tags.includes(suggestion) && onTagsChange) {
            onTagsChange(__spreadArray(__spreadArray([], tags, true), [suggestion], false));
            setNewTag('');
            setShowSuggestions(false);
        }
    };
    var availableSuggestions = suggestedTags.filter(function (tag) { return !tags.includes(tag); });
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Tag, { className: "h-4 w-4 text-gray-400" }), (0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-gray-700", children: "Tags" })] }), tags.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2", children: tags.map(function (tag) { return ((0, jsx_runtime_1.jsxs)("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800", children: [tag, editable && ((0, jsx_runtime_1.jsx)("button", { onClick: function () { return handleRemoveTag(tag); }, className: "ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-purple-200 focus:outline-none", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-3 w-3" }) }))] }, tag)); }) })), editable && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: newTag, onChange: function (e) {
                                    setNewTag(e.target.value);
                                    setShowSuggestions(e.target.value.length > 0 && availableSuggestions.length > 0);
                                }, onKeyDown: function (e) {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddTag();
                                    }
                                    else if (e.key === 'Escape') {
                                        setShowSuggestions(false);
                                    }
                                }, placeholder: "Add tag...", className: "flex-1 min-w-0 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-sm" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleAddTag, disabled: !newTag.trim(), className: "inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4" }) })] }), showSuggestions && availableSuggestions.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "border border-gray-200 rounded-md bg-white shadow-sm", children: [(0, jsx_runtime_1.jsx)("div", { className: "px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-200", children: "Suggestions" }), (0, jsx_runtime_1.jsx)("div", { className: "p-2", children: availableSuggestions
                                    .filter(function (suggestion) {
                                    return suggestion.toLowerCase().includes(newTag.toLowerCase());
                                })
                                    .slice(0, 5)
                                    .map(function (suggestion) { return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return handleSuggestionClick(suggestion); }, className: "w-full text-left px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Tag, { className: "h-3 w-3 text-gray-400" }), (0, jsx_runtime_1.jsx)("span", { children: suggestion })] }, suggestion)); }) })] }))] })), tags.length === 0 && !editable && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "No tags assigned" }))] }));
}
