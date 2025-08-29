'use client';

import { Button, Card, Space, Typography } from 'antd';

import { useEffect, useState } from 'react';

import { Live2DUtils } from '@/utils/live2d.utils';

const { Title, Paragraph, Text } = Typography;

export default function Live2DDemo() {
  const [isLive2DReady, setIsLive2DReady] = useState(false);

  useEffect(() => {
    // 检查Live2D是否准备就绪
    const checkLive2D = () => {
      if (Live2DUtils.isInitialized()) {
        setIsLive2DReady(true);
      } else {
        setTimeout(checkLive2D, 1000);
      }
    };
    checkLive2D();
  }, []);

  const handleShowMessage = () => {
    Live2DUtils.showMessage('这是一条自定义消息！🎉', 3000);
  };

  const handleSwitchModel = () => {
    Live2DUtils.switchToNextModel();
  };

  const handleHide = () => {
    Live2DUtils.hide();
  };

  const handleShow = () => {
    Live2DUtils.show();
  };

  const handleTimeGreeting = () => {
    Live2DUtils.showTimeBasedGreeting();
  };

  const handleEncouragement = () => {
    Live2DUtils.showEncouragement();
  };

  const handleStudyTip = () => {
    Live2DUtils.showStudyTip();
  };

  const handleMiniGame = () => {
    Live2DUtils.startMiniGame();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8 shadow-lg">
          <Title level={1} className="text-center mb-6">
            🌟 Live2D 看板娘演示 🌟
          </Title>
          <Paragraph className="text-center text-lg mb-8">
            欢迎来到 Live2D 看板娘演示页面！在这里你可以体验各种有趣的互动功能。
            <br />
            <Text type="secondary">
              看板娘会出现在页面右侧，你可以点击她进行互动，也可以右键查看更多功能菜单。
            </Text>
          </Paragraph>

          <div className="text-center mb-6">
            <Text type={isLive2DReady ? 'success' : 'warning'} className="text-lg font-medium">
              Live2D 状态: {isLive2DReady ? '✅ 已就绪' : '⏳ 加载中...'}
            </Text>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card title="💬 消息互动" className="shadow-md hover:shadow-lg transition-shadow">
            <Space direction="vertical" className="w-full">
              <Button
                type="primary"
                onClick={handleShowMessage}
                disabled={!isLive2DReady}
                className="w-full"
              >
                显示自定义消息
              </Button>
              <Button onClick={handleTimeGreeting} disabled={!isLive2DReady} className="w-full">
                时间问候
              </Button>
              <Button onClick={handleEncouragement} disabled={!isLive2DReady} className="w-full">
                加油鼓励
              </Button>
            </Space>
          </Card>

          <Card title="🎭 角色控制" className="shadow-md hover:shadow-lg transition-shadow">
            <Space direction="vertical" className="w-full">
              <Button
                type="primary"
                onClick={handleSwitchModel}
                disabled={!isLive2DReady}
                className="w-full"
              >
                切换角色
              </Button>
              <Button onClick={handleHide} disabled={!isLive2DReady} className="w-full">
                隐藏看板娘
              </Button>
              <Button onClick={handleShow} disabled={!isLive2DReady} className="w-full">
                显示看板娘
              </Button>
            </Space>
          </Card>

          <Card title="🎮 娱乐功能" className="shadow-md hover:shadow-lg transition-shadow">
            <Space direction="vertical" className="w-full">
              <Button
                type="primary"
                onClick={handleStudyTip}
                disabled={!isLive2DReady}
                className="w-full"
              >
                学习小贴士
              </Button>
              <Button onClick={handleMiniGame} disabled={!isLive2DReady} className="w-full">
                开始小游戏
              </Button>
            </Space>
          </Card>
        </div>

        <Card className="mt-8 shadow-lg">
          <Title level={3}>🎯 使用说明</Title>
          <div className="space-y-4">
            <div>
              <Text strong>📱 基础交互：</Text>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>点击看板娘：触发随机互动消息</li>
                <li>鼠标悬停：鼠标指针会变成手型</li>
                <li>右键菜单：访问完整功能菜单</li>
              </ul>
            </div>

            <div>
              <Text strong>🔧 高级功能：</Text>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>多角色切换：体验不同的Live2D模型</li>
                <li>智能提示：根据时间显示不同问候语</li>
                <li>学习助手：提供学习建议和鼓励</li>
                <li>小游戏：简单有趣的互动游戏</li>
              </ul>
            </div>

            <div>
              <Text strong>⚡ 页面功能：</Text>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>路由监听：切换页面时会显示提示</li>
                <li>页面可见性：标签页切换时的欢迎消息</li>
                <li>自动闲置提示：定时显示有趣的消息</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="mt-8 shadow-lg">
          <Title level={3}>🛠️ 技术特性</Title>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Text strong className="text-blue-600">
                前端技术栈：
              </Text>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-700">
                <li>Next.js 15 - 现代化React框架</li>
                <li>TypeScript - 类型安全</li>
                <li>Tailwind CSS - 实用样式框架</li>
                <li>Ant Design - UI组件库</li>
              </ul>
            </div>

            <div>
              <Text strong className="text-purple-600">
                Live2D技术：
              </Text>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-700">
                <li>oh-my-live2d - 现代化Live2D库</li>
                <li>PIXI.js - WebGL渲染引擎</li>
                <li>响应式设计 - 移动端适配</li>
                <li>性能优化 - 按需加载</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
