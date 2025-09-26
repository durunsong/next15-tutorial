# Next.js 15 全栈开发完整课程大纲

## 课程简介

本课程基于完整的 Next.js 15 教程项目，从零开始系统学习现代全栈 Web 开发。课程涵盖 Next.js 15 的所有核心特性、最佳实践，以及生产环境部署。

### 技术栈概览

- **前端框架**: Next.js 15 + React 19
- **开发语言**: TypeScript
- **样式系统**: Tailwind CSS + Ant Design
- **数据库**: PostgreSQL + Prisma ORM
- **缓存系统**: Upstash Redis
- **文件存储**: 阿里云 OSS
- **部署**: Vercel + Docker

---

## 第一模块：Next.js 15 基础篇 (20学时)

### 1.1 Next.js 简介与环境搭建 (2学时)

**学习目标**: 了解 Next.js 15 的核心概念和优势

- Next.js 解决了什么问题？
- Next.js 15 新特性概览
- 开发环境搭建与项目初始化
- 项目结构深度解析

**实践内容**:

```bash
# 创建项目
npx create-next-app@latest my-app --typescript --tailwind --eslint
cd my-app
npm run dev
```

**核心概念**:

- App Router vs Pages Router
- 文件系统路由
- 开发服务器热重载
- 项目配置文件详解

### 1.2 App Router 路由系统 (4学时)

**学习目标**: 掌握 Next.js 15 的新路由系统

- App Router 完整机制
- 嵌套路由与布局设计
- 动态路由和参数处理
- 路由组和平行路由

**文件结构示例**:

```
app/
├── layout.tsx          # 根布局
├── page.tsx            # 首页
├── about/
│   └── page.tsx        # /about
├── blog/
│   ├── layout.tsx      # 博客布局
│   ├── page.tsx        # /blog
│   └── [slug]/
│       └── page.tsx    # /blog/[slug]
└── (marketing)/        # 路由组
    ├── pricing/
    └── features/
```

**特殊文件详解**:

- `layout.tsx` - 共享布局
- `page.tsx` - 页面组件
- `loading.tsx` - 加载状态
- `error.tsx` - 错误边界
- `not-found.tsx` - 404 页面
- `template.tsx` - 重新渲染的布局

### 1.3 Server Components vs Client Components (4学时)

**学习目标**: 理解新的组件架构

- Server Components 的工作原理
- Client Components 的使用场景
- 组件边界的划分策略
- 数据传递与状态管理

**代码示例**:

```tsx
// Server Component (默认)
export default async function ServerPage() {
  const data = await fetch('https://api.example.com/data');
  return <div>{data.title}</div>;
}

// Client Component
('use client');
export default function ClientComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 1.4 渲染模式深度解析 (6学时)

**学习目标**: 掌握四种渲染模式的使用

- SSR (服务端渲染) - 实时数据
- SSG (静态生成) - 最佳性能
- ISR (增量静态再生) - 平衡性能与数据新鲜度
- CSR (客户端渲染) - 交互密集型应用

**性能对比表格**:
| 渲染模式 | TTFB | FCP | LCP | TTI | SEO | 适用场景 |
|----------|------|-----|-----|-----|-----|----------|
| SSR | 200-500ms | 200-400ms | 400-800ms | 600-1200ms | ⭐⭐⭐⭐⭐ | 个性化页面 |
| SSG | 50-150ms | 100-300ms | 200-500ms | 300-600ms | ⭐⭐⭐⭐⭐ | 静态内容 |
| ISR | 50-200ms | 150-350ms | 300-600ms | 400-800ms | ⭐⭐⭐⭐ | 内容网站 |
| CSR | 50-100ms | 500-1500ms | 1000-2500ms | 1500-3000ms | ⭐⭐ | 管理后台 |

### 1.5 数据获取策略 (4学时)

**学习目标**: 掌握现代化的数据获取方法

- async/await 直接在组件中使用
- 缓存策略配置
- 并行数据获取
- 错误处理和加载状态

**缓存配置示例**:

```tsx
// 强制缓存
const posts = await fetch('/api/posts', { cache: 'force-cache' });

// 不缓存
const user = await fetch('/api/user', { cache: 'no-store' });

// 定时重新验证
const data = await fetch('/api/data', { next: { revalidate: 3600 } });
```

---

## 第二模块：TypeScript 进阶应用 (12学时)

### 2.1 TypeScript 基础与 Next.js 集成 (3学时)

**学习目标**: 建立类型安全的开发基础

- TypeScript 在 Next.js 中的配置
- 基础类型系统回顾
- Next.js 特定类型定义
- 开发工具配置 (ESLint, Prettier)

### 2.2 高级类型系统 (4学时)

**学习目标**: 掌握 TypeScript 高级特性

- 泛型的实际应用
- 联合类型与交叉类型
- 条件类型和映射类型
- 模块声明和类型声明文件

**实用类型示例**:

```tsx
// API 响应类型
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

// 页面组件 Props 类型
interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

