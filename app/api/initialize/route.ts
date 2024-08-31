import { auth } from '@/lib/auth';
import { addUserDetails } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const session = await auth();
    // if (!session || session.user.type !== 'admin') {
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    const details = await addUserDetails({
      ...body,
      userId: session.user.id,
      fullName: `${body.firstname} ${body.lastname}`,
      income: parseInt(body.income)
    });

    return NextResponse.json(details, { status: 201 });
  } catch (error) {
    return NextResponse.json(error, { status: 401 });
  }
}
