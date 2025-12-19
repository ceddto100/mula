import api from './axios.config';
import { ApiResponse, AuthResponse, LoginCredentials, RegisterData, User, Address } from '../types';

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/register', data);
    return response.data.data!;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/login', credentials);
    return response.data.data!;
  },

  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout');
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/api/auth/me');
    return response.data.data!;
  },

  updateProfile: async (data: { name: string }): Promise<User> => {
    const response = await api.put<ApiResponse<User>>('/api/auth/profile', data);
    return response.data.data!;
  },

  addAddress: async (address: Omit<Address, '_id'>): Promise<Address[]> => {
    const response = await api.post<ApiResponse<Address[]>>('/api/auth/address', address);
    return response.data.data!;
  },

  deleteAddress: async (addressId: string): Promise<Address[]> => {
    const response = await api.delete<ApiResponse<Address[]>>(`/api/auth/address/${addressId}`);
    return response.data.data!;
  },

  getGoogleAuthUrl: (): string => {
    return `${api.defaults.baseURL}/api/auth/google`;
  },
};
