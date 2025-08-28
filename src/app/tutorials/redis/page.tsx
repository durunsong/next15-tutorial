'use client';

import { ArrowRight, Clock, Database, Plus, RefreshCw, Trash2, Zap } from 'lucide-react';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { CodeBlock } from '@/components/CodeBlock';
import { CodeEditor } from '@/components/CodeEditor';
import { DemoSection } from '@/components/DemoSection';
import { TutorialLayout } from '@/components/TutorialLayout';
import RedisTestComponent from '@/components/demos/RedisTestComponent';

// 模拟 Redis 缓存演示组件
function RedisDemo() {
  const [cache, setCache] = useState<Record<string, { value: unknown; expiry?: number }>>({
    'user:1': { value: { id: 1, name: '张三', email: 'zhangsan@example.com' } },
    'posts:latest': {
      value: [
        { id: 1, title: 'Next.js 15 新特性' },
        { id: 2, title: 'Redis 缓存最佳实践' },
      ],
    },
    'stats:views': { value: 1250 },
  });

  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const addToCache = () => {
    if (newKey && newValue) {
      try {
        const parsedValue = JSON.parse(newValue);
        setCache(prev => ({
          ...prev,
          [newKey]: { value: parsedValue, expiry: Date.now() + 300000 }, // 5分钟过期
        }));
        setNewKey('');
        setNewValue('');
      } catch {
        setCache(prev => ({
          ...prev,
          [newKey]: { value: newValue, expiry: Date.now() + 300000 },
        }));
        setNewKey('');
        setNewValue('');
      }
    }
  };

  const deleteFromCache = (key: string) => {
    setCache(prev => {
      const newCache = { ...prev };
      delete newCache[key];
      return newCache;
    });
    if (selectedKey === key) setSelectedKey(null);
  };

  const clearCache = () => {
    setCache({});
    setSelectedKey(null);
  };

  const refreshData = () => {
    setCache(prev => ({
      ...prev,
      'stats:views': { value: Math.floor(Math.random() * 5000) + 1000 },
      timestamp: { value: new Date().toISOString() },
    }));
  };

  // 检查过期
  useEffect(() => {
    const interval = setInterval(() => {
      setCache(prev => {
        const now = Date.now();
        const filtered = Object.entries(prev).reduce(
          (acc, [key, data]) => {
            if (!data.expiry || data.expiry > now) {
              acc[key] = data;
            }
            return acc;
          },
          {} as typeof prev
        );
        return filtered;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatValue = (value: unknown) => {
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const getExpiryStatus = (expiry?: number) => {
    if (!expiry) return '永不过期';
    const remaining = expiry - Date.now();
    if (remaining <= 0) return '已过期';
    return `${Math.ceil(remaining / 1000)}秒后过期`;
  };

  return (
    <div className="space-y-6">
      {/* 缓存操作面板 */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <Plus className="h-4 w-4 mr-2 text-green-600" />
          缓存操作
        </h4>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="缓存键 (如: user:123)"
              value={newKey}
              onChange={e => setNewKey(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
            <input
              type="text"
              placeholder="缓存值 (支持JSON)"
              value={newValue}
              onChange={e => setNewValue(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
            <button
              onClick={addToCache}
              className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
            >
              添加
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={refreshData}
              className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              刷新数据
            </button>
            <button
              onClick={clearCache}
              className="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              清空缓存
            </button>
          </div>
        </div>
      </div>

      {/* 缓存列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <Database className="h-4 w-4 mr-2 text-blue-600" />
              缓存键列表 ({Object.keys(cache).length})
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {Object.entries(cache).map(([key, data]) => (
                <div
                  key={key}
                  className={`p-2 border rounded cursor-pointer transition-colors ${
                    selectedKey === key
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedKey(key)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-gray-900 dark:text-white truncate">
                      {key}
                    </span>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        deleteFromCache(key);
                      }}
                      className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {getExpiryStatus(data.expiry)}
                  </div>
                </div>
              ))}
              {Object.keys(cache).length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-4">缓存为空</div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedKey ? (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                缓存详情: <span className="font-mono text-blue-600">{selectedKey}</span>
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    过期时间:
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {getExpiryStatus(cache[selectedKey]?.expiry)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    缓存值:
                  </label>
                  <pre className="mt-2 p-3 bg-gray-900 text-green-400 rounded text-sm overflow-x-auto">
                    {formatValue(cache[selectedKey]?.value)}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <Database className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">选择一个缓存键查看详情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 缓存策略演示
interface CacheStrategyData {
  strategy: string;
  description: string;
  data: Record<string, unknown>;
}

function CacheStrategyDemo() {
  const [strategy, setStrategy] = useState<
    'cache-first' | 'cache-aside' | 'write-through' | 'write-behind'
  >('cache-first');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<CacheStrategyData | null>(null);
  const [cacheHit, setCacheHit] = useState<boolean | null>(null);
  const [responseTime, setResponseTime] = useState<number>(0);

  const executeStrategy = async () => {
    setIsLoading(true);
    setCacheHit(null);
    const startTime = Date.now();

    // 模拟不同策略的行为
    await new Promise(resolve => setTimeout(resolve, strategy === 'cache-first' ? 100 : 800));

    const hit = Math.random() > 0.5;
    setCacheHit(hit);
    setResponseTime(Date.now() - startTime);

    const mockData = {
      'cache-first': {
        strategy: 'Cache First',
        description: '优先从缓存读取，缓存未命中时从数据库读取',
        data: { id: 1, name: '用户数据', source: hit ? 'cache' : 'database' },
      },
      'cache-aside': {
        strategy: 'Cache Aside',
        description: '应用程序管理缓存，缓存未命中时读取数据库并更新缓存',
        data: { id: 2, name: '文章列表', source: hit ? 'cache' : 'database' },
      },
      'write-through': {
        strategy: 'Write Through',
        description: '写入时同时更新缓存和数据库',
        data: { id: 3, name: '用户配置', source: 'database', cached: true },
      },
      'write-behind': {
        strategy: 'Write Behind',
        description: '写入缓存后异步更新数据库',
        data: { id: 4, name: '访问日志', source: 'cache', pending_db_write: true },
      },
    };

    setData(mockData[strategy]);
    setIsLoading(false);
  };

  const strategies = [
    { key: 'cache-first', name: 'Cache First', color: 'blue' },
    { key: 'cache-aside', name: 'Cache Aside', color: 'green' },
    { key: 'write-through', name: 'Write Through', color: 'purple' },
    { key: 'write-behind', name: 'Write Behind', color: 'yellow' },
  ];

  return (
    <div className="space-y-6">
      {/* 策略选择 */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">选择缓存策略</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {strategies.map(s => (
            <button
              key={s.key}
              onClick={() => setStrategy(s.key as typeof strategy)}
              className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                strategy === s.key
                  ? `bg-${s.color}-600 text-white`
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* 执行结果 */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900 dark:text-white">策略执行结果</h4>
          <button
            onClick={executeStrategy}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                执行中...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                执行策略
              </>
            )}
          </button>
        </div>

        {data && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">策略</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {data?.strategy || strategy}
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">响应时间</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {responseTime}ms
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">缓存状态</div>
                <div
                  className={`text-lg font-semibold ${
                    cacheHit ? 'text-green-600' : 'text-orange-600'
                  }`}
                >
                  {cacheHit ? '命中' : '未命中'}
                </div>
              </div>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                策略说明
              </div>
              <p className="text-gray-600 dark:text-gray-300">{data?.description || ''}</p>
            </div>

            <div className="p-3 bg-gray-900 rounded">
              <div className="text-sm font-medium text-gray-300 mb-2">返回数据</div>
              <pre className="text-green-400 text-sm">
                {JSON.stringify(data?.data || {}, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RedisTutorial() {
  const setupCode = `// lib/redis.ts
import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// 类型安全的缓存工具函数
export class CacheManager {
  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      return data as T;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  static async set<T>(
    key: string,
    value: T,
    options?: { ex?: number; px?: number }
  ): Promise<boolean> {
    try {
      await redis.set(key, value, options);
      return true;
    } catch (error) {
      console.error('Redis set error:', error);
      return false;
    }
  }

  static async del(key: string): Promise<boolean> {
    try {
      await redis.del(key);
      return true;
    } catch (error) {
      console.error('Redis del error:', error);
      return false;
    }
  }

  static async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis exists error:', error);
      return false;
    }
  }
}`;

  const basicOperationsCode = `// 基本的 Redis 操作
import { redis } from '@/lib/redis';

// 字符串操作
await redis.set('user:1:name', '张三');
const userName = await redis.get('user:1:name');

// 带过期时间的缓存 (60秒)
await redis.set('session:abc123', { userId: 1, role: 'admin' }, { ex: 60 });

// 数字操作
await redis.set('page:views', 0);
await redis.incr('page:views'); // 增加1
await redis.incrby('page:views', 10); // 增加10

// 哈希操作
await redis.hset('user:1', {
  name: '张三',
  email: 'zhangsan@example.com',
  lastLogin: new Date().toISOString()
});

const user = await redis.hgetall('user:1');
const userEmail = await redis.hget('user:1', 'email');

// 列表操作
await redis.lpush('notifications', '新消息1');
await redis.lpush('notifications', '新消息2');
const notifications = await redis.lrange('notifications', 0, -1);

// 集合操作
await redis.sadd('user:1:tags', 'developer', 'typescript', 'react');
const userTags = await redis.smembers('user:1:tags');

// 有序集合操作
await redis.zadd('leaderboard', { score: 100, member: 'user:1' });
await redis.zadd('leaderboard', { score: 200, member: 'user:2' });
const topUsers = await redis.zrange('leaderboard', 0, 2, { withScores: true });`;

  const cacheStrategiesCode = `// 缓存策略实现

// 1. Cache-First 策略
export async function getCachedUser(id: number) {
  const cacheKey = \`user:\${id}\`;

  // 先尝试从缓存获取
  const cached = await redis.get(cacheKey);
  if (cached) {
    return { data: cached, source: 'cache' };
  }

  // 缓存未命中，从数据库获取
  const user = await prisma.user.findUnique({ where: { id } });

  if (user) {
    // 缓存数据，5分钟过期
    await redis.set(cacheKey, user, { ex: 300 });
  }

  return { data: user, source: 'database' };
}

// 2. Cache-Aside 策略
export async function updateUser(id: number, data: Partial<User>) {
  // 更新数据库
  const updatedUser = await prisma.user.update({
    where: { id },
    data
  });

  // 删除缓存，下次读取时重新缓存
  await redis.del(\`user:\${id}\`);

  return updatedUser;
}

// 3. Write-Through 策略
export async function createUserWithCache(userData: CreateUserInput) {
  // 同时写入数据库和缓存
  const user = await prisma.user.create({ data: userData });
  await redis.set(\`user:\${user.id}\`, user, { ex: 300 });

  return user;
}

// 4. 缓存预热
export async function warmupCache() {
  const popularPosts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { views: 'desc' },
    take: 10,
    include: { author: true }
  });

  // 批量缓存热门文章
  const pipeline = redis.pipeline();
  popularPosts.forEach(post => {
    pipeline.set(\`post:\${post.id}\`, post, { ex: 3600 });
  });
  await pipeline.exec();
}`;

  const apiIntegrationCode = `// API 路由中的缓存使用

// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  const cacheKey = \`posts:page:\${page}:limit:\${limit}\`;

  try {
    // 尝试从缓存获取
    const cached = await redis.get(cacheKey);
    if (cached) {
      return NextResponse.json({
        data: cached,
        source: 'cache'
      });
    }

    // 从数据库获取
    const posts = await prisma.post.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: { author: true },
      orderBy: { createdAt: 'desc' }
    });

    // 缓存结果，5分钟过期
    await redis.set(cacheKey, posts, { ex: 300 });

    return NextResponse.json({
      data: posts,
      source: 'database'
    });
  } catch (error) {
    return NextResponse.json(
      { error: '获取文章失败' },
      { status: 500 }
    );
  }
}

// app/api/stats/route.ts
export async function GET() {
  const cacheKey = 'site:stats';

  // 使用 Redis 作为计数器
  const [totalViews, totalUsers] = await Promise.all([
    redis.get('stats:total_views') || 0,
    redis.get('stats:total_users') || 0,
  ]);

  // 实时统计也可以缓存短时间
  const cachedStats = await redis.get(cacheKey);
  if (cachedStats) {
    return NextResponse.json(cachedStats);
  }

  const stats = {
    totalViews,
    totalUsers,
    timestamp: new Date().toISOString()
  };

  // 缓存1分钟
  await redis.set(cacheKey, stats, { ex: 60 });

  return NextResponse.json(stats);
}`;

  const performanceCode = `// 性能优化技巧

// 1. 批量操作使用 Pipeline
export async function batchUpdateCache(updates: Array<{key: string, value: unknown}>) {
  const pipeline = redis.pipeline();

  updates.forEach(({ key, value }) => {
    pipeline.set(key, value, { ex: 300 });
  });

  // 一次性执行所有命令
  await pipeline.exec();
}

// 2. 缓存穿透保护
export async function getCachedDataWithNullProtection<T>(
  key: string,
  fetchData: () => Promise<T | null>
): Promise<T | null> {
  // 检查缓存
  const cached = await redis.get(key);
  if (cached !== null) {
    return cached === 'NULL' ? null : cached as T;
  }

  // 获取数据
  const data = await fetchData();

  // 即使是 null 也要缓存，防止缓存穿透
  await redis.set(key, data || 'NULL', { ex: 60 });

  return data;
}

// 3. 分布式锁防止缓存击穿
export async function getCachedDataWithLock<T>(
  key: string,
  lockKey: string,
  fetchData: () => Promise<T>
): Promise<T> {
  // 检查缓存
  const cached = await redis.get(key);
  if (cached) return cached as T;

  // 尝试获取锁
  const lockAcquired = await redis.set(lockKey, '1', { nx: true, ex: 10 });

  if (lockAcquired) {
    try {
      // 再次检查缓存（双重检查）
      const recheck = await redis.get(key);
      if (recheck) return recheck as T;

      // 获取数据并缓存
      const data = await fetchData();
      await redis.set(key, data, { ex: 300 });
      return data;
    } finally {
      // 释放锁
      await redis.del(lockKey);
    }
  } else {
    // 等待锁释放后重试
    await new Promise(resolve => setTimeout(resolve, 100));
    return getCachedDataWithLock(key, lockKey, fetchData);
  }
}

// 4. 缓存更新策略
export async function invalidateRelatedCache(pattern: string) {
  // 获取匹配的键
  const keys = await redis.keys(pattern);

  if (keys.length > 0) {
    // 批量删除
    await redis.del(...keys);
  }
}

// 使用示例
export async function updatePost(id: number, data: Record<string, unknown>) {
  const updatedPost = await prisma.post.update({
    where: { id },
    data
  });

  // 删除相关缓存
  await Promise.all([
    redis.del(\`post:\${id}\`),
    invalidateRelatedCache('posts:page:*'),
    invalidateRelatedCache('posts:author:*')
  ]);

  return updatedPost;
}`;

  return (
    <TutorialLayout
      title="Redis 缓存教程"
      description="学习使用 Upstash Redis 实现高性能缓存，提升应用程序的响应速度和用户体验"
      prevTutorial={{
        title: 'Prisma ORM',
        href: '/tutorials/prisma',
      }}
      nextTutorial={{
        title: '阿里云 OSS',
        href: '/tutorials/oss',
      }}
    >
      <div className="space-y-12">
        {/* 简介 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            为什么需要 Redis 缓存？
          </h2>
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p>
              Redis 是一个内存键值数据库，常用作缓存层来提升应用性能。 通过减少数据库查询次数，Redis
              可以显著提高应用的响应速度和并发处理能力。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <Zap className="h-8 w-8 text-yellow-600 mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">高性能</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">内存操作，微秒级响应时间</p>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <Database className="h-8 w-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">减少数据库压力</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  缓存热点数据，降低数据库负载
                </p>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <Clock className="h-8 w-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">灵活过期</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  支持多种过期策略和数据结构
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 设置和配置 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Upstash Redis 设置
          </h2>
          <div className="prose prose-lg max-w-none dark:prose-invert mb-6">
            <p>
              Upstash 提供了无服务器的 Redis 服务，与 Next.js 完美集成。 它支持基于 HTTP
              的连接，非常适合 Edge 环境。
            </p>
          </div>

          <CodeBlock code={setupCode} language="typescript" filename="lib/redis.ts" />

          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">环境变量配置</h4>
            <CodeBlock
              code={`# .env.local
UPSTASH_REDIS_REST_URL="https://your-redis-url.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your_redis_token_here"`}
              language="bash"
              filename=".env.local"
            />
          </div>
        </section>

        {/* 基本操作 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Redis 基本操作</h2>
          <div className="prose prose-lg max-w-none dark:prose-invert mb-6">
            <p>
              Redis 支持多种数据结构，包括字符串、哈希、列表、集合等。 了解这些基本操作是使用 Redis
              的基础。
            </p>
          </div>

          <CodeBlock code={basicOperationsCode} language="typescript" filename="Redis 基本操作" />
        </section>

        {/* Redis 演示 */}
        <DemoSection
          title="Redis 缓存操作演示"
          description="体验 Redis 的基本操作，包括添加、查询、过期等功能"
          demoComponent={<RedisDemo />}
          codeComponent={
            <CodeBlock
              code={`// Redis 缓存操作示例
import { redis } from '@/lib/redis';

// 设置缓存
await redis.set('user:123', {
  id: 123,
  name: '张三',
  email: 'zhangsan@example.com'
}, { ex: 300 }); // 5分钟过期

// 获取缓存
const user = await redis.get('user:123');

// 检查键是否存在
const exists = await redis.exists('user:123');

// 删除缓存
await redis.del('user:123');

// 批量操作
const pipeline = redis.pipeline();
pipeline.set('key1', 'value1');
pipeline.set('key2', 'value2');
pipeline.set('key3', 'value3');
await pipeline.exec();`}
              language="typescript"
              filename="缓存操作示例"
            />
          }
        />

        {/* 缓存策略 */}
        <DemoSection
          title="缓存策略演示"
          description="了解不同的缓存策略及其适用场景"
          demoComponent={<CacheStrategyDemo />}
          codeComponent={
            <CodeBlock code={cacheStrategiesCode} language="typescript" filename="缓存策略实现" />
          }
        />

        {/* Redis 实际功能测试 */}
        <DemoSection
          title="Redis 实际功能测试"
          description="测试真实的Redis功能：验证码生成/验证、连接测试、限流保护等"
          demoComponent={<RedisTestComponent />}
          codeComponent={
            <CodeBlock
              code={`// Redis 验证码实现
import { redis } from '@/lib/redis';

// 生成验证码 API
export async function POST(request: NextRequest) {
  const { key } = await request.json();

  // 生成6位数验证码
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const redisKey = \`captcha:\${key}\`;

  // 存储验证码，5分钟过期
  await redis.set(redisKey, code, { ex: 300 });

  return NextResponse.json({
    success: true,
    code, // 开发环境返回验证码
    message: '验证码生成成功',
    expiresIn: '5分钟',
    redisKey
  });
}

// 验证验证码 API
export async function POST(request: NextRequest) {
  const { key, code } = await request.json();
  const redisKey = \`captcha:\${key}\`;

  // 从Redis获取验证码
  const storedCode = await redis.get(redisKey);

  if (!storedCode) {
    return NextResponse.json({
      success: false,
      message: '验证码已过期或不存在'
    });
  }

  if (storedCode !== code) {
    return NextResponse.json({
      success: false,
      message: '验证码错误'
    });
  }

  // 验证成功，删除验证码
  await redis.del(redisKey);

  return NextResponse.json({
    success: true,
    message: '验证码验证成功'
  });
}

// 限流实现
export async function rateLimit(key: string, limit: number, window: number) {
  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, window);
  }

  return {
    success: current <= limit,
    current,
    limit,
    retryAfter: current > limit ? await redis.ttl(key) : null
  };
}`}
              language="typescript"
              filename="Redis 实际应用案例"
            />
          }
        />

        {/* API 集成 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Next.js API 路由集成
          </h2>
          <div className="prose prose-lg max-w-none dark:prose-invert mb-6">
            <p>
              在 Next.js API 路由中集成 Redis 缓存，实现高性能的数据接口。
              合理的缓存策略可以大幅提升 API 响应速度。
            </p>
          </div>

          <CodeBlock code={apiIntegrationCode} language="typescript" filename="API 路由缓存集成" />
        </section>

        {/* 性能优化 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">性能优化技巧</h2>
          <div className="prose prose-lg max-w-none dark:prose-invert mb-6">
            <p>
              通过合理的缓存设计和优化技巧，可以进一步提升缓存的效率和可靠性。
              这些技巧包括批量操作、缓存穿透保护、分布式锁等。
            </p>
          </div>

          <CodeBlock code={performanceCode} language="typescript" filename="性能优化技巧" />
        </section>

        {/* 互动编辑器 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Redis 操作练习</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            尝试编写 Redis 操作代码，体验缓存的强大功能：
          </p>

          <CodeEditor
            title="Redis 练习场"
            defaultCode={`// Redis 缓存练习
import { redis } from '@/lib/redis';

// 练习 1: 用户会话管理
async function manageUserSession() {
  const sessionId = 'session_' + Math.random().toString(36);
  const userId = 123;

  // 创建会话，30分钟过期
  await redis.set(sessionId, {
    userId,
    loginTime: new Date().toISOString(),
    userAgent: 'Mozilla/5.0...'
  }, { ex: 1800 });

  console.log('会话已创建:', sessionId);

  // 验证会话
  const session = await redis.get(sessionId);
  if (session) {
    console.log('会话有效:', session);
  }

  return sessionId;
}

// 练习 2: 页面访问计数
async function trackPageViews(pageId: string) {
  const dailyKey = \`views:\${pageId}:\${new Date().toDateString()}\`;
  const totalKey = \`views:\${pageId}:total\`;

  // 使用 pipeline 批量操作
  const pipeline = redis.pipeline();
  pipeline.incr(dailyKey);
  pipeline.incr(totalKey);
  pipeline.expire(dailyKey, 86400); // 每日统计保留24小时

  const results = await pipeline.exec();

  console.log('今日访问量:', results[0]);
  console.log('总访问量:', results[1]);

  return results;
}

// 练习 3: 排行榜功能
async function updateLeaderboard(userId: string, score: number) {
  const leaderboardKey = 'game:leaderboard';

  // 添加或更新分数
  await redis.zadd(leaderboardKey, { score, member: userId });

  // 获取前10名
  const topPlayers = await redis.zrange(leaderboardKey, 0, 9, {
    withScores: true,
    rev: true // 降序排列
  });

  console.log('排行榜前10名:', topPlayers);

  // 获取用户排名
  const userRank = await redis.zrevrank(leaderboardKey, userId);
  console.log(\`用户 \${userId} 的排名:, userRank !== null ? userRank + 1 : '未上榜'\`);

  return { topPlayers, userRank };
}

// 运行练习
async function runExercises() {
  await manageUserSession();
  await trackPageViews('homepage');
  await updateLeaderboard('user_123', 9500);
}

runExercises().then(() => {
  console.log('所有练习完成！');
});`}
            language="typescript"
            height="600px"
            onRun={code => console.log('执行 Redis 代码:', code)}
            showConsole
          />
        </section>

        {/* 最佳实践 */}
        <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Redis 最佳实践</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-2 flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                性能优化
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-green-600 flex-shrink-0" />
                  使用 pipeline 进行批量操作
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-green-600 flex-shrink-0" />
                  合理设置过期时间，避免内存泄漏
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-green-600 flex-shrink-0" />
                  选择合适的数据结构
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-green-600 flex-shrink-0" />
                  避免大 key 和热 key 问题
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-2 flex items-center">
                <Database className="h-5 w-5 mr-2" />
                缓存策略
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-blue-600 flex-shrink-0" />
                  防止缓存穿透、击穿和雪崩
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-blue-600 flex-shrink-0" />
                  实现优雅的缓存更新机制
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-blue-600 flex-shrink-0" />
                  监控缓存命中率和性能指标
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mt-1 mr-2 text-blue-600 flex-shrink-0" />
                  制定缓存失效和容灾策略
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 下一步 */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">准备好了吗？</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            现在你已经掌握了 Redis 缓存的核心概念，让我们继续学习阿里云 OSS 文件存储服务。
          </p>
          <Link
            href="/tutorials/oss"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            学习阿里云 OSS
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </section>
      </div>
    </TutorialLayout>
  );
}
