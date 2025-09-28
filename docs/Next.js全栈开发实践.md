## Next.js全栈技术分享

---

## 📋 大纲

### 🎯 项目技术架构 (涵盖前端、后端、数据库、云服务完整解决方案)

- **前端**: Next.js 15 + React 19 + TypeScript + Tailwind CSS + Ant Design
- **状态管理**: Zustand
- **数据层**: Prisma + Neon 云数据库 + Upstash Redis
- **文件存储**: 阿里云 OSS
- **认证**: JWT + bcrypt
- **构建工具**: Turbopack
- **其他**: Resend邮件, RabbitMQ

---

## 1. 项目概览与技术选型

### 本次演示

- 🔗 **GitHub**: [durunsong/next15-tutorial](https://github.com/durunsong/next15-tutorial)
- 🌐 **在线预览**: [next15-tutorial-green.vercel.app](https://next15-tutorial-green.vercel.app/)

### 🏗️ 整体架构设计(demo)

```
next15-tutorial/
├── 前端层 (9个技术)
│   ├── Next.js 15 + React 19 + TypeScript
│   ├── Tailwind CSS + Ant Design UI
│   ├── Lucide Icons + Framer Motion
│   └── Monaco Editor 代码编辑器
├── 状态管理层 (1个技术)
│   └── Zustand 轻量级状态管理
├── 后端层 (3个技术)
│   ├── Next.js API Routes
│   ├── JWT 认证 + bcryptjs 加密
│   └── Server Components
├── 数据存储层 (2个技术)
│   ├── Prisma ORM + Neon 云数据库
│   └── Upstash Redis 缓存
├── 云服务层 (2个技术)
│   ├── 阿里云 OSS 文件存储
│   └── Vercel 部署平台
└── 工具层 (1个技术)
    └── Turbopack 构建工具
```

### 🛠️ 技术栈详解

#### 前端技术栈

| 技术             | 版本    | 核心价值                                 |
| ---------------- | ------- | ---------------------------------------- |
| **Next.js 15**   | v15.3.3 | 全栈框架，支持SSR/SSG和Server Components |
| **React 19**     | v19.0.0 | 声明式UI库，Concurrent Features支持      |
| **TypeScript**   | v5.x    | 类型安全，智能提示，重构支持             |
| **Tailwind CSS** | v4.x    | 实用优先CSS框架，快速构建界面            |
| **Ant Design**   | v5.26.1 | 企业级UI组件库，丰富组件生态             |

#### 后端与数据

| 技术              | 版本    | 核心价值                       |
| ----------------- | ------- | ------------------------------ |
| **Prisma ORM**    | v6.9.0  | 类型安全的数据库操作，自动迁移 |
| **Upstash Redis** | v1.35.0 | Serverless Redis，边缘缓存     |
| **JWT**           | v16.8.x | 无状态认证，跨域支持           |
| **bcryptjs**      | v3.0.2  | 密码哈希加密，安全防护         |
| **阿里云 OSS**    | v6.23.0 | 对象存储，文件CDN加速          |

#### 开发工具

| 技术           | 版本    | 核心价值                 |
| -------------- | ------- | ------------------------ |
| **GraphQL**    | v16.8.x | API查询语言，类型安全    |
| **Serverless** | v3.38.x | 无服务器计算，按需扩展   |
| **Turbopack**  | 内置    | 高性能构建工具，开发体验 |

### 💡技术选型与业务价值对比

| 场景         | 传统方案Vue/React | Next.js 15 方案         | 业务价值              | 技术选型维度 | 实际收益                              |
| ------------ | ----------------- | ----------------------- | --------------------- | ------------ | ------------------------------------- |
| 商品详情页   | CSR + Loading     | SSR                     | SEO收录 + 转化率提升  | 用户体验     | 首屏加载提升70%，交互更顺畅           |
| 文档中心     | SPA路由           | SSG                     | 加载速度 + 用户体验   | 开发效率     | Next.js + TS + Tailwind → 效率+60%    |
| 个人中心     | CSR               | CSR                     | 高度交互体验          | 团队协作     | TS + 统一工具链 → Bug减少90%          |
| 新闻列表     | CSR               | ISR                     | 内容新鲜度 + 性能优化 | 性能优化     | Redis缓存 + CDN + 代码分割 → 响应+75% |
| **全局层面** | —                 | Neon + Upstash + Vercel | 运维自动化 + 成本降低 | 运维成本     | 成本降低80%，支持自动扩缩容           |

### 开始 gogogo~

#### 创建Nextjs项目

```typescript
node  -v
// 原始创建方式
npx create-next-app@latest
// pnpm 方式  or  其他
pnpm dlx create-next-app@latest

// 一步到位方式 npx/pnpm/.....
npx create-next-app@latest xxxxx --typescript --tailwind --eslint --app --src-dir --turbopack --import-alias "@/*"  --use-pnpm

// 注释代码
layout.tsx -- geistSans/geistMono  相关的代码
注释代码原因：因为如果我们网络在国内，这些字体来自于google，我们在国内的网络环境访问google将会受限，所有注释
```

### 📦 package.json 关键依赖分析

```json
{
  "dependencies": {
    "next": "^15.5.3", // 最新稳定版本
    "react": "^19.1.1", // 最新React版本
    "prisma": "^6.16.0", // ORM框架
    "@prisma/client": "^6.16.0", // Prisma客户端
    "zustand": "^5.0.8", // 状态管理
    "antd": "^5.27.3", // UI组件库
    "@upstash/redis": "^1.35.3", // Redis客户端
    "ali-oss": "^6.23.0", // 阿里云OSS SDK
    "bcryptjs": "^3.0.2", // 密码加密
    "jsonwebtoken": "^9.0.2" // JWT认证
  }
}
```

### 🚀 开发工作流脚本

```bash
# 开发相关
pnpm dev              # 启动开发服务器 (Turbopack)
pnpm build            # 生产构建
pnpm code-quality     # 代码质量检查

// pnpm start 与 pnpm dev
pnpm start 构建测试  --需要在build之后运行    ---- 修改代码页面不变
pnpm dev  ---- 修改代码页面变

# 数据库相关
pnpm db:generate      # 生成Prisma客户端
pnpm db:push          # 快速同步 schema 到数据库
pnpm db:studio        # 打开数据库可视化

# 生产环境操作流程
npx prisma migrate dev --name add_task_priority  # 创建迁移文件
npx prisma migrate deploy                        # 部署到生产环境

# 代码质量流水线
pnpm commit-ready     # 提交前检查
pnpm push-ready       # 推送前检查
```

---

## 2. Next.js 15 核心应用

### 文件系统路由

文件地址映射浏览器访问地址
静态路由/动态路由[id]

### Client Component 和 Server Component

#### 🔍 基本概念和工作原理

**Server Component (服务器组件)**

- 在服务器端渲染，HTML直接发送到浏览器
- 不包含客户端JavaScript逻辑
- 可以直接访问数据库、文件系统等服务器资源
- 默认所有组件都是Server Component

**Client Component (客户端组件)**

- 需要显式声明 `'use client';`
- 在浏览器中渲染和交互
- 可以使用React Hooks (useState, useEffect等)
- 可以访问浏览器API (window, document等)

### 🚀 SSR性能优势流程图

#### 📊 传统CSR vs Next.js SSR 性能对比流程

```mermaid
graph TD
    subgraph "传统CSR流程"
        A1[用户访问页面] --> B1[下载HTML空壳]
        B1 --> C1[下载JS Bundle 2MB+]
        C1 --> D1[执行JavaScript]
        D1 --> E1[发起API请求]
        E1 --> F1[等待数据返回]
        F1 --> G1[渲染页面内容]
        G1 --> H1[用户看到内容 3-5秒]
    end

    subgraph "Next.js SSR流程"
        A2[用户访问页面] --> B2[服务器预渲染]
        B2 --> C2[数据库查询]
        C2 --> D2[生成完整HTML]
        D2 --> E2[返回带内容的HTML]
        E2 --> F2[用户立即看到内容 200-500ms]
        F2 --> G2[下载JS进行水合]
        G2 --> H2[页面变为可交互]
    end

    style H1 fill:#ffcccc
    style F2 fill:#ccffcc
```

#### **SSR 相比 CSR，少了什么**

- ❌ **CSR 需要客户端执行 React 组件逻辑 → SSR 不需要**
  - 组件渲染逻辑在服务端完成，客户端直接拿 HTML。
- ❌ **CSR 首屏需要等 JS 加载和执行 → SSR 不需要**
  - 用户第一眼就能看到页面，而不是空白页。
- ❌ **CSR 完全依赖客户端拿数据 → SSR 不需要**
  - SSR 可以直接在服务端获取数据并注入到 HTML。

### 总结

**CSR**：首屏全靠浏览器算 → 空白时间长

**SSR**：首屏由服务器算 → 用户直接看到内容，省掉了“客户端渲染首屏”的步骤

#### ⚡ SSR性能优势详解

```mermaid
sequenceDiagram
    participant User as 👤 用户
    participant CDN as 🌐 CDN
    participant Server as 🖥️ 服务器
    participant DB as 🗄️ 数据库
    participant Redis as 💾 Redis缓存

    Note over User,Redis: SSR请求流程 (200-500ms)

    User->>CDN: 访问页面
    CDN->>Server: 转发请求 (如果未缓存)

    alt 缓存命中
        Server->>Redis: 检查页面缓存
        Redis->>Server: 返回缓存的HTML
    else 缓存未命中
        Server->>DB: 查询数据
        DB->>Server: 返回数据
        Server->>Server: 渲染React组件为HTML
        Server->>Redis: 缓存生成的HTML
    end

    Server->>CDN: 返回完整HTML
    CDN->>User: 用户立即看到内容

    Note over User: 首屏内容已显示 ✅

    User->>CDN: 下载JS Bundle (异步)
    CDN->>User: 返回优化后的JS

    Note over User: 页面变为可交互 ✅
```

### SSR&SSG 情景demo

1. **SSR 场景**

   ```
   "你是一个电商网站的开发者，用户搜索'iPhone 15'，
   你希望搜索引擎能够抓取到最新的商品信息和价格，
   这时候你需要 SSR"
   ```

2. **SSG 场景**

   ```
   "你在写技术博客，文章内容几乎不变，
   但是访问量很大，你希望加载速度极快，
   这时候你需要 SSG"
   ```

#### 💡 为什么SSR比CSR快？核心原理

| 对比维度       | 传统CSR                 | Next.js SSR         | 性能提升          |
| -------------- | ----------------------- | ------------------- | ----------------- |
| **首屏内容**   | 需要下载+执行JS后才显示 | HTML中已包含内容    | **提升70%**       |
| **SEO抓取**    | 爬虫看到空HTML          | 爬虫看到完整内容    | **提升100%**      |
| **网络请求**   | HTML → JS → API → 渲染  | HTML(含数据) → 显示 | **减少2-3个RTT**  |
| **Bundle大小** | 一次性下载全部JS        | 按需分割加载        | **减少60%**       |
| **缓存策略**   | 客户端缓存              | 服务器+CDN缓存      | **命中率提升80%** |

#### 📝 渲染模式对比

| 特性           | Server Component | Client Component |
| -------------- | ---------------- | ---------------- |
| 渲染位置       | 服务器           | 浏览器           |
| 交互性         | 无               | 有               |
| Hooks支持      | ❌               | ✅               |
| 浏览器API      | ❌               | ✅               |
| 服务器资源访问 | ✅               | ❌               |
| Bundle大小     | 0                | 计入bundle       |
| 首屏速度       | 快               | 相对慢           |

### 对比起来，**Server Component 跳过了**：

- ❌ **无需在客户端下载 JS（逻辑不会下发）**
- ❌ **无需在客户端解析 & 执行 JS**
- ❌ **无需在客户端生成虚拟 DOM**
- ❌ **无需在客户端做 Diff (Reconciliation)**
- ✅ 只保留 **最终 UI 结果**，传给客户端

### hooks

只能在client component中使用，如：useState....

案例：useParams

### ⚡ App Router + Server Components

#### **项目路由结构**

```
src/app/
├── layout.tsx                 # 全局布局
├── page.tsx                   # 首页
├── about/page.tsx             # 关于页面
├── auth/                      # 认证模块
│   ├── login/
│   │   ├── layout.tsx         # 登录布局
│   │   └── page.tsx           # 登录页面
│   └── register/
│       ├── layout.tsx
│       └── page.tsx
├── blog/                      # 博客模块
│   ├── layout.tsx             # 博客布局
│   ├── page.tsx               # 博客列表
│   └── [id]/
│       ├── layout.tsx
│       └── page.tsx           # 博客详情
├── profile/                   # 用户中心
│   ├── layout.tsx
│   └── page.tsx
├── users/                     # 用户管理
│   ├── page.tsx               # 用户列表
│   └── [id]/
│       └── page.tsx           # 用户详情
└── api/                       # API路由
    ├── auth/
    ├── users/
    ├── posts/
    └── upload/
```

#### **实际应用案例：博客系统**

```tsx
// app/blog/page.tsx - 博客列表 (Server Component)
import { BlogCard } from '@/components/BlogCard';
import { prisma } from '@/lib/prisma';

// app/blog/layout.tsx - 博客模块布局
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="flex gap-8">
          {/* 侧边栏 */}
          <aside className="w-64">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">分类</h2>
              <nav className="space-y-2">
                <a href="/blog?category=tech" className="block text-gray-600 hover:text-blue-600">
                  技术文章
                </a>
                <a href="/blog?category=life" className="block text-gray-600 hover:text-blue-600">
                  生活随笔
                </a>
              </nav>
            </div>
          </aside>

          {/* 主内容区域 */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string; page?: string };
}) {
  const page = parseInt(searchParams.page || '1');
  const category = searchParams.category;

  // 服务端直接查询数据库
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: {
        published: true,
        ...(category && { category: { name: category } }),
      },
      include: {
        author: { select: { name: true, avatar: true } },
        category: { select: { name: true, slug: true } },
        _count: { select: { comments: true, likes: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * 10,
      take: 10,
    }),
    prisma.post.count({
      where: {
        published: true,
        ...(category && { category: { name: category } }),
      },
    }),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {category ? `${category} 相关文章` : '全部文章'}
        </h1>
        <p className="text-gray-600 mt-2">共 {total} 篇文章</p>
      </div>

      {/* 文章列表 */}
      <div className="space-y-6">
        {posts.map(post => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      {/* 分页 */}
      {total > 10 && (
        <div className="mt-8 flex justify-center">
          <Pagination current={page} total={total} pageSize={10} showSizeChanger={false} />
        </div>
      )}
    </div>
  );
}

// app/blog/[id]/page.tsx - 文章详情 (Server Component)
export default async function BlogDetailPage({ params }: { params: { id: string } }) {
  // 服务端获取文章数据
  const post = await prisma.post.findUnique({
    where: { id: params.id, published: true },
    include: {
      author: true,
      category: true,
      tags: true,
      comments: {
        include: { author: { select: { name: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!post) {
    return <div>文章不存在</div>;
  }

  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <img
                src={post.author.avatar || '/default-avatar.png'}
                alt={post.author.name}
                className="w-6 h-6 rounded-full"
              />
              <span>{post.author.name}</span>
            </div>
            <span>•</span>
            <time>{new Date(post.createdAt).toLocaleDateString()}</time>
            <span>•</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {post.category.name}
            </span>
          </div>
        </header>

        {/* 文章内容 */}
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

        {/* 标签 */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span
                key={tag.id}
                className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 评论区域 (Client Component) */}
      <div className="border-t bg-gray-50 p-8">
        <CommentSection postId={post.id} comments={post.comments} />
      </div>
    </article>
  );
}
```

### 🎯 Turbopack 构建优化

```javascript
// next.config.ts
const nextConfig = {
  // 启用 Turbopack
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  // 图片优化配置
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-oss-domain.com',
      },
    ],
  },

  // 输出配置
  output: 'standalone',
};

export default nextConfig;
```

**Turbopack 性能提升**:

- 开发服务器启动速度提升 **10倍**
- 热更新速度提升 **5倍**
- 大型项目构建时间减少 **60%**

---

## 3. Prisma + Neon 数据层设计

### 👉Serverless

**开发者只关注业务逻辑代码，不需要关心服务器的运维管理（比如买机器、装系统、扩容、监控等）。**
服务器依然存在，只是被云厂商（AWS、阿里云、腾讯云、Vercel 等）屏蔽和托管了

#### 📌 Next.js + Serverless 的常见玩法

1. **API Routes 部署到 Serverless Functions**
   - 例如部署到 **Vercel**，每个 API 路由就是一个 Serverless Function。
2. **Serverless 数据库**
   - 比如 Neon（Postgres）、PlanetScale（MySQL）、DynamoDB。
3. **无服务器任务**
   - 上传文件用云存储（S3、OSS、COS），处理任务交给 Serverless Function。

- **Upstash Redis - Serverless Redis**

- **Neon 数据库 - Serverless PostgreSQL**

### 🗄️ 数据库架构设计

#### **Prisma Schema 实际应用**

!!! 点赞模型 案例

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 用户模型
model User {
  id            String   @id @default(cuid())
  username      String   @unique
  email         String?  @unique
  phone         String?  @unique
  passwordHash  String   @map("password_hash")
  avatar        String?  @map("avatar_url")
  role          Role     @default(USER)

  // 认证相关
  isVerified    Boolean  @default(false) @map("is_verified")
  isActive      Boolean  @default(true) @map("is_active")
  isDeleted     Boolean  @default(false) @map("is_deleted")

  // 登录统计
  loginCount    Int      @default(0) @map("login_count")
  lastLoginAt   DateTime? @map("last_login_at")
  lastLoginIp   String?  @map("last_login_ip")

  // 关联关系
  posts         Post[]
  comments      Comment[]
  likes         Like[]

  // 时间戳
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  @@map("users")
}

// 文章模型
model Post {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  content     String
  excerpt     String?
  coverImage  String?  @map("cover_image")

  // 状态管理
  published   Boolean  @default(false)
  featured    Boolean  @default(false)

  // 统计数据
  viewCount   Int      @default(0) @map("view_count")
  likeCount   Int      @default(0) @map("like_count")

  // 关联关系
  authorId    String   @map("author_id")
  author      User     @relation(fields: [authorId], references: [id])
  categoryId  String   @map("category_id")
  category    Category @relation(fields: [categoryId], references: [id])

  comments    Comment[]
  likes       Like[]
  postTags    PostTag[]

  // 时间戳
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("posts")
}

// 分类模型
model Category {
  id          String @id @default(cuid())
  name        String @unique
  slug        String @unique
  description String?
  color       String @default("#3B82F6")

  posts       Post[]

  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("categories")
}

// 评论模型
model Comment {
  id        String   @id @default(cuid())
  content   String

  // 关联关系
  postId    String   @map("post_id")
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  authorId  String   @map("author_id")
  author    User     @relation(fields: [authorId], references: [id])

  // 回复功能
  parentId  String?  @map("parent_id")
  parent    Comment? @relation("CommentReplies", fields: [parentId], references: [id])
  replies   Comment[] @relation("CommentReplies")

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("comments")
}

// 点赞模型
model Like {
  id       String @id @default(cuid())
  userId   String @map("user_id")
  user     User   @relation(fields: [userId], references: [id])
  postId   String @map("post_id")
  post     Post   @relation(fields: [postId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now()) @map("created_at")

  @@unique([userId, postId])
  @@map("likes")
}

// 标签模型
model Tag {
  id       String    @id @default(cuid())
  name     String    @unique
  slug     String    @unique
  color    String    @default("#6B7280")

  postTags PostTag[]

  createdAt DateTime @default(now()) @map("created_at")

  @@map("tags")
}

// 文章标签关联
model PostTag {
  postId String @map("post_id")
  post   Post   @relation(fields: [postId], references: [id], onDelete: Cascade)
  tagId  String @map("tag_id")
  tag    Tag    @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([postId, tagId])
  @@map("post_tags")
}

enum Role {
  USER
  ADMIN
}
```

### 🔧 Prisma 服务层封装

```typescript
// src/services/userService.ts
import bcrypt from 'bcryptjs';

import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';

export class UserService {
  // 创建用户
  static async createUser(data: { username: string; email?: string; password: string }) {
    const passwordHash = await bcrypt.hash(data.password, 12);

    return await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        passwordHash,
      },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
    });
  }

  // 获取用户（带缓存）
  static async getUserById(id: string) {
    const cacheKey = `user:${id}`;

    // 先查缓存
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log('Cache hit:', cacheKey);
      return cached;
    }

    // 查询数据库
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        role: true,
        isVerified: true,
        loginCount: true,
        lastLoginAt: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            comments: true,
            likes: true,
          },
        },
      },
    });

    if (user) {
      // 缓存5分钟
      await redis.set(cacheKey, user, { ex: 300 });
    }

    return user;
  }

  // 用户认证
  static async authenticateUser(username: string, password: string) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email: username }],
        isActive: true,
        isDeleted: false,
      },
    });

    if (!user) {
      throw new Error('用户不存在');
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('密码错误');
    }

    // 更新登录信息
    await this.updateLoginInfo(user.id);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }

  // 更新登录信息
  static async updateLoginInfo(userId: string, loginIp?: string) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        loginCount: { increment: 1 },
        lastLoginAt: new Date(),
        lastLoginIp: loginIp,
      },
    });

    // 清除用户缓存
    await redis.del(`user:${userId}`);
  }

  // 获取用户统计
  static async getUserStats(userId: string) {
    const stats = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        _count: {
          select: {
            posts: { where: { published: true } },
            comments: true,
            likes: true,
          },
        },
      },
    });

    return stats?._count || { posts: 0, comments: 0, likes: 0 };
  }
}

