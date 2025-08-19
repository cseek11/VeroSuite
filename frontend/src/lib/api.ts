import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';

export const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const { token, tenantId } = useAuthStore.getState();
  if (token) {
    if (!config.headers) {
      config.headers = {} as any;
    }
    config.headers.Authorization = `Bearer ${token}`;
    if (tenantId) config.headers['x-tenant-id'] = tenantId;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = await axios.get(`${API_BASE}/auth/refresh`, {
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().token}`,
            'x-tenant-id': useAuthStore.getState().tenantId || '',
          },
        });
        const { access_token, user } = refresh.data;
        useAuthStore.getState().setAuth({ token: access_token, tenantId: useAuthStore.getState().tenantId!, user });
        original.headers.Authorization = `Bearer ${access_token}`;
        return api(original);
      } catch (e) {
        useAuthStore.getState().clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export async function login(email: string, password: string) {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
}

export async function presignUpload(filename: string, content_type: string) {
  const res = await api.post('/v1/uploads/presign', { filename, content_type });
  return res.data as { uploadUrl: string; method: string; headers: any; fileUrl: string };
}

// Jobs
export const jobsApi = {
  today: async (technician_id?: string) => {
    const res = await api.get('/v1/jobs/today', { params: { technician_id } });
    return res.data;
  },
  get: async (id: string) => (await api.get(`/v1/jobs/${id}`)).data,
  create: async (payload: any) => (await api.post('/v1/jobs', payload)).data,
  assign: async (payload: any) => (await api.post('/v1/jobs/assign', payload)).data,
  start: async (id: string, gps: { lat: number; lng: number }) => (await api.put(`/v1/jobs/${id}/start`, { gps_location: gps })).data,
  complete: async (id: string, payload: any) => (await api.put(`/v1/jobs/${id}/complete`, payload)).data,
};

// CRM
export const crmApi = {
  accounts: async (search?: string) => (await api.get('/v1/crm/accounts', { params: { search } })).data,
  createAccount: async (payload: any) => (await api.post('/v1/crm/accounts', payload)).data,
  accountLocations: async (accountId: string) => (await api.get(`/v1/crm/accounts/${accountId}/locations`)).data,
  createLocation: async (payload: any) => (await api.post('/v1/crm/locations', payload)).data,
};

// Routing
export const routingApi = {
  optimize: async (date: string) => (await api.get('/v1/routing/optimize', { params: { date } })).data,
};

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default supabase;
