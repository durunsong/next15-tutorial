# Next.js + Prisma + Vercel：现代全栈开发企业实战

> **分享标题**: 从前端到全栈：Next.js 15 + Prisma + Vercel 企业级开发实战
>
> **副标题**: 构建高性能、SEO友好的现代Web应用完整方案

---

## 分享概览

### 🎯 分享目标

- 了解 Next.js 在企业级应用中的核心优势
- 掌握全栈开发的完整技术链路
- 学会使用现代工具快速构建生产级应用
- 理解从开发到部署的完整流程

### ⏰ 时间安排 (总计90分钟)

```
1. Next.js 选型优势分析     (15分钟)
2. Next.js 核心模块详解     (20分钟)
3. 全栈实战：构建应用      (25分钟)
4. Prisma 数据库实践       (15分钟)
5. JWT 身份认证方案        (10分钟)
6. Vercel 一键部署         (5分钟)
```

---

## 1. 为什么选择 Next.js？(15分钟)

### 🤔 企业面临的前端痛点

```bash
# 当前项目的典型问题
❌ SEO 困难          → 搜索引擎收录差，影响业务流量
❌ 首屏加载慢        → 用户流失率高，转化率低
❌ 开发效率低        → 配置复杂，重复工作多
❌ 性能优化难        → 需要手动处理各种优化
❌ 部署运维复杂      → CI/CD 配置繁琐
```

### ✅ Next.js 的企业级优势

#### **1. SEO 和性能优势**

```tsx
// 传统 SPA 的问题
function ProductPage() {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // 客户端渲染：搜索引擎看到的是空页面
    fetchProduct(id).then(setProduct);
  }, []);

  return product ? <div>{product.name}</div> : <div>Loading...</div>;
}

// Next.js SSR 解决方案
export default async function ProductPage({ params }: { params: { id: string } }) {
  // 服务端渲染：搜索引擎直接收录完整内容
  const product = await getProduct(params.id);

  return (
    <div>
      <h1>{product.name}</h1>
      <meta name="description" content={product.description} />
      <meta property="og:title" content={product.name} />
    </div>
  );
}
```

#### **2. 三种渲染模式的业务价值**

| 渲染模式 | 适用场景             | 业务价值           | 性能表现     |
| -------- | -------------------- | ------------------ | ------------ |
| **SSR**  | 电商商品页、用户资料 | SEO收录 + 实时数据 | 首屏 < 1s    |
| **SSG**  | 官网、文档、博客     | 极致性能 + CDN缓存 | 首屏 < 500ms |
| **ISR**  | 新闻、内容网站       | 性能 + 内容新鲜度  | 首屏 < 800ms |

```tsx
// SSR：实时数据，SEO友好
export default async function UserProfile({ params }) {
  const user = await getUserProfile(params.id);
  return <ProfileComponent user={user} />;
}

// SSG：静态生成，性能最佳
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export default async function BlogPost({ params }) {
  const post = await getPost(params.slug);
  return <ArticleComponent post={post} />;
}

// ISR：平衡性能和数据新鲜度
export default async function NewsPage() {
  const news = await fetch('/api/news', {
    next: { revalidate: 3600 }, // 1小时重新验证
  });
  return <NewsList news={news} />;
}
```

#### **3. 开发效率对比**

```bash
# 传统 React 项目搭建
npm create react-app my-app
npm install react-router-dom
npm install axios
npm install @types/node typescript
# 配置路由、状态管理、构建优化... (2-3天)

# Next.js 项目搭建
npx create-next-app@latest my-app --typescript --tailwind
npm run dev
# 开箱即用，立即开发业务逻辑 (30分钟)
```

---

## 2. Next.js 核心模块详解 (20分钟)

### 🗂️ App Router：现代化路由系统

#### **文件系统路由的威力**

