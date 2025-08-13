'use client';

import { useState, useEffect } from 'react';
import { Monitor, Users, Activity, Loader } from 'lucide-react';

interface UserData {
  id: number;
  name: string;
  email: string;
  status: 'online' | 'offline' | 'away';
  activity: string;
  joinDate: string;
}

interface DashboardData {
  users: UserData[];
  metrics: {
    activeUsers: number;
    totalSessions: number;
    avgSessionTime: string;
    bounceRate: number;
  };
}

export default function CSRPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // 模拟 API 调用
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 模拟随机数据
      const mockData: DashboardData = {
        users: [
          {
            id: 1,
            name: '张三',
            email: 'zhangsan@example.com',
            status: Math.random() > 0.7 ? 'online' : Math.random() > 0.5 ? 'away' : 'offline',
            activity: '正在编辑文档',
            joinDate: '2024-01-10'
          },
          {
            id: 2,
            name: '李四',
            email: 'lisi@example.com',
            status: Math.random() > 0.7 ? 'online' : Math.random() > 0.5 ? 'away' : 'offline',
            activity: '查看数据报表',
            joinDate: '2024-01-08'
          },
          {
            id: 3,
            name: '王五',
            email: 'wangwu@example.com',
            status: Math.random() > 0.7 ? 'online' : Math.random() > 0.5 ? 'away' : 'offline',
            activity: '参与视频会议',
            joinDate: '2024-01-12'
          }
        ],
        metrics: {
          activeUsers: Math.floor(Math.random() * 50) + 20,
          totalSessions: Math.floor(Math.random() * 1000) + 500,
          avgSessionTime: `${Math.floor(Math.random() * 10) + 5}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
          bounceRate: Math.round((Math.random() * 20 + 30) * 10) / 10
        }
      };
      
      setData(mockData);
    } catch (err) {
      setError('数据加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'away': return 'text-yellow-600 bg-yellow-100';
      case 'offline': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return '在线';
      case 'away': return '离开';
      case 'offline': return '离线';
      default: return '未知';
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              CSR 演示页面
            </h1>
            <p className="text-gray-600">
              这个页面使用客户端渲染 (CSR)，数据在浏览器中异步加载
            </p>
            <div className="mt-4 inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
              <Monitor className="h-4 w-4 mr-1" />
              客户端渲染模式
            </div>
          </div>
          
          <div className="text-center py-12">
            <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
            <p className="mt-4 text-gray-500">正在加载数据...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="text-red-600 text-xl mb-4">❌</div>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => setRefreshKey(prev => prev + 1)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              重试
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            CSR 演示页面
          </h1>
          <p className="text-gray-600">
            这个页面使用客户端渲染 (CSR)，数据在浏览器中异步加载
          </p>
          <div className="mt-4 inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
            <Monitor className="h-4 w-4 mr-1" />
            客户端渲染模式
          </div>
        </div>
        
        <div className="space-y-6">
          {/* 刷新按钮 */}
          <div className="text-center">
            <button
              onClick={() => setRefreshKey(prev => prev + 1)}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 inline-flex items-center space-x-2"
            >
              {loading && <Loader className="h-4 w-4 animate-spin" />}
              <span>{loading ? '刷新中...' : '刷新数据'}</span>
            </button>
          </div>
          
          {/* 实时指标 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">活跃用户</h3>
              </div>
              <p className="text-2xl font-bold text-blue-600 mt-2">{data?.metrics.activeUsers}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">总会话</h3>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-2">{data?.metrics.totalSessions.toLocaleString()}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center space-x-2">
                <Monitor className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">平均时长</h3>
              </div>
              <p className="text-2xl font-bold text-purple-600 mt-2">{data?.metrics.avgSessionTime}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-orange-600" />
                <h3 className="font-semibold text-gray-900">跳出率</h3>
              </div>
              <p className="text-2xl font-bold text-orange-600 mt-2">{data?.metrics.bounceRate}%</p>
            </div>
          </div>
          
          {/* 用户列表 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">实时用户状态</h2>
            <div className="space-y-4">
              {data?.users.map(user => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-gray-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-sm text-gray-600">{user.activity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {getStatusText(user.status)}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      加入: {new Date(user.joinDate).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            数据刷新时间: {new Date().toLocaleString('zh-CN')}
          </div>
        </div>
      </div>
    </div>
  );
}

