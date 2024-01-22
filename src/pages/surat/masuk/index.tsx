import React, { ReactElement, useEffect, useRef, useState } from "react"

import useSWR from "swr"
import dynamic from "next/dynamic"
import AppLayout from "@/components/layouts/app"
import Loading1 from "@/components/custom/icon-loading"
import TableSuratMasuk from "@/components/custom/tables/surat-masuk"

import { NextPageWithLayout } from "@/pages/_app"
import { getSession } from "next-auth/react"
import { IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { CardDescription, CardTitle } from "@/components/ui/card"

const DialogPreviewSuratMasuk = dynamic(() => import('@/components/custom/modals/dialog-preview-surat-masuk'), { ssr: false })
const DialogMenuSuratMasuk = dynamic(() => import('@/components/custom/modals/dialog-menu-surat-masuk'), { ssr: false })
const DialogAddSuratMasuk = dynamic(() => import('@/components/custom/modals/dialog-add-surat-masuk'), { ssr: false })

const SuratMasukPage: NextPageWithLayout = () => {
  const [selectedItem, setSelectedItem] = useState<any>({})
  const [isOpenFormAdd, setIsOpenFormAdd] = useState(false)
  const [isOpenPreview, setIsOpenPreview] = useState(false)
  const [isOpenMenu, setIsOpenMenu] = useState(false)
  

  const delayDebounceFn = useRef<any>(null)
  const [filterData, setFilterData] = useState({})
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
            <CardTitle>Surat Masuk</CardTitle>
            <CardDescription>Data Surat Masuk | <strong>RSIA Aisyiyah Pekajangan</strong></CardDescription>
          </div>
          <Button size={'icon'} className="w-7 h-7" onClick={() => {
            setIsOpenFormAdd(true)
            setSelectedItem({})
          }}>
            <IconPlus className="w-5 h-5" />
          </Button>
        </div>

        <TableSuratMasuk
          data={data}
          filterData={filterData}
          setFilterData={setFilterData}
          isValidating={isValidating}
          setIsOpenPreview={setIsOpenPreview}
          setSelectedItem={setSelectedItem}
          lastColumnAction={true}
          onRowClick={(row: any) => {
            setSelectedItem(row)
            setIsOpenMenu(true)
          }}
        />
      </div>

      {/* Add Surat masuk */}
      <DialogAddSuratMasuk
        data={selectedItem}
        isOpenFormAdd={isOpenFormAdd}
        setIsOpenFormAdd={setIsOpenFormAdd}
        mutate={mutate}
      />

      {/* Preview */}
      <DialogPreviewSuratMasuk
        isOpenPreview={isOpenPreview}
        setIsOpenPreview={setIsOpenPreview}
        selectedItem={selectedItem}
      />

      {/* Menu Surat */}
      <DialogMenuSuratMasuk
        mutate={mutate}
        isOpenMenu={isOpenMenu}
        setIsOpenMenu={setIsOpenMenu}
        selectedItem={selectedItem}
        setIsOpenFormAdd={setIsOpenFormAdd}
      />
    </>
  )
}

SuratMasukPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default SuratMasukPage