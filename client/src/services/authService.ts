import { API_ENDPOINTS } from '../config/api';
import { apiCall } from '../utils/apiClient';
import { tokenManager } from '../utils/tokenManager';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
  };
}

export const authService = {
  async register(credentials: RegisterRequest): Promise<{ success: boolean; data?: AuthResponse; error?: string }> {
    const response = await apiCall<AuthResponse>(
      API_ENDPOINTS.AUTH_REGISTER,
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );

    if (response.success && response.data) {
      await tokenManager.saveToken(response.data.token);
      await tokenManager.saveUser(response.data.user);
    }

    return response;
  },

  async login(credentials: LoginRequest): Promise<{ success: boolean; data?: AuthResponse; error?: string }> {
    const response = await apiCall<AuthResponse>(
      API_ENDPOINTS.AUTH_LOGIN,
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );

    if (response.success && response.data) {
      await tokenManager.saveToken(response.data.token);
      await tokenManager.saveUser(response.data.user);
    }

    return response;
  },

  async logout(): Promise<void> {
    await tokenManager.clearAll();
  },

  async getStoredUser() {
    return await tokenManager.getUser();
  },

  async getStoredToken() {
    return await tokenManager.getToken();
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await tokenManager.getToken();
    return !!token;
  },
};
