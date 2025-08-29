'use client';

import { useEffect, useRef } from 'react';

import { live2dConfig } from '@/config/live2d.config';

declare global {
  interface Window {
    OML2D?: any;
  }
}

interface Live2DWidgetProps {
  models?: Array<{
    path: string;
    scale?: number;
    position?: [number, number];
    stageStyle?: {
      width?: number;
      height?: number;
    };
  }>;
  tips?: {
    messagebox?: {
      enable?: boolean;
      style?: Record<string, string>;
    };
    idleTips?: {
      interval?: number;
      message?: string[];
    };
  };
  menus?: {
    items?: Array<{
      id: string;
      icon: string;
      title: string;
      onClick?: () => void;
    }>;
  };
  primaryColor?: string;
  sayHello?: boolean;
  transitionTime?: number;
  parentElement?: string;
  importType?: 'complete' | 'cubism2' | 'cubism5';
}

const Live2DWidget: React.FC<Live2DWidgetProps> = ({
  models = live2dConfig.models,
  tips = live2dConfig.tips,
  menus = live2dConfig.menus,
  primaryColor = live2dConfig.primaryColor,
  sayHello = live2dConfig.sayHello,
  transitionTime = live2dConfig.transitionTime,
  parentElement = document.body,
  importType = live2dConfig.importType,
}) => {
  const scriptLoaded = useRef(false);
  const widgetInitialized = useRef(false);

  useEffect(() => {
    const loadLive2D = async () => {
      if (scriptLoaded.current && widgetInitialized.current) return;

      try {
        // 动态导入oh-my-live2d
        const { loadOml2d } = await import('oh-my-live2d');

        if (!widgetInitialized.current) {
          // 初始化Live2D
          const oml2d = await loadOml2d({
            models,
            tips,
            menus,
            primaryColor,
            sayHello,
            transitionTime,
            parentElement:
              typeof parentElement === 'string'
                ? document.querySelector(parentElement)
                : parentElement,
            importType,
            dockedPosition: live2dConfig.dockedPosition,
            statusBar: live2dConfig.statusBar,
            mobileDisplay: live2dConfig.mobileDisplay,
          });

          // 将实例绑定到window对象以便在其他地方访问
          window.OML2D = oml2d;
          widgetInitialized.current = true;

          // 添加自定义交互功能
          if (oml2d && oml2d.pixiStage) {
            // 点击交互
            oml2d.pixiStage.on('pointertap', () => {
              const clickTips = live2dConfig.tips.clickTips || [];
              const randomTip = clickTips[Math.floor(Math.random() * clickTips.length)];
              oml2d.tipsMessage(randomTip, 3000);
            });

            // 鼠标悬停交互
            oml2d.pixiStage.on('pointerover', () => {
              if (oml2d.pixiApp && oml2d.pixiApp.stage) {
                oml2d.pixiApp.stage.cursor = 'pointer';
              }
            });

            oml2d.pixiStage.on('pointerout', () => {
              if (oml2d.pixiApp && oml2d.pixiApp.stage) {
                oml2d.pixiApp.stage.cursor = 'default';
              }
            });
          }

          // 添加欢迎提示
          if (sayHello && live2dConfig.tips.welcomeTips) {
            setTimeout(() => {
              const welcomeTips = live2dConfig.tips.welcomeTips || [];
              const randomWelcome = welcomeTips[Math.floor(Math.random() * welcomeTips.length)];
              oml2d.tipsMessage(randomWelcome, 4000);
            }, 2000);
          }
        }
      } catch (error) {
        console.error('Failed to load Live2D:', error);
      }
    };

    loadLive2D();

    // 清理函数
    return () => {
      if (window.OML2D && widgetInitialized.current) {
        try {
          window.OML2D.destroy();
          window.OML2D = undefined;
          widgetInitialized.current = false;
        } catch (error) {
          console.error('Failed to destroy Live2D:', error);
        }
      }
    };
  }, []);

  // 监听页面路由变化，添加路由提示
  useEffect(() => {
    const handleRouteChange = () => {
      setTimeout(() => {
        if (window.OML2D && widgetInitialized.current) {
          try {
            // 确保Live2D显示
            window.OML2D.stageSlideUp();

            // 显示路由变化提示
            const routeTips = live2dConfig.tips.routeTips || [];
            if (routeTips.length > 0) {
              const randomRouteTip = routeTips[Math.floor(Math.random() * routeTips.length)];
              setTimeout(() => {
                window.OML2D.tipsMessage(randomRouteTip, 3000);
              }, 500);
            }
          } catch (error) {
            console.error('Failed to handle route change for Live2D:', error);
          }
        }
      }, 100);
    };

    // 监听浏览器历史记录变化
    window.addEventListener('popstate', handleRouteChange);

    // 监听页面可见性变化
    const handleVisibilityChange = () => {
      if (!document.hidden && window.OML2D && widgetInitialized.current) {
        setTimeout(() => {
          try {
            window.OML2D.stageSlideUp();
            window.OML2D.tipsMessage('欢迎回来！我在这里等你呢～ 💖', 3000);
          } catch (error) {
            console.error('Failed to handle visibility change for Live2D:', error);
          }
        }, 500);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null; // 这个组件不渲染任何DOM，Live2D会直接添加到body
};

export default Live2DWidget;
