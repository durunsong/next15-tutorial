'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { PerformanceOptimizer, performanceCollector } from '@/utils/performance';

interface PerformanceContextType {
  metrics: Record<string, number>;
  suggestions: string[];
  refreshMetrics: () => void;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

interface PerformanceProviderProps {
  children: React.ReactNode;
  enableDevTools?: boolean;
}

/**
 * 性能监控提供者组件
 * 为应用提供性能监控和优化建议
 */
export function PerformanceProvider({
  children,
  enableDevTools = process.env.NODE_ENV === 'development',
}: PerformanceProviderProps) {
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastLogTime = useRef<number>(0);

  const refreshMetrics = useCallback(() => {
    const currentMetrics = performanceCollector.getMetrics();
    const currentSuggestions = PerformanceOptimizer.analyzeAndSuggest();

    setMetrics(currentMetrics);
    setSuggestions(currentSuggestions);
  }, []);

  // 稳定化上下文值
  const contextValue = useMemo(
    () => ({
      metrics,
      suggestions,
      refreshMetrics,
    }),
    [metrics, suggestions, refreshMetrics]
  );

  useEffect(() => {
    // 清理之前的定时器
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // 初始化获取指标
    refreshMetrics();

    // 定期更新指标（仅在开发环境，降低频率）
    if (enableDevTools) {
      intervalRef.current = setInterval(() => {
        refreshMetrics();
      }, 60000); // 改为60秒，进一步降低频率
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enableDevTools]); // 移除 refreshMetrics 依赖，避免循环

  // 在开发环境下显示性能建议（进一步减少频率）
  useEffect(() => {
    if (enableDevTools && suggestions.length > 0) {
      const now = Date.now();
      // 至少间隔 10 秒才输出一次日志
      if (now - lastLogTime.current > 10000) {
        lastLogTime.current = now;

        const timeoutId = setTimeout(() => {
          console.group('🚀 性能优化建议');
          suggestions.forEach(suggestion => console.log(suggestion));
          console.groupEnd();
        }, 3000); // 3秒防抖

        return () => clearTimeout(timeoutId);
      }
    }
  }, [suggestions, enableDevTools]);

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
      {enableDevTools && <PerformanceDevPanel />}
    </PerformanceContext.Provider>
  );
}

/**
 * 性能监控开发面板
 */
function PerformanceDevPanel() {
  const { metrics, suggestions } = usePerformance();
  const [isVisible, setIsVisible] = useState(false);

  // 键盘快捷键切换显示
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isVisible) {
    return (
      <div
        className="fixed bottom-4 right-4 bg-blue-500 text-white px-3 py-2 rounded-lg cursor-pointer text-sm z-50"
        onClick={() => setIsVisible(true)}
        title="点击查看性能面板 (Ctrl+Shift+P)"
      >
        📊 性能
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 max-w-md max-h-96 overflow-auto z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">性能监控</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      {/* 性能指标 */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">指标数据</h4>
        <div className="space-y-1 text-xs">
          {Object.entries(metrics).map(([name, value]) => (
            <div key={name} className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{name}:</span>
              <span className="font-mono text-gray-900 dark:text-white">{value.toFixed(2)}ms</span>
            </div>
          ))}
        </div>
      </div>

      {/* 优化建议 */}
      {suggestions.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">优化建议</h4>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="text-xs text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded"
              >
                {suggestion}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        提示: 使用 Ctrl+Shift+P 切换显示
      </div>
    </div>
  );
}

/**
 * 使用性能监控的 Hook
 */
export function usePerformance() {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance 必须在 PerformanceProvider 内部使用');
  }
  return context;
}

/**
 * 页面性能监控 Hook
 */
export function usePagePerformance(pageName: string) {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      performanceCollector.recordMetric(`page_time_${pageName}`, duration);
    };
  }, [pageName]);
}
