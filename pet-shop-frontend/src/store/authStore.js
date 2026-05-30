import { create } from 'zustand';
import api from '../api';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,

  init: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await api.get('/auth/me');
      set({ user: res.data, token });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null });
    }
  },

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    set({ user: res.data.user, token: res.data.token });
    return res.data;
  },

  register: async (email, password, name) => {
    const res = await api.post('/auth/register', { email, password, name });
    localStorage.setItem('token', res.data.token);
    set({ user: res.data.user, token: res.data.token });
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));

export default useAuthStore;
