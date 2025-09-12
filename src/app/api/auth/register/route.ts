import bcrypt from 'bcryptjs';
import { z } from 'zod';

import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { CacheManager } from '@/lib/redis';

// 注册验证schema
const registerSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  username: z
    .string()
    .min(3, '用户名至少3个字符')
    .max(20, '用户名最多20个字符')
    .regex(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线'),
  phone: z
    .string()
    .regex(/^1[3-9]\d{9}$/, '请输入有效的手机号')
    .optional()
    .or(z.literal('')),
  password: z.string().min(6, '密码至少6个字符').max(128, '密码最多128个字符'),
  avatar: z.string().optional(),
});

// 密码强度检查
function checkPasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  // 长度检查
  if (password.length >= 8) {
    score += 20;
  } else {
    feedback.push('密码长度至少8位');
  }

  // 包含小写字母
  if (/[a-z]/.test(password)) {
    score += 20;
  } else {
    feedback.push('需要包含小写字母');
  }

  // 包含大写字母
  if (/[A-Z]/.test(password)) {
    score += 20;
  } else {
    feedback.push('需要包含大写字母');
  }

  // 包含数字
  if (/\d/.test(password)) {
    score += 20;
  } else {
    feedback.push('需要包含数字');
  }

  // 包含特殊字符
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 20;
  } else {
    feedback.push('建议包含特殊字符');
  }

  return { score, feedback };
}

// 限流检查
async function checkRateLimit(ip: string): Promise<{
  allowed: boolean;
  remaining: number;
  resetTime: number;
}> {
  const key = `register_rate_limit:${ip}`;
  const limit = 1; // 5分钟内最多1次注册
  const window = 5 * 60; // 5分钟窗口

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

    // 递增计数器
    const newCount = await CacheManager.increment(key);

    // 设置过期时间
    if (newCount === 1) {
      await CacheManager.expire(key, window);
    }

    const resetTime = Date.now() + window * 1000;
    return {
      allowed: true,
      remaining: Math.max(0, limit - newCount),
      resetTime,
    };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    // Redis错误时允许注册
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: Date.now() + window * 1000,
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    // 获取客户端IP
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    // 确保 ip 始终为 string 类型，避免 TypeScript 类型错误
    const ip: string = forwarded
      ? forwarded.split(',')[0]?.trim() || 'unknown'
      : realIp || 'unknown';

    // 检查限流
    const rateLimit = await checkRateLimit(ip);
    if (!rateLimit.allowed) {
      const resetDate = new Date(rateLimit.resetTime);
      return NextResponse.json(
        {
          error: '注册过于频繁',
          message: `请在 ${resetDate.toLocaleTimeString('zh-CN')} 后再试`,
          resetTime: rateLimit.resetTime,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '1',
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': Math.ceil(rateLimit.resetTime / 1000).toString(),
          },
        }
      );
    }

    const body = await req.json();

    // 验证输入数据
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: '数据验证失败',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { email, username, phone, password } = validationResult.data;

    // 检查密码强度（降低要求）
    const passwordStrength = checkPasswordStrength(password);
    if (passwordStrength.score < 40) {
      return NextResponse.json(
        {
          error: '密码强度不足',
          message: '密码太简单，请选择更安全的密码',
          feedback: passwordStrength.feedback,
          score: passwordStrength.score,
        },
        { status: 400 }
      );
    }

    // 检查用户是否已存在
    const whereConditions: Array<{ email?: string; username?: string; phone?: string }> = [
      { email },
      { username },
    ];
    if (phone && phone.trim()) {
      whereConditions.push({ phone });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: whereConditions,
      },
    });

    if (existingUser) {
      let conflictField = '邮箱';
      let field = 'email';

      if (existingUser.email === email) {
        conflictField = '邮箱';
        field = 'email';
      } else if (existingUser.username === username) {
        conflictField = '用户名';
        field = 'username';
      } else if (existingUser.phone === phone) {
        conflictField = '手机号';
        field = 'phone';
      }

      return NextResponse.json(
        {
          error: `${conflictField}已被使用`,
          field,
        },
        { status: 409 }
      );
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 12);

    // 创建用户
    const user = await prisma.user.create({
      data: {
        email,
        username,
        phone: phone && phone.trim() ? phone : null,
        password: hashedPassword,
        avatar: null,
      },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        createdAt: true,
      },
    });

    // 记录注册成功的缓存
    await CacheManager.set(`user_registered:${user.id}`, true, { ex: 24 * 60 * 60 }); // 24小时

    return NextResponse.json(
      {
        message: '注册成功',
        user,
        passwordStrength: {
          score: passwordStrength.score,
          level: passwordStrength.score >= 80 ? '强' : passwordStrength.score >= 60 ? '中' : '弱',
        },
      },
      {
        status: 201,
        headers: {
          'X-RateLimit-Limit': '1',
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': Math.ceil(rateLimit.resetTime / 1000).toString(),
        },
      }
    );
  } catch (error) {
    console.error('注册失败:', error);
    return NextResponse.json(
      {
        error: '注册失败',
        message: '服务器内部错误，请稍后重试',
      },
      { status: 500 }
    );
  }
}
