import React, { ReactElement, useEffect } from "react"

import useSWR from "swr"
import AppLayout from "@/components/layouts/app"
import Loading1 from "@/components/custom/icon-loading"
import TableSuratMasuk from "@/components/custom/tables/surat-masuk"

import { NextPageWithLayout } from "@/pages/_app"
import { getSession } from "next-auth/react"
import { IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { CardDescription, CardTitle } from "@/components/ui/card"
import toast from "react-hot-toast"

const SuratMasukPage: NextPageWithLayout = () => {
  const delayDebounceFn = React.useRef<any>(null)
  const [isOpenFormAdd, setIsOpenFormAdd] = React.useState(false)
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

  const { data, error, mutate, isLoading, isValidating } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/surat/masuk`, fetcher, {
    revalidateOnFocus: false,
    refreshWhenOffline: false,
    refreshWhenHidden: true,
  })

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

  if (isLoading) return <Loading1 height={50} width={50} />
  if (error) return <div>{error.message}</div>
  if (!data) return <div>No data</div>

  return (
    <>
      <div className="space-y-2">
        <div className="flex justify-between items-center mb-4">
          <div className="space-y-1">
            <CardTitle>Surat Keputusan Direktur</CardTitle>
            <CardDescription>Data Surat Keputusan Direktur</CardDescription>
          </div>
          <Button size={'icon'} className="w-7 h-7" onClick={() => setIsOpenFormAdd(true)}>
            <IconPlus className="w-5 h-5" />
          </Button>
        </div>

        <TableSuratMasuk
          data={data}
          filterData={filterData}
          setFilterData={setFilterData}
          isValidating={isValidating}
          lastColumnAction={true}
          onRowClick={(row: any) => {
            toast.success(row.pengirim)
          }}
        />
      </div>
    </>
  )
}

SuratMasukPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default SuratMasukPage