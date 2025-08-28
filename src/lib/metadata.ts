import type { Metadata } from 'next';

/**
 * 网站基础信息配置
 */
export const SITE_CONFIG = {
  name: 'Next.js 教程平台',
  description: '现代化的 Next.js + Prisma + Neon 全栈开发教程平台',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://next15-tutorial.vercel.app',
  ogImage: '/og-image.png',
  creator: 'Next.js Tutorial Team',
  keywords: [
    'Next.js',
    'React',
    'TypeScript',
    'Prisma',
    'Neon',
    'Redis',
    'OSS',
    '全栈开发',
    '教程',
    '学习平台'
  ],
} as const;

/**
 * 页面类型枚举
 */
export enum PageType {
  HOME = 'home',
  AUTH = 'auth',
  TUTORIAL = 'tutorial',
  PROFILE = 'profile',
  USER = 'user',
  DEMO = 'demo',
  TECH = 'tech',
  SERVICE = 'service',
  DATABASE = 'database',
  OTHER = 'other'
}

/**
 * 页面metadata配置接口
 */
export interface PageMetadata {
  title: string;
  description: string;
  keywords?: readonly string[];
  type?: PageType;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  image?: string;
  noIndex?: boolean;
}

/**
 * 生成完整的metadata对象
 */
export function generateMetadata(config: PageMetadata): Metadata {
  const { 
    title, 
    description, 
    keywords = [], 
    type = PageType.OTHER,
    author,
    publishedTime,
    modifiedTime,
    section,
    image,
    noIndex = false
  } = config;

  // 构建完整标题
  const fullTitle = title.includes(SITE_CONFIG.name) 
    ? title 
    : `${title} | ${SITE_CONFIG.name}`;

  // 合并关键词
  const allKeywords = [
    ...SITE_CONFIG.keywords,
    ...keywords
  ] as string[];

  // 选择图片
  const ogImage = image || SITE_CONFIG.ogImage;
  const fullImageUrl = ogImage.startsWith('http') 
    ? ogImage 
    : `${SITE_CONFIG.url}${ogImage}`;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: allKeywords.join(', '),
    authors: author ? [{ name: author }] : [{ name: SITE_CONFIG.creator }],
    creator: SITE_CONFIG.creator,
    publisher: SITE_CONFIG.name,
    
    // 防止索引（如果指定）
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      }
    }),

    // Open Graph
    openGraph: {
      type: type === PageType.HOME ? 'website' : 'article',
      title: fullTitle,
      description,
      url: SITE_CONFIG.url,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
      locale: 'zh_CN',
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(section && { section }),
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullImageUrl],
      creator: '@nextjs_tutorial',
      site: '@nextjs_tutorial',
    },

    // 其他meta标签
    other: {
      'theme-color': '#0070f3',
      'color-scheme': 'light dark',
      'format-detection': 'telephone=no',
    },

    // 教程页面的额外meta标签
    ...(type === PageType.TUTORIAL && {
      other: {
        'theme-color': '#0070f3',
        'color-scheme': 'light dark',
        'format-detection': 'telephone=no',
        'article:author': author || SITE_CONFIG.creator,
        'article:section': section || '教程',
        ...(publishedTime && { 'article:published_time': publishedTime }),
        ...(modifiedTime && { 'article:modified_time': modifiedTime }),
      }
    }),
  };

  return metadata;
}

/**
 * 预定义的页面metadata配置
 */
