import { db } from '@/lib/db';
import { user } from '@/schema/auth-schema';
import { posts } from '@/schema/post-schema';
import { createAuthCaller, creatUnauthCaller } from '@/tests/helpers/trpc';
import { eq } from 'drizzle-orm';
import { afterEach, describe, expect, it } from 'vitest';

describe('posts.create', () => {
  afterEach(async () => {
    await db.delete(posts);
    await db.delete(user);
  });

  it('creates a post for auth user', async () => {
    const testUser = {
      id: 'test-user-1',
      name: 'Test User 1',
      email: 'test-user-1@mail.com'
    };

    await db.insert(user).values(testUser);

    const caller = createAuthCaller(testUser);

    await caller.posts.create({
      text: 'first authenticated post'
    });

    const createdPosts = await db.select().from(posts).where(eq(posts.userId, testUser.id));

    expect(createdPosts).toHaveLength(1);
    expect(createdPosts[0].text).toBe('first authenticated post');
    expect(createdPosts[0].userId).toBe(testUser.id);
  });

  it('rejects unauthenticated users', async () => {
    const caller = creatUnauthCaller();

    await expect(
      caller.posts.create({
        text: 'this post should be rejected'
      })
    ).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
  });

  it('rejects empty text', async () => {
    const testUser = {
      id: 'test-user-2',
      name: 'Test User 2',
      email: 'test-user-2@mail.com'
    };

    await db.insert(user).values(testUser);

    const caller = createAuthCaller(testUser);

    await expect(caller.posts.create({ text: '' })).rejects.toThrow();
  });
});
