'use client';

import { TutorialLayout } from '@/components/TutorialLayout';
import { DemoSection } from '@/components/DemoSection';
import { CodeBlock } from '@/components/CodeBlock';
import { CodeEditor } from '@/components/CodeEditor';
import { TypeScriptTypesDemo, TSConfigDemo } from '@/components/demos/TypeScriptDemos';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, Zap, CheckCircle, AlertCircle } from 'lucide-react';

// TypeScript 类型演示组件
function TypeScriptDemo() {
  const [user, setUser] = useState<{
    id: number;
    name: string;
    email: string;
    isActive: boolean;
  }>({
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    isActive: true
  });

  const [todos, setTodos] = useState<Array<{
    id: number;
    text: string;
    completed: boolean;
  }>>([
    { id: 1, text: '学习 TypeScript', completed: true },
    { id: 2, text: '构建 Next.js 应用', completed: false },
  ]);

  const addTodo = () => {
    const newTodo = {
      id: Date.now(),
      text: '新的待办事项',
      completed: false
    };
    setTodos([...todos, newTodo]);
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <div className="space-y-6">
      {/* 用户信息卡片 */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <Shield className="h-4 w-4 mr-2 text-blue-600" />
          类型安全的用户对象
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">ID:</span>
            <span className="ml-2 font-mono text-blue-600">{user.id}</span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">姓名:</span>
            <span className="ml-2">{user.name}</span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">邮箱:</span>
            <span className="ml-2">{user.email}</span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">状态:</span>
            <span className={`ml-2 ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
              {user.isActive ? '活跃' : '非活跃'}
            </span>
          </div>
        </div>
        <button
          onClick={() => setUser({ ...user, isActive: !user.isActive })}
          className="mt-3 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
        >
          切换状态
        </button>
      </div>

      {/* 待办事项列表 */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
          类型安全的待办事项
        </h4>
        <div className="space-y-2">
          {todos.map((todo) => (
            <div key={todo.id} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="rounded border-gray-300"
              />
              <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                {todo.text}
              </span>
              <span className="text-xs text-gray-400 font-mono">#{todo.id}</span>
            </div>
          ))}
        </div>
        <button
          onClick={addTodo}
          className="mt-3 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
        >
          添加待办
        </button>
      </div>
    </div>
  );
}

// 组件属性类型演示
function PropsDemo() {
  const [selectedButton, setSelectedButton] = useState<'primary' | 'secondary' | 'danger'>('primary');

  // 模拟组件
  const Button = ({ 
    variant, 
    size, 
    disabled, 
    children, 
    onClick 
  }: {
    variant: 'primary' | 'secondary' | 'danger';
    size: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
  }) => {
    const baseClasses = 'rounded font-medium transition-colors';
    const variantClasses = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
      danger: 'bg-red-600 hover:bg-red-700 text-white'
    };
    const sizeClasses = {
      sm: 'px-2 py-1 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg'
    };

    return (
      <button
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
          类型安全的 Button 组件
        </h4>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" size="sm">小号主要按钮</Button>
            <Button variant="secondary" size="md">中号次要按钮</Button>
            <Button variant="danger" size="lg">大号危险按钮</Button>
            <Button variant="primary" size="md" disabled>禁用按钮</Button>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
          类型约束演示
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          选择按钮类型（TypeScript 确保只能选择预定义的值）：
        </p>
        <div className="flex gap-2">
          {(['primary', 'secondary', 'danger'] as const).map((variant) => (
            <Button
              key={variant}
              variant={variant}
              size="sm"
              onClick={() => setSelectedButton(variant)}
            >
              {variant}
            </Button>
          ))}
        </div>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          当前选择: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">{selectedButton}</code>
        </p>
      </div>
    </div>
  );
}

export default function TypeScriptTutorial() {
  const basicTypesCode = `// 基本类型定义
let count: number = 0;
let message: string = "Hello TypeScript";
let isActive: boolean = true;
let items: string[] = ["apple", "banana", "orange"];
let user: { id: number; name: string } = { id: 1, name: "张三" };

// 联合类型
let status: "loading" | "success" | "error" = "loading";

// 函数类型
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

// 可选参数
function createUser(name: string, age?: number) {
  return { name, age: age || 0 };
}`;

  const interfaceCode = `// 接口定义
interface User {
  id: number;
  name: string;
  email: string;
  isActive?: boolean; // 可选属性
  readonly createdAt: Date; // 只读属性
}

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  tags?: string[];
}

// 继承接口
interface AdminUser extends User {
  permissions: string[];
  role: "admin" | "superadmin";
}

// 泛型接口
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// 使用示例
const userResponse: ApiResponse<User> = {
  data: { id: 1, name: "张三", email: "zhang@example.com", createdAt: new Date() },
  status: 200,
  message: "成功"
};`;

  const componentTypesCode = `// React 组件类型定义
import { ReactNode, MouseEvent } from 'react';

// 基本组件 Props
interface ButtonProps {
  children: ReactNode;
  variant: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

function Button({ children, variant, size = 'md', disabled, onClick }: ButtonProps) {
  return (
    <button
      className={\`btn btn-\${variant} btn-\${size}\`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// 泛型组件
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T) => string | number;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={keyExtractor(item)}>
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  );
}`;

  const nextjsTypesCode = `// Next.js 特定类型
import { NextRequest, NextResponse } from 'next/server';
import { Metadata } from 'next';

// 页面组件类型
interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ProductPage({ params, searchParams }: PageProps) {
  return <div>Product ID: {params.id}</div>;
}

// API 路由类型
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  return NextResponse.json({ id });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  // 处理 POST 请求
  return NextResponse.json({ success: true });
}

// 元数据类型
export const metadata: Metadata = {
  title: '产品页面',
  description: '产品详情页面',
};

// 布局组件类型
interface LayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function Layout({ children, params }: LayoutProps) {
  return <div lang={params.locale}>{children}</div>;
}`;

  const utilityTypesCode = `// TypeScript 实用类型
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  isActive: boolean;
}

// Pick - 选择特定属性
type UserProfile = Pick<User, 'id' | 'name' | 'email'>;

// Omit - 排除特定属性
type CreateUserInput = Omit<User, 'id'>;

// Partial - 所有属性变为可选
type UpdateUserInput = Partial<User>;

// Required - 所有属性变为必需
type RequiredUser = Required<User>;

// Record - 创建对象类型
type UserRoles = Record<string, 'admin' | 'user' | 'guest'>;

// 条件类型
type NonNullable<T> = T extends null | undefined ? never : T;

// 映射类型
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// 模板字面量类型
type EventName = \`on\${Capitalize<string>}\`;
type ButtonEvent = \`button\${Capitalize<string>}\`;`;

  return (
    <TutorialLayout
      title="TypeScript 集成教程"
      description="学习如何在 Next.js 15 项目中有效使用 TypeScript，提升代码质量和开发体验"
      prevTutorial={{
        title: "Next.js 15 基础",
        href: "/tutorials/nextjs-basics"
      }}
      nextTutorial={{
        title: "Prisma ORM",
        href: "/tutorials/prisma"
      }}
    >
      <div className="space-y-12">
        {/* 简介 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            为什么选择 TypeScript？
          </h2>
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p>
              TypeScript 为 JavaScript 添加了静态类型系统，帮助开发者在编译时发现错误，
              提供更好的代码智能提示和重构支持。在 Next.js 15 中，TypeScript 支持是开箱即用的。
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <Shield className="h-8 w-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">类型安全</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  编译时检查，减少运行时错误
                </p>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <Zap className="h-8 w-8 text-yellow-600 mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">开发体验</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  智能提示、自动补全、重构支持
                </p>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">代码质量</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  更好的代码可读性和维护性
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 基本类型 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            基本类型系统
          </h2>
          <div className="prose prose-lg max-w-none dark:prose-invert mb-6">
            <p>
              TypeScript 提供了丰富的类型系统，包括基本类型、联合类型、接口等。
              这些类型帮助我们更好地描述数据的结构和函数的行为。
            </p>
          </div>
          
          <CodeBlock
            code={basicTypesCode}
            language="typescript"
            filename="基本类型示例"
          />
        </section>

        {/* 接口和类型定义 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            接口和类型定义
          </h2>
          <div className="prose prose-lg max-w-none dark:prose-invert mb-6">
            <p>
              接口（Interface）是 TypeScript 中定义对象类型的主要方式。
              它们可以描述对象的形状、函数的签名、类的结构等。
            </p>
          </div>
          
          <CodeBlock
            code={interfaceCode}
            language="typescript"
            filename="接口定义示例"
          />
        </section>

        {/* TypeScript 类型系统演示 */}
        <DemoSection
          title="TypeScript 类型系统全览"
          description="深度探索 TypeScript 的类型系统，从基础类型到高级泛型"
          demoComponent={<TypeScriptTypesDemo />}
          codeComponent={
            <CodeBlock
              code={`// TypeScript 完整类型系统示例
// 1. 基础类型
let userName: string = "张三";
let userAge: number = 25;
let isActive: boolean = true;
let skills: string[] = ["React", "TypeScript", "Node.js"];

// 2. 联合类型和字面量类型
type Status = "pending" | "approved" | "rejected";
type Theme = "light" | "dark";

// 3. 接口定义
interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string; // 可选属性
  readonly createdAt: Date; // 只读属性
}

// 4. 泛型接口
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// 5. 工具类型
type PartialUser = Partial<User>; // 所有属性变为可选
type UserProfile = Pick<User, 'id' | 'name' | 'avatar'>; // 选择特定属性
type CreateUser = Omit<User, 'id' | 'createdAt'>; // 排除特定属性

// 6. 条件类型
type NonNullable<T> = T extends null | undefined ? never : T;

// 7. 映射类型
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// 8. 模板字面量类型
type EventName<T extends string> = \`on\${Capitalize<T>}\`;
type MouseEvent = EventName<"click" | "hover">; // "onClick" | "onHover"`}
              language="typescript"
              filename="TypeScript 类型系统全览"
            />
          }
        />

        {/* TSConfig 配置演示 */}
        <DemoSection
          title="TypeScript 配置优化"
          description="学习如何配置 tsconfig.json 来优化开发体验和类型检查"
          demoComponent={<TSConfigDemo />}
          codeComponent={
            <CodeBlock
              code={`// tsconfig.json 最佳实践配置
{
  "compilerOptions": {
    // 基础配置
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "node",
    
    // 严格类型检查 - 推荐全部启用
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    
    // 代码质量检查
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    
    // 模块导入
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    
    // 路径映射
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/types/*": ["./src/types/*"],
      "@/hooks/*": ["./src/hooks/*"]
    },
    
    // Next.js 专用配置
    "allowJs": true,
    "skipLibCheck": true,
    "noEmit": true,
    "incremental": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "plugins": [{ "name": "next" }]
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules", ".next", "dist"]
}`}
              language="json"
              filename="tsconfig.json 最佳实践"
            />
          }
        />

        {/* 类型安全演示 */}
        <DemoSection
          title="类型安全演示"
          description="体验 TypeScript 如何确保数据的类型安全和一致性"
          demoComponent={<TypeScriptDemo />}
          codeComponent={
            <CodeBlock
              code={`// 类型定义
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

// React 组件中的使用
function UserProfile() {
  const [user, setUser] = useState<User>({
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    isActive: true
  });

  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, text: '学习 TypeScript', completed: true },
    { id: 2, text: '构建 Next.js 应用', completed: false },
  ]);

  // TypeScript 确保类型安全
  const toggleUserStatus = () => {
    setUser(prevUser => ({
      ...prevUser,
      isActive: !prevUser.isActive // 类型检查确保正确性
    }));
  };

  return (
    <div>
      <h2>{user.name}</h2>
      <p>状态: {user.isActive ? '活跃' : '非活跃'}</p>
      {/* 其他 UI 代码 */}
    </div>
  );
}`}
              language="tsx"
              filename="类型安全的 React 组件"
            />
          }
        />

        {/* React 组件类型 */}
        <DemoSection
          title="React 组件类型定义"
          description="学习如何为 React 组件定义严格的 Props 类型"
          demoComponent={<PropsDemo />}
          codeComponent={
            <CodeBlock
              code={componentTypesCode}
              language="tsx"
              filename="React 组件类型定义"
            />
          }
        />

        {/* Next.js 特定类型 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Next.js 特定类型
          </h2>
          <div className="prose prose-lg max-w-none dark:prose-invert mb-6">
            <p>
              Next.js 提供了许多内置类型来帮助开发者构建类型安全的应用程序。
              这些类型涵盖了页面组件、API 路由、元数据等各个方面。
            </p>
          </div>
          
          <CodeBlock
            code={nextjsTypesCode}
            language="typescript"
            filename="Next.js 类型定义"
          />
        </section>

        {/* 高级类型技巧 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            TypeScript 实用类型
          </h2>
          <div className="prose prose-lg max-w-none dark:prose-invert mb-6">
            <p>
              TypeScript 提供了许多实用类型（Utility Types），
              帮助我们基于现有类型创建新类型，提高代码的复用性和灵活性。
            </p>
          </div>
          
          <CodeBlock
            code={utilityTypesCode}
            language="typescript"
            filename="TypeScript 实用类型"
          />
        </section>

        {/* 互动编辑器 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            在线 TypeScript 编辑器
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            尝试编写 TypeScript 代码，体验类型检查和智能提示：
          </p>
          
          <CodeEditor
            title="TypeScript 练习场"
            defaultCode={`// 定义一个用户类型
interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
}

// 创建一个用户验证函数
function validateUser(user: User): string[] {
  const errors: string[] = [];
  
  if (!user.name || user.name.length < 2) {
    errors.push('姓名至少需要 2 个字符');
  }
  
  if (!user.email.includes('@')) {
    errors.push('邮箱格式不正确');
  }
  
  if (user.age !== undefined && user.age < 0) {
    errors.push('年龄不能为负数');
  }
  
  return errors;
}

// 测试函数
const user: User = {
  id: 1,
  name: '张三',
  email: 'zhangsan@example.com',
  age: 25
};

const validationErrors = validateUser(user);
console.log('验证结果:', validationErrors.length === 0 ? '通过' : validationErrors);

// 尝试修改 user 对象，看看 TypeScript 如何提供类型检查！`}
            language="typescript"
            height="400px"
            onRun={(code) => console.log('执行 TypeScript 代码:', code)}
            showConsole={true}
          />
        </section>

        {/* 最佳实践 */}
        <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            TypeScript 最佳实践
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-2 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                推荐做法
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-green-600 flex-shrink-0" />
                  优先使用接口而不是类型别名定义对象结构
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-green-600 flex-shrink-0" />
                  为所有函数参数和返回值添加类型注解
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-green-600 flex-shrink-0" />
                  使用严格的 TypeScript 配置（strict: true）
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-green-600 flex-shrink-0" />
                  利用类型推断，避免不必要的类型注解
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-600 mb-2 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                避免的做法
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-red-600 flex-shrink-0" />
                  过度使用 any 类型，失去类型安全性
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-red-600 flex-shrink-0" />
                  忽略 TypeScript 编译错误
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-red-600 flex-shrink-0" />
                  创建过于复杂的类型定义
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-red-600 flex-shrink-0" />
                  在不必要的地方显式声明类型
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 下一步 */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            准备好了吗？
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            现在你已经掌握了 TypeScript 的核心概念，让我们继续学习 Prisma ORM 和数据库操作。
          </p>
          <Link
            href="/tutorials/prisma"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            学习 Prisma ORM
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </section>
      </div>
    </TutorialLayout>
  );
}
