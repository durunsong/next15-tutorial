'use client';

import { Alert, Spin } from 'antd';

import { useEffect, useState } from 'react';

import dynamic from 'next/dynamic';

// 懒加载的G6图表组件
interface LazyG6Props {
  data: any;
  style?: React.CSSProperties;
  className?: string;
  config?: any;
}

// 动态加载G6组件
const DynamicG6 = dynamic(() => import('./G6Component'), {
  ssr: false,
  loading: () => (
    <div className="h-96 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="text-center">
        <Spin size="large" />
        <p className="mt-4 text-gray-600 dark:text-gray-300">正在加载图表组件...</p>
      </div>
    </div>
  ),
});

export default function LazyG6Component({ data, style, className }: LazyG6Props) {
  const [isG6Ready, setIsG6Ready] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    // 动态加载G6库
    const loadG6 = async () => {
      try {
        if (typeof window !== 'undefined') {
          // 检查G6是否已经加载
          if (!window.G6) {
            // 动态加载G6
            await new Promise((resolve, reject) => {
              const script = document.createElement('script');
              script.src = 'https://gw.alipayobjects.com/os/lib/antv/g6/4.8.24/dist/g6.min.js';
              script.onload = () => resolve(true);
              script.onerror = () => {
                reject(new Error('G6 库加载失败'));
              };
              document.head.appendChild(script);
            });
          }
          setIsG6Ready(true);
        }
      } catch (error) {
        // 记录最小错误信息，避免生产环境噪声
        setLoadError('图表库加载失败，请检查网络连接');
      }
    };

    loadG6();
  }, []);

  if (loadError) {
    return (
      <div className={className} style={style}>
        <Alert
          message="图表加载失败"
          description={loadError}
          type="error"
          showIcon
          action={
            <button
              onClick={() => {
                setLoadError(null);
                window.location.reload();
              }}
              className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
            >
              重试
            </button>
          }
        />
      </div>
    );
  }

  if (!isG6Ready) {
    return (
      <div
        className={`h-96 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg ${className}`}
        style={style}
      >
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600 dark:text-gray-300">正在初始化图表...</p>
        </div>
      </div>
    );
  }

  return <DynamicG6 data={data} style={style} className={className} />;
}

/**
 * 使用说明：
 *
 * 这个组件提供了G6图表的懒加载功能：
 * 1. 按需加载G6库，减少初始包大小
 * 2. 提供加载状态和错误处理
 * 3. 支持服务端渲染
 * 4. 自动处理脚本加载和初始化
 *
 * 使用示例：
 * <LazyG6Component
 *   data={yourGraphData}
 *   style={{ height: '500px' }}
 *   className="my-graph"
 * />
 */
