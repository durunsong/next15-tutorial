'use client';

import { Spin } from 'antd';

import { Suspense, useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

/**
 * 注册页面 - 重定向到主页并打开注册弹窗
 * 保持向后兼容，同时统一为弹窗注册体验
 */
function RegisterRedirectInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const returnUrl = searchParams?.get('returnUrl');
    const redirectUrl = new URL('/', window.location.origin);
    redirectUrl.searchParams.set('auth', 'register');
    if (returnUrl) redirectUrl.searchParams.set('returnUrl', returnUrl);
    router.replace(redirectUrl.toString());
  }, [router, searchParams]);

  return (
    <div className="text-center">
      <Spin size="large" />
      <p className="mt-4 text-gray-600 dark:text-gray-300">正在跳转到注册页面...</p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Suspense fallback={<Spin size="large" />}>
        <RegisterRedirectInner />
      </Suspense>
    </div>
  );
}
