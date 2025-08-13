'use client';

import {
  BulbOutlined,
  CheckCircleOutlined,
  CodeOutlined,
  ExperimentOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { Alert, Button, Card, Input, Tabs, Tag } from 'antd';

import React, { useState } from 'react';

import { CodeBlock } from '@/components/CodeBlock';

const { TabPane } = Tabs;

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
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border"
          >
            <span className="font-medium">{item}</span>
            <Button size="small" danger onClick={() => removeItem(index)}>
              删除
            </Button>
          </div>
        ))}
      </div>

      {items.length === 0 && <p className="text-gray-500 text-center py-4">暂无数据</p>}
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            JSX 语法基础
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            学习 JSX 语法，掌握 React 开发的基础语言。JSX 是 JavaScript 的语法扩展，让你能够以类似
            HTML 的方式编写组件。
          </p>
        </div>

        {/* 快速导航 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { key: 'syntax', title: '基础语法', icon: <CodeOutlined /> },
            { key: 'conditional', title: '条件渲染', icon: <BulbOutlined /> },
            { key: 'lists', title: '列表渲染', icon: <ExperimentOutlined /> },
            { key: 'events', title: '事件处理', icon: <PlayCircleOutlined /> },
          ].map(item => (
            <Button
              key={item.key}
              onClick={() => setActiveDemo(item.key)}
              className={`h-auto p-4 ${activeDemo === item.key ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}`}
            >
              <div className="flex flex-col items-center space-y-2">
                {item.icon}
                <span className="text-sm font-medium">{item.title}</span>
              </div>
            </Button>
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
              <Tabs defaultActiveKey="basic">
                <TabPane tab="基础语法" key="basic">
                  <CodeBlock language="jsx" code={jsxExamples.basic} />
                </TabPane>
                <TabPane tab="条件渲染" key="conditional">
                  <CodeBlock language="jsx" code={jsxExamples.conditional} />
                </TabPane>
                <TabPane tab="列表渲染" key="lists">
                  <CodeBlock language="jsx" code={jsxExamples.lists} />
                </TabPane>
                <TabPane tab="事件处理" key="events">
                  <CodeBlock language="jsx" code={jsxExamples.events} />
                </TabPane>
                <TabPane tab="组件" key="components">
                  <CodeBlock language="jsx" code={jsxExamples.components} />
                </TabPane>
              </Tabs>
            </Card>
          </div>

          {/* 右侧：实时演示 */}
          <div className="space-y-6">
            <Card title="🎯 实时演示" className="shadow-lg">
              <Tabs activeKey={activeDemo} onChange={setActiveDemo}>
                <TabPane tab="问候组件" key="greeting">
                  <div className="space-y-4">
                    <h4 className="font-semibold">基础 JSX 组件</h4>
                    <GreetingComponent name="开发者" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      这个组件演示了基本的 JSX 语法和 props 的使用
                    </p>
                  </div>
                </TabPane>

                <TabPane tab="条件渲染" key="conditional">
                  <div className="space-y-4">
                    <h4 className="font-semibold">条件渲染演示</h4>
                    <ConditionalExample />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      演示了三种常见的条件渲染方式
                    </p>
                  </div>
                </TabPane>

                <TabPane tab="列表渲染" key="lists">
                  <div className="space-y-4">
                    <h4 className="font-semibold">列表渲染演示</h4>
                    <ListRenderingExample />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      动态列表渲染，注意 key 属性的重要性
                    </p>
                  </div>
                </TabPane>

                <TabPane tab="事件处理" key="events">
                  <div className="space-y-4">
                    <h4 className="font-semibold">事件处理演示</h4>
                    <EventHandlingExample />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      不同类型的事件处理方式
                    </p>
                  </div>
                </TabPane>
              </Tabs>
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
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* 练习区域 */}
        <Card title="🔨 动手练习" className="mt-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border">
              <h4 className="font-semibold mb-2">练习 1: 创建个人名片</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                创建一个显示姓名、头像和简介的个人名片组件
              </p>
              <Tag color="orange">初级</Tag>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border">
              <h4 className="font-semibold mb-2">练习 2: 待办事项列表</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                实现添加、删除、标记完成的待办事项功能
              </p>
              <Tag color="blue">中级</Tag>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border">
              <h4 className="font-semibold mb-2">练习 3: 动态表单</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                创建包含验证和动态字段的复杂表单
              </p>
              <Tag color="green">高级</Tag>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
