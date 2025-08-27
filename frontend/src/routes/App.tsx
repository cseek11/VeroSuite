
import { Route, Routes, Navigate } from 'react-router-dom';
import { lazy, Suspense, useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/auth';
import { Spinner } from '@/ui/Spinner';
import SkipLink from '@/components/SkipLink';

import LayoutWrapper from '@/components/LayoutWrapper';
import V4Layout from '@/components/layout/V4Layout';
import LegacyDashboard from './LegacyDashboard';
import LegacyEnhancedDashboard from './LegacyEnhancedDashboard';
import LegacyResizableDashboard from './LegacyResizableDashboard';
import V4Dashboard from './V4Dashboard';
import V4Test from './V4Test';
import CommunicationsPage from './Communications';
import FinancePage from './Finance';
import KnowledgePage from './Knowledge';
import SchedulerPage from './Scheduler';
import JobsPage from './Jobs';
import CustomersPage from '@/components/CustomersPage';
import Customers from './Customers';
import RoutingPage from './Routing';
import ReportsPage from './Reports';
import UploadsPage from './Uploads';
import SettingsPage from './Settings';

const LoginPage = lazy(() => import('@/routes/Login'));

function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  
  // More strict authentication check
  if (!token || !user) {
    console.log('PrivateRoute: No token or user, redirecting to login');
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
  const hasInitialized = useRef(false);

  // Force clear auth only once on app start
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    
    console.log('App mounted - initial cleanup');
    console.log('Initial token:', token);
    console.log('Initial user:', user);
    
    // Only clear if there's no valid authentication
    if (!token || !user) {
      console.log('No valid auth found, clearing all data');
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
      console.log('Valid auth found, keeping user logged in');
    }
  }, []);

  // Check if user is properly authenticated
  const isAuthenticated = token && user;
  
  console.log('App render - token:', token, 'user:', user, 'isAuthenticated:', isAuthenticated);

    return (
      <div
        className="min-h-screen w-full"
        style={{
          background: `url('/branding/crm_bg.png') center center / cover no-repeat fixed`,
          position: 'relative',
        }}
      >
        <SkipLink />
        <main id="main-content" tabIndex={-1}>
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
                      <V4Dashboard />
                    </Suspense>
                  </V4Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/enhanced-dashboard"
              element={
                <PrivateRoute>
                  <LayoutWrapper>
                    <Suspense fallback={<DashboardFallback />}>
                      <LegacyEnhancedDashboard />
                    </Suspense>
                  </LayoutWrapper>
                </PrivateRoute>
              }
            />
            <Route
              path="/resizable-dashboard"
              element={
                <PrivateRoute>
                  <V4Layout>
                    <Suspense fallback={<DashboardFallback />}>
                      <LegacyResizableDashboard showHeader={false} />
                    </Suspense>
                  </V4Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/v4-dashboard"
              element={
                <PrivateRoute>
                  <V4Layout>
                    <Suspense fallback={<DashboardFallback />}>
                      <V4Dashboard />
                    </Suspense>
                  </V4Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/v4-test"
              element={
                <PrivateRoute>
                  <V4Layout>
                    <Suspense fallback={<DashboardFallback />}>
                      <V4Test />
                    </Suspense>
                  </V4Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/scheduler"
              element={
                <PrivateRoute>
                  <V4Layout>
                    <Suspense fallback={<DashboardFallback />}>
                      <SchedulerPage />
                    </Suspense>
                  </V4Layout>
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
                  <V4Layout>
                    <Suspense fallback={<DashboardFallback />}>
                      <CustomersPage />
                    </Suspense>
                  </V4Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/customers-old"
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
              path="/routing"
              element={
                <PrivateRoute>
                  <V4Layout>
                    <Suspense fallback={<DashboardFallback />}>
                      <RoutingPage />
                    </Suspense>
                  </V4Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <V4Layout>
                    <Suspense fallback={<DashboardFallback />}>
                      <ReportsPage />
                    </Suspense>
                  </V4Layout>
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
                  <V4Layout>
                    <Suspense fallback={<DashboardFallback />}>
                      <SettingsPage />
                    </Suspense>
                  </V4Layout>
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
                  <V4Layout>
                    <Suspense fallback={<DashboardFallback />}>
                      <FinancePage />
                    </Suspense>
                  </V4Layout>
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
              path="/*"
              element={
                <PrivateRoute>
                  <LayoutWrapper>
                    <Suspense fallback={<DashboardFallback />}>
                      <LegacyDashboard />
                    </Suspense>
                  </LayoutWrapper>
                </PrivateRoute>
              }
            />
          </Routes>
        </Suspense>
        </main>
      </div>
  );
}
