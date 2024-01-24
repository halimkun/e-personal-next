import LaravelPagination from "../../custom-ui/laravel-pagination";

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/router";
import { Combobox } from "../inputs/combo-box";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { IconArrowLeft, IconInfoCircle } from "@tabler/icons-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


export default function FormAddSuratInternal(penanggungJawab: any) {
  const router = useRouter();
  const { data } = useSession();

  const [selectedKaryawan, setSelectedKaryawan] = useState<string[]>([]);
  const [selectedPj, setSelectedPj] = useState("")
  const [withKaryawan, setWithKaryawan] = useState(false)

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
        karyawan: karyawan
      })
    }).then(response => response.json())

    if (response.success) {
      router.push('/surat/internal')
    } else {
      toast({
        title: "Gagal",
        description: response.message,
        duration: 2000,
      })
    }

  }

  return (
    <form action="#!" method="post" onSubmit={onFormAddSuratInternalSubmit} className="w-full">
      <div className="flex flex-col lg:flex-row items-start justify-start gap-3 w-full">
        <Card className="w-[75%] lg:sticky lg:top-[68px]">
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
              <div className="flex flex-col gap-4">
                <div className="space-y-1">
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
                  <Input type="datetime-local" name="tanggal" placeholder="Tanggal Kegiatan" id="tanggal" />
                </div>
                <div className="w-full space-y-1">
                  <Label className="text-primary" htmlFor="PJ">Penanggung Jawab</Label>
                  <Input type="hidden" name="pj" value={selectedPj} />
                  <Combobox items={penanggungJawab.penanggungJawab} setSelectedItem={setSelectedPj} placeholder="Pilih Penanggung Jawab" />
                </div>
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

              <Button type="submit">Simpan</Button>
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
    </form>
  )
}