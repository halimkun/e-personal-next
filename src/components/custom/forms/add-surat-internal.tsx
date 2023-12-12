import LaravelPagination from "../tables/laravel-pagination";

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/router";
import { Combobox } from "../inputs/combo-box";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

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
    <form action="#!" method="post" onSubmit={onFormAddSuratInternalSubmit}>
      <div className="grid gap-3 py-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-[60%] space-y-1">
            <Label className="text-primary" htmlFor="tanggal">Tannggal</Label>
            <Input type="datetime-local" name="tanggal" placeholder="Tanggal Kegiatan" id="tanggal" />
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
        </div>
        <div className="w-full space-y-1">
          <Label className="text-primary" htmlFor="perihal">Perihal</Label>
          <Input type="text" name="perihal" placeholder="Perihal Surat . . ." id="perihal" />
        </div>
      </div>

      <div className="mt-4">
        <Button type="button" variant={withKaryawan ? 'default' : 'outline'} onClick={() => {
          setWithKaryawan(!withKaryawan)
        }}>
          {withKaryawan ? 'Hide karyawan' : 'Show Karyawan'}
        </Button>
      </div>

      <div className={cn(
        'mt-4', withKaryawan ? 'block border-y-2 py-4' : 'hidden'
      )}>
        <CardTitle>Pilih Karyawan</CardTitle>
        <CardDescription>Pilih karyawan sebagai undangan untuk surat ini.</CardDescription>
        <LaravelPagination
          columns={KaryawanColumns}
          dataSrc={`${process.env.NEXT_PUBLIC_API_URL}/pegawai?datatables=0&select=nik,nama,bidang,jbtn`}
          fetcher={{ method: "GET" }}
        />
      </div>
      <div className="mt-4 flex justify-end">
        <Button type="submit">Simpan</Button>
      </div>
    </form>
  )
}