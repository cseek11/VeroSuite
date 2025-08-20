
import { Route, Routes, Navigate } from 'react-router-dom';
import { lazy, Suspense, useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/auth';
import { Spinner } from '@/ui/Spinner';
import Dashboard from '../ui-dashboard/Dashboard';

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
