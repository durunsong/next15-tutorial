import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: {
    template: '%s | Next.js 15 技术博客',
    default: 'Next.js 15 技术博客',
  },
  description: '探索 Next.js 15、React Server Components 和现代 Web 开发技术',
  keywords: [
    'Next.js',
    'React',
    'Server Components',
    'Client Components',
    '前端开发',
    'JSONPlaceholder',
  ],
  authors: [{ name: 'Next.js 15 教程' }],
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    siteName: 'Next.js 15 技术博客',
    locale: 'zh_CN',
  },
};

interface BlogLayoutProps {
  children: React.ReactNode;
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 博客导航栏 */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                ← 返回首页
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                href="/blog"
                className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              >
                📝 技术博客
              </Link>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                JSONPlaceholder API
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Server Components
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <main className="py-8">{children}</main>

      {/* 博客页脚 */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              🚀 此博客演示了 <strong>Server Components</strong> 和{' '}
              <strong>Client Components</strong> 的区别
            </p>
            <p className="text-sm">
              数据来源：
              <a
                href="https://jsonplaceholder.typicode.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline mx-1"
              >
                JSONPlaceholder API
              </a>
              | 构建工具：Next.js 15 + Turbopack
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
