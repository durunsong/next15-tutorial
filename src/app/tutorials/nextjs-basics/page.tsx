'use client';

import { TutorialLayout } from '@/components/TutorialLayout';
import { DemoSection } from '@/components/DemoSection';
import { CodeBlock } from '@/components/CodeBlock';
import { CodeEditor } from '@/components/CodeEditor';
import { DynamicRouteDemo, DataFetchingDemo, PerformanceDemo, MiddlewareDemo } from '@/components/demos/NextJSDemos';
import { RenderingModesDemo, APICallDemo } from '@/components/demos/RenderingDemos';
import { NetworkMonitorDemo } from '@/components/demos/NetworkMonitorExport';
import { QuickAccessDemos } from '@/components/QuickAccessDemos';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Server, FileText, Layers, Zap, Globe, Database, Settings } from 'lucide-react';

// 演示组件：App Router 示例
function AppRouterDemo() {
  const [currentRoute, setCurrentRoute] = useState('/');
  
  const routes = [
    { path: '/', name: '首页', component: <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded">这是首页内容</div> },
    { path: '/about', name: '关于', component: <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded">这是关于页面</div> },
    { path: '/blog', name: '博客', component: <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded">这是博客页面</div> },
  ];
  
  const currentComponent = routes.find(r => r.path === currentRoute)?.component;
  
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">App Router 路由演示</h4>
        <div className="flex flex-wrap gap-2">
          {routes.map((route) => (
            <button
              key={route.path}
              onClick={() => setCurrentRoute(route.path)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                currentRoute === route.path
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {route.name} ({route.path})
            </button>
          ))}
        </div>
      </div>
      <div className="p-4">
        {currentComponent}
      </div>
    </div>
  );
}

// 演示组件：Server Components vs Client Components
function ComponentTypesDemo() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
            <Server className="h-4 w-4 mr-2 text-blue-600" />
            Server Component (服务端组件)
          </h4>
          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
            <p>• 在服务器端渲染</p>
            <p>• 可以直接访问数据库</p>
            <p>• 更小的客户端包体积</p>
            <p>• 无法使用浏览器 API</p>
            <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs">
              当前时间: {new Date().toLocaleTimeString('zh-CN')}
            </div>
          </div>
        </div>
        
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
            <Zap className="h-4 w-4 mr-2 text-yellow-600" />
            Client Component (客户端组件)
          </h4>
          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
            <p>• 在浏览器中渲染</p>
            <p>• 可以使用 React 状态和生命周期</p>
            <p>• 支持交互和事件处理</p>
            <p>• 使用 &apos;use client&apos; 指令</p>
            <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <button 
                onClick={() => setCount(count + 1)}
                className="px-3 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700 transition-colors"
              >
                点击次数: {count}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 演示组件：Loading 和 Error 边界
function LoadingErrorDemo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  
  const simulateLoading = () => {
    setLoading(true);
    setError(false);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  
  const simulateError = () => {
    setError(true);
    setLoading(false);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button 
          onClick={simulateLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          模拟加载
        </button>
        <button 
          onClick={simulateError}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          模拟错误
        </button>
        <button 
          onClick={() => { setLoading(false); setError(false); }}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          重置
        </button>
      </div>
      
      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg min-h-24 flex items-center justify-center">
        {loading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600 dark:text-gray-300">加载中...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center text-red-600">
            <p className="font-medium">出错了！</p>
            <p className="text-sm">这是一个错误演示</p>
          </div>
        )}
        
        {!loading && !error && (
          <p className="text-gray-600 dark:text-gray-300">内容已加载完成</p>
        )}
      </div>
    </div>
  );
}

export default function NextJSBasicsTutorial() {
  const appRouterCode = `// app/layout.tsx (根布局)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body>
        <nav>导航栏</nav>
        {children}
        <footer>页脚</footer>
      </body>
    </html>
  );
}

// app/page.tsx (首页)
export default function HomePage() {
  return (
    <div>
      <h1>欢迎来到首页</h1>
    </div>
  );
}

// app/about/page.tsx (关于页面)
export default function AboutPage() {
  return (
    <div>
      <h1>关于我们</h1>
    </div>
  );
}`;

  const serverComponentCode = `// app/posts/page.tsx (Server Component)
import { getPosts } from '@/lib/database';

export default async function PostsPage() {
  // 可以直接在服务端获取数据
  const posts = await getPosts();
  
  return (
    <div>
      <h1>博客文章</h1>
      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </article>
      ))}
    </div>
  );
}`;

  const clientComponentCode = `'use client';

import { useState, useEffect } from 'react';

export default function InteractiveCounter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    // 可以使用浏览器 API
    document.title = \`计数器: \${count}\`;
  }, [count]);
  
  return (
    <div>
      <p>当前计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        增加
      </button>
    </div>
  );
}`;

  const loadingErrorCode = `// app/loading.tsx (加载状态)
export default function Loading() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2">加载中...</span>
    </div>
  );
}

// app/error.tsx (错误边界)
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="text-center p-4">
      <h2 className="text-red-600 font-bold mb-2">出现错误！</h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button 
        onClick={reset}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        重试
      </button>
    </div>
  );
}`;

  const streamingCode = `// 流式渲染示例
import { Suspense } from 'react';

function SlowComponent() {
  // 模拟慢组件
  return <div>这是一个慢加载的组件</div>;
}

export default function StreamingPage() {
  return (
    <div>
      <h1>页面标题 (立即显示)</h1>
      
      <Suspense fallback={<div>加载中...</div>}>
        <SlowComponent />
      </Suspense>
      
      <p>其他内容 (立即显示)</p>
    </div>
  );
}`;

  return (
    <TutorialLayout
      title="Next.js 15 基础教程"
      description="学习 Next.js 15 的核心概念，包括 App Router、Server Components、流式渲染等最新特性"
      nextTutorial={{
        title: "TypeScript 集成",
        href: "/tutorials/typescript"
      }}
    >
      <div className="space-y-12">
        {/* 什么是 Next.js */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            什么是 Next.js？
          </h2>
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p>
              Next.js 是一个基于 React 的全栈框架，由 Vercel 开发和维护。它为 React 应用提供了
              生产级的功能和优化，让开发者能够轻松构建现代 Web 应用程序。
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">
              Next.js 解决了什么问题？
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-600" />
                  性能问题
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• SEO 优化困难</li>
                  <li>• 首屏加载速度慢</li>
                  <li>• 代码分割复杂</li>
                  <li>• 图片优化手动处理</li>
                </ul>
              </div>
              
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-blue-600" />
                  开发体验问题
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• 路由配置复杂</li>
                  <li>• 构建配置繁琐</li>
                  <li>• 热重载不稳定</li>
                  <li>• TypeScript 配置困难</li>
                </ul>
              </div>
              
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-green-600" />
                  部署问题
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• 服务器配置复杂</li>
                  <li>• CDN 配置手动</li>
                  <li>• 环境变量管理困难</li>
                  <li>• 缓存策略难以实现</li>
                </ul>
              </div>
              
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <Database className="h-5 w-5 mr-2 text-purple-600" />
                  全栈开发问题
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• API 路由分离</li>
                  <li>• 数据获取复杂</li>
                  <li>• 状态管理困难</li>
                  <li>• 类型安全缺失</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">
              Next.js 15 的核心特性
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <FileText className="h-8 w-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">App Router</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  基于文件系统的新路由方式，支持布局和嵌套路由
                </p>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <Server className="h-8 w-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Server Components</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  服务端渲染的 React 组件，更好的性能和 SEO
                </p>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <Layers className="h-8 w-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">流式渲染</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  渐进式页面加载，提升用户体验
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* App Router 演示 */}
        <DemoSection
          title="App Router 文件系统路由"
          description="Next.js 15 使用 app 目录结构来定义路由，每个文件夹代表一个路由段"
          demoComponent={<AppRouterDemo />}
          codeComponent={
            <CodeBlock
              code={appRouterCode}
              language="tsx"
              filename="app 目录结构示例"
            />
          }
        />

        {/* Server Components vs Client Components */}
        <DemoSection
          title="Server Components vs Client Components"
          description="了解服务端组件和客户端组件的区别，以及何时使用它们"
          demoComponent={<ComponentTypesDemo />}
          codeComponent={
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  Server Component 示例
                </h4>
                <CodeBlock
                  code={serverComponentCode}
                  language="tsx"
                  filename="posts/page.tsx"
                />
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  Client Component 示例
                </h4>
                <CodeBlock
                  code={clientComponentCode}
                  language="tsx"
                  filename="components/InteractiveCounter.tsx"
                />
              </div>
            </div>
          }
        />

        {/* Loading 和 Error 处理 */}
        <DemoSection
          title="Loading 和 Error 边界"
          description="Next.js 15 提供了内置的 loading 和 error 处理机制"
          demoComponent={<LoadingErrorDemo />}
          codeComponent={
            <CodeBlock
              code={loadingErrorCode}
              language="tsx"
              filename="特殊文件：loading.tsx 和 error.tsx"
            />
          }
        />

        {/* 动态路由演示 */}
        <DemoSection
          title="动态路由和参数处理"
          description="体验 Next.js 的动态路由功能，包括路径参数和查询参数的处理"
          demoComponent={<DynamicRouteDemo />}
          codeComponent={
            <CodeBlock
              code={`// app/blog/[slug]/page.tsx
export default function BlogPost({ 
  params,
  searchParams 
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div>
      <h1>博客文章: {params.slug}</h1>
      <p>分类: {searchParams.category}</p>
      <p>标签: {searchParams.tags}</p>
    </div>
  );
}

// app/users/[id]/posts/[postId]/page.tsx
export default function UserPost({
  params
}: {
  params: { id: string; postId: string }
}) {
  return (
    <div>
      <h1>用户 {params.id} 的文章 {params.postId}</h1>
    </div>
  );
}

// 生成静态参数（SSG）
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());
  
  return posts.map((post: any) => ({
    slug: post.slug,
  }));
}

// 捕获所有路由: app/docs/[...sections]/page.tsx
export default function DocsPage({
  params
}: {
  params: { sections: string[] }
}) {
  return (
    <div>
      <h1>文档: {params.sections.join(' / ')}</h1>
    </div>
  );
}`}
              language="tsx"
              filename="动态路由示例"
            />
          }
        />

        {/* 数据获取演示 */}
        <DemoSection
          title="现代化数据获取"
          description="演示 Next.js 15 中的各种数据获取方式和缓存策略"
          demoComponent={<DataFetchingDemo />}
          codeComponent={
            <CodeBlock
              code={`// 服务端数据获取（推荐）
export default async function PostsPage() {
  // 并行获取数据
  const [posts, categories] = await Promise.all([
    fetch('https://api.example.com/posts', {
      cache: 'force-cache', // 强制缓存
    }),
    fetch('https://api.example.com/categories', {
      next: { revalidate: 3600 }, // 1小时重新验证
    })
  ]);
  
  const postsData = await posts.json();
  const categoriesData = await categories.json();
  
  return (
    <div>
      <h1>文章列表</h1>
      <CategoryFilter categories={categoriesData} />
      <PostList posts={postsData} />
    </div>
  );
}

// 客户端数据获取
'use client';

import { use } from 'react';

function PostsClient({ postsPromise }: { 
  postsPromise: Promise<Post[]> 
}) {
  const posts = use(postsPromise); // React 18+ use 钩子
  
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

// 错误处理
export default async function PostsWithErrorHandling() {
  try {
    const posts = await getPosts();
    return <PostList posts={posts} />;
  } catch (error) {
    return (
      <div className="error">
        <h2>加载失败</h2>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>
          重试
        </button>
      </div>
    );
  }
}`}
              language="tsx"
              filename="数据获取最佳实践"
            />
          }
        />

        {/* 中间件演示 */}
        <DemoSection
          title="中间件 (Middleware)"
          description="体验 Next.js 中间件的强大功能，包括认证、权限控制和请求处理"
          demoComponent={<MiddlewareDemo />}
          codeComponent={
            <CodeBlock
              code={`// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // 检查是否为受保护的路由
  const protectedRoutes = ['/dashboard', '/admin', '/profile'];
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  if (isProtectedRoute) {
    // 检查认证状态
    const token = request.cookies.get('auth-token');
    
    if (!token) {
      // 未认证，重定向到登录页
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // 管理员路由权限检查
    if (pathname.startsWith('/admin')) {
      const userRole = request.cookies.get('user-role')?.value;
      
      if (userRole !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }
  
  // 添加自定义响应头
  const response = NextResponse.next();
  response.headers.set('X-Pathname', pathname);
  response.headers.set('X-Timestamp', new Date().toISOString());
  
  return response;
}

// 配置匹配器
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

// API 路由中间件示例
// app/api/protected/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // 验证 API 密钥
  const apiKey = request.headers.get('X-API-Key');
  
  if (!apiKey || apiKey !== process.env.API_SECRET) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // 处理请求
  return NextResponse.json({ message: 'Success' });
}`}
              language="tsx"
              filename="中间件完整示例"
            />
          }
        />

        {/* 路由系统对比 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            路由系统：App Router vs Pages Router
          </h2>
          <div className="prose prose-lg max-w-none dark:prose-invert mb-6">
            <p>
              Next.js 提供了两种路由系统：传统的 Pages Router 和新的 App Router。
              App Router 是 Next.js 13+ 引入的新路由系统，提供了更强大的功能。
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Pages Router (传统)
              </h3>
              <div className="space-y-3">
                <div className="text-sm">
                  <div className="font-mono text-gray-600 dark:text-gray-400 mb-2">文件结构:</div>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded font-mono text-xs">
                    pages/<br/>
                    ├── index.js          → /<br/>
                    ├── about.js          → /about<br/>
                    ├── blog/<br/>
                    │   ├── index.js      → /blog<br/>
                    │   └── [slug].js     → /blog/:slug<br/>
                    └── api/<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;└── users.js      → /api/users
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>特点:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• 简单直观的文件路由</li>
                    <li>• getServerSideProps</li>
                    <li>• getStaticProps</li>
                    <li>• 成熟稳定</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Layers className="h-5 w-5 mr-2 text-green-600" />
                App Router (推荐)
              </h3>
              <div className="space-y-3">
                <div className="text-sm">
                  <div className="font-mono text-gray-600 dark:text-gray-400 mb-2">文件结构:</div>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded font-mono text-xs">
                    app/<br/>
                    ├── layout.js         → 根布局<br/>
                    ├── page.js           → /<br/>
                    ├── about/<br/>
                    │   └── page.js       → /about<br/>
                    ├── blog/<br/>
                    │   ├── layout.js     → 博客布局<br/>
                    │   ├── page.js       → /blog<br/>
                    │   └── [slug]/<br/>
                    │   &nbsp;&nbsp;&nbsp;&nbsp;└── page.js   → /blog/:slug<br/>
                    └── api/<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;└── users/<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── route.js  → /api/users
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>特点:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• 支持嵌套布局</li>
                    <li>• Server Components</li>
                    <li>• 流式渲染</li>
                    <li>• 更强大的数据获取</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <CodeBlock
            code={`// App Router 示例
// app/layout.tsx - 根布局
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body>
        <header>全局导航</header>
        {children}
        <footer>全局页脚</footer>
      </body>
    </html>
  );
}

// app/blog/layout.tsx - 嵌套布局
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="blog-container">
      <aside>博客侧边栏</aside>
      <main>{children}</main>
    </div>
  );
}

// app/blog/[slug]/page.tsx - 动态路由
export default function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  return <h1>博客文章: {params.slug}</h1>;
}`}
            language="tsx"
            filename="App Router 路由示例"
          />
        </section>

        {/* 渲染模式演示 */}
        <DemoSection
          title="渲染模式对比与选择"
          description="深度理解 SSR、SSG、ISR、CSR 四种渲染模式的特点、优势和适用场景"
          demoComponent={<RenderingModesDemo />}
          codeComponent={
            <CodeBlock
              code={`// 1. SSR (服务端渲染) - 每次请求时渲染
export default async function SSRPage() {
  // 服务器端获取数据
  const response = await fetch('https://api.example.com/posts', {
    cache: 'no-store' // 不缓存，每次都重新获取
  });
  const posts = await response.json();
  
  return (
    <div>
      <h1>最新文章 (SSR)</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <time>{new Date(post.createdAt).toLocaleDateString()}</time>
        </article>
      ))}
    </div>
  );
}

// 2. SSG (静态生成) - 构建时预渲染
export default async function SSGPage() {
  const response = await fetch('https://api.example.com/posts');
  const posts = await response.json();
  
  return (
    <div>
      <h1>文章列表 (SSG)</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </article>
      ))}
    </div>
  );
}

// 动态路由的静态生成
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// 3. ISR (增量静态再生) - 静态 + 按需更新
export default async function ISRPage() {
  const response = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 } // 1小时后重新验证
  });
  const posts = await response.json();
  
  return (
    <div>
      <h1>新闻文章 (ISR)</h1>
      <p>数据每小时更新一次</p>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <time>{new Date(post.updatedAt).toLocaleDateString()}</time>
        </article>
      ))}
    </div>
  );
}

// 4. CSR (客户端渲染) - 在浏览器中渲染
'use client';

import { useState, useEffect } from 'react';

export default function CSRPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      });
  }, []);
  
  if (loading) return <div>加载中...</div>;
  
  return (
    <div>
      <h1>用户动态 (CSR)</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </article>
      ))}
    </div>
  );
}`}
              language="tsx"
              filename="四种渲染模式完整示例"
            />
          }
        />

        {/* 渲染模式 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            渲染模式选择指南
          </h2>
          <div className="prose prose-lg max-w-none dark:prose-invert mb-6">
            <p>
              Next.js 支持多种渲染模式，每种模式都有其特定的使用场景和优势。
              了解这些模式可以帮助你选择最适合的渲染策略。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Server className="h-5 w-5 mr-2 text-blue-600" />
                SSR (服务端渲染)
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <p><strong>特点:</strong> 每次请求时在服务器生成 HTML</p>
                <p><strong>适用:</strong> 需要实时数据的页面</p>
                <p><strong>优势:</strong> SEO 友好，首屏快速显示</p>
                <p><strong>劣势:</strong> 服务器负载高，TTFB 较慢</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-green-600" />
                SSG (静态生成)
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <p><strong>特点:</strong> 构建时预生成静态 HTML</p>
                <p><strong>适用:</strong> 内容相对固定的页面</p>
                <p><strong>优势:</strong> 性能最佳，CDN 友好</p>
                <p><strong>劣势:</strong> 需要重新构建更新内容</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-600" />
                ISR (增量静态再生)
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <p><strong>特点:</strong> 静态生成 + 后台更新</p>
                <p><strong>适用:</strong> 需要定期更新的静态内容</p>
                <p><strong>优势:</strong> 兼顾性能和内容新鲜度</p>
                <p><strong>劣势:</strong> 实现相对复杂</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Globe className="h-5 w-5 mr-2 text-purple-600" />
                CSR (客户端渲染)
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <p><strong>特点:</strong> 在浏览器中渲染内容</p>
                <p><strong>适用:</strong> 高度交互的应用界面</p>
                <p><strong>优势:</strong> 丰富的交互体验</p>
                <p><strong>劣势:</strong> SEO 需要特殊处理</p>
              </div>
            </div>
          </div>
          
          <CodeBlock
            code={`// SSR 示例 (App Router)
export default async function ProductPage({ params }: { params: { id: string } }) {
  // 每次请求时获取数据
  const product = await getProduct(params.id);
  
  return <ProductDetails product={product} />;
}

// SSG 示例
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function StaticProductPage({ params }: { params: { id: string } }) {
  // 构建时生成静态页面
  const product = await getProduct(params.id);
  
  return <ProductDetails product={product} />;
}

// ISR 示例 (Pages Router)
export async function getStaticProps() {
  const data = await fetchData();
  
  return {
    props: { data },
    revalidate: 60, // 60秒后重新生成
  };
}`}
            language="tsx"
            filename="不同渲染模式示例"
          />
        </section>

        {/* 数据获取 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            数据获取策略
          </h2>
          <div className="prose prose-lg max-w-none dark:prose-invert mb-6">
            <p>
              Next.js 提供了多种数据获取方法，支持不同的渲染策略和使用场景。
              App Router 简化了数据获取，使其更加直观和强大。
            </p>
          </div>
          
          <div className="space-y-6 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                App Router 数据获取 (推荐)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">服务端组件</h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• 直接使用 async/await</li>
                    <li>• 自动缓存优化</li>
                    <li>• 支持并行数据获取</li>
                    <li>• 零客户端 JavaScript</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">客户端组件</h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• 使用 use 钩子</li>
                    <li>• SWR 或 React Query</li>
                    <li>• 传统的 useEffect</li>
                    <li>• 支持实时更新</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Pages Router 数据获取 (传统)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">getStaticProps</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">构建时数据获取</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">getServerSideProps</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">请求时数据获取</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">getStaticPaths</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">动态路由预生成</p>
                </div>
              </div>
            </div>
          </div>
          
          <CodeBlock
            code={`// App Router 数据获取示例

// 1. 服务端组件 - 直接 async/await
export default async function PostsPage() {
  // 并行获取数据
  const [posts, categories] = await Promise.all([
    fetch('https://api.example.com/posts').then(res => res.json()),
    fetch('https://api.example.com/categories').then(res => res.json())
  ]);
  
  return (
    <div>
      <h1>博客文章</h1>
      <CategoryFilter categories={categories} />
      <PostList posts={posts} />
    </div>
  );
}

// 2. 缓存配置
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    cache: 'force-cache', // 强制缓存
    // cache: 'no-store', // 不缓存
    // next: { revalidate: 60 } // 60秒重新验证
  });
  
  return res.json();
}

// 3. 客户端组件数据获取
'use client';

import { use } from 'react';

function ClientPosts({ postsPromise }: { postsPromise: Promise<Post[]> }) {
  const posts = use(postsPromise); // React 18+ use 钩子
  
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

// 4. 错误处理和加载状态
export default async function PostsPageWithErrorHandling() {
  try {
    const posts = await getPosts();
    return <PostList posts={posts} />;
  } catch (error) {
    return <div>加载失败: {error.message}</div>;
  }
}`}
            language="tsx"
            filename="App Router 数据获取示例"
          />
        </section>

        {/* API 调用机制演示 */}
        <DemoSection
          title="API 调用机制与模式"
          description="比较 REST、GraphQL、tRPC、SWR 等不同的 API 调用模式和数据获取策略"
          demoComponent={<APICallDemo />}
          codeComponent={
            <CodeBlock
              code={`// REST API 路由示例
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  
  const users = await prisma.user.findMany({
    skip: (page - 1) * 10,
    take: 10
  });
  
  return NextResponse.json({ users, page });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  const user = await prisma.user.create({
    data: { name: body.name, email: body.email }
  });
  
  return NextResponse.json(user, { status: 201 });
}

// 客户端调用 REST API
async function fetchUsers() {
  const response = await fetch('/api/users?page=1');
  return response.json();
}

// GraphQL API 示例
// app/api/graphql/route.ts
import { createYoga } from 'graphql-yoga';

const typeDefs = \`
  type User {
    id: ID!
    name: String!
    email: String!
  }
  
  type Query {
    users: [User!]!
  }
\`;

const resolvers = {
  Query: {
    users: () => prisma.user.findMany()
  }
};

const yoga = createYoga({
  schema: buildSchema(typeDefs),
  resolvers
});

export { yoga as GET, yoga as POST };

// tRPC 示例
// lib/trpc.ts
import { initTRPC } from '@trpc/server';

const t = initTRPC.create();

export const appRouter = t.router({
  users: t.procedure.query(() => prisma.user.findMany()),
  createUser: t.procedure
    .input(z.object({ name: z.string(), email: z.string() }))
    .mutation(({ input }) => prisma.user.create({ data: input }))
});

// SWR 数据获取
import useSWR from 'swr';

function UsersComponent() {
  const { data, error } = useSWR('/api/users', fetcher);
  
  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;
  
  return <div>{data.users.map(user => ...)}</div>;
}`}
              language="tsx"
              filename="API 调用模式完整示例"
            />
          }
        />

        {/* API Routes */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            API Routes (API 路由)
          </h2>
          <div className="prose prose-lg max-w-none dark:prose-invert mb-6">
            <p>
              Next.js 允许你在同一个项目中创建 API 端点，实现全栈开发。
              API Routes 让你可以轻松构建后端功能，而无需单独的服务器。
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Pages Router API
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <p>文件位置: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">pages/api/</code></p>
                <p>路由示例:</p>
                <ul className="pl-4 space-y-1">
                  <li>• <code>pages/api/users.js</code> → <code>/api/users</code></li>
                  <li>• <code>pages/api/posts/[id].js</code> → <code>/api/posts/:id</code></li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                App Router API
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <p>文件位置: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">app/api/</code></p>
                <p>路由示例:</p>
                <ul className="pl-4 space-y-1">
                  <li>• <code>app/api/users/route.js</code> → <code>/api/users</code></li>
                  <li>• <code>app/api/posts/[id]/route.js</code> → <code>/api/posts/:id</code></li>
                </ul>
              </div>
            </div>
          </div>
          
          <CodeBlock
            code={`// App Router API Route 示例
// app/api/users/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/users
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const users = await prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
    
    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total: await prisma.user.count(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '获取用户失败' },
      { status: 500 }
    );
  }
}

// POST /api/users
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email } = body;
    
    // 验证输入
    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: '姓名和邮箱为必填项' },
        { status: 400 }
      );
    }
    
    // 创建用户
    const user = await prisma.user.create({
      data: { name, email },
    });
    
    return NextResponse.json(
      { success: true, data: user },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '创建用户失败' },
      { status: 500 }
    );
  }
}

// 动态路由示例
// app/api/users/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        posts: true,
        _count: {
          select: { posts: true, comments: true },
        },
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '获取用户失败' },
      { status: 500 }
    );
  }
}

// 中间件示例
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // API 路由的 CORS 处理
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};`}
            language="tsx"
            filename="API Routes 完整示例"
          />
        </section>

        {/* 网络监控演示 */}
        <DemoSection
          title="网络请求监控 & 性能分析"
          description="实时观察不同渲染模式下的网络请求瀑布图、性能指标和 Core Web Vitals"
          demoComponent={<NetworkMonitorDemo />}
          codeComponent={
            <CodeBlock
              code={`// 浏览器开发者工具网络监控实现
// 1. Performance API 性能监控
function measurePerformance() {
  // 获取导航时序
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  const metrics = {
    // DNS 解析时间
    dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
    
    // TCP 连接时间
    tcpConnect: navigation.connectEnd - navigation.connectStart,
    
    // 请求响应时间
    requestResponse: navigation.responseEnd - navigation.requestStart,
    
    // DOM 解析时间
    domParsing: navigation.domInteractive - navigation.responseEnd,
    
    // 资源加载时间
    resourceLoad: navigation.loadEventStart - navigation.domContentLoadedEventEnd,
    
    // 总加载时间
    totalLoad: navigation.loadEventEnd - navigation.navigationStart
  };
  
  return metrics;
}

// 2. Core Web Vitals 监控
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function monitorWebVitals() {
  getCLS(console.log); // Cumulative Layout Shift
  getFID(console.log); // First Input Delay
  getFCP(console.log); // First Contentful Paint
  getLCP(console.log); // Largest Contentful Paint
  getTTFB(console.log); // Time to First Byte
}

// 3. 网络请求监控
function monitorNetworkRequests() {
  // 监听所有网络请求
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === 'resource') {
        const resource = entry as PerformanceResourceTiming;
        console.log({
          name: resource.name,
          type: getResourceType(resource.name),
          size: resource.transferSize,
          duration: resource.duration,
          timing: {
            dns: resource.domainLookupEnd - resource.domainLookupStart,
            connect: resource.connectEnd - resource.connectStart,
            request: resource.responseStart - resource.requestStart,
            response: resource.responseEnd - resource.responseStart
          }
        });
      }
    });
  });
  
  observer.observe({ entryTypes: ['resource'] });
}

// 4. 不同渲染模式的性能特征
const renderingModeMetrics = {
  SSR: {
    pros: ['快速首屏渲染', 'SEO 友好', '服务器端数据获取'],
    cons: ['服务器负载高', 'TTFB 较慢'],
    典型指标: {
      TTFB: '200-500ms',
      FCP: '200-400ms', 
      LCP: '400-800ms',
      TTI: '600-1200ms'
    }
  },
  
  SSG: {
    pros: ['最快的加载速度', 'CDN 友好', '低服务器负载'],
    cons: ['数据可能过时', '构建时间长'],
    典型指标: {
      TTFB: '50-150ms',
      FCP: '100-300ms',
      LCP: '200-500ms', 
      TTI: '300-600ms'
    }
  },
  
  CSR: {
    pros: ['动态交互', '减少服务器负载'],
    cons: ['慢首屏渲染', 'SEO 困难'],
    典型指标: {
      TTFB: '50-100ms',
      FCP: '500-1500ms',
      LCP: '1000-2500ms',
      TTI: '1500-3000ms'
    }
  }
};`}
              language="typescript"
              filename="网络监控与性能分析"
            />
          }
        />

        {/* 内置优化演示 */}
        <DemoSection
          title="Next.js 内置优化演示"
          description="体验 Next.js 提供的各种性能优化功能，包括图片优化、代码分割、预取等"
          demoComponent={<PerformanceDemo />}
          codeComponent={
            <CodeBlock
              code={`// 1. 图片优化
import Image from 'next/image';

function OptimizedImage() {
  return (
    <Image
      src="/hero.jpg"
      alt="英雄图片"
      width={800}
      height={600}
      priority // 优先加载
      placeholder="blur" // 模糊占位符
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..." 
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}

// 2. 动态导入和代码分割
import dynamic from 'next/dynamic';

const DynamicChart = dynamic(() => import('@/components/Chart'), {
  loading: () => <p>加载图表中...</p>,
  ssr: false, // 禁用服务端渲染
});

// 3. 字体优化
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// 4. 链接预取
import Link from 'next/link';

function Navigation() {
  return (
    <nav>
      <Link href="/about" prefetch={true}>
        关于我们
      </Link>
    </nav>
  );
}

// 5. 脚本优化
import Script from 'next/script';

function Analytics() {
  return (
    <Script
      src="https://www.googletagmanager.com/gtag/js?id=GA_ID"
      strategy="afterInteractive"
    />
  );
}`}
              language="tsx"
              filename="Next.js 内置优化示例"
            />
          }
        />

        {/* 内置优化 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Next.js 内置优化详解
          </h2>
          <div className="prose prose-lg max-w-none dark:prose-invert mb-6">
            <p>
              Next.js 提供了许多开箱即用的性能优化功能，让你的应用自动获得最佳性能，
              而无需手动配置复杂的优化设置。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                图片优化
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• 自动格式转换 (WebP, AVIF)</li>
                <li>• 响应式图片</li>
                <li>• 懒加载</li>
                <li>• 尺寸优化</li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-600" />
                代码分割
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• 自动页面分割</li>
                <li>• 动态导入</li>
                <li>• 共享代码提取</li>
                <li>• 按需加载</li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Settings className="h-5 w-5 mr-2 text-green-600" />
                字体优化
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• 字体预加载</li>
                <li>• FOUT 防护</li>
                <li>• Google Fonts 优化</li>
                <li>• 子集化</li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Globe className="h-5 w-5 mr-2 text-purple-600" />
                脚本优化
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• 第三方脚本优化</li>
                <li>• 策略加载</li>
                <li>• 内联优化</li>
                <li>• 预连接</li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Database className="h-5 w-5 mr-2 text-indigo-600" />
                缓存策略
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• 自动静态优化</li>
                <li>• 数据缓存</li>
                <li>• 路由缓存</li>
                <li>• 组件缓存</li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <ArrowRight className="h-5 w-5 mr-2 text-red-600" />
                预取和预加载
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• 链接预取</li>
                <li>• 路由预加载</li>
                <li>• 智能预测</li>
                <li>• 关键资源优先</li>
              </ul>
            </div>
          </div>
          
          <CodeBlock
            code={`// 1. 图片优化示例
import Image from 'next/image';

function OptimizedImage() {
  return (
    <Image
      src="/hero.jpg"
      alt="英雄图片"
      width={800}
      height={600}
      priority // 优先加载
      placeholder="blur" // 模糊占位符
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..." // 占位符数据
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // 响应式尺寸
    />
  );
}

// 2. 字体优化示例
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // 字体交换策略
  variable: '--font-inter', // CSS 变量
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

export default function RootLayout({ children }) {
  return (
    <html lang="zh" className={\`\${inter.variable} \${robotoMono.variable}\`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}

// 3. 脚本优化示例
import Script from 'next/script';

function Analytics() {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
        strategy="afterInteractive" // 页面交互后加载
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {\`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'GA_MEASUREMENT_ID');
        \`}
      </Script>
    </>
  );
}

// 4. 动态导入和代码分割
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// 动态导入组件
const DynamicChart = dynamic(() => import('@/components/Chart'), {
  loading: () => <p>加载图表中...</p>,
  ssr: false, // 禁用服务端渲染
});

// 条件加载
const ConditionalComponent = dynamic(
  () => import('@/components/HeavyComponent'),
  { ssr: false }
);

function Dashboard() {
  const [showChart, setShowChart] = useState(false);
  
  return (
    <div>
      <h1>仪表板</h1>
      {showChart && (
        <Suspense fallback={<div>加载中...</div>}>
          <DynamicChart />
        </Suspense>
      )}
    </div>
  );
}

// 5. 链接预取
import Link from 'next/link';

function Navigation() {
  return (
    <nav>
      <Link 
        href="/about" 
        prefetch={true} // 预取页面
      >
        关于我们
      </Link>
      <Link 
        href="/heavy-page" 
        prefetch={false} // 禁用预取
      >
        重型页面
      </Link>
    </nav>
  );
}`}
            language="tsx"
            filename="Next.js 内置优化示例"
          />
        </section>

        {/* 流式渲染 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            流式渲染 (Streaming)
          </h2>
          <div className="prose prose-lg max-w-none dark:prose-invert mb-6">
            <p>
              流式渲染是 Next.js 13+ 的强大特性，允许页面内容逐步加载，提供更好的用户体验。
              用户可以立即看到页面的一部分，而其他部分仍在加载中。
            </p>
          </div>
          
          <CodeBlock
            code={streamingCode}
            language="tsx"
            filename="流式渲染示例"
          />
        </section>

        {/* 互动编辑器 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            在线代码编辑器
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            尝试修改下面的代码，体验 Next.js 15 的特性：
          </p>
          
          <CodeEditor
            title="Next.js 15 组件示例"
            defaultCode={`'use client';

import { useState } from 'react';

export default function MyComponent() {
  const [message, setMessage] = useState('Hello Next.js 15!');
  
  return (
    <div className="p-4 border rounded">
      <h1 className="text-2xl font-bold mb-4">{message}</h1>
      <button 
        onClick={() => setMessage('你修改了代码！')}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        点击我
      </button>
    </div>
  );
}`}
            language="tsx"
            height="300px"
            onRun={(code) => console.log('执行代码:', code)}
            showConsole={true}
          />
        </section>

        {/* 核心概念总结 */}
        <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Next.js 核心概念总结
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-3 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                路由系统
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-blue-600 flex-shrink-0" />
                  App Router：支持嵌套布局
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-blue-600 flex-shrink-0" />
                  文件系统路由：直观易懂
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-blue-600 flex-shrink-0" />
                  动态路由：灵活的参数处理
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-blue-600 flex-shrink-0" />
                  特殊文件：loading、error、layout
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-3 flex items-center">
                <Server className="h-5 w-5 mr-2" />
                渲染模式
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-green-600 flex-shrink-0" />
                  SSR：服务端渲染，SEO 友好
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-green-600 flex-shrink-0" />
                  SSG：静态生成，性能最佳
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-green-600 flex-shrink-0" />
                  ISR：增量静态再生
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-green-600 flex-shrink-0" />
                  CSR：客户端渲染，交互丰富
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-purple-600 mb-3 flex items-center">
                <Database className="h-5 w-5 mr-2" />
                数据获取
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-purple-600 flex-shrink-0" />
                  async/await：直接在组件中
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-purple-600 flex-shrink-0" />
                  自动缓存：智能缓存策略
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-purple-600 flex-shrink-0" />
                  并行获取：Promise.all 支持
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-purple-600 flex-shrink-0" />
                  错误处理：内置错误边界
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-orange-600 mb-3 flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                API Routes
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-orange-600 flex-shrink-0" />
                  全栈开发：前后端一体化
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-orange-600 flex-shrink-0" />
                  RESTful API：标准 HTTP 方法
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-orange-600 flex-shrink-0" />
                  中间件支持：请求拦截处理
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-orange-600 flex-shrink-0" />
                  类型安全：TypeScript 支持
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-red-600 mb-3 flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                性能优化
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-red-600 flex-shrink-0" />
                  自动优化：开箱即用
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-red-600 flex-shrink-0" />
                  代码分割：按需加载
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-red-600 flex-shrink-0" />
                  图片优化：WebP、懒加载
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-red-600 flex-shrink-0" />
                  字体优化：预加载、子集化
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-indigo-600 mb-3 flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                开发体验
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-indigo-600 flex-shrink-0" />
                  热重载：快速开发反馈
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-indigo-600 flex-shrink-0" />
                  TypeScript：开箱即用
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-indigo-600 flex-shrink-0" />
                  ESLint：代码质量保证
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-indigo-600 flex-shrink-0" />
                  零配置：快速上手
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              💡 Next.js 最佳实践建议
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
              <div>
                <p><strong>路由设计：</strong>合理规划页面结构，利用嵌套布局</p>
                <p><strong>渲染策略：</strong>根据内容特性选择合适的渲染模式</p>
                <p><strong>数据获取：</strong>在服务端获取数据，减少客户端请求</p>
              </div>
              <div>
                <p><strong>性能优化：</strong>使用 Next.js Image 组件优化图片</p>
                <p><strong>代码分割：</strong>使用动态导入进行组件懒加载</p>
                <p><strong>SEO 优化：</strong>合理使用 metadata API 提升搜索排名</p>
              </div>
            </div>
          </div>
        </section>

        {/* 快速访问演示页面 */}
        <QuickAccessDemos />

        {/* 下一步 */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            准备好了吗？
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            现在你已经了解了 Next.js 15 的基础概念，让我们继续学习 TypeScript 集成。
          </p>
          <Link
            href="/tutorials/typescript"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            学习 TypeScript 集成
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </section>
      </div>
    </TutorialLayout>
  );
}
