import { z } from 'zod';

import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

// 文章创建验证schema
const createPostSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(100, '标题最多100个字符'),
  content: z.string().min(10, '内容至少10个字符').max(10000, '内容最多10000个字符'),
  category: z.enum(['技术', '生活', '学习', '其他'], {
    message: '分类必须是：技术、生活、学习、其他之一',
  }),
  difficulty: z.enum(['初级', '中级', '高级'], {
    message: '难度必须是：初级、中级、高级之一',
  }),
  tags: z.array(z.string()).optional().default([]),
  published: z.boolean().optional().default(false),
  coverImage: z.string().url().optional().or(z.literal('')),
  authorId: z.string().min(1, '作者ID不能为空'),
});

/**
 * 获取文章列表
 * GET /api/posts
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const published = searchParams.get('published');
    const search = searchParams.get('search') || '';
    const skip = (page - 1) * limit;

    // 构建查询条件
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (published !== null && published !== undefined) {
      where.published = published === 'true';
    }

    // 并行查询文章列表和总数
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('获取文章列表失败:', error);
    return NextResponse.json({ error: '获取文章列表失败' }, { status: 500 });
  }
}

/**
 * 创建新文章
 * POST /api/posts
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 验证输入数据
    const validationResult = createPostSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: '数据验证失败',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { title, content, category, difficulty, tags, published, coverImage, authorId } =
      validationResult.data;

    // 验证作者是否存在
    const author = await prisma.user.findUnique({
      where: { id: authorId },
      select: { id: true },
    });

    if (!author) {
      return NextResponse.json({ error: '作者不存在' }, { status: 400 });
    }

    // 创建文章
    const post = await prisma.post.create({
      data: {
        title,
        content,
        category,
        difficulty,
        tags: tags || [],
        published: published || false,
        coverImage: coverImage || null,
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('创建文章失败:', error);
    return NextResponse.json({ error: '创建文章失败' }, { status: 500 });
  }
}

/**
 * 批量删除文章
 * DELETE /api/posts
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ids = searchParams.get('ids')?.split(',').filter(Boolean);

    if (!ids || ids.length === 0) {
      return NextResponse.json({ error: '请提供要删除的文章ID' }, { status: 400 });
    }

    // 获取要删除的文章信息
    const postsToDelete = await prisma.post.findMany({
      where: {
        id: { in: ids },
      },
      select: {
        id: true,
        title: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (postsToDelete.length === 0) {
      return NextResponse.json({ error: '未找到要删除的文章' }, { status: 404 });
    }

    // 删除文章（评论会因为级联删除一并删除）
    await prisma.post.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    return NextResponse.json({
      message: '文章删除成功',
      deletedPosts: postsToDelete.length,
      deletedComments: postsToDelete.reduce((sum, post) => sum + post._count.comments, 0),
    });
  } catch (error) {
    console.error('批量删除文章失败:', error);
    return NextResponse.json({ error: '批量删除文章失败' }, { status: 500 });
  }
}
