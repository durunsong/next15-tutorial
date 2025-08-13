'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Play } from 'lucide-react';

// TypeScript 类型演示组件
export function TypeScriptTypesDemo() {
  const [selectedType, setSelectedType] = useState('basic');
  const [code] = useState('');
  // 使用变量避免 lint 错误
  void code;
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState('');
  
  const typeExamples = [
    {
      id: 'basic',
      name: '基础类型',
      description: '字符串、数字、布尔值等基础类型'
    },
    {
      id: 'interfaces',
      name: '接口',
      description: '定义对象的结构和契约'
    },
    {
      id: 'generics',
      name: '泛型',
      description: '可重用的类型参数'
    },
    {
      id: 'utility',
      name: '工具类型',
      description: 'TypeScript 内置的实用工具类型'
    }
  ];
  
  const typeCode = {
    basic: `// 基础类型示例
let name: string = "张三";
let age: number = 25;
let isStudent: boolean = true;
let hobbies: string[] = ["读书", "编程"];
let score: number | null = null;

// 类型别名
type Status = "pending" | "success" | "error";
let currentStatus: Status = "pending";`,

    interfaces: `// 接口示例
interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string; // 可选属性
  readonly createdAt: Date; // 只读属性
}

interface UserWithMethods extends User {
  getName(): string;
  updateEmail(email: string): void;
}

// 实现接口
const user: User = {
  id: 1,
  name: "张三",
  email: "zhangsan@example.com",
  createdAt: new Date()
};`,

    generics: `// 泛型示例
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

function createResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data: data
  };
}

// 使用泛型
const userResponse = createResponse({
  id: 1,
  name: "张三"
});

const listResponse = createResponse([1, 2, 3, 4, 5]);`,

    utility: `// 工具类型示例
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Partial - 所有属性变为可选
type PartialUser = Partial<User>;

// Pick - 选择特定属性
type UserProfile = Pick<User, 'id' | 'name' | 'email'>;

// Omit - 排除特定属性
type CreateUser = Omit<User, 'id'>;

// Record - 创建映射类型
type UserRoles = Record<string, 'admin' | 'user' | 'guest'>;`
  };
  
  const executeTypeScript = () => {
    try {
      setError('');
      // 模拟 TypeScript 类型检查
      if (selectedType === 'basic') {
        setResult({
          types: {
            name: 'string',
            age: 'number',
            isStudent: 'boolean',
            hobbies: 'string[]',
            currentStatus: '"pending" | "success" | "error"'
          }
        });
      } else if (selectedType === 'interfaces') {
        setResult({
          user: {
            id: 1,
            name: "张三",
            email: "zhangsan@example.com",
            createdAt: new Date().toISOString()
          },
          typeCheck: '✅ 类型检查通过'
        });
      } else if (selectedType === 'generics') {
        setResult({
          userResponse: {
            success: true,
            data: { id: 1, name: "张三" }
          },
          listResponse: {
            success: true,
            data: [1, 2, 3, 4, 5]
          },
          inferred: '✅ 类型自动推断'
        });
      } else if (selectedType === 'utility') {
        setResult({
          PartialUser: '所有属性都是可选的',
          UserProfile: '只包含 id, name, email',
          CreateUser: '排除了 id 属性',
          UserRoles: '字符串键映射到角色类型'
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '执行错误');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {typeExamples.map(example => (
          <button
            key={example.id}
            onClick={() => setSelectedType(example.id)}
            className={`p-3 text-left border rounded-lg transition-colors ${
              selectedType === example.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="font-medium text-sm">{example.name}</div>
            <div className="text-xs text-gray-500 mt-1">{example.description}</div>
          </button>
        ))}
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {typeExamples.find(t => t.id === selectedType)?.name} 演示
          </h4>
          <button
            onClick={executeTypeScript}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center space-x-1"
          >
            <Play className="h-3 w-3" />
            <span>类型检查</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <h5 className="text-sm font-medium mb-2">TypeScript 代码:</h5>
            <div className="bg-gray-900 text-gray-100 p-3 rounded text-sm font-mono overflow-x-auto">
              <pre>{typeCode[selectedType as keyof typeof typeCode]}</pre>
            </div>
          </div>
          
          <div>
            <h5 className="text-sm font-medium mb-2">类型检查结果:</h5>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-3 min-h-[200px]">
              {error ? (
                <div className="text-red-600 flex items-center space-x-2">
                  <XCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              ) : result ? (
                <div className="space-y-2">
                  <div className="text-green-600 flex items-center space-x-2 mb-3">
                    <CheckCircle className="h-4 w-4" />
                    <span>类型检查通过</span>
                  </div>
                  <pre className="text-sm overflow-x-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="text-gray-500 text-center py-8">
                  点击&quot;类型检查&quot;按钮查看结果
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// TypeScript 配置演示组件
export function TSConfigDemo() {
  const [selectedConfig, setSelectedConfig] = useState('strict');
  const [compilerOptions, setCompilerOptions] = useState({
    strict: true,
    noImplicitAny: true,
    noImplicitReturns: true,
    noUnusedLocals: false,
    noUnusedParameters: false
  });
  
  const configOptions = [
    {
      id: 'strict',
      name: '严格模式',
      description: '启用所有严格类型检查选项'
    },
    {
      id: 'modules',
      name: '模块系统',
      description: '配置模块解析和导入导出'
    },
    {
      id: 'target',
      name: '编译目标',
      description: '设置 JavaScript 版本目标'
    },
    {
      id: 'paths',
      name: '路径映射',
      description: '配置模块路径别名'
    }
  ];
  
  const generateTSConfig = () => {
    const configs = {
      strict: {
        compilerOptions: {
          strict: compilerOptions.strict,
          noImplicitAny: compilerOptions.noImplicitAny,
          noImplicitReturns: compilerOptions.noImplicitReturns,
          noUnusedLocals: compilerOptions.noUnusedLocals,
          noUnusedParameters: compilerOptions.noUnusedParameters
        }
      },
      modules: {
        compilerOptions: {
          module: "ESNext",
          moduleResolution: "node",
          allowSyntheticDefaultImports: true,
          esModuleInterop: true
        }
      },
      target: {
        compilerOptions: {
          target: "ES2020",
          lib: ["ES2020", "DOM", "DOM.Iterable"],
          skipLibCheck: true
        }
      },
      paths: {
        compilerOptions: {
          baseUrl: ".",
          paths: {
            "@/*": ["./src/*"],
            "@/components/*": ["./src/components/*"],
            "@/utils/*": ["./src/utils/*"]
          }
        }
      }
    };
    
    return configs[selectedConfig as keyof typeof configs];
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {configOptions.map(option => (
          <button
            key={option.id}
            onClick={() => setSelectedConfig(option.id)}
            className={`p-3 text-left border rounded-lg transition-colors ${
              selectedConfig === option.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="font-medium text-sm">{option.name}</div>
            <div className="text-xs text-gray-500 mt-1">{option.description}</div>
          </button>
        ))}
      </div>
      
      {selectedConfig === 'strict' && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="font-semibold mb-3">严格模式选项</h4>
          <div className="space-y-3">
            {Object.entries(compilerOptions).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setCompilerOptions(prev => ({
                    ...prev,
                    [key]: e.target.checked
                  }))}
                  className="rounded"
                />
                <label className="text-sm">{key}</label>
                <span className="text-xs text-gray-500">
                  {key === 'strict' && '启用所有严格类型检查'}
                  {key === 'noImplicitAny' && '禁止隐式 any 类型'}
                  {key === 'noImplicitReturns' && '禁止隐式返回'}
                  {key === 'noUnusedLocals' && '检查未使用的局部变量'}
                  {key === 'noUnusedParameters' && '检查未使用的参数'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 className="font-semibold mb-3">生成的 tsconfig.json</h4>
        <div className="bg-gray-900 text-gray-100 p-3 rounded">
          <pre className="text-sm overflow-x-auto">
            {JSON.stringify(generateTSConfig(), null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
