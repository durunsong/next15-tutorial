import { PAGE_METADATA, generateMetadata } from '@/lib/metadata';

export const metadata = generateMetadata(PAGE_METADATA.tutorials.jsx);

export default function JSXTutorialLayout({ children }: { children: React.ReactNode }) {
  return children;
}
