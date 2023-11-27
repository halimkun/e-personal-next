import type { ReactElement } from 'react'
import type { NextPageWithLayout } from '../../_app';

import { useRouter } from 'next/router';
import AppLayout from '@/components/layouts/app';
import FormAddSuratInternal from "@/components/custom/forms/add-surat-internal"
import LaravelPagination from '@/components/custom/tables/laravel-pagination';

import { useState } from 'react';
import { getDate, getTime } from '@/lib/date';
import { getCookie } from 'cookies-next';
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconPlus, IconDotsVertical } from "@tabler/icons-react"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { DialogDescription, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';


const SuratInternal: NextPageWithLayout = ({ data }: any) => {
  const [open, setOpen] = useState(false)
  const route = useRouter()

  const suratInternalColumns = [
    {
      name: 'Nomor',
      selector: 'no_surat',
      data: (row: any) => <Badge variant="default" className='whitespace-nowrap'>{row.no_surat}</Badge>
    },
    {
      name: 'Status',
      selector: 'status',
      data: (row: any) => (
        <div className='whitespace-nowrap flex gap-2 items-center'>
          <div className="h-2 w-2 rounded-full bg-red-400"></div> {row.status}
        </div>
      )
    },
    {
      name: 'PJ',
      selector: 'pj',
      data: (row: any) => (
        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="outline" className="cursor-pointer group-hover:border-primary">
                {row.pj}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>{row.pj_detail.nama}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    {
      name: 'Perihal',
      selector: 'perihal',
      data: (row: any) => (
        <div>
          {row.perihal.length > 50 ? row.perihal.substring(0, 80) + ' . . .' : row.perihal}
        </div>
      )
    },
    {
      name: 'Tempat',
      selector: 'tempat',
      data: (row: any) => <div>{row.tempat}</div>
    },
    {
      name: 'Tanggal',
      selector: 'tanggal',
      style: [
        'text-right'
      ],
      data: (row: any) => (
        <div className='text-right text-xs'>
          <div className="md:whitespace-nowrap">{getDate(row.tanggal)}</div>
          <div className="md:whitespace-nowrap">{getTime(row.tanggal)}</div>
        </div>
      )
    },
    {
      name: 'Action',
      selector: 'action',
      enableHiding: true,
      style: [
        'text-right'
      ],
      data: (row: any) => (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0" size='icon'>
                <span className="sr-only">Open menu</span>
                <IconDotsVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => {
                  const no = row.no_surat.split('/').join('-')
                  route.push(`/surat/internal/${no}`)
                }}>
                  Detail
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  ]

  return (
    <div className='space-y-4'>
      <div className="flex flex-col md:flex-row gap-3">
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <CardTitle>Disetujui</CardTitle>
                <CardDescription>Surat internal diseujui.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>

          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <CardTitle>Pengajuan</CardTitle>
                <CardDescription>Surat internal dalam pengajuan.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>

          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <CardTitle>Batal</CardTitle>
                <CardDescription>Daftar surat internal batal atau ditolak.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>

          </CardContent>
        </Card>
      </div>


      <Card className="max-w-screen">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <CardTitle>Surat Internal</CardTitle>
              <CardDescription>Daftar surat internal yang telah dibuat.</CardDescription>
            </div>
            <Button variant="default" size="icon" className="w-7 h-7" onClick={() => route.push('/surat/internal/create')}><IconPlus className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" /></Button>
          </div>
        </CardHeader>
        <CardContent>
          <LaravelPagination
            columns={suratInternalColumns}
            dataSrc={"https://sim.rsiaaisyiyah.com/rsiap-api-dev/api/surat/internal"}
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
    </div>
  )
};

SuratInternal.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default SuratInternal;
