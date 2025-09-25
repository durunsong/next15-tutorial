import type { Metadata } from 'next';

import { generateDynamicMetadata } from '@/lib/metadata';

export const metadata: Metadata = {
  ...generateDynamicMetadata('用户列表', '浏览所有注册用户，查看用户活动和发布的内容', {
    type: 'users-list',
  }),
  keywords: [
    '用户列表',
    '用户目录',
    '社区成员',
    '用户搜索',
    '作者列表',
    '博客用户',
    '社区',
    '成员',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
  },
};
