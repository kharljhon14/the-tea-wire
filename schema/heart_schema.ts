import { index, pgTable, primaryKey, text, uuid } from 'drizzle-orm/pg-core';
import { user } from './auth-schema';
import { posts } from './post-schema';
import { relations } from 'drizzle-orm';

export const hearts = pgTable(
  'hearts',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    postId: uuid('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' })
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.postId] }),
    index('hearts_user_id_idx').on(table.userId),
    index('hearts_post_id_idx').on(table.postId)
  ]
);

export const heartRelations = relations(hearts, ({ one }) => ({
  user: one(user, {
    fields: [hearts.userId],
    references: [user.id]
  }),
  post: one(posts, {
    fields: [hearts.postId],
    references: [posts.id]
  })
}));
