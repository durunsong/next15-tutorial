import { PAGE_METADATA, generateMetadata } from '@/lib/metadata';

export const metadata = generateMetadata(PAGE_METADATA.redisTest);

export default function RedisTestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
