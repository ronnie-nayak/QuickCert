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

export const documents = pgTable('documents', {
  id: serial('id').primaryKey(),
  userId: text('userId')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  title: varchar('title', { length: 256 }).notNull(),
  issueDate: date('issueDate', { mode: 'date' }).notNull(),
  expiryDate: date('expiryDate', { mode: 'date' }).notNull(),

  fullName: varchar('fullName', { length: 256 }).notNull(),
  dob: date('dob', { mode: 'date' }).notNull(),

  city: varchar('city', { length: 256 }).notNull(),
  state: varchar('state', { length: 256 }).notNull(),
  zip: varchar('zip', { length: 256 }).notNull(),

  address: text('address').notNull(),

  requestDate: date('requestDate', { mode: 'date' }).defaultNow().notNull(),
  approvedDate: date('approvedDate', { mode: 'date' }),
  rejectedDate: date('rejectedDate', { mode: 'date' }),

  status: varchar('status', {
    length: 256,
    enum: ['pending', 'approved', 'rejected']
  })
    .notNull()
    .default('pending'),

  reason: text('reason'),

  documentUrl: text('documentUrl').notNull(),
  thumbnailUrl: text('thumbnailUrl').notNull(),
  certificateUrl: text('certificateUrl'),

  assignedCenter: varchar('assignedCenter', { length: 256 }).notNull(),

  income: integer('income').notNull()
});

export const documentRelations = relations(documents, ({ one }) => ({
  users: one(users, {
    fields: [documents.userId],
    references: [users.id]
  })
}));

export type InsertDocuments = typeof documents.$inferInsert;
export type SelectDocuments = typeof documents.$inferSelect;
