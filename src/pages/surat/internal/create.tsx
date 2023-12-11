import FormAddSuratInternal from "@/components/custom/forms/add-surat-internal";
import AppLayout from "@/components/layouts/app";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { NextPageWithLayout } from "@/pages/_app"
import { IconArrowLeft, IconLoader } from "@tabler/icons-react";
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

  const { data, error } = useSWR('https://sim.rsiaaisyiyah.com/rsiap-api/api/pegawai?datatables=1&with=bidang_detail&select=nik,nama', fetchPegawai);

  if (error) return <div>Error {error.message}</div>
  if (!data) return (
    <div className="flex flex-col items-start justify-center h-full gap-4">
      <IconLoader className="animate-spin w-7 h-7" />
    </div>
  )

  return (
    <div className="flex flex-col lg:flex-row gap-3 items-start">
      <Card className="max-w-screen">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="outline" size='icon' onClick={() => route.push('/surat/internal')}>
              <IconArrowLeft className="rotate-0 scale-100 transition-all" />
            </Button>
            <div className="flex flex-col gap-0.5">
              <CardTitle className="text-primary">Buat Surat Internal Baru</CardTitle>
              <CardDescription>Buat surat internal baru | <strong>RSIA Aisyiyah Pekajangan</strong></CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <FormAddSuratInternal penanggungJawab={penanggungJawab} />
        </CardContent>
      </Card>

      <Card className="max-w-sm sticky top-[4.5rem]">
        <CardHeader>
          <CardTitle className="text-primary">Catatan</CardTitle>
          <CardDescription>Harap mengisi data dengan benar dan teliti.</CardDescription>
        </CardHeader>
        <CardContent>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos minima eveniet officia vel odit tempore similique aperiam incidunt, assumenda quas modi sunt ad vitae nulla quo porro commodi iure voluptatem.
        </CardContent>
      </Card>
    </div>
  )
}

SuratInternal.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default SuratInternal;