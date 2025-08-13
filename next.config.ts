import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // experimental: {
  //   // 启用 React 18 的并发特性
  //   reactCompiler: true,
  // },
  // 图片优化配置
  images: {
    domains: [
      'localhost',
      'next-static-oss.oss-rg-china-mainland.aliyuncs.com', // 阿里云OSS域名
      'gw.alipayobjects.com', // 支付宝CDN域名
    ],
    formats: ['image/webp', 'image/avif'],
  },
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
};

export default nextConfig;
