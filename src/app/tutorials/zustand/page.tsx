'use client';

import {
  ArrowRight,
  Bell,
  Edit,
  Minus,
  Plus,
  Settings,
  ShoppingCart,
  Trash2,
  Users,
} from 'lucide-react';

import { useState } from 'react';

import NextImage from 'next/image';
import Link from 'next/link';

import { CodeBlock } from '@/components/CodeBlock';
import { CodeEditor } from '@/components/CodeEditor';
import { DemoSection } from '@/components/DemoSection';
import { TutorialLayout } from '@/components/TutorialLayout';

// 模拟 Zustand store
interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

// 简单的状态管理演示
function SimpleStateDemo() {
  const [count, setCount] = useState(0);
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, text: '学习 Zustand', completed: false, createdAt: new Date() },
    { id: 2, text: '构建状态管理', completed: true, createdAt: new Date() },
  ]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: TodoItem = {
        id: Date.now(),
        text: newTodo,
        completed: false,
        createdAt: new Date(),
      };
      setTodos([...todos, todo]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* 计数器 */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <Settings className="h-4 w-4 mr-2 text-blue-600" />
          简单计数器状态
        </h4>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCount(count - 1)}
            className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="text-2xl font-bold text-gray-900 dark:text-white min-w-[3rem] text-center">
            {count}
          </span>
          <button
            onClick={() => setCount(count + 1)}
            className="p-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCount(0)}
            className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
          >
            重置
          </button>
        </div>
      </div>

      {/* 待办事项 */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <Edit className="h-4 w-4 mr-2 text-green-600" />
          待办事项列表状态
        </h4>

        {/* 添加待办 */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTodo}
            onChange={e => setNewTodo(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && addTodo()}
            placeholder="添加新的待办事项..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
          <button
            onClick={addTodo}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            添加
          </button>
        </div>

        {/* 待办列表 */}
        <div className="space-y-2">
          {todos.map(todo => (
            <div
              key={todo.id}
              className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded"
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="rounded"
                />
                <span
                  className={`${todo.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}
                >
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          总共 {todos.length} 项，已完成 {todos.filter(t => t.completed).length} 项
        </div>
      </div>
    </div>
  );
}

// 复杂状态管理演示
function ComplexStateDemo() {
  const [user, setUser] = useState<User>({
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
  });

  const [cart, setCart] = useState<CartItem[]>([
    { id: 1, name: 'MacBook Pro', price: 12999, quantity: 1 },
    { id: 2, name: 'iPhone 15', price: 5999, quantity: 2 },
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, message: '欢迎使用 Zustand！', type: 'info', timestamp: new Date() },
    { id: 2, message: '购物车已更新', type: 'success', timestamp: new Date() },
  ]);

  const updateQuantity = (id: number, delta: number) => {
    setCart(
      cart
        .map(item => {
          if (item.id === id) {
            const newQuantity = Math.max(0, item.quantity + delta);
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const addNotification = (message: string, type: 'info' | 'success' | 'warning' | 'error') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date(),
    };
    setNotifications([notification, ...notifications]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-6">
      {/* 用户信息 */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <Users className="h-4 w-4 mr-2 text-blue-600" />
          用户状态
        </h4>
        <div className="flex items-center space-x-4">
          <NextImage
            src={user.avatar || '/placeholder-avatar.png'}
            alt={user.name}
            width={40}
            height={40}
            className="w-12 h-12 rounded-full bg-gray-200"
          />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
          </div>
          <button
            onClick={() => setUser({ ...user, name: user.name === '张三' ? '李四' : '张三' })}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
          >
            切换用户
          </button>
        </div>
      </div>

      {/* 购物车 */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <ShoppingCart className="h-4 w-4 mr-2 text-green-600" />
          购物车状态 ({totalItems} 件商品)
        </h4>

        <div className="space-y-3">
          {cart.map(item => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  ¥{item.price.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="p-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="p-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  <Plus className="h-3 w-3" />
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}

          {cart.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">购物车为空</p>
          )}

          {cart.length > 0 && (
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900 dark:text-white">总计:</span>
                <span className="font-bold text-lg text-green-600">
                  ¥{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 通知 */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
            <Bell className="h-4 w-4 mr-2 text-yellow-600" />
            通知状态 ({notifications.length})
          </h4>
          <div className="flex space-x-2">
            <button
              onClick={() => addNotification('新的通知消息', 'info')}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
            >
              添加通知
            </button>
            <button
              onClick={clearNotifications}
              className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
            >
              清空
            </button>
          </div>
        </div>

        <div className="space-y-2 max-h-40 overflow-y-auto">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-2 rounded text-sm border-l-4 ${
                notification.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                  : notification.type === 'error'
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                    : notification.type === 'warning'
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                      : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
              }`}
            >
              <p className="text-gray-900 dark:text-white">{notification.message}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {notification.timestamp.toLocaleTimeString()}
              </p>
            </div>
          ))}

          {notifications.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">暂无通知</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ZustandTutorial() {
  const basicStoreCode = `// stores/useCounterStore.ts
import { create } from 'zustand';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

// 在组件中使用
function Counter() {
  const { count, increment, decrement, reset } = useCounterStore();
  
  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>重置</button>
    </div>
  );
}`;

  const advancedStoreCode = `// stores/useAppStore.ts
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

interface AppState {
  // 用户状态
  user: User | null;
  setUser: (user: User | null) => void;
  
  // 待办事项状态
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  clearCompleted: () => void;
  
  // UI 状态
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  
  // 主题状态
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // 计算属性
  completedTodos: Todo[];
  pendingTodos: Todo[];
  todoStats: {
    total: number;
    completed: number;
    pending: number;
  };
}

export const useAppStore = create<AppState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // 初始状态
        user: null,
        todos: [],
        isLoading: false,
        theme: 'light',
        
        // 用户相关操作
        setUser: (user) => set({ user }),
        
        // 待办事项操作
        addTodo: (text) => set((state) => ({
          todos: [
            ...state.todos,
            {
              id: Date.now(),
              text,
              completed: false,
              createdAt: new Date(),
            },
          ],
        })),
        
        toggleTodo: (id) => set((state) => ({
          todos: state.todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        })),
        
        deleteTodo: (id) => set((state) => ({
          todos: state.todos.filter(todo => todo.id !== id),
        })),
        
        clearCompleted: () => set((state) => ({
          todos: state.todos.filter(todo => !todo.completed),
        })),
        
        // UI 状态操作
        setLoading: (isLoading) => set({ isLoading }),
        
        // 主题操作
        toggleTheme: () => set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
        
        // 计算属性（getters）
        get completedTodos() {
          return get().todos.filter(todo => todo.completed);
        },
        
        get pendingTodos() {
          return get().todos.filter(todo => !todo.completed);
        },
        
        get todoStats() {
          const todos = get().todos;
          return {
            total: todos.length,
            completed: todos.filter(t => t.completed).length,
            pending: todos.filter(t => !t.completed).length,
          };
        },
      }),
      {
        name: 'app-store', // 本地存储的键名
        storage: createJSONStorage(() => localStorage),
        // 只持久化特定字段
        partialize: (state) => ({
          user: state.user,
          todos: state.todos,
          theme: state.theme,
        }),
      }
    )
  )
);`;

  const middlewareCode = `// 中间件使用示例

// 1. 持久化中间件
import { persist, createJSONStorage } from 'zustand/middleware';

const usePersistentStore = create(
  persist(
    (set) => ({
      data: null,
      setData: (data) => set({ data }),
    }),
    {
      name: 'persistent-store',
      storage: createJSONStorage(() => localStorage),
      // 自定义序列化
      serialize: (state) => JSON.stringify(state),
      deserialize: (str) => JSON.parse(str),
      // 版本控制和迁移
      version: 1,
      migrate: (persistedState, version) => {
        if (version === 0) {
          // 从版本 0 迁移到版本 1
          return { ...persistedState, newField: 'default' };
        }
        return persistedState;
      },
    }
  )
);

// 2. 订阅中间件
import { subscribeWithSelector } from 'zustand/middleware';

const useSubscriptionStore = create(
  subscribeWithSelector((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
  }))
);

// 订阅特定字段变化
useSubscriptionStore.subscribe(
  (state) => state.count,
  (count, prevCount) => {
    console.log('计数从', prevCount, '变为', count);
  }
);

// 3. 日志中间件
const logger = (config) => (set, get, api) =>
  config(
    (...args) => {
      console.log('State before:', get());
      set(...args);
      console.log('State after:', get());
    },
    get,
    api
  );

const useLoggedStore = create(
  logger((set) => ({
    data: null,
    setData: (data) => set({ data }),
  }))
);

// 4. Redux DevTools 中间件
import { devtools } from 'zustand/middleware';

const useDevtoolsStore = create(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 }), undefined, 'increment'),
      decrement: () => set((state) => ({ count: state.count - 1 }), undefined, 'decrement'),
    }),
    {
      name: 'counter-store',
    }
  )
);`;

  const componentsCode = `// 在组件中使用 Zustand

// 1. 基本使用
function TodoList() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useAppStore();
  const [newTodo, setNewTodo] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodo(newTodo);
      setNewTodo('');
    }
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="添加待办事项"
        />
        <button type="submit">添加</button>
      </form>
      
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)}>删除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 2. 选择性订阅（避免不必要的重渲染）
function TodoStats() {
  // 只订阅 todoStats，其他状态变化不会触发重渲染
  const stats = useAppStore((state) => state.todoStats);
  
  return (
    <div>
      <p>总计: {stats.total}</p>
      <p>已完成: {stats.completed}</p>
      <p>待完成: {stats.pending}</p>
    </div>
  );
}

// 3. 使用 shallow 比较
import { shallow } from 'zustand/shallow';

function UserProfile() {
  const { user, setUser } = useAppStore(
    (state) => ({ user: state.user, setUser: state.setUser }),
    shallow
  );
  
  if (!user) return <div>请登录</div>;
  
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

// 4. 异步操作
function DataFetcher() {
  const { setLoading, setUser } = useAppStore();
  
  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user');
      const user = await response.json();
      setUser(user);
    } catch (error) {
      console.error('获取用户失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUser();
  }, []);
  
  const isLoading = useAppStore((state) => state.isLoading);
  
  if (isLoading) return <div>加载中...</div>;
  
  return <UserProfile />;
}`;

  const bestPracticesCode = `// Zustand 最佳实践

// 1. 按功能分割 Store
// stores/useAuthStore.ts
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  login: async (credentials) => {
    const response = await authAPI.login(credentials);
    set({ user: response.user, token: response.token });
  },
  logout: () => set({ user: null, token: null }),
}));

// stores/useCartStore.ts
export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) => set((state) => ({ 
    items: [...state.items, item] 
  })),
  removeItem: (id) => set((state) => ({ 
    items: state.items.filter(item => item.id !== id) 
  })),
}));

// 2. 使用 Immer 处理复杂状态
import { produce } from 'immer';

const useComplexStore = create((set) => ({
  nested: {
    deeply: {
      nested: {
        value: 0
      }
    }
  },
  updateNested: (newValue) => set(produce((state) => {
    state.nested.deeply.nested.value = newValue;
  })),
}));

// 3. 类型安全的 Slice 模式
interface UserSlice {
  user: User | null;
  setUser: (user: User | null) => void;
}

interface TodoSlice {
  todos: Todo[];
  addTodo: (text: string) => void;
}

const createUserSlice: StateCreator<UserSlice & TodoSlice, [], [], UserSlice> = (set) => ({
  user: null,
  setUser: (user) => set({ user }),
});

const createTodoSlice: StateCreator<UserSlice & TodoSlice, [], [], TodoSlice> = (set) => ({
  todos: [],
  addTodo: (text) => set((state) => ({
    todos: [...state.todos, { id: Date.now(), text, completed: false }],
  })),
});

export const useAppStore = create<UserSlice & TodoSlice>()((...a) => ({
  ...createUserSlice(...a),
  ...createTodoSlice(...a),
}));

// 4. Store 重置功能
interface StoreState {
  data: any[];
  user: User | null;
  reset: () => void;
}

const initialState = {
  data: [],
  user: null,
};

export const useResetableStore = create<StoreState>((set) => ({
  ...initialState,
  reset: () => set(initialState),
}));

// 5. 外部 Store 访问
// 在组件外部访问 store
export const getStoreValue = () => useAppStore.getState();
export const subscribeToStore = (listener) => useAppStore.subscribe(listener);

// 在非 React 环境中使用
async function externalFunction() {
  const { user } = useAppStore.getState();
  if (user) {
    // 执行需要用户登录的操作
    await performUserAction();
  }
}`;

  return (
    <TutorialLayout
      title="Zustand 状态管理教程"
      description="学习使用 Zustand 进行简洁高效的 React 状态管理，掌握现代状态管理的最佳实践"
      prevTutorial={{
        title: '阿里云 OSS',
        href: '/tutorials/oss',
      }}
    >
      <div className="space-y-12">
        {/* 简介 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            为什么选择 Zustand？
          </h2>
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p>
              Zustand 是一个轻量级的 React 状态管理库，提供了简洁的 API 和强大的功能。 相比
              Redux，它有更少的样板代码；相比 Context API，它有更好的性能。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <Settings className="h-8 w-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">简洁 API</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">最少的样板代码，直观易用</p>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <ArrowRight className="h-8 w-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">高性能</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  选择性订阅，避免不必要的重渲染
                </p>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <Plus className="h-8 w-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">灵活扩展</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">丰富的中间件生态系统</p>
              </div>
            </div>
          </div>
        </section>

        {/* 基础用法 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">基础 Store 创建</h2>
          <div className="prose prose-lg max-w-none dark:prose-invert mb-6">
            <p>
              Zustand 的核心是 create 函数，它接受一个函数并返回一个 hook。 这个函数接收 set 和 get
              参数来管理状态。
            </p>
          </div>

          <CodeBlock code={basicStoreCode} language="typescript" filename="基础 Store 示例" />
        </section>

        {/* 简单状态演示 */}
        <DemoSection
          title="简单状态管理演示"
          description="体验 Zustand 管理基本状态，包括计数器和待办事项列表"
          demoComponent={<SimpleStateDemo />}
          codeComponent={
            <CodeBlock
              code={`// 简单的状态管理示例
import { create } from 'zustand';

// 计数器 Store
const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

// 待办事项 Store
const useTodoStore = create((set) => ({
  todos: [],
  addTodo: (text) => set((state) => ({
    todos: [...state.todos, {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date()
    }]
  })),
  toggleTodo: (id) => set((state) => ({
    todos: state.todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  })),
  deleteTodo: (id) => set((state) => ({
    todos: state.todos.filter(todo => todo.id !== id)
  })),
}));`}
              language="typescript"
              filename="简单状态管理"
            />
          }
        />

        {/* 高级 Store */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">高级 Store 设计</h2>
          <div className="prose prose-lg max-w-none dark:prose-invert mb-6">
            <p>
              高级 Store 可以包含复杂的状态结构、计算属性、中间件支持等。
              通过合理的设计，可以构建出功能强大且易于维护的状态管理系统。
            </p>
          </div>

          <CodeBlock code={advancedStoreCode} language="typescript" filename="高级 Store 设计" />
        </section>

        {/* 复杂状态演示 */}
        <DemoSection
          title="复杂状态管理演示"
          description="展示 Zustand 处理复杂应用状态，包括用户、购物车、通知等多个状态模块"
          demoComponent={<ComplexStateDemo />}
          codeComponent={
            <CodeBlock
              code={`// 复杂应用状态管理
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';

interface AppState {
  user: User | null;
  cart: CartItem[];
  notifications: Notification[];
  
  // 用户操作
  setUser: (user: User | null) => void;
  
  // 购物车操作
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  
  // 通知操作
  addNotification: (message: string, type: string) => void;
  removeNotification: (id: number) => void;
  clearNotifications: () => void;
  
  // 计算属性
  cartTotal: number;
  cartItemCount: number;
}

export const useAppStore = create<AppState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        user: null,
        cart: [],
        notifications: [],
        
        setUser: (user) => set({ user }),
        
        addToCart: (item) => set((state) => ({
          cart: [...state.cart, item]
        })),
        
        updateQuantity: (id, quantity) => set((state) => ({
          cart: state.cart.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        })),
        
        removeFromCart: (id) => set((state) => ({
          cart: state.cart.filter(item => item.id !== id)
        })),
        
        clearCart: () => set({ cart: [] }),
        
        addNotification: (message, type) => set((state) => ({
          notifications: [{
            id: Date.now(),
            message,
            type,
            timestamp: new Date()
          }, ...state.notifications]
        })),
        
        removeNotification: (id) => set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        })),
        
        clearNotifications: () => set({ notifications: [] }),
        
        get cartTotal() {
          return get().cart.reduce((sum, item) => 
            sum + (item.price * item.quantity), 0
          );
        },
        
        get cartItemCount() {
          return get().cart.reduce((sum, item) => sum + item.quantity, 0);
        },
      }),
      {
        name: 'app-store',
        partialize: (state) => ({
          user: state.user,
          cart: state.cart,
        }),
      }
    )
  )
);`}
              language="typescript"
              filename="复杂状态管理"
            />
          }
        />

        {/* 中间件 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">中间件使用</h2>
          <div className="prose prose-lg max-w-none dark:prose-invert mb-6">
            <p>
              Zustand 提供了丰富的中间件来扩展功能，包括持久化、订阅、 日志记录、Redux DevTools
              集成等。
            </p>
          </div>

          <CodeBlock code={middlewareCode} language="typescript" filename="中间件使用示例" />
        </section>

        {/* 组件集成 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">在组件中使用</h2>
          <div className="prose prose-lg max-w-none dark:prose-invert mb-6">
            <p>在 React 组件中使用 Zustand Store 非常简单，支持选择性订阅、 异步操作等高级用法。</p>
          </div>

          <CodeBlock code={componentsCode} language="tsx" filename="组件中使用 Zustand" />
        </section>

        {/* 最佳实践 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">最佳实践</h2>
          <div className="prose prose-lg max-w-none dark:prose-invert mb-6">
            <p>遵循最佳实践可以让你的 Zustand 应用更加健壮、可维护和高性能。</p>
          </div>

          <CodeBlock code={bestPracticesCode} language="typescript" filename="Zustand 最佳实践" />
        </section>

        {/* 互动编辑器 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Zustand 练习场</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            尝试创建自己的 Zustand Store，体验状态管理的强大功能：
          </p>

          <CodeEditor
            title="Zustand 状态管理练习"
            defaultCode={`// Zustand 状态管理练习
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';

// 练习 1: 创建一个博客应用的状态管理
interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  published: boolean;
  tags: string[];
  createdAt: Date;
}

interface BlogState {
  posts: Post[];
  filter: 'all' | 'published' | 'draft';
  searchTerm: string;
  
  // 文章操作
  addPost: (post: Omit<Post, 'id' | 'createdAt'>) => void;
  updatePost: (id: number, updates: Partial<Post>) => void;
  deletePost: (id: number) => void;
  togglePublished: (id: number) => void;
  
  // 过滤和搜索
  setFilter: (filter: 'all' | 'published' | 'draft') => void;
  setSearchTerm: (term: string) => void;
  
  // 计算属性
  filteredPosts: Post[];
  stats: {
    total: number;
    published: number;
    drafts: number;
  };
}

export const useBlogStore = create<BlogState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        posts: [
          {
            id: 1,
            title: 'Zustand 入门指南',
            content: '学习如何使用 Zustand 进行状态管理...',
            author: '张三',
            published: true,
            tags: ['React', 'Zustand', '状态管理'],
            createdAt: new Date('2024-01-01'),
          },
          {
            id: 2,
            title: 'Next.js 最佳实践',
            content: '探索 Next.js 的高级特性和优化技巧...',
            author: '李四',
            published: false,
            tags: ['Next.js', 'React', '性能优化'],
            createdAt: new Date('2024-01-02'),
          },
        ],
        filter: 'all',
        searchTerm: '',
        
        addPost: (postData) => set((state) => ({
          posts: [
            ...state.posts,
            {
              ...postData,
              id: Math.max(...state.posts.map(p => p.id), 0) + 1,
              createdAt: new Date(),
            },
          ],
        })),
        
        updatePost: (id, updates) => set((state) => ({
          posts: state.posts.map(post =>
            post.id === id ? { ...post, ...updates } : post
          ),
        })),
        
        deletePost: (id) => set((state) => ({
          posts: state.posts.filter(post => post.id !== id),
        })),
        
        togglePublished: (id) => set((state) => ({
          posts: state.posts.map(post =>
            post.id === id ? { ...post, published: !post.published } : post
          ),
        })),
        
        setFilter: (filter) => set({ filter }),
        setSearchTerm: (searchTerm) => set({ searchTerm }),
        
        get filteredPosts() {
          const { posts, filter, searchTerm } = get();
          
          let filtered = posts;
          
          // 应用状态过滤
          if (filter === 'published') {
            filtered = filtered.filter(post => post.published);
          } else if (filter === 'draft') {
            filtered = filtered.filter(post => !post.published);
          }
          
          // 应用搜索过滤
          if (searchTerm) {
            filtered = filtered.filter(post =>
              post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
              post.tags.some(tag => 
                tag.toLowerCase().includes(searchTerm.toLowerCase())
              )
            );
          }
          
          return filtered.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        },
        
        get stats() {
          const posts = get().posts;
          return {
            total: posts.length,
            published: posts.filter(p => p.published).length,
            drafts: posts.filter(p => !p.published).length,
          };
        },
      }),
      {
        name: 'blog-store',
        partialize: (state) => ({
          posts: state.posts,
          filter: state.filter,
        }),
      }
    )
  )
);

// 练习 2: 使用 Store 的组件示例
function BlogApp() {
  const {
    filteredPosts,
    stats,
    filter,
    searchTerm,
    setFilter,
    setSearchTerm,
    addPost,
    togglePublished,
    deletePost,
  } = useBlogStore();
  
  const handleAddPost = () => {
    addPost({
      title: '新文章标题',
      content: '文章内容...',
      author: '当前用户',
      published: false,
      tags: ['新标签'],
    });
  };
  
  console.log('博客统计:', stats);
  console.log('当前过滤器:', filter);
  console.log('搜索词:', searchTerm);
  console.log('过滤后的文章:', filteredPosts);
  
  return {
    stats,
    filteredPosts,
    actions: {
      addPost: handleAddPost,
      setFilter,
      setSearchTerm,
      togglePublished,
      deletePost,
    },
  };
}

// 运行示例
const blogApp = BlogApp();
console.log('博客应用初始化完成！');
console.log('文章总数:', blogApp.stats.total);
console.log('已发布:', blogApp.stats.published);
console.log('草稿:', blogApp.stats.drafts);

// 添加新文章
blogApp.actions.addPost();
console.log('添加文章后的统计:', useBlogStore.getState().stats);`}
            language="typescript"
            height="700px"
            onRun={code => console.log('执行 Zustand 代码:', code)}
            showConsole={true}
          />
        </section>

        {/* 总结和最佳实践 */}
        <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Zustand vs 其他状态管理
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Zustand</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                <li>• 极简 API，学习成本低</li>
                <li>• 无需 Provider 包装</li>
                <li>• 支持选择性订阅</li>
                <li>• TypeScript 友好</li>
                <li>• 轻量级 (2.9kb)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-2">Redux Toolkit</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                <li>• 强大的生态系统</li>
                <li>• 时间旅行调试</li>
                <li>• 严格的不可变性</li>
                <li>• 复杂的样板代码</li>
                <li>• 较大的包体积</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-600 mb-2">Context API</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                <li>• React 内置</li>
                <li>• 适合简单状态</li>
                <li>• 需要多个 Provider</li>
                <li>• 性能问题</li>
                <li>• 复杂状态难以管理</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 结语 */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            恭喜你完成了所有教程！
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
            通过这个完整的 Next.js 15 教程系列，你已经掌握了现代前端开发的核心技能。 从 Next.js
            基础到 TypeScript、数据库操作、缓存、文件存储和状态管理， 你现在可以构建功能完整的现代
            Web 应用了。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              回到首页
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/tutorials/nextjs-basics"
              className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              重新开始学习
            </Link>
          </div>
        </section>
      </div>
    </TutorialLayout>
  );
}
