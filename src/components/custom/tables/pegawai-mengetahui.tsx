import useSWR from "swr";
import dynamic from "next/dynamic";
import fetcherGet from "@/utils/fetcherGet";

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const LaravelPagingx = dynamic(() => import('@/components/custom-ui/laravel-paging'), { ssr: false })
const Loading1 = dynamic(() => import('@/components/custom/icon-loading'), { ssr: false })

interface TablePegawaiMengetahuiProps {
  selectedMengetahui: string[]
  setSelectedMengetahui: (value: string[]) => void
  maxMengetahui: number
}

const TablePegawaiMengetahui = (props: TablePegawaiMengetahuiProps) => {

  const { selectedMengetahui, setSelectedMengetahui, maxMengetahui } = props

  const delayDebounceFn = useRef<any>(null)
  const [filterData, setFilterData] = useState<any>({})
  const [filterQuery, setFilterQuery] = useState('')

  const fetcher = (url: string) => fetcherGet({url, filterQuery})

  const { data, error, mutate, isLoading, isValidating } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/pegawai/get/mengetahui`, fetcher, {
    revalidateOnFocus: false,
    refreshWhenOffline: false,
    refreshWhenHidden: true,
  });

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

  const mengetahuiColumns = [
    {
      name: "",
      selector: 'pilih',
      data: (row: any) => (
        <div className="px-2">
          <Checkbox
            id={row.nik}
            name="karyawan[]"
            value={row.nik}
            checked={selectedMengetahui.includes(row.nik)}
            // disable all not selected if selected >= maxMengetahui 
            disabled={selectedMengetahui.length >= maxMengetahui && !selectedMengetahui.includes(row.nik)}
            onCheckedChange={() => {
              if (selectedMengetahui.includes(row.nik)) {
                setSelectedMengetahui(selectedMengetahui.filter((item) => item !== row.nik))
              } else {
                setSelectedMengetahui([...selectedMengetahui, row.nik])
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
          </label>
        </div>
      )
    }, {
      name: 'Jabatan',
      selector: 'jabatan',
      data: (row: any) => (
        <div className="flex items-center gap-4">
          <label
            htmlFor={row.nik}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 w-full"
          >
            <div>{row.jbtn}</div>
          </label>
        </div>
      )
    }
  ]


  return (
    <Card className="w-full lg:sticky top-16">
      <CardHeader>
        <CardTitle>Mengetahui</CardTitle>
        <CardDescription>Anda dapat memilih maksimal 2 orang yang mengetahui memo ini dengan tabel dibawah ini.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* is loading */}
        {isLoading && <Loading1 height={50} width={50} />}
        {error && <p>error: {error.message}</p>}


        {data && (
          <>
            {/* search */}
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
              columnsData={mengetahuiColumns}
              data={data?.data}
              filterData={filterData}
              setFilterData={setFilterData}
              isValidating={isValidating}
            />
          </>
        )}

      </CardContent>
    </Card>
  )
}

export default TablePegawaiMengetahui;