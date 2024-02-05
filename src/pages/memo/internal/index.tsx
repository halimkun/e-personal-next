import useSWR from "swr";
import Link from "next/link";
import dynamic from "next/dynamic";

import { getSession } from "next-auth/react";
import { NextPageWithLayout } from "@/pages/_app";
import { IconCirclePlus } from "@tabler/icons-react";
import { buttonVariants } from "@/components/ui/button";
import { ReactElement, useEffect, useRef, useState } from "react";

const Loading1 = dynamic(() => import('@/components/custom/icon-loading'), { ssr: false })
const TablesMemoInternal = dynamic(() => import('@/components/custom/tables/memo-internal'), { ssr: false })
const AppLayout = dynamic(() => import('@/components/layouts/app'), { ssr: false });

const MemoInternalPage: NextPageWithLayout = () => {
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

  const { data, error, mutate, isLoading, isValidating } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/berkas/memo/internal`, fetcher, {
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
      <div className="w-full flex items-center justify-end">
        <Link href="/memo/internal/create" className={buttonVariants({
          variant: 'default',
          size: 'sm',
          className: 'flex items-center',
        })}>
          <IconCirclePlus size={20} strokeWidth={2} className="mr-1" />
          Tambah
        </Link>
      </div>

      <TablesMemoInternal
        data={data}
        filterData={filterData}
        setFilterData={setFilterData}
        isValidating={isValidating}
      />
    </>
  )
}

MemoInternalPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default MemoInternalPage;