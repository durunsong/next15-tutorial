import type { Metadata } from 'next';

import { generateDynamicMetadata } from '@/lib/metadata';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // 在实际应用中，这里可以从API获取用户信息
  // 目前使用默认的动态metadata配置
  const dynamicConfig = generateDynamicMetadata(
    '用户详情',
    '查看用户的详细信息、发布的文章和活动记录',
    { id: params.id, type: 'user' }
  );

  return {
    title: dynamicConfig.title,
    description: dynamicConfig.description,
    keywords: dynamicConfig.keywords?.join(', '),
    robots: {
      index: false, // 用户页面一般不需要被索引
      follow: true,
    },
  };
}
