/**
 * 认证服务
 * 处理登录、注册、退出等认证相关操作
 */
import { type ApiResponse, apiClient } from './api.client';

// 类型定义
export interface LoginRequest {
  loginId: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  phone?: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    posts: number;
    comments: number;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: string;
}

export interface UserUpdateRequest {
  username?: string;
  email?: string;
  phone?: string;
}

/**
 * 认证服务类
 */
class AuthService {
  /**
   * 用户登录
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  }

  /**
   * 用户注册
   */
  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>('/auth/register', userData);
  }

  /**
   * 用户退出
   */
  async logout(): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/auth/logout', undefined, { requireAuth: true });
  }

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    return apiClient.get('/auth/me', { requireAuth: true });
  }

  /**
   * 更新用户信息
   */
  async updateUser(updates: UserUpdateRequest): Promise<ApiResponse<{ user: User }>> {
    return apiClient.put('/auth/me', updates, { requireAuth: true });
  }

  /**
   * 检查邮箱是否存在
   */
  async checkEmailExists(email: string): Promise<ApiResponse<{ exists: boolean }>> {
    return apiClient.post('/auth/check-email', { email });
  }

  /**
   * 检查用户名是否存在
   */
  async checkUsernameExists(username: string): Promise<ApiResponse<{ exists: boolean }>> {
    return apiClient.post('/auth/check-username', { username });
  }

  /**
   * 本地存储操作
   */
  saveAuthData(token: string, user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  getStoredAuthData(): { token: string | null; user: User | null } {
    if (typeof window === 'undefined') {
      return { token: null, user: null };
    }

    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    return { token, user };
  }

  clearAuthData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  /**
   * 检查 token 是否有效
   */
  async validateToken(): Promise<boolean> {
    const { token } = this.getStoredAuthData();
    if (!token) return false;

    const result = await this.getCurrentUser();
    return result.success;
  }
}

// 创建服务实例
export const authService = new AuthService();
