/**
 * ==============================================================================
 * ?? PERINGATAN KERAS / BACA SEBELUM MENGUBAH FILE INI! ??
 * ==============================================================================
 * File ini mengatur konfigurasi Axios HTTP Client & Interceptor Global.
 * Pemilik / Maintainer: @PangeranJJ4321
 *
 * ATURAN MUTLAK:
 * 1. DILARANG MENG-HARDCODE baseURL ke "http://localhost:3000"!
 *    Di browser klien, baseURL WAJIB menggunakan relative path "/api".
 *    Gateway cPanel yang akan me-reverse-proxy request /api tersebut ke backend.
 *    Jika Anda hardcode ke localhost, aplikasi akan GAGAL TOTAL saat diakses publik!
 *
 * 2. DILARANG MENGHAPUS proteksi loop redirect 401 pada response interceptor.
 *    Jika user sudah berada di halaman "/login", jangan panggil redirect lagi
 *    agar browser tidak mengalami infinite reload loop.
 * ==============================================================================
 */
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

