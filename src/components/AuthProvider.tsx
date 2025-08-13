'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { checkAuth, setLoading } = useAuthStore();

  useEffect(() => {
    // 应用启动时检查认证状态
    const initAuth = async () => {
      setLoading(true);
      await checkAuth();
    };

    initAuth();
  }, [checkAuth, setLoading]);

  return <>{children}</>;
}
