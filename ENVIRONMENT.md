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

# Tawk.to 客服配置 (可选)
# 访问 https://www.tawk.to/ 获取你的 Widget ID 和 API Key
NEXT_PUBLIC_TAWK_WIDGET_ID="your-tawk-widget-id"
NEXT_PUBLIC_TAWK_API_KEY="your-tawk-api-key"

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
2. **Tawk.to 客服**: 用于在线客服功能
3. **调试选项**: 开发时的调试配置

## 配置步骤

1. 复制上述模板到 `.env.local` 文件
2. 替换占位符值为实际的配置信息
3. 确保 `.env.local` 文件不被提交到版本控制系统

## Tawk.to 客服配置指南

### 1. 注册 Tawk.to 账户

访问 [https://www.tawk.to/](https://www.tawk.to/) 注册账户

### 2. 创建属性

1. 登录后，点击 "Add New Property"
2. 输入你的网站名称和 URL
3. 选择适合的分类

### 3. 获取配置信息

1. 在 Dashboard 中，点击你的属性
2. 进入 "Administration" > "Channels" > "Chat Widget"
3. 复制 Widget ID（通常是一个长字符串）
4. API Key 可以在 "Administration" > "Developer API" 中找到

### 4. 配置环境变量

```bash
# 将获取的值替换到环境变量中
NEXT_PUBLIC_TAWK_WIDGET_ID="你的-widget-id"
NEXT_PUBLIC_TAWK_API_KEY="你的-api-key"
```

### 5. 自定义设置

组件支持以下自定义选项：

- `position`: 聊天窗口位置 ('bottom-right' | 'bottom-left')
- `showPreChatForm`: 是否显示预聊天表单
- `showOfflineForm`: 是否显示离线表单
- `enableInDev`: 是否在开发环境中启用（默认 false）

### 注意事项

- Widget ID 和 API Key 都是公开的，可以安全地放在环境变量中
- 在开发环境中，组件默认不加载，需要设置 `enableInDev={true}` 来启用
