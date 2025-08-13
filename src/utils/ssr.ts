/**
 * SSR 优化工具函数
 */
import { headers } from 'next/headers';

/**
 * 检查是否为服务器端渲染
 */
export function isServer(): boolean {
  return typeof window === 'undefined';
}

/**
 * 检查是否为客户端
 */
export function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * 安全地执行仅客户端代码
 */
export function runOnClient<T>(fn: () => T, fallback?: T): T | undefined {
  if (isClient()) {
    return fn();
  }
  return fallback;
}

/**
 * 安全地执行仅服务端代码
 */
export function runOnServer<T>(fn: () => T, fallback?: T): T | undefined {
  if (isServer()) {
    return fn();
  }
  return fallback;
}

/**
 * 获取用户代理信息（SSR 友好）
 */
export async function getUserAgent(): Promise<string | null> {
  if (isServer()) {
    try {
      const headersList = await headers();
      return headersList.get('user-agent');
    } catch {
      return null;
    }
  }
  return navigator?.userAgent || null;
}

/**
 * 检测移动设备（SSR 友好）
 */
export async function isMobileDevice(): Promise<boolean> {
  const userAgent = await getUserAgent();
  if (!userAgent) return false;

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

/**
 * 获取设备类型
 */
export async function getDeviceType(): Promise<'mobile' | 'tablet' | 'desktop'> {
  const userAgent = await getUserAgent();
  if (!userAgent) return 'desktop';

  if (/iPad/i.test(userAgent)) {
    return 'tablet';
  }

  if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    return 'mobile';
  }

  return 'desktop';
}

/**
 * 延迟执行（防止水合不匹配）
 */
export function delayedExecution<T>(fn: () => T, delay = 0): Promise<T> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(fn());
    }, delay);
  });
}

/**
 * 组件懒加载包装器
 * 注意：此函数应在客户端组件中使用，不适用于 SSR 工具文件
 */
export function createClientOnlyWrapper<P extends Record<string, any>>(
  _Component: any,
  _LoadingComponent?: any
) {
  return function ClientOnlyComponent(_props: P) {
    // 这个函数需要在 React 组件环境中使用
    throw new Error('withClientOnly should be used in React component context');
  };
}

/**
 * 预连接外部资源
 */
export function preconnectResources(urls: string[]): void {
  if (isClient()) {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = url;
      document.head.appendChild(link);
    });
  }
}

/**
 * 预加载关键资源
 */
export function preloadResource(href: string, as: string, crossorigin?: string): void {
  if (isClient()) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (crossorigin) {
      link.crossOrigin = crossorigin;
    }
    document.head.appendChild(link);
  }
}

/**
 * DNS 预取
 */
export function dnsPrefetch(urls: string[]): void {
  if (isClient()) {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = url;
      document.head.appendChild(link);
    });
  }
}

// React 相关的函数应该在组件文件中使用，这里只提供工具函数
