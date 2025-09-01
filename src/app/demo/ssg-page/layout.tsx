import { PAGE_METADATA, generateMetadata } from '@/lib/metadata';

export const metadata = generateMetadata(PAGE_METADATA.demo.ssg);

export default function SSGDemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
