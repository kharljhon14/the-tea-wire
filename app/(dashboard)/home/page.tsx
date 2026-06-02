import { requireAuth } from '@/lib/auth-utils';

export default async function HomePage() {
  await requireAuth();
  return (
    <main>
      <h1>Homepage</h1>
    </main>
  );
}
