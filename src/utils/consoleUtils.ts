/**
 * 控制台工具函数
 * 在生产环境中优雅地处理控制台输出
 */

// 开发环境标识
const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * 开发环境专用日志
 * 生产环境自动移除
 */
export const devLog = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log('[DEV]', ...args);
    }
  },

  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn('[DEV WARN]', ...args);
    }
  },

  error: (...args: any[]) => {
    // 错误信息在生产环境也保留，但格式化
    if (isDevelopment) {
      console.error('[DEV ERROR]', ...args);
    } else {
      console.error('错误:', args[0]?.message || args[0]);
    }
  },

  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info('[DEV INFO]', ...args);
    }
  },

  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug('[DEV DEBUG]', ...args);
    }
  },
};

/**
 * 性能监控日志
 * 用于记录性能相关信息
 */
export const perfLog = {
  time: (label: string) => {
    if (isDevelopment) {
      console.time(`[PERF] ${label}`);
    }
  },

  timeEnd: (label: string) => {
    if (isDevelopment) {
      console.timeEnd(`[PERF] ${label}`);
    }
  },

  mark: (name: string) => {
    if (isDevelopment && performance.mark) {
      performance.mark(name);
    }
  },

  measure: (name: string, startMark: string, endMark: string) => {
    if (isDevelopment && performance.measure) {
      try {
        performance.measure(name, startMark, endMark);
        const entries = performance.getEntriesByName(name);
        if (entries.length > 0 && entries[0] && entries[0].duration !== undefined) {
          console.log(`[PERF] ${name}:`, `${entries[0].duration.toFixed(2)}ms`);
        }
      } catch (error) {
        console.warn('[PERF] 测量失败:', error);
      }
    }
  },
};

/**
 * 用户行为追踪日志
 * 用于分析用户使用模式
 */
export const trackLog = {
  click: (element: string, metadata?: any) => {
    if (isDevelopment) {
      console.log('[TRACK] 点击:', element, metadata);
    }
    // 生产环境可以发送到分析服务
  },

  pageView: (path: string, metadata?: any) => {
    if (isDevelopment) {
      console.log('[TRACK] 页面访问:', path, metadata);
    }
    // 生产环境可以发送到分析服务
  },

  error: (error: Error, context?: string) => {
    if (isDevelopment) {
      console.error('[TRACK] 错误追踪:', context, error);
    } else {
      // 生产环境发送错误报告
      console.error('应用错误:', error.message);
    }
  },
};

/**
 * API 请求日志
 * 用于调试网络请求
 */
export const apiLog = {
  request: (method: string, url: string, data?: any) => {
    if (isDevelopment) {
      console.group(`[API] ${method.toUpperCase()} ${url}`);
      if (data) {
        console.log('请求数据:', data);
      }
      console.groupEnd();
    }
  },

  response: (method: string, url: string, response: any, duration?: number) => {
    if (isDevelopment) {
      console.group(`[API] ${method.toUpperCase()} ${url} 响应`);
      console.log('响应数据:', response);
      if (duration) {
        console.log('耗时:', `${duration}ms`);
      }
      console.groupEnd();
    }
  },

  error: (method: string, url: string, error: any) => {
    if (isDevelopment) {
      console.error(`[API] ${method.toUpperCase()} ${url} 失败:`, error);
    } else {
      console.error('网络请求失败:', url);
    }
  },
};

/**
 * 组件生命周期日志
 * 用于调试React组件
 */
export const componentLog = {
  mount: (componentName: string) => {
    if (isDevelopment) {
      console.log(`[COMPONENT] ${componentName} 挂载`);
    }
  },

  unmount: (componentName: string) => {
    if (isDevelopment) {
      console.log(`[COMPONENT] ${componentName} 卸载`);
    }
  },

  update: (componentName: string, props?: any) => {
    if (isDevelopment) {
      console.log(`[COMPONENT] ${componentName} 更新`, props);
    }
  },

  effect: (componentName: string, dependencies?: any[]) => {
    if (isDevelopment) {
      console.log(`[COMPONENT] ${componentName} useEffect`, dependencies);
    }
  },
};

/**
 * 使用示例：
 *
 * // 替换 console.log
 * devLog.log('这是开发环境日志');
 *
 * // 性能监控
 * perfLog.time('数据加载');
 * // ... 异步操作
 * perfLog.timeEnd('数据加载');
 *
 * // API 请求追踪
 * apiLog.request('GET', '/api/users');
 * apiLog.response('GET', '/api/users', data, 150);
 *
 * // 错误追踪
 * trackLog.error(new Error('用户操作错误'), 'UserProfile组件');
 */
