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
  const [actualLanguage, setActualLanguage] = useState(language);

  useEffect(() => {
    // 动态导入 Prism.js 以避免 SSR 水合不匹配
    const loadPrism = async () => {
      try {
        const Prism = (await import('prismjs')).default;

        // 使用静态导入代替动态导入，避免 Critical dependency 警告
        const currentLanguage = language.toLowerCase();

        try {
          // 根据语言类型加载对应的组件
          switch (currentLanguage) {
            case 'bash':
            case 'shell':
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              await import('prismjs/components/prism-bash' as any);
              break;
            case 'css':
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              await import('prismjs/components/prism-css' as any);
              break;
            case 'javascript':
            case 'js':
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              await import('prismjs/components/prism-javascript' as any);
              break;
            case 'json':
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              await import('prismjs/components/prism-json' as any);
              break;
            case 'jsx':
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              await import('prismjs/components/prism-javascript' as any);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              await import('prismjs/components/prism-jsx' as any);
              break;
            case 'sql':
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              await import('prismjs/components/prism-sql' as any);
              break;
            case 'typescript':
            case 'ts':
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              await import('prismjs/components/prism-javascript' as any);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              await import('prismjs/components/prism-typescript' as any);
              break;
            case 'tsx':
              // 确保按正确顺序加载TSX的依赖
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              await import('prismjs/components/prism-javascript' as any);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              await import('prismjs/components/prism-typescript' as any);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              await import('prismjs/components/prism-jsx' as any);
              // 尝试加载TSX，如果失败则静默处理
              try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await import('prismjs/components/prism-tsx' as any);
              } catch (_tsxError) {
                // TSX加载失败，将在语法高亮时回退到typescript
              }
              break;
            default:
              // 对于不支持的语言，不进行特殊处理
              break;
          }
        } catch (_langError) {
          // 静默处理语言加载错误，避免控制台警告
          // console.warn(`无法加载语言组件: ${currentLanguage}`, _langError);
        }

        // 加载主题
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await import('prismjs/themes/prism-tomorrow.css' as any);
        } catch (_themeError) {
          // 静默处理主题加载错误
        }

        // 执行语法高亮，使用更好的回退机制
        let targetLanguage = currentLanguage;
        let grammar = Prism.languages[currentLanguage];

        // 如果目标语言不可用，尝试回退
        if (!grammar) {
          if (currentLanguage === 'tsx') {
            // TSX回退顺序：tsx -> typescript -> jsx -> javascript
            // 使用方括号表示法访问属性，避免 TypeScript 类型错误
            grammar =
              Prism.languages['tsx'] ||
              Prism.languages['typescript'] ||
              Prism.languages['jsx'] ||
              Prism.languages['javascript'];
            targetLanguage =
              grammar === Prism.languages['typescript']
                ? 'typescript'
                : grammar === Prism.languages['jsx']
                  ? 'jsx'
                  : grammar === Prism.languages['javascript']
                    ? 'javascript'
                    : 'tsx';
          } else if (currentLanguage === 'ts') {
            grammar = Prism.languages['typescript'] || Prism.languages['javascript'];
            targetLanguage =
              grammar === Prism.languages['javascript'] ? 'javascript' : 'typescript';
          } else if (currentLanguage === 'jsx') {
            grammar = Prism.languages['jsx'] || Prism.languages['javascript'];
            targetLanguage = grammar === Prism.languages['javascript'] ? 'javascript' : 'jsx';
          }

          // 最终回退到plaintext
          if (!grammar) {
            grammar = Prism.languages['plaintext'];
            targetLanguage = 'plaintext';
          }
        }

        // 确保 grammar 存在，避免 TypeScript 类型错误
        if (!grammar) {
          // 最后的回退，直接显示原始代码
          setHighlightedCode(code);
          setIsLoading(false);
          return;
        }

        const highlighted = Prism.highlight(code, grammar, targetLanguage);

        setHighlightedCode(highlighted);
        setActualLanguage(targetLanguage);
        setIsLoading(false);
      } catch (_error) {
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
    } catch (_err) {
      // 复制失败时静默处理
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
              className={`language-${actualLanguage}`}
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
