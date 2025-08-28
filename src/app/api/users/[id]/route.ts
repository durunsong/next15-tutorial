import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

// GET /api/users/[id] - 获取单个用户信息
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: '用户ID不能为空' }, { status: 400 });
    }

    // 查询用户信息，包含文章和评论统计
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        posts: {
          select: {
            id: true,
            title: true,
            content: true,
            published: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: {
                comments: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    // 返回用户信息（不包含敏感信息如密码）
    const { password: _password, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
  }
}
