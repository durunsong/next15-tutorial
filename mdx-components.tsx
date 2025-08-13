// MDX Components 类型定义
type MDXComponents = {
  [key: string]: React.ComponentType<any>;
};
import { CodeBlock } from './src/components/CodeBlock';
import { DemoBlock } from './src/components/DemoBlock';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // 自定义代码块组件
    code: ({ children, className, ...props }: { children?: React.ReactNode; className?: string; [key: string]: any }) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      if (language) {
        return <CodeBlock language={language} code={String(children).replace(/\n$/, '')} {...props} />;
      }
      
      return <code className={className} {...props}>{children}</code>;
    },
    
    // 自定义演示块组件
    DemoBlock: DemoBlock,
    
    // 自定义标题样式
    h1: ({ children, ...props }: { children?: React.ReactNode; [key: string]: any }) => (
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-4" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: { children?: React.ReactNode; [key: string]: any }) => (
      <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-4 mt-8" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: { children?: React.ReactNode; [key: string]: any }) => (
      <h3 className="text-2xl font-medium text-gray-700 dark:text-gray-200 mb-3 mt-6" {...props}>
        {children}
      </h3>
    ),
    
    // 自定义段落样式
    p: ({ children, ...props }: { children?: React.ReactNode; [key: string]: any }) => (
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4" {...props}>
        {children}
      </p>
    ),
    
    // 自定义列表样式
    ul: ({ children, ...props }: { children?: React.ReactNode; [key: string]: any }) => (
      <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-300" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: { children?: React.ReactNode; [key: string]: any }) => (
      <ol className="list-decimal pl-6 mb-4 text-gray-600 dark:text-gray-300" {...props}>
        {children}
      </ol>
    ),
    
    // 自定义链接样式
    a: ({ children, href, ...props }: { children?: React.ReactNode; href?: string; [key: string]: any }) => (
      <a 
        href={href} 
        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {children}
      </a>
    ),
    
    // 自定义表格样式
    table: ({ children, ...props }: { children?: React.ReactNode; [key: string]: any }) => (
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-200 dark:border-gray-700" {...props}>
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }: { children?: React.ReactNode; [key: string]: any }) => (
      <th className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-left font-medium text-gray-900 dark:text-gray-100" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }: { children?: React.ReactNode; [key: string]: any }) => (
      <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300" {...props}>
        {children}
      </td>
    ),
    
    // 自定义引用块样式
    blockquote: ({ children, ...props }: { children?: React.ReactNode; [key: string]: any }) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-300 my-4 bg-blue-50 dark:bg-blue-900/20 py-2" {...props}>
        {children}
      </blockquote>
    ),
    
    ...components,
  };
}
