import { Globe, TrendingUp, FileText } from 'lucide-react';

// 这个页面将在构建时静态生成
async function getStaticData() {
  // 模拟构建时数据获取
  return {
    articles: [
      {
        id: 1,
        title: 'Next.js 15 新特性详解',
        excerpt: '探索 Next.js 15 带来的革命性功能和改进...',
        publishDate: '2024-01-15',
        views: 1250,
        category: '技术'
      },
      {
        id: 2,
        title: 'React 19 并发特性实战',
        excerpt: '深入了解 React 19 的并发模式和 Suspense...',
        publishDate: '2024-01-14',
        views: 950,
        category: '前端'
      },
      {
        id: 3,
        title: 'TypeScript 5.x 高级类型技巧',
        excerpt: '掌握 TypeScript 最新版本的高级类型系统...',
        publishDate: '2024-01-13',
        views: 1100,
        category: '开发'
      }
    ],
    stats: {
      totalArticles: 156,
      totalViews: 48500,
      monthlyGrowth: 12.5
    },
    buildTime: new Date().toISOString()
  };
}

export default async function SSGPage() {
  const data = await getStaticData();
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            SSG 演示页面
          </h1>
          <p className="text-gray-600">
            这个页面使用静态站点生成 (SSG)，在构建时预生成 HTML
          </p>
          <div className="mt-4 inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            <Globe className="h-4 w-4 mr-1" />
            静态生成模式
          </div>
        </div>
        
        <div className="space-y-6">
          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">总文章</h3>
              </div>
              <p className="text-3xl font-bold text-blue-600 mt-2">{data.stats.totalArticles}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">总浏览量</h3>
              </div>
              <p className="text-3xl font-bold text-green-600 mt-2">{data.stats.totalViews.toLocaleString()}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">月增长率</h3>
              </div>
              <p className="text-3xl font-bold text-purple-600 mt-2">{data.stats.monthlyGrowth}%</p>
            </div>
          </div>
          
          {/* 文章列表 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">热门文章</h2>
            <div className="space-y-4">
              {data.articles.map(article => (
                <div key={article.id} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{article.publishDate}</span>
                        <span>{article.views} 次浏览</span>
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
          
          <div className="text-center text-sm text-gray-500">
            构建时间: {new Date(data.buildTime).toLocaleString('zh-CN')}
          </div>
        </div>
      </div>
    </div>
  );
}

// 静态生成配置
export const dynamic = 'force-static';

