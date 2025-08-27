'use client';

import { useEffect, useRef, useState } from 'react';

interface SandboxRendererProps {
  code: string;
  language: string;
}

export function SandboxRenderer({ code, language }: SandboxRendererProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!code.trim() || !['javascript', 'typescript', 'jsx', 'tsx'].includes(language)) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const iframe = iframeRef.current;
      if (!iframe) return;

      // 构建沙箱 HTML 内容
      const sandboxHtml = createSandboxHtml(code, language);

      // 写入 iframe
      iframe.srcdoc = sandboxHtml;

      // 监听来自 iframe 的错误消息
      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === 'sandbox-error') {
          setError(event.data.error);
          setIsLoading(false);
        } else if (event.data.type === 'sandbox-ready') {
          setIsLoading(false);
        }
      };

      window.addEventListener('message', handleMessage);

      return () => {
        window.removeEventListener('message', handleMessage);
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
      setIsLoading(false);
    }
  }, [code, language]);

  const createSandboxHtml = (userCode: string, lang: string): string => {
    // 处理不同语言类型的代码
    let processedCode = userCode;

    if (lang === 'tsx' || lang === 'jsx') {
      // 如果是 React 组件，包装成可执行的代码
      if (userCode.includes('export default')) {
        // 提取默认导出的组件
        processedCode = userCode.replace('export default', 'const Component =');
        processedCode += `

        // 渲染组件
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(React.createElement(Component));
        `;
      } else if (
        userCode.includes('function ') ||
        userCode.includes('const ') ||
        userCode.includes('class ')
      ) {
        // 如果包含组件定义，自动渲染
        processedCode += `

        // 自动渲染第一个找到的组件
        const componentNames = ['MyComponent', 'Component', 'App'];
        for (const name of componentNames) {
          if (typeof window[name] !== 'undefined') {
            const root = ReactDOM.createRoot(document.getElementById('root'));
            root.render(React.createElement(window[name]));
            break;
          }
        }
        `;
      }
    }

    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>代码沙箱</title>
    <style>
        body {
            margin: 0;
            padding: 16px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            background: white;
            color: #333;
        }
        #root {
            min-height: 200px;
        }
        .error {
            color: #ef4444;
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 6px;
            padding: 12px;
            margin: 8px 0;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 14px;
        }
        .loading {
            color: #6b7280;
            font-style: italic;
        }
    </style>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
    <div id="root"></div>

    <script>
        // 错误处理
        window.addEventListener('error', (event) => {
            parent.postMessage({
                type: 'sandbox-error',
                error: event.error ? event.error.message : event.message
            }, '*');
        });

        window.addEventListener('unhandledrejection', (event) => {
            parent.postMessage({
                type: 'sandbox-error',
                error: event.reason ? event.reason.toString() : '未处理的 Promise 拒绝'
            }, '*');
        });

        try {
            // 转译并执行用户代码
            ${
              lang === 'tsx' || lang === 'jsx'
                ? `
            const transformedCode = Babel.transform(\`${processedCode.replace(/`/g, '\\`')}\`, {
                presets: ['react', 'env'],
                plugins: ['transform-modules-umd']
            }).code;

            eval(transformedCode);
            `
                : `
            // 普通 JavaScript
            eval(\`${processedCode.replace(/`/g, '\\`')}\`);
            `
            }

            // 通知父窗口渲染完成
            parent.postMessage({ type: 'sandbox-ready' }, '*');
        } catch (error) {
            parent.postMessage({
                type: 'sandbox-error',
                error: error.message
            }, '*');
        }
    </script>
</body>
</html>`;
  };

  if (!['javascript', 'typescript', 'jsx', 'tsx'].includes(language)) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center text-gray-500">
        <p>沙箱渲染仅支持 JavaScript、TypeScript、JSX 和 TSX 代码</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">预览结果</span>
        {isLoading && <span className="text-xs text-gray-500">渲染中...</span>}
      </div>

      <div className="relative bg-white" style={{ minHeight: '200px' }}>
        {error ? (
          <div className="p-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="text-sm text-red-800">
                <strong>渲染错误：</strong>
              </div>
              <pre className="text-xs text-red-700 mt-1 whitespace-pre-wrap font-mono">{error}</pre>
            </div>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0"
            style={{ minHeight: '200px' }}
            sandbox="allow-scripts"
            title="代码预览"
          />
        )}
      </div>
    </div>
  );
}
