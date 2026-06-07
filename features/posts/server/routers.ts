import { db } from '@/lib/db';
import { posts } from '@/schema/post-schema';
import { createTRPCRouter, proctedProcedure } from '@/trpc/init';
import { and, eq } from 'drizzle-orm';
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
    }),

  update: proctedProcedure
    .input(
      z.object({
        id: z.string().min(1, 'id is required'),
        text: z.string().min(1, 'text is required')
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, text } = input;

      return db
        .update(posts)
        .set({
          text
        })
        .where(and(eq(posts.userId, ctx.userId), eq(posts.id, id)));
    })
});
