/**
 * API 请求 Hook
 * 封装异步数据获取逻辑，提供加载状态管理
 */
import { useCallback, useEffect, useRef, useState } from 'react';

import type { ApiResponse } from '@/services';

// Hook 配置接口
export interface UseApiConfig {
  immediate?: boolean; // 是否立即执行
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

// Hook 返回状态
export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: () => Promise<ApiResponse<T>>;
  reset: () => void;
}

/**
 * 通用 API Hook
 */
export function useApi<T>(
  apiFunction: () => Promise<ApiResponse<T>>,
  config: UseApiConfig = {}
): UseApiState<T> {
  const { immediate = false, onSuccess, onError } = config;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 使用 ref 来避免闭包问题
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * 执行 API 请求
   */
  const execute = useCallback(async () => {
    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 创建新的 AbortController
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction();

      // 检查组件是否还在挂载状态
      if (!isMountedRef.current) {
        return result;
      }

      if (result.success) {
        setData(result.data || null);
        onSuccess?.(result.data);
      } else {
        setError(result.error || '请求失败');
        onError?.(result.error || '请求失败');
      }

      return result;
    } catch (err) {
      if (!isMountedRef.current) {
        return { success: false, error: '组件已卸载' };
      }

      const errorMessage = err instanceof Error ? err.message : '网络错误';
      setError(errorMessage);
      onError?.(errorMessage);

      return { success: false, error: errorMessage };
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [apiFunction, onSuccess, onError]);

  /**
   * 重置状态
   */
  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);

    // 取消正在进行的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // 立即执行（如果配置了）
  useEffect(() => {
    if (immediate) {
      execute();
    }

    // 清理函数
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [immediate, execute]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

/**
 * 分页数据 Hook
 */
export interface UsePaginatedApiConfig<T> extends UseApiConfig {
  initialPage?: number;
  pageSize?: number;
  transform?: (data: any) => { items: T[]; total: number };
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function usePaginatedApi<T>(
  apiFunction: (page: number, pageSize: number) => Promise<ApiResponse<any>>,
  config: UsePaginatedApiConfig<T> = {}
) {
  const { initialPage = 1, pageSize = 10, transform, ...apiConfig } = config;

  const [page, setPage] = useState(initialPage);
  const [paginatedData, setPaginatedData] = useState<PaginatedData<T>>({
    items: [],
    total: 0,
    page: initialPage,
    pageSize,
    totalPages: 0,
  });

  const fetchData = useCallback(() => apiFunction(page, pageSize), [apiFunction, page, pageSize]);

  const { loading, error, execute } = useApi(fetchData, {
    ...apiConfig,
    onSuccess: data => {
      const transformed = transform ? transform(data) : data;
      const totalPages = Math.ceil(transformed.total / pageSize);

      setPaginatedData({
        items: transformed.items,
        total: transformed.total,
        page,
        pageSize,
        totalPages,
      });

      apiConfig.onSuccess?.(data);
    },
  });

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const nextPage = useCallback(() => {
    if (page < paginatedData.totalPages) {
      setPage(page + 1);
    }
  }, [page, paginatedData.totalPages]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  // 当页码改变时重新执行
  useEffect(() => {
    execute();
  }, [page, execute]);

  return {
    data: paginatedData,
    loading,
    error,
    execute,
    goToPage,
    nextPage,
    prevPage,
  };
}
