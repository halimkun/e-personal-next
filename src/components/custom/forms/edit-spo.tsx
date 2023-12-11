import toast from "react-hot-toast"

import { useRouter } from "next/router"
import { useState } from "react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getSession } from "next-auth/react"

interface FormEditSpoProps {
  data: any
}

const FormEditSpo = (props: FormEditSpoProps) => {
  const router = useRouter()
  const { data } = props
  const [isLoading, setIsLoading] = useState(false)

  const onUpdate = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)

    const session = await getSession()
    const data = new FormData(e.target)

    const res = await fetch(`https://sim.rsiaaisyiyah.com/rsiap-api-dev/api/berkas/spo/update`, {
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
              <Label className="text-primary font-semibold" htmlFor="unit">Unit</Label>
              <Input type="text" id="unit" name="unit" placeholder="unit kerja" defaultValue={data.unit} />
            </div>
          </div>
          <div className="w-full">
            <div className="space-y-1.5">
              <Label className="text-primary font-semibold" htmlFor="tgl_terbit">Tanggal Terbit</Label>
              <Input type="date" id="tgl_terbit" name="tgl_terbit" placeholder="Tanggal Terbit" defaultValue={data.tgl_terbit} />
            </div>
          </div>
        </div>
        
        <div className="space-y-1.5">
          <Label className="text-primary font-semibold" htmlFor="nomor">Nomor SPO</Label>
          <Input type="text" id="nomor" name="nomor" placeholder="nomor spo" defaultValue={data.nomor} />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" className="bg-primary text-white">Simpan</Button>
      </div>
    </form>
  )
}

export default FormEditSpo;