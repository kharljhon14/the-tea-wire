import { index, pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { user } from './auth-schema';
import { relations } from 'drizzle-orm';

export const followers = pgTable(
  'followers',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    followerId: text('follower_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' })
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.followerId] }),
    index('follower_user_id_idx').on(table.userId),
    index('follower_follower_id_idx').on(table.followerId)
  ]
);

export const followerRelations = relations(followers, ({ one }) => ({
  user: one(user, {
    fields: [followers.userId],
    references: [user.id]
  }),
  follower: one(user, {
    fields: [followers.followerId],
    references: [user.id]
  })
}));
