'use client';
import { SelectDocuments } from '@/lib/schema/documents';
import { capitalize, underscoreToSpace } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { FC } from 'react';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { Button } from '../ui/button';

type TableProps = {
  data: SelectDocuments[];
  orderBy: string;
  column: string;
  createQueryString: (values: { name: string; value: string }[]) => string;
};

const columns = [
  { key: 'title', name: 'Title' },
  { key: 'fullName', name: 'Full Name' },
  { key: 'requestDate', name: 'Request Date' },
  { key: 'status', name: 'Status' }
];

const Table: FC<TableProps> = ({
  data,
  orderBy,
  column,
  createQueryString
}) => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <>
      <div className="w-9/12 mx-auto">
        <div className="text-2xl flex font-bold justify-between mb-2 border-2 rounded-lg border-black  p-4">
          {columns.map((col) => (
            <h1
              key={col.key}
              className="w-1/4 cursor-pointer flex gap-2 items-center"
              onClick={() => {
                const newOrderBy = orderBy === 'asc' ? 'desc' : 'asc';
                const newColumn = col.key;
                const newSearch = createQueryString([
                  { name: 'orderBy', value: newOrderBy },
                  { name: 'column', value: newColumn }
                ]);
                router.push(`${pathname}?${newSearch}`);
              }}
            >
              {col.name}
              {column === col.key ? (
                orderBy === 'asc' ? (
                  <FaSortUp />
                ) : (
                  <FaSortDown />
                )
              ) : (
                <FaSort />
              )}
            </h1>
          ))}
          <h1 className="w-1/12"></h1>
        </div>
        {data.map((doc) => (
          <>
            <div
              key={doc.id}
              className="text-xl flex justify-between px-4 py-2"
            >
              <h1 className="w-1/4">{underscoreToSpace(doc.title)}</h1>
              <h1 className="w-1/4">{capitalize(doc.fullName)}</h1>
              <h1 className="w-1/4">
                {new Date(doc.requestDate).toLocaleDateString()}
              </h1>
              <h1 className="w-1/4">{capitalize(doc.status)}</h1>
              <div className="w-1/12">
                <Button
                  onClick={() => router.push(`/admin/${doc.id}`)}
                  className="bg-white border rounded-xl border-black text-black hover:bg-black text-2xl hover:text-white font-semibold py-2 px-4"
                >
                  {' '}
                  View{' '}
                </Button>
              </div>
            </div>
            <div className="border-b border-black"></div>
          </>
        ))}
      </div>
    </>
  );
};

export default Table;
