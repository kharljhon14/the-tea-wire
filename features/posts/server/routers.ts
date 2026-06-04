import { db } from '@/lib/db';
import { posts } from '@/schema/post-schema';
import { createTRPCRouter, proctedProcedure } from '@/trpc/init';
import z from 'zod';

export const postsRouter = createTRPCRouter({
  create: proctedProcedure
    .input(
      z.object({
        text: z.string().min(1, 'text is required')
      })
    )
    .mutation(({ ctx, input }) => {
      return db.insert(posts).values({
        text: input.text,
        userId: ctx.userId
      });
    })
});
