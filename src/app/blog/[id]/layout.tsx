interface BlogPostLayoutProps {
  children: React.ReactNode;
}

export default function BlogPostLayout({ children }: BlogPostLayoutProps) {
  return (
    <div className="bg-white">
      {/* 文章特定的布局容器 */}
      <div className="max-w-4xl mx-auto">{children}</div>
    </div>
  );
}
