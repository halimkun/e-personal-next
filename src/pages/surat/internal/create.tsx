import FormAddSuratInternal from "@/components/custom/forms/add-surat-internal";
import AppLayout from "@/components/layouts/app";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { NextPageWithLayout } from "@/pages/_app"
import { IconArrowLeft } from "@tabler/icons-react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ReactElement } from "react";

const SuratInternal: NextPageWithLayout = ({ penanggungJawab }: any) => {
  const route = useRouter();

  return (
    <Card className="max-w-screen">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="outline" size='icon' onClick={() => route.push('/surat/internal')}>
            <IconArrowLeft className="rotate-0 scale-100 transition-all" />
          </Button>
          <div className="flex flex-col gap-0.5">
            <CardTitle>Buat Surat Internal Baru</CardTitle>
            <CardDescription>Buat surat internal baru | <strong>RSIA Aisyiyah Pekajangan</strong></CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <FormAddSuratInternal penanggungJawab={penanggungJawab} />
      </CardContent>
    </Card>
  )
}

export async function getServerSideProps(context: any) {
  const session = await getSession({ req: context.req })
  const res = await fetch('https://sim.rsiaaisyiyah.com/rsiap-api-dev/api/pegawai?datatables=1&with=bidang_detail&select=nik,nama', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.rsiap?.access_token}`,
    },
  }).then(response => response.json())


  const data = res.data.map((item: any) => {
    return {
      value: item.nik,
      label: item.nama
    }
  })

  return {
    props: {
      penanggungJawab: data
    }
  }
}

SuratInternal.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default SuratInternal;