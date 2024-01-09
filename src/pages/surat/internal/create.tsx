import FormAddSuratInternal from "@/components/custom/forms/add-surat-internal";
import AppLayout from "@/components/layouts/app";
import { NextPageWithLayout } from "@/pages/_app"
import { IconLoader } from "@tabler/icons-react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ReactElement, useState } from "react";
import useSWR from "swr";

const SuratInternal: NextPageWithLayout = () => {
  const route = useRouter();
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

  if (error) return <div>Error {error.message}</div>
  if (!data) return (
    <div className="flex flex-col items-start justify-center h-full gap-4">
      <IconLoader className="animate-spin w-7 h-7" />
    </div>
  )

  return (
    <div className="flex flex-col lg:flex-row gap-3 items-start">
      <FormAddSuratInternal penanggungJawab={penanggungJawab} />
    </div>
  )
}

SuratInternal.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default SuratInternal;