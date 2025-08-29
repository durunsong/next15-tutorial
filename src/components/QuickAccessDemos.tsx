'use client';

import { Activity, ExternalLink, Globe, Monitor, Server, Zap } from 'lucide-react';

import Link from 'next/link';

export function QuickAccessDemos() {
  const demoPages = [
    {
      id: 'ssr',
      name: 'SSR 演示',
      description: '服务端渲染演示页面',
      url: '/demo/ssr-page',
      icon: <Server className="h-5 w-5" />,
      color: 'blue',
      features: ['服务端数据获取', '快速首屏渲染', 'SEO 友好'],
    },
    {
      id: 'ssg',
      name: 'SSG 演示',
      description: '静态站点生成演示页面',
      url: '/demo/ssg-page',
      icon: <Globe className="h-5 w-5" />,
      color: 'green',
      features: ['最快加载速度', 'CDN 友好', '构建时生成'],
    },
    {
      id: 'isr',
      name: 'ISR 演示',
      description: '增量静态再生演示页面',
      url: '/demo/isr-page',
      icon: <Zap className="h-5 w-5" />,
      color: 'purple',
      features: ['静态性能', '自动更新', '数据新鲜度'],
    },
    {
      id: 'csr',
      name: 'CSR 演示',
      description: '客户端渲染演示页面',
      url: '/demo/csr-page',
      icon: <Monitor className="h-5 w-5" />,
      color: 'orange',
      features: ['动态交互', '实时数据', '用户状态'],
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-600 dark:text-blue-400',
        button: 'bg-blue-600 hover:bg-blue-700',
      },
      green: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-600 dark:text-green-400',
        button: 'bg-green-600 hover:bg-green-700',
      },
      purple: {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        border: 'border-purple-200 dark:border-purple-800',
        text: 'text-purple-600 dark:text-purple-400',
        button: 'bg-purple-600 hover:bg-purple-700',
      },
      orange: {
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        border: 'border-orange-200 dark:border-orange-800',
        text: 'text-orange-600 dark:text-orange-400',
        button: 'bg-orange-600 hover:bg-orange-700',
      },
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="my-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          🚀 快速访问演示页面
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          点击下方按钮直接访问不同渲染模式的演示页面，建议打开浏览器开发者工具的 Network
          面板观察加载过程
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {demoPages.map(demo => {
          const colorClasses = getColorClasses(demo.color);

          return (
            <div
              key={demo.id}
              className={`border rounded-lg p-4 ${colorClasses.bg} ${colorClasses.border}`}
            >
              <div className="flex items-center space-x-2 mb-3">
                <div className={colorClasses.text}>{demo.icon}</div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{demo.name}</h4>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{demo.description}</p>

              <div className="space-y-2 mb-4">
                {demo.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${colorClasses.text.replace('text-', 'bg-')}`}
                     />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href={demo.url}
                className={`w-full px-3 py-2 ${colorClasses.button} text-white rounded inline-flex items-center justify-center space-x-2 text-sm transition-colors`}
              >
                <ExternalLink className="h-4 w-4" />
                <span>访问演示</span>
              </Link>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Activity className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
              💡 网络监控小贴士
            </h4>
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              访问演示页面时，建议按{' '}
              <kbd className="px-1 py-0.5 bg-yellow-200 dark:bg-yellow-800 rounded text-xs">
                F12
              </kbd>{' '}
              打开开发者工具， 切换到 <strong>Network</strong>{' '}
              面板，然后刷新页面观察不同渲染模式的网络请求瀑布图和加载时序。 您会发现 SSG
              加载最快，CSR 有更多 API 请求，SSR 在服务器端完成渲染等不同特征。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
