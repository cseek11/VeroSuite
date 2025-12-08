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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var auth_1 = require("@/stores/auth");
var V4TopBar_1 = __importDefault(require("./V4TopBar"));
var SecondaryNavigationBar_1 = __importDefault(require("./SecondaryNavigationBar"));
var ExpandableFABSystem_1 = __importDefault(require("./ExpandableFABSystem"));
var ExpandableActivityFABSystem_1 = __importDefault(require("./ExpandableActivityFABSystem"));
var PageCardContext_1 = require("@/contexts/PageCardContext");
var usePageCards_1 = require("@/routes/dashboard/hooks/usePageCards");
var PageCardWrapper_1 = __importDefault(require("@/components/dashboard/PageCardWrapper"));
// Wrapper component that provides page card context (for non-dashboard routes)
function V4LayoutWithPageCards(_a) {
    var children = _a.children;
    var _b = (0, usePageCards_1.usePageCards)(), pageCards = _b.pageCards, openPageCard = _b.openPageCard, closePageCard = _b.closePageCard, updatePageCard = _b.updatePageCard;
    return ((0, jsx_runtime_1.jsx)(PageCardContext_1.PageCardProvider, { value: { openPageCard: openPageCard, closePageCard: closePageCard, updatePageCard: updatePageCard, isPageCardOpen: function () { return false; } }, children: (0, jsx_runtime_1.jsx)(V4LayoutContent, { pageCards: pageCards, updatePageCard: updatePageCard, closePageCard: closePageCard, children: children }) }));
}
function V4LayoutContent(_a) {
    var children = _a.children, _b = _a.pageCards, pageCards = _b === void 0 ? [] : _b, updatePageCard = _a.updatePageCard, closePageCard = _a.closePageCard;
    var _c = (0, react_1.useState)(false), mobileMenuOpen = _c[0], setMobileMenuOpen = _c[1];
    var _d = (0, auth_1.useAuthStore)(), user = _d.user, clear = _d.clear;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var location = (0, react_router_dom_1.useLocation)();
    // Close mobile menu when route changes
    (0, react_1.useEffect)(function () {
        setMobileMenuOpen(false);
    }, [location.pathname]);
    var handleLogout = function () {
        clear();
        navigate('/login');
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex h-screen bg-gray-90/70 backdrop-blur-sm backdrop-brightness-90", children: [(0, jsx_runtime_1.jsx)(ExpandableFABSystem_1.default, {}), (0, jsx_runtime_1.jsx)(ExpandableActivityFABSystem_1.default, {}), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 flex flex-col", children: [(0, jsx_runtime_1.jsx)(V4TopBar_1.default, { onMobileMenuToggle: function () { return setMobileMenuOpen(!mobileMenuOpen); }, onLogout: handleLogout, user: user }), (0, jsx_runtime_1.jsx)(SecondaryNavigationBar_1.default, {}), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 flex min-w-0 overflow-hidden relative", children: (0, jsx_runtime_1.jsx)("main", { className: "flex-1 flex flex-col min-w-0 overflow-hidden", children: (0, jsx_runtime_1.jsx)("section", { className: "flex-1 main-content-area overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { className: "relative bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200/50 h-full overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { className: "h-full overflow-y-auto\r\n                  [&::-webkit-scrollbar]:w-2\r\n                  [&::-webkit-scrollbar-track]:bg-gray-50\r\n                  [&::-webkit-scrollbar-thumb]:bg-purple-300\r\n                  hover:[&::-webkit-scrollbar-thumb]:bg-purple-400\r\n                  dark:[&::-webkit-scrollbar-track]:bg-gray-50\r\n                  dark:[&::-webkit-scrollbar-thumb]:bg-purple-300\r\n                  dark:hover:[&::-webkit-scrollbar-thumb]:bg-purple-400", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: children }) }) }) }) }) })] }), pageCards.map(function (pageCard) {
                var PageComponent = pageCard.component;
                return ((0, jsx_runtime_1.jsx)(PageCardWrapper_1.default, __assign({ pageId: pageCard.id, title: pageCard.title }, (pageCard.icon && { icon: pageCard.icon }), { onClose: function () { return closePageCard === null || closePageCard === void 0 ? void 0 : closePageCard(pageCard.id); }, onResize: function (size) { return updatePageCard === null || updatePageCard === void 0 ? void 0 : updatePageCard(pageCard.id, { size: size }); }, initialSize: pageCard.size, children: (0, jsx_runtime_1.jsx)(PageComponent, __assign({}, pageCard.props)) }), pageCard.id));
            })] }));
}
exports.default = V4LayoutWithPageCards;
