import { auth } from '@/lib/auth';
import { totalDocuments } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
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

    const total = await totalDocuments(session.user.adminCenter);

    return NextResponse.json(
      { total, adminCenter: session.user.adminCenter },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
