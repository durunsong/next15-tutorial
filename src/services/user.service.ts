/**
 * 用户服务
 * 处理用户相关的数据操作
 */
import { type ApiResponse, apiClient } from './api.client';
import type { User } from './auth.service';

// 用户列表查询参数
export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'createdAt' | 'username' | 'email';
  sortOrder?: 'asc' | 'desc';
}

// 用户列表响应
export interface UserListResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * 用户服务类
 */
class UserService {
  /**
   * 获取用户列表
   */
  async getUsers(params: UserListParams = {}): Promise<ApiResponse<UserListResponse>> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/users?${queryString}` : '/users';

    return apiClient.get<UserListResponse>(endpoint, { requireAuth: true });
  }

  /**
   * 根据 ID 获取用户详情
   */
  async getUserById(userId: string): Promise<ApiResponse<{ user: User }>> {
    return apiClient.get<{ user: User }>(`/users/${userId}`, { requireAuth: true });
  }

  /**
   * 搜索用户
   */
  async searchUsers(query: string, limit = 10): Promise<ApiResponse<{ users: User[] }>> {
    return apiClient.get<{ users: User[] }>(
      `/users/search?q=${encodeURIComponent(query)}&limit=${limit}`,
      {
        requireAuth: true,
      }
    );
  }

  /**
   * 获取用户统计信息
   */
  async getUserStats(userId?: string): Promise<
    ApiResponse<{
      totalUsers: number;
      totalPosts: number;
      totalComments: number;
      recentActivity: any[];
    }>
  > {
    const endpoint = userId ? `/users/${userId}/stats` : '/users/stats';
    return apiClient.get(endpoint, { requireAuth: true });
  }
}

// 创建服务实例
export const userService = new UserService();
