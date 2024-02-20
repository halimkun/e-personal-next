import AppLayout from "@/components/layouts/app";
import { ReactElement, useState } from "react";
import { useRouter } from "next/router";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { IconArrowLeft } from "@tabler/icons-react";
import { Label } from "@/components/ui/label";
import { getSession } from "next-auth/react";
import { getFullDateWithDayName } from "@/lib/date";
import FormAddNotulen from "@/components/custom/forms/add-notulen";

const BuatNotulenPage = (props: any) => {

  const { nomor, data } = props;
  const router = useRouter();

  const [surat, setSurat] = useState(data.success ? data.data : null);

  return (
    <div className="flex flex-col gap-3">
      <Card>
        <CardHeader className="p-3">
          <div className="flex items-center gap-4">
            <Button type="button" variant="outline" size='icon' onClick={() => router.back()}>
              <IconArrowLeft className="rotate-0 scale-100 transition-all" />
            </Button>
            <div className="flex flex-col gap-0.5">
              <CardTitle className="text-primary">Buat Notulen Baru</CardTitle>
              <CardDescription>Buat notulen kegiatan | <strong>RSIA Aisyiyah Pekajangan</strong></CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="flex flex-col-reverse md:flex-row items-start gap-3">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Form Entry Notulen</CardTitle>
            <CardDescription>Untuk membuat notulen, silahkan isi form berikut ini</CardDescription>
          </CardHeader>
          <CardContent>
            <FormAddNotulen 
              nomor={nomor}
            />
          </CardContent>
        </Card>

        <Card className="w-full md:w-[50%] bg-secondary">
          <CardHeader>
            <CardTitle>Informasi Kegiatan</CardTitle>
            <CardDescription>Berikut ini adalah informasi kegiatan yang akan dibuat notulen</CardDescription>
          </CardHeader>
          <CardContent>
            {data?.success ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-start gap-1">
                  <Label htmlFor="no_surat" className="text-primary">No. Surat</Label>
                  {nomor}
                </div>
                <div className="flex flex-col items-start gap-1">
                  <Label htmlFor="perihal" className="text-primary">Perihal</Label>
                  <p className="p-0 m-0">{surat.perihal}</p>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <Label htmlFor="pj" className="text-primary">Penanggung Jawab</Label>
                  <p className="p-0 m-0">{surat.pj_detail.nama}</p>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <Label htmlFor="pj" className="text-primary">Waktu Kegiatan</Label>
                  <p className="p-0 m-0">{getFullDateWithDayName(surat.tanggal)}</p>
                </div>
              </div>
            ) : (
              <p>Notulen tidak ditemukan</p>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export async function getServerSideProps(context: any) {
  // get nomor from url 
  const { nomor } = context.query;
  const session = await getSession(context);

  const nomorSurat = nomor.replaceAll('--', '/');

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/surat/internal/detail/simple?nomor=${nomorSurat}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.rsiap?.access_token}`,
    },
  }).then(res => res.json())

  return {
    props: {
      data: response,
      nomor: nomorSurat
    }
  }
}

BuatNotulenPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AppLayout>{page}</AppLayout>
  )
}

export default BuatNotulenPage;