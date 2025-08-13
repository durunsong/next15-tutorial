# 开发指南

## 项目规范

### 代码风格

项目使用以下工具来确保代码质量和一致性：

- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **TypeScript**: 类型检查
- **Husky**: Git 钩子管理
- **lint-staged**: 提交前代码检查

### 提交规范

项目采用 [Conventional Commits](https://conventionalcommits.org/) 规范：

```
type(scope): description

例如：
feat: add user authentication
fix: resolve login issue
docs: update README
style: format code
refactor: improve code structure
test: add unit tests
chore: update dependencies
```

### 开发工作流

1. **安装依赖**

   ```bash
   pnpm install
   ```

2. **环境配置**

   - 复制 `ENVIRONMENT.md` 中的环境变量模板到 `.env.local`
   - 填写实际的配置值

3. **数据库设置**

   ```bash
   # 生成 Prisma 客户端
   pnpm db:generate

   # 推送数据库架构
   pnpm db:push

   # 运行数据库迁移（生产环境）
   pnpm db:migrate
   ```

4. **启动开发服务器**

   ```bash
   pnpm dev
   ```

5. **代码检查**

   ```bash
   # 运行所有检查
   pnpm ci

   # 单独运行
   pnpm lint          # ESLint 检查
   pnpm type-check    # TypeScript 类型检查
   pnpm format        # Prettier 格式化
   ```

### 文件结构规范

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API 路由
│   ├── (pages)/        # 页面组件
│   └── globals.css     # 全局样式
├── components/         # 复用组件
│   ├── ui/            # 基础 UI 组件
│   └── features/      # 功能组件
├── lib/               # 工具库和配置
├── store/             # 状态管理
├── types/             # TypeScript 类型定义
└── utils/             # 工具函数
```

### 组件命名规范

- **组件文件**: PascalCase (`UserProfile.tsx`)
- **Hook 文件**: camelCase, use 前缀 (`useAuth.ts`)
- **工具函数**: camelCase (`formatDate.ts`)
- **常量文件**: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)

### 导入顺序

1. React 相关
2. Next.js 相关
3. 第三方库
4. 项目内部导入（使用 `@/` 别名）
5. 相对路径导入

### Git 分支策略

- `main`: 生产环境分支
- `develop`: 开发环境分支
- `feature/*`: 功能开发分支
- `fix/*`: 修复分支
- `hotfix/*`: 紧急修复分支

## 常用命令

### 开发命令

```bash
pnpm dev              # 启动开发服务器
pnpm build            # 构建生产版本
pnpm start            # 启动生产服务器
pnpm preview          # 构建并预览
```

### 代码质量

```bash
pnpm lint             # 检查代码质量
pnpm lint:fix         # 自动修复 ESLint 问题
pnpm type-check       # TypeScript 类型检查
pnpm format           # 格式化代码
pnpm format:check     # 检查代码格式
```

### 数据库操作

```bash
pnpm db:generate      # 生成 Prisma 客户端
pnpm db:push          # 推送架构到数据库
pnpm db:pull          # 从数据库拉取架构
pnpm db:migrate       # 运行迁移
pnpm db:studio        # 打开 Prisma Studio
pnpm db:seed          # 运行种子数据
pnpm db:reset         # 重置数据库
```

### 清理命令

```bash
pnpm clean            # 清理 .next 目录
pnpm clean:all        # 清理所有缓存和依赖
pnpm clean:cache      # 清理构建缓存
```

## 推荐的 VS Code 扩展

项目已配置 `.vscode/extensions.json`，VS Code 会自动推荐安装相关扩展。

## 部署

### Docker 部署

```bash
# 构建镜像
docker build -t next15-tutorial .

# 运行容器
docker run -p 3000:3000 next15-tutorial
```

### Vercel 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

## 性能监控

- 使用 Next.js 内置的性能分析工具
- 启用 Web Vitals 监控
- 使用 `ANALYZE=true pnpm build` 分析包大小
