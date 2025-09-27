# Next.js 15 企业级全栈开发技术分享

> **分享主题**: 从传统开发到现代全栈：Next.js 15 + TypeScript + Prisma 企业实战
>
> **分享时长**: 90分钟
>
> **目标受众**: 企业开发团队

---

## 📋 分享大纲

### 🎯 分享目标

- 了解 Next.js 15 在企业级应用中的核心优势和价值
- 掌握现代全栈开发的完整技术链路
- 学会评估和决策技术选型的方法
- 理解从开发到部署的完整流程
- 获得可直接应用于项目的最佳实践

### ⏰ 时间安排

```
1. 技术选型与价值分析     (15分钟)
2. Next.js 15 核心特性     (20分钟)
3. TypeScript 企业应用     (10分钟)
4. 数据层架构设计         (15分钟)
5. 实战演示：构建应用     (20分钟)
6. 部署与最佳实践         (5分钟)
7. 讨论与答疑            (5分钟)
```

---

## 1. 技术选型与价值分析 (15分钟)

### 🤔 企业面临的前端痛点

```bash
当前项目的典型问题：
❌ SEO 困难          → 搜索引擎收录差，影响业务流量
❌ 首屏加载慢        → 用户流失率高，转化率低
❌ 开发效率低        → 配置复杂，重复工作多
❌ 性能优化难        → 需要手动处理各种优化
❌ 部署运维复杂      → CI/CD 配置繁琐
❌ 团队协作成本高    → 缺乏统一标准和最佳实践
```

### ✅ Next.js 的企业级价值

#### **1. 业务价值量化**

| 问题场景   | 传统方案痛点   | Next.js 解决方案 | 业务收益                         |
| ---------- | -------------- | ---------------- | -------------------------------- |
| 电商商品页 | CSR，SEO差     | SSR，首屏直出    | SEO收录提升60%，转化率提升25%    |
| 企业官网   | 首屏白屏时间长 | SSG，CDN缓存     | 加载速度提升70%，跳出率降低40%   |
| 管理后台   | 路由配置复杂   | 文件系统路由     | 开发效率提升50%，维护成本降低30% |
| 移动端体验 | 适配工作量大   | 响应式优化       | 开发时间节省40%，用户体验提升    |

#### **2. 技术决策对比**

```tsx
// ❌ 传统 React SPA 的问题
function ProductPage() {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // 客户端获取数据，SEO 无法抓取，首屏白屏
    fetchProduct(id).then(setProduct);
  }, []);

  if (!product) return <div>Loading...</div>; // 搜索引擎看到的内容
  return <div>{product.name}</div>;
}

// ✅ Next.js 15 解决方案
export default async function ProductPage({ params }: { params: { id: string } }) {
  // 服务端直接获取数据，SEO 友好，首屏快速渲染
  const product = await getProduct(params.id);

  return (
    <>
      <title>{product.name} - 企业商城</title>
      <meta name="description" content={product.description} />
      <div>{product.name}</div>
    </>
  );
}
```

### 🎯 适用场景分析

```
✅ 推荐使用 Next.js 的场景：
- 对SEO有要求的项目（官网、电商、内容网站）
- 需要快速迭代的MVP项目
- 团队规模中等，需要统一技术栈
- 有性能要求的移动端Web应用
- 需要快速上线的企业级项目

⚠️ 谨慎考虑的场景：
- 纯内部管理系统（SEO不重要）
- 团队已深度投入其他框架生态
- 对包体积有极致要求的项目
- 需要大量自定义构建配置的项目
```

---

## 2. Next.js 15 核心特性深度解析 (20分钟)

### 🚀 App Router：现代化路由架构

#### **文件系统路由的企业价值**

```
app/
├── layout.tsx                 # 全局布局（Header/Footer复用）
├── page.tsx                   # 首页 → /
├── about/page.tsx             # 关于页 → /about
├── products/
│   ├── layout.tsx             # 产品模块布局
│   ├── page.tsx               # 产品列表 → /products
│   └── [id]/
│       ├── page.tsx           # 产品详情 → /products/123
│       ├── loading.tsx        # 加载状态
│       └── error.tsx          # 错误处理
├── dashboard/                 # 管理后台
│   ├── layout.tsx             # 后台布局（侧边栏）
│   ├── analytics/page.tsx     # 数据分析
│   └── users/page.tsx         # 用户管理
└── api/                       # API接口
    ├── products/route.ts      # RESTful API
    └── auth/login/route.ts    # 认证接口
```

