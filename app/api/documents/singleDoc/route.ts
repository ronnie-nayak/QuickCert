import { auth } from '@/lib/auth';
import { changeDocStatus, getDetails, getSingleDocument } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';
import { documents } from '@/lib/schema/documents';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const session = await auth();
    // if (!session || session.user.type !== 'admin') {
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const docId = req.nextUrl.searchParams.get('docID') || '';

    if (!docId || isNaN(parseInt(docId))) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    const singleDocument = await getSingleDocument(parseInt(docId));

    const userDetails = await getDetails(singleDocument?.userId!);

    return NextResponse.json(
      {
        singleDocument,
        userDetails: userDetails[0]
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { docId, status, reason } = await req.json();

    const certificateUrl = `https://drive.google.com/file/d/17wSkvqMH_pOmzcn9Lo5GEjGjSRGt1TF5/view?usp=sharing`;

    pusherServer.trigger(docId, 'update', {
      status,
      reason,
      certificateUrl: status === 'approved' ? certificateUrl : null
    });

    const document = await changeDocStatus(
      docId,
      status,
      reason,
      certificateUrl
    );

    return NextResponse.json({ certificateUrl }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
