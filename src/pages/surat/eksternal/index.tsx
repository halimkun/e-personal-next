import AppLayout from '@/components/layouts/app';
import LaravelPagination from '@/components/custom/tables/laravel-pagination';
import toast from 'react-hot-toast';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import type { ReactElement } from 'react'
import type { NextPageWithLayout } from '../../_app';

import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button"
import { getSession, useSession } from 'next-auth/react';
import { getDate, getFullDate, getTime } from '@/lib/date';
import { Combobox } from '@/components/custom/inputs/combo-box';
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"



const SuratInternal: NextPageWithLayout = () => {
  const route = useRouter()
  const { data } = useSession();
  
  const [selectedPj, setSelectedPj] = useState("")
  const [tanggal, setTanggal] = useState<string | undefined>(new Date().toISOString().slice(0, 16))

  const [isOpenModalMenu, setIsOpenModalMenu] = useState(false)
  const [isOpenDialogEdit, setIsOpenDialogEdit] = useState(false)
  const [penanggungJawab, setPenanggungJawab] = useState<any>([])

  const [surat, setSurat] = useState({
    no_surat: "",
    pj: "",
    perihal: "",
    alamat: "",
    tanggal: "",
    pj_detail: {
      nama: ""
    }
  })


  const fetchPegawai = async (url: string) => {
    const session = await getSession()
    const req = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.rsiap?.access_token}`,
      },
    });

    const res = await req.json();
    if (res.data.length > 0) {
      const data = res.data.map((item: any) => {
        return {
          value: item.nik,
          label: item.nama
        }
      })

      setPenanggungJawab(data)
    } else {
      toast.error(res.message)
    }
  }

  useEffect(() => {
    setSelectedPj(surat.pj)
    setTanggal(surat.tanggal)
  }, [surat])

  const onEdit = async (e: any) => {
    e.preventDefault()
    const formData = new FormData(e.target) 
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/surat/eksternal/update?nomor=${surat.no_surat}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${data?.rsiap?.access_token}`
      },
      body: formData
    });

    const res = await response.json();
    if (res.success) {
      toast.success(res.message)
      await new Promise(resolve => setTimeout(resolve, 2000));
      route.reload()
    } else {
      toast.error(res.message)
    }
  }

  const onDelete = async (no_surat: string) => {
    // destroy/no_surat
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/surat/eksternal/destroy?nomor=${no_surat}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${data?.rsiap?.access_token}`
      }
    });

    const res = await response.json();
    if (res.success) {
      toast.success(res.message)
      setIsOpenModalMenu(false)
      route.reload()
    } else {
      toast.error(res.message)
    }
  }

  const columns = [
    {
      name: 'Nomor',
      selector: 'no_surat',
      data: (row: any) => (
        <Badge variant={"outline"} className='whitespace-nowrap group-hover:border-primary'>{row.no_surat}</Badge>
      )
    },
    {
      name: 'PJ',
      selector: 'pj',
      data: (row: any) => (
        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant={"outline"} className="group-hover:bg-primary group-hover:text-primary-foreground">
                {row.pj}
              </Badge>
            </TooltipTrigger>
            <TooltipContent className='font-bold shadow text-secondary-foreground bg-secondary'>{row.pj_detail.nama}</TooltipContent>
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
      name: 'Alamat',
      selector: 'alamat',
      data: (row: any) => <div>{row.alamat}</div>
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
  ]

  return (
    <>
      <div className='space-y-4'>
        <Card className="max-w-screen">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <CardTitle>Surat Eksternal</CardTitle>
                <CardDescription>Daftar surat eksternal RSIA Aisyiyah Pekajangan.</CardDescription>
              </div>
              <Button variant="default" size="icon" className="w-7 h-7" onClick={() => route.push('/surat/eksternal/create')}>
                <IconPlus className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <LaravelPagination
              columns={columns}
              onRowClick={(row: any) => {
                setSurat(row)
                setIsOpenModalMenu(true)
              }}
              dataSrc={`${process.env.NEXT_PUBLIC_API_URL}/surat/eksternal`}
              fetcher={{ method: "GET" }}
            />
          </CardContent>
        </Card>
      </div>


      {/* Dialog Menu */}
      <Dialog open={isOpenModalMenu} onOpenChange={setIsOpenModalMenu}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Menu Surat {surat.no_surat}</DialogTitle>
            <DialogDescription>Anda dapat mengelola surat ini dengan memilih menu dibawah ini.</DialogDescription>
          </DialogHeader>

          <table className="table">
            <tbody>
              <tr className="text-left">
                <th>Nomor Surat</th>
                <td>{surat.no_surat}</td>
              </tr>
              <tr className="text-left">
                <th>Penanggung Jawab</th>
                <td>
                  <div className="flex items-center justify-start gap-4">
                    {surat.pj_detail.nama} <Badge>{surat.pj}</Badge>
                  </div>
                </td>
              </tr>
              <tr className="text-left">
                <th>Perihal</th>
                <td>{surat.perihal}</td>
              </tr>
              <tr className="text-left">
                <th>Alamat</th>
                <td>{surat.alamat}</td>
              </tr>
              <tr className="text-left">
                <th>Tanggal Surat</th>
                <td>{getFullDate(surat.tanggal)} | {getTime(surat.tanggal)}</td>
              </tr>
            </tbody>
          </table>


          <div className="flex justify-between w-full">
            <div className="flex justify-end gap-2 w-full mt-6">
              <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => {
                fetchPegawai(`${process.env.NEXT_PUBLIC_API_URL}/pegawai?datatables=1&with=bidang_detail&select=nik,nama`)
                setIsOpenModalMenu(false)
                setIsOpenDialogEdit(true)
              }}>
                <IconEdit className="h-4 w-4" /> Edit
              </Button>
              <Button variant="destructive" size="sm" className="flex items-center gap-2" onClick={() => {
                window.confirm('Apakah anda yakin ingin menghapus data ini?') && onDelete(surat.no_surat)
              }}>
                <IconTrash className="h-4 w-4" /> Hapus
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Edit Surat */}
      <Dialog open={isOpenDialogEdit} onOpenChange={setIsOpenDialogEdit}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Edit Surat dengan nomor {surat.no_surat}</DialogTitle>
            <DialogDescription>Anda dapat mengedit surat ini dengan mengisi form dibawah ini.</DialogDescription>
          </DialogHeader>

          <form action="#!" method="post" onSubmit={onEdit}>
            <div className="grid gap-3 py-4">
              <div className="w-full space-y-1">
                <Label className="text-primary" htmlFor="no_surat">Nomor Surat</Label>
                <Input type="text" name="no_surat" placeholder="nomor surat" id="no_surat" value={surat.no_surat} />
                <p className="text-xs">nomor surat tidak bisa diubah</p>
                <p className="text-xs text-danger no_surat-error"></p>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-[60%] space-y-1">
                  <Label className="text-primary" htmlFor="tanggal">Tannggal</Label>
                  <Input type="datetime-local" name="tanggal" placeholder="Tanggal Kegiatan" id="tanggal" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
                  <p className="text-xs text-danger tanggal-error"></p>
                </div>
                <div className="w-full space-y-1">
                  <Label className="text-primary" htmlFor="PJ">Penanggung Jawab</Label>
                  <Input type="hidden" name="pj" value={selectedPj} />
                  {penanggungJawab.length > 0 && <Combobox items={penanggungJawab} setSelectedItem={setSelectedPj} selectedItem={selectedPj} placeholder="Pilih Penanggung Jawab" />}
                  <p className="text-xs text-danger pj-error"></p>
                </div>
              </div>
              <div className="w-full space-y-1">
                <Label className="text-primary" htmlFor="alamat">Alamat</Label>
                <Input type="text" name="alamat" placeholder="alamat yang dituju" id="alamat" defaultValue={surat.alamat} />
                <p className="text-xs text-danger alamat-error"></p>
              </div>
              <div className="w-full space-y-1">
                <Label className="text-primary" htmlFor="perihal">Perihal</Label>
                <Input type="text" name="perihal" placeholder="Perihal Surat" id="perihal" defaultValue={surat.perihal} />
                <p className="text-xs text-danger perihal-error"></p>
              </div>
            </div>

            <div className="mt-10 flex justify-end">
              <Button type="submit">Simpan</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
};

SuratInternal.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default SuratInternal;