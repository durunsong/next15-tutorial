import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * 获取数据库信息和统计数据
 * GET /api/database
 */
export async function GET() {
  try {
    // 执行多个查询来获取数据库信息
    const [
      versionResult,
      sizeResult,
      tableCountResult,
      userCountResult,
      postCountResult,
      commentCountResult,
    ] = await Promise.all([
      // 获取 PostgreSQL 版本信息
      prisma.$queryRaw<Array<{ version: string }>>`SELECT version()`,
      
      // 获取数据库大小
      prisma.$queryRaw<Array<{ size: string }>>`
        SELECT pg_size_pretty(pg_database_size(current_database())) as size
      `,
      
      // 获取用户表数量（非系统表）
      prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `,
      
      // 获取用户数量
      prisma.user.count(),
      
      // 获取文章数量
      prisma.post.count(),
      
      // 获取评论数量
      prisma.comment.count(),
    ]);

    // 获取总表数量（包括系统表）
    const totalTableResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema IN ('public', 'information_schema', 'pg_catalog')
    `;

    // 获取当前数据库名称
    const databaseNameResult = await prisma.$queryRaw<Array<{ current_database: string }>>`
      SELECT current_database()
    `;

    // 获取当前用户
    const currentUserResult = await prisma.$queryRaw<Array<{ current_user: string }>>`
      SELECT current_user
    `;

    // 处理结果
    const version = versionResult[0]?.version || 'Unknown';
    const shortVersion = version.split(' ')[1] || 'Unknown';
    const size = sizeResult[0]?.size || 'Unknown';
    const userTables = Number(tableCountResult[0]?.count || 0);
    const totalTables = Number(totalTableResult[0]?.count || 0);
    const databaseName = databaseNameResult[0]?.current_database || 'Unknown';
    const currentUser = currentUserResult[0]?.current_user || 'Unknown';

    const responseData = {
      success: true,
      data: {
        database: {
          name: databaseName,
          version: shortVersion,
          size: size,
          fullVersion: version,
          currentUser: currentUser,
        },
        statistics: {
          userTables,
          totalTables,
          userCount: userCountResult,
          postCount: postCountResult,
          commentCount: commentCountResult,
        },
        environment: {
          nodeVersion: process.version,
          platform: process.platform,
          isDevelopment: process.env.NODE_ENV === 'development',
        },
        queriedAt: new Date().toISOString(),
      },
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Database API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Database query failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

/**
 * 健康检查端点
 * HEAD /api/database
 */
export async function HEAD() {
  try {
    // 简单的数据库连接测试
    await prisma.$queryRaw`SELECT 1`;
    
    return new Response(null, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache',
      }
    });
  } catch (error) {
    console.error('Database health check failed:', error);
    return new Response(null, { status: 503 });
  }
}

