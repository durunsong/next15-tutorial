import { PAGE_METADATA, generateMetadata } from '@/lib/metadata';

export const metadata = generateMetadata(PAGE_METADATA.profile);

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
