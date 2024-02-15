import { useEffect, useRef, useState } from "react"

import useSWR from "swr"
import dynamic from "next/dynamic"
import fetcherGet from "@/utils/fetcherGet"

import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-menubar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const LaravelPagingx = dynamic(() => import('@/components/custom-ui/laravel-paging'), { ssr: false })
const Loading1 = dynamic(() => import('@/components/custom/icon-loading'), { ssr: false })

interface TablePegawaiProps {
  columnsData: any
  datatables?: string | '0' | '1'
  select?: string
}

// default value for datatables is true
const propsDefault: TablePegawaiProps = {
  columnsData: [],
  datatables: '0',
  select: 'nik,nama,bidang,jbtn'
}

const TablePegawai = (props: TablePegawaiProps) => {
  const { columnsData, datatables, select } = { ...propsDefault, ...props }

  const delayDebounceFn = useRef<any>(null)
  const [filterQuery, setFilterQuery] = useState('')
  const [filterData, setFilterData] = useState<any>({})

  const fetcher = (url: string) => fetcherGet({ url, filterQuery });

  const { data, error, mutate, isLoading, isValidating } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/pegawai?datatables=${datatables}&select=${select}`, fetcher, {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Penerima</CardTitle>
        <CardDescription>Anda dapat memilikih lebih dari 1 penerima memo ini dengan tabel dibawah ini.</CardDescription>
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
              columnsData={columnsData}
              data={data?.data}
              filterData={filterData}
              setFilterData={setFilterData}
            // isValidating={isValidating}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default TablePegawai;