// src/services/postService.ts
export class PostService {
  // 创建文章
  static async createPost(data: {
    title: string;
    content: string;
    excerpt?: string;
    authorId: string;
    categoryId: string;
    tagIds?: string[];
  }) {
    return await prisma.$transaction(async tx => {
      // 生成slug
      const slug = await this.generateUniqueSlug(data.title, tx);

      // 创建文章
      const post = await tx.post.create({
        data: {
          title: data.title,
          slug,
          content: data.content,
          excerpt: data.excerpt,
          authorId: data.authorId,
          categoryId: data.categoryId,
        },
        include: {
          author: { select: { name: true, avatar: true } },
          category: true,
        },
      });

      // 关联标签
      if (data.tagIds && data.tagIds.length > 0) {
        await tx.postTag.createMany({
          data: data.tagIds.map(tagId => ({
            postId: post.id,
            tagId,
          })),
        });
      }

      return post;
    });
  }

  // 获取文章列表（支持筛选和分页）
  static async getPosts(params: {
    page?: number;
    limit?: number;
    categoryId?: string;
    tagId?: string;
    authorId?: string;
    published?: boolean;
    featured?: boolean;
  }) {
    const {
      page = 1,
      limit = 10,
      categoryId,
      tagId,
      authorId,
      published = true,
      featured,
    } = params;

    const where: any = { published };
    if (categoryId) where.categoryId = categoryId;
    if (authorId) where.authorId = authorId;
    if (featured !== undefined) where.featured = featured;
    if (tagId) {
      where.postTags = {
        some: { tagId },
      };
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: { select: { username: true, avatar: true } },
          category: { select: { name: true, slug: true, color: true } },
          postTags: {
            include: { tag: { select: { name: true, slug: true, color: true } } },
          },
          _count: {
            select: { comments: true, likes: true },
          },
        },
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return {
      posts: posts.map(post => ({
        ...post,
        tags: post.postTags.map(pt => pt.tag),
        stats: post._count,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // 生成唯一slug
  private static async generateUniqueSlug(title: string, tx: any) {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-|-$/g, '');

    let slug = baseSlug;
    let counter = 1;

    while (await tx.post.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }
}
```

### 📊 Neon 云数据库优势

```typescript
// .env 配置
DATABASE_URL = 'postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require';
```

**Neon 特性**:

- ✅ **Serverless**: 按需付费，自动休眠
- ✅ **分支功能**: 类似Git，支持数据库分支
- ✅ **读写分离**: 自动读写分离，性能优化
- ✅ **备份恢复**: 自动备份，秒级恢复
- ✅ **全球CDN**: 边缘计算，低延迟访问

**实际使用场景**:

```bash
# 开发环境数据库分支
neon branches create --name "feature/user-system"

# 生产环境分支
neon branches create --name "production"

# 数据库迁移
pnpm db:migrate    # 开发环境
pnpm db:migrate:prod    # 生产环境
```

---

## 4. Zustand 状态管理

### 🏪 状态架构设计

#### **认证状态管理**

```typescript
// src/store/authStore.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  role: 'USER' | 'ADMIN';
}

interface AuthState {
  // 状态
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // 方法
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  checkAuth: () => Promise<void>;
}

interface LoginCredentials {
  username: string;
  password: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      // 登录方法
      login: async credentials => {
        set({ isLoading: true });

        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
          });

          if (!response.ok) {
            throw new Error('登录失败');
          }

          const { user, token } = await response.json();

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          // 设置请求头
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', token);
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // 登出方法
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });

        // 清除本地存储
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
        }

