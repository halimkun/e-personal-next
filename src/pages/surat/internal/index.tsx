import { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '../../_app';

import useSWR from 'swr';
import dynamic from 'next/dynamic';
import fetcherGet from '@/utils/fetcherGet';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { getDate } from '@/lib/date';
import { Button } from '@/components/ui/button';
import {
  IconPlus,
  IconDotsVertical,
  IconTag,
  IconSearch,
  IconWriting,
  IconQrcode,
} from '@tabler/icons-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconEditCircle } from '@tabler/icons-react';
import { IconPrinter } from '@tabler/icons-react';

const UpdateStatusSuratInternal = dynamic(
  () => import('@/components/custom/forms/update-status-surat-internal'),
  { ssr: false }
);
const TabelSuratInternal = dynamic(
  () => import('@/components/custom/tables/surat-internal'),
  { ssr: false }
);
const Loading1 = dynamic(() => import('@/components/custom/icon-loading'), {
  ssr: false,
});
const AppLayout = dynamic(() => import('@/components/layouts/app'), {
  ssr: false,
});

const SuratInternal: NextPageWithLayout = () => {
  const route = useRouter();
  const delayDebounceFn = useRef<any>(null);
  const [status, setStatus] = useState<any>('pengajuan');
  const [filterData, setFilterData] = useState({});
  const [filterQuery, setFilterQuery] = useState('');

  const [metrics, setMetrics] = useState<any>([
    { status: 'disetujui', total: 0 },
    { status: 'pengajuan', total: 0 },
    { status: 'ditolak', total: 0 },
  ]);

  useEffect(() => {
    const fetchMetrics = async () => {
      const session = await getSession();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/surat/internal/metrics`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.rsiap?.access_token}`,
          },
        }
      );

      const d = await res.json();
      setMetrics(d.data);
    };

    fetchMetrics();
  }, []);

  const fetcher = (url: string) => fetcherGet({ url, filterQuery });

  const { data, error, mutate, isLoading, isValidating } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/surat/internal`,
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

  if (isLoading) return <Loading1 height={50} width={50} />;
  if (error) return <div>{error.message}</div>;
  if (!data) return <div>No data</div>;

  const suratInternalColumns = [
    {
      name: 'Nomor',
      selector: 'no_surat',
      data: (row: any) => (
        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger>
              <Badge
                variant={
                  row.status == 'disetujui'
                    ? 'success'
                    : row.status == 'pengajuan'
                      ? 'outline'
                      : row.status == 'ditolak'
                        ? 'danger'
                        : 'outline'
                }
                className='whitespace-nowrap'
              >
                {row.no_surat}
              </Badge>
            </TooltipTrigger>
            <TooltipContent
              className={cn('font-bold shadow', {
                'border-[1.5px] border-warning bg-yellow-100 text-warning':
                  row.status == 'pengajuan',
                'border-[1.5px] border-border bg-green-100 text-success-foreground':
                  row.status == 'disetujui',
                'border-[1.5px] border-danger bg-red-100 text-danger':
                  row.status == 'ditolak',
              })}
            >
              {row.status}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      name: 'PJ',
      selector: 'pj',
      data: (row: any) => (
        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger>
              <Badge
                variant={'outline'}
                className={cn('cursor-pointer', {
                  'group-hover:border-yellow-600 group-hover:bg-yellow-100 group-hover:text-yellow-600':
                    row.status == 'pengajuan',
                  'group-hover:border-green-600 group-hover:bg-green-100 group-hover:text-green-700':
                    row.status == 'disetujui',
                  'group-hover:border-red-600 group-hover:bg-red-100 group-hover:text-red-600':
                    row.status == 'ditolak',
                })}
              >
                {row.pj}
              </Badge>
            </TooltipTrigger>
            <TooltipContent
              className={cn('font-bold shadow', {
                'border-warning bg-warning text-warning-foreground':
                  row.status == 'pengajuan',
                'border-success bg-success text-success-foreground':
                  row.status == 'disetujui',
                'border-danger bg-danger text-danger-foreground':
                  row.status == 'ditolak',
              })}
            >
              {row.pj_detail ? row.pj_detail.nama : row.pj}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      name: 'Perihal',
      selector: 'perihal',
      data: (row: any) => (
        <div>
          {row.perihal.length > 50
            ? row.perihal.substring(0, 80) + ' . . .'
            : row.perihal}
        </div>
      ),
    },
    {
      name: 'Tempat',
      selector: 'tempat',
      data: (row: any) => <div>{row.tempat}</div>,
    },
    {
      name: 'Tgl Terbit',
      selector: 'tanggal',
      style: ['text-right'],
      data: (row: any) => (
        <div className='text-right text-xs'>
          <div className='md:whitespace-nowrap'>{getDate(row.tgl_terbit)}</div>
        </div>
      ),
    },
    {
      name: 'Action',
      selector: 'action',
      enableHiding: true,
      data: (row: any) => (
        <div className='flex items-center justify-end gap-0.5'>
          <Dialog>
            <DialogTrigger
              className='flex h-8 w-8 items-center justify-center rounded-lg bg-transparent hover:bg-foreground/5'
              onClick={() => {
                setStatus(row.status);
              }}
            >
              <span className='sr-only'>Open menu</span>
              <IconTag className='h-5 w-5' />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Status Surat ?</DialogTitle>
                <DialogDescription>
                  Anda dapat mengubah status surat sesuai dengan kebutuhan.
                </DialogDescription>
              </DialogHeader>

              <UpdateStatusSuratInternal
                status={status}
                setStatus={setStatus}
                nomor_surat={row.no_surat}
              />
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger className='flex h-8 w-8 items-center justify-center rounded-lg bg-transparent hover:bg-foreground/5'>
              <span className='sr-only'>Open menu</span>
              <IconDotsVertical className='h-5 w-5' />
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {row.penerima && row.penerima.length > 0 && (
                <>
                  <DropdownMenuLabel>Files</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => {
                        // open in new tab API_URL
                        window.open(
                          `${process.env.NEXT_PUBLIC_API_URL}/surat/internal/${row.no_surat.split('/').join('--')}/cetak-undangan`,
                          '_blank'
                        );
                      }}
                    >
                      <IconPrinter className='me-2 h-4 w-4' /> Cetak Undangan
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => {
                        // open in new tab API_URL
                        route.push(
                          `/berkas/notulen/${row.no_surat.split('/').join('--')}/new`
                        );
                      }}
                    >
                      <IconWriting className='me-2 h-4 w-4' /> Buat Notulen
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => {
                        // open in new tab API_URL
                        route.push(
                          `/surat/internal/${row.no_surat.split('/').join('--')}/qr`
                        );
                      }}
                    >
                      <IconQrcode className='me-2 h-4 w-4' /> QR Kehadiran
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </>
              )}
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() =>
                    route.push(
                      `/surat/internal/${row.no_surat.split('/').join('_')}/edit`
                    )
                  }
                >
                  <IconEditCircle className='me-2 h-4 w-4' /> Edit Surat
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    route.push(
                      `/surat/internal/${row.no_surat.split('/').join('_')}/detail`
                    )
                  }
                >
                  <IconSearch className='me-2 h-4 w-4' /> Detail Surat
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-3 md:flex-row'>
        <Card className='w-full'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div className='flex flex-col gap-2'>
                <CardTitle className='text-success'>Disetujui</CardTitle>
                <CardDescription>Surat internal diseujui.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {metrics
              .filter((metric: any) => metric.status == 'disetujui')
              .map((metric: any) => (
                <div
                  className='flex w-full justify-end text-2xl font-bold text-success'
                  key={metric.status}
                >
                  {metric.total}
                </div>
              ))}
          </CardContent>
        </Card>
        <Card className='w-full'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div className='flex flex-col gap-2'>
                <CardTitle className='text-warning'>Pengajuan</CardTitle>
                <CardDescription>
                  Surat internal dalam pengajuan.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {metrics
              .filter((metric: any) => metric.status == 'pengajuan')
              .map((metric: any) => (
                <div
                  className='flex w-full justify-end text-2xl font-bold text-warning'
                  key={metric.status}
                >
                  {metric.total}
                </div>
              ))}
          </CardContent>
        </Card>
        <Card className='w-full'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div className='flex flex-col gap-2'>
                <CardTitle className='text-danger'>Batal / Ditolak</CardTitle>
                <CardDescription>
                  Surat internal batal atau ditolak.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {metrics
              .filter((metric: any) => metric.status == 'ditolak')
              .map((metric: any) => (
                <div
                  className='flex w-full justify-end text-2xl font-bold text-danger'
                  key={metric.status}
                >
                  {metric.total}
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      <Card className='max-w-screen'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='flex flex-col gap-2'>
              <CardTitle>Surat Internal</CardTitle>
              <CardDescription>
                Daftar surat internal RSIA Aisyiyah Pekajangan.
              </CardDescription>
            </div>
            <Button
              variant='default'
              size='icon'
              className='h-7 w-7'
              onClick={() => route.push('/surat/internal/create')}
            >
              <IconPlus className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all' />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <TabelSuratInternal
            data={data}
            columns={suratInternalColumns}
            filterData={filterData}
            setFilterData={setFilterData}
            isValidating={isValidating}
            key={data?.data?.length}
            lastColumnAction={true}
          />
        </CardContent>
      </Card>
    </div>
  );
};

SuratInternal.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default SuratInternal;
