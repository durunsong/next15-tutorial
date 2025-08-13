'use client';

import { 
  CopyOutlined, 
  DatabaseOutlined, 
  ReloadOutlined, 
  UserOutlined,
  FileTextOutlined,

  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { 
  Alert, 
  Button, 
  Card, 
  Spin, 
  Typography, 
  message,
  Table,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Popconfirm
} from 'antd';

import { useEffect, useState } from 'react';

const { Text } = Typography;

interface DatabaseInfo {
  success: boolean;
  data?: {
    database: {
      name: string;
      version: string;
      size: string;
      fullVersion: string;
      currentUser: string;
    };
    statistics: {
      userTables: number;
      totalTables: number;
      userCount: number;
      postCount: number;
      commentCount: number;
    };
    environment: {
      nodeVersion: string;
      platform: string;
      isDevelopment: boolean;
    };
    queriedAt: string;
  };
  error?: string;
  message?: string;
}

interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: string;
  _count: {
    posts: number;
    comments: number;
  };
}

interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  category: string;
  difficulty: string;
  tags: string[];
  views: number;
  likes: number;
  createdAt: string;
  author: {
    username: string;
  };
}

export default function DatabasePage() {
  const [databaseInfo, setDatabaseInfo] = useState<DatabaseInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'info' | 'users' | 'posts'>('info');
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [form] = Form.useForm();
  const [postForm] = Form.useForm();

  const fetchDatabaseInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/database');
      const data = await response.json();
      setDatabaseInfo(data);
    } catch (error) {
      console.error('Failed to fetch database info:', error);
      setDatabaseInfo({
        success: false,
        error: 'Network error',
        message: 'Failed to connect to the API',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      message.error('获取用户列表失败');
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || data);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      message.error('获取文章列表失败');
    }
  };

  const handleCreateUser = async (values: {
    username: string;
    email: string;
    password?: string;
    avatar?: string;
  }) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success('用户创建成功');
        setUserModalVisible(false);
        form.resetFields();
        fetchUsers();
        fetchDatabaseInfo(); // 刷新统计信息
      } else {
        const error = await response.json();
        message.error(error.error || '创建用户失败');
      }
    } catch (error) {
      console.error('Create user error:', error);
      message.error('创建用户失败');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        message.success('用户删除成功');
        fetchUsers();
        fetchDatabaseInfo();
      } else {
        const error = await response.json();
        message.error(error.error || '删除用户失败');
      }
    } catch (error) {
      console.error('Delete user error:', error);
      message.error('删除用户失败');
    }
  };

  const handleCreatePost = async (values: {
    title: string;
    content: string;
    category: string;
    difficulty: string;
    tags?: string;
    published?: boolean;
    coverImage?: string;
  }) => {
    try {
      // 为演示目的，我们创建一个虚拟用户ID
      const postData = {
        ...values,
        authorId: users[0]?.id || 'demo-user',
        tags: values.tags ? values.tags.split(',').map((tag: string) => tag.trim()) : [],
      };

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        message.success('文章创建成功');
        setPostModalVisible(false);
        postForm.resetFields();
        fetchPosts();
        fetchDatabaseInfo();
      } else {
        const error = await response.json();
        message.error(error.error || '创建文章失败');
      }
    } catch (error) {
      console.error('Create post error:', error);
      message.error('创建文章失败');
    }
  };

  // 复制到剪贴板的函数
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success(`${label} 已复制到剪贴板`);
    } catch {
      message.error('复制失败，请手动复制');
    }
  };

  useEffect(() => {
    fetchDatabaseInfo();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'posts') {
      fetchPosts();
    }
  }, [activeTab]);

  if (loading) {
    return (
      <div className="p-12 text-center">
        <Spin size="large" />
        <p className="mt-4 text-lg">正在加载数据库信息...</p>
      </div>
    );
  }

  if (!databaseInfo || !databaseInfo.success) {
    return (
      <div className="p-6">
        <Alert
          message="数据库信息获取失败"
          description={databaseInfo?.message || '未知错误'}
          type="error"
          showIcon
          action={
            <Button size="small" type="primary" onClick={fetchDatabaseInfo}>
              重试
            </Button>
          }
        />
      </div>
    );
  }

  const { data } = databaseInfo;

  if (!data) {
    return (
      <div className="p-6">
        <Alert message="数据格式错误" type="error" showIcon />
      </div>
    );
  }

  const userColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (text: string) => <Text code>{text.slice(0, 8)}...</Text>,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '文章数',
      dataIndex: ['_count', 'posts'],
      key: 'posts',
      render: (count: number) => <Tag color="blue">{count}</Tag>,
    },
    {
      title: '评论数',
      dataIndex: ['_count', 'comments'],
      key: 'comments',
      render: (count: number) => <Tag color="green">{count}</Tag>,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: User) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => {
              setEditingUser(record);
              form.setFieldsValue(record);
              setUserModalVisible(true);
            }}
          />
          <Popconfirm
            title="确认删除此用户吗？"
            description="删除用户会同时删除其所有文章和评论"
            onConfirm={() => handleDeleteUser(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const postColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (text: string) => <Text code>{text.slice(0, 8)}...</Text>,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: '作者',
      dataIndex: ['author', 'username'],
      key: 'author',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag color="orange">{category}</Tag>,
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
      render: (difficulty: string) => {
        const color = difficulty === '初级' ? 'green' : difficulty === '中级' ? 'yellow' : 'red';
        return <Tag color={color}>{difficulty}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'published',
      key: 'published',
      render: (published: boolean) => (
        <Tag color={published ? 'green' : 'red'}>
          {published ? '已发布' : '草稿'}
        </Tag>
      ),
    },
    {
      title: '浏览量',
      dataIndex: 'views',
      key: 'views',
      render: (views: number) => <Tag color="blue">{views}</Tag>,
    },
    {
      title: '点赞数',
      dataIndex: 'likes',
      key: 'likes',
      render: (likes: number) => <Tag color="red">{likes}</Tag>,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('zh-CN'),
    },
  ];

  return (
    <div className="p-6">
      {/* 顶部导航 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <DatabaseOutlined className="mr-3" />
          数据库管理演示
        </h1>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchDatabaseInfo}
            loading={loading}
          >
            刷新
          </Button>
        </Space>
      </div>

      {/* 标签页导航 */}
      <div className="mb-6">
        <Space size="large">
          <Button 
            type={activeTab === 'info' ? 'primary' : 'default'}
            icon={<DatabaseOutlined />}
            onClick={() => setActiveTab('info')}
          >
            数据库信息
          </Button>
          <Button 
            type={activeTab === 'users' ? 'primary' : 'default'}
            icon={<UserOutlined />}
            onClick={() => setActiveTab('users')}
          >
            用户管理
          </Button>
          <Button 
            type={activeTab === 'posts' ? 'primary' : 'default'}
            icon={<FileTextOutlined />}
            onClick={() => setActiveTab('posts')}
          >
            文章管理
          </Button>
        </Space>
      </div>

      {/* 数据库信息标签页内容 */}
      {activeTab === 'info' && (
        <>
          {/* 统计信息卡片 */}
          <Card title="数据统计" className="mb-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{data.statistics.userCount || 0}</div>
                <div className="text-gray-600">用户总数</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{data.statistics.postCount || 0}</div>
                <div className="text-gray-600">文章总数</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{data.statistics.commentCount || 0}</div>
                <div className="text-gray-600">评论总数</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{data.statistics.userTables}</div>
                <div className="text-gray-600">用户表数量</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{data.statistics.totalTables}</div>
                <div className="text-gray-600">总表数量</div>
              </div>
            </div>
          </Card>

          {/* 基础信息卡片 */}
          <Card title="数据库基础信息" className="mb-6">
        <div className="space-y-4">
          {/* 数据库名称 */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <span className="text-gray-600 text-base font-medium">数据库名称:</span>
              <Text className="ml-3 text-lg font-semibold text-blue-600">{data.database.name}</Text>
            </div>
            <Button
              icon={<CopyOutlined />}
              size="small"
              onClick={() => copyToClipboard(data.database.name, '数据库名称')}
            />
          </div>

          {/* PostgreSQL版本 */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <span className="text-gray-600 text-base font-medium">PostgreSQL版本:</span>
              <Text className="ml-3 text-lg font-semibold text-green-600">
                {data.database.version}
              </Text>
            </div>
            <Button
              icon={<CopyOutlined />}
              size="small"
              onClick={() => copyToClipboard(data.database.version, 'PostgreSQL版本')}
            />
          </div>

          {/* 数据库大小 */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <span className="text-gray-600 text-base font-medium">数据库大小:</span>
              <Text className="ml-3 text-lg font-semibold text-purple-600">
                {data.database.size}
              </Text>
            </div>
            <Button
              icon={<CopyOutlined />}
              size="small"
              onClick={() => copyToClipboard(data.database.size, '数据库大小')}
            />
          </div>

          {/* 当前用户 */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <span className="text-gray-600 text-base font-medium">当前用户:</span>
              <Text className="ml-3 text-lg font-semibold text-orange-600">
                {data.database.currentUser}
              </Text>
            </div>
            <Button
              icon={<CopyOutlined />}
              size="small"
              onClick={() => copyToClipboard(data.database.currentUser, '当前用户')}
            />
          </div>

          {/* 用户表数量 */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <span className="text-gray-600 text-base font-medium">用户表数量:</span>
              <Text className="ml-3 text-lg font-semibold text-red-600">
                {data.statistics.userTables}
              </Text>
            </div>
            <Button
              icon={<CopyOutlined />}
              size="small"
              onClick={() => copyToClipboard(data.statistics.userTables.toString(), '用户表数量')}
            />
          </div>
        </div>
      </Card>

      {/* 系统环境信息 */}
      <Card title="系统环境信息" className="mb-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <span className="text-gray-600 text-base font-medium">Node.js版本:</span>
              <Text className="ml-3 text-lg font-semibold">{data.environment.nodeVersion}</Text>
            </div>
            <Button
              icon={<CopyOutlined />}
              size="small"
              onClick={() => copyToClipboard(data.environment.nodeVersion, 'Node.js版本')}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <span className="text-gray-600 text-base font-medium">运行平台:</span>
              <Text className="ml-3 text-lg font-semibold">{data.environment.platform}</Text>
            </div>
            <Button
              icon={<CopyOutlined />}
              size="small"
              onClick={() => copyToClipboard(data.environment.platform, '运行平台')}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <span className="text-gray-600 text-base font-medium">环境类型:</span>
              <Text
                className={`ml-3 text-lg font-semibold ${data.environment.isDevelopment ? 'text-red-600' : 'text-green-600'}`}
              >
                {data.environment.isDevelopment ? '开发环境' : '生产环境'}
              </Text>
            </div>
            <Button
              icon={<CopyOutlined />}
              size="small"
              onClick={() =>
                copyToClipboard(
                  data.environment.isDevelopment ? '开发环境' : '生产环境',
                  '环境类型'
                )
              }
            />
          </div>
        </div>
      </Card>

      {/* 详细版本信息 */}
      <Card title="详细版本信息">
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <span className="text-gray-600 text-base font-medium">完整版本信息:</span>
              <Button
                icon={<CopyOutlined />}
                size="small"
                onClick={() => copyToClipboard(data.database.fullVersion, '完整版本信息')}
              />
            </div>
            <pre className="text-sm text-gray-800 whitespace-pre-wrap break-all">
              {data.database.fullVersion}
            </pre>
          </div>

          <div className="text-sm text-gray-500 text-center">
            查询时间: {new Date(data.queriedAt).toLocaleString('zh-CN')}
          </div>
        </div>
      </Card>
        </>
      )}

      {/* 用户管理标签页内容 */}
      {activeTab === 'users' && (
        <Card 
          title="用户管理" 
          extra={
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingUser(null);
                form.resetFields();
                setUserModalVisible(true);
              }}
            >
              新增用户
            </Button>
          }
        >
          <Table 
            columns={userColumns}
            dataSource={users}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
            }}
            scroll={{ x: 800 }}
          />
        </Card>
      )}

      {/* 文章管理标签页内容 */}
      {activeTab === 'posts' && (
        <Card 
          title="文章管理" 
          extra={
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingPost(null);
                postForm.resetFields();
                setPostModalVisible(true);
              }}
              disabled={users.length === 0}
            >
              新增文章
            </Button>
          }
        >
          {users.length === 0 ? (
            <Alert 
              message="请先创建用户" 
              description="需要先有用户才能创建文章"
              type="warning" 
              showIcon 
              className="mb-4"
            />
          ) : null}
          <Table 
            columns={postColumns}
            dataSource={posts}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
            }}
            scroll={{ x: 1200 }}
          />
        </Card>
      )}

      {/* 用户新增/编辑模态框 */}
      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
        open={userModalVisible}
        onCancel={() => {
          setUserModalVisible(false);
          setEditingUser(null);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateUser}
          preserve={false}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' },
              { max: 20, message: '用户名最多20个字符' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线' }
            ]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          
          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              label="密码"
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6个字符' }
              ]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          )}

          <Form.Item
            label="头像URL"
            name="avatar"
          >
            <Input placeholder="请输入头像URL（可选）" />
          </Form.Item>

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button 
                onClick={() => {
                  setUserModalVisible(false);
                  setEditingUser(null);
                  form.resetFields();
                }}
              >
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                {editingUser ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 文章新增/编辑模态框 */}
      <Modal
        title={editingPost ? '编辑文章' : '新增文章'}
        open={postModalVisible}
        onCancel={() => {
          setPostModalVisible(false);
          setEditingPost(null);
          postForm.resetFields();
        }}
        footer={null}
        destroyOnClose
        width={800}
      >
        <Form
          form={postForm}
          layout="vertical"
          onFinish={handleCreatePost}
          preserve={false}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[
              { required: true, message: '请输入文章标题' },
              { max: 100, message: '标题最多100个字符' }
            ]}
          >
            <Input placeholder="请输入文章标题" />
          </Form.Item>
          
          <Form.Item
            label="内容"
            name="content"
            rules={[
              { required: true, message: '请输入文章内容' },
              { min: 10, message: '内容至少10个字符' }
            ]}
          >
            <Input.TextArea 
              rows={6}
              placeholder="请输入文章内容"
              showCount
              maxLength={2000}
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="分类"
              name="category"
              rules={[{ required: true, message: '请选择分类' }]}
            >
              <Select placeholder="请选择分类">
                <Select.Option value="技术">技术</Select.Option>
                <Select.Option value="生活">生活</Select.Option>
                <Select.Option value="学习">学习</Select.Option>
                <Select.Option value="其他">其他</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="难度"
              name="difficulty"
              rules={[{ required: true, message: '请选择难度' }]}
            >
              <Select placeholder="请选择难度">
                <Select.Option value="初级">初级</Select.Option>
                <Select.Option value="中级">中级</Select.Option>
                <Select.Option value="高级">高级</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            label="标签"
            name="tags"
            help="多个标签用逗号分隔"
          >
            <Input placeholder="例如：React,Next.js,TypeScript" />
          </Form.Item>

          <Form.Item
            label="封面图片URL"
            name="coverImage"
          >
            <Input placeholder="请输入封面图片URL（可选）" />
          </Form.Item>

          <Form.Item
            label="发布状态"
            name="published"
            initialValue={false}
          >
            <Select>
              <Select.Option value={false}>草稿</Select.Option>
              <Select.Option value={true}>发布</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button 
                onClick={() => {
                  setPostModalVisible(false);
                  setEditingPost(null);
                  postForm.resetFields();
                }}
              >
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                {editingPost ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
