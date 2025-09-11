'use client';

import { useMemo } from 'react';

interface TechStackItem {
  category: 'frontend' | 'backend' | 'database' | 'cloud' | 'tools';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface StaticStatsProps {
  techStack: TechStackItem[];
  className?: string;
}

/**
 * 静态统计组件
 * 避免 SSR/CSR 不匹配问题
 */
export function StaticStats({ techStack, className = '' }: StaticStatsProps) {
  // 使用 useMemo 确保统计结果稳定
  const stats = useMemo(() => {
    const categoryStats = techStack.reduce(
      (acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const difficultyStats = techStack.reduce(
      (acc, item) => {
        acc[item.difficulty] = (acc[item.difficulty] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      category: categoryStats,
      difficulty: difficultyStats,
      total: techStack.length,
    };
  }, [techStack]);

  return (
    <div className={className}>
      {/* 分类统计 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-green-600">{stats.category['frontend'] || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">前端技术</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.category['backend'] || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">后端技术</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-indigo-600">
            {stats.category['database'] || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">数据库</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-blue-600">
            {(stats.category['cloud'] || 0) + (stats.category['tools'] || 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">云服务&工具</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-gray-600">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">总计</div>
        </div>
      </div>

      {/* 难度统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">全部难度</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-green-600">
            {stats.difficulty['beginner'] || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">初级</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {stats.difficulty['intermediate'] || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">中级</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-red-600">{stats.difficulty['advanced'] || 0}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">高级</div>
        </div>
      </div>
    </div>
  );
}

export default StaticStats;
