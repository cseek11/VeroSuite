import { useState } from 'react';
import { login } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';

export default function Login() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState('dispatcher@acepest.com');
  const [password, setPassword] = useState('password123');
  const [tenantId, setTenantId] = useState('11111111-1111-1111-1111-111111111111');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await login(email, password);
      setAuth({ token: res.access_token, tenantId, user: res.user });
      window.location.href = '/';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={submit} className="bg-white shadow rounded p-6 w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">VeroSuite Login</h1>
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input className="mt-1 w-full border rounded p-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-gray-600">Password</label>
          <input type="password" className="mt-1 w-full border rounded p-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-gray-600">Tenant ID</label>
          <input className="mt-1 w-full border rounded p-2" value={tenantId} onChange={(e) => setTenantId(e.target.value)} />
          <p className="text-xs text-gray-500 mt-1">Use Tenant A: 11111111-1111-1111-1111-111111111111 or Tenant B: 22222222-2222-2222-2222-222222222222</p>
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
