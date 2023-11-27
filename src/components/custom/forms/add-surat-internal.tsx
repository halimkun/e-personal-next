import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCookie } from "cookies-next"
import { useRouter } from "next/router";
import { Combobox } from "../inputs/combo-box";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LaravelPagination from "../tables/laravel-pagination";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";

interface selectItemType {
  value: string;
  label: string;
}

export default function FormAddSuratInternal(penanggungJawab: any) {
  const router = useRouter();

  const [selectedKaryawan, setSelectedKaryawan] = useState<string[]>([]);
  const [selectedPj, setSelectedPj] = useState("")

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

  const onFormAddSuratInternalSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    const tanggal = (event.target as any).tanggal.value
    const pj = (event.target as any).pj.value
    const tempat = (event.target as any).tempat.value
    const perihal = (event.target as any).perihal.value
    const karyawan = selectedKaryawan

    const response = await fetch('https://sim.rsiaaisyiyah.com/rsiap-api-dev/api/surat/internal/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getCookie('access_token')
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
    <form action="#!" method="post" onSubmit={onFormAddSuratInternalSubmit}>
      <div className="grid gap-3 py-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-[60%] space-y-1">
            <Label className="" htmlFor="tanggal">Tannggal</Label>
            <Input type="datetime-local" name="tanggal" placeholder="tanggal" id="tanggal" />
          </div>
          <div className="w-full space-y-1">
            <Label className="" htmlFor="PJ">Penanggung Jawab</Label>
            <Input type="hidden" name="pj" value={selectedPj} />
            <Combobox selectItems={penanggungJawab.penanggungJawab} setSelectedPj={setSelectedPj} />
          </div>
          <div className="w-full space-y-1">
            <Label className="" htmlFor="tempat">Tempat</Label>
            <Input type="text" name="tempat" placeholder="Tempat" id="tempat" />
          </div>
        </div>
        <div className="w-full space-y-1">
          <Label className="" htmlFor="perihal">Perihal</Label>
          <Input type="text" name="perihal" placeholder="perihal" id="perihal" />
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
  )
}