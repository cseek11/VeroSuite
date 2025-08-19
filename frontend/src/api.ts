import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
});

export async function login(email: string, password: string) {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
}

export async function getAccounts() {
  const res = await api.get('/crm/accounts');
  return res.data;
}

export async function getJobs() {
  const res = await api.get('/jobs');
  return res.data;
}

export async function getRoutes() {
  const res = await api.get('/routing/routes');
  return res.data;
}

export async function getAuditLogs() {
  const res = await api.get('/audit/logs');
  return res.data;
}
