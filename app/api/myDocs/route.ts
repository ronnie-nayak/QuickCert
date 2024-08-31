import { auth } from '@/lib/auth';
import { getDocumentById } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const session = await auth();
    // if (!session || session.user.type !== 'admin') {
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    //get params
    const search = req.nextUrl.searchParams.get('search') || '';
    const offset = parseInt(req.nextUrl.searchParams.get('offset') || '0');
    const orderBy = req.nextUrl.searchParams.get('orderBy') || 'asc';
    const column = req.nextUrl.searchParams.get('column') || 'requestDate';
    const type = req.nextUrl.searchParams.get('type') || '';
    const startDate = req.nextUrl.searchParams.has('startDate')
      ? new Date(req.nextUrl.searchParams.get('startDate')!)
      : new Date('1900-01-01');
    const endDate = req.nextUrl.searchParams.has('endDate')
      ? new Date(req.nextUrl.searchParams.get('endDate')!)
      : new Date('2100-01-01');

    const documents = await getDocumentById(
      session.user.id,
      search,
      offset,
      orderBy,
      column,
      type,
      startDate,
      endDate
    );

    return NextResponse.json(documents, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
