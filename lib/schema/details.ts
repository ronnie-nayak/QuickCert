import { relations } from 'drizzle-orm';
import {
  date,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar
} from 'drizzle-orm/pg-core';

import { users } from './auth';

export const details = pgTable('details', {
  id: serial('id').primaryKey(),
  userId: text('userId')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  fullName: varchar('fullName', { length: 256 }).notNull(),
  dob: date('dob', { mode: 'date' }).notNull(),
  email: varchar('email', { length: 256 }).notNull(),
  phone: varchar('phone', { length: 256 }).notNull(),
  gender: varchar('gender', {
    length: 256,
    enum: ['Male', 'Female', 'Transgender', 'Prefer not to say']
  }).notNull(),
  address: text('address').notNull(),
  city: varchar('city', { length: 256 }).notNull(),
  state: varchar('state', { length: 256 }).notNull(),
  zip: varchar('zip', { length: 256 }).notNull(),
  income: integer('income').notNull()
});

export const detailsRelations = relations(details, ({ one }) => ({
  users: one(users, {
    fields: [details.userId],
    references: [users.id]
  })
}));

export type InsertDetials = typeof details.$inferInsert;
export type SelectDetials = typeof details.$inferSelect;
