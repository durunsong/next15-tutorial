import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    // 全局忽略文件
    ignores: [
      // 依赖目录
      'node_modules/**',
      // 构建输出
      '.next/**',
      'out/**',
      'dist/**',
      'build/**',
      // Prisma生成的文件
      'prisma/generated/**',
      'src/generated/**',
      // 类型声明文件
      '**/*.d.ts',
      'next-env.d.ts',
      // 日志文件
      '**/*.log',
      // 配置文件
      'tailwind.config.js',
      'postcss.config.mjs',
      // 锁文件
      'pnpm-lock.yaml',
      'yarn.lock',
      'package-lock.json',
    ],
  },
  {
    // TypeScript 和 React 特定规则
    files: ['**/*.{ts,tsx}'],
    rules: {
      // TypeScript 相关规则
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',

      // React 相关规则 (逐步启用)
      'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],
      'react/jsx-boolean-value': ['warn', 'never'], // 先设为 warn
      'react/jsx-fragments': ['warn', 'syntax'],
      'react/no-array-index-key': 'warn',
      'react/self-closing-comp': 'warn', // 先设为 warn

      // Next.js 相关规则
      '@next/next/no-img-element': 'error',
      '@next/next/no-html-link-for-pages': 'error',

      // 通用代码质量规则 (逐步启用严格规则)
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': 'warn', // 统一设为 warn，允许开发时使用
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'no-duplicate-imports': 'warn', // 先设为 warn
      'no-unused-expressions': 'warn', // 先设为 warn
      eqeqeq: ['warn', 'always'], // 先设为 warn
      curly: 'off', // 临时禁用，避免大量格式修改
    },
  },
  {
    // API 路由特定规则
    files: ['src/app/api/**/*.{ts,tsx}', 'pages/api/**/*.{ts,tsx}'],
    rules: {
      'no-console': 'off', // API 路由中允许 console
    },
  },
];

export default eslintConfig;
