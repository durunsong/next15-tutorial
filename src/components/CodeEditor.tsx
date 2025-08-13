'use client';

import { Download, Play, RotateCcw } from 'lucide-react';

import { useRef, useState } from 'react';

import dynamic from 'next/dynamic';

// 动态导入 Monaco Editor 以避免 SSR 问题
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div className="text-gray-500 dark:text-gray-400">加载编辑器中...</div>
    </div>
  ),
});

interface CodeEditorProps {
  defaultCode: string;
  language: string;
  title?: string;
  height?: string;
  theme?: 'light' | 'dark';
  readOnly?: boolean;
  onRun?: (code: string) => void;
  showConsole?: boolean;
}

export function CodeEditor({
  defaultCode,
  language,
  title,
  height = '400px',
  theme = 'dark',
  readOnly = false,
  onRun,
  showConsole = false,
}: CodeEditorProps) {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const editorRef = useRef<unknown>(null);

  const handleEditorDidMount = (editor: unknown) => {
    editorRef.current = editor;
  };

  const handleRun = async () => {
    if (!onRun) return;

    setIsRunning(true);
    setOutput([]);

    try {
      // 模拟代码执行
      onRun(code);

      // 这里可以集成实际的代码执行逻辑
      if (language === 'javascript' || language === 'typescript') {
        try {
          // 创建一个安全的执行环境
          const originalConsoleLog = console.log;
          const logs: string[] = [];

          console.log = (...args) => {
            logs.push(args.map(arg => String(arg)).join(' '));
          };

          // 使用 Function 构造器执行代码（相对安全）
          const func = new Function(code);
          const result = func();

          console.log = originalConsoleLog;

          if (result !== undefined) {
            logs.push(`返回值: ${result}`);
          }

          setOutput(logs);
        } catch (error) {
          setOutput([`错误: ${error instanceof Error ? error.message : String(error)}`]);
        }
      }
    } catch (error) {
      setOutput([`执行失败: ${error instanceof Error ? error.message : String(error)}`]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(defaultCode);
    setOutput([]);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `code.${language === 'typescript' ? 'ts' : language === 'javascript' ? 'js' : 'txt'}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* 标题栏 */}
      {title && (
        <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h3>
          <div className="flex space-x-2">
            {!readOnly && (
              <button
                onClick={handleReset}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                title="重置代码"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={handleDownload}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              title="下载代码"
            >
              <Download className="h-4 w-4" />
            </button>
            {onRun && (
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-sm rounded transition-colors flex items-center space-x-1"
              >
                <Play className="h-3 w-3" />
                <span>{isRunning ? '运行中...' : '运行'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 编辑器 */}
      <div className="relative">
        <MonacoEditor
          height={height}
          language={language}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          value={code}
          onChange={value => setCode(value || '')}
          onMount={handleEditorDidMount}
          options={{
            readOnly,
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            renderLineHighlight: 'line',
            selectOnLineNumbers: true,
            roundedSelection: false,
            cursorStyle: 'line',
            smoothScrolling: true,
          }}
        />
      </div>

      {/* 控制台输出 */}
      {showConsole && output.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-900 text-green-400">
          <div className="px-4 py-2 text-xs font-mono border-b border-gray-700">
            <span className="text-gray-400">控制台输出:</span>
          </div>
          <div className="p-4 max-h-32 overflow-y-auto">
            {output.map((line, index) => (
              <div key={index} className="text-sm font-mono">
                {line}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
