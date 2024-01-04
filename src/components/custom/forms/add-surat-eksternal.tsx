import LaravelPagination from "../../custom-ui/laravel-pagination";

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/router";
import { Combobox } from "../inputs/combo-box";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { getSession, useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { parse } from "path";

export default function FormAddSuratEksternal(penanggungJawab: any) {
  const router = useRouter();
  const { data } = useSession();

  const [selectedPj, setSelectedPj] = useState("")
  const [withKaryawan, setWithKaryawan] = useState(false)
  const [tanggal, setTanggal] = useState("")
  const [lastNomorSurat, setLastNomorSurat] = useState("");
  const [newNomorSurat, setNewNomorSurat] = useState("");
  const [selectedKaryawan, setSelectedKaryawan] = useState<string[]>([]);

  useEffect(() => {
    const r = async () => {
      const rs = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/surat/eksternal/last-nomor`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${data?.rsiap?.access_token}`
        }
      });

      const result = await rs.json();
      console.log(result)
      if (result.success) {
        setLastNomorSurat(result.data.no_surat)
      } else {
        setLastNomorSurat("")
      }
    }

    r()
  }, [])

  useEffect(() => {
    parseNomorSurat()
  }, [lastNomorSurat, tanggal])

  const parseNomorSurat = () => {
    const splitNomorSurat = lastNomorSurat.split("/")
    const nomorSurat = isNaN(parseInt(splitNomorSurat[0])) ? 1 : parseInt(splitNomorSurat[0]) + 1
    const ns = nomorSurat < 100 ? `00${nomorSurat}` : nomorSurat
   
    const tgl = tanggal ? new Date(tanggal).toLocaleDateString('id-ID', { day: '2-digit' }) : new Date().toLocaleDateString('id-ID', { day: '2-digit' })
    const bulan = new Date().toLocaleDateString('id-ID', { month: '2-digit' })
    const tahun = new Date().toLocaleDateString('id-ID', { year: '2-digit' })
    
    const nomor = `${ns}/B/S-RSIA/${tgl}${bulan}${tahun}`
    setNewNomorSurat(nomor)
  }

  const onFormAddSuratEksternalSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget as any)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/surat/eksternal/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${data?.rsiap?.access_token}`
      },
      body: formData
    })

    const result = await response.json()
    if (result.success) {
      toast.success('Surat eksternal berhasil ditambahkan.')
      await new Promise(r => setTimeout(r, 2000))
      router.push('/surat/eksternal')
    } else {
      if (typeof result.message === 'object') {
        Object.entries(result.message).forEach(([key, value]) => {
          toast.error(`${key}: ${value}`)
        })
      } else {
        toast.error(result.message)
      }
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
    <form action="#!" method="post" onSubmit={onFormAddSuratEksternalSubmit}>
      <div className="grid gap-3 py-4">
        <div className="w-full space-y-1">
          <Label className="text-primary" htmlFor="no_surat">Nomor Surat</Label>
          <Input type="text" name="no_surat" placeholder="nomor surat" id="no_surat" value={newNomorSurat} onChange={(e) => setLastNomorSurat(e.target.value)} readOnly/>
          <p className="text-xs text-danger no_surat-error"></p>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-[60%] space-y-1">
            <Label className="text-primary" htmlFor="tanggal">Tannggal</Label>
            <Input type="datetime-local" name="tanggal" placeholder="Tanggal Kegiatan" id="tanggal" onChange={(e) => setTanggal(e.target.value)} />
            <p className="text-xs text-danger tanggal-error"></p>
          </div>
          <div className="w-full space-y-1">
            <Label className="text-primary" htmlFor="PJ">Penanggung Jawab</Label>
            <Input type="hidden" name="pj" value={selectedPj} />
            <Combobox items={penanggungJawab.penanggungJawab} setSelectedItem={setSelectedPj} placeholder="Pilih Penanggung Jawab" />
            <p className="text-xs text-danger pj-error"></p>
          </div>
        </div>
        <div className="w-full space-y-1">
          <Label className="text-primary" htmlFor="alamat">Alamat</Label>
          <Input type="text" name="alamat" placeholder="alamat yang dituju" id="alamat" />
          <p className="text-xs text-danger alamat-error"></p>
        </div>
        <div className="w-full space-y-1">
          <Label className="text-primary" htmlFor="perihal">Perihal</Label>
          <Input type="text" name="perihal" placeholder="Perihal Surat" id="perihal" />
          <p className="text-xs text-danger perihal-error"></p>
        </div>
      </div>

      <div className="mt-10 flex justify-end">
        <Button type="submit">Simpan</Button>
      </div>
    </form>
  )
}