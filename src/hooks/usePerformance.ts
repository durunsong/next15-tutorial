'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  // Core Web Vitals
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte

  // 自定义指标
  loadTime?: number;
  renderTime?: number;
  interactionTime?: number;

  // 内存使用
  memoryUsage?: {
    used: number;
    total: number;
    percentage: number;
  };

  // 网络状态
  networkStatus?: {
    effectiveType: string;
    downlink: number;
    rtt: number;
  };
}

interface UsePerformanceOptions {
  enableWebVitals?: boolean;
  enableCustomMetrics?: boolean;
  enableMemoryMonitoring?: boolean;
  enableNetworkMonitoring?: boolean;
  reportInterval?: number; // 报告间隔（毫秒）
  onReport?: (metrics: PerformanceMetrics) => void;
}

/**
 * 性能监控 Hook
 * 提供 Web Vitals 和自定义性能指标的监控
 */
export function usePerformance(options: UsePerformanceOptions = {}) {
  const {
    enableWebVitals = true,
    enableCustomMetrics = true,
    enableMemoryMonitoring = true,
    enableNetworkMonitoring = true,
    reportInterval = 30000, // 30秒报告一次
    onReport,
  } = options;

  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isSupported, setIsSupported] = useState(false);
  const observerRef = useRef<PerformanceObserver | null>(null);
  const reportIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 检查浏览器支持
  useEffect(() => {
    const supported =
      typeof window !== 'undefined' && 'performance' in window && 'PerformanceObserver' in window;

    setIsSupported(supported);
  }, []);

  // 测量自定义指标
  const measureCustomMetrics = useCallback(() => {
    if (!enableCustomMetrics || typeof window === 'undefined') return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;
      const renderTime = navigation.domContentLoadedEventEnd - navigation.fetchStart;
      const ttfb = navigation.responseStart - navigation.requestStart;

      setMetrics(prev => ({
        ...prev,
        loadTime,
        renderTime,
        ttfb,
      }));
    }
  }, [enableCustomMetrics]);

  // 监控内存使用
  const measureMemoryUsage = useCallback(() => {
    if (!enableMemoryMonitoring || typeof window === 'undefined') return;

    const memory: { usedJSHeapSize: number; totalJSHeapSize: number } | undefined = (
      performance as unknown as { memory?: { usedJSHeapSize: number; totalJSHeapSize: number } }
    ).memory;
    if (memory) {
      const used = memory.usedJSHeapSize;
      const total = memory.totalJSHeapSize;
      const percentage = (used / total) * 100;

      setMetrics(prev => ({
        ...prev,
        memoryUsage: { used, total, percentage },
      }));
    }
  }, [enableMemoryMonitoring]);

  // 监控网络状态
  const measureNetworkStatus = useCallback(() => {
    if (!enableNetworkMonitoring || typeof window === 'undefined') return;

    const connection: { effectiveType: string; downlink: number; rtt: number } | undefined = (
      navigator as unknown as {
        connection?: { effectiveType: string; downlink: number; rtt: number };
      }
    ).connection;
    if (connection) {
      setMetrics(prev => ({
        ...prev,
        networkStatus: {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
        },
      }));
    }
  }, [enableNetworkMonitoring]);

  // Web Vitals 监控
  useEffect(() => {
    if (!enableWebVitals || !isSupported) return;

    const observer = new PerformanceObserver(list => {
      list.getEntries().forEach(entry => {
        switch (entry.entryType) {
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
            }
            break;

          case 'largest-contentful-paint':
            setMetrics(prev => ({ ...prev, lcp: entry.startTime }));
            break;

          case 'first-input':
            const firstInput = entry as unknown as { processingStart: number; startTime: number };
            const fid = firstInput.processingStart - firstInput.startTime;
            setMetrics(prev => ({ ...prev, fid }));
            break;

          case 'layout-shift':
            const ls = entry as unknown as { value: number; hadRecentInput?: boolean };
            if (!ls.hadRecentInput) {
              setMetrics(prev => ({
                ...prev,
                cls: (prev.cls || 0) + ls.value,
              }));
            }
            break;
        }
      });
    });

    // 观察各种性能指标
    try {
      observer.observe({
        entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'],
      });
      observerRef.current = observer;
    } catch (error) {
      console.warn('Performance Observer 初始化失败:', error);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enableWebVitals, isSupported]);

  // 定期收集指标
  useEffect(() => {
    if (!isSupported) return;

    const collectMetrics = () => {
      measureCustomMetrics();
      measureMemoryUsage();
      measureNetworkStatus();
    };

    // 立即收集一次
    collectMetrics();

    // 设置定期收集
    reportIntervalRef.current = setInterval(() => {
      collectMetrics();
      if (onReport) {
        onReport(metrics);
      }
    }, reportInterval);

    return () => {
      if (reportIntervalRef.current) {
        clearInterval(reportIntervalRef.current);
      }
    };
  }, [
    isSupported,
    measureCustomMetrics,
    measureMemoryUsage,
    measureNetworkStatus,
    onReport,
    reportInterval,
    metrics,
  ]);

  // 手动收集指标
  const collectMetrics = useCallback(() => {
    measureCustomMetrics();
    measureMemoryUsage();
    measureNetworkStatus();
  }, [measureCustomMetrics, measureMemoryUsage, measureNetworkStatus]);

  // 性能评分
  const getPerformanceScore = useCallback(() => {
    let score = 100;

    // Core Web Vitals 评分
    if (metrics.fcp && metrics.fcp > 3000) score -= 20;
    if (metrics.lcp && metrics.lcp > 4000) score -= 25;
    if (metrics.fid && metrics.fid > 300) score -= 15;
    if (metrics.cls && metrics.cls > 0.25) score -= 20;

    // 加载时间评分
    if (metrics.loadTime && metrics.loadTime > 5000) score -= 10;

    // 内存使用评分
    if (metrics.memoryUsage && metrics.memoryUsage.percentage > 80) score -= 10;

    return Math.max(0, score);
  }, [metrics]);

  return {
    metrics,
    isSupported,
    collectMetrics,
    getPerformanceScore: getPerformanceScore(),

    // 性能判断辅助函数
    isGoodPerformance: getPerformanceScore() >= 80,
    needsOptimization: getPerformanceScore() < 60,

    // Core Web Vitals 判断
    isGoodFCP: !metrics.fcp || metrics.fcp <= 1800,
    isGoodLCP: !metrics.lcp || metrics.lcp <= 2500,
    isGoodFID: !metrics.fid || metrics.fid <= 100,
    isGoodCLS: !metrics.cls || metrics.cls <= 0.1,
  };
}

/**
 * 使用说明：
 *
 * 这个Hook提供了全面的性能监控功能：
 * 1. Core Web Vitals 监控
 * 2. 自定义性能指标
 * 3. 内存使用监控
 * 4. 网络状态监控
 * 5. 性能评分和建议
 *
 * 使用示例：
 * const {
 *   metrics,
 *   getPerformanceScore,
 *   isGoodPerformance,
 *   collectMetrics
 * } = usePerformance({
 *   onReport: (metrics) => {
 *     // 发送性能数据到分析服务
 *     analytics.track('performance', metrics);
 *   }
 * });
 */
