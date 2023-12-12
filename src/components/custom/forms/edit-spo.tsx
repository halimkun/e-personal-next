import toast from "react-hot-toast"

import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getSession } from "next-auth/react"
import { Toggle } from "@/components/ui/toggle"
import { IconSelect, IconTxt } from "@tabler/icons-react"
import { Combobox } from "../inputs/combo-box"

interface FormEditSpoProps {
  data: any
}

const FormEditSpo = (props: FormEditSpoProps) => {
  const { data } = props
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isTypeManual, setIsTypeManual] = useState(false)
  const [departemen, setDepartemen] = useState<any[]>([])
  const [selected, setSelected] = useState<any>('-')

  const [unit, setUnit] = useState<any>(data.unit)

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

        const selected = items.find((item: any) => item.value === data.unit)
        if (selected) {
          setSelected(selected.value)
          setUnit(selected.value)
        } else {
          setSelected('-')
          setUnit(data.unit)
        }

        setDepartemen(items)
      }
    }
    getDepartemen()
  }, [])

  useEffect(() => {
    setIsTypeManual(selected == "-")
    setUnit(selected == "-" ? data.unit : selected)
  }, [selected])

  const onUpdate = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)

    const session = await getSession()
    const data = new FormData(e.target)

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
        <div className="flex gap-3">
          <div className="w-full">
            <div className="space-y-1.5">
              <Label className="text-primary font-semibold" htmlFor="unit">Unit Kerja</Label>
              <Input type="hidden" id="unit" name="unit" placeholder="unit kerja" defaultValue={unit} />
              <Combobox items={departemen} setSelectedItem={setSelected} selectedItem={unit} placeholder="Pilih Unit" />
            </div>
          </div>
          <div className="w-full">
            <div className="space-y-1.5">
              <Label className="text-primary font-semibold" htmlFor="tgl_terbit">Tanggal Terbit</Label>
              <Input type="date" id="tgl_terbit" name="tgl_terbit" placeholder="Tanggal Terbit" defaultValue={data.tgl_terbit} />
            </div>
          </div>
        </div>
        {isTypeManual ? (
          <div className="space-y-1.5">
            <Label className="text-primary font-semibold" htmlFor="tunit">Tuliskan Unit</Label>
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