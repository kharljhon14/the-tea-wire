import { createCallerFactory } from '@/trpc/init';
import { appRouter } from '@/trpc/routers/_app';

const createCaller = createCallerFactory(appRouter);

type TestUser = {
  id: string;
  name: string;
  email: string;
};

export function createAuthCaller(user: TestUser) {
  return createCaller({
    userId: user.id,
    session: {
      user,
      session: {
        id: `session-${user.id}`,
        userId: user.id,
        token: `token-${user.id}`,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60)
      }
    }
  });
}

export function creatUnauthCaller() {
  return createCaller({
    userId: undefined,
    session: null
  });
}
