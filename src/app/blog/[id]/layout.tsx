interface BlogPostLayoutProps {
  children: React.ReactNode;
}

export default function BlogPostLayout({ children }: BlogPostLayoutProps) {
  return (
    <div className="bg-white">
      {/* 文章特定的布局容器 */}
      <div className="max-w-4xl mx-auto">{children}</div>

      {/* 文章页面特有的样式和脚本 */}
      <style jsx global>{`
        /* 为文章内容优化的样式 */
        .prose {
          color: #374151;
          line-height: 1.75;
        }

        .prose h1,
        .prose h2,
        .prose h3,
        .prose h4 {
          color: #111827;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .prose h1 {
          font-size: 2.25rem;
          line-height: 2.5rem;
        }

        .prose h2 {
          font-size: 1.875rem;
          line-height: 2.25rem;
        }

        .prose h3 {
          font-size: 1.5rem;
          line-height: 2rem;
        }

        .prose p {
          margin-top: 1.25rem;
          margin-bottom: 1.25rem;
        }

        .prose code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.375rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          color: #db2777;
        }

        .prose pre {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }

        .prose pre code {
          background-color: transparent;
          color: inherit;
          padding: 0;
        }

        .prose blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          background-color: #f8fafc;
          padding: 1rem;
          border-radius: 0.375rem;
        }

        .prose ul,
        .prose ol {
          margin: 1.25rem 0;
          padding-left: 1.5rem;
        }

        .prose li {
          margin: 0.5rem 0;
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
          .prose {
            font-size: 0.875rem;
          }

          .prose h1 {
            font-size: 1.875rem;
            line-height: 2.25rem;
          }

          .prose h2 {
            font-size: 1.5rem;
            line-height: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
