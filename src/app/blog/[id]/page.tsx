import { Metadata } from 'next';
import Link from 'next/link';

import BlogInteractions from '@/components/BlogInteractions';

// JSONPlaceholder 博客文章接口
interface JSONPlaceholderPost {
  id: number;
  userId: number;
  title: string;
  body: string;
}

// JSONPlaceholder 用户接口
interface JSONPlaceholderUser {
  id: number;
  name: string;
  email: string;
  username: string;
}

// 增强的博客文章接口
interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorEmail: string;
  publishedAt: string;
  excerpt: string;
  tags: string[];
}

// 推荐文章组件 - Server Component
async function RecommendedPosts({ currentPostId }: { currentPostId: string }) {
  try {
    // 获取推荐文章（相邻的2篇文章）
    const currentId = parseInt(currentPostId);
    const recommendedIds = [Math.max(1, currentId - 1), Math.min(100, currentId + 1)].filter(
      id => id.toString() !== currentPostId
    );

    const recommendedPosts = await Promise.all(
      recommendedIds.slice(0, 2).map(async id => {
        try {
          const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
            cache: 'force-cache',
          });
          if (!response.ok) return null;

          const post: JSONPlaceholderPost = await response.json();
          return {
            id: post.id.toString(),
            title: post.title,
            excerpt: post.body.substring(0, 100) + '...',
            author: '博客作者',
            publishedAt: generatePublishDate(post.id),
          };
        } catch {
          return null;
        }
      })
    );

    const validPosts = recommendedPosts.filter(
      (post): post is NonNullable<typeof post> => post !== null
    );

    if (validPosts.length === 0) {
      return null;
    }

    return (
      <aside className="mt-12 bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">推荐阅读</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {validPosts.map(recommendedPost => (
            <Link
              key={recommendedPost.id}
              href={`/blog/${recommendedPost.id}`}
              className="block bg-white rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h4 className="font-semibold text-blue-600 mb-2 hover:text-blue-800">
                {recommendedPost.title}
              </h4>
              <p className="text-gray-600 text-sm line-clamp-2">{recommendedPost.excerpt}</p>
              <div className="mt-2 text-xs text-gray-500">
                {recommendedPost.author} • {recommendedPost.publishedAt}
              </div>
            </Link>
          ))}
        </div>
      </aside>
    );
  } catch (_error) {
    // console.error('获取推荐文章失败:', _error);
    return null;
  }
}

