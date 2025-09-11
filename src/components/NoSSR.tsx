'use client';

import { ComponentType } from 'react';

import dynamic from 'next/dynamic';

/**
 * 禁用 SSR 的高阶组件
 * 用于解决某些组件的 Hydration 问题
 */
function NoSSRWrapper<T extends Record<string, any>>(Component: ComponentType<T>) {
  return dynamic(() => Promise.resolve(Component), {
    ssr: false,
    loading: () => <div className="text-gray-400">Loading...</div>,
  });
}

export default NoSSRWrapper;
