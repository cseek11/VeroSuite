import { create } from 'zustand';

interface AuthState {
  token: string | null;
  tenantId: string | null;
  user: any | null;
  setAuth: (data: { token: string; tenantId: string; user: any }) => void;
  clear: () => void;
}

function loadPersisted(): Pick<AuthState, 'token' | 'tenantId' | 'user'> {
  try {
    const raw = localStorage.getItem('verosuite_auth');
    if (!raw) return { token: null, tenantId: null, user: null } as any;
    return JSON.parse(raw);
  } catch {
    return { token: null, tenantId: null, user: null } as any;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  ...loadPersisted(),
  setAuth: ({ token, tenantId, user }) => {
    localStorage.setItem('verosuite_auth', JSON.stringify({ token, tenantId, user }));
    set({ token, tenantId, user });
  },
  clear: () => {
    localStorage.removeItem('verosuite_auth');
    set({ token: null, tenantId: null, user: null });
  },
}));
