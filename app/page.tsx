import { requireAuth } from '@/lib/auth-utils';

export default async function Home() {
  await requireAuth();
  return (
    <div>
      <h1>Home page</h1>
    </div>
  );
}