// 模拟博客数据 - 现在已替换为 JSONPlaceholder API
const _mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Next.js 15 中的 Server Components 深度解析',
    content: `
      # Server Components 革命性变化

      Next.js 15 带来了革命性的 Server Components，这是 React 生态系统的重大突破。Server Components 允许我们在服务器端渲染组件，带来了前所未有的性能提升。

      ## 核心优势

      **1. 零客户端 JavaScript**
      Server Components 完全在服务器端渲染，不会向客户端发送任何 JavaScript 代码。这意味着：
      - 更小的 bundle 大小
      - 更快的页面加载速度
      - 更好的 SEO 表现

      **2. 直接服务器资源访问**
      可以直接访问：
      - 数据库
      - 文件系统
      - 环境变量
      - 第三方 API

      **3. 自动缓存优化**
      Next.js 15 提供了智能缓存机制，可以缓存 Server Components 的渲染结果。

      ## 实际应用场景

      Server Components 特别适用于：
      - 数据展示页面
      - 静态内容
      - SEO 重要的页面
      - 不需要交互的组件

      这种架构让我们可以构建更快、更高效的 Web 应用程序。
    `,
    author: '张三',
    authorEmail: 'zhangsan@example.com',
    publishedAt: '2024-01-15',
    excerpt: '深入了解 Next.js 15 中 Server Components 的革命性变化和性能优势',
    tags: ['Next.js', 'React', 'Server Components'],
  },
  {
    id: '2',
    title: 'Client Components 最佳实践指南',
    content: `
      # Client Components 完全指南

      虽然 Server Components 是 Next.js 15 的亮点，但 Client Components 仍然是构建交互式用户界面的核心。

      ## 何时使用 Client Components

      **必须使用 Client Components 的场景：**
      - 使用 React Hooks (useState, useEffect, useContext 等)
      - 事件处理 (onClick, onChange 等)
      - 浏览器 API (localStorage, geolocation 等)
      - 第三方交互库 (图表、地图等)

      ## 性能优化策略

      **1. 懒加载**
      使用 React.lazy() 和 Suspense 来懒加载 Client Components：

      \`\`\`tsx
      const InteractiveChart = lazy(() => import('./InteractiveChart'));

      export default function Dashboard() {
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <InteractiveChart />
          </Suspense>
        );
      }
      \`\`\`

      **2. 组件边界优化**
      将交互功能封装在最小的 Client Component 中，其余部分使用 Server Components。

      **3. 状态管理**
      使用现代状态管理库如 Zustand 或 TanStack Query 来优化数据流。

      ## 最佳实践

      1. **最小化 Client Components** - 只在必要时使用
      2. **合理的组件拆分** - 将交互逻辑独立出来
      3. **性能监控** - 使用 React DevTools 监控性能
      4. **错误边界** - 为 Client Components 添加错误处理

      通过合理使用 Client Components，我们可以在保持良好性能的同时提供丰富的用户交互体验。
    `,
    author: '李四',
    authorEmail: 'lisi@example.com',
    publishedAt: '2024-01-20',
    excerpt: '学习如何在 Next.js 15 中正确使用 Client Components 构建交互式界面',
    tags: ['React', 'Client Components', 'Performance'],
  },
  {
    id: '3',
    title: 'Next.js 15 全栈开发最佳实践',
    content: `
      # 全栈开发新纪元

      Next.js 15 不仅仅是一个前端框架，它已经成为了一个完整的全栈开发解决方案。

      ## 架构设计

      **现代全栈架构：**
      - Server Components 处理数据获取和渲染
      - Client Components 处理用户交互
      - API Routes 提供后端服务
      - Middleware 处理请求拦截和认证

      ## 数据库集成

      **推荐技术栈：**
      - **ORM**: Prisma - 类型安全的数据库访问
      - **数据库**: PostgreSQL/MySQL/SQLite
      - **缓存**: Redis - 提升性能
      - **文件存储**: S3/CloudFlare R2

      ## API 设计模式

      **RESTful API 结构：**
      \`\`\`
      app/api/
      ├── auth/
      │   ├── login/route.ts
      │   ├── register/route.ts
      │   └── logout/route.ts
      ├── posts/
      │   ├── route.ts
      │   └── [id]/route.ts
      └── users/
          ├── route.ts
          └── [id]/route.ts
      \`\`\`

      ## 安全性考虑

      **关键安全措施：**
      1. **身份认证** - JWT 或 Session-based
      2. **CSRF 保护** - 使用 CSRF tokens
      3. **XSS 防护** - 内容安全策略
      4. **SQL 注入防护** - ORM 参数化查询
      5. **速率限制** - API 调用频率控制

      ## 部署策略

      **推荐部署方案：**
      - **Vercel** - 零配置部署，完美支持 Next.js
      - **Docker** - 容器化部署，跨环境一致性
      - **CI/CD** - GitHub Actions 自动化部署

      ## 监控和分析

      **性能监控工具：**
      - Next.js Analytics - 页面性能分析
      - Sentry - 错误监控和性能追踪
      - Google Analytics - 用户行为分析

      通过这些最佳实践，我们可以构建出高性能、可扩展、安全的全栈应用程序。
    `,
    author: '王五',
    authorEmail: 'wangwu@example.com',
    publishedAt: '2024-01-25',
    excerpt: '掌握 Next.js 15 全栈开发的核心技术和最佳实践',
    tags: ['Next.js', 'Full Stack', 'Best Practices', 'Architecture'],
  },
];

// 生成随机标签
function generateTags(_title: string): string[] {
  const allTags = [
    'Next.js',
    'React',
    'JavaScript',
    'TypeScript',
    'Web开发',
    'Server Components',
    'Client Components',
    'Performance',
    'API',
    'Tutorial',
  ];
  const tagCount = Math.floor(Math.random() * 3) + 2; // 2-4个标签
  const shuffled = allTags.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, tagCount);
}

// 生成发布日期
function generatePublishDate(id: number): string {
  const startDate = new Date('2024-01-01');
  const dayOffset = id * 2; // 每篇文章间隔2天
  const publishDate = new Date(startDate.getTime() + dayOffset * 24 * 60 * 60 * 1000);
  return publishDate.toISOString().split('T')[0] || '2024-01-01';
}

