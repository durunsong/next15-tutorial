/**
 * 简单的客服按钮组件
 * 可以替代第三方客服组件
 */

'use client';

import { MessageOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

/**
 * 简单的客服按钮组件
 * 可以替代第三方客服组件
 */

/**
 * 简单的客服按钮组件
 * 可以替代第三方客服组件
 */

/**
 * 简单的客服按钮组件
 * 可以替代第三方客服组件
 */

/**
 * 简单的客服按钮组件
 * 可以替代第三方客服组件
 */

interface CustomerServiceButtonProps {
  className?: string;
  onClick?: () => void;
}

export function CustomerServiceButton({ className = '', onClick }: CustomerServiceButtonProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // 默认行为：跳转到客服页面或发送邮件
      window.location.href = '/customer-service';
    }
  };

  return (
    <Tooltip title="联系客服" placement="left">
      <Button
        type="primary"
        shape="circle"
        size="large"
        icon={<MessageOutlined />}
        onClick={handleClick}
        className={`fixed bottom-6 right-6 z-50 shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
        style={{
          width: '60px',
          height: '60px',
          fontSize: '20px',
        }}
      />
    </Tooltip>
  );
}
