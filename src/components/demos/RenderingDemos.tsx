'use client';

import { useState } from 'react';
import { Server, Globe, Monitor, Zap } from 'lucide-react';

// 渲染模式对比演示
export function RenderingModesDemo() {
  const [selectedMode, setSelectedMode] = useState('ssr');
  const [simulationStep, setSimulationStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  
  const renderingModes = [
    {
      id: 'ssr',
      name: 'SSR (服务端渲染)',
      icon: <Server className="h-5 w-5" />,
      description: '每次请求时在服务器渲染页面',
      pros: ['SEO 友好', '首屏加载快', '实时数据'],
      cons: ['服务器负载高', 'TTFB 较慢', '缓存困难'],
      useCase: '动态内容、用户个性化页面'
    },
    {
      id: 'ssg',
      name: 'SSG (静态生成)',
      icon: <Globe className="h-5 w-5" />,
      description: '构建时预生成静态页面',
      pros: ['性能最佳', 'CDN 友好', '安全性高'],
      cons: ['数据可能过时', '构建时间长', '动态性差'],
      useCase: '博客文章、文档、营销页面'
    },
    {
      id: 'isr',
      name: 'ISR (增量静态再生)',
      icon: <Zap className="h-5 w-5" />,
      description: '静态生成 + 按需更新',
      pros: ['性能好', '数据新鲜', '可扩展'],
      cons: ['复杂性高', '缓存策略复杂'],
      useCase: '电商产品页、新闻网站'
    },
    {
      id: 'csr',
      name: 'CSR (客户端渲染)',
      icon: <Monitor className="h-5 w-5" />,
      description: '在浏览器中渲染页面',
      pros: ['交互性强', '服务器负载低', '开发简单'],
      cons: ['SEO 困难', '首屏加载慢', '依赖 JavaScript'],
      useCase: '管理后台、SPA 应用'
    }
  ];
  
  const simulationSteps = {
    ssr: [
      { step: 1, title: '用户请求页面', desc: '浏览器向服务器发送请求', time: '0ms' },
      { step: 2, title: '服务器获取数据', desc: '从数据库或 API 获取最新数据', time: '50ms' },
      { step: 3, title: '服务器渲染 HTML', desc: '在服务器上执行 React 组件', time: '100ms' },
      { step: 4, title: '返回完整 HTML', desc: '发送渲染好的 HTML 到浏览器', time: '150ms' },
      { step: 5, title: '客户端激活', desc: '下载 JavaScript 并激活交互', time: '300ms' }
    ],
    ssg: [
      { step: 1, title: '构建时预渲染', desc: '在构建阶段生成静态 HTML', time: '构建时' },
      { step: 2, title: '用户请求页面', desc: '浏览器请求预生成的页面', time: '0ms' },
      { step: 3, title: 'CDN 返回静态文件', desc: '从 CDN 快速返回 HTML', time: '20ms' },
      { step: 4, title: '客户端激活', desc: '下载 JavaScript 并激活交互', time: '100ms' }
    ],
    isr: [
      { step: 1, title: '首次构建', desc: '生成初始静态页面', time: '构建时' },
      { step: 2, title: '用户请求', desc: '返回缓存的静态页面', time: '20ms' },
      { step: 3, title: '后台重新生成', desc: '检查是否需要更新页面', time: '后台' },
      { step: 4, title: '增量更新', desc: '更新过期的页面内容', time: '按需' }
    ],
    csr: [
      { step: 1, title: '返回空 HTML', desc: '服务器返回基础 HTML 壳', time: '20ms' },
      { step: 2, title: '下载 JavaScript', desc: '浏览器下载应用 bundle', time: '200ms' },
      { step: 3, title: '客户端获取数据', desc: '通过 API 获取页面数据', time: '300ms' },
      { step: 4, title: '渲染页面内容', desc: '在浏览器中渲染组件', time: '350ms' }
    ]
  };
  
  const startSimulation = () => {
    setIsSimulating(true);
    setSimulationStep(0);
    
    const steps = simulationSteps[selectedMode as keyof typeof simulationSteps];
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      setSimulationStep(currentStep);
      
      if (currentStep >= steps.length) {
        clearInterval(timer);
        setIsSimulating(false);
      }
    }, 800);
  };
  
  const currentMode = renderingModes.find(mode => mode.id === selectedMode)!;
  const currentSteps = simulationSteps[selectedMode as keyof typeof simulationSteps];
  
  return (
    <div className="space-y-6">
      {/* 渲染模式选择 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderingModes.map(mode => (
          <button
            key={mode.id}
            onClick={() => setSelectedMode(mode.id)}
            className={`p-4 text-left border rounded-lg transition-colors ${
              selectedMode === mode.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-center space-x-2 mb-2">
              <div className="text-blue-600">{mode.icon}</div>
              <div className="font-medium text-sm">{mode.name}</div>
            </div>
            <div className="text-xs text-gray-500">{mode.description}</div>
          </button>
        ))}
      </div>
      
      {/* 当前模式详情 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <div className="text-blue-600">{currentMode.icon}</div>
              <h3 className="font-semibold">{currentMode.name}</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {currentMode.description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-green-600 mb-2">优势</h4>
                <ul className="space-y-1">
                  {currentMode.pros.map((pro, index) => (
                    <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-center space-x-1">
                      <span className="text-green-500">✓</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-orange-600 mb-2">劣势</h4>
                <ul className="space-y-1">
                  {currentMode.cons.map((con, index) => (
                    <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-center space-x-1">
                      <span className="text-orange-500">⚠</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
              <div className="text-sm">
                <strong>适用场景：</strong>{currentMode.useCase}
              </div>
            </div>
          </div>
          
          <button
            onClick={startSimulation}
            disabled={isSimulating}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSimulating ? '模拟中...' : '开始渲染流程模拟'}
          </button>
        </div>
        
        {/* 渲染流程可视化 */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="font-semibold mb-4">渲染流程</h4>
          <div className="space-y-3">
            {currentSteps.map((step, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 p-3 rounded-lg transition-all ${
                  simulationStep >= step.step
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  simulationStep >= step.step
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-400 text-white'
                }`}>
                  {step.step}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{step.title}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{step.desc}</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-mono">{step.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// API 调用机制演示
export function APICallDemo() {
  const [selectedPattern, setSelectedPattern] = useState('rest');
  const [requestData] = useState({
    method: 'GET',
    endpoint: '/api/users',
    body: '',
    headers: '{"Content-Type": "application/json"}'
  });
  // 使用变量避免 lint 错误
  void requestData;
  const [response, setResponse] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  
  const apiPatterns = [
    {
      id: 'rest',
      name: 'REST API',
      description: '传统的 RESTful API 调用模式'
    },
    {
      id: 'graphql',
      name: 'GraphQL',
      description: '灵活的查询语言和运行时'
    },
    {
      id: 'trpc',
      name: 'tRPC',
      description: '类型安全的 RPC 框架'
    },
    {
      id: 'swr',
      name: 'SWR',
      description: '数据获取库，支持缓存和重新验证'
    }
  ];
  
  const codeExamples = {
    rest: {
      server: `// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const users = await prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });
    
    const total = await prisma.user.count();
    
    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email
      }
    });
    
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 400 }
    );
  }
}`,
      client: `// 客户端调用
