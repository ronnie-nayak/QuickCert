import { SelectDocuments } from '@/lib/schema/documents';
import React from 'react';
import { AspectRatio } from '../ui/aspect-ratio';
import { capitalize, underscoreToSpace } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function DocCard({
  id,
  userId,
  title,
  status,
  requestDate,
  approvedDate,
  city,
  state,
  zip,
  address,
  fullName,
  dob,
  expiryDate,
  rejectedDate,
  issueDate,
  thumbnailUrl
}: SelectDocuments) {
  const router = useRouter();
  return (
    <div
      style={{
        minWidth: '285px',
        maxWidth: '550px'
      }}
      className="relative"
    >
      <AspectRatio ratio={290 / 590}>
        <div
          style={{
            display: 'grid',
            gridTemplateRows: '5fr 3fr 1fr',
            gridTemplateAreas: ` "image" "title" "status" `
          }}
          className="h-full bg-white rounded-3xl shadow-2xl"
        >
          <header
            className="overflow-hidden cursor-pointer border-b border-black"
            style={{
              gridArea: 'image',
              backgroundImage: `url(${thumbnailUrl ?? '/doc404.jpg'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            onClick={() => router.push(`/client/${id}`)}
          ></header>
          <section
            style={{
              gridArea: 'title'
            }}
            className="p-4 flex flex-col"
          >
            <h1 className="text-3xl font-bold grow">
              {underscoreToSpace(title)}
            </h1>
            <div className="flex justify-between">
              <p>Name:</p>
              <p>{fullName}</p>
            </div>
            <div className="flex justify-between">
              <p>DOB:</p>
              <p>{new Date(dob).toLocaleDateString()}</p>
            </div>
            <p>{`${city}, ${state}`}</p>
            <div className="flex justify-between">
              <p>Expiry Date:</p>
              <p>{new Date(expiryDate).toLocaleDateString()}</p>
            </div>
          </section>

          <footer
            style={{
              gridArea: 'status',
              alignSelf: 'end'
            }}
            className="flex items-end justify-between px-4 py-8 font-bold text-xl"
          >
            <p>{capitalize(status)}</p>
            {status === 'pending' && (
              <p>{new Date(requestDate).toLocaleDateString()}</p>
            )}
            {status === 'approved' && (
              <p>{new Date(approvedDate ?? '')?.toLocaleDateString()}</p>
            )}
            {status === 'rejected' && (
              <p>{new Date(rejectedDate ?? '')?.toLocaleDateString()}</p>
            )}
          </footer>
        </div>
      </AspectRatio>
    </div>
  );
}
