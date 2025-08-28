import { generateMetadata, PAGE_METADATA } from '@/lib/metadata';

export const metadata = generateMetadata(PAGE_METADATA.tutorials.redis);

export default function RedisTutorialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
