'use client';

import {
  BulbOutlined,
  CheckCircleOutlined,
  CodeOutlined,
  ExperimentOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { Alert, Button, Card, Input, InputRef, Tabs, Tag } from 'antd';
import { ArrowRight } from 'lucide-react';

import React, { useRef, useState } from 'react';

import Link from 'next/link';

import { CodeBlock } from '@/components/CodeBlock';
import { TutorialLayout } from '@/components/TutorialLayout';

// JSX 演示组件
const GreetingComponent = ({ name }: { name: string }) => {
  return (
    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border">
      <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">你好, {name}！</h3>
      <p className="text-gray-600 dark:text-gray-300 mt-2">欢迎学习 JSX 语法基础</p>
    </div>
  );
};

// 条件渲染演示
const ConditionalExample = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('guest');

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Button
          type={isLoggedIn ? 'primary' : 'default'}
          onClick={() => setIsLoggedIn(!isLoggedIn)}
        >
          {isLoggedIn ? '已登录' : '未登录'}
        </Button>
        <Button
          onClick={() => setUserRole(userRole === 'admin' ? 'user' : 'admin')}
          disabled={!isLoggedIn}
        >
          切换角色: {userRole}
        </Button>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        {isLoggedIn ? (
          <div>
            <p className="text-green-600 dark:text-green-400">✅ 用户已登录</p>
            {userRole === 'admin' && (
              <p className="text-purple-600 dark:text-purple-400">🔑 管理员权限</p>
            )}
          </div>
        ) : (
          <p className="text-gray-500">❌ 请先登录</p>
        )}
      </div>
    </div>
  );
};

// 列表渲染演示
const ListRenderingExample = () => {
  const [items, setItems] = useState(['React', 'Vue', 'Angular']);
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="添加新框架"
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          onPressEnter={addItem}
        />
        <Button type="primary" onClick={addItem}>
          添加
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {items.map((item, index) => {
          const itemId = `${item.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Date.now()}_${index}`;
          return (
            <div
              key={itemId}
              className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border"
            >
              <span className="font-medium">{item}</span>
              <Button size="small" danger onClick={() => removeItem(index)}>
                删除
              </Button>
            </div>
          );
        })}
      </div>

      {items.length === 0 && <p className="text-gray-500 text-center py-4">暂无数据</p>}
    </div>
  );
};

