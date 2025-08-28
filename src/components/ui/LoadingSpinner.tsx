/**
 * 加载动画组件
 * 提供统一的加载状态展示
 */

'use client';

import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

/**
 * 加载动画组件
 * 提供统一的加载状态展示
 */

interface LoadingSpinnerProps {
  size?: 'small' | 'default' | 'large';
  tip?: string;
  spinning?: boolean;
  children?: React.ReactNode;
  className?: string;
  delay?: number;
}

export function LoadingSpinner({
  size = 'default',
  tip,
  spinning = true,
  children,
  className = '',
  delay = 0,
}: LoadingSpinnerProps) {
  const antIcon = (
    <LoadingOutlined
      style={{ fontSize: size === 'large' ? 24 : size === 'small' ? 14 : 18 }}
      spin
    />
  );

  if (children) {
    return (
      <Spin
        indicator={antIcon}
        spinning={spinning}
        tip={tip}
        size={size}
        className={className}
        delay={delay}
      >
        {children}
      </Spin>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Spin indicator={antIcon} spinning={spinning} tip={tip} size={size} delay={delay} />
    </div>
  );
}

/**
 * 页面级加载组件
 */
export function PageLoading({ tip = '加载中...' }: { tip?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <LoadingSpinner size="large" tip={tip} className="text-gray-600 dark:text-gray-400" />
    </div>
  );
}

/**
 * 内容区域加载组件
 */
export function ContentLoading({
  tip = '加载中...',
  height = '200px',
}: {
  tip?: string;
  height?: string;
}) {
  return (
    <div className="flex items-center justify-center" style={{ height }}>
      <LoadingSpinner tip={tip} className="text-gray-600 dark:text-gray-400" />
    </div>
  );
}

/**
 * 按钮加载状态
 */
export function ButtonLoading({ size = 'small' }: { size?: 'small' | 'default' }) {
  return <LoadingSpinner size={size} />;
}
