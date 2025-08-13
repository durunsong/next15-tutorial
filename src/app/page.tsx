import { redirect } from 'next/navigation';

export default function Home() {
  // 直接重定向到技术栈页面
  redirect('/tech-stack');
}
