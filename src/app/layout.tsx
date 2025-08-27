import '@ant-design/v5-patch-for-react-19';

import { Suspense } from 'react';

import type { Metadata } from 'next';

// import { Geist, Geist_Mono } from 'next/font/google';

import { AuthProvider } from '@/components/AuthProvider';
import BackToTop from '@/components/BackToTop';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Navigation } from '@/components/Navigation';
import TawkToWidget from '@/components/TawkToWidget';

import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Next Neon Base',
    default: 'Next Neon Base - 基础模板',
  },
  description: '基于 Next.js 15、Prisma ORM 和 Neon 云数据库的现代化基础模板',
  keywords: ['Next.js', 'Prisma', 'Neon', '基础模板', 'TypeScript'],
  authors: [{ name: 'Du Run song' }],
  creator: 'Du Run song',
  publisher: 'Du Run song',
  metadataBase: new URL('https://next-neon-base.vercel.app'),
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
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

            {/* Tawk.to 客服组件 */}
            <TawkToWidget
              enableInDev
              customSettings={{
                position: 'bottom-right',
                showPreChatForm: true,
                showOfflineForm: true,
              }}
            />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
