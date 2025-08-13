/**
 * 统一的 API 客户端
 * 处理请求拦截、错误处理、认证等
 */

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface RequestConfig extends RequestInit {
  requireAuth?: boolean;
  timeout?: number;
}

/**
 * API 客户端类
 */
class ApiClient {
  private baseURL: string;
  private defaultTimeout: number = 10000;

  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
  }

  /**
   * 获取认证头
   */
  private getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * 获取存储的 Token
   */
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  /**
   * 统一的请求方法
   */
  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const { requireAuth = false, timeout = this.defaultTimeout, ...requestConfig } = config;

    // 构建完整 URL
    const url = `${this.baseURL}${endpoint}`;

    // 构建请求头
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...requestConfig.headers,
    };

    // 添加认证头
    if (requireAuth) {
      Object.assign(headers, this.getAuthHeaders());
    }

    // 创建 AbortController 处理超时
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...requestConfig,
        headers,
        signal: controller.signal,
        credentials: 'include', // 包含 cookies
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        // 处理特定的 HTTP 状态码
        switch (response.status) {
          case 401:
            this.handleUnauthorized();
            break;
          case 403:
            console.warn('权限不足');
            break;
          case 429:
            console.warn('请求过于频繁');
            break;
          default:
            break;
        }

        return {
          success: false,
          error: data.error || data.message || `HTTP ${response.status}`,
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            error: '请求超时',
          };
        }
        return {
          success: false,
          error: error.message || '网络错误',
        };
      }

      return {
        success: false,
        error: '未知错误',
      };
    }
  }

  /**
   * 处理未认证状态
   */
  private handleUnauthorized(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // 可以在这里添加全局状态管理的清理逻辑
      console.warn('登录已过期，请重新登录');

      // 重定向到登录页面（如果不在登录页面）
      if (!window.location.pathname.includes('/auth/login')) {
        window.location.href = `/auth/login?returnUrl=${encodeURIComponent(window.location.pathname)}`;
      }
    }
  }

  /**
   * GET 请求
   */
  async get<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST 请求
   */
  async post<T>(endpoint: string, data?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT 请求
   */
  async put<T>(endpoint: string, data?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE 请求
   */
  async delete<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * 文件上传
   */
  async upload<T>(
    endpoint: string,
    file: File,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    const headers: HeadersInit = {
      ...config.headers,
    };

    // 添加认证头但不设置 Content-Type（让浏览器自动设置以包含 boundary）
    if (config.requireAuth !== false) {
      Object.assign(headers, this.getAuthHeaders());
    }

    // 移除 Content-Type，让浏览器自动设置
    delete (headers as any)['Content-Type'];

    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      headers,
      body: formData,
    });
  }
}

// 创建默认实例
export const apiClient = new ApiClient('/api');

// 导出类型
export type { ApiResponse, RequestConfig };