**企业级优势**：

- 📁 **约定优于配置**：减少70%的路由配置工作
- 🔄 **嵌套布局复用**：Header/Footer/Sidebar自动复用
- ⚡ **自动代码分割**：每个路由独立打包，按需加载
- 🛡️ **类型安全路由**：TypeScript自动推导参数类型

#### **实际业务场景演示**

```tsx
// app/dashboard/layout.tsx - 后台通用布局
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          {children} {/* 子页面内容自动注入 */}
        </main>
      </div>
    </div>
  );
}

// app/dashboard/users/page.tsx - 用户管理页面
export default async function UsersPage() {
  // 服务端直接获取数据，无需useEffect
  const users = await getUserList();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">用户管理</h1>
      <UserDataTable users={users} />
    </div>
  );
}
```

### ⚡ Server Components vs Client Components

#### **组件架构决策树**

```
需要访问数据库/文件系统？
├─ 是 → Server Component (推荐)
└─ 否 → 需要交互状态？
    ├─ 是 → Client Component ('use client')
    └─ 否 → Server Component (默认)
```

#### **性能对比实测**

| 指标       | Server Component | Client Component |
| ---------- | ---------------- | ---------------- |
| Bundle大小 | 0 KB             | 计入客户端包     |
| 首屏渲染   | 200-400ms        | 500-1200ms       |
| SEO支持    | ✅ 完全支持      | ❌ 需要额外处理  |
| 数据库访问 | ✅ 直接访问      | ❌ 需要API       |
| 交互能力   | ❌ 无状态        | ✅ 完整交互      |

#### **企业级混合架构实践**

```tsx
// 企业用户资料页面 - 混合架构
export default async function UserProfilePage({ params }: { params: { id: string } }) {
  // Server Component: 服务端获取用户数据
  const user = await getUserById(params.id);
  const posts = await getUserPosts(params.id);

  if (!user) return <UserNotFound />;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 服务端渲染的静态内容 - SEO友好 */}
      <UserBasicInfo user={user} />
      <UserPostsList posts={posts} />

      {/* 客户端组件 - 处理交互功能 */}
      <UserInteractionPanel userId={user.id} />
    </div>
  );
}

// components/UserInteractionPanel.tsx - Client Component
('use client');
export default function UserInteractionPanel({ userId }: { userId: string }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);

  const handleFollow = async () => {
    setIsFollowing(!isFollowing);
    await fetch(`/api/users/${userId}/follow`, { method: 'POST' });
  };

  return (
    <div className="mt-6 flex gap-4">
      <button
        onClick={handleFollow}
        className={`px-4 py-2 rounded ${isFollowing ? 'bg-gray-400' : 'bg-blue-500'} text-white`}
      >
        {isFollowing ? '已关注' : '关注'}
      </button>
      <button
        onClick={() => setMessageOpen(true)}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        发消息
      </button>
      {messageOpen && <MessageModal userId={userId} onClose={() => setMessageOpen(false)} />}
    </div>
  );
}
```

### 🎯 渲染模式企业应用策略

#### **业务场景映射**

| 业务场景         | 推荐模式 | 核心价值        | 性能表现    |
| ---------------- | -------- | --------------- | ----------- |
| **企业官网首页** | SSG      | 极致性能+SEO    | 首屏<500ms  |
| **商品详情页**   | SSR      | 实时数据+SEO    | 首屏<800ms  |
| **新闻资讯**     | ISR      | 性能+内容新鲜度 | 首屏<600ms  |
| **用户管理后台** | CSR      | 强交互体验      | 首屏<1200ms |

```tsx
// SSR - 电商商品页（实时价格和库存）
export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id); // 实时获取
  const inventory = await getInventory(params.id); // 库存信息

  return (
    <div>
      <title>
        {product.name} - 价格：¥{product.price}
      </title>
      <ProductInfo product={product} stock={inventory.stock} />
    </div>
  );
}

// SSG - 企业博客文章（静态内容）
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  return <ArticleContent post={post} />;
}

// ISR - 数据报表页面（平衡性能和数据新鲜度）
export default async function AnalyticsPage() {
  const data = await fetch('/api/analytics', {
    next: { revalidate: 300 }, // 5分钟重新验证
  }).then(res => res.json());

  return <DashboardCharts data={data} />;
}
```

