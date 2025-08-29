'use client';

import { useEffect, useRef } from 'react';

const TestLive2D: React.FC = () => {
  const initialized = useRef(false);

  useEffect(() => {
    const initLive2D = async () => {
      if (initialized.current) return;
      if (typeof window === 'undefined') return;

      try {
        console.log('开始加载 oh-my-live2d...');

        // 动态导入
        const { loadOml2d } = await import('oh-my-live2d');

        console.log('成功导入 oh-my-live2d，开始初始化...');

        // 更强制的配置 - 确保Live2D能够显示
        const config = {
          models: [
            {
              path: 'https://model.oml2d.com/Pio/model.json', // 尝试一个更常用的模型
              scale: 0.1, // 增大缩放
              position: [-50, 0], // 调整位置
              stageStyle: {
                width: 400,
                height: 600,
              },
            },
          ],
          primaryColor: '#38bdf8',
          sayHello: true, // 启用欢迎消息
          transitionTime: 1000,
          importType: 'cubism2',
          parentElement: document.body,
          dockedPosition: 'right',
          // 强制显示设置
          statusBar: {
            enable: true,
          },
          tips: {
            messagebox: {
              enable: true,
            },
            welcomeTips: {
              enable: true,
              message: '看板娘加载成功！🎉',
            },
          },
        };

        console.log('配置对象:', config);

        const oml2d = await loadOml2d(config);

        console.log('Live2D 初始化成功!', oml2d);
        console.log('Live2D 对象方法:', Object.getOwnPropertyNames(oml2d));
        console.log(
          'Live2D 对象原型方法:',
          Object.getOwnPropertyNames(Object.getPrototypeOf(oml2d))
        );

        // 检查常用方法是否存在
        console.log('可用方法检查:');
        console.log('- stageSlideDown:', typeof oml2d.stageSlideDown);
        console.log('- stageSlideUp:', typeof oml2d.stageSlideUp);
        console.log('- hide:', typeof oml2d.hide);
        console.log('- show:', typeof oml2d.show);
        console.log('- loadNextModel:', typeof oml2d.loadNextModel);
        console.log('- tipsMessage:', typeof oml2d.tipsMessage);

        window.OML2D = oml2d;
        initialized.current = true;
      } catch (error) {
        console.error('Live2D 初始化失败:', error);
        console.error('错误堆栈:', error.stack);
      }
    };

    initLive2D();

    return () => {
      if (window.OML2D && initialized.current) {
        try {
          window.OML2D.destroy();
          window.OML2D = undefined;
          initialized.current = false;
        } catch (error) {
          console.error('清理 Live2D 失败:', error);
        }
      }
    };
  }, []);

  return <div>{/* 测试组件，查看控制台输出 */}</div>;
};

// Deprecated test component
export default function TestLive2D() {
  return <div />;
}
