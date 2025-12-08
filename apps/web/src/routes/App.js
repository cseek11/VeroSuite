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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_router_dom_1 = require("react-router-dom");
var react_1 = require("react");
var auth_1 = require("@/stores/auth");
var Spinner_1 = require("@/ui/Spinner");
var SkipLink_1 = __importDefault(require("@/components/SkipLink"));
var useWebVitals_1 = require("@/hooks/useWebVitals");
var useUserRefresh_1 = require("@/hooks/useUserRefresh");
var logger_1 = require("@/utils/logger");
var RoleProtectedRoute_1 = require("@/components/auth/RoleProtectedRoute");
// LayoutWrapper removed as part of V4 migration
var V4Layout_1 = __importDefault(require("@/components/layout/V4Layout"));
// LegacyDashboard removed as part of V4 migration
// LegacyEnhancedDashboard removed as part of V4 migration
var VeroCardsV3_1 = __importDefault(require("./VeroCardsV3"));
var RegionDashboardPage_1 = require("./dashboard/RegionDashboardPage");
var Communications_1 = __importDefault(require("./Communications"));
var Finance_1 = __importDefault(require("./Finance"));
var Billing_1 = __importDefault(require("./Billing"));
var Knowledge_1 = __importDefault(require("./Knowledge"));
var Scheduler_1 = __importDefault(require("./Scheduler"));
var Jobs_1 = __importDefault(require("./Jobs"));
var compliance_1 = __importDefault(require("./compliance"));
var CustomersPage_1 = __importDefault(require("@/components/CustomersPage"));
var Routing_1 = __importDefault(require("./Routing"));
var Reports_1 = __importDefault(require("./Reports"));
var Uploads_1 = __importDefault(require("./Uploads"));
var Settings_1 = __importDefault(require("./Settings"));
var Charts_1 = __importDefault(require("./Charts"));
var WorkOrdersPage_1 = __importDefault(require("@/pages/WorkOrdersPage"));
var CreateWorkOrderPage_1 = __importDefault(require("@/pages/CreateWorkOrderPage"));
var WorkOrderDetailPage_1 = __importDefault(require("@/pages/WorkOrderDetailPage"));
var EditWorkOrderPage_1 = __importDefault(require("@/pages/EditWorkOrderPage"));
var CustomerPage_1 = __importDefault(require("@/components/CustomerPage"));
var TechniciansPage_1 = __importDefault(require("@/pages/TechniciansPage"));
var CreateTechnicianPage_1 = __importDefault(require("@/pages/CreateTechnicianPage"));
var EditTechnicianPage_1 = __importDefault(require("@/pages/EditTechnicianPage"));
var TechnicianDetailPage_1 = __importDefault(require("@/pages/TechnicianDetailPage"));
var SearchAnalyticsDashboard_1 = __importDefault(require("@/components/analytics/SearchAnalyticsDashboard"));
var CustomerManagement_1 = __importDefault(require("@/pages/CustomerManagement"));
var ServiceManagement_1 = __importDefault(require("@/pages/ServiceManagement"));
var AgreementsPage_1 = __importDefault(require("@/pages/AgreementsPage"));
var CreateAgreementPage_1 = __importDefault(require("@/pages/CreateAgreementPage"));
var UserManagement_1 = __importDefault(require("@/pages/UserManagement"));
var SessionsPage_1 = __importDefault(require("@/pages/SessionsPage"));
var LoginPage = (0, react_1.lazy)(function () { return Promise.resolve().then(function () { return __importStar(require('@/routes/Login')); }); });
function PrivateRoute(_a) {
    var children = _a.children;
    var token = (0, auth_1.useAuthStore)(function (s) { return s.token; });
    var user = (0, auth_1.useAuthStore)(function (s) { return s.user; });
    // More strict authentication check
    if (!token || !user) {
        logger_1.logger.debug('PrivateRoute: No token or user, redirecting to login', {}, 'App');
        return (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: "/login", replace: true });
    }
    return children;
}
// Simple fallback component
function DashboardFallback() {
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gray-50 p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-7xl mx-auto", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Dashboard" }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-xl shadow-sm p-6", children: (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Dashboard is loading..." }) })] }) }));
}
function App() {
    var token = (0, auth_1.useAuthStore)(function (s) { return s.token; });
    var user = (0, auth_1.useAuthStore)(function (s) { return s.user; });
    var clearAuth = (0, auth_1.useAuthStore)(function (s) { return s.clear; });
    var hasInitialized = (0, react_1.useRef)(false);
    // Monitor Web Vitals for performance tracking
    (0, useWebVitals_1.useWebVitals)(process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development');
    // Force clear auth only once on app start (not on every navigation)
    // This should only run once when the app first loads, not when navigating
    (0, react_1.useEffect)(function () {
        if (hasInitialized.current)
            return;
        // Wait a bit to allow Zustand to load persisted state from localStorage
        var checkAuth = setTimeout(function () {
            if (hasInitialized.current)
                return;
            hasInitialized.current = true;
            // Don't clear auth if we're on the login page (user might be logging in)
            var currentPath = window.location.pathname;
            if (currentPath === '/login') {
                if (process.env.NODE_ENV === 'development') {
                    logger_1.logger.debug('On login page, skipping auth check', {}, 'App');
                }
                return;
            }
            // Check localStorage directly to avoid race conditions with Zustand
            var storedAuth = localStorage.getItem('verofield_auth');
            var hasStoredAuth = false;
            if (storedAuth) {
                try {
                    var parsed = JSON.parse(storedAuth);
                    hasStoredAuth = !!(parsed.token && parsed.user);
                }
                catch (_a) {
                    // Invalid JSON, treat as no auth
                }
            }
            // Also check current Zustand state (might have loaded by now)
            var currentToken = auth_1.useAuthStore.getState().token;
            var currentUser = auth_1.useAuthStore.getState().user;
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('App mounted - initial cleanup', {}, 'App');
                logger_1.logger.debug('Initial token', { tokenFound: !!token, currentTokenFound: !!currentToken }, 'App');
                logger_1.logger.debug('Initial user', { userFound: !!user, currentUserFound: !!currentUser }, 'App');
                logger_1.logger.debug('Stored auth', { hasStoredAuth: hasStoredAuth }, 'App');
            }
            // Only clear if there's no valid authentication in Zustand state, localStorage, OR current state
            // This prevents clearing auth during the brief moment when Zustand hasn't loaded yet
            var hasAnyAuth = hasStoredAuth || currentToken || currentUser || token || user;
            if (!hasAnyAuth) {
                if (process.env.NODE_ENV === 'development') {
                    logger_1.logger.debug('No valid auth found anywhere, clearing all data', {}, 'App');
                }
                clearAuth();
                localStorage.clear(); // Clear all localStorage
                sessionStorage.clear(); // Clear all sessionStorage
                // Force redirect to login
                setTimeout(function () {
                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login';
                    }
                }, 100);
            }
            else {
                if (process.env.NODE_ENV === 'development') {
                    logger_1.logger.debug('Valid auth found, keeping user logged in', {}, 'App');
                }
            }
        }, 500); // Wait 500ms for Zustand to load
        return function () { return clearTimeout(checkAuth); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run once on mount, not on every navigation
    // Set up periodic user refresh
    (0, useUserRefresh_1.useUserRefresh)();
    // Refresh user data on navigation to key routes (but not immediately after login)
    // This is now disabled to prevent logout issues - periodic refresh is sufficient
    // const previousPathRef = useRef<string | null>(null);
    // useEffect(() => {
    //   if (!user || !token) {
    //     previousPathRef.current = location.pathname;
    //     return;
    //   }
    //   // Don't refresh if we just navigated from login or if path hasn't changed
    //   if (previousPathRef.current === location.pathname) {
    //     return;
    //   }
    //   const keyRoutes = ['/dashboard', '/settings', '/settings/users'];
    //   const shouldRefresh = keyRoutes.some(route => location.pathname.startsWith(route));
    //   if (shouldRefresh && previousPathRef.current !== '/login') {
    //     // Add a small delay to avoid refreshing too frequently
    //     const refreshTimeout = setTimeout(() => {
    //       refreshUser().catch((error) => {
    //         logger.error('Error refreshing user on navigation', error, 'App');
    //       });
    //     }, 500);
    //     previousPathRef.current = location.pathname;
    //     return () => clearTimeout(refreshTimeout);
    //   } else {
    //     previousPathRef.current = location.pathname;
    //   }
    // }, [location.pathname, user, token, refreshUser]);
    // Check if user is properly authenticated
    var isAuthenticated = token && user;
    if (process.env.NODE_ENV === 'development') {
        logger_1.logger.debug('App render', { tokenFound: !!token, userFound: !!user, isAuthenticated: isAuthenticated }, 'App');
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "w-full h-screen", style: {
            background: "url('/branding/crm_bg.png') center center / cover no-repeat fixed",
            position: 'relative',
        }, children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 pointer-events-none", style: { backgroundColor: 'rgba(255,255,255,0.25)' } }), (0, jsx_runtime_1.jsx)(SkipLink_1.default, {}), (0, jsx_runtime_1.jsx)("main", { id: "main-content", tabIndex: -1, className: "h-full overflow-hidden", children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(Spinner_1.Spinner, {}), children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/login", element: (0, jsx_runtime_1.jsx)(LoginPage, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/", element: isAuthenticated ? (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: "/dashboard", replace: true }) : (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: "/login", replace: true }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/dashboard", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(V4Layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(DashboardFallback, {}), children: (0, jsx_runtime_1.jsx)(VeroCardsV3_1.default, { showHeader: true }) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/enhanced-dashboard", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(V4Layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(DashboardFallback, {}), children: (0, jsx_runtime_1.jsx)(VeroCardsV3_1.default, { showHeader: false }) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/resizable-dashboard", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(V4Layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(DashboardFallback, {}), children: (0, jsx_runtime_1.jsx)(VeroCardsV3_1.default, { showHeader: false }) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/region-dashboard", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(V4Layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(DashboardFallback, {}), children: (0, jsx_runtime_1.jsx)(RegionDashboardPage_1.RegionDashboardPage, {}) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/scheduler", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(RoleProtectedRoute_1.RoleProtectedRoute, { allowedRoles: ['admin', 'owner', 'dispatcher', 'technician'], requiredPermissions: ['jobs:view'], children: (0, jsx_runtime_1.jsx)(V4Layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(DashboardFallback, {}), children: (0, jsx_runtime_1.jsx)(Scheduler_1.default, {}) }) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/jobs", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(V4Layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(DashboardFallback, {}), children: (0, jsx_runtime_1.jsx)(Jobs_1.default, {}) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/work-orders", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(V4Layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(DashboardFallback, {}), children: (0, jsx_runtime_1.jsx)(WorkOrdersPage_1.default, {}) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/work-orders/:id", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(V4Layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(DashboardFallback, {}), children: (0, jsx_runtime_1.jsx)(WorkOrderDetailPage_1.default, {}) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/work-orders/:id/edit", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(RoleProtectedRoute_1.RoleProtectedRoute, { allowedRoles: ['admin', 'owner', 'dispatcher'], requiredPermissions: ['jobs:update'], children: (0, jsx_runtime_1.jsx)(V4Layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(DashboardFallback, {}), children: (0, jsx_runtime_1.jsx)(EditWorkOrderPage_1.default, {}) }) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/work-orders/new", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(RoleProtectedRoute_1.RoleProtectedRoute, { allowedRoles: ['admin', 'owner', 'dispatcher'], requiredPermissions: ['jobs:create'], children: (0, jsx_runtime_1.jsx)(V4Layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(DashboardFallback, {}), children: (0, jsx_runtime_1.jsx)(CreateWorkOrderPage_1.default, {}) }) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/technicians", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(RoleProtectedRoute_1.RoleProtectedRoute, { allowedRoles: ['admin', 'owner', 'dispatcher'], requiredPermissions: ['technicians:view'], children: (0, jsx_runtime_1.jsx)(V4Layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(DashboardFallback, {}), children: (0, jsx_runtime_1.jsx)(TechniciansPage_1.default, {}) }) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/technicians/new", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(RoleProtectedRoute_1.RoleProtectedRoute, { allowedRoles: ['admin', 'owner'], requiredPermissions: ['technicians:manage'], children: (0, jsx_runtime_1.jsx)(V4Layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(DashboardFallback, {}), children: (0, jsx_runtime_1.jsx)(CreateTechnicianPage_1.default, {}) }) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/technicians/:id", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(V4Layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(DashboardFallback, {}), children: (0, jsx_runtime_1.jsx)(TechnicianDetailPage_1.default, {}) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/technicians/:id/edit", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(RoleProtectedRoute_1.RoleProtectedRoute, { allowedRoles: ['admin', 'owner'], requiredPermissions: ['technicians:manage'], children: (0, jsx_runtime_1.jsx)(V4Layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(DashboardFallback, {}), children: (0, jsx_runtime_1.jsx)(EditTechnicianPage_1.default, {}) }) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/customers", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(V4Layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(DashboardFallback, {}), children: (0, jsx_runtime_1.jsx)(CustomersPage_1.default, {}) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/customers/new", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(RoleProtectedRoute_1.RoleProtectedRoute, { allowedRoles: ['admin', 'owner', 'dispatcher'], requiredPermissions: ['customers:create'], children: (0, jsx_runtime_1.jsx)(V4Layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(DashboardFallback, {}), children: (0, jsx_runtime_1.jsx)(CustomersPage_1.default, {}) }) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/customers/:customerId", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(V4Layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(DashboardFallback, {}), children: (0, jsx_runtime_1.jsx)(CustomerPage_1.default, {}) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/customer-management", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(V4Layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(DashboardFallback, {}), children: (0, jsx_runtime_1.jsx)(CustomerManagement_1.default, {}) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/service-management", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(V4Layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(DashboardFallback, {}), children: (0, jsx_runtime_1.jsx)(ServiceManagement_1.default, {}) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/agreements", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(V4Layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(DashboardFallback, {}), children: (0, jsx_runtime_1.jsx)(AgreementsPage_1.default, {}) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/agreements/create", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(RoleProtectedRoute_1.RoleProtectedRoute, { allowedRoles: ['admin', 'owner', 'dispatcher'], requiredPermissions: ['jobs:create'], children: (0, jsx_runtime_1.jsx)(V4Layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(DashboardFallback, {}), children: (0, jsx_runtime_1.jsx)(CreateAgreementPage_1.default, {}) }) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/routing", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(RoleProtectedRoute_1.RoleProtectedRoute, { allowedRoles: ['admin', 'owner', 'dispatcher'], requiredPermissions: ['jobs:assign'], children: (0, jsx_runtime_1.jsx)(V4Layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(DashboardFallback, {}), children: (0, jsx_runtime_1.jsx)(Routing_1.default, {}) }) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/reports", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(RoleProtectedRoute_1.RoleProtectedRoute, { allowedRoles: ['admin', 'owner', 'dispatcher'], requiredPermissions: ['reports:view'], children: (0, jsx_runtime_1.jsx)(V4Layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(DashboardFallback, {}), children: (0, jsx_runtime_1.jsx)(Reports_1.default, {}) }) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/uploads", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(V4Layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(DashboardFallback, {}), children: (0, jsx_runtime_1.jsx)(Uploads_1.default, {}) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/settings", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(RoleProtectedRoute_1.RoleProtectedRoute, { allowedRoles: ['admin', 'owner'], requiredPermissions: ['settings:view'], children: (0, jsx_runtime_1.jsx)(V4Layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(DashboardFallback, {}), children: (0, jsx_runtime_1.jsx)(Settings_1.default, {}) }) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/settings/users", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(RoleProtectedRoute_1.RoleProtectedRoute, { allowedRoles: ['admin', 'owner'], requiredPermissions: ['users:manage'], children: (0, jsx_runtime_1.jsx)(V4Layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(DashboardFallback, {}), children: (0, jsx_runtime_1.jsx)(UserManagement_1.default, {}) }) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/sessions", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(RoleProtectedRoute_1.RoleProtectedRoute, { allowedRoles: ['admin', 'owner'], requiredPermissions: ['settings:view'], children: (0, jsx_runtime_1.jsx)(V4Layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(DashboardFallback, {}), children: (0, jsx_runtime_1.jsx)(SessionsPage_1.default, {}) }) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/communications", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(V4Layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(DashboardFallback, {}), children: (0, jsx_runtime_1.jsx)(Communications_1.default, {}) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/finance", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(RoleProtectedRoute_1.RoleProtectedRoute, { allowedRoles: ['admin', 'owner'], requiredPermissions: ['financial:view'], children: (0, jsx_runtime_1.jsx)(V4Layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(DashboardFallback, {}), children: (0, jsx_runtime_1.jsx)(Finance_1.default, {}) }) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/billing", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(RoleProtectedRoute_1.RoleProtectedRoute, { allowedRoles: ['admin', 'owner'], requiredPermissions: ['invoices:view'], children: (0, jsx_runtime_1.jsx)(V4Layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(DashboardFallback, {}), children: (0, jsx_runtime_1.jsx)(Billing_1.default, {}) }) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/billing/:customerId", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(RoleProtectedRoute_1.RoleProtectedRoute, { allowedRoles: ['admin', 'owner'], requiredPermissions: ['invoices:view'], children: (0, jsx_runtime_1.jsx)(V4Layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(DashboardFallback, {}), children: (0, jsx_runtime_1.jsx)(Billing_1.default, {}) }) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/compliance", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(RoleProtectedRoute_1.RoleProtectedRoute, { allowedRoles: ['admin', 'owner'], requiredPermissions: ['compliance:view'], children: (0, jsx_runtime_1.jsx)(V4Layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(DashboardFallback, {}), children: (0, jsx_runtime_1.jsx)(compliance_1.default, {}) }) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/knowledge", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(V4Layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(DashboardFallback, {}), children: (0, jsx_runtime_1.jsx)(Knowledge_1.default, {}) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/charts", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(RoleProtectedRoute_1.RoleProtectedRoute, { allowedRoles: ['admin', 'owner', 'dispatcher'], requiredPermissions: ['reports:view'], children: (0, jsx_runtime_1.jsx)(V4Layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(DashboardFallback, {}), children: (0, jsx_runtime_1.jsx)(Charts_1.default, {}) }) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/search-analytics", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(V4Layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(DashboardFallback, {}), children: (0, jsx_runtime_1.jsx)(SearchAnalyticsDashboard_1.default, {}) }) }) }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/*", element: (0, jsx_runtime_1.jsx)(PrivateRoute, { children: (0, jsx_runtime_1.jsx)(V4Layout_1.default, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(DashboardFallback, {}), children: (0, jsx_runtime_1.jsx)(VeroCardsV3_1.default, { showHeader: true }) }) }) }) })] }) }) })] }));
}
