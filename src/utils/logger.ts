/**
 * 日志工具模块
 * 提供结构化日志记录功能
 */

// 日志级别枚举
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

// 日志条目接口
interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  userId?: string;
  requestId?: string;
  metadata?: Record<string, any>;
  error?: Error;
}

// 日志配置接口
interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableFile: boolean;
  enableRemote: boolean;
  context?: string;
}

/**
 * 结构化日志记录器
 */
export class Logger {
  private config: LoggerConfig;
  private static instance: Logger;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: LogLevel.INFO,
      enableConsole: true,
      enableFile: false,
      enableRemote: false,
      ...config,
    };
  }

  /**
   * 获取单例实例
   */
  public static getInstance(config?: Partial<LoggerConfig>): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(config);
    }
    return Logger.instance;
  }

  /**
   * 创建日志条目
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: string,
    metadata?: Record<string, any>,
    error?: Error
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: context || this.config.context,
      metadata,
      error,
    };
  }

  /**
   * 判断是否应该记录此级别的日志
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    const currentLevelIndex = levels.indexOf(this.config.level);
    const requestedLevelIndex = levels.indexOf(level);
    return requestedLevelIndex >= currentLevelIndex;
  }

  /**
   * 格式化日志消息用于控制台输出
   */
  private formatForConsole(entry: LogEntry): string {
    const { level, message, timestamp, context, metadata, error } = entry;

    // 根据级别选择颜色
    const colors = {
      [LogLevel.DEBUG]: '\x1b[36m', // 青色
      [LogLevel.INFO]: '\x1b[32m', // 绿色
      [LogLevel.WARN]: '\x1b[33m', // 黄色
      [LogLevel.ERROR]: '\x1b[31m', // 红色
    };

    const reset = '\x1b[0m';
    const color = colors[level] || '';

    let formatted = `${color}[${timestamp}] ${level.toUpperCase()}${reset}`;

    if (context) {
      formatted += ` [${context}]`;
    }

    formatted += `: ${message}`;

    if (metadata && Object.keys(metadata).length > 0) {
      formatted += `\n  metadata: ${JSON.stringify(metadata, null, 2)}`;
    }

    if (error) {
      formatted += `\n  error: ${error.message}`;
      if (error.stack) {
        formatted += `\n  stack: ${error.stack}`;
      }
    }

    return formatted;
  }

  /**
   * 输出日志
   */
  private output(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) {
      return;
    }

    // 控制台输出
    if (this.config.enableConsole) {
      const formatted = this.formatForConsole(entry);

      switch (entry.level) {
        case LogLevel.DEBUG:
          console.debug(formatted);
          break;
        case LogLevel.INFO:
          console.info(formatted);
          break;
        case LogLevel.WARN:
          console.warn(formatted);
          break;
        case LogLevel.ERROR:
          console.error(formatted);
          break;
      }
    }

    // 文件输出（Node.js 环境）
    if (this.config.enableFile && typeof window === 'undefined') {
      this.writeToFile(entry);
    }

    // 远程日志服务输出
    if (this.config.enableRemote) {
      this.sendToRemote(entry);
    }
  }

  /**
   * 写入文件（服务端）
   */
  private async writeToFile(entry: LogEntry): Promise<void> {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');

      const logDir = path.join(process.cwd(), 'logs');
      const logFile = path.join(logDir, `app-${new Date().toISOString().split('T')[0]}.log`);

      // 确保日志目录存在
      try {
        await fs.mkdir(logDir, { recursive: true });
      } catch (_error) {
        // 目录已存在或其他错误，忽略
      }

      const logLine = JSON.stringify(entry) + '\n';
      await fs.appendFile(logFile, logLine);
    } catch (error) {
      console.error('Failed to write log to file:', error);
    }
  }

  /**
   * 发送到远程日志服务
   */
  private async sendToRemote(entry: LogEntry): Promise<void> {
    try {
      // 这里可以集成第三方日志服务，如 Logtail, Datadog, etc.
      const response = await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });

      if (!response.ok) {
        console.error('Failed to send log to remote service:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to send log to remote service:', error);
    }
  }

  /**
   * 调试日志
   */
  public debug(message: string, context?: string, metadata?: Record<string, any>): void {
    const entry = this.createLogEntry(LogLevel.DEBUG, message, context, metadata);
    this.output(entry);
  }

  /**
   * 信息日志
   */
  public info(message: string, context?: string, metadata?: Record<string, any>): void {
    const entry = this.createLogEntry(LogLevel.INFO, message, context, metadata);
    this.output(entry);
  }

  /**
   * 警告日志
   */
  public warn(message: string, context?: string, metadata?: Record<string, any>): void {
    const entry = this.createLogEntry(LogLevel.WARN, message, context, metadata);
    this.output(entry);
  }

  /**
   * 错误日志
   */
  public error(
    message: string,
    error?: Error,
    context?: string,
    metadata?: Record<string, any>
  ): void {
    const entry = this.createLogEntry(LogLevel.ERROR, message, context, metadata, error);
    this.output(entry);
  }

  /**
   * 创建子日志器（带上下文）
   */
  public child(context: string): Logger {
    return new Logger({
      ...this.config,
      context,
    });
  }

  /**
   * 更新配置
   */
  public updateConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

