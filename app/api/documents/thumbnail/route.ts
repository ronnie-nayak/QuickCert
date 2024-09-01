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

    const body = await req.json();

    console.log(body.documentUrl);
    const thumbnail = await axios.post(
      'https://v2.api2pdf.com/libreoffice/thumbnail',
      {
        url: body.documentUrl
      },
      {
        headers: {
          Authorization: process.env.API2PDF_API_KEY
        }
      }
    );

    const thumbnailUrl = thumbnail?.data?.FileUrl;

    return NextResponse.json({ thumbnailUrl }, { status: 200 });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ error }, { status: 500 });
  }
}