// Fragment 演示
const FragmentExample = () => {
  const [showDetails, setShowDetails] = useState(false);
  const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
  ];

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border">
        <h4 className="font-semibold mb-2">Fragment 示例</h4>
        <Button onClick={() => setShowDetails(!showDetails)} className="mb-3">
          {showDetails ? '隐藏' : '显示'}详细信息
        </Button>

        <div className="space-y-2">
          <h5>用户列表 (使用Fragment避免额外DOM节点):</h5>
          {showDetails && (
            <>
              <p className="text-gray-600 dark:text-gray-400">详细信息1</p>
              <p className="text-gray-600 dark:text-gray-400">详细信息2</p>
            </>
          )}

          <ul className="mt-2">
            {users.map(user => (
              <React.Fragment key={user.id}>
                <li className="font-medium">{user.name}</li>
                <li className="text-sm text-gray-600 dark:text-gray-400 mb-2">{user.email}</li>
              </React.Fragment>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// 样式演示
const StylingExample = () => {
  const [isActive, setIsActive] = useState(false);
  const [size, setSize] = useState('medium');

  const dynamicStyle = {
    backgroundColor: isActive ? '#10b981' : '#6b7280',
    color: 'white',
    padding: size === 'large' ? '12px 24px' : '8px 16px',
    fontSize: size === 'large' ? '18px' : '14px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    margin: '4px',
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border">
        <h4 className="font-semibold mb-3">动态样式演示</h4>

        <div className="space-x-2 mb-4">
          <Button onClick={() => setIsActive(!isActive)}>{isActive ? '激活' : '未激活'}</Button>
          <Button onClick={() => setSize(size === 'large' ? 'medium' : 'large')}>
            大小: {size}
          </Button>
        </div>

        <div className="space-y-2">
          <button style={dynamicStyle}>动态样式按钮</button>

          <div className="mt-3">
            <div
              style={{
                padding: '10px',
                backgroundColor: '#f3f4f6',
                borderRadius: '4px',
                border: `2px solid ${isActive ? '#10b981' : '#d1d5db'}`,
              }}
            >
              内联样式容器 (状态: {isActive ? '激活' : '未激活'})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Ref 演示
const RefExample = () => {
  const inputRef = useRef<InputRef>(null);
  const [message, setMessage] = useState('');

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const clearAndFocus = () => {
    if (inputRef.current) {
      inputRef.current.input!.value = '';
      inputRef.current.focus();
      setMessage('输入框已清空并聚焦');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const getValue = () => {
    const value = inputRef.current?.input?.value || '';
    setMessage(`当前输入值: ${value}`);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border">
        <h4 className="font-semibold mb-3">Ref 使用演示</h4>

        <div className="space-y-3">
          <Input ref={inputRef} placeholder="这是一个使用 ref 的输入框" />

          <div className="flex space-x-2">
            <Button onClick={focusInput} type="primary">
              聚焦输入框
            </Button>
            <Button onClick={clearAndFocus}>清空并聚焦</Button>
            <Button onClick={getValue}>获取值</Button>
          </div>

          {message && <Alert message={message} type="info" showIcon className="mt-2" />}
        </div>
      </div>
    </div>
  );
};

// 事件处理演示
const EventHandlingExample = () => {
  const [clickCount, setClickCount] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [submittedValue, setSubmittedValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedValue(inputValue);
    setInputValue('');
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border">
        <p className="mb-2">点击计数器:</p>
        <Button type="primary" onClick={() => setClickCount(clickCount + 1)} className="mr-2">
          点击我 ({clickCount})
        </Button>
        <Button onClick={() => setClickCount(0)}>重置</Button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border"
      >
        <p className="mb-2">表单提交:</p>
        <div className="flex space-x-2">
          <Input
            placeholder="输入一些文字"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
          />
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </div>
        {submittedValue && (
          <p className="mt-2 text-green-600 dark:text-green-400">提交的内容: {submittedValue}</p>
        )}
      </form>
    </div>
  );
};

export default function JSXBasicsPage() {
  const [activeDemo, setActiveDemo] = useState('greeting');

  const jsxExamples = {
    basic: `// 1. 基本 JSX 语法
const element = <h1>Hello, World!</h1>;

// 2. JSX 中嵌入表达式
const name = 'React';
const element = <h1>Hello, {name}!</h1>;

// 3. JSX 属性
const element = <img src="image.jpg" alt="描述" />;

// 4. JSX 子元素
const element = (
  <div>
    <h1>标题</h1>
    <p>段落内容</p>
  </div>
);`,

    conditional: `// 条件渲染的几种方式

// 1. 使用 if 语句
function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <h1>欢迎回来!</h1>;
  }
  return <h1>请先登录</h1>;
}

// 2. 使用三元运算符
function Greeting({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? <h1>欢迎回来!</h1> : <h1>请先登录</h1>}
    </div>
  );
}

// 3. 使用 && 运算符
function Greeting({ isLoggedIn, user }) {
  return (
    <div>
      {isLoggedIn && <h1>欢迎, {user.name}!</h1>}
      {!isLoggedIn && <button>登录</button>}
    </div>
  );
}`,

    lists: `// 列表渲染

// 1. 基本列表渲染
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li key={number}>{number}</li>
);

// 2. 渲染组件列表
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

function UserList() {
  return (
    <ul>
      {users.map(user =>
        <User key={user.id} user={user} />
      )}
    </ul>
  );
}

// 3. 使用索引作为 key (不推荐)
const items = ['apple', 'banana', 'cherry'];
const listItems = items.map((item, index) =>
  <li key={index}>{item}</li>
);`,

    events: `// 事件处理

// 1. 基本事件处理
function Button() {
  const handleClick = () => {
    alert('按钮被点击了!');
  };

  return <button onClick={handleClick}>点击我</button>;
}

// 2. 传递参数
function Button() {
  const handleClick = (message) => {
    alert(message);
  };

  return (
    <button onClick={() => handleClick('Hello!')}>
      点击我
    </button>
  );
}

// 3. 事件对象
function Input() {
  const handleChange = (event) => {
    console.log('输入值:', event.target.value);
  };

  return <input onChange={handleChange} />;
}

// 4. 阻止默认行为
function Form() {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('表单提交');
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">提交</button>
    </form>
  );
}`,

    components: `// 组件定义和使用

// 1. 函数组件
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// 2. 使用组件
function App() {
  return (
    <div>
      <Welcome name="Alice" />
      <Welcome name="Bob" />
    </div>
  );
}

// 3. 组件组合
function Avatar({ user }) {
  return (
    <img
      src={user.avatar}
      alt={user.name}
      className="avatar"
    />
  );
}

function UserInfo({ user }) {
  return (
    <div>
      <Avatar user={user} />
      <div>{user.name}</div>
    </div>
  );
}

// 4. Children prop
function Card({ children, title }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

// 使用
<Card title="用户信息">
  <UserInfo user={user} />
</Card>`,

    fragments: `// JSX Fragments - 避免额外的 DOM 节点

// 1. 使用 React.Fragment
import React from 'react';

function UserProfile() {
  return (
    <React.Fragment>
      <h1>用户信息</h1>
      <p>这里不会产生额外的包装元素</p>
    </React.Fragment>
  );
}

// 2. 使用短语法 <>
function UserProfile() {
  return (
    <>
      <h1>用户信息</h1>
      <p>更简洁的写法</p>
    </>
  );
}

// 3. 带 key 的 Fragment (循环中使用)
function UserList({ users }) {
  return (
    <ul>
      {users.map(user => (
        <React.Fragment key={user.id}>
          <li>{user.name}</li>
          <li>{user.email}</li>
        </React.Fragment>
      ))}
    </ul>
  );
}

// 4. 条件渲染中的 Fragment
function ConditionalContent({ showDetails }) {
  return (
    <div>
      <h1>标题</h1>
      {showDetails && (
        <>
          <p>详细信息1</p>
          <p>详细信息2</p>
        </>
      )}
    </div>
  );
}`,

    styling: `// JSX 中的样式处理

// 1. 内联样式 (使用对象)
function StyledComponent() {
  const divStyle = {
    color: 'blue',
    backgroundColor: 'lightgray',
    padding: '10px',
    borderRadius: '5px'
  };

  return (
    <div style={divStyle}>
      <p style={{ fontSize: '16px', fontWeight: 'bold' }}>
        内联样式示例
      </p>
    </div>
  );
}

// 2. 动态样式
function DynamicStyles({ isActive, size }) {
  return (
    <button
      style={{
        backgroundColor: isActive ? '#007bff' : '#6c757d',
        fontSize: size === 'large' ? '18px' : '14px',
        padding: size === 'large' ? '12px 24px' : '8px 16px',
        border: 'none',
        borderRadius: '4px',
        color: 'white',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
    >
      动态样式按钮
    </button>
  );
}

// 3. CSS 类名处理
function ClassNameExamples({ isActive, size, type }) {
  // 基础类名拼接
  const baseClass = 'btn';
  const className = \`\${baseClass} \${isActive ? 'active' : ''} \${size}\`;

  // 条件类名
  const classes = [
    'button',
    isActive && 'button--active',
    \`button--\${type}\`,
    \`button--\${size}\`
  ].filter(Boolean).join(' ');

  return (
    <>
      <button className={className}>基础类名拼接</button>
      <button className={classes}>条件类名</button>
    </>
  );
}

// 4. CSS 模块 (假设有 styles.module.css)
import styles from './styles.module.css';

function CSSModules() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>CSS 模块示例</h1>
      <p className={\`\${styles.text} \${styles.highlight}\`}>
        组合多个 CSS 模块类
      </p>
    </div>
  );
}`,

    propsAdvanced: `// Props 高级用法

// 1. Props 解构
function UserCard({ name, age, email, avatar, ...restProps }) {
  return (
    <div {...restProps} className="user-card">
      <img src={avatar} alt={name} />
      <h3>{name}</h3>
      <p>年龄: {age}</p>
      <p>邮箱: {email}</p>
    </div>
  );
}

// 2. 默认 Props
function Button({ children, type = 'button', size = 'medium', onClick }) {
  return (
    <button
      type={type}
      className={\`btn btn--\${size}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// 3. Props 传播 (Spread)
function EnhancedInput(props) {
  return (
    <div className="input-wrapper">
      <input
        {...props}
        className={\`input \${props.className || ''}\`}
      />
    </div>
  );
}

// 使用
<EnhancedInput
  type="text"
  placeholder="请输入内容"
  onChange={handleChange}
  className="custom-input"
/>

// 4. 条件 Props
function ConditionalProps({ isDisabled, isLoading, children }) {
  const buttonProps = {
    className: 'btn',
    ...(isDisabled && { disabled: true }),
    ...(isLoading && { 'aria-busy': true }),
    ...(isLoading && { disabled: true })
  };

  return <button {...buttonProps}>{children}</button>;
}

// 5. Props 验证 (TypeScript)
interface ProductProps {
  name: string;
  price: number;
  category?: string;
  onBuy?: (id: string) => void;
}

function Product({ name, price, category = '未分类', onBuy }: ProductProps) {
  return (
    <div className="product">
      <h3>{name}</h3>
      <p>价格: ¥{price}</p>
      <p>分类: {category}</p>
      {onBuy && (
        <button onClick={() => onBuy('product-id')}>
          购买
        </button>
      )}
    </div>
  );
}`,

    escapeChars: `// JSX 中的特殊字符和转义

// 1. HTML 实体
function HTMLEntities() {
  return (
    <div>
      <p>版权符号: &copy; 2024</p>
      <p>小于号: &lt;</p>
      <p>大于号: &gt;</p>
      <p>空格: &nbsp;&nbsp;&nbsp;</p>
      <p>引号: &quot;Hello&quot;</p>
      <p>撇号: &apos;World&apos;</p>
    </div>
  );
}

// 2. Unicode 字符
function UnicodeChars() {
  return (
    <div>
      <p>心形: ♥ (\\u2665)</p>
      <p>星星: ★ (\\u2605)</p>
      <p>箭头: → (\\u2192)</p>
      <p>表情: 😀 (\\u{1F600})</p>
    </div>
  );
}

// 3. 危险的 HTML (谨慎使用)
function DangerousHTML({ htmlContent }) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: htmlContent // 确保内容是安全的!
      }}
    />
  );
}

// 4. 转义用户输入
function EscapeUserInput({ userInput }) {
  // React 默认会转义文本内容
  return (
    <div>
      <p>用户输入: {userInput}</p>
      {/* 如果 userInput 包含 <script>，会被自动转义 */}
    </div>
  );
}

// 5. 换行处理
function LineBreaks({ text }) {
  return (
    <div>
      {/* 方法1: 使用 \\n 配合 CSS white-space */}
      <pre style={{ whiteSpace: 'pre-wrap' }}>{text}</pre>

      {/* 方法2: 手动替换换行符 */}
      <div>
        {text.split('\\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            {index < text.split('\\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}`,

    refs: `// JSX 中使用 Refs

// 1. 基本 ref 使用
import { useRef, useEffect } from 'react';

function FocusInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    // 组件挂载后自动聚焦
    inputRef.current?.focus();
  }, []);

  const handleReset = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        placeholder="自动聚焦的输入框"
      />
      <button onClick={handleReset}>重置并聚焦</button>
    </div>
  );
}

// 2. 多个 refs
function MultipleRefs() {
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      firstName: firstNameRef.current?.value,
      lastName: lastNameRef.current?.value,
      email: emailRef.current?.value
    };
    console.log('表单数据:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input ref={firstNameRef} placeholder="名字" />
      <input ref={lastNameRef} placeholder="姓氏" />
      <input ref={emailRef} type="email" placeholder="邮箱" />
      <button type="submit">提交</button>
    </form>
  );
}

// 3. Ref 回调
function RefCallback() {
  const [height, setHeight] = useState(0);

  const measureRef = useCallback((node) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return (
    <div>
      <div ref={measureRef} style={{ padding: '20px', background: '#f0f0f0' }}>
        这个元素的高度是: {height}px
      </div>
    </div>
  );
}

// 4. forwardRef (传递 ref 给子组件)
const CustomInput = React.forwardRef((props, ref) => {
  return (
    <div className="custom-input-wrapper">
      <input ref={ref} {...props} className="custom-input" />
    </div>
  );
});

function ParentComponent() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div>
      <CustomInput ref={inputRef} placeholder="自定义输入组件" />
      <button onClick={focusInput}>聚焦输入框</button>
    </div>
  );
}`,
  };

  return (
    <TutorialLayout
      title="JSX 语法基础"
      description="学习 JSX 语法，掌握 React 开发的基础语言。JSX 是 JavaScript 的语法扩展，让你能够以类似 HTML 的方式编写组件。"
      nextTutorial={{
        title: "Next.js 基础",
        href: "/tutorials/nextjs-basics"
      }}
    >
        {/* 快速导航 */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {[
            { key: 'greeting', title: '基础语法', icon: <CodeOutlined /> },
            { key: 'conditional', title: '条件渲染', icon: <BulbOutlined /> },
            { key: 'lists', title: '列表渲染', icon: <ExperimentOutlined /> },
            { key: 'events', title: '事件处理', icon: <PlayCircleOutlined /> },
            { key: 'fragments', title: 'Fragments', icon: <CodeOutlined /> },
            { key: 'styling', title: '样式处理', icon: <BulbOutlined /> },
          ].map(item => (
            <div
              key={item.key}
              onClick={() => setActiveDemo(item.key)}
              className={`
                cursor-pointer p-4 rounded-lg border-2 transition-all duration-200
                ${
                  activeDemo === item.key
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 hover:shadow-sm'
                }
              `}
            >
              <div className="flex flex-col items-center space-y-2 text-center">
                <div
                  className={`text-xl ${activeDemo === item.key ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  {item.icon}
                </div>
                <span
                  className={`text-sm font-medium ${activeDemo === item.key ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}
                >
                  {item.title}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：理论知识 */}
          <div className="space-y-6">
            <Card title="📚 JSX 语法规则" className="shadow-lg">
              <div className="space-y-4">
                <Alert
                  message="什么是 JSX？"
                  description="JSX (JavaScript XML) 是 React 中使用的语法扩展，它允许你在 JavaScript 中编写类似 HTML 的标记。"
                  type="info"
                  showIcon
                />

                <div className="space-y-2">
                  <h4 className="font-semibold text-lg">核心规则：</h4>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start space-x-2">
                      <CheckCircleOutlined className="text-green-500 mt-1" />
                      <span>必须有一个根元素（或使用 Fragment）</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircleOutlined className="text-green-500 mt-1" />
                      <span>所有标签都必须闭合</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircleOutlined className="text-green-500 mt-1" />
                      <span>使用 camelCase 命名属性</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircleOutlined className="text-green-500 mt-1" />
                      <span>使用 {} 嵌入 JavaScript 表达式</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircleOutlined className="text-green-500 mt-1" />
                      <span>class 属性要写成 className</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* 代码示例 */}
            <Card title="💻 代码示例" className="shadow-lg">
              <Tabs
                defaultActiveKey="basic"
                items={[
                  {
                    key: 'basic',
                    label: '基础语法',
                    children: <CodeBlock language="jsx" code={jsxExamples.basic} />,
                  },
                  {
                    key: 'conditional',
                    label: '条件渲染',
                    children: <CodeBlock language="jsx" code={jsxExamples.conditional} />,
                  },
                  {
                    key: 'lists',
                    label: '列表渲染',
                    children: <CodeBlock language="jsx" code={jsxExamples.lists} />,
                  },
                  {
                    key: 'events',
                    label: '事件处理',
                    children: <CodeBlock language="jsx" code={jsxExamples.events} />,
                  },
                  {
                    key: 'components',
                    label: '组件',
                    children: <CodeBlock language="jsx" code={jsxExamples.components} />,
                  },
                  {
                    key: 'fragments',
                    label: 'Fragments',
                    children: <CodeBlock language="jsx" code={jsxExamples.fragments} />,
                  },
                  {
                    key: 'styling',
                    label: '样式处理',
                    children: <CodeBlock language="jsx" code={jsxExamples.styling} />,
                  },
                  {
                    key: 'propsAdvanced',
                    label: 'Props高级',
                    children: <CodeBlock language="jsx" code={jsxExamples.propsAdvanced} />,
                  },
                  {
                    key: 'escapeChars',
                    label: '特殊字符',
                    children: <CodeBlock language="jsx" code={jsxExamples.escapeChars} />,
                  },
                  {
                    key: 'refs',
                    label: 'Refs',
                    children: <CodeBlock language="jsx" code={jsxExamples.refs} />,
                  },
                ]}
              />
            </Card>
          </div>

          {/* 右侧：实时演示 */}
          <div className="space-y-6">
            <Card title="🎯 实时演示" className="shadow-lg">
              <Tabs
                activeKey={activeDemo}
                onChange={setActiveDemo}
                items={[
                  {
                    key: 'greeting',
                    label: '问候组件',
                    children: (
                      <div className="space-y-4">
                        <h4 className="font-semibold">基础 JSX 组件</h4>
                        <GreetingComponent name="开发者" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          这个组件演示了基本的 JSX 语法和 props 的使用
                        </p>
                      </div>
                    ),
                  },
                  {
                    key: 'conditional',
                    label: '条件渲染',
                    children: (
                      <div className="space-y-4">
                        <h4 className="font-semibold">条件渲染演示</h4>
                        <ConditionalExample />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          演示了三种常见的条件渲染方式
                        </p>
                      </div>
                    ),
                  },
                  {
                    key: 'lists',
                    label: '列表渲染',
                    children: (
                      <div className="space-y-4">
                        <h4 className="font-semibold">列表渲染演示</h4>
                        <ListRenderingExample />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          动态列表渲染，注意 key 属性的重要性
                        </p>
                      </div>
                    ),
                  },
                  {
                    key: 'events',
                    label: '事件处理',
                    children: (
                      <div className="space-y-4">
                        <h4 className="font-semibold">事件处理演示</h4>
                        <EventHandlingExample />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          不同类型的事件处理方式
                        </p>
                      </div>
                    ),
                  },
                  {
                    key: 'fragments',
                    label: 'Fragment',
                    children: (
                      <div className="space-y-4">
                        <h4 className="font-semibold">Fragment 演示</h4>
                        <FragmentExample />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          使用 Fragment 避免额外的 DOM 节点
                        </p>
                      </div>
                    ),
                  },
                  {
                    key: 'styling',
                    label: '样式处理',
                    children: (
                      <div className="space-y-4">
                        <h4 className="font-semibold">样式处理演示</h4>
                        <StylingExample />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          JSX 中的内联样式和动态样式处理
                        </p>
                      </div>
                    ),
                  },
                  {
                    key: 'refs',
                    label: 'Refs',
                    children: (
                      <div className="space-y-4">
                        <h4 className="font-semibold">Ref 使用演示</h4>
                        <RefExample />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          直接访问和操作 DOM 元素
                        </p>
                      </div>
                    ),
                  },
                ]}
              />
            </Card>

            {/* 最佳实践 */}
            <Card title="💡 最佳实践" className="shadow-lg">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                    <div className="flex items-center space-x-2 mb-1">
                      <CheckCircleOutlined className="text-green-500" />
                      <span className="font-medium">使用有意义的 key</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      列表渲染时使用唯一且稳定的 key，避免使用数组索引
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-center space-x-2 mb-1">
                      <BulbOutlined className="text-blue-500" />
                      <span className="font-medium">保持组件纯粹</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      相同的输入应该产生相同的输出，避免副作用
                    </p>
                  </div>

                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500">
                    <div className="flex items-center space-x-2 mb-1">
                      <ExperimentOutlined className="text-purple-500" />
                      <span className="font-medium">合理拆分组件</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      单一职责原则，保持组件简单易维护
                    </p>
                  </div>

                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-500">
                    <div className="flex items-center space-x-2 mb-1">
                      <CodeOutlined className="text-orange-500" />
                      <span className="font-medium">优先使用 Fragment</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      避免不必要的包装元素，使用 &lt;&gt; 或 React.Fragment
                    </p>
                  </div>

                  <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border-l-4 border-cyan-500">
                    <div className="flex items-center space-x-2 mb-1">
                      <BulbOutlined className="text-cyan-500" />
                      <span className="font-medium">样式管理</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      避免大量内联样式，优先使用CSS类和CSS模块
                    </p>
                  </div>

                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
                    <div className="flex items-center space-x-2 mb-1">
                      <ExperimentOutlined className="text-red-500" />
                      <span className="font-medium">谨慎使用 Refs</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      只在必要时使用ref，优先考虑声明式编程
                    </p>
                  </div>

                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border-l-4 border-emerald-500">
                    <div className="flex items-center space-x-2 mb-1">
                      <CheckCircleOutlined className="text-emerald-500" />
                      <span className="font-medium">转义和安全</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      React自动转义内容，避免使用dangerouslySetInnerHTML
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* 练习区域 */}
        <Card title="🔨 动手练习" className="mt-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border">
              <h4 className="font-semibold mb-2">练习 1: Fragment 优化</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                重构现有组件，使用Fragment减少不必要的DOM嵌套
              </p>
              <Tag color="orange">初级</Tag>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border">
              <h4 className="font-semibold mb-2">练习 2: 动态样式系统</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                创建一个主题切换组件，支持多种样式配置
              </p>
              <Tag color="blue">中级</Tag>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border">
              <h4 className="font-semibold mb-2">练习 3: Ref 实战应用</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                实现一个富文本编辑器，使用ref控制光标和选择
              </p>
              <Tag color="green">高级</Tag>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border">
              <h4 className="font-semibold mb-2">练习 4: Props 高级处理</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                创建通用组件，支持props解构、传播和条件属性
              </p>
              <Tag color="purple">中级</Tag>
            </div>

            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border">
              <h4 className="font-semibold mb-2">练习 5: 安全内容渲染</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                处理用户输入，实现安全的HTML内容渲染机制
              </p>
              <Tag color="red">高级</Tag>
            </div>

            <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border">
              <h4 className="font-semibold mb-2">练习 6: 综合应用</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                构建一个完整的组件库，应用所有JSX高级技术
              </p>
              <Tag color="cyan">专家级</Tag>
            </div>
          </div>
        </Card>

        {/* 性能优化提示 */}
        <Card title="⚡ 性能优化提示" className="mt-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg flex items-center space-x-2">
                <ExperimentOutlined className="text-blue-500" />
                <span>JSX 优化技巧</span>
              </h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start space-x-2">
                  <CheckCircleOutlined className="text-green-500 mt-1 flex-shrink-0" />
                  <span>避免在render中创建对象和函数</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircleOutlined className="text-green-500 mt-1 flex-shrink-0" />
                  <span>使用React.memo包装纯组件</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircleOutlined className="text-green-500 mt-1 flex-shrink-0" />
                  <span>合理使用key属性，避免不必要的重渲染</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircleOutlined className="text-green-500 mt-1 flex-shrink-0" />
                  <span>条件渲染时考虑性能影响</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-lg flex items-center space-x-2">
                <BulbOutlined className="text-yellow-500" />
                <span>常见陷阱</span>
              </h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1 flex-shrink-0">⚠️</span>
                  <span>避免使用数组索引作为key</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1 flex-shrink-0">⚠️</span>
                  <span>不要在循环中使用内联对象样式</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1 flex-shrink-0">⚠️</span>
                  <span>避免深层条件嵌套，影响可读性</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1 flex-shrink-0">⚠️</span>
                  <span>谨慎使用dangerouslySetInnerHTML</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>


    </TutorialLayout>
  );
}
