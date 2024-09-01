import { auth } from '@/lib/auth';
import { addDocument, getDocuments, totalDocuments } from '@/lib/db';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { UTApi } from 'uploadthing/server';

const utapi = new UTApi();

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

    const documents = await getDocuments(
      search,
      offset,
      orderBy,
      column,
      type,
      startDate,
      endDate,
      session.user.adminCenter
    );

    return NextResponse.json(
      { documents, adminCenter: session.user.adminCenter },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  let fileId;
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('document');
    const body = {
      fullName: `${formData.get('firstname')} ${formData.get('lastname')}`,
      dob: formData.get('dob') as string,
      title: formData.get('documentType') as string,
      issueDate: formData.get('issueDate') as string,
      expiryDate: formData.get('expiryDate') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      zip: formData.get('zip') as string,
      userId: session.user.id,
      income: parseInt(formData.get('income') as string)
    };

    //@ts-ignore
    const response = await utapi.uploadFiles(file);
    fileId = response.data?.key;

    const thumbnail = await axios.post(
      'https://v2.api2pdf.com/libreoffice/thumbnail',
      {
        url: response.data?.url
      },
      {
        headers: {
          Authorization: process.env.API2PDF_API_KEY
        }
      }
    );

    const thumbnailUrl = thumbnail?.data?.FileUrl;

    const documents = await addDocument({
      ...body,
      dob: new Date(body.dob),
      issueDate: new Date(body.issueDate),
      expiryDate: new Date(body.expiryDate),
      documentUrl: response.data?.url!,
      thumbnailUrl,
      assignedCenter:
        body.city.toLowerCase() + '-' + Math.ceil(Math.random() * 3)
    });

    return NextResponse.json(documents, { status: 200 });
  } catch (error) {
    if (fileId) {
      await utapi.deleteFiles(fileId);
    }
    return NextResponse.json({ error }, { status: 500 });
  }
}
