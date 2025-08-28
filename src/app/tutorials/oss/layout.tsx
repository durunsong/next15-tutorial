import { generateMetadata, PAGE_METADATA } from '@/lib/metadata';

export const metadata = generateMetadata(PAGE_METADATA.tutorials.oss);

export default function OSSTutorialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
