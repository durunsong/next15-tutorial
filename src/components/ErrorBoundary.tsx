/**
 * 错误边界组件
 * 捕获并处理 React 组件树中的错误
 */

'use client';

import { Button, Result } from 'antd';

import { Component, type ErrorInfo, type ReactNode } from 'react';

/**
 * 错误边界组件
 * 捕获并处理 React 组件树中的错误
 */

/**
 * 错误边界组件
 * 捕获并处理 React 组件树中的错误
 */

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 记录错误信息
    this.setState({ error, errorInfo });

    // 在生产环境中，可以将错误发送到监控服务
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    } else {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  private logErrorToService(error: Error, errorInfo: ErrorInfo) {
    // 这里可以集成错误监控服务，如 Sentry、LogRocket 等
    console.error('Production error logged:', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      errorInfo: {
        componentStack: errorInfo.componentStack,
      },
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // 如果提供了自定义 fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认错误页面
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="max-w-md w-full">
            <Result
              status="error"
              title="页面出现错误"
              subTitle={
                process.env.NODE_ENV === 'development'
                  ? this.state.error?.message
                  : '抱歉，页面加载时出现了问题。请尝试刷新页面。'
              }
              extra={[
                <Button key="retry" type="primary" onClick={this.handleRetry}>
                  重试
                </Button>,
                <Button key="reload" onClick={this.handleReload}>
                  刷新页面
                </Button>,
              ]}
            />

            {/* 开发环境下显示详细错误信息 */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-lg font-medium text-red-800 mb-2">详细错误信息：</h3>
                <pre className="text-sm text-red-700 whitespace-pre-wrap overflow-auto max-h-64">
                  {this.state.error.stack}
                </pre>
                {this.state.errorInfo && (
                  <>
                    <h4 className="text-md font-medium text-red-800 mt-4 mb-2">组件栈：</h4>
                    <pre className="text-sm text-red-700 whitespace-pre-wrap overflow-auto max-h-32">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
