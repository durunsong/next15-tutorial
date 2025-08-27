'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface AccessibilitySettings {
  // 视觉
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  darkMode: boolean;

  // 导航
  focusIndicators: boolean;
  skipLinks: boolean;
  keyboardNavigation: boolean;

  // 内容
  screenReaderOptimized: boolean;
  simplifiedUI: boolean;

  // 交互
  slowAnimations: boolean;
  clickDelay: number;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (updates: Partial<AccessibilitySettings>) => void;
  resetSettings: () => void;
  announceToScreenReader: (message: string) => void;
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  darkMode: false,
  focusIndicators: true,
  skipLinks: true,
  keyboardNavigation: true,
  screenReaderOptimized: false,
  simplifiedUI: false,
  slowAnimations: false,
  clickDelay: 0,
};

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

/**
 * 可访问性提供者组件
 * 管理全局可访问性设置和功能
 */
export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [announcer, setAnnouncer] = useState<HTMLDivElement | null>(null);

  // 初始化设置
  useEffect(() => {
    // 从本地存储加载设置
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.warn('无法解析可访问性设置:', error);
      }
    }

    // 检测系统偏好
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;

    setSettings(prev => ({
      ...prev,
      reducedMotion: prefersReducedMotion,
      darkMode: prefersDarkMode,
      highContrast: prefersHighContrast,
    }));

    // 创建屏幕阅读器公告元素
    const announcerElement = document.createElement('div');
    announcerElement.setAttribute('aria-live', 'polite');
    announcerElement.setAttribute('aria-atomic', 'true');
    announcerElement.style.position = 'absolute';
    announcerElement.style.left = '-10000px';
    announcerElement.style.width = '1px';
    announcerElement.style.height = '1px';
    announcerElement.style.overflow = 'hidden';
    document.body.appendChild(announcerElement);
    setAnnouncer(announcerElement);

    return () => {
      if (announcerElement.parentNode) {
        announcerElement.parentNode.removeChild(announcerElement);
      }
    };
  }, []);

  // 应用设置到DOM
  useEffect(() => {
    const root = document.documentElement;

    // 应用CSS类
    root.classList.toggle('high-contrast', settings.highContrast);
    root.classList.toggle('large-text', settings.largeText);
    root.classList.toggle('reduced-motion', settings.reducedMotion);
    root.classList.toggle('focus-indicators', settings.focusIndicators);
    root.classList.toggle('simplified-ui', settings.simplifiedUI);
    root.classList.toggle('slow-animations', settings.slowAnimations);

    // 应用CSS变量
    root.style.setProperty('--click-delay', `${settings.clickDelay}ms`);

    // 保存到本地存储
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  // 键盘导航设置
  useEffect(() => {
    if (settings.keyboardNavigation) {
      // 添加键盘导航支持
      const handleKeyDown = (e: KeyboardEvent) => {
        // 跳转到主内容 (Alt + S)
        if (e.altKey && e.key === 's') {
          e.preventDefault();
          const mainContent = document.querySelector('main');
          if (mainContent) {
            mainContent.focus();
            announceToScreenReader('跳转到主内容');
          }
        }

        // 跳转到导航 (Alt + N)
        if (e.altKey && e.key === 'n') {
          e.preventDefault();
          const navigation = document.querySelector('nav');
          if (navigation) {
            navigation.focus();
            announceToScreenReader('跳转到导航菜单');
          }
        }

        // 打开可访问性设置 (Alt + A)
        if (e.altKey && e.key === 'a') {
          e.preventDefault();
          announceToScreenReader('打开可访问性设置');
          // 这里可以打开可访问性设置面板
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [settings.keyboardNavigation]);

  const updateSettings = (updates: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('accessibility-settings');
  };

  const announceToScreenReader = (message: string) => {
    if (announcer) {
      announcer.textContent = '';
      setTimeout(() => {
        announcer.textContent = message;
      }, 100);
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        announceToScreenReader,
      }}
    >
      {/* 跳转链接 */}
      {settings.skipLinks && (
        <div className="skip-links">
          <a href="#main-content" className="skip-link">
            跳转到主内容
          </a>
          <a href="#navigation" className="skip-link">
            跳转到导航
          </a>
        </div>
      )}

      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}

/**
 * 可访问性设置面板组件
 */
export function AccessibilityPanel() {
  const { settings, updateSettings, resetSettings } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 可访问性按钮 */}
      <button
        className="accessibility-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="打开可访问性设置"
        aria-expanded={isOpen}
      >
        ♿
      </button>

      {/* 设置面板 */}
      {isOpen && (
        <div
          className="accessibility-panel"
          role="dialog"
          aria-labelledby="accessibility-title"
          aria-modal="true"
        >
          <div className="panel-content">
            <h2 id="accessibility-title">可访问性设置</h2>

            <div className="setting-group">
              <h3>视觉设置</h3>

              <label className="setting-item">
                <input
                  type="checkbox"
                  checked={settings.highContrast}
                  onChange={e => updateSettings({ highContrast: e.target.checked })}
                />
                高对比度模式
              </label>

              <label className="setting-item">
                <input
                  type="checkbox"
                  checked={settings.largeText}
                  onChange={e => updateSettings({ largeText: e.target.checked })}
                />
                大字体模式
              </label>

              <label className="setting-item">
                <input
                  type="checkbox"
                  checked={settings.reducedMotion}
                  onChange={e => updateSettings({ reducedMotion: e.target.checked })}
                />
                减少动画效果
              </label>
            </div>

            <div className="setting-group">
              <h3>导航设置</h3>

              <label className="setting-item">
                <input
                  type="checkbox"
                  checked={settings.focusIndicators}
                  onChange={e => updateSettings({ focusIndicators: e.target.checked })}
                />
                显示焦点指示器
              </label>

              <label className="setting-item">
                <input
                  type="checkbox"
                  checked={settings.keyboardNavigation}
                  onChange={e => updateSettings({ keyboardNavigation: e.target.checked })}
                />
                键盘导航支持
              </label>
            </div>

            <div className="setting-group">
              <h3>界面设置</h3>

              <label className="setting-item">
                <input
                  type="checkbox"
                  checked={settings.simplifiedUI}
                  onChange={e => updateSettings({ simplifiedUI: e.target.checked })}
                />
                简化界面模式
              </label>

              <label className="setting-item">
                <input
                  type="checkbox"
                  checked={settings.screenReaderOptimized}
                  onChange={e => updateSettings({ screenReaderOptimized: e.target.checked })}
                />
                屏幕阅读器优化
              </label>
            </div>

            <div className="panel-actions">
              <button onClick={resetSettings}>重置设置</button>
              <button onClick={() => setIsOpen(false)}>关闭</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * 使用说明：
 *
 * 这个组件提供了全面的可访问性支持：
 * 1. 视觉辅助功能（高对比度、大字体等）
 * 2. 键盘导航支持
 * 3. 屏幕阅读器优化
 * 4. 跳转链接
 * 5. 动画控制
 * 6. 设置持久化
 *
 * 使用示例：
 * <AccessibilityProvider>
 *   <App />
 *   <AccessibilityPanel />
 * </AccessibilityProvider>
 */
