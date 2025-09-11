import { Redis } from '@upstash/redis';

import { NextRequest, NextResponse } from 'next/server';

// 初始化 Redis 客户端
const redis = Redis.fromEnv();

// 速率限制配置
const RATE_LIMIT_MAX = parseInt(process.env['RATE_LIMIT_MAX'] || '100');
const RATE_LIMIT_WINDOW = parseInt(process.env['RATE_LIMIT_WINDOW'] || '900000'); // 15分钟

/**
 * 速率限制中间件
 * @param request 请求对象
 * @param identifier 标识符（IP 地址）
 * @returns 是否被限制
 */
async function rateLimit(request: NextRequest, identifier: string): Promise<boolean> {
  try {
    const key = `rate_limit:${identifier}`;
    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, Math.floor(RATE_LIMIT_WINDOW / 1000));
    }

    return current > RATE_LIMIT_MAX;
  } catch (error) {
    console.error('Rate limit error:', error);
    // 如果 Redis 出错，允许请求通过
    return false;
  }
}

/**
 * 获取客户端 IP 地址
 * @param request 请求对象
 * @returns IP 地址
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');

  if (cfConnectingIP) return cfConnectingIP;
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  if (real) return real;

  // NextRequest 没有 ip 属性，返回默认值
  return 'unknown';
}

/**
 * 检查是否为 API 路由
 * @param pathname 路径名
 * @returns 是否为 API 路由
 */
function isApiRoute(pathname: string): boolean {
  return pathname.startsWith('/api/');
}

/**
 * 检查是否需要速率限制
 * @param pathname 路径名
 * @returns 是否需要限制
 */
function needsRateLimit(pathname: string): boolean {
  const sensitiveRoutes = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/captcha/generate',
    '/api/captcha/verify',
    '/api/upload',
  ];

  return sensitiveRoutes.some(route => pathname.startsWith(route));
}

/**
 * 主中间件函数
 * @param request 请求对象
 * @returns 响应对象
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const clientIP = getClientIP(request);

  // 对敏感 API 路由进行速率限制
  if (isApiRoute(pathname) && needsRateLimit(pathname)) {
    const isRateLimited = await rateLimit(request, clientIP);

    if (isRateLimited) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too Many Requests',
          message: '请求过于频繁，请稍后再试',
          retryAfter: Math.floor(RATE_LIMIT_WINDOW / 1000),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.floor(RATE_LIMIT_WINDOW / 1000).toString(),
            'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(Date.now() + RATE_LIMIT_WINDOW).toISOString(),
          },
        }
      );
    }
  }

  // 添加安全头部到响应
  const response = NextResponse.next();

  // 添加基本的安全头部（如果 next.config.ts 中的头部配置失效的话）
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // 为 API 路由添加 CORS 头部
  if (isApiRoute(pathname)) {
    response.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400');
  }

  return response;
}

/**
 * 中间件配置
 */
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了：
     * 1. /api/ 开头但不在特定路径列表中的路由
     * 2. /_next/ (Next.js 内部文件)
     * 3. /_static (静态文件)
     * 4. /favicon.ico (网站图标)
     * 5. /public 文件夹中的文件
     * 6. /robots.txt
     * 7. /sitemap.xml
     * 8. /*.svg, *.png, *.jpg, *.jpeg, *.gif, *.webp (图片文件)
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
