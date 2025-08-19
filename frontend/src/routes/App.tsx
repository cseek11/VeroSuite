import { Route, Routes, Navigate, Link, useNavigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useAuthStore } from '@/stores/auth';
import { Spinner } from '@/ui/Spinner';

const LoginPage = lazy(() => import('@/routes/Login'));
const DashboardPage = lazy(() => import('@/routes/Dashboard'));
const JobsPage = lazy(() => import('@/routes/Jobs'));
const CustomersPage = lazy(() => import('@/components/CustomersPage'));
const JobsCalendar = lazy(() => import('@/components/JobsCalendar'));
const RoutingPage = lazy(() => import('@/routes/Routing'));
const UploadsPage = lazy(() => import('@/routes/Uploads'));
const DispatcherDashboard = lazy(() => import('@/components/DispatcherDashboard'));

function PrivateRoute({ children, roles }: { children: JSX.Element; roles?: string[] }) {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  if (!token) return <Navigate to="/login" replace />;
  if (roles && user && !user.roles?.some((r: string) => roles.includes(r))) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clear);
  const handleLogout = () => {
    clearAuth();
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
    navigate('/login');
  };
  return (
    <Suspense fallback={<Spinner />}>
      <nav className="bg-white shadow mb-6">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-6 items-center">
          <Link to="/" className="font-bold text-blue-700">Dashboard</Link>
          <Link to="/dispatcher" className="text-gray-700 hover:text-blue-700">Dispatcher Dashboard</Link>
          <Link to="/jobs" className="text-gray-700 hover:text-blue-700">Jobs</Link>
          <Link to="/jobs-calendar" className="text-gray-700 hover:text-blue-700">Jobs Calendar</Link>
          <Link to="/customers" className="text-gray-700 hover:text-blue-700">Customers</Link>
          <Link to="/routing" className="text-gray-700 hover:text-blue-700">Routing</Link>
          <Link to="/uploads" className="text-gray-700 hover:text-blue-700">Uploads</Link>
          <button onClick={handleLogout} className="ml-auto bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Logout</button>
        </div>
      </nav>
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
          path="/dispatcher"
          element={
            <PrivateRoute>
              <DispatcherDashboard />
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
          path="/jobs-calendar"
          element={
            <PrivateRoute>
              <JobsCalendar />
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
