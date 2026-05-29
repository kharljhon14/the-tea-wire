import AuthLayout from '@/features/auth/components/auth-layout';
import { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren) {
  return <AuthLayout>{children}</AuthLayout>;
}
