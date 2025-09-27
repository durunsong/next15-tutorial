/**
 * 错误边界组件
 * 捕获并处理 React 组件树中的错误，提供优雅的错误处理界面
 */

'use client';

import { BugOutlined, RedoOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Card, Collapse, Result } from 'antd';

import { Component, type ErrorInfo, type ReactNode } from 'react';

/**
 * 错误边界组件
 * 捕获并处理 React 组件树中的错误，提供优雅的错误处理界面
 */

/**
 * 错误边界组件
 * 捕获并处理 React 组件树中的错误，提供优雅的错误处理界面
 */

/**
 * 错误边界组件
 * 捕获并处理 React 组件树中的错误，提供优雅的错误处理界面
 */

/**
 * 错误边界组件
 * 捕获并处理 React 组件树中的错误，提供优雅的错误处理界面
 */

/**
 * 错误边界组件
 * 捕获并处理 React 组件树中的错误，提供优雅的错误处理界面
 */

/**
 * 错误边界组件
 * 捕获并处理 React 组件树中的错误，提供优雅的错误处理界面
 */

/**
 * 错误边界组件
 * 捕获并处理 React 组件树中的错误，提供优雅的错误处理界面
 */

/**
 * 错误边界组件
 * 捕获并处理 React 组件树中的错误，提供优雅的错误处理界面
 */

/**
 * 错误边界组件
 * 捕获并处理 React 组件树中的错误，提供优雅的错误处理界面
 */

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  showDetails: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, showDetails: false };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 记录错误信息
    this.setState({ error, errorInfo });

    // 在生产环境中，可以将错误发送到监控服务
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    } else {
      // 开发环境只在控制台记录，不显示弹窗
      // eslint-disable-next-line no-console
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  private logErrorToService(error: Error, errorInfo: ErrorInfo) {
    // 这里可以集成错误监控服务，如 Sentry、LogRocket 等
    // eslint-disable-next-line no-console
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
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      showDetails: false,
    });
  };

  private toggleDetails = () => {
    this.setState({ showDetails: !this.state.showDetails });
  };

  private handleReload = () => {
    window.location.reload();
  };

  override render() {
    if (this.state.hasError) {
      // 如果提供了自定义 fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认错误页面
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-4">
          <div className="max-w-2xl w-full">
            <Result
              status="error"
              title={
                <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  页面出现错误
                </span>
              }
              subTitle={
                <div className="space-y-2">
                  <p className="text-gray-600 dark:text-gray-300">
                    {process.env.NODE_ENV === 'development'
                      ? '开发环境检测到错误，请查看详细信息进行调试'
                      : '抱歉，页面加载时出现了问题。请尝试刷新页面。'}
                  </p>
                  {process.env.NODE_ENV === 'development' && this.state.error?.message && (
                    <Card
                      size="small"
                      className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                    >
                      <p className="text-red-800 dark:text-red-300 font-mono text-sm">
                        {this.state.error.message}
                      </p>
                    </Card>
                  )}
                </div>
              }
              extra={[
                <Button
                  key="retry"
                  type="primary"
                  icon={<RedoOutlined />}
                  onClick={this.handleRetry}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:from-blue-700 hover:to-purple-700"
                >
                  重试
                </Button>,
                <Button
                  key="reload"
                  icon={<ReloadOutlined />}
                  onClick={this.handleReload}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  刷新页面
                </Button>,
                ...(process.env.NODE_ENV === 'development' && this.state.error
                  ? [
                      <Button
                        key="details"
                        type="dashed"
                        icon={<BugOutlined />}
                        onClick={this.toggleDetails}
                        className="border-orange-300 text-orange-600 hover:bg-orange-50 dark:border-orange-600 dark:text-orange-400"
                      >
                        {this.state.showDetails ? '隐藏' : '查看'}调试信息
                      </Button>,
                    ]
                  : []),
              ]}
            />

            {/* 开发环境下的详细错误信息 - 优化显示 */}
            {process.env.NODE_ENV === 'development' &&
              this.state.showDetails &&
              this.state.error && (
                <div className="mt-6">
                  <Collapse
                    defaultActiveKey={['1']}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg"
                    items={[
                      {
                        key: '1',
                        label: (
                          <span className="text-red-700 dark:text-red-400 font-semibold">
                            🔍 错误堆栈信息
                          </span>
                        ),
                        children: (
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                                错误详情：
                              </h4>
                              <pre className="text-sm bg-gray-100 dark:bg-gray-700 p-3 rounded border-l-4 border-red-400 overflow-auto max-h-48 text-gray-800 dark:text-gray-200">
                                {this.state.error.stack}
                              </pre>
                            </div>
                            {this.state.errorInfo && (
                              <div>
                                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                                  组件堆栈：
                                </h4>
                                <pre className="text-sm bg-blue-50 dark:bg-blue-900/20 p-3 rounded border-l-4 border-blue-400 overflow-auto max-h-32 text-gray-800 dark:text-gray-200">
                                  {this.state.errorInfo.componentStack}
                                </pre>
                              </div>
                            )}
                          </div>
                        ),
                      },
                    ]}
                  />
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
