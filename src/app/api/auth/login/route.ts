import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { CacheManager } from '@/lib/redis';

// 登录验证schema
const loginSchema = z.object({
  loginId: z.string().min(1, '请输入用户名或邮箱'),
  password: z.string().min(1, '密码不能为空'),
  rememberMe: z.boolean().optional().default(false),
});

// 限流检查（登录失败限流）
async function checkLoginRateLimit(identifier: string): Promise<{
  allowed: boolean;
  remaining: number;
  resetTime: number;
}> {
  const key = `login_rate_limit:${identifier}`;
  const limit = 5; // 15分钟内最多5次登录尝试
  const window = 15 * 60; // 15分钟窗口

  try {
    const current = (await CacheManager.get<number>(key)) || 0;

    if (current >= limit) {
      const ttl = await CacheManager.ttl(key);
      const resetTime = Date.now() + ttl * 1000;
      return {
        allowed: false,
        remaining: 0,
        resetTime,
      };
    }

    const resetTime = Date.now() + window * 1000;
    return {
      allowed: true,
      remaining: Math.max(0, limit - current - 1),
      resetTime,
    };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: Date.now() + window * 1000,
    };
  }
}

// 记录登录失败
async function recordLoginFailure(identifier: string): Promise<void> {
  const key = `login_rate_limit:${identifier}`;
  const window = 15 * 60; // 15分钟窗口

  try {
    const newCount = await CacheManager.increment(key);

    if (newCount === 1) {
      await CacheManager.expire(key, window);
    }
  } catch (error) {
    console.error('Failed to record login failure:', error);
  }
}

// 清除登录失败记录
async function clearLoginFailures(identifier: string): Promise<void> {
  const key = `login_rate_limit:${identifier}`;
  try {
    await CacheManager.del(key);
  } catch (error) {
    console.error('Failed to clear login failures:', error);
  }
}

// 生成JWT Token
function generateToken(user: { id: string; email: string; username: string }, rememberMe: boolean) {
  const payload = {
    userId: user.id,
    email: user.email,
    username: user.username,
  };

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }

  const expiresIn = rememberMe ? '30d' : '7d';

  return jwt.sign(payload, secret, { expiresIn });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 验证输入数据
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: '数据验证失败',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { loginId, password, rememberMe } = validationResult.data;

    // 检查登录限流
    const rateLimit = await checkLoginRateLimit(loginId);
    if (!rateLimit.allowed) {
      const resetDate = new Date(rateLimit.resetTime);
      return NextResponse.json(
        {
          error: '登录尝试过于频繁',
          message: `请在 ${resetDate.toLocaleTimeString('zh-CN')} 后再试`,
          resetTime: rateLimit.resetTime,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': Math.ceil(rateLimit.resetTime / 1000).toString(),
          },
        }
      );
    }

    // 判断登录ID类型：邮箱、手机号或用户名
    const isEmail = loginId.includes('@');
    const isPhone = /^1[3-9]\d{9}$/.test(loginId);

    // 查找用户
    let whereCondition;
    if (isEmail) {
      whereCondition = { email: loginId };
    } else if (isPhone) {
      whereCondition = { phone: loginId };
    } else {
      whereCondition = { username: loginId };
    }

    const user = await prisma.user.findFirst({
      where: whereCondition,
      select: {
        id: true,
        email: true,
        username: true,
        phone: true,
        password: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!user) {
      await recordLoginFailure(loginId);
      return NextResponse.json(
        {
          error: '用户名/邮箱/手机号或密码错误',
          field: 'loginId',
        },
        { status: 401 }
      );
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await recordLoginFailure(loginId);
      return NextResponse.json(
        {
          error: '用户名/邮箱/手机号或密码错误',
          field: 'password',
        },
        { status: 401 }
      );
    }

    // 登录成功，清除失败记录
    await clearLoginFailures(loginId);

    // 生成JWT Token
    const token = generateToken(user, rememberMe);

    // 记录登录信息到缓存
    const loginSession = {
      userId: user.id,
      email: user.email,
      username: user.username,
      loginTime: new Date().toISOString(),
      rememberMe,
    };

    // 缓存会话信息
    const sessionTTL = rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60; // 30天或7天
    await CacheManager.set(`session:${user.id}`, loginSession, { ex: sessionTTL });

    // 更新最后登录时间
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // 移除密码字段
    const { password: _unused, ...userWithoutPassword } = user;
    // 使用未使用的变量来避免 lint 错误
    void _unused;

    const response = NextResponse.json(
      {
        message: '登录成功',
        user: userWithoutPassword,
        token,
        expiresIn: rememberMe ? '30天' : '7天',
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': Math.ceil(rateLimit.resetTime / 1000).toString(),
        },
      }
    );

    // 设置HttpOnly Cookie
    const cookieOptions = [
      `token=${token}`,
      'HttpOnly',
      'Secure',
      'SameSite=Strict',
      `Max-Age=${sessionTTL}`,
      'Path=/',
    ].join('; ');

    response.headers.set('Set-Cookie', cookieOptions);

    return response;
  } catch (error) {
    console.error('登录失败:', error);
    return NextResponse.json(
      {
        error: '登录失败',
        message: '服务器内部错误，请稍后重试',
      },
      { status: 500 }
    );
  }
}
