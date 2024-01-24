import useSWR from 'swr'
import AppLayout from "@/components/layouts/app"
import LaravelPagination from "@/components/custom-ui/laravel-pagination"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/router"
import { IconArrowLeft, IconInfoCircle } from "@tabler/icons-react"
import { NextPageWithLayout } from "@/pages/_app"
import { ReactElement, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from '@/components/ui/use-toast'
import { getSession } from 'next-auth/react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


import Loading1 from '@/components/custom/icon-loading'
import SelectPenanggungJawab from '@/components/custom/inputs/penanggung-jawab-select'
import { Textarea } from '@/components/ui/textarea'

const EditSuratInternal: NextPageWithLayout = ({ nomor }: any) => {
  const route = useRouter();
  // const nomor = route.query.nomor?.toString().replace(/_/g, '/')
  const [penanggungJawab, setPenanggungJawab] = useState<any>("")
  const [selectedKaryawan, setSelectedKaryawan] = useState<string[]>([]);
  const [tempat, setTempat] = useState("")
  const [perihal, setPerihal] = useState("")
  const [noSurat, setNoSurat] = useState(nomor)

  const detailsFetcher = async (url: string) => {
    const session = await getSession()
    if (route.isReady) {
      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.rsiap?.access_token}`,
        },
        body: JSON.stringify({
          nomor: nomor
        })
      }).then(res => {
        if (!res.ok) {
          throw Error(res.status + ' ' + res.statusText)
        }

        const response = res.json()
        response.then((data) => {
          if (data.success) {
            const d = data.data
            setSelectedKaryawan(d.penerima.map((item: any) => item.penerima))
            setPerihal(d.perihal)
            setTempat(d.tempat)
            setPenanggungJawab(d.pj)
          } else {
            toast({
              title: 'Error',
              description: data.message,
              duration: 5000,
            })
          }
        })
        return response
      })
    }
  }
  const { data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/surat/internal/detail`, detailsFetcher)

  if (error) return (
    <div className="flex flex-col items-start justify-center h-full gap-4">
      <div className="text-2xl font-bold">Error {error.message}</div>
    </div>
  )
  if (isLoading) return <Loading1 height={8} width={8} />

  const onSubmit = async (e: any) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const session = await getSession()


    const noSurat = formData.get('no_surat')

    const data = {
      old_nomor: formData.get('old_nomor'),
      no_surat: formData.get('no_surat'),
      perihal: formData.get('perihal'),
      tempat: formData.get('tempat'),
      pj: penanggungJawab,
      tanggal: formData.get('tanggal'),
      penerima: selectedKaryawan
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/surat/internal/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + session?.rsiap?.access_token,
      },
      body: JSON.stringify(data)
    }).then(response => response.json())

    if (response.success) {
      route.push(`/surat/internal/${noSurat?.toString().replace(/\//g, '_')}/detail`)
      toast({
        title: "Berhasil",
        description: response.message,
        duration: 2000,
      })
    } else {
      toast({
        title: "Gagal",
        description: response.message,
        duration: 2000,
      })
    }
  }

  const KaryawanColumns = [
    {
      name: 'Nama',
      selector: 'nama',
      data: (row: any) => (
        <div className="flex items-center gap-4">
          <Checkbox
            id={row.nik}
            name="karyawan[]"
            value={row.nik}
            checked={selectedKaryawan.includes(row.nik)}
            onCheckedChange={() => {
              if (selectedKaryawan.includes(row.nik)) {
                setSelectedKaryawan(selectedKaryawan.filter((item) => item !== row.nik))
              } else {
                setSelectedKaryawan([...selectedKaryawan, row.nik])
              }
            }}
          />
          <label
            htmlFor={row.nik}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <div>{row.nama}</div>
            <div className="mt-1">
              <Badge variant="secondary" className="cursor-pointer">
                {row.nik}
              </Badge>
            </div>
          </label>
        </div>
      )
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
    }
  ]

  return (
    <div className="">
      <div className="mb-5">
        <div className="flex items-center gap-4">
          <Button variant="outline" size='icon' onClick={() => route.push('/surat/internal')}>
            <IconArrowLeft className="rotate-0 scale-100 transition-all" />
          </Button>
          <div className="flex flex-col gap-0.5">
            <CardTitle>Edit Surat Internal</CardTitle>
            <CardDescription>Edit detail Surat Internal dengan nomor <Badge variant='outline' className="ml-2">{nomor}</Badge> </CardDescription>
          </div>
        </div>
      </div>

      <form action="#!" method="post" onSubmit={onSubmit} className='flex gap-4 items-start'>
        <Card className='top-16 sticky'>
          <CardHeader>
            <CardTitle>Detail Surat</CardTitle>
            <CardDescription>Isi detail surat internal.</CardDescription>
          </CardHeader>
          <CardContent>
            <Input type="hidden" name="old_nomor" value={nomor} />
            <div className="w-full space-y-1 mb-3">
              <Label className="text-primary" htmlFor="no_surat">Nomor Surat</Label>
              <Input type="text" name="no_surat" placeholder="no_surat" id="no_surat" value={noSurat} onChange={(e) => setNoSurat(e.target.value)} />
            </div>
            <div className="space-y-1 mb-3">
              <div className="flex items-center justify-between pr-1">
                <Label className="text-primary" htmlFor="tanggal">Tannggal Kegiatan</Label>
                <Popover>
                  <PopoverTrigger>
                    <IconInfoCircle className="cursor-pointer stroke-danger animate-pulse" size={18} strokeWidth={2} />
                  </PopoverTrigger>
                  <PopoverContent className="text-sm">
                    <strong>Tanggal Kegiatan : </strong> adalah tanggal yang digunakan untuk kegiatan yang akan dilaksanakan, tanggal ini tidak akah berpengaruh pada penomoran surat. <br /><br />
                    tanggal pada nomor surat akan diambil dari tanggal surat dibuat.
                  </PopoverContent>
                </Popover>
              </div>
              <Input type="datetime-local" name="tanggal" placeholder="tanggal" id="tanggal" defaultValue={data?.data?.tanggal} />
            </div>
            <div className="w-full space-y-1 mb-3">
              <Label className="text-primary" htmlFor="PJ">Penanggung Jawab</Label>
              <Input type="hidden" name="pj" />
              <SelectPenanggungJawab setSelectedItem={setPenanggungJawab} selectedItem={penanggungJawab} />
            </div>
            <div className="w-full space-y-1 mb-3">
              <Label className="text-primary" htmlFor="tempat">Tempat</Label>
              <Input type="text" name="tempat" placeholder="Tempat" id="tempat" value={tempat} onChange={(e) => setTempat(e.target.value)} />
            </div>
            <div className="w-full space-y-1 mb-3">
              <Label className="text-primary" htmlFor="perihal">Perihal</Label>
              {/* <Input type="text" name="perihal" placeholder="perihal" id="perihal" value={perihal} onChange={(e) => setPerihal(e.target.value)} /> */}
              {/* change to textarea */}
              <Textarea name="perihal" placeholder="Perihal Surat . . ." id="perihal" value={perihal} onChange={(e) => setPerihal(e.target.value)} />
            </div>

            <div className="mt-4 flex justify-end">
              <Button type="submit">Simpan</Button>
            </div>
          </CardContent>
        </Card>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Pilih Karyawan</CardTitle>
              <CardDescription>Pilih karyawan sebagai undangan untuk surat ini.</CardDescription>
            </CardHeader>
            <CardContent>
              <LaravelPagination
                columns={KaryawanColumns}
                dataSrc={`${process.env.NEXT_PUBLIC_API_URL}/pegawai?datatables=0&select=nik,nama,bidang,jbtn`}
                fetcher={{ method: "GET" }}
              />
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}

EditSuratInternal.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export async function getServerSideProps(ctx: any) {
  const nomor = ctx.query.nomor?.toString().replace(/_/g, '/') ?? ""
  return {
    props: {
      nomor: nomor
    }
  }
}

export default EditSuratInternal