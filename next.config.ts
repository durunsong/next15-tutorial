import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 实验性功能
  experimental: {
    // 优化包导入
    optimizePackageImports: [
      'antd',
      'lucide-react',
      '@ant-design/icons',
      'framer-motion',
      'echarts',
      'zustand',
    ],
    // 启用 React 编译器优化（实验性）
    reactCompiler: true,
    // 优化 CSS 打包（实验性）
    optimizeCss: true,
  },

  // 编译优化
  compiler: {
    // 生产环境移除 console.log
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
    // 启用样式组件支持
    styledComponents: true,
  },

  // 产出目录配置
  distDir: '.next',

  // 开发模式优化
  devIndicators: {
    position: 'bottom-right',
  },

  // 跳过构建阶段的 ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 图片优化配置
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'next-static-oss.oss-rg-china-mainland.aliyuncs.com' },
      { protocol: 'https', hostname: 'gw.alipayobjects.com' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 86400,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // 图片尺寸配置
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 启用压缩
  compress: true,

  // 移除 X-Powered-By 头
  poweredByHeader: false,

  // 环境变量
  env: {
    APP_TITLE: process.env.APP_TITLE || 'Next.js 15 教程项目',
    APP_DESCRIPTION: process.env.APP_DESCRIPTION || '一个完整的Next.js 15全栈教程项目',
  },

  // 重定向配置
  async redirects() {
    return [];
  },

  // 安全头部配置 - 增强版
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // 内容安全策略
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.tawk.to *.antd.org cdn.jsdelivr.net unpkg.com",
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com cdn.jsdelivr.net *.antd.org *.tawk.to",
              "font-src 'self' fonts.gstatic.com *.tawk.to cdn.jsdelivr.net",
              "img-src 'self' data: blob: https: *.aliyuncs.com *.dicebear.com *.antd.org",
              "media-src 'self' blob:",
              "connect-src 'self' *.tawk.to wss://*.tawk.to *.upstash.io cdn.jsdelivr.net unpkg.com",
              "frame-src 'self' *.tawk.to",
              "worker-src 'self' blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              'upgrade-insecure-requests',
            ].join('; '),
          },
          // 基本安全头部
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // 严格传输安全
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          // 推荐策略
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // 权限策略
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=()',
              'geolocation=()',
              'payment=()',
              'usb=()',
              'magnetometer=()',
              'accelerometer=()',
              'gyroscope=()',
            ].join(', '),
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
      // 静态资源缓存策略
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
