'use client';

import { TutorialLayout } from '@/components/TutorialLayout';
import { DemoSection } from '@/components/DemoSection';
import { CodeBlock } from '@/components/CodeBlock';
import { CodeEditor } from '@/components/CodeEditor';
import { PrismaSchemaDemo, PrismaQueryDemo } from '@/components/demos/PrismaDemos';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Database, Users, FileText, Settings, Plus, Edit, Trash2 } from 'lucide-react';

// 模拟数据库操作的演示组件
function PrismaDemo() {
  const [users] = useState([
    { id: 1, name: '张三', email: 'zhangsan@example.com', posts: 3 },
    { id: 2, name: '李四', email: 'lisi@example.com', posts: 1 },
    { id: 3, name: '王五', email: 'wangwu@example.com', posts: 5 },
  ]);

  const [posts, setPosts] = useState([
    { id: 1, title: 'Next.js 入门指南', authorId: 1, published: true },
    { id: 2, title: 'TypeScript 最佳实践', authorId: 1, published: true },
    { id: 3, title: 'Prisma ORM 深度解析', authorId: 1, published: false },
    { id: 4, title: 'React 性能优化', authorId: 2, published: true },
    { id: 5, title: '数据库设计原则', authorId: 3, published: true },
  ]);

  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [newPost, setNewPost] = useState({ title: '', authorId: 1 });

  const getUserPosts = (userId: number) => {
    return posts.filter(post => post.authorId === userId);
  };

  const addPost = () => {
    if (newPost.title) {
      const post = {
        id: Date.now(),
        title: newPost.title,
        authorId: newPost.authorId,
        published: false
      };
      setPosts([...posts, post]);
      setNewPost({ title: '', authorId: 1 });
    }
  };

  const togglePublished = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, published: !post.published } : post
    ));
  };

  const deletePost = (postId: number) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  return (
    <div className="space-y-6">
      {/* 用户列表 */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <Users className="h-4 w-4 mr-2 text-blue-600" />
          用户列表 (User Model)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {users.map((user) => (
            <div 
              key={user.id}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedUser === user.id 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
            >
              <h5 className="font-medium text-gray-900 dark:text-white">{user.name}</h5>
              <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {user.posts} 篇文章
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 文章管理 */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <FileText className="h-4 w-4 mr-2 text-green-600" />
          文章管理 (Post Model)
        </h4>
        
        {/* 添加文章 */}
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="文章标题"
              value={newPost.title}
              onChange={(e) => setNewPost({...newPost, title: e.target.value})}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <select
              value={newPost.authorId}
              onChange={(e) => setNewPost({...newPost, authorId: Number(e.target.value)})}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
            <button
              onClick={addPost}
              className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 文章列表 */}
        <div className="space-y-2">
          {(selectedUser ? getUserPosts(selectedUser) : posts).map((post) => {
            const author = users.find(u => u.id === post.authorId);
            return (
              <div key={post.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900 dark:text-white">{post.title}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      作者: {author?.name} | 状态: 
                      <span className={`ml-1 ${post.published ? 'text-green-600' : 'text-yellow-600'}`}>
                        {post.published ? '已发布' : '草稿'}
                      </span>
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => togglePublished(post.id)}
                      className={`p-1 rounded ${
                        post.published 
                          ? 'text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20' 
                          : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                      }`}
                      title={post.published ? '设为草稿' : '发布'}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      title="删除"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedUser && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-300">
          显示用户 ID {selectedUser} 的文章，点击用户卡片可以切换过滤
        </div>
      )}
    </div>
  );
}

// 数据库查询演示
function QueryDemo() {
  const [queryType, setQueryType] = useState<'findMany' | 'findUnique' | 'create' | 'update' | 'delete'>('findMany');
  const [result, setResult] = useState<string>('');

  const executeQuery = () => {
    const results = {
      findMany: `[
  {
    "id": 1,
    "name": "张三",
    "email": "zhangsan@example.com",
    "posts": [
      { "id": 1, "title": "Next.js 入门指南" },
      { "id": 2, "title": "TypeScript 最佳实践" }
    ]
  },
  {
    "id": 2,
    "name": "李四",
    "email": "lisi@example.com",
    "posts": [
      { "id": 4, "title": "React 性能优化" }
    ]
  }
]`,
      findUnique: `{
  "id": 1,
  "name": "张三",
  "email": "zhangsan@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "posts": [
    { "id": 1, "title": "Next.js 入门指南", "published": true },
    { "id": 2, "title": "TypeScript 最佳实践", "published": true }
  ]
}`,
      create: `{
  "id": 4,
  "name": "赵六",
  "email": "zhaoliu@example.com",
  "createdAt": "2024-01-15T08:30:00.000Z"
}`,
      update: `{
  "id": 1,
  "name": "张三",
  "email": "zhangsan@newdomain.com",
  "updatedAt": "2024-01-15T08:30:00.000Z"
}`,
      delete: `{
  "id": 3,
  "name": "王五",
  "email": "wangwu@example.com"
}`
    };

    setResult(results[queryType]);
  };

  const queryExamples = {
    findMany: `const users = await prisma.user.findMany({
  include: {
    posts: {
      where: { published: true }
    }
  }
});`,
    findUnique: `const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: { posts: true }
});`,
    create: `const newUser = await prisma.user.create({
  data: {
    name: "赵六",
    email: "zhaoliu@example.com"
  }
});`,
    update: `const updatedUser = await prisma.user.update({
  where: { id: 1 },
  data: { email: "zhangsan@newdomain.com" }
});`,
    delete: `const deletedUser = await prisma.user.delete({
  where: { id: 3 }
});`
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {Object.keys(queryExamples).map((type) => (
          <button
            key={type}
            onClick={() => setQueryType(type as keyof typeof queryExamples)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              queryType === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="bg-gray-900 rounded-lg p-4">
        <h4 className="text-white font-medium mb-2">Prisma 查询代码:</h4>
        <pre className="text-green-400 text-sm font-mono">
          {queryExamples[queryType]}
        </pre>
      </div>

      <button
        onClick={executeQuery}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        执行查询
      </button>

      {result && (
        <div className="bg-gray-900 rounded-lg p-4">
          <h4 className="text-white font-medium mb-2">查询结果:</h4>
          <pre className="text-yellow-400 text-sm font-mono overflow-x-auto">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function PrismaTutorial() {
  const schemaCode = `// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]
  profile   Profile?

  @@map("users")
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  tags      Tag[]    @relation("PostTags")

  @@map("posts")
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String?
  userId Int    @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("profiles")
}

model Tag {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[] @relation("PostTags")

  @@map("tags")
}`;

  const clientCode = `// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;`;

  const crudCode = `// 创建用户
export async function createUser(data: { name: string; email: string }) {
  return await prisma.user.create({
    data,
  });
}

// 获取所有用户及其文章
export async function getUsers() {
  return await prisma.user.findMany({
    include: {
      posts: {
        where: { published: true },
        orderBy: { createdAt: 'desc' }
      },
      _count: {
        select: { posts: true }
      }
    },
  });
}

// 获取特定用户
export async function getUser(id: number) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      posts: true,
      profile: true
    }
  });
}

// 更新用户
export async function updateUser(id: number, data: { name?: string; email?: string }) {
  return await prisma.user.update({
    where: { id },
    data,
  });
}

// 删除用户
export async function deleteUser(id: number) {
  return await prisma.user.delete({
    where: { id },
  });
}

// 创建文章
export async function createPost(data: {
  title: string;
  content?: string;
  authorId: number;
  published?: boolean;
}) {
  return await prisma.post.create({
    data,
    include: {
      author: true
    }
  });
}

// 复杂查询：获取已发布的文章及作者信息
export async function getPublishedPosts() {
  return await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: {
          name: true,
          email: true
        }
      },
      tags: true
    },
    orderBy: { createdAt: 'desc' }
  });
}`;

  const apiRouteCode = `// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: { posts: true }
        }
      }
    });
    
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: '获取用户失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();
    
    const user = await prisma.user.create({
      data: { name, email }
    });
    
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: '创建用户失败' },
      { status: 500 }
    );
  }
}

// app/api/users/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        posts: true,
        profile: true
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: '获取用户失败' },
      { status: 500 }
    );
  }
}`;

  const migrationCode = `// 初始化 Prisma
npx prisma init

// 生成 Prisma Client
npx prisma generate

// 创建和应用迁移
npx prisma migrate dev --name init

// 推送 schema 变更到数据库（用于原型开发）
npx prisma db push

// 打开 Prisma Studio（数据库可视化工具）
npx prisma studio

// 重置数据库
npx prisma migrate reset

// 从现有数据库生成 schema
npx prisma db pull`;

  return (
    <TutorialLayout
      title="Prisma ORM 教程"
      description="学习使用 Prisma ORM 与 Neon PostgreSQL 数据库进行类型安全的数据库操作"
      prevTutorial={{
        title: "TypeScript 集成",
        href: "/tutorials/typescript"
      }}
      nextTutorial={{
        title: "Redis 缓存",
        href: "/tutorials/redis"
      }}
    >
      <div className="space-y-12">
        {/* 简介 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            什么是 Prisma ORM？
          </h2>
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p>
              Prisma 是一个现代化的 TypeScript ORM，提供类型安全的数据库访问、
              自动生成的查询构建器和强大的数据库迁移工具。它与 Neon PostgreSQL 完美集成。
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <Database className="h-8 w-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">类型安全</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  自动生成的 TypeScript 类型
                </p>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <Settings className="h-8 w-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">数据库迁移</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  声明式数据库架构管理
                </p>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <FileText className="h-8 w-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">直观的 API</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  简洁易读的查询语法
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Schema 定义 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Prisma Schema 定义
          </h2>
          <div className="prose prose-lg max-w-none dark:prose-invert mb-6">
            <p>
              Prisma Schema 是定义数据模型、数据库连接和生成器的配置文件。
              它使用简洁的 DSL 语法描述数据库结构。
            </p>
          </div>
          
          <CodeBlock
            code={schemaCode}
            language="prisma"
            filename="prisma/schema.prisma"
          />
        </section>

        {/* Prisma Client 设置 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Prisma Client 设置
          </h2>
          <div className="prose prose-lg max-w-none dark:prose-invert mb-6">
            <p>
              Prisma Client 是自动生成的类型安全数据库客户端。
              在 Next.js 中需要特殊的设置来避免开发环境中的连接池问题。
            </p>
          </div>
          
          <CodeBlock
            code={clientCode}
            language="typescript"
            filename="lib/prisma.ts"
          />
        </section>

        {/* CRUD 操作演示 */}
        {/* Prisma Schema 构建演示 */}
        <DemoSection
          title="Prisma Schema 可视化构建器"
          description="交互式构建和编辑 Prisma 数据模型，实时生成 Schema 代码"
          demoComponent={<PrismaSchemaDemo />}
          codeComponent={
            <CodeBlock
              code={`// Prisma Schema 完整示例
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  avatar    String?
  posts     Post[]
  comments  Comment[]
  likes     Like[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model Post {
  id          String    @id @default(uuid())
  title       String
  content     String?
  published   Boolean   @default(false)
  slug        String    @unique
  author      User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId    String
  comments    Comment[]
  likes       Like[]
  tags        Tag[]     @relation("PostTags")
  views       Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@map("posts")
}

model Comment {
  id        String   @id @default(uuid())
  content   String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId  String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId    String
  createdAt DateTime @default(now())

  @@map("comments")
}`}
              language="prisma"
              filename="Prisma Schema 示例"
            />
          }
        />

        {/* Prisma 查询构建器演示 */}
        <DemoSection
          title="Prisma 查询构建器"
          description="可视化构建复杂的 Prisma 查询，学习各种数据库操作的最佳实践"
          demoComponent={<PrismaQueryDemo />}
          codeComponent={
            <CodeBlock
              code={`// Prisma 高级查询示例
// 1. 复杂的关联查询
const getUserWithPosts = await prisma.user.findUnique({
  where: { id: "user-id" },
  include: {
    posts: {
      where: { published: true },
      include: {
        comments: { include: { author: true } },
        likes: true
      },
      orderBy: { createdAt: 'desc' }
    },
    _count: { select: { posts: true, comments: true } }
  }
});

// 2. 聚合查询
const stats = await prisma.post.aggregate({
  _count: { id: true },
  _avg: { views: true },
  _sum: { views: true },
  where: { published: true }
});

// 3. 事务操作
const result = await prisma.$transaction([
  prisma.user.create({ data: userData }),
  prisma.post.updateMany({ 
    where: { authorId: "user-id" },
    data: { published: true }
  })
]);

// 4. 原生 SQL 查询
const popularPosts = await prisma.$queryRaw\`
  SELECT p.*, COUNT(l.id) as like_count
  FROM posts p
  LEFT JOIN likes l ON p.id = l.post_id
  GROUP BY p.id
  ORDER BY like_count DESC
  LIMIT 10
\`;`}
              language="typescript"
              filename="Prisma 高级查询"
            />
          }
        />

        <DemoSection
          title="CRUD 操作演示"
          description="体验 Prisma 的增删改查操作，包括关联查询和复杂条件"
          demoComponent={<PrismaDemo />}
          codeComponent={
            <CodeBlock
              code={crudCode}
              language="typescript"
              filename="数据库操作函数"
            />
          }
        />

        {/* 查询演示 */}
        <DemoSection
          title="Prisma 查询构建器"
          description="学习不同类型的 Prisma 查询及其返回结果"
          demoComponent={<QueryDemo />}
          codeComponent={
            <CodeBlock
              code={`// 基础查询
const users = await prisma.user.findMany();

// 条件查询
const activeUsers = await prisma.user.findMany({
  where: {
    posts: {
      some: {
        published: true
      }
    }
  }
});

// 关联查询
const userWithPosts = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      where: { published: true },
      orderBy: { createdAt: 'desc' }
    },
    profile: true
  }
});

// 聚合查询
const userStats = await prisma.user.aggregate({
  _count: { id: true },
  _avg: { id: true }
});

// 分组查询
const postsByUser = await prisma.post.groupBy({
  by: ['authorId'],
  _count: { id: true },
  having: {
    authorId: {
      gt: 0
    }
  }
});`}
              language="typescript"
              filename="Prisma 查询示例"
            />
          }
        />

        {/* API 路由集成 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Next.js API 路由集成
          </h2>
          <div className="prose prose-lg max-w-none dark:prose-invert mb-6">
            <p>
              在 Next.js 的 API 路由中使用 Prisma 进行数据库操作，
              实现 RESTful API 端点。
            </p>
          </div>
          
          <CodeBlock
            code={apiRouteCode}
            language="typescript"
            filename="API 路由示例"
          />
        </section>

        {/* 数据库迁移 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            数据库迁移和管理
          </h2>
          <div className="prose prose-lg max-w-none dark:prose-invert mb-6">
            <p>
              Prisma 提供了强大的迁移工具来管理数据库架构变更。
              以下是常用的 Prisma CLI 命令：
            </p>
          </div>
          
          <CodeBlock
            code={migrationCode}
            language="bash"
            filename="Prisma CLI 命令"
          />
        </section>

        {/* 环境配置 */}
        <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            环境配置
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                .env 文件配置
              </h3>
              <CodeBlock
                code={`# Neon PostgreSQL 连接字符串
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# 示例（请替换为你的实际连接信息）
DATABASE_URL="postgresql://kilyicmsDB_owner:FpaRmb1EM7jV@ep-calm-snow-a5ss0pnq-pooler.us-east-2.aws.neon.tech/kilyicmsDB?sslmode=require"`}
                language="bash"
                filename=".env"
              />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                package.json 脚本
              </h3>
              <CodeBlock
                code={`{
  "scripts": {
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:reset": "prisma migrate reset"
  }
}`}
                language="json"
                filename="package.json"
              />
            </div>
          </div>
        </section>

        {/* 互动编辑器 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Prisma 查询练习
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            尝试编写 Prisma 查询，体验类型安全的数据库操作：
          </p>
          
          <CodeEditor
            title="Prisma 查询练习场"
            defaultCode={`// 练习 Prisma 查询
import { prisma } from '@/lib/prisma';

// 1. 获取所有用户及其文章数量
async function getUsersWithPostCount() {
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: { posts: true }
      }
    }
  });
  return users;
}

// 2. 创建用户和文章（事务操作）
async function createUserWithPost() {
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: '新用户',
        email: 'newuser@example.com'
      }
    });
    
    const post = await tx.post.create({
      data: {
        title: '我的第一篇文章',
        content: '这是内容...',
        authorId: user.id,
        published: true
      }
    });
    
    return { user, post };
  });
  
  return result;
}

// 3. 复杂条件查询
async function getPublishedPostsWithAuthors() {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      author: {
        posts: {
          some: {
            published: true
          }
        }
      }
    },
    include: {
      author: {
        select: {
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  
  return posts;
}

// 测试查询
console.log('Prisma 查询示例已准备就绪！');`}
            language="typescript"
            height="500px"
            onRun={(code) => console.log('执行 Prisma 查询:', code)}
            showConsole={true}
          />
        </section>

        {/* 最佳实践 */}
        <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Prisma 最佳实践
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-2 flex items-center">
                <Database className="h-5 w-5 mr-2" />
                性能优化
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-green-600 flex-shrink-0" />
                  使用 select 和 include 精确控制查询字段
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-green-600 flex-shrink-0" />
                  合理使用索引和数据库约束
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-green-600 flex-shrink-0" />
                  使用分页避免大量数据查询
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-green-600 flex-shrink-0" />
                  利用连接池优化数据库连接
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-2 flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                开发建议
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-blue-600 flex-shrink-0" />
                  使用事务保证数据一致性
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-blue-600 flex-shrink-0" />
                  定期备份和测试迁移
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-blue-600 flex-shrink-0" />
                  使用 Prisma Studio 进行数据可视化
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-blue-600 flex-shrink-0" />
                  充分利用 TypeScript 类型安全
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 下一步 */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            准备好了吗？
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            现在你已经掌握了 Prisma ORM 的核心概念，让我们继续学习 Redis 缓存来优化应用性能。
          </p>
          <Link
            href="/tutorials/redis"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            学习 Redis 缓存
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </section>
      </div>
    </TutorialLayout>
  );
}