/**
 * 请求日志中间件用的日志器
 */
export class RequestLogger extends Logger {
  constructor(requestId: string, _userId?: string) {
    super({
      level: LogLevel.INFO,
      enableConsole: true,
      enableFile: process.env.NODE_ENV === 'production',
      enableRemote: process.env.NODE_ENV === 'production',
      context: `req:${requestId}`,
    });
  }

  /**
   * 记录请求开始
   */
  public logRequest(method: string, path: string, userAgent?: string): void {
    this.info('Request started', undefined, {
      method,
      path,
      userAgent,
    });
  }

  /**
   * 记录请求结束
   */
  public logResponse(statusCode: number, duration: number): void {
    const level = statusCode >= 400 ? LogLevel.WARN : LogLevel.INFO;
    const message = 'Request completed';
    const metadata = { statusCode, duration };

    // 直接创建条目而不使用私有方法
    const entry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: this.config.context,
      metadata,
    };

    // 直接输出而不使用私有方法
    if (this.config.enableConsole) {
      console.log(`[${entry.timestamp}] ${level.toUpperCase()}: ${message}`, metadata);
    }
  }
}

/**
 * 性能日志器
 */
export class PerformanceLogger extends Logger {
  private timers = new Map<string, number>();

  constructor() {
    super({
      level: LogLevel.DEBUG,
      enableConsole: process.env.NODE_ENV === 'development',
      context: 'performance',
    });
  }

  /**
   * 开始计时
   */
  public startTimer(name: string): void {
    this.timers.set(name, Date.now());
    this.debug(`Timer started: ${name}`);
  }

  /**
   * 结束计时并记录
   */
  public endTimer(name: string): number {
    const startTime = this.timers.get(name);
    if (!startTime) {
      this.warn(`Timer not found: ${name}`);
      return 0;
    }

    const duration = Date.now() - startTime;
    this.timers.delete(name);

    this.info(`Timer completed: ${name}`, undefined, { duration });

    return duration;
  }

  /**
   * 记录函数执行时间
   */
  public timeFunction<T>(name: string, fn: () => T): T {
    this.startTimer(name);
    try {
      const result = fn();
      this.endTimer(name);
      return result;
    } catch (error) {
      this.endTimer(name);
      this.error(`Function ${name} failed`, error as Error);
      throw error;
    }
  }

  /**
   * 记录异步函数执行时间
   */
  public async timeAsyncFunction<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.startTimer(name);
    try {
      const result = await fn();
      this.endTimer(name);
      return result;
    } catch (error) {
      this.endTimer(name);
      this.error(`Async function ${name} failed`, error as Error);
      throw error;
    }
  }
}

// 默认日志器实例
export const logger = Logger.getInstance({
  level: process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO,
  enableConsole: true,
  enableFile: process.env.NODE_ENV === 'production',
  enableRemote: process.env.NODE_ENV === 'production',
});

// 性能日志器实例
export const performanceLogger = new PerformanceLogger();
