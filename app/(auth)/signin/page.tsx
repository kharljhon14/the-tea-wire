import LoginForm from '@/features/auth/components/login-form';
import { requireUnauth } from '@/lib/auth-utils';

export default async function SignInPage() {
  await requireUnauth();

  return <LoginForm />;
}
