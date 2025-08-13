'use client';

import { Activity, Clock, Download, ExternalLink, Globe, Monitor, Server, Zap } from 'lucide-react';

import { useRef, useState } from 'react';

import Link from 'next/link';

interface NetworkRequest {
  id: string;
  url: string;
  method: string;
  status: number;
  type: string;
  size: number;
  time: number;
  startTime: number;
  endTime: number;
  timing: {
    dns: number;
    connect: number;
    request: number;
    response: number;
    total: number;
  };
}

interface RenderingMetrics {
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
}

export function NetworkMonitor() {
  const [requests, setRequests] = useState<NetworkRequest[]>([]);
  const [metrics, setMetrics] = useState<RenderingMetrics | null>(null);
  const [selectedMode, setSelectedMode] = useState('ssr');
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  // 使用变量避免 lint 错误
  void iframeRef;

  const renderingModes = [
    {
      id: 'ssr',
      name: 'SSR 演示',
      url: '/demo/ssr-page',
      icon: <Server className="h-4 w-4" />,
      description: '服务端渲染 - 每次请求时渲染',
      color: 'blue',
    },
    {
      id: 'ssg',
      name: 'SSG 演示',
      url: '/demo/ssg-page',
      icon: <Globe className="h-4 w-4" />,
      description: '静态生成 - 构建时预生成',
      color: 'green',
    },
    {
      id: 'isr',
      name: 'ISR 演示',
      url: '/demo/isr-page',
      icon: <Zap className="h-4 w-4" />,
      description: '增量静态再生 - 按需更新',
      color: 'purple',
    },
    {
      id: 'csr',
      name: 'CSR 演示',
      url: '/demo/csr-page',
      icon: <Monitor className="h-4 w-4" />,
      description: '客户端渲染 - 浏览器中渲染',
      color: 'orange',
    },
  ];

  // 模拟网络请求数据
  const simulateNetworkRequests = (mode: string) => {
    const baseRequests: Partial<NetworkRequest>[] = [
      {
        url: renderingModes.find(m => m.id === mode)?.url || '/',
        method: 'GET',
        type: 'document',
        status: 200,
      },
      {
        url: '/_next/static/css/app.css',
        method: 'GET',
        type: 'stylesheet',
        status: 200,
      },
      {
        url: '/_next/static/js/app.js',
        method: 'GET',
        type: 'script',
        status: 200,
      },
    ];

    // 根据渲染模式添加不同的请求
    if (mode === 'ssr') {
      baseRequests.push(
        {
          url: '/api/users',
          method: 'GET',
          type: 'fetch',
          status: 200,
        },
        {
          url: '/api/posts',
          method: 'GET',
          type: 'fetch',
          status: 200,
        }
      );
    } else if (mode === 'csr') {
      baseRequests.push(
        {
          url: '/api/data',
          method: 'GET',
          type: 'fetch',
          status: 200,
        },
        {
          url: '/api/user-profile',
          method: 'GET',
          type: 'fetch',
          status: 200,
        }
      );
    }

    // 生成模拟的网络请求数据
    const requests: NetworkRequest[] = baseRequests.map((req, index) => {
      const startTime = Date.now() + index * 50;
      const timing = {
        dns: Math.random() * 20 + 5,
        connect: Math.random() * 30 + 10,
        request: Math.random() * 40 + 20,
        response: Math.random() * 100 + 50,
        total: 0,
      };
      timing.total = timing.dns + timing.connect + timing.request + timing.response;

      return {
        id: `req-${index}`,
        url: req.url!,
        method: req.method!,
        status: req.status!,
        type: req.type!,
        size: Math.floor(Math.random() * 50000 + 5000),
        time: timing.total,
        startTime,
        endTime: startTime + timing.total,
        timing,
      };
    });

    return requests;
  };

  // 模拟性能指标
  const simulateMetrics = (mode: string): RenderingMetrics => {
    const baseMetrics = {
      ssr: {
        firstPaint: 150,
        firstContentfulPaint: 200,
        largestContentfulPaint: 400,
        firstInputDelay: 50,
        cumulativeLayoutShift: 0.05,
        timeToInteractive: 600,
      },
      ssg: {
        firstPaint: 80,
        firstContentfulPaint: 120,
        largestContentfulPaint: 250,
        firstInputDelay: 30,
        cumulativeLayoutShift: 0.02,
        timeToInteractive: 300,
      },
      isr: {
        firstPaint: 100,
        firstContentfulPaint: 150,
        largestContentfulPaint: 300,
        firstInputDelay: 40,
        cumulativeLayoutShift: 0.03,
        timeToInteractive: 450,
      },
      csr: {
        firstPaint: 200,
        firstContentfulPaint: 800,
        largestContentfulPaint: 1200,
        firstInputDelay: 100,
        cumulativeLayoutShift: 0.15,
        timeToInteractive: 1500,
      },
    };

    return baseMetrics[mode as keyof typeof baseMetrics] || baseMetrics.ssr;
  };

  const startMonitoring = () => {
    setIsMonitoring(true);
    setRequests([]);
    setMetrics(null);

    const mode = renderingModes.find(m => m.id === selectedMode);
    if (mode) {
      setCurrentUrl(mode.url);

      // 模拟逐步加载请求
      const newRequests = simulateNetworkRequests(selectedMode);

      newRequests.forEach((request, index) => {
        setTimeout(() => {
          setRequests(prev => [...prev, request]);
        }, index * 100);
      });

      // 设置性能指标
      setTimeout(
        () => {
          setMetrics(simulateMetrics(selectedMode));
          setIsMonitoring(false);
        },
        newRequests.length * 100 + 500
      );
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatTime = (ms: number) => {
    return `${ms.toFixed(0)}ms`;
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600';
    if (status >= 300 && status < 400) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      document: 'bg-blue-100 text-blue-800',
      stylesheet: 'bg-purple-100 text-purple-800',
      script: 'bg-orange-100 text-orange-800',
      fetch: 'bg-green-100 text-green-800',
      image: 'bg-pink-100 text-pink-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* 渲染模式选择 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {renderingModes.map(mode => (
          <div key={mode.id} className="space-y-2">
            <button
              onClick={() => setSelectedMode(mode.id)}
              className={`w-full p-3 text-left border rounded-lg transition-all ${
                selectedMode === mode.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="text-blue-600">{mode.icon}</div>
                <div className="font-medium text-sm">{mode.name}</div>
              </div>
              <div className="text-xs text-gray-500">{mode.description}</div>
            </button>

            <Link
              href={mode.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-3 py-2 bg-gray-600 text-white rounded text-center hover:bg-gray-700 inline-flex items-center justify-center space-x-1 text-sm transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              <span>访问页面</span>
            </Link>
          </div>
        ))}
      </div>

      {/* 控制面板 */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Activity className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">网络监控</h3>
            {isMonitoring && (
              <div className="flex items-center space-x-2 text-sm text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                <span>监控中...</span>
              </div>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={startMonitoring}
              disabled={isMonitoring}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isMonitoring ? '监控中...' : '开始监控'}
            </button>

            <Link
              href={renderingModes.find(m => m.id === selectedMode)?.url || '/'}
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 inline-flex items-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>访问演示页面</span>
            </Link>
          </div>
        </div>

        {currentUrl && (
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            当前页面:{' '}
            <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{currentUrl}</code>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 网络请求瀑布图 */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h4 className="font-semibold mb-4 flex items-center">
            <Globe className="h-4 w-4 mr-2" />
            网络请求瀑布图
          </h4>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {requests.length === 0 && !isMonitoring && (
              <div className="text-center text-gray-500 py-8">
                点击&quot;开始监控&quot;来查看网络请求
              </div>
            )}

            {requests.map(request => (
              <div
                key={request.id}
                className="border border-gray-200 dark:border-gray-600 rounded p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 text-xs rounded font-medium ${getTypeColor(request.type)}`}
                    >
                      {request.type}
                    </span>
                    <span className={`text-sm font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                    <span className="text-xs text-gray-500">{request.method}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatTime(request.time)} • {formatBytes(request.size)}
                  </div>
                </div>

                <div className="text-sm text-gray-700 dark:text-gray-300 mb-2 truncate">
                  {request.url}
                </div>

                {/* 时序图 */}
                <div className="flex space-x-1 h-3 rounded overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <div
                    className="bg-blue-400"
                    style={{ width: `${(request.timing.dns / request.timing.total) * 100}%` }}
                    title={`DNS: ${formatTime(request.timing.dns)}`}
                  ></div>
                  <div
                    className="bg-green-400"
                    style={{ width: `${(request.timing.connect / request.timing.total) * 100}%` }}
                    title={`Connect: ${formatTime(request.timing.connect)}`}
                  ></div>
                  <div
                    className="bg-yellow-400"
                    style={{ width: `${(request.timing.request / request.timing.total) * 100}%` }}
                    title={`Request: ${formatTime(request.timing.request)}`}
                  ></div>
                  <div
                    className="bg-red-400"
                    style={{ width: `${(request.timing.response / request.timing.total) * 100}%` }}
                    title={`Response: ${formatTime(request.timing.response)}`}
                  ></div>
                </div>

                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>DNS</span>
                  <span>Connect</span>
                  <span>Request</span>
                  <span>Response</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 性能指标 */}
        <div className="space-y-4">
          {/* Core Web Vitals */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold mb-4 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Core Web Vitals
            </h4>

            {metrics ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">First Contentful Paint (FCP)</span>
                  <span
                    className={`font-mono text-sm ${metrics.firstContentfulPaint < 1800 ? 'text-green-600' : 'text-orange-600'}`}
                  >
                    {formatTime(metrics.firstContentfulPaint)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Largest Contentful Paint (LCP)</span>
                  <span
                    className={`font-mono text-sm ${metrics.largestContentfulPaint < 2500 ? 'text-green-600' : 'text-orange-600'}`}
                  >
                    {formatTime(metrics.largestContentfulPaint)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">First Input Delay (FID)</span>
                  <span
                    className={`font-mono text-sm ${metrics.firstInputDelay < 100 ? 'text-green-600' : 'text-orange-600'}`}
                  >
                    {formatTime(metrics.firstInputDelay)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Cumulative Layout Shift (CLS)</span>
                  <span
                    className={`font-mono text-sm ${metrics.cumulativeLayoutShift < 0.1 ? 'text-green-600' : 'text-orange-600'}`}
                  >
                    {metrics.cumulativeLayoutShift.toFixed(3)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Time to Interactive (TTI)</span>
                  <span
                    className={`font-mono text-sm ${metrics.timeToInteractive < 3800 ? 'text-green-600' : 'text-orange-600'}`}
                  >
                    {formatTime(metrics.timeToInteractive)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">运行监控以查看性能指标</div>
            )}
          </div>

          {/* 请求统计 */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold mb-4 flex items-center">
              <Download className="h-4 w-4 mr-2" />
              请求统计
            </h4>

            {requests.length > 0 ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">总请求数</span>
                  <span className="font-mono text-sm">{requests.length}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">总传输大小</span>
                  <span className="font-mono text-sm">
                    {formatBytes(requests.reduce((sum, req) => sum + req.size, 0))}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">总加载时间</span>
                  <span className="font-mono text-sm">
                    {formatTime(
                      Math.max(...requests.map(req => req.endTime)) -
                        Math.min(...requests.map(req => req.startTime))
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">平均响应时间</span>
                  <span className="font-mono text-sm">
                    {formatTime(requests.reduce((sum, req) => sum + req.time, 0) / requests.length)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">暂无请求数据</div>
            )}
          </div>

          {/* 优化建议 */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold mb-4 flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              优化建议
            </h4>

            <div className="space-y-2 text-sm">
              {selectedMode === 'ssr' && (
                <>
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-600">•</span>
                    <span>考虑使用缓存减少服务器响应时间</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-600">•</span>
                    <span>优化数据库查询以提高 SSR 性能</span>
                  </div>
                </>
              )}

              {selectedMode === 'ssg' && (
                <>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-600">•</span>
                    <span>性能表现优秀，继续保持</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-600">•</span>
                    <span>考虑使用 ISR 处理动态内容</span>
                  </div>
                </>
              )}

              {selectedMode === 'csr' && (
                <>
                  <div className="flex items-start space-x-2">
                    <span className="text-orange-600">•</span>
                    <span>考虑代码分割减少初始包大小</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-orange-600">•</span>
                    <span>使用 SSR 或 SSG 改善 SEO</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
