import toast from "react-hot-toast";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Combobox } from "../inputs/combo-box";
import { MultiSelect } from "../inputs/multi-select";
import { Toggle } from "@radix-ui/react-toggle";
import { IconCursorText } from "@tabler/icons-react";

interface FormAddSpoProps {
  lastNomor: any
}

const FormAddSpo = ({ lastNomor }: FormAddSpoProps) => {
  const router = useRouter()
  const [nn, setNn] = useState<any>('')
  const [jenisSpo, setJenisSpo] = useState<any>('medis')
  const [ln, setLn] = useState<any>(lastNomor[jenisSpo])
  const [departemen, setDepartemen] = useState<any[]>([])
  const [isTypeManual, setIsTypeManual] = useState<any>()
  const [selected, setSelected] = useState<string | undefined>(undefined)
  const [tglTerbit, setTglTerbit] = useState<any>(new Date().toISOString().split('T')[0])
  const [selectedDep, setSelectedDep] = useState<string[]>([]);

  const [unit, setUnit] = useState<any>('')

  useEffect(() => {
    setLn(lastNomor[jenisSpo])
    parseNomor()
  }, [jenisSpo, tglTerbit, lastNomor])

  useEffect(() => {
    const getDepartemen = async () => {
      const session = await getSession()
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/departemen`, {
        headers: {
          'Authorization': `Bearer ${session?.rsiap?.access_token}`
        }
      })
      const result = await res.json()
      if (result.success) {
        const items = result.data.map((item: any) => {
          return {
            label: item.nama,
            value: item.dep_id
          }
        })

        setDepartemen(items)
      }
    }
    getDepartemen()
  }, [])

  useEffect(() => {
    if (selectedDep.length > 0) {
      const isManual = selectedDep.find((item: any) => item === '-')
      if (isManual) {
        setIsTypeManual(true)
      } else {
        setIsTypeManual(false)
      }
    }
  }, [selectedDep])

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

    if (isTypeManual) {
      // value is anak,casmix
      data.set('unit', unit)
    } else {
      data.set('unit', selectedDep.join(','))
    }

    data.delete('unit_manual')

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
          {/* <div className="w-full">
            <div className="space-y-1.5">
              <Label className="text-primary font-semibold" htmlFor="unit">Unit Kerja</Label>
              <Input type="hidden" id="unit" name="unit" placeholder="unit kerja" defaultValue={unit} />
              <Combobox items={departemen} setSelectedItem={setSelected} selectedItem={selected} placeholder="Pilih Unit" />
            </div>
          </div> */}
          <div className="w-full">
            <div className="space-y-1.5">
              <Label className="text-primary font-semibold" htmlFor="tgl_terbit">Tanggal Terbit</Label>
              <Input type="date" id="tgl_terbit" name="tgl_terbit" placeholder="Tanggal Terbit" value={tglTerbit} onChange={(e) => setTglTerbit(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between mt-3">
            <Label className="text-primary font-semibold" htmlFor="unit">Unit Kerja</Label>
            <div className="flex items-center space-x-2">
              <Toggle aria-label="Toggle italic" onPressedChange={() => setIsTypeManual(!isTypeManual)}>
                <span className="font-medium text-sm">{isTypeManual ? 'Pilih' : 'Manual'}</span>
              </Toggle>
            </div>
          </div>
          <Input type="hidden" id="unit" name="unit" placeholder="unit kerja" defaultValue={selectedDep} />
          {!isTypeManual ? (
            <MultiSelect
              options={departemen}
              selected={selectedDep}
              onChange={setSelectedDep}
              className="w-[560px]"
            />
          ) : (<></>)}
        </div>
        {isTypeManual ? (
          <div className="space-y-1.5">
            {/* <Label className="text-primary font-semibold" htmlFor="tunit">Tuliskan Unit</Label> */}
            <Input type="text" id="tunit" placeholder="tuliskan unit manual" onChange={(e) => setUnit(e.target.value)} name="unit_manual" disabled={!isTypeManual} />
          </div>
        ) : (<></>)}
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