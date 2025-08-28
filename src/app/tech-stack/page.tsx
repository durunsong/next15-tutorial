'use client';

import {
  ArrowRight,
  CheckCircle,
  Cloud,
  Code,
  Database,
  ExternalLink,
  Palette,
  Settings,
  Star,
  Zap,
} from 'lucide-react';

import { useState } from 'react';

import Link from 'next/link';

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
    color: 'bg-black text-white',
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
    color: 'bg-blue-600 text-white',
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
    color: 'bg-cyan-600 text-white',
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
    color: 'bg-blue-500 text-white',
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
    color: 'bg-indigo-600 text-white',
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
    color: 'bg-green-600 text-white',
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
    color: 'bg-red-600 text-white',
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
    color: 'bg-orange-600 text-white',
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
    color: 'bg-purple-600 text-white',
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
    color: 'bg-blue-700 text-white',
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
    color: 'bg-gray-700 text-white',
  },
  // React 生态
  {
    name: 'React 19',
    description: '声明式 UI 库，构建用户界面的基石',
    category: 'frontend',
    icon: Code,
    features: ['组件化', 'Virtual DOM', 'Hooks', 'Server Components'],
    officialLink: 'https://react.dev',
    version: '19.0.0',
    difficulty: 'intermediate',
    color: 'bg-cyan-500 text-white',
  },
  {
    name: 'Framer Motion',
    description: 'React 动画库，轻松创建流畅动画',
    category: 'frontend',
    icon: Zap,
    features: ['手势控制', '拖拽支持', '布局动画', '页面转场'],
    officialLink: 'https://www.framer.com/motion',
    version: '10.16.16',
    difficulty: 'intermediate',
    color: 'bg-pink-600 text-white',
  },
  {
    name: 'Lucide React',
    description: '美观的开源图标库',
    category: 'frontend',
    icon: Star,
    features: ['一致设计', '轻量级', '可定制', 'TypeScript 支持'],
    officialLink: 'https://lucide.dev',
    version: '0.263.1',
    difficulty: 'beginner',
    color: 'bg-indigo-500 text-white',
  },
  // 后端和API
  {
    name: 'Node.js',
    description: 'JavaScript 运行时，构建服务端应用',
    category: 'backend',
    icon: Settings,
    features: ['事件驱动', '非阻塞I/O', 'NPM生态', '跨平台'],
    officialLink: 'https://nodejs.org',
    version: '20.x',
    difficulty: 'intermediate',
    color: 'bg-green-700 text-white',
  },
  {
    name: 'JWT',
    description: 'JSON Web Token，安全的用户认证方案',
    category: 'backend',
    icon: Settings,
    features: ['无状态认证', '跨域支持', '安全传输', '标准化'],
    officialLink: 'https://jwt.io',
    version: '9.0.2',
    difficulty: 'intermediate',
    color: 'bg-purple-700 text-white',
  },
  {
    name: 'bcryptjs',
    description: '密码哈希库，保护用户密码安全',
    category: 'backend',
    icon: Settings,
    features: ['密码加密', '盐值生成', '安全验证', '跨平台'],
    officialLink: 'https://github.com/dcodeIO/bcrypt.js',
    version: '2.4.3',
    difficulty: 'beginner',
    color: 'bg-red-700 text-white',
  },
  // 数据库和缓存
  {
    name: 'PostgreSQL',
    description: '强大的开源关系型数据库',
    category: 'database',
    icon: Database,
    features: ['ACID 事务', 'JSON 支持', '扩展性', '复杂查询'],
    officialLink: 'https://www.postgresql.org',
    version: '15.x',
    difficulty: 'advanced',
    color: 'bg-blue-800 text-white',
  },
  {
    name: 'Redis',
    description: '高性能键值存储数据库',
    category: 'database',
    icon: Database,
    features: ['内存存储', '数据结构', '持久化', '分布式'],
    tutorialLink: '/tutorials/redis',
    officialLink: 'https://redis.io',
    version: '7.x',
    difficulty: 'intermediate',
    color: 'bg-red-500 text-white',
  },
  // 开发工具
  {
    name: 'ESLint',
    description: 'JavaScript 代码质量检查工具',
    category: 'tools',
    icon: CheckCircle,
    features: ['代码检查', '规则定制', '自动修复', '插件生态'],
    officialLink: 'https://eslint.org',
    version: '8.x',
    difficulty: 'beginner',
    color: 'bg-purple-500 text-white',
  },
  {
    name: 'Prettier',
    description: '代码格式化工具，统一代码风格',
    category: 'tools',
    icon: Code,
    features: ['自动格式化', '多语言支持', '编辑器集成', '配置简单'],
    officialLink: 'https://prettier.io',
    version: '3.0.3',
    difficulty: 'beginner',
    color: 'bg-gray-600 text-white',
  },
  {
    name: 'Husky',
    description: 'Git hooks 工具，提升代码质量',
    category: 'tools',
    icon: Settings,
    features: ['Git 钩子', '提交检查', '自动化', '团队规范'],
    officialLink: 'https://typicode.github.io/husky',
    version: '8.0.3',
    difficulty: 'intermediate',
    color: 'bg-yellow-600 text-white',
  },
  {
    name: 'Docker',
    description: '容器化平台，简化部署流程',
    category: 'tools',
    icon: Cloud,
    features: ['容器化', '环境一致', '快速部署', '资源隔离'],
    officialLink: 'https://www.docker.com',
    version: '24.x',
    difficulty: 'advanced',
    color: 'bg-blue-600 text-white',
  },
  // 可视化和图表（当前教学暂不展示）
  // 云服务
  {
    name: 'Vercel',
    description: '现代化部署平台，专为前端优化',
    category: 'cloud',
    icon: Cloud,
    features: ['自动部署', 'Edge Network', '域名管理', 'Analytics'],
    officialLink: 'https://vercel.com',
    version: 'Latest',
    difficulty: 'beginner',
    color: 'bg-black text-white',
  },
  {
    name: 'AWS',
    description: '亚马逊云服务平台',
    category: 'cloud',
    icon: Cloud,
    features: ['云计算', '存储服务', '数据库', '机器学习'],
    officialLink: 'https://aws.amazon.com',
    version: 'Latest',
    difficulty: 'advanced',
    color: 'bg-orange-400 text-white',
  },
  // 测试工具
  {
    name: 'Jest',
    description: 'JavaScript 测试框架',
    category: 'tools',
    icon: CheckCircle,
    features: ['单元测试', '快照测试', '代码覆盖', '并行执行'],
    officialLink: 'https://jestjs.io',
    version: '29.x',
    difficulty: 'intermediate',
    color: 'bg-green-500 text-white',
  },
  {
    name: 'Cypress',
    description: '端到端测试工具',
    category: 'tools',
    icon: CheckCircle,
    features: ['E2E 测试', '实时重载', '时间旅行', '网络控制'],
    officialLink: 'https://www.cypress.io',
    version: '13.x',
    difficulty: 'advanced',
    color: 'bg-green-600 text-white',
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
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getCategoryStats = () => {
    const stats = techStack.reduce(
      (acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    return stats;
  };

  const getDifficultyStats = () => {
    const stats = techStack.reduce(
      (acc, item) => {
        acc[item.difficulty] = (acc[item.difficulty] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    return stats;
  };

  const stats = getCategoryStats();
  const difficultyStats = getDifficultyStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 标题部分 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          技术栈
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {' '}
            全览
          </span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          探索构建现代 Web
          应用所需的完整技术栈，包含前端、后端、数据库、云服务等各个方面的技术选型和最佳实践。
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
          <div className="text-2xl font-bold text-orange-600">
            {(stats.cloud || 0) + (stats.tools || 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">云服务&工具</div>
        </div>
      </div>

      {/* 过滤器 */}
      <div className="mb-8 space-y-4">
        {/* 分类过滤 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">按分类筛选</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            按难度筛选
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              (当前显示 {filteredTechStack.length} 项技术)
            </span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {difficulties.map(difficulty => {
              const count =
                difficulty.key === 'all' ? techStack.length : difficultyStats[difficulty.key] || 0;
              return (
                <button
                  key={difficulty.key}
                  onClick={() => setSelectedDifficulty(difficulty.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 flex items-center gap-2 ${
                    selectedDifficulty === difficulty.key
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <span>{difficulty.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      selectedDifficulty === difficulty.key
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 难度说明 */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <div className="font-medium text-green-800 dark:text-green-400">初级</div>
                <div className="text-green-600 dark:text-green-300">基础技术，容易上手学习</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <div className="font-medium text-yellow-800 dark:text-yellow-400">中级</div>
                <div className="text-yellow-600 dark:text-yellow-300">需要一定基础和经验</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div>
                <div className="font-medium text-red-800 dark:text-red-400">高级</div>
                <div className="text-red-600 dark:text-red-300">复杂技术，需要深度理解</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 筛选结果提示 */}
      {(selectedCategory !== 'all' || selectedDifficulty !== 'all') && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-blue-600 dark:text-blue-400">
                <Star className="h-5 w-5" />
              </div>
              <span className="text-blue-800 dark:text-blue-300">
                筛选结果：找到 <strong>{filteredTechStack.length}</strong> 项
                {selectedCategory !== 'all' &&
                  ` · ${categories.find(c => c.key === selectedCategory)?.name}`}
                {selectedDifficulty !== 'all' &&
                  ` · ${difficulties.find(d => d.key === selectedDifficulty)?.name}`}
                技术
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedDifficulty('all');
              }}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm font-medium"
            >
              清除筛选
            </button>
          </div>
        </div>
      )}

      {/* 技术栈卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredTechStack.length > 0 ? (
          filteredTechStack.map(tech => (
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
                <p className="text-gray-600 dark:text-gray-300 mb-4">{tech.description}</p>

                {/* 难度标签 */}
                <div className="mb-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(tech.difficulty)}`}
                  >
                    {tech.difficulty === 'beginner' && '初级'}
                    {tech.difficulty === 'intermediate' && '中级'}
                    {tech.difficulty === 'advanced' && '高级'}
                  </span>
                </div>

                {/* 特性列表 */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    主要特性
                  </h4>
                  <ul className="space-y-1">
                    {tech.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center text-sm text-gray-600 dark:text-gray-300"
                      >
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
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <Star className="h-16 w-16" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              没有找到匹配的技术
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
              尝试调整筛选条件，或
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedDifficulty('all');
                }}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 ml-1"
              >
                查看全部技术
              </button>
            </p>
          </div>
        )}
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
