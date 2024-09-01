import 'server-only';

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import {
  pgTable,
  text,
  numeric,
  integer,
  timestamp,
  pgEnum,
  serial,
  PgColumn
} from 'drizzle-orm/pg-core';
import {
  count,
  eq,
  ilike,
  asc,
  desc,
  gte,
  lte,
  and,
  inArray,
  sql
} from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';

// import { drizzle } from "drizzle-orm/postgres-js";
// import postgres from "postgres";
//
import * as auth from './schema/auth';
import * as details from './schema/details';
import * as documents from './schema/documents';
import { InsertDetials } from './schema/details';
import { InsertDocuments } from './schema/documents';
// import * as bills from "./schema/bills";
// import * as savings from "./schema/savings";
// import * as transactions from "./schema/transactions";
//
// export * from "./schema/types";
//
export const schema = { ...auth, ...details, ...documents };
//
// export { pgTable as tableCreator } from './schema/_table';
//
// export * from "drizzle-orm";
//
// // for query purposes
// const queryClient = postgres(process.env.DATABASE_URL!, { ssl: true });
// export const db = drizzle(queryClient, { schema });

export const db = drizzle(neon(process.env.POSTGRES_URL!), { schema });

export async function totalDocuments(assignedCenter: string) {
  const res = await db
    .select({
      assignedCenter: schema.documents.assignedCenter,
      count: sql<number>`cast(count(${schema.documents.id}) as int)`
    })
    .from(schema.documents)
    .where(eq(schema.documents.status, 'pending'))
    .groupBy(schema.documents.assignedCenter);

  const res2 = await db
    .select({
      status: schema.documents.status,
      count: sql<number>`cast(count(${schema.documents.id}) as int)`
    })
    .from(schema.documents)
    .groupBy(schema.documents.status);

  const res3 = await db
    .select({
      date: sql<string>`to_char(${schema.documents.requestDate}, 'YYYY-MM-DD')`,
      count: sql<number>`cast(count(${schema.documents.id}) as int)`
    })
    .from(schema.documents)
    .orderBy(asc(schema.documents.requestDate))
    .groupBy(schema.documents.requestDate);

  const res4 = await db
    .select({
      assignedCenter: schema.documents.assignedCenter,
      status: schema.documents.status,
      count: sql<number>`cast(count(${schema.documents.id}) as int)`
    })
    .from(schema.documents)
    .groupBy(schema.documents.assignedCenter, schema.documents.status);

  // .from(schema.documents)
  // .where(ilike(schema.documents.assignedCenter, `%${assignedCenter}%`));
  // return res[0].count;
  return {
    centers: res,
    status: res2,
    dates: res3,
    concatCentStatus: res4
  };
}

export async function getSingleDocument(id: number) {
  return await db.query.documents.findFirst({
    where: eq(schema.documents.id, id),
    with: {
      users: true
    }
  });
}

export async function getDetails(id: string) {
  return await db
    .select()
    .from(schema.details)
    .where(eq(schema.details.userId, id));
}

export async function changeDocStatus(
  id: number,
  status: 'approved' | 'rejected',
  reason: string,
  certificateUrl: string
) {
  return await db
    .update(schema.documents)
    .set({
      status,
      approvedDate: status === 'approved' ? new Date() : null,
      rejectedDate: status === 'rejected' ? new Date() : null,
      reason,
      certificateUrl
    })
    .where(eq(schema.documents.id, id));
}

export async function getDocumentById(
  id: string,
  search: string,
  offset: number,
  orderBy: string,
  column: string,
  type: string,
  startDate: Date,
  endDate: Date
) {
  const columns = {
    title: schema.documents.title,
    requestDate: schema.documents.requestDate,
    fullName: schema.documents.fullName,
    status: schema.documents.status
  };
  const currentCol = columns[column as keyof typeof columns];
  let result;
  if (orderBy === 'asc') {
    result = await db
      .select()
      .from(schema.documents)
      .where(
        and(
          eq(schema.documents.userId, id),
          ilike(schema.documents.title, `%${search}%`),
          ilike(schema.documents.status, `%${type}%`),
          gte(schema.documents.requestDate, startDate),
          lte(schema.documents.requestDate, endDate)
        )
      )
      .orderBy(asc(currentCol))
      .limit(8)
      .offset(offset);
  } else {
    result = await db
      .select()
      .from(schema.documents)
      .where(
        and(
          eq(schema.documents.userId, id),
          ilike(schema.documents.title, `%${search}%`),
          ilike(schema.documents.status, `%${type}%`),
          gte(schema.documents.requestDate, startDate),
          lte(schema.documents.requestDate, endDate)
        )
      )
      .orderBy(desc(currentCol))
      .limit(8)
      .offset(offset);
  }

  return result;
}

