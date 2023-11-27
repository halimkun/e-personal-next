import React, { ReactElement } from 'react';
import { NextPageWithLayout } from '../_app';
import { getCookie } from 'cookies-next';
import LaravelPagination from '@/components/custom/tables/laravel-pagination';
import AppLayout from '@/components/layouts/app';

import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconDotsVertical, IconEditCircle, IconReportSearch } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast, useToast } from '@/components/ui/use-toast';
import Link from 'next/link';



const suratInternalColumns = [
  {
    name: 'Nama',
    selector: 'nama',
    data: (row: any) => <div>{row.nama}</div>
  },
  {
    name: 'Bidang',
    selector: 'bidang',
    data: (row: any) => <div>{row.bidang}</div>
  },
  {
    name: 'Jabatan',
    selector: 'jabatan',
    data: (row: any) => <div>{row.jbtn}</div>
  },
  {
    name: 'Departemen',
    selector: 'departemen',
    data: (row: any) => <div>{row.dpt.nama}</div>
  },
  {
    name: 'NIK',
    selector: 'nik',
    style: ['text-right'],
    data: (row: any) => (
      <div className="w-full flex justify-end">
        <Badge variant="outline" className="cursor-pointer group-hover:border-primary">
          {row.nik}
        </Badge>
      </div>
    )
  },
  {
    name: 'Action',
    selector: 'action',
    enableHiding: true,
    data: (row: any) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" size='icon'>
            <span className="sr-only">Open menu</span>
            <IconDotsVertical className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className='w-40'>
          <DropdownMenuLabel>Data</DropdownMenuLabel>
          <DropdownMenuGroup>
            <span className="flex flex-col gap-1">
              <DropdownMenuItem onClick={() => toast({
                title: 'Edit Data',
                description: 'Fitur ini belum tersedia',
                duration: 5000,
              })} className='cursor-pointer hover:bg-secondary'>
                <IconEditCircle className='h-4 w-4 mr-2' /> Edit Data
              </DropdownMenuItem>
            </span>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Berkas</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem className='cursor-pointer hover:bg-secondary'>
              <Link href={`/karyawan/berkas/${row.nik}`} className='flex gap-1'>
                <IconReportSearch className='h-4 w-4 mr-2' /> Lihat Berkas
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
]

const KaryawanPage: NextPageWithLayout = () => {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Karyawan</CardTitle>
        <CardDescription>Data Karyawan <strong>RSIA Aisyiyah Pekajangan</strong></CardDescription>
      </CardHeader>
      <CardContent>
        <LaravelPagination
          columns={suratInternalColumns}
          dataSrc={"https://sim.rsiaaisyiyah.com/rsiap-api-dev/api/pegawai?datatables=0&select=nik,nama,bidang,jbtn"}
          fetcher={{
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${getCookie('access_token')}`,
            }
          }}
        />
      </CardContent>
    </Card>
  );
};

KaryawanPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default KaryawanPage;
