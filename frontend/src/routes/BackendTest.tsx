import React, { useState, useEffect } from 'react';
import { BackendLogin } from '@/components/BackendLogin';
import { secureApiClient } from '@/lib/secure-api-client';
import { authService } from '@/lib/auth-service';

export default function BackendTest() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already authenticated
    if (authService.isAuthenticated()) {
      setIsAuthenticated(true);
      // You could fetch user info here if needed
    }
  }, []);

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    setCustomers([]);
  };

  const fetchCustomers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await secureApiClient.accounts.getAll();
      setCustomers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch customers');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Backend API Integration Test</h1>

        {!isAuthenticated ? (
          <BackendLogin onLoginSuccess={handleLoginSuccess} />
        ) : (
          <div className="space-y-6">
            {/* User Info */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Email:</strong> {user?.email}
                </div>
                <div>
                  <strong>Name:</strong> {user?.first_name} {user?.last_name}
                </div>
                <div>
                  <strong>Tenant ID:</strong> {user?.tenant_id}
                </div>
                <div>
                  <strong>Roles:</strong> {user?.roles?.join(', ')}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>

            {/* Customer Data Test */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Customer Data Test</h2>
              
              <button
                onClick={fetchCustomers}
                disabled={isLoading}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 mb-4"
              >
                {isLoading ? 'Loading...' : 'Fetch Customers from Backend API'}
              </button>

              {error && (
                <div className="text-red-600 bg-red-50 p-3 rounded-md mb-4">
                  {error}
                </div>
              )}

              {customers.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Found {customers.length} customers:
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-2 text-left">Name</th>
                          <th className="px-4 py-2 text-left">Email</th>
                          <th className="px-4 py-2 text-left">Phone</th>
                          <th className="px-4 py-2 text-left">Type</th>
                          <th className="px-4 py-2 text-left">City</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers.map((customer) => (
                          <tr key={customer.id} className="border-t">
                            <td className="px-4 py-2">{customer.name}</td>
                            <td className="px-4 py-2">{customer.email}</td>
                            <td className="px-4 py-2">{customer.phone}</td>
                            <td className="px-4 py-2">{customer.account_type}</td>
                            <td className="px-4 py-2">{customer.city}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
