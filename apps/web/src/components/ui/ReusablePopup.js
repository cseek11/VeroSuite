"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_dom_1 = require("react-dom");
var lucide_react_1 = require("lucide-react");
var ReusablePopup = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, title = _a.title, subtitle = _a.subtitle, Icon = _a.icon, children = _a.children, _b = _a.size, size = _b === void 0 ? { width: 720, height: 480 } : _b, _c = _a.showTabs, showTabs = _c === void 0 ? false : _c, _d = _a.tabs, tabs = _d === void 0 ? [] : _d, activeTab = _a.activeTab, onTabChange = _a.onTabChange;
    var _e = (0, react_1.useState)({ x: 0, y: 0 }), position = _e[0], setPosition = _e[1];
    var _f = (0, react_1.useState)(size), currentSize = _f[0], setCurrentSize = _f[1];
    var _g = (0, react_1.useState)(false), isDragging = _g[0], setIsDragging = _g[1];
    var _h = (0, react_1.useState)(false), isResizing = _h[0], setIsResizing = _h[1];
    var _j = (0, react_1.useState)({ x: 0, y: 0 }), dragOffset = _j[0], setDragOffset = _j[1];
    var _k = (0, react_1.useState)({ x: 0, y: 0, width: 0, height: 0 }), resizeStart = _k[0], setResizeStart = _k[1];
    var popupRef = (0, react_1.useRef)(null);
    var headerRef = (0, react_1.useRef)(null);
    // Handle mouse down for dragging
    var handleMouseDown = function (e) {
        var _a;
        if (e.target !== headerRef.current && !((_a = headerRef.current) === null || _a === void 0 ? void 0 : _a.contains(e.target))) {
            return;
        }
        setIsDragging(true);
        setDragOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
    };
    // Handle mouse move for dragging
    var handleMouseMove = function (e) {
        if (isDragging) {
            var newX = e.clientX - dragOffset.x;
            var newY = e.clientY - dragOffset.y;
            setPosition({
                x: newX,
                y: newY
            });
        }
        if (isResizing) {
            var deltaX = e.clientX - resizeStart.x;
            var deltaY = e.clientY - resizeStart.y;
            var newWidth = Math.max(400, Math.min(1200, resizeStart.width + deltaX));
            var newHeight = Math.max(400, Math.min(800, resizeStart.height + deltaY));
            setCurrentSize({ width: newWidth, height: newHeight });
        }
    };
    // Handle mouse up
    var handleMouseUp = function () {
        setIsDragging(false);
        setIsResizing(false);
    };
    // Handle resize start
    var handleResizeStart = function (e) {
        e.stopPropagation();
        setIsResizing(true);
        setResizeStart({
            x: e.clientX,
            y: e.clientY,
            width: currentSize.width,
            height: currentSize.height
        });
    };
    // Add/remove event listeners
    (0, react_1.useEffect)(function () {
        if (isDragging || isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return function () {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
        return undefined;
    }, [isDragging, isResizing, dragOffset, resizeStart, currentSize.width, currentSize.height]);
    // Reset position when popup opens
    (0, react_1.useEffect)(function () {
        if (isOpen) {
            setPosition({ x: 0, y: 0 });
            setCurrentSize(size);
        }
    }, [isOpen, size]);
    if (!isOpen)
        return null;
    var popupContent = ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 flex items-center justify-center p-4 z-[9999]", onClick: onClose, children: (0, jsx_runtime_1.jsxs)("div", { ref: popupRef, className: "bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col", style: {
                width: currentSize.width,
                height: currentSize.height,
                transform: "translate(".concat(position.x, "px, ").concat(position.y, "px)"),
                cursor: isDragging ? 'grabbing' : 'default'
            }, onClick: function (e) { return e.stopPropagation(); }, children: [(0, jsx_runtime_1.jsxs)("div", { ref: headerRef, className: "flex items-center justify-between p-2 bg-gray-50 border-b border-gray-200 cursor-grab active:cursor-grabbing select-none", onMouseDown: handleMouseDown, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.GripVertical, { className: "w-3 h-3 text-gray-400 flex-shrink-0" }), Icon && ((0, jsx_runtime_1.jsx)("div", { className: "w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded flex items-center justify-center shadow-sm flex-shrink-0", children: (0, jsx_runtime_1.jsx)(Icon, { className: "w-3 h-3 text-white" }) })), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [title && ((0, jsx_runtime_1.jsx)("h2", { className: "text-sm font-semibold text-gray-900 truncate", children: title })), subtitle && ((0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-600 truncate", children: subtitle }))] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "p-1 text-gray-400 hover:text-gray-600 hover:bg-white/20 rounded transition-all duration-200 flex-shrink-0", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-4 w-4" }) })] }), showTabs && tabs.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "px-4 py-2 bg-white border-b border-gray-200", children: (0, jsx_runtime_1.jsx)("div", { className: "grid w-full h-10 bg-gray-100 border border-gray-200 rounded-lg p-1 ".concat(tabs.length <= 8 ? 'grid-cols-8' : 'grid-cols-9'), children: tabs.map(function (tab) {
                            var TabIcon = tab.icon;
                            var isActive = activeTab === tab.id;
                            return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return onTabChange === null || onTabChange === void 0 ? void 0 : onTabChange(tab.id); }, className: "flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ".concat(isActive
                                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-900'), children: [(0, jsx_runtime_1.jsx)(TabIcon, { className: "w-3 h-3" }), (0, jsx_runtime_1.jsx)("span", { className: "hidden sm:inline", children: tab.label })] }, tab.id));
                        }) }) })), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { className: "h-full overflow-y-auto overflow-x-hidden\n            [&::-webkit-scrollbar]:w-2\n            [&::-webkit-scrollbar-track]:bg-gray-50\n            [&::-webkit-scrollbar-thumb]:bg-purple-300\n            hover:[&::-webkit-scrollbar-thumb]:bg-purple-400\n            dark:[&::-webkit-scrollbar-track]:bg-gray-50\n            dark:[&::-webkit-scrollbar-thumb]:bg-purple-300\n            dark:hover:[&::-webkit-scrollbar-thumb]:bg-purple-400", children: (0, jsx_runtime_1.jsx)("div", { className: "p-4", children: children }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "absolute bottom-0 right-0 w-6 h-6 cursor-se-resize flex items-center justify-center", onMouseDown: handleResizeStart, children: (0, jsx_runtime_1.jsx)("div", { className: "w-0 h-0 border-l-[8px] border-l-transparent border-b-[8px] border-b-gray-400" }) })] }) }));
    // Render to document body using portal
    return (0, react_dom_1.createPortal)(popupContent, document.body);
};
exports.default = ReusablePopup;
