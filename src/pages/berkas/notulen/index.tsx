import useSWR from "swr";
import Link from "next/link";
import dynamic from "next/dynamic";
import fetcherGet from "@/utils/fetcherGet";

import { NextPageWithLayout } from "@/pages/_app";
import { ReactElement, useEffect, useRef, useState } from "react";

const Loading1 = dynamic(() => import('@/components/custom/icon-loading'), { ssr: false })
const TableNotulen = dynamic(() => import('@/components/custom/tables/notulen'), { ssr: false })
const AppLayout = dynamic(() => import('@/components/layouts/app'), { ssr: false });

const NotulenPage: NextPageWithLayout = () => {
  const delayDebounceFn = useRef<any>(null)
  const [filterData, setFilterData] = useState({})
  const [filterQuery, setFilterQuery] = useState('')

  const fetcher = (url: string) => fetcherGet({ url, filterQuery })

  const { data, error, mutate, isLoading, isValidating } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/undangan`, fetcher, {
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
      <div className="w-full flex items-center justify-between">
        <div className="px-2 border-l-4 border-primary bg-gray-100 dark:bg-gray-900 rounded-r">
          <h4 className="text-xl font-semibold text-primary">
            Data Undangan & Notulen
          </h4>
        </div>
        {/* <Link href="/memo/internal/create" className={buttonVariants({
          variant: 'default',
          size: 'sm',
          className: 'flex items-center',
        })}>
          <IconCirclePlus size={20} strokeWidth={2} className="mr-1" />
          Tambah
        </Link> */}
      </div>

      <TableNotulen
        data={data}
        filterData={filterData}
        setFilterData={setFilterData}
        isValidating={isValidating}
        mutate={mutate}
      />
    </>
  )
}

NotulenPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default NotulenPage;