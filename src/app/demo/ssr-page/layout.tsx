import { PAGE_METADATA, generateMetadata } from '@/lib/metadata';

export const metadata = generateMetadata(PAGE_METADATA.demo.ssr);

export default function SSRDemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
