import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState, useEffect } from 'react';
import { getPageNumber } from '@/lib/urls';
import { IconInnerShadowTop } from '@tabler/icons-react';
import { Input } from '@/components/ui/input';
import { getSession } from 'next-auth/react';

interface FetcherProps {
  url?: string | null;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  headers?: any;
  body?: any[];
}

interface optionsProps {
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: any;
  path: string;
  per_page: string;
  prev_page_url: any;
  to: number;
  total: number;
}

interface LaravelPaginationProps {
  columns: {
    name: string;
    selector: string;
    enableHiding?: boolean;
    style?: string[];
    data: (row: any) => JSX.Element;
  }[];
  onRowClick?: (row: any) => void;
  dataSrc: string;
  fetcher: FetcherProps;
}

async function fetchData({ url, method, headers, body }: FetcherProps) {
  const sesstion = await getSession();
  const requestOptions: any = {
    method: method ?? 'GET',
    headers: headers ?? {
      Authorization: `Bearer ${sesstion?.rsiap?.access_token}`,
    },
  };

  if (method !== 'GET') {
    requestOptions.body = JSON.stringify(body) ?? {};
  }

  return await fetch(url ?? '', requestOptions).then((res) => res.json());
}

const LaravelPagination = (props: LaravelPaginationProps) => {
  const { columns, onRowClick, dataSrc, fetcher } = props;
  const [page, setPage] = useState(1);
  const [keword, setKeyword] = useState<string>('');
  const [data, setData] = useState([]);
  const [options, setOptions] = useState<optionsProps | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setIsLoading(true);
      const newUrl = new URL(dataSrc);
      newUrl.searchParams.set('page', page.toString());
      newUrl.searchParams.set('keyword', keword);

      fetchData({
        url: newUrl.toString(),
        method: fetcher.method,
        headers: fetcher?.headers,
        body: fetcher?.body,
      }).then((res) => {
        if (res.success) {
          setData(res.data.data);
          delete res.data.data;

          setOptions(res.data);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [page, keword, dataSrc, fetcher]);

  return (
    <>
      <div className='mb-4 flex w-full items-center justify-between'>
        <div></div>
        <div>
          <Input
            type='search'
            placeholder='Search...'
            className='w-full'
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* table */}
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column: any) => (
              <TableHead key={column.selector} className={column.style ?? ''}>
                {column.enableHiding ? (
                  <span className='sr-only'>{column.name}</span>
                ) : (
                  <span>{column.name}</span>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <span className='flex w-full items-center justify-center gap-2'>
                  <IconInnerShadowTop className='h-4 w-4 animate-spin' />{' '}
                  Loading...
                </span>
              </TableCell>
            </TableRow>
          ) : (
            data.map((d: any) => (
              <TableRow key={d?.no_surat} className='group'>
                {columns.map((column: any, index: number) => (
                  <TableCell
                    key={column.selector}
                    onClick={
                      index == columns.length - 1
                        ? undefined
                        : () => onRowClick?.(d)
                    }
                  >
                    {column.data(d)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* pagination */}
      <div className='mt-4 flex w-full items-center justify-between'>
        {/* left info */}
        <div className='flex items-center gap-2'>
          <span className='text-xs text-gray-600'>
            Showing {options?.from} to {options?.to} of {options?.total} entries{' '}
            <br />
            Page {options?.current_page} of {options?.last_page}
          </span>
        </div>

        {/* right pagination next and prefv */}
        <div className='flex items-center gap-2'>
          <Button
            type='button'
            variant='default'
            size='icon'
            className='h-7 w-7'
            disabled={options?.prev_page_url === null}
            onClick={() => setPage(getPageNumber(options?.prev_page_url))}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M10.707 4.293a1 1 0 010 1.414L7.414 10l3.293 3.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                clipRule='evenodd'
              />
            </svg>
          </Button>

          <Button
            type='button'
            variant='default'
            size='icon'
            className='h-7 w-7'
            disabled={options?.next_page_url === null}
            onClick={() => setPage(getPageNumber(options?.next_page_url))}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-[1.2rem] w-[1.2rem] rotate-180 scale-100 transition-all'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M10.707 4.293a1 1 0 010 1.414L7.414 10l3.293 3.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                clipRule='evenodd'
              />
            </svg>
          </Button>
        </div>
      </div>
    </>
  );
};

export default LaravelPagination;
