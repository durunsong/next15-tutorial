import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 实验性功能
  experimental: {
    // 优化包导入
    optimizePackageImports: ['antd', 'lucide-react'],
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

  // 基本的头部配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
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
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
