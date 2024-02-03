import AppLayout from "@/components/layouts/app";
import dynamic from "next/dynamic";

import { NextPageWithLayout } from "@/pages/_app";
import { ReactElement, useState } from "react";
import { getSession } from "next-auth/react";
import useSWR from "swr";

const FormAddMemoInternal = dynamic(() => import('@/components/custom/forms/add-memo-internal'), { ssr: false })

const MemoInternalPage: NextPageWithLayout = () => {
  const [penanggungJawab, setPenanggungJawab] = useState<any>([])

  const fetchPegawai = async (url: string) => {
    const session = await getSession()
    return await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.rsiap?.access_token}`,
      },
    }).then(response => {
      if (!response.ok) {
        throw Error(response.status + ' ' + response.statusText)
      }

      const data = response.json()
      const result = data.then((res) => {
        const data = res.data.map((item: any) => {
          return {
            value: item.nik,
            label: item.nama
          }
        })

        setPenanggungJawab(data)
      })

      return data
    })
  }

  const { data, error } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/pegawai?datatables=1&with=bidang_detail&select=nik,nama`, fetchPegawai);
  
  return (
    <FormAddMemoInternal 
      pj={penanggungJawab}
    />
  )
}

MemoInternalPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default MemoInternalPage