
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/auth';
import { Spinner } from '@/ui/Spinner';
import SkipLink from '@/components/SkipLink';
import { useWebVitals } from '@/hooks/useWebVitals';
import { useUserRefresh } from '@/hooks/useUserRefresh';
import { logger } from '@/utils/logger';
import { RoleProtectedRoute } from '@/components/auth/RoleProtectedRoute';

// LayoutWrapper removed as part of V4 migration
import V4Layout from '@/components/layout/V4Layout';
// LegacyDashboard removed as part of V4 migration
// LegacyEnhancedDashboard removed as part of V4 migration
import VeroCardsV3 from './VeroCardsV3';
import { RegionDashboardPage } from './dashboard/RegionDashboardPage';
import CommunicationsPage from './Communications';
import FinancePage from './Finance';
import BillingPage from './Billing';
import KnowledgePage from './Knowledge';
import SchedulerPage from './Scheduler';
import JobsPage from './Jobs';
import CustomersPage from '@/components/CustomersPage';
import RoutingPage from './Routing';
import ReportsPage from './Reports';
import UploadsPage from './Uploads';
import SettingsPage from './Settings';
import ChartsPage from './Charts';
import WorkOrdersPage from '@/pages/WorkOrdersPage';
import CreateWorkOrderPage from '@/pages/CreateWorkOrderPage';
import WorkOrderDetailPage from '@/pages/WorkOrderDetailPage';
import EditWorkOrderPage from '@/pages/EditWorkOrderPage';
import CustomerPage from '@/components/CustomerPage';
import TechniciansPage from '@/pages/TechniciansPage';
import CreateTechnicianPage from '@/pages/CreateTechnicianPage';
import EditTechnicianPage from '@/pages/EditTechnicianPage';
import TechnicianDetailPage from '@/pages/TechnicianDetailPage';
import SearchAnalyticsDashboard from '@/components/analytics/SearchAnalyticsDashboard';
import CustomerManagement from '@/pages/CustomerManagement';
import ServiceManagement from '@/pages/ServiceManagement';
import AgreementsPage from '@/pages/AgreementsPage';
import CreateAgreementPage from '@/pages/CreateAgreementPage';
import UserManagement from '@/pages/UserManagement';

const LoginPage = lazy(() => import('@/routes/Login'));