// 表单验证类型
type FormData = {
  [K in keyof UserSchema]: UserSchema[K] extends string ? string : UserSchema[K];
};
```

### 2.3 API 类型安全 (3学时)

**学习目标**: 确保前后端类型一致性

- API 路由类型定义
- 请求和响应类型
- 类型安全的 API 客户端
- 运行时类型验证 (Zod)

### 2.4 组件类型设计模式 (2学时)

**学习目标**: 设计可复用的类型化组件

- 组件 Props 类型设计
- 泛型组件模式
- 高阶组件类型
- Render Props 模式

---

## 第三模块：数据层架构 (16学时)

### 3.1 Prisma ORM 深度应用 (8学时)

#### 3.1.1 Prisma 基础配置 (2学时)

- Schema 设计最佳实践
- 数据库连接配置
- 迁移系统使用
- Prisma Studio 工具

#### 3.1.2 高级查询技巧 (3学时)

- 复杂关联查询
- 聚合和分组操作
- 事务处理
- 性能优化技巧

**复杂查询示例**:

```tsx
// 深度关联查询
const userWithPosts = await prisma.user.findUnique({
  where: { id },
  include: {
    posts: {
      where: { published: true },
      include: {
        comments: { include: { author: true } },
        likes: true,
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
    },
    _count: {
      select: { posts: true, comments: true, followers: true },
    },
  },
});

// 复杂聚合查询
const postStats = await prisma.post.aggregate({
  _count: { id: true },
  _avg: { views: true },
  _sum: { views: true },
  _max: { createdAt: true },
  where: {
    published: true,
    author: {
      posts: { some: { published: true } },
    },
  },
});
```

#### 3.1.3 数据建模进阶 (3学时)

- 关系设计模式
- 软删除实现
- 审计字段设计
- 多态关联处理

### 3.2 Redis 缓存系统 (8学时)

#### 3.2.1 缓存基础概念 (2学时)

- Redis 数据结构选择
- 过期策略设计
- 缓存键命名规范
- Upstash Redis 配置

#### 3.2.2 缓存策略实现 (4学时)

- Cache-First 模式
- Cache-Aside 模式
- Write-Through 模式
- Write-Behind 模式

**缓存策略代码**:

```tsx
export class CacheService {
  // Cache-First 策略
  static async getCachedData<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = 300
  ): Promise<T> {
    const cached = await redis.get(key);
    if (cached) return cached as T;

    const data = await fetcher();
    await redis.set(key, data, { ex: ttl });
    return data;
  }

  // 防止缓存穿透
  static async safeGet<T>(key: string, fetcher: () => Promise<T | null>): Promise<T | null> {
    const cached = await redis.get(key);
    if (cached !== null) {
      return cached === 'NULL' ? null : (cached as T);
    }

    const data = await fetcher();
    await redis.set(key, data || 'NULL', { ex: 60 });
    return data;
  }
}
```

#### 3.2.3 高级缓存技巧 (2学时)

- 分布式锁实现
- 缓存预热策略
- 缓存失效处理
- 性能监控指标

---

## 第四模块：API 设计与安全 (14学时)

### 4.1 RESTful API 设计 (6学时)

#### 4.1.1 API 路由最佳实践 (3学时)

- RESTful 设计原则
- 路由命名规范
- HTTP 状态码使用
- 请求验证和错误处理

**标准 API 结构**:

```tsx
// app/api/users/route.ts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);

    const users = await prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      select: { id: true, name: true, email: true, createdAt: true },
    });

    const total = await prisma.user.count();

    return NextResponse.json({
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Users API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: '获取用户列表失败' },
      { status: 500 }
    );
  }
}
```

#### 4.1.2 数据验证与序列化 (3学时)

- Zod 验证库使用
- 请求数据验证
- 响应数据格式化
- 自定义验证规则

### 4.2 认证与授权系统 (4学时)

**学习目标**: 构建安全的用户认证系统

- JWT 令牌机制
- 会话管理策略
- 权限控制实现
- 安全最佳实践

### 4.3 中间件与安全防护 (4学时)

**学习目标**: 实现全面的安全防护

- 限流中间件实现
- CORS 跨域处理
- 安全头部配置
- 攻击防护措施

**中间件实现**:

```tsx
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const clientIP = getClientIP(request);

  // 限流检查
  if (needsRateLimit(pathname)) {
    const isLimited = await rateLimit(clientIP);
    if (isLimited) {
      return new NextResponse(JSON.stringify({ error: 'Too Many Requests' }), {
        status: 429,
        headers: { 'Retry-After': '900' },
      });
    }
  }

  // 认证检查
  if (isProtectedRoute(pathname)) {
    const token = request.cookies.get('auth-token');
    if (!token || !(await verifyToken(token.value))) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}
