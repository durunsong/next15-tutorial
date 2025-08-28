import { generateMetadata, PAGE_METADATA } from '@/lib/metadata';

export const metadata = generateMetadata(PAGE_METADATA.register);

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
