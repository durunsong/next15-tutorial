import { generateMetadata, PAGE_METADATA } from '@/lib/metadata';

export const metadata = generateMetadata(PAGE_METADATA.tutorials.prisma);

export default function PrismaTutorialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
