import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Combobox } from "../inputs/combo-box"
import { Button } from "@/components/ui/button"
import { getSession } from "next-auth/react"
import useSWR from "swr"
import Loading1 from "../icon-loading"
import toast from "react-hot-toast"
import { useRouter } from "next/router"

interface DialogAddAgendaProps {
  add: boolean
  setAdd: any
  tanggal: any
}

const DialogAddAgenda = (props: DialogAddAgendaProps) => {
  const { add, setAdd, tanggal } = props

  const router = useRouter()
  const [status, setStatus] = useState('Belum Selesai')
  const [selectedItem, setSelectedItem] = useState<any>()
  const [penanggungJawab, setPenanggungJawab] = useState<any>([])

  const fetchPegawai = async (url: string) => {
    const session = await getSession()
    return await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.rsiap?.access_token}`,
      },
    }).then(response => {
      if (!response.ok) {
        throw Error(response.status + ' ' + response.statusText)
      }

      const data = response.json()
      const result = data.then((res) => {
        const data = res.data.map((item: any) => {
          return {
            value: item.nik,
            label: item.nama
          }
        })

        setPenanggungJawab(data)
      })

      return data
    })
  }

  const { data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/pegawai?datatables=1&with=bidang_detail&select=nik,nama`, fetchPegawai);

  const field = [
    {
      label: 'Agenda',
      name: 'agenda',
      type: 'text',
      value: '',
      required: true,
    },
    {
      label: 'Penanggung Jawab',
      name: 'pj',
      type: 'select',
      value: '',
      required: true,
      optionValue: selectedItem,
      setOptionValue: setSelectedItem,
      options: penanggungJawab
    },
    {
      label: 'Tempat',
      name: 'tempat',
      type: 'text',
      value: '',
      required: true,
    },
    {
      label: 'Waktu Mulai',
      name: 'start',
      type: 'time',
      value: '',
      required: true,
    },
    {
      label: 'Waktu Selesai',
      name: 'end',
      type: 'time',
      value: '',
      required: false,
    },
    {
      label: 'Status',
      name: 'status',
      type: 'select',
      value: '',
      required: true,
      optionValue: status,
      setOptionValue: setStatus,
      options: [
        {
          label: 'Belum Selesai',
          value: 'Belum Selesai'
        },
        {
          label: 'Selesai',
          value: 'Selesai'
        }
      ]
    },
    {
      label: 'Keterangan',
      name: 'keterangan',
      type: 'textarea',
      value: '',
      required: false,
    },
  ];

  // get input type
  const getInputType = (type: string, options?: any) => {
    switch (type) {
      case 'text':
        return <Input type="text" placeholder={options?.placeholder} defaultValue={options?.value} required={options?.required} name={options?.name} />
      case 'time':
        return <Input type="time" placeholder={options?.placeholder} defaultValue={options?.value} required={options?.required} name={options?.name} />
      case 'select':
        return (
          <>
            <Input type="hidden" name={options?.name} value={options?.optionValue} />
            <Combobox items={options?.options} setSelectedItem={options?.setOptionValue} selectedItem={options?.optionValue} placeholder={options?.placeholder} />
          </>
        )
      case 'textarea':
        return <textarea className="w-full h-24 p-2 border rounded-md bg-background border-border" placeholder={options?.placeholder} defaultValue={options?.value} required={options?.required} name={options?.name} />
      default:
        return <Input type="text" placeholder={options?.placeholder} defaultValue={options?.value} required={options?.required} name={options?.name} />
    }
  }

  // onSubmit
  const onSubmit = async (e: any) => {
    e.preventDefault()

    const data = new FormData(e.target)
    const session = await getSession()

    // add tanggal to form data
    data.append('tanggal', tanggal.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).split('/').reverse().join('-'))

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agenda`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session?.rsiap?.access_token}`
      },
      body: data
    });

    const result = await res.json();
    if (result.success) {
      toast.success('Data berhasil disimpan!');
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.reload()
    } else {
      toast.error('Data gagal disimpan!');
    }
  }

  return (
    <Dialog open={add} onOpenChange={setAdd}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className='text-primary leading-6'>Tambah Agenda</DialogTitle>
          <DialogDescription>Anda akan menambahkan agenda pada : <Badge variant="secondary">{tanggal.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</Badge></DialogDescription>
        </DialogHeader>

        {isLoading && <Loading1 height={50} width={50} />}
        {error && <div>{error.message}</div>}
        {!data && <div>No data</div>}

        {data && (
          <form action="" method="post" onSubmit={onSubmit}>
            <table className="table w-full text-left">
              {field.map((item, index) => (
                <tr key={index}>
                  <th>
                    <div className="flex items-center justify-start gap-3 mb-3">
                      <Label>{item.label}</Label>
                    </div>
                  </th>
                  <td>
                    <div className="flex items-center justify-start gap-3 mb-3">
                      : {getInputType(item.type, item)}
                    </div>
                  </td>
                </tr>
              ))}
            </table>

            <div className="flex justify-end gap-3 mt-5">
              <Button type="button" size='sm' variant="secondary" onClick={() => setAdd(false)}>Batal</Button>
              <Button type="submit" size='sm' variant="default">Tambah</Button>
            </div>
          </form>
        )}

      </DialogContent>
    </Dialog>
  )
}

export default DialogAddAgenda