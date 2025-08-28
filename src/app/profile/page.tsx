'use client';

import {
  CameraOutlined,
  EditOutlined,
  MailOutlined,
  SaveOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Spin,
  Tabs,
  Typography,
  Upload,
  message,
} from 'antd';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { useAuthStore } from '@/store/authStore';

const { Title, Text } = Typography;

interface UserProfile {
  id: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string | null;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    posts: number;
    comments: number;
  };
}

export default function ProfilePage() {
  const [form] = Form.useForm();
  const [avatarForm] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const dataInitialized = useRef(false);

  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, token, updateUser } = useAuthStore();

  // 获取用户信息
  const fetchUserInfo = useCallback(async () => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUserInfo(data.user);

        // 设置表单初始值 - 使用setTimeout确保Form组件已完全渲染
        setTimeout(() => {
          form.setFieldsValue({
            username: data.user.username,
            email: data.user.email,
            phone: data.user.phone || '',
          });
        }, 0);
      } else {
        if (response.status === 401) {
          message.error('登录已过期，请重新登录');
          router.push('/tech-stack');
        } else {
          message.error('获取用户信息失败');
        }
      }
    } catch (error) {
      console.error('获取用户信息错误：', error);
      message.error('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  }, [token, form, router]);

  // 页面初始化：只执行一次
  useEffect(() => {
    // 等待认证状态检查完成
    if (authLoading) return;

    if (!isAuthenticated) {
      message.error('请先登录');
      router.push('/tech-stack');
      return;
    }

    // 使用ref确保只初始化一次
    if (!dataInitialized.current) {
      dataInitialized.current = true;
      fetchUserInfo();
    }
  }, [authLoading, isAuthenticated, router, fetchUserInfo]);

  // 更新用户信息
  const handleSubmit = async (values: { username?: string; email?: string; phone?: string }) => {
    setSaving(true);

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/auth/me', {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          phone: values.phone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        message.success('个人信息更新成功！');
        setUserInfo(data.user);
        // 同步更新全局认证状态
        updateUser({
          username: data.user.username,
          email: data.user.email,
          phone: data.user.phone,
        });
      } else {
        if (response.status === 409) {
          message.error(data.error || '用户名已被使用');
        } else if (response.status === 401) {
          message.error('登录已过期，请重新登录');
          router.push('/tech-stack');
        } else {
          message.error(data.error || '更新失败');
        }
      }
    } catch (error) {
      console.error('更新用户信息错误：', error);
      message.error('网络错误，请重试');
    } finally {
      setSaving(false);
    }
  };

  // 更新头像URL
  const handleAvatarUrlSubmit = async (values: { avatar: string }) => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/auth/me', {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          avatar: values.avatar,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        message.success('头像更新成功！');
        setUserInfo(data.user);
        // 同步更新全局认证状态
        updateUser({ avatar: data.user.avatar });
        setAvatarModalVisible(false);
        avatarForm.resetFields();
      } else {
        message.error(data.error || '头像更新失败');
      }
    } catch (error) {
      console.error('更新头像错误：', error);
      message.error('网络错误，请重试');
    }
  };

  // 处理文件上传
  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const headers: HeadersInit = {};

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        message.success('头像上传成功！');
        
        // 更新本地用户信息
        if (userInfo) {
          const updatedUserInfo = { ...userInfo, avatar: data.data.avatarUrl };
          setUserInfo(updatedUserInfo);
        }
        
        // 同步更新全局认证状态
        updateUser({ avatar: data.data.avatarUrl });
        setAvatarModalVisible(false);
      } else {
        message.error(data.message || '上传失败');
      }
    } catch (error) {
      console.error('上传头像错误：', error);
      message.error('网络错误，请重试');
    }

    return false; // 阻止默认上传行为
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Text type="danger">加载用户信息失败</Text>
          <br />
          <Button type="primary" onClick={fetchUserInfo} className="mt-4">
            重新加载
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* 页面标题 */}
        <div className="mb-8">
          <Title level={2} className="mb-2">
            个人中心
          </Title>
          <Text type="secondary">管理您的个人信息和账户设置</Text>
        </div>

        {/* 主要内容区域 */}
        <Row gutter={[24, 24]}>
          {/* 左侧：头像区域 */}
          <Col xs={24} lg={8}>
            <Card title="头像" className="mb-6">
              <div className="text-center">
                <Avatar size={120} src={userInfo.avatar} icon={<UserOutlined />} className="mb-4" />
                <div>
                  <Button
                    type="primary"
                    icon={<CameraOutlined />}
                    onClick={() => setAvatarModalVisible(true)}
                    className="mb-2 mt-2"
                  >
                    更换头像
                  </Button>
                  <div className="text-xs text-gray-500">
                    支持 JPEG、PNG、GIF、WebP 格式
                    <br />
                    文件大小不超过 5MB
                  </div>
                </div>
              </div>
            </Card>

            {/* 账户信息 */}
            <Card title="账户信息" className="mb-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Text type="secondary">用户 ID:</Text>
                  <Text className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {userInfo.id}
                  </Text>
                </div>
                <div className="flex justify-between items-center">
                  <Text type="secondary">注册时间:</Text>
                  <Text>{new Date(userInfo.createdAt).toLocaleDateString('zh-CN')}</Text>
                </div>
                <div className="flex justify-between items-center">
                  <Text type="secondary">发帖数量:</Text>
                  <Text>{userInfo._count?.posts || 0} 条</Text>
                </div>
                <div className="flex justify-between items-center">
                  <Text type="secondary">评论数量:</Text>
                  <Text>{userInfo._count?.comments || 0} 条</Text>
                </div>
                <div className="flex justify-between items-center">
                  <Text type="secondary">用户角色:</Text>
                  <Text>普通用户</Text>
                </div>
                <div className="flex justify-between items-center">
                  <Text type="secondary">最后登录时间:</Text>
                  <Text>
                    {userInfo.lastLoginAt
                      ? new Date(userInfo.lastLoginAt).toLocaleString('zh-CN')
                      : '暂无记录'}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>

          {/* 右侧：个人信息表单 */}
          <Col xs={24} lg={16}>
            <Card title="个人信息" className="mb-6">
              <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                  label="用户名"
                  name="username"
                  rules={[
                    { required: true, message: '请输入用户名' },
                    { min: 3, message: '用户名至少3个字符' },
                    { max: 20, message: '用户名最多20个字符' },
                    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线' },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="请输入用户名"
                    size="large"
                    disabled
                  />
                </Form.Item>

                <Text type="secondary" className="block mb-4">
                  用户名不可修改
                </Text>

                <Form.Item
                  label="邮箱地址"
                  name="email"
                  rules={[
                    { required: true, message: '请输入邮箱地址' },
                    { type: 'email', message: '请输入有效的邮箱地址' },
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="请输入邮箱地址" size="large" />
                </Form.Item>

                <Form.Item
                  label="手机号码"
                  name="phone"
                  rules={[
                    { required: true, message: '请输入手机号' },
                    {
                      pattern: /^1[3-9]\d{9}$/,
                      message: '请输入有效的手机号（11位数字，以1开头）',
                    },
                  ]}
                >
                  <Input
                    prefix={
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    }
                    placeholder="手机号码"
                    size="large"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={saving}
                    size="large"
                    icon={<SaveOutlined />}
                    className="w-full"
                  >
                    保存修改
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>

        {/* 头像更新模态框 */}
        <Modal
          title="🖼️ 更新头像"
          open={avatarModalVisible}
          onCancel={() => {
            setAvatarModalVisible(false);
            avatarForm.resetFields();
          }}
          footer={null}
          width={500}
          destroyOnHidden={false}
        >
          <Tabs
            defaultActiveKey="upload"
            items={[
              {
                key: 'upload',
                label: (
                  <span>
                    <UploadOutlined />
                    本地上传
                  </span>
                ),
                children: (
                  <div className="text-center py-4">
                    <Upload
                      name="avatar"
                      showUploadList={false}
                      beforeUpload={handleFileUpload}
                      accept="image/*"
                      className="mb-4"
                    >
                      <Button icon={<UploadOutlined />} size="large">
                        选择图片文件
                      </Button>
                    </Upload>
                    <div className="text-sm text-gray-500 mt-2">
                      支持 JPEG、PNG、GIF、WebP 格式
                      <br />
                      文件大小不超过 5MB
                    </div>
                  </div>
                ),
              },
              {
                key: 'url',
                label: (
                  <span>
                    <EditOutlined />
                    输入链接
                  </span>
                ),
                children: (
                  <Form form={avatarForm} layout="vertical" onFinish={handleAvatarUrlSubmit}>
                    <Form.Item
                      label="头像URL"
                      name="avatar"
                      rules={[
                        { required: true, message: '请输入头像URL' },
                        { type: 'url', message: '请输入有效的URL' },
                      ]}
                    >
                      <Input placeholder="请输入头像图片URL" />
                    </Form.Item>

                    <Form.Item>
                      <Button type="primary" htmlType="submit" className="w-full">
                        确认更新
                      </Button>
                    </Form.Item>
                  </Form>
                ),
              },
            ]}
          />
        </Modal>
      </div>
    </div>
  );
}
