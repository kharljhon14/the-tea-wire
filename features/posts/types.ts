import type { AppRouter } from '@/trpc/routers/_app';
import type { inferRouterOutputs } from '@trpc/server';

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type PostWithUser = RouterOutputs['posts']['getMany'][number];
