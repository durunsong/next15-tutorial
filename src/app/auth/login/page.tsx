'use client';

import { Spin } from 'antd';

import { Suspense, useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

/**
 * 登录页面 - 重定向到主页并打开登录弹窗
 * 保持向后兼容，同时统一为弹窗登录体验
 */
function LoginRedirectInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const returnUrl = searchParams?.get('returnUrl');
    const redirectUrl = new URL('/', window.location.origin);
    redirectUrl.searchParams.set('auth', 'login');
    if (returnUrl) redirectUrl.searchParams.set('returnUrl', returnUrl);
    router.replace(redirectUrl.toString());
  }, [router, searchParams]);

  return (
    <div className="text-center">
      <Spin size="large" />
      <p className="mt-4 text-gray-600 dark:text-gray-300">正在跳转到登录页面...</p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Suspense fallback={<Spin size="large" />}>
        <LoginRedirectInner />
      </Suspense>
    </div>
  );
}
