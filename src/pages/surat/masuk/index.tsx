import React, { ReactElement, useEffect, useRef, useState } from "react"

import useSWR from "swr"
import dynamic from "next/dynamic"
import fetcherGet from "@/utils/fetcherGet"
import AppLayout from "@/components/layouts/app"

import { useRouter } from "next/router"
import { IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { NextPageWithLayout } from "@/pages/_app"
import { CardDescription, CardTitle } from "@/components/ui/card"

const DialogPreviewSuratMasuk = dynamic(() => import('@/components/custom/modals/dialog-preview-surat-masuk'), { ssr: false })
const DialogMenuSuratMasuk = dynamic(() => import('@/components/custom/modals/dialog-menu-surat-masuk'), { ssr: false })
const TableSuratMasuk = dynamic(() => import('@/components/custom/tables/surat-masuk'), { ssr: false })
const Loading1 = dynamic(() => import('@/components/custom/icon-loading'), { ssr: false })  

const SuratMasukPage: NextPageWithLayout = () => {
  const router = useRouter()

  const [selectedItem, setSelectedItem] = useState<any>({})
  const [isOpenPreview, setIsOpenPreview] = useState(false)
  const [isOpenMenu, setIsOpenMenu] = useState(false)

  const delayDebounceFn = useRef<any>(null)
  const [fltrData, setFltrData] = useState({})
  const [filterQuery, setFilterQuery] = useState('')

  const fetcher = (url: string) => fetcherGet({ url, filterQuery })

  const { data, error, mutate, isLoading, isValidating } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/surat/masuk`, fetcher, {
    revalidateOnFocus: false,
    refreshWhenOffline: false,
    refreshWhenHidden: true,
  })

  useEffect(() => {
    let fq = ''
    for (const [key, value] of Object.entries(fltrData)) {
      if (value) {
        fq += fq === '' ? `?${key}=${value}` : `&${key}=${value}`
      }
    }

    setFilterQuery(fq)
  }, [fltrData])

  useEffect(() => {
    if (delayDebounceFn.current) {
      clearTimeout(delayDebounceFn.current);
    }

    delayDebounceFn.current = setTimeout(async () => {
      await mutate();
    }, 800);

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
          <Button size={'icon'} className="w-7 h-7" onClick={() => router.push('/surat/masuk/create')}>
            <IconPlus className="w-5 h-5" />
          </Button>
        </div>

        <TableSuratMasuk
          data={data}
          filterData={fltrData}
          setFilterData={setFltrData}
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