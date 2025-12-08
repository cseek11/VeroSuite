"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ExpandableActivityFABSystem;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var logger_1 = require("@/utils/logger");
function ExpandableActivityFABSystem(_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = (0, react_1.useState)(false), isExpanded = _c[0], setIsExpanded = _c[1];
    var _d = (0, react_1.useState)(null), expandedCategory = _d[0], setExpandedCategory = _d[1];
    var fabRef = (0, react_1.useRef)(null);
    var navigate = (0, react_router_dom_1.useNavigate)();
    // Activity Categories with VeroField-specific features
    var activityCategories = [
        {
            id: 'notifications',
            label: 'Notifications',
            icon: lucide_react_1.Bell,
            color: 'bg-red-500 hover:bg-red-600',
            actions: [
                {
                    id: 'view-all-notifications',
                    label: 'View All Notifications',
                    icon: lucide_react_1.Bell,
                    badge: 12,
                    description: 'See all recent notifications',
                    action: function () { return logger_1.logger.debug('View all notifications', {}, 'ExpandableActivityFABSystem'); }
                },
                {
                    id: 'emergency-alerts',
                    label: 'Emergency Alerts',
                    icon: lucide_react_1.AlertCircle,
                    badge: 2,
                    color: 'text-red-600',
                    description: 'Urgent system alerts',
                    action: function () { return logger_1.logger.debug('Emergency alerts', {}, 'ExpandableActivityFABSystem'); }
                },
                {
                    id: 'job-updates',
                    label: 'Job Updates',
                    icon: lucide_react_1.CheckCircle,
                    badge: 8,
                    description: 'Work order status changes',
                    action: function () { return logger_1.logger.debug('Job updates', {}, 'ExpandableActivityFABSystem'); }
                },
                {
                    id: 'system-notifications',
                    label: 'System Notifications',
                    icon: lucide_react_1.Settings,
                    badge: 2,
                    description: 'System and app updates',
                    action: function () { return logger_1.logger.debug('System notifications', {}, 'ExpandableActivityFABSystem'); }
                }
            ]
        },
        {
            id: 'communications',
            label: 'Communications',
            icon: lucide_react_1.MessageCircle,
            color: 'bg-blue-500 hover:bg-blue-600',
            actions: [
                {
                    id: 'recent-messages',
                    label: 'Recent Messages',
                    icon: lucide_react_1.MessageCircle,
                    badge: 5,
                    description: 'Latest chat messages',
                    action: function () { return navigate('/communications'); }
                },
                {
                    id: 'missed-calls',
                    label: 'Missed Calls',
                    icon: lucide_react_1.Phone,
                    badge: 3,
                    color: 'text-orange-600',
                    description: 'Unanswered phone calls',
                    action: function () { return logger_1.logger.debug('Missed calls', {}, 'ExpandableActivityFABSystem'); }
                },
                {
                    id: 'new-emails',
                    label: 'New Emails',
                    icon: lucide_react_1.Mail,
                    badge: 7,
                    description: 'Unread email messages',
                    action: function () { return logger_1.logger.debug('New emails', {}, 'ExpandableActivityFABSystem'); }
                },
                {
                    id: 'customer-inquiries',
                    label: 'Customer Inquiries',
                    icon: lucide_react_1.User,
                    badge: 4,
                    description: 'Customer support requests',
                    action: function () { return logger_1.logger.debug('Customer inquiries', {}, 'ExpandableActivityFABSystem'); }
                }
            ]
        },
        {
            id: 'activity-feed',
            label: 'Activity Feed',
            icon: lucide_react_1.TrendingUp,
            color: 'bg-green-500 hover:bg-green-600',
            actions: [
                {
                    id: 'recent-activity',
                    label: 'Recent Activity',
                    icon: lucide_react_1.Clock,
                    description: 'Latest system activity',
                    action: function () { return logger_1.logger.debug('Recent activity', {}, 'ExpandableActivityFABSystem'); }
                },
                {
                    id: 'user-actions',
                    label: 'User Actions',
                    icon: lucide_react_1.User,
                    description: 'Team member activities',
                    action: function () { return logger_1.logger.debug('User actions', {}, 'ExpandableActivityFABSystem'); }
                },
                {
                    id: 'system-events',
                    label: 'System Events',
                    icon: lucide_react_1.Settings,
                    description: 'Automated system events',
                    action: function () { return logger_1.logger.debug('System events', {}, 'ExpandableActivityFABSystem'); }
                },
                {
                    id: 'data-changes',
                    label: 'Data Changes',
                    icon: lucide_react_1.FileText,
                    description: 'Record modifications',
                    action: function () { return logger_1.logger.debug('Data changes', {}, 'ExpandableActivityFABSystem'); }
                }
            ]
        },
        {
            id: 'quick-tools',
            label: 'Quick Tools',
            icon: lucide_react_1.Settings,
            color: 'bg-purple-500 hover:bg-purple-600',
            actions: [
                {
                    id: 'mark-all-read',
                    label: 'Mark All Read',
                    icon: lucide_react_1.CheckCircle,
                    description: 'Clear all notifications',
                    action: function () { return logger_1.logger.debug('Mark all read', {}, 'ExpandableActivityFABSystem'); }
                },
                {
                    id: 'filter-activity',
                    label: 'Filter Activity',
                    icon: lucide_react_1.Filter,
                    description: 'Filter activity feed',
                    action: function () { return logger_1.logger.debug('Filter activity', {}, 'ExpandableActivityFABSystem'); }
                },
                {
                    id: 'archive-old',
                    label: 'Archive Old Items',
                    icon: lucide_react_1.Archive,
                    description: 'Archive old notifications',
                    action: function () { return logger_1.logger.debug('Archive old', {}, 'ExpandableActivityFABSystem'); }
                },
                {
                    id: 'refresh-feed',
                    label: 'Refresh Feed',
                    icon: lucide_react_1.RefreshCw,
                    description: 'Refresh activity feed',
                    action: function () { return logger_1.logger.debug('Refresh feed', {}, 'ExpandableActivityFABSystem'); }
                },
                {
                    id: 'activity-settings',
                    label: 'Activity Settings',
                    icon: lucide_react_1.Settings,
                    description: 'Configure notifications',
                    action: function () { return navigate('/settings/notifications'); }
                }
            ]
        }
    ];
    // Close FAB system when clicking outside
    (0, react_1.useEffect)(function () {
        var handleClickOutside = function (event) {
            if (fabRef.current && !fabRef.current.contains(event.target)) {
                setIsExpanded(false);
                setExpandedCategory(null);
            }
        };
        // Only add listener when expanded to avoid unnecessary event handling
        if (isExpanded) {
            document.addEventListener('mousedown', handleClickOutside);
            return function () { return document.removeEventListener('mousedown', handleClickOutside); };
        }
        return undefined;
    }, [isExpanded]);
    // Handle action execution
    var handleAction = function (action) {
        if (action.action) {
            action.action();
        }
        // Close FAB system after action
        setIsExpanded(false);
        setExpandedCategory(null);
    };
    // Handle category click
    var handleCategoryClick = function (categoryId) {
        if (expandedCategory === categoryId) {
            setExpandedCategory(null);
        }
        else {
            setExpandedCategory(categoryId);
        }
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("style", { children: "\n        @keyframes slideInFromBottom {\n          from {\n            opacity: 0;\n            transform: translateY(20px);\n          }\n          to {\n            opacity: 1;\n            transform: translateY(0);\n          }\n        }\n      " }), (0, jsx_runtime_1.jsxs)("div", { className: "fixed bottom-6 right-6 z-50 ".concat(className), ref: fabRef, children: [isExpanded && expandedCategory && ((0, jsx_runtime_1.jsx)("div", { className: "fixed bottom-6 right-24 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 animate-in slide-in-from-right duration-200", children: (function () {
                            var selectedCategory = activityCategories.find(function (cat) { return cat.id === expandedCategory; });
                            if (!selectedCategory)
                                return null;
                            var CategoryIcon = selectedCategory.icon;
                            return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-4 pb-3 border-b border-gray-200", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 ".concat(selectedCategory.color, " text-white rounded-full flex items-center justify-center"), children: (0, jsx_runtime_1.jsx)(CategoryIcon, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)("div", { className: "font-semibold text-gray-800", children: selectedCategory.label })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-1 max-h-80 overflow-y-auto", children: selectedCategory.actions.map(function (action) {
                                            var ActionIcon = action.icon;
                                            return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return handleAction(action); }, className: "w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left group", title: action.description, children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-gray-100 group-hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors", children: (0, jsx_runtime_1.jsx)(ActionIcon, { className: "w-4 h-4 ".concat(action.color || 'text-gray-600') }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-gray-800 truncate", children: action.label }), action.description && ((0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500 truncate", children: action.description }))] }), action.badge && ((0, jsx_runtime_1.jsx)("div", { className: "text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium", children: action.badge }))] }, action.id));
                                        }) })] }));
                        })() })), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col-reverse items-end gap-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative group", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function (e) {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setIsExpanded(!isExpanded);
                                            if (isExpanded) {
                                                setExpandedCategory(null);
                                            }
                                        }, className: "\n                w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 relative z-10 cursor-pointer active:scale-95\n                ".concat(isExpanded
                                            ? 'bg-gray-600 hover:bg-gray-700 text-white'
                                            : 'bg-orange-500 hover:bg-orange-600 text-white', "\n              "), title: isExpanded ? 'Close Activity Panel' : 'Open Activity Panel', children: (0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "w-8 h-8 transition-transform duration-300 ".concat(isExpanded ? 'rotate-45' : '') }) }), !isExpanded && ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 rounded-full bg-orange-500 opacity-0 group-hover:opacity-20 group-hover:animate-ping transition-opacity" }))] }), isExpanded && ((0, jsx_runtime_1.jsx)("div", { className: "flex flex-col-reverse gap-2", children: activityCategories.map(function (category, index) {
                                    var CategoryIcon = category.icon;
                                    var isCategoryExpanded = expandedCategory === category.id;
                                    return ((0, jsx_runtime_1.jsxs)("div", { className: "relative flex items-center gap-3 group", style: {
                                            animation: "slideInFromBottom 300ms ease-out forwards",
                                            animationDelay: "".concat(index * 50, "ms"),
                                            opacity: 0,
                                            transform: 'translateY(20px)'
                                        }, children: [!isCategoryExpanded && ((0, jsx_runtime_1.jsx)("div", { className: "absolute right-full mr-2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none", children: category.label })), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return handleCategoryClick(category.id); }, className: "\n                        ".concat(isCategoryExpanded ? 'w-12 h-12' : 'w-8 h-8', " ").concat(category.color, " text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110\n                        ").concat(isCategoryExpanded ? 'ring-4 ring-white ring-opacity-50' : 'opacity-60 hover:opacity-100', "\n                      "), title: "".concat(category.label, " Actions"), children: (0, jsx_runtime_1.jsx)(CategoryIcon, { className: "".concat(isCategoryExpanded ? 'w-6 h-6' : 'w-4 h-4') }) })] }, category.id));
                                }) }))] })] })] }));
}
