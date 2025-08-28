import { generateMetadata, PAGE_METADATA } from '@/lib/metadata';

export const metadata = generateMetadata(PAGE_METADATA.tutorials.nextjs);

export default function NextJSTutorialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
