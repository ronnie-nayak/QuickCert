import { auth } from '@/lib/auth';
import {
  addDocument,
  distributeDocuments,
  getDocuments,
  totalDocuments
} from '@/lib/db';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest, res: NextResponse) {
  try {
    const session = await auth();
    // if (!session || session.user.type !== 'admin') {
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!session.user.adminCenter) {
      return NextResponse.json(
        { error: 'Center not Assigned' },
        { status: 403 }
      );
    }

    const total = await distributeDocuments(session.user.adminCenter);

    return NextResponse.json(
      { adminCenter: session.user.adminCenter, total },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
