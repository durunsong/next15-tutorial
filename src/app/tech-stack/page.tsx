'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Code, 
  Database, 
  Zap, 
  Cloud, 
  Palette, 
  Settings,
  CheckCircle,
  ExternalLink,
  Star
} from 'lucide-react';

interface TechStackItem {
  name: string;
  description: string;
  category: 'frontend' | 'backend' | 'database' | 'cloud' | 'tools';
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  tutorialLink?: string;
  officialLink: string;
  version: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  color: string;
}

const techStack: TechStackItem[] = [
  {
    name: 'Next.js 15',
    description: 'React 框架，支持 SSR、SSG 和全栈开发',
    category: 'frontend',
    icon: Code,
    features: ['App Router', 'Server Components', 'Streaming', 'API Routes'],
    tutorialLink: '/tutorials/nextjs-basics',
    officialLink: 'https://nextjs.org',
    version: '15.4.6',
    difficulty: 'intermediate',
    color: 'bg-black text-white'
  },
  {
    name: 'TypeScript',
    description: '为 JavaScript 添加静态类型系统',
    category: 'frontend',
    icon: Code,
    features: ['类型安全', '智能提示', '重构支持', '编译时检查'],
    tutorialLink: '/tutorials/typescript',
    officialLink: 'https://www.typescriptlang.org',
    version: '5.0+',
    difficulty: 'intermediate',
    color: 'bg-blue-600 text-white'
  },
  {
    name: 'Tailwind CSS',
    description: '实用优先的 CSS 框架',
    category: 'frontend',
    icon: Palette,
    features: ['原子化类', '响应式设计', '暗色模式', '自定义主题'],
    officialLink: 'https://tailwindcss.com',
    version: '4.0',
    difficulty: 'beginner',
    color: 'bg-cyan-600 text-white'
  },
  {
    name: 'Ant Design',
    description: '企业级 UI 设计语言和组件库',
    category: 'frontend',
    icon: Palette,
    features: ['丰富组件', '国际化', '主题定制', 'TypeScript 支持'],
    officialLink: 'https://ant.design',
    version: '5.13.3',
    difficulty: 'beginner',
    color: 'bg-blue-500 text-white'
  },
  {
    name: 'Prisma ORM',
    description: '现代化的 TypeScript ORM',
    category: 'database',
    icon: Database,
    features: ['类型安全', '自动迁移', 'Prisma Studio', '多数据库支持'],
    tutorialLink: '/tutorials/prisma',
    officialLink: 'https://www.prisma.io',
    version: '5.8.1',
    difficulty: 'intermediate',
    color: 'bg-indigo-600 text-white'
  },
  {
    name: 'Neon PostgreSQL',
    description: '无服务器 PostgreSQL 数据库',
    category: 'database',
    icon: Database,
    features: ['无服务器', '自动扩展', '分支功能', 'Edge 优化'],
    officialLink: 'https://neon.tech',
    version: 'Latest',
    difficulty: 'beginner',
    color: 'bg-green-600 text-white'
  },
  {
    name: 'Upstash Redis',
    description: '无服务器 Redis 缓存服务',
    category: 'backend',
    icon: Zap,
    features: ['HTTP API', 'Edge 支持', '持久化', '全球分布'],
    tutorialLink: '/tutorials/redis',
    officialLink: 'https://upstash.com',
    version: 'Latest',
    difficulty: 'intermediate',
    color: 'bg-red-600 text-white'
  },
  {
    name: '阿里云 OSS',
    description: '对象存储服务',
    category: 'cloud',
    icon: Cloud,
    features: ['文件存储', '图片处理', 'CDN 加速', '安全防护'],
    tutorialLink: '/tutorials/oss',
    officialLink: 'https://www.aliyun.com/product/oss',
    version: 'Latest',
    difficulty: 'intermediate',
    color: 'bg-orange-600 text-white'
  },
  {
    name: 'Zustand',
    description: '轻量级状态管理库',
    category: 'frontend',
    icon: Settings,
    features: ['简洁 API', '高性能', '中间件支持', 'TypeScript 友好'],
    tutorialLink: '/tutorials/zustand',
    officialLink: 'https://zustand-demo.pmnd.rs',
    version: '4.4.7',
    difficulty: 'beginner',
    color: 'bg-purple-600 text-white'
  },
  {
    name: 'Monaco Editor',
    description: 'VS Code 编辑器内核',
    category: 'tools',
    icon: Code,
    features: ['语法高亮', '智能提示', '多语言支持', '主题定制'],
    officialLink: 'https://microsoft.github.io/monaco-editor',
    version: '0.45.0',
    difficulty: 'advanced',
    color: 'bg-blue-700 text-white'
  },
  {
    name: 'Prism.js',
    description: '轻量级语法高亮库',
    category: 'tools',
    icon: Code,
    features: ['语法高亮', '插件系统', '自定义主题', '轻量级'],
    officialLink: 'https://prismjs.com',
    version: '1.29.0',
    difficulty: 'beginner',
    color: 'bg-gray-700 text-white'
  },
];

