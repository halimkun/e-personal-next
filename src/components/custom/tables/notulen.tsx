import { useRouter } from "next/router"
import { getSession } from "next-auth/react"

import dynamic from "next/dynamic"
import toast from "react-hot-toast"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getFullDateWithDayName } from "@/lib/date"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { IconDotsVertical, IconEditCircle, IconFileTypePdf, IconPencilPlus, IconTrash, IconUserScan } from "@tabler/icons-react"
import { IconQrcode } from "@tabler/icons-react"

const LaravelPagingx = dynamic(() => import('@/components/custom-ui/laravel-paging'), { ssr: false })

interface NotulenProps {
  data: any
  filterData: any
  setFilterData: any
  isValidating: boolean | undefined
  onRowClick?: (row: any) => void;
  setSelectedItem?: (value: any) => void
  lastColumnAction?: boolean | undefined
  mutate?: any
}

const TableNotulen = ({ data, filterData, setFilterData, isValidating, onRowClick = () => { }, setSelectedItem = () => { }, lastColumnAction, mutate }: NotulenProps) => {
  const route = useRouter();

  const onDelete = async (nomor: string) => {
    const confirm = window.confirm('Apakah anda yakin ingin menghapus data ini?')
    if (!confirm) return

    const session = await getSession()
    const forData = new FormData()

    forData.append('no_surat', nomor)

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/berkas/notulen/delete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session?.rsiap?.access_token}`,
      },
      body: forData
    })

    const data = await response.json()

    if (data.success) {
      toast.success('Berhasil menghapus data')
      setSelectedItem({})
    }

    if (!data.success) {
      toast.error('Gagal menghapus data')
    }

    mutate()
  }

  const columns = [
    {
      name: 'No. Surat',
      selector: 'No Surat',
      enableHiding: false,
      data: (row: any) => <Badge variant={'secondary'}>{row.no_surat}</Badge>
    },
    {
      name: 'PJ',
      selector: 'pj',
      enableHiding: false,
      data: (row: any) => (
        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant={"outline"} className="group-hover:border-primary">{row.surat.pj}</Badge>
            </TooltipTrigger>
            <TooltipContent>{row.surat.penanggung_jawab.nama}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    {
      name: 'Perihal',
      selector: 'perihal',
      enableHiding: false,
      data: (row: any) => row.surat.perihal
    },
    {
      name: 'Notulis',
      selector: 'notulis',
      enableHiding: false,
      data: (row: any) => (
        row.notulen ? (
          <TooltipProvider delayDuration={50}>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant={"outline"} className="group-hover:border-primary">{row.notulen.notulis.nik}</Badge>
              </TooltipTrigger>
              <TooltipContent>{row.notulen.notulis.nama}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Badge variant={'destructive'}>belum ada notulen</Badge>
        )
      )
    },
    {
      name: 'Tgl Dibuat',
      selector: 'tgl_dibuat',
      enableHiding: false,
      data: (row: any) => (
        <Badge variant={'secondary'}>
          {row.notulen ? getFullDateWithDayName(row.notulen.created_at) : "-"}
        </Badge>
      )
    },
    {
      // edit and delete
      name: (<div className="w-full flex justify-end">#</div>),
      selector: 'action',
      enableHiding: false,
      data: (row: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger className='h-8 w-8 rounded-lg bg-transparent hover:bg-foreground/5 flex items-center justify-center'>
            <span className="sr-only">Open menu</span>
            <IconDotsVertical className="w-5 h-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Kehadiran</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuGroup>
                <DropdownMenuItem className="flex items-center gap-2" onClick={() => {
                  route.push(`/kegiatan/${row.no_surat.split('/').join('--')}/kehadiran`)
                }}>
                  <IconUserScan size={18} /> Kehadiran Peserta
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuItem className="flex items-center gap-2" onClick={() => {
                route.push(`/surat/internal/${row.no_surat.split('/').join('--')}/qr`)
              }}>
                <IconQrcode size={18} /> QR Code Kehadiran
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuLabel>Files</DropdownMenuLabel>
            <DropdownMenuItem className="flex items-center gap-2" disabled={!row.notulen} onClick={() => {
              const url = `${process.env.NEXT_PUBLIC_API_URL}/berkas/notulen/render/${row.no_surat.replaceAll('/', '--')}`
              window.open(url, '_blank')
            }}>
              <IconFileTypePdf size={18} /> Download Notulen
            </DropdownMenuItem>

            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem className="flex items-center gap-2 text-primary" onClick={() => {
                const url = "/berkas/notulen/" + row.no_surat.toString().replaceAll('/', '--') + (row.notulen ? '/edit' : '/new')
                route.push(url)
              }}>
                {row.notulen ? <IconEditCircle size={18} /> : <IconPencilPlus size={18} />} {(row.notulen ? 'Edit' : 'Buat')} Notulen
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 text-danger" onClick={() => {
                onDelete(row.no_surat)
              }}>
                <IconTrash size={18} /> Hapus Notulen
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }
  ];

  return (
    <>
      <div className="mt-4 mb-4 w-full flex flex-col md:flex-row items-center justify-end gap-4 p-4 rounded-xl bg-gray-100/50 dark:bg-gray-900/50 border border-border">
        <div className="w-full space-y-1">
          <Label>Search</Label>
          <Input
            type="search"
            placeholder="Search..."
            className="w-full"
            defaultValue={filterData?.keyword}
            onChange={(e) => {
              setFilterData({ ...filterData, keyword: e.target.value })
            }}
          />
        </div>
      </div>

      <LaravelPagingx
        data={data.data}
        columnsData={columns}
        filterData={filterData}
        setFilterData={setFilterData}
        isValidating={isValidating}
        lastColumnAction={true}
      />
    </>
  )
}

export default TableNotulen;