---

## 3. TypeScript 企业级应用 (10分钟)

### 🛡️ 类型安全的企业价值

#### **问题导向：团队协作痛点解决**

```tsx
// ❌ JavaScript项目中的典型问题
// 接口变更导致的运行时错误
interface User {
  id: string;
  name: string;
  email: string; // 后端删除了这个字段，前端不知道
}

function sendEmail(user) {
  return mailer.send(user.email); // 运行时报错！
}

// ✅ TypeScript解决方案
interface UserResponse {
  user: {
    id: string;
    name: string;
    profile: {
      avatar?: string;
      preferences: UserPreferences;
    };
  };
  meta: {
    lastLogin: string;
    permissions: Permission[];
  };
}

// 编译时就能发现问题
const handleUserData = async (userId: string): Promise<UserResponse> => {
  const response = await fetch(`/api/users/${userId}`);
  return response.json(); // TypeScript自动验证返回类型
};
```

#### **企业级API类型设计模式**

```tsx
// types/api.ts - 统一API类型管理
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ValidationError[];
  meta?: PaginationMeta;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  categoryId: string;
  specifications: ProductSpec[];
  tags?: string[];
}

export interface ProductResponse {
  id: string;
  name: string;
  price: number;
  category: {
    id: string;
    name: string;
  };
  inventory: {
    stock: number;
    reserved: number;
  };
  createdAt: string;
  updatedAt: string;
}

// 在API中使用 - 完整类型安全
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<ProductResponse>>> {
  try {
    const body: CreateProductRequest = await request.json();

    // TypeScript编译时验证所有字段
    const product = await prisma.product.create({
      data: {
        name: body.name,
        price: body.price,
        categoryId: body.categoryId,
        // 如果漏了必需字段，编译时就会报错
      },
      include: {
        category: true,
        inventory: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: product, // 类型自动匹配ProductResponse
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: '创建产品失败',
        errors: [{ field: 'general', message: error.message }],
      },
      { status: 500 }
    );
  }
}
```

---

## 4. 数据层架构设计 (15分钟)

### 🗄️ 现代化数据架构

#### **传统数据层 vs 现代方案对比**

```tsx
// ❌ 传统项目的数据层痛点
// 1. 每个组件都写useEffect + fetch
// 2. API调用分散在各个文件
// 3. 缓存策略不统一
// 4. 错误处理重复代码
// 5. 类型不安全

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data); // 不知道data的类型
        setLoading(false);
      })
      .catch(err => console.error(err)); // 错误处理不统一
  }, []);

  return loading ? <div>Loading...</div> : <div>{/* render */}</div>;
}

// ✅ Next.js + Prisma + Redis现代方案
```

#### **企业级数据层架构实现**

