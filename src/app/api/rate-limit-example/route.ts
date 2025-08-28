import { NextRequest, NextResponse } from 'next/server';

import { CacheManager } from '@/lib/redis';

/**
 * 限流测试API
 * 每个IP在60秒内最多允许5次请求
 */
export async function GET(request: NextRequest) {
  try {
    // 获取客户端IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    // 应用限流，每60秒最多5次请求
    const requestKey = `ratelimit:${ip}`;
    try {
      // 获取当前计数
      const currentCount = await CacheManager.get<string>(requestKey);
      const count = parseInt(currentCount || '0', 10);

      // 如果计数为0或不存在，说明是新的时间窗口
      if (count === 0 || !currentCount) {
        // 设置初始计数为1并设置过期时间60秒
        await CacheManager.set(requestKey, '1', { ex: 60 });
        
        return NextResponse.json({
          success: true,
          message: '请求成功',
          ip: ip,
          count: 1,
          timestamp: new Date().toISOString(),
        });
      }

      // 如果已经超过限制
      if (count >= 5) {
        const ttl = await CacheManager.ttl(requestKey);
        return NextResponse.json(
          {
            success: false,
            message: '请求频率过高，请稍后再试',
            ip: ip,
            count: count,
            retryAfter: `${ttl}秒`,
            timestamp: new Date().toISOString(),
          },
          {
            status: 429, // Too Many Requests
            headers: {
              'Retry-After': String(ttl),
            },
          }
        );
      }

      // 增加计数
      const newCount = await CacheManager.increment(requestKey);
      
      return NextResponse.json({
        success: true,
        message: '请求成功',
        ip: ip,
        count: newCount,
        timestamp: new Date().toISOString(),
      });
    } catch (redisError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Redis操作失败',
          error: redisError instanceof Error ? redisError.message : String(redisError),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: '限流测试失败',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