        // 调用登出API
        fetch('/api/auth/logout', { method: 'POST' });
      },

      // 更新用户信息
      updateUser: userData => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },

      // 检查认证状态
      checkAuth: async () => {
        const token = get().token;
        if (!token) return;

        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const user = await response.json();
            set({ user, isAuthenticated: true });
          } else {
            // token无效，清除状态
            get().logout();
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // 只持久化必要的状态
      partialize: state => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

#### **应用全局状态**

```typescript
// src/store/appStore.ts
import { create } from 'zustand';

interface AppState {
  // UI状态
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  locale: 'zh' | 'en';

  // 全局数据
  categories: Category[];
  tags: Tag[];

  // 加载状态
  pageLoading: boolean;
  globalLoading: boolean;

  // 方法
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLocale: (locale: 'zh' | 'en') => void;
  setCategories: (categories: Category[]) => void;
  setTags: (tags: Tag[]) => void;
  setPageLoading: (loading: boolean) => void;
  setGlobalLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>(set => ({
  // 初始状态
  sidebarCollapsed: false,
  theme: 'light',
  locale: 'zh',
  categories: [],
  tags: [],
  pageLoading: false,
  globalLoading: false,

  // UI操作
  toggleSidebar: () =>
    set(state => ({
      sidebarCollapsed: !state.sidebarCollapsed,
    })),

  setTheme: theme => set({ theme }),

  setLocale: locale => set({ locale }),

  // 数据设置
  setCategories: categories => set({ categories }),

  setTags: tags => set({ tags }),

  // 加载状态
  setPageLoading: loading => set({ pageLoading: loading }),

  setGlobalLoading: loading => set({ globalLoading: loading }),
}));
```

#### **数据缓存状态**

```typescript
// src/store/dataStore.ts
import { create } from 'zustand';

interface CachedData<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

interface DataState {
  // 缓存数据
  cache: Map<string, CachedData<any>>;

  // 方法
  setCache: <T>(key: string, data: T, ttl?: number) => void;
  getCache: <T>(key: string) => T | null;
  clearCache: (key?: string) => void;
  isExpired: (key: string) => boolean;
}

export const useDataStore = create<DataState>((set, get) => ({
  cache: new Map(),

  // 设置缓存
  setCache: (key, data, ttl = 300) => {
    // 默认5分钟
    const timestamp = Date.now();
    const expiry = timestamp + ttl * 1000;

    set(state => {
      const newCache = new Map(state.cache);
      newCache.set(key, { data, timestamp, expiry });
      return { cache: newCache };
    });
  },

  // 获取缓存
  getCache: key => {
    const cached = get().cache.get(key);

    if (!cached) return null;

    if (Date.now() > cached.expiry) {
      // 过期，清除缓存
      get().clearCache(key);
      return null;
    }

    return cached.data;
  },

  // 清除缓存
  clearCache: key => {
    set(state => {
      const newCache = new Map(state.cache);
      if (key) {
        newCache.delete(key);
      } else {
        newCache.clear();
      }
      return { cache: newCache };
    });
  },

  // 检查是否过期
  isExpired: key => {
    const cached = get().cache.get(key);
    return cached ? Date.now() > cached.expiry : true;
  },
}));
```

### 🎯 组件中使用 Zustand

```tsx
// components/Header.tsx
'use client';

import { useAuthStore } from '@/store/authStore';
import { useAppStore } from '@/store/appStore';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* 左侧 */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500"
            >
              {sidebarCollapsed ? '☰' : '✕'}
            </button>
          </div>

          {/* 右侧用户菜单 */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <img
                  src={user?.avatar || '/default-avatar.png'}
                  alt={user?.username}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-900">
                  {user?.username}
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  退出
                </button>
              </div>
            ) : (
              <a
                href="/auth/login"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                登录
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// hooks/useAuth.ts - 自定义Hook封装
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export function useAuth() {
  const authStore = useAuthStore();

  useEffect(() => {
    // 页面加载时检查认证状态
    authStore.checkAuth();
  }, []);

  return authStore;
}

// hooks/useCache.ts - 数据缓存Hook
import { useDataStore } from '@/store/dataStore';

export function useCache<T>(key: string, fetcher: () => Promise<T>, ttl = 300) {
  const { getCache, setCache } = useDataStore();

  const getCachedData = async (): Promise<T> => {
    const cached = getCache<T>(key);
    if (cached) return cached;

    const fresh = await fetcher();
    setCache(key, fresh, ttl);
    return fresh;
  };

  return { getCachedData };
}
```

### 💡 Zustand vs Redux 对比

| 特性           | Zustand        | Redux Toolkit  |
| -------------- | -------------- | -------------- |
| 包大小         | 2.9KB          | 53.4KB         |
| 样板代码       | 极少           | 中等           |
| 学习成本       | 很低           | 中等           |
| TypeScript支持 | 原生支持       | 需要配置       |
| 中间件         | 内置常用中间件 | 丰富的生态     |
| 开发工具       | 简单调试       | Redux DevTools |

**选择Zustand的原因**:

- 🚀 **轻量级**: 仅2KB，不影响包体积
- 📝 **简单易用**: 无需繁琐的样板代码
- 🔧 **TypeScript友好**: 完美的类型推导
- 🔄 **灵活**: 支持多种使用模式

---

## 5. OSS 文件存储方案

### 📁 阿里云OSS集成架构

#### **OSS配置与初始化**

```typescript
// src/lib/oss.ts
import OSS from 'ali-oss';

// OSS配置
const ossConfig = {
  region: process.env.OSS_REGION!,
  accessKeyId: process.env.OSS_ACCESS_KEY_ID!,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET!,
  bucket: process.env.OSS_BUCKET!,
  endpoint: process.env.OSS_ENDPOINT,
};

// 创建OSS客户端
export const ossClient = new OSS(ossConfig);

// OSS工具类
export class OSSService {
  // 生成上传签名（前端直传）
  static async getUploadSignature(fileName: string, fileType: string) {
    const policy = {
      expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30分钟过期
      conditions: [
        ['content-length-range', 0, 10 * 1024 * 1024], // 最大10MB
        ['starts-with', '$key', 'uploads/'],
        ['eq', '$Content-Type', fileType],
      ],
    };

    const policyBase64 = Buffer.from(JSON.stringify(policy)).toString('base64');
    const signature = ossClient.signature(policyBase64);

    return {
      policy: policyBase64,
      signature,
      accessKeyId: ossConfig.accessKeyId,
      host: `https://${ossConfig.bucket}.${ossConfig.region}.aliyuncs.com`,
      key: `uploads/${Date.now()}-${fileName}`,
      expire: Date.now() + 30 * 60 * 1000,
    };
  }

  // 服务端文件上传
  static async uploadFile(
    file: Buffer,
    fileName: string,
    options?: {
      dir?: string;
      isPublic?: boolean;
    }
  ) {
    const { dir = 'uploads', isPublic = true } = options || {};
    const key = `${dir}/${Date.now()}-${fileName}`;

    try {
      const result = await ossClient.put(key, file, {
        headers: {
          'Content-Type': this.getContentType(fileName),
          'Cache-Control': 'max-age=31536000', // 1年缓存
        },
      });

      // 如果是公开文件，设置ACL
      if (isPublic) {
        await ossClient.putACL(key, 'public-read');
      }

      return {
        url: result.url,
        key: result.name,
        size: file.length,
      };
    } catch (error) {
      console.error('OSS upload failed:', error);
      throw new Error('文件上传失败');
    }
  }

  // 删除文件
  static async deleteFile(key: string) {
    try {
      await ossClient.delete(key);
      return true;
    } catch (error) {
      console.error('OSS delete failed:', error);
      return false;
    }
  }

  // 批量删除文件
  static async deleteFiles(keys: string[]) {
    try {
      const result = await ossClient.deleteMulti(keys);
      return result.deleted || [];
    } catch (error) {
      console.error('OSS batch delete failed:', error);
      return [];
    }
  }

  // 获取文件访问URL（私有文件）
  static async getSignedUrl(key: string, expires = 3600) {
    try {
      return ossClient.signatureUrl(key, { expires });
    } catch (error) {
      console.error('Get signed URL failed:', error);
      return null;
    }
  }

  // 获取文件信息
  static async getFileInfo(key: string) {
    try {
      const result = await ossClient.head(key);
      return {
        size: parseInt(result.res.headers['content-length'] || '0'),
        contentType: result.res.headers['content-type'],
        lastModified: result.res.headers['last-modified'],
        etag: result.res.headers.etag,
      };
    } catch (error) {
      console.error('Get file info failed:', error);
      return null;
    }
  }

  // 根据文件名获取Content-Type
  private static getContentType(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      txt: 'text/plain',
      zip: 'application/zip',
    };
    return mimeTypes[ext || ''] || 'application/octet-stream';
  }
}
```

#### **文件上传API接口**

```typescript
// app/api/upload/avatar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { OSSService } from '@/lib/oss';
import { getServerSession } from 'next-auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: '请选择文件' }, { status: 400 });
    }

    // 文件类型验证
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        error: '不支持的文件类型'
      }, { status: 400 });
    }

    // 文件大小验证（2MB）
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({
        error: '文件大小不能超过2MB'
      }, { status: 400 });
    }

    // 转换为Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // 上传到OSS
    const result = await OSSService.uploadFile(
      buffer,
      file.name,
      {
        dir: 'avatars',
        isPublic: true
      }
    );

    // 更新用户头像
    await prisma.user.update({
      where: { id: session.user.id },
      data: { avatar: result.url },
    });

    return NextResponse.json({
      message: '头像上传成功',
      data: {
        url: result.url,
        key: result.key,
        size: result.size,
      },
    });
  } catch (error) {
    console.error('Avatar upload failed:', error);
    return NextResponse.json(
      { error: '头像上传失败' },
      { status: 500 }
    );
  }
}

