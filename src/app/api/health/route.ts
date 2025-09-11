import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';

/**
 * 健康检查 API 路由
 * 用于监控应用和依赖服务的健康状态
 */

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  checks: {
    database: HealthCheck;
    redis: HealthCheck;
    memory: HealthCheck;
  };
}

interface HealthCheck {
  status: 'pass' | 'fail';
  responseTime?: number;
  error?: string;
  details?: Record<string, any>;
}

/**
 * 检查数据库连接
 */
async function checkDatabase(): Promise<HealthCheck> {
  const start = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;
    const responseTime = Date.now() - start;

    return {
      status: 'pass',
      responseTime,
      details: {
        connected: true,
      },
    };
  } catch (error) {
    const responseTime = Date.now() - start;

    return {
      status: 'fail',
      responseTime,
      error: error instanceof Error ? error.message : 'Unknown database error',
    };
  }
}

/**
 * 检查 Redis 连接
 */
async function checkRedis(): Promise<HealthCheck> {
  const start = Date.now();

  try {
    if (!redis) {
      return {
        status: 'fail',
        responseTime: Date.now() - start,
        error: 'Redis client not available',
      };
    }

    const result = await redis.ping();
    const responseTime = Date.now() - start;

    return {
      status: result === 'PONG' ? 'pass' : 'fail',
      responseTime,
      details: {
        connected: true,
        response: result,
      },
    };
  } catch (_error) {
    const responseTime = Date.now() - start;

    return {
      status: 'fail',
      responseTime,
      error: error instanceof Error ? error.message : 'Unknown Redis error',
    };
  }
}

/**
 * 检查内存使用情况
 */
function checkMemory(): HealthCheck {
  try {
    const memUsage = process.memoryUsage();
    const totalMemMB = Math.round(memUsage.heapTotal / 1024 / 1024);
    const usedMemMB = Math.round(memUsage.heapUsed / 1024 / 1024);
    const usagePercentage = Math.round((usedMemMB / totalMemMB) * 100);

    return {
      status: usagePercentage > 90 ? 'fail' : 'pass',
      details: {
        heapUsed: usedMemMB,
        heapTotal: totalMemMB,
        usagePercentage,
        external: Math.round(memUsage.external / 1024 / 1024),
        rss: Math.round(memUsage.rss / 1024 / 1024),
      },
    };
  } catch (error) {
    return {
      status: 'fail',
      error: error instanceof Error ? error.message : 'Unknown memory error',
    };
  }
}

/**
 * 计算整体健康状态
 */
function calculateOverallStatus(
  checks: HealthCheckResult['checks']
): 'healthy' | 'degraded' | 'unhealthy' {
  const checkValues = Object.values(checks);
  const failedChecks = checkValues.filter(check => check.status === 'fail');

  if (failedChecks.length === 0) {
    return 'healthy';
  } else if (failedChecks.length === checkValues.length) {
    return 'unhealthy';
  } else {
    return 'degraded';
  }
}

/**
 * GET 请求处理
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    // 并行执行所有健康检查
    const [databaseCheck, redisCheck, memoryCheck] = await Promise.all([
      checkDatabase(),
      checkRedis(),
      checkMemory(),
    ]);

    const checks = {
      database: databaseCheck,
      redis: redisCheck,
      memory: memoryCheck,
    };

    const overallStatus = calculateOverallStatus(checks);

    const result: HealthCheckResult = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env['npm_package_version'] || '1.0.0',
      checks,
    };

    // 根据健康状态返回相应的 HTTP 状态码
    const statusCode = overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 207 : 503;

    return NextResponse.json(result, {
      status: statusCode,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Response-Time': `${Date.now() - startTime}ms`,
      },
    });
  } catch (error) {
    console.error('Health check error:', error);

    const errorResult: HealthCheckResult = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env['npm_package_version'] || '1.0.0',
      checks: {
        database: { status: 'fail', error: 'Health check failed' },
        redis: { status: 'fail', error: 'Health check failed' },
        memory: { status: 'fail', error: 'Health check failed' },
      },
    };

    return NextResponse.json(errorResult, {
      status: 503,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Response-Time': `${Date.now() - startTime}ms`,
      },
    });
  }
}

/**
 * HEAD 请求处理 - 简化的健康检查
 */
export async function HEAD(_request: NextRequest): Promise<NextResponse> {
  try {
    // 简单的数据库连接检查
    await prisma.$queryRaw`SELECT 1`;

    return new NextResponse(null, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    return new NextResponse(null, {
      status: 503,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  }
}
