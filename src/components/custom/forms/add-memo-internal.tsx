import { useEffect, useRef, useState } from "react";

import { useRouter } from "next/router";
import { getSession } from "next-auth/react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePickerDemo } from "../inputs/date-picker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"

import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import useSWR from "swr";
import Loading1 from "../icon-loading";
import { Badge } from "@/components/ui/badge";
import LaravelPagingx from "@/components/custom-ui/laravel-paging";
import { Checkbox } from "@/components/ui/checkbox";

const Editor = dynamic(
  () => import('@/components/custom/editor'),
  { ssr: false }
)

interface FormAddMemoInternalProps {
  data?: any
}

const FormAddMemoInternal = (props: FormAddMemoInternalProps) => {

  const route = useRouter()

  console.log('props', props)

  const [isiKonten, setIsiKonten] = useState(props.data?.content ?? '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tglTerbit, setTglTerbit] = useState<Date | null>(props.data?.perihal?.tgl_terbit ? new Date(props.data.perihal?.tgl_terbit) : new Date())

  const [selectedKaryawan, setSelectedKaryawan] = useState<string[]>(props.data?.penerima ? props.data.penerima.map((item: any) => item.penerima) : [])

  const delayDebounceFn = useRef<any>(null)
  const [filterData, setFilterData] = useState<any>({})
  const [filterQuery, setFilterQuery] = useState('')

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

  const { data, error, mutate, isLoading, isValidating } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/pegawai?datatables=0&select=nik,nama,bidang,jbtn`, fetcher, {
    revalidateOnFocus: false,
    refreshWhenOffline: false,
    refreshWhenHidden: true,
  });

  useEffect(() => {
    let fq = ''
    for (const [key, value] of Object.entries(filterData)) {
      if (value) {
        fq += fq === '' ? `&${key}=${value}` : `&${key}=${value}`
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

  const KaryawanColumns = [
    {
      name: "",
      selector: 'pilih',
      data: (row: any) => (
        <div className="px-2">
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
        </div>
      )
    },

    {
      name: 'Nama',
      selector: 'nama',
      data: (row: any) => (
        <div className="flex items-center gap-4">
          <label
            htmlFor={row.nik}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 w-full"
          >
            <div className="font-bold">{row.nama}</div>
            <div className="my-2 mb-5">
              <Badge variant="secondary" className="cursor-pointer">
                {row.nik}
              </Badge>
            </div>

            <div className="flex flex-row gap-1 flex-wrap w-full justify-end">
              <Badge variant="outline" className="cursor-pointer" title="Bidang">
                {row.bidang}
              </Badge>
              <Badge variant="outline" className="cursor-pointer" title="Jabatan">
                {row.jbtn}
              </Badge>
              <Badge variant="outline" className="cursor-pointer" title="Departemen">
                {row.dpt.nama}
              </Badge>
            </div>
          </label>
        </div>
      )
    },
  ]

  const onSubmit = async (e: any) => {
    e.preventDefault()
    setIsSubmitting(true)

    const session = await getSession();
    const data = new FormData(e.target);

    // add tglTerbit to data
    data.append('tanggal', tglTerbit?.toISOString().slice(0, 10) ?? '')
    data.append('content', isiKonten)
    data.append('penerima', JSON.stringify(selectedKaryawan))

    if (props.data?.no_surat) {
      data.append('no_surat', props.data.no_surat)
    }

    // if props.data available, then it's an edit form 
    if (props.data) {
      var url = '/berkas/memo/internal/update';
    } else {
      var url = '/berkas/memo/internal/store';
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + session?.rsiap?.access_token
      },
      body: data
    }).then(response => response.json())

    if (response.success) {
     setIsSubmitting(false)
      toast.success(response.message)
      await new Promise(resolve => setTimeout(resolve, 1500))

      route.push('/memo/internal')
    } else {
      setIsSubmitting(false)
      toast.error(response.message)
    }
  }

  return (
    <div className="w-full">
      <form method="post" className="flex gap-3 flex-col md:flex-row items-start" onSubmit={onSubmit}>
        <Card className="w-full top-16 lg:sticky">
          <CardHeader>
            <CardTitle>Buat Memo Internal Baru</CardTitle>
            <CardDescription>Isi form dibawah ini untuk membuat memo internal baru</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col lg:flex-row gap-2">
                <div className="space-y-1 w-full">
                  <Label className="text-primary font-semibold">Dari</Label>
                  <Input placeholder="pengirim memo" name="dari" defaultValue={props.data?.dari ?? ''} />
                </div>

                <div className="space-y-1 w-[70%]">
                  <Label className="text-primary font-semibold" htmlFor="tgl_terbit">Tanggal Terbit</Label>
                  <DatePickerDemo
                    date={tglTerbit}
                    setDate={setTglTerbit}
                    placeholder="pilih tanggal"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-primary font-semibold">Perihal</Label>
                <Input placeholder="perihal memo internal" name="perihal" defaultValue={props.data?.perihal?.perihal ?? ''} />
              </div>
              <div className="space-y-1">
                <Label className="text-primary font-semibold">Isi Konten</Label>
                <Editor
                  value={isiKonten}
                  onChange={(data: any) => setIsiKonten(data)}
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                className="bg-primary text-white hover:bg-primary-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Memo'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full top-16 lg:sticky">
          <CardHeader>
            <CardTitle>Penerima</CardTitle>
            <CardDescription>Anda dapat memilikih lebih dari 1 penerima memo ini dengan combobox dibawah ini.</CardDescription>
          </CardHeader>
          <CardContent>

            {/* is loading */}
            {isLoading && <Loading1 height={50} width={50} />}
            {error && <p>Error: {error.message}</p>}

            {data && (
              <>
                <div className="w-full space-y-1">
                  <Label>Search</Label>
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full"
                    defaultValue={filterData?.keyword}
                    onChange={(e) => {
                      setFilterData({ ...filterData, keyword: e.target.value })
                    }}
                  />
                </div>

                <LaravelPagingx
                  columnsData={KaryawanColumns}
                  data={data?.data}
                  filterData={filterData}
                  setFilterData={setFilterData}
                // isValidating={isValidating}
                />
              </>
            )}

            {/* <div className="w-full space-y-1 mb-6">
              <Label className="text-primary" htmlFor="PJ">Penerima Memo</Label>
              <Input type="hidden" name="pj" value={selectedPenerimaLabel} />
              <MultiSelect
                options={pj}
                selected={selectedPenerimaLabel}
                onChange={setSelectedPenerimaLabel}
                valueSelected={selectedPenerimaValue}
                onValueChange={setSelectedPenerimaValue}
              />
            </div> */}
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

export default FormAddMemoInternal