// app/api/upload/signature/route.ts - 获取前端直传签名
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fileName, fileType } = await request.json();

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: '缺少文件名或文件类型' },
        { status: 400 }
      );
    }

    const signature = await OSSService.getUploadSignature(fileName, fileType);

    return NextResponse.json({
      message: '签名获取成功',
      data: signature,
    });
  } catch (error) {
    console.error('Get upload signature failed:', error);
    return NextResponse.json(
      { error: '获取签名失败' },
      { status: 500 }
    );
  }
}
```

#### **前端文件上传组件**

```tsx
// components/FileUpload.tsx
'use client';

import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, message } from 'antd';

import { useState } from 'react';

// components/FileUpload.tsx

// components/FileUpload.tsx

// components/FileUpload.tsx

// components/FileUpload.tsx

interface FileUploadProps {
  onSuccess?: (fileInfo: { url: string; key: string }) => void;
  maxSize?: number; // MB
  accept?: string;
  multiple?: boolean;
}

export default function FileUpload({
  onSuccess,
  maxSize = 2,
  accept = 'image/*',
  multiple = false,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);

  // 前端直传OSS
  const handleUpload = async (file: File) => {
    try {
      setUploading(true);

      // 1. 获取上传签名
      const signatureRes = await fetch('/api/upload/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
        }),
      });

      if (!signatureRes.ok) throw new Error('获取签名失败');

      const { data: signature } = await signatureRes.json();

      // 2. 直传OSS
      const formData = new FormData();
      formData.append('key', signature.key);
      formData.append('policy', signature.policy);
      formData.append('signature', signature.signature);
      formData.append('OSSAccessKeyId', signature.accessKeyId);
      formData.append('Content-Type', file.type);
      formData.append('file', file);

      const uploadRes = await fetch(signature.host, {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('上传失败');

      const fileUrl = `${signature.host}/${signature.key}`;

      message.success('上传成功');
      onSuccess?.({ url: fileUrl, key: signature.key });
    } catch (error) {
      console.error('Upload failed:', error);
      message.error('上传失败');
    } finally {
      setUploading(false);
    }
  };

  // 文件验证
  const beforeUpload = (file: File) => {
    // 文件大小验证
    if (file.size > maxSize * 1024 * 1024) {
      message.error(`文件大小不能超过 ${maxSize}MB`);
      return false;
    }

    // 自动上传
    handleUpload(file);
    return false; // 阻止antd默认上传
  };

  return (
    <Upload beforeUpload={beforeUpload} showUploadList={false} multiple={multiple} accept={accept}>
      <Button icon={<UploadOutlined />} loading={uploading} disabled={uploading}>
        {uploading ? '上传中...' : '选择文件'}
      </Button>
    </Upload>
  );
}

