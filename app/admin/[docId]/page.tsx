'use client';
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
import { useRouter } from 'next/navigation';
import { clsx } from 'clsx';

export default function Page({ params }: { params: { docId: string } }) {
  const [loading, setLoading] = useState(true);
  const [singleDocument, setSingleDocument] = useState<
    SelectDocuments & { users: SelectUser }
  >();
  const [userDetails, setUserDetails] = useState<SelectDetials>();
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState('approved');

  const router = useRouter();

  useEffect(() => {
    setLoading(true);

    async function fetchData() {
      //axios
      try {
        const { data } = await axios.get(
          `/api/documents/singleDoc?docID=${params.docId}`
        );
        setSingleDocument(data.singleDocument);
        setUserDetails(data.userDetails);
        setStatus(data.singleDocument.status);
        setReason(data.singleDocument.reason);

        setLoading(false);
      } catch (error: any) {
        console.error('Error:', error);

        if (error.response?.data.error === 'Unauthorized') {
          router.replace('/login');
        }
      }
      setLoading(false);
    }

    fetchData();
  }, [params]);

  const handleSubmit = async () => {
    try {
      const { data } = await axios.post(`/api/documents/singleDoc`, {
        docId: params.docId,
        status,
        reason
      });
    } catch (error: any) {
      console.error('Error:', error);

      if (error.response?.data.error === 'Unauthorized') {
        router.replace('/login');
      }
    }
  };

  if (loading) {
    return (
      <div className="p-20">
        <Loading />
      </div>
    );
  }

  const applicantDetails = {
    'Full Name': userDetails?.fullName,
    'Date of Birth': new Date(userDetails?.dob ?? '').toLocaleDateString(),
    Address: userDetails?.address,
    City: userDetails?.city,
    State: userDetails?.state,
    'Zip Code': userDetails?.zip
  };

  const documentDetails = {
    'Full Name': singleDocument?.fullName,
    'Date of Birth': new Date(singleDocument?.dob ?? '').toLocaleDateString(),
    Address: singleDocument?.address,
    City: singleDocument?.city,
    State: singleDocument?.state,
    'Zip Code': singleDocument?.zip
  };

  function compareDetails(applicant: any, document: any) {
    if (status === 'approved') return true;
    if (status === 'rejected') return false;
    for (let key in applicant) {
      if (applicant[key] !== document[key]) {
        return false;
      }
    }
    return true;
  }

  const isSame = compareDetails(applicantDetails, documentDetails);

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

      <div className="flex w-full mx-auto gap-8">
        <div className="w-full ">
          <h1 className="text-xl font-bold">Applicant Details</h1>
          {Object.entries(applicantDetails).map(([key, value]) => (
            <div key={key} className="flex gap-4 justify-between">
              <h2>{key}</h2>
              <p className="overflow-hidden max-w-80">{value}</p>
            </div>
          ))}
        </div>
        <div className="w-full">
          <h1 className="text-xl font-bold">Document Details</h1>
          {Object.entries(documentDetails).map(([key, value]) => (
            <div key={key} className="flex gap-4 justify-between">
              <h2>{key}</h2>
              <p className="overflow-hidden max-w-80">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <h1 className="text-5xl font-bold m-2 mt-10 text-center">
        Automatic Evaluation
      </h1>
      <h1
        className={clsx(
          'text-5xl font-bold m-2 text-center underline',
          isSame ? 'text-green-500' : 'text-red-500'
        )}
      >
        {isSame ? 'Approved' : 'Rejected'}
      </h1>

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

      <h1 className="text-2xl font-bold mt-5">Comments</h1>
      <Input
        type="text"
        placeholder="Give reason for choice"
        value={reason}
        className="w-full my-5 bg-gray-200 text-blue-950 font-semibold"
        onChange={(e) => setReason(e.target.value)}
      />

      <RadioGroup
        defaultValue={status}
        onValueChange={(val) => setStatus(val)}
        className="font-bold text-lg"
      >
        <div className="flex items-center space-x-2 rounded-lg border-2 border-gray-500 w-full p-4">
          <RadioGroupItem value="approved" id="approved" />
          <Label htmlFor="approved">Approved</Label>
        </div>
        <div className="flex items-center space-x-2 rounded-lg border-2 border-gray-500 w-full p-4">
          <RadioGroupItem value="rejected" id="rejected" />
          <Label htmlFor="rejected">Rejected</Label>
        </div>
      </RadioGroup>

      <Button onClick={handleSubmit} className="my-5">
        Submit
      </Button>
    </div>
  );
}
