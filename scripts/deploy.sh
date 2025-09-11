#!/bin/bash

# 部署脚本 - Next.js 15 教程项目
# 用途：自动化部署流程

set -e # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查环境变量
check_env() {
    log_info "检查环境变量..."

    required_vars=(
        "DATABASE_URL"
        "JWT_SECRET"
        "UPSTASH_REDIS_REST_URL"
        "UPSTASH_REDIS_REST_TOKEN"
    )

    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            log_error "缺少必需的环境变量: $var"
            exit 1
        fi
    done

    log_success "环境变量检查通过"
}

# 检查依赖
check_dependencies() {
    log_info "检查依赖..."

    dependencies=("node" "pnpm" "docker" "docker-compose")

    for dep in "${dependencies[@]}"; do
        if ! command -v $dep &> /dev/null; then
            log_error "$dep 未安装或不在 PATH 中"
            exit 1
        fi
    done

    log_success "依赖检查通过"
}

# 运行代码质量检查
run_quality_checks() {
    log_info "运行代码质量检查..."

    # TypeScript 类型检查
    log_info "TypeScript 类型检查..."
    pnpm type-check

    # ESLint 检查
    log_info "ESLint 检查..."
    pnpm lint

    # Prettier 格式检查
    log_info "Prettier 格式检查..."
    pnpm format:check

    # 安全漏洞检查
    log_info "安全漏洞检查..."
    pnpm audit --audit-level moderate

    log_success "代码质量检查通过"
}

# 运行测试
run_tests() {
    log_info "运行测试..."

    # 目前项目没有测试，跳过
    log_warning "暂无测试，跳过测试步骤"

    # 未来可以添加：
    # pnpm test
    # pnpm test:e2e
}

# 构建应用
build_app() {
    log_info "构建应用..."

    # 清理缓存
    pnpm clean

    # 安装依赖
    log_info "安装依赖..."
    pnpm install --frozen-lockfile

    # 生成 Prisma 客户端
    log_info "生成 Prisma 客户端..."
    pnpm db:generate

    # 构建应用
    log_info "构建 Next.js 应用..."
    pnpm build

    log_success "应用构建完成"
}

# Docker 部署
deploy_docker() {
    log_info "开始 Docker 部署..."

    # 构建 Docker 镜像
    log_info "构建 Docker 镜像..."
    docker-compose build --no-cache

    # 停止现有容器
    log_info "停止现有容器..."
    docker-compose down

    # 启动新容器
    log_info "启动新容器..."
    docker-compose up -d

    # 等待服务启动
    log_info "等待服务启动..."
    sleep 30

    # 健康检查
    log_info "进行健康检查..."
    if curl -f http://localhost:3000/api/health &> /dev/null; then
        log_success "服务启动成功"
    else
        log_error "服务启动失败"
        docker-compose logs
        exit 1
    fi

    log_success "Docker 部署完成"
}

# 数据库迁移
migrate_database() {
    log_info "执行数据库迁移..."

    # 在生产环境执行迁移
    pnpm db:migrate:prod

    log_success "数据库迁移完成"
}

# 清理
cleanup() {
    log_info "清理临时文件..."

    # 清理 Docker 悬空镜像
    docker image prune -f

    log_success "清理完成"
}

# 主函数
main() {
    log_info "开始部署 Next.js 15 教程项目..."

    # 解析参数
    ENVIRONMENT=${1:-"production"}
    SKIP_CHECKS=${2:-"false"}

    log_info "部署环境: $ENVIRONMENT"

    # 检查环境
    check_dependencies
    check_env

    # 代码质量检查
    if [ "$SKIP_CHECKS" != "true" ]; then
        run_quality_checks
        run_tests
    else
        log_warning "跳过代码质量检查"
    fi

    # 构建应用
    build_app

    # 根据环境选择部署方式
    case $ENVIRONMENT in
        "docker"|"production")
            deploy_docker
            ;;
        "local")
            log_info "本地部署，跳过 Docker 步骤"
            ;;
        *)
            log_error "未知的部署环境: $ENVIRONMENT"
            exit 1
            ;;
    esac

    # 数据库迁移
    if [ "$ENVIRONMENT" != "local" ]; then
        migrate_database
    fi

    # 清理
    cleanup

    log_success "🎉 部署完成！"
    log_info "应用地址: http://localhost:3000"
    log_info "API 健康检查: http://localhost:3000/api/health"
}

# 显示帮助信息
show_help() {
    echo "用法: $0 [环境] [跳过检查]"
    echo ""
    echo "环境选项:"
    echo "  production  生产环境部署 (默认，使用 Docker)"
    echo "  docker      Docker 部署"
    echo "  local       本地部署"
    echo ""
    echo "跳过检查:"
    echo "  true        跳过代码质量检查"
    echo "  false       执行所有检查 (默认)"
    echo ""
    echo "示例:"
    echo "  $0                          # 生产环境部署"
    echo "  $0 docker                   # Docker 部署"
    echo "  $0 local                    # 本地部署"
    echo "  $0 production true          # 生产部署但跳过检查"
}

# 参数处理
case ${1:-} in
    -h|--help)
        show_help
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac
