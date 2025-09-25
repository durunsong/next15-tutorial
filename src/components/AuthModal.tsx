'use client';

import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Alert, Button, Checkbox, Form, Input, Modal, Tabs, message } from 'antd';

import { useEffect, useRef, useState } from 'react';

import PasswordStrengthIndicator from '@/components/PasswordStrengthIndicator';
import { useAuthStore } from '@/store/authStore';
import { checkPasswordStrength } from '@/utils/passwordValidation';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (user: Record<string, unknown>) => void;
  defaultTab?: 'login' | 'register';
}

export default function AuthModal({
  open,
  onClose,
  onSuccess,
  defaultTab = 'login',
}: AuthModalProps) {
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    canRegister: boolean;
    resetTime?: number;
  }>({ canRegister: true });
  const formsMountedRef = useRef(false);

  const { login } = useAuthStore();

  // 确保 form 实例正确创建
  useEffect(() => {
    // 验证 form 实例是否正确创建
    if (!loginForm || !registerForm) {
      console.warn('AuthModal: Form instances not properly created');
    }
  }, [loginForm, registerForm]);

  // 记录表单是否已经渲染过，避免初始阶段 reset 触发警告
  useEffect(() => {
    if (open) {
      formsMountedRef.current = true;
    }
  }, [open]);

  // 当Modal关闭时确保form状态正确重置
  useEffect(() => {
    if (!open && formsMountedRef.current) {
      const timer = setTimeout(() => {
        loginForm.resetFields();
        registerForm.resetFields();
        setError('');
        setPassword('');
        setActiveTab(defaultTab);
      }, 200);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [open, loginForm, registerForm, defaultTab]);

  // 登录处理
  const handleLogin = async (values: {
    loginId: string;
    password: string;
    rememberMe?: boolean;
  }) => {
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

        // 使用useAuth hook更新状态
        login(data.user, data.token);

        onSuccess(data.user);
        onClose();
      } else {
        if (response.status === 429) {
          setError(data.message || '登录尝试过于频繁，请稍后再试');
        } else if (response.status === 401) {
          setError('邮箱或密码错误');
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

  // 注册处理
  const handleRegister = async (values: {
    email: string;
    username: string;
    phone?: string;
    password: string;
    confirmPassword: string;
  }) => {
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
          phone: values.phone,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        message.success('注册成功！请登录您的账户');

        // 切换到登录选项卡并预填登录信息
        setActiveTab('login');
        loginForm.setFieldsValue({ loginId: values.email });
        setPassword('');
      } else {
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

  // 关闭模态框时重置状态
  const handleClose = () => {
    if (formsMountedRef.current) {
      loginForm.resetFields();
      registerForm.resetFields();
    }
    setError('');
    setPassword('');
    setActiveTab('login');
    onClose();
  };

  // 检查密码强度
  const passwordStrength = checkPasswordStrength(password);

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
    <Modal
      title={null}
      open={open}
      onCancel={handleClose}
      footer={null}
      width={400}
      className="auth-modal"
      centered
      destroyOnHidden
    >
      <div className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {activeTab === 'login' ? '登录' : '注册'}
          </h2>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            onClose={() => setError('')}
            className="mb-4"
          />
        )}

        {!rateLimitInfo.canRegister && activeTab === 'register' && (
          <Alert
            message="注册限制"
            description={getRateLimitMessage()}
            type="warning"
            showIcon
            className="mb-4"
          />
        )}

        <Tabs
          centered
          className="auth-tabs"
          activeKey={activeTab}
          onChange={key => setActiveTab(key as 'login' | 'register')}
          items={[
            {
              key: 'login',
              label: '登录',
              children: (
                <Form
                  key="login-form"
                  form={loginForm}
                  name="login"
                  onFinish={handleLogin}
                  layout="vertical"
                  autoComplete="off"
                >
                  <Form.Item
                    name="loginId"
                    rules={[{ required: true, message: '请输入用户名/邮箱/手机号' }]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="用户名/邮箱/手机号"
                      size="large"
                      autoComplete="username"
                    />
                  </Form.Item>

                  <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="密码"
                      size="large"
                      iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                      autoComplete="current-password"
                    />
                  </Form.Item>

                  <Form.Item>
                    <div className="flex items-center justify-between">
                      <Form.Item name="rememberMe" valuePropName="checked" noStyle>
                        <Checkbox>记住我</Checkbox>
                      </Form.Item>
                      <a href="#" className="text-blue-600 hover:text-blue-700 text-sm">
                        忘记密码？
                      </a>
                    </div>
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block size="large">
                      登录
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
            {
              key: 'register',
              label: '注册',
              children: (
                <Form
                  key="register-form"
                  form={registerForm}
                  name="register"
                  onFinish={handleRegister}
                  layout="vertical"
                  autoComplete="off"
                  disabled={!rateLimitInfo.canRegister}
                >
                  <Form.Item
                    name="username"
                    rules={[
                      { required: true, message: '请输入用户名' },
                      { min: 3, message: '用户名至少3个字符' },
                      { max: 20, message: '用户名最多20个字符' },
                      {
                        pattern: /^[a-zA-Z0-9_]+$/,
                        message: '用户名只能包含字母、数字和下划线',
                      },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="用户名"
                      size="large"
                      autoComplete="username"
                    />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: '请输入邮箱地址' },
                      { type: 'email', message: '请输入有效的邮箱地址' },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined />}
                      placeholder="邮箱地址"
                      size="large"
                      autoComplete="email"
                    />
                  </Form.Item>

                  <Form.Item
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
                      placeholder="手机号"
                      size="large"
                      autoComplete="tel"
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    rules={[
                      { required: true, message: '请输入密码' },
                      { min: 6, message: '密码至少6个字符' },
                      {
                        validator: (_, value) => {
                          if (!value) return Promise.resolve();
                          const result = checkPasswordStrength(value);
                          if (result.score < 30) {
                            return Promise.reject(new Error('密码强度不足'));
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="密码"
                      size="large"
                      iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                      autoComplete="new-password"
                      onChange={e => setPassword(e.target.value)}
                    />
                  </Form.Item>

                  {password && (
                    <div className="mb-4">
                      <PasswordStrengthIndicator password={password} />
                    </div>
                  )}

                  <Form.Item
                    name="confirmPassword"
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
                      placeholder="确认密码"
                      size="large"
                      iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                      autoComplete="new-password"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      block
                      size="large"
                      disabled={!rateLimitInfo.canRegister || passwordStrength.score < 30}
                    >
                      注册
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
          ]}
        />

        {/* 演示账户提示 */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-center">
            <h4 className="text-sm font-medium text-blue-800 mb-1">💡 演示账户</h4>
            <p className="text-xs text-blue-600">邮箱: demo@example.com，密码: Demo123!</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
