'use client';

import { useState } from 'react';
import { Copy, Check, Play } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-sql';

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const highlightedCode = Prism.highlight(code, Prism.languages[language] || Prism.languages.plaintext, language);

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
        <pre className={`bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm ${filename ? 'rounded-t-none' : 'rounded-t-lg'} rounded-b-lg`}>
          <code
            className={`language-${language}`}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
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