// 头像上传组件
export function AvatarUpload({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const handleAvatarUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const { data } = await response.json();
        onChange?.(data.url);
        message.success('头像上传成功');
      } else {
        throw new Error('上传失败');
      }
    } catch (error) {
      message.error('头像上传失败');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="text-center">
      <div className="mb-4">
        <img
          src={value || '/default-avatar.png'}
          alt="头像"
          className="w-24 h-24 rounded-full mx-auto object-cover"
        />
      </div>
      <FileUpload onSuccess={fileInfo => onChange?.(fileInfo.url)} maxSize={2} accept="image/*" />
    </div>
  );
}
```

### 📊 OSS性能优化策略

```typescript
// utils/imageOptimizer.ts
export class ImageOptimizer {
  // 生成不同尺寸的图片URL
  static generateResponsiveUrls(originalUrl: string) {
    const baseUrl = originalUrl.split('?')[0];

    return {
      thumbnail: `${baseUrl}?x-oss-process=image/resize,w_150,h_150/quality,80`,
      small: `${baseUrl}?x-oss-process=image/resize,w_300,h_300/quality,85`,
      medium: `${baseUrl}?x-oss-process=image/resize,w_600,h_600/quality,90`,
      large: `${baseUrl}?x-oss-process=image/resize,w_1200,h_1200/quality,95`,
      original: originalUrl,
    };
  }

