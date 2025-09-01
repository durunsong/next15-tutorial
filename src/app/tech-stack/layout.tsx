import { PAGE_METADATA, generateMetadata } from '@/lib/metadata';

export const metadata = generateMetadata(PAGE_METADATA.techStack);

export default function TechStackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
