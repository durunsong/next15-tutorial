'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Moon, Sun, Menu, X, User, LogIn, LogOut, UserCircle } from 'lucide-react';
import { Button, Dropdown, Avatar, message } from 'antd';
import type { MenuProps } from 'antd';
import AuthModal from '@/components/AuthModal';
import { useAuthStore } from '@/store/authStore';

const navigationItems = [
  { name: '技术栈', href: '/tech-stack' },
  { name: 'JSX 语法', href: '/tutorials/jsx-basics' },
  { name: 'Next.js 基础', href: '/tutorials/nextjs-basics' },
  { name: 'TypeScript', href: '/tutorials/typescript' },
  { name: 'Prisma ORM', href: '/tutorials/prisma' },
  { name: 'Redis 缓存', href: '/tutorials/redis' },
  { name: '阿里云 OSS', href: '/tutorials/oss' },
  { name: 'Zustand', href: '/tutorials/zustand' },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();

  // 防止水合不匹配错误
  useEffect(() => {
    setMounted(true);
  }, []);



  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  // 处理登录成功
  const handleLoginSuccess = (user: { username: string }) => {
    message.success(`欢迎回来，${user.username}!`);
    // AuthModal内部已经处理了状态更新
  };

  // 处理退出登录
  const handleLogout = async () => {
    try {
      await logout();
      message.success('退出登录成功');
    } catch {
      message.error('退出登录失败');
    }
  };

  // 打开登录模态框
  const openAuthModal = (tab: 'login' | 'register') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  // 用户下拉菜单
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: (
        <Link href="/profile" className="flex items-center space-x-3 px-2 py-2 text-gray-700 hover:text-gray-900">
          <UserCircle className="h-5 w-5" />
          <span>个人中心</span>
        </Link>
      ),
    },
    {
      key: 'settings', 
      label: (
        <div className="flex items-center space-x-3 px-2 py-2 text-gray-700 hover:text-gray-900 cursor-pointer">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>设置</span>
        </div>
      ),
    },
    {
      key: 'logout',
      label: (
        <div className="flex items-center space-x-3 px-2 py-2 text-gray-700 hover:text-gray-900 cursor-pointer">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>登出</span>
        </div>
      ),
      onClick: handleLogout,
    },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Next.js 15
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 shadow-sm'
                    : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* 用户区域 */}
            <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
              {isAuthenticated && user ? (
                <>
                  {/* 已登录状态 - 显示欢迎信息（非按钮形式） */}
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center text-sm font-medium">欢迎，{user.username}!</span>

                    <Dropdown 
                      menu={{ items: userMenuItems }} 
                      placement="bottomRight" 
                      trigger={['click']}
                      overlayClassName="user-dropdown"
                      arrow={false}
                    >
                      <div className="flex items-center space-x-2 px-2 py-1 cursor-pointer rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <Avatar 
                          size={32}
                          src={user.avatar} 
                          icon={<User className="h-4 w-4" />}
                          className="border-2 border-gray-200"
                        />
                        <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </Dropdown>
                  </div>
                </>
              ) : (
                <>
                  {/* 未登录状态 */}
                  <Button
                    type="primary"
                    onClick={() => openAuthModal('login')}
                    className="bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600 rounded-md px-4 py-1"
                  >
                    登录 / 注册
                  </Button>
                </>
              )}
              
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="切换主题"
              >
                {mounted ? (
                  theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />
                ) : (
                  <div className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="切换主题"
            >
              {mounted ? (
                theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />
              ) : (
                <div className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="打开菜单"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* 移动端用户链接 */}
            <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
              {isAuthenticated && user ? (
                <>
                  <span className="flex items-center text-sm font-medium">欢迎，{user.username}!</span>
                  <Link
                    href="/profile"
                    className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <UserCircle className="h-5 w-5" />
                    <span>个人中心</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>退出登录</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      openAuthModal('login');
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-base font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>登录 / 注册</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* 认证模态框 */}
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleLoginSuccess}
        defaultTab={authModalTab}
      />
    </nav>
  );
}