import { Route, Routes, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useAuthStore } from '@/stores/auth';
import { Spinner } from '@/ui/Spinner';

const LoginPage = lazy(() => import('@/routes/Login'));
const DashboardPage = lazy(() => import('@/routes/Dashboard'));
const JobsPage = lazy(() => import('@/routes/Jobs'));
const CustomersPage = lazy(() => import('@/routes/Customers'));
const RoutingPage = lazy(() => import('@/routes/Routing'));
const UploadsPage = lazy(() => import('@/routes/Uploads'));

function PrivateRoute({ children, roles }: { children: JSX.Element; roles?: string[] }) {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  if (!token) return <Navigate to="/login" replace />;
  if (roles && user && !user.roles?.some((r: string) => roles.includes(r))) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <PrivateRoute roles={["dispatcher", "technician"]}>
              <JobsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <PrivateRoute roles={["dispatcher", "accountant", "tenant_admin"]}>
              <CustomersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/routing"
          element={
            <PrivateRoute roles={["dispatcher", "tenant_admin"]}>
              <RoutingPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/uploads"
          element={
            <PrivateRoute roles={["dispatcher", "technician", "tenant_admin"]}>
              <UploadsPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}
