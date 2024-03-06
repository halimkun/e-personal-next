import { useEffect, useRef, useState } from 'react';

import useSWR from 'swr';
import dynamic from 'next/dynamic';
import fetcherGet from '@/utils/fetcherGet';

import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-menubar';
import { useDebounce } from 'use-debounce';

const LaravelPagingx = dynamic(
  () => import('@/components/custom-ui/laravel-paging'),
  { ssr: false }
);

interface TablePegawaiProps {
  columnsData: any;
  datatables?: string | '0' | '1';
  select?: string;
  withTable?: string;
}

// default value for datatables is true
const propsDefault: TablePegawaiProps = {
  columnsData: [],
  datatables: '0',
  select: 'nik,nama,bidang,jbtn',
  withTable: 'dpt',
};

const TablePegawai = (props: TablePegawaiProps) => {
  const { columnsData, datatables, select, withTable } = {
    ...propsDefault,
    ...props,
  };

  const [filterQuery, setFilterQuery] = useState('');
  const [filterData, setFilterData] = useState<any>({});
  const [debouncedFilterQuery] = useDebounce(filterQuery, 1000);

  const fetcher = (url: string) => fetcherGet({ url, filterQuery });

  const { data, error, mutate, isLoading, isValidating } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/pegawai?datatables=${datatables}&select=${select}&with=${withTable}`,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshWhenOffline: false,
      refreshWhenHidden: true,
    }
  );

  useEffect(() => {
    const count = Object.keys(filterData).length;

    if (count > 0) {
      let fq = '';
      for (const [key, value] of Object.entries(filterData)) {
        if (value) {
          fq += fq === '' ? `&${key}=${value}` : `&${key}=${value}`;
        }
      }
      setFilterQuery(fq);
    }
  }, [filterData]);

  useEffect(() => {
    mutate();
  }, [debouncedFilterQuery, mutate]);

  return (
    data && (
      <>
        <div className='mb-4 mt-4 flex w-full flex-col items-center justify-end gap-4 rounded-xl border border-border bg-gray-100/50 p-4 dark:bg-gray-900/50 md:flex-row'>
          <div className='w-full space-y-1'>
            <Label>Search</Label>
            <Input
              type='search'
              placeholder='Search...'
              className='w-full border-border'
              defaultValue={filterData?.keyword}
              onChange={(e) => {
                setFilterData({ ...filterData, keyword: e.target.value });
              }}
            />
          </div>
        </div>

        <LaravelPagingx
          columnsData={columnsData}
          data={data?.data}
          filterData={filterData}
          setFilterData={setFilterData}
          // isValidating={isValidating}
        />
      </>
    )
  );
};

export default TablePegawai;
