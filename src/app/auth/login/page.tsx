'use client';

import React, { useState } from 'react';
import { Card, Form, Input, Button, Alert, Checkbox, Divider, message } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export default function LoginPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleLogin = async (values: LoginFormData) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        message.success('登录成功！');
        
        // 存储token到localStorage（可选，因为已经设置了HttpOnly Cookie）
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        // 跳转到个人中心或之前的页面
        const returnUrl = new URLSearchParams(window.location.search).get('returnUrl');
        router.push(returnUrl || '/profile');
      } else {
        // 处理不同类型的错误
        if (response.status === 429) {
          setError(data.message || '登录尝试过于频繁，请稍后再试');
        } else if (response.status === 401) {
          setError('邮箱或密码错误');
          if (data.field === 'email') {
            form.setFields([{ name: 'email', errors: ['邮箱不存在'] }]);
          } else if (data.field === 'password') {
            form.setFields([{ name: 'password', errors: ['密码错误'] }]);
          }
        } else {
          setError(data.error || '登录失败，请重试');
        }
      }
    } catch (error) {
      console.error('登录错误:', error);
      setError('网络错误，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            用户登录
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            登录您的账户以继续使用
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              onClose={() => setError('')}
              className="mb-6"
            />
          )}

          <Form
            form={form}
            name="login"
            onFinish={handleLogin}
            layout="vertical"
            size="large"
            autoComplete="off"
          >
            <Form.Item
              name="email"
              label="邮箱地址"
              rules={[
                { required: true, message: '请输入邮箱地址' },
                { type: 'email', message: '请输入有效的邮箱地址' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="请输入邮箱地址"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: '请输入密码' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入密码"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item>
              <div className="flex items-center justify-between">
                <Form.Item name="rememberMe" valuePropName="checked" noStyle>
                  <Checkbox>记住我</Checkbox>
                </Form.Item>
                <Link 
                  href="/auth/forgot-password" 
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  忘记密码？
                </Link>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="h-12 text-lg font-medium"
              >
                {loading ? '登录中...' : '登录'}
              </Button>
            </Form.Item>
          </Form>

          <Divider plain>
            <span className="text-gray-500 text-sm">还没有账户？</span>
          </Divider>

          <div className="text-center">
            <Link href="/auth/register">
              <Button type="link" className="text-blue-600 hover:text-blue-700 font-medium">
                立即注册 →
              </Button>
            </Link>
          </div>
        </Card>

        {/* 安全提示 */}
        <div className="mt-6 text-center">
          <div className="text-xs text-gray-500 space-y-1">
            <p>🔒 您的登录信息经过加密保护</p>
            <p>🛡️ 支持双因素认证和安全验证</p>
          </div>
        </div>

        {/* 演示账户信息 */}
        <Card className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700">
          <div className="text-center">
            <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              🎯 演示账户
            </h4>
            <div className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
              <p>邮箱: demo@example.com</p>
              <p>密码: Demo123!</p>
              <p className="text-yellow-600 dark:text-yellow-400">
                * 仅用于功能演示，请勿输入真实密码
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

