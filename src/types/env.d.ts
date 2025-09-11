/**
 * 环境变量类型定义
 * 为 process.env 提供类型安全
 */

declare namespace NodeJS {
  interface ProcessEnv {
    // Next.js 环境变量
    NODE_ENV: 'development' | 'production' | 'test';
    NEXT_PUBLIC_APP_URL: string;

    // 数据库
    DATABASE_URL: string;

    // Redis
    UPSTASH_REDIS_REST_URL?: string;
    UPSTASH_REDIS_REST_TOKEN?: string;

    // JWT
    JWT_SECRET: string;

    // 阿里云 OSS
    OSS_REGION?: string;
    OSS_ACCESS_KEY_ID?: string;
    OSS_ACCESS_KEY_SECRET?: string;
    OSS_BUCKET?: string;
    BASE_OSS_URL?: string;

    // 应用配置
    APP_TITLE?: string;
    APP_DESCRIPTION?: string;
    npm_package_version?: string;

    // Tawk.to
    NEXT_PUBLIC_TAWK_WIDGET_ID?: string;
    NEXT_PUBLIC_TAWK_API_KEY?: string;

    // 站点配置
    NEXT_PUBLIC_SITE_URL?: string;

    // 分析和监控
    NEXT_PUBLIC_ENABLE_ANALYTICS?: string;
    SENTRY_DSN?: string;

    // 构建配置
    ANALYZE?: string;

    // 速率限制
    RATE_LIMIT_MAX?: string;
    RATE_LIMIT_WINDOW?: string;

    // 其他
    ENABLE_HTTPS?: string;
    REDIS_PASSWORD?: string;
    POSTGRES_PASSWORD?: string;
  }
}

// Google Analytics gtag 类型定义
declare function gtag(
  command: 'config' | 'event' | 'set',
  targetId: string,
  config?: Record<string, any>
): void;

// 扩展 Window 接口
declare interface Window {
  gtag?: typeof gtag;
}
