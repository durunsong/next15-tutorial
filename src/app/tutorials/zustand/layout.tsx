import { generateMetadata, PAGE_METADATA } from '@/lib/metadata';

export const metadata = generateMetadata(PAGE_METADATA.tutorials.zustand);

export default function ZustandTutorialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
