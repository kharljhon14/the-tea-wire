import { createTRPCRouter } from '../init';
import { heartsRouter, postsRouter } from '@/features/posts/server/routers';
export const appRouter = createTRPCRouter({
  posts: postsRouter,
  hearts: heartsRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
