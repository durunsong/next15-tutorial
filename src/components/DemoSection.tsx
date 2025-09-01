'use client';

import { Code, Eye } from 'lucide-react';

import { ReactNode, useState } from 'react';

interface DemoSectionProps {
  title: string;
  description?: string;
  demoComponent: ReactNode;
  codeComponent: ReactNode;
  defaultTab?: 'demo' | 'code';
}

export function DemoSection({
  title,
  description,
  demoComponent,
  codeComponent,
  defaultTab = 'demo',
}: DemoSectionProps) {
  const [activeTab, setActiveTab] = useState<'demo' | 'code'>(defaultTab);

  return (
    <div className="my-8">
      {/* 标题和描述 */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        {description && <p className="text-gray-600 dark:text-gray-300">{description}</p>}
      </div>

      {/* 选项卡 */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <button
            onClick={() => setActiveTab('demo')}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'demo'
                ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Eye className="h-4 w-4" />
            <span>演示</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'code'
                ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Code className="h-4 w-4" />
            <span>代码</span>
          </button>
        </div>

        {/* 内容区域 */}
        <div className="bg-white dark:bg-gray-900">
          {activeTab === 'demo' ? (
            <div className="p-6">{demoComponent}</div>
          ) : (
            <div>{codeComponent}</div>
          )}
        </div>
      </div>
    </div>
  );
}