const categories = [
  { key: 'all', name: '全部', icon: Star },
  { key: 'frontend', name: '前端', icon: Code },
  { key: 'backend', name: '后端', icon: Zap },
  { key: 'database', name: '数据库', icon: Database },
  { key: 'cloud', name: '云服务', icon: Cloud },
  { key: 'tools', name: '工具', icon: Settings },
] as const;

const difficulties = [
  { key: 'all', name: '全部难度', color: 'gray' },
  { key: 'beginner', name: '初级', color: 'green' },
  { key: 'intermediate', name: '中级', color: 'yellow' },
  { key: 'advanced', name: '高级', color: 'red' },
] as const;

export default function TechStackPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const filteredTechStack = techStack.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || item.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getCategoryStats = () => {
    const stats = techStack.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return stats;
  };

  const stats = getCategoryStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 标题部分 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          技术栈
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {" "}全览
          </span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          探索构建现代 Web 应用所需的完整技术栈，包含前端、后端、数据库、云服务等各个方面的技术选型和最佳实践。
        </p>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-2xl font-bold text-blue-600">{techStack.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">总技术数</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.frontend || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">前端技术</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.backend || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">后端技术</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-2xl font-bold text-indigo-600">{stats.database || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">数据库</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-2xl font-bold text-orange-600">{(stats.cloud || 0) + (stats.tools || 0)}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">云服务&工具</div>
        </div>
      </div>

      {/* 过滤器 */}
      <div className="mb-8 space-y-4">
        {/* 分类过滤 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">按分类筛选</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <category.icon className="h-4 w-4" />
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 难度过滤 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">按难度筛选</h3>
          <div className="flex flex-wrap gap-2">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty.key}
                onClick={() => setSelectedDifficulty(difficulty.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedDifficulty === difficulty.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {difficulty.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 技术栈卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredTechStack.map((tech) => (
          <div
            key={tech.name}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* 卡片头部 */}
            <div className={`${tech.color} p-4`}>
              <div className="flex items-center space-x-3">
                <tech.icon className="h-8 w-8" />
                <div>
                  <h3 className="text-lg font-semibold">{tech.name}</h3>
                  <p className="text-sm opacity-90">v{tech.version}</p>
                </div>
              </div>
            </div>

            {/* 卡片内容 */}
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {tech.description}
              </p>

              {/* 难度标签 */}
              <div className="mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(tech.difficulty)}`}>
                  {tech.difficulty === 'beginner' && '初级'}
                  {tech.difficulty === 'intermediate' && '中级'}
                  {tech.difficulty === 'advanced' && '高级'}
                </span>
              </div>

              {/* 特性列表 */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">主要特性</h4>
                <ul className="space-y-1">
                  {tech.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle className="h-3 w-3 text-green-600 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 操作按钮 */}
              <div className="flex space-x-3">
                {tech.tutorialLink && (
                  <Link
                    href={tech.tutorialLink}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <span>查看教程</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                )}
                <a
                  href={tech.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${tech.tutorialLink ? 'flex-shrink-0' : 'flex-1'} flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
                >
                  <span>{tech.tutorialLink ? '官网' : '官方文档'}</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 学习路径建议 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          推荐学习路径
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">1</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">基础阶段</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              学习 Next.js、TypeScript 和 Tailwind CSS，建立前端开发基础
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-yellow-600">2</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">进阶阶段</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              掌握 Prisma ORM、Redis 缓存和数据库设计，构建后端能力
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">高级阶段</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              学习云服务集成、状态管理和性能优化，成为全栈开发者
            </p>
          </div>
        </div>
        <div className="text-center mt-8">
          <Link
            href="/tutorials/nextjs-basics"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            开始学习之旅
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
