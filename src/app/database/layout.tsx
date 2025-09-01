import { PAGE_METADATA, generateMetadata } from '@/lib/metadata';

export const metadata = generateMetadata(PAGE_METADATA.database);

export default function DatabaseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
