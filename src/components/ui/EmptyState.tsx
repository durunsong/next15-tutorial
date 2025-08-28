/**
 * 空状态组件
 * 提供统一的空数据展示
 */

'use client';

import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Empty } from 'antd';

/**
 * 空状态组件
 * 提供统一的空数据展示
 */

interface EmptyStateProps {
  title?: string;
  description?: string;
  image?: React.ReactNode;
  actions?: Array<{
    key: string;
    label: string;
    type?: 'primary' | 'default';
    icon?: React.ReactNode;
    onClick?: () => void;
  }>;
  className?: string;
}

export function EmptyState({
  title = '暂无数据',
  description,
  image,
  actions,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <Empty
        image={image || Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div className="text-center">
            <div className="text-gray-900 dark:text-gray-100 font-medium mb-1">{title}</div>
            {description && (
              <div className="text-gray-500 dark:text-gray-400 text-sm">{description}</div>
            )}
          </div>
        }
      >
        {actions && actions.length > 0 && (
          <div className="flex gap-2 justify-center mt-4">
            {actions.map(action => (
              <Button
                key={action.key}
                type={action.type || 'default'}
                icon={action.icon}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </Empty>
    </div>
  );
}

/**
 * 常用的空状态预设
 */
export const EmptyStates = {
  NoData: (props: Partial<EmptyStateProps>) => (
    <EmptyState title="暂无数据" description="还没有相关数据，请稍后再试" {...props} />
  ),

  NoSearchResults: (props: Partial<EmptyStateProps>) => (
    <EmptyState
      title="无搜索结果"
      description="未找到符合条件的内容，请尝试其他关键词"
      {...props}
    />
  ),

  NetworkError: (props: Partial<EmptyStateProps> & { onRetry?: () => void }) => (
    <EmptyState
      title="网络错误"
      description="数据加载失败，请检查网络连接"
      actions={[
        {
          key: 'retry',
          label: '重试',
          type: 'primary',
          icon: <ReloadOutlined />,
          onClick: props.onRetry,
        },
      ]}
      {...props}
    />
  ),

  CreateFirst: (props: Partial<EmptyStateProps> & { onCreate?: () => void }) => (
    <EmptyState
      title="还没有内容"
      description="创建你的第一个项目开始使用"
      actions={[
        {
          key: 'create',
          label: '创建',
          type: 'primary',
          icon: <PlusOutlined />,
          onClick: props.onCreate,
        },
      ]}
      {...props}
    />
  ),

  AccessDenied: (props: Partial<EmptyStateProps>) => (
    <EmptyState title="无访问权限" description="您没有权限查看此内容" {...props} />
  ),
};