// 获取博客文章数据 - Server Component 中的异步函数
async function getBlogPost(id: string): Promise<BlogPost | null> {
  try {
    const postId = parseInt(id);
    if (isNaN(postId) || postId < 1 || postId > 100) {
      return null; // JSONPlaceholder 只有 100 篇文章
    }

    // 并行获取文章和作者信息 - 演示 Server Component 的优势
    const [postResponse, userResponse] = await Promise.all([
      fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
        cache: 'force-cache', // 服务器端缓存优化
      }),
      fetch(`https://jsonplaceholder.typicode.com/users/1`, {
        cache: 'force-cache',
      }),
    ]);

    if (!postResponse.ok) {
      return null;
    }

    const post: JSONPlaceholderPost = await postResponse.json();
    let user: JSONPlaceholderUser;

    if (userResponse.ok) {
      user = await userResponse.json();
    } else {
      // 备用用户信息
      user = {
        id: 1,
        name: '匿名作者',
        email: 'anonymous@example.com',
        username: 'anonymous',
      };
    }

    // 根据用户ID获取对应的作者信息
    const authorResponse = await fetch(
      `https://jsonplaceholder.typicode.com/users/${post.userId}`,
      {
        cache: 'force-cache',
      }
    );

    if (authorResponse.ok) {
      user = await authorResponse.json();
    }

    // 转换为我们的博客格式
    const blogPost: BlogPost = {
      id: post.id.toString(),
      title: post.title,
      content: post.body,
      author: user.name,
      authorEmail: user.email || 'unknown@example.com',
      publishedAt: generatePublishDate(post.id),
      excerpt: post.body.substring(0, 150) + '...',
      tags: generateTags(post.title),
    };

    return blogPost;
  } catch (_error) {
    // console.error('获取博客文章失败:', _error);
    return null;
  }
}

// 生成页面元数据
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.id);

  if (!post) {
    return {
      title: '文章未找到 - Blog',
      description: '您访问的文章不存在',
    };
  }

  return {
    title: `${post.title} - Blog`,
    description: post.excerpt,
    keywords: post.tags.join(', '),
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
    },
  };
}

// 生成静态路径 - 用于静态生成
export async function generateStaticParams() {
  // 生成前20篇文章的静态页面（JSONPlaceholder 有100篇文章）
  // 这里演示 Server Component 的静态生成能力
  const posts = Array.from({ length: 20 }, (_, i) => ({
    id: (i + 1).toString(),
  }));

  return posts;
}

// 主页面组件 - Server Component (默认)
export default async function BlogPage({ params }: { params: { id: string } }) {
  // 在服务器端获取数据 - 这是 Server Component 的核心优势
  const post = await getBlogPost(params.id);

  // 如果文章不存在，显示 404 页面
  if (!post) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">文章未找到</h1>
        <p className="text-gray-600 mb-6">您访问的文章不存在或已被删除</p>
        <Link
          href="/blog"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          返回博客列表
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 面包屑导航 */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">
          首页
        </Link>
        {' > '}
        <Link href="/blog" className="hover:text-blue-600">
          博客
        </Link>
        {' > '}
        <span className="text-gray-800">{post.title}</span>
      </nav>

      {/* 文章头部 - Server Component 渲染 */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>

        <div className="flex items-center gap-4 text-gray-600 mb-4">
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            作者: <strong>{post.author}</strong>
          </span>

          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
            发布时间: {post.publishedAt}
          </span>
        </div>

        {/* 标签 */}
        <div className="flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <span
              key={tag}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      </header>

      {/* 文章内容 - Server Component 渲染，SEO 友好 */}
      <article className="prose prose-lg max-w-none mb-8">
        <div className="bg-gray-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-gray-700 font-medium">{post.excerpt}</p>
        </div>

        {/* 渲染 Markdown 内容 - 实际项目中可以使用 markdown 解析器 */}
        <div className="whitespace-pre-line leading-relaxed text-gray-800">{post.content}</div>
      </article>

      {/* 分隔线 */}
      <hr className="border-gray-200 my-8" />

      {/* Client Component - 处理交互功能 */}
      <BlogInteractions postId={params.id} />

      {/* 推荐阅读 - 使用 JSONPlaceholder API */}
      <RecommendedPosts currentPostId={params.id} />
    </div>
  );
}
