'use client';

import { useEffect, useRef } from 'react';

// 确保类型声明生效
declare global {
  interface Window {
    live2d_settings?: any;
    loadlive2d?: (id: string, jsonPath: string, consolelog?: boolean) => void;
  }
}

const Live2DWidgetNew: React.FC = () => {
  const initialized = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initLive2D = async () => {
      if (initialized.current) return;
      if (typeof window === 'undefined') return;

      try {
        console.log('开始加载 live2d-widget...');

        // 动态导入 live2d-widget
        const live2dWidget = await import('live2d-widget');

        console.log('live2d-widget 导入成功');

        // 配置 Live2D 设置
        window.live2d_settings = {
          // 模型配置
          modelId: 1, // 模型ID，1-33
          modelTexturesId: 0, // 材质ID

          // 显示配置
          showToolMenu: true, // 显示工具菜单
          showF12Status: true, // 显示F12状态
          showF12Message: true, // 显示F12消息
          showLoadingMessage: true, // 显示加载消息
          showHitokoto: true, // 显示一言

          // 位置配置
          waifuSize: '280x250',
          waifuTipsSize: '250x70',
          waifuFontSize: '12px',
          waifuToolFont: '14px',
          waifuToolLine: '20px',
          waifuToolTop: '0px',
          waifuMinWidth: '768px',
          waifuEdgeSide: 'right:0',
          waifuDraggable: 'axis-x',
          waifuDraggableRevert: true,

          // 工具配置
          showHideButton: true,
          showSwitchTextureButton: true,
          showSwitchModelButton: true,
          showQRCodeButton: false,
          showCaptureButton: false,
          showInfoButton: true,

          // 消息配置
          messageTips: {
            console_open_msg: ['哈哈，你打开了控制台，是想要看看我的小秘密吗？'],
            copy_message: ['你都复制了些什么呀，转载要记得加上出处哦！'],
            screenshot_message: ['照好了嘛，是不是很可爱呢？'],
            hidden_message: ['我们还能再见面的吧…'],
            load_rand_textures: ['我的新衣服好看嘛？'],
            hour_tips: {
              't5-7': ['早上好！一日之计在于晨，美好的一天就要开始了。'],
              't7-11': ['上午好！工作顺利嘛，不要久坐，多起来走动走动哦！'],
              't11-13': ['中午了，工作了一个上午，现在是午餐时间！'],
              't13-17': ['午后很容易犯困呢，今天的运动目标完成了吗？'],
              't17-19': ['傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红～'],
              't19-21': ['晚上好，今天过得怎么样？'],
              't21-23': ['已经这么晚了呀，早点休息吧，晚安～'],
              't23-5': ['你是夜猫子呀？这么晚还不睡觉，明天起的来嘛？'],
            },
            events: [
              {
                selector: 'a[href^="http"]',
                text: ['要离开了吗？祝你一路顺风！'],
              },
              {
                selector: 'a[href^="mailto"]',
                text: ['邮件我会帮你发送的！'],
              },
            ],
          },
        };

        // 初始化 Live2D
        if (typeof window.loadlive2d === 'function') {
          window.loadlive2d(
            'live2d',
            'https://unpkg.com/live2d-widget-model-hijiki/assets/hijiki.model.json'
          );
        } else {
          // 如果直接调用不可用，尝试其他方式
          console.warn('loadlive2d function not available, trying alternative approach');
        }

        initialized.current = true;
        console.log('Live2D Widget 初始化完成');
      } catch (error) {
        console.error('Live2D Widget 初始化失败:', error);
      }
    };

    initLive2D();

    return () => {
      // 清理函数
      try {
        const live2dElement = document.getElementById('live2d');
        if (live2dElement) {
          live2dElement.remove();
        }
        initialized.current = false;
      } catch (error) {
        console.error('清理 Live2D 失败:', error);
      }
    };
  }, []);

  return (
    <>
      {/* Live2D 容器 */}
      <div
        id="live2d"
        ref={containerRef}
        style={{
          position: 'fixed',
          right: '0px',
          bottom: '0px',
          zIndex: 999,
          pointerEvents: 'none',
        }}
      />

      {/* 工具栏容器 */}
      <div
        id="live2d-toggle"
        style={{
          position: 'fixed',
          right: '0px',
          bottom: '280px',
          zIndex: 1000,
        }}
      />
    </>
  );
};

// Deprecated
export default function Live2DWidgetNew() {
  return null;
}
