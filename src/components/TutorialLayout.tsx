'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { ReactNode } from 'react';

import Link from 'next/link';

interface TutorialLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  prevTutorial?: {
    title: string;
    href: string;
  };
  nextTutorial?: {
    title: string;
    href: string;
  };
}

export function TutorialLayout({
  title,
  description,
  children,
  prevTutorial,
  nextTutorial,
}: TutorialLayoutProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 面包屑导航 */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
        <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          首页
        </Link>
        <span>/</span>
        <span>教程</span>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">{title}</span>
      </nav>

      {/* 标题区域 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {title}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">{description}</p>
      </div>

      {/* 教程内容 */}
      <div className="prose prose-lg max-w-none dark:prose-invert">{children}</div>

      {/* 导航按钮 */}
      <div className="flex justify-between items-center mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="flex-1">
          {prevTutorial && (
            <Link
              href={prevTutorial.href}
              className="group flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <div className="text-left">
                <div className="text-sm text-gray-500 dark:text-gray-400">上一篇</div>
                <div className="font-medium">{prevTutorial.title}</div>
              </div>
            </Link>
          )}
        </div>

        <div className="flex-1 text-right">
          {nextTutorial && (
            <Link
              href={nextTutorial.href}
              className="group flex items-center justify-end text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              <div className="text-right">
                <div className="text-sm text-gray-500 dark:text-gray-400">下一篇</div>
                <div className="font-medium">{nextTutorial.title}</div>
              </div>
              <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
