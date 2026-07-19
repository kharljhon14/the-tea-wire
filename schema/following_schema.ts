import { index, pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { user } from './auth-schema';
import { relations } from 'drizzle-orm';

export const followings = pgTable(
  'followings',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    followingId: text('following_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' })
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.followingId] }),
    index('following_user_id_idx').on(table.userId),
    index('following_following_id_idx').on(table.followingId)
  ]
);

export const followingRelations = relations(followings, ({ one }) => ({
  user: one(user, {
    fields: [followings.userId],
    references: [user.id]
  }),
  following: one(user, {
    fields: [followings.followingId],
    references: [user.id]
  })
}));
