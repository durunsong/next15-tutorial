/**
 * 仅客户端渲染组件
 * 避免 SSR 水合不匹配问题
 */

'use client';

import { useEffect, useState } from 'react';

/**
 * 仅客户端渲染组件
 * 避免 SSR 水合不匹配问题
 */

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
