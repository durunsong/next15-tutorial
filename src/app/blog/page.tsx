import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog - Next.js 15 技术博客',
  description: '探索 Next.js 15、React Server Components 和现代 Web 开发技术',
  keywords: 'Next.js, React, Server Components, Client Components, 前端开发',
};

// JSONPlaceholder 接口
interface JSONPlaceholderPost {
  id: number;
  userId: number;
  title: string;
  body: string;
}

interface JSONPlaceholderUser {
  id: number;
  name: string;
  email: string;
}

// 博客列表项接口
interface BlogListItem {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  tags: string[];
  readTime: string;
}

// 生成随机标签
function generateRandomTags(): string[] {
  const allTags = [
    'Next.js',
    'React',
    'JavaScript',
    'TypeScript',
    'Web开发',
    'API',
    'Tutorial',
    'Performance',
  ];
  const tagCount = Math.floor(Math.random() * 3) + 2;
  const shuffled = allTags.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, tagCount);
}

// 估算阅读时间
function estimateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.length / 5; // 估算单词数
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} 分钟阅读`;
}

// 生成发布日期
function generateDate(id: number): string {
  const startDate = new Date('2024-01-01');
  const dayOffset = id * 2;
  const publishDate = new Date(startDate.getTime() + dayOffset * 24 * 60 * 60 * 1000);
  return publishDate.toISOString().split('T')[0] || '2024-01-01';
}

// 获取博客文章列表 - Server Component
async function getBlogPosts(): Promise<BlogListItem[]> {
  try {
    // 从 JSONPlaceholder 获取前12篇文章
    const postsResponse = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=12', {
      cache: 'force-cache', // 服务器端缓存
    });

    if (!postsResponse.ok) {
      throw new Error('获取文章列表失败');
    }

    const posts: JSONPlaceholderPost[] = await postsResponse.json();

    // 获取用户信息（批量）
    const userIds = [...new Set(posts.map(post => post.userId))];
    const usersData = await Promise.all(
      userIds.map(async userId => {
        try {
          const userResponse = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
            cache: 'force-cache',
          });
          if (userResponse.ok) {
            return await userResponse.json();
          }
          return null;
        } catch {
          return null;
        }
      })
    );

    const usersMap = new Map<number, JSONPlaceholderUser>();
    usersData.forEach(user => {
      if (user) {
        usersMap.set(user.id, user);
      }
    });

    // 转换为博客列表格式
    const blogPosts: BlogListItem[] = posts.map(post => {
      const user = usersMap.get(post.userId);
      return {
        id: post.id.toString(),
        title: post.title,
        excerpt: post.body.substring(0, 120) + '...',
        author: user?.name ?? '未知作者',
        publishedAt: generateDate(post.id),
        tags: generateRandomTags(),
        readTime: estimateReadTime(post.body),
      };
    });

    return blogPosts;
  } catch (_error) {
    // console.error('获取博客列表失败:', _error);
    // 返回备用数据
    return [
      {
        id: '1',
        title: '服务器获取数据失败',
        excerpt: '这是一个演示如何处理 Server Component 中 API 调用失败的示例...',
        author: '系统',
        publishedAt: '2024-01-01',
        tags: ['Error Handling'],
        readTime: '1 分钟阅读',
      },
    ];
  }
}

// Server Component - 博客列表页面
export default async function BlogListPage() {
  // 在服务器端获取数据 - Server Component 的核心优势
  const blogPosts = await getBlogPosts();
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* 页面头部 */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Next.js 15 技术博客</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          探索 Next.js 15、React Server Components 和现代 Web 开发技术
        </p>
      </header>

      {/* 博客文章列表 */}
      <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
        {blogPosts.map(post => (
          <article
            key={post.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300"
          >
            {/* 文章卡片内容 */}
            <div className="p-6">
              {/* 标签 */}
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.slice(0, 2).map(tag => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* 文章标题 */}
              <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                <Link href={`/blog/${post.id}`} className="hover:text-blue-600 transition-colors">
                  {post.title}
                </Link>
              </h2>

              {/* 文章摘要 */}
              <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">{post.excerpt}</p>

              {/* 文章元信息 */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{post.author}</span>
                </div>
                <span>{post.readTime}</span>
              </div>

              {/* 发布日期 */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">发布于 {post.publishedAt}</span>

                  <Link
                    href={`/blog/${post.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                  >
                    阅读全文 →
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* 说明文字 */}
      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">🚀 演示说明</h3>
          <div className="text-left max-w-3xl mx-auto space-y-4 text-gray-700">
            <p className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">📖</span>
              <span>
                <strong>Server Component 示例:</strong> 博客列表和文章详情页面都是 Server
                Components， 在服务器端渲染，提供更快的首屏加载和更好的 SEO。
              </span>
            </p>

            <p className="flex items-start gap-3">
              <span className="text-green-600 font-bold">⚡</span>
              <span>
                <strong>Client Component 示例:</strong> 文章详情页面的点赞、评论功能使用 Client
                Components， 提供丰富的用户交互体验。
              </span>
            </p>

            <p className="flex items-start gap-3">
              <span className="text-purple-600 font-bold">🔄</span>
              <span>
                <strong>混合使用:</strong> Server Components 负责数据获取和静态内容渲染， Client
                Components 负责用户交互，实现最佳性能。
              </span>
            </p>

            <p className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">🌐</span>
              <span>
                <strong>真实 API 数据:</strong> 使用
                <a
                  href="https://jsonplaceholder.typicode.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline mx-1"
                >
                  JSONPlaceholder API
                </a>
                获取真实数据，演示 Server Component 的数据获取能力。支持访问 1-100 任意文章ID。
              </span>
            </p>

            <p className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">📱</span>
              <span>
                <strong>访问方式:</strong> 直接访问
                <code className="bg-gray-100 px-2 py-1 rounded mx-1 font-mono text-sm">
                  /blog/1
                </code>
                到
                <code className="bg-gray-100 px-2 py-1 rounded mx-1 font-mono text-sm">
                  /blog/100
                </code>
                查看具体文章，前20篇已预生成静态页面。
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
