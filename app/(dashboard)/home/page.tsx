import PostList from '@/features/posts/components/post-list';
import { requireAuth } from '@/lib/auth-utils';
import { Suspense } from 'react';
import { HydrateClient } from '@/trpc/server';
import { postsParamsLoader } from '@/features/posts/server/params-loader';
import { SearchParams } from 'nuqs/server';
import { prefetchPosts } from '@/features/posts/server/prefetch';

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function HomePage({ searchParams }: Props) {
  await requireAuth();

  const params = await postsParamsLoader(searchParams);
  prefetchPosts(params);
  return (
    <HydrateClient>
      <Suspense fallback={'Loading...'}>
        <div className="flex flex-col gap-y-6">
          <PostList />
        </div>
      </Suspense>
    </HydrateClient>
  );
}
