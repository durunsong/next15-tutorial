'use client';

import {
  CalendarOutlined,
  FileTextOutlined,
  MessageOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Card, Col, Empty, Row, Spin, Tag, Typography } from 'antd';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

const { Title, Text, Paragraph } = Typography;

interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    comments: number;
  };
}

interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string | null;
  createdAt: string;
  updatedAt: string;
  posts: Post[];
  _count: {
    posts: number;
    comments: number;
  };
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 使用方括号表示法访问 id 属性，避免 TypeScript 类型错误
  const userId = params?.['id'] as string;

  useEffect(() => {
    if (!userId) {
      setError('用户ID无效');
      setLoading(false);
      return;
    }

    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('用户不存在');
        } else {
          setError('获取用户信息失败');
        }
        return;
      }

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('获取用户信息错误:', error);
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const truncateContent = (content: string, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={error || '用户不存在'} />
          <Button type="primary" onClick={() => router.back()} className="mt-4">
            返回上一页
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* 用户基本信息 */}
        <Card className="mb-6">
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={6} className="text-center">
              <Avatar size={120} src={user.avatar} icon={<UserOutlined />} className="mb-4" />
              <Title level={3} className="mb-2">
                {user.username}
              </Title>
              <Text type="secondary">{user.email}</Text>
            </Col>

            <Col xs={24} md={18}>
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={6}>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{user._count.posts}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">发布文章</div>
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{user._count.comments}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">发表评论</div>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarOutlined className="text-gray-500" />
                      <Text type="secondary">注册时间</Text>
                    </div>
                    <Text>{formatDate(user.createdAt)}</Text>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>

        {/* 用户文章列表 */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <FileTextOutlined />
              <span>发布的文章 ({user._count.posts})</span>
            </div>
          }
        >
          {user.posts.length > 0 ? (
            <div className="space-y-4">
              {user.posts.map(post => (
                <Card key={post.id} size="small" className="hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <Title level={5} className="mb-2">
                      <Link
                        href={`/posts/${post.id}`}
                        className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        {post.title}
                      </Link>
                    </Title>
                    <div className="flex gap-2">
                      <Tag color={post.published ? 'green' : 'orange'}>
                        {post.published ? '已发布' : '草稿'}
                      </Tag>
                    </div>
                  </div>

                  <Paragraph className="text-gray-600 dark:text-gray-300 mb-3">
                    {truncateContent(post.content)}
                  </Paragraph>

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <CalendarOutlined />
                        {formatDate(post.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageOutlined />
                        {post._count.comments} 评论
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Empty description="暂无发布的文章" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </Card>
      </div>
    </div>
  );
}