```tsx
// lib/database/userRepository.ts - 数据访问层
export class UserRepository {
  // 基础查询
  static async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        posts: { where: { published: true } },
        _count: { select: { followers: true, posts: true } },
      },
    });
  }

  // 缓存查询 - Redis集成
  static async findByIdCached(id: string) {
    const cacheKey = `user:${id}`;

    // 先查缓存
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log('Cache hit:', cacheKey);
      return cached;
    }

    // 缓存未命中，查询数据库
    const user = await this.findById(id);
    if (user) {
      await redis.set(cacheKey, user, { ex: 300 }); // 5分钟缓存
    }

    return user;
  }

  // 复杂业务查询
  static async getActiveUsersWithStats(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          isActive: true,
          posts: { some: { published: true } }, // 有发布内容的用户
        },
        include: {
          _count: {
            select: {
              posts: { where: { published: true } },
              followers: true,
              comments: true,
            },
          },
        },
        orderBy: [
          { posts: { _count: 'desc' } }, // 按发布数排序
          { createdAt: 'desc' },
        ],
        skip: offset,
        take: limit,
      }),
      prisma.user.count({
        where: {
          isActive: true,
          posts: { some: { published: true } },
        },
      }),
    ]);

    return {
      users: users.map(user => ({
        ...user,
        stats: {
          postsCount: user._count.posts,
          followersCount: user._count.followers,
          commentsCount: user._count.comments,
        },
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: offset + limit < total,
        hasPrev: page > 1,
      },
    };
  }
}

// services/userService.ts - 业务逻辑层
export class UserService {
  static async getUserProfile(id: string) {
    const user = await UserRepository.findByIdCached(id);
    if (!user) throw new Error('User not found');

    return {
      ...user,
      displayName: user.profile?.displayName || user.name,
      isVip: user.profile?.memberLevel === 'VIP',
      joinedDays: Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)),
    };
  }

  static async updateUserProfile(id: string, data: UpdateUserProfileData) {
    // 业务验证
    if (data.email) {
      const existingUser = await UserRepository.findByEmail(data.email);
      if (existingUser && existingUser.id !== id) {
        throw new Error('Email already exists');
      }
    }

    // 更新数据
    const updatedUser = await UserRepository.update(id, data);

    // 清除相关缓存
    await redis.del(`user:${id}`);

    return updatedUser;
  }
}

// app/api/users/[id]/route.ts - API层
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userProfile = await UserService.getUserProfile(params.id);

    return NextResponse.json({
      success: true,
      data: userProfile,
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: error.message === 'User not found' ? 404 : 500 }
    );
  }
}

// app/users/[id]/page.tsx - 页面层（Server Component）
export default async function UserProfilePage({ params }: { params: { id: string } }) {
  try {
    // 服务端直接调用Service，无需API
    const userProfile = await UserService.getUserProfile(params.id);

    return (
      <div className="container mx-auto py-8">
        <UserProfileCard user={userProfile} />
        <UserPostsList posts={userProfile.posts} />
      </div>
    );
  } catch (error) {
    return <UserNotFound />;
  }
}
```

#### **性能优化策略**

```tsx
// 1. N+1查询优化
// ❌ 会产生N+1查询问题
const posts = await prisma.post.findMany();
for (const post of posts) {
  post.author = await prisma.user.findUnique({ where: { id: post.authorId } });
}

// ✅ 使用include一次查询解决
const postsWithAuthors = await prisma.post.findMany({
  include: {
    author: { select: { id: true, name: true, avatar: true } },
    _count: { select: { comments: true, likes: true } },
  },
});

// 2. 分层缓存策略
export class CacheService {
  // L1: 内存缓存（单实例）
  private static memoryCache = new Map();

  // L2: Redis缓存（分布式）
  static async get<T>(key: string): Promise<T | null> {
    // 先查内存
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key);
    }

    // 再查Redis
    const redisValue = await redis.get(key);
    if (redisValue) {
      this.memoryCache.set(key, redisValue);
      return redisValue;
    }

    return null;
  }

  static async set<T>(key: string, value: T, ttl = 300) {
    this.memoryCache.set(key, value);
    await redis.set(key, value, { ex: ttl });
  }
}
```

---

## 5. 实战演示：构建任务管理应用 (20分钟)

### 🎯 项目场景

> 构建一个企业级任务管理系统，包含用户认证、任务增删改查、实时状态更新等功能

#### **项目架构设计**

```
task-manager/
├── prisma/
│   └── schema.prisma          # 数据模型
├── src/
│   ├── app/
│   │   ├── api/              # API路由层
│   │   │   ├── auth/         # 认证相关API
│   │   │   ├── tasks/        # 任务CRUD API
│   │   │   └── users/        # 用户管理API
│   │   ├── dashboard/        # 仪表板页面
│   │   ├── tasks/            # 任务管理页面
│   │   └── auth/             # 登录注册页面
│   ├── components/           # 共享组件
│   ├── services/             # 业务逻辑层
│   ├── lib/                  # 工具函数
│   └── types/                # 类型定义
```

### 🏗️ 核心功能实现

#### **1. 数据模型设计 (5分钟)**

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  role      Role     @default(USER)
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model Task {
  id          String     @id @default(cuid())
  title       String
  description String?
  status      TaskStatus @default(TODO)
  priority    Priority   @default(MEDIUM)
  dueDate     DateTime?
  assigneeId  String
  assignee    User       @relation(fields: [assigneeId], references: [id])
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@map("tasks")
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum Role {
  USER
  ADMIN
}
```

#### **2. API接口开发 (8分钟)**

```tsx
// app/api/tasks/route.ts - 任务列表API
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // 构建查询条件
    const where: any = { assigneeId: session.user.id };
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: { assignee: { select: { name: true, email: true } } },
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.task.count({ where }),
    ]);

    return NextResponse.json({
      tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Tasks API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, priority, dueDate } = body;

    // 数据验证
    if (!title?.trim()) {
      return NextResponse.json({ error: '任务标题不能为空' }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim(),
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        assigneeId: session.user.id,
      },
      include: { assignee: { select: { name: true, email: true } } },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error('Create Task Error:', error);
    return NextResponse.json({ error: '创建任务失败' }, { status: 500 });
  }
}

