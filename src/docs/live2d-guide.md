# Live2D 看板娘集成指南

## 🌟 概述

本项目成功集成了基于 `oh-my-live2d` 库的Live2D看板娘功能，为用户提供了一个可爱、互动的虚拟助手体验。

## 🎯 主要特性

### 💫 核心功能

- **多角色模型**: 支持多个Live2D角色，可随时切换
- **智能交互**: 点击、悬停等多种交互方式
- **动态提示**: 根据时间、页面、用户行为显示不同消息
- **右键菜单**: 完整的功能控制菜单

### 🎮 互动功能

- **时间问候**: 根据当前时间显示不同的问候语
- **学习助手**: 提供学习建议和鼓励消息
- **小游戏**: 内置简单有趣的互动游戏
- **拍照功能**: 模拟拍照效果
- **页面感知**: 监听路由变化和页面可见性

## 🏗️ 技术架构

### 📦 依赖包

```json
{
  "oh-my-live2d": "^0.19.3",
  "pixi.js": "^8.12.0"
}
```

### 🗂️ 文件结构

```
src/
├── components/
│   └── Live2DWidget.tsx          # Live2D主组件
├── config/
│   └── live2d.config.ts          # Live2D配置文件
├── utils/
│   └── live2d.utils.ts           # Live2D工具函数
└── app/
    └── live2d-demo/
        └── page.tsx               # 演示页面
```

## 🚀 快速开始

### 1. 基础集成

Live2D组件已经集成到主布局文件中，会在所有页面自动显示：

```tsx
// src/app/layout.tsx
import Live2DWidget from '@/components/Live2DWidget';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Live2DWidget />
      </body>
    </html>
  );
}
```

### 2. 自定义配置

通过修改 `src/config/live2d.config.ts` 来自定义Live2D行为：

```typescript
export const live2dConfig = {
  models: [
    // 添加你的模型配置
  ],
  tips: {
    // 自定义提示消息
  },
  menus: {
    // 自定义菜单项
  },
};
```

### 3. 程序化控制

使用工具函数进行程序化控制：

```typescript
import { Live2DUtils } from '@/utils/live2d.utils';

// 显示消息
Live2DUtils.showMessage('Hello!', 3000);

// 切换模型
Live2DUtils.switchToNextModel();

// 隐藏/显示
Live2DUtils.hide();
Live2DUtils.show();
```

## 🎨 自定义指南

### 添加新模型

1. 将模型文件放在 `public/live2d-models/` 目录下
2. 更新配置文件中的模型列表：

```typescript
models: [
  {
    path: '/live2d-models/your-model/model.json',
    scale: 0.08,
    position: [0, 50],
    stageStyle: {
      width: 350,
      height: 350,
    },
  },
];
```

### 自定义交互消息

在配置文件中修改各种消息类型：

```typescript
tips: {
  idleTips: {
    message: [
      '你的自定义闲置消息',
      // 更多消息...
    ]
  },
  clickTips: [
    '你的自定义点击消息',
    // 更多消息...
  ]
}
```

### 添加新的菜单功能

扩展右键菜单功能：

```typescript
menus: {
  items: [
    {
      id: 'custom-action',
      icon: '🎨',
      title: '自定义功能',
      onClick: () => {
        // 你的自定义逻辑
      },
    },
  ];
}
```

## 🎮 用户交互说明

### 基础交互

- **左键点击**: 触发随机互动消息
- **鼠标悬停**: 显示可交互状态
- **右键点击**: 打开功能菜单

### 菜单功能

- 🔄 **切换角色**: 切换到下一个Live2D模型
- 💪 **加油鼓励**: 显示励志消息
- 📚 **学习提示**: 提供学习建议
- 🎮 **小游戏**: 开始互动小游戏
- 📸 **拍照留念**: 模拟拍照效果
- ℹ️ **关于我**: 显示技术信息
- 👋 **再见**: 关闭Live2D

## 📱 响应式设计

Live2D组件已经适配移动端：

- 自动检测设备类型
- 移动端缩放适配
- 触摸交互支持

## ⚡ 性能优化

### 按需加载

- 使用动态导入减少初始包大小
- 模型资源延迟加载

### 内存管理

- 组件卸载时自动清理Live2D实例
- 页面切换时优化资源使用

## 🔧 开发建议

### 调试模式

在开发环境中，Live2D会输出详细的日志信息，便于调试。

### 错误处理

所有Live2D相关操作都包含了完善的错误处理，确保不会影响主应用的稳定性。

### 扩展开发

如需添加新功能，建议：

1. 在 `live2d.utils.ts` 中添加工具函数
2. 在配置文件中定义相关配置
3. 通过菜单或事件触发新功能

## 🎉 演示页面

访问 `/live2d-demo` 页面体验完整的Live2D功能演示。

## 🛠️ 故障排除

### 常见问题

1. **Live2D不显示**: 检查网络连接，确保模型资源可访问
2. **交互无响应**: 等待Live2D完全加载后再进行交互
3. **移动端显示异常**: 检查是否启用了移动端支持

### 调试信息

在浏览器控制台中查看Live2D相关的日志信息，有助于定位问题。

---

🎊 **享受与你的Live2D看板娘的互动吧！**
