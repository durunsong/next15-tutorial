import { generateMetadata, PAGE_METADATA } from '@/lib/metadata';

export const metadata = generateMetadata(PAGE_METADATA.demo.csr);

export default function CSRDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
