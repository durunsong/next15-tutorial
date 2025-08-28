import { NextRequest, NextResponse } from 'next/server';

import { redis } from '@/lib/redis';

export async function POST(request: NextRequest) {
  try {
    const { key, code } = await request.json();

    if (!key || !code) {
      return NextResponse.json(
        {
          success: false,
          message: '请提供标识符和验证码',
        },
        { status: 400 }
      );
    }

    const redisKey = `captcha:${key}`;

    try {
      // 从Redis获取验证码
      const storedCode = await redis.get(redisKey);

      if (!storedCode) {
        return NextResponse.json({
          success: false,
          message: '验证码已过期或不存在',
          debug: process.env.NODE_ENV === 'development' ? {
            redisKey,
            searchedFor: code,
            timestamp: new Date().toISOString(),
          } : undefined,
        });
      }

      if (storedCode !== code) {
        return NextResponse.json({
          success: false,
          message: '验证码错误',
          debug: process.env.NODE_ENV === 'development' ? {
            expected: storedCode,
            received: code,
            timestamp: new Date().toISOString(),
          } : undefined,
        });
      }

      // 验证成功，删除验证码防止重复使用
      await redis.del(redisKey);

      console.log(`验证码验证成功: ${key} -> ${code}`);

      return NextResponse.json({
        success: true,
        message: '验证码验证成功',
        debug: process.env.NODE_ENV === 'development' ? {
          verifiedAt: new Date().toISOString(),
          redisKeyDeleted: redisKey,
        } : undefined,
      });
    } catch (redisError) {
      console.error('Redis操作失败:', redisError);
      return NextResponse.json(
        {
          success: false,
          message: 'Redis服务不可用，请稍后重试',
          error: process.env.NODE_ENV === 'development' ? String(redisError) : undefined,
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('验证码验证失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: '验证码验证失败',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
