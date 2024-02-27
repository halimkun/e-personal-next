import React, { ReactElement, useEffect, useState } from "react"

import useSWR from "swr"
import dynamic from "next/dynamic"
import fetcherGet from "@/utils/fetcherGet"

import { useRouter } from "next/router"
import { useDebounce } from 'use-debounce';
import { IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { NextPageWithLayout } from "@/pages/_app"
import { CardDescription, CardTitle } from "@/components/ui/card"

const AppLayout = dynamic(() => import('@/components/layouts/app'), { ssr: false })
const Loading1 = dynamic(() => import('@/components/custom/icon-loading'), { ssr: false })
const TableSuratMasuk = dynamic(() => import('@/components/custom/tables/surat-masuk'), { ssr: false })
const DialogMenuSuratMasuk = dynamic(() => import('@/components/custom/modals/dialog-menu-surat-masuk'), { ssr: false })
const DialogPreviewSuratMasuk = dynamic(() => import('@/components/custom/modals/dialog-preview-surat-masuk'), { ssr: false })

const SuratMasukPage: NextPageWithLayout = () => {
  const router = useRouter()

  const [fltrData, setFltrData] = useState({})
  const [filterQuery, setFilterQuery] = useState('')
  const [debouncedFilterQuery] = useDebounce(filterQuery, 1000)

  const [isOpenMenu, setIsOpenMenu] = useState(false)
  const [isOpenPreview, setIsOpenPreview] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>({})

  const fetcher = (url: string) => fetcherGet({ url, filterQuery })
  const { data, error, mutate, isLoading, isValidating } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/surat/masuk`, fetcher, {
    refreshWhenHidden: true,
    revalidateOnFocus: false,
    refreshWhenOffline: false,
    revalidateIfStale: true,
  })

  useEffect(() => {
    const count = Object.keys(fltrData).length

    if (count > 0) {
      let fq = '';
      for (const [key, value] of Object.entries(fltrData)) {
        if (value) {
          fq += fq === '' ? `?${key}=${value}` : `&${key}=${value}`;
        }
      }
      setFilterQuery(fq);
    }
  }, [fltrData]);

  useEffect(() => {
    mutate()
  }, [debouncedFilterQuery, mutate]);

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

        {data && (
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
        )}
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