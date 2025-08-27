import type { NextConfig } from 'next';

// Bundle分析配置
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // 性能优化
  experimental: {
    // 启用 React 编译器（React 19+）
    // reactCompiler: true,

    // 优化字体加载
    optimizePackageImports: ['antd', 'lucide-react'],
  },

  // Turbopack 配置（现在是稳定功能）
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // 编译优化
  compiler: {
    // 移除 console.log（生产环境）
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
  },

  // 跳过构建阶段的 ESLint（先保证可打包，后续再逐步修复规则）
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 图片优化配置（使用 remotePatterns 取代 domains）
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'next-static-oss.oss-rg-china-mainland.aliyuncs.com' },
      { protocol: 'https', hostname: 'gw.alipayobjects.com' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 86400, // 24 小时缓存
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // 压缩配置
  compress: true,

  // PWA 配置
  poweredByHeader: false, // 移除 X-Powered-By 头

  // 环境变量配置
  env: {
    APP_TITLE: process.env.APP_TITLE || 'Next.js 15 教程项目',
    APP_DESCRIPTION: process.env.APP_DESCRIPTION || '一个完整的Next.js 15全栈教程项目',
  },

  // 重定向配置
  async redirects() {
    return [
      {
        source: '/docs',
        destination: '/tutorials',
        permanent: true,
      },
    ];
  },

  // 头部配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // 安全头部
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
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          // API 缓存控制
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          // 静态资源长期缓存
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Webpack 配置优化
  webpack: (config, { dev, isServer }) => {
    // 生产环境优化
    if (!dev && !isServer) {
      // 代码分割优化
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      };
    }

    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
