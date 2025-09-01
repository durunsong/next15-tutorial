import { PAGE_METADATA, generateMetadata } from '@/lib/metadata';

export const metadata = generateMetadata(PAGE_METADATA.login);

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
