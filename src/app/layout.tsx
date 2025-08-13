import '@ant-design/v5-patch-for-react-19';

import type { Metadata } from 'next';
// import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';

import { AuthProvider } from '@/components/AuthProvider';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Navigation } from '@/components/Navigation';
import TawkToWidget from '@/components/TawkToWidget';
import { ThemeProvider } from '@/components/ThemeProvider';

import './globals.css';

// 临时禁用 Google Fonts 以避免网络连接问题
// const geistSans = Geist({
//   variable: '--font-geist-sans',
//   subsets: ['latin'],
// });

// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// });

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
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <Script
          src="https://gw.alipayobjects.com/os/lib/antv/g6/4.8.24/dist/g6.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="antialiased font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary>
            <AuthProvider>
              {/* 固定在顶部的导航栏 */}
              <div className="fixed top-0 left-0 right-0 z-50">
                <Navigation />
              </div>
              {/* 主内容区域，添加上边距避免被导航栏遮挡 */}
              <main className="mt-16">{children}</main>

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
        </ThemeProvider>
      </body>
    </html>
  );
}
