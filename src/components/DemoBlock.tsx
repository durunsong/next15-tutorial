'use client';

import { ReactNode } from 'react';

interface DemoBlockProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function DemoBlock({ title, description, children, className = '' }: DemoBlockProps) {
  return (
    <div
      className={`my-6 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${className}`}
    >
      {(title || description) && (
        <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          {title && <h4 className="font-medium text-gray-900 dark:text-white mb-1">{title}</h4>}
          {description && <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>}
        </div>
      )}
      <div className="p-4 bg-white dark:bg-gray-900">{children}</div>
    </div>
  );
}
