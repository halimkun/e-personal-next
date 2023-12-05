import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import type { ReactElement } from 'react'
import type { NextPageWithLayout } from '../../_app';

import CountUp from 'react-countup';
import AppLayout from '@/components/layouts/app';
import LaravelPagination from '@/components/custom/tables/laravel-pagination';
import UpdateStatusSuratInternal from '@/components/custom/forms/update-status-surat-internal';

import { cn } from '@/lib/utils';
import { Badge } from "@/components/ui/badge"
import { getDate, getTime } from '@/lib/date';
import { Button } from "@/components/ui/button"
import { IconPlus, IconDotsVertical, IconTag } from "@tabler/icons-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';


const SuratInternal: NextPageWithLayout = () => {
  const [ss, setSS] = useState<any>()
  const [metrics, setMetrics] = useState<any>([
    { status: 'disetujui', total: 0 },
    { status: 'pengajuan', total: 0 },
    { status: 'ditolak', total: 0 }
  ])
  const [status, setStatus] = useState<any>('pengajuan')
  const route = useRouter()

  useEffect(() => {
    const fetchMetrics = async () => {
      const session = await getSession()
      setSS(session)
      const res = await fetch('https://sim.rsiaaisyiyah.com/rsiap-api-dev/api/surat/internal/metrics', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.rsiap?.access_token}`,
        }
      });

      const d = await res.json();
      setMetrics(d.data)
    }

    fetchMetrics();
  }, [])

  const suratInternalColumns = [
    {
      name: 'Nomor',
      selector: 'no_surat',
      data: (row: any) => (
        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant={
                row.status == 'disetujui' ? 'default' :
                  row.status == 'pengajuan' ? 'warning' :
                    row.status == 'ditolak' ? 'danger' : 'outline'
              } className='whitespace-nowrap'>{row.no_surat}</Badge>
            </TooltipTrigger>
            <TooltipContent className={cn("font-bold shadow", {
              "bg-yellow-100 border-[1.5px] text-warning border-warning": row.status == 'pengajuan',
              "bg-blue-100 border-[1.5px] text-primary border-primary": row.status == 'disetujui',
              "bg-red-100 border-[1.5px] text-danger border-danger": row.status == 'ditolak',
            })}>{row.status}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    {
      name: 'PJ',
      selector: 'pj',
      data: (row: any) => (
        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant={"outline"} className={
                cn("cursor-pointer", {
                  "group-hover:bg-yellow-100 group-hover:border-yellow-600 group-hover:text-yellow-600": row.status == 'pengajuan',
                  "group-hover:bg-blue-100 group-hover:border-blue-600 group-hover:text-blue-600": row.status == 'disetujui',
                  "group-hover:bg-red-100 group-hover:border-red-600 group-hover:text-red-600": row.status == 'ditolak',
                })
              }>
                {row.pj}
              </Badge>
            </TooltipTrigger>
            <TooltipContent className={cn("font-bold shadow", {
              "bg-warning border-warning": row.status == 'pengajuan',
              "bg-primary border-primary": row.status == 'disetujui',
              "bg-danger border-danger": row.status == 'ditolak',
            })
            }>{row.pj_detail.nama}</TooltipContent>
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
        <div className='space-x-1 text-right whitespace-nowrap'>
          <Dialog>
            <DialogTrigger>
              <Button variant="ghost" className="h-8 w-8 p-0" size='icon' onClick={() => {
                setStatus(row.status)
              }}>
                <span className="sr-only">Open menu</span>
                <IconTag className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Status Surat ?</DialogTitle>
                <DialogDescription>Anda dapat mengubah status surat sesuai dengan kebutuhan.</DialogDescription>
              </DialogHeader>

              <UpdateStatusSuratInternal status={status} setStatus={setStatus} nomor_surat={row.no_surat} />
            </DialogContent>
          </Dialog>


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
                <DropdownMenuItem onClick={() => route.push(`/surat/internal/${row.no_surat.split('/').join('_')}/edit`)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => route.push(`/surat/internal/${row.no_surat.split('/').join('_')}/detail`)}>
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
                <CardTitle className="text-success">Disetujui</CardTitle>
                <CardDescription>Surat internal diseujui.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {metrics.filter((metric: any) => metric.status == 'disetujui').map((metric: any) => (
              <div className='w-full flex justify-end font-bold text-2xl text-success' key={metric.status}>
                <CountUp
                  start={0}
                  end={metric.total}
                  duration={5}
                />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <CardTitle className="text-warning">Pengajuan</CardTitle>
                <CardDescription>Surat internal dalam pengajuan.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {metrics.filter((metric: any) => metric.status == 'pengajuan').map((metric: any) => (
              <div className='w-full flex justify-end font-bold text-2xl text-warning' key={metric.status}>
                <CountUp
                  start={0}
                  end={metric.total}
                  duration={5}
                />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <CardTitle className="text-danger">Batal / Ditolak</CardTitle>
                <CardDescription>Surat internal batal atau ditolak.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {metrics.filter((metric: any) => metric.status == 'ditolak').map((metric: any) => (
              <div className='w-full flex justify-end font-bold text-2xl text-danger' key={metric.status}>
                <CountUp
                  start={0}
                  end={metric.total}
                  duration={5}
                />
              </div>
            ))}
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
            // onRowClick={(row: any) => {
            //   toast({
            //     title: 'Coming soon!',
            //     description: row.no_surat,
            //   })
            // }}
            dataSrc={"https://sim.rsiaaisyiyah.com/rsiap-api-dev/api/surat/internal"}
            fetcher={{ method: "GET" }}
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
