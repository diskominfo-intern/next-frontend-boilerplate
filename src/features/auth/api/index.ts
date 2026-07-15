import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { AuthResponse, User } from '../types';
import { useAuthStore } from '@/store/useAuthStore';

// Hooks for Login
export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (credentials: Record<string, unknown>) => {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      // Decode user from token or use returned user data if backend sends it.
      // We assume backend returns access_token. For this boilerplate, we'll store token.
      // Usually, you fetch the profile next.
      setAuth({ id: 0, email: '', name: 'User' }, data.data.access_token);
    },
  });
};

// Hooks for Register
export const useRegister = () => {
  return useMutation({
    mutationFn: async (userData: Record<string, unknown>) => {
      const response = await api.post('/auth/register', userData);
      return response.data;
    },
  });
};

// Hooks to get user profile
export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await api.get<{ data: User }>('/user/profile');
      return response.data.data;
    },
  });
};
