'use client';

import './StatusPage.css';
import { Loading } from '@/components/loading';
import { SelectUser } from '@/lib/schema/auth';
import { SelectDetials } from '@/lib/schema/details';
import { SelectDocuments } from '@/lib/schema/documents';
import { capitalize, underscoreToSpace } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { HiOutlineMailOpen } from 'react-icons/hi';
import { MdPhoneIphone } from 'react-icons/md';
import { IoDocumentOutline, IoTimeOutline } from 'react-icons/io5';
import { FaRegCircleXmark } from 'react-icons/fa6';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { document } from 'postcss';
import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import Link from 'next/link';
import { FaCheckCircle, FaHourglassHalf, FaTimesCircle } from 'react-icons/fa';
import { pusherClient } from '@/lib/pusher';
import { useRouter } from 'next/navigation';
import { clsx } from 'clsx';

export default function Page({ params }: { params: { docId: string } }) {
  const [loading, setLoading] = useState(true);
  const [singleDocument, setSingleDocument] = useState<
    SelectDocuments & { users: SelectUser }
  >();
  const [userDetails, setUserDetails] = useState<SelectDetials>();

  const router = useRouter();

  // Simulated stages for demo purposes
  const stages = [
    { name: 'pending', icon: <FaHourglassHalf /> },
    { name: 'approved', icon: <FaCheckCircle /> },
    { name: 'rejected', icon: <FaTimesCircle /> }
  ];

  async function fetchData() {
    //axios
    try {
      const { data } = await axios.get(
        `/api/documents/singleDoc?docID=${params.docId}`
      );
      setSingleDocument(data.singleDocument);
      setUserDetails(data.userDetails);

      setLoading(false);
    } catch (error: any) {
      console.error('Error:', error);
      if (error.response?.data.error === 'Unauthorized') {
        router.replace('/login');
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);

    pusherClient.subscribe(params.docId);
    pusherClient.bind(
      'update',
      ({
        reason,
        status,
        certificateUrl
      }: {
        reason: string;
        status: 'approved' | 'rejected' | 'pending';
        certificateUrl: string;
      }) => {
        setSingleDocument((prev) => ({
          ...prev!,
          status,
          reason,
          certificateUrl
        }));
      }
    );

    fetchData();
    return () => pusherClient.unsubscribe('1');
  }, [params]);

  if (loading) {
    return (
      <div className="p-20">
        <Loading />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center">
        Document Number: {singleDocument?.id}
      </h1>
      <h1 className="text-4xl font-bold text-center">
        Title: {underscoreToSpace(singleDocument?.title ?? '')}
      </h1>
      <div className="flex justify-around m-10">
        <div className="flex gap-4 items-center">
          <img
            src={singleDocument?.users?.image ?? '/doc404.jpg'}
            alt="Document"
            className="w-16 h-16 rounded-full object-cover objcet-center shadow-2xl"
          />
          <div className="flex flex-col">
            <h1 className="font-bold">
              {capitalize(singleDocument?.users?.name!)}
            </h1>
            <p>
              {singleDocument?.city} {singleDocument?.state}
            </p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="w-16 h-16 rounded-lg flex justify-center items-center bg-gray-200">
            <HiOutlineMailOpen size={40} />
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold">Email</h1>
            <p>{userDetails?.email}</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="w-16 h-16 rounded-lg flex justify-center items-center bg-gray-200">
            <MdPhoneIphone size={40} />
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold">Phone Number</h1>
            <p>{userDetails?.phone}</p>
          </div>
        </div>
      </div>

      <div className="progress-tracker">
        {stages.map((stage, index) => (
          <div
            key={index}
            className={`tracker-step flex flex-col items-center ${
              singleDocument?.status === stage.name && 'active'
            }`}
          >
            <div className="icon">{stage.icon}</div>
            <div className="label">{stage.name}</div>
          </div>
        ))}
      </div>

      <h1 className="text-2xl font-bold mt-10">Document</h1>

      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <div className="w-16 h-16 rounded-lg flex justify-center items-center bg-gray-200">
            <IoDocumentOutline size={40} />
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold">
              {underscoreToSpace(singleDocument?.title ?? '')}
            </h1>
            <p>PDF</p>
          </div>
        </div>
        <Link href={singleDocument?.documentUrl ?? ''} target="_blank">
          <Button className="font-bold">View</Button>
        </Link>
      </div>

      <h1 className="text-2xl font-bold mt-5">Status</h1>

      <div className="flex gap-4 items-center">
        <div className="w-16 h-16 rounded-lg flex justify-center items-center bg-gray-200">
          {singleDocument?.status === 'pending' && <IoTimeOutline size={40} />}
          {singleDocument?.status === 'approved' && (
            <FaRegCircleCheck size={40} />
          )}
          {singleDocument?.status === 'rejected' && (
            <FaRegCircleXmark size={40} />
          )}
        </div>
        <div className="flex flex-col">
          <h1>{capitalize(singleDocument?.status ?? '')}</h1>
          <p>{singleDocument?.reason}</p>
        </div>
      </div>

      {singleDocument?.certificateUrl && (
        <div className="flex justify-between items-center mt-5">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 rounded-lg flex justify-center items-center bg-gray-200">
              <IoDocumentOutline size={40} />
            </div>
            <div className="flex flex-col">
              <h1 className="font-bold">Approved Certificate</h1>
              <p>PDF</p>
            </div>
          </div>
          <Link href={singleDocument?.certificateUrl} target="_blank">
            <Button className="font-bold">View</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
