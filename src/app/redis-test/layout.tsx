import { generateMetadata, PAGE_METADATA } from '@/lib/metadata';

export const metadata = generateMetadata(PAGE_METADATA.redisTest);

export default function RedisTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