// app/api/tasks/[id]/route.ts - 单个任务操作
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, status, priority, dueDate } = body;

    const task = await prisma.task.updateMany({
      where: {
        id: params.id,
        assigneeId: session.user.id, // 只能更新自己的任务
      },
      data: {
        ...(title && { title: title.trim() }),
        ...(description !== undefined && { description: description?.trim() }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(dueDate !== undefined && {
          dueDate: dueDate ? new Date(dueDate) : null,
        }),
      },
    });

    if (task.count === 0) {
      return NextResponse.json({ error: '任务不存在或无权限' }, { status: 404 });
    }

    const updatedTask = await prisma.task.findUnique({
      where: { id: params.id },
      include: { assignee: { select: { name: true, email: true } } },
    });

    return NextResponse.json({ task: updatedTask });
  } catch (error) {
    console.error('Update Task Error:', error);
    return NextResponse.json({ error: '更新任务失败' }, { status: 500 });
  }
}
```

#### **3. 前端页面开发 (7分钟)**

```tsx
// app/dashboard/page.tsx - 仪表板主页
import { Suspense } from 'react';
import { TaskStats } from '@/components/TaskStats';
import { RecentTasks } from '@/components/RecentTasks';
import { TaskChart } from '@/components/TaskChart';

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">任务仪表板</h1>
        <p className="text-gray-600 mt-2">管理您的任务和项目进度</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Suspense fallback={<StatsSkeleton />}>
          <TaskStats />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 任务图表 */}
        <div className="lg:col-span-2">
          <Suspense fallback={<ChartSkeleton />}>
            <TaskChart />
          </Suspense>
        </div>

        {/* 最近任务 */}
        <div className="lg:col-span-1">
          <Suspense fallback={<TasksSkeleton />}>
            <RecentTasks />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

// components/TaskStats.tsx - 统计组件 (Server Component)
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export async function TaskStats() {
  const session = await getServerSession();
  if (!session?.user) return null;

  const stats = await prisma.task.groupBy({
    by: ['status'],
    where: { assigneeId: session.user.id },
    _count: { id: true },
  });

  const totalTasks = stats.reduce((sum, stat) => sum + stat._count.id, 0);
  const completedTasks = stats.find(s => s.status === 'COMPLETED')?._count.id || 0;
  const inProgressTasks = stats.find(s => s.status === 'IN_PROGRESS')?._count.id || 0;
  const todoTasks = stats.find(s => s.status === 'TODO')?._count.id || 0;

  return (
    <>
      <StatsCard title="总任务" value={totalTasks} color="blue" />
      <StatsCard title="进行中" value={inProgressTasks} color="yellow" />
      <StatsCard title="已完成" value={completedTasks} color="green" />
      <StatsCard title="待开始" value={todoTasks} color="gray" />
    </>
  );
}

// components/TaskList.tsx - 任务列表 (Client Component)
'use client';
import { useState, useEffect } from 'react';
import { Task } from '@/types';

interface TaskListProps {
  initialTasks: Task[];
}

