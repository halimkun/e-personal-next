import { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import type { ReactElement } from 'react'
import type { NextPageWithLayout } from '../../_app';

import useSWR from 'swr';
import AppLayout from '@/components/layouts/app';
import Loading1 from '@/components/custom/icon-loading';
import TabelSuratInternal from '@/components/custom/tables/surat-internal';
import UpdateStatusSuratInternal from '@/components/custom/forms/update-status-surat-internal';

import { cn } from '@/lib/utils';
import { Badge } from "@/components/ui/badge"
import { getDate, getTime } from '@/lib/date';
import { Button } from "@/components/ui/button"
import { IconPlus, IconDotsVertical, IconTag, IconSearch } from "@tabler/icons-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { IconEditCircle } from '@tabler/icons-react';
import { IconPrinter } from '@tabler/icons-react';
import toast from 'react-hot-toast';


const SuratInternal: NextPageWithLayout = () => {
  const route = useRouter();
  const delayDebounceFn = useRef<any>(null)
  const [status, setStatus] = useState<any>('pengajuan');
  const [filterData, setFilterData] = useState({})
  const [filterQuery, setFilterQuery] = useState('')

  const [metrics, setMetrics] = useState<any>([
    { status: 'disetujui', total: 0 },
    { status: 'pengajuan', total: 0 },
    { status: 'ditolak', total: 0 }
  ])

  useEffect(() => {
    const fetchMetrics = async () => {
      const session = await getSession()
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/surat/internal/metrics`, {
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

  const fetcher = async (url: any) => {
    const session = await getSession()
    const response = await fetch(url + filterQuery, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.rsiap?.access_token}`,
      },
    })

    if (!response.ok) {
      throw new Error(response.status + ' ' + response.statusText)
    }

    const jsonData = await response.json()
    return jsonData
  }

  const { data, error, mutate, isLoading, isValidating } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/surat/internal`, fetcher, {
    revalidateOnFocus: false,
    refreshWhenOffline: false,
    refreshWhenHidden: true,
  })

  useEffect(() => {
    let fq = ''
    for (const [key, value] of Object.entries(filterData)) {
      if (value) {
        fq += fq === '' ? `?${key}=${value}` : `&${key}=${value}`
      }
    }

    setFilterQuery(fq)
  }, [filterData])

  useEffect(() => {
    if (delayDebounceFn.current) {
      clearTimeout(delayDebounceFn.current);
    }

    delayDebounceFn.current = setTimeout(() => {
      mutate();
    }, 250);

    return () => clearTimeout(delayDebounceFn.current);
  }, [filterQuery]);

  if (isLoading) return <Loading1 height={50} width={50} />
  if (error) return <div>{error.message}</div>
  if (!data) return <div>No data</div>

  const suratInternalColumns = [
    {
      name: 'Nomor',
      selector: 'no_surat',
      data: (row: any) => (
        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant={
                row.status == 'disetujui' ? 'success' :
                  row.status == 'pengajuan' ? 'outline' :
                    row.status == 'ditolak' ? 'danger' : 'outline'
              } className='whitespace-nowrap'>{row.no_surat}</Badge>
            </TooltipTrigger>
            <TooltipContent className={cn("font-bold shadow", {
              "bg-yellow-100 border-[1.5px] text-warning border-warning": row.status == 'pengajuan',
              "bg-green-100 border-[1.5px] text-success-foreground border-border": row.status == 'disetujui',
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
                  "group-hover:bg-green-100 group-hover:border-green-600 group-hover:text-green-700": row.status == 'disetujui',
                  "group-hover:bg-red-100 group-hover:border-red-600 group-hover:text-red-600": row.status == 'ditolak',
                })
              }>
                {row.pj}
              </Badge>
            </TooltipTrigger>
            <TooltipContent className={cn("font-bold shadow", {
              "bg-warning text-warning-foreground border-warning": row.status == 'pengajuan',
              "bg-success text-success-foreground border-success": row.status == 'disetujui',
              "bg-danger text-danger-foreground border-danger": row.status == 'ditolak',
            })
            }>{row.pj_detail ? row.pj_detail.nama : row.pj}</TooltipContent>
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
      data: (row: any) => (
        <div className='flex gap-0.5 justify-end items-center'>
          <Dialog>
            <DialogTrigger className='h-8 w-8 rounded-lg bg-transparent hover:bg-foreground/5 flex items-center justify-center' onClick={() => {
              setStatus(row.status)
            }}>
              <span className="sr-only">Open menu</span>
              <IconTag className="w-5 h-5" />
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
            <DropdownMenuTrigger className='h-8 w-8 rounded-lg bg-transparent hover:bg-foreground/5 flex items-center justify-center'>
              <span className="sr-only">Open menu</span>
              <IconDotsVertical className="w-5 h-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Files</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => toast.error('dalam pengembangan')}>
                  <IconPrinter className="w-4 h-4 me-2" /> Cetak Undangan
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => route.push(`/surat/internal/${row.no_surat.split('/').join('_')}/edit`)}>
                  <IconEditCircle className="w-4 h-4 me-2" /> Edit Surat
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => route.push(`/surat/internal/${row.no_surat.split('/').join('_')}/detail`)}>
                  <IconSearch className="w-4 h-4 me-2" /> Detail Surat
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
                {metric.total}
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
                {metric.total}
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
                {metric.total}
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
              <CardDescription>Daftar surat internal RSIA Aisyiyah Pekajangan.</CardDescription>
            </div>
            <Button variant="default" size="icon" className="w-7 h-7" onClick={() => route.push('/surat/internal/create')}><IconPlus className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" /></Button>
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
  )
};

SuratInternal.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default SuratInternal;
