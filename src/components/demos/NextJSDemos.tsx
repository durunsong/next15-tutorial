'use client';

import { Loader, Play } from 'lucide-react';

import { useState } from 'react';

// 动态路由演示组件
export function DynamicRouteDemo() {
  const [currentPath, setCurrentPath] = useState('/blog/nextjs-guide');
  const [params, setParams] = useState<Record<string, string>>({ slug: 'nextjs-guide' });
  // 使用变量避免 lint 错误
  void setParams;
  const [searchParams, setSearchParams] = useState({ category: 'tech', tags: 'react,nextjs' });

  const examples = [
    {
      path: '/blog/nextjs-guide',
      file: 'app/blog/[slug]/page.tsx',
      params: { slug: 'nextjs-guide' },
      description: '单个动态参数',
    },
    {
      path: '/users/123/posts/456',
      file: 'app/users/[id]/posts/[postId]/page.tsx',
      params: { id: '123', postId: '456' },
      description: '多级动态参数',
    },
    {
      path: '/docs/react/hooks/useState',
      file: 'app/docs/[...sections]/page.tsx',
      params: { sections: ['react', 'hooks', 'useState'] },
      description: '捕获所有路由',
    },
    {
      path: '/products',
      file: 'app/products/[[...filters]]/page.tsx',
      params: { filters: undefined },
      description: '可选捕获所有路由',
    },
  ];

  const updateSearchParam = (key: string, value: string) => {
    setSearchParams(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {examples.map((example, index) => (
          <div
            key={index}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              currentPath === example.path
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            onClick={() => {
              setCurrentPath(example.path);
              // 过滤掉 undefined 值
              const filteredParams = Object.fromEntries(
                 
                Object.entries(example.params).filter(([_, value]) => value !== undefined)
              ) as Record<string, string>;
              setParams(filteredParams);
            }}
          >
            <div className="font-mono text-sm text-blue-600 dark:text-blue-400 mb-1">
              {example.path}
            </div>
            <div className="text-xs text-gray-500 mb-2">{example.description}</div>
            <div className="font-mono text-xs text-gray-600 dark:text-gray-400">{example.file}</div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">当前路由信息：</h4>
        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              路径参数 (params):
            </span>
            <pre className="mt-1 text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-x-auto">
              {JSON.stringify(params, null, 2)}
            </pre>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              查询参数 (searchParams):
            </span>
            <div className="mt-1 space-y-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="category"
                  value={searchParams.category}
                  onChange={e => updateSearchParam('category', e.target.value)}
                  className="px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
                />
                <input
                  type="text"
                  placeholder="tags"
                  value={searchParams.tags}
                  onChange={e => updateSearchParam('tags', e.target.value)}
                  className="px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <pre className="text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-x-auto">
                {JSON.stringify(searchParams, null, 2)}
              </pre>
            </div>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">完整 URL:</span>
            <div className="mt-1 font-mono text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded">
              {currentPath}?category={searchParams.category}&tags={searchParams.tags}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 数据获取演示组件
export function DataFetchingDemo() {
  const [selectedMethod, setSelectedMethod] = useState('server-component');
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [cacheStrategy, setCacheStrategy] = useState('force-cache');

  const methods = [
    {
      id: 'server-component',
      name: '服务端组件',
      description: '在服务器上获取数据，SEO 友好',
    },
    {
      id: 'client-component',
      name: '客户端组件',
      description: '在浏览器中获取数据，支持交互',
    },
    {
      id: 'use-hook',
      name: 'use 钩子',
      description: 'React 18+ 的新特性，处理 Promise',
    },
    {
      id: 'parallel-fetch',
      name: '并行获取',
      description: '同时获取多个数据源',
    },
  ];

  const cacheStrategies = [
    { value: 'force-cache', label: '强制缓存', description: '优先使用缓存' },
    { value: 'no-store', label: '不缓存', description: '每次都重新获取' },
    { value: 'revalidate', label: '重新验证', description: '定时更新缓存' },
  ];

  const simulateFetch = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockData = {
      'server-component': [
        { id: 1, title: '服务端渲染的文章 1', author: '张三' },
        { id: 2, title: '服务端渲染的文章 2', author: '李四' },
      ],
      'client-component': [
        { id: 1, title: '客户端获取的文章 1', views: 150 },
        { id: 2, title: '客户端获取的文章 2', views: 89 },
      ],
      'use-hook': [
        { id: 1, title: 'use 钩子处理的数据 1', status: 'resolved' },
        { id: 2, title: 'use 钩子处理的数据 2', status: 'resolved' },
      ],
      'parallel-fetch': {
        posts: [{ id: 1, title: '并行获取的文章' }],
        users: [{ id: 1, name: '并行获取的用户' }],
        stats: { total: 1, active: 1 },
      },
    };

    setData(mockData[selectedMethod as keyof typeof mockData]);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {methods.map(method => (
          <button
            key={method.id}
            onClick={() => setSelectedMethod(method.id)}
            className={`p-3 text-left border rounded-lg transition-colors ${
              selectedMethod === method.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="font-medium text-sm">{method.name}</div>
            <div className="text-xs text-gray-500 mt-1">{method.description}</div>
          </button>
        ))}
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {methods.find(m => m.id === selectedMethod)?.name} 演示
          </h4>
          <div className="flex items-center space-x-2">
            <select
              value={cacheStrategy}
              onChange={e => setCacheStrategy(e.target.value)}
              className="px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
            >
              {cacheStrategies.map(strategy => (
                <option key={strategy.value} value={strategy.value}>
                  {strategy.label}
                </option>
              ))}
            </select>
            <button
              onClick={simulateFetch}
              disabled={loading}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-1"
            >
              {loading ? (
                <>
                  <Loader className="h-3 w-3 animate-spin" />
                  <span>获取中...</span>
                </>
              ) : (
                <>
                  <Play className="h-3 w-3" />
                  <span>获取数据</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          缓存策略: {cacheStrategies.find(s => s.value === cacheStrategy)?.description}
        </div>

        {!!data && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-3">
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(data as Record<string, unknown>, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

// 性能优化演示组件
export function PerformanceDemo() {
  const [selectedOptimization, setSelectedOptimization] = useState('image');
  const [imageFormat, setImageFormat] = useState('webp');
  const [imageSize, setImageSize] = useState('medium');
  const [codeChunks, setCodeChunks] = useState(false);
  const [prefetch, setPrefetch] = useState(true);

  const optimizations = [
    { id: 'image', name: '图片优化', icon: '🖼️' },
    { id: 'code-splitting', name: '代码分割', icon: '📦' },
    { id: 'prefetch', name: '预取优化', icon: '⚡' },
    { id: 'font', name: '字体优化', icon: '🔤' },
  ];

  const imageSizes = {
    small: { width: 200, height: 150 },
    medium: { width: 400, height: 300 },
    large: { width: 800, height: 600 },
  };

  const renderOptimizationDemo = (): React.ReactElement => {
    switch (selectedOptimization) {
      case 'image':
        return (
          <div className="space-y-4">
            <div className="flex space-x-4">
              <div>
                <label className="block text-sm font-medium mb-1">格式:</label>
                <select
                  value={imageFormat}
                  onChange={e => setImageFormat(e.target.value)}
                  className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="webp">WebP</option>
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">尺寸:</label>
                <select
                  value={imageSize}
                  onChange={e => setImageSize(e.target.value)}
                  className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="small">小 (200x150)</option>
                  <option value="medium">中 (400x300)</option>
                  <option value="large">大 (800x600)</option>
                </select>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
              <div className="text-sm font-mono mb-2">
                {`<Image
  src="/hero.jpg"
  alt="演示图片"
  width={${imageSizes[imageSize as keyof typeof imageSizes].width}}
  height={${imageSizes[imageSize as keyof typeof imageSizes].height}}
  format="${imageFormat}"
  priority
  placeholder="blur"
/>`}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                优化: 自动格式转换、响应式尺寸、懒加载、占位符
              </div>
            </div>
          </div>
        );
      case 'code-splitting':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={codeChunks}
                onChange={e => setCodeChunks(e.target.checked)}
                className="rounded"
              />
              <label className="text-sm">启用代码分割</label>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
              <div className="text-sm font-mono mb-2">
                {codeChunks
                  ? `const DynamicChart = dynamic(() => import('@/components/Chart'), {
  loading: () => <p>加载图表中...</p>,
  ssr: false
});`
                  : "import Chart from '@/components/Chart';"}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {codeChunks ? '✅ 组件按需加载，减少初始包大小' : '❌ 组件同步加载，增加初始包大小'}
              </div>
            </div>
          </div>
        );
      case 'prefetch':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={prefetch}
                onChange={e => setPrefetch(e.target.checked)}
                className="rounded"
              />
              <label className="text-sm">启用链接预取</label>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
              <div className="text-sm font-mono mb-2">
                {`<Link href="/about" prefetch={${prefetch}}>
  关于我们
</Link>`}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {prefetch ? '✅ 页面在用户点击前预加载' : '❌ 页面在用户点击时才加载'}
              </div>
            </div>
          </div>
        );
      case 'font':
        return (
          <div className="space-y-4">
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
              <div className="text-sm font-mono mb-2">
                {`import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});`}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                优化: 字体预加载、FOUT 防护、子集化、变量字体
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
            <div className="text-sm">选择一个优化选项查看演示</div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {optimizations.map(opt => (
          <button
            key={opt.id}
            onClick={() => setSelectedOptimization(opt.id)}
            className={`p-3 text-left border rounded-lg transition-colors ${
              selectedOptimization === opt.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="text-2xl mb-1">{opt.icon}</div>
            <div className="font-medium text-sm">{opt.name}</div>
          </button>
        ))}
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">
          {optimizations.find(o => o.id === selectedOptimization)?.name} 演示
        </h4>
        {renderOptimizationDemo()}
      </div>
    </div>
  );
}

// 中间件演示组件
export function MiddlewareDemo() {
  const [currentPath, setCurrentPath] = useState('/dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('guest');
  const [logs, setLogs] = useState<string[]>([]);

  const protectedRoutes = ['/dashboard', '/admin', '/profile'];
  const publicRoutes = ['/', '/login', '/about'];

  const handleRouteChange = (path: string) => {
    setCurrentPath(path);

    // 模拟中间件逻辑
    const newLog = `🔍 访问 ${path}`;

    if (protectedRoutes.some(route => path.startsWith(route))) {
      if (!isAuthenticated) {
        setLogs(prev => [...prev, newLog, '❌ 未认证，重定向到 /login']);
        setCurrentPath('/login');
        return;
      }

      if (path.startsWith('/admin') && userRole !== 'admin') {
        setLogs(prev => [...prev, newLog, '🚫 权限不足，重定向到 /dashboard']);
        setCurrentPath('/dashboard');
        return;
      }

      setLogs(prev => [...prev, newLog, '✅ 认证通过，允许访问']);
    } else {
      setLogs(prev => [...prev, newLog, '📄 公开路由，直接访问']);
    }
  };

  const clearLogs = () => setLogs([]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold">用户状态</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isAuthenticated}
                onChange={e => setIsAuthenticated(e.target.checked)}
                className="rounded"
              />
              <label className="text-sm">已登录</label>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm">角色:</label>
              <select
                value={userRole}
                onChange={e => setUserRole(e.target.value)}
                className="px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="guest">游客</option>
                <option value="user">用户</option>
                <option value="admin">管理员</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold">路由导航</h4>
          <div className="grid grid-cols-2 gap-2">
            {[...publicRoutes, ...protectedRoutes].map(route => (
              <button
                key={route}
                onClick={() => handleRouteChange(route)}
                className={`px-2 py-1 text-sm rounded border ${
                  currentPath === route
                    ? 'bg-blue-100 border-blue-300 dark:bg-blue-900/20 dark:border-blue-600'
                    : 'bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600'
                }`}
              >
                {route === '/' ? '首页' : route}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold">中间件执行日志</h4>
          <button
            onClick={clearLogs}
            className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            清除日志
          </button>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-3 h-32 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-sm text-gray-500">点击路由按钮查看中间件执行过程</div>
          ) : (
            <div className="space-y-1">
              {logs.map((log, index) => (
                <div key={index} className="text-sm font-mono">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">当前页面状态</h5>
        <div className="text-sm text-blue-800 dark:text-blue-200">
          <p>
            <strong>当前路径:</strong> {currentPath}
          </p>
          <p>
            <strong>认证状态:</strong> {isAuthenticated ? '已登录' : '未登录'}
          </p>
          <p>
            <strong>用户角色:</strong> {userRole}
          </p>
          <p>
            <strong>页面类型:</strong>{' '}
            {protectedRoutes.some(route => currentPath.startsWith(route))
              ? '受保护页面'
              : '公开页面'}
          </p>
        </div>
      </div>
    </div>
  );
}
