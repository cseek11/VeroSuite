"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePageCardContext = exports.PageCardProvider = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var PageCardContext = (0, react_1.createContext)(undefined);
var PageCardProvider = function (_a) {
    var children = _a.children, value = _a.value;
    return ((0, jsx_runtime_1.jsx)(PageCardContext.Provider, { value: value, children: children }));
};
exports.PageCardProvider = PageCardProvider;
var usePageCardContext = function () {
    var context = (0, react_1.useContext)(PageCardContext);
    if (!context) {
        throw new Error('usePageCardContext must be used within a PageCardProvider');
    }
    return context;
};
exports.usePageCardContext = usePageCardContext;
