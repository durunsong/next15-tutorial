'use client';

import { UpOutlined } from '@ant-design/icons';
import { FloatButton, Tooltip } from 'antd';

import { useEffect, useState } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  };

  if (!visible) return null;

  return (
    <Tooltip title="回到顶部">
      <FloatButton
        onClick={scrollToTop}
        icon={<UpOutlined />}
        type="primary"
        shape="circle"
        style={{ right: 24, bottom: 124, width: 50, height: 50 }}
      />
    </Tooltip>
  );
}
