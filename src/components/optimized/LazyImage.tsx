'use client';

import { Skeleton } from 'antd';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  quality?: number;
  fill?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * 优化的懒加载图片组件
 * 支持渐进式加载、错误处理、占位符等功能
 */
export default function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  style,
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  sizes,
  quality = 85,
  fill = false,
  objectFit = 'cover',
  objectPosition,
  onLoad,
  onError,
}: LazyImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || imageLoaded) return;

    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px 0px', // 提前50px开始加载
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, imageLoaded]);

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    onError?.();
  };

  // 生成低质量占位符
  const generateBlurDataURL = (w: number, h: number) => {
    return `data:image/svg+xml;base64,${Buffer.from(
      `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)" />
      </svg>`
    ).toString('base64')}`;
  };

  const imageProps = {
    src,
    alt,
    quality,
    onLoad: handleLoad,
    onError: handleError,
    className: `transition-opacity duration-300 ${
      imageLoaded ? 'opacity-100' : 'opacity-0'
    } ${className || ''}`,
    ...(sizes && { sizes }),
    ...(placeholder === 'blur' && {
      placeholder: 'blur' as const,
      blurDataURL:
        blurDataURL || (width && height ? generateBlurDataURL(width, height) : undefined),
    }),
    ...(fill
      ? {
          fill: true,
          style: {
            objectFit,
            objectPosition,
            ...style,
          },
        }
      : {
          width: width || 0,
          height: height || 0,
          style,
        }),
  };

  // 错误状态
  if (imageError) {
    return (
      <div
        ref={imgRef}
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className || ''}`}
        style={{
          width: fill ? '100%' : width,
          height: fill ? '100%' : height,
          ...style,
        }}
      >
        <div className="text-center text-gray-500 dark:text-gray-400">
          <svg
            className="w-8 h-8 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm">图片加载失败</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={imgRef}
      className="relative"
      style={{
        width: fill ? '100%' : width,
        height: fill ? '100%' : height,
      }}
    >
      {/* 加载骨架屏 */}
      {!imageLoaded && (
        <Skeleton.Image
          active
          style={{
            width: fill ? '100%' : width,
            height: fill ? '100%' : height,
            position: fill ? 'absolute' : 'static',
            top: 0,
            left: 0,
          }}
        />
      )}

      {/* 实际图片 */}
      {(isInView || priority) && <Image {...imageProps} />}
    </div>
  );
}

/**
 * 使用说明：
 *
 * 这个组件提供了优化的图片加载功能：
 * 1. 自动懒加载（除非设置priority）
 * 2. 渐进式加载动画
 * 3. 错误状态处理
 * 4. 骨架屏占位符
 * 5. 自动生成模糊占位符
 * 6. 支持Next.js Image的所有功能
 *
 * 使用示例：
 * <LazyImage
 *   src="/images/hero.jpg"
 *   alt="Hero image"
 *   width={800}
 *   height={600}
 *   placeholder="blur"
 *   className="rounded-lg"
 * />
 */