export default function TaskList({ initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        const { task } = await response.json();
        setTasks(prev => prev.map(t => t.id === taskId ? task : t));
      }
    } catch (error) {
      console.error('Update task failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  return (
    <div className="space-y-4">
      {/* 过滤器 */}
      <div className="flex gap-2 mb-6">
        {['all', 'TODO', 'IN_PROGRESS', 'COMPLETED'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === status
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? '全部' : status}
          </button>
        ))}
      </div>

      {/* 任务列表 */}
      <div className="space-y-3">
        {filteredTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={updateTaskStatus}
            disabled={loading}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## 6. 部署与最佳实践 (5分钟)

### 🚀 生产环境部署

#### **Vercel一键部署**

```bash
# 1. 项目准备
git add . && git commit -m "Ready for production"

# 2. 环境变量配置
# Vercel Dashboard 中设置：
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.vercel.app"

# 3. 自动部署
git push origin main
# Vercel自动检测并部署
```

#### **Docker生产部署**

```dockerfile
# Dockerfile
FROM node:18-alpine AS base
WORKDIR /app

# 依赖安装
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN npm i -g pnpm && pnpm install --frozen-lockfile

# 应用构建
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm i -g pnpm && pnpm build

# 生产运行
FROM base AS runner
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### 📊 性能监控与优化

```tsx
// lib/monitoring.ts - 生产环境监控
export class ProductionMonitoring {
  // 性能指标上报
  static trackWebVitals(metric: any) {
    if (typeof window !== 'undefined') {
      // 上报到监控平台
      fetch('/api/metrics', {
        method: 'POST',
        body: JSON.stringify({
          name: metric.name,
          value: metric.value,
          id: metric.id,
          timestamp: Date.now(),
        }),
      });
    }
  }

  // 错误监控
  static trackError(error: Error, context?: Record<string, any>) {
    console.error('Application Error:', error);

    fetch('/api/errors', {
      method: 'POST',
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        context,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: Date.now(),
      }),
    });
  }
}

// app/layout.tsx 中集成
export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 性能监控
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(ProductionMonitoring.trackWebVitals);
      getFID(ProductionMonitoring.trackWebVitals);
      getFCP(ProductionMonitoring.trackWebVitals);
      getLCP(ProductionMonitoring.trackWebVitals);
      getTTFB(ProductionMonitoring.trackWebVitals);
    });

    // 全局错误捕获
    window.addEventListener('error', event => {
      ProductionMonitoring.trackError(event.error);
    });

    window.addEventListener('unhandledrejection', event => {
      ProductionMonitoring.trackError(new Error(event.reason));
    });
  }, []);

  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
```

---

## 7. 讨论与答疑 (5分钟)

### 💬 常见问题预案

#### **Q1: 现有项目如何迁移到Next.js？**

**A**: 建议采用渐进式迁移策略：

```
阶段1：新功能试点（1-2周）
├── 选择独立的新功能模块
├── 使用Next.js实现
└── 验证开发体验和性能

阶段2：并行开发（1个月）
├── 新功能继续用Next.js
├── 旧功能保持现状
└── 积累团队经验

阶段3：逐步替换（2-3个月）
├── 将成熟模块迁移到Next.js
├── 统一技术栈
└── 完善开发流程
```

#### **Q2: Next.js vs Vue/Angular的技术选型？**

**A**: 选型考虑因素：

- **团队技术栈**：React生态更适合已有React经验的团队
- **项目需求**：SSR/SSG需求强烈时Next.js优势明显
- **生态成熟度**：React生态在企业级应用更成熟
- **学习成本**：团队现有技术基础决定迁移成本

#### **Q3: 性能优化的投入产出比如何？**

**A**: 根据实际测试数据：

- **首屏优化**：投入1周，性能提升60-80%
- **SEO优化**：投入2-3天，搜索收录提升40-60%
- **代码分割**：投入1-2天，包大小减少30-50%
- **缓存策略**：投入3-5天，接口响应时间减少70-80%

### 🎯 后续推进建议

```
立即可行 (本周)：
├── 技术调研和demo验证
├── 团队内部技术分享
└── 制定迁移计划

中期规划 (本月)：
├── 新项目使用Next.js
├── 开发工具链配置
└── 最佳实践文档

长期发展 (季度)：
├── 团队技能培训
├── CI/CD流程优化
└── 监控体系建设
```

---

## 📚 相关资源

### 🔗 官方文档

- [Next.js 15 官方文档](https://nextjs.org/docs)
- [Prisma 官方文档](https://www.prisma.io/docs)
- [TypeScript 官方文档](https://www.typescriptlang.org/docs)

### 🛠️ 开发工具

- [Prisma Studio](https://www.prisma.io/studio) - 数据库可视化
- [Next.js 开发者工具](https://nextjs.org/docs/advanced-features/debugging)
- [React DevTools](https://react.dev/learn/react-developer-tools)

### 📖 推荐学习

- [Next.js 官方学习路径](https://nextjs.org/learn)
- [企业级最佳实践](https://nextjs.org/docs/deployment/best-practices)
- [性能优化指南](https://nextjs.org/docs/advanced-features/measuring-performance)

---

**感谢大家的时间！欢迎随时讨论技术问题和项目合作。** 🚀
