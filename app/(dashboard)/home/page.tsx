import PostCard from '@/features/posts/components/post-card';
import PostForm from '@/features/posts/components/post-form';
import { requireAuth } from '@/lib/auth-utils';

export default async function HomePage() {
  await requireAuth();
  return (
    <div className="flex flex-col gap-y-6">
      <PostCard />
      <PostCard />
      <PostCard />
      <PostCard />
    </div>
  );
}
