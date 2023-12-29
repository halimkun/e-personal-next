import React, { ReactElement, useEffect } from "react"

import AppLayout from "@/components/layouts/app"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import TableSk from "@/components/custom/tables/table-sk"
import { Button } from "@/components/ui/button"
import { IconDeviceSdCard, IconPlus, IconX } from "@tabler/icons-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { DatePickerDemo } from "@/components/custom/inputs/date-picker"
import { Combobox } from "@/components/custom/inputs/combo-box"
import { getSession } from "next-auth/react"
import toast from "react-hot-toast"
import useSWR from "swr"
import Loading1 from "@/components/custom/icon-loading"


const SKPage = () => {
  const [date, setDate] = React.useState<Date | null>(null)
  const [isOpenFormAdd, setIsOpenFormAdd] = React.useState(false)
  const [jenis, setJenis] = React.useState<string | undefined>(undefined)

  const delayDebounceFn = React.useRef<any>(null)
  const [filterData, setFilterData] = React.useState({})
  const [filterQuery, setFilterQuery] = React.useState('')

  const fetcher = async (url: any) => {
    const session = await getSession()
    const response = await fetch(url + filterQuery, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.rsiap?.access_token}`,
      },
    })

    if (!response.ok) {
      throw new Error(response.status + ' ' + response.statusText)
    }

    const jsonData = await response.json()
    return jsonData
  }

  const { data, error, mutate, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/berkas/sk`, fetcher)

  useEffect(() => {
    let fq = ''
    for (const [key, value] of Object.entries(filterData)) {
      if (value) {
        fq += fq === '' ? `?${key}=${value}` : `&${key}=${value}`
      }
    }

    setFilterQuery(fq)
  }, [filterData])

  useEffect(() => {
    if (delayDebounceFn.current) {
      clearTimeout(delayDebounceFn.current);
    }

    delayDebounceFn.current = setTimeout(() => {
      mutate();
    }, 250);

    return () => clearTimeout(delayDebounceFn.current);
  }, [filterQuery]);

  const onSubmit = async (e: any) => {
    e.preventDefault()
    const session = await getSession()
    // data : jenis, judul, pj, tgl_terbit
    const data = {
      jenis: jenis,
      judul: e.target.judul.value,
      pj: e.target.pj.value,
      tgl_terbit: e.target.tgl_terbit.value
    }

    // post data to api
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/berkas/sk/store`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session?.rsiap?.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })

    const result = await res.json()

    if (result.success) {
      toast.success('Data berhasil disimpan!');

      // reload table swr
      mutate()

      // reset form and close modal
      e.target.reset()
      setIsOpenFormAdd(false)
    } else {
      toast.error('Data gagal disimpan!');
    }
  }

  if (isLoading) return <Loading1 height={50} width={50} />
  if (error) return <div>{error.message}</div>
  if (!data) return <div>No data</div>

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <CardTitle>Surat Keputusan Direktur</CardTitle>
              <CardDescription>Data Surat Keputusan Direktur</CardDescription>
            </div>
            <Button size={'icon'} className="w-7 h-7" onClick={() => setIsOpenFormAdd(true)}>
              <IconPlus className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <TableSk
            data={data}
            filterData={filterData}
            setFilterData={setFilterData}
            key={data.data?.current_page}
          />
        </CardContent>
      </Card>

      <Dialog open={isOpenFormAdd} onOpenChange={setIsOpenFormAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Surat Keputusan Direktur</DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
          <form method="post" onSubmit={onSubmit}>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="judul">Judul SK</Label>
                <Input id="judul" name="judul" placeholder="judul sk yang akan dibuat" />
              </div>
              <div className="flex gap-3">
                <div className="w-full space-y-1.5">
                  <Label htmlFor="pj">Penanggung Jawab</Label>
                  <Input id="pj" name="pj" placeholder="pilih pj" className="w-full" />
                </div>
                <div className="w-full space-y-1.5">
                  <Label htmlFor="tgl_terbit">Tanggal Terbit</Label>
                  <Input type="hidden" id="tgl_terbit" name="tgl_terbit" placeholder="pilih tanggal terbit" value={
                    new Date(date || Date.now()).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric'
                    }).split('/').reverse().join('-')
                  } />
                  <DatePickerDemo
                    date={date}
                    setDate={setDate}
                    placeholder="pilih tanggal terbit"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="judul">Judul SK</Label>
                <Combobox
                  items={[
                    { value: 'A', label: 'SK Dokumen' },
                    { value: 'B', label: 'SK Pengangkatan Jabatan' },
                  ]}
                  setSelectedItem={(item: any) => setJenis(item)}
                  selectedItem={jenis}
                  placeholder="Jenis SK"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <Button size={'sm'} variant="outline"><IconX className="mr-2 h-4 w-4" />Cancel</Button>
              <Button size={'sm'} type="submit" className="text-secondary-foreground"><IconDeviceSdCard className="mr-2 h-4 w-4" />Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}


SKPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default SKPage