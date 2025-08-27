'use client';

import { Check, Copy, Play } from 'lucide-react';

import { useEffect, useState } from 'react';

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
  showCopy?: boolean;
  showRun?: boolean;
  onRun?: () => void;
}

export function CodeBlock({
  code,
  language,
  filename,
  showCopy = true,
  showRun = false,
  onRun,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 动态导入 Prism.js 以避免 SSR 水合不匹配
    const loadPrism = async () => {
      try {
        const Prism = (await import('prismjs')).default;

        // 动态导入所需的语言组件 - 使用具体的导入路径避免表达式警告
        const importPromises = [
          'prismjs/components/prism-bash',
          'prismjs/components/prism-css',
          'prismjs/components/prism-javascript',
          'prismjs/components/prism-json',
          'prismjs/components/prism-jsx',
          'prismjs/components/prism-sql',
          'prismjs/components/prism-tsx',
          'prismjs/components/prism-typescript',
        ].map(component => import(component as any));

        await Promise.all(importPromises);

        // 加载主题
        await import('prismjs/themes/prism-tomorrow.css' as any);

        // 执行语法高亮
        const highlighted = Prism.highlight(
          code,
          Prism.languages[language] || Prism.languages.plaintext,
          language
        );

        setHighlightedCode(highlighted);
        setIsLoading(false);
      } catch (error) {
        console.error('Prism.js 加载失败:', error);
        // 如果加载失败，直接显示原始代码
        setHighlightedCode(code);
        setIsLoading(false);
      }
    };

    loadPrism();
  }, [code, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <div className="relative group">
      {/* 文件名 */}
      {filename && (
        <div className="bg-gray-800 text-gray-300 px-4 py-2 text-sm font-mono rounded-t-lg border-b border-gray-700">
          {filename}
        </div>
      )}

      {/* 代码块 */}
      <div className="relative">
        <pre
          className={`bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm ${filename ? 'rounded-t-none' : 'rounded-t-lg'} rounded-b-lg`}
        >
          {isLoading ? (
            // 加载中显示原始代码，避免水合不匹配
            <code className={`language-${language}`}>{code}</code>
          ) : (
            <code
              className={`language-${language}`}
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          )}
        </pre>

        {/* 操作按钮 */}
        <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {showRun && onRun && (
            <button
              onClick={onRun}
              className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
              title="运行代码"
            >
              <Play className="h-4 w-4" />
            </button>
          )}
          {showCopy && (
            <button
              onClick={handleCopy}
              className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
              title={copied ? '已复制' : '复制代码'}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
