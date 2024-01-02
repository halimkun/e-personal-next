import React, { ReactElement, useEffect } from "react"

import useSWR from "swr"
import dynamic from "next/dynamic"
import AppLayout from "@/components/layouts/app"
import Loading1 from "@/components/custom/icon-loading"
import TableSk from "@/components/custom/tables/table-sk"

import { getSession } from "next-auth/react"
import { IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { CardDescription, CardTitle } from "@/components/ui/card"

const DialogEditSk = dynamic(() => import('@/components/custom/modals/dialog-edit-sk'), { ssr: false })
const DialogMenuSk = dynamic(() => import('@/components/custom/modals/dialog-menu-sk'), { ssr: false })
const DialogAddSk = dynamic(() => import('@/components/custom/modals/dialog-add-sk'), { ssr: false })

const SKPage = () => {
  const delayDebounceFn = React.useRef<any>(null)
  const [filterData, setFilterData] = React.useState({})
  const [filterQuery, setFilterQuery] = React.useState('')
  const [selectedData, setSelectedData] = React.useState<any>(null)

  const [date, setDate] = React.useState<Date | null>(null)
  const [isOpenMenu, setIsOpenMenu] = React.useState(false)
  const [isOpenFormAdd, setIsOpenFormAdd] = React.useState(false)
  const [isFormEditOpen, setIsFormEditOpen] = React.useState(false)
  const [jenis, setJenis] = React.useState<string | undefined>(undefined)

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

  const { data, error, mutate, isLoading, isValidating } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/berkas/sk`, fetcher, {
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
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <CardTitle>Surat Keputusan Direktur</CardTitle>
            <CardDescription>Data Surat Keputusan Direktur</CardDescription>
          </div>
          <Button size={'icon'} className="w-7 h-7" onClick={() => setIsOpenFormAdd(true)}>
            <IconPlus className="w-5 h-5" />
          </Button>
        </div>
        <TableSk
          data={data}
          filterData={filterData}
          setFilterData={setFilterData}
          key={data.data?.current_page}
          isValidating={isValidating}
          onRowClick={(item: any) => {
            setSelectedData(item)
            setIsOpenMenu(true)
          }}
        />
      </div>

      {/* Modal Menu */}
      <DialogMenuSk
        isOpenMenu={isOpenMenu}
        setIsOpenMenu={setIsOpenMenu}
        setIsFormEditOpen={setIsFormEditOpen}
      />

      {/* Modal Edit */}
      <DialogEditSk
        isFormEditOpen={isFormEditOpen}
        setIsFormEditOpen={setIsFormEditOpen}
        selectedData={selectedData}
        date={date}
        setDate={setDate}
        jenis={jenis}
        setJenis={setJenis}
        mutate={mutate}
      />

      {/* Modal Form Add */}
      <DialogAddSk
        isOpenFormAdd={isOpenFormAdd}
        setIsOpenFormAdd={setIsOpenFormAdd}
        date={date}
        setDate={setDate}
        jenis={jenis}
        setJenis={setJenis}
        mutate={mutate}
      />
    </>
  )
}


SKPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default SKPage