  // 生成WebP格式URL
  static generateWebPUrl(originalUrl: string, width?: number, height?: number) {
    let processParams = 'format,webp/quality,80';

    if (width || height) {
      const resizeParams = [];
      if (width) resizeParams.push(`w_${width}`);
      if (height) resizeParams.push(`h_${height}`);
      processParams = `resize,${resizeParams.join(',')}/` + processParams;
    }

    const baseUrl = originalUrl.split('?')[0];
    return `${baseUrl}?x-oss-process=image/${processParams}`;
  }
}

// components/OptimizedImage.tsx
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className
}: OptimizedImageProps) {
  const webpSrc = ImageOptimizer.generateWebPUrl(src, width, height);
  const fallbackSrc = width || height ?
    `${src}?x-oss-process=image/resize,w_${width},h_${height}/quality,90` :
    src;

  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img
        src={fallbackSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading="lazy"
      />
    </picture>
  );
}
```

**OSS成本优化**:

- 🗂️ **智能分层存储**: 自动转换为低频访问存储
- 🗜️ **图片压缩**: 自动WebP转换，减少70%流量
- 📱 **响应式图片**: 根据设备提供合适尺寸
- ♻️ **生命周期管理**: 自动清理过期文件

---

## 6. 开发工作流与部署

### 🔄 标准化开发流程

#### **代码质量保证**

```json
// package.json - 脚本配置
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "prisma generate && next build --turbopack",
    "code-quality": "pnpm lint && pnpm type-check && pnpm format:check",
    "commit-ready": "pnpm code-quality:fix && echo '✅ Ready to commit!'",
    "push-ready": "pnpm code-quality:check && pnpm build && echo '✅ Ready to push!'"
  }
}
```

```javascript
// eslint.config.mjs - ESLint配置
import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];

