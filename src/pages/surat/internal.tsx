import type { ReactElement } from 'react'
import type { NextPageWithLayout } from '../_app';

import AppLayout from '@/components/layouts/app';
import FormAddSuratInternal from "@/components/custom/forms/add-surat-internal"

import { useState } from 'react';
import { IconPlus, IconDotsVertical } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { getCookie } from 'cookies-next';
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { DialogDescription, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from "@/components/ui/badge"
import { getDate, getTime } from '@/lib/date';
import LaravelPagination from '@/components/custom/tables/laravel-pagination';

const suratInternalColumns = [
  {
    name: 'Nomor',
    selector: 'no_surat',
    data: (row: any) => <Badge variant="default" className='whitespace-nowrap'>{row.no_surat}</Badge>
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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.no_surat)} className='cursor-pointer'>
              Copy Nomor Surat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }
]

const SuratInternal: NextPageWithLayout = ({ data }: any) => {
  const [open, setOpen] = useState(false)

  return (
    <div className='space-y-4'>
      <Card className="max-w-screen">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <CardTitle>Surat Internal</CardTitle>
              <CardDescription>Daftar surat internal yang telah dibuat.</CardDescription>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="default" size="icon" className="w-7 h-7"><IconPlus className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" /></Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle><strong className="text-lg">Tambah Surat Internal</strong></DialogTitle>
                  <DialogDescription>
                    Tambahkan surat internal baru sebagai history surat internal yang telah dibuat.
                  </DialogDescription>
                </DialogHeader>
                <FormAddSuratInternal setOpen={setOpen} />
              </DialogContent>
            </Dialog>
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

// export async function getServerSideProps(context: { req: any; res: any; }) {
//   const token = context.req.cookies.access_token || '';
//   const res = await fetch(`https://sim.rsiaaisyiyah.com/rsiap-api-dev/api/surat/internal`, {
//     method: 'GET',
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   });

//   const data = await res.json();

//   return {
//     props: {
//       data: data.data
//     }
//   }
// }

SuratInternal.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default SuratInternal;
