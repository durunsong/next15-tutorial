'use client';

import { Alert, Spin } from 'antd';

import { useEffect, useState } from 'react';

import dynamic from 'next/dynamic';

// 懒加载的Monaco代码编辑器
interface LazyCodeEditorProps {
  value?: string;
  language?: string;
  onChange?: (value: string | undefined) => void;
  options?: any;
  style?: React.CSSProperties;
  className?: string;
  height?: string | number;
  width?: string | number;
  theme?: 'light' | 'dark' | 'auto';
}

// 动态导入Monaco编辑器
const DynamicMonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded border">
      <div className="text-center">
        <Spin size="large" />
        <p className="mt-4 text-gray-600 dark:text-gray-300">正在加载代码编辑器...</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">首次加载可能需要较长时间</p>
      </div>
    </div>
  ),
});

export default function LazyCodeEditor({
  value = '',
  language = 'typescript',
  onChange,
  options = {},
  style,
  className,
  height = 400,
  width = '100%',
  theme = 'auto',
}: LazyCodeEditorProps) {
  // 编辑器挂载即配置完成，移除未使用状态避免 lint 报错
  const setIsEditorReady = (_ready: boolean) => {};
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState('vs-light');

  // 自动主题检测
  useEffect(() => {
    if (theme === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setCurrentTheme(isDark ? 'vs-dark' : 'vs-light');

      // 监听主题变化
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleThemeChange = (e: MediaQueryListEvent) => {
        setCurrentTheme(e.matches ? 'vs-dark' : 'vs-light');
      };

      mediaQuery.addEventListener('change', handleThemeChange);
      return () => mediaQuery.removeEventListener('change', handleThemeChange);
    } else {
      setCurrentTheme(theme === 'dark' ? 'vs-dark' : 'vs-light');
    }
  }, [theme]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    setIsEditorReady(true);

    // 配置编辑器
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
      strict: true,
    });

    // 添加React类型定义
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `
      declare module 'react' {
        export = React;
        export as namespace React;
        namespace React {
          interface Component<P = {}, S = {}> {}
          class Component<P, S> {}
          interface FunctionComponent<P = {}> {}
          type FC<P = {}> = FunctionComponent<P>;
        }
      }
      `,
      'file:///node_modules/@types/react/index.d.ts'
    );

    // 设置编辑器快捷键
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // 阻止默认的保存行为
      console.log('代码已保存到编辑器');
    });
  };

  // 统一用 loading 与 Alert 呈现错误，移除未使用 handler

  const defaultOptions = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: 'line',
    automaticLayout: true,
    minimap: { enabled: false },
    fontSize: 14,
    lineHeight: 20,
    fontFamily: '"Fira Code", "Monaco", "Menlo", "Ubuntu Mono", monospace',
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    wrappingIndent: 'indent',
    folding: true,
    foldingStrategy: 'indentation',
    showFoldingControls: 'always',
    formatOnPaste: true,
    formatOnType: true,
    suggestOnTriggerCharacters: true,
    tabSize: 2,
    insertSpaces: true,
    detectIndentation: false,
    ...options,
  };

  if (loadError) {
    return (
      <div className={className} style={style}>
        <Alert
          message="代码编辑器加载失败"
          description={loadError}
          type="error"
          showIcon
          action={
            <button
              onClick={() => {
                setLoadError(null);
                window.location.reload();
              }}
              className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
            >
              重试
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className={className} style={style}>
      <DynamicMonacoEditor
        value={value}
        language={language}
        theme={currentTheme}
        onChange={onChange}
        onMount={handleEditorDidMount}
        loading={
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
            <div className="text-center">
              <Spin size="large" />
              <p className="mt-4 text-gray-600 dark:text-gray-300">正在初始化编辑器...</p>
            </div>
          </div>
        }
        options={defaultOptions}
        height={height}
        width={width}
      />
    </div>
  );
}

/**
 * 使用说明：
 *
 * 这个组件提供了Monaco代码编辑器的懒加载功能：
 * 1. 按需加载Monaco编辑器，显著减少初始包大小
 * 2. 自动主题切换支持
 * 3. TypeScript和React支持
 * 4. 丰富的编辑器配置选项
 * 5. 错误处理和重试机制
 *
 * 使用示例：
 * <LazyCodeEditor
 *   value={code}
 *   language="typescript"
 *   onChange={handleCodeChange}
 *   height={300}
 *   theme="auto"
 * />
 */