export async function getDocuments(
  search: string,
  offset: number,
  orderBy: string,
  column: string,
  type: string,
  startDate: Date,
  endDate: Date,
  assignedCenter: string
) {
  const columns = {
    title: schema.documents.title,
    requestDate: schema.documents.requestDate,
    fullName: schema.documents.fullName,
    status: schema.documents.status
  };
  const currentCol = columns[column as keyof typeof columns];
  let result;
  if (orderBy === 'asc') {
    result = await db
      .select()
      .from(schema.documents)
      .where(
        and(
          ilike(schema.documents.title, `%${search}%`),
          ilike(schema.documents.status, `%${type}%`),
          gte(schema.documents.requestDate, startDate),
          lte(schema.documents.requestDate, endDate),
          ilike(schema.documents.assignedCenter, `%${assignedCenter}%`)
        )
      )
      .orderBy(asc(currentCol))
      .limit(5)
      .offset(offset);
  } else {
    result = await db
      .select()
      .from(schema.documents)
      .where(
        and(
          ilike(schema.documents.title, `%${search}%`),
          ilike(schema.documents.status, `%${type}%`),
          gte(schema.documents.requestDate, startDate),
          lte(schema.documents.requestDate, endDate),
          ilike(schema.documents.assignedCenter, `%${assignedCenter}%`)
        )
      )
      .orderBy(desc(currentCol))
      .limit(5)
      .offset(offset);
  }

  return result;
}

export async function addDocument({
  userId,
  title,
  fullName,
  issueDate,
  expiryDate,
  city,
  state,
  zip,
  address,
  dob,
  documentUrl,
  thumbnailUrl,
  assignedCenter,
  income
}: InsertDocuments) {
  return await db.insert(schema.documents).values({
    userId,
    title,
    fullName,
    issueDate,
    expiryDate,
    city,
    state,
    zip,
    address,
    dob,
    documentUrl,
    thumbnailUrl,
    assignedCenter,
    income
  });
}

type addUserDetailsType = {
  userId: string;
  firstName: string;
  lastName: string;
  dob: Date;
  gender: string;
  address: string;
  city: string;
  state: string;
  zip: number;
  contact: number;
  email: string;
};

export async function addUserDetails({
  userId,
  fullName,
  dob,
  gender,
  address,
  city,
  state,
  zip,
  phone,
  email,
  income
}: InsertDetials) {
  await db
    .update(schema.users)
    .set({
      type: 'client'
    })
    .where(eq(schema.users.id, userId));

  return await db.insert(schema.details).values({
    userId,
    fullName,
    dob: new Date(dob),
    gender,
    address,
    city,
    state,
    zip,
    phone,
    email,
    income
  });
}

export async function distributeDocuments(assignedCenter: string) {
  let centerName = assignedCenter.split('-')[0];
  let centerNumber = +assignedCenter.split('-')[1];
  let ids: any = await db
    .select({ id: schema.documents.id })
    .from(schema.documents)
    .where(
      and(
        ilike(schema.documents.assignedCenter, `%${centerName}%`),
        eq(schema.documents.status, 'pending')
      )
    );
  ids = ids.map((idx: { id: number }) => idx.id);
  const totalDocs = ids.length;
  let eachTotal = Math.ceil(totalDocs / 3);
  const centerIds = [];
  for (let i = 0; i < 3; i++) {
    centerIds.push(ids.splice(0, eachTotal));
  }

  let returnDocs = [];
  let temp;
  for (let i = 0; i < centerIds.length; i++) {
    if (centerIds[i].length === 0) {
      continue;
    }
    temp = await db
      .update(schema.documents)
      .set({
        assignedCenter: `${centerName}-${i + 1}`
      })
      .where(inArray(schema.documents.id, centerIds[i]));
    if (i + 1 === centerNumber) {
      // @ts-ignore
      returnDocs = temp;
    }
  }

  return returnDocs.length;
}
