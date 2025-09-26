# Next.js 15 教学指南 - 如何讲好每个细节

## 教学理念

### 核心原则

1. **理论与实践并重** - 每个概念都要有对应的代码演示
2. **循序渐进** - 从简单到复杂，逐步深入
3. **实际项目驱动** - 基于真实业务场景讲解
4. **最佳实践优先** - 教授业界标准做法
5. **问题导向** - 先提出问题，再给出解决方案

---

## 第一模块：Next.js 15 基础篇 教学要点

### 1.1 Next.js 简介与环境搭建

#### 开场技巧

```
"想象一下，你要开发一个现代化的网站，你需要：
- 快速的首屏加载 ✓
- 良好的SEO支持 ✓
- 简单的路由系统 ✓
- 自动的代码分割 ✓
- 内置的性能优化 ✓

Next.js 就是为了解决这些问题而生的！"
```

#### 必须强调的点

1. **问题驱动讲解**
   - 传统 React SPA 的问题：SEO差、首屏慢
   - Next.js 如何解决这些问题
   - 展示性能对比数据

2. **实际演示创建项目**

   ```bash
   # 让学生跟着操作
   npx create-next-app@latest demo-app --typescript --tailwind --eslint
   cd demo-app
   npm run dev
   ```

3. **项目结构深度解析**
   - 每个文件的作用都要讲清楚
   - 对比传统 React 项目结构
   - 强调约定优于配置的理念

#### 实际演示内容

```tsx
// 先展示一个最简单的页面
export default function HomePage() {
  return (
    <div>
      <h1>欢迎来到 Next.js 15!</h1>
      <p>这就是一个页面，简单吧？</p>
    </div>
  );
}

// 然后解释：
// 1. 这个文件会自动成为路由
// 2. 默认是 Server Component
// 3. 支持 TypeScript
// 4. 自动代码分割
```

### 1.2 App Router 路由系统

#### 教学重点

1. **对比展示新旧路由系统**

   ```
   Pages Router (旧)    →    App Router (新)
   pages/about.js       →    app/about/page.tsx
   pages/blog/[id].js   →    app/blog/[id]/page.tsx
   ```

2. **实际创建路由演示**

   ```bash
   # 让学生跟着创建
   mkdir app/about
   touch app/about/page.tsx

   # 立即在浏览器查看效果
   http://localhost:3000/about
   ```

3. **嵌套布局的威力**

   ```tsx
   // 先创建简单的布局
   export default function BlogLayout({ children }: { children: React.ReactNode }) {
     return (
       <div>
         <nav>博客导航</nav>
         <main>{children}</main>
       </div>
     );
   }

   // 强调：这个布局只会应用到 /blog 路径下
   ```

#### 互动环节

- 让学生创建自己的路由结构
- 现场演示路由参数获取
- 展示错误页面效果

### 1.3 Server Components vs Client Components

#### 核心教学策略

1. **先展示问题，再给出解决方案**

   ```tsx
   // ❌ 学生常见错误
   export default function BadExample() {
     const [count, setCount] = useState(0); // 报错！
     return <button onClick={() => setCount(count + 1)}>{count}</button>;
   }

   // ✅ 正确做法
   ('use client');
   export default function GoodExample() {
     const [count, setCount] = useState(0);
     return <button onClick={() => setCount(count + 1)}>{count}</button>;
   }
   ```

2. **性能对比演示**
   - 展示 Network 面板中的包大小
   - 对比有无 'use client' 的差异
   - 实际测量加载时间

3. **决策树教学法**
   ```
   需要交互状态？
   ├─ 是 → Client Component
   └─ 否 → 需要访问数据库？
       ├─ 是 → Server Component
       └─ 否 → Server Component (默认)
   ```

#### 实战练习

```tsx
// 练习：改造这个组件
export default function UserProfile({ userId }: { userId: string }) {
  // 1. 获取用户数据 (Server)
  // 2. 点赞功能 (Client)
  // 3. 评论列表 (Server)
  // 4. 评论输入框 (Client)
  // 学生需要决定如何拆分组件
}
```

