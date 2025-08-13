import jwt from 'jsonwebtoken';

import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { CacheManager } from '@/lib/redis';

// 验证JWT Token
function verifyToken(token: string): { userId: string; email: string; username: string } | null {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    const decoded = jwt.verify(token, secret) as {
      userId: string;
      email: string;
      username: string;
    };
    return {
      userId: decoded.userId,
      email: decoded.email,
      username: decoded.username,
    };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    // 从请求头或Cookie中获取token
    let token = req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      // 尝试从Cookie中获取
      const cookies = req.headers.get('cookie');
      if (cookies) {
        const tokenMatch = cookies.match(/token=([^;]+)/);
        if (tokenMatch) {
          token = tokenMatch[1];
        }
      }
    }

    if (!token) {
      return NextResponse.json({ error: '未找到认证令牌' }, { status: 401 });
    }

    // 验证token
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: '无效的认证令牌' }, { status: 401 });
    }

    // 检查会话是否存在于缓存中
    const sessionExists = await CacheManager.exists(`session:${decoded.userId}`);
    if (!sessionExists) {
      return NextResponse.json({ error: '会话已过期，请重新登录' }, { status: 401 });
    }

    // 从数据库获取最新的用户信息
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        phone: true,
        avatar: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
    });

    if (!user) {
      // 用户不存在，清除会话
      await CacheManager.del(`session:${decoded.userId}`);
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    // 更新会话活跃时间
    const session = await CacheManager.get(`session:${decoded.userId}`);
    if (session) {
      const updatedSession = {
        ...session,
        lastActivity: new Date().toISOString(),
      };
      // 延长会话时间
      await CacheManager.set(`session:${decoded.userId}`, updatedSession, { ex: 7 * 24 * 60 * 60 });
    }

    return NextResponse.json({
      user,
      session: {
        isAuthenticated: true,
        loginTime: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return NextResponse.json(
      {
        error: '获取用户信息失败',
        message: '服务器内部错误',
      },
      { status: 500 }
    );
  }
}

// 更新用户信息
export async function PUT(req: NextRequest) {
  try {
    // 验证token
    let token = req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      const cookies = req.headers.get('cookie');
      if (cookies) {
        const tokenMatch = cookies.match(/token=([^;]+)/);
        if (tokenMatch) {
          token = tokenMatch[1];
        }
      }
    }

    if (!token) {
      return NextResponse.json({ error: '未找到认证令牌' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: '无效的认证令牌' }, { status: 401 });
    }

    const body = await req.json();
    const { username, avatar, phone } = body;

    // 验证输入
    if (
      username &&
      (username.length < 3 || username.length > 20 || !/^[a-zA-Z0-9_]+$/.test(username))
    ) {
      return NextResponse.json({ error: '用户名格式不正确' }, { status: 400 });
    }

    if (phone && !/^1[3-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ error: '手机号格式不正确' }, { status: 400 });
    }

    if (avatar && avatar.length > 500) {
      return NextResponse.json({ error: '头像URL过长' }, { status: 400 });
    }

    // 检查用户名和手机号是否已被使用
    if (username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          AND: [{ username }, { id: { not: decoded.userId } }],
        },
      });

      if (existingUser) {
        return NextResponse.json({ error: '用户名已被使用' }, { status: 409 });
      }
    }

    if (phone) {
      const existingUser = await prisma.user.findFirst({
        where: {
          AND: [{ phone }, { id: { not: decoded.userId } }],
        },
      });

      if (existingUser) {
        return NextResponse.json({ error: '手机号已被使用' }, { status: 409 });
      }
    }

    // 更新用户信息
    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        ...(username && { username }),
        ...(phone !== undefined && { phone: phone || null }),
        ...(avatar !== undefined && { avatar: avatar || null }),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        username: true,
        phone: true,
        avatar: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: '用户信息更新成功',
      user: updatedUser,
    });
  } catch (error) {
    console.error('更新用户信息失败:', error);
    return NextResponse.json(
      {
        error: '更新失败',
        message: '服务器内部错误',
      },
      { status: 500 }
    );
  }
}
