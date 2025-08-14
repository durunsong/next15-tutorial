#!/usr/bin/env node

/**
 * Git Hooks 设置脚本
 * 自动安装和配置项目的 Git hooks
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { execSync } = require('child_process');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

console.log('🚀 开始设置 Git Hooks...\n');

// 检查是否在项目根目录
if (!fs.existsSync('package.json')) {
  console.error('❌ 错误：请在项目根目录运行此脚本');
  process.exit(1);
}

// 检查是否安装了依赖
console.log('📦 检查依赖...');
try {
  execSync('pnpm --version', { stdio: 'ignore' });
} catch {
  console.error('❌ 错误：请先安装 pnpm');
  console.error('安装命令：npm install -g pnpm');
  process.exit(1);
}

// 安装新的依赖（如果需要）
console.log('📦 安装/更新依赖...');
try {
  console.log('正在安装 commitizen 和相关工具...');
  execSync('pnpm install', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ 依赖安装失败:', error.message);
  process.exit(1);
}

// 初始化 husky
console.log('🐕 设置 Husky...');
try {
  execSync('npx husky install', { stdio: 'inherit' });
} catch {
  console.warn('⚠️  Husky 初始化可能失败，但这通常不是问题');
}

// 检查 Git hooks 文件
const hooksDir = '.husky';
const requiredHooks = ['pre-commit', 'pre-push', 'commit-msg'];

console.log('🔍 检查 Git hooks...');
requiredHooks.forEach(hook => {
  const hookPath = path.join(hooksDir, hook);
  if (fs.existsSync(hookPath)) {
    console.log(`✅ ${hook} hook 已存在`);
  } else {
    console.warn(`⚠️  ${hook} hook 不存在`);
  }
});

// 验证配置
console.log('\n🧪 验证配置...');

// 检查 package.json 脚本
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = [
  'lint',
  'type-check',
  'format',
  'format:check',
  'commit',
  'commit-ready',
  'push-ready',
];

console.log('📋 检查 package.json 脚本...');
const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);

if (missingScripts.length > 0) {
  console.warn('⚠️  缺少以下脚本:', missingScripts.join(', '));
} else {
  console.log('✅ 所有必需的脚本都已配置');
}

// 检查 commitizen 配置
if (packageJson.config && packageJson.config.commitizen) {
  console.log('✅ Commitizen 已配置');
} else {
  console.warn('⚠️  Commitizen 配置缺失');
}

// 运行快速测试
console.log('\n🧪 运行快速测试...');
try {
  console.log('测试 lint...');
  execSync('pnpm lint --max-warnings 0', { stdio: 'pipe' });
  console.log('✅ Lint 测试通过');
} catch {
  console.warn('⚠️  Lint 测试有警告或错误，请检查');
}

try {
  console.log('测试 type-check...');
  execSync('pnpm type-check', { stdio: 'pipe' });
  console.log('✅ 类型检查通过');
} catch {
  console.warn('⚠️  类型检查有错误，请修复');
}

// 显示使用指南
console.log('\n🎉 Git Hooks 设置完成！\n');

console.log('📖 使用指南:');
console.log('├── 📝 提交代码:');
console.log('│   ├── pnpm commit (推荐，交互式)');
console.log('│   └── git commit -m "feat: 描述"');
console.log('├── 🔍 代码检查:');
console.log('│   ├── pnpm commit-ready (提交前检查)');
console.log('│   ├── pnpm push-ready (推送前检查)');
console.log('│   ├── pnpm quick-check (快速检查)');
console.log('│   └── pnpm full-check (完整检查)');
console.log('└── 📚 查看文档: 阅读 GIT_HOOKS_GUIDE.md');

console.log('\n✨ 现在您可以享受高质量的代码提交流程了！');