export const PAGE_METADATA = {
  // 首页
  home: {
    title: 'Next.js 教程平台 - 现代化全栈开发学习中心',
    description: '专业的 Next.js + Prisma + Neon 全栈开发教程平台，提供从基础到进阶的完整学习路径，包含实战项目和最佳实践',
    keywords: ['Next.js教程', '全栈开发', '前端学习', 'React教程', 'TypeScript'],
    type: PageType.HOME,
  },

  // 关于页面
  about: {
    title: '关于我们',
    description: '了解 Next.js 教程平台的使命、愿景和团队信息，我们致力于为开发者提供最优质的学习资源',
    keywords: ['关于我们', '团队介绍', '平台介绍'],
    type: PageType.OTHER,
  },

  // 技术栈页面
  techStack: {
    title: '技术栈',
    description: '查看本平台使用的完整技术栈，包括前端、后端、数据库、部署等各个环节的技术选型和最佳实践',
    keywords: ['技术栈', 'Next.js', 'React', 'TypeScript', 'Prisma', 'Neon', 'Redis'],
    type: PageType.TECH,
  },

  // 用户相关
  profile: {
    title: '个人资料',
    description: '管理您的个人信息、头像、密码等账户设置',
    keywords: ['个人资料', '账户设置', '用户中心'],
    type: PageType.PROFILE,
    noIndex: true, // 个人页面不需要被搜索引擎索引
  },

  // 认证页面
  login: {
    title: '用户登录',
    description: '登录您的账户，开始学习 Next.js 全栈开发课程',
    keywords: ['登录', '用户登录', '账户登录'],
    type: PageType.AUTH,
    noIndex: true,
  },

  register: {
    title: '用户注册',
    description: '注册新账户，加入我们的 Next.js 学习社区',
    keywords: ['注册', '用户注册', '账户注册'],
    type: PageType.AUTH,
    noIndex: true,
  },

  // 客服页面
  customerService: {
    title: '在线客服',
    description: '遇到问题？联系我们的在线客服获得及时帮助和技术支持',
    keywords: ['客服', '在线客服', '技术支持', '帮助'],
    type: PageType.SERVICE,
  },

  // 数据库页面
  database: {
    title: '数据库管理',
    description: '数据库连接状态查看和基础管理功能',
    keywords: ['数据库', 'Prisma', 'Neon', '数据库管理'],
    type: PageType.DATABASE,
    noIndex: true,
  },

  // Redis测试页面
  redisTest: {
    title: 'Redis 连接测试',
    description: 'Redis 数据库连接测试和缓存功能验证',
    keywords: ['Redis', '缓存', '连接测试'],
    type: PageType.DATABASE,
    noIndex: true,
  },

  // 演示页面
  demo: {
    csr: {
      title: 'CSR 演示 - 客户端渲染',
      description: 'Next.js 客户端渲染(CSR)示例，展示动态数据加载和交互功能',
      keywords: ['CSR', '客户端渲染', 'Next.js渲染模式'],
      type: PageType.DEMO,
    },
    ssr: {
      title: 'SSR 演示 - 服务端渲染',
      description: 'Next.js 服务端渲染(SSR)示例，展示服务器端数据预取和SEO优化',
      keywords: ['SSR', '服务端渲染', 'Next.js渲染模式'],
      type: PageType.DEMO,
    },
    ssg: {
      title: 'SSG 演示 - 静态生成',
      description: 'Next.js 静态站点生成(SSG)示例，展示构建时预生成页面的性能优势',
      keywords: ['SSG', '静态生成', 'Next.js渲染模式'],
      type: PageType.DEMO,
    },
    isr: {
      title: 'ISR 演示 - 增量静态再生成',
      description: 'Next.js 增量静态再生成(ISR)示例，展示静态内容的动态更新机制',
      keywords: ['ISR', '增量静态再生成', 'Next.js渲染模式'],
      type: PageType.DEMO,
    },
  },

  // 教程页面
  tutorials: {
    jsx: {
      title: 'JSX 基础教程',
      description: '学习 JSX 语法基础，了解 React 组件的编写方式和最佳实践',
      keywords: ['JSX', 'React', '组件', '语法基础'],
      type: PageType.TUTORIAL,
      section: 'JSX基础',
    },
    nextjs: {
      title: 'Next.js 基础教程',
      description: '全面学习 Next.js 框架，从路由系统到渲染模式，掌握现代React开发',
      keywords: ['Next.js', 'React框架', '路由', '渲染模式'],
      type: PageType.TUTORIAL,
      section: 'Next.js基础',
    },
    typescript: {
      title: 'TypeScript 基础教程',
      description: '学习 TypeScript 类型系统，提高代码质量和开发效率',
      keywords: ['TypeScript', '类型系统', '静态类型', 'JavaScript'],
      type: PageType.TUTORIAL,
      section: 'TypeScript',
    },
    prisma: {
      title: 'Prisma ORM 教程',
      description: '学习使用 Prisma ORM 进行数据库操作，掌握现代数据库开发方式',
      keywords: ['Prisma', 'ORM', '数据库', 'PostgreSQL'],
      type: PageType.TUTORIAL,
      section: 'Prisma ORM',
    },
    redis: {
      title: 'Redis 缓存教程',
      description: '学习 Redis 缓存系统的使用，提高应用性能和用户体验',
      keywords: ['Redis', '缓存', '性能优化', 'Upstash'],
      type: PageType.TUTORIAL,
      section: 'Redis缓存',
    },
    oss: {
      title: '阿里云 OSS 文件存储教程',
      description: '学习阿里云对象存储服务的集成和使用，实现文件上传和管理功能',
      keywords: ['阿里云OSS', '文件存储', '文件上传', '对象存储'],
      type: PageType.TUTORIAL,
      section: '文件存储',
    },
    zustand: {
      title: 'Zustand 状态管理教程',
      description: '学习 Zustand 状态管理库，实现简洁高效的应用状态管理',
      keywords: ['Zustand', '状态管理', 'React状态', '状态库'],
      type: PageType.TUTORIAL,
      section: '状态管理',
    },
  },
} as const;

/**
 * 生成动态页面的metadata
 */
export function generateDynamicMetadata(
  baseTitle: string,
  baseDescription: string,
  dynamicData: { id?: string; name?: string; [key: string]: any }
): PageMetadata {
  const { id, name, ...rest } = dynamicData;
  
  return {
    title: name ? `${name} - ${baseTitle}` : `${baseTitle} #${id}`,
    description: name 
      ? `${baseDescription} - ${name}` 
      : `${baseDescription}，ID: ${id}`,
    keywords: [baseTitle.toLowerCase(), name || id].filter(Boolean) as string[],
    ...rest,
  };
}