```
app/
├── layout.tsx                 # 全局布局
├── page.tsx                   # 首页 → /
├── about/page.tsx             # 关于页 → /about
├── products/
│   ├── layout.tsx             # 产品模块布局
│   ├── page.tsx               # 产品列表 → /products
│   └── [id]/
│       ├── page.tsx           # 产品详情 → /products/123
│       ├── loading.tsx        # 加载状态
│       └── error.tsx          # 错误处理
├── api/
│   ├── products/route.ts      # API接口 → /api/products
│   └── auth/login/route.ts    # 登录接口 → /api/auth/login
└── (dashboard)/               # 路由分组
    ├── analytics/page.tsx     # → /analytics
    └── settings/page.tsx      # → /settings
```

#### **嵌套布局的业务价值**

```tsx
// app/layout.tsx - 全局布局
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

// app/dashboard/layout.tsx - 仪表板布局
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

// 业务价值：
// ✅ 布局复用，减少重复代码
// ✅ 局部导航，提升用户体验
// ✅ 权限控制，安全性保障
```

### ⚡ Server Components vs Client Components

#### **组件选择决策树**

```
需要使用浏览器API？
├─ 是 → Client Component
└─ 否 → 需要交互状态？
    ├─ 是 → Client Component
    └─ 否 → Server Component (推荐)
```

#### **实际应用案例**

```tsx
// Server Component：数据获取和渲染
export default async function ProductList() {
  // 服务端直接查询数据库
  const products = await prisma.product.findMany({
    include: { category: true },
    where: { published: true },
  });

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// Client Component：交互功能
('use client');
export default function ProductCard({ product }) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    setIsLiked(!isLiked);
    await fetch(`/api/products/${product.id}/like`, { method: 'POST' });
  };

  return (
    <div className="border rounded-lg p-4">
      <h3>{product.name}</h3>
      <button onClick={handleLike}>{isLiked ? '❤️' : '🤍'} 喜欢</button>
    </div>
  );
}
```

### 🛠️ 内置优化特性

#### **自动优化对比**

```tsx
// ❌ 传统方式：手动优化
import loadable from '@loadable/component';
const HeavyComponent = loadable(() => import('./HeavyComponent'), {
  fallback: <div>Loading...</div>
});

// ✅ Next.js：自动优化
import dynamic from 'next/dynamic';
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>
});

// 🚀 图片优化：自动WebP、懒加载、响应式
import Image from 'next/image';
<Image
  src="/product.jpg"
  alt="产品图片"
  width={400}
  height={300}
  priority // 首屏图片优先加载
  sizes="(max-width: 768px) 100vw, 50vw"
/>

// 📝 字体优化：自动子集化、预加载
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
```

---

## 3. 全栈实践：构建任务管理应用 (25分钟)

### 🎯 实战项目：企业任务管理系统

> **项目场景**: 构建一个简单的任务管理应用，包含用户认证、任务增删改查、实时更新等功能

#### **项目结构设计**

```
task-manager/
├── prisma/
│   └── schema.prisma          # 数据库模型
├── src/
│   ├── app/
│   │   ├── api/              # API路由
│   │   │   ├── auth/
│   │   │   └── tasks/
│   │   ├── login/            # 登录页面
│   │   ├── dashboard/        # 仪表板
│   │   └── tasks/            # 任务管理
│   ├── components/           # 共享组件
│   ├── lib/                  # 工具函数
│   └── types/                # TypeScript类型
└── .env.local                # 环境变量
```

### 🏗️ Step 1: 项目初始化 (5分钟)

```bash
# 1. 创建项目
npx create-next-app@latest task-manager --typescript --tailwind --app

# 2. 安装依赖
cd task-manager
npm install prisma @prisma/client
npm install @types/jsonwebtoken jsonwebtoken
npm install bcryptjs @types/bcryptjs

# 3. 初始化数据库
npx prisma init
```