async function fetchUsers(page = 1, limit = 10) {
  const response = await fetch(\`/api/users?page=\${page}&limit=\${limit}\`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  
  return response.json();
}

async function createUser(userData) {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData)
  });
  
  if (!response.ok) {
    throw new Error('Failed to create user');
  }
  
  return response.json();
}

// React 组件中使用
function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUsers()
      .then(data => {
        setUsers(data.users);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);
  
  const handleCreateUser = async (userData) => {
    try {
      const newUser = await createUser(userData);
      setUsers(prev => [...prev, newUser]);
    } catch (error) {
      console.error('Create error:', error);
    }
  };
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}`
    },
    graphql: {
      server: `// app/api/graphql/route.ts
import { createYoga } from 'graphql-yoga';
import { buildSchema } from 'graphql';
import { prisma } from '@/lib/prisma';

const typeDefs = \`
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
    createdAt: String!
  }
  
  type Post {
    id: ID!
    title: String!
    content: String
    published: Boolean!
    author: User!
  }
  
  type Query {
    users(limit: Int, offset: Int): [User!]!
    user(id: ID!): User
    posts(published: Boolean): [Post!]!
  }
  
  type Mutation {
    createUser(name: String!, email: String!): User!
    updateUser(id: ID!, name: String, email: String): User!
    deleteUser(id: ID!): Boolean!
  }
\`;

const resolvers = {
  Query: {
    users: async (_, { limit = 10, offset = 0 }) => {
      return prisma.user.findMany({
        take: limit,
        skip: offset,
        include: { posts: true }
      });
    },
    user: async (_, { id }) => {
      return prisma.user.findUnique({
        where: { id },
        include: { posts: true }
      });
    },
    posts: async (_, { published }) => {
      return prisma.post.findMany({
        where: published !== undefined ? { published } : {},
        include: { author: true }
      });
    }
  },
  
  Mutation: {
    createUser: async (_, { name, email }) => {
      return prisma.user.create({
        data: { name, email },
        include: { posts: true }
      });
    },
    updateUser: async (_, { id, name, email }) => {
      return prisma.user.update({
        where: { id },
        data: { ...(name && { name }), ...(email && { email }) },
        include: { posts: true }
      });
    },
    deleteUser: async (_, { id }) => {
      await prisma.user.delete({ where: { id } });
      return true;
    }
  }
};

const schema = buildSchema(typeDefs);

const yoga = createYoga({
  schema,
  resolvers,
  graphqlEndpoint: '/api/graphql'
});

export { yoga as GET, yoga as POST };`,
      client: `// 客户端 GraphQL 调用
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

const GET_USERS = gql\`
  query GetUsers($limit: Int, $offset: Int) {
    users(limit: $limit, offset: $offset) {
      id
      name
      email
      posts {
        id
        title
        published
      }
      createdAt
    }
  }
\`;

const CREATE_USER = gql\`
  mutation CreateUser($name: String!, $email: String!) {
    createUser(name: $name, email: $email) {
      id
      name
      email
    }
  }
\`;

function UsersComponent() {
  const { data, loading, error, refetch } = useQuery(GET_USERS, {
    variables: { limit: 10, offset: 0 }
  });
  
  const [createUser] = useMutation(CREATE_USER, {
    onCompleted: () => {
      refetch(); // 重新获取数据
    }
  });
  
  const handleCreateUser = async (userData) => {
    try {
      await createUser({
        variables: userData
      });
    } catch (error) {
      console.error('Create error:', error);
    }
  };
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {data.users.map(user => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <small>Posts: {user.posts.length}</small>
        </div>
      ))}
    </div>
  );
}`
    },
    trpc: {
      server: `// lib/trpc.ts
import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const t = initTRPC.create();

export const appRouter = t.router({
  users: t.router({
    list: t.procedure
      .input(z.object({
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().min(0).default(0)
      }))
      .query(async ({ input }) => {
        const users = await prisma.user.findMany({
          take: input.limit,
          skip: input.offset,
          include: { posts: true }
        });
        
        const total = await prisma.user.count();
        
        return {
          users,
          total,
          hasMore: input.offset + input.limit < total
        };
      }),
      
    create: t.procedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email()
      }))
      .mutation(async ({ input }) => {
        return prisma.user.create({
          data: input,
          include: { posts: true }
        });
      }),
      
    byId: t.procedure
      .input(z.string())
      .query(async ({ input }) => {
        return prisma.user.findUnique({
          where: { id: input },
          include: { posts: true }
        });
      })
  })
});

export type AppRouter = typeof appRouter;

// app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/lib/trpc';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => ({})
  });

export { handler as GET, handler as POST };`,
      client: `// 客户端 tRPC 调用
import { createTRPCNext } from '@trpc/next';
import type { AppRouter } from '@/lib/trpc';

const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      links: [
        httpBatchLink({
          url: '/api/trpc',
        }),
      ],
    };
  },
});

function UsersPage() {
  const { data, isLoading, error } = trpc.users.list.useQuery({
    limit: 10,
    offset: 0
  });
  
  const createUserMutation = trpc.users.create.useMutation({
    onSuccess: () => {
      // 自动重新获取数据
      trpc.users.list.invalidate();
    }
  });
  
  const handleCreateUser = async (userData) => {
    try {
      await createUserMutation.mutateAsync(userData);
    } catch (error) {
      console.error('Create error:', error);
    }
  };
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {data?.users.map(user => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <small>Posts: {user.posts.length}</small>
        </div>
      ))}
      
      {data?.hasMore && (
        <button onClick={() => {/* 加载更多 */}}>
          Load More
        </button>
      )}
    </div>
  );
}

export default trpc.withTRPC(UsersPage);`
    },
    swr: {
      server: `// SWR 使用相同的 REST API
// app/api/users/route.ts (与 REST 示例相同)
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  // ... REST API 实现 (同上)
}`,
      client: `// 客户端 SWR 调用
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

// 数据获取函数
const fetcher = (url: string) => fetch(url).then(res => res.json());

// 创建用户的 mutation 函数
async function createUser(url: string, { arg }: { arg: Record<string, unknown> }) {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg)
  }).then(res => res.json());
}

function UsersPage() {
  const { data, error, isLoading, mutate } = useSWR('/api/users', fetcher, {
    refreshInterval: 30000, // 30秒自动刷新
    revalidateOnFocus: true, // 窗口获得焦点时重新验证
    revalidateOnReconnect: true, // 网络重连时重新验证
  });
  
  const { trigger, isMutating } = useSWRMutation('/api/users', createUser);
  
  const handleCreateUser = async (userData: Record<string, unknown>) => {
    try {
      const newUser = await trigger(userData);
      
      // 乐观更新：立即更新本地数据
      mutate((currentData: Record<string, unknown>) => ({
        ...currentData,
        users: [...(currentData?.users || []), newUser]
      }), false);
      
      // 重新验证服务器数据
      mutate();
    } catch (error) {
      console.error('Create error:', error);
    }
  };
  
  if (error) return <div>Failed to load users</div>;
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>Users ({data?.pagination?.total || 0})</h1>
      
      {data?.users?.map((user: Record<string, unknown>) => (
        <div key={user.id} className="user-card">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <small>Created: {new Date(user.createdAt).toLocaleDateString()}</small>
        </div>
      ))}
      
      <button 
        onClick={() => handleCreateUser({ name: 'New User', email: 'new@example.com' })}
        disabled={isMutating}
      >
        {isMutating ? 'Creating...' : 'Create User'}
      </button>
      
      <button onClick={() => mutate()}>
        Refresh Data
      </button>
    </div>
  );
}

// 全局 SWR 配置
import { SWRConfig } from 'swr';

function MyApp({ Component, pageProps }: { Component: React.ComponentType; pageProps: Record<string, unknown> }) {
  return (
    <SWRConfig 
      value={{
        fetcher: (url: string) => fetch(url).then(res => res.json()),
        onError: (error) => {
          console.error('SWR Error:', error);
        },
        onSuccess: (data, key) => {
          console.log('SWR Success:', key, data);
        }
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  );
}`
    }
  };
  
  const simulateAPICall = async () => {
    setLoading(true);
    setResponse(null);
    
    // 模拟 API 延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 模拟响应数据
    const mockResponses = {
      rest: {
        users: [
          { id: 1, name: '张三', email: 'zhangsan@example.com', createdAt: '2024-01-15T10:30:00Z' },
          { id: 2, name: '李四', email: 'lisi@example.com', createdAt: '2024-01-14T15:20:00Z' }
        ],
        pagination: { page: 1, limit: 10, total: 2, pages: 1 }
      },
      graphql: {
        data: {
          users: [
            { 
              id: '1', 
              name: '张三', 
              email: 'zhangsan@example.com',
              posts: [{ id: '1', title: 'GraphQL 入门', published: true }],
              createdAt: '2024-01-15T10:30:00Z'
            }
          ]
        }
      },
      trpc: {
        users: [
          { id: '1', name: '张三', email: 'zhangsan@example.com', posts: [] }
        ],
        total: 1,
        hasMore: false
      },
      swr: {
        users: [
          { id: 1, name: '张三', email: 'zhangsan@example.com', createdAt: '2024-01-15T10:30:00Z' }
        ],
        pagination: { page: 1, limit: 10, total: 1, pages: 1 }
      }
    };
    
    setResponse(mockResponses[selectedPattern as keyof typeof mockResponses]);
    setLoading(false);
  };
  
  const currentPattern = apiPatterns.find(p => p.id === selectedPattern)!;
  const currentCode = codeExamples[selectedPattern as keyof typeof codeExamples];
  
  return (
    <div className="space-y-6">
      {/* API 模式选择 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {apiPatterns.map(pattern => (
          <button
            key={pattern.id}
            onClick={() => setSelectedPattern(pattern.id)}
            className={`p-3 text-left border rounded-lg transition-colors ${
              selectedPattern === pattern.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="font-medium text-sm">{pattern.name}</div>
            <div className="text-xs text-gray-500 mt-1">{pattern.description}</div>
          </button>
        ))}
      </div>
      
      {/* API 调用界面 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-semibold mb-3">{currentPattern.name} 演示</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {currentPattern.description}
            </p>
            
            <button
              onClick={simulateAPICall}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '请求中...' : `模拟 ${currentPattern.name} 调用`}
            </button>
          </div>
          
          {/* 响应结果 */}
          {response && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h5 className="font-semibold mb-2">响应结果:</h5>
              <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-sm overflow-x-auto">
                <pre>{JSON.stringify(response, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
        
        {/* 代码示例 */}
        <div className="space-y-4">
          <div>
            <h5 className="font-semibold mb-2">服务器端代码:</h5>
            <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs overflow-x-auto max-h-64 overflow-y-auto">
              <pre>{currentCode.server}</pre>
            </div>
          </div>
          
          <div>
            <h5 className="font-semibold mb-2">客户端代码:</h5>
            <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs overflow-x-auto max-h-64 overflow-y-auto">
              <pre>{currentCode.client}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