export default eslintConfig;
```

#### **Git Hooks配置**

```json
// .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm lint-staged
```

```json
// lint-staged配置
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css,scss,yaml,yml}": ["prettier --write"]
  }
}
```

### 🚀 部署策略

#### **环境变量管理**

```bash
# .env.local - 开发环境
DATABASE_URL="postgresql://user:pass@localhost:5432/dev_db"
REDIS_URL="redis://localhost:6379"
OSS_REGION="oss-cn-shanghai"
OSS_ACCESS_KEY_ID="your-access-key-id"
OSS_ACCESS_KEY_SECRET="your-access-key-secret"
OSS_BUCKET="your-bucket-name"

# .env.production - 生产环境
DATABASE_URL="postgresql://user:pass@neon-host/prod_db"
REDIS_URL="redis://upstash-host:6379"
```

#### **Docker部署配置**

```dockerfile
# Dockerfile
FROM node:18-alpine AS base
WORKDIR /app

# 依赖安装
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN npm i -g pnpm && pnpm install --frozen-lockfile

# 构建阶段
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm i -g pnpm
RUN pnpm db:generate
RUN pnpm build

# 生产运行
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/generated ./src/generated

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

#### **Vercel部署配置** ----- 不推荐env直接写在代码层

```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "pnpm db:generate && pnpm build",
  "installCommand": "pnpm install",
  "regions": ["hkg1"],
  "env": {
    "DATABASE_URL": "@database-url",
    "REDIS_URL": "@redis-url",
    "OSS_ACCESS_KEY_ID": "@oss-access-key-id",
    "OSS_ACCESS_KEY_SECRET": "@oss-access-key-secret"
  }
}
```

