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
exports.default = ExpandableFABSystem;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var logger_1 = require("@/utils/logger");
var auth_1 = require("@/stores/auth");
function ExpandableFABSystem(_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = (0, react_1.useState)(false), isExpanded = _c[0], setIsExpanded = _c[1];
    var _d = (0, react_1.useState)(null), expandedCategory = _d[0], setExpandedCategory = _d[1];
    var fabRef = (0, react_1.useRef)(null);
    var navigate = (0, react_router_dom_1.useNavigate)();
    var user = (0, auth_1.useAuthStore)(function (s) { return s.user; });
    // Role-based access control helper - DENY BY DEFAULT
    var hasAccess = (0, react_1.useCallback)(function (actionId) {
        if (!user)
            return false;
        var userRoles = user.roles || [];
        var userPermissions = user.permissions || [];
        // Admin has access to everything
        if (userRoles.includes('admin')) {
            return true;
        }
        // Debug logging for permission checks (development only)
        if (process.env.NODE_ENV === 'development' && userPermissions.length > 0) {
            logger_1.logger.debug('FAB Permission check', {
                actionId: actionId,
                userRoles: userRoles,
                userPermissionsCount: userPermissions.length,
                userPermissions: userPermissions.slice(0, 10) // Log first 10 permissions
            }, 'ExpandableFABSystem');
        }
        // Comprehensive access rules - ALL FAB actions must be explicitly defined
        var accessRules = {
            // ===== CUSTOMER OPERATIONS =====
            'view-customers': { allUsers: true },
            'add-customer': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['customers:create'] },
            'search-customers': { allUsers: true },
            'customer-analytics': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['reports:view'] },
            'customer-map': { allUsers: true },
            // ===== WORK MANAGEMENT =====
            'create-work-order': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['jobs:create'] },
            'view-work-orders': { allUsers: true },
            'emergency-job': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['jobs:create'] },
            'create-agreement': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['jobs:create'] },
            'job-templates': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['jobs:view'] },
            // ===== SCHEDULING =====
            'todays-schedule': { roles: ['admin', 'owner', 'dispatcher', 'technician'], permissions: ['jobs:view'] },
            'schedule-job': { roles: ['admin', 'owner', 'dispatcher', 'technician'], permissions: ['jobs:view'] },
            'route-optimization': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['jobs:assign'] },
            'technician-availability': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['technicians:view'] },
            'emergency-dispatch': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['jobs:assign'] },
            // ===== FINANCIAL =====
            'create-invoice': { roles: ['admin', 'owner'], permissions: ['invoices:create'] },
            'process-payment': { roles: ['admin', 'owner'], permissions: ['invoices:update'] },
            'financial-reports': { roles: ['admin', 'owner'], permissions: ['reports:generate'] },
            'billing-overview': { roles: ['admin', 'owner'], permissions: ['invoices:view'] },
            'payment-history': { roles: ['admin', 'owner'], permissions: ['invoices:view'] },
            // ===== TEAM MANAGEMENT =====
            'view-technicians': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['technicians:view'] },
            'add-technician': { roles: ['admin', 'owner'], permissions: ['technicians:manage'] },
            'manage-availability': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['technicians:view'] },
            'performance-reports': { roles: ['admin', 'owner'], permissions: ['reports:generate'] },
            'training-records': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['technicians:view'] },
            // ===== QUICK ACTIONS =====
            'global-search': { allUsers: true },
            'notifications': { allUsers: true },
            'recent-items': { allUsers: true },
            'settings': { roles: ['admin', 'owner'], permissions: ['settings:view'] },
            'help-support': { allUsers: true }, // All users
        };
        var rule = accessRules[actionId];
        // DENY BY DEFAULT - if no rule is defined, deny access
        if (!rule) {
            logger_1.logger.warn('FAB action has no access rule defined', { actionId: actionId }, 'ExpandableFABSystem');
            return false;
        }
        // If marked as accessible to all users, allow access
        if (rule.allUsers === true) {
            return true;
        }
        // Check if user has required role OR permission
        // If both roles and permissions are specified, user needs EITHER one (not both)
        var hasRequiredRole = false;
        var hasRequiredPermission = false;
        // Check roles
        if (rule.roles && rule.roles.length > 0) {
            hasRequiredRole = rule.roles.some(function (role) { return userRoles.includes(role); });
        }
        // Check permissions (with wildcard support)
        if (rule.permissions && rule.permissions.length > 0) {
            hasRequiredPermission = rule.permissions.some(function (permission) {
                if (userPermissions.includes(permission))
                    return true;
                var resource = permission.split(':')[0];
                if (userPermissions.includes("".concat(resource, ":*")))
                    return true;
                if (userPermissions.includes('*:*'))
                    return true;
                return false;
            });
        }
        // If both roles and permissions are specified, user needs EITHER
        if (rule.roles && rule.roles.length > 0 && rule.permissions && rule.permissions.length > 0) {
            return hasRequiredRole || hasRequiredPermission;
        }
        // If only roles are specified, user must have the role
        if (rule.roles && rule.roles.length > 0) {
            return hasRequiredRole;
        }
        // If only permissions are specified, user must have the permission
        if (rule.permissions && rule.permissions.length > 0) {
            return hasRequiredPermission;
        }
        return true;
    }, [user]);
    // FAB Categories with VeroField-specific actions
    var fabCategories = [
        {
            id: 'customers',
            label: 'Customer Operations',
            icon: lucide_react_1.Users,
            color: 'bg-blue-500 hover:bg-blue-600',
            actions: [
                {
                    id: 'view-customers',
                    label: 'View All Customers',
                    icon: lucide_react_1.Users,
                    path: '/customers',
                    badge: '2.1k',
                    description: 'Browse and manage all customers'
                },
                {
                    id: 'add-customer',
                    label: 'Add New Customer',
                    icon: lucide_react_1.UserPlus,
                    path: '/customers/new',
                    description: 'Create a new customer record'
                },
                {
                    id: 'search-customers',
                    label: 'Search Customers',
                    icon: lucide_react_1.Search,
                    action: function () {
                        // Focus global search or open customer search modal
                        var searchInput = document.querySelector('.global-search-input');
                        if (searchInput) {
                            searchInput.focus();
                            searchInput.value = 'customer:';
                        }
                    },
                    description: 'Quick customer search'
                },
                {
                    id: 'customer-analytics',
                    label: 'Customer Analytics',
                    icon: lucide_react_1.TrendingUp,
                    path: '/customers/analytics',
                    description: 'View customer insights and metrics'
                },
                {
                    id: 'customer-map',
                    label: 'Customer Map',
                    icon: lucide_react_1.MapPin,
                    path: '/customers/map',
                    description: 'Geographic view of customers'
                }
            ]
        },
        {
            id: 'work-management',
            label: 'Work Management',
            icon: lucide_react_1.ClipboardList,
            color: 'bg-green-500 hover:bg-green-600',
            actions: [
                {
                    id: 'create-work-order',
                    label: 'Create Work Order',
                    icon: lucide_react_1.Plus,
                    path: '/work-orders/new',
                    description: 'Create a new work order'
                },
                {
                    id: 'view-work-orders',
                    label: 'View All Work Orders',
                    icon: lucide_react_1.ClipboardList,
                    path: '/work-orders',
                    badge: 12,
                    description: 'Manage all work orders'
                },
                {
                    id: 'emergency-job',
                    label: 'Emergency Job',
                    icon: lucide_react_1.AlertCircle,
                    path: '/work-orders/new?priority=emergency',
                    color: 'text-red-600',
                    description: 'Create urgent work order'
                },
                {
                    id: 'create-agreement',
                    label: 'Create Agreement',
                    icon: lucide_react_1.FileText,
                    path: '/agreements/create',
                    description: 'Create service agreement'
                },
                {
                    id: 'job-templates',
                    label: 'Job Templates',
                    icon: lucide_react_1.Star,
                    path: '/work-orders/templates',
                    description: 'Manage work order templates'
                }
            ]
        },
        {
            id: 'scheduling',
            label: 'Scheduling & Dispatch',
            icon: lucide_react_1.Calendar,
            color: 'bg-purple-500 hover:bg-purple-600',
            actions: [
                {
                    id: 'todays-schedule',
                    label: "Today's Schedule",
                    icon: lucide_react_1.Clock,
                    path: '/scheduler?view=today',
                    badge: 47,
                    description: 'View today\'s scheduled jobs'
                },
                {
                    id: 'schedule-job',
                    label: 'Schedule Job',
                    icon: lucide_react_1.Calendar,
                    path: '/scheduler',
                    description: 'Schedule a new job'
                },
                {
                    id: 'route-optimization',
                    label: 'Route Optimization',
                    icon: lucide_react_1.MapPin,
                    path: '/routing',
                    description: 'Optimize technician routes'
                },
                {
                    id: 'technician-availability',
                    label: 'Technician Availability',
                    icon: lucide_react_1.UserCheck,
                    path: '/technicians?view=availability',
                    description: 'Check technician schedules'
                },
                {
                    id: 'emergency-dispatch',
                    label: 'Emergency Dispatch',
                    icon: lucide_react_1.AlertCircle,
                    path: '/scheduler?priority=emergency',
                    color: 'text-red-600',
                    description: 'Emergency job dispatch'
                }
            ]
        },
        {
            id: 'financial',
            label: 'Financial',
            icon: lucide_react_1.DollarSign,
            color: 'bg-emerald-500 hover:bg-emerald-600',
            actions: [
                {
                    id: 'create-invoice',
                    label: 'Create Invoice',
                    icon: lucide_react_1.FileText,
                    path: '/billing/invoices/new',
                    description: 'Generate customer invoice'
                },
                {
                    id: 'process-payment',
                    label: 'Process Payment',
                    icon: lucide_react_1.CreditCard,
                    path: '/billing/payments/new',
                    description: 'Process customer payment'
                },
                {
                    id: 'financial-reports',
                    label: 'Financial Reports',
                    icon: lucide_react_1.BarChart3,
                    path: '/reports/financial',
                    description: 'View financial analytics'
                },
                {
                    id: 'billing-overview',
                    label: 'Billing Overview',
                    icon: lucide_react_1.DollarSign,
                    path: '/billing',
                    badge: '$45k',
                    description: 'Billing dashboard'
                },
                {
                    id: 'payment-history',
                    label: 'Payment History',
                    icon: lucide_react_1.Clock,
                    path: '/billing/payments',
                    description: 'View payment records'
                }
            ]
        },
        {
            id: 'team-management',
            label: 'Team Management',
            icon: lucide_react_1.UserCheck,
            color: 'bg-indigo-500 hover:bg-indigo-600',
            actions: [
                {
                    id: 'view-technicians',
                    label: 'View Technicians',
                    icon: lucide_react_1.Users,
                    path: '/technicians',
                    badge: 8,
                    description: 'Manage technician team'
                },
                {
                    id: 'add-technician',
                    label: 'Add Technician',
                    icon: lucide_react_1.UserPlus,
                    path: '/technicians/new',
                    description: 'Add new team member'
                },
                {
                    id: 'manage-availability',
                    label: 'Manage Availability',
                    icon: lucide_react_1.Calendar,
                    path: '/technicians/availability',
                    description: 'Set technician schedules'
                },
                {
                    id: 'performance-reports',
                    label: 'Performance Reports',
                    icon: lucide_react_1.TrendingUp,
                    path: '/reports/technicians',
                    description: 'Technician performance metrics'
                },
                {
                    id: 'training-records',
                    label: 'Training Records',
                    icon: lucide_react_1.CheckSquare,
                    path: '/technicians/training',
                    description: 'Manage training and certifications'
                }
            ]
        },
        {
            id: 'quick-actions',
            label: 'Quick Actions',
            icon: lucide_react_1.Zap,
            color: 'bg-orange-500 hover:bg-orange-600',
            actions: [
                {
                    id: 'global-search',
                    label: 'Global Search',
                    icon: lucide_react_1.Search,
                    action: function () {
                        var searchInput = document.querySelector('.global-search-input');
                        if (searchInput) {
                            searchInput.focus();
                        }
                    },
                    description: 'Search across all data'
                },
                {
                    id: 'notifications',
                    label: 'Notifications',
                    icon: lucide_react_1.Bell,
                    badge: 3,
                    action: function () {
                        // Open notifications panel
                        logger_1.logger.debug('Opening notifications', {}, 'ExpandableFABSystem');
                    },
                    description: 'View recent notifications'
                },
                {
                    id: 'recent-items',
                    label: 'Recent Items',
                    icon: lucide_react_1.Clock,
                    action: function () {
                        // Show recent items modal
                        logger_1.logger.debug('Showing recent items', {}, 'ExpandableFABSystem');
                    },
                    description: 'Recently viewed items'
                },
                {
                    id: 'settings',
                    label: 'Settings',
                    icon: lucide_react_1.Settings,
                    path: '/settings',
                    description: 'Application settings'
                },
                {
                    id: 'help-support',
                    label: 'Help & Support',
                    icon: lucide_react_1.HelpCircle,
                    path: '/knowledge',
                    description: 'Get help and documentation'
                }
            ]
        }
    ];
    // Filter FAB categories and actions based on user roles and permissions
    var filteredCategories = (0, react_1.useMemo)(function () {
        return fabCategories.map(function (category) { return (__assign(__assign({}, category), { actions: category.actions.filter(function (action) { return hasAccess(action.id); }) })); }).filter(function (category) { return category.actions.length > 0; }); // Remove categories with no accessible actions
    }, [user, hasAccess]);
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
        if (action.path) {
            navigate(action.path);
        }
        else if (action.action) {
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
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("style", { children: "\n        @keyframes slideInFromBottom {\n          from {\n            opacity: 0;\n            transform: translateY(20px);\n          }\n          to {\n            opacity: 1;\n            transform: translateY(0);\n          }\n        }\n      " }), (0, jsx_runtime_1.jsxs)("div", { className: "fixed bottom-6 left-6 z-50 ".concat(className), ref: fabRef, children: [isExpanded && expandedCategory && ((0, jsx_runtime_1.jsx)("div", { className: "fixed bottom-6 left-24 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 animate-in slide-in-from-left duration-200", children: (function () {
                            var selectedCategory = filteredCategories.find(function (cat) { return cat.id === expandedCategory; });
                            if (!selectedCategory)
                                return null;
                            var CategoryIcon = selectedCategory.icon;
                            return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-4 pb-3 border-b border-gray-200", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 ".concat(selectedCategory.color, " text-white rounded-full flex items-center justify-center"), children: (0, jsx_runtime_1.jsx)(CategoryIcon, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)("div", { className: "font-semibold text-gray-800", children: selectedCategory.label })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-1 max-h-80 overflow-y-auto", children: selectedCategory.actions.map(function (action) {
                                            var ActionIcon = action.icon;
                                            return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return handleAction(action); }, className: "w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left group", title: action.description, children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-gray-100 group-hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors", children: (0, jsx_runtime_1.jsx)(ActionIcon, { className: "w-4 h-4 ".concat(action.color || 'text-gray-600') }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-gray-800 truncate", children: action.label }), action.description && ((0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500 truncate", children: action.description }))] }), action.badge && ((0, jsx_runtime_1.jsx)("div", { className: "text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium", children: action.badge }))] }, action.id));
                                        }) })] }));
                        })() })), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col-reverse items-start gap-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative group", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function (e) {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setIsExpanded(!isExpanded);
                                            if (isExpanded) {
                                                setExpandedCategory(null);
                                            }
                                        }, className: "\n                w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 relative z-10 cursor-pointer active:scale-95\n                ".concat(isExpanded
                                            ? 'bg-gray-600 hover:bg-gray-700 text-white'
                                            : 'bg-purple-500 hover:bg-purple-600 text-white', "\n              "), title: isExpanded ? 'Close Actions' : 'Open Quick Actions', children: (0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-8 h-8 transition-transform duration-300 ".concat(isExpanded ? 'rotate-45' : '') }) }), !isExpanded && ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 rounded-full bg-purple-500 opacity-0 group-hover:opacity-20 group-hover:animate-ping transition-opacity" }))] }), isExpanded && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () {
                                            navigate('/dashboard');
                                            setIsExpanded(false);
                                            setExpandedCategory(null);
                                        }, className: "w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ring-2 ring-purple-200", title: "Go to Dashboard", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Home, { className: "w-6 h-6" }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-gradient-to-r from-purple-100 to-purple-200 px-3 py-2 rounded-lg text-sm font-semibold text-purple-800 whitespace-nowrap", children: "Dashboard" })] })), isExpanded && ((0, jsx_runtime_1.jsx)("div", { className: "flex flex-col-reverse gap-2", children: filteredCategories.map(function (category, index) {
                                    var CategoryIcon = category.icon;
                                    var isCategoryExpanded = expandedCategory === category.id;
                                    return ((0, jsx_runtime_1.jsxs)("div", { className: "relative flex items-center gap-3 group", style: {
                                            animation: "slideInFromBottom 300ms ease-out forwards",
                                            animationDelay: "".concat(index * 50, "ms"),
                                            opacity: 0,
                                            transform: 'translateY(20px)'
                                        }, children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return handleCategoryClick(category.id); }, className: "\n                        ".concat(isCategoryExpanded ? 'w-12 h-12' : 'w-8 h-8', " ").concat(category.color, " text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110\n                        ").concat(isCategoryExpanded ? 'ring-4 ring-white ring-opacity-50' : 'opacity-60 hover:opacity-100', "\n                      "), title: "".concat(category.label, " Actions"), children: (0, jsx_runtime_1.jsx)(CategoryIcon, { className: "".concat(isCategoryExpanded ? 'w-6 h-6' : 'w-4 h-4') }) }), !isCategoryExpanded && ((0, jsx_runtime_1.jsx)("div", { className: "absolute left-full ml-2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none", children: category.label }))] }, category.id));
                                }) }))] })] })] }));
}
