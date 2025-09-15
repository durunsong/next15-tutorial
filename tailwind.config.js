/**
 * Tailwind CSS 配置文件
 *
 * 这个文件配置了项目的 Tailwind CSS 设置，包括：
 * - 内容扫描路径：告诉 Tailwind 在哪里查找类名以进行 CSS 优化
 * - 主题扩展：自定义颜色、字体、动画等设计系统
 * - 响应式断点：定义不同屏幕尺寸的断点
 * - 插件配置：添加自定义功能和工具类
 * - 性能优化：启用实验性特性以提高构建性能
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  // 内容扫描配置 - 告诉 Tailwind 在哪些文件中查找类名
  // 只有在这些文件中使用的类名才会被包含在最终的 CSS 中（Tree Shaking）
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}', // Pages 目录（如果使用 Pages Router）
    './src/components/**/*.{js,ts,jsx,tsx,mdx}', // 组件目录
    './src/app/**/*.{js,ts,jsx,tsx,mdx}', // App Router 目录（Next.js 13+）
    './src/hooks/**/*.{js,ts,jsx,tsx}', // 自定义 Hooks
    './src/utils/**/*.{js,ts,jsx,tsx}', // 工具函数
    './src/services/**/*.{js,ts,jsx,tsx}', // 服务层
  ],

  // 暗黑模式配置 - 使用 class 策略，通过添加 'dark' 类名来切换暗黑模式
  // 'class' 模式需要手动切换，'media' 模式会根据系统偏好自动切换
  darkMode: 'class', // 保留样式支持，但移除了动态切换功能

  // 未来特性配置 - 启用即将到来的 Tailwind CSS 优化特性
  future: {
    // 仅在支持 hover 的设备上应用 hover 样式（移动设备优化）
    // 避免移动设备上的 hover 状态粘滞问题
    hoverOnlyWhenSupported: true,
  },
  // 主题配置 - 扩展默认的 Tailwind 主题
  theme: {
    extend: {
      // 颜色系统配置
      colors: {
        // CSS 变量颜色 - 支持主题切换和动态颜色
        background: 'var(--background)', // 背景色变量
        foreground: 'var(--foreground)', // 前景色变量

        // 自定义主色调色板 - 提供从浅到深的 9 个层级
        // 通常 500 是主色，100-400 是浅色，600-900 是深色
        primary: {
          50: '#eff6ff', // 最浅色 - 用于背景高亮
          100: '#dbeafe', // 浅色 - 用于悬停背景
          200: '#bfdbfe', // 较浅色
          300: '#93c5fd', // 中浅色
          400: '#60a5fa', // 中色
          500: '#3b82f6', // 主色 - 品牌主色调
          600: '#2563eb', // 中深色 - 用于悬停状态
          700: '#1d4ed8', // 深色 - 用于激活状态
          800: '#1e40af', // 较深色
          900: '#1e3a8a', // 最深色 - 用于文本和边框
        },
      },
      // 字体家族配置 - 定义项目中使用的字体栈
      fontFamily: {
        // 无衬线字体 - 用于大部分界面文本
        // CSS 变量 + 系统字体后备方案，确保在所有设备上都有良好的显示效果
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        // 等宽字体 - 用于代码显示和需要对齐的文本
        mono: ['var(--font-mono)', 'monospace'],
      },

      // 自定义动画配置 - 定义可重用的动画效果
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out', // 淡入动画 - 用于内容加载
        'slide-up': 'slideUp 0.3s ease-out', // 上滑动画 - 用于模态框和通知
        'bounce-slow': 'bounce 3s infinite', // 慢速弹跳 - 用于加载指示器
      },

      // 关键帧定义 - 配合 animation 使用的具体动画步骤
      keyframes: {
        // 淡入动画关键帧
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        // 上滑动画关键帧 - 同时包含位移和透明度变化
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },

      // 响应式断点配置 - 扩展默认的屏幕尺寸断点
      screens: {
        xs: '475px', // 超小屏幕 - 大型手机
        '3xl': '1680px', // 超大屏幕 - 大型显示器和电视
      },
    },
  },
  // 插件配置 - 扩展 Tailwind 功能的自定义插件
  plugins: [
    // 自定义工具类插件 - 添加现代 CSS 文本换行属性
    function ({ addUtilities }) {
      addUtilities({
        // 平衡文本换行 - 优化标题和短段落的视觉平衡
        // 浏览器会尝试平衡每行的字符数，避免出现孤立的单词
        '.text-balance': {
          'text-wrap': 'balance',
        },
        // 优雅文本换行 - 优化长段落的可读性
        // 浏览器会避免在不合适的位置换行，提高阅读体验
        '.text-pretty': {
          'text-wrap': 'pretty',
        },
      });
    },
  ],

  // 实验性特性配置 - 启用性能优化和新功能
  experimental: {
    // 优化通用默认样式 - 减少 CSS 包大小，提高性能
    // 移除未使用的基础样式，只保留项目中实际需要的部分
    optimizeUniversalDefaults: true,
  },
};
