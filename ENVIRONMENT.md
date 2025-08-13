# 环境变量配置指南

## 环境变量模板

复制以下内容到你的 `.env.local` 文件中：

```bash
# 应用配置
APP_TITLE="Next.js 15 教程项目"
APP_DESCRIPTION="一个完整的Next.js 15全栈教程项目"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# 数据库配置 (Neon PostgreSQL)
DATABASE_URL="postgresql://username:password@hostname:5432/database?sslmode=require"

# Redis 配置 (Upstash)
UPSTASH_REDIS_REST_URL="https://your-redis-url.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-redis-token"

# JWT 密钥
JWT_SECRET="your-jwt-secret-key-here"

# 阿里云 OSS 配置
ALIBABA_CLOUD_ACCESS_KEY_ID="your-access-key-id"
ALIBABA_CLOUD_ACCESS_KEY_SECRET="your-access-key-secret"
ALIBABA_CLOUD_OSS_BUCKET="your-bucket-name"
ALIBABA_CLOUD_OSS_REGION="oss-cn-hangzhou"
ALIBABA_CLOUD_OSS_ENDPOINT="https://oss-cn-hangzhou.aliyuncs.com"

# 开发环境配置
NODE_ENV="development"
NEXT_PUBLIC_ENV="development"

# 可选配置
DEBUG="false"
ANALYZE="false"
```

## 环境变量说明

### 必需配置

1. **DATABASE_URL**: Neon PostgreSQL 数据库连接字符串
2. **JWT_SECRET**: 用于 JWT 令牌签名的密钥
3. **UPSTASH_REDIS_REST_URL**: Redis 数据库 URL
4. **UPSTASH_REDIS_REST_TOKEN**: Redis 数据库访问令牌

### 可选配置

1. **阿里云 OSS**: 用于文件上传存储
2. **调试选项**: 开发时的调试配置

## 配置步骤

1. 复制上述模板到 `.env.local` 文件
2. 替换占位符值为实际的配置信息
3. 确保 `.env.local` 文件不被提交到版本控制系统
