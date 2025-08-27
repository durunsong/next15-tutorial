'use client';

import Head from 'next/head';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  robots?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  locale?: string;
  alternateLocales?: { locale: string; url: string }[];
  structuredData?: object;
}

/**
 * SEO优化组件
 * 提供完整的SEO meta标签支持
 */
export default function SEOHead({
  title = 'Next.js 15 教程项目 - 现代全栈开发指南',
  description = '学习Next.js 15、React 19、TypeScript、Prisma、Redis等现代全栈开发技术栈。完整的教程项目，包含实战演示和最佳实践。',
  keywords = ['Next.js', 'React', 'TypeScript', 'Prisma', 'Redis', '全栈开发', '教程'],
  canonical,
  ogImage = '/images/og-default.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  robots = 'index,follow',
  author = 'Next.js教程团队',
  publishedTime,
  modifiedTime,
  locale = 'zh_CN',
  alternateLocales = [],
  structuredData,
}: SEOHeadProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : undefined;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

  // 生成结构化数据
  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: title,
    description,
    url: siteUrl,
    author: {
      '@type': 'Organization',
      name: author,
    },
    inLanguage: locale.replace('_', '-'),
    ...(publishedTime && { datePublished: publishedTime }),
    ...(modifiedTime && { dateModified: modifiedTime }),
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Head>
      {/* 基础SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      <meta name="robots" content={robots} />

      {/* 语言和地区 */}
      <meta httpEquiv="content-language" content={locale.replace('_', '-')} />
      <meta name="language" content={locale.replace('_', '-')} />

      {/* 规范链接 */}
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}

      {/* 多语言支持 */}
      {alternateLocales.map(({ locale: altLocale, url }) => (
        <link
          key={altLocale}
          rel="alternate"
          hrefLang={altLocale.replace('_', '-')}
          href={`${siteUrl}${url}`}
        />
      ))}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:url" content={fullCanonical || siteUrl} />
      <meta property="og:site_name" content="Next.js 15 教程项目" />
      <meta property="og:locale" content={locale} />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />

      {/* 文章特定元数据 */}
      {ogType === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {ogType === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {ogType === 'article' && author && <meta property="article:author" content={author} />}

      {/* 移动端优化 */}
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />

      {/* 性能提示 */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//gw.alipayobjects.com" />

      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(finalStructuredData),
        }}
      />

      {/* 网站图标 */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />

      {/* 主题颜色 */}
      <meta name="theme-color" content="#3b82f6" />
      <meta name="msapplication-TileColor" content="#3b82f6" />
    </Head>
  );
}

/**
 * 使用说明：
 *
 * 这个组件提供了完整的SEO优化功能：
 * 1. 基础SEO meta标签
 * 2. Open Graph和Twitter Card支持
 * 3. 结构化数据（JSON-LD）
 * 4. 多语言支持
 * 5. 移动端优化
 * 6. 性能优化提示
 *
 * 使用示例：
 * <SEOHead
 *   title="我的文章标题"
 *   description="文章描述"
 *   keywords={['React', 'Next.js']}
 *   ogType="article"
 *   publishedTime="2024-01-01T00:00:00Z"
 *   canonical="/articles/my-article"
 * />
 */
