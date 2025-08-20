
import { Route, Routes, Navigate } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth';
import { Spinner } from '@/ui/Spinner';
import Dashboard from '../ui-dashboard/Dashboard';

const LoginPage = lazy(() => import('@/routes/Login'));

function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
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
  const clearAuth = useAuthStore((s) => s.clear);

  // Clear any existing auth on app start to ensure fresh login
  useEffect(() => {
    // Only clear if there's no valid token
    if (!token) {
      clearAuth();
      localStorage.removeItem('verosuite_auth');
      localStorage.removeItem('user');
      localStorage.removeItem('jwt');
    }
  }, []);

  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/" 
          element={
            token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Suspense fallback={<DashboardFallback />}>
                <Dashboard />
              </Suspense>
            </PrivateRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}
