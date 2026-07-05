import { auth } from '@/lib/auth';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';

import { headers } from 'next/headers';
/**
 * This context creator accepts `headers` so it can be reused in both
 * the RSC server caller (where you pass `next/headers`) and the
 * API route handler (where you pass the request headers).
 */
export const createTRPCContext = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  return { session, userId: session?.user.id };
};
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Awaited<ReturnType<typeof createTRPCContext>>>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: { ...ctx, session: ctx.session, userId: ctx.userId }
  });
});
