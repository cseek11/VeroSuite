"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutProvider = exports.useLayout = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var LayoutContext = (0, react_1.createContext)(undefined);
var useLayout = function () {
    var ctx = (0, react_1.useContext)(LayoutContext);
    if (!ctx)
        throw new Error('useLayout must be used within a LayoutProvider');
    return ctx;
};
exports.useLayout = useLayout;
var LayoutProvider = function (_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)(false), sidebarOpen = _b[0], setSidebarOpen = _b[1];
    var _c = (0, react_1.useState)(false), activityBarOpen = _c[0], setActivityBarOpen = _c[1];
    return ((0, jsx_runtime_1.jsx)(LayoutContext.Provider, { value: { sidebarOpen: sidebarOpen, setSidebarOpen: setSidebarOpen, activityBarOpen: activityBarOpen, setActivityBarOpen: setActivityBarOpen }, children: children }));
};
exports.LayoutProvider = LayoutProvider;