### 1.4 渲染模式深度解析

#### 教学方法：情景教学

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

3. **实际性能测试**
   - 使用 Lighthouse 测试不同模式
   - 展示 Network 瀑布图
   - 对比 Core Web Vitals 指标

#### 代码演示结构

```tsx
// 1. 先展示最简单的版本
export default function SimplePage() {
  return <div>静态内容</div>;
}

// 2. 添加数据获取
export default async function DataPage() {
  const data = await fetch('...');
  return <div>{data.title}</div>;
}

// 3. 添加缓存控制
export default async function CachedPage() {
  const data = await fetch('...', {
    next: { revalidate: 3600 },
  });
  return <div>{data.title}</div>;
}

// 4. 讲解每一步的影响
```

---

## 第二模块：TypeScript 进阶应用 教学要点

### 2.1 TypeScript 基础与 Next.js 集成

#### 教学重点

1. **为什么需要 TypeScript？**

   ```tsx
   // 展示 JavaScript 的问题
   function greet(name) {
     return `Hello, ${name.toUpperCase()}`;
   }

   greet(123); // 运行时错误！

   // TypeScript 的解决方案
   function greet(name: string): string {
     return `Hello, ${name.toUpperCase()}`;
   }

   greet(123); // 编译时就发现错误！
   ```

2. **Next.js 特定类型**

   ```tsx
   // 页面组件类型
   interface PageProps {
     params: { slug: string };
     searchParams: { [key: string]: string | string[] | undefined };
   }

   export default function Page({ params, searchParams }: PageProps) {
     // 现在有完整的类型提示！
   }
   ```

### 2.2 高级类型系统

#### 实用导向教学

```tsx
// 从实际问题出发
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// 问题：如何创建一个更新用户的函数？
// 引出 Partial 类型
function updateUser(id: string, updates: Partial<User>) {
  // 实现更新逻辑
}

// 问题：如何确保某些字段必填？
// 引出交叉类型
type CreateUserData = Omit<User, 'id'> & { password: string };
```

---

## 第三模块：数据层架构 教学要点

### 3.1 Prisma ORM 深度应用

#### 循序渐进教学法

1. **从最简单的查询开始**

   ```tsx
   // 第一步：简单查询
   const users = await prisma.user.findMany();

   // 第二步：添加条件
   const activeUsers = await prisma.user.findMany({
     where: { active: true },
   });

   // 第三步：添加关联
   const usersWithPosts = await prisma.user.findMany({
     include: { posts: true },
   });

   // 第四步：复杂查询
   const result = await prisma.user.findMany({
     where: {
       posts: { some: { published: true } },
     },
     include: {
       posts: {
         where: { published: true },
         orderBy: { createdAt: 'desc' },
       },
     },
   });
   ```

2. **实际业务场景驱动**

   ```
   "假设你在开发一个博客系统，需要：
   1. 显示所有有发布文章的作者
   2. 每个作者显示最新的3篇文章
   3. 按文章数量排序作者

   这个需求该如何实现？"
   ```

#### 性能优化重点

```tsx
// ❌ N+1 查询问题
const users = await prisma.user.findMany();
for (const user of users) {
  const posts = await prisma.post.findMany({
    where: { authorId: user.id },
  });
}

// ✅ 一次查询解决
const usersWithPosts = await prisma.user.findMany({
  include: { posts: true },
});
```

### 3.2 Redis 缓存系统

#### 问题驱动教学

1. **先制造性能问题**

   ```tsx
   // 展示慢查询
   export default async function SlowPage() {
     const start = Date.now();
     const data = await expensiveDbQuery(); // 2秒查询
     const end = Date.now();

     return (
       <div>
         <p>查询耗时：{end - start}ms</p>
         <div>{data.title}</div>
       </div>
     );
   }
   ```

2. **引入缓存解决方案**

   ```tsx
   export default async function FastPage() {
     const start = Date.now();

     // 先检查缓存
     let data = await redis.get('cached-data');
     if (!data) {
       data = await expensiveDbQuery();
       await redis.set('cached-data', data, { ex: 300 });
     }

     const end = Date.now();

     return (
       <div>
         <p>查询耗时：{end - start}ms</p>
         <div>{data.title}</div>
       </div>
     );
   }
   ```

