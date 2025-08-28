import { generateMetadata, PAGE_METADATA } from '@/lib/metadata';

export const metadata = generateMetadata(PAGE_METADATA.customerService);

export default function CustomerServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