```

---

## 第五模块：文件处理与云服务 (10学时)

### 5.1 文件上传系统 (4学时)

- 文件上传组件设计
- 文件类型和大小验证
- 进度显示和错误处理
- 多文件上传支持

### 5.2 阿里云 OSS 集成 (4学时)

- OSS 服务配置
- 文件存储策略
- CDN 加速配置
- 图片处理服务

### 5.3 文件管理最佳实践 (2学时)

- 文件命名规范
- 存储成本优化
- 备份和恢复策略
- 安全访问控制

---

## 第六模块：性能优化专题 (12学时)

### 6.1 Next.js 内置优化 (4学时)

**学习目标**: 充分利用 Next.js 的优化特性

- 图片优化深度应用
- 字体优化策略
- 代码分割技巧
- 预加载和预取

**图片优化示例**:

```tsx
import Image from 'next/image';

// 响应式图片
<Image
  src="/hero.jpg"
  alt="Hero Image"
  width={800}
  height={600}
  priority
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// 动态图片
<Image
  src={post.coverImage}
  alt={post.title}
  width={400}
  height={300}
  style={{
    width: '100%',
    height: 'auto',
  }}
/>
```

### 6.2 数据库性能优化 (4学时)

- 查询优化技巧
- 索引设计策略
- 连接池配置
- 慢查询分析

### 6.3 缓存性能优化 (4学时)

- 多层缓存架构
- 缓存命中率优化
- 缓存预热策略
- 性能监控设置

---

## 第七模块：用户界面与体验 (12学时)

### 7.1 Tailwind CSS 深度应用 (4学时)

- 实用优先的设计理念
- 组件化样式设计
- 响应式设计技巧
- 暗色模式实现

### 7.2 Ant Design 企业级组件 (4学时)

- 组件库最佳实践
- 主题定制配置
- 表单设计模式
- 数据展示组件

### 7.3 交互与动画 (4学时)

- Framer Motion 动画库
- 页面转场效果
- 微交互设计
- 性能优化考虑

---

## 第八模块：测试与质量保证 (8学时)

### 8.1 单元测试 (3学时)

- Jest 配置和使用
- 组件测试策略
- API 测试方法
- 覆盖率统计

### 8.2 集成测试 (3学时)

- E2E 测试框架
- 用户流程测试
- 性能测试
- 可访问性测试

### 8.3 代码质量 (2学时)

- ESLint 规则配置
- Prettier 格式化
- Git Hooks 设置
- CI/CD 流程

---

## 第九模块：部署与运维 (10学时)

### 9.1 Vercel 部署 (3学时)

- 生产环境配置
- 环境变量管理
- 域名和 SSL 配置
- 性能监控

### 9.2 Docker 容器化 (4学时)

- Dockerfile 编写
- 多阶段构建
- Docker Compose 配置
- 容器编排

### 9.3 监控与维护 (3学时)

- 应用性能监控
- 错误追踪系统
- 日志管理
- 备份策略

---

## 第十模块：实战项目 (20学时)

### 10.1 项目规划与设计 (4学时)

- 需求分析方法
- 技术选型决策
- 数据库设计
- API 接口设计

### 10.2 功能模块开发 (12学时)

- 用户认证模块
- 内容管理系统
- 实时功能实现
- 数据分析面板

### 10.3 项目优化与部署 (4学时)

- 性能测试与优化
- 安全审计
- 生产环境部署
- 上线后维护

---

## 学习资源与工具

### 开发工具

- **IDE**: VSCode + Next.js 插件
- **调试**: React Developer Tools
- **API 测试**: Postman/Insomnia
- **数据库**: Prisma Studio
- **缓存**: Redis CLI

### 推荐资源

- [Next.js 官方文档](https://nextjs.org/docs)
- [TypeScript 官方文档](https://www.typescriptlang.org/docs)
- [Prisma 官方文档](https://www.prisma.io/docs)
- [Tailwind CSS 官网](https://tailwindcss.com)

### 项目代码仓库

```bash
git clone https://github.com/your-repo/next15-tutorial.git
cd next15-tutorial
npm install
npm run dev
```

---

## 课程学习路径建议

### 初学者路径 (建议学时: 60学时)

1. **基础入门** (模块1-2): 熟悉 Next.js 和 TypeScript
2. **数据处理** (模块3): 掌握数据库和缓存
3. **实践应用** (模块10): 完成一个小项目

### 进阶开发者路径 (建议学时: 80学时)

1. **全栈开发** (模块1-7): 完整的前后端技能
2. **质量保证** (模块8): 测试和代码质量
3. **生产部署** (模块9-10): 项目上线

### 专业开发者路径 (建议学时: 100学时)

1. **完整学习** (所有模块): 掌握企业级开发技能
2. **深度实践** (额外项目): 复杂业务场景应用
3. **团队协作** (代码review): 企业开发流程

---

## 评估方式

### 理论考核 (30%)

- 概念理解测试
- 最佳实践选择题
- 架构设计方案

### 实践作业 (50%)

- 功能模块实现
- 代码质量评估
- 性能优化报告

### 项目实战 (20%)

- 完整项目开发
- 技术方案设计
- 团队协作能力

---

_本课程大纲基于实际生产项目经验制定，注重理论与实践相结合，旨在培养具备企业级开发能力的全栈工程师。_
