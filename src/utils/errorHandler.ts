/**
 * 全局错误处理工具
 * 提供统一的错误处理和报告机制
 */
import { logger } from './logger';

// 错误类型枚举
export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  CONFLICT = 'CONFLICT_ERROR',
  RATE_LIMIT = 'RATE_LIMIT_ERROR',
  DATABASE = 'DATABASE_ERROR',
  EXTERNAL_API = 'EXTERNAL_API_ERROR',
  INTERNAL = 'INTERNAL_ERROR',
  NETWORK = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT_ERROR',
}

// 基础应用错误类
export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly context?: Record<string, any>;

  constructor(
    message: string,
    type: ErrorType = ErrorType.INTERNAL,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: Record<string, any>
  ) {
    super(message);

    this.name = this.constructor.name;
    this.type = type;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;

    // 确保堆栈跟踪正确
    Error.captureStackTrace(this, this.constructor);
  }
}

// 具体的错误类
export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, ErrorType.VALIDATION, 400, true, context);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = '身份验证失败', context?: Record<string, any>) {
    super(message, ErrorType.AUTHENTICATION, 401, true, context);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = '权限不足', context?: Record<string, any>) {
    super(message, ErrorType.AUTHORIZATION, 403, true, context);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = '资源未找到', context?: Record<string, any>) {
    super(message, ErrorType.NOT_FOUND, 404, true, context);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = '资源冲突', context?: Record<string, any>) {
    super(message, ErrorType.CONFLICT, 409, true, context);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = '请求过于频繁', context?: Record<string, any>) {
    super(message, ErrorType.RATE_LIMIT, 429, true, context);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = '数据库操作失败', context?: Record<string, any>) {
    super(message, ErrorType.DATABASE, 500, true, context);
  }
}

export class ExternalApiError extends AppError {
  constructor(message: string = '外部服务调用失败', context?: Record<string, any>) {
    super(message, ErrorType.EXTERNAL_API, 502, true, context);
  }
}

export class TimeoutError extends AppError {
  constructor(message: string = '请求超时', context?: Record<string, any>) {
    super(message, ErrorType.TIMEOUT, 408, true, context);
  }
}

// 错误详情接口
interface ErrorDetails {
  type: ErrorType;
  message: string;
  statusCode: number;
  timestamp: string;
  requestId?: string;
  userId?: string;
  stack?: string;
  context?: Record<string, any>;
}

// 错误处理器类
export class ErrorHandler {
  private static instance: ErrorHandler;

