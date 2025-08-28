import { generateMetadata, PAGE_METADATA } from '@/lib/metadata';

export const metadata = generateMetadata(PAGE_METADATA.tutorials.typescript);

export default function TypeScriptTutorialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
