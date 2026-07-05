import { trpc, prefetch } from '@/trpc/server';
import { inferInput } from '@trpc/tanstack-react-query';

type Input = inferInput<typeof trpc.posts.getMany>;

export const prefetchPosts = (params: Input) => {
  return prefetch(trpc.posts.getMany.queryOptions(params));
};
