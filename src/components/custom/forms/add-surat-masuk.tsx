import { Label } from "@/components/ui/label"
import { DatePickerDemo } from "../inputs/date-picker"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { Combobox } from "../inputs/combo-box"
import { Button } from "@/components/ui/button"
import { IconDeviceSdCard } from "@tabler/icons-react"
import { getSession } from "next-auth/react"
import toast from "react-hot-toast"
import Loading1 from "../icon-loading"

interface formAddSuratMasukProps {
  data?: any
  mutate?: () => void
  setIsOpenFormAdd?: (value: boolean) => void
}

function setToDefaultDate(date: any) {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).split('/').reverse().join('-')
}

const FormAddSuratMasuk = (props: formAddSuratMasukProps) => {
  const {
    data,
    mutate = () => { },
    setIsOpenFormAdd = () => { }
  } = props

  const [isLoading, setIsLoading] = useState(false)
  const [no_simrs, setNoSimrs] = useState<any>()
  const [tgl_surat, setTglSurat] = useState<any>()
  const [tgl_pelaksanaan, setTglPelaksanaan] = useState<any>()
  const [via, setVia] = useState<any>(null)

  async function handleCreate(e: any) {
    e.preventDefault()
    setIsLoading(true)
    const data = new FormData(e.target)
    const session = await getSession()

    data.set('no_simrs', setToDefaultDate(data.get('no_simrs')))
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

    setIsLoading(false)
  }

  const handleUpdate = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)
    const data = new FormData(e.target)
    const session = await getSession()

    data.set('no_simrs', setToDefaultDate(data.get('no_simrs')))
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/surat/masuk/update`, {
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

    setIsLoading(false)
  }

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setNoSimrs(new Date(data.no_simrs))

      // data.tgl_surat is valid date
      if (data.tgl_surat && data.tgl_surat != '0000-00-00') {
        setTglSurat(new Date(data.tgl_surat))
      }

      if (data.pelaksanaan && data.pelaksanaan != '0000-00-00') {
        setTglPelaksanaan(new Date(data.pelaksanaan))
      }

      setVia(data.via)
    } else {
      const today = new Date()
      setNoSimrs(today)
    }

  }, [data])

  return (
    <form action="" method="post" encType="multipart/form-data" onSubmit={data && Object.keys(data).length > 0 ? handleUpdate : handleCreate}>
      {data && Object.keys(data).length > 0 && (
        <Input type="hidden" id="no" name="no" placeholder="no" className="w-full" defaultValue={data ? data.no : ''} />
      )}

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
              date={no_simrs}
              setDate={setNoSimrs}
              placeholder="pilih tanggal"
            />
          </div>
          <div className="w-full space-y-1">
            <Label htmlFor="no_surat">No Surat</Label>
            <Input id="no_surat" name="no_surat" placeholder="no surat" className="w-full" defaultValue={data ? data.no_surat : ''} />
          </div>
        </div>

        <div className="w-full space-y-1">
          <Label htmlFor="perihal">Perihal</Label>
          <Input id="perihal" name="perihal" placeholder="perihal surat" className="w-full" defaultValue={data ? data.perihal : ''} />
        </div>

        <div className="w-full space-y-1">
          <Label htmlFor="pengirim">Pengirim</Label>
          <Input id="pengirim" name="pengirim" placeholder="lembaga pengirim" className="w-full" defaultValue={data ? data.pengirim : ''} />
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
              date={tgl_surat}
              setDate={setTglSurat}
              placeholder="pilih tanggal"
            />
          </div>

          <div className="w-full space-y-1">
            <Label htmlFor="pelaksanaan">Tgl Pelaksanaan</Label>
            <Input type="hidden" id="pelaksanaan" name="pelaksanaan" placeholder="pilih tanggal" value={
              new Date(tgl_pelaksanaan).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric'
              }).split('/').reverse().join('-')
            } />
            <DatePickerDemo
              date={tgl_pelaksanaan}
              setDate={setTglPelaksanaan}
              placeholder="pilih tanggal"
            />
          </div>
        </div>

        <div className="w-full space-y-1">
          <Label htmlFor="tempat">Tempat</Label>
          <Input id="tempat" name="tempat" placeholder="tempat surat" className="w-full" defaultValue={data ? data.tempat : ''} />
        </div>

        <div className="w-full space-y-1">
          <Label htmlFor="berkas">File Berkas</Label>
          <Input type="file" id="berkas" name="berkas" placeholder="berkas surat" className="w-full" />
        </div>

        <div className="w-full space-y-1">
          <Label htmlFor="via">Dikirim Via</Label>
          <Input type="hidden" id="ket" name="ket" placeholder="ket" className="w-full" defaultValue={data ? data.ket : ''} />
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
            selectedItem={via}
            placeholder="Dikirim Via"
          />
        </div>
      </div>

      <div className="w-full flex justify-end mt-6">
        <Button type="submit" className="w-full md:w-auto" variant={'default'} size={'sm'}>
          {
            isLoading ? (
              <div className="flex items-center justify-center gap-1 font-bold"><Loading1 height={20} width={20} /> Menyimpan Data... </div>
            ) : (
              <div className="flex items-center justify-center gap-1 font-bold"><IconDeviceSdCard className="w-5 h-5" /> Simpan Data</div>
            )
          }
        </Button>
      </div>
    </form>
  )
}

export default FormAddSuratMasuk