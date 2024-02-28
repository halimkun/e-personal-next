import { NextPageWithLayout } from "@/pages/_app"
import { ReactElement, useEffect, useState } from "react"

import { useDebounce } from "use-debounce";
import { IconCirclePlus } from "@tabler/icons-react";
import { buttonVariants } from "@/components/ui/button";
import { getSession } from "next-auth/react";

import useSWR from "swr";
import Link from "next/link";
import dynamic from "next/dynamic"
import toast from "react-hot-toast";
import fetcherGet from "@/utils/fetcherGet";
import TablePPI from "@/components/custom/tables/ppi";

const AppLayout = dynamic(() => import('@/components/layouts/app'), { ssr: false });
const Loading1 = dynamic(() => import('@/components/custom/icon-loading'), { ssr: false });

const BerkasRadiologiPage: NextPageWithLayout = () => {
  const [filterData, setFilterData] = useState({})
  const [filterQuery, setFilterQuery] = useState('')
  const [debouncedFilterQuery] = useDebounce(filterQuery, 1000)

  const fetcher = (url: string) => fetcherGet({ url, filterQuery })
  const { data, error, mutate, isLoading, isValidating } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/berkas/radiologi`, fetcher, {
    refreshWhenHidden: true,
    revalidateOnFocus: false,
    refreshWhenOffline: false,
    revalidateIfStale: false,
  })

  useEffect(() => {
    const count = Object.keys(filterData).length

    if (count > 0) {
      let fq = '';
      for (const [key, value] of Object.entries(filterData)) {
        if (value) {
          fq += fq === '' ? `?${key}=${value}` : `&${key}=${value}`;
        }
      }
      setFilterQuery(fq);
    }
  }, [filterData]);

  useEffect(() => {
    mutate()
  }, [debouncedFilterQuery, mutate]);

  const onDelete = async (e: any) => {
    const con = confirm('apakah anda yakin akan menghapus data dengan perihal -- ' + e.perihal + '?')
    if (!con) return

    const session = await getSession();
    toast.promise(
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/berkas/radiologi/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.rsiap?.access_token}`,
        },
        body: JSON.stringify({
          nomor: e.nomor,
          tgl_terbit: e.tgl_terbit,
        })
      }).catch(err => {
        throw new Error(err)
      }).then(async (res) => {
        await new Promise((resolve) => setTimeout(resolve, 1500)); // <---- fake loading
        if (res?.ok) {
          return res?.status;
        } else {
          throw new Error("Gagal menyimpan data")
        }
      }),
      {
        loading: 'Menghapus...',
        success: (res) => {
          mutate()
          return 'Berhasil menghapus data'
        },
        error: (err) => {
          return err?.message || 'Gagal menghapus data'
        }
      }
    )
  }

  if (isLoading) return <Loading1 height={50} width={50} />
  if (error) return <div>{error.message}</div>
  if (!data) return <div>No data</div>

  return (
    <div>
      <div className="w-full flex items-center justify-between">
        <div className="px-2 border-l-4 border-primary bg-gray-100 dark:bg-gray-900">
          <h4 className="text-xl font-semibold text-primary">
            Berkas / Dokumen Radiologi
          </h4>
        </div>
        <Link href="/berkas/radiologi/new" className={buttonVariants({
          variant: 'default',
          size: 'sm',
          className: 'flex items-center',
        })}>
          <IconCirclePlus size={20} strokeWidth={2} className="mr-1" />
          Tambah
        </Link>
      </div>

      <TablePPI
        data={data}
        filterData={filterData}
        mutate={mutate}
        setFilterData={setFilterData}
        isValidating={isValidating}
        onDelete={onDelete}
      />
    </div>
  )
}

BerkasRadiologiPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default BerkasRadiologiPage