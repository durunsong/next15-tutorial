import { Button, Result } from 'antd';

import Link from 'next/link';

/**
 * 自定义404页面
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Result
        status="404"
        title="404"
        subTitle="抱歉，您访问的页面不存在。"
        extra={
          <Link href="/">
            <Button type="primary" size="large">
              返回首页
            </Button>
          </Link>
        }
      />
    </div>
  );
}
