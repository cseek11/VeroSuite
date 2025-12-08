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
exports.default = SecondaryNavigationBar;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var PageCardContext_1 = require("@/contexts/PageCardContext");
var auth_1 = require("@/stores/auth");
var logger_1 = require("@/utils/logger");
var lucide_react_1 = require("lucide-react");
function SecondaryNavigationBar(_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = (0, react_1.useState)(null), activeDropdown = _c[0], setActiveDropdown = _c[1];
    var navRef = (0, react_1.useRef)(null);
    var navigate = (0, react_router_dom_1.useNavigate)();
    var location = (0, react_router_dom_1.useLocation)();
    var user = (0, auth_1.useAuthStore)().user;
    // Try to get page card context, but don't fail if not available
    var pageCardContext;
    try {
        pageCardContext = (0, PageCardContext_1.usePageCardContext)();
    }
    catch (error) {
        // Page card context not available, use regular navigation
        pageCardContext = null;
        logger_1.logger.debug('Page card context not available in navigation', { error: error instanceof Error ? error.message : String(error) }, 'SecondaryNavigationBar');
    }
    // Role-based access control helper - DENY BY DEFAULT
    var hasAccess = function (itemId) {
        if (!user)
            return false;
        var userRoles = user.roles || [];
        var userPermissions = user.permissions || [];
        // Admin has access to everything
        if (userRoles.includes('admin')) {
            return true;
        }
        // Comprehensive access rules - ALL navigation items must be explicitly defined
        var accessRules = {
            // ===== DASHBOARD - All authenticated users =====
            'main-dashboard': { allUsers: true },
            'analytics-overview': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['reports:view'] },
            'performance-metrics': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['reports:view'] },
            // ===== CUSTOMERS - All users can view, admin/owner/dispatcher can create/edit =====
            'all-customers': { allUsers: true },
            'add-customer': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['customers:create'] },
            'search-customers': { allUsers: true },
            'customer-analytics': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['reports:view'] },
            'customer-map': { allUsers: true },
            'customer-segments': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['customers:view'] },
            'import-customers': { roles: ['admin', 'owner'], permissions: ['customers:import'] },
            'export-customers': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['customers:export'] },
            // ===== WORK ORDERS - All users can view, admin/owner/dispatcher can create/edit =====
            'all-work-orders': { allUsers: true },
            'create-work-order': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['jobs:create'] },
            'emergency-job': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['jobs:create'] },
            'job-templates': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['jobs:view'] },
            'recurring-jobs': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['jobs:view'] },
            'job-history': { allUsers: true },
            'agreements': { allUsers: true },
            'create-agreement': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['jobs:create'] },
            // ===== SCHEDULING - admin/owner/dispatcher (full), technician (view only) =====
            'scheduler': { roles: ['admin', 'owner', 'dispatcher', 'technician'], permissions: ['jobs:view'] },
            'todays-schedule': { roles: ['admin', 'owner', 'dispatcher', 'technician'], permissions: ['jobs:view'] },
            'weekly-view': { roles: ['admin', 'owner', 'dispatcher', 'technician'], permissions: ['jobs:view'] },
            'route-optimization': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['jobs:assign'] },
            'technician-availability': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['technicians:view'] },
            'emergency-dispatch': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['jobs:assign'] },
            'calendar-settings': { roles: ['admin', 'owner'], permissions: ['settings:update'] },
            // ===== TEAM - admin/owner/dispatcher only =====
            'all-technicians': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['technicians:view'] },
            'add-technician': { roles: ['admin', 'owner'], permissions: ['technicians:manage'] },
            'technician-profiles': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['technicians:view'] },
            'availability-management': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['technicians:view'] },
            'performance-reports': { roles: ['admin', 'owner'], permissions: ['reports:generate'] },
            'training-records': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['technicians:view'] },
            'payroll-integration': { roles: ['admin', 'owner'], permissions: ['financial:view'] },
            // ===== FINANCIAL - admin/owner only =====
            'finance-overview': { roles: ['admin', 'owner'], permissions: ['financial:view'] },
            'billing-management': { roles: ['admin', 'owner'], permissions: ['invoices:view'] },
            'create-invoice': { roles: ['admin', 'owner'], permissions: ['invoices:create'] },
            'process-payment': { roles: ['admin', 'owner'], permissions: ['invoices:update'] },
            'payment-history': { roles: ['admin', 'owner'], permissions: ['invoices:view'] },
            'financial-reports': { roles: ['admin', 'owner'], permissions: ['reports:generate'] },
            'tax-reports': { roles: ['admin', 'owner'], permissions: ['reports:generate'] },
            'profit-analysis': { roles: ['admin', 'owner'], permissions: ['reports:generate'] },
            // ===== COMMUNICATIONS - All authenticated users =====
            'messages': { allUsers: true },
            'email-campaigns': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['communications:manage'] },
            'sms-campaigns': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['communications:manage'] },
            'templates': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['communications:manage'] },
            'automation': { roles: ['admin', 'owner'], permissions: ['settings:update'] },
            'communication-history': { allUsers: true },
            // ===== REPORTS - admin/owner/dispatcher only =====
            'all-reports': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['reports:view'] },
            'business-analytics': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['reports:view'] },
            'customer-reports': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['reports:view'] },
            'technician-reports': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['reports:view'] },
            'service-reports': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['reports:view'] },
            'custom-reports': { roles: ['admin', 'owner'], permissions: ['reports:generate'] },
            'scheduled-reports': { roles: ['admin', 'owner'], permissions: ['reports:generate'] },
            'export-data': { roles: ['admin', 'owner', 'dispatcher'], permissions: ['reports:export'] },
            // ===== TOOLS =====
            'global-search': { allUsers: true },
            'knowledge-base': { allUsers: true }, // All users
            'file-uploads': { allUsers: true }, // All users
            'system-settings': { roles: ['admin', 'owner'], permissions: ['settings:view'] },
            'user-management': { roles: ['admin', 'owner'], permissions: ['users:manage'] },
            'company-settings': { roles: ['admin', 'owner'], permissions: ['settings:update'] },
            'help-support': { allUsers: true }, // All users
            'keyboard-shortcuts': { allUsers: true }, // All users (UI feature)
        };
        var rule = accessRules[itemId];
        // DENY BY DEFAULT - if no rule is defined, deny access
        if (!rule) {
            logger_1.logger.warn('Navigation item has no access rule defined', { itemId: itemId }, 'SecondaryNavigationBar');
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
            var hasAccess_1 = hasRequiredRole || hasRequiredPermission;
            if (!hasAccess_1 && process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('Access check failed (role OR permission required)', {
                    itemId: itemId,
                    requiredRoles: rule.roles,
                    requiredPermissions: rule.permissions,
                    userRoles: userRoles,
                    userPermissions: userPermissions,
                    hasRequiredRole: hasRequiredRole,
                    hasRequiredPermission: hasRequiredPermission
                }, 'SecondaryNavigationBar');
            }
            return hasAccess_1;
        }
        // If only roles are specified, user must have the role
        if (rule.roles && rule.roles.length > 0) {
            if (!hasRequiredRole)
                return false;
        }
        // If only permissions are specified, user must have the permission
        if (rule.permissions && rule.permissions.length > 0) {
            if (!hasRequiredPermission) {
                // Debug logging for permission issues
                if (process.env.NODE_ENV === 'development') {
                    logger_1.logger.debug('Permission check failed', {
                        itemId: itemId,
                        requiredPermissions: rule.permissions,
                        userPermissions: userPermissions,
                        userRoles: userRoles
                    }, 'SecondaryNavigationBar');
                }
                return false;
            }
        }
        return true;
    };
    // Comprehensive dropdown categories
    var dropdownCategories = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: lucide_react_1.Home,
            color: 'hover:bg-purple-50 hover:text-purple-700',
            items: [
                { id: 'main-dashboard', label: 'Main Dashboard', icon: lucide_react_1.Home, path: '/dashboard', description: 'Overview and key metrics' },
                { divider: true, id: 'div1', label: '', icon: lucide_react_1.Home },
                { id: 'analytics-overview', label: 'Analytics Overview', icon: lucide_react_1.TrendingUp, path: '/charts', description: 'Business intelligence dashboard' },
                { id: 'performance-metrics', label: 'Performance Metrics', icon: lucide_react_1.BarChart3, path: '/reports/performance', description: 'KPI and performance tracking' }
            ]
        },
        {
            id: 'customers',
            label: 'Customers',
            icon: lucide_react_1.Users,
            color: 'hover:bg-blue-50 hover:text-blue-700',
            items: [
                { id: 'all-customers', label: 'All Customers', icon: lucide_react_1.Users, path: '/customers', badge: '2.1k', description: 'Browse and manage customers' },
                { id: 'add-customer', label: 'Add New Customer', icon: lucide_react_1.UserPlus, path: '/customers/new', description: 'Create new customer record' },
                { id: 'search-customers', label: 'Search Customers', icon: lucide_react_1.Search, path: '/customers/search', description: 'Advanced customer search' },
                { divider: true, id: 'div2', label: '', icon: lucide_react_1.Users },
                { id: 'customer-analytics', label: 'Customer Analytics', icon: lucide_react_1.TrendingUp, path: '/customers/analytics', description: 'Customer insights and metrics' },
                { id: 'customer-map', label: 'Customer Map', icon: lucide_react_1.MapPin, path: '/customers/map', description: 'Geographic customer view' },
                { id: 'customer-segments', label: 'Customer Segments', icon: lucide_react_1.Filter, path: '/customers/segments', description: 'Customer categorization' },
                { divider: true, id: 'div3', label: '', icon: lucide_react_1.Users },
                { id: 'import-customers', label: 'Import Customers', icon: lucide_react_1.Upload, path: '/customers/import', description: 'Bulk customer import' },
                { id: 'export-customers', label: 'Export Customers', icon: lucide_react_1.Download, path: '/customers/export', description: 'Export customer data' }
            ]
        },
        {
            id: 'work-orders',
            label: 'Work Orders',
            icon: lucide_react_1.ClipboardList,
            color: 'hover:bg-green-50 hover:text-green-700',
            items: [
                { id: 'all-work-orders', label: 'All Work Orders', icon: lucide_react_1.ClipboardList, path: '/work-orders', badge: 12, description: 'Manage all work orders' },
                { id: 'create-work-order', label: 'Create Work Order', icon: lucide_react_1.Plus, path: '/work-orders/new', description: 'Create new work order' },
                { id: 'emergency-job', label: 'Emergency Job', icon: lucide_react_1.AlertCircle, path: '/work-orders/new?priority=emergency', color: 'text-red-600', description: 'Create urgent work order' },
                { divider: true, id: 'div4', label: '', icon: lucide_react_1.ClipboardList },
                { id: 'job-templates', label: 'Job Templates', icon: lucide_react_1.Star, path: '/work-orders/templates', description: 'Manage work order templates' },
                { id: 'recurring-jobs', label: 'Recurring Jobs', icon: lucide_react_1.RefreshCw, path: '/work-orders/recurring', description: 'Scheduled recurring services' },
                { id: 'job-history', label: 'Job History', icon: lucide_react_1.Archive, path: '/work-orders/history', description: 'Completed work orders' },
                { divider: true, id: 'div5', label: '', icon: lucide_react_1.ClipboardList },
                { id: 'agreements', label: 'Service Agreements', icon: lucide_react_1.FileText, path: '/agreements', badge: 5, description: 'Customer service contracts' },
                { id: 'create-agreement', label: 'Create Agreement', icon: lucide_react_1.Plus, path: '/agreements/create', description: 'New service agreement' }
            ]
        },
        {
            id: 'scheduling',
            label: 'Scheduling',
            icon: lucide_react_1.Calendar,
            color: 'hover:bg-purple-50 hover:text-purple-700',
            items: [
                { id: 'scheduler', label: 'Main Scheduler', icon: lucide_react_1.Calendar, path: '/scheduler', badge: 47, description: 'Schedule and dispatch jobs' },
                { id: 'todays-schedule', label: "Today's Schedule", icon: lucide_react_1.Clock, path: '/scheduler?view=today', description: 'View today\'s scheduled jobs' },
                { id: 'weekly-view', label: 'Weekly View', icon: lucide_react_1.Calendar, path: '/scheduler?view=week', description: 'Week overview' },
                { divider: true, id: 'div6', label: '', icon: lucide_react_1.Calendar },
                { id: 'route-optimization', label: 'Route Optimization', icon: lucide_react_1.MapPin, path: '/routing', description: 'Optimize technician routes' },
                { id: 'technician-availability', label: 'Technician Availability', icon: lucide_react_1.UserCheck, path: '/technicians?view=availability', description: 'Check team schedules' },
                { id: 'emergency-dispatch', label: 'Emergency Dispatch', icon: lucide_react_1.AlertCircle, path: '/scheduler?priority=emergency', color: 'text-red-600', description: 'Emergency job dispatch' },
                { divider: true, id: 'div7', label: '', icon: lucide_react_1.Calendar },
                { id: 'calendar-settings', label: 'Calendar Settings', icon: lucide_react_1.Settings, path: '/settings/calendar', description: 'Configure scheduling preferences' }
            ]
        },
        {
            id: 'team',
            label: 'Team',
            icon: lucide_react_1.UserCheck,
            color: 'hover:bg-indigo-50 hover:text-indigo-700',
            items: [
                { id: 'all-technicians', label: 'All Technicians', icon: lucide_react_1.Users, path: '/technicians', badge: 8, description: 'Manage technician team' },
                { id: 'add-technician', label: 'Add Technician', icon: lucide_react_1.UserPlus, path: '/technicians/new', description: 'Add new team member' },
                { id: 'technician-profiles', label: 'Technician Profiles', icon: lucide_react_1.User, path: '/technicians/profiles', description: 'View detailed profiles' },
                { divider: true, id: 'div8', label: '', icon: lucide_react_1.UserCheck },
                { id: 'availability-management', label: 'Availability Management', icon: lucide_react_1.Calendar, path: '/technicians/availability', description: 'Manage schedules and time off' },
                { id: 'performance-reports', label: 'Performance Reports', icon: lucide_react_1.TrendingUp, path: '/reports/technicians', description: 'Team performance metrics' },
                { id: 'training-records', label: 'Training & Certifications', icon: lucide_react_1.CheckSquare, path: '/technicians/training', description: 'Training and certification tracking' },
                { divider: true, id: 'div9', label: '', icon: lucide_react_1.UserCheck },
                { id: 'payroll-integration', label: 'Payroll Integration', icon: lucide_react_1.DollarSign, path: '/technicians/payroll', description: 'Time tracking and payroll' }
            ]
        },
        {
            id: 'financial',
            label: 'Financial',
            icon: lucide_react_1.DollarSign,
            color: 'hover:bg-emerald-50 hover:text-emerald-700',
            items: [
                { id: 'finance-overview', label: 'Finance Overview', icon: lucide_react_1.DollarSign, path: '/finance', badge: '$45k', description: 'Financial dashboard' },
                { id: 'billing-management', label: 'Billing Management', icon: lucide_react_1.CreditCard, path: '/billing', badge: 'NEW', description: 'Invoice and billing system' },
                { divider: true, id: 'div10', label: '', icon: lucide_react_1.DollarSign },
                { id: 'create-invoice', label: 'Create Invoice', icon: lucide_react_1.Plus, path: '/billing/invoices/new', description: 'Generate customer invoice' },
                { id: 'process-payment', label: 'Process Payment', icon: lucide_react_1.CreditCard, path: '/billing/payments/new', description: 'Process customer payment' },
                { id: 'payment-history', label: 'Payment History', icon: lucide_react_1.Archive, path: '/billing/payments', description: 'View payment records' },
                { divider: true, id: 'div11', label: '', icon: lucide_react_1.DollarSign },
                { id: 'financial-reports', label: 'Financial Reports', icon: lucide_react_1.BarChart3, path: '/reports/financial', description: 'Revenue and expense reports' },
                { id: 'tax-reports', label: 'Tax Reports', icon: lucide_react_1.FileText, path: '/reports/tax', description: 'Tax reporting and compliance' },
                { id: 'profit-analysis', label: 'Profit Analysis', icon: lucide_react_1.TrendingUp, path: '/reports/profit', description: 'Profitability analysis' }
            ]
        },
        {
            id: 'communications',
            label: 'Communications',
            icon: lucide_react_1.MessageCircle,
            color: 'hover:bg-blue-50 hover:text-blue-700',
            items: [
                { id: 'messages', label: 'Messages', icon: lucide_react_1.MessageCircle, path: '/communications', badge: 3, description: 'Customer communications' },
                { id: 'email-campaigns', label: 'Email Campaigns', icon: lucide_react_1.Mail, path: '/communications/email', description: 'Email marketing campaigns' },
                { id: 'sms-campaigns', label: 'SMS Campaigns', icon: lucide_react_1.MessageCircle, path: '/communications/sms', description: 'SMS marketing and alerts' },
                { divider: true, id: 'div12', label: '', icon: lucide_react_1.MessageCircle },
                { id: 'templates', label: 'Message Templates', icon: lucide_react_1.FileText, path: '/communications/templates', description: 'Communication templates' },
                { id: 'automation', label: 'Automation Rules', icon: lucide_react_1.Settings, path: '/communications/automation', description: 'Automated communication workflows' },
                { divider: true, id: 'div13', label: '', icon: lucide_react_1.MessageCircle },
                { id: 'communication-history', label: 'Communication History', icon: lucide_react_1.Archive, path: '/communications/history', description: 'Past communications log' }
            ]
        },
        {
            id: 'reports',
            label: 'Reports',
            icon: lucide_react_1.BarChart3,
            color: 'hover:bg-orange-50 hover:text-orange-700',
            items: [
                { id: 'all-reports', label: 'All Reports', icon: lucide_react_1.BarChart3, path: '/reports', description: 'Report dashboard' },
                { id: 'business-analytics', label: 'Business Analytics', icon: lucide_react_1.TrendingUp, path: '/charts', description: 'Advanced analytics and charts' },
                { divider: true, id: 'div14', label: '', icon: lucide_react_1.BarChart3 },
                { id: 'financial-reports', label: 'Financial Reports', icon: lucide_react_1.DollarSign, path: '/reports/financial', description: 'Revenue and financial analysis' },
                { id: 'customer-reports', label: 'Customer Reports', icon: lucide_react_1.Users, path: '/reports/customers', description: 'Customer analytics and insights' },
                { id: 'technician-reports', label: 'Technician Reports', icon: lucide_react_1.UserCheck, path: '/reports/technicians', description: 'Team performance reports' },
                { id: 'service-reports', label: 'Service Reports', icon: lucide_react_1.ClipboardList, path: '/reports/services', description: 'Service delivery analytics' },
                { divider: true, id: 'div15', label: '', icon: lucide_react_1.BarChart3 },
                { id: 'custom-reports', label: 'Custom Reports', icon: lucide_react_1.Settings, path: '/reports/custom', description: 'Build custom reports' },
                { id: 'scheduled-reports', label: 'Scheduled Reports', icon: lucide_react_1.Clock, path: '/reports/scheduled', description: 'Automated report delivery' },
                { id: 'export-data', label: 'Export Data', icon: lucide_react_1.Download, path: '/reports/export', description: 'Data export tools' }
            ]
        },
        {
            id: 'tools',
            label: 'Tools',
            icon: lucide_react_1.Settings,
            color: 'hover:bg-gray-50 hover:text-gray-700',
            items: [
                { id: 'global-search', label: 'Global Search', icon: lucide_react_1.Search, path: '/global-search-demo', description: 'Search across all data' },
                { id: 'knowledge-base', label: 'Knowledge Base', icon: lucide_react_1.BookOpen, path: '/knowledge', description: 'Documentation and help' },
                { id: 'file-uploads', label: 'File Management', icon: lucide_react_1.Upload, path: '/uploads', description: 'File upload and management' },
                { divider: true, id: 'div16', label: '', icon: lucide_react_1.Settings },
                { id: 'system-settings', label: 'System Settings', icon: lucide_react_1.Settings, path: '/settings', description: 'Application configuration' },
                { id: 'user-management', label: 'User Management', icon: lucide_react_1.Users, path: '/settings/users', description: 'Manage user accounts' },
                { id: 'company-settings', label: 'Company Settings', icon: lucide_react_1.Settings, path: '/settings/company', description: 'Company profile and branding' },
                { divider: true, id: 'div17', label: '', icon: lucide_react_1.Settings },
                { id: 'help-support', label: 'Help & Support', icon: lucide_react_1.HelpCircle, path: '/help', description: 'Get help and support' },
                { id: 'keyboard-shortcuts', label: 'Keyboard Shortcuts', icon: lucide_react_1.Settings, action: function () {
                        logger_1.logger.debug('Keyboard shortcuts requested', {}, 'SecondaryNavigationBar');
                        // TODO: Open keyboard shortcuts modal
                    }, description: 'View available shortcuts' }
            ]
        }
    ];
    // Filter navigation items based on user roles and permissions
    var filteredCategories = (0, react_1.useMemo)(function () {
        return dropdownCategories.map(function (category) { return (__assign(__assign({}, category), { items: category.items.filter(function (item) {
                // Don't filter dividers
                if (item.divider)
                    return true;
                return hasAccess(item.id);
            }) })); }).filter(function (category) {
            // Remove categories that only contain dividers (no actual navigable items)
            var hasNavigableItems = category.items.some(function (item) { return !item.divider; });
            return hasNavigableItems;
        });
    }, [user]);
    // Close dropdown when clicking outside
    (0, react_1.useEffect)(function () {
        var handleClickOutside = function (event) {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return function () { return document.removeEventListener('mousedown', handleClickOutside); };
    }, []);
    // Handle dropdown toggle
    var handleDropdownToggle = function (categoryId) {
        setActiveDropdown(activeDropdown === categoryId ? null : categoryId);
    };
    // Handle item click
    var handleItemClick = function (item) {
        logger_1.logger.debug('Navigation item clicked', { itemId: item.id, currentPath: location.pathname }, 'SecondaryNavigationBar');
        // Special handling for customers page - add as canvas card if on dashboard
        if (item.id === 'all-customers' && location.pathname === '/dashboard') {
            logger_1.logger.debug('Adding customers page as canvas card', {}, 'SecondaryNavigationBar');
            // Dispatch a custom event to add the card to the canvas
            var addCardEvent = new CustomEvent('addCanvasCard', {
                detail: { type: 'customers-page', position: { x: 0, y: 0 } }
            });
            window.dispatchEvent(addCardEvent);
            setActiveDropdown(null);
            return;
        }
        // Special handling for customers page - open as popup if page card context available
        if (item.id === 'all-customers' && pageCardContext) {
            logger_1.logger.debug('Opening customers page as popup card', {}, 'SecondaryNavigationBar');
            // Import the component dynamically
            Promise.resolve().then(function () { return __importStar(require('@/components/dashboard/CustomersPageCard')); }).then(function (_a) {
                var CustomersPageCard = _a.default;
                pageCardContext.openPageCard({
                    title: 'Customers',
                    icon: lucide_react_1.Users,
                    component: CustomersPageCard,
                    size: { width: 1200, height: 800 },
                });
                logger_1.logger.debug('Customers page popup card opened', {}, 'SecondaryNavigationBar');
            });
            setActiveDropdown(null);
            return;
        }
        if (item.path) {
            navigate(item.path);
        }
        else if (item.action) {
            item.action();
        }
        setActiveDropdown(null); // Close dropdown after action
    };
    // Get current active category based on route
    var getActiveCategory = function () {
        var path = location.pathname;
        if (path === '/dashboard' || path === '/')
            return 'dashboard';
        if (path.startsWith('/customers'))
            return 'customers';
        if (path.startsWith('/work-orders') || path.startsWith('/agreements'))
            return 'work-orders';
        if (path.startsWith('/scheduler') || path.startsWith('/routing'))
            return 'scheduling';
        if (path.startsWith('/technicians'))
            return 'team';
        if (path.startsWith('/finance') || path.startsWith('/billing'))
            return 'financial';
        if (path.startsWith('/communications'))
            return 'communications';
        if (path.startsWith('/reports') || path.startsWith('/charts'))
            return 'reports';
        if (path.startsWith('/settings') || path.startsWith('/knowledge') || path.startsWith('/uploads'))
            return 'tools';
        return null;
    };
    var activeCategory = getActiveCategory();
    return ((0, jsx_runtime_1.jsx)("div", { className: "bg-white border-b border-gray-200 shadow-sm ".concat(className), ref: navRef, children: (0, jsx_runtime_1.jsx)("div", { className: "flex items-center px-6 py-2 gap-1", children: filteredCategories.map(function (category, index) {
                var CategoryIcon = category.icon;
                var isActive = activeCategory === category.id;
                var isDropdownOpen = activeDropdown === category.id;
                var isRightAligned = index >= filteredCategories.length - 2; // Last 2 categories align right
                return ((0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: function () { return handleDropdownToggle(category.id); }, className: "\n                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200\n                  ".concat(isActive
                                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                : "text-gray-600 ".concat(category.color), "\n                  ").concat(isDropdownOpen ? 'bg-gray-100 text-gray-800' : '', "\n                "), children: [(0, jsx_runtime_1.jsx)(CategoryIcon, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { children: category.label }), (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronDown, { className: "w-3 h-3 transition-transform duration-200 ".concat(isDropdownOpen ? 'rotate-180' : '') })] }), isDropdownOpen && ((0, jsx_runtime_1.jsxs)("div", { className: "absolute top-full mt-1 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-in slide-in-from-top duration-200 ".concat(isRightAligned ? 'right-0' : 'left-0'), children: [(0, jsx_runtime_1.jsx)("div", { className: "px-4 py-2 border-b border-gray-100 mb-2", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-gradient-to-r ".concat(category.color.includes('purple') ? 'from-purple-500 to-purple-600' :
                                                    category.color.includes('blue') ? 'from-blue-500 to-blue-600' :
                                                        category.color.includes('green') ? 'from-green-500 to-green-600' :
                                                            category.color.includes('indigo') ? 'from-indigo-500 to-indigo-600' :
                                                                category.color.includes('emerald') ? 'from-emerald-500 to-emerald-600' :
                                                                    category.color.includes('orange') ? 'from-orange-500 to-orange-600' :
                                                                        'from-gray-500 to-gray-600', " text-white rounded-lg flex items-center justify-center"), children: (0, jsx_runtime_1.jsx)(CategoryIcon, { className: "w-4 h-4" }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("div", { className: "font-semibold text-gray-800", children: category.label }) })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "max-h-96 overflow-y-auto", children: category.items.map(function (item) {
                                        if (item.divider) {
                                            return (0, jsx_runtime_1.jsx)("div", { className: "h-px bg-gray-200 my-2 mx-4" }, item.id);
                                        }
                                        var ItemIcon = item.icon;
                                        return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return handleItemClick(item); }, className: "w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left group", title: item.description, children: [(0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-gray-100 group-hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors", children: (0, jsx_runtime_1.jsx)(ItemIcon, { className: "w-4 h-4 ".concat(item.color || 'text-gray-600') }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-gray-800 truncate", children: item.label }), item.description && ((0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500 truncate", children: item.description }))] }), item.badge && ((0, jsx_runtime_1.jsx)("div", { className: "text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium", children: item.badge }))] }, item.id));
                                    }) })] }))] }, category.id));
            }) }) }));
}