### 📊 Step 2: 数据库模型设计 (5分钟)

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
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model Task {
  id          String    @id @default(cuid())
  title       String
  description String?
  status      TaskStatus @default(TODO)
  priority    Priority   @default(MEDIUM)
  dueDate     DateTime?
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@map("tasks")
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  COMPLETED
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}
```

### 🔗 Step 3: API 接口开发 (10分钟)

#### **任务管理 API**

```tsx
// app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // 验证用户身份
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    // 构建查询条件
    const where: any = { userId: user.id };
    if (status) where.status = status;
    if (priority) where.priority = priority;

    // 查询任务
    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Tasks API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, priority, dueDate } = body;

    // 输入验证
    if (!title?.trim()) {
      return NextResponse.json({ error: '任务标题不能为空' }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim(),
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: user.id,
      },
      include: { user: { select: { name: true, email: true } } },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error('Create Task Error:', error);
    return NextResponse.json({ error: '创建任务失败' }, { status: 500 });
  }
}
```

#### **任务详情和更新 API**

```tsx
// app/api/tasks/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const task = await prisma.task.findFirst({
      where: {
        id: params.id,
        userId: user.id, // 确保用户只能访问自己的任务
      },
      include: { user: { select: { name: true, email: true } } },
    });

    if (!task) {
      return NextResponse.json({ error: '任务不存在' }, { status: 404 });
    }

    return NextResponse.json({ task });
  } catch (error) {
    console.error('Get Task Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, status, priority, dueDate } = body;

    const task = await prisma.task.updateMany({
      where: {
        id: params.id,
        userId: user.id,
      },
      data: {
        ...(title && { title: title.trim() }),
        ...(description !== undefined && { description: description?.trim() }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      },
    });

    if (task.count === 0) {
      return NextResponse.json({ error: '任务不存在或无权限' }, { status: 404 });
    }

    // 返回更新后的任务
    const updatedTask = await prisma.task.findUnique({
      where: { id: params.id },
      include: { user: { select: { name: true, email: true } } },
    });

    return NextResponse.json({ task: updatedTask });
  } catch (error) {
    console.error('Update Task Error:', error);
    return NextResponse.json({ error: '更新任务失败' }, { status: 500 });
  }
}
```

### 🎨 Step 4: 前端页面开发 (5分钟)

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';

import { CreateTaskForm } from '@/components/CreateTaskForm';
import { TaskList } from '@/components/TaskList';
import { TaskStats } from '@/components/TaskStats';

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">任务仪表板</h1>
        <p className="text-gray-600 mt-2">管理您的任务和项目进度</p>
      </div>

      {/* 统计卡片 */}
      <Suspense fallback={<div>加载统计数据...</div>}>
        <TaskStats />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* 创建任务表单 */}
        <div className="lg:col-span-1">
          <CreateTaskForm />
        </div>

        {/* 任务列表 */}
        <div className="lg:col-span-2">
          <Suspense fallback={<div>加载任务列表...</div>}>
            <TaskList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
```

---

## 4. Prisma 数据库实践 (15分钟)

### 🗄️ 为什么选择 Prisma？

#### **传统 ORM vs Prisma 对比**

```tsx
// ❌ 传统 ORM (如 TypeORM)
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @OneToMany(() => Task, task => task.user)
  tasks: Task[];
}

// 查询代码
const user = await userRepository.findOne({
  where: { id: userId },
  relations: ['tasks']
});

// ✅ Prisma：类型安全 + 直观查询
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: { tasks: true } // 自动类型推导
});
```

### 🔧 Prisma 核心功能

#### **1. 类型安全的查询**

```tsx
// lib/database.ts
import { prisma } from './prisma';

export class TaskService {
  // 创建任务
  static async createTask(data: {
    title: string;
    description?: string;
    userId: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  }) {
    return await prisma.task.create({
      data,
      include: { user: { select: { name: true, email: true } } },
    });
  }

  // 复杂查询：获取用户的任务统计
  static async getUserTaskStats(userId: string) {
    const stats = await prisma.task.groupBy({
      by: ['status'],
      where: { userId },
      _count: { id: true },
    });

    const totalTasks = await prisma.task.count({
      where: { userId },
    });

    const completedTasks = stats.find(s => s.status === 'COMPLETED')?._count.id || 0;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return {
      total: totalTasks,
      completed: completedTasks,
      completionRate: Math.round(completionRate),
      byStatus: stats.reduce(
        (acc, stat) => {
          acc[stat.status] = stat._count.id;
          return acc;
        },
        {} as Record<string, number>
      ),
    };
  }

  // 高级查询：任务搜索和过滤
  static async searchTasks(params: {
    userId: string;
    search?: string;
    status?: string;
    priority?: string;
    page?: number;
    limit?: number;
  }) {
    const { userId, search, status, priority, page = 1, limit = 10 } = params;

    const where: any = { userId };

    // 搜索条件
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) where.status = status;
    if (priority) where.priority = priority;

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
        include: { user: { select: { name: true, email: true } } },
      }),
      prisma.task.count({ where }),
    ]);

    return {
      tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}
```

#### **2. 数据库迁移和同步**

```bash
# 开发环境操作流程
npx prisma db push          # 快速同步 schema 到数据库
npx prisma generate         # 生成 Prisma Client
npx prisma studio          # 打开数据库可视化工具

# 生产环境操作流程
npx prisma migrate dev --name add_task_priority  # 创建迁移文件
npx prisma migrate deploy                        # 部署到生产环境
```

#### **3. 性能优化最佳实践**

```tsx
// ✅ 使用 select 优化查询
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    // 不查询密码等敏感字段
  },
});

// ✅ 使用 include 避免 N+1 查询
const tasksWithUsers = await prisma.task.findMany({
  include: {
    user: { select: { name: true, email: true } },
  },
});

// ✅ 使用事务保证数据一致性
await prisma.$transaction(async tx => {
  const task = await tx.task.create({
    data: { title: '新任务', userId: '123' },
  });

  await tx.user.update({
    where: { id: '123' },
    data: {
      tasksCount: { increment: 1 },
    },
  });
});

// ✅ 使用连接池优化
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // 连接池配置
  __internal: {
    engine: {
      connection_limit: 10,
    },
  },
});
```

---

## 5. JWT 身份认证方案 (10分钟)

### 🔐 企业级认证架构

#### **JWT 认证流程**

```
用户登录 → 验证密码 → 生成 JWT → 返回 Token
    ↓
客户端存储 Token → 请求时携带 → 服务端验证 → 返回数据
```

#### **完整认证系统实现**

```tsx
// lib/auth.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { NextRequest } from 'next/server';

import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
}

export class AuthService {
  // 生成 JWT Token
  static generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'task-manager',
      audience: 'task-manager-users',
    });
  }

  // 验证 JWT Token
  static verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  // 密码加密
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  // 密码验证
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // 用户注册
  static async register(data: { name: string; email: string; password: string }) {
    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('邮箱已被注册');
    }

    // 密码加密
    const hashedPassword = await this.hashPassword(data.password);

    // 创建用户
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    // 生成 Token
    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    return { user, token };
  }

  // 用户登录
  static async login(email: string, password: string) {
    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('邮箱或密码错误');
    }

    // 验证密码
    const isValidPassword = await this.verifyPassword(password, user.password);
    if (!isValidPassword) {
      throw new Error('邮箱或密码错误');
    }

    // 生成 Token
    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  }
}

// 中间件：验证请求中的 Token
export async function verifyToken(request: NextRequest): Promise<JWTPayload | null> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.slice(7);
    return AuthService.verifyToken(token);
  } catch (error) {
    console.error('Auth middleware error:', error);
    return null;
  }
}
```

#### **登录 API 实现**

```tsx
// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { AuthService } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 输入验证
    if (!email || !password) {
      return NextResponse.json({ error: '邮箱和密码不能为空' }, { status: 400 });
    }

    // 登录验证
    const result = await AuthService.login(email, password);

    // 设置 HTTP-only Cookie (更安全的方式)
    const response = NextResponse.json(
      {
        message: '登录成功',
        user: result.user,
      },
      { status: 200 }
    );

    response.cookies.set('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '登录失败' },
      { status: 401 }
    );
  }
}
```

#### **前端认证状态管理**

```tsx
// hooks/useAuth.ts
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// hooks/useAuth.ts

// hooks/useAuth.ts

// hooks/useAuth.ts

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 检查用户登录状态
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '登录失败');
    }

    const data = await response.json();
    setUser(data.user);
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

---

## 6. 部署到 Vercel (5分钟)

### 🚀 一键部署流程

#### **部署准备清单**

```bash
# 1. 环境变量配置
# .env.local (本地开发)
DATABASE_URL="postgresql://user:password@localhost:5432/taskmanager"
JWT_SECRET="your-super-secret-jwt-key"
NEXTAUTH_URL="http://localhost:3000"

# 2. 数据库准备 (推荐 Neon/PlanetScale)
# 生产环境数据库连接字符串
DATABASE_URL="postgresql://user:password@host:5432/prod_db"

# 3. 构建测试
npm run build
npm run start
```

#### **Vercel 部署配置**

```json
// vercel.json
{
  "buildCommand": "prisma generate && next build",
  "framework": "nextjs",
  "regions": ["hkg1"],
  "env": {
    "DATABASE_URL": "@database-url",
    "JWT_SECRET": "@jwt-secret"
  },
  "build": {
    "env": {
      "PRISMA_GENERATE_DATAPROXY": "true"
    }
  }
}
```

#### **自动化部署流程**

```bash
# 1. 推送代码到 GitHub
git add .
git commit -m "feat: 完成任务管理系统"
git push origin main

# 2. Vercel 自动检测并部署
# - 自动安装依赖
# - 运行 Prisma generate
# - 构建 Next.js 应用
# - 部署到全球 CDN

# 3. 数据库迁移 (生产环境)
npx prisma migrate deploy

# 4. 验证部署
curl https://your-app.vercel.app/api/health
```

#### **生产环境监控**

```tsx
// app/api/health/route.ts
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 检查数据库连接
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      version: process.env.npm_package_version || '1.0.0',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Database connection failed',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
```

### 📊 性能优化建议

```tsx
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 生产环境优化
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },

  // 图片优化域名
  images: {
    domains: ['your-cdn-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },

  // 输出配置
  output: 'standalone',

  // 压缩配置
  compress: true,

  // 安全头部
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

---

## 🎉 总结与展望

### ✅ 今天我们完成了什么

1. **理解了 Next.js 的企业价值** - SEO、性能、开发效率
2. **掌握了核心模块** - App Router、Server/Client Components、内置优化
3. **构建了完整应用** - 任务管理系统，包含完整的CRUD功能
4. **学会了 Prisma** - 类型安全的数据库操作和高级查询
5. **实现了 JWT 认证** - 企业级安全方案
6. **完成了生产部署** - Vercel 一键部署和监控

### 🚀 技术栈的业务价值

| 技术            | 业务价值              | 具体收益                         |
| --------------- | --------------------- | -------------------------------- |
| **Next.js 15**  | 性能 + SEO + 开发效率 | 首屏加载提升60%，开发效率提升40% |
| **Prisma**      | 类型安全 + 开发体验   | 减少90%的数据库相关Bug           |
| **JWT 认证**    | 安全性 + 可扩展性     | 支持微服务架构，安全可控         |
| **Vercel 部署** | 运维简化 + 全球CDN    | 部署时间从小时级降到分钟级       |

### 📈 后续学习路径

```
立即可用 (本周)
├── 在新项目中应用 Next.js
├── 使用 Prisma 重构现有数据层
└── 部署一个演示项目到 Vercel

深入学习 (本月)
├── 学习更多 Prisma 高级特性
├── 掌握 Next.js 性能优化技巧
└── 了解微服务架构设计

团队推广 (下个月)
├── 在团队内分享技术方案
├── 制定技术栈迁移计划
└── 建立最佳实践文档
```

### 💬 问答环节

**常见问题准备**：

- Q: 现有项目如何渐进式迁移到 Next.js？
- Q: Prisma 与现有 ORM 的性能对比？
- Q: JWT 认证在微服务架构中的最佳实践？
- Q: Vercel 的成本和替代方案？

---

**🔗 相关资源**

- [项目源码](https://github.com/your-org/task-manager)
- [部署演示](https://task-manager-demo.vercel.app)
- [技术文档](https://docs.your-company.com/nextjs-guide)
- [团队讨论群](https://your-chat-platform.com/nextjs-tech)

_这次分享展示了如何使用现代技术栈快速构建企业级应用，从概念到部署的完整流程，为团队技术升级提供了清晰的路径。_
