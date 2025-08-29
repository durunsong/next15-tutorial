// Live2D 配置文件
export const live2dConfig = {
  // 模型配置
  models: [
    {
      path: 'https://model.oml2d.com/HK416-1-normal/model.json',
      scale: 0.08,
      position: [0, 50] as [number, number],
      stageStyle: {
        width: 350,
        height: 350,
      },
    },
    {
      path: 'https://model.oml2d.com/Cat-black/model.json',
      scale: 0.1,
      position: [0, 50] as [number, number],
      stageStyle: {
        width: 350,
        height: 350,
      },
    },
    {
      path: 'https://model.oml2d.com/Pio/model.json',
      scale: 0.12,
      position: [0, 50] as [number, number],
      stageStyle: {
        width: 350,
        height: 350,
      },
    },
  ],

  // 提示消息配置
  tips: {
    messagebox: {
      enable: true,
      style: {
        width: '280px',
        height: 'auto',
        fontSize: '14px',
        color: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        padding: '12px 16px',
        wordWrap: 'break-word',
        fontWeight: '400',
        textAlign: 'center',
        animation: 'fadeInUp 0.3s ease-in-out',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
      },
    },
    idleTips: {
      interval: 20000, // 20秒显示一次闲置提示
      message: [
        '嗨！我是你的专属助手小可爱～ ✨',
        '今天学习得怎么样呀？要劳逸结合哦！🎯',
        '记得要多喝水，保护好眼睛哦！👀',
        '有什么问题随时来找我呀～ 💕',
        '点击我可以和我互动哦！👆',
        '学习累了记得休息一下～ 😴',
        '你在看什么有趣的内容呢？🤔',
        '我在这里陪着你呢！不要孤单～ 🌟',
        '加油！你是最棒的！💪',
        '今天又是充满希望的一天！☀️',
        '要不要听听我唱歌？🎵',
        '我觉得你今天特别好看呢！✨',
      ],
    },
    // 点击交互提示
    clickTips: [
      '嘿！你戳我干嘛？😄',
      '咯咯咯～好痒！🤭',
      '不要戳我啦！我会害羞的～ 😊',
      '我在这里呢～有什么事吗？👋',
      '你想和我玩吗？🎈',
      '诶？你发现了什么好玩的吗？🔍',
      '要抱抱吗？🤗',
      '你的手好温暖呢～ 💝',
      '我也想摸摸你！但是我摸不到... 😅',
      '再点一下试试？🎯',
    ],
    // 欢迎提示
    welcomeTips: [
      '欢迎来到这个神奇的地方！🎊',
      '很高兴见到你！我是你的小助手～ 💖',
      '今天心情怎么样？开心吗？😊',
      '准备好一起学习了吗？💪',
    ],
    // 页面切换提示
    routeTips: [
      '我们要去哪里呢？🚀',
      '新的冒险开始了！✨',
      '这个页面看起来很有趣～ 👀',
      '我会一直陪着你的！💕',
    ],
  },

  // 菜单配置
  menus: {
    items: [
      {
        id: 'switch',
        icon: '🔄',
        title: '切换角色',
        onClick: () => {
          if (window.OML2D) {
            window.OML2D.loadNextModel();
            setTimeout(() => {
              const switchTips = [
                '换个新形象！怎么样？👗',
                '这个造型你喜欢吗？✨',
                '我有好多种样子哦！🎭',
                '哪个形象是你的最爱呢？💖',
              ];
              const randomTip = switchTips[Math.floor(Math.random() * switchTips.length)];
              window.OML2D.tipsMessage(randomTip, 3000);
            }, 1000);
          }
        },
      },
      {
        id: 'encourage',
        icon: '💪',
        title: '加油鼓励',
        onClick: () => {
          if (window.OML2D) {
            // 动态导入工具函数
            import('@/utils/live2d.utils').then(({ Live2DUtils }) => {
              Live2DUtils.showEncouragement();
            });
          }
        },
      },
      {
        id: 'study-tip',
        icon: '📚',
        title: '学习提示',
        onClick: () => {
          if (window.OML2D) {
            import('@/utils/live2d.utils').then(({ Live2DUtils }) => {
              Live2DUtils.showStudyTip();
            });
          }
        },
      },
      {
        id: 'game',
        icon: '🎮',
        title: '小游戏',
        onClick: () => {
          if (window.OML2D) {
            import('@/utils/live2d.utils').then(({ Live2DUtils }) => {
              Live2DUtils.startMiniGame();
            });
          }
        },
      },
      {
        id: 'photo',
        icon: '📸',
        title: '拍照留念',
        onClick: () => {
          if (window.OML2D) {
            window.OML2D.tipsMessage('准备拍照啦！茄子～ 📸', 2000);
            setTimeout(() => {
              window.OML2D.stageSlideDown();
              setTimeout(() => {
                window.OML2D.stageSlideUp();
                window.OML2D.tipsMessage('拍照完成！是不是很可爱？😄', 3000);
              }, 2000);
            }, 1000);
          }
        },
      },
      {
        id: 'info',
        icon: 'ℹ️',
        title: '关于我',
        onClick: () => {
          if (window.OML2D) {
            window.OML2D.tipsMessage(
              '我是基于 Live2D 技术的虚拟助手，使用 oh-my-live2d 库开发～ 💻\n点击我可以互动，右键菜单有更多功能哦！',
              6000
            );
          }
        },
      },
      {
        id: 'close',
        icon: '👋',
        title: '再见',
        onClick: () => {
          if (window.OML2D) {
            window.OML2D.tipsMessage('再见啦！记得想我哦～ 👋', 2000);
            setTimeout(() => {
              window.OML2D.stageSlideDown();
              setTimeout(() => {
                window.OML2D.destroy();
              }, 1000);
            }, 2000);
          }
        },
      },
    ],
  },

  // 主题配置
  primaryColor: '#38bdf8',
  sayHello: true,
  transitionTime: 1000,
  dockedPosition: 'right' as const,
  importType: 'complete' as const,

  // 高级配置
  statusBar: {
    enable: true,
    styles: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderRadius: '8px',
      padding: '4px 8px',
      fontSize: '12px',
      color: '#fff',
    },
  },

  // 响应式配置
  mobileDisplay: true,
  mobileScale: 0.6,

  // 性能配置
  motionPreloadStrategy: 'IDLE' as const,
};

export type Live2DConfig = typeof live2dConfig;