---

## 第四模块：API 设计与安全 教学要点

### 4.1 RESTful API 设计

#### 最佳实践教学

1. **先展示糟糕的设计**

   ```
   GET /getUserById?id=123
   POST /createNewUser
   PUT /updateUserInformation
   DELETE /removeUserFromSystem
   ```

2. **再展示标准设计**

   ```
   GET    /api/users/123    # 获取用户
   POST   /api/users        # 创建用户
   PUT    /api/users/123    # 更新用户
   DELETE /api/users/123    # 删除用户
   ```

3. **实际实现演示**

   ```tsx
   // app/api/users/[id]/route.ts
   export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
     try {
       const user = await prisma.user.findUnique({
         where: { id: params.id },
       });

       if (!user) {
         return NextResponse.json({ error: 'User not found' }, { status: 404 });
       }

       return NextResponse.json(user);
     } catch (error) {
       return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
     }
   }
   ```

### 4.2 认证与授权系统

#### 安全意识培养

1. **展示安全风险**

   ```tsx
   // ❌ 危险的做法
   export async function GET(request: NextRequest) {
     const userId = request.nextUrl.searchParams.get('userId');
     // 直接相信用户输入！
     const user = await prisma.user.findUnique({
       where: { id: userId },
     });
     return NextResponse.json(user);
   }
   ```

2. **安全的实现**

   ```tsx
   // ✅ 安全的做法
   export async function GET(request: NextRequest) {
     const token = request.headers.get('authorization');
     const user = await verifyToken(token);

     if (!user) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }

     return NextResponse.json(user);
   }
   ```

---

## 实际教学技巧

### 1. 互动式编程

- **Live Coding**: 实时编写代码，让学生看到思考过程
- **错误重现**: 故意犯错，演示调试过程
- **学生参与**: 让学生指导下一步该写什么

### 2. 对比教学法

```tsx
// 总是展示 "之前 vs 之后"
// ❌ 之前的做法
// ✅ 改进后的做法
// 💡 为什么这样更好
```

### 3. 实际项目驱动

- 每个概念都要有真实的使用场景
- 从学生熟悉的应用开始（微博、购物网站等）
- 解决实际问题，而不是为了技术而技术

### 4. 性能可视化

- 使用浏览器开发者工具
- 展示 Lighthouse 报告
- 对比优化前后的数据

### 5. 代码审查环节

```tsx
// 给学生一段代码，让他们找问题
export default function ReviewMe() {
  const [data, setData] = useState();

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData);
  });

  return <div>{data.title}</div>;
}

// 问题：
// 1. 无限循环
// 2. 缺少错误处理
// 3. 缺少加载状态
// 4. 内存泄漏风险
```

---

## 课堂管理建议

### 1. 时间分配

- **理论讲解**: 30%
- **代码演示**: 40%
- **学生实践**: 20%
- **答疑总结**: 10%

### 2. 难度控制

- 每次课只引入1-2个新概念
- 大量使用之前学过的知识
- 及时检查学生理解情况

### 3. 作业设计

```tsx
// 示例作业：实现一个简单的博客
// 要求：
// 1. 使用 App Router 创建路由
// 2. 实现文章列表和详情页
// 3. 添加简单的缓存
// 4. 包含错误处理

// 评分标准：
// - 功能完整性 (40%)
// - 代码质量 (30%)
// - 最佳实践 (20%)
// - 创新点 (10%)
```

### 4. 常见问题预案

1. **环境问题**：准备 Docker 环境
2. **版本冲突**：提供 package.json 锁定版本
3. **概念混淆**：准备类比和图表
4. **进度差异**：准备额外练习和简化版本

---

_这份教学指南基于多年的实际教学经验总结，旨在帮助讲师更有效地传递知识，让学生更好地理解和掌握 Next.js 15 全栈开发技能。_
