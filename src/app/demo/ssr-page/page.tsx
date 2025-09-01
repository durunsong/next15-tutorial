import { Clock, Database, Users } from 'lucide-react';

import { Suspense } from 'react';

// 模拟数据获取
async function getServerData() {
  // 模拟服务器端数据获取延迟
  await new Promise(resolve => setTimeout(resolve, 100));

  return {
    users: [
      { id: 1, name: '张三', role: '开发者', lastActive: '2024-01-15T10:30:00Z' },
      { id: 2, name: '李四', role: '设计师', lastActive: '2024-01-15T09:15:00Z' },
      { id: 3, name: '王五', role: '产品经理', lastActive: '2024-01-15T11:45:00Z' },
    ],
    stats: {
      totalUsers: 150,
      activeToday: 45,
      newThisWeek: 12,
    },
    serverTime: new Date().toISOString(),
  };
}

async function UsersList() {
  const data = await getServerData();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">总用户</h3>
          </div>
          <p className="text-2xl font-bold text-blue-600">{data.stats.totalUsers}</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-green-900">今日活跃</h3>
          </div>
          <p className="text-2xl font-bold text-green-600">{data.stats.activeToday}</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-purple-900">本周新增</h3>
          </div>
          <p className="text-2xl font-bold text-purple-600">{data.stats.newThisWeek}</p>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">用户列表</h3>
        <div className="space-y-3">
          {data.users.map(user => (
            <div key={user.id} className="flex items-center justify-between p-3 border rounded">
              <div>
                <h4 className="font-medium">{user.name}</h4>
                <p className="text-sm text-gray-500">{user.role}</p>
              </div>
              <div className="text-sm text-gray-400">
                最后活跃: {new Date(user.lastActive).toLocaleString('zh-CN')}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center text-sm text-gray-500">
        服务器时间: {new Date(data.serverTime).toLocaleString('zh-CN')}
      </div>
    </div>
  );
}

export default function SSRPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SSR 演示页面</h1>
          <p className="text-gray-600">这个页面使用服务端渲染 (SSR)，数据在服务器端获取并渲染</p>
          <div className="mt-4 inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            <Database className="h-4 w-4 mr-1" />
            服务端渲染模式
          </div>
        </div>

        <Suspense
          fallback={
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto" />
              <p className="mt-2 text-gray-500">加载数据中...</p>
            </div>
          }
        >
          <UsersList />
        </Suspense>
      </div>
    </div>
  );
}

// 强制每次请求都重新生成页面
export const dynamic = 'force-dynamic';
