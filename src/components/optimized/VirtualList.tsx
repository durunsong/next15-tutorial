'use client';

import { Spin } from 'antd';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  overscan?: number; // 预渲染的额外项目数
  onScroll?: (scrollTop: number) => void;
  loading?: boolean;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  getItemKey?: (item: T, index: number) => string | number;
}

/**
 * 虚拟滚动列表组件
 * 用于高性能渲染大量列表项
 */
export default function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className,
  style,
  overscan = 5,
  onScroll,
  loading = false,
  loadingComponent,
  emptyComponent,
  getItemKey,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 计算可见范围
  const visibleRange = useMemo(() => {
    const visibleItemCount = Math.ceil(containerHeight / itemHeight);
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(items.length - 1, startIndex + visibleItemCount + 2 * overscan);

    return { startIndex, endIndex, visibleItemCount };
  }, [scrollTop, containerHeight, itemHeight, items.length, overscan]);

  // 计算总高度
  const totalHeight = items.length * itemHeight;

  // 滚动处理
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const newScrollTop = e.currentTarget.scrollTop;
      setScrollTop(newScrollTop);
      onScroll?.(newScrollTop);

      // 滚动状态管理
      isScrollingRef.current = true;
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 150);
    },
    [onScroll]
  );

  // 渲染可见项目
  const visibleItems = useMemo(() => {
    const items_to_render = [];

    for (let i = visibleRange.startIndex; i <= visibleRange.endIndex; i++) {
      if (i >= 0 && i < items.length) {
        const item = items[i];
        const key = getItemKey ? getItemKey(item, i) : i;

        items_to_render.push(
          <div
            key={key}
            style={{
              position: 'absolute',
              top: i * itemHeight,
              left: 0,
              right: 0,
              height: itemHeight,
            }}
          >
            {renderItem(item, i)}
          </div>
        );
      }
    }

    return items_to_render;
  }, [items, visibleRange, itemHeight, renderItem, getItemKey]);

  // 滚动到指定索引
  const scrollToIndex = useCallback(
    (index: number, align: 'start' | 'center' | 'end' = 'start') => {
      if (!scrollElementRef.current) return;

      let scrollTop = 0;
      switch (align) {
        case 'start':
          scrollTop = index * itemHeight;
          break;
        case 'center':
          scrollTop = index * itemHeight - (containerHeight - itemHeight) / 2;
          break;
        case 'end':
          scrollTop = index * itemHeight - containerHeight + itemHeight;
          break;
      }

      scrollTop = Math.max(0, Math.min(scrollTop, totalHeight - containerHeight));
      scrollElementRef.current.scrollTop = scrollTop;
    },
    [itemHeight, containerHeight, totalHeight]
  );

  // 暴露滚动方法
  useEffect(() => {
    const element = scrollElementRef.current;
    if (element) {
      (element as any).scrollToIndex = scrollToIndex;
    }
  }, [scrollToIndex]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // 加载状态
  if (loading) {
    return (
      <div
        className={`flex items-center justify-center ${className || ''}`}
        style={{ height: containerHeight, ...style }}
      >
        {loadingComponent || <Spin size="large" />}
      </div>
    );
  }

  // 空状态
  if (items.length === 0) {
    return (
      <div
        className={`flex items-center justify-center ${className || ''}`}
        style={{ height: containerHeight, ...style }}
      >
        {emptyComponent || (
          <div className="text-gray-500 dark:text-gray-400 text-center">
            <p>暂无数据</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={scrollElementRef}
      className={`overflow-auto ${className || ''}`}
      style={{
        height: containerHeight,
        ...style,
      }}
      onScroll={handleScroll}
    >
      <div
        style={{
          height: totalHeight,
          position: 'relative',
        }}
      >
        {visibleItems}
      </div>
    </div>
  );
}

/**
 * 使用说明：
 *
 * 这个组件提供了高性能的虚拟滚动功能：
 * 1. 只渲染可见区域的项目
 * 2. 支持大量数据的流畅滚动
 * 3. 可配置的预渲染范围
 * 4. 滚动到指定索引的功能
 * 5. 加载和空状态处理
 *
 * 使用示例：
 * <VirtualList
 *   items={largeDataArray}
 *   itemHeight={50}
 *   containerHeight={400}
 *   renderItem={(item, index) => (
 *     <div className="p-2 border-b">
 *       {item.name} - {index}
 *     </div>
 *   )}
 *   getItemKey={(item) => item.id}
 * />
 */