### 📊 性能监控

```typescript
// app/layout.tsx - Web Vitals监控
'use client';

import { useEffect } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // 性能指标收集
    if (typeof window !== 'undefined') {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        const vitalsUrl = '/api/vitals';

        const sendToAnalytics = (metric: any) => {
          fetch(vitalsUrl, {
            method: 'POST',
            body: JSON.stringify(metric),
          });
        };

        getCLS(sendToAnalytics);
        getFID(sendToAnalytics);
        getFCP(sendToAnalytics);
        getLCP(sendToAnalytics);
        getTTFB(sendToAnalytics);
      });
    }
  }, []);

  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
```

---

## 7. Q&A

### 🤔 常见问题

#### **Q1: 为什么选择这个技术栈组合？**

**A**:

- **开发效率**: Next.js + TypeScript 提供完整的开发体验
- **维护成本**: Prisma + Neon 几乎零运维的数据库方案
- **性能表现**: Zustand轻量级状态管理，OSS全球CDN加速
- **团队协作**: 统一的代码规范和工作流程

#### **Q2: 项目扩展性如何？**

**A**:

- **数据库**: Neon支持自动扩缩容，无需担心并发问题
- **文件存储**: OSS按量付费，支持无限存储
- **状态管理**: Zustand支持复杂应用状态架构
- **部署**: 支持Vercel、Docker等多种部署方式

#### **Q3: 成本控制如何？**

**A**:

```
预估月成本（1万用户）:
├── Neon数据库: $10-30
├── Upstash Redis: $8-20
├── 阿里云OSS: $5-15
├── Vercel部署: $0-20
└── 总计: $23-85/月
```

#### **技术价值总结**

| 技术选择       | 核心优势         | 业务价值         | 学习优先级 |
| -------------- | ---------------- | ---------------- | ---------- |
| **Next.js 15** | 现代全栈框架     | 开发效率提升60%  | ⭐⭐⭐⭐⭐ |
| **Prisma**     | 类型安全ORM      | 数据库Bug减少90% | ⭐⭐⭐⭐   |
| **Neon**       | Serverless数据库 | 运维成本降低80%  | ⭐⭐⭐     |
| **Zustand**    | 轻量状态管理     | 学习成本降低70%  | ⭐⭐⭐     |
| **OSS**        | 云存储+CDN       | 文件访问提升70%  | ⭐⭐       |

### 📚 资源

- **官方文档**: [Next.js](https://nextjs.org) | [Prisma](https://prisma.io) | [Neon](https://neon.tech)
- **项目仓库**: [GitHub - durunsong/next15-tutorial](https://github.com/durunsong/next15-tutorial)
- **在线演示**: [next15-tutorial-green.vercel.app](https://next15-tutorial-green.vercel.app/)
