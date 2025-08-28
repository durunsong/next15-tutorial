import { generateMetadata, PAGE_METADATA } from '@/lib/metadata';

export const metadata = generateMetadata(PAGE_METADATA.techStack);

export default function TechStackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
