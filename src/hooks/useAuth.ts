/**
 * 认证相关的 Hook
 * 封装认证逻辑，提供便捷的认证操作
 */
import { message } from 'antd';

import { useCallback } from 'react';

import { type LoginRequest, type RegisterRequest, type User, authService } from '@/services';
import { useAuthStore } from '@/store/authStore';

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    login: setAuth,
    logout: clearAuth,
    updateUser,
  } = useAuthStore();

  /**
   * 登录操作
   */
  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        const result = await authService.login(credentials);

        if (result.success && result.data) {
          const { user, token } = result.data;

          // 保存到本地存储
          authService.saveAuthData(token, user);

          // 更新全局状态
          setAuth(user, token);

          message.success('登录成功！');
          return { success: true, user };
        } else {
          message.error(result.error || '登录失败');
          return { success: false, error: result.error };
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : '登录失败';
        message.error(errorMsg);
        return { success: false, error: errorMsg };
      }
    },
    [setAuth]
  );

  /**
   * 注册操作
   */
  const register = useCallback(
    async (userData: RegisterRequest) => {
      try {
        const result = await authService.register(userData);

        if (result.success && result.data) {
          const { user, token } = result.data;

          // 保存到本地存储
          authService.saveAuthData(token, user);

          // 更新全局状态
          setAuth(user, token);

          message.success('注册成功！');
          return { success: true, user };
        } else {
          message.error(result.error || '注册失败');
          return { success: false, error: result.error };
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : '注册失败';
        message.error(errorMsg);
        return { success: false, error: errorMsg };
      }
    },
    [setAuth]
  );

  /**
   * 退出登录
   */
  const logout = useCallback(async () => {
    try {
      // 调用服务端退出接口
      await authService.logout();
    } catch (error) {
      console.warn('服务端退出失败:', error);
    } finally {
      // 无论服务端是否成功，都清理本地状态
      authService.clearAuthData();
      clearAuth();
      message.success('已退出登录');
    }
  }, [clearAuth]);

  /**
   * 更新用户信息
   */
  const updateProfile = useCallback(
    async (updates: Partial<User>) => {
      try {
        const result = await authService.updateUser(updates);

        if (result.success && result.data) {
          const updatedUser = result.data.user;

          // 更新本地存储
          const { token } = authService.getStoredAuthData();
          if (token) {
            authService.saveAuthData(token, updatedUser);
          }

          // 更新全局状态
          updateUser(updates);

          message.success('个人信息更新成功！');
          return { success: true, user: updatedUser };
        } else {
          message.error(result.error || '更新失败');
          return { success: false, error: result.error };
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : '更新失败';
        message.error(errorMsg);
        return { success: false, error: errorMsg };
      }
    },
    [updateUser]
  );

  /**
   * 检查认证状态
   */
  const checkAuth = useCallback(async () => {
    try {
      const isValid = await authService.validateToken();

      if (!isValid && isAuthenticated) {
        // token 无效但状态显示已认证，清理状态
        authService.clearAuthData();
        clearAuth();
      }

      return isValid;
    } catch (error) {
      console.error('检查认证状态失败:', error);
      return false;
    }
  }, [isAuthenticated, clearAuth]);

  /**
   * 获取当前用户信息
   */
  const refreshUser = useCallback(async () => {
    try {
      const result = await authService.getCurrentUser();

      if (result.success && result.data) {
        const user = result.data.user;

        // 更新本地存储
        const { token } = authService.getStoredAuthData();
        if (token) {
          authService.saveAuthData(token, user);
        }

        // 更新全局状态
        setAuth(user, token || '');

        return { success: true, user };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '获取用户信息失败';
      return { success: false, error: errorMsg };
    }
  }, [setAuth]);

  return {
    // 状态
    user,
    isAuthenticated,
    isLoading,

    // 操作
    login,
    register,
    logout,
    updateProfile,
    checkAuth,
    refreshUser,
  };
}
