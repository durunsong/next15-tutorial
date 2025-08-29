'use client';

import { useEffect, useRef } from 'react';

const WIDGET_SRC = 'https://unpkg.com/live2d-widget@3.1.4/lib/L2Dwidget.min.js';
const MODEL = 'https://unpkg.com/live2d-widget-model-shizuku/assets/shizuku.model.json';

export default function IsolatedLive2D() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const onLoad = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;
      doc.open();
      doc.write(`<!doctype html><html><head><meta charset="utf-8"/></head>
        <body style="margin:0;overflow:hidden;">
          <script src="${WIDGET_SRC}"></script>
          <script>
            window.addEventListener('load', function(){
              if (window.L2Dwidget && window.L2Dwidget.init) {
                window.L2Dwidget.init({
                  model: { jsonPath: '${MODEL}' },
                  display: { position: 'right', width: 200, height: 300, hOffset: 0, vOffset: 0 },
                  mobile: { show: true },
                  react: { opacityDefault: 1, opacityOnHover: 1 },
                });
              }
            });
          <\/script>
        </body></html>`);
      doc.close();
    };

    iframe.addEventListener('load', onLoad);
    // ensure content doc is ready
    if (iframe.contentDocument?.readyState === 'complete') onLoad();

    return () => {
      iframe.removeEventListener('load', onLoad);
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      style={{
        position: 'fixed',
        right: 0,
        bottom: 0,
        width: 220,
        height: 320,
        border: 'none',
        zIndex: 10000,
        pointerEvents: 'none',
      }}
      aria-hidden
      tabIndex={-1}
    />
  );
}
