/**
 * 性能监控工具集
 * 用于监控和优化应用性能
 */

// Web Vitals 类型定义
interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

/**
 * 性能指标收集器
 */
export class PerformanceCollector {
  private static instance: PerformanceCollector;
  private metrics: Map<string, number> = new Map();

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initWebVitals();
      this.initCustomMetrics();
    }
  }

  public static getInstance(): PerformanceCollector {
    if (!PerformanceCollector.instance) {
      PerformanceCollector.instance = new PerformanceCollector();
    }
    return PerformanceCollector.instance;
  }

  /**
   * 初始化 Web Vitals 监控
   */
  private async initWebVitals() {
    // 暂时禁用 Web Vitals，因为库未安装
    console.log('Web Vitals 监控功能暂时禁用，如需启用请安装 web-vitals 库');

    // 如果需要启用，请安装：pnpm add web-vitals
    // try {
    //   const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');
    //   getCLS(this.onWebVital.bind(this));
    //   getFID(this.onWebVital.bind(this));
    //   getFCP(this.onWebVital.bind(this));
    //   getLCP(this.onWebVital.bind(this));
    //   getTTFB(this.onWebVital.bind(this));
    // } catch (error) {
    //   console.warn('Web Vitals 初始化失败:', error);
    // }
  }

  /**
   * 初始化自定义指标监控
   */
  private initCustomMetrics() {
    // 监控页面加载时间
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      this.recordMetric('page_load_time', loadTime);
    });

    // 监控首次内容绘制
    const observer = new PerformanceObserver(list => {
      list.getEntries().forEach(entry => {
        if (entry.entryType === 'paint') {
          this.recordMetric(entry.name, entry.startTime);
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['paint'] });
    } catch (error) {
      console.warn('Performance Observer 不支持:', error);
    }
  }

  /**
   * Web Vitals 回调处理
   */
  private onWebVital(metric: WebVitalMetric) {
    this.recordMetric(metric.name, metric.value);

    // 发送到分析服务（如果启用）
    if (process.env['NEXT_PUBLIC_ENABLE_ANALYTICS'] === 'true') {
      this.sendToAnalytics(metric);
    }
  }

  /**
   * 记录性能指标
   */
  public recordMetric(name: string, value: number) {
    this.metrics.set(name, value);

    // 在开发环境下输出到控制台
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 性能指标 - ${name}: ${value.toFixed(2)}ms`);
    }
  }

  /**
   * 测量函数执行时间
   */
  public measureFunction<T>(name: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();

    this.recordMetric(`function_${name}`, end - start);
    return result;
  }

  /**
   * 测量异步函数执行时间
   */
  public async measureAsyncFunction<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();

    this.recordMetric(`async_function_${name}`, end - start);
    return result;
  }

  /**
   * 获取所有指标
   */
  public getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  /**
   * 发送指标到分析服务
   */
  private sendToAnalytics(metric: WebVitalMetric) {
    // 这里可以发送到 Google Analytics, Vercel Analytics 等
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(metric.value),
        metric_rating: metric.rating,
      });
    }
  }

  /**
   * 生成性能报告
   */
  public generateReport(): string {
    const metrics = this.getMetrics();
    const report = Object.entries(metrics)
      .map(([name, value]) => `${name}: ${value.toFixed(2)}ms`)
      .join('\n');

    return `🚀 性能报告\n${report}`;
  }
}

/**
 * 页面性能监控器
 */
export class PagePerformanceMonitor {
  private startTime: number = 0;
  private pageName: string;

  constructor(pageName: string) {
    this.pageName = pageName;
    this.start();
  }

  private start() {
    this.startTime = performance.now();
  }

  public end() {
    const endTime = performance.now();
    const duration = endTime - this.startTime;

    PerformanceCollector.getInstance().recordMetric(`page_render_${this.pageName}`, duration);
  }
}

/**
 * 资源加载监控
 */
export class ResourceMonitor {
  public static monitorLargeResources() {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver(list => {
      list.getEntries().forEach(entry => {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;

          // 监控大文件加载
          if (resourceEntry.transferSize > 100 * 1024) {
            // 大于 100KB
            console.warn(
              `🐌 大文件检测: ${resourceEntry.name} (${Math.round(resourceEntry.transferSize / 1024)}KB)`
            );
          }

          // 监控慢请求
          if (resourceEntry.duration > 1000) {
            // 大于 1 秒
            console.warn(
              `⏱️ 慢请求检测: ${resourceEntry.name} (${Math.round(resourceEntry.duration)}ms)`
            );
          }
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['resource'] });
    } catch (error) {
      console.warn('Resource monitoring 不支持:', error);
    }
  }
}

/**
 * 内存使用监控
 */
export class MemoryMonitor {
  public static checkMemoryUsage() {
    if (typeof window === 'undefined' || !('memory' in performance)) {
      return null;
    }

    const memInfo = (performance as any).memory;
    const usedMB = Math.round(memInfo.usedJSHeapSize / 1048576);
    const totalMB = Math.round(memInfo.totalJSHeapSize / 1048576);
    const limitMB = Math.round(memInfo.jsHeapSizeLimit / 1048576);

    const usage = {
      used: usedMB,
      total: totalMB,
      limit: limitMB,
      usagePercentage: Math.round((usedMB / limitMB) * 100),
    };

    // 内存使用过高警告
    if (usage.usagePercentage > 80) {
      console.warn(`🧠 内存使用过高: ${usage.usagePercentage}% (${usedMB}MB/${limitMB}MB)`);
    }

    return usage;
  }

  public static startMemoryMonitoring(interval: number = 30000) {
    setInterval(() => {
      this.checkMemoryUsage();
    }, interval);
  }
}

/**
 * 性能优化建议
 */
export class PerformanceOptimizer {
  public static analyzeAndSuggest() {
    const collector = PerformanceCollector.getInstance();
    const metrics = collector.getMetrics();
    const suggestions: string[] = [];

    // 分析 LCP (Largest Contentful Paint)
    if (metrics['LCP'] && metrics['LCP'] > 2500) {
      suggestions.push('📸 LCP 过高，建议优化图片加载和关键渲染路径');
    }

    // 分析 FID (First Input Delay)
    if (metrics['FID'] && metrics['FID'] > 100) {
      suggestions.push('⚡ FID 过高，建议优化 JavaScript 执行和减少主线程阻塞');
    }

    // 分析 CLS (Cumulative Layout Shift)
    if (metrics['CLS'] && metrics['CLS'] > 0.1) {
      suggestions.push('📐 CLS 过高，建议为图片和动态内容预留空间');
    }

    // 分析页面加载时间
    if (metrics['page_load_time'] && metrics['page_load_time'] > 3000) {
      suggestions.push('🚀 页面加载时间过长，建议启用代码分割和懒加载');
    }

    return suggestions;
  }
}

// 导出单例实例
export const performanceCollector = PerformanceCollector.getInstance();

// 自动启动监控（仅在浏览器环境）
if (typeof window !== 'undefined') {
  ResourceMonitor.monitorLargeResources();
  MemoryMonitor.startMemoryMonitoring();
}
