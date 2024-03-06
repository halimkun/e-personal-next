import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getDate } from '@/lib/date';
import { cn } from '@/lib/utils';
import { IconDiscountCheckFilled, IconFileSymlink } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { getSession } from 'next-auth/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import useSWR from 'swr';
import dynamic from 'next/dynamic';
import fetcherGet from '@/utils/fetcherGet';
import toast from 'react-hot-toast';

const DialogViewSpo = dynamic(
  () => import('@/components/custom/modals/view-spo'),
  { ssr: false }
);
const Loading1 = dynamic(() => import('@/components/custom/icon-loading'), {
  ssr: false,
});
const TabelSPO = dynamic(() => import('@/components/custom/tables/spo'), {
  ssr: false,
});
const AppLayout = dynamic(() => import('@/components/layouts/app'), {
  ssr: false,
});

const SPOVerif = () => {
  const [spo, setSpo] = useState<any>([]);
  const [isViewSpoOpen, setIsViewSpoOpen] = useState(false);
  const [onConfirm, setOnConfirm] = useState(false);

  const delayDebounceFn = useRef<any>(null);
  const [filterData, setFilterData] = useState({});
  const [filterQuery, setFilterQuery] = useState('');

  const fetcher = (url: string) => fetcherGet({ url, filterQuery });

  const { data, error, mutate, isLoading, isValidating } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/berkas/spo`,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshWhenOffline: false,
      refreshWhenHidden: true,
    }
  );

  useEffect(() => {
    let fq = '';
    for (const [key, value] of Object.entries(filterData)) {
      if (value) {
        fq += fq === '' ? `?${key}=${value}` : `&${key}=${value}`;
      }
    }

    setFilterQuery(fq);
  }, [filterData]);

  useEffect(() => {
    if (delayDebounceFn.current) {
      clearTimeout(delayDebounceFn.current);
    }

    delayDebounceFn.current = setTimeout(() => {
      mutate();
    }, 250);

    return () => clearTimeout(delayDebounceFn.current);
  }, [filterQuery]);

  const spoCol = [
    {
      name: 'Nomor',
      selector: 'no_surat',
      data: (row: any) => (
        <Badge
          variant='outline'
          className='whitespace-nowrap group-hover:border-primary'
        >
          {row.nomor}
        </Badge>
      ),
    },
    {
      name: 'Unit',
      selector: 'unit',
      data: (row: any) => {
        const u = row.unit.split(',');
        const badge = u.length > 1 ? u.slice(0, 1) : u;
        // loop u and make badge if badge more than 2 then make badge with +n
        return (
          <div className='flex flex-row items-start gap-1.5'>
            {badge.map((item: any, i: number) => (
              <Badge
                variant='outline'
                className='max-w-[150px] whitespace-nowrap group-hover:border-primary'
                key={i}
              >
                {item}
              </Badge>
            ))}
            {u.length > 1 && (
              <Badge
                variant='outline'
                className='whitespace-nowrap group-hover:border-primary'
              >
                +{u.length - 1}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      name: 'Judul',
      selector: 'judul',
      data: (row: any) => <div className=''>{row.judul}</div>,
    },
    {
      name: 'Tanggal Terbit',
      selector: 'tanggal_terbit',
      style: ['text-right whitespace-nowrap'],
      data: (row: any) => (
        <div className='text-right'>
          <div className='md:whitespace-nowrap'>{getDate(row.tgl_terbit)}</div>
        </div>
      ),
    },
    {
      name: '#',
      selector: 'Action',
      data: (row: any) => (
        <div className='flex gap-1'>
          <Button
            variant={row.is_verified ? 'secondary' : 'outline'}
            size='icon'
            className={cn(
              'h-6 w-6',
              row.is_verified
                ? 'bg-green-500 text-white dark:bg-green-600 dark:text-gray-100'
                : 'text-gray-600 dark:text-gray-400'
            )}
            onClick={() => {
              setSpo(row);
              setOnConfirm(true);
            }}
          >
            <IconDiscountCheckFilled className='h-4 w-4' />
          </Button>

          <Button
            variant={'default'}
            size='icon'
            className='h-6 w-6'
            disabled={!row.detail}
            onClick={() => {
              setSpo(row);
              setIsViewSpoOpen(true);
            }}
          >
            <IconFileSymlink className='h-4 w-4' />
          </Button>
        </div>
      ),
    },
  ];

  const verifySPO = async (spo: any) => {
    const session = await getSession();
    const no = spo.nomor.replace(/\//g, '--');
    const url = `${process.env.NEXT_PUBLIC_API_URL}/berkas/spo/verify/${no}`;

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.rsiap?.access_token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success('SPO berhasil diverifikasi');
          mutate();
          setOnConfirm(false);
        }
      });
  };

  if (isLoading) return <Loading1 height={50} width={50} />;
  if (error) return <div>{error.message}</div>;
  if (!data) return <div>No data</div>;

  return (
    <div>
      <TabelSPO
        data={data}
        columns={spoCol}
        filterData={filterData}
        setFilterData={setFilterData}
        isValidating={isValidating}
        lastColumnAction={false}
      />

      {/* Dialog View SPO */}
      <DialogViewSpo
        show={isViewSpoOpen}
        onHide={() => setIsViewSpoOpen(false)}
        spo={spo}
      />

      {/* verify confirmation */}
      <Dialog open={onConfirm} onOpenChange={setOnConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Verifikasi SPO</DialogTitle>
            <DialogDescription>
              Apakah anda yakin bahwa SPO ini sudah benar dan dapat diverifikasi
            </DialogDescription>
          </DialogHeader>

          <div className='flex w-full justify-end gap-3'>
            <Button
              size={'sm'}
              variant='secondary'
              onClick={() => setOnConfirm(false)}
            >
              Batal
            </Button>
            <Button
              size={'sm'}
              variant='default'
              onClick={() => {
                // setOnConfirm(false)
                // do something to verify

                verifySPO(spo);
              }}
            >
              Ya, Verifikasi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

SPOVerif.getLayout = (page: any) => {
  return <AppLayout>{page}</AppLayout>;
};

export default SPOVerif;
