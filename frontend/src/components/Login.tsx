import React, { useState } from 'react';
import { authService } from '../lib/auth-service';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const data = await authService.login(email, password);
      if (data.token) {
        localStorage.setItem('jwt', data.token);
        // Optionally store user info
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/'; // Redirect to dashboard or home
      } else {
        setError('Login failed: No token received');
      }
    } catch (err) {
      setError('Login failed');
    }
  }

  // Logout helper (can be used in other components) - currently unused, kept for potential future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function _handleLogout(): void {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  return (
    <form onSubmit={handleLogin}>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Login</button>
      {error && <div>{error}</div>}
    </form>
  );
}
