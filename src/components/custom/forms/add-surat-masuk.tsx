import { Label } from "@/components/ui/label"
import { DatePickerDemo } from "../inputs/date-picker"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Combobox } from "../inputs/combo-box"
import { Button } from "@/components/ui/button"
import { IconDeviceSdCard } from "@tabler/icons-react"
import { getSession } from "next-auth/react"
import toast from "react-hot-toast"

interface formAddSuratMasukProps {
  data?: any
  mutate?: () => void
  setIsOpenFormAdd?: (value: boolean) => void
}

const FormAddSuratMasuk = (props: formAddSuratMasukProps) => {
  const {
    data,
    mutate = () => { },
    setIsOpenFormAdd = () => { }
  } = props

  const [no_simrs, setNoSimrs] = useState<any>(data ? data.no_simrs : Date.now())
  const [tgl_surat, setTglSurat] = useState<any>(data ? data.tgl_surat : '')
  const [tgl_pelaksanaan, setTglPelaksanaan] = useState<any>(data ? data.pelaksanaan : '')
  const [via, setVia] = useState<any>(null)

  async function handleSubmit(e: any) {
    e.preventDefault()
    const data = new FormData(e.target)
    const session = await getSession()

    data.set('no_simrs', new Date(data.get('no_simrs') as string).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).split('/').reverse().join('-'))

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/surat/masuk/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session?.rsiap?.access_token}`,
      },
      body: data
    })

    const jsonData = await response.json()
    if (jsonData.success) {
      setIsOpenFormAdd(false)
      toast.success(jsonData.message)
      mutate()
    } else {
      for (const [key, value] of Object.entries(jsonData.message)) {
        const val = value as string[]
        toast.error(val[0])
      }
    }
  }

  return (
    <form action="" method="post" onSubmit={handleSubmit} encType="multipart/form-data">
      <div className="w-full flex flex-col gap-2">
        <div className="w-full flex flex-col lg:flex-row gap-4">
          <div className="w-full space-y-1">
            <Label htmlFor="no_simrs">No SIMRS</Label>
            <Input type="hidden" id="no_simrs" name="no_simrs" placeholder="pilih tanggal" value={
              new Date(no_simrs).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric'
              }).split('/').reverse().join('-')
            } />
            <DatePickerDemo
              date={no_simrs ? no_simrs : data ? data.no_simrs : ''}
              setDate={setNoSimrs}
              placeholder="pilih tanggal"
            />
          </div>
          <div className="w-full space-y-1">
            <Label htmlFor="no_surat">No Surat</Label>
            <Input id="no_surat" name="no_surat" placeholder="no surat" defaultValue={data ? data.no_surat : ''} className="w-full" />
          </div>
        </div>

        <div className="w-full space-y-1">
          <Label htmlFor="perihal">Perihal</Label>
          <Input id="perihal" name="perihal" placeholder="perihal surat" defaultValue={data ? data.perihal : ''} className="w-full" />
        </div>

        <div className="w-full space-y-1">
          <Label htmlFor="pengirim">Pengirim</Label>
          <Input id="pengirim" name="pengirim" placeholder="lembaga pengirim" defaultValue={data ? data.pengirim : ''} className="w-full" />
        </div>

        <div className="w-full flex flex-col lg:flex-row gap-4">
          <div className="w-full space-y-1">
            <Label htmlFor="tgl_surat">Tgl Surat</Label>
            <Input type="hidden" id="tgl_surat" name="tgl_surat" placeholder="pilih tanggal" value={
              new Date(tgl_surat).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric'
              }).split('/').reverse().join('-')
            } />
            <DatePickerDemo
              date={tgl_surat ? tgl_surat : data ? data.tgl_surat : ''}
              setDate={setTglSurat}
              placeholder="pilih tanggal"
            />
          </div>

          <div className="w-full space-y-1">
            <Label htmlFor="tgl_pelaksanaan">Tgl Pelaksanaan</Label>
            <Input type="hidden" id="tgl_pelaksanaan" name="tgl_pelaksanaan" placeholder="pilih tanggal" value={
              new Date(tgl_pelaksanaan).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric'
              }).split('/').reverse().join('-')
            } />
            <DatePickerDemo
              date={tgl_pelaksanaan ? tgl_pelaksanaan : data ? data.pelaksanaan : ''}
              setDate={setTglPelaksanaan}
              placeholder="pilih tanggal"
            />
          </div>
        </div>

        <div className="w-full space-y-1">
          <Label htmlFor="tempat">Tempat</Label>
          <Input id="tempat" name="tempat" placeholder="tempat surat" defaultValue={data ? data.tempat : ''} className="w-full" />
        </div>
        
        <div className="w-full space-y-1">
          <Label htmlFor="berkas">File Berkas</Label>
          <Input type="file" id="berkas" name="berkas" placeholder="berkas surat" defaultValue={data ? data.berkas : ''} className="w-full" />
        </div>

        <div className="w-full space-y-1">
          <Label htmlFor="via">Dikirim Via</Label>
          <Input type="hidden" id="ket" name="ket" placeholder="ket" defaultValue={data ? data.via : via} className="w-full" />
          <Combobox
            items={[
              { value: '', label: 'Semua' },
              { value: 'wa', label: 'WhatsApp' },
              { value: 'fisik', label: 'Fisik' },
              { value: 'email', label: 'Email' },
              { value: 'fax', label: 'FAX' },
            ]}
            setSelectedItem={(item: any) => {
              setVia(item)
            }}
            selectedItem={via ? via : data ? data.via : ''}
            placeholder="Dikirim Via"
          />
        </div>
      </div>

      <div className="w-full flex justify-end mt-6">
        <Button type="submit" className="w-full md:w-auto" variant={'default'} size={'sm'}>
          <IconDeviceSdCard className="w-5 h-5 mr-2" /> SIMPAN
        </Button>
      </div>
    </form>
  )
}

export default FormAddSuratMasuk