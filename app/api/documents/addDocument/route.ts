import { auth } from '@/lib/auth';
import { addDocument, getDocuments, totalDocuments } from '@/lib/db';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body2 = await req.json();

    //@ts-ignore

    const documents = await addDocument({
      ...body2,
      dob: new Date(body2.dob),
      issueDate: new Date(body2.issueDate),
      expiryDate: new Date(body2.expiryDate),
      assignedCenter:
        body2.city.toLowerCase() + '-' + Math.ceil(Math.random() * 3),
      fullName: body2.firstName + ' ' + body2.lastName,
      income: parseInt(body2.income),
      userId: session.user.id
    });

    return NextResponse.json(documents, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
