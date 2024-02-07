import { useState } from "react";

import LaravelPagination from "../../custom-ui/laravel-pagination";
import toast from "react-hot-toast";

import { useRouter } from "next/router";
import { Label } from "@/components/ui/label"
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge";
import { Combobox } from "../inputs/combo-box";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { IconArrowLeft, IconInfoCircle, IconLoader } from "@tabler/icons-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function FormAddSuratInternal(penanggungJawab: any) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false)

  const { data } = useSession();
  const [selectedPj, setSelectedPj] = useState("")
  const [withKaryawan, setWithKaryawan] = useState(false)
  const [selectedKaryawan, setSelectedKaryawan] = useState<string[]>([]);

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
      name: 'Detail',
      selector: 'detail',
      data: (row: any) => (
        <div className="flex flex-col gap-1">
          <div className="text-xs flex flex-row items-center justify-between">
            <span className="text-gray-500">Bidang</span> <span>{row.bidang}</span>
          </div>
          <div className="text-xs flex flex-row items-center justify-between">
            <span className="text-gray-500">Jabatan</span> <span>{row.jbtn}</span>
          </div>
          <div className="text-xs flex flex-row items-center justify-between">
            <span className="text-gray-500">Departemen</span> <span>{row.dpt.nama}</span>
          </div>
        </div>
      )
    },
  ]

  const onFormAddSuratInternalSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    setIsLoading(true)

    const tanggal = (event.target as any).tanggal.value
    const pj = (event.target as any).pj.value
    const tempat = (event.target as any).tempat.value
    const perihal = (event.target as any).perihal.value
    const karyawan = selectedKaryawan

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/surat/internal/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + data?.rsiap?.access_token
      },
      body: JSON.stringify({
        tanggal: tanggal,
        pj: pj,
        tempat: tempat,
        perihal: perihal,
        karyawan: karyawan,
        tgl_terbit: (event.target as any).tgl_terbit.value,
        catatan: (event.target as any).catatan.value
      })
    }).then(response => response.json())

    if (response.success) {
      setIsLoading(false)
      toast.success(response.message)
      await new Promise(resolve => setTimeout(resolve, 1500))

      router.push('/surat/internal')
    } else {
      setIsLoading(false)
      toast.error(response.message)
    }
  }

  return (
    <form action="#!" method="post" onSubmit={onFormAddSuratInternalSubmit} className="w-full">
      <div className="flex flex-col lg:flex-row items-start justify-start gap-3 w-full">
        <Card className="w-full lg:w-[75%] lg:sticky lg:top-[68px]">
          <CardHeader className="p-3">
            <div className="flex items-center gap-4">
              <Button variant="outline" size='icon' onClick={() => router.push('/surat/internal')}>
                <IconArrowLeft className="rotate-0 scale-100 transition-all" />
              </Button>
              <div className="flex flex-col gap-0.5">
                <CardTitle className="text-primary">Buat Surat Internal Baru</CardTitle>
                <CardDescription>Buat surat internal baru | <strong>RSIA Aisyiyah Pekajangan</strong></CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <div className="grid gap-3 py-4 w-full">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="space-y-1 w-full">
                  <div className="flex items-center justify-between pr-1">
                    <Label className="text-primary" htmlFor="tgl_terbit">Tannggal Terbit</Label>
                    <Popover>
                      <PopoverTrigger>
                        <IconInfoCircle className="cursor-pointer stroke-danger animate-pulse" size={18} strokeWidth={2} />
                      </PopoverTrigger>
                      <PopoverContent className="text-sm">
                        <strong>Tanggal Terbit : </strong> adalah tanggal yang digunakan untuk keperluan penomoran surat.
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Input type="date" name="tgl_terbit" placeholder="Tanggal Terbit" id="tgl_terbit" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="space-y-1 w-full">
                  <div className="flex items-center justify-between pr-1">
                    <Label className="text-primary" htmlFor="tanggal">Tannggal Kegiatan</Label>
                    <Popover>
                      <PopoverTrigger>
                        <IconInfoCircle className="cursor-pointer stroke-danger animate-pulse" size={18} strokeWidth={2} />
                      </PopoverTrigger>
                      <PopoverContent className="text-sm">
                        <strong>Tanggal Kegiatan : </strong> adalah tanggal yang digunakan untuk kegiatan yang akan dilaksanakan, tanggal ini tidak akah berpengaruh pada penomoran surat.
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Input type="datetime-local" name="tanggal" placeholder="Tanggal Kegiatan" id="tanggal" />
                </div>
              </div>
              <div className="w-full space-y-1">
                <Label className="text-primary" htmlFor="PJ">Penanggung Jawab</Label>
                <Input type="hidden" name="pj" value={selectedPj} />
                <Combobox items={penanggungJawab.penanggungJawab} setSelectedItem={setSelectedPj} placeholder="Pilih Penanggung Jawab" />
              </div>
              <div className="w-full space-y-1">
                <Label className="text-primary" htmlFor="tempat">Tempat</Label>
                <Input type="text" name="tempat" placeholder="Tempat Kegiatan" id="tempat" />
              </div>
              <div className="w-full space-y-1">
                <Label className="text-primary" htmlFor="perihal">Perihal</Label>
                {/* <Input type="text" name="perihal" placeholder="Perihal Surat . . ." id="perihal" /> */}
                <Textarea name="perihal" placeholder="Perihal Surat . . ." id="perihal" />
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <Button type="button" variant={withKaryawan ? 'default' : 'outline'} onClick={() => {
                setWithKaryawan(!withKaryawan)
              }}>
                {withKaryawan ? 'Hide karyawan' : 'Show Karyawan'}
              </Button>

              <Button type="submit">
                <div className="flex gap-3 items-center justify">
                  {isLoading ? <IconLoader className="animate-spin stroke-current" size={18} strokeWidth={2} /> : null}
                  {isLoading ? 'Loading...' : 'Buat Surat'}
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="w-full flex flex-col gap-3">
          <Card>
            <CardHeader>
              <CardTitle>Catatan</CardTitle>
              <CardDescription>Catatan Tambahan untuk surat internal ini</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <Label htmlFor="catatan">Catatan</Label>
                <Textarea name="catatan" id="catatan" placeholder="catatan untuk surat ini" />
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Pilih Karyawan</CardTitle>
              <CardDescription>Jika karyawan dipilih surat yang dibuat akan dianggap sebagai undangan</CardDescription>
            </CardHeader>
            <CardContent>
              {withKaryawan ? (
                <LaravelPagination
                  columns={KaryawanColumns}
                  dataSrc={`${process.env.NEXT_PUBLIC_API_URL}/pegawai?datatables=0&select=nik,nama,bidang,jbtn`}
                  fetcher={{ method: "GET" }}
                />
              ) : ("[ hidden content ]")}
            </CardContent>
          </Card>
        </div>

      </div>
    </form>
  )
}