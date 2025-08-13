import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { authService } from '@/services';

interface User {
  id: string;
  email: string;
  username: string;
  phone?: string | null;
  avatar?: string | null;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    posts: number;
    comments: number;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (user: User, token: string) => void;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      login: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: async () => {
        try {
          // 使用 authService 退出登录
          await authService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // 清除本地存储和状态
          authService.clearAuthData();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      checkAuth: async () => {
        const { token } = get();

        if (!token) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return;
        }

        try {
          // 使用 authService 验证用户信息
          const result = await authService.getCurrentUser();

          if (result.success && result.data) {
            set({
              user: result.data.user,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            // Token无效，清除状态
            authService.clearAuthData();
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          authService.clearAuthData();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// 初始化认证状态检查
export const initializeAuth = () => {
  const checkAuth = useAuthStore.getState().checkAuth;
  checkAuth();
};
