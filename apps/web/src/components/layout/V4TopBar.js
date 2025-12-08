"use strict";
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
exports.default = V4TopBar;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importStar(require("react"));
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var SimpleGlobalSearchBar_1 = require("@/components/search/SimpleGlobalSearchBar");
var logger_1 = require("@/utils/logger");
function V4TopBar(_a) {
    var onMobileMenuToggle = _a.onMobileMenuToggle, onLogout = _a.onLogout, user = _a.user;
    var _b = (0, react_1.useState)(false), showUserMenu = _b[0], setShowUserMenu = _b[1];
    var _c = (0, react_1.useState)(false), showKeyboardShortcuts = _c[0], setShowKeyboardShortcuts = _c[1];
    var _d = (0, react_1.useState)(false), showQuickActionsMenu = _d[0], setShowQuickActionsMenu = _d[1];
    var currentTime = (0, react_1.useState)(function () {
        var now = new Date();
        return {
            current: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            end: '6:00 PM'
        };
    })[0];
    var navigate = (0, react_router_dom_1.useNavigate)();
    // Keyboard shortcuts data
    var keyboardShortcuts = [
        { key: '⌘ + K', description: 'Quick Search', action: 'Open global search' },
        { key: '⌘ + N', description: 'New Job', action: 'Create new work order' },
        { key: '⌘ + C', description: 'New Customer', action: 'Add new customer' },
        { key: '⌘ + D', description: 'Dashboard', action: 'Go to dashboard' },
        { key: '⌘ + J', description: 'Jobs', action: 'View all jobs' },
        { key: '⌘ + S', description: 'Settings', action: 'Open settings' },
        { key: '⌘ + /', description: 'Shortcuts', action: 'Show this help' },
        { key: '⌘ + 1', description: 'Dashboard', action: 'Go to main dashboard' },
        { key: 'Esc', description: 'Close Modal', action: 'Close any open modal' },
    ];
    // Handle keyboard shortcuts
    (0, react_1.useEffect)(function () {
        var handleKeyDown = function (event) {
            // Don't trigger when typing in input fields
            var target = event.target;
            var isInputField = target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.contentEditable === 'true' ||
                target.closest('[contenteditable="true"]') ||
                target.closest('input') ||
                target.closest('textarea') ||
                target.closest('[data-search-input]') ||
                target.hasAttribute('data-search-input');
            if (isInputField) {
                return; // Don't trigger shortcuts when typing in input fields
            }
            var isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            var cmdKey = isMac ? event.metaKey : event.ctrlKey;
            if (cmdKey) {
                switch (event.key.toLowerCase()) {
                    case 'k':
                        event.preventDefault();
                        // Focus global search input
                        var searchInput = document.querySelector('.global-search-input');
                        if (searchInput) {
                            searchInput.focus();
                        }
                        break;
                    case 'n':
                        event.preventDefault();
                        navigate('/jobs/new');
                        break;
                    case 'c':
                        event.preventDefault();
                        navigate('/customers/new');
                        break;
                    case 'd':
                        event.preventDefault();
                        navigate('/dashboard');
                        break;
                    case 'j':
                        event.preventDefault();
                        navigate('/jobs');
                        break;
                    case 's':
                        event.preventDefault();
                        navigate('/settings');
                        break;
                    case '/':
                        event.preventDefault();
                        setShowKeyboardShortcuts(true);
                        break;
                    case '1':
                        event.preventDefault();
                        navigate('/dashboard');
                        break;
                }
            }
            else if (event.key === 'Escape') {
                setShowKeyboardShortcuts(false);
                setShowUserMenu(false);
                setShowQuickActionsMenu(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return function () { return document.removeEventListener('keydown', handleKeyDown); };
    }, [navigate]);
    // Close dropdowns when clicking outside
    (0, react_1.useEffect)(function () {
        var handleClickOutside = function (event) {
            var target = event.target;
            if (!target.closest('.quick-actions-dropdown')) {
                setShowQuickActionsMenu(false);
            }
            if (!target.closest('.user-menu-dropdown')) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return function () { return document.removeEventListener('mousedown', handleClickOutside); };
    }, []);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("header", { className: "bg-gradient-to-r from-gray-800 via-gray-700 to-purple-600 text-white shadow-lg z-30", children: (0, jsx_runtime_1.jsxs)("div", { className: "px-3 py-3 flex items-center gap-6 justify-start", children: [(0, jsx_runtime_1.jsx)("button", { className: "md:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0", onClick: onMobileMenuToggle, children: (0, jsx_runtime_1.jsx)(lucide_react_1.Menu, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center", children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("img", { src: "/branding/vero_small.png", alt: "VeroPest", className: "w-auto h-auto drop-shadow-lg" }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "relative flex-1 max-w-md", children: (0, jsx_runtime_1.jsx)(SimpleGlobalSearchBar_1.SimpleGlobalSearchBar, { placeholder: "Search customers or use natural language commands...", className: "w-full", enableCommands: true, onActionExecuted: function (result) {
                                    logger_1.logger.debug('Action executed from header', { result: result }, 'V4TopBar');
                                    // You can add additional handling here if needed
                                } }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-2 text-xs flex-shrink-0", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-semibold", children: currentTime.current }), (0, jsx_runtime_1.jsxs)("div", { className: "opacity-80", children: ["End: ", currentTime.end] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 flex-shrink-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center hidden sm:block", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-semibold text-sm", children: (user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.first_name) || (user === null || user === void 0 ? void 0 : user.email) || 'User' }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs opacity-80", children: (user === null || user === void 0 ? void 0 : user.roles) && user.roles.length > 0
                                                ? user.roles.map(function (r) { return r.charAt(0).toUpperCase() + r.slice(1); }).join(', ')
                                                : 'Admin' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "relative user-menu-dropdown", children: [(0, jsx_runtime_1.jsx)("button", { className: "w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors", onClick: function () { return setShowUserMenu(!showUserMenu); }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronDown, { className: "w-3 h-3" }) }), showUserMenu && ((0, jsx_runtime_1.jsxs)("div", { className: "absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "px-4 py-2 border-b border-gray-100", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-semibold text-gray-800", children: (user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.first_name) || (user === null || user === void 0 ? void 0 : user.email) || 'User' }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500 truncate", children: (user === null || user === void 0 ? void 0 : user.email) || 'user@example.com' })] }), (0, jsx_runtime_1.jsxs)("button", { className: "w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "w-4 h-4" }), "Profile"] }), (0, jsx_runtime_1.jsxs)("button", { className: "w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "w-4 h-4" }), "Settings"] }), (0, jsx_runtime_1.jsx)("div", { className: "border-t border-gray-100 my-1" }), (0, jsx_runtime_1.jsxs)("button", { className: "w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2", onClick: onLogout, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.LogOut, { className: "w-4 h-4" }), "Logout"] })] }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1.5 flex-shrink-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative quick-actions-dropdown", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return setShowQuickActionsMenu(!showQuickActionsMenu); }, className: "bg-white/20 hover:bg-white/30 p-1.5 rounded text-xs font-semibold transition-colors flex items-center justify-center", title: "Quick Actions", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-3 h-3" }) }), showQuickActionsMenu && ((0, jsx_runtime_1.jsxs)("div", { className: "absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: function () {
                                                        navigate('/jobs/new');
                                                        setShowQuickActionsMenu(false);
                                                    }, className: "w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-4 h-4" }), "New Job"] }), (0, jsx_runtime_1.jsxs)("button", { onClick: function () {
                                                        navigate('/work-orders');
                                                        setShowQuickActionsMenu(false);
                                                    }, className: "w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-4 h-4" }), "Create Work Order"] })] }))] }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return navigate('/customers/new'); }, className: "bg-white/20 hover:bg-white/30 p-1.5 rounded text-xs font-semibold transition-colors flex items-center justify-center", title: "Add Customer", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "w-3 h-3" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setShowKeyboardShortcuts(true); }, className: "p-1.5 rounded-lg hover:bg-white/10 transition-colors", title: "Keyboard Shortcuts (\u2318 + /)", children: (0, jsx_runtime_1.jsx)(lucide_react_1.HelpCircle, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsxs)("button", { className: "p-1.5 rounded-lg hover:bg-white/10 transition-colors relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Bell, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { className: "absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold", children: "59" })] })] })] }) }), showKeyboardShortcuts && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-6 border-b border-gray-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 bg-purple-100 rounded-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Command, { className: "h-5 w-5 text-purple-600" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-gray-900", children: "Keyboard Shortcuts" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "Quick access to common actions" })] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setShowKeyboardShortcuts(false); }, className: "p-2 rounded-lg hover:bg-gray-100 transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-5 w-5 text-gray-500" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "p-6 overflow-y-auto max-h-[60vh]", children: (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: keyboardShortcuts.map(function (shortcut, index) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-gray-900", children: shortcut.description }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500", children: shortcut.action })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-1", children: shortcut.key.split(' + ').map(function (key, keyIndex) { return ((0, jsx_runtime_1.jsxs)(react_1.default.Fragment, { children: [keyIndex > 0 && (0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "+" }), (0, jsx_runtime_1.jsx)("kbd", { className: "px-2 py-1 text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded shadow-sm", children: key })] }, keyIndex)); }) })] }, index)); }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "p-6 border-t border-gray-200 bg-gray-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-600", children: [(0, jsx_runtime_1.jsxs)("p", { className: "mb-2", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Tip:" }), " Press ", (0, jsx_runtime_1.jsx)("kbd", { className: "px-1 py-0.5 text-xs bg-white border border-gray-300 rounded", children: "Esc" }), " to close this modal."] }), (0, jsx_runtime_1.jsx)("p", { children: "Keyboard shortcuts work when you're not typing in input fields." })] }) })] }) }))] }));
}
