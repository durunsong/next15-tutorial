import '@ant-design/v5-patch-for-react-19';

import { Suspense } from 'react';

import type { Metadata } from 'next';

// import { Geist, Geist_Mono } from 'next/font/google';

import { AuthProvider } from '@/components/AuthProvider';
import BackToTop from '@/components/BackToTop';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Navigation } from '@/components/Navigation';
import { PerformanceProvider } from '@/components/PerformanceProvider';
import TawkToWidget from '@/components/TawkToWidget';
import { SITE_CONFIG } from '@/lib/metadata';

import './globals.css';

export const metadata: Metadata = {
  title: {
    template: `%s | ${SITE_CONFIG.name}`,
    default: SITE_CONFIG.name,
  },
  description: SITE_CONFIG.description,
  keywords: [...SITE_CONFIG.keywords],
  authors: [{ name: SITE_CONFIG.creator }],
  creator: SITE_CONFIG.creator,
  publisher: SITE_CONFIG.name,
  metadataBase: new URL(SITE_CONFIG.url),
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
  other: {
    'theme-color': '#0070f3',
    'color-scheme': 'light dark',
    'format-detection': 'telephone=no',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head />
      <body className="antialiased font-sans">
        <ErrorBoundary>
          <PerformanceProvider enableDevTools={false}>
            <AuthProvider>
              {/* 固定在顶部的导航栏 */}
              <div className="fixed top-0 left-0 right-0 z-50">
                <Suspense fallback={null}>
                  <Navigation />
                </Suspense>
              </div>
              {/* 主内容区域，添加上边距避免被导航栏遮挡 */}
              <main className="mt-16">{children}</main>

              {/* 回到顶部 */}
              <BackToTop />

              {/* Tawk.to 客服组件 - 页面加载完成后延迟3秒加载 */}
              <TawkToWidget
                enableInDev // 开发环境也启用，便于测试
                delayMs={3000} // 延迟3秒加载
                customSettings={{
                  position: 'bottom-right',
                  showPreChatForm: true,
                  showOfflineForm: true,
                }}
              />
            </AuthProvider>
          </PerformanceProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
