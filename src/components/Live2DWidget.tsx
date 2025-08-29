'use client';

import { useEffect, useRef } from 'react';

import { live2dConfig } from '@/config/live2d.config';

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
  parentElement = typeof document !== 'undefined' ? document.body : undefined,
  importType = live2dConfig.importType,
}) => {
  const scriptLoaded = useRef(false);
  const widgetInitialized = useRef(false);

  useEffect(() => {
    const loadLive2D = async () => {
      if (scriptLoaded.current && widgetInitialized.current) return;
      
      // 检查是否在浏览器环境
      if (typeof window === 'undefined') return;

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
                ? (typeof document !== 'undefined' ? (document.querySelector(parentElement) as HTMLElement) || undefined : undefined)
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
          if (oml2d && (oml2d as any).pixiStage) {
            // 点击交互
            (oml2d as any).pixiStage.on('pointertap', () => {
              const clickTips = (live2dConfig.tips as any).clickTips || [];
              const randomTip = clickTips[Math.floor(Math.random() * clickTips.length)];
              oml2d.tipsMessage(randomTip, 3000, 3);
            });

            // 鼠标悬停交互
            (oml2d as any).pixiStage.on('pointerover', () => {
              if ((oml2d as any).pixiApp && (oml2d as any).pixiApp.stage) {
                (oml2d as any).pixiApp.stage.cursor = 'pointer';
              }
            });

            (oml2d as any).pixiStage.on('pointerout', () => {
              if ((oml2d as any).pixiApp && (oml2d as any).pixiApp.stage) {
                (oml2d as any).pixiApp.stage.cursor = 'default';
              }
            });
          }

          // 添加欢迎提示
          if (sayHello && (live2dConfig.tips as any).welcomeTips) {
            setTimeout(() => {
              const welcomeTips = (live2dConfig.tips as any).welcomeTips || [];
              const randomWelcome = welcomeTips[Math.floor(Math.random() * welcomeTips.length)];
              oml2d.tipsMessage(randomWelcome, 4000, 3);
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
            const routeTips = (live2dConfig.tips as any).routeTips || [];
            if (routeTips.length > 0) {
              const randomRouteTip = routeTips[Math.floor(Math.random() * routeTips.length)];
              setTimeout(() => {
                window.OML2D.tipsMessage(randomRouteTip, 3000, 3);
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
      if (typeof document !== 'undefined' && !document.hidden && window.OML2D && widgetInitialized.current) {
        setTimeout(() => {
          try {
            window.OML2D.stageSlideUp();
            window.OML2D.tipsMessage('欢迎回来！我在这里等你呢～ 💖', 3000, 3);
          } catch (error) {
            console.error('Failed to handle visibility change for Live2D:', error);
          }
        }, 500);
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('popstate', handleRouteChange);
      }
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
    };
  }, []);

  return null; // 这个组件不渲染任何DOM，Live2D会直接添加到body
};

export default Live2DWidget;