  private constructor() {
    this.setupGlobalHandlers();
  }

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * 设置全局错误处理器
   */
  private setupGlobalHandlers(): void {
    // Node.js 环境下的未捕获异常处理
    if (typeof window === 'undefined') {
      process.on('uncaughtException', (error: Error) => {
        logger.error('Uncaught Exception', error, 'global');
        // 在生产环境中，可能需要重启进程
        if (process.env.NODE_ENV === 'production') {
          process.exit(1);
        }
      });

      process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
        logger.error('Unhandled Rejection', reason, 'global', { promise });
        // 在生产环境中，可能需要重启进程
        if (process.env.NODE_ENV === 'production') {
          process.exit(1);
        }
      });
    } else {
      // 浏览器环境下的错误处理
      window.addEventListener('error', event => {
        this.handleClientError(event.error, 'window.error');
      });

      window.addEventListener('unhandledrejection', event => {
        this.handleClientError(event.reason, 'unhandledrejection');
      });
    }
  }

  /**
   * 处理客户端错误
   */
  private handleClientError(error: any, source: string): void {
    logger.error(`Client error from ${source}`, error, 'client');

    // 发送错误到服务器
    this.reportError(error, { source, userAgent: navigator.userAgent });
  }

  /**
   * 处理 API 错误
   */
  public handleApiError(error: unknown, requestId?: string, userId?: string): ErrorDetails {
    const timestamp = new Date().toISOString();

    if (error instanceof AppError) {
      const details: ErrorDetails = {
        type: error.type,
        message: error.message,
        statusCode: error.statusCode,
        timestamp,
        requestId,
        userId,
        context: error.context,
      };

      if (process.env.NODE_ENV === 'development') {
        details.stack = error.stack;
      }

      logger.error(error.message, error, 'api', {
        type: error.type,
        statusCode: error.statusCode,
        requestId,
        userId,
        context: error.context,
      });

      return details;
    }

    // 处理其他类型的错误
    if (error instanceof Error) {
      const details: ErrorDetails = {
        type: ErrorType.INTERNAL,
        message: process.env.NODE_ENV === 'development' ? error.message : '内部服务器错误',
        statusCode: 500,
        timestamp,
        requestId,
        userId,
      };

      if (process.env.NODE_ENV === 'development') {
        details.stack = error.stack;
      }

      logger.error('Unexpected error', error, 'api', {
        requestId,
        userId,
      });

      return details;
    }

    // 处理未知错误
    const details: ErrorDetails = {
      type: ErrorType.INTERNAL,
      message: '内部服务器错误',
      statusCode: 500,
      timestamp,
      requestId,
      userId,
    };

    logger.error('Unknown error', undefined, 'api', {
      error: String(error),
      requestId,
      userId,
    });

    return details;
  }

  /**
   * 包装异步函数以捕获错误
   */
  public wrapAsync<T extends any[], R>(fn: (...args: T) => Promise<R>): (...args: T) => Promise<R> {
    return async (...args: T): Promise<R> => {
      try {
        return await fn(...args);
      } catch (error) {
        logger.error('Async function error', error as Error, fn.name);
        throw error;
      }
    };
  }

  /**
   * 包装同步函数以捕获错误
   */
  public wrapSync<T extends any[], R>(fn: (...args: T) => R): (...args: T) => R {
    return (...args: T): R => {
      try {
        return fn(...args);
      } catch (error) {
        logger.error('Sync function error', error as Error, fn.name);
        throw error;
      }
    };
  }

  /**
   * 报告错误到外部服务
   */
  public async reportError(error: any, context?: Record<string, any>): Promise<void> {
    try {
      // 这里可以集成错误报告服务，如 Sentry, Bugsnag 等
      if (process.env.SENTRY_DSN) {
        // await Sentry.captureException(error, { contexts: { custom: context } });
      }

      // 或者发送到自定义错误收集端点
      if (typeof window !== 'undefined') {
        fetch('/api/errors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            error: {
              message: error?.message || String(error),
              stack: error?.stack,
              name: error?.name,
            },
            context,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
          }),
        }).catch(reportError => {
          logger.error('Failed to report error', reportError);
        });
      }
    } catch (reportError) {
      logger.error('Failed to report error', reportError as Error);
    }
  }

  /**
   * 创建错误响应
   */
  public createErrorResponse(error: unknown, requestId?: string, userId?: string): Response {
    const errorDetails = this.handleApiError(error, requestId, userId);

    return new Response(
      JSON.stringify({
        error: errorDetails,
        success: false,
      }),
      {
        status: errorDetails.statusCode,
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': requestId || '',
        },
      }
    );
  }
}

// 工具函数
export const errorHandler = ErrorHandler.getInstance();

/**
 * 安全地执行异步操作，返回 [error, result] 元组
 */
export async function safeAsync<T>(promise: Promise<T>): Promise<[Error | null, T | null]> {
  try {
    const result = await promise;
    return [null, result];
  } catch (error) {
    return [error as Error, null];
  }
}

/**
 * 安全地执行同步操作，返回 [error, result] 元组
 */
export function safeSync<T>(fn: () => T): [Error | null, T | null] {
  try {
    const result = fn();
    return [null, result];
  } catch (error) {
    return [error as Error, null];
  }
}

/**
 * 重试装饰器
 */
export function retry<T extends any[], R>(maxAttempts: number = 3, delay: number = 1000) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: T): Promise<R> {
      let lastError: Error;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          lastError = error as Error;

          if (attempt === maxAttempts) {
            logger.error(`Method ${propertyKey} failed after ${maxAttempts} attempts`, lastError);
            throw lastError;
          }

          logger.warn(
            `Method ${propertyKey} failed, attempt ${attempt}/${maxAttempts}`,
            undefined,
            {
              error: lastError.message,
              nextRetryIn: delay,
            }
          );

          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      throw lastError!;
    };

    return descriptor;
  };
}
