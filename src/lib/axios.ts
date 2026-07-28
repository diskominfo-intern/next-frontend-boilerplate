import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// Otomatis pastikan baseURL selalu mengarah ke prefix /api
const getBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
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

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
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
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
