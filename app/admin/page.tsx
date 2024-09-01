'use client';
import Table from '@/components/admin/table';
import { Loading } from '@/components/loading';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { SelectDocuments } from '@/lib/schema/documents';
import { capitalize, cn } from '@/lib/utils';
import axios from 'axios';
import { CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

export default function AdminPage() {
  const [documents, setDocuments] = useState<SelectDocuments[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminCenter, setAdminCenter] = useState('');

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (values: { name: string; value: string }[]) => {
      const params = new URLSearchParams(searchParams.toString());
      values.forEach(({ name, value }) => {
        params.set(name, value);
      });

      return params.toString();
    },
    [searchParams]
  );

  const search = searchParams.get('search') || '';
  const offset = parseInt(searchParams.get('offset') || '0');
  const orderBy = searchParams.get('orderBy') || 'asc';
  const column = searchParams.get('column') || 'requestDate';
  const type = searchParams.get('type') || '';
  const startDate = searchParams.get('startDate') || 'Mon Jan 01 1900';
  const endDate = searchParams.get('endDate') || 'Sun Dec 31 2099';

  const fetchDocuments = async () => {
    try {
      const response: any = await axios.get('/api/documents', {
        params: { search, offset, orderBy, column, type, startDate, endDate }
      });
      setDocuments(response.data.documents);
      setAdminCenter(response.data.adminCenter);
      setError('');
    } catch (error: any) {
      setError(error.message);
      console.error(error.message);

      if (error.response?.data.error === 'Unauthorized') {
        router.replace('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const removeTimeout = setTimeout(() => fetchDocuments(), 100);

    return () => clearTimeout(removeTimeout);
  }, [search, offset, orderBy, column, type, startDate, endDate]);

  if (loading)
    return (
      <div className="p-20">
        <Loading />
      </div>
    );

  if (error)
    return (
      <div className="p-20 text-red-500 flex justify-center items-center text-6xl font-bold">
        Center not assigned Yet
      </div>
    );

  return (
    <>
      <div className="p-10 flex gap-8 items-center font-bold text-2xl w-9/12 mx-auto">
        <h1>Assigned Center: {capitalize(adminCenter)}</h1>
        <Link href="/admin/analytics">
          <Button>Analytics</Button>
        </Link>
      </div>

      <div className="mt-2 flex flex-col items-center gap-4 sm:flex-row w-9/12 mx-auto pt-10 pb-6">
        <div className="flex w-full items-center gap-2 sm:w-1/3 ">
          <Button
            type="reset"
            onClick={() => {
              router.replace('/admin');
            }}
          >
            Clear
          </Button>
          <Input
            type="text"
            placeholder="Search"
            value={search}
            className="w-full"
            onChange={(e) => {
              const value = e.target.value;
              router.replace(
                `${pathname}?${createQueryString([
                  { name: 'search', value },
                  { name: 'offset', value: '0' }
                ])}`
              );
            }}
          />
        </div>
        <Select
          value={type}
          onValueChange={(val) =>
            router.replace(
              pathname +
                '?' +
                createQueryString([
                  { name: 'type', value: val },
                  { name: 'offset', value: '0' }
                ])
            )
          }
        >
          <SelectTrigger className="w-full sm:w-1/6">
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-[240px] pl-3 text-left font-normal',
                !startDate && 'text-muted-foreground'
              )}
            >
              {startDate ? (
                new Date(startDate).toDateString()
              ) : (
                <span>Pick Start date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              onSelect={(date) => {
                router.replace(
                  pathname +
                    '?' +
                    createQueryString([
                      { name: 'startDate', value: date?.toDateString()! },
                      { name: 'offset', value: '0' }
                    ])
                );
              }}
              disabled={(date) =>
                date > new Date() || date < new Date('1900-01-01')
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <span className="hidden sm:inline sm:text-6xl">&#8651;</span>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-[240px] pl-3 text-left font-normal',
                !endDate && 'text-muted-foreground'
              )}
            >
              {endDate ? (
                new Date(endDate).toDateString()
              ) : (
                <span>Pick End date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              onSelect={(date) => {
                router.replace(
                  pathname +
                    '?' +
                    createQueryString([
                      { name: 'endDate', value: date?.toDateString()! },
                      { name: 'offset', value: '0' }
                    ])
                );
              }}
              disabled={(date) =>
                date > new Date() || date < new Date('1900-01-01')
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <Table
        data={documents}
        orderBy={orderBy}
        column={column}
        createQueryString={createQueryString}
      />
      <div className="w-9/12 mx-auto my-8 flex gap-4">
        <Button
          disabled={offset <= 0}
          onClick={() => {
            router.push(
              `${pathname}?${createQueryString([{ name: 'offset', value: `${offset - 5}` }])}`
            );
          }}
        >
          {' '}
          Previous{' '}
        </Button>
        <Button
          disabled={documents.length === 0 || documents.length < 5}
          onClick={() => {
            router.push(
              `${pathname}?${createQueryString([
                { name: 'offset', value: `${offset + 5}` }
              ])}`
            );
          }}
        >
          {' '}
          Next{' '}
        </Button>
      </div>
    </>
  );
}
