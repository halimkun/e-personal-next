import toast from "react-hot-toast"

import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getSession } from "next-auth/react"
import { MultiSelect } from "../inputs/multi-select"
import { Toggle } from "@radix-ui/react-toggle"

interface FormEditSpoProps {
  data: any
}

const FormEditSpo = (props: FormEditSpoProps) => {
  const { data } = props
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isTypeManual, setIsTypeManual] = useState(false)
  const [departemen, setDepartemen] = useState<any[]>([])

  const [unit, setUnit] = useState<any>(data.unit)
  const [selectedDep, setSelectedDep] = useState<string[]>([]);

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

        const selectedDep = data.unit.split(',')
        // if selected dep available in departemen, then set selected dep
        if (selectedDep.every((item: any) => items.some((i: any) => i.value === item))) {
          setSelectedDep(selectedDep)
        } else {
          setIsTypeManual(true)
          setSelectedDep([])
        }

        setDepartemen(items)
      }
    }
    getDepartemen()
  }, [])

  const onUpdate = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)

    const session = await getSession()
    const data = new FormData(e.target)

    if (isTypeManual) {
      data.set('unit', unit)
    } else {
      data.set('unit', selectedDep.join(','))
    }

    data.delete('unit_manual')

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/berkas/spo/update`, {
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
      setIsLoading(false)
    } else {
      console.log(result)
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onUpdate}>
      <div className="mb-5 space-y-2">
        <div className="space-y-1.5">
          <Label className="text-primary font-semibold" htmlFor="judul">Judul SPO</Label>
          <Input type="text" id="judul" name="judul" placeholder="masukan judul spo" defaultValue={data.judul} />
        </div>
        <div className="flex flex-col gap-2">
          <div className="w-full">
            <div className="space-y-1.5">
              <Label className="text-primary font-semibold" htmlFor="tgl_terbit">Tanggal Terbit</Label>
              <Input type="date" id="tgl_terbit" name="tgl_terbit" placeholder="Tanggal Terbit" defaultValue={data.tgl_terbit} />
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
            <Input type="text" id="tunit" placeholder="tuliskan unit manual" onChange={(e) => setUnit(e.target.value)} defaultValue={unit} name="unit_manual" disabled={!isTypeManual} />
          </div>
        ) : (<></>)}
        <div className="space-y-1.5">
          <Label className="text-primary font-semibold" htmlFor="nomor">Nomor SPO</Label>
          <Input type="text" id="nomor" name="nomor" placeholder="nomor spo" defaultValue={data.nomor} />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" className="bg-primary text-white">
          {isLoading ? 'Saving...' : 'Simpan'}
        </Button>
      </div>
    </form>
  )
}

export default FormEditSpo;