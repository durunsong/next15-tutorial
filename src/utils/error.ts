/**
 * 错误处理工具函数
 */
import { message } from 'antd';

// 错误类型枚举
export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTH = 'AUTH',
  VALIDATION = 'VALIDATION',
  PERMISSION = 'PERMISSION',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

// 自定义错误类
export class AppError extends Error {
  public type: ErrorType;
  public code?: string | number;
  public details?: any;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    code?: string | number,
    details?: any
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.code = code;
    this.details = details;
  }
}

/**
 * 根据HTTP状态码获取错误类型
 */
export function getErrorTypeFromStatus(status: number): ErrorType {
  switch (status) {
    case 401:
      return ErrorType.AUTH;
    case 403:
      return ErrorType.PERMISSION;
    case 400:
    case 422:
      return ErrorType.VALIDATION;
    case 500:
    case 502:
    case 503:
    case 504:
      return ErrorType.SERVER;
    default:
      return ErrorType.UNKNOWN;
  }
}

/**
 * 获取用户友好的错误信息
 */
export function getFriendlyErrorMessage(error: Error | AppError | string): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof AppError) {
    switch (error.type) {
      case ErrorType.NETWORK:
        return '网络连接失败，请检查网络设置';
      case ErrorType.AUTH:
        return '登录已过期，请重新登录';
      case ErrorType.PERMISSION:
        return '您没有权限执行此操作';
      case ErrorType.VALIDATION:
        return error.message || '输入信息有误，请检查后重试';
      case ErrorType.SERVER:
        return '服务器暂时无法响应，请稍后重试';
      default:
        return error.message || '操作失败，请重试';
    }
  }

  // 处理常见的网络错误
  if (error.message.includes('fetch')) {
    return '网络请求失败，请检查网络连接';
  }

  if (error.message.includes('timeout')) {
    return '请求超时，请重试';
  }

  return error.message || '未知错误';
}

/**
 * 全局错误处理器
 */
export class ErrorHandler {
  private static instance: ErrorHandler;

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * 处理错误并显示用户友好的消息
   */
  handle(error: Error | AppError | string, showMessage = true): void {
    const friendlyMessage = getFriendlyErrorMessage(error);

    // 在控制台记录详细错误信息
    if (error instanceof Error) {
      console.error('Error occurred:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        ...(error instanceof AppError && {
          type: error.type,
          code: error.code,
          details: error.details,
        }),
      });
    } else {
      console.error('Error occurred:', error);
    }

    // 显示用户消息
    if (showMessage) {
      if (error instanceof AppError && error.type === ErrorType.AUTH) {
        message.error(friendlyMessage);
        // 可以在这里添加跳转到登录页的逻辑
      } else {
        message.error(friendlyMessage);
      }
    }

    // 在生产环境中发送错误报告
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error);
    }
  }

  /**
   * 处理 API 响应错误
   */
  handleApiError(response: Response, data?: any): AppError {
    const errorType = getErrorTypeFromStatus(response.status);
    const message = data?.error || data?.message || response.statusText || '请求失败';

    return new AppError(message, errorType, response.status, data);
  }

  /**
   * 报告错误到监控服务
   */
  private reportError(error: Error | AppError | string): void {
    // 这里可以集成错误监控服务
    // 例如：Sentry、LogRocket、Bugsnag 等
    try {
      const errorData = {
        message: typeof error === 'string' ? error : error.message,
        stack: error instanceof Error ? error.stack : undefined,
        type: error instanceof AppError ? error.type : ErrorType.UNKNOWN,
        code: error instanceof AppError ? error.code : undefined,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      };

      // 发送到监控服务
      console.log('Error reported:', errorData);

      // 示例：发送到外部服务
      // fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorData),
      // }).catch(console.error);
    } catch (reportError) {
      console.error('Failed to report error:', reportError);
    }
  }
}

// 导出全局错误处理器实例
export const errorHandler = ErrorHandler.getInstance();

/**
 * 异步函数错误包装器
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  showMessage = true
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      errorHandler.handle(error as Error, showMessage);
      throw error; // 重新抛出错误，让调用者决定如何处理
    }
  }) as T;
}

/**
 * Promise 错误处理装饰器
 */
export function handleAsyncError<T>(promise: Promise<T>, showMessage = true): Promise<T> {
  return promise.catch(error => {
    errorHandler.handle(error, showMessage);
    throw error;
  });
}
