import { Combobox } from "@/components/custom/inputs/combo-box"
import LaravelPagination from "@/components/custom/tables/laravel-pagination"
import AppLayout from "@/components/layouts/app"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getDate, getTime } from "@/lib/date"
import { cn } from "@/lib/utils"
import { NextPageWithLayout } from "@/pages/_app"
import { IconArrowLeft } from "@tabler/icons-react"
import { Checkbox } from "@/components/ui/checkbox";
import { getCookie } from "cookies-next"
import { useRouter } from "next/router"
import { ReactElement, useEffect, useState } from "react"

const EditSuratInternal: NextPageWithLayout = () => {
  const route = useRouter();

  const { nomor } = route.query;
  const realNomor = nomor?.toString().replace(/_/g, '/')

  const [data, setData] = useState<any>(null)
  const [dataPj, setDataPj] = useState<any>(null)

  useEffect(() => {
    if (nomor) {
      const fetchData = async () => {
        await fetch(`https://sim.rsiaaisyiyah.com/rsiap-api-dev/api/surat/internal/detail`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie('access_token')}`,
          },
          body: JSON.stringify({
            nomor: realNomor
          })
        }).then(response => response.json()).then(res => {
          setData(res.data)
        })
      }

      const fetchPj = async () => {
        await fetch('https://sim.rsiaaisyiyah.com/rsiap-api-dev/api/pegawai?datatables=1&with=bidang_detail&select=nik,nama', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie('access_token')}`,
          },
        }).then(response => response.json()).then(res => {
          const data = res.data.map((item: any) => {
            return {
              value: item.nik,
              label: item.nama
            }
          })
          setDataPj(data)
        })
      }

      fetchData()
      fetchPj()
    }
  }, [])

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
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="outline" size='icon' onClick={() => route.push('/surat/internal')}>
            <IconArrowLeft className="rotate-0 scale-100 transition-all" />
          </Button>
          <div className="flex flex-col gap-0.5">
            <CardTitle>Edit Surat Internal</CardTitle>
            <CardDescription>Edit detail Surat Internal dengan nomor <Badge variant='outline' className="ml-2">{realNomor}</Badge> </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form action="#!" method="post">
          <div className="grid gap-3 py-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-[60%] space-y-1">
                <Label className="" htmlFor="tanggal">Tannggal</Label>
                <Input type="datetime-local" name="tanggal" placeholder="tanggal" id="tanggal" value={data?.tanggal} />
              </div>
              <div className="w-full space-y-1">
                <Label className="" htmlFor="PJ">Penanggung Jawab</Label>
                <Input type="hidden" name="pj" />
                <Combobox selectItems={dataPj} setSelectedPj={undefined} />
              </div>
              <div className="w-full space-y-1">
                <Label className="" htmlFor="tempat">Tempat</Label>
                <Input type="text" name="tempat" placeholder="Tempat" id="tempat" value={data?.tempat} />
              </div>
            </div>
            <div className="w-full space-y-1">
              <Label className="" htmlFor="perihal">Perihal</Label>
              <Input type="text" name="perihal" placeholder="perihal" id="perihal" value={data?.perihal} />
            </div>
          </div>

          <div className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Pilih Karyawan</CardTitle>
                <CardDescription>Pilih karyawan sebagai undangan untuk surat ini.</CardDescription>
              </CardHeader>
              <CardContent>
                <LaravelPagination
                  columns={KaryawanColumns}
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
          </div>

          <div className="mt-4 flex justify-end">
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </CardContent>
    </Card>

  )
}


EditSuratInternal.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}
export default EditSuratInternal