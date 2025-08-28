import { NextRequest, NextResponse } from 'next/server';

import { redis } from '@/lib/redis';

export async function POST(request: NextRequest) {
  try {
    const { key } = await request.json();

    if (!key) {
      return NextResponse.json(
        {
          success: false,
          message: '请提供标识符（邮箱或手机号）',
        },
        { status: 400 }
      );
    }

    // 生成6位数验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const redisKey = `captcha:${key}`;

    try {
      // 存储验证码，5分钟过期
      await redis.set(redisKey, code, { ex: 300 });

      console.log(`验证码生成成功: ${key} -> ${code}`);

      return NextResponse.json({
        success: true,
        code: process.env.NODE_ENV === 'development' ? code : undefined, // 开发环境返回验证码
        message: '验证码生成成功',
        expiresIn: '5分钟',
        redisKey: process.env.NODE_ENV === 'development' ? redisKey : undefined,
        debug: process.env.NODE_ENV === 'development' ? {
          environment: 'development',
          timestamp: new Date().toISOString(),
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
    console.error('验证码生成失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: '验证码生成失败',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
