'use client';

import {
  CalendarOutlined,
  FileTextOutlined,
  MessageOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Card, Col, Empty, Input, Pagination, Row, Space, Spin, Typography } from 'antd';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

const { Title, Text } = Typography;

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    posts: number;
    comments: number;
  };
}

interface UserListResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function UsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>('');

  // 从URL参数获取当前页码和搜索关键词
  const currentPage = parseInt(searchParams.get('page') || '1');
  const currentSearch = searchParams.get('search') || '';

  useEffect(() => {
    setSearchValue(currentSearch);
    fetchUsers(currentPage, currentSearch);
  }, [currentPage, currentSearch]);

  const fetchUsers = async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      });

      if (search.trim()) {
        queryParams.set('search', search.trim());
      }

      const response = await fetch(`/api/users?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('获取用户列表失败');
      }

      const data: UserListResponse = await response.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error('获取用户列表错误:', error);
      setError('获取用户列表失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value.trim()) {
      params.set('search', value.trim());
    } else {
      params.delete('search');
    }

    // 搜索时重置到第一页
    params.set('page', '1');

    router.push(`/users?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`/users?${params.toString()}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* 页面标题和搜索 */}
        <div className="mb-8">
          <Title level={2} className="mb-4">
            <UserOutlined className="mr-2" />
            用户列表
          </Title>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <Text type="secondary" className="text-base">
              共找到 {pagination.total} 位用户
            </Text>

            <div className="w-full sm:w-auto sm:min-w-80">
              <Input.Search
                placeholder="搜索用户名或邮箱..."
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                onSearch={handleSearch}
                allowClear
                size="large"
                prefix={<SearchOutlined />}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <Card className="mb-6">
            <Empty description={error} image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </Card>
        )}

        {/* 用户卡片网格 */}
        {!error && (
          <>
            {users.length > 0 ? (
              <>
                <Row gutter={[16, 16]} className="mb-8">
                  {users.map(user => (
                    <Col key={user.id} xs={24} sm={12} md={8} lg={6} xl={4}>
                      <Card
                        hoverable
                        className="h-full transition-all duration-300 hover:shadow-lg"
                        onClick={() => router.push(`/users/${user.id}`)}
                      >
                        <div className="text-center">
                          {/* 用户头像 */}
                          <Avatar
                            size={80}
                            src={user.avatar}
                            icon={<UserOutlined />}
                            className="mb-4"
                          />

                          {/* 用户名 */}
                          <Title level={5} className="mb-2 truncate">
                            {user.username}
                          </Title>

                          {/* 邮箱 */}
                          <Text type="secondary" className="text-sm block mb-4 truncate">
                            {user.email}
                          </Text>

                          {/* 统计信息 */}
                          <Space direction="vertical" size="small" className="w-full">
                            <div className="flex justify-between items-center text-xs">
                              <span className="flex items-center gap-1 text-blue-600">
                                <FileTextOutlined />
                                文章
                              </span>
                              <span className="font-semibold">{user._count.posts}</span>
                            </div>

                            <div className="flex justify-between items-center text-xs">
                              <span className="flex items-center gap-1 text-green-600">
                                <MessageOutlined />
                                评论
                              </span>
                              <span className="font-semibold">{user._count.comments}</span>
                            </div>

                            <div className="flex justify-between items-center text-xs">
                              <span className="flex items-center gap-1 text-gray-500">
                                <CalendarOutlined />
                                注册
                              </span>
                              <span className="text-gray-500">{formatDate(user.createdAt)}</span>
                            </div>
                          </Space>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>

                {/* 分页 */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center">
                    <Pagination
                      current={pagination.page}
                      total={pagination.total}
                      pageSize={pagination.limit}
                      onChange={handlePageChange}
                      showSizeChanger={false}
                      showQuickJumper
                      showTotal={(total, range) =>
                        `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`
                      }
                      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
                    />
                  </div>
                )}
              </>
            ) : (
              <Card>
                <Empty
                  description={currentSearch ? '未找到匹配的用户' : '暂无用户'}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  {currentSearch && (
                    <Link href="/users" className="text-blue-600 hover:text-blue-800">
                      查看所有用户
                    </Link>
                  )}
                </Empty>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
