import React, { useState } from 'react';

export function UserManagementForm() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('technician');
  const [status, setStatus] = useState('');

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Call backend to create user
    setStatus('Creating user...');
    setTimeout(() => {
      setStatus('User created!');
    }, 1000);
  }

  return (
    <form className="space-y-2" onSubmit={handleCreateUser}>
      <input className="border rounded px-2" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
      <input className="border rounded px-2" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" required />
      <input className="border rounded px-2" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" required />
      <select className="border rounded px-2" value={role} onChange={e => setRole(e.target.value)}>
        <option value="technician">Technician</option>
        <option value="dispatcher">Dispatcher</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit" className="px-2 py-1 bg-green-500 text-white rounded">Create User</button>
      {status && <div className="text-green-600 mt-2">{status}</div>}
    </form>
  );
}
