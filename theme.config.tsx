const config = {
  // 网站logo和标题
  logo: (
    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-.613-.492-.332-.706.496-1.525.918-2.377 1.226-.326.118-.26.099-.474.165-.118.036-.98.044-1.324.012-.479-.044-.922-.142-1.479-.326-.851-.282-1.45-.64-2.11-1.264a8.964 8.964 0 0 1-2.304-3.18c-.25-.56-.43-1.12-.566-1.76-.118-.556-.133-.708-.133-1.371 0-.668.015-.82.133-1.376.415-1.964 1.34-3.646 2.924-5.327C6.466 3.295 8.717 1.983 11.572 0z" />
      </svg>
      <strong>Next.js 15 教程</strong>
    </span>
  ),

  // 项目链接
  project: {
    link: 'https://github.com/your-username/next15-tutorial',
  },

  // 聊天链接（可选）
  chat: {
    link: 'https://discord.gg/your-discord',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0190 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9460 2.4189-2.1568 2.4189Z" />
      </svg>
    ),
  },

  // 自定义顶部导航
  navbar: {
    extraContent: (
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <a
          href="/database"
          style={{
            padding: '6px 12px',
            backgroundColor: '#0070f3',
            color: 'white',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '14px',
          }}
        >
          数据库演示
        </a>
        <a
          href="/redis-test"
          style={{
            padding: '6px 12px',
            backgroundColor: '#ff4757',
            color: 'white',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '14px',
          }}
        >
          Redis 测试
        </a>
      </div>
    ),
  },

  // 文档仓库设置
  docsRepositoryBase: 'https://github.com/your-username/next15-tutorial/tree/main',

  // 页脚配置
  footer: {
    text: (
      <span>
        MIT {new Date().getFullYear()} ©{' '}
        <a href="https://github.com/your-username" target="_blank">
          Next.js 15 教程项目
        </a>
        .
      </span>
    ),
  },

  // 搜索配置
  search: {
    placeholder: '搜索文档...',
  },

  // 头部配置
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Next.js 15 教程" />
      <meta
        property="og:description"
        content="完整的Next.js 15全栈开发教程，包含数据库、Redis、OSS等实战演示"
      />
      <link rel="icon" href="/favicon.ico" />
    </>
  ),

  // 使用暗色主题
  darkMode: true,

  // 编辑链接
  editLink: {
    text: '在 GitHub 上编辑此页 →',
  },

  // 反馈链接
  feedback: {
    content: '有问题？给我们反馈 →',
    labels: 'feedback',
  },

  // 侧边栏配置
  sidebar: {
    titleComponent({ title, type }: { title: string; type: string }) {
      if (type === 'separator') {
        return <div style={{ background: 'red', textAlign: 'center' }}>{title}</div>;
      }
      return <>{title}</>;
    },
    defaultMenuCollapseLevel: 1,
    autoCollapse: true,
  },

  // 目录配置
  toc: {
    title: '页面目录',
    backToTop: true,
  },

  // 上一页/下一页导航
  navigation: {
    prev: true,
    next: true,
  },

  // Banner 横幅（可选）
  banner: {
    key: 'next15-tutorial-launch',
    text: <a href="/tutorials">🎉 Next.js 15 教程项目正式发布！立即查看教程 →</a>,
  },

  // 主要颜色（主题色）
  primaryHue: 212,
  primarySaturation: 100,

  // 自定义404页面
  notFound: {
    content: '提交问题关于缺失的页面',
    labels: 'missing page',
  },

  // 添加自定义主题
  themeSwitch: {
    useOptions() {
      return {
        light: '浅色',
        dark: '深色',
        system: '跟随系统',
      };
    },
  },

  // 最后更新时间
  gitTimestamp: ({ timestamp }: { timestamp: Date }) => (
    <div>最后更新于 {timestamp.toLocaleDateString('zh-CN')}</div>
  ),
};

export default config;
