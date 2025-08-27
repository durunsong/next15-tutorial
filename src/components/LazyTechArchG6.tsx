'use client';

import { Alert, Spin } from 'antd';

import { useEffect, useState } from 'react';

import dynamic from 'next/dynamic';

// 懒加载的技术架构G6组件
interface LazyTechArchG6Props {
  data?: any;
  style?: React.CSSProperties;
  className?: string;
}

// 动态加载技术架构G6组件
const DynamicTechArchG6 = dynamic(() => import('./TechArchG6Component'), {
  ssr: false,
  loading: () => (
    <div className="h-96 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="text-center">
        <Spin size="large" />
        <p className="mt-4 text-gray-600 dark:text-gray-300">正在加载技术架构图...</p>
      </div>
    </div>
  ),
});

export default function LazyTechArchG6({ data, style, className }: LazyTechArchG6Props) {
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
              script.onload = () => {
                console.log('G6 库加载成功');
                resolve(true);
              };
              script.onerror = () => {
                reject(new Error('G6 库加载失败'));
              };
              document.head.appendChild(script);
            });
          }
          setIsG6Ready(true);
        }
      } catch (error) {
        console.error('G6 加载错误:', error);
        setLoadError('技术架构图库加载失败，请检查网络连接');
      }
    };

    loadG6();
  }, []);

  if (loadError) {
    return (
      <div className={className} style={style}>
        <Alert
          message="技术架构图加载失败"
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
          <p className="mt-4 text-gray-600 dark:text-gray-300">正在初始化技术架构图...</p>
        </div>
      </div>
    );
  }

  return <DynamicTechArchG6 data={data} style={style} className={className} />;
}

/**
 * 使用说明：
 *
 * 这个组件提供了技术架构G6图表的懒加载功能：
 * 1. 按需加载G6库，减少初始包大小
 * 2. 提供加载状态和错误处理
 * 3. 支持服务端渲染
 * 4. 自动处理脚本加载和初始化
 * 5. 专门针对技术架构图优化
 *
 * 使用示例：
 * <LazyTechArchG6
 *   data={techArchitectureData}
 *   style={{ height: '600px' }}
 *   className="tech-arch-graph"
 * />
 */
