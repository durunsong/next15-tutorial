import { generateMetadata, PAGE_METADATA } from '@/lib/metadata';

export const metadata = generateMetadata(PAGE_METADATA.demo.isr);

export default function ISRDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
