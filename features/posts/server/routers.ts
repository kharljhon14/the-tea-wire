import { PAGINATION } from '@/config/constant';
import { db } from '@/lib/db';
import { posts } from '@/schema/post-schema';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import { and, desc, eq } from 'drizzle-orm';
import z from 'zod';

export const postsRouter = createTRPCRouter({
  create: protectedProcedure
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
  getOne: protectedProcedure
    .input(z.object({ id: z.string().min(1, 'id is required') }))
    .query(async ({ input }) => {
      const results = await db.select().from(posts).where(eq(posts.id, input.id)).limit(1);

      if (results.length === 0) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'post not found' });
      }

      return results;
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        size: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        userID: z.string().default('')
      })
    )
    .query(async ({ input }) => {
      const { page, size, userID } = input;
      const offset = (page - 1) * size;

      const results = await db
        .select()
        .from(posts)
        .where(userID ? eq(posts.userId, userID) : undefined)
        .offset(offset)
        .limit(size)
        .orderBy(desc(posts.createdAt));

      return results;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, 'id is required'),
        text: z.string().min(1, 'text is required')
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, text } = input;

      const results = await db
        .update(posts)
        .set({
          text
        })
        .where(and(eq(posts.userId, ctx.userId), eq(posts.id, id)));

      if (results.rowCount === 0) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'post not found' });
      }

      return results;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1, 'id is required') }))
    .mutation(async ({ ctx, input }) => {
      const results = await db
        .delete(posts)
        .where(and(eq(posts.userId, ctx.userId), eq(posts.id, input.id)));

      if (results.rowCount === 0) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'post not found' });
      }

      return results;
    })
});
