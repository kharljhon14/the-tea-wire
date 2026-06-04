import { createTRPCRouter } from '../init';
import { postsRouter } from '@/features/posts/server/routers';
export const appRouter = createTRPCRouter({
  posts: postsRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
