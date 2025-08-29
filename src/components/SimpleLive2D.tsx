'use client';

import { useEffect } from 'react';

import { live2dManager } from '@/utils/live2d.manager';

declare global {
  interface Window {
    L2Dwidget?: any;
    __L2D_WIDGET_INITED?: boolean;
    __L2D_WIDGET_LOADING?: boolean;
  }
}

const L2D_CDN = 'https://unpkg.com/live2d-widget@3.1.4/lib/L2Dwidget.min.js';
const DEFAULT_MODEL = 'https://unpkg.com/live2d-widget-model-shizuku/assets/shizuku.model.json';

export default function SimpleLive2D() {
  useEffect(() => {
    let scriptEl: HTMLScriptElement | null = null;
    let removed = false;

    const ensureWidget = () => {
      if (removed) return;
      if (typeof window === 'undefined') return;
      if (window.__L2D_WIDGET_INITED) return;
      if (window.L2Dwidget && typeof window.L2Dwidget.init === 'function') {
        try {
          // 初始化并交给 manager 管理
          live2dManager.init({
            modelPaths: [
              DEFAULT_MODEL,
              'https://unpkg.com/live2d-widget-model-hijiki/assets/hijiki.model.json',
              'https://unpkg.com/live2d-widget-model-koharu/assets/koharu.model.json',
            ],
            width: 200,
            height: 300,
            position: 'right',
            hOffset: 10,
            vOffset: -10,
            idleTips: ['要多喝水哦～', '记得活动一下筋骨～', '学习累了可以休息一会儿~'],
            routeTips: ['我们切到新页面啦～', '新的内容来了～'],
          });
          window.__L2D_WIDGET_INITED = true;
        } catch (e) {
          console.error('L2Dwidget init failed', e);
        }
        return;
      }
    };

    if (typeof window !== 'undefined' && !window.L2Dwidget) {
      const existing = document.querySelector(
        'script[data-l2d-widget="1"]'
      ) as HTMLScriptElement | null;
      if (!existing) {
        scriptEl = document.createElement('script');
        scriptEl.src = L2D_CDN;
        scriptEl.async = true;
        scriptEl.setAttribute('data-l2d-widget', '1');
        scriptEl.onload = ensureWidget;
        document.body.appendChild(scriptEl);
      } else {
        ensureWidget();
      }
    } else {
      ensureWidget();
    }

    return () => {
      removed = true;
      // Avoid touching DOM in dev/HMR to prevent React parent null removals
    };
  }, []);

  return null;
}
