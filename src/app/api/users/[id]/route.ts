import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * 获取单个用户信息
 * GET /api/users/[id]
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        posts: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            published: true,
            createdAt: true,
            views: true,
            likes: true,
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
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return NextResponse.json(
      { error: '获取用户信息失败' },
      { status: 500 }
    );
  }
}

/**
 * 更新用户信息
 * PUT /api/users/[id]
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const body = await req.json();

    // 验证用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    // 检查是否有用户名或邮箱冲突
    if (body.username || body.email) {
      const conflictUser = await prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: userId } },
            {
              OR: [
                body.username ? { username: body.username } : {},
                body.email ? { email: body.email } : {},
              ].filter(condition => Object.keys(condition).length > 0),
            },
          ],
        },
      });

      if (conflictUser) {
        const conflictField = conflictUser.username === body.username ? '用户名' : '邮箱';
        return NextResponse.json(
          { error: `${conflictField}已被其他用户使用` },
          { status: 409 }
        );
      }
    }

    // 更新用户信息
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(body.username && { username: body.username }),
        ...(body.email && { email: body.email }),
        ...(body.avatar !== undefined && { avatar: body.avatar || null }),
      },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        updatedAt: true,
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('更新用户失败:', error);
    return NextResponse.json(
      { error: '更新用户失败' },
      { status: 500 }
    );
  }
}

/**
 * 删除用户
 * DELETE /api/users/[id]
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    // 验证用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    // 删除用户（由于设置了 onDelete: Cascade，关联的文章和评论会自动删除）
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      message: '用户删除成功',
      deletedUser: {
        id: existingUser.id,
        username: existingUser.username,
      },
      deletedRelated: {
        posts: existingUser._count.posts,
        comments: existingUser._count.comments,
      },
    });
  } catch (error) {
    console.error('删除用户失败:', error);
    return NextResponse.json(
      { error: '删除用户失败' },
      { status: 500 }
    );
  }
}

