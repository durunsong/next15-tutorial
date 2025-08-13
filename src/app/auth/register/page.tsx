'use client';

import React, { useState } from 'react';
import { Card, Form, Input, Button, Alert, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, LinkOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PasswordStrengthIndicator from '@/components/PasswordStrengthIndicator';
import { checkPasswordStrength } from '@/utils/passwordValidation';

interface RegisterFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  avatar?: string;
}

export default function RegisterPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    canRegister: boolean;
    resetTime?: number;
  }>({ canRegister: true });
  const router = useRouter();

  // 检查密码强度
  const passwordStrength = checkPasswordStrength(password);

  const handleRegister = async (values: RegisterFormData) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          username: values.username,
          password: values.password,
          avatar: values.avatar || '',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        message.success('注册成功！请登录您的账户');
        
        // 显示密码强度反馈
        if (data.passwordStrength) {
          message.info(`密码强度: ${data.passwordStrength.level} (${data.passwordStrength.score}/100)`);
        }

        // 跳转到登录页面
        router.push('/auth/login?message=注册成功，请登录');
      } else {
        // 处理不同类型的错误
        if (response.status === 429) {
          setError(data.message || '注册过于频繁，请稍后再试');
          if (data.resetTime) {
            setRateLimitInfo({
              canRegister: false,
              resetTime: data.resetTime,
            });
          }
        } else if (response.status === 409) {
          setError(data.error || '用户已存在');
          if (data.field === 'email') {
            form.setFields([{ name: 'email', errors: ['邮箱已被使用'] }]);
          } else if (data.field === 'username') {
            form.setFields([{ name: 'username', errors: ['用户名已被使用'] }]);
          }
        } else if (response.status === 400) {
          if (data.feedback) {
            setError('密码强度不足：' + data.feedback.join('，'));
          } else {
            setError(data.error || '注册信息有误');
          }
        } else {
          setError(data.error || '注册失败，请重试');
        }
      }
    } catch (error) {
      console.error('注册错误:', error);
      setError('网络错误，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  // 倒计时显示
  const getRateLimitMessage = () => {
    if (!rateLimitInfo.resetTime) return '';
    
    const now = Date.now();
    const resetTime = rateLimitInfo.resetTime;
    const remaining = Math.max(0, Math.ceil((resetTime - now) / 1000));
    
    if (remaining > 0) {
      const minutes = Math.floor(remaining / 60);
      const seconds = remaining % 60;
      return `请等待 ${minutes}分${seconds}秒 后再试`;
    }
    
    return '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">✨</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            用户注册
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            创建您的账户，开始精彩旅程
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

          {!rateLimitInfo.canRegister && (
            <Alert
              message="注册限制"
              description={getRateLimitMessage()}
              type="warning"
              showIcon
              className="mb-6"
            />
          )}

          <Form
            form={form}
            name="register"
            onFinish={handleRegister}
            layout="vertical"
            size="large"
            autoComplete="off"
            disabled={!rateLimitInfo.canRegister}
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
              name="username"
              label="用户名"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 3, message: '用户名至少3个字符' },
                { max: 20, message: '用户名最多20个字符' },
                { 
                  pattern: /^[a-zA-Z0-9_]+$/, 
                  message: '用户名只能包含字母、数字和下划线' 
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="请输入用户名"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6个字符' },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    const result = checkPasswordStrength(value);
                    if (result.score < 50) {
                      return Promise.reject(new Error('密码强度不足'));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入密码"
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>

            {/* 密码强度指示器 */}
            {password && (
              <div className="mb-4">
                <PasswordStrengthIndicator password={password} />
              </div>
            )}

            <Form.Item
              name="confirmPassword"
              label="确认密码"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请再次输入密码"
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item
              name="avatar"
              label="头像URL (可选)"
              rules={[
                { type: 'url', message: '请输入有效的URL' },
              ]}
            >
              <Input
                prefix={<LinkOutlined />}
                placeholder="请输入头像图片URL"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                disabled={!rateLimitInfo.canRegister || passwordStrength.score < 50}
                className="h-12 text-lg font-medium"
              >
                {loading ? '注册中...' : '注册账户'}
              </Button>
            </Form.Item>
          </Form>

          <Divider plain>
            <span className="text-gray-500 text-sm">已有账户？</span>
          </Divider>

          <div className="text-center">
            <Link href="/auth/login">
              <Button type="link" className="text-blue-600 hover:text-blue-700 font-medium">
                立即登录 →
              </Button>
            </Link>
          </div>
        </Card>

        {/* 注册说明 */}
        <div className="mt-6 text-center">
          <div className="text-xs text-gray-500 space-y-1">
            <p>🔒 注册即表示您同意我们的服务条款</p>
            <p>🛡️ 您的个人信息将受到严格保护</p>
            <p>⏰ 注册有频率限制：5分钟内只能注册一次</p>
          </div>
        </div>

        {/* 密码要求说明 */}
        <Card className="mt-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
          <div className="text-center">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              🔑 密码要求
            </h4>
            <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <p>• 至少6个字符（建议8个以上）</p>
              <p>• 包含大小写字母</p>
              <p>• 包含数字</p>
              <p>• 建议包含特殊字符</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