function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  
  // More strict authentication check
  if (!token || !user) {
    logger.debug('PrivateRoute: No token or user, redirecting to login', {}, 'App');
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Simple fallback component
function DashboardFallback() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-gray-600">Dashboard is loading...</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clear);
  const refreshUser = useAuthStore((s) => s.refreshUser);
  const hasInitialized = useRef(false);
  const location = useLocation();
  
  // Monitor Web Vitals for performance tracking
  useWebVitals(process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development');

  // Force clear auth only once on app start (not on every navigation)
  // This should only run once when the app first loads, not when navigating
  useEffect(() => {
    if (hasInitialized.current) return;
    
    // Wait a bit to allow Zustand to load persisted state from localStorage
    const checkAuth = setTimeout(() => {
      if (hasInitialized.current) return;
      hasInitialized.current = true;
      
      // Don't clear auth if we're on the login page (user might be logging in)
      const currentPath = window.location.pathname;
      if (currentPath === '/login') {
        if (process.env.NODE_ENV === 'development') {
          logger.debug('On login page, skipping auth check', {}, 'App');
        }
        return;
      }
      
      // Check localStorage directly to avoid race conditions with Zustand
      const storedAuth = localStorage.getItem('verofield_auth');
      let hasStoredAuth = false;
      if (storedAuth) {
        try {
          const parsed = JSON.parse(storedAuth);
          hasStoredAuth = !!(parsed.token && parsed.user);
        } catch {
          // Invalid JSON, treat as no auth
        }
      }
      
      // Also check current Zustand state (might have loaded by now)
      const currentToken = useAuthStore.getState().token;
      const currentUser = useAuthStore.getState().user;
      
      if (process.env.NODE_ENV === 'development') {
        logger.debug('App mounted - initial cleanup', {}, 'App');
        logger.debug('Initial token', { tokenFound: !!token, currentTokenFound: !!currentToken }, 'App');
        logger.debug('Initial user', { userFound: !!user, currentUserFound: !!currentUser }, 'App');
        logger.debug('Stored auth', { hasStoredAuth }, 'App');
      }
      
      // Only clear if there's no valid authentication in Zustand state, localStorage, OR current state
      // This prevents clearing auth during the brief moment when Zustand hasn't loaded yet
      const hasAnyAuth = hasStoredAuth || currentToken || currentUser || token || user;
      
      if (!hasAnyAuth) {
        if (process.env.NODE_ENV === 'development') {
          logger.debug('No valid auth found anywhere, clearing all data', {}, 'App');
        }
        clearAuth();
        localStorage.clear(); // Clear all localStorage
        sessionStorage.clear(); // Clear all sessionStorage
        
        // Force redirect to login
        setTimeout(() => {
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }, 100);
      } else {
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Valid auth found, keeping user logged in', {}, 'App');
        }
      }
    }, 500); // Wait 500ms for Zustand to load
    
    return () => clearTimeout(checkAuth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount, not on every navigation

  // Set up periodic user refresh
  useUserRefresh();

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
  const isAuthenticated = token && user;
  
  if (process.env.NODE_ENV === 'development') {
    logger.debug('App render', { tokenFound: !!token, userFound: !!user, isAuthenticated }, 'App');
  }

    return (
      <div
        className="w-full h-screen"
        style={{
          background: `url('/branding/crm_bg.png') center center / cover no-repeat fixed`,
          position: 'relative',
        }}
      >
        {/* Subtle light overlay to reduce background intensity by ~25% */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: 'rgba(255,255,255,0.25)' }} />
        <SkipLink />
        <main id="main-content" tabIndex={-1} className="h-full overflow-hidden">
          <Suspense fallback={<Spinner />}>
            <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/" 
              element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <V4Layout>
                    <Suspense fallback={<DashboardFallback />}>
                      <VeroCardsV3 showHeader={true} />
                    </Suspense>
                  </V4Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/enhanced-dashboard"
              element={
                <PrivateRoute>
                  <V4Layout>
                    <Suspense fallback={<DashboardFallback />}>
                      <VeroCardsV3 showHeader={false} />
                    </Suspense>
                  </V4Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/resizable-dashboard"
              element={
                <PrivateRoute>
                  <V4Layout>
                    <Suspense fallback={<DashboardFallback />}>
                      <VeroCardsV3 showHeader={false} />
                    </Suspense>
                  </V4Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/region-dashboard"
              element={
                <PrivateRoute>
                  <V4Layout>
                    <Suspense fallback={<DashboardFallback />}>
                      <RegionDashboardPage />
                    </Suspense>
                  </V4Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/scheduler"
              element={
                <PrivateRoute>
                  <RoleProtectedRoute allowedRoles={['admin', 'owner', 'dispatcher', 'technician']} requiredPermissions={['jobs:view']}>
                    <V4Layout>
                      <Suspense fallback={<DashboardFallback />}>
                        <SchedulerPage />
                      </Suspense>
                    </V4Layout>
                  </RoleProtectedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/jobs"
              element={
                <PrivateRoute>
                  <V4Layout>
                    <Suspense fallback={<DashboardFallback />}>
                      <JobsPage />
                    </Suspense>
                  </V4Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/work-orders"
              element={
                <PrivateRoute>
                  <V4Layout>
                    <Suspense fallback={<DashboardFallback />}>
                      <WorkOrdersPage />
                    </Suspense>
                  </V4Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/work-orders/:id"
              element={
                <PrivateRoute>
                  <V4Layout>
                    <Suspense fallback={<DashboardFallback />}>
                      <WorkOrderDetailPage />
                    </Suspense>
                  </V4Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/work-orders/:id/edit"
              element={
                <PrivateRoute>
                  <RoleProtectedRoute allowedRoles={['admin', 'owner', 'dispatcher']} requiredPermissions={['jobs:update']}>
                    <V4Layout>
                      <Suspense fallback={<DashboardFallback />}>
                        <EditWorkOrderPage />
                      </Suspense>
                    </V4Layout>
                  </RoleProtectedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/work-orders/new"
              element={
                <PrivateRoute>
                  <RoleProtectedRoute allowedRoles={['admin', 'owner', 'dispatcher']} requiredPermissions={['jobs:create']}>
                    <V4Layout>
                      <Suspense fallback={<DashboardFallback />}>
                        <CreateWorkOrderPage />
                      </Suspense>
                    </V4Layout>
                  </RoleProtectedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/technicians"
              element={
                <PrivateRoute>
                  <RoleProtectedRoute allowedRoles={['admin', 'owner', 'dispatcher']} requiredPermissions={['technicians:view']}>
                    <V4Layout>
                      <Suspense fallback={<DashboardFallback />}>
                        <TechniciansPage />
                      </Suspense>
                    </V4Layout>
                  </RoleProtectedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/technicians/new"
              element={
                <PrivateRoute>
                  <RoleProtectedRoute allowedRoles={['admin', 'owner']} requiredPermissions={['technicians:manage']}>
                    <V4Layout>
                      <Suspense fallback={<DashboardFallback />}>
                        <CreateTechnicianPage />
                      </Suspense>
                    </V4Layout>
                  </RoleProtectedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/technicians/:id"
              element={
                <PrivateRoute>
                  <V4Layout>
                    <Suspense fallback={<DashboardFallback />}>
                      <TechnicianDetailPage />
                    </Suspense>
                  </V4Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/technicians/:id/edit"
              element={
                <PrivateRoute>
                  <RoleProtectedRoute allowedRoles={['admin', 'owner']} requiredPermissions={['technicians:manage']}>
                    <V4Layout>
                      <Suspense fallback={<DashboardFallback />}>
                        <EditTechnicianPage />
                      </Suspense>
                    </V4Layout>
                  </RoleProtectedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <PrivateRoute>
                  <V4Layout>
                    <Suspense fallback={<DashboardFallback />}>
                      <CustomersPage />
                    </Suspense>
                  </V4Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/customers/new"
              element={
                <PrivateRoute>
                  <RoleProtectedRoute allowedRoles={['admin', 'owner', 'dispatcher']} requiredPermissions={['customers:create']}>
                    <V4Layout>
                      <Suspense fallback={<DashboardFallback />}>
                        <CustomersPage />
                      </Suspense>
                    </V4Layout>
                  </RoleProtectedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/customers/:customerId"
              element={
                <PrivateRoute>
                  <V4Layout>
                    <Suspense fallback={<DashboardFallback />}>
                      <CustomerPage />
                    </Suspense>
                  </V4Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/customer-management"
              element={
                <PrivateRoute>
                  <V4Layout>
                    <Suspense fallback={<DashboardFallback />}>
                      <CustomerManagement />
                    </Suspense>
                  </V4Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/service-management"
              element={
                <PrivateRoute>
                  <V4Layout>
                    <Suspense fallback={<DashboardFallback />}>
                      <ServiceManagement />
                    </Suspense>
                  </V4Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/agreements"
              element={
                <PrivateRoute>
                  <V4Layout>
                    <Suspense fallback={<DashboardFallback />}>
                      <AgreementsPage />
                    </Suspense>
                  </V4Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/agreements/create"
              element={
                <PrivateRoute>
                  <RoleProtectedRoute allowedRoles={['admin', 'owner', 'dispatcher']} requiredPermissions={['jobs:create']}>
                    <V4Layout>
                      <Suspense fallback={<DashboardFallback />}>
                        <CreateAgreementPage />
                      </Suspense>
                    </V4Layout>
                  </RoleProtectedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/routing"
              element={
                <PrivateRoute>
                  <RoleProtectedRoute allowedRoles={['admin', 'owner', 'dispatcher']} requiredPermissions={['jobs:assign']}>
                    <V4Layout>
                      <Suspense fallback={<DashboardFallback />}>
                        <RoutingPage />
                      </Suspense>
                    </V4Layout>
                  </RoleProtectedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <RoleProtectedRoute allowedRoles={['admin', 'owner', 'dispatcher']} requiredPermissions={['reports:view']}>
                    <V4Layout>
                      <Suspense fallback={<DashboardFallback />}>
                        <ReportsPage />
                      </Suspense>
                    </V4Layout>
                  </RoleProtectedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/uploads"
              element={
                <PrivateRoute>
                  <V4Layout>
                    <Suspense fallback={<DashboardFallback />}>
                      <UploadsPage />
                    </Suspense>
                  </V4Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <RoleProtectedRoute allowedRoles={['admin', 'owner']} requiredPermissions={['settings:view']}>
                    <V4Layout>
                      <Suspense fallback={<DashboardFallback />}>
                        <SettingsPage />
                      </Suspense>
                    </V4Layout>
                  </RoleProtectedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/settings/users"
              element={
                <PrivateRoute>
                  <RoleProtectedRoute allowedRoles={['admin', 'owner']} requiredPermissions={['users:manage']}>
                    <V4Layout>
                      <Suspense fallback={<DashboardFallback />}>
                        <UserManagement />
                      </Suspense>
                    </V4Layout>
                  </RoleProtectedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/communications"
              element={
                <PrivateRoute>
                  <V4Layout>
                    <Suspense fallback={<DashboardFallback />}>
                      <CommunicationsPage />
                    </Suspense>
                  </V4Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/finance"
              element={
                <PrivateRoute>
                  <RoleProtectedRoute allowedRoles={['admin', 'owner']} requiredPermissions={['financial:view']}>
                    <V4Layout>
                      <Suspense fallback={<DashboardFallback />}>
                        <FinancePage />
                      </Suspense>
                    </V4Layout>
                  </RoleProtectedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/billing"
              element={
                <PrivateRoute>
                  <RoleProtectedRoute allowedRoles={['admin', 'owner']} requiredPermissions={['invoices:view']}>
                    <V4Layout>
                      <Suspense fallback={<DashboardFallback />}>
                        <BillingPage />
                      </Suspense>
                    </V4Layout>
                  </RoleProtectedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/billing/:customerId"
              element={
                <PrivateRoute>
                  <RoleProtectedRoute allowedRoles={['admin', 'owner']} requiredPermissions={['invoices:view']}>
                    <V4Layout>
                      <Suspense fallback={<DashboardFallback />}>
                        <BillingPage />
                      </Suspense>
                    </V4Layout>
                  </RoleProtectedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/knowledge"
              element={
                <PrivateRoute>
                  <V4Layout>
                    <Suspense fallback={<DashboardFallback />}>
                      <KnowledgePage />
                    </Suspense>
                  </V4Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/charts"
              element={
                <PrivateRoute>
                  <RoleProtectedRoute allowedRoles={['admin', 'owner', 'dispatcher']} requiredPermissions={['reports:view']}>
                    <V4Layout>
                      <Suspense fallback={<DashboardFallback />}>
                        <ChartsPage />
                      </Suspense>
                    </V4Layout>
                  </RoleProtectedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/search-analytics"
              element={
                <PrivateRoute>
                  <V4Layout>
                    <Suspense fallback={<DashboardFallback />}>
                      <SearchAnalyticsDashboard />
                    </Suspense>
                  </V4Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <V4Layout>
                    <Suspense fallback={<DashboardFallback />}>
                      <VeroCardsV3 showHeader={true} />
                    </Suspense>
                  </V4Layout>
                </PrivateRoute>
              }
            />
          </Routes>
        </Suspense>
        </main>
      </div>
  );
}
