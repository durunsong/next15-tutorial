'use client';

import { useEffect } from 'react';

interface TawkToWidgetProps {
  /** Tawk.to 的 Widget ID */
  widgetId?: string;
  /** Tawk.to 的 API Key */
  apiKey?: string;
  /** 是否在开发环境中启用 */
  enableInDev?: boolean;
  /** 延迟加载时间（毫秒），默认3000ms */
  delayMs?: number;
  /** 自定义配置选项 */
  customSettings?: {
    /** 聊天窗口的位置 */
    position?: 'bottom-right' | 'bottom-left';
    /** 聊天窗口的颜色主题 */
    theme?: string;
    /** 是否显示预聊天表单 */
    showPreChatForm?: boolean;
    /** 是否显示离线表单 */
    showOfflineForm?: boolean;
  };
}

/**
 * Tawk.to 客服组件
 *
 * 特性：
 * - 延迟加载：等待页面加载完成后延迟指定时间再加载客服组件
 * - 智能检测：自动检测页面加载状态，避免重复加载
 * - 环境控制：开发环境可选择性启用
 *
 * 使用方式：
 * 1. 基本使用：<TawkToWidget />
 * 2. 自定义延迟：<TawkToWidget delayMs={5000} />
 * 3. 自定义配置：<TawkToWidget widgetId="your-widget-id" apiKey="your-api-key" />
 * 4. 带自定义设置：<TawkToWidget customSettings={{ position: 'bottom-left', theme: '#your-color' }} />
 * 5. 开发环境启用：<TawkToWidget enableInDev={true} />
 */
export default function TawkToWidget({
  widgetId = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID || '',
  apiKey = process.env.NEXT_PUBLIC_TAWK_API_KEY || '',
  enableInDev = false,
  delayMs = 3000,
  customSettings,
}: TawkToWidgetProps = {}) {
  useEffect(() => {
    // 在开发环境中根据配置决定是否加载
    if (process.env.NODE_ENV === 'development' && !enableInDev) {
      console.log('TawkTo: 开发环境中已禁用，如需启用请设置 enableInDev=true');
      return;
    }

    // 检查是否已经加载过 Tawk.to 脚本
    if (typeof window !== 'undefined' && window.Tawk_API) {
      console.log('TawkTo: 脚本已加载');
      return;
    }

    // 延迟加载客服组件
    const loadTawkTo = () => {
      console.log(`TawkTo: 开始加载客服组件`);

      // 初始化 Tawk_API 和 Tawk_LoadStart
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();

      // 应用自定义设置
      if (customSettings) {
        const tawkAPI = window.Tawk_API;

        if (customSettings.position) {
          tawkAPI.customStyle = tawkAPI.customStyle || {};
          tawkAPI.customStyle.position = customSettings.position;
        }

        if (customSettings.theme) {
          tawkAPI.customStyle = tawkAPI.customStyle || {};
          tawkAPI.customStyle.theme = customSettings.theme;
        }

        if (typeof customSettings.showPreChatForm === 'boolean') {
          tawkAPI.showWidget = customSettings.showPreChatForm;
        }

        if (typeof customSettings.showOfflineForm === 'boolean') {
          tawkAPI.showOfflineForm = customSettings.showOfflineForm;
        }
      }

      // 创建并插入脚本标签
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://embed.tawk.to/${widgetId}/${apiKey}`;
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');

      // 添加错误处理
      script.onerror = () => {
        console.error('TawkTo: 脚本加载失败');
      };

      script.onload = () => {
        console.log('TawkTo: 脚本加载成功');
      };

      // 插入到文档中
      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      } else {
        document.head.appendChild(script);
      }
    };

    // 等待页面加载完成，然后延迟指定时间加载客服
    const loadWithDelay = () => {
      console.log(`TawkTo: 页面加载完成，将在 ${delayMs}ms 后加载客服组件`);
      return setTimeout(loadTawkTo, delayMs);
    };

    // 监听页面加载状态
    let timeoutId: NodeJS.Timeout;

    if (document.readyState === 'complete') {
      // 页面已经加载完成
      timeoutId = loadWithDelay();
    } else {
      // 等待页面加载完成
      const handleLoad = () => {
        timeoutId = loadWithDelay();
        window.removeEventListener('load', handleLoad);
      };
      window.addEventListener('load', handleLoad);

      // 备用方案：DOMContentLoaded
      const handleDOMContentLoaded = () => {
        timeoutId = loadWithDelay();
        document.removeEventListener('DOMContentLoaded', handleDOMContentLoaded);
      };
      document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
    }

    // 清理函数 - 组件卸载时移除脚本和清理定时器
    return () => {
      // 清理定时器
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // 移除事件监听器
      window.removeEventListener('load', loadWithDelay);
      document.removeEventListener('DOMContentLoaded', loadWithDelay);

      // 移除脚本
      const tawkScript = document.querySelector(`script[src*="embed.tawk.to"]`);
      if (tawkScript) {
        tawkScript.remove();
      }

      // 清理全局变量
      if (typeof window !== 'undefined') {
        delete window.Tawk_API;
        delete window.Tawk_LoadStart;
      }
    };
  }, [widgetId, apiKey, enableInDev, delayMs, customSettings]);

  // 这个组件不渲染任何UI元素
  return null;
}

// Tawk.to API 类型定义
interface TawkAPI {
  customStyle?: {
    position?: string;
    theme?: string;
  };
  showWidget?: boolean;
  showOfflineForm?: boolean;
  [key: string]: unknown;
}

// 扩展 Window 接口以支持 TypeScript
declare global {
  interface Window {
    Tawk_API?: TawkAPI;
    Tawk_LoadStart?: Date;
  }
}
