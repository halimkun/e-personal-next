import React, { ReactElement } from 'react';
import { NextPageWithLayout } from '../_app';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  IconDotsVertical,
  IconEditCircle,
  IconReportSearch,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';

const AppLayout = dynamic(() => import('@/components/layouts/app'), {
  ssr: false,
});
const LaravelPagination = dynamic(
  () => import('@/components/custom-ui/laravel-pagination'),
  { ssr: false }
);

const suratInternalColumns = [
  {
    name: 'Nama',
    selector: 'nama',
    data: (row: any) => <div>{row.nama}</div>,
  },
  {
    name: 'Bidang',
    selector: 'bidang',
    data: (row: any) => <div>{row.bidang}</div>,
  },
  {
    name: 'Jabatan',
    selector: 'jabatan',
    data: (row: any) => <div>{row.jbtn}</div>,
  },
  {
    name: 'Departemen',
    selector: 'departemen',
    data: (row: any) => <div>{row.dpt.nama}</div>,
  },
  {
    name: 'NIK',
    selector: 'nik',
    style: ['text-right'],
    data: (row: any) => (
      <div className='flex w-full justify-end'>
        <Badge
          variant='outline'
          className='cursor-pointer group-hover:border-primary'
        >
          {row.nik}
        </Badge>
      </div>
    ),
  },
  {
    name: 'Action',
    selector: 'action',
    enableHiding: true,
    data: (row: any) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0' size='icon'>
            <span className='sr-only'>Open menu</span>
            <IconDotsVertical className='h-5 w-5' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-40'>
          <DropdownMenuLabel>Data</DropdownMenuLabel>
          <DropdownMenuGroup>
            <span className='flex flex-col gap-1'>
              <DropdownMenuItem
                onClick={() => toast.error('Fitur ini belum tersedia')}
                className='cursor-pointer hover:bg-secondary'
              >
                <IconEditCircle className='mr-2 h-4 w-4' /> Edit Data
              </DropdownMenuItem>
            </span>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Berkas</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem className='cursor-pointer hover:bg-secondary'>
              <Link href={`/karyawan/berkas/${row.nik}`} className='flex gap-1'>
                <IconReportSearch className='mr-2 h-4 w-4' /> Lihat Berkas
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const KaryawanPage: NextPageWithLayout = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Karyawan</CardTitle>
        <CardDescription>
          Data Karyawan <strong>RSIA Aisyiyah Pekajangan</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LaravelPagination
          columns={suratInternalColumns}
          dataSrc={`${process.env.NEXT_PUBLIC_API_URL}/pegawai?datatables=0&select=nik,nama,bidang,jbtn`}
          fetcher={{ method: 'GET' }}
        />
      </CardContent>
    </Card>
  );
};

KaryawanPage.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default KaryawanPage;
