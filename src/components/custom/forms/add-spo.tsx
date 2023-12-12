import toast from "react-hot-toast";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

interface FormAddSpoProps {
  lastNomor: any
}

const FormAddSpo = ({ lastNomor }: FormAddSpoProps) => {
  const router = useRouter()
  const [nn, setNn] = useState<any>('')
  const [jenisSpo, setJenisSpo] = useState<any>('medis')
  const [ln, setLn] = useState<any>(lastNomor[jenisSpo])
  const [tglTerbit, setTglTerbit] = useState<any>(new Date().toISOString().split('T')[0])

  useEffect(() => {
    setLn(lastNomor[jenisSpo])
    parseNomor()
  }, [jenisSpo, tglTerbit, lastNomor])

  function parseNomor() {
    const lastn = lastNomor[jenisSpo]
    const lastns = lastn.split('/')

    const n = parseInt(lastns[0]) + 1
    const nmr = n.toString().padStart(3, '0');

    const jns = jenisSpo === 'medis' ? 'A' : jenisSpo === 'penunjang' ? 'B' : 'C'

    const d = tglTerbit.split('-').map((item: any, index: any) => {
      if (index === 0) return item.slice(2);
      return item;
    }).reverse().join('');

    const nomor = `${nmr}/${jns}/SPO-RSIA/${d}`
    setNn(nomor)
  }

  const onSubmit = async (e: any) => {
    e.preventDefault()
    
    const session = await getSession()
    const data = new FormData(e.target)

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/berkas/spo/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session?.rsiap?.access_token}`
      },
      body: data
    })

    const result = await res.json()
    if (result.success) {
      toast.success('Data berhasil disimpan!')
      router.reload()
    } else {
      console.log(result)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-5 space-y-2">
        <div className="space-y-1.5">
          <Label className="text-primary font-semibold" htmlFor="judul">Judul SPO</Label>
          <Input type="text" id="judul" name="judul" placeholder="masukan judul spo" />
        </div>
        <div className="flex gap-3">
          <div className="w-full">
            <div className="space-y-1.5">
              <Label className="text-primary font-semibold" htmlFor="unit">Unit</Label>
              <Input type="text" id="unit" name="unit" placeholder="unit kerja" />
            </div>
          </div>
          <div className="w-full">
            <div className="space-y-1.5">
              <Label className="text-primary font-semibold" htmlFor="tgl_terbit">Tanggal Terbit</Label>
              <Input type="date" id="tgl_terbit" name="tgl_terbit" placeholder="Tanggal Terbit" value={tglTerbit} onChange={(e) => setTglTerbit(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="mb-4 space-y-1.5 relative">
          <Input type="hidden" id="jenis" name="jenis" value={jenisSpo} />
          <Label className="text-primary font-semibold" htmlFor="tipe-surat">Tipe Surat</Label>
          <RadioGroup className="flex gap-6" defaultValue={jenisSpo} onValueChange={setJenisSpo}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medis" id="r1" />
              <Label className="font-medium" htmlFor="r1">Medis / Keperawatan</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="penunjang" id="r3" />
              <Label className="font-medium" htmlFor="r3">Penunjang</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="umum" id="r2" />
              <Label className="font-medium" htmlFor="r2">Non Medis / Umum</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="space-y-1.5">
          <Label className="text-primary font-semibold" htmlFor="nomor">Nomor SPO</Label>
          <Input type="text" id="nomor" name="nomor" placeholder="nomor spo" value={nn} readOnly />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" className="bg-primary text-white">Simpan</Button>
      </div>
    </form>
  )
}

export default FormAddSpo;