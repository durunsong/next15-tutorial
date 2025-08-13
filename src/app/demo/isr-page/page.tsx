import { Calendar, Clock, RefreshCw, TrendingUp } from 'lucide-react';

// 模拟新闻数据获取
async function getNewsData() {
  // 模拟 API 调用延迟
  await new Promise(resolve => setTimeout(resolve, 200));

  return {
    news: [
      {
        id: 1,
        title: 'Next.js 15 正式发布：带来革命性的性能提升',
        summary: 'Next.js 15 引入了全新的编译器和渲染引擎，页面加载速度提升 40%...',
        publishTime: '2024-01-15T14:30:00Z',
        author: '技术团队',
        views: 8500,
        category: '技术新闻',
        trending: true,
      },
      {
        id: 2,
        title: 'React 19 Beta 版本发布，并发特性更加稳定',
        summary: 'React 19 Beta 版本修复了多个并发模式的问题，Suspense 性能显著改善...',
        publishTime: '2024-01-15T12:15:00Z',
        author: 'React 团队',
        views: 6200,
        category: '技术新闻',
        trending: false,
      },
      {
        id: 3,
        title: 'TypeScript 5.4 新特性：更强大的类型推导',
        summary: 'TypeScript 5.4 带来了更智能的类型推导和更好的性能表现...',
        publishTime: '2024-01-15T10:45:00Z',
        author: 'TypeScript 团队',
        views: 4800,
        category: '技术新闻',
        trending: true,
      },
      {
        id: 4,
        title: 'Web 开发新趋势：全栈框架的崛起',
        summary: '分析当前全栈框架的发展趋势，包括 Next.js、Nuxt.js、SvelteKit 等...',
        publishTime: '2024-01-15T08:20:00Z',
        author: '行业分析师',
        views: 3200,
        category: '行业动态',
        trending: false,
      },
    ],
    lastUpdated: new Date().toISOString(),
    stats: {
      totalNews: 1250,
      todayPublished: 18,
      totalViews: 156000,
    },
  };
}

export default async function ISRPage() {
  const data = await getNewsData();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ISR 演示页面</h1>
          <p className="text-gray-600">这个页面使用增量静态再生 (ISR)，静态生成 + 定期更新内容</p>
          <div className="mt-4 inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            增量静态再生模式
          </div>
        </div>

        <div className="space-y-6">
          {/* 更新信息 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">页面更新信息</h3>
            </div>
            <p className="text-blue-800 mt-2">
              最后更新时间: {new Date(data.lastUpdated).toLocaleString('zh-CN')}
            </p>
            <p className="text-blue-700 text-sm mt-1">
              此页面每 5 分钟自动更新一次，确保显示最新的新闻内容
            </p>
          </div>

          {/* 统计信息 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">总新闻数</h3>
              </div>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {data.stats.totalNews.toLocaleString()}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">今日发布</h3>
              </div>
              <p className="text-3xl font-bold text-blue-600 mt-2">{data.stats.todayPublished}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">总浏览量</h3>
              </div>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {data.stats.totalViews.toLocaleString()}
              </p>
            </div>
          </div>

          {/* 新闻列表 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">最新技术新闻</h2>
              <div className="text-sm text-gray-500">实时更新 • ISR 自动更新</div>
            </div>

            <div className="space-y-6">
              {data.news.map(article => (
                <div
                  key={article.id}
                  className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{article.title}</h3>
                        {article.trending && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                            🔥 热门
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600 mb-3 leading-relaxed">{article.summary}</p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(article.publishTime).toLocaleString('zh-CN')}</span>
                        </span>
                        <span>作者: {article.author}</span>
                        <span>{article.views.toLocaleString()} 次浏览</span>
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                          {article.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ISR 说明 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">ISR 工作原理</h4>
            <ul className="text-yellow-800 text-sm space-y-1">
              <li>• 页面在构建时生成静态 HTML，提供最快的初始加载速度</li>
              <li>• 设置重新验证时间间隔（本例为 5 分钟）</li>
              <li>• 当用户访问时，如果页面过期，后台重新生成新版本</li>
              <li>• 用户仍然看到缓存的快速版本，更新在后台完成</li>
              <li>• 结合了 SSG 的性能和 SSR 的数据新鲜度</li>
            </ul>
          </div>

          <div className="text-center text-sm text-gray-500">
            页面生成时间: {new Date(data.lastUpdated).toLocaleString('zh-CN')}
          </div>
        </div>
      </div>
    </div>
  );
}

// ISR 配置：每 300 秒（5分钟）重新验证
export const revalidate = 300;
