#!/usr/bin/env node

/**
 * Git Hooks 设置脚本
 *
 * 本脚本用于设置项目的 Git hooks，包括：
 * - pre-commit: 代码质量检查和格式化
 * - pre-push: 构建和测试验证
 *
 * 使用方法：node setup-git-hooks.js
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function createGitHooksDir() {
  const gitHooksDir = path.join('.git', 'hooks');
  if (!fs.existsSync(gitHooksDir)) {
    fs.mkdirSync(gitHooksDir, { recursive: true });
    log('✅ 创建 .git/hooks 目录', colors.green);
  }
  return gitHooksDir;
}

function writeHookFile(hookPath, content) {
  try {
    fs.writeFileSync(hookPath, content, { mode: 0o755 });
    log(`✅ 创建 ${path.basename(hookPath)} hook`, colors.green);
    return true;
  } catch (error) {
    log(`❌ 创建 ${path.basename(hookPath)} hook 失败: ${error.message}`, colors.red);
    return false;
  }
}

function setupPreCommitHook(gitHooksDir) {
  const preCommitPath = path.join(gitHooksDir, 'pre-commit');
  const preCommitContent = `#!/bin/sh

# Pre-commit hook: 代码质量检查
echo "🔍 运行 pre-commit 检查..."

# 运行 lint-staged (如果有暂存的文件)
if command -v npx >/dev/null 2>&1; then
    echo "📝 运行 lint-staged..."
    npx lint-staged
    if [ $? -ne 0 ]; then
        echo "❌ lint-staged 检查失败"
        exit 1
    fi
fi

# 运行代码质量检查
echo "🔧 运行代码质量检查..."
npm run code-quality:check 2>/dev/null || pnpm code-quality:check 2>/dev/null || yarn code-quality:check
if [ $? -ne 0 ]; then
    echo "❌ 代码质量检查失败"
    echo "💡 请运行 'npm run code-quality:fix' 或 'pnpm code-quality:fix' 修复问题"
    exit 1
fi

echo "✅ Pre-commit 检查通过"
`;

  return writeHookFile(preCommitPath, preCommitContent);
}

function setupPrePushHook(gitHooksDir) {
  const prePushPath = path.join(gitHooksDir, 'pre-push');
  const prePushContent = `#!/bin/sh

# Pre-push hook: 构建验证
echo "🚀 运行 pre-push 检查..."

# 运行完整的代码质量检查
echo "🔧 运行代码质量检查..."
npm run code-quality:check 2>/dev/null || pnpm code-quality:check 2>/dev/null || yarn code-quality:check
if [ $? -ne 0 ]; then
    echo "❌ 代码质量检查失败"
    exit 1
fi

# 运行构建测试（可选，根据需要启用）
# echo "🔨 运行构建测试..."
# npm run build 2>/dev/null || pnpm build 2>/dev/null || yarn build
# if [ $? -ne 0 ]; then
#     echo "❌ 构建失败"
#     exit 1
# fi

echo "✅ Pre-push 检查通过"
`;

  return writeHookFile(prePushPath, prePushContent);
}

function setupCommitMsgHook(gitHooksDir) {
  const commitMsgPath = path.join(gitHooksDir, 'commit-msg');
  const commitMsgContent = `#!/bin/sh

# Commit message hook: 验证提交消息格式
commit_regex='^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\\(.+\\))?: .{1,50}'

if ! grep -qE "$commit_regex" "$1"; then
    echo "❌ 无效的提交消息格式"
    echo ""
    echo "提交消息应遵循 Conventional Commits 格式："
    echo "  <type>(<scope>): <subject>"
    echo ""
    echo "示例："
    echo "  feat(auth): 添加用户登录功能"
    echo "  fix(api): 修复用户数据获取问题"
    echo "  docs: 更新 README 文档"
    echo ""
    echo "类型 (type):"
    echo "  feat:     新功能"
    echo "  fix:      Bug 修复"
    echo "  docs:     文档变更"
    echo "  style:    代码风格变更（不影响逻辑）"
    echo "  refactor: 重构代码"
    echo "  test:     添加或修改测试"
    echo "  chore:    构建过程或辅助工具变更"
    echo "  perf:     性能优化"
    echo "  ci:       CI 配置变更"
    echo "  build:    构建系统变更"
    echo "  revert:   回退提交"
    echo ""
    exit 1
fi
`;

  return writeHookFile(commitMsgPath, commitMsgContent);
}

function main() {
  log('🔧 开始设置 Git Hooks...', colors.bright);

  // 检查是否在 Git 仓库中
  if (!fs.existsSync('.git')) {
    log('❌ 当前目录不是 Git 仓库', colors.red);
    process.exit(1);
  }

  // 创建 hooks 目录
  const gitHooksDir = createGitHooksDir();

  let successCount = 0;
  let totalHooks = 0;

  // 设置各种 hooks
  totalHooks++;
  if (setupPreCommitHook(gitHooksDir)) successCount++;

  totalHooks++;
  if (setupPrePushHook(gitHooksDir)) successCount++;

  totalHooks++;
  if (setupCommitMsgHook(gitHooksDir)) successCount++;

  // 总结
  log('', colors.reset);
  if (successCount === totalHooks) {
    log('🎉 Git Hooks 设置完成！', colors.green);
    log('', colors.reset);
    log('已设置的 hooks:', colors.bright);
    log('  • pre-commit:  代码质量检查和格式化', colors.blue);
    log('  • pre-push:    构建和测试验证', colors.blue);
    log('  • commit-msg:  提交消息格式验证', colors.blue);
    log('', colors.reset);
    log('💡 提示：如需禁用特定 hook，可以在提交时使用 --no-verify 参数', colors.yellow);
    log('   例如：git commit --no-verify -m "临时提交"', colors.yellow);
  } else {
    log(`⚠️  部分 Git Hooks 设置失败 (${successCount}/${totalHooks})`, colors.yellow);
    process.exit(1);
  }
}

// 运行主函数
main();
