import Link from 'next/link';

import { PAGE_METADATA, generateMetadata } from '@/lib/metadata';

export const metadata = generateMetadata(PAGE_METADATA.about);

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              关于 Next Neon Base
            </h1>
            <p className="text-xl text-gray-600">现代化的全栈基础模版框架解决方案</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 项目愿景</h2>
              <p className="text-gray-600 leading-relaxed">
                Next Neon Base 致力于提供一个现代化、类型安全、高性能的基础模版框架。
                我们使用最新的技术栈，让开发者能够快速构建可扩展的Web应用程序。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🛠️ 技术架构</h2>
              <ul className="space-y-2 text-gray-600">
                <li>
                  • <strong>前端:</strong> Next.js 15 + TypeScript
                </li>
                <li>
                  • <strong>样式:</strong> Tailwind CSS 4.0
                </li>
                <li>
                  • <strong>数据库:</strong> Neon PostgreSQL
                </li>
                <li>
                  • <strong>ORM:</strong> Prisma
                </li>
                <li>
                  • <strong>部署:</strong> Vercel
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">✨ 核心特性</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">类型安全</h3>
                    <p className="text-sm text-gray-600">全程 TypeScript 支持</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">现代化架构</h3>
                    <p className="text-sm text-gray-600">基于 Next.js App Router</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">云原生</h3>
                    <p className="text-sm text-gray-600">使用 Neon 云数据库</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">RESTful API</h3>
                    <p className="text-sm text-gray-600">完整的用户管理接口</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">响应式设计</h3>
                    <p className="text-sm text-gray-600">适配各种设备尺寸</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">开箱即用</h3>
                    <p className="text-sm text-gray-600">一键部署到 Vercel</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r to-purple-600 rounded-lg text-white p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">🚀 开始使用</h2>
            <p className="mb-6">立即体验 Next Neon Base，构建你的下一个项目</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/users"
                className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                查看用户管理
              </Link>
              <Link
                href="/customer-service"
                className="inline-block bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                💬 联系客服
              </Link>
              <a
                href="https://github.com/durunsong/next-neon-base"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                GitHub 源码
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
