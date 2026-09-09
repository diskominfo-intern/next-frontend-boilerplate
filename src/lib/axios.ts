import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// Otomatis pastikan baseURL selalu mengarah ke relative path /api di browser
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return '/api';
  }
  const envUrl = process.env.NEXT_PUBLIC_API_URL || '';
  if (!envUrl || envUrl.includes('localhost')) {
    return '/api';
  }
  const cleanUrl = envUrl.replace(/\/$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

// Create an Axios instance
const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token & enforce browser relative path
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      config.baseURL = '/api';
    }
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle global errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto logout if token is expired
      useAuthStore.getState().logout();
      // Cegah reload loop jika user sudah di halaman login
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
