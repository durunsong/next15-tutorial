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
      return undefined;
    }

    setIsLoading(true);
    setError(null);

    try {
      const iframe = iframeRef.current;
      if (!iframe) return undefined;

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
      // 确保所有代码路径都有返回值，避免 TypeScript 错误
      return undefined;
    }
  }, [code, language]);

  const createSandboxHtml = (userCode: string, lang: string): string => {
    // 处理不同语言类型的代码
    let processedCode = userCode.trim();

    if (lang === 'tsx' || lang === 'jsx') {
      // 移除 'use client' 指令，在沙箱中不需要
      processedCode = processedCode.replace(/['"]use client['"];?\s*/g, '');

      // 处理 React imports - 转换为全局变量引用
      processedCode = processedCode.replace(
        /import\s+\{\s*([^}]+)\s*\}\s+from\s+['"]react['"];?/g,
        (match, imports) => {
          // 提取导入的项目并清理空格
          const importItems = imports.split(',').map((item: string) => item.trim());
          return `// React imports converted to global variables: ${importItems.join(', ')}`;
        }
      );

      // 移除其他不支持的 import 语句
      processedCode = processedCode.replace(
        /import\s+.*?from\s+['"][^'"]*['"];?/g,
        '// Import removed for sandbox'
      );

      // 如果是 React 组件，包装成可执行的代码
      if (processedCode.includes('export default')) {
        // 提取默认导出的组件
        processedCode = processedCode.replace(/export\s+default\s+/, 'const MainComponent = ');
        processedCode += `

        // 错误边界组件
        class ErrorBoundary extends React.Component {
          constructor(props) {
            super(props);
            this.state = { hasError: false, error: null };
          }

          static getDerivedStateFromError(error) {
            return { hasError: true, error: error.toString() };
          }

          componentDidCatch(error, errorInfo) {
            console.error('组件渲染错误:', error, errorInfo);
            parent.postMessage({
              type: 'sandbox-error',
              error: error.toString()
            }, '*');
          }

          render() {
            if (this.state.hasError) {
              return React.createElement('div', {
                style: { padding: '20px', color: '#ef4444', fontSize: '14px' }
              }, [
                React.createElement('strong', { key: 'title' }, '渲染错误: '),
                React.createElement('br', { key: 'br' }),
                this.state.error
              ]);
            }
            return this.props.children;
          }
        }

        // 渲染组件
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(React.createElement(ErrorBoundary, null, React.createElement(MainComponent)));
        `;
      } else {
        // 如果包含组件定义，但没有默认导出，尝试自动检测和渲染
        const componentMatch = processedCode.match(/(?:function|const|class)\s+(\w+)/);
        const componentName = componentMatch ? componentMatch[1] : 'MyComponent';

        processedCode += `

        // 错误边界组件
        class ErrorBoundary extends React.Component {
          constructor(props) {
            super(props);
            this.state = { hasError: false, error: null };
          }

          static getDerivedStateFromError(error) {
            return { hasError: true, error: error.toString() };
          }

          componentDidCatch(error, errorInfo) {
            console.error('组件渲染错误:', error, errorInfo);
            parent.postMessage({
              type: 'sandbox-error',
              error: error.toString()
            }, '*');
          }

          render() {
            if (this.state.hasError) {
              return React.createElement('div', {
                style: { padding: '20px', color: '#ef4444', fontSize: '14px' }
              }, [
                React.createElement('strong', { key: 'title' }, '渲染错误: '),
                React.createElement('br', { key: 'br' }),
                this.state.error
              ]);
            }
            return this.props.children;
          }
        }

        // 尝试渲染组件
        try {
          const ComponentToRender = ${componentName} || MyComponent || Component || App;
          if (ComponentToRender) {
            const root = ReactDOM.createRoot(document.getElementById('root'));
            root.render(React.createElement(ErrorBoundary, null, React.createElement(ComponentToRender)));
          } else {
            document.getElementById('root').innerHTML = '<div style="padding: 20px; color: #6b7280;">未找到可渲染的 React 组件</div>';
          }
        } catch (e) {
          document.getElementById('root').innerHTML = '<div style="padding: 20px; color: #ef4444;">组件渲染失败: ' + e.message + '</div>';
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
        // 设置全局 React 和 ReactDOM 以及 hooks
        window.React = React;
        window.ReactDOM = ReactDOM;

        // 导出所有 React hooks 到全局作用域
        const {
          useState,
          useEffect,
          useContext,
          useReducer,
          useCallback,
          useMemo,
          useRef,
          useImperativeHandle,
          useLayoutEffect,
          useDebugValue,
          useDeferredValue,
          useTransition,
          useId,
          useSyncExternalStore,
          useInsertionEffect
        } = React;

        // 将 hooks 添加到全局作用域
        window.useState = useState;
        window.useEffect = useEffect;
        window.useContext = useContext;
        window.useReducer = useReducer;
        window.useCallback = useCallback;
        window.useMemo = useMemo;
        window.useRef = useRef;
        window.useImperativeHandle = useImperativeHandle;
        window.useLayoutEffect = useLayoutEffect;
        window.useDebugValue = useDebugValue;
        window.useDeferredValue = useDeferredValue;
        window.useTransition = useTransition;
        window.useId = useId;
        window.useSyncExternalStore = useSyncExternalStore;
        window.useInsertionEffect = useInsertionEffect;
    </script>

    <script>
        // 增强的错误处理
        window.addEventListener('error', (event) => {
            const errorMsg = event.error ?
                (event.error.stack || event.error.message) :
                event.message;
            parent.postMessage({
                type: 'sandbox-error',
                error: errorMsg,
                filename: event.filename,
                lineno: event.lineno
            }, '*');
        });

        window.addEventListener('unhandledrejection', (event) => {
            parent.postMessage({
                type: 'sandbox-error',
                error: event.reason ? event.reason.toString() : '未处理的 Promise 拒绝'
            }, '*');
        });

        // 重写 console 方法，捕获日志
        const originalLog = console.log;
        const originalError = console.error;
        console.log = (...args) => {
            originalLog.apply(console, args);
            parent.postMessage({
                type: 'sandbox-log',
                message: args.join(' ')
            }, '*');
        };
        console.error = (...args) => {
            originalError.apply(console, args);
            parent.postMessage({
                type: 'sandbox-error',
                error: args.join(' ')
            }, '*');
        };

        try {
            // 转译并执行用户代码
            ${
              lang === 'tsx' || lang === 'jsx'
                ? `
            const transformedCode = Babel.transform(\`${processedCode.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`, {
                presets: [
                  ['react', { runtime: 'classic' }],
                  ['env', { modules: false }]
                ],
                plugins: [
                  ['transform-react-jsx', { pragma: 'React.createElement' }]
                ]
            }).code;

            // 在安全的上下文中执行代码
            (function() {
                eval(transformedCode);
            })();
            `
                : `
            // 普通 JavaScript
            (function() {
                eval(\`${processedCode.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`);
            })();
            `
            }

            // 通知父窗口渲染完成
            parent.postMessage({ type: 'sandbox-ready' }, '*');
        } catch (error) {
            console.error('执行错误:', error);
            parent.postMessage({
                type: 'sandbox-error',
                error: error.message + (error.stack ? '\\n' + error.stack : '')
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
            sandbox="allow-scripts allow-same-origin"
            title="代码预览"
          />
        )}
      </div>
    </div>
  );
}
