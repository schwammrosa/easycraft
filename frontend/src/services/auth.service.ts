import { api } from './api';
import { ApiResponse, AuthResponse, LoginDTO, RegisterDTO } from '../types';

export const authService = {
  async register(data: RegisterDTO): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    const authData = response.data.data!;
    
    // Store tokens
    localStorage.setItem('accessToken', authData.tokens.accessToken);
    localStorage.setItem('refreshToken', authData.tokens.refreshToken);
    
    return authData;
  },

  async login(data: LoginDTO): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    const authData = response.data.data!;
    
    // Store tokens
    localStorage.setItem('accessToken', authData.tokens.accessToken);
    localStorage.setItem('refreshToken', authData.tokens.refreshToken);
    
    return authData;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },
};
