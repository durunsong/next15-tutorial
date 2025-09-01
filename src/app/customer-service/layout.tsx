import { PAGE_METADATA, generateMetadata } from '@/lib/metadata';

export const metadata = generateMetadata(PAGE_METADATA.customerService);

export default function CustomerServiceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
