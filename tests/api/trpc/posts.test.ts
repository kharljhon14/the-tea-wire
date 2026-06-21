import { db } from '@/lib/db';
import { user } from '@/schema/auth-schema';
import { posts } from '@/schema/post-schema';
import { createAuthCaller, createUnauthCaller } from '@/tests/helpers/trpc';
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
    const caller = createUnauthCaller();

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

describe('posts.getOne', () => {
  afterEach(async () => {
    await db.delete(posts);
    await db.delete(user);
  });

  it('gets a post with a valid ID', async () => {
    const testUser = {
      id: 'test-user-1',
      name: 'Test User 1',
      email: 'test-user-1@mail.com'
    };

    await db.insert(user).values(testUser);

    const caller = createAuthCaller(testUser);

    const [createdPost] = await db
      .insert(posts)
      .values({
        text: 'Orignal post',
        userId: testUser.id
      })
      .returning();

    const [post] = await caller.posts.getOne({ id: createdPost.id });

    expect(post.id).toBe(createdPost.id);
    expect(post.text).toBe(createdPost.text);
  });

  it('does not get a post with an ivalid ID', async () => {
    const testUser = {
      id: 'test-user-2',
      name: 'Test User 2',
      email: 'test-user-2@mail.com'
    };

    await db.insert(user).values(testUser);

    const caller = createAuthCaller(testUser);

    await expect(caller.posts.getOne({ id: 'invalid-id' })).rejects.toThrow();
  });
});

describe('posts.update', () => {
  afterEach(async () => {
    await db.delete(posts);
    await db.delete(user);
  });

  it('updates a post owned by the auth user', async () => {
    const testUser = {
      id: 'test-user-1',
      name: 'Test User 1',
      email: 'test-user-1@mail.com'
    };

    await db.insert(user).values(testUser);

    const caller = createAuthCaller(testUser);

    const [createdPost] = await db
      .insert(posts)
      .values({
        text: 'Orignal post',
        userId: testUser.id
      })
      .returning();

    await caller.posts.update({
      id: createdPost.id,
      text: 'Updated post'
    });

    const [updatedPost] = await db.select().from(posts).where(eq(posts.id, createdPost.id));

    expect(updatedPost.text).toBe('Updated post');
    expect(updatedPost.userId).toBe(testUser.id);
  });

  it('rejects unauthenticated users', async () => {
    const caller = createUnauthCaller();

    await expect(
      caller.posts.update({
        id: 'post-id',
        text: ' some text'
      })
    ).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
  });

  it("does not update another user's post", async () => {
    const owner = {
      id: 'owner-user',
      name: 'Owner User',
      email: 'owner@example.com'
    };

    const otherUser = {
      id: 'other-user',
      name: 'Other User',
      email: 'other@example.com'
    };

    await db.insert(user).values([owner, otherUser]);

    const caller = createAuthCaller(otherUser);

    const [createdPost] = await db
      .insert(posts)
      .values({
        text: 'Owner post',
        userId: owner.id
      })
      .returning();

    await expect(
      caller.posts.update({
        id: createdPost.id,
        text: 'Other user update'
      })
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });

    const [postAfterFailedUpdate] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, createdPost.id));

    expect(postAfterFailedUpdate.text).toBe('Owner post');
  });

  it('rejects empty text', async () => {
    const testUser = {
      id: 'test-user-2',
      name: 'Test User 2',
      email: 'test-user-2@mail.com'
    };

    await db.insert(user).values(testUser);

    const caller = createAuthCaller(testUser);

    const [createdPost] = await db
      .insert(posts)
      .values({
        text: 'text post 2',
        userId: testUser.id
      })
      .returning();

    await expect(caller.posts.update({ id: createdPost.id, text: '' })).rejects.toThrow();
  });
});

describe('posts.delete', () => {
  afterEach(async () => {
    await db.delete(posts);
    await db.delete(user);
  });

  it('deletes a post owned by the auth user', async () => {
    const testUser = {
      id: 'test-user-1',
      name: 'Test user 1',
      email: 'test-user-1@mail.com'
    };

    await db.insert(user).values(testUser);

    const caller = createAuthCaller(testUser);

    const [createdPost] = await db
      .insert(posts)
      .values({
        text: 'Test users post',
        userId: testUser.id
      })
      .returning();

    await caller.posts.delete({ id: createdPost.id });

    const deletedPosts = await db.select().from(posts).where(eq(posts.id, createdPost.id));

    expect(deletedPosts).toHaveLength(0);
  });

  it('rejects unauthenticated users', async () => {
    const caller = createUnauthCaller();

    await expect(
      caller.posts.delete({
        id: 'post-id'
      })
    ).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
  });

  it("does not delete another user's post", async () => {
    const owner = {
      id: 'owner-user',
      name: 'Owner User',
      email: 'owner@example.com'
    };

    const otherUser = {
      id: 'other-user',
      name: 'Other User',
      email: 'other@example.com'
    };

    await db.insert(user).values([owner, otherUser]);

    const caller = createAuthCaller(otherUser);

    const [createdPost] = await db
      .insert(posts)
      .values({
        text: 'Owner post',
        userId: owner.id
      })
      .returning();

    await expect(caller.posts.delete({ id: createdPost.id })).rejects.toThrow();
  });

  it('rejects empty id', async () => {
    const testUser = {
      id: 'test-user-2',
      name: 'Test user 2',
      email: 'test-user-2@mail.com'
    };

    await db.insert(user).values(testUser);

    const caller = createAuthCaller(testUser);

    await expect(caller.posts.delete({ id: '' })).rejects.toThrow();
  });
});
