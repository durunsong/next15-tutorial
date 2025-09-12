import bcrypt from 'bcryptjs';

import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

/**
 * 创建演示用户（仅用于开发和演示）
 * POST /api/demo/seed-user
 */
export async function POST() {
  // 只在开发环境中允许
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: '生产环境中不允许此操作' }, { status: 403 });
  }

  try {
    const demoUsers = [
      {
        email: 'demo@example.com',
        username: 'demo_user',
        password: 'Demo123!',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
      },
      {
        email: 'admin@example.com',
        username: 'admin_user',
        password: 'Admin123!',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      },
      {
        email: 'test@example.com',
        username: 'test_user',
        password: 'Test123!',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
      },
    ];

    const createdUsers = [];

    for (const userData of demoUsers) {
      // 检查用户是否已存在
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email: userData.email }, { username: userData.username }],
        },
      });

      if (!existingUser) {
        // 加密密码
        const hashedPassword = await bcrypt.hash(userData.password, 12);

        // 创建用户
        const user = await prisma.user.create({
          data: {
            email: userData.email,
            username: userData.username,
            password: hashedPassword,
            avatar: userData.avatar,
          },
          select: {
            id: true,
            email: true,
            username: true,
            avatar: true,
            createdAt: true,
          },
        });

        createdUsers.push({
          ...user,
          originalPassword: userData.password, // 仅用于演示
        });
      } else {
        createdUsers.push({
          id: existingUser.id,
          email: existingUser.email,
          username: existingUser.username,
          avatar: existingUser.avatar,
          createdAt: existingUser.createdAt,
          originalPassword: userData.password,
          note: '用户已存在',
        });
      }
    }

    // 创建一些演示文章
    const demoPosts = [
      {
        title: 'Next.js 15 新特性介绍',
        content: `# Next.js 15 新特性介绍

Next.js 15 带来了许多令人兴奋的新特性和改进：

## 主要特性

1. **React 19 支持**
   - 完全支持 React 19 的新特性
   - 改进的并发渲染
   - 更好的 Suspense 支持

2. **Turbopack 稳定版**
   - 显著提升开发构建速度
   - 更好的热重载体验
   - 优化的生产构建

3. **App Router 增强**
   - 改进的缓存策略
   - 更好的错误处理
   - 优化的性能

## 开始使用

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

体验全新的 Next.js 15 开发体验！`,
        category: '技术',
        difficulty: '中级',
        tags: ['Next.js', 'React', '前端'],
        published: true,
        views: 156,
        likes: 23,
      },
      {
        title: 'TypeScript 最佳实践',
        content: `# TypeScript 最佳实践

在现代前端开发中，TypeScript 已经成为不可或缺的工具。

## 类型定义

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
\`\`\`

## 工具类型

TypeScript 提供了许多实用的工具类型：

- \`Partial<T>\` - 使所有属性可选
- \`Required<T>\` - 使所有属性必需
- \`Pick<T, K>\` - 选择特定属性
- \`Omit<T, K>\` - 排除特定属性

让代码更加类型安全！`,
        category: '技术',
        difficulty: '初级',
        tags: ['TypeScript', '类型安全', '前端'],
        published: true,
        views: 89,
        likes: 12,
      },
      {
        title: 'Prisma ORM 入门指南',
        content: `# Prisma ORM 入门指南

Prisma 是现代化的数据库工具包，提供类型安全的数据库访问。

## 安装配置

\`\`\`bash
npm install prisma @prisma/client
npx prisma init
\`\`\`

## Schema 定义

\`\`\`prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
}
\`\`\`

开始使用 Prisma 构建类型安全的应用吧！`,
        category: '技术',
        difficulty: '中级',
        tags: ['Prisma', 'ORM', '数据库'],
        published: true,
        views: 234,
        likes: 45,
      },
    ];

    // 为第一个用户创建文章
    if (createdUsers.length > 0) {
      const firstUser = createdUsers[0];

      // 确保 firstUser 存在，避免 TypeScript 类型错误
      if (firstUser) {
        for (const postData of demoPosts) {
          // 检查文章是否已存在
          const existingPost = await prisma.post.findFirst({
            where: { title: postData.title },
          });

          if (!existingPost) {
            await prisma.post.create({
              data: {
                ...postData,
                authorId: firstUser.id,
              },
            });
          }
        }
      }
    }

    return NextResponse.json(
      {
        message: '演示数据创建成功',
        users: createdUsers,
        note: '这些是演示账户，仅用于测试功能',
        credentials: {
          demo: { email: 'demo@example.com', password: 'Demo123!' },
          admin: { email: 'admin@example.com', password: 'Admin123!' },
          test: { email: 'test@example.com', password: 'Test123!' },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('创建演示数据失败:', error);
    return NextResponse.json({ error: '创建演示数据失败' }, { status: 500 });
  }
}
